---
title: JavaScript Projects — 10 Guided Builds + Capstone
slug: /javascript/projects
---

# JavaScript Projects

These projects are deliberately framework-free. Each build must preserve the language/host boundary, use ESM, expose failure/cancellation behavior, and include tests rather than only “working in the happy path.”

## Shared engineering rubric

For every project, produce a short README containing the architecture diagram, public contracts, runtime/host assumptions, supported browser/runtime targets, threat model, performance budget, and design review. Prefer small modules with explicit ownership.

---

# Project 1 — JavaScript Utility Toolkit

**Goal:** build a dependency-light ESM utility library demonstrating functions, arrays, objects, strings, Maps/Sets, errors, and tests.

**Requirements:** `groupBy`, `uniqueBy`, `chunk`, deep-safe path getter without prototype traversal surprises, string normalization helpers, retry-free pure transforms, typed JSDoc, custom input errors, no mutation of caller-owned data unless the function name/contract says so.

**Architecture:**

```text
src/
  arrays.js
  strings.js
  objects.js
  collections.js
  errors.js
  index.js       ← public API
```

**Runtime mental model:** utility functions are ECMAScript-only; tests can run in browser or Node because no host API is required.

**Implementation guidance:** implement one utility at a time, write invariant examples first, use `Object.hasOwn` for own-key logic, iterables where generality is useful, and avoid JSON cloning.

**Acceptance criteria:** exports are documented; no accidental mutation; sparse arrays and Unicode cases are explicitly tested; invalid arguments produce stable errors; public API has no internal-module leaks.

**Tests:** normal/empty/large inputs, `NaN`, `-0`, Symbols, null-prototype objects, sparse arrays, Unicode normalization, iterator inputs.

**Debugging tasks:** diagnose a missing-return `map` callback; an inherited-key bug; a shallow-copy bug.

**Security:** never follow attacker-controlled `__proto__.x`-style paths into prototypes; cap pathological input sizes in any potentially expensive helper.

**Performance:** compare eager array pipelines against one loop for a measured large dataset; document trade-off rather than optimizing everything.

**Edge cases:** holes, duplicate object identities, symbols, getters with side effects.

**Stretch:** publish an iterator-helper-style lazy API without modifying globals.

**Interview:** Why is a “deep clone utility” much harder than `{...obj}`? When should Map beat Object?

**Design review:** Is each helper's contract worth maintaining, or is it a one-line abstraction that hides behavior?

---

# Project 2 — DOM Task Manager

**Goal:** build an accessible task manager using DOM, events, forms, state, ESM, and browser storage.

**Architecture:**

```text
UI events → controller → task domain → state store
                    ↘ persistence adapter → localStorage
state changes → renderer → DOM
```

**Requirements:** add/edit/delete/toggle/filter tasks; keyboard-operable controls; event delegation; persistence adapter; storage version migration; safe text rendering; undo last delete.

**Runtime mental model:** task state/domain logic is ECMAScript; DOM, events, and localStorage are browser host APIs.

**Implementation guidance:** domain functions remain pure; controller owns effects; render using `textContent`; use stable IDs; remove listeners via an AbortController lifecycle.

**Acceptance criteria:** refresh preserves state; malformed stored JSON recovers; duplicate submits do not create duplicates; focus moves sensibly after edits/deletes; no `innerHTML` with task text.

**Tests:** domain unit tests, persistence integration test, DOM submit/toggle/delete tests, keyboard test.

**Debugging tasks:** a live collection mutation bug; listener registered twice; stale storage schema.

**Security:** XSS-resistant task names, no secrets in storage, schema validation after JSON parse.

**Performance:** render only needed changes or batch a full render for small lists; measure at 10k tasks and document threshold.

**Edge cases:** empty/very long text, storage quota errors, two tabs editing, corrupt state.

**Stretch:** BroadcastChannel cross-tab sync with conflict strategy.

**Interview:** `target` vs `currentTarget`; why is localStorage not part of JavaScript?

**Design review:** Where is state ownership? Which modules can mutate tasks?

---

# Project 3 — Form and Validation Engine

**Goal:** create a reusable validation engine plus accessible browser form adapter.

