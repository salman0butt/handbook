---
title: Request Lifecycle, Routing, Proxy, Rendering, Streaming & Response Assembly
sidebar_position: 7
description: Trace an App Router request from reverse proxy through Next.js routing and Proxy into Route Handlers or RSC rendering, then through streaming, cache, headers, errors, and browser delivery.
---

# Request Lifecycle, Routing, Proxy, Rendering, Streaming & Response Assembly

When a production Next.js request is slow or incorrect, “the page render” is often too vague a unit of reasoning.

A request can cross several owners:

```text
browser
→ CDN / load balancer / reverse proxy
→ Next.js server
→ config redirects/headers
→ Proxy
→ route matcher
→ Route Handler or render pipeline
→ caches/data/services
→ React render
→ stream/response assembly
→ proxy/CDN
→ browser
```

Senior debugging follows the request through that chain.

## 1. Infrastructure receives the request before Next.js

Depending on deployment, infrastructure may already have handled:

```text
TLS
DNS
WAF
rate limiting
body limits
CDN cache
redirects
compression
regional routing
```

If a request never reaches Next.js, changing application code cannot fix it.

First establish where the request terminated.

## 2. Reverse-proxy behavior can change framework behavior

A proxy can alter:

```text
Host
X-Forwarded-Host
X-Forwarded-Proto
cookies
path
query string
request body
stream buffering
response headers
```

Next.js may rely on externally visible host/protocol information for redirects, Action CSRF checks, canonical URL behavior, and routing.

Trust forwarded headers only from trusted infrastructure.

## 3. Next.js applies routing stages in a defined order

Current Proxy documentation exposes the high-level order:

```text
1. next.config headers
2. next.config redirects
3. Proxy
4. beforeFiles rewrites
5. filesystem routes/assets
6. afterFiles rewrites
7. dynamic routes
8. fallback rewrites
```

This order is application-facing enough to reason about route ownership.

Do not assume Proxy is literally the first thing executed for every incoming request.

## 4. Config redirects can terminate before route rendering

A configured redirect can resolve the request before the App Router render path.

If a page component never logs/runs, inspect earlier routing stages.

Useful debugging question:

```text
Did the request reach route matching at all?
```

## 5. Proxy is a front-door network boundary

`proxy.ts` runs before matched application routes render.

It can:

```text
redirect
rewrite
modify request headers
set response headers/cookies
respond directly
continue upstream
```

It should remain narrow because it can affect broad request traffic.

## 6. Proxy is not Express middleware chaining

There is one Proxy function for the app, not an arbitrary chain of route middleware modules.

Build composable helpers internally if needed, but preserve the mental model:

```text
one framework network interception boundary
```

## 7. Proxy matchers are compile-time routing policy

Matcher values must be statically analyzable constants.

The framework can therefore determine which paths should invoke Proxy without executing arbitrary configuration code at request time.

Use precise matchers to avoid paying Proxy cost on unrelated assets/routes.

## 8. Proxy runs on Node.js in current Next.js 16

Current `proxy.ts` uses the Node.js runtime and does not support a `runtime` export.

This is a current-version contract.

Older Middleware/Edge mental models should not be silently carried forward.

## 9. Proxy should not hold shared request state in globals

Current docs describe Proxy as potentially separated from render code and optimized for front-door deployment.

Pass information through documented mechanisms:

```text
request headers
cookies
URL
rewrite
redirect
```

Do not assume Proxy and page render share one process memory object.

## 10. Request header modification is upstream state

With `NextResponse.next({ request: { headers } })`, modified request headers become visible to upstream application code.

That is different from setting response headers visible to the browser.

Always distinguish:

```text
request mutation
vs
response mutation
```

## 11. RSC requests are specially normalized through Proxy

Next.js handles internal RSC/Flight request metadata so application Proxy logic does not accidentally treat HTML and RSC versions of the same route as different business requests.

Use documented rewrites such as:

```ts
NextResponse.rewrite(...)
```

