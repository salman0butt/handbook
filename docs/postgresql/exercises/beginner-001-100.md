---
title: "Beginner PostgreSQL Exercises"
description: "Exactly 100 canonical beginner PostgreSQL exercises."
---

# Beginner PostgreSQL Exercises

## PG-B-001 — Projection (Beginner)

**Topic:** Projection  
**Difficulty:** Beginner

### Problem statement

Return customer IDs and emails in stable order. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the projection mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,email FROM customers ORDER BY id;
```

**Explanation:** Explicit projection avoids accidental schema coupling. Context requirement: use the shared schema.

**Common mistakes:** SELECT * and missing ORDER BY.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-002 — Filtering (Beginner)

**Topic:** Filtering  
**Difficulty:** Beginner

### Problem statement

Return paid orders of at least 100. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the filtering mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,customer_id,total FROM orders WHERE status='paid' AND total>=100 ORDER BY id;
```

**Explanation:** Predicates narrow rows before projection. Context requirement: use the shared schema.

**Common mistakes:** Using OR or text comparison.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-003 — NULL semantics (Beginner)

**Topic:** NULL semantics  
**Difficulty:** Beginner

### Problem statement

Find customers whose country is unknown. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the null semantics mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,email FROM customers WHERE country IS NULL ORDER BY id;
```

**Explanation:** NULL uses three-valued logic. Context requirement: use the shared schema.

**Common mistakes:** Writing country = NULL.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-004 — Limit and sort (Beginner)

**Topic:** Limit and sort  
**Difficulty:** Beginner

### Problem statement

Return the five most expensive products. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the limit and sort mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,sku,price FROM products ORDER BY price DESC,id LIMIT 5;
```

**Explanation:** A tie-breaker makes LIMIT deterministic. Context requirement: use the shared schema.

**Common mistakes:** LIMIT without ORDER BY.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-005 — Expressions (Beginner)

**Topic:** Expressions  
**Difficulty:** Beginner

### Problem statement

Calculate every order-item line total. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the expressions mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT order_id,product_id,quantity*unit_price AS line_total FROM order_items ORDER BY order_id,product_id;
```

**Explanation:** Derived values need not be stored. Context requirement: use the shared schema.

**Common mistakes:** Storing redundant totals.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-006 — CASE (Beginner)

**Topic:** CASE  
**Difficulty:** Beginner

### Problem statement

Classify products into three price bands. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the case mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT sku,CASE WHEN price<25 THEN 'budget' WHEN price<100 THEN 'standard' ELSE 'premium' END AS band FROM products ORDER BY sku;
```

**Explanation:** CASE branches are evaluated in order. Context requirement: use the shared schema.

**Common mistakes:** Broad condition first.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-007 — COALESCE (Beginner)

**Topic:** COALESCE  
**Difficulty:** Beginner

### Problem statement

Display Unknown for missing country. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the coalesce mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT email,COALESCE(country,'Unknown') AS country FROM customers ORDER BY email;
```

**Explanation:** COALESCE returns the first non-null value. Context requirement: use the shared schema.

**Common mistakes:** Mutating data for display fallback.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-008 — INSERT RETURNING (Beginner)

**Topic:** INSERT RETURNING  
**Difficulty:** Beginner

### Problem statement

Insert a customer and return generated fields. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the insert returning mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
INSERT INTO customers(email,country) VALUES($1,$2) RETURNING id,email,created_at;
```

**Explanation:** RETURNING avoids a second lookup. Context requirement: use the shared schema.

**Common mistakes:** Guessing identity values.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-009 — Guarded UPDATE (Beginner)

**Topic:** Guarded UPDATE  
**Difficulty:** Beginner

### Problem statement

Raise book prices by five percent. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the guarded update mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
UPDATE products SET price=round(price*1.05,2) WHERE category='books' RETURNING id,sku,price;
```

**Explanation:** A WHERE clause limits impact. Context requirement: use the shared schema.

**Common mistakes:** Unbounded UPDATE.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-010 — Safe DELETE (Beginner)

**Topic:** Safe DELETE  
**Difficulty:** Beginner

### Problem statement

Delete old cancelled orders and show IDs. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the safe delete mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
DELETE FROM orders WHERE status='cancelled' AND created_at<$1 RETURNING id;
```

**Explanation:** RETURNING records affected rows. Context requirement: use the shared schema.

**Common mistakes:** Deleting before preview.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-011 — INNER JOIN (Beginner)

**Topic:** INNER JOIN  
**Difficulty:** Beginner

### Problem statement

List orders with customer emails. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the inner join mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT o.id,c.email FROM orders o JOIN customers c ON c.id=o.customer_id ORDER BY o.id;
```

**Explanation:** Join predicates express row correspondence. Context requirement: use the shared schema.

**Common mistakes:** Joining unrelated text.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-012 — LEFT JOIN (Beginner)

**Topic:** LEFT JOIN  
**Difficulty:** Beginner

### Problem statement

Count orders for every customer including zero. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the left join mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT c.id,c.email,count(o.id) AS n FROM customers c LEFT JOIN orders o ON o.customer_id=c.id GROUP BY c.id,c.email ORDER BY c.id;
```

