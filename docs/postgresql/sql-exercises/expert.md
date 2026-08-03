---
id: sql-exercises-expert
title: "Expert SQL Exercises E001–E060"
---

# Expert — E001–E060

**Schema/sample:** shared schema, scaled fixtures, plus named additions. These problems combine SQL correctness with PostgreSQL planner/concurrency/operations reasoning.

### E001 — Cohort retention matrix
**Schema:** customers/events. **Problem:** signup month vs month-N active retention. **Expected:** cohort_month, activity_month, retained users, cohort size, rate. **Hint:** first cohort + distinct user-month. **Solution:** `WITH c AS (SELECT id,date_trunc('month',created_at) cohort FROM customers), a AS (SELECT DISTINCT user_id,date_trunc('month',occurred_at) active FROM events), x AS (SELECT c.cohort,a.active,count(DISTINCT c.id) retained FROM c JOIN a ON a.user_id=c.id AND a.active>=c.cohort GROUP BY 1,2), s AS (SELECT cohort,count(*) size FROM c GROUP BY 1) SELECT x.*,x.retained::numeric/s.size rate FROM x JOIN s USING(cohort);` **Explanation:** separates cohort denominator from later activity. **Alternative:** precomputed cohort fact table.

### E002 — Funnel conversion
**Schema:** events. **Problem:** users view→cart→purchase in order. **Expected:** counts/rates by step. **Hint:** conditional first timestamps. **Solution:** aggregate each user's `min(occurred_at) FILTER` per event, then require `cart_at>=view_at`, `purchase_at>=cart_at`. **Explanation:** temporal ordering matters, not only existence. **Alternative:** event-pattern window/recursive query.

### E003 — Gap-and-island subscriptions
**Schema addition:** `entitlements(user_id,start_date,end_date)`. **Problem:** merge touching/overlapping ranges. **Expected:** consolidated periods. **Hint:** running max previous end + gap flag. **Solution:** compute `max(end_date) over(partition by user_id order by start_date rows between unbounded preceding and 1 preceding)`, flag gaps, cumulative-sum group, min/max. **Explanation:** handles nested overlaps unlike simple LAG alone. **Alternative:** range multirange aggregation where suitable.

### E004 — Temporal as-of join
**Schema addition:** `prices(product_id,valid_from,valid_to,price)`. **Problem:** price effective at each order item time. **Expected:** historical price per item. **Hint:** half-open period predicate. **Solution:** join `o.created_at>=p.valid_from AND o.created_at<p.valid_to`, or range containment. **Explanation:** current product price is wrong for history. **Alternative:** snapshot unit_price already in order_items.

### E005 — Slowly changing dimension latest row
**Schema:** prices. **Expected:** current version/product. **Hint:** DISTINCT ON/window. **Solution:** `SELECT DISTINCT ON(product_id) * FROM prices ORDER BY product_id,valid_from DESC;` **Explanation:** PostgreSQL extension chooses first per ordered group. **Alternative:** row_number portable.

### E006 — Exact division query
**Schema:** customers/orders. **Problem:** customers who ordered every product in category tools. **Expected:** relational division result. **Hint:** double NOT EXISTS. **Solution:** same pattern as I008 with customer→orders→items nested predicate. **Explanation:** expresses universal quantification. **Alternative:** count distinct ordered product IDs = category product count.

### E007 — Weighted average selling price
**Schema:** order_items. **Expected:** weighted avg/product. **Hint:** sum(value)/sum(qty). **Solution:** `SELECT product_id,sum(quantity*unit_price)/NULLIF(sum(quantity),0) FROM order_items GROUP BY product_id;` **Explanation:** `avg(unit_price)` weights lines, not units. **Alternative:** expand units only pedagogically, never production.

### E008 — Pareto revenue contributors
**Schema:** orders. **Problem:** smallest top customer set reaching 80% revenue. **Expected:** customers with cumulative share at or below the threshold, including the first row crossing 0.8. **Hint:** aggregate revenue then cumulative window. **Solution:** aggregate by customer, compute `sum(r) over(order by r desc)/sum(r) over()` and filter including first crossing row. **Explanation:** two-stage window analysis. **Alternative:** percentile grouping.