**Requirements:** composable sync/async rules, field/form errors, nested values, custom `ValidationError`, normalization, serialization, cancel stale async validation, ARIA error linkage.

**Architecture:**

```text
unknown input → parsers/rules → validated model
DOM adapter ↗                    ↘ errors/result
```

**Runtime mental model:** rule engine is ECMAScript; form controls, Constraint Validation API, and DOM focus/ARIA are host surfaces.

**Implementation guidance:** parse unknown values into domain values; distinguish required/format/domain failures; async uniqueness checks receive AbortSignal.

**Acceptance criteria:** error shape is deterministic; first invalid field focus works; server rejection can map back to fields; async stale response never overwrites newer value.

**Tests:** validators, composed rules, cancellation, DOM accessibility attributes, serialization round trip.

**Debugging:** race between two username checks; `0` rejected by `||` defaulting; hidden field incorrectly validated.

**Security:** server validation remains mandatory; never trust hidden/read-only inputs; avoid HTML injection in error messages.

**Performance:** debounce expensive remote checks; avoid validating whole form on each keystroke unless measured acceptable.

**Edge cases:** empty string vs missing, Unicode whitespace, locale numbers, browser autofill.

**Stretch:** schema-to-form adapter.

**Interview:** Why “parse, don't validate”? How do you prevent stale validation races?

**Design review:** Are rules reusable without DOM? Is cancellation part of the contract?

---

# Project 4 — API Data Dashboard

**Goal:** load/filter/render remote data with robust async states.

**Requirements:** fetch, async/await, parallel independent requests, abort on filter change, loading/empty/error/stale states, pagination, in-memory cache, refresh, safe DOM rendering.

**Architecture:**

```text
UI → query model → API client → fetch
          ↓            ↓
       cache ← parsed/validated response
          ↓
       renderer → DOM
```

**Runtime mental model:** Promise/async/module logic is ECMAScript; fetch/AbortController/DOM are Web APIs.

**Acceptance:** HTTP 4xx/5xx handled separately from network failures; stale request cannot paint; cancellation is not shown as generic “error”; unknown JSON rejected by parser.

**Tests:** API client with mock transport, race simulation, cache behavior, renderer states.

**Debugging:** `response.json()` called twice; race A overwrites B; `Promise.all` hides independent partial results.

**Security:** validate URLs/query input; encode query params via URL APIs; render untrusted server text safely.

**Performance:** dedupe requests, avoid over-fetching, bounded prefetch, measure rendering for large tables.

**Edge:** offline, empty pages, rate limit, malformed JSON, clock skew cache TTL.

**Stretch:** worker-based heavy aggregation.

**Interview:** Why doesn't fetch reject on 500? How do you distinguish cancellation?

**Design review:** Is cache policy separate from transport and rendering?

---

# Project 5 — Async Request Manager

**Goal:** implement an orchestration library with bounded concurrency, retries, cancellation, timeouts, deduplication, and stale protection.

**Requirements:** configurable max concurrency; FIFO queue; per-request AbortSignal; retry predicate; exponential backoff + jitter; idempotency-aware retry policy; keyed dedupe; request generation; metrics hooks.

**Architecture:**

```text
submit(key, work)
   ↓
dedupe registry → existing Promise?
   ↓ new
queue → semaphore slots → work(signal)
           ↓ result/error
retry policy ↺       metrics
```

**Runtime mental model:** Promise jobs coordinate continuations; timer/Abort APIs are host adapters and should be injectable for deterministic tests.

**Acceptance:** never exceeds configured active count; aborted queued work never starts; timeout aborts actual underlying operation when adapter supports it; dedupe releases key after settlement; retry does not duplicate unsafe operations by default.

**Tests:** virtual clock, 100 queued jobs, rejection storms, abort before/after start, same-key concurrency, retry-after parsing adapter.

**Debugging:** leaked queue promise; semaphore slot not released on throw; timer not cleared; race during abort/retry.

**Security:** cap queue size; do not retry attacker-triggered expensive failures forever.

**Performance:** O(1)-style queue operations; avoid `shift()` on enormous arrays or choose a head index/deque.

**Edge:** synchronous throw from work function, thenables, abort during backoff.

**Stretch:** priority/fair scheduling and circuit breaker as separate policy.

