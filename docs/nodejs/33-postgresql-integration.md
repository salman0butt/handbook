---
title: PostgreSQL Integration
---

# PostgreSQL Integration

PostgreSQL drivers expose clients and pools, but production correctness comes from understanding SQL transaction/session semantics.

## Pool ownership

Create long-lived pools at service startup, reuse them, and close them during shutdown. Do not create a new pool per request.

```text
Node replica A ─┐
Node replica B ─┼─ total connections must fit DB capacity
Node replica C ─┘
```

Autoscaling multiplies configured pool size, so capacity math must include max replicas plus admin/migration connections.

## Type mapping

PostgreSQL values do not always map safely to JS primitives. `bigint`/`numeric`, timestamps/time zones, arrays, JSON, and custom types require explicit policies. A 64-bit integer can exceed JavaScript's safe integer range.

## Transactions and locking

Keep transactions short. Waiting on locks while holding other resources raises latency and deadlock risk. For concurrent updates, use the database's atomic constraints/locking/optimistic version checks rather than an in-memory Node mutex across replicas.

## Streaming

Large result sets should be cursor/streamed where supported instead of buffered into huge arrays. Backpressure should extend from DB fetch through transforms to HTTP/file consumers.

## Migrations

Migrations are deployment events. Prefer expand/contract evolution:

1. add backward-compatible schema;
2. deploy code that can use both shapes;
3. backfill safely;
4. switch reads/writes;
5. remove old schema later.

## Error handling

Map database constraint violations to domain outcomes deliberately. Do not leak raw SQL, credentials, or schema internals in API responses.