### E009 — Running balance with same-time ties
**Schema addition:** ledger(account_id,entry_id,posted_at,amount). **Expected:** deterministic balance. **Solution:** `SELECT ...,sum(amount) OVER(PARTITION BY account_id ORDER BY posted_at,entry_id ROWS UNBOUNDED PRECEDING) balance FROM ledger;` **Hint:** stable tie-breaker. **Explanation:** without entry_id ties make row order ambiguous. **Alternative:** sequence/order key.

### E010 — Detect ledger imbalance
**Schema:** ledger with journal_id. **Expected:** journals sum !=0. **Solution:** `SELECT journal_id,sum(amount) FROM ledger GROUP BY journal_id HAVING sum(amount)<>0;` **Hint:** invariant audit. **Explanation:** reconciliation query, not substitute for posting enforcement. **Alternative:** deferred constraint trigger.

### E011 — Window exclusion reasoning
**Problem:** compute average of other employees in department excluding current row. **Expected:** peer average. **Hint:** frame EXCLUDE CURRENT ROW where supported. **Solution:** `avg(salary) OVER(PARTITION BY department ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING EXCLUDE CURRENT ROW)`. **Explanation:** frame exclusion. **Alternative:** `(sum-salary)/(count-1)` with null/one-row handling.

### E012 — GROUPS frame
**Problem:** cumulative salary by distinct salary peer groups. **Expected:** all rows at same salary share cumulative result. **Solution:** `sum(salary) OVER(PARTITION BY department ORDER BY salary GROUPS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)`. **Hint:** peer-group frame. **Explanation:** GROUPS advances by peer groups. **Alternative:** preaggregate salary levels.

### E013 — Recursive shortest-depth tree
**Schema:** employees/tree. **Problem:** compute minimum depth from root when graph can have multiple parents (add edges table). **Expected:** node min depth. **Hint:** recursive paths then MIN. **Solution:** recursive CTE with `UNION ALL` carrying depth, cycle guard, final `min(depth) group by node`. **Explanation:** recursion enumerates paths. **Alternative:** graph extension/algorithm for large graphs.

### E014 — SEARCH/CYCLE tree
**Schema:** edges. **Problem:** use SQL SEARCH/CYCLE to order and mark cycles. **Expected:** traversal order + cycle flag. **Hint:** PostgreSQL supports clauses. **Solution:** recursive CTE followed by `SEARCH DEPTH FIRST BY id SET ordercol CYCLE id SET is_cycle USING path`. **Explanation:** declarative traversal metadata. **Alternative:** manual arrays.

### E015 — Lateral dynamic top-N
**Problem:** top `$n` products per category. **Expected:** variable n rows/category. **Solution:** distinct category outer + `CROSS JOIN LATERAL (SELECT ... LIMIT $1)`. **Hint:** parameterized subquery. **Explanation:** index `(category,price DESC,id)` can make each lookup selective. **Alternative:** window rank then `rn<=$n`.

### E016 — Plan top-N alternatives
**Problem:** compare A015 LATERAL vs window on 10M products. **Expected:** plan/buffer comparison. **Solution:** `EXPLAIN (ANALYZE,BUFFERS)` both with suitable index. **Hint:** count categories and N. **Explanation:** repeated indexed probes vs global sort/window. **Alternative:** precomputed category leaders.

### E017 — CTE materialization trade-off
**Problem:** same expensive CTE referenced twice but outer filters differ. **Expected:** compare MATERIALIZED vs NOT MATERIALIZED. **Solution:** run both forms with `EXPLAIN (ANALYZE,BUFFERS)`. **Hint:** one computation vs pushdown. **Explanation:** materialization saves repetition but blocks optimization across boundary. **Alternative:** temp table for reused multi-statement result.

### E018 — Expression statistics
**Schema:** products. **Problem:** frequently filter lower(category) without a column. **Expected:** improve access/estimates. **Solution:** create expression index `ON products(lower(category))`; `ANALYZE`; inspect plan. **Hint:** expression index gathers stats through index expression. **Explanation:** expression becomes indexed statistic source. **Alternative:** normalized stored column.

