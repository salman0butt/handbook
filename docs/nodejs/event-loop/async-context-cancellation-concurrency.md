---
title: Async Context, Cancellation and Concurrency Limits
description: AsyncLocalStorage carries request context, AbortSignal carries cancellation, and concurrency limits protect finite resources.
---

# Async Context, Cancellation and Concurrency Limits

## Concept

AsyncLocalStorage carries request context, AbortSignal carries cancellation, and concurrency limits protect finite resources.

## Why It Exists

Without these controls, logs lose causality, abandoned work consumes capacity, and fan-out overwhelms pools or downstream services.

## Mental Model

```mermaid
flowchart LR
  A["Incoming request"]
  B["Context and deadline"]
  C["Bounded operations"]
  D["Response and cleanup"]
  A --> B
  B --> C
  C --> D
```

Treat every arrow as a boundary with a cost, ownership rule, cancellation behavior, and failure mode. Node.js is effective when those boundaries are explicit instead of hidden behind framework defaults.

## How It Works

The JavaScript callback runs on the main JavaScript thread. Native Node.js bindings, libuv, the operating system, worker threads, child processes, or remote services may perform work elsewhere. Completion only becomes useful when control returns to JavaScript. Under load, the important questions are what is queued, what is bounded, what can be cancelled, and which resource saturates first.

## Example

```ts
import { AsyncLocalStorage } from 'node:async_hooks';

type Context = { requestId: string };
const storage = new AsyncLocalStorage<Context>();

async function withRequest<T>(requestId: string, work: () => Promise<T>): Promise<T> {
  return storage.run({requestId}, work);
}

await withRequest(crypto.randomUUID(), async () => {
  console.log(storage.getStore());
});
```

The example is intentionally small enough to execute, but the production boundary is the important part: validate inputs, establish a deadline, propagate cancellation, classify failures, and release resources deterministically.

## Production Use

Create context at ingress, propagate deadlines to HTTP/DB/queue calls, and set concurrency limits around every fan-out or worker pool.

## Security

Context must not become an authorization source by itself. Store identifiers and tracing metadata, then re-check authorization against trusted state.

## Performance

Async context adds overhead and can retain data if misused. Keep stores small and measure. Concurrency limits should reflect downstream capacity.

## Common Mistakes

- Putting mutable request state in globals.
- Creating a semaphore with no timeout or cancellation.
- Assuming a client disconnect automatically cancels database or queue work.

## Debugging

Log request and operation IDs, record queue wait time, and inspect leaked contexts or work continuing after cancellation.

## Testing

Run concurrent requests with distinct IDs, abort selected requests, and assert isolation, bounded in-flight work, and cleanup.

## When Not to Use It

Do not use AsyncLocalStorage as a business-state database or hidden dependency injection container.

## Interview Questions

- How does AsyncLocalStorage preserve context?
- Why is cancellation cooperative?
- How do you choose a concurrency limit?

## Official References

- [nodejs.org](https://nodejs.org/api/)
- [nodejs.org](https://nodejs.org/en/about/previous-releases)
