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
| Next.js 16.2 stable behavior | 🟠 | Routing, navigation, RSC boundaries, data, cache, mutations, and Route Handlers verified; later phases cover remaining request/render/ops APIs |
| Next.js 16.3 preview/canary | 🧪 | Track but do not teach as stable until promoted to npm `latest` |
| React 19.2 stable APIs | 🟠 | React handbook owns React depth; Next.js explains framework integration |
| React Canary exposed by App Router | 🟠 | Covered only where stable Next.js docs define a supported framework contract |
| Vercel/platform-specific behavior | 🟡 | Must remain clearly labeled and separated from Next.js core |

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
| 09 · Request Pipeline & Proxy | 🟡 |
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
| Installation | ✅ | `01-foundations/*` |
| Project Structure | ✅ | `01-foundations/*` |
| Layouts and Pages | ✅ | `02-app-router-and-layouts/*` |
| Linking and Navigating | ✅ | `03-navigation-and-url-state/*` |
| Server and Client Components | ✅ | `04-server-and-client-components/*` |
| Fetching Data | ✅ | `05-data-fetching/*` |
| Cache Components | ✅ | `06-caching-rendering-and-revalidation/*` |
| Caching and Revalidating | ✅ | `06-caching-rendering-and-revalidation/*` |
| Mutating Data / Server Functions | ✅ | `07-mutations-forms-and-server-functions/*` |
| Route Handlers | ✅ | `08-route-handlers/*` |
| Error Handling | 🟠 | Route/data/cache/action/API failure models covered; deep Phase 14 |
| CSS / styling integration | 🟡 | Framework behavior only |
| Image Optimization | 🟡 | Phase 12 |
| Font Optimization | 🟡 | Phase 12 |
| Metadata and OG Images | 🟡 | Phase 11 |
| Proxy | 🟠 | Current Next.js 16 terminology introduced; deep Phase 09 |
| Deploying | 🟠 | Runtime/serverless implications introduced through Phase 08; full Phase 17 |
| Upgrading | 🟠 | Baseline workflow introduced; deep Phase 20 |

## Routing & File Conventions

| API / convention | Status | Handbook location / plan |
| --- | --- | --- |
| `app/` route tree | ✅ | Phases 01–02 |
| `page.js/tsx`, `layout.js/tsx`, root/multiple roots | ✅ | Phase 02 |
| `template.js/tsx` | ✅ | Phase 02 |
| `loading.js/tsx` | ✅ | Phases 02–06; transport depth 10 |
| `error.js/tsx`, `global-error.js/tsx` | 🟠 | Boundary semantics covered; deep Phase 14 |
| `not-found.js/tsx` | ✅ | Phase 02 |
| `global-not-found.js/tsx` | 🧪 | Experimental |
| `default.js/tsx` | ✅ | Phase 02 |
| `route.js/ts` | ✅ | Phase 08 |
| route/page same-segment conflict | ✅ | Phase 08 |
| Dynamic/catch-all/optional catch-all segments | ✅ | Phase 02 |
| async `params` | ✅ | Phase 02; Route Handler params Phase 08 |
| `RouteContext<'/...'>` | ✅ | Phase 08 |
| `generateStaticParams`, `dynamicParams` | ✅ | Routing 02; cache/rendering 06; Route Handler use 08 |
| Route Groups / Private Folders | ✅ | Phase 02 |
| Parallel / Intercepting Routes | ✅ | Phase 02 |
| `src/` | ✅ | Phase 01 |
| `public/` | 🟠 | Structure 01; asset behavior 12 |
| `proxy.js/ts` | 🟠 | Phase 09 |
| `instrumentation.js/ts`, `instrumentation-client.js/ts` | 🟡 | Phase 14 |
| Metadata files | 🟡 | Phase 11 |
| `forbidden.js` / `unauthorized.js` | 🧪 | Verify stable auth-interrupt contract before teaching |

## Navigation Components & Hooks

