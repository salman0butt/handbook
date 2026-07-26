---
title: Server Fetch, Data Cache & the Previous Model
description: Understand current server fetch caching, explicit cache modes, revalidation options, development behavior, and the non-Cache-Components model.
---

# Server Fetch, Data Cache & the Previous Model

Next.js extends the Web `fetch()` API on the server with persistent caching and revalidation controls.

The most important current rule is:

> A server `fetch()` is **not automatically equivalent to long-lived cached data**.

Older Next.js 13/14 tutorials often teach different defaults. For this handbook, use the current 16.2 contract.

## Current default fetch behavior

```ts
const response = await fetch('https://api.example.com/products')
```

With no explicit cache option, Next.js uses its current **auto** behavior.

Conceptually:

```text
development
  → source is fetched on requests, with HMR caching caveats

production build
  → if route can be prerendered, the fetch may run during build

request-time dynamic route
  → fetch runs for the request unless caching was explicitly requested
```

Do not infer persistent cache semantics merely because the code runs in a Server Component.

## `cache: 'no-store'`

```ts
await fetch(url, { cache: 'no-store' })
```

This explicitly opts the request out of the persistent Data Cache.

Use it when the source must be requested every time the server work executes.

Examples:

- rapidly changing private state
- request-bound provider response
- diagnostics where stale data is unacceptable

This still does **not** mean “the browser makes the request.” The request remains server-side when called in a Server Component.

## `cache: 'force-cache'`

```ts
await fetch(url, { cache: 'force-cache' })
```

Next.js checks its Data Cache for a matching request.

```text
fresh hit
  → return cached response

miss or stale entry
  → fetch source
  → update Data Cache
  → return response
```

Use this only when the response is safe to reuse across requests that map to the same cache entry.

## Time-based fetch revalidation

```ts
await fetch(url, {
  next: { revalidate: 300 },
})
```

The resource can be cached with a lifetime of at most 300 seconds.

The supported values are conceptually:

```text
false   → cache indefinitely, subject to eviction
0       → do not cache
number  → cache with revalidation interval in seconds
```

## Conflicting fetch options

Do not write contradictory policy:

```ts
fetch(url, {
  cache: 'no-store',
  next: { revalidate: 3600 },
})
```

Current Next.js treats these as conflicting options and warns in development.

A cache policy should communicate one coherent freshness contract.

## Fetch tags

A server fetch can participate in tag invalidation:

```ts
await fetch('https://api.example.com/products', {
  cache: 'force-cache',
  next: {
    tags: ['products'],
  },
})
```

Later:

```ts
revalidateTag('products', 'max')
```

or, in the correct Server Action context:

```ts
updateTag('products')
```

The mutation semantics are covered later in this phase and Phase 7.

## Tag limits

Current Next.js applies limits to custom cache tags:

- maximum tag length: 256 characters
- maximum tags associated with one cached resource: 128

Do not encode arbitrary request bodies into tag strings.

## Fetch cache is not HTTP browser cache

In browser code:

```ts
fetch(url, { cache: 'no-store' })
```

refers to browser HTTP cache behavior.

In server-side Next.js fetch, the extended option controls interaction with the framework Data Cache.

The same syntax exists in different runtime contexts, so always identify where the call executes.

## Request identity and cache keys

If an upstream response varies by authorization header:

```ts
fetch(url, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
```

be careful about reuse and persistence.

The architecture question is not simply whether Next.js can technically key the request.

Ask:

```text
Should this sensitive response be stored persistently at all?
Who may share it?
How long may it live?
How is invalidation handled?
```

For sensitive personalized data, a direct dynamic request is often easier to reason about.

## Development HMR cache

Development behavior can be surprising.

Next.js can reuse Server Component `fetch` responses across Hot Module Replacement refreshes to improve development speed and reduce repeated paid API calls.

This can affect even requests using:

```ts
cache: 'no-store'
```

between HMR refreshes.

The cache is cleared on navigation or full-page reload.

So when a source appears mysteriously stale in dev:

1. perform a full navigation/reload
2. inspect fetch logging
3. compare with a production build
4. only then conclude the persistent cache policy is wrong

Do not redesign production caching based solely on HMR behavior.

