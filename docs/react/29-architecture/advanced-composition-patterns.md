---
title: Advanced Composition Patterns
description: Compound components, controlled/uncontrolled APIs, render props, reducers, state machines, adapters, and pattern tradeoffs in modern React.
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

# Advanced Composition Patterns

Patterns are tools for recurring design problems. Use them only when they improve **ownership, composition, reuse, testability, API clarity, or isolation of complexity**.

## Prefer plain composition first

```jsx
function Panel({ title, children }) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
```

<DecisionTree
  question="Do you need a more advanced pattern?"
  items={[
    { label: 'Children + props express the API clearly', value: 'Keep ordinary composition' },
    { label: 'Several children coordinate one interaction model', value: 'Consider compound components' },
    { label: 'Consumers need reusable stateful behavior', value: 'Consider a custom Hook' },
    { label: 'Consumers need to customize transitions', value: 'Consider reducer/state-machine patterns' },
    { label: 'A vendor/runtime contract should be isolated', value: 'Use an adapter boundary' },
  ]}
/>

## Compound components

```jsx
<Menu>
  <Menu.Trigger>Account</Menu.Trigger>
  <Menu.Content>
    <Menu.Item>Profile</Menu.Item>
    <Menu.Item>Log out</Menu.Item>
  </Menu.Content>
</Menu>
```

<VisualDiagram title="Compound components coordinate implicit shared behavior">
  <DiagramStack>
    <DiagramNode title="Menu root" tone="blue">owns open state + public contract</DiagramNode>
    <DiagramArrow label="internal Context" />
    <DiagramGrid columns={3}>
      <DiagramNode title="Trigger" tone="cyan">activation + aria state</DiagramNode>
      <DiagramNode title="Content" tone="purple">presence + focus scope</DiagramNode>
      <DiagramNode title="Items" tone="green">selection + keyboard navigation</DiagramNode>
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

Keep internal coordination private when consumers do not need it.

## Controlled and uncontrolled APIs

```jsx
function Toggle({ pressed, defaultPressed = false, onPressedChange }) {
  const [internal, setInternal] = useState(defaultPressed);
  const isControlled = pressed !== undefined;
  const value = isControlled ? pressed : internal;

  function setValue(next) {
    if (!isControlled) setInternal(next);
    onPressedChange?.(next);
  }

  return <button aria-pressed={value} onClick={() => setValue(!value)} />;
}
```

<VisualDiagram title="Ownership should stay stable for the component instance">
  <DiagramRow>
    <DiagramNode title="Controlled" tone="blue">Parent owns value</DiagramNode>
    <DiagramArrow direction="right" label="or" />
    <DiagramNode title="Uncontrolled" tone="green">Component owns value</DiagramNode>
  </DiagramRow>
</VisualDiagram>

Switching between the two modes during the same lifetime is usually a bug.

## Reducers model explicit transitions

```ts
type State =
  | { status: 'closed' }
  | { status: 'opening' }
  | { status: 'open' }
  | { status: 'closing' };

type Action =
  | { type: 'OPEN' }
  | { type: 'OPENED' }
  | { type: 'CLOSE' }
  | { type: 'CLOSED' };
```

<VisualDiagram title="State machine thinking prevents contradictory booleans">
  <LifecycleBar items={[
    { label: 'closed', tone: 'slate' },
    { label: 'opening', tone: 'cyan' },
    { label: 'open', tone: 'green' },
    { label: 'closing', tone: 'orange' },
  ]} />
</VisualDiagram>

The value of a reducer is not that it stores several fields; it is that **events and transitions become explicit**.

## State reducer pattern

Some reusable libraries allow consumers to intercept a proposed transition:

```jsx
<Toggle
  stateReducer={(state, action, nextState) => {
    if (action.type === 'toggle' && state.locked) return state;
    return nextState;
  }}
/>
```

