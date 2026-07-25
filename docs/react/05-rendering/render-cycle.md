---
title: Rendering: Trigger, Render, Commit, Paint
description: Understand what a React render actually is, what triggers it, and how render, reconciliation, commit, and browser paint differ.
sidebar_position: 1
---

# Rendering: trigger, render, commit, paint

React becomes much easier once **rendering** stops meaning “the browser changed the screen.” Rendering is only one part of the update process.

```text
Something changes
      ↓
React schedules work
      ↓
Render phase
calculate the next UI
      ↓
Reconciliation
compare identity and structure
      ↓
Commit phase
apply required DOM changes
      ↓
Browser layout / paint
pixels become visible
```

## What is a render?

A render is React calling your component so it can calculate what UI should exist for the current props, state, and context.

```jsx
function CartSummary({items}) {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return <p>Total: £{total}</p>;
}
```

Calling `CartSummary` during rendering does **not** itself mean React has changed the DOM. The component returns a description of UI. React then decides what needs to be committed.

## What triggers rendering?

Typical triggers include:

- the initial root render;
- a component state update;
- a parent rendering again;
- a context value used by the component changing;
- an external store subscription notifying React.

A useful beginner model is:

```text
render is requested
      ↓
component function executes
      ↓
new element tree is produced
```

Do not think of React as continuously watching JavaScript variables. React renders when its update system tells it to render.

## Render phase

During the render phase React calculates the next UI tree.

Render code should be **pure**:

```text
same inputs
   ↓
same output description
```

Good render logic:

```jsx
function ProductPrice({price, discount}) {
  const finalPrice = price * (1 - discount);
  return <strong>£{finalPrice.toFixed(2)}</strong>;
}
```

Bad render logic:

```jsx
function ProductPrice({price}) {
  analytics.track('product rendered'); // ❌ side effect during render
  return <strong>£{price}</strong>;
}
```

Rendering may happen more than once. React must be free to call components without causing duplicated external work.

## Reconciliation

After React has a new UI description, it must relate that description to the previous tree.

Conceptually:

```text
previous tree
      +
next tree
      ↓
compare type + position + key
      ↓
work out what can be preserved
and what must change
```

This comparison process is commonly called **reconciliation**.

The most important identity signals are:

1. component/element type;
2. position in the render tree;
3. `key` for siblings in a collection or intentionally keyed position.

You do not need Fiber internals yet to reason correctly about these rules.

## Commit phase

The commit phase is where React applies the necessary effects of the render to the host environment, such as the browser DOM.

Example:

```text
previous UI: <button>Save</button>
next UI:     <button disabled>Saving…</button>

React does not rebuild the whole page.
It commits the required changes to that button.
```

The render phase calculates. The commit phase applies.

## Browser layout and paint

After DOM changes, the browser may need to recalculate layout and paint pixels.

```text
React render
  ≠ DOM mutation
  ≠ browser paint
```

Those are related stages, not synonyms.

This distinction matters later for:

- `useLayoutEffect`;
- measuring DOM nodes;
- visual flicker;
- performance profiling;
- hydration;
- transitions and concurrent rendering.

## Parent and child rendering

If a parent renders, React normally evaluates its child elements again.

```jsx
function Dashboard({user}) {
  return (
    <main>
      <Header user={user} />
      <ActivityFeed />
    </main>
  );
}
```

A parent render can cause `Header` and `ActivityFeed` to render even if their final DOM output does not change.

This is why **render count** and **DOM mutation count** are not the same thing.

## A render can produce no DOM change

```jsx
function Status({online}) {
  return <span>{online ? 'Online' : 'Offline'}</span>;
}
```

If the component renders twice with `online === true`, React may call the function twice while the DOM remains unchanged because the committed result is equivalent.

## State is tied to tree position

React associates state with a component's position and identity in the rendered tree.

```text
App
└── Counter   ← position + type identify this state
```

If React sees the same component type in the same conceptual position, it can preserve the state. If identity changes, React can reset it.

We will study this deeply in **Preserving and Resetting State**.

## Render is not a lifecycle event to exploit

Avoid reasoning like:

> “Every time the component renders, I should run this external action.”

Instead ask:

- Is this calculation part of deriving UI? Put it in render.
- Is this caused by a user action? Put it in the event handler.
- Is this synchronization with an external system? It may belong in an Effect.

That distinction prevents many unnecessary Effects.

## Common mistakes

### Mistake: mutating something during render

```jsx
function Cart({items}) {
  items.sort((a, b) => a.price - b.price); // ❌ mutates a prop
  return items.map(item => <div key={item.id}>{item.name}</div>);
}
```

Better:

```jsx
const sortedItems = [...items].sort((a, b) => a.price - b.price);
```

### Mistake: assuming every render updates the DOM

A render can calculate the same output and produce no visible DOM mutation.

### Mistake: optimizing before measuring

A component rendering is not automatically a performance problem. First measure real user-visible cost with the React DevTools Profiler and browser tools.

### Mistake: calling components directly

```jsx
{Profile()} // ❌
```

Use components through JSX so React controls their rendering identity:

```jsx
<Profile /> // ✅
```

## Debugging unexpected renders

Ask in this order:

```text
What triggered the update?
      ↓
Which parent rendered?
      ↓
Which props/context/state changed?
      ↓
Did the output actually change?
      ↓
Was DOM work expensive?
```

Do not jump immediately to `memo`, `useMemo`, or `useCallback`.

## Production pattern

For a data-heavy dashboard, keep frequently changing state close to the smallest subtree that needs it.

```text
Dashboard
├── Header
├── Filters        ← filter state can live here/near here
└── Results
    ├── Chart
    └── Table
```

State locality can reduce unrelated rendering without adding memoization complexity.

## Exercise

Build a small product quantity component and log:

1. when the component function executes;
2. when the click handler executes;
3. the current state inside each render.

Then click several times and explain the order without saying “React changes the variable immediately.”

## Interview questions

**Junior:** What is the difference between rendering and updating the DOM?

**Mid-level:** Why can a child component render when its props appear unchanged?

**Senior:** When would reducing renders matter, and why is render count alone an incomplete performance metric?

## Summary

Remember:

```text
Trigger
  ↓
Render: calculate
  ↓
Reconcile: compare identity
  ↓
Commit: apply host changes
  ↓
Browser: layout / paint
```

React rendering is computation. DOM mutation and browser paint are later stages.

## References

- https://react.dev/learn/render-and-commit
- https://react.dev/learn/keeping-components-pure
- https://react.dev/reference/rules/components-and-hooks-must-be-pure
- https://react.dev/reference/rules/react-calls-components-and-hooks

## Next

Continue with **[Responding to Events](../06-events/responding-to-events.md)**.