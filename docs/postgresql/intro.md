---
id: intro
title: SQL & PostgreSQL Developer Handbook
description: A production-focused handbook from relational and SQL fundamentals through PostgreSQL internals, operations, reliability, and staff-level database architecture.
sidebar_position: 1
---

# SQL & PostgreSQL Developer Handbook

This handbook teaches two related but different things:

```text
SQL as a declarative database language
            +
PostgreSQL as a production relational database system
```

The goal is not to memorize syntax. The goal is to reason from data models and invariants through queries, transactions, indexes, execution plans, storage, concurrency, and production architecture.

## Baseline

- **SQL standard:** ISO/IEC 9075:2023 / SQL:2023.
- **Production PostgreSQL:** PostgreSQL 18, current stable minor **18.4** at the 30 July 2026 audit.
- **Development PostgreSQL:** PostgreSQL 19 Beta 2 is explicitly **🧪 development / not production-stable**.
- Examples target PostgreSQL 18 unless a section is marked otherwise.

### Portability labels

| Label | Meaning |
| --- | --- |
| ✅ Standard SQL | Concept/syntax comes from standard SQL. |
| ✅ Standard + PostgreSQL | Standard feature implemented by PostgreSQL. |
| 🐘 PostgreSQL extension | Useful PostgreSQL-specific feature. |
| ⚠️ PostgreSQL-specific behavior | Portable concept with implementation-specific behavior. |
| 🧪 Development / beta | Not part of the production baseline. |
| ⛔ Unsafe / legacy | Pattern to avoid in modern production systems. |

## The central mental model

SQL is declarative. You state **what result or state transition is required**; PostgreSQL decides **how to execute it**.

```text
application
    ↓
SQL statement
    ↓
parser → analyzer → rewriter
    ↓
planner / optimizer
    ↓
execution plan
    ↓
executor
    ↓
buffers / WAL / storage
    ↓
rows or durable state
```

A good database engineer therefore asks more than “does the SQL run?” They ask:

1. What invariant does the data model protect?
2. What rows are logically required?
3. What happens with `NULL` and duplicates?
4. What can concurrent transactions observe or race on?
5. Which access paths can the planner use?
6. Are estimates close to reality?
7. What write amplification, WAL, locking, and vacuum work does this create?
8. How does the system recover from failure?

## Who this is for

Backend and full-stack developers, data engineers, application architects, DevOps/SRE engineers, DBAs, and interview candidates can use the same progression. Beginner chapters teach tables and `SELECT`; advanced chapters connect MVCC, WAL, planner statistics, replication, schema governance, and recovery policy.

## How to study

Use the [learning roadmap](./roadmap.md), then build the projects rather than reading passively. Run examples against PostgreSQL 18, inspect plans with `EXPLAIN`, deliberately create transaction races in separate sessions, and test restoration—not only backup creation.

High-value entry points:

- [Start Here](./00-start-here.md)
- [SELECT, filtering, ordering, and pagination](./24-27-select-filter-sort-pagination.md)
- [Aggregation and joins](./28-30-aggregation-and-joins.md)
- [Advanced SQL and window functions](./31-38-advanced-querying.md)
- [Data modelling](./45-49-modelling-and-multitenancy.md)
- [Indexes](./50-57-indexes.md)
- [Transactions, MVCC, and isolation](./58-63-transactions-mvcc-isolation.md)
- [Locks and concurrency patterns](./64-67-locks-deadlocks-concurrency-patterns.md)
- [Planner, `EXPLAIN`, and performance](./68-74-query-planning-explain-performance.md)
- [VACUUM and storage](./75-81-vacuum-storage-buffers.md)
- [WAL, backup, recovery, replication, and HA](./82-90-wal-recovery-replication-ha.md)
- [Security](./91-97-connections-and-security.md)
- [Projects](./projects/01-library-database.md)
- [300 SQL exercises](./sql-exercises/beginner.md)
- [400 interview questions](./interview-question-bank/overview.md)

## Authority and research policy

The PostgreSQL 18 documentation is the implementation authority. SQL:2023 is the standards baseline. Beginner tutorial sources are used only as curriculum checklists, never as the authority for PostgreSQL behavior. Version-sensitive claims are recorded in [Version Baseline](./version-baseline.md) and the reference audits.

## Completion model

The content is released through a gated workflow. The [final completeness audit](./reference/final-completeness-audit.md) remains `NOT COMPLETE` until production build validation, exact-head merge, publication, live-route verification, and a final official-source re-audit all succeed.