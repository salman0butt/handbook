---
title: "Advanced PostgreSQL Exercises"
description: "Exactly 100 canonical advanced PostgreSQL exercises."
---

# Advanced PostgreSQL Exercises

## PG-A-001 — Serializable retry (Advanced)

**Topic:** Serializable retry  
**Difficulty:** Advanced

### Problem statement

Run a transfer with whole-transaction retries. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the serializable retry mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
BEGIN ISOLATION LEVEL SERIALIZABLE; UPDATE accounts SET balance=balance-100 WHERE id=1 AND balance>=100; UPDATE accounts SET balance=balance+100 WHERE id=2; COMMIT;
```

**Explanation:** SQLSTATE 40001 requires retrying the unit. Context requirement: use the shared schema.

**Common mistakes:** Retrying one statement.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-002 — Blocker graph (Advanced)

**Topic:** Blocker graph  
**Difficulty:** Advanced

### Problem statement

Identify blocked and blocking sessions. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the blocker graph mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT a.pid,pg_blocking_pids(a.pid),a.query FROM pg_stat_activity a WHERE cardinality(pg_blocking_pids(a.pid))>0;
```

**Explanation:** Preserve evidence before termination. Context requirement: use the shared schema.

**Common mistakes:** Killing arbitrary sessions.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-003 — Extended statistics (Advanced)

**Topic:** Extended statistics  
**Difficulty:** Advanced

### Problem statement

Improve correlated-column estimates. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the extended statistics mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE STATISTICS orders_customer_status(dependencies,mcv) ON customer_id,status FROM orders; ANALYZE orders;
```

**Explanation:** Single-column stats miss correlation. Context requirement: use the shared schema.

**Common mistakes:** Forgetting ANALYZE.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-004 — EXPLAIN write (Advanced)

**Topic:** EXPLAIN write  
**Difficulty:** Advanced

### Problem statement

Inspect a modifying plan safely. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the explain write mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
BEGIN; EXPLAIN(ANALYZE,BUFFERS,WAL,SETTINGS,FORMAT JSON) UPDATE inventory SET quantity=quantity-1 WHERE product_id=$1 AND quantity>0; ROLLBACK;
```

**Explanation:** ANALYZE executes the statement. Context requirement: use the shared schema.

**Common mistakes:** Running destructively.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-005 — Partition lifecycle (Advanced)

**Topic:** Partition lifecycle  
**Difficulty:** Advanced

### Problem statement

Create and detach monthly partitions. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the partition lifecycle mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE TABLE events_2026_08 PARTITION OF events_partitioned FOR VALUES FROM('2026-08-01') TO('2026-09-01');
```

**Explanation:** Partitioning should match pruning and retention. Context requirement: use the shared schema.

**Common mistakes:** Wrong partition key.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-006 — Online FK (Advanced)

**Topic:** Online FK  
**Difficulty:** Advanced

### Problem statement

Validate a large foreign key in stages. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the online fk mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
ALTER TABLE order_items ADD CONSTRAINT oi_product_fk FOREIGN KEY(product_id) REFERENCES products(id) NOT VALID; ALTER TABLE order_items VALIDATE CONSTRAINT oi_product_fk;
```

**Explanation:** NOT VALID separates enforcement and history scan. Context requirement: use the shared schema.

**Common mistakes:** Ignoring I/O and locks.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-007 — Expand-contract (Advanced)

**Topic:** Expand-contract  
**Difficulty:** Advanced

### Problem statement

Migrate a text amount without one blocking rewrite. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the expand-contract mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
ALTER TABLE payments ADD COLUMN amount_numeric numeric(18,2); UPDATE payments SET amount_numeric=amount_text::numeric WHERE id>$1 AND id<=$2 AND amount_numeric IS NULL;
```

**Explanation:** Compatibility windows decouple releases. Context requirement: use the shared schema.

**Common mistakes:** One-shot type change.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-008 — Outbox (Advanced)

**Topic:** Outbox  
**Difficulty:** Advanced

### Problem statement

Persist domain change and event atomically. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the outbox mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
BEGIN; INSERT INTO orders(customer_id,status,total) VALUES($1,'paid',$2); INSERT INTO outbox(event_id,event_type,payload) VALUES($3,'order.paid',$4); COMMIT;
```

**Explanation:** Outbox closes the broker dual-write gap. Context requirement: use the shared schema.

**Common mistakes:** Publishing before commit.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-009 — Advisory lock (Advanced)

**Topic:** Advisory lock  
**Difficulty:** Advanced

### Problem statement

Serialize tenant maintenance. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the advisory lock mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
BEGIN; SELECT pg_advisory_xact_lock(hashtextextended($1,0)); /* work */ COMMIT;
```

**Explanation:** Transaction-scoped locks release safely. Context requirement: use the shared schema.

**Common mistakes:** Session lock leakage.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-010 — Logical publication (Advanced)

**Topic:** Logical publication  
**Difficulty:** Advanced

### Problem statement

Publish selected tables. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the logical publication mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE PUBLICATION app_publication FOR TABLE customers,products,orders;
```

**Explanation:** Logical replication sends row changes. Context requirement: use the shared schema.

**Common mistakes:** Assuming DDL replication.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-011 — Slot monitoring (Advanced)

**Topic:** Slot monitoring  
**Difficulty:** Advanced

### Problem statement

