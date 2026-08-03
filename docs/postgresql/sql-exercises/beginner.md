---
id: sql-exercises-beginner
title: "Beginner SQL Exercises B001–B060"
---

# Beginner — B001–B060

Schema/seed: use the [shared practice schema](./overview.md) with at least 5 customers, 8 products, 10 orders, 20 items, 8 employees, and 20 events. Each exercise explicitly names the relevant tables.

### B001 — Select all customers
**Problem / schema / sample:** `customers`; return every row from the shared fixture. **Expected:** all customer rows. **Hint:** `SELECT` + `FROM`. **Solution:** `SELECT * FROM customers;` **Why:** reads the relation without filtering. **Alternative:** list explicit columns for stable application code.

### B002 — Select customer email only
**Problem / schema / sample:** `customers`; return only `email`. **Expected:** one column per customer. **Hint:** projection. **Solution:** `SELECT email FROM customers;` **Why:** `SELECT` chooses output expressions. **Alternative:** include `id,email` when identity is needed.

### B003 — Alias a column
**Problem / schema / sample:** `customers`; display `email AS customer_email`. **Expected:** renamed result column. **Hint:** `AS`. **Solution:** `SELECT email AS customer_email FROM customers;` **Why:** aliases affect result naming. **Alternative:** PostgreSQL permits omitting `AS`, but explicit is clearer.

### B004 — Filter by country
**Problem / schema / sample:** `customers`; return only country `PK`. **Expected:** matching customers. **Hint:** `WHERE`. **Solution:** `SELECT * FROM customers WHERE country = 'PK';` **Why:** WHERE keeps TRUE predicates. **Alternative:** parameterize `'PK'` in applications.

### B005 — Handle NULL country
**Problem / schema / sample:** ensure one customer has `country NULL`; return missing countries. **Expected:** only null-country rows. **Hint:** never use `= NULL`. **Solution:** `SELECT * FROM customers WHERE country IS NULL;` **Why:** NULL requires null predicates. **Alternative:** `IS NOT DISTINCT FROM NULL` is valid but less direct.

### B006 — Exclude NULL country
**Problem:** `customers`; return recorded countries only. **Expected:** non-null rows. **Hint:** `IS NOT NULL`. **Solution:** `SELECT * FROM customers WHERE country IS NOT NULL;` **Why:** explicit null test. **Alternative:** none preferable.

### B007 — Sort newest customers
**Problem:** `customers`; newest first. **Expected:** descending `created_at`. **Hint:** `ORDER BY ... DESC`. **Solution:** `SELECT * FROM customers ORDER BY created_at DESC, id DESC;` **Why:** second key makes ties deterministic. **Alternative:** omit `id` only if tie order does not matter.

### B008 — Sort products by price
**Problem:** `products`; cheapest first. **Expected:** ascending prices. **Hint:** ASC is default. **Solution:** `SELECT id,sku,price FROM products ORDER BY price ASC, id ASC;` **Why:** deterministic order. **Alternative:** `ORDER BY price, id`.

### B009 — Limit results
**Problem:** `products`; three cheapest. **Expected:** first 3 after sort. **Hint:** `LIMIT`. **Solution:** `SELECT * FROM products ORDER BY price,id LIMIT 3;` **Why:** limit applies after logical ordering. **Alternative:** standard `FETCH FIRST 3 ROWS ONLY`.

### B010 — Offset page 2
**Problem:** `products`; page size 3, second page. **Expected:** rows 4–6 by price/id. **Hint:** `LIMIT 3 OFFSET 3`. **Solution:** `SELECT * FROM products ORDER BY price,id LIMIT 3 OFFSET 3;` **Why:** skips first three. **Alternative:** keyset pagination later.

### B011 — Distinct countries
**Problem:** `customers`; unique recorded country values. **Expected:** no duplicates. **Hint:** `DISTINCT`. **Solution:** `SELECT DISTINCT country FROM customers WHERE country IS NOT NULL ORDER BY country;` **Why:** DISTINCT removes duplicate result rows. **Alternative:** `GROUP BY country` when aggregation also needed.

