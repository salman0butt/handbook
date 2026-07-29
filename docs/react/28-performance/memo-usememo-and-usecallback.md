---
title: memo, useMemo, and useCallback
description: Manual memoization in modern React, when it helps, when it hurts, and how React Compiler changes the default strategy.
sidebar_position: 2
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

# `memo`, `useMemo`, and `useCallback`

Manual memoization is useful when it solves a measured problem. React Compiler now handles many ordinary memoization opportunities automatically, so the default strategy is increasingly **correct code → measure → targeted optimization**.

<VisualDiagram title="Modern memoization strategy">
  <LifecycleBar items={[
    { label: 'Write correct pure React code', tone: 'blue' },
    { label: 'Measure a real bottleneck', tone: 'purple' },
    { label: 'Let Compiler handle ordinary reuse', tone: 'teal' },
    { label: 'Add manual memoization only for precise needs', tone: 'orange' },
    { label: 'Profile again', tone: 'green' },
  ]} />
</VisualDiagram>

## The three tools

<DiagramGrid columns={3}>
  <DiagramNode title="memo" tone="purple">Skip a component render when props are equal and nothing else requires it.</DiagramNode>
  <DiagramNode title="useMemo" tone="blue">Reuse a calculated value while dependencies are equal.</DiagramNode>
  <DiagramNode title="useCallback" tone="teal">Reuse a function identity while dependencies are equal.</DiagramNode>
</DiagramGrid>

```jsx
const Row = memo(function Row({ item }) {
  return <div>{item.name}</div>;
});

const visibleItems = useMemo(
  () => filterItems(items, query),
  [items, query],
);

const handleSelect = useCallback(id => {
  setSelectedId(id);
}, []);
```

All three are about **reuse**, not durable state.

## `memo` mental model

<VisualDiagram title="memo adds a prop-comparison gate">
  <DiagramRow>
    <DiagramNode title="Parent renders" tone="blue">New parent render attempt</DiagramNode>
    <DiagramArrow direction="right" label="memo checks" />
    <DiagramNode title="Child props" tone="purple">Object.is per prop by default</DiagramNode>
    <DiagramArrow direction="right" label="unchanged?" />
    <DiagramNode title="Skip child render" tone="green">Only when nothing else requires update</DiagramNode>
  </DiagramRow>
</VisualDiagram>

A memoized component can still render when its own state changes, Context changes, an external-store snapshot changes, or React retries work.

## Prop identity can defeat manual memoization

```jsx
<Row options={{ compact: true }} onSelect={() => select(id)} />
```

The object and callback are recreated during each parent render.

Before adding more memoization, improve the component API where possible:

```jsx
<UserCard user={user} />
// or
<UserCard name={name} avatar={avatar} />
```

<DecisionTree
  question="Why is the child rendering?"
  items={[
    { label: 'Its own state / Context / store changed', value: 'memo cannot prevent a required update' },
    { label: 'Parent rendered and props are effectively unchanged', value: 'Compiler or targeted memo may help if the child is expensive' },
    { label: 'Props are recreated unnecessarily', value: 'Fix prop/ownership design before building memoization chains' },
  ]}
/>

## `useMemo` is a performance optimization

Trivial calculations usually do not need it:

```js
const total = price * quantity;
```

A verified expensive calculation might:

```js
const searchIndex = useMemo(() => {
  return buildSearchIndex(largeDataset);
}, [largeDataset]);
```

The benefit depends on actual cost, update frequency, and whether the cached result gets reused.

Do not use `useMemo` as durable storage for resources whose lifetime must be guaranteed. Use state, refs, or an appropriate external resource model.

## `useCallback` caches identity, not execution

```js
const handleSave = useCallback(() => {
  save(record);
}, [record]);
```

`save` still runs every time `handleSave()` is called. React merely may return the same function object while `record` is unchanged.

Function identity can matter for a memoized child, Hook dependency, subscription API, or external system that stores callbacks.

## Functional updates can reduce dependencies

```js
const addTodo = useCallback(text => {
  setTodos(current => [
    ...current,
    { id: crypto.randomUUID(), text },
  ]);
}, []);
```

This avoids capturing the current `todos` snapshot.

Never remove real dependencies just to make a callback “stable.” That creates stale closures.

## Restructure Effect dependencies before memoizing them

Instead of creating an object on every render and then memoizing it solely for an Effect:

