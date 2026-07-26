---
title: Rules of Hooks and Compiler-Aware ESLint
description: Master Hook ordering, the special use API exception, and the modern eslint-plugin-react-hooks rule set used by React Compiler.
sidebar_position: 2
---

# Rules of Hooks and Compiler-aware ESLint

React relies on Hook call order to associate Hook state with a component across renders.

That gives us the core rule:

> Call Hooks at the top level of React function components and custom Hooks.

## Why Hook order matters

React conceptually tracks Hook state by call sequence:

```text
render #1
useState      → slot 1
useEffect     → slot 2
useMemo       → slot 3

render #2
useState      → slot 1
useEffect     → slot 2
useMemo       → slot 3
```

If a Hook disappears conditionally, later slots shift and React can no longer match state correctly.

## Invalid: Hook in a condition

```jsx
function Profile({ enabled }) {
  if (enabled) {
    const [name, setName] = useState(''); // ❌
  }

  return null;
}
```

Instead call the Hook unconditionally and put conditional behavior around the result:

```jsx
function Profile({ enabled }) {
  const [name, setName] = useState('');

  if (!enabled) {
    return null;
  }

  return <input value={name} onChange={(e) => setName(e.target.value)} />;
}
```

## Invalid locations

Normal Hooks must not be called:

- inside `if`/`else` branches;
- inside loops;
- after conditional early returns;
- inside event handlers;
- inside arbitrary callbacks;
- inside class methods;
- at module scope;
- inside async functions.

## Custom Hooks

A custom Hook is a function that itself follows Hook rules and is named with a `use` prefix.

```jsx
function useOnlineStatus() {
  const [online, setOnline] = useState(true);
  // ...
  return online;
}
```

The `use` prefix is not decorative. Tooling uses it to recognize Hook semantics.

## The special `use` API exception

The `use` API is different from ordinary Hooks.

React's Rules-of-Hooks reference allows `use` to be called conditionally and in loops.

Example:

```jsx
function Comments({ shouldLoad, promise }) {
  if (shouldLoad) {
    const comments = use(promise);
    return <CommentList comments={comments} />;
  }

  return null;
}
```

This exception does **not** mean other Hooks can be conditional.

`useState`, `useEffect`, `useMemo`, and other normal Hooks still require stable call order.

## ESLint is part of the React toolchain

Modern `eslint-plugin-react-hooks` does more than enforce the classic two Hook rules.

It now surfaces diagnostics used by React Compiler as well.

Install the current plugin:

```bash
npm install -D eslint-plugin-react-hooks@latest
```

The plugin can be useful even if React Compiler is not enabled yet.

## Why Compiler diagnostics appear in ESLint

React Compiler statically analyzes component and Hook code.

When it finds a pattern that breaks React's model or cannot be safely optimized, that diagnostic can be surfaced by the ESLint plugin.

This gives teams a migration path:

```text
lint first
→ understand violations
→ fix incrementally
→ increase Compiler coverage
```

## Core rules

### `rules-of-hooks`

Checks Hook call locations and ordering.

### `exhaustive-deps`

Checks dependency arrays for Effects and other dependency-aware Hooks.

Do not silence it simply to make warnings disappear.

Dependencies should describe the reactive values used by the synchronization process.

## Compiler-aware rules

The recommended plugin presets include rules such as:

- `component-hook-factories`
- `config`
- `error-boundaries`
- `gating`
- `globals`
- `immutability`
- `incompatible-library`
- `preserve-manual-memoization`
- `purity`
- `refs`
- `set-state-in-effect`
- `set-state-in-render`
- `static-components`
- `unsupported-syntax`
- `use-memo`

Each rule points to a class of code that is either incorrect, risky, or difficult to optimize safely.

## `component-hook-factories`

Flags higher-order patterns that dynamically define components or Hooks.

Bad:

```jsx
function makeComponent(label) {
  return function Component() {
    return <p>{label}</p>;
  };
}
```

Prefer a static component with props:

```jsx
function Component({ label }) {
  return <p>{label}</p>;
}
```

## `static-components`

Flags components created inside render.

Bad:

```jsx
function Parent() {
  const Child = () => <span>Child</span>;
  return <Child />;
}
```

