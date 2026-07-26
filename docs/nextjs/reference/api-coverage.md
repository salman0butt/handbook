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
| Next.js 16.2 stable behavior | 🟠 | Baseline + routing/navigation verified; phase-by-phase verification continues |
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
| 04 · Server & Client Components | 🟡 |
| 05 · Data Fetching | 🟡 |
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
| Server and Client Components | 🟠 | Foundation mental model; deep Phase 04 |
| Cache Components | 🟡 | Phase 06; preserve opt-in 16.2 semantics |
| Fetching Data | 🟡 | Phase 05 |
| Updating Data / Server Functions | 🟡 | Phase 07 |
| Caching and Revalidating | 🟡 | Phase 06 |
| Error Handling | 🟠 | Route boundary basics in Phase 02; deep Phase 14 |
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
| `page.js/tsx` | ✅ | Phase 02 |
| `layout.js/tsx` | ✅ | Phase 02 |
| root layouts | ✅ | Phase 02 |
| multiple root layouts | ✅ | Phase 02 |
| `template.js/tsx` | ✅ | Phase 02 |
| `loading.js/tsx` | ✅ | Route semantics Phase 02; streaming depth Phase 10 |
| `error.js/tsx` | 🟠 | Boundary semantics Phase 02; observability/recovery depth Phase 14 |
| `global-error.js/tsx` | 🟠 | Introduced Phase 02; deep Phase 14 |
| `not-found.js/tsx` | ✅ | Route semantics Phase 02; deeper error/SEO context later |
| `global-not-found.js/tsx` | 🧪 | Experimental; mentioned but not taught as default production pattern |
| `default.js/tsx` | ✅ | Phase 02 parallel-route hard-load recovery |
| `route.js/ts` | 🟡 | Phase 08 |
| Dynamic Segments `[id]` | ✅ | Phase 02 |
| Catch-all `[...slug]` | ✅ | Phase 02 |
| Optional catch-all `[[...slug]]` | ✅ | Phase 02 |
| async route `params` | ✅ | Phase 02 current Promise contract |
| `generateStaticParams` | ✅ | Routing purpose Phase 02; rendering/cache depth Phase 06 |
| `dynamicParams` | 🟠 | Routing behavior introduced; deeper rendering semantics Phase 06 |
| Route Groups `(group)` | ✅ | Phase 02 |
| Private Folders `_folder` | ✅ | Phase 02 |
| Parallel Routes `@slot` | ✅ | Phase 02 |
| `children` implicit slot | ✅ | Phase 02 |
| Intercepting Routes `(.)`, `(..)`, `(...)` | ✅ | Phase 02 |
| route-driven modal pattern | ✅ | Phase 02; history/accessibility integration Phase 03 |
| `src/` | ✅ | Phase 01 |
| `public/` | 🟠 | Structure covered Phase 01; asset behavior Phase 12 |
| `proxy.js/ts` | 🟠 | Phase 09 |
| `instrumentation.js/ts` | 🟡 | Phase 14 |
| `instrumentation-client.js/ts` | 🟡 | Phase 14 |
| `mdx-components.js/ts` | 🟡 | Content/architecture coverage |
| Metadata files | 🟡 | Phase 11 |
| `forbidden.js` / `unauthorized.js` | 🧪 | Verify exact stable auth-interrupt contract before teaching |

## Navigation Components & Hooks

