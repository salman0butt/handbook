---
title: Core Web Vitals, RUM, Lighthouse & Attribution
description: Measure LCP, INP, CLS, TTFB, and FCP with field data, useReportWebVitals, lab tools, segmentation, attribution, and regression analysis.
---

# Core Web Vitals, RUM, Lighthouse & Attribution

Performance decisions need trustworthy measurement.

Next.js provides `useReportWebVitals` as a framework integration point for browser performance metrics, but a production performance system needs more than logging one number to the console.

## Current Core Web Vitals model

The three Core Web Vitals are:

```text
LCP → loading
INP → responsiveness
CLS → visual stability
```

Useful good thresholds are:

```text
LCP ≤ 2.5 seconds
INP ≤ 200 milliseconds
CLS ≤ 0.1
```

Evaluate field performance at the 75th percentile rather than optimizing a single lucky page load.

## Supporting metrics still matter

Next.js can report metrics including:

```text
TTFB
FCP
LCP
FID
CLS
INP
```

FID is historical for Core Web Vitals, while INP is the current responsiveness metric. Older dashboards may still contain FID, so migration and trend interpretation may require both.

## `useReportWebVitals`

Create a narrow Client Component:

```tsx
'use client'

import { useReportWebVitals } from 'next/web-vitals'

const report = (metric: Parameters<typeof useReportWebVitals>[0] extends infer T ? never : never) => {}

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric)
  })

  return null
}
```

A simpler TypeScript pattern from the API shape:

```tsx
'use client'

import { useReportWebVitals } from 'next/web-vitals'

type ReportCallback = Parameters<typeof useReportWebVitals>[0]

const sendMetric: ReportCallback = (metric) => {
  console.log(metric)
}

export function WebVitals() {
  useReportWebVitals(sendMetric)
  return null
}
```

Then mount that small island from the root layout:

```tsx
import { WebVitals } from './web-vitals'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WebVitals />
        {children}
      </body>
    </html>
  )
}
```

The important architecture point is that the root layout does **not** need to become a broad Client Component just to report metrics.

## Keep the callback reference stable

The current Next.js API guidance warns against passing a new callback identity on every render because already-available metrics can be reported again.

Prefer:

```tsx
const sendMetric = (metric: NextWebVitalsMetric) => {
  // send
}

export function WebVitals() {
  useReportWebVitals(sendMetric)
  return null
}
```

rather than defining complex callback state inside a frequently rerendering component.

## Metric payload fields

The callback receives fields such as:

```text
id
name
value
delta
rating
navigationType
entries
```

The exact object is framework/library-defined, so type against the actual API rather than duplicating a hand-maintained interface.

## Send field data without blocking navigation

A common browser transport is:

```ts
function postMetric(metric: unknown) {
  const body = JSON.stringify(metric)

  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/vitals', body)
    return
  }

  fetch('/api/vitals', {
    method: 'POST',
    body,
    keepalive: true,
    headers: { 'content-type': 'application/json' },
  })
}
```

If you own the endpoint, validate payload size and schema. Performance telemetry is still untrusted browser input.

## Do not make telemetry expensive

Bad measurement code can become the performance problem.

Avoid:

- large analytics SDKs only for a few metrics
- synchronous storage writes on every event
- sending a request for every tiny sample
- serializing giant DOM snapshots
- attaching high-cardinality secrets
- logging full URLs with sensitive query parameters

Telemetry should be bounded, sampled where appropriate, and privacy reviewed.

## Real User Monitoring needs context

A useful RUM event can include low-cardinality context:

```text
metric name
metric value
metric id
route pattern
release/build id
browser family
coarse device class
coarse region
navigation type
experiment flag
```

Be careful with:

```text
user IDs
email
full URL
search params
free-form tenant names
high-cardinality request metadata
```

Performance observability should follow the redaction and privacy model from Phase 14.

## Route pattern beats raw pathname for aggregation

Raw paths:

```text
/orders/1001
/orders/1002
/orders/1003
```

create high cardinality.

Prefer a normalized dimension:

```text
/orders/[id]
```

Your analytics pipeline may derive this from route metadata or application context.

## Segment mobile and desktop

A site can look healthy globally while mobile users suffer.

Useful slices:

```text
mobile vs desktop
low-end vs high-end device
region
browser
route
release
logged-in vs public experience
cold vs repeat visitor
```

Use enough segmentation to reveal real problems, but avoid dimensions that make every event unique.

## LCP diagnosis

LCP measures when the largest visible content element is painted.

A useful decomposition is:

```text
TTFB
+ resource discovery delay
+ resource load duration
+ render delay
= observed LCP path
```

Common LCP causes:

- slow server response
- hero image discovered late
- incorrect image priority
- render-blocking CSS
- font dependency
- client-only rendering
- expensive hydration before visible content settles
- third-party contention

Do not assume every LCP problem is an image problem.

## Next Image and LCP

For the actual LCP image, Phase 12 covered current Next.js image APIs such as `preload`, responsive `sizes`, and correct dimensions.

