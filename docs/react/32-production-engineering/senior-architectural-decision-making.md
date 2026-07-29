---
title: Senior React Architectural Decision-Making
description: A decision framework for state, rendering, data, boundaries, performance, migration, and production trade-offs in senior React work.
sidebar_position: 4
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

# Senior React Architectural Decision-Making

Senior engineering is not memorizing one best practice. It is choosing a trade-off that fits **constraints, ownership, failure modes, user impact, reversibility, and operational cost**.

## Start from constraints, not tools

<VisualDiagram title="Tools come after the problem model">
  <DiagramRow>
    <DiagramNode title="Constraints" tone="blue">users · data · runtime · team · reliability · security</DiagramNode>
    <DiagramArrow direction="right" label="shape" />
    <DiagramNode title="Architecture options" tone="purple">state · rendering · boundaries · data · deployment</DiagramNode>
    <DiagramArrow direction="right" label="then choose" />
    <DiagramNode title="Tools" tone="green">Context · store · framework · library · APIs</DiagramNode>
  </DiagramRow>
</VisualDiagram>

“Context or Zustand?” is weaker than asking who owns the state, who reads/writes it, how frequently it changes, how long it lives, and what persistence/navigation semantics it needs.

## Use a repeatable decision frame

<LifecycleBar items={[
  { label: 'Problem', tone: 'red' },
  { label: 'Constraints', tone: 'blue' },
  { label: 'User impact', tone: 'cyan' },
  { label: 'Options', tone: 'purple' },
  { label: 'Trade-offs', tone: 'orange' },
  { label: 'Decision', tone: 'green' },
  { label: 'Validate + rollback', tone: 'slate' },
]} />

A written decision should make reversal and validation explicit, not merely name the chosen library.

## State decision tree

<DecisionTree
  question="What kind of state is this?"
  items={[
    { label: 'Fully derived from existing inputs', value: 'Compute during render' },
    { label: 'Local interaction state', value: 'Keep near the owning component' },
    { label: 'Small subtree coordination', value: 'Lift state or focused Context' },
    { label: 'Workflow with explicit events/transitions', value: 'Reducer/state-machine model' },
    { label: 'Remote data', value: 'Framework/server-state/cache layer' },
    { label: 'Navigation/shareable state', value: 'URL/search params' },
    { label: 'External mutable source', value: 'useSyncExternalStore-compatible subscription' },
  ]}
/>

Avoid redundant state when a value can be derived from one existing source of truth.

## Rendering is a per-feature decision

<DiagramGrid columns={3}>
  <DiagramNode title="Client rendering" tone="blue">high interactivity · browser-only capability · client-owned runtime state</DiagramNode>
  <DiagramNode title="SSR/streaming" tone="purple">initial HTML · metadata/SEO · streamed reveal</DiagramNode>
  <DiagramNode title="Server Components" tone="green">server-only data/code · reduced client graph · serializable boundary</DiagramNode>
</DiagramGrid>

Do not choose one rendering mode ideologically for every route.

## Keep Client boundaries narrow

<VisualDiagram title="Push interaction to the smallest useful client island">
  <DiagramStack>
    <DiagramNode title="Server page" tone="green">data + non-interactive structure</DiagramNode>
    <DiagramArrow label="serializable props" />
    <DiagramNode title="Small ClientWidget" tone="blue">state · events · Effects · browser APIs</DiagramNode>
  </DiagramStack>
</VisualDiagram>

Every `'use client'` boundary expands the client module graph. Check serialization and server-only dependencies at that seam.

## Effect decision tree

<DecisionTree
  question="Why does this code need to run?"
  items={[
    { label: 'Derived from current props/state', value: 'Render' },
    { label: 'Caused by explicit user interaction', value: 'Event handler / Action' },
    { label: 'Synchronizes committed UI with external system', value: 'Effect' },
    { label: 'Measures/updates layout before paint', value: 'Rare useLayoutEffect case' },
    { label: 'CSS-in-JS infrastructure style insertion', value: 'useInsertionEffect' },
  ]}
/>

An Effect is not a generic “run after React” escape hatch.

## Context decision frame

<DecisionTree
  question="Does Context fit this dependency?"
  items={[
    { label: 'Tree-scoped environment like theme/locale/session facade', value: 'Often a good fit' },
    { label: 'Compound component coordination', value: 'Often a good fit internally' },
    { label: 'High-frequency unrelated global state', value: 'Prefer more selective ownership/store architecture' },
    { label: 'Remote cache or URL truth', value: 'Keep ownership in the correct system instead' },
  ]}
/>

Provider breadth and update frequency are architectural concerns, not only performance details.

## Reducers are for transition logic

```ts
type Action =
  | { type: 'submitted' }
  | { type: 'succeeded'; orderId: string }
  | { type: 'failed'; message: string };
```