| API / behavior | Status | Handbook location / plan |
| --- | --- | --- |
| `<Link>` | ✅ | Phase 03 |
| `href`, `replace`, `scroll`, `prefetch` | ✅ | Phase 03 |
| `<Link onNavigate>` | ✅ | Phase 03 |
| `<Link transitionTypes>` | ✅ | Stable 16.2 prop; broader View Transition integration remains experimental |
| `useRouter` | ✅ | Phase 03 |
| `router.push` / `replace` / `back` / `forward` | ✅ | Phase 03 |
| `router.refresh` | 🟠 | Navigation contract Phase 03; cache/mutation depth Phases 06–07 |
| `router.prefetch` / `onInvalidate` | ✅ | Navigation use Phase 03 |
| `usePathname` | ✅ | Phase 03 |
| `useSearchParams` | ✅ | Phase 03, including static/Suspense behavior |
| `useParams` | ✅ | Phase 03 |
| `useSelectedLayoutSegment` | ✅ | Phase 03 |
| `useSelectedLayoutSegments` | ✅ | Phase 03 |
| parallel-route key for selected segments | ✅ | Phases 02–03 |
| `useLinkStatus` | ✅ | Phase 03 |
| `redirect` | ✅ | Navigation semantics Phase 03; mutation/HTTP contexts later |
| `permanentRedirect` | ✅ | Phase 03 |
| safe redirect destinations | ✅ | Phase 03 baseline; auth/security depth Phase 13 |
| native `history.pushState` / `replaceState` | ✅ | Phase 03 |
| Back / Forward semantics | ✅ | Phase 03 |
| hash navigation | ✅ | Phase 03 |
| scroll behavior / `scroll={false}` | ✅ | Phase 03 |
| focus and route-navigation accessibility | ✅ | Phase 03 |
| route-change observation via pathname/search params | ✅ | Phase 03 |

## Server & Client Component Boundaries

| Concept / API | Status | Planned phase |
| --- | --- | --- |
| Server Components default | 🟠 | 04 |
| `'use client'` | 🟠 | 04 |
| Client module graph boundary | 🟠 | 04 |
| Serialization across RSC boundary | 🟡 | 04 |
| Server-only modules / environment poisoning | 🟠 | 04 / 13 |
| Context/provider placement | 🟠 | Layout architecture introduced; deep Phase 04 |
| RSC payload mental model | 🟠 | 10 / 19 |
| Hydration | 🟠 | 10 / 19 |

## Data Fetching

| Area | Status | Planned phase |
| --- | --- | --- |
| Async Server Components | 🟠 | 05 |
| Server-side `fetch` | 🟡 | 05–06 |
| Direct database/ORM access | 🟠 | Foundations + routing examples; deep 05 |
| Parallel fetching | 🟡 | 05 |
| Sequential fetching / waterfalls | 🟡 | 05 / 15 |
| Preloading patterns | 🟡 | 05 |
| Promise sharing / React `cache` where applicable | 🟡 | 05–06 |
| Client-side fetching | 🟡 | 05 |
| Streaming data with Suspense | 🟠 | Route boundary introduced; deep 05 / 10 |

## Caching, Rendering & Revalidation

This section is deliberately version-sensitive.

| Area / API | Status | Notes |
| --- | --- | --- |
| Current default `fetch` caching behavior | 🟡 | Phase 06; do not copy Next.js 13/14 defaults |
| Static vs dynamic server rendering | 🟠 | Mental model introduced; deep 06 / 10 |
| Request memoization / deduplication | 🟡 | Verify exact current scope |
| React `cache` | 🟡 | Separate React behavior from Next.js cache behavior |
| `revalidatePath` | 🟡 | 06–07 |
| `revalidateTag` | 🟡 | 06–07; document current 16.x semantics |
| `updateTag` | 🟡 | 06–07 |
| `refresh` from `next/cache` | 🟡 | 07 |
| `unstable_cache` | ⚠️ | Migration/history context only if current docs recommend replacement |
| route segment `revalidate` / `fetchCache` / `dynamic` | 🟡 | Current non-Cache-Components model |
| `cacheComponents` | 🟡 | Next.js 16 opt-in in 16.2 |
| `'use cache'` | 🟡 | 06 |
| `'use cache: private'` | 🟡 | 06; verify constraints |
| `'use cache: remote'` | 🟡 | 06 / 17; platform/cache-handler implications |
| `cacheLife` | 🟡 | 06 |
| `cacheTag` | 🟡 | 06 |
| Cache handlers | 🟡 | 06 / 17 |
| Partial prerendering via Cache Components | 🟡 | 06 / 10 |
| old standalone PPR/dynamicIO/useCache flags | ⚠️ | Migration context only |

## Request APIs

| API | Status | Planned phase |
| --- | --- | --- |
| `cookies()` | 🟡 | 06 / 09 / 13 |
| `headers()` | 🟡 | 06 / 09 |
| route `params` | ✅ | 02; current async behavior |
| page `searchParams` | ✅ | Phase 03; Promise-based plain-object contract and dynamic-rendering implication |
| `connection()` | 🟡 | 06 / rendering |
| Draft/preview mode APIs | 🟡 | Content architecture / request handling |

