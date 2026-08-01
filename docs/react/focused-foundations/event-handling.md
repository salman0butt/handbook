---
title: Event Handling
description: A focused React and TypeScript lesson on event handling, including mental models, internals, production guidance, common mistakes, and exercises.
---

# Event Handling

## What it is

React event handlers are functions passed as props and invoked in response to user or host events.

## Why it exists

Handlers are the correct place for user-triggered calculations, state updates, and external actions.

## Beginner mental model

Render describes available interactions; the handler performs work when the interaction actually occurs.

```mermaid
flowchart LR
  USER[User interaction] --> EVENT[Browser event]
  EVENT --> HANDLER[React handler]
  HANDLER --> UPDATE[State update or command]
  UPDATE --> RENDER[New render]
  RENDER --> COMMIT[Updated UI]
```

## How React handles it

React works from immutable render descriptions and state snapshots. It may calculate a component more than once, compare the new description with previous work, and commit only the selected host changes. The public model in this lesson is the contract to rely on; private Fiber fields and internal flags are implementation details.

## TypeScript example

```tsx
import {useState} from 'react';

export function CopyButton({text}: {text: string}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
  }

  return <button onClick={handleCopy}>{copied ? 'Copied' : 'Copy'}</button>;
}
```

## Common mistakes

- Passing handleSave() instead of handleSave.
- Using an Effect to react to a click that already has a handler.
- Ignoring pending, error, or duplicate-submission behavior for async handlers.

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

Guard async actions against duplicate intent, validate on the server, expose pending state, and design retry/idempotency for operations with external effects.

Test the observable user behavior, including loading, empty, error, retry, keyboard, and permission states when relevant. Keep monitoring and rollback paths for changes that affect critical workflows.

## Interview explanation

A strong explanation names the problem, gives the mental model, describes React's public behavior, shows a small example, and ends with the trade-offs. Avoid reciting an API signature without explaining ownership and identity.

## Summary

- React event handlers are functions passed as props and invoked in response to user or host events.
- Render describes available interactions; the handler performs work when the interaction actually occurs.
- Correctness and clear ownership come before optimization.

## Practice exercises

1. Fix an onClick prop that calls the function during render.
2. Type a change event handler for an input.
3. Separate a user event from an Effect-driven synchronization.

## Official references

- https://react.dev/learn
- https://react.dev/reference/react
- https://www.typescriptlang.org/docs/handbook/jsx.html
