---
title: Zustand Fundamentals
description: Learn Zustand 5 store creation, actions, selectors, state updates, TypeScript, and when a lightweight external store fits.
sidebar_position: 1
---

# Zustand fundamentals

This handbook targets **Zustand 5.0.14**.

Zustand is a lightweight external store with a hook-oriented React API.

## Mental model

```text
Zustand store
├── state
├── actions
├── getState
├── setState
└── subscribe
      │
      ▼
selector subscriptions
      │
   ┌──┴───────────────┐
   ▼                  ▼
CartBadge        PreferencesPanel
```

The store exists outside React. Components subscribe to selected results from that store.

## Install

```bash
npm install zustand
```

## Create a store

```ts
import { create } from 'zustand'

type CounterStore = {
  count: number
  increment: () => void
  decrement: () => void
}

export const useCounterStore = create<CounterStore>()((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}))
```

`create` returns a React Hook with store utilities attached.

## Select state

```tsx
function CounterValue() {
  const count = useCounterStore((state) => state.count)
  return <output>{count}</output>
}
```

```text
whole store
   │
   ▼
selector(state)
   │
   ▼
selected result
   │
   ▼
component subscription
```

Prefer selecting the smallest state a component needs.

## Select actions

```tsx
function CounterControls() {
  const increment = useCounterStore((state) => state.increment)
  const decrement = useCounterStore((state) => state.decrement)

  return (
    <div>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </div>
  )
}
```

Actions colocated with state create a clear feature API.

## Update from previous state

When the next value depends on the current value, use an updater:

```ts
increment: () => set((state) => ({ count: state.count + 1 }))
```

For object-shaped stores, `set` shallow-merges by default.

## Treat arrays and objects immutably

```ts
addItem: (item) =>
  set((state) => ({
    items: [...state.items, item],
  }))
```

Avoid in-place mutation of nested objects and arrays when selector identity matters.

## Derived values

Do not duplicate values that can be derived.

```tsx
const itemCount = useCartStore((state) => state.items.length)
```

or:

```ts
const selectCartTotal = (state: CartStore) =>
  state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )
```

## Access outside React

```ts
const count = useCounterStore.getState().count
const unsubscribe = useCounterStore.subscribe((state) => {
  console.log(state.count)
})
```

This external access is one reason Zustand can fit state that must be shared with non-React code.

## Focused stores

Do not default to one giant global store.

```text
stores/
├── cartStore
├── editorStore
└── preferencesStore
```

Multiple stores can preserve domain ownership.

## Zustand vs Context

```text
Context
├── value follows provider tree
├── provider scope is explicit
└── consumers read Context value

Zustand
├── external store lifetime
├── selector subscriptions
└── usable from non-React code
```

Use Context when provider scope naturally expresses ownership. Consider Zustand when independent selector subscriptions or external access matter.

## Zustand vs Redux Toolkit

Redux Toolkit is more structured around actions, slices, reducers, middleware, and a central event flow.

Zustand is lower ceremony and store-centric.

Choose based on architecture requirements, not popularity.

## Common mistakes

- selecting the whole store in every component;
- putting server cache data in Zustand without a cache lifecycle strategy;
- creating one universal store for unrelated domains;
- bypassing named domain actions with raw updates everywhere.

## Testing

The store can be tested directly. Reset shared store state between tests so one test does not influence another.

## Interview questions

**Junior:** What does `create` return?

**Mid-level:** Why are selectors important?

**Senior:** When would you choose Zustand over Context or Redux Toolkit?

**Staff:** How would you prevent module-level stores from becoming hidden global coupling in a large application?

## References

- https://zustand.docs.pmnd.rs/reference/apis/create
- https://zustand.docs.pmnd.rs/learn/guides/beginner-typescript
- https://www.npmjs.com/package/zustand