### B012 — Price range
**Problem:** `products`; price between 10 and 100 inclusive. **Expected:** products in range. **Hint:** `BETWEEN`. **Solution:** `SELECT * FROM products WHERE price BETWEEN 10 AND 100;` **Why:** inclusive bounds. **Alternative:** `price >= 10 AND price <= 100`.

### B013 — Category list
**Problem:** `products`; category is `books` or `tools`. **Expected:** rows in either category. **Hint:** `IN`. **Solution:** `SELECT * FROM products WHERE category IN ('books','tools');` **Why:** compact equality disjunction. **Alternative:** `category='books' OR category='tools'`.

### B014 — Negative category filter
**Problem:** `products`; exclude `archived` category with no null categories in schema. **Expected:** all other rows. **Hint:** `<>`. **Solution:** `SELECT * FROM products WHERE category <> 'archived';` **Why:** standard inequality. **Alternative:** `NOT IN ('archived')`.

### B015 — Product name prefix concept
**Problem / schema:** assume `products` also has `name text`; return names beginning `Post`. **Expected:** prefix matches. **Hint:** `LIKE 'Post%'`. **Solution:** `SELECT * FROM products WHERE name LIKE 'Post%';` **Why:** `%` matches any string tail. **Alternative:** `ILIKE` for PostgreSQL case-insensitive matching.

### B016 — Case-insensitive email search
**Problem:** `customers`; match one email ignoring case. **Expected:** matching row. **Hint:** PostgreSQL `ILIKE`. **Solution:** `SELECT * FROM customers WHERE email ILIKE 'ADA@EXAMPLE.COM';` **Why:** case-insensitive pattern comparison. **Alternative:** `lower(email)=lower($1)` plus suitable index for production.

### B017 — Insert customer
**Problem:** add customer ID 100. **Expected:** one row inserted. **Hint:** name columns. **Solution:** `INSERT INTO customers(id,email,country,created_at) VALUES (100,'new@example.com','PK',now());` **Why:** explicit columns survive schema reorder. **Alternative:** parameterized values.

### B018 — Insert and return
**Problem:** insert a customer and immediately obtain ID/email. **Expected:** inserted values. **Hint:** `RETURNING`. **Solution:** `INSERT INTO customers(id,email,country,created_at) VALUES (101,'return@example.com','GB',now()) RETURNING id,email;` **Why:** avoids a follow-up lookup. **Alternative:** application-generated ID already known.

### B019 — Multi-row insert
**Problem:** add two products. **Expected:** two rows. **Hint:** multiple VALUES tuples. **Solution:** `INSERT INTO products(id,sku,category,price) VALUES (101,'S101','books',10),(102,'S102','books',12);` **Why:** one statement handles multiple rows. **Alternative:** COPY for bulk data.

### B020 — Update one product
**Problem:** raise product 101 to 11. **Expected:** one changed row. **Hint:** WHERE PK. **Solution:** `UPDATE products SET price=11 WHERE id=101 RETURNING id,price;` **Why:** scoped mutation. **Alternative:** arithmetic update for relative change.

### B021 — Percentage increase
**Problem:** increase all `books` prices by 10%. **Expected:** category prices ×1.10. **Hint:** column expression. **Solution:** `UPDATE products SET price=price*1.10 WHERE category='books';` **Why:** calculation happens atomically per row. **Alternative:** round according to business rules.

### B022 — Delete one product
**Problem:** delete test product 102 if no FKs block it. **Expected:** row removed. **Hint:** PK WHERE. **Solution:** `DELETE FROM products WHERE id=102 RETURNING id;` **Why:** RETURNING proves affected row. **Alternative:** soft delete only if domain requires it.

### B023 — Count customers
**Problem:** `customers`; count rows. **Expected:** one integer. **Hint:** `COUNT(*)`. **Solution:** `SELECT count(*) FROM customers;` **Why:** counts rows including rows with null fields. **Alternative:** none needed.

### B024 — Count recorded countries
**Problem:** count customers whose country is non-null via aggregate semantics. **Expected:** non-null country count. **Hint:** `count(column)`. **Solution:** `SELECT count(country) FROM customers;` **Why:** COUNT(expression) ignores nulls. **Alternative:** `count(*) FILTER (WHERE country IS NOT NULL)`.

