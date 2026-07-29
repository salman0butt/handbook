---
title: API Coverage Contract
description: Living coverage map from the current Next.js App Router documentation to this handbook.
---

# Next.js App Router API Coverage Contract

This is the handbook's living completeness contract against the **current stable Next.js App Router documentation**.

**Baseline re-verified: July 29, 2026 — Next.js 16.2.12 (`latest`, 16.x Active LTS).**

Next.js 16.3 remains preview/canary at this snapshot and is not taught as stable.

A topic becomes ✅ only after the handbook teaches the useful mental model, current API behavior, production implications, failure modes, and appropriate security/performance/testing trade-offs.

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
| Next.js 16.2 stable behavior | 🟠 | Core routing, data, caching, mutations, HTTP, Proxy, rendering, metadata/SEO, resources, security, errors, observability, debugging, performance, and testing complete; later phases own deployment/architecture/internals/migration/project depth |
| Next.js 16.3 preview/canary | 🧪 | Track but do not teach as stable until promoted to npm `latest` |
| React 19.2 stable APIs | 🟠 | React handbook owns React depth; Next.js explains framework integration |
| React Canary exposed by App Router | 🟠 | Covered only where stable Next.js docs establish a supported framework contract |
| Vercel/platform-specific behavior | 🟠 | Platform-specific examples are labelled; deployment/platform depth is Phase 17 |

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
| 17 · Deployment & Production Operations | 🟡 |
| 18 · Architecture & Large Applications | 🟡 |
| 19 · Internals & Senior Mental Models | 🟡 |
| 20 · Upgrades & Modern Migration | 🟡 |
| 21–24 · Projects & Interview System | 🟡 |

## Getting Started

| Official area | Status | Handbook location |
| --- | --- | --- |
| Installation / Project Structure | ✅ | Phase 01 |
| Layouts and Pages | ✅ | Phase 02 |
| Linking and Navigating | ✅ | Phase 03 |
| Server and Client Components | ✅ | Phase 04 |
| Fetching Data | ✅ | Phase 05 |
| Cache Components | ✅ | Phase 06; rendering depth 10; performance/testing depth 15–16 |
| Caching and Revalidating | ✅ | Phase 06; test automation 16 |
| Mutating Data / Server Functions | ✅ | Phase 07; direct boundary testing 16 |
| Route Handlers | ✅ | Phase 08; HTTP contract testing 16 |
| Proxy | ✅ | Phase 09; matcher/integration testing 16 |
| Streaming / Suspense rendering | ✅ | Phase 10; performance 15; browser testing 16 |
| Metadata and OG Images | ✅ | Phase 11 |
| Image Optimization | ✅ | Phase 12; LCP/network depth 15 |
| Font Optimization | ✅ | Phase 12; CLS/resource depth 15 |
| Script / third-party loading | ✅ | Phase 12; performance depth 15; experiments labelled 🧪 |
| Authentication / application security | ✅ | Phase 13; regression testing 16 |
| Error Handling | ✅ | Phase 14; boundary/recovery tests 16 |
| Performance / production optimization | ✅ | Phase 15; regression budgets 16 |
| Testing | ✅ | Phase 16 |
| Deploying | 🟠 | Runtime implications through 16; full Phase 17 |
| Upgrading | 🟠 | Baseline introduced; deep Phase 20 |

## Routing & File Conventions

| API / convention | Status | Notes |
| --- | --- | --- |
| `app/` route tree | ✅ | Phases 01–02 |
| `page`, `layout`, multiple root layouts | ✅ | Phase 02 |
| `template` | ✅ | Phase 02 |
| `loading` | ✅ | Phase 02 semantics; rendering 10; performance 15; browser tests 16 |
| `error` | ✅ | Phase 02 baseline; full boundary/recovery model 14; testing 16 |
| `global-error` | ✅ | Root-layout recovery Phase 14; test matrix Phase 16 |
| `not-found` | ✅ | Phase 02; control-flow/status/noindex depth 14; browser tests 16 |
| `global-not-found` | 🧪 | Experimental at current baseline |
| `default` | ✅ | Phase 02 |
| `route` | ✅ | Phase 08; HTTP contract tests 16 |
| `proxy` | ✅ | Phase 09; matcher/integration tests 16 |
| dynamic/catch-all/optional catch-all | ✅ | Phase 02 |
| async `params` | ✅ | Phases 02 / 08 / 11 / 13; request-bound tests 16 |
| `generateStaticParams`, `dynamicParams` | ✅ | Phases 02 / 06 / 08 |
| Route Groups / Private Folders | ✅ | Phase 02 |
| Parallel / Intercepting Routes | ✅ | Phase 02; delivery 10; entry-mode E2E 16 |
| metadata file conventions | ✅ | Phase 11 |
| `unauthorized.js` / `forbidden.js` | 🧪 | Experimental auth interrupts; Phase 13 |
| `instrumentation.ts` | ✅ | Phase 14; smoke/telemetry testing 16 |
| `instrumentation-client.ts` | ✅ | Phase 14; browser smoke testing 16 |