### E019 — Selectivity skew
**Schema:** 90% orders status paid, 1% failed. **Problem:** explain why same `(status)` index may be used for failed not paid. **Expected:** plan comparison. **Solution:** analyze then EXPLAIN both literals. **Hint:** MCV frequencies. **Explanation:** selective rare value index vs common sequential scan. **Alternative:** partial failed-status index.

### E020 — Partial index for rare state
**Problem:** optimize failed-order retry queue. **Expected:** tiny ordered index. **Solution:** `CREATE INDEX orders_failed_retry_idx ON orders(created_at,id) WHERE status='failed';` **Hint:** stable rare predicate. **Explanation:** reduces size/write/search scope for target. **Alternative:** `(status,created_at,id)` if many status queries.

### E021 — BRIN correlation experiment
**Schema:** 50M events inserted by time. **Problem:** compare BRIN size/time-range plan vs B-tree. **Expected:** BRIN tiny and range-efficient when correlated. **Solution:** create both indexes, inspect `pg_relation_size` and plans. **Hint:** block summaries. **Explanation:** BRIN filters ranges, not individual row keys. **Alternative:** B-tree for narrow exact/sorted access.

### E022 — BRIN disorder experiment
**Problem:** randomize event timestamps physically then rerun E021. **Expected:** BRIN becomes less selective. **Solution:** load randomized table, ANALYZE, EXPLAIN. **Hint:** physical correlation. **Explanation:** summaries cover wider value ranges. **Alternative:** B-tree or clustering/partition lifecycle.

### E023 — GIN write cost experiment
**Schema:** products JSONB. **Problem:** measure insert/update with and without broad GIN. **Expected:** GIN improves supported reads but adds write/WAL/index size. **Solution:** benchmark fixture load and query before/after index. **Hint:** one row yields many entries. **Explanation:** read/write trade-off. **Alternative:** focused expression indexes.

### E024 — HOT eligibility experiment
**Schema:** products add frequently updated `views`. **Problem:** compare updates when `views` indexed vs not. **Expected:** lower HOT rate when indexed. **Solution:** run update workload, inspect `pg_stat_user_tables.n_tup_hot_upd`, reset/measure carefully. **Hint:** indexed column change blocks HOT. **Explanation:** index design affects heap update path. **Alternative:** separate counters table.

### E025 — Fillfactor HOT experiment
**Problem:** compare HOT on packed vs fillfactor 80 table. **Expected:** more same-page room at cost of size. **Solution:** clone tables, set fillfactor, load then update; inspect stats/size. **Hint:** page free space. **Explanation:** lower fillfactor reserves room. **Alternative:** no change if update rate low.

### E026 — Index-only scan experiment
**Problem:** covering index after bulk load vs after vacuum. **Expected:** heap fetch difference. **Solution:** create INCLUDE index, run plan, vacuum, rerun. **Hint:** visibility map. **Explanation:** all-visible pages allow skipping heap visibility checks. **Alternative:** normal index scan.

### E027 — Redundant index audit
**Problem:** find obvious duplicates by catalog/index definitions. **Expected:** candidate list, not automatic drop. **Solution:** inspect `pg_indexes`, `pg_index`, keys/includes/predicates/uniqueness; compare usage. **Hint:** semantic equivalence is nuanced. **Explanation:** overlapping indexes cost writes. **Alternative:** extension/tooling review.

### E028 — Foreign-key delete performance
**Problem:** delete parent with 10M child orders before/after child FK index. **Expected:** constraint check faster with index. **Solution:** test in transaction/rollback with `orders(customer_id)` index. **Hint:** FK lookup on child. **Explanation:** PostgreSQL does not auto-create referencing index. **Alternative:** cascade design only if lifecycle semantics justify.

### E029 — CREATE INDEX CONCURRENTLY failure lab
**Problem:** cancel concurrent build midway. **Expected:** invalid index may remain. **Solution:** start build on large table, cancel test environment, inspect `pg_index.indisvalid`, drop/retry concurrently. **Hint:** multi-phase build. **Explanation:** production automation must handle invalid state. **Alternative:** ordinary CREATE INDEX during maintenance window.

