---
title: NextRequest, NextResponse, Headers, Cookies & Continuation
description: Use NextRequest and NextResponse safely in Proxy to continue requests, pass internal metadata, set response headers, and manage cookies.
---

# `NextRequest`, `NextResponse`, Headers, Cookies & Continuation

Proxy sits at a sensitive boundary:

```text
untrusted network request
        ↓
Proxy
        ↓
application route
        ↓
client response
```

The same header API can either pass trusted internal context downstream or accidentally expose it to the browser.

## Read from `NextRequest`

```ts
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const origin = request.headers.get('origin')
  const session = request.cookies.get('session')

  // ...
}
```

Useful request state includes:

```text
request.nextUrl
request.headers
request.cookies
request.method
request body when required
```

## Continue with `NextResponse.next()`

```ts
import { NextResponse } from 'next/server'

export function proxy() {
  return NextResponse.next()
}
```

This means:

```text
continue request processing
```

not:

```text
return an empty HTTP response
```

## Modify downstream request headers

To pass information to the route/render layer:

```ts
export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-request-id', crypto.randomUUID())

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}
```

The destination route can read that request header.

## Do not confuse request and response headers

These are different contracts.

Internal downstream request header:

```ts
NextResponse.next({
  request: {
    headers: requestHeaders,
  },
})
```

Client-visible response header:

```ts
const response = NextResponse.next()
response.headers.set('x-example', 'value')
return response
```

A common mistake is to pass a `Headers` object in the wrong place and expose information that was intended only for server-side consumers.

## Internal metadata design

Good candidates for internal request headers:

```text
request correlation ID
validated tenant routing hint
locale selection
CSP nonce
front-door experiment bucket
```

Bad candidates:

```text
raw password
access token copied unnecessarily
full session object
private authorization policy dump
large serialized user record
```

Use minimal metadata.

## Never trust client-provided internal headers

Suppose downstream code trusts:

```text
x-user-id
```

If the browser can send that header, a client can impersonate another user unless Proxy overwrites and validates it.

Safer pattern:

```ts
const headers = new Headers(request.headers)
headers.delete('x-internal-user-id')

const identity = verifySession(request)

if (identity) {
  headers.set('x-internal-user-id', identity.userId)
}
```

Even then, sensitive operations should authorize again close to the data source.

## Header-size limits

Large headers can trigger infrastructure failures such as:

```text
431 Request Header Fields Too Large
```

Do not serialize large application state into request headers.

Prefer:

```text
small opaque identifier
→ server-side lookup when truly needed
```

## Request cookies

`NextRequest.cookies` provides request-cookie access.

```ts
const session = request.cookies.get('session')
const all = request.cookies.getAll()
const hasSession = request.cookies.has('session')
```

Request cookies are client-provided input.

Signed/encrypted session cookies must still be verified.

## Mutating request cookie state

The request cookie API can be changed for the request object used during Proxy processing.

But distinguish:

```text
change request-side representation
from
send Set-Cookie to browser
```

To persist a cookie to the client, set it on the outgoing response.

## Response cookies

```ts
export function proxy() {
  const response = NextResponse.next()

  response.cookies.set({
    name: 'theme',
    value: 'dark',
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
  })

  return response
}
```

Cookie security attributes should reflect the actual threat model.

## Session-cookie guidance

For authentication cookies, typically evaluate:

```text
HttpOnly
Secure
SameSite
Path
Domain
expiry / Max-Age
rotation
signing or encryption
```

Proxy may read a session cookie for optimistic routing, but the session system owns its cryptographic validity.

## Response headers

```ts
export function proxy() {
  const response = NextResponse.next()
  response.headers.set('x-request-policy', 'dashboard')
  return response
}
```

Possible uses:

```text
security headers
cache policy
correlation metadata
CORS response headers
observability hints
```

Prefer `next.config.js` for static headers that do not depend on request state.