### B025 — Minimum price
**Problem:** cheapest product price. **Expected:** one value. **Hint:** `MIN`. **Solution:** `SELECT min(price) FROM products;` **Why:** aggregate over all rows. **Alternative:** ordered LIMIT when full product row needed.

### B026 — Maximum price
**Problem:** highest price. **Solution:** `SELECT max(price) FROM products;` **Expected:** one value. **Hint:** MAX. **Why:** aggregate ignores null values. **Alternative:** `ORDER BY price DESC LIMIT 1` for row details.

### B027 — Average price
**Problem:** average product price. **Solution:** `SELECT avg(price) FROM products;` **Expected:** numeric average. **Hint:** AVG. **Why:** aggregate over non-null prices. **Alternative:** weighted average requires quantities.

### B028 — Total order value
**Problem:** sum `orders.total`. **Expected:** one revenue-like value. **Hint:** SUM. **Solution:** `SELECT sum(total) FROM orders;` **Why:** adds non-null values. **Alternative:** `coalesce(sum(total),0)` only if empty-set zero is desired.

### B029 — Orders per status
**Problem:** count orders grouped by status. **Expected:** one row/status. **Hint:** GROUP BY. **Solution:** `SELECT status,count(*) FROM orders GROUP BY status ORDER BY status;` **Why:** group key partitions rows. **Alternative:** FILTER columns for fixed statuses.

### B030 — Customers per country
**Problem:** include NULL country as its own group. **Expected:** counts by country/null. **Hint:** GROUP BY country. **Solution:** `SELECT country,count(*) FROM customers GROUP BY country ORDER BY country NULLS LAST;` **Why:** NULLs group together for grouping. **Alternative:** `coalesce(country,'Unknown')` for display only.

### B031 — Filter groups with HAVING
**Problem:** countries with at least 2 customers. **Expected:** qualifying groups. **Hint:** HAVING count. **Solution:** `SELECT country,count(*) FROM customers GROUP BY country HAVING count(*)>=2;` **Why:** HAVING filters groups after aggregation. **Alternative:** aggregate in subquery then WHERE.

### B032 — Inner join orders/customers
**Problem:** show order ID and customer email. **Expected:** one row/order. **Hint:** FK join. **Solution:** `SELECT o.id,c.email FROM orders o JOIN customers c ON c.id=o.customer_id;` **Why:** inner join keeps matches. **Alternative:** `USING` only if column names align.

### B033 — Left join customer orders
**Problem:** include customers with no orders. **Expected:** every customer, nullable order ID. **Hint:** LEFT JOIN. **Solution:** `SELECT c.id,o.id AS order_id FROM customers c LEFT JOIN orders o ON o.customer_id=c.id;` **Why:** preserves left rows. **Alternative:** aggregate count with left join.

### B034 — Customers with no orders
**Problem:** identify no-order customers. **Expected:** customers lacking match. **Hint:** `NOT EXISTS`. **Solution:** `SELECT c.* FROM customers c WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id=c.id);` **Why:** anti-join intent, null-safe. **Alternative:** LEFT JOIN + `o.id IS NULL`.

### B035 — Customers with orders
**Problem:** each customer once if at least one order. **Expected:** no duplicates. **Hint:** EXISTS. **Solution:** `SELECT c.* FROM customers c WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id=c.id);` **Why:** semi-join avoids multiplication. **Alternative:** join + DISTINCT, usually less direct.

### B036 — Order line total
**Problem:** `order_items`; calculate quantity × unit price. **Expected:** computed line totals. **Hint:** arithmetic expression. **Solution:** `SELECT order_id,product_id,quantity*unit_price AS line_total FROM order_items;` **Why:** expressions derive values. **Alternative:** generated column only if persisted contract needs it.

### B037 — Order subtotal from items
**Problem:** subtotal per order. **Expected:** one row/order. **Hint:** SUM line expressions. **Solution:** `SELECT order_id,sum(quantity*unit_price) AS subtotal FROM order_items GROUP BY order_id;` **Why:** aggregate calculated values. **Alternative:** join orders if empty orders must appear.

