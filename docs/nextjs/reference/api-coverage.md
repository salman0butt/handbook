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
| Next.js 16.2 stable behavior | 🟠 | Routing, navigation, RSC boundaries, data, cache, and mutation semantics verified; later phases cover remaining APIs/operations |
| Next.js 16.3 preview/canary | 🧪 | Track but do not teach as stable until promoted to npm `latest` |
| React 19.2 stable APIs | 🟠 | React handbook owns React depth; Next.js explains framework integration |
| React Canary exposed by App Router | 🟠 | Covered only where stable Next.js docs define a supported contract |
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
| 07 · Mutations, Forms & Server Functions | ✅ |
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
| Installation | ✅ | `01-foundations/*` |
| Project Structure | ✅ | `01-foundations/*` |
| Layouts and Pages | ✅ | `02-app-router-and-layouts/*` |
| Linking and Navigating | ✅ | `03-navigation-and-url-state/*` |
| Server and Client Components | ✅ | `04-server-and-client-components/*` |
| Fetching Data | ✅ | `05-data-fetching/*` |
| Cache Components | ✅ | `06-caching-rendering-and-revalidation/*` |
| Caching and Revalidating | ✅ | `06-caching-rendering-and-revalidation/*` |
| Mutating/Updating Data / Server Functions | ✅ | `07-mutations-forms-and-server-functions/*` |
| Error Handling | 🟠 | Route/data/cache/action expected-error models covered; deep Phase 14 |
| CSS / styling integration | 🟡 | Framework behavior only |
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
| `loading.js/tsx` | ✅ | Phases 02–06; transport depth Phase 10 |
| `error.js/tsx`, `global-error.js/tsx` | 🟠 | Boundary semantics covered; deep Phase 14 |
| `not-found.js/tsx` | ✅ | Phase 02 |
| `global-not-found.js/tsx` | 🧪 | Experimental |
| `default.js/tsx` | ✅ | Phase 02 |
| `route.js/ts` | 🟡 | Phase 08 |
| Dynamic/catch-all/optional catch-all segments | ✅ | Phase 02 |
| async `params` | ✅ | Phase 02 |
| `generateStaticParams`, `dynamicParams` | ✅ | Routing 02; rendering/cache interaction 06 |
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
| `<Link>` + `href`, `replace`, `scroll`, `prefetch` | ✅ | Phase 03 |
| `<Link onNavigate>` | ✅ | Phase 03 |
| `<Link transitionTypes>` | ✅ | Stable 16.2 prop; broader integration experimental |
| `useRouter` + push/replace/back/forward | ✅ | Phase 03 |
| `router.refresh` | ✅ | Navigation 03; refresh-vs-invalidation mutation semantics 07 |
| `router.prefetch` / `onInvalidate` | ✅ | Phase 03 |
| `usePathname`, `useSearchParams`, `useParams` | ✅ | Phase 03 |
| `useSelectedLayoutSegment(s)` | ✅ | Phase 03 |
| `useLinkStatus` | ✅ | Phase 03 |
| `redirect`, `permanentRedirect` | ✅ | Navigation 03; redirect-after-mutation ordering 07 |
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
| RSC payload / hydration / subsequent-navigation internals | 🟠 | Mental models 04–07; deep 10 / 19 |

## Data Fetching

| Area | Status | Handbook location / plan |
| --- | --- | --- |
| Async Server Components | ✅ | Phase 05 |
| server data ownership | ✅ | Phase 05 |
| Server-side `fetch` | ✅ | Fetching 05; cache semantics 06 |
| Direct database / ORM / SDK access | ✅ | Phase 05 |
| avoid internal Route Handler hop | ✅ | Phases 04–05; Route Handler depth 08 |
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
| development Server Components HMR fetch cache | ✅ | Phases 05–06 |
| static vs dynamic server rendering | ✅ | Phase 06; delivery internals 10 |
| React `cache` vs persistent Next.js caching | ✅ | Phases 05–06 |
| Cache Components (`cacheComponents: true`) | ✅ | Phase 06; opt-in in stable 16.2 |
| `'use cache'` | ✅ | Phase 06 |
| cache-key / closed-over-value behavior | ✅ | Phase 06 |
| `cacheLife`, `cacheTag` | ✅ | Phase 06 |
| `revalidateTag(tag, profile)` | ✅ | Phase 06; mutation use 07 |
| single-argument `revalidateTag(tag)` | ⚠️ | Deprecated |
| `updateTag` | ✅ | Cache semantics 06; read-your-own-write action workflow 07 |
| `revalidatePath` | ✅ | Cache semantics 06; mutation ordering 07 |
| `refresh` from `next/cache` | ✅ | Phase 07; Server Action only |
| previous-model route `revalidate` / `fetchCache` / `dynamic` | ✅ | Phase 06; disabled under Cache Components |
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
| `cookies()` read semantics | 🟠 | Request/cache boundary 06; request pipeline/auth depth 09 / 13 |
| `cookies()` set/delete in Server Actions | ✅ | Phase 07 mutation/UI rerender semantics |
| `headers()` | 🟠 | Request/cache boundary 06; request pipeline depth 09 |
| route `params` | ✅ | Phase 02 |
| page `searchParams` | ✅ | Phase 03 |
| `connection()` | ✅ | Phase 06 |
| Draft/preview mode APIs | 🟡 | Later content/request handling |