<VisualDiagram title="Reducer value comes from explicit transition ownership">
  <DiagramRow>
    <DiagramNode title="Domain event" tone="blue">submitted / succeeded / failed</DiagramNode>
    <DiagramArrow direction="right" label="reducer" />
    <DiagramNode title="Next state" tone="green">centralized transition rule</DiagramNode>
  </DiagramRow>
</VisualDiagram>

Multiple fields alone are not a reason to add a reducer.

## Optimistic UI is a risk decision

<DecisionTree
  question="Should this mutation be optimistic?"
  items={[
    { label: 'Low-risk reversible interaction', value: 'Often a good candidate' },
    { label: 'Failure is common or rollback is confusing', value: 'Prefer pending/confirmed UI' },
    { label: 'Money, permissions, destructive irreversible outcome', value: 'Be conservative; server confirmation may be safer' },
    { label: 'Ordering/concurrency is unclear', value: 'Design reconciliation before optimistic projection' },
  ]}
/>

Optimistic speed is not worth misleading users about irreversible outcomes.

## Suspense boundary placement follows reveal units

<VisualDiagram title="Boundary granularity should match meaningful content groups">
  <DiagramGrid columns={3}>
    <DiagramNode title="Too high" tone="red">one slow widget replaces the whole screen</DiagramNode>
    <DiagramNode title="Balanced" tone="green">related content reveals together</DiagramNode>
    <DiagramNode title="Too low" tone="orange">many tiny fallbacks flicker independently</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Error Boundary placement follows recovery units

<DecisionTree
  question="Can this region fail while the rest stays useful?"
  items={[
    { label: 'Yes — route/widget/editor/thread can recover independently', value: 'Good Error Boundary candidate' },
    { label: 'No — this leaf has no meaningful fallback/recovery', value: 'Do not wrap it only for symmetry' },
  ]}
/>

## Memoization decisions start with evidence

<DecisionTree
  question="Why are you adding manual memoization?"
  items={[
    { label: 'Profiler found repeated expensive work', value: 'Targeted memo/useMemo may help' },
    { label: 'Stable function/value identity is part of an API contract', value: 'useCallback/useMemo may be justified' },
    { label: 'Style rule says every handler should be memoized', value: 'Do not add it mechanically' },
    { label: 'React Compiler already optimizes the ordinary case', value: 'Measure before layering manual caches' },
  ]}
/>

Correctness and architecture come before memoization complexity.

## Scheduling decisions separate urgency from cost

<VisualDiagram title="Scheduling can improve responsiveness without reducing total work">
  <DiagramGrid columns={2}>
    <DiagramNode title="Urgent" tone="blue">typing · pressed state · direct manipulation</DiagramNode>
    <DiagramNode title="Non-urgent" tone="purple">large result view · route/view transition</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

A Transition can make work interruptible; it does not turn a 200 ms calculation into a 20 ms calculation.

## Server Function decisions keep server discipline

<VisualDiagram title="Convenient transport does not remove backend responsibilities">
  <DiagramStack>
    <DiagramNode title="Server Function call" tone="purple">network-accessible mutation boundary</DiagramNode>
    <DiagramArrow label="must enforce" />
    <DiagramGrid columns={3}>
      <DiagramNode title="Validation" tone="cyan">runtime input</DiagramNode>
      <DiagramNode title="Authorization" tone="red">resource/action policy</DiagramNode>
      <DiagramNode title="Reliability" tone="green">idempotency · errors · observability</DiagramNode>
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

Complex business logic may still deserve a service/domain layer behind the Server Function adapter.

## Abstraction decisions

<DecisionTree
  question="Should repeated code become an abstraction?"
  items={[
    { label: 'Consumers share one stable concept and reason to change', value: 'A shared abstraction may be valuable' },
    { label: 'Markup only looks similar today', value: 'Wait; duplication can be cheaper than wrong coupling' },
    { label: 'Abstraction hides ownership or creates many flags', value: 'Prefer explicit composition' },
  ]}
/>

## Migration decisions optimize risk, not novelty

<DiagramGrid columns={2}>
  <DiagramNode title="Incremental migration" tone="green">smaller blast radius · coexistence · measurable checkpoints</DiagramNode>
  <DiagramNode title="Rewrite" tone="orange">clean slate but replaces known behavior with unproven behavior</DiagramNode>
</DiagramGrid>

Choose based on unsupported dependencies, security, architecture constraints, testability, team capacity, and reversibility—not age alone.

## Senior decision loop

<LifecycleBar items={[
  { label: 'Name owner + constraint', tone: 'blue' },
  { label: 'Model failure/UX', tone: 'red' },
  { label: 'Compare options', tone: 'purple' },
  { label: 'Choose reversible seam', tone: 'cyan' },
  { label: 'Measure/validate', tone: 'orange' },
  { label: 'Document consequences', tone: 'green' },
]} />

A strong senior decision is understandable even to someone who would have chosen a different tool, because the constraints and trade-offs are explicit.
