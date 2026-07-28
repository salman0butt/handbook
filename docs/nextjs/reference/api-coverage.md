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
| Next.js 16.2 stable behavior | 🟠 | Core routing, data, caching, mutations, HTTP, Proxy, rendering, metadata/SEO, resources, security, error handling, observability, and debugging complete; later phases own performance/testing/ops/architecture/migration/project depth |
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
| 14 · Errors, Observability & Debugging | ✅ |
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
| Error Handling | ✅ | Phase 14 |
| Deploying | 🟠 | Runtime implications introduced; full Phase 17 |
| Upgrading | 🟠 | Baseline introduced; deep Phase 20 |

## Routing & File Conventions

| API / convention | Status | Handbook location / notes |
| --- | --- | --- |
| `app/` route tree | ✅ | Phases 01–02 |
| `page`, `layout`, multiple root layouts | ✅ | Phase 02 |
| `template` | ✅ | Phase 02 |
| `loading` | ✅ | Phase 02 semantics; rendering depth 10 |
| `error` | ✅ | Phase 02 baseline; full boundary/recovery model Phase 14 |
| `global-error` | ✅ | Root-layout recovery and document-shell ownership Phase 14 |
| `not-found` | ✅ | Phase 02 baseline; control-flow/status/noindex depth Phase 14 |
| `global-not-found` | 🧪 | Experimental at current baseline |
| `default` | ✅ | Phase 02 |
| `route` | ✅ | Phase 08 |
| `proxy` | ✅ | Phase 09 |
| dynamic/catch-all/optional catch-all | ✅ | Phase 02 |
| async `params` | ✅ | Phases 02 / 08 / 11 / 13 |
| `generateStaticParams`, `dynamicParams` | ✅ | Phases 02 / 06 / 08 |
| Route Groups / Private Folders | ✅ | Phase 02 |
| Parallel / Intercepting Routes | ✅ | Phase 02; navigation/render depth 03/10 |
| `favicon.ico`, `icon`, `apple-icon` | ✅ | Phase 11 |
| generated icon / social image conventions | ✅ | Phase 11 |
| `manifest`, `robots`, `sitemap` | ✅ | Phase 11 |
| `unauthorized.js` / `forbidden.js` | 🧪 | Experimental auth interrupts; Phase 13 labels non-production baseline |
| `instrumentation.ts` / `instrumentation.js` | ✅ | Phase 14 server observability |
| `instrumentation-client.ts` / `.js` | ✅ | Phase 14 pre-hydration browser observability |

## Navigation & URL State

| Area | Status | Notes |
| --- | --- | --- |
| `<Link>` / prefetching | ✅ | Phase 03 |
| `useRouter`, `router.refresh`, `router.prefetch` | ✅ | Phase 03 |
| `usePathname`, `useSearchParams`, `useParams` | ✅ | Phase 03 |
| selected layout segment hooks | ✅ | Phase 03 |
| `useLinkStatus` | ✅ | Phase 03 |
| `redirect`, `permanentRedirect` | ✅ | Phases 03 / 07–09 / 13; thrown control-flow/debugging depth Phase 14 |
| native History API / back-forward / hash / scroll / focus | ✅ | Phase 03 |
| redirect allow-lists / open-redirect protection | ✅ | Phases 03 / 08 / 13 |
| route/search params as untrusted input | ✅ | Phases 02–03; security depth 13 |
| hard vs soft navigation diagnostic distinction | ✅ | Phase 10 behavior; incident/debug depth Phase 14 |

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
| Server Component production error sanitization | ✅ | Phase 14 |
| `error.digest` correlation | ✅ | Phase 14 |
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
| timeout/retry/failure translation baseline | ✅ | Phase 05; failure-contract/incident depth 14 |
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
| cache incident layer identification | ✅ | Phase 06 baseline; production incident depth Phase 14 |
| nonce CSP dynamic-rendering implication | ✅ | Phases 09 / 13 |

## Mutations, Forms & Server Functions

