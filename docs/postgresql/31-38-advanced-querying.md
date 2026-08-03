---
id: 31-38-advanced-querying
title: "31–38 — Subqueries, LATERAL, Sets, CTEs, CASE & Window Functions"
---

# 31 — Subqueries

Subqueries can produce one scalar value, one row, a table, or an existence test.

```sql
SELECT p.*
FROM products p
WHERE p.price > (SELECT avg(price) FROM products);
```

A correlated subquery refers to the outer row:

```sql
SELECT c.id,
       (SELECT count(*) FROM orders o WHERE o.customer_id = c.id) AS order_count
FROM customers c;
```

Correlation does not automatically mean “runs N slow queries.” PostgreSQL may transform/decorrelate some forms, but plan shape matters. Use `EXPLAIN` rather than reasoning from source syntax alone.

`EXISTS` asks whether at least one matching row exists and often communicates semi-join intent better than joining and deduplicating.

`IN`, `ANY`, `ALL`, and row comparisons are powerful but obey `NULL` semantics; `NOT EXISTS` is the safer anti-join when nulls can appear.

---

# 32 — LATERAL Queries

`LATERAL` allows a FROM item to reference columns produced earlier in the FROM list.

```sql
SELECT c.id, recent.id AS recent_order_id
FROM customers c
LEFT JOIN LATERAL (
  SELECT o.id
  FROM orders o
  WHERE o.customer_id = c.id
  ORDER BY o.created_at DESC
  LIMIT 1
) recent ON true;
```

This pattern expresses “top N per parent” directly and can pair well with an index like `(customer_id, created_at DESC)`.

Table functions can also be lateral, sometimes implicitly:

```sql
SELECT p.id, tag
FROM posts p
CROSS JOIN LATERAL unnest(p.tags) AS tag;
```

**Performance:** LATERAL creates parameterized relationships between plan nodes. For small outer sets and selective indexed inner lookups it can be excellent; for huge outer sets, repeated inner work may be expensive. Compare against window/aggregate alternatives.

---

# 33 — Set Operations

`UNION`, `INTERSECT`, and `EXCEPT` combine compatible query results.

```sql
SELECT email FROM customers
UNION
SELECT email FROM newsletter_subscribers;
```

`UNION` removes duplicates; `UNION ALL` preserves them and avoids deduplication work.

```sql
SELECT id FROM active_users
INTERSECT
SELECT id FROM paid_users;

SELECT id FROM all_users
EXCEPT
SELECT id FROM banned_users;
```

Column counts must match and types must be mutually resolvable. Parenthesize when combining operations with local `ORDER BY`, `LIMIT`, or when precedence needs to be unambiguous.

**Senior rule:** if duplicates are semantically acceptable, prefer `UNION ALL`; paying to deduplicate without a requirement is waste.

---

# 34 — Common Table Expressions

CTEs name query subexpressions:

```sql
WITH paid AS (
  SELECT * FROM orders WHERE status = 'paid'
),
summary AS (
  SELECT customer_id, sum(total) AS total
  FROM paid
  GROUP BY customer_id
)
SELECT * FROM summary WHERE total > 1000;
```

Modern PostgreSQL can inline eligible non-recursive CTEs; CTEs are not universally optimization fences. `MATERIALIZED` forces one evaluation/storage of the CTE result; `NOT MATERIALIZED` can permit folding when legal.

```sql
WITH expensive AS MATERIALIZED (...)
SELECT ...;
```

Use materialization for semantics/performance evidence, not because “CTEs are always faster.”

## Data-modifying CTEs

PostgreSQL supports modifying statements in `WITH` and communication via `RETURNING`:

```sql
WITH moved AS (
  DELETE FROM jobs
  WHERE finished_at < now() - interval '30 days'
  RETURNING *
)
INSERT INTO archived_jobs
SELECT * FROM moved;
```

Understand statement snapshot/ordering semantics before using complex multi-modification CTEs.

---

# 35 — Recursive CTEs

A recursive CTE has a non-recursive anchor and a recursive term:

```sql
WITH RECURSIVE tree AS (
  SELECT id, parent_id, name, 0 AS depth
  FROM categories
  WHERE parent_id IS NULL

  UNION ALL

  SELECT c.id, c.parent_id, c.name, t.depth + 1
  FROM categories c
  JOIN tree t ON c.parent_id = t.id
)
SELECT * FROM tree;
```

