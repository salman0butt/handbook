---
title: API Coverage Contract
description: Final coverage map from the current stable Next.js App Router documentation to this handbook.
---

# Next.js App Router API Coverage Contract

This is the handbook's completeness contract against the **current stable Next.js App Router documentation**.

**Final re-audit: July 29, 2026 — Next.js 16.2.12 (`latest`, 16.x Active LTS).**

At this snapshot, npm still reports **16.2.12** as `latest`, **15.5.22** as the backport line, and **16.3.0-preview.9 / 16.3.0-canary.97** as preview/canary rather than stable. Preview/canary behavior is never silently promoted into the production baseline.

## Status legend

| Status | Meaning |
| --- | --- |
| ✅ | Covered to handbook quality bar |
| ⚠️ | Deprecated / migration-only behavior |
| 🧪 | Experimental, preview, canary, or stability-sensitive |
| ⛔ | Intentionally outside this handbook |

## Scope contract

| Area | Status | Notes |
| --- | --- | --- |
| App Router | ✅ | Primary and only router taught |
| Pages Router | ⛔ | Excluded except migration/history comparison in Phase 20 |
| Next.js 16.2 stable behavior | ✅ | Stable in-scope framework surface covered through Phases 00–24 |
| Next.js 16.3 preview/canary | 🧪 | Tracked only as non-stable context |
| React 19.2 stable integration | ✅ | Next-specific integration covered; React handbook owns general React depth |
| React Canary exposed by App Router | ✅ | Covered only where stable Next.js documents a supported framework contract |
| React low-level RSC bundler/framework interfaces | 🧪 | Version-sensitive framework integration, not application APIs |
| Managed-host/platform behavior | ✅ | Covered when relevant and clearly separated from Next.js core |

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
| 20 · Upgrades & Modern Migration | ✅ |
| 21 · Projects | ✅ |
| 22 · Interview Mastery | ✅ |
| 23 · Interview Question Bank | ✅ |
| 24 · Mock Interview Practice | ✅ |

## Routing & App Router conventions

| Area | Status | Location |
| --- | --- | --- |
| `app` route tree, pages, layouts, templates | ✅ | Phases 01–02 |
| route groups, private folders, multiple roots | ✅ | Phase 02; architecture depth 18 |
| dynamic/catch-all/optional catch-all segments | ✅ | Phase 02 |
| async `params` / page `searchParams` model | ✅ | Phases 02–03; migration 20 |
| `generateStaticParams`, `dynamicParams` | ✅ | Phases 02 / 06 / 08 |
| `loading`, `error`, `global-error`, `not-found`, `default` | ✅ | Phases 02 / 10 / 14 |
| `global-not-found` | 🧪 | Experimental at final baseline |
| parallel and intercepting routes | ✅ | Phase 02; browser tests 16; internals 19 |
| `<Link>`, prefetching, native History API | ✅ | Phase 03; performance 15; internals 19 |
| `useRouter`, `usePathname`, `useSearchParams`, `useParams` | ✅ | Phase 03 |
| selected layout segment hooks / `useLinkStatus` | ✅ | Phase 03 |
| hard vs soft navigation / route reconciliation | ✅ | Phases 10 / 19 |

## Server Components, RSC & rendering

| Area | Status | Location |
| --- | --- | --- |
| Server Components by default | ✅ | Phase 04 |
| `'use client'` module boundary | ✅ | Phase 04; performance 15; internals 19 |
| composition, children, serializable props | ✅ | Phase 04 |
| providers/context placement | ✅ | Phase 04 |
| `server-only` / `client-only` | ✅ | Phase 04; security 13 |
| RSC payload, initial HTML, hydration | ✅ | Phase 10; internals 19 |
| Client Components prerender + hydrate | ✅ | Phases 10 / 19 |
| Suspense / `loading.tsx` / progressive streaming | ✅ | Phase 10 |
| Cache Components static shell + request-time holes | ✅ | Phases 06 / 10 / 19 |
| private Flight wire encoding / request headers | ⛔ | Explicitly excluded as application APIs |
| React RSC bundler interfaces | 🧪 | Framework-level/version-sensitive only |

