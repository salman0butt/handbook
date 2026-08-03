---
id: sql-exercises-advanced
title: "Advanced SQL Exercises A001–A060"
---

# Advanced — A001–A060

**Schema/sample:** shared practice schema unless the exercise adds a temporary column/table. Scale `orders/events` to at least 1M rows for plan exercises.

### A001 — Revenue rank per month
**Problem:** rank customers by paid revenue each month. **Expected:** month/customer/revenue/rank. **Hint:** aggregate first, then rank. **Solution:** `WITH x AS (SELECT date_trunc('month',created_at) m,customer_id,sum(total) r FROM orders WHERE status='paid' GROUP BY 1,2) SELECT x.*,rank() OVER(PARTITION BY m ORDER BY r DESC) FROM x;` **Explanation:** windows operate after aggregate stage. **Alternative:** dense_rank.

### A002 — Top 3 including ties
**Problem:** top three distinct salary levels/department. **Expected:** all tied employees. **Hint:** dense_rank. **Solution:** `SELECT * FROM (SELECT e.*,dense_rank() OVER(PARTITION BY department ORDER BY salary DESC) r FROM employees e) x WHERE r<=3;` **Explanation:** preserves ties. **Alternative:** rank if gaps are desired.

### A003 — Moving 7-order average
**Problem:** per customer, average current + previous six orders. **Expected:** row-level moving average. **Hint:** ROWS 6 PRECEDING. **Solution:** `SELECT id,customer_id,avg(total) OVER(PARTITION BY customer_id ORDER BY created_at,id ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) FROM orders;` **Explanation:** row-count frame. **Alternative:** time-based RANGE for temporal window semantics.

### A004 — 7-day time window revenue
**Problem:** rolling revenue over previous 7 days by timestamp. **Expected:** time-based window. **Hint:** RANGE with interval; order by one timestamp expression. **Solution:** `SELECT id,created_at,sum(total) OVER(ORDER BY created_at RANGE BETWEEN INTERVAL '7 days' PRECEDING AND CURRENT ROW) FROM orders;` **Explanation:** frame based on ordering values. **Alternative:** preaggregate daily then ROWS 6 PRECEDING.

### A005 — Last value entire partition
**Problem:** show each order with customer's latest status by time. **Expected:** final status repeated/customer. **Hint:** explicit unbounded-following frame. **Solution:** `SELECT id,last_value(status) OVER(PARTITION BY customer_id ORDER BY created_at,id ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) final_status FROM orders;` **Explanation:** avoids default-frame trap. **Alternative:** first_value with descending order.

### A006 — Nth value
**Problem:** second order total/customer. **Expected:** second total repeated where exists. **Hint:** nth_value + full frame. **Solution:** `SELECT id,nth_value(total,2) OVER(PARTITION BY customer_id ORDER BY created_at,id ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) FROM orders;` **Explanation:** full partition frame. **Alternative:** row_number + join.

### A007 — Percent rank salary
**Problem:** percentile-like relative salary/department. **Expected:** percent_rank 0..1. **Solution:** `SELECT id,department,salary,percent_rank() OVER(PARTITION BY department ORDER BY salary) FROM employees;` **Hint:** ranking window. **Explanation:** based on rank and partition size. **Alternative:** cume_dist for cumulative proportion.

### A008 — Quartiles
**Problem:** split salaries into four buckets/department. **Expected:** ntile 1–4. **Solution:** `SELECT id,department,salary,ntile(4) OVER(PARTITION BY department ORDER BY salary) quartile FROM employees;` **Hint:** ntile. **Explanation:** distributes rows approximately evenly. **Alternative:** percentile thresholds.

### A009 — Gaps in user events
**Problem:** flag session start when >30 min from previous event. **Expected:** boolean/start flag. **Hint:** LAG. **Solution:** `WITH x AS (SELECT e.*,lag(occurred_at) OVER(PARTITION BY user_id ORDER BY occurred_at,id) prev FROM events e) SELECT *,CASE WHEN prev IS NULL OR occurred_at-prev>interval '30 min' THEN 1 ELSE 0 END new_session FROM x;` **Explanation:** gap detection. **Alternative:** range/session extension logic.