**Interview:** Why does `Promise.race(timeout)` not cancel work? How would you implement a semaphore?

**Design review:** Are retry/cancellation/concurrency policies composable rather than tangled?

---

# Project 6 — Event System / Pub-Sub Library

**Goal:** build a small event library and compare it to browser `EventTarget`.

**Requirements:** `on`, `off`, `once`, sync and async emission policies, ordered handlers, error strategy, AbortSignal unsubscribe option, leak warnings/diagnostics.

**Architecture:**

```text
Map<event, Set<subscription>>
          ↑
subscribe / unsubscribe
          ↓
emit → snapshot → handlers → result/error policy
```

**Runtime mental model:** functions/Map/Promise are ECMAScript; EventTarget comparison is host API discussion.

**Acceptance:** removing during emit has documented behavior; once fires once under reentrancy; one handler cannot corrupt registry; async emission policy is explicit (serial vs parallel vs settled).

**Tests:** reentrancy, unsubscribe-in-handler, once recursion, thrown/rejected handler, duplicate function subscriptions.

**Debugging:** listener leak; Set mutation surprises; lost error.

**Security:** avoid exposing global event bus across trust boundaries; validate event payloads at plugin boundaries.

**Performance:** use Map/Set; snapshot only when semantic safety needs it; benchmark high-frequency events.

**Edge:** Symbols as event keys, synchronous reentrancy, abort after unsubscribe.

**Stretch:** typed JSDoc event map and wildcard topics.

**Interview:** Observer vs pub/sub? What are reentrancy hazards?

**Design review:** Is error behavior predictable to callers?

---

# Project 7 — JavaScript SDK / Library

**Goal:** design an HTTP SDK with a stable public API.

**Requirements:** ESM, injectable transport, runtime input/response parsing, AbortSignal, retries only where safe, custom error hierarchy with `cause`, pagination async iterable, documentation, compatibility matrix, tests.

**Architecture:**

```text
public Client
  ↓
use-case methods → serializers/parsers
  ↓
transport port ← browser fetch adapter / Node adapter
```

**Acceptance:** no transport details leak into domain API; breaking-change surface is small; errors have stable codes; pagination can stop early and abort/close work.

**Tests:** contract tests run against fake transport and one real integration endpoint fixture; cross-realm input checks avoid fragile `instanceof`.

**Debugging:** accidental default-export mismatch; cyclic imports; response parser omitted.

**Security:** no token logs; redact headers; URL allowlist/base URL policy; dependency review.

**Performance:** avoid duplicate parsing/copying; lazy pagination; no giant bundle-only dependency for one helper.

**Edge:** 204 response, malformed date, retry-after, abort, mixed pagination tokens.

**Stretch:** plugin middleware with scoped capabilities.

**Interview:** What makes an SDK backward compatible beyond method names?

**Design review:** Can transport/auth be swapped without changing callers?

---

# Project 8 — Worker-Powered Application

**Goal:** keep the main thread responsive while processing large data.

**Requirements:** Worker module, message protocol, structured clone, transferable ArrayBuffer, progress, cancellation, worker errors, performance comparison.

**Architecture:**

```text
main thread UI
   ↓ postMessage(command, transfer?)
worker dispatcher → CPU transform
   ↓ progress/result/error
main thread renderer
```

**Acceptance:** 100 MB-class synthetic binary workload uses transfer where appropriate; UI remains interactive; cancellation makes late results ignorable/stopped where possible; protocol version validated.

**Tests:** worker algorithm unit tests, protocol serializer tests, browser integration test.

**Debugging:** detached transferred buffer; non-cloneable function sent; stale worker result.

**Security:** validate worker messages even when same-origin code; CSP/worker source policy documented.

**Performance:** compare clone vs transfer; measure main-thread long tasks and total throughput.

**Edge:** worker crashes, unsupported feature, memory pressure.

**Stretch:** worker pool with bounded jobs.

**Interview:** Why does async/await alone not move CPU work off main thread?

**Design review:** Is worker complexity justified by measurements?

---

# Project 9 — Mini Reactive System

**Goal:** implement dependency tracking to understand framework internals.

**Requirements:** `reactive`, `effect`, dependency graph via WeakMap, Proxy get/set tracking, cleanup, scheduler, batching/microtask flush, computed-like memoization, stop effect.

