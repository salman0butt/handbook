---
title: The use API and Suspense Resources
description: Understand React's use API for context and Promises, Suspense interaction, cached resources, error boundaries, and the difference between React primitives and framework data layers.
sidebar_position: 5
---

import {
  DecisionTree,
  DiagramArrow,
  DiagramGrid,
  DiagramNode,
  DiagramStack,
  LifecycleBar,
  VisualDiagram,
} from '@site/src/components/handbook/VisualDiagram'

# The `use` API and Suspense resources

React includes the `use` API:

```jsx
const value = use(resource);
```

It can read a Context object or a Promise that participates in Suspense.

<VisualDiagram title="What use reads" compact>
  <DiagramGrid columns={2}>
    <DiagramNode title="Context" tone="cyan">Read the nearest matching provider value.</DiagramNode>
    <DiagramNode title="Promise" tone="purple">Read a cached Promise; suspend while it is pending.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

`use` is unusual: it is not a normal Hook, and it should not be taught as a generic data-fetching library.

## `use(context)`

```jsx
import {use} from 'react';
import {ThemeContext} from './theme-context';

function Button() {
  const theme = use(ThemeContext);
  return <button className={theme}>Save</button>;
}
```

Unlike ordinary Hooks, `use` can be called in conditions and loops when reading a supported resource:

```jsx
function Message({showTheme}) {
  if (showTheme) {
    const theme = use(ThemeContext);
    return <p className={theme}>Hello</p>;
  }

  return <p>Hello</p>;
}
```

Do not generalize this exception to `useState`, `useEffect`, or other normal Hooks.

## `use(promise)`

```jsx
function Product({productPromise}) {
  const product = use(productPromise);
  return <h1>{product.name}</h1>;
}
```

Wrap the reader in Suspense:

```jsx
<Suspense fallback={<ProductSkeleton />}>
  <Product productPromise={productPromise} />
</Suspense>
```

<VisualDiagram title="Promise read outcome" subtitle="The resource state determines which boundary participates.">
  <DiagramStack align="center">
    <DiagramNode title="Render component" tone="blue" />
    <DiagramArrow label="use(promise)" />
    <DiagramGrid columns={3}>
      <DiagramNode title="Fulfilled" tone="green">Return the resolved value and continue rendering.</DiagramNode>
      <DiagramNode title="Pending" tone="purple">Suspend and reveal the nearest Suspense fallback.</DiagramNode>
      <DiagramNode title="Rejected" tone="red">Error propagates toward the nearest Error Boundary.</DiagramNode>
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

This gives loading, success, and failure a declarative boundary model.

## Promise identity must be stable

Do not create a new Promise during every render:

```jsx
function Product({id}) {
  const product = use(fetch(`/api/products/${id}`)); // ❌ uncached Promise
  return <h1>{product.name}</h1>;
}
```

<VisualDiagram title="Why uncached Promises keep suspending" compact>
  <LifecycleBar
    items={[
      { label: 'Render creates Promise A', tone: 'orange' },
      { label: 'Suspend', tone: 'purple' },
      { label: 'Retry creates Promise B', tone: 'orange' },
      { label: 'Suspend again', tone: 'purple' },
      { label: 'No stable resource identity', tone: 'red' },
    ]}
  />
</VisualDiagram>

Promises passed to `use` should come from a Suspense-compatible cache, framework/data layer, Server Component, or another architecture that preserves resource identity.

## Tiny cache example for learning

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

