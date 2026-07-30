---
title: 85–87 · Concurrency, Error Architecture & Large Applications
description: JavaScript phases 85–87 with language semantics, runtime mental models, production trade-offs, and interview reasoning.
id: 85-87-concurrency-errors-large-apps
---

# 85–87 · Concurrency, Error Architecture & Large Applications

## 85 · Concurrency and Race Conditions
> **Engineering lens:** prefer explicit contracts, measurements, ownership, and failure modes over style folklore.

Single-threaded callback execution does not eliminate races: asynchronous operations can complete in different orders. Use cancellation, request identity/versioning, idempotency, sequencing, or atomic/shared-memory techniques depending on the boundary.

### Mental model / runnable experiment

```js
let requestVersion = 0
async function search(q) {
  const version = ++requestVersion
  const result = await apiSearch(q)
  if (version !== requestVersion) return // stale response
  render(result)
}
```

### Coverage contract

- **asynchronous interleaving**
- **stale responses**
- **duplicate submissions**
- **read-modify-write races**
- **cancellation**
- **request identity**
- **optimistic UI concerns**
- **shared worker memory**
- **Atomics where relevant**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Concurrency and Race Conditions** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 86 · Error Architecture
> **Engineering lens:** prefer explicit contracts, measurements, ownership, and failure modes over style folklore.

Error architecture separates expected domain failures from unexpected bugs, preserves causes, decides retryability/cancellation, maps internal details to safe user messages, and adds logging/telemetry at ownership boundaries.

### Mental model / runnable experiment

```js
// 86: Error Architecture
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **expected vs unexpected errors**
- **operational vs programmer errors**
- **typed/discriminated error objects conceptually**
- **wrapping errors**
- **`cause`**
- **logging**
- **user-facing errors**
- **retryability**
- **cancellation**
- **error boundaries between modules**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Error Architecture** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 87 · Large JavaScript Application Architecture
> **Engineering lens:** prefer explicit contracts, measurements, ownership, and failure modes over style folklore.

Large applications need clear feature/domain boundaries, state ownership, ports/adapters, dependency inversion, observable workflows, and migration seams. Architecture is successful when change stays local and failure boundaries are explicit.

### Mental model / runnable experiment

```js
// 87: Large JavaScript Application Architecture
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **modules**
- **layers**
- **feature architecture**
- **domain boundaries**
- **ports/adapters**
- **dependency inversion**
- **functional core / imperative shell**
- **state ownership**
- **data flow**
- **testability**
- **observability**
- **migration strategies**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Large JavaScript Application Architecture** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
