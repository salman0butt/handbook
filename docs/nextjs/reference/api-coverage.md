---
title: API Coverage Contract
description: Living coverage map from the current Next.js App Router documentation to this handbook.
---

# Next.js App Router API Coverage Contract

This is the handbook's living completeness contract against the **current stable Next.js App Router documentation**.

**Baseline verified: July 26, 2026 — Next.js 16.2.11 (16.x Active LTS).**

A topic becomes ✅ only after the handbook teaches the useful mental model, current API behavior, production implications, failure modes, and the security/performance trade-offs appropriate to that topic.

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
| Pages Router | ⛔ | Intentionally excluded by handbook scope |
| Next.js 16.2 stable behavior | 🟠 | Baseline + routing/navigation + component/data/cache behavior verified; later phases continue APIs and operations |
| Next.js 16.3 preview/canary | 🧪 | Track but do not teach as stable until promoted to npm `latest` |
| React 19.2 stable APIs | 🟠 | React handbook owns React depth; Next.js explains framework integration |
| React Canary exposed by App Router | 🟠 | Covered only when stable Next.js docs define a supported framework contract |
| Vercel platform behavior | 🟡 | Must remain clearly platform-specific |

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
| 07 · Mutations, Forms & Server Functions | 🟡 |
| 08 · Route Handlers | 🟡 |
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
| Installation | ✅ | `01-foundations/creating-and-running-a-nextjs-app` |
| Project Structure | ✅ | `01-foundations/project-structure-and-file-conventions` |
| Layouts and Pages | ✅ | `02-app-router-and-layouts/*` |
| Linking and Navigating | ✅ | `03-navigation-and-url-state/*` |
| Server and Client Components | ✅ | `04-server-and-client-components/*` |
| Fetching Data | ✅ | `05-data-fetching/*` |
| Cache Components | ✅ | `06-caching-rendering-and-revalidation/*` |
| Caching and Revalidating | ✅ | `06-caching-rendering-and-revalidation/*` |
| Updating Data / Server Functions | 🟡 | Phase 07 |
| Error Handling | 🟠 | Route/data/cache failure basics covered; deep Phase 14 |
| CSS / styling integration | 🟡 | Framework behavior only; no required styling library |
| Image Optimization | 🟡 | Phase 12 |
| Font Optimization | 🟡 | Phase 12 |
| Metadata and OG Images | 🟡 | Phase 11 |
| Route Handlers | 🟡 | Phase 08 |
| Proxy | 🟠 | Current Next.js 16 terminology introduced; deep Phase 09 |
| Deploying | 🟡 | Phase 17 |
| Upgrading | 🟠 | Baseline workflow introduced; deep Phase 20 |

## Routing & File Conventions

| API / convention | Status | Handbook location / plan |
| --- | --- | --- |
| `app/` route tree | ✅ | Phases 01–02 |
| `page.js/tsx`, `layout.js/tsx`, root/multiple root layouts | ✅ | Phase 02 |
| `template.js/tsx` | ✅ | Phase 02 |
| `loading.js/tsx` | ✅ | Routing 02; navigation 03; data/cache delivery 05–06; transport depth 10 |
| `error.js/tsx`, `global-error.js/tsx` | 🟠 | Boundary semantics covered; observability/recovery depth Phase 14 |
| `not-found.js/tsx` | ✅ | Phase 02 |
| `global-not-found.js/tsx` | 🧪 | Experimental; not taught as default production pattern |
| `default.js/tsx` | ✅ | Phase 02 parallel-route hard-load recovery |
| `route.js/ts` | 🟡 | Phase 08 |
| Dynamic / catch-all / optional catch-all segments | ✅ | Phase 02 |
| async route `params` | ✅ | Phase 02 current Promise contract |
| `generateStaticParams` | ✅ | Routing purpose 02; rendering/cache interaction 06 |
| `dynamicParams` | ✅ | Routing behavior 02; previous-model rendering semantics 06 |
| Route Groups / Private Folders | ✅ | Phase 02 |
| Parallel Routes / implicit children slot | ✅ | Phase 02 |
| Intercepting Routes / route-driven modal | ✅ | Phase 02; history/cache interaction 03 / 06 |
| `src/` | ✅ | Phase 01 |
| `public/` | 🟠 | Structure Phase 01; asset behavior Phase 12 |
| `proxy.js/ts` | 🟠 | Phase 09 |
| `instrumentation.js/ts`, `instrumentation-client.js/ts` | 🟡 | Phase 14 |
| Metadata files | 🟡 | Phase 11 |
| `forbidden.js` / `unauthorized.js` | 🧪 | Verify exact stable auth-interrupt contract before teaching |

