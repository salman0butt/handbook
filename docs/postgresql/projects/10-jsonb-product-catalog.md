---
id: project-10-jsonb-product-catalog
title: "Project 10 — JSONB Product Catalog"
---

# Project 10 — JSONB Product Catalog

## Requirements

Build a product catalog with stable relational identity/price/category/status fields and category-specific sparse attributes in JSONB. Support containment filters, hot expression filters, faceting, validation, and schema evolution.

## ER diagram

```text
Category 1──< Product 1──< Variant
Product.attributes jsonb
Product >──< CategoryTag
```

## Schema

```sql
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT uuidv7(),
  sku text NOT NULL UNIQUE,
  category_id bigint NOT NULL REFERENCES categories(id),
  name text NOT NULL,
  price numeric(12,2) NOT NULL CHECK (price >= 0),
  status text NOT NULL CHECK (status IN ('draft','active','archived')),
  attributes jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX products_attrs_gin ON products USING gin(attributes);
CREATE INDEX products_brand_idx ON products((attributes->>'brand'))
WHERE status = 'active';
CREATE INDEX products_category_price_idx
ON products(category_id, price, id) WHERE status = 'active';
```

Use JSON Schema/application validation plus database `CHECK` constraints for critical JSON keys/types when they are required, but move truly stable fields to typed columns.

## Seed / SQL

Seed electronics, lighting, apparel, and furniture with different attribute shapes. Implement containment search, numeric extracted-value filtering with safe casts, brand facets, category/price pagination, and JSON aggregation API payloads.

## Transactions/concurrency

Product + variants + category relationships update in one transaction. Use optimistic versioning for admin edits to avoid overwriting concurrent attribute changes. Avoid read-modify-write of whole JSON documents when independent fields are frequently changed.

## EXPLAIN

Compare broad GIN, `jsonb_path_ops` where operator needs allow it, expression index for brand, and relational category/price index. Record index size/write cost and planner row estimates.

## Tests/security/failures

Missing/wrong JSON types, duplicate keys in input semantics, null vs absent key, huge attributes, unsupported categories, concurrent edit, dynamic filter injection, GIN bloat/write pressure.

## Acceptance criteria

Relational invariants remain typed; JSONB use is justified; hot searches are indexed/measured; validation prevents invalid catalog states; API filters are allowlisted.

## Interview / senior review

When is JSONB an anti-pattern? GIN vs expression indexes? How do schema changes work? How would 100 category-specific attributes be modelled without EAV abuse? When should search facets move to a dedicated search system?