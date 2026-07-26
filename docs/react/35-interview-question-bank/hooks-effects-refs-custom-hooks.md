---
title: Hooks, Effects, Refs, and Custom Hooks Questions
description: React interview questions covering Hook rules, Effects, dependencies, stale closures, cleanup, refs, layout/insertion effects, Effect Events, and custom Hooks.
sidebar_position: 4
---

# Hooks, Effects, Refs, and Custom Hooks Questions

## 1. What are Hooks?

**Strong answer:** Hooks are React functions that let components use React features such as state, context, refs, effects, transitions, and external-store subscriptions. They rely on React controlling component execution and stable Hook call ordering.

## 2. What are the Rules of Hooks?

**Strong answer:** Call Hooks at the top level of React components or custom Hooks, not inside ordinary conditions, loops, nested functions, or callbacks. The special `use` API has different conditional/loop rules, but ordinary Hooks depend on stable call order.

## 3. Why does Hook order matter?

**Strong answer:** React associates Hook state with call positions in a component's render. Changing call order changes which Hook call corresponds to which stored state.

## 4. Why can't you call Hooks from ordinary functions?

**Strong answer:** React needs to know the call happens as part of a component or custom Hook render so it can track Hook state and scheduling correctly.

## 5. What makes a custom Hook a Hook?

**Strong answer:** It is a function whose name starts with `use` and that composes Hooks to encapsulate reusable stateful or synchronization logic. It does not share state automatically between callers; each call gets its own Hook state unless they connect to shared external state.

## 6. What is `useEffect` for?

**Strong answer:** Synchronizing a component with an external system after render/commit, such as a network connection, browser API, event subscription, timer, third-party widget, or non-React system.

## 7. What is an Effect not for?

**Strong answer:** It is not a general place to put any code that should run after render. Derived values, event-driven logic, state transitions, and internal data flow often do not need Effects.

## 8. Why can unnecessary Effects cause bugs?

**Strong answer:** They introduce extra render cycles, duplicate state, synchronization races, dependency complexity, and hidden causal relationships.

## 9. How do you decide whether code belongs in an Effect?

**Strong answer:** Ask whether the component must synchronize with something outside React because of current rendered state. If the logic is caused by a user event, it often belongs in the event handler. If it only derives data, calculate during render.

## 10. What does the dependency array mean?

**Strong answer:** It lists reactive values the Effect reads whose changes require the synchronization process to be re-established or re-run.

## 11. Is the dependency array an optimization list?

**Strong answer:** No. It describes the reactive dependencies of the Effect. Omitting values to reduce runs can create stale behavior.

## 12. Why does ESLint warn about missing dependencies?

**Strong answer:** Because the Effect reads reactive values from its closure. Missing dependencies can make the Effect observe stale values while pretending synchronization is still correct.

## 13. How should you handle an Effect dependency that changes every render?

**Strong answer:** First question whether the Effect is necessary. Then inspect whether an object/function can be created inside the Effect, whether state can be derived differently, or whether a stable identity is semantically needed. Do not reflexively use `useCallback` everywhere.

## 14. What is a stale closure?

**Strong answer:** A function captures values from the render where it was created. If long-lived async logic expects future values without re-synchronizing or using an appropriate pattern, it can act on stale state/props.

## 15. How do you fix stale closure bugs?

**Strong answer:** Depending on the case: use correct dependencies, functional state updates, refs for mutable latest values when semantically appropriate, or `useEffectEvent` for non-reactive Effect event logic.

## 16. What is Effect cleanup?

**Strong answer:** The function returned from an Effect that undoes the synchronization established by that Effect—unsubscribe, disconnect, clear timer, abort work, release resources, etc.

## 17. When does cleanup run?

**Strong answer:** Before the Effect is re-established with changed dependencies and when the component unmounts. Development Strict Mode may also perform an extra setup/cleanup cycle to expose mistakes.

## 18. Why does Strict Mode run setup/cleanup extra times in development?

**Strong answer:** To reveal logic that is not safely repeatable or lacks cleanup. Production does not simply duplicate every Effect for no reason.

## 19. How do you avoid race conditions in data fetching Effects?

**Strong answer:** Ensure stale requests cannot update current state—using cancellation such as `AbortController`, request identity checks, or a framework/data layer that manages races. Also question whether direct Effect fetching is the best architecture.

## 20. What is `AbortController` useful for?

**Strong answer:** It provides a standard cancellation signal for APIs such as `fetch`, allowing cleanup to cancel obsolete work.

## 21. What happens if an async Effect callback itself returns a Promise?

**Strong answer:** An Effect callback should return either cleanup or nothing, not a Promise. Define and invoke an async function inside the Effect, then return synchronous cleanup.

## 22. Can Effects run during server rendering?

**Strong answer:** Client Effects do not run during server rendering. They run after the client commits/hydrates relevant content.

## 23. `useEffect` vs `useLayoutEffect`?

**Strong answer:** `useEffect` is preferred for most synchronization because it does not intentionally block paint. `useLayoutEffect` runs before browser repaint after DOM updates, useful for measurement or visual corrections that must happen before paint.

## 24. Why can `useLayoutEffect` hurt performance?

**Strong answer:** Work there can block browser paint. Keep it small and only use it when pre-paint timing is required.

## 25. What is `useInsertionEffect`?

