---
title: Component Purity
description: A focused React and TypeScript lesson on component purity, including mental models, internals, production guidance, common mistakes, and exercises.
---

# Component Purity

## What it is

A pure component render calculates the same output for the same inputs and does not change external systems while rendering.

## Why it exists

Purity allows React to retry, interrupt, compare, pre-render, and optimize rendering safely.

## Beginner mental model

Render is calculation; commit and event handling are where external changes become observable.

```mermaid
flowchart LR
  SNAPSHOT[Props and state snapshot] --> RENDER[Pure render calculation]
  RENDER --> DESCRIPTION[UI description]
  DESCRIPTION --> COMMIT[Commit DOM changes]
  COMMIT --> EFFECTS[Effects synchronize external systems]
```

## How React handles it

React works from immutable render descriptions and state snapshots. It may calculate a component more than once, compare the new description with previous work, and commit only the selected host changes. The public model in this lesson is the contract to rely on; private Fiber fields and internal flags are implementation details.

## TypeScript example

```tsx
type TotalProps = {prices: readonly number[]};

export function Total({prices}: TotalProps) {
  const total = prices.reduce((sum, price) => sum + price, 0);
  return <output>Total: {total.toFixed(2)}</output>;
}
```

## Common mistakes

- Writing to localStorage or analytics during render.
- Mutating a shared array before mapping it.
- Relying on a component to render exactly once.

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

Strict Mode helps reveal impure assumptions in development. Treat duplicate development execution as a diagnostic signal, not as a reason to disable correctness checks.

Test the observable user behavior, including loading, empty, error, retry, keyboard, and permission states when relevant. Keep monitoring and rollback paths for changes that affect critical workflows.

## Interview explanation

A strong explanation names the problem, gives the mental model, describes React's public behavior, shows a small example, and ends with the trade-offs. Avoid reciting an API signature without explaining ownership and identity.

## Summary

- A pure component render calculates the same output for the same inputs and does not change external systems while rendering.
- Render is calculation; commit and event handling are where external changes become observable.
- Correctness and clear ownership come before optimization.

## Practice exercises

1. Find and remove a render-time mutation.
2. Explain why Date.now() can make output non-deterministic.
3. Move a user-triggered side effect to an event handler.

## Official references

- https://react.dev/learn
- https://react.dev/reference/react
- https://www.typescriptlang.org/docs/handbook/jsx.html
