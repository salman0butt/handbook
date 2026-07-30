---
id: 39-44-views-sequences-constraints-keys
title: 39–44 — Views, Materialized Views, Sequences, Constraints & Keys
---

# 39 — Views

A view stores a query definition, not a cached result:

```sql
CREATE VIEW active_customers AS
SELECT id, email
FROM customers
WHERE deleted_at IS NULL;
```

Views create a stable database API, hide irrelevant columns, and centralize repeated relational logic. They do not inherently make a query faster; PostgreSQL normally plans through the view definition.

Simple views can be automatically updatable. `WITH CHECK OPTION` can prevent writes through an updatable view from producing rows the view would no longer expose.

```sql
CREATE VIEW published_posts AS
SELECT * FROM posts WHERE status = 'published'
WITH LOCAL CHECK OPTION;
```

## Security

Privileges on views and underlying objects interact with ownership and security options. Treat a view that exposes sensitive data as an API boundary: choose columns explicitly, reason about predicates, and test role behavior.

**Schema evolution:** a view contract can decouple clients from table changes, but renames/type changes still require compatibility planning.

---

# 40 — Materialized Views

A materialized view stores the query result physically:

```sql
CREATE MATERIALIZED VIEW daily_sales AS
SELECT date_trunc('day', created_at) AS day,
       sum(total) AS revenue
FROM orders
WHERE status = 'paid'
GROUP BY 1;
```

Refresh:

```sql
REFRESH MATERIALIZED VIEW daily_sales;
```

`REFRESH MATERIALIZED VIEW CONCURRENTLY` allows reads during refresh but has requirements, notably a suitable unique index covering rows of the materialized view.

```sql
CREATE UNIQUE INDEX daily_sales_day_key ON daily_sales(day);
REFRESH MATERIALIZED VIEW CONCURRENTLY daily_sales;
```

Materialized views trade freshness and refresh cost for read speed. Define an explicit freshness SLA and monitor refresh duration/failure. For near-real-time data, incremental tables/read models or direct queries may be better.

---

# 41 — Sequences and ID Generation

A sequence is a concurrency-safe number generator:

```sql
CREATE SEQUENCE invoice_number_seq;
SELECT nextval('invoice_number_seq');
SELECT currval('invoice_number_seq');
SELECT setval('invoice_number_seq', 5000);
```

`currval` is session-local after `nextval` has been called in the session.

## Gaps are expected

Sequence values are allocated for uniqueness/concurrency, not accounting continuity. Rolled-back transactions, caching, failures, and concurrent allocation create gaps.

```text
nextval → 100
transaction rolls back
nextval → 101
```

Do not use an ordinary sequence when law/business requires strictly gapless finalized invoice numbers; that requirement needs serialized domain logic and careful failure handling.

Identity columns are sequence-backed schema constructs:

```sql
id bigint GENERATED ALWAYS AS IDENTITY
```

Sequence cache improves throughput by allocating blocks but can widen apparent gaps after restart/failover.

---

# 42 — Constraints

Constraints are the primary database mechanism for invariants.

```sql
CREATE TABLE order_items (
  order_id bigint NOT NULL REFERENCES orders(id),
  line_no integer NOT NULL CHECK (line_no > 0),
  sku text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric(12,2) NOT NULL CHECK (unit_price >= 0),
  PRIMARY KEY (order_id, line_no),
  UNIQUE (order_id, sku)
);
```

Core constraints:

- `NOT NULL`: value must exist;
- `CHECK`: row-level predicate must not be false (remember `UNKNOWN` can pass, so pair with `NOT NULL` when null is forbidden);
- `UNIQUE`: candidate-key-like uniqueness;
- `PRIMARY KEY`: unique + not null chosen identity;
- `FOREIGN KEY`: referential integrity;
- `EXCLUDE`: forbid conflicting operator relationships, e.g. overlapping bookings.

## Deferrable constraints

Some unique/foreign-key/exclusion constraints can be `DEFERRABLE`, checked at transaction end or set deferred:

```sql
SET CONSTRAINTS ALL DEFERRED;
```

This supports transformations where intermediate states violate an invariant while the final transaction state is valid. Deferral changes timing, not correctness obligations.

## Online validation

For supported constraints, `NOT VALID` allows adding enforcement without scanning historical rows immediately, then validating separately:

```sql
ALTER TABLE orders
ADD CONSTRAINT orders_customer_fk
FOREIGN KEY (customer_id) REFERENCES customers(id)
NOT VALID;

ALTER TABLE orders VALIDATE CONSTRAINT orders_customer_fk;
```

This is a key zero-downtime migration pattern because lock/scanning phases can be separated.

**Senior rule:** if invariant violations would be catastrophic, application validation alone is not enough. Multiple services, scripts, imports, retries, and races all touch the database.

---

# 43 — Primary Keys

A primary key should be unique, non-null, stable, and appropriate as row identity.

## Natural vs surrogate

Natural key example:

```sql
country_code char(2) PRIMARY KEY
```

Surrogate key example:

```sql
id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY
```

Use natural keys when the domain guarantees stable identity and representation. Use surrogate keys when business identifiers can change, are large/composite, leak information, or complicate relationships. Even with a surrogate key, enforce true business candidate keys with `UNIQUE`.

Composite keys can represent scoped identity elegantly:

```sql
PRIMARY KEY (order_id, line_no)
```

UUIDv7 can be useful when multiple writers generate identifiers independently. `bigint` is smaller and excellent for centralized generation. Architecture—not fashion—chooses.

---

# 44 — Foreign Keys

A foreign key prevents references to nonexistent parent keys and controls parent changes:

```sql
FOREIGN KEY (customer_id)
REFERENCES customers(id)
ON DELETE RESTRICT
ON UPDATE CASCADE
```

Actions include `NO ACTION`, `RESTRICT`, `CASCADE`, `SET NULL`, and `SET DEFAULT`. `NO ACTION` can participate in deferred checking; `RESTRICT` is stricter about when the action is allowed.

## Indexing and performance

PostgreSQL creates an index for the referenced primary/unique key, but **does not automatically create an index on every referencing foreign-key column**. Index child-side FK columns when parent deletes/updates, joins, or child lookups justify it:

```sql
CREATE INDEX orders_customer_id_idx ON orders(customer_id);
```

Without it, deleting one parent may require scanning a large child table to check references.

## Modelling trade-offs

`CASCADE` is appropriate when child lifecycle truly belongs to the parent. It is dangerous when a single delete can unexpectedly fan out through a graph of business records.

Polymorphic pairs like `(owner_type, owner_id)` cannot normally enforce one ordinary FK across multiple tables. Prefer explicit nullable FKs with a check, a common parent table, separate relationship tables, or another enforceable model.

**Exercise:** model organizations, users, memberships, and invitations. Identify every candidate key, choose PKs, define FKs/actions, and explain which child-side FK indexes are justified.