**Architecture:**

```text
active effect
   ↓ get trap
WeakMap target → Map key → Set effects
                       ↑ set trap triggers
scheduler queue → dedupe → flush
```

**Acceptance:** conditional dependencies clean up; nested effects handled; same effect deduped per batch; property deletion/iteration strategy documented; raw/proxy identity not confused.

**Tests:** branch switching, nested objects, array length/indexes, error in effect, stop/restart, batching order.

**Debugging:** infinite self-trigger; stale dependency; duplicate scheduled work.

**Security:** do not wrap untrusted capability objects indiscriminately; Proxy is not sandboxing.

**Performance:** track only accessed keys, clean stale deps, avoid unbounded effect Sets.

**Edge:** getters, symbols, Map/Set reactivity as stretch, private fields incompatibility cases.

**Stretch:** reactive Map/Set and priority scheduler.

**Interview:** Why use WeakMap for target metadata? What are Proxy invariants?

**Design review:** Which semantics are framework policy vs ECMAScript behavior?

---

# Project 10 — Large Modular JavaScript Application

**Goal:** build a framework-free issue tracker with domain boundaries.

**Requirements:** domains (issues/users), API client, state store, DOM UI, routing concept, forms/validation, async workflows, cancellation, errors, tests, telemetry hooks, storage cache, security/performance budgets.

**Architecture:**

```text
browser shell
 ├─ router
 ├─ issue feature → issue domain → repository port → HTTP adapter
 ├─ user feature  → user domain  → repository port → HTTP adapter
 ├─ shared platform: logger, storage, scheduler
 └─ DOM adapters/renderers
```

**Acceptance:** no feature imports another feature's internals; cancellation on navigation; parser on every remote boundary; error UI maps stable domain errors; event/listener lifecycle clean.

**Tests:** domain, feature integration, mocked transport, browser E2E critical flow.

**Debugging:** circular dependency, navigation race, cache/schema migration bug.

**Security:** XSS-safe rendering, CSRF/auth assumptions documented, no secrets in client, dependency threat review.

**Performance:** route-level lazy import, bounded requests, long-task measurement, memory cleanup on navigation.

**Edge:** offline, tab resume, stale cache, partial API outage.

**Stretch:** worker search index and offline queue conflict model.

**Interview:** Draw dependency direction and explain why infrastructure points inward through ports.

**Design review:** Could one feature be replaced without rewriting the platform?

---

# Capstone — Vanilla JavaScript Application Platform

**Goal:** produce a production-style platform showing staff-level JavaScript architecture without a framework.

## Product scenario

Build a multi-page-in-one-shell “Operations Workspace” with authenticated-user assumptions abstracted behind an auth port, projects/tasks data, dashboard metrics, search, offline/degraded behavior, and a CPU-heavy local report generated in a Worker.

## Required capabilities

- ESM and a static module graph with lazy `import()` for optional routes.
- Router abstraction built over browser history/location (host API).
- API communication via a transport port using fetch adapter.
- Runtime parsing for every remote/storage/message boundary.
- Async orchestration with cancellation and bounded concurrency.
- DOM rendering using safe text APIs, keyed view ownership, and explicit event lifecycles.
- Storage adapter with schema version/migrations.
- Error architecture with stable codes, `cause`, user mapping, logging/telemetry hooks.
- Unit/integration/browser E2E testing.
- Security controls: XSS policy, CSP/Trusted Types deployment notes, CSRF/auth assumptions, URL allowlisting, dependency governance.
- Performance measurement: main-thread long tasks, route chunk size, request waterfall, memory lifecycle.
- Worker integration using structured cloning/transfer.
- Offline/degraded-state thinking: cached read-only mode, retry queue policy, conflict warning—not a magical offline guarantee.
- Accessibility: semantic HTML, keyboard/focus, labels, live regions only where appropriate, contrast/design-system integration.
- Deployment: base path, asset hashing/cache policy, CSP headers, error/source-map policy, browser target matrix.

## Architecture

