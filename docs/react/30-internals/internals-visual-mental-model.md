---
title: React Internals Visual Mental Model
description: Visualize reconciliation, identity, render work, commit, scheduling, and the boundary between stable React contracts and implementation details.
sidebar_position: 0
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

# React internals visual mental model

Internals are useful when they explain **observable React behavior**. Do not build application correctness around private data structures or heuristics that React does not promise publicly.

<VisualDiagram title="Render description → reconciliation → commit">
  <LifecycleBar
    items={[
      { label: 'Previous committed tree', tone: 'slate' },
      { label: 'New render description', tone: 'blue' },
      { label: 'Reconciliation', tone: 'purple' },
      { label: 'Accepted work', tone: 'cyan' },
      { label: 'Commit', tone: 'green' },
      { label: 'Host changes', tone: 'orange' },
    ]}
  />
</VisualDiagram>

## Identity controls state preservation

<VisualDiagram title="Component identity = type + position + key">
  <DiagramGrid columns={3}>
    <DiagramNode tone="blue" title="Type">Is React rendering the same component type?</DiagramNode>
    <DiagramNode tone="purple" title="Position">Is it occupying the same place in the render tree?</DiagramNode>
    <DiagramNode tone="green" title="Key">When siblings need identity hints, is the key stable and meaningful?</DiagramNode>
  </DiagramGrid>
  <DiagramArrow label="same identity" />
  <DiagramNode tone="cyan" title="State can be preserved" wide />
  <DiagramArrow label="identity changes" />
  <DiagramNode tone="orange" title="State below that point resets" wide />
</VisualDiagram>

## Render work can exist without commit

<VisualDiagram title="Render and commit are separate phases">
  <DiagramGrid columns={2}>
    <DiagramNode tone="purple" eyebrow="Render" title="Calculate a candidate tree">Pure computation may start, pause, restart, or be abandoned.</DiagramNode>
    <DiagramNode tone="green" eyebrow="Commit" title="Apply accepted changes">Host mutations and layout-sensitive work happen only for committed output.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Concurrent rendering changes scheduling, not component meaning

<LifecycleBar
  items={[
    { label: 'Start work', tone: 'blue' },
    { label: 'Pause or interrupt', tone: 'orange' },
    { label: 'Resume or restart', tone: 'purple' },
    { label: 'Commit completed result', tone: 'green' },
  ]}
/>

## Stable contract vs implementation detail

<DecisionTree
  question="Can application code rely on this?"
  items={[
    { label: 'State resets when identity changes', value: 'Yes — public application-facing behavior' },
    { label: 'Keys influence sibling identity', value: 'Yes — public behavior' },
    { label: 'Render may happen without DOM mutation', value: 'Yes — public mental model' },
    { label: 'Exact Fiber field layout or internal queue shape', value: 'No — implementation detail' },
    { label: 'Specific internal scheduling heuristic', value: 'Do not treat it as an application contract' },
  ]}
/>

## Keep this mental model

<VisualDiagram title="React internals in one picture" compact>
  <DiagramRow>
    <DiagramNode tone="blue" title="Identity">Preserves state.</DiagramNode>
    <DiagramNode tone="purple" title="Render">Calculates possibilities.</DiagramNode>
    <DiagramNode tone="green" title="Commit">Publishes accepted work.</DiagramNode>
    <DiagramNode tone="slate" title="Internals">Explain, don't depend on them.</DiagramNode>
  </DiagramRow>
</VisualDiagram>

Continue with **Reconciliation, Identity, and State Preservation** for the detailed senior-level model.