**Explanation:** Count a nullable child key after an outer join. Context requirement: use the shared schema.

**Common mistakes:** COUNT(*) returning one.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-013 — Aggregate (Beginner)

**Topic:** Aggregate  
**Difficulty:** Beginner

### Problem statement

Calculate paid revenue with zero fallback. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the aggregate mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT COALESCE(sum(total),0)::numeric(14,2) FROM orders WHERE status='paid';
```

**Explanation:** SUM over empty input is NULL. Context requirement: use the shared schema.

**Common mistakes:** Assuming zero.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-014 — GROUP BY (Beginner)

**Topic:** GROUP BY  
**Difficulty:** Beginner

### Problem statement

Count products by category. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the group by mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT category,count(*) AS n FROM products GROUP BY category ORDER BY n DESC,category;
```

**Explanation:** Non-aggregate selections must be grouped. Context requirement: use the shared schema.

**Common mistakes:** Selecting ungrouped columns.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-015 — HAVING (Beginner)

**Topic:** HAVING  
**Difficulty:** Beginner

### Problem statement

Find customers with at least three orders. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the having mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT customer_id,count(*) AS n FROM orders GROUP BY customer_id HAVING count(*)>=3 ORDER BY customer_id;
```

**Explanation:** HAVING filters groups. Context requirement: use the shared schema.

**Common mistakes:** Aggregate in WHERE.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-016 — Time zones (Beginner)

**Topic:** Time zones  
**Difficulty:** Beginner

### Problem statement

Count orders per UTC day. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the time zones mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT date_trunc('day',created_at AT TIME ZONE 'UTC') AS day,count(*) FROM orders GROUP BY day ORDER BY day;
```

**Explanation:** Reporting boundaries require an explicit zone. Context requirement: use the shared schema.

**Common mistakes:** Session-dependent casts.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-017 — Casting (Beginner)

**Topic:** Casting  
**Difficulty:** Beginner

### Problem statement

Build a product text label. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the casting mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,'product-'||id::text AS label FROM products ORDER BY id;
```

**Explanation:** Explicit casts document intent. Context requirement: use the shared schema.

**Common mistakes:** Ambiguous implicit casts.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-018 — Arrays (Beginner)

**Topic:** Arrays  
**Difficulty:** Beginner

### Problem statement

Find products tagged featured. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the arrays mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,sku FROM products WHERE tags @> ARRAY['featured'] ORDER BY id;
```

**Explanation:** Containment can be indexed with GIN. Context requirement: use the shared schema.

**Common mistakes:** LIKE on array text.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-019 — JSONB (Beginner)

**Topic:** JSONB  
**Difficulty:** Beginner

### Problem statement

Find red products by containment. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the jsonb mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,sku FROM products WHERE attributes @> '{"color":"red"}'::jsonb ORDER BY id;
```

**Explanation:** JSONB containment is indexable. Context requirement: use the shared schema.

**Common mistakes:** Comparing JSON as text.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-020 — Constraints (Beginner)

**Topic:** Constraints  
**Difficulty:** Beginner

### Problem statement

Create valid percentage coupons. Apply it in the **Core commerce** context.

### Requirements

Use PostgreSQL 18.4; use the shared schema; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the constraints mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE TABLE coupons(id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,code text NOT NULL UNIQUE,discount numeric(5,2) NOT NULL CHECK(discount>0 AND discount<=100));
```

**Explanation:** Constraints protect every caller. Context requirement: use the shared schema.

**Common mistakes:** Application-only validation.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-021 — Projection (Beginner)

**Topic:** Projection  
**Difficulty:** Beginner

### Problem statement

Return customer IDs and emails in stable order. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the projection mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,email FROM customers ORDER BY id;
```

**Explanation:** Explicit projection avoids accidental schema coupling. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** SELECT * and missing ORDER BY.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-022 — Filtering (Beginner)

**Topic:** Filtering  
**Difficulty:** Beginner

### Problem statement

Return paid orders of at least 100. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the filtering mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,customer_id,total FROM orders WHERE status='paid' AND total>=100 ORDER BY id;
```

**Explanation:** Predicates narrow rows before projection. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Using OR or text comparison.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-023 — NULL semantics (Beginner)

**Topic:** NULL semantics  
**Difficulty:** Beginner

### Problem statement

Find customers whose country is unknown. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the null semantics mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,email FROM customers WHERE country IS NULL ORDER BY id;
```

**Explanation:** NULL uses three-valued logic. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Writing country = NULL.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-024 — Limit and sort (Beginner)

**Topic:** Limit and sort  
**Difficulty:** Beginner

### Problem statement

Return the five most expensive products. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the limit and sort mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,sku,price FROM products ORDER BY price DESC,id LIMIT 5;
```

**Explanation:** A tie-breaker makes LIMIT deterministic. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** LIMIT without ORDER BY.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-025 — Expressions (Beginner)

**Topic:** Expressions  
**Difficulty:** Beginner

### Problem statement

