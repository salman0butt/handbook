---
title: Learning Roadmap
description: Beginner-to-staff learning path for the Next.js App Router handbook.
---

# Learning Roadmap

The handbook is ordered around engineering mental models, not around an alphabetical API reference. Each phase adds a new layer to the same system until you can reason about a production Next.js application end to end.

This curriculum is **App Router only**.

## 00 · Start Here

Understand the version contract before learning syntax.

- what this handbook covers
- current stable/LTS Next.js baseline
- React and Node.js support context
- stable vs preview/canary behavior
- framework vs platform boundaries
- how to use the roadmap and coverage audit

**Outcome:** you can identify which documentation and runtime assumptions apply to a project.

## 01 · Foundations

Build the base mental model.

- what Next.js adds to React
- creating and running an App Router application
- TypeScript, linting, environment variables, configuration
- `app/`, root layout, pages, public assets, colocation
- development vs build vs production runtime
- server, browser, build-time, and deployment boundaries
- Turbopack and production build fundamentals

**Milestone:** build a small multi-page application and explain where every important line of code executes.

## 02 · App Router & Layouts

Learn the route tree.

- route segments and nested routes
- `page.tsx`, `layout.tsx`, `template.tsx`
- route groups and private folders
- dynamic, catch-all, and optional catch-all segments
- loading, error, not-found, and default conventions
- parallel routes and intercepting routes
- route organization without accidental URL coupling

**Milestone:** build a dashboard with nested layouts, dynamic routes, and a route-driven modal.

## 03 · Navigation & URL State

Treat the URL as application state.

- `<Link>` and prefetching
- client navigation and partial route updates
- `usePathname`, `useSearchParams`, and `useRouter`
- redirects and navigation from server code
- active navigation
- filters, pagination, search, and shareable state
- browser history, scroll/focus behavior, and accessibility

**Milestone:** design a dashboard whose filters can be bookmarked, shared, and restored.

## 04 · Server & Client Components

Make execution boundaries deliberate.

- React Server Components in Next.js
- Server Components as the App Router default
- Client Components and `'use client'`
- module graph boundaries
- serializable props
- server-only dependencies and environment poisoning
- browser APIs, state, Effects, and event handlers
- provider placement and composition
- bundle implications

**Milestone:** refactor an application to minimize client JavaScript without sacrificing interactivity.

## 05 · Data Fetching

Own data close to where it is consumed.

- async Server Components
- direct database and service access
- `fetch` behavior
- parallel vs sequential work
- avoiding request waterfalls and N+1 access
- Suspense and streaming
- preload and promise-sharing patterns
- client fetching when browser lifecycle actually requires it
- error and ownership boundaries

**Milestone:** build a data-heavy dashboard without unnecessary internal REST hops.

## 06 · Caching, Rendering & Revalidation

This is intentionally its own phase because the model is version-sensitive.

- static vs dynamic server rendering
- request memoization and React cache concepts where applicable
- current default `fetch` caching behavior
- explicit caching and invalidation
- `revalidatePath`, `revalidateTag`, and current tag semantics
- Cache Components (`cacheComponents`)
- `'use cache'`, `cacheLife`, `cacheTag`, and related stable APIs
- runtime data and cache boundaries
- partial prerendering through the current Cache Components model
- self-hosting and multi-instance cache concerns

**Milestone:** explain why a route is static, dynamic, cached, or streaming and exactly when its data can change.

## 07 · Mutations, Forms & Server Functions

Treat mutations as security-sensitive operations.

- Server Functions and `'use server'`
- form actions
- runtime validation
- authentication and authorization
- `useActionState`, `useFormStatus`, and `useOptimistic`
- pending, error, and optimistic UI
- redirects and cache invalidation after writes
- progressive enhancement
- idempotency and duplicate submissions
- database transactions and side effects

**Milestone:** implement a production CRUD workflow with validation, authorization, optimistic feedback, and safe invalidation.

## 08 · Route Handlers

Use HTTP boundaries intentionally.

- `route.ts`
- standard `Request`/`Response`
- `NextRequest`/`NextResponse` where framework extensions are useful
- method handling, params, cookies, and headers
- streaming/file responses
- webhooks and third-party integrations
- CORS, rate limiting, auth, validation, and idempotency
- Server Function vs Route Handler vs direct Server Component data access

**Milestone:** design an API layer that serves both application needs and external consumers without duplicating internal architecture.

## 09 · Request Pipeline & Proxy

Understand what happens before rendering.

- Next.js request lifecycle
- redirects, rewrites, and headers
- `proxy.ts` in Next.js 16+
- matchers and request transformation
- auth gating vs authoritative authorization
- localization and tenant resolution
- latency and runtime constraints
- what should not live in Proxy

**Milestone:** design tenant-aware routing without turning Proxy into an application server.

## 10 · Rendering, Suspense & Streaming

Whiteboard the full delivery pipeline.

- RSC rendering and payloads
- HTML generation
- hydration of Client Components
- initial load vs client navigation
- Suspense boundaries
- `loading.tsx`
- streaming and reveal order
- error/not-found behavior
- prefetching and partial navigation
- hydration mismatches
- current partial prerendering model

**Milestone:** explain request → RSC work → HTML/RSC payload → browser → hydration → client navigation.

## 11 · Metadata & SEO

Make discoverability part of route architecture.

- static and generated metadata
- title templates
- Open Graph and social metadata
- robots, sitemap, manifest, icons
- canonical URLs
- structured data
- dynamic metadata performance and correctness

