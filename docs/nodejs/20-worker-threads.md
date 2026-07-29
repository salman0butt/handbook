---
title: Worker Threads
---

# Worker Threads

Worker threads run JavaScript in additional V8 isolates on separate threads. They are primarily useful for CPU-bound JavaScript or workloads that benefit from parallel execution inside one process.

```text
main isolate/thread
  ├─ event loop
  └─ request coordination
          │ messages
          ▼
worker isolate/thread
  └─ CPU-heavy function
```

```js
import { Worker } from 'node:worker_threads';

const worker = new Worker(new URL('./worker.js', import.meta.url), {
  workerData: { batchId: 'b1' },
});
worker.on('message', result => console.log(result));
worker.on('error', err => report(err));
```

## Data transfer

Most messages use structured clone semantics. Large clone-heavy messages can erase the benefit of parallelism. Transferable `ArrayBuffer`-backed data can move ownership without copying in supported cases.

`SharedArrayBuffer` plus `Atomics` enables shared memory but introduces real synchronization complexity: races, ordering, contention, deadlock-like protocols, and harder debugging. Prefer message passing until shared memory is justified.

## Use pools, not worker-per-request

Worker startup has cost. A production CPU service normally maintains a bounded pool and queues jobs.

```text
HTTP requests
    ↓
bounded job queue
    ↓
N workers ~= measured CPU capacity
```

An unbounded queue only moves overload from CPU to memory. Apply admission control/load shedding.

## Failure handling

A worker can throw, exit, hang, or consume excessive CPU/memory. Associate every job with an owner, timeout/cancellation policy, and a strategy for worker replacement.

## When not to use workers

- waiting on DB/network I/O;
- tiny CPU tasks where messaging overhead dominates;
- hiding a poor algorithm;
- workloads already executed efficiently in native async APIs.

Measure event-loop responsiveness and end-to-end throughput before and after introducing workers.