## Mutations, Forms & Server Functions

| API / area | Status | Handbook location / plan |
| --- | --- | --- |
| Server Functions / Server Actions terminology | ✅ | Phase 07 |
| Server Function vs Server Component distinction | ✅ | Phases 04 / 07 |
| `'use server'` inline | ✅ | Phase 07 |
| module-level `'use server'` | ✅ | Phase 07 |
| importing Server Functions into Client Components | ✅ | Phase 07 |
| passing Server Functions as props | ✅ | Phase 07 |
| Server Actions use POST | ✅ | Phase 07 |
| form `action` | ✅ | Phase 07 |
| submitter `formAction` | ✅ | Phase 07 |
| `FormData` parsing / `Object.fromEntries` caveat | ✅ | Phase 07 |
| extra arguments with `bind` | ✅ | Phase 07 |
| progressive enhancement | ✅ | Phase 07 |
| `next/form` mutation-vs-navigation distinction | ✅ | Phase 07 |
| nested/multiple action form intents | ✅ | Phase 07 |
| programmatic `requestSubmit()` | ✅ | Phase 07 |
| runtime validation | ✅ | Phase 07; broader security Phase 13 |
| authentication inside action | ✅ | Phase 07 baseline; auth architecture 13 |
| resource/tenant authorization inside action | ✅ | Phase 07 baseline; deep 13 |
| untrusted Server Function arguments | ✅ | Phase 07 |
| mass-assignment / field whitelisting | ✅ | Phase 07 |
| `serverActions.allowedOrigins` / same-origin model | ✅ | Phase 07 baseline; CSRF depth 13 |
| default Server Action body size limit / `bodySizeLimit` | ✅ | Phase 07 |
| file input / action upload architecture | ✅ | Phase 07 baseline; upload/HTTP/security depth 08 / 13 |
| `useActionState` | ✅ | Phase 07 |
| `useFormStatus` | ✅ | Phase 07 |
| `useOptimistic` | ✅ | Phase 07 |
| pending-state / expected-error modeling | ✅ | Phase 07 |
| optimistic rollback/reconciliation | ✅ | Phase 07 |
| mutation concurrency / lost updates | ✅ | Phase 07 |
| `refresh()` after mutation | ✅ | Phase 07 |
| redirect after mutation / control-flow ordering | ✅ | Phase 07 |
| cookie writes after mutation | ✅ | Phase 07 |
| tag/path invalidation after mutation | ✅ | Phase 07 |
| idempotency / duplicate submissions | ✅ | Phase 07 |
| DB transactions / unique constraints / state-machine guards | ✅ | Phase 07 |
| external side effects / outbox / retries | ✅ | Phase 07 architecture |
| Server Function vs Route Handler decision | 🟠 | Server Function side complete 07; HTTP side Phase 08 |
| Server Function testing automation | 🟡 | Phase 16 |

## Route Handlers & HTTP

| Area | Status | Planned phase |
| --- | --- | --- |
| HTTP methods in `route.ts` | 🟡 | 08 |
| Web `Request` / `Response`, `NextRequest` / `NextResponse` | 🟡 | 08–09 |
| cookies / headers / redirects | 🟡 | 08–09 |
| streaming/file responses | 🟡 | 08 |
| webhooks | 🟠 | Invalidation/action boundary concepts exist; full 08 / 13 |
| CORS / HTTP rate limiting | 🟡 | 08 / 13 |
| Server Function vs Route Handler | 🟠 | Action side 07; HTTP side 08 |
| direct server data access vs internal HTTP hop | ✅ | Phase 05 |

## Proxy & Request Pipeline

