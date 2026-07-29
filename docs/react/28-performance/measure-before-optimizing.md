---
title: Measure Before Optimizing
description: A production React performance workflow based on evidence, user impact, browser traces, and React-specific profiling.
sidebar_position: 1
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

# Measure Before Optimizing

Performance engineering starts with one question:

> **What is actually slow for the user?**

React can feel slow because of JavaScript, React render work, Effects, network waterfalls, bundles, hydration, layout/paint, third-party scripts, server work, excessive updates, or poor scheduling. `memo`, `useMemo`, and `useCallback` address only part of that space.

## Interaction performance is a pipeline

<VisualDiagram title="One interaction crosses React and the browser">
  <LifecycleBar items={[
    { label: 'User input', tone: 'blue' },
    { label: 'Event handler / state update', tone: 'purple' },
    { label: 'React render', tone: 'orange' },
    { label: 'Commit + layout Effects', tone: 'teal' },
    { label: 'Browser style / layout / paint', tone: 'green' },
    { label: 'Passive Effects', tone: 'gray' },
  ]} />
</VisualDiagram>

A slowdown can happen at any stage. A React-specific optimization cannot fix a late network request, a huge third-party script, or a browser layout bottleneck.

## Define the symptom precisely

“App is slow” is not actionable.

“Typing in the search box takes 150 ms before the character appears when 10,000 rows are visible” gives you an interaction, dataset, and measurable outcome.

## Reproduce before changing code

<VisualDiagram title="A useful performance experiment is repeatable">
  <LifecycleBar items={[
    { label: 'Same page/build', tone: 'blue' },
    { label: 'Same dataset/cache state', tone: 'purple' },
    { label: 'Same interaction', tone: 'orange' },
    { label: 'Same measurements', tone: 'teal' },
    { label: 'Compare before vs after', tone: 'green' },
  ]} />
</VisualDiagram>

Without controlled conditions, optimization becomes guesswork.

## Measure in the right environment

Development React intentionally performs extra diagnostics. Strict Mode can repeat some work in development.

<DiagramGrid columns={3}>
  <DiagramNode title="Development" tone="blue">Best for debugging correctness and causes</DiagramNode>
  <DiagramNode title="Profiling build" tone="purple">Instrumentation closer to production behavior</DiagramNode>
  <DiagramNode title="Production" tone="green">Final user-facing validation</DiagramNode>
</DiagramGrid>

Do not treat development timing as production truth.

## Browser Performance panel vs React profiling

<VisualDiagram title="Use the tool that can see the suspected cost">
  <DiagramGrid columns={3}>
    <DiagramNode title="Browser Performance" tone="blue">JS tasks · event timing · network · style · layout · paint</DiagramNode>
    <DiagramNode title="React DevTools / Profiler" tone="purple">Which components rendered · commit cost · update causes</DiagramNode>
    <DiagramNode title="React Performance Tracks" tone="teal">Blocking · Transition · Suspense · Effects alongside browser work</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

React 19.2 Performance Tracks can place React scheduling and component work directly on supported browser performance timelines.

## Find the dominant cost

Suppose a click trace shows:

<VisualDiagram title="Optimize the largest contributor, not the most familiar API">
  <DiagramRow>
    <DiagramNode title="React render" tone="orange">40 ms</DiagramNode>
    <DiagramArrow direction="right" label="commit" />
    <DiagramNode title="Browser layout" tone="red">80 ms</DiagramNode>
    <DiagramArrow direction="right" label="paint" />
    <DiagramNode title="Visible result" tone="green">User waits for both</DiagramNode>
  </DiagramRow>
</VisualDiagram>

Reducing React render from 40 ms to 30 ms helps, but layout remains the dominant bottleneck.

## Render count is not the performance metric

<DiagramGrid columns={2}>
  <DiagramNode title="50 renders × 0.05 ms" tone="green">2.5 ms total</DiagramNode>
  <DiagramNode title="1 render × 120 ms" tone="red">120 ms total</DiagramNode>
</DiagramGrid>

Rendering is normal. Investigate work that is expensive, frequent, or disruptive enough to affect the user.

## Frequency and cost are separate dimensions

<VisualDiagram title="Prioritize high-frequency, high-cost work">
  <DiagramGrid columns={2}>
    <DiagramNode title="Low frequency + low cost" tone="green">Usually fine</DiagramNode>
    <DiagramNode title="Low frequency + high cost" tone="orange">Profile the interaction</DiagramNode>
    <DiagramNode title="High frequency + low cost" tone="teal">Often acceptable, measure</DiagramNode>
    <DiagramNode title="High frequency + high cost" tone="red">Likely bottleneck</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

For too-frequent updates, consider narrower subscriptions, refs for non-render values, fewer state updates, or architecture changes. For expensive individual renders, consider algorithms, virtualization, server work, component boundaries, or targeted memoization.

