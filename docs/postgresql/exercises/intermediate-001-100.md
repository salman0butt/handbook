---
title: "Intermediate PostgreSQL Exercises"
description: "Exactly 100 canonical intermediate PostgreSQL exercises."
---

# Intermediate PostgreSQL Exercises

## PG-I-001 — Conditional aggregation (Intermediate)

**Topic:** Conditional aggregation  
**Difficulty:** Intermediate

### Problem statement

Count paid, shipped and cancelled orders per customer. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the conditional aggregation mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT customer_id,count(*) FILTER(WHERE status='paid') paid,count(*) FILTER(WHERE status='shipped') shipped,count(*) FILTER(WHERE status='cancelled') cancelled FROM orders GROUP BY customer_id;
```

**Explanation:** FILTER keeps conditions with aggregates. Context requirement: use the shared schema.

**Common mistakes:** Three separate scans.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-002 — Window ranking (Intermediate)

**Topic:** Window ranking  
**Difficulty:** Intermediate

### Problem statement

Rank salaries within departments. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the window ranking mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,department,salary,dense_rank() OVER(PARTITION BY department ORDER BY salary DESC) rank FROM employees;
```

**Explanation:** Windows preserve row detail. Context requirement: use the shared schema.

**Common mistakes:** GROUP BY losing rows.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-003 — Running total (Intermediate)

**Topic:** Running total  
**Difficulty:** Intermediate

### Problem statement

Compute cumulative paid revenue. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the running total mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,created_at,total,sum(total) OVER(ORDER BY created_at,id ROWS UNBOUNDED PRECEDING) running FROM orders WHERE status='paid';
```

**Explanation:** ROWS plus tie-breaker defines order. Context requirement: use the shared schema.

**Common mistakes:** Default RANGE surprises.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-004 — LAG (Intermediate)

**Topic:** LAG  
**Difficulty:** Intermediate

### Problem statement

Show the previous order total per customer. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the lag mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,customer_id,total,lag(total) OVER(PARTITION BY customer_id ORDER BY created_at,id) previous FROM orders;
```

**Explanation:** LAG avoids a self join. Context requirement: use the shared schema.

**Common mistakes:** No tie-breaker.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-005 — Anti-join (Intermediate)

**Topic:** Anti-join  
**Difficulty:** Intermediate

### Problem statement

Find customers without orders. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the anti-join mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT c.id,c.email FROM customers c WHERE NOT EXISTS(SELECT 1 FROM orders o WHERE o.customer_id=c.id);
```

**Explanation:** NOT EXISTS has safe NULL semantics. Context requirement: use the shared schema.

**Common mistakes:** NOT IN with NULL.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-006 — Semi-join (Intermediate)

**Topic:** Semi-join  
**Difficulty:** Intermediate

### Problem statement

Find customers who bought books. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the semi-join mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT c.id FROM customers c WHERE EXISTS(SELECT 1 FROM orders o JOIN order_items i ON i.order_id=o.id JOIN products p ON p.id=i.product_id WHERE o.customer_id=c.id AND p.category='books');
```

**Explanation:** EXISTS avoids duplicate amplification. Context requirement: use the shared schema.

**Common mistakes:** DISTINCT as repair.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-007 — LATERAL (Intermediate)

**Topic:** LATERAL  
**Difficulty:** Intermediate

### Problem statement

Return the latest order for each customer. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the lateral mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT c.id,x.id latest_order_id FROM customers c LEFT JOIN LATERAL(SELECT id FROM orders o WHERE o.customer_id=c.id ORDER BY created_at DESC,id DESC LIMIT 1)x ON true;
```

**Explanation:** LATERAL references the outer row. Context requirement: use the shared schema.

**Common mistakes:** N+1 application queries.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-008 — CTE (Intermediate)

**Topic:** CTE  
**Difficulty:** Intermediate

### Problem statement

Calculate and filter lifetime value. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the cte mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
WITH v AS(SELECT customer_id,sum(total) value FROM orders WHERE status IN('paid','shipped') GROUP BY customer_id) SELECT * FROM v WHERE value>=1000;
```

**Explanation:** A CTE names a transformation. Context requirement: use the shared schema.

**Common mistakes:** Assuming an optimization fence.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-009 — Recursive CTE (Intermediate)

**Topic:** Recursive CTE  
**Difficulty:** Intermediate

### Problem statement

Traverse the employee hierarchy. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the recursive cte mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
WITH RECURSIVE org AS(SELECT id,manager_id,0 depth FROM employees WHERE manager_id IS NULL UNION ALL SELECT e.id,e.manager_id,o.depth+1 FROM employees e JOIN org o ON e.manager_id=o.id) SELECT * FROM org;
```

**Explanation:** Anchor and recursive terms iterate. Context requirement: use the shared schema.

**Common mistakes:** Ignoring cycles.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-010 — UPSERT (Intermediate)

**Topic:** UPSERT  
**Difficulty:** Intermediate

### Problem statement

Add inventory quantity atomically. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the upsert mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
INSERT INTO inventory(product_id,quantity) VALUES($1,$2) ON CONFLICT(product_id) DO UPDATE SET quantity=inventory.quantity+EXCLUDED.quantity,version=inventory.version+1 RETURNING *;
```

**Explanation:** EXCLUDED exposes proposed values. Context requirement: use the shared schema.

**Common mistakes:** Overwriting instead of incrementing.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-011 — Writable CTE (Intermediate)

**Topic:** Writable CTE  
**Difficulty:** Intermediate

### Problem statement

Insert an order and first item in one statement. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the writable cte mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
WITH o AS(INSERT INTO orders(customer_id,status,total) VALUES($1,'pending',$2) RETURNING id) INSERT INTO order_items SELECT id,$3,1,$2 FROM o RETURNING order_id;
```

**Explanation:** Generated keys flow inside one statement. Context requirement: use the shared schema.

**Common mistakes:** Assuming separate statements are atomic.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-012 — Partial index (Intermediate)

**Topic:** Partial index  
**Difficulty:** Intermediate

### Problem statement

Index only ready queued jobs. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the partial index mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE INDEX CONCURRENTLY jobs_ready_idx ON jobs(run_at,priority DESC,id) WHERE status='queued';
```