## Navigation Components & Hooks

| API / behavior | Status | Handbook location / plan |
| --- | --- | --- |
| `<Link>` + `href`, `replace`, `scroll`, `prefetch` | ✅ | Phase 03 |
| `<Link onNavigate>` | ✅ | Phase 03 |
| `<Link transitionTypes>` | ✅ | Stable 16.2 prop; broader View Transition integration remains experimental |
| `useRouter` + push/replace/back/forward | ✅ | Phase 03 |
| `router.refresh` | 🟠 | Navigation contract 03; mutation sequencing depth 07 |
| `router.prefetch` / `onInvalidate` | ✅ | Phase 03 |
| `usePathname`, `useSearchParams`, `useParams` | ✅ | Phase 03 |
| `useSelectedLayoutSegment(s)` | ✅ | Phase 03 |
| `useLinkStatus` | ✅ | Phase 03 |
| `redirect`, `permanentRedirect` | ✅ | Navigation semantics 03; mutation/HTTP contexts later |
| History API / Back / Forward / hash / scroll / focus | ✅ | Phase 03 |
| Client Router Cache / prefetch freshness interaction | ✅ | Phase 06 |
| route-change observation | ✅ | Phase 03 |

## Server & Client Component Boundaries

| Concept / API | Status | Handbook location / plan |
| --- | --- | --- |
| Server Components default | ✅ | Phase 04 |
| Server Component vs Server Function distinction | ✅ | Phase 04; Server Function depth 07 |
| `'use client'` / client module graph | ✅ | Phase 04 |
| lower client boundaries to reduce browser JS | ✅ | Phase 04; broad measurement Phase 15 |
| Server → Client composition | ✅ | Phase 04 |
| interleaving server children/ReactNode through client shells | ✅ | Phase 04 |
| React-serializable props / minimal DTOs | ✅ | Phase 04 |
| server-started Promise → Client `use()` | ✅ | Phases 04–05; rendering internals later |
| Context/provider placement | ✅ | Phase 04 |
| third-party client wrappers / library entry points | ✅ | Phase 04 |
| browser-only `next/dynamic(..., { ssr: false })` | ✅ | Phase 04; broader perf depth Phase 15 |
| `server-only`, `client-only`, environment poisoning prevention | ✅ | Phase 04 |
| initial Client Component prerendering | ✅ | Phase 04 |
| RSC payload / hydration / subsequent-navigation internals | 🟠 | Mental models 04–06; deep 10 / 19 |

## Data Fetching

| Area | Status | Handbook location / plan |
| --- | --- | --- |
| Async Server Components | ✅ | Phase 05 |
| server data ownership | ✅ | Phase 05 |
| Server-side `fetch` | ✅ | Fetching semantics 05; persistent cache semantics 06 |
| Direct database / ORM / SDK access | ✅ | Phase 05 |
| avoid internal Route Handler hop from Server Component | ✅ | Phases 04–05; Route Handler depth Phase 08 |
| HTTP status handling / external response validation | ✅ | Phase 05 |
| data minimisation / DTO projection | ✅ | Phases 04–05 |
| Parallel and sequential fetching | ✅ | Phase 05 |
| dependency waterfalls / start-early await-late | ✅ | Phase 05 |
| N+1 / batching / bounded fan-out | ✅ | Phase 05 |
| Preloading / Promise sharing | ✅ | Phase 05 |
| React `cache` request/render memoisation | ✅ | Phase 05; persistent cache distinction Phase 06 |
| Client-side fetching / SWR architecture | ✅ | Phase 05 |
| server snapshot + live client refresh | ✅ | Phase 05 |
| Streaming data with Suspense / React `use()` | ✅ | Phase 05; transport depth Phase 10 |
| data failure taxonomy / dev-vs-production fetch debugging | ✅ | Phase 05 |

## Caching, Rendering & Revalidation

This section is deliberately version-sensitive and is based on stable Next.js 16.2 behavior.

