---
title: Reducer + Context Architecture
description: Combine useReducer and Context to scale feature state without prop drilling, while keeping providers, actions, selectors, and boundaries intentional.
sidebar_position: 2
---

# Reducer + Context architecture

Reducers centralize **state transition logic**.

Context distributes **access** through a subtree.

Together they can form a lightweight feature-state architecture:

```text
FeatureProvider
├── useReducer owns state
├── State Context provides reads
└── Dispatch Context provides writes
```

This is useful for complex screens and feature subtrees where many descendants need the same state and actions.

## Start with local reducer state

Do not introduce Context just because you use a reducer.

```jsx
function CheckoutPage() {
  const [state, dispatch] = useReducer(checkoutReducer, initialState);

  return (
    <CheckoutForm state={state} dispatch={dispatch} />
  );
}
```

If only a small part of the tree needs the data, props may be the cleanest API.

Context becomes useful when passing state/dispatch through many unrelated intermediate layers becomes noisy.

## The feature provider pattern

```jsx
import { createContext, useContext, useReducer } from 'react';

const CartStateContext = createContext(null);
const CartDispatchContext = createContext(null);

export function CartProvider({ children }) {
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

Now reads and writes are explicit feature APIs.

## Read Hook

```jsx
export function useCartState() {
  const state = useContext(CartStateContext);

  if (state === null) {
    throw new Error('useCartState must be used inside CartProvider');
  }

  return state;
}
```

## Dispatch Hook

```jsx
export function useCartDispatch() {
  const dispatch = useContext(CartDispatchContext);

  if (dispatch === null) {
    throw new Error('useCartDispatch must be used inside CartProvider');
  }

  return dispatch;
}
```

Consumer:

```jsx
function AddToCartButton({ product }) {
  const dispatch = useCartDispatch();

  return (
    <button
      onClick={() => {
        dispatch({
          type: 'item_added',
          product,
        });
      }}
    >
      Add to cart
    </button>
  );
}
```

The button does not need to read the whole cart state just to dispatch an action.

## Why split state and dispatch?

You could provide both together:

```jsx
<CartContext value={{ state, dispatch }}>
```

But splitting them has advantages:

- read and write dependencies are clearer;
- dispatch-only components do not subscribe to changing state;
- provider API is easier to reason about;
- stable dispatch identity is useful.

It is not mandatory, but it is often a strong default for reducer+Context architectures.

## Put reducer logic outside the provider

Avoid giant provider components:

```jsx
function CartProvider({ children }) {
  // 500 lines of transition logic here ❌
}
```

Prefer:

```text
cart/
  CartProvider.jsx
  cartReducer.js
  useCartState.js
  useCartDispatch.js
```

Or keep Hooks beside the provider if the feature is small.

The goal is not file count. The goal is separation of responsibilities.

## Reducer remains pure

Combining with Context does not change reducer rules.

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

No network requests.

No localStorage writes.

No analytics.

No timers.

No mutation.

## Async workflows around reducer state

Suppose checkout submission calls an API.

The async work happens outside the reducer:

```jsx
function CheckoutButton() {
  const state = useCheckoutState();
  const dispatch = useCheckoutDispatch();

  async function handleCheckout() {
    dispatch({ type: 'submission_started' });

    try {
      const order = await createOrder(state);

      dispatch({
        type: 'submission_succeeded',
        orderId: order.id,
      });
    } catch (error) {
      dispatch({
        type: 'submission_failed',
        message: error.message,
      });
    }
  }

  return <button onClick={handleCheckout}>Checkout</button>;
}
```

The reducer records state transitions. It does not perform external work.

## Selectors

As state grows, avoid repeating derived calculations everywhere.

```js
export function selectCartTotal(state) {
  return state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
}
```

Consumer:

```jsx
function CartTotal() {
  const state = useCartState();
  const total = selectCartTotal(state);

  return <strong>Total: {total}</strong>;
}
```

Selectors centralize domain derivation.

They do **not** create a fine-grained Context subscription. The component still reads the full Context value.

## Action creator functions: optional

You may see:

```js
function addItem(product) {
  return {
    type: 'item_added',
    product,
  };
}
```

Then:

```jsx
dispatch(addItem(product));
```

This can help when actions are complex or reused.

But do not create action creators for every tiny local action just to imitate Redux conventions.

## Domain commands as custom Hooks

Sometimes consumers should not know action shapes.

```jsx
export function useCartActions() {
  const dispatch = useCartDispatch();

  return {
    addItem(product) {
      dispatch({ type: 'item_added', product });
    },
    removeItem(productId) {
      dispatch({ type: 'item_removed', productId });
    },
  };
}
```

Usage:

```jsx
const { addItem } = useCartActions();
```

This hides reducer action details behind a feature API.

Trade-off: the returned object/functions may need careful identity handling if consumers rely on them as dependencies or optimization inputs. Do not optimize preemptively.

## Provider boundaries

Do not put the provider higher than necessary.

Bad default:

```jsx
<CartProvider>
  <EntireCompanyWebsite />
