---
title: Rules of React Visual Mental Model
description: Visualise purity, immutable snapshots, React-controlled component execution, Hook ordering, and why the Rules of React enable safe rendering and optimization.
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

# Rules of React visual mental model

The Rules of React protect the assumptions React uses to render, re-render, interrupt, retry, and optimize your components safely.

<VisualDiagram title="The four core contracts">
  <DiagramGrid columns={2}>
    <DiagramNode tone="blue" eyebrow="Purity" title="Render is a calculation">
      Components and Hooks should be idempotent for the same relevant inputs and should not perform external side effects during render.
    </DiagramNode>
    <DiagramNode tone="green" eyebrow="Immutability" title="Props and state are snapshots">
      Treat values as read-only for the current render and create next values instead of mutating previous snapshots.
    </DiagramNode>
    <DiagramNode tone="purple" eyebrow="Ownership" title="React calls Components and Hooks">
      Use components through JSX and Hooks through React component/custom-Hook execution, rather than invoking them as arbitrary functions.
    </DiagramNode>
    <DiagramNode tone="orange" eyebrow="Hook order" title="Hooks stay at the top level">
      Stable call order lets React associate each Hook call with the correct state and lifecycle slot across renders.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Purity makes rendering restartable

<VisualDiagram title="Why pure rendering matters">
  <DiagramStack>
    <DiagramNode tone="blue" title="React starts rendering a component" />
    <DiagramArrow label="render may be repeated, paused, or discarded" />
    <DiagramNode tone="purple" title="Pure calculations are safe to run again">
      Repeating render does not duplicate purchases, subscriptions, analytics writes, or external mutations.
    </DiagramNode>
    <DiagramArrow />
    <DiagramNode tone="green" title="React can optimize and schedule safely" />
  </DiagramStack>
</VisualDiagram>

## Side effects belong at explicit boundaries

<VisualDiagram title="Where should side effects happen?">
  <DiagramGrid columns={3}>
    <DiagramNode tone="blue" title="Render">
      Calculate UI only.
    </DiagramNode>
    <DiagramNode tone="green" title="Event handler">
      Perform work caused by a specific user interaction.
    </DiagramNode>
    <DiagramNode tone="purple" title="Effect">
      Synchronize the rendered component with an external system.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Hook order is positional identity

<VisualDiagram title="Hook call order across renders">
  <DiagramRow>
    <DiagramNode tone="green" eyebrow="Render A" title="Stable order">
      useState → useContext → useEffect
    </DiagramNode>
    <DiagramNode tone="green" eyebrow="Render B" title="Same order">
      useState → useContext → useEffect
    </DiagramNode>
  </DiagramRow>
</VisualDiagram>

<VisualDiagram title="Conditional Hook call breaks the mapping">
  <DiagramRow>
    <DiagramNode tone="red" eyebrow="Render A" title="Condition true">
      useState → useEffect → useRef
    </DiagramNode>
    <DiagramNode tone="red" eyebrow="Render B" title="Condition false">
      useState → useRef
    </DiagramNode>
  </DiagramRow>
</VisualDiagram>

## React owns component invocation

<VisualDiagram title="Component function vs component element">
  <DiagramGrid columns={2}>
    <DiagramNode tone="red" title="Profile(props)">
      Direct function calls bypass React's component execution model and can break Hook and identity assumptions.
    </DiagramNode>
    <DiagramNode tone="green" title="<Profile {...props} />">
      JSX lets React control when the component executes and how its identity participates in the tree.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Debug rule violations by category

<DecisionTree
  question="What kind of React rule might be broken?"
  items={[
    { label: 'External work happens while rendering', value: 'Move it to an event handler or synchronization Effect.' },
    { label: 'Props/state objects are changed in place', value: 'Create a new next value and preserve previous snapshots.' },
    { label: 'Hooks appear inside conditions, loops, callbacks, or after early returns', value: 'Move Hook calls to stable top-level positions.' },
    { label: 'A component function is invoked directly', value: 'Render it through JSX so React owns execution and identity.' },
    { label: 'A Hook argument or returned value is mutated unexpectedly', value: 'Treat values passed across Hook/JSX boundaries as immutable contracts.' },
  ]}
/>

## Keep this mental model

<VisualDiagram title="Rules of React in one picture">
  <DiagramStack>
    <DiagramNode tone="blue" title="Pure render + immutable snapshots" />
    <DiagramArrow />
    <DiagramNode tone="purple" title="Stable component and Hook execution model" />
    <DiagramArrow />
    <DiagramNode tone="green" title="React can retry, schedule, lint, and optimize safely" />
  </DiagramStack>
</VisualDiagram>

Continue with **Purity, Immutability and Render Safety** for the detailed rules, examples, and debugging guidance.