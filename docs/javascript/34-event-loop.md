---
title: 34 — Event Loop and Job Queues
---

# 34 — Event Loop and Job Queues

ECMAScript defines Jobs used by Promise/module semantics. The **host environment** defines the larger event loop that integrates scripts, timers, I/O, UI events, rendering, and ECMAScript Jobs. Do not describe the browser event loop as if all of it were ECMA-262.

```text
call stack / running JS
        ↓ starts host work
browser/host operation
        ↓ completion scheduling
host task queue OR microtask/job checkpoint
        ↓
callback / ECMAScript Job
        ↓
call stack / running JS
```

## Browser mental model

A simplified browser turn looks like:

```text
1. take a runnable task
2. run JavaScript until the stack becomes empty
3. perform a microtask checkpoint
4. browser may update rendering
5. continue with later tasks
```

This is a teaching model. HTML defines browser event-loop/task/microtask integration in detail; ECMAScript defines Promise Jobs and host hooks.

## Prediction exercise

```js
console.log('A');

setTimeout(() => console.log('B'), 0);

Promise.resolve().then(() => console.log('C'));

console.log('D');
```

Typical browser output:

```text
A
D
C
B
```

Why:

1. The initial script task runs synchronously: `A`.
2. `setTimeout` asks the browser host to schedule timer work; its callback cannot run now.
3. `.then` schedules a Promise reaction Job after the current synchronous work completes.
4. `D` logs before the initial script finishes.
5. At the microtask checkpoint, the Promise job logs `C`.
6. A later timer task logs `B`.

A `0` timeout means “eligible after at least the host's timing/scheduling constraints,” not “run immediately in 0 ms.”

## Microtasks can schedule microtasks

```js
queueMicrotask(() => {
  console.log(1);
  queueMicrotask(() => console.log(3));
});
queueMicrotask(() => console.log(2));
```

The microtask checkpoint continues draining newly queued microtasks before the host proceeds to later tasks/rendering (subject to host algorithms). This can create starvation if code recursively queues microtasks forever.

`queueMicrotask` is a host-exposed API in browsers and modern runtimes, not an ECMA-262 language built-in, even though it schedules work into the host's microtask mechanism that cooperates with Promise Jobs.

## Timers and I/O

`setTimeout`/`setInterval` are host APIs. Network events, user events, message events, filesystem callbacks, and other I/O also belong to their host runtime. Different hosts can have different phases/priorities while still implementing ECMAScript correctly.

For Node-specific event-loop phases, `process.nextTick`, libuv behavior, and server I/O details, use the Node.js handbook rather than assuming browser rules.

## Rendering

Browsers typically render between tasks when appropriate, after microtasks are processed. Long synchronous JavaScript and microtask starvation can delay input handling and rendering.

```js
button.addEventListener('click', () => {
  const end = performance.now() + 300;
  while (performance.now() < end) {}
});
```

The problem is not “JavaScript is slow”; the handler monopolizes the main thread. Break work up, move suitable CPU-heavy work to a Worker, or redesign the algorithm.

## Promise jobs vs host queues

ECMAScript Promise reactions become Jobs. `HostEnqueuePromiseJob` and related host hooks let the embedding decide integration details. This is the correct boundary:

```text
ECMAScript: what Promise Jobs mean and when language algorithms enqueue them
Host: how/when those jobs are serviced relative to tasks, rendering, I/O, timers
```

## More ordering exercises

### Exercise 1

```js
console.log(1);
Promise.resolve().then(() => console.log(2));
queueMicrotask(() => console.log(3));
console.log(4);
```

Typical browser result: `1, 4, 2, 3` because the Promise reaction is enqueued before the explicit microtask.

### Exercise 2

```js
setTimeout(() => {
  console.log('timer');
  Promise.resolve().then(() => console.log('inside'));
}, 0);

Promise.resolve().then(() => console.log('outer'));
```

Typical browser result: `outer`, then `timer`, then `inside`. After the timer callback completes, the microtask checkpoint runs its Promise reaction before a later task.

### Exercise 3: starvation

```js
function spin() {
  queueMicrotask(spin);
}
spin();
```

This can prevent the browser from reaching rendering/later tasks. “Async” does not automatically mean fair scheduling.

## Interview checks

1. Which part is ECMAScript: Promise Jobs or browser timer queues?
2. Why does a resolved Promise callback normally run before a zero-delay timer callback created in the same script turn?
3. Can microtasks starve rendering?
4. Does `setTimeout(fn, 0)` guarantee immediate execution?
5. Why can JavaScript programs have race conditions despite run-to-completion of individual jobs/tasks?

Related: [Promises](./32-promises.md), [Browser timers](./browser-javascript.md#59--browser-timers-and-scheduling), [Jobs internals](./internals-and-specification.md#68--jobs-and-promise-jobs).
