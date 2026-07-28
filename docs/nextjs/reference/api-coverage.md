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
| Next.js 16.2 stable behavior | 🟠 | Core routing, data, cache, mutations, HTTP, Proxy, rendering, metadata/SEO, resources, and application security complete; later phases cover observability/performance/testing/ops/architecture depth |
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
| 13 · Authentication, Authorization & Security | ✅ |
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
| Installation / Project Structure | ✅ | Phase 01 |
| Layouts and Pages | ✅ | Phase 02 |
| Linking and Navigating | ✅ | Phase 03 |
| Server and Client Components | ✅ | Phase 04 |
| Fetching Data | ✅ | Phase 05 |
| Cache Components | ✅ | Phase 06; rendering depth 10 |
| Caching and Revalidating | ✅ | Phase 06 |
| Mutating Data / Server Functions | ✅ | Phase 07 |
| Route Handlers | ✅ | Phase 08 |
| Proxy | ✅ | Phase 09 |
| Streaming / Suspense rendering | ✅ | Phase 10 |
| Metadata and OG Images | ✅ | Phase 11 |
| Image Optimization | ✅ | Phase 12 |
| Font Optimization | ✅ | Phase 12 |
| Script / third-party loading | ✅ | Phase 12; experimental helpers labeled 🧪 |
| Authentication / application security | ✅ | Phase 13 |
| Error Handling | 🟠 | Failure models covered through 13; deep Phase 14 |
| Deploying | 🟠 | Runtime implications introduced; full Phase 17 |
| Upgrading | 🟠 | Baseline introduced; deep Phase 20 |

## Routing & File Conventions

| API / convention | Status | Handbook location / notes |
| --- | --- | --- |
| `app/` route tree | ✅ | Phases 01–02 |
| `page`, `layout`, multiple root layouts | ✅ | Phase 02 |
| `template` | ✅ | Phase 02 |
| `loading` | ✅ | Phase 02 semantics; rendering depth 10 |
| `error`, `global-error` | 🟠 | Boundary baseline 02/10/13; deep Phase 14 |
| `not-found` | ✅ | Phase 02 |
| `global-not-found` | 🧪 | Experimental at current baseline |
| `default` | ✅ | Phase 02 |
| `route` | ✅ | Phase 08 |
| `proxy` | ✅ | Phase 09 |
| dynamic/catch-all/optional catch-all | ✅ | Phase 02 |
| async `params` | ✅ | Phases 02 / 08 / 11 / 13 trust model |
| `generateStaticParams`, `dynamicParams` | ✅ | Phases 02 / 06 / 08 |
| Route Groups / Private Folders | ✅ | Phase 02 |
| Parallel / Intercepting Routes | ✅ | Phase 02; navigation/render depth 03/10 |
| `favicon.ico`, `icon`, `apple-icon` | ✅ | Phase 11 |
| generated icon / social image conventions | ✅ | Phase 11 |
| `manifest`, `robots`, `sitemap` | ✅ | Phase 11 |
| `unauthorized.js` / `forbidden.js` | 🧪 | Experimental auth interrupts; Phase 13 labels non-production baseline |
| `instrumentation`, `instrumentation-client` | 🟡 | Phase 14 |

## Navigation & URL State

| Area | Status | Notes |
| --- | --- | --- |
| `<Link>` / prefetching | ✅ | Phase 03 |
| `useRouter`, `router.refresh`, `router.prefetch` | ✅ | Phase 03 |
| `usePathname`, `useSearchParams`, `useParams` | ✅ | Phase 03 |
| selected layout segment hooks | ✅ | Phase 03 |
| `useLinkStatus` | ✅ | Phase 03 |
| `redirect`, `permanentRedirect` | ✅ | Phases 03 / 07–09 / auth flows 13 |
| native History API / back-forward / hash / scroll / focus | ✅ | Phase 03 |
| redirect allow-lists / open-redirect protection | ✅ | Phases 03 / 08 / 13 |
| route/search params as untrusted input | ✅ | Phases 02–03; security depth 13 |

## Server & Client Component Boundaries

