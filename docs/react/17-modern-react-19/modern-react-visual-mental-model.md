---
title: Modern React 19+ Visual Mental Model
description: Visualise Actions, pending state, optimistic UI, resources, Activity, metadata, and the modern mutation model in React 19.2.
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

# Modern React 19+ visual mental model

React 19+ adds primitives that make asynchronous mutations and resources easier to express without turning every workflow into manual loading/error state.

<VisualDiagram
  title="Modern React mutation flow"
  subtitle="User intent becomes an Action, while React coordinates pending and optimistic UI around it."
>
  <DiagramStack>
    <DiagramNode tone="blue" eyebrow="Intent" title="User submits or starts an Action">
      A form submission or transition starts work that may cross an async boundary.
    </DiagramNode>
    <DiagramArrow label="Action starts" />
    <DiagramNode tone="purple" eyebrow="Coordination" title="React tracks pending work">
      Transitions and Action-aware APIs keep urgent interaction separate from async completion.
    </DiagramNode>
    <DiagramArrow label="Optional optimistic projection" />
    <DiagramNode tone="orange" eyebrow="Optimistic UI" title="Show the expected result now">
      `useOptimistic` can project a temporary state while the real mutation is still pending.
    </DiagramNode>
    <DiagramArrow label="Mutation resolves" />
    <DiagramNode tone="green" eyebrow="Committed result" title="Render authoritative state">
      Success, returned Action state, navigation, or an error boundary determines the final UI.
    </DiagramNode>
  </DiagramStack>
</VisualDiagram>

## Which React 19+ primitive owns what?

<VisualDiagram title="Modern React 19+ responsibility map">
  <DiagramGrid columns={3}>
    <DiagramNode tone="blue" eyebrow="Mutation" title="Actions / transitions">
      Model async work that should participate in React's pending transition semantics.
    </DiagramNode>
    <DiagramNode tone="purple" eyebrow="Result state" title="useActionState">
      Keep structured results such as validation messages and pending status around an Action.
    </DiagramNode>
    <DiagramNode tone="green" eyebrow="Nested form UI" title="useFormStatus">
      Let descendants read the status of the parent form without lifting submission state manually.
    </DiagramNode>
    <DiagramNode tone="orange" eyebrow="Prediction" title="useOptimistic">
      Show a temporary expected result while the authoritative mutation is unresolved.
    </DiagramNode>
    <DiagramNode tone="cyan" eyebrow="Resources" title="use">
      Read a supported resource such as a Promise or Context while letting React coordinate suspension.
    </DiagramNode>
    <DiagramNode tone="slate" eyebrow="Visibility" title="Activity">
      Preserve UI state while changing visibility and effect behaviour for hidden work.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Traditional mutation vs Action-oriented mutation

<VisualDiagram title="Two mutation models">
  <DiagramRow>
    <DiagramNode tone="slate" eyebrow="Manual" title="Traditional event flow">
      Event handler → set pending → await request → set error/success → reset pending.
    </DiagramNode>
    <DiagramNode tone="green" eyebrow="Action-aware" title="Modern React flow">
      Action → React coordinates transition/pending state → result is rendered through dedicated primitives.
    </DiagramNode>
  </DiagramRow>
</VisualDiagram>

## Optimistic UI is a projection, not truth

<VisualDiagram title="Optimistic state lifecycle">
  <LifecycleBar
    items={[
      { label: 'Authoritative state', tone: 'blue' },
      { label: 'Optimistic projection', tone: 'orange' },
      { label: 'Mutation result', tone: 'purple' },
      { label: 'Reconcile', tone: 'green' },
    ]}
  />
</VisualDiagram>

## Where modern React stops

<DecisionTree
  question="What problem are you solving?"
  items={[
    { label: 'One async UI mutation', value: 'Action / transition primitives may fit.' },
    { label: 'Form result and validation state', value: 'Consider useActionState and useFormStatus.' },
    { label: 'Temporary optimistic feedback', value: 'Consider useOptimistic.' },
    { label: 'Shared server cache, invalidation, retries, dedupe', value: 'Use framework/server-state infrastructure rather than treating Actions as a cache.' },
    { label: 'Long-lived client application state', value: 'Use the client-state ownership tools from sections 14–16F.' },
  ]}
/>

## Keep this mental model

<VisualDiagram title="Modern React 19+ in one picture">
  <DiagramStack>
    <DiagramNode tone="blue" title="React still renders from state and props">
      The fundamentals do not disappear.
    </DiagramNode>
    <DiagramArrow />
    <DiagramNode tone="purple" title="New primitives improve async coordination">
      They express pending work, resources, form results, and optimistic projections more directly.
    </DiagramNode>
    <DiagramArrow />
    <DiagramNode tone="green" title="Architecture still owns truth">
      Server state, client state, URLs, forms, and external systems still need clear ownership boundaries.
    </DiagramNode>
  </DiagramStack>
</VisualDiagram>

Continue with **Actions and Async Transitions** for the detailed APIs and production patterns.