---
title: Proxy Model, File Convention & Execution Order
description: Understand proxy.ts as the request-front-door boundary, where it runs, what it can change, and how it fits into Next.js request resolution.
---

# Proxy Model, File Convention & Execution Order

Next.js 16 renamed the old `middleware` file convention to **Proxy**.

The rename is architectural guidance, not cosmetic wording.

Proxy is a request-front-door hook that runs **before a route is rendered**. It can inspect the incoming request and decide to:

```text
continue
redirect
rewrite
modify request headers
modify response headers
set cookies
return a response directly
```

It is **not** Express-style application middleware that should own all business logic.

## File convention

Create exactly one Proxy file at the application root:

```text
proxy.ts
```

or, when using `src/`:

```text
src/proxy.ts
```

It sits at the same level as `app` or `pages`.

```text
src/
├── app/
├── lib/
└── proxy.ts
```

If custom `pageExtensions` are configured, the Proxy file must follow those extensions.

## Export contract

The file exports one Proxy function, either as the default export or as a named `proxy` export.

```ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  return NextResponse.next()
}
```

An optional `config` export controls matching:

```ts
export const config = {
  matcher: ['/dashboard/:path*'],
}
```

Do not create multiple independent Proxy functions and expect them to compose.

## The request-front-door mental model

Think of Proxy as a routing/security prefilter:

```text
incoming request
      ↓
next.config headers
      ↓
next.config redirects
      ↓
Proxy
      ↓
rewrites / route resolution
      ↓
page | route handler | server function request
      ↓
render / response
```

That position makes Proxy useful for request decisions that should happen **before expensive route work begins**.

## Exact execution order

Current App Router request resolution follows this order:

```text
1. headers() from next.config.js
2. redirects() from next.config.js
3. Proxy
4. beforeFiles rewrites
5. filesystem routes
6. afterFiles rewrites
7. dynamic routes
8. fallback rewrites
```

This matters when debugging a request that seems to ignore a rewrite or redirect.

A rule defined earlier can prevent a later stage from running.

## Filesystem routes include more than pages

The filesystem route stage includes things such as:

```text
public/
_next/static/
_next/image/
app/
pages/
```

Proxy runs before this stage, so a broad matcher can execute for assets as well as user-facing application routes.

That is why matcher design is a performance and correctness concern.

## `NextRequest`

The incoming argument is a `NextRequest`.

```ts
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const method = request.method
  const session = request.cookies.get('session')

  // ...
}
```

Useful request inputs include:

```text
URL / pathname / search params
headers
cookies
HTTP method
request body when deliberately read
```

Treat all of them as untrusted client-controlled input.

## `NextProxy` type

For concise typing, Next.js exposes `NextProxy`:

```ts
import type { NextProxy } from 'next/server'

export const proxy: NextProxy = (request, event) => {
  return Response.json({ pathname: request.nextUrl.pathname })
}
```

This types both the request and `NextFetchEvent`.

## `NextResponse.next()`

The most common successful outcome is:

```ts
return NextResponse.next()
```

Conceptually:

```text
Proxy decision complete
      ↓
continue through Next.js route resolution
```

It does not mean "send an empty response to the browser."

It means continue processing the request.

## Direct responses

Proxy may terminate the request early:

```ts
export function proxy(request: NextRequest) {
  if (!request.headers.get('authorization')) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 },
    )
  }

  return NextResponse.next()
}
```

Good use cases include:

```text
obvious unauthenticated API rejection
maintenance response
bot rejection
preflight response
small routing decision
```

Do not turn Proxy into the entire API layer.

## Server Functions in the request chain

Server Functions do **not** appear as separate filesystem routes.

They are POST requests to the route where they are used.

That creates an important rule:

> A Proxy matcher that skips a route also skips Server Function POSTs associated with that route.

Therefore Proxy cannot be the only authorization layer for Server Functions.

Every mutation must authenticate and authorize again at the mutation/data boundary.

