---
title: Caching & Rendering Architecture Design Review
description: Design production cache boundaries, freshness contracts, invalidation topology, partial prerendering, and deployment-aware caching from first principles.
---

# Caching & Rendering Architecture Design Review

A senior Next.js cache design should be explainable without starting from API names.

Start from the product and data model:

```text
Who owns this data?
Who may see it?
How fresh must it be?
What changes it?
What should happen immediately after a write?
How expensive is recomputation?
Where is the app deployed?
```

Only then choose `use cache`, fetch caching, tags, paths, dynamic rendering, or remote handlers.

## The architecture worksheet

For each data domain, record:

| Question | Example |
| --- | --- |
| Owner | Product service |
| Visibility | Public |
| Key | product ID + locale |
| Freshness | 15 minutes |
| Mutation events | Product edit, publish |
| Consistency | Stale briefly acceptable |
| Invalidation | product tag + list tag |
| Storage | default/remote cache |
| Dynamic dependencies | none |
| Failure fallback | serve stale during refresh |

This table is more valuable than a blanket “cache all fetches” rule.

## Step 1: draw the data graph

Example commerce route:

```text
/product/[id]
├── product details
├── category metadata
├── inventory
├── reviews summary
├── user price entitlement
└── cart
```

Now classify each dependency:

```text
product details      → public, hours
category metadata    → public, days
inventory            → public-ish, seconds/minutes
reviews summary      → public, minutes
user entitlement     → private, request-time
cart                 → private, request-time
```

One route, six different cache contracts.

## Step 2: design the rendering tree

A strong tree might be:

```text
Page shell
├── Cached Product Details
├── Cached Category Metadata
├── Suspense
│   └── Inventory
├── Cached Reviews Summary
└── Suspense
    └── Account Area
        ├── Entitlement
        └── Cart
```

This keeps public stable work reusable while private state stays request-time.

## Step 3: define invalidation topology

Product edit can affect:

```text
product:p_42
products
category:lighting
homepage:featured
```

Inventory update may affect only:

```text
inventory:p_42
```

Do not couple product content and inventory to one giant tag if they have different write frequency and freshness.

## Step 4: choose consistency semantics

For each mutation, choose:

```text
immediate fresh read
  → updateTag where supported

stale-while-revalidate
  → revalidateTag(tag, 'max')

route output regeneration
  → revalidatePath
```

The API follows the consistency requirement.

## Step 5: choose cache storage

Ask:

```text
single process?
many containers?
serverless?
multi-region?
how expensive is a miss?
```

Then decide:

- local/default `use cache`
- remote/shared handler
- source-level cache
- no persistent cache

Do not add remote caching merely because the deployment is distributed. A cheap query may not justify another network lookup.

## Public CMS architecture

A CMS-driven marketing site often benefits from:

```text
long cache life
+
tag-based webhook invalidation
+
stale-while-revalidate fallback
```

Example tags:

```text
pages
page:about
navigation
footer
```

A webhook should authenticate before invalidating.

## SaaS dashboard architecture

A dashboard may combine:

```text
public plan catalog → cached
organization metadata → tenant-scoped cache or dynamic
permissions → dynamic/short carefully controlled cache
usage metrics → short-lived cache
current user → dynamic
notifications → client/live or dynamic
```

Do not cache the entire dashboard as one user-specific blob unless you have a deliberate per-user cache system and a strong reason.

## B2B multi-tenant design

For tenant-private cacheable content:

```text
cache key includes trusted tenant scope
invalidation tags include tenant scope
permission check happens before returning data
```

Example:

```text
tenant:t_42:catalog
tenant:t_42:catalog:item:p_9
```

If tenant ID comes from URL/cookie, validate and authorize it before cache use.

## Search architecture

Search queries create high cardinality:

```text
?q=a
?q=ab
?q=abc
...
```

Caching every query may have poor reuse.

Consider:

- only cache popular canonical queries
- cache expensive shared search indexes, not every response
- keep personalized ranking dynamic
- bound query length/filter combinations
- normalize cache keys

A technically cacheable result is not automatically worth caching.

## Inventory architecture

Inventory often needs tighter freshness than catalog content.

Avoid:

```text
product details + inventory
  → one 24-hour cache
```

Instead:

```text
product metadata → hours
inventory → seconds/minutes or dynamic
```

The UI can render the stable product shell while inventory resolves separately.

## Authorization architecture

Never make cache presence proof of access.

Wrong:

```text
if cached project exists → return it
```

Correct:

