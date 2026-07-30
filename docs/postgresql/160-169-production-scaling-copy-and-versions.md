---
id: 160-169-production-scaling-copy-and-versions
title: 160–169 — Incidents, Production Readiness, Scaling, COPY & PostgreSQL Versions
---

# 160 — Production Incident Debugging

Use a hypothesis-driven playbook instead of changing settings during panic.

## CPU at 100%

1. Check whether DB CPU really saturates or host steal/other process does.
2. Identify top active/query fingerprints and call-rate change.
3. Inspect plans, row estimates, temp spills and parallelism.
4. Check deploy/data-volume/statistics changes.
5. Reduce offending workload safely, then fix root cause.

## Connections at limit

Inspect pool behavior, application replica count, idle/idle-in-transaction states, long queries, and connection leaks. Restore admin headroom. Do not make `max_connections` the first fix.

## Queries suddenly slow

Separate execution slowdown from **waiting**. Check locks, I/O latency, cache churn, changed plans/statistics, bloat, checkpoints, replica role, parameter distribution, and downstream networking.

## Disk almost full

Identify growth among relation/index files, WAL/slots, archives, temp files and logs. Preserve recoverability. Expand/free supported storage, then address the source.

## Migration stuck

Find the requested lock and blockers, migration statement, transaction age, and application impact. Cancel only with a known rollback/cleanup plan.

Every incident ends with timeline, root cause, remediation, tests/monitoring improvements and runbook update.

---

# 161 — Production Readiness

Before launch verify:

- backup + automated retention;
- successful restore drill;
- RPO/RTO and HA/failover procedure;
- connection pool/admission limits;
- `statement_timeout`, lock/idle transaction safeguards;
- query workload monitoring (`pg_stat_statements`);
- indexes/constraints for critical paths;
- vacuum/XID age monitoring;
- WAL/archive/slot monitoring;
- disk growth/capacity alerts;
- TLS/network/roles/least privilege/RLS where needed;
- migration expand/contract process;
- incident runbooks/on-call ownership;
- upgrade/version policy;
- capacity plan.

“Managed PostgreSQL” does not remove application schema, query, transaction, migration, or recovery-test responsibility.

---

# 162 — Database Capacity Planning

Forecast multiple dimensions:

```text
rows/table growth → heap size
indexes per table → index growth/write amplification
change rate       → WAL/archive/replication bandwidth
query rate        → CPU/I/O/connections
retention         → storage + backup duration
```

Track daily/weekly table/index growth, WAL bytes/time, peak TPS/QPS, connection/pool waits, CPU, RAM/cache behavior, IOPS/latency, backup/restore duration and replica lag under peak.

Capacity is not only “disk hits 80%.” Know lead time to expand, largest migration/backfill temporary space, failover headroom, and growth after a feature launch.

---

# 163 — Scaling Reads

Scale in this order when it addresses the measured bottleneck:

1. return fewer rows/avoid N+1;
2. correct indexes/plans/statistics;
3. cache stable expensive results;
4. materialized/precomputed read models;
5. increase primary resources when cost-effective;
6. add read replicas for suitable stale/read-only workloads;
7. partition only where pruning/operations benefit;
8. consider distributed architecture when limits justify complexity.

Replica reads carry staleness and failover/routing semantics. Read scaling is not free consistency.

---

# 164 — Scaling Writes

Write throughput is affected by:

- row/index count and width;
- transaction size/batching;
- WAL/durability and storage flush latency;
- hot-row/contention patterns;
- sequences/identity hotspots only in specific contexts;
- triggers/FKs/constraints;
- partition routing;
- vacuum/checkpoints;
- synchronous replication.

Batch compatible writes and use `COPY` for bulk ingestion. Remove redundant indexes. Avoid one global hot counter when distributed allocation/aggregation can express the requirement. Sharding is a late-stage option because it changes transaction/uniqueness/query semantics.

---

# 165 — Bulk Import and Export

`COPY` moves bulk data between a table/query and server-side files/streams; `\copy` is a `psql` client command that streams through the client.

