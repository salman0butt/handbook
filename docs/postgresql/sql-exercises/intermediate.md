---
id: sql-exercises-intermediate
title: "Intermediate SQL Exercises I001–I060"
---

# Intermediate — I001–I060

Unless an exercise says otherwise, **schema/sample** = the shared schema + fixture in [overview](./overview.md). Each item still names its relevant relations.

### I001 — Order value from line items
**Schema/sample:** `orders`,`order_items`. **Problem:** compute item-derived subtotal for every order. **Expected:** order ID + subtotal, including orders with no items as 0. **Hint:** LEFT JOIN + COALESCE. **Solution:** `SELECT o.id,coalesce(sum(oi.quantity*oi.unit_price),0) subtotal FROM orders o LEFT JOIN order_items oi ON oi.order_id=o.id GROUP BY o.id;` **Explanation:** outer join preserves empty orders; aggregate null becomes 0 intentionally. **Alternative:** correlated aggregate.

### I002 — Compare stored total to subtotal
**Schema/sample:** `orders`,`order_items`. **Problem:** find mismatches. **Expected:** only orders whose stored `total` differs from calculated subtotal. **Hint:** aggregate then compare. **Solution:** `WITH x AS (SELECT order_id,sum(quantity*unit_price) s FROM order_items GROUP BY order_id) SELECT o.id,o.total,x.s FROM orders o JOIN x ON x.order_id=o.id WHERE o.total IS DISTINCT FROM x.s;` **Explanation:** null-safe comparison. **Alternative:** scalar subquery.

### I003 — Top customer by paid revenue
**Schema:** customers/orders. **Problem:** highest paid revenue customer. **Expected:** one deterministic row. **Hint:** GROUP BY + ORDER/LIMIT. **Solution:** `SELECT c.id,c.email,sum(o.total) revenue FROM customers c JOIN orders o ON o.customer_id=c.id WHERE o.status='paid' GROUP BY c.id,c.email ORDER BY revenue DESC,c.id LIMIT 1;` **Explanation:** aggregate at customer grain. **Alternative:** window rank for ties.

### I004 — Customers above average lifetime value
**Schema:** customers/orders. **Expected:** customer totals greater than average customer total. **Hint:** aggregate CTE then scalar average. **Solution:** `WITH t AS (SELECT customer_id,sum(total) v FROM orders GROUP BY customer_id) SELECT * FROM t WHERE v>(SELECT avg(v) FROM t);` **Explanation:** separates customer aggregation from population average. **Alternative:** window `avg(v) over()`.

### I005 — Categories with revenue over 1000
**Schema:** products/order_items/orders. **Expected:** category revenue for paid orders >1000. **Hint:** joins + HAVING. **Solution:** `SELECT p.category,sum(oi.quantity*oi.unit_price) revenue FROM orders o JOIN order_items oi ON oi.order_id=o.id JOIN products p ON p.id=oi.product_id WHERE o.status='paid' GROUP BY p.category HAVING sum(oi.quantity*oi.unit_price)>1000;` **Explanation:** WHERE filters input; HAVING filters groups. **Alternative:** aggregate subquery then WHERE.

### I006 — Most recent order per customer with correlated subquery
**Schema:** customers/orders. **Expected:** each customer + last order timestamp. **Hint:** MAX correlated scalar. **Solution:** `SELECT c.id,(SELECT max(o.created_at) FROM orders o WHERE o.customer_id=c.id) last_order FROM customers c;` **Explanation:** customers with none return NULL. **Alternative:** LEFT JOIN + GROUP BY.

### I007 — Products never ordered
**Schema:** products/order_items. **Expected:** unreferenced products. **Hint:** NOT EXISTS. **Solution:** `SELECT p.* FROM products p WHERE NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_id=p.id);` **Explanation:** anti-join. **Alternative:** LEFT JOIN + null check.

### I008 — Orders containing all products in a category
**Schema:** orders/items/products. **Expected:** orders that contain every `books` product. **Hint:** double NOT EXISTS. **Solution:** `SELECT o.id FROM orders o WHERE NOT EXISTS (SELECT 1 FROM products p WHERE p.category='books' AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.order_id=o.id AND oi.product_id=p.id));` **Explanation:** relational division. **Alternative:** compare distinct counts when category product set is stable.

