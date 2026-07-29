---
title: API Coverage Contract
description: Living coverage map from the current Next.js App Router documentation to this handbook.
---

# Next.js App Router API Coverage Contract

This is the handbook's living completeness contract against the **current stable Next.js App Router documentation**.

**Baseline re-verified: July 29, 2026 — Next.js 16.2.12 (`latest`, 16.x Active LTS).**

Next.js 16.3 remains preview/canary at this snapshot and is not taught as stable.

A topic becomes ✅ only after the handbook teaches the useful mental model, current API behavior, production implications, failure modes, and appropriate security/performance/testing/deployment trade-offs.

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
| Next.js 16.2 stable behavior | 🟠 | Routing, data, caching, mutations, HTTP, Proxy, rendering, metadata/resources, security, errors, observability, performance, testing, deployment and production operations complete; architecture/internals/migration/projects/interviews remain |
| Next.js 16.3 preview/canary | 🧪 | Track but never teach as stable until promoted to npm `latest` |
| React 19.2 stable APIs | 🟠 | React handbook owns React depth; Next.js owns framework integration |
| React Canary exposed by App Router | 🟠 | Covered only where current stable Next.js docs establish a supported contract |
| Managed-host/platform behavior | 🟠 | Platform-specific material is labeled; Next.js core contracts remain distinct |

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
| 18 · Architecture & Large Applications | 🟡 |
| 19 · Internals & Senior Mental Models | 🟡 |
| 20 · Upgrades & Modern Migration | 🟡 |
| 21–24 · Projects & Interview System | 🟡 |

## Getting Started & Core App Router

| Official area | Status | Handbook location |
| --- | --- | --- |
| Installation / project structure | ✅ | Phase 01 |
| Layouts and pages | ✅ | Phase 02 |
| Linking and navigating | ✅ | Phase 03 |
| Server and Client Components | ✅ | Phase 04 |
| Fetching data | ✅ | Phase 05 |
| Cache Components | ✅ | Phase 06; rendering 10; performance 15; testing 16; operations 17 |
| Caching and revalidating | ✅ | Phase 06; testing 16; multi-instance operations 17 |
| Mutating data / Server Functions | ✅ | Phase 07; security 13; tests 16; rollout concerns 17 |
| Route Handlers | ✅ | Phase 08; tests 16; production deployment 17 |
| Proxy | ✅ | Phase 09; tests 16; self-hosting/static-export boundary 17 |
| Streaming / Suspense | ✅ | Phase 10; performance 15; browser tests 16; end-to-end infrastructure streaming 17 |
| Metadata / SEO | ✅ | Phase 11 |
| Images / fonts / scripts | ✅ | Phase 12; performance 15; deployment/static-hosting implications 17 |
| Authentication / application security | ✅ | Phase 13; security tests 16; production secrets/access 17 |
| Error handling / observability | ✅ | Phase 14; production exporter/release operations 17 |
| Performance | ✅ | Phase 15; regression gates 16; capacity and rollout 17 |
| Testing | ✅ | Phase 16 |
| Deploying / self-hosting / platforms | ✅ | Phase 17 |
| Upgrading | 🟠 | Foundations exist; full Phase 20 |

## Routing & File Conventions

| API / convention | Status | Notes |
| --- | --- | --- |
| `app/` route tree | ✅ | Phases 01–02 |
| `page`, `layout`, `template` | ✅ | Phase 02 |
| route groups / private folders / multiple roots | ✅ | Phase 02 |
| dynamic/catch-all/optional catch-all segments | ✅ | Phase 02 |
| async `params` | ✅ | Phases 02 / 08 / 11 / 13; testing 16 |
| `generateStaticParams`, `dynamicParams` | ✅ | Phases 02 / 06 / 08 |
| `loading` | ✅ | Phase 02; rendering 10; performance 15; E2E 16 |
| `error`, `global-error` | ✅ | Phase 14 depth; testing 16 |
| `not-found` / `notFound()` | ✅ | Phases 02 / 14; browser tests 16 |
| `global-not-found` | 🧪 | Experimental at current baseline |
| `default` | ✅ | Phase 02 |
| `route` | ✅ | Phase 08 |
| `proxy` | ✅ | Phase 09 |
| parallel / intercepting routes | ✅ | Phase 02; rendering 10; E2E 16 |
| metadata file conventions | ✅ | Phase 11 |
| `instrumentation.ts` | ✅ | Phase 14; startup/runtime operations 17 |
| `instrumentation-client.ts` | ✅ | Phase 14 |
| `unauthorized.js` / `forbidden.js` | 🧪 | Experimental auth interrupts; Phase 13 labels non-baseline |