## Mutations & Server Functions

| API / area | Status | Planned phase |
| --- | --- | --- |
| Server Functions | 🟡 | 07 |
| Server Actions terminology/history | 🟡 | 07; current terminology first |
| `'use server'` | 🟠 | Foundation mental model; deep 07 |
| form `action` | 🟡 | 07 |
| runtime validation | 🟠 | Security rule introduced; deep 07 / 13 |
| authorization | 🟠 | Dynamic-route trust boundary introduced; deep 07 / 13 |
| `useActionState` | 🟡 | 07 |
| `useFormStatus` | 🟡 | 07 |
| `useOptimistic` | 🟡 | 07 |
| redirect after mutation | 🟠 | Redirect semantics Phase 03; mutation sequence Phase 07 |
| revalidation after mutation | 🟡 | 06–07 |
| idempotency / duplicate submissions | 🟡 | 07 |

## Route Handlers & HTTP

| Area | Status | Planned phase |
| --- | --- | --- |
| HTTP methods in `route.ts` | 🟡 | 08 |
| Web `Request` / `Response` | 🟡 | 08 |
| `NextRequest` / `NextResponse` | 🟡 | 08–09 |
| cookies / headers | 🟡 | 08–09 |
| redirects | 🟠 | Navigation redirect semantics Phase 03; Route Handler/request-pipeline depth 08–09 |
| streaming/file responses | 🟡 | 08 |
| webhooks | 🟡 | 08 / 13 |
| CORS | 🟡 | 08 |
| rate-limiting architecture | 🟡 | 08 / 13 |
| Server Function vs Route Handler | 🟡 | 07–08 |
| direct server data access vs internal HTTP hop | 🟠 | Foundation + Phase 02 examples; deep 05 / 08 |

## Proxy & Request Pipeline

| Area | Status | Planned phase |
| --- | --- | --- |
| `proxy.ts` naming | 🟠 | 09 |
| Proxy function | 🟡 | 09 |
| matchers | 🟡 | 09 |
| redirects / rewrites / headers | 🟡 | 09 |
| request execution order | 🟡 | 09 |
| auth gating | 🟡 | 09 / 13 |
| authoritative authorization outside Proxy | 🟠 | Security contract already established |
| localization / tenancy | 🟡 | 09 / 18 |
| old `middleware.ts` convention | ⚠️ | Migration-only; renamed/deprecated in Next.js 16 |

## Rendering, Suspense & Navigation Delivery

| Area | Status | Planned phase |
| --- | --- | --- |
| server rendering pipeline | 🟠 | 10 |
| RSC payload | 🟠 | 10 / 19 |
| HTML generation | 🟠 | 10 |
| hydration | 🟠 | 10 |
| streaming | 🟠 | Route behavior covered; deep 05 / 10 |
| Suspense | 🟠 | Route/query boundaries covered; deep 05 / 10 |
| `loading.tsx` | ✅ | Route semantics 02; navigation use 03; deeper streaming 10 |
| soft vs hard App Router navigation | ✅ | Phases 02–03 |
| production `<Link>` prefetching | ✅ | Phase 03; cache internals later |
| dynamic-route partial prefetch to loading boundary | ✅ | Phase 03 stable 16.2 navigation behavior |
| partial route navigation / preserved layouts | ✅ | Phases 02–03; RSC mechanics later |
| navigation pending feedback | ✅ | `loading.tsx` + `useLinkStatus` Phase 03 |
| Cache Components partial prerendering | 🟡 | 06 / 10 |
| Next.js 16.3 Instant Navigations | 🧪 | Preview-only at July 26, 2026 baseline; not taught as stable |

## Metadata & Assets

| Area | Status | Planned phase |
| --- | --- | --- |
| static `metadata` | 🟡 | 11 |
| `generateMetadata` | 🟡 | 11 |
| title templates | 🟡 | 11 |
| Open Graph / social metadata | 🟡 | 11 |
| robots / sitemap / manifest | 🟡 | 11 |
| icons and generated images | 🟡 | 11–12 |
| JSON-LD / structured data | 🟡 | 11 |
| `next/image` | 🟡 | 12 |
| remote image security/configuration | 🟡 | 12–13 |
| `next/font` | 🟡 | 12 |
| `next/script` | 🟡 | 12 |
| resource hints | 🟡 | 12 / 15 |

