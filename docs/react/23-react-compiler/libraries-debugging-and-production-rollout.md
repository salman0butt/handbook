---
title: Compiler Libraries, Debugging, and Production Rollout
description: Ship compiler-optimized libraries, debug skipped components, and validate React Compiler safely in production.
sidebar_position: 4
---

# Compiler libraries, debugging, and production rollout

React Compiler affects both application teams and library authors. The operational question is not only **can this code compile?** but **how do we ship, verify, and support compiled code safely?**

## Compiling libraries

A React library can compile its own components before publishing.

Benefits include:

- users receive optimized library code even if their app does not enable Compiler;
- optimization behavior is consistent across consumers;
- app teams do not need to compile your source themselves.

Basic Babel setup:

```js
module.exports = {
  plugins: ['babel-plugin-react-compiler'],
};
```

## Supporting React 17/18 consumers

If a compiled library supports React versions below 19, use the standalone runtime as a direct dependency:

```bash
npm install react-compiler-runtime@latest
```

and configure the target version.

Example:

```js
[
  'babel-plugin-react-compiler',
  {
    target: '18',
  },
]
```

A library package might then expose peer support such as:

```json
{
  "dependencies": {
    "react-compiler-runtime": "^1.0.0"
  },
  "peerDependencies": {
    "react": "^17 || ^18 || ^19"
  }
}
```

The compiler runtime is needed at runtime for React 17/18, so it should not be treated as a build-only dev dependency.

## Library testing matrix

A compiled library should test at least:

```text
source tests
    +
compiled package tests
    +
minimum supported React version
    +
latest supported React version
```

If you support React 17, 18, and 19, validate all three majors rather than assuming one compiled artifact behaves identically everywhere.

## Preserve package boundaries

Do not publish internal compiler implementation details as part of your public API.

Your API contract should remain normal React components, Hooks, and JavaScript values.

Consumers should not need to know whether your internal implementation uses generated memo caches.

## Debugging a skipped component

A skipped component is not automatically a bug.

It often means the compiler detected a pattern it cannot safely optimize.

Debugging sequence:

```text
1. Is Compiler running in this file?
2. Is the function recognized as a component/Hook?
3. Does ESLint report a Rules-of-React issue?
4. Is there incompatible syntax/library usage?
5. Is manual memoization preventing a safe transform?
6. Does a temporary opt-out change behavior?
```

## ESLint as the first diagnostic surface

`eslint-plugin-react-hooks` now exposes Compiler diagnostics.

That is useful even before enabling Compiler in production.

A component flagged by the linter can often be improved independently of optimization because many rules represent correctness problems:

- mutation during render;
- impure APIs in render;
- dynamic component definitions;
- invalid ref access;
- unsupported syntax;
- incompatible libraries.

## Distinguish compile-time and runtime failures

### Compile-time diagnostic

The compiler cannot safely transform a component.

Typical result:

- component is skipped;
- application can still run;
- other components may still compile.

### Runtime regression

The compiled app behaves incorrectly after optimization.

This requires a different workflow:

1. isolate the affected feature;
2. compare compiled vs uncompiled behavior;
3. add `"use no memo"` temporarily if needed;
4. capture a minimal reproduction;
5. inspect Rules of React violations and third-party interactions;
6. file an upstream issue if the code is valid and the compiler is wrong.

## Temporary opt-out as a debugging tool

```jsx
function ProblematicGrid() {
  'use no memo';

  return <Grid />;
}
```

If disabling optimization fixes a regression, you have narrowed the problem—but you have not necessarily proven the compiler is at fault.

The component may rely on invalid behavior that manual execution happened to preserve.

## Third-party library compatibility

Some libraries rely on patterns incompatible with memoization or React's programming model.

Compiler-aware linting can identify known incompatible library APIs and skip optimization around them.

When this happens, evaluate:

- whether a newer library version exists;
- whether the library has a Compiler-compatible integration;
- whether you can isolate the integration behind a small adapter;
- whether temporary opt-out is acceptable.

## Production rollout metrics

Do not judge Compiler only by synthetic render counts.

Measure real product metrics:

- Interaction to Next Paint / interaction latency;
- CPU time during key workflows;
- long tasks;
- memory pressure;
- error/crash rate;
- user conversion/completion rates where relevant;
- bundle size and build duration.

## A/B gating

If your compiler configuration uses runtime gating, you can compare compiled and original code paths under production traffic.

This is useful when the benefit is workload-dependent.

For example, a dashboard with many stable props may benefit more than a page where every input changes each render.

## Performance regression debugging

Compiler can increase code size or add cache bookkeeping in places where the saved work is tiny.

If a page gets slower:

1. profile the compiled build;
2. identify whether CPU time moved into cache bookkeeping, rendering, or elsewhere;
3. compare the same interaction without Compiler;
4. inspect generated output only after profiling points to a suspicious function;
5. avoid broad conclusions from one component.

## Do not optimize library source twice accidentally

If a library publishes already-compiled output, application tooling generally should consume that published artifact as normal package code rather than trying to recompile arbitrary dependency internals.

Document your package's support policy clearly.

## Release strategy for a library

A disciplined rollout:

```text
1. compile package in CI
2. run full test matrix
3. publish prerelease
4. validate in example apps
5. collect consumer feedback
6. publish stable release
```

## Common mistakes

### Shipping a runtime only as devDependency

React 17/18 consumers need the compiler runtime at runtime.

### Testing only source code

Your published compiled artifact is what users actually execute.

### Assuming every skipped component is a failure

Skipping is part of Compiler's safety model.

### Leaving debug directives undocumented

A permanent `"use no memo"` without rationale becomes invisible technical debt.

## Exercise

Imagine you maintain a component library supporting React 18 and 19.

Design:

- package dependencies;
- compiler target strategy;
- CI version matrix;
- prerelease rollout;
- rollback plan if consumers report a regression.

## Interview questions

**Why might a library compile its code before publishing?**  
So consumers receive optimized behavior without configuring Compiler themselves.

**What extra requirement exists for React 17/18 compiled libraries?**  
They need `react-compiler-runtime` and a matching compiler target.

**What does it mean if Compiler skips a component?**  
The compiler could not safely optimize it; the component can still run normally.

## References

- https://react.dev/reference/react-compiler/compiling-libraries
- https://react.dev/learn/react-compiler/debugging
- https://react.dev/reference/eslint-plugin-react-hooks
- https://react.dev/reference/react-compiler/directives/use-no-memo
