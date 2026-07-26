---
title: React DOM Visual Mental Model
description: Visualise React core versus React DOM, host rendering, portals, flushSync, custom elements, and browser ownership boundaries.
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

# React DOM visual mental model

React describes UI. **React DOM is the renderer that connects React's model to the browser DOM.**

<VisualDiagram title="React core → React DOM → browser">
  <DiagramStack>
    <DiagramNode tone="blue" eyebrow="React" title="Component and rendering model">
      Components, Hooks, state, Context, Suspense, transitions, and element descriptions live in React's programming model.
    </DiagramNode>
    <DiagramArrow label="host renderer" />
    <DiagramNode tone="purple" eyebrow="React DOM" title="Browser renderer">
      React DOM knows how React elements map to DOM nodes, browser events, forms, hydration, portals, and DOM-specific APIs.
    </DiagramNode>
    <DiagramArrow label="host environment" />
    <DiagramNode tone="green" eyebrow="Browser" title="Real platform behaviour">
      HTML semantics, focus, layout, paint, CSS, accessibility APIs, events, and the actual DOM remain browser responsibilities.
    </DiagramNode>
  </DiagramStack>
</VisualDiagram>

## Portals change DOM placement, not React ownership

<VisualDiagram title="Portal mental model">
  <DiagramGrid columns={2}>
    <DiagramNode tone="blue" eyebrow="React tree" title="Ownership stays with the parent">
      Context, React event propagation, and component ownership follow the React tree.
    </DiagramNode>
    <DiagramNode tone="orange" eyebrow="DOM tree" title="Rendered node can live elsewhere">
      A modal or tooltip can be inserted into a separate DOM container using a portal.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

<VisualDiagram title="Portal example architecture">
  <DiagramStack>
    <DiagramNode tone="blue" title="App → Dialog component" />
    <DiagramArrow label="createPortal" />
    <DiagramNode tone="purple" title="React still owns Dialog in App tree" />
    <DiagramArrow label="DOM placement" />
    <DiagramNode tone="green" title="#modal-root receives the actual DOM nodes" />
  </DiagramStack>
</VisualDiagram>

## flushSync is an escape hatch

<VisualDiagram title="Normal scheduling vs flushSync">
  <DiagramRow>
    <DiagramNode tone="green" eyebrow="Default" title="Let React schedule updates">
      React can batch and coordinate work for responsiveness and consistency.
    </DiagramNode>
    <DiagramNode tone="red" eyebrow="Escape hatch" title="flushSync forces a synchronous boundary">
      Use only when an external/browser API requires the DOM to be updated before the next imperative step.
    </DiagramNode>
  </DiagramRow>
</VisualDiagram>

## React DOM does not replace the platform

<DiagramGrid columns={3}>
  <DiagramNode tone="cyan" title="Semantic HTML">
    Use native elements for built-in meaning, keyboard behaviour, and accessibility.
  </DiagramNode>
  <DiagramNode tone="orange" title="Custom elements">
    React DOM can interoperate with web components, but their contracts remain platform contracts.
  </DiagramNode>
  <DiagramNode tone="purple" title="SVG and DOM props">
    React DOM maps React props onto host-specific DOM/SVG behaviour.
  </DiagramNode>
</DiagramGrid>

## Choose the boundary intentionally

<DecisionTree
  question="Is this a React problem or a browser-renderer problem?"
  items={[
    { label: 'State, Hooks, Context, component composition', value: 'React core mental model.' },
    { label: 'DOM nodes, forms, portals, hydration, browser events', value: 'React DOM / browser boundary.' },
    { label: 'Focus, layout, CSS, native semantics', value: 'Understand the browser platform first.' },
    { label: 'Need DOM updated synchronously for an imperative integration', value: 'Consider flushSync only as a narrow escape hatch.' },
    { label: 'Need visual content outside normal DOM hierarchy', value: 'Consider a portal while preserving React ownership.' },
  ]}
/>

## Keep this mental model

<VisualDiagram title="React DOM in one picture">
  <DiagramRow>
    <DiagramNode tone="blue" title="React calculates UI" />
    <DiagramNode tone="purple" title="React DOM commits browser host changes" />
    <DiagramNode tone="green" title="The browser lays out, paints, focuses, and exposes platform behaviour" />
  </DiagramRow>
</VisualDiagram>

Continue with **Portals and flushSync** for the detailed browser-renderer APIs.