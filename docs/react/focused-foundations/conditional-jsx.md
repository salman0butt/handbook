---
title: Conditional JSX
description: A focused React and TypeScript lesson on conditional jsx, including mental models, internals, production guidance, common mistakes, and exercises.
---

# Conditional JSX

## What it is

Conditional rendering uses JavaScript control flow to choose which React elements describe the current UI state.

## Why it exists

Applications must represent loading, empty, error, permission, and success states without manually hiding and showing DOM nodes.

## Beginner mental model

Every meaningful application state should map to an intentional UI branch.

```mermaid
flowchart TD
  STATE[Current state] --> CHECK{Which state?}
  CHECK -->|loading| LOAD[Loading UI]
  CHECK -->|error| ERR[Error and recovery UI]
  CHECK -->|empty| EMPTY[Empty state]
  CHECK -->|ready| CONTENT[Content]
```

## How React handles it

React works from immutable render descriptions and state snapshots. It may calculate a component more than once, compare the new description with previous work, and commit only the selected host changes. The public model in this lesson is the contract to rely on; private Fiber fields and internal flags are implementation details.

## TypeScript example

```tsx
type Result<T> =
  | {status: 'loading'}
  | {status: 'error'; message: string}
  | {status: 'success'; data: T[]};

export function UserResults({result}: {result: Result<string>}) {
  if (result.status === 'loading') return <p aria-live="polite">Loading…</p>;
  if (result.status === 'error') return <p role="alert">{result.message}</p>;
  if (result.data.length === 0) return <p>No users found.</p>;
  return <ul>{result.data.map((name) => <li key={name}>{name}</li>)}</ul>;
}
```

## Common mistakes

- Using deeply nested ternaries that obscure state meaning.
- Forgetting an empty or error branch.
- Assuming not-rendered content preserves state in the same way as hidden content.

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

Represent recoverable failure and permission states explicitly. Do not leak sensitive information in error branches, and preserve focus or announcements when asynchronous state changes.

Test the observable user behavior, including loading, empty, error, retry, keyboard, and permission states when relevant. Keep monitoring and rollback paths for changes that affect critical workflows.

## Interview explanation

A strong explanation names the problem, gives the mental model, describes React's public behavior, shows a small example, and ends with the trade-offs. Avoid reciting an API signature without explaining ownership and identity.

## Summary

- Conditional rendering uses JavaScript control flow to choose which React elements describe the current UI state.
- Every meaningful application state should map to an intentional UI branch.
- Correctness and clear ownership come before optimization.

## Practice exercises

1. Model loading/error/empty/success as a discriminated union.
2. Replace several nested ternaries with early returns.
3. Explain when CSS hiding differs from not rendering.

## Official references

- https://react.dev/learn
- https://react.dev/reference/react
- https://www.typescriptlang.org/docs/handbook/jsx.html