### A010 — Sessionize events
**Problem:** assign session number using A009 flag. **Expected:** monotonically increasing session/user. **Hint:** cumulative SUM flag. **Solution:** `WITH x AS (...A009...), y AS (SELECT x.*,CASE WHEN prev IS NULL OR occurred_at-prev>interval '30 min' THEN 1 ELSE 0 END s FROM x) SELECT y.*,sum(s) OVER(PARTITION BY user_id ORDER BY occurred_at,id) session_no FROM y;` **Explanation:** gaps-and-islands via cumulative starts. **Alternative:** recursive approach.

### A011 — Consecutive active days
**Problem:** group user event days into islands. **Expected:** user/start/end/count. **Hint:** date - row_number. **Solution:** `WITH d AS (SELECT DISTINCT user_id,occurred_at::date day FROM events), x AS (SELECT d.*,day-(row_number() OVER(PARTITION BY user_id ORDER BY day))::int grp FROM d) SELECT user_id,min(day),max(day),count(*) FROM x GROUP BY user_id,grp;` **Explanation:** consecutive dates share normalized key. **Alternative:** lag + cumulative gap flag.

### A012 — First event per user
**Problem:** return complete first event row. **Expected:** one/user. **Hint:** row_number. **Solution:** `SELECT * FROM (SELECT e.*,row_number() OVER(PARTITION BY user_id ORDER BY occurred_at,id) rn FROM events e) x WHERE rn=1;` **Explanation:** deterministic first. **Alternative:** PostgreSQL `DISTINCT ON (user_id)`.

### A013 — DISTINCT ON latest event
**Problem:** PostgreSQL-specific latest event/user. **Expected:** one/user. **Hint:** DISTINCT ON order prefix. **Solution:** `SELECT DISTINCT ON (user_id) * FROM events ORDER BY user_id,occurred_at DESC,id DESC;` **Explanation:** keeps first row per distinct prefix. **Alternative:** row_number portable pattern.

### A014 — Median salary
**Problem:** median overall. **Expected:** one median value. **Hint:** ordered-set aggregate. **Solution:** `SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY salary) FROM employees;` **Explanation:** continuous percentile may interpolate. **Alternative:** percentile_disc for actual observed value.

### A015 — Percentile per department
**Problem:** p90 salary by department. **Expected:** department + p90. **Solution:** `SELECT department,percentile_cont(0.9) WITHIN GROUP(ORDER BY salary) p90 FROM employees GROUP BY department;` **Hint:** ordered-set aggregate. **Explanation:** percentile inside group. **Alternative:** approximate methods outside core for huge analytics.

### A016 — Recursive hierarchy path
**Problem:** build textual path root→employee. **Expected:** path/depth. **Hint:** recursive CTE carrying array. **Solution:** `WITH RECURSIVE t AS (SELECT id,manager_id,ARRAY[id] path FROM employees WHERE manager_id IS NULL UNION ALL SELECT e.id,e.manager_id,t.path||e.id FROM employees e JOIN t ON e.manager_id=t.id) SELECT * FROM t;` **Explanation:** state carried through recursion. **Alternative:** SEARCH depth/breadth ordering features.

### A017 — Cycle-safe recursion
**Problem:** prevent revisiting employee IDs. **Expected:** traversal terminates. **Hint:** array path membership. **Solution:** `WITH RECURSIVE t AS (SELECT id,manager_id,ARRAY[id] p,false cycle FROM employees WHERE id=$1 UNION ALL SELECT e.id,e.manager_id,t.p||e.id,e.id=ANY(t.p) FROM employees e JOIN t ON e.manager_id=t.id WHERE NOT t.cycle) SELECT * FROM t;` **Explanation:** tracks visited IDs. **Alternative:** SQL `CYCLE` clause.

### A018 — Descendant count
**Problem:** count all descendants/manager. **Expected:** manager + count. **Hint:** recursive edges carrying root. **Solution:** `WITH RECURSIVE d(root,id) AS (SELECT id,id FROM employees UNION ALL SELECT d.root,e.id FROM d JOIN employees e ON e.manager_id=d.id) SELECT root,count(*)-1 descendants FROM d GROUP BY root;` **Explanation:** transitive closure from every root. **Alternative:** closure table for frequent use.

### A019 — JSON path find
**Problem:** products with any nested tag `featured`. **Expected:** matches. **Hint:** jsonb_path_exists. **Solution:** `SELECT * FROM products WHERE jsonb_path_exists(attributes,'$.tags[*] ? (@ == "featured")');` **Explanation:** SQL/JSON-style path over JSONB. **Alternative:** normalized product_tags.

