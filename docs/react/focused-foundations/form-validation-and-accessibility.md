---
title: Form Validation and Accessibility
description: A focused React and TypeScript lesson on form validation and accessibility, including mental models, internals, production guidance, common mistakes, and exercises.
---

# Form Validation and Accessibility

## What it is

Form validation combines platform constraints, application rules, server authority, and accessible error communication.

## Why it exists

Users need clear prevention and recovery, while the server must reject invalid or unauthorized data regardless of client behavior.

## Beginner mental model

Client validation improves experience; server validation establishes truth.

```mermaid
flowchart TD
  INPUT[User input] --> CLIENT[Client constraints and guidance]
  CLIENT --> SUBMIT[Submit]
  SUBMIT --> SERVER[Server schema and authorization]
  SERVER -->|valid| SUCCESS[Success and confirmation]
  SERVER -->|invalid| ERRORS[Field and form errors]
  ERRORS --> FOCUS[Focus summary or first invalid field]
```

## How React handles it

React works from immutable render descriptions and state snapshots. It may calculate a component more than once, compare the new description with previous work, and commit only the selected host changes. The public model in this lesson is the contract to rely on; private Fiber fields and internal flags are implementation details.

## TypeScript example

```tsx
import {useId, useState} from 'react';

export function UsernameField() {
  const id = useId();
  const [value, setValue] = useState('');
  const error = value.length > 0 && value.length < 3 ? 'Use at least 3 characters.' : '';

  return (
    <div>
      <label htmlFor={id}>Username</label>
      <input
        id={id}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && <p id={`${id}-error`} role="alert">{error}</p>}
    </div>
  );
}
```

## Common mistakes

- Showing errors only by color.
- Removing useful browser semantics with custom div controls.
- Assuming TypeScript types validate network input at runtime.

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

Return structured field and form errors, preserve entered values safely, move focus intentionally, avoid exposing sensitive server details, and instrument repeated validation failures without logging secrets.

Test the observable user behavior, including loading, empty, error, retry, keyboard, and permission states when relevant. Keep monitoring and rollback paths for changes that affect critical workflows.

## Interview explanation

A strong explanation names the problem, gives the mental model, describes React's public behavior, shows a small example, and ends with the trade-offs. Avoid reciting an API signature without explaining ownership and identity.

## Summary

- Form validation combines platform constraints, application rules, server authority, and accessible error communication.
- Client validation improves experience; server validation establishes truth.
- Correctness and clear ownership come before optimization.

## Practice exercises

1. Associate a validation message with its input.
2. Design an error summary for a multi-field form.
3. Separate schema validation from authorization.

## Official references

- https://react.dev/learn
- https://react.dev/reference/react
- https://www.typescriptlang.org/docs/handbook/jsx.html
