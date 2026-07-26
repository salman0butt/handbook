---
title: Zustand Interview Questions
description: Zustand interview questions covering store design, selectors, middleware, persistence, SSR, hydration, testing, performance, and architecture trade-offs.
---

# Zustand interview questions

This chapter tests whether you understand Zustand as a **lightweight external store**, not just whether you remember `create()` syntax.

## Fundamentals

### 1. What is Zustand?

**Strong answer:** A lightweight state-management library built around external stores with a hook-oriented React API. Components typically subscribe to selected slices of store state.

**Follow-up:** How is this different from React Context?

### 2. What does `create` return?

**Strong answer:** A bound React Hook with store utilities attached. The store itself lives outside React; the Hook subscribes React components to selected store values.

### 3. What do `set` and `get` represent?

**Strong answer:** `set` updates store state; `get` reads current store state inside store logic. Use `set(state => ...)` when the next value depends on previous state.

### 4. Does Zustand require reducers and action objects?

**Strong answer:** No. Store actions can call `set` directly. You may still adopt action-like conventions if the domain benefits from them.

### 5. Why does selector usage matter?

**Strong answer:** Selectors define what a component subscribes to. Narrow selectors reduce unnecessary updates and clarify dependency on store state.

### 6. Does this subscribe only to `name`?

```ts
const user = useUserStore((state) => state.user)
const name = user.name
```

**Strong answer:** No. The subscription is to the selected `user` object. Reading `name` afterward does not make the subscription finer-grained.

### 7. Why can selecting a newly-created object cause extra renders?

**Strong answer:** The selector may produce a different object identity every run even when the underlying values are unchanged. Use narrower selectors or appropriate equality helpers when aggregating values.

### 8. What is the mental model for a Zustand store?

**Strong answer:** External source of truth → subscription → selector → selected result → React component render.

## Store design

### 9. Should every shared value go into one global Zustand store?

**Strong answer:** No. Store scope should match domain ownership and lifetime. Multiple stores or scoped store instances can be clearer than one giant singleton.

### 10. When is a singleton store appropriate?

**Strong answer:** When the state is genuinely application-wide and safe to share for the lifetime of the client application.

### 11. When should you create store instances per feature?

**Strong answer:** When multiple feature instances need isolated state, when SSR/request boundaries require isolation, or when dependency injection/testing benefits from explicit store instances.

### 12. What is the slice pattern?

**Strong answer:** A convention for composing related state/actions into logical slices of a larger store. It is an organization pattern, not a requirement of Zustand itself.

### 13. Where should derived state live?

**Strong answer:** Prefer deriving values during selection or via reusable selectors when they can be calculated from existing state. Avoid storing duplicated derived values unless there is a specific consistency/performance reason.

## Async and side effects

### 14. Can Zustand actions be async?

**Strong answer:** Yes. Actions may await work and call `set` afterward. But server-state fetching/caching concerns can still be better served by a dedicated server-state library.

### 15. Would you build API caching, retries, stale data, pagination, and invalidation manually in Zustand?

**Strong answer:** Usually no. That is server-state infrastructure and is better handled by TanStack Query, RTK Query, or another purpose-built cache unless requirements are unusually simple.

### 16. How do you avoid race-condition bugs in async store actions?

**Strong answer:** Treat request identity/cancellation/order as explicit concerns. Do not assume the last request started will be the last request resolved.

## Middleware and persistence

### 17. What does persistence middleware solve?

**Strong answer:** Synchronizing selected store state to a persistence layer such as browser storage and restoring it later.

### 18. What is the biggest persistence mistake?

**Strong answer:** Persisting the whole store without considering sensitivity, schema evolution, expiry, user boundaries, and whether the value should survive a reload at all.

### 19. Why do persisted stores need migrations?

**Strong answer:** Stored data can outlive application releases. When the schema changes, old persisted state may no longer match the new application model.

### 20. What does devtools middleware provide?

**Strong answer:** Integration with Redux DevTools-style inspection so state changes can be observed more easily during development.

### 21. Does DevTools mean Zustand should be used instead of Redux Toolkit?

**Strong answer:** No. Tooling is only one dimension. Choose based on ownership, conventions, event model, middleware needs, team size, and complexity.

## SSR and hydration

### 22. What is the key SSR risk with a global Zustand singleton?

