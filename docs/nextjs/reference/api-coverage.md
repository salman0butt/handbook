---
title: API Coverage Contract
description: Living coverage map from the current Next.js App Router documentation to this handbook.
---

# Next.js App Router API Coverage Contract

This is the handbook's living completeness contract against the **current stable Next.js App Router documentation**.

**Baseline re-verified: July 29, 2026 — Next.js 16.2.12 (`latest`, 16.x Active LTS).**

Next.js 16.3 remains preview/canary at this snapshot and is not taught as stable.

A topic becomes ✅ only after the handbook teaches the useful mental model, current API behavior, production implications, failure modes, and appropriate security/performance/testing/deployment/architecture/internals trade-offs.

## Status legend

| Status | Meaning |
| --- | --- |
| ✅ | Covered to handbook quality bar |
| 🟠 | Foundation exists; deeper phase still required |
| 🟡 | Planned in roadmap |
| ⚠️ | Deprecated / migration-only behavior |
| 🧪 | Experimental, preview, canary, or stability-sensitive |
| ⛔ | Intentionally outside this handbook |

## Scope contract

| Area | Status | Notes |
| --- | --- | --- |
| App Router | ✅ | Primary and only router taught |
| Pages Router | ⛔ | Intentionally excluded except migration/history context |
| Next.js 16.2 stable behavior | 🟠 | Core framework behavior, production operations, large-app architecture, and senior internals mental models are complete; migration, projects and interview system remain |
| Next.js 16.3 preview/canary | 🧪 | Track but never teach as stable until promoted to npm `latest` |
| React 19.2 stable APIs | 🟠 | React handbook owns React depth; Next.js owns framework integration |
| React Canary exposed by App Router | 🟠 | Covered only where current stable Next.js docs establish a supported contract |
| React RSC bundler/framework internals | 🧪 | Feature-level RSC/Server Functions are stable; low-level bundler/framework integration is version-sensitive and not treated as an application API |
| Managed-host/platform behavior | 🟠 | Platform-specific material is labelled; Next.js core contracts remain distinct |

## Curriculum progress

| Phase | Status |
| --- | --- |
| 00 · Start Here | ✅ |
| 01 · Foundations | ✅ |
| 02 · App Router & Layouts | ✅ |
| 03 · Navigation & URL State | ✅ |
| 04 · Server & Client Components | ✅ |
| 05 · Data Fetching | ✅ |
| 06 · Caching, Rendering & Revalidation | ✅ |
| 07 · Mutations, Forms & Server Functions | ✅ |
| 08 · Route Handlers | ✅ |
| 09 · Request Pipeline & Proxy | ✅ |
| 10 · Rendering, Suspense & Streaming | ✅ |
| 11 · Metadata & SEO | ✅ |
| 12 · Images, Fonts & Scripts | ✅ |
| 13 · Authentication, Authorization & Security | ✅ |
| 14 · Errors, Observability & Debugging | ✅ |
| 15 · Performance | ✅ |
| 16 · Testing | ✅ |
| 17 · Deployment & Production Operations | ✅ |
| 18 · Architecture & Large Applications | ✅ |
| 19 · Internals & Senior Mental Models | ✅ |
| 20 · Upgrades & Modern Migration | 🟡 |
| 21–24 · Projects & Interview System | 🟡 |

## Getting Started & Project Structure

| Official area | Status | Handbook location |
| --- | --- | --- |
| Installation / project structure | ✅ | Phase 01; large-app organisation Phase 18 |
| `app` route tree / colocation | ✅ | Phases 01–02; architecture ownership Phase 18; route-tree internals Phase 19 |
| private folders | ✅ | Phase 02 semantics; organisational use Phase 18 |
| route groups | ✅ | Phase 02 semantics; team/product grouping Phase 18 |
| multiple root layouts | ✅ | Phase 02; full-navigation architecture trade-off Phase 18 |
| optional `src` folder | ✅ | Phase 01; structure context Phase 18 |
| production checklist | ✅ | Performance 15; testing 16; deployment 17; architecture 18; internals diagnostics 19 |
| upgrading | 🟠 | Foundations exist; deep Phase 20 |

