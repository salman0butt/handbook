---
title: Request, Response, NextRequest & NextResponse
description: Work with Web Request and Response APIs, NextRequest, NextResponse, query strings, headers, cookies, redirects, and typed route params.
---

# `Request`, `Response`, `NextRequest` & `NextResponse`

Route Handlers are built on the Web platform APIs first.

The default mental model is:

```text
incoming HTTP request
  ↓
Request / NextRequest
  ↓
route logic
  ↓
Response / NextResponse
  ↓
outgoing HTTP response
```

You should understand the native APIs before reaching for framework-specific helpers.

## Native `Request`

A handler may accept the standard Web `Request` type:

```ts
export async function POST(request: Request) {
  const body = await request.json()
  return Response.json({ body })
}
```

Useful native properties include:

```ts
request.method
request.url
request.headers
request.body
request.signal
```

Useful native methods include:

```ts
request.json()
request.text()
request.formData()
request.arrayBuffer()
request.blob()
request.clone()
```

## Native `Response`

You can return a standard `Response`:

```ts
return new Response('Hello', {
  status: 200,
  headers: {
    'Content-Type': 'text/plain; charset=utf-8',
  },
})
```

For JSON:

```ts
return Response.json({ ok: true })
```

Use the native response whenever you do not need a Next-specific convenience API.

## `NextRequest`

`NextRequest` extends the Web `Request` API.

```ts
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const query = request.nextUrl.searchParams.get('q')

  return Response.json({ pathname, query })
}
```

The most common additions are:

```text
request.nextUrl
request.cookies
```

## `nextUrl`

`request.nextUrl` is an extended parsed URL object.

Example:

```ts
export function GET(request: NextRequest) {
  const {
    pathname,
    searchParams,
  } = request.nextUrl

  return Response.json({
    pathname,
    page: searchParams.get('page'),
  })
}
```

For:

```text
/api/search?page=2
```

you can read:

```text
pathname → /api/search
page     → 2
```

## Native URL works too

Framework convenience is optional.

```ts
export function GET(request: Request) {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')

  return Response.json({ q })
}
```

Choose the simplest API for the job.

## Search params are untrusted

Never assume:

```text
?page=2
```

means the value is valid.

Validate:

```ts
const raw = request.nextUrl.searchParams.get('page')
const page = Number(raw ?? '1')

if (!Number.isInteger(page) || page < 1 || page > 1000) {
  return Response.json(
    { error: 'Invalid page' },
    { status: 400 },
  )
}
```

## Read headers

Native:

```ts
const auth = request.headers.get('authorization')
const contentType = request.headers.get('content-type')
```

Or use the App Router request API:

```ts
import { headers } from 'next/headers'

export async function GET() {
  const headerStore = await headers()
  const userAgent = headerStore.get('user-agent')

  return Response.json({ userAgent })
}
```

`headers()` is asynchronous in the current App Router API.

## Headers are a trust boundary

Do not trust headers merely because they exist.

Potentially attacker-controlled values include:

```text
x-forwarded-for
x-user-id
x-role
x-tenant-id
referer
user-agent
custom x-* headers
```

If a trusted proxy injects identity headers, verify that your deployment strips spoofed client versions before trusting them.

## Response headers

To send a header to the client:

```ts
return Response.json(
  { ok: true },
  {
    headers: {
      'Cache-Control': 'private, no-store',
      'X-Request-Id': requestId,
    },
  },
)
```

Do not reflect arbitrary request headers back to the client.

## Request cookies with `NextRequest`

```ts
export function GET(request: NextRequest) {
  const session = request.cookies.get('session')
  return Response.json({ hasSession: Boolean(session) })
}
```

Useful methods include:

```ts
request.cookies.get('name')
request.cookies.getAll('name')
request.cookies.has('name')
```

## Cookies with `cookies()`

```ts
import { cookies } from 'next/headers'

export async function POST() {
  const store = await cookies()
  store.set('theme', 'dark', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  })

  return new Response(null, { status: 204 })
}
```

Route Handlers may read and write outgoing cookies.

## Cookie security

For authentication/session cookies, typically consider:

```text
HttpOnly
Secure
SameSite
Path
Max-Age / Expires
Domain
```

Do not put sensitive session state in a JavaScript-readable cookie unless the architecture genuinely requires it.

## `NextResponse`

