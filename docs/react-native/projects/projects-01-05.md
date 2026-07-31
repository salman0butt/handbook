---
id: projects-01-05
title: Projects 01–05 — Task Manager to Social Feed
---

# Project 1 — Task Manager

**Requirements:** create, edit, complete, filter and persist tasks; support empty/error states and offline relaunch. **Architecture:** screen → task feature hooks → repository → AsyncStorage/MMKV adapter. **Folders:** `features/tasks/{screens,components,domain,data}` plus `platform/storage`.

**Setup/implementation:** start from the RN 0.86 Community CLI TypeScript project. Model `Task` with branded/string ID, title, status, timestamps. Keep draft form state local; repository owns persistence. Derive filtered lists instead of duplicating them in state. Use `FlatList`, stable keys, `Pressable`, accessible checkbox semantics and a modal/editor screen.

**Android/iOS:** verify keyboard resize/insets, back handling on edit modal, dynamic text and dark mode. **Errors/loading:** show hydration state, storage failure banner and retry; never silently discard failed writes. **Testing:** reducer/domain tests, component tests for add/complete/filter, persistence adapter test. **Performance:** memoize row only after profiling; avoid rewriting huge serialized data if scaling beyond learning size. **Security:** tasks are ordinary local data; do not imply encrypted storage. **Acceptance:** survives process restart, handles 500 tasks smoothly, screen-reader complete/edit actions work. **Senior review:** When would you move from key-value storage to SQLite? Where is task truth owned?

---

# Project 2 — Weather Application

**Requirements:** search a city, current conditions, multi-day forecast, pull-to-refresh, saved locations and offline last-known data. **Architecture:** UI → TanStack Query → typed weather API client; saved locations → local preference store.

**Setup/implementation:** validate API payloads with Zod, use query keys like `['weather', coordinates]`, set explicit `staleTime`, distinguish initial loading from refetch. Search should debounce user input and cancel obsolete requests. Use geolocation only as an opt-in enhancement.

**Android/iOS:** permission flow differs if using location; test denied/blocked states and metric/imperial locale choices. **Errors/loading:** cached forecast remains visible during transient network failure; show timestamp and retry. **Testing:** API mapper, debounce/cancel behavior, query states and permission adapter. **Performance:** request weather icons at display size and avoid rerendering full forecast on search keystrokes. **Accessibility:** semantic temperature/condition labels, not icon-only meaning. **Security:** API secret must live server-side if provider credentials are privileged; a bundled key is extractable. **Acceptance:** stale cache works offline; no duplicate requests from rapid search. **Senior review:** How should freshness differ for current conditions versus city metadata?

---

# Project 3 — E-commerce Application

**Requirements:** catalog, search/filter, product detail, cart, checkout handoff, auth-aware saved cart, pagination. **Architecture:** server state in TanStack Query; cart client state in Zustand/reducer; API client and secure auth adapter below features.

**Setup/implementation:** cursor-paginated `FlatList`, image placeholders, optimistic quantity updates only when server contract supports rollback/idempotency, discriminated checkout state, typed navigation params using IDs. Keep price totals authoritative from server at checkout.

**Android/iOS:** verify deep link into product, payment-provider return callback, keyboard/address form behavior and back navigation. **Errors/loading:** page-level retry, cart conflict reconciliation, checkout failure without losing cart. **Testing:** pricing display, cart state, query invalidation, form validation and deep-link routing. **Performance:** CDN thumbnails, list-window tuning after profiling, lazy product media. **Accessibility:** buttons/quantity steppers/price announcements. **Security:** never trust client totals; secure session storage; payment secrets remain backend/provider-side. **Acceptance:** 10k-item catalog paginates without eager rendering; checkout retry is safe. **Senior review:** Which state belongs in cache versus cart store? How do you prevent duplicate orders?

---

# Project 4 — Authentication Application

**Requirements:** signup, login, verification state, OAuth/OIDC Authorization Code + PKCE, session refresh, logout, protected navigation and biometric re-entry option. **Architecture:** AuthProvider/state machine → secure credential adapter → API/OIDC client → navigation composition.

**Setup/implementation:** use system browser/auth session via a maintained library, generate PKCE verifier/challenge, validate callback state and store refresh credential with Keychain/Keystore-backed library. Access token attachment and single-flight refresh live in API layer. Logout clears secure credentials, sensitive query cache and protected navigation state.

**Android/iOS:** configure verified App Links/Universal Links or provider-approved callback scheme per environment. Test cold-start callback and already-running app. **Errors/loading:** distinguish offline, invalid credentials, expired refresh and provider cancellation. **Testing:** auth reducer/state machine, callback parser, refresh concurrency, protected navigation. **Performance:** minimal bootstrap before first useful screen. **Accessibility:** form labels/errors/focus. **Security:** no client secret embedded; redact tokens from logs; validate OIDC claims server/client as appropriate. **Acceptance:** concurrent 401s trigger one refresh; expired session returns cleanly to login. **Senior review:** Why PKCE? What can biometrics protect and what can they not prove to the backend?

---

# Project 5 — Social Feed

**Requirements:** paginated feed, reactions, comments preview, author profile navigation, optimistic like, pull-to-refresh, image/media rows. **Architecture:** feed query/infinite pages → normalized view models where needed; mutation layer with optimistic patch/rollback; navigation by entity IDs.

**Setup/implementation:** cursor pagination, stable row keys, `onEndReached` guard, optimistic reaction mutation with server reconciliation, cached profile queries, image dimensions known before display. Keep feed ranking/order server-authoritative.

**Android/iOS:** test low-end Android scrolling, iOS fast flick, safe areas and media interruption. **Errors/loading:** skeleton/initial state, footer retry for failed page, per-item mutation failure. **Testing:** pagination dedupe, optimistic rollback, inaccessible/private post routing. **Performance:** profile row renders, image decode/memory, window settings and selector breadth; do not nest vertical virtualized lists. **Accessibility:** author/post/action semantics, alt-like descriptions where content provides them. **Security:** authorization enforced server-side; sanitize/report user content; avoid sensitive analytics payloads. **Acceptance:** repeated pagination never duplicates posts; scroll remains usable under realistic media. **Senior review:** How would you preserve scroll/feed consistency after backgrounding for 30 minutes?