---
id: 58-63-transactions-mvcc-isolation
title: "58–63 — Transactions, ACID, Concurrency, MVCC & Isolation"
---

# 58 — Transactions

A transaction groups database actions into one atomic unit.

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

On failure:

```sql
ROLLBACK;
```

Most clients run individual statements in autocommit mode when no explicit block is open. Once an error occurs inside a PostgreSQL transaction, that transaction is aborted until rollback (or rollback to a savepoint).

Keep transactions short: long transactions retain snapshots, delay vacuum cleanup, hold locks longer, increase conflict windows, and can keep old row versions relevant.

---

# 59 — ACID

ACID is a set of properties, not four slogans.

- **Atomicity:** a transaction's changes become visible as a unit or are rolled back. Transaction logging and recovery machinery support this.
- **Consistency:** committed database state obeys the invariants enforced by schema/transaction logic. PostgreSQL cannot invent business invariants you never declared.
- **Isolation:** concurrent transactions behave according to an isolation model; PostgreSQL uses MVCC plus locks/SSI depending on level.
- **Durability:** after acknowledged commit under configured durability guarantees, WAL provides recovery after crash; settings such as `synchronous_commit` change acknowledgement guarantees.

```text
application invariants + constraints
          ↓
transaction semantics + concurrency control
          ↓
WAL + storage/recovery
```

---

# 60 — Savepoints

Savepoints allow partial rollback inside one transaction:

```sql
BEGIN;
INSERT INTO orders (...) VALUES (...);
SAVEPOINT before_optional_step;

-- if optional step fails
ROLLBACK TO SAVEPOINT before_optional_step;

RELEASE SAVEPOINT before_optional_step;
COMMIT;
```

They are not independent nested transactions: the outer transaction still owns final commit/rollback. ORMs sometimes call savepoint-based scopes “nested transactions”; understand the database reality.

---

# 61 — Concurrency Fundamentals

Concurrent sessions overlap:

```text
T1: ── read ── compute ── write ── commit
T2:       ── read ── compute ── write ── commit
```

Correctness cannot depend on “request A probably finishes first.” Think in terms of visibility, conflicts, invariants, locks, uniqueness, and retry behavior.

Classic race:

```text
T1 reads stock=1
T2 reads stock=1
T1 writes stock=0
T2 writes stock=0
```

Two sales consumed one item unless the operation is made atomic or protected by stronger concurrency control.

---

# 62 — MVCC

PostgreSQL uses **Multi-Version Concurrency Control** so readers can often proceed without blocking writers and writers create new visible states without overwriting what old snapshots still need.

A heap tuple carries transaction visibility metadata conceptually including creating/deleting transaction identities (`xmin`/`xmax`-related information).

```text
physical tuple version A
  visible to older snapshot
       ↓ UPDATE
new tuple version B
  visible to snapshots allowed to see updater's commit

snapshot + transaction status decide visibility
```

An UPDATE creates a new tuple version and marks the previous version as superseded for future visibility. The old version cannot be removed while some valid snapshot might still need it.

## Readers and writers

A `SELECT` at Read Committed sees a statement snapshot. It normally does not take row locks that block ordinary updates. Writers of the same logical row can conflict and wait/recheck according to command semantics.

## Dead tuples and vacuum

Once old tuple versions are no longer visible to any relevant transaction, vacuum can mark their space reusable and maintain visibility/freeze information. If old snapshots persist, cleanup horizons cannot advance, contributing to bloat and wraparound pressure.

## HOT connection

When an update does not change indexed columns and page space permits, PostgreSQL can make a Heap-Only Tuple chain, avoiding new index entries for that update. This connects schema/index design to update cost.

**Do not oversimplify MVCC** as “PostgreSQL makes a copy.” It creates tuple versions whose visibility depends on transaction state/snapshots, and those versions have lifecycle consequences for vacuum, indexes, storage, and replication.

---

# 63 — Transaction Isolation

PostgreSQL exposes Read Committed, Repeatable Read, and Serializable. `READ UNCOMMITTED` is accepted but behaves like Read Committed because PostgreSQL does not expose dirty reads.

## Read Committed (default)

Each statement gets a fresh snapshot of rows committed before that statement begins (plus own changes). Two SELECTs in one transaction can see different committed states.

## Repeatable Read

A transaction uses a stable snapshot, preventing non-repeatable reads and providing PostgreSQL's snapshot-isolation behavior. It can still permit anomalies such as write skew because two transactions may update different rows based on a shared predicate.

## Serializable

PostgreSQL uses Serializable Snapshot Isolation (SSI) to detect dangerous dependency patterns. Transactions may fail with serialization errors and **must be retried as whole transactions**.

## Anomaly map

| Anomaly | Meaning |
| --- | --- |
| dirty read | observe another transaction's uncommitted data |
| non-repeatable read | same row query returns changed committed value later |
| phantom concept | repeated predicate query gains/loses matching rows |
| lost update | one logical update overwrites/negates another |
| write skew | transactions make disjoint writes based on a shared invariant snapshot |
| serialization anomaly | result cannot be explained by any serial transaction order |

PostgreSQL Repeatable Read prevents more anomalies than the SQL standard minimum for that label, but is not Serializable.

## Write-skew example

Invariant: at least one doctor is on call.

```text
T1 snapshot: A on, B on → turns A off
T2 snapshot: A on, B on → turns B off
both commit under snapshot isolation
final: nobody on call
```

Serializable can detect the dependency and abort one transaction; an explicit locking/design strategy can also enforce the invariant.

**Application rule:** retry serialization/deadlock failures around the complete transaction function, with bounded backoff and idempotent treatment of external side effects.