Measure retained WAL by slot. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the slot monitoring mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT slot_name,active,pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(),restart_lsn)) retained FROM pg_replication_slots;
```

**Explanation:** Inactive slots can fill disk. Context requirement: use the shared schema.

**Common mistakes:** No alerts or owner.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-012 — PITR (Advanced)

**Topic:** PITR  
**Difficulty:** Advanced

### Problem statement

Define a recovery target and pause. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the pitr mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
restore_command='cp /archive/%f %p'; recovery_target_time='2026-08-03 10:15:00+00'; recovery_target_action='pause';
```

**Explanation:** PITR replays archived WAL from a base backup. Context requirement: use the shared schema.

**Common mistakes:** No restore drills.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-013 — Autovacuum (Advanced)

**Topic:** Autovacuum  
**Difficulty:** Advanced

### Problem statement

Tune a high-churn table locally. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the autovacuum mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
ALTER TABLE events SET(autovacuum_vacuum_scale_factor=0.01,autovacuum_vacuum_threshold=5000,autovacuum_analyze_scale_factor=0.005);
```

**Explanation:** Large tables often need lower scale factors. Context requirement: use the shared schema.

**Common mistakes:** Global tuning by guess.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-014 — HOT design (Advanced)

**Topic:** HOT design  
**Difficulty:** Advanced

### Problem statement

Reserve page space for hot updates. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the hot design mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
ALTER TABLE jobs SET(fillfactor=80); VACUUM(ANALYZE) jobs;
```

**Explanation:** HOT avoids new index entries when possible. Context requirement: use the shared schema.

**Common mistakes:** Expecting bloat removal.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-015 — Covering index (Advanced)

**Topic:** Covering index  
**Difficulty:** Advanced

### Problem statement

Cover customer order history. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the covering index mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE INDEX CONCURRENTLY orders_history_idx ON orders(customer_id,created_at DESC,id DESC) INCLUDE(status,total);
```

**Explanation:** INCLUDE trades reads for size/write cost. Context requirement: use the shared schema.

**Common mistakes:** Including everything.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-016 — BRIN (Advanced)

**Topic:** BRIN  
**Difficulty:** Advanced

### Problem statement

Index append-correlated event time. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the brin mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE INDEX CONCURRENTLY events_time_brin ON events USING brin(occurred_at) WITH(pages_per_range=64);
```

**Explanation:** BRIN summarizes physical ranges. Context requirement: use the shared schema.

**Common mistakes:** Random lookup use.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-017 — Full-text search (Advanced)

**Topic:** Full-text search  
**Difficulty:** Advanced

### Problem statement

Create a weighted generated search vector. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the full-text search mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE INDEX articles_search_gin ON articles USING gin(search_vector);
```

**Explanation:** Generated vectors keep indexing consistent. Context requirement: use the shared schema.

**Common mistakes:** Expecting typo tolerance.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-018 — PostGIS radius (Advanced)

**Topic:** PostGIS radius  
**Difficulty:** Advanced

### Problem statement

Find points within five kilometers. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the postgis radius mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id FROM locations WHERE ST_DWithin(geog,ST_SetSRID(ST_MakePoint($1,$2),4326)::geography,5000);
```

**Explanation:** Geography distances use meters. Context requirement: use the shared schema.

**Common mistakes:** Lat/lon reversal.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-019 — Pool budget (Advanced)

**Topic:** Pool budget  
**Difficulty:** Advanced

### Problem statement

Calculate per-instance connection limits. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the pool budget mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT floor(($1-$2)::numeric/$3) AS max_pool_per_instance;
```

**Explanation:** Connection count is database capacity. Context requirement: use the shared schema.

**Common mistakes:** Large default times autoscaling.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-020 — SECURITY DEFINER (Advanced)

**Topic:** SECURITY DEFINER  
**Difficulty:** Advanced

### Problem statement

Harden a privileged function. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the security definer mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
ALTER FUNCTION app.get_order(bigint) SET search_path=pg_catalog,app; REVOKE ALL ON FUNCTION app.get_order(bigint) FROM PUBLIC;
```

**Explanation:** Trusted search_path prevents shadowing. Context requirement: use the shared schema.

**Common mistakes:** Writable schema first.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-021 — Serializable retry (Advanced)

**Topic:** Serializable retry  
**Difficulty:** Advanced

### Problem statement

Run a transfer with whole-transaction retries. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the serializable retry mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
BEGIN ISOLATION LEVEL SERIALIZABLE; UPDATE accounts SET balance=balance-100 WHERE id=1 AND balance>=100; UPDATE accounts SET balance=balance+100 WHERE id=2; COMMIT;
```

**Explanation:** SQLSTATE 40001 requires retrying the unit. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Retrying one statement.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-022 — Blocker graph (Advanced)

**Topic:** Blocker graph  
**Difficulty:** Advanced

### Problem statement

Identify blocked and blocking sessions. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the blocker graph mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT a.pid,pg_blocking_pids(a.pid),a.query FROM pg_stat_activity a WHERE cardinality(pg_blocking_pids(a.pid))>0;
```

**Explanation:** Preserve evidence before termination. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Killing arbitrary sessions.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-023 — Extended statistics (Advanced)

**Topic:** Extended statistics  
**Difficulty:** Advanced

### Problem statement

Improve correlated-column estimates. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the extended statistics mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE STATISTICS orders_customer_status(dependencies,mcv) ON customer_id,status FROM orders; ANALYZE orders;
```

**Explanation:** Single-column stats miss correlation. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Forgetting ANALYZE.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-024 — EXPLAIN write (Advanced)

**Topic:** EXPLAIN write  
**Difficulty:** Advanced

### Problem statement

Inspect a modifying plan safely. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the explain write mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
BEGIN; EXPLAIN(ANALYZE,BUFFERS,WAL,SETTINGS,FORMAT JSON) UPDATE inventory SET quantity=quantity-1 WHERE product_id=$1 AND quantity>0; ROLLBACK;
```