## Security

| Area | Status | Planned phase |
| --- | --- | --- |
| authentication vs authorization | 🟠 | 13 |
| dynamic route params as untrusted input | ✅ | Phase 02 |
| query/search params as untrusted input | ✅ | Phase 03 |
| navigation destinations / return URLs as untrusted input | ✅ | Phase 03 |
| tenant/resource scoping | 🟠 | Phase 02 routing examples; deep 13 / 18 |
| untrusted Server Function arguments | 🟠 | 07 / 13 |
| runtime validation | 🟠 | 07 / 08 / 13 |
| CSRF | 🟡 | 13 |
| XSS / output safety | 🟠 | Navigation-scheme risk covered Phase 03; broad XSS depth Phase 13 |
| secrets and `NEXT_PUBLIC_` | 🟠 | 01 / 13 |
| safe redirects | ✅ | Phase 03 baseline; auth/identity depth Phase 13 |
| CSP / security headers | 🟡 | 09 / 13 |
| uploads / webhooks | 🟡 | 08 / 13 |
| log redaction | 🟡 | 13 / 14 |
| cache isolation / user-data leaks | 🟡 | 06 / 13 |

## Errors, Observability & Debugging

| Area | Status | Planned phase |
| --- | --- | --- |
| route `error.tsx` boundary placement | ✅ | 02 |
| same-segment layout error behavior | ✅ | 02 |
| `global-error.tsx` | 🟠 | 02 / 14 |
| missing-resource vs unexpected-error distinction | ✅ | 02 |
| error digest / production detail protection | 🟠 | 02 / 14 |
| route-change observation | ✅ | Phase 03 pathname + search-param composition |
| navigation timing decomposition | ✅ | Phase 03 design/debugging workflow |
| rewrite/pathname hydration mismatch | ✅ | Phase 03 navigation-specific debugging |
| structured logs | 🟡 | 14 |
| correlation IDs | 🟡 | 14 |
| OpenTelemetry | 🟡 | 14 |
| instrumentation | 🟡 | 14 |
| source maps / release correlation | 🟡 | 14 |
| broad hydration/cache/build incident triage | 🟠 | Navigation cases Phase 03; deep 14 / 19 |

## Performance

| Area | Status | Planned phase |
| --- | --- | --- |
| client JS / hydration cost | 🟠 | Navigation impact introduced Phase 03; deep 04 / 15 |
| route-level streaming boundaries | 🟠 | 02 / 03 / 10 / 15 |
| independent slot loading/error containment | ✅ | Routing semantics Phase 02 |
| server render latency | 🟠 | Navigation waterfall introduced Phase 03; deep Phase 15 |
| data/database waterfalls | 🟡 | 05 / 15 |
| images/fonts/scripts | 🟡 | 12 / 15 |
| code splitting / dynamic imports | 🟠 | Navigation mental model Phase 03; deep 15 |
| prefetching | 🟠 | Navigation policy/trade-offs Phase 03; measurement depth Phase 15 |
| caching | 🟡 | 06 / 15 |
| performance budgets / measurement | 🟠 | Navigation metrics introduced Phase 03; broad performance Phase 15 |

## Testing & Production

| Area | Status | Planned phase |
| --- | --- | --- |
| production build as route validation | ✅ | Phases 02–03 engineering workflow |
| unit/component tests | 🟡 | 16 |
| Server/Client Component strategy | 🟡 | 16 |
| Route Handler / Server Function tests | 🟡 | 16 |
| Playwright E2E | 🟡 | 16 |
| accessibility tests | 🟠 | Manual navigation matrix Phase 03; automation Phase 16 |
| hard vs soft route navigation E2E | 🟠 | Test cases specified Phases 02–03; implementation Phase 16 |
| Back/Forward / deep-link E2E | 🟠 | Test matrix Phase 03; automation Phase 16 |
| deployment smoke tests | 🟡 | 16 / 17 |

## Deployment & Operations

