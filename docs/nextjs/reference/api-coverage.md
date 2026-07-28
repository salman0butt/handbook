---
title: API Coverage Contract
description: Living coverage map from the current Next.js App Router documentation to this handbook.
---

# Next.js App Router API Coverage Contract

This is the handbook's living completeness contract against the **current stable Next.js App Router documentation**.

**Baseline re-verified: July 28, 2026 — Next.js 16.2.12 (`latest`, 16.x Active LTS).**

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
| Pages Router | ⛔ | Intentionally excluded except migration/history context |
| Next.js 16.2 stable behavior | 🟠 | Core routing, data, cache, mutations, HTTP, Proxy, rendering, metadata/SEO, images, fonts, and scripts complete; later phases cover security/ops/architecture/testing depth |
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
| 12 · Images, Fonts & Scripts | ✅ |
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
| Image Optimization | ✅ | `12-images-fonts-and-scripts/*` |
| Font Optimization | ✅ | `12-images-fonts-and-scripts/*` |
| Script / third-party loading | ✅ | `12-images-fonts-and-scripts/*`; experimental helpers labeled 🧪 |
| Error Handling | 🟠 | Failure models covered through 12; deep Phase 14 |
| CSS / styling integration | 🟠 | Framework basics exist; design-system styling is not a dedicated Next.js phase |
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
| `global-not-found` | 🧪 | Experimental at current baseline |
| `default` | ✅ | Phase 02 |
| `route` | ✅ | Phase 08 |
| `proxy` | ✅ | Phase 09 |
| dynamic/catch-all/optional catch-all | ✅ | Phase 02 |
| async `params` | ✅ | Phases 02 / 08 / metadata use 11 |
| `generateStaticParams`, `dynamicParams` | ✅ | Phases 02 / 06 / 08 |
| Route Groups / Private Folders | ✅ | Phase 02 |
| Parallel / Intercepting Routes | ✅ | Phase 02; navigation/render context Phase 10 |
| `favicon.ico`, `icon`, `apple-icon` | ✅ | Phase 11 |
| generated icon / social image conventions | ✅ | Phase 11 |
| `manifest`, `robots`, `sitemap` | ✅ | Phase 11 |
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
| hydration / interaction readiness | ✅ | Phase 10 |
| hydration mismatch mental model | ✅ | Phase 10; diagnostics depth 14 |
| RSC Payload | ✅ | Phase 10 |
| Image/Font usage without unnecessary client boundaries | ✅ | Phase 12 |
| Script lifecycle callbacks require client boundary | ✅ | Phase 12 |

## Data Fetching

| Area | Status | Handbook location / plan |
| --- | --- | --- |
| Async Server Components / server data ownership | ✅ | Phase 05 |
| server `fetch` | ✅ | Fetching 05; cache semantics 06 |
| direct DB/ORM/SDK reads | ✅ | Phase 05 |
| avoid own Route Handler HTTP hop | ✅ | Phases 05 / 08 |
| parallel/sequential fetching / waterfalls | ✅ | Phase 05 |
| N+1 / batching / bounded fan-out | ✅ | Phase 05 |
| preloading / Promise sharing / React `cache` | ✅ | Phase 05 |
| Suspense data streaming | ✅ | Phase 05 foundation; delivery depth 10 |
| React `use()` with streamed Promise | ✅ | Phases 05 / 10 |
| client-side fetching / SWR architecture | ✅ | Phase 05 |

## Caching, Rendering & Revalidation

| Area / API | Status | Notes |
| --- | --- | --- |
| default server `fetch` auto behavior | ✅ | Phase 06 |
| `cache: 'no-store'` / `force-cache` | ✅ | Phase 06 |
| `next.revalidate`, `next.tags` | ✅ | Phase 06 |
| React `cache` vs persistent Next.js cache | ✅ | Phases 05–06 |
| Cache Components | ✅ | Cache contract 06; rendering 10; metadata 11 |
| `'use cache'`, `cacheLife`, `cacheTag` | ✅ | Phase 06 |
| `revalidateTag(tag, profile)` | ✅ | Phase 06; mutation workflow 07 |
| single-arg `revalidateTag(tag)` | ⚠️ | Deprecated |
| `updateTag`, `revalidatePath`, `refresh` | ✅ | Phases 06–07 |
| previous-model `dynamic` / `revalidate` / `fetchCache` | ✅ | Phase 06; disabled under Cache Components |
| `connection()` | ✅ | Phase 06 |
| `'use cache: private'` | 🧪 | Experimental |
| `'use cache: remote'`, `cacheHandlers` | ✅ | Phase 06; ops depth 17 |
| Partial Prerendering through Cache Components | ✅ | Phase 06 / 10 |
| Client Router Cache vs server cache | ✅ | Phase 06 / 10 |
| image optimizer cache vs application cache distinction | ✅ | Phase 12 |

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
| Server Action response updates RSC UI | ✅ | Phase 07; reconciliation context 10 |
| Server Function vs Route Handler | ✅ | Phases 07–08 |