### A020 — JSON update one key
**Problem:** set `stock_status` key. **Expected:** other keys preserved. **Hint:** jsonb_set. **Solution:** `UPDATE products SET attributes=jsonb_set(attributes,'{stock_status}','"in_stock"'::jsonb,true) WHERE id=$1;` **Explanation:** updates path. **Alternative:** typed status column if stable.

### A021 — Remove JSON key
**Problem:** remove deprecated `legacy` key. **Expected:** key absent. **Hint:** `-` operator. **Solution:** `UPDATE products SET attributes=attributes-'legacy' WHERE attributes ? 'legacy';` **Explanation:** JSONB key deletion. **Alternative:** rebuild object with jsonb_strip_nulls for different semantics.

### A022 — Unnest JSON object
**Problem:** key/value rows for product attributes. **Expected:** product/key/value. **Hint:** jsonb_each. **Solution:** `SELECT p.id,x.key,x.value FROM products p CROSS JOIN LATERAL jsonb_each(p.attributes) x;` **Explanation:** set-returning function per row. **Alternative:** jsonb_each_text.

### A023 — Range overlap bookings
**Schema addition:** `bookings(resource_id,period tstzrange)`. **Problem:** find overlaps with requested range. **Expected:** conflicting bookings. **Hint:** `&&`. **Solution:** `SELECT * FROM bookings WHERE resource_id=$1 AND period && tstzrange($2,$3,'[)');` **Explanation:** range overlap operator. **Alternative:** `start < requested_end AND requested_start < end` on separate columns.

### A024 — Range containment
**Schema:** bookings. **Problem:** bookings containing instant. **Expected:** active at timestamp. **Hint:** `@>`. **Solution:** `SELECT * FROM bookings WHERE period @> $1::timestamptz;` **Explanation:** range contains element. **Alternative:** lower/upper comparisons.

### A025 — Exclusion constraint
**Schema:** bookings. **Expected:** no overlapping resource periods. **Hint:** GiST + btree_gist. **Solution:** `ALTER TABLE bookings ADD CONSTRAINT no_overlap EXCLUDE USING gist(resource_id WITH =,period WITH &&);` **Explanation:** enforces conflict relation under concurrency. **Alternative:** Serializable transaction, more application complexity.

### A026 — Multirange availability subtract
**Schema addition:** resource availability multirange. **Problem:** subtract booked range. **Expected:** remaining ranges. **Hint:** multirange difference. **Solution:** `SELECT available - tstzmultirange(period) FROM resource_availability JOIN bookings USING(resource_id);` **Explanation:** multirange set arithmetic. **Alternative:** generate slots and anti-join.

### A027 — NOT IN NULL trap demonstration
**Problem:** make subquery include NULL and predict result. **Expected:** no rows for many candidates due UNKNOWN. **Hint:** three-valued logic. **Solution:** `SELECT 1 WHERE 1 NOT IN (2,NULL);` **Explanation:** `1<>2 AND 1<>NULL` => TRUE AND UNKNOWN => UNKNOWN. **Alternative:** NOT EXISTS with equality predicate.

### A028 — IS DISTINCT FROM change detector
**Problem:** find rows where old/new nullable country differ; assume staging table. **Expected:** null-safe differences. **Solution:** `SELECT s.id FROM staging_customers s JOIN customers c USING(id) WHERE s.country IS DISTINCT FROM c.country;` **Hint:** null-safe comparison. **Explanation:** treats NULL as comparable for distinctness. **Alternative:** verbose null logic.

### A029 — Row comparison cursor
**Problem:** mixed keyset after `(created_at,id)`. **Expected:** stable next page. **Solution:** `SELECT * FROM orders WHERE (created_at,id)<($1,$2) ORDER BY created_at DESC,id DESC LIMIT 50;` **Hint:** row constructor. **Explanation:** lexicographic comparison. **Alternative:** `created_at<$1 OR (created_at=$1 AND id<$2)`.

### A030 — Compound cursor with nullable key
**Problem:** paginate by nullable `shipped_at` then ID. **Expected:** deterministic ordering. **Hint:** normalize null class explicitly. **Solution:** `SELECT * FROM orders ORDER BY (shipped_at IS NULL),shipped_at DESC,id DESC;` plus cursor carrying null-class/time/id. **Explanation:** cursor must encode full ordering. **Alternative:** separate unshipped/shipped endpoints.

