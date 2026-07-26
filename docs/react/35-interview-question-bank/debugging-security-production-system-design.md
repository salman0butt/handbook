---
title: Debugging, Security, Production, and System Design Questions
description: React interview questions covering Error Boundaries, observability, hydration failures, security, large-team architecture, migration, and frontend system design.
sidebar_position: 9
---

# Debugging, Security, Production, and System Design Questions

## Debugging and failure handling

### 1. How do you debug a React bug in production?

**Strong answer:** Reproduce or characterize the symptom, correlate it with release/user/environment data, inspect logs/errors/traces/performance evidence, form hypotheses, narrow the failing boundary, mitigate user impact, then fix and add regression prevention.

### 2. What is an Error Boundary?

**Strong answer:** A component boundary that catches render/lifecycle errors in descendant components and renders fallback UI instead of crashing the entire tree.

### 3. What errors do Error Boundaries not catch?

**Strong answer:** They do not automatically catch arbitrary event-handler errors, async callback errors, server errors, or errors thrown inside the boundary itself. Those need their own handling paths.

### 4. Why are Error Boundaries still class-based?

**Strong answer:** The documented direct API uses class lifecycle methods such as `getDerivedStateFromError` and `componentDidCatch`. Function components can consume boundary abstractions from libraries, but React does not currently expose an equivalent built-in Hook.

### 5. Where should Error Boundaries be placed?

**Strong answer:** Around meaningful recovery domains—route/page sections, independent widgets, editor regions, third-party integrations—where a fallback can preserve useful surrounding UI without fragmenting the app into dozens of tiny boundaries.

### 6. Error Boundary vs expected form error?

**Strong answer:** Expected mutation/domain errors should be modeled as data/state and shown intentionally. Error Boundaries are for exceptional render failures, not normal validation results.

### 7. What is `componentStack`?

**Strong answer:** Diagnostic information describing the React component stack around an error, useful for identifying which rendered component path failed.

### 8. What is an Owner Stack?

**Strong answer:** Diagnostic information about which components created the elements involved, helping distinguish creation/ownership relationships from the rendered component stack.

### 9. What is `captureOwnerStack`?

**Strong answer:** A development-only React API for capturing an Owner Stack for diagnostics. It should not be a production runtime dependency.

### 10. What are root error callbacks useful for?

**Strong answer:** `onCaughtError`, `onUncaughtError`, and `onRecoverableError` allow centralized reporting of Error-Boundary-caught, uncaught, and recoverable React errors such as hydration recovery.

### 11. How would you debug a hydration mismatch that only happens in production?

**Strong answer:** Capture recoverable errors, correlate release/locale/device/request data, compare server/client payloads, inspect nondeterministic render inputs, invalid HTML, browser-only branches, cache versions, and SSR/client deployment skew.

### 12. How do source maps help production debugging?

**Strong answer:** They map minified/generated stack traces back to original source locations so production errors are actionable.

### 13. Why correlate errors with release versions?

**Strong answer:** It lets you identify regressions introduced by a deployment, compare error rates before/after, and decide whether rollback is safer than immediate patching.

### 14. What observability data should a React app emit?

**Strong answer:** Frontend errors, route/feature context, release, device/browser, performance metrics, important user-flow events, request/trace IDs, server mutation failures, hydration recoveries, and sanitized business context.

### 15. What should you never log casually?

**Strong answer:** Secrets, auth tokens, passwords, payment data, sensitive personal data, raw server responses containing private fields, or unrestricted form contents.

### 16. What is a production rollback strategy?

**Strong answer:** A preplanned way to revert or disable a bad change quickly—deployment rollback, feature flag, kill switch, config toggle—without requiring a full emergency rewrite.

### 17. Why are feature flags useful beyond product experiments?

**Strong answer:** They reduce rollout blast radius, support staged deployment, can isolate regressions, and provide operational control during migrations.

### 18. What is regression prevention after an incident?

**Strong answer:** Add the smallest reliable guard: test, lint rule, type/runtime validation, telemetry alert, architecture constraint, CI check, runbook, or design-system fix that prevents the same failure class.

## Security

### 19. What is the main XSS risk in React?

**Strong answer:** React escapes normal text by default, but raw HTML insertion such as `dangerouslySetInnerHTML`, unsafe URLs, third-party scripts, and DOM integration can reintroduce XSS if untrusted content is used.

### 20. Is `dangerouslySetInnerHTML` always unsafe?

**Strong answer:** Not inherently, but it bypasses normal escaping and should only receive trusted/sanitized HTML from a deliberate pipeline.

### 21. Should you sanitize HTML on the client or server?

**Strong answer:** Prefer a trusted sanitization boundary close to content ingestion/authority, often server-side. Client sanitization can add defense but should not be the only authority if the content persists or is served elsewhere.

### 22. Why are Server Function arguments untrusted?

