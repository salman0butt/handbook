---
title: API Coverage Contract
description: Living coverage map from the current Next.js App Router documentation to this handbook.
---

# Next.js App Router API Coverage Contract

This is the handbook's living completeness contract against the **current stable Next.js App Router documentation**.

**Baseline re-verified: July 27, 2026 — Next.js 16.2.11 (`latest`, 16.x Active LTS).**

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
| Pages Router | ⛔ | Intentionally excluded |
| Next.js 16.2 stable behavior | 🟠 | Core routing, data, cache, mutations, HTTP, Proxy, rendering, and metadata/SEO complete; later phases cover remaining platform APIs and operations |
| Next.js 16.3 preview/canary | 🧪 | Track but do not teach as stable until promoted to npm `latest` |
| React 19.2 stable APIs | 🟠 | React handbook owns React depth; Next.js explains framework integration |
| React Canary exposed by App Router | 🟠 | Covered only where stable Next.js docs establish a supported framework contract |
| Vercel/platform-specific behavior | 🟡 | Must remain clearly labeled and separate from Next.js core |

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
| Installation / Project Structure | ✅ | `01-foundations/*` |
| Layouts and Pages | ✅ | `02-app-router-and-layouts/*` |
| Linking and Navigating | ✅ | `03-navigation-and-url-state/*` |
| Server and Client Components | ✅ | `04-server-and-client-components/*` |
| Fetching Data | ✅ | `05-data-fetching/*` |
| Cache Components | ✅ | `06-caching-rendering-and-revalidation/*`, rendering depth 10 |
| Caching and Revalidating | ✅ | `06-caching-rendering-and-revalidation/*` |
| Mutating Data / Server Functions | ✅ | `07-mutations-forms-and-server-functions/*` |
| Route Handlers | ✅ | `08-route-handlers/*` |
| Proxy | ✅ | `09-request-pipeline-and-proxy/*` |
| Streaming / Suspense rendering | ✅ | `10-rendering-suspense-and-streaming/*` |
| Metadata and OG Images | ✅ | `11-metadata-and-seo/*` |
| Error Handling | 🟠 | Route/data/action/API/stream failure models covered; deep Phase 14 |
| CSS / styling integration | 🟡 | Framework behavior only |
| Image Optimization | 🟡 | Phase 12 |
| Font Optimization | 🟡 | Phase 12 |
| Deploying | 🟠 | Runtime implications introduced; full Phase 17 |
| Upgrading | 🟠 | Baseline introduced; deep Phase 20 |

## Routing & File Conventions

| API / convention | Status | Handbook location / plan |
| --- | --- | --- |
| `app/` route tree | ✅ | Phases 01–02 |
| `page`, `layout`, multiple root layouts | ✅ | Phase 02 |
| `template` | ✅ | Phase 02 |
| `loading` | ✅ | Phase 02 semantics; rendering/streaming depth 10 |
| `error`, `global-error` | 🟠 | Boundary baseline 02/10; deep Phase 14 |
| `not-found` | ✅ | Phase 02 |
| `global-not-found` | 🧪 | Experimental at baseline |
| `default` | ✅ | Phase 02 |
| `route` | ✅ | Phase 08 |
| `proxy` | ✅ | Phase 09 |
| dynamic/catch-all/optional catch-all | ✅ | Phase 02 |
| async `params` | ✅ | Phases 02 / 08 / metadata use 11 |
| `generateStaticParams`, `dynamicParams` | ✅ | Phases 02 / 06 / 08 |
| Route Groups / Private Folders | ✅ | Phase 02 |
| Parallel / Intercepting Routes | ✅ | Phase 02; navigation/render context Phase 10 |
| `favicon.ico` | ✅ | Phase 11 |
| `icon` / generated icon | ✅ | Phase 11 |
| `apple-icon` / generated apple icon | ✅ | Phase 11 |
| `opengraph-image` / `twitter-image` static files | ✅ | Phase 11 |
| generated `opengraph-image.tsx` / `twitter-image.tsx` | ✅ | Phase 11 |
| `manifest.json` / `manifest.ts` | ✅ | Phase 11 |
| `robots.txt` / `robots.ts` | ✅ | Phase 11 |
| `sitemap.xml` / `sitemap.ts` | ✅ | Phase 11 |
| metadata-route Proxy exclusions | ✅ | Phase 11 using Phase 09 matcher model |
| `instrumentation`, `instrumentation-client` | 🟡 | Phase 14 |

