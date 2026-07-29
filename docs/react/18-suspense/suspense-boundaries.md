---
title: Suspense Boundaries and Reveal Behavior
description: Deep mental model for React Suspense boundaries, fallbacks, reveal behavior, nested boundaries, state, effects, and production loading UX.
sidebar_position: 1
---

import {
  VisualDiagram,
  DiagramStack,
  DiagramGrid,
  DiagramNode,
  DiagramArrow,
  DecisionTree,
  LifecycleBar,
} from '@site/src/components/handbook/VisualDiagram'

# Suspense boundaries and reveal behavior

`<Suspense>` lets React temporarily show a fallback while part of a render is not ready.

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

<VisualDiagram title="Suspense coordinates readiness and reveal" subtitle="The fallback is temporary UI; the boundary is the architectural unit.">
  <DiagramStack align="center">
    <DiagramNode title="Render subtree" tone="blue" />
    <DiagramArrow label="resource/code not ready" />
    <DiagramNode title="Suspend" tone="orange">React finds the closest Suspense boundary.</DiagramNode>
    <DiagramArrow label="temporarily reveal" />
    <DiagramNode title="Fallback" tone="gray" />
    <DiagramArrow label="work becomes ready" />
    <DiagramNode title="Retry render → reveal content" tone="green" />
  </DiagramStack>
</VisualDiagram>

## What can suspend?

Stable Suspense can participate in work such as:

- a component loaded with `lazy`;
- a Promise read with `use`;
- Suspense-enabled framework data sources;
- stylesheet loading React coordinates;
- streaming server-rendered content that has not reached the client yet.

Suspense does **not** automatically detect ordinary fetching started in an Effect or event handler.

```jsx
useEffect(() => {
  fetch('/api/products').then(/* ... */);
}, []);
```

That is ordinary explicit loading-state code, not Suspense-driven rendering.

## The closest boundary handles suspension

```jsx
<Suspense fallback={<PageSkeleton />}>
  <Header />

  <Suspense fallback={<ResultsSkeleton />}>
    <SearchResults />
  </Suspense>
</Suspense>
```

<VisualDiagram title="Suspension walks upward to the closest boundary">
  <DiagramStack align="center">
    <DiagramNode title="SearchResults suspends" tone="orange" />
    <DiagramArrow label="nearest boundary" />
    <DiagramNode title="Results Suspense" tone="purple">Shows <code>ResultsSkeleton</code>.</DiagramNode>
    <DiagramArrow label="surrounding content stays revealed" />
    <DiagramNode title="Header + page shell remain visible" tone="green" />
  </DiagramStack>
</VisualDiagram>

If the inner fallback itself suspends, React continues upward to the next Suspense boundary.

## Reveal order is UX architecture

A single large boundary coordinates one reveal. Nested boundaries allow staged reveal.

<VisualDiagram title="One boundary vs staged reveal">
  <DiagramGrid columns={2}>
    <DiagramNode title="Single boundary" tone="orange" eyebrow="COORDINATED">
      Wait for the whole region, then reveal it together.
    </DiagramNode>
    <DiagramNode title="Nested boundaries" tone="green" eyebrow="PROGRESSIVE">
      Shell → biography → albums → recommendations can reveal in meaningful stages.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Do not wrap every component in Suspense. A boundary should correspond to a loading state the user understands.

## First-mount suspension and state

If a tree suspends before its first successful mount, React retries later; state from the incomplete render attempt is not preserved as mounted state.

<VisualDiagram title="A first render can be attempted more than once">
  <DiagramStack align="center">
    <DiagramNode title="First render attempt" tone="blue" />
    <DiagramArrow label="suspends before commit" />
    <DiagramNode title="No mounted state yet" tone="orange" />
    <DiagramArrow label="resource resolves" />
    <DiagramNode title="React retries" tone="purple" />
    <DiagramArrow label="successful commit" />
    <DiagramNode title="Mounted UI + state" tone="green" />
  </DiagramStack>
</VisualDiagram>

This is one reason rendering must remain pure.

## Already visible content may suspend again

If an already revealed region suspends during an urgent update, React may need to replace it with the boundary fallback.

<VisualDiagram title="Why transitions and deferred values matter">
  <DiagramGrid columns={2}>
    <DiagramNode title="Urgent suspending update" tone="red">
      Visible results → fallback/skeleton → fresh results.
    </DiagramNode>
    <DiagramNode title="Non-urgent coordinated update" tone="green">
      Visible results stay useful → pending/stale feedback → fresh results.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

`useTransition` and `useDeferredValue` help express when old content is still useful while the next render prepares.

## Layout Effects and hidden Suspense content

If React hides already visible content because it suspended again, layout Effects in that hidden subtree are cleaned up. When the content becomes visible again, layout Effects run again.

```jsx
useLayoutEffect(() => {
  const rect = ref.current.getBoundingClientRect();
  // measure currently visible committed layout
}, []);
```

<LifecycleBar
  title="Layout-effect lifecycle when revealed content is hidden"
  items={[
    { label: 'Visible commit', tone: 'green' },
    { label: 'Suspend again', tone: 'orange' },
    { label: 'Layout cleanup', tone: 'red' },
    { label: 'Reveal again', tone: 'purple' },
    { label: 'Layout setup again', tone: 'green' },
  ]}
