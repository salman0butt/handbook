---
title: Backend Runtime, Database, Memory & Capacity Performance
description: Optimize server latency and throughput across databases, upstream APIs, connection pools, memory, cold starts, concurrency, and capacity limits.
---

# Backend Runtime, Database, Memory & Capacity Performance

A Next.js application is only as fast as the slowest required dependency on its critical path.

## Latency and throughput are different

```text
latency → how long one operation takes
throughput → how many operations the system can complete over time
```

An optimization that improves one request can reduce system capacity if it multiplies concurrency or memory.

## Tail latency matters

p50 can look healthy while p95/p99 users suffer.

Measure:

```text
p50
p75
p95
p99
error rate
timeout rate
```

Segment by route, dependency, region, release, and cache state where useful.

## Database critical path

Investigate:

- query duration
- query count
- rows scanned/returned
- index usage
- connection wait
- lock contention
- transaction duration
- cross-region calls

N+1 is both latency and capacity debt.

## Connection pools are finite

Server concurrency can exceed database capacity.

```text
many requests
→ each launches many parallel queries
→ pool fills
→ requests wait for connection
→ p95 rises
```

Bound fan-out and tune pool/deployment architecture together.

## Reduce result size

Fetch only fields needed for the UI/DAL contract.

Benefits:

```text
less DB work
less network transfer
less server memory
less serialization
smaller RSC/client props
```

## Upstream APIs

For external APIs measure separately:

```text
DNS/connect
TTFB
body transfer
retries
rate-limit waits
provider errors
```

Set timeouts according to user-journey value.

## Retry budgets

Retries can improve transient reliability but amplify load.

A safe retry policy considers:

- idempotency
- maximum attempts
- backoff/jitter
- overall request deadline
- upstream status
- retry-after signals

Never create an infinite retry path inside a user request.

## Circuit/failure degradation

For optional dependencies, consider degraded UI instead of blocking the whole page.

```text
core account data → required
recommendations → optional
analytics write → post-response
```

Classify dependencies by product importance.

## CPU-bound server work

Examples:

- image transforms outside optimized service
- large JSON parsing
- PDF generation
- cryptographic work
- syntax/content processing

Measure CPU and event-loop impact. Move durable/heavy jobs out of request paths where appropriate.

## Memory

Server memory pressure can increase latency and trigger process restarts.

Watch for:

```text
large module initialization
unbounded in-memory caches
large query results
buffered uploads
retained request objects
telemetry queues
```

Process-local cache is not a free distributed cache.

## Cold starts

Cold startup can include:

```text
runtime boot
module graph load
telemetry registration
SDK initialization
connection creation
```

Large server dependencies and synchronous startup work can increase cold latency.

Measure on the actual hosting model; local long-lived Node behavior may not represent serverless/container scaling.

## Runtime choice is architectural

Different deployment runtimes have different compatibility, startup, memory, and platform characteristics.

Do not choose a runtime from a generic benchmark. Use dependencies, region needs, connection model, and production evidence.

## Request body size and buffering

Large uploads can consume memory and bandwidth before application logic runs.

Prefer direct object-storage upload patterns for large media when appropriate, with bounded signed capabilities and validation.

## Backpressure

When downstream capacity is exhausted, accepting unlimited work makes latency and failure worse.

Backpressure mechanisms include:

```text
concurrency limits
queues
rate limits
bounded pools
load shedding
timeouts
```

Phase 17 covers deployment mechanics; here the key lesson is that capacity is a performance boundary.

## Cache stampedes

Many concurrent misses for the same expensive key can all recompute at once.

Potential mitigations depend on cache infrastructure:

- stale-while-revalidate
- request coalescing
- locking/single-flight
- jittered expiry

Preserve correctness and failure behavior.

## Region placement

A user close to the frontend but far from the database can still see poor TTFB.

Model the whole path:

```text
user → edge/CDN → app runtime → database/upstream
```

Moving one layer may not improve the longest leg.

## Server performance review

- critical dependencies identified
- p95/p99 measured
- query count bounded
- indexes reviewed
- pool wait measured
- upstream deadlines defined
- retries bounded
- optional dependencies degraded safely
- large bodies avoided/bounded
- memory growth monitored
- cold/warm behavior compared
- capacity/load tests planned

## Interview questions

### Why can parallelizing database queries hurt p95?

Because it increases simultaneous connection demand. Under load, pool contention can outweigh the single-request latency improvement.

### Why is p50 insufficient?

It describes the typical request but hides tail behavior. Production incidents often appear first in p95/p99 due to contention, cache misses, cold starts, or slow dependencies.

## Exercise

For one server route, document its resource budget:

1. DB queries
2. upstream calls
3. maximum concurrency
4. timeout budget
5. memory-heavy operations
6. cold-start dependencies
7. degraded-mode behavior
