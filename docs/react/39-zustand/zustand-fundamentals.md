---
title: Zustand Fundamentals
description: Learn Zustand 5 store creation, actions, selectors, state updates, TypeScript, and when a lightweight external store fits.
sidebar_position: 1
---

import {
  DiagramArrow,
  DiagramGrid,
  DiagramNode,
  DiagramRow,
  DiagramStack,
  VisualDiagram,
} from '@site/src/components/handbook/VisualDiagram'

# Zustand fundamentals

This handbook targets **Zustand 5.0.14**.

Zustand is a lightweight external store with a hook-oriented React API.

## Mental model

<VisualDiagram title="Zustand external-store model">
  <DiagramStack align="center">
    <DiagramNode title="Zustand store" tone="green" wide>
      State + actions + `getState` + `setState` + `subscribe`
    </DiagramNode>
    <DiagramArrow label="selector subscriptions" />
    <DiagramRow>
      <DiagramNode title="CartBadge" tone="blue">Reads only the selected cart result.</DiagramNode>
      <DiagramNode title="PreferencesPanel" tone="cyan">Reads only the selected preferences result.</DiagramNode>
    </DiagramRow>
  </DiagramStack>
</VisualDiagram>

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

<VisualDiagram title="Selector subscription flow" compact>
  <DiagramStack align="center">
    <DiagramNode title="Whole store" tone="green" />
    <DiagramArrow label="selector(state)" />
    <DiagramNode title="Selected result" tone="blue" />
    <DiagramArrow label="subscription tracks this result" />
    <DiagramNode title="Component" tone="cyan" />
  </DiagramStack>
</VisualDiagram>

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

<VisualDiagram title="Multiple focused stores preserve domain ownership">
  <DiagramGrid columns={3}>
    <DiagramNode title="cartStore" tone="green">Cart-specific state and actions.</DiagramNode>
    <DiagramNode title="editorStore" tone="purple">Editor interaction state.</DiagramNode>
    <DiagramNode title="preferencesStore" tone="cyan">User interface preferences.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Multiple stores can preserve domain ownership.

## Zustand vs Context

<VisualDiagram title="Context vs Zustand">
  <DiagramGrid columns={2}>
    <DiagramNode title="Context" tone="cyan">
      Value follows provider tree · provider scope is explicit · consumers read the Context value.
    </DiagramNode>
    <DiagramNode title="Zustand" tone="green">
      External store lifetime · selector subscriptions · usable from non-React code.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

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