The identity changes every render.

## `purity`

Flags known impure APIs during render, such as values that change without React inputs changing.

Examples include:

- `Date.now()`;
- `Math.random()`;
- `crypto.randomUUID()`;
- `performance.now()`.

## `immutability`

Flags direct mutation of props, state, or other immutable values.

Bad:

```jsx
items.push(item);
setItems(items);
```

Good:

```jsx
setItems((items) => [...items, item]);
```

## `globals`

Flags global mutation during render.

Bad:

```js
let count = 0;

function Component() {
  count += 1;
  return <span>{count}</span>;
}
```

## `refs`

Flags unsafe ref reads/writes during render.

Refs are mutable escape hatches, not render state.

## `set-state-in-render`

Flags state updates during render that can cause infinite loops or render instability.

Bad:

```jsx
function Component({ value }) {
  const [state, setState] = useState(value);

  setState(value); // ❌

  return state;
}
```

## `set-state-in-effect`

Flags patterns where an Effect synchronously derives state that could often be calculated during render or updated directly at the source.

This connects to the earlier mental model:

> Effects are for synchronization with external systems, not for routine data derivation.

## `unsupported-syntax`

Flags syntax the Compiler cannot statically analyze safely, including dynamic-scope constructs such as `eval` and `with`.

`eval` is also a serious security risk when used with untrusted input.

## `incompatible-library`

Flags known APIs whose behavior conflicts with React memoization assumptions.

The safe Compiler behavior is often to skip the affected component rather than transform it incorrectly.

## `preserve-manual-memoization`

Helps avoid Compiler transformations that would undermine existing manual memoization contracts.

This is especially important while migrating mature codebases.

## `config`

Validates Compiler configuration names and values.

A typo such as:

```js
{ compileMode: 'all' }
```

should not silently look like valid configuration.

## `gating`

Validates runtime gating configuration used for staged Compiler rollout.

## `error-boundaries`

Helps identify patterns that incorrectly rely on `try/catch` for errors thrown by child rendering instead of using React Error Boundaries where appropriate.

## `use-memo`

Validates meaningful `useMemo` usage, such as ensuring a memo callback actually returns the value being memoized.

## Fix priority

Not all lint violations have equal risk.

A practical priority:

### Highest priority

- state updates during render;
- mutation of props/state/globals;
- Hook ordering violations;
- impure render side effects.

These can be correctness bugs even without Compiler.

### Medium priority

- dynamic component identities;
- incompatible library integrations;
- unstable manual memoization patterns.

### Adoption/tooling priority

- compiler config;
- gating;
- unsupported syntax affecting optimization coverage.

## Do not disable rules globally to reach zero warnings

A zero-warning dashboard achieved through blanket rule suppression gives false confidence.

Prefer:

1. understand the rule;
2. fix the code where reasonable;
3. isolate legitimate exceptions narrowly;
4. document why the exception exists.

## CI strategy

For a mature repository:

```text
PR
→ ESLint
→ tests
→ production build
→ optional Compiler coverage/performance checks
```

Compiler-aware linting should run before merge so violations do not silently accumulate.

## Interview questions

**Why can't normal Hooks be conditional?**  
React relies on stable Hook call order to associate Hook state with the same slots across renders.

**What is special about `use`?**  
Unlike ordinary Hooks, the `use` API may be called conditionally and in loops according to the current Rules-of-Hooks reference.

**Does a Compiler lint diagnostic mean the entire app cannot compile?**  
No. The compiler can skip unsupported components or Hooks and continue optimizing safe code.

**Why use Compiler-aware ESLint before enabling Compiler?**  
It exposes Rules-of-React problems early and lets the codebase become compiler-ready incrementally.

## References

- https://react.dev/reference/rules/rules-of-hooks
- https://react.dev/reference/eslint-plugin-react-hooks
- https://react.dev/reference/eslint-plugin-react-hooks/lints/rules-of-hooks
- https://react.dev/reference/eslint-plugin-react-hooks/lints/component-hook-factories
- https://react.dev/reference/eslint-plugin-react-hooks/lints/static-components
- https://react.dev/reference/eslint-plugin-react-hooks/lints/unsupported-syntax
