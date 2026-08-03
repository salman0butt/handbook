---
id: 50-57-indexes
title: "50–57 — PostgreSQL Indexes"
---

# 50 — Index Fundamentals

An index is an auxiliary data structure maintained alongside a table to support selected access patterns.

```text
table heap pages                      index
┌──────────────────────┐             key → tuple location / visibility path
│ rows / tuple versions│  ←────────  ordered/search structure
└──────────────────────┘
```

Indexes can reduce the amount of table data scanned, provide useful ordering, support uniqueness, and enable specialized operators. They also cost storage, cache space, WAL, vacuum/index maintenance, and write latency.

## The planner decides

Having an index does not mean PostgreSQL should use it. A sequential scan can be cheaper when a large fraction of rows are needed, the table is small, random access is expensive, correlation/selectivity is poor, or estimates make another plan cheaper.

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM orders WHERE customer_id = 42;
```

Key concepts:

- **cardinality:** number of rows/distinct values in context;
- **selectivity:** fraction of rows matching a predicate;
- **correlation:** relationship between logical value order and physical row order;
- **clustering:** physical ordering concept; PostgreSQL `CLUSTER` can rewrite a table according to an index but does not maintain that order forever.

⛔ “Index every column in `WHERE`” ignores compound predicates, selectivity, writes, storage, sort order, join usage, and planner economics.

---

# 51 — B-Tree Indexes

B-tree is PostgreSQL's default index method and supports equality, ordered/range comparisons, many sort requirements, and uniqueness.

```sql
CREATE INDEX orders_customer_created_idx
ON orders (customer_id, created_at DESC);
```

This index can efficiently narrow by leading `customer_id` and return that customer's rows ordered by `created_at DESC`.

## Multicolumn order

Column order should reflect predicates/order, not a slogan like “highest cardinality first.” Consider equality columns, range boundaries, desired ordering, skip-scan opportunities, and workload reuse.

PostgreSQL 18 includes B-tree **skip scan** planning improvements, making some queries usable with a multicolumn index even without an equality condition on the first column. That does not remove the need for deliberate index order.

## NULL and uniqueness

B-tree indexes can store nulls and support `NULLS FIRST/LAST` ordering choices. Unique indexes enforce candidate-key rules; PostgreSQL can define uniqueness with `NULLS NOT DISTINCT` when nulls must collide.

## Index scan mental model

```text
B-tree root
  ↓
internal pages narrow key range
  ↓
leaf entry
  ↓
heap TID → heap tuple (unless index-only scan can satisfy visibility/data)
```

---

# 52 — Hash Indexes

Hash indexes support equality comparisons for data types/operator classes that provide hash semantics:

```sql
CREATE INDEX sessions_token_hash_idx
ON sessions USING hash (token_hash);
```

They do not provide range ordering or sort order. B-tree also handles equality and is more versatile, so hash indexes should solve a measured equality-specific workload rather than be chosen from a simplistic “hash lookup is O(1)” analogy. PostgreSQL planner/storage behavior is page- and cost-based, not an in-memory hash-map interview exercise.

---

# 53 — GIN Indexes

GIN is an inverted index suited to values containing many searchable elements.

```text
searchable element → many rows containing that element
```

Common workloads:

```sql
CREATE INDEX products_attrs_gin ON products USING gin (attributes);
CREATE INDEX posts_tags_gin ON posts USING gin (tags);
CREATE INDEX docs_search_gin ON docs USING gin (search_vector);
```

GIN supports operator classes for JSONB, arrays, full-text search, and extensions. Its maintenance can be heavier than B-tree because one row may create many index entries. GIN's pending-list/fast-update behavior batches some updates; monitor write-heavy indexes instead of assuming read speed is free.

Choose the JSONB GIN operator class based on required operators (`jsonb_ops` versus `jsonb_path_ops` trade-offs), not solely index size benchmarks.

---

# 54 — GiST

GiST is a generalized search-tree framework. It lets data types/operator classes define concepts such as overlap, containment, nearest-neighbor relationships, and spatial/range search.

Range example:

```sql
CREATE INDEX bookings_period_gist ON bookings USING gist (period);
SELECT * FROM bookings WHERE period && tstzrange($1,$2,'[)');
```

GiST also powers exclusion constraints, allowing the database to reject conflicting ranges:

```sql
EXCLUDE USING gist (room_id WITH =, period WITH &&)
```

GiST is an extensible framework, not one fixed B-tree-like algorithm for every type.

---

# 55 — SP-GiST

SP-GiST supports **space-partitioned** search structures where the search space can be recursively partitioned, such as tries, quadtrees/k-d-tree-like strategies depending on operator class.

Use it when the data type and operator class match its partitioning strengths. Do not choose an index method by name; first identify supported operators and distribution, then compare plans and maintenance cost.

---

# 56 — BRIN

BRIN (Block Range INdex) stores summaries for ranges of table pages rather than one entry per row.

```text
heap page ranges
  ↓
