---
title: API Coverage Contract
description: Living coverage map from the current Next.js App Router documentation to this handbook.
---

# Next.js App Router API Coverage Contract

This is the handbook's living completeness contract against the **current stable Next.js App Router documentation**.

**Baseline re-verified: July 29, 2026 — Next.js 16.2.12 (`latest`, 16.x Active LTS).**

Next.js 16.3 remains preview/canary at this snapshot and is not taught as stable.

A topic becomes ✅ only after the handbook teaches the useful mental model, current API behavior, production implications, failure modes, and appropriate security/performance trade-offs.

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
| Next.js 16.2 stable behavior | 🟠 | Core routing, data, caching, mutations, HTTP, Proxy, rendering, metadata/SEO, resources, security, errors, observability, debugging, and performance complete; later phases own testing/ops/architecture/internals/migration/project depth |
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
| 16 · Testing | 🟡 |
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
| Cache Components | ✅ | Phase 06; rendering depth 10; performance depth 15 |
| Caching and Revalidating | ✅ | Phase 06 |
| Mutating Data / Server Functions | ✅ | Phase 07 |
| Route Handlers | ✅ | Phase 08 |
| Proxy | ✅ | Phase 09 |
| Streaming / Suspense rendering | ✅ | Phase 10; performance depth 15 |
| Metadata and OG Images | ✅ | Phase 11 |
| Image Optimization | ✅ | Phase 12; LCP/network depth 15 |
| Font Optimization | ✅ | Phase 12; CLS/resource depth 15 |
| Script / third-party loading | ✅ | Phase 12; performance depth 15; experiments labelled 🧪 |
| Authentication / application security | ✅ | Phase 13 |
| Error Handling | ✅ | Phase 14 |
| Performance / production optimization | ✅ | Phase 15 |
| Deploying | 🟠 | Runtime implications through 15; full Phase 17 |
| Upgrading | 🟠 | Baseline introduced; deep Phase 20 |

## Routing & File Conventions

| API / convention | Status | Notes |
| --- | --- | --- |
| `app/` route tree | ✅ | Phases 01–02 |
| `page`, `layout`, multiple root layouts | ✅ | Phase 02 |
| `template` | ✅ | Phase 02 |
| `loading` | ✅ | Phase 02 semantics; rendering depth 10; performance boundary design 15 |
| `error` | ✅ | Phase 02 baseline; full boundary/recovery model 14 |
| `global-error` | ✅ | Root-layout recovery Phase 14 |
| `not-found` | ✅ | Phase 02; control-flow/status/noindex depth 14 |
| `global-not-found` | 🧪 | Experimental at current baseline |
| `default` | ✅ | Phase 02 |
| `route` | ✅ | Phase 08 |
| `proxy` | ✅ | Phase 09 |
| dynamic/catch-all/optional catch-all | ✅ | Phase 02 |
| async `params` | ✅ | Phases 02 / 08 / 11 / 13 |
| `generateStaticParams`, `dynamicParams` | ✅ | Phases 02 / 06 / 08 |
| Route Groups / Private Folders | ✅ | Phase 02 |
| Parallel / Intercepting Routes | ✅ | Phase 02; delivery depth 10 |
| metadata file conventions | ✅ | Phase 11 |
| `unauthorized.js` / `forbidden.js` | 🧪 | Experimental auth interrupts; Phase 13 |
| `instrumentation.ts` | ✅ | Phase 14 |
| `instrumentation-client.ts` | ✅ | Phase 14 |

## Navigation & URL State

| Area | Status | Notes |
| --- | --- | --- |
| `<Link>` / prefetching | ✅ | Phase 03; bandwidth/latency trade-off Phase 15 |
| `useRouter`, `router.refresh`, `router.prefetch` | ✅ | Phase 03; delivery/performance depth 10/15 |
| `usePathname`, `useSearchParams`, `useParams` | ✅ | Phase 03 |
| selected layout segment hooks | ✅ | Phase 03 |
| `useLinkStatus` | ✅ | Phase 03 |
| `redirect`, `permanentRedirect` | ✅ | Phases 03 / 07–09 / 13–14 |
| native History API / scroll / focus | ✅ | Phase 03 |
| redirect allow-lists / open-redirect protection | ✅ | Phases 03 / 08 / 13 |
| hard vs soft navigation distinction | ✅ | Phase 10 behavior; debugging 14; performance 15 |

## Server & Client Components