Performance review should verify:

```text
correct source candidate
correct rendered size
no accidental oversized download
resource discovered early enough
not lazy-loaded when it is the critical LCP image
stable dimensions
```

Use browser tooling to identify the real LCP element before changing image configuration.

## INP diagnosis

INP reflects interaction responsiveness.

Think:

```text
input delay
+ event-handler work
+ rendering work
+ time until next paint
```

Common INP problems:

- long event handler
- synchronous filtering/sorting of large data
- giant rerender
- chart or editor work
- layout thrashing
- third-party JavaScript
- hydration/main-thread competition

Record which interaction caused poor INP. A global score without interaction context is hard to act on.

## React transitions and responsiveness

`startTransition` / `useTransition` can mark non-urgent state updates so urgent interaction feedback can remain responsive.

That is scheduling, not removal of work.

```text
expensive update still exists
but
urgent input can receive higher priority
```

If the computation itself is enormous, reduce, move, chunk, virtualize, cache, or server-render it.

## CLS diagnosis

CLS is about unexpected visual movement.

Common causes:

- images without reserved geometry
- late banners
- injected ads
- font metric changes
- client-only content appearing above existing content
- expanding third-party embeds
- animation using layout properties

Prefer stable placeholders and reserved dimensions.

## Font-induced CLS

Phase 12 covered `next/font`, fallbacks, and metric adjustment.

For performance debugging:

```text
inspect font request timing
compare fallback and final font metrics
check route preload scope
verify unnecessary weights are not loaded
```

A font can be "optimized" at build time and still be overused architecturally.

## TTFB is an important diagnostic metric

TTFB can be affected by:

```text
network distance
CDN/cache behavior
server cold start
request-time authentication
uncached data reads
slow upstream APIs
database contention
render startup
```

Improving frontend assets cannot fix a backend-dominated TTFB.

## FCP is useful supporting evidence

FCP indicates when the browser paints the first DOM content.

It helps answer:

```text
did anything useful appear early?
```

But a fast FCP with a very late LCP can mean the user sees only a header/skeleton for too long.

## Lighthouse is a lab tool

The Next.js production checklist recommends Lighthouse as a simulated measurement paired with field data.

Run against a production build, preferably in a clean browser context.

Use it to inspect:

- loading timeline
- main-thread work
- unused JS
- image opportunities
- render blocking
- accessibility side effects

Do not compare two random Lighthouse runs and call a 2-point change a regression.

## Stable synthetic testing

To make lab tests meaningful:

```text
same route
same build mode
same device profile
same network profile
same cache policy
multiple runs
median or distribution
```

Record environmental changes when comparing results.

## Experimental Web Vitals attribution

Current Next.js docs expose:

```ts
experimental: {
  webVitalsAttribution: ['CLS', 'LCP'],
}
```

This can add attribution detail for diagnosis.

At the current 16.2.12 baseline it remains **experimental** and should not become a mandatory production architecture dependency.

Use it as a diagnostic option with stability expectations appropriate to an experimental API.

## Browser Performance APIs

For deeper investigations, browser APIs can help inspect:

```text
PerformanceNavigationTiming
PerformanceResourceTiming
PerformanceEventTiming
PerformanceObserver
long tasks / long animation frames where supported
```

Prefer established performance libraries and browser tooling over reinventing metric algorithms manually.

## Correlate release and route

A useful regression query:

```text
LCP p75
route = /product/[id]
mobile only
release before = abc123
release after = def456
```

This is much stronger than:

```text
site feels slower today
```

## Performance regression workflow

```text
alert / report
  ↓
identify metric and affected segment
  ↓
compare release boundary
  ↓
inspect resource/server/browser evidence
  ↓
reproduce in lab
  ↓
fix
  ↓
verify lab
  ↓
verify field distribution
```

## Common mistakes

### Averaging Web Vitals

Averages can hide bad tails. Use percentile distributions.

### Optimizing only Lighthouse

Lab scores can improve while real users regress.

### Ignoring route mix

A traffic shift can change site-wide p75 without a code regression.

### Sending telemetry from a huge Client Component

Keep performance reporting isolated and lightweight.

### Treating experimental attribution as stable

Label it and isolate it.

## Interview questions

### Why does Next.js recommend a separate Client Component for `useReportWebVitals`?

Because the hook requires a Client Component, but keeping it in a tiny component avoids unnecessarily expanding the client boundary of the root layout.

### What does p75 mean in Core Web Vitals evaluation?

The 75th percentile represents a value at or below which 75% of measured experiences fall. It captures user experience distribution better than a single run or simple average.

### What is the difference between lab and field performance data?

Lab data is controlled and reproducible; field data represents actual users, devices, networks, caches, and interactions. Use lab data to diagnose and field data to confirm real-world impact.

## Exercise

Instrument one route with a Web Vitals reporting component and design an event schema that supports:

1. p75 by route
2. mobile vs desktop
3. release comparison
4. privacy-safe aggregation
5. LCP and INP debugging
