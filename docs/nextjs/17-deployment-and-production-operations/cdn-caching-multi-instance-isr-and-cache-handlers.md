---
title: CDN, Multi-Instance Caching, ISR & Cache Handlers
sidebar_position: 5
description: Operate Next.js caching across replicas and CDNs with correct cache layers, shared invalidation, ISR coordination, Cache Components storage, and tenant-safe production policies.
---

# CDN, Multi-Instance Caching, ISR & Cache Handlers

Caching becomes an operations problem the moment more than one process can answer the same route.

A production request may encounter several independent caches:

```text
browser cache
  ↓
CDN / reverse-proxy cache
  ↓
Next.js server response / ISR cache
  ↓
Cache Components cache
  ↓
application / database cache
```

Do not treat these as one cache.

## 1. Start by naming the layer

When someone says “the cache is stale,” ask:

```text
which cache?
what key?
which instance?
what invalidation event?
what freshness contract?
```

Without those answers, cache debugging becomes guesswork.

## 2. Immutable assets

Hashed client assets can be cached for a long time because their filename changes when content changes.

Examples include build-generated JS/CSS under `/_next/static`.

The operational requirement is availability across rolling deployments: an old browser may still request an old hashed asset while the new deployment is active.

Do not purge old immutable assets prematurely.

## 3. Dynamic personalized output

Output that depends on request-time identity, cookies, headers, or private data must not be accidentally stored as public shared HTML.

CDNs/proxies should respect Next.js response cache semantics.

Never override `private`/`no-store` behaviour globally with a broad “cache everything” rule.

## 4. CDN cache keys must preserve variants

Client navigation/RSC requests can differ from document requests.

A CDN that collapses distinct request variants into one cache key can serve the wrong representation.

Review:

- headers used by Next.js routing/navigation
- query parameters
- host/tenant mapping
- locale
- content encoding
- authenticated/public split

Do not invent cache-key simplification without validating the framework contract.

## 5. Single-instance server cache

A single long-lived `next start` instance can use local memory/disk cache successfully for many workloads.

That is the simplest topology:

```text
all requests
→ one cache owner
```

The moment replicas scale horizontally, local cache state diverges.

## 6. Multi-instance divergence

```text
request 1 → pod A → cache value X
request 2 → pod B → cache value Y
```

A mutation may invalidate A while B still serves old state.

Possible consequences:

- stale content
- stale pricing
- stale feature/config data
- stale permission-derived output

The severity depends on the domain contract.

## 7. `cacheHandler` and `cacheHandlers` are different

Current Next.js distinguishes two production cache integration surfaces.

### `cacheHandler` — singular

Used for the Next.js server cache, including server response/ISR-style storage and revalidation behaviour.

Example configuration shape:

```js
module.exports = {
  cacheHandler: require.resolve('./cache-handler.js'),
  cacheMaxMemorySize: 0,
}
```

Use shared durable storage when multiple instances need one coordinated server cache.

### `cacheHandlers` — plural

Used by Cache Components directives such as:

```text
'use cache'
'use cache: remote'
```

Example shape:

```ts
const nextConfig = {
  cacheHandlers: {
    default: require.resolve('./cache-handlers/default.js'),
    remote: require.resolve('./cache-handlers/remote.js'),
  },
}
```

Do not configure one and assume it changes the other layer.

## 8. Default cache locality

Current documentation notes that default cache implementations are local to the process/runtime.

With multiple containers:

```text
pod A memory/cache
pod B memory/cache
pod C memory/cache
```

They do not magically become one distributed cache.

## 9. Shared cache backend

Possible storage choices include:

- Redis-compatible store
- durable key-value store
- database
- object storage for suitable payloads
- custom internal cache service

The backend must support your required semantics, not merely key/value persistence.

Consider:

- tag invalidation
- TTL
- atomicity
- size limits
- latency
- eviction
- regional consistency
- availability/failure policy

## 10. Disabling process memory cache

When a custom shared `cacheHandler` is authoritative, current guidance shows `cacheMaxMemorySize: 0` as a way to disable the default in-memory cache.

Why might this matter?

```text
shared store invalidated
but process-local layer still has stale copy
```

The exact architecture depends on the handler implementation; do not stack caches accidentally.

## 11. Tag invalidation across replicas

Calling `revalidateTag()` on one instance does not automatically mean every independent local cache knows about it.

Current self-hosting guidance highlights tag coordination across instances.

A distributed design needs:

```text
mutation
→ shared invalidation/tag state
→ all instances observe invalidation
→ stale entry no longer served
```

If the custom handler uses a coordination hook such as `refreshTags()`, its implementation becomes part of correctness.

## 12. `revalidatePath()` and shared cache

`revalidatePath()` ultimately interacts with cache/tag invalidation infrastructure.

Production question:

> Does the path invalidation reach every instance that might serve that route?

A test passing on one local process does not prove this.

## 13. Cache invalidation and security

Authorization-sensitive data needs stricter handling.

Example:

```text
user loses admin role
but cached admin response remains reusable
```

Security rule:

- server authorization must run at secure boundaries
- cache keys must include all relevant authorization dimensions
- permission changes may require invalidation or short freshness windows

Do not rely on UI refresh to revoke server access.

## 14. Tenant-safe keys

For multi-tenant cached data, keys often need tenant scope.

Bad conceptual key:

```text
project:123
```

Safer conceptual identity:

```text
tenant:A:project:123
```

The real key design depends on the DAL/cache API, but tenant isolation must be explicit.

## 15. Cache stampedes

Shared cache introduces another failure mode:

```text
popular key expires
→ 1,000 replicas/requests miss
→ all recompute
→ DB/upstream overload
```

Possible mitigations:

- stale-while-revalidate
- locking/single-flight
- jittered expiry
- bounded regeneration concurrency
- degraded fallback

Measure miss-path capacity, not only hit-path latency.

## 16. CDN plus ISR

A CDN can cache public output in front of Next.js, while Next.js also has its own regeneration/cache state.

That creates two freshness clocks.

Document:

```text
Next.js revalidate time
CDN TTL
CDN stale policy
purge/invalidation path
```

If the CDN caches longer than the server's freshness contract without purge coordination, users can still receive stale content after Next.js regenerates it.

## 17. Cache-Control ownership

Prefer framework-generated cache headers unless you have a deliberate reason to override them.

Broad custom headers can break dynamic-route privacy or regeneration semantics.

Review custom `headers()` rules against:

- static assets
- HTML documents
- Route Handler responses
- RSC/navigation responses
- authenticated routes

## 18. `assetPrefix`

Static JS/CSS assets can be served from a separate asset host/CDN using `assetPrefix`.

Trade-offs include:

- CDN specialization
- independent asset deployment
- additional DNS/TLS origin cost
- CORS/security policy
- version availability

Do not confuse asset hosting with application HTML caching.

## 19. Image optimization cache

`next/image` runtime optimization has its own cache/TTL behaviour.

Self-hosted operations must consider:

- optimizer storage
- memory
- TTL
- source availability
- multi-instance duplication
- external image service alternative

Images are not stored in the same conceptual layer as Server Component output.

## 20. Cache backend failure policy

If the shared cache is unavailable, decide intentionally:

### Fail open to source

```text
cache unavailable
→ query DB/upstream
```

Risk: thundering herd/capacity overload.

### Fail closed/degraded

```text
cache unavailable
→ controlled error/degraded response
```

Risk: availability impact.

Different data may require different policies.

## 21. Regional cache topology

A globally deployed app may use:

- one global shared cache
- per-region caches
- replicated key/value service
- region-local cache + invalidation bus

Trade-offs:

```text
latency
consistency
cost
failure blast radius
```

Do not claim “global cache” without defining consistency semantics.

## 22. Deployment and cache namespaces

During schema/content changes, old and new deployments may interpret cached payloads differently.

Options include:

- deployment-aware cache namespace
- schema version in key
- backwards-compatible serialization
- purge on incompatible rollout

Avoid silently reading old cache payloads with a new incompatible decoder.

## 23. Observability

Measure per layer:

```text
hit rate
miss rate
stale serve rate
revalidation count
revalidation latency
cache backend latency
cache errors
evictions
payload size
origin load after miss
```

Segment by route/key family and release.

## 24. Production incident workflow

For stale data:

```text
identify user-visible value
  ↓
identify source of truth
  ↓
trace all cache layers
  ↓
inspect key/tenant/version
  ↓
inspect invalidation event
  ↓
inspect replica/backend propagation
  ↓
fix + add regression/observability
```

Do not start by purging everything unless incident severity requires it.

## Production checklist

- [ ] browser/CDN/server/Cache Components/application caches mapped separately
- [ ] dynamic/private output cannot become shared public cache
- [ ] CDN cache keys preserve required variants
- [ ] multi-instance server cache strategy documented
- [ ] `cacheHandler` vs `cacheHandlers` ownership understood
- [ ] tag/path invalidation reaches all relevant replicas
- [ ] tenant and authorization dimensions included correctly
- [ ] miss-path capacity tested
- [ ] cache backend failure policy defined
- [ ] deployment/schema version compatibility considered
- [ ] cache metrics and incident runbook exist

## Interview questions

### Why can revalidation work locally but appear broken in Kubernetes?

Because local testing has one cache owner, while Kubernetes may have many pods with independent local cache state. Invalidating one instance does not guarantee the others know about it unless the cache/invalidation layer is shared or coordinated.

### What is the difference between `cacheHandler` and `cacheHandlers`?

`cacheHandler` configures the Next.js server cache used for response/ISR-style cache operations, while `cacheHandlers` configures storage used by Cache Components directives such as `'use cache'` and `'use cache: remote'`.

## Exercise

Design a three-replica deployment and document:

1. CDN cache policy
2. Next server cache storage
3. Cache Components storage
4. tag invalidation propagation
5. tenant keying
6. cache namespace/versioning
7. backend outage behaviour
8. hit/miss metrics
9. stale-content incident procedure
