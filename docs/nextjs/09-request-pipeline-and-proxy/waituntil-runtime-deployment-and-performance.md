---
title: waitUntil, Runtime, Deployment & Performance
description: Keep Proxy fast and deployment-safe with NextFetchEvent, waitUntil, Node.js runtime constraints, body buffering awareness, and front-door performance budgets.
---

# `waitUntil`, Runtime, Deployment & Performance

Proxy can sit in front of high request volume.

A small amount of work here can become one of the most frequently executed code paths in the application.

## Current runtime contract

The current stable Proxy API uses the **Node.js runtime by default**.

Proxy does not support the route-level `runtime` config export.

Do not add:

```ts
export const runtime = 'nodejs'
```

to `proxy.ts`.

## Deployment separation

Proxy is architecturally separate from rendering code.

Do not depend on:

```text
module-global mutation
process-local session cache
in-memory rate limit as authoritative state
shared mutable singleton with route render
```

Deployment platforms may execute Proxy and routes in different processes or instances.

## Performance budget

For a broad matcher, think in terms of:

```text
Proxy latency × requests per page × traffic
```

A 20 ms network lookup may appear small but becomes expensive when performed for pages, prefetches, and API calls.

## Keep the critical path small

Prefer:

```text
parse URL
read/verify small cookie
small map lookup
simple rewrite/redirect
set minimal headers
continue
```

Avoid by default:

```text
multiple DB queries
large API fan-out
heavy SDK initialization
complex report generation
large body parsing
slow analytics call awaited before next()
```

## `NextFetchEvent`

Proxy can receive a second argument:

```ts
import type { NextFetchEvent, NextRequest } from 'next/server'

export function proxy(
  request: NextRequest,
  event: NextFetchEvent,
) {
  // ...
}
```

## `waitUntil()`

`NextFetchEvent.waitUntil()` extends the Proxy lifetime until a promise settles.

```ts
export function proxy(
  request: NextRequest,
  event: NextFetchEvent,
) {
  event.waitUntil(
    sendAnalytics({
      pathname: request.nextUrl.pathname,
    }),
  )

  return NextResponse.next()
}
```

The response decision does not need to await the analytics call directly.

## `waitUntil` is not a durable job queue

Do not use it for business-critical side effects such as:

```text
charge payment
send guaranteed invoice
process webhook exactly once
generate long report
sync critical customer data
```

Use durable queues/outbox/workflows for work that must survive crashes, retries, or deployment termination.

## Good `waitUntil` candidates

```text
best-effort analytics
telemetry export
non-critical logging
cache warming where loss is acceptable
```

Even then, bound timeouts and handle rejection.

## Do not await optional telemetry

Bad:

```ts
await analytics.track(...)
return NextResponse.next()
```

This adds analytics latency to every matched request.

Better, when loss is acceptable:

```ts
event.waitUntil(analytics.track(...))
return NextResponse.next()
```

## External lookup strategy

If Proxy needs remote configuration, evaluate:

```text
latency
availability
regional placement
connection reuse
timeout behavior
fallback behavior
cache strategy
```

A front-door dependency becomes an application-wide dependency.

## Timeouts

Every network call from Proxy should have a bounded failure mode.

Conceptually:

```text
request
→ policy lookup
→ timeout quickly
→ safe fallback
```

Decide whether failure should:

```text
fail open
fail closed
redirect
return 503
continue with default policy
```

The correct choice depends on the risk.

## Body buffering

When Proxy reads the request body, Next.js may need to buffer/clone it so downstream code can read it too.

This consumes memory proportional to request size and concurrency.

Do not make global Proxy inspect upload bodies without a strong reason.

## Experimental `proxyClientMaxBodySize`

The current experimental config controls Proxy body buffering and has a documented default limit.

Because it is experimental, do not build a stable public architecture around its exact semantics.

Large-upload handling belongs at the endpoint/storage architecture level.

## Reverse proxy/CDN responsibilities

When self-hosting, infrastructure in front of Next.js is better suited to some classes of work:

```text
malformed-request rejection
connection limits
payload limits
DDoS filtering
global rate limiting
TLS termination
```

Do not reimplement every infrastructure concern in application Proxy code.

## Static export

Proxy requires an incoming server request boundary and is not supported by static export deployments.

If a product requires Proxy behavior, the deployment needs a compatible server/adapter platform.

## Platform-specific behavior

Adapters and managed platforms may change where Proxy executes and which infrastructure surrounds it.

Separate:

```text
Next.js Proxy API contract
from
platform routing/CDN implementation
```

Do not present one host's deployment details as framework semantics.

## Observability

Measure Proxy independently from route latency.

Useful metrics:

```text
invocation count
matcher distribution
p50/p95/p99 latency
redirect rate
rewrite rate
direct-response rate
auth-gate rejection rate
remote dependency latency
error rate
```

## Cost attribution

When Proxy cost grows, classify traffic:

```text
human page requests
prefetches
API requests
bots
assets
health checks
webhooks
```

Often the fix is matcher narrowing rather than micro-optimizing JavaScript.

## Failure mode: remote auth outage

If Proxy depends on a remote identity service for every request, that service outage can effectively become a full-site outage.

A signed local session check can reduce this coupling for optimistic routing.

Authoritative checks still happen where required.

## Failure mode: connection storm

Creating fresh DB/service clients inside broad Proxy execution can exhaust connections.

Prefer architectures designed for the deployment/runtime and avoid DB access in global Proxy when possible.

## Failure mode: logging amplification

Logging every static/prefetch request can produce huge log volume.

Filter by matcher and log only useful dimensions.

## Performance review checklist

1. How many requests invoke Proxy per page view?
2. Which matchers can be narrowed?
3. Which work is CPU-only vs network-bound?
4. Which dependency is on the critical path?
5. Are timeouts explicit?
6. Is failure behavior defined?
7. Could telemetry move to `waitUntil`?
8. Is any durable work incorrectly using `waitUntil`?
9. Are bodies read unnecessarily?
10. Are deployment/global-state assumptions valid?

## Interview questions

**What is `waitUntil` for?**  
Extending Proxy execution for best-effort asynchronous work without awaiting it before the routing response is returned.

**Is `waitUntil` a job queue?**  
No. Critical durable work needs durable infrastructure.

**What is often the best Proxy optimization?**  
Narrowing matcher coverage and removing network work from the front-door critical path.

## Exercise

A Proxy currently performs:

```text
DB session lookup
feature-flag API call
analytics POST
country API lookup
```

for every request.

Redesign it so that:

- auth gating remains useful
- localization still works
- analytics does not block
- static assets/prefetches avoid unnecessary work
- authoritative permissions remain downstream
- dependency outages have explicit fallbacks

Estimate which calls remain on the critical path.