---
id: sql-exercises-production
title: "Production SQL Exercises P001–P060"
---

# Production — P001–P060

**Schema/sample:** shared schema expanded to production-sized fixtures; exercises add operational/catalog views as named. Every task requires stating correctness risk before performance tuning.

### P001 — Find blocked sessions
**Problem:** list blocked PIDs and blockers. **Schema/sample:** `pg_stat_activity`; create one lock wait in lab. **Expected:** blocked PID, blocker PIDs, query, wait event. **Hint:** `pg_blocking_pids`. **Solution:** `SELECT pid,pg_blocking_pids(pid) blockers,wait_event_type,wait_event,query FROM pg_stat_activity WHERE cardinality(pg_blocking_pids(pid))>0;` **Explanation:** starts from blocker graph. **Alternative:** join `pg_locks` for lock-object detail.

### P002 — Find root blocker
**Problem:** identify blockers that are not themselves blocked. **Schema:** activity/blocking helper. **Expected:** root blocker sessions. **Hint:** collect blocker PIDs then exclude those with blockers. **Solution:** CTE unnest `pg_blocking_pids(pid)` and join activity where `cardinality(pg_blocking_pids(blocker_pid))=0`. **Explanation:** killing victims doesn't resolve root. **Alternative:** recursive blocker tree.

### P003 — Long transactions
**Problem:** sessions with transaction >5 min. **Expected:** age/state/query. **Solution:** `SELECT pid,now()-xact_start age,state,wait_event_type,query FROM pg_stat_activity WHERE xact_start<now()-interval '5 min' ORDER BY xact_start;` **Hint:** xact_start. **Explanation:** long snapshots/locks matter. **Alternative:** monitor externally.

### P004 — Idle in transaction
**Problem:** find idle-in-transaction >1 min. **Expected:** dangerous abandoned transactions. **Solution:** `SELECT pid,now()-xact_start age,query FROM pg_stat_activity WHERE state='idle in transaction' AND xact_start<now()-interval '1 min';` **Hint:** state. **Explanation:** idle still holds transaction context. **Alternative:** timeout prevention.

### P005 — Table dead-tuple triage
**Problem:** rank user tables by dead tuples and last vacuum. **Expected:** table stats. **Solution:** `SELECT relname,n_live_tup,n_dead_tup,last_autovacuum,last_vacuum FROM pg_stat_user_tables ORDER BY n_dead_tup DESC;` **Hint:** stats view. **Explanation:** triage, not exact bloat proof. **Alternative:** size/page analysis.

### P006 — XID age database alert
**Problem:** oldest database frozen XID age. **Expected:** DB + age. **Solution:** `SELECT datname,age(datfrozenxid) xid_age FROM pg_database ORDER BY xid_age DESC;` **Hint:** wraparound. **Explanation:** supports age alerting. **Alternative:** monitoring exporter.

### P007 — Index usage triage
**Problem:** candidate low-use high-size indexes. **Expected:** index scan count + size. **Solution:** join `pg_stat_user_indexes` with `pg_relation_size(indexrelid)` order by size where idx_scan low. **Hint:** don't auto-drop constraints. **Explanation:** usage window/context required. **Alternative:** workload fingerprint mapping.

### P008 — Table/index size report
**Problem:** total/heap/index size per table. **Expected:** human-readable sizes. **Solution:** use `pg_total_relation_size(relid)`, `pg_relation_size(relid)`, and `pg_indexes_size(relid)` over `pg_stat_user_tables`. **Hint:** size functions. **Explanation:** capacity evidence. **Alternative:** catalog query by namespace.

### P009 — Top total query time
**Problem:** top workload consumers. **Expected:** fingerprint/calls/total/mean. **Solution:** `SELECT queryid,calls,total_exec_time,mean_exec_time,rows,query FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 20;` **Hint:** total cost. **Explanation:** frequency × latency. **Alternative:** order by calls/mean for different question.

