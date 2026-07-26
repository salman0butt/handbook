---
title: Automatic Memoization and Manual Memoization
description: Understand how React Compiler changes the role of React.memo, useMemo, and useCallback without making them obsolete.
sidebar_position: 2
---

# Automatic memoization and manual memoization

React Compiler changes the default optimization strategy for modern React code.

Before the compiler, developers often asked:

> Where should I add `React.memo`, `useMemo`, and `useCallback`?

With the compiler, the better default question is:

> Is my component written according to the Rules of React so the compiler can optimize it safely?

## Automatic memoization mental model

React Compiler analyzes dependencies in components and Hooks at build time.

Conceptually:

```jsx
function SearchResults({ query, items }) {
  const visibleItems = filterItems(items, query);

  return <Results items={visibleItems} />;
}
```

The compiler can preserve `visibleItems` when the relevant inputs have not changed.

This reduces the need to write:

```jsx
const visibleItems = useMemo(
  () => filterItems(items, query),
  [items, query]
);
```

manually in many cases.

## `React.memo` before and after Compiler

Without Compiler:

```jsx
const ProductCard = memo(function ProductCard({ product }) {
  return <article>{product.name}</article>;
});
```

`memo` asks React to reuse the previous render result when props are equal according to its comparison rules.

With Compiler, component-level memoization can often be generated automatically.

This means new compiler-enabled code usually does not need to wrap every leaf component in `memo` preemptively.

## `useMemo` before and after Compiler

`useMemo` remains useful when you need deliberate semantic control over identity.

Examples include:

- a value used as an Effect dependency;
- a stable object passed to an imperative third-party API;
- a value whose identity is itself meaningful to your architecture;
- migration scenarios where existing behavior must stay stable.

Compiler optimization and manual memoization are not identical contracts.

## `useCallback` before and after Compiler

A common pre-Compiler pattern:

```jsx
const handleSelect = useCallback((id) => {
  setSelectedId(id);
}, []);
```

The compiler can often preserve function identity automatically when that improves rendering behavior.

However, manual `useCallback` still makes sense when a stable callback identity is part of an external contract rather than just a performance hint.

For example:

```jsx
useEffect(() => {
  externalWidget.subscribe(handleChange);
  return () => externalWidget.unsubscribe(handleChange);
}, [handleChange]);
```

Identity matters here because an external system stores the callback.

## Do not delete manual memoization blindly

The React Compiler documentation recommends preserving existing manual memoization during adoption unless you have tested the change carefully.

Why can deletion matter?

Because manual memoization may:

- stabilize Effect dependencies;
- control third-party subscription identity;
- preserve intentionally shared object/function references;
- affect child memoization;
- change compiler output.

Treat removal as a refactor that needs tests and profiling.

## Compiler optimization is dependency-aware

The compiler is not simply wrapping every component in `memo`.

It can memoize values and expressions within a component based on its analysis.

Think in terms of:

```text
reactive inputs
    ↓
derived values / JSX / functions
    ↓
reuse when inputs have not meaningfully changed
```

rather than:

```text
wrap everything in React.memo
```

## Referential equality still matters

JavaScript identity has not disappeared.

```js
{} === {} // false
```

The compiler can preserve identities where it determines that doing so is useful, but APIs outside React still observe normal JavaScript references.

This matters for:

- Maps/Sets;
- WeakMaps;
- event subscriptions;
- memoized libraries;
- dependency arrays;
- imperative SDKs.

## Memoization does not mean “never re-render”

A compiled component can still render when:

- its state changes;
- consumed Context changes;
- relevant inputs change;
- parent/child coordination requires new work;
- React retries interrupted rendering.

The optimization goal is to avoid unnecessary repeated work, not to freeze components.

## Memoization and purity

Automatic memoization is possible because a pure calculation can be safely reused for the same inputs.

If rendering performs hidden side effects:

```jsx
let totalRenders = 0;

function Counter() {
  totalRenders += 1; // ❌ render side effect
  return <div>{totalRenders}</div>;
}
```

memoizing or retrying the component changes observable behavior.

That is why purity is not a style preference—it is part of React's correctness model.

## Expensive calculations

Suppose this is genuinely expensive:

```jsx
function Analytics({ events }) {
  const summary = calculateLargeReport(events);
  return <Report summary={summary} />;
}
```

Compiler can help avoid recomputing it when `events` are unchanged.

But if `events` changes frequently and `calculateLargeReport` remains too expensive, you may still need:

- a better algorithm;
- normalization/indexing;
- server-side aggregation;
- a Web Worker;
- virtualization;
- caching at another architectural layer.

## Profiling still matters

Compiler makes optimization easier, not profiling obsolete.

Use React DevTools Profiler and browser performance tools to answer:

- Which interaction is slow?
- Is CPU time actually in React rendering?
- Which component or calculation dominates the trace?
- Are we blocked by network, layout, parsing, or third-party code instead?

## Preserve manual memoization lints

Compiler-aware linting includes rules that help prevent transformations from accidentally invalidating existing manual memoization contracts.

This is especially valuable during migration, where old and new optimization strategies may coexist.

## When manual memoization is appropriate

Use it deliberately when you can explain the contract.

Good explanation:

> This options object must remain stable because the SDK treats a new object identity as a configuration reset.

Weak explanation:

> I added `useMemo` because the component renders a lot.

Rendering often is not automatically a problem.

## Production decision framework

Ask these questions in order:

1. Is the code correct and pure?
2. Is there a measured performance problem?
3. Is the work repeated with unchanged inputs?
4. Can Compiler already avoid it?
5. Is manual identity control required?
6. Would a larger architectural optimization help more?

## Common mistakes

### Wrapping everything in `memo`

This adds complexity without proving value.

### Using `useMemo` for correctness

Your code should normally be correct even if React recomputes a memoized value.

If correctness depends on `useMemo` never recomputing, the design is likely wrong.

### Assuming stable identity outside React

Compiler optimizations are not a universal global memoization guarantee for arbitrary external code.

### Measuring render counts only

Fewer renders do not necessarily mean faster UX. A single expensive render can be worse than several cheap renders.

## Exercise

Given a dashboard with 30 `useMemo`/`useCallback` calls:

1. categorize each as performance-only or identity-contract;
2. profile the page;
3. enable Compiler;
4. remove only performance-only memoization candidates one by one;
5. verify tests, Effect behavior, and performance after each change.

## Interview questions

**Does React Compiler make `useMemo` obsolete?**  
No. It reduces the need for manual memoization, but `useMemo` remains useful when deliberate identity control is required.

**Should existing `React.memo` wrappers be deleted immediately after enabling Compiler?**  
No. Existing memoization should be removed only after testing and profiling because it may influence semantics and compiler output.

**What is the most important prerequisite for automatic memoization?**  
Code that follows the Rules of React, especially purity and immutability.

## References

- https://react.dev/learn/react-compiler/introduction
- https://react.dev/reference/react/memo
- https://react.dev/reference/react/useMemo
- https://react.dev/reference/react/useCallback
- https://react.dev/reference/eslint-plugin-react-hooks/lints/preserve-manual-memoization
