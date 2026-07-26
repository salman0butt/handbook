---
title: Reducers Visual Mental Model
description: Visualize reducers as pure state transition functions, understand action flow, reducer + Context architecture, and when reducers clarify complex state.
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

# Reducers visual mental model

A reducer turns **current state + action → next state**.

<VisualDiagram title="Reducer transition model">
  <DiagramStack align="center">
    <DiagramRow>
      <DiagramNode tone="blue" title="Current state">
        the existing snapshot
      </DiagramNode>
      <DiagramNode tone="amber" title="Action">
        describes what happened
      </DiagramNode>
    </DiagramRow>
    <DiagramArrow label="pure transition function" />
    <DiagramNode tone="purple" title="reducer(state, action)" />
    <DiagramArrow />
    <DiagramNode tone="green" title="Next state">
      a new snapshot React can render from
    </DiagramNode>
  </DiagramStack>
</VisualDiagram>

## Actions describe events, reducers decide transitions

<VisualDiagram title="Separate intent from transition logic">
  <DiagramGrid columns={2}>
    <DiagramNode tone="amber" title="Action">
      `{'{ type: "itemAdded", item }'}` says what happened.
    </DiagramNode>
    <DiagramNode tone="purple" title="Reducer">
      decides how that event changes the state model.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Reducers stay pure

<VisualDiagram title="Reducer boundary">
  <DiagramGrid columns={2}>
    <DiagramNode tone="green" title="Inside reducer">
      calculate next state · validate transitions · update immutable structures
    </DiagramNode>
    <DiagramNode tone="red" title="Outside reducer">
      network calls · analytics · timers · DOM APIs · random external effects
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## When a reducer helps

<DecisionTree
  question="Does this state need a reducer?"
  items={[
    { label: 'One or two simple independent values?', value: 'useState is often clearer' },
    { label: 'Many related transitions?', value: 'Reducer can centralize them' },
    { label: 'Transitions are naturally event/action driven?', value: 'Reducer is a strong fit' },
    { label: 'Need transition logic tested independently?', value: 'Reducer helps' },
    { label: 'Problem is remote caching or subscription granularity?', value: 'Reducer alone is not the solution' },
  ]}
/>

## Reducer + Context

<VisualDiagram title="Shared feature state without one giant global store">
  <DiagramStack align="center">
    <DiagramNode tone="green" title="Feature Provider">
      owns `useReducer`
    </DiagramNode>
    <DiagramArrow />
    <DiagramRow>
      <DiagramNode tone="blue" title="State Context">
        read current feature state
      </DiagramNode>
      <DiagramNode tone="purple" title="Dispatch Context">
        send actions to the owner
      </DiagramNode>
    </DiagramRow>
    <DiagramArrow />
    <DiagramRow>
      <DiagramNode tone="amber" title="Feature UI A" />
      <DiagramNode tone="cyan" title="Feature UI B" />
      <DiagramNode tone="slate" title="Feature UI C" />
    </DiagramRow>
  </DiagramStack>
</VisualDiagram>

## The debugging advantage

<VisualDiagram title="Trace behavior as events and transitions">
  <DiagramStack align="center">
    <DiagramNode tone="amber" title="User / system event" />
    <DiagramArrow label="dispatch action" />
    <DiagramNode tone="purple" title="Reducer transition" />
    <DiagramArrow />
    <DiagramNode tone="green" title="Next state" />
    <DiagramArrow />
    <DiagramNode tone="blue" title="UI renders from state" />
  </DiagramStack>
</VisualDiagram>

This makes it easier to ask: **what action happened, what state existed, and what transition produced the result?**

Continue with **[useReducer and Reducer Design](./use-reducer-and-reducer-design.md)** and **[Reducer with Context](./reducer-with-context.md)** for implementation details, TypeScript patterns, and production architecture.
