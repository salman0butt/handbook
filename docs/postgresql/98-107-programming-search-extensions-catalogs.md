---
id: 98-107-programming-search-extensions-catalogs
title: "98–107 — Functions, Procedures, PL/pgSQL, Triggers, Search, Extensions & Catalogs"
---

# 98 — Functions

PostgreSQL functions accept parameters and return scalar, composite, set, or table values.

```sql
CREATE FUNCTION gross_amount(net numeric, tax_rate numeric)
RETURNS numeric
LANGUAGE sql
IMMUTABLE
STRICT
RETURN net * (1 + tax_rate);
```

Important attributes:

- `IMMUTABLE`: same inputs always same result for database-planning purposes;
- `STABLE`: can read database state but result is stable within one statement snapshot;
- `VOLATILE`: may change even within a statement / has side effects; default;
- `STRICT`: returns null without calling body if any argument is null.

Wrong volatility labels can produce incorrect optimizer assumptions; they are semantic contracts, not performance hints.

`SECURITY INVOKER` (default) uses caller privileges. `SECURITY DEFINER` runs with function owner's privileges and therefore needs hardened ownership, restricted execute grants, and safe `search_path`/qualified names.

SQL-language functions are ideal for relational expressions; PL/pgSQL adds imperative flow when needed.

---

# 99 — Procedures

Procedures are called with `CALL`:

```sql
CREATE PROCEDURE archive_old_events(cutoff timestamptz)
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO event_archive
  SELECT * FROM events WHERE occurred_at < cutoff;
  DELETE FROM events WHERE occurred_at < cutoff;
END;
$$;

CALL archive_old_events(now() - interval '1 year');
```

Functions participate in expressions and return values; procedures are invoked as statements and can perform transaction control in contexts where PostgreSQL permits it. Do not use procedures merely to move all application logic into the database. Use them when database-local orchestration, privilege encapsulation, batch work, or administration benefits clearly.

---

# 100 — PL/pgSQL

PL/pgSQL is PostgreSQL's procedural language for functions/procedures/triggers.

```sql
CREATE FUNCTION reserve_stock(p_sku text, p_qty integer)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  remaining integer;
BEGIN
  UPDATE inventory
  SET quantity = quantity - p_qty
  WHERE sku = p_sku
    AND quantity >= p_qty
  RETURNING quantity INTO remaining;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'insufficient stock';
  END IF;

  RETURN remaining;
EXCEPTION
  WHEN check_violation THEN
    RAISE;
END;
$$;
```

Features include variables, assignments, `IF`/`CASE`, loops, records, cursors, exception blocks, `RETURN`/`RETURN QUERY`, and dynamic `EXECUTE`.

## Dynamic SQL

Use `format('%I', identifier)` for identifiers and `USING` for values:

```plpgsql
EXECUTE format('SELECT count(*) FROM %I', safe_table)
INTO n;
```

Only allow approved identifiers. Dynamic SQL expands injection/search-path complexity and can affect plan caching.

Debug with precise `RAISE` levels, server logs, tests, and query plans of embedded SQL. Do not hide every error in a catch-all exception block.

---

# 101 — Triggers

Triggers run database code in response to table/view events.

Timing:

- `BEFORE`
- `AFTER`
- `INSTEAD OF` (notably views)

Granularity:

- `FOR EACH ROW`
- `FOR EACH STATEMENT`

Trigger functions can access `NEW`/`OLD` as appropriate. Transition tables/relations let suitable statement triggers inspect sets of affected old/new rows.

```sql
CREATE TRIGGER orders_audit
AFTER INSERT OR UPDATE OR DELETE ON orders
FOR EACH ROW EXECUTE FUNCTION audit_order_change();
```

Use cases include auditable local history, derived-data maintenance, and invariant enforcement not expressible by declarative constraints.

## Risks

Triggers create hidden write paths, recursion possibilities, migration surprises, bulk-load cost, and debugging complexity. Prefer declarative constraints/generated columns when they express the rule. Document trigger ordering/interaction and test it.

---

# 102 — Event Triggers

Event triggers respond to database-wide DDL events rather than row DML. They can implement governance, auditing, policy enforcement, or metadata automation around commands such as object creation/drop.

