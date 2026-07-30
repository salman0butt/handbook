---
id: interview-mastery-overview
title: SQL & PostgreSQL Interview Mastery
---

# SQL & PostgreSQL Interview Mastery

Strong database interviews test a progression:

```text
correct SQL
  ↓
correct result grain + NULL/tie semantics
  ↓
constraints + data modelling
  ↓
transactions + concurrency
  ↓
indexes + plans + statistics
  ↓
MVCC / vacuum / WAL / recovery
  ↓
security + operations
  ↓
architecture trade-offs
```

Use the [400-question bank](../interview-question-bank/overview.md), [query interview exercises](./query-interview-exercises.md), and [15 mock interview rounds](../mock-interview-practice/overview.md).

## Answer framework for SQL problems

1. State output grain: one row per what?
2. State tie and `NULL` semantics.
3. Write the simplest correct query.
4. Walk through a tiny fixture by hand.
5. Discuss alternatives and portability.
6. Name the supporting index only after defining access pattern.
7. Explain likely plan nodes/row estimates.
8. For writes, discuss concurrent sessions and invariant enforcement.

## Answer framework for production questions

```text
symptom → evidence → hypothesis → safest mitigation → root fix → prevention
```

Mention specific evidence (`pg_stat_activity`, `pg_locks`, `pg_stat_statements`, `EXPLAIN (ANALYZE, BUFFERS)`, vacuum/replication/WAL statistics) rather than offering a random GUC.

## Answer framework for architecture questions

Cover data model/invariants, access paths, transaction/isolation model, scale assumptions, consistency, migrations, security, recovery/HA, observability, capacity/cost, alternatives, and measurable trigger points for added complexity.

## Red flags to remove from interview answers

- “Indexes make queries faster.”
- “Serializable runs one transaction at a time.”
- “`timestamptz` stores the original timezone.”
- “VACUUM deletes data / always shrinks files.”
- “A read replica is a backup.”
- “RLS means application authorization is unnecessary.”
- “Partitioning is sharding.”
- “ORM means I do not need SQL.”
- “I would increase `max_connections` / `work_mem` first.”

Replace slogans with mechanisms, trade-offs, and evidence.