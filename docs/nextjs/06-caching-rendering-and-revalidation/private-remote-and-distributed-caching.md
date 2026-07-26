---
title: Private, Remote & Distributed Caching
description: Distinguish normal, private, and remote use-cache modes and design cache storage for serverless, multi-instance, and self-hosted deployments.
---

# Private, Remote & Distributed Caching

A cache policy is not complete until you know **where the entry lives**.

The same application code can behave differently on:

```text
one long-lived Node process
multiple containers
serverless instances
platform-provided distributed cache
```

Next.js 16.2 exposes different `use cache` modes and cache handlers for these deployment realities.

## Normal `use cache`

```ts
async function getCatalog() {
  'use cache'
  return db.product.findMany()
}
```

Normal `use cache` uses the default Cache Components handler.

Without custom handlers, runtime behavior commonly uses process-local in-memory storage.

That means:

```text
single long-lived process
  → good reuse across requests

multiple processes
  → each process has independent entries

serverless
  → instance reuse may be limited/unpredictable
```

Do not assume process memory is globally shared.

## `'use cache: remote'`

Remote caching is designed for persistent/shared cache storage through a remote cache handler.

```ts
export async function getPricing(currency: string) {
  'use cache: remote'
  return pricingService.list(currency)
}
```

The goal is cross-instance reuse when local process memory is insufficient.

Potential backing stores include platform-specific or custom distributed stores such as key-value systems.

## Remote cache trade-off

Remote cache is not “better cache.”

It adds a network boundary:

```text
request
  ↓
remote cache lookup
  ↓
hit or compute
```

That means additional considerations:

- lookup latency
- provider cost
- availability
- serialization size
- distributed invalidation
- consistency
- operational ownership

Use it when shared reuse saves more than the remote lookup costs.

## When remote caching makes sense

Examples:

- expensive CMS transformation shared across serverless instances
- high-cost database aggregation reused frequently
- multi-region/multi-instance application requiring shared entries
- computed public data with high cache hit ratio

## When to avoid remote caching

Examples:

- cheap function that is faster than network cache lookup
- high-cardinality per-user entries with little reuse
- highly volatile real-time data
- sensitive results with unclear storage/compliance policy

Cache architecture is economic as well as technical.

## `'use cache: private'` is experimental

Current Next.js 16.2 documents:

```ts
'use cache: private'
```

as **experimental and not recommended for production**.

It exists for functions that access request APIs such as cookies, headers, or search params while using browser-memory caching behavior.

Important characteristics:

- can access selected runtime request APIs
- results are not persisted on the server
- cache lives in browser memory
- does not survive page reloads
- cannot use custom cache handlers
- unavailable in Route Handlers
- depends on runtime prefetching work that is not yet stable

Therefore this handbook treats it as an advanced preview, not the normal solution for personalization.

## Prefer explicit arguments over private cache

Instead of:

```ts
async function getRecommendations() {
  'use cache: private'
  const cookieStore = await cookies()
  // ...
}
```

prefer, where practical:

```text
read cookie outside
  ↓
normalize preference
  ↓
pass preference as argument
  ↓
normal shared cache if output is safely shareable
```

Example:

```ts
async function getRecommendations(segment: string) {
  'use cache'
  return recommendationService.forSegment(segment)
}
```

This is easier to audit and can create meaningful reuse.

## Private cache does not make authorization safe

Even if data is not stored server-side, request values still need validation and authorization.

Never use private cache semantics as a substitute for access control.

## Cache handlers

Next.js supports custom cache handlers.

Conceptually:

```ts
const nextConfig = {
  cacheHandlers: {
    default: require.resolve('./cache/default.js'),
    remote: require.resolve('./cache/remote.js'),
  },
}
```

The default handler serves normal `use cache`.

The remote handler serves `'use cache: remote'`.

Custom named handlers may also be configured for specialized use cases.

## Why custom handlers exist

A multi-instance deployment may need:

```text
instance A ─┐
instance B ─┼→ shared cache store
instance C ─┘
```

Without shared storage:

```text
A has entry
B misses
C misses
```

This can create unnecessary database load and inconsistent freshness timing.

