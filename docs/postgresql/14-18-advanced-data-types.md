---
id: 14-18-advanced-data-types
title: "14–18 — UUID, Arrays, JSONB, Ranges & Specialized Types"
---

# 14 — UUID

PostgreSQL has a native 128-bit `uuid` type. Use it instead of storing UUID text: the native type validates input, occupies less space, and has appropriate comparison/index semantics.

```sql
CREATE TABLE api_keys (
  id uuid PRIMARY KEY DEFAULT uuidv7(),
  label text NOT NULL
);
```

**🐘 PostgreSQL 18:** `uuidv7()` generates timestamp-ordered UUIDv7 values. Timestamp locality generally produces friendlier B-tree insertion patterns than uniformly random UUIDv4 values while retaining distributed generation. Ordering is useful but does not make UUIDv7 a secret, strict global sequence, or replacement for an explicit event timestamp.

## UUID vs bigint

- `bigint` identity: compact, fast, naturally ordered, centralized sequence generation;
- UUID: decentralized generation, safe IDs across independent producers, larger indexes/foreign keys;
- UUIDv7: decentralized ID with time-oriented ordering benefits.

Do not choose UUID because “bigint cannot scale” or reject UUID because “random IDs always destroy PostgreSQL.” Workload, index size, locality, distribution needs, privacy, and operational constraints matter.

---

# 15 — Arrays

PostgreSQL arrays store homogeneous values and support indexing, slicing, containment/operators, `unnest`, and `ANY`/`ALL`.

```sql
CREATE TABLE articles (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tags text[] NOT NULL DEFAULT '{}'
);

SELECT * FROM articles WHERE 'postgresql' = ANY(tags);
SELECT id, unnest(tags) AS tag FROM articles;
```

Array subscripts are traditionally 1-based, but PostgreSQL arrays can preserve unusual lower bounds; don't write application logic that assumes every possible array starts at 1 unless your schema ensures it.

GIN indexes can accelerate supported containment/search operators:

```sql
CREATE INDEX articles_tags_gin ON articles USING gin (tags);
```

## Modelling trade-off

Arrays fit attributes that are naturally a small value collection owned by one row. If array elements need foreign keys, independent lifecycle, metadata, uniqueness across rows, frequent joins, or row-level updates, normalize into a child/junction table.

---

# 16 — JSON and JSONB

PostgreSQL offers `json` and binary-decomposed `jsonb`. `json` preserves input text details; `jsonb` parses/decomposes values, supports richer indexing/operators, discards insignificant whitespace/object-key order, and on duplicate object keys retains one logical value.

```sql
CREATE TABLE products (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sku text NOT NULL UNIQUE,
  name text NOT NULL,
  attributes jsonb NOT NULL DEFAULT '{}'::jsonb
);
```

## Extraction and containment

```sql
SELECT attributes->>'color' AS color
FROM products;

SELECT *
FROM products
WHERE attributes @> '{"color":"black"}'::jsonb;
```

`->` returns JSON; `->>` returns text. SQL/JSON functionality and JSON path let you query nested structures declaratively.

```sql
SELECT jsonb_path_query(attributes, '$.dimensions.*')
FROM products;
```

## Indexing

```sql
CREATE INDEX products_attributes_gin
  ON products USING gin (attributes);

CREATE INDEX products_brand_idx
  ON products ((attributes->>'brand'));
```

A broad GIN index supports certain containment/existence operations but costs storage and write maintenance. Expression indexes are often better for a few stable hot fields.

## JSONB anti-pattern

JSONB becomes an anti-pattern when stable, frequently queried relational fields are buried in an unvalidated “metadata” object, defeating `NOT NULL`, foreign keys, typed checks, simple statistics, and discoverability.

```text
stable invariant / join key / common filter → relational column
variable sparse extension attributes      → maybe jsonb
```

Real systems often use both.

---

# 17 — Range and Multirange Types

PostgreSQL range types represent intervals: `int4range`, `int8range`, `numrange`, `tsrange`, `tstzrange`, `daterange`, plus corresponding multiranges.

```sql
SELECT daterange(DATE '2026-08-01', DATE '2026-08-10', '[)');
```

`[)` means inclusive lower bound, exclusive upper bound—a useful convention for adjacent periods.

Operators express overlap and containment:

```sql
SELECT booking_period && tstzrange($1, $2, '[)')
FROM bookings;
```

GiST indexes support range search patterns. The strongest scheduling design often encodes **no overlap** as an exclusion constraint rather than “check then insert” application logic:

```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE bookings
ADD CONSTRAINT bookings_no_overlap
EXCLUDE USING gist (
  room_id WITH =,
  period WITH &&
);
```

This turns a concurrency-sensitive invariant into database enforcement. Multiranges represent multiple disjoint ranges as one value and are useful for availability sets.

---

# 18 — Network, Bit, Geometric, and Other Types

PostgreSQL's type system includes specialized native types:

- `inet`, `cidr`, `macaddr`, `macaddr8` for network identities/ranges;
- `bit(n)` and `bit varying(n)` for bit strings;
- `bytea` for binary data;
- geometric types such as point/line/box/path/polygon/circle;
- `xml` for XML values;
- `pg_lsn` for WAL locations;
- object identifier (`oid`) types used by system catalogs;
- pseudo-types used in function signatures and internal interfaces.

```sql
CREATE TABLE firewall_rules (
  network cidr NOT NULL,
  description text
);

SELECT inet '10.1.2.3' << cidr '10.0.0.0/8';
```

## `money` caveat

PostgreSQL's `money` type is locale-sensitive and has a fixed fractional model. Many applications prefer `numeric` plus an explicit currency code for portable financial semantics.

## Binary and large values

`bytea`, large `text`, JSONB, and other variable-width values can participate in TOAST storage. Type choice therefore connects to storage, updates, indexing, and query plans.

**Interview question:** Why is `text` not a universal substitute for PostgreSQL's semantic types? Expected answer: validation, operators, ordering, storage, statistics, constraints, indexes, query readability, and application contracts.