**Explanation:** Partial indexes store matching rows only. Context requirement: use the shared schema.

**Common mistakes:** Predicate mismatch.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-013 — Expression index (Intermediate)

**Topic:** Expression index  
**Difficulty:** Intermediate

### Problem statement

Support case-insensitive email lookup. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the expression index mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE INDEX CONCURRENTLY customers_email_lower_idx ON customers(lower(email));
```

**Explanation:** Queries must match the indexed expression. Context requirement: use the shared schema.

**Common mistakes:** Broad ILIKE assumption.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-014 — JSONB GIN (Intermediate)

**Topic:** JSONB GIN  
**Difficulty:** Intermediate

### Problem statement

Index attribute containment. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the jsonb gin mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE INDEX CONCURRENTLY products_attributes_gin ON products USING gin(attributes jsonb_path_ops);
```

**Explanation:** Operator classes match operator needs. Context requirement: use the shared schema.

**Common mistakes:** Blind operator-class choice.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-015 — Keyset pagination (Intermediate)

**Topic:** Keyset pagination  
**Difficulty:** Intermediate

### Problem statement

Fetch the next order page by cursor. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the keyset pagination mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,created_at,total FROM orders WHERE(created_at,id)<($1,$2) ORDER BY created_at DESC,id DESC LIMIT 50;
```

**Explanation:** Keysets avoid growing OFFSET work. Context requirement: use the shared schema.

**Common mistakes:** Cursor/order mismatch.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-016 — Savepoint (Intermediate)

**Topic:** Savepoint  
**Difficulty:** Intermediate

### Problem statement

Recover from one optional write inside a transaction. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the savepoint mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
BEGIN; SAVEPOINT optional; /* write */ ROLLBACK TO SAVEPOINT optional; COMMIT;
```

**Explanation:** Savepoints preserve earlier transaction work. Context requirement: use the shared schema.

**Common mistakes:** Continuing an aborted transaction.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-017 — Row locking (Intermediate)

**Topic:** Row locking  
**Difficulty:** Intermediate

### Problem statement

Reserve inventory before decrement. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the row locking mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
BEGIN; SELECT quantity FROM inventory WHERE product_id=$1 FOR UPDATE; UPDATE inventory SET quantity=quantity-1 WHERE product_id=$1 AND quantity>0; COMMIT;
```

**Explanation:** The lock serializes competing changes. Context requirement: use the shared schema.

**Common mistakes:** Read then update later.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-018 — SKIP LOCKED (Intermediate)

**Topic:** SKIP LOCKED  
**Difficulty:** Intermediate

### Problem statement

Claim ten jobs without worker blocking. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the skip locked mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
WITH c AS(SELECT id FROM jobs WHERE status='queued' AND run_at<=now() ORDER BY priority DESC,run_at,id FOR UPDATE SKIP LOCKED LIMIT 10) UPDATE jobs j SET status='running',locked_at=now(),locked_by=$1 FROM c WHERE j.id=c.id RETURNING j.*;
```

**Explanation:** SKIP LOCKED fits queue consumers. Context requirement: use the shared schema.

**Common mistakes:** Separate select/update.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-019 — Materialized view (Intermediate)

**Topic:** Materialized view  
**Difficulty:** Intermediate

### Problem statement

Build daily revenue cache. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the materialized view mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE MATERIALIZED VIEW daily_revenue AS SELECT date_trunc('day',created_at) day,sum(total) revenue FROM orders WHERE status IN('paid','shipped') GROUP BY 1 WITH NO DATA;
```

**Explanation:** Materialization trades freshness for speed. Context requirement: use the shared schema.

**Common mistakes:** No refresh policy.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-020 — RLS (Intermediate)

**Topic:** RLS  
**Difficulty:** Intermediate

### Problem statement

Enforce tenant visibility and writes. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the rls mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
ALTER TABLE tenant_notes ENABLE ROW LEVEL SECURITY; CREATE POLICY tenant_isolation ON tenant_notes USING(tenant_id=current_setting('app.tenant_id')::bigint) WITH CHECK(tenant_id=current_setting('app.tenant_id')::bigint);
```

**Explanation:** RLS needs USING and WITH CHECK. Context requirement: use the shared schema.

**Common mistakes:** Untrusted tenant context.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-021 — Conditional aggregation (Intermediate)

**Topic:** Conditional aggregation  
**Difficulty:** Intermediate

### Problem statement

Count paid, shipped and cancelled orders per customer. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the conditional aggregation mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT customer_id,count(*) FILTER(WHERE status='paid') paid,count(*) FILTER(WHERE status='shipped') shipped,count(*) FILTER(WHERE status='cancelled') cancelled FROM orders GROUP BY customer_id;
```

**Explanation:** FILTER keeps conditions with aggregates. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Three separate scans.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-022 — Window ranking (Intermediate)

**Topic:** Window ranking  
**Difficulty:** Intermediate

### Problem statement

Rank salaries within departments. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the window ranking mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,department,salary,dense_rank() OVER(PARTITION BY department ORDER BY salary DESC) rank FROM employees;
```

**Explanation:** Windows preserve row detail. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** GROUP BY losing rows.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-023 — Running total (Intermediate)

**Topic:** Running total  
**Difficulty:** Intermediate

### Problem statement

Compute cumulative paid revenue. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the running total mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,created_at,total,sum(total) OVER(ORDER BY created_at,id ROWS UNBOUNDED PRECEDING) running FROM orders WHERE status='paid';
```

**Explanation:** ROWS plus tie-breaker defines order. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Default RANGE surprises.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-024 — LAG (Intermediate)

**Topic:** LAG  
**Difficulty:** Intermediate

### Problem statement

Show the previous order total per customer. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the lag mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,customer_id,total,lag(total) OVER(PARTITION BY customer_id ORDER BY created_at,id) previous FROM orders;
```

**Explanation:** LAG avoids a self join. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** No tie-breaker.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-025 — Anti-join (Intermediate)