| Concept / API | Status | Notes |
| --- | --- | --- |
| Server Components default | ✅ | Phase 04; client-JS performance depth 15 |
| `'use client'` module graph | ✅ | Phase 04; security 13; bundle/runtime cost 15 |
| Server → Client composition | ✅ | Phase 04 |
| serializable props / minimal DTOs | ✅ | Phase 04; security 13; payload performance 15 |
| provider placement | ✅ | Phase 04 |
| third-party/browser-only integration | ✅ | Phase 04; resource/runtime depth 12/15 |
| `server-only` / `client-only` | ✅ | Phase 04; secrets 13 |
| RSC payload / HTML / hydration | ✅ | Phase 10; cost separation Phase 15 |
| Server Components do not hydrate | ✅ | Phases 10 / 15 |
| Client Component visible-before-interactive model | ✅ | Phase 10; interaction performance 15 |
| production Server Component error sanitization | ✅ | Phase 14 |
| React Compiler integration | ✅ | Stable Next config integration covered Phase 15; React internals live in React handbook |
| React Compiler annotation mode / `use memo` / `use no memo` | ✅ | Phase 15 integration context |

## Data Fetching & Secure Data Access

| Area | Status | Notes |
| --- | --- | --- |
| async Server Components / server data ownership | ✅ | Phase 05 |
| server `fetch` | ✅ | Phases 05–06 |
| direct DB/ORM/SDK access | ✅ | Phase 05; security 13; performance 15 |
| avoid own Route Handler hop from Server Component | ✅ | Phases 05 / 08; latency depth 15 |
| parallel/sequential fetching / waterfalls | ✅ | Phase 05; performance depth 15 |
| N+1 / batching / bounded fan-out | ✅ | Phase 05; capacity depth 15 |
| preload / start-early-await-late | ✅ | Phase 05; critical-path depth 15 |
| React `cache` request/render memoization | ✅ | Phases 05–06; server performance 15 |
| external status/schema validation | ✅ | Phase 05 |
| timeout/retry/failure translation | ✅ | Phases 05 / 14; capacity/retry budgets 15 |
| Data Access Layer | ✅ | Phase 13 |
| DTO projection / field-level exposure | ✅ | Phase 13; payload cost 15 |
| tenant/resource-scoped queries | ✅ | Phase 13 |
| DB query/pool/tail-latency performance model | ✅ | Phase 15 |

## Caching, Rendering & Revalidation

| Area / API | Status | Notes |
| --- | --- | --- |
| current server `fetch` cache semantics | ✅ | Phase 06 |
| `cache: 'no-store'`, `cache: 'force-cache'` | ✅ | Phase 06 |
| `next.revalidate`, `next.tags` | ✅ | Phase 06 |
| React `cache` vs persistent Next cache | ✅ | Phases 05–06 |
| Cache Components (`cacheComponents: true`) | ✅ | Phase 06 |
| `'use cache'`, `cacheLife`, `cacheTag` | ✅ | Phase 06 |
| `revalidateTag`, `updateTag`, `revalidatePath`, `refresh` | ✅ | Phases 06–07 |
| `connection()` | ✅ | Phase 06 |
| previous unstable cache APIs | ⚠️ | Migration context Phase 06 |
| `'use cache: private'` | 🧪 | Experimental |
| remote/custom cache handlers | ✅ | Phase 06; ops depth 17 |
| partial prerendering via Cache Components | ✅ | Phases 06 / 10; shell/perceived-performance depth 15 |
| Client Router Cache | ✅ | Phase 06; navigation performance 15 |
| cache isolation / tenant-user keys | ✅ | Phase 06 baseline; security 13 |
| cache hit/miss/stale/revalidation performance model | ✅ | Phase 15 |
| cache stampede / miss-path capacity reasoning | ✅ | Phase 15 architecture baseline |
| nonce CSP dynamic-rendering implication | ✅ | Phases 09 / 13; performance trade-off 15 |

## Mutations, Forms & Server Functions

| Area | Status | Notes |
| --- | --- | --- |
| Server Functions / Server Actions terminology | ✅ | Phase 07 |
| `'use server'` | ✅ | Phase 07 |
| forms / `FormData` / progressive enhancement | ✅ | Phase 07 |
| `useActionState`, `useFormStatus`, `useOptimistic` | ✅ | Phase 07 |
| expected Action errors as returned state | ✅ | Phases 07 / 14 |
| validation / authorization / CSRF defenses | ✅ | Phases 07 / 13 |
| action body-size/upload architecture | ✅ | Phases 07–08 / 13 |
| concurrency / transactions / idempotency / outbox | ✅ | Phase 07 |
| mutation critical-path performance | ✅ | Phase 15 baseline |
| action testing automation | 🟡 | Phase 16 |

