---
title: Suspense Loading and Navigation Architecture
description: Design production loading UX with nested Suspense boundaries, transitions, stale content, keys, route navigation, and Error Boundaries.
sidebar_position: 3
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

# Suspense loading and navigation architecture

Knowing the `<Suspense>` API is not enough for production systems. You also need to decide what stays visible, what may show a skeleton, what reveals together, when old content remains useful, when identity must reset, and where failure recovery lives.

## Design the user-visible sequence first

<VisualDiagram title="Boundary trees should follow the experience users see">
  <DiagramStack align="center">
    <DiagramNode title="1 · Navigation + page shell" tone="green" />
    <DiagramArrow label="first meaningful content" />
    <DiagramNode title="2 · Profile summary" tone="blue" />
    <DiagramArrow label="independent regions" />
    <DiagramNode title="3 · Analytics panels" tone="purple" />
    <DiagramArrow label="slowest region" />
    <DiagramNode title="4 · Recent activity" tone="orange" />
  </DiagramStack>
</VisualDiagram>

```jsx
<PageShell>
  <Suspense fallback={<ProfileSkeleton />}>
    <Profile />
  </Suspense>

  <DashboardGrid>
    <Suspense fallback={<ChartSkeleton />}>
      <RevenueChart />
    </Suspense>

    <Suspense fallback={<ActivitySkeleton />}>
      <RecentActivity />
    </Suspense>
  </DashboardGrid>
</PageShell>
```

## Boundary granularity is a UX contract

<VisualDiagram title="Too coarse, too fine, or meaningful">
  <DiagramGrid columns={3}>
    <DiagramNode title="Too coarse" tone="red">One slow widget delays or replaces a whole route.</DiagramNode>
    <DiagramNode title="Meaningful regions" tone="green">Panels reveal independently where users understand the separation.</DiagramNode>
    <DiagramNode title="Too fine" tone="orange">Dozens of tiny skeletons flicker and create visual noise.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Boundary placement should align with user-visible loading units, not arbitrary component boundaries.

## Keep useful UI visible during navigation

A route update that suspends can replace already visible content with a fallback. Marking navigation as a Transition lets React prepare the next route without unnecessarily destroying the current one.

```jsx
import { useTransition } from 'react';

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(nextPage) {
    startTransition(() => {
      setPage(nextPage);
    });
  }

  return (
    <Layout pending={isPending}>
      <Route page={page} navigate={navigate} />
    </Layout>
  );
}
```

<VisualDiagram title="Transition-based route preparation">
  <DiagramStack align="center">
    <DiagramNode title="Current route stays revealed" tone="green" />
    <DiagramArrow label="user navigates" />
    <DiagramNode title="Next route prepares as non-urgent work" tone="purple" />
    <DiagramArrow label="stable pending feedback remains visible" />
    <DiagramNode title="Next route shell commits" tone="blue" />
    <DiagramArrow label="nested boundaries may keep loading" />
    <DiagramNode title="Panels progressively reveal" tone="teal" />
  </DiagramStack>
</VisualDiagram>

Preserving old content does **not** mean hiding progress. Show pending feedback in navigation or another stable region.

## Transitions do not wait for every nested boundary

A Transition can protect already revealed outer UI from an unwanted fallback, while new nested boundaries still show their own loading states.

<LifecycleBar
  items={[
    { label: 'Old route visible', tone: 'green' },
    { label: 'Transition starts', tone: 'purple' },
    { label: 'New route shell commits', tone: 'blue' },
    { label: 'Nested skeletons may remain', tone: 'orange' },
    { label: 'Panels reveal independently', tone: 'teal' },
  ]}
/>

## Stale content can be better than fallback replacement

For search, filtering, charts, and exploration, old results may remain useful while fresh results prepare.

```jsx
const deferredQuery = useDeferredValue(query);
const isStale = query !== deferredQuery;

return (
  <Suspense fallback={<ResultsSkeleton />}>
    <div aria-busy={isStale} style={{ opacity: isStale ? 0.6 : 1 }}>
      <SearchResults query={deferredQuery} />
    </div>
  </Suspense>
);
```

<VisualDiagram title="Fallback replacement vs stale-but-useful UI">
  <DiagramGrid columns={2}>
    <DiagramNode title="Replacement" tone="orange">Results → skeleton → fresh results.</DiagramNode>
    <DiagramNode title="Deferred stale UI" tone="green">Results → visibly stale results → fresh results.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

If stale content stays visible, communicate that state with opacity, `aria-busy`, an “Updating…” label, or another appropriate signal.

## Reset for genuinely different identity

Transitions preserve useful content. Sometimes that is wrong because the entity itself changed.

```jsx
<ProfilePage key={userId} userId={userId} />
```

<VisualDiagram title="Keys express identity, not refresh intent">
  <DiagramGrid columns={2}>
    <DiagramNode title="Same identity" tone="green">Preserve state while preparing updated presentation.</DiagramNode>
    <DiagramNode title="Different identity" tone="purple">A meaningful key can reset the subtree and its state.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Do not use unstable keys like `Date.now()` as “force refresh” buttons.

## Loading and failure architecture belong together

<VisualDiagram title="Pending and failed work need different boundaries">
  <DiagramStack align="center">
    <DiagramNode title="Route Error Boundary" tone="red">Owns failed work and recovery.</DiagramNode>
    <DiagramArrow label="contains" />
    <DiagramNode title="Route Suspense Boundary" tone="orange">Owns pending/reveal UX.</DiagramNode>
    <DiagramArrow label="contains" />
    <DiagramNode title="Async or lazy route content" tone="blue" />
  </DiagramStack>
