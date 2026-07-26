---
title: Cache Components, Static Shells & Dynamic Holes
description: Understand modern partial prerendering through Cache Components, static shells, cached work, request-time holes, and Suspense fallbacks.
---

# Cache Components, Static Shells & Dynamic Holes

With Cache Components enabled, Next.js can prerender a route into a shell that mixes:

```text
static work
cached work
Suspense fallbacks for request-time work
```

Then request-time content streams into those dynamic holes.

This is the modern rendering model that replaces teaching old standalone PPR flags as the primary architecture.

## Enable Cache Components

```ts
const nextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

Phase 6 covers the cache contract itself.

Here we focus on rendering consequences.

## Build-time prerender pass

When Next.js prerenders a route, it evaluates the component tree before an incoming request exists.

Work that can finish safely can enter the shell.

Work that needs request-time state cannot.

Conceptually:

```text
component tree
   ↓
can render now?
   ├─ yes → shell
   └─ no
      ├─ cached explicitly → reusable result may enter shell
      └─ request-time → must sit behind Suspense
```

## Static shell

Example:

```tsx
export default function ProductPage() {
  return (
    <>
      <SiteHeader />
      <ProductDescription />
      <Suspense fallback={<PriceSkeleton />}>
        <PersonalPrice />
      </Suspense>
    </>
  )
}
```

If header and description are prerenderable, they become part of the shell.

`PersonalPrice` may need request-specific data and therefore renders later.

The fallback is what the shell contains for that region.

## Dynamic hole

A dynamic hole is not a separate route.

It is a Suspense-delimited region whose final output is deferred until request time.

```text
shell HTML
┌──────────────────────────┐
│ Header                   │
│ Product                  │
│ [Price loading...]       │ ← fallback/hole
│ Footer                   │
└──────────────────────────┘

request-time stream
        ↓
replace price fallback with final content
```

## Request APIs create request-time dependencies

Examples include reading request-specific data such as:

- cookies
- headers
- search parameters where the route API supplies them at request time
- explicit request-time barriers such as `connection()`

If a subtree depends on incoming-request data, the build cannot know its value.

Place it behind an appropriate Suspense boundary.

## Uncached I/O

With Cache Components, uncached async work that cannot complete during prerendering must be handled explicitly.

That generally means one of two choices:

```text
cache it
or
stream it behind Suspense
```

This forces the architecture to make freshness and loading boundaries visible.

## Cached work can enter the shell

```tsx
import { cacheLife } from 'next/cache'

async function FeaturedProducts() {
  'use cache'
  cacheLife('hours')

  const products = await db.product.findMany({
    where: { featured: true },
  })

  return <ProductGrid products={products} />
}
```

Because the result is explicitly cacheable, Next.js can reuse it and include it during prerendering according to the cache profile.

## Do not cache private work merely to avoid Suspense

Bad architectural motivation:

```text
"This personalized query causes a dynamic hole.
Let's use cache so it becomes static."
```

Caching changes freshness and isolation semantics.

Never use it only to silence a rendering constraint.

First ask:

```text
Is this result safe to share?
What is the cache key?
What identity/tenant/permission dimensions matter?
How fresh must it be?
```

If the answer is request-private, request-time rendering may be correct.

## Shell design

A strong shell contains stable context:

```text
brand/header
navigation
page title
non-personalized structure
cached common data
meaningful skeletons for personalized regions
```

The user should understand where they are even before dynamic holes reveal.

## Shell anti-pattern

```text
entire page = one dynamic hole
```

If everything is under one Suspense fallback, Partial Prerendering provides little user-visible benefit.

Look for stable structure that can move outside the boundary.

## Boundary depth

Compare:

```tsx
<Suspense fallback={<PageSkeleton />}>
  <Dashboard />
</Suspense>
```

with:

```tsx
<DashboardFrame>
  <Summary />

  <Suspense fallback={<AccountSkeleton />}>
    <Account />
  </Suspense>

  <Suspense fallback={<FeedSkeleton />}>
    <Feed />
  </Suspense>
</DashboardFrame>
```

The second architecture exposes more stable shell and independent streaming.

## Nested caches and boundaries

You can combine:

```text
static parent
  cached child
  dynamic Suspense child
    cached grandchild