```sql
COPY staging_customers (email, name)
FROM STDIN WITH (FORMAT csv, HEADER true);
```

Use staging tables to separate parsing/loading from validation/merge:

```text
CSV/stream → staging
              ↓ validate/dedupe/type checks
           target tables
```

Consider constraints/indexes/triggers, transaction size, WAL, error strategy, source encoding, null representation, and idempotent retries.

Binary COPY can reduce parsing and preserve PostgreSQL-native representations but is less portable than text/CSV.

---

# 166 — COPY vs INSERT

Mental model:

- single-row INSERT: simple, highest round-trip/statement overhead;
- multi-row INSERT: amortizes parse/protocol/commit overhead;
- COPY: specialized bulk protocol/path with high throughput;
- transaction batching: avoids fsync/commit overhead per row.

Indexes, constraints, triggers and WAL still impose work. Benchmark with realistic schema/durability, not an empty unindexed table only.

Do not disable integrity/durability casually for loading. A staged load can validate once and merge safely while preserving production invariants.

---

# 167 — PostgreSQL 18

PostgreSQL 18 is this handbook's production major, current at **18.4** on 30 July 2026.

Major official highlights:

- new asynchronous I/O subsystem for operations including sequential scans, bitmap heap scans and vacuum;
- B-tree skip-scan support that broadens useful multicolumn-index plans;
- `uuidv7()` timestamp-ordered UUID generation;
- virtual generated columns, now the default generated-column kind;
- OAuth authentication;
- `OLD`/`NEW` support in `RETURNING` for data-modifying commands;
- `pg_upgrade` preserves optimizer statistics, reducing post-upgrade planning instability;
- broad planner, monitoring, replication, SQL, vacuum and administration improvements documented in the release notes.

Do not assume an 18 feature exists in older supported versions; migration/compatibility tests should run against actual source/target versions.

---

# 168 — PostgreSQL 19 Preview

> 🧪 **DEVELOPMENT / BETA — NOT PRODUCTION-STABLE**

As of 30 July 2026 the current pre-release is **PostgreSQL 19 Beta 2**, released 16 July 2026. The PostgreSQL project explicitly advises against production use of beta releases; behavior/details can still change before GA.

The beta train is testing PostgreSQL 19's frozen feature set and compatibility. Current beta notes include work/fixes around new `FOR PORTION OF` temporal-table syntax, SQL/PGQ property-graph functionality, virtual-generated-column optimizations, logical decoding/subscriber tools, autovacuum/MultiXact behavior, FDW statistics, and other PostgreSQL 19 changes.

Use PG19 only in isolated compatibility/performance test environments. Validate drivers, extensions, migrations, SQL behavior and production-shaped workloads, then discard/rebuild test data as needed. Do not make normal application schema depend on PG19 until official GA and your upgrade validation succeed.

---

# 169 — PostgreSQL Versioning and Upgrades

Current supported branches at the audit date: 18, 17, 16, 15, 14. PostgreSQL 14 reaches final support on **12 November 2026**.

Minor upgrades (e.g. 18.3 → 18.4) are cumulative fixes within a major branch and should be kept current. Major upgrades change the major number and require an upgrade path.

Options:

- `pg_upgrade`: fast major-version migration using existing cluster files plus compatibility checks;
- dump/restore: logical rebuild, slower but useful for reorganization/clean migration;
- logical replication: migrate with low write downtime while old/new majors run concurrently;
- provider-specific managed upgrade workflow.

Upgrade checklist:

1. source/target supported versions;
2. release/migration notes;
3. extension/driver/tool compatibility;
4. backup and tested rollback/recovery;
5. rehearsal with production-sized data;
6. application SQL regression tests;
7. plan/performance comparison;
8. replication/HA topology transition;
9. analyze/statistics status (PG18 `pg_upgrade` retention helps but still verify);
10. monitor after cutover.

Never upgrade because a major is “latest” without compatibility testing; never stay on an EOL branch because the upgrade was never planned.