## Data fetching & data architecture

| Area | Status | Location |
| --- | --- | --- |
| async Server Component reads | ✅ | Phase 05 |
| server `fetch` current semantics | ✅ | Phases 05–06 |
| direct DB/ORM/SDK reads | ✅ | Phase 05 |
| avoid own Route Handler hop for RSC reads | ✅ | Phases 05 / 08 / 18 |
| parallel/sequential work, waterfalls, N+1, batching | ✅ | Phase 05; performance 15 |
| preload / React `cache` | ✅ | Phase 05; internals distinction 19 |
| schema/status validation, timeout/retry | ✅ | Phase 05 |
| secure DAL / DTO projection | ✅ | Phase 13; architecture 18 |
| tenant/resource-scoped access / IDOR prevention | ✅ | Phase 13; testing 16 |
| query/command/provider-adapter architecture | ✅ | Phase 18 |

## Caching & revalidation

| Area / API | Status | Location |
| --- | --- | --- |
| `cache: 'no-store'`, `cache: 'force-cache'` | ✅ | Phase 06 |
| `next.revalidate`, `next.tags` | ✅ | Phase 06 |
| Cache Components / `'use cache'` | ✅ | Phase 06 |
| `cacheLife`, `cacheTag` | ✅ | Phase 06 |
| `revalidateTag`, `updateTag`, `revalidatePath`, `refresh` | ✅ | Phases 06–07 |
| `connection()` | ✅ | Phase 06; internals 19 |
| `'use cache: remote'` | ✅ | Phase 06 |
| `'use cache: private'` | 🧪 | Specialized/stability-sensitive at final baseline |
| Client Router Cache | ✅ | Phases 06 / 19 |
| multi-instance `cacheHandler` / `cacheHandlers` | ✅ | Phase 17 |
| cache identity, freshness, invalidation, tenant safety | ✅ | Phases 06 / 13 / 18–20 |
| old standalone PPR/dynamicIO/useCache flags | ⚠️ | Migration-only; current Cache Components model taught |

## Mutations, forms & Server Functions

| Area | Status | Location |
| --- | --- | --- |
| Server Function / Server Action terminology | ✅ | Phase 07 |
| `'use server'` | ✅ | Phase 07; internals 19 |
| FormData / progressive enhancement | ✅ | Phase 07 |
| `useActionState`, `useFormStatus`, `useOptimistic` | ✅ | Phase 07 |
| validation, authentication, authorization, CSRF | ✅ | Phases 07 / 13 |
| expected errors / optimistic rollback / concurrency | ✅ | Phases 07 / 14 |
| transactions, idempotency, outbox | ✅ | Phases 07 / 17 / 18 |
| closure encryption / multi-instance key consistency | ✅ | Phases 13 / 17 / 19 |
| generated Action references / private transport | 🧪 | Internals only; not application contract |
| current client Action dispatch implementation | 🧪 | Explicitly not used as correctness guarantee |

## Route Handlers & HTTP

| Area | Status | Location |
| --- | --- | --- |
| methods / 405 / OPTIONS | ✅ | Phase 08 |
| Web Request / Response / NextRequest / NextResponse | ✅ | Phase 08 |
| content type, body parsing, one-read body | ✅ | Phase 08 |
| files, downloads, streaming | ✅ | Phase 08 |
| current GET/cache behavior | ✅ | Phase 08; migration 20 |
| CORS, CSRF, auth | ✅ | Phases 08 / 13 |
| webhooks, signatures, replay, callbacks | ✅ | Phases 08 / 13 / 16 |
| rate limits / bounded resource work | ✅ | Phases 08 / 13 / 17 |
| BFF/API vs in-process server call decision | ✅ | Phases 08 / 18 |
| old GET-cached-by-default assumptions | ⚠️ | Historical migration context only |

## Proxy & request pipeline