### P010 — Top temp-spilling queries
**Problem:** identify fingerprints generating temp I/O. **Expected:** temp-block metrics where available. **Solution:** query current `pg_stat_statements` temp block read/write columns ordered by combined temp activity. **Hint:** inspect PostgreSQL 18 column names. **Explanation:** spills can drive disk latency. **Alternative:** logs/temp_file_limit/APM.

### P011 — Slow query diagnosis
**Problem:** p95 endpoint maps to one SQL fingerprint. **Expected:** plan root cause. **Solution:** capture representative bind shape; `EXPLAIN (ANALYZE,BUFFERS,WAL,SETTINGS)` on safe clone; compare estimates/actual and loops. **Hint:** expensive multiplied node. **Explanation:** optimize cause, not plan aesthetics. **Alternative:** auto_explain in controlled configuration.

### P012 — Lock timeout migration
**Problem:** add index/table DDL without waiting indefinitely behind traffic. **Expected:** fail fast if lock unavailable. **Solution:** `SET lock_timeout='2s';` then reviewed DDL in migration. **Hint:** separate from statement_timeout. **Explanation:** avoids long lock queue. **Alternative:** schedule/kill blocker only with runbook.

### P013 — Statement timeout role
**Problem:** API queries limited to 2s, analytics longer. **Expected:** role-specific config. **Solution:** `ALTER ROLE app_api SET statement_timeout='2s'; ALTER ROLE analytics SET statement_timeout='2min';` **Hint:** workload classes. **Explanation:** one global timeout is inappropriate. **Alternative:** transaction-local settings.

### P014 — Pool exhaustion evidence
**Problem:** DB has 300 active/idle app backends. **Expected:** group count by app/state. **Solution:** `SELECT application_name,state,count(*) FROM pg_stat_activity GROUP BY 1,2 ORDER BY 3 DESC;` **Hint:** application_name. **Explanation:** distinguish pool leak vs load. **Alternative:** pool-side metrics.

### P015 — Connection headroom
**Problem:** calculate remaining non-superuser connection capacity conceptually. **Expected:** current total vs configured max/reserved settings. **Solution:** query `pg_settings` for max/reserved connection settings and `pg_stat_activity` count using PostgreSQL 18 semantics. **Hint:** reserve admin capacity. **Explanation:** exact reservation settings/version matter. **Alternative:** managed-provider limits.

### P016 — Replica lag bytes
**Problem:** primary reports lag in bytes per standby. **Expected:** sent/write/flush/replay differences. **Solution:** use `pg_wal_lsn_diff(pg_current_wal_lsn(),replay_lsn)` and stage columns from `pg_stat_replication`. **Hint:** LSN differences. **Explanation:** byte lag complements time lag. **Alternative:** provider metrics.

### P017 — Inactive slot WAL retention
**Problem:** rank slots by retained WAL bytes. **Expected:** slot/name/type/active/bytes. **Solution:** `SELECT slot_name,slot_type,active,pg_wal_lsn_diff(pg_current_wal_lsn(),restart_lsn) retained FROM pg_replication_slots WHERE restart_lsn IS NOT NULL ORDER BY retained DESC;` **Hint:** restart_lsn. **Explanation:** detects disk-risk consumers. **Alternative:** monitoring exporter.

### P018 — Archive health
**Problem:** verify WAL archiving success/failure. **Schema:** `pg_stat_archiver`. **Expected:** archived count/last archived/failure fields. **Solution:** `SELECT * FROM pg_stat_archiver;` interpret timestamps/counters. **Hint:** archived count alone needs generation context. **Explanation:** broken archive destroys PITR assumptions. **Alternative:** object-store freshness checks.

### P019 — WAL generation rate
**Problem:** measure WAL bytes/minute. **Expected:** delta/time. **Solution:** sample `pg_current_wal_lsn()` at controlled intervals and `pg_wal_lsn_diff`, or use cumulative `pg_stat_wal`. **Hint:** rate, not absolute LSN. **Explanation:** informs archive/replica/storage capacity. **Alternative:** metrics system counter rate.