## Server & Client Component Boundaries

| Concept / API | Status | Handbook location / plan |
| --- | --- | --- |
| Server Components default | ✅ | Phase 04 |
| `'use client'` module graph | ✅ | Phase 04; hydration depth 10 |
| Server → Client composition | ✅ | Phase 04 |
| serializable props / minimal DTOs | ✅ | Phases 04–05; transport/security depth 10 |
| server-started Promise → Client `use()` | ✅ | Phases 05 / 10 |
| provider placement | ✅ | Phase 04; hydration cost Phase 10 |
| `server-only`, `client-only` | ✅ | Phase 04 |
| environment poisoning prevention | ✅ | Phase 04 |
| initial Client Component prerendering | ✅ | Phase 04 / 10 |
| hydration and interaction readiness | ✅ | Phase 10 |
| hydration mismatch mental model | ✅ | Phase 10; debugging depth 14 |
| RSC Payload | ✅ | Phase 10 |
| metadata exports Server Component-only | ✅ | Phase 11 |
| RSC/metadata public-data minimization | ✅ | Phase 10 / 11 baseline; deep security 13 |

## Data Fetching

| Area | Status | Handbook location / plan |
| --- | --- | --- |
| Async Server Components / server data ownership | ✅ | Phase 05 |
| server `fetch` | ✅ | Fetching 05; cache semantics 06 |
| direct DB/ORM/SDK reads | ✅ | Phase 05 |
| avoid own Route Handler HTTP hop | ✅ | Phases 05 / 08 / metadata reuse 11 |
| parallel/sequential fetching / waterfalls | ✅ | Phase 05; metadata applications Phase 11 |
| N+1 / batching / bounded fan-out | ✅ | Phase 05 |
| preloading / Promise sharing / React `cache` | ✅ | Phase 05; metadata reuse 11 |
| Suspense data streaming | ✅ | Phase 05 foundation; delivery depth 10 |
| React `use()` with streamed Promise | ✅ | Phases 05 / 10 |
| client-side fetching / SWR architecture | ✅ | Phase 05 |

## Caching, Rendering & Revalidation

| Area / API | Status | Notes |
| --- | --- | --- |
| default server `fetch` auto behavior | ✅ | Phase 06 |
| `cache: 'no-store'` / `force-cache` | ✅ | Phase 06 |
| `next.revalidate`, `next.tags` | ✅ | Phase 06 |
| React `cache` vs persistent Next.js cache | ✅ | Phases 05–06; metadata distinction 11 |
| Cache Components | ✅ | Cache contract 06; rendering 10; metadata/viewport interaction 11 |
| `'use cache'` | ✅ | Phase 06; metadata/viewport application 11 |
| `cacheLife`, `cacheTag` | ✅ | Phase 06 |
| `revalidateTag(tag, profile)` | ✅ | Phase 06; mutation workflow 07 |
| single-arg `revalidateTag(tag)` | ⚠️ | Deprecated |
| `updateTag`, `revalidatePath` | ✅ | Phases 06–07 |
| `refresh` from `next/cache` | ✅ | Phase 07 |
| previous-model route `dynamic` / `revalidate` / `fetchCache` | ✅ | Phase 06; disabled under Cache Components |
| `connection()` | ✅ | Phase 06 |
| `'use cache: private'` | 🧪 | Experimental |
| `'use cache: remote'`, `cacheHandlers` | ✅ | Phase 06; ops depth 17 |
| Partial Prerendering through Cache Components | ✅ | Cache semantics 06; rendering mechanics 10 |
| static shell / dynamic hole model | ✅ | Phase 10 |
| Client Router Cache vs server cache | ✅ | Phase 06; navigation rendering Phase 10 |
| generated metadata-route default caching | ✅ | Phase 11 |
| metadata/page/shared-domain invalidation reasoning | ✅ | Phase 11 baseline; ops depth 17 |

## Mutations, Forms & Server Functions

