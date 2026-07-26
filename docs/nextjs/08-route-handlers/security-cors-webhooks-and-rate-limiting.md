---
title: Security, CORS, Webhooks & Rate Limiting
description: Secure public Route Handlers with authentication, authorization, CORS, webhook verification, callback validation, rate limiting, timeouts, and safe logging.
---

# Security, CORS, Webhooks & Rate Limiting

A Route Handler is a public network boundary.

That means security starts from this assumption:

```text
method      → attacker controlled
URL         → attacker controlled
query       → attacker controlled
headers     → attacker controlled unless trusted infrastructure proves otherwise
cookies     → client supplied
body        → attacker controlled
call rate   → attacker controlled
```

The server must decide what becomes trusted.

## Authentication is not authorization

Authentication asks:

```text
Who is this caller?
```

Authorization asks:

```text
May this caller perform this operation on this resource?
```

Example:

```ts
const session = await requireSession(request)

const project = await db.project.findFirst({
  where: {
    id: projectId,
    organisationId: session.organisationId,
  },
})

if (!project) {
  return Response.json(
    { error: 'NOT_FOUND' },
    { status: 404 },
  )
}
```

Do not rely on UI visibility or Proxy-only gating as the final authorization check.

## Public endpoint does not mean unauthenticated

`public HTTP endpoint` means the URL can be called directly.

It can still require:

- session cookie
- bearer token
- signed request
- API key
- mTLS at infrastructure layer
- OAuth access token

The handler must enforce the contract.

## CORS is not authentication

CORS controls which browser origins may read/use cross-origin responses.

It does **not** stop:

- curl
- backend scripts
- bots
- malicious servers
- direct HTTP clients

Therefore:

```text
CORS
≠
authentication
≠
authorization
```

## Basic CORS response

```ts
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://app.example.com',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  })
}
```

Then include appropriate headers in actual responses.

## Avoid `*` with credentials

Credentialed browser requests require a specific allowed origin rather than a wildcard.

If you reflect the incoming `Origin`, validate it against an allow-list first.

Dangerous:

```ts
const origin = request.headers.get('origin')
headers.set('Access-Control-Allow-Origin', origin!)
```

without validation.

## Origin allow-list

```ts
const allowedOrigins = new Set([
  'https://app.example.com',
  'https://admin.example.com',
])

function allowedOrigin(request: Request) {
  const origin = request.headers.get('origin')
  return origin && allowedOrigins.has(origin) ? origin : null
}
```

Do not use substring checks such as:

```ts
origin.includes('example.com')
```

because domains like:

```text
evil-example.com
```

can pass naive validation.

## CORS across many routes

When many endpoints share CORS policy, centralize it deliberately through supported request-pipeline/config architecture rather than duplicating inconsistent headers in every file.

Phase 9 covers Proxy/request pipeline depth.

## CSRF

Cookie-authenticated mutation endpoints may be vulnerable to cross-site request forgery depending on cookie/SameSite and request design.

Defences can include:

- SameSite cookies
- CSRF tokens
- Origin/Referer validation
- framework/server-action protections where applicable
- requiring non-simple custom headers for API clients

Do not assume JSON automatically eliminates CSRF.

## Rate limiting

Rate-limit operations where abuse could consume resources or create side effects.

```ts
const result = await checkRateLimit({
  key: identityOrIp,
  route: 'create-report',
})

if (!result.allowed) {
  return Response.json(
    { error: 'RATE_LIMITED' },
    {
      status: 429,
      headers: {
        'Retry-After': String(result.retryAfterSeconds),
      },
    },
  )
}
```

A production limiter may need shared storage so limits apply across instances.

## Choose the rate-limit key carefully

Possible dimensions:

```text
IP
user ID
API key
tenant
resource
route
operation cost
```

IP-only limits can harm users behind NAT and are easy to evade in some environments.

Authenticated operations often benefit from identity- or tenant-based controls in addition to network-level protection.

## Trusting client IP

In many deployments, the application receives traffic through proxies/CDNs.

Do not blindly trust:

```text
x-forwarded-for
```

unless your hosting platform defines a trusted forwarding chain and strips spoofed values.

## Rate limiting is layered

Use both where useful:

```text
platform/WAF/CDN limiter
+
application/domain limiter
```

Platform controls absorb generic abuse.

Application controls understand user/tenant/resource cost.

## Timeouts

Every external dependency should have a latency budget.

Without one:

```text
slow provider
→ handler waits
→ concurrency accumulates
→ compute exhausted
```

Use upstream cancellation/timeouts and return a controlled failure such as `502` or `503` according to your contract.

## Webhook architecture

Webhooks are a canonical Route Handler use case:

```text
provider
  ↓ POST
Route Handler
  ↓ verify authenticity
  ↓ deduplicate event
  ↓ validate payload
  ↓ perform/enqueue work
  ↓ acknowledge
```

