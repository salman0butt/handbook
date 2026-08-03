---
id: project-02-ecommerce-database
title: "Project 2 — E-Commerce Database"
---

# Project 2 — E-Commerce Database

## Requirements

Build products, variants, categories, customers, carts, orders, items, inventory, and price history. Orders must preserve charged item facts even if product names/prices later change. Inventory cannot go negative; checkout retries must not create duplicate orders.

## ER diagram

```text
Category >──< Product 1──< Variant 1──1 Inventory
Customer 1──< Cart 1──< CartItem >──1 Variant
Customer 1──< Order 1──< OrderItem >──1 Variant
Variant 1──< Price
```

## Schema and constraints

Use identity/UUIDv7 PKs, `UNIQUE(sku)`, FK tables for many-to-many categories, `CHECK(quantity >= 0)`, currency + `numeric(12,2)`, `UNIQUE(order_id,line_no)`, and an idempotency key unique per customer/checkout request. `order_items` snapshot `sku`, product title, unit price, currency, quantity, and tax required to reproduce the sale.

```sql
CREATE TABLE inventory (
  variant_id bigint PRIMARY KEY REFERENCES variants(id),
  quantity integer NOT NULL CHECK (quantity >= 0)
);
CREATE INDEX orders_customer_created_idx
ON orders(customer_id, created_at DESC, id DESC);
```

## Seed and SQL

Seed 20 products, 40 variants, 5 categories, customers, carts, historical prices, and inventory. Implement catalog search, cart totals, order history, top products, low-stock report, and revenue aggregates.

Atomic reservation:

```sql
UPDATE inventory
SET quantity = quantity - $1
WHERE variant_id = $2 AND quantity >= $1
RETURNING quantity;
```

Checkout transaction creates order/items, decrements all stock in deterministic variant order, writes payment intent/outbox rows, and commits once.

## EXPLAIN / indexes

Analyze catalog filters, customer order keyset pagination, SKU lookup, and low-stock scans. Compare a broad JSONB GIN attribute index with expression indexes for hot attributes.

## Tests

Duplicate SKU/idempotency, insufficient stock, two concurrent final-unit checkouts, price changes after purchase, cart item deleted product, FK/cascade behavior, currency mismatch, and rollback after one failed item.

## Security review

Runtime role has required DML only. Customer access is scoped by user/tenant ownership in the application/RLS design. All dynamic sort/filter fields use allowlists.

## Failure cases

Payment provider timeout, duplicate webhook, partial stock reservation, outbox publisher crash, hot SKU contention, stale replica order read, deep pagination.

## Acceptance criteria

No oversell in concurrency tests; one logical checkout per idempotency key; order history remains reconstructable; representative plans and buffer counts are recorded; backup restores and smoke tests pass.

## Interview / senior review

Explain price snapshot vs source-of-truth price, stock locking vs atomic decrement, cart vs order lifecycle, partial indexes for active carts/orders, payment ledger/outbox, read replicas, partitioning trigger points, and zero-downtime evolution of order states.