## Navigation & URL State

| Area | Status | Notes |
| --- | --- | --- |
| `<Link>` / prefetching | ✅ | Phase 03; bandwidth trade-off 15; prefetch-aware tests 16 |
| `useRouter`, `router.refresh`, `router.prefetch` | ✅ | Phase 03; delivery 10/15; browser tests 16 |
| `usePathname`, `useSearchParams`, `useParams` | ✅ | Phase 03; URL/history tests 16 |
| selected layout segment hooks | ✅ | Phase 03 |
| `useLinkStatus` | ✅ | Phase 03 |
| `redirect`, `permanentRedirect` | ✅ | Phases 03 / 07–09 / 13–14; public-outcome tests 16 |
| native History API / scroll / focus | ✅ | Phase 03; real-browser tests 16 |
| redirect allow-lists / open-redirect protection | ✅ | Phases 03 / 08 / 13; regression tests 16 |
| hard vs soft navigation distinction | ✅ | Phase 10 behavior; debugging 14; performance 15; E2E 16 |

## Server & Client Components

| Concept / API | Status | Notes |
| --- | --- | --- |
| Server Components default | ✅ | Phase 04; client-JS performance 15 |
| `'use client'` module graph | ✅ | Phase 04; security 13; bundle/runtime cost 15 |
| Server → Client composition | ✅ | Phase 04 |
| serializable props / minimal DTOs | ✅ | Phase 04; security 13; payload performance 15 |
| provider placement | ✅ | Phase 04 |
| third-party/browser-only integration | ✅ | Phase 04; resources 12/15; browser tests 16 |
| `server-only` / `client-only` | ✅ | Phase 04; secrets 13 |
| RSC payload / HTML / hydration | ✅ | Phase 10; cost 15; E2E confidence 16 |
| Server Components do not hydrate | ✅ | Phases 10 / 15 |
| Client Component visible-before-interactive model | ✅ | Phase 10; interaction performance 15; hydration tests 16 |
| production Server Component error sanitization | ✅ | Phase 14 |
| async Server Component unit-test limitation | ✅ | Phase 16: current Next docs recommend E2E because Jest/Vitest do not fully support async Server Components |
| synchronous Server/Client component tests | ✅ | Phase 16 with Vitest/Jest/RTL where the runtime boundary is appropriate |
| React Compiler integration | ✅ | Stable Next config integration Phase 15; React internals in React handbook |
| React Compiler annotation mode / `use memo` / `use no memo` | ✅ | Phase 15 integration context |

## Data Fetching & Secure Data Access

| Area | Status | Notes |
| --- | --- | --- |
| async Server Components / server data ownership | ✅ | Phase 05; E2E strategy Phase 16 |
| server `fetch` | ✅ | Phases 05–06; adapter/request contract tests 16 |
| direct DB/ORM/SDK access | ✅ | Phase 05; security 13; performance 15; DB integration tests 16 |
| avoid own Route Handler hop from Server Component | ✅ | Phases 05 / 08; latency 15 |
| parallel/sequential fetching / waterfalls | ✅ | Phase 05; performance 15 |
| N+1 / batching / bounded fan-out | ✅ | Phase 05; capacity 15; query-count regression 16 |
| preload / start-early-await-late | ✅ | Phase 05; critical-path depth 15 |
| React `cache` request/render memoization | ✅ | Phases 05–06; server performance 15 |
| external status/schema validation | ✅ | Phase 05; adapter tests 16 |
| timeout/retry/failure translation | ✅ | Phases 05 / 14; capacity 15; deterministic failure tests 16 |
| Data Access Layer | ✅ | Phase 13; integration/security tests 16 |
| DTO projection / field-level exposure | ✅ | Phase 13; payload cost 15 |
| tenant/resource-scoped queries | ✅ | Phase 13; cross-tenant regression tests 16 |
| DB query/pool/tail-latency performance model | ✅ | Phase 15; controlled regression/load tests 16 |

## Caching, Rendering & Revalidation

