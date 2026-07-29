---
title: Concurrent Rendering Mental Model
description: Understand React concurrency as interruptible prioritized rendering, with render purity, commit semantics, scheduling, Transitions, deferred values, and Suspense.
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

# Concurrent rendering mental model

“Concurrent React” does **not** mean React runs your component code on several JavaScript threads at once.

The practical model is:

> React can prepare some renders with lower priority, interrupt them, abandon obsolete work, and commit only the result that matters.

## Render and commit are different phases

<VisualDiagram title="Not every render attempt commits">
  <DiagramStack align="center">
    <DiagramNode title="State update" tone="blue" />
    <DiagramArrow label="calculate next UI" />
    <DiagramNode title="Render work" tone="purple">May be interrupted, restarted, or discarded.</DiagramNode>
    <DiagramArrow label="completed result chosen" />
    <DiagramNode title="Commit" tone="green">Apply DOM/host changes.</DiagramNode>
    <DiagramArrow label="after committed layout/state exists" />
    <DiagramNode title="Layout / passive Effects run at their phases" tone="orange" />
  </DiagramStack>
</VisualDiagram>

The critical rule is that rendering is preparation; commit is the externally visible result.

## Rendering must be pure

Bad:

```jsx
function Invoice({ invoice }) {
  localStorage.setItem('lastInvoice', invoice.id);
  return <h1>{invoice.number}</h1>;
}
```

React might run that component while preparing work that never commits. External writes, subscriptions, analytics, DOM mutation, and network mutation do not belong in render.

Good:

```jsx
function Invoice({ invoice }) {
  return <h1>{invoice.number}</h1>;
}
```

Then put external work in event/Action/Effect logic according to why it happens.

## Priority is a UX decision

<VisualDiagram title="Separate immediate interaction from expensive presentation">
  <DiagramGrid columns={2}>
    <DiagramNode title="Urgent" tone="blue">Typing · pressed state · focus · selection · dragging.</DiagramNode>
    <DiagramNode title="Often non-urgent" tone="purple">Route navigation · large tab contents · filtered analytics · heavy visualizations.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Transitions and deferred values let you express this priority relationship.

## Interruption

<LifecycleBar
  items={[
    { label: 'Render expensive chart for filter A', tone: 'purple' },
    { label: 'User types', tone: 'blue' },
    { label: 'Urgent input render takes priority', tone: 'green' },
    { label: 'Old chart work can be discarded', tone: 'red' },
    { label: 'Chart restarts for latest state', tone: 'purple' },
  ]}
/>

Concurrency improves responsiveness because urgent interaction does not need to wait for every lower-priority render attempt to finish.

## Obsolete intermediate UI does not need to commit

Suppose the user selects filters `A → B → C` quickly.

<VisualDiagram title="React can skip an obsolete intermediate result">
  <DiagramStack align="center">
    <DiagramNode title="A committed" tone="green" />
    <DiagramArrow label="prepare B" />
    <DiagramNode title="B rendering" tone="purple" />
    <DiagramArrow label="C becomes latest before B commits" />
    <DiagramNode title="B can be abandoned" tone="red" />
    <DiagramArrow label="prepare latest state" />
    <DiagramNode title="C commits" tone="green" />
  </DiagramStack>
</VisualDiagram>

The goal is not to preserve every intermediate frame. The goal is to keep the UI responsive and eventually commit the latest valid result.

## Each render still has an isolated snapshot

Concurrency does not make state variables mutate under a running render.

<VisualDiagram title="Snapshots remain isolated">
  <DiagramGrid columns={2}>
    <DiagramNode title="Render A" tone="blue">Sees snapshot A.</DiagramNode>
    <DiagramNode title="Render B" tone="purple">Sees snapshot B.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

React may prepare those renders at different times, but each render remains conceptually pure and snapshot-based.

## Concurrency is not parallel JavaScript execution

A Transition does not create `thread 1` for input and `thread 2` for a chart. React still uses JavaScript's execution environment and scheduler; platform tools such as Web Workers are separate mechanisms for actual off-main-thread computation.

