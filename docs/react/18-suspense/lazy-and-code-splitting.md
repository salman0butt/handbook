---
title: lazy and Code Splitting
description: Learn React lazy loading, dynamic imports, Suspense fallbacks, module boundaries, state identity, preload strategy, and production code-splitting trade-offs.
sidebar_position: 2
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

<VisualDiagram title="lazy, dynamic import, and Suspense have different jobs">
  <DiagramGrid columns={3}>
    <DiagramNode title="dynamic import()" tone="blue" eyebrow="BUNDLER / MODULE">
      Creates an async module loading boundary.
    </DiagramNode>
    <DiagramNode title="lazy" tone="purple" eyebrow="REACT COMPONENT">
      Turns that async module into a component React can render.
    </DiagramNode>
    <DiagramNode title="Suspense" tone="orange" eyebrow="REVEAL UX">
      Defines what users see while the code is not ready.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## What happens on first render?

<LifecycleBar
  items={[
    { label: 'Render lazy component', tone: 'blue' },
    { label: 'Run loader', tone: 'purple' },
    { label: 'Module pending → suspend', tone: 'orange' },
    { label: 'Nearest fallback shows', tone: 'gray' },
    { label: 'Module resolves', tone: 'teal' },
    { label: 'Retry + commit component', tone: 'green' },
  ]}
/>

React caches the loader Promise and resolved module value for that lazy component definition, so the same loader is not expected to run on every later render.

## The module needs a default component export

```js
// ReportsPage.js
export default function ReportsPage() {
  return <h1>Reports</h1>;
}
```

```jsx
const ReportsPage = lazy(() => import('./ReportsPage.js'));
```

If a module only has named exports, use a deliberate adapter rather than spreading special Promise mapping throughout the app.

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

<VisualDiagram title="Component identity must stay stable">
  <DiagramGrid columns={2}>
    <DiagramNode title="Module-scope lazy definition" tone="green">
      Same component type across renders → normal state preservation rules apply.
    </DiagramNode>
    <DiagramNode title="lazy created during render" tone="red">
      New component type may be created → state can reset unexpectedly.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Lazy loading is not conditional rendering

```jsx
{showChart ? <Chart /> : null}
```

Conditional rendering decides whether the component exists in the current UI. If `Chart` is statically imported, its code may already be in the bundle.

```jsx
import Chart from './Chart.js';
```

With `lazy`, the code itself can be deferred.

## Choose product boundaries, not tiny components

Strong candidates include routes, large editors, analytics views, admin-only features, heavy visualization tools, rare modals, and optional integrations.

<DecisionTree
  question="Is this a useful lazy boundary?"
  items={[
    { label: 'Large feature, not needed immediately', value: 'Strong candidate' },
    { label: 'Route many users may never visit', value: 'Strong candidate' },
    { label: 'Tiny component always needed above the fold', value: 'Usually keep eager' },
    { label: 'Split creates extra sequential discovery', value: 'Reconsider or preload' },
  ]}
/>

## Code splitting can create waterfalls

Bad splitting can defer too much work sequentially.

<VisualDiagram title="A code-split waterfall still costs time">
  <DiagramStack align="center">
    <DiagramNode title="Load route JS" tone="blue" />
    <DiagramArrow label="route renders and discovers" />
    <DiagramNode title="Load chart JS" tone="purple" />
    <DiagramArrow label="chart discovers" />
    <DiagramNode title="Load editor JS" tone="orange" />
    <DiagramArrow label="finally ready" />
    <DiagramNode title="Interactive feature" tone="green" />
  </DiagramStack>
</VisualDiagram>

Good production architecture asks what can load in parallel, what should be prefetched, what belongs on the critical path, and whether the extra chunk boundary is worth its scheduling/network overhead.

## Route-level and feature-level splitting

```jsx
const HomePage = lazy(() => import('./pages/HomePage.js'));
const BillingPage = lazy(() => import('./pages/BillingPage.js'));
const AdminPage = lazy(() => import('./pages/AdminPage.js'));
```

```jsx
const AdvancedReportBuilder = lazy(
  () => import('./reports/AdvancedReportBuilder.js')
);
```

Routes are often strong boundaries because users may never visit every route. Feature boundaries work when large code is only needed after a specific interaction.