## Route Handlers & HTTP

| Area | Status | Notes |
| --- | --- | --- |
| methods / 405 / automatic OPTIONS | ✅ | Phase 08 |
| Request / Response / NextRequest / NextResponse | ✅ | Phase 08 |
| async params / `RouteContext` | ✅ | Phase 08 |
| request body formats / one-read body | ✅ | Phase 08 |
| files / downloads / streams | ✅ | Phase 08 |
| GET caching behavior / Cache Components | ✅ | Phase 08 |
| HTTP cache vs Next cache | ✅ | Phase 08 |
| CORS / CSRF / authorization | ✅ | Phases 08 / 13 |
| webhooks / callbacks / uploads / rate limits | ✅ | Phases 08 / 13 |
| safe HTTP failure envelopes | ✅ | Phase 14 |
| server latency/body/concurrency/capacity performance | ✅ | Phase 15 |

## Proxy & Request Pipeline

| Area | Status | Notes |
| --- | --- | --- |
| `proxy.ts` convention / request order | ✅ | Phase 09 |
| `middleware.ts` migration | ⚠️ | Phase 09; deep Phase 20 |
| matchers / `has` / `missing` / prefetch filters | ✅ | Phase 09 |
| `NextResponse.next()` / request header forwarding | ✅ | Phase 09 |
| redirects / rewrites / RSC-safe rewrites | ✅ | Phase 09 |
| localization / tenancy routing | ✅ | Phase 09; security 13 |
| optimistic auth gating | ✅ | Phases 09 / 13 |
| Proxy not sole authorization boundary | ✅ | Phase 13 |
| Node runtime / `waitUntil` | ✅ | Phase 09 |
| Proxy test helpers | 🧪 | Experimental |
| matcher/front-door latency budget | ✅ | Phase 09 baseline; performance review 15 |

## Rendering, Suspense & Navigation Delivery

| Area | Status | Notes |
| --- | --- | --- |
| RSC payload / HTML / hydration | ✅ | Phase 10; cost measurement 15 |
| hard vs soft navigation | ✅ | Phases 03 / 10 / 15 |
| `loading.tsx` / manual Suspense | ✅ | Phase 10; boundary performance design 15 |
| progressive streaming | ✅ | Phase 10; perceived vs total work distinction 15 |
| Cache Components shells / dynamic holes | ✅ | Phase 10; performance depth 15 |
| Promise streaming / React `use()` | ✅ | Phase 10 |
| hydration mismatch diagnosis | ✅ | Phases 10 / 14 |
| streamed not-found/status behavior | ✅ | Phase 14 |
| RSC payload size / client-prop minimization | ✅ | Phase 15 |
| infrastructure buffering impact on streaming | ✅ | Phase 10 baseline; performance diagnosis 15 |

## Metadata, Images, Fonts, Scripts & Browser Resources

| Area | Status | Notes |
| --- | --- | --- |
| Metadata API / social / robots / sitemap / JSON-LD | ✅ | Phase 11 |
| metadata performance / crawler timing | ✅ | Phase 11 baseline; performance integration 15 |
| `next/image` geometry / responsive candidates / placeholders | ✅ | Phase 12 |
| Image `preload` | ✅ | Current Next.js 16 API; LCP strategy Phase 15 |
| Image `priority` | ⚠️ | Deprecated in Next.js 16 |
| image source/security/cache controls | ✅ | Phase 12; security 13 |
| LCP image discovery/priority/candidate diagnosis | ✅ | Phase 15 |
| `next/font` Google/local / variable/static / fallbacks | ✅ | Phase 12 |
| font preload / metric adjustment / CLS diagnosis | ✅ | Phases 12 / 15 |
| `next/script` strategies | ✅ | Phase 12; critical-path strategy 15 |
| third-party/analytics consent/trust | ✅ | Phases 12–13 |
| third-party performance inventory / facades / long-task reasoning | ✅ | Phase 15 |
| resource hints / origin/connection/request-waterfall reasoning | ✅ | Phases 11–12; performance depth 15 |
| `inlineCss` | 🧪 | Experimental; measured first-load vs cache-reuse trade-off Phase 15 |
| `@next/third-parties` | 🧪 | Experimental at current baseline |
| Script `worker` strategy | 🧪 | Experimental and not App Router production baseline |

