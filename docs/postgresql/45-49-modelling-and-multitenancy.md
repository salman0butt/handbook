---
id: 45-49-modelling-and-multitenancy
title: 45–49 — Normalization, Data Modelling, Relationships & Multi-Tenancy
---

# 45 — Normalization

Normalization reduces avoidable duplication and makes dependencies explicit. The point is not to collect normal-form badges; it is to prevent contradictory facts.

Suppose one order row repeats customer email and address for every item. Changing the customer's email now has many possible copies (**update anomaly**); creating a customer may require a fake order (**insertion anomaly**); deleting the last order might erase the only customer data (**deletion anomaly**).

## Functional dependency

`A → B` means the value of A determines B. Candidate keys determine every attribute of a relation.

- **1NF:** values are atomic relative to the relational design; don't store repeating groups/comma-separated child records.
- **2NF:** non-key facts should not depend on only part of a composite candidate key.
- **3NF:** non-key facts should not depend transitively on other non-key facts.
- **BCNF:** every determinant is a candidate key; addresses edge cases beyond 3NF.
- **4NF/5NF:** handle independent multivalued dependencies and join dependencies; useful for advanced modelling but less frequently encountered explicitly in application design.

Normalize around facts and invariants first. Then measure whether selected read paths justify controlled denormalization.

---

# 46 — Denormalization

Denormalization deliberately duplicates/derives data to improve a known workload.

Examples include materialized views, cached aggregates, search documents, reporting read models, prejoined projections, and carefully chosen JSONB snapshots.

Every duplicate creates a consistency question:

```text
source of truth changes
      ↓
when/how does derived copy update?
      ↓
what happens on failure/retry?
```

Use transactions for same-database synchronous invariants, outbox/events for cross-system propagation, refresh policies for materialized views, and reconciliation for eventually consistent projections.

**Anti-pattern:** duplicate `customer_email` into every order “for performance” without deciding whether it is an immutable historical snapshot or a current denormalized cache.

---

# 47 — Database Modelling

A reliable model begins with requirements, not tables.

1. Identify entities/facts and lifecycle.
2. Identify relationships and cardinality.
3. State invariants in plain language.
4. Find candidate keys and stable identities.
5. Choose nullability and temporal meaning.
6. Normalize dependencies.
7. Express constraints.
8. List critical read/write access patterns.
9. Add indexes for those patterns.
10. Define transaction boundaries and concurrency rules.

Example inventory invariants:

```text
SKU unique
quantity >= 0
reservation belongs to existing SKU
one idempotency key creates at most one reservation
concurrent reservations must not oversell
```

These requirements imply unique/check/FK constraints plus a transaction/concurrency pattern—not merely columns.

```text
Customer 1 ───< Order 1 ───< OrderItem >─── 1 Product
Product  1 ───< InventoryMovement
```

Model events/history separately when current-state mutation would destroy required audit information.

---

# 48 — Relationship Modelling

## One-to-one

```sql
CREATE TABLE user_profiles (
  user_id bigint PRIMARY KEY REFERENCES users(id),
  bio text
);
```

A separate one-to-one table is useful when lifecycle, security, sparsity, or ownership differs.

## One-to-many

The many side carries the FK: `orders.customer_id REFERENCES customers(id)`.

## Many-to-many

```sql
CREATE TABLE memberships (
  organization_id bigint REFERENCES organizations(id),
  user_id bigint REFERENCES users(id),
  role text NOT NULL,
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (organization_id, user_id)
);
```

The junction table can store facts about the relationship itself.

## Self-referencing and hierarchies

`parent_id bigint REFERENCES categories(id)` supports an adjacency list; recursive CTEs traverse it. Materialized paths and closure tables trade write complexity for different read patterns.

## Polymorphic associations

`target_type + target_id` is convenient but weak for ordinary foreign-key enforcement. Prefer a common parent entity, separate association tables, or explicit FKs with a check ensuring exactly one target when database-enforced integrity matters.

---

# 49 — Multi-Tenant Database Design

Tenancy is a security and operational architecture choice.

## Shared database, shared schema

```sql
CREATE TABLE projects (
  tenant_id uuid NOT NULL REFERENCES organizations(id),
  project_id uuid NOT NULL DEFAULT uuidv7(),
  name text NOT NULL,
  PRIMARY KEY (tenant_id, project_id),
  UNIQUE (tenant_id, name)
);
```

Put `tenant_id` in uniqueness/index design so invariants are tenant-scoped. Tenant-owned foreign keys can include tenant identity when cross-tenant references must be impossible.

RLS can provide defense in depth:

```sql
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_projects ON projects
USING (tenant_id = current_setting('app.tenant_id')::uuid)
WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
```

RLS still requires deliberate roles, owner/bypass behavior, pool/session state management, migration privileges, and policy tests.

## Schema per tenant

Pros: namespace separation and customization. Costs: many schemas/objects, search paths, migrations, catalog growth, and operating complexity.

## Database per tenant

Pros: strong operational isolation and per-tenant restore/move options. Costs: connection pools, migrations, observability, fleet upgrades, cross-tenant analytics, and resource efficiency.

```text
shared schema → easiest fleet operation, strongest row-isolation requirements
schema/tenant → more namespace isolation, more migration/catalog complexity
database/tenant → stronger database boundary, larger operational fleet
```

Choose using isolation requirements, tenant count/size, customization, compliance, restore needs, noisy-neighbor risk, and the team operating model.

**Senior review:** demonstrate with tests how every tenant-aware access path preserves tenant isolation. Relying only on developers remembering a filter is not a sufficient architecture control.