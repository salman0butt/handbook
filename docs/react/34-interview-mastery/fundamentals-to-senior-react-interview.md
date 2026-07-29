---
title: React Interview Mastery — Fundamentals to Senior
description: A structured React interview guide from junior foundations through senior reasoning, with model answers, follow-ups, traps, and production trade-offs.
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

# React interview mastery — fundamentals to senior

React interviews become easier when answers are built from mental models rather than memorized trivia.

## Strong answer shape

<LifecycleBar items={[
  { label: 'Definition', tone: 'blue' },
  { label: 'Mental model', tone: 'cyan' },
  { label: 'Behavior', tone: 'purple' },
  { label: 'Common mistake', tone: 'red' },
  { label: 'Trade-off', tone: 'orange' },
  { label: 'Production example', tone: 'green' },
]} />

Give the direct answer first, then deepen only as the interviewer asks.

## Junior foundations

<DiagramGrid columns={3}>
  <DiagramNode title="React" tone="blue">declarative component-based UI library</DiagramNode>
  <DiagramNode title="JSX" tone="cyan">syntax describing React element trees, not DOM itself</DiagramNode>
  <DiagramNode title="Props" tone="purple">inputs received from a parent</DiagramNode>
  <DiagramNode title="State" tone="green">memory owned by component identity/position</DiagramNode>
  <DiagramNode title="Keys" tone="orange">sibling identity across renders</DiagramNode>
  <DiagramNode title="Forms" tone="slate">controlled or uncontrolled ownership</DiagramNode>
</DiagramGrid>

A junior-quality answer should be accurate and concrete. A stronger answer already distinguishes React elements from DOM nodes and explains that keys participate in identity, not only warning suppression.

## Controlled vs uncontrolled inputs

<DecisionTree
  question="Who owns the current input value?"
  items={[
    { label: 'React state passes value + onChange', value: 'Controlled' },
    { label: 'DOM holds value after defaultValue', value: 'Uncontrolled' },
  ]}
/>

Neither model is universally better; choose based on workflow, validation, server/form integration, and ownership needs.

## Mid-level mental models

<VisualDiagram title="Rendering is calculation; commit makes accepted work visible">
  <DiagramRow>
    <DiagramNode title="Render" tone="purple">component evaluation · pure · restartable</DiagramNode>
    <DiagramArrow direction="right" label="accepted result" />
    <DiagramNode title="Commit" tone="green">DOM/ref/layout consequences become visible</DiagramNode>
  </DiagramRow>
</VisualDiagram>

Common render triggers include local state, ancestor evaluation, consumed Context changes, and external-store snapshots. Rendering does not imply a DOM mutation.

## State is a snapshot

```js
setCount(count + 1);
setCount(count + 1);
```

Both calls can use the same captured snapshot. When updates depend on queued previous state:

```js
setCount(c => c + 1);
setCount(c => c + 1);
```

<VisualDiagram title="Setters request a future snapshot">
  <DiagramRow>
    <DiagramNode title="Current render" tone="blue">count snapshot</DiagramNode>
    <DiagramArrow direction="right" label="queue updates" />
    <DiagramNode title="Next render" tone="green">new snapshot</DiagramNode>
  </DiagramRow>
</VisualDiagram>

## Effects, refs, Context, reducers

<DecisionTree
  question="Which React mechanism fits the problem?"
  items={[
    { label: 'External system synchronization after commit', value: 'Effect' },
    { label: 'Mutable value/DOM handle that should not drive rendering', value: 'Ref' },
    { label: 'Tree-scoped value distribution', value: 'Context' },
    { label: 'Explicit related state transitions', value: 'Reducer' },
    { label: 'Pure value derived from current inputs', value: 'Render calculation' },
  ]}
/>

Context distributes a value; it does not automatically provide persistence, selectors, request caching, normalization, or fine-grained subscriptions.

## Senior identity and reconciliation

<VisualDiagram title="State preservation follows React identity">
  <DiagramGrid columns={3}>
    <DiagramNode title="Type" tone="blue">component type</DiagramNode>
    <DiagramNode title="Position" tone="purple">logical tree/sibling position</DiagramNode>
    <DiagramNode title="Key" tone="green">explicit sibling identity</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Reconciliation compares the previous React tree with the next description to determine what can be preserved, updated, mounted, or removed. Avoid claiming React performs a generic optimal tree diff.

## Concurrency

<VisualDiagram title="Concurrent rendering means schedulable work, not parallel component execution">
  <DiagramGrid columns={4}>
    <DiagramNode title="Interrupt" tone="orange">urgent work may preempt render work</DiagramNode>
    <DiagramNode title="Restart" tone="cyan">React may recalculate with fresher inputs</DiagramNode>
    <DiagramNode title="Abandon" tone="red">obsolete candidate may never commit</DiagramNode>
    <DiagramNode title="Commit" tone="green">accepted result becomes visible</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Render purity matters because not every evaluation commits.

## Transition vs deferred value

<DiagramGrid columns={2}>
  <DiagramNode title="useTransition / startTransition" tone="purple">mark updates as non-urgent</DiagramNode>
  <DiagramNode title="useDeferredValue" tone="cyan">let downstream rendering consume a lagging value</DiagramNode>
</DiagramGrid>

Neither replaces request debounce/cancellation, caching, workers, or algorithmic optimization.

## Suspense and Error Boundaries

<VisualDiagram title="Readiness and failure are different states">
  <DiagramRow>
    <DiagramNode title="Not ready yet" tone="purple">Suspense fallback/reveal boundary</DiagramNode>
    <DiagramArrow direction="right" label="vs" />
    <DiagramNode title="Rendering failed" tone="red">Error Boundary containment/recovery</DiagramNode>
  </DiagramRow>
</VisualDiagram>

## Server Components vs SSR

<DiagramGrid columns={2}>
  <DiagramNode title="Server Components" tone="green">where component code executes + server/client module/serialization boundary</DiagramNode>
  <DiagramNode title="SSR" tone="blue">how initial HTML is produced and delivered/hydrated</DiagramNode>
</DiagramGrid>

They can be used together, but they solve different problems.

## Senior answer pressure test

<DecisionTree
  question="Can you make the answer senior-level?"
  items={[
    { label: 'Only definition is correct', value: 'Add mechanism and one concrete example' },
    { label: 'Mechanism is clear', value: 'Add failure mode/common misconception' },
    { label: 'Trade-offs are clear', value: 'Add production consequence/testing/observability' },
    { label: 'You can defend alternatives under different constraints', value: 'Senior-level reasoning' },
  ]}
/>

A senior interview answer is not longer for its own sake. It reveals a reliable model, scopes the claim, and shows how the choice behaves in production.
