---
title: API Coverage Contract
description: Living coverage map from the current Next.js App Router documentation to this handbook.
---

# Next.js App Router API Coverage Contract

This is the handbook's living completeness contract against the **current stable Next.js App Router documentation**.

**Baseline verified: July 26, 2026 — Next.js 16.2.11 (16.x Active LTS).**

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
| Pages Router | ⛔ | Intentionally excluded |
| Next.js 16.2 stable behavior | 🟠 | Routing through request pipeline now verified; rendering, assets, security, ops and internals remain |
| Next.js 16.3 preview/canary | 🧪 | Track, but do not teach as stable while npm `latest` is 16.2.11 |
| React 19.2 stable APIs | 🟠 | React handbook owns React depth; Next.js teaches framework integration |
| React Canary exposed by App Router | 🟠 | Only where stable Next.js docs define a supported framework contract |
| Vercel/platform-specific behavior | 🟡 | Must remain clearly separated from Next.js core |

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
| 10 · Rendering, Suspense & Streaming | 🟡 |
| 11 · Metadata & SEO | 🟡 |
| 12 · Images, Fonts & Scripts | 🟡 |
| 13 · Authentication, Authorization & Security | 🟡 |
| 14 · Errors, Observability & Debugging | 🟡 |
| 15 · Performance | 🟡 |
| 16 · Testing | 🟡 |
| 17 · Deployment & Production Operations | 🟡 |
| 18 · Architecture & Large Applications | 🟡 |
| 19 · Internals & Senior Mental Models | 🟡 |
| 20 · Upgrades & Modern Migration | 🟡 |
| 21–24 · Projects & Interview System | 🟡 |

## Getting Started

| Official area | Status | Handbook location |
| --- | --- | --- |
| Installation / project structure | ✅ | Phase 01 |
| Layouts and Pages | ✅ | Phase 02 |
| Linking and Navigating | ✅ | Phase 03 |
| Server and Client Components | ✅ | Phase 04 |
| Fetching Data | ✅ | Phase 05 |
| Cache Components / Caching and Revalidating | ✅ | Phase 06 |
| Mutating Data / Server Functions | ✅ | Phase 07 |
| Route Handlers | ✅ | Phase 08 |
| Proxy | ✅ | Phase 09 |
| Error Handling | 🟠 | Failure models exist; deep Phase 14 |
| CSS / styling integration | 🟡 | Framework behavior only |
| Image / Font Optimization | 🟡 | Phase 12 |
| Metadata and OG Images | 🟡 | Phase 11 |
| Deploying | 🟠 | Runtime implications introduced; full Phase 17 |
| Upgrading | 🟠 | Baseline introduced; full Phase 20 |

## Routing & File Conventions

| API / convention | Status | Location / plan |
| --- | --- | --- |
| `app/`, `page`, `layout`, root/multiple roots | ✅ | Phases 01–02 |
| `template`, `loading`, `error`, `not-found`, `default` | ✅ / 🟠 | Routing semantics complete; observability depth 14 |
| `global-not-found` | 🧪 | Experimental |
| dynamic/catch-all/optional catch-all segments | ✅ | Phase 02 |
| async `params`, `generateStaticParams`, `dynamicParams` | ✅ | Phases 02 / 06 / 08 |
| Route Groups / Private Folders | ✅ | Phase 02 |
| Parallel / Intercepting Routes | ✅ | Phase 02 |
| `route.ts` | ✅ | Phase 08 |
| `RouteContext<'/...'>` | ✅ | Phase 08 |
| `proxy.ts` | ✅ | Phase 09 |
| `middleware.ts` | ⚠️ | Deprecated/renamed to Proxy in Next.js 16 |
| `instrumentation.ts`, `instrumentation-client.ts` | 🟡 | Phase 14 |
| Metadata files | 🟡 | Phase 11 |
| `forbidden` / `unauthorized` | 🧪 | Verify final stable contract in Phase 13 |

## Navigation & URL State

