---
title: Auth Gating, Security, CORS & CSP
description: Use Proxy for optimistic auth gating and request security without confusing front-door checks with authoritative authorization.
---

# Auth Gating, Security, CORS & CSP

Proxy can improve security posture, but it is dangerous when teams treat it as the **only** security layer.

## Authentication, authorization, and gating

Keep three concepts separate:

```text
authentication
→ who is this user?

authorization
→ may this user perform this operation?

Proxy gating
→ should this request proceed to the route at all?
```

Proxy is best suited to the third concern, often using lightweight session information.

## Optimistic auth checks

The current Next.js auth guidance recommends Proxy as an optional place for optimistic route checks.

Example:

```ts
export async function proxy(request: NextRequest) {
  const session = await readSignedSessionCookie(request)

  if (
    request.nextUrl.pathname.startsWith('/dashboard') &&
    !session?.userId
  ) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}
```

The goal is to avoid starting protected rendering for obviously unauthenticated requests.

## Avoid database authorization in global Proxy

Bad default:

```text
every request
→ DB permission query
→ route
```

Proxy may run on prefetched and broad traffic. Expensive authorization here can become a latency multiplier.

Prefer:

```text
Proxy
→ lightweight signed-cookie/session check

DAL / Server Function / Route Handler
→ authoritative database/resource authorization
```

## Defense in depth

For a protected mutation:

```text
Proxy gate
      ↓
route renders
      ↓
Server Action receives POST
      ↓
Action authenticates
      ↓
Action authorizes resource
      ↓
DB mutation
```

If Proxy matcher coverage changes, the mutation remains protected.

## Server Functions and matcher drift

Server Functions are POST requests to their associated route.

Moving a function or changing matcher rules can change whether Proxy runs.

Therefore:

> Never rely on Proxy coverage as the only permission check for Server Functions.

## CORS

Proxy can add CORS headers for groups of routes.

But CORS answers:

```text
may browser JavaScript from this origin read/use this response?
```

It does **not** answer:

```text
is this caller authenticated?
```

Non-browser clients are not constrained by browser CORS enforcement.

## Preflight handling

For cross-origin APIs, Proxy can answer `OPTIONS` before route execution when the policy is shared broadly.

Validate the request origin against an allow-list.

Do not reflect arbitrary origins when credentials are involved.

## Route-specific CORS

If CORS applies to only one API, keep it in the Route Handler.

Use Proxy when the policy is truly shared across a route group.

## CSRF

Cookie-authenticated state-changing requests require CSRF reasoning.

Possible defenses include:

```text
SameSite cookie policy
Origin validation
CSRF token
custom request headers where appropriate
framework Server Action origin checks
```

Proxy can enforce broad origin policy, but mutation endpoints/actions should still implement the protection appropriate to their protocol.

## Security headers

Static security headers may be configured in `next.config.js`.

Proxy becomes useful when the policy depends on each request.

A key example is a CSP nonce.

## CSP nonce architecture

A strict nonce flow:

```text
request
  ↓
Proxy generates cryptographically unpredictable nonce
  ↓
nonce placed into CSP request/response headers
  ↓
dynamic route render reads nonce
  ↓
framework/scripts use matching nonce
```

Every request needs a fresh nonce.

## Nonce performance implication

Per-request nonce CSP requires dynamic rendering because the nonce does not exist at build time.

That can disable static/CDN optimizations for affected pages.

Security policy therefore has an architecture/performance cost that must be chosen deliberately.

## Do not invent nonces from predictable input

Bad:

```text
nonce = user ID
nonce = timestamp only
nonce = pathname
```

Use cryptographically unpredictable randomness.

## Security policy placement

Choose the narrowest correct layer:

```text
static response header
→ next.config headers()

request-derived security header
→ Proxy

endpoint-specific security rule
→ Route Handler

data/resource authorization
→ DAL/domain action/Route Handler/Server Function
```

## Rate limiting

Proxy can perform cheap front-door rate-limit checks, especially when infrastructure provides a low-latency shared store.

But rate limiting often belongs in multiple layers:

```text
reverse proxy/CDN
→ volumetric abuse

Proxy
→ broad route policy

endpoint/domain layer
→ identity/resource-specific quotas
```

Process-local counters are not reliable across multi-instance deployments.

## Bot and abuse filtering

Proxy may reject obvious unwanted traffic early.

Be cautious with:

```text
User-Agent-only blocking
IP-only identity
country-only authorization
```

These signals can be spoofed or shared.

## Client IP trust

Behind CDN/reverse proxies, client IP may come from forwarded headers.

Only trust headers that your infrastructure overwrites and documents.

Do not trust an arbitrary public `x-forwarded-for` value unless the trusted proxy chain is correctly configured.

## Security logging

Good Proxy security logs include:

```text
request ID
route class
policy decision
reason code
tenant hint
safe actor identifier
```

Avoid:

```text
raw cookies
Authorization headers
full JWTs
passwords
CSRF tokens
sensitive query values
```

## Common mistakes

### Proxy as sole authorization

Matcher drift becomes a vulnerability.

### Database lookups on every request

Can make auth gating a global latency bottleneck.

### CORS as security authentication

CORS is browser policy, not caller identity.

### Nonce CSP without rendering analysis

Strict per-request nonces force dynamic rendering.

### Trusting forwarded headers automatically

Trust depends on deployment infrastructure.

## Security review checklist

1. What identity information does Proxy use?
2. Is it cryptographically verified?
3. Which checks are optimistic only?
4. Where is authoritative resource authorization repeated?
5. What happens if matcher coverage changes?
6. Does CORS use an explicit allow-list?
7. Are cookie attributes intentional?
8. Are forwarded headers trusted only from known infrastructure?
9. Are secrets excluded from logs?
10. Does CSP choice change rendering/caching behavior?

## Interview questions

**Why is Proxy useful for auth if it cannot be the final authorization layer?**  
It can cheaply redirect obviously unauthenticated requests before rendering, improving UX and avoiding wasted work, while secure authorization remains near protected data/operations.

**Does CORS protect an API from curl or server-to-server calls?**  
No. Browsers enforce CORS. Authentication and authorization must protect the endpoint itself.

**Why does nonce-based CSP affect performance?**  
The nonce must be generated per request, so affected pages require dynamic rendering instead of build-time static output.

## Exercise

Design security for:

```text
/dashboard
/api/account
/api/public-search
Server Action deleteInvoice
```

Specify:

- Proxy matcher
- optimistic auth behavior
- authoritative authorization location
- CORS policy
- CSRF posture
- rate-limit layer
- security logging fields

Then describe how the system remains secure if Proxy is accidentally disabled.