## Routing & Navigation

| Area | Status | Notes |
| --- | --- | --- |
| pages / layouts / templates | ✅ | Phase 02; segment identity/reconciliation Phase 19 |
| dynamic / catch-all / optional catch-all segments | ✅ | Phase 02 |
| async `params` | ✅ | Phases 02 / 08 / 11 / 13 |
| `generateStaticParams`, `dynamicParams` | ✅ | Phases 02 / 06 / 08 |
| `loading`, `error`, `global-error`, `not-found`, `default` | ✅ | Phases 02 / 10 / 14; runtime/tree consequences Phase 19 |
| `global-not-found` | 🧪 | Experimental at current baseline |
| parallel / intercepting routes | ✅ | Phase 02; rendering/tests 10/16; active-route-tree model Phase 19 |
| `<Link>` / prefetching | ✅ | Phase 03; performance/testing 15–16; prefetch scheduling/cache model 19 |
| `useRouter`, `router.refresh`, `router.prefetch` | ✅ | Phase 03; router reconciliation mental model 19 |
| URL/path/search/layout hooks | ✅ | Phase 03 |
| redirects / History API / scroll / focus | ✅ | Phase 03 |
| hard vs soft navigation | ✅ | Phases 10 / 14–16; cross-zone hard navigation Phase 18; internals/skew Phase 19 |
| route ownership by capability/team | ✅ | Phase 18 |
| route-tree reconciliation / shared segment preservation | ✅ | Phase 19 |
| Router Cache segment reuse / browser-memory lifetime | ✅ | Phase 06 baseline; deep Phase 19 |
| deployment-skew hard-navigation fallback | ✅ | Phase 17 contract; client-router internals Phase 19 |

## Server & Client Components

| Concept / API | Status | Notes |
| --- | --- | --- |
| Server Components default | ✅ | Phase 04; architecture 18; RSC internals 19 |
| `'use client'` module graph | ✅ | Phase 04; security/performance 13/15; package boundaries 18; graph partitioning 19 |
| Server → Client composition / serializable props | ✅ | Phase 04; client-reference transport depth 19 |
| provider placement | ✅ | Phase 04; global-state governance 18 |
| `server-only` / `client-only` | ✅ | Phase 04; shared-package boundaries 18; graph constraint model 19 |
| RSC payload / HTML / hydration | ✅ | Phase 10; Flight/client-reference internals Phase 19 |
| Client Components can be prerendered before hydration | ✅ | Phase 10; graph/hydration deep model 19 |
| Server Components do not hydrate | ✅ | Phase 10; Phase 19 |
| RSC / Flight wire representation | 🧪 | Framework transport implementation detail; Phase 19 teaches the conceptual contract, not private parsing |
| client references between server/client graphs | ✅ | Phase 19 |
| server references for Server Functions | ✅ | Phase 19 |
| production Server Component error sanitization | ✅ | Phase 14; response-boundary reasoning 19 |
| async Server Component testing caveat | ✅ | Phase 16 |
| narrow client-island architecture | ✅ | Phases 04 / 15 / 18 |
| environment-specific package entry points | ✅ | Phase 18 |
| React RSC bundler APIs | 🧪 | React warns framework/bundler RSC APIs do not follow normal semver; never application baseline |

## Data Access & Domain Architecture

| Area | Status | Notes |
| --- | --- | --- |
| async Server Component data ownership | ✅ | Phase 05 |
| server `fetch` / direct DB/ORM/SDK access | ✅ | Phase 05 |
| avoid own Route Handler hop from Server Component | ✅ | Phases 05 / 08; architecture 18; transport reasoning 19 |
| parallel/sequential fetching, N+1, batching | ✅ | Phase 05; performance 15 |
| React `cache` / preload | ✅ | Phase 05; distinct from persistent framework caches Phase 19 |
| external schema/status validation / timeouts / retries | ✅ | Phase 05 |
| secure DAL | ✅ | Phase 13; large-app ownership Phase 18 |
| DTO projection / field exposure | ✅ | Phase 13; architecture contract Phase 18; RSC boundary exposure Phase 19 |
| tenant/resource-scoped queries / IDOR prevention | ✅ | Phase 13; multi-tenant architecture 18 |
| read/query vs write/command separation | ✅ | Phase 18 |
| application commands / domain policies | ✅ | Phase 18 |
| provider adapters / ports | ✅ | Phase 18 |
| transaction ownership / idempotency / outbox | ✅ | Phases 07 / 17; architecture 18 |

