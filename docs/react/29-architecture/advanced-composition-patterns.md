---
title: Advanced Composition Patterns
description: Compound components, controlled/uncontrolled APIs, render props, reducers, state machines, adapters, and pattern tradeoffs in modern React.
sidebar_position: 3
---

# Advanced Composition Patterns

Patterns are tools for recurring design problems.

They are not goals by themselves.

A useful pattern should improve at least one of these:

- ownership;
- composition;
- reuse;
- testability;
- API clarity;
- isolation of complexity.

If a pattern adds ceremony without solving a real problem, do not use it.

## Prefer plain composition first

Before introducing a special pattern, try ordinary children and props.

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

This is often enough.

## Compound components

Compound components expose several coordinated child components under one conceptual API.

```jsx
<Menu>
  <Menu.Trigger>Account</Menu.Trigger>
  <Menu.Content>
    <Menu.Item>Profile</Menu.Item>
    <Menu.Item>Log out</Menu.Item>
  </Menu.Content>
</Menu>
```

They are useful when:

- structure should remain flexible;
- children share implicit state;
- the library owns keyboard/focus semantics;
- the consumer owns composition.

## Internal Context for coordination

A `Menu` can provide internal state:

```text
Menu
 ├── Trigger
 └── Content
      ├── Item
      └── Item
```

The Context might contain:

```ts
{
  open,
  setOpen,
  activeItem,
  registerItem
}
```

Keep this internal if it is an implementation detail.

The public API should remain the components and documented props.

## Controlled + uncontrolled pattern

Reusable primitives often support both ownership models.

```jsx
function Toggle({
  pressed,
  defaultPressed = false,
  onPressedChange,
}) {
  const [internal, setInternal] = useState(defaultPressed);
  const isControlled = pressed !== undefined;
  const value = isControlled ? pressed : internal;

  function setValue(next) {
    if (!isControlled) setInternal(next);
    onPressedChange?.(next);
  }

  return (
    <button
      aria-pressed={value}
      onClick={() => setValue(!value)}
    />
  );
}
```

Important rule:

> Decide ownership at the component instance level and keep it stable.

Switching between controlled and uncontrolled modes during the component lifetime is usually a bug.

## Reducer-based state machines

When interactions have meaningful transitions, model actions explicitly.

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

This prevents impossible boolean combinations such as:

```text
isOpen = true
isClosing = true
isOpening = true
```

Reducers are useful when state transitions are part of the domain.

## State reducer pattern

Some reusable libraries let consumers customize transitions by providing a reducer-like callback.

Conceptually:

```jsx
<Toggle
  stateReducer={(state, action, nextState) => {
    if (action.type === 'toggle' && state.locked) {
      return state;
    }

    return nextState;
  }}
/>
```

This can be powerful, but it increases API complexity.

Use it only when consumers genuinely need controlled transition customization.

## Render props

Render props pass a function that receives state/behavior.

```jsx
<MousePosition>
  {({ x, y }) => (
    <Coordinates x={x} y={y} />
  )}
</MousePosition>
```

Hooks replaced many old render-prop use cases, but the pattern is still useful when the render structure itself is part of the API.

Example headless component:

```jsx
<DataLoader>
  {({ data, pending, error }) => {
    if (pending) return <Spinner />;
    if (error) return <ErrorView />;
    return <Chart data={data} />;
  }}
</DataLoader>
```

## Hooks vs render props

Prefer a custom Hook when consumers need reusable behavior:

```js
const { x, y } = useMousePosition();
```

Prefer a render prop when a component owns lifecycle/structure and needs consumers to render a region based on supplied state.

## Higher-order components

HOCs wrap one component and return another.

```js
const Enhanced = withPermissions(Component);
```

Modern React usually favors Hooks and composition for new code.

But HOCs remain important for:

- maintaining older codebases;
- framework integrations;
- library APIs built around wrapper composition.

Understand them even if you do not choose them first.

## Adapter components

Adapters isolate third-party API details.

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

Benefits:

- product code uses domain language;
- third-party replacement becomes easier;
- configuration lives in one place;
- tests can mock one adapter boundary.

This is one of the most practical patterns in large applications.

## Provider adapters

Wrap vendor-specific providers too.

Instead of every feature importing a vendor SDK:

```text
Feature
 → Analytics SDK
```

create:

```text
Feature
 → app analytics API
 → vendor adapter
```

Now the application controls the contract.

## Headless behavior + styled presentation

Separate behavior from visuals when multiple presentations reuse the same interaction model.

```text
useSelectState
   ↓
Headless Select behavior
   ↓
Brand A Select
Brand B Select
```

Do not split merely because “headless” is fashionable.