## Current runtime

In the current stable Proxy API, Proxy uses the **Node.js runtime by default**.

Do not export:

```ts
export const runtime = 'nodejs'
```

from `proxy.ts`.

The `runtime` route config option is not available in Proxy files and setting it is an error.

## Proxy is separate from render code

Avoid designs like:

```text
Proxy mutates module-global object
      ↓
Page reads same object
```

Proxy may execute separately from route rendering, and deployment topology can separate instances.

Pass information explicitly through supported request/response channels:

```text
headers
cookies
URL
rewrite destination
redirect destination
```

## When Proxy is appropriate

Strong uses:

```text
locale routing
request-based redirects
legacy URL migration
optimistic auth gating
tenant/domain routing
CSP nonce injection
request metadata propagation
small edge/front-door policies
```

Weak uses:

```text
complex database transactions
full authorization policy
large data fetching
page-specific business logic
long-running work
reusable domain calculations
```

## Why Next.js renamed Middleware

The old `middleware` term suggested an Express-like chain where every request concern belongs in one general-purpose function.

The Proxy name communicates a narrower mental model:

```text
network boundary
routing decision
request transformation
front-door policy
```

Next.js explicitly recommends avoiding Proxy when a more direct framework API solves the problem.

## Proxy vs layout

Use Proxy when a decision must happen before route resolution/rendering.

Use a layout when the work belongs to the rendered route tree.

Example:

```text
redirect /old-docs → /docs
→ Proxy or next.config redirect

load current account navigation
→ layout / Server Component
```

## Proxy vs Route Handler

Use Proxy to intercept or transform an incoming request before its destination is resolved.

Use a Route Handler to **own an HTTP endpoint**.

```text
Proxy
→ front-door decision

route.ts
→ endpoint implementation
```

## Proxy vs `next.config.js`

Prefer static config when the rule is static.

```text
known permanent redirect
→ redirects() in next.config

known security header for every response
→ headers() in next.config

request-cookie-dependent redirect
→ Proxy
```

Static config is easier to reason about and often cheaper than executing request code.

## Failure mode: broad global Proxy

Bad:

```ts
export function proxy(request: NextRequest) {
  // DB call on every request
}
```

This may affect:

```text
pages
API requests
prefetches
assets unless excluded
bots
health checks
internal navigations
```

A small cost multiplied across all traffic becomes a major production cost.

## Failure mode: business logic in Proxy

If Proxy performs:

```text
validation
DB mutation
permission policy
external side effects
```

then those rules may be duplicated elsewhere and become hard to test transactionally.

Keep Proxy thin.

## Debugging ladder

When request behavior is surprising, ask:

1. Did `next.config` headers modify the request/response first?
2. Did a configured redirect terminate the request?
3. Did the Proxy matcher run?
4. Did Proxy return `next()`, rewrite, redirect, or a direct response?
5. Did `beforeFiles` rewrite the path?
6. Which filesystem route matched?
7. Did `afterFiles`, dynamic routes, or fallback rewrites apply?
8. Is the browser showing a cached redirect or response?

## Senior review questions

**Why is Proxy not the same as Express middleware?**  
It is a single Next.js request-front-door boundary with routing/response transformation semantics, not a general middleware pipeline for owning application business logic.

**Where does Proxy run in route resolution?**  
After `headers()` and `redirects()` from `next.config.js`, and before rewrites/filesystem route matching.

**Why should authorization still happen inside Server Functions and Route Handlers?**  
Proxy matching can change or be bypassed for routes, while mutations/endpoints remain directly invokable. Security checks belong close to the protected operation/data source.

## Exercise

For each requirement, choose `next.config`, Proxy, layout, Server Function, or Route Handler:

- permanent `/docs-v1/*` redirect
- locale prefix detection
- account navigation data
- update billing address
- webhook endpoint
- CSP nonce per request
- role check before deleting an invoice

Explain why the request lifecycle ownership is correct.