Mental model:

```text
anchor rows
   ↓
recursive term uses current working rows
   ↓
new rows
   ↓
repeat until no rows
   ↓
result
```

Recursion must terminate. Cycles in graph-like data can create infinite/redundant traversal unless prevented/detected. SQL `SEARCH`/`CYCLE` syntax supported by PostgreSQL helps compute traversal ordering and cycle tracking declaratively.

**Performance:** recursion over badly indexed parent/edge keys can explode. Limit breadth/depth when the domain allows it and inspect row growth per iteration.

---

# 36 — CASE and Conditional Expressions

```sql
SELECT id,
       CASE
         WHEN total >= 1000 THEN 'large'
         WHEN total >= 100 THEN 'medium'
         ELSE 'small'
       END AS bucket
FROM orders;
```

`CASE` returns a value and participates in type resolution. `COALESCE(a,b,...)` returns the first non-null expression; `NULLIF(a,b)` returns null when values compare equal. PostgreSQL also provides `GREATEST`/`LEAST` with PostgreSQL-specific null behavior worth verifying when portability matters.

Avoid using `COALESCE` to erase meaningful absence indiscriminately. Transforming null to zero can change business meaning.

---

# 37 — Window Functions

Window functions calculate across related rows **without collapsing them into one row per group**.

```sql
SELECT employee_id,
       department_id,
       salary,
       row_number() OVER (
         PARTITION BY department_id
         ORDER BY salary DESC, employee_id
       ) AS rn
FROM employees;
```

## Ranking

- `row_number`: unique sequential position;
- `rank`: ties share rank and leave gaps;
- `dense_rank`: ties share rank without gaps;
- `percent_rank`, `cume_dist`, `ntile`: distribution/ranking tools.

```sql
SELECT *
FROM (
  SELECT e.*,
         dense_rank() OVER (
           PARTITION BY department_id ORDER BY salary DESC
         ) AS salary_rank
  FROM employees e
) x
WHERE salary_rank <= 3;
```

## Navigation

```sql
SELECT user_id, occurred_at,
       lag(occurred_at)  OVER w AS previous_event,
       lead(occurred_at) OVER w AS next_event
FROM events
WINDOW w AS (PARTITION BY user_id ORDER BY occurred_at);
```

## Frames: ROWS, RANGE, GROUPS

The window `ORDER BY` defines peer/order semantics; the **frame** defines which rows contribute to frame-sensitive functions/aggregates.

```sql
sum(amount) OVER (
  PARTITION BY account_id
  ORDER BY posted_at, entry_id
  ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
)
```

This produces a deterministic running total. `RANGE` groups peers by ordering values and can behave differently when sort keys tie. `GROUPS` counts peer groups.

## `last_value` trap

`last_value()` uses the current frame, not automatically the entire partition. To get the partition's final value, define an appropriate frame, for example:

```sql
last_value(status) OVER (
  PARTITION BY order_id
  ORDER BY changed_at
  ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
)
```

## Analytics examples

- running balances;
- moving averages;
- top-N per group;
- retention/cohort steps;
- gap detection with `lag`;
- sessionization;
- percentiles/ranking.

Window queries often need sorting and can spill if memory is insufficient. Index order can sometimes reduce sorting but not every window shape can be satisfied by one index.

---

# 38 — Table Expressions and Advanced Querying

A FROM item can be a base table, joined table, derived table/subquery, `VALUES`, table function, CTE reference, or lateral expression.

```sql
SELECT v.id, v.label
FROM (VALUES (1,'one'), (2,'two')) AS v(id,label);
```

Row constructors support row-wise comparisons:

```sql
WHERE (created_at, id) < ($1, $2)
```

Set-returning functions belong most clearly in `FROM`; `WITH ORDINALITY` adds output position:

```sql
SELECT *
FROM unnest(ARRAY['a','b','c']) WITH ORDINALITY AS x(value, position);
```

Composite rows can be values themselves, and PostgreSQL can return table/composite types from functions.

**Senior exercise:** solve “latest three orders for each customer” three ways—`LATERAL`, window ranking, and `DISTINCT ON` (PostgreSQL extension). Compare correctness, deterministic ordering, indexes, plan shapes, and readability.