Calculate every order-item line total. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the expressions mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT order_id,product_id,quantity*unit_price AS line_total FROM order_items ORDER BY order_id,product_id;
```

**Explanation:** Derived values need not be stored. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Storing redundant totals.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-026 — CASE (Beginner)

**Topic:** CASE  
**Difficulty:** Beginner

### Problem statement

Classify products into three price bands. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the case mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT sku,CASE WHEN price<25 THEN 'budget' WHEN price<100 THEN 'standard' ELSE 'premium' END AS band FROM products ORDER BY sku;
```

**Explanation:** CASE branches are evaluated in order. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Broad condition first.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-027 — COALESCE (Beginner)

**Topic:** COALESCE  
**Difficulty:** Beginner

### Problem statement

Display Unknown for missing country. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the coalesce mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT email,COALESCE(country,'Unknown') AS country FROM customers ORDER BY email;
```

**Explanation:** COALESCE returns the first non-null value. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Mutating data for display fallback.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-028 — INSERT RETURNING (Beginner)

**Topic:** INSERT RETURNING  
**Difficulty:** Beginner

### Problem statement

Insert a customer and return generated fields. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the insert returning mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
INSERT INTO customers(email,country) VALUES($1,$2) RETURNING id,email,created_at;
```

**Explanation:** RETURNING avoids a second lookup. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Guessing identity values.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-029 — Guarded UPDATE (Beginner)

**Topic:** Guarded UPDATE  
**Difficulty:** Beginner

### Problem statement

Raise book prices by five percent. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the guarded update mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
UPDATE products SET price=round(price*1.05,2) WHERE category='books' RETURNING id,sku,price;
```

**Explanation:** A WHERE clause limits impact. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Unbounded UPDATE.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-030 — Safe DELETE (Beginner)

**Topic:** Safe DELETE  
**Difficulty:** Beginner

### Problem statement

Delete old cancelled orders and show IDs. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the safe delete mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
DELETE FROM orders WHERE status='cancelled' AND created_at<$1 RETURNING id;
```

**Explanation:** RETURNING records affected rows. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Deleting before preview.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-031 — INNER JOIN (Beginner)

**Topic:** INNER JOIN  
**Difficulty:** Beginner

### Problem statement

List orders with customer emails. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the inner join mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT o.id,c.email FROM orders o JOIN customers c ON c.id=o.customer_id ORDER BY o.id;
```

**Explanation:** Join predicates express row correspondence. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Joining unrelated text.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-032 — LEFT JOIN (Beginner)

**Topic:** LEFT JOIN  
**Difficulty:** Beginner

### Problem statement

Count orders for every customer including zero. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the left join mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT c.id,c.email,count(o.id) AS n FROM customers c LEFT JOIN orders o ON o.customer_id=c.id GROUP BY c.id,c.email ORDER BY c.id;
```

**Explanation:** Count a nullable child key after an outer join. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** COUNT(*) returning one.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-033 — Aggregate (Beginner)

**Topic:** Aggregate  
**Difficulty:** Beginner

### Problem statement

Calculate paid revenue with zero fallback. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the aggregate mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT COALESCE(sum(total),0)::numeric(14,2) FROM orders WHERE status='paid';
```

**Explanation:** SUM over empty input is NULL. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Assuming zero.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-034 — GROUP BY (Beginner)

**Topic:** GROUP BY  
**Difficulty:** Beginner

### Problem statement

Count products by category. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the group by mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT category,count(*) AS n FROM products GROUP BY category ORDER BY n DESC,category;
```

**Explanation:** Non-aggregate selections must be grouped. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Selecting ungrouped columns.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-035 — HAVING (Beginner)

**Topic:** HAVING  
**Difficulty:** Beginner

### Problem statement

Find customers with at least three orders. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the having mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT customer_id,count(*) AS n FROM orders GROUP BY customer_id HAVING count(*)>=3 ORDER BY customer_id;
```

**Explanation:** HAVING filters groups. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Aggregate in WHERE.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-036 — Time zones (Beginner)

**Topic:** Time zones  
**Difficulty:** Beginner

### Problem statement

Count orders per UTC day. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the time zones mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT date_trunc('day',created_at AT TIME ZONE 'UTC') AS day,count(*) FROM orders GROUP BY day ORDER BY day;
```

**Explanation:** Reporting boundaries require an explicit zone. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Session-dependent casts.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-037 — Casting (Beginner)

**Topic:** Casting  
**Difficulty:** Beginner

### Problem statement

Build a product text label. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the casting mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,'product-'||id::text AS label FROM products ORDER BY id;
```

**Explanation:** Explicit casts document intent. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Ambiguous implicit casts.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-038 — Arrays (Beginner)

**Topic:** Arrays  
**Difficulty:** Beginner

### Problem statement

Find products tagged featured. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the arrays mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,sku FROM products WHERE tags @> ARRAY['featured'] ORDER BY id;
```

**Explanation:** Containment can be indexed with GIN. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** LIKE on array text.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-039 — JSONB (Beginner)

**Topic:** JSONB  
**Difficulty:** Beginner