```

Think in terms of each subtree's actual dependency and reuse contract.

Avoid trying to assign one rendering label to the whole route.

## Partial prerendering is a route composition result

Do not think:

```text
PPR = special page type
```

Think:

```text
route tree contains static/cached/request-time subtrees
+ Suspense defines deferred reveal boundaries
= partially prerendered output
```

That mental model scales better.

## Initial load

For a direct request:

```text
prerendered shell available
      ↓
request arrives
      ↓
request-time holes execute
      ↓
shell can be sent promptly
      ↓
dynamic results stream when ready
```

## Client navigation

Cache Components also produces route data suitable for App Router navigation.

The client can receive the shell/RSC representation and later streamed dynamic content without full document replacement.

This is why partial prerendering is relevant to both initial page load and soft navigation.

## Static shell is not necessarily forever-static

Cached parts can revalidate.

A later prerender/cache result can change as profiles expire or invalidation occurs.

"In shell" means:

```text
available during prerender for this cache state
```

not:

```text
hard-coded forever
```

## Static export

A deployment with no runtime server cannot fulfill general request-time dynamic holes.

If your route depends on request-time streaming, it requires a deployment capable of handling that work.

Static export remains appropriate only when the route can resolve to static output under its supported constraints.

## Request-private data

Example:

```tsx
import { cookies } from 'next/headers'

async function CartBadge() {
  const store = await cookies()
  const sessionId = store.get('session')?.value
  const count = await getCartCount(sessionId)

  return <span>{count}</span>
}
```

This should be treated as request-time work unless you have a deliberately safe private caching model.

Wrap it:

```tsx
<Suspense fallback={<CartBadgeSkeleton />}>
  <CartBadge />
</Suspense>
```

## Error boundaries around holes

A Suspense fallback handles readiness, not every failure.

For resilient dynamic regions, pair rendering design with appropriate error boundaries.

Conceptually:

```text
Error boundary
  ↓
Suspense boundary
  ↓
dynamic subtree
```

Exact placement depends on whether a failure should replace only the region or escalate to the route.

## Performance model

Partial prerendering can improve time-to-useful-content, but it does not make slow dependencies fast.

Measure:

```text
shell generation/cache hit
TTFB
shell bytes
first dynamic chunk time
last dynamic chunk time
dependency latency
hydration cost
```

If a critical hole reveals after eight seconds, the route still has a critical dependency problem.

## Cache and stream interactions

A cached dependency can remove repeated request-time work.

A streamed dependency can reduce blocking even when it remains request-time.

These solve different problems:

```text
cache → reuse
stream → progressive delivery
```

Often the correct architecture uses both, on different subtrees.

## Security review

For every shell/cached region ask:

- Can this content contain user-specific data?
- Is the cache key sufficient?
- Could one tenant observe another tenant's result?
- Does authorization happen before cached data is selected?
- Are fallback labels themselves safe?

Streaming does not remove security requirements.

## Debugging `Uncached data was accessed outside of <Suspense>`

When Cache Components reports uncached work outside Suspense:

1. Find the async/request-time dependency.
2. Decide whether it should be cached.
3. If cacheable, define a correct `use cache` boundary and lifetime.
4. If request-time, move it under meaningful Suspense.
5. Avoid pushing the boundary to the root merely to silence the error.
6. Re-run production build because prerender behavior matters.

## Common mistakes

### Using old PPR flags as current architecture

Modern stable teaching should start from Cache Components.

### One huge Suspense boundary

Creates a mostly-empty shell.

### Caching personalized data for build success

Can create data leaks.

### Thinking static shell means no server request

Dynamic holes still require request-time server work.

### Confusing cache reuse with browser/CDN HTTP caching

Next.js server caching and HTTP cache headers are separate layers.

## Interview questions

**What is a dynamic hole?**  
A request-time subtree deferred behind Suspense while the surrounding static/cached shell can be prerendered.

**Does Suspense itself make a subtree request-time?**  
No. The dependency determines that; Suspense defines how deferred work is represented and revealed.

**Why might `use cache` remove a dynamic hole?**  
If the work is safely cacheable, Next.js can evaluate/reuse it during prerendering and include the result in the shell.

**What is the security risk of aggressive shell optimization?**  
Developers may incorrectly cache user/tenant-specific data to force it into prerendered output.

## Exercise

Design a commerce product route with:

```text
header
product title
catalog description
inventory
personalized price
cart badge
recommendations
reviews
```

Classify each as:

- static
- cached
- request-time

Then draw the Suspense boundaries and explain what enters the shell and what streams later.