| API / behavior | Status | Handbook location / plan |
| --- | --- | --- |
| `<Link>` + navigation props | ✅ | Phase 03 |
| `<Link onNavigate>` / `transitionTypes` | ✅ | Phase 03; broader View Transition integration remains experimental |
| `useRouter` + push/replace/back/forward | ✅ | Phase 03 |
| `router.refresh` | ✅ | Navigation 03; mutation refresh semantics 07 |
| `router.prefetch` / `onInvalidate` | ✅ | Phase 03 |
| `usePathname`, `useSearchParams`, `useParams` | ✅ | Phase 03 |
| `useSelectedLayoutSegment(s)` | ✅ | Phase 03 |
| `useLinkStatus` | ✅ | Phase 03 |
| `redirect`, `permanentRedirect` | ✅ | Navigation 03; mutation 07; HTTP context 08 |
| History API / Back / Forward / hash / scroll / focus | ✅ | Phase 03 |
| Client Router Cache / prefetch freshness interaction | ✅ | Phase 06 |

## Server & Client Component Boundaries

| Concept / API | Status | Handbook location / plan |
| --- | --- | --- |
| Server Components default | ✅ | Phase 04 |
| Server Component vs Server Function distinction | ✅ | Phases 04 / 07 |
| `'use client'` / client module graph | ✅ | Phase 04 |
| lower client boundaries | ✅ | Phase 04; measurement depth 15 |
| Server → Client composition / server ReactNode slots | ✅ | Phase 04 |
| React-serializable props / minimal DTOs | ✅ | Phase 04 |
| server-started Promise → Client `use()` | ✅ | Phases 04–05 |
| Context/provider placement | ✅ | Phase 04 |
| third-party/browser-only integration | ✅ | Phase 04 |
| `server-only`, `client-only`, environment poisoning | ✅ | Phase 04 |
| RSC payload / hydration / subsequent-navigation internals | 🟠 | Mental models 04–08; deep 10 / 19 |

## Data Fetching

| Area | Status | Handbook location / plan |
| --- | --- | --- |
| Async Server Components / server data ownership | ✅ | Phase 05 |
| Server-side `fetch` | ✅ | Fetching 05; cache semantics 06 |
| Direct database / ORM / SDK access | ✅ | Phase 05 |
| avoid own Route Handler hop from Server Component | ✅ | Phases 05 / 08; build-time and extra-HTTP-hop rationale complete |
| HTTP status / external response validation | ✅ | Phase 05 |
| data minimisation / DTO projection | ✅ | Phases 04–05 |
| Parallel/sequential fetching / waterfalls | ✅ | Phase 05 |
| N+1 / batching / bounded fan-out | ✅ | Phase 05 |
| Preloading / Promise sharing / React `cache` | ✅ | Phase 05 |
| Client-side fetching / SWR architecture | ✅ | Phase 05 |
| Streaming data with Suspense / React `use()` | ✅ | Phase 05; transport depth 10 |

## Caching, Rendering & Revalidation

This section remains explicitly version-sensitive and follows stable Next.js 16.2 behavior.

| Area / API | Status | Notes |
| --- | --- | --- |
| current default server `fetch` auto behavior | ✅ | Phase 06 |
| `cache: 'no-store'`, `cache: 'force-cache'` | ✅ | Phase 06 |
| `next.revalidate`, `next.tags` | ✅ | Phase 06 |
| static vs dynamic server rendering | ✅ | Phase 06; delivery internals 10 |
| React `cache` vs persistent Next.js caching | ✅ | Phases 05–06 |
| Cache Components (`cacheComponents: true`) | ✅ | Phase 06 |
| `'use cache'`, cache keys, runtime API restrictions | ✅ | Phase 06 |
| `cacheLife`, `cacheTag` | ✅ | Phase 06 |
| `revalidateTag(tag, profile)` | ✅ | Phase 06; mutation use 07 |
| single-argument `revalidateTag(tag)` | ⚠️ | Deprecated |
| `updateTag`, `revalidatePath` | ✅ | Phase 06; mutation workflow 07 |
| `refresh` from `next/cache` | ✅ | Phase 07; Server Action only |
| previous-model `revalidate` / `fetchCache` / `dynamic` | ✅ | Phase 06; Route Handler previous-model use 08 |
| `unstable_cache` | ⚠️ | Migration/history context |
| `connection()` | ✅ | Phase 06 |
| `unstable_noStore` | ⚠️ | Modern replacement is `connection()` |
| `'use cache: private'` | 🧪 | Experimental in 16.2 |
| `'use cache: remote'`, `cacheHandlers` | ✅ | Phase 06; ops depth 17 |
| Partial Prerendering via Cache Components | ✅ | Phase 06; RSC mechanics 10 |
| Client Router Cache vs server cache | ✅ | Phase 06 |
| distributed invalidation / stampede / region divergence | ✅ | Phase 06; ops depth 17 |
| cache isolation / tenant key design | ✅ | Phase 06 baseline; deep security 13 |

