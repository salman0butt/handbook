---
title: Performance, Compiler, Suspense, and Concurrency Questions
description: React interview questions covering profiling, memoization, React Compiler, Suspense, transitions, deferred values, Activity, and scheduling mental models.
sidebar_position: 6
---

# Performance, Compiler, Suspense, and Concurrency Questions

## 1. How do you optimize a React application?

**Strong answer:** Measure first. Identify whether the bottleneck is rendering, network, JavaScript execution, bundle size, hydration, layout/paint, or external work. Then optimize the actual bottleneck instead of adding memoization everywhere.

## 2. What tools do you use to profile React?

**Strong answer:** React DevTools Profiler, `<Profiler>`, React Performance Tracks, browser Performance/Network tools, bundle analysis, application telemetry, and server traces where relevant.

## 3. What does React DevTools Profiler show?

**Strong answer:** Which components rendered, how long commits/renders took, and why work may have happened, helping locate expensive subtrees or cascading updates.

## 4. What is `<Profiler>`?

**Strong answer:** A built-in component that measures render performance for a subtree and reports timing data through its callback.

## 5. What are React Performance Tracks?

**Strong answer:** React 19.2 DevTools/browser performance integrations that expose React scheduler, component, and server-related activity to help connect user interactions with React work.

## 6. What is `memo`?

**Strong answer:** `memo` can let React skip re-rendering a component when its props compare equal. It is a performance optimization, not a correctness mechanism.

## 7. Does `memo` guarantee a component will never re-render with equal props?

**Strong answer:** No. It is an optimization hint and other causes such as state or Context updates still matter.

## 8. Why can `memo` be useless?

**Strong answer:** If props change every render, rendering is cheap, Context/state still updates, or comparison cost offsets saved work.

## 9. What is `useMemo`?

**Strong answer:** It caches a calculated value between renders when dependencies are unchanged. Use it for measured expensive calculations or when stable identity is semantically useful to another optimization/API.

## 10. What is `useCallback`?

**Strong answer:** It caches a function identity between renders based on dependencies. It does not make the function body execute faster.

## 11. `useMemo` vs `useCallback`?

**Strong answer:** `useMemo` caches a returned value. `useCallback` caches the function itself.

## 12. Why not use `useCallback` for every handler?

**Strong answer:** It adds dependency and cognitive overhead, may not save any work, and modern React Compiler can handle many ordinary memoization cases automatically.

## 13. When is stable function identity semantically important?

**Strong answer:** When integrating with an API that uses function identity for subscription/unsubscription, when a memoized child relies on prop identity, or when a dependency genuinely needs stability.

## 14. Why can object props defeat `memo`?

**Strong answer:** A newly created object has a different identity even if contents are equivalent, so shallow prop comparison sees a change.

## 15. Should you solve that by wrapping every object in `useMemo`?

**Strong answer:** No. First check whether the child needs memoization and whether the render is expensive. Improve ownership/data shape before adding identity machinery.

## 16. What is React Compiler?

**Strong answer:** A build-time optimizer that analyzes React code and can automatically memoize components and expressions while preserving React semantics.

## 17. Is React Compiler a runtime scheduler?

**Strong answer:** No. It transforms code at build time. Runtime concurrency/scheduling is a separate React behavior.

## 18. Does React Compiler eliminate `memo`, `useMemo`, and `useCallback`?

**Strong answer:** No. It reduces many routine manual memoization needs, but those APIs still exist for explicit control, semantic identity requirements, interoperability, or cases the compiler cannot optimize.

## 19. Should you delete all existing manual memoization after enabling Compiler?

**Strong answer:** No. Measure and remove selectively. Existing memoization can encode required identity behavior or protect expensive work.

## 20. What are `"use memo"` and `"use no memo"`?

**Strong answer:** Compiler directives that affect compilation strategy for specific scopes. They should be used deliberately, not as general performance rituals.

## 21. What happens if Compiler cannot safely optimize code?

**Strong answer:** Compiler diagnostics/linting can identify unsupported or invalid patterns, and React can skip compilation for affected functions rather than making the whole app unusable.

## 22. Why do Rules of React matter for Compiler?

**Strong answer:** Purity, immutability, stable Hook behavior, and static component identity make code analyzable and safe to optimize.

## 23. What is concurrency in React?

**Strong answer:** React can prioritize, interrupt, restart, and abandon render work so urgent interactions stay responsive. It does not mean JavaScript component code runs on multiple CPU threads by default.

## 24. What is an urgent update?

**Strong answer:** Work that should reflect immediately for direct interaction, such as the text value in an input while the user types.

## 25. What is a Transition?

**Strong answer:** A way to mark certain state updates as non-urgent so React can keep urgent UI responsive while rendering the transition in the background.

## 26. What is `startTransition`?

**Strong answer:** It marks state updates executed within its callback as transition work.

## 27. What is `useTransition`?

**Strong answer:** It provides `startTransition` plus `isPending`, allowing a component to mark non-urgent updates and reflect pending UI.

## 28. Can you use a Transition to control an input's immediate value?

**Strong answer:** Generally no. The input's controlled value should update urgently so typing remains synchronized. Transition the expensive derived/navigation work instead.

## 29. What does `isPending` mean?

**Strong answer:** A Transition started by that Hook is still pending. It is useful for subtle pending indicators without immediately replacing content with a loading screen.

## 30. What is `useDeferredValue`?

**Strong answer:** It lets a value used by an expensive subtree lag behind the latest urgent value so the urgent part can update first.

## 31. `useDeferredValue` vs debounce?

**Strong answer:** Deferred rendering changes React render priority; debounce changes when work/data requests are triggered over time. They solve different problems and can be combined.