| Area | Status | Notes |
| --- | --- | --- |
| Server Functions / Server Actions terminology | ✅ | Phase 07 |
| `'use server'` inline/module level | ✅ | Phase 07 |
| forms / `FormData` / `bind` / `formAction` | ✅ | Phase 07 |
| progressive enhancement | ✅ | Phase 07 |
| `useActionState`, `useFormStatus`, `useOptimistic` | ✅ | Phase 07 |
| expected Action errors as returned state | ✅ | Phase 07 baseline; failure taxonomy depth Phase 14 |
| validation / mass-assignment prevention | ✅ | Phase 07 baseline; security depth 13 |
| authentication / resource authorization per action | ✅ | Phase 13 |
| action POST + Origin/Host protections | ✅ | Phase 07 baseline; security depth 13 |
| `serverActions.allowedOrigins` | ✅ | Phase 13 |
| action body-size/upload architecture | ✅ | Phases 07–08; abuse/upload depth 13 |
| secure action IDs / dead code elimination | ✅ | Phase 13 framework defense in depth |
| closure encryption security model | ✅ | Phase 13 |
| `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` | ✅ | Phase 13 multi-instance context |
| mutation concurrency / transactions / idempotency / outbox | ✅ | Phase 07 |
| mutation failure telemetry / surface naming | ✅ | Phase 14 |
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
| expected 4xx vs unexpected 5xx failure contract | ✅ | Phase 14 |
| stable public error codes / safe 500 body | ✅ | Phase 14 |
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
| forwarded-header trust model | ✅ | Phase 13 |
| Proxy failure classification / request-front-door observability | ✅ | Phase 14 |

## Rendering, Suspense & Navigation Delivery

| Area | Status | Notes |
| --- | --- | --- |
| RSC payload / HTML / hydration | ✅ | Phase 10 |
| hard vs soft navigation | ✅ | Phases 03 / 10; debugging depth 14 |
| `loading.tsx` / manual Suspense | ✅ | Phase 10 |
| progressive streaming | ✅ | Phase 10 |
| Cache Components shells / dynamic holes | ✅ | Phase 10 |
| Promise streaming / React `use()` | ✅ | Phase 10 |
| Client Component hydration / visible-before-interactive | ✅ | Phase 10 |
| streamed errors / retries / buffering | ✅ | Phase 10; incident depth 14 |
| streamed not-found status caveat | ✅ | Phase 14 |
| hydration mismatch production diagnosis | ✅ | Phase 10 baseline; debugging depth 14 |
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
| `notFound()` injected `noindex` behavior | ✅ | Phase 14 |
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
| image incident debugging / cache-source-CDN diagnosis | ✅ | Phase 12 baseline; production workflow 14 |

## Fonts

| Area | Status | Notes |
| --- | --- | --- |
| `next/font/google`, `next/font/local` | ✅ | Phase 12 |
| variable/static fonts / weights / styles / subsets | ✅ | Phase 12 |
| `display`, fallbacks, metric adjustment | ✅ | Phase 12 |
| preload scope / CSS variables / design tokens | ✅ | Phase 12 |
| multilingual font ownership | ✅ | Phase 12 |
| CSP/cross-origin font considerations | ✅ | Phase 12 baseline; security depth 13 |
| font failure / preload / CLS diagnostic pipeline | ✅ | Phase 12 baseline; incident observability Phase 14 |

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
| third-party browser error classification | ✅ | Phase 14 |
| `@next/third-parties` | 🧪 | Experimental at 16.2.12 snapshot |

## Authentication, Sessions & Authorization

| Area | Status | Handbook location / notes |
| --- | --- | --- |
| authentication vs session management vs authorization | ✅ | Phase 13 |
| authentication library/provider recommendation | ✅ | Phase 13 |
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
| auth failure/security-event observability | ✅ | Phase 13 schema baseline; implementation architecture Phase 14 |
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
| telemetry redaction / header-body minimization | ✅ | Phase 14 |

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
| observability request/header/body redaction | ✅ | Phase 14 |
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
| abuse/security event observability boundary | ✅ | Phase 13 baseline; telemetry architecture 14 |

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
| security event/audit-log schema baseline | ✅ | Phase 13; observability implementation 14 |
| incident runbooks for secret/authz/XSS/credential abuse | ✅ | Phase 13 |
| dependency/supply-chain baseline | ✅ | Phase 13; ops depth 17 |
| framework patch policy | ✅ | Phase 13; upgrade depth 20 |