## Security headers: static vs dynamic

Static policy:

```text
X-Content-Type-Options
Referrer-Policy
some CSP policies
```

may be better in `headers()` from `next.config.js`.

Per-request policy such as a CSP nonce may require Proxy.

Use the cheapest correct layer.

## `request.nextUrl`

`NextRequest` exposes a parsed URL object:

```ts
const url = request.nextUrl.clone()
url.pathname = '/login'
url.searchParams.set('from', request.nextUrl.pathname)
```

Then:

```ts
return NextResponse.redirect(url)
```

Treat redirect parameters carefully to avoid open redirects.

## RSC requests and internal headers

App Router navigation uses React Server Component request metadata internally.

Next.js intentionally hides internal Flight headers from ordinary `request.headers` in Proxy so application code does not accidentally route HTML and RSC requests differently.

When you use:

```ts
NextResponse.rewrite(...)
```

Next.js propagates the internal rewrite information needed by the RSC transport.

## Avoid custom fetch rewrites when a rewrite is enough

If you replace `NextResponse.rewrite()` with a manual `fetch()` proxy, you become responsible for forwarding protocol details correctly.

That includes subtle App Router/RSC behavior.

Prefer the framework rewrite primitive unless you truly need an HTTP gateway implementation.

## Body reads in Proxy

Proxy can inspect request bodies, but body handling increases cost and memory pressure.

Current Next.js automatically buffers/clones request bodies used by Proxy so downstream handlers can still read them, subject to framework limits.

Do not read bodies globally when only a few endpoints need it.

## Experimental body-size control

Current Next.js exposes experimental `proxyClientMaxBodySize` configuration for buffered Proxy bodies.

Treat it as experimental, not a production-stable API contract.

Large uploads are usually better handled by dedicated upload architecture rather than broad Proxy body inspection.

## Correlation-ID pattern

```ts
export function proxy(request: NextRequest) {
  const existing = request.headers.get('x-request-id')
  const requestId = isTrustedRequestId(existing)
    ? existing!
    : crypto.randomUUID()

  const headers = new Headers(request.headers)
  headers.set('x-request-id', requestId)

  const response = NextResponse.next({
    request: { headers },
  })

  response.headers.set('x-request-id', requestId)
  return response
}
```

Decide whether client-provided IDs are trusted or replaced.

## Common mistakes

### Leaking internal request headers

Distinguish downstream request headers from browser response headers.

### Trusting identity headers from clients

Strip/overwrite them at the trust boundary.

### Huge serialized headers

Can hit infrastructure limits and increase every request size.

### Using Proxy for static headers

Prefer `next.config.js` when request-time logic is unnecessary.

### Reading large bodies globally

Matcher scope and endpoint ownership matter.

## Debugging checklist

1. Inspect the incoming raw headers.
2. Inspect headers after Proxy transformation.
3. Verify whether the value is on the request or response.
4. Confirm downstream `headers()` sees the expected value.
5. Confirm browser DevTools does not expose private internal metadata.
6. Check cookie attributes in the actual `Set-Cookie` header.
7. Check reverse-proxy header-size limits.
8. Test RSC navigation and hard reloads after rewrites.

## Interview questions

**How do you pass a header from Proxy to a Server Component without returning it to the browser?**  
Clone the request headers and pass them through `NextResponse.next({ request: { headers } })`.

**Why should internal identity headers be stripped from incoming requests?**  
Because clients can often forge them; trusted values must be established at the server boundary.

**Why prefer `NextResponse.rewrite` over manually fetching the destination?**  
It preserves Next.js routing and RSC rewrite semantics automatically.

## Exercise

Implement a Proxy that:

- accepts or generates a request ID
- strips incoming `x-internal-user-id`
- verifies a session cookie
- forwards a minimal trusted user identifier downstream
- exposes only the request ID back to the client
- avoids running for static assets

Then document the trust boundary for every header.