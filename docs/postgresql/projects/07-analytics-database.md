---
id: project-07-analytics-database
title: Project 7 — Analytics Database
---

# Project 7 — Analytics Database

## Requirements

Ingest product events and support daily active users, funnels, retention, cohorts, running metrics, top dimensions, and dashboard refreshes. Preserve raw immutable events while allowing fast aggregates.

## ER diagram

```text
User 1──< Event >──0..1 Session
Event >──1 EventType
Day/tenant partitions → Events
Materialized/report tables ← events
```

## Schema

```sql
CREATE TABLE events (
  tenant_id uuid NOT NULL,
  event_id uuid NOT NULL DEFAULT uuidv7(),
  user_id uuid,
  event_name text NOT NULL,
  occurred_at timestamptz NOT NULL,
  properties jsonb NOT NULL DEFAULT '{}',
  PRIMARY KEY (tenant_id, occurred_at, event_id)
) PARTITION BY RANGE (occurred_at);
```

Create monthly partitions, tenant/time B-tree indexes, BRIN on very large append-correlated time columns where measured, and JSONB expression/GIN indexes only for stable dashboard filters.

## Seed / SQL

Generate at least 1M synthetic events across tenants/users/months with skew. Implement DAU/MAU, first event, top-N per day, funnel steps, 7-day rolling average, retention cohorts, gaps/islands sessions, and JSON property segmentation.

## Transactions/concurrency

Bulk ingestion uses COPY/staging and idempotent `event_id`. Events are append-only. Aggregate refreshes publish a complete period transactionally; avoid holding one transaction across massive raw-data transformations.

## EXPLAIN analysis

Compare partition pruning, BRIN vs B-tree time scans, window sorts, hash aggregates, temp spills, and materialized-view dashboard queries. Record estimates/actuals and `work_mem` sensitivity without globally over-tuning.

## Tests/security/failures

Test duplicate ingestion, late events, out-of-order timestamps, null users, large JSON properties, partition boundary dates, stale materialized data, refresh failure, disk/WAL spikes, and one tenant's skew. Tenant dashboard role cannot query another tenant.

## Acceptance criteria

Raw events remain immutable; partition lifecycle documented; dashboard SLO and freshness SLA met; queries have reproducible plans; reload/restore produces identical metrics.

## Interview / senior review

When does partitioning help? BRIN vs B-tree? Why keep raw events? How do late events change cohorts? When should OLAP move to a separate analytics system rather than continue scaling PostgreSQL?