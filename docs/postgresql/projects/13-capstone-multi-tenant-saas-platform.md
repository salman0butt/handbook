---
id: project-capstone-saas-platform
title: Capstone — Multi-Tenant SaaS PostgreSQL Platform
---

# Capstone — Multi-Tenant SaaS PostgreSQL Platform

Build a production-grade platform containing users, organizations, memberships, subscriptions, products, orders, payments, audit logs, notifications, jobs, API idempotency, outbox, and analytics.

## Architecture

```text
Users >──< Memberships >── Organizations
Organizations 1──< Products
Organizations 1──< Orders 1──< OrderItems
Orders 1──< Payments
Organizations 1──< Subscriptions
Organizations 1──< AuditLogs
Organizations 1──< Notifications
Organizations 1──< Jobs
Organizations 1──< IdempotencyKeys
Organizations 1──< OutboxEvents
Organizations 1──< AnalyticsEvents
```

## Schema principles

Use UUIDv7 identifiers where distributed generation/locality is valuable, with tenant-aware composite constraints on tenant-owned relationships. Keep stable facts typed; JSONB only for extensible provider/event metadata.

Representative tables:

```sql
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT uuidv7(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE memberships (
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('owner','admin','member')),
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (organization_id, user_id)
);

CREATE TABLE products (
  organization_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT uuidv7(),
  sku text NOT NULL,
  name text NOT NULL,
  price numeric(12,2) NOT NULL CHECK (price >= 0),
  attributes jsonb NOT NULL DEFAULT '{}',
  PRIMARY KEY (organization_id, id),
  UNIQUE (organization_id, sku),
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE TABLE orders (
  organization_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT uuidv7(),
  customer_user_id uuid NOT NULL REFERENCES users(id),
  status text NOT NULL CHECK (status IN ('pending','paid','cancelled','fulfilled')),
  currency char(3) NOT NULL,
  total numeric(14,2) NOT NULL CHECK (total >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (organization_id, id),
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE TABLE idempotency_keys (
  organization_id uuid NOT NULL,
  key text NOT NULL,
  request_hash text NOT NULL,
  response jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (organization_id, key)
);

CREATE TABLE outbox_events (
  organization_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT uuidv7(),
  topic text NOT NULL,
  aggregate_id uuid NOT NULL,
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  PRIMARY KEY (organization_id, id)
);
```

Add order items that snapshot SKU/name/unit price/currency/tax, payment attempt/ledger tables, immutable audit events, notifications, leased jobs, subscriptions and analytics events.

## Constraints and exclusion

Use PK/FK/NOT NULL/CHECK/UNIQUE as invariant guardians. Use exclusion constraints where a domain really has conflicting ranges—for example preventing overlapping effective subscription entitlement periods for the same organization/plan where the business rule requires it.

## RLS

Enable RLS on all tenant-owned tables. Runtime application role does not own tables or have `BYPASSRLS`.

```sql
CREATE POLICY tenant_orders ON orders
USING (organization_id = current_setting('app.tenant_id')::uuid)
WITH CHECK (organization_id = current_setting('app.tenant_id')::uuid);
```

Set tenant ID with `SET LOCAL` inside request transactions. Write automated negative tests for every table/function/view.

## Index design

Examples:

```sql
CREATE INDEX orders_tenant_created_idx
ON orders(organization_id, created_at DESC, id DESC);

CREATE INDEX orders_open_idx
ON orders(organization_id, created_at DESC, id DESC)
WHERE status IN ('pending','paid');

CREATE INDEX products_brand_idx
ON products(organization_id, (attributes->>'brand'));

CREATE INDEX outbox_pending_idx
ON outbox_events(created_at, id)
WHERE published_at IS NULL;
```

Use GIN for JSONB only where containment/path workload justifies it. Audit redundant indexes and HOT impact.

## Checkout transaction

```text
BEGIN
  set tenant context
  reserve/decrement inventory atomically
  insert order + snapshot items
  insert payment intent/idempotency record
  insert audit record
  insert outbox event
COMMIT
```

Never hold the transaction open during an external card-network request. External payment completion arrives as idempotent callback/workflow and updates state + outbox in another transaction.

## Concurrency

- product SKU: unique constraint;
- duplicate checkout/webhook: tenant-scoped idempotency key;
- inventory: atomic conditional decrement or deterministic row locks;
- membership role transitions: row lock/version rule;
- jobs/outbox publishing: `FOR UPDATE SKIP LOCKED` claim + leases/retries;
- cross-row predicate invariants: locks or Serializable with whole-transaction retry;
- optimistic admin editing: version column.

## Job queue and outbox