| Area / API | Status | Notes |
| --- | --- | --- |
| current server `fetch` cache semantics | ✅ | Phase 06 |
| `cache: 'no-store'`, `cache: 'force-cache'` | ✅ | Phase 06 |
| `next.revalidate`, `next.tags` | ✅ | Phase 06 |
| React `cache` vs persistent Next cache | ✅ | Phases 05–06; test layers distinguished 16 |
| Cache Components (`cacheComponents: true`) | ✅ | Phase 06 |
| `'use cache'`, `cacheLife`, `cacheTag` | ✅ | Phase 06 |
| `revalidateTag`, `updateTag`, `revalidatePath`, `refresh` | ✅ | Phases 06–07; freshness tests 16 |
| `connection()` | ✅ | Phase 06 |
| previous unstable cache APIs | ⚠️ | Migration context Phase 06 |
| `'use cache: private'` | 🧪 | Experimental |
| remote/custom cache handlers | ✅ | Phase 06; ops depth 17 |
| partial prerendering via Cache Components | ✅ | Phases 06 / 10; performance 15; browser shell tests 16 |
| Client Router Cache | ✅ | Phase 06; navigation 15; freshness/back-forward tests 16 |
| cache isolation / tenant-user keys | ✅ | Phase 06 baseline; security 13; negative tests 16 |
| cache hit/miss/stale/revalidation performance model | ✅ | Phase 15; deterministic integration tests 16 |
| cache stampede / miss-path capacity reasoning | ✅ | Phase 15; concurrency regression concepts 16 |
| nonce CSP dynamic-rendering implication | ✅ | Phases 09 / 13; performance 15 |

## Mutations, Forms & Server Functions

| Area | Status | Notes |
| --- | --- | --- |
| Server Functions / Server Actions terminology | ✅ | Phase 07 |
| `'use server'` | ✅ | Phase 07 |
| forms / `FormData` / progressive enhancement | ✅ | Phase 07; form/action tests 16 |
| `useActionState`, `useFormStatus`, `useOptimistic` | ✅ | Phase 07; component/E2E behaviour tests 16 |
| expected Action errors as returned state | ✅ | Phases 07 / 14; direct tests 16 |
| validation / authorization / CSRF defenses | ✅ | Phases 07 / 13; negative regression tests 16 |
| action body-size/upload architecture | ✅ | Phases 07–08 / 13; boundary tests 16 |
| concurrency / transactions / idempotency / outbox | ✅ | Phase 07; retry/double-submit tests 16 |
| mutation critical-path performance | ✅ | Phase 15 baseline |
| action testing automation | ✅ | Phase 16: pure policy, direct boundary, integration, and E2E layers |

## Route Handlers & HTTP

| Area | Status | Notes |
| --- | --- | --- |
| methods / 405 / automatic OPTIONS | ✅ | Phase 08; HTTP contract tests 16 |
| Request / Response / NextRequest / NextResponse | ✅ | Phase 08; request-level tests 16 |
| async params / `RouteContext` | ✅ | Phase 08 |
| request body formats / one-read body | ✅ | Phase 08; malformed/content-type tests 16 |
| files / downloads / streams | ✅ | Phase 08; browser/HTTP tests 16 |
| GET caching behavior / Cache Components | ✅ | Phase 08; cache tests 16 |
| HTTP cache vs Next cache | ✅ | Phase 08 |
| CORS / CSRF / authorization | ✅ | Phases 08 / 13; negative tests 16 |
| webhooks / callbacks / uploads / rate limits | ✅ | Phases 08 / 13; signature/replay/abuse tests 16 |
| safe HTTP failure envelopes | ✅ | Phase 14; contract tests 16 |
| server latency/body/concurrency/capacity performance | ✅ | Phase 15; controlled regression testing 16 |

## Proxy & Request Pipeline

| Area | Status | Notes |
| --- | --- | --- |
| `proxy.ts` convention / request order | ✅ | Phase 09 |
| `middleware.ts` migration | ⚠️ | Phase 09; deep Phase 20 |
| matchers / `has` / `missing` / prefetch filters | ✅ | Phase 09; table-driven matcher tests 16 |
| `NextResponse.next()` / request header forwarding | ✅ | Phase 09; response tests 16 |
| redirects / rewrites / RSC-safe rewrites | ✅ | Phase 09; integrated tests 16 |
| localization / tenancy routing | ✅ | Phase 09; security 13 |
| optimistic auth gating | ✅ | Phases 09 / 13; E2E plus authoritative server tests 16 |
| Proxy not sole authorization boundary | ✅ | Phase 13; direct Action/Handler/DAL negative tests 16 |
| Node runtime / `waitUntil` | ✅ | Phase 09 |
| `unstable_doesProxyMatch` / Proxy test helpers | 🧪 | Experimental `next/experimental/testing/server`; targeted use Phase 16 |
| `unstable_getResponseFromNextConfig` | 🧪 | Experimental focused config test; does not model full Proxy/filesystem pipeline |
| matcher/front-door latency budget | ✅ | Phase 09 baseline; performance review 15 |

