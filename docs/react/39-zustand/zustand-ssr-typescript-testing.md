---
title: Zustand SSR, TypeScript, Testing, and Architecture
description: Use Zustand safely with SSR/hydration, typed stores, vanilla stores, testing, and production ownership boundaries.
sidebar_position: 3
---

# Zustand SSR, TypeScript, testing, and architecture

A module-level external store is simple in a browser-only SPA.

Server rendering introduces a new question:

> Is this store shared across requests, or does each request/user get an isolated state instance?

## The server-state isolation problem

Dangerous mental model:

```text
Node server process
      │
      └── one module-level mutable store
            ├── request A user
            └── request B user
```

If request-specific data is written into a process-global store, one user's state can leak into another request.

For SSR applications, design store lifetime deliberately.

## Request-scoped store model

```text
Request A
   │
   └── create store A
       └── render A

Request B
   │
   └── create store B
       └── render B
```

Each request gets an isolated store instance when the state is request/user specific.

## Vanilla stores

Zustand provides `createStore` for stores that are not bound directly to a React Hook.

```ts
import { createStore } from 'zustand/vanilla'

export type CounterStore = {
  count: number
  increment: () => void
}

export function createCounterStore(initialCount = 0) {
  return createStore<CounterStore>()((set) => ({
    count: initialCount,
    increment: () => set((state) => ({ count: state.count + 1 })),
  }))
}
```

Then React can consume that store through `useStore`.

```text
createStore()
    │
    ▼
store instance
    │
    ├── server/request ownership
    └── React provider/wrapper passes chosen instance
```

This pattern makes store lifetime explicit.

## Hydration rule

The server-rendered output and the client's initial render must agree.

```text
server initial store
        │
        ▼
server HTML
        │
        ▼
serialize safe initial data
        │
        ▼
client store created with same initial data
        │
        ▼
hydration
```

If the client immediately reads a different persisted/browser-only value during initial render, hydration can mismatch.

## Browser-only persistence and hydration

Local storage is not available during server rendering.

A persisted store may restore after the browser starts.

Design UI states such as:

```text
server/default state
      ↓
initial client hydration
      ↓
persisted state restored
      ↓
subsequent client render
```

Do not render user-sensitive server content from assumptions about browser persistence.

## TypeScript store shape

```ts
type SessionPreferencesState = {
  density: 'comfortable' | 'compact'
}

type SessionPreferencesActions = {
  setDensity: (density: SessionPreferencesState['density']) => void
}

type SessionPreferencesStore =
  SessionPreferencesState & SessionPreferencesActions
```

```ts
export const usePreferencesStore = create<SessionPreferencesStore>()((set) => ({
  density: 'comfortable',
  setDensity: (density) => set({ density }),
}))
```

Separate state/actions in types when it improves clarity, not because Zustand requires it.

## Store factories improve tests

```ts
export function createCartStore(initialItems: CartItem[] = []) {
  return createStore<CartStore>()((set) => ({
    items: initialItems,
    addItem: (item) =>
      set((state) => ({ items: [...state.items, item] })),
  }))
}
```

Each test can receive a new instance.

```ts
it('adds an item', () => {
  const store = createCartStore()

  store.getState().addItem({ id: 'a', name: 'Lamp' })

  expect(store.getState().items).toHaveLength(1)
})
```

Fresh stores eliminate cross-test leakage.

## Test React behavior with an injected store

For components that use a scoped store, create a test provider/wrapper that injects a fresh instance.

```text
test
  ↓
create fresh store
  ↓
render provider + component
  ↓
user interaction
  ↓
assert visible behavior
```

Avoid mocking the entire Zustand Hook when the real store is cheap to create.

## Security boundary

Zustand is client-side state unless you deliberately integrate it elsewhere.

Never trust Zustand state for server authorization.

```text
Zustand says role = admin
        │
        ▼
UI may show admin controls

server receives request
        │
        ▼
server must independently authenticate + authorize
```

Do not store secrets in client Zustand stores.

## Server state still belongs elsewhere

SSR does not make Zustand a server-state cache.

If the authoritative source is a database/API and you need cache invalidation/freshness, use the framework server-data system or a server-state library.

## Architecture checklist

Before creating a Zustand store, answer:

1. Who owns this domain?
2. Is the state client-owned or server-owned?
3. Does store lifetime equal app lifetime, route lifetime, or request lifetime?
4. Do components need selector subscriptions?
5. Does non-React code need access?
6. Should state persist across reloads?
7. Can persistence contain stale or sensitive data?
8. Will SSR/hydration be involved?
9. Do tests get isolated store instances?

## Production example

A diagram editor might use:

```text
TanStack Query
└── load/save diagram document from server

Zustand editor store
├── selected node IDs
├── zoom level
├── drag interaction
├── active tool
└── temporary history cursor

URL
└── diagram ID
```

The same screen uses several state models because ownership differs.

## Common SSR mistakes

- module-global user-specific store on the server;
- reading `window`/localStorage during server render;
- restoring persisted state before hydration without matching server output;
- serializing sensitive data into initial client state;
- treating a browser store as authoritative server data.

## Interview questions

**Mid-level:** Why can a module-level store be risky during SSR?

**Senior:** Why does a store factory help with SSR and testing?

**Senior:** How would you coordinate persisted state with hydration?

**Staff:** How would you design store ownership for a multi-tenant SSR application using Zustand without cross-request leakage?

## References

- https://zustand.docs.pmnd.rs/learn/guides/ssr-and-hydration
- https://zustand.docs.pmnd.rs/apis/create-store
- https://zustand.docs.pmnd.rs/hooks/use-store
- https://zustand.docs.pmnd.rs/learn/guides/beginner-typescript