## Route Handlers & HTTP

| Area | Status | Handbook location / plan |
| --- | --- | --- |
| `route.ts` convention / HTTP methods / 405 | ✅ | Phase 08 |
| Web `Request` / `Response` | ✅ | Phase 08 |
| `NextRequest` / `NextResponse` | ✅ | Phase 08; Proxy use 09 |
| async params / `RouteContext` | ✅ | Phase 08 |
| JSON/form/text/binary body parsing | ✅ | Phase 08 |
| validation / content type / safe errors | ✅ | Phase 08 baseline |
| files/downloads / Web streams | ✅ | Phase 08 |
| GET not cached by default | ✅ | Phase 08 current 16.2 behavior |
| Cache Components Route Handler rendering | ✅ | Phase 08 |
| CORS / OPTIONS | ✅ | Phase 08; shared policy Phase 09 |
| webhooks / raw signatures / replay | ✅ | Phase 08 |
| rate limiting / SSRF / callback safety | ✅ | Phase 08 baseline; deep security 13 |
| BFF / public API versioning | ✅ | Phase 08 baseline; large-app depth 18 |

## Proxy & Request Pipeline

| Area | Status | Handbook location / plan |
| --- | --- | --- |
| `proxy.ts` naming / single front-door convention | ✅ | Phase 09 |
| old `middleware.ts` | ⚠️ | Deprecated/migration-only in Next.js 16 |
| request execution order | ✅ | Phase 09 |
| matcher strings/arrays/regex / static analysis | ✅ | Phase 09 |
| `has` / `missing` conditions | ✅ | Phase 09 |
| asset/API/prefetch matcher design | ✅ | Phase 09 |
| `NextResponse.next()` / header forwarding | ✅ | Phase 09 |
| redirects / rewrites / cookies | ✅ | Phase 09 |
| localization / host tenancy | ✅ | Phase 09 baseline; deep Phase 18 |
| optimistic auth gating | ✅ | Phase 09; authoritative auth Phase 13 |
| CSP nonce request pipeline | ✅ | Phase 09 baseline; security depth 13 |
| `NextFetchEvent.waitUntil()` | ✅ | Phase 09; not a durable queue |
| Proxy Node.js runtime | ✅ | Phase 09 |
| Proxy experimental test helpers | 🧪 | Phase 09; automated depth 16 |
| `proxyClientMaxBodySize` | 🧪 | Experimental |

## Rendering, Suspense & Navigation Delivery

| Area / API | Status | Handbook location / plan |
| --- | --- | --- |
| server rendering orchestration / RSC Payload / initial HTML | ✅ | Phase 10 |
| Client Component hydration | ✅ | Phase 10 |
| hard vs soft navigation / route reconciliation | ✅ | Phase 10 |
| `loading.tsx` / manual `<Suspense>` | ✅ | Phase 10 |
| progressive streaming / sibling reveal | ✅ | Phase 10 |
| Cache Components static shells / dynamic holes | ✅ | Phase 10 |
| `use()` Promise suspension | ✅ | Phase 10 |
| hydration mismatch categories | ✅ | Phase 10; diagnostics depth 14 |
| streamed failure / response-commit implications | ✅ | Phase 10 baseline |
| reverse-proxy/CDN buffering consideration | ✅ | Phase 10 baseline; deployment depth 17 |
| RSC bytes vs client JS vs hydration CPU | ✅ | Phase 10 baseline; performance depth 15 |
| Next.js 16.3 Instant Navigations | 🧪 | Preview-only at current baseline |

## Metadata & SEO

