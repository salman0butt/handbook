---
id: mock-interview-rounds-06-10
title: "Mock Interview Rounds 6–10"
---

# Rounds 6–10

## Round 6 — Schema Design

**Scenario:** design a multi-tenant project/task SaaS schema.

**Questions**

1. Identify entities, candidate keys, relationships and invariants before writing DDL.
2. Choose UUIDv7 vs bigint IDs and justify.
3. Enforce tenant-scoped project slug uniqueness and prevent cross-tenant task→project references.
4. Explain where JSONB is appropriate and where it weakens the model.
5. Design zero-downtime evolution for a new required `project_type`.

**Strong-answer checkpoints:** composite tenant-aware keys/FKs, constraints as invariant guardians, normalization first, typed stable fields, expand/backfill/validate/contract.

**Scoring emphasis:** modelling 35, constraints 25, evolution 20, tenancy/security 20.

**Follow-up:** When would you move one large tenant to a dedicated database?

---

## Round 7 — Indexing

**Scenario:** orders has 500M rows; hot query filters tenant/status and sorts newest first.

**Questions**

1. Design a candidate B-tree and explain column order.
2. When would a partial index be better?
3. Explain `INCLUDE` and index-only scan requirements.
4. Compare B-tree, GIN, GiST, BRIN and Hash with one workload each.
5. What write/HOT/WAL/storage costs must be reviewed before adding the index?

**Strong-answer checkpoints:** equality keys before ordered range where appropriate, workload not cardinality slogans, visibility map, operator class/access method fit, redundant-index audit.

**Scoring emphasis:** access-path reasoning 35, PostgreSQL mechanics 25, write trade-offs 25, validation plan 15.

**Follow-up:** Why might PostgreSQL still choose a Seq Scan after your index exists?

---

## Round 8 — Transactions

**Questions**

1. Explain ACID with PostgreSQL mechanisms, not definitions only.
2. Describe autocommit and what happens after an error inside an explicit transaction.
3. Show a savepoint use case and explain why it is not an independently committed nested transaction.
4. Define a business transaction boundary for checkout.
5. Explain why an external payment HTTP request should not stay inside an open DB transaction.

**Strong-answer checkpoints:** WAL/durability, constraints/consistency, isolation/concurrency, aborted transaction state, outbox/idempotency for external effects.

**Scoring emphasis:** transaction semantics 40, application boundaries 30, failure handling 20, communication 10.

**Follow-up:** Which work belongs in the same transaction as an outbox row?

---

## Round 9 — Concurrency

**Scenario:** two users try to buy the final unit; other workers claim jobs simultaneously.

**Questions**

1. Show the read-modify-write race and fix it with atomic conditional UPDATE.
2. Optimistic version column vs `SELECT FOR UPDATE`: when choose each?
3. Explain Read Committed, Repeatable Read and Serializable in PostgreSQL.
4. Give a write-skew example and explain SSI retries.
5. Design a `SKIP LOCKED` worker claim with lease/idempotency.

**Strong-answer checkpoints:** affected-row protocol, deterministic lock ordering, whole-transaction retry of 40001/40P01, `SKIP LOCKED` intentionally incomplete view, short claim transaction.

**Scoring emphasis:** correctness under concurrency 45, isolation mechanics 25, failure/retry 20, communication 10.

**Follow-up:** How do deadlocks differ from serialization failures?

---

## Round 10 — EXPLAIN

**Scenario:** an endpoint query rose from 40 ms to 2 s.

**Questions**

1. Read a plan node’s cost, estimated rows, actual rows and loops correctly.
2. Explain why `rows × loops` matters.
3. Compare Seq Scan, Index Scan, Index Only Scan and Bitmap Heap Scan.
4. Diagnose a Hash Join whose estimated build input is 500 rows but actual is 500k.
5. Use BUFFERS/WAL/SETTINGS and distinguish execution from lock waiting.

**Strong-answer checkpoints:** first estimate divergence, plan node multiplication, visibility map for index-only, statistics/skew/extended stats, representative parameters, pg_stat_activity for waits.

**Scoring emphasis:** plan interpretation 45, root-cause method 30, evidence discipline 15, safety 10.

**Fail condition:** calls every Seq Scan bad or proposes disabling it globally.

**Follow-up:** Why is `EXPLAIN ANALYZE DELETE ...` dangerous?