| Area | Status | Planned phase |
| --- | --- | --- |
| `proxy.ts` naming | 🟠 | Phase 09 |
| Proxy function / matchers / request order | 🟡 | 09 |
| redirects / rewrites / headers | 🟡 | 09 |
| auth gating | 🟡 | 09 / 13 |
| authoritative authorization outside Proxy | ✅ | Trust/action models established |
| localization / tenancy | 🟡 | 09 / 18 |
| old `middleware.ts` convention | ⚠️ | Migration-only in Next.js 16 |

## Rendering, Suspense & Navigation Delivery

| Area | Status | Planned phase |
| --- | --- | --- |
| server rendering pipeline / RSC payload / HTML / hydration | 🟠 | Mental models 04–07; deep 10 |
| streaming / Suspense | 🟠 | Data/cache/action boundaries covered; transport depth 10 |
| `loading.tsx` | ✅ | Phases 02–06 |
| soft vs hard navigation | ✅ | Phases 02–03 |
| production `<Link>` prefetching | ✅ | Phase 03 |
| Cache Components partial prerendering | ✅ | Phase 06; mechanics 10 |
| action response can carry updated RSC UI/data | ✅ | Phase 07 framework mutation model |
| Next.js 16.3 Instant Navigations | 🧪 | Preview-only at baseline |

## Security

| Area | Status | Planned phase |
| --- | --- | --- |
| authentication vs authorization distinction | ✅ | Phase 07 mutation boundary baseline; full architecture Phase 13 |
| route/query/navigation inputs untrusted | ✅ | Phases 02–03 |
| Server Function arguments/FormData untrusted | ✅ | Phase 07 |
| server/client DTO minimisation | ✅ | Phases 04–05 |
| `server-only` / environment poisoning | ✅ | Phase 04 |
| scoped tenant/resource data queries | ✅ | Phases 05 / 07 baseline; deep 13 / 18 |
| cache key isolation / shared-cache auth caveats | ✅ | Phase 06 baseline; deep 13 |
| action resource authorization | ✅ | Phase 07 baseline; policy architecture 13 |
| action same-origin / `allowedOrigins` CSRF mitigation | ✅ | Phase 07 baseline; CSRF depth 13 |
| mass assignment / overposting | ✅ | Phase 07 |
| safe action error serialization / log redaction | ✅ | Phase 07 baseline; deep 13–14 |
| action abuse/rate-limit architecture | 🟠 | Phase 07 high-risk baseline; HTTP/security depth 08 / 13 |
| CSP / security headers | 🟡 | 09 / 13 |
| XSS / output safety | 🟠 | Navigation baseline; broad 13 |
| secrets / `NEXT_PUBLIC_` | 🟠 | Boundary exposure covered; deep 13 |
| uploads / webhooks | 🟠 | Action upload baseline 07; full 08 / 13 |

## Errors, Observability & Debugging

| Area | Status | Planned phase |
| --- | --- | --- |
| route error boundary placement | ✅ | Phase 02 |
| expected mutation errors vs exceptions | ✅ | Phase 07 |
| action pending/error UX | ✅ | Phase 07 |
| redirect swallowed by `try/catch` debugging | ✅ | Phase 07 |
| stale UI after mutation diagnosis | ✅ | Phases 06–07 |
| duplicate action / idempotency incident model | ✅ | Phase 07 |
| mutation latency decomposition | ✅ | Phase 07 baseline; perf/observability depth 14–15 |
| structured logs / correlation IDs / OpenTelemetry / instrumentation | 🟠 | Baselines 05–07; full 14 |
| source maps / release correlation | 🟡 | 14 |

## Performance

| Area | Status | Planned phase |
| --- | --- | --- |
| client JS / hydration cost | 🟠 | Phase 04; deep 15 |
| server render/data/cache latency | 🟠 | Phases 04–06; deep 15 |
| mutation latency stages | ✅ | Phase 07 baseline; broad performance 15 |
| mutation waterfalls | ✅ | Phase 07 architecture |
| durable side effects outside critical request | ✅ | Phase 07 architecture; ops depth 17 |
| caching architecture / stampede avoidance | ✅ | Phase 06 |
| performance budgets / measurement | 🟠 | Multiple baselines; deep 15 |

## Testing & Production

