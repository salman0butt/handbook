---
title: API Coverage Contract
description: Living coverage map from the current Next.js App Router documentation to this handbook.
---

# Next.js App Router API Coverage Contract

This is the handbook's living completeness contract against the **current stable Next.js App Router documentation**.

**Baseline verified: July 26, 2026 — Next.js 16.2.11 (16.x Active LTS).**

This file is intentionally conservative. A topic is not marked complete because it is mentioned once; it becomes ✅ only after the handbook teaches the mental model, API behavior, production implications, failure modes, security/performance concerns, and useful interview reasoning.

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
| App Router | 🟠 | Primary and only router taught |
| Pages Router | ⛔ | Intentionally excluded by handbook scope |
| Next.js 16.2 stable behavior | 🟠 | Version baseline established; phase-by-phase verification continues |
| Next.js 16.3 preview/canary | 🧪 | Track, do not teach as stable until promoted to npm `latest` |
| React 19.2 stable APIs | 🟠 | React handbook owns React depth; Next.js chapters explain framework integration |
| React Canary features exposed by stable App Router | 🟡 | Cover only when stable Next.js documentation gives a supported contract |
| Vercel platform behavior | 🟡 | Clearly labeled platform-specific; never treated as required Next.js core |

## Getting Started

| Official area | Status | Handbook location |
| --- | --- | --- |
| Installation | 🟠 | `01-foundations/creating-and-running-a-nextjs-app` |
| Project Structure | 🟠 | `01-foundations/project-structure-and-file-conventions` |
| Layouts and Pages | 🟠 | Foundations; deep coverage planned Phase 02 |
| Linking and Navigating | 🟡 | Phase 03 |
| Server and Client Components | 🟠 | Foundation mental model; deep coverage Phase 04 |
| Cache Components | 🟡 | Phase 06; opt-in state must be preserved accurately |
| Fetching Data | 🟡 | Phase 05 |
| Updating Data / Server Functions | 🟡 | Phase 07 |
| Caching and Revalidating | 🟡 | Phase 06 |
| Error Handling | 🟡 | Phases 10 and 14 |
| CSS / styling integration | 🟡 | Cover framework-specific behavior without turning a styling library into a requirement |
| Image Optimization | 🟡 | Phase 12 |
| Font Optimization | 🟡 | Phase 12 |
| Metadata and OG Images | 🟡 | Phase 11 |
| Route Handlers | 🟡 | Phase 08 |
| Proxy | 🟠 | Current Next.js 16 terminology introduced; deep coverage Phase 09 |
| Deploying | 🟡 | Phase 17 |
| Upgrading | 🟠 | Baseline workflow introduced; deep coverage Phase 20 |

## Routing & File Conventions

| API / convention | Status | Planned phase |
| --- | --- | --- |
| `app/` | 🟠 | 01–02 |
| `page.js/tsx` | 🟠 | 01–02 |
| `layout.js/tsx` | 🟠 | 01–02 |
| `template.js/tsx` | 🟠 | 02 |
| `loading.js/tsx` | 🟡 | 02 / 10 |
| `error.js/tsx` | 🟡 | 02 / 14 |
| `global-error.js/tsx` | 🟡 | 14 |
| `not-found.js/tsx` | 🟡 | 02 / 14 |
| `default.js/tsx` | 🟡 | 02 |
| `route.js/ts` | 🟡 | 08 |
| Dynamic Segments `[id]` | 🟡 | 02 |
| Catch-all `[...slug]` | 🟡 | 02 |
| Optional catch-all `[[...slug]]` | 🟡 | 02 |
| Route Groups `(group)` | 🟠 | 01–02 |
| Private Folders `_folder` | 🟠 | 01–02 |
| Parallel Routes `@slot` | 🟡 | 02 |
| Intercepting Routes | 🟡 | 02 |
| `src/` | 🟠 | 01 |
| `public/` | 🟠 | 01 / 12 |
| `proxy.js/ts` | 🟠 | 09 |
| `instrumentation.js/ts` | 🟡 | 14 |
| `instrumentation-client.js/ts` | 🟠 | 14 |
| `mdx-components.js/ts` | 🟡 | Architecture/content coverage |
| Metadata files | 🟡 | 11 |
| `forbidden.js` / `unauthorized.js` | 🧪 | Current upgrade docs list related auth interrupts as canary; verify before teaching |

## Components

| Component | Status | Planned phase |
| --- | --- | --- |
| `<Link>` | 🟡 | 03 |
| `<Image>` | 🟡 | 12 |
| `<Script>` | 🟡 | 12 |
| `<Form>` | 🟡 | 07 |

