---
title: Cache Security, Debugging & Production Incidents
description: Diagnose stale data, cache leaks, invalidation failures, stampedes, region divergence, and security bugs in production caching systems.
---

# Cache Security, Debugging & Production Incidents

Caching failures are dangerous because the application can look healthy while returning the wrong data.

The worst incidents are often not obvious crashes. They are:

```text
stale data
cross-tenant data
wrong permissions
inconsistent regions
unexpected source load
read-your-own-write failures
```

Treat cache correctness as a production reliability concern.

## Incident taxonomy

### Staleness incident

Users see data older than the product contract allows.

### Isolation incident

One user's or tenant's cached result is visible to another.

### Invalidation incident

A mutation succeeds but relevant cache entries remain reusable.

### Stampede incident

Many requests regenerate the same expensive entry simultaneously.

### Divergence incident

Different instances or regions serve different cache generations.

### Cost incident

Low hit ratio or excessive invalidation causes more compute/network spend than caching saves.

## First rule: identify the layer

Before changing code, classify the stale value:

```text
source database
upstream API cache
React request memoisation
Next.js fetch/Data Cache
use cache entry
client Router Cache
CDN/edge cache
browser HTTP cache
```

Do not run a blanket purge until you know which layer is wrong.

## Stale-data debugging workflow

1. capture the exact URL, tenant, user, and timestamp
2. query the authoritative source
3. compare soft navigation and hard reload
4. compare fresh browser session
5. inspect server cache hit/miss if observable
6. inspect tag/path invalidation logs
7. inspect CDN or proxy headers
8. compare multiple instances/regions
9. reproduce with production build
10. identify the earliest layer where the wrong value appears

## Cross-tenant cache leak

A catastrophic design:

```ts
async function getDashboard() {
  'use cache'
  return db.invoice.findMany({
    where: { tenantId: currentTenantId },
  })
}
```

where `currentTenantId` is not safely represented in cache identity.

The result can become reusable beyond its intended scope.

Safer design:

```text
trusted request tenant
  ↓
authorize membership
  ↓
explicit tenantId argument
  ↓
cache only if tenant-scoped reuse is intended
```

Even then, evaluate whether sensitive tenant data belongs in a persistent/shared cache.

## Cache keys are security boundaries

A cache key determines which requests can share one result.

If the key omits a dimension that changes authorization or content, data can leak.

Potential missing dimensions:

- tenant
- locale
- currency
- plan tier
- feature variant
- permissions
- resource version

Do not add dimensions blindly either; high-cardinality caches may become ineffective or expensive.

## Do not cache authorization as truth carelessly

Permission decisions can change independently from content.

Example:

```text
user removed from organization
  ↓
old permission cache still says allowed
  ↓
protected data returned
```

Authorization caches require especially careful lifetime, invalidation, and revocation semantics.

For many applications, checking authoritative permission state dynamically is simpler and safer.

## Read-your-own-write failure

Symptom:

```text
user edits record
success message appears
redirects to detail page
old value still shown
```

Investigate:

- was `updateTag` used where immediate expiration was required?
- was only `revalidateTag(..., 'max')` used, allowing stale content?
- is the detail page using a different tag?
- is client Router Cache reusing old route data?
- is a CDN/upstream cache still stale?

Consistency requirement determines the API choice.

## Invalidation fan-out

A single mutation may affect multiple views:

```text
product:p42
products
category:lighting
search:index
homepage:featured
```

If you invalidate only the detail entry, list views may remain stale.

The solution is not always “invalidate everything.”

Model affected domains explicitly.

## Cache stampede

When one popular cache entry expires:

```text
thousands of requests
  ↓
all see miss/stale hard-expiry
  ↓
origin overloaded
```

Mitigations can include:

- stale-while-revalidate
- single-flight/coalescing
- staggered expiration
- background refresh
- rate limiting
- upstream capacity planning

`revalidateTag(..., 'max')` can be preferable to immediate hard expiration for public high-traffic data when slight staleness is acceptable.

## Invalidation storm