### A031 — MERGE staging inventory
**Schema:** `incoming_inventory(product_id,quantity)`. **Expected:** update matches, insert missing. **Hint:** MERGE. **Solution:** `MERGE INTO inventory i USING incoming_inventory s ON i.product_id=s.product_id WHEN MATCHED THEN UPDATE SET quantity=s.quantity WHEN NOT MATCHED THEN INSERT(product_id,quantity) VALUES(s.product_id,s.quantity);` **Explanation:** conditional source-target DML. **Alternative:** INSERT ON CONFLICT for simple unique-key upsert.

### A032 — Data-modifying CTE archive
**Schema addition:** `old_jobs` same columns. **Problem:** atomically move finished jobs. **Expected:** deleted source rows inserted archive. **Solution:** `WITH moved AS (DELETE FROM jobs WHERE status='succeeded' AND run_at<now()-interval '30 days' RETURNING *) INSERT INTO old_jobs SELECT * FROM moved;` **Hint:** DELETE RETURNING CTE. **Explanation:** one statement snapshot/transaction. **Alternative:** explicit transaction two statements.

### A033 — UPDATE FROM aggregate
**Schema addition:** `customers.order_count`. **Problem:** refresh counts. **Expected:** count/customer. **Solution:** `UPDATE customers c SET order_count=x.n FROM (SELECT customer_id,count(*) n FROM orders GROUP BY customer_id) x WHERE x.customer_id=c.id;` **Hint:** aggregate source. **Explanation:** update joined rows. **Alternative:** compute dynamically/materialized view.

### A034 — DELETE USING
**Schema addition:** `banned_customers(id)`. **Problem:** delete test carts for banned users, assume carts. **Expected:** matching carts removed. **Solution:** `DELETE FROM carts c USING banned_customers b WHERE b.id=c.customer_id RETURNING c.id;` **Hint:** USING join. **Explanation:** delete target joined to source. **Alternative:** WHERE EXISTS.

### A035 — Deferrable unique swap
**Schema addition:** `positions(id,pos UNIQUE DEFERRABLE)`. **Problem:** swap positions 1 and 2 in transaction. **Expected:** both swapped without intermediate collision. **Hint:** defer constraint. **Solution:** `BEGIN; SET CONSTRAINTS positions_pos_key DEFERRED; UPDATE positions SET pos=CASE pos WHEN 1 THEN 2 WHEN 2 THEN 1 END WHERE pos IN(1,2); COMMIT;` **Explanation:** final state checked at commit. **Alternative:** temporary sentinel value with immediate unique.

### A036 — FK child index rationale
**Problem:** add index that helps delete/check parent customer. **Expected:** child lookup index. **Solution:** `CREATE INDEX orders_customer_id_idx ON orders(customer_id);` **Hint:** FKs do not auto-index referencing side. **Explanation:** parent changes and joins can avoid child scan. **Alternative:** composite child index beginning customer_id.

### A037 — INCLUDE covering index
**Problem:** customer feed needs ID/time/status/total. **Expected:** candidate covering index. **Solution:** `CREATE INDEX orders_customer_feed_idx ON orders(customer_id,created_at DESC,id DESC) INCLUDE(status,total);` **Hint:** keys vs included payload. **Explanation:** may enable index-only scans when VM permits. **Alternative:** omit includes to reduce write/storage cost.

### A038 — Index-only visibility check
**Problem:** run feed plan before/after vacuum on static fixture. **Expected:** compare Heap Fetches. **Solution:** `VACUUM (ANALYZE) orders; EXPLAIN (ANALYZE,BUFFERS) SELECT id,created_at,status,total FROM orders WHERE customer_id=1 ORDER BY created_at DESC,id DESC LIMIT 20;` **Hint:** visibility map. **Explanation:** covering columns alone don't ensure no heap fetch. **Alternative:** inspect all-visible state with approved tools.

### A039 — Bitmap index combination
**Problem:** create separate status/customer indexes then inspect AND-able query. **Expected:** planner may use bitmap combination. **Solution:** create each B-tree then `EXPLAIN SELECT * FROM orders WHERE customer_id=1 AND status='paid';` **Hint:** BitmapAnd possible. **Explanation:** planner can combine indexes. **Alternative:** composite index for critical path.

