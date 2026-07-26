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
| Next.js 16.2 stable behavior | 🟠 | Baseline + routing/navigation + Server/Client boundaries + data-fetching behavior verified; later phases continue version-sensitive areas |
| Next.js 16.3 preview/canary | 🧪 | Track but do not teach as stable until promoted to npm `latest` |
| React 19.2 stable APIs | 🟠 | React handbook owns React depth; Next.js explains framework integration |
| React Canary exposed by App Router | 🟡 | Cover only when stable Next.js docs establish a supported contract |
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
| 06 · Caching, Rendering & Revalidation | 🟡 |
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
| Cache Components | 🟡 | Phase 06; preserve opt-in 16.2 semantics |
| Updating Data / Server Functions | 🟡 | Phase 07 |
| Caching and Revalidating | 🟡 | Phase 06 |
| Error Handling | 🟠 | Route/data boundary basics covered; deep Phase 14 |
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
| `loading.js/tsx` | ✅ | Route semantics 02; data/streaming use 05; deep streaming 10 |
| `error.js/tsx`, `global-error.js/tsx` | 🟠 | Boundary semantics covered; observability/recovery depth Phase 14 |
| `not-found.js/tsx` | ✅ | Phase 02 |
| `global-not-found.js/tsx` | 🧪 | Experimental; not taught as default production pattern |
| `default.js/tsx` | ✅ | Phase 02 parallel-route hard-load recovery |
| `route.js/ts` | 🟡 | Phase 08 |
| Dynamic / catch-all / optional catch-all segments | ✅ | Phase 02 |
| async route `params` | ✅ | Phase 02 current Promise contract |
| `generateStaticParams` | ✅ | Routing purpose Phase 02; rendering/cache depth Phase 06 |
| `dynamicParams` | 🟠 | Routing behavior introduced; deeper rendering semantics Phase 06 |
| Route Groups / Private Folders | ✅ | Phase 02 |
| Parallel Routes / implicit children slot | ✅ | Phase 02 |
| Intercepting Routes / route-driven modal | ✅ | Phase 02; history/accessibility integration Phase 03 |
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
| `router.refresh` | 🟠 | Navigation contract Phase 03; cache/mutation depth 06–07 |
| `router.prefetch` / `onInvalidate` | ✅ | Phase 03 |
| `usePathname`, `useSearchParams`, `useParams` | ✅ | Phase 03 |
| `useSelectedLayoutSegment(s)` | ✅ | Phase 03 |
| `useLinkStatus` | ✅ | Phase 03 |
| `redirect`, `permanentRedirect` | ✅ | Navigation semantics Phase 03; mutation/HTTP contexts later |
| safe redirect destinations | ✅ | Phase 03 baseline; auth/security depth Phase 13 |
| History API / Back / Forward / hash / scroll / focus | ✅ | Phase 03 |
| route-change observation | ✅ | Phase 03 |

## Server & Client Component Boundaries

| Concept / API | Status | Handbook location / plan |
| --- | --- | --- |
| Server Components default | ✅ | Phase 04 |
| Server Component vs Server Function distinction | ✅ | Phase 04; Server Function depth Phase 07 |
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
| RSC payload / hydration / subsequent-navigation internals | 🟠 | Mental models 04–05; deep 10 / 19 |

## Data Fetching

| Area | Status | Handbook location / plan |
| --- | --- | --- |
| Async Server Components | ✅ | Phase 05 |
| server data ownership | ✅ | Phase 05 |
| Server-side `fetch` | ✅ | Fetching/status/error semantics Phase 05; persistent cache/revalidation depth Phase 06 |
| Direct database / ORM access | ✅ | Phase 05 |
| server SDK/service access | ✅ | Phase 05 |
| avoid internal Route Handler hop from Server Component | ✅ | Phases 04–05; Route Handler depth Phase 08 |
| HTTP status handling (`response.ok`) | ✅ | Phase 05 |
| external response validation | ✅ | Phase 05 |
| data minimisation / DTO projection | ✅ | Phases 04–05 |
| Parallel fetching | ✅ | Phase 05 |
| Sequential fetching / dependency waterfalls | ✅ | Phase 05; broad perf depth Phase 15 |
| start-early / await-late pattern | ✅ | Phase 05 |
| N+1 / batching distinction | ✅ | Phase 05 |
| fan-out / pool / rate-limit considerations | ✅ | Phase 05 |
| Preloading pattern | ✅ | Phase 05 |
| Promise sharing | ✅ | Phase 05 |
| React `cache` for request/render memoisation | ✅ | Phase 05; persistent caching separation Phase 06 |
| deduplication vs batching | ✅ | Phase 05 |
| Client-side fetching | ✅ | Phase 05 |
| SWR/community client data libraries | ✅ | Phase 05 at architecture level |
| server snapshot + live client refresh | ✅ | Phase 05 |
| client polling/race/cancellation considerations | ✅ | Phase 05 |
| Streaming data with Suspense | ✅ | Data ownership/boundary semantics Phase 05; deep transport Phase 10 |
| server-started Promise consumed with `use()` | ✅ | Phases 04–05 |
| critical vs optional data boundaries | ✅ | Phase 05 |
| data failure taxonomy / graceful degradation | ✅ | Phase 05; broad error/observability Phase 14 |
| dev-vs-production fetch/HMR debugging | ✅ | Phase 05 current troubleshooting baseline |

