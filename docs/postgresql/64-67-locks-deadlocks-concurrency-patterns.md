---
id: 64-67-locks-deadlocks-concurrency-patterns
title: "64–67 — Locking, Deadlocks, Serializable & Concurrency Patterns"
---

# 64 — Locking

MVCC reduces reader/writer blocking, but PostgreSQL still uses locks to coordinate schema changes and conflicting data changes.

## Table locks

PostgreSQL has multiple table lock modes from weak `ACCESS SHARE` through `ACCESS EXCLUSIVE`. Commands acquire modes automatically; explicit `LOCK TABLE` is occasionally useful but often a sign that a smaller invariant-specific mechanism should be considered.

`ALTER TABLE` operations frequently need stronger locks than normal DML, which is why migration design matters.

## Row locks

```sql
SELECT * FROM accounts
WHERE id = $1
FOR UPDATE;
```

Row lock strengths:

- `FOR UPDATE`
- `FOR NO KEY UPDATE`
- `FOR SHARE`
- `FOR KEY SHARE`

Different update types and foreign-key checks interact with these modes. Use the weakest mode that correctly protects the operation rather than reflexively locking everything `FOR UPDATE`.

## NOWAIT and SKIP LOCKED

```sql
SELECT id
FROM jobs
WHERE status = 'ready'
ORDER BY run_at, id
FOR UPDATE SKIP LOCKED
LIMIT 10;
```

`NOWAIT` fails rather than waiting. `SKIP LOCKED` skips rows locked by others; excellent for worker queues, but it produces an intentionally inconsistent view and is inappropriate for ordinary business queries requiring complete results.

## Advisory locks

PostgreSQL advisory locks associate application-defined integer keys with locks not tied to a row. They are useful for coarse coordination such as “one reconciler per tenant,” but PostgreSQL cannot infer whether the key truly protects the resource. Design deterministic key mapping, session-vs-transaction scope, cleanup, and deadlock order.

---

# 65 — Deadlocks

```text
T1 holds row A → waits for B
T2 holds row B → waits for A
```

Neither can progress. PostgreSQL detects the cycle and aborts one transaction with a deadlock error so the other can proceed.

## Preventing deadlocks

- acquire resources in a consistent global order;
- keep transactions short;
- update rows in deterministic order;
- avoid external network calls while locks are held;
- index foreign keys and predicates to avoid unnecessarily broad/long work;
- retry the whole failed transaction.

Example transfer lock order:

```sql
SELECT id, balance
FROM accounts
WHERE id IN ($from, $to)
ORDER BY id
FOR UPDATE;
```

Every transfer locks smaller ID first, reducing cycles.

Do not “fix” deadlocks by infinite retries; recurring deadlocks reveal a lock-order/workflow problem.

---

# 66 — Serializable Transactions

At `SERIALIZABLE`, PostgreSQL uses SSI and predicate-conflict tracking to provide serializable outcomes without simply locking every predicate range like a traditional strict two-phase-locking design.

```sql
BEGIN ISOLATION LEVEL SERIALIZABLE;
-- read invariant
-- make dependent writes
COMMIT;
```

A transaction may receive SQLSTATE `40001` serialization failure even though no row-level error exists. That failure is part of the concurrency protocol: PostgreSQL found a dependency pattern that could violate serial execution semantics.

## Retry shape

```text
begin transaction
   ↓
read → decide → write
   ↓
COMMIT succeeds? ── yes → done
   │
   no, serialization failure
   ↓
rollback → bounded retry of entire unit
```

Do not retry only the last statement; earlier reads formed the decision. Keep external irreversible side effects outside the transaction or use idempotency/outbox patterns.

---

# 67 — Concurrency Patterns

## Account transfer

Lock both account rows in deterministic order, validate funds, apply debit/credit, write immutable ledger entries, commit.

## Seat booking

Best invariant is often database-enforced uniqueness/exclusion:

```sql
UNIQUE (event_id, seat_id)
```

Then `INSERT` wins once and concurrent duplicates fail cleanly. For time intervals, range exclusion constraints can reject overlap.

## Inventory decrement

Single atomic statement:

```sql
UPDATE inventory
SET quantity = quantity - $qty
WHERE sku = $sku
  AND quantity >= $qty
RETURNING quantity;
```

Zero rows means insufficient/currently unavailable quantity. No read-modify-write race window.

## Duplicate signup

```sql
INSERT INTO users (email)
VALUES ($1)
ON CONFLICT (email) DO NOTHING
RETURNING id;
```

The unique index arbitrates concurrent attempts.

## Job claiming

```sql
WITH picked AS (
  SELECT id
  FROM jobs
  WHERE status = 'ready' AND run_at <= now()
  ORDER BY run_at, id
  FOR UPDATE SKIP LOCKED
  LIMIT 20
)
UPDATE jobs j
SET status = 'running', started_at = now()
FROM picked
WHERE j.id = picked.id
RETURNING j.*;
```

Workers claim disjoint jobs without central coordination. Add lease/heartbeat/retry/dead-letter logic for crashed workers.

## Optimistic concurrency

```sql
UPDATE documents
SET body = $new_body,
    version = version + 1
WHERE id = $id
  AND version = $expected_version;
```

Zero rows signals the caller worked from stale state.

## Pessimistic concurrency

Lock the row before a multi-step decision when contention is bounded and the decision truly depends on current mutable state.

## Idempotency

A unique idempotency key converts retries into one logical operation. Persist the key in the same transaction as the protected business effect.

**Senior decision:** choose constraints/atomic DML first where they express the invariant; use row locks for multi-step current-state decisions; use Serializable for cross-row predicate invariants; use retries and idempotency as part of the design, not as emergency patches.