| Area | Status | Planned phase |
| --- | --- | --- |
| production build validation | ✅ | Phases 02–07 workflow |
| unit/component tests | 🟡 | 16 |
| Server/Client Component strategy | 🟠 | Architecture scenarios covered; automation 16 |
| data/cache tests | 🟠 | Failure/isolation scenarios defined; automation 16 |
| Server Function tests | 🟠 | Test matrix/failure modes Phase 07; automation 16 |
| Route Handler tests | 🟡 | 16 |
| Playwright E2E / accessibility automation | 🟡 | 16 |
| action progressive-enhancement E2E | 🟠 | Behaviour specified Phase 07; automation 16 |
| duplicate/idempotency/concurrency tests | 🟠 | Cases specified Phase 07; automation 16 |
| deployment smoke tests | 🟡 | 16 / 17 |

## Deployment & Operations

| Area | Status | Planned phase |
| --- | --- | --- |
| `next build` / `next start` | 🟠 | 01 / 17 |
| Node hosting / standalone / Docker / reverse proxy | 🟡 | 17 |
| environment configuration | 🟠 | 01 / 17 |
| adapters / serverless / Vercel / self-hosting | 🟠 | Cache/action implications introduced; full 17 |
| local vs remote cache handlers | ✅ | Phase 06 architecture; ops depth 17 |
| multi-instance cache/revalidation | 🟠 | Phase 06; ops depth 17 |
| Server Action origin/proxy configuration | 🟠 | Phase 07 baseline; deployment/security depth 17 / 13 |
| queues / outbox / durable side effects | 🟠 | Mutation architecture Phase 07; production ops 17 |
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
| thin action + server-only domain command pattern | ✅ | Phase 07 |
| explicit domain actions vs generic update APIs | ✅ | Phase 07 |
| transaction/idempotency/side-effect architecture | ✅ | Phase 07 |
| feature/vertical-slice architecture | 🟠 | Examples 02–07; deep 18 |
| monorepos/shared packages | 🟠 | Runtime boundaries 04; deep 18 |
| design systems / BFF decisions | 🟠 | Deep 18 |
| multi-tenancy/permissions | 🟠 | Strong trust model established; deep 13 / 18 |
| RSC build/delivery internals | 🟠 | Mental models 04–07; deep 19 |
| Turbopack internals / public contract vs implementation detail | 🟡 | 19 |

## Upgrades & Migration

| Area | Status | Planned phase |
| --- | --- | --- |
| current App Router upgrade workflow / codemods | 🟠 | 01 / 20 |
| async `params` / `searchParams` current contract | ✅ | Phases 02–03 |
| `next/router` → App Router navigation APIs | 🟠 | Phase 03; migration 20 |
| client-heavy SPA → server-first data/action migration | 🟠 | Phases 04–07; migration depth 20 |
| previous cache model → Cache Components | 🟠 | Phase 06; full upgrade playbook 20 |
| `unstable_cache` / old PPR / dynamicIO migration | ⚠️ | Migration-only |
| Server Actions stable-by-default historical enable flag | ⚠️ | Historical only; stable since Next.js 14 |
| Proxy migration from `middleware.ts` | ⚠️ | 20 |
| Turbopack compatibility | 🟡 | 20 |
| Pages Router → App Router migration | ⛔ | Outside scope |

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

Phase 07 is complete for stable mutation/form/Server Function semantics because it teaches:

- Server Function vs Server Action terminology and `use server` placement
- module-level actions imported by Client Components and Server Function props
- forms, `FormData`, `bind`, `formAction`, `requestSubmit`, progressive enhancement, and `next/form` distinctions
- runtime validation, authentication, resource/tenant authorization, mass-assignment prevention, and action argument trust boundaries
- same-origin/`allowedOrigins` and body-size/upload considerations
- `useActionState`, `useFormStatus`, expected errors, pending state, and accessible form feedback
- `useOptimistic`, rollback/reconciliation, lost-update and mutation concurrency models
- `updateTag`, `revalidateTag`, `revalidatePath`, `refresh`, cookie writes, and redirect ordering after mutations
- idempotency, duplicate requests, unique constraints, transactions, state-machine guards, outbox/durable side effects, and retry safety
- Server Function vs internal server helper vs Route Handler ownership
- production action debugging, mutation latency decomposition, security review, and senior mutation architecture design

Full HTTP Route Handler semantics remain Phase 08; complete request-pipeline/auth security, observability, performance, testing, and deployment operations remain Phases 09 and 13–17.

## Completion rule

The handbook is not complete until this contract is re-audited against the then-current stable Next.js docs and every stable in-scope item has a justified final state.

See [Final Completeness Audit](./final-completeness-audit.md) for the release gate.
