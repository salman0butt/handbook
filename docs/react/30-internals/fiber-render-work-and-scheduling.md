---
title: Fiber, Render Work, and Scheduling
description: A senior React mental model for Fiber, render work, interruption, scheduling, and why internal details must not become app dependencies.
sidebar_position: 2
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

# Fiber, Render Work, and Scheduling

React exposes a declarative API, but internally it must process updates, call components and Hooks, reconcile identities, coordinate Suspense, prioritize work, and commit accepted results.

> **Conceptual model:** Fiber is React's internal work architecture, not an application API. Do not depend on private fields, flags, lane values, or traversal details.

## Why React needs interruptible work

<VisualDiagram title="A huge render should not behave like one indivisible application task">
  <DiagramStack>
    <DiagramNode title="Update arrives" tone="blue">new state/props/context</DiagramNode>
    <DiagramArrow label="schedule" />
    <DiagramNode title="Render work" tone="purple">evaluate component tree in units of work</DiagramNode>
    <DiagramArrow label="React may coordinate" />
    <DiagramGrid columns={4}>
      <DiagramNode title="Finish" tone="green">candidate ready</DiagramNode>
      <DiagramNode title="Interrupt" tone="orange">higher-priority work arrives</DiagramNode>
      <DiagramNode title="Restart" tone="cyan">recompute from fresher inputs</DiagramNode>
      <DiagramNode title="Abandon" tone="red">obsolete candidate never commits</DiagramNode>
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

The value is scheduling flexibility, not magical parallel JavaScript execution.

## Treat Fiber as an internal work record

A useful conceptual Fiber record connects:

<DiagramGrid columns={3}>
  <DiagramNode title="Identity" tone="blue">component + tree position</DiagramNode>
  <DiagramNode title="Relationships" tone="cyan">parent · child · sibling work</DiagramNode>
  <DiagramNode title="Updates" tone="purple">pending state/update information</DiagramNode>
  <DiagramNode title="Hooks/state" tone="green">bookkeeping for this identity</DiagramNode>
  <DiagramNode title="Priority" tone="orange">scheduling information</DiagramNode>
  <DiagramNode title="Commit data" tone="slate">work needed to publish accepted changes</DiagramNode>
</DiagramGrid>

Never read undocumented DOM properties such as `__reactFiber$...` in application code.

## Render and commit are separate phases

<VisualDiagram title="Render calculates; commit publishes">
  <DiagramRow>
    <DiagramNode title="Render phase" tone="purple">call components · read snapshots · reconcile · may suspend/restart/abort</DiagramNode>
    <DiagramArrow direction="right" label="accepted result" />
    <DiagramNode title="Commit phase" tone="green">host mutations · refs · layout work · externally visible result</DiagramNode>
  </DiagramRow>
</VisualDiagram>

This separation is why render-time side effects are unsafe: a render attempt can happen without ever committing.

## Only commits become visible

<VisualDiagram title="React may evaluate work the user never sees">
  <LifecycleBar items={[
    { label: 'Render attempt A', tone: 'blue' },
    { label: 'Interrupted/obsolete', tone: 'orange' },
    { label: 'Render attempt B', tone: 'purple' },
    { label: 'Commit B', tone: 'green' },
  ]} />
</VisualDiagram>

A `console.log()` during render means React evaluated the component, not that the user observed that candidate UI.

## Concurrency is cooperative scheduling

<VisualDiagram title="Concurrency changes scheduling, not JavaScript's thread model">
  <DiagramGrid columns={2}>
    <DiagramNode title="React concurrency" tone="green">prioritize · interrupt · restart · discard render work</DiagramNode>
    <DiagramNode title="Not automatic parallel CPU" tone="red">does not move arbitrary synchronous calculations to another thread</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

If one component performs a huge synchronous calculation, you may still need better algorithms, less data, virtualization, server computation, caching, or a Web Worker.

## Urgent vs Transition work

<DecisionTree
  question="How urgent is this update to the user?"
  items={[
    { label: 'Controlled input / direct manipulation / immediate accessibility state', value: 'Keep urgent' },
    { label: 'Large secondary view / route transition / expensive result refresh', value: 'May be a Transition' },
    { label: 'A value may intentionally lag behind an urgent value', value: 'Consider useDeferredValue' },
  ]}
/>

```jsx
const [isPending, startTransition] = useTransition();

function selectTab(tab) {
  startTransition(() => {
    setSelectedTab(tab);
  });
}
```

Transition work is non-blocking and interruptible relative to urgent work. It does not make expensive computation cheaper.

## Do not depend on lanes

Articles and source code often discuss **lanes**, React's internal priority representation.

<VisualDiagram title="Use the concept, not the representation">
  <DiagramRow>
    <DiagramNode title="Stable idea" tone="green">updates carry scheduling intent and React coordinates priorities</DiagramNode>
    <DiagramArrow direction="right" label="implemented internally by" />
    <DiagramNode title="Lanes" tone="slate">private representation that may change</DiagramNode>
  </DiagramRow>
</VisualDiagram>

Application code should use public APIs such as state updates, `startTransition`, `useTransition`, `useDeferredValue`, Suspense, and `<Activity>` rather than lane bitmasks or private Scheduler assumptions.

## State is a render snapshot

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    console.log(count);
  }
}
```

The handler sees the state snapshot from the render that created it.

<VisualDiagram title="Updates request a future snapshot; they do not mutate the current one">
  <DiagramRow>
    <DiagramNode title="Current snapshot" tone="blue">count = 0</DiagramNode>
    <DiagramArrow direction="right" label="setCount" />
    <DiagramNode title="Pending update" tone="orange">request next state</DiagramNode>
    <DiagramArrow direction="right" label="render + commit" />
    <DiagramNode title="Next snapshot" tone="green">count = 1</DiagramNode>
  </DiagramRow>
</VisualDiagram>

## Update queues are a stable mental model

```jsx
setCount(c => c + 1);
setCount(c => c + 1);
setCount(c => c + 1);
```

<LifecycleBar items={[
  { label: 'Updates requested', tone: 'blue' },
  { label: 'React queues/processes them', tone: 'cyan' },
  { label: 'Render computes next snapshot', tone: 'purple' },
  { label: 'Commit publishes accepted state', tone: 'green' },
]} />

You do not need internal queue node structures to reason correctly about functional updates.

## Restartable work makes purity essential

<VisualDiagram title="Why render purity is architectural, not stylistic">
  <DiagramStack>
    <DiagramNode title="React may retry render" tone="orange">same logical update can be evaluated more than once</DiagramNode>
    <DiagramArrow label="therefore" />
    <DiagramNode title="Render must be idempotent" tone="green">no external side effects · no mutation of snapshots</DiagramNode>
  </DiagramStack>
</VisualDiagram>

Event-caused work belongs in event handlers. Synchronization with external systems belongs in Effects. Render calculates UI.

## Stable contract vs implementation detail

<DiagramGrid columns={2}>
  <DiagramNode title="Use in app reasoning" tone="green">render/commit split · snapshots · interruptibility · public scheduling APIs</DiagramNode>
  <DiagramNode title="Keep out of app dependencies" tone="slate">Fiber fields · flags · lane constants · traversal order · private scheduler APIs</DiagramNode>
</DiagramGrid>

Senior-level internals knowledge should help explain public behavior while preserving the freedom for React's implementation to evolve.
