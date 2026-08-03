---
id: 121-128-application-access-orms-migrations
title: "121–128 — Application Access, Node.js, ORMs, N+1 & Migrations"
---

# 121 — Application Database Access

```text
application use case
      ↓
driver
      ↓
connection pool
      ↓
PostgreSQL session/transaction
```

Application code must deliberately handle connection checkout/release, bind parameters, transaction boundaries, SQLSTATE errors, statement/lock timeouts, cancellation, retries, and graceful shutdown.

A transaction must use one checked-out database connection for its entire lifetime. Returning a connection to the pool between statements destroys the transaction boundary.

Set database-side timeouts where possible so abandoned requests do not leave unlimited work:

```sql
SET LOCAL statement_timeout = '2s';
SET LOCAL lock_timeout = '500ms';
```

Client timeout/cancellation and server timeout solve different failure modes; use both according to request budget.

Retry only classified transient failures such as serialization/deadlock/connection transitions, and make the unit idempotent. Do not retry syntax or constraint errors endlessly.

---

# 122 — Node.js + PostgreSQL

Conceptual `pg`-style pattern:

```ts
const client = await pool.connect()
try {
  await client.query('BEGIN')
  const order = await client.query(
    'INSERT INTO orders (customer_id) VALUES ($1) RETURNING id',
    [customerId],
  )
  await client.query('COMMIT')
  return order.rows[0]
} catch (error) {
  await client.query('ROLLBACK')
  throw error
} finally {
  client.release()
}
```

Never use `pool.query` for statements that must share one explicit transaction unless the API guarantees the same client—which ordinary pool helpers generally do not.

Use parameterized SQL, bound pool size, abort/cancel support, connection/statement timeouts, health/readiness semantics, and shutdown that stops accepting work before closing the pool.

Map PostgreSQL types intentionally: JavaScript `number` cannot exactly represent all `bigint` values; timestamp/time-zone conversion and `numeric` parsing need application policy. TypeScript compile-time types do not validate runtime database results by themselves.

Cross-links should point to the Node.js/TypeScript handbooks for broader service/runtime/type-system material.

---

# 123 — ORMs

An ORM maps application structures/operations to relational queries. It can reduce repetitive CRUD and migration boilerplate but does not replace SQL/database knowledge.

Concepts:

- object-relational impedance mismatch;
- schema models and generated clients;
- query builders;
- eager/lazy loading;
- migrations;
- generated SQL;
- transactions/unit-of-work;
- raw SQL escape hatches.

Prisma, Drizzle, TypeORM, Sequelize, and Knex represent different points between ORM and query-builder styles. Treat names as examples; database semantics stay PostgreSQL semantics.

Review generated SQL and plans for critical paths. Ensure ORM transaction abstractions really hold one database transaction. Avoid application-only foreign keys/uniqueness simply because the ORM can model relations without constraints.

Raw SQL can still be safely parameterized; an ORM raw-string concatenation can still be injectable.

---

# 124 — N+1 Query Problem

```text
1 query for parents
+
N child queries
=
N + 1 database round trips
```

Example:

```text
SELECT * FROM orders LIMIT 100;
then 100 × SELECT * FROM order_items WHERE order_id = ?;
```

Solutions include joins, batching (`WHERE order_id = ANY($1)`), eager loading, DataLoader-like request batching, or precomputed read models.

One giant join is not always optimal: parent columns repeat for every child, pagination can become incorrect, and large fan-out may increase transfer memory. Choose based on result shape and cardinality.

Detect N+1 using application traces/query counts and `pg_stat_statements` fingerprints/call rates, not only single-query latency.

---

# 125 — Database Migrations

Migrations make schema/data evolution version-controlled and repeatable.

Separate concerns:

- schema migration: object/constraint/index changes;
- data migration/backfill: transforming existing rows;
- application deployment: code compatible with old/new schema states.

PostgreSQL supports transactional DDL for many operations, but locks and table rewrites can still cause outages. A migration that rolls back cleanly after 20 minutes of blocking is still operationally bad.

Review:

1. lock mode and duration;
2. table rewrite/scanning;
3. WAL generation/replica lag;
4. backward/forward code compatibility;
5. constraint/index validation strategy;
6. rollback or forward-fix path;
7. timeout/monitoring;
8. data volume in production, not staging.

---

# 126 — Zero-Downtime Migrations

Use expand/contract:

```text
expand schema
   ↓
deploy code compatible with old + new
   ↓
backfill in bounded batches
   ↓
switch reads/writes
   ↓
validate
   ↓
contract old schema later
```

## Adding NOT NULL safely

For a large existing table, one strategy is:

```sql
ALTER TABLE users
ADD CONSTRAINT users_timezone_present
CHECK (timezone IS NOT NULL) NOT VALID;

ALTER TABLE users VALIDATE CONSTRAINT users_timezone_present;

ALTER TABLE users ALTER COLUMN timezone SET NOT NULL;
```

Exact lock/scan optimizations are version-sensitive; test on PostgreSQL 18 with production-like data.

## Renames

A direct column rename breaks old code. Expand with new column/API compatibility, migrate usage/data, then contract. Views can bridge some transitions.

## Type changes

Some casts are metadata-only; others rewrite every row and index. Determine the actual PostgreSQL behavior for the exact source/target type rather than assuming.

Dual writes across code paths can drift under failures; prefer one authoritative write path or transactional database mechanism where feasible.

---

# 127 — CREATE INDEX CONCURRENTLY

Normal index creation blocks writes in ways that can be unacceptable on busy tables. PostgreSQL provides:

```sql
CREATE INDEX CONCURRENTLY orders_customer_idx
ON orders (customer_id);
```

Concurrent creation performs multiple phases/scans and waits around transaction visibility to build a valid index while allowing normal writes. It takes longer and does more work than ordinary creation.

Important production rules:

- cannot run inside a normal transaction block;
- failure can leave an **invalid index** that consumes maintenance/storage;
- inspect `pg_index.indisvalid` / DDL state before retrying;
- monitor long transactions that delay phases;
- use a unique concurrent index followed by constraint attachment where appropriate for online uniqueness migration.

`DROP INDEX CONCURRENTLY`/`REINDEX CONCURRENTLY` have their own restrictions; read command docs for exact PostgreSQL 18 behavior.

---

# 128 — Data Migrations and Backfills

Never run one unbounded update over hundreds of millions of rows merely because it fits in one transaction.

Batch by a stable key:

```sql
UPDATE users
SET normalized_email = lower(email)
WHERE id > $last_id
  AND id <= $next_id
  AND normalized_email IS NULL;
```

Production backfill properties:

- bounded batches and transaction duration;
- resumable checkpoint/key;
- idempotent predicate;
- throttle based on latency, CPU, I/O, WAL and replica lag;
- monitor affected rows/errors;
- avoid long lock queues;
- preserve correctness while old/new application versions run;
- validate completion independently.

Avoid offset-based batches over changing tables; key ranges or `SKIP LOCKED` worker patterns are usually more stable.

**Senior exercise:** migrate a billion-row `orders.customer_email` snapshot to normalized `customer_id` references without downtime. Specify expand schema, backfill lookup strategy, bad-data handling, indexes, FK `NOT VALID` + validation, dual-read/write transition, monitoring, rollback, and final contract.