## Caching, Rendering & Revalidation

| Area / API | Status | Notes |
| --- | --- | --- |
| current server `fetch` cache semantics | ✅ | Phase 06 |
| `cache: 'no-store'`, `cache: 'force-cache'` | ✅ | Phase 06 |
| `next.revalidate`, `next.tags` | ✅ | Phase 06 |
| Cache Components / `'use cache'` / `cacheLife` / `cacheTag` | ✅ | Phase 06; prerender/cache execution internals 19 |
| `revalidateTag`, `updateTag`, `revalidatePath`, `refresh` | ✅ | Phases 06–07; state-transition/invalidation model 19 |
| `connection()` | ✅ | Phase 06; explicit request-time boundary mental model 19 |
| `'use cache: private'` | 🧪 | Experimental/specialized cache mode; never generalized into ordinary public cache semantics |
| `'use cache: remote'` | ✅ | Phase 06; storage vs semantic ownership distinction Phase 19 |
| partial prerendering through Cache Components | ✅ | Phases 06 / 10; static-shell/request-hole execution graph 19 |
| Client Router Cache | ✅ | Phase 06; route-segment/prefetch internals 19 |
| `cacheLife.stale` client reuse connection | ✅ | Phase 19; server freshness policy affects Router Cache reuse without exposing private transport as app API |
| custom `cacheHandler` / Cache Components `cacheHandlers` | ✅ | Phase 17 |
| multi-instance invalidation / cache versioning | ✅ | Phase 17 |
| cache key/freshness/invalidation ownership | ✅ | Phase 18; cache-state mental model 19 |
| tenant/user cache identity | ✅ | Phases 06 / 13 / 17; architecture depth 18; internals security model 19 |
| cached vs request-time vs streamed work as independent dimensions | ✅ | Phase 19 |
| private generated cache key representation | ⛔ | Intentionally not an application contract; Phase 19 teaches semantic identity only |

## Mutations, Forms & Server Actions

| Area | Status | Notes |
| --- | --- | --- |
| Server Function / Server Action terminology | ✅ | Phase 07; React/Next transport distinction 19 |
| `'use server'` | ✅ | Phase 07; compiler/reference semantics 19 |
| FormData / progressive enhancement | ✅ | Phase 07; transport lifecycle 19 |
| `useActionState`, `useFormStatus`, `useOptimistic` | ✅ | Phase 07 |
| validation / authorization / CSRF | ✅ | Phases 07 / 13; network-endpoint model 19 |
| expected errors / optimistic UI / concurrency | ✅ | Phases 07 / 14 |
| transactions / idempotency / outbox | ✅ | Phase 07; operations 17; command architecture 18; distributed-call reasoning 19 |
| Server Action tests | ✅ | Phase 16 |
| Server Action encryption/key consistency | ✅ | Phases 13 / 17; closure transport/skew internals 19 |
| Actions as UI mutation adapters over commands | ✅ | Phase 18 |
| Server Function build-time references / POST invocation | ✅ | Phase 19 |
| React-supported Server Function serialization model | ✅ | Phase 19 |
| captured closure encryption | ✅ | Security 13; key operations 17; transport mental model 19 |
| generated Action/reference IDs | 🧪 | Build-private framework identity; Phase 19 teaches compatibility implications, not application coupling |
| current one-at-a-time client Server Function dispatch | 🧪 | Documented implementation detail that may change; Phase 19 explicitly excludes it from correctness design |
| Action response can carry result + updated RSC UI | ✅ | Phase 07 behavior; roundtrip internals Phase 19 |
| failed-to-find Action / old-tab deployment-skew model | ✅ | Phase 17 rollout contract; Phase 19 internals/debugging |