### Problem statement

Find red products by containment. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the jsonb mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,sku FROM products WHERE attributes @> '{"color":"red"}'::jsonb ORDER BY id;
```

**Explanation:** JSONB containment is indexable. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Comparing JSON as text.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-040 — Constraints (Beginner)

**Topic:** Constraints  
**Difficulty:** Beginner

### Problem statement

Create valid percentage coupons. Apply it in the **Tenant-aware API** context.

### Requirements

Use PostgreSQL 18.4; add tenant predicates and RLS reasoning; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the constraints mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE TABLE coupons(id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,code text NOT NULL UNIQUE,discount numeric(5,2) NOT NULL CHECK(discount>0 AND discount<=100));
```

**Explanation:** Constraints protect every caller. Context requirement: add tenant predicates and RLS reasoning.

**Common mistakes:** Application-only validation.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-041 — Projection (Beginner)

**Topic:** Projection  
**Difficulty:** Beginner

### Problem statement

Return customer IDs and emails in stable order. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the projection mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,email FROM customers ORDER BY id;
```

**Explanation:** Explicit projection avoids accidental schema coupling. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** SELECT * and missing ORDER BY.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-042 — Filtering (Beginner)

**Topic:** Filtering  
**Difficulty:** Beginner

### Problem statement

Return paid orders of at least 100. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the filtering mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,customer_id,total FROM orders WHERE status='paid' AND total>=100 ORDER BY id;
```

**Explanation:** Predicates narrow rows before projection. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Using OR or text comparison.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-043 — NULL semantics (Beginner)

**Topic:** NULL semantics  
**Difficulty:** Beginner

### Problem statement

Find customers whose country is unknown. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the null semantics mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,email FROM customers WHERE country IS NULL ORDER BY id;
```

**Explanation:** NULL uses three-valued logic. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Writing country = NULL.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-044 — Limit and sort (Beginner)

**Topic:** Limit and sort  
**Difficulty:** Beginner

### Problem statement

Return the five most expensive products. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the limit and sort mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,sku,price FROM products ORDER BY price DESC,id LIMIT 5;
```

**Explanation:** A tie-breaker makes LIMIT deterministic. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** LIMIT without ORDER BY.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-045 — Expressions (Beginner)

**Topic:** Expressions  
**Difficulty:** Beginner

### Problem statement

Calculate every order-item line total. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the expressions mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT order_id,product_id,quantity*unit_price AS line_total FROM order_items ORDER BY order_id,product_id;
```

**Explanation:** Derived values need not be stored. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Storing redundant totals.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-046 — CASE (Beginner)

**Topic:** CASE  
**Difficulty:** Beginner

### Problem statement

Classify products into three price bands. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the case mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT sku,CASE WHEN price<25 THEN 'budget' WHEN price<100 THEN 'standard' ELSE 'premium' END AS band FROM products ORDER BY sku;
```

**Explanation:** CASE branches are evaluated in order. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Broad condition first.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-047 — COALESCE (Beginner)

**Topic:** COALESCE  
**Difficulty:** Beginner

### Problem statement

Display Unknown for missing country. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the coalesce mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT email,COALESCE(country,'Unknown') AS country FROM customers ORDER BY email;
```

**Explanation:** COALESCE returns the first non-null value. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Mutating data for display fallback.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-048 — INSERT RETURNING (Beginner)

**Topic:** INSERT RETURNING  
**Difficulty:** Beginner

### Problem statement

Insert a customer and return generated fields. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the insert returning mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
INSERT INTO customers(email,country) VALUES($1,$2) RETURNING id,email,created_at;
```

**Explanation:** RETURNING avoids a second lookup. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Guessing identity values.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-049 — Guarded UPDATE (Beginner)

**Topic:** Guarded UPDATE  
**Difficulty:** Beginner

### Problem statement

Raise book prices by five percent. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the guarded update mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
UPDATE products SET price=round(price*1.05,2) WHERE category='books' RETURNING id,sku,price;
```

**Explanation:** A WHERE clause limits impact. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Unbounded UPDATE.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-050 — Safe DELETE (Beginner)

**Topic:** Safe DELETE  
**Difficulty:** Beginner

### Problem statement

Delete old cancelled orders and show IDs. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the safe delete mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
DELETE FROM orders WHERE status='cancelled' AND created_at<$1 RETURNING id;
```

**Explanation:** RETURNING records affected rows. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Deleting before preview.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-051 — INNER JOIN (Beginner)

**Topic:** INNER JOIN  
**Difficulty:** Beginner

### Problem statement

List orders with customer emails. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the inner join mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT o.id,c.email FROM orders o JOIN customers c ON c.id=o.customer_id ORDER BY o.id;
```

**Explanation:** Join predicates express row correspondence. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Joining unrelated text.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-052 — LEFT JOIN (Beginner)

**Topic:** LEFT JOIN  
**Difficulty:** Beginner

### Problem statement

Count orders for every customer including zero. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the left join mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT c.id,c.email,count(o.id) AS n FROM customers c LEFT JOIN orders o ON o.customer_id=c.id GROUP BY c.id,c.email ORDER BY c.id;
```

