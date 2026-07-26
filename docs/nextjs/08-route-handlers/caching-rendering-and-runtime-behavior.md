---
title: Route Handler Caching, Rendering & Runtime Behaviour
description: Understand default Route Handler caching, Cache Components behavior, static generation, runtime data, route config, and deployment constraints.
---

# Route Handler Caching, Rendering & Runtime Behaviour

Route Handlers are HTTP endpoints, but they still live inside the App Router rendering/cache system.

The most important current rule is:

> **Route Handlers are not cached by default.**

You may opt into caching for `GET` responses, while mutation methods remain request-time.

## Default model

Without an explicit caching decision:

```text
GET Route Handler
→ request-time by default

POST / PUT / PATCH / DELETE
→ request-time
```

Do not carry forward the older Next.js 13/14 assumption that a normal `GET` Route Handler is automatically cached simply because it returns `Response`.

## Previous non-Cache-Components model

A `GET` Route Handler can opt into static caching with route config:

```ts
export const dynamic = 'force-static'

export async function GET() {
  const items = await getItems()
  return Response.json(items)
}
```

Route Handlers share route-segment configuration concepts with pages/layouts in the previous model.

Examples include:

```ts
export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
```

Phase 6 covers the full previous-model semantics and migration rules.

## Non-GET methods are not cached

Even if a cached `GET` lives in the same file:

```ts
export const dynamic = 'force-static'

export async function GET() {
  // cacheable GET
}

export async function POST(request: Request) {
  // still a mutation request
}
```

Do not assume the file-level presence of a cached GET turns POST into cached execution.

## Cache Components model

With:

```ts
const nextConfig = {
  cacheComponents: true,
}
```

`GET` Route Handlers follow the modern Cache Components model.

A useful classification is:

```text
fully static handler
→ can prerender

runtime/request-dependent handler
→ request-time

handler with reusable dynamic data isolated in `use cache`
→ can include cached data in prerendered output
```

## Static handler

```ts
export async function GET() {
  return Response.json({
    name: 'Handbook',
    version: 1,
  })
}
```

When the handler has no runtime/dynamic dependency, Cache Components can prerender it.

## Request-dependent handler

```ts
import { headers } from 'next/headers'

export async function GET() {
  const store = await headers()

  return Response.json({
    userAgent: store.get('user-agent'),
  })
}
```

This depends on incoming request data, so the response cannot be known ahead of time.

## Request object access is dynamic

With Cache Components, accessing request properties such as:

```text
request.url
request.headers
request.cookies
request.body
```

makes the handler depend on runtime request data.

That means prerendering cannot treat the whole response as a build-time constant.

## Non-deterministic work

Operations such as:

```ts
Math.random()
crypto.randomUUID()
Date.now()
```

are request-sensitive/non-deterministic when they are meant to vary per request.

Do not accidentally prerender a value that product requirements expect to change every request.

## Database/network work and Cache Components

A database query or network call is dynamic work unless you deliberately place reusable work in a cacheable helper.

Example:

```ts
import { cacheLife } from 'next/cache'

export async function GET() {
  const products = await getProducts()
  return Response.json(products)
}

async function getProducts() {
  'use cache'
  cacheLife('hours')

  return db.product.findMany()
}
```

The important constraint is:

> `use cache` should be placed in an extracted helper, not directly in the Route Handler body.

## Why extract the cached helper?

This keeps two concerns separate:

```text
HTTP request/response boundary
from
reusable cached data computation
```

That makes auth, request state, response headers, and cache keys easier to audit.

## Cache personalized data cautiously

Do not turn:

```text
GET /api/me
```

into a broadly shared cached response.

User-specific responses require isolation across:

```text
identity
tenant
permissions
locale
feature flags
```

When the data is private, request-time rendering is usually the safer default unless you have an explicit private cache design.

## HTTP cache vs Next.js server cache

These are separate layers.

Next.js server cache/prerendering:

```text
Can the server reuse/generated response or cached function output?
```

HTTP cache headers:

```text
Can browser/CDN/proxy reuse this network response?
```

Example:

```ts
return Response.json(data, {
  headers: {
    'Cache-Control': 'public, max-age=60',
  },
})
```

This is an HTTP cache contract. It is not equivalent to `use cache` or the Next.js Data Cache.

## Be careful with authorization + HTTP caching

Dangerous:

```text
Cache-Control: public
```

on a user-specific response.

