---
title: Profiler and React Performance Tracks
description: Programmatic React profiling, DevTools analysis, and React 19.2 Performance Tracks for scheduler, component, and server work.
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

# Profiler and React Performance Tracks

Performance work becomes more reliable when you can see **what scheduled work, how long it rendered, what committed, what Effects cost, and how React work overlaps browser/network activity**.

## Three complementary profiling layers

<VisualDiagram title="Choose the profiling surface for the question">
  <DiagramGrid columns={3}>
    <DiagramNode title="React DevTools Profiler" tone="purple">Interactive component/commit investigation</DiagramNode>
    <DiagramNode title="<Profiler>" tone="blue">Programmatic subtree measurements</DiagramNode>
    <DiagramNode title="Performance Tracks" tone="teal">React scheduling/components/server work on browser timeline</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

They overlap, but they do not provide identical information.

## `<Profiler>`

```jsx
import { Profiler } from 'react';

<Profiler id="SearchResults" onRender={onRender}>
  <SearchResults />
</Profiler>
```

Typical callback:

```js
function onRender(
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime,
) {
  console.table({
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
  });
}
```

Use IDs that map to product regions such as `SearchResults`, `CheckoutSummary`, or `DashboardChart`.

## `actualDuration` vs `baseDuration`

<VisualDiagram title="Profiler durations answer different questions">
  <DiagramGrid columns={2}>
    <DiagramNode title="actualDuration" tone="blue">Work React actually rendered for this update</DiagramNode>
    <DiagramNode title="baseDuration" tone="purple">Estimated subtree render cost without memoization reuse</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Example:

```text
actualDuration: 8 ms
baseDuration:   90 ms
```

suggests substantial work was skipped.

If both are tiny, more manual memoization is unlikely to matter.

## Profiling adds overhead

Normal production builds disable profiling instrumentation by default. React provides a profiling build for production-like performance investigation.

Use profiling to locate and compare bottlenecks, then validate important improvements under realistic production conditions.

## React DevTools Profiler

Useful questions include:

- Which components rendered in this commit?
- Which subtree took the most time?
- What triggered the update?
- Did Context fan out broadly?
- Did moving state shrink the update surface?
- Did a targeted optimization reduce cost?

A flamegraph is evidence, not a verdict. Rendering itself is normal.

## React Performance Tracks

React 19.2 introduced React-specific tracks for supported browser Performance panels. They align React work with JavaScript tasks, network activity, event-loop work, layout, and paint.

<VisualDiagram title="One timeline, several React views">
  <DiagramGrid columns={3}>
    <DiagramNode title="Scheduler" tone="blue">Priority + update/render/commit/effect timing</DiagramNode>
    <DiagramNode title="Components" tone="purple">Component and Effect duration flamegraphs</DiagramNode>
    <DiagramNode title="Server" tone="teal">RSC requests, Promises, async component work in development</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Current React guidance: Performance Tracks are available in development and profiling builds. Server tracks are development-only; profiling builds have more limited component/server instrumentation unless enabled through supported tooling.

## Scheduler priorities

<DiagramGrid columns={4}>
  <DiagramNode title="Blocking" tone="red">Synchronous/high-priority work</DiagramNode>
  <DiagramNode title="Transition" tone="purple">Non-blocking background work</DiagramNode>
  <DiagramNode title="Suspense" tone="orange">Fallback/retry/reveal work</DiagramNode>
  <DiagramNode title="Idle" tone="gray">Lowest-priority work</DiagramNode>
</DiagramGrid>

This makes the concurrency mental model observable rather than theoretical.

## Render phases on the timeline

<VisualDiagram title="A scheduled update has multiple phases">
  <LifecycleBar items={[
    { label: 'Update — what scheduled work', tone: 'blue' },
    { label: 'Render — calculate next tree', tone: 'purple' },
    { label: 'Commit — mutate DOM + layout Effects', tone: 'orange' },
    { label: 'Remaining Effects — passive synchronization', tone: 'teal' },
  ]} />
</VisualDiagram>

A slow interaction can therefore be decomposed by phase instead of blamed generically on “React.”

## Cascading updates

<VisualDiagram title="Performance Tracks can expose update cascades">
  <DiagramStack>
    <DiagramNode title="Commit A" tone="blue">First update finishes</DiagramNode>
    <DiagramArrow label="Effect/layout work schedules state" />
    <DiagramNode title="New update" tone="orange">Extra work begins</DiagramNode>
    <DiagramArrow label="renders again" />
    <DiagramNode title="Commit B" tone="red">Potential avoidable second pass</DiagramNode>
  </DiagramStack>
