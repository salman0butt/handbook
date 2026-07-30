---
title: 72–74 · Performance, Memory Leaks & Debugging
description: JavaScript phases 72–74 with language semantics, runtime mental models, production trade-offs, and interview reasoning.
id: 72-74-performance-memory-debugging
---

# 72–74 · Performance, Memory Leaks & Debugging

## 72 · JavaScript Performance

> **Engineering lens:** prefer explicit contracts, measurements, ownership, and failure modes over style folklore.

Performance engineering starts with measurement and a bottleneck model: algorithm, CPU, allocation/GC, DOM/rendering, network, I/O, or concurrency. Optimize the dominant cost and protect the win with budgets or regression tests.

### Mental model / runnable experiment

```text
measure → identify bottleneck → form hypothesis → change one thing
       → re-measure → keep/revert → regression budget
```

### Coverage contract

- **measurement first**
- **algorithmic complexity**
- **allocations**
- **DOM work**
- **main-thread blocking**
- **long tasks**
- **async concurrency**
- **batching**
- **memoization**
- **lazy work**
- **parsing costs**
- **modules/code splitting concepts**
- **network vs CPU vs memory bottlenecks**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **JavaScript Performance** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 73 · Memory Leaks

> **Engineering lens:** prefer explicit contracts, measurements, ownership, and failure modes over style folklore.

Memory leaks are retained reachability that outlives useful work. Listeners, timers, observers, global caches, detached DOM, closures, and unresolved workflows are common retainers; heap snapshots and allocation timelines help prove the retention path.

### Mental model / runnable experiment

```js
const onResize = () => render()
window.addEventListener("resize", onResize)
// later:
window.removeEventListener("resize", onResize)
```

### Coverage contract

- **forgotten event listeners**
- **timers**
- **closures**
- **global references**
- **caches**
- **detached DOM**
- **observer subscriptions**
- **large object graphs**
- **unresolved async workflows**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Memory Leaks** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 74 · Debugging

> **Engineering lens:** prefer explicit contracts, measurements, ownership, and failure modes over style folklore.

Debugging is hypothesis testing: reproduce, minimize, inspect state/control flow, isolate boundary assumptions, and verify the fix. Console, breakpoints, async stacks, Network, Performance, Memory, and source maps are host/tooling capabilities.

### Mental model / runnable experiment

```js
// 74: Debugging
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **console**
- **breakpoints**
- **conditional breakpoints**
- **stepping**
- **call stacks**
- **scope inspection**
- **network debugging**
- **async debugging**
- **exception breakpoints**
- **source maps**
- **performance tools**
- **memory tools**
- **reproducible bug investigation**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Debugging** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