### B038 — CASE price bucket
**Problem:** label products cheap (below 20), mid (below 100), expensive. **Expected:** category per product. **Hint:** searched CASE. **Solution:** `SELECT id,CASE WHEN price<20 THEN 'cheap' WHEN price<100 THEN 'mid' ELSE 'expensive' END AS bucket FROM products;` **Why:** ordered conditions. **Alternative:** range lookup table for configurable buckets.

### B039 — COALESCE country
**Problem:** display `Unknown` for null countries. **Expected:** non-null display value. **Hint:** COALESCE. **Solution:** `SELECT id,coalesce(country,'Unknown') AS country_display FROM customers;` **Why:** first non-null expression. **Alternative:** preserve NULL in storage and format in UI.

### B040 — NULLIF division guard
**Problem / schema:** assume products have `sales` and `views`; compute conversion without division by zero. **Expected:** null when views=0. **Hint:** NULLIF denominator. **Solution:** `SELECT sales::numeric / NULLIF(views,0) FROM products;` **Why:** zero becomes NULL. **Alternative:** CASE returning 0 or NULL according to domain.

### B041 — Current date
**Problem:** return current date. **Expected:** session/current date. **Hint:** SQL keyword. **Solution:** `SELECT current_date;` **Why:** standard current-date expression. **Alternative:** `now()::date` has related but timestamp-based semantics.

### B042 — Orders in last 7 days
**Problem:** recent orders. **Expected:** rows from rolling 7-day window. **Hint:** interval. **Solution:** `SELECT * FROM orders WHERE created_at >= now()-interval '7 days';` **Why:** timestamp arithmetic. **Alternative:** pass explicit cutoff for repeatable reporting.

### B043 — Extract order year
**Problem:** year from order timestamp. **Expected:** numeric year. **Hint:** EXTRACT. **Solution:** `SELECT id,extract(year FROM created_at) AS year FROM orders;` **Why:** temporal field extraction. **Alternative:** `date_part` PostgreSQL function.

### B044 — Daily order counts
**Problem:** group orders by UTC/session day. **Expected:** count/day. **Hint:** date_trunc. **Solution:** `SELECT date_trunc('day',created_at) AS day,count(*) FROM orders GROUP BY 1 ORDER BY 1;` **Why:** truncates timestamps to bucket. **Alternative:** `created_at::date` for session-zone date semantics.

### B045 — String concatenate
**Problem:** show `id:email`. **Expected:** text label. **Hint:** `||`. **Solution:** `SELECT id::text || ':' || email AS label FROM customers;` **Why:** casts ID then concatenates. **Alternative:** `format('%s:%s',id,email)`.

### B046 — Lowercase emails
**Problem:** normalized display. **Expected:** lower text. **Hint:** lower(). **Solution:** `SELECT id,lower(email) FROM customers;` **Why:** text function. **Alternative:** do not assume lower alone defines all Unicode identity rules.

### B047 — Product JSON brand
**Problem:** extract `brand` from `attributes`. **Expected:** text/null. **Hint:** `->>`. **Solution:** `SELECT id,attributes->>'brand' AS brand FROM products;` **Why:** `->>` returns text. **Alternative:** `->` retains JSON value.

### B048 — JSON containment
**Problem:** products whose attributes contain `{"color":"black"}`. **Expected:** matching rows. **Hint:** `@>`. **Solution:** `SELECT * FROM products WHERE attributes @> '{"color":"black"}'::jsonb;` **Why:** JSONB containment. **Alternative:** expression predicate on `attributes->>'color'`.

### B049 — Array ANY concept
**Problem / schema:** given bind array `{1,3,5}`, select product IDs in it. **Expected:** matching products. **Hint:** `= ANY(array)`. **Solution:** `SELECT * FROM products WHERE id = ANY(ARRAY[1,3,5]::bigint[]);` **Why:** compares value to each array element. **Alternative:** `IN (1,3,5)` for fixed literals.

### B050 — UNION ALL
**Problem:** combine customer emails and a fixed system address without dedupe. **Expected:** all rows. **Hint:** UNION ALL. **Solution:** `SELECT email FROM customers UNION ALL SELECT 'system@example.com';` **Why:** preserves duplicates. **Alternative:** UNION when distinctness is required.