**Explanation:** ANALYZE executes the statement. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Running destructively.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-025 — Partition lifecycle (Advanced)

**Topic:** Partition lifecycle  
**Difficulty:** Advanced

### Problem statement

Create and detach monthly partitions. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the partition lifecycle mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE TABLE events_2026_08 PARTITION OF events_partitioned FOR VALUES FROM('2026-08-01') TO('2026-09-01');
```

**Explanation:** Partitioning should match pruning and retention. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Wrong partition key.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-026 — Online FK (Advanced)

**Topic:** Online FK  
**Difficulty:** Advanced

### Problem statement

Validate a large foreign key in stages. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the online fk mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
ALTER TABLE order_items ADD CONSTRAINT oi_product_fk FOREIGN KEY(product_id) REFERENCES products(id) NOT VALID; ALTER TABLE order_items VALIDATE CONSTRAINT oi_product_fk;
```

**Explanation:** NOT VALID separates enforcement and history scan. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Ignoring I/O and locks.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-027 — Expand-contract (Advanced)

**Topic:** Expand-contract  
**Difficulty:** Advanced

### Problem statement

Migrate a text amount without one blocking rewrite. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the expand-contract mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
ALTER TABLE payments ADD COLUMN amount_numeric numeric(18,2); UPDATE payments SET amount_numeric=amount_text::numeric WHERE id>$1 AND id<=$2 AND amount_numeric IS NULL;
```

**Explanation:** Compatibility windows decouple releases. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** One-shot type change.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-028 — Outbox (Advanced)

**Topic:** Outbox  
**Difficulty:** Advanced

### Problem statement

Persist domain change and event atomically. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the outbox mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
BEGIN; INSERT INTO orders(customer_id,status,total) VALUES($1,'paid',$2); INSERT INTO outbox(event_id,event_type,payload) VALUES($3,'order.paid',$4); COMMIT;
```

**Explanation:** Outbox closes the broker dual-write gap. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Publishing before commit.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-029 — Advisory lock (Advanced)

**Topic:** Advisory lock  
**Difficulty:** Advanced

### Problem statement

Serialize tenant maintenance. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the advisory lock mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
BEGIN; SELECT pg_advisory_xact_lock(hashtextextended($1,0)); /* work */ COMMIT;
```

**Explanation:** Transaction-scoped locks release safely. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Session lock leakage.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-030 — Logical publication (Advanced)

**Topic:** Logical publication  
**Difficulty:** Advanced

### Problem statement

Publish selected tables. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the logical publication mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE PUBLICATION app_publication FOR TABLE customers,products,orders;
```

**Explanation:** Logical replication sends row changes. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Assuming DDL replication.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-031 — Slot monitoring (Advanced)

**Topic:** Slot monitoring  
**Difficulty:** Advanced

### Problem statement

Measure retained WAL by slot. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the slot monitoring mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT slot_name,active,pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(),restart_lsn)) retained FROM pg_replication_slots;
```

**Explanation:** Inactive slots can fill disk. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** No alerts or owner.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-032 — PITR (Advanced)

**Topic:** PITR  
**Difficulty:** Advanced

### Problem statement

Define a recovery target and pause. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the pitr mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
restore_command='cp /archive/%f %p'; recovery_target_time='2026-08-03 10:15:00+00'; recovery_target_action='pause';
```

**Explanation:** PITR replays archived WAL from a base backup. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** No restore drills.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-033 — Autovacuum (Advanced)

**Topic:** Autovacuum  
**Difficulty:** Advanced

### Problem statement

Tune a high-churn table locally. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the autovacuum mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
ALTER TABLE events SET(autovacuum_vacuum_scale_factor=0.01,autovacuum_vacuum_threshold=5000,autovacuum_analyze_scale_factor=0.005);
```

**Explanation:** Large tables often need lower scale factors. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Global tuning by guess.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-034 — HOT design (Advanced)

**Topic:** HOT design  
**Difficulty:** Advanced

### Problem statement

Reserve page space for hot updates. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the hot design mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
ALTER TABLE jobs SET(fillfactor=80); VACUUM(ANALYZE) jobs;
```

**Explanation:** HOT avoids new index entries when possible. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Expecting bloat removal.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-035 — Covering index (Advanced)

**Topic:** Covering index  
**Difficulty:** Advanced

### Problem statement

Cover customer order history. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the covering index mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE INDEX CONCURRENTLY orders_history_idx ON orders(customer_id,created_at DESC,id DESC) INCLUDE(status,total);
```

**Explanation:** INCLUDE trades reads for size/write cost. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Including everything.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-036 — BRIN (Advanced)

**Topic:** BRIN  
**Difficulty:** Advanced

### Problem statement

Index append-correlated event time. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the brin mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE INDEX CONCURRENTLY events_time_brin ON events USING brin(occurred_at) WITH(pages_per_range=64);
```

**Explanation:** BRIN summarizes physical ranges. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Random lookup use.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-037 — Full-text search (Advanced)

**Topic:** Full-text search  
**Difficulty:** Advanced

### Problem statement