### I009 — Any expensive item
**Schema:** order_items. **Expected:** orders containing an item unit price >100. **Hint:** EXISTS. **Solution:** `SELECT o.* FROM orders o WHERE EXISTS (SELECT 1 FROM order_items oi WHERE oi.order_id=o.id AND oi.unit_price>100);` **Explanation:** existence avoids duplicates. **Alternative:** `id IN (SELECT order_id...)` with non-null order IDs.

### I010 — All items quantity >=2
**Schema:** orders/items. **Expected:** non-empty orders where every item quantity >=2. **Hint:** EXISTS items and NOT EXISTS violating item. **Solution:** `SELECT o.* FROM orders o WHERE EXISTS (SELECT 1 FROM order_items oi WHERE oi.order_id=o.id) AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.order_id=o.id AND oi.quantity<2);` **Explanation:** vacuous truth handled by first EXISTS. **Alternative:** HAVING `min(quantity)>=2`.

### I011 — Self join employee manager
**Schema:** employees. **Expected:** employee + manager name; assume `name` column for fixture. **Hint:** LEFT self join. **Solution:** `SELECT e.id,e.name,m.name manager FROM employees e LEFT JOIN employees m ON m.id=e.manager_id;` **Explanation:** same relation plays two roles. **Alternative:** recursive tree later.

### I012 — Employees earning more than manager
**Schema:** employees. **Expected:** employees with salary > manager. **Hint:** self join. **Solution:** `SELECT e.id FROM employees e JOIN employees m ON m.id=e.manager_id WHERE e.salary>m.salary;` **Explanation:** direct row comparison across roles. **Alternative:** correlated scalar manager salary.

### I013 — Department average salary
**Schema:** employees. **Expected:** department + average. **Hint:** GROUP BY. **Solution:** `SELECT department,avg(salary) avg_salary FROM employees GROUP BY department;` **Explanation:** one group/department. **Alternative:** window if retaining employees.

### I014 — Employee vs department average
**Schema:** employees. **Expected:** every employee + dept average. **Hint:** window aggregate. **Solution:** `SELECT id,department,salary,avg(salary) OVER (PARTITION BY department) dept_avg FROM employees;` **Explanation:** window retains rows. **Alternative:** join to aggregate CTE.

### I015 — Rank salary in department
**Schema:** employees. **Expected:** rank with gaps on ties. **Hint:** `rank()`. **Solution:** `SELECT id,department,salary,rank() OVER (PARTITION BY department ORDER BY salary DESC) r FROM employees;` **Explanation:** tied salaries share rank. **Alternative:** `dense_rank` no gaps.

### I016 — Third highest distinct salary
**Schema:** employees. **Expected:** employees at third distinct salary overall. **Hint:** dense_rank subquery. **Solution:** `SELECT * FROM (SELECT e.*,dense_rank() OVER (ORDER BY salary DESC) r FROM employees e) x WHERE r=3;` **Explanation:** ranks distinct salary values. **Alternative:** distinct salary LIMIT/OFFSET then join.

### I017 — Running paid revenue
**Schema:** orders. **Expected:** paid order rows + cumulative total. **Hint:** ROWS frame with deterministic keys. **Solution:** `SELECT id,created_at,total,sum(total) OVER (ORDER BY created_at,id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) running FROM orders WHERE status='paid';` **Explanation:** explicit ROWS avoids peer surprises. **Alternative:** preaggregate by day then window.

### I018 — Previous order gap
**Schema:** orders. **Expected:** each customer's gap from previous order. **Hint:** LAG. **Solution:** `SELECT id,customer_id,created_at,created_at-lag(created_at) OVER (PARTITION BY customer_id ORDER BY created_at,id) gap FROM orders;` **Explanation:** navigation window. **Alternative:** lateral previous-row lookup.

### I019 — Latest two orders per customer
**Schema:** orders. **Expected:** max two rows/customer. **Hint:** row_number. **Solution:** `SELECT * FROM (SELECT o.*,row_number() OVER (PARTITION BY customer_id ORDER BY created_at DESC,id DESC) rn FROM orders o) x WHERE rn<=2;` **Explanation:** ranks then filters. **Alternative:** LEFT JOIN LATERAL LIMIT 2.