## Navigation & URL State

| Area | Status | Notes |
| --- | --- | --- |
| `<Link>` / prefetching | ✅ | Phase 03; performance 15; testing 16 |
| `useRouter`, `router.refresh`, `router.prefetch` | ✅ | Phase 03 |
| `usePathname`, `useSearchParams`, `useParams` | ✅ | Phase 03 |
| selected layout segment hooks | ✅ | Phase 03 |
| `useLinkStatus` | ✅ | Phase 03 |
| `redirect`, `permanentRedirect` | ✅ | Phases 03 / 07–09 / 13–14 |
| native History API / scroll / focus | ✅ | Phase 03; E2E 16 |
| hard vs soft navigation | ✅ | Rendering 10; debugging 14; performance 15; testing 16; deployment skew 17 |
| redirect allow-list / open-redirect protection | ✅ | Phases 03 / 08 / 13; regression tests 16 |

## Server & Client Components

| Concept / API | Status | Notes |
| --- | --- | --- |
| Server Components default | ✅ | Phase 04; browser-JS performance 15 |
| `'use client'` module graph | ✅ | Phase 04; security 13; performance 15 |
| Server → Client composition | ✅ | Phase 04 |
| serializable props / minimal DTOs | ✅ | Phase 04; security 13 |
| provider placement | ✅ | Phase 04 |
| `server-only` / `client-only` | ✅ | Phase 04; secrets 13 |
| RSC payload / HTML / hydration | ✅ | Phase 10; performance 15; browser tests 16 |
| production Server Component error sanitization | ✅ | Phase 14 |
| async Server Component unit-test caveat | ✅ | Phase 16; E2E is current production baseline where unit tooling lacks support |
| Next.js React Compiler integration | ✅ | Phase 15 |

## Data Fetching & Secure Data Access

| Area | Status | Notes |
| --- | --- | --- |
| async Server Components / server data ownership | ✅ | Phase 05 |
| server `fetch` | ✅ | Phases 05–06 |
| direct DB/ORM/SDK access | ✅ | Phase 05; security 13; performance 15; integration tests 16; pool operations 17 |
| avoid own Route Handler hop from Server Component | ✅ | Phases 05 / 08 |
| parallel/sequential fetching / waterfalls | ✅ | Phase 05; performance 15 |
| N+1 / batching / bounded fan-out | ✅ | Phase 05; capacity 15/17 |
| preload / React `cache` | ✅ | Phase 05 |
| external schema/status validation | ✅ | Phase 05 |
| timeout/retry/failure translation | ✅ | Phases 05 / 14; capacity 15/17 |
| DAL / DTO projection | ✅ | Phase 13 |
| tenant/resource-scoped queries / IDOR prevention | ✅ | Phase 13; negative tests 16 |

## Caching, Rendering & Revalidation

