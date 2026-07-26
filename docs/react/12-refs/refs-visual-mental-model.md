---
title: Refs Visual Mental Model
description: Visualize refs as persistent mutable values for imperative work, compare refs with state, and learn where DOM refs and imperative handles fit.
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

# Refs visual mental model

Refs persist between renders, but changing them does **not** request another render.

<VisualDiagram title="One ref object survives many renders">
  <DiagramStack align="center">
    <DiagramRow>
      <DiagramNode tone="blue" title="Render 1" />
      <DiagramNode tone="blue" title="Render 2" />
      <DiagramNode tone="blue" title="Render 3" />
    </DiagramRow>
    <DiagramArrow label="all receive the same ref object" />
    <DiagramNode tone="purple" title="ref object">
      `.current` can change imperatively without scheduling React rendering.
    </DiagramNode>
  </DiagramStack>
</VisualDiagram>

## State vs ref

<VisualDiagram title="Choose by whether React must render the change">
  <DiagramGrid columns={2}>
    <DiagramNode tone="green" eyebrow="Reactive" title="State">
      Persists between renders. Setter schedules future rendering. Use it when JSX depends on the value.
    </DiagramNode>
    <DiagramNode tone="purple" eyebrow="Imperative" title="Ref">
      Persists between renders. `.current` mutates immediately. Use it when React does not need to render the value.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

<DecisionTree
  question="Where should this value live?"
  items={[
    { label: 'Changes visible UI?', value: 'State' },
    { label: 'Timer / AbortController / external instance?', value: 'Ref' },
    { label: 'DOM node for focus or measurement?', value: 'Ref' },
    { label: 'Derived from props/state?', value: 'Calculate during render' },
    { label: 'Shared reactive application data?', value: 'State architecture, not a hidden ref store' },
  ]}
/>

## DOM refs

<VisualDiagram title="DOM ref ownership">
  <DiagramStack align="center">
    <DiagramNode tone="blue" title="React component">
      renders an element with `ref`
    </DiagramNode>
    <DiagramArrow label="commit attaches host node" />
    <DiagramNode tone="green" title="DOM element">
      input · dialog · canvas · video · measured element
    </DiagramNode>
    <DiagramArrow label="event / Effect uses imperative API" />
    <DiagramNode tone="purple" title="Imperative operation">
      focus · scroll · measure · play · integrate third-party widget
    </DiagramNode>
  </DiagramStack>
</VisualDiagram>

## Why refs are escape hatches

<VisualDiagram title="Healthy vs unhealthy ref usage">
  <DiagramGrid columns={2}>
    <DiagramNode tone="green" title="Healthy">
      Keep a narrow imperative handle React does not need for rendering.
    </DiagramNode>
    <DiagramNode tone="red" title="Unhealthy">
      Store UI/domain state in `.current` just to avoid re-renders.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

If the interface depends on a value, hiding that value in a ref breaks React's normal reactive data flow.

## Imperative handles

<VisualDiagram title="Expose the smallest imperative surface">
  <DiagramStack align="center">
    <DiagramNode tone="blue" title="Parent">
      needs one imperative capability
    </DiagramNode>
    <DiagramArrow />
    <DiagramNode tone="purple" title="Child ref contract">
      `focus()` · `open()` · `reset()` — only what is intentionally exposed
    </DiagramNode>
    <DiagramArrow />
    <DiagramNode tone="green" title="Internal DOM / implementation">
      stays encapsulated inside the child
    </DiagramNode>
  </DiagramStack>
</VisualDiagram>

Continue with **[useRef](./use-ref.md)** and **[DOM Refs and Imperative Handles](./dom-refs-and-imperative-handles.md)** for complete examples and edge cases.
