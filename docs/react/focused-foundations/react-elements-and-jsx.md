---
title: React Elements and JSX
description: A focused React and TypeScript lesson on react elements and jsx, including mental models, internals, production guidance, common mistakes, and exercises.
---

# React Elements and JSX

## What it is

JSX is syntax that tooling transforms into JavaScript expressions describing React elements. A React element is an immutable description of what should be rendered.

## Why it exists

JSX makes nested UI descriptions readable while preserving normal JavaScript expressions and component composition.

## Beginner mental model

JSX is a blueprint, not a DOM node and not an HTML string.

```mermaid
flowchart LR
  JSX[JSX source] --> BUILD[Compiler or bundler transform]
  BUILD --> JS[JavaScript expression]
  JS --> ELEMENT[React element description]
  ELEMENT --> RENDER[React rendering work]
```

## How React handles it

React works from immutable render descriptions and state snapshots. It may calculate a component more than once, compare the new description with previous work, and commit only the selected host changes. The public model in this lesson is the contract to rely on; private Fiber fields and internal flags are implementation details.

## TypeScript example

```tsx
type WelcomeProps = {name: string};

export function Welcome({name}: WelcomeProps) {
  const heading = <h1>Hello, {name}</h1>;
  return <section aria-labelledby="welcome-title">{heading}</section>;
}
```

## Common mistakes

- Calling JSX an HTML string.
- Assuming creation of an element immediately changes the DOM.
- Calling a component as a normal function instead of rendering it with JSX.

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

Do not depend on private element object fields. Treat JSX and the public component model as the contract; let the compiler and React control representation and execution.

Test the observable user behavior, including loading, empty, error, retry, keyboard, and permission states when relevant. Keep monitoring and rollback paths for changes that affect critical workflows.

## Interview explanation

A strong explanation names the problem, gives the mental model, describes React's public behavior, shows a small example, and ends with the trade-offs. Avoid reciting an API signature without explaining ownership and identity.

## Summary

- JSX is syntax that tooling transforms into JavaScript expressions describing React elements. A React element is an immutable description of what should be rendered.
- JSX is a blueprint, not a DOM node and not an HTML string.
- Correctness and clear ownership come before optimization.

## Practice exercises

1. Describe what JSX becomes conceptually.
2. Show the difference between a React element and a mounted DOM element.
3. Convert a small JSX tree into a conceptual type/props/children description.

## Official references

- https://react.dev/learn
- https://react.dev/reference/react
- https://www.typescriptlang.org/docs/handbook/jsx.html
