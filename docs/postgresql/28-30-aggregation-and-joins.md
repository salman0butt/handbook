---
id: 28-30-aggregation-and-joins
title: 28–30 — Aggregates, GROUP BY, HAVING & Joins
---

# 28 — Aggregate Functions

Aggregates reduce many input rows to values per query/group.

```sql
SELECT count(*) AS orders,
       sum(total) AS revenue,
       avg(total) AS avg_order,
       min(total) AS min_order,
       max(total) AS max_order
FROM orders
WHERE status = 'paid';
```

`COUNT(*)` counts rows; `COUNT(total)` counts non-null `total` values. Most aggregates ignore null inputs.

PostgreSQL includes array, string, JSON/JSONB and many statistical aggregates:

```sql
SELECT customer_id,
       string_agg(order_id::text, ',' ORDER BY created_at) AS ids,
       jsonb_agg(jsonb_build_object('id', order_id, 'total', total)
                 ORDER BY created_at) AS orders
FROM orders
GROUP BY customer_id;
```

`FILTER` keeps multiple conditional aggregates readable:

```sql
SELECT
  count(*) FILTER (WHERE status = 'paid') AS paid,
  count(*) FILTER (WHERE status = 'cancelled') AS cancelled
FROM orders;
```

`DISTINCT` inside an aggregate changes its input set and can add substantial sort/hash work:

```sql
count(DISTINCT customer_id)
```

Use `EXPLAIN` to understand large aggregation memory, spilling, parallelism, and whether preaggregation/materialization is justified.

---

# 29 — GROUP BY and HAVING

`GROUP BY` partitions rows by grouping keys; aggregate functions operate within each group.

```sql
SELECT customer_id,
       count(*) AS order_count,
       sum(total) AS lifetime_value
FROM orders
GROUP BY customer_id
HAVING sum(total) > 1000;
```

`WHERE` filters rows **before** grouping; `HAVING` filters groups **after** grouping.

PostgreSQL can recognize certain functional dependencies, such as non-grouped columns functionally dependent on a grouped primary key, but portable SQL should make assumptions explicit when cross-database compatibility matters.

## Grouping sets, ROLLUP, CUBE

```sql
SELECT region, product_category, sum(revenue)
FROM sales
GROUP BY ROLLUP (region, product_category);
```

`ROLLUP` creates hierarchical subtotals; `CUBE` generates all combinations; `GROUPING SETS` defines exact groupings. They often replace multiple `UNION ALL` aggregate queries.

**Performance:** hash aggregation needs memory proportional to groups; sorted/group aggregation may exploit ordered input. `work_mem`, estimates, indexes, and parallel plans influence choices.

---

# 30 — Joins

A join combines rows according to a relationship/predicate. Join correctness starts with **cardinality**: one-to-one, one-to-many, many-to-many, or accidental Cartesian expansion.

```text
Table A
   ↓ join condition
Table B
   ↓
combined relation
```

## Join forms

```sql
-- CROSS JOIN: every pair
SELECT * FROM colors CROSS JOIN sizes;

-- INNER: only matching pairs
SELECT o.id, c.email
FROM orders o
JOIN customers c ON c.id = o.customer_id;

-- LEFT: every left row; unmatched right columns become NULL
SELECT c.id, o.id
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id;
```

`RIGHT JOIN` mirrors `LEFT JOIN`; `FULL JOIN` preserves unmatched rows from both sides. A self-join aliases one relation multiple times. `USING (customer_id)` merges identically named join columns in the result. `NATURAL JOIN` infers equality over all same-named columns and is fragile under schema evolution; avoid it in durable application SQL.

## ON vs WHERE outer-join trap

These are not equivalent:

```sql
SELECT c.id, o.id
FROM customers c
LEFT JOIN orders o
  ON o.customer_id = c.id
 AND o.status = 'paid';
```

preserves customers with no paid order. But:

```sql
SELECT c.id, o.id
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.status = 'paid';
```

filters out null-extended rows, behaving like an inner join for that predicate.

## Duplicate/multiplicity reasoning

If a customer has 3 orders and each order 4 items, joining customers → orders → items yields 12 item-level rows for that customer. `DISTINCT` hides that multiplicity rather than fixing it. Decide the output grain first.

## Missing predicate

```sql
FROM orders o, customers c
```

without a relationship predicate creates a Cartesian product. Prefer explicit `JOIN` syntax so intent is reviewable.

## LATERAL preview

`LATERAL` lets a FROM item depend on columns from earlier items, useful for top-N children per parent:

```sql
SELECT c.id, x.*
FROM customers c
LEFT JOIN LATERAL (
  SELECT o.id, o.total
  FROM orders o
  WHERE o.customer_id = c.id
  ORDER BY o.created_at DESC
  LIMIT 3
) x ON true;
```

## Planner implications

The planner estimates relation sizes and join selectivity, considers join order, and chooses Nested Loop, Hash Join, or Merge Join. Poor cardinality estimates can cascade into a bad join tree. Foreign keys/constraints, fresh statistics, extended statistics, and query shape all affect reasoning.

## Interview drill

**Question:** A query joins three tables and suddenly returns 10× more rows after new data arrives. What do you inspect first?

**Expected reasoning:** establish intended result grain; check relationship cardinalities and uniqueness; inspect join predicates; measure counts before/after each join; identify many-to-many expansion; avoid blindly adding `DISTINCT`; then inspect plan estimates/performance separately from logical correctness.

**Exercise:** write inner, left, full, self, semi (`EXISTS`), and anti (`NOT EXISTS`) joins over a customer/order schema, including one example demonstrating the ON-vs-WHERE outer-join difference.