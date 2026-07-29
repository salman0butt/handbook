---
title: Purity, Immutability, and Render Safety
description: The Rules of React for pure rendering, immutable snapshots, stable component identity, refs, and side effects.
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

# Purity, immutability, and render safety

The Rules of React are correctness constraints, not optional style advice.

They matter because React may render more than once, interrupt or abandon work, render on the server, hydrate on the client, and automatically memoize code with React Compiler.

## Components and Hooks must be pure

<VisualDiagram title="Render is a calculation from immutable inputs">
  <DiagramRow>
    <DiagramNode title="Inputs" tone="blue">props · state · context</DiagramNode>
    <DiagramArrow direction="right" label="pure render" />
    <DiagramNode title="UI description" tone="green">JSX / React elements</DiagramNode>
  </DiagramRow>
</VisualDiagram>

For the same inputs, rendering should produce the same result. React calls this idempotence.

Bad:

```jsx
function ClockLabel() {
  const now = Date.now();
  return <span>{now}</span>;
}
```

`Date.now()`, `Math.random()`, and similar changing values during render can create retry differences, hydration mismatches, broken memoization assumptions, and unpredictable tests.

## Render and commit are different phases

<VisualDiagram title="Not every render attempt commits">
  <LifecycleBar items={[
    { label: 'Update triggers work', tone: 'blue' },
    { label: 'Render calculates next UI', tone: 'purple' },
    { label: 'React may restart / discard', tone: 'orange' },
    { label: 'Chosen result commits', tone: 'green' },
    { label: 'Refs attach + Effects run later', tone: 'teal' },
  ]} />
</VisualDiagram>

Your component function participates in render. External mutation belongs outside render.

## Side effects must not run during render

Bad:

```jsx
function AnalyticsCard({ event }) {
  analytics.track(event);
  return <Card />;
}
```

If React retries or abandons that render, the external effect already happened.

<DecisionTree
  question="Why should this side effect happen?"
  items={[
    { label: 'User explicitly clicked/submitted/dragged', value: 'Event handler / Action' },
    { label: 'Committed UI must synchronize with an external system', value: 'Effect when needed' },
    { label: 'Only calculating JSX/derived data', value: 'Keep it in render with no side effect' },
  ]}
/>

## Props and state are immutable snapshots

Never mutate a prop:

```jsx
function UserCard({ user }) {
  user.name = 'Changed'; // wrong
  return <p>{user.name}</p>;
}
```

Create a new value instead:

```jsx
const displayUser = {
  ...user,
  name: user.name.toUpperCase(),
};
```

State follows the same rule.

Bad:

```jsx
items.push(newItem);
setItems(items);
```

Good:

```jsx
setItems(items => [...items, newItem]);
```

<VisualDiagram title="A render owns a snapshot; updates create the next snapshot">
  <DiagramRow>
    <DiagramNode title="Snapshot A" tone="blue">Do not mutate</DiagramNode>
    <DiagramArrow direction="right" label="state update" />
    <DiagramNode title="Snapshot B" tone="green">New value / identity</DiagramNode>
  </DiagramRow>
</VisualDiagram>

Mutating old snapshots behind React's back breaks reasoning about identity and makes concurrent/retried work unsafe.

## Hook arguments and return values should be treated as immutable

Values passed into Hooks participate in Hook contracts. Do not mutate values after passing them to a Hook when that Hook may rely on their identity/content.

Likewise, do not mutate data returned by Hooks unless the API explicitly documents it as mutable, such as a ref object's `.current` outside render-sensitive usage.

## Values should not be mutated after being used in JSX

Once a value has contributed to a React element description, treat that render's value as fixed.

```jsx
const styles = { color: 'red' };
const element = <div style={styles}>Hello</div>;
// mutating styles after this point creates ambiguous ownership
```

Prefer constructing the final value before creating JSX.

## Local mutation can be safe

Mutation created and consumed entirely inside one render is often fine because no previous render or external owner can observe it.

```jsx
function List({ items }) {
  const rows = [];

  for (const item of items) {
    rows.push(<li key={item.id}>{item.name}</li>);
  }

  return <ul>{rows}</ul>;
}
```

The array is new for this render and does not mutate props/state/shared module data.