## Rendering, Suspense & Navigation Delivery

| Area | Status | Notes |
| --- | --- | --- |
| RSC payload / HTML / hydration | ✅ | Phase 10; cost 15; E2E 16 |
| hard vs soft navigation | ✅ | Phases 03 / 10 / 15; dual-path browser tests 16 |
| `loading.tsx` / manual Suspense | ✅ | Phase 10; boundary performance 15; deterministic streaming tests 16 |
| progressive streaming | ✅ | Phase 10; perceived vs total work 15; E2E 16 |
| Cache Components shells / dynamic holes | ✅ | Phase 10; performance 15; shell tests 16 |
| Promise streaming / React `use()` | ✅ | Phase 10 |
| hydration mismatch diagnosis | ✅ | Phases 10 / 14; browser console tests 16 |
| streamed not-found/status behavior | ✅ | Phase 14; network/browser tests 16 |
| RSC payload size / client-prop minimization | ✅ | Phase 15; budget concepts 16 |
| infrastructure buffering impact on streaming | ✅ | Phase 10 baseline; performance 15 |
| intercepting/parallel route entry modes | ✅ | Phase 02 behavior; E2E direct-vs-soft-navigation tests Phase 16 |
| `@next/playwright` instant navigation helper | 🧪 | Experimental, requires Cache Components; targeted Phase 16 only |
| `experimental.exposeTestingApiInProductionBuild` | 🧪 | Test/preview environments only; explicitly not live-production baseline |

## Metadata, Images, Fonts, Scripts & Browser Resources

| Area | Status | Notes |
| --- | --- | --- |
| Metadata API / social / robots / sitemap / JSON-LD | ✅ | Phase 11 |
| metadata performance / crawler timing | ✅ | Phase 11 baseline; performance 15 |
| `next/image` geometry / responsive candidates / placeholders | ✅ | Phase 12 |
| Image `preload` | ✅ | Current Next.js 16 API; LCP strategy Phase 15 |
| Image `priority` | ⚠️ | Deprecated in Next.js 16 |
| image source/security/cache controls | ✅ | Phase 12; security 13 |
| LCP image discovery/priority/candidate diagnosis | ✅ | Phase 15; performance regression strategy 16 |
| `next/font` Google/local / variable/static / fallbacks | ✅ | Phase 12 |
| font preload / metric adjustment / CLS diagnosis | ✅ | Phases 12 / 15 |
| `next/script` strategies | ✅ | Phase 12; critical-path strategy 15 |
| third-party/analytics consent/trust | ✅ | Phases 12–13; provider/browser failure tests 16 |
| third-party performance inventory / facades / long-task reasoning | ✅ | Phase 15 |
| resource hints / origin/connection/request-waterfall reasoning | ✅ | Phases 11–12; performance 15 |
| `inlineCss` | 🧪 | Experimental; measured trade-off Phase 15 |
| `@next/third-parties` | 🧪 | Experimental at current baseline |
| Script `worker` strategy | 🧪 | Experimental and not App Router production baseline |

## Authentication, Sessions & Security

| Area | Status | Notes |
| --- | --- | --- |
| auth vs session vs authorization | ✅ | Phase 13 |
| provider/library recommendation | ✅ | Phase 13 |
| password / OAuth/OIDC / recovery / MFA | ✅ | Phase 13; lifecycle tests 16 |
| stateless/database session lifecycle | ✅ | Phase 13; expiry/revocation tests 16 |
| secure cookie attributes / renewal / rotation / revocation | ✅ | Phase 13; E2E/session tests 16 |
| optimistic Proxy checks vs secure DAL checks | ✅ | Phase 13; negative tests 16 |
| RBAC + ownership/resource/tenant authorization | ✅ | Phase 13; matrix/integration/E2E tests 16 |
| CSRF / XSS / CSP / secrets | ✅ | Phase 13; regression testing 16 |
| SSRF / uploads / webhooks / rate limits / API keys | ✅ | Phase 13; negative tests 16 |
| security auditing / threat modeling | ✅ | Phase 13; regression suite design 16 |
| auth/session lookup performance and request dedupe | ✅ | Phase 15 without weakening authorization |
| `unauthorized()`, `forbidden()`, `authInterrupts` | 🧪 | Experimental, not production baseline |
| React taint APIs | 🧪 | Defense in depth only |

