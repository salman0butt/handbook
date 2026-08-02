---
title: Promises and async/await
description: Promises represent eventual completion; `async` and `await` provide structured syntax without changing the underlying concurrency, cancellation, or resource ownership model.
---

# Promises and async/await

## Concept

Promises represent eventual completion; `async` and `await` provide structured syntax without changing the underlying concurrency, cancellation, or resource ownership model.

## Why It Exists

Readable async code can still leak resources, hide unbounded concurrency, swallow errors, and continue work after a request is cancelled.

## Mental Model

```mermaid
flowchart LR
  A["Start operation"]
  B["Promise pending"]
  C["Fulfilled or rejected"]
  D["Await continuation"]
  A --> B
  B --> C
  C --> D
```

Treat every arrow as a boundary with a cost, ownership rule, cancellation behavior, and failure mode. Node.js is effective when those boundaries are explicit instead of hidden behind framework defaults.

## How It Works

The JavaScript callback runs on the main JavaScript thread. Native Node.js bindings, libuv, the operating system, worker threads, child processes, or remote services may perform work elsewhere. Completion only becomes useful when control returns to JavaScript. Under load, the important questions are what is queued, what is bounded, what can be cancelled, and which resource saturates first.

## Example

```ts
async function fetchJson(url: string, signal: AbortSignal): Promise<unknown> {
  const response = await fetch(url, {signal});
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`, {cause: response});
  }
  return response.json();
}

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(new Error('deadline exceeded')), 2_000);
try {
  console.log(await fetchJson('https://example.com', controller.signal));
} finally {
  clearTimeout(timeout);
}
```

The example is intentionally small enough to execute, but the production boundary is the important part: validate inputs, establish a deadline, propagate cancellation, classify failures, and release resources deterministically.

## Production Use

Use `Promise.all` for a small bounded set of independent operations, `allSettled` when every result matters, and a concurrency limiter for data-dependent fan-out.

## Security

Propagate cancellation, validate remote data, avoid exposing raw errors, and ensure failed authorization stops all downstream work.

## Performance

Awaiting does not block the thread, but continuation code runs on it. Huge JSON parsing and unbounded Promise creation still consume CPU and memory.

## Common Mistakes

- Forgetting to return or await a Promise.
- Using `forEach(async ...)` and assuming it waits.
- Catching an error only to log and continue with invalid state.

## Debugging

Enable useful async stack traces, attach operation names and causes, and inspect unhandled rejection telemetry.

## Testing

Test fulfillment, rejection, timeout, cancellation, partial completion, and cleanup. Assert that no work continues after abort when the API supports it.

## When Not to Use It

Do not wrap synchronous CPU work in a Promise and call it asynchronous; delegate the computation.

## Interview Questions

- Does async/await create a thread?
- When should you use allSettled?
- How do you propagate cancellation through an async call graph?

## Official References

- [nodejs.org](https://nodejs.org/api/)
- [nodejs.org](https://nodejs.org/en/about/previous-releases)