| API / behavior | Status | Location |
| --- | --- | --- |
| `<Link>`, prefetching, `onNavigate`, `transitionTypes` | ✅ | Phase 03 |
| `useRouter` push/replace/back/forward/refresh/prefetch | ✅ | Phases 03 / 07 |
| `usePathname`, `useSearchParams`, `useParams` | ✅ | Phase 03 |
| `useSelectedLayoutSegment(s)`, `useLinkStatus` | ✅ | Phase 03 |
| `redirect`, `permanentRedirect` | ✅ | Phases 03 / 07 / 08 |
| History API / scroll / focus / Back-Forward | ✅ | Phase 03 |
| Client Router Cache / prefetch freshness | ✅ | Phase 06 |

## Server & Client Boundaries

| Concept / API | Status | Location |
| --- | --- | --- |
| Server Components by default | ✅ | Phase 04 |
| `'use client'` module graph | ✅ | Phase 04 |
| Server → Client composition / serialization / DTOs | ✅ | Phase 04 |
| provider/context placement | ✅ | Phase 04 |
| third-party/browser-only integration | ✅ | Phase 04 |
| `server-only`, `client-only`, environment poisoning | ✅ | Phase 04 |
| server-started Promise → Client `use()` | ✅ | Phases 04–05 |
| RSC payload / hydration / navigation internals | 🟠 | Mental models established; deep 10 / 19 |

## Data Fetching

| Area | Status | Location |
| --- | --- | --- |
| async Server Components / server data ownership | ✅ | Phase 05 |
| server `fetch`, direct DB/ORM/SDK | ✅ | Phase 05 |
| avoid own Route Handler hop | ✅ | Phases 05 / 08 |
| response/runtime validation and DTO minimization | ✅ | Phase 05 |
| parallel/sequential fetching, waterfalls, N+1, batching | ✅ | Phase 05 |
| preload, Promise sharing, React `cache` | ✅ | Phase 05 |
| client fetching / SWR architecture | ✅ | Phase 05 |
| Suspense data streaming / React `use()` | ✅ | Phase 05; transport depth 10 |

## Caching, Rendering & Revalidation

| Area / API | Status | Notes |
| --- | --- | --- |
| current server `fetch` default behavior | ✅ | Phase 06 |
| `no-store`, `force-cache`, `next.revalidate`, `next.tags` | ✅ | Phase 06 |
| React `cache` vs persistent Next cache | ✅ | Phases 05–06 |
| `cacheComponents: true` | ✅ | Phase 06 |
| `'use cache'`, keys, request-API restrictions | ✅ | Phase 06 |
| `cacheLife`, `cacheTag` | ✅ | Phase 06 |
| `revalidateTag(tag, profile)`, `updateTag`, `revalidatePath` | ✅ | Phases 06–07 |
| single-argument `revalidateTag` | ⚠️ | Deprecated |
| `refresh` from `next/cache` | ✅ | Phase 07 |
| previous-model `dynamic` / `revalidate` / `fetchCache` | ✅ | Phase 06; Route Handler context 08 |
| `unstable_cache`, `unstable_noStore`, old PPR/dynamicIO flags | ⚠️ | Migration/history only |
| `connection()` | ✅ | Phase 06 |
| `'use cache: private'` | 🧪 | Experimental in current baseline |
| `'use cache: remote'`, cache handlers | ✅ | Phase 06; ops depth 17 |
| Cache Components partial prerendering | ✅ | Phase 06; RSC mechanics 10 |
| distributed invalidation / stampede / tenant isolation | ✅ | Phase 06 |

## Mutations, Forms & Server Functions

| API / area | Status | Location |
| --- | --- | --- |
| Server Functions / Actions terminology, `'use server'` | ✅ | Phase 07 |
| form `action`, `formAction`, `FormData`, `bind`, `requestSubmit` | ✅ | Phase 07 |
| progressive enhancement / `next/form` distinction | ✅ | Phase 07 |
| validation, authentication, resource authorization | ✅ | Phase 07 baseline; security depth 13 |
| Server Action origin/body-size model | ✅ | Phase 07 |
| `useActionState`, `useFormStatus`, `useOptimistic` | ✅ | Phase 07 |
| mutation concurrency / idempotency / transactions / outbox | ✅ | Phase 07 |
| invalidation / refresh / redirect / cookies after mutation | ✅ | Phase 07 |
| Server Function vs Route Handler | ✅ | Phases 07–08 |