| Concept / API | Status | Notes |
| --- | --- | --- |
| Server Components default | ✅ | Phase 04 |
| `'use client'` module graph | ✅ | Phase 04; security audit depth 13 |
| Server → Client composition | ✅ | Phase 04 |
| serializable props / minimal DTOs | ✅ | Phase 04; secure DTO depth 13 |
| context/provider placement | ✅ | Phase 04; auth-context limits Phase 13 |
| third-party/browser-only integration | ✅ | Phase 04; third-party trust 12–13 |
| `server-only` / `client-only` | ✅ | Phase 04; secret/data-boundary depth 13 |
| environment poisoning prevention | ✅ | Phase 04; secrets depth 13 |
| RSC payload / HTML / hydration | ✅ | Phase 10 |
| private-data exclusion from RSC/client props | ✅ | Phase 13 |
| experimental React taint integration | 🧪 | Defense in depth only; Phase 13 |

## Data Fetching & Secure Data Access

| Area | Status | Notes |
| --- | --- | --- |
| async Server Components / server data ownership | ✅ | Phase 05 |
| server `fetch` | ✅ | Phases 05–06 |
| direct DB/ORM/SDK access | ✅ | Phase 05; DAL/security depth 13 |
| avoid own Route Handler hop from Server Component | ✅ | Phases 05 / 08 |
| parallel/sequential fetching / waterfalls | ✅ | Phase 05 |
| N+1 / batching / bounded fan-out | ✅ | Phase 05 |
| React `cache` request/render memoization | ✅ | Phase 05; session/DAL dedupe 13 |
| external status/schema validation | ✅ | Phase 05 |
| Data Access Layer | ✅ | Phase 13 authoritative security boundary |
| DTO projection / field-level exposure | ✅ | Phases 04–05; security depth 13 |
| tenant/resource-scoped queries | ✅ | Phase 13 |
| IDOR/BOLA prevention model | ✅ | Phase 13 |
| secure upstream header/token forwarding | ✅ | Phases 08–09; security depth 13 |

## Caching, Rendering & Revalidation

| Area / API | Status | Notes |
| --- | --- | --- |
| current server `fetch` cache semantics | ✅ | Phase 06 |
| `cache: 'no-store'`, `cache: 'force-cache'` | ✅ | Phase 06 |
| `next.revalidate`, `next.tags` | ✅ | Phase 06 |
| React `cache` vs persistent Next cache | ✅ | Phases 05–06 |
| Cache Components (`cacheComponents: true`) | ✅ | Phase 06 |
| `'use cache'`, `cacheLife`, `cacheTag` | ✅ | Phase 06 |
| `revalidateTag`, `updateTag`, `revalidatePath`, `refresh` | ✅ | Phases 06–07 |
| `connection()` | ✅ | Phase 06 |
| `unstable_noStore`, `unstable_cache` migration context | ⚠️ | Phase 06 |
| `'use cache: private'` | 🧪 | Experimental |
| remote/custom cache handlers | ✅ | Phase 06; ops depth 17 |
| partial prerendering via Cache Components | ✅ | Phases 06 / 10 |
| Client Router Cache | ✅ | Phase 06 |
| cache isolation / tenant-user keys | ✅ | Phase 06 baseline; security depth 13 |
| permission freshness / private cache threat model | ✅ | Phase 13 |
| nonce CSP dynamic-rendering implication | ✅ | Phases 09 / 13 |

## Mutations, Forms & Server Functions

| Area | Status | Notes |
| --- | --- | --- |
| Server Functions / Server Actions terminology | ✅ | Phase 07 |
| `'use server'` inline/module level | ✅ | Phase 07 |
| forms / `FormData` / `bind` / `formAction` | ✅ | Phase 07 |
| progressive enhancement | ✅ | Phase 07 |
| `useActionState`, `useFormStatus`, `useOptimistic` | ✅ | Phase 07 |
| validation / mass-assignment prevention | ✅ | Phase 07 baseline; security depth 13 |
| authentication / resource authorization per action | ✅ | Phase 13 |
| action POST + origin/Host protections | ✅ | Phase 07 baseline; security depth 13 |
| `serverActions.allowedOrigins` | ✅ | Phase 13 advanced reverse-proxy security |
| action body-size/upload architecture | ✅ | Phases 07–08; abuse/upload depth 13 |
| secure action IDs / dead code elimination | ✅ | Phase 13 framework defense-in-depth |
| closure encryption security model | ✅ | Phase 13 |
| `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` | ✅ | Phase 13 advanced multi-instance context |
| mutation concurrency / transactions / idempotency / outbox | ✅ | Phase 07 |
| action testing automation | 🟡 | Phase 16 |