/>

## Suspense and Effects solve different problems

<VisualDiagram title="Reveal coordination is not synchronization">
  <DiagramGrid columns={2}>
    <DiagramNode title="Suspense" tone="purple" eyebrow="RENDER / REVEAL">
      When is this subtree ready to be shown?
    </DiagramNode>
    <DiagramNode title="Effect" tone="orange" eyebrow="AFTER COMMIT">
      Which external system must be synchronized with committed UI/state?
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Suspense and Error Boundaries

Suspense handles **not ready yet**. Error Boundaries handle **failed rendering/resource work**.

<VisualDiagram title="A production async region often needs both">
  <DiagramStack align="center">
    <DiagramNode title="Error Boundary" tone="red">Owns failure recovery.</DiagramNode>
    <DiagramArrow label="contains" />
    <DiagramNode title="Suspense Boundary" tone="orange">Owns pending/reveal UX.</DiagramNode>
    <DiagramArrow label="contains" />
    <DiagramNode title="Async / lazy region" tone="blue" />
  </DiagramStack>
</VisualDiagram>

A rejected lazy import or failed resource should surface to an appropriate error boundary rather than being treated as loading forever.

## Suspense does not define caching

Suspense coordinates rendering when work is not ready. It does not decide:

- cache lifetime;
- request deduplication;
- staleness;
- retries;
- mutation invalidation.

Those belong to the framework or data layer.

## Suspense and server rendering

Suspense is also part of streaming SSR and hydration architecture.

<VisualDiagram title="Suspense spans client and server reveal architecture">
  <DiagramStack align="center">
    <DiagramNode title="Server renders what is ready" tone="blue" />
    <DiagramArrow label="stream boundaries progressively" />
    <DiagramNode title="Browser receives shell + later content" tone="teal" />
    <DiagramArrow label="hydrate available regions" />
    <DiagramNode title="Interactive UI reveals progressively" tone="green" />
  </DiagramStack>
</VisualDiagram>

The SSR section covers the server APIs in detail.

## Boundary placement decision

<DecisionTree
  title="Should this region have its own Suspense boundary?"
  items={[
    { question: 'Is this a meaningful user-visible region that may be unavailable independently?', yes: 'Continue', no: 'Prefer the surrounding boundary' },
    { question: 'Should it reveal independently from its siblings?', yes: 'Own boundary is a strong candidate', no: 'Coordinate them in one boundary' },
    { question: 'Is already visible content still useful during refresh/navigation?', yes: 'Consider Transition/deferred stale UI', no: 'Fallback replacement may be appropriate' },
    { question: 'Can the region fail independently?', yes: 'Pair with an Error Boundary', no: 'Use the nearest suitable recovery boundary' },
  ]}
/>

## Common mistakes

### Giant root spinner

```jsx
<Suspense fallback={<FullScreenSpinner />}>
  <EntireApplication />
</Suspense>
```

A root boundary can be a last resort, but relying only on it makes unrelated regions disappear together.

### Expecting Effect fetching to suspend

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

This is explicit loading-state code. That is valid—just know which model you are using.

### Destructive fallback replacement

If a small nested region suspends, avoid replacing a useful whole page with a spinner. Prefer stable shells, localized skeletons, or stale-but-useful content when correct.

## Debugging Suspense

When a fallback appears unexpectedly, inspect:

1. Which child suspended?
2. Which boundary is closest?
3. Was the update urgent or a Transition?
4. Is the Promise/resource identity stable?
5. Did a key reset the subtree?
6. Was a lazy component declared inside another component?
7. Can the fallback itself suspend?

## Production design principle

Good Suspense architecture tends to produce stable shells, localized skeletons, progressive reveal, visible navigation feedback, stale-but-useful content when appropriate, and separate error recovery.

## Exercise

Build a dashboard with profile, notifications, sales chart, and recent activity. Start with one Suspense boundary, then redesign it with nested boundaries and explain each boundary from the user's perspective.

## Interview questions

**Beginner:** What does `<Suspense>` render while its children are not ready?

**Intermediate:** What kinds of work activate Suspense, and why does fetching inside `useEffect` not automatically do so?

**Senior:** How would you place Suspense boundaries for a route with navigation, cached content, streaming server data, and independently slow panels?

## Summary

<VisualDiagram title="Suspense mental model">
  <DiagramStack align="center">
    <DiagramNode title="Boundary = reveal contract" tone="purple" />
    <DiagramArrow label="closest boundary owns pending UI" />
    <DiagramNode title="Nested boundaries = staged reveal" tone="blue" />
    <DiagramArrow label="Transitions/deferred values can preserve useful content" />
    <DiagramNode title="Error handling and caching remain separate responsibilities" tone="green" />
  </DiagramStack>
</VisualDiagram>

## References

- https://react.dev/reference/react/Suspense
- https://react.dev/reference/react/use
- https://react.dev/reference/react/lazy

## Next

Next, learn how `lazy` combines code splitting with Suspense.