</CartProvider>
```

Better if only shop routes need it:

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

The tree is part of your state architecture.

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

That can be useful in tests, previews, embedded widgets, or multi-instance components.

Context state is not inherently singleton/global.

## Reset by provider identity

Because state belongs to component position and identity, changing a provider key can intentionally reset its reducer state.

```jsx
<CartProvider key={storeId}>
  <Storefront storeId={storeId} />
</CartProvider>
```

When `storeId` changes, React can create a fresh provider state instance.

Use this deliberately, not as a mysterious reset hack.

## Avoid one reducer for the whole application

A giant reducer such as:

```text
appReducer
- auth
- cart
- notifications
- dashboard
- editor
- theme
- billing
```

usually creates excessive coupling.

Prefer reducers around coherent state machines or feature domains.

```text
CartProvider → cartReducer
EditorProvider → editorReducer
CheckoutProvider → checkoutReducer
```

## When reducer + Context is enough

This architecture can be a strong fit when:

- state is client-only;
- one feature subtree needs it;
- update logic is complex enough for a reducer;
- many descendants need access;
- update frequency is moderate;
- full-context subscriptions are acceptable.

## When to consider an external store

Signals include:

- state must live outside the React tree;
- many distant roots must share it;
- update frequency is high;
- consumers need fine-grained subscriptions/selectors;
- integration exists with non-React code;
- store lifetime should outlive component mounting;
- a dedicated state library solves required tooling or architecture problems.

Do not migrate simply because the reducer file became long.

## Context + reducer is not Redux

The concepts overlap:

```text
actions
reducers
dispatch
state
```

But `useReducer` + Context does not automatically provide:

- middleware;
- selector subscription infrastructure;
- Redux DevTools integration;
- normalized store conventions;
- global singleton store semantics;
- ecosystem tooling.

Use the smallest architecture that solves the problem.

## Testing

You can test the reducer independently:

```js
expect(
  cartReducer(initialState, {
    type: 'item_added',
    product,
  })
).toEqual(expectedState);
```

And test provider behavior through user-facing components:

```text
render CartProvider + UI
click Add
assert visible cart count
```

This verifies both transition logic and integration.

## Production architecture example

```text
features/cart/
  CartProvider.jsx
  cartReducer.js
  cartSelectors.js
  useCartState.js
  useCartDispatch.js
  components/
    AddToCartButton.jsx
    CartDrawer.jsx
    CartTotal.jsx
```

Dependency direction:

```text
UI
 ↓
feature Hooks
 ↓
Context/provider
 ↓
reducer + domain helpers
```

## Exercise

Build a `ProjectProvider` with:

- `useReducer`;
- separate state and dispatch contexts;
- `useProjectState`;
- `useProjectDispatch`;
- actions for rename, task add, task toggle, and reset;
- one derived selector for completion percentage.

Then identify which components need state, which only need dispatch, and whether the provider belongs at app root or project-route scope.

## Interview questions

**Mid-level:** Why combine a reducer with Context?

**Senior:** Why might you split state and dispatch into separate contexts?

**Staff:** What evidence would make you replace reducer+Context with an external store, and what trade-offs would the migration introduce?

## Summary

```text
complex local feature state
        ↓
useReducer for transitions
        ↓
Context for subtree access
        ↓
separate read/write APIs when useful
        ↓
keep provider scope intentional
        ↓
move to external store only when requirements demand it
```

## References

- https://react.dev/learn/scaling-up-with-reducer-and-context
- https://react.dev/learn/extracting-state-logic-into-a-reducer
- https://react.dev/reference/react/useReducer
- https://react.dev/reference/react/useContext

## Next

Continue with **State Architecture: Local, Shared, Server, and External State**.