## Route Handlers & HTTP

| Area | Status | Notes |
| --- | --- | --- |
| `route.ts`, supported methods, 405, automatic OPTIONS | ✅ | Phase 08 |
| Request / Response / NextRequest / NextResponse | ✅ | Phase 08 |
| async params / `RouteContext` | ✅ | Phase 08 |
| JSON/form/text/binary bodies | ✅ | Phase 08 |
| content type / schema / body-size validation | ✅ | Phase 08; abuse depth 13 |
| one-read body / clone | ✅ | Phase 08 |
| files / downloads / streams | ✅ | Phase 08 |
| GET not cached by default | ✅ | Phase 08 current behavior |
| Cache Components Route Handler behavior | ✅ | Phase 08 |
| HTTP cache vs Next cache | ✅ | Phase 08 |
| CORS / preflight | ✅ | Phase 08; security depth 13 |
| cookie-auth CSRF model | ✅ | Phase 13 |
| protected handler 401/403 authorization | ✅ | Phase 13 |
| webhooks / raw signatures / replay / dedupe | ✅ | Phase 08 baseline; security depth 13 |
| callbacks / open redirects | ✅ | Phase 08 baseline; auth/security depth 13 |
| rate limits / timeouts / resource bounds | ✅ | Phase 08 baseline; abuse depth 13 |
| SSRF-safe outbound HTTP | ✅ | Phase 13 |
| upload/object-storage capability architecture | ✅ | Phase 08 baseline; security depth 13 |

## Proxy & Request Pipeline

| Area | Status | Notes |
| --- | --- | --- |
| `proxy.ts` current convention | ✅ | Phase 09 |
| `middleware.ts` rename/migration | ⚠️ | Phase 09 semantics; Phase 20 playbook |
| request execution order | ✅ | Phase 09 |
| matcher string/array/object / `has` / `missing` | ✅ | Phase 09 |
| prefetch/static-asset exclusions | ✅ | Phase 09 |
| `NextResponse.next()` | ✅ | Phase 09 |
| request-header forwarding / response-header safety | ✅ | Phase 09 |
| redirects / rewrites / RSC-safe rewrites | ✅ | Phase 09 |
| localization / tenancy routing | ✅ | Phase 09 baseline; secure tenant auth Phase 13 |
| optimistic auth gating | ✅ | Phase 09; full auth model 13 |
| Proxy not sole authorization boundary | ✅ | Phase 13 |
| Node.js runtime / performance constraints | ✅ | Phase 09 |
| `waitUntil` | ✅ | Phase 09; not durable queue |
| Proxy test helpers | 🧪 | Experimental; Phase 09 |
| forwarded header trust model | ✅ | Phase 13 |

## Rendering, Suspense & Navigation Delivery

| Area | Status | Notes |
| --- | --- | --- |
| RSC payload / HTML / hydration | ✅ | Phase 10 |
| hard vs soft navigation | ✅ | Phases 03 / 10 |
| `loading.tsx` / manual Suspense | ✅ | Phase 10 |
| progressive streaming | ✅ | Phase 10 |
| Cache Components shells / dynamic holes | ✅ | Phase 10 |
| Promise streaming / React `use()` | ✅ | Phase 10 |
| Client Component hydration / visible-before-interactive | ✅ | Phase 10 |
| streamed errors / retries / buffering | ✅ | Phase 10 |
| auth checks in preserved layouts caveat | ✅ | Phase 13 |
| protected/private output serialization model | ✅ | Phase 13 |

## Metadata & SEO

| Area | Status | Notes |
| --- | --- | --- |
| static `metadata` / `generateMetadata` | ✅ | Phase 11 |
| inheritance / shallow merging / file precedence | ✅ | Phase 11 |
| titles / descriptions / canonical / alternates / `metadataBase` | ✅ | Phase 11 |
| Open Graph / Twitter / generated images | ✅ | Phase 11 |
| icons / manifest | ✅ | Phase 11 |
| robots / sitemap / `generateSitemaps` | ✅ | Phase 11 |
| JSON-LD / script-context-safe serialization | ✅ | Phase 11; XSS depth 13 |
| viewport APIs | ✅ | Phase 11 |
| streaming metadata / HTML-limited bots | ✅ | Phase 11 |
| metadata private-data exclusion | ✅ | Phase 13 |