## Route Handlers, BFF & HTTP

| Area | Status | Notes |
| --- | --- | --- |
| methods / Request / Response / NextRequest / NextResponse | ✅ | Phase 08 |
| request bodies / validation / files / streaming | ✅ | Phase 08; body ownership/request lifecycle 19 |
| GET caching / HTTP cache vs Next cache | ✅ | Phase 08 |
| CORS / CSRF / auth / webhooks / rate limits | ✅ | Phases 08 / 13 |
| safe HTTP failure envelopes | ✅ | Phase 14 |
| HTTP contract tests | ✅ | Phase 16 |
| reverse-proxy body/time/rate limits | ✅ | Phase 17; layered request lifecycle 19 |
| Backend-for-Frontend model | ✅ | Phase 08; architectural ownership Phase 18 |
| Route Handlers are public endpoints | ✅ | Phases 08 / 18 |
| Next.js backend layer is not a universal backend replacement | ✅ | Phase 18; matches current BFF guide |
| public/mobile/external API vs direct server call decision | ✅ | Phase 18 |
| Web request-body one-read / raw webhook verification | ✅ | Phase 08; request-pipeline internals 19 |

## Proxy & Request Pipeline

| Area | Status | Notes |
| --- | --- | --- |
| `proxy.ts` / request order / matchers | ✅ | Phase 09; exact request-lifecycle model Phase 19 |
| `middleware.ts` migration | ⚠️ | Migration-only; deep Phase 20 |
| `NextResponse.next()` / headers / cookies | ✅ | Phase 09 |
| redirects / rewrites / localization / tenancy | ✅ | Phase 09 |
| Proxy not sole authorization boundary | ✅ | Phase 13 |
| `waitUntil` | ✅ | Phase 09; not a durable queue; lifecycle context 19 |
| Proxy test helpers | 🧪 | Experimental; Phase 16 |
| Proxy as request-front-door, not domain service locator | ✅ | Phase 18 |
| current Proxy Node.js runtime | ✅ | Phase 09 deployment context; internals/runtime depth 19 |
| Proxy runtime export not configurable | ✅ | Current Next.js 16 contract; Phase 19 |
| RSC-safe rewrites / framework handling of Flight routing metadata | ✅ | Phase 09 behavior; private-transport boundary Phase 19 |
| internal RSC/Flight request headers | ⛔ | Framework-private transport; do not use as business-routing API |
| static-export Proxy support | ⛔ | Not available with `output: 'export'` |

## Rendering, Metadata & Browser Resources

| Area | Status | Notes |
| --- | --- | --- |
| RSC / HTML / hydration / Suspense / streaming | ✅ | Phase 10; deep transport/lifecycle mental model 19 |
| Cache Components shell / dynamic holes | ✅ | Phase 10; prerender execution internals 19 |
| streamed error/status caveats | ✅ | Phase 14; header-commit/request-lifecycle reasoning 19 |
| end-to-end infrastructure streaming | ✅ | Phase 17; response-assembly tracing 19 |
| Metadata API / social images / robots / sitemap / JSON-LD | ✅ | Phase 11 |
| metadata/viewport participation in prerender analysis | ✅ | Phase 11; execution-graph depth 19 |
| `next/image` responsive/security/cache model | ✅ | Phase 12 |
| image `preload` | ✅ | Current Next.js 16 API |
| image `priority` | ⚠️ | Deprecated in Next.js 16 |
| `next/font` / `next/script` | ✅ | Phase 12 |
| `@next/third-parties` | 🧪 | Experimental at baseline |
| asset/resource ownership in multi-app architecture | ✅ | Phases 17 / 18 |

## Authentication, Authorization & Multi-Tenancy

