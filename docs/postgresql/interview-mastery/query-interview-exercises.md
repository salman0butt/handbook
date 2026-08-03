---
id: query-interview-exercises
title: "Query Interview Exercises"
---

# Query Interview Exercises

Use the [shared exercise schema](../sql-exercises/overview.md). Each problem includes more than one viable solution where it teaches a trade-off.

## 1 — Salary ranking

**Problem:** Return each employee with department salary rank; ties share a rank with gaps.

```sql
SELECT e.*,
       rank() OVER (
         PARTITION BY department
         ORDER BY salary DESC
       ) AS salary_rank
FROM employees e;
```

Use `dense_rank` when ties should not leave gaps; `row_number` when every row needs a unique position. State tie semantics before choosing.

## 2 — Top three salaries per department

```sql
SELECT *
FROM (
  SELECT e.*,
         dense_rank() OVER (
           PARTITION BY department ORDER BY salary DESC
         ) AS r
  FROM employees e
) x
WHERE r <= 3;
```

Alternative: `LATERAL ... ORDER BY salary DESC LIMIT 3` for a selected department list when an index can make each top-N lookup cheap. Window ranking is usually clearer for a whole-table result.

## 3 — Find duplicate emails

```sql
SELECT lower(email) AS normalized_email,
       count(*) AS n
FROM customers
GROUP BY lower(email)
HAVING count(*) > 1;
```

If case-insensitive identity is a real invariant, cleanup alone is not enough; add a matching unique expression index or a deliberate case-insensitive type/collation design.

## 4 — Latest order per customer

Portable window solution:

```sql
SELECT *
FROM (
  SELECT o.*,
         row_number() OVER (
           PARTITION BY customer_id
           ORDER BY created_at DESC, id DESC
         ) AS rn
  FROM orders o
) x
WHERE rn = 1;
```

PostgreSQL alternative:

```sql
SELECT DISTINCT ON (customer_id) *
FROM orders
ORDER BY customer_id, created_at DESC, id DESC;
```

A `LATERAL` top-1 lookup can be best when the outer customer set is small and `(customer_id, created_at DESC, id DESC)` is indexed.

## 5 — Running customer spend

```sql
SELECT id,
       customer_id,
       created_at,
       total,
       sum(total) OVER (
         PARTITION BY customer_id
         ORDER BY created_at, id
         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS running_total
FROM orders
WHERE status = 'paid';
```

The explicit `ROWS` frame and tie-breaker prevent peer ambiguity.

## 6 — Rolling seven-order average

```sql
SELECT id,
       avg(total) OVER (
         PARTITION BY customer_id
         ORDER BY created_at, id
         ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
       ) AS avg_last_7_orders
FROM orders;
```

This means seven **rows/orders**, not seven days. For a seven-day time window, use an appropriate `RANGE` frame or aggregate by day first.

## 7 — Median product price

```sql
SELECT percentile_cont(0.5)
       WITHIN GROUP (ORDER BY price) AS median_price
FROM products;
```

`percentile_cont` can interpolate; `percentile_disc` returns an observed value. Interviewers often want you to state that distinction.

## 8 — Revenue percentiles by category

```sql
SELECT category,
       percentile_cont(ARRAY[0.5, 0.9, 0.99])
         WITHIN GROUP (ORDER BY price) AS percentiles
FROM products
GROUP BY category;
```

For huge analytical workloads, discuss whether exact ordered-set aggregates or approximate analytics outside core PostgreSQL better meet the SLO.

## 9 — Customers with no orders

```sql
SELECT c.*
FROM customers c
WHERE NOT EXISTS (
  SELECT 1
  FROM orders o
  WHERE o.customer_id = c.id
);
```

Alternative: `LEFT JOIN ... WHERE o.id IS NULL`. Avoid `NOT IN` if the subquery can produce `NULL`.

## 10 — Customers who bought every product in a category

```sql
SELECT c.id
FROM customers c
WHERE NOT EXISTS (
  SELECT 1
  FROM products p
  WHERE p.category = 'books'
    AND NOT EXISTS (
      SELECT 1
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      WHERE o.customer_id = c.id
        AND oi.product_id = p.id
    )
);
```