**Topic:** Anti-join  
**Difficulty:** Intermediate

### Problem statement

Find customers without orders. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the anti-join mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT c.id,c.email FROM customers c WHERE NOT EXISTS(SELECT 1 FROM orders o WHERE o.customer_id=c.id);
```

**Explanation:** NOT EXISTS has safe NULL semantics. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** NOT IN with NULL.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-026 — Semi-join (Intermediate)

**Topic:** Semi-join  
**Difficulty:** Intermediate

### Problem statement

Find customers who bought books. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the semi-join mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT c.id FROM customers c WHERE EXISTS(SELECT 1 FROM orders o JOIN order_items i ON i.order_id=o.id JOIN products p ON p.id=i.product_id WHERE o.customer_id=c.id AND p.category='books');
```

**Explanation:** EXISTS avoids duplicate amplification. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** DISTINCT as repair.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-027 — LATERAL (Intermediate)

**Topic:** LATERAL  
**Difficulty:** Intermediate

### Problem statement

Return the latest order for each customer. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the lateral mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT c.id,x.id latest_order_id FROM customers c LEFT JOIN LATERAL(SELECT id FROM orders o WHERE o.customer_id=c.id ORDER BY created_at DESC,id DESC LIMIT 1)x ON true;
```

**Explanation:** LATERAL references the outer row. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** N+1 application queries.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-028 — CTE (Intermediate)

**Topic:** CTE  
**Difficulty:** Intermediate

### Problem statement

Calculate and filter lifetime value. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the cte mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
WITH v AS(SELECT customer_id,sum(total) value FROM orders WHERE status IN('paid','shipped') GROUP BY customer_id) SELECT * FROM v WHERE value>=1000;
```

**Explanation:** A CTE names a transformation. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Assuming an optimization fence.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-029 — Recursive CTE (Intermediate)

**Topic:** Recursive CTE  
**Difficulty:** Intermediate

### Problem statement

Traverse the employee hierarchy. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the recursive cte mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
WITH RECURSIVE org AS(SELECT id,manager_id,0 depth FROM employees WHERE manager_id IS NULL UNION ALL SELECT e.id,e.manager_id,o.depth+1 FROM employees e JOIN org o ON e.manager_id=o.id) SELECT * FROM org;
```

**Explanation:** Anchor and recursive terms iterate. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Ignoring cycles.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-030 — UPSERT (Intermediate)

**Topic:** UPSERT  
**Difficulty:** Intermediate

### Problem statement

Add inventory quantity atomically. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the upsert mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
INSERT INTO inventory(product_id,quantity) VALUES($1,$2) ON CONFLICT(product_id) DO UPDATE SET quantity=inventory.quantity+EXCLUDED.quantity,version=inventory.version+1 RETURNING *;
```

**Explanation:** EXCLUDED exposes proposed values. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Overwriting instead of incrementing.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-031 — Writable CTE (Intermediate)

**Topic:** Writable CTE  
**Difficulty:** Intermediate

### Problem statement

Insert an order and first item in one statement. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the writable cte mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
WITH o AS(INSERT INTO orders(customer_id,status,total) VALUES($1,'pending',$2) RETURNING id) INSERT INTO order_items SELECT id,$3,1,$2 FROM o RETURNING order_id;
```

**Explanation:** Generated keys flow inside one statement. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Assuming separate statements are atomic.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-032 — Partial index (Intermediate)

**Topic:** Partial index  
**Difficulty:** Intermediate

### Problem statement

Index only ready queued jobs. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the partial index mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE INDEX CONCURRENTLY jobs_ready_idx ON jobs(run_at,priority DESC,id) WHERE status='queued';
```

**Explanation:** Partial indexes store matching rows only. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Predicate mismatch.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-033 — Expression index (Intermediate)

**Topic:** Expression index  
**Difficulty:** Intermediate

### Problem statement

Support case-insensitive email lookup. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the expression index mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE INDEX CONCURRENTLY customers_email_lower_idx ON customers(lower(email));
```

**Explanation:** Queries must match the indexed expression. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Broad ILIKE assumption.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-034 — JSONB GIN (Intermediate)

**Topic:** JSONB GIN  
**Difficulty:** Intermediate

### Problem statement

Index attribute containment. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the jsonb gin mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE INDEX CONCURRENTLY products_attributes_gin ON products USING gin(attributes jsonb_path_ops);
```

**Explanation:** Operator classes match operator needs. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Blind operator-class choice.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-035 — Keyset pagination (Intermediate)

**Topic:** Keyset pagination  
**Difficulty:** Intermediate

### Problem statement

Fetch the next order page by cursor. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the keyset pagination mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,created_at,total FROM orders WHERE(created_at,id)<($1,$2) ORDER BY created_at DESC,id DESC LIMIT 50;
```

**Explanation:** Keysets avoid growing OFFSET work. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Cursor/order mismatch.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-036 — Savepoint (Intermediate)

**Topic:** Savepoint  
**Difficulty:** Intermediate

### Problem statement

Recover from one optional write inside a transaction. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the savepoint mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
BEGIN; SAVEPOINT optional; /* write */ ROLLBACK TO SAVEPOINT optional; COMMIT;
```

**Explanation:** Savepoints preserve earlier transaction work. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Continuing an aborted transaction.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-037 — Row locking (Intermediate)

**Topic:** Row locking  
**Difficulty:** Intermediate

### Problem statement

Reserve inventory before decrement. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the row locking mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
BEGIN; SELECT quantity FROM inventory WHERE product_id=$1 FOR UPDATE; UPDATE inventory SET quantity=quantity-1 WHERE product_id=$1 AND quantity>0; COMMIT;
```

**Explanation:** The lock serializes competing changes. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Read then update later.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-038 — SKIP LOCKED (Intermediate)

**Topic:** SKIP LOCKED  
**Difficulty:** Intermediate

### Problem statement

Claim ten jobs without worker blocking. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the skip locked mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
WITH c AS(SELECT id FROM jobs WHERE status='queued' AND run_at<=now() ORDER BY priority DESC,run_at,id FOR UPDATE SKIP LOCKED LIMIT 10) UPDATE jobs j SET status='running',locked_at=now(),locked_by=$1 FROM c WHERE j.id=c.id RETURNING j.*;
```