## Request APIs

| API | Status | Planned phase |
| --- | --- | --- |
| `cookies()` read semantics | 🟠 | Used across 06–08; request pipeline/auth depth 09 / 13 |
| `cookies()` set/delete in Server Actions | ✅ | Phase 07 |
| `cookies()` set/delete in Route Handlers | ✅ | Phase 08 |
| `headers()` | 🟠 | Route Handler request use 08; pipeline/proxy depth 09 |
| route `params` | ✅ | Phase 02; Route Handler async params Phase 08 |
| page `searchParams` | ✅ | Phase 03 |
| `connection()` | ✅ | Phase 06 |
| Draft/preview mode APIs | 🟡 | Later content/request handling |

## Mutations, Forms & Server Functions

| API / area | Status | Handbook location / plan |
| --- | --- | --- |
| Server Functions / Server Actions terminology | ✅ | Phase 07 |
| `'use server'` inline/module level | ✅ | Phase 07 |
| Client imports / Server Function props | ✅ | Phase 07 |
| Server Actions use POST | ✅ | Phase 07 |
| form `action`, submitter `formAction` | ✅ | Phase 07 |
| `FormData`, `bind`, `requestSubmit`, progressive enhancement | ✅ | Phase 07 |
| `next/form` mutation-vs-navigation distinction | ✅ | Phase 07 |
| runtime validation / mass assignment | ✅ | Phase 07; HTTP equivalent 08 |
| authentication/resource authorization | ✅ | Phase 07 baseline; full architecture 13 |
| same-origin / `serverActions.allowedOrigins` | ✅ | Phase 07 baseline; CSRF depth 13 |
| `bodySizeLimit` / action upload architecture | ✅ | Phase 07; HTTP/upload depth 08 |
| `useActionState`, `useFormStatus`, `useOptimistic` | ✅ | Phase 07 |
| mutation concurrency / lost updates | ✅ | Phase 07 |
| refresh / redirect / cookie / invalidation sequencing | ✅ | Phase 07 |
| idempotency / unique constraints / transactions / outbox | ✅ | Phase 07 |
| Server Function vs Route Handler decision | ✅ | Both sides complete Phases 07–08 |
| Server Function testing automation | 🟡 | Phase 16 |

## Route Handlers & HTTP