**Explanation:** Count a nullable child key after an outer join. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** COUNT(*) returning one.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-053 — Aggregate (Beginner)

**Topic:** Aggregate  
**Difficulty:** Beginner

### Problem statement

Calculate paid revenue with zero fallback. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the aggregate mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT COALESCE(sum(total),0)::numeric(14,2) FROM orders WHERE status='paid';
```

**Explanation:** SUM over empty input is NULL. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Assuming zero.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-054 — GROUP BY (Beginner)

**Topic:** GROUP BY  
**Difficulty:** Beginner

### Problem statement

Count products by category. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the group by mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT category,count(*) AS n FROM products GROUP BY category ORDER BY n DESC,category;
```

**Explanation:** Non-aggregate selections must be grouped. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Selecting ungrouped columns.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-055 — HAVING (Beginner)

**Topic:** HAVING  
**Difficulty:** Beginner

### Problem statement

Find customers with at least three orders. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the having mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT customer_id,count(*) AS n FROM orders GROUP BY customer_id HAVING count(*)>=3 ORDER BY customer_id;
```

**Explanation:** HAVING filters groups. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Aggregate in WHERE.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-056 — Time zones (Beginner)

**Topic:** Time zones  
**Difficulty:** Beginner

### Problem statement

Count orders per UTC day. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the time zones mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT date_trunc('day',created_at AT TIME ZONE 'UTC') AS day,count(*) FROM orders GROUP BY day ORDER BY day;
```

**Explanation:** Reporting boundaries require an explicit zone. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Session-dependent casts.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-057 — Casting (Beginner)

**Topic:** Casting  
**Difficulty:** Beginner

### Problem statement

Build a product text label. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the casting mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,'product-'||id::text AS label FROM products ORDER BY id;
```

**Explanation:** Explicit casts document intent. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Ambiguous implicit casts.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-058 — Arrays (Beginner)

**Topic:** Arrays  
**Difficulty:** Beginner

### Problem statement

Find products tagged featured. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the arrays mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,sku FROM products WHERE tags @> ARRAY['featured'] ORDER BY id;
```

**Explanation:** Containment can be indexed with GIN. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** LIKE on array text.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-059 — JSONB (Beginner)

**Topic:** JSONB  
**Difficulty:** Beginner

### Problem statement

Find red products by containment. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the jsonb mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,sku FROM products WHERE attributes @> '{"color":"red"}'::jsonb ORDER BY id;
```

**Explanation:** JSONB containment is indexable. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Comparing JSON as text.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-060 — Constraints (Beginner)

**Topic:** Constraints  
**Difficulty:** Beginner

### Problem statement

Create valid percentage coupons. Apply it in the **Reporting batch** context.

### Requirements

Use PostgreSQL 18.4; make ordering and time zones deterministic; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the constraints mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE TABLE coupons(id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,code text NOT NULL UNIQUE,discount numeric(5,2) NOT NULL CHECK(discount>0 AND discount<=100));
```

**Explanation:** Constraints protect every caller. Context requirement: make ordering and time zones deterministic.

**Common mistakes:** Application-only validation.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-061 — Projection (Beginner)

**Topic:** Projection  
**Difficulty:** Beginner

### Problem statement

Return customer IDs and emails in stable order. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the projection mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,email FROM customers ORDER BY id;
```

**Explanation:** Explicit projection avoids accidental schema coupling. Context requirement: minimize locks and write amplification.

**Common mistakes:** SELECT * and missing ORDER BY.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-062 — Filtering (Beginner)

**Topic:** Filtering  
**Difficulty:** Beginner

### Problem statement

Return paid orders of at least 100. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the filtering mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,customer_id,total FROM orders WHERE status='paid' AND total>=100 ORDER BY id;
```

**Explanation:** Predicates narrow rows before projection. Context requirement: minimize locks and write amplification.

**Common mistakes:** Using OR or text comparison.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-063 — NULL semantics (Beginner)

**Topic:** NULL semantics  
**Difficulty:** Beginner

### Problem statement

Find customers whose country is unknown. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the null semantics mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,email FROM customers WHERE country IS NULL ORDER BY id;
```

**Explanation:** NULL uses three-valued logic. Context requirement: minimize locks and write amplification.

**Common mistakes:** Writing country = NULL.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-064 — Limit and sort (Beginner)

**Topic:** Limit and sort  
**Difficulty:** Beginner

### Problem statement

Return the five most expensive products. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the limit and sort mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,sku,price FROM products ORDER BY price DESC,id LIMIT 5;
```

**Explanation:** A tie-breaker makes LIMIT deterministic. Context requirement: minimize locks and write amplification.

**Common mistakes:** LIMIT without ORDER BY.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-065 — Expressions (Beginner)

**Topic:** Expressions  
**Difficulty:** Beginner

### Problem statement