## Route Handlers & HTTP

| Area / API | Status | Location |
| --- | --- | --- |
| `route.ts`, HTTP methods, 405, automatic/custom `OPTIONS` | ✅ | Phase 08 |
| Web `Request` / `Response` | ✅ | Phase 08 |
| `NextRequest`, `NextResponse`, `nextUrl`, cookies | ✅ | Phase 08; Proxy depth 09 |
| async params / `RouteContext` | ✅ | Phase 08 |
| JSON/form/text/binary body parsing and one-read streams | ✅ | Phase 08 |
| validation, mass assignment, SSRF prevention | ✅ | Phase 08 baseline; security depth 13 |
| JSON/text/XML/CSV/file/download responses | ✅ | Phase 08 |
| Web `ReadableStream`, cancellation/backpressure | ✅ | Phase 08; broad perf/ops 15–17 |
| GET not cached by default / non-GET request-time | ✅ | Phase 08 current 16.2 |
| previous `force-static` GET / Cache Components GET model | ✅ | Phase 08 |
| HTTP `Cache-Control` vs Next server cache | ✅ | Phase 08 |
| webhooks, signatures, replay/idempotency | ✅ | Phase 08 |
| CORS / preflight | ✅ | Phase 08; shared Proxy policy 09 |
| rate limiting / timeout / public API errors | ✅ | Phase 08 baseline |
| BFF / API versioning / shared domain commands | ✅ | Phase 08 |

## Proxy & Request Pipeline

| Area / API | Status | Location / notes |
| --- | --- | --- |
| `proxy.ts` file convention and single function | ✅ | Phase 09 |
| Next.js 16 migration from `middleware.ts` | ✅ | Phase 09 current semantics; upgrade playbook continues Phase 20 |
| exact execution order | ✅ | Phase 09: config headers → config redirects → Proxy → rewrites/routes |
| `config.matcher` strings/arrays/regex | ✅ | Phase 09 |
| static matcher-analysis requirement | ✅ | Phase 09 |
| matcher `has`, `missing`, `locale` | ✅ | Phase 09 |
| negative matching / asset exclusion | ✅ | Phase 09 |
| prefetch-aware matching | ✅ | Phase 09 |
| intentional `_next/data` security behavior | ✅ | Phase 09 |
| `NextRequest` in Proxy | ✅ | Phase 09 |
| `NextResponse.next()` | ✅ | Phase 09 |
| downstream request-header forwarding | ✅ | Phase 09 |
| response headers vs request headers | ✅ | Phase 09 |
| request/response cookies | ✅ | Phase 09 |
| redirects / rewrites / direct responses | ✅ | Phase 09 |
| RSC-safe rewrite behavior | ✅ | Phase 09 |
| locale routing | ✅ | Phase 09 |
| host/domain tenant routing | ✅ | Phase 09 baseline; deep multi-tenancy 18 |
| optimistic auth gating | ✅ | Phase 09 baseline; full auth architecture 13 |
| authoritative authorization outside Proxy | ✅ | Phases 05 / 07–09 |
| CORS in Proxy | ✅ | Phase 09; endpoint CORS 08 |
| CSP nonce injection and dynamic-render implication | ✅ | Phase 09 baseline; security/assets depth 12–13 |
| trusted forwarding/header model | ✅ | Phase 09 baseline; deployment depth 17 |
| Node.js default Proxy runtime | ✅ | Phase 09 current stable API contract |
| Proxy `runtime` config unsupported | ✅ | Phase 09 |
| `NextFetchEvent.waitUntil()` | ✅ | Phase 09; not a durable queue |
| advanced `skipTrailingSlashRedirect` / `skipProxyUrlNormalize` | ✅ | Phase 09 migration context |
| experimental `proxyClientMaxBodySize` | 🧪 | Phase 09 labeled experimental |
| experimental Proxy testing helpers | 🧪 | Phase 09; automation depth Phase 16 |
| static export unsupported | ✅ | Phase 09 baseline; deployment depth 17 |
| Proxy matcher/performance/incident model | ✅ | Phase 09 baseline; observability/perf depth 14–15 |