**Explanation:** SKIP LOCKED fits queue consumers. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Separate select/update.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-039 — Materialized view (Intermediate)

**Topic:** Materialized view  
**Difficulty:** Intermediate

### Problem statement

Build daily revenue cache. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the materialized view mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE MATERIALIZED VIEW daily_revenue AS SELECT date_trunc('day',created_at) day,sum(total) revenue FROM orders WHERE status IN('paid','shipped') GROUP BY 1 WITH NO DATA;
```

**Explanation:** Materialization trades freshness for speed. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** No refresh policy.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-040 — RLS (Intermediate)

**Topic:** RLS  
**Difficulty:** Intermediate

### Problem statement

Enforce tenant visibility and writes. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the rls mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
ALTER TABLE tenant_notes ENABLE ROW LEVEL SECURITY; CREATE POLICY tenant_isolation ON tenant_notes USING(tenant_id=current_setting('app.tenant_id')::bigint) WITH CHECK(tenant_id=current_setting('app.tenant_id')::bigint);
```

**Explanation:** RLS needs USING and WITH CHECK. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Untrusted tenant context.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-041 — Conditional aggregation (Intermediate)

**Topic:** Conditional aggregation  
**Difficulty:** Intermediate

### Problem statement

Count paid, shipped and cancelled orders per customer. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the conditional aggregation mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT customer_id,count(*) FILTER(WHERE status='paid') paid,count(*) FILTER(WHERE status='shipped') shipped,count(*) FILTER(WHERE status='cancelled') cancelled FROM orders GROUP BY customer_id;
```

**Explanation:** FILTER keeps conditions with aggregates. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Three separate scans.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-042 — Window ranking (Intermediate)

**Topic:** Window ranking  
**Difficulty:** Intermediate

### Problem statement

Rank salaries within departments. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the window ranking mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,department,salary,dense_rank() OVER(PARTITION BY department ORDER BY salary DESC) rank FROM employees;
```

**Explanation:** Windows preserve row detail. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** GROUP BY losing rows.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-043 — Running total (Intermediate)

**Topic:** Running total  
**Difficulty:** Intermediate

### Problem statement

Compute cumulative paid revenue. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the running total mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,created_at,total,sum(total) OVER(ORDER BY created_at,id ROWS UNBOUNDED PRECEDING) running FROM orders WHERE status='paid';
```

**Explanation:** ROWS plus tie-breaker defines order. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Default RANGE surprises.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-044 — LAG (Intermediate)

**Topic:** LAG  
**Difficulty:** Intermediate

### Problem statement

Show the previous order total per customer. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the lag mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,customer_id,total,lag(total) OVER(PARTITION BY customer_id ORDER BY created_at,id) previous FROM orders;
```

**Explanation:** LAG avoids a self join. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** No tie-breaker.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-045 — Anti-join (Intermediate)

**Topic:** Anti-join  
**Difficulty:** Intermediate

### Problem statement

Find customers without orders. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the anti-join mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT c.id,c.email FROM customers c WHERE NOT EXISTS(SELECT 1 FROM orders o WHERE o.customer_id=c.id);
```

**Explanation:** NOT EXISTS has safe NULL semantics. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** NOT IN with NULL.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-046 — Semi-join (Intermediate)

**Topic:** Semi-join  
**Difficulty:** Intermediate

### Problem statement

Find customers who bought books. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the semi-join mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT c.id FROM customers c WHERE EXISTS(SELECT 1 FROM orders o JOIN order_items i ON i.order_id=o.id JOIN products p ON p.id=i.product_id WHERE o.customer_id=c.id AND p.category='books');
```

**Explanation:** EXISTS avoids duplicate amplification. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** DISTINCT as repair.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-047 — LATERAL (Intermediate)

**Topic:** LATERAL  
**Difficulty:** Intermediate

### Problem statement

Return the latest order for each customer. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the lateral mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT c.id,x.id latest_order_id FROM customers c LEFT JOIN LATERAL(SELECT id FROM orders o WHERE o.customer_id=c.id ORDER BY created_at DESC,id DESC LIMIT 1)x ON true;
```

**Explanation:** LATERAL references the outer row. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** N+1 application queries.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-048 — CTE (Intermediate)

**Topic:** CTE  
**Difficulty:** Intermediate

### Problem statement

Calculate and filter lifetime value. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the cte mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
WITH v AS(SELECT customer_id,sum(total) value FROM orders WHERE status IN('paid','shipped') GROUP BY customer_id) SELECT * FROM v WHERE value>=1000;
```

**Explanation:** A CTE names a transformation. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Assuming an optimization fence.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-049 — Recursive CTE (Intermediate)

**Topic:** Recursive CTE  
**Difficulty:** Intermediate

### Problem statement

Traverse the employee hierarchy. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the recursive cte mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
WITH RECURSIVE org AS(SELECT id,manager_id,0 depth FROM employees WHERE manager_id IS NULL UNION ALL SELECT e.id,e.manager_id,o.depth+1 FROM employees e JOIN org o ON e.manager_id=o.id) SELECT * FROM org;
```

**Explanation:** Anchor and recursive terms iterate. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Ignoring cycles.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-050 — UPSERT (Intermediate)

**Topic:** UPSERT  
**Difficulty:** Intermediate

### Problem statement

Add inventory quantity atomically. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the upsert mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
INSERT INTO inventory(product_id,quantity) VALUES($1,$2) ON CONFLICT(product_id) DO UPDATE SET quantity=inventory.quantity+EXCLUDED.quantity,version=inventory.version+1 RETURNING *;
```

**Explanation:** EXCLUDED exposes proposed values. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Overwriting instead of incrementing.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-051 — Writable CTE (Intermediate)

**Topic:** Writable CTE  
**Difficulty:** Intermediate

### Problem statement

