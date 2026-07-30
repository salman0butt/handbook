---
id: 05-08-objects-connections-schemas-tables
title: 05–08 — Databases, Schemas, Connections & Tables
---

# 05 — Databases, Schemas, and Objects

A PostgreSQL **cluster** is one server installation/data directory containing databases and cluster-wide roles. Each connection operates in one database. Inside a database, schemas provide namespaces for objects.

```text
cluster
├─ database app
│  ├─ schema public
│  │  ├─ tables / indexes
│  │  ├─ views / materialized views
│  │  ├─ functions / procedures / triggers
│  │  └─ types / domains / sequences
│  └─ schema billing
└─ database analytics
```

Important object families include tables, views, materialized views, sequences, indexes, functions, procedures, triggers, types, domains, and extensions. Ownership is security-relevant: the owner can usually alter/drop the object and grant privileges.

```sql
CREATE SCHEMA billing;
CREATE TABLE billing.invoices (...);
CREATE VIEW billing.open_invoices AS ...;
```

**Production rule:** do not use separate schemas merely to avoid thinking about ownership boundaries. Schemas are namespaces and privilege boundaries, not independent databases or security sandboxes by themselves.

---

# 06 — Create Database and Connections

**✅ Standard concepts + 🐘 PostgreSQL administration.** Database creation is normally an administrative action:

```sql
CREATE DATABASE appdb OWNER app_owner;
ALTER DATABASE appdb SET timezone = 'UTC';
DROP DATABASE appdb;
```

`CREATE DATABASE` cannot run inside a normal transaction block because it performs cluster-level setup. PostgreSQL creates new databases from templates; `template1` is the normal template and `template0` provides a pristine base for special locale/encoding cases.

## Connection parameters

A connection typically specifies host, port, database, user, and authentication/TLS options:

```text
postgresql://app_user:secret@db.example.com:5432/appdb?sslmode=verify-full
```

Avoid putting long-lived secrets in source code or shell history. Drivers also accept individual parameters and environment variables such as `PGHOST`, `PGPORT`, `PGDATABASE`, and `PGUSER`.

```bash
psql -h localhost -p 5432 -U postgres -d appdb
```

A session can hold settings, transactions, prepared statements, locks, and temporary objects. Connection pooling later determines whether those session assumptions remain valid.

## Locale and encoding

Encoding/collation choices affect valid text, ordering, comparison semantics, and index behavior. They are architecture decisions; do not blindly inherit an environment-specific locale for a system that must behave consistently across deployments.

**Failure mode:** an application that opens hundreds of connections during autoscaling can exhaust `max_connections` even when query throughput is modest. Solve admission/pooling before simply raising the ceiling.

---

# 07 — Schemas and `search_path`

A schema qualifies object names:

```sql
CREATE SCHEMA app AUTHORIZATION app_owner;
CREATE TABLE app.users (...);
SELECT * FROM app.users;
```

The `search_path` controls how unqualified names are resolved and where unqualified object creation occurs.

```sql
SHOW search_path;
SET search_path = app, pg_catalog;
```

## Security mental model

If an untrusted user can create objects in a schema that appears earlier in another session's `search_path`, an unqualified name can resolve to an attacker-controlled object. This matters especially for functions with elevated privileges, administrative scripts, and extension installation.

```text
unqualified name
   ↓
search_path left → right
   ↓
first matching visible object wins
```

**Safe patterns:** qualify security-sensitive object names; restrict `CREATE` on shared schemas; define safe `search_path` behavior for `SECURITY DEFINER` functions; understand the current privileges on `public` rather than assuming defaults.

## Organization patterns

Schemas can group domains such as `billing`, `auth`, and `reporting`, or isolate extension/admin objects. Schema-per-tenant can work at small tenant counts but adds migration/catalog/connection-path operational complexity. Shared-schema tenancy plus `tenant_id`, constraints, indexes, and RLS is often easier to operate at scale.

---

# 08 — Tables

A table defines typed columns and invariants:

```sql
CREATE TABLE orders (
  order_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id bigint NOT NULL REFERENCES customers(customer_id),
  status text NOT NULL CHECK (status IN ('pending','paid','cancelled')),
  total_amount numeric(12,2) NOT NULL CHECK (total_amount >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);
```

## `ALTER TABLE`

Schema evolution uses operations such as:

```sql
ALTER TABLE orders ADD COLUMN external_ref text;
ALTER TABLE orders ADD CONSTRAINT orders_external_ref_key UNIQUE (external_ref);
ALTER TABLE orders RENAME COLUMN external_ref TO provider_ref;
```

DDL is transactional in many PostgreSQL cases, but DDL acquires locks and some transformations rewrite tables. “Transactional” does not mean “safe for a large production table without planning.”

## Generated and identity columns

PostgreSQL 18 defaults generated columns to **virtual** generated columns; expressions compute on read. Identity columns are the modern SQL-aligned mechanism for sequence-backed numeric identifiers:

```sql
id bigint GENERATED BY DEFAULT AS IDENTITY
```

Prefer identity columns over treating `serial` pseudo-types as magical types. `serial` creates a sequence/default relationship but has different DDL semantics.

## Temporary, unlogged, inherited, and partitioned tables

- **temporary:** session/transaction-scoped working data; creates catalog/activity overhead if abused;
- **unlogged:** skips WAL for table data, improving some write workloads but loses crash-safety/replication expectations;
- **inheritance:** older PostgreSQL feature with specialized semantics; do not confuse with declarative partitioning;
- **partitioned:** logical parent whose rows live in partitions chosen by partition key.

## Drop safety

```sql
DROP TABLE orders;          -- destructive
DROP TABLE IF EXISTS orders;
```

`IF EXISTS` removes one error condition; it does not make destructive DDL safe. Use ownership, migration review, backups, and recovery runbooks.

**Exercise:** design `products`, `orders`, and `order_items` with keys and checks. Explain why storing all items in one comma-separated text column would destroy enforceable relationships and queryability.