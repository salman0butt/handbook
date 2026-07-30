---
id: chapters-061-080
title: 061–080 — Lists, Forms, Networking & Server State
---

# 061 — Virtualization Mental Model

A virtualized list keeps the logical dataset large while rendering/mounting only a window of rows near the viewport. This saves React work, native view creation, layout, and memory.

```text
10,000 items
   ↓ VirtualizedList window
~visible + overscan rows
   ↓
native mounted views
```

Virtualization is a scheduling/memory trade-off: too small a window risks blanks during fast scrolls; too large wastes work. Measure before tuning.

# 062 — ScrollView vs FlatList

`ScrollView` eagerly renders all children; `FlatList` virtualizes. For ten thousand substantial rows, ScrollView can create a huge React/native tree at once, increasing startup time, layout cost, and memory. FlatList pays management overhead but bounds mounted work. Small static lists can remain ScrollViews; choose by expected size/complexity rather than dogma.

# 063 — Keys, Identity and renderItem

A stable key represents item identity across renders. Never use array indices for reorderable/inserting datasets. `renderItem` should be predictable and avoid capturing large changing parent state. If list rows rerender too often, profile why before sprinkling `memo`/`useCallback`; unstable props, context, selector breadth, or state placement may be the real cause.

# 064 — getItemLayout and Predictable Geometry

If row sizes are fixed or computable, `getItemLayout` lets the list skip measuring earlier items for operations such as scrolling to an index. Use exact offsets including separators. Do not fake fixed geometry for variable-height content—the result is wrong scroll positioning and difficult bugs.

# 065 — Windowing and Batch Configuration

`initialNumToRender`, `maxToRenderPerBatch`, `updateCellsBatchingPeriod`, `windowSize`, and clipping behavior influence responsiveness/memory. They are workload-specific controls, not a checklist of “performance settings.” Test slow devices, fast flings, expensive rows, and screen transitions while measuring frame time and memory.

# 066 — Pagination and Infinite Scrolling

Treat pagination as server-state coordination. Cursor pagination is generally safer than offset pagination for mutable feeds. Guard `onEndReached` from duplicate requests, distinguish initial load from next-page load, deduplicate by stable entity ID, and show retry states at the page boundary. Preserve server ordering rules rather than sorting independently in the UI unless intended.

# 067 — Pull to Refresh

Refresh should represent “revalidate from the top,” not necessarily wipe the entire cache. Keep the current screen usable while refreshing where possible. Separate `isLoading` (no usable data) from `isRefetching` (usable data exists) so users do not see a full-screen spinner on every refresh.

# 068 — Controlled Mobile Forms

A controlled input has React state as the source of truth. This is straightforward for small forms but can rerender large trees on every keystroke. Keep field components isolated, avoid recomputing the whole screen, and store only meaningful values. Normalize/validate at explicit boundaries rather than destructively changing user input mid-keystroke.

# 069 — React Hook Form Architecture

React Hook Form reduces unnecessary rerenders by managing field state through registrations/controllers and subscriptions. In React Native, use `Controller`/`useController` for `TextInput` and native controls when appropriate. Keep API/domain validation separate from presentation, map server errors to fields intentionally, and focus the first invalid field when UX supports it.

# 070 — Zod and Runtime Validation

TypeScript disappears at runtime. Validate untrusted form/API/deep-link data with Zod or equivalent schemas, then infer TypeScript types where useful. A production form often has three layers: UI-friendly field rules, domain invariants, and server authorization/business checks. Client validation improves UX but cannot enforce security.

# 071 — Keyboard-Aware Form UX

Forms must remain usable with keyboards shown, accessibility fonts enabled, and small devices. Combine scrolling, `KeyboardAvoidingView` where appropriate, insets, focus sequencing, `returnKeyType`, and explicit submit behavior. Test Android resize/pan modes and iOS safe areas. Avoid fixed bottom buttons that become inaccessible behind the keyboard.

# 072 — Autofill, Secure Entry and Accessibility

Use platform autofill metadata accurately so password managers and OS autofill work. `secureTextEntry` masks display but does not make arbitrary logging/storage secure. Labels, hints, error messages, required state, focus order, and touch targets must work with VoiceOver/TalkBack as well as sighted keyboard interaction.

# 073 — HTTP and fetch

React Native provides `fetch` for HTTP. Build an API-client layer that owns base URL, headers, serialization, authentication hooks, error normalization, and observability.

```text
Screen → query/mutation → API client → fetch → native networking → TLS/HTTP server
```

Do not let each screen invent status-code handling or parse JSON optimistically without checking response semantics.

# 074 — AbortController, Cancellation and Timeouts

Cancellation stops work the UI no longer needs and prevents stale responses from winning. `AbortController` can cancel supported fetches. A timeout is policy, not a native fetch default: implement it by aborting after a timer and distinguish timeout from explicit user/navigation cancellation. Retrying cancelled requests blindly defeats cancellation.

# 075 — Error Taxonomy and Retry Strategy

Separate connectivity failures, DNS/TLS errors, timeouts, 4xx validation/auth errors, 409 conflicts, rate limits, and 5xx/server failures. Retry only when the operation is safe/idempotent or the backend supports idempotency keys. Exponential backoff with jitter reduces synchronized retry storms. Give users an actionable error state instead of `console.log` plus spinner.

# 076 — Authentication Headers and Refresh Tokens

Keep access-token attachment and refresh coordination in an auth/API layer. If many requests receive 401 simultaneously, one refresh should normally coordinate the others rather than spawning a refresh storm. Refresh tokens belong in platform-secure credential storage, not AsyncStorage. Server-side revocation and expiration remain authoritative.

# 077 — Connectivity and Offline Detection

Network reachability is not the same as internet/API availability. NetInfo-style libraries can provide connection signals, but requests still need real error handling. Use connectivity events to improve UX, pause/retry work, and drive offline indicators—not to assume a request must succeed because the device reports Wi-Fi.

# 078 — TanStack Query Mental Model

TanStack Query owns asynchronous server state: cached data, freshness, in-flight work, retries, invalidation, mutation status, and pagination. A query key names a cache entry and must include every input that changes the result.

```text
component → query key → cache → fetcher
                 ↘ observers / freshness / retries
```

Keep UI/client state outside the query cache unless it truly represents server data.

# 079 — staleTime, Garbage Collection and Invalidation

`staleTime` answers “how long is cached data considered fresh?” Garbage-collection time answers “how long can unused cached data remain before removal?” Invalidation marks matching queries stale and can trigger refetch according to observer state. Choose freshness from product semantics—stock prices, profile settings, and country lists need different policies.

# 080 — Mutations, Optimistic Updates and Infinite Queries

Mutations represent server changes. Optimistic UI should snapshot/rollback or reconcile with the server response and handle concurrent edits. Infinite queries model page collections with `pageParam`/next-page logic; query keys identify the whole logical feed. On mobile, integrate app focus/connectivity and persistence deliberately so background/foreground transitions do not create surprise refetch storms or stale offline edits.