## Authentication, Sessions & Security

| Area | Status | Notes |
| --- | --- | --- |
| auth vs session vs authorization | ✅ | Phase 13 |
| provider/library recommendation | ✅ | Phase 13 |
| password / OAuth/OIDC / recovery / MFA | ✅ | Phase 13 |
| stateless/database session lifecycle | ✅ | Phase 13 |
| secure cookie attributes / renewal / rotation / revocation | ✅ | Phase 13 |
| optimistic Proxy checks vs secure DAL checks | ✅ | Phase 13 |
| RBAC + ownership/resource/tenant authorization | ✅ | Phase 13 |
| CSRF / XSS / CSP / secrets | ✅ | Phase 13 |
| SSRF / uploads / webhooks / rate limits / API keys | ✅ | Phase 13 |
| security auditing / threat modeling | ✅ | Phase 13 |
| auth/session lookup performance and request dedupe | ✅ | Phase 15 without weakening authorization |
| `unauthorized()`, `forbidden()`, `authInterrupts` | 🧪 | Experimental, not production baseline |
| React taint APIs | 🧪 | Defense in depth only |

## Errors, Observability & Debugging

| Area / API | Status | Notes |
| --- | --- | --- |
| expected failures vs uncaught exceptions vs control flow | ✅ | Phase 14 |
| `error.tsx` / `global-error.tsx` / stable `reset()` | ✅ | Phase 14 |
| Server Component error sanitization / digest | ✅ | Phase 14 |
| `notFound()` / redirects / streamed status behavior | ✅ | Phase 14 |
| per-surface Server Action / Route Handler / Client / Proxy failure contracts | ✅ | Phase 14 |
| stable `after()` | ✅ | Phase 14; not durable queue |
| `instrumentation.ts` / `register()` | ✅ | Phase 14 |
| `onRequestError` | ✅ | Phase 14 |
| `instrumentation-client.ts` / `onRouterTransitionStart` | ✅ | Phase 14 |
| browser error/unhandled-rejection capture | ✅ | Phase 14 |
| OpenTelemetry / custom spans / trace propagation | ✅ | Phase 14 |
| source maps / `next info` / build debug flags / inspector | ✅ | Phase 14 |
| SLI/SLO/error budgets / alerts / runbooks | ✅ | Phase 14 |
| `unstable_catchError`, `unstable_retry`, `unstable_rethrow` | 🧪 | Experimental/unstable; stable boundary baseline retained |

## Performance