Create a weighted generated search vector. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the full-text search mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE INDEX articles_search_gin ON articles USING gin(search_vector);
```

**Explanation:** Generated vectors keep indexing consistent. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Expecting typo tolerance.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-038 — PostGIS radius (Advanced)

**Topic:** PostGIS radius  
**Difficulty:** Advanced

### Problem statement

Find points within five kilometers. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the postgis radius mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id FROM locations WHERE ST_DWithin(geog,ST_SetSRID(ST_MakePoint($1,$2),4326)::geography,5000);
```

**Explanation:** Geography distances use meters. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Lat/lon reversal.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-039 — Pool budget (Advanced)

**Topic:** Pool budget  
**Difficulty:** Advanced

### Problem statement

Calculate per-instance connection limits. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the pool budget mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT floor(($1-$2)::numeric/$3) AS max_pool_per_instance;
```

**Explanation:** Connection count is database capacity. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Large default times autoscaling.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-040 — SECURITY DEFINER (Advanced)

**Topic:** SECURITY DEFINER  
**Difficulty:** Advanced

### Problem statement

Harden a privileged function. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the security definer mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
ALTER FUNCTION app.get_order(bigint) SET search_path=pg_catalog,app; REVOKE ALL ON FUNCTION app.get_order(bigint) FROM PUBLIC;
```

**Explanation:** Trusted search_path prevents shadowing. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Writable schema first.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-041 — Serializable retry (Advanced)

**Topic:** Serializable retry  
**Difficulty:** Advanced

### Problem statement

Run a transfer with whole-transaction retries. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the serializable retry mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
BEGIN ISOLATION LEVEL SERIALIZABLE; UPDATE accounts SET balance=balance-100 WHERE id=1 AND balance>=100; UPDATE accounts SET balance=balance+100 WHERE id=2; COMMIT;
```

**Explanation:** SQLSTATE 40001 requires retrying the unit. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Retrying one statement.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-042 — Blocker graph (Advanced)

**Topic:** Blocker graph  
**Difficulty:** Advanced

### Problem statement

Identify blocked and blocking sessions. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the blocker graph mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT a.pid,pg_blocking_pids(a.pid),a.query FROM pg_stat_activity a WHERE cardinality(pg_blocking_pids(a.pid))>0;
```

**Explanation:** Preserve evidence before termination. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Killing arbitrary sessions.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-043 — Extended statistics (Advanced)

**Topic:** Extended statistics  
**Difficulty:** Advanced

### Problem statement

Improve correlated-column estimates. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the extended statistics mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE STATISTICS orders_customer_status(dependencies,mcv) ON customer_id,status FROM orders; ANALYZE orders;
```

**Explanation:** Single-column stats miss correlation. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Forgetting ANALYZE.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-044 — EXPLAIN write (Advanced)

**Topic:** EXPLAIN write  
**Difficulty:** Advanced

### Problem statement

Inspect a modifying plan safely. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the explain write mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
BEGIN; EXPLAIN(ANALYZE,BUFFERS,WAL,SETTINGS,FORMAT JSON) UPDATE inventory SET quantity=quantity-1 WHERE product_id=$1 AND quantity>0; ROLLBACK;
```

**Explanation:** ANALYZE executes the statement. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Running destructively.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-045 — Partition lifecycle (Advanced)

**Topic:** Partition lifecycle  
**Difficulty:** Advanced

### Problem statement

Create and detach monthly partitions. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the partition lifecycle mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE TABLE events_2026_08 PARTITION OF events_partitioned FOR VALUES FROM('2026-08-01') TO('2026-09-01');
```

**Explanation:** Partitioning should match pruning and retention. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Wrong partition key.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-046 — Online FK (Advanced)

**Topic:** Online FK  
**Difficulty:** Advanced

### Problem statement

Validate a large foreign key in stages. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the online fk mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
ALTER TABLE order_items ADD CONSTRAINT oi_product_fk FOREIGN KEY(product_id) REFERENCES products(id) NOT VALID; ALTER TABLE order_items VALIDATE CONSTRAINT oi_product_fk;
```

**Explanation:** NOT VALID separates enforcement and history scan. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Ignoring I/O and locks.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-047 — Expand-contract (Advanced)

**Topic:** Expand-contract  
**Difficulty:** Advanced

### Problem statement

Migrate a text amount without one blocking rewrite. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the expand-contract mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
ALTER TABLE payments ADD COLUMN amount_numeric numeric(18,2); UPDATE payments SET amount_numeric=amount_text::numeric WHERE id>$1 AND id<=$2 AND amount_numeric IS NULL;
```

**Explanation:** Compatibility windows decouple releases. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** One-shot type change.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-048 — Outbox (Advanced)

**Topic:** Outbox  
**Difficulty:** Advanced

### Problem statement

Persist domain change and event atomically. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the outbox mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
BEGIN; INSERT INTO orders(customer_id,status,total) VALUES($1,'paid',$2); INSERT INTO outbox(event_id,event_type,payload) VALUES($3,'order.paid',$4); COMMIT;
```

**Explanation:** Outbox closes the broker dual-write gap. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Publishing before commit.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-049 — Advisory lock (Advanced)

**Topic:** Advisory lock  
**Difficulty:** Advanced

### Problem statement

Serialize tenant maintenance. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the advisory lock mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
BEGIN; SELECT pg_advisory_xact_lock(hashtextextended($1,0)); /* work */ COMMIT;
```

**Explanation:** Transaction-scoped locks release safely. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Session lock leakage.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-050 — Logical publication (Advanced)

**Topic:** Logical publication  
**Difficulty:** Advanced

### Problem statement

Publish selected tables. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the logical publication mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE PUBLICATION app_publication FOR TABLE customers,products,orders;
```

