---
title: Cache Components & Rendering Model Migration
sidebar_position: 5
description: Migrate legacy caching, dynamic rendering, PPR and route-segment assumptions to the current Cache Components model without changing freshness or authorization accidentally.
---

# Cache Components & Rendering Model Migration

Caching migrations are among the most dangerous Next.js upgrades because they can appear successful while serving stale or cross-user data.

The modern target is a mental model based on:

```text
cache identity
+ cache lifetime
+ invalidation ownership
+ request-time boundaries
+ Suspense/static shell composition
```

not old route-wide “static vs dynamic” folklore.

## 1. Inventory the old model

Search for:

```text
force-static
force-dynamic
revalidate route config
fetch cache overrides
unstable_cache
experimental_ppr
dynamicIO/useCache-era flags
manual no-store wrappers
custom ISR assumptions
```

Classify each by the behavior it was trying to achieve.

## 2. Remove old standalone PPR flags

Current Cache Components owns the partial-prerendering/static-shell model.

Old `experimental_ppr` route config and historical dynamicIO/useCache experiments belong to migration history, not the stable target.

Use the official codemod where applicable, then validate rendering behavior.

## 3. Enable Cache Components intentionally

With current stable configuration, Cache Components is an opt-in model.

Do not enable it across a large application and assume all routes keep the same behavior.

Prefer a migration plan with representative routes and explicit freshness tests.

## 4. Reframe the route

Instead of asking:

```text
Is this page static or dynamic?
```

ask:

```text
Which work can be prerendered?
Which work is cached?
Which work needs request context?
Where does Suspense isolate request-time work?
```

That model scales much better.

## 5. Move reusable cached work into explicit cache boundaries

Current APIs include:

```text
'use cache'
cacheLife
cacheTag
```

A cached function/component should have a deliberate identity and freshness contract.

Do not cache merely because data is expensive.

## 6. Design cache keys around authorization

If output depends on:

```text
tenant
user role
locale
feature entitlement
query parameters
```

those dimensions must be represented in the safe cache/data contract.

Never migrate from request-scoped reads to a shared cache without redoing the threat model.

## 7. Choose invalidation semantics deliberately

Current stable APIs include:

```text
revalidateTag
updateTag
revalidatePath
refresh
```

They are not interchangeable.

Document for each mutation:

```text
what becomes stale?
who owns invalidation?
should readers see stale-while-revalidate or immediate expiry?
which route/client state must refresh?
```

## 8. Do not confuse React `cache()` with persistent Next caches

React `cache()` helps deduplicate work within the relevant server render/cache lifetime.

It is not a distributed application cache and not a replacement for cache tags/lifetimes.

A migration that swaps one for the other changes semantics.

## 9. Request APIs create request-time ownership

Reads involving `cookies`, `headers`, authentication context, or other request-owned values must remain request-aware.

Do not force them into a global shared cache just to restore a static build.

## 10. `connection()` is an explicit request-time boundary

Use it when the route intentionally needs request-time execution without relying on a specific dynamic API as a side effect.

Do not use it as a generic “make build pass” escape hatch.

## 11. Suspense placement becomes architecture

With static shells and request-time holes, a Suspense boundary decides:

```text
what can appear early
what can stream later
what failure affects
what request dependency blocks
```

Migration review should inspect UX, not only build output.

## 12. Re-check `fetch` assumptions

Legacy versions had different default/caching expectations for server `fetch` and Route Handler GET behavior.

Do not carry old defaults forward from memory.

Make cache intent explicit where correctness depends on it.

## 13. Route Handler GET caching

Current Route Handlers should be treated according to the current App Router caching model, not old “GET means cached by default” assumptions.

Regression tests should cover response freshness directly.

## 14. Router Cache is separate

A server cache invalidation and the browser’s Router Cache are different layers.

After migration, test:

```text
hard reload
soft navigation
router.refresh()
back/forward
prefetched route
post-mutation navigation
```

A stale UI may be a client navigation cache issue rather than a server cache issue.

## 15. Multi-instance deployments need shared semantics

If multiple application replicas serve traffic, process-local cache state is not enough for coordinated invalidation.

Phase 17 covers `cacheHandler`, Cache Components `cacheHandlers`, and distributed invalidation.

During migration, verify the production topology rather than testing one local process only.

## 16. Tag naming is an API

Treat cache tags like stable internal contracts.

Prefer semantic patterns:

```text
project:{id}
tenant:{tenantId}:projects
user:{userId}:profile
```

Avoid arbitrary strings copied across unrelated modules.

## 17. Prevent stampedes

A migration that changes hit rate can create sudden origin load.

Observe:

```text
cache hit/miss ratio
DB QPS
upstream QPS
p95/p99 latency
connection pool wait
```

Roll out gradually when changing high-traffic cache policy.

## 18. Test stale/fresh scenarios

For each important cached capability, cover:

```text
first miss
subsequent hit
expiry
revalidation
mutation invalidation
unauthorized caller
cross-tenant caller
cache backend failure
```

## 19. Build-output migration evidence

Inspect `next build` output and route behavior, but do not couple deployment automation to private `.next` manifest schemas.

Use public output/config and runtime tests as the contract.

## 20. Migration sequence

A low-risk sequence is:

```text
1. inventory old cache flags
2. remove obsolete experiments
3. establish freshness/security tests
4. enable modern cache model
5. migrate one route class
6. measure hit rate + origin load
7. expand gradually
8. remove compatibility code
```

## 21. Rollback safety

Version cache schemas/tag conventions if old and new deployments may coexist.

A rollback must not consume incompatible cached representations silently.

## Cache migration review

- [ ] every cached result has an owner and identity
- [ ] authorization/tenant dimensions are safe
- [ ] old experimental flags are removed
- [ ] invalidation semantics are explicit
- [ ] request-time work is not forced into shared cache
- [ ] Router Cache scenarios are tested
- [ ] multi-instance behavior is verified
- [ ] origin capacity is monitored during rollout
- [ ] rollback handles cache compatibility

Caching is correctness infrastructure first and a performance optimization second.