| Area / API | Status | Notes |
| --- | --- | --- |
| current server `fetch` cache semantics | ✅ | Phase 06 |
| `cache: 'no-store'`, `cache: 'force-cache'` | ✅ | Phase 06 |
| `next.revalidate`, `next.tags` | ✅ | Phase 06 |
| React `cache` vs persistent Next cache | ✅ | Phases 05–06 |
| Cache Components (`cacheComponents: true`) | ✅ | Phase 06 |
| `'use cache'`, `cacheLife`, `cacheTag` | ✅ | Phase 06 |
| `revalidateTag`, `updateTag`, `revalidatePath`, `refresh` | ✅ | Phases 06–07; tests 16; multi-instance propagation 17 |
| `connection()` | ✅ | Phase 06 |
| previous unstable cache APIs | ⚠️ | Migration context only |
| `'use cache: private'` | 🧪 | Experimental |
| partial prerendering through Cache Components | ✅ | Phases 06 / 10; production streaming requirement 17 |
| Client Router Cache | ✅ | Phase 06; testing 16 |
| cache isolation / tenant-user keying | ✅ | Phases 06 / 13; tests 16; distributed ops 17 |
| custom server `cacheHandler` | ✅ | Phase 17; stable server response/ISR cache integration |
| Cache Components `cacheHandlers` | ✅ | Phase 06 baseline; multi-instance/deployment depth 17 |
| `cacheMaxMemorySize` distributed-cache context | ✅ | Phase 17 |
| multi-instance tag/path invalidation | ✅ | Phase 17 |
| CDN/cache-control variant safety | ✅ | Phase 17 |
| cache backend outage/stampede/versioning | ✅ | Phases 15 / 17 |

## Mutations, Server Actions & Forms

| Area | Status | Notes |
| --- | --- | --- |
| Server Function / Server Action terminology | ✅ | Phase 07 |
| `'use server'` | ✅ | Phase 07 |
| FormData / form actions / progressive enhancement | ✅ | Phase 07 |
| `useActionState`, `useFormStatus`, `useOptimistic` | ✅ | Phase 07 |
| validation / authorization / CSRF | ✅ | Phases 07 / 13 |
| expected errors vs exceptions | ✅ | Phase 14 |
| transactions / idempotency / outbox | ✅ | Phase 07; durable delivery operations 17 |
| Server Action direct/integration/E2E tests | ✅ | Phase 16 |
| Server Action encryption model | ✅ | Phase 13 |
| `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` | ✅ | Security context 13; multi-instance deployment/rollout 17 |
| mixed-deployment Server Action failures | ✅ | Phase 17 |

## Route Handlers & HTTP

| Area | Status | Notes |
| --- | --- | --- |
| methods / 405 / OPTIONS | ✅ | Phase 08 |
| Request / Response / NextRequest / NextResponse | ✅ | Phase 08 |
| request bodies / content type / one-read body | ✅ | Phase 08 |
| files / downloads / streams | ✅ | Phase 08 |
| GET caching / Cache Components | ✅ | Phase 08 |
| CORS / CSRF / auth | ✅ | Phases 08 / 13 |
| webhooks / callbacks / uploads / rate limits | ✅ | Phases 08 / 13; tests 16; queue/storage operations 17 |
| safe failure envelopes | ✅ | Phase 14 |
| HTTP contract tests | ✅ | Phase 16 |
| reverse-proxy body/time/rate-limit ownership | ✅ | Phase 17 |

## Proxy & Request Pipeline

| Area | Status | Notes |
| --- | --- | --- |
| `proxy.ts` convention / request order | ✅ | Phase 09 |
| `middleware.ts` migration | ⚠️ | Migration-only; deep Phase 20 |
| matchers / `has` / `missing` / prefetch filters | ✅ | Phase 09 |
| `NextResponse.next()` / headers / cookies | ✅ | Phase 09 |
| redirects / rewrites / localization / tenancy | ✅ | Phase 09 |
| optimistic auth gating; not sole authorization | ✅ | Phases 09 / 13 |
| `waitUntil` | ✅ | Phase 09; not a durable queue |
| Proxy test helpers | 🧪 | Experimental; Phase 16 |
| self-hosting Proxy support | ✅ | Phase 17 |
| static-export Proxy support | ⛔ | Not available with `output: 'export'` |

## Rendering, Suspense & Delivery

