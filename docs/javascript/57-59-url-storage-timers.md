---
title: 57–59 · URL APIs, Storage & Timers
description: JavaScript phases 57–59 with language semantics, runtime mental models, production trade-offs, and interview reasoning.
id: 57-59-url-storage-timers
---

# 57–59 · URL APIs, Storage & Timers

## 57 · URL APIs
> **Boundary:** this chapter is about browser/Web host APIs. The APIs execute alongside JavaScript but are not defined by ECMA-262.

URL and URLSearchParams implement URL parsing/serialization rules from the host/web platform. They are safer than hand-built string concatenation and should be preferred at trust boundaries.

### Mental model / runnable experiment

```js
// 57: URL APIs
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **URL**
- **URLSearchParams**
- **parsing**
- **encoding**
- **query strings**
- **relative URLs**
- **URI encoding functions**
- **common mistakes**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **URL APIs** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 58 · Browser Storage
> **Boundary:** this chapter is about browser/Web host APIs. The APIs execute alongside JavaScript but are not defined by ECMA-262.

Browser storage APIs differ in synchrony, capacity, lifetime, origin scoping, and transaction model. localStorage is synchronous; IndexedDB is asynchronous; secrets do not become safe merely because storage is client-side.

### Mental model / runnable experiment

```js
// 58: Browser Storage
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **localStorage**
- **sessionStorage**
- **cookies overview**
- **IndexedDB overview**
- **Cache API overview where appropriate**
- **security**
- **quotas**
- **serialization**
- **cross-tab considerations**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Browser Storage** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 59 · Browser Timers and Scheduling
> **Boundary:** this chapter is about browser/Web host APIs. The APIs execute alongside JavaScript but are not defined by ECMA-262.

Timers are host scheduling APIs with minimum-delay/clamping behavior and no exact-time guarantee. `queueMicrotask` schedules microtask work, while requestAnimationFrame aligns visual work with rendering opportunities.

### Mental model / runnable experiment

```js
queueMicrotask(() => console.log("microtask"))
requestAnimationFrame(() => console.log("before a paint opportunity"))
setTimeout(() => console.log("future task"), 0)
```

### Coverage contract

- **setTimeout**
- **clearTimeout**
- **setInterval**
- **clearInterval**
- **queueMicrotask**
- **requestAnimationFrame**
- **task vs microtask**
- **timer delay misconceptions**
- **recursive timeouts**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Browser Timers and Scheduling** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