## Errors, Observability & Debugging

| Area / API | Status | Notes |
| --- | --- | --- |
| expected failures vs uncaught exceptions vs control flow | ✅ | Phase 14; failure tests 16 |
| `error.tsx` / `global-error.tsx` / stable `reset()` | ✅ | Phase 14; boundary/reset tests 16 |
| Server Component error sanitization / digest | ✅ | Phase 14 |
| `notFound()` / redirects / streamed status behavior | ✅ | Phase 14; browser/HTTP tests 16 |
| per-surface Server Action / Route Handler / Client / Proxy failure contracts | ✅ | Phase 14; automated test layers 16 |
| stable `after()` | ✅ | Phase 14; not durable queue |
| `instrumentation.ts` / `register()` | ✅ | Phase 14; smoke testing 16 |
| `onRequestError` | ✅ | Phase 14; observability evidence tests 16 |
| `instrumentation-client.ts` / `onRouterTransitionStart` | ✅ | Phase 14; browser smoke tests 16 |
| browser error/unhandled-rejection capture | ✅ | Phase 14; console/error checks 16 |
| OpenTelemetry / custom spans / trace propagation | ✅ | Phase 14 |
| source maps / `next info` / build debug flags / inspector | ✅ | Phase 14 |
| SLI/SLO/error budgets / alerts / runbooks | ✅ | Phase 14 |
| `unstable_catchError`, `unstable_retry`, `unstable_rethrow` | 🧪 | Experimental/unstable; stable boundary baseline retained |

## Performance

| Area / API | Status | Notes |
| --- | --- | --- |
| measurement → diagnosis → change → measurement loop | ✅ | Phase 15 |
| route/user-journey performance budgets | ✅ | Phase 15; regression gates 16 |
| field vs lab data | ✅ | Phase 15 |
| Core Web Vitals LCP / INP / CLS | ✅ | Phase 15; controlled regression tests 16 |
| p75 field evaluation | ✅ | Phase 15 |
| supporting TTFB / FCP / legacy FID context | ✅ | Phase 15 |
| `useReportWebVitals` | ✅ | Phase 14 pipeline; RUM design 15; validation strategy 16 |
| stable callback / duplicate-report avoidance | ✅ | Phase 15 |
| RUM route/release/device segmentation | ✅ | Phase 15 |
| privacy-safe performance telemetry | ✅ | Phases 14–15 |
| Lighthouse production-like lab testing | ✅ | Phase 15; CI noise cautions 16 |
| `experimental.webVitalsAttribution` | 🧪 | Experimental diagnostic option |
| Server Component client-JS reduction | ✅ | Phase 15 |
| `'use client'` bundle-cost review | ✅ | Phase 15 |
| App Router client lazy loading / `next/dynamic` / `React.lazy` | ✅ | Phase 15 |
| interaction-triggered `import()` | ✅ | Phase 15 |
| `ssr: false` constraints/trade-offs | ✅ | Phase 04 baseline; performance 15 |
| Server Component dynamic-import/client splitting caveat | ✅ | Phase 15 |
| Turbopack `next experimental-analyze` | 🧪 | Experimental analyzer; Phase 15 |
| `@next/bundle-analyzer` | ✅ | Webpack analyzer path; Phase 15 |
| `experimental.optimizePackageImports` | 🧪 | Experimental; Phase 15 |
| `serverExternalPackages` performance context | ✅ | Advanced server bundle/cold-start trade-off 15 |
| Next.js `reactCompiler` integration | ✅ | Phase 15 |
| manual memoization vs compiler/evidence | ✅ | Phase 15 |
| hydration / visible-before-interactive cost | ✅ | Phases 10 / 15; interaction tests 16 |
| INP input-handler-render-paint decomposition | ✅ | Phase 15 |
| React `useTransition` / `useDeferredValue` responsiveness integration | ✅ | Phase 15; React depth in React handbook |
| list/DOM virtualization and bounded DOM reasoning | ✅ | Phase 15 |
| browser layout/paint/animation/event-frequency reasoning | ✅ | Phase 15 |
| memory profiling / long-lived soft-navigation sessions | ✅ | Phase 15 |
| image/font/CSS/script network critical path | ✅ | Phase 15 |
| third-party performance governance | ✅ | Phase 15 |
| compression/cache/origin/redirect waterfall diagnosis | ✅ | Phase 15 |
| database query/pool/connection performance | ✅ | Phase 15; query-count/load regressions 16 |
| upstream timeout/retry/capacity reasoning | ✅ | Phase 15; deterministic failure tests 16 |
| cold/warm runtime startup model | ✅ | Phase 15 baseline; deployment mechanics Phase 17 |
| p50/p95/p99 tail-latency reasoning | ✅ | Phase 15 |
| concurrency/backpressure/load-shedding concepts | ✅ | Phase 15 baseline; production ops 17 |
| Chrome/browser performance traces | ✅ | Phase 15 workflow |
| React Profiler role | ✅ | Phase 15 integration; React profiler depth in React handbook |
| bundle before/after regression workflow | ✅ | Phase 15; CI budget strategy 16 |
| memory/CPU profiling workflow | ✅ | Phase 15 |
| CI performance/bundle budget concepts | ✅ | Phase 15; automated release-gate strategy 16 |
| performance SLOs / release canary comparison | ✅ | Phase 15 architecture review |
| security/reliability/capacity performance trade-offs | ✅ | Phase 15 |

