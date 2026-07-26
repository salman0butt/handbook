---
title: Profiler and React Performance Tracks
description: Programmatic React profiling, DevTools analysis, and React 19.2 Performance Tracks for scheduler, component, and server work.
sidebar_position: 3
---

# Profiler and React Performance Tracks

Performance work becomes much more reliable when you can answer:

- what caused an update;
- how much render work happened;
- how much of that work committed;
- whether Effects were expensive;
- whether React was doing blocking, Transition, Suspense, or idle work;
- whether the server was waiting on async work.

React gives you several complementary tools.

## Three profiling layers

```text
React DevTools Profiler
→ interactive component profiling

<Profiler>
→ programmatic measurements

React Performance Tracks
→ React events inside browser Performance traces
```

They overlap, but they are not identical.

## `<Profiler>`

Wrap a subtree:

```jsx
import { Profiler } from 'react';

<Profiler id="SearchResults" onRender={onRender}>
  <SearchResults />
</Profiler>
```

React calls `onRender` after commits involving the profiled subtree.

## Typical callback

```js
function onRender(
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
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

The exact callback shape can evolve across React versions, so production instrumentation should track the versioned React API rather than copy old examples indefinitely.

## Important measurements

### `id`

Identifies the profiled subtree.

Use names that map to meaningful product regions:

```text
CheckoutSummary
SearchResults
DashboardChart
NavigationShell
```

### `phase`

Tells you whether the subtree mounted or updated.

A slow mount and a slow update are different problems.

### `actualDuration`

Represents time spent rendering the subtree for that update.

This is useful for seeing whether memoization or architecture reduced the work performed.

### `baseDuration`

Represents an estimate of rendering the subtree without memoization optimizations.

The relationship between actual and base duration can help indicate whether memoization is skipping meaningful work.

## Example interpretation

Suppose you record:

```text
actualDuration: 8 ms
baseDuration: 90 ms
```

That suggests React avoided a large amount of potential render work.

But if both are:

```text
actualDuration: 0.4 ms
baseDuration: 0.5 ms
```

then adding more manual memoization is unlikely to matter.

## Profiling overhead

Profiling adds overhead.

React disables profiling instrumentation in normal production builds by default.

For production-like profiling, React provides a special profiling build.

Do not assume numbers from a heavily instrumented development session equal production timing exactly.

Use profiling to compare behavior and locate bottlenecks, then validate meaningful improvements under realistic builds.

## React DevTools Profiler

The interactive Profiler is usually the fastest way to inspect component rendering.

Useful questions:

- which components rendered during this commit?
- which subtree took the most time?
- which props changed?
- did a Context update fan out broadly?
- did moving state reduce the update surface?

A flamegraph is evidence, not a verdict.

A component can be visually large but computationally cheap.

## React Performance Tracks in React 19.2

React 19.2 introduced React-specific custom tracks in supported browser Performance panels.

They align React work with:

- JavaScript tasks;
- browser rendering;
- network requests;
- event-loop activity.

This lets you analyze React in the same timeline as the rest of the browser.

## Scheduler track

The Scheduler track separates work by priority.

Current categories include:

```text
Blocking
Transition
Suspense
Idle
```

### Blocking

Synchronous/high-priority work, often related to direct user interactions.

### Transition

Non-blocking work scheduled through Transition APIs.

### Suspense

Work related to suspension, fallback display, retries, and reveal.

### Idle

Lowest-priority work.

This makes the scheduling mental model visible.

## Render phases in the Scheduler track

A render pass can show phases such as:

```text
Update
  ↓
Render
  ↓
Commit
  ↓
Remaining Effects
```

### Update

What scheduled the work.

### Render

React calls components and calculates the next tree.

### Commit

React applies changes and runs layout Effects.

### Remaining Effects

Passive Effects usually run later, often after paint.

This is a powerful debugging view because a slow interaction can be decomposed by phase.

## Cascading updates

Performance Tracks can expose cascading updates.

Example:

```text
commit
  ↓
Effect sets state
  ↓
new update
  ↓
