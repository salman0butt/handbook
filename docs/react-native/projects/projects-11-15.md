---
id: projects-11-15
title: Projects 11–15 — Finance, Large Feed, Native Module, Fabric Component & SaaS
---

# Project 11 — Finance / Transaction Tracker

**Requirements:** accounts, transactions, categories, monthly totals, search/filter, CSV-style export, local persistence and optional sync. **Architecture:** domain money types → repository → SQLite; server sync/query adapter optional; UI consumes selectors/use cases.

**Setup/implementation:** represent money as integer minor units plus currency, never binary floating point. Use database transactions for multi-record updates and migrations. Date grouping uses explicit locale/timezone semantics. Export writes a file and shares it through a platform library/core `Share` flow where appropriate.

**Android/iOS:** filesystem/share destinations differ; test decimal keyboards and locale formatting. **Errors/loading:** migration/export/storage errors need recoverable UI. **Testing:** money math, date boundaries, migrations, filters, export escaping. **Performance:** indexed date/account/category columns, paginated history. **Accessibility:** charts have textual summaries; amounts announced with currency. **Security:** financial data deserves screen/log/privacy review; tokens in secure storage; screenshots may require policy decisions. **Acceptance:** totals are deterministic across locales; 100k transactions remain queryable. **Senior review:** Why integer minor units? When would local encryption be worth its operational cost?

---

# Project 12 — Large Infinite-Scroll Feed

**Requirements:** 100k logical items, cursor pagination, mixed row types, media, refresh, scroll restoration and low-end-device performance target. **Architecture:** infinite query → view-model mapper → typed row union → optimized FlatList.

**Setup/implementation:** stable entity keys, bounded page retention policy, `getItemLayout` only for rows with computable geometry, memoized expensive rows after profiling, server cursor and dedupe. Preserve scroll location when navigating to detail and back.

**Android/iOS:** benchmark release builds on low-end Android and older supported iPhone. **Errors/loading:** footer retry and partial cached data. **Testing:** page dedupe, mixed row renderer, scroll restoration contract. **Performance:** collect dropped frames, render counts, image memory, mount time; tune window/batch settings from evidence. **Accessibility:** content order remains coherent while virtualized. **Security:** avoid logging feed payloads. **Acceptance:** no eager 100k render; smooth target under realistic media. **Senior review:** What measurement tells you the bottleneck is images rather than React renders?

---

# Project 13 — Native Module Application

**Requirements:** implement `DeviceInfoModule` with sync `getDeviceModel`, async `getFreeDiskBytes`, a native state-change event, typed JS adapter and both platforms. **Architecture:** TS TurboModule spec → Codegen → Android Kotlin implementation + iOS supported native implementation/adapter → JS wrapper.

**Setup/implementation:** place a Codegen-compatible spec using `TurboModuleRegistry`; configure codegen metadata according to current RN 0.86 docs; generate/build through Gradle/CocoaPods integration. Android accesses platform APIs in Kotlin and moves disk work off inappropriate threads. iOS follows generated protocol/base requirements and uses Swift only where the generated/ObjC++ boundary permits it.

**Android/iOS:** normalize model/disk units and error codes across platforms. **Errors/loading:** reject async failures with stable codes; event listener lifecycle explicit. **Testing:** JS wrapper unit test, native unit where useful, integration build/call/event on each OS. **Performance:** sync call remains tiny; no filesystem scan on sync path. **Accessibility:** N/A at module layer; consumer UI still responsible. **Security:** expose only non-sensitive device data required by product. **Acceptance:** Codegen-generated integration builds in release and method/event behavior matches. **Senior review:** Why not expose the disk query synchronously just because JSI permits sync calls?

---

# Project 14 — Custom Fabric Native Component

**Requirements:** build `NativeRatingView` with value/max/disabled props, change event, optional focus command, intrinsic/declared sizing and accessible adjustable semantics. **Architecture:** native component TS spec → Codegen → Fabric descriptor/contracts → Android native view + iOS native view → React wrapper.

**Setup/implementation:** define supported Codegen prop/event types, run generated build integration, implement native prop updates idempotently, emit rating changes through generated event emitter, keep React value authoritative for controlled usage. Commands are for focus/imperative actions only.

**Android/iOS:** map native visual/control behavior to platform conventions while preserving one JS contract. **Errors/loading:** invalid max/value normalized or rejected at wrapper boundary. **Testing:** wrapper props/events, native integration and accessibility tree. **Performance:** avoid recreating native subviews on each prop update; measurement cooperates with Yoga. **Security:** no sensitive data. **Acceptance:** controlled value round-trip works and native view survives rerenders/navigation. **Senior review:** Why should measurement not secretly mutate layout outside Fabric/Yoga?

---

# Project 15 — Production SaaS Mobile Application

**Requirements:** multi-tenant login, dashboard, entities CRUD, search/pagination, roles, offline read cache, deep links, notifications, analytics, crash reporting, staging/prod builds and release readiness. **Architecture:** app shell/navigation → feature modules → domain/use cases → query/repositories → API/storage/native adapters.

**Setup/implementation:** Community CLI TypeScript app, typed navigation, OIDC/PKCE, TanStack Query, React Hook Form + Zod, small client-state store, secure credentials, query persistence where justified, feature flags and environment adapters. Every feature owns loading/empty/error/offline states.

**Android/iOS:** staging flavor/scheme, deep-link association, push setup, permissions and signing. **Testing:** unit/component/integration + critical E2E login/create/edit/offline/deep-link. **Performance:** startup and dashboard/list budgets, image/network measurements. **Accessibility:** VoiceOver/TalkBack release checklist. **Security:** threat model, secret audit, token/log/privacy review. **Acceptance:** both release builds install, core E2E passes, offline/resume/deep link/push flows verified. **Senior review:** Which cross-cutting concerns belong to platform foundations versus feature ownership?