</VisualDiagram>

```jsx
<RouteErrorBoundary>
  <Suspense fallback={<RouteSkeleton />}>
    <RouteContent />
  </Suspense>
</RouteErrorBoundary>
```

## Loading architecture cannot fix waterfalls by itself

Suspense can reveal progressively, but sequential resource discovery is still sequential.

<VisualDiagram title="A request/code waterfall delays every later stage">
  <DiagramStack align="center">
    <DiagramNode title="Load route code" tone="blue" />
    <DiagramArrow label="render discovers data" />
    <DiagramNode title="Wait for data" tone="orange" />
    <DiagramArrow label="data render discovers chart code" />
    <DiagramNode title="Wait for chart chunk" tone="purple" />
    <DiagramArrow label="finally" />
    <DiagramNode title="Complete region" tone="green" />
  </DiagramStack>
</VisualDiagram>

Start independent work early where the framework/data architecture allows it. Route prefetching, module preloading, server rendering, and parallel data work can all reduce discovery waterfalls.

## Navigation priority

Text input control remains urgent.

Bad:

```jsx
startTransition(() => {
  setQuery(event.target.value);
});
```

Better:

```jsx
setQuery(event.target.value);
const deferredQuery = useDeferredValue(query);
```

<DecisionTree
  question="Which priority model fits the interaction?"
  items={[
    { label: 'Controlled input / checkbox / drag feedback', value: 'Urgent update' },
    { label: 'Route or expensive tab content you initiate', value: 'Transition' },
    { label: 'Value is already urgent but one consumer may lag', value: 'useDeferredValue' },
    { label: 'New entity identity should reset state', value: 'Meaningful key' },
  ]}
/>

## Route-layer mental model

<VisualDiagram title="Layer loading architecture from broad recovery to local reveal">
  <DiagramStack align="center">
    <DiagramNode title="Application shell" tone="green" />
    <DiagramArrow label="global recovery / last-resort pending" />
    <DiagramNode title="Route layout + pending indicator" tone="blue" />
    <DiagramArrow label="route-level failure and reveal" />
    <DiagramNode title="Route Error Boundary + Suspense" tone="purple" />
    <DiagramArrow label="independent slow regions" />
    <DiagramNode title="Nested panel boundaries" tone="orange" />
  </DiagramStack>
</VisualDiagram>

Not every app needs every layer. The point is to avoid making one root fallback responsible for every loading experience.

## Production patterns

### Search

<VisualDiagram title="Search architecture">
  <DiagramGrid columns={4}>
    <DiagramNode title="Input" tone="blue">Urgent canonical query.</DiagramNode>
    <DiagramNode title="Deferred value" tone="purple">Results may lag.</DiagramNode>
    <DiagramNode title="Suspense" tone="orange">First-load/local pending UI.</DiagramNode>
    <DiagramNode title="Error Boundary" tone="red">Failed results recovery.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

### Settings navigation

<VisualDiagram title="Settings navigation architecture">
  <DiagramGrid columns={4}>
    <DiagramNode title="Navigation" tone="purple">Transition.</DiagramNode>
    <DiagramNode title="Shell" tone="green">Remains stable.</DiagramNode>
    <DiagramNode title="Route panel" tone="orange">Suspense boundary.</DiagramNode>
    <DiagramNode title="Heavy subpanels" tone="blue">Nested boundaries.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Debugging checklist

If loading/navigation feels wrong, ask:

1. Which update caused suspension?
2. Was it urgent or a Transition?
3. Which Suspense boundary is closest?
4. Was that boundary already showing real content?
5. Can nested boundaries show local fallbacks?
6. Did a key intentionally reset identity?
7. Is stale content acceptable and communicated?
8. Is pending state visible?
9. Is there a request/chunk waterfall?
10. Is failure handled separately from loading?

## Exercise

Build a mini router with Overview, Reports, and Team. Make Reports lazy with a slow Promise-backed resource, then add route Suspense, Transition navigation, pending feedback, keyed Team identity, and an Error Boundary.

## Interview questions

**Beginner:** Why might nested Suspense boundaries be better than one root spinner?

**Intermediate:** How do Transitions change already revealed Suspense content?

**Senior:** Design loading architecture for a multi-tenant analytics app where shell, tenant identity, charts, and feeds have different loading and reset requirements.

## Summary

<VisualDiagram title="Production loading architecture">
  <DiagramStack align="center">
    <DiagramNode title="Design the user-visible sequence" tone="blue" />
    <DiagramArrow label="map meaningful regions" />
    <DiagramNode title="Place Suspense + Error boundaries" tone="purple" />
    <DiagramArrow label="express update priority" />
    <DiagramNode title="Transition / deferred value / key" tone="orange" />
    <DiagramArrow label="measure real bottlenecks" />
    <DiagramNode title="Reduce waterfalls and destructive fallbacks" tone="green" />
  </DiagramStack>
</VisualDiagram>

## References

- https://react.dev/reference/react/Suspense
- https://react.dev/reference/react/useTransition
- https://react.dev/reference/react/useDeferredValue
- https://react.dev/reference/react/startTransition

## Next

Next, go deeper into Transition scheduling and interruption.