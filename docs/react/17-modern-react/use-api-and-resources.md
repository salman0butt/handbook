---
title: The use API and Suspense Resources
description: Understand React's use API for context and Promises, Suspense interaction, cached resources, error boundaries, and the difference between React primitives and framework data layers.
sidebar_position: 5
---

# The `use` API and Suspense resources

React 19 includes the `use` API:

```jsx
const value = use(resource);
```

It can read:

- a Context object;
- a Promise that participates in Suspense.

`use` is unusual because it is not exactly like ordinary Hooks, and it should not be taught as a generic replacement for data-fetching libraries.

## `use(context)`

You can read a Context value with `use`:

```jsx
import {use} from 'react';
import {ThemeContext} from './theme-context';

function Button() {
  const theme = use(ThemeContext);
  return <button className={theme}>Save</button>;
}
```

This overlaps with `useContext`, but `use` has different calling rules.

## `use` can be called conditionally

Ordinary Hooks must be called unconditionally at the top level.

`use` can be called inside conditions and loops when reading a resource.

```jsx
function Message({showTheme}) {
  if (showTheme) {
    const theme = use(ThemeContext);
    return <p className={theme}>Hello</p>;
  }

  return <p>Hello</p>;
}
```

Do not generalize this exception to other Hooks.

Bad conclusion:

> “React Hooks can now be called conditionally.”

Correct conclusion:

> `use` has special rules; normal Hooks still follow the Rules of Hooks.

## `use(promise)`

`use` can read a Promise:

```jsx
function Product({productPromise}) {
  const product = use(productPromise);
  return <h1>{product.name}</h1>;
}
```

If the Promise is pending, the component suspends and React looks for the nearest Suspense boundary.

```jsx
<Suspense fallback={<ProductSkeleton />}>
  <Product productPromise={productPromise} />
</Suspense>
```

Mental model:

```text
render Product
   ↓
use(promise)
   ↓
promise pending?
  ├─ no → return value
  └─ yes → suspend
           ↓
     nearest Suspense fallback
```

## Rejected Promises

If the Promise rejects, the error can flow to the nearest Error Boundary.

```text
pending Promise → Suspense
rejected Promise → Error Boundary
fulfilled Promise → render value
```

This creates a declarative relationship between loading, error, and successful content.

## Do not create a new Promise every render

Bad:

```jsx
function Product({id}) {
  const product = use(fetch(`/api/products/${id}`)); // ❌ new Promise each render
  return <h1>{product.name}</h1>;
}
```

Promises read by `use` need stable/cached identity.

Better architectures get the Promise from:

- a Suspense-aware cache;
- a framework data layer;
- a Server Component;
- a library designed to integrate with Suspense.

## Why Promise identity matters

If render creates a new Promise every time:

```text
render
 → Promise A
 → suspend
render again
 → Promise B
 → suspend
render again
 → Promise C
 → suspend
```

React never gets a stable resource to finish reading.

The Promise is part of resource identity.

## A tiny cache example

For learning purposes:

```jsx
const cache = new Map();

function getProduct(id) {
  if (!cache.has(id)) {
    cache.set(
      id,
      fetch(`/api/products/${id}`).then(response => response.json()),
    );
  }

  return cache.get(id);
}
```

Then:

```jsx
function Product({id}) {
  const product = use(getProduct(id));
  return <h1>{product.name}</h1>;
}
```

This illustrates stable Promise identity.

Do **not** treat this toy `Map` as production cache architecture. Production caching requires policies for invalidation, deduplication, garbage collection, errors, retries, authorization, and server/client behavior.

## React primitive vs data framework

React provides the primitive:

```text
use(Promise)
+
Suspense
```

It does not automatically provide a complete server-state architecture.

Frameworks and data libraries may add:

- request caching;
- route loaders;
- streaming;
- invalidation;
- mutation coordination;
- deduplication;
- preloading;
- server/client transfer;
- error recovery.

This distinction matters when comparing React core with tools such as framework loaders or query libraries.

## Server-to-client Promise flow

A modern server architecture may create a Promise on the server and pass it to a Client Component, where `use` reads it.

Conceptually:

```text
Server Component
  creates/obtains Promise
       ↓
passes resource across supported boundary
       ↓
Client Component
  use(promise)
       ↓
Suspense coordinates streaming/hydration
```