Private endpoints should usually use a policy such as:

```text
Cache-Control: private, no-store
```

when browser/proxy reuse would be unsafe.

Do not assume the framework’s server-side isolation automatically configures external caches safely.

## Static params

Dynamic Route Handlers can use `generateStaticParams` for selected route params.

Example route:

```text
app/api/docs/[slug]/route.ts
```

You can prerender known slugs and handle other values according to the route’s dynamic behavior.

With Cache Components, cached helpers can support reusable data for both prerendered and runtime params.

## `runtime`

Route Handlers can use route config such as:

```ts
export const runtime = 'nodejs'
```

Node.js is the default runtime in current Next.js.

Choose runtime based on actual capabilities:

```text
Node libraries
filesystem needs
native modules
streaming support
latency/region requirements
platform restrictions
```

Do not choose a runtime only because it sounds faster.

## Filesystem assumptions

On some deployments:

```text
filesystem may be read-only
ephemeral
local to one instance
```

Do not use local files as durable shared application state unless your deployment guarantees that architecture.

## Serverless lifecycle

A Route Handler may run in an ephemeral compute instance.

Implications:

```text
module globals are not durable
in-memory caches are instance-local
connections may need pooling strategy
long jobs may time out
background work may not finish after response
```

Use durable infrastructure for durable responsibilities.

## Long-running work

Bad:

```text
POST /api/reports
→ keep request open for 15 minutes
→ generate report
```

Better:

```text
POST /api/reports
→ validate
→ enqueue durable job
→ return 202 + job ID
```

Then:

```text
GET /api/reports/jobs/:id
```

can expose progress/result state.

## `202 Accepted`

Use `202` when the server accepts work that will complete asynchronously.

It communicates:

```text
request accepted
≠
work completed
```

The response should provide a way to identify or observe the work when appropriate.

## Region placement

If the handler depends heavily on a regional database, deployment placement affects latency.

A global HTTP endpoint with a single-region database can still have:

```text
client → nearby compute → distant DB
```

which may be slower than:

```text
client → compute near DB
```

Measure complete dependency latency, not only edge proximity.

## Proxying and caching

If a Route Handler proxies an upstream API, decide which layer owns freshness:

```text
upstream cache
Next.js cache
CDN cache
browser cache
```

Avoid stacking caches with incompatible invalidation semantics.

## Static export

Static export has no general-purpose runtime server.

Only Route Handler patterns that can be resolved as static output are compatible.

Do not architect dynamic POST/webhook/auth endpoints for an export-only deployment.

## Common mistakes

### Assuming GET means cached

Current Route Handlers are not cached by default.

### Putting `use cache` directly in the handler body

Extract a helper under Cache Components.

### Mixing private auth data with public cache headers

Can leak data through intermediaries.

### Relying on module state

Multi-instance/serverless deployments break the assumption.

### Choosing edge/serverless without dependency analysis

Database/service topology matters more than labels.

### Keeping long jobs inside HTTP requests

Use queues/durable jobs.

## Debugging checklist

1. Identify whether Cache Components is enabled.
2. Identify GET vs mutation method.
3. Inspect route config in the previous model.
4. Check request/runtime API access.
5. Check nondeterministic work.
6. Inspect `use cache` helper placement and lifetime.
7. Inspect HTTP `Cache-Control` separately.
8. Test authenticated responses through real CDN/proxy layers.
9. Compare process-local vs multi-instance behaviour.
10. Measure handler, upstream, and database latency separately.

## Interview questions

**Are Route Handlers cached by default?**  
No. GET handlers can opt into caching, and Cache Components provides the modern prerender/cache model.

**Can `use cache` be placed directly in a Route Handler body?**  
Current Cache Components guidance is to extract cacheable work into a helper and use the directive there.

**Why is `Cache-Control` not the same as `use cache`?**  
`Cache-Control` describes HTTP intermediary/browser reuse; `use cache` describes Next.js server-side cached computation/output.

**Why can a handler behave differently on serverless hosting?**  
Instances may be ephemeral, isolated, timeout-bound, and unable to share in-memory state.

## Exercise

Design three endpoints:

```text
GET /api/public/plans
GET /api/me
POST /api/reports
```

For each decide:

- request-time vs prerendered
- `use cache` helper or no cache
- HTTP `Cache-Control`
- runtime/deployment assumptions
- whether work should be synchronous or queued

Explain the security and freshness contract for each.