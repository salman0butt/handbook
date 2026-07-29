---
title: Testing, Errors, Observability & Deployment Questions
sidebar_position: 6
description: Interview questions for testing, error handling, observability, production debugging, deployment, CI/CD and rollback.
---

# Testing, Errors, Observability & Deployment Questions

## 1. Expected error vs uncaught exception?
Expected errors are known business/user outcomes represented deliberately; uncaught exceptions are unexpected failures that should reach error boundaries and telemetry.

## 2. What is `error.tsx`?
A Client Component error boundary for the relevant route subtree. It receives the error and a `reset()` retry function.

## 3. What is `global-error.tsx`?
A global boundary used when the root shell fails. It replaces the root layout and must provide its own `html` and `body`.

## 4. Why are production Server Component errors sanitized?
To avoid exposing sensitive server details. Use server telemetry plus the digest/correlation value to find the protected root cause.

## 5. Why should `redirect()` and `notFound()` not be swallowed?
They use framework control flow. A broad catch can accidentally turn them into generic errors.

## 6. What does `reset()` do?
It retries rendering the failed subtree; it does not automatically repair canonical data, caches or dependencies.

## 7. What is `instrumentation.ts` for?
Server-side startup/runtime instrumentation such as telemetry registration and framework error hooks.

## 8. What is `onRequestError`?
A stable server instrumentation hook for capturing request errors with useful framework context.

## 9. What is `instrumentation-client.ts`?
A client-side early instrumentation entry point for browser errors, rejections and navigation telemetry.

## 10. Logs vs metrics vs traces?
Logs are discrete events, metrics are aggregated numeric health signals, and traces show causal work/latency across a request or workflow.

## 11. Why use OpenTelemetry?
To correlate vendor-neutral traces/spans across Next.js request work, databases, caches, providers and downstream services.

## 12. Why sample traces?
To control telemetry cost/volume while retaining representative or high-value evidence.

## 13. What should a production log contain?
Route/use-case, severity, request or trace ID, release/deployment ID, safe error class and enough context to investigate without exposing sensitive data.

## 14. SLI vs SLO vs error budget?
SLI is the measured reliability indicator, SLO is the target for that indicator, and the error budget is the allowed unreliability implied by the target.

## 15. Why are source maps a policy decision?
They improve debugging but can reveal source structure/content if exposed publicly. Upload, access and retention should be deliberate.

## 16. What is the right testing strategy for Next.js?
Use the cheapest reliable layer: static checks, unit tests, component tests, integration/HTTP tests, browser E2E, nonfunctional checks and production monitoring.

## 17. Vitest vs Jest?
Both can test JavaScript/React applications. Choose based on project compatibility and preserve behavior-focused tests rather than runner-specific implementation tests.

## 18. Why use `next/jest`?
It provides Next-aware Jest configuration/transforms for common framework concerns.

## 19. Why prefer Testing Library role/name queries?
They mirror accessible user semantics, improve resilience and often reveal accessibility issues.

## 20. `getBy`, `findBy`, `queryBy`?
`getBy` expects immediate presence, `findBy` waits for eventual presence, and `queryBy` is useful for checking absence without throwing.

## 21. When is `waitFor` appropriate?
For an asynchronous condition or side effect that cannot be expressed cleanly with a `findBy` query. Avoid arbitrary sleeps.

## 22. Why are async Server Components often tested through integration/E2E?
Unit tooling does not fully model every async RSC/framework behavior. Test pure logic below the component and use real Next/browser execution for the framework boundary.

## 23. How do you test Route Handlers?
Direct invocation can test owned handler logic; real HTTP integration/E2E verifies routing, headers, runtime and caching behavior.

## 24. How do you test Proxy?
Test matcher/redirect/rewrite/header behavior with supported helpers where useful, while validating important request behavior end-to-end and keeping experimental helpers non-baseline.

## 25. Common causes of flaky tests?
Uncontrolled timing, shared test data, external dependencies, unstable selectors, animations, time/randomness, resource contention and incomplete cleanup.

## 26. Should retries hide flakes?
No. Retries may diagnose infrastructure noise, but persistent flakes need a root-cause fix or temporary owned quarantine.

## 27. Why use Playwright `storageState`?
To reuse authenticated browser state efficiently while keeping account/test-data isolation explicit.

## 28. What evidence should CI capture on browser failure?
Traces, screenshots, logs and exact commit/environment information sufficient to reproduce the failure.

## 29. Why is `next build` a release gate?
It performs production compilation, route analysis, prerendering and artifact generation that development mode does not prove.

## 30. What is `next start`?
The standard Node.js production server for a built Next.js app in normal self-hosted mode.

## 31. What is `output: 'standalone'`?
A supported minimal deployment output built from Output File Tracing, with a lightweight generated server and traced runtime dependencies.

## 32. Why use a reverse proxy in front of self-hosted Next.js?
For TLS termination, request/connection controls, forwarding and routing—but configure buffering and trusted forwarded headers correctly.

## 33. Why can streaming work locally but not in production?
A reverse proxy/CDN/compression layer may buffer chunks and hide incremental delivery.

## 34. What is graceful shutdown?
Stop accepting new work, drain in-flight requests and supported post-response work within a deadline, then terminate cleanly.

## 35. Build-time vs runtime environment values?
Some values are evaluated/frozen during build; server runtime values can be read by the deployed process. `NEXT_PUBLIC_` values are browser-exposed and commonly build-time bound.

## 36. `cacheHandler` vs `cacheHandlers`?
`cacheHandler` integrates the server response/ISR-style cache; Cache Components `cacheHandlers` configure Cache Components storage. They are different layers.

## 37. `generateBuildId` vs `deploymentId`?
Build ID identifies build output; deployment ID helps coordinate version-skew/cache-busting behavior across deployments.

## 38. Why can rolling deployment break Server Actions?
A browser and server can temporarily use different builds with different generated references or closure material. Use supported version-skew and key strategies.

## 39. What is static export?
`output: 'export'` produces static files, but request-time server capabilities such as Server Actions and Proxy are unavailable.

## 40. What is the Adapter API?
A documented deployment-platform integration surface that avoids coupling applications/platforms to private `.next` implementation schemas.

## 41. Why use expand/contract DB migrations?
Old and new app versions may coexist during rollout; compatible schema evolution preserves forward rollout and rollback safety.

## 42. What should a canary compare?
Release-specific error rate, p95/p99 latency, Core Web Vitals, critical journeys and DB/cache/provider health against the stable cohort.

## 43. Rollback vs forward-fix?
Rollback high-impact regressions when the previous artifact remains compatible; forward-fix when rollback is unsafe or a narrow repair is faster.

## 44. Senior operations answer pattern?
Discuss artifact, runtime, stateful dependencies, health, observability, compatibility, failure containment and rollback.

Deployment is part of application architecture, not a post-coding command.