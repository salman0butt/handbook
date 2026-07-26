---
title: cache, cacheSignal, and Server Render Lifetimes
description: Learn React Server Component memoization, request-scoped cache behavior, preload patterns, cancellation with cacheSignal, and cache architecture boundaries.
sidebar_position: 3
---

# `cache`, `cacheSignal`, and server render lifetimes

React Server Components can perform expensive reads and computations during rendering.

Two React APIs help coordinate that work:

- `cache(fn)` memoizes work within the relevant server render/cache lifetime;
- `cacheSignal()` exposes an `AbortSignal` tied to that lifetime.

These APIs are specifically about React Server Component rendering. They are not drop-in replacements for your database cache, CDN, Redis, or application-wide cache layer.

## Mental model

```text
server render begins
   ↓
multiple components request same logical work
   ↓
cache(fn) can deduplicate matching calls
   ↓
render finishes / aborts / fails
   ↓
cache lifetime ends
   ↓
cacheSignal aborts
```

The key word is **render lifetime**.

## `cache(fn)`

```jsx
import { cache } from 'react';

const getUser = cache(async id => {
  return db.users.findById(id);
});
```

Components can share the same memoized function:

```jsx
async function Profile({ userId }) {
  const user = await getUser(userId);
  return <h1>{user.name}</h1>;
}

async function AuditPanel({ userId }) {
  const user = await getUser(userId);
  return <p>{user.email}</p>;
}
```

If both call the same cached function with the same arguments in the same relevant cache lifetime, React can reuse the result instead of repeating the work.

## Create the cached function once

Wrong:

```jsx
function Profile({ userId }) {
  const getUser = cache(loadUser);
  // new memoized function identity
}
```

Each `cache(loadUser)` call creates a new memoized function.

Better:

```jsx
const getUser = cache(loadUser);

export default async function Profile({ userId }) {
  const user = await getUser(userId);
  return <h1>{user.name}</h1>;
}
```

Components must call the **same memoized function** to share its cache.

## Argument identity matters

Memoization keys are based on arguments.

Primitives are straightforward:

```jsx
getUser('42');
getUser('42');
```

Objects can be trickier:

```jsx
getReport({ month: 7 });
getReport({ month: 7 });
```

Those are two different object identities even though their contents look equal.

Prefer stable primitive keys or shared object references when possible.

## Cached errors

If the wrapped function throws for a given input, that error can be cached for the same memoized call key.

That means repeated callers may observe the same failure rather than retrying automatically.

Do not assume `cache` is a retry mechanism.

Retries, backoff, and resilience belong in the data-access layer or framework architecture.

## Request-scoped behavior

React invalidates memoized caches across server render/request lifetimes rather than treating `cache` as a permanent process-wide store.

Do not use `cache` expecting:

```text
one result cached forever across all requests
```

Think instead:

```text
avoid duplicate server render work
share one snapshot where React controls the render cache lifetime
```

## `cache` vs application cache

These are different layers:

```text
React cache(fn)
render/request-oriented memoization

application cache
Redis / database cache / framework cache
may persist across requests
explicit TTL/invalidation

CDN cache
HTTP response/resource caching
edge-distributed
```

A mature architecture may use all three for different purposes.

## Snapshot consistency

One useful property of request-lifetime memoization is that multiple components can read the same logical snapshot rather than independently loading slightly different states during one render.

For example:

```text
Header asks for account
Sidebar asks for account
Page asks for account
```

If all call the same cached loader with the same key, they can share work and a consistent result.

This is especially useful when server rendering composes data access across distant components.

## Preloading pattern

A component can start work before another component reaches the read point.

```jsx
const getProduct = cache(loadProduct);

function preloadProduct(id) {
  void getProduct(id);
}

export default async function Page({ id }) {
  preloadProduct(id);
  return <ProductSection id={id} />;
}
```

Later:

```jsx
async function ProductSection({ id }) {
  const product = await getProduct(id);
  return <h1>{product.name}</h1>;
}
```

The later call can reuse the same in-flight/completed cached work.

This can reduce avoidable server waterfalls.

## Do not preload everything

Preloading has costs:

- database load;
- memory;
- network calls;
- server compute;
- cache pressure.

Only start work that is likely to be needed and useful.

## `cacheSignal()`

React 19.2 added `cacheSignal` for React Server Components.

```jsx
import { cacheSignal } from 'react';

async function loadData(url) {
  return fetch(url, {
    signal: cacheSignal(),
  });
}
```

During rendering, `cacheSignal()` returns an `AbortSignal` tied to the relevant React cache/render lifetime.

When React considers that lifetime finished, the signal aborts.

## When does the signal abort?

The render lifetime can end when:

- React successfully finishes rendering;
- the render is aborted;
- the render fails.

This lets async work stop when React no longer needs it.

## Cancellation example

```jsx
import { cache, cacheSignal } from 'react';

const getReport = cache(async reportId => {
  const response = await fetch(
    `https://internal.example/reports/${reportId}`,
    { signal: cacheSignal() }
  );

  return response.json();
});
```

If the render is abandoned, the fetch can be cancelled rather than continuing useless work.

## `cacheSignal()` can return `null`

Outside the relevant rendering context, `cacheSignal()` can return `null`.

Design helpers accordingly:

```jsx
const signal = cacheSignal();

