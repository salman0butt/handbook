---
title: Render and Commit Phases
description: A focused React and TypeScript lesson on render and commit phases, including mental models, internals, production guidance, common mistakes, and exercises.
---

# Render and Commit Phases

## What it is

React updates UI in two major stages: render calculates the next tree, and commit applies the selected changes to the host environment.

## Why it exists

Separating calculation from mutation enables React to prepare, pause, retry, or abandon render work before making visible changes.

## Beginner mental model

Render asks what should change; commit performs the change.

```mermaid
flowchart LR
  TRIGGER[State, props, or context update] --> RENDER[Render phase]
  RENDER --> RECONCILE[Compare identities and output]
  RECONCILE --> COMMIT[Commit phase]
  COMMIT --> DOM[DOM mutations]
  DOM --> LAYOUT[Layout effects]
  LAYOUT --> PAINT[Browser paint]
  PAINT --> EFFECTS[Passive effects]
```

## How React handles it

React works from immutable render descriptions and state snapshots. It may calculate a component more than once, compare the new description with previous work, and commit only the selected host changes. The public model in this lesson is the contract to rely on; private Fiber fields and internal flags are implementation details.

## TypeScript example

```tsx
import {useEffect, useState} from 'react';

export function DocumentTitleCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Count ${count}`;
  }, [count]);

  return <button onClick={() => setCount((value) => value + 1)}>{count}</button>;
}
```

## Common mistakes

- Treating render as proof that the DOM changed.
- Performing external mutation during render.
- Using an Effect for a value that can be derived during render.

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

Profile committed work rather than counting component calls alone. Concurrent rendering can perform calculation that never commits, so observability must distinguish render attempts from user-visible updates.

Test the observable user behavior, including loading, empty, error, retry, keyboard, and permission states when relevant. Keep monitoring and rollback paths for changes that affect critical workflows.

## Interview explanation

A strong explanation names the problem, gives the mental model, describes React's public behavior, shows a small example, and ends with the trade-offs. Avoid reciting an API signature without explaining ownership and identity.

## Summary

- React updates UI in two major stages: render calculates the next tree, and commit applies the selected changes to the host environment.
- Render asks what should change; commit performs the change.
- Correctness and clear ownership come before optimization.

## Practice exercises

1. Place render, DOM mutation, layout effect, paint, and passive effect in order.
2. Explain why DOM reads during render are unsafe.
3. Use React DevTools Profiler to inspect a committed update.

## Official references

- https://react.dev/learn
- https://react.dev/reference/react
- https://www.typescriptlang.org/docs/handbook/jsx.html
