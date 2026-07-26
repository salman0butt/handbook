---
title: "Rendering: Trigger, Render, Commit, Paint"
description: Understand what a React render actually is, what triggers it, and how render, reconciliation, commit, and browser paint differ.
sidebar_position: 1
---

import {
  VisualDiagram,
  DiagramStack,
  DiagramGrid,
  DiagramNode,
  DiagramArrow,
  LifecycleBar,
} from '@site/src/components/handbook/VisualDiagram'

# Rendering: trigger, render, commit, paint

React becomes much easier once **rendering** stops meaning “the browser changed the screen.” Rendering is only one part of the update process.

<VisualDiagram title="React update pipeline" subtitle="Rendering is computation; DOM mutation and browser paint happen later.">
  <LifecycleBar
    items={[
      { label: 'Something changes', tone: 'orange' },
      { label: 'React schedules work', tone: 'blue' },
      { label: 'Render: calculate next UI', tone: 'purple' },
      { label: 'Reconcile identity + structure', tone: 'cyan' },
      { label: 'Commit required DOM changes', tone: 'green' },
      { label: 'Browser layout + paint', tone: 'slate' },
    ]}
  />
</VisualDiagram>

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

<VisualDiagram title="What happens when render is requested?" compact>
  <DiagramStack align="center">
    <DiagramNode title="Render requested" tone="orange" wide />
    <DiagramArrow />
    <DiagramNode title="Component function executes" tone="purple" wide />
    <DiagramArrow />
    <DiagramNode title="New element tree is produced" tone="green" wide />
  </DiagramStack>
</VisualDiagram>

Do not think of React as continuously watching JavaScript variables. React renders when its update system tells it to render.

## Render phase

During the render phase React calculates the next UI tree.

Render code should be **pure**:

<VisualDiagram title="Pure render model" compact>
  <DiagramStack align="center">
    <DiagramNode title="Same relevant inputs" tone="blue" wide />
    <DiagramArrow label="pure calculation" />
    <DiagramNode title="Same output description" tone="green" wide />
  </DiagramStack>
</VisualDiagram>

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

<VisualDiagram title="Reconciliation" subtitle="React compares identity signals to decide what can be preserved and what must change.">
  <DiagramGrid columns={2}>
    <DiagramNode title="Previous tree" tone="slate">existing types · positions · keys</DiagramNode>
    <DiagramNode title="Next tree" tone="blue">new types · positions · keys</DiagramNode>
  </DiagramGrid>
  <DiagramArrow label="compare type + position + key" />
  <DiagramGrid columns={2}>
    <DiagramNode title="Preserve" tone="green">same identity can keep state and host nodes</DiagramNode>
    <DiagramNode title="Replace / update" tone="orange">changed identity or output requires different work</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

This comparison process is commonly called **reconciliation**.

The most important identity signals are:

1. component/element type;
2. position in the render tree;
3. `key` for siblings in a collection or intentionally keyed position.

You do not need Fiber internals yet to reason correctly about these rules.

## Commit phase

The commit phase is where React applies the necessary effects of the render to the host environment, such as the browser DOM.

Example:

<VisualDiagram title="Commit only what changed" compact>
  <DiagramGrid columns={2}>
    <DiagramNode title="Previous UI" tone="slate">&lt;button&gt;Save&lt;/button&gt;</DiagramNode>
    <DiagramNode title="Next UI" tone="blue">&lt;button disabled&gt;Saving…&lt;/button&gt;</DiagramNode>
  </DiagramGrid>
  <DiagramArrow label="commit" />
  <DiagramNode title="Update that button" tone="green" wide>React does not rebuild the whole page.</DiagramNode>
</VisualDiagram>

The render phase calculates. The commit phase applies.

## Browser layout and paint

After DOM changes, the browser may need to recalculate layout and paint pixels.

<VisualDiagram title="These stages are not synonyms" compact>
  <DiagramGrid columns={3}>
    <DiagramNode title="React render" tone="purple">calculate UI</DiagramNode>
    <DiagramNode title="DOM mutation" tone="green">apply host changes</DiagramNode>
    <DiagramNode title="Browser paint" tone="blue">display pixels</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

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

<VisualDiagram title="State follows component identity" compact>
  <DiagramStack align="center">
    <DiagramNode title="App" tone="blue" wide />
    <DiagramArrow />
    <DiagramNode title="Counter" tone="purple" eyebrow="same type + same position">React can preserve this state identity.</DiagramNode>
  </DiagramStack>
</VisualDiagram>

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

<VisualDiagram title="Unexpected render debugging flow">
  <LifecycleBar
    items={[
      { label: 'What triggered the update?', tone: 'orange' },
      { label: 'Which parent rendered?', tone: 'blue' },
      { label: 'Which props/context/state changed?', tone: 'purple' },
      { label: 'Did output actually change?', tone: 'cyan' },
      { label: 'Was DOM work expensive?', tone: 'green' },
    ]}
  />
</VisualDiagram>

Do not jump immediately to `memo`, `useMemo`, or `useCallback`.

## Production pattern

For a data-heavy dashboard, keep frequently changing state close to the smallest subtree that needs it.

<VisualDiagram title="State locality reduces unrelated work">
  <DiagramStack align="center">
    <DiagramNode title="Dashboard" tone="blue" wide />
    <DiagramArrow />
    <DiagramGrid columns={3}>
      <DiagramNode title="Header" tone="slate" />
      <DiagramNode title="Filters" tone="orange">frequently changing filter state lives here / nearby</DiagramNode>
      <DiagramNode title="Results" tone="purple">Chart + Table</DiagramNode>
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

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

<VisualDiagram title="Rendering summary">
  <LifecycleBar
    items={[
      { label: 'Trigger', tone: 'orange' },
      { label: 'Render: calculate', tone: 'purple' },
      { label: 'Reconcile: compare identity', tone: 'cyan' },
      { label: 'Commit: apply host changes', tone: 'green' },
      { label: 'Browser: layout + paint', tone: 'blue' },
    ]}
  />
</VisualDiagram>

React rendering is computation. DOM mutation and browser paint are later stages.

## References

- https://react.dev/learn/render-and-commit
- https://react.dev/learn/keeping-components-pure
- https://react.dev/reference/rules/components-and-hooks-must-be-pure
- https://react.dev/reference/rules/react-calls-components-and-hooks

## Next

Continue with **[Responding to Events](../06-events/responding-to-events.md)**.