| Area / API | Status | Notes |
| --- | --- | --- |
| measurement → diagnosis → change → measurement loop | ✅ | Phase 15 |
| route/user-journey performance budgets | ✅ | Phase 15 |
| field vs lab data | ✅ | Phase 15 |
| Core Web Vitals LCP / INP / CLS | ✅ | Phase 15 |
| p75 field evaluation | ✅ | Phase 15 |
| supporting TTFB / FCP / legacy FID context | ✅ | Phase 15 |
| `useReportWebVitals` | ✅ | Phase 14 pipeline baseline; full RUM design Phase 15 |
| stable callback / duplicate-report avoidance | ✅ | Phase 15 |
| RUM route/release/device segmentation | ✅ | Phase 15 |
| privacy-safe performance telemetry | ✅ | Phases 14–15 |
| Lighthouse production-like lab testing | ✅ | Phase 15 |
| `experimental.webVitalsAttribution` | 🧪 | Experimental diagnostic option; not production baseline |
| Server Component client-JS reduction | ✅ | Phase 15 |
| `'use client'` bundle-cost review | ✅ | Phase 15 |
| App Router client lazy loading / `next/dynamic` / `React.lazy` | ✅ | Phase 15 |
| interaction-triggered `import()` | ✅ | Phase 15 |
| `ssr: false` constraints/trade-offs | ✅ | Phase 04 baseline; performance depth 15 |
| Server Component dynamic-import/client splitting caveat | ✅ | Phase 15 current-doc nuance |
| Turbopack `next experimental-analyze` | 🧪 | Experimental analyzer; Phase 15 |
| `@next/bundle-analyzer` | ✅ | Webpack analyzer path; Phase 15 |
| `experimental.optimizePackageImports` | 🧪 | Experimental; built-in optimized library context Phase 15 |
| `serverExternalPackages` performance context | ✅ | Advanced server bundle/cold-start trade-off Phase 15 |
| Next.js `reactCompiler` integration | ✅ | Phase 15 |
| manual memoization vs compiler/evidence | ✅ | Phase 15 |
| hydration / visible-before-interactive cost | ✅ | Phases 10 / 15 |
| INP input-handler-render-paint decomposition | ✅ | Phase 15 |
| React `useTransition` / `useDeferredValue` responsiveness integration | ✅ | Phase 15; React API depth in React handbook |
| list/DOM virtualization and bounded DOM reasoning | ✅ | Phase 15 |
| browser layout/paint/animation/event-frequency reasoning | ✅ | Phase 15 |
| memory profiling / long-lived soft-navigation sessions | ✅ | Phase 15 |
| image/font/CSS/script network critical path | ✅ | Phase 15 |
| third-party performance governance | ✅ | Phase 15 |
| compression/cache/origin/redirect waterfall diagnosis | ✅ | Phase 15 |
| database query/pool/connection performance | ✅ | Phase 15 |
| upstream timeout/retry/capacity reasoning | ✅ | Phase 15 |
| cold/warm runtime startup model | ✅ | Phase 15 baseline; deployment mechanics Phase 17 |
| p50/p95/p99 tail-latency reasoning | ✅ | Phase 15 |
| concurrency/backpressure/load-shedding concepts | ✅ | Phase 15 baseline; production ops Phase 17 |
| Chrome/browser performance traces | ✅ | Phase 15 workflow |
| React Profiler role | ✅ | Phase 15 integration; React profiler depth in React handbook |
| bundle before/after regression workflow | ✅ | Phase 15 |
| memory/CPU profiling workflow | ✅ | Phase 15 |
| CI performance/bundle budget concepts | ✅ | Phase 15; automated test implementation Phase 16 |
| performance SLOs / release canary comparison | ✅ | Phase 15 architecture review |
| security/reliability/capacity performance trade-offs | ✅ | Phase 15 |

## Testing & Production

| Area | Status | Notes |
| --- | --- | --- |
| production Docusaurus build validation | ✅ | Handbook workflow through Phase 14; Phase 15 gated by current PR CI |
| component/data/cache/action/API/Proxy scenarios | 🟠 | Failure cases defined; automation Phase 16 |
| hard/soft navigation and streaming/hydration tests | 🟠 | Behavior defined; automation Phase 16 |
| metadata/resource smoke matrices | ✅ | Phases 11–12 specification; automation Phase 16 |
| auth/security regression matrices | ✅ | Phase 13 specification; automation Phase 16 |
| error/instrumentation test matrices | ✅ | Phase 14 specification; automation Phase 16 |
| Web Vitals/RUM validation matrix | ✅ | Phase 15 specification; automated enforcement Phase 16 |
| bundle-size/performance-budget CI design | ✅ | Phase 15 design; automation Phase 16 |
| synthetic performance regression workflow | ✅ | Phase 15 design; automation Phase 16 |
| Node/self-hosting/serverless/adapters | 🟠 | Runtime/capacity implications introduced; full Phase 17 |

## Deployment & Operations

| Area | Status | Notes |
| --- | --- | --- |
| `next build` / `next start` | 🟠 | Baseline Phase 01; production debug/performance use 14–15; full ops 17 |
| reverse proxy / Docker / self-hosting | 🟠 | Runtime/security/performance implications through 15; full 17 |
| environment configuration / runtime env | 🟠 | Security semantics Phase 13; ops depth 17 |
| multi-instance caches / action keys | 🟠 | Phases 06 / 13; ops depth 17 |
| DB connection/serverless constraints | ✅ | Baseline 08; performance capacity depth 15; ops depth 17 |
| queues/outbox/durable side effects | 🟠 | Phase 07; durability distinction 14; ops 17 |
| object storage / signed uploads-downloads | 🟠 | Phases 08 / 12–13; ops 17 |
| WAF/CDN/rate-limit ownership | 🟠 | Security 13; performance context 15; deployment depth 17 |
| telemetry Collector/exporter deployment | 🟠 | Architecture 14; full deployment ownership 17 |
| CDN/compression/stream-buffering verification | 🟠 | Performance diagnosis Phase 15; implementation/operations Phase 17 |
| rollback / health / graceful shutdown / CI-CD | 🟡 | Phase 17 |

