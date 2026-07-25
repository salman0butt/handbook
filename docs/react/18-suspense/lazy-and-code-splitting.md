---
title: lazy and Code Splitting
description: Learn React lazy loading, dynamic imports, Suspense fallbacks, module boundaries, state identity, preload strategy, and production code-splitting trade-offs.
sidebar_position: 2
---

# `lazy` and code splitting

`lazy` lets React defer loading a component's code until that component is rendered for the first time.

```jsx
import { lazy, Suspense } from 'react';

const SettingsPage = lazy(() => import('./SettingsPage.js'));

export default function App() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsPage />
    </Suspense>
  );
}
```

The mental model is:

```text
normal import → load code as part of the current bundle graph
lazy import   → create a code boundary that can load later
Suspense      → define what the user sees while that code is unavailable
```

## `lazy` returns a component

```jsx
const Chart = lazy(() => import('./Chart.js'));
```

You render `Chart` like any other component.

```jsx
<Chart data={data} />
```

When React first tries to render it, the loader runs. If the module is not ready, rendering suspends until the Promise resolves.

## The module must expose the component as `default`

The loader Promise should resolve to an object whose `.default` is a valid component type.

```js
// ReportsPage.js
export default function ReportsPage() {
  return <h1>Reports</h1>;
}
```

Then:

```jsx
const ReportsPage = lazy(() => import('./ReportsPage.js'));
```

If your module only has named exports, use a deliberate adapter module or Promise mapping rather than hiding a messy module boundary throughout the application.

## Declare lazy components at module scope

Good:

```jsx
const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));

export default function Editor() {
  return <MarkdownPreview />;
}
```

Bad:

```jsx
export default function Editor() {
  const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
  return <MarkdownPreview />;
}
```

Creating the lazy component inside another component creates a new component type during rendering and can reset state unexpectedly.

The general React identity rule still applies:

> Component types should be stable across renders.

## `lazy` caches the loader result

React caches both the Promise returned by the loader and its resolved module value, so React does not call the same lazy loader repeatedly after it has resolved.

This means the fallback usually appears during the first unresolved load, not every time you re-render the already loaded component.

## Lazy loading is not the same as conditional rendering

```jsx
{showChart ? <Chart /> : null}
```

Conditional rendering decides whether a component exists in the current UI.

If `Chart` is statically imported, its code may already be in the application bundle even while `showChart` is false.

```jsx
import Chart from './Chart.js';
```

With `lazy`, the code itself can be deferred.

## Code splitting should follow meaningful product boundaries

Common boundaries include:

- routes;
- large editors;
- analytics dashboards;
- admin-only features;
- infrequently used modals;
- expensive visualization libraries;
- optional integrations.

Less useful boundaries include tiny components that are always needed immediately.

Splitting every component can create more network and scheduling overhead than it saves.

## Route-level splitting

A route is often a strong lazy boundary because the user may never visit every route in one session.

```jsx
const HomePage = lazy(() => import('./pages/HomePage.js'));
const BillingPage = lazy(() => import('./pages/BillingPage.js'));
const AdminPage = lazy(() => import('./pages/AdminPage.js'));
```

A router can coordinate route transitions with Suspense and Transitions so the old page remains usable while the next route's code/data becomes ready.

## Feature-level splitting

```jsx
const AdvancedReportBuilder = lazy(
  () => import('./reports/AdvancedReportBuilder.js')
);
```

This is useful when a large feature is only opened by a small portion of users.

## Lazy loading does not automatically make an app fast

A split bundle still has to be downloaded, parsed, and executed eventually.

Bad splitting can cause waterfalls:

```text
load route JS
→ discover chart JS
→ load chart JS
→ discover editor JS
→ load editor JS
```

Good production architecture considers:

- which code is critical for first interaction;
- which code can load in parallel;
- which code should be prefetched before likely navigation;
- which bundle sizes justify another boundary;
- how cache reuse behaves across routes.

## Suspense fallback design for code loading

Avoid a giant page-level spinner for a small lazy panel.

```jsx
<DashboardShell>
  <Suspense fallback={<ChartSkeleton />}>
    <RevenueChart />
  </Suspense>
</DashboardShell>
```

