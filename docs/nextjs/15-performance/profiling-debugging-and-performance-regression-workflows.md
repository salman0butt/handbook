---
title: Profiling, Debugging & Performance Regression Workflows
description: Use production builds, browser traces, React Profiler, network analysis, bundle reports, server traces, and before-after experiments to diagnose regressions.
---

# Profiling, Debugging & Performance Regression Workflows

Performance debugging should produce evidence, not folklore.

## Begin with the user symptom

Examples:

```text
homepage LCP regressed
search typing feels delayed
soft navigation stalls
server p95 doubled
bundle grew after dependency update
memory grows after repeated navigation
```

Convert the complaint into a measurable hypothesis.

## Reproduce production mode

Use production build behavior when measuring release performance:

```bash
npm run build
npm run start
```

Development mode adds diagnostics, hot reloading, and different compilation behavior.

## Browser Performance panel

Use a trace to identify:

- navigation timing
- long tasks
- script execution
- style/layout
- paint
- resource loading
- interaction event timing

Zoom into the exact slow user interaction.

## Network panel

Inspect:

```text
request start
priority
cache source
response timing
transfer bytes
initiator
redirects
connection/origin
```

Compare cold and warm cache states intentionally.

## React Profiler

React Profiler helps attribute render/commit work to components.

Use it after browser evidence indicates React rendering is significant.

Ask:

```text
which update triggered render?
which components consumed time?
was the render necessary?
is state placed too high?
is a library subtree expensive?
```

Do not use React Profiler as a replacement for browser performance traces.

## Bundle analysis

Use bundle reports to find **why** bytes exist.

A useful before-after record:

```text
route
initial client JS before
after
new modules
import chain
reason for change
```

Current Turbopack analyzer is experimental; Webpack has `@next/bundle-analyzer`.

## Server traces

OpenTelemetry or equivalent tracing can show:

```text
request
├── session lookup
├── database query
├── external API
├── server render
└── response
```

Correlate browser slowdown with server trace IDs/release where possible.

## Flame graphs and CPU profiles

For CPU-bound server/client problems, profiles reveal where CPU time is spent.

Do not optimize functions that appear frequently but consume negligible total time.

## Memory profiling

For suspected leaks:

```text
establish baseline
perform repeatable navigation/action loop
take heap snapshot
repeat
compare retained objects
```

Look for listeners, DOM nodes, library instances, caches, and closures retained unexpectedly.

## Performance marks

Application-level timing can clarify business tasks:

```ts
performance.mark('search-start')
// work
performance.mark('search-ready')
performance.measure('search-ready-time', 'search-start', 'search-ready')
```

Use names and cardinality that remain useful in production telemetry.

## Regression bisect

When a release regresses:

```text
identify first bad release
compare commits/dependencies
compare bundle/resource/server traces
reproduce
bisect if needed
```

A release/build identifier in telemetry dramatically reduces diagnosis time.

## One change at a time

If you simultaneously:

```text
change cache policy
replace image format
lazy-load chart
change DB query
```

and the metric improves, you do not know which change mattered or what hidden regression was introduced.

Prefer controlled experiments where practical.

## Statistical noise

Performance measurements vary.

Use multiple runs and distributions. Record machine/network conditions for lab comparisons.

Do not celebrate a 3% change from one Lighthouse run unless the signal exceeds measurement noise.

## CPU/network throttling

Use throttling to expose bottlenecks that high-end development machines hide.

Test at least one constrained mobile-like scenario for public/user-facing routes.

## Disable extensions/private noise

Browser extensions can add scripts, modify DOM, and alter traces. Use a clean testing profile/incognito where appropriate.

## Debug hard vs soft navigation separately

Hard load regression:

```text
HTML/assets/hydration path
```

Soft navigation regression:

```text
prefetch/RSC/data/reconciliation/client-state path
```

Different evidence is required.

## Cache debugging

Compare:

```text
cache hit
cache miss
stale revalidation
post-mutation refresh
```

A benchmark dominated by hits can hide a catastrophic miss path.

## Third-party regression

A performance regression can occur without your code changing.

Track third-party versions/endpoints and executed script cost where possible.

If a vendor can change remotely, include it in incident hypotheses.

## CI performance checks

Useful CI gates can include:

- bundle-size diffs
- route resource budgets
- synthetic Lighthouse thresholds
- server benchmark smoke tests

Keep them deterministic enough to avoid alert fatigue.

Field performance remains the release truth.

## Performance incident template

```text
impact
metric
start time
affected routes/segments
release correlation
field evidence
server evidence
browser evidence
hypothesis
mitigation
verification
follow-up budget/test
```

## Common mistakes

### Optimizing from intuition

Profile first.

### Using development performance numbers

Validate production build behavior.

### Comparing warm to cold loads

State the cache condition.

### Ignoring server traces during frontend regression

LCP can regress because TTFB changed.

### Fixing a score without user impact

Tie optimization to a journey and field metric.

## Interview questions

### How would you investigate a sudden LCP regression?

Segment field data by route/device/release, inspect TTFB and LCP attribution, compare Network waterfalls and resource changes, inspect server traces if TTFB changed, reproduce in a controlled production build, then verify the fix in field data.

### When do you use React Profiler vs Chrome Performance tools?

Use browser Performance tools for the whole main-thread/render/network interaction; use React Profiler to attribute React render/commit cost once React is implicated.

## Exercise

Create a regression runbook for a 30% INP increase after a release. Include field segmentation, browser trace, React profile, bundle diff, rollback decision, and post-fix verification.