This is relational division via double `NOT EXISTS`. A count-distinct solution is also possible but must handle an empty required set and duplicate purchases deliberately.

## 11 — Consecutive active days / gaps and islands

```sql
WITH days AS (
  SELECT DISTINCT user_id, occurred_at::date AS day
  FROM events
), tagged AS (
  SELECT *,
         day - (row_number() OVER (
           PARTITION BY user_id ORDER BY day
         ))::int AS grp
  FROM days
)
SELECT user_id,
       min(day) AS start_day,
       max(day) AS end_day,
       count(*) AS days
FROM tagged
GROUP BY user_id, grp;
```

Alternative: `lag(day)` + gap flag + cumulative sum. The latter generalizes more naturally to arbitrary gap thresholds.

## 12 — Sessionize events

```sql
WITH x AS (
  SELECT e.*,
         lag(occurred_at) OVER (
           PARTITION BY user_id
           ORDER BY occurred_at, id
         ) AS previous_at
  FROM events e
), y AS (
  SELECT *,
         CASE
           WHEN previous_at IS NULL
             OR occurred_at - previous_at > interval '30 minutes'
           THEN 1 ELSE 0
         END AS new_session
  FROM x
)
SELECT *,
       sum(new_session) OVER (
         PARTITION BY user_id
         ORDER BY occurred_at, id
         ROWS UNBOUNDED PRECEDING
       ) AS session_no
FROM y;
```

Call out equal timestamps, late-arriving events, and whether the session rule uses event time or ingestion time.

## 13 — Monthly cohort retention

```sql
WITH cohort AS (
  SELECT id AS user_id,
         date_trunc('month', created_at) AS cohort_month
  FROM customers
), activity AS (
  SELECT DISTINCT user_id,
         date_trunc('month', occurred_at) AS activity_month
  FROM events
), sizes AS (
  SELECT cohort_month, count(*) AS cohort_size
  FROM cohort
  GROUP BY cohort_month
)
SELECT c.cohort_month,
       a.activity_month,
       count(DISTINCT c.user_id) AS retained,
       count(DISTINCT c.user_id)::numeric / s.cohort_size AS retention
FROM cohort c
JOIN activity a
  ON a.user_id = c.user_id
 AND a.activity_month >= c.cohort_month
JOIN sizes s USING (cohort_month)
GROUP BY c.cohort_month, a.activity_month, s.cohort_size
ORDER BY 1,2;
```

State cohort definition, event deduplication, late data, and denominator semantics.

## 14 — Funnel: view → cart → purchase

```sql
WITH per_user AS (
  SELECT user_id,
         min(occurred_at) FILTER (WHERE event_name='view') AS viewed_at,
         min(occurred_at) FILTER (WHERE event_name='cart') AS cart_at,
         min(occurred_at) FILTER (WHERE event_name='purchase') AS purchased_at
  FROM events
  GROUP BY user_id
)
SELECT
  count(*) FILTER (WHERE viewed_at IS NOT NULL) AS viewed,
  count(*) FILTER (
    WHERE cart_at >= viewed_at
  ) AS carted,
  count(*) FILTER (
    WHERE purchased_at >= cart_at AND cart_at >= viewed_at
  ) AS purchased
FROM per_user;
```

This simple version models one funnel attempt/user. A production funnel may need sessions, repeated attempts, product identity, and maximum step windows.

## 15 — Pivot statuses into columns

```sql
SELECT customer_id,
       count(*) FILTER (WHERE status='paid') AS paid,
       count(*) FILTER (WHERE status='cancelled') AS cancelled,
       count(*) FILTER (WHERE status='pending') AS pending
FROM orders
GROUP BY customer_id;
```

`FILTER` is clearer than multiple `SUM(CASE...)` expressions; the latter is more portable to systems lacking aggregate FILTER.

## 16 — Hierarchy / recursive tree

```sql
WITH RECURSIVE tree AS (
  SELECT id, manager_id, 0 AS depth, ARRAY[id] AS path
  FROM employees
  WHERE manager_id IS NULL

  UNION ALL

  SELECT e.id,
         e.manager_id,
         t.depth + 1,
         t.path || e.id
  FROM employees e
  JOIN tree t ON e.manager_id = t.id
  WHERE NOT e.id = ANY(t.path)
)
SELECT * FROM tree;
```

