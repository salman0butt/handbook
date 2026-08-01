---
title: Children and Composition
description: A focused React and TypeScript lesson on children and composition, including mental models, internals, production guidance, common mistakes, and exercises.
---

# Children and Composition

## What it is

Composition builds larger interfaces by nesting components and passing renderable content through children or explicit slots.

## Why it exists

Composition reuses structure without tightly coupling a component to every possible child.

## Beginner mental model

The parent chooses content; the container chooses placement and shared behavior.

```mermaid
flowchart TD
  PAGE[Page] --> MODAL[Modal shell]
  PAGE --> BODY[Body content]
  PAGE --> ACTIONS[Action content]
  BODY --> MODAL
  ACTIONS --> MODAL
```

## How React handles it

React works from immutable render descriptions and state snapshots. It may calculate a component more than once, compare the new description with previous work, and commit only the selected host changes. The public model in this lesson is the contract to rely on; private Fiber fields and internal flags are implementation details.

## TypeScript example

```tsx
import type {ReactNode} from 'react';

type ModalProps = {
  title: string;
  children: ReactNode;
  footer: ReactNode;
};

export function Modal({title, children, footer}: ModalProps) {
  return (
    <section role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <h2 id="modal-title">{title}</h2>
      <div>{children}</div>
      <footer>{footer}</footer>
    </section>
  );
}
```

## Common mistakes

- Using children when the component needs a typed data contract.
- Cloning or inspecting children to create hidden coupling.
- Building a generic wrapper that provides no reusable responsibility.

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

Choose data props when the component owns rendering policy; choose renderable slots when callers should own content. Ensure composed interactive widgets still provide one coherent accessibility contract.

Test the observable user behavior, including loading, empty, error, retry, keyboard, and permission states when relevant. Keep monitoring and rollback paths for changes that affect critical workflows.

## Interview explanation

A strong explanation names the problem, gives the mental model, describes React's public behavior, shows a small example, and ends with the trade-offs. Avoid reciting an API signature without explaining ownership and identity.

## Summary

- Composition builds larger interfaces by nesting components and passing renderable content through children or explicit slots.
- The parent chooses content; the container chooses placement and shared behavior.
- Correctness and clear ownership come before optimization.

## Practice exercises

1. Convert inheritance-style UI reuse into composition.
2. Design named slots for a page layout.
3. Decide whether data or rendered content should cross a component boundary.

## Official references

- https://react.dev/learn
- https://react.dev/reference/react
- https://www.typescriptlang.org/docs/handbook/jsx.html