Because event triggers affect schema operations globally and can block migrations, restrict ownership and deployment carefully. They are advanced governance tools, not a default way to customize every DDL statement.

---

# 103 — Full-Text Search

PostgreSQL full-text search normalizes document text into `tsvector` lexemes and queries into `tsquery`.

```sql
SELECT to_tsvector('english', title || ' ' || body)
       @@ websearch_to_tsquery('english', $1)
FROM articles;
```

A generated search vector can make indexing explicit:

```sql
ALTER TABLE articles
ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce(title,'')), 'A') ||
  setweight(to_tsvector('english', coalesce(body,'')), 'B')
) STORED;

CREATE INDEX articles_search_gin
ON articles USING gin (search_vector);
```

Configurations/dictionaries control tokenization and normalization. Ranking functions such as `ts_rank` score matches; normalize/rank according to product requirements, not as a universal relevance metric.

GIN is common for read-heavy full-text search; GiST has different trade-offs. Trigram similarity (`pg_trgm`) complements full-text search for fuzzy substring/spelling use cases but is an extension.

---

# 104 — Extensions

Extensions package SQL objects and sometimes native code with versioned installation metadata.

```sql
CREATE EXTENSION pg_stat_statements;
ALTER EXTENSION pg_stat_statements UPDATE;
```

Examples from PostgreSQL/contrib include `pg_stat_statements`, `pg_trgm`, `citext`, `hstore`, `btree_gist`, and others. Third-party examples include PostGIS and pgvector.

Extension governance matters:

- trusted vs superuser-required installation;
- extension schema/search path;
- native code supply chain;
- compatibility with PostgreSQL upgrades;
- backup/restore availability;
- managed-service support;
- version pinning/testing.

An extension is not “just another table”; it becomes part of the database platform dependency graph.

---

# 105 — pg_stat_statements

`pg_stat_statements` aggregates statistics by normalized query fingerprint, turning workload optimization from guesswork into measurement.

Important metrics include calls, total/mean execution time, rows, block I/O, WAL-related counters where exposed, and planning statistics when collection is configured.

```sql
SELECT queryid, calls, total_exec_time, mean_exec_time, rows, query
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 20;
```

Look at multiple views:

- high **total time**: workload consumers;
- high **mean time**: slow individual calls;
- high **calls**: chatty/N+1-style paths;
- large rows/temp/I/O: data movement or spilling.

Normalized queries replace constants so one fingerprint groups similar statements. Statistics reset on explicit reset or lifecycle events according to configuration; preserve history externally when trend analysis matters.

---

# 106 — System Catalogs

`pg_catalog` contains PostgreSQL's internal metadata relations/functions. `information_schema` provides standards-oriented metadata views with a more portable abstraction.

Core catalogs include:

- `pg_class`: relations/indexes/sequences/etc.;
- `pg_attribute`: columns;
- `pg_namespace`: schemas;
- `pg_index`: index metadata;
- `pg_constraint`: constraints;
- `pg_proc`: functions/procedures;
- `pg_roles`: role view.

Example:

```sql
SELECT n.nspname AS schema_name,
       c.relname,
       c.relkind
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname NOT IN ('pg_catalog','information_schema');
```

Catalog structure is PostgreSQL-version-specific. Use documented views/functions when possible and avoid writing application business logic that depends on unstable internal columns.

---

# 107 — Statistics Views

PostgreSQL exposes cumulative/current statistics views including:

- `pg_stat_activity` — sessions and current activity;
- `pg_stat_database` — database-level workload counters;
- `pg_stat_user_tables` — scans, tuple changes, vacuum/analyze timing/counters;
- `pg_stat_user_indexes` — index scans and tuple fetch information;
- replication views such as `pg_stat_replication`/subscription statistics;
- WAL statistics such as `pg_stat_wal`;
- background/checkpoint/I/O statistics whose naming/fields evolve by version.

PostgreSQL 18 documentation is the authority for exact current fields.

Statistics have collection/reset/snapshot semantics. A counter is evidence, not a diagnosis: “index scan count is zero” may mean unused, newly reset, standby-only workload, rare critical query, or measurement window mismatch.

**Exercise:** build an inventory of every user table with size, estimated live/dead tuples, last analyze/vacuum, sequential/index scan counts, and total index size using documented catalog/statistics functions/views.