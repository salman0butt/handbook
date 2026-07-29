---
title: Async I/O & libuv
---

# Async I/O & libuv

`async` operation and `parallel` execution are different ideas. Node can start many operations without blocking JavaScript even when those operations are not executing as JavaScript threads.

## Where work happens

```text
main JS thread
  ├─ runs callbacks / Promise continuations
  └─ initiates operations
          │
          ├─ sockets → OS async readiness/completion facilities
          └─ selected APIs → libuv worker pool
                           ↓
                     completion queued
                           ↓
                     JS callback resumes
```

libuv abstracts event-loop and asynchronous platform differences. Network sockets generally rely on OS facilities rather than “one libuv thread per socket.” Selected filesystem operations, DNS `getaddrinfo`-style lookup work, crypto operations, and compression can use the libuv worker pool.

## Thread-pool saturation

The pool is shared. If many expensive operations occupy it, unrelated APIs that need a pool worker can wait.

```text
4 long crypto tasks
        ↓
worker pool saturated
        ↓
fs / DNS work waits
        ↓
request latency rises although JS thread looks idle
```

`UV_THREADPOOL_SIZE` can change pool capacity within runtime limits, but it is not a universal performance knob. More threads consume memory and can increase CPU contention. First identify whether the workload is actually pool-bound.

## Async lifecycle

```js
import { readFile } from 'node:fs/promises';

async function loadConfig() {
  const data = await readFile('config.json');
  return JSON.parse(data);
}
```

At `await`, the async function yields. JavaScript does not sit on a thread blocked until the file returns. When the Promise settles, the continuation becomes a microtask and later resumes on the JS thread.

## Concurrency limit

Starting 50,000 async operations at once can overload file descriptors, memory, downstream APIs, DB pools, or the libuv pool.

```js
await Promise.all(items.map(processItem)); // unbounded fan-out
```

Use a semaphore/queue/pool that matches the scarce resource.

## Debugging checklist

- CPU low but latency high? inspect dependency/pool waits.
- event loop responsive but fs/crypto slow? inspect worker-pool saturation.
- sockets slow? inspect DNS, connection establishment, remote service and networking—not just `UV_THREADPOOL_SIZE`.
- memory climbing? inspect the number of in-flight operations and retained buffers.
