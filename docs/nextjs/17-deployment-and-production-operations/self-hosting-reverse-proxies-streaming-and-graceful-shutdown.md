---
title: Self-Hosting, Reverse Proxies, Streaming & Graceful Shutdown
sidebar_position: 3
description: Operate next start safely behind proxies and load balancers with correct streaming, request limits, trusted forwarding, graceful draining, and lifecycle handling.
---

# Self-Hosting, Reverse Proxies, Streaming & Graceful Shutdown

A self-hosted Next.js server should normally sit behind infrastructure designed to protect and route traffic.

```text
Internet
  ↓
CDN / WAF
  ↓
load balancer
  ↓
reverse proxy
  ↓
Next.js server
```

The exact layers vary, but the responsibilities still exist.

## 1. Why a reverse proxy belongs in front

Current Next.js self-hosting guidance recommends a reverse proxy rather than exposing `next start` directly to the public internet.

A front proxy can own concerns such as:

- malformed request rejection
- slow-client protection
- request/body limits
- rate limiting
- TLS termination
- compression
- connection reuse
- routing to healthy replicas
- maintenance responses
- selected security headers

This lets Next.js focus on application work.

## 2. Do not duplicate policy accidentally

If rate limiting exists in:

```text
CDN
+ load balancer
+ reverse proxy
+ application
```

that can be correct—but only if each layer has an explicit purpose.

Uncoordinated limits produce confusing failures.

Document:

```text
which layer owns IP abuse?
which layer owns account abuse?
which layer owns body size?
which layer owns tenant quota?
which layer returns Retry-After?
```

## 3. Trust forwarded headers deliberately

Behind proxies you may receive headers such as:

```text
X-Forwarded-For
X-Forwarded-Proto
X-Forwarded-Host
Forwarded
```

These are meaningful only if untrusted clients cannot spoof the trusted hop.

The security model is:

```text
client input
→ trusted proxy overwrites/appends according to policy
→ application consumes only known-good forwarding chain
```

Never assume a forwarded header is trustworthy solely because it exists.

## 4. Host/protocol correctness

Incorrect proxy configuration can break:

- canonical URLs
- redirects
- OAuth callbacks
- secure-cookie assumptions
- Server Action origin/host validation
- absolute links

Preserve the intended external host/protocol contract through the proxy chain.

## 5. Streaming must survive every layer

App Router streaming works with self-hosted Next.js, but upstream buffering can erase the benefit.

```text
Suspense produces chunk 1
Next.js flushes chunk 1
proxy buffers
CDN buffers
user receives nothing until chunk N
```

The route technically streamed; the user did not experience streaming.

## 6. nginx buffering example

Current official guidance documents disabling nginx buffering for streamed responses, including via:

```http
X-Accel-Buffering: no
```

A Next.js header configuration can emit that header where appropriate:

```js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*{/}?',
        headers: [
          { key: 'X-Accel-Buffering', value: 'no' },
        ],
      },
    ]
  },
}
```

Whether your infrastructure honours that mechanism depends on the proxy/load-balancer configuration.

Validate the real deployed path.

## 7. PPR makes streaming capability operationally important

Partial prerendering depends on delivering a static shell and request-time holes progressively.

If infrastructure buffers until render completion:

```text
static shell ready early
+ dynamic hole ready later
→ both delivered together
```

The application may remain functionally correct but lose the latency benefit that motivated the architecture.

## 8. Compression and streaming

Compression middleware/proxies can buffer data to produce larger compressed blocks.

Measure:

- time to first byte
- first streamed chunk
- final completion

Do not assume compression configuration is neutral to streaming latency.

## 9. Timeouts across layers

Typical layers may all have timeout settings:

```text
browser/client
CDN
load balancer
reverse proxy
Next.js/runtime
upstream API
DB
```

The effective timeout is the first one that expires.

Design a deadline hierarchy so requests fail intentionally rather than at an arbitrary infrastructure boundary.

## 10. Long requests

Avoid turning request handlers into background-job runners.

Examples:

- large exports
- video processing
- bulk email
- AI batch jobs
- large archive generation

A request should generally enqueue durable work and return a job/status contract when completion can exceed normal request lifetime.

## 11. Request body limits

Large bodies consume:

- network bandwidth
- proxy buffers
- server memory
- parsing CPU
- storage

Limit size at the earliest appropriate trusted layer and validate again at application boundaries where domain rules matter.

Direct object-storage uploads can remove large media from the application request path.

## 12. Graceful shutdown

Current Next.js self-hosting guidance states that `next start` supports graceful shutdown when receiving `SIGINT` or `SIGTERM`.