### E030 — Reindex concurrently lab
**Problem:** rebuild bloated index while preserving writes. **Expected:** replacement with limited blocking phases. **Solution:** `REINDEX INDEX CONCURRENTLY index_name;` inspect locks/progress/version restrictions. **Hint:** concurrent rebuild. **Explanation:** operational trade-offs/time/space. **Alternative:** standard REINDEX in downtime.

### E031 — Vacuum dead tuple lab
**Problem:** update/delete many rows then VACUUM. **Expected:** dead tuples become reusable; file need not shrink. **Solution:** measure relation size/stats, `VACUUM`, measure again. **Hint:** reuse vs OS return. **Explanation:** normal vacuum doesn't compact whole file. **Alternative:** VACUUM FULL rewrite with lock.

### E032 — Long transaction blocks cleanup
**Problem:** keep Repeatable Read snapshot open while deleting in another session and vacuuming. **Expected:** old versions retained until snapshot ends. **Solution:** two-session lab + stats. **Hint:** xmin horizon. **Explanation:** MVCC must preserve visibility. **Alternative:** enforce transaction timeouts/short scopes.

### E033 — Autovacuum threshold calculation
**Problem:** given threshold 50, scale 0.2, 10M tuples, compute change trigger conceptually. **Expected:** about 2,000,050 modified/deleted tuples under classic formula (subject to current settings/features). **Solution:** threshold + scale×reltuples. **Hint:** per-table scale. **Explanation:** huge tables may wait too long. **Alternative:** per-table lower scale/threshold.

### E034 — Freeze-age audit
**Problem:** rank databases/tables by XID age. **Expected:** oldest first. **Solution:** query `age(datfrozenxid)` from `pg_database` and relation freeze metadata via documented catalogs. **Hint:** wraparound monitoring. **Explanation:** age drives anti-wraparound risk. **Alternative:** monitoring system metrics.

### E035 — WAL bytes per update
**Problem:** compare updating indexed vs non-indexed column. **Expected:** differing WAL volume. **Solution:** capture `pg_current_wal_lsn()`, run controlled transaction, compute `pg_wal_lsn_diff` plus `EXPLAIN(...WAL)` where suitable. **Hint:** index maintenance/full-page effects. **Explanation:** writes are more than heap values. **Alternative:** pg_stat_wal workload delta.

### E036 — Checkpoint WAL effect
**Problem:** compare first page changes after checkpoint with later changes. **Expected:** full-page image contribution. **Solution:** controlled test environment checkpoint, update pages, observe WAL; repeat same pages. **Hint:** FPI after checkpoint. **Explanation:** recovery protects torn pages. **Alternative:** inspect WAL tooling in lab.

### E037 — Replication lag stages
**Schema:** primary/standby lab. **Problem:** calculate send/write/flush/replay lag positions. **Expected:** distinguish network/receive vs replay bottleneck. **Solution:** inspect `pg_stat_replication` LSNs and `pg_wal_lsn_diff`. **Hint:** positions, not only time columns. **Explanation:** lag has stages. **Alternative:** managed provider metrics.

### E038 — Slot retention
**Problem:** stop logical consumer, generate writes, measure retained WAL. **Expected:** slot restart LSN stops; pg_wal grows. **Solution:** inspect `pg_replication_slots`, diff current LSN vs restart_lsn. **Hint:** inactive slot. **Explanation:** slot protects consumer at disk cost. **Alternative:** retention caps/resync policy.

### E039 — Logical replication identity
**Problem:** replicate updates on table without PK. **Expected:** need suitable replica identity for update/delete. **Solution:** add PK/unique identity or `ALTER TABLE ... REPLICA IDENTITY FULL` for lab. **Hint:** subscriber must identify old row. **Explanation:** FULL increases WAL/data work. **Alternative:** proper stable key.