Insert an order and first item in one statement. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the writable cte mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
WITH o AS(INSERT INTO orders(customer_id,status,total) VALUES($1,'pending',$2) RETURNING id) INSERT INTO order_items SELECT id,$3,1,$2 FROM o RETURNING order_id;
```

**Explanation:** Generated keys flow inside one statement. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Assuming separate statements are atomic.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-052 — Partial index (Intermediate)

**Topic:** Partial index  
**Difficulty:** Intermediate

### Problem statement

Index only ready queued jobs. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the partial index mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE INDEX CONCURRENTLY jobs_ready_idx ON jobs(run_at,priority DESC,id) WHERE status='queued';
```

**Explanation:** Partial indexes store matching rows only. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Predicate mismatch.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-053 — Expression index (Intermediate)

**Topic:** Expression index  
**Difficulty:** Intermediate

### Problem statement

Support case-insensitive email lookup. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the expression index mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE INDEX CONCURRENTLY customers_email_lower_idx ON customers(lower(email));
```

**Explanation:** Queries must match the indexed expression. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Broad ILIKE assumption.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-054 — JSONB GIN (Intermediate)

**Topic:** JSONB GIN  
**Difficulty:** Intermediate

### Problem statement

Index attribute containment. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the jsonb gin mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE INDEX CONCURRENTLY products_attributes_gin ON products USING gin(attributes jsonb_path_ops);
```

**Explanation:** Operator classes match operator needs. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Blind operator-class choice.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-055 — Keyset pagination (Intermediate)

**Topic:** Keyset pagination  
**Difficulty:** Intermediate

### Problem statement

Fetch the next order page by cursor. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the keyset pagination mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,created_at,total FROM orders WHERE(created_at,id)<($1,$2) ORDER BY created_at DESC,id DESC LIMIT 50;
```

**Explanation:** Keysets avoid growing OFFSET work. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Cursor/order mismatch.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-056 — Savepoint (Intermediate)

**Topic:** Savepoint  
**Difficulty:** Intermediate

### Problem statement

Recover from one optional write inside a transaction. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the savepoint mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
BEGIN; SAVEPOINT optional; /* write */ ROLLBACK TO SAVEPOINT optional; COMMIT;
```

**Explanation:** Savepoints preserve earlier transaction work. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Continuing an aborted transaction.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-057 — Row locking (Intermediate)

**Topic:** Row locking  
**Difficulty:** Intermediate

### Problem statement

Reserve inventory before decrement. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the row locking mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
BEGIN; SELECT quantity FROM inventory WHERE product_id=$1 FOR UPDATE; UPDATE inventory SET quantity=quantity-1 WHERE product_id=$1 AND quantity>0; COMMIT;
```

**Explanation:** The lock serializes competing changes. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Read then update later.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-058 — SKIP LOCKED (Intermediate)

**Topic:** SKIP LOCKED  
**Difficulty:** Intermediate

### Problem statement

Claim ten jobs without worker blocking. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the skip locked mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
WITH c AS(SELECT id FROM jobs WHERE status='queued' AND run_at<=now() ORDER BY priority DESC,run_at,id FOR UPDATE SKIP LOCKED LIMIT 10) UPDATE jobs j SET status='running',locked_at=now(),locked_by=$1 FROM c WHERE j.id=c.id RETURNING j.*;
```

**Explanation:** SKIP LOCKED fits queue consumers. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Separate select/update.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-059 — Materialized view (Intermediate)

**Topic:** Materialized view  
**Difficulty:** Intermediate

### Problem statement

Build daily revenue cache. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the materialized view mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE MATERIALIZED VIEW daily_revenue AS SELECT date_trunc('day',created_at) day,sum(total) revenue FROM orders WHERE status IN('paid','shipped') GROUP BY 1 WITH NO DATA;
```

**Explanation:** Materialization trades freshness for speed. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** No refresh policy.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-060 — RLS (Intermediate)

**Topic:** RLS  
**Difficulty:** Intermediate

### Problem statement

Enforce tenant visibility and writes. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the rls mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
ALTER TABLE tenant_notes ENABLE ROW LEVEL SECURITY; CREATE POLICY tenant_isolation ON tenant_notes USING(tenant_id=current_setting('app.tenant_id')::bigint) WITH CHECK(tenant_id=current_setting('app.tenant_id')::bigint);
```

**Explanation:** RLS needs USING and WITH CHECK. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Untrusted tenant context.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-061 — Conditional aggregation (Intermediate)

**Topic:** Conditional aggregation  
**Difficulty:** Intermediate

### Problem statement

Count paid, shipped and cancelled orders per customer. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the conditional aggregation mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT customer_id,count(*) FILTER(WHERE status='paid') paid,count(*) FILTER(WHERE status='shipped') shipped,count(*) FILTER(WHERE status='cancelled') cancelled FROM orders GROUP BY customer_id;
```

**Explanation:** FILTER keeps conditions with aggregates. Context requirement: minimize locks and write amplification.

**Common mistakes:** Three separate scans.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-062 — Window ranking (Intermediate)

**Topic:** Window ranking  
**Difficulty:** Intermediate

### Problem statement

Rank salaries within departments. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the window ranking mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,department,salary,dense_rank() OVER(PARTITION BY department ORDER BY salary DESC) rank FROM employees;
```

**Explanation:** Windows preserve row detail. Context requirement: minimize locks and write amplification.

**Common mistakes:** GROUP BY losing rows.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-063 — Running total (Intermediate)

**Topic:** Running total  
**Difficulty:** Intermediate

### Problem statement

Compute cumulative paid revenue. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the running total mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,created_at,total,sum(total) OVER(ORDER BY created_at,id ROWS UNBOUNDED PRECEDING) running FROM orders WHERE status='paid';
```

**Explanation:** ROWS plus tie-breaker defines order. Context requirement: minimize locks and write amplification.

**Common mistakes:** Default RANGE surprises.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-064 — LAG (Intermediate)

**Topic:** LAG  
**Difficulty:** Intermediate

### Problem statement

Show the previous order total per customer. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the lag mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,customer_id,total,lag(total) OVER(PARTITION BY customer_id ORDER BY created_at,id) previous FROM orders;
```