| Area / API | Status | Handbook location / plan |
| --- | --- | --- |
| static `metadata` / dynamic `generateMetadata` | ✅ | Phase 11 |
| Metadata / ResolvingMetadata types and Server Component ownership | ✅ | Phase 11 |
| ordering / shallow merging / parent extension / file precedence | ✅ | Phase 11 |
| titles / descriptions / `metadataBase` / canonical / alternates | ✅ | Phase 11 |
| Open Graph / Twitter metadata | ✅ | Phase 11 |
| generated social images / `ImageResponse` / `generateImageMetadata` | ✅ | Phase 11 metadata role; general image optimization Phase 12 |
| icons / manifest | ✅ | Phase 11 |
| robots / sitemap / `generateSitemaps` | ✅ | Phase 11 |
| JSON-LD / script-context safe serialization baseline | ✅ | Phase 11; deep XSS Phase 13 |
| verification / App Links / broader metadata fields | ✅ | Phase 11 |
| `viewport` / `generateViewport` | ✅ | Phase 11 |
| deprecated `metadata.viewport` | ⚠️ | Use dedicated viewport APIs |
| streaming metadata / HTML-limited bots / `htmlLimitedBots` | ✅ | Phase 11 |
| metadata Cache Components behavior | ✅ | Phase 11 |
| ReactDOM resource-hint boundary | ✅ | Introduced 11; integrated into resource strategy Phase 12 |

## Images

| Area / API | Status | Handbook location / notes |
| --- | --- | --- |
| `next/image` / `Image` | ✅ | Phase 12 |
| intrinsic `width` / `height` vs rendered CSS size | ✅ | Phase 12 |
| static image imports / inferred dimensions | ✅ | Phase 12 |
| static raster blur metadata | ✅ | Phase 12 |
| public-path images | ✅ | Phase 12 |
| remote image geometry requirement | ✅ | Phase 12 |
| `fill` / parent geometry / `object-fit` | ✅ | Phase 12 |
| `alt` semantic/decorative policy | ✅ | Phase 12 |
| `sizes` / `srcset` / responsive candidate selection | ✅ | Phase 12 |
| default lazy loading | ✅ | Phase 12 |
| `loading="eager"` / `fetchPriority` | ✅ | Phase 12 |
| `preload` | ✅ | Current Next.js 16 API, Phase 12 |
| `priority` | ⚠️ | Deprecated in Next.js 16; migration context only |
| placeholders / `blurDataURL` | ✅ | Phase 12 |
| `quality` and `images.qualities` allow-list | ✅ | Next.js 16 default `[75]`; Phase 12 |
| `deviceSizes` / `imageSizes` candidate policy | ✅ | Phase 12 |
| `remotePatterns` | ✅ | Phase 12 security boundary |
| `localPatterns` / local-query restrictions | ✅ | Phase 12; Next.js 16 hardening covered |
| legacy `images.domains` | ⚠️ | Deprecated in favor of `remotePatterns` |
| authenticated remote-source architecture | ✅ | Optimizer does not forward arbitrary request headers; Phase 12 |
| `unoptimized` | ✅ | Phase 12 |
| `onLoad` / `onError` client callbacks | ✅ | Phase 12 |
| `onLoadingComplete` | ⚠️ | Deprecated; use `onLoad` |
| WebP/default format negotiation | ✅ | Phase 12 |
| AVIF trade-off | ✅ | Phase 12 |
| reverse-proxy/CDN `Accept` forwarding | ✅ | Phase 12 baseline; ops depth 17 |
| `minimumCacheTTL` | ✅ | Current default 14,400s; Phase 12 |
| immutable/versioned source identity | ✅ | Phase 12 |
| `maximumRedirects` | ✅ | Current default 3; Phase 12 |
| `dangerouslyAllowLocalIP` | ✅ | Security-sensitive; false by default |
| source response-body limit / `maximumResponseBody` | ✅ | Current stable resource control, Phase 12 |
| image disk cache / `maximumDiskCacheSize` | ✅ | Current stable resource control, Phase 12 |
| custom image cache-handler ownership | ✅ | Phase 12 baseline; ops depth 17 |
| SVG / `dangerouslyAllowSVG` / CSP / disposition | ✅ | Phase 12 baseline; deep security 13 |
| custom `loader` / `loaderFile` | ✅ | Phase 12 |
| `getImageProps()` | ✅ | Phase 12 |
| `<picture>` / art direction | ✅ | Phase 12 using Web platform + Next helper |
| `overrideSrc` | ✅ | Migration/compatibility use, Phase 12 |
| animated image considerations | ✅ | Phase 12 |
| static export image strategy | ✅ | Custom loader / unoptimized / pre-generated variants; Phase 12 |
| `next/legacy/image` | ⚠️ | Legacy/migration-only |
| image LCP / candidate / cache debugging | ✅ | Phase 12 baseline; performance depth 15 |