Exact serialization and Server Component behavior depend on an RSC-capable framework.

We cover that deeply in the Server Components phase.

## `use` with context vs `useContext`

Both can read Context.

Use `useContext` when ordinary Hook structure is natural:

```jsx
const theme = useContext(ThemeContext);
```

Use `use` when its conditional/resource-oriented calling behavior is specifically useful:

```jsx
if (shouldReadTheme) {
  const theme = use(ThemeContext);
}
```

Do not refactor working `useContext` code merely because `use` exists.

## Do not read Promise internals manually

Avoid patterns such as:

```jsx
if (promise.status === 'fulfilled') {
  return promise.value;
}
```

Pass the resource to `use` and let React coordinate it:

```jsx
const value = use(promise);
```

Bypassing React's resource read can interfere with Suspense behavior and tooling.

## Suspense is not “catch any Promise anywhere”

A common misconception is:

> “If I fetch in `useEffect`, Suspense will show the fallback.”

No.

This does not make Suspense wait for the Effect fetch:

```jsx
useEffect(() => {
  fetch('/api/products').then(...);
}, []);
```

Suspense coordinates supported suspending resources such as:

- lazy-loaded code;
- Promises read with `use`;
- framework/library data sources designed for Suspense.

Effects happen after commit and are a different mechanism.

## Preloading

A resource can be started before the component needs to read it.

Conceptually:

```text
hover link
  ↓
start resource
  ↓
user navigates
  ↓
use(resource)
  ↓
already pending or fulfilled
```

This can reduce time spent showing fallback UI.

The cache/data layer owns the resource-starting API; `use` owns reading the resource during render.

## Error handling architecture

A mature Suspense resource tree usually considers both loading and failure boundaries.

```jsx
<ErrorBoundary fallback={<ProductError />}>
  <Suspense fallback={<ProductSkeleton />}>
    <Product productPromise={productPromise} />
  </Suspense>
</ErrorBoundary>
```

Think in boundaries:

```text
Suspense Boundary
→ expected waiting state

Error Boundary
→ failed rendering/resource state
```

## Granularity matters

One giant Suspense boundary around the entire app can produce poor UX.

Prefer boundaries around meaningful reveal units:

```jsx
<Page>
  <Header />
  <Suspense fallback={<SummarySkeleton />}>
    <Summary />
  </Suspense>
  <Suspense fallback={<TableSkeleton />}>
    <OrdersTable />
  </Suspense>
</Page>
```

This lets already available content remain visible.

## `use` and concurrency

Suspending render work participates in React's concurrent rendering model.

That is why `use` should be understood alongside:

- Suspense;
- Transitions;
- `useDeferredValue`;
- streaming;
- selective hydration;
- Server Components.

This chapter establishes the resource-reading primitive. The next phase goes deeper into concurrency.

## Common mistakes

### Creating Promises during render

Use a cache/framework/resource layer with stable Promise identity.

### Treating `use` as a fetch function

`use` reads a resource; it does not itself decide how data should be fetched, cached, retried, or invalidated.

### Assuming Effect fetches trigger Suspense

They do not.

### Calling ordinary Hooks conditionally because `use` can

`use` is a special exception.

### Building a homemade production cache from the tutorial `Map`

The simple cache demonstrates identity only. Real caches need lifecycle and invalidation strategy.

## Production decision guide

```text
Need server data?
   ↓
Does framework/data layer already own loading/cache?
  ├─ yes → use its supported pattern
  └─ no
       ↓
Are you intentionally building Suspense integration?
  ├─ no → conventional async/server-state architecture may be simpler
  └─ yes → stable resource + use + Suspense + error boundaries
```

## Interview questions

**Junior:** What happens when `use` reads a pending Promise?

**Mid-level:** Why is `use(fetch(url))` directly inside render usually incorrect?

**Senior:** What responsibilities belong to React's `use`/Suspense primitives versus a framework or server-state cache?

## References

- https://react.dev/reference/react/use
- https://react.dev/reference/react/Suspense
- https://react.dev/blog/2024/12/05/react-19

## Next

Continue with **[`<Activity>` in React 19.2](./activity.md)**.