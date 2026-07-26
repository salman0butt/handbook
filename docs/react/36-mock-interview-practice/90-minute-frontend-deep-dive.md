---
title: 90-Minute Frontend Deep Dive
sidebar_position: 4
description: A full frontend interview loop covering React, browser behavior, accessibility, performance, testing, debugging, and system design.
---

# 90-Minute Frontend Deep Dive

This round simulates a senior frontend interview where React knowledge is necessary but not sufficient.

## Interview plan

```text
0–15 min   React + JavaScript fundamentals
15–30 min  browser/platform reasoning
30–45 min  accessibility + testing
45–60 min  performance/debugging
60–85 min  frontend system design
85–90 min  candidate questions
```

## Part 1 — React + JavaScript

### Prompt 1

**Explain why closures matter in React.**

Strong answer:

- functions capture lexical environment;
- handlers and Effect callbacks observe values from the render that created them;
- stale closure bugs are often misunderstood as React “not updating”;
- functional state updates, Effect dependencies, refs, or architecture changes solve different closure-related problems.

### Prompt 2

**What is the difference between a value being mutable and React state being immutable by convention?**

Expected:

- JavaScript objects are mutable;
- React state should be treated as a snapshot;
- replacing state enables predictable change detection and avoids mutating values used by previous renders;
- local mutation of newly created objects can be fine before publishing them.

### Prompt 3

**What happens when you define a component inside another component?**

Expected:

- a new component function identity can be created on each render;
- React may treat it as a different component type;
- state can reset;
- compiler/lint rules can flag static-component problems;
- define stable components outside when they are conceptually independent.

## Part 2 — browser and platform

### Prompt 4

**A click handler updates state and then reads layout. What could go wrong?**

Discuss:

- state update scheduling;
- DOM may not yet reflect the new React state;
- `flushSync` exists for rare integration cases but should not become default control flow;
- `useLayoutEffect` can measure after DOM mutation before paint when necessary;
- layout reads/writes can cause performance problems.

### Prompt 5

**Explain event propagation in a React app with portals.**

Strong answer:

- portals change DOM placement, not React ownership;
- React event propagation follows the React tree;
- DOM native propagation and React logical ownership can therefore surprise developers;
- use clear event boundaries instead of relying on visual DOM placement assumptions.

### Prompt 6

**When would you use an external store subscription instead of Context?**

Expected:

- state exists outside React;
- selective subscription/high update frequency matters;
- tearing-consistent snapshots are required;
- `useSyncExternalStore` provides React-compatible subscription semantics.

## Part 3 — accessibility and testing

### Task

Review this component:

```tsx
function IconButton({ icon, onClick }) {
  return <div onClick={onClick}>{icon}</div>;
}
```

Find the accessibility and testing problems.

Strong answer:

- `div` is not a button;
- no keyboard behavior by default;
- no focusability by default;
- accessible name may be missing;
- prefer native `<button>`;
- test by role/name and keyboard interaction, not implementation details.

### Follow-up

**When is ARIA appropriate?**

Expected:

- semantic HTML first;
- ARIA describes semantics/state/relationships when native elements cannot express the required widget;
- ARIA does not implement keyboard behavior or business logic.

### Testing scenario

A test uses:

```tsx
fireEvent.click(screen.getByTestId('submit'));
expect(mockFn).toHaveBeenCalled();
```

How would you improve it?

Strong answer:

- prefer role/name query;
- use user-level interaction when appropriate;
- assert visible behavior/outcome rather than only internal callback invocation;
- include pending/error/success state where relevant.

## Part 4 — performance/debugging

### Scenario

A data grid becomes sluggish after adding column resizing and live prices.

Ask the candidate to separate possible costs:

- high-frequency data updates;
- Context propagation;
- expensive row renders;
- layout measurement;
- virtualization absence;
- unnecessary object/function churn;
- network parsing;
- paint/layout cost;
- third-party grid behavior.

Strong process:

1. capture a representative slow interaction;
2. inspect browser Performance timeline and React profiling data;
3. identify update frequency and expensive subtrees;
4. isolate live data from unrelated UI;
5. add selective subscription/virtualization/memoization only where evidence supports it;
6. remeasure.

## Part 5 — frontend system design

### Design prompt: collaborative analytics workspace

Requirements:

- authenticated users;
- multiple organizations;
- shareable dashboard URLs;
- draggable widgets;
- live metrics;
- filters;
- autosaved layouts;
- permission-aware actions;
- large tables;
- offline/reconnect awareness;
- accessibility;
- audit events;
- feature flags.

### Candidate should cover

#### State model

Classify:

- URL state;
- local interaction state;
- server state;
- external realtime state;
- optimistic mutation state;
- session/auth state;
- ephemeral drag state.

#### Component boundaries

Discuss:

- shell/layout;
- dashboard feature modules;
- widget contracts;
- error boundaries;
- Suspense/loading boundaries;
- platform services.

#### Data flow

Discuss:

- initial load;
- live updates;
- mutation conflicts;
- cache invalidation;
- reconnect behavior;
- request ordering;
- tenant authorization.

#### Performance

Discuss:

- selective subscriptions;
- virtualized tables;
- code splitting;
- lazy widgets;
- scheduling non-urgent updates;
- measurement strategy.

#### Accessibility

Discuss:

- keyboard drag alternative;
- focus management;
- semantic controls;
- live-update announcements only when useful;
- accessible chart summaries.

#### Testing

Discuss:

- pure logic tests;
- component behavior tests;
- integration tests for data flow;
- E2E critical workflows;
- accessibility automation + manual keyboard testing.

#### Observability

Discuss:

- frontend error telemetry;
- recoverable hydration issues if server-rendered;
- performance metrics;
- feature/release correlation;
- realtime connection health.

## Constraint changes

Introduce one at a time:

1. Widgets now come from third-party teams.
2. Dashboard must support 200 widgets.
3. Data updates 10 times per second.
4. Product wants offline editing.
5. The app is moving from client-only rendering to SSR.
6. Five teams need independent deploy ownership.

The candidate should adapt the architecture rather than defend the original design at all costs.

## Scoring

A strong senior frontend candidate:

- understands browser behavior, not only React APIs;
- includes accessibility and testing in design;
- treats performance as measurement-driven;
- separates state categories;
- discusses failure modes;
- can evolve the design when constraints change.

A staff-level answer additionally addresses team boundaries, platform contracts, migration sequencing, and observability standards.