| Area | Status | Notes |
| --- | --- | --- |
| authentication vs session vs authorization | ✅ | Phase 13 |
| secure sessions / OAuth/OIDC / MFA / recovery | ✅ | Phase 13 |
| DAL authorization / RBAC / ownership / tenancy | ✅ | Phase 13 |
| CSRF / XSS / CSP / secrets / SSRF / uploads | ✅ | Phase 13 |
| threat modeling / audit events | ✅ | Phase 13 |
| security regression tests | ✅ | Phase 16 |
| production secret injection / access controls | ✅ | Phase 17 |
| tenant ingress identity vs authorization | ✅ | Phase 18 |
| custom-domain tenant mapping/verification architecture | ✅ | Phase 18 |
| tenant-scoped DB/cache/jobs/storage/search/events | ✅ | Phase 18 |
| cross-tenant admin capability / noisy-neighbour controls | ✅ | Phase 18 |
| entitlement vs release flag vs permission | ✅ | Phase 18 |
| RSC/Action/browser transport does not preserve secrecy or authority | ✅ | Phase 19; server authorization/DTO boundaries remain authoritative |
| captured Server Action values are snapshots, not authorization truth | ✅ | Phase 19 |
| `unauthorized()`, `forbidden()`, `authInterrupts` | 🧪 | Experimental/non-baseline |
| React taint APIs | 🧪 | Defense in depth only |

## Errors, Observability & Performance

| Area / API | Status | Notes |
| --- | --- | --- |
| error boundaries / digests / `notFound()` / redirects | ✅ | Phase 14; render/stream timing model 19 |
| `after()` lifecycle | ✅ | Phase 14; durability distinction 17/18; shutdown/request lifecycle 19 |
| server/client instrumentation / OpenTelemetry | ✅ | Phase 14 |
| SLI/SLO/error budgets / runbooks | ✅ | Phase 14 |
| Core Web Vitals / RUM / `useReportWebVitals` | ✅ | Phase 15 |
| bundle/lazy-loading/React Compiler integration | ✅ | Phase 15 |
| DB/upstream/tail latency/capacity/backpressure | ✅ | Phases 15 / 17 |
| feature/module telemetry ownership | ✅ | Phase 18 |
| cross-service request/event correlation | ✅ | Phase 18 |
| ownership/lifecycle/representation/version debugging model | ✅ | Phase 19 |
| hard-vs-soft request trace comparison | ✅ | Phase 19 |
| build/deployment IDs as diagnostic dimensions | ✅ | Phase 17 contract; debugging depth 19 |
| `experimental.webVitalsAttribution`, Turbopack analyzer, `inlineCss`, `optimizePackageImports` | 🧪 | Experimental at baseline |

## Testing & Release Confidence

| Area | Status | Notes |
| --- | --- | --- |
| risk-driven unit/component/integration/E2E portfolio | ✅ | Phase 16 |
| Vitest / Jest / RTL / Playwright / Cypress | ✅ | Phase 16 |
| async Server Component E2E recommendation | ✅ | Phase 16 |
| data/cache/action/API/security/browser tests | ✅ | Phase 16 |
| deterministic test data / flake control / sharding | ✅ | Phase 16 |
| production build as release gate | ✅ | Phase 16; CI/CD 17; build-pipeline reasoning 19 |
| architecture fitness functions / dependency checks | ✅ | Phase 18 |
| cross-tenant and cross-zone architecture regression tests | ✅ | Phase 18 |
| old-tab / rolling-deploy Action-navigation compatibility test | ✅ | Phase 19 |
| production-mode hard-vs-soft navigation debugging tests | ✅ | Phase 19 |
| `next/experimental/testing/server`, Proxy helpers, `@next/playwright` | 🧪 | Experimental |

## Deployment & Production Operations

