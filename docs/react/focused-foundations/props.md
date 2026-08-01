---
title: Props
description: A focused React and TypeScript lesson on props, including mental models, internals, production guidance, common mistakes, and exercises.
---

# Props

## What it is

Props are read-only inputs supplied by a parent when it renders a component.

## Why it exists

Props make dependencies explicit and allow the same component implementation to represent different data or behavior.

## Beginner mental model

Props are the component call arguments for one render snapshot.

```mermaid
flowchart LR
  PARENT[Parent owns data] -->|props| CHILD[Child renders]
  CHILD -->|event callback| PARENT
  PARENT --> UPDATE[Parent updates state]
  UPDATE -->|new props snapshot| CHILD
```

## How React handles it

React works from immutable render descriptions and state snapshots. It may calculate a component more than once, compare the new description with previous work, and commit only the selected host changes. The public model in this lesson is the contract to rely on; private Fiber fields and internal flags are implementation details.

## TypeScript example

```tsx
type BadgeProps = {
  label: string;
  tone?: 'neutral' | 'success' | 'danger';
};

export function Badge({label, tone = 'neutral'}: BadgeProps) {
  return <span data-tone={tone}>{label}</span>;
}
```

## Common mistakes

- Mutating a prop object or array.
- Copying props into state without a synchronization requirement.
- Passing many unrelated booleans that permit impossible combinations.

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

Prefer semantic prop contracts. Use discriminated unions for mutually exclusive modes, runtime validation at untrusted boundaries, and callbacks for child-to-owner intent.

Test the observable user behavior, including loading, empty, error, retry, keyboard, and permission states when relevant. Keep monitoring and rollback paths for changes that affect critical workflows.

## Interview explanation

A strong explanation names the problem, gives the mental model, describes React's public behavior, shows a small example, and ends with the trade-offs. Avoid reciting an API signature without explaining ownership and identity.

## Summary

- Props are read-only inputs supplied by a parent when it renders a component.
- Props are the component call arguments for one render snapshot.
- Correctness and clear ownership come before optimization.

## Practice exercises

1. Make a required and optional prop type.
2. Replace prop mutation with an event callback.
3. Design a discriminated prop API that prevents invalid combinations.

## Official references

- https://react.dev/learn
- https://react.dev/reference/react
- https://www.typescriptlang.org/docs/handbook/jsx.html
