---
title: Custom Hooks Visual Mental Model
description: Visualize how custom Hooks reuse stateful behavior without sharing state, compose React primitives, and create focused internal APIs.
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
} from '@site/src/components/handbook/VisualDiagram';

# Custom Hooks visual mental model

A custom Hook reuses **behavior**, not one shared state instance.

<VisualDiagram title="Same Hook, separate state lifecycles">
  <DiagramGrid columns={2}>
    <DiagramStack align="center">
      <DiagramNode tone="blue" title="Component A" />
      <DiagramArrow label="calls" />
      <DiagramNode tone="purple" title="useOnlineStatus()">
        A's own state + Effect lifecycle
      </DiagramNode>
    </DiagramStack>
    <DiagramStack align="center">
      <DiagramNode tone="green" title="Component B" />
      <DiagramArrow label="calls" />
      <DiagramNode tone="purple" title="useOnlineStatus()">
        B's own state + Effect lifecycle
      </DiagramNode>
    </DiagramStack>
  </DiagramGrid>
</VisualDiagram>

## What extraction changes

<VisualDiagram title="Move infrastructure behind a named behavior">
  <DiagramGrid columns={2}>
    <DiagramNode tone="red" title="Before extraction">
      Component owns listener setup, cleanup, state, timers, derived flags, and JSX.
    </DiagramNode>
    <DiagramNode tone="green" title="After extraction">
      Custom Hook owns reusable React mechanics. Component keeps UI and domain intent visible.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Hooks compose other Hooks

<VisualDiagram title="Custom Hook composition">
  <DiagramStack align="center">
    <DiagramNode tone="blue" title="Component">
      asks for a domain capability
    </DiagramNode>
    <DiagramArrow />
    <DiagramNode tone="purple" title="useDashboardData(userId)">
      combines focused reusable behavior
    </DiagramNode>
    <DiagramArrow />
    <DiagramRow>
      <DiagramNode tone="green" title="useOnlineStatus" />
      <DiagramNode tone="amber" title="usePreferences" />
      <DiagramNode tone="cyan" title="useNotifications" />
    </DiagramRow>
    <DiagramArrow />
    <DiagramNode tone="slate" title="React primitives + external systems">
      state · Effects · refs · Context · subscriptions
    </DiagramNode>
  </DiagramStack>
</VisualDiagram>

## A Hook is an API

<VisualDiagram title="Design the contract, not just the extraction">
  <DiagramGrid columns={2}>
    <DiagramNode tone="red" title="Leaky API">
      Exposes internal setters, refs, loading flags, and unrelated responsibilities.
    </DiagramNode>
    <DiagramNode tone="green" title="Domain API">
      Exposes meaningful values and operations such as `signIn`, `signOut`, `reload`, or `selectPlan`.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

<DecisionTree
  question="Should this become a custom Hook?"
  items={[
    { label: 'Repeated stateful React behavior?', value: 'Good extraction candidate' },
    { label: 'Reusable browser/external integration?', value: 'Good extraction candidate' },
    { label: 'Pure calculation with no Hooks?', value: 'Normal helper function' },
    { label: 'Several unrelated Effects hidden together?', value: 'Split responsibilities first' },
    { label: 'Only reason is file length?', value: 'Not enough reason by itself' },
  ]}
/>

## Hooks do not make state global

<VisualDiagram title="Reuse logic ≠ share ownership">
  <DiagramStack align="center">
    <DiagramNode tone="purple" title="Custom Hook implementation" />
    <DiagramArrow label="called independently by" />
    <DiagramRow>
      <DiagramNode tone="blue" title="Caller A state" />
      <DiagramNode tone="green" title="Caller B state" />
      <DiagramNode tone="amber" title="Caller C state" />
    </DiagramRow>
    <DiagramArrow label="need one shared source instead?" />
    <DiagramNode tone="slate" title="Choose shared ownership architecture">
      Context · external store · shared cache · framework data owner
    </DiagramNode>
  </DiagramStack>
</VisualDiagram>

Continue with **[Custom Hooks](./custom-hooks.md)** for API design, Effect Events, testing, platform constraints, and production examples.