| Area / API | Status | Notes |
| --- | --- | --- |
| current default server `fetch` auto behavior | ✅ | Phase 06; explicitly rejects stale 13/14 default assumptions |
| `fetch(..., { cache: 'no-store' })` | ✅ | Phase 06 |
| `fetch(..., { cache: 'force-cache' })` | ✅ | Phase 06 |
| `next.revalidate` on server fetch | ✅ | Phase 06 |
| `next.tags` on server fetch | ✅ | Phase 06 |
| development Server Components HMR fetch cache | ✅ | Phases 05–06 troubleshooting |
| hard-refresh `cache-control: no-cache` dev behavior | ✅ | Phase 06 |
| static vs dynamic server rendering | ✅ | Phase 06 mental model; delivery internals Phase 10 |
| React `cache` vs persistent Next.js caching | ✅ | Phases 05–06 |
| Cache Components (`cacheComponents: true`) | ✅ | Phase 06, opt-in in stable 16.2 |
| `'use cache'` | ✅ | Phase 06 |
| cache key inputs / closed-over values | ✅ | Phase 06 |
| normal `use cache` runtime-API restriction | ✅ | Phase 06 |
| `cacheLife` | ✅ | Phase 06, stale/revalidate/expire + built-in/custom profiles |
| `cacheTag` | ✅ | Phase 06 |
| `revalidateTag(tag, profile)` | ✅ | Phase 06; `'max'` SWR model |
| single-argument `revalidateTag(tag)` | ⚠️ | Deprecated; not taught as current primary pattern |
| `updateTag` | ✅ | Phase 06, immediate expiration/read-your-own-write; Server Action context only |
| `revalidatePath` | ✅ | Phase 06; route-oriented invalidation |
| `refresh` from `next/cache` | 🟡 | Phase 07 mutation semantics |
| route segment `revalidate` / `fetchCache` / `dynamic` | ✅ | Phase 06 previous model only; disabled when Cache Components enabled |
| `unstable_cache` | ⚠️ | Migration/history context; modern direction is Cache Components / `use cache` |
| `connection()` | ✅ | Phase 06; stable explicit request-time rendering API |
| `unstable_noStore` | ⚠️ | Replaced by `connection()` for modern runtime rendering intent |
| `'use cache: private'` | 🧪 | Experimental in current 16.2 docs; not recommended as production default |
| `'use cache: remote'` | ✅ | Phase 06 deployment-aware shared caching |
| custom `cacheHandlers` | ✅ | Phase 06 architecture; implementation/ops depth Phase 17 |
| process-local vs serverless cache persistence | ✅ | Phase 06 |
| multi-instance/distributed invalidation | ✅ | Phase 06; operational depth Phase 17 |
| Partial Prerendering via Cache Components | ✅ | Phase 06 shell/dynamic-hole model; RSC transport depth Phase 10 |
| Client Router Cache vs server cache | ✅ | Phase 06 |
| `cacheLife.stale` client-router behavior | ✅ | Phase 06 |
| experimental `staleTimes` | 🧪 | Mentioned as experimental; not production default |
| old standalone PPR/dynamicIO/useCache flags | ⚠️ | Migration history only; Cache Components is current model |
| CDN / HTTP cache distinction | ✅ | Phase 06 baseline; deployment depth Phase 17 |
| cache stampede / invalidation storm / region divergence | ✅ | Phase 06 production incident model |
| cache isolation / tenant key design | ✅ | Phase 06 baseline; full security Phase 13 |
| cache metrics / incident runbook | ✅ | Phase 06 baseline; observability/perf depth 14–15 |

## Request APIs

| API | Status | Planned phase |
| --- | --- | --- |
| `cookies()` | 🟠 | Request/cache boundary 06; request pipeline/auth depth 09 / 13 |
| `headers()` | 🟠 | Request/cache boundary 06; request pipeline depth 09 |
| route `params` | ✅ | Phase 02 |
| page `searchParams` | ✅ | Phase 03 current Promise contract; cache-key implications Phase 06 |
| `connection()` | ✅ | Phase 06 |
| Draft/preview mode APIs | 🟡 | Content architecture / request handling |

## Mutations & Server Functions

| API / area | Status | Planned phase |
| --- | --- | --- |
| Server Functions / Server Actions terminology | 🟡 | Phase 07 |
| `'use server'` | 🟠 | Phase 04 separates it from Server Components; deep 07 |
| form `action` | 🟡 | 07 |
| runtime validation / authorization | 🟠 | Trust model established; deep 07 / 13 |
| `useActionState`, `useFormStatus`, `useOptimistic` | 🟡 | 07 |
| redirect after mutation | 🟠 | Redirect baseline 03; mutation sequence 07 |
| tag/path revalidation after mutation | 🟠 | Cache semantics 06; full mutation sequencing 07 |
| read-your-own-write with `updateTag` | ✅ | Cache semantics Phase 06; mutation workflow Phase 07 |
| idempotency / duplicate submissions | 🟡 | 07 |