The order matters.

## Verify signatures before trusting parsed fields

Many providers sign the raw body.

```ts
export async function POST(request: Request) {
  const raw = await request.text()
  const signature = request.headers.get('provider-signature')

  if (!verifySignature(raw, signature)) {
    return new Response('Invalid signature', { status: 401 })
  }

  const event = JSON.parse(raw)
  // process validated event
}
```

Use the provider's official verification library where possible.

## Replay attacks

A valid signature may still be replayed.

Protections can include:

```text
event ID uniqueness
timestamp freshness
nonce
provider delivery ID
idempotent state transition
```

Store processed event IDs when duplicate delivery would be harmful.

## Webhook acknowledgement strategy

Do not make a webhook provider wait for unrelated long processing.

Often:

```text
verify
persist/deduplicate
enqueue durable work
return 2xx
```

is better than keeping the HTTP request open while performing a long workflow.

But only acknowledge after enough durable state exists that the event will not be lost.

## Webhook retries

Providers often retry when they do not receive a successful response.

Therefore webhook consumers should be designed for:

```text
at-least-once delivery
```

unless the provider explicitly guarantees something else.

Idempotency is mandatory for payment/order/subscription events.

## Callback URLs

OAuth/payment callbacks often contain:

- authorization codes
- state values
- session tokens
- redirect destinations

Validate all of them.

For OAuth-style flows, verify the anti-CSRF `state` binding before accepting the callback.

## Open redirect risk

Dangerous callback:

```ts
const redirectTo = request.nextUrl.searchParams.get('redirect_url')!
return NextResponse.redirect(redirectTo)
```

Validate origin/path against an allow-list or use a server-stored return destination.

## Secrets

Never return provider secret values in errors.

Do not log:

```text
Authorization headers
session cookies
API keys
webhook signing secrets
OAuth codes
password-reset tokens
full payment data
```

Use structured redaction.

## Safe logging

Good log fields:

```text
request ID
route
method
status
latency
identity ID (if policy permits)
tenant ID
provider event ID
error code
upstream name
```

Avoid raw bodies by default.

## API keys

If you issue API keys:

- generate high entropy values
- store hashes where possible
- support rotation/revocation
- scope permissions
- track last-used metadata
- never expose full keys in logs

Do not use a permanent shared secret across all customers unless that is a deliberate internal-only design.

## CORS and cache interaction

If response headers vary by origin, caches may need:

```text
Vary: Origin
```

But an unbounded set of origins can create cache-key explosion.

Prefer a small explicit allow-list and deliberate caching policy.

## Security headers

API endpoints may still need relevant headers such as:

```text
Content-Type
Cache-Control
X-Content-Type-Options
Content-Disposition
```

depending on the response.

Broader CSP/security-header policy belongs to Phase 13.

## Denial-of-service considerations

Cost multipliers include:

```text
large body
expensive regex
expensive DB query
unbounded search
fan-out to many services
large export
image/video transformation
LLM generation
```

Rate-limit and bound expensive operations.

## Common mistakes

### Treating CORS as access control

Non-browser clients ignore CORS.

### Verifying webhook signatures after parsing/transformation

Verify the exact provider-signed representation.

### Assuming webhooks are delivered once

Design for retries and duplicates.

### Trusting forwarded IP headers blindly

Understand your proxy chain.

### Logging raw request bodies

Can leak secrets and personal data.

### Acknowledging webhook before durable state exists

A crash can lose the event permanently.

## Debugging checklist

1. Reproduce without browser CORS using curl.
2. Inspect `Origin` and preflight behaviour.
3. Verify credentials independently of Proxy.
4. Verify webhook raw-body bytes and signature headers.
5. Re-send the same webhook event ID.
6. Test stale/replayed webhook timestamps.
7. Test rate limits across multiple app instances.
8. Inspect log redaction.
9. Test upstream timeout paths.
10. Verify redirect/callback destinations cannot escape the allow-list.

## Interview questions

**Does CORS secure an API?**  
No. It is a browser cross-origin policy, not authentication or authorization.

**Why must webhook handlers be idempotent?**  
Providers commonly retry delivery, so the same event can arrive multiple times.

**Why verify webhook signatures using the raw body?**  
Providers often compute the signature over the exact payload bytes, not a parsed/re-serialized object.

**Where should rate limiting happen?**  
Often at both infrastructure and application layers, using keys that reflect network abuse and domain cost.

## Exercise

Design:

```text
POST /api/webhooks/payments
```

Include:

- raw signature verification
- timestamp/replay protection
- event-ID deduplication
- transaction/outbox handling
- quick acknowledgement
- retry-safe processing
- request ID logs with redaction
- platform + application rate/abuse controls

Then explain which failures should return 2xx, 4xx, or 5xx according to the provider retry contract.