## Distributed invalidation

Distributed caching requires distributed tag state.

If one instance invalidates:

```text
product:p_42
```

other instances need to observe that invalidation.

A correct handler must support the Next.js cache-handler contract for entries, tags, refresh synchronization, expiration, and invalidation semantics.

Do not implement a Redis `GET/SET` wrapper and assume that is the whole cache contract.

## Self-hosted process cache

A long-lived Node/Docker process can reuse an in-memory cache across requests.

But:

```text
restart
  → cache lost

new replica
  → cold cache

rolling deploy
  → mixed warm/cold instances
```

This may be perfectly acceptable if cache is an optimization and source systems can tolerate misses.

## Cache stampede

When a popular entry expires across many instances:

```text
100 requests
  ↓
100 misses
  ↓
100 expensive database calls
```

This is a cache stampede.

Production design may need:

- stale-while-revalidate
- lock/single-flight behavior
- jittered expiration
- upstream rate limits
- queue/background refresh
- request coalescing

Framework caching helps, but distributed topology still matters.

## Multi-region caching

Global systems introduce another question:

> Is the cache globally shared or region-local?

A region-local cache can improve latency but create temporary cross-region inconsistency.

A global remote cache can improve consistency but add network distance.

Model product requirements explicitly.

## Tenant isolation

Distributed caches magnify key mistakes.

Wrong conceptual key:

```text
settings
```

for tenant-private settings.

Better:

```text
tenant:t_42:settings
```

But key naming alone is not authorization. The caller must still prove access to tenant `t_42` before retrieving or returning private data.

## Compliance and sensitive data

Before persisting private data in a remote cache, ask:

- what fields are stored?
- in which region?
- for how long?
- is data encrypted at rest/in transit?
- who operates the store?
- can support/admin staff access it?
- what deletion obligations exist?

A cache is data storage.

Treat it with the same privacy review as other stores.

## Cache size and cardinality

A distributed store can hide poor cache design until the bill grows.

Measure:

```text
entry count
entry size
hit ratio
miss ratio
eviction rate
remote latency
origin calls saved
cost per hit
```

Caching a million one-time user-specific values may be worse than computing them.

## Remote cache failure modes

If the remote cache is unavailable, decide whether your system:

```text
fails closed
falls back to origin
uses local cache
serves stale data
```

The correct policy depends on data sensitivity and business continuity.

For public catalog data, origin fallback may be fine.

For authorization data, stale fallback may be dangerous.

## CDN is another layer

Do not confuse `use cache: remote` with CDN response caching.

```text
server function cache
  ≠
HTTP response cache at edge/CDN
```

A CDN caches responses according to HTTP/platform behavior. Cache Components stores reusable server computation/output according to Next.js cache semantics.

Both can exist simultaneously.

## Production review checklist

For every remote/shared cache:

- [ ] result is safe to store
- [ ] key includes required scope
- [ ] cardinality is understood
- [ ] hit ratio justifies remote lookup
- [ ] invalidation works across instances
- [ ] TTL/profile matches business freshness
- [ ] outage fallback is defined
- [ ] data residency/compliance reviewed
- [ ] metrics exist
- [ ] source can absorb cold-cache events

## Interview questions

**Why can normal `use cache` behave differently in serverless and self-hosted environments?**  
Default runtime caching is process-local; long-lived processes can reuse it across requests while serverless requests may land on different instances.

**When should you use `'use cache: remote'`?**  
When expensive shareable work benefits from a persistent/shared cache across instances and the network/cost trade-off is justified.

**Is `'use cache: private'` stable for production?**  
No. In current 16.2 docs it is experimental and depends on unstable runtime-prefetching behavior.

**Why is a remote cache a security boundary?**  
Because it stores data outside the rendering process, potentially across users, instances, regions, and longer lifetimes.

## Exercise

Design caching for a three-region SaaS deployment.

Classify:

```text
public pricing
public documentation
tenant catalog
user notifications
permission checks
analytics aggregate
```

Choose local cache, remote cache, dynamic computation, or no caching, and justify consistency, privacy, invalidation, hit ratio, and failure behavior.