## Route Handlers & HTTP

| Area | Status | Planned phase |
| --- | --- | --- |
| HTTP methods in `route.ts` | 🟡 | 08 |
| Web `Request` / `Response`, `NextRequest` / `NextResponse` | 🟡 | 08–09 |
| cookies / headers / redirects | 🟡 | 08–09 |
| streaming/file responses | 🟡 | 08 |
| webhooks | 🟠 | Cache invalidation/auth baseline 06; full 08 / 13 |
| CORS / rate limiting | 🟡 | 08 / 13 |
| Server Function vs Route Handler | 🟡 | 07–08 |
| direct server data access vs internal HTTP hop | ✅ | Phase 05; Route Handler decision depth Phase 08 |

## Proxy & Request Pipeline

| Area | Status | Planned phase |
| --- | --- | --- |
| `proxy.ts` naming | 🟠 | Current naming introduced; Phase 09 depth |
| Proxy function / matchers / request order | 🟡 | 09 |
| redirects / rewrites / headers | 🟡 | 09 |
| auth gating | 🟡 | 09 / 13 |
| authoritative authorization outside Proxy | ✅ | Trust model established Phases 02–06 |
| localization / tenancy | 🟡 | 09 / 18 |
| old `middleware.ts` convention | ⚠️ | Migration-only; renamed/deprecated in Next.js 16 |

## Rendering, Suspense & Navigation Delivery

| Area | Status | Planned phase |
| --- | --- | --- |
| server rendering pipeline / RSC payload / HTML generation / hydration | 🟠 | Mental models 04–06; deep Phase 10 |
| streaming | 🟠 | Data/cache boundary semantics covered; transport depth Phase 10 |
| Suspense | 🟠 | Route/query/data/cache boundaries covered; deep Phase 10 |
| `loading.tsx` | ✅ | Routing 02, navigation 03, data/cache delivery 05–06 |
| soft vs hard App Router navigation | ✅ | Phases 02–03 |
| production `<Link>` prefetching / dynamic partial prefetch | ✅ | Phase 03 |
| partial route navigation / preserved layouts | ✅ | Phases 02–03; cache interaction Phase 06 |
| Cache Components partial prerendering | ✅ | Phase 06; RSC mechanics Phase 10 |
| client Router Cache | ✅ | Phase 06 cache-layer model |
| Next.js 16.3 Instant Navigations | 🧪 | Preview-only at baseline; not taught as stable |

## Metadata & Assets

| Area | Status | Planned phase |
| --- | --- | --- |
| metadata / `generateMetadata` / title templates | 🟡 | 11 |
| Open Graph / robots / sitemap / manifest / JSON-LD | 🟡 | 11 |
| generated images / icons | 🟡 | 11–12 |
| `next/image`, `next/font`, `next/script` | 🟡 | 12 |
| resource hints | 🟡 | 12 / 15 |

## Security

| Area | Status | Planned phase |
| --- | --- | --- |
| authentication vs authorization | 🟠 | 13 |
| route/query/navigation inputs untrusted | ✅ | Phases 02–03 |
| server/client DTO minimisation | ✅ | Phases 04–05 |
| `server-only` / `client-only` / environment poisoning prevention | ✅ | Phase 04 |
| scoped tenant/resource data queries | ✅ | Phase 05 baseline; deep 13 / 18 |
| external response validation / secret-bearing upstream access | ✅ | Phase 05 |
| cache key isolation / tenant scope / high-cardinality risk | ✅ | Phase 06 baseline; deep Phase 13 |
| shared-cache authorization caveats | ✅ | Phase 06 baseline; deep Phase 13 |
| remote cache privacy/compliance considerations | ✅ | Phase 06 baseline; deployment/security depth 13 / 17 |
| client cache / rendered permission flags not authorization | ✅ | Phases 04–06 baseline; deep 13 |
| untrusted Server Function arguments | 🟠 | 07 / 13 |
| CSRF | 🟡 | 13 |
| XSS / output safety | 🟠 | Navigation risk baseline; broad Phase 13 |
| secrets and `NEXT_PUBLIC_` | 🟠 | Boundary/data exposure model covered; deep Phase 13 |
| safe redirects | ✅ | Phase 03 baseline; auth depth 13 |
| CSP / security headers | 🟡 | 09 / 13 |
| uploads / webhooks | 🟠 | Cache-webhook baseline 06; full 08 / 13 |
| log redaction | 🟠 | Data/cache rules 05–06; deep 13 / 14 |