### P020 — Checkpoint pressure
**Problem:** determine if checkpoints too frequent/writes spiky. **Expected:** checkpoint counts/timing/written buffers using current PG18 stats views. **Solution:** query current checkpoint/I/O statistics; correlate with WAL and latency. **Hint:** naming changed across versions. **Explanation:** version audit required. **Alternative:** log_checkpoints + metrics.

### P021 — Cache/buffer query
**Problem:** compare logical reads before/after index. **Expected:** shared hit/read counts. **Solution:** `EXPLAIN (ANALYZE,BUFFERS) ...` both plans. **Hint:** buffer pages ≠ elapsed time alone. **Explanation:** shows data touched. **Alternative:** pg_stat_io workload view.

### P022 — CPU-heavy query vs waiting
**Problem:** active query is slow; decide CPU/execution vs lock wait. **Expected:** `wait_event_type` + plan evidence. **Solution:** inspect activity/waits; if no wait, plan/profile workload. **Hint:** waiting isn't optimizer cost. **Explanation:** prevents adding indexes to a lock problem. **Alternative:** tracing.

### P023 — Hot-key contention
**Problem:** same inventory row causes p99 spike. **Expected:** identify row-lock waits and transaction frequency. **Solution:** blocker/wait analysis + fingerprint + per-SKU app metric. **Hint:** one row serializes writers. **Explanation:** index cannot remove logical contention. **Alternative:** reservation buckets/partitioned counters if domain allows.

### P024 — N+1 production detection
**Problem:** one request emits 101 similar queries. **Expected:** fingerprint has huge calls with tiny mean time. **Solution:** correlate trace request query count with `pg_stat_statements` calls. **Hint:** total round-trip cost. **Explanation:** optimize workload shape. **Alternative:** batch or JOIN/DataLoader.

### P025 — Deep OFFSET production fix
**Problem:** page 10,000 slow. **Expected:** keyset replacement + index. **Solution:** `(created_at,id)<cursor` with `(tenant_id,created_at DESC,id DESC)` index for tenant feed. **Hint:** resume not skip. **Explanation:** avoids processing huge prefix. **Alternative:** materialized page snapshots for random access.

### P026 — Wrong estimate due correlated columns
**Problem:** tenant/status predicate estimated 100× wrong. **Expected:** diagnose stats and create extended stats where meaningful. **Solution:** `CREATE STATISTICS ... (dependencies,mcv) ON tenant_id,status ...; ANALYZE;` **Hint:** correlation. **Explanation:** improves planner model. **Alternative:** per-tenant partitioning only for broader reasons.

### P027 — Generic plan skew
**Problem:** prepared tenant query great for small tenants, poor for huge one. **Expected:** prove custom/generic behavior. **Solution:** compare plans with parameter distributions and plan-cache controls in test. **Hint:** one generic plan. **Explanation:** skew changes cheapest access path. **Alternative:** separate query path for exceptional tenant.

### P028 — Safe online index
**Problem:** add feed index to 500M rows. **Expected:** `CREATE INDEX CONCURRENTLY`, monitor progress/invalid state, disk/WAL budget. **Solution:** run outside transaction with lock/statement budget and `pg_stat_progress_create_index`. **Hint:** multi-phase. **Explanation:** allows writes but costs extra time/work. **Alternative:** maintenance-window normal build.

### P029 — Validate FK online
**Problem:** add FK to huge existing table. **Expected:** add `NOT VALID`, validate later. **Solution:** DDL pattern from chapter 126. **Hint:** index child key first if needed. **Explanation:** new writes enforced while historical scan separated. **Alternative:** direct FK small table.

### P030 — Backfill resume after crash
**Problem:** process `customer_id` batches. **Expected:** no duplicates/skips and restart from durable checkpoint. **Solution:** key-range `WHERE id>$last AND id<=$next AND customer_id IS NULL`, commit then store progress. **Hint:** idempotent condition. **Explanation:** crash-safe. **Alternative:** SKIP LOCKED worker batches.