| Area | Status | Planned phase |
| --- | --- | --- |
| `next build` / `next start` | 🟠 | 01 / 17 |
| Node hosting / standalone output | 🟡 | 17 |
| Docker | 🟡 | 17 |
| reverse proxy / CDN | 🟡 | 17 |
| environment configuration | 🟠 | 01 / 17 |
| adapters / serverless platforms | 🟡 | 17 |
| Vercel | 🟡 | 17; platform-specific |
| self-hosting | 🟡 | 17 |
| multi-instance cache/revalidation | 🟡 | 06 / 17 |
| rollback / health / graceful shutdown | 🟡 | 17 |
| CI/CD / preview environments | 🟡 | 17 |

## Architecture & Internals

| Area | Status | Planned phase |
| --- | --- | --- |
| route-tree ownership | ✅ | Phase 02 |
| route groups vs public URL hierarchy | ✅ | Phase 02 |
| layout persistence vs template reset | ✅ | Phase 02 |
| multiple-root document boundary | ✅ | Phase 02 |
| route-driven modal architecture | ✅ | Phase 02; history/accessibility integration Phase 03 |
| URL path vs query vs local-state decision model | ✅ | Phase 03 |
| navigation API ownership (`Link` / router / redirect / History API) | ✅ | Phase 03 |
| history policy and shareable URL state | ✅ | Phase 03 |
| navigation trust boundaries | ✅ | Phase 03 |
| feature/vertical-slice architecture | 🟠 | Phase 02–03 examples; deep 18 |
| monorepos/shared packages | 🟡 | 18 |
| design systems | 🟡 | 18 |
| BFF decisions | 🟡 | 18 |
| multi-tenancy/permissions | 🟠 | Routing trust model introduced; deep 13 / 18 |
| RSC build/delivery internals | 🟡 | 19 |
| Turbopack internals mental model | 🟡 | 19 |
| public contract vs implementation detail | 🟡 | 19 |

## Upgrades & Migration

| Area | Status | Planned phase |
| --- | --- | --- |
| current App Router upgrade workflow | 🟠 | 01 / 20 |
| codemods / `next upgrade` | 🟠 | 01 / 20 |
| async `params` migration | ✅ | Current contract taught Phase 02; migration detail Phase 20 |
| async page `searchParams` migration | ✅ | Current contract taught Phase 03; migration detail Phase 20 |
| `next/router` → App Router navigation APIs | 🟠 | Current App Router contract Phase 03; migration detail Phase 20 |
| Proxy migration from `middleware.ts` | ⚠️ | 20 |
| caching-model migrations | 🟡 | 06 / 20 |
| Turbopack compatibility | 🟡 | 20 |
| Pages Router → App Router migration | ⛔ | Outside handbook scope |

## Phase 02 completion note

Phase 02 is considered complete for routing semantics because it teaches route-tree composition; pages, layouts, templates, and state preservation; dynamic route shapes and Promise-based params; static-param routing purpose; route groups/private folders; special route files; parallel/intercepting routes; route-driven modal architecture; route-level trust boundaries; and routing design review.

Deeper streaming, rendering, caching, observability, and automated testing mechanics remain assigned to their later phases.

## Phase 03 completion note

Phase 03 is considered complete for stable App Router navigation and URL-state semantics because it now teaches:

- `<Link>` as the primary navigation primitive
- current 16.2 production prefetch behavior for static/dynamic routes
- `replace`, scroll policy, `onNavigate`, and stable `transitionTypes`
- `useRouter` push/replace/back/forward/refresh/prefetch behavior at navigation depth
- server-side `redirect` and `permanentRedirect`
- safe programmatic destinations and return URLs
- `usePathname`, `useParams`, `useSelectedLayoutSegment(s)`
- Promise-based page `searchParams` and client `useSearchParams`
- validated URL-driven search, filtering, sorting, and pagination
- Suspense requirements for statically rendered query-reading client islands
- `useLinkStatus` and route-level pending UX
- route-change observation without Pages Router `router.events`
- native History API integration
- Back/Forward, hash, scroll, focus, and accessibility behavior
- navigation performance decomposition, debugging, analytics, and design review
- explicit separation of stable 16.2 behavior from 16.3 preview Instant Navigations

Deeper RSC delivery, Cache Components, rendering internals, auth, observability, performance measurement, and testing automation remain deliberately assigned to later phases.

## Completion rule

The handbook is not complete until this contract is re-audited against the then-current stable Next.js docs and every stable in-scope item has a justified final state.

See [Final Completeness Audit](./final-completeness-audit.md) for the release gate.