## Errors, Observability & Debugging

| Area | Status | Planned phase |
| --- | --- | --- |
| route error boundary placement / missing-vs-unexpected distinction | ✅ | Phase 02 |
| navigation/boundary/data debugging | ✅ | Phases 03–05 |
| cache-layer classification / stale-data runbook | ✅ | Phase 06 |
| read-your-own-write debugging | ✅ | Phase 06; mutation depth 07 |
| cache stampede / invalidation storm / region divergence analysis | ✅ | Phase 06 |
| development HMR vs production cache behavior | ✅ | Phases 05–06 |
| structured logs / correlation IDs / OpenTelemetry / instrumentation | 🟠 | Baselines 05–06; full Phase 14 |
| source maps / release correlation | 🟡 | 14 |
| broad hydration/cache/build incident triage | 🟠 | Strong cache cases covered; deep 14 / 19 |

## Performance

| Area | Status | Planned phase |
| --- | --- | --- |
| client JS / hydration cost | 🟠 | Phase 04; broad measurement 15 |
| server render latency | 🟠 | Phases 04–06; deep 15 |
| data/database waterfalls / N+1 / bounded concurrency | ✅ | Phase 05; broader performance practice Phase 15 |
| route-level streaming boundaries | 🟠 | Data/cache delivery 05–06; deep 10 / 15 |
| code splitting / dynamic imports | 🟠 | Phase 04; deep 15 |
| prefetching | 🟠 | Phase 03; cache interaction 06; measurement depth 15 |
| caching architecture / hit-ratio / cardinality / remote-latency tradeoffs | ✅ | Phase 06; broad performance measurement Phase 15 |
| cache stampede avoidance model | ✅ | Phase 06 |
| performance budgets / measurement | 🟠 | Navigation, boundary, data, cache metrics introduced; deep 15 |

## Testing & Production

| Area | Status | Planned phase |
| --- | --- | --- |
| production build as route/boundary/data/cache validation | ✅ | Phases 02–06 workflow |
| unit/component tests | 🟡 | 16 |
| Server/Client Component strategy | 🟠 | Architecture scenarios covered; automation Phase 16 |
| data/cache-layer tests | 🟠 | Failure/isolation/invalidation scenarios specified 05–06; automation Phase 16 |
| Route Handler / Server Function tests | 🟡 | 16 |
| Playwright E2E / accessibility automation | 🟡 | 16 |
| hard/soft navigation + Back/Forward E2E | 🟠 | Scenarios defined; cache behavior expanded Phase 06; implementation 16 |
| deployment smoke tests | 🟡 | 16 / 17 |

## Deployment & Operations

| Area | Status | Planned phase |
| --- | --- | --- |
| `next build` / `next start` | 🟠 | 01 / 17 |
| Node hosting / standalone / Docker / reverse proxy | 🟡 | 17 |
| environment configuration | 🟠 | 01 / 17 |
| adapters / serverless / Vercel / self-hosting | 🟠 | Cache deployment implications 06; full Phase 17 |
| local vs remote cache handlers | ✅ | Phase 06 architecture; implementation/operations depth Phase 17 |
| multi-instance cache/revalidation | 🟠 | Architecture/invalidation model 06; operational depth Phase 17 |
| CDN cache distinction | 🟠 | Baseline Phase 06; operational depth Phase 17 |
| rollback / health / graceful shutdown | 🟡 | 17 |
| CI/CD / preview environments | 🟡 | 17 |

## Architecture & Internals

| Area | Status | Planned phase |
| --- | --- | --- |
| route-tree / layout / URL-state ownership | ✅ | Phases 02–03 |
| server/client module-graph ownership | ✅ | Phase 04 |
| server shell + client islands | ✅ | Phase 04 |
| server data ownership / dependency graph | ✅ | Phase 05 |
| cache ownership / freshness / invalidation decision model | ✅ | Phase 06 |
| domain tag taxonomy / path-vs-data invalidation | ✅ | Phase 06 |
| stable shell + dynamic-hole architecture | ✅ | Phase 06 |
| deployment-aware local vs remote cache decision | ✅ | Phase 06 |
| cache failure-mode / incident architecture | ✅ | Phase 06 |
| feature/vertical-slice architecture | 🟠 | Examples Phases 02–06; deep 18 |
| monorepos/shared packages | 🟠 | Runtime boundary guidance Phase 04; deep 18 |
| design systems / BFF decisions | 🟠 | BFF/data boundary baseline Phase 05; deep 18 |
| multi-tenancy/permissions | 🟠 | Routing/component/data/cache trust model established; deep 13 / 18 |
| RSC build/delivery internals | 🟠 | Mental model 04–06; deep 19 |
| Turbopack internals / public contract vs implementation detail | 🟡 | 19 |

