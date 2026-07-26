---
title: Request Pipeline Architecture & Design Review
description: Design and review a production request pipeline that assigns redirects, rewrites, auth, tenancy, localization, headers, and business logic to the correct Next.js layer.
---

# Request Pipeline Architecture & Design Review

Senior Next.js architecture is less about knowing every Proxy API and more about **putting each request concern in the correct layer**.

## The ownership map

Use this baseline:

| Concern | Preferred owner |
| --- | --- |
| static redirect | `next.config.js` redirects |
| static response header | `next.config.js` headers |
| request-dependent redirect/rewrite | Proxy |
| locale/tenant front-door routing | Proxy |
| page data | Server Component/data layer |
| HTTP endpoint | Route Handler |
| application mutation | Server Action/domain command |
| authoritative authorization | data/domain/API boundary |
| CDN/DDoS/payload filtering | infrastructure |
| per-request CSP nonce | Proxy + dynamic render |

## Layered request architecture

```text
Internet
  ↓
CDN / reverse proxy / WAF
  ↓
next.config headers + redirects
  ↓
Proxy
  ↓
Next.js route resolution
  ↓
Page | Route Handler | Server Function POST
  ↓
DAL / domain service
  ↓
DB / upstream systems
```

Each layer should have a narrow job.

## Design rule: earliest useful, latest authoritative

Some checks should happen early for efficiency:

```text
obviously unauthenticated user
→ redirect in Proxy
```

But the authoritative check should happen close to the protected operation:

```text
delete invoice
→ verify user + tenant + invoice permission inside action/domain layer
```

This yields both performance and security.

## Example: SaaS dashboard

Requirements:

```text
custom tenant domain
locale routing
signed session
protected dashboard
public marketing pages
private API
CSP nonce
```

Possible architecture:

```text
reverse proxy
→ normalize host / trusted forwarding

Proxy
→ resolve tenant routing hint
→ locale redirect
→ optimistic session gate
→ generate nonce
→ add request ID

Server Components
→ authoritative tenant-scoped reads

Server Actions
→ authenticate + authorize mutations

Route Handlers
→ authenticate + authorize HTTP clients
```

## Example: public content site

Requirements:

```text
legacy redirects
locale prefix
mostly static pages
strict caching
```

Do not force everything through dynamic Proxy logic.

Prefer:

```text
static redirects → next.config
static headers → next.config
locale request decision → Proxy only where needed
page content → static/cache components
```

Minimize front-door dynamic work to preserve caching.

## Example: API-heavy application

Proxy can provide:

```text
request ID
broad CORS policy
coarse auth gate
shared tenant hint
```

Route Handlers own:

```text
method semantics
body validation
resource authorization
rate-limit quota by identity
response contract
```

Infrastructure owns volumetric protection.

## Example: migration from legacy monolith

Use Proxy for controlled rewrites:

```text
/new/* → Next.js
/legacy/* → existing service
```

Be explicit about:

```text
cookie compatibility
Host forwarding
cache headers
RSC paths
SEO/canonical redirects
rollback path
```

Proxy can support strangler migrations, but it should not become a permanent hidden service mesh.

## Trust-boundary diagram

```text
client-controlled
  URL
  headers
  cookies
  body
        ↓
Proxy validates only what it needs
        ↓
trusted routing metadata
        ↓
route/data boundary validates identity + authorization again
```

Do not convert arbitrary client input into trusted internal headers without validation.

## Cache architecture review

Proxy decisions can affect caching through:

```text
cookies
headers
rewrites
redirects
nonce generation
variant routing
```

Ask:

1. Does this request-specific value force dynamic rendering?
2. Does it change CDN cache keys?
3. Could two tenants/locales share a cached response incorrectly?
4. Is a redirect cacheable when it should not be?
5. Does a CSP nonce eliminate static output?

## Routing-loop review

For every redirect/rewrite, define a termination condition.

```text
source condition
→ destination
→ destination no longer satisfies source condition
```

Test canonical URLs, locale prefixes, login routes, and internal rewrite paths.

## Security review

A Proxy design is incomplete until reviewers can answer:

```text
What if Proxy does not run?
```

Sensitive data and mutations must remain protected.

Also review:

```text
open redirects
host-header poisoning
forwarded-header trust
CORS allow-list
cookie security
CSP policy
secret logging
matcher gaps
```

## Performance review

Measure:

```text
invocation count by route class
p50 / p95 / p99 Proxy latency
remote lookup latency
redirect/rewrite rates
prefetch invocation rate
body-buffering memory risk
```

A front-door function should have a stricter latency budget than a page-specific backend operation.

## Failure-domain review

List each Proxy dependency:

```text
session verifier
feature store
Geo service
redirect store
analytics
```

For each define:

```text
timeout
retry policy
fallback
fail-open/fail-closed choice
blast radius
```

A dependency called by every request can become a site-wide failure domain.

## Observability design

Use a stable decision taxonomy:

```text
NEXT
REDIRECT_AUTH
REDIRECT_LOCALE
REWRITE_TENANT
REJECT_CORS
REJECT_POLICY
```

Then metrics can answer:

```text
Why is Proxy returning more redirects today?
Which tenant rewrite is failing?
Did matcher changes double invocation volume?
```

## Testing strategy

At minimum:

```text
unit matcher tests
unit decision tests
integration routing tests
browser soft/hard navigation tests
host/locale tests
security negative tests
production smoke tests
```

Experimental Next.js Proxy test helpers can support unit-level coverage; production behavior still needs integration/E2E verification.

## Decision record template

For a significant Proxy rule, record:

```text
Problem
Why Proxy is the correct layer
Matcher scope
Inputs read
Outputs changed
Security assumptions
Caching effect
Failure behavior
Latency budget
Tests
Migration/rollback plan
```

## Anti-pattern catalog

### God Proxy

Auth, DB, feature flags, analytics, business rules, and API logic all run globally.

### Permission proxy

Routes trust Proxy headers as final authorization without resource checks.

### Rewrite maze

Multiple overlapping rewrites make destination ownership impossible to predict.

### Header state bus

Large domain objects are serialized into custom headers.

### Permanent experiment

Temporary A/B routing becomes unowned infrastructure forever.

### Silent matcher drift

New routes or Server Functions bypass intended Proxy behavior.

## Senior interview scenario

**You inherit a Proxy that takes 180 ms p95 and protects every route by querying the database. What do you change?**

A strong answer:

1. Measure invocation classes and dependency latency.
2. Narrow matcher scope.
3. Replace database gating with a verifiable lightweight session signal where appropriate.
4. Keep authoritative authorization in DAL/actions/endpoints.
5. Move static redirects/headers to config.
6. Move optional analytics to `waitUntil` or another telemetry path.
7. Add timeouts/fallbacks for unavoidable front-door dependencies.
8. Verify soft navigation and prefetch behavior.

## Milestone project

Design the request pipeline for a multi-tenant global SaaS application with:

```text
custom domains
locale prefixes
public marketing pages
protected dashboard
REST integrations
Server Actions
CSP
feature rollout
legacy redirects
```

Deliver:

- request execution diagram
- Proxy matcher config
- tenant routing strategy
- auth gating vs authoritative authorization map
- header/cookie trust model
- CSP rendering decision
- latency budget
- failure policy
- E2E test matrix
- rollback plan

## Phase summary

A production Proxy should be:

```text
narrow
fast
explicit
request-oriented
non-authoritative for business permissions
observable
testable
deployment-aware
```

The best Proxy architecture often contains **less logic**, because responsibilities have been moved to the layers that actually own them.