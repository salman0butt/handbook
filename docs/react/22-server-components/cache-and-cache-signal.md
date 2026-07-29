---
title: cache, cacheSignal, and Server Render Lifetimes
description: Learn React Server Component memoization, request-scoped cache behavior, preload patterns, cancellation with cacheSignal, and cache architecture boundaries.
sidebar_position: 3
---

import {
  VisualDiagram,
  DiagramStack,
  DiagramRow,
  DiagramGrid,
  DiagramNode,
  DiagramArrow,
  DecisionTree,
  LifecycleBar,
} from '@site/src/components/handbook/VisualDiagram'

# `cache`, `cacheSignal`, and server render lifetimes

React Server Components can perform expensive async reads during rendering. Two React APIs help coordinate that work:

- `cache(fn)` memoizes matching calls within React's relevant server render/cache lifetime;
- `cacheSignal()` exposes an `AbortSignal` tied to that lifetime.

They are **not** replacements for Redis, CDN caches, framework route caches, or database caches.

<VisualDiagram title="React cache follows the server render lifetime">
  <LifecycleBar items={[
    { label: 'Server render starts', tone: 'blue' },
    { label: 'Components request matching work', tone: 'purple' },
    { label: 'cache(fn) deduplicates matching calls', tone: 'teal' },
    { label: 'Render completes / aborts / fails', tone: 'orange' },
    { label: 'React cache lifetime ends', tone: 'red' },
    { label: 'cacheSignal aborts', tone: 'green' },
  ]} />
</VisualDiagram>

## `cache(fn)`

```jsx
import { cache } from 'react';

const getUser = cache(async id => {
  return db.users.findById(id);
});
```

Several Server Components can call the **same memoized function**:

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

When the function identity and arguments match in the same relevant React cache lifetime, the work can be reused.

## Create the memoized function once

Wrong:

```jsx
function Profile({ userId }) {
  const getUser = cache(loadUser);
  // new memoized function identity
}
```

Better:

```jsx
const getUser = cache(loadUser);
```

<VisualDiagram title="Sharing requires stable function identity and matching arguments">
  <DiagramRow>
    <DiagramNode title="Same cache wrapper" tone="purple" />
    <DiagramArrow direction="right" label="+" />
    <DiagramNode title="Same argument identity" tone="blue" />
    <DiagramArrow direction="right" label="=" />
    <DiagramNode title="Reusable result/work" tone="green" />
  </DiagramRow>
</VisualDiagram>

## Argument identity matters

Primitive keys are straightforward:

```jsx
getUser('42');
getUser('42');
```

Object literals are new identities:

```jsx
getReport({ month: 7 });
getReport({ month: 7 });
```

Prefer stable primitive keys or deliberate shared references when possible.

## Cached errors are not retries

If a cached call fails for a key, repeated callers can observe the same cached failure within that cache lifetime. Retry/backoff belongs to the data layer or framework policy.

## React cache vs persistent caches

<VisualDiagram title="Different cache layers solve different problems">
  <DiagramGrid columns={3}>
    <DiagramNode title="React cache(fn)" tone="purple" eyebrow="RENDER LIFETIME">Deduplicate server render work and share a snapshot.</DiagramNode>
    <DiagramNode title="Application / framework cache" tone="teal" eyebrow="PERSISTENT POLICY">TTL, invalidation, tags, database/Redis, cross-request reuse.</DiagramNode>
    <DiagramNode title="HTTP / CDN cache" tone="blue" eyebrow="DELIVERY">Cache responses/resources at browser or edge layers.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

A mature system may use all three. Do not treat `cache(fn)` as a permanent process-wide store.

## Snapshot consistency

Distant components can reuse one logical result during a render:

<VisualDiagram title="Many consumers can share one server snapshot">
  <DiagramStack align="center">
    <DiagramGrid columns={3}>
      <DiagramNode title="Header" tone="blue">getAccount(id)</DiagramNode>
      <DiagramNode title="Sidebar" tone="blue">getAccount(id)</DiagramNode>
      <DiagramNode title="Page" tone="blue">getAccount(id)</DiagramNode>
    </DiagramGrid>
    <DiagramArrow label="same cached function + key" />
    <DiagramNode title="One shared account read" tone="green" />
  </DiagramStack>
</VisualDiagram>

## Preloading can start useful work earlier

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

Later calls can reuse the in-flight or completed work. Preload only work likely to be needed—preloading consumes database, network, compute, and memory resources.

## `cacheSignal()`

React 19.2 added `cacheSignal` for React Server Components.

```jsx
import { cacheSignal } from 'react';

async function loadData(url) {
  const signal = cacheSignal();

  return fetch(url, {
    ...(signal ? { signal } : {}),
  });
}
```

During rendering, the signal is tied to the React cache/render lifetime. That lifetime finishes when rendering completes, aborts, or fails.

<VisualDiagram title="Cancellation follows ownership">
  <DiagramStack align="center">
    <DiagramNode title="React render owns async work" tone="purple" />
    <DiagramArrow label="render no longer needs it" />
    <DiagramNode title="cacheSignal aborts" tone="orange" />
    <DiagramArrow label="if upstream supports AbortSignal" />
    <DiagramNode title="In-flight work can stop" tone="green" />
  </DiagramStack>
