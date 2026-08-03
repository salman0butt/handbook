---
id: 01-04-foundations-architecture
title: "01–04 — Database Foundations, Relational Model, SQL & PostgreSQL Architecture"
---

# 01 — Database Fundamentals

Data becomes useful when its meaning, structure, constraints, ownership, and lifecycle are explicit. A database instance is a running DBMS environment; metadata describes database objects; a catalog is DBMS-managed metadata exposed through structures such as PostgreSQL's `pg_catalog`.

```text
application clients
      ↓ connections
PostgreSQL instance
      ↓
databases → schemas → relations and other objects
```

A table has typed columns and rows. A **key** identifies or relates rows. **Integrity** means states obey declared rules: type/domain rules, entity identity, referential rules, and business constraints.

### Client/server implications

A connection is a server resource and transaction boundary carrier, not merely a socket. A connection pool should reuse a bounded number of database sessions instead of opening one unbounded connection per request.

### Design exercise

For an online store, identify entities, attributes, candidate keys, relationships, business invariants, and the queries that drive the model. Do this before choosing indexes.

---

# 02 — Relational Model

A **relation** is defined by a heading (attributes and their domains) and a body of tuples. SQL tables are inspired by the relational model but SQL has practical differences, including duplicate-producing queries unless uniqueness is requested/enforced and explicit `NULL` semantics.

## Keys

- **superkey:** any attribute set that uniquely identifies a tuple;
- **candidate key:** minimal superkey;
- **primary key:** candidate key selected as primary identity;
- **alternate key:** other candidate key, usually enforced with `UNIQUE`;
- **foreign key:** attributes referencing a unique/candidate key in another or the same relation.

```sql
CREATE TABLE customers (
  customer_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL UNIQUE
);

CREATE TABLE orders (
  order_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id bigint NOT NULL REFERENCES customers(customer_id)
);
```

## Integrity

**Entity integrity** protects identity. **Referential integrity** prevents dangling references. `CHECK`, `NOT NULL`, `UNIQUE`, exclusion constraints, and transactional logic protect additional invariants.

## Relational algebra mental model

You do not need formal proofs, but these operations explain SQL composition:

| Algebra concept | SQL intuition |
| --- | --- |
| selection | filter rows (`WHERE`) |
| projection | choose/compute columns (`SELECT`) |
| union | `UNION` |
| difference | `EXCEPT` |
| Cartesian product | `CROSS JOIN` |
| join | combine related rows |
| rename | aliases |

```text
relations
  ↓ selection / projection / join / set operations
new relation-like result
```

**Senior reasoning:** model facts so each invariant has a clear enforcement point. A schema that depends on every caller remembering unwritten rules is fragile.

---

# 03 — SQL Language Overview

**✅ Standard SQL concept.** SQL is declarative: describe the required result/change, not a loop over storage pages.

```sql
SELECT p.id, p.title
FROM posts AS p
WHERE p.published_at >= DATE '2026-01-01'
ORDER BY p.published_at DESC;
```

An SQL statement is built from keywords, identifiers, literals, expressions, and clauses. Whitespace usually separates tokens; semicolons terminate statements in clients/scripts.

## Identifiers and quoting

Unquoted PostgreSQL identifiers are folded to lower case. Quoted identifiers preserve case and otherwise unusual names:

```sql
CREATE TABLE account_entries (...);  -- conventional
CREATE TABLE "AccountEntries" (...); -- requires quoting forever
```

Prefer predictable lower `snake_case` names. String literals use single quotes; double quotes identify names.

```sql
SELECT 'Ada' AS display_name;
-- SQL comment
/* block comment */
```

## Educational categories

| Label | Typical purpose |
| --- | --- |
| DDL | object definitions such as `CREATE`, `ALTER`, `DROP` |
| DML | row changes such as `INSERT`, `UPDATE`, `DELETE`, `MERGE` |
| DQL | `SELECT` (a teaching label, not a separate language) |
| TCL | transaction control (`COMMIT`, `ROLLBACK`, savepoints) |
| DCL | privileges (`GRANT`, `REVOKE`) |

These labels are learning aids. PostgreSQL's SQL surface includes administration, session control, cursors, prepared statements, replication-related operations, and extensions beyond simplistic buckets.

## Logical vs physical execution

The written clause order and conceptual query-processing order do not tell you the physical plan. The planner may reorder joins, choose indexes, parallelize work, or use hashes/sorts while preserving semantics.

---

# 04 — PostgreSQL Architecture

**🐘 PostgreSQL implementation.** PostgreSQL uses a process-oriented server architecture. A normal client connection is handled by a backend server process; shared memory and auxiliary/background processes coordinate shared state and maintenance.

```text
client
  ↓ connect/authenticate
server listener / postmaster concept
  ↓
backend process (session)
  ├─ parser / planner / executor
  ↓
shared memory
  ├─ shared buffers
  ├─ WAL-related state
  └─ locks / process state
  ↓
storage
```

Important auxiliary processes/workers include the checkpointer, background writer, WAL writer, autovacuum launcher/workers, and replication-related processes. Exact process names/roles are version-sensitive; this handbook targets PostgreSQL 18.

## Object and session boundaries

- one server cluster contains multiple databases;
- connections select one database;
- a database contains schemas;
- roles are cluster-wide identities/privilege principals;
- a session carries settings, temp objects, prepared statements, transaction state, and possibly locks;
- different databases in one cluster do not join tables directly with normal SQL.

## Query pipeline

```text
SQL text
  ↓
parse: syntax tree
  ↓
analyze: names/types/semantics
  ↓
rewrite: rule/view transformations
  ↓
plan: candidate paths + cost estimates
  ↓
execute: plan node tree pulls/produces tuples
  ↓
results / changes
```

## Production implications

Connection count consumes processes/memory, so pooling matters. Shared buffers are not the only cache because the OS page cache also participates. WAL durability is separate from eventual heap-page writes. Vacuum is required because MVCC visibility leaves obsolete tuple versions behind.

**Interview question:** Why can a correct SQL query become slow without any source-code change? Expected reasoning should include data volume/distribution, statistics, cache state, concurrent load/locks, planner choices, bloat, I/O, configuration, and changed access patterns—not “PostgreSQL is slow.”