<VisualDiagram title="State reducer extension point">
  <DiagramRow>
    <DiagramNode title="Internal event" tone="blue">toggle</DiagramNode>
    <DiagramArrow direction="right" label="proposes" />
    <DiagramNode title="Next state" tone="cyan">default transition</DiagramNode>
    <DiagramArrow direction="right" label="consumer policy" />
    <DiagramNode title="Accepted state" tone="green">customized result</DiagramNode>
  </DiagramRow>
</VisualDiagram>

This is powerful but creates a much larger public API surface. Use it only when transition customization is a real requirement.

## Hooks vs render props

<DecisionTree
  question="What is being reused?"
  items={[
    { label: 'Stateful behavior without owning render structure', value: 'Custom Hook' },
    { label: 'A component owns lifecycle/structure and caller renders a region', value: 'Render prop can fit' },
    { label: 'Only static structure differs', value: 'Children/composition is usually simpler' },
  ]}
/>

```js
const { x, y } = useMousePosition();
```

```jsx
<DataLoader>
  {({ data, pending, error }) => {
    if (pending) return <Spinner />;
    if (error) return <ErrorView />;
    return <Chart data={data} />;
  }}
</DataLoader>
```

Hooks replaced many historical render-prop use cases, but render props are still valid when render structure itself is part of the API.

## Higher-order components

```js
const Enhanced = withPermissions(Component);
```

HOCs still matter in older codebases and some library/framework APIs. For new application architecture, Hooks and composition are often easier to type, debug, and compose.

## Adapter components isolate vendor APIs

```jsx
function ProductChart({ points }) {
  return (
    <ThirdPartyChart
      series={[{ data: points }]}
      animation={false}
    />
  );
}
```

<VisualDiagram title="Keep vendor details behind an application-owned contract">
  <DiagramRow>
    <DiagramNode title="Feature" tone="blue">domain language</DiagramNode>
    <DiagramArrow direction="right" label="depends on" />
    <DiagramNode title="App adapter" tone="green">stable contract</DiagramNode>
    <DiagramArrow direction="right" label="translates" />
    <DiagramNode title="Vendor SDK" tone="orange">third-party API</DiagramNode>
  </DiagramRow>
</VisualDiagram>

The same pattern works for analytics, payments, maps, editors, and provider components.

## Headless behavior + styled presentation

<VisualDiagram title="Separate interaction rules from visual presentation when reuse demands it">
  <DiagramStack>
    <DiagramNode title="Headless behavior" tone="blue">state · keyboard · focus · ARIA · events</DiagramNode>
    <DiagramArrow label="exposes contract" />
    <DiagramGrid columns={2}>
      <DiagramNode title="Presentation A" tone="purple">product design</DiagramNode>
      <DiagramNode title="Presentation B" tone="green">another theme/product</DiagramNode>
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

Do not split behavior and presentation mechanically. Separation is valuable when multiple presentations genuinely share the same interaction contract.

## Pattern selection checklist

<DecisionTree
  question="What problem are you solving?"
  items={[
    { label: 'Coordinate related child primitives', value: 'Compound components + private Context' },
    { label: 'Offer parent-owned or self-owned value', value: 'Controlled/uncontrolled API' },
    { label: 'Model complex transitions', value: 'Reducer/state machine' },
    { label: 'Reuse stateful behavior', value: 'Custom Hook' },
    { label: 'Isolate third-party implementation', value: 'Adapter component/provider' },
    { label: 'No recurring problem yet', value: 'Use plain React composition' },
  ]}
/>

## Architectural rule

<LifecycleBar items={[
  { label: 'Start explicit', tone: 'blue' },
  { label: 'Observe repetition', tone: 'cyan' },
  { label: 'Name the shared concept', tone: 'purple' },
  { label: 'Choose the smallest pattern', tone: 'orange' },
  { label: 'Test the public contract', tone: 'green' },
]} />

A pattern earns its complexity when it makes ownership and change easier to reason about than the simpler code it replaces.
