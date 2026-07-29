---
title: Automatic Memoization and Manual Memoization
description: Understand how React Compiler changes the role of React.memo, useMemo, and useCallback without making them obsolete.
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

# Automatic memoization and manual memoization

React Compiler changes the default optimization strategy for modern React code.

Before Compiler, teams often asked: **Where should I add `memo`, `useMemo`, or `useCallback`?**

With Compiler, the better first question is: **Is this component written according to the Rules of React so the compiler can optimize it safely?**

## Automatic memoization mental model

```jsx
function SearchResults({ query, items }) {
  const visibleItems = filterItems(items, query);
  return <Results items={visibleItems} />;
}
```

Compiler can analyze which reactive inputs affect derived work and preserve safe results across renders.

<VisualDiagram title="Automatic memoization follows reactive dependencies">
  <DiagramStack align="center">
    <DiagramNode title="Reactive inputs" tone="blue">query · items · state · context</DiagramNode>
    <DiagramArrow label="data-flow analysis" />
    <DiagramNode title="Derived work" tone="purple">visibleItems · callbacks · JSX</DiagramNode>
    <DiagramArrow label="dependencies unchanged" />
    <DiagramNode title="Reuse previous work" tone="green" />
  </DiagramStack>
</VisualDiagram>

This reduces the need to write manual `useMemo` for many purely performance-driven cases.

## `React.memo` before and after Compiler

Without Compiler:

```jsx
const ProductCard = memo(function ProductCard({ product }) {
  return <article>{product.name}</article>;
});
```

With Compiler, component-level reuse can often be generated automatically.

<DiagramGrid columns={2}>
  <DiagramNode title="Manual memo" tone="orange" eyebrow="EXPLICIT">Developer identifies a boundary and declares a reuse contract.</DiagramNode>
  <DiagramNode title="Compiler memoization" tone="purple" eyebrow="ANALYZED">Build-time analysis can preserve components, expressions, JSX, or functions where safe.</DiagramNode>
</DiagramGrid>

Compiler is not simply wrapping every component in `memo`.

## `useMemo` still has semantic uses

Manual memoization remains useful when identity itself is part of an external or architectural contract.

```jsx
const options = useMemo(
  () => ({ locale, currency }),
  [locale, currency]
);
```

Examples:

- an Effect depends on a deliberately stable object;
- an imperative third-party API stores an object identity;
- a migration relies on an existing identity contract;
- code must preserve behaviour across compiler-disabled and compiler-enabled paths.

## `useCallback` can still express external identity

```jsx
const handleChange = useCallback((value) => {
  setValue(value);
}, []);

useEffect(() => {
  externalWidget.subscribe(handleChange);
  return () => externalWidget.unsubscribe(handleChange);
}, [handleChange]);
```

Here callback identity is not just a render-performance hint; an external system stores it.

## Performance identity vs semantic identity

<VisualDiagram title="Ask why the identity must be stable">
  <DiagramGrid columns={2}>
    <DiagramNode title="Performance-only identity" tone="teal">Stable only to avoid repeated React rendering work. Compiler can often own this.</DiagramNode>
    <DiagramNode title="Semantic / external identity" tone="orange">Subscriptions, imperative APIs, cache keys, or contracts depend on reference identity. Manual control may remain appropriate.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Do not delete existing memoization blindly

Existing `memo`, `useMemo`, and `useCallback` may influence behavior, not just speed.

<LifecycleBar items={[
  { label: 'Existing manual memoization', tone: 'orange' },
  { label: 'Enable Compiler', tone: 'purple' },
  { label: 'Preserve behavior first', tone: 'blue' },
  { label: 'Test + profile', tone: 'teal' },
  { label: 'Remove only with evidence', tone: 'green' },
]} />

Removal can affect:

- Effect dependencies;
- third-party subscription identity;
- memoized children;
- intentional shared references;
- compiler output and optimisation coverage.

Treat deletion as a refactor, not cleanup by default.

## Memoization does not fix architecture

<VisualDiagram title="Priority of performance fixes">
  <DiagramStack align="center">
    <DiagramNode title="Architecture" tone="blue">State scope · component boundaries · data ownership</DiagramNode>
    <DiagramArrow label="then reduce unavoidable render cost" />
    <DiagramNode title="Algorithms / DOM volume / virtualization" tone="orange" />
    <DiagramArrow label="then reuse safe repeated work" />
    <DiagramNode title="Compiler / manual memoization" tone="purple" />
  </DiagramStack>
</VisualDiagram>

A giant component with poor ownership does not become good architecture because its calculations are memoized.

## Manual memoization can be harmful

Overusing manual memoization adds:

- dependency arrays to maintain;
- stale-closure risk when dependencies are wrong;
- custom comparison bugs;
- extra complexity in reviews;
- memo bookkeeping that may cost more than the avoided work.

Use it for a reason you can explain.

## `memo` custom comparisons require care

```jsx
const Row = memo(RowImpl, arePropsEqual);
```

A custom comparison must account for all props that affect rendering and behavior. An incorrect comparator can preserve stale values or callbacks.

Do not write expensive deep comparisons to avoid a cheap render.

## Compiler and derived objects/functions

Inline objects and callbacks are not automatically performance bugs in a compiler-enabled codebase.

```jsx
function Toolbar({ itemId }) {
  const actions = {
    onOpen() {
      openItem(itemId);
    },
  };

  return <ActionBar actions={actions} />;
}
```

Focus on correctness first. Measure before adding identity scaffolding manually.

## Decision guide

<DecisionTree
  question="Should I add manual memoization?"
  items={[
    { label: 'Only trying to pre-empt hypothetical rerenders', value: 'Prefer Compiler + measurement' },
    { label: 'Profiler shows repeated expensive work', value: 'Check architecture, then memoization' },
    { label: 'External API requires stable reference identity', value: 'Manual memoization may be semantic' },
    { label: 'Existing manual memo in Compiler migration', value: 'Preserve until tests/profile justify removal' },
    { label: 'Huge list/DOM or slow algorithm', value: 'Fix underlying cost first' },
  ]}
/>

## Common mistakes

- wrapping every component in `memo` even with Compiler enabled;
- replacing architecture work with memoization;
- deleting all `useMemo`/`useCallback` during migration;
- using deep custom comparators for cheap children;
- ignoring semantic identity required by external systems;
- treating a new object/function on every render as automatically wrong.

## Production review checklist

1. Is the performance problem measured?
2. Is state located near the UI that owns it?
3. Is DOM/list volume bounded?
4. Is the compiler active for this code path?
5. Is manual identity needed for an external/semantic contract?
6. Does existing memoization have behavior implications?
7. Do profiling results improve after the change?

## Interview questions

**Junior:** Does React Compiler make `useMemo` invalid?

**Mid-level:** When can manual `useCallback` still be appropriate in a Compiler-enabled application?

**Senior:** Explain the difference between performance identity and semantic identity, and how that distinction changes a Compiler migration plan.

## Summary

<VisualDiagram title="Compiler changes the default, not every possible contract">
  <DiagramRow>
    <DiagramNode title="Correct React code" tone="blue" />
    <DiagramArrow direction="right" label="Compiler handles most reuse" />
    <DiagramNode title="Automatic memoization" tone="purple" />
    <DiagramArrow direction="right" label="manual only when justified" />
    <DiagramNode title="Semantic identity / measured hotspot" tone="green" />
  </DiagramRow>
</VisualDiagram>

## References

- https://react.dev/learn/react-compiler
- https://react.dev/reference/react/memo
- https://react.dev/reference/react/useMemo
- https://react.dev/reference/react/useCallback
