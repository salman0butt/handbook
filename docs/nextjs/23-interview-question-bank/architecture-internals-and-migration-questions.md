---
title: Architecture, Internals & Migration Questions
sidebar_position: 7
description: Interview questions for large-app architecture, monorepos, tenancy, BFF/service boundaries, RSC internals, build/runtime models, and modern Next.js migration.
---

# Architecture, Internals & Migration Questions

## 1. What is vertical-slice architecture?
Organizing code around product capabilities/use cases rather than only technical folders such as components, services and utils.

## 2. Why should route files be composition roots?
They should assemble route context, data and feature UI while durable business rules live in owned modules that can be reused and tested independently.

## 3. What is dependency direction?
Higher-level delivery/framework code depends on application/domain capabilities, while domain policy should avoid unnecessary dependence on Next.js route/runtime APIs.

## 4. Why use a DAL?
To centralize secure data access, tenant/resource scope, field projection and reusable server reads rather than scattering query/auth rules across pages.

## 5. Why use DTOs?
To expose only the fields a consumer needs and prevent database entities/secrets/internal fields from leaking across server/client or API boundaries.

## 6. Query vs command?
Queries read state; commands own state-changing business operations, authorization, transactions, idempotency, audit/outbox and invalidation.

## 7. Why are package exports useful in a monorepo?
They define explicit public package APIs and stop consumers from deep-importing internal implementation paths.

## 8. What does `transpilePackages` solve?
It lets Next.js transpile/bundle selected local or external packages correctly. It is a build integration mechanism, not a trust/security boundary.

## 9. Why create server/client package entry points?
To prevent browser consumers from accidentally importing server-only dependencies and to keep environment ownership explicit.

## 10. When should code become a shared package?
When it has stable cross-application ownership and reuse value. Product-specific logic should remain with its capability rather than entering a generic shared dumping ground.

## 11. How do you model multi-tenancy?
Carry tenant identity through session/membership, DAL queries, caches, jobs, search, storage, events and telemetry; ingress tenant hints are not authorization.

## 12. Permission vs entitlement vs feature flag?
Permission answers whether the actor may perform an action; entitlement whether the account/plan includes it; feature flag whether the capability is enabled/rolling out.

## 13. Is Next.js a full backend replacement?
Its server features can form an effective BFF/API layer, but dedicated services may still be appropriate for independent scaling, realtime protocols, workflows, specialized runtimes or organizational boundaries.

## 14. When use an event instead of a direct call?
When a completed business fact can be consumed asynchronously and eventual consistency is acceptable. Required synchronous invariants should remain synchronous.

## 15. When use a durable job?
For work that must survive request/process failure, be retried, tracked or rate-controlled—exports, imports, email, AI processing and reconciliation are common examples.

## 16. When split a service?
When a real constraint appears: independent scaling, failure isolation, regulatory/data boundary, runtime mismatch or strong team release autonomy.

## 17. What are Multi-Zones?
A Next.js architecture where separate applications own unique path sets and can deploy independently behind coordinated routing.

## 18. Main Multi-Zone trade-off?
Cross-zone navigation is a hard document navigation rather than seamless same-router client navigation, and assets/auth/version compatibility need coordination.

## 19. Why use ADRs?
To record context, options, decision and consequences for durable/high-cost architectural choices so teams understand why a design exists.

## 20. What is an architecture fitness function?
An automated check that continuously enforces an architectural invariant such as import boundaries, bundle budgets or tenant-safe interfaces.

## 21. What is RSC/Flight at a senior level?
A server-render representation/transport that carries Server Component results and client references. The concept matters; private wire bytes/headers are not application APIs.

## 22. What are client references?
Build-generated references that let server-render output identify Client Components/chunks for the browser without executing those components as server-only code.

## 23. What are Server Function references?
Build-generated identities linking client-invokable server references to executable server functions. Their private IDs/transport are framework internals.

## 24. Why can separate builds be incompatible during rollout?
Generated assets, route data, Action references and encrypted closure material can differ even when source looks similar. Treat a build as an immutable coherent artifact.

## 25. What does Turbopack do in current Next.js?
It is the default bundler for dev/build, analyzing the dependency graph and producing environment-specific client/server outputs with framework transforms.

## 26. What are `.next` manifests?
Serialized framework/compiler/runtime metadata used internally for routing, references, prerender/build assets and other orchestration. Unless documented, their schemas are private.

## 27. Why not import `next/dist/*`?
Those are private internals without normal public API stability and can change across releases.

## 28. What is Output File Tracing?
Build-time analysis that determines server runtime file dependencies so minimal production artifacts such as standalone output can be created.

## 29. Router Cache and route-tree reconciliation?
The client router stores route/RSC segment data and merges new navigation payloads with the existing tree, preserving compatible layouts and client state.

## 30. Node vs Edge runtime decision?
Choose based on APIs/packages/latency/deployment constraints. Current Proxy uses Node runtime; do not assume Edge is universally faster or the default for every server concern.

## 31. Why is a custom Next server an escape hatch?
It takes ownership of lifecycle/routing/server integration that Next normally manages and can disable or complicate framework deployment optimizations such as generated standalone behavior.

## 32. What is the first step of a major upgrade?
Freeze and inventory the current system: Next/React/Node versions, config, deprecated APIs, runtime assumptions, critical routes and production baselines.

## 33. What is `next upgrade`?
The first-party CLI upgrade workflow available in modern Next.js (16.1+), combining version updates and relevant migration tooling.

## 34. What are codemods good for?
Mechanical API/config transformations. They do not prove semantic correctness, security, cache behavior or production compatibility.

## 35. Which request APIs require modern async access?
`cookies`, `headers`, `draftMode`, and framework route values such as `params`/`searchParams` in their applicable contexts.

## 36. Why migrate `middleware.ts` to `proxy.ts`?
The current convention better communicates request-front-door semantics and replaces the deprecated Middleware naming/model.

## 37. What happened to `next lint`?
It was removed in Next.js 16. Run ESLint/Biome directly and keep linting as an explicit CI gate.

## 38. What happened to `serverRuntimeConfig`/`publicRuntimeConfig`?
They are removed from the modern model. Use environment variables and explicit server/public runtime configuration patterns.

## 39. How do you migrate old PPR/dynamicIO cache assumptions?
Move to current Cache Components, explicit cache identity/lifetimes/tags, request-time boundaries and Suspense shell/hole composition; keep old flags only as migration history.

## 40. How do you migrate a client-heavy SPA?
Incrementally: establish App Router routing, preserve behavior, move canonical reads server-side, narrow client islands, migrate mutations/auth/cache/resources, then delete duplicated legacy paths.

## 41. Why can a migration pass tests and still fail production?
Production build, proxy/CDN topology, multiple replicas, real databases/native packages, rolling version skew and real user devices can expose behavior test environments do not model.

## 42. What is the migration completion rule?
Target stable version deployed, deprecated compatibility removed, green production evidence, security/performance healthy, rollout observed and rollback/legacy cleanup completed.

## 43. Senior architecture answer pattern?
State capability owner, public boundary, data owner, security invariant, consistency/cache model, failure domain, deployment owner and evolution path.