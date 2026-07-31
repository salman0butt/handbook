---
id: live-coding-exercises
title: Live Coding Interview Exercises
---

# Live Coding Interview Exercises

Each task is intended for 15–35 minutes. Candidates should first state assumptions, data ownership and failure cases, then write the smallest correct TypeScript solution and explain Android/iOS implications when relevant.

## 1 — Debounced Search
**Problem:** implement a `useDebouncedValue<T>` hook and a search screen that does not request blank input. **Expected result:** one request after the user stops typing; obsolete timers are cleaned up. **Hint:** debounce the value, not the API client. **Solution:** keep the timer inside an effect keyed by `value`/`delay`, set debounced state after delay and clear the timeout in cleanup; fetch from the debounced value through TanStack Query. **Reasoning:** timer lifecycle belongs to the input value transition. **Common mistake:** storing timeout IDs in component state or letting old responses overwrite newer query keys.

## 2 — Paginated FlatList
**Problem:** render cursor-paginated products. **Expected result:** initial load, next-page loading footer, terminal cursor and retry. **Hint:** model pages separately from rows. **Solution:** use an infinite query keyed by filters, flatten pages with stable item IDs, call `fetchNextPage` only when `hasNextPage && !isFetchingNextPage`. **Reasoning:** server pagination state belongs to the query cache. **Common mistake:** incrementing a local page number on every `onEndReached` call.

## 3 — Infinite Scrolling Guard
**Problem:** prevent duplicate page requests when `onEndReached` fires repeatedly. **Expected result:** at most one active next-page request. **Hint:** guard on query state. **Solution:** return early when already fetching or no cursor remains; keep `renderItem` and keys stable only where profiling shows benefit. **Common mistake:** adding an arbitrary timeout as a lock.

## 4 — Pull to Refresh
**Problem:** add refresh to a feed without replacing it with a full-screen spinner. **Expected result:** current rows remain visible while refresh indicator shows. **Hint:** distinguish first load from refetch. **Solution:** wire `RefreshControl` to a refetch/invalidation state and reserve skeleton/full loader for no-data initial state. **Common mistake:** clearing cached data before every refresh.

## 5 — Optimistic Update
**Problem:** toggle a task complete state immediately and rollback safely on failure. **Expected result:** fast UI without losing newer updates. **Hint:** cancel conflicting queries and track mutation context. **Solution:** cancel relevant query, record targeted entity/version or scoped previous value, patch cache, then reconcile/invalidate on settle; avoid restoring an entire stale list after later mutations. **Common mistake:** unconditional whole-cache snapshot rollback.

## 6 — Form Validation
**Problem:** build login form with React Hook Form + Zod. **Expected result:** typed email/password validation, submit disabled only when appropriate, accessible errors. **Hint:** validation messages need semantic association. **Solution:** schema owns field rules; form resolver maps errors; inputs expose labels/hints; submit mutation handles server errors separately from schema errors. **Common mistake:** treating invalid credentials as field-format validation.

## 7 — Authentication Flow
**Problem:** route between splash, signed-out and signed-in graphs. **Expected result:** navigation derives from session resolution. **Hint:** auth is state, navigation is a view of state. **Solution:** bootstrap secure session, render splash while unknown, then conditionally compose graphs; centralize logout/refresh failure and deep-link intent replay. **Common mistake:** imperatively navigate to every auth destination from effects.

## 8 — Reusable Modal
**Problem:** implement an accessible confirmation modal. **Expected result:** title/body/actions, safe destructive variant, Android back dismissal and focus semantics. **Hint:** model intent rather than arbitrary children where product behavior is fixed. **Solution:** typed props for labels/actions/loading; use `Modal`, accessible container/controls, `onRequestClose`, prevent duplicate submit. **Common mistake:** modal with no Android back handler or disabled-state feedback.

## 9 — Custom Hook with App Lifecycle
**Problem:** expose whether app is active. **Expected result:** current AppState plus updates with cleanup. **Hint:** initialize from current state and subscribe once. **Solution:** `useState(AppState.currentState)`, subscribe in effect, update state, remove subscription in cleanup. **Common mistake:** adding listener on every render.