## Upgrades & Migration

| Area | Status | Planned phase |
| --- | --- | --- |
| current App Router upgrade workflow / codemods | 🟠 | 01 / 20 |
| async `params` / page `searchParams` current contract | ✅ | Phases 02–03; migration depth 20 |
| `next/router` → App Router navigation APIs | 🟠 | Current contract Phase 03; migration 20 |
| client-heavy SPA → server-first boundary/data migration | 🟠 | Architecture methods 04–05; migration depth 20 |
| previous App Router cache model → Cache Components | 🟠 | Current semantic migration strategy Phase 06; full upgrade playbook Phase 20 |
| `unstable_cache` / old PPR / dynamicIO migration context | ⚠️ | Historical/migration-only; full Phase 20 |
| Proxy migration from `middleware.ts` | ⚠️ | 20 |
| Turbopack compatibility | 🟡 | 20 |
| Pages Router → App Router migration | ⛔ | Outside handbook scope |

## Phase 02 completion note

Phase 02 is complete for routing semantics: route-tree composition, pages/layouts/templates, dynamic segments and Promise-based params, route groups/private folders, special route files, parallel/intercepting routes, route-driven modals, trust boundaries, and routing design review.

## Phase 03 completion note

Phase 03 is complete for stable App Router navigation and URL-state semantics: `<Link>`, current 16.2 prefetching, programmatic/server navigation, route hooks, Promise-based page `searchParams`, URL-driven filtering/pagination, pending state, History API, Back/Forward, scroll/focus/accessibility, safe redirects, and navigation design review.

## Phase 04 completion note

Phase 04 is complete for stable Server/Client Component boundaries: Server Components by default, `'use client'`, module graphs, interleaving, serialization/DTOs, providers, server-started Promises, third-party/browser-only integration, environment isolation, and boundary performance/security/debugging.

## Phase 05 completion note

Phase 05 is complete for data-fetching architecture: async Server Components, direct database/ORM/SDK access, server `fetch`, HTTP/error validation, parallel/sequential dependency design, N+1/batching/fan-out, preload/Promise sharing, React `cache`, Suspense/`use()`, client fetching/live refresh, and data security/debugging.

## Phase 06 completion note

Phase 06 is complete for stable Next.js 16.2 caching/rendering/revalidation semantics because it teaches:

- the distinction between static rendering, dynamic rendering, React request memoisation, server caches, Client Router Cache, and CDN/HTTP caching
- current server `fetch` auto behavior, `no-store`, `force-cache`, `next.revalidate`, tags, and development HMR caveats
- the previous non-Cache-Components model and route segment `dynamic` / `revalidate` / `fetchCache`
- `cacheComponents: true` as the modern Next.js 16 opt-in model
- `'use cache'` scopes, keys, runtime-API restrictions, and cached component/function output
- `cacheLife` profiles and stale/revalidate/expire semantics
- `cacheTag`, modern two-argument `revalidateTag`, `updateTag`, and `revalidatePath`
- `connection()` for intentional request-time rendering and migration away from `unstable_noStore`
- `'use cache: remote'`, custom cache handlers, process-local vs distributed deployment behavior
- `'use cache: private'` explicitly labeled experimental and not recommended as the production default
- Cache Components partial prerendering, stable shells, dynamic holes, Suspense boundaries, and Client Router Cache interactions
- cache-key isolation, tenant scope, invalidation fan-out, read-your-own-write behavior, stampedes, invalidation storms, region divergence, metrics, and incident response
- architecture review for public CMS, SaaS, multi-tenant, search, inventory, migration, and multi-instance cache design

Deeper Server Function mutation workflows remain Phase 07; RSC/HTML streaming transport internals remain Phase 10; full security, observability, performance, and deployment operations remain Phases 13–17.

## Completion rule

The handbook is not complete until this contract is re-audited against the then-current stable Next.js docs and every stable in-scope item has a justified final state.

See [Final Completeness Audit](./final-completeness-audit.md) for the release gate.