## Images

| Area | Status | Notes |
| --- | --- | --- |
| `next/image` source/geometry/responsive semantics | ✅ | Phase 12 |
| `fill`, `sizes`, `srcset`, placeholders | ✅ | Phase 12 |
| `preload` | ✅ | Current Next.js 16 API |
| `priority` | ⚠️ | Deprecated in Next.js 16 |
| `quality` / `images.qualities` | ✅ | Phase 12 |
| `remotePatterns` / `localPatterns` | ✅ | Phase 12 |
| `images.domains` | ⚠️ | Deprecated in favor of `remotePatterns` |
| private/local IP blocking | ✅ | Phase 12; SSRF context Phase 13 |
| redirect/source-response/disk-cache limits | ✅ | Phase 12 |
| SVG protections | ✅ | Phase 12 baseline; active-content depth 13 |
| authenticated source/custom loader architecture | ✅ | Phase 12; SSRF/open-proxy depth 13 |
| `getImageProps`, `<picture>`, art direction | ✅ | Phase 12 |
| static export image strategy | ✅ | Phase 12 |

## Fonts

| Area | Status | Notes |
| --- | --- | --- |
| `next/font/google`, `next/font/local` | ✅ | Phase 12 |
| variable/static fonts / weights / styles / subsets | ✅ | Phase 12 |
| `display`, fallbacks, metric adjustment | ✅ | Phase 12 |
| preload scope / CSS variables / design tokens | ✅ | Phase 12 |
| multilingual font ownership | ✅ | Phase 12 |
| CSP/cross-origin font considerations | ✅ | Phase 12 baseline; security depth 13 |

## Scripts & Third Parties

| Area | Status | Notes |
| --- | --- | --- |
| `next/script` strategies and route/layout scope | ✅ | Phase 12 |
| inline script IDs / lifecycle callbacks | ✅ | Phase 12 |
| `beforeInteractive`, `afterInteractive`, `lazyOnload` | ✅ | Phase 12 |
| `worker` strategy | 🧪 | Experimental and not an App Router production primitive |
| nonce / CSP integration | ✅ | Phase 12 baseline; strict CSP depth 13 |
| analytics pageviews / consent / data minimization | ✅ | Phase 12 baseline; privacy/security depth 13 |
| tag-manager supply-chain trust | ✅ | Phase 13 |
| third-party failure isolation / facades | ✅ | Phase 12 |
| `@next/third-parties` | 🧪 | Experimental at 16.2.12 snapshot |

## Authentication, Sessions & Authorization

| Area | Status | Handbook location / notes |
| --- | --- | --- |
| authentication vs session management vs authorization | ✅ | Phase 13 |
| authentication library/provider recommendation | ✅ | Phase 13; official guide preference |
| sign-up / sign-in form Server Action model | ✅ | Phase 13 |
| server-side credential input validation | ✅ | Phase 13 |
| password hashing/storage architecture | ✅ | Phase 13 provider/library-oriented guidance |
| OAuth/OIDC callbacks / state / PKCE concept | ✅ | Phase 13 |
| safe post-auth redirects | ✅ | Phase 13 |
| verification / reset / magic-link lifecycle | ✅ | Phase 13 |
| MFA / step-up / re-authentication architecture | ✅ | Phase 13 |
| stateless sessions | ✅ | Phase 13 |
| database sessions | ✅ | Phase 13 |
| session renewal / expiry / rotation / revocation | ✅ | Phase 13 |
| multi-device / logout-all model | ✅ | Phase 13 |
| secure cookie attributes | ✅ | Phase 13 |
| async `cookies()` read/write boundaries | ✅ | Phases 07–09; auth depth 13 |
| optimistic Proxy checks | ✅ | Phases 09 / 13 |
| secure DAL authorization | ✅ | Phase 13 |
| layouts not sufficient as sole auth boundary | ✅ | Phase 13 |
| page / leaf-component auth checks | ✅ | Phase 13 |
| client auth context limitations | ✅ | Phase 13 |
| resource/tenant authorization | ✅ | Phase 13 |
| RBAC plus ownership/relationship policy | ✅ | Phase 13 |
| 401 vs 403 / optional 404 hiding policy | ✅ | Phase 13 |
| `unauthorized()`, `forbidden()`, `authInterrupts` | 🧪 | Experimental, not recommended production baseline |