## 32. Does `useDeferredValue` reduce network requests automatically?

**Strong answer:** No. It prioritizes rendering. If requests should be debounced/cancelled/deduplicated, that is a separate data-layer concern.

## 33. What is Suspense?

**Strong answer:** A boundary that coordinates what React shows while part of the tree is not ready because it suspended on a supported resource or lazy-loaded code.

## 34. Is Suspense a data-fetching API?

**Strong answer:** No. Suspense coordinates readiness/reveal. Data must come from a Suspense-enabled source/framework/resource pattern.

## 35. What causes a component to suspend?

**Strong answer:** It reads a supported asynchronous resource that is not ready, such as lazy-loaded code or framework/resource integration that communicates pending state to React.

## 36. What does a Suspense fallback represent?

**Strong answer:** UI React can reveal while the suspended content for that boundary is not ready.

## 37. What are nested Suspense boundaries useful for?

**Strong answer:** Coordinating progressive reveal so independent regions can appear when ready instead of blocking an entire page behind one fallback.

## 38. Why can too many Suspense boundaries be bad?

**Strong answer:** They can create noisy loading states, layout instability, and fragmented UX. Boundaries should match meaningful reveal units.

## 39. Suspense vs Error Boundary?

**Strong answer:** Suspense handles not-ready/pending rendering. Error Boundaries handle render-time errors in descendant trees. They often compose around the same feature boundary.

## 40. What is `lazy`?

**Strong answer:** It defers loading a component module until React needs to render it, integrating code splitting with Suspense.

## 41. How does code splitting improve performance?

**Strong answer:** It reduces initial JavaScript download/parse/execute cost by loading code closer to when it is needed.

## 42. What are the trade-offs of code splitting?

**Strong answer:** More requests, delayed first use of split features, loading-state complexity, cache behavior, and potential waterfalls if chunks/data are not preloaded intelligently.

## 43. What is `<Activity>` in React 19.2?

**Strong answer:** A built-in component for controlling visibility/activity of parts of the app while preserving useful state/structure and allowing React to prioritize hidden work differently.

## 44. When would Activity be preferable to conditional rendering?

**Strong answer:** When you want a subtree to become hidden without necessarily discarding all of its state/lifecycle context, depending on the intended UX and cost model.

## 45. What is render cost vs render frequency?

**Strong answer:** Render cost is how expensive one render is. Render frequency is how often it happens. Optimize the dimension that actually dominates the interaction.

## 46. How can state placement affect performance?

**Strong answer:** State high in the tree can cause broad render work. Keeping state near consumers limits update scope, while genuinely shared state belongs at a common owner or selective store.

## 47. How can Context affect performance?

**Strong answer:** Provider value changes can update many consumers. Split concerns by update frequency and ownership, and use selective external-store patterns for high-frequency shared data if needed.

## 48. What is virtualization?

**Strong answer:** Rendering only a visible window of a large collection instead of every item at once, reducing DOM size and render/layout cost.

## 49. When should you virtualize a list?

**Strong answer:** When measurement shows large collections create meaningful render/DOM/layout cost. Small lists do not need the complexity.

## 50. How do network waterfalls happen in React apps?

**Strong answer:** Requests start sequentially because child work only begins after parent rendering/data resolves. Route loaders, server rendering, preloading, query coordination, or parallel request design can start work earlier.

## 51. How do you diagnose a slow input?

**Strong answer:** Determine whether input state itself is slow or whether it triggers expensive sibling/subtree work. Profile, localize state, split expensive rendering, defer/transition non-urgent work, and optimize only measured hot paths.

## 52. How do you diagnose unnecessary rerenders?

**Strong answer:** Use Profiler/Performance Tracks, inspect state ownership, Context changes, unstable props, external store subscriptions, and cascading updates. A rerender is only a problem if it creates meaningful cost.

## 53. What is a cascading update?

**Strong answer:** One update triggers another after render/effect/commit, creating extra work that may have been avoidable with better data flow or direct derivation.

## 54. Why can setting state in an Effect hurt performance?

**Strong answer:** It often creates a render → commit → Effect → state update → second render cycle. If the value is derived, compute it during the original render.

## 55. Senior question: how do you create a performance budget?

**Strong answer:** Define user-facing targets for interaction latency, loading, bundle size, long tasks, rendering/commit cost, and key flows. Measure in CI and production, assign ownership, and prevent regressions rather than chasing isolated micro-optimizations.

## 56. Senior question: Compiler enabled but the app is still slow. What next?

**Strong answer:** Compiler primarily reduces certain rendering/memoization costs. Profile the real bottleneck: network, expensive algorithms, DOM/layout, too much rendered content, server latency, hydration, third-party scripts, high-frequency global updates, or architecture.

## 57. Senior question: when would you intentionally use manual memoization with Compiler?

**Strong answer:** When a stable identity is part of an external API contract, a measured expensive value needs explicit caching, library boundaries require predictable references, or the compiler cannot safely optimize a specific case.

## 58. Staff question: how do you improve performance across many teams?

**Strong answer:** Standardize measurement, production telemetry, performance budgets, component/store contracts, bundle governance, profiling playbooks, shared primitives, regression gates, and ownership. Avoid company-wide cargo-cult rules like “memo everything.”

## 59. Trick question: does fewer renders always mean faster?

**Strong answer:** No. Avoiding cheap renders may cost more comparison/memoization complexity than rendering. User-perceived latency is the goal, not minimizing a render counter.

## 60. What is the best performance principle to remember?

**Strong answer:** **Measure the user-visible bottleneck, then reduce or reprioritize the right work.**