<VisualDiagram title="Scheduling is not multithreading">
  <DiagramGrid columns={2}>
    <DiagramNode title="React concurrency" tone="purple">Prioritize, yield, interrupt, restart render work.</DiagramNode>
    <DiagramNode title="Web Worker" tone="blue">Move suitable JavaScript computation to another thread.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## How the concurrency APIs fit together

<VisualDiagram title="Priority, lag, and readiness are separate dimensions">
  <DiagramGrid columns={3}>
    <DiagramNode title="useTransition" tone="purple" eyebrow="UPDATE PRIORITY">Mark an update you initiate as non-urgent.</DiagramNode>
    <DiagramNode title="useDeferredValue" tone="teal" eyebrow="CONSUMPTION PRIORITY">Let one consumer temporarily lag behind a changing value.</DiagramNode>
    <DiagramNode title="Suspense" tone="orange" eyebrow="READINESS / REVEAL">Coordinate what is shown when part of the render is not ready.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

### `useTransition`

```jsx
const [isPending, startTransition] = useTransition();

startTransition(() => {
  setPage(nextPage);
});
```

### `useDeferredValue`

```jsx
const deferredQuery = useDeferredValue(query);
```

### Suspense

A lower-priority render can suspend while React preserves useful already-revealed content until the new result is ready.

<VisualDiagram title="Concurrency + Suspense background flow">
  <DiagramStack align="center">
    <DiagramNode title="Transition / deferred work starts" tone="purple" />
    <DiagramArrow label="render next tree" />
    <DiagramNode title="Subtree suspends" tone="orange" />
    <DiagramArrow label="keep previous useful content when appropriate" />
    <DiagramNode title="Resource/code becomes ready" tone="teal" />
    <DiagramArrow label="retry and complete" />
    <DiagramNode title="Commit latest tree" tone="green" />
  </DiagramStack>
</VisualDiagram>

## `lazy` adds code readiness

A lazy component may suspend because its module has not loaded yet. That gives React another reason a background render may not be ready to commit.

Concurrency + Suspense coordinates that delay without requiring every navigation to destroy the current page.

## Effects belong to committed UI

A background render that never commits should not synchronize external systems.

<VisualDiagram title="Only committed UI owns committed Effects">
  <DiagramGrid columns={2}>
    <DiagramNode title="Abandoned render" tone="red">No committed DOM result → no Effects for that abandoned result.</DiagramNode>
    <DiagramNode title="Committed render" tone="green">Host updates land → appropriate Effects can run.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

If Suspense hides already visible content, layout Effect cleanup/re-setup follows the visible committed layout lifecycle.

## Strict Mode teaches the same design discipline

Strict Mode development checks can expose assumptions such as “render happens exactly once” or “Effect setup happens exactly once.”

Do not treat Strict Mode's development behavior as a literal production scheduler simulation. The design lesson is that code must remain correct when React renders, discards, retries, or replays work before commit.

## Priority APIs are not timing contracts

Do not write logic that depends on “Transition starts after X ms” or “deferred value always lags by 300ms.” These APIs express priority, not fixed timing.

React may complete lower-priority work almost immediately on a fast device.

## Responsive scheduling does not remove CPU cost

If a list renders 50,000 DOM nodes, consider architecture and performance work such as virtualization, pagination, better data structures, component boundaries, memoization where justified, Compiler optimization where applicable, or moving non-render CPU work off the main thread.

<VisualDiagram title="Concurrency changes scheduling, not the amount of work">
  <DiagramGrid columns={2}>
    <DiagramNode title="Scheduling problem" tone="purple">Urgent work is blocked by non-urgent rendering → concurrency APIs can help.</DiagramNode>
    <DiagramNode title="Cost problem" tone="orange">Render/DOM/computation is simply too large → reduce the work too.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Data consistency is a separate responsibility