Calculate every order-item line total. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the expressions mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT order_id,product_id,quantity*unit_price AS line_total FROM order_items ORDER BY order_id,product_id;
```

**Explanation:** Derived values need not be stored. Context requirement: minimize locks and write amplification.

**Common mistakes:** Storing redundant totals.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-066 — CASE (Beginner)

**Topic:** CASE  
**Difficulty:** Beginner

### Problem statement

Classify products into three price bands. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the case mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT sku,CASE WHEN price<25 THEN 'budget' WHEN price<100 THEN 'standard' ELSE 'premium' END AS band FROM products ORDER BY sku;
```

**Explanation:** CASE branches are evaluated in order. Context requirement: minimize locks and write amplification.

**Common mistakes:** Broad condition first.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-067 — COALESCE (Beginner)

**Topic:** COALESCE  
**Difficulty:** Beginner

### Problem statement

Display Unknown for missing country. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the coalesce mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT email,COALESCE(country,'Unknown') AS country FROM customers ORDER BY email;
```

**Explanation:** COALESCE returns the first non-null value. Context requirement: minimize locks and write amplification.

**Common mistakes:** Mutating data for display fallback.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-068 — INSERT RETURNING (Beginner)

**Topic:** INSERT RETURNING  
**Difficulty:** Beginner

### Problem statement

Insert a customer and return generated fields. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the insert returning mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
INSERT INTO customers(email,country) VALUES($1,$2) RETURNING id,email,created_at;
```

**Explanation:** RETURNING avoids a second lookup. Context requirement: minimize locks and write amplification.

**Common mistakes:** Guessing identity values.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-069 — Guarded UPDATE (Beginner)

**Topic:** Guarded UPDATE  
**Difficulty:** Beginner

### Problem statement

Raise book prices by five percent. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the guarded update mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
UPDATE products SET price=round(price*1.05,2) WHERE category='books' RETURNING id,sku,price;
```

**Explanation:** A WHERE clause limits impact. Context requirement: minimize locks and write amplification.

**Common mistakes:** Unbounded UPDATE.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-070 — Safe DELETE (Beginner)

**Topic:** Safe DELETE  
**Difficulty:** Beginner

### Problem statement

Delete old cancelled orders and show IDs. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the safe delete mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
DELETE FROM orders WHERE status='cancelled' AND created_at<$1 RETURNING id;
```

**Explanation:** RETURNING records affected rows. Context requirement: minimize locks and write amplification.

**Common mistakes:** Deleting before preview.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-071 — INNER JOIN (Beginner)

**Topic:** INNER JOIN  
**Difficulty:** Beginner

### Problem statement

List orders with customer emails. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the inner join mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT o.id,c.email FROM orders o JOIN customers c ON c.id=o.customer_id ORDER BY o.id;
```

**Explanation:** Join predicates express row correspondence. Context requirement: minimize locks and write amplification.

**Common mistakes:** Joining unrelated text.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-072 — LEFT JOIN (Beginner)

**Topic:** LEFT JOIN  
**Difficulty:** Beginner

### Problem statement

Count orders for every customer including zero. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the left join mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT c.id,c.email,count(o.id) AS n FROM customers c LEFT JOIN orders o ON o.customer_id=c.id GROUP BY c.id,c.email ORDER BY c.id;
```

**Explanation:** Count a nullable child key after an outer join. Context requirement: minimize locks and write amplification.

**Common mistakes:** COUNT(*) returning one.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-073 — Aggregate (Beginner)

**Topic:** Aggregate  
**Difficulty:** Beginner

### Problem statement

Calculate paid revenue with zero fallback. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the aggregate mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT COALESCE(sum(total),0)::numeric(14,2) FROM orders WHERE status='paid';
```

**Explanation:** SUM over empty input is NULL. Context requirement: minimize locks and write amplification.

**Common mistakes:** Assuming zero.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-074 — GROUP BY (Beginner)

**Topic:** GROUP BY  
**Difficulty:** Beginner

### Problem statement

Count products by category. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the group by mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT category,count(*) AS n FROM products GROUP BY category ORDER BY n DESC,category;
```

**Explanation:** Non-aggregate selections must be grouped. Context requirement: minimize locks and write amplification.

**Common mistakes:** Selecting ungrouped columns.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-075 — HAVING (Beginner)

**Topic:** HAVING  
**Difficulty:** Beginner

### Problem statement

Find customers with at least three orders. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the having mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT customer_id,count(*) AS n FROM orders GROUP BY customer_id HAVING count(*)>=3 ORDER BY customer_id;
```

**Explanation:** HAVING filters groups. Context requirement: minimize locks and write amplification.

**Common mistakes:** Aggregate in WHERE.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-076 — Time zones (Beginner)

**Topic:** Time zones  
**Difficulty:** Beginner

### Problem statement

Count orders per UTC day. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the time zones mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT date_trunc('day',created_at AT TIME ZONE 'UTC') AS day,count(*) FROM orders GROUP BY day ORDER BY day;
```

**Explanation:** Reporting boundaries require an explicit zone. Context requirement: minimize locks and write amplification.

**Common mistakes:** Session-dependent casts.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-077 — Casting (Beginner)

**Topic:** Casting  
**Difficulty:** Beginner