| Area | Status | Location |
| --- | --- | --- |
| `proxy.ts`, execution order, matchers | ✅ | Phase 09; internals 19 |
| `has` / `missing` / prefetch filters | ✅ | Phase 09 |
| `NextResponse.next`, headers, cookies | ✅ | Phase 09 |
| redirects, rewrites, localization, tenancy | ✅ | Phase 09 |
| optimistic auth gating, not sole authorization | ✅ | Phases 09 / 13 |
| `waitUntil` lifecycle / non-durable distinction | ✅ | Phases 09 / 17 |
| current Node runtime behavior | ✅ | Phase 19 |
| Proxy experimental test helpers | 🧪 | Phase 16 |
| `middleware.ts` → `proxy.ts` | ⚠️ | Deep migration Phase 20 |
| static-export Proxy | ⛔ | Unsupported by static export |

## Metadata, images, fonts & scripts

| Area | Status | Location |
| --- | --- | --- |
| static `metadata` / `generateMetadata` | ✅ | Phase 11 |
| titles, `metadataBase`, canonicals, alternates | ✅ | Phase 11 |
| Open Graph/Twitter/generated images | ✅ | Phase 11 |
| icons / manifest / robots / sitemaps | ✅ | Phase 11 |
| JSON-LD and script-context XSS safety | ✅ | Phase 11 |
| `viewport` / `generateViewport` | ✅ | Phase 11 |
| `next/image` responsive/security/cache model | ✅ | Phase 12 |
| image `preload` | ✅ | Current Next.js 16 model |
| Image `priority` | ⚠️ | Deprecated in Next.js 16 |
| `remotePatterns`, `localPatterns`, quality/security controls | ✅ | Phase 12 |
| old `images.domains`, legacy image APIs | ⚠️ | Migration-only Phase 20 |
| `next/font` Google/local/variables/fallbacks | ✅ | Phase 12 |
| `next/script` strategies and lifecycle | ✅ | Phase 12 |
| `@next/third-parties` | 🧪 | Still experimental at final re-audit |

## Authentication, authorization & security

| Area | Status | Location |
| --- | --- | --- |
| auth vs session vs authorization | ✅ | Phase 13 |
| password / OAuth/OIDC / recovery / MFA | ✅ | Phase 13 |
| stateless and database sessions | ✅ | Phase 13 |
| secure cookies, renewal, rotation, revocation | ✅ | Phase 13 |
| RBAC/resource/relationship/tenant authorization | ✅ | Phase 13 |
| CSRF, XSS, CSP, secrets | ✅ | Phase 13 |
| SSRF, uploads, active SVG, webhooks, abuse controls | ✅ | Phase 13 |
| API-key lifecycle | ✅ | Phase 13 |
| threat modeling and audit events | ✅ | Phase 13 |
| security regression matrix | ✅ | Phase 16 |
| production secret injection / access / supply chain | ✅ | Phase 17 |
| multi-tenant system architecture | ✅ | Phase 18 |
| `unauthorized`, `forbidden`, `authInterrupts` | 🧪 | Experimental/non-baseline at final snapshot |
| React taint APIs | 🧪 | Defense-in-depth only |

## Errors, observability & debugging

| Area | Status | Location |
| --- | --- | --- |
| expected vs uncaught vs framework control-flow failures | ✅ | Phase 14 |
| `error.tsx`, `global-error.tsx`, `reset()` | ✅ | Phase 14 |
| production error sanitization / digest | ✅ | Phase 14 |
| `notFound`, redirects, streamed status caveats | ✅ | Phase 14 |
| `instrumentation.ts`, `register`, `onRequestError` | ✅ | Phase 14 |
| `instrumentation-client.ts` | ✅ | Phase 14 |
| OpenTelemetry logs/traces/metrics/sampling | ✅ | Phase 14 |
| source maps / CLI / inspector / incident workflows | ✅ | Phase 14 |
| SLI/SLO/error budgets/runbooks | ✅ | Phase 14 |
| unstable error helpers | 🧪 | Never baseline |

## Performance