**Explanation:** Logical replication sends row changes. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Assuming DDL replication.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-051 — Slot monitoring (Advanced)

**Topic:** Slot monitoring  
**Difficulty:** Advanced

### Problem statement

Measure retained WAL by slot. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the slot monitoring mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT slot_name,active,pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(),restart_lsn)) retained FROM pg_replication_slots;
```

**Explanation:** Inactive slots can fill disk. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** No alerts or owner.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-052 — PITR (Advanced)

**Topic:** PITR  
**Difficulty:** Advanced

### Problem statement

Define a recovery target and pause. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the pitr mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
restore_command='cp /archive/%f %p'; recovery_target_time='2026-08-03 10:15:00+00'; recovery_target_action='pause';
```

**Explanation:** PITR replays archived WAL from a base backup. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** No restore drills.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-053 — Autovacuum (Advanced)

**Topic:** Autovacuum  
**Difficulty:** Advanced

### Problem statement

Tune a high-churn table locally. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the autovacuum mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
ALTER TABLE events SET(autovacuum_vacuum_scale_factor=0.01,autovacuum_vacuum_threshold=5000,autovacuum_analyze_scale_factor=0.005);
```

**Explanation:** Large tables often need lower scale factors. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Global tuning by guess.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-054 — HOT design (Advanced)

**Topic:** HOT design  
**Difficulty:** Advanced

### Problem statement

Reserve page space for hot updates. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the hot design mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
ALTER TABLE jobs SET(fillfactor=80); VACUUM(ANALYZE) jobs;
```

**Explanation:** HOT avoids new index entries when possible. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Expecting bloat removal.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-055 — Covering index (Advanced)

**Topic:** Covering index  
**Difficulty:** Advanced

### Problem statement

Cover customer order history. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the covering index mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE INDEX CONCURRENTLY orders_history_idx ON orders(customer_id,created_at DESC,id DESC) INCLUDE(status,total);
```

**Explanation:** INCLUDE trades reads for size/write cost. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Including everything.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-056 — BRIN (Advanced)

**Topic:** BRIN  
**Difficulty:** Advanced

### Problem statement

Index append-correlated event time. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the brin mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE INDEX CONCURRENTLY events_time_brin ON events USING brin(occurred_at) WITH(pages_per_range=64);
```

**Explanation:** BRIN summarizes physical ranges. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Random lookup use.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-057 — Full-text search (Advanced)

**Topic:** Full-text search  
**Difficulty:** Advanced

### Problem statement

Create a weighted generated search vector. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the full-text search mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE INDEX articles_search_gin ON articles USING gin(search_vector);
```

**Explanation:** Generated vectors keep indexing consistent. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Expecting typo tolerance.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-058 — PostGIS radius (Advanced)

**Topic:** PostGIS radius  
**Difficulty:** Advanced

### Problem statement

Find points within five kilometers. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the postgis radius mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id FROM locations WHERE ST_DWithin(geog,ST_SetSRID(ST_MakePoint($1,$2),4326)::geography,5000);
```

**Explanation:** Geography distances use meters. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Lat/lon reversal.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-059 — Pool budget (Advanced)

**Topic:** Pool budget  
**Difficulty:** Advanced

### Problem statement

Calculate per-instance connection limits. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the pool budget mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT floor(($1-$2)::numeric/$3) AS max_pool_per_instance;
```

**Explanation:** Connection count is database capacity. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Large default times autoscaling.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-060 — SECURITY DEFINER (Advanced)

**Topic:** SECURITY DEFINER  
**Difficulty:** Advanced

### Problem statement

Harden a privileged function. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the security definer mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
ALTER FUNCTION app.get_order(bigint) SET search_path=pg_catalog,app; REVOKE ALL ON FUNCTION app.get_order(bigint) FROM PUBLIC;
```

**Explanation:** Trusted search_path prevents shadowing. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Writable schema first.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-061 — Serializable retry (Advanced)

**Topic:** Serializable retry  
**Difficulty:** Advanced

### Problem statement

Run a transfer with whole-transaction retries. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the serializable retry mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
BEGIN ISOLATION LEVEL SERIALIZABLE; UPDATE accounts SET balance=balance-100 WHERE id=1 AND balance>=100; UPDATE accounts SET balance=balance+100 WHERE id=2; COMMIT;
```

**Explanation:** SQLSTATE 40001 requires retrying the unit. Context requirement: minimize locks and write amplification.

**Common mistakes:** Retrying one statement.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-062 — Blocker graph (Advanced)

**Topic:** Blocker graph  
**Difficulty:** Advanced

### Problem statement

Identify blocked and blocking sessions. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the blocker graph mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT a.pid,pg_blocking_pids(a.pid),a.query FROM pg_stat_activity a WHERE cardinality(pg_blocking_pids(a.pid))>0;
```

**Explanation:** Preserve evidence before termination. Context requirement: minimize locks and write amplification.

**Common mistakes:** Killing arbitrary sessions.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-063 — Extended statistics (Advanced)

**Topic:** Extended statistics  
**Difficulty:** Advanced

### Problem statement