This preserves useful surrounding UI.

## Lazy errors belong to Error Boundaries

If the dynamic import Promise rejects, React throws the rejection so the nearest Error Boundary can handle it.

For example, deployment mismatches can cause a browser to request an old chunk filename that no longer exists.

A robust application may need a recovery strategy such as:

- Error Boundary UI;
- retry;
- controlled page refresh when a chunk is stale;
- monitoring chunk-load failures.

## State identity and lazy components

Once loaded, a lazy component participates in React identity rules like other component types.

Keys, position, and component type still decide whether state is preserved.

`lazy` is not a special state store.

## Prefetching likely code

Code splitting answers **what may load later**.

Prefetching answers **when we can start loading it before it is required**.

For example, an application might prefetch a settings route when the user hovers or focuses its navigation link.

The exact mechanism depends on your bundler/router/framework. React DOM also exposes resource loading APIs such as `preloadModule` and `preinitModule`, covered in the Modern React chapter.

## Preload vs lazy

These are complementary ideas:

```text
lazy → don't require this code as part of initial rendering
preload/prefetch → begin fetching likely future code before render needs it
```

Do not preload everything, or you erase the bandwidth benefit of splitting.

## Bundler responsibility

React's `lazy` API expresses runtime component loading, but your bundler creates the chunks.

Vite, webpack, Rollup-based systems, and frameworks may create different chunk graphs.

Production debugging often requires inspecting build output, not only React code.

## Common mistake: tiny boundaries everywhere

If every icon, button, and card is lazy, you may produce many requests and loading states without meaningful startup savings.

Split by user journey and bundle cost.

## Common mistake: lazy-loading critical above-the-fold UI

If the user always needs the hero, navigation, and primary call to action immediately, making them lazy can delay the first useful experience.

## Common mistake: ignoring navigation feedback

A lazy route may not show a root fallback during a Transition because React can preserve already revealed content.

That makes a pending indicator important:

```jsx
const [isPending, startTransition] = useTransition();
```

Users need to know their navigation click was accepted even while the previous screen remains visible.

## Common mistake: declaring `lazy` inside render

This is one of the most important `lazy` mistakes because it affects component identity and state.

Always prefer stable module-scope declarations.

## Debugging code splitting

Inspect:

- browser Network panel;
- generated chunk sizes;
- duplicate dependencies across chunks;
- request waterfalls;
- cache headers;
- chunk-load errors;
- whether a route is loaded before it is actually needed;
- whether a boundary causes unnecessary visual replacement.

## Production decision framework

Before adding `lazy`, answer:

1. Is this feature large enough to split?
2. Is it needed on the first user journey?
3. How likely is the user to open it?
4. Can we predict that interaction and prefetch?
5. Where should the Suspense boundary live?
6. What happens if loading fails?
7. Will splitting create a request waterfall?

## Exercise

Take a dashboard with Home, Reports, Billing, and Admin routes.

1. Statically import all four routes.
2. Measure the initial bundle.
3. Convert Reports, Billing, and Admin to `lazy`.
4. Add route-level Suspense.
5. Add a navigation pending indicator.
6. Inspect the Network panel and explain the new loading sequence.

## Interview questions

**Beginner:** What does `lazy` do?

**Intermediate:** Why should `lazy(() => import(...))` normally be declared outside component functions?

**Senior:** How do you choose code-splitting boundaries without creating network waterfalls or destroying perceived navigation performance?

## Summary

```text
lazy creates a deferred component-code boundary.
Suspense provides the loading/reveal boundary.
Declare lazy components at module scope.
Split meaningful product areas, not every component.
Code splitting can reduce initial work but can create waterfalls.
Prefetching and lazy loading are complementary.
Error Boundaries handle failed lazy imports.
```

## References

- https://react.dev/reference/react/lazy
- https://react.dev/reference/react/Suspense
- https://react.dev/reference/react-dom/preloadModule
- https://react.dev/reference/react-dom/preinitModule

## Next

Next, design loading and navigation states across multiple Suspense boundaries.