---
title: Lists & Keys — Visual Mental Model
description: Visualize array-to-element rendering, stable keys, sibling identity, reordering, insertion, and state preservation in React lists.
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

# Lists & Keys — visual mental model

Lists combine ordinary JavaScript array transforms with React's identity model.

<VisualDiagram title="Data collection → React list">
  <DiagramStack align="center">
    <DiagramNode tone="blue" title="Array of records" wide>`products`</DiagramNode>
    <DiagramArrow label="filter / sort / map" />
    <DiagramNode tone="purple" title="Element descriptions" wide>`<ProductRow key={product.id} ... />`</DiagramNode>
    <DiagramArrow label="keys identify siblings" />
    <DiagramNode tone="green" title="React matches old and new children" wide>Stable identity helps React preserve the right component state.</DiagramNode>
  </DiagramStack>
</VisualDiagram>

## Keys answer “which item is this?”

<VisualDiagram title="Stable key vs array index">
  <DiagramGrid columns={2}>
    <DiagramNode tone="green" eyebrow="Stable identity" title="key={todo.id}">
      The key follows the same domain item when the list reorders, inserts, or removes siblings.
    </DiagramNode>
    <DiagramNode tone="red" eyebrow="Position identity" title="key={index}">
      Identity follows the array position, which can attach local state to the wrong item after reordering.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Reordering mental model

<VisualDiagram title="Keys let identity move with the item" subtitle="Positions can change while identity stays stable.">
  <DiagramGrid columns={2}>
    <DiagramNode tone="blue" title="Before">A · B · C</DiagramNode>
    <DiagramNode tone="purple" title="After reorder">C · A · B</DiagramNode>
  </DiagramGrid>
  <DiagramArrow label="match by stable keys" />
  <DiagramGrid columns={3}>
    <DiagramNode tone="green" title="A stays A">state follows A</DiagramNode>
    <DiagramNode tone="green" title="B stays B">state follows B</DiagramNode>
    <DiagramNode tone="green" title="C stays C">state follows C</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Key scope

<VisualDiagram title="Keys only need to be unique among siblings">
  <DiagramStack align="center">
    <DiagramNode tone="slate" title="Parent list" wide />
    <DiagramArrow />
    <DiagramGrid columns={3}>
      <DiagramNode tone="blue" title="key='a'">Sibling A</DiagramNode>
      <DiagramNode tone="purple" title="key='b'">Sibling B</DiagramNode>
      <DiagramNode tone="cyan" title="key='c'">Sibling C</DiagramNode>
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

A key is not a global identifier for the whole application. It is identity information for siblings in one rendered collection.

## Filter first, render second

<VisualDiagram title="List transformation pipeline">
  <LifecycleBar
    items={[
      { label: 'source data', tone: 'blue' },
      { label: 'filter', tone: 'cyan' },
      { label: 'sort/group if needed', tone: 'orange' },
      { label: 'map to elements', tone: 'purple' },
      { label: 'assign stable keys', tone: 'green' },
    ]}
  />
</VisualDiagram>

<DecisionTree
  question="What should the key be?"
  items={[
    { label: 'Record has a stable database/domain ID?', value: 'Use that stable ID' },
    { label: 'Data has another stable unique field in this sibling set?', value: 'Use that stable value' },
    { label: 'List can reorder, insert, delete, or filter?', value: 'Avoid array index as identity' },
    { label: 'List is truly static and never changes order?', value: 'Index may be acceptable, but stable domain identity is still clearer when available' },
    { label: 'Child component needs the ID too?', value: 'Pass it as a normal prop; key itself is not passed through' },
  ]}
/>

## Keep this picture in your head

<VisualDiagram title="List identity" compact>
  <DiagramStack align="center">
    <DiagramNode tone="blue" title="data item" wide />
    <DiagramArrow label="stable key" />
    <DiagramNode tone="purple" title="React child identity" wide />
    <DiagramArrow label="preserves the right local state" />
    <DiagramNode tone="green" title="correct UI after insert / remove / reorder" wide />
  </DiagramStack>
</VisualDiagram>

Continue with the detailed Lists & Keys chapter for mapping, filtering, fragments, index-key failure cases, and identity debugging.
