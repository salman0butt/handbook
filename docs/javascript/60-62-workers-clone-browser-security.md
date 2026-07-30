---
title: 60–62 · Workers, Structured Clone & Browser Security
description: JavaScript phases 60–62 with language semantics, runtime mental models, production trade-offs, and interview reasoning.
id: 60-62-workers-clone-browser-security
---

# 60–62 · Workers, Structured Clone & Browser Security

## 60 · Web Workers
> **Boundary:** this chapter is about browser/Web host APIs. The APIs execute alongside JavaScript but are not defined by ECMA-262.

Web Workers run JavaScript in separate agents/threads with different globals. Messages use structured cloning or transfer; SharedArrayBuffer creates shared-memory responsibilities. Workers help CPU-heavy work only when transfer/setup cost is justified.

### Mental model / runnable experiment

```js
const worker = new Worker(new URL("./worker.js", import.meta.url), {type: "module"})
worker.postMessage({kind: "start", payload})
worker.addEventListener("message", event => console.log(event.data))
```

### Coverage contract

- **Worker**
- **dedicated workers**
- **messages**
- **structured cloning**
- **transferable objects**
- **shared data**
- **SharedArrayBuffer**
- **worker errors**
- **CPU-heavy workloads**
- **main-thread responsiveness**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Web Workers** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 61 · Structured Clone
> **Boundary:** this chapter is about browser/Web host APIs. The APIs execute alongside JavaScript but are not defined by ECMA-262.

Structured cloning copies supported object graphs including cycles, Map/Set, typed arrays, and many platform objects. Transfer can move ownership of transferable resources. It is not equivalent to JSON stringify/parse.

### Mental model / runnable experiment

```js
// 61: Structured Clone
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **structured cloning algorithm**
- **structuredClone**
- **supported values**
- **cycles**
- **Map/Set**
- **ArrayBuffer**
- **transfer**
- **difference from JSON cloning**
- **limitations**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Structured Clone** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 62 · Browser Security for JavaScript Developers
> **Boundary:** this chapter is about browser/Web host APIs. The APIs execute alongside JavaScript but are not defined by ECMA-262.

Browser JavaScript runs across trust boundaries. XSS, unsafe HTML/eval, prototype pollution, third-party scripts, token/storage choices, CSP/Trusted Types, CSRF/CORS confusion, and URL handling must be modeled explicitly.

### Mental model / runnable experiment

```js
// 62: Browser Security for JavaScript Developers
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **XSS**
- **DOM XSS**
- **unsafe innerHTML**
- **eval**
- **Function constructor**
- **prototype pollution**
- **CSRF boundary**
- **CORS misconceptions**
- **CSP**
- **Trusted Types overview**
- **storage of secrets**
- **token handling**
- **third-party scripts**
- **dependency risks**
- **URL injection**
- **open redirect concepts**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Browser Security for JavaScript Developers** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
