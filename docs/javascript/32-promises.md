---
title: 32 — Promises
---

# 32 — Promises

A Promise represents the eventual outcome of an asynchronous operation. Its state is initially pending, then becomes fulfilled or rejected. Once settled, its outcome does not change.

```text
pending
  ├──→ fulfilled(value)
  └──→ rejected(reason)
```

## Construction and settlement

```js
const promise = new Promise((resolve, reject) => {
  doWork((error, value) => {
    if (error) reject(error);
    else resolve(value);
  });
});
```

The executor runs synchronously during construction. Calling `resolve` does not necessarily mean “fulfill immediately”: resolving with another promise/thenable adopts that eventual state.

```js
const inner = Promise.resolve(42);
const outer = new Promise(resolve => resolve(inner));
```

This distinction—**resolved** versus **fulfilled**—matters when reading the Promise resolution procedure.

## `then`, `catch`, `finally`

```js
fetchData()
  .then(value => transform(value))
  .then(result => save(result))
  .catch(error => recover(error))
  .finally(() => stopSpinner());
```

`then` always returns a new Promise. If a handler returns a value, the new Promise fulfills with it; if it throws, the new Promise rejects; if it returns a promise/thenable, the chain adopts it.

```js
Promise.resolve(2)
  .then(x => x * 3)
  .then(x => { throw new Error(String(x)); })
  .catch(error => error.message); // '6'
```

`catch(onRejected)` is equivalent in spirit to `then(undefined, onRejected)`. `finally` is for cleanup/observation and normally passes through the original outcome unless the `finally` callback throws or returns a rejecting thenable.

## Thenables

Promise resolution can assimilate foreign objects with a callable `then` property. This enables interoperability but means `resolve(untrustedObject)` can invoke user-controlled code.

```js
const thenable = {
  then(resolve) { resolve('ok'); },
};
Promise.resolve(thenable);
```

Use normal Promise APIs; do not manually reproduce the resolution algorithm.

## Composition

### `Promise.all`

Fulfills when all inputs fulfill; rejects when the first observed rejection settles the aggregate.

```js
const [user, orders] = await Promise.all([
  getUser(),
  getOrders(),
]);
```

Good when all results are required and operations can run concurrently.

### `Promise.allSettled`

Waits for all and returns per-item `{status, value|reason}` outcomes. Good for independent work where partial failure is meaningful.

### `Promise.any`

Fulfills with the first fulfillment; rejects with `AggregateError` if all reject.

### `Promise.race`

Settles with the first input to settle. `race` does **not cancel losers**. Cancellation requires a separate protocol such as `AbortSignal` in host APIs.

## Static helpers

- `Promise.resolve(value)` — produce/adopt a promise outcome.
- `Promise.reject(reason)` — create a rejected Promise.
- `Promise.withResolvers()` — returns `{promise, resolve, reject}` for APIs that genuinely need capability separation.
- `Promise.try(...)` — standardized in the ECMAScript 2026 baseline; invokes a callback and turns synchronous throws/returned thenables into a Promise outcome. Check target runtime support before depending on very new APIs.

```js
const {promise, resolve, reject} = Promise.withResolvers();
```

Prefer the Promise constructor when the executor naturally owns setup. `withResolvers` is useful when resolve/reject capability must be handed to another lifecycle surface.

## Common mistakes

### Missing return

```js
fetchUser()
  .then(user => {
    saveUser(user); // if saveUser is async and not returned, chain does not wait
  });
```

Correct:

```js
fetchUser().then(user => saveUser(user));
```

### Promise constructor abuse

Do not wrap an existing Promise without a reason:

```js
// anti-pattern
new Promise((resolve, reject) => existingPromise.then(resolve, reject));
```

Use `existingPromise` directly or transform it with `.then`.

### Unhandled rejections

Always make rejection ownership clear. Runtime policies vary, but an unhandled rejection is a production defect signal, not a substitute for error architecture.

### Accidental sequentialism

```js
const a = await getA();
const b = await getB(); // waits for A even if independent
```

Use composition when independent:

```js
const [a, b] = await Promise.all([getA(), getB()]);
```

## Scheduling mental model

Promise reactions are represented by ECMAScript Jobs. Hosts integrate those Jobs with their event loop/microtask mechanisms. The language specifies Promise job semantics; the browser or Node host decides the larger scheduling loop around tasks, rendering, I/O, and timers.

## Security and reliability

Promises do not cancel work automatically. Timeouts built with `Promise.race` can leave network or CPU work running. Use real cancellation APIs where available. Bound concurrency when processing attacker-controlled or very large collections; `Promise.all(hugeArray.map(request))` can exhaust sockets/memory.

## Interview checks

1. What is the difference between resolving and fulfilling a Promise?
2. What does `.then` return?
3. Does `Promise.race` cancel losing operations?
4. When is `allSettled` more appropriate than `all`?
5. Why can Promise resolution of a thenable execute arbitrary code?

Related: [Async/await](./33-async-await.md), [Event loop](./34-event-loop.md), [Error architecture](./architecture-and-production.md#86--error-architecture).