**Strong answer:** Accidentally sharing user/request state across server requests if the server process reuses the singleton.

### 23. What does request isolation mean?

**Strong answer:** Create state for each request or appropriate server-rendering scope instead of using a server-global mutable store for request-specific data.

### 24. Why can hydration fail with persisted/client-only state?

**Strong answer:** The client’s first rendered state can differ from the server-rendered HTML. Hydration requires the initial client tree to match the server snapshot closely enough for React to attach safely.

### 25. How would you approach a Zustand store in an SSR application?

**Strong answer:** Use explicit store creation, request-safe scope, deterministic initial state, and a hydration strategy that avoids reading client-only persisted data too early.

### 26. Is SSR/hydration automatically solved by Zustand?

**Strong answer:** No. The application/framework must define store lifetime and initial snapshots correctly.

## TypeScript and testing

### 27. What should you type in a Zustand store?

**Strong answer:** State shape, action signatures, and domain values. Let the store creator infer what it can while keeping public store contracts explicit.

### 28. Why are store factories useful in tests?

**Strong answer:** Each test can get fresh isolated state instead of mutating one shared singleton across test cases.

### 29. What should UI tests assert?

**Strong answer:** User-visible behavior resulting from store updates, not private internal implementation details.

### 30. How would you test persistence?

**Strong answer:** Test the persisted contract separately: selected fields, serialization, restoration, migrations, and behavior when storage contains invalid/old data.

## Performance

### 31. What is the first performance lever in Zustand?

**Strong answer:** Subscription design. Select only what the component needs and measure before adding custom equality logic.

### 32. Does splitting a store into multiple stores automatically improve performance?

**Strong answer:** Not necessarily. It can improve ownership and subscription scope, but the actual render/update behavior depends on how components subscribe.

### 33. Why is returning stable action functions useful?

**Strong answer:** Components selecting actions can keep a stable selected identity instead of seeing the action reference change on unrelated updates.

## Architecture comparisons

### 34. Zustand vs Context?

**Strong answer:** Context distributes values through a React tree and is often good for subtree-scoped dependencies and lower-frequency shared state. Zustand is an external store with selector subscriptions and store utilities outside React.

### 35. Zustand vs Redux Toolkit?

**Strong answer:** Zustand emphasizes a small flexible store API. Redux Toolkit gives a stronger event/reducer model, standardized middleware, DevTools traceability, RTK Query integration, and conventions that can help large teams.

### 36. Zustand vs TanStack Query?

**Strong answer:** Zustand is primarily client-owned state; TanStack Query is server-state infrastructure. They frequently belong in the same application for different concerns.

### 37. Zustand vs `useReducer`?

**Strong answer:** `useReducer` keeps ownership in React and is often ideal for local/subtree state transitions. Zustand externalizes ownership and provides subscriptions outside a specific component tree.

### 38. When is Zustand overkill?

**Strong answer:** When state is local, simple, or naturally lifted a small distance. Adding a store can obscure ownership if there is no real sharing problem.

### 39. When is Zustand too weak as the main architecture choice?

**Strong answer:** When the organization needs stricter event conventions, standardized side-effect infrastructure, extensive traceability, or governance that Redux Toolkit’s model provides more naturally.

### 40. Senior scenario: one Zustand store contains UI state, API responses, server errors, form drafts, authentication tokens, and tenant data. What do you change?

**Strong answer:** Reclassify by ownership. Move server data to a server-state cache, complex forms to form state, keep credentials out of unsafe persistence, separate tenant-scoped data, and split genuinely shared client state by domain/lifetime. The problem is not the size of the object—it is mixed ownership.

## Rapid-fire checks

1. Store lives inside React? **No, it is external.**
2. Selectors matter? **Yes.**
3. Async actions allowed? **Yes.**
4. Persistence always safe? **No.**
5. One global store required? **No.**
6. SSR singleton always safe? **No.**
7. Zustand replaces TanStack Query? **No.**
8. Derived state should always be stored? **No.**
9. Fresh store per test can help? **Yes.**
10. Context and Zustand can coexist? **Yes.**

## Official references

- https://zustand.docs.pmnd.rs/reference/apis/create
- https://zustand.docs.pmnd.rs/learn/guides/auto-generating-selectors
- https://zustand.docs.pmnd.rs/learn/guides/ssr-and-hydration