**Strong answer:** The client can craft requests independently of the UI. Types, disabled buttons, and hidden fields are not security boundaries.

### 23. Authentication vs authorization?

**Strong answer:** Authentication establishes who the caller is. Authorization determines whether that caller may perform the requested action on the specific resource.

### 24. What is object-level authorization?

**Strong answer:** Checking that the authenticated user is allowed to access or mutate the specific requested record/tenant/resource, not just that they are logged in.

### 25. Why must tenant ID from the client be treated carefully?

**Strong answer:** A user could change it. Derive/validate tenant scope from trusted session/authorization context and verify access to requested resources.

### 26. Why doesn't TypeScript secure Server Functions?

**Strong answer:** Types are erased at runtime and malicious clients can send arbitrary serialized values. Runtime validation and authorization are required.

### 27. How do you validate Server Function input?

**Strong answer:** Parse the external payload with explicit runtime schemas/rules, normalize values, reject invalid types/ranges, then authorize against trusted identity before mutation.

### 28. Why are client-side permissions only UX?

**Strong answer:** Hiding/disabling a button helps users but does not prevent direct API calls. Server-side authorization is the actual enforcement boundary.

### 29. What security concerns exist with redirects/URLs?

**Strong answer:** Open redirects, `javascript:`-style dangerous schemes, phishing destinations, and untrusted link targets. Validate/allowlist destinations where the app has authority.

### 30. What security concerns exist with third-party scripts?

**Strong answer:** They execute with powerful page access, can observe user data, hurt performance, and create supply-chain risk. Minimize them and use CSP/integrity/sandboxing or vendor isolation where appropriate.

### 31. What is CSRF and does React solve it?

**Strong answer:** Cross-Site Request Forgery tricks a user's browser into making authenticated requests. React does not solve it; server/session architecture must use appropriate SameSite, CSRF tokens, origin checks, or other defenses.

### 32. What is CSP?

**Strong answer:** Content Security Policy is a browser security policy that restricts what scripts/styles/resources may execute/load, reducing impact of some injection attacks.

### 33. What is dependency supply-chain risk?

**Strong answer:** Third-party packages can contain vulnerabilities or malicious updates. Use lockfiles, review critical dependencies, scan advisories, minimize dependency surface, and control update/release processes.

### 34. How should file uploads be handled securely?

**Strong answer:** Validate size/type/content server-side, generate safe storage names, isolate executable content, scan where required, enforce authorization, and never trust client MIME/extension alone.

## Production engineering

### 35. What makes React code “production-ready” beyond passing tests?

**Strong answer:** Observability, accessibility, security, performance budgets, failure handling, rollback, CI gates, dependency discipline, documentation, ownership, and operational runbooks.

### 36. What should a frontend CI pipeline check?

**Strong answer:** Type checking, linting, tests, build, accessibility checks where automatable, bundle/performance constraints, dependency/security policies, and deployable artifact validation.

### 37. What is a frontend performance budget?

**Strong answer:** Explicit limits/targets for bundle size, interaction latency, loading metrics, long tasks, render/commit cost, or other user-facing performance indicators.

### 38. Why do teams need architecture decision records?

**Strong answer:** ADRs capture context, options, decision, trade-offs, and consequences so architecture can be revisited rationally rather than rediscovered through code archaeology.

### 39. What should be shared across teams?

**Strong answer:** Stable primitives/contracts—design system, auth/session integration, observability SDKs, routing/data conventions where valuable—not every utility or state store by default.

### 40. What is a frontend platform team responsible for?

**Strong answer:** Shared developer infrastructure and standards: build/deploy tooling, design-system foundations, observability, testing conventions, performance governance, dependency policy, and paved-road architecture.

### 41. How do you avoid a shared-components dumping ground?

**Strong answer:** Require stable cross-feature value, clear ownership, public API, documentation/tests, versioning/deprecation rules, and avoid moving feature-specific components into shared space just because they are used twice.

### 42. How do you deprecate a component API?

**Strong answer:** Introduce the replacement, document migration, add warnings/codemods if helpful, track consumers, set timelines, support overlap, and remove only after adoption and release coordination.

### 43. What is a strangler migration?

**Strong answer:** Incrementally replacing parts of a legacy system behind stable boundaries rather than rewriting the whole application at once.

### 44. Why are full rewrites risky?

**Strong answer:** They discard hidden behavior knowledge, take long before delivering value, create parallel product development, and often reproduce old bugs while introducing new ones.

### 45. How do you migrate a class-heavy React app?

**Strong answer:** Upgrade dependencies/root APIs first, add characterization tests, replace removed APIs, migrate high-value modules incrementally, preserve behavior, and only convert classes when there is a reason—not as an all-at-once style project.

### 46. How do you migrate legacy Context?

**Strong answer:** Introduce modern Context behind an adapter boundary, move consumers gradually, test behavior, then remove legacy contextTypes/getChildContext when all consumers are migrated.

