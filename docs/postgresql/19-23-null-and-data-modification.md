---
id: 19-23-null-and-data-modification
title: "19–23 — NULL, INSERT, UPDATE, DELETE, UPSERT & MERGE"
---

# 19 — NULL

`NULL` means a value is missing/unknown/not applicable according to the model. It is **not** an empty string, zero, `false`, or a magic value.

SQL comparisons use three-valued logic: `TRUE`, `FALSE`, and `UNKNOWN`.

| Expression | Result |
| --- | --- |
| `5 = 5` | TRUE |
| `5 = 6` | FALSE |
| `5 = NULL` | UNKNOWN |
| `NULL = NULL` | UNKNOWN |

A `WHERE` predicate keeps rows only when the predicate is `TRUE`; both `FALSE` and `UNKNOWN` are filtered.

```sql
SELECT * FROM users WHERE deleted_at = NULL;    -- wrong
SELECT * FROM users WHERE deleted_at IS NULL;   -- correct
```

For null-safe equality:

```sql
a IS DISTINCT FROM b
-- or
a IS NOT DISTINCT FROM b
```

## Three-valued logic trap

```sql
WHERE country <> 'PK'
```

Rows with `country IS NULL` do not pass because `NULL <> 'PK'` is `UNKNOWN`.

`NOT IN` is especially dangerous when the right side can contain `NULL`:

```sql
SELECT * FROM users
WHERE id NOT IN (SELECT banned_user_id FROM bans);
```

If that subquery includes a `NULL`, candidate comparisons can collapse to `UNKNOWN`. Prefer a `NOT EXISTS` anti-join when the semantic is “no matching row”:

```sql
SELECT u.*
FROM users u
WHERE NOT EXISTS (
  SELECT 1 FROM bans b WHERE b.banned_user_id = u.id
);
```

## Aggregates and ordering

`COUNT(*)` counts rows. `COUNT(column)` counts non-null values. Most aggregates ignore null inputs; a group containing no non-null inputs can produce `NULL` depending on aggregate.

PostgreSQL lets you control sort placement:

```sql
ORDER BY published_at DESC NULLS LAST
```

## Constraints and uniqueness

`NOT NULL` is the direct constraint when absence is invalid. PostgreSQL unique semantics involving `NULL` require deliberate design; PostgreSQL supports `UNIQUE NULLS NOT DISTINCT` when nulls should compare as duplicates for uniqueness enforcement.

**Senior rule:** define what absence means per attribute. Nullable columns that collapse “unknown,” “not yet,” “not applicable,” and “redacted” into one state may need a richer model.

---

# 20 — INSERT

**✅ Standard SQL, plus 🐘 PostgreSQL `RETURNING` extensions.** Always name columns in maintainable application SQL:

```sql
INSERT INTO users (email, display_name)
VALUES ('ada@example.com', 'Ada'),
       ('grace@example.com', 'Grace')
RETURNING id, email;
```

Omitted columns receive defaults or `NULL` when allowed. `DEFAULT` can be explicit:

```sql
INSERT INTO jobs (status, created_at)
VALUES (DEFAULT, DEFAULT);
```

Insert query results with `INSERT ... SELECT`:

```sql
INSERT INTO archived_orders (id, customer_id, total)
SELECT id, customer_id, total
FROM orders
WHERE created_at < DATE '2025-01-01';
```

Constraints are checked as part of the statement/transaction according to their timing/deferrability. For bulk loading, later chapters compare multi-row insert and `COPY`.

**PostgreSQL 18:** `RETURNING` can reference `OLD`/`NEW` values in supported modifying statements, useful for auditing state transitions.

---

# 21 — UPDATE

```sql
UPDATE accounts
SET status = 'active',
    updated_at = now()
WHERE account_id = $1
RETURNING *;
```

Without `WHERE`, every visible row is targeted. Treat bulk update scope as a review item, not a syntax detail.

`UPDATE ... FROM` joins another source:

```sql
UPDATE products p
SET price = i.new_price
FROM imported_prices i
WHERE i.sku = p.sku;
```

Ensure the join produces at most one logically relevant source row per target. Ambiguous duplicates can make outcome reasoning unsafe.

## Concurrency

This application pattern is race-prone:

```text
SELECT balance
compute in app
UPDATE balance = computed_value
```

Prefer atomic expressions or locks/serializable logic as appropriate:

```sql
UPDATE inventory
SET quantity = quantity - $1
WHERE sku = $2
  AND quantity >= $1
RETURNING quantity;
```

The affected-row count becomes part of the concurrency protocol.

Under MVCC, an update creates a new tuple version and makes the old version obsolete for future snapshots. Index maintenance depends on changed indexed columns and HOT eligibility.

---

# 22 — DELETE

```sql
DELETE FROM sessions
WHERE expires_at < now()
RETURNING id;
```

`DELETE ... USING` can join conditions:

```sql
DELETE FROM cart_items ci
USING abandoned_carts ac
WHERE ci.cart_id = ac.cart_id;
```

Foreign key actions can reject or cascade deletion. Cascades encode ownership semantics and can fan out into substantial work; choose them deliberately.

## DELETE vs TRUNCATE

`DELETE` removes selected rows using normal row-level MVCC semantics and can fire row-level delete behavior. `TRUNCATE` is a table-level operation designed to remove all rows efficiently, with different locking, trigger, identity/sequence, and transactional characteristics. It is not a “faster DELETE with the same semantics.”

After large deletes, the file does not automatically shrink to the OS. Dead space can be reused after vacuum; `VACUUM FULL` rewrites/locks the table and is an operational tool, not routine cleanup.

---

# 23 — UPSERT and MERGE

## `INSERT ... ON CONFLICT`

PostgreSQL's upsert uses a unique/exclusion inference target:

```sql
INSERT INTO user_settings (user_id, theme)
VALUES ($1, $2)
ON CONFLICT (user_id)
DO UPDATE SET theme = EXCLUDED.theme
RETURNING *;
```

This is race-safe in a way that “SELECT whether row exists, then INSERT/UPDATE” is not. The unique constraint/index is the concurrency authority.

Use `DO NOTHING` for idempotent creation where existing state should remain unchanged:

```sql
INSERT INTO webhook_receipts (provider, event_id)
VALUES ($1, $2)
ON CONFLICT (provider, event_id) DO NOTHING;
```

## MERGE

**✅ Standard SQL concept with PostgreSQL implementation.** `MERGE` expresses conditional actions based on source/target matching:

```sql
MERGE INTO inventory AS t
USING incoming_inventory AS s
ON t.sku = s.sku
WHEN MATCHED THEN
  UPDATE SET quantity = s.quantity
WHEN NOT MATCHED THEN
  INSERT (sku, quantity) VALUES (s.sku, s.quantity);
```

`MERGE` is not automatically equivalent to a particular `ON CONFLICT` concurrency guarantee. Analyze uniqueness, matching multiplicity, isolation, concurrent changes, and exact command semantics.

## Production checklist

- define a unique invariant before calling something an upsert;
- make retries safe;
- avoid mutable conflict keys when possible;
- inspect locking/contention on hot keys;
- understand whether “last writer wins” is acceptable;
- return the committed row/version needed by the caller.

**Interview question:** Why does a unique constraint solve a duplicate-signup race better than an application “exists” check? Because the constraint arbitrates concurrent attempts atomically inside the database; a read-before-write check observes only a snapshot and leaves a race window.