| Area | Status | Handbook location / plan |
| --- | --- | --- |
| Server Function / Server Action terminology | ✅ | Phase 07 |
| `'use server'` inline/module | ✅ | Phase 07 |
| form `action`, `formAction`, `FormData`, `bind` | ✅ | Phase 07 |
| progressive enhancement | ✅ | Phase 07 |
| validation / authorization / mass assignment | ✅ | Phase 07 baseline; security depth 13 |
| `useActionState`, `useFormStatus`, `useOptimistic` | ✅ | Phase 07 |
| mutation concurrency / idempotency / transactions | ✅ | Phase 07 |
| revalidation / refresh / redirect sequencing | ✅ | Phase 07 |
| Server Action response updates RSC UI | ✅ | Phase 07; reconciliation context Phase 10 |
| Server Function vs Route Handler | ✅ | Phases 07–08 |

## Route Handlers & HTTP

| Area | Status | Handbook location / plan |
| --- | --- | --- |
| `route.ts` convention / HTTP methods / 405 | ✅ | Phase 08 |
| Web `Request` / `Response` | ✅ | Phase 08 |
| `NextRequest` / `NextResponse` | ✅ | Phase 08; Proxy use Phase 09 |
| async params / `RouteContext` | ✅ | Phase 08 |
| JSON/form/text/binary body parsing | ✅ | Phase 08 |
| one-read streams / cloning | ✅ | Phase 08 |
| validation / content type / safe errors | ✅ | Phase 08 baseline |
| files/downloads / Web streams | ✅ | Phase 08 |
| GET not cached by default | ✅ | Phase 08 current 16.2 behavior |
| Cache Components Route Handler rendering | ✅ | Phase 08 |
| CORS / OPTIONS | ✅ | Phase 08; shared policy Phase 09 |
| webhooks / raw signatures / replay | ✅ | Phase 08 |
| rate limiting / SSRF / callback safety | ✅ | Phase 08 baseline; deep security 13 |
| BFF / public API versioning | ✅ | Phase 08 baseline; large-app depth 18 |
| specialized metadata Route Handler behavior | ✅ | Phase 11 |

## Proxy & Request Pipeline

| Area | Status | Handbook location / plan |
| --- | --- | --- |
| `proxy.ts` naming / single front-door convention | ✅ | Phase 09 |
| old `middleware.ts` | ⚠️ | Deprecated/migration-only in Next.js 16 |
| request execution order | ✅ | Phase 09 |
| matcher strings/arrays/regex | ✅ | Phase 09 |
| static matcher analysis | ✅ | Phase 09 |
| `has` / `missing` conditions | ✅ | Phase 09 |
| asset/API/prefetch matcher design | ✅ | Phase 09 |
| metadata-route matcher exclusions | ✅ | Phase 11 |
| `NextResponse.next()` | ✅ | Phase 09 |
| downstream request-header forwarding | ✅ | Phase 09 |
| response headers / cookies | ✅ | Phase 09 |
| redirects vs rewrites | ✅ | Phase 09; SEO redirect-vs-canonical context 11 |
| localization / host tenancy | ✅ | Phase 09 baseline; canonical/hreflang use 11; large-app depth 18 |
| optimistic auth gating | ✅ | Phase 09; authoritative auth remains Phase 13 |
| CSP nonce request pipeline | ✅ | Phase 09 baseline; security depth 13 |
| `NextFetchEvent.waitUntil()` | ✅ | Phase 09; not a durable queue |
| Proxy Node.js runtime | ✅ | Phase 09 |
| Proxy experimental test helpers | 🧪 | Phase 09; automated test depth 16 |
| `proxyClientMaxBodySize` | 🧪 | Experimental, Phase 09 baseline |

## Rendering, Suspense & Navigation Delivery