## Browser & Application Security

| Area | Status | Notes |
| --- | --- | --- |
| CSRF mental model | ✅ | Phase 13 |
| Server Action Origin/Host protection | ✅ | Phase 13 |
| Route Handler cookie-CSRF strategy | ✅ | Phase 13 |
| CORS is not authentication | ✅ | Phases 08 / 13 |
| XSS / React escaping / dangerous sinks | ✅ | Phase 13 |
| HTML/rich-content sanitization boundary | ✅ | Phase 13 |
| URL/javascript-scheme validation | ✅ | Phase 13 |
| CSP | ✅ | Phase 13 |
| per-request CSP nonce via Proxy | ✅ | Phases 09 / 13 |
| nonce CSP → dynamic rendering | ✅ | Phase 13 |
| static CSP headers | ✅ | Phase 13 |
| CSP SRI | 🧪 | Experimental webpack-only App Router feature |
| third-party script/tag-manager trust | ✅ | Phase 13 |
| framing / `frame-ancestors` / form/base restrictions | ✅ | Phase 13 |
| broader security headers | ✅ | Phase 13 baseline; deployment enforcement depth 17 |

## Secrets & Data Exposure

| Area | Status | Notes |
| --- | --- | --- |
| environment variables server-only by default | ✅ | Phase 13 |
| `NEXT_PUBLIC_` browser/build-time exposure | ✅ | Phase 13 |
| `.env*` source-control policy | ✅ | Phase 13 |
| `server-only` privileged module guard | ✅ | Phases 04 / 13 |
| Client Component/RSC serialization leaks | ✅ | Phase 13 |
| Server Action return-value exposure | ✅ | Phase 13 |
| Route Handler response minimization | ✅ | Phase 13 |
| metadata/log/URL/analytics data exposure | ✅ | Phase 13 |
| secret rotation model | ✅ | Phase 13 |
| multi-tenant provider-secret authorization | ✅ | Phase 13 |
| React taint APIs | 🧪 | Experimental defense in depth, not replacement for DTOs |

## SSRF, Uploads, Webhooks & Abuse

| Area | Status | Notes |
| --- | --- | --- |
| server-side URL/SSRF threat model | ✅ | Phase 13 |
| allow-listed outbound targets / redirect validation | ✅ | Phase 13 |
| private network / metadata target protection | ✅ | Phase 13 |
| image optimizer SSRF controls | ✅ | Phases 12 / 13 |
| upload media/type/size/path threat model | ✅ | Phase 13 |
| direct object-storage upload capability | ✅ | Phases 08 / 13 |
| active SVG / isolated serving strategy | ✅ | Phases 12 / 13 |
| quarantine/scanning architecture | ✅ | Phase 13 baseline |
| webhook raw signature verification | ✅ | Phases 08 / 13 |
| webhook replay / dedupe / idempotency | ✅ | Phases 07–08 / 13 |
| application/platform rate limiting | ✅ | Phases 08–09 / 13 |
| distributed rate-limit storage | ✅ | Phase 13 |
| fail-open/fail-closed policy | ✅ | Phase 13 |
| body/time/concurrency/cost bounds | ✅ | Phase 13 |
| SQL/NoSQL/command/path injection baseline | ✅ | Phase 13 |
| API key generation/scope/revocation model | ✅ | Phase 13 |

## Security Auditing & Threat Modeling

| Area | Status | Notes |
| --- | --- | --- |
| assets / actors / entry points / trust boundaries | ✅ | Phase 13 |
| `use client` security audit | ✅ | Phase 13 |
| `use server` security audit | ✅ | Phase 13 |
| dynamic params / Proxy / Route Handler audit | ✅ | Phase 13 |
| DAL/database access audit | ✅ | Phase 13 |
| cache-security review | ✅ | Phase 13 |
| auth lifecycle review | ✅ | Phase 13 |
| security event/audit-log schema baseline | ✅ | Phase 13; observability implementation Phase 14 |
| incident runbooks for secret/authz/XSS/credential abuse | ✅ | Phase 13 |
| dependency/supply-chain baseline | ✅ | Phase 13; ops depth 17 |
| framework patch policy | ✅ | Phase 13; upgrade depth 20 |

## Errors, Observability & Debugging

