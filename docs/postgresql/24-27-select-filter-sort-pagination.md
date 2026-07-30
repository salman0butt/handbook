---
id: 24-27-select-filter-sort-pagination
title: 24–27 — SELECT, Expressions, Filtering, Ordering & Pagination
---

# 24 — SELECT Fundamentals

`SELECT` transforms relations into a result set. The written statement is declarative; its **logical** processing model differs from its physical plan.

```sql
SELECT c.customer_id,
       c.email,
       o.total
FROM customers AS c
JOIN orders AS o ON o.customer_id = c.customer_id
WHERE o.status = 'paid'
ORDER BY o.created_at DESC
LIMIT 20;
```

Conceptually:

```text
FROM / JOIN
    ↓
WHERE
    ↓
GROUP BY
    ↓
HAVING
    ↓
SELECT
    ↓
DISTINCT
    ↓
ORDER BY
    ↓
LIMIT / OFFSET / FETCH
```

This is a reasoning model, **not a guaranteed physical execution order**.

Projection chooses expressions:

```sql
SELECT order_id,
       subtotal + tax AS total,
       upper(status) AS normalized_status
FROM orders;
```

`DISTINCT` removes duplicate result rows and can require sorting/hashing. Do not add it to “fix duplicate joins”; understand why multiplicity exists.

PostgreSQL supports `LIMIT`/`OFFSET`; standard SQL provides `FETCH FIRST ... ROWS ONLY` and `OFFSET` forms.

---

# 25 — Expressions and Operators

Expressions combine literals, columns, function calls, casts, operators, subqueries, rows, arrays, JSON, ranges, and conditional forms.

```sql
SELECT quantity * unit_price AS line_total,
       email || ' (' || customer_id || ')' AS label
FROM order_items;
```

Operator families include arithmetic, comparison, logical, strings/patterns, arrays, JSON/JSONB, ranges, networking, geometric, and date/time. PostgreSQL operator overloading means the same token can have type-specific meanings.

```sql
SELECT 2 + 3;
SELECT DATE '2026-07-30' + 7;
SELECT ARRAY[1,2] || ARRAY[3];
```

Parenthesize mixed logic rather than relying on remembered precedence:

```sql
WHERE is_active
  AND (role = 'admin' OR role = 'editor')
```

PostgreSQL supports user-defined operators, but custom syntax has discoverability, security/search-path, and maintenance costs. Prefer functions unless operator semantics are genuinely domain-natural.

---

# 26 — Filtering

`WHERE` retains rows whose predicate evaluates `TRUE`.

```sql
SELECT *
FROM products
WHERE price BETWEEN 10 AND 100
  AND category_id IN (2, 3, 4)
  AND NOT discontinued;
```

## Pattern matching

```sql
WHERE name LIKE 'Post%'
WHERE name ILIKE 'post%'       -- 🐘 PostgreSQL case-insensitive pattern operator
```

A leading wildcard such as `LIKE '%sql%'` usually cannot use an ordinary B-tree prefix access path. Specialized operator classes/extensions such as trigram indexes may be appropriate.

## `IN`, `ANY`, and `ALL`

```sql
WHERE status IN ('paid','shipped')
WHERE id = ANY($1::bigint[])
WHERE score > ALL(ARRAY[10,20,30])
```

`ANY`/`ALL` interact with `NULL` through three-valued logic. Test edge cases explicitly.

## EXISTS

Use `EXISTS` when the question is existence, not row multiplication:

```sql
SELECT c.*
FROM customers c
WHERE EXISTS (
  SELECT 1
  FROM orders o
  WHERE o.customer_id = c.customer_id
    AND o.status = 'paid'
);
```

`NOT EXISTS` is often the clearest anti-join and avoids `NOT IN` null traps.

## Sargability mental model

A predicate can be logically correct yet difficult to map onto an existing index:

```sql
WHERE lower(email) = lower($1)
```

Either define semantics differently or create a matching expression index when workload justifies it:

```sql
CREATE INDEX users_lower_email_idx ON users (lower(email));
```

Do not rewrite queries merely to “force indexes”; validate with plans.

---

# 27 — Ordering and Pagination

Without `ORDER BY`, row order is not guaranteed.

```sql
ORDER BY created_at DESC, id DESC
```

The second key creates deterministic tie-breaking. PostgreSQL supports explicit null placement:

```sql
ORDER BY published_at DESC NULLS LAST
```

## Offset pagination

```sql
SELECT *
FROM events
ORDER BY occurred_at DESC, id DESC
LIMIT 50 OFFSET 100000;
```

The database still needs to locate/process rows before the deep offset. Large offsets also create unstable user-visible pages while concurrent inserts/deletes shift positions.

## Keyset/cursor pagination

For a stable compound sort:

```sql
SELECT *
FROM events
WHERE (occurred_at, id) < ($cursor_time, $cursor_id)
ORDER BY occurred_at DESC, id DESC
LIMIT 50;
```

Supporting index:

```sql
CREATE INDEX events_cursor_idx
ON events (occurred_at DESC, id DESC);
```

```text
OFFSET pagination: count/skip N rows each request
keyset pagination: resume after last ordered key
```

Keyset pagination trades random page-number access for scalable sequential navigation. A production cursor should encode every sort key needed to make ordering deterministic and bind/filter context so a cursor from one query cannot silently mean another.

**Exercise:** implement pagination for `orders ORDER BY created_at DESC, order_id DESC`. Compare `EXPLAIN (ANALYZE, BUFFERS)` at page 1 and a deep offset, then replace it with a compound keyset cursor.