**Explanation:** LAG avoids a self join. Context requirement: minimize locks and write amplification.

**Common mistakes:** No tie-breaker.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-065 — Anti-join (Intermediate)

**Topic:** Anti-join  
**Difficulty:** Intermediate

### Problem statement

Find customers without orders. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the anti-join mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT c.id,c.email FROM customers c WHERE NOT EXISTS(SELECT 1 FROM orders o WHERE o.customer_id=c.id);
```

**Explanation:** NOT EXISTS has safe NULL semantics. Context requirement: minimize locks and write amplification.

**Common mistakes:** NOT IN with NULL.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-066 — Semi-join (Intermediate)

**Topic:** Semi-join  
**Difficulty:** Intermediate

### Problem statement

Find customers who bought books. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the semi-join mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT c.id FROM customers c WHERE EXISTS(SELECT 1 FROM orders o JOIN order_items i ON i.order_id=o.id JOIN products p ON p.id=i.product_id WHERE o.customer_id=c.id AND p.category='books');
```

**Explanation:** EXISTS avoids duplicate amplification. Context requirement: minimize locks and write amplification.

**Common mistakes:** DISTINCT as repair.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-067 — LATERAL (Intermediate)

**Topic:** LATERAL  
**Difficulty:** Intermediate

### Problem statement

Return the latest order for each customer. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the lateral mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT c.id,x.id latest_order_id FROM customers c LEFT JOIN LATERAL(SELECT id FROM orders o WHERE o.customer_id=c.id ORDER BY created_at DESC,id DESC LIMIT 1)x ON true;
```

**Explanation:** LATERAL references the outer row. Context requirement: minimize locks and write amplification.

**Common mistakes:** N+1 application queries.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-068 — CTE (Intermediate)

**Topic:** CTE  
**Difficulty:** Intermediate

### Problem statement

Calculate and filter lifetime value. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the cte mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
WITH v AS(SELECT customer_id,sum(total) value FROM orders WHERE status IN('paid','shipped') GROUP BY customer_id) SELECT * FROM v WHERE value>=1000;
```

**Explanation:** A CTE names a transformation. Context requirement: minimize locks and write amplification.

**Common mistakes:** Assuming an optimization fence.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-069 — Recursive CTE (Intermediate)

**Topic:** Recursive CTE  
**Difficulty:** Intermediate

### Problem statement

Traverse the employee hierarchy. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the recursive cte mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
WITH RECURSIVE org AS(SELECT id,manager_id,0 depth FROM employees WHERE manager_id IS NULL UNION ALL SELECT e.id,e.manager_id,o.depth+1 FROM employees e JOIN org o ON e.manager_id=o.id) SELECT * FROM org;
```

**Explanation:** Anchor and recursive terms iterate. Context requirement: minimize locks and write amplification.

**Common mistakes:** Ignoring cycles.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-070 — UPSERT (Intermediate)

**Topic:** UPSERT  
**Difficulty:** Intermediate

### Problem statement

Add inventory quantity atomically. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the upsert mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
INSERT INTO inventory(product_id,quantity) VALUES($1,$2) ON CONFLICT(product_id) DO UPDATE SET quantity=inventory.quantity+EXCLUDED.quantity,version=inventory.version+1 RETURNING *;
```

**Explanation:** EXCLUDED exposes proposed values. Context requirement: minimize locks and write amplification.

**Common mistakes:** Overwriting instead of incrementing.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-071 — Writable CTE (Intermediate)

**Topic:** Writable CTE  
**Difficulty:** Intermediate

### Problem statement

Insert an order and first item in one statement. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the writable cte mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
WITH o AS(INSERT INTO orders(customer_id,status,total) VALUES($1,'pending',$2) RETURNING id) INSERT INTO order_items SELECT id,$3,1,$2 FROM o RETURNING order_id;
```

**Explanation:** Generated keys flow inside one statement. Context requirement: minimize locks and write amplification.

**Common mistakes:** Assuming separate statements are atomic.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-072 — Partial index (Intermediate)

**Topic:** Partial index  
**Difficulty:** Intermediate

### Problem statement

Index only ready queued jobs. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the partial index mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE INDEX CONCURRENTLY jobs_ready_idx ON jobs(run_at,priority DESC,id) WHERE status='queued';
```

**Explanation:** Partial indexes store matching rows only. Context requirement: minimize locks and write amplification.

**Common mistakes:** Predicate mismatch.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-073 — Expression index (Intermediate)

**Topic:** Expression index  
**Difficulty:** Intermediate

### Problem statement

Support case-insensitive email lookup. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the expression index mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE INDEX CONCURRENTLY customers_email_lower_idx ON customers(lower(email));
```

**Explanation:** Queries must match the indexed expression. Context requirement: minimize locks and write amplification.

**Common mistakes:** Broad ILIKE assumption.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-074 — JSONB GIN (Intermediate)

**Topic:** JSONB GIN  
**Difficulty:** Intermediate

### Problem statement

Index attribute containment. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the jsonb gin mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE INDEX CONCURRENTLY products_attributes_gin ON products USING gin(attributes jsonb_path_ops);
```

**Explanation:** Operator classes match operator needs. Context requirement: minimize locks and write amplification.

**Common mistakes:** Blind operator-class choice.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-075 — Keyset pagination (Intermediate)

**Topic:** Keyset pagination  
**Difficulty:** Intermediate

### Problem statement

Fetch the next order page by cursor. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the keyset pagination mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,created_at,total FROM orders WHERE(created_at,id)<($1,$2) ORDER BY created_at DESC,id DESC LIMIT 50;
```

**Explanation:** Keysets avoid growing OFFSET work. Context requirement: minimize locks and write amplification.

**Common mistakes:** Cursor/order mismatch.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-076 — Savepoint (Intermediate)

**Topic:** Savepoint  
**Difficulty:** Intermediate

### Problem statement

Recover from one optional write inside a transaction. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the savepoint mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
BEGIN; SAVEPOINT optional; /* write */ ROLLBACK TO SAVEPOINT optional; COMMIT;
```