| Area | Status | Notes |
| --- | --- | --- |
| route boundary placement | ✅ | Phase 02 baseline |
| mutation/API failure models | ✅ | Phases 07–08 |
| Proxy debugging/runbooks | ✅ | Phase 09 |
| streaming/hydration failure models | ✅ | Phase 10 |
| metadata/resource runbooks | ✅ | Phases 11–12 |
| auth/security denial and incident runbooks | ✅ | Phase 13 baseline |
| safe public errors / log redaction | ✅ | Phases 07–08 / 13 |
| structured logs / OpenTelemetry / instrumentation | 🟠 | Baselines through 13; full Phase 14 |
| browser/runtime observability | 🟠 | Models exist; full Phase 14 |

## Performance

| Area | Status | Notes |
| --- | --- | --- |
| data waterfalls / N+1 | ✅ | Phase 05 |
| cache architecture | ✅ | Phase 06 |
| mutation critical path | ✅ | Phase 07 baseline |
| HTTP/Proxy critical path | ✅ | Phases 08–09 baseline |
| RSC/hydration timing separation | ✅ | Phase 10 baseline |
| metadata/crawler critical path | ✅ | Phase 11 baseline |
| image/font/script resource performance | ✅ | Phase 12 baseline |
| auth/session lookup cost / Proxy optimistic-check rationale | ✅ | Phase 13 baseline |
| security-vs-performance CSP nonce trade-off | ✅ | Phase 13 |
| Web Vitals / profiling / budgets / RUM | 🟠 | Multiple baselines; deep Phase 15 |

## Testing & Production

| Area | Status | Notes |
| --- | --- | --- |
| production Docusaurus build validation | ✅ | Handbook workflow through Phase 12; Phase 13 gated by current PR CI |
| component/data/cache/action/API/Proxy scenarios | 🟠 | Failure cases defined; automation Phase 16 |
| hard/soft navigation and streaming/hydration tests | 🟠 | Defined Phase 10; automation Phase 16 |
| metadata/resource smoke matrices | ✅ | Phases 11–12 specifications; automation Phase 16 |
| auth lifecycle/security regression matrix | ✅ | Phase 13 specification; automation Phase 16 |
| cross-tenant authorization tests | ✅ | Phase 13 specification; automation Phase 16 |
| CSRF/XSS/SSRF/webhook/upload/rate-limit test cases | ✅ | Phase 13 specification; automation Phase 16 |
| Node/self-hosting/serverless/adapters | 🟠 | Runtime implications introduced; full Phase 17 |

## Deployment & Operations

| Area | Status | Notes |
| --- | --- | --- |
| `next build` / `next start` | 🟠 | Phase 01 baseline; full 17 |
| reverse proxy / Docker / self-hosting | 🟠 | Runtime/security implications 08–13; full 17 |
| environment configuration / runtime env | 🟠 | Security semantics Phase 13; ops depth 17 |
| multi-instance caches / Server Action key consistency | 🟠 | Phases 06 / 13; ops depth 17 |
| DB connection/serverless constraints | ✅ | Phase 08 baseline; ops depth 17 |
| queues/outbox/durable side effects | 🟠 | Phases 07–08 / security context 13; ops 17 |
| object storage / signed uploads-downloads | 🟠 | Phases 08 / 12–13; ops implementation 17 |
| WAF/CDN/rate-limit ownership | 🟠 | Security architecture Phase 13; deployment depth 17 |
| secret management / rotation operations | 🟠 | Security policy Phase 13; operations depth 17 |
| rollback / health / graceful shutdown / CI-CD | 🟡 | Phase 17 |

## Architecture & Internals

| Area | Status | Notes |
| --- | --- | --- |
| route/layout/URL ownership | ✅ | Phases 02–03 |
| server/client module ownership | ✅ | Phase 04 |
| server data/dependency ownership | ✅ | Phase 05 |
| cache freshness/invalidation ownership | ✅ | Phase 06 |
| mutation/action boundary ownership | ✅ | Phase 07 |
| HTTP endpoint ownership | ✅ | Phase 08 |
| request-front-door ownership | ✅ | Phase 09 |
| rendering/delivery ownership | ✅ | Phase 10 |
| metadata/public URL identity | ✅ | Phase 11 |
| browser resource ownership | ✅ | Phase 12 |
| identity/session/authorization ownership | ✅ | Phase 13 |
| shared DAL/domain-command pattern | ✅ | Phases 07–08 / 13 |
| feature/vertical-slice architecture | 🟠 | Examples through 13; deep Phase 18 |
| monorepos/shared packages | 🟠 | Runtime/security boundaries introduced; deep 18 |
| multi-tenancy | ✅ | Security isolation depth Phase 13; large-app architecture Phase 18 |
| RSC/build internals | 🟠 | Mental models through 13; deep 19 |

