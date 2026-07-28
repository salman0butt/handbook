---
title: Client Instrumentation, Browser Errors & Navigation Telemetry
description: Use instrumentation-client.ts, browser error channels, router-transition hooks, and safe client telemetry without inflating startup cost.
---

# Client Instrumentation, Browser Errors & Navigation Telemetry

Server observability cannot explain every browser failure.

Client-side problems include:

```text
hydration mismatch
render crash after interaction
unhandled promise rejection
third-party script error
resource load failure
slow navigation
browser-only API failure
extension/DOM interference
```

Next.js provides `instrumentation-client.ts|js` for code that must initialize **before the application becomes interactive**.

## 1. File placement

Place the file at the project root or inside `src` when the application uses a `src` directory.

```text
my-app/
  instrumentation-client.ts
  app/
```

or:

```text
my-app/
  src/
    instrumentation-client.ts
    app/
```

## 2. No required setup export

Unlike server instrumentation, client instrumentation does not require a `register()` function.

Top-level code runs when the file loads:

```ts
performance.mark('app-observability-start')
initializeBrowserMonitor()
```

This makes it suitable for very early monitoring initialization.

## 3. Execution timing matters

Current Next.js documentation describes the sequence as:

```text
HTML document loaded
      ↓
instrumentation-client executes
      ↓
React hydration begins
      ↓
user interaction becomes available
```

This allows monitoring to capture errors and timing around the earliest client lifecycle.

## 4. Keep startup code lightweight

Every byte and millisecond in early client instrumentation competes with app startup.

Do not initialize a huge analytics suite synchronously simply because the file runs early.

Good principles:

```text
small bootstrap
minimal synchronous work
lazy optional modules
bounded initialization
no blocking network dependency for hydration
```

Next.js warns in development when initialization takes long enough to threaten smooth startup.

## 5. Capture global browser errors deliberately

Example:

```ts
window.addEventListener('error', (event) => {
  reportBrowserError({
    type: 'window-error',
    message: event.message,
    filename: event.filename,
    line: event.lineno,
    column: event.colno,
  })
})
```

But understand what this listener does and does not capture.

## 6. Capture unhandled promise rejection separately

```ts
window.addEventListener('unhandledrejection', (event) => {
  reportBrowserError({
    type: 'unhandled-rejection',
    reason: normalizeReason(event.reason),
  })
})
```

Promise rejection and synchronous window errors are different channels.

## 7. Do not serialize arbitrary rejection values

JavaScript permits:

```ts
Promise.reject('failed')
Promise.reject({ secret: '...' })
```

Normalize client errors through a safe schema.

```ts
function normalizeReason(reason: unknown) {
  if (reason instanceof Error) {
    return {
      name: reason.name,
      message: reason.message,
      stack: reason.stack,
    }
  }

  return { name: 'UnknownRejection' }
}
```

Avoid dumping arbitrary objects from the browser into telemetry.

## 8. Router transition telemetry

`instrumentation-client.ts` can export `onRouterTransitionStart`.

```ts
export function onRouterTransitionStart(
  url: string,
  navigationType: 'push' | 'replace' | 'traverse',
) {
  performance.mark(`nav-start:${url}`)
}
```

This hook runs when a client navigation starts.

Useful dimensions include:

```text
destination route
navigation type
start timestamp
current build/deployment
session-safe correlation ID
```

## 9. Navigation start is not navigation success

A start hook alone does not tell you:

```text
when content became usable
whether dynamic data streamed later
whether a render failed
whether the user abandoned the transition
```

Treat it as a breadcrumb/timing start, not a complete navigation metric.

## 10. Soft and hard navigation need different baselines

Hard navigation:

```text
browser document request
HTML
scripts
hydration
```

Soft navigation:

```text
App Router transition
RSC/navigation payload
route reconciliation
streaming
selective client work
```

Do not compare them as if they are identical workloads.

## 11. Route names reduce cardinality

Sending a full URL such as:

```text
/projects/928347?query=private-text
```

creates both privacy and cardinality problems.

Prefer a normalized route identity when available:

```text
/projects/[id]
```

and explicitly allow only safe query dimensions.

## 12. Client error reporting should include build identity

A browser can execute an older deployment while the server has already rolled forward.

Include a safe release identifier:

```text
build SHA
deployment ID
application version
```

This helps identify version-skew failures.

## 13. Source-map strategy affects client diagnostics

Minified production stacks are hard to use without source maps.

Possible architecture:

```text
production build
→ generate maps
→ upload maps privately to monitoring provider
→ do not necessarily serve public maps
```

Next.js `productionBrowserSourceMaps: true` makes maps available alongside browser bundles and served by Next.js, so use it only when that exposure is intentional.

## 14. Error boundaries and global listeners are complementary

`error.tsx` knows about rendered fallback state.

Global browser monitoring knows about broader browser failures.

Use both without duplicate event creation.

A common pattern:

```text
window/global SDK
→ canonical browser exception capture

error.tsx
→ add route/fallback breadcrumb or recovery event
```

## 15. Event-handler failures need explicit capture

If an event handler catches a failure and renders local state, that failure is no longer unhandled.

If operations teams need visibility, record it deliberately:

```ts
try {
  await saveDraft()
} catch (error) {
  setStatus('failed')
  reportExpectedClientFailure('draft_save_failed')
}
```

Do not label every expected UI failure as an uncaught exception.

## 16. Third-party scripts are separate failure domains

Browser monitoring may see errors from:

```text
analytics SDK
tag manager
chat widget
map SDK
embedded editor
browser extension
```

Tag events with source/vendor ownership when reliably known.

Do not let noisy third-party exceptions dominate first-party error budgets.

## 17. Cross-origin script errors may lose detail

Browser security rules can reduce error information from cross-origin scripts depending on resource/CORS configuration.

Do not assume `window.onerror` always has a full useful stack for third-party code.

## 18. Hydration diagnostics need server context

A hydration mismatch report should record safe context such as:

```text
route
build version
browser
locale
timezone category if needed
server render correlation if available
```

Then inspect likely divergence sources rather than treating it as a generic client crash.

## 19. Console capture needs restraint

Automatically shipping every `console.log` can expose:

```text
user data
URL parameters
debug tokens
internal objects
large payloads
```

Prefer structured instrumentation over wholesale console forwarding in production.

Development browser-log forwarding is a debugging convenience, not a production observability architecture.

## 20. Network telemetry needs privacy rules

A client monitor may observe failed requests.

Do not automatically capture:

```text
full request body
Authorization header
cookies
private query strings
response body
```

A safe record can include:

```text
normalized endpoint
method
status
latency
failure category
request ID
```

## 21. PerformanceObserver can enrich client telemetry

Browser APIs such as `PerformanceObserver` can help capture navigation and resource timing.

Keep detailed performance work for Phase 15, but the observability architecture should already provide a place to send metrics.

## 22. `useReportWebVitals` is a framework reporting hook

Next.js also exposes `useReportWebVitals` for Web Vitals reporting.

Phase 15 owns metric interpretation and optimization depth.

Phase 14's responsibility is the pipeline:

```text
browser metric
→ safe event schema
→ transport
→ observability backend
→ release/route correlation
```

## 23. Sampling is often necessary

High-volume client signals can become expensive.

Potential policy:

```text
uncaught exception → high capture rate
expected recoverable client failure → lower/sample rate
performance trace → sample
navigation breadcrumb → attach to error session rather than export every event
```

Never sample in a way that hides critical security or reliability signals without understanding the consequence.

## 24. Session replay has a different privacy risk

If a monitoring vendor offers session replay, treat it separately from ordinary error reporting.

Review:

```text
input masking
DOM text capture
network capture
consent requirements
retention
access controls
data residency
```

Do not enable replay simply because the SDK supports it.

## 25. Transport failure must not break the app

Monitoring is secondary to product functionality.

If telemetry upload fails:

```text
app should continue
monitor should fail quietly/bounded
no recursive error loop
```

## 26. Navigation breadcrumbs help reproduce incidents

A useful error event can include a short bounded breadcrumb list:

```text
opened /projects
navigated push → /projects/[id]
clicked editor tab
API request returned 503
render fallback displayed
```

Avoid full user-entered values.

## 27. Client and server timestamps need care

Browser clocks can be wrong.

For cross-system correlation:

```text
request/trace IDs
server timestamps
relative browser performance timings
```

are often more reliable than comparing absolute client time alone.

## 28. A minimal client bootstrap

```ts
// instrumentation-client.ts
import { browserMonitor } from './lib/browser-monitor'

try {
  browserMonitor.init()
} catch {
  // Monitoring failure must not block hydration.
}

window.addEventListener('error', (event) => {
  browserMonitor.captureWindowError(event)
})

window.addEventListener('unhandledrejection', (event) => {
  browserMonitor.captureUnhandledRejection(event.reason)
})

export function onRouterTransitionStart(
  url: string,
  navigationType: 'push' | 'replace' | 'traverse',
) {
  browserMonitor.navigationStarted({ url, navigationType })
}
```

The production implementation should include redaction, sampling, release identity, and timeout/error isolation.

## Debugging checklist

If browser telemetry misses an issue:

1. Did `instrumentation-client.ts` load?
2. Did the monitoring SDK initialize before hydration?
3. Was initialization too heavy or blocked?
4. Was the failure actually handled locally?
5. Was it a promise rejection rather than a synchronous error?
6. Is the stack minified without usable source maps?
7. Is the error cross-origin and detail-limited?
8. Was the event sampled or filtered?
9. Is the user on an older build?
10. Did transport/ad-blocking prevent upload?

## Senior interview questions

**When does `instrumentation-client.ts` execute?**  
After the HTML document loads but before React hydration and normal application interactivity begin.

**What does `onRouterTransitionStart` tell you?**  
It identifies the beginning of an App Router client transition and its navigation type. It does not by itself measure completion or user-perceived readiness.

**Why not ship every console line to production monitoring?**  
It creates privacy, volume, noise, and cardinality risks and often captures unstructured data that is harder to use than deliberate events.

## Exercise

Design a browser error event and navigation breadcrumb schema for an editor application. Cover hydration errors, route transitions, failed API requests, third-party script noise, release identity, source maps, sampling, and redaction.