Improve correlated-column estimates. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the extended statistics mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE STATISTICS orders_customer_status(dependencies,mcv) ON customer_id,status FROM orders; ANALYZE orders;
```

**Explanation:** Single-column stats miss correlation. Context requirement: minimize locks and write amplification.

**Common mistakes:** Forgetting ANALYZE.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-064 — EXPLAIN write (Advanced)

**Topic:** EXPLAIN write  
**Difficulty:** Advanced

### Problem statement

Inspect a modifying plan safely. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the explain write mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
BEGIN; EXPLAIN(ANALYZE,BUFFERS,WAL,SETTINGS,FORMAT JSON) UPDATE inventory SET quantity=quantity-1 WHERE product_id=$1 AND quantity>0; ROLLBACK;
```

**Explanation:** ANALYZE executes the statement. Context requirement: minimize locks and write amplification.

**Common mistakes:** Running destructively.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-065 — Partition lifecycle (Advanced)

**Topic:** Partition lifecycle  
**Difficulty:** Advanced

### Problem statement

Create and detach monthly partitions. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the partition lifecycle mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE TABLE events_2026_08 PARTITION OF events_partitioned FOR VALUES FROM('2026-08-01') TO('2026-09-01');
```

**Explanation:** Partitioning should match pruning and retention. Context requirement: minimize locks and write amplification.

**Common mistakes:** Wrong partition key.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-066 — Online FK (Advanced)

**Topic:** Online FK  
**Difficulty:** Advanced

### Problem statement

Validate a large foreign key in stages. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the online fk mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
ALTER TABLE order_items ADD CONSTRAINT oi_product_fk FOREIGN KEY(product_id) REFERENCES products(id) NOT VALID; ALTER TABLE order_items VALIDATE CONSTRAINT oi_product_fk;
```

**Explanation:** NOT VALID separates enforcement and history scan. Context requirement: minimize locks and write amplification.

**Common mistakes:** Ignoring I/O and locks.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-067 — Expand-contract (Advanced)

**Topic:** Expand-contract  
**Difficulty:** Advanced

### Problem statement

Migrate a text amount without one blocking rewrite. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the expand-contract mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
ALTER TABLE payments ADD COLUMN amount_numeric numeric(18,2); UPDATE payments SET amount_numeric=amount_text::numeric WHERE id>$1 AND id<=$2 AND amount_numeric IS NULL;
```

**Explanation:** Compatibility windows decouple releases. Context requirement: minimize locks and write amplification.

**Common mistakes:** One-shot type change.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-068 — Outbox (Advanced)

**Topic:** Outbox  
**Difficulty:** Advanced

### Problem statement

Persist domain change and event atomically. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the outbox mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
BEGIN; INSERT INTO orders(customer_id,status,total) VALUES($1,'paid',$2); INSERT INTO outbox(event_id,event_type,payload) VALUES($3,'order.paid',$4); COMMIT;
```

**Explanation:** Outbox closes the broker dual-write gap. Context requirement: minimize locks and write amplification.

**Common mistakes:** Publishing before commit.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-069 — Advisory lock (Advanced)

**Topic:** Advisory lock  
**Difficulty:** Advanced

### Problem statement

Serialize tenant maintenance. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the advisory lock mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
BEGIN; SELECT pg_advisory_xact_lock(hashtextextended($1,0)); /* work */ COMMIT;
```

**Explanation:** Transaction-scoped locks release safely. Context requirement: minimize locks and write amplification.

**Common mistakes:** Session lock leakage.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-070 — Logical publication (Advanced)

**Topic:** Logical publication  
**Difficulty:** Advanced

### Problem statement

Publish selected tables. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the logical publication mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE PUBLICATION app_publication FOR TABLE customers,products,orders;
```

**Explanation:** Logical replication sends row changes. Context requirement: minimize locks and write amplification.

**Common mistakes:** Assuming DDL replication.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-071 — Slot monitoring (Advanced)

**Topic:** Slot monitoring  
**Difficulty:** Advanced

### Problem statement

Measure retained WAL by slot. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the slot monitoring mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT slot_name,active,pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(),restart_lsn)) retained FROM pg_replication_slots;
```

**Explanation:** Inactive slots can fill disk. Context requirement: minimize locks and write amplification.

**Common mistakes:** No alerts or owner.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-072 — PITR (Advanced)

**Topic:** PITR  
**Difficulty:** Advanced

### Problem statement

Define a recovery target and pause. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the pitr mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
restore_command='cp /archive/%f %p'; recovery_target_time='2026-08-03 10:15:00+00'; recovery_target_action='pause';
```

**Explanation:** PITR replays archived WAL from a base backup. Context requirement: minimize locks and write amplification.

**Common mistakes:** No restore drills.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-073 — Autovacuum (Advanced)

**Topic:** Autovacuum  
**Difficulty:** Advanced

### Problem statement

Tune a high-churn table locally. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the autovacuum mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
ALTER TABLE events SET(autovacuum_vacuum_scale_factor=0.01,autovacuum_vacuum_threshold=5000,autovacuum_analyze_scale_factor=0.005);
```

**Explanation:** Large tables often need lower scale factors. Context requirement: minimize locks and write amplification.

**Common mistakes:** Global tuning by guess.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-074 — HOT design (Advanced)

**Topic:** HOT design  
**Difficulty:** Advanced

### Problem statement

Reserve page space for hot updates. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the hot design mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
ALTER TABLE jobs SET(fillfactor=80); VACUUM(ANALYZE) jobs;
```

**Explanation:** HOT avoids new index entries when possible. Context requirement: minimize locks and write amplification.

**Common mistakes:** Expecting bloat removal.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-075 — Covering index (Advanced)

**Topic:** Covering index  
**Difficulty:** Advanced

