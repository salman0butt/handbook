---
title: memo, useMemo, and useCallback
description: Manual memoization in modern React, when it helps, when it hurts, and how React Compiler changes the default strategy.
sidebar_position: 2
---

# `memo`, `useMemo`, and `useCallback`

Manual memoization is useful when it solves a measured problem.

It is not a default requirement for every component.

React Compiler now automatically handles many memoization opportunities, so modern React performance guidance is increasingly:

```text
write correct code
   ↓
measure
   ↓
let Compiler optimize ordinary cases
   ↓
use manual memoization when you need precise identity/performance control
```

## The three tools

### `memo`

Caches the result of rendering a component when its props are unchanged.

```js
import { memo } from 'react';

const Row = memo(function Row({ item }) {
  return <div>{item.name}</div>;
});
```

### `useMemo`

Caches a calculated value.

```js
const visibleItems = useMemo(
  () => filterItems(items, query),
  [items, query]
);
```

### `useCallback`

Caches a function identity.

```js
const handleSelect = useCallback((id) => {
  setSelectedId(id);
}, []);
```

All three are about **reusing previous work or identity**.

## `memo` mental model

Without `memo`, a child normally renders when its parent renders.

```text
Parent renders
   ↓
Child renders
```

With `memo`, React can skip the child when its props are equal.

```text
Parent renders
   ↓
compare Child props
   ↓
unchanged → skip Child render
```

But `memo` does not make the component frozen.

A memoized component still renders when:

- its own state changes;
- Context it reads changes;
- an external store subscription changes;
- React otherwise needs to retry work.

## Prop equality

By default, `memo` compares each prop with its previous value using `Object.is` semantics.

Primitive props often remain stable naturally.

```jsx
<Row id={42} selected={false} />
```

Object/function props are more likely to receive new identities.

```jsx
<Row options={{ compact: true }} onSelect={() => select(id)} />
```

Those values are recreated during every parent render.

That can defeat manual `memo`.

## Minimize prop churn before adding complexity

Instead of:

```jsx
<UserCard user={{ name, avatar, role }} />
```

prefer a stable existing object when one already represents the concept:

```jsx
<UserCard user={user} />
```

Or pass only what the child needs:

```jsx
<UserCard name={name} avatar={avatar} />
```

Do not create elaborate memoization chains to compensate for an unnecessarily unstable API.

## `useMemo` is a performance optimization

This is a bad reason:

```js
const total = useMemo(() => price * quantity, [price, quantity]);
```

The calculation is trivial.

This may be a good reason:

```js
const searchIndex = useMemo(() => {
  return buildSearchIndex(largeDataset);
}, [largeDataset]);
```

The benefit depends on whether:

- the calculation is actually expensive;
- the component re-renders without the inputs changing;
- the cached value survives long enough to be reused.

## Correctness must not depend on `useMemo`

Bad design:

```js
const connection = useMemo(() => createConnection(url), [url]);
```

If `connection` represents persistent mutable state whose lifetime must be guaranteed, a ref/state/external resource model is usually more appropriate.

React may discard memoized caches for implementation reasons.

Treat `useMemo` as optimization, not durable storage.

## `useCallback` caches identity, not execution

This:

```js
const handleSave = useCallback(() => {
  save(record);
}, [record]);
```

does **not** mean `save` runs once.

It means React can return the same function object between renders while `record` stays equal.

The function executes whenever you call it.

## When function identity matters

Useful cases include:

- passing a callback to a manually memoized child;
- a custom Hook intentionally exposing stable callbacks;
- a function being a dependency of another Hook;
- integrating with APIs that subscribe/unsubscribe based on identity.

Example:

```js
const handleSubmit = useCallback((data) => {
  post('/orders', data);
}, []);

return <SlowForm onSubmit={handleSubmit} />;
```

If `SlowForm` is memoized and genuinely expensive, stable callback identity can help preserve the skip.

## Functional updates can reduce dependencies

Instead of:

```js
const addTodo = useCallback((text) => {
  setTodos([...todos, { id: crypto.randomUUID(), text }]);
}, [todos]);
```

use a functional state update:

```js
const addTodo = useCallback((text) => {
  setTodos(current => [
    ...current,
    { id: crypto.randomUUID(), text },
  ]);
}, []);
```

Now the callback does not need the current `todos` snapshot as a dependency.

## Do not remove dependencies to force stability

Bad:

```js
const submit = useCallback(() => {
  send(userId, token);
}, []); // incorrect
```

This captures stale values.

Optimization never justifies lying to the dependency model.

Correctness first.

## Object identity and Effects

Suppose:

```js
const options = {
  roomId,
  serverUrl,
};

useEffect(() => {
  connect(options);
}, [options]);
```

`options` changes identity every render.

One possible solution is `useMemo`:

```js
const options = useMemo(() => ({
  roomId,
  serverUrl,
}), [roomId, serverUrl]);
```

But often the better fix is to create the object inside the Effect:

```js
useEffect(() => {
  const options = { roomId, serverUrl };
  connect(options);
}, [roomId, serverUrl]);
```