## Find what triggered the update

A component can render because its own state changed, an ancestor rendered, Context changed, an external-store snapshot changed, Suspense retried, a Transition progressed, or framework navigation updated the tree.

Do not assume props are the cause.

## Cascading updates

<VisualDiagram title="Derived state in Effects can create avoidable extra work">
  <DiagramStack>
    <DiagramNode title="Render A" tone="blue">UI computed</DiagramNode>
    <DiagramArrow label="commit" />
    <DiagramNode title="Effect" tone="orange">Derives value and calls setState</DiagramNode>
    <DiagramArrow label="new update" />
    <DiagramNode title="Render B" tone="red">Second render that may have been avoidable</DiagramNode>
  </DiagramStack>
</VisualDiagram>

If the value could have been derived during render, the Effect created unnecessary work.

## Network waterfalls

<VisualDiagram title="Serial data dependencies can dominate the page">
  <DiagramGrid columns={2}>
    <DiagramNode title="Waterfall" tone="red">fetch user → render child → fetch projects → fetch permissions</DiagramNode>
    <DiagramNode title="Parallel start" tone="green">start user + projects + permissions together when independent</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Server Components, framework data APIs, preloading, and Suspense-aware data systems can help coordinate this. `useMemo` cannot fix a waterfall.

## Bundle and hydration cost

Measure initial JavaScript, route chunks, duplicated dependencies, editor/chart libraries, third-party scripts, and broad `'use client'` boundaries.

Server-rendered HTML arriving early does not mean hydration is cheap. Hydration still loads client code, evaluates components, attaches behavior, and can run expensive calculations.

## Scheduling and reducing work are different

<VisualDiagram title="Different performance tools solve different classes of problems">
  <DiagramGrid columns={3}>
    <DiagramNode title="Memoization" tone="purple">Avoid/reuse some repeated work</DiagramNode>
    <DiagramNode title="Transition/deferred" tone="teal">Change priority and interruption behavior</DiagramNode>
    <DiagramNode title="Algorithm/virtualization/server/worker" tone="green">Reduce, move, or bound the work itself</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

A Transition can keep urgent input responsive, but it does not make a 200 ms calculation cost 20 ms.

## Practical optimization workflow

<VisualDiagram title="Evidence-driven performance loop">
  <LifecycleBar items={[
    { label: 'Define user-visible problem', tone: 'blue' },
    { label: 'Record baseline', tone: 'purple' },
    { label: 'Locate dominant cost', tone: 'orange' },
    { label: 'Change the largest cause', tone: 'teal' },
    { label: 'Measure again', tone: 'green' },
    { label: 'Remove unjustified complexity', tone: 'gray' },
  ]} />
</VisualDiagram>

Example baseline:

```text
filterRows(): 70 ms
Row tree render: 55 ms
browser layout: 15 ms
```

Possible fixes should target the dominant cause: data indexing, server filtering, virtualization, deferred rendering, or memoizing a verified expensive transformation.

## Performance budgets

Budgets should describe user-facing outcomes: search input responsiveness, route-to-useful-content timing, modal opening without input freeze, or smooth list scrolling under realistic data.

The exact target depends on the product, device, and network population.

## Common mistakes

- Adding memoization everywhere before measuring.
- Benchmarking only development mode.
- Optimizing raw render count instead of user-visible latency.
- Ignoring browser layout/paint.
- Ignoring network or server architecture.
- Comparing different scenarios before and after.

## Production rule of thumb

<VisualDiagram title="Optimization order">
  <DiagramStack>
    <DiagramNode title="1 · Correctness" tone="blue">The UI must be right first</DiagramNode>
    <DiagramArrow label="then" />
    <DiagramNode title="2 · Architecture + measurement" tone="purple">Own state/data/work correctly and find the bottleneck</DiagramNode>
    <DiagramArrow label="then" />
    <DiagramNode title="3 · Targeted optimization" tone="orange">Change the measured cause</DiagramNode>
    <DiagramArrow label="verify" />
    <DiagramNode title="4 · User impact improved" tone="green">Keep the change only if it helps</DiagramNode>
  </DiagramStack>
</VisualDiagram>

## Interview questions

### Why start with profiling?

Because slow UX can come from React rendering, JavaScript, network, browser layout/paint, hydration, Effects, server work, or third-party code. Profiling locates the dominant cause.

### Is reducing render count always an optimization?

No. Cheap renders can be harmless, while one expensive render can block the user. Measure time and impact.

### Reducing work vs scheduling work?

Reducing work lowers total computation. Scheduling APIs change when work runs and whether it is interruptible.

### Common React source of cascading updates?

Using Effects to derive state that could have been calculated during render, creating render → commit → Effect → update → second render.

## References

- https://react.dev/reference/dev-tools/react-performance-tracks
- https://react.dev/reference/react/Profiler
- https://react.dev/learn/react-compiler
