---
title: Redis & Caching
---

# Redis & Caching

Redis is often used for cache, rate limits, sessions, coordination, pub/sub, and stream-like messaging. Each use has different durability and failure semantics.

## Cache-aside

```text
request
  ↓
cache lookup ─ hit → return
  │ miss
  ↓
source of truth
  ↓
cache result with TTL
  ↓
return
```

Caching trades freshness/complexity for latency and load reduction.

## Invalidation

Every cache key needs answers to: who owns it, how is it versioned, when does it expire, how is it invalidated, what stale data is acceptable, and what happens when Redis is down?

## Stampede

When a popular key expires, many replicas may recompute simultaneously. Options include jittered TTL, request coalescing, stale-while-revalidate, bounded locks/leases, or prewarming. Distributed locks require careful ownership/expiry/fencing reasoning; do not treat `SET NX` as a universal mutex.

## Sessions

External sessions enable stateless application replicas but make Redis availability/security part of authentication. Use secure session IDs, TTL/revocation, and appropriate persistence/replication.

## Pub/sub

Basic pub/sub is ephemeral: offline subscribers can miss messages. Use durable queue/stream/broker semantics when delivery/replay matters.

## Failure strategy

Decide per feature whether Redis failure should fail closed, fail open, fall back, or degrade. A cache outage should not automatically become a database stampede.