## Upgrades & Migration

| Area | Status | Notes |
| --- | --- | --- |
| App Router upgrade workflow | 🟠 | Phase 01 / deep 20 |
| client-heavy SPA → server-first migration | 🟠 | Phases 04–13; deep 20 |
| previous cache model → Cache Components | 🟠 | Phase 06; deep 20 |
| old standalone PPR/dynamicIO/useCache flags | ⚠️ | Migration-only |
| old GET Route Handler cached-by-default assumptions | ⚠️ | Phase 08 teaches current behavior |
| `middleware.ts` → `proxy.ts` | ⚠️ | Phase 09; deep 20 |
| `metadata.viewport` migration | ⚠️ | Phase 11 |
| old Image `priority` | ⚠️ | Phase 12 teaches current `preload` model |
| `images.domains` | ⚠️ | Prefer `remotePatterns` |
| `onLoadingComplete` | ⚠️ | Prefer `onLoad` |
| `next/legacy/image` | ⚠️ | Migration-only |
| auth experiments (`authInterrupts`, taint) | 🧪 | Do not treat as stable migration target |
| Pages Router / Pages API Routes | ⛔ | Outside handbook scope except contextual comparison |

## Phase 10 completion note

Phase 10 is complete for stable App Router rendering delivery: RSC/HTML/hydration, hard vs soft navigation, Suspense/loading, Cache Components shells/dynamic holes, `use()` Promise streaming, Client Component hydration, streamed failures, and rendering diagnostics/design review.

## Phase 11 completion note

Phase 11 is complete for stable metadata and SEO behavior: Metadata API ownership/merging, canonical/alternate URL identity, social metadata and generated images, icons/manifests, robots/sitemaps, JSON-LD, viewport, streaming metadata, Cache Components interactions, and production crawler/SEO architecture.

## Phase 12 completion note

Phase 12 is complete for stable resource optimization: modern `next/image`, image security/cache controls, responsive delivery, static-export strategy, `next/font`, `next/script`, third-party/analytics architecture, resource hints, and production resource debugging/design review.

## Phase 13 completion note

Phase 13 is complete for stable App Router authentication, authorization, and application-security architecture because it teaches:

- authentication vs session management vs authorization; provider/library ownership; sign-up/sign-in, password, OAuth/OIDC, recovery, MFA/step-up, and safe redirect design
- stateless and database sessions; secure cookies; expiry, renewal, rotation, revocation, multi-device behavior, logout-all, claim staleness, and distributed-session considerations
- server-only DAL authorization, request-scoped session verification, RBAC plus resource/relationship policy, tenant-scoped queries, IDOR/BOLA prevention, field-level authorization, and minimal DTOs
- Server Action, Route Handler, Proxy, callback, and webhook security responsibilities; action built-in defenses, origin checks, `allowedOrigins`, closure encryption, and multi-instance action keys
- CSRF, XSS, strict CSP/nonces, security headers, third-party/tag-manager trust, output-context safety, and the dynamic-rendering trade-off of nonce CSP
- environment/secrets policy, `NEXT_PUBLIC_`, `server-only`, RSC/client/action/API data-exposure boundaries, redacted logs, key rotation, and experimental tainting as defense in depth
- SSRF, server-side URL validation, image-fetch security, uploads, object-storage capabilities, active SVG, webhook replay/signatures, distributed rate limiting, bounded resource cost, injection classes, and API-key lifecycle
- threat modeling, security audits for `use client`/`use server`/params/Proxy/Route Handlers/DAL/caches, incident runbooks, security event design, dependency/supply-chain review, and supported-patch policy

Phase 14 now owns Errors, Observability & Debugging depth. Performance measurement, automation, deployment operations, architecture/internals, migration, projects, and interview systems remain later phases.

## Completion rule

The handbook is not complete until this contract is re-audited against the then-current stable Next.js docs and every stable in-scope item has a justified final state.

See [Final Completeness Audit](./final-completeness-audit.md) for the release gate.