### Problem statement

Cover customer order history. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the covering index mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE INDEX CONCURRENTLY orders_history_idx ON orders(customer_id,created_at DESC,id DESC) INCLUDE(status,total);
```

**Explanation:** INCLUDE trades reads for size/write cost. Context requirement: minimize locks and write amplification.

**Common mistakes:** Including everything.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-076 — BRIN (Advanced)

**Topic:** BRIN  
**Difficulty:** Advanced

### Problem statement

Index append-correlated event time. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the brin mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE INDEX CONCURRENTLY events_time_brin ON events USING brin(occurred_at) WITH(pages_per_range=64);
```

**Explanation:** BRIN summarizes physical ranges. Context requirement: minimize locks and write amplification.

**Common mistakes:** Random lookup use.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-077 — Full-text search (Advanced)

**Topic:** Full-text search  
**Difficulty:** Advanced

### Problem statement

Create a weighted generated search vector. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the full-text search mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE INDEX articles_search_gin ON articles USING gin(search_vector);
```

**Explanation:** Generated vectors keep indexing consistent. Context requirement: minimize locks and write amplification.

**Common mistakes:** Expecting typo tolerance.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-078 — PostGIS radius (Advanced)

**Topic:** PostGIS radius  
**Difficulty:** Advanced

### Problem statement

Find points within five kilometers. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the postgis radius mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id FROM locations WHERE ST_DWithin(geog,ST_SetSRID(ST_MakePoint($1,$2),4326)::geography,5000);
```

**Explanation:** Geography distances use meters. Context requirement: minimize locks and write amplification.

**Common mistakes:** Lat/lon reversal.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-079 — Pool budget (Advanced)

**Topic:** Pool budget  
**Difficulty:** Advanced

### Problem statement

Calculate per-instance connection limits. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the pool budget mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT floor(($1-$2)::numeric/$3) AS max_pool_per_instance;
```

**Explanation:** Connection count is database capacity. Context requirement: minimize locks and write amplification.

**Common mistakes:** Large default times autoscaling.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-080 — SECURITY DEFINER (Advanced)

**Topic:** SECURITY DEFINER  
**Difficulty:** Advanced

### Problem statement

Harden a privileged function. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the security definer mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
ALTER FUNCTION app.get_order(bigint) SET search_path=pg_catalog,app; REVOKE ALL ON FUNCTION app.get_order(bigint) FROM PUBLIC;
```

**Explanation:** Trusted search_path prevents shadowing. Context requirement: minimize locks and write amplification.

**Common mistakes:** Writable schema first.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-081 — Serializable retry (Advanced)

**Topic:** Serializable retry  
**Difficulty:** Advanced

### Problem statement

Run a transfer with whole-transaction retries. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the serializable retry mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
BEGIN ISOLATION LEVEL SERIALIZABLE; UPDATE accounts SET balance=balance-100 WHERE id=1 AND balance>=100; UPDATE accounts SET balance=balance+100 WHERE id=2; COMMIT;
```

**Explanation:** SQLSTATE 40001 requires retrying the unit. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Retrying one statement.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-082 — Blocker graph (Advanced)

**Topic:** Blocker graph  
**Difficulty:** Advanced

### Problem statement

Identify blocked and blocking sessions. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the blocker graph mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT a.pid,pg_blocking_pids(a.pid),a.query FROM pg_stat_activity a WHERE cardinality(pg_blocking_pids(a.pid))>0;
```

**Explanation:** Preserve evidence before termination. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Killing arbitrary sessions.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-083 — Extended statistics (Advanced)

**Topic:** Extended statistics  
**Difficulty:** Advanced

### Problem statement

Improve correlated-column estimates. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the extended statistics mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE STATISTICS orders_customer_status(dependencies,mcv) ON customer_id,status FROM orders; ANALYZE orders;
```

**Explanation:** Single-column stats miss correlation. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Forgetting ANALYZE.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-084 — EXPLAIN write (Advanced)

**Topic:** EXPLAIN write  
**Difficulty:** Advanced

### Problem statement

Inspect a modifying plan safely. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the explain write mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
BEGIN; EXPLAIN(ANALYZE,BUFFERS,WAL,SETTINGS,FORMAT JSON) UPDATE inventory SET quantity=quantity-1 WHERE product_id=$1 AND quantity>0; ROLLBACK;
```

**Explanation:** ANALYZE executes the statement. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Running destructively.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-085 — Partition lifecycle (Advanced)

**Topic:** Partition lifecycle  
**Difficulty:** Advanced

### Problem statement

Create and detach monthly partitions. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the partition lifecycle mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE TABLE events_2026_08 PARTITION OF events_partitioned FOR VALUES FROM('2026-08-01') TO('2026-09-01');
```

**Explanation:** Partitioning should match pruning and retention. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Wrong partition key.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-086 — Online FK (Advanced)

**Topic:** Online FK  
**Difficulty:** Advanced

### Problem statement

Validate a large foreign key in stages. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the online fk mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
ALTER TABLE order_items ADD CONSTRAINT oi_product_fk FOREIGN KEY(product_id) REFERENCES products(id) NOT VALID; ALTER TABLE order_items VALIDATE CONSTRAINT oi_product_fk;
```

**Explanation:** NOT VALID separates enforcement and history scan. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Ignoring I/O and locks.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-087 — Expand-contract (Advanced)

**Topic:** Expand-contract  
**Difficulty:** Advanced

### Problem statement

