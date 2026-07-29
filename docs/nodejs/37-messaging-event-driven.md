---
title: Messaging & Event-Driven Architecture
---

# Messaging & Event-Driven Architecture

Commands request work; events state that something happened. Pub/sub distributes messages. A broker is infrastructure; event-driven architecture is an ownership and contract design.

## Delivery semantics

- **at-most-once:** may lose, avoids redelivery;
- **at-least-once:** may redeliver, requires idempotent consumers;
- **exactly-once:** usually means a scoped guarantee within specific storage/protocol boundaries, not magical globally-once business effects.

## Event contracts

```json
{
  "type": "order.created",
  "version": 2,
  "eventId": "evt_123",
  "occurredAt": "2026-07-30T10:00:00Z",
  "orderId": "o_9"
}
```

Events need stable schemas, ownership, evolution rules, IDs, timestamps, and semantics. Adding an optional field is easier than renaming/removing a field consumed by unknown services.

## Outbox pattern

```text
DB transaction
 ├─ business state
 └─ outbox record
       ↓ publisher
     broker
```

This avoids the classic dual-write gap where the DB commits but event publishing fails (or vice versa). Consumers still need idempotency.

## Replay

Replay is powerful only if handlers can distinguish historical reprocessing from unsafe duplicate external side effects. Version old event shapes or migrate during consumption.

## Ordering

Global total order is expensive and often unnecessary. Define the smallest ordering scope the domain needs, usually per aggregate/entity/partition key.
