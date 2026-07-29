---
title: 33 — Async / Await
---

# 33 — Async / Await

`async`/`await` is syntax over Promise-based asynchronous control flow. It makes sequencing and error handling look structured, but it does not make asynchronous operations synchronous and it does not create threads.

## Async functions always return Promises

```js
async function value() {
  return 42;
}

value() instanceof Promise; // true
```

Returning a normal value fulfills the returned Promise. Throwing rejects it.

```js
async function fail() {
  throw new Error('boom');
}
```

## `await`

`await expr` evaluates `expr`, resolves/adopts it through Promise semantics, suspends the async function's continuation, and later resumes with the fulfillment value or throws the rejection reason.

```js
async function load() {
  const user = await getUser();
  return user.name;
}
```

Even awaiting an already-fulfilled Promise schedules continuation asynchronously rather than continuing inline in the same synchronous call stack.

## Error handling

```js
async function loadProfile(id) {
  try {
    const profile = await fetchProfile(id);
    return normalize(profile);
  } catch (error) {
    throw new ProfileLoadError('Could not load profile', {cause: error});
  }
}
```

Do not catch just to log and rethrow at every layer. Catch where you can recover, translate to a meaningful boundary error, add useful context, or perform required cleanup.

## Sequential vs parallel

This is sequential:

```js
const user = await getUser();
const settings = await getSettings();
```

If independent, start both before awaiting:

```js
const userPromise = getUser();
const settingsPromise = getSettings();
const [user, settings] = await Promise.all([userPromise, settingsPromise]);
```

Do not parallelize when ordering is a real dependency or when unbounded concurrency would overload downstream systems.

## Loops with await

```js
for (const id of ids) {
  await processOne(id); // intentionally sequential
}
```

`for...of` plus `await` is valid and often correct for sequential semantics.

This common pattern does **not** make `forEach` await its callbacks:

```js
await ids.forEach(async id => {
  await processOne(id);
});
```

`forEach` returns `undefined` and does not consume the callback's Promise results. For parallel work:

```js
await Promise.all(ids.map(id => processOne(id)));
```

For bounded concurrency, use a queue/semaphore/pool instead of launching everything at once.

## Top-level await

Top-level `await` is available in modules, not classic scripts. It participates in the module graph's asynchronous evaluation and can delay dependent-module evaluation.

```js
// module
const config = await loadConfig();
export {config};
```

Used carelessly, top-level await can create graph-level startup latency or cycles that are harder to reason about. Prefer explicit initialization APIs when application startup ordering should be visible.

## Cancellation

`async` functions do not have built-in cancellation. Use an explicit cancellation protocol, often `AbortSignal` for Web APIs or APIs that accept it.

```js
async function load(url, {signal} = {}) {
  const response = await fetch(url, {signal}); // fetch is host API
  return response.json();
}
```

## Async stack reasoning

An async function can suspend and later resume in a new job. DevTools may reconstruct async causality in stack traces, but exact async-stack display is tooling/engine behavior. Reason primarily from Promise chains/jobs and ownership of async operations.

## Common mistakes

- `await` inside a loop that should have controlled parallelism.
- `Promise.all` over unbounded input.
- `async` functions that catch and silently convert every failure to `undefined`.
- `return await` cargo cult: sometimes it is useful for `try/catch`/stack behavior, but otherwise returning the Promise directly can be clearer.
- Timeouts that reject without aborting underlying work.
- Fire-and-forget tasks with no error owner.

## Interview checks

1. What does an async function return before its body finishes?
2. Does `await` block the JavaScript thread?
3. Why doesn't `await array.forEach(async ...)` work as many expect?
4. When should independent Promises be started before awaiting?
5. What risks does top-level await add to module graphs?

Related: [Promises](./32-promises.md), [Event loop](./34-event-loop.md), [Concurrency/races](./architecture-and-production.md#85--concurrency-and-race-conditions).
