---
title: "PostgreSQL Exercise Track"
description: "Exactly 300 canonical PostgreSQL exercises: 100 Beginner, 100 Intermediate, and 100 Advanced."
---

# PostgreSQL Exercise Track

IDs are `PG-B-001`–`PG-B-100`, `PG-I-001`–`PG-I-100`, and `PG-A-001`–`PG-A-100`. Each task includes setup, inputs, expected behavior, hints, validation, an expandable solution, mistakes, and performance guidance. The preserved 60×5 bank remains in the archive.

## Shared practice schema

```sql
CREATE TABLE customers(id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,email text NOT NULL UNIQUE,country text,created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE products(id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,sku text NOT NULL UNIQUE,category text NOT NULL,price numeric(12,2) NOT NULL CHECK(price>=0),attributes jsonb NOT NULL DEFAULT '{}'::jsonb);
CREATE TABLE orders(id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,customer_id bigint NOT NULL REFERENCES customers(id),status text NOT NULL CHECK(status IN('pending','paid','shipped','cancelled')),total numeric(12,2) NOT NULL CHECK(total>=0),created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE order_items(order_id bigint REFERENCES orders(id),product_id bigint REFERENCES products(id),quantity integer NOT NULL CHECK(quantity>0),unit_price numeric(12,2) NOT NULL CHECK(unit_price>=0),PRIMARY KEY(order_id,product_id));
CREATE TABLE employees(id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,manager_id bigint REFERENCES employees(id),department text NOT NULL,salary numeric(12,2) NOT NULL,hired_at date NOT NULL);
CREATE TABLE events(id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,user_id bigint,event_name text NOT NULL,occurred_at timestamptz NOT NULL,properties jsonb NOT NULL DEFAULT '{}'::jsonb);
CREATE TABLE inventory(product_id bigint PRIMARY KEY REFERENCES products(id),quantity integer NOT NULL CHECK(quantity>=0),version integer NOT NULL DEFAULT 1);
CREATE TABLE jobs(id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,status text NOT NULL DEFAULT 'queued',run_at timestamptz NOT NULL,priority integer NOT NULL DEFAULT 0,attempts integer NOT NULL DEFAULT 0,locked_at timestamptz,locked_by text);
```
