---
title: Memory, Garbage Collection, Profiling and Capacity
description: Node memory includes V8 heap, external Buffer memory, native allocations, stacks, code, and operating-system resources.
---

# Memory, Garbage Collection, Profiling and Capacity

## Concept

Node memory includes V8 heap, external Buffer memory, native allocations, stacks, code, and operating-system resources.

## Why It Exists

Leaks, unbounded caches, queued Promises, large JSON, Buffers, and retained closures can exhaust a container even when heap charts look acceptable.

## Mental Model

```mermaid
flowchart LR
  A["Allocation"]
  B["Reachability and retention"]
  C["GC or external lifetime"]
  D["RSS and capacity"]
  A --> B
  B --> C
  C --> D
```

Treat every arrow as a boundary with a cost, ownership rule, cancellation behavior, and failure mode. Node.js is effective when those boundaries are explicit instead of hidden behind framework defaults.

## How It Works

The JavaScript callback runs on the main JavaScript thread. Native Node.js bindings, libuv, the operating system, worker threads, child processes, or remote services may perform work elsewhere. Completion only becomes useful when control returns to JavaScript. Under load, the important questions are what is queued, what is bounded, what can be cancelled, and which resource saturates first.

## Example

```js
import process from 'node:process';

setInterval(() => {
  const memory = process.memoryUsage();
  console.log({
    rssMB: Math.round(memory.rss / 1024 / 1024),
    heapMB: Math.round(memory.heapUsed / 1024 / 1024),
    externalMB: Math.round(memory.external / 1024 / 1024),
  });
}, 5_000).unref();
```

The example is intentionally small enough to execute, but the production boundary is the important part: validate inputs, establish a deadline, propagate cancellation, classify failures, and release resources deterministically.

## Production Use

Set container limits with headroom, monitor RSS and heap, use heap snapshots and allocation profiles, bound caches/queues, stream large payloads, and capacity-test failure conditions.

## Security

Memory exhaustion is a denial-of-service risk. Bound input size, decompression, cardinality, queues, and per-tenant consumption.

## Performance

More heap can reduce GC frequency but increase pause and container footprint. Capacity planning must include replicas, pools, workers, and peak concurrency.

## Common Mistakes

- Looking only at heapUsed.
- Taking unlimited heap as a leak fix.
- Keeping every request object in a diagnostic map.

## Debugging

Compare snapshots by retained size and dominator paths, inspect external memory, GC, queue depth, and allocation rate.

## Testing

Run soak tests with realistic churn, aborts, failures, and traffic shape; assert memory returns to a stable range.

## When Not to Use It

Do not take production heap snapshots without security and memory-impact planning.

## Interview Questions

- RSS vs heapUsed?
- How do Buffers appear in memory metrics?
- How do you prove a memory leak?

## Official References

- [nodejs.org](https://nodejs.org/api/)
- [nodejs.org](https://nodejs.org/en/about/previous-releases)
