---
title: Core Web Vitals, RUM, Lighthouse & Attribution
description: Measure LCP, INP, CLS, TTFB, and FCP with field data, useReportWebVitals, lab tools, segmentation, attribution, and regression analysis.
---

# Core Web Vitals, RUM, Lighthouse & Attribution

Performance decisions need trustworthy measurement.

Next.js provides `useReportWebVitals` as a framework integration point for browser metrics, but a production performance system needs more than printing one number to the console.

## Current Core Web Vitals model

The three Core Web Vitals are:

```text
LCP → loading experience
INP → interaction responsiveness
CLS → visual stability
```

Common good thresholds are:

```text
LCP ≤ 2.5 seconds
INP ≤ 200 milliseconds
CLS ≤ 0.1
```

Evaluate field performance at the **75th percentile** rather than optimizing a single lucky page load.

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

FID is historical for Core Web Vitals while INP is the current responsiveness metric. Older dashboards may still contain FID, so migration and trend interpretation may require both.

## `useReportWebVitals`

Create a narrow Client Component:

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

Mount that small island from the root layout:

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

The root layout does **not** need to become a broad Client Component just to report metrics.

## Keep the callback reference stable

Current Next.js guidance warns that changing the callback function identity can cause already-available metrics to be reported again.

Prefer a module-level or otherwise stable callback:

```tsx
const sendMetric: ReportCallback = (metric) => {
  // send to analytics
}

export function WebVitals() {
  useReportWebVitals(sendMetric)
  return null
}
```

## Metric payload

The reported object contains metric identity/value information. Type against the actual Next.js hook signature rather than maintaining a hand-written interface that can drift.

Useful fields include concepts such as:

```text
id
name
value
delta
rating
navigation type
performance entries
```

## Send field data without blocking navigation

A common transport pattern is:

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

If you own the endpoint, validate payload size and schema. Browser telemetry is still untrusted input.

## Do not make telemetry the bottleneck

Avoid:

- a large analytics SDK only for a few metrics
- synchronous storage work on every event
- one network request for every tiny sample
- giant DOM snapshots
- high-cardinality identifiers
- full URLs containing sensitive query parameters

Telemetry should be bounded, sampled where appropriate, and privacy reviewed.

## Real User Monitoring needs context

A useful RUM event may include low-cardinality dimensions such as:

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

Follow the redaction/privacy model from Phase 14.

## Prefer route patterns to raw IDs

Raw paths such as:

```text
/orders/1001
/orders/1002
/orders/1003
```

create high cardinality.

Aggregate by a normalized route identity such as:

```text
/orders/[id]
```

when your telemetry architecture can derive it safely.

## Segment mobile and desktop

A global metric can look healthy while slower devices suffer.

Useful slices include:

```text
mobile vs desktop
coarse device class
region
browser
route
release
public vs authenticated journey
cold vs repeat visit
```

Segment enough to reveal real problems without making every event unique.

## LCP diagnosis

LCP measures when the largest visible content element is painted.

A useful critical-path decomposition is:

```text
TTFB
+ resource discovery delay
+ resource load duration
+ render delay
= observed LCP path
```

Common causes:

- slow server response
- hero image discovered late
- wrong image priority
- render-blocking CSS
- font dependency
- client-only rendering
- main-thread contention
- third-party work

Do not assume every LCP regression is an image problem.

## LCP images

For the real LCP image, verify:

```text
correct source candidate
correct rendered size
no oversized download
resource discovered early
not accidentally lazy-loaded
stable dimensions
```

Phase 12 covers `next/image`; Phase 15 focuses on proving that the browser chose and scheduled the right resource.

## INP diagnosis

Think of interaction latency as:

```text
input delay
+ event-handler work
+ React/browser rendering work
+ time until next paint
```

Common causes:

- long handlers
- synchronous filtering/sorting
- giant rerenders
- charts/editors/grids
- layout thrashing
- third-party JavaScript
- hydration/main-thread competition

Record the interaction that produced poor INP. A global score without interaction context is hard to act on.

## React transitions and responsiveness

`startTransition` / `useTransition` can mark non-urgent updates so urgent feedback remains responsive.

```text
expensive work still exists
but
urgent input can receive higher priority
```

If the computation itself is enormous, reduce, move, chunk, virtualize, cache, or server-render it.

## CLS diagnosis

Common causes include:

- images without reserved geometry
- late banners/ads
- font metric changes
- client-only content inserted above existing content
- expanding embeds
- layout-changing animation

Prefer stable geometry and predictable placeholders.

## Font-induced CLS

Inspect:

```text
font request timing
fallback vs final font metrics
route preload scope
unused weights/styles
```

A font can be framework-optimized and still be overused architecturally.

## TTFB is diagnostic evidence

TTFB can reflect:

```text
network distance
CDN/cache behavior
cold start
authentication
uncached data reads
slow upstream APIs
database contention
render startup
```

Frontend asset tuning cannot fix a backend-dominated TTFB.

## FCP is supporting evidence

FCP answers roughly:

```text
did visible DOM content appear early?
```

A fast FCP with late LCP may mean the user sees only a shell/skeleton for too long.

## Lighthouse is a lab tool

The Next.js production checklist recommends Lighthouse as simulated measurement paired with field data.

Run it against a production build and a clean browser context.

Use it to inspect:

- loading timeline
- main-thread work
- unused JS
- image opportunities
- render blocking
- accessibility side effects

Do not treat a tiny score change from two random runs as a production regression.

## Stable synthetic testing

For comparisons, hold these constant:

```text
route
build mode
device profile
network profile
cache policy
```

Run multiple samples and compare a median/distribution rather than one run.

## Experimental Web Vitals attribution

Current Next.js docs expose:

```ts
const nextConfig = {
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP'],
  },
}
```

This can provide attribution details for diagnosis.

At the current 16.2.12 baseline it remains **experimental** and should not become a required production architecture dependency.

## Browser Performance APIs

For deeper investigation, browser tooling/APIs can expose data from:

```text
PerformanceNavigationTiming
PerformanceResourceTiming
PerformanceEventTiming
PerformanceObserver
long tasks / long animation frames where supported
```

Prefer established libraries and browser tooling over reimplementing Web Vitals algorithms manually.

## Correlate route and release

A useful regression query is:

```text
LCP p75
route = /product/[id]
mobile only
release before = abc123
release after = def456
```

This is stronger than "the site feels slower today".

## Regression workflow

```text
alert / report
→ identify metric and affected segment
→ compare release boundary
→ inspect resource/server/browser evidence
→ reproduce in lab
→ fix
→ verify lab
→ verify field distribution
```

## Common mistakes

### Averaging Web Vitals

Averages can hide bad tails. Use percentile distributions.

### Optimizing only Lighthouse

Lab scores can improve while real users regress.

### Ignoring route mix

A traffic shift can change site-wide p75 without a code regression.

### Reporting from a huge Client Component

Keep the Web Vitals island small.

### Treating attribution as stable

It is experimental at this baseline; label and isolate it.

## Interview questions

### Why use a separate Client Component for `useReportWebVitals`?

The hook requires a Client Component, but a tiny reporting island avoids unnecessarily broadening the client boundary of the root layout.

### What does p75 mean?

It is the value at or below which 75% of measured experiences fall. It represents a distribution better than a single run or simple average.

### Field vs lab data?

Lab data is controlled and reproducible; field data represents real users, devices, networks, caches, and interactions. Use lab data to diagnose and field data to confirm impact.

## Exercise

Design a Web Vitals event schema that supports:

1. p75 by route
2. mobile vs desktop
3. release comparison
4. privacy-safe aggregation
5. LCP and INP debugging
