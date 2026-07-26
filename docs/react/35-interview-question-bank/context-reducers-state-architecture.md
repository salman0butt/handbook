---
title: Context, Reducers, and State Architecture Questions
description: React interview questions covering Context, reducers, state ownership, URL/server/external state, and useSyncExternalStore.
sidebar_position: 5
---

# Context, Reducers, and State Architecture Questions

## 1. What problem does Context solve?

**Strong answer:** Context lets descendants read values from a provider without passing those values through every intermediate component as props.

## 2. Is Context a state-management system?

**Strong answer:** Context is primarily a distribution mechanism. State can be stored above a provider and distributed through Context, but Context itself does not define transitions, persistence, caching, undo, server synchronization, or selective subscription strategy.

## 3. What is prop drilling?

**Strong answer:** Passing props through components that do not need the value themselves only so deeper descendants can receive it. It can be inconvenient, but explicit props are not inherently bad.

## 4. When should you not use Context?

**Strong answer:** When data is only needed by a few nearby components, props/composition may be clearer. Context can also be a poor fit for very high-frequency shared updates if broad rerenders become expensive.

## 5. How does Context cause rerenders?

**Strong answer:** Consumers reading a Context are updated when the provider's value changes according to React's value comparison semantics. If the provider creates a new object every render, consumers may rerender more broadly than intended.

## 6. How do you optimize Context usage?

**Strong answer:** First improve ownership and provider scope. Split unrelated contexts, avoid unnecessary unstable value objects, keep fast-changing state local where possible, and use external stores/selective subscriptions when the update model calls for them.

## 7. Should you wrap every Context value in `useMemo`?

**Strong answer:** No. Measure or reason about actual update breadth. With React Compiler and good provider architecture, ritual memoization is not a substitute for correct ownership.

## 8. What is provider placement?

**Strong answer:** Choosing the smallest meaningful subtree that needs a shared dependency/state. Putting providers too high can widen update scope and hide ownership.

## 9. What changed about Context provider syntax in React 19?

**Strong answer:** A context object can be rendered directly as a provider, e.g. `<ThemeContext value={theme}>`, instead of always using `<ThemeContext.Provider>`.

## 10. Can Context replace dependency injection?

**Strong answer:** It can act as dependency injection for React subtrees by supplying services/configuration to descendants, but you still need clear contracts, ownership, and test seams.

## 11. What is a reducer?

**Strong answer:** A pure function that receives current state and an action and returns the next state. It centralizes transition logic rather than scattering related setters.

## 12. What is `useReducer`?

**Strong answer:** A Hook that manages state using a reducer and returns the current state plus a dispatch function.

## 13. When is `useReducer` better than `useState`?

**Strong answer:** When transitions are related, complex, event-oriented, or benefit from explicit action modeling and centralized invariants.

## 14. When is `useState` better than `useReducer`?

**Strong answer:** Simple independent state where a reducer would add ceremony without improving clarity.

## 15. Why must reducers be pure?

**Strong answer:** React may invoke reducer logic more than once in development checks and expects transitions to be deterministic. Side effects belong outside reducers.

## 16. What should a reducer action contain?

**Strong answer:** Enough information to describe what happened or what transition is requested, ideally using domain language rather than coupling callers to the state's internal shape.

## 17. Why are discriminated unions useful for reducer actions in TypeScript?

**Strong answer:** They make valid action variants explicit and allow exhaustive handling, preventing impossible payload combinations.

## 18. What is lazy reducer initialization?

**Strong answer:** Passing an initializer function to `useReducer` so expensive initial-state construction runs as initialization rather than on every render.

## 19. Reducer + Context — when is it useful?

**Strong answer:** For a subtree that needs shared state plus explicit transitions. Context distributes state/dispatch while the reducer owns transition logic.

## 20. What are the downsides of reducer + Context as a global store?

**Strong answer:** Broad update propagation, limited selective subscriptions, provider coupling, and the temptation to centralize unrelated state. It works well at appropriate scope, not automatically as an application-wide store.

## 21. What is state normalization?

**Strong answer:** Storing entities in a shape that avoids duplication, commonly by ID, so multiple views derive from one canonical record rather than copying nested objects everywhere.

## 22. What is canonical state?

**Strong answer:** The authoritative source from which other values should be derived. Good architecture makes the canonical owner clear.

## 23. What are the common state categories in a React app?

**Strong answer:** Local UI state, shared client state, URL/navigation state, server state, external-store state, form/draft state, refs for non-rendering mutable values, and derived values.

## 24. Why classify state before selecting a library?

**Strong answer:** Different categories have different lifecycle and synchronization requirements. Choosing a store first can force unrelated concerns into one mechanism.

## 25. What belongs in URL state?

**Strong answer:** State that should survive reloads, be linkable/bookmarkable, interact with back/forward navigation, or represent navigation/filter/search context.

## 26. What belongs in server state?

**Strong answer:** Data whose authority is remote and whose lifecycle involves fetching, freshness, invalidation, retries, caching, mutation coordination, and authorization.

## 27. Why is copying server data into a global client store often problematic?