## Caching, Rendering & Revalidation

This section is deliberately version-sensitive. Phase 5 teaches the boundary between fetching and caching; Phase 6 owns the full current cache model.

| Area / API | Status | Notes |
| --- | --- | --- |
| current default `fetch` caching behavior | 🟠 | Phase 05 warns against stale 13/14 assumptions; exact current model Phase 06 |
| static vs dynamic server rendering | 🟠 | Mental model introduced; deep 06 / 10 |
| request memoisation / deduplication | ✅ | Phase 05 React `cache` + duplicate-read model; fetch-specific internals clarified Phase 06 |
| React `cache` | ✅ | Request/render memoisation Phase 05; explicitly separate from persistent Next.js caches |
| `revalidatePath`, `revalidateTag`, `updateTag` | 🟡 | 06–07 |
| `refresh` from `next/cache` | 🟡 | 07 |
| `unstable_cache` | ⚠️ | Migration/history context only if current docs recommend replacement |
| route segment `revalidate` / `fetchCache` / `dynamic` | 🟡 | Current non-Cache-Components model Phase 06 |
| `cacheComponents` | 🟡 | Next.js 16 opt-in in 16.2 |
| `'use cache'`, `'use cache: private'`, `'use cache: remote'` | 🟡 | Phase 06 |
| `cacheLife`, `cacheTag`, cache handlers | 🟡 | Phase 06 / 17 |
| Partial prerendering via Cache Components | 🟡 | 06 / 10 |
| old standalone PPR/dynamicIO/useCache flags | ⚠️ | Migration context only |

## Request APIs

| API | Status | Planned phase |
| --- | --- | --- |
| `cookies()` | 🟡 | 06 / 09 / 13 |
| `headers()` | 🟡 | 06 / 09 |
| route `params` | ✅ | Phase 02 |
| page `searchParams` | ✅ | Phase 03 current Promise contract |
| `connection()` | 🟡 | 06 / rendering |
| Draft/preview mode APIs | 🟡 | Content architecture / request handling |

## Mutations & Server Functions

| API / area | Status | Planned phase |
| --- | --- | --- |
| Server Functions / Server Actions terminology | 🟡 | Phase 07 |
| `'use server'` | 🟠 | Phase 04 separates it from Server Components; deep 07 |
| form `action` | 🟡 | 07 |
| runtime validation / authorization | 🟠 | Trust model established; deep 07 / 13 |
| `useActionState`, `useFormStatus`, `useOptimistic` | 🟡 | 07 |
| redirect / revalidation after mutation | 🟠 | Redirect baseline 03; mutation sequence 07 |
| idempotency / duplicate submissions | 🟡 | 07 |

## Route Handlers & HTTP

| Area | Status | Planned phase |
| --- | --- | --- |
| HTTP methods in `route.ts` | 🟡 | 08 |
| Web `Request` / `Response`, `NextRequest` / `NextResponse` | 🟡 | 08–09 |
| cookies / headers / redirects | 🟡 | 08–09 |
| streaming/file responses / webhooks / CORS | 🟡 | 08 |
| rate limiting | 🟡 | 08 / 13 |
| Server Function vs Route Handler | 🟡 | 07–08 |
| direct server data access vs internal HTTP hop | ✅ | Phase 05; Route Handler decision depth Phase 08 |

## Proxy & Request Pipeline

| Area | Status | Planned phase |
| --- | --- | --- |
| `proxy.ts` naming | 🟠 | Current naming introduced; Phase 09 depth |
| Proxy function / matchers / request order | 🟡 | 09 |
| redirects / rewrites / headers | 🟡 | 09 |
| auth gating | 🟡 | 09 / 13 |
| authoritative authorization outside Proxy | ✅ | Trust model established Phases 02–05 |
| localization / tenancy | 🟡 | 09 / 18 |
| old `middleware.ts` convention | ⚠️ | Migration-only; renamed/deprecated in Next.js 16 |