The inverse problem:

```text
mutation every second
  ↓
revalidate broad tag/path every second
  ↓
cache never becomes useful
```

Fix domain granularity or reduce cache scope.

A cache with a 1% hit ratio and heavy invalidation may be negative value.

## Region divergence

Symptom:

```text
user in region A sees new product
user in region B sees old product
```

Possible causes:

- region-local in-memory caches
- delayed distributed invalidation
- CDN propagation
- multi-primary data replication delay
- version skew during deployment

Do not assume Next.js cache is the only distributed system involved.

## Deployment version skew

During rolling deploys, old and new application versions may coexist.

If cache keys or serialized output formats change incompatibly, one version can read data generated by another.

Strategies:

- deployment/version namespace in keys where needed
- backwards-compatible cache payloads
- purge on incompatible schema changes
- short overlap windows

Treat cache format like a data contract.

## Sensitive logging

Debug cache incidents without logging:

- session cookies
- auth headers
- personal data
- full database rows
- secret cache keys containing raw credentials

Prefer safe metadata:

```text
cache namespace
resource ID
hash of key where appropriate
tenant ID if allowed
hit/miss
age
tag list
revalidation reason
```

## Observability metrics

Useful cache metrics:

```text
hit ratio
miss ratio
stale-hit ratio
origin latency
cache lookup latency
entry age
eviction count
revalidation count
invalidation failures
source request count
```

A high hit ratio is not automatically good if the cache serves incorrect data.

Correctness metrics matter too.

## Cache correctness tests

Test scenarios such as:

### Tenant isolation

```text
request tenant A
request tenant B
assert no shared private result
```

### Mutation freshness

```text
read old
mutate
read immediately
assert expected consistency
```

### Tag fan-out

```text
invalidate product
assert detail/list/category behavior
```

### Expiration

Use controlled clock/test abstractions where possible rather than long real waits.

### Multi-instance behavior

If production uses shared cache, integration tests should exercise the handler contract rather than only process-local memory.

## Development is not production

Dev has special HMR behavior and pages are rendered differently from production.

A cache incident must be reproduced with:

```bash
next build
next start
```

or the real deployment environment before conclusions are final.

## Disable caching as a diagnostic, not a permanent reflex

Temporarily switching to dynamic/no-store can help prove a cache is involved.

But leaving everything uncached can:

- increase latency
- overload databases
- increase API bills
- remove stable shell performance

After diagnosis, fix the specific cache contract.

## Security review checklist

For each persistent/shared entry:

- [ ] ownership is explicit
- [ ] key dimensions are complete
- [ ] authorization is not bypassed
- [ ] sensitive fields are minimized
- [ ] tenant/user scope is correct
- [ ] invalidation handles permission/content changes
- [ ] retention is acceptable
- [ ] remote storage compliance is reviewed
- [ ] failure fallback does not leak data

## Production runbook

When a cache incident occurs:

```text
1. contain
2. classify layer
3. establish source truth
4. determine scope
5. invalidate narrowly if possible
6. disable problematic cache if necessary
7. protect origin from stampede
8. restore correct policy
9. add regression test/metric
10. document root cause
```

For a suspected data leak, prioritize containment and access/security review over performance preservation.

## Interview questions

**What makes a cache key a security boundary?**  
Requests sharing the same key can receive the same stored result, so every dimension that affects allowed output must be represented or kept outside shared caching.

**What is a cache stampede?**  
Many requests regenerate the same expired/missing entry simultaneously, potentially overloading the origin.

**Why can high cache hit ratio still be bad?**  
If the cache serves stale or unauthorized data, efficiency only makes the correctness bug larger.

**How would you debug “soft navigation stale, hard reload fresh”?**  
Start with the client Router Cache/prefetch layer before blaming the server Data Cache.

## Exercise

Write an incident postmortem for this scenario:

```text
organization admin removes a user
removed user can still view one cached dashboard for 10 minutes
```

Include root cause hypotheses, containment, key/authorization analysis, invalidation design, test plan, and observability improvements.