```text
                         ┌──────────────────────────┐
                         │     Browser host shell   │
                         │ history / DOM / storage  │
                         └────────────┬─────────────┘
                                      ↓
┌──────────────┐   commands   ┌───────────────┐   ports   ┌────────────────┐
│ Route views  │ ───────────→ │ Application   │ ────────→ │ Domain modules │
│ DOM adapters │ ←─────────── │ use cases     │ ←──────── │ + validated    │
└──────┬───────┘    models     └──────┬────────┘           │ models         │
       │                               │                    └────────────────┘
       │                               ↓ ports
       │                 ┌─────────────┴──────────────────────────┐
       │                 │ fetch │ storage │ logger │ worker port │
       │                 └───────┬─────────┬────────┬─────────────┘
       │                         ↓         ↓        ↓
       └──────────────────── Browser host APIs / worker ──────────
```

## Module structure

```text
src/
  app/
    bootstrap.js
    router.js
    lifecycle.js
  features/
    projects/
      index.js
      domain.js
      use-cases.js
      view.js
    tasks/
    reports/
  platform/
    http/
    storage/
    telemetry/
    validation/
    workers/
  shared-domain/
  main.js
```

## Runtime mental model

```text
user event (host task)
  ↓ listener
application command (ECMAScript call stack)
  ↓ async port
fetch/worker host operation
  ↓ Promise Job/message task
validated result
  ↓ state transition
DOM mutation
  ↓ browser rendering opportunity
```

## Implementation milestones

1. Pure domain models/use cases with tests.
2. Router + feature lifecycle API (`mount`/`unmount` with AbortSignal).
3. HTTP transport, runtime parser, error translation.
4. DOM views with accessible event delegation.
5. Storage schema/cache layer.
6. Cancellation/stale-response/bounded-concurrency orchestration.
7. Worker report pipeline.
8. Telemetry/performance measurement.
9. Security headers/policies/dependency audit.
10. E2E flows and degraded/offline tests.

## Acceptance criteria

- Navigating away aborts feature-scoped requests/listeners/timers.
- Zero unsanitized HTML insertion from remote/user strings.
- Invalid server/storage/worker data never enters trusted domain model.
- Independent startup requests run concurrently with a documented bound.
- Worker report does not create a main-thread long task for the heavy transform.
- Memory returns near baseline after 50 route mount/unmount cycles.
- Critical keyboard-only workflow passes.
- Production build works under `/handbook-like-base/` rather than assuming `/`.
- No module cycle crosses feature public boundaries.

## Tests

- Domain unit tests.
- Contract tests for ports/adapters.
- Cancellation/race tests with controllable promises.
- DOM integration tests for forms/events/focus.
- Browser E2E for navigation, API failure, offline/degraded mode.
- Performance smoke test and heap-retention scenario.
- Security regression tests for hostile strings/URLs/storage payloads.

## Debugging missions

- Introduce a module cycle and diagnose uninitialized import.
- Leak a route listener and prove it with heap retainers.
- Make request A overwrite B; fix with abort/generation.
- Inject a long task; profile and move/partition work.
- Break source maps and trace a production-style error.

## Security review

Threat model data sources, authority boundaries, DOM sinks, navigation URLs, token/auth integration, third-party code, storage, cross-tab messages, worker messages, and logging redaction. Document what must be enforced server-side.

## Performance review

Budget startup JS, route chunks, API waterfall, interaction latency, worker transfer size, cache size, and memory after feature teardown. Every optimization requires before/after evidence.

## Edge cases

Offline at startup, mid-request navigation, expired auth, malformed cache, two tabs editing, clock/time-zone differences, partial APIs, worker crash, quota exceeded, browser lacking a newer standardized API.

## Stretch goals

- Service Worker adapter for richer offline strategy.
- Plugin capability system.
- Observable state-machine devtools log.
- Compatibility fallback layer for one newly standardized feature.

## Interview questions

1. Which pieces are ECMAScript and which are browser host APIs?
2. Where is data trusted for the first time?
3. How are lifetimes/cancellation encoded?
4. Why is the Worker boundary message-based instead of shared memory?
5. How would you migrate one feature to React/Vue without rewriting domain/application layers?
6. What platform standards would you enforce across ten teams?

## Senior design review

A reviewer should be able to trace one user action end-to-end, identify every side effect, understand cancellation/error ownership, replace transport/storage/renderer adapters, and prove that compatibility/security/performance policies are explicit rather than accidental.