## Rendering, Suspense & Navigation Delivery

| Area | Status | Plan |
| --- | --- | --- |
| RSC payload / HTML / hydration pipeline | 🟠 | Mental models 04–09; deep Phase 10 |
| React/RSC streaming / Suspense | 🟠 | Data/cache boundaries exist; deep 10 |
| HTTP response streaming | ✅ | Phase 08, separate from RSC streaming |
| `loading.tsx` delivery behavior | ✅ | Phases 02–06; transport internals 10 |
| Cache Components partial prerendering | ✅ | Phase 06; mechanics 10 |
| Next.js 16.3 Instant Navigations | 🧪 | Preview-only at baseline |

## Security

| Area | Status | Plan |
| --- | --- | --- |
| auth vs authorization distinction | ✅ | Baselines 07–09; full Phase 13 |
| all route/action/HTTP inputs untrusted | ✅ | Phases 02–09 |
| tenant/resource scoped authorization | ✅ | Baseline 05 / 07–09; deep 13 / 18 |
| cache isolation | ✅ | Phase 06 |
| mass assignment / SSRF / webhook replay | ✅ | Phases 07–08 |
| action same-origin protections | ✅ | Phase 07 |
| CORS is not authentication | ✅ | Phases 08–09 |
| Proxy optimistic auth only | ✅ | Phase 09 |
| matcher drift cannot replace authorization | ✅ | Phase 09 |
| CSP nonce model | ✅ | Phase 09 baseline; deep Phase 13 |
| trusted Host/forwarded-header boundary | ✅ | Phase 09 baseline; deep 13 / 17 |
| CSRF | 🟠 | Action/API/Proxy baseline; deep 13 |
| XSS / secrets / comprehensive headers | 🟠 | Partial baselines; deep 13 |
| safe errors / log redaction | ✅ | Phases 07–09 baseline; deep 13–14 |

## Errors, Observability & Performance

| Area | Status | Plan |
| --- | --- | --- |
| route/action/API failure taxonomies | ✅ | Phases 02 / 05–08 |
| Proxy redirect/rewrite/matcher debugging | ✅ | Phase 09 |
| request ID / decision taxonomy | ✅ | Phases 08–09 baseline |
| stale cache / mutation incident models | ✅ | Phases 06–07 |
| webhook / HTTP incident debugging | ✅ | Phase 08 |
| Proxy latency / invocation / dependency metrics | ✅ | Phase 09 baseline |
| `waitUntil` best-effort telemetry model | ✅ | Phase 09 |
| structured logging / OTel / instrumentation | 🟠 | Baselines established; full Phase 14 |
| broad performance budgets / profiling | 🟠 | Baselines 04–09; deep Phase 15 |

## Testing & Production

| Area | Status | Plan |
| --- | --- | --- |
| production build validation | ✅ | Phases 02–09 workflow |
| Server Function / Route Handler test matrices | 🟠 | Behavior specified 07–08; automation 16 |
| Proxy matcher/decision test matrix | ✅ | Phase 09; automated framework depth 16 |
| `unstable_doesProxyMatch` and Proxy test helpers | 🧪 | Phase 09 |
| hard/soft navigation / prefetch Proxy E2E scenarios | 🟠 | Specified Phase 09; automation 16 |
| deployment smoke tests | 🟠 | Production cases defined; automation 16 / ops 17 |

## Deployment & Operations

| Area | Status | Plan |
| --- | --- | --- |
| `next build` / `next start` | 🟠 | 01 / 17 |
| Node/Docker/reverse proxy | 🟠 | Runtime/request baselines 08–09; full 17 |
| serverless/adapters/self-hosting | 🟠 | Cache/action/API/Proxy implications covered; full 17 |
| cache handlers / multi-instance invalidation | 🟠 / ✅ | Phase 06 architecture; ops 17 |
| Route Handler ephemeral process / DB pooling | ✅ | Phase 08 baseline; ops 17 |
| Proxy process/global-state separation | ✅ | Phase 09 baseline; ops 17 |
| reverse-proxy rate/payload/connection protection | ✅ | Phase 09 architecture baseline; ops 17 |
| queues / outbox / durable jobs | 🟠 | Phases 07–09 distinction; ops 17 |
| rollback / health / graceful shutdown / CI-CD | 🟡 | Phase 17 |