## Navigation Hooks

| Hook | Status | Planned phase |
| --- | --- | --- |
| `useRouter` | 🟡 | 03 |
| `usePathname` | 🟡 | 03 |
| `useSearchParams` | 🟡 | 03 |
| `useParams` | 🟡 | 03 |
| `useSelectedLayoutSegment(s)` | 🟡 | 03 |
| `useLinkStatus` | 🟡 | 03 |

## Server & Client Component Boundaries

| Concept / API | Status | Planned phase |
| --- | --- | --- |
| Server Components default | 🟠 | 04 |
| `'use client'` | 🟠 | 04 |
| Client module graph boundary | 🟠 | 04 |
| Serialization across RSC boundary | 🟡 | 04 |
| Server-only modules / environment poisoning | 🟠 | 04 / 13 |
| Context/provider placement | 🟡 | 04 |
| RSC payload mental model | 🟠 | 10 / 19 |
| Hydration | 🟠 | 10 / 19 |

## Data Fetching

| Area | Status | Planned phase |
| --- | --- | --- |
| Async Server Components | 🟠 | 05 |
| Server-side `fetch` | 🟡 | 05–06 |
| Direct database/ORM access | 🟠 | 05 |
| Parallel fetching | 🟡 | 05 |
| Sequential fetching / waterfalls | 🟡 | 05 / 15 |
| Preloading patterns | 🟡 | 05 |
| Promise sharing / React `cache` where applicable | 🟡 | 05–06 |
| Client-side fetching | 🟡 | 05 |
| Streaming data with Suspense | 🟡 | 05 / 10 |

## Caching, Rendering & Revalidation

This section is deliberately version-sensitive.

| Area / API | Status | Notes |
| --- | --- | --- |
| Current default `fetch` caching behavior | 🟡 | Phase 06; do not copy Next.js 13/14 defaults |
| Static vs dynamic server rendering | 🟠 | Mental model introduced; deep Phase 06/10 |
| Request memoization / deduplication | 🟡 | Verify exact current scope before documenting |
| React `cache` | 🟡 | Separate React behavior from Next.js cache behavior |
| `revalidatePath` | 🟡 | Phase 06–07 |
| `revalidateTag` | 🟡 | Phase 06–07; document current 16.x semantics |
| `updateTag` | 🟡 | Next.js 16 stable API; Phase 06–07 |
| `refresh` from `next/cache` | 🟡 | Next.js 16 Server Function API; Phase 07 |
| `unstable_cache` | ⚠️ | Previous model / migration context; verify current recommendation |
| Route segment `revalidate` / `fetchCache` / `dynamic` | 🟡 | Current when Cache Components is off; changed/replaced when enabled |
| `cacheComponents` | 🟡 | Introduced Next.js 16; opt-in in 16.2 |
| `'use cache'` | 🟡 | Cache Components model |
| `'use cache: private'` | 🟡 | Verify production constraints and use cases |
| `'use cache: remote'` | 🟡 | Platform/cache-handler implications must be explicit |
| `cacheLife` | 🟡 | Phase 06 |
| `cacheTag` | 🟡 | Phase 06 |
| Cache handlers | 🟡 | Phase 06 / 17 |
| Partial prerendering via Cache Components | 🟡 | Teach current model, not old standalone experimental flags |
| Old standalone PPR/dynamicIO/useCache flags | ⚠️ | Consolidated by `cacheComponents` in Next.js 16 |

## Request APIs

| API | Status | Planned phase |
| --- | --- | --- |
| `cookies()` | 🟡 | 06 / 09 / 13 |
| `headers()` | 🟡 | 06 / 09 |
| route `params` | 🟡 | 02; modern async behavior |
| page `searchParams` | 🟡 | 03; modern async behavior |
| `connection()` | 🟡 | 06 / rendering |
| Draft/preview mode APIs | 🟡 | Content architecture / request handling |

## Mutations & Server Functions

| API / area | Status | Planned phase |
| --- | --- | --- |
| Server Functions | 🟡 | 07 |
| Server Actions terminology/history | 🟡 | 07; current terminology first |
| `'use server'` | 🟠 | Mental model introduced; deep Phase 07 |
| form `action` | 🟡 | 07 |
| validation | 🟡 | 07 / 13 |
| authorization | 🟠 | Security rule introduced; deep 07 / 13 |
| `useActionState` | 🟡 | 07 |
| `useFormStatus` | 🟡 | 07 |
| `useOptimistic` | 🟡 | 07 |
| redirect after mutation | 🟡 | 07 |
| revalidation after mutation | 🟡 | 06–07 |
| idempotency / duplicate submissions | 🟡 | 07 |