## Testing & Production

| Area / API | Status | Notes |
| --- | --- | --- |
| unit / component / integration / E2E / snapshot model | ✅ | Current Next testing categories; Phase 16 |
| risk-driven test portfolio / pyramid cost model | ✅ | Phase 16 |
| Vitest + React Testing Library setup | ✅ | Official Next guide; Phase 16 |
| Jest + `next/jest` + React Testing Library setup | ✅ | Official Next guide; Phase 16 |
| async Server Component unit-test limitation | ✅ | Current docs recommend E2E over unit tests; Phase 16 |
| synchronous Server and Client Component testing | ✅ | Phase 16 |
| accessible semantic RTL queries / user-event model | ✅ | Phase 16 |
| controlled clocks/timers/randomness | ✅ | Phase 16 |
| request/network/provider mocking boundaries | ✅ | Phase 16 |
| DB/data adapter integration testing | ✅ | Phase 16 |
| cache hit/miss/key/isolation/revalidation tests | ✅ | Phase 16 |
| Server Action validation/auth/idempotency/freshness tests | ✅ | Phase 16 |
| Route Handler HTTP status/schema/body/CORS/CSRF tests | ✅ | Phase 16 |
| webhook signature/replay/dedupe tests | ✅ | Phase 16 |
| Proxy matcher and rewrite/redirect testing | ✅ | Phase 16 with experimental helpers isolated |
| `unstable_doesProxyMatch` and `next/experimental/testing/server` | 🧪 | Experimental, targeted coverage only |
| `unstable_getResponseFromNextConfig` | 🧪 | Experimental config-only model; not full pipeline |
| auth/session lifecycle regression tests | ✅ | Phase 16 |
| RBAC/resource/tenant isolation regression matrix | ✅ | Phase 16 |
| CSRF/XSS/SSRF/open-redirect/security-header tests | ✅ | Phase 16 |
| upload/webhook/rate-limit/secret-exposure tests | ✅ | Phase 16 |
| hard vs soft navigation browser tests | ✅ | Phase 16 |
| Suspense/loading/streaming deterministic tests | ✅ | Phase 16 |
| hydration/client-interactivity tests | ✅ | Phase 16 |
| Router Cache/back-forward/freshness tests | ✅ | Phase 16 |
| intercepting/parallel route direct-vs-soft entry tests | ✅ | Phase 16 |
| Playwright E2E | ✅ | Official Next guide; production-build strategy Phase 16 |
| Cypress E2E + component testing | ✅ | Official Next guide; Phase 16 |
| production `next build` + `next start` browser testing | ✅ | Recommended by current Playwright/Cypress guides; Phase 16 |
| `@next/playwright` `instant()` | 🧪 | Experimental; Cache Components only; Phase 16 |
| `exposeTestingApiInProductionBuild` | 🧪 | Test/preview-only opt-in; never live-production baseline |
| semantic locators / auto-wait / trace evidence | ✅ | Phase 16 |
| cross-browser strategy | ✅ | Phase 16 |
| accessibility semantic/keyboard/automated browser tests | ✅ | Phase 16 |
| test data builders / DB isolation / parallelism | ✅ | Phase 16 |
| flake taxonomy / retry monitoring / quarantine policy | ✅ | Phase 16 |
| CI layers / sharding / artifact evidence | ✅ | Phase 16 |
| protected CI secrets / fork-PR trust model | ✅ | Phase 16 |
| bundle/query/performance regression gates | ✅ | Phase 16 building on Phase 15 |
| coverage as diagnostic rather than quality objective | ✅ | Phase 16 |
| production Docusaurus build validation | ✅ | Handbook workflow; Phase 16 gated by current PR CI |
| Node/self-hosting/serverless/adapters | 🟠 | Runtime/capacity/test implications introduced; full Phase 17 |

