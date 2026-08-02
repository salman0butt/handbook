---
title: Caching and Distributed Cache Design
description: Caching stores reusable results closer to consumers but introduces staleness, invalidation, stampede, serialization, tenancy, and failure trade-offs.
---

# Caching and Distributed Cache Design

## Concept

Caching stores reusable results closer to consumers but introduces staleness, invalidation, stampede, serialization, tenancy, and failure trade-offs.

## Why It Exists

A cache improves performance only when hit rate and saved work exceed coordination and correctness cost.

## Mental Model

```mermaid
flowchart LR
  A["Request"]
  B["Cache lookup"]
  C["Source of truth"]
  D["Populate with policy"]
  A --> B
  B --> C
  C --> D
```

Treat every arrow as a boundary with a cost, ownership rule, cancellation behavior, and failure mode. Node.js is effective when those boundaries are explicit instead of hidden behind framework defaults.

## How It Works

The JavaScript callback runs on the main JavaScript thread. Native Node.js bindings, libuv, the operating system, worker threads, child processes, or remote services may perform work elsewhere. Completion only becomes useful when control returns to JavaScript. Under load, the important questions are what is queued, what is bounded, what can be cancelled, and which resource saturates first.

## Example

```ts
type Cache = {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds: number): Promise<void>;
};

async function cacheAside<T>(cache: Cache, key: string, load: () => Promise<T>): Promise<T> {
  const cached = await cache.get(key);
  if (cached !== null) return JSON.parse(cached) as T;
  const value = await load();
  await cache.set(key, JSON.stringify(value), 60);
  return value;
}
```

The example is intentionally small enough to execute, but the production boundary is the important part: validate inputs, establish a deadline, propagate cancellation, classify failures, and release resources deterministically.

## Production Use

Use cache-aside with explicit TTLs, versioned keys, tenant/user scope, request coalescing, negative caching where safe, and graceful cache failure.

## Security

Never share authorization-sensitive data under incomplete keys. Encrypt or avoid sensitive cached values and limit administrative access.

## Performance

Measure hit rate, miss cost, latency, memory, eviction, stampede, serialization, and stale-serving impact.

## Common Mistakes

- Using cache as the source of truth.
- Deleting one key and calling invalidation solved.
- Caching errors or empty results indefinitely.

## Debugging

Record cache outcome, key namespace, age, source duration, eviction, and Redis failure without logging sensitive key contents.

## Testing

Test concurrent misses, stale reads, invalidation, cache outage, corrupted values, tenant isolation, and TTL boundaries.

## When Not to Use It

Do not cache low-cost, low-frequency, or correctness-critical data without a clear consistency policy.

## Interview Questions

- Why is cache invalidation hard?
- How do you prevent stampedes?
- What belongs in a cache key?

## Official References

- [nodejs.org](https://nodejs.org/api/)
- [nodejs.org](https://nodejs.org/en/about/previous-releases)