### E040 — Partition pruning
**Schema:** time-partitioned events. **Problem:** compare bounded timestamp predicate to expression hiding partition key. **Expected:** partitions pruned only when planner/runtime can infer bounds. **Solution:** EXPLAIN both. **Hint:** predicates on partition key. **Explanation:** partitioning helps through pruning/ops. **Alternative:** index on non-prunable workload.

### E041 — Default partition attach conflict
**Problem:** attach new July partition when default holds July rows. **Expected:** validation/move required. **Solution:** constrain/move rows from default, add check as appropriate, `ATTACH PARTITION`. **Hint:** default partition must not overlap. **Explanation:** lifecycle planning matters. **Alternative:** precreate partitions.

### E042 — Partitioned uniqueness
**Problem:** enforce global email unique on table partitioned by created month. **Expected:** explain why simple global UNIQUE(email) is restricted without partition key/global index. **Solution:** redesign key to include partition key or enforce elsewhere. **Hint:** uniqueness must be checkable across partitions. **Explanation:** native global indexes absent. **Alternative:** dedicated unpartitioned identity table.

### E043 — FDW pushdown
**Problem:** postgres_fdw query with filter/aggregate. **Expected:** inspect remote SQL. **Solution:** `EXPLAIN (VERBOSE) SELECT ... FROM foreign_orders WHERE ... GROUP BY ...;` **Hint:** Remote SQL. **Explanation:** pushdown reduces network rows when supported. **Alternative:** local materialization/ETL.

### E044 — FDW network latency
**Problem:** compare row-by-row lateral remote lookups vs one pushed join/query. **Expected:** repeated round trips lose. **Solution:** plans/timing on lab FDW. **Hint:** remote calls. **Explanation:** foreign table is distributed access. **Alternative:** copy needed data locally.

### E045 — Parallel aggregate
**Problem:** large event count/group; inspect Gather + partial/final aggregate. **Expected:** parallel workers. **Solution:** `EXPLAIN (ANALYZE,BUFFERS) SELECT event_name,count(*) FROM events GROUP BY event_name;` with sufficient scale/settings. **Hint:** parallel plan costs. **Explanation:** workers do partial work. **Alternative:** serial plan for small data.

### E046 — Parallel unsafe function
**Problem:** add function marked unsafe to query and see parallelism disappear. **Expected:** serial plan. **Solution:** create test function with `PARALLEL UNSAFE`, use it, compare EXPLAIN. **Hint:** function safety contract. **Explanation:** parallel workers cannot run unsafe operation. **Alternative:** correctly mark safe only if semantics permit.

### E047 — JIT threshold experiment
**Problem:** CPU-heavy aggregate with JIT on/off. **Expected:** compilation overhead vs execution savings. **Solution:** `SET jit=on/off`; EXPLAIN ANALYZE. **Hint:** long query. **Explanation:** JIT benefits must amortize setup. **Alternative:** keep defaults for mixed workloads.

### E048 — RLS tenant test
**Schema:** tenant_id added. **Problem:** policy returns only current tenant. **Expected:** negative isolation proof. **Solution:** enable RLS, policy with `current_setting`, `SET LOCAL` tenant in transaction, query A/B. **Hint:** runtime role not owner/bypass. **Explanation:** policy is DB guard. **Alternative:** database-per-tenant architecture.

### E049 — RLS WITH CHECK test
**Problem:** tenant A attempts insert tenant B. **Expected:** rejection. **Solution:** policy `WITH CHECK(tenant_id=current_setting(...))`, run insert. **Hint:** visibility vs new-row check. **Explanation:** USING alone isn't full write policy understanding. **Alternative:** trigger is less declarative.

### E050 — SECURITY DEFINER hardening
**Problem:** write function that counts tenant rows with elevated privilege safely. **Expected:** fixed search path/qualified names and restricted EXECUTE. **Solution:** `SECURITY DEFINER SET search_path=pg_catalog,app` and qualify objects; revoke PUBLIC execute as needed. **Hint:** search-path attack surface. **Explanation:** owner privileges amplify name resolution risks. **Alternative:** avoid definer when invoker privileges suffice.