| Area / API | Status | Notes |
| --- | --- | --- |
| build/start/request lifecycle | ✅ | Phase 17; deeper compile/prerender/request/browser lifecycle 19 |
| `next build` / `next start` | ✅ | Phase 17; build/runtime pipeline 19 |
| Turbopack default production/dev bundler in Next.js 16 | ✅ | Phase 19 |
| unified dependency graph → environment-specific outputs | ✅ | Phase 19; implementation mental model, not “one bundle” |
| route compilation / runtime lookup metadata | ✅ | Phase 19 |
| private `.next` manifests | ⛔ | Diagnostic implementation details only; Phase 19 explicitly forbids application coupling |
| output file tracing / `output: 'standalone'` / standalone server | ✅ | Phase 17; static-analysis/build internals 19 |
| `serverExternalPackages` | ✅ | Performance/package context 15/18; bundling/runtime responsibility Phase 19 |
| Docker / read-only & ephemeral filesystem concerns | ✅ | Phase 17 |
| self-hosting / reverse proxy / forwarded-header trust | ✅ | Phase 17; request-lifecycle depth 19 |
| streaming through load balancer/proxy/CDN | ✅ | Phase 17; response assembly 19 |
| graceful shutdown / pending `after()` | ✅ | Phase 17; process lifecycle 19 |
| liveness/readiness / autoscaling / DB pools | ✅ | Phase 17; process/pool multiplication mental model 19 |
| build/runtime env and `NEXT_PUBLIC_` semantics | ✅ | Phase 17; artifact-input mental model 19 |
| `cacheHandler` / `cacheHandlers` / distributed invalidation | ✅ | Phase 17 |
| `generateBuildId` / `deploymentId` / rolling skew | ✅ | Phase 17; build/client-router compatibility depth 19 |
| queues/workers/DLQ/outbox/scheduled work | ✅ | Phase 17 |
| CI/CD / migrations / canary-blue-green / rollback | ✅ | Phase 17 |
| `output: 'export'` and unsupported runtime features | ✅ | Phase 17 |
| Adapter API / stable top-level `adapterPath` | ✅ | Phase 17 |
| architecture/deployment boundary decision | ✅ | Phase 18 |
| Node.js default rendering runtime | ✅ | Foundations/deployment; process/runtime depth 19 |
| Edge runtime capability boundary | ✅ | Phase 19; Cache Components incompatibility explicitly current |
| current Proxy Node runtime | ✅ | Phase 19 |
| custom Next.js server | ✅ | Phase 19: uncommon escape hatch, extra lifecycle ownership, not the default senior architecture |
| custom server vs standalone generated server incompatibility | ✅ | Phase 19 |

## Architecture & Large Applications

| Area | Status | Notes |
| --- | --- | --- |
| capability / vertical-slice architecture | ✅ | Phase 18 |
| route files as composition roots | ✅ | Phase 18 |
| dependency direction / module public APIs | ✅ | Phase 18 |
| safe App Router colocation | ✅ | Current project-structure contract; Phase 18 |
| private-folder / route-group organisational patterns | ✅ | Phase 18 |
| feature-local vs shared UI ownership | ✅ | Phase 18 |
| DAL/query / command / DTO / policy architecture | ✅ | Phase 18 |
| transaction, idempotency, outbox ownership | ✅ | Phase 18 |
| monorepo workspace architecture | ✅ | Phase 18 |
| shared package `exports` and server/client entry points | ✅ | Phase 18 |
| `transpilePackages` for local/external packages | ✅ | Stable config; Phase 18 |
| `serverExternalPackages` architecture context | ✅ | Performance 15; package boundary context 18; runtime internals 19 |
| design-system ownership / product-agnostic primitives | ✅ | Phase 18 |
| package dependency cycles / architecture enforcement | ✅ | Phase 18 |
| multi-tenant routing/data/cache/job/storage/event architecture | ✅ | Phase 18 |
| feature flags / entitlement / authorization separation | ✅ | Phase 18 |
| configuration lifecycle / public allow-list / kill switches | ✅ | Phase 18 |
| shared state categorisation / avoid duplicated server truth | ✅ | Phase 18 |
| provider adapters / API vs in-process boundary | ✅ | Phase 18 |
| events / commands / durable jobs / workflow boundaries | ✅ | Phase 18 |
| service-extraction decision / data ownership | ✅ | Phase 18 |
| API/event/job compatibility | ✅ | Phase 18 |
| Multi-Zones micro-frontend model | ✅ | Current official guide; Phase 18 |
| unique zone path ownership | ✅ | Phase 18 |
| unique `assetPrefix` for zone assets | ✅ | Phase 18 |
| cross-zone hard navigation / anchor semantics | ✅ | Phase 18; client-runtime reason Phase 19 |
| rewrites vs dynamic Proxy zone routing | ✅ | Phase 18 |
| shared code via monorepo/packages across zones | ✅ | Phase 18 |
| multi-zone auth/session/Server Action origin considerations | ✅ | Phase 18 |
| team/on-call/deployment ownership alignment | ✅ | Phase 18 |
| ADRs / architecture fitness functions / golden paths | ✅ | Phase 18 |
| data/cache/security/failure/operational ownership matrices | ✅ | Phase 18 |
| reference large-app architecture / senior design review | ✅ | Phase 18 |
| custom Next.js server | ✅ | Phase 19 internals/runtime context |
| RSC/build/request internals | ✅ | Deep Phase 19 |

