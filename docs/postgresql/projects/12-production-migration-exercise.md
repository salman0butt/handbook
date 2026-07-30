---
id: project-12-production-migration-exercise
title: Project 12 — Production Migration Exercise
---

# Project 12 — Production Migration Exercise

## Scenario

A 500M-row `orders` table stores `customer_email text`. Move to `customer_id uuid`, enforce a foreign key and NOT NULL, add a new feed index, and remove the old field without downtime while traffic continues.

## Starting ER diagram

```text
Orders(customer_email)    Customers(email)
       no enforced FK
```

Target:

```text
Customer 1──< Order(customer_id FK)
```

## Expand

```sql
ALTER TABLE orders ADD COLUMN customer_id uuid;
CREATE INDEX CONCURRENTLY orders_customer_id_idx ON orders(customer_id);
```

Deploy compatible code that writes both old email and `customer_id` for new/changed orders while reads still tolerate both. Prefer one authoritative lookup/write path; instrument mismatch counts.

## Backfill

Process bounded ID/time ranges:

```sql
UPDATE orders o
SET customer_id = c.id
FROM customers c
WHERE o.id > $lo AND o.id <= $hi
  AND o.customer_id IS NULL
  AND lower(c.email) = lower(o.customer_email);
```

The real plan must use an indexed customer lookup and stable batch key. Throttle using p95 latency, WAL generation, replica lag, CPU/I/O and lock wait. Persist progress and make batches idempotent.

## Validate constraints

Resolve unmatched/duplicate customer-email data first, then:

```sql
ALTER TABLE orders
ADD CONSTRAINT orders_customer_id_fkey
FOREIGN KEY (customer_id) REFERENCES customers(id)
NOT VALID;

ALTER TABLE orders VALIDATE CONSTRAINT orders_customer_id_fkey;

ALTER TABLE orders
ADD CONSTRAINT orders_customer_id_present_chk
CHECK (customer_id IS NOT NULL) NOT VALID;

ALTER TABLE orders VALIDATE CONSTRAINT orders_customer_id_present_chk;
ALTER TABLE orders ALTER COLUMN customer_id SET NOT NULL;
```

Test PostgreSQL 18 lock/scan behavior on production-scale replicas before rollout.

## New index

```sql
CREATE INDEX CONCURRENTLY orders_customer_created_idx
ON orders(customer_id, created_at DESC, id DESC);
```

Inspect invalid indexes if interrupted and clean/retry deliberately.

## Switch and contract

Deploy reads using `customer_id`; stop old-column writes; compare metrics/reconciliation; keep compatibility window; later drop old indexes/constraints/`customer_email` in a separate reviewed change.

## ER after migration

```text
Customer(id,email unique)
    1
    │ FK
    <
Order(customer_id, created_at, ...)
```

## EXPLAIN / tests / security

Compare old email lookup vs FK/B-tree query, feed pagination and backfill plans. Test duplicate emails, no-match rows, concurrent new writes, worker restart, constraint validation, invalid index, lock timeout, replica lag, rollback/forward-fix. Migration role has DDL; application role does not.

## Failure cases and rollback planning

Backfill overload → throttle/stop safely. New code bug → old column still usable during expansion. Constraint validation failure → fix data and rerun. Concurrent index failure → inspect/drop invalid index. After destructive contract, rollback may require restore/reconstruction; therefore delay contract until confidence window passes.

## Acceptance criteria

No blocking migration outside defined budget; every row maps correctly; branch code versions remain compatible through rollout; zero invalid indexes; FK/NOT NULL enforced; load and replica lag remain within budget; rollback/forward-fix runbook tested.

## Interview / senior review

Explain why expand/contract beats rename/drop in one deploy, how `NOT VALID` helps, why `CREATE INDEX CONCURRENTLY` is not inside a transaction, how WAL/replica lag constrain backfill speed, and what evidence permits contract.