---
id: 09-13-core-data-types
title: 09–13 — SQL and PostgreSQL Core Data Types
---

# 09 — SQL Data Types

Types define valid values, comparison/coercion rules, storage representation, operators, functions, constraints, and index semantics. Choose a type for **meaning**, not merely because it can hold the current examples.

SQL type families include exact numeric, approximate numeric, character, boolean, temporal, binary, and user-defined/domain concepts. PostgreSQL implements these and adds rich native families.

```sql
CREATE TABLE measurements (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  count integer NOT NULL,
  amount numeric(12,2),
  ratio double precision,
  label text,
  active boolean NOT NULL DEFAULT true,
  observed_at timestamptz NOT NULL
);
```

**Senior rule:** type choice is part of the contract. Replacing a semantic type with `text` pushes parsing, validation, ordering, and index semantics into every caller.

---

# 10 — PostgreSQL Numeric Types

PostgreSQL exact integers are `smallint`, `integer`, and `bigint`; arbitrary/fixed precision uses `numeric`/`decimal`; approximate floating point uses `real` and `double precision`.

```sql
price numeric(12,2) CHECK (price >= 0)
```

`numeric(p,s)` constrains precision/scale and is appropriate when decimal arithmetic must be exact, such as monetary calculations. Floating point is approximate and can represent values decimal users find surprising; use it for scientific/statistical workloads where its performance/range model is intended.

Integer arithmetic can overflow; “the column accepts the value” does not guarantee an intermediate expression will fit the desired type.

## Identity vs serial

`smallserial`, `serial`, and `bigserial` are PostgreSQL pseudo-types that create a sequence and default. Modern DDL often prefers:

```sql
id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY
```

Identity is part of SQL's schema vocabulary and has clearer ownership/DDL semantics. Sequence values are not gapless and are not rolled back simply to preserve numbering.

**Financial modelling:** store a currency code beside amounts when multiple currencies exist; an exact decimal without currency meaning is incomplete.

---

# 11 — Strings and Character Types

`character(n)`/`char(n)` pads to a fixed length; `character varying(n)`/`varchar(n)` enforces a maximum length; `text` stores variable-length text without an arbitrary declared maximum.

In PostgreSQL, `text` is often the right default for unconstrained human/application strings. `varchar(n)` should express a genuine business limit, not a reflex copied from another database.

```sql
CREATE TABLE people (
  display_name text NOT NULL,
  country_code char(2) NOT NULL
);
```

## Encoding and collation

Encoding controls character representation; collation controls locale-sensitive ordering/comparison behavior. Collation affects queries and index ordering, so changing expectations can be a correctness/performance issue, not cosmetic formatting.

Useful operations include concatenation (`||`), `lower`, `upper`, `length`, `substring`, trimming, replacement, regex/pattern functions, and formatting.

```sql
SELECT lower(email), length(display_name)
FROM users;
```

Case-insensitive uniqueness needs deliberate semantics. `lower(email)` plus a unique expression index, a suitable collation, or a specialized type/extension can be valid depending on requirements; do not assume Unicode case rules equal ASCII lowercase.

---

# 12 — Boolean, Enums, and Domain Types

`boolean` represents true/false and can be nullable when “unknown/not recorded” is genuinely distinct.

```sql
is_active boolean NOT NULL DEFAULT true
```

## Enums

```sql
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'cancelled');
```

Enums make allowed values explicit and typed. They are useful when a small, stable value set has database-wide meaning. They can be awkward when states change frequently, carry metadata, or need tenant-specific configuration. A lookup/reference table is more flexible for evolving domains.

## Domains

A domain creates a reusable constrained scalar type:

```sql
CREATE DOMAIN positive_amount AS numeric
  CHECK (VALUE >= 0);
```

Use domains for stable semantics shared across columns. Avoid hiding complicated relational business rules inside scalar domains.

**Migration reasoning:** adding enum values is easier than arbitrary reordering/removal/redefinition. Pick enum vs lookup table based on expected evolution, not aesthetics.

---

# 13 — Date and Time

PostgreSQL provides `date`, `time`, `time with time zone`, `timestamp without time zone`, `timestamp with time zone` (`timestamptz`), and `interval`.

## The `timestamptz` mental model

`timestamptz` represents an **instant in time**. PostgreSQL converts an input with time-zone context to an internal instant and displays that instant using the current session `TimeZone`. It does not store the original named zone such as `Europe/Helsinki` as part of the value.

```sql
SET TIME ZONE 'UTC';
SELECT TIMESTAMPTZ '2026-07-30 12:00:00+05';
```

Use `timestamp without time zone` for a wall-clock value whose zone is intentionally outside the value, such as “store opens at 09:00 local time” when a separate location/zone controls interpretation. Use `timestamptz` for events/logs/payments/messages that happen at an actual instant.

## Current time and arithmetic

```sql
SELECT current_date,
       current_timestamp,
       date_trunc('day', now()),
       extract(epoch FROM interval '2 hours');
```

`now()`/`current_timestamp` are transaction-start-stable; use the appropriate clock function when you explicitly need wall-clock progression during a long transaction.

```sql
SELECT TIMESTAMP '2026-10-25 09:00' AT TIME ZONE 'Europe/London';
```

DST creates ambiguous/nonexistent local times. Persist actual instants plus any business-required zone identifier instead of manually adding fixed offsets.

**Exercise:** model a globally scheduled webinar whose published local time must remain meaningful even if time-zone rules change. Explain which fields preserve the instant and which preserve business intent.