| Area | Status | Location |
| --- | --- | --- |
| measurement-first optimization | ✅ | Phase 15 |
| Core Web Vitals LCP/INP/CLS / p75 | ✅ | Phase 15 |
| `useReportWebVitals` | ✅ | Phases 14–15 |
| RSC/server dependency waterfalls and payloads | ✅ | Phase 15 |
| client JS boundaries / `next/dynamic` / demand imports | ✅ | Phase 15 |
| stable React Compiler integration | ✅ | Phase 15 |
| hydration/main-thread/INP/DOM/memory | ✅ | Phase 15 |
| image/font/script/network critical path | ✅ | Phase 15 |
| DB pools, tail latency, cold starts, capacity, backpressure | ✅ | Phase 15; operations 17 |
| profiling / release regression / budgets | ✅ | Phases 15–16 |
| experimental Web Vitals attribution / Turbopack analysis / inline CSS / optimize imports | 🧪 | Explicitly labelled experimental |

## Testing

| Area | Status | Location |
| --- | --- | --- |
| risk-driven test portfolio | ✅ | Phase 16 |
| Vitest / Jest / `next/jest` / React Testing Library | ✅ | Phase 16 |
| async Server Component E2E strategy | ✅ | Phase 16 |
| DAL/cache/revalidation tests | ✅ | Phase 16 |
| Server Action / Route Handler contracts | ✅ | Phase 16 |
| auth/tenant/security negatives | ✅ | Phase 16 |
| Suspense/streaming/navigation/hydration browser tests | ✅ | Phase 16 |
| Playwright / Cypress production-build E2E | ✅ | Phase 16 |
| accessibility / keyboard regression | ✅ | Phase 16 |
| fixtures/factories/time/randomness/test doubles | ✅ | Phase 16 |
| flake control / sharding / CI artifacts | ✅ | Phase 16 |
| performance/security release gates | ✅ | Phase 16 |
| `next/experimental/testing/server` / Proxy helpers | 🧪 | Experimental |
| `@next/playwright` | 🧪 | Still experimental and requires Cache Components at final re-audit |

## Deployment & production operations

| Area | Status | Location |
| --- | --- | --- |
| `next build` / `next start` lifecycle | ✅ | Phase 17; internals 19 |
| Turbopack default build/dev model | ✅ | Phase 19 |
| Output File Tracing / `output: 'standalone'` | ✅ | Phases 17 / 19 |
| Docker / immutable artifacts / read-only filesystem | ✅ | Phase 17 |
| self-hosting / reverse proxy / forwarding / streaming | ✅ | Phase 17 |
| graceful SIGTERM/SIGINT shutdown / `after()` draining | ✅ | Phase 17 |
| build-time vs runtime env / `NEXT_PUBLIC_` | ✅ | Phase 17 |
| distributed cache coordination | ✅ | Phase 17 |
| `generateBuildId` / `deploymentId` | ✅ | Phase 17 |
| Server Action multi-replica/version-skew operations | ✅ | Phase 17 |
| liveness/readiness/autoscaling/DB pools | ✅ | Phase 17 |
| queues/workers/DLQ/outbox/schedules | ✅ | Phase 17 |
| CI/CD, DB migrations, canary/blue-green, rollback | ✅ | Phase 17 |
| static export / unsupported runtime feature matrix | ✅ | Phase 17 |
| Adapter API / stable top-level `adapterPath` | ✅ | Phase 17 |
| custom server escape hatch | ✅ | Phase 19 |
| private `.next` schema / `next/dist` coupling | ⛔ | Explicitly excluded |

## Architecture & large applications

| Area | Status | Location |
| --- | --- | --- |
| capability / vertical-slice ownership | ✅ | Phase 18 |
| safe App Router colocation | ✅ | Phase 18 |
| route composition roots / dependency direction | ✅ | Phase 18 |
| DAL / DTO / command / policy boundaries | ✅ | Phase 18 |
| monorepos / package exports / server-client entry points | ✅ | Phase 18 |
| `transpilePackages` / `serverExternalPackages` context | ✅ | Phases 15 / 18 / 19 |
| design-system and shared package governance | ✅ | Phase 18 |
| multi-tenancy across routing/data/cache/jobs/storage/events | ✅ | Phase 18 |
| BFF / APIs / provider adapters / service extraction | ✅ | Phase 18 |
| feature flags vs entitlements vs permissions | ✅ | Phase 18 |
| events/jobs/workflows and compatibility | ✅ | Phase 18 |
| Multi-Zones path/assets/navigation/auth trade-offs | ✅ | Phase 18 |
| ADRs / fitness functions / golden paths / ownership matrices | ✅ | Phase 18 |

