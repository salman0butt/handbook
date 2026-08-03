---
id: 129-138-testing-observability-and-operations
title: "129–138 — Testing, Observability, Logging, Timeouts & Operations"
---

# 129 — Database Testing

Database tests should verify semantics that mocks cannot: constraints, SQL, transactions, concurrency, migrations, types, and query behavior.

Useful test layers:

- isolated database/schema per test worker;
- transaction rollback fixtures for tests that do not need commit semantics;
- seed/factory data with edge cases;
- migration-from-previous-version tests;
- constraint violation tests;
- concurrent multi-connection race tests;
- production-shaped data distributions for performance cases.

Do not use rollback-only fixtures for tests of `NOTIFY`, replication, commit hooks, connection loss, or behavior that exists only after commit.

---

# 130 — SQL Testing

Test output **and** edge conditions:

```sql
-- duplicate join keys
-- NULL on both sides
-- empty input set
-- one-row group
-- tied ordering keys
-- boundary timestamps/ranges
-- concurrent conflicting writes
```

For a query, define expected rows and deterministic ordering. A test that compares unordered output accidentally may be flaky or teach a false guarantee.

Use fixtures that expose `NOT IN` + NULL, outer-join filter placement, aggregate null behavior, window ties/frames, and transaction isolation assumptions.

---

# 131 — Performance Testing

Benchmark representative workloads, not toy row counts.

Measure:

- throughput (transactions/queries per second);
- latency percentiles (p50/p95/p99), not only averages;
- concurrency and pool waits;
- CPU/I/O/temp files/WAL;
- plan shape and estimates;
- warm vs cold-ish cache conditions when relevant;
- database growth/data distribution.

Changing one query can shift bottlenecks to locks, storage, CPU, or connection queuing. Test the system under the expected concurrency mix.

---

# 132 — pgbench

`pgbench` generates PostgreSQL workloads.

Initialize standard benchmark schema:

```bash
pgbench -i -s 10 benchdb
```

Run:

```bash
pgbench -c 20 -j 4 -T 60 benchdb
```

Custom scripts use SQL plus `pgbench` variables/meta commands to model transactions.

Interpret TPS together with latency, failures, connection setup mode, client/thread count, server saturation, checkpoint/WAL behavior, and workload realism. Do not publish “PostgreSQL handles X TPS” without hardware/config/schema/query/durability context.

---

# 133 — Database Observability

Observability combines:

```text
logs + metrics + traces + query fingerprints + database state
```

Trace database spans with operation/fingerprint/timing and safe metadata; avoid recording sensitive bind values by default. Correlate API latency to pool wait, statement latency, lock wait and downstream effects.

Key event classes: slow queries, lock waits/deadlocks, connection errors, failed checkpoints/archives, replication lag, autovacuum problems, disk pressure, migration events, and privilege/authentication failures.

---

# 134 — Logging

PostgreSQL supports server log destinations and structured formats depending on configuration/version. Useful controls include line prefixes, connection/disconnection/error logging, statement duration thresholds, lock waits, checkpoints/autovacuum details, and slow-statement sampling.

`log_min_duration_statement` can capture slow queries; `log_lock_waits` helps blocked-work analysis. Statement logging can be extremely high volume and can expose secrets/PII.

⛔ Do not recommend logging every SQL parameter indiscriminately. Define data classification/redaction/retention/access policy.

---

# 135 — Timeouts

Important safeguards:

```sql
SET statement_timeout = '2s';
SET lock_timeout = '250ms';
SET idle_in_transaction_session_timeout = '30s';
```

PostgreSQL versions also expose transaction timeout capabilities where current; check PostgreSQL 18 docs for exact parameter behavior.

- statement timeout bounds execution/wait time for statements;
- lock timeout bounds waiting to acquire locks;
- idle-in-transaction timeout cleans abandoned open transactions;
- client request timeout/cancellation stops waiting and should cancel server work when supported.

Migration jobs often need different budgets than API queries. Apply settings per role/database/session/use case rather than one global number.

---

# 136 — Resource Limits

Resource failures include:

- connection exhaustion;
- memory pressure from concurrent work/parallelism;
- temporary-file/disk exhaustion;
- WAL growth;
- too many/inactive replication slots;
- long transactions and lock queues;
- storage capacity/IOPS saturation.

Use admission control, bounded pools, timeouts, workload separation, capacity alerts, query limits and tested degradation strategies. Increasing `max_connections` without memory/CPU/process analysis can make overload worse.

---

# 137 — Replication Slots

Replication slots prevent PostgreSQL from discarding WAL (physical slots) or logical decoding state needed by a consumer.

```text
consumer stops
   ↓
slot restart/confirmed position stops advancing
   ↓
WAL retained
   ↓
disk can fill
```

Monitor slot active state, retained WAL, restart/confirmed LSN, consumer health, and configured retention protections. Drop slots that are intentionally retired; never drop an active required slot merely to reclaim space without understanding recovery/resync consequences.

Logical slots also retain catalog/row visibility requirements relevant to decoding. Treat consumers and slots as one reliability system.

---

# 138 — Disk and Storage Operations

Database latency often becomes storage latency under cache misses, checkpoints, WAL flushes, sorts, vacuum, backups, or bulk writes.

Reason about:

- fsync/durability path;
- random vs sequential I/O;
- SSD/HDD/cloud-volume latency and throughput;
- IOPS limits and burst credits where applicable;
- filesystem/free-space/inode health;
- WAL/data/backup/archive capacity;
- temp spill space;
- snapshot/volume guarantees.

Putting WAL on separate storage can help some workloads but is not universally optimal in modern cloud/storage stacks. Benchmark the actual platform.

Disk-full response is an incident runbook: identify growth source (tables/indexes/WAL/slots/temp/logs), stop unsafe growth, preserve recoverability, expand/free capacity safely, then fix root cause. Do not delete arbitrary files from the PostgreSQL data directory.

**Exercise:** design an alert set that catches a stopped logical subscriber before its slot fills disk. Include retained WAL trend, free space, subscriber state/lag, and escalation thresholds.