so Next.js can preserve required routing metadata.

Avoid building a custom raw fetch proxy unless you fully own the RSC routing consequences.

## 12. Route matching happens against filesystem/build metadata

After routing/rewrite stages, Next.js resolves the request to an application route or asset.

Possible owners include:

```text
static asset
public file
App Router page tree
Route Handler
generated metadata route
not-found fallback
```

The route matcher uses build-generated understanding of the source route tree.

## 13. Page route and Route Handler cannot own the same exact segment

A route segment cannot simultaneously use both:

```text
page.tsx
and
route.ts
```

for the same route level ownership.

This prevents ambiguous HTTP/UI ownership.

## 14. Route Handlers terminate in Web Response semantics

A Route Handler receives a Web `Request`/`NextRequest` and returns `Response`/`NextResponse`.

Its lifecycle is conceptually:

```text
match route
→ parse request
→ auth/validation
→ application logic
→ construct HTTP response
```

It does not need to enter React RSC rendering unless your handler explicitly integrates React/streaming logic.

## 15. Page requests enter the React render pipeline

For a matched App Router page:

```text
resolve route tree
→ resolve params/search/request context
→ execute layouts/pages/metadata as needed
→ render Server Components
→ coordinate Suspense/cache boundaries
→ produce RSC stream
→ produce HTML for initial document request
```

The exact internal functions are private; this pipeline shape is the durable mental model.

## 16. Request type affects output representation

The same logical route can be requested as:

```text
full document navigation
client RSC navigation
prefetch
Server Function POST
```

The server may produce different transport representations while preserving the same application route semantics.

Do not infer request intent only from pathname.

## 17. Server Function POST belongs to the route where it is used

Current Proxy docs note Server Functions are not separate filesystem routes in the routing chain.

They are handled as POST requests associated with the route where the Action is used.

Consequently:

```text
Proxy matcher excludes route
→ it also excludes Action calls on that route
```

This is another reason Server Functions must authorize internally.

## 18. Cache lookup can short-circuit expensive render work

Depending on route/cache model, Next.js may satisfy parts of a response from cached output instead of recomputing everything.

But do not think of one global “render cache.”

Possible layers include:

```text
prerendered shell
Cache Components entry
server response/ISR cache
fetch/data cache
external application cache
```

The exact hit path depends on the model enabled.

## 19. Cache miss enters execution graph

On a miss:

```text
cache lookup
→ miss
→ execute underlying function/component/data access
→ render result
→ store according to policy
→ return/stream
```

Miss latency is part of request latency.

## 20. Request APIs bind work to incoming context

Calls such as:

```text
cookies()
headers()
```

read request-specific state.

Under Cache Components, such request-owned work belongs behind request-time boundaries.

These APIs are not free global variables; they depend on framework request context.

## 21. Async request context must propagate through server execution

Next.js internally maintains request/work context so APIs can determine things such as:

```text
current route
current request
current cache/render unit
revalidation state
```

You may see internal async storage concepts in source/stack traces.

Treat them as framework implementation, not application state APIs.

Use public functions such as `cookies()`, `headers()`, `after()`, and cache APIs.

## 22. React render can suspend

A Server Component may await/suspend.

React can then:

```text
hold that boundary
continue siblings
emit fallback
resume later
```

Next.js integrates this stream with its route/render response.

## 23. HTML and RSC are related but different streams

For initial document load, Next.js must produce visible HTML while also providing enough RSC information for React to reconstruct the component tree.

Think:

```text
React server render
├─ HTML-facing representation
└─ RSC-facing representation
```

They coordinate one logical render.

## 24. Response streaming requires infrastructure cooperation

Even if React/Next.js emits chunks early, a proxy can buffer them.

Observed browser timing becomes:

```text
framework chunk ready
→ proxy buffers
→ more data arrives
→ proxy flushes late
```

The app then appears non-streaming despite correct framework code.

Test streaming end to end.

## 25. Compression can interact with buffering

Compression layers may accumulate data before flushing useful chunks.