| Area / API | Status | Handbook location / plan |
| --- | --- | --- |
| `route.ts` App Router endpoint convention | ✅ | Phase 08 |
| public HTTP boundary / arbitrary client model | ✅ | Phase 08 |
| `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS` | ✅ | Phase 08 |
| unsupported method → 405 | ✅ | Phase 08 |
| automatic `OPTIONS` / `Allow` behavior | ✅ | Phase 08 |
| route/page same-segment conflict | ✅ | Phase 08 |
| Route Handlers do not participate in layout/client navigation rendering | ✅ | Phase 08 |
| native Web `Request` | ✅ | Phase 08 |
| native Web `Response` / `Response.json()` | ✅ | Phase 08 |
| `NextRequest` | ✅ | Phase 08; Proxy integration depth 09 |
| `NextRequest.nextUrl` / cookies | ✅ | Phase 08 |
| `NextResponse` / json / cookies / redirect / rewrite | ✅ | Phase 08; `next()` Proxy depth 09 |
| async Route Handler params | ✅ | Phase 08 |
| global `RouteContext` helper | ✅ | Phase 08 |
| URL query params | ✅ | Phase 08 |
| request headers / safe allow-listing | ✅ | Phase 08 baseline; Proxy forwarding depth 09 |
| request body one-read stream semantics / `clone()` | ✅ | Phase 08 |
| `request.json()` | ✅ | Phase 08 |
| `request.formData()` | ✅ | Phase 08 |
| `request.text()` / raw webhook body | ✅ | Phase 08 |
| `arrayBuffer()` / `blob()` binary payloads | ✅ | Phase 08 |
| content-type / malformed-body handling | ✅ | Phase 08 |
| request schema validation / unknown-field projection | ✅ | Phase 08; security depth 13 |
| mass-assignment prevention | ✅ | Phases 07–08 |
| SSRF-safe server-side URL construction | ✅ | Phase 08 baseline; security depth 13 |
| JSON/text/XML/CSV responses | ✅ | Phase 08 |
| files / downloads / `Content-Disposition` | ✅ | Phase 08 |
| Web `ReadableStream` response model | ✅ | Phase 08; React/RSC streaming internals 10 |
| upstream stream pass-through / header allow-listing | ✅ | Phase 08 |
| stream cancellation/backpressure/late-error model | ✅ | Phase 08 baseline; performance/ops depth 15–17 |
| large file object-storage / signed-URL architecture | ✅ | Phase 08 baseline; ops depth 17 |
| GET Route Handlers not cached by default | ✅ | Phase 08 current 16.2 behavior |
| non-GET methods not cached | ✅ | Phase 08 |
| previous-model `dynamic = 'force-static'` GET caching | ✅ | Phase 08 with Phase 06 model context |
| Cache Components GET prerender/request-time model | ✅ | Phase 08 |
| `use cache` helper inside Route Handler workflow | ✅ | Phase 08; directive remains in extracted helper, not handler body |
| HTTP `Cache-Control` vs Next.js server cache | ✅ | Phase 08 |
| Route Handler `generateStaticParams` interaction | ✅ | Phase 08 |
| runtime/serverless/process-local state constraints | ✅ | Phase 08 baseline; deployment depth 17 |
| static export Route Handler limits | ✅ | Phase 08 baseline; deployment depth 17 |
| CORS / custom `OPTIONS` preflight | ✅ | Phase 08 baseline; broad policy depth 09 / 13 |
| CORS is not auth | ✅ | Phase 08 |
| authentication vs resource authorization | ✅ | Phase 08 baseline; full Phase 13 |
| HTTP CSRF considerations | 🟠 | Cookie-auth endpoint baseline Phase 08; full CSRF architecture 13 |
| application/platform rate limiting | ✅ | Phase 08 baseline; security/ops depth 13 / 17 |
| webhook raw signature verification | ✅ | Phase 08 |
| webhook replay / dedupe / idempotency | ✅ | Phase 08 |
| callback URL / open redirect protection | ✅ | Phase 08 baseline; auth depth 13 |
| safe API error/log-redaction contract | ✅ | Phase 08 baseline; observability depth 14 |
| Server Action vs Route Handler vs direct server helper | ✅ | Phases 05 / 07 / 08 |
| Backend-for-Frontend decision model | ✅ | Phase 08 baseline; large-app depth 18 |
| upstream proxy adapter / open-proxy avoidance | ✅ | Phase 08 baseline; Proxy phase 09 covers request-pipeline rewrites |
| API versioning / mobile-external compatibility | ✅ | Phase 08 architecture baseline |
| Route Handler production incident/debug review | ✅ | Phase 08 baseline; deep observability 14 |

## Proxy & Request Pipeline

| Area | Status | Planned phase |
| --- | --- | --- |
| `proxy.ts` naming | 🟠 | Phase 09 |
| Proxy function / matchers / request order | 🟡 | 09 |
| redirects / rewrites / request/response headers | 🟠 | Route Handler-side concepts 08; Proxy mechanics 09 |
| `NextResponse.next()` / upstream request-header forwarding | 🟠 | API introduced 08; deep 09 |
| auth gating | 🟡 | 09 / 13 |
| authoritative authorization outside Proxy | ✅ | Trust/action/API models established 05–08 |
| localization / tenancy | 🟡 | 09 / 18 |
| old `middleware.ts` convention | ⚠️ | Migration-only in Next.js 16 |

## Rendering, Suspense & Navigation Delivery