| Area | Status | Notes |
| --- | --- | --- |
| RSC / HTML / hydration pipeline | ✅ | Phase 10 |
| `loading.tsx` / Suspense | ✅ | Phase 10 |
| progressive streaming | ✅ | Phase 10; performance 15; browser tests 16; infrastructure buffering 17 |
| Cache Components shell / dynamic holes | ✅ | Phase 10 |
| Promise streaming / React `use()` | ✅ | Phase 10 |
| hydration mismatch diagnosis | ✅ | Phases 10 / 14 |
| streamed failure/status limitations | ✅ | Phase 14 |
| end-to-end load-balancer/proxy streaming | ✅ | Phase 17 |
| PPR platform streaming requirement | ✅ | Phase 17 |

## Metadata, Images, Fonts & Scripts

| Area | Status | Notes |
| --- | --- | --- |
| Metadata API / social images / robots / sitemap / JSON-LD | ✅ | Phase 11 |
| `next/image` responsive/source/security/cache model | ✅ | Phase 12 |
| image `preload` | ✅ | Current Next.js 16 API |
| image `priority` | ⚠️ | Deprecated in Next.js 16 |
| default runtime image optimizer | ✅ | Phase 12; self-hosting operations 17 |
| static-export image strategy/custom loader | ✅ | Phases 12 / 17 |
| `next/font` Google/local / variables / fallbacks | ✅ | Phase 12 |
| `next/script` strategies | ✅ | Phase 12 |
| `@next/third-parties` | 🧪 | Experimental at baseline |
| Script `worker` strategy | 🧪 | Experimental/non-baseline for App Router |
| `assetPrefix` deployment context | ✅ | Phase 17 |

## Authentication, Authorization & Security

| Area | Status | Notes |
| --- | --- | --- |
| auth vs session vs authorization | ✅ | Phase 13 |
| provider/library recommendation | ✅ | Phase 13 |
| password / OAuth/OIDC / recovery / MFA | ✅ | Phase 13 |
| stateless/database sessions | ✅ | Phase 13 |
| secure cookie / renewal / rotation / revocation | ✅ | Phase 13 |
| DAL authorization / RBAC / resource/tenant scoping | ✅ | Phase 13 |
| CSRF / XSS / CSP / secrets | ✅ | Phase 13 |
| SSRF / uploads / webhooks / distributed rate limits / API keys | ✅ | Phase 13 |
| threat modeling / audit events | ✅ | Phase 13 |
| security regression matrix | ✅ | Phase 16 |
| production secret injection / build secret isolation / rotation | ✅ | Phase 17 |
| forwarded-header trust / reverse-proxy security | ✅ | Phase 17 |
| production access / CI credential least privilege | ✅ | Phase 17 |
| `unauthorized()`, `forbidden()`, `authInterrupts` | 🧪 | Experimental/non-production baseline |
| React taint APIs | 🧪 | Defense in depth only |

## Errors, Observability & Debugging

| Area / API | Status | Notes |
| --- | --- | --- |
| expected failures / uncaught exceptions / framework control flow | ✅ | Phase 14 |
| `error.tsx`, `global-error.tsx`, `reset()` | ✅ | Phase 14 |
| Server Component error digest/sanitization | ✅ | Phase 14 |
| `notFound()` / redirects / streaming status | ✅ | Phase 14 |
| `after()` | ✅ | Phase 14 lifecycle; graceful shutdown/durability distinction 17 |
| `instrumentation.ts` / `register()` / `onRequestError` | ✅ | Phase 14; startup deployment 17 |
| `instrumentation-client.ts` / browser capture | ✅ | Phase 14 |
| OpenTelemetry / custom spans / collector architecture | ✅ | Phase 14; exporter deployment/failure policy 17 |
| source maps / debug CLI / inspector | ✅ | Phase 14; release-bound source-map operations 17 |
| SLI/SLO/error budgets / alerts / runbooks | ✅ | Phase 14; rollout gates and incident operations 17 |
| unstable error helpers | 🧪 | Stable route boundary model remains baseline |

