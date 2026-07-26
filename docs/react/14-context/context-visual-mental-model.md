---
title: Context Visual Mental Model
description: Visualize Context as value propagation through the component tree, separate ownership from distribution, and learn provider placement and performance boundaries.
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

# Context visual mental model

Context solves **distribution through a subtree**. It does not create ownership by itself.

<VisualDiagram title="Ownership vs distribution">
  <DiagramStack align="center">
    <DiagramNode tone="green" title="State owner">
      `useState`, `useReducer`, external store, or another authoritative source owns the value.
    </DiagramNode>
    <DiagramArrow label="provider distributes access" />
    <DiagramNode tone="purple" title="Context Provider">
      makes the current value available below this point in the tree
    </DiagramNode>
    <DiagramArrow label="closest matching provider wins" />
    <DiagramRow>
      <DiagramNode tone="blue" title="Consumer A" />
      <DiagramNode tone="cyan" title="Consumer B" />
      <DiagramNode tone="amber" title="Nested feature" />
    </DiagramRow>
  </DiagramStack>
</VisualDiagram>

## Closest-provider mental model

<VisualDiagram title="Context follows the rendered tree">
  <DiagramStack align="center">
    <DiagramNode tone="purple" title="ThemeContext = light" />
    <DiagramArrow />
    <DiagramGrid columns={2}>
      <DiagramNode tone="blue" title="Header">
        reads `light`
      </DiagramNode>
      <DiagramStack align="center">
        <DiagramNode tone="green" title="Nested ThemeContext = dark" />
        <DiagramArrow />
        <DiagramNode tone="amber" title="Editor">
          reads `dark`
        </DiagramNode>
      </DiagramStack>
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

## Provider placement defines scope

<VisualDiagram title="Put providers around the smallest correct ownership boundary">
  <DiagramGrid columns={3}>
    <DiagramNode tone="green" title="Too low">
      Some consumers cannot reach the value.
    </DiagramNode>
    <DiagramNode tone="blue" title="Correct scope">
      All intended consumers are covered without making the value app-global.
    </DiagramNode>
    <DiagramNode tone="red" title="Too high">
      Unrelated features become coupled to the same provider and update scope.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Context update propagation

<VisualDiagram title="A changed provider value notifies consumers">
  <DiagramStack align="center">
    <DiagramNode tone="green" title="Owner produces next value" />
    <DiagramArrow />
    <DiagramNode tone="purple" title="Provider value changes" />
    <DiagramArrow label="subscribed consumers are notified" />
    <DiagramRow>
      <DiagramNode tone="blue" title="Consumer A" />
      <DiagramNode tone="blue" title="Consumer B" />
      <DiagramNode tone="blue" title="Consumer C" />
    </DiagramRow>
  </DiagramStack>
</VisualDiagram>

Context itself does not provide selector-style subscriptions to only one field of an object. Split contexts or choose an external store when update frequency and subscription granularity demand it.

<DecisionTree
  question="Should this value use Context?"
  items={[
    { label: 'One component or nearby siblings?', value: 'Prefer local/lifted state first' },
    { label: 'Stable environment value across a subtree?', value: 'Context is a strong fit' },
    { label: 'Many high-frequency fields with selective subscriptions?', value: 'Consider an external store' },
    { label: 'Remote cached server data?', value: 'Use server-state architecture instead' },
    { label: 'Need a provider-scoped service/store instance?', value: 'Context can inject that instance' },
  ]}
/>

## Split read and write responsibilities when useful

<VisualDiagram title="Read context + dispatch context">
  <DiagramGrid columns={2}>
    <DiagramNode tone="blue" title="State Context">
      Components that render from state subscribe to state changes.
    </DiagramNode>
    <DiagramNode tone="green" title="Dispatch Context">
      Components that only dispatch actions can depend on a stable dispatch function.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Continue with **[Context and useContext](./context-and-use-context.md)** and **[Context Architecture and Performance](./context-architecture-and-performance.md)** for complete examples and provider-design guidance.
