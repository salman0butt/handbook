---
title: JavaScript Performance
description: Measurement, browser rendering, algorithmic cost, memory, workers, bundles and real-user metrics.
slug: /javascript/performance/performance-overview
---

# JavaScript Performance

Performance engineering starts with a user-visible objective and measurement. A faster loop does not help when latency is dominated by network, rendering or an inefficient algorithm.

## Measurement hierarchy

- real-user monitoring for field experience;
- browser Performance API and traces for timelines;
- CPU profiles/flame charts for hot code;
- heap/allocation profiles for memory;
- bundle analysis for startup/network cost;
- controlled benchmarks for isolated hypotheses.

```javascript
performance.mark('filter-start')
const result = filterOrders(orders, criteria)
performance.mark('filter-end')
performance.measure('filter-orders', 'filter-start', 'filter-end')
```

Warmup, caching and logging can distort measurements. Record inputs, runtime, hardware and statistical distribution.

## Browser work

A frame can include JavaScript, style calculation, layout, paint and compositing. Interleaving layout reads and writes can force repeated synchronous layout.

```javascript
const widths = elements.map(element => element.getBoundingClientRect().width)
elements.forEach((element, index) => {
  element.style.width = `${Math.ceil(widths[index])}px`
})
```

Batch reads and writes, reduce DOM size only when measured, avoid long main-thread tasks, and use `requestAnimationFrame` for visual updates.

## Algorithms and allocation

Choose data structures by access pattern. Replace nested scans with a Map/Set when scale warrants it. Avoid unnecessary intermediate arrays in hot large-data pipelines. Allocation is not inherently bad; long-lived retention and high churn can increase GC cost.

## Scheduling and workers

Break work to preserve responsiveness, but understand that microtasks do not yield to rendering. Move CPU-heavy independent work to Web Workers or worker threads. Transfer large ArrayBuffers when ownership can move instead of copying them.

## Loading

Use route/feature code splitting, dynamic import and lazy media where they reduce initial work. Tree shaking depends on static modules and correct side-effect metadata. Compress assets, cache immutable builds and avoid duplicating libraries.

## Caching and memoization

Cache only when reuse probability and saved cost exceed lookup, memory and invalidation cost. Bound caches, include complete keys, expose hit metrics and define stale behavior.

## Web metrics

Core Web Vitals are host/product metrics, not JavaScript language rules. JavaScript can affect interaction latency, layout shifts and rendering through long tasks, hydration, DOM changes and resource scheduling. Use current web.dev definitions in the deployment period.

## Optimization review

State the baseline, bottleneck, hypothesis, change, confidence interval and regression guard. Remove clever micro-optimizations when they do not produce a durable measured gain.

## Primary references

- [Performance Timeline](https://www.w3.org/TR/performance-timeline/)
- [MDN performance](https://developer.mozilla.org/docs/Web/Performance)
- [V8 performance](https://v8.dev/docs)
