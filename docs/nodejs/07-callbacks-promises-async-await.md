---
title: Callbacks, Promises & async/await
---

# Callbacks, Promises & async/await

These are JavaScript control-flow abstractions over asynchronous work; they do not determine whether the underlying operation uses the OS, libuv pool, another process, or no I/O at all.

## Error-first callbacks

Historic Node APIs commonly use `(err, value)`.

```js
readFile('data.json', (err, data) => {
  if (err) return handle(err);
  use(data);
});
```

Never both throw and callback errors unpredictably. Callback APIs must define exactly-once completion.

`util.promisify()` can adapt conventional callback APIs, but custom/nonstandard callback signatures may need explicit wrappers.

## Promises and `await`

```js
async function loadUser(id, signal) {
  const response = await fetch(`/users/${id}`, { signal });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
```

`await` pauses the **async function**, not the entire thread. Its continuation runs after the awaited Promise settles.

## Sequential vs concurrent

```js
const a = await loadA();
const b = await loadB(); // sequential

const [x, y] = await Promise.all([loadX(), loadY()]); // concurrent start
```

Concurrency is useful for independent bounded work. It is dangerous when fan-out exceeds downstream capacity.

## Combinators

- `Promise.all`: fail-fast aggregate; other operations are not automatically cancelled.
- `Promise.allSettled`: wait for all outcomes.
- `Promise.race`: first settlement wins the returned Promise; losers keep running unless cancelled.
- `Promise.any`: first fulfillment; rejects with `AggregateError` if all reject.

## Cancellation

Promises themselves are not cancellation tokens. Use `AbortSignal` when the operation supports it.

```js
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(new Error('deadline')), 2_000);
try {
  await doWork({ signal: controller.signal });
} finally {
  clearTimeout(timer);
}
```

A timeout that merely rejects while leaving underlying work alive can create resource leaks and retry amplification.

## Error ownership

Each async boundary needs an owner: return/await the Promise, intentionally detach with explicit error reporting, or enqueue durable work. “Fire and forget” usually means “failure and lifecycle forgotten.”
