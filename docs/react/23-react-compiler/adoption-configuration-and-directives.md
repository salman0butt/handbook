---
title: Compiler Adoption, Configuration, and Directives
description: Adopt React Compiler incrementally using compilation modes, gating, use memo, and use no memo without destabilizing a mature codebase.
sidebar_position: 3
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

# Compiler adoption, configuration, and directives

React Compiler can be rolled out gradually. You do not need to enable it across an entire production application in one step.

<VisualDiagram title="A safe Compiler rollout is incremental">
  <LifecycleBar items={[
    { label: 'Lint', tone: 'blue' },
    { label: 'Fix correctness issues', tone: 'red' },
    { label: 'Compile a controlled scope', tone: 'purple' },
    { label: 'Test', tone: 'orange' },
    { label: 'Profile', tone: 'teal' },
    { label: 'Expand', tone: 'green' },
  ]} />
</VisualDiagram>

## Start with simple configuration

For React 19, the normal starting point is intentionally small:

```js
module.exports = {
  plugins: ['babel-plugin-react-compiler'],
};
```

Most applications should avoid advanced configuration until a concrete rollout or compatibility need appears.

## Compilation modes

React Compiler supports different selection strategies.

<VisualDiagram title="Compilation mode controls which eligible functions are compiled">
  <DiagramGrid columns={3}>
    <DiagramNode title="infer" tone="green" eyebrow="DEFAULT SHAPE">Compiler identifies likely components and Hooks automatically.</DiagramNode>
    <DiagramNode title="annotation" tone="orange" eyebrow="OPT IN">Only code explicitly marked with `'use memo'` is compiled.</DiagramNode>
    <DiagramNode title="all" tone="purple" eyebrow="BROAD">Compile eligible functions broadly, with opt-out available where needed.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

### Infer mode

```js
[
  'babel-plugin-react-compiler',
  { compilationMode: 'infer' }
]
```

Use normal React naming conventions so components and Hooks are recognisable to tooling.

### Annotation mode

```js
[
  'babel-plugin-react-compiler',
  { compilationMode: 'annotation' }
]
```

Then opt selected functions in:

```jsx
function ProductGrid({ products }) {
  'use memo';

  return products.map(product => (
    <ProductCard key={product.id} product={product} />
  ));
}
```

Annotation mode is useful when a mature codebase wants to validate Compiler behavior feature by feature.

## `'use memo'`

`'use memo'` explicitly opts a function into compilation where the current mode supports that control.

Use it sparingly. It is mainly useful for:

- annotation-mode rollout;
- controlled experiments;
- deliberate override of inference behavior.

<VisualDiagram title="Directives are local overrides, not the architecture">
  <DiagramStack align="center">
    <DiagramNode title="Project/compiler configuration" tone="blue">Defines normal policy</DiagramNode>
    <DiagramArrow label="usually sufficient" />
    <DiagramNode title="Directive" tone="orange">Narrow exception or rollout control</DiagramNode>
  </DiagramStack>
</VisualDiagram>

## `'use no memo'`

`'use no memo'` opts a function out of Compiler optimization.

```jsx
function ThirdPartyBridge() {
  'use no memo';
  return <LegacyWidget />;
}
```

This is useful for:

- isolating incompatible code;
- debugging behavior differences;
- temporarily excluding a known migration hotspot.

Treat it as an escape hatch with an owner and reason—not a permanent way to ignore Rules-of-React violations.

## Function-level vs module-level directives

Directives can control individual functions or, where supported by the current Compiler contract, a module scope.

<DiagramGrid columns={2}>
  <DiagramNode title="Function-level" tone="teal">Best when one component/Hook needs an exception or controlled experiment.</DiagramNode>
  <DiagramNode title="Module-level" tone="purple">Affects a broader file surface; use intentionally because blast radius is larger.</DiagramNode>
</DiagramGrid>

## Compiler diagnostics belong before rollout expansion

Modern `eslint-plugin-react-hooks` exposes Rules-of-React and Compiler-related diagnostics.

<LifecycleBar items={[
  { label: 'Lint finds violation / incompatible pattern', tone: 'red' },
  { label: 'Understand the correctness issue', tone: 'orange' },
  { label: 'Fix or isolate', tone: 'blue' },
  { label: 'Compiler coverage increases safely', tone: 'green' },
]} />

Do not add `'use no memo'` merely to silence a correctness bug.

## Gating and staged exposure

A production rollout may enable Compiler output for a controlled user, route, package, or deployment segment depending on the surrounding build/deployment architecture.

<VisualDiagram title="Rollout control should separate build readiness from user exposure">
  <DiagramRow>
    <DiagramNode title="Compiler-enabled build" tone="purple" />
    <DiagramArrow direction="right" label="gating / release policy" />
    <DiagramNode title="Controlled exposure" tone="orange" />
    <DiagramArrow direction="right" label="observe" />
    <DiagramNode title="Broader rollout" tone="green" />
  </DiagramRow>
</VisualDiagram>

The exact gating mechanism depends on framework and deployment tooling.

## Do not use directives to fight conventions

If a component is misnamed or a Hook does not follow React conventions, fix the design rather than forcing compilation with directives.

The goal is maintainable React code that tooling can understand naturally.

## Preserve manual memoization during migration

Do not combine “enable Compiler” and “remove every `useMemo`/`useCallback`/`memo`” into one change.

Split them:

1. enable Compiler;
2. verify behavior and diagnostics;
3. measure performance;
4. remove manual memoization separately where justified.

This makes regressions easier to isolate.

## Decision guide

<DecisionTree
  question="Which rollout strategy fits the codebase?"
  items={[
    { label: 'Modern codebase with strong Rules-of-React compliance', value: 'Start with normal infer-mode integration' },
    { label: 'Large legacy codebase / cautious adoption', value: 'Use lint + smaller scopes or annotation mode' },
    { label: 'One incompatible component/library bridge', value: 'Temporarily opt out narrowly' },
    { label: 'Need confidence before full exposure', value: 'Use release gating + profiling/observability' },
  ]}
/>

## Production rollout checklist

- current compiler/plugin versions are pinned;
- eslint diagnostics are active in CI;
- migration scope is explicit;
- existing manual memoization is preserved initially;
- tests cover behavior across compiled paths;
- production monitoring can compare releases;
- opt-outs have documented reasons;
- rollout can be narrowed without reverting unrelated product work.

## Common mistakes

- enabling broad compilation and deleting manual memoization in the same change;
- adding `'use memo'` everywhere;
- using `'use no memo'` to hide impure code;
- skipping ESLint diagnostics;
- assuming Compiler coverage equals performance success;
- rolling out without a comparison or rollback path.

## Interview questions

**Junior:** What does `'use memo'` do?

**Mid-level:** Why might annotation mode be useful in a mature codebase?

**Senior:** Design a Compiler migration plan for a legacy application with third-party libraries, manual memoization, CI linting, and gradual production exposure.

## Summary

<VisualDiagram title="Compiler adoption is a controlled correctness-and-performance rollout">
  <DiagramRow>
    <DiagramNode title="Rules-compliant code" tone="blue" />
    <DiagramArrow direction="right" label="configure" />
    <DiagramNode title="Compiler scope" tone="purple" />
    <DiagramArrow direction="right" label="test + profile + gate" />
    <DiagramNode title="Safe production expansion" tone="green" />
  </DiagramRow>
</VisualDiagram>

## References

- https://react.dev/reference/react-compiler
- https://react.dev/reference/react-compiler/directives
- https://react.dev/reference/react-compiler/compiling-libraries
- https://react.dev/reference/eslint-plugin-react-hooks
