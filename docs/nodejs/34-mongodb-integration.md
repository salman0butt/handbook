---
title: MongoDB Integration
---

# MongoDB Integration

MongoDB integration still requires connection lifecycle, schema discipline, indexes, consistency choices, and bounded queries.

## Client lifecycle

Create a client once per process/service lifecycle, allow the driver to manage its pool, and close on graceful shutdown. Per-request clients destroy pooling benefits and can create connection storms.

## Documents and `ObjectId`

Treat database IDs as domain/infrastructure values deliberately. Validate external ID strings before conversion and avoid spreading driver-specific objects through public API contracts.

## Indexes

A flexible document schema does not mean query patterns are free. Every important query needs an index/access-pattern story. Over-indexing increases write cost and storage.

## Transactions and consistency

Transactions are available for supported deployments, but they add coordination cost. Model documents/aggregates so common invariants can often be updated atomically within one document when appropriate, and use transactions when cross-document guarantees truly require them.

## Aggregation

Aggregation pipelines can move expensive work into the database. Bound input sets, inspect plans, monitor memory/time, and avoid treating the DB as an unlimited compute worker.

## Schema validation

Runtime validation belongs both at application boundaries and, for critical invariants, in database-level schema/constraints where possible. Application TypeScript types alone do not protect stored data from another writer or old deployment.

## Production failures

Expect primary elections, transient network errors, stale reads under chosen read preferences, pool exhaustion, slow queries, index build effects, and schema drift. Retry policy must align with operation semantics and driver behavior.