The separation should enable real reuse.

## Slot APIs

Slots let consumers place content into named regions.

Simple React composition is often enough:

```jsx
<PageLayout
  sidebar={<Sidebar />}
  header={<Header />}
>
  <Content />
</PageLayout>
```

Explicit slot props are useful when layout owns fixed regions.

## Children-as-API

`children` can be a strong abstraction when the component owns surrounding behavior but not content.

Examples:

- Error Boundary shell;
- Suspense wrapper;
- modal surface;
- provider;
- layout region.

Avoid cloning arbitrary children to inject hidden behavior unless the contract is extremely clear.

## Clone-element pattern

`cloneElement` can modify a React element supplied by a consumer.

This pattern can be fragile because it depends on child shape and prop merging.

Prefer:

- Context;
- render props;
- explicit props;
- slot primitives;

when those produce clearer contracts.

## Callback refs as composition tools

Callback refs are useful when a primitive must coordinate DOM ownership.

```jsx
function setNode(node) {
  internalRef.current = node;
  externalRef?.(node);
}
```

A reusable component may need to merge an internal ref with a consumer ref.

In React 19, callback ref cleanup can return a cleanup function.

Be deliberate with ref composition because it crosses declarative/imperative boundaries.

## Dependency injection with Context

Context can inject an implementation into a subtree.

Example:

```jsx
<AnalyticsProvider client={analyticsClient}>
  <Checkout />
</AnalyticsProvider>
```

The feature reads an abstract interface rather than importing a global singleton.

This can improve testing and multi-tenant configuration.

Context is acting as dependency propagation, not necessarily state storage.

## Inversion of control

A reusable primitive becomes more flexible when consumers control selected aspects.

Example:

```jsx
<Table
  rows={rows}
  renderRow={(row) => <OrderRow order={row} />}
/>
```

The table owns collection mechanics.

The product owns row rendering.

Too much inversion, however, can make the component an empty abstraction.

## Colocation vs centralization

Patterns should respect change boundaries.

Colocate:

- feature-specific reducers;
- feature-specific Hooks;
- feature-specific adapters;
- feature-specific tests.

Centralize:

- stable shared design primitives;
- cross-cutting infrastructure;
- genuinely shared domain contracts.

Do not centralize code just because two files currently look similar.

## Pattern selection guide

### Need reusable behavior?

Use a custom Hook.

### Need flexible coordinated structure?

Consider compound components.

### Need parent-owned or internal ownership modes?

Controlled/uncontrolled pattern.

### Need explicit state transitions?

Reducer/state-machine model.

### Need to isolate a vendor?

Adapter component/module.

### Need consumer-controlled rendering?

Composition/render prop/slot.

### Maintaining older wrapper-based abstractions?

Understand HOCs.

## Performance implications

Patterns change update boundaries.

Example compound Context:

```text
Menu Context value changes
   ↓
all consumers may render
```

If the primitive has many high-frequency consumers, split state or use narrower subscriptions where appropriate.

Do not assume a pattern is performance-neutral.

## Avoid pattern stacking

A component using:

- HOC;
- render prop;
- compound Context;
- state reducer;
- controlled API;
- slot system;

all at once may be technically flexible but impossible to learn.

Start with the smallest contract that solves today's requirements.

## Public API test

Before publishing a pattern-heavy component, ask:

1. Can a consumer understand it from one example?
2. Are ownership rules obvious?
3. Are invalid states difficult to express?
4. Does TypeScript guide correct usage?
5. Is accessibility built in?
6. Can implementation change without breaking consumers?
7. Does the abstraction reduce code at call sites?

If not, the pattern may be over-designed.

## Exercise

Design a reusable data table that supports:

- controlled sorting;
- uncontrolled column visibility;
- custom cell rendering;
- row selection;
- pagination owned by the URL;
- virtualization;
- server data loading;
- accessible keyboard navigation.

Choose which responsibilities belong in:

- the table primitive;
- a custom Hook;
- a feature adapter;
- URL state;
- server state.

Explain which advanced patterns you intentionally **do not** use.

## Interview questions

### When are compound components useful?

When several coordinated child components need shared behavior/state while consumers need flexible composition and structure.

### Why are Hooks often preferred over HOCs in new code?

Hooks compose behavior directly without adding wrapper components or prop injection layers, though HOCs remain valid in legacy/library contexts.

### What is the adapter pattern useful for in React?

It isolates third-party APIs behind an application-owned contract, reducing vendor coupling and centralizing configuration/lifecycle concerns.

### What is the biggest risk of advanced patterns?

Over-abstraction: flexible APIs can become harder to understand, type, debug, and maintain than the problem they solve.