| Area | Status | Planned phase |
| --- | --- | --- |
| server rendering pipeline / RSC payload / HTML / hydration | 🟠 | Mental models 04–08; deep 10 |
| React/RSC streaming / Suspense | 🟠 | Data/cache boundaries covered; deep 10 |
| HTTP response streaming | ✅ | Phase 08; distinct from RSC streaming |
| `loading.tsx` | ✅ | Phases 02–06 |
| soft vs hard navigation | ✅ | Phases 02–03 |
| production `<Link>` prefetching | ✅ | Phase 03 |
| Cache Components partial prerendering | ✅ | Phase 06; mechanics 10 |
| action response can carry updated RSC UI/data | ✅ | Phase 07 |
| Next.js 16.3 Instant Navigations | 🧪 | Preview-only at baseline |

## Security

| Area | Status | Planned phase |
| --- | --- | --- |
| authentication vs authorization distinction | ✅ | Mutation/API baselines 07–08; full architecture 13 |
| route/query/navigation/request body inputs untrusted | ✅ | Phases 02–03 / 08 |
| Server Function arguments/FormData untrusted | ✅ | Phase 07 |
| public Route Handler trust boundary | ✅ | Phase 08 |
| server/client DTO minimisation | ✅ | Phases 04–05 |
| `server-only` / environment poisoning | ✅ | Phase 04 |
| scoped tenant/resource data queries | ✅ | Phases 05 / 07–08 baseline; deep 13 / 18 |
| cache isolation / shared-cache auth caveats | ✅ | Phase 06 baseline; deep 13 |
| mass assignment / overposting | ✅ | Phases 07–08 |
| same-origin action protections | ✅ | Phase 07 baseline |
| CORS / origin allow-list | ✅ | Phase 08 baseline; full request security 13 |
| CSRF | 🟠 | Action and cookie-auth HTTP baselines 07–08; deep 13 |
| webhook signatures / replay protection | ✅ | Phase 08 baseline; broader secret/security depth 13 |
| SSRF | ✅ | Route Handler prevention baseline 08; broader threat model 13 |
| uploads / file validation / direct storage | ✅ | Phase 08 baseline; deep 13 / 17 |
| HTTP rate limiting / abuse control | ✅ | Phase 08 baseline; deep 13 / 17 |
| CSP / security headers | 🟡 | 09 / 13 |
| XSS / output safety | 🟠 | Navigation/API baselines; broad 13 |
| secrets / `NEXT_PUBLIC_` | 🟠 | Boundary exposure covered; deep 13 |
| safe errors / log redaction | ✅ | Phases 07–08 baseline; deep 13–14 |

## Errors, Observability & Debugging

| Area | Status | Planned phase |
| --- | --- | --- |
| route error boundary placement | ✅ | Phase 02 |
| expected mutation errors vs exceptions | ✅ | Phase 07 |
| stale UI / duplicate mutation diagnosis | ✅ | Phases 06–07 |
| Route Handler routing/auth/validation/rate-limit/timeout/stream failure taxonomy | ✅ | Phase 08 |
| raw HTTP and preflight reproduction | ✅ | Phase 08 |
| API correlation/request ID model | ✅ | Phase 08 baseline; deep 14 |
| route-template metrics / cardinality awareness | ✅ | Phase 08 baseline; deep 14–15 |
| webhook incident metadata / replay debugging | ✅ | Phase 08 baseline |
| dependency timeline / upstream latency decomposition | ✅ | Phases 05 / 08 baseline; deep 14–15 |
| structured logs / OpenTelemetry / instrumentation | 🟠 | Baselines 05–08; full 14 |
| source maps / release correlation | 🟡 | 14 |

## Performance

| Area | Status | Planned phase |
| --- | --- | --- |
| client JS / hydration cost | 🟠 | Phase 04; deep 15 |
| server render/data/cache latency | 🟠 | Phases 04–06; deep 15 |
| data waterfalls / N+1 / bounded concurrency | ✅ | Phase 05 |
| mutation latency / side-effect critical path | ✅ | Phase 07 baseline |
| Route Handler critical path / upstream latency | ✅ | Phase 08 baseline; deep 15 |
| HTTP streaming / cancellation / large transfer architecture | ✅ | Phase 08 baseline; deep 15 / 17 |
| API rate-limit/load-test metric model | ✅ | Phase 08 baseline; deep 15 / 17 |
| caching architecture / stampede avoidance | ✅ | Phase 06 |
| performance budgets / measurement | 🟠 | Multiple baselines; deep 15 |