**Milestone:** ship a product/content route with complete crawl and sharing behavior.

## 12 · Images, Fonts & Scripts

Optimize expensive browser resources deliberately.

- `next/image`
- responsive and remote images
- remote source security
- `next/font`
- loading and layout stability
- `next/script`
- third-party scripts and loading strategies
- preload/preconnect/resource hints where appropriate

**Milestone:** meet a resource-loading performance budget without sacrificing visual quality.

## 13 · Authentication, Authorization & Security

Security is repeated throughout the handbook; this phase connects it into a system.

- sessions and cookies
- authentication vs authorization
- Server Component, Server Function, Route Handler, and Proxy checks
- role/permission/tenant scoping
- CSRF and XSS considerations
- safe redirects
- secrets and `NEXT_PUBLIC_` variables
- CSP and security headers
- uploads, webhooks, and rate limits
- logging/redaction
- user-specific data and cache leaks

**Milestone:** threat-model a multi-tenant application and place every trust check at the correct boundary.

## 14 · Errors, Observability & Debugging

Debug across layers, not by guessing.

- expected vs unexpected errors
- `error.tsx` and `global-error.tsx`
- server/client/Route Handler/Server Function failures
- structured logs and correlation IDs
- OpenTelemetry and instrumentation
- client instrumentation
- source maps and release correlation
- hydration, cache, build, and production-only failures
- incident response

**Milestone:** trace a broken user request from browser to route, server work, dependency, and database.

## 15 · Performance

Use measurement as the decision loop.

```text
measure → locate bottleneck → change → measure again
```

- Core Web Vitals
- client JavaScript and hydration cost
- RSC payload size
- server render latency
- data and database waterfalls
- images, fonts, and third-party scripts
- Turbopack/build analysis
- code splitting and dynamic imports
- prefetching, caching, and streaming
- React Compiler where appropriate
- performance budgets and instrumentation

**Milestone:** diagnose the dominant bottleneck instead of applying generic memoization.

## 16 · Testing

Test framework boundaries at the right level.

- unit and component tests
- Server and Client Component strategy
- Route Handler and Server Function tests
- validation/auth tests
- Playwright E2E
- accessibility checks
- database strategy
- production build tests and deployment smoke tests

**Milestone:** write a test strategy for a SaaS application that protects business risk without duplicating every assertion at every layer.

## 17 · Deployment & Production Operations

Keep Next.js core distinct from provider features.

- `next build` and `next start`
- Node hosting and standalone output
- containers and Docker
- reverse proxies and CDNs
- static assets and environment configuration
- adapters and serverless platforms
- Vercel as one deployment option
- self-hosting
- cache/revalidation coordination
- multi-instance concerns
- rollbacks, health checks, graceful shutdown
- CI/CD and preview environments

**Milestone:** deploy the same conceptual application to Vercel and to a generic Node/container environment, then explain the differences.

## 18 · Architecture & Large Applications

Move from pages to systems.

- feature/vertical-slice boundaries
- route organization vs domain organization
- dependency direction and public module APIs
- monorepos and shared packages
- design systems
- server/client boundary policy
- cache policy
- BFF decisions
- multi-tenancy and permissions
- realtime dashboards, ecommerce, CMS, and internationalization
- ADRs, ownership, observability standards, and budgets

**Milestone:** design a multi-team SaaS architecture that can evolve without every route depending on every feature.

## 19 · Internals & Senior Mental Models

Understand enough internals to debug and reason without treating implementation details as contracts.

- compilation and route discovery
- server/client module graphs
- RSC build and delivery concepts
- client bundles
- route rendering and prefetching
- hydration and navigation
- build output
- development vs production differences
- Turbopack mental model
- runtime boundaries
- framework responsibilities vs React responsibilities

Every internal is labeled either **public contract** or **implementation detail**.

**Milestone:** explain a framework behavior from source module to browser effect without relying on folklore.

## 20 · Upgrades & Modern Migration

This section remains App Router-focused.

- upgrading current App Router projects
- codemods and `next upgrade`
- async API migrations
- Proxy migration from old `middleware.ts` projects
- caching-model migrations
- Turbopack compatibility
- removed/deprecated configuration
- rollout and rollback plans

**Pages Router migration is intentionally outside this handbook's scope.**

## 21 · Projects

Apply the mental models to full systems:

1. content/blog application
2. ecommerce application
3. realtime operations dashboard
4. multi-tenant SaaS platform

Each project includes requirements, routes, boundaries, state/data/cache/security models, tests, performance, observability, deployment, failure scenarios, and architecture-decision questions.

## 22 · Interview Mastery

Deep explanations and architecture scenarios for modern Next.js roles.

## 23 · Interview Question Bank

Hundreds of questions from fundamentals through production incidents, coding/output problems, system design, and staff architecture.

## 24 · Mock Interview Practice

Timed interview loops with pressure questions, expected reasoning, red flags, strong signals, and scoring rubrics.

## Reference & Coverage

The reference section tracks the current official App Router documentation against this handbook. Coverage is never declared complete merely because a chapter exists.

Statuses:

- ✅ Covered
- 🟠 Foundation covered
- 🟡 Planned
- ⚠️ Deprecated / migration-only
- 🧪 Experimental / preview
- ⛔ Intentionally out of scope

Continue with **01 · Foundations** to learn what Next.js actually contributes to a React application.
