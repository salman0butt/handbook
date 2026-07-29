---
title: Performance Architecture, Budgets & Design Review
description: Review whole-system Next.js performance through route contracts, budgets, SLOs, trade-offs, capacity, third parties, and senior architecture scenarios.
---

# Performance Architecture, Budgets & Design Review

Performance architecture is the discipline of deciding **where work belongs, when it runs, how much it costs, and how the system proves that cost remains acceptable**.

## Whole-system performance map

```text
user
  ↓
network / CDN
  ↓
Proxy / routing
  ↓
server runtime
  ↓
auth + data + cache + dependencies
  ↓
RSC / HTML streaming
  ↓
images / fonts / CSS / scripts
  ↓
hydration
  ↓
interaction updates
  ↓
telemetry feedback loop
```

A senior performance review follows the entire path.

## Route performance contract

For an important route define:

```text
user task
field SLOs
server latency budget
initial JS budget
resource budget
data dependency budget
third-party budget
cache behavior
failure/degraded mode
measurement owner
```

Without ownership, budgets become comments nobody enforces.

## Budget the critical path, not every byte equally

A 100 KB library loaded after the user opens an advanced editor is different from 100 KB of blocking JavaScript on every homepage load.

Classify cost by:

```text
initial critical
initial non-critical
prefetched
interaction-triggered
server-only
background/post-response
```

## Architecture decision: server or browser?

Use server when work:

- needs secrets or privileged data
- is non-interactive transformation
- can reduce client JS
- benefits from shared backend/cache access

Use browser when work:

- requires immediate local interaction
- depends on browser APIs
- should continue without server round trip
- is genuinely user-specific ephemeral UI state

Avoid moving work across the boundary solely for a benchmark without considering latency, privacy, cost, and resilience.

## Architecture decision: render now, stream later, or defer?

```text
needed for first useful screen
→ render on critical path

important but slow independent region
→ Suspense/stream

not needed until user action
→ lazy load / defer
```

This classification is often more valuable than micro-optimizing the implementation.

## Architecture decision: cache or compute?

Cache when reuse and correctness allow it.

Compute when:

- data is request-specific
- freshness requirements reject reuse
- key cardinality makes cache ineffective
- computation is cheap enough

Every cache needs an invalidation and isolation story.

## Performance and security cannot be separated

Never optimize by:

```text
caching private data publicly
skipping authorization
trusting client claims
removing CSP without risk review
exposing secrets for fewer server calls
```

A fast security incident is still a failed system.

## Performance and reliability

Aggressive parallelism can improve one request while causing overload under traffic.

Architecture review must include:

```text
steady-state capacity
traffic spike behavior
cache-miss storm
upstream degradation
DB pool exhaustion
third-party slowdown
```

## Performance SLOs

Useful product SLO examples:

```text
checkout INP p75 ≤ target
product LCP p75 ≤ target
API p95 latency ≤ target
navigation success rate ≥ target
```

Choose metrics that reflect the user task and can be measured reliably.

## Error budgets and performance budgets

An error budget handles reliability tolerance. A performance budget limits latency/bytes/work.

Both let teams make explicit trade-offs rather than debating "fast enough" subjectively.

## Release gates

Potential performance gates:

```text
bundle diff warning
synthetic route budget
server p95 benchmark
field canary regression
third-party change review
```

Not every gate should block every release. Use severity and confidence.

## Canary and progressive rollout

For high-traffic systems, compare performance by release cohort before full rollout.

```text
old release
vs
new release
same route/device/region segment
```

This helps separate code impact from traffic mix.

## Performance ownership by layer

| Layer | Typical owner questions |
| --- | --- |
| Route/UI | Is critical UI available early? |
| Client boundary | Does this code need browser JS? |
| Data | Are dependencies parallel, bounded, cached correctly? |
| Backend | Are DB/upstream p95 and capacity healthy? |
| Resources | Are LCP/fonts/scripts on the right priority path? |
| Platform | Are CDN, compression, regions, buffering configured correctly? |
| Observability | Can regressions be detected and attributed? |