The server can finish:

- in-flight requests
- pending `after()` callbacks

before exiting.

Your orchestration platform must allow time for that drain to happen.

## 13. Drain sequence

A safe conceptual sequence:

```text
new deployment / scale down
  ↓
mark instance not ready
  ↓
stop sending new traffic
  ↓
SIGTERM
  ↓
finish in-flight requests
  ↓
finish pending after() work
  ↓
exit before hard-kill deadline
```

Ordering matters.

If the orchestrator sends traffic until the process disappears, users see connection resets.

## 14. Shutdown grace period

Current official self-hosting guidance recommends allowing a configurable drain period, with roughly 10–30 seconds suggested for pending requests/`after()` work.

That is a starting point—not a universal SLO.

Measure:

- normal request tail latency
- longest legitimate streaming response
- expected `after()` duration
- platform hard-kill limit

## 15. `after()` is not durable background infrastructure

Graceful shutdown support makes `after()` useful for response-lifecycle work such as:

- analytics
- logging
- non-critical follow-up

But it does not transform a web process into a durable job system.

If work must survive:

- process crash
- node loss
- deployment
- retry
- long execution

use durable queue/job infrastructure.

## 16. Readiness before shutdown

Kubernetes-style systems distinguish:

```text
liveness → should this process be restarted?
readiness → should this instance receive traffic now?
```

During planned shutdown, readiness should become false before the process exits.

Do not intentionally fail liveness just to drain traffic; that can trigger aggressive restart behaviour.

## 17. Connection draining

A load balancer may maintain:

- HTTP keep-alive connections
- HTTP/2 streams
- WebSocket-like connections in external services

Understand how deregistration affects established connections.

The server's process signal handling cannot compensate for an upstream load balancer that immediately resets them.

## 18. Rolling restart under streaming traffic

Test a real scenario:

```text
user starts streamed page
replica gets SIGTERM
new replica becomes ready
```

Expected:

- existing request completes on draining replica
- new navigation reaches healthy replica
- no chunk references disappear
- deployment/version identifiers remain coherent

## 19. Reverse proxy caching

Do not cache every response at nginx/CDN level.

Dynamic personalized output should remain private/non-cacheable.

Respect Next.js response semantics and vary/cache keys correctly for public cached responses.

A reverse proxy cache that ignores RSC/navigation variants can serve mismatched content.

## 20. Static assets at the proxy/CDN

Hashed immutable assets are strong CDN candidates.

Typical path:

```text
/_next/static/...
```

Use long-lived immutable caching for content-addressed assets, while preserving deploy availability during rolling releases.

Do not delete old assets immediately if active clients may still request them.

## 21. Observability at each hop

Correlate:

```text
CDN request id
load balancer status
proxy upstream time
Next.js request/trace id
DB/upstream spans
release/deployment id
```

Otherwise a 504 at the edge can be difficult to distinguish from an application 500.

## 22. Common failure signatures

### Everything waits, then page appears at once

Likely streaming buffering.

### 502/connection reset during deploy

Likely traffic draining/shutdown timing.

### Redirects use internal host or HTTP

Forwarded host/protocol trust/config problem.

### Large uploads crash pods

Body buffering/memory/storage architecture issue.

### Requests fail at exactly 30/60 seconds

Investigate upstream/proxy/load-balancer timeout boundary.

## Production checklist

- [ ] reverse proxy/load balancer responsibilities documented
- [ ] forwarded-header trust boundary explicit
- [ ] external host/protocol preserved
- [ ] body/time/rate limits assigned to layers
- [ ] streaming tested through full production path
- [ ] buffering disabled where streaming/PPR requires it
- [ ] timeouts form an intentional hierarchy
- [ ] shutdown removes instance from traffic before exit
- [ ] SIGTERM/SIGINT drain is exercised
- [ ] hard-kill deadline exceeds normal drain requirements
- [ ] durable jobs are not hidden inside request/`after()` work
- [ ] proxy/CDN cache rules preserve Next.js response variants

## Interview questions

### Why can Suspense work locally but not appear to stream in production?

Because a reverse proxy, load balancer, CDN, compression layer, or platform adapter may buffer the response even though Next.js emits chunks progressively.

### Why mark an instance unready before sending SIGTERM?

So new requests stop arriving while existing requests are allowed to drain, reducing dropped requests during rolling deploys and scale-down.

## Exercise

Draw a production request path with CDN, load balancer, nginx, Next.js and database. For each layer define:

1. timeout
2. body limit
3. retry policy
4. cache policy
5. request ID
6. health responsibility
7. streaming/buffering behaviour
8. shutdown/draining behaviour
