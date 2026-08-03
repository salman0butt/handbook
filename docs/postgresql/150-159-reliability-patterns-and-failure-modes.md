---
id: 150-159-reliability-patterns-and-failure-modes
title: "150–159 — Outbox, Idempotency, Data Access Design, Anti-Patterns & Failure Modes"
---

# 150 — Outbox Pattern

A database transaction cannot atomically commit to PostgreSQL and a separate message broker with ordinary local transactions. The outbox pattern stores the business change and an event-to-publish in the **same PostgreSQL transaction**.

```text
BEGIN
├─ update order
└─ insert outbox event
COMMIT
      ↓
publisher reads outbox
      ↓
broker
```

```sql
INSERT INTO outbox_events (id, topic, aggregate_id, payload, created_at)
VALUES (uuidv7(), 'order.paid', $order_id, $payload, now());
```

A publisher can claim rows with locks/leases, publish, and mark processed. Broker publish acknowledgements can be lost, so duplicates are expected. Consumers must be idempotent.

Clean up/partition old outbox rows and monitor oldest unpublished age, backlog, retry count, and publisher health.

---

# 151 — Idempotency

Idempotency makes a repeated request produce one logical effect.

Schema:

```sql
CREATE TABLE idempotency_keys (
  scope text NOT NULL,
  key text NOT NULL,
  request_hash text NOT NULL,
  status text NOT NULL,
  response jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (scope, key)
);
```

Use a unique key scoped to the operation/tenant. Store the key and business effect in one transaction. If the same key arrives with a different request payload, reject rather than silently returning an unrelated old result.

Payments, webhooks, jobs, and API retries all benefit. Idempotency is not “ignore every duplicate forever”; define retention and semantic scope.

---

# 152 — Database API Design

Application data access should make domain boundaries and transaction ownership visible.

Useful patterns:

- repository focused on one aggregate/domain, not generic CRUD for every table;
- data mapper translating rows to domain shapes;
- query service for read-heavy projections;
- explicit unit-of-work/transaction callback;
- typed query modules owning SQL.

A generic `Repository<T>` with `findAll/create/update/delete` can erase SQL's strengths, hide transaction boundaries, encourage loading too much data, and make optimized joins/projections awkward.

Data ownership is more important than abstraction count: one domain should own writes to its tables/API contract.

---

# 153 — Transaction Boundary Design

Put the transaction around the business use case that must be atomic:

```text
HTTP request
   ↓
application use case
   ↓ BEGIN
repo A → repo B → invariant check → outbox row
   ↓ COMMIT
```

Do not put `BEGIN` inside each repository when the use case spans repositories; that produces multiple independent transactions.

Avoid waiting for external HTTP/email/broker calls while holding database locks. Write local state + outbox, commit, perform external work asynchronously or use a carefully idempotent orchestration.

Retry whole transactions for serialization/deadlock conflicts. Keep request-scoped transactions bounded with deadlines.

---

# 154 — Database Error Handling

Applications should classify PostgreSQL errors by **SQLSTATE**, not parse English messages.

Important classes/examples:

- unique violation `23505`;
- foreign key violation `23503`;
- check violation `23514`;
- not-null violation `23502`;
- serialization failure `40001`;
- deadlock detected `40P01`;
- query canceled/timeout-related states;
- connection exceptions (`08xxx`).

Map deterministic constraint errors to domain outcomes, retry transient transaction conflicts, surface operator/infrastructure failures appropriately, and never retry every database error blindly.

Constraint names can become part of an application error mapping contract; name critical constraints intentionally.

---

# 155 — SQL Style and Readability

Optimize SQL for reviewability:

```sql
SELECT
  o.id,
  o.created_at,
  c.email,
  sum(oi.quantity * oi.unit_price) AS subtotal
FROM orders AS o
JOIN customers AS c
  ON c.id = o.customer_id
JOIN order_items AS oi
  ON oi.order_id = o.id
WHERE o.status = 'paid'
GROUP BY o.id, o.created_at, c.email
ORDER BY o.created_at DESC, o.id DESC;
```

Principles:

- explicit columns in stable APIs instead of `SELECT *`;
- short meaningful aliases;
- one logical join/predicate per line;
- CTEs/derived tables when they clarify stages, not as decoration;
- comments for **why/trade-off**, not obvious syntax;
- consistent capitalization/formatting enforced by team tooling if desired;
- avoid deeply nested clever SQL when a named relational stage is easier to verify.

---

# 156 — Database Naming

Choose a convention and keep it consistent. Common PostgreSQL style uses lower `snake_case`, avoids quoted mixed-case identifiers, and names constraints/indexes predictably.

Example:

```text
orders
order_items
orders_pkey
orders_customer_id_idx
orders_total_nonnegative_chk
orders_customer_id_fkey
```

Singular vs plural table names is a team convention, not a database law. Avoid reserved/ambiguous names and meaningless abbreviations. Names should survive incident response: `idx1` tells an operator nothing.

---

# 157 — SQL Anti-Patterns

Common anti-patterns and the actual issue:

- `SELECT *` in stable API paths → unnecessary transfer/schema coupling;
- missing `WHERE` in DML → accidental whole-table change;
- function/cast mismatch on indexed expression → unusable access path;
- unnecessary `DISTINCT` → hides join grain problems and adds work;
- N+1 → round-trip/query amplification;
- huge OFFSET → scans/skips growing prefixes;
- giant generated `IN` lists → planning/network complexity; arrays/temp/staging table may be better;
- raw dynamic SQL → injection risk;
- comma-separated lists/EAV abuse → lost typing/FKs/query clarity;
- JSONB for every attribute → weak invariants/statistics;
- over-indexing → write/WAL/HOT/storage cost;
- under-indexing → excess scans/sorts/locks;
- application-only referential integrity → races/multiple-writer drift;
- long/idle transactions → locks + vacuum horizon;
- unnecessary triggers → hidden behavior;
- using database queue for every integration → wrong tool boundaries.

No item is forbidden by syntax; each is a default warning requiring explicit justification.

---

# 158 — Database Design Anti-Patterns

- **god table:** unrelated concepts/lifecycles accumulated into one wide relation;
- **EAV everywhere:** entity/attribute/value rows replace typed columns and constraints;
- **polymorphic ID without enforcement:** references can silently dangle;
- **lists in text:** no element typing/FK/query semantics;
- **fake enum strings:** unrestricted state names where stable domain exists;
- **duplicate sources of truth:** two columns/tables claim current truth without reconciliation contract;
- **missing PKs:** rows difficult to identify/update/replicate safely;
- **mutable natural identifiers as all FKs:** business renames fan through data model;
- **metadata JSON dump:** stable facts buried in unvalidated JSON;
- **premature sharding:** distributed complexity before local scaling is exhausted.

Design review should ask which invariant each structure makes easy or impossible to enforce.

---

# 159 — PostgreSQL Failure Modes

## Connection exhaustion

**Symptoms:** connection errors, pool queues, high backend count. **Diagnose:** `pg_stat_activity`, pools, autoscaling. **Mitigate:** admission/pooling, terminate clearly abandoned sessions safely, restore headroom. **Prevent:** bounded pools/reserved admin capacity.

## Lock pileup / deadlock storm

**Symptoms:** latency spikes, wait events, blocked PIDs/deadlocks. **Diagnose:** blocker tree + transaction age. **Mitigate:** stop root long transaction/deploy when safe. **Prevent:** short transactions, lock order, migration timeouts/indexes.

## Disk full / WAL explosion

**Symptoms:** storage alerts, write/archive failures. **Diagnose:** relation sizes, `pg_wal`, slots, archive health, temp/logs. **Mitigate:** add capacity/stop source using supported operations. **Prevent:** retention/slot/archive monitoring and growth forecasts.

## Replica lag

**Symptoms:** stale reads/failover RPO risk. **Diagnose:** send/write/flush/replay LSNs, network, standby I/O, long queries/conflicts. **Mitigate:** reduce source load/fix standby bottleneck/route reads appropriately. **Prevent:** lag budgets/capacity/testing.

## Autovacuum falling behind / wraparound risk

**Symptoms:** dead tuples/bloat, old XID ages, anti-wraparound activity. **Diagnose:** table stats, transaction age, vacuum progress/config. **Mitigate:** remove old blockers, increase/tune maintenance safely. **Prevent:** per-table tuning and age alerts.

## Bad migration

**Symptoms:** blocked app queries, rewrite/WAL spike, errors. **Diagnose:** lock graph, migration statement/progress, plan. **Mitigate:** cancel/rollback only with known effects, forward fix/restore if needed. **Prevent:** production-like validation, lock/statement timeouts, expand/contract.

## Accidental DELETE/DROP

Immediate priority is contain further writes and choose recovery from transaction rollback (if still open), replica/snapshot, backup/PITR, or logical reconstruction based on incident state. Never promise that MVCC dead rows are a recovery strategy.

## Memory exhaustion

Inspect concurrent sorts/hashes, parallelism, connection count, maintenance, shared memory and OS pressure. Prevent with concurrency-aware memory settings, pools, query limits and load testing.

For every incident capture: symptom → metrics → timeline → root cause → mitigation → recovery validation → preventive controls.