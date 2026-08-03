---
id: 108-120-monitoring-config-partitioning-and-plans
title: "108–120 — Monitoring, Configuration, Partitioning, FDWs, Parallelism, JIT & Prepared Plans"
---

# 108 — Monitoring

Monitor the database as a workload and reliability system, not only CPU graphs.

Core signals:

- connection count, pool wait and session states;
- transaction rate, age, rollbacks;
- query latency/throughput/fingerprints;
- locks and wait events;
- replication lag and slots;
- WAL generation/archive health;
- disk capacity/latency/IOPS;
- CPU/memory/temp files;
- table/index size and growth;
- vacuum/analyze and XID age;
- checkpoints/background I/O;
- database errors/timeouts.

Always connect a metric to a user/service symptom and a hypothesis.

---

# 109 — Lock Monitoring

Use `pg_stat_activity`, `pg_locks`, and blocking helpers:

```sql
SELECT pid,
       pg_blocking_pids(pid) AS blockers,
       wait_event_type,
       wait_event,
       query
FROM pg_stat_activity
WHERE cardinality(pg_blocking_pids(pid)) > 0;
```

Diagnosis order:

```text
blocked PID
  ↓ blocking PIDs
  ↓ blocker transaction age + query/state
  ↓ lock/object + application owner
  ↓ safe mitigation
```

Do not terminate the blocked query first by habit; find the root blocker. A session `idle in transaction` can be more damaging than an actively executing one because it may retain locks/snapshot horizon without doing work.

---

# 110 — Long-Running Transactions

Long transactions can:

- hold row/table locks;
- retain old snapshots and `xmin` horizons;
- prevent vacuum from removing dead tuples;
- increase bloat;
- increase replication conflicts/lag concerns;
- make deployment DDL wait;
- keep transaction IDs old.

Inspect transaction age and state:

```sql
SELECT pid, now() - xact_start AS xact_age, state, query
FROM pg_stat_activity
WHERE xact_start IS NOT NULL
ORDER BY xact_start;
```

Remediation depends on ownership/impact. Fix application transaction scope and configure `idle_in_transaction_session_timeout` where appropriate rather than relying on manual termination.

---

# 111 — Configuration

Settings come from compiled/default values, configuration files, `ALTER SYSTEM`, command-line/service settings, role/database settings, and session/transaction `SET` operations according to PostgreSQL precedence/context rules.

```sql
SHOW work_mem;
SELECT name, setting, unit, source, pending_restart
FROM pg_settings
WHERE name = 'shared_buffers';
```

`ALTER SYSTEM` writes auto-configuration and should be managed deliberately with infrastructure/configuration processes.

Some settings reload; others require restart; some are session-only. Never copy an “optimized postgresql.conf” without workload/RAM/storage/version context.

---

# 112 — Memory Configuration

Important settings:

- `shared_buffers`: PostgreSQL page cache;
- `work_mem`: memory limit basis for individual sort/hash operations before spilling, potentially multiple operations per query;
- `maintenance_work_mem`: maintenance operations such as vacuum/index creation (with documented exceptions/parallel behavior);
- `effective_cache_size`: planner estimate of cache available across PostgreSQL + OS, not allocated memory;
- huge pages: can reduce page-table overhead in suitable deployments.

`work_mem × max_connections` is **not** a precise memory formula. One query can have multiple work-memory-consuming nodes, parallel workers multiply work, and not every connection uses it simultaneously. The correct lesson is that per-operation memory can multiply under concurrency.

---

# 113 — WAL Configuration

Key parameters/concepts:

- `wal_level` — amount of WAL information needed by replication/logical decoding;
- `max_wal_size` / `min_wal_size` — checkpoint/WAL retention behavior, not absolute disk caps;
- `wal_compression` — trade CPU for less WAL for full-page images where applicable;
- `synchronous_commit` — commit acknowledgement durability/replication timing trade-off;
- checkpoint settings;
- `archive_mode` and archive command/library for PITR.

A replication slot or broken archive process can retain WAL far beyond `max_wal_size`; monitor actual disk growth.

---

# 114 — Autovacuum Configuration

Tune per table when workload differs.

- small tables: defaults often sufficient; percentages trigger quickly in absolute rows;
- huge tables: reduce scale factors so maintenance begins after manageable row changes;
- update-heavy: provide enough workers/I/O budget and consider fillfactor/HOT/index count;
- insert-heavy: monitor insert-triggered vacuum/freeze/visibility behavior;
- multi-tenant shared tables: hot tenants can dominate change distribution; partitioning is an operational option only if it solves multiple real needs.

