---
title: Partial Prerendering & Client Router Cache
description: Understand Cache Components shell generation, dynamic holes, Suspense boundaries, browser route-segment reuse, and why client and server cache invalidation differ.
---

# Partial Prerendering & Client Router Cache

Modern App Router performance is not just about the server Data Cache.

A navigation can involve:

```text
prerendered shell
server cache
RSC payload
client Router Cache
prefetch cache
browser history state
```

If you do not distinguish these layers, stale-data debugging becomes guesswork.

## Partial Prerendering through Cache Components

With Cache Components enabled, Next.js can prerender a route into a stable shell while leaving dynamic work for request time.

Conceptually:

```text
prerender pass
  ↓
route tree evaluated
  ↓
static + cacheable content captured
  ↓
dynamic work suspended behind boundaries
  ↓
static shell emitted
```

Then at request/navigation time:

```text
shell available
  ↓
dynamic server work executes
  ↓
result streams as RSC/HTML updates
```

## Why this matters

Traditional all-or-nothing thinking says:

```text
one dynamic widget
  → whole page dynamic
```

Cache Components lets you instead model:

```text
public stable content
  → cached/prerendered

request-specific widget
  → dynamic hole
```

This preserves fast initial structure without pretending personalized content is globally reusable.

## Suspense is the structural boundary

Dynamic work needs a meaningful Suspense boundary.

Example:

```tsx
export default function Page() {
  return (
    <main>
      <CachedCatalog />

      <Suspense fallback={<AccountSkeleton />}>
        <CurrentAccount />
      </Suspense>
    </main>
  )
}
```

`CurrentAccount` can remain request-time while `CachedCatalog` participates in the stable shell.

## Boundary placement affects UX

Too high:

```text
Suspense around entire page
  → stable content unnecessarily waits/falls back
```

Too low:

```text
20 tiny boundaries
  → visual noise and architecture complexity
```

A good boundary corresponds to a meaningful loading unit.

## Cache Components and short-lived data

Content with very short cache lifetime may be excluded from the prerendered shell.

This prevents near-real-time values from being embedded as if they were stable shell content.

That is a feature, not a failure.

## Client Router Cache

App Router stores route segment data in browser memory so client navigation can reuse previously loaded/prefetched segments.

This enables:

- preserved layouts
- fast back/forward behavior
- prefetched navigation
- reduced server requests for reusable segments

The client Router Cache is not the server Data Cache.

## Browser memory vs persistent server cache

```text
Client Router Cache
  → browser memory
  → navigation-focused
  → route segments/RSC data

Server cache
  → server/platform storage
  → server computation/data reuse
  → survives independently of one browser session according to deployment
```

A hard reload can discard client memory while server cache remains warm.

## Why stale UI can survive after server invalidation

Imagine:

```text
server data updated
server cache invalidated
browser still has route segment in memory
```

Depending on navigation and invalidation context, the browser may still show previously loaded route state until it requests/reconciles fresh server data.

This is why mutation APIs integrate with router invalidation behavior.

Do not debug only the database and server cache.

## Server Action invalidation and browser cache

When revalidation functions are invoked through a Server Action, Next.js can coordinate server invalidation with the current client router state.

This makes read-your-own-writes flows more immediate.

Still, understand the semantic difference:

```text
updateTag
  → cached data entry expiration

revalidatePath
  → route path invalidation

refresh / router refresh behavior
  → client requests/reconciles server output
```

They solve related but distinct problems.

## Back/Forward behavior

The browser Router Cache helps preserve:

- previously rendered layouts
- scroll position
- route state on Back/Forward

Do not aggressively clear client state after every mutation unless the product requires it.

Fast history navigation is part of the framework's UX model.

## Prefetching interacts with freshness

A route can be prefetched before the user clicks it.

That means cached/prefetched data may have been obtained earlier than the visible navigation.

Freshness questions should include:

```text
when was this prefetched?
what stale window applies?
was server data invalidated since then?
```

Phase 3 covered navigation/prefetch APIs. Here the key is that navigation cache and server cache have different lifetimes.

