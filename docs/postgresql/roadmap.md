---
id: roadmap
title: Learning Roadmap
description: Progress from database beginner to staff-level PostgreSQL architecture.
sidebar_position: 3
---

# Learning Roadmap

```text
Database beginner
   ↓
relational model + SQL language
   ↓
correct querying + NULL + joins + aggregation
   ↓
advanced SQL + modelling + constraints
   ↓
indexes + transactions + concurrency
   ↓
planner + EXPLAIN + performance
   ↓
MVCC + VACUUM + storage + WAL
   ↓
security + operations + backup/recovery
   ↓
replication + HA + scaling
   ↓
production incident reasoning
   ↓
senior PostgreSQL engineering
   ↓
staff-level database architecture
```

## Stage 1 — Foundations

Study chapters 00–08. Learn database terminology, the relational model, SQL as a declarative language, PostgreSQL architecture, databases/schemas/objects, connections, `search_path`, and table design.

**Exit test:** create a database and schema, design a table with useful constraints, connect with `psql`, and explain the difference between a database, PostgreSQL server, schema, relation, row, transaction, and index.

## Stage 2 — Data types and SQL fundamentals

Study chapters 09–30. Learn type selection, `NULL`, DML, `SELECT`, expressions, filtering, deterministic ordering, pagination, aggregates, grouping, and every major join type.

**Exit test:** given a business question, produce a correct query and explain duplicates, `NULL`, grouping, join cardinality, and stable ordering.

## Stage 3 — Advanced SQL and modelling

Study chapters 31–49. Use subqueries, `LATERAL`, set operations, CTEs, recursive CTEs, window functions, views, constraints, normalization, relationship modelling, and multi-tenancy.

**Exit test:** model a non-trivial domain and defend keys, constraints, nullable fields, relationships, and query access patterns.

## Stage 4 — Indexes and transactions

Study chapters 50–67. Learn B-tree, Hash, GIN, GiST, SP-GiST, BRIN, advanced index design, ACID, snapshots, MVCC, isolation, row/table locks, deadlocks, and race-safe application patterns.

**Exit test:** fix a seat-booking or inventory race without relying on application timing, and justify an index from workload evidence rather than folklore.

## Stage 5 — Query planning and performance

Study chapters 68–81. Read `EXPLAIN (ANALYZE, BUFFERS, WAL)`, reason about estimates and scan/join choices, understand statistics, VACUUM/autovacuum, HOT, bloat, TOAST, and buffer management.

**Exit test:** diagnose a slow query by identifying the expensive plan node and the root cause—not merely by adding an index.

## Stage 6 — Durability and reliability

Study chapters 82–97. Understand WAL, checkpoints, crash recovery, backups, PITR, physical/logical replication, HA, pools, roles, authentication, TLS, RLS, and SQL injection defense.

**Exit test:** state an RPO/RTO, design a backup/restore strategy, explain failover risks, and create a least-privilege application role.

## Stage 7 — PostgreSQL programming and operations

Study chapters 98–138. Learn functions, procedures, PL/pgSQL, triggers, full-text search, extensions, catalogs, monitoring, configuration, partitioning, FDWs, JIT, prepared statements, application access, ORMs, migrations, testing, observability, logging, timeouts, resource limits, replication slots, and disk operations.

**Exit test:** safely plan a large schema migration and investigate blockers, long transactions, query workload, WAL growth, and vacuum health.

## Stage 8 — Distributed and architecture patterns

Study chapters 139–169. Compare self-managed/managed/serverless PostgreSQL, understand CAP during partitions, replicas and stale reads, caching, queues, outbox/idempotency, temporal data, failure modes, capacity, scaling, bulk import, and version upgrades.

**Exit test:** explain which problems PostgreSQL solves locally and which require distributed-system design outside one PostgreSQL instance.

## Stage 9 — Internals and staff-level decisions

Study chapters 170–192. Follow executor tuple flow, system processes, XIDs/MultiXacts, pages/maps/index/WAL/optimizer internals, standards compatibility, extension ecosystem, AI database design, and organization-level architecture.

**Exit test:** review a database platform proposal across ownership, migration governance, HA, security, recovery, capacity, observability, extension policy, and long-term evolution.

## Practice ladder

Reading is only half the handbook. Complete:

- 12 guided projects plus the production capstone;
- 300 SQL exercises across beginner → production difficulty;
- 400 interview questions with reasoning and follow-ups;
- 15 scored mock interview rounds;
- the query interview exercise set;
- production incident playbooks.

The [final completeness audit](./reference/final-completeness-audit.md) records the release gates for the published handbook.