| Area / API | Status | Handbook location / plan |
| --- | --- | --- |
| server rendering orchestration | ✅ | Phase 10 |
| RSC Payload contents/purpose | ✅ | Phase 10 |
| HTML prerendering for initial load | ✅ | Phase 10 |
| Client Component hydration | ✅ | Phase 10 |
| hard vs soft navigation rendering | ✅ | Phase 10 |
| route-segment reconciliation / preserved layouts | ✅ | Phases 02 / 10 |
| `loading.tsx` as route Suspense/loading UI | ✅ | Phase 10 |
| manual `<Suspense>` boundaries | ✅ | Phase 10 |
| progressive streaming / sibling reveal | ✅ | Phase 10 |
| fallback design / accessibility baseline | ✅ | Phase 10; accessibility depth later |
| Cache Components static shells | ✅ | Phase 10 |
| request-time dynamic holes | ✅ | Phase 10 |
| cached subtrees entering shell | ✅ | Phases 06 / 10 |
| `use()` Promise suspension | ✅ | Phase 10 |
| server-started Promise → Client consumption | ✅ | Phase 10 |
| hydration mismatch categories | ✅ | Phase 10; diagnostics depth 14 |
| visible-before-interactive model | ✅ | Phase 10 |
| streamed error vs pending distinction | ✅ | Phase 10 |
| Suspense vs error boundary | ✅ | Phase 10; full error API depth 14 |
| late streamed failure / committed response implications | ✅ | Phase 10 baseline |
| reverse-proxy/CDN buffering consideration | ✅ | Phase 10 baseline; deployment depth 17 |
| RSC payload size vs client JS size | ✅ | Phase 10 baseline; performance depth 15 |
| rendering security / private data crossing RSC | ✅ | Phase 10 baseline; deep security 13 |
| production rendering design review | ✅ | Phase 10; performance/ops depth 15–17 |
| Next.js 16.3 Instant Navigations | 🧪 | Preview-only at baseline |

## Metadata & SEO

| Area / API | Status | Handbook location / plan |
| --- | --- | --- |
| static `metadata` object | ✅ | Phase 11 |
| `generateMetadata` | ✅ | Phase 11 |
| `Metadata` / `ResolvingMetadata` types | ✅ | Phase 11 |
| Server Component-only metadata exports | ✅ | Phase 11 |
| metadata + `generateMetadata` mutually exclusive per segment | ✅ | Phase 11 |
| route-tree metadata ordering | ✅ | Phase 11 |
| shallow metadata merging | ✅ | Phase 11 |
| explicit parent metadata extension | ✅ | Phase 11 |
| file-based metadata precedence | ✅ | Phase 11 |
| `params` / page `searchParams` in `generateMetadata` | ✅ | Phase 11 |
| `redirect()` / `notFound()` from metadata generation | ✅ | Phase 11 |
| title string / default / template / absolute | ✅ | Phase 11 |
| description | ✅ | Phase 11 |
| `metadataBase` / URL composition | ✅ | Phase 11 |
| `alternates.canonical` | ✅ | Phase 11 |
| language / media / content-type alternates | ✅ | Phase 11 |
| canonical vs redirect distinction | ✅ | Phase 11 |
| multi-tenant / preview canonical policy | ✅ | Phase 11 baseline; large-app/deployment depth 17–18 |
| Open Graph metadata | ✅ | Phase 11 |
| Twitter metadata | ✅ | Phase 11 |
| static OG/Twitter metadata files + alt files | ✅ | Phase 11 |
| generated OG/Twitter images with `ImageResponse` | ✅ | Phase 11; image API optimization depth 12 |
| `generateImageMetadata` | ✅ | Phase 11 |
| generated social-image cache/failure/security model | ✅ | Phase 11 baseline; deep ops/security 13/17 |
| favicon / icon / apple-icon conventions | ✅ | Phase 11 |
| generated icons | ✅ | Phase 11 |
| `manifest.json` / `manifest.ts` / `MetadataRoute.Manifest` | ✅ | Phase 11 |
| `robots` metadata object | ✅ | Phase 11 |
| `robots.txt` / `robots.ts` / `MetadataRoute.Robots` | ✅ | Phase 11 |
| robots crawl guidance vs authorization/noindex distinction | ✅ | Phase 11 |
| `sitemap.xml` / `sitemap.ts` / `MetadataRoute.Sitemap` | ✅ | Phase 11 |
| localized sitemap alternates | ✅ | Phase 11 |
| `generateSitemaps` | ✅ | Phase 11; Next 16 Promise&lt;string&gt; ID contract covered |
| sitemap partition/publication/freshness strategy | ✅ | Phase 11 baseline; performance/ops depth 15/17 |
| JSON-LD rendering | ✅ | Phase 11 |
| JSON-LD script-context XSS-safe serialization | ✅ | Phase 11 baseline; full XSS/security Phase 13 |
| JSON-LD typing with community schema types | ✅ | Phase 11; clearly labeled non-core package |
| verification metadata | ✅ | Phase 11 |
| authors / creator / publisher / keywords / referrer / formatDetection | ✅ | Phase 11 |
| App Links | ✅ | Phase 11 |
| Facebook / Pinterest / `other` metadata | ✅ | Phase 11 baseline |
| archives / assets / bookmarks / category | ✅ | Phase 11 baseline |
| deprecated `metadata.viewport` | ⚠️ | Deprecated since Next.js 14; Phase 11 uses dedicated viewport API |
| static `viewport` object | ✅ | Phase 11 |
| `generateViewport` | ✅ | Phase 11 |
| themeColor / colorScheme / viewport sizing fields | ✅ | Phase 11 |
| viewport Cache Components behavior | ✅ | Phase 11 |
| streaming metadata | ✅ | Phase 11 |
| HTML-limited bot blocking metadata | ✅ | Phase 11 |
| `htmlLimitedBots` | ✅ | Phase 11; advanced override, default preferred |
| metadata Cache Components behavior | ✅ | Phase 11 |
| crawler/social metadata performance model | ✅ | Phase 11 baseline; deep measurement Phase 15 |
| unsupported metadata → HTTP headers / ReactDOM resource hints / page markup | ✅ | Phase 11 boundary model |
| metadata/SEO production architecture and incident review | ✅ | Phase 11; deep observability/testing/ops later |