### I020 — Percent of department payroll
**Schema:** employees. **Expected:** salary share. **Hint:** window SUM. **Solution:** `SELECT id,department,salary,salary/sum(salary) OVER (PARTITION BY department) share FROM employees;` **Explanation:** denominator per partition. **Alternative:** aggregate CTE join.

### I021 — Cumulative jobs by run time
**Schema:** jobs. **Expected:** ready jobs with running count. **Hint:** count window. **Solution:** `SELECT id,run_at,count(*) OVER (ORDER BY run_at,id ROWS UNBOUNDED PRECEDING) n FROM jobs WHERE status='ready';` **Explanation:** ordered cumulative frame. **Alternative:** correlated count, usually worse.

### I022 — CASE conditional count
**Schema:** orders. **Expected:** paid/cancelled counts. **Hint:** SUM(CASE). **Solution:** `SELECT sum(CASE WHEN status='paid' THEN 1 ELSE 0 END) paid,sum(CASE WHEN status='cancelled' THEN 1 ELSE 0 END) cancelled FROM orders;` **Explanation:** conditional aggregation. **Alternative:** `count(*) FILTER (...)`.

### I023 — Daily paid revenue
**Schema:** orders. **Expected:** day + revenue. **Hint:** date_trunc + WHERE. **Solution:** `SELECT date_trunc('day',created_at) day,sum(total) FROM orders WHERE status='paid' GROUP BY 1 ORDER BY 1;` **Explanation:** filters before grouping. **Alternative:** `created_at::date` with timezone awareness.

### I024 — Monthly cohort signup count
**Schema:** customers. **Expected:** month + customer count. **Hint:** date_trunc month. **Solution:** `SELECT date_trunc('month',created_at) cohort,count(*) FROM customers GROUP BY 1 ORDER BY 1;` **Explanation:** temporal bucketing. **Alternative:** generate_series for zero months.

### I025 — Fill missing daily counts
**Schema:** orders + generated dates. **Expected:** every day in 7-day range including zero. **Hint:** generate_series LEFT JOIN aggregate. **Solution:** `WITH d AS (SELECT generate_series(current_date-6,current_date,'1 day')::date day), a AS (SELECT created_at::date day,count(*) n FROM orders GROUP BY 1) SELECT d.day,coalesce(a.n,0) FROM d LEFT JOIN a USING(day) ORDER BY d.day;` **Explanation:** calendar relation fills gaps. **Alternative:** calendar table.

### I026 — Recursive employee hierarchy
**Schema:** employees. **Expected:** hierarchy from managerless roots with depth. **Hint:** recursive CTE. **Solution:** `WITH RECURSIVE t AS (SELECT id,manager_id,0 d FROM employees WHERE manager_id IS NULL UNION ALL SELECT e.id,e.manager_id,t.d+1 FROM employees e JOIN t ON e.manager_id=t.id) SELECT * FROM t;` **Explanation:** anchor + recursive child join. **Alternative:** closure table for frequent traversal.

### I027 — Employee chain to root
**Schema:** employees; choose ID 8. **Expected:** employee→ancestors. **Hint:** recursive parent join. **Solution:** `WITH RECURSIVE t AS (SELECT * FROM employees WHERE id=8 UNION ALL SELECT m.* FROM employees m JOIN t ON m.id=t.manager_id) SELECT * FROM t;` **Explanation:** recursively follows manager. **Alternative:** materialized path.

### I028 — JSON brand frequency
**Schema:** products attributes. **Expected:** brand + count including null optionally. **Hint:** expression GROUP BY. **Solution:** `SELECT attributes->>'brand' brand,count(*) FROM products GROUP BY 1 ORDER BY count(*) DESC;` **Explanation:** groups extracted text. **Alternative:** typed `brand` column if stable/hot.

### I029 — JSON numeric filter safely
**Schema:** products; fixture stores numeric `weight` strings where present. **Expected:** weight >10. **Hint:** existence/type contract then cast. **Solution:** `SELECT * FROM products WHERE attributes ? 'weight' AND (attributes->>'weight')::numeric>10;` **Explanation:** explicit cast after presence; real systems validate type. **Alternative:** relational numeric column.

