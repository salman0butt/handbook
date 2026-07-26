---
title: JavaScript for React — Visual Mental Model
description: Visualize the JavaScript concepts React relies on: values and references, immutable updates, array transforms, callbacks, closures, async work, and modules.
---

import {
  VisualDiagram,
  DiagramStack,
  DiagramGrid,
  DiagramNode,
  DiagramArrow,
  DecisionTree,
  LifecycleBar,
} from '@site/src/components/handbook/VisualDiagram'

# JavaScript for React — visual mental model

React is a JavaScript library. Before memorising React APIs, build the JavaScript models that React code depends on.

<VisualDiagram title="The JavaScript foundation under React" subtitle="React syntax becomes much easier when these ordinary JavaScript concepts are already familiar.">
  <DiagramGrid columns={3}>
    <DiagramNode tone="blue" title="Data">objects · arrays · destructuring · spread</DiagramNode>
    <DiagramNode tone="purple" title="Transformation">map · filter · find · reduce · derived values</DiagramNode>
    <DiagramNode tone="green" title="Functions">callbacks · closures · scope · modules</DiagramNode>
    <DiagramNode tone="cyan" title="Identity">primitive values · references · object equality</DiagramNode>
    <DiagramNode tone="orange" title="Async">Promises · async/await · event-loop basics</DiagramNode>
    <DiagramNode tone="slate" title="Expressions">ternaries · logical operators · optional chaining · nullish coalescing</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Arrays become UI

<VisualDiagram title="Array data → React list UI">
  <DiagramStack align="center">
    <DiagramNode tone="blue" title="Array of domain data" wide>`products`</DiagramNode>
    <DiagramArrow label="map each item" />
    <DiagramNode tone="purple" title="Transform data into element descriptions" wide>`products.map(product => <ProductCard ... />)`</DiagramNode>
    <DiagramArrow label="React renders the collection" />
    <DiagramNode tone="green" title="Visible list" wide>Each item becomes part of the component tree.</DiagramNode>
  </DiagramStack>
</VisualDiagram>

## Immutable updates

<VisualDiagram title="Mutation vs immutable update" subtitle="React state works best when previous snapshots remain unchanged.">
  <DiagramGrid columns={2}>
    <DiagramNode tone="red" eyebrow="Mutation" title="Change the existing value">
      `items.push(newItem)` keeps the same array object and modifies it in place.
    </DiagramNode>
    <DiagramNode tone="green" eyebrow="Immutable update" title="Create the next value">
      `[...items, newItem]` creates a new array while the previous snapshot stays intact.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Reference identity

<VisualDiagram title="Objects compare by identity, not by shape">
  <DiagramGrid columns={2}>
    <DiagramNode tone="blue" title="Primitive value">`5 === 5` → true</DiagramNode>
    <DiagramNode tone="orange" title="Object reference">`{} === {}` → false</DiagramNode>
  </DiagramGrid>
  <DiagramArrow label="why this matters later" />
  <DiagramGrid columns={4}>
    <DiagramNode tone="purple" title="Effects">dependency identity</DiagramNode>
    <DiagramNode tone="cyan" title="Context">provider value identity</DiagramNode>
    <DiagramNode tone="green" title="Memoization">memo/useMemo/useCallback</DiagramNode>
    <DiagramNode tone="slate" title="External stores">selector result identity</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Closures and render snapshots

<VisualDiagram title="Why React callbacks can remember older values" subtitle="The closure is JavaScript; the snapshot boundary comes from React rendering.">
  <LifecycleBar
    items={[
      { label: 'Render starts', tone: 'blue' },
      { label: 'Props/state values exist for this render', tone: 'cyan' },
      { label: 'Handlers/functions are created', tone: 'purple' },
      { label: 'Functions close over those values', tone: 'orange' },
      { label: 'Later callback runs with that closure', tone: 'green' },
    ]}
  />
</VisualDiagram>

## Async work

<VisualDiagram title="Async JavaScript does not block the whole runtime">
  <DiagramStack align="center">
    <DiagramNode tone="blue" title="Current JavaScript runs" wide />
    <DiagramArrow label="starts async work" />
    <DiagramNode tone="purple" title="Promise represents a future result" wide>pending → fulfilled or rejected</DiagramNode>
    <DiagramArrow label="current stack can finish" />
    <DiagramNode tone="orange" title="Continuation becomes eligible later" wide>`await` pauses the async function, not the entire JavaScript runtime.</DiagramNode>
  </DiagramStack>
</VisualDiagram>

## Which JavaScript tool fits?

<DecisionTree
  question="What are you trying to do?"
  items={[
    { label: 'Render one UI item for every array item?', value: 'map' },
    { label: 'Keep only matching items?', value: 'filter' },
    { label: 'Find one matching item?', value: 'find' },
    { label: 'Calculate a total or aggregate?', value: 'reduce or a clearer dedicated operation' },
    { label: 'Copy while changing an object/array?', value: 'spread + immutable update' },
    { label: 'Run code later after another operation?', value: 'callback / Promise / async function' },
    { label: 'Reuse code across files?', value: 'ES modules' },
  ]}
/>

## Keep this picture in your head

<VisualDiagram title="JavaScript → React" compact>
  <DiagramStack align="center">
    <DiagramNode tone="slate" title="JavaScript values + functions" wide />
    <DiagramArrow />
    <DiagramNode tone="blue" title="React components use those values to describe UI" wide />
    <DiagramArrow />
    <DiagramNode tone="green" title="React adds rendering, state, identity, and lifecycle semantics" wide />
  </DiagramStack>
</VisualDiagram>

Continue with the detailed **JavaScript for React** chapter for the complete examples, edge cases, closures, promises, modules, and event-loop explanation.
