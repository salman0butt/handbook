---
id: sql-exercises-overview
title: SQL Exercise Bank — 300 Exercises
---

# SQL Exercise Bank — 300 Exercises

The bank contains **300 exercises** split evenly across Beginner, Intermediate, Advanced, Expert, and Production levels (60 each).

Every exercise records the problem, schema/fixture, expected result, hint, solution, explanation, and an alternative when one is useful.

## Shared practice schema

```sql
CREATE TABLE customers (
  id bigint PRIMARY KEY,
  email text NOT NULL UNIQUE,
  country text,
  created_at timestamptz NOT NULL
);
CREATE TABLE products (
  id bigint PRIMARY KEY,
  sku text NOT NULL UNIQUE,
  category text NOT NULL,
  price numeric(12,2) NOT NULL,
  attributes jsonb NOT NULL DEFAULT '{}'
);
CREATE TABLE orders (
  id bigint PRIMARY KEY,
  customer_id bigint NOT NULL REFERENCES customers(id),
  status text NOT NULL,
  total numeric(12,2) NOT NULL,
  created_at timestamptz NOT NULL
);
CREATE TABLE order_items (
  order_id bigint REFERENCES orders(id),
  product_id bigint REFERENCES products(id),
  quantity integer NOT NULL,
  unit_price numeric(12,2) NOT NULL,
  PRIMARY KEY(order_id, product_id)
);
CREATE TABLE employees (
  id bigint PRIMARY KEY,
  manager_id bigint REFERENCES employees(id),
  department text NOT NULL,
  salary numeric(12,2) NOT NULL,
  hired_at date NOT NULL
);
CREATE TABLE events (
  id bigint PRIMARY KEY,
  user_id bigint,
  event_name text NOT NULL,
  occurred_at timestamptz NOT NULL,
  properties jsonb NOT NULL DEFAULT '{}'
);
CREATE TABLE inventory (
  product_id bigint PRIMARY KEY REFERENCES products(id),
  quantity integer NOT NULL CHECK (quantity >= 0),
  version integer NOT NULL DEFAULT 1
);
CREATE TABLE jobs (
  id bigint PRIMARY KEY,
  status text NOT NULL,
  run_at timestamptz NOT NULL,
  priority integer NOT NULL DEFAULT 0,
  attempts integer NOT NULL DEFAULT 0
);
```

Use a small fixture first, then scale the tables to learn planning/performance. Add indexes only when an exercise asks for them.

- [Beginner B001–B060](./beginner.md)
- [Intermediate I001–I060](./intermediate.md)
- [Advanced A001–A060](./advanced.md)
- [Expert E001–E060](./expert.md)
- [Production P001–P060](./production.md)