### I030 — JSON aggregate orders
**Schema:** orders. **Expected:** one JSON array/customer. **Hint:** jsonb_agg. **Solution:** `SELECT customer_id,jsonb_agg(jsonb_build_object('id',id,'total',total) ORDER BY created_at,id) FROM orders GROUP BY customer_id;` **Explanation:** ordered JSON aggregation. **Alternative:** return rows and serialize in app.

### I031 — Array aggregate product IDs
**Schema:** items. **Expected:** array product IDs/order. **Hint:** array_agg distinct/order. **Solution:** `SELECT order_id,array_agg(product_id ORDER BY product_id) FROM order_items GROUP BY order_id;` **Explanation:** typed collection. **Alternative:** JSON array.

### I032 — String search escaped parameter concept
**Schema:** customers. **Problem:** find emails ending domain. **Expected:** matches. **Hint:** LIKE. **Solution:** `SELECT * FROM customers WHERE email LIKE '%@example.com';` **Explanation:** suffix pattern. **Alternative:** store/domain generated field if frequent.

### I033 — Upsert inventory seed
**Schema:** inventory. **Expected:** insert product or update quantity. **Hint:** ON CONFLICT. **Solution:** `INSERT INTO inventory(product_id,quantity) VALUES ($1,$2) ON CONFLICT(product_id) DO UPDATE SET quantity=EXCLUDED.quantity;` **Explanation:** one atomic conflict-aware statement. **Alternative:** MERGE for broader conditional logic.

### I034 — Increment inventory on conflict
**Schema:** inventory. **Expected:** add incoming qty. **Hint:** existing + EXCLUDED. **Solution:** `INSERT INTO inventory(product_id,quantity) VALUES ($1,$2) ON CONFLICT(product_id) DO UPDATE SET quantity=inventory.quantity+EXCLUDED.quantity RETURNING quantity;` **Explanation:** atomic increment. **Alternative:** UPDATE then insert with unique retry, more complex.

### I035 — Conditional inventory decrement
**Schema:** inventory. **Expected:** decrement only if enough. **Hint:** predicate in UPDATE. **Solution:** `UPDATE inventory SET quantity=quantity-$1 WHERE product_id=$2 AND quantity>=$1 RETURNING quantity;` **Explanation:** race-safe single statement. **Alternative:** row lock + multi-step logic.

### I036 — Optimistic update
**Schema:** inventory version. **Expected:** update only expected version. **Hint:** WHERE version. **Solution:** `UPDATE inventory SET quantity=$1,version=version+1 WHERE product_id=$2 AND version=$3 RETURNING version;` **Explanation:** zero rows signals stale caller. **Alternative:** SELECT FOR UPDATE.

### I037 — Transaction savepoint
**Schema:** products/orders. **Expected:** first change survives optional rollback inside transaction. **Hint:** SAVEPOINT. **Solution:** `BEGIN; UPDATE products SET price=price+1 WHERE id=1; SAVEPOINT s; UPDATE products SET price=-1 WHERE id=2; ROLLBACK TO s; COMMIT;` **Explanation:** partial rollback, outer transaction commits first update. **Alternative:** separate transaction if atomic relationship not needed.

### I038 — Unique active job key concept
**Schema/sample:** assume `jobs` adds `external_key text`. **Expected:** at most one ready/running row/key. **Hint:** partial unique index. **Solution:** `CREATE UNIQUE INDEX jobs_active_key ON jobs(external_key) WHERE status IN ('ready','running');` **Explanation:** uniqueness scoped to active states. **Alternative:** separate active-key table.

### I039 — Expression index for lowercase email
**Schema:** customers. **Expected:** index usable for lower(email) equality. **Hint:** expression index. **Solution:** `CREATE UNIQUE INDEX customers_lower_email_key ON customers(lower(email));` **Explanation:** index stores expression result and enforces normalized uniqueness. **Alternative:** citext extension after semantics review.

### I040 — Partial index for paid orders
**Schema:** orders. **Expected:** create index for recent paid-order lookup. **Hint:** partial predicate. **Solution:** `CREATE INDEX orders_paid_time_idx ON orders(created_at DESC,id DESC) WHERE status='paid';` **Explanation:** smaller index for stable hot subset. **Alternative:** multicolumn `(status,created_at DESC,id DESC)` for multiple statuses.

