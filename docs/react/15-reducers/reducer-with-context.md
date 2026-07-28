---
title: Reducer + Context Architecture
description: Combine useReducer and Context to scale feature state without prop drilling, while keeping providers, actions, selectors, and boundaries intentional.
sidebar_position: 2
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

# Reducer + Context architecture

Reducers centralize **state transition logic**. Context distributes **access** through a subtree.

Together they can form a lightweight feature-state architecture when many descendants need one coherent client-owned state machine.

<VisualDiagram title="Reducer + Context responsibilities">
  <DiagramStack align="center">
    <DiagramNode title="FeatureProvider" tone="blue" wide />
    <DiagramArrow />
    <DiagramGrid columns={3}>
      <DiagramNode title="useReducer" tone="purple" eyebrow="OWNER">owns feature state + transitions</DiagramNode>
      <DiagramNode title="State Context" tone="cyan" eyebrow="READS">distributes current state</DiagramNode>
      <DiagramNode title="Dispatch Context" tone="green" eyebrow="WRITES">distributes stable dispatch</DiagramNode>
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

## Start with local reducer state

Do not introduce Context just because you use a reducer.

```jsx
function CheckoutPage() {
  const [state, dispatch] = useReducer(checkoutReducer, initialState);
  return <CheckoutForm state={state} dispatch={dispatch} />;
}
```

If a small part of the tree needs the data, props may be the clearest API. Context becomes useful when many descendants need the same state/dispatch through otherwise unrelated intermediate layers.

## The feature provider pattern

```jsx
const CartStateContext = createContext(null);
const CartDispatchContext = createContext(null);

export function CartProvider({children}) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  return (
    <CartStateContext value={state}>
      <CartDispatchContext value={dispatch}>
        {children}
      </CartDispatchContext>
    </CartStateContext>
  );
}
```

Consumers can expose feature-specific read/write Hooks:

```jsx
export function useCartState() {
  const state = useContext(CartStateContext);
  if (state === null) throw new Error('useCartState must be used inside CartProvider');
  return state;
}

export function useCartDispatch() {
  const dispatch = useContext(CartDispatchContext);
  if (dispatch === null) throw new Error('useCartDispatch must be used inside CartProvider');
  return dispatch;
}
```

## Why split state and dispatch?

<VisualDiagram title="Read and write subscriptions can be different dependencies">
  <DiagramGrid columns={2}>
    <DiagramNode title="State readers" tone="blue">Need current feature state and can re-render when it changes.</DiagramNode>
    <DiagramNode title="Dispatch-only components" tone="green">Need the stable dispatch function, not the changing state object.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

This improves API clarity and can avoid making dispatch-only components depend on the changing state context.

## Keep reducer logic outside the provider

A provider should compose ownership/distribution, not become a 500-line transition engine.

Literal feature structure can remain simple:

```text
cart/
  CartProvider.jsx
  cartReducer.js
  useCartState.js
  useCartDispatch.js
```

The goal is separation of responsibility, not maximum file count.

## Reducer purity does not change

Combining a reducer with Context does not permit network requests, storage writes, analytics, timers, DOM effects, or mutation inside the reducer.

```jsx
function cartReducer(state, action) {
  switch (action.type) {
    case 'item_added':
      return addItem(state, action.product);
    default:
      throw new Error(`Unknown cart action: ${action.type}`);
  }
}
```

## Async workflows stay outside the reducer

```jsx
async function handleCheckout() {
  dispatch({type: 'submission_started'});

  try {
    const order = await createOrder(state);
    dispatch({type: 'submission_succeeded', orderId: order.id});
  } catch (error) {
    dispatch({type: 'submission_failed', message: error.message});
  }
}
```

<VisualDiagram title="External work surrounds the pure state machine">
  <LifecycleBar
    items={[
      {label: 'UI event', tone: 'orange'},
      {label: 'dispatch started', tone: 'blue'},
      {label: 'async external work', tone: 'cyan'},
      {label: 'dispatch success/failure', tone: 'purple'},
      {label: 'reducer records transition', tone: 'green'},
    ]}
  />
</VisualDiagram>

## Selectors centralize derivation

```js
export function selectCartTotal(state) {
  return state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
}
```

Selectors centralize domain calculations, but reading a selector from Context does **not** create a fine-grained context subscription. The component still reads the state Context value.

## Domain commands as custom Hooks

Consumers do not always need to know raw action shapes.

```jsx
export function useCartActions() {
  const dispatch = useCartDispatch();

  return {
    addItem(product) {
      dispatch({type: 'item_added', product});
    },
    removeItem(productId) {
      dispatch({type: 'item_removed', productId});
    },
  };
}
```

This can create a stronger feature API. Do not add wrappers mechanically; use them when they improve domain meaning or API stability.

## Provider boundaries are part of state architecture

Bad default:

```jsx
<CartProvider>
  <EntireCompanyWebsite />
</CartProvider>
```

Better when only shop routes need cart state:

```jsx
<Route
  path="/shop/*"
  element={
    <CartProvider>
      <Shop />
    </CartProvider>
  }
/>
```