### Problem statement

Build a product text label. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the casting mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,'product-'||id::text AS label FROM products ORDER BY id;
```

**Explanation:** Explicit casts document intent. Context requirement: minimize locks and write amplification.

**Common mistakes:** Ambiguous implicit casts.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-078 — Arrays (Beginner)

**Topic:** Arrays  
**Difficulty:** Beginner

### Problem statement

Find products tagged featured. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the arrays mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,sku FROM products WHERE tags @> ARRAY['featured'] ORDER BY id;
```

**Explanation:** Containment can be indexed with GIN. Context requirement: minimize locks and write amplification.

**Common mistakes:** LIKE on array text.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-079 — JSONB (Beginner)

**Topic:** JSONB  
**Difficulty:** Beginner

### Problem statement

Find red products by containment. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the jsonb mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,sku FROM products WHERE attributes @> '{"color":"red"}'::jsonb ORDER BY id;
```

**Explanation:** JSONB containment is indexable. Context requirement: minimize locks and write amplification.

**Common mistakes:** Comparing JSON as text.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-080 — Constraints (Beginner)

**Topic:** Constraints  
**Difficulty:** Beginner

### Problem statement

Create valid percentage coupons. Apply it in the **High-write service** context.

### Requirements

Use PostgreSQL 18.4; minimize locks and write amplification; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the constraints mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE TABLE coupons(id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,code text NOT NULL UNIQUE,discount numeric(5,2) NOT NULL CHECK(discount>0 AND discount<=100));
```

**Explanation:** Constraints protect every caller. Context requirement: minimize locks and write amplification.

**Common mistakes:** Application-only validation.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-081 — Projection (Beginner)

**Topic:** Projection  
**Difficulty:** Beginner

### Problem statement

Return customer IDs and emails in stable order. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the projection mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,email FROM customers ORDER BY id;
```

**Explanation:** Explicit projection avoids accidental schema coupling. Context requirement: preserve evidence and define rollback.

**Common mistakes:** SELECT * and missing ORDER BY.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-082 — Filtering (Beginner)

**Topic:** Filtering  
**Difficulty:** Beginner

### Problem statement

Return paid orders of at least 100. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the filtering mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,customer_id,total FROM orders WHERE status='paid' AND total>=100 ORDER BY id;
```

**Explanation:** Predicates narrow rows before projection. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Using OR or text comparison.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-083 — NULL semantics (Beginner)

**Topic:** NULL semantics  
**Difficulty:** Beginner

### Problem statement

Find customers whose country is unknown. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the null semantics mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,email FROM customers WHERE country IS NULL ORDER BY id;
```

**Explanation:** NULL uses three-valued logic. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Writing country = NULL.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-084 — Limit and sort (Beginner)

**Topic:** Limit and sort  
**Difficulty:** Beginner

### Problem statement

Return the five most expensive products. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the limit and sort mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,sku,price FROM products ORDER BY price DESC,id LIMIT 5;
```

**Explanation:** A tie-breaker makes LIMIT deterministic. Context requirement: preserve evidence and define rollback.

**Common mistakes:** LIMIT without ORDER BY.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-085 — Expressions (Beginner)

**Topic:** Expressions  
**Difficulty:** Beginner

### Problem statement

Calculate every order-item line total. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the expressions mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT order_id,product_id,quantity*unit_price AS line_total FROM order_items ORDER BY order_id,product_id;
```

**Explanation:** Derived values need not be stored. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Storing redundant totals.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-086 — CASE (Beginner)

**Topic:** CASE  
**Difficulty:** Beginner

### Problem statement

Classify products into three price bands. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the case mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT sku,CASE WHEN price<25 THEN 'budget' WHEN price<100 THEN 'standard' ELSE 'premium' END AS band FROM products ORDER BY sku;
```

**Explanation:** CASE branches are evaluated in order. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Broad condition first.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-087 — COALESCE (Beginner)

**Topic:** COALESCE  
**Difficulty:** Beginner

### Problem statement

Display Unknown for missing country. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the coalesce mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT email,COALESCE(country,'Unknown') AS country FROM customers ORDER BY email;
```

**Explanation:** COALESCE returns the first non-null value. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Mutating data for display fallback.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-088 — INSERT RETURNING (Beginner)

**Topic:** INSERT RETURNING  
**Difficulty:** Beginner

### Problem statement

Insert a customer and return generated fields. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the insert returning mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
INSERT INTO customers(email,country) VALUES($1,$2) RETURNING id,email,created_at;
```

**Explanation:** RETURNING avoids a second lookup. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Guessing identity values.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-089 — Guarded UPDATE (Beginner)

**Topic:** Guarded UPDATE  
**Difficulty:** Beginner

### Problem statement

Raise book prices by five percent. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the guarded update mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
UPDATE products SET price=round(price*1.05,2) WHERE category='books' RETURNING id,sku,price;
```

**Explanation:** A WHERE clause limits impact. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Unbounded UPDATE.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-090 — Safe DELETE (Beginner)

**Topic:** Safe DELETE  
**Difficulty:** Beginner

### Problem statement

Delete old cancelled orders and show IDs. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the safe delete mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
DELETE FROM orders WHERE status='cancelled' AND created_at<$1 RETURNING id;
```