Use thresholds based on relation size/change rate and measured vacuum duration. Don't disable autovacuum to “fix CPU.”

---

# 115 — Partitioning

Declarative partitioning divides one logical table into child partitions by key.

```sql
CREATE TABLE events (
  tenant_id uuid NOT NULL,
  occurred_at timestamptz NOT NULL,
  payload jsonb
) PARTITION BY RANGE (occurred_at);

CREATE TABLE events_2026_07 PARTITION OF events
FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');
```

Methods: range, list, hash. Partitions can themselves be partitioned.

## Partition pruning

When predicates constrain partition keys, planning/execution can eliminate irrelevant partitions. The benefit is skipping whole relations, not magically accelerating every query.

## Indexes and uniqueness

Partitioned indexes coordinate matching child indexes. Unique/primary constraints on a partitioned table must satisfy PostgreSQL restrictions that allow global uniqueness to be enforced without a global index—typically including partition key columns.

## Operations

Attach/detach partitions enables lifecycle management, staging, archival, and bulk loading. A default partition catches values not fitting explicit bounds but can complicate later attachment/validation.

Partitioning can hurt when there are too many partitions, pruning is weak, indexes are already sufficient, workload crosses all partitions, or operational complexity exceeds benefit.

---

# 116 — Sharding

Sharding distributes rows across **multiple PostgreSQL servers/nodes**. Native table partitioning inside one server is not sharding.

```text
request → shard router → shard A / shard B / shard C
```

Design problems include shard key choice, routing, rebalancing, skew/hot shards, global uniqueness, cross-shard joins/aggregates, distributed transactions, failover per shard, migrations, and observability.

Premature sharding converts local transactions/joins into distributed problems. First optimize schema, queries, indexes, pooling, caching, partitioning where justified, and vertical/replica capacity.

---

# 117 — Foreign Data Wrappers

SQL/MED-style foreign data wrappers expose remote data as foreign tables.

```sql
CREATE SERVER reporting_pg
FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (host '...', dbname 'reporting');

CREATE USER MAPPING FOR app_user
SERVER reporting_pg
OPTIONS (user '...', password '...');
```

`postgres_fdw` can push filters/joins/aggregates/operations to a remote PostgreSQL server when safe. Pushdown is plan-dependent; inspect remote SQL in `EXPLAIN VERBOSE` where applicable.

Foreign transactions, network latency, authentication, remote locks, version differences, and failure semantics make FDWs distributed systems. Do not treat foreign tables as local tables with free network access.

---

# 118 — Parallel Query

PostgreSQL can use background workers for parallel-safe portions of scans, joins, and aggregates.

```text
leader
  ├─ worker 1
  ├─ worker 2
  └─ worker 3
       ↓
Gather / Gather Merge
```

`Gather` combines rows without preserving worker sort order; `Gather Merge` merges ordered worker streams.

Planner decisions depend on relation size, costs, worker settings/availability, function parallel safety, plan shape, and expected benefit. Parallelism adds startup/coordination cost and is not always better for latency-sensitive small queries.

---

# 119 — JIT

PostgreSQL can use LLVM-based Just-In-Time compilation to compile portions of expression evaluation for sufficiently expensive queries.

Benefits appear mainly when expensive CPU-heavy query execution amortizes compilation startup. Short OLTP queries can lose latency if compilation cost exceeds saved execution time.

`EXPLAIN (ANALYZE ...)` can show JIT details when used. Tune based on actual workload; disabling JIT for latency-sensitive classes can be reasonable while analytics benefits.

---

# 120 — Prepared Statements

SQL-level preparation:

```sql
PREPARE find_orders(bigint) AS
SELECT * FROM orders WHERE customer_id = $1;

EXECUTE find_orders(42);
DEALLOCATE find_orders;
```

Drivers commonly use the extended query protocol/prepared statements without explicit SQL `PREPARE`.

PostgreSQL can choose **custom plans** using parameter values or a **generic plan** reused across executions. Highly skewed parameter distributions can make one generic plan poor for some values.

Example:

```text
tenant A = 50% of table
most tenants = 0.001%
```

The best plan for tenant A may be different from a tiny tenant. Diagnose parameter-sensitive behavior with plan inspection/statistics rather than disabling preparation globally.

Prepared statements improve parsing/planning reuse and parameterization; they are not an automatic performance win for every workload.