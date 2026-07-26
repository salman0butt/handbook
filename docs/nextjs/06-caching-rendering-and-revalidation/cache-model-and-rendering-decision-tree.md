---
title: Cache Model & Rendering Decision Tree
description: Build a current Next.js 16.2 mental model for static, dynamic, cached, and partially prerendered work without mixing old App Router defaults into modern code.
---

# Cache Model & Rendering Decision Tree

Caching in modern Next.js is easiest to understand when you stop asking one vague question:

> Is this page cached?

and instead ask several precise questions:

```text
What is being reused?
Where is it reused?
For how long?
What inputs are part of the key?
What makes it stale?
What forces runtime work?
Which users may share the result?
```

A single route can combine static shell output, cached server work, dynamic request-time work, browser router cache, and external CDN behavior.

## Current baseline

This handbook targets **Next.js 16.2 stable**.

Two server caching models matter:

```text
Cache Components enabled
  → modern `use cache` / `cacheLife` / `cacheTag` model

Cache Components disabled
  → previous App Router caching model
```

Do not blend them casually.

When `cacheComponents: true` is enabled, older Route Segment Config options such as `dynamic`, `revalidate`, and `fetchCache` are disabled. They belong to the previous model and are expected to be deprecated over time.

## The four questions behind every render

### 1. Can this work happen before a request?

Examples:

- static JSX
- cached content with stable inputs
- build-known route params

### 2. Does this work require request-time information?

Examples:

- cookies
- headers
- request-dependent authorization
- intentionally dynamic time/randomness after `connection()`

### 3. Can the expensive result be safely shared?

Examples:

```text
public CMS article → often yes
personalized billing dashboard → usually no
currency-specific price → maybe, if currency is part of cache key
```

### 4. What freshness contract does the product need?

Examples:

```text
legal page → hours/days/weeks
inventory → minutes or explicit invalidation
read-your-own-write profile → immediate expiration after mutation
```

## Rendering vocabulary

### Static rendering

Work is completed ahead of request-time when possible and reused.

Useful for public content, build-known routes, shareable data, and stable shells.

### Dynamic rendering

Work waits for an incoming request and executes with request-time state.

Useful for authenticated content, cookies/headers-dependent logic, request-specific permissions, and intentionally changing runtime values.

### Cached dynamic work

A function may execute at runtime but still reuse a cached result when its cache contract allows it.

That is why these concepts are not synonyms:

```text
static ≠ cached
runtime ≠ uncached
server-rendered ≠ always recomputed
```

## Cache layers to keep separate

### React request memoisation

React `cache()` can deduplicate server work during a render/request lifecycle.

It is **not** the persistent Next.js Data Cache.

### Next.js server data/output caching

This includes framework cache semantics such as extended server `fetch`, `use cache`, cache profiles, tags, and revalidation.

### Client Router Cache

App Router stores route segments in browser memory to make navigation fast.

This is not the same thing as the server Data Cache.

### CDN / HTTP cache

A CDN may cache HTTP responses according to response headers and platform behavior.

Do not assume server cache invalidation automatically means every downstream CDN behaves identically unless the deployment contract says so.

## Modern Cache Components mental model

With:

```ts
const nextConfig = {
  cacheComponents: true,
}
```

Next.js can prerender a route shell and leave request-time holes for dynamic content.

Conceptually:

```text
route tree
├── static shell
├── cached server subtree
└── dynamic request-time subtree
```

This is the modern path for Partial Prerendering behavior.

Do not teach old standalone `experimental.ppr`, `dynamicIO`, or `useCache` flags as the current production model.

## Decision tree

```text
Does data depend on current user/request?
├── yes
│   ├── can safe key be derived outside cache scope?
│   │   ├── yes → pass key/value into cached function if sharing is safe
│   │   └── no  → keep dynamic; private cache is experimental
│   └── authorization must still run at trusted server boundary
└── no
    ├── acceptable to reuse?
    │   ├── yes → cache with explicit lifetime/tags
    │   └── no  → dynamic/no-store/runtime work
    └── choose freshness + invalidation contract
```