<VisualDiagram title="Provider scope defines state scope" compact>
  <DiagramGrid columns={2}>
    <DiagramNode title="Provider too high" tone="red">Longer lifetime · broader coupling · more unrelated consumers in the environment.</DiagramNode>
    <DiagramNode title="Feature-scoped provider" tone="green">State lifetime and access align with the feature that owns it.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Multiple providers create multiple state instances

```jsx
<CartProvider>
  <StorefrontA />
</CartProvider>

<CartProvider>
  <StorefrontB />
</CartProvider>
```

These are two independent carts.

<VisualDiagram title="Context state is not inherently singleton/global">
  <DiagramGrid columns={2}>
    <DiagramNode title="CartProvider A" tone="blue">owns cart state A</DiagramNode>
    <DiagramNode title="CartProvider B" tone="purple">owns cart state B</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

This can be useful for tests, previews, embedded widgets, and multi-instance features.

## Reset by provider identity

```jsx
<CartProvider key={storeId}>
  <Storefront storeId={storeId} />
</CartProvider>
```

Changing the key changes component identity, so React can create a fresh reducer state instance. Use this intentionally when identity should reset the whole feature owner.

## Avoid one reducer for the whole application

A universal reducer owning auth, cart, notifications, editor, theme, billing, and unrelated dashboard state usually creates excessive coupling.

<VisualDiagram title="Prefer reducers around coherent feature/state-machine boundaries">
  <DiagramGrid columns={3}>
    <DiagramNode title="CartProvider" tone="green">cartReducer</DiagramNode>
    <DiagramNode title="EditorProvider" tone="purple">editorReducer</DiagramNode>
    <DiagramNode title="CheckoutProvider" tone="blue">checkoutReducer</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## When reducer + Context is enough

This architecture is a strong fit when:

- state is client-owned;
- one coherent feature subtree needs it;
- transition logic benefits from a reducer;
- many descendants need access;
- update frequency is moderate;
- full-context state subscriptions are acceptable.

## When to consider an external store

<DecisionTree
  question="Does the feature need more than reducer + Context provides?"
  items={[
    {label: 'One subtree, moderate updates, full-state subscriptions are fine', value: 'Reducer + Context is likely enough'},
    {label: 'Many distant roots / non-React code need the same owner', value: 'Consider an external store'},
    {label: 'High-frequency updates with independent selector subscriptions are important', value: 'Consider a store designed for fine-grained subscriptions'},
    {label: 'The difficult problem is server caching/invalidation', value: 'Use a server-state architecture instead'},
  ]}
/>

## Context + reducer is not Redux

The concepts overlap—actions, reducer, dispatch, state—but `useReducer` + Context does not automatically provide middleware, selector subscription infrastructure, Redux DevTools integration, normalized-store conventions, or global singleton semantics.

Use the smallest architecture that solves the actual requirements.

## Testing

Test the pure reducer directly for transition rules, then test provider integration through visible user behaviour.

```text
render CartProvider + UI
click Add
assert visible cart count
```

This literal test recipe is clearer as text than as a diagram.

## Dependency direction

<VisualDiagram title="Reducer + Context feature dependency direction">
  <DiagramStack align="center">
    <DiagramNode title="UI components" tone="blue" wide />
    <DiagramArrow label="call" />
    <DiagramNode title="Feature Hooks" tone="cyan" wide />
    <DiagramArrow label="read / dispatch through" />
    <DiagramNode title="Context + Provider" tone="purple" wide />
    <DiagramArrow label="owns" />
    <DiagramNode title="Reducer + domain helpers" tone="green" wide />
  </DiagramStack>
</VisualDiagram>

## Exercise

Build a `ProjectProvider` with `useReducer`, separate state/dispatch contexts, read/write Hooks, rename/task actions, reset, and a completion-percentage selector. Identify which components need state, which only need dispatch, and where the provider belongs.

## Interview questions

**Mid-level:** Why combine a reducer with Context?

**Senior:** Why might you split state and dispatch into separate contexts?

**Staff:** What evidence would make you replace reducer+Context with an external store, and what trade-offs would the migration introduce?

## Summary

<VisualDiagram title="Reducer + Context decision sequence">
  <LifecycleBar
    items={[
      {label: 'complex local feature transitions', tone: 'blue'},
      {label: 'useReducer owns state machine', tone: 'purple'},
      {label: 'Context distributes subtree access', tone: 'cyan'},
      {label: 'split read/write APIs when useful', tone: 'green'},
      {label: 'keep provider scope intentional', tone: 'orange'},
      {label: 'external store only when requirements demand it', tone: 'slate'},
    ]}
  />
</VisualDiagram>

## References

- https://react.dev/learn/scaling-up-with-reducer-and-context
- https://react.dev/learn/extracting-state-logic-into-a-reducer
- https://react.dev/reference/react/useReducer
- https://react.dev/reference/react/useContext

## Next

Continue with **State Architecture: Local, Shared, Server, and External State**.