`NextResponse` extends the Web Response API with convenience helpers.

```ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ ok: true })
}
```

Useful helpers include:

```text
NextResponse.json()
NextResponse.redirect()
NextResponse.rewrite()
response.cookies
```

`NextResponse.next()` is primarily a Proxy concept rather than the normal Route Handler response path.

## Redirect response

```ts
import { NextResponse } from 'next/server'

export function GET(request: NextRequest) {
  const url = new URL('/login', request.url)
  return NextResponse.redirect(url)
}
```

You can also use App Router redirect helpers where appropriate:

```ts
import { redirect } from 'next/navigation'

export async function GET() {
  redirect('/login')
}
```

Choose based on whether you want to construct a response explicitly or use framework control flow.

## Safe redirect destinations

Dangerous:

```ts
const next = request.nextUrl.searchParams.get('next')
return NextResponse.redirect(next!)
```

An attacker may supply an external destination.

Prefer validating against your own origin or an allow-list:

```ts
const next = request.nextUrl.searchParams.get('next') ?? '/'
const target = new URL(next, request.url)

if (target.origin !== request.nextUrl.origin) {
  return NextResponse.redirect(new URL('/', request.url))
}

return NextResponse.redirect(target)
```

## Rewrite vs redirect

```text
redirect
→ client receives redirect response
→ browser URL changes

rewrite
→ server serves another destination
→ browser-visible URL can stay the same
```

Rewrites are powerful but can make request flow harder to debug. Use them when preserving the public URL is part of the requirement.

## Route params

Dynamic Route Handler:

```text
app/api/projects/[id]/route.ts
```

```ts
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  return Response.json({ id })
}
```

The `params` value is a Promise in the current contract.

## `RouteContext`

```ts
export async function GET(
  request: Request,
  ctx: RouteContext<'/api/projects/[id]'>,
) {
  const { id } = await ctx.params
  return Response.json({ id })
}
```

This gives route-literal-aware param typing after Next.js type generation.

## Clone before multiple reads

A request body is a stream and can normally be consumed only once.

If two independent consumers genuinely need it:

```ts
const clone = request.clone()

const raw = await request.text()
const parsed = await clone.json()
```

But avoid unnecessary duplication for large bodies because cloning can increase memory/streaming complexity.

## Abort signals

`request.signal` can help downstream work respond to cancellation:

```ts
await fetch(upstreamUrl, {
  signal: request.signal,
})
```

Not every database/client library supports cancellation, but propagate it when the API provides a safe path.

## Response ownership

Once streaming response bytes have started, HTTP headers are already committed.

This affects:

- cookies
- status codes
- response headers

Set them before streaming begins.

## Common mistakes

### Using `NextRequest` when native `Request` is enough

Framework helpers are optional.

### Trusting proxy-style headers blindly

Identity headers require deployment-level trust guarantees.

### Reflecting all request headers

This can leak cookies, authorization, internal metadata, or client-controlled values.

### Treating query params as typed values

They are strings and untrusted.

### Reading the request body twice

Clone first only when multiple consumers are genuinely required.

### Building open redirects

Validate redirect destinations.

## Debugging checklist

1. Inspect `request.method` and `request.url`.
2. Inspect parsed pathname/search params.
3. Log allow-listed diagnostic headers only.
4. Check cookie domain/path/SameSite/Secure rules.
5. Verify whether the request body has already been consumed.
6. Verify redirect destination origin.
7. Inspect response status and headers before body parsing.
8. Confirm dynamic params were awaited.
9. Reproduce with curl or another raw HTTP client.
10. Compare local and deployed reverse-proxy headers.

## Interview questions

**What does `NextRequest` add to `Request`?**  
Next.js convenience APIs such as `nextUrl` and cookie helpers while retaining compatibility with the Web Request API.

**Do you need `NextResponse` to return JSON?**  
No. Native `Response.json()` is sufficient in many cases.

**Why can a request body usually be read only once?**  
Because it is represented as a stream. Clone it before multiple consumers if necessary.

**Why is blindly forwarding request headers dangerous?**  
They may contain secrets, internal metadata, or attacker-controlled values.

## Exercise

Build:

```text
GET /api/search?q=react&page=2
```

Validate the query, return JSON, attach a request ID header, reject invalid page values, and document which request values are trusted versus untrusted.