## Public content example

```ts
import { cacheLife, cacheTag } from 'next/cache'

export async function getArticle(slug: string) {
  'use cache'
  cacheLife('days')
  cacheTag('articles', `article:${slug}`)

  return db.article.findUnique({ where: { slug } })
}
```

Inputs such as `slug` participate in the cache key.

This works because the article is shareable public content.

## Personalized data example

Do not hide request-specific identity inside a shared cache scope.

Prefer:

```text
request identity
  ↓
authorization
  ↓
explicit safe arguments
  ↓
cache only truly shareable sub-results
```

A user dashboard may remain dynamic while a public product catalog inside it is cached.

## Static shell + dynamic user area

```text
Product route
├── cached product information
├── cached reviews summary
└── dynamic account/cart widget
```

The route does not need to become fully dynamic just because one subtree needs request-time state.

That is one of the main motivations behind Cache Components.

## Time-based freshness

With modern Cache Components:

```ts
'use cache'
cacheLife('hours')
```

A cache profile describes:

```text
stale      → client reuse window
revalidate → server background refresh timing
expire     → hard expiration boundary
```

Do not reduce this model to a single TTL number.

## On-demand freshness

Use tags for data-domain invalidation:

```text
products
product:42
category:lighting
```

Use paths for route-oriented invalidation:

```text
/products
/dashboard
```

Prefer the narrowest invalidation that matches the domain change.

## Static/dynamic is not a security decision

Never reason:

```text
static = public and safe
dynamic = private and secure
```

Security depends on identity, authorization, cache key correctness, data projection, tenant isolation, and invalidation behavior.

A dynamically rendered route can still leak data if authorization is wrong. A cached route can be safe if it contains only shareable public data with correct keys.

## Common mistakes

### Treating every cache as one cache

This causes confusion around stale browser navigation versus stale server data.

### Copying Next.js 13/14 defaults

Older tutorials often say server `fetch` is cached by default. Current stable behavior is different.

### Caching before defining ownership

If you do not know which users can safely share a result, you are not ready to cache it.

### Using cache as authorization

A cache hit must never bypass permission rules that are required to decide whether the result may be returned.

### Over-invalidating everything

Broad invalidation increases compute load and hides poor domain modelling.

## Debugging decision tree

When data looks stale:

1. Identify the cache layer.
2. Reproduce with a production build.
3. Determine whether the stale value is in browser router cache, server cache, external CDN, or upstream API.
4. Check cache key inputs.
5. Check lifetime/profile.
6. Check tag/path invalidation.
7. Check whether a Server Action used `updateTag` vs `revalidateTag`.
8. Check whether a development HMR fetch cache is masking source changes.
9. Verify no user-specific data entered a shared cache.
10. Measure before disabling caching globally.

## Interview questions

**What is the difference between static rendering and caching?**  
Static rendering describes when rendering can happen; caching describes reuse of a previous result. They often overlap but are not identical.

**What changes when Cache Components is enabled?**  
The app uses the modern `use cache` model and can mix prerendered shell, cached server work, and dynamic holes. Older route segment cache controls are disabled.

**Why should React `cache()` not be called the Next.js Data Cache?**  
React `cache()` memoizes function work within the React server rendering lifecycle; persistent framework caching has a different scope and invalidation model.

**What is the most important security question before caching?**  
Whether the result is safe to share for every request that can map to the same cache key.

## Exercise

Take a SaaS dashboard and classify each subtree:

```text
marketing nav
public plan catalog
current user profile
organization permissions
usage graph
support announcement
```

For each, write owner, cacheability, cache key, freshness requirement, invalidation event, security boundary, and static/dynamic placement before adding any cache directive.