### I041 — Keyset next page
**Schema:** orders. **Expected:** next 20 after cursor `(time,id)`. **Hint:** row comparison. **Solution:** `SELECT * FROM orders WHERE (created_at,id)<($1,$2) ORDER BY created_at DESC,id DESC LIMIT 20;` **Explanation:** resumes from sort key. **Alternative:** expanded OR predicate for systems lacking row comparison.

### I042 — Count distinct customers per status
**Schema:** orders. **Expected:** status + distinct customer count. **Hint:** count distinct. **Solution:** `SELECT status,count(DISTINCT customer_id) FROM orders GROUP BY status;` **Explanation:** dedupes within each group. **Alternative:** distinct subquery then count.

### I043 — Grouping sets
**Schema:** orders + customers. **Expected:** revenue by country/status plus subtotals. **Hint:** GROUPING SETS. **Solution:** `SELECT c.country,o.status,sum(o.total) FROM orders o JOIN customers c ON c.id=o.customer_id GROUP BY GROUPING SETS ((c.country,o.status),(c.country),());` **Explanation:** multiple aggregate grains one query. **Alternative:** UNION ALL aggregates.

### I044 — ROLLUP month/status
**Schema:** orders. **Expected:** month/status subtotals + grand total. **Hint:** ROLLUP. **Solution:** `SELECT date_trunc('month',created_at) m,status,sum(total) FROM orders GROUP BY ROLLUP (date_trunc('month',created_at),status);` **Explanation:** hierarchical grouping. **Alternative:** grouping sets.

### I045 — INTERSECT customer sets
**Schema:** orders. **Expected:** customers who have paid and cancelled orders. **Hint:** INTERSECT. **Solution:** `SELECT customer_id FROM orders WHERE status='paid' INTERSECT SELECT customer_id FROM orders WHERE status='cancelled';` **Explanation:** set intersection removes duplicates. **Alternative:** conditional HAVING.

### I046 — EXCEPT customers
**Schema:** customers/orders. **Expected:** customer IDs with no paid orders. **Hint:** EXCEPT. **Solution:** `SELECT id FROM customers EXCEPT SELECT customer_id FROM orders WHERE status='paid';` **Explanation:** set difference. **Alternative:** NOT EXISTS.

### I047 — LATERAL latest order
**Schema:** customers/orders. **Expected:** each customer + latest order, including none. **Hint:** LEFT JOIN LATERAL. **Solution:** `SELECT c.id,x.id order_id FROM customers c LEFT JOIN LATERAL (SELECT id FROM orders o WHERE o.customer_id=c.id ORDER BY created_at DESC,id DESC LIMIT 1) x ON true;` **Explanation:** parameterized top-1. **Alternative:** row_number.

### I048 — LATERAL top 2 products/category
**Schema:** products. **Expected:** top two price products/category. **Hint:** distinct categories + lateral. **Solution:** `SELECT c.category,p.id,p.price FROM (SELECT DISTINCT category FROM products) c CROSS JOIN LATERAL (SELECT id,price FROM products p WHERE p.category=c.category ORDER BY price DESC,id LIMIT 2) p;` **Explanation:** top-N per outer key. **Alternative:** window rank.

### I049 — CTE readability rewrite
**Schema:** orders/items. **Expected:** paid-order subtotals >100. **Hint:** two named stages. **Solution:** `WITH paid AS (SELECT * FROM orders WHERE status='paid'), totals AS (SELECT p.id,sum(i.quantity*i.unit_price) s FROM paid p JOIN order_items i ON i.order_id=p.id GROUP BY p.id) SELECT * FROM totals WHERE s>100;` **Explanation:** separates filtering and aggregation. **Alternative:** one grouped query.

### I050 — MATERIALIZED repeated CTE
**Schema:** orders. **Expected:** reuse one expensive filtered result twice. **Hint:** MATERIALIZED. **Solution:** `WITH x AS MATERIALIZED (SELECT * FROM orders WHERE created_at>=current_date-30) SELECT (SELECT count(*) FROM x),(SELECT sum(total) FROM x);` **Explanation:** forces one materialized evaluation. **Alternative:** let planner inline if cheaper.

