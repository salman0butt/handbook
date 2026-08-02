---
title: Worker Threads, Child Processes and Cluster
description: Worker threads add parallel JavaScript within a process; child processes provide process boundaries; cluster distributes connections across Node processes.
---

# Worker Threads, Child Processes and Cluster

## Concept

Worker threads add parallel JavaScript within a process; child processes provide process boundaries; cluster distributes connections across Node processes.

## Why It Exists

CPU-heavy work, native executables, fault isolation, and multi-core use require different parallelism choices.

## Mental Model

```mermaid
flowchart LR
  A["Main event loop"]
  B["Queue or IPC"]
  C["Worker thread or process"]
  D["Result and lifecycle"]
  A --> B
  B --> C
  C --> D
```

Treat every arrow as a boundary with a cost, ownership rule, cancellation behavior, and failure mode. Node.js is effective when those boundaries are explicit instead of hidden behind framework defaults.

## How It Works

The JavaScript callback runs on the main JavaScript thread. Native Node.js bindings, libuv, the operating system, worker threads, child processes, or remote services may perform work elsewhere. Completion only becomes useful when control returns to JavaScript. Under load, the important questions are what is queued, what is bounded, what can be cancelled, and which resource saturates first.

## Example

```js
import { Worker } from 'node:worker_threads';

function runWorker(data) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./worker.js', import.meta.url), {workerData: data});
    worker.once('message', resolve);
    worker.once('error', reject);
    worker.once('exit', (code) => code === 0 || reject(new Error(`worker exit ${code}`)));
  });
}
```

The example is intentionally small enough to execute, but the production boundary is the important part: validate inputs, establish a deadline, propagate cancellation, classify failures, and release resources deterministically.

## Production Use

Use a bounded worker pool for CPU tasks, `spawn` or `execFile` for controlled executables, and external orchestration for most horizontal service scaling.

## Security

Validate messages, avoid shell execution, restrict executable paths and permissions, and understand that workers share a trust boundary with the process.

## Performance

Account for startup, memory per isolate/process, serialization or transfer, queue wait, shared memory contention, and result size.

## Common Mistakes

- Worker per request.
- Using `exec` with interpolated input.
- Assuming cluster removes the need for shared external state.

## Debugging

Measure worker queue depth, task duration, CPU, memory, crashes, IPC throughput, and process exit reasons.

## Testing

Test crash replacement, cancellation, malformed messages, transferred buffers, queue overflow, signals, and shutdown.

## When Not to Use It

Do not use workers for ordinary asynchronous network I/O.

## Interview Questions

- Worker thread vs child process?
- When is cluster appropriate?
- What are transferable objects?

## Official References

- [nodejs.org](https://nodejs.org/api/)
- [nodejs.org](https://nodejs.org/en/about/previous-releases)