## Internals & Senior Mental Models

| Area | Status | Notes |
| --- | --- | --- |
| public contract vs documented implementation detail vs private implementation | ✅ | Phase 19 |
| compile / build / prerender / startup / request / browser lifecycle separation | ✅ | Phase 19 |
| React vs Next.js ownership boundaries | ✅ | Phase 19 |
| RSC/Flight conceptual payload model | ✅ | Phase 19; private wire encoding excluded |
| server/client module graph partitioning | ✅ | Phase 19 |
| Client Component reference resolution | ✅ | Phase 19 |
| Server Function reference resolution | ✅ | Phase 19 |
| Client Component prerender HTML vs hydration | ✅ | Phase 19 |
| route segment identity / layout preservation / template remount | ✅ | Phase 19 |
| parallel/intercepting route state as route tree | ✅ | Phase 19 |
| Turbopack unified graph mental model | ✅ | Phase 19 |
| framework directives as compiler signals | ✅ | Phase 19 |
| route-tree compilation and serialized runtime metadata | ✅ | Phase 19 |
| build manifests as private serialized compiler knowledge | ✅ | Phase 19 diagnostic model; private schemas excluded |
| build ID vs deployment ID | ✅ | Phase 19 |
| Output File Tracing static-analysis mental model | ✅ | Phase 19 |
| standalone traced artifact internals | ✅ | Phase 19 |
| prerender static shell + cached work + request-time Suspense holes | ✅ | Phase 19 |
| cache identity from semantic inputs/closures | ✅ | Phase 19; generated key format private |
| request APIs / `connection()` as request-time ownership | ✅ | Phase 19 |
| server-cache vs Router Cache freshness model | ✅ | Phase 19 |
| prefetch scheduling / partial prefetch / route-segment reuse | ✅ | Phase 19 |
| RSC route-tree reconciliation on soft navigation | ✅ | Phase 19 |
| hard navigation on deployment skew | ✅ | Phase 19 |
| Server Function POST/reference/serialization roundtrip | ✅ | Phase 19 |
| closure encryption and build-key compatibility | ✅ | Phase 19 |
| Action result + updated UI/RSC response model | ✅ | Phase 19 |
| current client Action serialization | 🧪 | Implementation detail; explicitly not correctness baseline |
| request pipeline config → Proxy → rewrites → match → render/handler | ✅ | Phase 19 |
| HTML vs RSC vs Action request representations | ✅ | Phase 19 |
| streaming header/status/error timing | ✅ | Phase 19 |
| async request/work context internals | 🧪 | Acknowledged only as private framework machinery; public request APIs remain contract |
| Node runtime process/global/pool mental model | ✅ | Phase 19 |
| Edge capability/process distinction | ✅ | Phase 19 |
| custom server lifecycle/ejection trade-off | ✅ | Phase 19 |
| exact-version source inspection / evidence ladder | ✅ | Phase 19 |
| private `next/dist/*` imports | ⛔ | Explicitly excluded from application architecture |
| private `.next` manifest schema coupling | ⛔ | Explicitly excluded |
| manual RSC payload parsing | ⛔ | Framework transport, not application API |
| manual Server Action transport construction | ⛔ | Framework transport, not durable external API |
| private internal headers as business API | ⛔ | Explicitly excluded |
| first-principles ownership/lifecycle/representation/version debugging | ✅ | Phase 19 |
| senior internals design review / mastery model | ✅ | Phase 19 |