React scheduling does not automatically solve stale network responses, optimistic conflicts, cache invalidation, transaction semantics, authorization changes, or broken external-store snapshots.

React decides **when rendering work is urgent**. Your data architecture decides **which data is valid**.

## Complete search flow

```jsx
const [query, setQuery] = useState('');
const deferredQuery = useDeferredValue(query);
```

<LifecycleBar
  items={[
    { label: 'User types', tone: 'blue' },
    { label: 'query commits urgently', tone: 'green' },
    { label: 'old deferredQuery may remain', tone: 'orange' },
    { label: 'React prepares latest results', tone: 'purple' },
    { label: 'new typing can interrupt', tone: 'blue' },
    { label: 'latest completed results commit', tone: 'green' },
  ]}
/>

Suspense can keep stale deferred results visible if new data is not ready.

## Complete navigation flow

```jsx
startTransition(() => {
  setRoute(nextRoute);
});
```

<LifecycleBar
  items={[
    { label: 'Navigation event', tone: 'blue' },
    { label: 'Route update marked non-urgent', tone: 'purple' },
    { label: 'Lazy/data work may suspend', tone: 'orange' },
    { label: 'Current route can stay visible', tone: 'green' },
    { label: 'New navigation may supersede old work', tone: 'red' },
    { label: 'Latest ready route commits', tone: 'green' },
  ]}
/>

## Senior design rule

Concurrency is most useful when architecture already separates urgent interaction state from expensive derived presentation.

<DecisionTree
  question="What should you fix first?"
  items={[
    { label: 'Urgent UI is blocked by non-urgent render work', value: 'Express priority with Transition/deferred value' },
    { label: 'Whole app re-renders because ownership is broad', value: 'Fix state/context/store boundaries first' },
    { label: 'DOM/computation is intrinsically huge', value: 'Reduce/virtualize/offload the work' },
    { label: 'Data can arrive out of order', value: 'Fix consistency in the data layer' },
  ]}
/>

## Common mistakes

- side effects during render;
- interpreting every abandoned render as a bug;
- using concurrency to hide poor state ownership;
- assuming old UI is always safe to preserve;
- treating priority APIs as request-ordering or timing tools.

## Debugging concurrency

Ask:

1. Which state is urgent?
2. Which update is a Transition?
3. Which value is deferred?
4. Which subtree is expensive?
5. Does it suspend?
6. Which boundary handles that suspension?
7. Can render work be interrupted safely?
8. Are there render side effects?
9. Is stale UI acceptable?
10. Is the real bottleneck render cost, network, computation, or DOM volume?

## Exercise

Build an analytics explorer with controlled search input, a large result list, lazy chart, Transition tab switch, deferred search value, and Suspense boundaries. Instrument renders and identify which attempts commit, which can be interrupted, and which UI is allowed to stay stale.

## Interview questions

**Beginner:** Does concurrent rendering mean React runs components on multiple threads?

**Intermediate:** Why must render functions remain pure if React can interrupt or abandon work?

**Senior:** Explain how urgent state, Transition updates, deferred values, Suspense, code splitting, and commit semantics interact during slow navigation with continued user input.

## Summary

<VisualDiagram title="Concurrent rendering mental model">
  <DiagramStack align="center">
    <DiagramNode title="Prioritized render preparation" tone="purple" />
    <DiagramArrow label="urgent work may interrupt" />
    <DiagramNode title="Obsolete attempts can be discarded" tone="red" />
    <DiagramArrow label="readiness may involve Suspense" />
    <DiagramNode title="Only latest completed result commits" tone="green" />
  </DiagramStack>
</VisualDiagram>

Concurrency means prioritized, interruptible rendering—not multithreaded component execution.

## References

- https://react.dev/reference/react/useTransition
- https://react.dev/reference/react/startTransition
- https://react.dev/reference/react/useDeferredValue
- https://react.dev/reference/react/Suspense
- https://react.dev/reference/react/lazy

## Next

Next, move from client concurrency into React DOM, portals, hydration, SSR, streaming, and server rendering.