## Internals & senior mental models

| Area | Status | Location |
| --- | --- | --- |
| public contract vs private implementation evidence | ✅ | Phase 19 |
| RSC/Flight conceptual model | ✅ | Phase 19 |
| server/client graph partitioning and references | ✅ | Phase 19 |
| Turbopack build pipeline / route compilation | ✅ | Phase 19 |
| build manifests as private compiler metadata | ✅ | Phase 19 |
| prerender/static shell/request-hole execution | ✅ | Phase 19 |
| Router Cache / prefetch / route-tree reconciliation | ✅ | Phase 19 |
| Server Function references/serialization/encryption/skew | ✅ | Phase 19 |
| end-to-end request/stream lifecycle | ✅ | Phase 19 |
| Node/Edge/process/package boundaries | ✅ | Phase 19 |
| exact-version source inspection/evidence ladder | ✅ | Phase 19 |
| private Flight parsing / private headers / manual Action transport | ⛔ | Explicitly excluded |

## Upgrades & modern migration

| Area | Status | Location |
| --- | --- | --- |
| support policy / release channels / upgrade risk | ✅ | Phase 20 |
| `next upgrade` (16.1+) | ✅ | Phase 20 |
| `@next/codemod` upgrade flow | ✅ | Phase 20 |
| async request API migration | ✅ | Phase 20 |
| React 19/typegen/types migration | ✅ | Phase 20 |
| `middleware.ts` → `proxy.ts` | ⚠️ | Fully taught as migration path Phase 20 |
| `next lint` removal / direct linter migration | ⚠️ | Fully taught Phase 20 |
| `serverRuntimeConfig` / `publicRuntimeConfig` removal | ⚠️ | Fully taught Phase 20 |
| Webpack customizations → Turbopack/default build model | ✅ | Phase 20 |
| previous cache model → Cache Components | ✅ | Phase 20 |
| old PPR/dynamicIO/useCache flags | ⚠️ | Migration-only; replacement taught Phase 20 |
| old Image / metadata / `next export` APIs | ⚠️ | Current replacements taught Phases 11–12 / 17 / 20 |
| SPA/client-heavy → server-first App Router | ✅ | Phase 20 |
| Pages Router coexistence/retirement strategy | ✅ | Migration context only; Pages curriculum remains out of scope |
| migration route matrix / canary / rollback / compatibility window | ✅ | Phase 20 |

## Projects & interview system

| Area | Status | Location |
| --- | --- | --- |
| production project rubric | ✅ | Phase 21 |
| public catalog/search/SEO/cache capstone | ✅ | Phase 21 |
| transactional commerce/booking capstone | ✅ | Phase 21 |
| multi-tenant SaaS capstone | ✅ | Phase 21 |
| production reference architecture capstone | ✅ | Phase 21 |
| interview strategy / fundamentals-to-senior mastery | ✅ | Phase 22 |
| debugging/security/performance production scenarios | ✅ | Phase 22 |
| Next.js system-design drills | ✅ | Phase 22 |
| staff architecture/leadership/behavioral mastery | ✅ | Phase 22 |
| broad interview question bank | ✅ | Phase 23 |
| coding/output/trick/system-design question practice | ✅ | Phase 23 |
| timed screen / senior / full-stack / staff mocks | ✅ | Phase 24 |
| live coding/debugging/system design mock | ✅ | Phase 24 |
| behavioral/production experience mock | ✅ | Phase 24 |

## Final coverage conclusion

All **stable, in-scope Next.js 16.2.12 App Router topics** identified in the handbook audit are covered to the handbook quality bar. Deprecated behavior is retained only where migration context requires it; experimental/preview/canary surfaces remain labelled; Pages Router and private framework internals remain intentionally excluded from normal application architecture.

See [Final Completeness Audit](./final-completeness-audit.md) for the final validation and publication gate.
