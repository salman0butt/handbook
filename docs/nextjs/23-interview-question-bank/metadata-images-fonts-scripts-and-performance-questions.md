---
title: Metadata, Images, Fonts, Scripts & Performance Questions
sidebar_position: 5
description: Interview questions and concise answer keys for metadata, SEO, next/image, next/font, next/script, Core Web Vitals, bundles, hydration, backend latency, and performance architecture.
---

# Metadata, Images, Fonts, Scripts & Performance Questions

## 1. Static `metadata` vs `generateMetadata`?

Static `metadata` is declared directly for fixed values; `generateMetadata` computes metadata from route/data context on the server.

## 2. Why does metadata inheritance matter?

Nested route metadata combines/overrides parent metadata according to framework rules; senior design avoids accidentally replacing important parent fields.

## 3. What is `metadataBase` for?

Provides a base URL used to resolve relative metadata URLs such as canonical/social assets where supported.

## 4. Why use canonical URLs?

To communicate the preferred identity for duplicate/variant public content to crawlers and sharing systems.

## 5. What should robots/sitemap generation consider?

Public/staging visibility, tenant domains, canonical route lifecycle, deleted content, pagination and current framework file conventions.

## 6. Why is JSON-LD an XSS concern?

It lives in a script context; raw untrusted strings can break out if serialized unsafely.

## 7. What does `next/image` solve?

Image sizing/layout stability, responsive candidate generation, loading/optimization integration and safer source configuration.

## 8. Why must image dimensions be known?

To reserve layout space and avoid CLS.

## 9. What does `sizes` affect?

It tells the browser how wide the rendered image will be at different viewport conditions so it can choose an appropriate source candidate.

## 10. `fill` vs width/height?

`fill` lets the image fill a positioned container; explicit width/height represents intrinsic geometry. Both still require correct responsive/layout intent.

## 11. What is the current LCP image guidance?

Ensure the actual hero/LCP image is discoverable early and avoid lazy-loading it; use preload only when evidence justifies it. In Next.js 16, `priority` is deprecated in favor of current loading/preload controls.

## 12. `remotePatterns` vs old `images.domains`?

`remotePatterns` provides more precise remote-source allowlisting and is preferred; `domains` is deprecated migration context.

## 13. Why restrict remote image sources?

The image optimizer performs server-side fetches, so arbitrary sources can create SSRF/resource abuse risks.

## 14. Why does `images.qualities` matter?

It controls allowed optimization quality values; current Next.js requires deliberate quality policy rather than accepting unlimited arbitrary requests.

## 15. What does `next/font` solve?

Build-time/local font integration, self-hosting, preload/subset control and fallback metric handling without runtime Google-font requests.

## 16. Why can font choice affect CLS?

Fallback and final font metrics differ; metric adjustment and deliberate font loading reduce layout shift.

## 17. Why avoid loading every weight/subset?

It increases transfer, preload and cache cost. Include only typography the product uses.

## 18. `next/script` strategies?

`beforeInteractive` for rare truly critical early scripts, `afterInteractive` for normal post-hydration scripts, and `lazyOnload` for low-priority work.

## 19. Why are third-party scripts risky?

They add network/main-thread cost, can fail independently, affect privacy/consent and expand supply-chain/security surface.

## 20. What are Core Web Vitals?

Current primary user-experience metrics include LCP, INP and CLS, typically evaluated around the p75 field distribution.

## 21. Good thresholds?

Common web.dev guidance: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 for the “good” range at p75.

## 22. Field vs lab performance?

Field/RUM measures real users/devices/networks; lab tools provide controlled diagnostics. Use both for different questions.

## 23. What does `useReportWebVitals` do?

Lets client code receive web-vital measurements for sending to your telemetry system. Keep callback identity stable and control privacy/cardinality.

## 24. Why can a Server Component improve performance?

It can keep data access/render logic off the browser bundle and reduce client JS/hydration work, but server latency and RSC payload still matter.

## 25. What makes `'use client'` a performance boundary?

Moving it upward can pull a larger dependency subtree into client bundles and increase hydration/main-thread cost.

## 26. What does `next/dynamic` help with?

Lazy-loading Client Components/libraries so heavy code is loaded on demand. `ssr:false` is for Client Component usage and should not be a default workaround.

## 27. Why might dynamic-importing a Server Component not help the way expected?

Server Components already code-split in the framework model; dynamic imports primarily affect client code/dependencies, and mixed server/client chunk behavior has framework-specific limitations.

## 28. React Compiler and performance?

It can automate memoization-style render optimization, but it does not remove network latency, large DOMs, heavy client dependencies, third-party cost or backend work.

## 29. Why measure p95/p99 server latency?

Averages hide tail pain. Users experience slow tail requests, and dependency/queue/pool saturation often appears in high percentiles first.

## 30. What is backpressure?

Limiting/controlling incoming work when downstream capacity is finite so overload does not cascade into total failure.

## 31. Why can more parallel DB queries be slower at scale?

They can exhaust connection pools and increase contention, raising tail latency even if a single request looks faster locally.

## 32. What is a cache stampede?

Many requests miss/expire simultaneously and all recompute/fetch the same expensive data, overloading the origin.

## 33. What is the performance workflow?

```text
measure
→ identify dominant cost
→ change smallest high-impact cause
→ remeasure
→ add regression guard
```

## 34. Browser profiling tools?

Network panel, Performance panel, memory/heap tools and React Profiler for component render work.

## 35. Server profiling tools?

Distributed traces/OpenTelemetry spans, DB query traces, CPU profiles/flamegraphs, heap/memory data, structured logs and dependency metrics.

## 36. Why can prefetching hurt?

It can consume bandwidth/server work for routes users never visit, especially if links are numerous or dynamic routes are expensive.

## 37. Why does streaming improve perceived performance but not intrinsic work?

It lets ready UI arrive earlier while slow work continues; the slow operation still consumes time/resources.

## 38. Why can a huge RSC payload still be a problem?

It consumes server serialization, network transfer and client reconciliation work even though it is not ordinary client JS.

## 39. What is a performance budget?

A measurable limit for route/user experience such as client JS, LCP/INP/CLS, server latency, DB query count, request count or page weight.

## 40. Senior performance answer pattern?

Always identify:

```text
user-visible metric
layer causing cost
measurement evidence
trade-off
capacity/security constraints
regression proof
```

Optimization without evidence is guesswork.