```text
resolve identity
  ↓
authorize resource scope
  ↓
read/reuse permitted data
```

For public data, authorization is irrelevant. For private data, it is foundational.

## Build-time vs runtime review

For each route, ask:

```text
what executes during next build?
what can be part of prerender shell?
what waits for request?
what runs after navigation?
```

This catches hidden assumptions about time/randomness and request APIs.

## Cache Components adoption strategy

For an existing previous-model App Router app:

### 1. inventory route segment config

Find:

```text
dynamic
revalidate
fetchCache
```

### 2. identify real cache boundaries

Map each route-wide rule to actual data/functions.

### 3. enable Cache Components in a controlled branch

```ts
cacheComponents: true
```

### 4. add `use cache` only to reusable work

### 5. define profiles/tags

### 6. add Suspense around request-time holes

### 7. run production build

### 8. test hard load, soft navigation, mutation, and invalidation

Do not enable the flag and then mechanically copy every old route-wide policy.

## Migration from `unstable_cache`

Legacy code may use `unstable_cache`.

The modern direction is Cache Components and `use cache`.

Migration should preserve:

- cache identity
- freshness
- invalidation tags
- security scope
- deployment behavior

Do not migrate by API shape alone.

## Migration from old PPR flags

Historical experiments may use old standalone PPR/dynamicIO/use-cache-related flags.

Next.js 16 consolidates the current model under `cacheComponents`.

Treat old flags as migration history, not the primary curriculum.

## Performance budget

Cache design should have measurable goals:

```text
origin DB QPS
server render latency
cache hit ratio
remote cache latency
RSC payload time
navigation latency
revalidation frequency
```

A cache change is successful only if it improves the intended metric without violating correctness.

## Cost model

Example:

```text
DB query = 20 ms
remote cache lookup = 15 ms
hit ratio = 10%
```

Remote cache may be pointless.

Another:

```text
aggregation = 1.5 s + expensive vendor API
remote cache = 20 ms
hit ratio = 95%
```

Remote caching may be high-value.

Measure real workloads.

## Failure-mode design

For each cache, decide behavior when:

- cache unavailable
- source unavailable
- invalidation unavailable
- entry corrupted
- schema changes
- deployment rolls back

Possible policies:

```text
serve stale
fallback to source
fail request
fallback to local cache
return partial UI
```

Security-sensitive data may require stricter failure than public content.

## Design review checklist

### Correctness

- [ ] cache owner identified
- [ ] freshness contract documented
- [ ] invalidation events mapped
- [ ] read-your-own-write requirement explicit
- [ ] previous-model and Cache Components APIs not mixed

### Security

- [ ] shared entries contain only safe data
- [ ] key includes every required isolation dimension
- [ ] authorization remains authoritative
- [ ] cache persistence/compliance reviewed

### Rendering

- [ ] stable shell maximized without caching private state
- [ ] dynamic holes are behind useful Suspense boundaries
- [ ] request APIs live close to their consumers
- [ ] `connection()` used only for intentional runtime work

### Operations

- [ ] hit/miss metrics available
- [ ] invalidation observable
- [ ] multi-instance behavior understood
- [ ] cold-start/stampede behavior acceptable
- [ ] production build tested

## Senior interview scenario

**Scenario:** A team has a `/dashboard` route with `dynamic = 'force-dynamic'` because one widget reads a session cookie. The page also loads a large public analytics benchmark that changes once per day.

Strong redesign:

```text
Cache Components on
  ↓
public benchmark → `use cache` + days profile + tag
session widget → request-time subtree behind Suspense
rest of shell → prerender/cache as appropriate
```

The goal is not to make the dashboard static. It is to stop one private dependency from forcing unrelated public work to recompute.

## Senior interview scenario: mutation consistency

**Scenario:** Admin edits a product and must immediately see the new title. Public users can tolerate the old category list for a few seconds.

Strong policy:

```text
product detail tag → updateTag for immediate read-your-own-write
category list tag → revalidateTag(..., 'max') for background refresh
```

Different consumers can have different consistency requirements after one mutation.

## Milestone project

Design caching for a marketplace with:

- public home page
- product/category/search
- inventory
- seller dashboard
- buyer cart
- CMS pages
- webhook updates
- three deployment regions

Deliver:

1. route rendering tree
2. cache-boundary map
3. cache profiles
4. tag taxonomy
5. path invalidation cases
6. dynamic request boundaries
7. remote-cache decision
8. security/isolation review
9. incident runbook
10. performance metrics and success thresholds

The result should be understandable by another engineer without reading every implementation file.
