---
title: Reconciliation, Identity, and State Preservation
description: A senior-level mental model for how React matches trees, preserves state, uses keys, and decides what to reuse or replace.
sidebar_position: 1
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

# Reconciliation, Identity, and State Preservation

React compares a new render description with the previous committed React tree and decides what identities can be preserved, replaced, or removed.

> **Conceptual model:** the stable application-facing rules matter more than private reconciler fields or exact heuristics.

## Reconciliation is not DOM diffing

<VisualDiagram title="React reasons about the React tree before the renderer mutates the host">
  <DiagramStack>
    <DiagramGrid columns={2}>
      <DiagramNode title="Previous committed React tree" tone="blue">accepted identities + state</DiagramNode>
      <DiagramNode title="New render description" tone="cyan">elements returned by components</DiagramNode>
    </DiagramGrid>
    <DiagramArrow label="reconcile identities" />
    <DiagramNode title="Accepted React work" tone="purple">reuse · replace · insert · remove</DiagramNode>
    <DiagramArrow label="commit through renderer" />
    <DiagramNode title="Host changes" tone="green">DOM / native platform mutations</DiagramNode>
  </DiagramStack>
</VisualDiagram>

A component can render without causing a DOM mutation, and state preservation depends on React identity rather than DOM resemblance.

## Identity controls state preservation

<VisualDiagram title="Component identity is shaped by type, position, and key">
  <DiagramGrid columns={3}>
    <DiagramNode title="Type" tone="blue">Card vs Editor vs Profile</DiagramNode>
    <DiagramNode title="Position" tone="purple">logical sibling/tree position</DiagramNode>
    <DiagramNode title="Key" tone="green">explicit sibling identity</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

When the identity is preserved, React can preserve state for that subtree. When identity changes, state below that point is recreated.

## Same type + same position can preserve state

```jsx
function Panel({ compact }) {
  return compact
    ? <Card density="compact" />
    : <Card density="comfortable" />;
}
```

<VisualDiagram title="Changing props is not the same as changing identity">
  <DiagramRow>
    <DiagramNode title="Card" tone="blue">density="compact"</DiagramNode>
    <DiagramArrow direction="right" label="props update" />
    <DiagramNode title="Same Card identity" tone="green">density="comfortable" · state preserved</DiagramNode>
  </DiagramRow>
</VisualDiagram>

## Different type resets the subtree

```jsx
function App({ editing }) {
  return <main>{editing ? <Editor /> : <Profile />}</main>;
}
```

<VisualDiagram title="Type replacement creates a new subtree identity">
  <DiagramRow>
    <DiagramNode title="Profile" tone="blue">old local state</DiagramNode>
    <DiagramArrow direction="right" label="different type" />
    <DiagramNode title="Editor" tone="orange">new local state</DiagramNode>
  </DiagramRow>
</VisualDiagram>

## Position matters among siblings

Without stable keys, reordering sibling components can make identity follow position rather than domain meaning.

<VisualDiagram title="Unkeyed sibling identity is position-sensitive">
  <DiagramGrid columns={2}>
    <DiagramNode title="Before" tone="blue">position 1: Editor · position 2: Sidebar</DiagramNode>
    <DiagramNode title="After reorder" tone="orange">position 1: Sidebar · position 2: Editor</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

If those siblings represent durable domain entities, give React stable keys that represent those entities.

## Keys are explicit sibling identity

```jsx
{messages.map(message => (
  <Message key={message.id} message={message} />
))}
```

<DecisionTree
  question="Is this a good key?"
  items={[
    { label: 'Stable domain ID unique among siblings', value: 'Yes — preferred' },
    { label: 'Array index for reorderable/insertable data', value: 'Risky — identity follows position' },
    { label: 'Math.random() / freshly generated value', value: 'No — forces a new identity every render' },
    { label: 'useId()', value: 'No — useId is for DOM relationships, not list identity' },
  ]}
/>

Keys only need to be unique among siblings, not globally across the application.

## Keys can intentionally reset state

```jsx
<Chat key={recipient.id} recipient={recipient} />
```

<VisualDiagram title="Changing a key is an intentional identity reset">
  <DiagramStack>
    <DiagramNode title="Chat key=A" tone="blue">Toolbar state · draft state · preview state</DiagramNode>
    <DiagramArrow label="key changes" />
    <DiagramNode title="Chat key=B" tone="green">fresh subtree state</DiagramNode>
  </DiagramStack>
</VisualDiagram>

Key placement is architectural: a key too high resets too much; a key too low can preserve state that belongs to the previous domain identity.

## Nested component definitions create unstable types

```jsx
function Dashboard() {
  function SearchBox() {
    const [query, setQuery] = useState('');
    return <input value={query} onChange={e => setQuery(e.target.value)} />;
  }

  return <SearchBox />;
}
```

Each `Dashboard` render creates a new `SearchBox` function identity. Prefer stable module-level component definitions.

## Render attempts and commits are different

<VisualDiagram title="A rendered candidate is not necessarily the UI users see">
  <LifecycleBar items={[
    { label: 'Update requested', tone: 'blue' },
    { label: 'Render candidate', tone: 'purple' },
    { label: 'May suspend/restart/abandon', tone: 'orange' },
    { label: 'Accepted work commits', tone: 'green' },
  ]} />
</VisualDiagram>

This is why render must be pure and why render logs are not proof that a result committed.

## Identity debugging checklist

<DecisionTree
  question="Why did local state reset unexpectedly?"
  items={[
    { label: 'Component type changed', value: 'Different identity — expected reset' },
    { label: 'Sibling position/order changed', value: 'Inspect keys and tree structure' },
    { label: 'Key changed', value: 'Verify whether reset is intentional' },
    { label: 'Component defined inside another render', value: 'Move definition to stable module scope' },
    { label: 'Whole ancestor remounted', value: 'Find the first identity change above the state owner' },
  ]}
/>

## Senior mental model

<DiagramGrid columns={2}>
  <DiagramNode title="Stable contract" tone="green">type/position/key identity · state preservation/reset · render/commit distinction</DiagramNode>
  <DiagramNode title="Implementation detail" tone="slate">exact internal diff heuristics · Fiber fields · flags · lane representation</DiagramNode>
</DiagramGrid>

Reason from the stable behavior React documents. Treat internal implementation details as a way to understand React—not as application dependencies.
