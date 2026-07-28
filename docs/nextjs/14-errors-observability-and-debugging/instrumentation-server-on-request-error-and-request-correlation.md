---
title: Server Instrumentation, onRequestError & Request Correlation
description: Use instrumentation.ts, register, onRequestError, runtime-aware setup, request IDs, and structured logging to diagnose server failures in production.
---

# Server Instrumentation, `onRequestError` & Request Correlation

Production debugging requires telemetry from the server **before** errors are reduced to safe client fallbacks.

Next.js provides the `instrumentation.ts|js` file convention for this purpose.

Place it at the project root or inside `src` when the application uses a `src` directory.

## 1. `register()` initializes observability once per server instance

```ts
// instrumentation.ts
export async function register() {
  await initializeMonitoring()
}
```

Next.js calls `register()` when a new server instance starts and waits for it to finish before the instance begins serving requests.

Use it for setup such as:

```text
OpenTelemetry SDK initialization
error-reporting SDK initialization
structured logger setup
runtime-specific instrumentation
```

Do not put request-specific logic there.

## 2. Server instance is not application lifetime

In distributed deployment:

```text
instance A starts → register()
instance B starts → register()
instance C starts → register()
```

Do not assume `register()` runs exactly once for the entire deployment.

Avoid global initialization that is unsafe when repeated across processes or regions.

## 3. Runtime-specific instrumentation

The instrumentation convention works with Node.js and Edge runtime contexts.

Next.js exposes:

```ts
process.env.NEXT_RUNTIME
```

for runtime-specific setup.

Example:

```ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation.node')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./instrumentation.edge')
  }
}
```

This is especially important because many Node observability SDKs cannot run in Edge environments.

## 4. `onRequestError` is the central server error hook

Next.js allows an optional `onRequestError` export:

```ts
import type { Instrumentation } from 'next'

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context,
) => {
  await reportServerError({
    error,
    request,
    context,
  })
}
```

It runs when the Next.js server captures request-related errors.

## 5. Await asynchronous reporting work

If reporting is asynchronous, await it inside `onRequestError`.

```ts
export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context,
) => {
  await monitor.capture(error, {
    path: request.path,
    method: request.method,
    routeType: context.routeType,
  })
}
```

Unawaited work can be lost if the invocation ends immediately afterward.

## 6. The reported error may be processed by React

For errors originating during Server Component rendering, the error object captured by Next.js may not be the original thrown instance.

The `digest` can help correlate failure identity.

Do not rely on custom prototype identity surviving every rendering boundary.

Prefer stable fields:

```text
name
message on server
stack on server
digest
request metadata
route context
```

## 7. `request` contains read-only request context

The hook receives request information including:

```text
path
method
headers
```

This is powerful and dangerous.

Do not blindly serialize all headers into logs.

Potential secrets include:

```text
Authorization
Cookie
API tokens
session values
internal forwarding metadata
```

Use an allow-list.

## 8. `context.routeType` tells you the execution surface

Current Next.js context can classify errors from:

```text
render
route
action
proxy
```

That means one server error pipeline can distinguish:

```text
Server Component render
Route Handler
Server Action
Proxy
```

This is much more useful than one giant generic "500" bucket.

## 9. Route path and resource path are different

Example:

```text
request.path
→ /products/abc?tab=details

context.routePath
→ /app/products/[id]
```

The route template is excellent for aggregation because it avoids high-cardinality IDs.

The concrete path is useful for incident debugging, but may contain sensitive query values.

Store only what your privacy and operational policies allow.

## 10. Rendering context helps classify failures

Current instrumentation context can expose rendering-related fields such as:

```text
renderSource
renderType
revalidateReason
```

These can help answer:

```text
Was this normal server rendering?
Was it an RSC payload request?
Was this a revalidation failure?
Was this a resumed/dynamic render path?
```

Do not turn every field into an alert dimension. High-cardinality dashboards become expensive and noisy.

## 11. Request correlation needs a deliberate ID

A useful production request flow:

```text
incoming request
      ↓
request ID assigned or trusted from infrastructure
      ↓
server logs include request ID
      ↓
dependency calls propagate trace/request context
      ↓
client-safe error response may expose reference ID
      ↓
support can find matching telemetry
```

The ID should not contain secrets or user data.

## 12. Generated vs forwarded request IDs

If an upstream proxy generates a request ID and overwrites that header, you can trust it according to your infrastructure contract.

If public clients can send the same header unchanged, do not treat it as authoritative.

A simple policy:

```text
trusted gateway header present
→ accept according to infrastructure contract

otherwise
→ generate server-side ID
```

## 13. Structured logs beat message-only logs

Weak:

```text
Something went wrong
```

Better:

```json
{
  "level": "error",
  "event": "request_error",
  "requestId": "req_123",
  "routePath": "/app/products/[id]",
  "routeType": "render",
  "method": "GET",
  "errorName": "UpstreamTimeout",
  "digest": "..."
}
```

Structure enables filtering, aggregation, and correlation.

## 14. Do not log raw request bodies by default

Bodies can contain:

```text
credentials
personal data
form contents
uploaded data
access tokens
private messages
```

Use explicit safe fields or event-specific schemas.

## 15. Error fingerprinting should avoid unstable text

Grouping by full error message can create huge cardinality if IDs appear in the text.

Example:

```text
"Project 123 missing"
"Project 124 missing"
```

Better grouping inputs may include:

```text
error class
stable code
digest
route template
operation name
stack fingerprint from provider
```

## 16. Logging and tracing are different signals

A log says:

```text
something happened
```

A trace says:

```text
this request moved through these operations with these timings
```

An error event says:

```text
this failure needs investigation or grouping
```

Use each for its strengths.

## 17. Prevent duplicate reporting

A single server exception can appear through:

```text
manual catch logger
onRequestError
OpenTelemetry span error
provider automatic integration
client error boundary
```

Without deduplication, one incident looks like five failures.

Decide which layer owns the canonical exception event.

## 18. Logging from `error.tsx` is not enough

The client fallback may only have a sanitized Server Component error.

`onRequestError` runs on the server where richer context is available.

Use:

```text
server instrumentation
→ canonical server exception telemetry

error.tsx
→ user recovery and optional client breadcrumb
```

## 19. Redact before export

Redaction should happen before data leaves the application boundary.

Common fields to remove or transform:

```text
Authorization
Cookie
Set-Cookie
password
secret
token
full email when unnecessary
query strings with sensitive values
```

A provider-side filter is useful, but application-side minimization is stronger defense in depth.

## 20. Error reporting should not create recursive failure

If the monitoring provider is down:

```text
application error
→ report error
→ monitoring request fails
→ reporting error logs another error
→ loop
```

Telemetry paths must fail safely.

Use bounded timeouts and avoid recursively reporting reporter failures through the same pipeline.

## 21. Server observability has a latency budget

`onRequestError` work is awaited when asynchronous.

That means expensive reporting can extend failure-path latency.

Keep critical capture small and reliable.

Batching/export strategy belongs to the telemetry SDK and deployment architecture.

## 22. Security events are not ordinary app logs

Examples:

```text
repeated signature failures
permission-denied spike
suspicious session reuse
rate-limit escalation
```

These may need a dedicated security event stream and retention policy.

Do not dump sensitive evidence into general logs.

## 23. Route context supports error budgets

Because errors can be grouped by route template and surface, you can build useful service indicators:

```text
/api/search Route Handler error rate
/dashboard render error rate
Server Action failure rate for saveProfile
Proxy failure rate
```

Expected `4xx` business outcomes should be separated from unexpected exceptions.

## 24. Runtime instance metadata can help incidents

Depending on platform, useful fields may include:

```text
deployment ID
region
instance/runtime identifier
build/version SHA
service name
```

Label platform-specific fields clearly.

Do not teach provider metadata as a Next.js core guarantee.

## 25. A minimal production pattern

```ts
// instrumentation.ts
import type { Instrumentation } from 'next'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./observability/node')
  }
}

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context,
) => {
  await captureException({
    name: error.name,
    message: error.message,
    stack: error.stack,
    digest: error.digest,
    method: request.method,
    routePath: context.routePath,
    routeType: context.routeType,
    renderSource: context.renderSource,
  })
}
```

The real implementation should add redaction, request correlation, timeouts, and provider integration.

## Debugging checklist

When server telemetry looks incomplete:

1. Is `instrumentation.ts` in the root or `src` root?
2. Did `register()` run for the current runtime?
3. Is the SDK compatible with Node/Edge?
4. Is `onRequestError` exported with the right type?
5. Are async exporter calls awaited?
6. Is the provider dropping or sampling events?
7. Are framework control-flow outcomes being filtered correctly?
8. Are request IDs propagated across services?
9. Are logs duplicated by automatic + manual capture?
10. Is redaction removing the fields you expected to search?

## Senior interview questions

**When does `register()` run?**  
Once when a new Next.js server instance initializes, before it starts handling requests. In distributed infrastructure, multiple instances mean multiple executions.

**Why is `routePath` useful for metrics?**  
It represents the route template rather than a concrete high-cardinality URL, making aggregation much more stable.

**Why should you not log all request headers from `onRequestError`?**  
Headers commonly contain credentials, cookies, internal trust metadata, and personal information. Observability must use allow-lists and redaction.

## Exercise

Define a structured error-event schema for an App Router SaaS that has Server Components, Server Actions, Route Handlers, and Proxy. Include correlation, route grouping, runtime/deployment metadata, error identity, privacy rules, and deduplication strategy.