This removes the identity problem entirely.

## React Compiler changes the default strategy

React Compiler automatically memoizes many values, functions, and component renders.

Therefore new code generally should not mechanically add:

```js
memo(...)
useMemo(...)
useCallback(...)
```

everywhere.

Write clear code and let the compiler optimize ordinary cases.

Manual memoization still has legitimate uses when you need precise control.

## Existing manual memoization

Do not mass-delete existing memoization after enabling Compiler.

Existing memoization can influence compilation output and behavior.

Migration strategy:

```text
1. enable Compiler safely
2. verify behavior
3. profile
4. remove manual memoization only where tested
5. compare again
```

## Custom comparison functions

`memo` accepts a custom comparator:

```js
const Chart = memo(ChartImpl, (prev, next) => {
  return prev.points === next.points && prev.scale === next.scale;
});
```

Be careful.

The comparison itself costs time.

A deep equality check over a large object may cost more than rendering the component.

### Dangerous callback comparisons

If a custom comparator ignores a function prop whose closure captured changed state, the child can keep stale behavior.

This is a correctness bug disguised as an optimization.

## Memoization chains

Manual optimization often creates chains:

```text
Child is memoized
   ↓
Parent must stabilize callback
   ↓
callback uses object
   ↓
object must be memoized
   ↓
dependencies become complex
```

That complexity is one reason React Compiler is valuable.

If a manual chain becomes hard to reason about, reconsider the architecture.

## State placement often beats memoization

Suppose a large page owns hover state:

```text
Page state changes
   ↓
whole page renders
```

Instead, put hover state in the smallest component that owns it:

```text
Page
 └── ProductCard
      └── local hover state
```

Now the update is naturally scoped.

No `memo` required.

## Context can bypass `memo`

```js
const Toolbar = memo(function Toolbar() {
  const theme = useContext(ThemeContext);
  return <div className={theme}>...</div>;
});
```

If `ThemeContext` changes, `Toolbar` renders even if its props did not.

`memo` only compares props.

## `useMemo` and large lists

Do not call Hooks inside a loop:

```js
items.map(item => {
  const value = useMemo(() => compute(item), [item]); // invalid
});
```

Extract an item component:

```jsx
function Row({ item }) {
  const value = useMemo(() => compute(item), [item]);
  return <div>{value}</div>;
}
```

Then decide whether memoization is actually needed.

For truly huge lists, virtualization may provide much bigger gains than per-row memoization.

## Common mistakes

### Memoizing trivial calculations

Creates complexity without measurable benefit.

### Memoizing unstable inputs

```js
const result = useMemo(() => calculate(options), [options]);
```

when `options` is recreated every render still recalculates every render.

### Using `useCallback` for every handler

Most local event handlers do not need stable identity.

### Deep custom comparators

Can become slower than the render they are trying to avoid.

### Treating memoization as correctness

Caches may be discarded. Store durable state somewhere designed for durability.

### Optimizing before measuring

The component may not be the bottleneck at all.

## Decision table

| Situation | Typical direction |
| --- | --- |
| expensive pure calculation repeated with same inputs | consider `useMemo` or Compiler |
| expensive child gets identical props repeatedly | Compiler or targeted `memo` |
| memoized child receives callback prop | targeted `useCallback` if needed |
| tiny component renders often | usually leave it alone |
| huge list | consider virtualization/data architecture first |
| Effect reruns because object dependency is recreated | restructure dependency before memoizing |
| local state causes huge ancestor updates | move state closer to owner |
| callback must remain stable for API contract | `useCallback` may be appropriate |

## Exercise

Review this component:

```jsx
function SearchPage({ products }) {
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState('light');

  const results = products.filter(product =>
    product.name.includes(query)
  );

  const handleSelect = product => {
    console.log(product.id);
  };

  return (
    <div className={theme}>
      <SearchInput value={query} onChange={setQuery} />
      <ProductList results={results} onSelect={handleSelect} />
    </div>
  );
}
```

Before adding memoization, determine:

1. whether filtering is expensive;
2. whether `ProductList` is expensive;
3. whether theme updates cause meaningful wasted work;
4. whether Compiler is enabled;
5. whether list virtualization would provide a larger gain.

Only then decide if `useMemo`, `useCallback`, or `memo` is justified.

## Interview questions

### What does `useCallback` cache?

The function identity, not the result of calling the function.

### Can a `memo` component still re-render?

Yes. Its own state, Context, external stores, retries, and other React work can cause rendering. `memo` primarily skips renders based on unchanged props.

### Should every expensive calculation use `useMemo`?

Not automatically. Measure whether it is expensive in the real scenario and whether the cache is likely to be reused.

### How does React Compiler change manual memoization?

Compiler handles many ordinary memoization opportunities automatically. New code can usually rely on it, while manual memoization remains useful for explicit identity/performance control.

## References

- https://react.dev/reference/react/memo
- https://react.dev/reference/react/useMemo
- https://react.dev/reference/react/useCallback
- https://react.dev/learn/react-compiler/introduction