new render
```

The trace may show the component and stack that scheduled the additional work in development builds.

This helps find Effect-driven performance regressions.

## Components track

The Components track visualizes component render durations as a flamegraph.

It can also show Effect durations.

Events may include:

- Mount;
- Unmount;
- Reconnect;
- Disconnect.

Reconnect/Disconnect are especially relevant with `<Activity>` because hidden UI can preserve state while Effects disconnect and reconnect.

## Changed props

In development traces, component entries can expose potential changed props.

This is useful for questions like:

> Why did this expensive child render after a theme toggle?

You might discover:

```text
items: same
query: same
onSelect: new function identity
```

That is evidence for a targeted identity fix.

## Effect durations

Slow Effects are often overlooked.

A component's render may take 2 ms while its Effect takes 80 ms.

Common causes:

- expensive DOM work;
- synchronous third-party integrations;
- duplicated subscriptions;
- state update loops;
- serialization/parsing;
- layout reads and writes.

Profile Effects independently from renders.

## Server Performance Tracks

Development builds can expose server-related tracks for React Server Components.

These can help visualize:

- server requests;
- Promises that feed Server Components;
- async component durations;
- parallel server work;
- rejected Promises.

This is useful for diagnosing server waterfalls.

## Server waterfall example

Trace:

```text
ProductPage
  await product     120 ms
  ↓
  Reviews
    await reviews   150 ms
```

Total path can approach 270 ms before other overhead.

If independent, restructure to start work concurrently.

## Development vs profiling builds

React Performance Tracks are available in development and profiling builds.

Development builds provide broad diagnostic information.

Profiling builds provide performance instrumentation closer to production behavior.

For profiling builds, React documents using `react-dom/profiling`, typically through a bundler alias rather than rewriting every import.

Your framework may provide a supported profiling mode.

## `<Profiler>` and Performance Tracks together

In profiling builds, wrapping important subtrees in `<Profiler>` helps ensure their component information appears in the Components track.

This can be useful for targeted production-like sessions.

## What to profile

Do not wrap every tiny component permanently.

Profile meaningful boundaries:

```text
<App>
  <Navigation />
  <Dashboard />
     <ChartPanel />
     <ActivityFeed />
```

Potential Profiler boundaries:

```text
Dashboard
ChartPanel
ActivityFeed
```

This gives product-level timing without drowning in noise.

## Compare before and after

Example experiment:

### Baseline

```text
SearchResults update: 75 ms
```

### Change

Move query input state out of page shell and memoize verified expensive list work.

### After

```text
SearchResults update: 24 ms
```

Then validate whether input responsiveness improved.

The timing improvement matters because the user experience improved, not merely because a flamegraph changed.

## Avoid single-sample conclusions

Performance is noisy.

Run multiple samples and control:

- dataset;
- device;
- browser;
- network conditions;
- cache state;
- interaction sequence.

Prefer trends over one lucky trace.

## Common mistakes

### Profiling only the entire app

A giant root-level profile can hide which subsystem matters.

### Profiling tiny isolated demos only

Real bottlenecks often depend on production-sized data and component composition.

### Treating every render as wasted

Rendering is React's normal work model.

### Ignoring Effects

Effect work can dominate commit-related cost.

### Ignoring browser timeline

React may be fast while layout/paint is slow.

### Leaving heavy profiling instrumentation in normal production

Use supported profiling builds deliberately.

## Production observability

For critical applications, combine React-level profiling with broader telemetry:

```text
user interaction timing
+ React commit measurements
+ network spans
+ server spans
+ browser long tasks
+ errors
```

This makes a trace useful across the full request-to-render path.

## Exercise

You have a dashboard where changing a date range takes 500 ms.

Design a profiling session that distinguishes:

1. event handler cost;
2. blocking vs Transition work;
3. component render duration;
4. Effect duration;
5. browser layout/paint;
6. server request waterfalls.

Identify which tool answers each question.

## Interview questions

### What is the difference between `<Profiler>` and React Performance Tracks?

`<Profiler>` provides programmatic measurements for a React subtree. Performance Tracks visualize React scheduling/component/server work inside browser performance traces alongside browser and network activity.

### Why can profiling builds differ from normal production builds?

Profiling instrumentation adds overhead and extra measurement data. It exists to observe behavior, while normal production builds remove that instrumentation by default.

### What is a cascading update?

A new update scheduled as part of existing React work, often producing an avoidable second render pass—for example state derived in an Effect after a commit.

### Why inspect changed props?

Changed prop identity can explain why an expensive child rendered and whether targeted memoization or API redesign would help.

## References

- https://react.dev/reference/react/Profiler
- https://react.dev/reference/dev-tools/react-performance-tracks
- https://react.dev/blog/2025/10/01/react-19-2
