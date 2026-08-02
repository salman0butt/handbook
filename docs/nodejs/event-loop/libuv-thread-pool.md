---
title: libuv Thread Pool
description: libuv provides a small worker pool for selected filesystem, crypto, compression, and resolver operations; it is not a general JavaScript worker pool.
---

# libuv Thread Pool

## Concept

libuv provides a small worker pool for selected filesystem, crypto, compression, and resolver operations; it is not a general JavaScript worker pool.

## Why It Exists

Pool saturation can create latency spikes that look like network slowness even when the main JavaScript thread is mostly idle.

## Mental Model

```mermaid
flowchart LR
  A["JavaScript request"]
  B["Native async API"]
  C["libuv worker pool"]
  D["Completion callback"]
  A --> B
  B --> C
  C --> D
```

Treat every arrow as a boundary with a cost, ownership rule, cancellation behavior, and failure mode. Node.js is effective when those boundaries are explicit instead of hidden behind framework defaults.

## How It Works

The JavaScript callback runs on the main JavaScript thread. Native Node.js bindings, libuv, the operating system, worker threads, child processes, or remote services may perform work elsewhere. Completion only becomes useful when control returns to JavaScript. Under load, the important questions are what is queued, what is bounded, what can be cancelled, and which resource saturates first.

## Example

```js
import { pbkdf2 } from 'node:crypto';
import { promisify } from 'node:util';

const derive = promisify(pbkdf2);
const jobs = Array.from({length: 8}, (_, i) =>
  derive(`password-${i}`, 'salt', 150_000, 32, 'sha256')
);
console.time('pool-work');
await Promise.all(jobs);
console.timeEnd('pool-work');
```

The example is intentionally small enough to execute, but the production boundary is the important part: validate inputs, establish a deadline, propagate cancellation, classify failures, and release resources deterministically.

## Production Use

Treat pool size as capacity shared by APIs in one process. Prefer bounded concurrency and isolate expensive cryptographic or compression workloads when they compete with latency-sensitive file operations.

## Security

Do not lower password-hashing cost to fix latency. Use safe algorithms, bounded concurrency, dedicated workers or services, and rate limits.

## Performance

Increasing `UV_THREADPOOL_SIZE` can increase parallelism but also memory, CPU contention, and downstream pressure. Measure before changing it.

## Common Mistakes

- Assuming every network request uses the pool.
- Increasing the pool without measuring CPU and memory.
- Running unbounded password hashing in request handlers.

## Debugging

Compare event-loop delay with CPU, pool-dependent operation latency, and concurrency. Build a controlled saturation test.

## Testing

Test the service under concurrent filesystem, crypto, and compression work and assert deadlines and queue limits.

## When Not to Use It

Do not use the libuv pool for arbitrary JavaScript CPU functions; use worker threads or child processes.

## Interview Questions

- Which Node APIs use the libuv pool?
- How would pool saturation appear in metrics?
- When would you change UV_THREADPOOL_SIZE?

## Official References

- [docs.libuv.org](https://docs.libuv.org/en/v1.x/threadpool.html)
- [nodejs.org](https://nodejs.org/api/cli.html#uv_threadpool_sizesize)
