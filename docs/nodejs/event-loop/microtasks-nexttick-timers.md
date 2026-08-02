---
title: Microtasks, process.nextTick and Timers
description: Promise reactions, `queueMicrotask`, `process.nextTick`, timers, and `setImmediate` use different scheduling queues and priorities.
---

# Microtasks, process.nextTick and Timers

## Concept

Promise reactions, `queueMicrotask`, `process.nextTick`, timers, and `setImmediate` use different scheduling queues and priorities.

## Why It Exists

Recursive microtasks or next-tick callbacks can starve I/O even though every operation appears asynchronous.

## Mental Model

```mermaid
flowchart LR
  A["Current callback"]
  B["nextTick queue"]
  C["Microtask queue"]
  D["Next event-loop turn"]
  A --> B
  B --> C
  C --> D
```

Treat every arrow as a boundary with a cost, ownership rule, cancellation behavior, and failure mode. Node.js is effective when those boundaries are explicit instead of hidden behind framework defaults.

## How It Works

The JavaScript callback runs on the main JavaScript thread. Native Node.js bindings, libuv, the operating system, worker threads, child processes, or remote services may perform work elsewhere. Completion only becomes useful when control returns to JavaScript. Under load, the important questions are what is queued, what is bounded, what can be cancelled, and which resource saturates first.

## Example

```js
console.log('start');
process.nextTick(() => console.log('nextTick'));
queueMicrotask(() => console.log('microtask'));
Promise.resolve().then(() => console.log('promise'));
setTimeout(() => console.log('timer'), 0);
setImmediate(() => console.log('immediate'));
console.log('end');
```

The example is intentionally small enough to execute, but the production boundary is the important part: validate inputs, establish a deadline, propagate cancellation, classify failures, and release resources deterministically.

## Production Use

Use Promises for ordinary asynchronous composition, timers for deadlines or delayed work, and `setImmediate` only when yielding to a later turn is meaningful.

## Security

Never allow attacker-controlled recursion or unbounded microtask generation. It can monopolize the process without a classic infinite synchronous loop.

## Performance

Timers are threshold-based, not precise real-time schedulers. Event-loop delay, GC, CPU work, and operating-system scheduling add latency.

## Common Mistakes

- Using `process.nextTick` as a general task queue.
- Assuming a timer is a hard deadline without cancellation.
- Creating unbounded Promise fan-out.

## Debugging

Add timestamps, event-loop metrics, and queue counters; reduce the reproducer to one callback source at a time.

## Testing

Use fake timers only for application-level time behavior; keep integration tests with real event-loop turns for ordering-sensitive code.

## When Not to Use It

Do not build recurring durable jobs with in-process timers when process restarts or multiple replicas matter.

## Interview Questions

- How do nextTick and Promise microtasks differ?
- Can microtasks starve I/O?
- Why are timers not precise?

## Official References

- [nodejs.org](https://nodejs.org/api/)
- [nodejs.org](https://nodejs.org/en/about/previous-releases)
