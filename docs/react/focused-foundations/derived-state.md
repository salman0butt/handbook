---
title: Derived State
description: A focused React and TypeScript lesson on derived state, including mental models, internals, production guidance, common mistakes, and exercises.
---

# Derived State

## What it is

Derived state is a value that can be calculated from current props and state rather than stored independently.

## Why it exists

Calculating derived values avoids synchronization bugs and multiple competing sources of truth.

## Beginner mental model

Store the minimum canonical facts; calculate the rest.

```mermaid
flowchart LR
  SOURCE1[Canonical state] --> DERIVE[Pure calculation]
  SOURCE2[Props] --> DERIVE
  DERIVE --> VIEW[Rendered value]
  DUPLICATE[Duplicated stored value] -. drift risk .-> VIEW
```

## How React handles it

React works from immutable render descriptions and state snapshots. It may calculate a component more than once, compare the new description with previous work, and commit only the selected host changes. The public model in this lesson is the contract to rely on; private Fiber fields and internal flags are implementation details.

## TypeScript example

```tsx
type Product = {id: string; price: number};

export function CartTotal({products}: {products: readonly Product[]}) {
  const total = products.reduce((sum, product) => sum + product.price, 0);
  return <output>Total: {total.toFixed(2)}</output>;
}
```

## Common mistakes

- Using an Effect to synchronize a value that can be calculated during render.
- Storing both an item list and its count.
- Using useMemo to hide an impure or incorrect calculation.

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

Memoize only measured expensive derivations or when stable identity is required by an API. React Compiler may optimize eligible calculations, but canonical state design remains your responsibility.

Test the observable user behavior, including loading, empty, error, retry, keyboard, and permission states when relevant. Keep monitoring and rollback paths for changes that affect critical workflows.

## Interview explanation

A strong explanation names the problem, gives the mental model, describes React's public behavior, shows a small example, and ends with the trade-offs. Avoid reciting an API signature without explaining ownership and identity.

## Summary

- Derived state is a value that can be calculated from current props and state rather than stored independently.
- Store the minimum canonical facts; calculate the rest.
- Correctness and clear ownership come before optimization.

## Practice exercises

1. Remove state that duplicates filtered results.
2. Decide when useMemo is an optimization rather than a correctness tool.
3. Find the canonical source in a form with subtotal, tax, and total.

## Official references

- https://react.dev/learn
- https://react.dev/reference/react
- https://www.typescriptlang.org/docs/handbook/jsx.html
