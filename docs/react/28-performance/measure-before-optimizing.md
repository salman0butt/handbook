---
title: Measure Before Optimizing
description: A production React performance workflow based on evidence, user impact, browser traces, and React-specific profiling.
sidebar_position: 1
---

# Measure Before Optimizing

Performance engineering starts with a question:

> **What is actually slow for the user?**

Not:

> Which Hook can I add to make this look optimized?

React applications can feel slow for many different reasons:

- expensive JavaScript;
- too much rendering work;
- unnecessary rendering work;
- repeated Effects;
- network waterfalls;
- large bundles;
- hydration cost;
- layout and paint work;
- long tasks outside React;
- server-side waterfalls;
- slow third-party code;
- excessive state updates;
- poor scheduling of expensive updates.

`memo`, `useMemo`, and `useCallback` only address a small subset of those problems.

## The performance mental model

A user interaction might involve all of these stages:

```text
user input
   ↓
event handler
   ↓
state update
   ↓
React render work
   ↓
commit
   ↓
layout Effects
   ↓
browser style/layout
   ↓
paint
   ↓
passive Effects
```

A slowdown can happen at any point.

A React-specific optimization will not fix a network request that starts too late, a 600 KB third-party script, or a CSS layout bottleneck.

## First identify the symptom

Examples:

- typing feels delayed;
- opening a modal freezes briefly;
- route navigation takes too long;
- a list becomes sluggish with many items;
- a dashboard updates too frequently;
- initial load is slow;
- hydration blocks interaction;
- server rendering starts quickly but finishes slowly.

Be precise.

“App is slow” is not actionable.

“Typing in the search box takes 150 ms before the character appears when 10,000 rows are visible” is actionable.

## Reproduce before changing code

Create a repeatable scenario.

```text
1. load the same page
2. use the same dataset
3. perform the same interaction
4. record the same measurement
5. compare before/after
```

Without a stable reproduction, optimization work becomes guesswork.

## Measure in the right environment

Development React intentionally performs extra checks.

For example, Strict Mode may execute some logic more than once during development.

Therefore distinguish:

```text
development debugging
vs
production performance
vs
profiling build performance
```

A development slowdown is worth understanding, but it is not automatically representative of a production build.

## Browser Performance panel

The browser Performance panel helps answer questions React DevTools alone cannot.

Look for:

- long JavaScript tasks;
- event handling duration;
- style recalculation;
- layout;
- paint;
- network timing;
- scripting outside React;
- blocking third-party work.

React 19.2 adds React Performance Tracks to supported browser performance traces, giving React-specific scheduling information alongside browser work.

This matters because a useful trace might show:

```text
click
  ↓
React blocking update
  ↓
40 ms render
  ↓
commit
  ↓
80 ms browser layout
```

In that scenario, cutting the render from 40 ms to 30 ms may help, but browser layout is still the dominant cost.

## React DevTools Profiler

Use the Profiler to answer questions such as:

- Which components rendered?
- Which component subtree was expensive?
- How often does it render?
- Which update caused the render?
- Did an optimization reduce render duration?

Do not optimize a component merely because it appears in a flamegraph.

Rendering is normal.

The question is whether the render is **expensive, frequent, or unnecessary enough to matter**.

## Render count is not the performance metric

A component rendering 50 times can be fine if each render is tiny.

A component rendering once can be a problem if that render blocks the main thread for 300 ms.

Compare:

```text
Component A
50 renders × 0.05 ms = 2.5 ms

Component B
1 render × 120 ms = 120 ms
```

The second case deserves attention first.

## Distinguish frequency from cost

Two common performance problems:

### Too many updates

```text
scroll event
  ↓
setState
  ↓
render
  ↓
scroll event
  ↓
setState
  ↓
render
```

Possible directions:

- reduce update frequency;
- move transient values to refs;
- subscribe more narrowly;
- use a specialized external store;
- avoid unnecessary Effect-driven state.

### Expensive individual renders

Possible directions:

- reduce expensive calculation;
- split large components;
- virtualize large collections;
- move work to the server;
- defer non-urgent work;
- memoize only where evidence supports it.

## Identify the source of an update

A component can re-render because:

- its own state changed;
- an ancestor rendered;
- Context changed;
- an external store snapshot changed;
- a Suspense boundary retried;
- a Transition progressed;
- a framework navigation updated the tree.

Do not assume props are the reason.

## Watch for cascading updates

A cascading update happens when new work is scheduled during or immediately after existing React work.

Common sources include:

- state updates from Effects;
- state derived through Effects instead of render;
- layout measurements that trigger another render;
- synchronization loops;
- duplicated state.

Mental model:

```text
render A
  ↓
commit A
  ↓
Effect sets state
  ↓
render B
```

If the second render could have been avoided by deriving the value during the first render, the Effect introduced unnecessary work.

