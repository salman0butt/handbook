---
id: 00-start-here
title: 00 — Start Here
sidebar_position: 4
---

# 00 — Start Here

## What a database is

A **database** is organized persistent data. A **DBMS** is the software that stores, queries, protects, coordinates, and recovers that data. PostgreSQL is a DBMS; a PostgreSQL database is one logical database managed by a PostgreSQL server/cluster.

An **RDBMS** organizes data using the relational model: relations (commonly represented as tables), tuples (rows), attributes (columns), domains/types, keys, constraints, and relationships.

```text
client application
      ↓ SQL over a connection
PostgreSQL server
      ↓
database → schema → table/index/etc.
```

**SQL** is the declarative language used to define, read, and modify relational data. **PostgreSQL** implements SQL and adds extensions. A query states the result you need; the planner chooses an execution strategy.

## Vocabulary you must own

| Term | Mental model |
| --- | --- |
| database | logical collection of objects/data inside a cluster |
| DBMS | software managing databases |
| server/cluster | one PostgreSQL instance and its data directory/databases |
| client | `psql`, application driver, GUI, migration tool, etc. |
| schema | namespace inside one database |
| relation/table | set/bag-like tabular structure with typed columns |
| row/tuple | one record |
| column/attribute | named typed property |
| domain | permitted value set/type semantics |
| query | SQL statement requesting data or change |
| transaction | atomic unit of database work |
| constraint | invariant enforced by the database |
| primary key | chosen unique, non-null row identity |
| foreign key | enforced reference to a candidate/unique key |
| index | auxiliary access structure maintained with the table |

## Relational vs document databases

A relational design makes relationships and invariants first-class through keys, constraints, joins, and transactions. A document model can place related data in nested documents and prioritize aggregate-local access. PostgreSQL can also store `jsonb`, but JSONB does not remove the need to model stable relational facts relationally.

## PostgreSQL architecture at first glance

```text
client
  ↓
backend process / session
  ↓
parser → analyzer → rewriter → planner → executor
  ↓
shared buffers + WAL + relation files
```

Each normal connection has a server backend process. Shared memory and auxiliary processes coordinate caching, WAL, checkpoints, vacuum, and replication. Later chapters make these mechanics concrete.

## Install PostgreSQL 18

Use the PostgreSQL package appropriate for your OS from the official download page, or run an isolated learning server with Docker:

```bash
docker run --name pg-handbook \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=handbook \
  -p 5432:5432 \
  -d postgres:18
```

For local learning this password is intentionally simple. **Do not copy it into production.**

Connect:

```bash
psql "postgresql://postgres:postgres@localhost:5432/handbook"
```

Useful `psql` meta-commands:

```text
\l        list databases
\c db     connect
\dn       schemas
\dt       tables
\d table  describe relation
\x        expanded display
\timing   client-side timing
\q        quit
```

`psql` meta-commands begin with `\`; they are client commands, not SQL.

## Your first database workflow

```sql
CREATE TABLE users (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL UNIQUE,
  display_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO users (email, display_name)
VALUES ('ada@example.com', 'Ada')
RETURNING id, email;

SELECT id, email, display_name
FROM users
WHERE email = 'ada@example.com';

UPDATE users
SET display_name = 'Ada Lovelace'
WHERE email = 'ada@example.com'
RETURNING *;

DELETE FROM users
WHERE email = 'ada@example.com'
RETURNING *;
```

`RETURNING` is a PostgreSQL capability used extensively in application code. Parameterize user input in real applications; the literals above are fixed examples.

## First transaction

```sql
BEGIN;

UPDATE accounts
SET balance = balance - 100
WHERE id = 1;

UPDATE accounts
SET balance = balance + 100
WHERE id = 2;

COMMIT;
```

The important lesson is not just `BEGIN`/`COMMIT`: concurrent transactions can overlap. Correct transaction design depends on isolation, locks, constraints, and application retry behavior.

## First constraint mindset

If an invariant must always hold, prefer database enforcement when PostgreSQL can express it:

```sql
CREATE TABLE inventory (
  sku text PRIMARY KEY,
  quantity integer NOT NULL CHECK (quantity >= 0)
);
```

An API validation check is helpful UX; the database constraint is the final guardian across every application, script, migration, and concurrent session.

## First index mindset

A primary key creates an index, but “add indexes to every filtered column” is wrong. Indexes consume space and add work to inserts/updates/deletes. Their value depends on workload, selectivity, ordering, join strategy, table size, and planner estimates.

You will learn to validate them with plans:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, email
FROM users
WHERE email = 'ada@example.com';
```

## Learning exercise

1. Start PostgreSQL 18.
2. Create `users` and `posts` tables with a foreign key.
3. Insert three users and five posts.
4. Join users to posts.
5. Open two `psql` sessions and leave a transaction open in one while inspecting it from the other with `pg_stat_activity`.
6. Run `EXPLAIN` for one query.

**Interview check:** Explain database vs DBMS vs PostgreSQL server vs database vs schema. If those boundaries are fuzzy, revisit this page before advancing.