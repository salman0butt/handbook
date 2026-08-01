---
title: Keys and Identity
description: A focused React and TypeScript lesson on keys and identity, including mental models, internals, production guidance, common mistakes, and exercises.
---

# Keys and Identity

## What it is

A key tells React which sibling item a rendered element corresponds to across renders.

## Why it exists

Stable identity lets React preserve the correct component state and DOM association when items are inserted, removed, or reordered.

## Beginner mental model

A key answers: which data entity is this sibling?

```mermaid
flowchart TD
  BEFORE[Previous keyed siblings] --> MATCH[Match by type and key]
  AFTER[Next keyed siblings] --> MATCH
  MATCH -->|same identity| PRESERVE[Preserve state]
  MATCH -->|new identity| RESET[Create and reset state]
```

## How React handles it

React works from immutable render descriptions and state snapshots. It may calculate a component more than once, compare the new description with previous work, and commit only the selected host changes. The public model in this lesson is the contract to rely on; private Fiber fields and internal flags are implementation details.

## TypeScript example

```tsx
type EditableRow = {id: string; name: string};

export function EditableRows({rows}: {rows: EditableRow[]}) {
  return (
    <div>
      {rows.map((row) => (
        <label key={row.id}>
          {row.name}
          <input defaultValue={row.name} />
        </label>
      ))}
    </div>
  );
}
```

## Common mistakes

- Using array indexes for reorderable or editable data.
- Generating a random key during every render.
- Expecting key to arrive as a normal component prop.

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

Keys must be stable, unique among siblings, and derived from domain identity. Changing a key is a deliberate remount operation with state, focus, and performance consequences.

Test the observable user behavior, including loading, empty, error, retry, keyboard, and permission states when relevant. Keep monitoring and rollback paths for changes that affect critical workflows.

## Interview explanation

A strong explanation names the problem, gives the mental model, describes React's public behavior, shows a small example, and ends with the trade-offs. Avoid reciting an API signature without explaining ownership and identity.

## Summary

- A key tells React which sibling item a rendered element corresponds to across renders.
- A key answers: which data entity is this sibling?
- Correctness and clear ownership come before optimization.

## Practice exercises

1. Demonstrate the bug caused by index keys during reordering.
2. Choose a key for records returned by an API.
3. Use a key intentionally to reset a form.

## Official references

- https://react.dev/learn
- https://react.dev/reference/react
- https://www.typescriptlang.org/docs/handbook/jsx.html