## Suspense fallback design

Avoid a giant page spinner for a small lazy panel.

```jsx
<DashboardShell>
  <Suspense fallback={<ChartSkeleton />}>
    <RevenueChart />
  </Suspense>
</DashboardShell>
```

<VisualDiagram title="Keep useful surrounding UI outside the lazy region">
  <DiagramStack align="center">
    <DiagramNode title="Dashboard shell stays visible" tone="green" />
    <DiagramArrow label="local boundary owns loading" />
    <DiagramNode title="Chart skeleton" tone="gray" />
    <DiagramArrow label="chunk becomes ready" />
    <DiagramNode title="Revenue chart" tone="purple" />
  </DiagramStack>
</VisualDiagram>

## Failed lazy imports are errors

If the import Promise rejects, the nearest Error Boundary should own recovery.

Chunk failures can happen because of deployment mismatches, stale HTML, CDN issues, or offline conditions. A robust app may need local recovery UI, retry, a controlled refresh path, and monitoring.

## Prefetching complements lazy loading

`lazy` answers **what can load later**. Prefetch/preload answers **when to begin fetching likely future code before render requires it**.

<VisualDiagram title="Split less now, preload selectively later">
  <DiagramGrid columns={2}>
    <DiagramNode title="lazy" tone="purple">Remove code from the initial requirement.</DiagramNode>
    <DiagramNode title="preload / prefetch" tone="teal">Start likely future code before the interaction needs it.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

React DOM exposes APIs such as `preloadModule` and `preinitModule`; routers and frameworks may provide their own prefetch mechanisms. Preloading everything defeats the bandwidth benefit of splitting.

## Bundler responsibility

React expresses runtime loading, but the bundler creates the actual chunk graph. Production debugging often requires inspecting generated bundles and browser network activity, not only React source code.

Inspect:

- chunk sizes;
- duplicate dependencies;
- request waterfalls;
- cache behavior;
- chunk-load failures;
- code loaded before it is needed;
- fallback replacement caused by boundary placement.

## Navigation and pending feedback

A lazy route can prepare inside a Transition while the current route remains visible.

<VisualDiagram title="Suspense-aware navigation can avoid destructive route replacement">
  <DiagramStack align="center">
    <DiagramNode title="Current route visible" tone="green" />
    <DiagramArrow label="navigation Transition starts" />
    <DiagramNode title="Next route chunk prepares" tone="purple" />
    <DiagramArrow label="show stable pending feedback" />
    <DiagramNode title="Next route ready → commit" tone="blue" />
  </DiagramStack>
</VisualDiagram>

If old content stays visible, users still need feedback that their navigation was accepted.

## Production decision framework

Before adding `lazy`, ask:

1. Is the feature large enough to split?
2. Is it needed on the first user journey?
3. How likely is the user to open it?
4. Can likely navigation preload it?
5. Where should Suspense live?
6. What happens if the chunk fails?
7. Does the split introduce a waterfall?

## Exercise

Take Home, Reports, Billing, and Admin routes. Measure an eager build, lazy-load the less common routes, add Suspense and pending navigation UI, then inspect the resulting Network waterfall and bundle graph.

## Interview questions

**Beginner:** What does `lazy` do?

**Intermediate:** Why should a lazy component normally be declared outside component functions?

**Senior:** How do you choose code-splitting boundaries without creating network waterfalls or damaging perceived navigation performance?

## Summary

<VisualDiagram title="Code-splitting mental model">
  <DiagramStack align="center">
    <DiagramNode title="Choose a meaningful product boundary" tone="blue" />
    <DiagramArrow label="defer its code" />
    <DiagramNode title="lazy + dynamic import" tone="purple" />
    <DiagramArrow label="coordinate readiness" />
    <DiagramNode title="Suspense + pending/error UX" tone="orange" />
    <DiagramArrow label="optimize critical path" />
    <DiagramNode title="Parallel loading, caching, selective prefetch" tone="green" />
  </DiagramStack>
</VisualDiagram>

## References

- https://react.dev/reference/react/lazy
- https://react.dev/reference/react/Suspense
- https://react.dev/reference/react-dom/preloadModule
- https://react.dev/reference/react-dom/preinitModule

## Next

Next, design loading and navigation states across multiple Suspense boundaries.