## Testing & Production

| Area | Status | Planned phase |
| --- | --- | --- |
| production build validation | ✅ | Phases 02–08 workflow |
| unit/component tests | 🟡 | 16 |
| Server/Client Component strategy | 🟠 | Architecture scenarios covered; automation 16 |
| data/cache tests | 🟠 | Failure/isolation scenarios defined; automation 16 |
| Server Function tests | 🟠 | Matrix/failure modes Phase 07; automation 16 |
| Route Handler test matrix | ✅ | Failure/security/HTTP cases specified Phase 08; automation 16 |
| Route Handler automated tests | 🟡 | 16 |
| Playwright E2E / accessibility automation | 🟡 | 16 |
| action progressive-enhancement E2E | 🟠 | Behaviour specified 07; automation 16 |
| duplicate/idempotency/concurrency tests | 🟠 | Cases specified 07–08; automation 16 |
| deployment smoke tests | 🟠 | HTTP production cases defined 08; automation 16 / ops 17 |

## Deployment & Operations

| Area | Status | Planned phase |
| --- | --- | --- |
| `next build` / `next start` | 🟠 | 01 / 17 |
| Node hosting / standalone / Docker / reverse proxy | 🟠 | HTTP/runtime implications 08; full 17 |
| environment configuration | 🟠 | 01 / 17 |
| adapters / serverless / Vercel / self-hosting | 🟠 | Cache/action/Route Handler implications introduced; full 17 |
| local vs remote cache handlers | ✅ | Phase 06 architecture; ops depth 17 |
| multi-instance cache/revalidation | 🟠 | Phase 06; ops depth 17 |
| Server Action origin/proxy configuration | 🟠 | Phase 07 baseline; deployment/security depth 13 / 17 |
| Route Handler ephemeral process / filesystem / timeout model | ✅ | Phase 08 baseline; full ops 17 |
| DB connection pooling/serverless constraints | ✅ | Phase 08 baseline; full ops 17 |
| queues/outbox/durable side effects | 🟠 | Phases 07–08 architecture; production ops 17 |
| object storage / signed downloads | 🟠 | Phase 08 architecture; implementation/ops 17 |
| rollback / health / graceful shutdown | 🟡 | 17 |
| CI/CD / preview environments | 🟡 | 17 |

## Architecture & Internals

| Area | Status | Planned phase |
| --- | --- | --- |
| route/layout/URL ownership | ✅ | Phases 02–03 |
| server/client module ownership | ✅ | Phase 04 |
| server data/dependency ownership | ✅ | Phase 05 |
| cache freshness/invalidation ownership | ✅ | Phase 06 |
| mutation/action boundary ownership | ✅ | Phase 07 |
| HTTP endpoint ownership / transport boundary | ✅ | Phase 08 |
| thin action + server-only domain command pattern | ✅ | Phase 07 |
| Server Action + Route Handler shared domain-command pattern | ✅ | Phase 08 |
| Server Component direct source vs internal HTTP decision | ✅ | Phases 05 / 08 |
| BFF aggregation/adaptation decision model | ✅ | Phase 08 baseline; deep 18 |
| public API versioning / client rollout compatibility | ✅ | Phase 08 baseline; deep 18 |
| transport-specific error/auth mapping | ✅ | Phase 08 |
| feature/vertical-slice architecture | 🟠 | Examples 02–08; deep 18 |
| monorepos/shared packages | 🟠 | Runtime boundaries 04; deep 18 |
| multi-tenancy/permissions | 🟠 | Strong trust model established; deep 13 / 18 |
| RSC build/delivery internals | 🟠 | Mental models 04–08; deep 19 |
| Turbopack internals / public contract vs implementation detail | 🟡 | 19 |

## Upgrades & Migration

