---
title: React Compiler Mental Model and Setup
description: Understand React Compiler 1.0 as a build-time optimizer, how to install it, verify it, and adopt it safely.
sidebar_position: 1
---

# React Compiler mental model and setup

React Compiler is a **build-time optimizer** for React components and Hooks. Its main job is to apply memoization automatically when it can prove that doing so is safe.

The key mental model is:

```text
Your React source
    ↓
React Compiler analyzes component/Hook behavior
    ↓
Compiler inserts memoization where safe
    ↓
Optimized JavaScript runs in the browser/native runtime
```

It is not a runtime scheduler, not a state manager, and not a replacement for good component design.

## Why the Compiler exists

Before React Compiler, developers often used:

- `React.memo`
- `useMemo`
- `useCallback`

These APIs remain valid, but manually placing them everywhere is tedious and can be incorrect or unnecessary.

React Compiler lets React infer many of these optimizations from the code itself.

## Stable status

React Compiler 1.0 is stable and production-ready. It works with React and React Native and can optimize components and Hooks without requiring an architectural rewrite.

The compiler is optional. A React app does not require it to function.

## What it optimizes

The compiler can reduce unnecessary work by preserving values or JSX when their reactive inputs have not changed.

Conceptually:

```jsx
function ProductCard({ product }) {
  const details = expensiveFormat(product);
  return <Card details={details} />;
}
```

The compiler may transform this into code that reuses the previously computed result when `product` is unchanged.

You normally do not write that generated cache logic yourself.

## What it does not optimize away

The compiler cannot turn inherently expensive external work into free work.

It does not:

- reduce network latency;
- eliminate database requests;
- make an O(n²) algorithm O(n);
- replace list virtualization;
- remove unnecessary state architecture;
- make impure render logic safe;
- fix hydration mismatches caused by nondeterministic rendering.

Memoization avoids **repeating work**. It does not change the complexity of the work itself.

## Rules of React are the foundation

Compiler optimizations rely on React's programming model.

In particular:

- rendering must be pure and idempotent;
- props/state are immutable snapshots;
- Hooks must follow the Rules of Hooks;
- refs should not be read or mutated during normal render logic;
- components should have stable identities rather than being recreated every render.

If the compiler detects unsupported or unsafe patterns, it can skip optimizing the affected component or Hook while continuing to optimize the rest of the application.

That means compiler adoption does **not** require fixing an entire codebase in one migration.

## Installation

Install the compiler as a development dependency:

```bash
npm install -D babel-plugin-react-compiler@latest
```

For a basic Babel setup:

```js
module.exports = {
  plugins: [
    'babel-plugin-react-compiler',
    // other plugins
  ],
};
```

The compiler should run before transformations that would destroy the original source structure it needs to analyze.

## React version targeting

React 19 is the default compiler target.

```js
[
  'babel-plugin-react-compiler',
  {
    target: '19',
  },
]
```

For React 17 or 18, install the runtime package:

```bash
npm install react-compiler-runtime@latest
```

Then configure the matching target:

```js
[
  'babel-plugin-react-compiler',
  {
    target: '18',
  },
]
```

React 19 includes the compiler runtime APIs directly.

## Vite and framework integrations

React Compiler can be integrated through supported build tools such as Babel, Vite, Metro, Rsbuild, and framework-specific integrations.

For frameworks such as Next.js or Expo, prefer the framework's documented compiler integration instead of manually copying a Babel configuration from another stack.

Why?

Because the framework may:

- invoke the compiler through another transform pipeline;
- manage plugin ordering;
- ship first-class configuration;
- integrate compiler diagnostics with its tooling.

## Verify that compilation is happening

### React DevTools

Compiled components can show a **Memo ✨** badge in React DevTools.

This is one of the easiest ways to confirm that a component has been optimized.

### Build output

Compiled code may contain imports such as:

```js
import { c as _c } from 'react/compiler-runtime';
```

for React 19.

A compiler-generated memo cache may look conceptually like:

```js
const $ = _c(2);

let value;
if ($[0] !== input) {
  value = expensiveCalculation(input);
  $[0] = input;
  $[1] = value;
} else {
  value = $[1];
}
```

Do not hand-write compiler runtime code.

## Compiler success is not the same as app success

A compiler-enabled build can still have application bugs.

You still need:

- functional tests;
- integration tests;
- performance profiling;
- production monitoring;
- user-visible correctness checks.

Treat Compiler adoption as a build-tool change that can affect performance and behavior around previously unsupported patterns.

## Practical adoption sequence

```text
1. Upgrade lint tooling
2. Fix high-risk Rules of React violations
3. Enable Compiler in a controlled scope
4. Verify compilation
5. Run tests
6. Profile real workloads
7. Expand coverage gradually
```

## Common mistakes

### Mistake: enabling Compiler to fix a slow algorithm

Compiler memoization can avoid repeated execution, but the algorithm may still be too expensive when it does run.

Fix the algorithm first when appropriate.

### Mistake: deleting all `useMemo` immediately

Existing manual memoization can encode semantic stability assumptions, especially for Effect dependencies or third-party APIs.

Do not mass-delete it just because the compiler is enabled.

### Mistake: suppressing every diagnostic

A skipped component is often safer than forcing compilation through an unsupported pattern.

Use diagnostics to improve the codebase progressively.

## Debugging checklist

If a component is not compiled:

1. confirm Compiler is installed and running;
2. confirm the file is included by the build configuration;
3. inspect ESLint diagnostics;
4. check Rules of React violations;
5. verify component/Hook naming conventions in infer mode;
6. inspect React DevTools;
7. temporarily isolate the component if needed.

## Production guidance

Compiler adoption should be measured by outcomes, not by percentage of components compiled.

Good metrics include:

- interaction latency;
- render counts;
- CPU time;
- scripting time;
- memory behavior;
- bundle/build cost;
- correctness/error rate.

## Exercise

Take a component that currently uses `React.memo`, `useMemo`, and `useCallback`.

1. identify why each manual memo exists;
2. enable the compiler for the component;
3. verify it receives a Memo ✨ badge;
4. profile before and after;
5. remove manual memoization only if tests and profiling justify it.

## Interview questions

**What is React Compiler?**  
A build-time optimizer that understands React's programming model and automatically adds memoization where safe.

**Does React Compiler replace React's scheduler?**  
No. Scheduling and compilation solve different problems.

**Do all compiler diagnostics have to be fixed before adoption?**  
No. Unsupported components can be skipped while other safe components remain compiled.

**Why do the Rules of React matter more with the Compiler?**  
Because static optimization depends on predictable, pure, analyzable component behavior.

## References

- https://react.dev/learn/react-compiler/introduction
- https://react.dev/learn/react-compiler/installation
- https://react.dev/reference/react-compiler/target
- https://react.dev/blog/2025/10/07/react-compiler-1