**Strong answer:** It creates another cache/source of truth and requires synchronization/invalidation logic. Sometimes deliberate snapshots are appropriate, but duplication should be explicit.

## 28. What is an external store?

**Strong answer:** State managed outside React that components subscribe to, such as a standalone state container, browser API, or custom observable source.

## 29. What is `useSyncExternalStore`?

**Strong answer:** The React Hook for safely subscribing to external stores with a consistent snapshot model that works with concurrent rendering and server rendering requirements.

## 30. Why not just subscribe in `useEffect` and call `setState`?

**Strong answer:** That approach can produce tearing or inconsistent snapshots under concurrent rendering. `useSyncExternalStore` gives React the subscription and snapshot semantics it needs.

## 31. What is tearing?

**Strong answer:** Different parts of the UI observe inconsistent versions of external state during one logical render/commit sequence.

## 32. What are `subscribe` and `getSnapshot` responsibilities?

**Strong answer:** `subscribe` notifies React when the external store may have changed. `getSnapshot` returns the current immutable/logically stable snapshot React compares between reads.

## 33. Why must `getSnapshot` be stable when nothing changed?

**Strong answer:** Returning a brand-new value every read can make React believe the store changed continuously and cause unnecessary or looping updates.

## 34. What is `getServerSnapshot` for?

**Strong answer:** It provides the snapshot used during server rendering/hydration so initial server and client views can agree.

## 35. Redux vs Context — what is the real comparison?

**Strong answer:** Context distributes values through a React tree. Redux-like stores provide external state containers with explicit update/subscription patterns, tooling, selectors, middleware, and architecture conventions. They solve overlapping but not identical problems.

## 36. Zustand vs Context?

**Strong answer:** Zustand is an external-store library with selective subscriptions and store APIs. Context is built into React for subtree value distribution. Choose based on state category, update frequency, scope, ecosystem constraints, and team needs.

## 37. TanStack Query vs Redux?

**Strong answer:** A query library specializes in remote/server state—caching, fetching, invalidation, retries, freshness. Redux is a general client-side state architecture. They may coexist because they address different categories.

## 38. Why can one giant global store hurt architecture?

**Strong answer:** It weakens feature ownership, increases coupling, broadens dependencies, complicates lifecycle/reuse/testing, and makes every state problem look global.

## 39. What is selector-based subscription?

**Strong answer:** A consumer subscribes to only the slice it needs so unrelated store changes do not require that consumer to update.

## 40. When would you split Contexts?

**Strong answer:** When values have different ownership, consumers, or update frequencies. Splitting only for cosmetic organization is less useful than splitting to improve contracts and update boundaries.

## 41. How do you model a state machine in React?

**Strong answer:** Represent valid states explicitly and define events/transitions between them, often with a reducer or dedicated state-machine library. This avoids impossible boolean combinations.

## 42. Reducer vs state machine?

**Strong answer:** A reducer is a state transition function. A formal state machine adds explicit states, allowed transitions, guards, effects, and often visualization/tooling. Reducers can implement state-machine thinking without a library.

## 43. What is optimistic state vs authoritative state?

**Strong answer:** Optimistic state is a temporary prediction for responsiveness. Authoritative state is the confirmed source, often the server. Architecture must reconcile conflicts and failures.

## 44. How do you decide whether Context performance is actually a problem?

**Strong answer:** Profile the interaction, identify which consumers rerender and their cost, inspect provider value changes, then change architecture only if the evidence shows meaningful waste.

## 45. Senior question: design state for a complex dashboard.

**Strong answer:** Keep ephemeral widget UI local, filters/navigation in URL when shareable, remote records in a server-state layer, realtime feeds in a selective external store if needed, shared low-frequency configuration in Context, and derive aggregates rather than duplicate them.

## 46. Senior question: how do you migrate away from a giant global store?

**Strong answer:** Inventory slices and consumers, classify each state category, establish new owners/boundaries, migrate feature-by-feature behind adapters/selectors, add tests/telemetry, and remove old slices only after traffic and behavior validate the migration.

## 47. Senior question: how do you choose a state library?

**Strong answer:** Start with requirements: state category, update frequency, selector needs, persistence, devtools, SSR/RSC compatibility, bundle/runtime constraints, team familiarity, migration cost, and ecosystem health. Then compare libraries, not before.

## 48. Staff question: what state rules would you standardize across teams?

**Strong answer:** Canonical ownership, local-first default, server-state separation, URL-state rules, external-store criteria, no hidden cross-feature imports, selector/update-budget guidance, testing requirements, migration/deprecation policy, and observable contracts.

## 49. Staff question: how do you reduce cross-team state coupling?

**Strong answer:** Feature-owned public APIs, narrow events/contracts, route/server boundaries, shared platform primitives only for stable concerns, ADRs for new shared stores, and tooling/dependency rules that prevent arbitrary imports into another team's internals.

## 50. What is the key interview principle for state architecture?

**Strong answer:** **Ownership before library.** First decide what the state represents, who owns it, who reads/writes it, how long it lives, and what authority governs it. Then select the mechanism.