This is infrastructure-specific.

When streaming looks delayed, inspect:

```text
Next server timing
reverse proxy buffering
compression
CDN behavior
client network trace
```

## 26. Headers may need to commit before full body completion

HTTP response headers are typically established before the streamed body finishes.

This creates important behavior around late errors and status codes.

Once streaming starts, changing a response from 200 to 404/500 may no longer be possible in the normal HTTP sense.

## 27. Streamed `notFound()` can retain HTTP 200

Current App Router behavior can return a 200 status if a not-found condition occurs after streaming has begun, while still rendering not-found UI and injecting noindex behavior.

This is an HTTP streaming constraint, not simply a “wrong status bug.”

For non-streamed detection, 404 status can be returned normally.

## 28. Redirect timing also matters

A redirect discovered before response commitment can be an HTTP redirect.

A redirect discovered during streamed React output may require framework/client navigation signaling instead.

Think about **when** control flow occurs, not just which API is called.

## 29. Error boundaries split render failure domains

An uncaught render error can be captured by the nearest `error.tsx` boundary according to route tree placement.

That lets the rest of the route tree remain usable where possible.

Without a local boundary, failure escalates upward.

## 30. Production Server Component errors are sanitized before client exposure

Server logs may contain full error details.

Client response receives safe generic information plus a digest.

Request correlation should connect:

```text
browser digest
→ server trace/log
→ route/release/request
```

## 31. `after()` extends post-response lifecycle but is not a durable queue

`after()` lets work run after a response is generated within the framework/server lifecycle.

Current `next start` graceful shutdown waits for pending `after()` callbacks.

But if the process crashes or machine disappears, `after()` is not a durable job system.

Use durable queues for delivery guarantees.

## 32. Proxy `waitUntil()` is similar in lifecycle intent

Proxy can extend its execution lifetime with `waitUntil()` for non-blocking work.

Again:

```text
background relative to response
≠
durable across process/infrastructure failure
```

Do not use it for payment settlement or required webhook delivery.

## 33. Server response can be cached by infrastructure too

After Next.js returns a response:

```text
reverse proxy/CDN
→ may cache according to headers/policy
→ browser may cache assets/responses
```

A stale response may never reach Next.js on later requests.

Always inspect cache hit headers/telemetry at each layer.

## 34. Static assets bypass React rendering

Requests to hashed JS/CSS/static assets should not invoke the full React render path.

If your Proxy matcher includes every `_next/static` request unnecessarily, you are adding work to traffic that does not need application logic.

Exclude assets deliberately where policy allows.

## 35. Image Optimization is another request path

`/_next/image`-style image optimizer requests are not page renders.

They have their own source fetch, transformation, caching, and resource constraints.

Do not diagnose image latency by tracing Server Components.

## 36. Metadata image routes can execute server generation work

Open Graph image generation and metadata routes may perform their own render/data work.

They belong to route infrastructure but not necessarily the same page RSC path.

Include them in production observability if SEO/social traffic matters.

## 37. `HEAD` and `OPTIONS` may follow distinct Route Handler logic

Route Handlers support Web HTTP methods.

If `OPTIONS` is not provided, Next.js can automatically produce one based on supported methods.

Do not assume every request method reaches GET/POST logic.

## 38. Request body can normally be read once

Web Request body streams are consumable.

If code parses the body, a second consumer cannot blindly parse it again.

This matters for:

```text
webhook signature verification
logging middleware/helpers
JSON parsing
file uploads
```

Plan body ownership explicitly.

## 39. Webhook raw-body verification must happen before transformation

A provider signature often covers exact bytes.

If you parse/reserialize JSON first, the bytes can change.

Route Handler mental model:

```text
raw body
→ verify signature/timestamp
→ parse event
→ idempotency/replay check
→ enqueue/process
```

## 40. Request cancellation and upstream work are separate layers

A browser disconnect may terminate interest in a response.

That does not automatically mean every DB query or SDK request cancels.