## `cacheLife.stale`

Under Cache Components, `cacheLife` includes a `stale` value that controls client reuse without a server check.

This is not a response `Cache-Control` directive.

It is part of the App Router client cache behavior.

Current Next.js enforces a minimum stale period for time-based cached prefetch usability.

Do not assume `stale: 0` means every previously prefetched segment instantly disappears in all navigation paths.

## Experimental `staleTimes`

Next.js also exposes an experimental global `staleTimes` configuration.

It is currently experimental and not recommended as the primary production teaching path.

Use per-cache `cacheLife` and explicit invalidation as the main model.

## CDN response caching is separate

A server route can produce cache-related HTTP headers that a CDN understands.

But:

```text
client Router Cache
server Cache Components
CDN response cache
```

are three different layers.

A CDN may continue serving an HTTP response according to its configured semantics even if your browser Router Cache was cleared.

Deployment architecture must document who owns each layer.

## Static assets are different again

Hashed immutable assets can be safely cached for very long periods because the URL changes when content changes.

That strategy is fundamentally different from caching database-derived page output under a stable URL.

Do not use one cache policy vocabulary for every resource type.

## Route-driven modal implications

From earlier phases:

```text
soft navigation → intercepted modal
hard reload      → full destination page
```

Client route state helps preserve the intercepted route context.

When debugging a stale route-driven modal, test both:

- client navigation
- direct hard load

because they exercise different client-cache/history paths.

## Revalidation and partial shells

Invalidating one cached function does not mean every static part of the route must be regenerated as one monolith.

Cache Components is designed around granular cached scopes.

That is why domain-aligned cache boundaries are powerful:

```text
product info
reviews summary
inventory
marketing banner
```

can each have separate freshness contracts.

## Production debugging matrix

| Symptom | First layer to inspect |
| --- | --- |
| Hard reload stale | server cache / CDN / upstream source |
| Soft navigation stale, hard reload fresh | client Router Cache / prefetch |
| One widget stale | that widget's cache scope/tag |
| All routes using same data stale | shared tag/cache source |
| Only one region stale | deployment/distributed cache topology |
| Dev stale but production fresh | HMR fetch cache |

This matrix avoids clearing every cache blindly.

## Common mistakes

### Calling all route reuse “browser cache”

The App Router's route-segment memory is framework state, distinct from normal browser HTTP caching.

### Treating a hard reload as the same path as soft navigation

Hard reload rebuilds browser route state and may expose different server/CDN behavior.

### Invalidating an entire route for one data fragment

Use granular tags/cache scopes when the domain permits it.

### Making dynamic content part of the stable shell accidentally

Review request-time dependencies and cache directives.

## Debugging checklist

1. reproduce soft navigation
2. reproduce hard reload
3. reproduce fresh browser session
4. inspect server cache hit/miss
5. inspect prefetch timing
6. inspect tags/path invalidation
7. inspect Suspense/cache boundary placement
8. inspect CDN headers/platform cache
9. compare regions/instances
10. correlate mutation time with cache-generation time

## Interview questions

**What is Partial Prerendering in current Next.js 16?**  
It is the ability, exposed through Cache Components, to emit a stable prerendered shell while request-time dynamic work completes separately behind boundaries.

**What is the Client Router Cache?**  
Browser-memory route segment state used by App Router for fast navigation, preserved layouts, prefetching, and history behavior.

**Why can soft navigation be stale while hard reload is fresh?**  
The browser may reuse route/prefetch state while a hard reload discards that client cache and requests fresh server output.

**Is `cacheLife.stale` the same as HTTP `Cache-Control: max-age`?**  
No. It controls client router reuse for the cached Next.js output, not generic browser/CDN HTTP cache semantics.

## Exercise

Build a product route with a cached shell and dynamic account/cart area.

Test:

```text
first load
prefetch then navigate
mutation then soft navigate
mutation then hard reload
Back/Forward
two browser sessions
```

For every visible result, explain which cache or rendering layer produced it.