## Errors, Observability & Debugging

| Area / API | Status | Notes |
| --- | --- | --- |
| expected errors vs uncaught exceptions | ✅ | Phase 14 |
| expected Server Action failures as returned state | ✅ | Phase 14, building on Phase 07 |
| expected HTTP/domain failures vs 5xx exceptions | ✅ | Phase 14 |
| framework control flow vs application exception | ✅ | Phase 14 |
| `error.tsx` nested route boundaries | ✅ | Phase 14 |
| `global-error.tsx` root-layout recovery | ✅ | Phase 14 |
| `error.reset()` stable recovery model | ✅ | Phase 14 |
| production Server Component error sanitization | ✅ | Phase 14 |
| `error.digest` client/server correlation | ✅ | Phase 14 |
| same-segment layout boundary caveat | ✅ | Phase 14 |
| Client Component event-handler failure ownership | ✅ | Phase 14 |
| `notFound()` / `not-found.tsx` | ✅ | Phase 14 depth |
| `notFound()` injected `noindex` | ✅ | Phase 14 |
| streamed not-found 200 vs non-streamed 404 semantics | ✅ | Phase 14 |
| `redirect()` / `permanentRedirect()` thrown control flow | ✅ | Phase 14 |
| narrow `try/catch` around framework signals | ✅ | Phase 14 |
| `unstable_rethrow` | 🧪 | Explicitly unstable; not production-first structure |
| `unstable_catchError` | 🧪 | Experimental; stable route boundary remains baseline |
| `unstable_retry` | 🧪 | Experimental recovery API |
| Route Handler safe failure envelopes / machine codes | ✅ | Phase 14 |
| Server Action/Route Handler/Client/Proxy failure contracts | ✅ | Phase 14 |
| timeout, retry-storm, cancellation, race-control reasoning | ✅ | Phase 14 baseline; performance/ops depth later |
| `after()` for non-blocking logging/analytics | ✅ | Stable; Phase 14; not durable queue |
| `after()` behavior on error/redirect/notFound outcomes | ✅ | Phase 14 |
| `instrumentation.ts` / `register()` | ✅ | Stable server initialization; Phase 14 |
| runtime-specific instrumentation / `NEXT_RUNTIME` | ✅ | Phase 14 |
| `onRequestError` | ✅ | Stable server request-error hook; Phase 14 |
| `onRequestError` route type/path/render context | ✅ | Phase 14 |
| structured server logs / request IDs / trace IDs / release IDs | ✅ | Phase 14 |
| `instrumentation-client.ts` | ✅ | Pre-hydration browser instrumentation; Phase 14 |
| global browser error capture | ✅ | Phase 14 |
| unhandled promise rejection capture | ✅ | Phase 14 |
| `onRouterTransitionStart` | ✅ | Phase 14 |
| hard vs soft navigation breadcrumbs | ✅ | Phase 14 |
| browser telemetry privacy / sampling / release skew | ✅ | Phase 14 |
| `useReportWebVitals` reporting pipeline baseline | ✅ | Phase 14 pipeline; metric interpretation Phase 15 |
| OpenTelemetry built-in integration model | ✅ | Phase 14 |
| `@vercel/otel` convenience integration | ✅ | Phase 14; provider-neutral distinction explicit |
| manual Node OpenTelemetry SDK setup | ✅ | Phase 14 runtime-specific context |
| custom spans / trace propagation | ✅ | Phase 14 |
| logs vs metrics vs traces vs error events | ✅ | Phase 14 |
| sampling / exporters / Collector architecture | ✅ | Phase 14 |
| source-map release correlation | ✅ | Phase 14 |
| `productionBrowserSourceMaps` | ✅ | Phase 14; public-serving trade-off documented |
| `next info` / `next info --verbose` | ✅ | Phase 14 diagnostics |
| `next build --debug` | ✅ | Phase 14 diagnostics |
| `next build --debug-prerender` | ✅ | Phase 14; diagnostic artifact, not normal deploy |
| `next build --debug-build-paths` | ✅ | Phase 14 targeted build debugging |
| Node inspector via `NODE_OPTIONS` | ✅ | Phase 14 controlled debugging |
| next.config `logging` | ✅ | Phase 14; development debugging, not production log architecture |
| cache-layer incident diagnosis | ✅ | Phase 14 |
| streaming/proxy/runtime incident diagnosis | ✅ | Phase 14 |
| SLI / SLO / error-budget architecture | ✅ | Phase 14 |
| actionable alerts / ownership / runbooks | ✅ | Phase 14 |
| release/region/runtime correlation | ✅ | Phase 14 |
| telemetry redaction / retention / deduplication | ✅ | Phase 14 |
| provider outage / observability failure policy | ✅ | Phase 14 |

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
| latency/error-rate telemetry foundation | ✅ | Phase 14 |
| Web Vitals / profiling / budgets / RUM | 🟠 | Reporting pipeline exists; deep Phase 15 |
| bundle/server/client cost measurement | 🟡 | Phase 15 |