### 47. How do you migrate from `ReactDOM.render`?

**Strong answer:** Use `createRoot` for client-only roots or `hydrateRoot` for server-rendered roots, then verify scheduling/Strict Mode/testing assumptions and root unmount behavior.

## System design

### 48. How would you design a large SaaS dashboard frontend?

**Strong answer:** Clarify users/flows, define route/feature boundaries, classify state, choose server data strategy, isolate realtime subscriptions, establish design-system primitives, accessibility, error/loading boundaries, performance budgets, auth/authorization integration, observability, and deployment ownership.

### 49. How would you design a realtime trading UI?

**Strong answer:** Separate high-frequency market data from ordinary React state, use selective subscriptions/external store, prioritize input/order interactions, virtualize dense lists, batch/aggregate updates, define stale-data semantics, error/reconnect states, and measure render/layout latency.

### 50. How would you design a large ecommerce frontend?

**Strong answer:** Route/server data boundaries, product/cache/search architecture, cart ownership, optimistic mutations where safe, checkout authority on server, code splitting, image/resource strategy, accessibility, analytics/observability, and graceful failure/offline states.

### 51. How would you design a multi-step checkout?

**Strong answer:** Explicit state machine, resumable server-backed draft where appropriate, idempotent mutations, URL/navigation semantics, validation, payment/security boundaries, accessible errors/focus, analytics, and recovery from refresh/network failure.

### 52. How would you design a notifications system?

**Strong answer:** Server source of truth, delivery channel, unread counts, realtime/polling strategy, dedupe/order semantics, pagination, optimistic read state, accessibility announcements, and selective subscriptions to avoid global rerender storms.

### 53. How would you design a file-upload feature?

**Strong answer:** Chunking/resume if needed, upload state machine, progress outside broad global state, cancellation/retry, server validation, signed upload URLs if applicable, permission checks, preview security, and post-upload reconciliation.

### 54. How do you choose microfrontends vs modular monolith frontend?

**Strong answer:** Start with organizational/deployment constraints. Microfrontends add independent deployability and team autonomy but also duplicate runtime/dependency/design concerns. Prefer a modular monolith unless independent delivery and boundaries justify the complexity.

### 55. What are the risks of microfrontends?

**Strong answer:** Duplicate dependencies, inconsistent UX, cross-app state, routing integration, performance, observability fragmentation, version skew, testing complexity, and ownership gaps.

### 56. How do you design frontend module boundaries?

**Strong answer:** Organize around product/domain features, expose narrow public APIs, enforce dependency direction, keep internal implementation private, and prevent shared infrastructure from importing feature code.

### 57. How do you design a design system for many teams?

**Strong answer:** Start with tokens/primitives, accessible contracts, variants, ref/native prop support, documented composition patterns, semantic versioning/deprecations, visual/behavioral tests, usage analytics, and governance with product-team feedback.

### 58. How do you design for feature flags?

**Strong answer:** Central flag evaluation, typed/stable contracts, server/client consistency where SSR matters, fallback behavior, cleanup ownership, experiment telemetry, and avoiding permanent branching debt.

### 59. How do you design frontend observability across teams?

**Strong answer:** Shared error/performance SDKs, release IDs, route/feature ownership tags, trace correlation, privacy/redaction rules, dashboards/alerts, and common incident severity/playbooks.

### 60. Staff question: how do you make frontend architecture reversible?

**Strong answer:** Use narrow interfaces, adapters, staged migrations, feature flags, versioned contracts, isolated state/data boundaries, observability, rollback plans, and avoid coupling irreversible infrastructure choices directly into every feature.

### 61. Staff question: how do you evaluate a new framework/library?

**Strong answer:** Problem fit, maturity, maintenance, performance, security, accessibility, SSR/RSC compatibility, bundle cost, migration/exit cost, ecosystem, team skill, operational impact, and proof through a bounded pilot.

### 62. Staff question: when should teams standardize vs allow local choice?

**Strong answer:** Standardize high-leverage cross-team interfaces and operational concerns; allow local implementation choices when the blast radius is contained and interoperability is preserved.

### 63. Staff question: how do you reduce frontend incident frequency?

**Strong answer:** Improve observability, deployment safety, automated checks, design-system contracts, dependency control, architecture ownership, incident review, staged rollout, and remove recurring failure classes rather than only fixing individual bugs.

### 64. Staff question: how do you measure frontend engineering health?

**Strong answer:** Reliability/error rates, performance, accessibility, deployment frequency/failure rate, lead time, regression rate, bundle growth, test signal quality, migration debt, dependency health, and product outcomes—not code volume.

### 65. What is the strongest senior interview habit for system design?

**Strong answer:** Do not jump to libraries. Clarify requirements and constraints, identify ownership/boundaries, then discuss alternatives, failure modes, performance, security, operations, and rollout.