### A040 — Extended dependencies statistics
**Schema addition:** customers country/city. **Problem:** improve correlated predicate estimates. **Expected:** CREATE STATISTICS + ANALYZE. **Solution:** `CREATE STATISTICS customer_geo_dep (dependencies,mcv) ON country,city FROM customers; ANALYZE customers;` **Hint:** multicolumn correlation. **Explanation:** independence assumption can be wrong. **Alternative:** larger per-column stats won't fully model dependency.

### A041 — Inspect MCV stats concept
**Problem:** query `pg_stats` for order status. **Expected:** null fraction/distinct/MCVs. **Solution:** `SELECT null_frac,n_distinct,most_common_vals,most_common_freqs FROM pg_stats WHERE tablename='orders' AND attname='status';` **Hint:** documented stats view. **Explanation:** evidence for selectivity estimates. **Alternative:** catalog internals, less stable.

### A042 — Analyze row-estimate error
**Problem:** find actual/estimated ratio in a plan manually. **Expected:** written diagnosis. **Solution:** run `EXPLAIN (ANALYZE,BUFFERS) ...`; calculate `actual rows / estimated rows` per important node. **Hint:** account loops. **Explanation:** misestimates drive bad choices. **Alternative:** JSON EXPLAIN parsed by tooling.

### A043 — Hash join memory scenario
**Problem:** join million orders to customers and inspect batches. **Expected:** identify hash spill/batches. **Solution:** `EXPLAIN (ANALYZE,BUFFERS) SELECT ... FROM orders o JOIN customers c ON c.id=o.customer_id;` **Hint:** Hash node Buckets/Batches/Memory. **Explanation:** insufficient memory can batch to disk. **Alternative:** merge/nested plan depending indexes/selectivity.

### A044 — Sort spill
**Problem:** force large sort and observe temp I/O. **Expected:** external merge/temp buffers if spill. **Solution:** `EXPLAIN (ANALYZE,BUFFERS) SELECT * FROM events ORDER BY properties::text;` on large data. **Hint:** Sort Method. **Explanation:** work_mem applies per operation. **Alternative:** index only if ordering expression/workload justifies it.

### A045 — Partial index implication
**Problem:** explain why parameter/generic predicate may not prove partial index predicate. **Expected:** reasoning + plan tests. **Solution:** create `WHERE status='ready'` partial job index; compare literal ready query to generic prepared query. **Hint:** planner must prove implication. **Explanation:** partial indexes are predicate-specific. **Alternative:** full `(status,run_at)` index.

### A046 — Prepared custom vs generic plan
**Problem:** skew customer IDs. **Expected:** compare `EXPLAIN EXECUTE` for hot/cold values over repeated execution. **Hint:** prepared plan caching. **Solution:** `PREPARE q(bigint) AS SELECT * FROM orders WHERE customer_id=$1; EXPLAIN (ANALYZE,BUFFERS) EXECUTE q(1);` repeat values. **Explanation:** custom/generic economics can differ. **Alternative:** driver plan policy/settings only after diagnosis.

### A047 — Lock one inventory row
**Problem:** safely read then make multi-step stock decision. **Expected:** row locked until commit. **Solution:** `BEGIN; SELECT * FROM inventory WHERE product_id=$1 FOR UPDATE; ...; COMMIT;` **Hint:** FOR UPDATE. **Explanation:** conflicting writers wait. **Alternative:** atomic conditional UPDATE if decision can be expressed in one statement.

### A048 — NOWAIT
**Problem:** fail fast if stock row locked. **Expected:** lock-not-available error instead of wait. **Solution:** `SELECT * FROM inventory WHERE product_id=$1 FOR UPDATE NOWAIT;` **Hint:** NOWAIT. **Explanation:** useful for bounded latency/control flow. **Alternative:** lock_timeout.

### A049 — SKIP LOCKED claim
**Problem:** claim next 10 ready jobs. **Expected:** disjoint worker rows. **Solution:** `SELECT id FROM jobs WHERE status='ready' AND run_at<=now() ORDER BY priority DESC,run_at,id FOR UPDATE SKIP LOCKED LIMIT 10;` **Hint:** queue semantics. **Explanation:** skips locked jobs intentionally. **Alternative:** advisory-lock queue, usually more manual.

### A050 — Deadlock reproduction
**Problem:** in two sessions lock inventory rows 1/2 in opposite order. **Expected:** PostgreSQL aborts one after detecting cycle. **Solution:** T1 `BEGIN; UPDATE ...1;` T2 `BEGIN; UPDATE ...2;` then each updates other. **Hint:** wait cycle. **Explanation:** lock ordering prevents pattern. **Alternative:** sort IDs before updates.