Discuss cycle detection, index on `manager_id`, and closure/materialized-path alternatives for read-heavy hierarchies.

## 17 — Overlapping bookings

Assume `bookings(resource_id, period tstzrange)`:

```sql
SELECT *
FROM bookings
WHERE resource_id = $1
  AND period && tstzrange($2, $3, '[)');
```

A query can find conflicts; it does **not** make check-then-insert race-safe. The production design should enforce a GiST exclusion constraint.

## 18 — Keyset pagination

```sql
SELECT id, customer_id, created_at, total
FROM orders
WHERE customer_id = $1
  AND (created_at, id) < ($cursor_time, $cursor_id)
ORDER BY created_at DESC, id DESC
LIMIT 50;
```

Candidate index:

```sql
CREATE INDEX orders_customer_cursor_idx
ON orders(customer_id, created_at DESC, id DESC);
```

Discuss cursor encoding, filter versioning, deletions/inserts, and why OFFSET still has uses for small/random-page workloads.

## 19 — Atomic inventory decrement

```sql
UPDATE inventory
SET quantity = quantity - $1
WHERE product_id = $2
  AND quantity >= $1
RETURNING quantity;
```

Zero rows means current inventory cannot satisfy the request. This avoids a read-modify-write race. For multiple products, define transaction scope and deterministic locking/order.

## 20 — Claim jobs concurrently

```sql
WITH picked AS (
  SELECT id
  FROM jobs
  WHERE status = 'ready'
    AND run_at <= now()
  ORDER BY priority DESC, run_at, id
  FOR UPDATE SKIP LOCKED
  LIMIT 20
)
UPDATE jobs j
SET status = 'running',
    attempts = attempts + 1
FROM picked
WHERE j.id = picked.id
RETURNING j.*;
```

Commit after claim rather than holding locks during external work. Add leases, retries, idempotency, dead-letter handling and vacuum/cleanup for a production queue.

## 21 — Find blockers

```sql
SELECT pid,
       pg_blocking_pids(pid) AS blockers,
       wait_event_type,
       wait_event,
       query
FROM pg_stat_activity
WHERE cardinality(pg_blocking_pids(pid)) > 0;
```

Follow the blocker chain to the root, inspect transaction age/state, then choose safe mitigation. Do not begin by killing the blocked query.

## 22 — Slow query plan explanation

Given:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT *
FROM orders
WHERE customer_id = $1
ORDER BY created_at DESC
LIMIT 50;
```

Interview answer should identify the first large estimated-vs-actual divergence, multiplied loops, scan/filter row loss, sort method/spills, buffer reads, and whether `(customer_id, created_at DESC, id DESC)` matches the access pattern. Do not say “Seq Scan = bad” without data selectivity.

## 23 — Detect N+1

SQL itself may be fast while the application issues:

```text
1 × SELECT orders
100 × SELECT order_items WHERE order_id = $1
```

Propose a join, batch `WHERE order_id = ANY($1)`, eager-loading/DataLoader approach, and discuss why one enormous join can also duplicate parent data/pagination.

## 24 — Online duplicate-safe signup

```sql
INSERT INTO customers(id,email,created_at)
VALUES ($1,$2,now())
ON CONFLICT (email) DO NOTHING
RETURNING id;
```

The unique constraint is the concurrency authority. An application `SELECT` before `INSERT` can still be used for friendly UX, but cannot be the invariant.

## 25 — Explain a production migration

Prompt: “Add `customer_id` to 500M orders and remove `customer_email`.”

A complete answer should say:

```text
expand column
→ deploy compatible writes
→ concurrent supporting index
→ resumable throttled backfill
→ FK NOT VALID
→ validate FK
→ validate/set NOT NULL
→ switch reads
→ observe/reconcile
→ contract old representation later
```

Then discuss lock timeout, WAL/replica lag, invalid concurrent indexes, rollback/forward-fix, and why transactional DDL alone does not make the operation zero-downtime.