## Hard refresh behavior in development

A browser hard refresh commonly sends:

```text
cache-control: no-cache
```

In that case development behavior can bypass normal Next.js fetch cache options and go to the source.

Again, dev is not a faithful cache-performance benchmark.

## The previous App Router model

If `cacheComponents` is **not** enabled, the previous model remains relevant.

Important tools include:

- individual `fetch` cache options
- `next.revalidate`
- route segment `revalidate`
- route segment `dynamic`
- route segment `fetchCache`
- dynamic request APIs affecting rendering

This model remains supported, but it should not be mixed with Cache Components assumptions.

## Route Segment Config

Examples in the previous model:

```ts
export const revalidate = 600
```

```ts
export const dynamic = 'force-dynamic'
```

```ts
export const fetchCache = 'force-cache'
```

These options control route-wide rendering/cache behavior.

With `cacheComponents: true`, these cache-related route-segment controls are disabled.

## `fetchCache` is advanced

In the previous model, `fetchCache` can alter default behavior across an entire route tree.

Possible modes include cache-oriented and no-store-oriented policies.

This makes it powerful but also broad.

Prefer local explicit fetch policy unless you intentionally need a route-wide invariant.

## Lowest revalidation frequency effect

In the previous route model, the effective route revalidation interval can be influenced by lower `revalidate` values in the route tree or its fetches.

That means this mental model can be wrong:

```text
page says revalidate every hour
therefore every dependency is one-hour fresh
```

A child or fetch may force more frequent regeneration.

## Dynamic request APIs

Request-bound values such as cookies and headers affect whether rendering can happen before a request.

In the previous model, they often switch rendering to request-time behavior.

Under Cache Components, request-time work becomes a dynamic hole while cached/static work can remain in the shell.

## Migration mindset

When moving toward Cache Components:

Do not mechanically convert:

```ts
export const revalidate = 3600
```

into some arbitrary `cacheLife` call without understanding what was cached.

Instead identify:

```text
which function/data is expensive?
which output is shareable?
what is the desired freshness?
what event invalidates it?
```

Then place caching at the narrowest meaningful scope.

## Fetch vs `use cache`

A useful distinction:

```text
fetch cache
  → cache HTTP resource response

use cache
  → cache async function/component output
```

A cached function can include database calls, computations, and fetches.

This makes `use cache` a broader composition tool.

## When explicit fetch caching is still useful

Examples:

- external REST API response reused by multiple server paths
- provider response with clear source-level freshness
- resource tagging already maps naturally to the HTTP request

Use the tool whose cache boundary matches the resource boundary.

## Security checklist

Before `force-cache` or positive revalidation:

- Is the response shareable?
- Does it contain tokens or private metadata?
- Can tenant identity alter the response?
- Are query params/user IDs validated?
- Are authorization results being cached accidentally?
- Is invalidation scoped to the correct tenant/resource?

## Debugging checklist

When fetch appears stale or unexpectedly repeated:

1. confirm server vs browser runtime
2. inspect `cache` option
3. inspect `next.revalidate`
4. inspect tags
5. identify Cache Components on/off
6. inspect route segment config only if using previous model
7. account for development HMR cache
8. test production build behavior
9. inspect upstream CDN/API caching separately
10. measure actual request count and timing

## Interview questions

**Is server `fetch` cached by default in modern Next.js?**  
Do not use the old blanket rule. Current default is auto behavior; persistent caching should be explicit when your correctness depends on it.

**What is the difference between `no-store` and `force-cache`?**  
`no-store` fetches from the source whenever the server work executes; `force-cache` consults the persistent Data Cache.

**Why can `no-store` still look stale during development?**  
Server Component fetch responses can be reused by the development HMR cache until navigation/full reload.

**What happens to route segment cache options with Cache Components?**  
The cache-related segment options are disabled; the modern cache contract moves to `use cache`, cache profiles, and explicit dynamic boundaries.

## Exercise

Audit a route with five server fetches.

For each fetch, record:

```text
runtime
shareability
cache mode
revalidate time
tags
upstream cache
security sensitivity
```

Then remove any implicit assumptions and make only the policies that affect correctness explicit.
