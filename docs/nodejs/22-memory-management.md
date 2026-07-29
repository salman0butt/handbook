---
title: Memory Management
---

# Memory Management

Node memory is more than the V8 JavaScript heap.

```text
process RSS
 ├─ V8 heap
 │   ├─ young-generation objects
 │   └─ older retained objects
 ├─ code / runtime structures
 ├─ native allocations
 ├─ Buffer / ArrayBuffer external memory
 └─ stacks and mapped regions
```

```js
console.log(process.memoryUsage());
```

Track at least RSS, heap used/total, and external/array-buffer memory where relevant.

## Garbage collection mental model

V8 allocates objects and periodically finds memory no longer reachable. Generational strategies optimize for the observation that many objects die young. Exact internal algorithms evolve; treat GC internals as implementation details, not contracts.

## Leak vs high allocation rate

A leak means objects remain reachable when the application no longer needs them. High allocation pressure can create heavy GC without a leak. Heap growth can also be normal during warmup/caching.

Common retainers:

- unbounded maps/caches;
- listeners never removed;
- unresolved operations/queues;
- closures retaining large graphs;
- request objects stored globally;
- buffers held after processing;
- accidental singleton state.

## Heap snapshots

Compare snapshots around a reproducible growth interval and inspect retaining paths. The question is **why is this object still reachable?** not merely “which class is largest?”

## OOM

Memory limits can come from V8 heap limits, container/cgroup limits, or system pressure. Increasing heap size can delay a leak and make recovery slower. Fix ownership and bound queues/caches first.

## Production tuning

Measure memory per request/job, queue depth, buffer sizes, cache cardinality, GC behavior, and container headroom. Capacity planning needs RSS, not only JavaScript heap.