This is one reason **Effect ≠ lifecycle** is also a performance lesson.

## Network waterfalls

Performance problems often happen before React renders anything expensive.

Bad sequence:

```text
load route
   ↓
fetch user
   ↓
render child
   ↓
fetch projects
   ↓
render child
   ↓
fetch permissions
```

Better architectures may start independent work concurrently:

```text
route starts
   ├── fetch user
   ├── fetch projects
   └── fetch permissions
```

Framework data APIs, Server Components, preloading, and Suspense-aware data systems can help coordinate this.

`useMemo` cannot fix a waterfall.

## Bundle cost

Measure:

- initial JavaScript size;
- route chunks;
- duplicated dependencies;
- large editor/chart libraries;
- third-party scripts;
- client modules introduced by broad `'use client'` boundaries.

Possible improvements:

- `lazy` and route splitting;
- narrower client boundaries;
- server-side work;
- removing unused dependencies;
- loading optional features on demand.

## Hydration cost

For server-rendered apps, HTML arriving quickly does not guarantee immediate interactivity.

Hydration can be expensive when:

- the client tree is huge;
- too much code is included in the client bundle;
- expensive render calculations happen during hydration;
- large Context/provider trees initialize immediately.

RSC architecture can reduce client JavaScript by keeping non-interactive code on the server.

## Scheduling is different from making work cheaper

Transitions can make expensive updates less disruptive.

```js
startTransition(() => {
  setFilter(nextFilter);
});
```

This can let urgent work remain responsive.

But it does not magically reduce the CPU cost of the update.

If the calculation still costs 200 ms, that work still exists.

Think:

```text
memoization → avoid/reuse some work
Transition  → change priority/interruption behavior
worker      → move CPU work off main thread
server      → move work to server
algorithm   → reduce the work itself
```

These solve different problems.

## A practical optimization workflow

### Step 1: define user-visible problem

Example:

> Filtering the customer table makes typing lag.

### Step 2: record a baseline

Measure:

- interaction duration;
- render duration;
- long tasks;
- React commits;
- dataset size.

### Step 3: locate dominant cost

Example finding:

```text
filterRows(): 70 ms
Row tree render: 55 ms
browser layout: 15 ms
```

### Step 4: fix the largest cause first

Maybe:

- index the data differently;
- move filtering server-side;
- virtualize rows;
- defer result rendering;
- memoize a verified expensive transformation.

### Step 5: measure again

Do not stop at “the code looks optimized.”

### Step 6: remove unjustified complexity

An optimization that saves no meaningful time but creates fragile dependency arrays is usually not worth keeping.

## Performance budgets

Teams can establish budgets for critical flows.

Examples:

```text
search keystroke → visible response under target threshold
route → useful content under target threshold
modal open → no observable input freeze
large list → smooth scrolling
```

The exact thresholds depend on product requirements and device/network targets.

The important idea is to measure against user-facing outcomes.

## Common mistakes

### Adding memoization everywhere

This increases complexity and can provide zero benefit.

### Benchmarking only development mode

Development instrumentation changes behavior and cost.

### Optimizing render count instead of user experience

Fewer renders do not automatically mean faster interaction.

### Ignoring browser work

React may finish quickly while layout or paint remains expensive.

### Ignoring network architecture

A fast component cannot render data that has not arrived.

### Measuring different scenarios before and after

Performance comparisons require controlled conditions.

## Production rule of thumb

Optimize in this order:

```text
1. correctness
2. architecture
3. measurement
4. dominant bottleneck
5. targeted optimization
6. verification
```

Not:

```text
1. useMemo everything
2. hope
```

## Exercise

Take a page containing:

- search input;
- 5,000 rows;
- expensive row formatting;
- Context-driven theme updates.

Design a measurement plan that identifies:

1. typing latency;
2. filtering cost;
3. row render cost;
4. layout cost;
5. unnecessary theme-related re-renders;
6. network cost if filtering moves server-side.

Do not propose an optimization until you define what measurement would justify it.

## Interview questions

### Why should React performance work start with profiling?

Because slow UX can come from rendering, JavaScript, network, browser layout/paint, hydration, Effects, or third-party code. Profiling identifies the actual dominant cause.

### Is reducing render count always an optimization?

No. A render may be cheap, and memoization itself has complexity and comparison cost. User-visible latency and measured work matter more than raw render count.

### What is the difference between reducing work and scheduling work?

Reducing work makes less computation necessary. Scheduling APIs such as Transitions change when and at what priority work happens, but do not necessarily reduce total computation.

### What is a common React source of cascading updates?

Using Effects to calculate state that could have been derived during render, causing a render → commit → Effect → state update → second render chain.

## References

- https://react.dev/reference/dev-tools/react-performance-tracks
- https://react.dev/reference/react/Profiler
- https://react.dev/learn/react-compiler
