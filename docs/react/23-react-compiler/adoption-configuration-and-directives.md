---
title: Compiler Adoption, Configuration, and Directives
description: Adopt React Compiler incrementally using compilation modes, gating, use memo, and use no memo without destabilizing a mature codebase.
sidebar_position: 3
---

# Compiler adoption, configuration, and directives

React Compiler can be rolled out gradually. You do not need to enable it across an entire production application in one step.

A safe migration strategy is:

```text
lint → fix high-risk violations → compile a small scope → test → profile → expand
```

## Default configuration

For a React 19 application, the normal starting point is intentionally small:

```js
module.exports = {
  plugins: ['babel-plugin-react-compiler'],
};
```

The default React target is 19.

Most projects should avoid advanced configuration until they have a concrete reason to change it.

## Compilation modes

Compiler configuration can control which functions are selected for optimization.

Three important strategies are:

- `infer` — compiler identifies likely components and Hooks;
- `annotation` — only explicitly annotated functions are compiled;
- `all` — broadly compile eligible functions.

### Infer mode

This is the normal automatic model.

```js
[
  'babel-plugin-react-compiler',
  {
    compilationMode: 'infer',
  },
]
```

The compiler uses conventions such as PascalCase component names and `use`-prefixed Hook names.

If a real component is named incorrectly, fix the naming convention instead of forcing compilation with a directive.

## Annotation mode

Annotation mode is useful for a cautious rollout:

```js
[
  'babel-plugin-react-compiler',
  {
    compilationMode: 'annotation',
  },
]
```

Only functions explicitly marked with:

```js
'use memo';
```

are compiled.

Example:

```jsx
function ProductGrid({ products }) {
  'use memo';

  return products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ));
}
```

This is useful when a large codebase wants to validate Compiler behavior feature by feature.

## `"use memo"`

`"use memo"` explicitly opts a function into Compiler optimization.

```jsx
function Dashboard() {
  'use memo';

  return <ExpensiveDashboard />;
}
```

In most applications, you should not add it everywhere.

It is mainly useful when:

- using `annotation` mode;
- testing Compiler on selected components;
- overriding inference intentionally.

The directive must appear at the beginning of the function body, before normal statements.

## `"use no memo"`

`"use no memo"` prevents React Compiler from optimizing the function.

```jsx
function ThirdPartyBridge() {
  'use no memo';

  return <LegacyWidget />;
}
```

Use it as a temporary escape hatch when:

- isolating a suspected Compiler-related bug;
- integrating incompatible code;
- migrating a component that violates the Rules of React;
- waiting for a dependency upgrade.

It should not become permanent technical debt without explanation.

Good:

```jsx
function LegacyChart() {
  'use no memo'; // TODO #482: remove after chart SDK v4 migration
  return <Chart />;
}
```

Poor:

```jsx
function LegacyChart() {
  'use no memo';
  return <Chart />;
}
```

## Module-level directives

Compiler directives can also be placed at module scope to affect functions in a file.

```js
'use memo';

export function One() {}
export function Two() {}
```

A function-level opt-out can still override a module-level opt-in where supported.

Use module directives carefully because they make compilation policy less local to each function.

## Directory-based rollout

Large applications can compile only selected directories through their build configuration.

Conceptually:

```text
src/legacy/     → not compiled yet
src/new-ui/     → Compiler enabled
src/checkout/   → Compiler enabled
```

This is often easier to govern than sprinkling directives across hundreds of files.

## Runtime gating

The Compiler supports gating so an optimized version can be controlled through a feature flag.

Conceptually:

```js
[
  'babel-plugin-react-compiler',
  {
    gating: {
      source: 'compiler-flags',
      importSpecifierName: 'isCompilerEnabled',
    },
  },
]
```

This is valuable for:

- staged rollout;
- A/B testing;
- rapid rollback;
- measuring production impact.

A feature gate does not replace testing. It is a deployment-control mechanism.

## Target version

React 19 is the default target:

```js
{ target: '19' }
```

React 17 and 18 need `react-compiler-runtime` plus a matching target:

```bash
npm install react-compiler-runtime@latest
```

```js
{ target: '18' }
```

Use string major versions, not patch versions.

## Configuration principle

Treat Compiler configuration like infrastructure configuration:

- keep it small;
- version-control it;
- review changes carefully;
- validate it with lint tooling;
- avoid undocumented project-specific switches.

Compiler-aware ESLint rules include a `config` rule to detect invalid option names or values.

## Diagnostics do not mean the whole build is unsafe

When Compiler detects a pattern it cannot safely optimize, it can skip the affected component/Hook rather than breaking compilation of the entire application.

This supports incremental cleanup.

Think:

```text
Compiler diagnostic
    ↓
skip unsafe function
    ↓
continue compiling safe functions
```

not:

```text
one diagnostic
    ↓
all compiler adoption blocked
```

## Rollout strategy for a mature product

### Stage 1 — lint only

Install current `eslint-plugin-react-hooks` and surface Compiler-aware diagnostics before enabling optimization.

### Stage 2 — low-risk feature

Choose a well-tested feature with:

- stable ownership;
- good automated tests;
- measurable interactions;
- limited third-party complexity.

### Stage 3 — production gate

Enable Compiler for a small percentage of traffic if infrastructure permits.

Measure:

- errors;
- render/interaction performance;
- CPU time;
- memory;
- user-visible regressions.

### Stage 4 — expand by domain

Expand to additional feature directories rather than individual random components.

### Stage 5 — remove temporary opt-outs

Track every `"use no memo"` with an issue or migration reason.

## Common mistakes

### Starting in `all` mode on a legacy codebase

A broad rollout is harder to debug when many unsupported patterns exist.

### Using `"use memo"` as a performance superstition

The directive is a compilation-control tool, not a magic “make faster” annotation.

### Leaving `"use no memo"` forever

Permanent opt-outs can hide Rules of React violations and reduce long-term optimization coverage.

### Treating compiler percentage as the goal

The goal is reliable performance improvement with correct behavior.

## Exercise

Design a Compiler rollout plan for a 200k-line React application with three domains:

- checkout: high revenue risk, excellent tests;
- admin: low risk, average tests;
- legacy editor: many third-party integrations.

Choose where to start, what compilation mode to use, what metrics to collect, and how to roll back safely.

## Interview questions

**Why use `annotation` mode?**  
To opt selected components/Hooks into compilation during incremental adoption.

**What is `"use no memo"` for?**  
A temporary escape hatch that prevents Compiler optimization for a function or module.

**Should Compiler diagnostics block all adoption?**  
No. Unsupported functions can be skipped while safe parts of the application continue to compile.

## References

- https://react.dev/reference/react-compiler/configuration
- https://react.dev/learn/react-compiler/incremental-adoption
- https://react.dev/reference/react-compiler/directives
- https://react.dev/reference/react-compiler/directives/use-memo
- https://react.dev/reference/react-compiler/directives/use-no-memo
