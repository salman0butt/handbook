---
title: Images, Fonts, CSS, Scripts & Network Performance
description: Diagnose the browser critical path across images, fonts, CSS, scripts, third parties, resource hints, compression, caching, and delivery infrastructure.
---

# Images, Fonts, CSS, Scripts & Network Performance

The browser cannot paint what it has not discovered, downloaded, decoded, or executed.

A route's resource critical path can include:

```text
HTML
→ CSS
→ fonts
→ images
→ JavaScript
→ third-party scripts
→ iframes / embeds
```

Phase 12 taught the APIs. This chapter focuses on measuring their performance together.

## Resource discovery matters

A critical resource loaded late may hurt more than a larger resource discovered early.

For LCP assets, inspect:

```text
when resource became discoverable
request priority
queue delay
transfer duration
decode/render delay
```

## Images

For each important image verify:

- intrinsic geometry is known
- rendered size matches responsive candidate selection
- `sizes` is accurate when using `fill`
- the LCP image is not accidentally lazy
- non-critical images remain lazy
- format/quality matches product needs
- CDN/optimizer cache is effective

A 1600 px image rendered at 320 px is a delivery problem even when the component is otherwise correct.

## LCP image priority

Use current `next/image` priority controls intentionally. In Next.js 16, `preload` is the modern explicit preload API while old `priority` usage is deprecated.

Only a genuinely critical image should consume early bandwidth.

Preloading many candidates defeats prioritization.

## Fonts

Font performance questions:

```text
how many families?
how many weights/styles?
which routes preload them?
what is fallback behavior?
are metric differences causing CLS?
can a variable font replace many files?
```

`next/font` removes runtime Google-font network dependency, but application architecture still determines how many font resources are shipped.

## CSS

CSS can block first rendering.

Investigate:

- total CSS by route
- shared vs route-specific styles
- unused component-library CSS
- oversized global styles
- CSS-in-JS runtime cost where applicable

Current Next.js exposes experimental `inlineCss`. Its trade-off is explicit: potentially faster first render for small/atomic CSS, but repeated HTML bytes and worse cross-page stylesheet caching for repeat visitors.

Because it is experimental, treat it as a measured experiment, not a universal recommendation.

## CSS chunking

Framework CSS chunking can affect the number and composition of stylesheets. Tune only when you have measured a real delivery problem; manual chunk micro-management can reduce cache reuse or create ordering complexity.

## Scripts

Script strategy should match urgency:

```text
critical global script
→ beforeInteractive only when truly required

normal interactive integration
→ afterInteractive

low-priority vendor
→ lazyOnload or interaction-based loading
```

Do not classify analytics as critical merely because stakeholders want it on every page.

## Third parties are outside your direct performance control

A third-party script can add:

```text
DNS/TLS connection
transfer bytes
parse/execute cost
long tasks
network contention
layout changes
runtime errors
```

Maintain an inventory with owner and purpose.

Remove abandoned tags.

## Tag managers multiply uncertainty

A small tag-manager bootstrap can dynamically load much more code later.

Audit the executed vendor graph, not only the bootstrap file size.

Performance governance should include approval, expiry, and route scope for tags.

## Facades for heavy embeds

Video players, maps, chat widgets, and social embeds can be deferred behind a lightweight preview.

```text
static preview
→ user intent
→ load heavy embed
```

This protects initial load while preserving the feature.

## Resource hints

Hints such as preload/preconnect can help when you know a resource is important and likely to be used.

They also consume connection and bandwidth priority.

Do not preconnect to every possible vendor.

## Compression

Confirm production responses actually use appropriate compression at the platform/reverse-proxy layer.

Inspect response headers rather than assuming local framework defaults equal hosted behavior.

Compressible resources include text formats such as:

```text
HTML
JavaScript
CSS
JSON
RSC/text payloads depending on delivery stack
```

Already-compressed media gains little from repeated compression work.

## Browser caching

Long-lived immutable hashed assets should benefit from long browser/CDN caching.

Dynamic HTML, APIs, personalized RSC responses, and authenticated content need semantics aligned with correctness and privacy.

Do not add public caching to personalized output to improve a synthetic score.

## Connection reuse and origins

Every new origin can add DNS, connection, and TLS overhead.

A page pulling resources from many vendors can fragment connection reuse and prioritization.

Count origins, not just request count.

## Request waterfalls

Use the Network panel to identify:

```text
document waits
CSS waits
font waits
JS discovers another JS
client JS fetches data after hydration
third-party loads nested vendors
```

The waterfall often reveals architecture more clearly than source code.

## Resource timing and cache state

When comparing two loads, distinguish:

```text
memory cache
disk cache
CDN hit
CDN miss
service worker cache
fresh network request
```

Otherwise an optimization may simply be a warm-cache artifact.

## Prefetch bandwidth

Next.js route prefetch can improve navigation, but on pages with hundreds of links it can create work the user never consumes.

Use built-in behavior first and measure on constrained networks before changing it.

## HTTP status and redirects

Redirect chains add round trips.

Avoid unnecessary sequences such as:

```text
http → https
www → apex
old locale → new locale
trailing slash normalization
```

when infrastructure can resolve canonical routing efficiently.

## Performance and security trade-offs

Examples:

- strict nonce CSP can require dynamic rendering
- SRI/CSP policies affect script delivery architecture
- authenticated images may bypass shared optimization paths
- privacy rules may restrict third-party telemetry

Do not disable protections merely to improve a metric.

## Browser resource review checklist

- real LCP resource identified
- image candidate size verified
- font files/weights bounded
- CSS critical path understood
- client scripts classified by urgency
- third-party inventory current
- connection/origin count reviewed
- cache headers verified in production
- compression verified
- redirect chains removed
- cold and warm loads compared

## Interview questions

### Why can a smaller resource still be the performance bottleneck?

Because discovery order, priority, connection setup, execution, or render dependency can make a small late resource block the critical path.

### Why is preloading everything harmful?

Preloads compete for bandwidth and priority. If everything is marked important, truly critical resources lose scheduling advantage.

### Why do third parties require governance rather than one-time optimization?

Their code and nested dependencies can change independently of your deployment, so performance impact can drift after integration.

## Exercise

Capture a Network waterfall for one route and classify every request as:

1. critical
2. useful but deferrable
3. interaction-only
4. third-party
5. removable

Then identify the longest serial chain to first useful content.