## Deployment & Operations

| Area | Status | Notes |
| --- | --- | --- |
| `next build` / `next start` | 🟠 | Baseline Phase 01; debug/performance/testing use 14–16; full ops 17 |
| reverse proxy / Docker / self-hosting | 🟠 | Runtime/security/performance/test implications through 16; full 17 |
| environment configuration / runtime env | 🟠 | Security semantics 13; test isolation 16; ops depth 17 |
| multi-instance caches / action keys | 🟠 | Phases 06 / 13; testing considerations 16; ops depth 17 |
| DB connection/serverless constraints | ✅ | Baseline 08; performance capacity 15; test/load considerations 16; ops depth 17 |
| queues/outbox/durable side effects | 🟠 | Phase 07; durability 14; testing boundaries 16; ops 17 |
| object storage / signed uploads-downloads | 🟠 | Phases 08 / 12–13; security tests 16; ops 17 |
| WAF/CDN/rate-limit ownership | 🟠 | Security 13; performance 15; test/smoke strategy 16; deployment depth 17 |
| telemetry Collector/exporter deployment | 🟠 | Architecture 14; testing evidence 16; full deployment ownership 17 |
| CDN/compression/stream-buffering verification | 🟠 | Performance 15; testing strategy 16; implementation/operations 17 |
| rollback / health / graceful shutdown / CI-CD | 🟡 | Phase 17 |

## Architecture & Internals

| Area | Status | Notes |
| --- | --- | --- |
| route/layout/URL ownership | ✅ | Phases 02–03 |
| server/client module ownership | ✅ | Phase 04; performance boundary 15 |
| server data/dependency ownership | ✅ | Phase 05; performance 15; test boundary 16 |
| cache freshness/invalidation ownership | ✅ | Phase 06; testing 16 |
| mutation/action ownership | ✅ | Phase 07; testing 16 |
| HTTP endpoint ownership | ✅ | Phase 08; testing 16 |
| request-front-door ownership | ✅ | Phase 09; testing 16 |
| rendering/delivery ownership | ✅ | Phase 10; browser tests 16 |
| metadata/public URL identity | ✅ | Phase 11 |
| browser resource ownership | ✅ | Phase 12; performance 15 |
| identity/session/authorization ownership | ✅ | Phase 13; regression tests 16 |
| failure/recovery/telemetry ownership | ✅ | Phase 14; evidence tests 16 |
| performance budget/cost ownership | ✅ | Phase 15; regression gates 16 |
| test/release-confidence ownership | ✅ | Phase 16 |
| shared DAL/domain-command pattern | ✅ | Phases 07–08 / 13 |
| feature/vertical-slice architecture | 🟠 | Examples through 16; deep Phase 18 |
| monorepos/shared packages | 🟠 | Package/runtime/test boundaries introduced; deep 18 |
| multi-tenancy | ✅ | Security isolation 13; performance context 15; regression strategy 16; architecture 18 |
| RSC/build internals | 🟠 | Mental models through 16; deep 19 |

## Upgrades & Migration

| Area | Status | Notes |
| --- | --- | --- |
| App Router upgrade workflow | 🟠 | Phase 01 / deep 20 |
| client-heavy SPA → server-first migration | 🟠 | Phases 04–16; deep 20 |
| previous cache model → Cache Components | 🟠 | Phase 06; deep 20 |
| old standalone PPR/dynamicIO/useCache flags | ⚠️ | Migration-only |
| old GET Route Handler cached-by-default assumptions | ⚠️ | Phase 08 teaches current behavior |
| `middleware.ts` → `proxy.ts` | ⚠️ | Phase 09; deep 20 |
| `metadata.viewport` migration | ⚠️ | Phase 11 |
| old Image `priority` | ⚠️ | Phase 12 teaches current `preload` model |
| `images.domains` | ⚠️ | Prefer `remotePatterns` |
| `onLoadingComplete` | ⚠️ | Prefer `onLoad` |
| `next/legacy/image` | ⚠️ | Migration-only |
| auth experiments | 🧪 | Do not treat as stable migration target |
| unstable error helpers | 🧪 | Stable `error.tsx`/`reset()` remains baseline |
| experimental performance knobs/analyzers | 🧪 | Do not make migration correctness depend on experimental optimizers |
| experimental testing helpers | 🧪 | Do not make stable release confidence depend on `@next/playwright` or `next/experimental/testing/server` |
| Pages Router / Pages API Routes | ⛔ | Outside handbook scope except contextual comparison |

