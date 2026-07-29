---
title: Timers & Scheduling
---

# Timers & Scheduling

Timers express eligibility, not real-time guarantees. `setTimeout(fn, 100)` means “do not run before roughly this threshold,” then the callback still waits for event-loop availability.

## Scheduling families

| API | Queue/intent | Typical use |
|---|---|---|
| `process.nextTick()` | Node-specific next-tick queue | compatibility/small deferred work; avoid recursion |
| `queueMicrotask()` | JS microtask | post-stack microtask semantics |
| Promise reaction | JS microtask | async continuation |
| `setImmediate()` | check phase | yield until later loop turn / after I/O |
| `setTimeout()` | timers | delay/deadline scheduling |

Do not build correctness on accidental ordering between timers and immediates from unrelated contexts.

## Drift

```js
setInterval(async () => {
  await expensiveJob();
}, 1000);
```

If the job lasts longer than the interval, work may overlap or drift depending on design. For periodic jobs, decide explicitly whether you need fixed-rate, fixed-delay, no-overlap, distributed ownership, persistence, and missed-run semantics.

A safer in-process recursive delay:

```js
async function loop() {
  try { await runOnce(); }
  finally { setTimeout(loop, 1_000).unref(); }
}
loop();
```

## `ref()` / `unref()`

A referenced timer can keep the process alive. `unref()` allows the process to exit if nothing else remains. This changes lifecycle, not callback priority.

## Production rule

In-process timers are good for local ephemeral maintenance. They are poor substitutes for durable schedulers when a task must survive crashes, deployments, horizontal scaling, or leader changes.