<DiagramGrid columns={2}>
  <DiagramNode title="Local mutation" tone="green">Fresh local array/object created during this render and not shared.</DiagramNode>
  <DiagramNode title="Shared mutation" tone="red">Props, state, module globals, cached shared objects, or values another render can observe.</DiagramNode>
</DiagramGrid>

## Refs are an escape hatch, not render state

Refs are mutable, but render should not depend on arbitrary reads/writes of `.current` as if it were reactive state.

<VisualDiagram title="State and refs have different ownership contracts">
  <DiagramGrid columns={2}>
    <DiagramNode title="State" tone="blue">Snapshot participates in rendering; setters schedule future renders.</DiagramNode>
    <DiagramNode title="Ref" tone="orange">Mutable imperative storage; changing `.current` does not schedule render.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Use refs for DOM nodes, timers, external instances, and other imperative values—not hidden UI state.

## Stable component identity matters

Do not define a component inside another component's render just to create it dynamically:

```jsx
function Parent() {
  function Child() {
    return <div />;
  }

  return <Child />;
}
```

That creates a new component type during each render and can reset state or confuse optimization.

Prefer module-scope component definitions.

## React calls Components and Hooks

Call components through JSX and Hooks through normal Hook composition. Do not invoke component functions manually as arbitrary utilities.

<VisualDiagram title="React must remain the owner of component and Hook execution">
  <DiagramRow>
    <DiagramNode title="Your code" tone="blue">JSX + custom Hook calls</DiagramNode>
    <DiagramArrow direction="right" label="describes structure" />
    <DiagramNode title="React" tone="purple">Controls render order, state slots, retries, scheduling</DiagramNode>
    <DiagramArrow direction="right" label="commits" />
    <DiagramNode title="Host UI" tone="green" />
  </DiagramRow>
</VisualDiagram>

## Why purity unlocks modern React

Purity is what allows React to safely:

- retry rendering;
- interrupt low-priority work;
- abandon obsolete renders;
- prerender/server-render deterministically;
- hydrate matching output;
- memoize with React Compiler;
- run Strict Mode development checks.

<VisualDiagram title="Purity creates scheduling and optimization freedom">
  <DiagramStack align="center">
    <DiagramNode title="Pure restartable render" tone="blue" />
    <DiagramArrow label="React can safely" />
    <DiagramGrid columns={4}>
      <DiagramNode title="Retry" tone="purple" />
      <DiagramNode title="Interrupt" tone="orange" />
      <DiagramNode title="Server render" tone="teal" />
      <DiagramNode title="Memoize" tone="green" />
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

## Common mistakes

- calling changing APIs such as `Date.now()` directly during render;
- mutating props or state;
- writing localStorage/network/analytics during render;
- using refs as hidden reactive state;
- defining component types dynamically in render;
- manually calling component functions;
- assuming render executes once and therefore side effects are safe.

## Debugging rule

When behavior seems impossible, ask whether some code broke the snapshot model or mutated the outside world during render.

<DecisionTree
  question="What kind of bug are you seeing?"
  items={[
    { label: 'Hydration differs server vs client', value: 'Check nondeterministic render inputs' },
    { label: 'UI fails to update after mutation', value: 'Check state/prop immutability' },
    { label: 'Duplicate external side effect', value: 'Check side effects during render' },
    { label: 'State resets unexpectedly', value: 'Check component type/key/position identity' },
  ]}
/>

## Interview questions

**Junior:** What does it mean for a React component to be pure?

**Mid-level:** Why is mutating state directly incompatible with React's snapshot model?

**Senior:** Explain how purity enables concurrency, SSR/hydration, Strict Mode, and React Compiler optimization.

## Summary

<VisualDiagram title="Render should be restartable and discardable">
  <DiagramRow>
    <DiagramNode title="Immutable inputs" tone="blue" />
    <DiagramArrow direction="right" label="pure calculation" />
    <DiagramNode title="JSX description" tone="purple" />
    <DiagramArrow direction="right" label="React chooses commit" />
    <DiagramNode title="External world changes later" tone="green" />
  </DiagramRow>
</VisualDiagram>

## References

- https://react.dev/reference/rules
- https://react.dev/reference/rules/components-and-hooks-must-be-pure
- https://react.dev/learn/keeping-components-pure