## 10 — Keyboard Handling
**Problem:** keep a submit button reachable above the keyboard. **Expected result:** usable iOS/Android form with correct dismissal. **Hint:** no single layout strategy fits every screen. **Solution:** combine safe-area-aware layout, scrollable content and `KeyboardAvoidingView`/platform window behavior where appropriate; use refs for next/submit focus. **Common mistake:** hard-coded keyboard height.

## 11 — Deep Link Handler
**Problem:** process `myapp://orders/123`. **Expected result:** typed order intent, auth validation and one-time navigation when ready. **Hint:** external URLs are input. **Solution:** parse/validate scheme/path/id, queue until bootstrap/navigation readiness, authorize before showing data, dedupe initial/event delivery. **Common mistake:** calling `navigate(url.split('/'))` directly.

## 12 — Offline Mutation Queue
**Problem:** queue note edits while offline. **Expected result:** persisted ordered intents with retries and conflict detection. **Hint:** store logical operations, not promises. **Solution:** persist operation ID/entity/base version/payload, replay with idempotency keys, exponential backoff and explicit conflict resolution. **Common mistake:** keeping queue only in memory.

## 13 — Retry System
**Problem:** create a bounded retry helper. **Expected result:** exponential backoff + jitter, cancellation, retryable-error predicate. **Hint:** not every error should retry. **Solution:** loop attempts, throw immediately for validation/auth/nonretryable responses, delay with capped exponential+jitter and respect AbortSignal. **Common mistake:** retry 401/400 forever.

## 14 — List Optimization
**Problem:** a list rerenders every row when one favorite changes. **Expected result:** isolate changing state and validate improvement. **Hint:** inspect props before adding memoization. **Solution:** keep stable item IDs/data, move favorite state to row-selectable store/cache or update only affected item, memoize row if prop equality is meaningful. **Common mistake:** wrapping every function in `useCallback` without measuring.

## 15 — Image Loading State
**Problem:** remote avatar should show placeholder, error fallback and correct size. **Expected result:** no layout jump and bounded memory. **Hint:** size is known before image arrives. **Solution:** fixed/aspect-ratio container, `onLoadStart`/`onLoad`/`onError` state or image library equivalent, request appropriately resized CDN asset. **Common mistake:** render original 6000×4000 image into 48×48 view.

## 16 — Theme System
**Problem:** support light/dark/system themes. **Expected result:** design tokens feed components, explicit user override persists. **Hint:** separate preference from resolved theme. **Solution:** store preference (`system|light|dark`), combine with `useColorScheme`, expose resolved token set through a low-frequency provider. **Common mistake:** store copied colors in every component state.

## 17 — Navigation Guard
**Problem:** warn before discarding an edited form. **Expected result:** block only destructive navigation while dirty and permit explicit discard. **Hint:** guard navigation intent, not hardware back alone. **Solution:** use current navigation library's supported before-remove/prevent pattern, show confirm UI, then replay action after confirmation. **Common mistake:** intercept only Android BackHandler.

## 18 — Event Subscription Cleanup
**Problem:** listen to keyboard show/hide events without leaks. **Expected result:** one pair of listeners per mounted owner, removed on unmount. **Hint:** retain subscriptions returned by the API. **Solution:** create listeners in effect and call `remove()` for both in cleanup; derive visible state only if UI needs it. **Common mistake:** adding listeners at module scope for screen-specific behavior.

## 19 — Native-Module Wrapper
**Problem:** wrap `DeviceInfoModule.getFreeDiskBytes()` for app use. **Expected result:** stable domain API and normalized errors. **Hint:** generated module is an infrastructure boundary. **Solution:** create TS service that checks/normalizes numeric result, maps native error codes, adds observability and can be mocked independently. **Common mistake:** import raw TurboModule in every feature.

## 20 — AppState + Query Focus
**Problem:** refetch stale queries when app returns active. **Expected result:** background does not repeatedly refetch; foreground resumes focus behavior. **Hint:** bridge lifecycle to query focus manager. **Solution:** subscribe to AppState and mark focus active only for `active`, using TanStack Query's documented RN integration pattern; clean listener. **Common mistake:** invalidate every query on every AppState event.

## Interview scoring

For every exercise score correctness, TypeScript model, cleanup/lifecycle, loading/error states, accessibility, Android/iOS reasoning, performance awareness and explanation. A strong candidate says what they would measure or verify rather than adding premature optimization.
