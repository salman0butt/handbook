---
title: Errors, Timeouts, Retries and Circuit Breakers
description: Reliable services classify failures, establish deadlines, cancel abandoned work, retry only safe transient operations, and stop hammering unhealthy dependencies.
---

# Errors, Timeouts, Retries and Circuit Breakers

## Concept

Reliable services classify failures, establish deadlines, cancel abandoned work, retry only safe transient operations, and stop hammering unhealthy dependencies.

## Why It Exists

Distributed calls can fail partially and slowly; unbounded retries amplify outages.

## Mental Model

```mermaid
flowchart LR
  A["Operation"]
  B["Deadline and classification"]
  C["Retry or circuit policy"]
  D["Success, fallback or failure"]
  A --> B
  B --> C
  C --> D
```

Treat every arrow as a boundary with a cost, ownership rule, cancellation behavior, and failure mode. Node.js is effective when those boundaries are explicit instead of hidden behind framework defaults.

## How It Works

The JavaScript callback runs on the main JavaScript thread. Native Node.js bindings, libuv, the operating system, worker threads, child processes, or remote services may perform work elsewhere. Completion only becomes useful when control returns to JavaScript. Under load, the important questions are what is queued, what is bounded, what can be cancelled, and which resource saturates first.

## Example

```ts
async function withDeadline<T>(milliseconds: number, work: (signal: AbortSignal) => Promise<T>): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error('deadline exceeded')), milliseconds);
  try {
    return await work(controller.signal);
  } finally {
    clearTimeout(timer);
  }
}
```

The example is intentionally small enough to execute, but the production boundary is the important part: validate inputs, establish a deadline, propagate cancellation, classify failures, and release resources deterministically.

## Production Use

Use error causes and stable codes, total timeout budgets, exponential backoff with jitter, idempotency, bulkheads, circuit breakers, and safe fallbacks.

## Security

Do not retry authentication or validation failures. Prevent retry storms, sensitive error leakage, and fallback authorization bypass.

## Performance

Retries multiply load and latency. Track attempts, queue wait, dependency saturation, circuit state, and deadline budget.

## Common Mistakes

- Retrying every error.
- Setting a client timeout without cancelling underlying work.
- Catching uncaught exceptions and continuing indefinitely.

## Debugging

Trace the causal chain, attempt number, deadline remaining, dependency response, and circuit transition.

## Testing

Inject timeouts, resets, partial responses, duplicate outcomes, and process crashes. Assert retry caps and idempotency.

## When Not to Use It

Do not add a circuit breaker around a local deterministic validation error.

## Interview Questions

- Operational vs programmer error?
- Why use jitter?
- When should a process crash?

## Official References

- [nodejs.org](https://nodejs.org/api/)
- [nodejs.org](https://nodejs.org/en/about/previous-releases)