Migrate a text amount without one blocking rewrite. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the expand-contract mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
ALTER TABLE payments ADD COLUMN amount_numeric numeric(18,2); UPDATE payments SET amount_numeric=amount_text::numeric WHERE id>$1 AND id<=$2 AND amount_numeric IS NULL;
```

**Explanation:** Compatibility windows decouple releases. Context requirement: preserve evidence and define rollback.

**Common mistakes:** One-shot type change.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-088 — Outbox (Advanced)

**Topic:** Outbox  
**Difficulty:** Advanced

### Problem statement

Persist domain change and event atomically. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the outbox mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
BEGIN; INSERT INTO orders(customer_id,status,total) VALUES($1,'paid',$2); INSERT INTO outbox(event_id,event_type,payload) VALUES($3,'order.paid',$4); COMMIT;
```

**Explanation:** Outbox closes the broker dual-write gap. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Publishing before commit.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-089 — Advisory lock (Advanced)

**Topic:** Advisory lock  
**Difficulty:** Advanced

### Problem statement

Serialize tenant maintenance. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the advisory lock mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
BEGIN; SELECT pg_advisory_xact_lock(hashtextextended($1,0)); /* work */ COMMIT;
```

**Explanation:** Transaction-scoped locks release safely. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Session lock leakage.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-090 — Logical publication (Advanced)

**Topic:** Logical publication  
**Difficulty:** Advanced

### Problem statement

Publish selected tables. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the logical publication mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE PUBLICATION app_publication FOR TABLE customers,products,orders;
```

**Explanation:** Logical replication sends row changes. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Assuming DDL replication.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-091 — Slot monitoring (Advanced)

**Topic:** Slot monitoring  
**Difficulty:** Advanced

### Problem statement

Measure retained WAL by slot. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the slot monitoring mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT slot_name,active,pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(),restart_lsn)) retained FROM pg_replication_slots;
```

**Explanation:** Inactive slots can fill disk. Context requirement: preserve evidence and define rollback.

**Common mistakes:** No alerts or owner.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-092 — PITR (Advanced)

**Topic:** PITR  
**Difficulty:** Advanced

### Problem statement

Define a recovery target and pause. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the pitr mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
restore_command='cp /archive/%f %p'; recovery_target_time='2026-08-03 10:15:00+00'; recovery_target_action='pause';
```

**Explanation:** PITR replays archived WAL from a base backup. Context requirement: preserve evidence and define rollback.

**Common mistakes:** No restore drills.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-093 — Autovacuum (Advanced)

**Topic:** Autovacuum  
**Difficulty:** Advanced

### Problem statement

Tune a high-churn table locally. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the autovacuum mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
ALTER TABLE events SET(autovacuum_vacuum_scale_factor=0.01,autovacuum_vacuum_threshold=5000,autovacuum_analyze_scale_factor=0.005);
```

**Explanation:** Large tables often need lower scale factors. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Global tuning by guess.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-094 — HOT design (Advanced)

**Topic:** HOT design  
**Difficulty:** Advanced

### Problem statement

Reserve page space for hot updates. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the hot design mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
ALTER TABLE jobs SET(fillfactor=80); VACUUM(ANALYZE) jobs;
```

**Explanation:** HOT avoids new index entries when possible. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Expecting bloat removal.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-095 — Covering index (Advanced)

**Topic:** Covering index  
**Difficulty:** Advanced

### Problem statement

Cover customer order history. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the covering index mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE INDEX CONCURRENTLY orders_history_idx ON orders(customer_id,created_at DESC,id DESC) INCLUDE(status,total);
```

**Explanation:** INCLUDE trades reads for size/write cost. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Including everything.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-096 — BRIN (Advanced)

**Topic:** BRIN  
**Difficulty:** Advanced

### Problem statement

Index append-correlated event time. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the brin mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE INDEX CONCURRENTLY events_time_brin ON events USING brin(occurred_at) WITH(pages_per_range=64);
```

**Explanation:** BRIN summarizes physical ranges. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Random lookup use.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-097 — Full-text search (Advanced)

**Topic:** Full-text search  
**Difficulty:** Advanced

### Problem statement

Create a weighted generated search vector. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the full-text search mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE INDEX articles_search_gin ON articles USING gin(search_vector);
```

**Explanation:** Generated vectors keep indexing consistent. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Expecting typo tolerance.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-098 — PostGIS radius (Advanced)

**Topic:** PostGIS radius  
**Difficulty:** Advanced

### Problem statement

Find points within five kilometers. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the postgis radius mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id FROM locations WHERE ST_DWithin(geog,ST_SetSRID(ST_MakePoint($1,$2),4326)::geography,5000);
```

**Explanation:** Geography distances use meters. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Lat/lon reversal.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-099 — Pool budget (Advanced)

**Topic:** Pool budget  
**Difficulty:** Advanced

### Problem statement

Calculate per-instance connection limits. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the pool budget mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT floor(($1-$2)::numeric/$3) AS max_pool_per_instance;
```

**Explanation:** Connection count is database capacity. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Large default times autoscaling.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-A-100 — SECURITY DEFINER (Advanced)

**Topic:** SECURITY DEFINER  
**Difficulty:** Advanced

### Problem statement

Harden a privileged function. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the security definer mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
ALTER FUNCTION app.get_order(bigint) SET search_path=pg_catalog,app; REVOKE ALL ON FUNCTION app.get_order(bigint) FROM PUBLIC;
```

**Explanation:** Trusted search_path prevents shadowing. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Writable schema first.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>