Jobs include `status`, `run_at`, priority, attempts, lease, payload, idempotency. Outbox publishers claim pending rows, publish, and mark completion. Consumers remain idempotent because an acknowledgement can be lost after publish.

Metrics: oldest unpublished event, pending jobs, oldest ready job, retry/dead count, lease expiry, processing duration.

## Audit history

Audit rows are append-only for runtime role and record tenant, actor, action, entity, request/correlation ID, before/after or structured change, and timestamp. Separate PII retention from security evidence requirements.

## Analytics

Raw immutable analytics events are time-partitioned only when pruning/lifecycle/maintenance justify it. Dashboard aggregates use materialized/reporting tables with freshness SLA. Heavy analytics can move to a separate system when OLTP resource isolation demands it.

## EXPLAIN ANALYZE performance review

Capture plans for:

1. tenant order feed;
2. SKU lookup;
3. dashboard order counts/revenue;
4. pending outbox claim;
5. job claim;
6. product JSON attribute filter;
7. membership authorization query.

For each record estimated vs actual rows, scan/join nodes, buffers, sort/hash spills, WAL for write tests, index size and call rate. Use `pg_stat_statements` to rank total workload cost.

## Migration exercise

Perform an expand/contract addition of `orders.fulfillment_provider_id`:

1. nullable column;
2. concurrent index if workload needs it;
3. compatible code;
4. bounded resumable backfill;
5. FK `NOT VALID`;
6. validate;
7. check/not-null validation;
8. switch code;
9. contract old representation later.

Track WAL/replica lag and lock waits throughout.

## Backup, PITR, replication, HA

Define example service targets such as RPO ≤ 5 minutes and RTO ≤ 30 minutes, then implement a strategy capable of meeting them: physical base backups + continuous WAL archive for PITR, plus logical dumps for selected portability/recovery use cases. Run quarterly restore drills.

Use streaming standby for HA/read scale. Define synchronous/asynchronous policy, failover authority, fencing, connection routing, replica staleness, old-primary rejoin, and application retry.

## Monitoring

Dashboards/alerts cover pools, active/idle-in-transaction sessions, p95/p99 query latency, top `pg_stat_statements`, blocking locks, long transactions, vacuum/analyze, XID/MultiXact age, table/index growth, cache/buffers, temp spills, WAL/archive, slots, replication lag, checkpoints, CPU/memory/disk/I/O and database errors.

## Security review

- private network/access controls;
- TLS with server identity verification;
- SCRAM/OAuth/cert policy as appropriate;
- least-privilege roles and separate migration/admin identities;
- no runtime schema ownership;
- RLS tests and pool-safe tenant context;
- parameterized values + allowlisted dynamic identifiers;
- hardened `SECURITY DEFINER` functions;
- approved extension list;
- encrypted/protected backups and secrets;
- PII retention/deletion/audit policy;
- current supported PostgreSQL minor upgrades.

## Seed data

Generate at least 100 organizations with skew (one very large), 10k users, memberships, 50k products, 1M orders/items, payments, jobs/outbox/audit/analytics. Include null/edge values allowed by the model and conflict cases for test fixtures.

## Failure tests

- two final-unit checkouts;
- duplicate payment callback;
- publisher crashes after broker publish;
- job worker crashes after side effect;
- long transaction blocks migration;
- replica falls behind;
- slot retains WAL;
- disk reaches alert threshold;
- autovacuum delayed by stale transaction;
- cache stale after write;
- tenant context missing/wrong;
- restore to PITR target after accidental delete;
- failover during application traffic;
- serialization/deadlock retry.

## Acceptance criteria

- normalized core and justified JSONB;
- every invariant mapped to constraint/transaction protocol;
- RLS negative tests pass;
- no oversell/duplicate logical charge under concurrency tests;
- plans meet representative SLOs and index cost is documented;
- migration completes under lock/lag budget;
- backup restores and PITR drill succeeds;
- replica/failover drill meets target;
- monitoring detects induced failures;
- application/migration/admin roles are separated;
- architecture review documents scale thresholds and alternatives.

## Interview questions

Explain tenant-aware keys, idempotency, outbox duplicate semantics, inventory races, plan selection, partial indexes, MVCC/vacuum impacts of hot updates, migration lock strategy, replica consistency, RPO/RTO, slot-WAL failure, and when to shard.

## Staff-level architecture review

Review data ownership and service boundaries, shared-vs-isolated tenant tiers, extension governance, migration governance, capacity cost model, security architecture, recovery testing, HA/fencing, analytics separation, regional strategy, and the explicit trigger conditions that would justify read replicas, partitioning, tenant extraction, or sharding.