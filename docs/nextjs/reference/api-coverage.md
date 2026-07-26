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
| Next.js 16.2 stable behavior | 🟠 | Core routing, data, cache, mutations, HTTP, Proxy, and rendering delivery complete; later phases cover remaining platform APIs and operations |
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
| Error Handling | 🟠 | Route/data/action/API/stream failure models covered; deep Phase 14 |
| CSS / styling integration | 🟡 | Framework behavior only |
| Image Optimization | 🟡 | Phase 12 |
| Font Optimization | 🟡 | Phase 12 |
| Metadata and OG Images | 🟡 | Phase 11 |
| Deploying | 🟠 | Runtime implications introduced; full Phase 17 |
| Upgrading | 🟠 | Baseline introduced; deep Phase 20 |

## Routing & File Conventions

| API / convention | Status | Handbook location / plan |
| --- | --- | --- |
| `app/` route tree | ✅ | Phases 01–02 |
| `page`, `layout`, multiple root layouts | ✅ | Phase 02 |
| `template` | ✅ | Phase 02 |
| `loading` | ✅ | Phase 02 semantics; rendering/streaming depth Phase 10 |
| `error`, `global-error` | 🟠 | Boundary baseline 02/10; deep Phase 14 |
| `not-found` | ✅ | Phase 02 |
| `global-not-found` | 🧪 | Experimental at baseline |
| `default` | ✅ | Phase 02 |
| `route` | ✅ | Phase 08 |
| `proxy` | ✅ | Phase 09 |
| dynamic/catch-all/optional catch-all | ✅ | Phase 02 |
| async `params` | ✅ | Phases 02 / 08 |
| `generateStaticParams`, `dynamicParams` | ✅ | Phases 02 / 06 / 08 |
| Route Groups / Private Folders | ✅ | Phase 02 |
| Parallel / Intercepting Routes | ✅ | Phase 02; navigation/render context Phase 10 |
| `instrumentation`, `instrumentation-client` | 🟡 | Phase 14 |
| Metadata files | 🟡 | Phase 11 |

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
| RSC transport security/data-minimization model | ✅ | Phase 10 baseline; deep security 13 |

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
| Cache Components | ✅ | Cache contract Phase 06; shell/dynamic-hole rendering Phase 10 |
| `'use cache'` | ✅ | Phase 06 |
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
| `NextResponse.next()` | ✅ | Phase 09 |
| downstream request-header forwarding | ✅ | Phase 09 |
| response headers / cookies | ✅ | Phase 09 |
| redirects vs rewrites | ✅ | Phase 09 |
| localization / host tenancy | ✅ | Phase 09 baseline; large-app depth 18 |
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

## Security

| Area | Status | Planned phase |
| --- | --- | --- |
| auth vs authorization distinction | ✅ | Baselines 07–09; full Phase 13 |
| server/client DTO minimization | ✅ | Phases 04–05 / 10 |
| cache isolation / tenant keys | ✅ | Phase 06 baseline; deep 13 |
| action/API validation and authorization | ✅ | Phases 07–08 baseline; deep 13 |
| Proxy not sole authorization boundary | ✅ | Phase 09 |
| RSC/HTML must not contain unauthorized private data | ✅ | Phase 10 baseline; deep 13 |
| CSP / CSRF / XSS / secrets | 🟠 | Baselines exist; full Phase 13 |

## Errors, Observability & Debugging

| Area | Status | Planned phase |
| --- | --- | --- |
| route boundary placement | ✅ | Phase 02 baseline |
| mutation/API failure models | ✅ | Phases 07–08 |
| Proxy debugging/runbooks | ✅ | Phase 09 baseline |
| streaming pending vs failure model | ✅ | Phase 10 |
| streamed subtree isolation / retry policy | ✅ | Phase 10 baseline |
| hydration mismatch debugging | ✅ | Phase 10 baseline |
| structured logs / OpenTelemetry / instrumentation | 🟠 | Baselines through 10; full Phase 14 |
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
| measurement budgets / Web Vitals / profiling | 🟠 | Multiple baselines; deep Phase 15 |

## Testing & Production

| Area | Status | Planned phase |
| --- | --- | --- |
| production Docusaurus build validation | ✅ | Handbook workflow through Phase 10 |
| Server/Client/data/cache/action/API/Proxy test scenarios | 🟠 | Failure cases defined; automation Phase 16 |
| hard vs soft navigation rendering tests | 🟠 | Test matrix Phase 10; automation Phase 16 |
| streaming/hydration E2E | 🟠 | Behavior defined Phase 10; automation Phase 16 |
| deployment streaming/CDN verification | 🟠 | Phase 10 baseline; full Phase 17 |
| Node/self-hosting/serverless/adapters | 🟠 | Runtime implications introduced; full Phase 17 |

## Upgrades & Migration

| Area | Status | Planned phase |
| --- | --- | --- |
| App Router upgrade workflow | 🟠 | 01 / 20 |
| client-heavy SPA → server-first migration | 🟠 | Phases 04–10; deep 20 |
| previous cache model → Cache Components | 🟠 | Phase 06; deep 20 |
| old standalone PPR/dynamicIO/useCache flags | ⚠️ | Migration-only; modern rendering uses Cache Components |
| old GET Route Handler cached-by-default assumptions | ⚠️ | Phase 08 teaches current behavior |
| `middleware.ts` → `proxy.ts` | ⚠️ | Semantics Phase 09; migration playbook 20 |
| Pages API Routes / Pages Router migration | ⛔ | Outside scope |

## Phase 10 completion note

Phase 10 is complete for stable App Router rendering delivery because it teaches:

- Server Component orchestration, RSC Payload, initial HTML, Client Component references, and hydration
- hard/document loads versus soft App Router navigation and route-segment reconciliation
- `loading.tsx`, manual Suspense, meaningful boundary placement, sibling streaming, and loading accessibility baseline
- modern partial prerendering through Cache Components, static/cached shells, request-time dynamic holes, and fallback behavior
- server-started Promises passed into Client Components and consumed with React `use()`
- Client Component hydration cost, selective interactivity, narrow client boundaries, and hydration mismatch classes
- Router Cache/prefetch/navigation interactions, preserved layouts, `router.refresh()`, and mutation RSC updates
- streamed error versus pending behavior, retry/timeout/cancellation principles, late-failure constraints, and infrastructure buffering
- RSC size, client JS, hydration CPU, shell timing, security, production diagnostics, and senior rendering architecture review

Metadata/SEO is Phase 11. Full security, error observability, performance measurement, automated testing, and deployment operations remain Phases 13–17.

## Completion rule

The handbook is not complete until this contract is re-audited against the then-current stable Next.js docs and every stable in-scope item has a justified final state.

See [Final Completeness Audit](./final-completeness-audit.md) for the release gate.