| Area | Status | Planned phase |
| --- | --- | --- |
| current App Router upgrade workflow / codemods | 🟠 | 01 / 20 |
| async `params` / `searchParams` current contract | ✅ | Phases 02–03; Route Handler params 08 |
| `next/router` → App Router navigation APIs | 🟠 | Phase 03; migration 20 |
| client-heavy SPA → server-first data/action/API migration | 🟠 | Phases 04–08; migration depth 20 |
| previous cache model → Cache Components | 🟠 | Phase 06; full upgrade playbook 20 |
| `unstable_cache` / old PPR / dynamicIO migration | ⚠️ | Migration-only |
| Server Actions historical experimental enable flag | ⚠️ | Historical only; stable-by-default in modern Next.js |
| older GET Route Handler cached-by-default assumptions | ⚠️ | Phase 08 explicitly teaches current not-cached-by-default behavior |
| Pages API Routes | ⛔ | Pages Router excluded; Route Handlers are the App Router HTTP primitive |
| Proxy migration from `middleware.ts` | ⚠️ | Phase 20 |
| Turbopack compatibility | 🟡 | 20 |

## Phase 02 completion note

Phase 02 is complete for App Router route-tree semantics, special files, dynamic segments, parallel/intercepting routes, trust boundaries, and routing design review.

## Phase 03 completion note

Phase 03 is complete for stable App Router navigation, URL state, prefetching, programmatic/server navigation, route hooks, History API, accessibility, redirects, and navigation design review.

## Phase 04 completion note

Phase 04 is complete for Server/Client Component boundaries, module graphs, interleaving, serialization, providers, third-party/browser-only integration, environment isolation, and boundary debugging.

## Phase 05 completion note

Phase 05 is complete for server/client data ownership, async Server Components, direct DB/ORM/SDK access, parallel/sequential fetching, N+1/batching, React `cache`, Suspense/`use()`, live client refresh, and data failure/security patterns.

## Phase 06 completion note

Phase 06 is complete for stable Next.js 16.2 cache/rendering/revalidation semantics: current server `fetch`, previous model, Cache Components, `use cache`, `cacheLife`, tags, modern revalidation, `connection()`, remote caching, partial prerendering, Client Router Cache, cache isolation, incidents, and deployment-aware cache design.

## Phase 07 completion note

Phase 07 is complete for stable mutation/form/Server Function semantics: Server Function/Action terminology, `use server`, forms, validation/authorization, action state/status/optimistic UI, post-write cache/redirect/cookie sequencing, concurrency, idempotency, transactions, durable side effects, and mutation architecture.

## Phase 08 completion note

Phase 08 is complete for stable Route Handler and HTTP semantics because it teaches:

- `route.ts`, supported HTTP methods, 405 behavior, automatic/custom OPTIONS, route resolution, and page/route ownership
- Web `Request` / `Response`, `NextRequest` / `NextResponse`, `nextUrl`, cookies, headers, redirects/rewrites, async params, and `RouteContext`
- JSON, form, text, and binary request bodies; one-read streams; schema validation; content-type checks; mass-assignment and SSRF prevention
- JSON/text/XML/CSV/file/download responses, Web streams, framing, cancellation, backpressure, late-stream failure behavior, and object-storage transfer patterns
- current GET Route Handler not-cached-by-default behavior, previous `force-static` model, Cache Components prerender/runtime classification, extracted `use cache` helpers, and HTTP-cache separation
- authentication/resource authorization, CORS/preflight, CSRF baseline, rate limiting, request timeouts, safe logging, and API error contracts
- webhook raw signature verification, replay/deduplication/idempotency, callback/open-redirect safety, and durable acknowledgement/work-queue patterns
- Server Action vs Route Handler vs direct server helper decisions, shared domain logic, BFF boundaries, upstream proxy safety, and API versioning
- serverless/process-local/filesystem/timeout/DB-connection constraints, load/latency debugging, raw HTTP reproduction, production incident runbooks, and senior HTTP/API design review

Full Proxy/request-pipeline mechanics remain Phase 09. Full authentication/security, observability, performance, automated testing, and deployment operations remain Phases 13–17.

## Completion rule

The handbook is not complete until this contract is re-audited against the then-current stable Next.js docs and every stable in-scope item has a justified final state.

See [Final Completeness Audit](./final-completeness-audit.md) for the release gate.