Use supported `AbortSignal`/timeouts where dependencies allow and design resource limits independently.

## 41. Timeouts can exist at several layers

```text
browser timeout
CDN timeout
load balancer timeout
Next/platform execution timeout
HTTP client timeout
DB statement timeout
queue visibility timeout
```

The shortest relevant deadline may win.

A 30-second application timeout is meaningless behind a 10-second gateway timeout.

## 42. 431 errors can originate before React

Large cookies/request headers can exceed proxy/server limits.

If the request fails with `431 Request Header Fields Too Large`, page render code may never execute.

Inspect session/cookie/header growth and infrastructure limits.

## 43. 413 errors can originate before Action/Handler parsing

Payload-size limits can exist in:

```text
CDN
reverse proxy
Proxy body forwarding
Server Action config
Route Handler infrastructure
```

Identify the rejecting layer from logs/status headers.

## 44. A request trace should cross boundaries

Ideal correlation:

```text
edge/proxy request ID
→ Next server trace ID
→ DB/upstream spans
→ Action/route name
→ response
→ browser telemetry
```

This lets you prove where latency/failure occurred.

## 45. First-byte timing narrows the failing stage

If TTFB is high:

focus on work before first response chunk:

```text
routing/Proxy
auth
cache lookup
critical data
root render
proxy buffering
```

If TTFB is fast but content completes late:

focus on:

```text
Suspense subtree
slow dependency
stream buffering
client reconciliation
```

## 46. Hard-load vs RSC-request traces should be compared

For a bug that happens only on soft navigation, compare two traces:

```text
GET document /route
vs
RSC navigation request /route
```

Same product route, different transport path.

Differences can reveal rewrites, caches, headers, or version skew problems.

## 47. Proxy logs are not page logs

A Proxy invocation can occur without the page completing.

A page log can occur after Proxy.

Use distinct telemetry fields:

```text
layer=proxy
layer=route-handler
layer=rsc-render
layer=action
```

so duplicate route names do not hide lifecycle order.

## 48. Senior request mental model

For an initial App Router page request:

```text
1. infrastructure accepts request
2. config headers/redirects run
3. Proxy may inspect/rewrite/redirect/continue
4. rewrites/filesystem/dynamic route matching resolve destination
5. Next.js identifies page route tree
6. cache/prerender state is consulted
7. request-time Server Components execute as needed
8. React renders RSC tree and Suspense boundaries
9. Next.js produces initial HTML + RSC transport
10. body streams through infrastructure
11. browser paints HTML
12. RSC reconstructs tree
13. Client Components hydrate
```

For a soft navigation, replace document HTML with RSC route-tree update/reconciliation.

## Production checklist

- [ ] infrastructure vs application request ownership is documented
- [ ] Proxy matchers exclude irrelevant static traffic where appropriate
- [ ] Proxy uses current Node.js runtime assumptions
- [ ] business authorization does not depend on Proxy coverage
- [ ] rewrites use framework APIs that preserve RSC semantics
- [ ] request-body ownership is explicit
- [ ] timeouts are aligned across proxy/server/dependencies
- [ ] streaming is tested through real CDN/proxy chain
- [ ] `after()`/`waitUntil()` are not used as durable queues
- [ ] route/Action/render layers have distinct telemetry
- [ ] release/deployment IDs are attached to traces
- [ ] hard-load and soft-navigation traces can be compared

## Interview questions

### Where does Proxy run relative to filesystem routes?

After configured headers and redirects, before filesystem route resolution, followed by the configured rewrite stages and dynamic/fallback matching.

### Why can a streamed 404 still have HTTP 200?

Because if the response headers/body have already begun streaming, the server may no longer be able to replace the HTTP status. Next.js can still render not-found UI and apply indexing protections.

### Why can an RSC navigation fail when the full HTML page works?

Because soft navigation uses a different framework transport path involving RSC request metadata, route-tree reconciliation, caches, and client/server build compatibility. A rewrite/proxy/version issue can affect that path without breaking the initial document request.
