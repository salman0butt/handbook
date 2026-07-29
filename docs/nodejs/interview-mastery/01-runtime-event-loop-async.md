---
title: Runtime, Event Loop & Async Deep Dive
---

# Runtime, Event Loop & Async Deep Dive

## Why does Node handle many concurrent connections with one JavaScript thread?

**Expected:** JavaScript callbacks usually run on one main thread, but socket waiting is delegated to OS/libuv facilities. While one connection waits, the event loop can execute callbacks for another ready connection.

**Senior answer:** mention that scalability is bounded by callback CPU cost, memory, file descriptors, connection pools, serialization, and downstream capacity. One slow CPU callback delays every ready callback on that process. Network I/O generally does not mean one thread per socket, while selected fs/crypto/DNS/compression operations can involve the shared libuv worker pool.

**Weak answer:** “Node is single-threaded and asynchronous, so it is fast.”

**Follow-up:** What changes if every request performs 200 ms of synchronous JSON transformation?

## What happens when `await` executes?

`await` evaluates an expression, obtains/assimilates a Promise-like result, suspends that async function, and returns control so other work can proceed. When the awaited Promise settles, the continuation becomes eligible through JavaScript microtask semantics and later resumes on the main JS thread.

It does **not** reserve a hidden JavaScript thread while waiting.

```text
async function
   ↓ await I/O promise
function suspended
   ↓
OS/libuv/remote work
   ↓ promise settles
microtask continuation
   ↓
main JS thread resumes function
```

## What runs in libuv's worker pool?

Selected operations whose platform implementations cannot be expressed purely through readiness/completion APIs can use the shared pool. Common categories include selected filesystem work, resolver-style DNS lookup, crypto, and compression. Exact implementation details are API/platform/version-sensitive; do not claim that all async Node APIs use the pool.

**Follow-up:** Why can increasing `UV_THREADPOOL_SIZE` fail to fix slow HTTP requests?

Because the bottleneck might be main-thread CPU, network/DB latency, DB pool waiting, remote service saturation, or OS socket behavior. More pool threads also consume resources and can increase contention.

## `process.nextTick` vs Promise microtasks vs `queueMicrotask` vs `setImmediate` vs `setTimeout`

A strong answer distinguishes queues/intent rather than reciting one universal order. `process.nextTick()` is Node-specific and can run before ordinary event-loop progress; Promise reactions and `queueMicrotask()` use JS microtasks; `setImmediate()` is associated with the check phase; timers become eligible after delay thresholds. Recursive next-tick/microtask scheduling can starve I/O/timers.

## Async does not mean parallel

```js
async function burnCpu() {
  for (let i = 0; i < 5e9; i++);
}
```

Making this function `async` does not move the loop off the main thread. Parallel JS requires workers/processes or native execution elsewhere.

## Ordering drill

For each snippet, do not just give output. Explain the mechanism and guarantees.

```js
console.log('A');
Promise.resolve().then(() => console.log('B'));
queueMicrotask(() => console.log('C'));
process.nextTick(() => console.log('D'));
setImmediate(() => console.log('E'));
setTimeout(() => console.log('F'), 0);
console.log('G');
```

Then repeat scheduling immediate/timer inside an I/O callback and explain why context changes eligibility.

## Senior failure scenarios

- p99 rises with CPU at 100% and event-loop delay high → profile JS/native CPU and GC.
- CPU low, event-loop healthy, requests slow → inspect dependency latency and pools.
- fs/crypto operations slow under concurrency while JS CPU is moderate → inspect shared worker-pool pressure.
- memory rises with 100k pending Promises → concurrency/queue ownership problem, not a Promise syntax problem.