## Images, Fonts & Scripts

| Area | Status | Planned phase |
| --- | --- | --- |
| social metadata images | ✅ | Phase 11 metadata role |
| `ImageResponse` for metadata images | ✅ | Phase 11 metadata role |
| `next/image` optimization | 🟡 | Phase 12 |
| remote image configuration / loaders | 🟡 | Phase 12 |
| `next/font` | 🟡 | Phase 12 |
| `next/script` / third-party scripts | 🟡 | Phase 12 |
| resource-loading performance strategy | 🟠 | Resource-hint boundary introduced Phase 11; full Phase 12/15 |

## Security

| Area | Status | Planned phase |
| --- | --- | --- |
| auth vs authorization distinction | ✅ | Baselines 07–09; full Phase 13 |
| server/client DTO minimization | ✅ | Phases 04–05 / 10 |
| cache isolation / tenant keys | ✅ | Phase 06 baseline; deep 13 |
| action/API validation and authorization | ✅ | Phases 07–08 baseline; deep 13 |
| Proxy not sole authorization boundary | ✅ | Phase 09 |
| RSC/HTML must not contain unauthorized private data | ✅ | Phase 10 baseline; deep 13 |
| metadata/social/JSON-LD must not leak private/unpublished data | ✅ | Phase 11 baseline; deep 13 |
| metadata canonical host validation | ✅ | Phase 11 using Phase 09 host trust model |
| JSON-LD HTML script-context injection defense | ✅ | Phase 11 baseline; deep XSS Phase 13 |
| OG remote-asset SSRF prevention | ✅ | Phase 11 baseline; deep Phase 13 |
| CSP / CSRF / broad XSS / secrets | 🟠 | Baselines exist; full Phase 13 |

## Errors, Observability & Debugging

| Area | Status | Planned phase |
| --- | --- | --- |
| route boundary placement | ✅ | Phase 02 baseline |
| mutation/API failure models | ✅ | Phases 07–08 |
| Proxy debugging/runbooks | ✅ | Phase 09 baseline |
| streaming pending vs failure model | ✅ | Phase 10 |
| streamed subtree isolation / retry policy | ✅ | Phase 10 baseline |
| hydration mismatch debugging | ✅ | Phase 10 baseline |
| metadata/canonical/social/sitemap/robots debugging runbooks | ✅ | Phase 11 baseline |
| crawler-specific response debugging | ✅ | Phase 11 baseline |
| structured logs / OpenTelemetry / instrumentation | 🟠 | Baselines through 11; full Phase 14 |
| browser hydration/runtime error observability | 🟠 | Phase 10 model; full Phase 14 |

## Performance

| Area | Status | Planned phase |
| --- | --- | --- |
| data waterfalls / N+1 | ✅ | Phase 05 |
| cache architecture | ✅ | Phase 06 |
| mutation critical path | ✅ | Phase 07 baseline |
| HTTP/Proxy critical path | ✅ | Phases 08–09 baseline |
| shell timing / streaming boundary timing | ✅ | Phase 10 baseline |
| RSC bytes / client JS / hydration CPU separation | ✅ | Phase 10 baseline |
| metadata/crawler critical path and cache-hit reasoning | ✅ | Phase 11 baseline |
| generated OG/sitemap load model | ✅ | Phase 11 baseline |
| measurement budgets / Web Vitals / profiling | 🟠 | Multiple baselines; deep Phase 15 |

