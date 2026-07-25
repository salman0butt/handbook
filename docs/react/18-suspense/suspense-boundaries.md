---
title: Suspense Boundaries and Reveal Behavior
description: Deep mental model for React Suspense boundaries, fallbacks, reveal behavior, nested boundaries, state, effects, and production loading UX.
sidebar_position: 1
---

# Suspense boundaries and reveal behavior

`<Suspense>` lets React temporarily show a fallback while some part of a render is not ready yet.

The important mental model is not “Suspense is a spinner component.” It is:

> **A Suspense boundary is a reveal boundary.** It coordinates when a subtree may become visible.

```jsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageContent />
    </Suspense>
  );
}
```

The fallback is only one part of the behavior. The real design question is: **which pieces of UI should reveal together, and which may reveal independently?**

## What can suspend?

In modern React, stable Suspense can be activated by work such as:

- a component loaded with `lazy`;
- a Promise read with `use`;
- Suspense-enabled framework data sources;
- stylesheet loading when React is coordinating stylesheet precedence;
- streaming server-rendered content that has not reached the client yet.

Suspense does **not** automatically detect ordinary fetching started inside an Effect or an event handler.

```jsx
useEffect(() => {
  fetch('/api/products').then(/* ... */);
}, []);
```

That fetch does not suspend just because it is asynchronous.

## The closest boundary handles suspension

When a child suspends during rendering, React looks upward for the closest Suspense boundary.

```jsx
<Suspense fallback={<PageSkeleton />}>
  <Header />

  <Suspense fallback={<ResultsSkeleton />}>
    <SearchResults />
  </Suspense>
</Suspense>
```

If `SearchResults` suspends, the inner boundary can show `ResultsSkeleton` while the surrounding page remains visible.

If the inner fallback itself suspends, React continues upward to the next Suspense boundary.

## Suspense coordinates reveal order

Imagine a profile page with biography, albums, recommendations, and comments.

A single boundary means:

```text
wait until everything inside is ready
then reveal all of it together
```

Nested boundaries let you define staged reveal:

```text
page shell
  ↓
biography
  ↓
albums
  ↓
recommendations
```

This is a UX decision, not merely a code organization decision.

## Do not wrap every component in Suspense

A boundary should normally correspond to a meaningful loading experience.

Bad mental model:

```text
component → boundary
component → boundary
component → boundary
```

Better mental model:

```text
loading state the user understands → boundary
```

If five components form one coherent card, revealing them together may feel better than letting each component flash independently.

## First mount suspension and state

If a tree suspends before it mounts for the first time, React does not preserve state from that incomplete render attempt.

React retries the render when the suspended work becomes ready.

This matters when debugging code that appears to “run again” before the user ever saw the component.

## Already visible content may suspend again

Suppose a search results page is already visible and a new query causes the result subtree to suspend.

Without special handling, React may replace the visible content with the boundary fallback.

That can feel jarring:

```text
results visible
→ user types
→ whole area becomes skeleton
→ new results appear
```

For non-urgent updates, React provides `useDeferredValue` and Transitions so you can often keep already revealed content visible while new work happens.

## Layout Effects and hidden Suspense content

If React must hide already visible content because it suspended again, React cleans up layout Effects in that hidden subtree.

When the content becomes visible again, those layout Effects run again.

This prevents layout-measuring code from assuming hidden DOM is still safe to measure.

```jsx
useLayoutEffect(() => {
  const rect = ref.current.getBoundingClientRect();
  // measurement belongs to currently visible committed layout
}, []);
```

## Suspense and ordinary Effects are different systems

Do not treat Suspense as an Effect replacement.

Suspense participates in **render/reveal coordination**.

Effects run after a committed render to synchronize with external systems.

```text
Suspense → when can this subtree be revealed?
Effect   → after commit, what external system must be synchronized?
```

## Error boundaries and Suspense boundaries solve different failures

Suspense handles “not ready yet.”

