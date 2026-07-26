---
title: Zustand Selectors, Middleware, and Persistence
description: Design selector subscriptions, equality behavior, persistence, devtools, and store boundaries in Zustand 5.
sidebar_position: 2
---

# Zustand selectors, middleware, and persistence

Zustand stays simple only when subscription boundaries stay deliberate.

## Selector subscriptions

```tsx
const user = useAppStore((state) => state.user)
const theme = useAppStore((state) => state.theme)
```

Each selector expresses what the component needs.

```text
store update
   │
   ├── selected result unchanged → component can stay
   └── selected result changed   → component updates
```

## Avoid selecting the whole store by habit

```tsx
const state = useAppStore()
```

This is convenient, but broad subscriptions make unrelated updates visible to the component.

Prefer narrow selectors when component responsibilities are narrow.

## Multiple values and equality

This returns a new object:

```tsx
const summary = useCartStore((state) => ({
  count: state.items.length,
  currency: state.currency,
}))
```

A fresh result means equality strategy matters.

Current Zustand provides shallow-comparison helpers such as `useShallow` for cases where selecting several fields together is useful.

Conceptually:

```text
selector returns object
        │
        ▼
compare previous fields shallowly
        │
        ├── same → preserve selected result behavior
        └── changed → update subscriber
```

Do not add custom equality everywhere before profiling.

## Actions as the write API

Prefer named domain actions:

```ts
const useCartStore = create<CartStore>()((set) => ({
  items: [],
  addItem: (item) => set((state) => ({
    items: [...state.items, item],
  })),
  clearCart: () => set({ items: [] }),
}))
```

This keeps transition intent visible.

```text
UI
 ↓
clearCart()
 ↓
store update
```

rather than scattering raw `setState` calls throughout unrelated modules.

## Async actions

Zustand actions may be async:

```ts
const useUserStore = create<UserStore>()((set) => ({
  user: null,
  status: 'idle',

  loadUser: async () => {
    set({ status: 'loading' })

    try {
      const response = await fetch('/api/user')

      if (!response.ok) {
        throw new Error('Request failed')
      }

      const user = (await response.json()) as User
      set({ user, status: 'success' })
    } catch {
      set({ status: 'error' })
    }
  },
}))
```

But this does not turn Zustand into a server-state cache.

If you need deduplication, stale time, invalidation, retries, background refetch, or paginated cache semantics, use TanStack Query or another server-state system.

## Middleware mental model

```text
state creator
    │
    ▼
middleware wraps store behavior
    │
    ├── persist
    ├── devtools
    └── other middleware
    │
    ▼
created store
```

Middleware changes store capabilities; it should not become an excuse to hide unrelated architecture.

## Persistence

Zustand's `persist` middleware can synchronize selected store data to browser storage or another storage adapter.

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'preferences',
    },
  ),
)
```

## Persistence is not trust

Data restored from browser storage is user-controlled.

Do not persist:

- secrets;
- access-control decisions as trusted evidence;
- authoritative server records without a freshness policy.

Persisted client state should be validated when shape/version matters.

## Persist only what should survive

```text
Good persistence candidates
├── theme preference
├── dismissed onboarding
└── editor preference

Questionable/default-poor candidates
├── temporary modal state
├── server inventory response
└── sensitive authentication secret
```

## State migrations

Persistent state schemas evolve.

Treat persistence like a data format:

```text
stored version 1
      │
      ▼
migration
      │
      ▼
stored version 2 shape
```

Design versioning before large production stores depend on old browser data forever.

## DevTools

Zustand can integrate with Redux DevTools through its middleware.

Use tooling to answer:

- what changed;
- which action caused it;
- whether updates are too broad;
- whether persisted state restored unexpectedly.

## Store slices

Large stores are sometimes composed from slices.

```text
application store
├── cart slice
├── preferences slice
└── editor slice
```

This can reduce file size, but a single combined store still creates one architectural dependency surface.

Ask whether multiple focused stores would preserve ownership better.

## Multiple stores vs one store

Prefer multiple stores when:

- domains have unrelated lifetimes;
- different product areas own them;
- persistence policies differ;
- consumers rarely need cross-domain transactions.

Prefer one coordinated store when state transitions truly span those domains and the shared boundary is intentional.

## Subscription performance

Measure:

```text
update frequency
× subscriber count
× selected-result changes
× render cost
```

Selectors are a performance boundary, but do not turn every selector into a micro-optimization project.

## Debugging

When a component re-renders unexpectedly:

1. Which store changed?
2. What did the selector return before and after?
3. Did the selector create a fresh object/array?
4. Is the component selecting too much state?
5. Is persisted hydration changing values after mount?
6. Is a derived value being stored redundantly?

## Interview questions

**Mid-level:** Why can returning a new object from a selector matter?

**Senior:** When would you split one Zustand store into several stores?

**Senior:** What are the architectural risks of persistence?

**Staff:** How would you govern persisted Zustand stores across application versions and multiple teams?

## References

- https://zustand.docs.pmnd.rs/reference/apis/create
- https://zustand.docs.pmnd.rs/integrations/persisting-store-data
- https://zustand.docs.pmnd.rs/middlewares/devtools
- https://zustand.docs.pmnd.rs/guides/prevent-rerenders-with-use-shallow
