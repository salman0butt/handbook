---
id: 139-149-cloud-distributed-caching-and-history
title: 139–149 — Cloud, Distributed Systems, Caching, Queues, Audit & History
---

# 139 — Cloud PostgreSQL

Three broad operating models:

- **self-managed:** team owns OS/storage/PostgreSQL configuration, backup, HA, upgrades;
- **managed PostgreSQL:** provider operates much of infrastructure/backup/replication while exposing PostgreSQL with platform constraints;
- **serverless PostgreSQL:** capacity/compute may scale dynamically with provider-specific connection/storage architecture.

Examples include AWS RDS/Aurora PostgreSQL-compatible services, Google Cloud SQL, Azure Database for PostgreSQL, Supabase, Neon, Railway, and Render. Product capabilities change; architecture principles remain: SQL semantics, transactions, indexes, pooling, backup/RPO/RTO, security, migrations, observability, and portability boundaries.

Check provider restrictions on superuser privileges, extensions, parameters, replication, maintenance windows, versions, backups/PITR, network/TLS, failover, storage scaling, and egress.

---

# 140 — Serverless PostgreSQL

Serverless designs often separate or elastically scale compute and storage, creating new operational trade-offs:

- connection scaling and proxy/pooling;
- compute cold/warm behavior;
- autoscaling lag;
- transaction/session affinity;
- prepared/session state assumptions;
- latency variance;
- cost per compute/storage/I/O;
- read replicas/branches depending on provider.

A function-as-a-service request should not necessarily create a fresh direct PostgreSQL connection per invocation. Use provider-supported pools/proxies and bounded database concurrency.

---

# 141 — Distributed Database Concepts

Ordinary PostgreSQL on one primary is not automatically a distributed database. Distribution appears when state/consensus/failover/routing spans nodes.

Concepts:

```text
leader/primary → followers/standbys
partition/shard → subset of data on a node/group
replication     → copies of state
consensus       → agreement among participants
network partition → nodes cannot reliably communicate
```

Replication can improve availability/read scale but introduces lag/failover consistency questions. Sharding adds routing/rebalancing/distributed transactions.

---

# 142 — CAP Theorem

CAP is about distributed systems **during a network partition**. If nodes cannot communicate, a system cannot simultaneously guarantee both:

- every operation observes a single consistent state (in the model's sense), and
- every request receives a successful response from every partitioned side.

“Pick any two of consistency, availability, partition tolerance” is misleading because a distributed deployment cannot choose to make network partitions impossible. The meaningful design question is how the system behaves when communication is partitioned.

A PostgreSQL primary/standby HA system may prefer a single writable leader (consistency/fencing) and make a partitioned old primary unavailable, rather than permit two independent writers.

---

# 143 — Consistency Models

Terms:

- **strong/linearizable-like experience:** reads observe a suitably current single order under the service model;
- **eventual consistency:** replicas converge if updates stop;
- **read-your-writes:** a client sees its prior accepted write;
- **monotonic reads:** a client does not move backward to older observed state;
- **stale read:** result lags current primary state.

Asynchronous PostgreSQL read replicas can return stale data. After a checkout update, immediately routing the user to a lagging replica can violate read-your-writes UX.

Strategies: read critical follow-up from primary, wait on replication positions, use session routing/stickiness, or accept/document staleness.

---

# 144 — Database Caching

Different caches solve different layers:

```text
CDN → HTTP/content edge
application cache / Redis → derived/keyed application data
PostgreSQL shared buffers → DB pages
OS cache → filesystem pages
```

Cache-aside:

```text
read cache
 miss ↓
read database → populate cache
```

Hard parts: invalidation, stale data, stampedes, key versioning, tenant boundaries, serialization, failure behavior, and memory cost.

Use caching after understanding query/index cost. A cache should not conceal an unbounded N+1 path or missing invariant.

---

# 145 — PostgreSQL Queue Pattern

A relational queue can be excellent when jobs and business state need one transaction.

```sql
SELECT id
FROM jobs
WHERE status = 'ready'
  AND run_at <= now()
ORDER BY priority DESC, run_at, id
FOR UPDATE SKIP LOCKED
LIMIT 20;
```

Claim/update in the same transaction. Add attempt count, lease/heartbeat or lock ownership model, retry schedule, dead-letter/final failure state, idempotency key, and cleanup/partition strategy.

Risks: queue table/index churn, starvation from ordering, long jobs held in transactions, vacuum pressure, and treating PostgreSQL as a universal event broker.

Kafka, RabbitMQ, SQS and similar systems are better when very high fan-out/stream retention/protocol routing/cross-service decoupling or broker-native semantics dominate.

---

# 146 — Auditing

Audit requirements should define **who**, **what**, **when**, **before/after**, **reason/request**, retention, immutability expectations, access, privacy, and evidence quality.

Options:

- application audit table written in same transaction;
- triggers for database-local change capture;
- PostgreSQL logs for statement/session/security evidence;
- approved audit extensions;
- external immutable log/event pipelines.

An audit table is not automatically immutable if normal application roles can update/delete it. Separate privileges and retention controls.

Avoid logging sensitive data that policy says should not be retained.

---

# 147 — Soft Delete

Typical pattern:

```sql
deleted_at timestamptz NULL
```

Queries must consistently filter active rows. Partial indexes can enforce active-only uniqueness:

```sql
CREATE UNIQUE INDEX users_active_email_key
ON users (lower(email))
WHERE deleted_at IS NULL;
```

Trade-offs: FK behavior, uniqueness, accidental resurrection, table growth, indexes, privacy erasure obligations, analytics semantics, and every query's default scope.

Soft delete is inappropriate when legal/privacy policy requires actual deletion or when history belongs in an explicit audit/event/archive model.

---

# 148 — Temporal / Historical Data Modelling

Historical questions differ:

- **valid/effective time:** when fact is true in business reality;
- **system/audit time:** when database learned/stored version;
- immutable event history;
- slowly changing snapshots;
- versioned current-state rows.

PostgreSQL ranges fit effective periods:

```sql
valid_during tstzrange NOT NULL
```

An exclusion constraint can prevent overlapping versions for one entity. Keep current-state lookup fast while preserving history via explicit design rather than overwriting fields and hoping logs survive.

---

# 149 — Event Sourcing vs Relational State

Current-state relational model:

```text
order row = current status/amount/customer
```

Event sourcing:

```text
OrderCreated → ItemAdded → PaymentCaptured → OrderShipped
      ↓ replay
projection/current state
```

Event sourcing provides an append-only domain history and derived projections, but introduces event schema evolution, replay cost, ordering/idempotency, projection rebuilds, debugging, storage, and operational complexity.

Ordinary relational state plus targeted audit/history is often better for CRUD/business systems. Use event sourcing when the event log itself is a core domain requirement, not as an automatic “scalable architecture” upgrade.