const response = await fetch(url, {
  ...(signal ? { signal } : {}),
});
```

Do not assume the signal always exists.

## Client Components

`cacheSignal` is currently an RSC-oriented API.

Do not build Client Component cancellation around it.

For client requests, use normal client-side cancellation patterns such as an `AbortController` owned by the request/effect/data layer.

## `cacheSignal` does not replace request cancellation

There can be several cancellation scopes:

```text
HTTP request disconnect
framework route cancellation
React render/cache lifetime
individual database/fetch timeout
```

A robust backend may need to connect multiple signals/scopes.

`cacheSignal` tells you React no longer needs work in its cache lifetime. It does not automatically solve every infrastructure timeout.

## Database drivers and cancellation

Not every database or SDK accepts an `AbortSignal`.

If your data source supports cancellation, pass the signal deliberately.

If it does not, you may only be able to ignore late results rather than cancel the underlying work.

Know what your driver actually supports.

## Cache invalidation after mutations

`cache(fn)` is not an application mutation invalidation system.

After a Server Function changes data, your framework may need to:

- refresh a route;
- invalidate a framework cache;
- revalidate a tag/path;
- update a client cache;
- navigate to fresh server output.

Those are framework/data-layer responsibilities.

Do not expect React `cache` alone to model long-lived canonical freshness.

## Multi-tenant safety

Cache keys must include every dimension that changes the result.

Bad conceptual key:

```jsx
getDashboard('home')
```

if the result depends on tenant/user.

Better:

```jsx
getDashboard({ tenantId, userId, page: 'home' })
```

But remember argument identity for objects. Stable primitive arguments can make cache keys clearer:

```jsx
getDashboard(tenantId, userId, 'home')
```

Never reuse cached privileged data across security boundaries accidentally.

## Authorization belongs inside data access

Even if a parent component already checked permissions, a reusable cached loader should preserve its own safe authorization contract when appropriate.

A cache hit must never bypass authorization.

Architectural rule:

> Cache the result of an authorized query, not an unauthorized global lookup that callers are expected to filter correctly later.

## Cache poisoning concerns

If untrusted input affects cache keys or expensive computations, validate it first.

Otherwise attackers may generate unbounded key cardinality or expensive work.

Examples:

- arbitrary search strings;
- unbounded report parameters;
- attacker-controlled URLs;
- tenant IDs not checked against authenticated actor.

React memoization does not remove backend abuse controls.

## Error and abort handling

An aborted fetch is not necessarily a product error.

If React no longer needs the render, cancellation may be expected.

Observability should distinguish:

```text
expected cancellation
vs
real infrastructure failure
```

Otherwise logs become noisy and alerts misleading.

## Cache + Suspense

Cached async work composes naturally with Suspense-aware server rendering.

```text
component calls cached async loader
   ↓
loader Promise is shared
   ↓
render may suspend
   ↓
other components reuse same work
   ↓
Suspense/server rendering coordinates reveal
```

This can reduce duplicate fetches while preserving progressive rendering.

## Cache + PPR

Partial pre-rendering introduces another lifetime dimension.

Some work may happen during prerender, while postponed work resumes later.

Do not invent assumptions about how a framework persists or invalidates application data solely from React `cache` semantics.

Follow the framework's documented cache/revalidation behavior around PPR.

## Common mistakes

### Mistake: call `cache` inside every component

That creates separate memoized functions and prevents sharing.

### Mistake: use object literals as keys without understanding identity

Equivalent contents do not guarantee the same argument identity.

### Mistake: treat `cache` as Redis

It is React render/cache-lifetime memoization, not a general persistent cache.

### Mistake: expect cache to revalidate after mutation automatically

Canonical freshness is a framework/data-layer concern.

### Mistake: assume `cacheSignal` is always non-null

Handle its documented lifetime/context behavior.

### Mistake: log every abort as an error

Cancellation may mean React intentionally stopped needing the work.

## Production checklist

For a cached server loader:

1. define it at module scope or another stable shared location;
2. use stable arguments;
3. include tenant/user dimensions when required;
4. authorize before exposing privileged results;
5. validate untrusted key inputs;
6. know whether errors are cached;
7. distinguish React memoization from persistent cache policy;
8. pass `cacheSignal` to cancellable work when useful;
9. classify aborts separately from failures;
10. document mutation invalidation through the framework/data layer.

## Exercise

Build an RSC product page where three Server Components need the same product record.

Requirements:

- use one module-scoped `cache` wrapper;
- prove the loader is shared conceptually;
- preload the product before a deep child reads it;
- pass `cacheSignal()` to a cancellable upstream request;
- include tenant ID in the cache key;
- explain how a product-update Server Function causes the next render to see canonical fresh data through framework invalidation rather than relying on `cache` alone.

## Interview questions

**Junior:** What does React `cache` do?

**Mid-level:** Why can two calls to `cache(loadUser)` fail to share results even when they wrap the same function?

**Senior:** Explain request-scoped memoization, argument identity, authorization, persistent-cache boundaries, mutation invalidation, cancellation, and how `cacheSignal` fits server rendering lifetimes.

## Summary

```text
cache(fn)
share server render work
same memoized function + same args
not persistent application cache

cacheSignal()
AbortSignal for React cache/render lifetime
cancel work React no longer needs
RSC-focused in React 19.2
```

## References

- https://react.dev/reference/react/cache
- https://react.dev/reference/react/cacheSignal
- https://react.dev/reference/rsc/server-components
- https://react.dev/blog/2025/10/01/react-19-2