</VisualDiagram>

Development traces can help identify which component scheduled the extra update.

## Components track

The Components track visualizes component durations and Effect durations as flamegraphs.

Events may include Mount, Unmount, Reconnect, and Disconnect. Reconnect/Disconnect are particularly useful with `<Activity>`, where hidden UI can preserve state while Effects disconnect and reconnect.

## Changed props

Development traces can show potential changed props for a component render.

<VisualDiagram title="Changed identity can explain an expensive render">
  <DiagramGrid columns={3}>
    <DiagramNode title="items" tone="green">same</DiagramNode>
    <DiagramNode title="query" tone="green">same</DiagramNode>
    <DiagramNode title="onSelect" tone="orange">new function identity</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

That is evidence for a targeted identity/API fix—not proof that every callback needs `useCallback`.

## Profile Effects independently

A component can render in 2 ms and run an 80 ms Effect.

Common causes include synchronous third-party work, duplicated subscriptions, state-update loops, serialization/parsing, and layout reads/writes.

## Server tracks and waterfalls

Development Server Performance Tracks can expose Promises feeding Server Components and async component durations.

<VisualDiagram title="Serial server awaits can create a waterfall">
  <DiagramStack>
    <DiagramNode title="ProductPage awaits product" tone="orange">120 ms</DiagramNode>
    <DiagramArrow label="only then" />
    <DiagramNode title="Reviews awaits reviews" tone="red">150 ms</DiagramNode>
  </DiagramStack>
</VisualDiagram>

If the work is independent, start it concurrently instead of accepting the serial critical path.

## Development vs profiling builds

<DiagramGrid columns={2}>
  <DiagramNode title="Development" tone="blue">Broad diagnostics; Server tracks available; extra dev overhead</DiagramNode>
  <DiagramNode title="Profiling build" tone="purple">Closer to production; profiling instrumentation intentionally enabled</DiagramNode>
</DiagramGrid>

React documents using `react-dom/profiling` through a bundler alias for profiling builds. Your framework may expose a supported mode.

## Meaningful Profiler boundaries

Do not permanently wrap every tiny component.

Good boundaries map to product subsystems:

```text
Dashboard
ChartPanel
ActivityFeed
SearchResults
CheckoutSummary
```

That makes measurements understandable and avoids drowning in instrumentation noise.

## Compare before and after

<LifecycleBar items={[
  { label: 'Record baseline', tone: 'blue' },
  { label: 'Change one architectural/optimization cause', tone: 'purple' },
  { label: 'Record same interaction again', tone: 'orange' },
  { label: 'Validate user experience improved', tone: 'green' },
]} />

Run multiple samples and control dataset, device, browser, network, cache state, and interaction sequence.

## Production observability

<VisualDiagram title="A useful performance trace crosses subsystem boundaries">
  <DiagramRow>
    <DiagramNode title="User interaction" tone="blue">Latency / responsiveness</DiagramNode>
    <DiagramArrow direction="right" />
    <DiagramNode title="React" tone="purple">Commits / scheduling</DiagramNode>
    <DiagramArrow direction="right" />
    <DiagramNode title="Network + server" tone="teal">Spans / waterfalls</DiagramNode>
    <DiagramArrow direction="right" />
    <DiagramNode title="Browser" tone="green">Long tasks · layout · paint</DiagramNode>
  </DiagramRow>
</VisualDiagram>

## Common mistakes

- Profiling only the entire app without meaningful subsystem boundaries.
- Profiling tiny demos that do not resemble production data/composition.
- Treating every render as wasted.
- Ignoring Effect duration.
- Ignoring browser layout/paint.
- Leaving profiling instrumentation enabled in normal production unintentionally.
- Drawing conclusions from one noisy trace.

## Interview questions

### `<Profiler>` vs Performance Tracks?

`<Profiler>` gives programmatic subtree measurements. Performance Tracks place React scheduling/component/server events on the browser performance timeline alongside other platform work.

### Why can profiling builds differ from normal production?

Profiling instrumentation adds overhead and metadata that normal production removes.

### What is a cascading update?

An update scheduled during or immediately after existing React work that causes another render pass, often from Effect-driven derived state.

### Why inspect changed props?

Changed identity can explain why an expensive child rendered and whether a targeted memoization or API redesign would help.

## References

- https://react.dev/reference/react/Profiler
- https://react.dev/reference/dev-tools/react-performance-tracks
- https://react.dev/blog/2025/10/01/react-19-2
