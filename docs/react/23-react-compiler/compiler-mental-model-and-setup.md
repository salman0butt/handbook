---
title: React Compiler Mental Model and Setup
description: Understand React Compiler 1.0 as a build-time optimizer, how to install it, verify it, and adopt it safely.
sidebar_position: 1
---

import {
  VisualDiagram,
  DiagramStack,
  DiagramRow,
  DiagramGrid,
  DiagramNode,
  DiagramArrow,
  DecisionTree,
  LifecycleBar,
} from '@site/src/components/handbook/VisualDiagram'

# React Compiler mental model and setup

React Compiler is a **build-time optimizer** for React components and Hooks. Its main job is to apply memoization automatically when analysis proves reuse is safe.

<VisualDiagram title="The compiler optimizes source before runtime">
  <LifecycleBar items={[
    { label: 'React source', tone: 'blue' },
    { label: 'Compiler analyzes data flow + mutability', tone: 'purple' },
    { label: 'Safe memoization is generated', tone: 'teal' },
    { label: 'Optimized JavaScript ships', tone: 'orange' },
    { label: 'React runtime executes it normally', tone: 'green' },
  ]} />
</VisualDiagram>

It is not a scheduler, state manager, cache server, or replacement for component architecture.

## Stable status

React Compiler 1.0 is stable and production-ready. It works with React and React Native and can optimize components and Hooks without requiring an architectural rewrite.

The compiler is optional: React works without it.

## What automatic memoization means

```jsx
function ProductCard({ product }) {
  const details = expensiveFormat(product);
  return <Card details={details} />;
}
```

The compiler may preserve derived work or JSX when the relevant reactive inputs have not changed.

<VisualDiagram title="Memoization is input-aware reuse">
  <DiagramRow>
    <DiagramNode title="Reactive inputs" tone="blue">props · state · context · Hook values</DiagramNode>
    <DiagramArrow direction="right" label="analyze dependencies" />
    <DiagramNode title="Derived work" tone="purple">values · functions · JSX</DiagramNode>
    <DiagramArrow direction="right" label="inputs unchanged?" />
    <DiagramNode title="Reuse safe result" tone="green" />
  </DiagramRow>
</VisualDiagram>

You normally do not write the generated memo cache code yourself.

## What the Compiler does not fix

<DiagramGrid columns={2}>
  <DiagramNode title="Compiler can reduce repeated render work" tone="green">Memoize expressions, values, functions, and component output when safe.</DiagramNode>
  <DiagramNode title="Compiler cannot remove fundamental cost" tone="red">Network latency · slow databases · O(n²) algorithms · huge DOM trees · broken state ownership · hydration nondeterminism.</DiagramNode>
</DiagramGrid>

Memoization avoids **repeating** work. It does not change the complexity of the underlying work.

## Rules of React are the foundation

Compiler analysis relies on React's programming model:

- render is pure and idempotent;
- props/state are immutable snapshots;
- Hooks follow stable call-order rules;
- refs are not used as render-time mutable state;
- component identities stay stable;
- external side effects stay outside render.

<VisualDiagram title="Correct React code creates optimization freedom">
  <DiagramStack align="center">
    <DiagramNode title="Rules of React" tone="blue">Purity · immutability · Hook ordering · stable identities</DiagramNode>
    <DiagramArrow label="makes analysis reliable" />
    <DiagramNode title="Compiler proves reusable work" tone="purple" />
    <DiagramArrow label="generates memoization" />
    <DiagramNode title="Less repeated rendering cost" tone="green" />
  </DiagramStack>
</VisualDiagram>

When unsupported or unsafe patterns are found, the compiler can skip affected functions rather than requiring an all-or-nothing migration.

## Installation

```bash
npm install -D babel-plugin-react-compiler@latest
```

Basic Babel configuration:

```js
module.exports = {
  plugins: ['babel-plugin-react-compiler'],
};
```

The compiler should run before transforms that destroy source structure it needs to analyse. Framework integrations may configure this for you.

## React version targeting

React 19 is the default target.

```js
[
  'babel-plugin-react-compiler',
  { target: '19' }
]
```

For React 17 or 18, use the compatible compiler runtime and matching target according to the current Compiler documentation.

## Verify that Compiler is actually running

Do not assume installation equals effective compilation.

<DecisionTree
  question="How do you verify Compiler adoption?"
  items={[
    { label: 'Build config includes Compiler/integration', value: 'Confirm transform is enabled' },
    { label: 'ESLint reports Compiler/Rules diagnostics', value: 'Fix correctness issues first' },
    { label: 'Compiled output/dev tooling shows memo caches', value: 'Confirm functions are being transformed' },
    { label: 'Performance question remains', value: 'Measure with profiler and user-facing metrics' },
  ]}
/>

## Compiler does not mean “zero renders”

A component can still render because:

- its own state changes;
- context changes;
- inputs genuinely change;
- Suspense/retries happen;
- Strict Mode development checks run;
- concurrent rendering prepares work that may not commit.

The goal is not a magical render count. The goal is **less unnecessary repeated work while preserving React semantics**.

## Measure architecture before micro-optimizing

If a screen is slow, still inspect:

1. state ownership and render blast radius;
2. DOM/list size and virtualization needs;
3. expensive algorithms;
4. network/data waterfalls;
5. Suspense/loading architecture;
6. client bundle size;
7. browser main-thread work.

Compiler optimization is one layer in the performance stack.

## Incremental adoption principle

<LifecycleBar items={[
  { label: 'Enable modern eslint-plugin-react-hooks', tone: 'blue' },
  { label: 'Fix high-risk correctness violations', tone: 'red' },
  { label: 'Compile a controlled scope', tone: 'purple' },
  { label: 'Run tests', tone: 'orange' },
  { label: 'Profile and compare', tone: 'teal' },
  { label: 'Expand gradually', tone: 'green' },
]} />

You do not need to fix every legacy component before gaining value from Compiler.

## Common mistakes

- expecting the Compiler to fix impure render code;
- measuring success only by render count;
- deleting all manual memoization immediately;
- assuming framework configuration is active without verification;
- using Compiler to avoid fixing huge DOM trees or poor state scope;
- ignoring ESLint diagnostics because the app “still works.”

## Production checklist

- Compiler version/configuration is pinned and reviewed;
- current `eslint-plugin-react-hooks` rules are active;
- CI builds the compiler-enabled path;
- tests cover behavior, not implementation details;
- profiling compares meaningful user interactions;
- rollout can be narrowed or disabled if a compatibility issue appears;
- Rules of React violations are treated as correctness issues, not performance trivia.

## Interview questions

**Junior:** Is React Compiler a runtime feature?

**Mid-level:** What does automatic memoization actually reuse?

**Senior:** How would you introduce React Compiler into a large React 19 codebase without conflating memoization gains with architectural performance problems?

## Summary

<VisualDiagram title="Compiler is build-time optimization on top of correct React semantics">
  <DiagramRow>
    <DiagramNode title="Correct source" tone="blue" />
    <DiagramArrow direction="right" label="static analysis" />
    <DiagramNode title="Compiler" tone="purple" />
    <DiagramArrow direction="right" label="memoized output" />
    <DiagramNode title="Normal React runtime" tone="green" />
  </DiagramRow>
</VisualDiagram>

## References

- https://react.dev/learn/react-compiler
- https://react.dev/reference/react-compiler
- https://react.dev/blog/2025/10/07/react-compiler-1