## Fonts

| Area / API | Status | Handbook location / notes |
| --- | --- | --- |
| `next/font/google` | ✅ | Phase 12 |
| build-time download + self-hosted runtime delivery | ✅ | Phase 12 |
| `next/font/local` | ✅ | Phase 12 |
| variable fonts | ✅ | Recommended where practical; Phase 12 |
| static font weights/styles | ✅ | Phase 12 |
| `subsets` | ✅ | Phase 12 |
| `display` / default `swap` | ✅ | Phase 12 |
| `preload` / route-layout scope | ✅ | Phase 12 |
| `fallback` | ✅ | Phase 12 |
| `adjustFontFallback` | ✅ | Phase 12 |
| `axes` | ✅ | Phase 12 |
| generated `className` / `style` / `variable` | ✅ | Phase 12 |
| local `declarations` | ✅ | Phase 12 |
| CSS-variable / design-token integration | ✅ | Phase 12 |
| centralized font instances | ✅ | Phase 12 architecture |
| multilingual/subset ownership | ✅ | Phase 12 baseline |
| font failure / FOUT / FOIT / CLS debugging | ✅ | Phase 12 baseline; measurement depth 15 |
| font CSP / cross-origin deployment considerations | ✅ | Phase 12 baseline; security/ops depth 13/17 |

## Scripts & Third Parties

| Area / API | Status | Handbook location / notes |
| --- | --- | --- |
| `next/script` / `Script` | ✅ | Phase 12 |
| route/layout script scope / load-once behavior | ✅ | Phase 12 |
| `afterInteractive` | ✅ | Default strategy; Phase 12 |
| `lazyOnload` | ✅ | Phase 12 |
| `beforeInteractive` | ✅ | Root-layout critical-global use only; Phase 12 |
| `worker` strategy | 🧪 | Experimental and not supported for the App Router workflow; not taught as production primitive |
| inline `Script` + required `id` | ✅ | Phase 12 |
| `onLoad` | ✅ | Client callback, Phase 12 |
| `onReady` | ✅ | Remount/readiness semantics, Phase 12 |
| `onError` | ✅ | Client callback/failure isolation, Phase 12 |
| callback/client-boundary constraints | ✅ | Phase 12 |
| nonce / custom script attributes | ✅ | Phase 12 baseline; CSP depth 13 |
| script readiness adapter pattern | ✅ | Phase 12 architecture |
| third-party route scoping / failure isolation | ✅ | Phase 12 |
| analytics pageview ownership under soft navigation | ✅ | Phase 12 |
| consent-aware loading architecture | ✅ | Phase 12 engineering baseline; jurisdiction policy external |
| data minimization / URL privacy | ✅ | Phase 12 baseline; deep security 13 |
| tag-manager supply-chain governance | ✅ | Phase 12 baseline |
| iframe/embed facade strategy | ✅ | Phase 12 |
| server-vs-client analytics event ownership | ✅ | Phase 12 |
| `@next/third-parties` | 🧪 | Experimental at current 16.2.12 snapshot |
| Google Analytics / GTM helpers | 🧪 | Via experimental package; Phase 12 context |
| Maps / YouTube helpers | 🧪 | Via experimental package; Phase 12 context |

## Resource Loading

| Area / API | Status | Handbook location / notes |
| --- | --- | --- |
| framework-managed image/font/script loading | ✅ | Phase 12 |
| ReactDOM `preconnect` | ✅ | Phase 11 boundary; Phase 12 resource strategy |
| ReactDOM `prefetchDNS` | ✅ | Phase 11 boundary; Phase 12 resource strategy |
| ReactDOM `preload` | ✅ | Phase 11 boundary; Phase 12 resource strategy |
| manual hint vs framework-owned hint decision | ✅ | Phase 12 |
| route-specific resource budgets | ✅ | Phase 12 baseline; measurement depth 15 |
| hard vs soft navigation resource behavior | ✅ | Phases 10 / 12 |
| cold vs warm cache reasoning | ✅ | Phase 12 baseline |
| images/fonts/scripts as shared browser critical path | ✅ | Phase 12 design review |
| measurement → diagnosis → change → measurement | ✅ | Phase 12 baseline; full Phase 15 |