## Phase 10 completion note

Phase 10 is complete for stable App Router rendering delivery: RSC/HTML/hydration, hard vs soft navigation, Suspense/loading, Cache Components shells/dynamic holes, Promise streaming, Client Component hydration, streamed failures, and rendering design review.

## Phase 11 completion note

Phase 11 is complete for stable metadata and SEO behavior: Metadata API ownership/merging, canonical/alternate identity, social metadata and images, icons/manifests, robots/sitemaps, JSON-LD, viewport, streaming metadata, Cache Components interactions, and SEO architecture.

## Phase 12 completion note

Phase 12 is complete for stable resource optimization: modern `next/image`, image security/cache controls, responsive delivery, static-export strategy, `next/font`, `next/script`, third-party/analytics architecture, resource hints, and production resource debugging.

## Phase 13 completion note

Phase 13 is complete for stable authentication, authorization, and application security: identity/session/authorization separation; authentication flows; secure sessions; DAL/DTO authorization; tenant/resource isolation; Server Action/Route Handler/Proxy security; CSRF/XSS/CSP/secrets; SSRF/uploads/webhooks/rate limits; and threat modeling/incident response.

## Phase 14 completion note

Phase 14 is complete for stable error handling, observability, and production debugging: expected vs unexpected failures, route/global boundaries, framework control flow, surface-specific failure contracts, `after()`, server/client instrumentation, `onRequestError`, OpenTelemetry, source maps/CLI debugging, SLOs/alerts/runbooks, and telemetry privacy/deduplication.

Experimental error helpers remain labelled 🧪 and do not replace the stable production baseline.

## Phase 15 completion note

Phase 15 is complete for production performance engineering: whole-system critical paths and budgets; Core Web Vitals/RUM/lab workflows; server/RSC/data/cache/streaming performance; client JavaScript/lazy loading/bundle analysis/React Compiler; hydration/INP/runtime performance; resources/network/third parties; backend database/upstream/cold-start/capacity performance; profiling/regression workflows; and senior performance architecture.

Experimental performance facilities including Turbopack `experimental-analyze`, `webVitalsAttribution`, `inlineCss`, and `optimizePackageImports` remain labelled 🧪 rather than being taught as required production primitives.

## Phase 16 completion note

Phase 16 is complete for stable Next.js testing architecture because it teaches:

- risk-driven unit/component/integration/E2E/snapshot selection rather than coverage-percentage optimization
- current Vitest and Jest + React Testing Library setup, accessible user-facing assertions, controlled clocks/mocks, and appropriate jsdom vs Node vs real-browser environments
- the current official limitation that common unit runners do not fully support async Server Components, with E2E recommended for their framework composition
- server data/DB/HTTP adapter integration, query-count checks, cache hit/miss/key/isolation/revalidation semantics, and production-build freshness verification
- direct Server Action and Route Handler validation/auth/idempotency/error/HTTP tests, plus CORS/CSRF/webhook/replay/redirect contracts
- authentication/session/RBAC/resource/tenant isolation and broader XSS/SSRF/upload/rate-limit/secret-exposure security regression testing
- real-browser Suspense/streaming/hard-vs-soft navigation/hydration/Router Cache/history/focus/intercepting-route testing
- Playwright and Cypress production-build E2E, semantic locators, cross-browser strategy, accessibility/keyboard coverage, and diagnostics such as traces/screenshots/logs
- deterministic test data, DB parallel isolation, provider fakes/sandboxes, flake diagnosis, retry/quarantine policy, CI layering/sharding/artifacts, fork-PR secret safety, and performance/bundle/query regression gates
- senior release confidence, test ownership, test debt, incident-to-regression workflows, and quality-gate design

Experimental `next/experimental/testing/server` utilities and `@next/playwright`/instant-navigation testing remain labelled 🧪 and are isolated from the stable production testing baseline.

Phase 17 now owns Deployment & Production Operations depth. Large-application architecture, internals, migration, projects, and interview systems remain later phases.

## Completion rule

The handbook is not complete until this contract is re-audited against the then-current stable Next.js docs and every stable in-scope item has a justified final state.

See [Final Completeness Audit](./final-completeness-audit.md) for the release gate.