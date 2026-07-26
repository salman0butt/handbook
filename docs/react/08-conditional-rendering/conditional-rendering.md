---
title: Conditional Rendering
description: Learn if statements, early returns, ternaries, logical AND, conditional variables, and identity pitfalls in React.
sidebar_position: 1
---

import {
  VisualDiagram,
  DiagramStack,
  DiagramGrid,
  DiagramNode,
  DiagramArrow,
  DecisionTree,
  LifecycleBar,
} from '@site/src/components/handbook/VisualDiagram'

# Conditional rendering

React does not invent a special template language for conditions. You use JavaScript to decide which JSX should be returned.

## The core model

<VisualDiagram title="Conditional rendering = JavaScript choosing UI">
  <LifecycleBar
    items={[
      { label: 'Current props + state', tone: 'blue' },
      { label: 'JavaScript condition', tone: 'purple' },
      { label: 'Choose JSX', tone: 'cyan' },
      { label: 'React renders that result', tone: 'green' },
    ]}
  />
</VisualDiagram>

## `if` statements

Use an `if` when it makes the branch easiest to understand.

```jsx
function AccountPage({user}) {
  if (!user) {
    return <LoginPrompt />;
  }

  return <Dashboard user={user} />;
}
```

Early returns are especially useful for:

- loading states;
- errors;
- permission guards;
- empty states;
- mutually exclusive screen modes.

## Ternary expressions

Use a ternary when choosing between two expressions.

```jsx
<p>{isOnline ? 'Online' : 'Offline'}</p>
```

For larger branches:

```jsx
return isEditing ? (
  <EditForm product={product} />
) : (
  <ProductSummary product={product} />
);
```

If nesting ternaries makes the code hard to scan, use variables, helper functions, or separate components.

## Logical AND

For optional UI:

```jsx
{error && <p role="alert">{error}</p>}
```

This means: render the right side when the left side is truthy.

## The `0` pitfall

JavaScript returns the left operand when `&&` short-circuits.

```jsx
{items.length && <CartItems items={items} />}
```

If `items.length` is `0`, React can render `0`.

Prefer an explicit boolean:

```jsx
{items.length > 0 && <CartItems items={items} />}
```

<VisualDiagram title="Why the `0` pitfall happens" compact>
  <DiagramGrid columns={2}>
    <DiagramNode title="items.length === 0" tone="orange">`0 && <List />` evaluates to `0`.</DiagramNode>
    <DiagramNode title="items.length > 0" tone="green">Explicit boolean evaluates to `false`, so nothing is rendered.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Conditional variables

When markup becomes noisy, calculate the branch first.

```jsx
function Status({status}) {
  let content;

  if (status === 'loading') {
    content = <Spinner />;
  } else if (status === 'error') {
    content = <ErrorMessage />;
  } else {
    content = <Results />;
  }

  return <section>{content}</section>;
}
```

This is often clearer than deeply nested JSX expressions.

## Extracting components

If a branch has its own responsibility, extract it.

```jsx
function Checkout({status}) {
  if (status === 'success') {
    return <OrderConfirmation />;
  }

  return <CheckoutForm />;
}
```

A branch is a good component boundary when it has meaningful behavior, state, or domain responsibility—not simply because it contains many lines.

## Returning nothing

A component can return `null` when it should render nothing.

```jsx
function AdminBadge({isAdmin}) {
  if (!isAdmin) return null;

  return <span>Admin</span>;
}
```

Use this deliberately. Sometimes keeping the condition in the parent makes visibility rules easier to see.

## Conditions and state identity

Conditional rendering can preserve or reset state depending on the resulting tree.

```jsx
{mode === 'compact'
  ? <Profile compact />
  : <Profile compact={false} />}
```

The same `Profile` component type occupies the same position, so its state can be preserved.

But:

```jsx
{editing ? <EditForm /> : <Preview />}
```

switches component types, so state for the replaced subtree is reset.

This is an identity issue, not a special rule about ternaries.

<VisualDiagram title="Conditional branches can preserve or reset state">
  <DiagramGrid columns={2}>
    <DiagramNode title="Same type + same position" tone="green">Profile ↔ Profile → identity can be preserved.</DiagramNode>
    <DiagramNode title="Different component type" tone="red">EditForm ↔ Preview → old subtree state is replaced.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Model states, not boolean combinations

Conditional rendering becomes easier when state represents valid UI modes.

Hard to reason about:

```jsx
if (isLoading && !hasError && !isSuccess) { ... }
```

Clearer:

```jsx
if (status === 'loading') { ... }
if (status === 'error') { ... }
if (status === 'success') { ... }
```

<VisualDiagram title="Model explicit UI modes" compact>
  <LifecycleBar
    items={[
      { label: 'idle', tone: 'slate' },
      { label: 'loading', tone: 'blue' },
      { label: 'success / error', tone: 'green' },
    ]}
  />
</VisualDiagram>

Good state structure and good conditional rendering reinforce each other.

## Accessibility considerations

When conditional UI appears or disappears:

- keep focus behavior intentional;
- use semantic elements;
- use `role="alert"` or live regions only when appropriate;
- do not hide critical information only visually;
- ensure keyboard users can reach newly available actions.

Example error:

```jsx
{error && <p role="alert">{error}</p>}
```

## Common mistakes

### Nested ternary chains

```jsx
{a ? <A /> : b ? <B /> : c ? <C /> : <D />}
```

This may be valid but difficult to maintain.

### Hiding state transitions inside markup

If the UI has real modes, model them explicitly rather than scattering boolean expressions throughout JSX.

### Using `&&` with numbers accidentally

Convert to an explicit boolean condition.

### Assuming hiding always preserves state

Ordinary conditional removal can remove a subtree and its state. Later, React 19.2 `<Activity>` provides a different model for hiding UI while preserving state and changing effect behavior; that belongs in the modern React section.

## Production example

```jsx
function OrdersPanel({status, orders, error}) {
  if (status === 'loading') {
    return <OrdersSkeleton />;
  }

  if (status === 'error') {
    return <ErrorPanel message={error} />;
  }

  if (orders.length === 0) {
    return <EmptyOrders />;
  }

  return <OrdersTable orders={orders} />;
}
```

Each state is explicit and each branch has one clear responsibility.

<DecisionTree
  question="Which branch should OrdersPanel render?"
  items={[
    { label: 'status = loading', value: 'OrdersSkeleton' },
    { label: 'status = error', value: 'ErrorPanel' },
    { label: 'orders.length = 0', value: 'EmptyOrders' },
    { label: 'otherwise', value: 'OrdersTable' },
  ]}
/>

## Exercise

Build a file uploader with these UI modes:

<VisualDiagram title="Uploader workflow states" compact>
  <LifecycleBar
    items={[
      { label: 'idle', tone: 'slate' },
      { label: 'selecting', tone: 'blue' },
      { label: 'uploading', tone: 'orange' },
      { label: 'success / error', tone: 'green' },
    ]}
  />
</VisualDiagram>

Do not use five independent boolean state variables. Model the workflow and render the correct UI for each state.

## Interview questions

**Junior:** What options can you use for conditional rendering in React?

**Mid-level:** Why can `{count && <Badge />}` render an unexpected `0`?

**Senior:** How can conditional rendering change component identity and state preservation?

## Summary

Use ordinary JavaScript to choose UI. Prefer the clearest control flow, model UI modes explicitly, and remember that branch structure can affect component identity.

## References

- https://react.dev/learn/conditional-rendering
- https://react.dev/learn/preserving-and-resetting-state

## Next

Continue with **[Lists and Keys](../09-lists/lists-and-keys.md)**.