**Explanation:** RETURNING records affected rows. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Deleting before preview.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-091 — INNER JOIN (Beginner)

**Topic:** INNER JOIN  
**Difficulty:** Beginner

### Problem statement

List orders with customer emails. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the inner join mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT o.id,c.email FROM orders o JOIN customers c ON c.id=o.customer_id ORDER BY o.id;
```

**Explanation:** Join predicates express row correspondence. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Joining unrelated text.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-092 — LEFT JOIN (Beginner)

**Topic:** LEFT JOIN  
**Difficulty:** Beginner

### Problem statement

Count orders for every customer including zero. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the left join mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT c.id,c.email,count(o.id) AS n FROM customers c LEFT JOIN orders o ON o.customer_id=c.id GROUP BY c.id,c.email ORDER BY c.id;
```

**Explanation:** Count a nullable child key after an outer join. Context requirement: preserve evidence and define rollback.

**Common mistakes:** COUNT(*) returning one.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-093 — Aggregate (Beginner)

**Topic:** Aggregate  
**Difficulty:** Beginner

### Problem statement

Calculate paid revenue with zero fallback. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the aggregate mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT COALESCE(sum(total),0)::numeric(14,2) FROM orders WHERE status='paid';
```

**Explanation:** SUM over empty input is NULL. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Assuming zero.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-094 — GROUP BY (Beginner)

**Topic:** GROUP BY  
**Difficulty:** Beginner

### Problem statement

Count products by category. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the group by mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT category,count(*) AS n FROM products GROUP BY category ORDER BY n DESC,category;
```

**Explanation:** Non-aggregate selections must be grouped. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Selecting ungrouped columns.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-095 — HAVING (Beginner)

**Topic:** HAVING  
**Difficulty:** Beginner

### Problem statement

Find customers with at least three orders. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the having mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT customer_id,count(*) AS n FROM orders GROUP BY customer_id HAVING count(*)>=3 ORDER BY customer_id;
```

**Explanation:** HAVING filters groups. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Aggregate in WHERE.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-096 — Time zones (Beginner)

**Topic:** Time zones  
**Difficulty:** Beginner

### Problem statement

Count orders per UTC day. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the time zones mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT date_trunc('day',created_at AT TIME ZONE 'UTC') AS day,count(*) FROM orders GROUP BY day ORDER BY day;
```

**Explanation:** Reporting boundaries require an explicit zone. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Session-dependent casts.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-097 — Casting (Beginner)

**Topic:** Casting  
**Difficulty:** Beginner

### Problem statement

Build a product text label. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the casting mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,'product-'||id::text AS label FROM products ORDER BY id;
```

**Explanation:** Explicit casts document intent. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Ambiguous implicit casts.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-098 — Arrays (Beginner)

**Topic:** Arrays  
**Difficulty:** Beginner

### Problem statement

Find products tagged featured. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the arrays mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,sku FROM products WHERE tags @> ARRAY['featured'] ORDER BY id;
```

**Explanation:** Containment can be indexed with GIN. Context requirement: preserve evidence and define rollback.

**Common mistakes:** LIKE on array text.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-099 — JSONB (Beginner)

**Topic:** JSONB  
**Difficulty:** Beginner

### Problem statement

Find red products by containment. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the jsonb mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
SELECT id,sku FROM products WHERE attributes @> '{"color":"red"}'::jsonb ORDER BY id;
```

**Explanation:** JSONB containment is indexable. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Comparing JSON as text.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>

## PG-B-100 — Constraints (Beginner)

**Topic:** Constraints  
**Difficulty:** Beginner

### Problem statement

Create valid percentage coupons. Apply it in the **Incident drill** context.

### Requirements

Use PostgreSQL 18.4; preserve evidence and define rollback; parameterize external values.

### Starter schema or setup

Use the shared exercise schema and add only required objects.

### Example input or data

Test empty, NULL, duplicate, boundary, and representative-volume cases.

### Expected output or behavior

Only intended rows are returned or changed; constraints and deterministic behavior remain intact.

### Hint

Start from the constraints mechanism and identify the transaction or plan boundary.

### Constraints

Avoid `SELECT *`, unsafe string interpolation, unbounded writes, and unexplained destructive operations.

### Validation criteria

Run in a disposable PostgreSQL 18.4 database; verify row counts, edge cases, rerun behavior, plan evidence, and rollback.

<details>
<summary>Solution and explanation</summary>

```sql
CREATE TABLE coupons(id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,code text NOT NULL UNIQUE,discount numeric(5,2) NOT NULL CHECK(discount>0 AND discount<=100));
```

**Explanation:** Constraints protect every caller. Context requirement: preserve evidence and define rollback.

**Common mistakes:** Application-only validation.

**Performance considerations:** Establish correctness first, then inspect `EXPLAIN (ANALYZE, BUFFERS)` on representative data and measure lock/index cost.

</details>
