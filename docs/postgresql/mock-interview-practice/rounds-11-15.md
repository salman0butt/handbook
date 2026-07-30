---
id: mock-interview-rounds-11-15
title: Mock Interview Rounds 11–15
---

# Rounds 11–15

## Round 11 — Performance

**Scenario:** PostgreSQL CPU is 90%, p99 doubled, and storage reads increased after a feature launch.

**Questions**

1. Build a hypothesis-driven diagnosis sequence.
2. How do `pg_stat_statements`, traces, EXPLAIN, buffers and wait events complement each other?
3. Explain stale statistics, parameter skew and generic plans.
4. When does caching help, and what consistency problems does it add?
5. How do you prove an optimization helped the whole workload rather than one benchmark query?

**Strong-answer checkpoints:** workload total-time/frequency, estimate-vs-actual rows, temp spills/I/O, pool queueing, before/after p95/p99 and resource cost, rollback.

**Scoring emphasis:** methodology 35, planner/workload depth 30, systems trade-offs 25, communication 10.

**Follow-up:** Why can raising `work_mem` solve one query and destabilize the system?

---

## Round 12 — PostgreSQL Internals

**Questions**

1. Walk SQL through parse → analyze → rewrite → plan → execute.
2. Explain heap tuple versions, snapshots, xmin/xmax concepts and VACUUM.
3. Explain page layout, line pointers, FSM and visibility map.
4. Explain WAL record/LSN/checkpoint/full-page-image/crash recovery relationship.
5. Explain HOT update and why index design affects it.

**Strong-answer checkpoints:** no “in-place UPDATE” simplification, VM/index-only relationship, write-ahead ordering, anti-wraparound freezing, implementation details tied to version.

**Scoring emphasis:** internals accuracy 45, connection to production behavior 35, terminology 10, communication 10.

**Follow-up:** What is MultiXact and when can it become operationally important?

---

## Round 13 — Production Operations

**Scenario:** during peak traffic a standby lags, one inactive slot retains WAL, a long transaction exists, and disk is 85% full.

**Questions**

1. Prioritize actions and identify which signals threaten correctness/recovery first.
2. Diagnose replication lag stages and slot-retained WAL.
3. Explain why old transactions can block cleanup and affect bloat.
4. Define backup/PITR verification and a safe disk-pressure runbook.
5. Describe a failover drill including fencing, routing and application reconnects.

**Strong-answer checkpoints:** never delete files from `pg_wal`, preserve recovery, identify consumer before dropping slot, monitor XID age, tested RPO/RTO, root blocker analysis.

**Scoring emphasis:** incident safety 35, operations depth 35, recovery/HA 20, communication 10.

**Follow-up:** What evidence lets you declare PITR healthy after fixing an archive failure?

---

## Round 14 — Senior System Design

**Scenario:** design a global e-commerce platform using PostgreSQL.

**Questions**

1. Model products, inventory, orders, snapshots, payments and idempotency.
2. Prevent overselling and duplicate payment effects under retries/concurrency.
3. Design indexes/keyset pagination for customer history and catalog hot paths.
4. Define outbox/jobs, read replicas, cache consistency and analytics separation.
5. Define migrations, RPO/RTO, backup/PITR, HA, monitoring, security and scale triggers.

**Strong-answer checkpoints:** immutable order facts/ledger, atomic inventory or deterministic locks, constraints, explicit consistency contract for replicas/cache, no premature sharding, operational readiness.

**Scoring emphasis:** data/concurrency 30, performance 20, reliability/security 25, evolution/scale 15, communication 10.

**Follow-up:** At what measurable point would you shard writes, and by what key?

---

## Round 15 — Staff Database Architecture

**Scenario:** you own PostgreSQL strategy for 100 engineering teams and hundreds of databases.

**Questions**

1. Define ownership boundaries and supported platform tiers.
2. Establish version/extension/security/migration/backup/HA governance without blocking teams.
3. Design fleet observability, capacity/cost attribution, restore/failover testing and incident command.
4. Define shared-schema tenancy, dedicated-tenant tiers, data residency and regional strategy.
5. Explain when the platform should recommend another technology instead of PostgreSQL.

**Strong-answer checkpoints:** measurable SLO/RPO/RTO tiers, no runtime owners/superusers, current minors/EOL policy, automated migration/backfill guardrails, restore evidence, fencing, extension allowlist, architecture trigger points, developer enablement.

**Scoring emphasis:** organizational architecture 30, reliability/security governance 30, platform mechanisms 20, trade-offs/cost 10, communication/influence 10.

**Staff-level follow-up:** Pick one policy you would institutionalize first, identify the failure it prevents, adoption path, exception process, success metric and what you intentionally do **not** standardize.