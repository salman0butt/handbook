---
id: chapters-041-060
title: 041–060 — Events, State, Effects & Navigation
---

# 041 — Touch Events and Responder Thinking

Touch interaction is continuous input interpreted into presses, pans, pinches, scrolls, and gestures. React Native's responder system coordinates which view owns a touch sequence. For normal buttons, use `Pressable`; for complex gestures, prefer Gesture Handler rather than manually rebuilding recognizers. Understand cancellation: a finger can start on one target and become a scroll, navigation gesture, or interrupted interaction.

# 042 — Keyboard Events and Focus

The software keyboard changes viewport pressure and user flow. The `Keyboard` API can observe show/hide events where supported; input refs manage focus. Android `windowSoftInputMode` and iOS keyboard behavior differ. Design focus order, next/submit behavior, scroll-to-error, dismissal, and input accessory behavior deliberately rather than adding ad-hoc padding when the keyboard overlaps content.

# 043 — Pointer Events and Web Mental-Model Differences

React Native supports an evolving pointer-event model, but native hit testing and gesture recognizers remain distinct from browser DOM propagation. Do not assume every web `pointer*`, capture, hover, or CSS `pointer-events` behavior maps one-to-one. Test mouse/trackpad/stylus only when target devices require them and verify against the RN version's current API surface.

# 044 — Local State and Derived State

Keep transient UI state near the component that owns it. Compute derived values from source state rather than synchronizing duplicates with effects. If `fullName` is always `firstName + lastName`, it is not independent state. Mobile applications become brittle when screens copy server/cache/navigation values into local state and then attempt to reconcile them manually.

# 045 — Lifting State and State Ownership

Lift state to the nearest common owner that must coordinate it. Avoid placing all screen state in a global store just because multiple components exist. A useful decision tree is:

```text
server-owned? → server-state cache
URL/deep-link/navigation concern? → navigation params/state
single feature? → feature state
cross-cutting client state? → external store/context
```

Ownership should match lifecycle and invalidation rules.

# 046 — Context

Context transports values through a tree; it is not automatically a complete state architecture. Good uses include theme, auth/session interface, dependency injection, and stable feature context. Frequently changing large context values can rerender broad subtrees, so split contexts by responsibility and stabilize provider values where beneficial.

# 047 — Reducers and useReducer

Reducers centralize state transitions when updates are event-oriented or multiple fields change together. Make actions model domain events instead of setter names where possible. Reducers should remain pure, with effects/API calls outside. A reducer is often better than many interdependent `useState` calls but does not automatically need Redux.

# 048 — Redux Toolkit

Redux Toolkit is appropriate for substantial shared client state, deterministic event flows, middleware, dev tooling, and organization-wide patterns. Use slices and selectors; normalize large entity collections when useful. Do not store every query response in Redux if TanStack Query already owns server state. Keep native SDK wrappers and side effects behind services/listeners/thunks rather than in reducers.

# 049 — Zustand

Zustand provides a lightweight external store with selector-based subscriptions. It can be effective for cross-screen client state such as drafts, local preferences, or workflow state. Keep store boundaries cohesive and avoid one giant mutable bucket. Subscribe to narrow slices to limit rerenders and define persistence explicitly rather than persisting the whole store by default.

# 050 — Choosing State Tools

No single store should own every kind of state. A production app commonly uses local React state, navigation state, TanStack Query for remote state, a small global client store, and platform persistence. Senior design asks: who is authoritative, how long does it live, who invalidates it, and should it survive process death?

# 051 — useEffect Mental Model

Effects synchronize React with systems outside rendering: subscriptions, timers, native event emitters, imperative SDKs, network processes not delegated to a server-state library. If an effect only computes React data from React data, it is usually unnecessary. Effects run after rendering and may re-run; write them to survive repeated setup/cleanup.

# 052 — Effect Cleanup and Native Subscriptions

Always understand the unsubscribe contract. AppState, Dimensions, Keyboard, native emitters, sockets, timers, and observers can retain callbacks after a screen leaves if cleanup is forgotten.

```ts
useEffect(() => {
  const sub = AppState.addEventListener('change', onChange);
  return () => sub.remove();
}, [onChange]);
```

Leaks can become duplicate events, unexpected setState calls, battery work, or retained screens.

# 053 — Stale Closures and Dependencies

Effects and callbacks capture values from the render that created them. Missing dependencies can make listeners, timers, retries, and navigation callbacks use stale state. Prefer restructuring state/effects rather than disabling lint warnings blindly. Use refs only when mutable current-value semantics are intentional.

# 054 — AppState and Mobile Lifecycle

`AppState` exposes coarse application states such as active/background/inactive depending on platform. Use it to pause/resume work, integrate server-state focus handling, protect sensitive screens, and reconnect resources. Do not assume background means JavaScript keeps running indefinitely; the OS can suspend or terminate the process.

# 055 — Navigation Architecture

Navigation is application state plus native transitions/history semantics. React Navigation remains a widely used standard for bare RN apps. Put a single `NavigationContainer` at the appropriate root and compose navigators around product flows rather than creating deeply nested stacks without purpose.

# 056 — Native Stack, Stack, Tabs & Drawer

Native stack uses platform-native navigation primitives for performant transitions and gestures. Bottom tabs model top-level destinations; drawers suit particular information architectures but are not universally mobile-native. Nest navigators only when the nested state/history behavior is desired. Treat each navigator as a state machine with its own back behavior.

# 057 — Navigation Params and TypeScript

Params should identify navigation intent, not carry giant mutable domain objects. Type route parameter lists and screen props so invalid routes fail at compile time. Prefer IDs and small serializable values; obtain current server/domain data from its owner. Serializable navigation state also makes restoration and deep linking easier to reason about.

# 058 — Authentication Flows

Model auth as conditional navigation structure rather than imperatively resetting random screens on every login event. Bootstrap stored credentials/session, show a splash/loading state, then render authenticated or unauthenticated route groups. Logout should invalidate sensitive server cache, revoke/clear credentials, reset feature state, and replace reachable navigation state.

# 059 — Screen Focus and Lifecycle

A screen may remain mounted while losing focus. Use navigation focus hooks/events when work depends specifically on visibility, and normal React cleanup when it depends on mount lifetime. Avoid fetching everything on every focus without a staleness policy; server-state tools can integrate focus with cache freshness.

# 060 — Deep Linking and State Restoration Foundations

Navigation should have a deterministic mapping between external URLs and internal route state. Configure link prefixes/paths, parse and validate params, and design unknown/unauthorized routes. State restoration can improve UX but must not resurrect expired authenticated flows or incompatible navigation schemas after an app update.