## Security

| Area | Status | Planned phase |
| --- | --- | --- |
| auth vs authorization distinction | ✅ | Baselines 07–09; full Phase 13 |
| server/client DTO minimization | ✅ | Phases 04–05 / 10 |
| cache isolation / tenant keys | ✅ | Phase 06 baseline; deep 13 |
| action/API validation and authorization | ✅ | Phases 07–08 baseline; deep 13 |
| Proxy not sole authorization boundary | ✅ | Phase 09 |
| RSC/HTML private-data exclusion | ✅ | Phase 10 baseline; deep 13 |
| metadata/social/JSON-LD public-data safety | ✅ | Phase 11 baseline; deep 13 |
| image optimizer SSRF / remote-source allow-list | ✅ | Phase 12 baseline; deep Phase 13 |
| local/private IP image protection | ✅ | Phase 12 |
| SVG active-content security | ✅ | Phase 12 baseline; deep 13 |
| third-party script supply chain / CSP / consent boundaries | ✅ | Phase 12 baseline; deep 13 |
| CSP / CSRF / broad XSS / secrets | 🟠 | Strong baselines exist; full Phase 13 |

## Errors, Observability & Debugging

| Area | Status | Planned phase |
| --- | --- | --- |
| route boundary placement | ✅ | Phase 02 baseline |
| mutation/API failure models | ✅ | Phases 07–08 |
| Proxy debugging/runbooks | ✅ | Phase 09 baseline |
| streaming / hydration failure models | ✅ | Phase 10 baseline |
| metadata/canonical/social/crawler runbooks | ✅ | Phase 11 baseline |
| image layout/candidate/optimizer/source/CDN debugging | ✅ | Phase 12 baseline |
| font fallback/preload/CLS debugging | ✅ | Phase 12 baseline |
| script readiness/vendor failure/long-task debugging | ✅ | Phase 12 baseline |
| structured logs / OpenTelemetry / instrumentation | 🟠 | Baselines through 12; full Phase 14 |
| browser/runtime observability | 🟠 | Models exist; full Phase 14 |

## Performance

| Area | Status | Planned phase |
| --- | --- | --- |
| data waterfalls / N+1 | ✅ | Phase 05 |
| cache architecture | ✅ | Phase 06 |
| mutation critical path | ✅ | Phase 07 baseline |
| HTTP/Proxy critical path | ✅ | Phases 08–09 baseline |
| shell timing / RSC / hydration cost separation | ✅ | Phase 10 baseline |
| metadata/crawler critical path | ✅ | Phase 11 baseline |
| responsive image bytes / LCP priority / decode reasoning | ✅ | Phase 12 baseline |
| font preload / swap / route-scope cost | ✅ | Phase 12 baseline |
| third-party JS / long-task / route-scope cost | ✅ | Phase 12 baseline |
| resource waterfall / hints / cold-warm cache review | ✅ | Phase 12 baseline |
| Web Vitals / profiling / budgets / RUM | 🟠 | Multiple baselines; deep Phase 15 |

## Testing & Production

| Area | Status | Planned phase |
| --- | --- | --- |
| production Docusaurus build validation | ✅ | Handbook workflow through Phase 11; Phase 12 gated by current PR CI |
| Server/Client/data/cache/action/API/Proxy scenarios | 🟠 | Failure cases defined; automation Phase 16 |
| hard vs soft navigation rendering tests | 🟠 | Matrix Phase 10; automation Phase 16 |
| streaming/hydration E2E | 🟠 | Behavior defined Phase 10; automation Phase 16 |
| metadata/SEO smoke-test matrix | ✅ | Phase 11 specification; automation Phase 16 |
| image candidate/optimizer/failure scenarios | ✅ | Phase 12 specification; automation Phase 16 |
| font failure/preload/locale scenarios | ✅ | Phase 12 specification; automation Phase 16 |
| script strategy/blocked-vendor/navigation scenarios | ✅ | Phase 12 specification; automation Phase 16 |
| static-export image architecture | ✅ | Phase 12 baseline; deployment depth 17 |
| deployment streaming/CDN/image-format verification | 🟠 | Baselines 10–12; full Phase 17 |
| Node/self-hosting/serverless/adapters | 🟠 | Runtime implications introduced; full Phase 17 |