## Testing & Production

| Area | Status | Notes |
| --- | --- | --- |
| production Docusaurus build validation | ✅ | Handbook workflow through Phase 13; Phase 14 gated by current PR CI |
| component/data/cache/action/API/Proxy scenarios | 🟠 | Failure cases defined; automation Phase 16 |
| hard/soft navigation and streaming/hydration tests | 🟠 | Defined Phase 10; automation Phase 16 |
| metadata/resource smoke matrices | ✅ | Phases 11–12 specifications; automation Phase 16 |
| auth lifecycle/security regression matrix | ✅ | Phase 13 specification; automation Phase 16 |
| cross-tenant authorization tests | ✅ | Phase 13 specification; automation Phase 16 |
| CSRF/XSS/SSRF/webhook/upload/rate-limit test cases | ✅ | Phase 13 specification; automation Phase 16 |
| error-boundary/reset/global-error test matrix | ✅ | Phase 14 specification; automation Phase 16 |
| Route Handler/action failure-contract test matrix | ✅ | Phase 14 specification; automation Phase 16 |
| server/client instrumentation smoke tests | ✅ | Phase 14 specification; automation Phase 16 |
| observability runbook/alert validation model | ✅ | Phase 14 baseline; ops automation later |
| Node/self-hosting/serverless/adapters | 🟠 | Runtime implications introduced; full Phase 17 |

## Deployment & Operations

| Area | Status | Notes |
| --- | --- | --- |
| `next build` / `next start` | 🟠 | Phase 01 baseline; production-debug usage Phase 14; full ops 17 |
| reverse proxy / Docker / self-hosting | 🟠 | Runtime/security implications 08–14; full 17 |
| environment configuration / runtime env | 🟠 | Security semantics Phase 13; ops depth 17 |
| multi-instance caches / Server Action key consistency | 🟠 | Phases 06 / 13; ops depth 17 |
| DB connection/serverless constraints | ✅ | Phase 08 baseline; ops depth 17 |
| queues/outbox/durable side effects | 🟠 | Phases 07–08 / 13; durability distinction Phase 14; ops 17 |
| object storage / signed uploads-downloads | 🟠 | Phases 08 / 12–13; ops implementation 17 |
| WAF/CDN/rate-limit ownership | 🟠 | Security architecture Phase 13; deployment depth 17 |
| secret management / rotation operations | 🟠 | Security policy Phase 13; operations depth 17 |
| telemetry Collector/exporter deployment | 🟠 | Architecture Phase 14; full deployment ownership Phase 17 |
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
| failure/recovery/telemetry ownership | ✅ | Phase 14 |
| shared DAL/domain-command pattern | ✅ | Phases 07–08 / 13 |
| feature/vertical-slice architecture | 🟠 | Examples through 14; deep Phase 18 |
| monorepos/shared packages | 🟠 | Runtime/security boundaries introduced; deep 18 |
| multi-tenancy | ✅ | Security isolation Phase 13; large-app architecture Phase 18 |
| RSC/build internals | 🟠 | Mental models through 14; deep 19 |