### I051 — View for paid orders
**Schema:** orders. **Expected:** reusable view. **Hint:** CREATE VIEW. **Solution:** `CREATE VIEW paid_orders AS SELECT id,customer_id,total,created_at FROM orders WHERE status='paid';` **Explanation:** stores query definition. **Alternative:** direct query if abstraction not needed.

### I052 — Materialized daily sales
**Schema:** orders. **Expected:** persisted daily paid revenue. **Hint:** materialized view. **Solution:** `CREATE MATERIALIZED VIEW daily_paid_sales AS SELECT created_at::date day,sum(total) revenue FROM orders WHERE status='paid' GROUP BY 1;` **Explanation:** caches result. **Alternative:** reporting table maintained incrementally.

### I053 — Check positive product price
**Schema:** products. **Expected:** enforce nonnegative price. **Hint:** CHECK. **Solution:** `ALTER TABLE products ADD CONSTRAINT products_price_nonnegative CHECK (price>=0);` **Explanation:** invariant for all writers. **Alternative:** domain type if reused semantically.

### I054 — Foreign key inventory
**Schema:** inventory/products. **Expected:** every inventory product exists. **Hint:** FK. **Solution:** `ALTER TABLE inventory ADD CONSTRAINT inventory_product_fk FOREIGN KEY(product_id) REFERENCES products(id);` **Explanation:** referential integrity. **Alternative:** already included in shared schema; exercise practices DDL.

### I055 — Composite uniqueness
**Schema/sample:** assume products have `tenant_id`. **Expected:** SKU unique per tenant. **Hint:** UNIQUE two columns. **Solution:** `ALTER TABLE products ADD CONSTRAINT products_tenant_sku_key UNIQUE(tenant_id,sku);` **Explanation:** scopes candidate key. **Alternative:** composite PK plus separate local ID policy.

### I056 — Deferrable FK concept
**Schema/sample:** assume circular staged relationship. **Expected:** FK checked at commit. **Hint:** DEFERRABLE INITIALLY DEFERRED. **Solution:** `ALTER TABLE child ADD CONSTRAINT child_parent_fk FOREIGN KEY(parent_id) REFERENCES parent(id) DEFERRABLE INITIALLY DEFERRED;` **Explanation:** permits temporarily invalid intermediate state. **Alternative:** reorder inserts to avoid deferral.

### I057 — Add FK NOT VALID
**Schema:** orders/customers. **Expected:** enforce new rows, validate old later. **Hint:** NOT VALID. **Solution:** `ALTER TABLE orders ADD CONSTRAINT orders_customer_fk2 FOREIGN KEY(customer_id) REFERENCES customers(id) NOT VALID;` **Explanation:** separates installation from historical scan. **Alternative:** validate immediately on small table.

### I058 — Validate constraint
**Schema:** previous exercise. **Expected:** historical rows checked. **Hint:** VALIDATE CONSTRAINT. **Solution:** `ALTER TABLE orders VALIDATE CONSTRAINT orders_customer_fk2;` **Explanation:** turns not-yet-validated constraint fully validated after scan. **Alternative:** fix data then rerun if failure.

### I059 — EXPLAIN actual vs estimate
**Schema:** orders. **Expected:** actual rows/buffers for paid recent query. **Hint:** ANALYZE,BUFFERS. **Solution:** `EXPLAIN (ANALYZE,BUFFERS) SELECT * FROM orders WHERE status='paid' AND created_at>=now()-interval '7 days';` **Explanation:** executes SELECT and compares estimates/actuals. **Alternative:** plain EXPLAIN when execution is risky.

### I060 — Analyze statistics
**Schema:** orders. **Expected:** refresh planner stats after fixture bulk load. **Hint:** ANALYZE. **Solution:** `ANALYZE orders;` **Explanation:** samples data distributions for estimates. **Alternative:** `VACUUM (ANALYZE)` when vacuum work is also needed.

## Level exit test

Be able to choose semi/anti joins, top-N window vs lateral, keyset pagination, grouped/window analytics, recursive CTE basics, upsert/atomic DML, constraint/index DDL, and read an `EXPLAIN ANALYZE` row estimate.