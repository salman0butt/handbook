---
title: Performance
---

# Performance

Performance engineering is bottleneck engineering. Optimize the resource constraining the user-visible objective.

## Metrics

- latency: include p50/p95/p99, not only averages;
- throughput: completed useful work per unit time;
- saturation: queue/pool/CPU/resource utilization;
- errors/timeouts: overloaded systems often fail before they look “100% CPU.”

## Common bottlenecks

```text
request latency
 ├─ JS CPU / event-loop blocking
 ├─ GC / allocation pressure
 ├─ libuv worker-pool queue
 ├─ DNS/connect/TLS
 ├─ DB pool + query
 ├─ remote API
 ├─ serialization/compression
 └─ internal queue/backpressure
```

## Measure first

Load the production-like path, capture baseline, change one meaningful variable, compare. Microbenchmarks are useful for isolated questions but can mislead architecture decisions.

## Event-loop blocking

Move expensive JS computation to a worker pool/process or change the algorithm. Async wrappers around synchronous CPU code do not make it nonblocking.

## Pool sizing

DB pools, HTTP connection pools, worker pools, queue concurrency, and libuv pool capacity interact. Oversizing every pool amplifies contention downstream.

## Backpressure

Bound buffers/queues so overload becomes waiting/rejection rather than memory explosion.

## Caching and batching

Cache stable expensive results with explicit invalidation/failure policy. Batch calls when it reduces round trips without creating huge latency windows or oversized payloads.

## Compression

Compression saves bandwidth at CPU cost. Measure payload sizes, CPU, latency, proxy/CDN behavior, and whether compression is already handled upstream.

## Flamegraphs

A flamegraph visualizes sampled stack time. Wide frames are expensive relative to sample time; validate that they correspond to the bottleneck affecting end users.
