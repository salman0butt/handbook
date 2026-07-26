---
title: State — Visual Mental Model
description: Visualize React state as render snapshots, queued updates, derived values, ownership, lifting, and identity-based preservation or reset.
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

# State — visual mental model

State is React-owned memory that can schedule a new render when it changes.

<VisualDiagram title="State belongs to a component position in the tree" subtitle="The variable you read during render is a snapshot, not a live mutable box.">
  <DiagramStack align="center">
    <DiagramNode tone="blue" title="Current state snapshot" wide>`count = 0` for this render</DiagramNode>
    <DiagramArrow label="component calculates UI" />
    <DiagramNode tone="purple" title="Rendered UI + event handlers" wide>Handlers close over this render's values.</DiagramNode>
    <DiagramArrow label="setCount(...) queues an update" />
    <DiagramNode tone="orange" title="React schedules rendering work" wide />
    <DiagramArrow />
    <DiagramNode tone="green" title="Next render gets a new snapshot" wide>`count = 1`</DiagramNode>
  </DiagramStack>
</VisualDiagram>

## State is a snapshot

<VisualDiagram title="One render does not change underneath you">
  <DiagramGrid columns={3}>
    <DiagramNode tone="blue" eyebrow="Render A" title="count = 0">Handlers created here see this render's snapshot.</DiagramNode>
    <DiagramNode tone="purple" eyebrow="Update" title="setCount(1)">Queues state for another render.</DiagramNode>
    <DiagramNode tone="green" eyebrow="Render B" title="count = 1">New handlers now close over the new snapshot.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Update queue

<VisualDiagram title="Value updates vs updater functions" subtitle="When the next value depends on the previous queued value, use the updater form.">
  <DiagramGrid columns={2}>
    <DiagramNode tone="orange" title="setCount(count + 1)">Uses the `count` value captured by this render.</DiagramNode>
    <DiagramNode tone="green" title="setCount(c => c + 1)">Receives the previous queued state and calculates the next one.</DiagramNode>
  </DiagramGrid>
  <DiagramArrow label="React processes queued updates" />
  <DiagramNode tone="blue" title="Next state snapshot" wide>React renders using the final calculated state.</DiagramNode>
</VisualDiagram>

## Store the minimum state

<VisualDiagram title="Owned state vs derived data">
  <DiagramStack align="center">
    <DiagramNode tone="blue" title="Source state" wide>`firstName` + `lastName`</DiagramNode>
    <DiagramArrow label="calculate during render" />
    <DiagramNode tone="green" title="Derived value" wide>`fullName = firstName + ' ' + lastName`</DiagramNode>
  </DiagramStack>
</VisualDiagram>

Duplicating `fullName` into separate state creates synchronization work with no new source of truth.

## Lift state when ownership must be shared

<VisualDiagram title="One shared owner, many consumers">
  <DiagramStack align="center">
    <DiagramNode tone="purple" title="Closest common parent owns the shared state" wide />
    <DiagramArrow label="passes value + event callbacks" />
    <DiagramGrid columns={2}>
      <DiagramNode tone="blue" title="Child A">reads shared value</DiagramNode>
      <DiagramNode tone="cyan" title="Child B">reads shared value</DiagramNode>
    </DiagramGrid>
    <DiagramArrow label="child intent flows upward through callbacks" />
    <DiagramNode tone="green" title="Owner updates state once" wide>Both children receive the next consistent snapshot.</DiagramNode>
  </DiagramStack>
</VisualDiagram>

## Preservation and reset

<VisualDiagram title="State is tied to identity + position">
  <DiagramGrid columns={2}>
    <DiagramNode tone="green" title="Same component identity at the same position">React preserves the existing state.</DiagramNode>
    <DiagramNode tone="red" title="Different identity / key / position">React creates a new state instance and the old one is discarded.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

<DecisionTree
  question="Where should this value live?"
  items={[
    { label: 'Only one component needs it?', value: 'Keep it local' },
    { label: 'Can it be calculated from existing props/state?', value: 'Derive it during render' },
    { label: 'Two sibling branches need the same source?', value: 'Lift state to the closest common owner' },
    { label: 'Should changing an entity reset local state?', value: 'Use identity/key intentionally' },
    { label: 'Is it remote data owned by a server?', value: 'Treat it as server state, not ordinary local state' },
  ]}
/>

## Keep this picture in your head

<VisualDiagram title="State flow" compact>
  <LifecycleBar
    items={[
      { label: 'snapshot', tone: 'blue' },
      { label: 'render UI', tone: 'purple' },
      { label: 'user intent', tone: 'orange' },
      { label: 'queue update', tone: 'cyan' },
      { label: 'next snapshot', tone: 'green' },
    ]}
  />
</VisualDiagram>

Continue through `useState`, snapshots and queues, choosing/sharing state, and preserving/resetting state for full code examples and debugging cases.