**Explanation:** Savepoints preserve earlier transaction work. Context requirement: minimize locks and write amplification.

**Common mistakes:** Continuing an aborted transaction.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-077 — Row locking (Intermediate)

**Topic:** Row locking  
**Difficulty:** Intermediate

### Problem statement

Reserve inventory before decrement. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the row locking mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
BEGIN; SELECT quantity FROM inventory WHERE product_id=$1 FOR UPDATE; UPDATE inventory SET quantity=quantity-1 WHERE product_id=$1 AND quantity>0; COMMIT;
```

**Explanation:** The lock serializes competing changes. Context requirement: minimize locks and write amplification.

**Common mistakes:** Read then update later.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-078 — SKIP LOCKED (Intermediate)

**Topic:** SKIP LOCKED  
**Difficulty:** Intermediate

### Problem statement

Claim ten jobs without worker blocking. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the skip locked mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
WITH c AS(SELECT id FROM jobs WHERE status='queued' AND run_at<=now() ORDER BY priority DESC,run_at,id FOR UPDATE SKIP LOCKED LIMIT 10) UPDATE jobs j SET status='running',locked_at=now(),locked_by=$1 FROM c WHERE j.id=c.id RETURNING j.*;
```

**Explanation:** SKIP LOCKED fits queue consumers. Context requirement: minimize locks and write amplification.

**Common mistakes:** Separate select/update.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-079 — Materialized view (Intermediate)

**Topic:** Materialized view  
**Difficulty:** Intermediate

### Problem statement

Build daily revenue cache. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the materialized view mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE MATERIALIZED VIEW daily_revenue AS SELECT date_trunc('day',created_at) day,sum(total) revenue FROM orders WHERE status IN('paid','shipped') GROUP BY 1 WITH NO DATA;
```

**Explanation:** Materialization trades freshness for speed. Context requirement: minimize locks and write amplification.

**Common mistakes:** No refresh policy.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-080 — RLS (Intermediate)

**Topic:** RLS  
**Difficulty:** Intermediate

### Problem statement

Enforce tenant visibility and writes. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the rls mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
ALTER TABLE tenant_notes ENABLE ROW LEVEL SECURITY; CREATE POLICY tenant_isolation ON tenant_notes USING(tenant_id=current_setting('app.tenant_id')::bigint) WITH CHECK(tenant_id=current_setting('app.tenant_id')::bigint);
```

**Explanation:** RLS needs USING and WITH CHECK. Context requirement: minimize locks and write amplification.

**Common mistakes:** Untrusted tenant context.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-081 — Conditional aggregation (Intermediate)

**Topic:** Conditional aggregation  
**Difficulty:** Intermediate

### Problem statement

Count paid, shipped and cancelled orders per customer. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the conditional aggregation mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT customer_id,count(*) FILTER(WHERE status='paid') paid,count(*) FILTER(WHERE status='shipped') shipped,count(*) FILTER(WHERE status='cancelled') cancelled FROM orders GROUP BY customer_id;
```

**Explanation:** FILTER keeps conditions with aggregates. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Three separate scans.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-082 — Window ranking (Intermediate)

**Topic:** Window ranking  
**Difficulty:** Intermediate

### Problem statement

Rank salaries within departments. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the window ranking mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,department,salary,dense_rank() OVER(PARTITION BY department ORDER BY salary DESC) rank FROM employees;
```

**Explanation:** Windows preserve row detail. Context requirement: preserve evidence and define rollback.

**Common mistakes:** GROUP BY losing rows.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-083 — Running total (Intermediate)

**Topic:** Running total  
**Difficulty:** Intermediate

### Problem statement

Compute cumulative paid revenue. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the running total mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,created_at,total,sum(total) OVER(ORDER BY created_at,id ROWS UNBOUNDED PRECEDING) running FROM orders WHERE status='paid';
```

**Explanation:** ROWS plus tie-breaker defines order. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Default RANGE surprises.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-084 — LAG (Intermediate)

**Topic:** LAG  
**Difficulty:** Intermediate

### Problem statement

Show the previous order total per customer. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the lag mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,customer_id,total,lag(total) OVER(PARTITION BY customer_id ORDER BY created_at,id) previous FROM orders;
```

**Explanation:** LAG avoids a self join. Context requirement: preserve evidence and define rollback.

**Common mistakes:** No tie-breaker.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-085 — Anti-join (Intermediate)

**Topic:** Anti-join  
**Difficulty:** Intermediate

### Problem statement

Find customers without orders. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the anti-join mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT c.id,c.email FROM customers c WHERE NOT EXISTS(SELECT 1 FROM orders o WHERE o.customer_id=c.id);
```

**Explanation:** NOT EXISTS has safe NULL semantics. Context requirement: preserve evidence and define rollback.

**Common mistakes:** NOT IN with NULL.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-086 — Semi-join (Intermediate)

**Topic:** Semi-join  
**Difficulty:** Intermediate

### Problem statement

Find customers who bought books. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the semi-join mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT c.id FROM customers c WHERE EXISTS(SELECT 1 FROM orders o JOIN order_items i ON i.order_id=o.id JOIN products p ON p.id=i.product_id WHERE o.customer_id=c.id AND p.category='books');
```

**Explanation:** EXISTS avoids duplicate amplification. Context requirement: preserve evidence and define rollback.

**Common mistakes:** DISTINCT as repair.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-087 — LATERAL (Intermediate)

**Topic:** LATERAL  
**Difficulty:** Intermediate

### Problem statement

Return the latest order for each customer. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the lateral mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT c.id,x.id latest_order_id FROM customers c LEFT JOIN LATERAL(SELECT id FROM orders o WHERE o.customer_id=c.id ORDER BY created_at DESC,id DESC LIMIT 1)x ON true;
```

**Explanation:** LATERAL references the outer row. Context requirement: preserve evidence and define rollback.

**Common mistakes:** N+1 application queries.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-088 — CTE (Intermediate)

**Topic:** CTE  
**Difficulty:** Intermediate

### Problem statement

Calculate and filter lifetime value. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the cte mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
WITH v AS(SELECT customer_id,sum(total) value FROM orders WHERE status IN('paid','shipped') GROUP BY customer_id) SELECT * FROM v WHERE value>=1000;
```