## Upgrades & Migration

| Area | Status | Notes |
| --- | --- | --- |
| App Router upgrade workflow | 🟠 | Phase 01 / deep 20 |
| client-heavy SPA → server-first migration | 🟠 | Phases 04–14; deep 20 |
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
| unstable error helpers | 🧪 | Do not migrate stable `error.tsx`/`reset()` architecture solely to experimental APIs |
| Pages Router / Pages API Routes | ⛔ | Outside handbook scope except contextual comparison |

## Phase 10 completion note

Phase 10 is complete for stable App Router rendering delivery: RSC/HTML/hydration, hard vs soft navigation, Suspense/loading, Cache Components shells/dynamic holes, `use()` Promise streaming, Client Component hydration, streamed failures, and rendering diagnostics/design review.

## Phase 11 completion note

Phase 11 is complete for stable metadata and SEO behavior: Metadata API ownership/merging, canonical/alternate URL identity, social metadata and generated images, icons/manifests, robots/sitemaps, JSON-LD, viewport, streaming metadata, Cache Components interactions, and production crawler/SEO architecture.

## Phase 12 completion note

Phase 12 is complete for stable resource optimization: modern `next/image`, image security/cache controls, responsive delivery, static-export strategy, `next/font`, `next/script`, third-party/analytics architecture, resource hints, and production resource debugging/design review.

## Phase 13 completion note

Phase 13 is complete for stable App Router authentication, authorization, and application-security architecture: identity/session/authorization separation; provider/library ownership; authentication flows; secure session lifecycle; server-only DAL/DTO authorization; tenant/resource isolation; Server Action/Route Handler/Proxy security; CSRF/XSS/CSP/secrets; SSRF/uploads/webhooks/rate limits; and threat modeling/auditing/incident response.

## Phase 14 completion note

Phase 14 is complete for stable App Router error handling, observability, and production debugging because it teaches:

- expected failures vs uncaught exceptions vs framework control flow, including Server Action return-state errors and explicit Route Handler HTTP failure contracts
- `error.tsx`, nested boundary placement, `global-error.tsx`, stable `reset()`, production Server Component error sanitization and digest correlation
- `notFound()` / `not-found.tsx`, injected `noindex`, streaming status-code timing, redirects, and safe handling of thrown framework control flow
- Server Action, Route Handler, Server Component, Client Component, Proxy, integration, timeout/retry/race, and post-response failure ownership
- stable `after()` as non-blocking response-lifecycle work while explicitly distinguishing it from durable background-job architecture
- `instrumentation.ts`, `register()`, runtime-specific setup, stable `onRequestError`, route/render context, safe structured logging, request/trace/release correlation, redaction, and duplicate-report prevention
- `instrumentation-client.ts`, pre-hydration setup, global browser errors, unhandled promise rejections, `onRouterTransitionStart`, navigation breadcrumbs, browser privacy, sampling, and source-map/release identity
- provider-neutral OpenTelemetry architecture, `@vercel/otel` convenience, manual runtime-specific SDK setup, custom spans, trace propagation, metrics/logs/traces, sampling, collectors/exporters, and telemetry failure policy
- production-mode diagnosis with `next info`, `next build --debug`, `--debug-prerender`, `--debug-build-paths`, Node inspector, source-map strategy, hard-vs-soft navigation analysis, cache/stream/Proxy evidence, and incident workflows
- SLI/SLO/error-budget design, actionable alerts, runbooks, release/region/runtime correlation, retention, privacy, deduplication, and senior observability architecture review

Experimental `unstable_catchError`, `unstable_retry`, and `unstable_rethrow` remain labeled 🧪 and do not replace the stable production baseline.

Phase 15 now owns Performance depth. Testing automation, deployment operations, large-application architecture, internals, migration, projects, and interview systems remain later phases.

## Completion rule

The handbook is not complete until this contract is re-audited against the then-current stable Next.js docs and every stable in-scope item has a justified final state.

See [Final Completeness Audit](./final-completeness-audit.md) for the release gate.