## Architecture & Internals

| Area | Status | Plan |
| --- | --- | --- |
| route/layout/URL ownership | ✅ | Phases 02–03 |
| server/client/data/cache/mutation/HTTP ownership | ✅ | Phases 04–08 |
| request-front-door / Proxy ownership | ✅ | Phase 09 |
| earliest-useful vs latest-authoritative security design | ✅ | Phase 09 |
| tenant/locale rewrite architecture | ✅ | Phase 09 baseline; deep 18 |
| feature/vertical-slice / monorepo / BFF | 🟠 | Strong baselines; deep 18 |
| RSC build/delivery internals | 🟠 | Mental models through 09; deep 19 |
| Turbopack internals | 🟡 | Phase 19 |

## Upgrades & Migration

| Area | Status | Plan |
| --- | --- | --- |
| App Router upgrade workflow / codemods | 🟠 | Phase 01; full 20 |
| async params/searchParams migration | ✅ | Phases 02–03 / 08 |
| `next/router` → App Router navigation | 🟠 | Phase 03; full 20 |
| client-heavy SPA → server-first data/action/API | 🟠 | Phases 04–08; full 20 |
| previous cache model → Cache Components | 🟠 | Phase 06; full 20 |
| old `unstable_cache` / PPR / dynamicIO | ⚠️ | Migration only |
| old GET Route Handler cached-by-default assumptions | ⚠️ | Corrected in Phase 08 |
| `middleware.ts` → `proxy.ts` | ✅ | Current semantic migration Phase 09; large upgrade program depth 20 |
| old Edge-only Middleware assumptions | ⚠️ | Phase 09 teaches current Proxy runtime instead |
| Pages API Routes / Pages Router migration | ⛔ | Outside handbook scope |

## Phase 02–08 completion

Phases 02–08 are complete at their assigned depth for routing, navigation, Server/Client boundaries, data fetching, caching/revalidation, mutations/forms/Server Functions, and Route Handler/HTTP architecture.

## Phase 09 completion note

Phase 09 is complete for stable Next.js 16.2 request-pipeline and Proxy semantics because it teaches:

- the `proxy.ts` convention, why `middleware.ts` was renamed/deprecated, and how to migrate semantically rather than only rename
- exact execution order across `next.config` headers/redirects, Proxy, rewrites, filesystem routes, dynamic routes, and fallback rewrites
- matcher strings/arrays/regex, static-analysis constraints, `has`, `missing`, locale matching, negative matching, assets, prefetches, and `_next/data` security behavior
- `NextRequest`, `NextResponse.next()`, request-vs-response headers, cookies, trusted internal metadata, header-size risks, and request IDs
- redirects, rewrites, safe destinations, RSC rewrite semantics, localization, host-based tenancy, and advanced URL-normalization flags
- optimistic auth gating while keeping authoritative authorization in DAL/actions/endpoints; CORS, CSRF posture, rate-limit placement, forwarded-header trust, and CSP nonce implications
- current Node.js Proxy runtime, global-state/deployment constraints, critical-path budgeting, `NextFetchEvent.waitUntil`, body-buffering risk, and experimental body-size config
- experimental matcher/Proxy unit-test helpers, soft-vs-hard navigation debugging, migration audits, incident runbooks, and production architecture review

Phase 10 now owns deep RSC/HTML rendering, Suspense, streaming, hydration, and partial-delivery mechanics. Full security, observability, performance, testing, deployment, architecture, and migration depth remain Phases 13–20.

## Completion rule

The handbook is not complete until this contract is re-audited against the then-current stable Next.js docs and every stable in-scope item has a justified final state.

See [Final Completeness Audit](./final-completeness-audit.md) for the release gate.