## Testing & Production

| Area | Status | Planned phase |
| --- | --- | --- |
| production Docusaurus build validation | ✅ | Handbook workflow through Phase 11 |
| Server/Client/data/cache/action/API/Proxy test scenarios | 🟠 | Failure cases defined; automation Phase 16 |
| hard vs soft navigation rendering tests | 🟠 | Test matrix Phase 10; automation Phase 16 |
| streaming/hydration E2E | 🟠 | Behavior defined Phase 10; automation Phase 16 |
| metadata/canonical/robots/sitemap/social smoke-test matrix | ✅ | Phase 11 specification; automation Phase 16 |
| preview/staging SEO safety policy | ✅ | Phase 11 baseline; deployment implementation Phase 17 |
| deployment streaming/CDN verification | 🟠 | Phase 10/11 baselines; full Phase 17 |
| Node/self-hosting/serverless/adapters | 🟠 | Runtime implications introduced; full Phase 17 |

## Upgrades & Migration

| Area | Status | Planned phase |
| --- | --- | --- |
| App Router upgrade workflow | 🟠 | 01 / 20 |
| client-heavy SPA → server-first migration | 🟠 | Phases 04–11; deep 20 |
| previous cache model → Cache Components | 🟠 | Phase 06; deep 20 |
| old standalone PPR/dynamicIO/useCache flags | ⚠️ | Migration-only; modern rendering uses Cache Components |
| old GET Route Handler cached-by-default assumptions | ⚠️ | Phase 08 teaches current behavior |
| `middleware.ts` → `proxy.ts` | ⚠️ | Semantics Phase 09; migration playbook 20 |
| `metadata.viewport` → viewport export / `generateViewport` | ⚠️ | Phase 11 current API; migration depth Phase 20 |
| older synchronous `generateSitemaps` ID assumptions | ⚠️ | Phase 11 teaches Next 16 Promise&lt;string&gt; ID |
| Pages API Routes / Pages Router migration | ⛔ | Outside scope |

## Phase 10 completion note

Phase 10 is complete for stable App Router rendering delivery: RSC/HTML/hydration, hard vs soft navigation, Suspense/loading, Cache Components shells/dynamic holes, `use()` Promise streaming, Client Component hydration, streamed failures, and rendering diagnostics/design review.

## Phase 11 completion note

Phase 11 is complete for stable metadata and SEO behavior because it teaches:

- static `metadata`, dynamic `generateMetadata`, Server Component ownership, async params/search params, parent resolution, ordering, shallow merging, and file-based precedence
- title defaults/templates/absolute titles, descriptions, `metadataBase`, canonical URLs, language/content alternates, redirect-vs-canonical decisions, preview hosts, and multi-tenant URL identity
- Open Graph/Twitter metadata, static social-image files and alt text, generated `ImageResponse` cards, `generateImageMetadata`, caching/failure/SSRF/public-data considerations
- favicon/icon/apple-icon conventions, generated icons, manifests, metadata-route caching, Proxy exclusions, base-path/multi-zone ownership, and public-resource testing
- page-level robots metadata, `robots.txt`/`robots.ts`, crawl-vs-index-vs-auth distinctions, sitemaps, localized alternates, `generateSitemaps`, publication lifecycle, large-site partitioning, and freshness
- JSON-LD from public domain models, canonical consistency, Schema.org typing context, and HTML script-context XSS-safe serialization
- broader Metadata fields, verification, App Links, platform/custom metadata, dedicated `viewport` / `generateViewport`, accessibility-aware viewport policy, HTTP-header boundaries, and ReactDOM resource hints
- streaming metadata, HTML-limited bot blocking, `htmlLimitedBots`, Cache Components metadata/viewport behavior, memoization/cache distinctions, crawler critical-path performance, and failure fallbacks
- production SEO architecture across content lifecycle, locales, tenants, previews, redirects, Proxy, caches, observability, smoke tests, and senior design review

Phase 12 owns `next/image`, `next/font`, `next/script`, and resource optimization. Full security, observability, performance measurement, automated testing, and deployment operations remain Phases 13–17.

## Completion rule

The handbook is not complete until this contract is re-audited against the then-current stable Next.js docs and every stable in-scope item has a justified final state.

See [Final Completeness Audit](./final-completeness-audit.md) for the release gate.
