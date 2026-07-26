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
| Next.js 16.2 stable behavior | 🟠 | Baseline + routing verified; phase-by-phase verification continues |
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
| 03 · Navigation & URL State | 🟡 |
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
| Linking and Navigating | 🟡 | Phase 03 |
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
| route-driven modal pattern | ✅ | Phase 02 |
| `src/` | ✅ | Phase 01 |
| `public/` | 🟠 | Structure covered Phase 01; asset behavior Phase 12 |
| `proxy.js/ts` | 🟠 | Phase 09 |
| `instrumentation.js/ts` | 🟡 | Phase 14 |
| `instrumentation-client.js/ts` | 🟡 | Phase 14 |
| `mdx-components.js/ts` | 🟡 | Content/architecture coverage |
| Metadata files | 🟡 | Phase 11 |
| `forbidden.js` / `unauthorized.js` | 🧪 | Verify exact stable auth-interrupt contract before teaching |

## Navigation Components & Hooks

| API | Status | Planned phase |
| --- | --- | --- |
| `<Link>` | 🟡 | 03 |
| `useRouter` | 🟡 | 03 |
| `usePathname` | 🟡 | 03 |
| `useSearchParams` | 🟡 | 03 |
| `useParams` | 🟡 | 03 |
| `useSelectedLayoutSegment` | 🟠 | Slot use introduced Phase 02; API depth Phase 03 |
| `useSelectedLayoutSegments` | 🟠 | Slot use introduced Phase 02; API depth Phase 03 |
| `useLinkStatus` | 🟡 | 03 |
| redirects / navigation from server code | 🟡 | 03 |
| browser history / scroll / focus | 🟡 | 03 |

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
| page `searchParams` | 🟡 | 03; current async behavior |
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
| redirect after mutation | 🟡 | 07 |
| revalidation after mutation | 🟡 | 06–07 |
| idempotency / duplicate submissions | 🟡 | 07 |

## Route Handlers & HTTP

| Area | Status | Planned phase |
| --- | --- | --- |
| HTTP methods in `route.ts` | 🟡 | 08 |
| Web `Request` / `Response` | 🟡 | 08 |
| `NextRequest` / `NextResponse` | 🟡 | 08–09 |
| cookies / headers | 🟡 | 08–09 |
| redirects | 🟡 | 03 / 08–09 |
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
| Suspense | 🟠 | Route-level convention covered; deep 05 / 10 |
| `loading.tsx` | ✅ | Route semantics 02; deeper streaming 10 |
| soft vs hard App Router navigation | 🟠 | Routing behavior covered 02; mechanics 03 / 10 |
| prefetching | 🟡 | 03 / 10 |
| partial route navigation | 🟠 | Layout/slot behavior covered; mechanics 03 / 10 |
| Cache Components partial prerendering | 🟡 | 06 / 10 |

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
| tenant/resource scoping | 🟠 | Phase 02 routing examples; deep 13 / 18 |
| untrusted Server Function arguments | 🟠 | 07 / 13 |
| runtime validation | 🟠 | 07 / 08 / 13 |
| CSRF | 🟡 | 13 |
| XSS / output safety | 🟡 | 13 |
| secrets and `NEXT_PUBLIC_` | 🟠 | 01 / 13 |
| safe redirects | 🟡 | 03 / 13 |
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
| structured logs | 🟡 | 14 |
| correlation IDs | 🟡 | 14 |
| OpenTelemetry | 🟡 | 14 |
| instrumentation | 🟡 | 14 |
| source maps / release correlation | 🟡 | 14 |
| hydration/cache/build incident triage | 🟡 | 14 / 19 |

## Performance

| Area | Status | Planned phase |
| --- | --- | --- |
| client JS / hydration cost | 🟠 | 04 / 15 |
| route-level streaming boundaries | 🟠 | 02 / 10 / 15 |
| independent slot loading/error containment | ✅ | Routing semantics Phase 02 |
| server render latency | 🟡 | 15 |
| data/database waterfalls | 🟡 | 05 / 15 |
| images/fonts/scripts | 🟡 | 12 / 15 |
| code splitting / dynamic imports | 🟡 | 15 |
| prefetching | 🟡 | 03 / 15 |
| caching | 🟡 | 06 / 15 |
| performance budgets / measurement | 🟡 | 15 |

## Testing & Production

| Area | Status | Planned phase |
| --- | --- | --- |
| production build as route validation | ✅ | Phase 02 engineering workflow |
| unit/component tests | 🟡 | 16 |
| Server/Client Component strategy | 🟡 | 16 |
| Route Handler / Server Function tests | 🟡 | 16 |
| Playwright E2E | 🟡 | 16 |
| accessibility tests | 🟡 | 16 |
| hard vs soft route navigation E2E | 🟠 | Test cases specified Phase 02; implementation Phase 16 |
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
| route-driven modal architecture | ✅ | Phase 02 |
| feature/vertical-slice architecture | 🟠 | Phase 02 examples; deep 18 |
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
| Proxy migration from `middleware.ts` | ⚠️ | 20 |
| caching-model migrations | 🟡 | 06 / 20 |
| Turbopack compatibility | 🟡 | 20 |
| Pages Router → App Router migration | ⛔ | Outside handbook scope |

## Phase 02 completion note

Phase 02 is considered complete for routing semantics because it now teaches:

- route tree composition
- pages, nested layouts, root layouts, and templates
- state preservation vs remounting
- dynamic/catch-all/optional catch-all segments
- Promise-based `params`
- `generateStaticParams` and `dynamicParams` routing purpose
- route groups and private folders
- multiple root-layout full-load boundary
- loading/error/not-found/default special files
- Parallel Route slots and hard-load recovery
- soft vs hard slot behavior
- Intercepting Routes and route-driven modal architecture
- route-level security/trust implications
- debugging, testing scenarios, and design-review checklists

Deeper streaming, rendering, caching, navigation hooks, observability, and testing mechanics remain deliberately assigned to their later phases.

## Completion rule

The handbook is not complete until this contract is re-audited against the then-current stable Next.js docs and every stable in-scope item has a justified final state.

See [Final Completeness Audit](./final-completeness-audit.md) for the release gate.