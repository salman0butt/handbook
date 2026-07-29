---
title: Rules of Hooks and Compiler-Aware ESLint
description: Master Hook ordering, the special use API exception, and the modern eslint-plugin-react-hooks rule set used by React Compiler.
sidebar_position: 2
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

# Rules of Hooks and Compiler-aware ESLint

React relies on Hook call order to associate Hook state with a component across renders.

> Call normal Hooks at the top level of React function components and custom Hooks.

## Hook order is identity

<VisualDiagram title="Every render must preserve the same Hook slot sequence">
  <DiagramGrid columns={2}>
    <DiagramNode title="Render 1" tone="blue">
      slot 1 → useState<br />slot 2 → useEffect<br />slot 3 → useMemo
    </DiagramNode>
    <DiagramNode title="Render 2" tone="green">
      slot 1 → useState<br />slot 2 → useEffect<br />slot 3 → useMemo
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

If a Hook disappears conditionally, later slots shift and React can no longer associate the right state/effect with the right call site.

## Invalid: conditional Hook

```jsx
function Profile({ enabled }) {
  if (enabled) {
    const [name, setName] = useState(''); // wrong
  }

  return null;
}
```

Better:

```jsx
function Profile({ enabled }) {
  const [name, setName] = useState('');

  if (!enabled) {
    return null;
  }

  return <input value={name} onChange={e => setName(e.target.value)} />;
}
```

<VisualDiagram title="Condition the behavior, not the Hook call">
  <DiagramRow>
    <DiagramNode title="Stable Hook call" tone="blue">Always allocate slot</DiagramNode>
    <DiagramArrow direction="right" label="then branch" />
    <DiagramNode title="Conditional UI / effect behavior" tone="green" />
  </DiagramRow>
</VisualDiagram>

## Normal Hooks must not move between call positions

Avoid calling them:

- inside `if`/`else` branches;
- inside loops;
- after conditional early returns;
- inside event handlers;
- inside arbitrary callbacks;
- inside class methods;
- at module scope;
- inside arbitrary async functions.

The rule is about **stable React-controlled execution order**.

## Custom Hooks

A custom Hook is a function that follows Hook rules and uses a `use` prefix.

```jsx
function useOnlineStatus() {
  const [online, setOnline] = useState(true);
  return online;
}
```

The prefix is meaningful to both humans and tooling.

<VisualDiagram title="Custom Hooks compose Hook slots; they do not create a separate runtime">
  <DiagramStack align="center">
    <DiagramNode title="Component" tone="blue" />
    <DiagramArrow label="calls" />
    <DiagramNode title="Custom Hook" tone="purple" />
    <DiagramArrow label="composes" />
    <DiagramNode title="Built-in Hooks in stable order" tone="green" />
  </DiagramStack>
</VisualDiagram>

## The special `use` API exception

React's `use` API is special: it may be called conditionally and in loops.

```jsx
function Comments({ shouldLoad, promise }) {
  if (shouldLoad) {
    const comments = use(promise);
    return <CommentList comments={comments} />;
  }

  return null;
}
```

This does **not** make normal Hooks conditional.

<DiagramGrid columns={2}>
  <DiagramNode title="Normal Hooks" tone="blue">`useState`, `useEffect`, `useMemo`, etc. require stable top-level call order.</DiagramNode>
  <DiagramNode title="use(resource)" tone="orange">Special React API with documented conditional/loop usage semantics.</DiagramNode>
</DiagramGrid>

Do not generalize the exception.

## ESLint is part of modern React correctness

`eslint-plugin-react-hooks` does more than enforce the classic Hook rules. Its recommended presets also surface Rules-of-React and React Compiler diagnostics.

```bash
npm install -D eslint-plugin-react-hooks@latest
```

<VisualDiagram title="Linting is the static safety layer before runtime and Compiler">
  <LifecycleBar items={[
    { label: 'Source code', tone: 'blue' },
    { label: 'eslint-plugin-react-hooks', tone: 'purple' },
    { label: 'Rules / Compiler diagnostics', tone: 'orange' },
    { label: 'Fix or isolate', tone: 'teal' },
    { label: 'Safer runtime + Compiler coverage', tone: 'green' },
  ]} />
</VisualDiagram>

The plugin is valuable even if Compiler is not enabled.

## Core rules

### `rules-of-hooks`

Checks Hook locations and ordering.

### `exhaustive-deps`

Checks dependency arrays for dependency-aware Hooks.

Do not silence `exhaustive-deps` just to remove warnings. Dependencies describe which reactive values configure the synchronization process.

## Compiler-aware diagnostics

Current recommended plugin presets include rules covering areas such as:

- component/Hook factories;
- Compiler configuration and gating;
- Error Boundary usage;
- globals and immutability;
- incompatible libraries;
- preservation of manual memoization;
- purity;
- ref usage;
- setting state during render/effects;
- static component definitions;
- unsupported syntax;
- invalid `useMemo` usage.

<VisualDiagram title="Many Compiler diagnostics are correctness diagnostics first">
  <DiagramGrid columns={3}>
    <DiagramNode title="Purity" tone="blue">No impure render-time work</DiagramNode>
    <DiagramNode title="Immutability" tone="purple">Do not mutate React snapshots/shared inputs</DiagramNode>
    <DiagramNode title="Stable structure" tone="teal">Hooks/components stay recognisable and ordered</DiagramNode>
    <DiagramNode title="Refs" tone="orange">Do not use mutable ref values as normal render state</DiagramNode>
    <DiagramNode title="Effects/state" tone="red">Avoid render loops and avoidable sync effect updates</DiagramNode>
    <DiagramNode title="Compiler compatibility" tone="green">Supported syntax/config/library contracts</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Lint first, compile second

A safe Compiler migration path is:

<LifecycleBar items={[
  { label: 'Enable current lint rules', tone: 'blue' },
  { label: 'Understand violations', tone: 'orange' },
  { label: 'Fix incrementally', tone: 'purple' },
  { label: 'Increase Compiler coverage', tone: 'teal' },
  { label: 'Measure behavior + performance', tone: 'green' },
]} />

Do not treat Compiler opt-outs as a substitute for fixing broken Hook ordering or impure rendering.

## Dependency arrays are not scheduling wishes

Wrong mental model:

> “I want this Effect to run once, so I will hide the dependencies.”

Better mental model:

<VisualDiagram title="Dependencies describe the reactive configuration an Effect reads">
  <DiagramRow>
    <DiagramNode title="Reactive values used" tone="blue" />
    <DiagramArrow direction="right" label="must be represented" />
    <DiagramNode title="Dependency list" tone="purple" />
    <DiagramArrow direction="right" label="change? restart sync" />
    <DiagramNode title="Effect lifecycle" tone="green" />
  </DiagramRow>
</VisualDiagram>

If dependencies feel wrong, first ask whether the Effect itself is necessary or whether the code belongs in render/event logic.

## React must call components and Hooks

Do not bypass React's execution ownership by calling component functions manually.

Wrong:

```jsx
const result = SomeComponent(props);
```

Prefer:

```jsx
<SomeComponent {...props} />
```

React needs to own component/Hook execution so it can associate state, scheduling, identity, and error boundaries correctly.

## Decision guide

<DecisionTree
  question="Where should this Hook/API call live?"
  items={[
    { label: 'Normal Hook in component/custom Hook', value: 'Top level before conditional returns' },
    { label: 'Need conditional resource read with use()', value: 'Follow the special use API rules' },
    { label: 'Need a Hook in an event handler', value: 'Move Hook to component/custom Hook; event uses returned value/callback' },
    { label: 'Lint warns about Effect dependencies', value: 'Fix synchronization model instead of hiding dependencies' },
  ]}
/>

## Common mistakes

- calling `useState` or `useEffect` conditionally;
- calling Hooks after an early return;
- calling Hooks from events/callbacks;
- assuming the special `use` exception applies to all Hooks;
- disabling `rules-of-hooks` or `exhaustive-deps` broadly;
- suppressing Compiler diagnostics instead of understanding them;
- manually calling component functions;
- treating lint rules as style-only warnings.

## Team policy

For production codebases:

1. run current `eslint-plugin-react-hooks` in CI;
2. fail builds on new Rules-of-React violations;
3. document narrow exceptions;
4. avoid repo-wide disables;
5. fix the architecture that creates dependency fights;
6. review new custom Hooks for stable call structure and focused responsibility.

## Interview questions

**Junior:** Why must Hooks be called in the same order every render?

**Mid-level:** Why can `use()` be conditional while `useState()` cannot?

**Senior:** Explain how the modern Hooks ESLint plugin supports both React correctness and React Compiler adoption in a large codebase.

## Summary

<VisualDiagram title="Stable calls let React preserve identity across renders">
  <DiagramRow>
    <DiagramNode title="Stable component execution" tone="blue" />
    <DiagramArrow direction="right" label="same Hook order" />
    <DiagramNode title="Stable Hook slots" tone="purple" />
    <DiagramArrow direction="right" label="lint + Compiler can reason" />
    <DiagramNode title="Correct predictable React" tone="green" />
  </DiagramRow>
</VisualDiagram>

## References

- https://react.dev/reference/rules/rules-of-hooks
- https://react.dev/reference/eslint-plugin-react-hooks
- https://react.dev/reference/react/use
- https://react.dev/reference/rules
