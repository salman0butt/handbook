---
title: Purity, Immutability, and Render Safety
description: The Rules of React for pure rendering, immutable snapshots, stable component identity, refs, and side effects.
sidebar_position: 1
---

# Purity, immutability, and render safety

The Rules of React are correctness constraints, not optional style advice.

They matter because React may:

- render more than once;
- interrupt and restart work;
- abandon an in-progress render;
- render on the server and hydrate on the client;
- automatically memoize code with React Compiler.

Code that assumes render runs exactly once is fragile.

## Rule 1: Components and Hooks must be pure

A component should calculate UI from its inputs:

```text
props + state + context
        ↓
       JSX
```

For the same inputs, rendering should produce the same result.

This property is often called **idempotence** in React's docs.

## Impure render example

```jsx
function ClockLabel() {
  const now = Date.now(); // ❌ changes during render
  return <span>{now}</span>;
}
```

Calling `Date.now()` during render can cause:

- different results across retries;
- hydration mismatches;
- incorrect memoization;
- unpredictable tests.

Better: obtain changing time through state, an external store, a server snapshot, or another appropriate synchronization mechanism.

## Side effects must not run during render

Bad:

```jsx
function AnalyticsCard({ event }) {
  analytics.track(event); // ❌ side effect during render
  return <Card />;
}
```

If React retries rendering, the analytics call may happen more than once even though no new UI committed.

Event-caused side effects belong in event handlers:

```jsx
function BuyButton() {
  function handleClick() {
    analytics.track('buy-clicked');
  }

  return <button onClick={handleClick}>Buy</button>;
}
```

Synchronization caused by rendering belongs in Effects when an Effect is actually needed.

## Render is calculation, commit is mutation

A useful model:

```text
render phase
→ calculate next UI
→ must be restartable / discardable

commit phase
→ React mutates DOM/native host
→ refs attach
→ Effects can later run
```

Your component function participates in render, not commit.

## Props are immutable snapshots

Never mutate a prop:

```jsx
function UserCard({ user }) {
  user.name = 'Changed'; // ❌
  return <p>{user.name}</p>;
}
```

Instead derive a new value:

```jsx
function UserCard({ user }) {
  const displayUser = {
    ...user,
    name: user.name.toUpperCase(),
  };

  return <p>{displayUser.name}</p>;
}
```

## State is also an immutable snapshot

Bad:

```jsx
items.push(newItem);
setItems(items);
```

Good:

```jsx
setItems((items) => [...items, newItem]);
```

Why does this matter?

Because a render holds a snapshot of state. Mutating that snapshot behind React's back breaks identity-based change detection and makes old renders observe unexpected data.

## Hook arguments and return values

Once a value has been passed into a Hook, treat that input as immutable for the duration of the interaction.

A custom Hook should not secretly mutate caller-owned objects.

Bad:

```jsx
function useSorted(items) {
  items.sort(); // ❌ mutates caller value
  return items;
}
```

Better:

```jsx
function useSorted(items) {
  return items.toSorted();
}
```

or:

```jsx
return [...items].sort(compareFn);
```

## Values passed to JSX should remain stable

Avoid mutating objects after using them to create JSX.

Bad conceptual flow:

```text
create JSX using object
→ mutate object
→ expect already-created JSX to reinterpret it
```

JSX is a description based on the values used when it was created.

## Local mutation can be okay

Mutation itself is not globally forbidden.

This is fine:

```jsx
function List({ items }) {
  const rows = [];

  for (const item of items) {
    rows.push(<li key={item.id}>{item.name}</li>);
  }

  return <ul>{rows}</ul>;
}
```

`rows` was created during this render and is not shared with previous renders.

The danger is mutating values that existed before render or are shared outside the current calculation.

## Globals must not be mutated during render

Bad:

```js
const registry = [];

function Row({ id }) {
  registry.push(id); // ❌ global mutation in render
  return <div>{id}</div>;
}
```

Concurrent rendering or Strict Mode can expose this bug quickly.

## Ref safety

Refs are escape hatches for mutable values that do not participate in rendering.

Normally do not read or write `ref.current` during render:

```jsx
function Component() {
  ref.current += 1; // ❌ render-time mutation
  return <div />;
}
```

Exceptions should be narrow, predictable initialization patterns documented by the ref APIs.

## Static component identity

Do not define component types inside render:

```jsx
function Parent() {
  function Child() {
    return <p>Child</p>;
  }

  return <Child />;
}
```

Each render creates a new `Child` function identity.

React can treat it as a new component type, causing state and DOM to reset.

Define the component at module scope:

```jsx
function Child() {
  return <p>Child</p>;
}

function Parent() {
  return <Child />;
}
```

Pass changing data through props instead of recreating a component definition.

## Known impure functions

Functions such as these are suspicious during render because they can return different values for identical React inputs:

- `Math.random()`
- `Date.now()`
- `new Date()`
- `crypto.randomUUID()`
- `performance.now()`

That does not mean those APIs are forbidden everywhere. Use them at an appropriate lifecycle boundary.

## Why Strict Mode helps

Strict Mode intentionally stresses render and Effect assumptions in development.

It can reveal:

- render side effects;
- missing cleanup;
- mutation bugs;
- ref callback mistakes.

Do not "fix" Strict Mode by disabling it before understanding the bug it exposed.

## Why Compiler makes these rules visible

A compiler can only safely reuse calculations when those calculations are predictable.

If a component performs side effects or mutates hidden values, optimization changes its observable behavior.

So React Compiler is not introducing a new programming model. It makes existing React rules more mechanically enforceable.

## Production debugging

If behavior differs under Compiler or Strict Mode, inspect:

1. render-time mutation;
2. nondeterministic APIs in render;
3. component definitions inside components;
4. ref reads/writes during render;
5. mutation of props/state/Hook inputs;
6. hidden singleton/global state;
7. third-party libraries with render-time side effects.

## Exercise

Find and fix every Rule-of-React problem in this component:

```jsx
let renders = 0;

function Profile({ user }) {
  renders++;
  user.lastSeen = Date.now();

  function Badge() {
    return <span>{Math.random()}</span>;
  }

  return <Badge />;
}
```

Explain separately why each line is unsafe.

## Interview questions

**Why must React components be pure?**  
Because React may retry, interrupt, abandon, server-render, or memoize rendering. Pure calculation makes those behaviors safe.

**Is all mutation forbidden in React?**  
No. Local mutation of newly created values can be fine; mutating shared values, props, state, globals, or Hook inputs is the problem.

**Why are components defined inside components dangerous?**  
They create a new component type identity on each render and can reset state and DOM.

## References

- https://react.dev/reference/rules
- https://react.dev/reference/rules/components-and-hooks-must-be-pure
- https://react.dev/reference/eslint-plugin-react-hooks/lints/purity
- https://react.dev/reference/eslint-plugin-react-hooks/lints/immutability
- https://react.dev/reference/eslint-plugin-react-hooks/lints/globals
- https://react.dev/reference/eslint-plugin-react-hooks/lints/static-components