**Strong answer:** A specialized Hook mainly intended for CSS-in-JS libraries to insert styles before layout effects need to read layout. It is not a general application Effect replacement.

## 26. What is `useEffectEvent`?

**Strong answer:** A React 19.2 Hook for extracting non-reactive event-like logic that is fired from an Effect while still reading the latest committed props/state without making those values Effect dependencies.

## 27. When should you use `useEffectEvent`?

**Strong answer:** When some logic conceptually belongs to an event triggered from an Effect and should see latest values without causing the Effect's synchronization lifecycle to restart.

## 28. Is `useEffectEvent` a dependency escape hatch?

**Strong answer:** No. Do not wrap code merely to silence dependency warnings. Use it when the logic is genuinely non-reactive Effect-event logic.

## 29. Can an Effect Event be called from a click handler?

**Strong answer:** No. Effect Events are intended to be called from Effects or other Effect Events in the same component/Hook. Use a regular function for user events.

## 30. Are functions returned by `useEffectEvent` stable?

**Strong answer:** No. Their identity intentionally changes; they should not be included in Effect dependency arrays or passed around as general callbacks.

## 31. What is `useRef`?

**Strong answer:** It returns a stable object whose `.current` value can be mutated without triggering a render. Refs are useful for DOM nodes, imperative handles, mutable instance-like values, and data that should persist but is not render-driving state.

## 32. Ref vs state?

**Strong answer:** State is for values that affect rendered output and schedules renders. Ref mutation does not trigger rendering and should not be used as hidden UI state.

## 33. Why is reading/writing refs during render usually unsafe?

**Strong answer:** Render should be pure and retryable. Arbitrary ref mutation can create hidden side effects or order-dependent behavior. There are narrow initialization patterns, but general mutable work belongs outside render.

## 34. How do DOM refs work?

**Strong answer:** Attach a ref to a host element. React sets the ref when the node is committed and clears it when detached/unmounted.

## 35. Object ref vs callback ref?

**Strong answer:** Object refs expose `.current`. Callback refs run when a node is attached/detached and are useful for dynamic collections or custom setup/cleanup.

## 36. What changed about ref callbacks in React 19?

**Strong answer:** Ref callbacks may return a cleanup function. React can call that cleanup when the element detaches rather than relying only on a callback receiving `null`.

## 37. What is `useImperativeHandle`?

**Strong answer:** It customizes the imperative value exposed through a ref, allowing a component to expose a narrow imperative API instead of the entire underlying DOM node.

## 38. Is `forwardRef` still the default pattern in React 19?

**Strong answer:** No. Function components can receive `ref` as a prop in React 19, so new code does not need `forwardRef` as the standard pattern. It remains important for existing libraries and migration knowledge.

## 39. What is `useId`?

**Strong answer:** It generates IDs suitable for linking accessibility attributes such as label/input or description relationships, including SSR/hydration-safe coordination.

## 40. Should `useId` generate list keys?

**Strong answer:** No. Keys should come from data identity. `useId` is not a substitute for stable item IDs.

## 41. What is `useDebugValue`?

**Strong answer:** It lets custom Hooks expose a readable label/value to React DevTools, useful for library or shared Hook diagnostics.

## 42. What makes a good custom Hook API?

**Strong answer:** It encapsulates one coherent behavior, has a clear input/output contract, hides synchronization details, avoids surprising global coupling, and follows Hook rules and dependency semantics.

## 43. Should every repeated block of code become a custom Hook?

**Strong answer:** No. Extract when the repeated logic represents reusable React behavior. Pure calculations may be ordinary functions; duplicated JSX may be a component.

## 44. Do two components calling the same custom Hook share state?

**Strong answer:** No, not unless the Hook connects them to shared Context/external state. Each call receives independent Hook state.

## 45. How do you test a custom Hook?

**Strong answer:** Prefer testing behavior through a component when practical, especially if the Hook is an implementation detail. For reusable libraries, focused Hook tests can be appropriate but should still assert observable behavior rather than internal call counts.

## 46. How do you explain an infinite Effect loop?

**Strong answer:** The Effect schedules an update, that update changes a dependency or causes an unstable dependency to appear changed, so the Effect runs again. Fix the causal model rather than suppressing lint rules.

## 47. Why can `useEffect(() => setX(derive(y)), [y])` be a smell?

**Strong answer:** If `x` is purely derived from `y`, the Effect introduces duplicated state and an extra render. Compute `derive(y)` during render unless there is a real synchronization or historical-state requirement.

## 48. Why can `useEffect` data fetching cause waterfalls?

**Strong answer:** Child fetching may not begin until parents render and commit, creating sequential network starts. Framework loaders, server rendering, or data-layer preloading can start requests earlier and coordinate caching.

## 49. Senior question: how would you review an Effect-heavy codebase?

**Strong answer:** Classify each Effect: external synchronization, event-driven logic, derived state, data fetching, subscription, DOM integration. Remove internal-data-flow Effects, verify cleanup/cancellation, inspect dependencies, then improve ownership and data-loading architecture.

## 50. Senior question: what does “refs are an escape hatch” mean?

**Strong answer:** Refs let code step outside React's declarative render-driven model for imperative integration or mutable instance data. They are valuable but should not become an alternate hidden state system that bypasses React's update model.