## Route Handlers & HTTP

| Area | Status | Planned phase |
| --- | --- | --- |
| `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, etc. | 🟡 | 08 |
| Web `Request` / `Response` | 🟡 | 08 |
| `NextRequest` / `NextResponse` | 🟡 | 08–09 |
| cookies / headers | 🟡 | 08–09 |
| redirects | 🟡 | 03 / 08–09 |
| streaming responses | 🟡 | 08 |
| file responses | 🟡 | 08 |
| webhooks | 🟡 | 08 / 13 |
| CORS | 🟡 | 08 |
| rate limiting architecture | 🟡 | 08 / 13 |
| Server Function vs Route Handler | 🟡 | 07–08 |
| Direct Server Component data access vs HTTP hop | 🟠 | Foundation introduced; deep 05 / 08 |

## Proxy & Request Pipeline

| Area | Status | Planned phase |
| --- | --- | --- |
| `proxy.ts` naming | 🟠 | 09 |
| `proxy()` | 🟡 | 09 |
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
| Server rendering pipeline | 🟠 | 10 |
| RSC payload | 🟠 | 10 / 19 |
| HTML generation | 🟠 | 10 |
| hydration | 🟠 | 10 |
| streaming | 🟠 | 05 / 10 |
| Suspense | 🟡 | 05 / 10 |
| `loading.tsx` | 🟡 | 02 / 10 |
| prefetching | 🟡 | 03 / 10 |
| partial route navigation | 🟡 | 03 / 10 |
| Cache Components partial prerendering | 🟡 | 06 / 10 |

## Metadata & Assets

| Area | Status | Planned phase |
| --- | --- | --- |
| static `metadata` | 🟡 | 11 |
| `generateMetadata` | 🟡 | 11 |
| title templates | 🟡 | 11 |
| Open Graph / Twitter metadata | 🟡 | 11 |
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
| untrusted Server Function arguments | 🟠 | 07 / 13 |
| runtime validation | 🟠 | 07 / 08 / 13 |
| tenant scoping | 🟡 | 13 / 18 |
| CSRF | 🟡 | 13 |
| XSS / raw HTML | 🟡 | 13 |
| secrets / environment variables | 🟠 | 01 / 13 |
| `NEXT_PUBLIC_` exposure | 🟠 | 01 / 13 |
| CSP / security headers | 🟡 | 13 |
| cache leaks / cross-user data | 🟡 | 06 / 13 |
| uploads / webhooks / rate limits | 🟡 | 08 / 13 |
| logging redaction | 🟡 | 13–14 |

## Observability & Debugging

| Area | Status | Planned phase |
| --- | --- | --- |
| `error.tsx` | 🟡 | 14 |
| `global-error.tsx` | 🟡 | 14 |
| expected errors | 🟡 | 14 |
| structured server logs | 🟡 | 14 |
| `instrumentation.ts` | 🟡 | 14 |
| `instrumentation-client.ts` | 🟠 | 14 |
| OpenTelemetry | 🟡 | 14 |
| source maps / release correlation | 🟡 | 14 |
| hydration debugging | 🟠 | 10 / 14 |
| caching bugs | 🟡 | 06 / 14 |
| `next dev --inspect` / `next start --inspect` | 🟠 | 14 / 17 |
| Next.js 16.2 Server Function dev logging | 🟡 | 07 / 14 |

## Performance

| Area | Status | Planned phase |
| --- | --- | --- |
| Core Web Vitals | 🟡 | 15 |
| client bundle size | 🟠 | 04 / 15 |
| hydration cost | 🟠 | 10 / 15 |
| RSC payload | 🟡 | 10 / 15 |
| waterfalls | 🟠 | 05 / 15 |
| streaming/Suspense | 🟡 | 05 / 10 / 15 |
| images/fonts/scripts | 🟡 | 12 / 15 |
| prefetching | 🟡 | 03 / 15 |
| cache performance | 🟡 | 06 / 15 |
| React Compiler integration | 🟡 | 15; stable integration, optional adoption |
| Turbopack | 🟠 | 01 / 15 / 19 |
| bundle analysis | 🟡 | 15 |
| performance budgets | 🟡 | 15 / 18 |

## Testing

| Area | Status | Planned phase |
| --- | --- | --- |
| unit testing | 🟡 | 16 |
| Client Component tests | 🟡 | 16 |
| Server Component testing strategy | 🟡 | 16 |
| Route Handler tests | 🟡 | 16 |
| Server Function tests | 🟡 | 16 |
| Playwright E2E | 🟡 | 16 |
| accessibility testing | 🟡 | 16 |
| production build tests | 🟠 | Build discipline introduced; deep Phase 16 |
| deployment smoke tests | 🟡 | 16–17 |

## Configuration & Tooling

| Area | Status | Planned phase |
| --- | --- | --- |
| `next.config.ts` | 🟠 | 01 / reference expansion |
| TypeScript | 🟠 | 01 |
| ESLint / external linting | 🟠 | 01 |
| removal of `next lint` in v16 | 🟠 | 01 / 20 |
| environment variables | 🟠 | 01 / 13 / 17 |
| Turbopack default | 🟠 | 01 / 15 / 19 |
| Webpack opt-out | 🟠 | 01 / 20 |
| React Compiler config | 🟡 | 15 |
| `cacheComponents` config | 🟡 | 06 |
| route segment config | 🟡 | 06 / 20 |
| images config | 🟡 | 12 |
| headers / redirects / rewrites config | 🟡 | 09 / 13 |
| output / standalone config | 🟡 | 17 |
| adapters | 🟡 | 17; stable in 16.2 |

## Deployment & Runtime

| Area | Status | Planned phase |
| --- | --- | --- |
| `next build` | 🟠 | 01 / 17 |
| `next start` | 🟠 | 01 / 17 |
| Node.js hosting | 🟡 | 17 |
| standalone output | 🟡 | 17 |
| Docker / containers | 🟡 | 17 |
| reverse proxy / CDN | 🟡 | 17 |
| self-hosting | 🟡 | 17 |
| cache coordination | 🟡 | 06 / 17 |
| multi-instance operation | 🟠 | Mental model introduced; deep 17 |
| adapters / non-Vercel providers | 🟡 | 17 |
| Vercel platform specifics | 🟡 | 17, clearly labeled |
| static export constraints | 🟡 | 17 |

## Architecture & Internals

| Area | Status | Planned phase |
| --- | --- | --- |
| feature boundaries / vertical slices | 🟡 | 18 |
| monorepos / shared packages | 🟡 | 18 |
| design systems | 🟡 | 18 |
| multi-tenancy / permissions | 🟡 | 18 |
| realtime architecture | 🟡 | 18 / projects |
| ecommerce / CMS patterns | 🟡 | 18 / projects |
| compilation | 🟡 | 19 |
| route discovery | 🟠 | Foundation introduced; deep 19 |
| server/client module graphs | 🟠 | Foundation introduced; deep 04 / 19 |
| RSC build/delivery concepts | 🟡 | 10 / 19 |
| Turbopack mental model | 🟠 | 19 |
| public contract vs implementation detail | 🟠 | Handbook policy established; deep 19 |

## Upgrades & Deprecations

| Area | Status | Planned phase |
| --- | --- | --- |
| `next upgrade` | 🟠 | 01 / 20 |
| version 15 → 16 migration concerns | 🟡 | 20 |
| async request API migration | 🟡 | 20 |
| Middleware → Proxy | ⚠️ | Current form taught; migration Phase 20 |
| `next lint` removal | ⚠️ | Current lint workflow taught; migration Phase 20 |
| old cache/PPR flags | ⚠️ | Modern Cache Components model Phase 06 / migration Phase 20 |
| Pages Router APIs | ⛔ | Not part of this handbook |

## Handbook completion gates

The Next.js handbook is not “complete” until all of these are true:

1. every stable App Router documentation category has been audited against this file;
2. every ✅ item meets the handbook quality bar rather than merely naming the API;
3. current caching/rendering behavior is re-verified against the then-current stable release;
4. preview/canary features are not mislabeled as stable;
5. security, performance, debugging, and deployment implications are integrated throughout;
6. a production Docusaurus build verifies every document ID and sidebar reference;
7. capstone projects, interview bank, and mock interviews are complete;
8. a final completeness audit is performed against the official docs on that date.

Until then, this file remains a **coverage contract**, not a completeness claim.

## Primary audit sources

- [Next.js App Router docs](https://nextjs.org/docs/app)
- [Next.js API reference](https://nextjs.org/docs/app/api-reference)
- [Next.js file conventions](https://nextjs.org/docs/app/api-reference/file-conventions)
- [Next.js configuration reference](https://nextjs.org/docs/app/api-reference/config)
- [Next.js guides](https://nextjs.org/docs/app/guides)
- [Next.js releases](https://nextjs.org/blog)
- [Next.js support policy](https://nextjs.org/support-policy)
- [Next.js npm versions](https://www.npmjs.com/package/next?activeTab=versions)