**Explanation:** A CTE names a transformation. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Assuming an optimization fence.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-089 — Recursive CTE (Intermediate)

**Topic:** Recursive CTE  
**Difficulty:** Intermediate

### Problem statement

Traverse the employee hierarchy. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the recursive cte mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
WITH RECURSIVE org AS(SELECT id,manager_id,0 depth FROM employees WHERE manager_id IS NULL UNION ALL SELECT e.id,e.manager_id,o.depth+1 FROM employees e JOIN org o ON e.manager_id=o.id) SELECT * FROM org;
```

**Explanation:** Anchor and recursive terms iterate. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Ignoring cycles.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-090 — UPSERT (Intermediate)

**Topic:** UPSERT  
**Difficulty:** Intermediate

### Problem statement

Add inventory quantity atomically. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the upsert mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
INSERT INTO inventory(product_id,quantity) VALUES($1,$2) ON CONFLICT(product_id) DO UPDATE SET quantity=inventory.quantity+EXCLUDED.quantity,version=inventory.version+1 RETURNING *;
```

**Explanation:** EXCLUDED exposes proposed values. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Overwriting instead of incrementing.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-091 — Writable CTE (Intermediate)

**Topic:** Writable CTE  
**Difficulty:** Intermediate

### Problem statement

Insert an order and first item in one statement. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the writable cte mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
WITH o AS(INSERT INTO orders(customer_id,status,total) VALUES($1,'pending',$2) RETURNING id) INSERT INTO order_items SELECT id,$3,1,$2 FROM o RETURNING order_id;
```

**Explanation:** Generated keys flow inside one statement. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Assuming separate statements are atomic.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-092 — Partial index (Intermediate)

**Topic:** Partial index  
**Difficulty:** Intermediate

### Problem statement

Index only ready queued jobs. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the partial index mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE INDEX CONCURRENTLY jobs_ready_idx ON jobs(run_at,priority DESC,id) WHERE status='queued';
```

**Explanation:** Partial indexes store matching rows only. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Predicate mismatch.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-093 — Expression index (Intermediate)

**Topic:** Expression index  
**Difficulty:** Intermediate

### Problem statement

Support case-insensitive email lookup. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the expression index mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE INDEX CONCURRENTLY customers_email_lower_idx ON customers(lower(email));
```

**Explanation:** Queries must match the indexed expression. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Broad ILIKE assumption.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-094 — JSONB GIN (Intermediate)

**Topic:** JSONB GIN  
**Difficulty:** Intermediate

### Problem statement

Index attribute containment. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the jsonb gin mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE INDEX CONCURRENTLY products_attributes_gin ON products USING gin(attributes jsonb_path_ops);
```

**Explanation:** Operator classes match operator needs. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Blind operator-class choice.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-095 — Keyset pagination (Intermediate)

**Topic:** Keyset pagination  
**Difficulty:** Intermediate

### Problem statement

Fetch the next order page by cursor. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the keyset pagination mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,created_at,total FROM orders WHERE(created_at,id)<($1,$2) ORDER BY created_at DESC,id DESC LIMIT 50;
```

**Explanation:** Keysets avoid growing OFFSET work. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Cursor/order mismatch.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-096 — Savepoint (Intermediate)

**Topic:** Savepoint  
**Difficulty:** Intermediate

### Problem statement

Recover from one optional write inside a transaction. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the savepoint mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
BEGIN; SAVEPOINT optional; /* write */ ROLLBACK TO SAVEPOINT optional; COMMIT;
```

**Explanation:** Savepoints preserve earlier transaction work. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Continuing an aborted transaction.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-097 — Row locking (Intermediate)

**Topic:** Row locking  
**Difficulty:** Intermediate

### Problem statement

Reserve inventory before decrement. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the row locking mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
BEGIN; SELECT quantity FROM inventory WHERE product_id=$1 FOR UPDATE; UPDATE inventory SET quantity=quantity-1 WHERE product_id=$1 AND quantity>0; COMMIT;
```

**Explanation:** The lock serializes competing changes. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Read then update later.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-098 — SKIP LOCKED (Intermediate)

**Topic:** SKIP LOCKED  
**Difficulty:** Intermediate

### Problem statement

Claim ten jobs without worker blocking. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the skip locked mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
WITH c AS(SELECT id FROM jobs WHERE status='queued' AND run_at<=now() ORDER BY priority DESC,run_at,id FOR UPDATE SKIP LOCKED LIMIT 10) UPDATE jobs j SET status='running',locked_at=now(),locked_by=$1 FROM c WHERE j.id=c.id RETURNING j.*;
```

**Explanation:** SKIP LOCKED fits queue consumers. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Separate select/update.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-099 — Materialized view (Intermediate)

**Topic:** Materialized view  
**Difficulty:** Intermediate

### Problem statement

Build daily revenue cache. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the materialized view mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE MATERIALIZED VIEW daily_revenue AS SELECT date_trunc('day',created_at) day,sum(total) revenue FROM orders WHERE status IN('paid','shipped') GROUP BY 1 WITH NO DATA;
```

**Explanation:** Materialization trades freshness for speed. Context requirement: preserve evidence and define rollback.

**Common mistakes:** No refresh policy.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-I-100 — RLS (Intermediate)

**Topic:** RLS  
**Difficulty:** Intermediate

### Problem statement

Enforce tenant visibility and writes. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the rls mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
ALTER TABLE tenant_notes ENABLE ROW LEVEL SECURITY; CREATE POLICY tenant_isolation ON tenant_notes USING(tenant_id=current_setting('app.tenant_id')::bigint) WITH CHECK(tenant_id=current_setting('app.tenant_id')::bigint);
```

**Explanation:** RLS needs USING and WITH CHECK. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Untrusted tenant context.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>