### P031 — Backfill replica-lag throttle
**Problem:** lag exceeds 30s/GB budget. **Expected:** pause/reduce batch. **Solution:** controller samples lag + API p95 + WAL rate between committed batches. **Hint:** external control loop. **Explanation:** SQL throughput must respect system budget. **Alternative:** run closer to off-peak.

### P032 — Safe type migration
**Problem:** `order_id integer` nearing range limit → bigint. **Expected:** assess metadata/rewrite and compatible app rollout. **Solution:** inspect PG18 exact ALTER behavior; rehearse; expand new column/shadow path if rewrite too disruptive; update FKs/indexes. **Hint:** don't assume cast cost. **Explanation:** type migrations touch dependencies. **Alternative:** direct ALTER in safe small system.

### P033 — Column rename without outage
**Problem:** rename `fullname` to `display_name` with rolling deploy. **Expected:** expand-compatible path. **Solution:** add new column/compat view or dual compatibility layer, backfill, switch code, contract old later. **Hint:** old and new app coexist. **Explanation:** direct rename breaks old binaries. **Alternative:** API view stable name.

### P034 — Unique duplicate cleanup
**Problem:** need unique normalized email but duplicates exist. **Expected:** identify duplicates, define merge policy, clean, concurrent unique index. **Solution:** `GROUP BY lower(email) HAVING count(*)>1`, remediate, `CREATE UNIQUE INDEX CONCURRENTLY ... lower(email)`. **Hint:** constraint exposes data-quality decision. **Explanation:** DDL cannot choose survivor. **Alternative:** tenant-scoped identity rules.

### P035 — Tenant leakage audit query
**Problem:** child table `tasks` may reference project in another tenant. **Expected:** count violations. **Solution:** left/join projects on project_id and compare tenant IDs; then enforce composite FK `(tenant_id,project_id)`. **Hint:** audit before constraint. **Explanation:** RLS alone does not guarantee relationship tenant consistency. **Alternative:** globally unique IDs + check through trigger, weaker.

### P036 — RLS pool leak test
**Problem:** reused connection serves tenant A then B. **Expected:** A context never affects B. **Solution:** use `BEGIN; SET LOCAL app.tenant_id=...; queries; COMMIT;` and integration test pool reuse. **Hint:** SET LOCAL resets at transaction end. **Explanation:** session state must be bounded. **Alternative:** role/database-per-tenant.

### P037 — Security definer audit
**Problem:** inventory all SECURITY DEFINER functions. **Expected:** owner, execute grants, source, config/search path. **Solution:** query `pg_proc` + namespaces/roles/ACL/proconfig for `prosecdef`. **Hint:** elevated code inventory. **Explanation:** privilege boundary needs review. **Alternative:** schema migration static analysis.

### P038 — Public schema privilege audit
**Problem:** determine who can CREATE in schemas on search path. **Expected:** privilege report. **Solution:** use `has_schema_privilege(role,nspname,'CREATE')` across relevant roles/schemas. **Hint:** search-path shadowing. **Explanation:** default assumptions vary/upgrades matter. **Alternative:** explicit REVOKE/managed ownership policy.

### P039 — Default privileges audit
**Problem:** new tables lack app grants. **Expected:** explain default privilege creator-specific behavior. **Solution:** inspect `pg_default_acl`; fix `ALTER DEFAULT PRIVILEGES FOR ROLE migration IN SCHEMA app GRANT ...`. **Hint:** creator role. **Explanation:** defaults are not retroactive. **Alternative:** explicit grants in each migration.

### P040 — PII query logging review
**Problem:** SQL logs expose email/payment metadata. **Expected:** safer logging configuration. **Solution:** reduce broad statement/parameter logging, use duration/fingerprint observability, redaction/access/retention. **Hint:** logs are data copies. **Explanation:** observability must respect classification. **Alternative:** structured app tracing with safe attributes.

