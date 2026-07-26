---
title: Effects Visual Mental Model
description: Learn when Effects belong, how synchronization starts and stops, how dependencies configure the process, and how cleanup protects correctness.
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
} from '@site/src/components/handbook/VisualDiagram';

# Effects visual mental model

Before memorising `useEffect`, classify the work.

<VisualDiagram
  title="Render, event, or Effect?"
  subtitle="Choose by cause, not by timing."
>
  <DiagramGrid columns={3}>
    <DiagramNode tone="blue" eyebrow="Render" title="Calculate UI">
      Pure calculations from current props, state, and context.
    </DiagramNode>
    <DiagramNode tone="green" eyebrow="Event" title="Respond to intent">
      Work caused by a specific click, submit, drag, or other interaction.
    </DiagramNode>
    <DiagramNode tone="purple" eyebrow="Effect" title="Synchronize externally">
      Keep React aligned with a browser API, subscription, timer, connection, or third-party system.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## The synchronization lifecycle

An Effect is better understood as a process that can **start and stop repeatedly**.

<VisualDiagram title="Effect lifecycle" subtitle="Think setup → cleanup → setup, not mount/update/unmount.">
  <LifecycleBar
    items={[
      { label: 'Render with room = general', tone: 'blue' },
      { label: 'Connect to general', tone: 'green' },
      { label: 'room changes to travel', tone: 'amber' },
      { label: 'Disconnect general', tone: 'red' },
      { label: 'Connect travel', tone: 'green' },
      { label: 'Component leaves', tone: 'slate' },
      { label: 'Disconnect travel', tone: 'red' },
    ]}
  />
</VisualDiagram>

## Dependencies configure the process

<VisualDiagram title="Dependencies are not a scheduling wish list">
  <DiagramStack align="center">
    <DiagramNode tone="blue" title="Effect reads reactive values">
      Example: `roomId` and `serverUrl`.
    </DiagramNode>
    <DiagramArrow label="those values configure synchronization" />
    <DiagramNode tone="purple" title="Dependency list describes them">
      `[roomId, serverUrl]`
    </DiagramNode>
    <DiagramArrow label="when configuration changes" />
    <DiagramNode tone="green" title="React re-synchronizes">
      Cleanup the old process, then start the new one.
    </DiagramNode>
  </DiagramStack>
</VisualDiagram>

## Cleanup mirrors setup

<VisualDiagram title="Correct Effect symmetry">
  <DiagramGrid columns={2}>
    <DiagramNode tone="green" title="Setup">
      connect · subscribe · add listener · start timer · create widget
    </DiagramNode>
    <DiagramNode tone="red" title="Cleanup">
      disconnect · unsubscribe · remove listener · clear timer · destroy widget
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Should this be an Effect?

<DecisionTree
  question="What caused this work?"
  items={[
    { label: 'Needed to calculate JSX?', value: 'Render logic' },
    { label: 'Specific user interaction?', value: 'Event handler' },
    { label: 'External system must stay synchronized?', value: 'Effect' },
    { label: 'Derived value from existing state?', value: 'Calculate during render' },
    { label: 'Parent should own the value?', value: 'Lift state instead of syncing copies' },
  ]}
/>

## Strict Mode is a cleanup test

<VisualDiagram title="Development Strict Mode stress test">
  <DiagramStack align="center">
    <DiagramNode tone="green" title="Setup" />
    <DiagramArrow />
    <DiagramNode tone="red" title="Cleanup" />
    <DiagramArrow />
    <DiagramNode tone="green" title="Setup again" />
  </DiagramStack>
</VisualDiagram>

If that sequence breaks the integration, the Effect usually has a cleanup or ownership problem. The goal is not to suppress the second setup; the goal is to make the process safe to restart.

## Network race mental model

<VisualDiagram title="Why stale requests need cancellation or ownership">
  <DiagramGrid columns={2}>
    <DiagramNode tone="blue" title="Request A: react">
      Starts first, finishes later.
    </DiagramNode>
    <DiagramNode tone="purple" title="Request B: redux">
      Starts second, finishes first.
    </DiagramNode>
  </DiagramGrid>
  <DiagramArrow label="without cancellation" />
  <DiagramNode tone="red" title="Stale A can overwrite newer B">
    Use cancellation, framework data APIs, or a server-state library where appropriate.
  </DiagramNode>
</VisualDiagram>

## Keep this picture in your head

<VisualDiagram title="Effect decision summary" compact>
  <DiagramRow>
    <DiagramNode tone="blue" title="Render">calculate</DiagramNode>
    <DiagramNode tone="green" title="Event">respond</DiagramNode>
    <DiagramNode tone="purple" title="Effect">synchronize</DiagramNode>
    <DiagramNode tone="red" title="Cleanup">undo synchronization</DiagramNode>
  </DiagramRow>
</VisualDiagram>

Continue with **[useEffect and Synchronizing with External Systems](./use-effect.md)** for the complete API, code examples, debugging cases, and production guidance.
