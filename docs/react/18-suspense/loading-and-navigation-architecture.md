---
title: Suspense Loading and Navigation Architecture
description: Design production loading UX with nested Suspense boundaries, transitions, stale content, keys, route navigation, and Error Boundaries.
sidebar_position: 3
---

# Suspense loading and navigation architecture

Knowing the `<Suspense>` API is not enough for production systems.

You also need to decide:

- what stays visible;
- what may show a skeleton;
- what reveals together;
- what reveals independently;
- when old content should remain visible;
- when content should reset because it represents a different identity;
- where errors are recovered.

This chapter turns Suspense into an application architecture tool.

## Start with the user-visible loading sequence

Before writing boundaries, sketch the desired experience.

Example dashboard:

```text
1. navigation + page shell appear immediately
2. profile summary appears
3. analytics panels reveal independently
4. recent activity can arrive last
```

Your boundary tree should reflect that experience.

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

A large boundary says:

> These children should appear as one coordinated unit.

Several smaller boundaries say:

> These regions may reveal independently.

Neither is universally better.

Too coarse:

```text
one slow widget delays the whole route
```

Too fine:

```text
dozens of tiny skeletons flicker independently
```

Good boundary placement aligns with meaningful visual regions.

## Keep already useful UI visible

Suppose the current artist page is visible. The user navigates to another route and the next route suspends.

If the route update is urgent, React may replace the already visible content with the nearest fallback.

For navigation, that can feel like:

```text
page
→ full spinner
→ page
```

Marking navigation as a Transition lets React keep already revealed content visible while the new route prepares.

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

The important UX rule is:

> Preserving previous content does not mean hiding progress.

If the old page remains visible, show pending feedback somewhere stable.

## Transitions do not wait for every nested boundary

A Transition can prevent already revealed content from disappearing behind an unwanted fallback.

But it does not mean “wait until the entire next page and every nested resource are finished.”

New nested boundaries may still reveal their own fallbacks.

That is useful because it allows progressive navigation:

```text
old route remains visible while route shell prepares
→ new route shell commits
→ inner panels continue loading with local skeletons
```

## Stale content can be better than fallback replacement

For search, filtering, charts, and data exploration, the old content may still be useful while fresh content loads.

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

Now the input updates immediately while results lag behind.

This changes the experience from:

```text
results → skeleton → new results
```

to:

```text
results → visibly stale results → new results
```

## Stale UI must be communicated

If old content remains visible, users should not mistake it for current data.

Possible signals:

- opacity change;
- subtle progress bar;
- `aria-busy`;
- “Updating…” text;
- disabled actions that would be unsafe against stale data.

Do not simply leave old values visible with no indication when freshness matters.

## Reset boundaries for genuinely different identity

Transitions intentionally preserve already revealed content.

Sometimes that is the wrong behavior.

Navigating from user `42` to user `99` represents different content identity.

A key can tell React to treat it as a fresh subtree:

```jsx
<ProfilePage key={userId} userId={userId} />
```

This can reset component state and allow the appropriate Suspense fallback to appear for the new identity.

The same principle applies to:

- account switching;
- workspace switching;
- tenant switching;
- document IDs;
- route parameters that represent different entities.

## Keys are not “force refresh” buttons

Use a key when identity truly changes.

Bad:

```jsx
<Component key={Date.now()} />
```

That destroys state every render and defeats React identity.

Good:

```jsx
<OrderDetails key={orderId} orderId={orderId} />
```

## Error Boundaries belong beside loading architecture

Suspense handles pending work.

Error Boundaries handle failed work.

A production region often needs both:

```text
Error Boundary
└── Suspense Boundary
    └── async/lazy region
```

Example conceptual structure:

```jsx
<RouteErrorBoundary>
  <Suspense fallback={<RouteSkeleton />}>
    <RouteContent />
  </Suspense>
</RouteErrorBoundary>
```

The exact Error Boundary implementation may come from a framework or application-level class/component abstraction.

## Loading fallback quality matters

A good fallback preserves spatial expectations.

Prefer:

- skeletons matching approximate final shape;
- stable container dimensions;
- route shells that do not disappear;
- localized fallback where possible.

Avoid:

- unnecessary full-screen spinners;
- layouts that jump dramatically on reveal;
- loaders with no relationship to the pending region.

## Avoid waterfalls in loading architecture

Suspense can reveal progressively, but it cannot magically fix sequential resource discovery.

A bad route can still do:

```text
load route code
→ render route
→ discover data request
→ data returns
→ discover chart code
→ chart loads
```

Better systems start independent work earlier or in parallel.

Framework loaders, route prefetching, module preloading, and server rendering can help.

## Navigation should usually be a Transition

Suspense-aware routers generally mark navigation as a Transition because:

- navigation is usually non-urgent relative to current input;
- rendering can be interrupted if the user changes destination;
- already revealed layout can remain visible;
- pending state can be surfaced explicitly.

If you use a framework router, it may already integrate these concepts for you.

## Do not Transition text input control

Text input updates must remain urgent.

Bad:

```jsx
startTransition(() => {
  setQuery(event.target.value);
});
```

Better:

```jsx
setQuery(event.target.value);
```

Then defer the expensive dependent work:

```jsx
const deferredQuery = useDeferredValue(query);
```

## Loading architecture across route layers

A useful route hierarchy might be:

```text
Application shell
├── global error boundary
├── global Suspense fallback
└── route layout
    ├── route pending indicator
    └── route error boundary
        └── route Suspense boundary
            ├── primary content
            └── nested panel boundaries
```

Not every application needs every layer, but thinking in layers helps avoid one giant fallback.

## Streaming changes the same architecture, not the mental model

With streaming server rendering, boundaries can define what server HTML may be sent and revealed progressively.

The client-side UX questions stay familiar:

- which region can reveal first?
- which content may wait?
- what shell stays stable?
- what should be interactive first?

We cover streaming implementation in the SSR phase.

## Boundary debugging checklist

If navigation or loading feels wrong, ask:

1. Which update caused suspension?
2. Was that update urgent or a Transition?
3. Which Suspense boundary is closest?
4. Was the boundary already showing real content?
5. Is a new nested boundary allowed to show fallback?
6. Does a key reset identity?
7. Is stale content acceptable here?
8. Is the pending state communicated?
9. Is there a request or chunk waterfall?
10. Is failure handled separately from loading?

## Production example: search page

Desired behavior:

```text
input always responsive
old results remain visible
results dim while stale
new results replace old ones when ready
errors show local recovery UI
```

Architecture:

```text
Search input → urgent state
useDeferredValue → non-urgent results value
Suspense → first-load/local loading boundary
Error Boundary → failed results recovery
```

## Production example: settings navigation

Desired behavior:

```text
settings shell remains stable
sidebar click responds immediately
old panel remains while new panel prepares
pending indicator appears in navigation
new panel may show nested skeletons
```

Architecture:

```text
navigation → Transition
route content → Suspense
heavy subpanels → nested Suspense
route failure → Error Boundary
```

## Exercise

Build a mini router with three pages:

- Overview;
- Reports;
- Team.

Make Reports lazy and give it a slow Promise-backed resource.

Then implement:

1. a root Suspense boundary;
2. route-level Suspense;
3. Transition-based navigation;
4. a pending navigation indicator;
5. a keyed Team profile route;
6. an Error Boundary around route content.

Explain which UI stays visible during every stage.

## Interview questions

**Beginner:** Why might a nested Suspense boundary be better than one root spinner?

**Intermediate:** How do Transitions change the behavior of already revealed Suspense content?

**Senior:** Design the loading architecture for a multi-tenant analytics application where route shell, tenant identity, charts, and activity feeds have different loading and reset requirements.

## Summary

```text
Design the loading sequence before the boundary tree.
Transitions preserve already useful content during non-urgent updates.
Deferred values let one part of the UI lag behind another.
Keys reset genuinely different identity.
Error Boundaries handle failure; Suspense handles pending work.
Good loading architecture minimizes destructive fallbacks and waterfalls.
```

## References

- https://react.dev/reference/react/Suspense
- https://react.dev/reference/react/useTransition
- https://react.dev/reference/react/useDeferredValue
- https://react.dev/reference/react/startTransition

## Next

Next, go deeper into Transition scheduling and interruption.