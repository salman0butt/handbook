---
title: Debugging Visual Mental Model
description: Visualize React debugging through symptom classification, ownership tracing, failure containment, observability, and root-cause verification.
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

# Debugging visual mental model

Debugging gets faster when you stop changing random code and instead trace **where the first incorrect assumption enters the system**.

<VisualDiagram title="Symptom → evidence → root cause">
  <LifecycleBar
    items={[
      { label: 'Reproduce symptom', tone: 'blue' },
      { label: 'Classify failure', tone: 'purple' },
      { label: 'Trace ownership/data flow', tone: 'cyan' },
      { label: 'Collect evidence', tone: 'orange' },
      { label: 'Form one hypothesis', tone: 'slate' },
      { label: 'Change one variable', tone: 'green' },
      { label: 'Verify root cause', tone: 'blue' },
    ]}
  />
</VisualDiagram>

## Classify the failure first

<VisualDiagram title="Different failure classes need different debugging paths">
  <DiagramGrid columns={3}>
    <DiagramNode tone="purple" title="Render failure">Thrown error · invalid assumption · boundary fallback</DiagramNode>
    <DiagramNode tone="blue" title="State/identity failure">Wrong owner · stale snapshot · unexpected reset · bad key</DiagramNode>
    <DiagramNode tone="cyan" title="Async failure">Race · stale request · missing cancellation · pending state</DiagramNode>
    <DiagramNode tone="orange" title="Performance failure">Render cost · network waterfall · layout/paint · third party</DiagramNode>
    <DiagramNode tone="red" title="Security/data failure">Untrusted input · authorization · serialization · secret exposure</DiagramNode>
    <DiagramNode tone="slate" title="Environment failure">Hydration · browser differences · build/deploy configuration</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Contain and report rendering failures separately

<VisualDiagram title="React error architecture">
  <DiagramStack align="center">
    <DiagramNode tone="red" title="Descendant render throws" wide />
    <DiagramArrow />
    <DiagramNode tone="purple" title="Nearest Error Boundary contains UI failure" wide>Fallback protects the surrounding interface.</DiagramNode>
    <DiagramArrow label="report evidence" />
    <DiagramNode tone="blue" title="Observability captures context" wide>Error · component stack · route · user-safe metadata · release version</DiagramNode>
  </DiagramStack>
</VisualDiagram>

## Follow ownership before effects

<DecisionTree
  question="The UI shows the wrong value. What do you inspect first?"
  items={[
    { label: 'Value comes from props', value: 'Trace the parent owner' },
    { label: 'Value is local state', value: 'Inspect initialization, updates, snapshots, and identity resets' },
    { label: 'Value is server data', value: 'Inspect query key/cache/freshness/server response' },
    { label: 'Value is URL-derived', value: 'Inspect navigation and parsing rather than syncing another copy' },
    { label: 'Multiple stores contain the same value', value: 'Suspect duplicate ownership before adding synchronization Effects' },
  ]}
/>

## Debug the first wrong transition

<VisualDiagram title="Trace transitions instead of staring at the final screen">
  <DiagramStack align="center">
    <DiagramNode tone="blue" title="Known-good state" wide />
    <DiagramArrow label="event / request / render" />
    <DiagramNode tone="orange" title="First unexpected transition" wide>This is usually more valuable than the later cascade of symptoms.</DiagramNode>
    <DiagramArrow />
    <DiagramNode tone="red" title="Visible failure" wide />
  </DiagramStack>
</VisualDiagram>

## Production debugging loop

<LifecycleBar
  items={[
    { label: 'Observe', tone: 'blue' },
    { label: 'Correlate', tone: 'purple' },
    { label: 'Reproduce', tone: 'orange' },
    { label: 'Isolate', tone: 'cyan' },
    { label: 'Fix', tone: 'green' },
    { label: 'Add regression protection', tone: 'slate' },
  ]}
/>

## Keep this mental model

<VisualDiagram title="Debugging in one picture" compact>
  <DiagramRow>
    <DiagramNode tone="blue" title="Symptom">What users see.</DiagramNode>
    <DiagramNode tone="purple" title="Evidence">What actually happened.</DiagramNode>
    <DiagramNode tone="orange" title="Cause">First broken assumption.</DiagramNode>
    <DiagramNode tone="green" title="Proof">Fix + regression test.</DiagramNode>
  </DiagramRow>
</VisualDiagram>

Continue with **Error Boundaries, Owner Stacks, and Root Error Handling** for detailed failure containment and production observability.