### E051 — Search-path shadowing lab
**Problem:** demonstrate unqualified function name resolves earlier schema. **Expected:** controlled lab proof. **Solution:** create same function name in two schemas, change search_path, call unqualified. **Hint:** first visible match. **Explanation:** security-sensitive code should control names/path. **Alternative:** schema qualification.

### E052 — Concurrent upsert hot key
**Problem:** 100 clients increment same counter via ON CONFLICT. **Expected:** correct final total but contention. **Solution:** `INSERT ... ON CONFLICT(key) DO UPDATE SET n=counters.n+EXCLUDED.n`. **Hint:** row serialization. **Explanation:** correctness can still bottleneck at one hot row. **Alternative:** sharded counters + aggregate.

### E053 — Advisory lock collision design
**Problem:** map tenant UUID to advisory key. **Expected:** deterministic documented mapping/collision strategy. **Solution:** use stable 64-bit hash and accept/mitigate theoretical collision, or map to two 32-bit keys. **Hint:** advisory keys are application namespace. **Explanation:** DB doesn't know resource identity. **Alternative:** lock tenant row.

### E054 — Serializable retry function
**Problem:** pseudocode/SQL transaction wrapper retries 40001. **Expected:** bounded whole-transaction retries with backoff. **Solution:** application loop `BEGIN SERIALIZABLE → work → COMMIT`, on SQLSTATE 40001 rollback/retry. **Hint:** not last statement only. **Explanation:** reads influenced decisions. **Alternative:** explicit locking if simpler.

### E055 — Deadlock retry classifier
**Problem:** classify 40P01. **Expected:** retry whole idempotent transaction after rollback, while logging recurring pattern. **Solution:** application SQLSTATE branch. **Hint:** deadlock victim. **Explanation:** retry restores progress; design should reduce cycles. **Alternative:** consistent lock order.

### E056 — Online NOT NULL migration
**Problem:** 100M-row nullable column to NOT NULL. **Expected:** expand/backfill/check-not-valid/validate/set-not-null plan. **Solution:** add check `IS NOT NULL NOT VALID`, backfill, validate, then SET NOT NULL after PostgreSQL 18 rehearsal. **Hint:** separate scans/locks. **Explanation:** avoids one risky deployment step. **Alternative:** direct SET NOT NULL on small table.

### E057 — Concurrent unique migration
**Problem:** add uniqueness with low write blocking. **Expected:** concurrent unique index then attach constraint if supported shape. **Solution:** `CREATE UNIQUE INDEX CONCURRENTLY ...; ALTER TABLE ... ADD CONSTRAINT ... UNIQUE USING INDEX ...;` **Hint:** index outside transaction. **Explanation:** separates expensive build. **Alternative:** normal unique constraint during maintenance.

### E058 — Backfill throttle control
**Problem:** design SQL batch + metrics. **Expected:** key-range UPDATE with pause when replica lag/WAL/latency exceeds budget. **Solution:** `UPDATE ... WHERE id>$lo AND id<=$hi AND newcol IS NULL`; record hi after commit. **Hint:** resumability. **Explanation:** production data migration is control loop. **Alternative:** SKIP LOCKED workers for unordered independent rows.

### E059 — pg_stat_statements workload ranking
**Problem:** choose top optimization target. **Expected:** top by total_exec_time, calls, mean separately. **Solution:** query extension sorted by each metric. **Hint:** total cost vs latency vs chatter. **Explanation:** one 2s query/day differs from 10ms query million/day. **Alternative:** APM spans correlated to fingerprints.

### E060 — Restore verification SQL
**Problem:** after restoring test DB, verify integrity. **Expected:** object counts, constraints, extension versions, row checks, critical queries/plans. **Solution:** scripted SQL against catalogs/business checks plus app smoke tests. **Hint:** restore success != usable service. **Explanation:** recovery is end-to-end. **Alternative:** automated ephemeral restore pipeline.

## Level exit test

You should be able to design and experimentally validate a plan/index, MVCC/vacuum behavior, replication/slot issue, partition rule, RLS policy, serialization strategy, online migration, and recovery verification—not just state definitions.
