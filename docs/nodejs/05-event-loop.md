---
title: The Event Loop
---

# The Event Loop

The event loop is the mechanism that lets one JavaScript thread make progress across many asynchronous operations. It does not execute all I/O itself, and it does not make CPU-bound JavaScript parallel.

## Mental model

```text
JS callback runs to completion
        ↓
queues asynchronous work
        ↓
Node/libuv/OS waits or performs work elsewhere
        ↓
completion becomes runnable
        ↓
event loop chooses eligible callback
        ↓
JS callback resumes on main thread
```

A callback owns the main JavaScript thread until it returns. That is why a 300 ms CPU loop can delay thousands of otherwise-ready connections.

## Phases as a reasoning tool

libuv exposes event-loop phases commonly described as timers, pending callbacks, poll, check, and close callbacks, with additional internal bookkeeping. Do not memorize a diagram as a universal ordering guarantee: platform behavior, readiness, timer thresholds, and Node versions affect what is eligible.

- **timers**: callbacks whose delay threshold has elapsed;
- **poll**: I/O readiness/completions and waiting strategy;
- **check**: `setImmediate()` callbacks;
- **close callbacks**: selected handle close events.

## Microtasks and `process.nextTick()`

Promise reactions and `queueMicrotask()` use the microtask mechanism. `process.nextTick()` is a Node-specific queue with special priority semantics. Both can starve progress when recursively filled.

```js
function starve() {
  queueMicrotask(starve);
}
starve();
setTimeout(() => console.log('may never get a turn'), 0);
```

The same design smell applies to unbounded `process.nextTick()` recursion.

## `setImmediate()` vs `setTimeout(0)`

`setTimeout(fn, 0)` means “eligible after at least a timer threshold,” not “run immediately.” `setImmediate(fn)` schedules for the check phase. Their relative order from top-level code should not be treated as a business invariant. After certain I/O callbacks, `setImmediate()` is often observed first because of phase progression.

## Blocking

Blocking means the event loop cannot make progress on other callbacks.

```js
app.get('/report', () => {
  const result = hugeCpuCalculation(); // blocks every request on this process
});
```

Synchronous filesystem/crypto/compression APIs, catastrophic regex behavior, huge JSON parsing/serialization, or large JS loops can all increase tail latency.

## Fairness

A server is cooperative. Every callback should do bounded work, yield naturally through async boundaries, or delegate CPU-heavy computation to worker processes/threads.

## Event-loop lag vs dependency latency

If an HTTP request takes 800 ms, that does not prove the event loop was blocked. Measure:

```text
request latency
 ├─ event-loop delay?
 ├─ CPU saturation?
 ├─ GC pause / allocation pressure?
 ├─ libuv pool saturation?
 ├─ DB pool wait?
 ├─ DNS/network latency?
 └─ downstream service latency?
```

## Ordering exercise

Predict before running:

```js
import { readFile } from 'node:fs';

setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
Promise.resolve().then(() => console.log('promise'));
process.nextTick(() => console.log('nextTick'));
readFile(import.meta.filename, () => {
  setTimeout(() => console.log('io timeout'), 0);
  setImmediate(() => console.log('io immediate'));
});
```

The important answer is not a memorized line order. Explain **which queues are involved, which callbacks are eligible, and which ordering is actually guaranteed by the relevant API**.