## Upgrades & Migration

| Area | Status | Notes |
| --- | --- | --- |
| App Router upgrade workflow | 🟠 | Phase 01; deep 20 |
| client-heavy SPA → server-first | 🟠 | Foundations through 19; deep 20 |
| previous cache model → Cache Components | 🟠 | Phase 06 plus current internals 19; deep migration 20 |
| modular-monolith → packages/services/zones migration principles | ✅ | Architecture path Phase 18; version/framework migration depth 20 |
| old standalone PPR/dynamicIO/useCache flags | ⚠️ | Migration-only |
| old GET Route Handler cached-by-default assumptions | ⚠️ | Current behavior Phase 08 |
| `middleware.ts` → `proxy.ts` | ⚠️ | Phase 09; deep 20 |
| old Image APIs / `next export` CLI | ⚠️ | Current alternatives taught Phases 12 / 17 |
| earlier `experimental.adapterPath` form | ⚠️ | Current stable 16.2 form Phase 17 |
| experimental auth/error/performance/testing APIs | 🧪 | Never silently promoted to migration targets |
| Pages Router / Pages API Routes | ⛔ | Outside scope except contextual migration comparison |

## Phase 19 completion note

Phase 19 is complete for senior internals reasoning because it teaches:

- the stability hierarchy between public framework contracts, documented implementation details, and private implementation evidence, including the React RSC bundler-semver caveat and exact-version source-inspection discipline
- RSC/Flight as framework transport, server/client module graph partitioning, client/server references, serialization, initial HTML, Client Component hydration, layout/route-tree reconciliation and private wire-format boundaries
- the Next.js 16 Turbopack build pipeline, framework directive transforms, route compilation, private manifest purpose, build/deployment identity, Output File Tracing, standalone artifact closure, server package bundling/externalization and build-vs-runtime failure classification
- Cache Components prerender execution: static HTML/RSC shell, cached async work, Suspense request-time holes, `connection()`, request APIs, semantic cache identity, `cacheLife` freshness, Router Cache linkage, revalidation state transitions and multi-instance consequences
- the browser router model: prefetch scheduling, loading-boundary partial prefetch, segment-keyed Router Cache, hard-vs-soft navigation, shared layout preservation, parallel/intercepting route context, Action-driven refresh and deployment-skew hard reload
- Server Function/Action internals: build-generated server references, POST transport, React serialization, closure snapshots/encryption, build-key and action-reference compatibility, CSRF/origin boundaries, idempotency/transactions, result-plus-RSC response and the current one-at-a-time client dispatch explicitly labelled implementation detail
- end-to-end request lifecycle from infrastructure through config/Proxy/rewrites/matching into Route Handler or RSC rendering, with cache hit/miss paths, request context, streaming, header/status commitment, error digests, `after()`/`waitUntil()` durability limits, body ownership and layered timeout reasoning
- Node vs Edge runtime constraints, current Node Proxy behavior, process-local globals/SDKs/pools, package bundling and `serverExternalPackages`, native/runtime artifact compatibility, graceful shutdown and why custom server is an uncommon ejection path rather than the default advanced architecture
- first-principles debugging and design review using ownership, lifecycle, representation, cache state and release/deployment version, while explicitly rejecting private `.next` schemas, `next/dist` imports, manual Flight parsing and private Action/header protocols as application contracts

Phase 20 now owns **Upgrades & Modern Migration**. Projects and interview systems remain Phases 21–24.

## Completion rule

The handbook is not complete until this contract is re-audited against the then-current stable Next.js docs and every stable in-scope item has a justified final state.

See [Final Completeness Audit](./final-completeness-audit.md) for the release gate.