### B051 — UNION distinct
**Problem:** combine customer countries and fixed `PK`, dedupe. **Expected:** unique values. **Hint:** UNION. **Solution:** `SELECT country FROM customers UNION SELECT 'PK';` **Why:** set operation removes duplicates. **Alternative:** UNION ALL + DISTINCT only if needed for different composition.

### B052 — Simple subquery
**Problem:** products priced above average. **Expected:** high-priced rows. **Hint:** scalar subquery. **Solution:** `SELECT * FROM products WHERE price > (SELECT avg(price) FROM products);` **Why:** scalar aggregate feeds predicate. **Alternative:** CTE for named stage.

### B053 — Count orders per customer with correlated subquery
**Problem:** one row/customer with order count. **Expected:** including zero. **Hint:** correlated scalar aggregate. **Solution:** `SELECT c.id,(SELECT count(*) FROM orders o WHERE o.customer_id=c.id) AS order_count FROM customers c;` **Why:** subquery references outer ID. **Alternative:** LEFT JOIN + GROUP BY.

### B054 — Find duplicate countries count concept
**Problem:** list countries appearing more than once. **Expected:** duplicate groups. **Hint:** GROUP BY/HAVING. **Solution:** `SELECT country,count(*) FROM customers WHERE country IS NOT NULL GROUP BY country HAVING count(*)>1;` **Why:** counts group multiplicity. **Alternative:** window count later.

### B055 — Delete expired jobs
**Problem:** delete ready jobs older than one year in fixture. **Expected:** removed IDs. **Hint:** DELETE WHERE + RETURNING. **Solution:** `DELETE FROM jobs WHERE status='ready' AND run_at < now()-interval '1 year' RETURNING id;` **Why:** scoped delete. **Alternative:** archive first if retention requires history.

### B056 — Update job priority
**Problem:** add 10 priority to ready jobs. **Expected:** updated values. **Hint:** arithmetic SET. **Solution:** `UPDATE jobs SET priority=priority+10 WHERE status='ready' RETURNING id,priority;` **Why:** atomic expression. **Alternative:** update selected IDs only.

### B057 — Count paid orders with FILTER
**Problem:** one row with total orders and paid orders. **Expected:** two counts. **Hint:** aggregate FILTER. **Solution:** `SELECT count(*) AS all_orders,count(*) FILTER (WHERE status='paid') AS paid_orders FROM orders;` **Why:** conditional aggregate. **Alternative:** SUM(CASE ...).

### B058 — String aggregate SKUs
**Problem:** list order product SKUs comma-separated. **Expected:** one string/order. **Hint:** join + string_agg. **Solution:** `SELECT oi.order_id,string_agg(p.sku,',' ORDER BY p.sku) FROM order_items oi JOIN products p ON p.id=oi.product_id GROUP BY oi.order_id;` **Why:** aggregate text with deterministic order. **Alternative:** `array_agg` for typed collection.

### B059 — Explain a query
**Problem:** inspect customer lookup without executing mutation. **Expected:** plan text. **Hint:** EXPLAIN. **Solution:** `EXPLAIN SELECT * FROM customers WHERE email='a@example.com';` **Why:** shows planner choice/cost estimates. **Alternative:** `EXPLAIN (ANALYZE,BUFFERS)` executes SELECT for actuals.

### B060 — Transaction rollback
**Problem:** update product price then undo. **Expected:** final price unchanged. **Hint:** BEGIN/ROLLBACK. **Solution:** `BEGIN; UPDATE products SET price=999 WHERE id=1; ROLLBACK;` **Why:** transaction atomicity discards uncommitted change. **Alternative:** COMMIT to persist when test expects change.

## Level exit test

Without notes, explain `SELECT`, `WHERE`, three-valued NULL logic, sorting, limiting, CRUD, aggregates, GROUP BY/HAVING, inner/left/semi/anti joins, simple subqueries, JSON extraction, and transaction rollback. Then rewrite B010 using keyset pagination after studying chapter 27.
