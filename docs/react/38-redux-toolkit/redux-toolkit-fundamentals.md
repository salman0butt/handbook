---
title: Redux Toolkit Fundamentals
description: Learn the modern Redux model with configureStore, createSlice, Provider, selectors, dispatch, TypeScript, and when Redux is justified.
sidebar_position: 1
---

import {
  DiagramArrow,
  DiagramGrid,
  DiagramNode,
  DiagramRow,
  DiagramStack,
  LifecycleBar,
  VisualDiagram,
} from '@site/src/components/handbook/VisualDiagram'

# Redux Toolkit fundamentals

Redux Toolkit is the recommended modern way to write Redux applications.

The current stable package line for this handbook is **Redux Toolkit 2.12.0**.

Do not start new code by hand-writing legacy `createStore`, string action constants, and switch-heavy boilerplate unless you are maintaining old Redux code.

## What problem Redux solves

Redux gives a shared external store a predictable event-driven update model.

<VisualDiagram title="Redux Toolkit data flow">
  <DiagramStack align="center">
    <DiagramNode title="UI event" tone="blue">A click, form event, or system event occurs.</DiagramNode>
    <DiagramArrow label="dispatch(action)" />
    <DiagramNode title="Redux store" tone="purple">The external store receives the action.</DiagramNode>
    <DiagramArrow label="reducers calculate next state" />
    <DiagramNode title="Next state" tone="green">State changes through reducer logic.</DiagramNode>
    <DiagramArrow label="selectors read focused values" />
    <DiagramNode title="Subscribed components" tone="orange">React-Redux updates consumers whose selected result changed.</DiagramNode>
  </DiagramStack>
</VisualDiagram>

Redux is useful when state coordination, traceability, tooling, middleware, and cross-feature ownership matter.

## Install

```bash
npm install @reduxjs/toolkit react-redux
```

Redux Toolkit contains the modern Redux utilities. React-Redux connects the store to React.

## Create the store

```ts
// app/store.ts
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

`configureStore` sets up a Redux store with useful defaults, including development checks and Redux DevTools integration.

## Create a slice

```ts
// features/counter/counterSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type CounterState = {
  value: number
}

const initialState: CounterState = {
  value: 0,
}

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment(state) {
      state.value += 1
    },
    decrement(state) {
      state.value -= 1
    },
    incrementBy(state, action: PayloadAction<number>) {
      state.value += action.payload
    },
  },
})

export const { increment, decrement, incrementBy } = counterSlice.actions
export default counterSlice.reducer
```

Redux Toolkit uses Immer internally, so reducer code may look mutative while still producing immutable Redux state updates.

## Slice mental model

<VisualDiagram title="What createSlice gives you" compact>
  <DiagramStack align="center">
    <DiagramNode title="createSlice({ name, initialState, reducers })" tone="purple" wide />
    <DiagramArrow label="generates" />
    <DiagramRow>
      <DiagramNode title="Slice reducer" tone="green">Understands the generated slice actions.</DiagramNode>
      <DiagramNode title="Action creators" tone="blue">Create correctly typed action objects.</DiagramNode>
    </DiagramRow>
  </DiagramStack>
</VisualDiagram>

`increment()` creates an action object.

The slice reducer understands that action and calculates the next state.

## Provide the store to React

```tsx
import { Provider } from 'react-redux'
import { store } from './app/store'

root.render(
  <Provider store={store}>
    <App />
  </Provider>,
)
```

<VisualDiagram title="React-Redux connection" compact>
  <DiagramStack align="center">
    <DiagramNode title="Provider store={store}" tone="purple" wide />
    <DiagramArrow label="makes the external store available" />
    <DiagramRow>
      <DiagramNode title="useSelector(...)" tone="blue">Subscribes to selected state.</DiagramNode>
      <DiagramNode title="useDispatch()" tone="green">Sends actions to the store.</DiagramNode>
    </DiagramRow>
  </DiagramStack>
</VisualDiagram>

React-Redux manages the subscription between React components and the external Redux store.

## Typed hooks

Create application-specific hooks once:

```ts
// app/hooks.ts
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './store'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
```

Then components do not repeat store types.

## Read state with selectors

```tsx
function CounterValue() {
  const count = useAppSelector((state) => state.counter.value)

  return <output>{count}</output>
}
```

`useSelector` subscribes to the store and evaluates the selector after dispatches.

By default, React-Redux compares the previous selector result with the next result using strict reference equality.

## Dispatch actions

```tsx
function CounterControls() {
  const dispatch = useAppDispatch()

  return (
    <div>
      <button onClick={() => dispatch(decrement())}>-</button>
      <button onClick={() => dispatch(increment())}>+</button>
    </div>
  )
}
```

The component does not directly mutate store state.

<LifecycleBar
  items={[
    { label: 'button click', tone: 'blue' },
    { label: 'dispatch(increment())', tone: 'purple' },
    { label: "{ type: 'counter/increment' }", tone: 'orange' },
    { label: 'slice reducer', tone: 'green' },
    { label: 'new store state', tone: 'cyan' },
  ]}
/>

## Payload actions

```tsx
<button onClick={() => dispatch(incrementBy(5))}>
  Add 5
