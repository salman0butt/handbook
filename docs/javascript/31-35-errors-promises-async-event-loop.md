---
title: 31–35 · Errors, Promises, Async/Await & Event Loop
description: JavaScript phases 31–35 with language semantics, runtime mental models, production trade-offs, and interview reasoning.
id: 31-35-errors-promises-async-event-loop
---

# 31–35 · Errors, Promises, Async/Await & Event Loop

## 31 · Errors

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

Errors are ordinary objects used with abrupt `throw` completions. Standard error subclasses communicate broad categories, `cause` preserves causal chains, and stack traces are implementation/runtime facilities rather than ECMA-262 guarantees.

### Mental model / runnable experiment

```js
// 31: Errors
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **Error**
- **AggregateError**
- **EvalError**
- **RangeError**
- **ReferenceError**
- **SyntaxError**
- **TypeError**
- **URIError**
- **error cause**
- **stack traces as implementation/runtime features**
- **custom errors**
- **exception translation**
- **error boundaries between layers**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Errors** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 32 · Promises

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

A Promise is a stateful abstraction for one eventual outcome. Chaining schedules reactions as Jobs, assimilates thenables through the resolution procedure, and propagates errors until handled. Combinators express concurrency policy.

### Mental model / runnable experiment

```text
pending
 ├─→ fulfilled
 └─→ rejected
```

### Coverage contract

- **Promise states**
- **settlement**
- **then**
- **catch**
- **finally**
- **chaining**
- **Promise resolution procedure mental model**
- **thenables**
- **error propagation**
- **Promise.all**
- **allSettled**
- **any**
- **race**
- **resolve**
- **reject**
- **withResolvers**
- **try if standardized in current baseline**
- **common async mistakes**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Promises** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 33 · Async / Await

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

`async` functions always produce promises, while `await` suspends their continuation until an awaited value is resolved. Sequential code can accidentally serialize independent work; concurrency comes from starting work before awaiting.

### Mental model / runnable experiment

```js
const pUser = fetchUser()
const pPrefs = fetchPreferences()
const [user, prefs] = await Promise.all([pUser, pPrefs])
```

### Coverage contract

- **async functions**
- **await**
- **return values**
- **rejection behavior**
- **sequential vs parallel execution**
- **error handling**
- **top-level await**
- **async stack reasoning**
- **loops with await**
- **Promise composition**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Async / Await** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 34 · Event Loop and Job Queues

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

ECMAScript specifies Jobs such as Promise reactions, while the host defines event-loop phases, tasks, rendering, timers, and I/O. Browser microtasks are drained at host-defined checkpoints, which explains ordering without pretending `setTimeout` is a language feature.

### Mental model / runnable experiment

```js
console.log("A")
setTimeout(() => console.log("B"), 0) // host task
Promise.resolve().then(() => console.log("C")) // Promise Job / microtask
console.log("D")
// Browser-like host: A, D, C, B
```

### Coverage contract

- **call stack**
- **ECMAScript Jobs**
- **promise jobs**
- **microtasks**
- **browser tasks**
- **host event loop**
- **rendering opportunities**
- **timers**
- **I/O callbacks**
- **starvation**
- **execution ordering**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Event Loop and Job Queues** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 35 · Async Iteration

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

Async iteration extends the iterator protocol so `next()` results are awaited. Async generators and `for await...of` are suitable for streams and paginated sources, but cancellation and backpressure still require explicit design.

### Mental model / runnable experiment

```js
// 35: Async Iteration
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **`Symbol.asyncIterator`**
- **async iterators**
- **async generators**
- **`for await...of`**
- **streaming data**
- **backpressure concepts**
- **cancellation considerations**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Async Iteration** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
