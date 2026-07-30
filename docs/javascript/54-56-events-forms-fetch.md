---
title: 54–56 · Browser Events, Forms & Fetch
description: JavaScript phases 54–56 with language semantics, runtime mental models, production trade-offs, and interview reasoning.
id: 54-56-events-forms-fetch
---

# 54–56 · Browser Events, Forms & Fetch

## 54 · Browser Events
> **Boundary:** this chapter is about browser/Web host APIs. The APIs execute alongside JavaScript but are not defined by ECMA-262.

Browser events flow through capture, target, and bubble phases on EventTarget chains. Delegation uses bubbling plus target inspection; listener options control capture, once, passive behavior, and cancellation.

### Mental model / runnable experiment

```text
window → document → ancestor (capture)
                    ↓
                  target
                    ↓
ancestor → document → window (bubble)
```

### Coverage contract

- **EventTarget**
- **addEventListener**
- **removeEventListener**
- **event object**
- **target/currentTarget**
- **capture phase**
- **target phase**
- **bubble phase**
- **preventDefault**
- **stopPropagation**
- **stopImmediatePropagation**
- **event delegation**
- **custom events**
- **keyboard**
- **pointer**
- **mouse**
- **input**
- **focus**
- **form**
- **lifecycle events**
- **listener options**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Browser Events** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 55 · Forms and Validation
> **Boundary:** this chapter is about browser/Web host APIs. The APIs execute alongside JavaScript but are not defined by ECMA-262.

Browser validation improves UX but is not a trust boundary. FormData represents submitted controls, constraint-validation APIs expose browser rules, accessibility requires labels/errors/focus semantics, and servers must independently validate.

### Mental model / runnable experiment

```js
// 55: Forms and Validation
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **form elements**
- **FormData**
- **submit**
- **input/change**
- **HTML constraint validation APIs**
- **custom validation**
- **accessibility**
- **server validation requirement**
- **security boundaries**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Forms and Validation** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 56 · Browser Fetch and HTTP Client JavaScript
> **Boundary:** this chapter is about browser/Web host APIs. The APIs execute alongside JavaScript but are not defined by ECMA-262.

`fetch` is a Web API (also implemented by some non-browser hosts), not ECMAScript. It resolves for HTTP error statuses, rejects mainly for network/cancellation failures, streams bodies, and interacts with credentials/CORS/security policy.

### Mental model / runnable experiment

```js
const controller = new AbortController()
const timeout = setTimeout(() => controller.abort(), 5000)
try {
  const response = await fetch(url, {signal: controller.signal})
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return await response.json()
} finally {
  clearTimeout(timeout)
}
```

### Coverage contract

- **fetch**
- **Request**
- **Response**
- **Headers**
- **body streams concept**
- **JSON requests**
- **status handling**
- **errors**
- **AbortController**
- **timeouts built around cancellation**
- **credentials**
- **CORS**
- **retries**
- **idempotency**
- **request race conditions**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Browser Fetch and HTTP Client JavaScript** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
