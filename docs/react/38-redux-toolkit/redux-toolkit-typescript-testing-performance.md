---
title: Redux Toolkit TypeScript, Testing, Performance, and Architecture
description: Build typed Redux boundaries, test behavior, design selectors, measure rendering, and scale Redux across large applications.
sidebar_position: 3
---

# Redux Toolkit TypeScript, testing, performance, and architecture

Redux becomes valuable at scale only if the store remains understandable.

A large Redux application should make ownership explicit:

```text
store
├── auth
├── cart
├── editor
├── notifications
└── api cache
```

not:

```text
store
└── everything
```

## Type the store once

```ts
export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

Typed application hooks:

```ts
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
```

This keeps components from repeatedly spelling Redux types.

## Type actions through slices

```ts
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    quantityChanged(
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) {
      const item = state.items.find((item) => item.id === action.payload.id)

      if (item) {
        item.quantity = action.payload.quantity
      }
    },
  },
})
```

Generated action creators preserve payload types.

## Prefer domain selectors

```ts
export const selectCartItems = (state: RootState) => state.cart.items

export const selectCartTotal = createSelector(
  [selectCartItems],
  (items) => items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  ),
)
```

Architecture:

```text
RootState
   │
   ▼
feature selectors
   │
   ▼
derived selectors
   │
   ▼
components
```

This reduces coupling between components and the exact root-state shape.

## Selector performance

`useSelector` subscribes to the store.

The selector result is compared with the previous result using strict equality by default.

Problematic:

```tsx
const cartSummary = useAppSelector((state) => ({
  count: state.cart.items.length,
  currency: state.settings.currency,
}))
```

The object is new after each selector execution.

Better options include:

- multiple `useSelector` calls;
- a memoized selector;
- an equality function when justified.

Do not optimize blindly. Use React Profiler and Redux DevTools to prove the problem.

## Normalized state

For entity-heavy state, normalize by ID rather than deeply nesting repeated copies.

```text
entities
├── ids: ['a', 'b', 'c']
└── byId
    ├── a → product
    ├── b → product
    └── c → product
```

Redux Toolkit provides `createEntityAdapter` for common normalized collection operations.

Benefits can include:

- stable entity lookup;
- less duplication;
- simpler updates;
- reusable selectors.

Normalization is not mandatory for every list.

## Middleware mental model

```text
dispatch(action)
      │
      ▼
middleware chain
      │
      ├── observe
      ├── transform/control async behavior
      └── forward
            │
            ▼
          reducer
```

Middleware is appropriate for cross-cutting Redux behavior such as:

- logging;
- analytics events;
- async orchestration;
- websocket coordination;
- domain event reactions.

Do not hide ordinary component logic in middleware only because Redux supports middleware.

## Listener middleware

Redux Toolkit includes listener middleware for reacting to Redux actions/state changes with side effects.

Conceptually:

```text
action dispatched
      │
      ▼
listener condition matches
      │
      ▼
run effect
```

This can be useful for application workflows that span slices without making reducers impure.

Reducers must remain pure state-transition functions.

## Testing reducers

Reducers are straightforward to test directly.

```ts
it('increments the counter', () => {
  const initial = { value: 0 }

  const next = counterReducer(initial, increment())

  expect(next.value).toBe(1)
})
```

This is useful for complex transition logic.

## Testing selectors

```ts
it('derives cart total', () => {
  const state = makeRootState({
    cart: {
      items: [
        { id: 'a', price: 10, quantity: 2 },
        { id: 'b', price: 5, quantity: 1 },
      ],
    },
  })

  expect(selectCartTotal(state)).toBe(25)
})
```

## Testing React + Redux behavior

Create a real test store rather than mocking `useSelector` and `useDispatch` everywhere.

```tsx
function renderWithStore(
  ui: React.ReactElement,
  preloadedState?: Partial<RootState>,
) {
  const store = setupStore(preloadedState)

  return {
    store,
    ...render(<Provider store={store}>{ui}</Provider>),
  }
}
```

Then test user behavior:

```tsx
it('adds an item to the cart', async () => {
  const user = userEvent.setup()

  renderWithStore(<ProductPage />)

  await user.click(screen.getByRole('button', { name: /add to cart/i }))

  expect(screen.getByText(/1 item/i)).toBeInTheDocument()
})
```

## Do not over-test implementation details

Avoid tests whose only purpose is to assert that a specific action was dispatched when the user-visible behavior is the real requirement.

Prefer:

```text
user action
   ↓
observable result
```

rather than:

```text
component
   ↓
mock dispatch
   ↓
assert action object only
```

Direct reducer/action tests still make sense when transition logic itself is the unit under test.

## Performance architecture

Before blaming Redux for rendering:

1. identify which component is slow;
2. inspect which selector changed;
3. inspect selector result identity;
4. inspect whether unrelated state is stored together;
5. profile actual render cost;
6. optimize only where evidence supports it.

Redux subscription architecture can be very efficient when selectors are narrow.

```text
store update
   │
   ├── selector A result unchanged → component A stays
   └── selector B result changed   → component B updates
```

## Feature architecture

One production-friendly layout:

```text
src/
├── app/
│   ├── store.ts
│   └── hooks.ts
│
└── features/
    ├── cart/
    │   ├── cartSlice.ts
    │   ├── cartSelectors.ts
    │   ├── CartDrawer.tsx
    │   └── cart.test.ts
    │
    └── auth/
        ├── authSlice.ts
        ├── authSelectors.ts
        └── LoginPanel.tsx
```

Do not create a giant `reducers/` folder that destroys feature ownership.

## Large-team ownership

A Redux store shared by many teams needs governance.

Define:

- who owns each slice;
- which actions are public domain events;
- which selectors are stable public APIs;
- how migrations are versioned;
- where server state lives;
- what must not be stored globally;
- observability expectations for critical workflows.

## Security

Redux state runs on the client.

Never treat values in Redux as trusted authorization evidence.

Bad:

```ts
if (state.auth.role === 'admin') {
  // allow destructive server action
}
```

The UI may use that state to decide what to display, but the server must independently authenticate and authorize the request.

Do not put secrets in Redux state. DevTools, logs, browser extensions, and user-controlled JavaScript make client state observable.

## Persistence

If Redux state is persisted to local storage or another client mechanism:

- treat persisted data as untrusted;
- version/migrate schemas;
- do not persist secrets;
- distinguish persistence from live ownership;
- avoid restoring stale server cache as authoritative data without a designed policy.

## When Redux becomes a problem

Warning signs:

- every feature depends on every slice;
- reducers contain unrelated domains;
- server data is copied between several slices;
- local UI state is global by default;
- selectors are bypassed and root-state structure leaks everywhere;
- teams cannot change one feature without coordinating store changes globally.

The solution may be better boundaries, not necessarily a different library.

## Exercise

Design Redux state for a project-management application with:

- authenticated user;
- editor draft;
- projects fetched from server;
- notification preferences;
- open modal;
- route filters.

Decide what belongs in Redux, what belongs in server-state cache, what stays local, and what belongs in the URL.

## Interview questions

**Mid-level:** Why should you define typed Redux hooks once rather than typing every component call?

**Senior:** How does selector result identity affect rendering?

**Senior:** When is normalized state useful?

**Staff:** How would you govern a Redux store used by ten product teams while preserving domain ownership?

## References

- https://redux.js.org/tutorials/typescript-quick-start
- https://react-redux.js.org/api/hooks
- https://redux-toolkit.js.org/api/createEntityAdapter
- https://redux-toolkit.js.org/api/createListenerMiddleware
- https://redux.js.org/usage/writing-tests
