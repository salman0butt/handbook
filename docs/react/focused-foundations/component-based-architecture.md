---
title: Component-Based Architecture
description: A focused React and TypeScript lesson on component-based architecture, including mental models, internals, production guidance, common mistakes, and exercises.
---

# Component-Based Architecture

## What it is

A React component is a reusable unit that owns a coherent part of the user interface and expresses it from inputs.

## Why it exists

Components let teams split UI responsibility, reuse behavior and markup, isolate change, and build larger screens by composition.

## Beginner mental model

A component is not merely a file or a visual rectangle. It is an ownership boundary with a public API.

```mermaid
flowchart TD
  APP[Application] --> PAGE[Orders page]
  PAGE --> FILTERS[Order filters]
  PAGE --> LIST[Order list]
  LIST --> ROW[Order row]
  ROW --> ACTIONS[Order actions]
```

## How React handles it

React works from immutable render descriptions and state snapshots. It may calculate a component more than once, compare the new description with previous work, and commit only the selected host changes. The public model in this lesson is the contract to rely on; private Fiber fields and internal flags are implementation details.

## TypeScript example

```tsx
type Order = {id: string; total: number};

function OrderRow({order}: {order: Order}) {
  return (
    <li>
      <span>Order {order.id}</span>
      <strong>${order.total.toFixed(2)}</strong>
    </li>
  );
}

export function OrderList({orders}: {orders: Order[]}) {
  return <ul>{orders.map((order) => <OrderRow key={order.id} order={order} />)}</ul>;
}
```

## Common mistakes

- Creating a component for every tiny HTML element without a responsibility boundary.
- Building one page component that owns unrelated data, policy, and presentation.
- Exposing many low-level props instead of a coherent component API.

## Debugging guidance

Start with observable evidence:

1. Inspect the props, state, and event values for the render in question.
2. Use React DevTools to inspect ownership and committed updates.
3. Verify element type, position, and key when state or DOM identity behaves unexpectedly.
4. Reduce the example until one source of truth and one transition remain.
5. Check the browser accessibility tree and event behavior for interactive UI.

Avoid diagnosing correctness from `console.log` count alone. Development Strict Mode and concurrent rendering can repeat render calculations without producing an extra visible commit.

## Performance implications

Correct ownership comes before memoization. Measure render frequency, render cost, DOM size, network work, and user-visible interaction latency separately. Use memoization, virtualization, deferred work, or the React Compiler only after identifying the actual bottleneck.

## Accessibility and security

Preserve native HTML semantics, keyboard behavior, focus, and accessible names. Normal JSX interpolation escapes text, but URLs, raw HTML, uploads, authentication, authorization, and server mutations remain explicit trust boundaries. TypeScript improves developer feedback; it does not validate untrusted runtime data.

## When to use it

Use this concept when it makes the component's ownership, data flow, identity, or interaction contract clearer.

## When not to use it

Do not add an abstraction merely to imitate a pattern. Prefer the simplest model that preserves one source of truth, clear responsibilities, platform semantics, and testable behavior.

## Production considerations

Prefer feature-oriented boundaries. Keep domain policy outside presentational components, but avoid artificial layers that only forward props without adding meaning.

Test the observable user behavior, including loading, empty, error, retry, keyboard, and permission states when relevant. Keep monitoring and rollback paths for changes that affect critical workflows.

## Interview explanation

A strong explanation names the problem, gives the mental model, describes React's public behavior, shows a small example, and ends with the trade-offs. Avoid reciting an API signature without explaining ownership and identity.

## Summary

- A React component is a reusable unit that owns a coherent part of the user interface and expresses it from inputs.
- A component is not merely a file or a visual rectangle. It is an ownership boundary with a public API.
- Correctness and clear ownership come before optimization.

## Practice exercises

1. Split a profile page into responsibility-based components.
2. Design props for a reusable Alert component.
3. Find one component that is too broad and state how you would divide ownership.

## Official references

- https://react.dev/learn
- https://react.dev/reference/react
- https://www.typescriptlang.org/docs/handbook/jsx.html
