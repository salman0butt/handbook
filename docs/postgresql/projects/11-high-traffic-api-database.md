---
id: project-11-high-traffic-api-database
title: Project 11 — High-Traffic API Database
---

# Project 11 — High-Traffic API Database

## Requirements

Design the database behind a read-heavy API serving tenant-scoped feeds/items under p95 latency SLOs. Include pooling, keyset pagination, cache, replica-aware reads, observability, load tests, and migration safety.

## ER diagram

```text
Tenant 1──< User 1──< Item
Item >──< Tag
APIRequest → query fingerprints / metrics
Primary → read replica(s)
```

## Schema / indexes

Use tenant-aware PK/FK design, a stable item state enum/check, and indexes for exact lookup and feed traversal:

```sql
CREATE INDEX items_feed_idx
ON items(tenant_id, published_at DESC, id DESC)
INCLUDE (title, author_id)
WHERE status = 'published';
```

Add only measured tag/search indexes. Keep payload columns out of hot covering indexes unless read/write/storage trade-off is justified.

## Seed / SQL

Generate 10M items with skewed tenants/authors/tags. Implement feed keyset pagination, item detail, user items, tag filters, counts, and write paths. Return bounded projections rather than `SELECT *`.

## Transactions/concurrency

Writes use short explicit transactions; unique constraints resolve duplicate slugs/idempotency. Read-after-write paths stay on primary or use a defined replica-consistency strategy. Pool is sized by database concurrency, not request concurrency.

## EXPLAIN and load testing

Record `EXPLAIN (ANALYZE, BUFFERS)` for top fingerprints, then use pgbench/custom load to measure p50/p95/p99, pool wait, CPU, I/O, temp files, WAL, calls/s, and replica lag. Compare offset vs keyset pages and cache hit/miss behavior.

## Cache / replicas

Cache only stable expensive projections with explicit invalidation/TTL. Replica reads are allowed for endpoints with a documented staleness budget; account/settings/payment-like read-your-write flows use primary.

## Tests/security/failures

Connection storm, pool exhaustion, hot tenant, stale replica, cache stampede, timeout/cancellation, generic-plan skew, migration lock wait, slow query regression, disk/WAL pressure. Runtime role is least privilege and tenant access is enforced/tested.

## Acceptance criteria

SLO met at target concurrency; no unbounded endpoints; database stays below capacity envelope; top workload fingerprints monitored; restore/failover and migration drills pass.

## Interview / senior review

Explain pool sizing, keyset ordering, covering-index cost, cache consistency, replica staleness, `pg_stat_statements` prioritization, load-shedding, and scaling triggers before sharding.