### P041 — Restore drill
**Problem:** restore yesterday's backup to isolated environment. **Expected:** timed, verified service. **Solution:** restore physical/logical as strategy dictates, apply WAL target if PITR, verify extensions/roles/schema/constraints/counts/critical queries/app smoke. **Hint:** RTO starts at incident decision. **Explanation:** backup existence is insufficient. **Alternative:** continuous automated restore testing.

### P042 — PITR accidental delete
**Problem:** delete happened 12:03; recover to before it. **Expected:** restore base backup + archive WAL to target on new instance/timeline. **Solution:** documented PG18 recovery settings and target timestamp/LSN; verify data then controlled cutover/extract. **Hint:** do not rewind production blindly. **Explanation:** PITR replays physical history. **Alternative:** logical reconstruction if small/known rows.

### P043 — Failover stale connection
**Problem:** primary fails, clients keep old connections. **Expected:** connection errors, endpoint reroute, bounded reconnect/retry. **Solution:** failover drill with proxy/DNS/provider endpoint and app pool reset. **Hint:** DB promotion alone is not full recovery. **Explanation:** HA includes routing/application. **Alternative:** service mesh/proxy.

### P044 — Split-brain prevention review
**Problem:** network partition isolates old primary. **Expected:** only one writable leader. **Solution:** define quorum/fencing/promotion authority; test old primary cannot serve writes after failover. **Hint:** fencing. **Explanation:** replication alone doesn't prevent dual writers. **Alternative:** managed HA with documented mechanism.

### P045 — Read-after-write replica issue
**Problem:** user updates profile then sees old value. **Expected:** identify async lag. **Solution:** route follow-up read to primary/sticky session or wait for required replay LSN. **Hint:** consistency model. **Explanation:** replicas trade freshness. **Alternative:** accept/document staleness.

### P046 — Archive command failure
**Problem:** WAL archive stopped 4h ago. **Expected:** RPO assumption violated; backlog may grow. **Solution:** inspect archiver stats/logs/storage auth, repair pipeline, verify historical segment continuity before declaring healthy. **Hint:** success freshness. **Explanation:** PITR chain needs continuous WAL. **Alternative:** archiving library/provider service.

### P047 — Slot disk emergency
**Problem:** abandoned slot retains 500GB. **Expected:** decide preserve/resync vs drop. **Solution:** identify consumer ownership/last position; add storage/headroom; if consumer retired or resync accepted, drop slot through SQL; never delete WAL files manually. **Hint:** recoverability trade-off. **Explanation:** slot is consumer contract. **Alternative:** configured slot retention limits with operational policy.

### P048 — Autovacuum blocked by old snapshot
**Problem:** hot table bloat rising while vacuum runs. **Expected:** find old transaction/slot horizon. **Solution:** inspect oldest xact/activity + vacuum progress + slot xmin/catalog_xmin. **Hint:** cleanup horizon. **Explanation:** vacuum cannot remove versions still potentially visible. **Alternative:** fix transaction/consumer policy.

### P049 — Anti-wraparound incident
**Problem:** XID age alert critical. **Expected:** protect database availability/correctness. **Solution:** stop/correct blockers, allow anti-wraparound vacuum, increase resources/capacity, monitor age progress; don't disable/cancel blindly. **Hint:** correctness maintenance. **Explanation:** wraparound can force shutdown/risk visibility. **Alternative:** prevention by age alerts/tuning.

### P050 — VACUUM FULL decision
**Problem:** 2TB table has bloat but 24/7 writes. **Expected:** reject casual VACUUM FULL due rewrite/exclusive lock; choose prevention/repack/rebuild/partition migration based on need. **Solution:** quantify reclaim value, window, disk headroom, alternatives. **Hint:** normal VACUUM reuses space. **Explanation:** operation risk may exceed bloat cost. **Alternative:** online reorganization tooling with testing.

### P051 — Partition retention drop
**Problem:** delete 1B events older than 1 year. **Expected:** if time-partitioned, detach/drop old partitions instead of row DELETE. **Solution:** identify whole expired partitions, detach/drop under reviewed lock/dependency plan. **Hint:** operational partitioning benefit. **Explanation:** avoids billions of row versions/WAL. **Alternative:** batched delete if not partitioned.