</VisualDiagram>

Outside the relevant render context, `cacheSignal()` can return `null`. In Client Components, it is currently not a client-cancellation mechanism.

## Several cancellation scopes can coexist

<DiagramGrid columns={2}>
  <DiagramNode title="React lifetime" tone="purple">`cacheSignal()` says React no longer needs this render work.</DiagramNode>
  <DiagramNode title="Infrastructure lifetime" tone="blue">HTTP disconnects, route cancellation, DB/query timeouts, upstream deadlines may have separate signals.</DiagramNode>
</DiagramGrid>

A robust backend may compose multiple cancellation sources. Not every SDK or database driver supports `AbortSignal`; know the actual contract.

## Mutations and freshness are not `cache(fn)`'s job

After a Server Function changes canonical data, the framework/data layer may need route refresh, cache invalidation, revalidation, navigation, or client-cache updates.

<VisualDiagram title="Render memoization is not canonical freshness">
  <DiagramRow>
    <DiagramNode title="Server mutation" tone="orange" />
    <DiagramArrow direction="right" label="invalidate through framework/data layer" />
    <DiagramNode title="Fresh canonical read" tone="teal" />
    <DiagramArrow direction="right" label="new render may memoize" />
    <DiagramNode title="cache(fn)" tone="purple" />
  </DiagramRow>
</VisualDiagram>

## Multi-tenant cache safety

Every dimension affecting an authorized result must be represented in the safe data-access contract and cache key.

Prefer explicit keys such as:

```jsx
getDashboard(tenantId, userId, 'home');
```

A cache hit must never bypass authorization.

> Cache the result of an authorized query—not an unrestricted global lookup that callers are expected to filter later.

## Cache abuse and poisoning

Validate untrusted inputs before they influence cache keys or expensive work. Unbounded search strings, arbitrary report parameters, attacker-controlled URLs, or unchecked tenant IDs can create huge key cardinality or expensive server load.

## Aborts are not always failures

<VisualDiagram title="Observability should classify cancellation correctly">
  <DiagramGrid columns={2}>
    <DiagramNode title="Expected cancellation" tone="orange">React abandoned or completed the render and no longer needs work.</DiagramNode>
    <DiagramNode title="Infrastructure failure" tone="red">Timeout, upstream error, database outage, invalid response.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Do not alert on every expected abort as if it were a production incident.

## Cache + Suspense

<LifecycleBar items={[
  { label: 'Component calls cached async loader', tone: 'blue' },
  { label: 'Promise is shared', tone: 'teal' },
  { label: 'Render may suspend', tone: 'orange' },
  { label: 'Other components reuse work', tone: 'purple' },
  { label: 'Suspense/server rendering coordinates reveal', tone: 'green' },
]} />

## Cache + PPR

Partial pre-rendering adds another lifecycle: some work may happen during prerender and postponed work may resume later. Follow your framework's documented cache/revalidation semantics rather than extrapolating persistent behavior from React `cache()` alone.

## Decision guide

<DecisionTree
  question="Which cache/cancellation mechanism owns this problem?"
  items={[
    { label: 'Duplicate work within React server rendering', value: 'cache(fn)' },
    { label: 'Cancel work React no longer needs', value: 'cacheSignal() when supported' },
    { label: 'Cross-request TTL/invalidation', value: 'Framework/application cache' },
    { label: 'Response/resource delivery caching', value: 'HTTP/CDN policy' },
    { label: 'Client request cancellation', value: 'Client data layer / AbortController' },
  ]}
/>

## Production checklist

1. Define shared cached loaders in a stable location.
2. Use stable arguments and include tenant/user dimensions when required.
3. Authorize before exposing privileged results.
4. Validate untrusted key inputs.
5. Know whether errors can be reused in the cache lifetime.
6. Keep React memoization separate from persistent cache policy.
7. Pass `cacheSignal()` to cancellable work where useful.
8. Distinguish expected aborts from failures in observability.
9. Document mutation invalidation through framework/data-layer policy.

## Interview questions

**Junior:** What does React `cache()` do in RSC rendering?

**Mid-level:** Why do function identity and argument identity matter?

**Senior:** Explain how React render memoization, persistent caches, authorization, multi-tenant keys, Suspense, PPR, and `cacheSignal()` interact in a production route.

## Summary

<VisualDiagram title="Server render work has a bounded owner">
  <DiagramRow>
    <DiagramNode title="cache(fn)" tone="purple">Share matching work</DiagramNode>
    <DiagramArrow direction="right" label="during" />
    <DiagramNode title="React render lifetime" tone="blue" />
    <DiagramArrow direction="right" label="ends" />
    <DiagramNode title="cacheSignal abort" tone="orange">Stop work no longer needed</DiagramNode>
  </DiagramRow>
</VisualDiagram>

## References

- https://react.dev/reference/react/cache
- https://react.dev/reference/react/cacheSignal
- https://react.dev/reference/rsc/server-components