function Product({id}) {
  const product = use(getProduct(id));
  return <h1>{product.name}</h1>;
}
```

This demonstrates stable Promise identity only. A production cache needs invalidation, deduplication, garbage collection, retries, authorization, server/client semantics, and more.

## React primitive vs data layer

<VisualDiagram title="React does not become your whole data architecture" compact>
  <DiagramGrid columns={2}>
    <DiagramNode title="React core" tone="purple">`use(Promise)` · Suspense · Error Boundaries · rendering coordination.</DiagramNode>
    <DiagramNode title="Framework / data library" tone="orange">Fetching policy · cache lifetime · invalidation · preloading · mutations · retries · server/client transfer.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

`use` reads a resource. It does not decide how that resource should be fetched, refreshed, invalidated, or persisted.

## Server-to-client Promise flow

An RSC-capable architecture may create or obtain a Promise on the server, pass it through a supported boundary, and read it in a Client Component.

<VisualDiagram title="Server-created resource consumed on the client" compact>
  <DiagramStack align="center">
    <DiagramNode title="Server Component" tone="orange">Creates or obtains a Promise.</DiagramNode>
    <DiagramArrow label="pass supported resource" />
    <DiagramNode title="Client Component" tone="blue">Calls `use(promise)` during render.</DiagramNode>
    <DiagramArrow label="pending work" />
    <DiagramNode title="Suspense / streaming / hydration" tone="purple">Framework and React coordinate how the boundary reveals.</DiagramNode>
  </DiagramStack>
</VisualDiagram>

Exact serialization and server behaviour depend on the RSC-capable framework.

## `use(context)` vs `useContext`

Both can read Context.

Use `useContext` when ordinary top-level Hook structure is natural:

```jsx
const theme = useContext(ThemeContext);
```

Use `use` when its resource-oriented or conditional calling behaviour is specifically useful:

```jsx
if (shouldReadTheme) {
  const theme = use(ThemeContext);
}
```

Do not refactor stable `useContext` code merely because `use` exists.

## Do not bypass `use`

Avoid manually inspecting Promise internals:

```jsx
if (promise.status === 'fulfilled') {
  return promise.value; // ❌ bypasses React's resource read
}
```

Use:

```jsx
const value = use(promise);
```

Let React coordinate Suspense and tooling around the resource.

## Suspense is not “catch every Promise”

This does not make Suspense wait for an Effect fetch:

```jsx
useEffect(() => {
  fetch('/api/products').then(...);
}, []);
```

Effects run after commit. Suspense coordinates supported suspending resources such as lazy-loaded code, Promises read with `use`, and framework/library data sources designed for Suspense.

## Preloading

A resource can start before the component needs to read it.

<VisualDiagram title="Preload before navigation" compact>
  <LifecycleBar
    items={[
      { label: 'User signals likely intent', tone: 'blue' },
      { label: 'Data layer starts resource', tone: 'orange' },
      { label: 'User navigates', tone: 'purple' },
      { label: 'Component calls use(resource)', tone: 'cyan' },
      { label: 'Resource is already pending or fulfilled', tone: 'green' },
    ]}
  />
</VisualDiagram>

The data/cache layer owns starting the resource; `use` owns reading it during render.

## Loading and error boundaries

```jsx
<ErrorBoundary fallback={<ProductError />}>
  <Suspense fallback={<ProductSkeleton />}>
    <Product productPromise={productPromise} />
  </Suspense>
</ErrorBoundary>
```

<VisualDiagram title="Boundary responsibilities" compact>
  <DiagramGrid columns={2}>
    <DiagramNode title="Suspense Boundary" tone="purple">Expected waiting state.</DiagramNode>
    <DiagramNode title="Error Boundary" tone="red">Failed rendering/resource state.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Boundary granularity matters. Prefer meaningful reveal units rather than one giant fallback around the whole app.

## `use` and concurrency

Suspending render work participates in React's concurrent rendering model. Learn `use` alongside Suspense, Transitions, `useDeferredValue`, streaming, selective hydration, and Server Components.

## Production decision guide

<DecisionTree
  question="Should I build around use(Promise)?"
  items={[
    { label: 'Framework/data layer already owns data loading and cache?', value: 'Use its supported pattern' },
    { label: 'Need a conventional client/server-state flow only?', value: 'Suspense integration may be unnecessary' },
    { label: 'Intentionally building Suspense-compatible resource reading?', value: 'Stable resource + use + Suspense + Error Boundary' },
    { label: 'Creating Promise directly during render?', value: 'Redesign around cached resource identity' },
  ]}
/>

## Common mistakes

- Creating uncached Promises during render.
- Treating `use` as a fetch/cache/invalidation system.
- Assuming Effect-based fetches trigger Suspense.
- Calling ordinary Hooks conditionally because `use` can be conditional.
- Reading Promise internals instead of passing the Promise to `use`.
- Treating a tutorial `Map` as production cache architecture.

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