Error Boundaries handle render failures.

A Promise that is still pending causes suspension. A rejected lazy import or failed resource can surface as an error and should be handled by an Error Boundary.

A production route often needs both concepts:

```text
Route Error Boundary
└── Suspense boundary
    └── route content
```

## Suspense does not define your caching strategy

Suspense tells React how to coordinate rendering when work is not ready.

It does not answer:

- how long data should stay cached;
- how requests are deduplicated;
- when data becomes stale;
- how retries work;
- how mutations invalidate cached data.

Those are framework or data-layer responsibilities.

## Suspense and server rendering

Suspense is integrated with React's server rendering architecture.

A server can stream parts of the document progressively, and the client can hydrate available sections selectively instead of requiring the whole application to become ready as one block.

The detailed server APIs belong in the SSR phase of this handbook, but keep this mental model now:

```text
Suspense is not only a client spinner mechanism.
It is also a coordination primitive used by streaming and hydration.
```

## Boundary placement checklist

Before adding a boundary, ask:

1. What user-visible region is allowed to wait?
2. Should this region reveal together or independently?
3. Is there already useful content that should remain visible?
4. Is the fallback stable enough to avoid layout shift?
5. Does navigation need to reset this boundary?
6. Does an Error Boundary exist for failure rather than loading?
7. Is the suspending data/code source actually Suspense-enabled?

## Common mistake: giant root spinner

```jsx
<Suspense fallback={<FullScreenSpinner />}>
  <EntireApplication />
</Suspense>
```

A root boundary can be useful as a last resort, but relying only on it often causes unrelated parts of the application to disappear together.

Prefer meaningful nested boundaries around route content, panels, or expensive regions.

## Common mistake: expecting Effect fetching to suspend

```jsx
function Products() {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  if (!products) return <Spinner />;

  return <ProductList products={products} />;
}
```

This is explicit loading-state code, not Suspense.

That is not inherently wrong. The key is to know which model you are using.

## Common mistake: fallback that is too destructive

If a transition replaces a whole page with a spinner, users lose context.

Prefer skeletons that preserve layout or use transitions/deferred values to retain already revealed content where appropriate.

## Debugging Suspense

When a fallback appears unexpectedly, inspect:

- which child actually suspended;
- which boundary is closest;
- whether the update was urgent or a Transition;
- whether the suspending Promise is stable/cached;
- whether a key reset the subtree;
- whether a lazy component was declared inside another component;
- whether your fallback itself can suspend.

## Production design principle

Loading architecture should be designed with the same care as success-state UI.

Good Suspense architecture often produces:

- stable page shells;
- localized skeletons;
- progressive reveal;
- visible navigation feedback;
- stale-but-useful content instead of unnecessary replacement;
- clear recovery paths for failures.

## Exercise

Build a dashboard containing:

- a profile summary;
- a notifications panel;
- a sales chart;
- recent activity.

Create a single-boundary version first. Then redesign it with nested boundaries so the page shell and profile appear before slower analytical panels.

Explain why each boundary exists from the user's perspective.

## Interview questions

**Beginner:** What does `<Suspense>` render while its children are not ready?

**Intermediate:** What kinds of work activate Suspense, and why does fetching inside `useEffect` not automatically do so?

**Senior:** How would you decide Suspense boundary placement for a route that combines navigation, cached content, streaming server data, and several independently slow panels?

## Summary

```text
Suspense is a reveal boundary.
The closest boundary handles suspension.
Nested boundaries define loading/reveal sequences.
Do not expect ordinary Effect fetching to suspend.
Transitions and deferred values can preserve already revealed content.
Suspense loading and Error Boundary failure handling are different concerns.
Boundary placement is UX architecture.
```

## References

- https://react.dev/reference/react/Suspense
- https://react.dev/reference/react/use
- https://react.dev/reference/react/lazy

## Next

Next, learn how `lazy` combines code splitting with Suspense.