min/max or other summary per range
  ↓
skip ranges that cannot match
```

It can be tiny and effective for huge tables whose target value correlates with physical order, such as append-heavy time-series/event tables:

```sql
CREATE INDEX events_occurred_brin
ON events USING brin (occurred_at);
```

A BRIN index may still visit many pages when values are randomly distributed. It is a lossy page-range filtering structure, not a replacement for selective B-tree lookups.

---

# 57 — Advanced Index Design

## Covering indexes and INCLUDE

```sql
CREATE INDEX orders_customer_status_idx
ON orders (customer_id, created_at DESC)
INCLUDE (status, total);
```

Included columns can let an index supply selected data without making those columns part of the search ordering. `INCLUDE` increases index size/write cost.

## Index-only scans

An index-only scan requires the requested columns in the index **and** enough visibility-map information to avoid heap visibility checks for many pages. “All selected columns are indexed” does not guarantee zero heap access.

## Expression indexes

```sql
CREATE UNIQUE INDEX users_email_ci_key
ON users (lower(email));
```

The query predicate must match equivalent indexed expression semantics.

## Partial indexes

```sql
CREATE INDEX jobs_ready_idx
ON jobs (run_at, id)
WHERE status = 'ready';
```

A partial index is excellent when a small, stable subset dominates a hot query. The planner must be able to prove the query predicate implies the index predicate; parameterization and predicate shape can affect usability.

## Multicolumn design

For:

```sql
WHERE tenant_id = $1
  AND status = 'open'
ORDER BY created_at DESC
LIMIT 50
```

an index such as `(tenant_id, status, created_at DESC)` may support filtering + order + limit. But if `status` has different workloads or updates constantly, alternatives may be better. Measure write/read balance.

## Operator classes and collations

An index supports operators through an operator class. Pattern matching, JSONB, text search, vector/spatial extensions, and locale ordering may require specialized classes. Collation becomes part of comparison/index semantics.

## Combining indexes and bitmap scans

PostgreSQL can combine multiple indexes with bitmap operations:

```text
Bitmap Index Scan A ─┐
                     ├─ BitmapAnd/Or → Bitmap Heap Scan
Bitmap Index Scan B ─┘
```

This can make individual indexes reusable, but a tailored multicolumn index may still be better for a critical query and ordering.

## Redundant indexes

Every extra index amplifies writes and maintenance. Audit overlap:

- primary/unique index plus duplicate non-unique copy;
- `(a,b)` plus `(a)` when no special need exists;
- low-use indexes with high update cost;
- unused indexes that are nevertheless needed for constraints or rare critical operations—usage stats require context.

## Index review checklist

1. Query pattern and required result size?
2. Predicate operators and selectivity?
3. Order/group/join requirement?
4. Suitable index method/operator class?
5. Column order and included columns?
6. Partial/expression alternative?
7. Estimated write/storage/WAL cost?
8. Actual plan and buffers before/after?
9. Impact on HOT updates and vacuum?
10. Is an existing index already sufficient?

**Exercise:** Given 100M events ordered by ingestion time and queried by recent time ranges plus exact `event_id`, justify one BRIN and one B-tree. Explain why neither replaces the other.