## Rendering, Suspense & Navigation Delivery

| Area | Status | Planned phase |
| --- | --- | --- |
| server rendering pipeline / RSC payload / HTML generation / hydration | 🟠 | Mental models 04–05; deep Phase 10 |
| streaming | 🟠 | Data boundary/use covered Phase 05; transport depth Phase 10 |
| Suspense | 🟠 | Route/query/data boundaries covered; deep Phase 10 |
| `loading.tsx` | ✅ | Routing 02, navigation 03, data delivery 05 |
| soft vs hard App Router navigation | ✅ | Phases 02–03 |
| production `<Link>` prefetching / dynamic partial prefetch | ✅ | Phase 03 |
| partial route navigation / preserved layouts | ✅ | Phases 02–03; RSC mechanics later |
| data-level critical vs streamable UI | ✅ | Phase 05 |
| Cache Components partial prerendering | 🟡 | 06 / 10 |
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
| external response runtime validation | ✅ | Phase 05 |
| secret-bearing upstream access stays server-side | ✅ | Phase 05 |
| client cache / rendered permission flags not authorization | ✅ | Phases 04–05 baseline; deep 13 |
| untrusted Server Function arguments | 🟠 | 07 / 13 |
| CSRF | 🟡 | 13 |
| XSS / output safety | 🟠 | Navigation risk baseline; broad Phase 13 |
| secrets and `NEXT_PUBLIC_` | 🟠 | Boundary/data exposure model covered; deep Phase 13 |
| safe redirects | ✅ | Phase 03 baseline; auth depth 13 |
| CSP / security headers | 🟡 | 09 / 13 |
| uploads / webhooks | 🟡 | 08 / 13 |
| log redaction | 🟠 | Data-boundary rules Phase 05; deep 13 / 14 |
| cache isolation / user-data leaks | 🟡 | 06 / 13 |

## Errors, Observability & Debugging

| Area | Status | Planned phase |
| --- | --- | --- |
| route error boundary placement / missing-vs-unexpected distinction | ✅ | Phase 02 |
| navigation/boundary debugging | ✅ | Phases 03–04 |
| data failure taxonomy / timeout / invalid response distinction | ✅ | Phase 05 |
| slow-route dependency timeline / duplicate-read debugging | ✅ | Phase 05 |
| dev HMR vs production fetch behavior awareness | ✅ | Phase 05 |
| retry amplification awareness | ✅ | Phase 05 |
| structured logs / correlation IDs / OpenTelemetry / instrumentation | 🟠 | Baselines 05; full Phase 14 |
| source maps / release correlation | 🟡 | 14 |
| broad hydration/cache/build incident triage | 🟠 | Current cases covered; deep 14 / 19 |

## Performance

| Area | Status | Planned phase |
| --- | --- | --- |
| client JS / hydration cost | 🟠 | Phase 04; broad measurement 15 |
| server render latency | 🟠 | Phases 04–05; deep 15 |
| data/database waterfalls | ✅ | Phase 05; broader performance practice Phase 15 |
| N+1 / query count / connection-pool awareness | ✅ | Phase 05 |
| bounded concurrency / service fan-out | ✅ | Phase 05 |
| route-level streaming boundaries | 🟠 | Data delivery Phase 05; deep 10 / 15 |
| code splitting / dynamic imports | 🟠 | Phase 04; deep 15 |
| prefetching | 🟠 | Phase 03; measurement depth 15 |
| caching | 🟡 | 06 / 15 |
| performance budgets / measurement | 🟠 | Navigation, boundary, and data metrics introduced; deep 15 |

## Testing & Production

| Area | Status | Planned phase |
| --- | --- | --- |
| production build as route/boundary/data validation | ✅ | Phases 02–05 workflow |
| unit/component tests | 🟡 | 16 |
| Server/Client Component strategy | 🟠 | Architecture scenarios covered; automation Phase 16 |
| data-layer tests | 🟠 | Failure/contract cases specified Phase 05; automation Phase 16 |
| Route Handler / Server Function tests | 🟡 | 16 |
| Playwright E2E / accessibility automation | 🟡 | 16 |
| hard/soft navigation + Back/Forward E2E | 🟠 | Scenarios defined; implementation 16 |
| deployment smoke tests | 🟡 | 16 / 17 |

## Deployment & Operations