## Senior scenario: slow dashboard

Symptoms:

```text
TTFB 900 ms
LCP 1.3 s after response
INP good
```

Likely priority:

```text
server/data path
```

Do not begin by replacing button components.

## Senior scenario: fast server, poor INP

```text
TTFB 120 ms
LCP 1.6 s
INP 600 ms
```

Investigate:

```text
client bundle
long tasks
large rerenders
chart/grid libraries
third-party JS
layout work
```

## Senior scenario: good lab, bad field

Possible causes:

- low-end devices
- geography
- third-party variability
- cold caches
- authenticated route differences
- real user interaction patterns

Segment field data before changing code.

## Senior scenario: bundle grows 30%

Ask:

1. which route?
2. initial or deferred chunk?
3. client or server dependency?
4. import chain?
5. user impact?
6. can work move server-side or lazy load?

A percentage without delivery context is incomplete.

## Senior scenario: streaming looks good locally but not production

Inspect:

```text
reverse proxy buffering
CDN behavior
compression
platform streaming support
response headers
actual chunk timing
```

Framework streaming cannot overcome infrastructure that buffers the response.

## Performance review anti-patterns

### Benchmark theatre

Publishing a single best-case score without environment/distribution.

### Budget without enforcement

A document says 200 KB, but no one checks changes.

### Optimization without rollback

High-risk cache/runtime changes need observable rollback paths.

### Dependency drift

Third-party or package updates change cost without bundle/performance review.

### Local-machine bias

High-end developer hardware hides interaction and CPU problems.

## Performance maturity model

### Level 1 — reactive

```text
users complain
→ team investigates manually
```

### Level 2 — measured

```text
RUM + server metrics + release IDs
```

### Level 3 — budgeted

```text
route budgets + bundle diffs + regression alerts
```

### Level 4 — architecture-driven

```text
performance considered during design
capacity modeled
trade-offs explicit
rollout verifies field impact
```

## Phase 15 production checklist

### Measurement

- RUM exists for key journeys
- p75 Core Web Vitals segmented appropriately
- server p95/p99 visible
- release identity attached
- lab reproduction documented

### Rendering and data

- critical dependency graph known
- avoidable waterfalls removed
- streaming boundaries align with UX
- cache correctness/hit rate measured
- RSC/client payloads minimized

### Client runtime

- client boundaries narrow
- initial JS measured by route
- heavy features deferred appropriately
- interaction profiles exist for slow journeys
- large lists bounded/virtualized where needed

### Resources

- LCP element known
- image candidates correct
- font/CSS path reviewed
- third parties inventoried
- compression/cache behavior verified

### Backend

- DB/upstream latency traced
- pools/concurrency bounded
- timeouts/retries intentional
- cold/warm behavior measured
- memory/capacity monitored

### Governance

- budgets have owners
- regression thresholds exist
- release rollback is possible
- performance changes are re-measured in field data

## Interview questions

### How do you approach Next.js performance at senior level?

Start from the user journey and field metrics, decompose the critical path across network/server/RSC/resources/hydration/interaction, find measured bottlenecks, make architecture-level changes before micro-optimizations, then verify in lab and field data.

### What is the relationship between performance and capacity?

Low latency for one request can come from more parallel work, memory, or connections. Under load that can reduce throughput and increase tail latency, so performance optimization must consider shared capacity.

### When is a performance regression acceptable?

When the product/security/reliability benefit justifies it, the trade-off is explicit, the affected budget/SLO is understood, and alternatives have been evaluated. "Performance" is not the only product requirement.

## Capstone review exercise

Design a performance review for a multi-tenant analytics application containing:

- public marketing page
- authenticated dashboard
- data-heavy table
- interactive chart
- report export
- third-party support widget

For each route/feature define critical path, server/data budget, client JS budget, field metric, cache strategy, degraded mode, and regression test.