## Performance

| Area | Status | Notes |
| --- | --- | --- |
| measurement → diagnosis → change → measurement | ✅ | Phase 15 |
| Core Web Vitals LCP/INP/CLS / p75 / RUM | ✅ | Phase 15 |
| `useReportWebVitals` | ✅ | Phases 14–15 |
| Server Component/client-JS reduction | ✅ | Phase 15 |
| lazy loading / `next/dynamic` / demand imports | ✅ | Phase 15 |
| bundle analysis / React Compiler integration | ✅ | Phase 15 |
| hydration/main-thread/INP/DOM/memory | ✅ | Phase 15 |
| image/font/script/network critical path | ✅ | Phase 15 |
| DB pool/upstream/cold-start/tail-latency/capacity | ✅ | Phase 15; production scaling 17 |
| backpressure/load shedding | ✅ | Phase 15 baseline; operational depth 17 |
| CI performance/bundle budgets | ✅ | Phase 16 |
| canary performance comparison | ✅ | Phase 15; rollout operations 17 |
| `experimental.webVitalsAttribution` | 🧪 | Experimental |
| Turbopack `experimental-analyze` | 🧪 | Experimental |
| `inlineCss`, `optimizePackageImports` experimental flags | 🧪 | Experimental at baseline |

## Testing

| Area | Status | Notes |
| --- | --- | --- |
| risk-driven unit/component/integration/E2E portfolio | ✅ | Phase 16 |
| Vitest / Jest / `next/jest` / React Testing Library | ✅ | Phase 16 |
| jsdom vs Node vs real browser boundaries | ✅ | Phase 16 |
| async Server Component E2E recommendation | ✅ | Phase 16 |
| data/DB/cache/revalidation tests | ✅ | Phase 16 |
| Server Action / Route Handler contract tests | ✅ | Phase 16 |
| auth/tenant/security negative tests | ✅ | Phase 16 |
| streaming/navigation/hydration/Router Cache browser tests | ✅ | Phase 16 |
| Playwright / Cypress production-build E2E | ✅ | Phase 16 |
| accessibility / keyboard regression | ✅ | Phase 16 |
| deterministic data/time/randomness / mocks | ✅ | Phase 16 |
| flaky test diagnosis / retry / quarantine / sharding | ✅ | Phase 16 |
| production build as release gate | ✅ | Phase 16; CI/CD operations 17 |
| `next/experimental/testing/server` helpers | 🧪 | Experimental |
| `unstable_doesProxyMatch`, `unstable_getResponseFromNextConfig` | 🧪 | Experimental |
| `@next/playwright` / instant navigation testing | 🧪 | Experimental; not stable architecture baseline |

## Deployment & Production Operations