### A051 — Read Committed demonstration
**Problem:** T1 SELECT count, T2 inserts+commits, T1 SELECT again. **Expected:** T1 second statement can see new row. **Solution:** default transaction two selects around T2 commit. **Hint:** statement snapshots. **Explanation:** Read Committed refreshes snapshot per command. **Alternative:** Repeatable Read stable snapshot.

### A052 — Repeatable Read demonstration
**Problem:** repeat A051 at Repeatable Read. **Expected:** T1 stable view. **Solution:** `BEGIN ISOLATION LEVEL REPEATABLE READ;` then sequence. **Hint:** transaction snapshot. **Explanation:** subsequent reads use same snapshot. **Alternative:** Serializable adds anomaly detection.

### A053 — Serializable write skew lab
**Schema addition:** `doctors(id,on_call)`. **Problem:** two sessions each turn self off if another on. **Expected:** one serialization failure under Serializable. **Solution:** run both `BEGIN ISOLATION LEVEL SERIALIZABLE`, read count, update distinct rows, commit. **Hint:** SSI dependency. **Explanation:** retry required. **Alternative:** explicit predicate/row locking redesign.

### A054 — Advisory transaction lock
**Problem:** one reconciliation per tenant. **Expected:** concurrent same tenant waits/fails according function. **Solution:** `SELECT pg_advisory_xact_lock(hashtextextended($tenant,0));` inside transaction. **Hint:** transaction-scoped advisory lock. **Explanation:** application-defined coordination. **Alternative:** lock tenant row.

### A055 — Sequence gap demonstration
**Problem:** call nextval then rollback; show next number still advanced. **Expected:** gap. **Solution:** create sequence; `BEGIN; SELECT nextval('s'); ROLLBACK; SELECT nextval('s');` **Hint:** sequences aren't transactional gapless counters. **Explanation:** concurrent allocation prioritizes uniqueness. **Alternative:** serialized business counter.

### A056 — Identity override
**Schema addition:** identity table. **Problem:** understand ALWAYS vs BY DEFAULT by explicit ID insert. **Expected:** ALWAYS rejects unless OVERRIDING SYSTEM VALUE. **Solution:** `INSERT INTO t(id,...) OVERRIDING SYSTEM VALUE VALUES(42,...);` **Hint:** identity semantics. **Explanation:** differs from simple sequence default. **Alternative:** BY DEFAULT permits explicit value.

### A057 — Temp staging table
**Problem:** stage imported SKU/price rows then validate. **Expected:** session-local staging. **Solution:** `CREATE TEMP TABLE price_stage(sku text,new_price numeric) ON COMMIT DROP;` then load/join. **Hint:** temp table. **Explanation:** separates parsing from target updates. **Alternative:** permanent unlogged staging for multi-session workflow.

### A058 — COPY import
**Problem:** bulk load stage from STDIN CSV. **Expected:** high-throughput rows. **Solution:** `COPY price_stage(sku,new_price) FROM STDIN WITH (FORMAT csv,HEADER true);` **Hint:** COPY protocol/client tooling. **Explanation:** bulk path reduces statement overhead. **Alternative:** multi-row INSERT.

### A059 — Full-text search vector
**Schema addition:** documents. **Problem:** query weighted generated tsvector. **Expected:** matching documents. **Solution:** `SELECT id,ts_rank(search_vector,q) r FROM documents,websearch_to_tsquery('english',$1) q WHERE search_vector@@q ORDER BY r DESC,id;` **Hint:** tsquery/tsvector. **Explanation:** linguistic search + ranking. **Alternative:** pg_trgm for fuzzy substring.

### A060 — GIN FTS plan
**Problem:** add GIN search index and compare plan. **Expected:** indexed search on selective term. **Solution:** `CREATE INDEX documents_search_gin ON documents USING gin(search_vector); ANALYZE documents; EXPLAIN (ANALYZE,BUFFERS) SELECT ... WHERE search_vector@@websearch_to_tsquery('english',$1);` **Hint:** GIN inverted index. **Explanation:** avoids scanning every document for selective queries. **Alternative:** GiST with different trade-offs.

## Level exit test

Solve a top-N, sessionization, recursive-cycle, JSON/range, online-index, planner-statistics, lock, isolation, and FTS problem while explaining correctness *and* execution implications.