## Upgrades & Migration

| Area | Status | Planned phase |
| --- | --- | --- |
| App Router upgrade workflow | 🟠 | 01 / 20 |
| client-heavy SPA → server-first migration | 🟠 | Phases 04–12; deep 20 |
| previous cache model → Cache Components | 🟠 | Phase 06; deep 20 |
| old standalone PPR/dynamicIO/useCache flags | ⚠️ | Migration-only; modern rendering uses Cache Components |
| old GET Route Handler cached-by-default assumptions | ⚠️ | Phase 08 teaches current behavior |
| `middleware.ts` → `proxy.ts` | ⚠️ | Semantics Phase 09; migration playbook 20 |
| `metadata.viewport` → viewport export / `generateViewport` | ⚠️ | Phase 11 current API; migration depth 20 |
| old Image `priority` usage | ⚠️ | Phase 12 teaches Next.js 16 `preload`/loading model |
| `images.domains` | ⚠️ | Prefer `remotePatterns` |
| `onLoadingComplete` | ⚠️ | Prefer `onLoad` |
| `next/legacy/image` | ⚠️ | Migration-only |
| Pages API Routes / Pages Router migration | ⛔ | Outside handbook scope except contextual comparison |

## Phase 10 completion note

Phase 10 is complete for stable App Router rendering delivery: RSC/HTML/hydration, hard vs soft navigation, Suspense/loading, Cache Components shells/dynamic holes, `use()` Promise streaming, Client Component hydration, streamed failures, and rendering diagnostics/design review.

## Phase 11 completion note

Phase 11 is complete for stable metadata and SEO behavior: Metadata API ownership/merging, canonical/alternate URL identity, social metadata and generated images, icons/manifests, robots/sitemaps, JSON-LD, viewport, streaming metadata, Cache Components interactions, and production crawler/SEO architecture.

## Phase 12 completion note

Phase 12 is complete for current stable resource optimization because it teaches:

- `next/image` source/geometry semantics, static imports, remote images, `fill`, `sizes`, responsive candidate selection, alt text, placeholders, loading/eager/high-priority behavior, current `preload`, deprecated `priority`, and LCP reasoning
- image optimizer trust/configuration: remote/local patterns, quality and width cardinality, WebP/AVIF negotiation, `Accept` forwarding, local-IP blocking, redirect bounds, source-response limits, disk-cache controls, cache/version identity, SVG protections, custom loaders, authenticated-source architecture, and abuse considerations
- advanced image delivery with `getImageProps()`, `<picture>` art direction, `overrideSrc`, custom CDN loaders, static export, pre-generated variants, signed/private/user-generated media boundaries, and production diagnostics
- `next/font/google` and `next/font/local`, variable/static files, weights/styles/subsets, display strategies, fallbacks and metric adjustment, axes/declarations, CSS variables, design tokens, route/layout preload scope, multilingual typography, cache identity, CSP/deployment considerations, and font/CLS debugging
- `next/script` strategy and scope: `beforeInteractive`, `afterInteractive`, `lazyOnload`, inline IDs, lifecycle callbacks/client boundaries, navigation/remount readiness, CSP nonces, route-level ownership, failure isolation, and third-party performance
- analytics/third-party architecture: adapter/event schema, soft-navigation pageviews, consent-aware loading, data minimization, tag-manager supply-chain controls, CSP/SRI context, iframe/facade patterns, client-vs-server event ownership, and explicit labeling of `@next/third-parties` as experimental
- a unified resource-loading model covering ReactDOM hints, browser scheduling, cold/warm cache, hard/soft navigation, route budgets, shared critical-path trade-offs, debugging evidence, and measurement-driven design review

Phase 13 now owns full Authentication, Authorization & Security depth. Observability, performance measurement, automated testing, and deployment operations remain Phases 14–17.

## Completion rule

The handbook is not complete until this contract is re-audited against the then-current stable Next.js docs and every stable in-scope item has a justified final state.

See [Final Completeness Audit](./final-completeness-audit.md) for the release gate.