| Area / API | Status | Notes |
| --- | --- | --- |
| build/start/request lifecycle separation | ✅ | Phase 17 |
| immutable build-once artifact promotion | ✅ | Phase 17 |
| `next build` | ✅ | Production/release boundary Phase 17 |
| `next start` | ✅ | Standard Node self-host runtime Phase 17 |
| output file tracing | ✅ | Phase 17 |
| `output: 'standalone'` | ✅ | Minimal traced deployment tree/container strategy Phase 17 |
| standalone `server.js` | ✅ | Phase 17 |
| `public` / `.next/static` standalone asset handling | ✅ | Phase 17 |
| Docker multi-stage packaging | ✅ | Phase 17 platform-neutral pattern |
| read-only/ephemeral filesystem implications | ✅ | Phase 17 |
| self-hosting behind reverse proxy | ✅ | Phase 17 |
| forwarded-header trust | ✅ | Phase 17 |
| streaming through proxy/load balancer/CDN | ✅ | Phase 17 |
| nginx `X-Accel-Buffering: no` pattern | ✅ | Official self-hosting integration example; Phase 17 |
| graceful `SIGINT` / `SIGTERM` draining | ✅ | Phase 17 |
| pending `after()` completion during graceful shutdown | ✅ | Phase 17 |
| liveness vs readiness | ✅ | Phase 17 operational architecture |
| build-time vs runtime server env | ✅ | Phases 13 / 17 |
| `NEXT_PUBLIC_` build-time browser freezing | ✅ | Phase 13 security; deployment promotion depth 17 |
| runtime public config allow-list pattern | ✅ | Phase 17 |
| startup configuration validation | ✅ | Phase 17 |
| production secret manager/injection/rotation | ✅ | Phase 17 |
| CDN immutable assets / dynamic-private cache safety | ✅ | Phase 17 |
| `cacheHandler` | ✅ | Stable server cache/ISR integration; Phase 17 |
| `cacheHandlers` | ✅ | Cache Components storage; Phase 17 deployment depth |
| multi-instance cache/tag coordination | ✅ | Phase 17 |
| `assetPrefix` production asset hosting context | ✅ | Phase 17 |
| `generateBuildId` | ✅ | Stable build identity; Phase 17 |
| `deploymentId` / `NEXT_DEPLOYMENT_ID` | ✅ | Stable version-skew protection; Phase 17 |
| old asset retention during rolling deployments | ✅ | Phase 17 |
| Server Action key consistency across replicas | ✅ | Phases 13 / 17 |
| rolling / canary / blue-green rollout | ✅ | Phase 17 |
| expand/contract DB migration pattern | ✅ | Phase 17 |
| deterministic rollback artifact | ✅ | Phase 17 |
| autoscaling / DB pool / dependency capacity | ✅ | Phase 17 |
| distributed rate-limit state | ✅ | Security 13; operational scale 17 |
| durable queues / workers / idempotency / DLQ | ✅ | Phase 17 |
| outbox operational delivery | ✅ | Phase 07 model; Phase 17 operations |
| scheduled jobs / leader ownership | ✅ | Phase 17 |
| object storage / signed upload-download operations | ✅ | Security 13; operational depth 17 |
| reproducible CI/CD / immutable artifact registry | ✅ | Phase 17 |
| migrations/backfills / rollout gates | ✅ | Phase 17 |
| post-deploy smoke/synthetic checks | ✅ | Phase 17 |
| release IDs in telemetry / source-map release binding | ✅ | Phases 14 / 17 |
| rollback / forward-fix / kill-switch strategy | ✅ | Phase 17 |
| production access / CI supply-chain controls | ✅ | Phase 17 |
| backup/restore / disaster recovery design | ✅ | Phase 17 architecture baseline |
| `output: 'export'` | ✅ | Static export deployment Phase 17 |
| static export unsupported server features | ✅ | Proxy/ISR/default image optimizer/Draft Mode/Server Actions/intercepting routes and other request-time features explicitly separated |
| custom static image loader strategy | ✅ | Phases 12 / 17 |
| Next.js Adapter API | ✅ | Phase 17 deployment-platform integration surface |
| top-level `adapterPath` / `NEXT_ADAPTER_PATH` | ✅ | Stable from Next.js 16.2; earlier experimental form is migration context |
| adapter routing/PPR/runtime/cache compatibility testing | ✅ | Phase 17 |
| managed-platform vs self-hosted vs static vs adapter decision | ✅ | Phase 17 |

## Architecture & Internals