| Area | Status | Planned phase |
| --- | --- | --- |
| `next build` / `next start` | 🟠 | 01 / 17 |
| Node hosting / standalone / Docker / reverse proxy | 🟡 | 17 |
| environment configuration | 🟠 | 01 / 17 |
| adapters / serverless / Vercel / self-hosting | 🟡 | 17 |
| multi-instance cache/revalidation | 🟡 | 06 / 17 |
| rollback / health / graceful shutdown | 🟡 | 17 |
| CI/CD / preview environments | 🟡 | 17 |

## Architecture & Internals

| Area | Status | Planned phase |
| --- | --- | --- |
| route-tree / layout / URL-state ownership | ✅ | Phases 02–03 |
| server/client module-graph ownership | ✅ | Phase 04 |
| server shell + client islands | ✅ | Phase 04 |
| server/client/shared package boundaries | ✅ | Phase 04 |
| server data ownership decision model | ✅ | Phase 05 |
| direct server data vs HTTP boundary decision | ✅ | Phase 05 |
| dependency graph / critical-path review | ✅ | Phase 05 |
| server snapshot + live client pattern | ✅ | Phase 05 |
| feature/vertical-slice architecture | 🟠 | Examples Phases 02–05; deep 18 |
| monorepos/shared packages | 🟠 | Runtime boundary guidance Phase 04; deep 18 |
| design systems / BFF decisions | 🟠 | BFF/data boundary baseline Phase 05; deep 18 |
| multi-tenancy/permissions | 🟠 | Routing/component/data trust model established; deep 13 / 18 |
| RSC build/delivery internals | 🟠 | Mental model 04–05; deep 19 |
| Turbopack internals / public contract vs implementation detail | 🟡 | 19 |

## Upgrades & Migration

| Area | Status | Planned phase |
| --- | --- | --- |
| current App Router upgrade workflow / codemods | 🟠 | 01 / 20 |
| async `params` / page `searchParams` current contract | ✅ | Phases 02–03; migration depth 20 |
| `next/router` → App Router navigation APIs | 🟠 | Current contract Phase 03; migration 20 |
| client-heavy SPA → server-first boundary/data migration | 🟠 | Architecture methods 04–05; migration depth 20 |
| Proxy migration from `middleware.ts` | ⚠️ | 20 |
| caching-model migrations | 🟡 | 06 / 20 |
| Turbopack compatibility | 🟡 | 20 |
| Pages Router → App Router migration | ⛔ | Outside handbook scope |

## Phase 02 completion note

Phase 02 is complete for routing semantics: route-tree composition, pages/layouts/templates, dynamic segments and Promise-based params, route groups/private folders, special route files, parallel/intercepting routes, route-driven modals, trust boundaries, and routing design review.

## Phase 03 completion note

Phase 03 is complete for stable App Router navigation and URL-state semantics: `<Link>`, current 16.2 prefetching, programmatic/server navigation, route hooks, Promise-based page `searchParams`, URL-driven filtering/pagination, pending state, History API, Back/Forward, scroll/focus/accessibility, safe redirects, and navigation design review.

## Phase 04 completion note

Phase 04 is complete for stable Server/Client Component boundaries: Server Components by default, `'use client'`, module graphs, interleaving, serialization/DTOs, providers, server-started Promises, third-party/browser-only integration, environment isolation, and boundary performance/security/debugging.

## Phase 05 completion note

Phase 05 is complete for data-fetching architecture because it teaches:

- async Server Components and server data ownership
- direct database/ORM/SDK access
- server `fetch` status/error handling without importing stale cache assumptions
- avoiding unnecessary internal Route Handler hops
- response validation, DTO minimisation, and credential isolation
- parallel vs sequential fetching and dependency waterfalls
- N+1, batching, bounded fan-out, and connection/rate-limit considerations
- preload/start-early patterns
- request/render-scoped React `cache` and explicit separation from persistent Next.js caches
- Promise sharing, Suspense, streaming-data boundaries, and React `use()`
- client-side fetching, SWR/community cache patterns, polling/races, and server-snapshot + live-client architecture
- data failure taxonomy, timeout/retry/logging/security rules, dev-vs-production fetch troubleshooting
- dependency graphs, critical-path review, failure matrices, and senior data-architecture design review

Persistent Next.js cache semantics, Cache Components, revalidation, and rendering-mode depth remain deliberately assigned to Phase 06 and Phase 10.

## Completion rule

The handbook is not complete until this contract is re-audited against the then-current stable Next.js docs and every stable in-scope item has a justified final state.

See [Final Completeness Audit](./final-completeness-audit.md) for the release gate.
