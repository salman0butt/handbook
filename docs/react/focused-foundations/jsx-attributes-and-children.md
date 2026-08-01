---
title: JSX Attributes and Children
description: A focused React and TypeScript lesson on jsx attributes and children, including mental models, internals, production guidance, common mistakes, and exercises.
---

# JSX Attributes and Children

## What it is

JSX attributes pass props to elements or components, while nested content is delivered through the children prop.

## Why it exists

Props and children form the public composition language for React components.

## Beginner mental model

Attributes configure a component; children fill an intentional content slot.

```mermaid
flowchart LR
  CALLER[Parent JSX] --> PROPS[Named props]
  CALLER --> CHILDREN[children content]
  PROPS --> COMPONENT[Component]
  CHILDREN --> COMPONENT
  COMPONENT --> OUTPUT[Rendered composition]
```

## How React handles it

React works from immutable render descriptions and state snapshots. It may calculate a component more than once, compare the new description with previous work, and commit only the selected host changes. The public model in this lesson is the contract to rely on; private Fiber fields and internal flags are implementation details.

## TypeScript example

```tsx
import type {ReactNode} from 'react';

type PanelProps = {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function Panel({title, actions, children}: PanelProps) {
  return (
    <section>
      <header>
        <h2>{title}</h2>
        {actions}
      </header>
      <div>{children}</div>
    </section>
  );
}
```

## Common mistakes

- Treating key and ref as ordinary props.
- Passing a string when a numeric prop was intended.
- Making children optional when the component cannot render meaningfully without content.

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

Keep component APIs small and semantic. Prefer existing platform prop types when wrapping native elements, and document which content relationships are required for accessibility.

Test the observable user behavior, including loading, empty, error, retry, keyboard, and permission states when relevant. Keep monitoring and rollback paths for changes that affect critical workflows.

## Interview explanation

A strong explanation names the problem, gives the mental model, describes React's public behavior, shows a small example, and ends with the trade-offs. Avoid reciting an API signature without explaining ownership and identity.

## Summary

- JSX attributes pass props to elements or components, while nested content is delivered through the children prop.
- Attributes configure a component; children fill an intentional content slot.
- Correctness and clear ownership come before optimization.

## Practice exercises

1. Design a Card API using named props and children.
2. Explain quoted versus braced prop values.
3. Reuse native button props in a typed component.

## Official references

- https://react.dev/learn
- https://react.dev/reference/react
- https://www.typescriptlang.org/docs/handbook/jsx.html