### P052 — Too many partitions diagnosis
**Problem:** planning time high with 50k partitions. **Expected:** prove planning/catalog overhead, redesign granularity. **Solution:** EXPLAIN timing/catalog stats; merge partition granularity/retention model. **Hint:** partitioning has cost. **Explanation:** more partitions aren't more performance. **Alternative:** BRIN/index on fewer partitions.

### P053 — Bulk load staging
**Problem:** ingest 100M CSV rows. **Expected:** COPY staging, validate/dedupe, set-based merge, bounded commit/WAL plan. **Solution:** unlogged/temp/permanent staging choice based crash/replica need; COPY; constraints/validation; INSERT/MERGE. **Hint:** keep target invariants. **Explanation:** separates I/O from business validation. **Alternative:** streaming batched inserts.

### P054 — COPY error recovery
**Problem:** 0.1% malformed rows. **Expected:** reject/quarantine strategy without corrupting target. **Solution:** pre-validate/stage raw lines or use tooling supporting error capture, then typed load. **Hint:** COPY statement failure semantics. **Explanation:** production ingestion needs bad-row policy. **Alternative:** application parser.

### P055 — Capacity forecast
**Problem:** orders+indexes grow 40GB/week, free 500GB. **Expected:** forecast including WAL/backfill/headroom, not simple 12.5 weeks. **Solution:** calculate trend plus largest index build/migration temporary space, backup/replica requirements and alert/expansion lead time. **Hint:** transient space. **Explanation:** operations need safety margin. **Alternative:** storage autoscaling with hard caps monitored.

### P056 — SLO query budget
**Problem:** API p95 300ms, DB allowed 100ms. **Expected:** set query/lock/pool budgets. **Solution:** statement timeout below request deadline, lock timeout smaller, pool queue timeout, cancellation propagation. **Hint:** layered deadline. **Explanation:** prevents work continuing after caller abandons. **Alternative:** per-endpoint classes.

### P057 — Read scaling decision
**Problem:** primary CPU 75%, workload 80% stale-tolerant reads. **Expected:** first optimize top queries/indexes/cache; then replica if capacity/consistency model supports. **Solution:** workload report + replica routing policy. **Hint:** replicas add lag/HA complexity. **Explanation:** don't replicate inefficient reads blindly. **Alternative:** vertical scale/materialized reads.

### P058 — Write scaling decision
**Problem:** hot single ledger table high write rate. **Expected:** identify storage/WAL/index/contention bottleneck before shard. **Solution:** measure top write plans, index count/HOT, WAL fsync, hot keys, batching; optimize, then partition/shard only with explicit trigger. **Hint:** one primary serializes some invariants. **Explanation:** sharding changes transactions. **Alternative:** domain-specific append partitioning.

### P059 — Upgrade rehearsal
**Problem:** PostgreSQL 17→18.4. **Expected:** complete rehearsal report. **Solution:** restore clone; run pg_upgrade/check or logical path, extensions/drivers, migrations/tests, compare `pg_stat_statements`/plans, HA/backup, cutover/rollback timings. **Hint:** PG18 stats retention still verify plans. **Explanation:** major upgrade is system change. **Alternative:** logical replication low-downtime migration.

### P060 — Production readiness review
**Problem:** approve new service for launch. **Expected:** evidence across correctness/performance/security/recovery/ops. **Solution:** verify constraints, concurrency tests, plans/load SLO, pool/timeouts, least privilege/TLS/RLS, backup+restore/PITR, HA/failover, monitoring, vacuum/XID, slots/WAL/disk, migrations, incident runbooks, version policy. **Hint:** use chapter 161. **Explanation:** production readiness is a system property. **Alternative:** none; missing evidence remains a launch risk.

## Exercise-bank completion

B001–B060 + I001–I060 + A001–A060 + E001–E060 + P001–P060 = **300 exercises** across five difficulty levels.