</button>
```

Generated action conceptually resembles:

```ts
{
  type: 'counter/incrementBy',
  payload: 5,
}
```

## Selectors as the read API

Prefer named selectors for important domain reads.

```ts
export const selectCounterValue = (state: RootState) => state.counter.value
```

```tsx
const count = useAppSelector(selectCounterValue)
```

For feature architecture:

<VisualDiagram title="Feature boundary around Redux state">
  <DiagramGrid columns={4}>
    <DiagramNode title="Slice state" tone="purple">Domain-owned writable state.</DiagramNode>
    <DiagramNode title="Actions" tone="blue">Public event vocabulary.</DiagramNode>
    <DiagramNode title="Selectors" tone="green">Public read API.</DiagramNode>
    <DiagramNode title="Components" tone="orange">Consume domain state without knowing the whole root shape.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Components should not need to understand every detail of the root state shape.

## Derived selectors

Do not store values that can be derived from existing state without a reason.

```ts
export const selectCompletedCount = (state: RootState) =>
  state.todos.items.filter((todo) => todo.completed).length
```

If expensive derived calculations need memoization, use selector tooling such as Reselect/createSelector rather than duplicating state.

## Multiple slices

```ts
export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    editor: editorReducer,
    notifications: notificationsReducer,
  },
})
```

Architecture:

<VisualDiagram title="Domain slices inside one Redux store">
  <DiagramStack align="center">
    <DiagramNode title="Redux Store" tone="purple" wide />
    <DiagramArrow label="organized by domain ownership" />
    <DiagramGrid columns={4}>
      <DiagramNode title="auth" tone="blue" />
      <DiagramNode title="cart" tone="green" />
      <DiagramNode title="editor" tone="orange" />
      <DiagramNode title="notifications" tone="cyan" />
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

Slice boundaries should follow domains, not arbitrary file size.

## What belongs in Redux?

Good candidates can include:

- shared workflow state across distant features;
- complex client-side editor state;
- normalized entities used by many screens;
- cross-feature events and transitions;
- state that benefits from Redux DevTools traceability;
- state coordinated through middleware.

Poor default candidates:

- one component's modal visibility;
- every text input;
- data already owned by a server-state cache;
- URL parameters that should remain shareable in the URL;
- duplicated derived values.

## Redux vs Context

<VisualDiagram title="Context and Redux solve different architecture problems">
  <DiagramGrid columns={2}>
    <DiagramNode title="Context" tone="cyan">
      Tree-scoped dependency distribution · provider boundaries · no built-in selector/event/middleware model.
    </DiagramNode>
    <DiagramNode title="Redux Toolkit" tone="purple">
      External store · action-driven transitions · selector subscriptions · middleware · DevTools event trace.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Neither is automatically better.

## Redux vs Zustand

Redux Toolkit is more structured and opinionated.

Zustand is lighter and store-centric with less ceremony.

Choose based on architecture requirements, not bundle-size slogans.

## Common mistakes

### Putting every value in Redux

Global reach does not imply global ownership.

### Mutating state outside reducers

State updates should flow through reducers/actions or supported RTK APIs.

### Returning fresh objects from selectors unnecessarily

```tsx
const data = useAppSelector((state) => ({
  user: state.auth.user,
  theme: state.settings.theme,
}))
```

This creates a new object every selector execution and can trigger updates unless equality/memoization is handled deliberately.

### Fetching everything with hand-written thunks

For server cache lifecycles, consider RTK Query or TanStack Query instead of manually building loading/cache/invalidation logic.

## Debugging

Use Redux DevTools to inspect:

<LifecycleBar
  items={[
    { label: 'action', tone: 'blue' },
    { label: 'previous state', tone: 'slate' },
    { label: 'reducer transition', tone: 'purple' },
    { label: 'next state', tone: 'green' },
  ]}
/>

If a component does not update, inspect:

1. Was the action dispatched?
2. Did the correct reducer handle it?
3. Did state actually change?
4. Does the selector read the right slice?
5. Did the selector return the same reference?
6. Is the component under the correct Provider?

## Exercise

Build a shopping cart slice that supports:

- add item;
- remove item;
- change quantity;
- clear cart;
- select item count;
- select total price.

Keep totals derived rather than stored unless you can justify independent ownership.

## Interview questions

**Junior:** What are store, action, reducer, dispatch, and selector?

**Mid-level:** What does `createSlice` generate, and why can reducer code appear to mutate state?

**Senior:** What should not live in Redux, and how would you decide whether a feature needs Redux instead of Context or Zustand?

**Staff:** How would you define Redux domain boundaries across multiple teams without turning the store into a shared dumping ground?

## References

- https://redux.js.org/tutorials/quick-start
- https://redux.js.org/tutorials/essentials/part-1-overview-concepts
- https://redux.js.org/tutorials/typescript-quick-start
- https://react-redux.js.org/api/hooks
- https://www.npmjs.com/package/@reduxjs/toolkit