## Architecture & Internals

| Area | Status | Notes |
| --- | --- | --- |
| route/layout/URL ownership | ✅ | Phases 02–03 |
| server/client module ownership | ✅ | Phase 04; performance boundary 15 |
| server data/dependency ownership | ✅ | Phase 05; performance critical path 15 |
| cache freshness/invalidation ownership | ✅ | Phase 06 |
| mutation/action ownership | ✅ | Phase 07 |
| HTTP endpoint ownership | ✅ | Phase 08 |
| request-front-door ownership | ✅ | Phase 09 |
| rendering/delivery ownership | ✅ | Phase 10 |
| metadata/public URL identity | ✅ | Phase 11 |
| browser resource ownership | ✅ | Phase 12; performance depth 15 |
| identity/session/authorization ownership | ✅ | Phase 13 |
| failure/recovery/telemetry ownership | ✅ | Phase 14 |
| performance budget/cost ownership | ✅ | Phase 15 |
| shared DAL/domain-command pattern | ✅ | Phases 07–08 / 13 |
| feature/vertical-slice architecture | 🟠 | Examples through 15; deep Phase 18 |
| monorepos/shared packages | 🟠 | Package/runtime boundaries introduced; deep 18 |
| multi-tenancy | ✅ | Security isolation 13; performance query/cache context 15; large-app architecture 18 |
| RSC/build internals | 🟠 | Mental models through 15; deep 19 |

## Upgrades & Migration

| Area | Status | Notes |
| --- | --- | --- |
| App Router upgrade workflow | 🟠 | Phase 01 / deep 20 |
| client-heavy SPA → server-first migration | 🟠 | Phases 04–15; deep 20 |
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
| experimental performance knobs/analyzers | 🧪 | Do not make migration correctness depend on analyzer/attribution/inline CSS/optimizePackageImports experiments |
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

Phase 15 is complete for production performance engineering because it teaches:

- a whole-system critical-path model spanning network/CDN/server/data/RSC/HTML/resources/hydration/interaction, with route-level budgets and measurement-first optimization
- current Core Web Vitals LCP/INP/CLS, p75 field interpretation, TTFB/FCP supporting signals, RUM segmentation, privacy-safe telemetry, Lighthouse/lab workflows, and `useReportWebVitals`
- server/RSC performance: dependency graphs, waterfalls, bounded parallelism, direct data access, request memoization vs persistent caching, hit/miss analysis, Cache Components shells, Suspense streaming, payload minimization, dynamic-request placement, and auth/DB/upstream latency
- client JavaScript performance: narrow `'use client'` boundaries, server-side transformations, route-specific bundle analysis, App Router lazy loading, interaction-triggered imports, `ssr: false` trade-offs, stable React Compiler integration, and evidence-driven memoization
- hydration/INP runtime performance: long tasks, render blast radius, state placement, transitions/deferred values, bounded DOM/list virtualization, layout/animation/event work, long-lived soft-navigation memory, and browser/React profiling
- resource/network performance: LCP image discovery/candidates, font/CLS behavior, CSS/script critical paths, third-party governance/facades, hints, compression, caching, origins, redirects, and cold-vs-warm waterfalls
- backend/capacity performance: database query/pool latency, upstream deadlines, retry budgets, CPU/memory, cold starts, body buffering, backpressure, cache stampedes, tail latency, and region/path reasoning
- production diagnosis: Performance/Network panels, React Profiler, bundle analysis, traces, CPU/memory profiles, release bisect, stable experiment methodology, CI budget design, and incident runbooks
- senior architecture review: user-journey SLOs, critical-path classification, server-vs-browser and render-vs-stream-vs-defer decisions, cache correctness, reliability/capacity trade-offs, canary comparisons, ownership, and regression governance

Experimental performance facilities including Turbopack `experimental-analyze`, `webVitalsAttribution`, `inlineCss`, and `optimizePackageImports` remain labelled 🧪 rather than being taught as required production primitives.

Phase 16 now owns automated Testing depth. Deployment operations, large-application architecture, internals, migration, projects, and interview systems remain later phases.

## Completion rule

The handbook is not complete until this contract is re-audited against the then-current stable Next.js docs and every stable in-scope item has a justified final state.

See [Final Completeness Audit](./final-completeness-audit.md) for the release gate.
