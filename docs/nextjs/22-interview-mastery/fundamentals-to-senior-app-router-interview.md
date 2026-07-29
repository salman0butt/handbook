---
title: Fundamentals to Senior App Router Interview
sidebar_position: 2
description: Master the progression from Next.js fundamentals to senior-level App Router reasoning across routing, RSC, data, caching, mutations, metadata, and request boundaries.
---

# Fundamentals to Senior App Router Interview

This chapter shows how interview depth evolves from definition to architecture.

## Routing

### Junior

> What is the App Router?

Answer:

```text
A file-system router built around the app directory and modern React features such as Server Components, Suspense and Server Functions.
```

### Mid-level

Explain:

```text
page/layout/template
route groups
private folders
dynamic segments
parallel/intercepting routes
loading/error/not-found boundaries
```

### Senior

Explain route ownership as a tree:

```text
URL → matched segment tree → layouts/slots/page → render boundaries
```

Then discuss:

```text
state preservation
hard vs soft navigation
route-driven modals
team/capability ownership
SEO/public identity
```

## Layout vs template

Key distinction:

```text
layout → preserved across matching navigations

template → gets a new instance when its relevant segment changes
```

Senior follow-up:

Use template only when remount semantics are intentional, not as a fix for misunderstood state.

## Server Components

Core answer:

```text
Server Components are the default in App Router.
They execute on the server, can access server-only resources, and their component logic is not shipped as browser JS.
They can compose Client Components for interactivity.
```

Important distinction:

```text
Server Component ≠ traditional SSR component
```

RSC and HTML rendering are related stages but different representations.

## `'use client'`

Senior answer:

```text
It marks a client module boundary. The module and its client-side dependency subtree become part of the browser graph where reachable. I place the boundary as deep as practical around interactive code.
```

Do not say every descendant renders only in the browser; Server Components can be passed as children into client boundaries through composition.

## Data fetching

Default senior model:

```text
Server Component
→ direct DAL/DB/SDK read
→ minimal DTO
→ render
```

Avoid:

```text
Server Component → own Route Handler → database
```

unless HTTP is the real boundary.

## Waterfalls

Explain dependencies, not only `Promise.all`.

```text
independent reads → parallelize
true dependency → sequential
shared expensive read → preload/cache where appropriate
large fan-out → bound concurrency
```

## React `cache`

Use precise wording:

```text
React cache() can memoize matching server-render work in the relevant React cache/render lifetime.
It is not the same as persistent Next.js caching, Redis or CDN caching.
```

## Cache Components

Strong answer:

```text
Cache Components lets a route combine work that can be prerendered/cached with request-time work behind Suspense boundaries. I reason per subtree instead of reducing the whole route to one static/dynamic label.
```

Mention:

```text
'use cache'
cacheLife
cacheTag
request APIs
connection()
```

## Freshness APIs

Know the roles of:

```text
revalidateTag
updateTag
revalidatePath
refresh
```

But answer from the mutation contract:

```text
what changed?
which readers become stale?
what freshness semantics do they need?
```

## Router Cache

Explain it separately from server caches.

```text
The browser caches route segment/RSC navigation data to make client navigation fast. A stale soft navigation can therefore be a different problem from stale canonical server data.
```

## Server Functions and Server Actions

Precise answer:

```text
A Server Function is a function that executes on the server and is referenced across the server/client boundary. When used as a mutation entry point from UI/forms it acts as a Server Action.
```

Production answer includes:

```text
validation
authentication
authorization
transaction
idempotency
side effects
revalidation
expected errors
```

## Server Action vs Route Handler

Use decision table:

| Need | Prefer |
| --- | --- |
| app-owned form/UI mutation | Server Action |
| webhook | Route Handler |
| public/mobile API | Route Handler |
| direct server read inside RSC | DAL/query function |

Senior insight:

Do not create HTTP only to reuse logic. Put reusable logic underneath both adapters.

## Forms

Know:

```text
FormData
useActionState
useFormStatus
useOptimistic
progressive enhancement
```

Then discuss rollback, duplicate submit and validation ownership.

## Proxy

Current mental model:

```text
proxy.ts
→ request front-door logic
→ redirects/rewrites/header/cookie policy/optimistic gating
```

It is not the sole authorization boundary.

## Route Handlers

Strong answer covers:

```text
Web Request/Response
NextRequest/NextResponse
methods/status/content type
validation
streaming/files
CORS/CSRF/auth
webhook safety
```

## Request APIs

Current Next.js 16 request APIs are asynchronous where applicable.

Know:

```text
cookies()
headers()
draftMode()
params
searchParams
```

Senior insight:

Request ownership affects prerender/cache eligibility and should not be hidden behind unsafe casts.

## Rendering pipeline

Be able to draw:

```text
Server Component tree
→ RSC payload
→ initial HTML for first load
→ browser loads client JS
→ hydration of Client Components
→ later navigation uses RSC/client router reconciliation
```

## Suspense

Explain as both UX and dependency architecture.

```text
slow subtree
→ nearest Suspense fallback
→ rest of route can progress
→ subtree streams/reveals later
```

Do not claim Suspense makes slow work faster.

## Metadata

Know static `metadata` vs `generateMetadata`.

Senior concerns:

```text
canonical identity
inheritance/merge
social images
robots/sitemap
JSON-LD XSS safety
multi-tenant URLs
streaming metadata
```

## Images

Current interview points:

```text
dimensions prevent CLS
sizes controls responsive candidate selection
remotePatterns preferred for remote allowlist
preload only for justified LCP image
priority is deprecated in Next.js 16
```

Security/performance matter more than memorizing props.

## Fonts

Explain why `next/font` exists:

```text
build-time fetch/local processing
self-hosted font assets
reduced external runtime dependency
metric/fallback control
```

## Scripts

Choose strategy based on criticality:

```text
beforeInteractive
afterInteractive
lazyOnload
```

Third-party code needs consent, performance and failure ownership.

## Errors

Distinguish:

```text
expected domain failure
uncaught exception
framework control flow: redirect/notFound
```

Know `error.tsx`, `global-error.tsx`, digests, reset and production sanitization.

## Testing

Senior answer:

```text
Use the cheapest reliable layer for each contract.
Unit pure policy, integration DAL/commands, contract Actions/Handlers, real browser for routing/streaming/hydration, E2E for critical journeys.
```

Async Server Components should not be forced into unsupported unit tooling just for coverage numbers.

## Deployment

Know:

```text
next build
next start
standalone output
reverse proxy
streaming
build-time vs runtime env
multi-instance cache
build/deployment IDs
graceful shutdown
```

## Internals

Senior candidates can explain conceptual internals without depending on them:

```text
RSC/Flight
client/server module graphs
route tree reconciliation
build manifests
Server Function references
output tracing
```

Then state clearly that private manifests/headers/wire formats are not application APIs.

## The senior pattern

For any Next.js topic, finish with:

```text
correctness boundary
security implication
performance implication
failure mode
test/deploy implication
```

That pattern is more valuable than memorizing one hundred disconnected facts.