```js
useEffect(() => {
  const options = { roomId, serverUrl };
  connect(options);
}, [roomId, serverUrl]);
```

Often the best optimization is eliminating the unnecessary identity dependency.

## React Compiler changes the default

Current React guidance says the Compiler can automatically memoize many values, functions, and component renders. New code generally does not need mechanical `memo`, `useMemo`, and `useCallback` everywhere.

Existing manual memoization should not be mass-deleted without testing because it can affect identity contracts and Compiler output.

<VisualDiagram title="Safe migration from manual memoization">
  <LifecycleBar items={[
    { label: 'Enable Compiler safely', tone: 'blue' },
    { label: 'Verify correctness', tone: 'purple' },
    { label: 'Profile', tone: 'teal' },
    { label: 'Remove one manual optimization only if justified', tone: 'orange' },
    { label: 'Compare behavior + performance again', tone: 'green' },
  ]} />
</VisualDiagram>

## Custom comparators are not free

```js
const Chart = memo(ChartImpl, (prev, next) => {
  return prev.points === next.points && prev.scale === next.scale;
});
```

The comparison costs time. Deep equality can cost more than rendering, and ignoring a changed callback can preserve stale behavior.

## Memoization chains are architectural warning signs

<VisualDiagram title="Manual optimization can cascade">
  <DiagramStack>
    <DiagramNode title="Child uses memo" tone="purple">Skip depends on stable props</DiagramNode>
    <DiagramArrow label="therefore" />
    <DiagramNode title="Parent stabilizes callback" tone="orange">useCallback</DiagramNode>
    <DiagramArrow label="callback captures object" />
    <DiagramNode title="Parent stabilizes object" tone="orange">useMemo</DiagramNode>
    <DiagramArrow label="complexity grows" />
    <DiagramNode title="Revisit ownership / API shape" tone="green">Architecture may beat the chain</DiagramNode>
  </DiagramStack>
</VisualDiagram>

## State placement often beats memoization

If hover state lives at the page root, each hover starts an update at the page root. If only a `ProductCard` needs it, keep it there.

<VisualDiagram title="Narrow ownership naturally narrows update scope">
  <DiagramRow>
    <DiagramNode title="Page-owned hover" tone="red">Large subtree reconsidered</DiagramNode>
    <DiagramArrow direction="right" label="move ownership" />
    <DiagramNode title="ProductCard-owned hover" tone="green">Only local owner updates</DiagramNode>
  </DiagramRow>
</VisualDiagram>

## Context bypasses prop memoization

A memoized component that reads Context still renders when that Context value changes. `memo` compares props; it does not freeze subscriptions.

## Huge lists need bigger tools

Per-row memoization may help, but virtualization, pagination, server filtering, and reducing DOM size can provide much larger gains.

Do not call Hooks inside loops. Extract a row component first, then measure whether memoization is needed.

## Decision guide

<DecisionTree
  question="What kind of optimization is justified?"
  items={[
    { label: 'Expensive pure calculation repeats with same inputs', value: 'Compiler or targeted useMemo after measurement' },
    { label: 'Expensive child repeatedly receives equal props', value: 'Compiler or targeted memo' },
    { label: 'Stable callback identity is an external/API contract', value: 'useCallback may be appropriate' },
    { label: 'Large collection dominates DOM/render cost', value: 'Virtualization/data architecture first' },
    { label: 'Local state causes giant ancestor updates', value: 'Move state toward its real owner' },
    { label: 'Tiny cheap component renders frequently', value: 'Usually leave it alone' },
  ]}
/>

## Common mistakes

- Memoizing trivial calculations.
- Memoizing values whose dependencies change every render.
- Using `useCallback` for every local handler.
- Writing expensive deep custom comparators.
- Treating `useMemo` as correctness or durable state.
- Optimizing before profiling.

## Interview questions

### What does `useCallback` cache?

The function identity, not the result of calling the function.

### Can a `memo` component still re-render?

Yes. State, Context, external stores, retries, and other React work can require rendering.

### Should every expensive-looking calculation use `useMemo`?

No. Measure real cost and reuse first.

### How does React Compiler change the default strategy?

Compiler handles many ordinary memoization opportunities automatically. Manual APIs remain useful for targeted performance or identity control.

## References

- https://react.dev/reference/react/memo
- https://react.dev/reference/react/useMemo
- https://react.dev/reference/react/useCallback
- https://react.dev/learn/react-compiler/introduction