| Area | Status | Notes |
| --- | --- | --- |
| route/layout/URL ownership | ✅ | Phases 02–03 |
| server/client ownership | ✅ | Phase 04 |
| data/dependency ownership | ✅ | Phase 05 |
| cache/freshness ownership | ✅ | Phase 06; distributed operational ownership 17 |
| mutation ownership | ✅ | Phase 07 |
| HTTP endpoint ownership | ✅ | Phase 08 |
| request-front-door ownership | ✅ | Phase 09 |
| rendering/delivery ownership | ✅ | Phase 10 |
| metadata/public identity | ✅ | Phase 11 |
| browser resource ownership | ✅ | Phase 12 |
| identity/session/authorization ownership | ✅ | Phase 13 |
| failure/telemetry ownership | ✅ | Phase 14 |
| performance budget ownership | ✅ | Phase 15 |
| test/release-confidence ownership | ✅ | Phase 16 |
| deployment/runtime/stateful-infrastructure ownership | ✅ | Phase 17 |
| feature/vertical-slice architecture | 🟠 | Deep Phase 18 |
| monorepos/shared package architecture | 🟠 | Deep Phase 18 |
| large-app tenancy/module boundaries | 🟠 | Security/performance/ops covered; deep Phase 18 |
| RSC/build internals | 🟠 | Deep Phase 19 |

## Upgrades & Migration

| Area | Status | Notes |
| --- | --- | --- |
| App Router upgrade workflow | 🟠 | Phase 01; deep 20 |
| client-heavy SPA → server-first | 🟠 | Foundations through 17; deep 20 |
| previous cache model → Cache Components | 🟠 | Phase 06; deep 20 |
| old standalone PPR/dynamicIO/useCache flags | ⚠️ | Migration-only |
| old GET Route Handler cached-by-default assumptions | ⚠️ | Current behavior taught Phase 08 |
| `middleware.ts` → `proxy.ts` | ⚠️ | Phase 09; deep 20 |
| `metadata.viewport` migration | ⚠️ | Phase 11 |
| Image `priority`, `images.domains`, `onLoadingComplete`, `next/legacy/image` | ⚠️ | Current alternatives taught Phase 12 |
| old `next export` CLI | ⚠️ | Removed; use `output: 'export'` |
| earlier `experimental.adapterPath` form | ⚠️ | Current 16.2 top-level adapter surface taught Phase 17 |
| auth/error/performance/testing experimental APIs | 🧪 | Never silently promoted to migration targets |
| Pages Router / Pages API Routes | ⛔ | Outside scope except contextual migration comparison |

## Phase 17 completion note

Phase 17 is complete for stable production deployment and operations because it teaches:

- build/start/request lifecycle separation, one immutable artifact per build, `next build`, `next start`, output tracing, standalone output, minimal runtime packaging and container discipline
- reverse-proxy/load-balancer ownership, trusted forwarding, body/time/rate limits, end-to-end streaming/PPR buffering, graceful draining, and `after()` lifecycle vs durable-job boundaries
- server/public environment semantics, frozen `NEXT_PUBLIC_` build values, runtime configuration promotion, startup validation, secret injection, rotation, redaction and config revisioning
- browser/CDN/server/Cache Components cache layers, `cacheHandler` vs `cacheHandlers`, multi-replica invalidation, tenant-safe keys, outage policy, stampedes and deployment-aware cache versions
- stable `deploymentId`, `generateBuildId`, Server Action encryption-key consistency, old-asset retention, rollout version skew, canary/rolling/blue-green strategies, compatible DB/cache/event changes and deterministic rollback
- liveness/readiness, autoscaling and connection-pool capacity, object storage, distributed rate limits, durable queues/workers, outbox/idempotency/DLQ, schedules and dependency degradation
- reproducible CI/CD, migration/backfill ownership, post-deploy smoke/synthetic checks, release-bound telemetry/source maps, rollback/forward-fix/kill switches, incident timelines and least-privilege production access
- `output: 'export'` capability limits, static hosting/image/routing strategy, managed vs self-hosted decisions, and the documented Adapter API including the stable Next.js 16.2 top-level `adapterPath` deployment surface

Phase 18 now owns **Architecture & Large Applications**. Internals, migration, projects, interview mastery, question bank and mock interview practice remain later phases.

## Completion rule

The handbook is not complete until this contract is re-audited against the then-current stable Next.js docs and every stable in-scope item has a justified final state.

See [Final Completeness Audit](./final-completeness-audit.md) for the release gate.
