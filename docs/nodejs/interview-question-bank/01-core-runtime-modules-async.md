---
title: Q001–Q064 — Core Runtime, Modules & Async
---

# Q001–Q064 — Core Runtime, Modules & Async

## Important question cards

### Q001. What is Node.js, and what is it not?

**Expected answer:** Node.js is a JavaScript runtime built around V8 plus Node APIs/bindings for I/O, processes, networking, streams, crypto, diagnostics, and more. It is not the JavaScript language, npm, or a web framework.

**Senior answer:** distinguish JS semantics, V8 execution/GC, Node host APIs, libuv async/event-loop integration, OS/kernel resources, npm package management, and frameworks. Explain why debugging requires knowing which layer owns a failure.

**Weak answer:** “Node.js is JavaScript on the backend.”

**Follow-up:** Where does an asynchronous file read actually execute?

### Q002. Why is “Node is single-threaded” misleading?

**Expected answer:** JavaScript callbacks commonly execute on one main JS thread, but Node can use OS async facilities, a libuv worker pool, worker threads, child processes, and native code.

**Senior answer:** explain how this model supports concurrent I/O yet still makes main-thread CPU blocking dangerous; name capacity limits besides threads.

**Weak answer:** “Node only has one thread.”

**Follow-up:** Which solution would you choose for CPU-bound JavaScript and why?

### Q003. What actually happens when you `await` a Promise?

**Expected answer:** the async function suspends; the process/main thread is free to execute other work; after settlement the continuation is scheduled as a microtask and later resumes on the JS thread.

**Senior answer:** distinguish the Promise control-flow layer from the underlying resource that completes the operation, and mention cancellation/ownership.

**Weak answer:** “Node creates another thread and waits.”

**Follow-up:** Does `await cpuHeavyFunction()` make CPU work nonblocking?

### Q004. Why can microtasks starve I/O?

**Expected answer:** repeatedly scheduling microtasks can keep draining microtask work before the event loop advances to other callbacks.

**Senior answer:** include recursive `process.nextTick`/microtask risks, fairness, tail latency, and that business correctness should not depend on incidental queue ordering.

**Weak answer:** “Microtasks are faster than macrotasks.”

**Follow-up:** How would you deliberately yield to later event-loop work?

## Questions

**Q005.** How is JavaScript the language different from Node.js the runtime?

**Q006.** What responsibilities belong to V8 in a Node process?

**Q007.** What responsibilities does libuv provide conceptually?

**Q008.** What responsibilities remain with the operating system/kernel?

**Q009.** Why did Node's asynchronous I/O model become attractive for servers?

**Q010.** When is Node a poor default choice for a workload?

**Q011.** What happens from `node app.js` until top-level code begins executing?

**Q012.** What can keep a Node process alive after the entry module finishes?

**Q013.** What information does `process.argv` contain, and why must it be validated?

**Q014.** Why should `process.env` be treated as untrusted runtime input?

**Q015.** What is the difference between `process.cwd()` and a module's directory?

**Q016.** Why is `process.chdir()` dangerous in shared application/library code?

**Q017.** What is an exit code, and when should a service set `process.exitCode` instead of calling `process.exit()`?

**Q018.** What is the difference between `beforeExit` and `exit`?

**Q019.** How should a server handle `SIGTERM`?

**Q020.** Why is continuing after `uncaughtException` often unsafe?

**Q021.** How should unhandled Promise rejections influence application design?

**Q022.** Why are stdin/stdout/stderr streams rather than ordinary strings/files?

**Q023.** What is `globalThis`, and how is it different from Node-specific globals?

**Q024.** Why is `Buffer` Node-specific even though it relates to `Uint8Array`?

**Q025.** Which browser-compatible Web APIs are available in modern Node, and what portability limits remain?

**Q026.** What is CommonJS and why does it still matter?

**Q027.** What is ECMAScript Modules (ESM) and why is it the long-term standard direction?

**Q028.** How does the nearest `package.json` `"type"` affect `.js` files?

**Q029.** What are `.mjs` and `.cjs` for?

**Q030.** Why should a production package avoid relying on ambiguous module syntax detection?

**Q031.** What is the difference between `exports.foo = x` and `module.exports = x`?

**Q032.** How does `import()` differ from static `import`?

**Q033.** What does top-level `await` change about ESM evaluation/dependency graphs?

**Q034.** What are `import.meta.url`, `import.meta.dirname`, and `import.meta.filename` used for?

**Q035.** How do module caches affect singleton state and tests?

**Q036.** Why can circular dependencies expose partially initialized state?

**Q037.** What does a package `exports` map control?

**Q038.** What are conditional exports, and how can they become a breaking change?

**Q039.** What is the purpose of package `imports` aliases such as `#config`?

**Q040.** What is the dual-package hazard when publishing ESM and CJS entry points?

**Q041.** How would you migrate a large CommonJS application to ESM safely?

**Q042.** What is npm's role compared with Node's role?

**Q043.** What belongs in `dependencies` vs `devDependencies`?

**Q044.** What problem do `peerDependencies` model?

**Q045.** What are `optionalDependencies`, and what failure semantics should consumers expect?

**Q046.** Why is `npm ci` generally preferred in CI/container builds?

**Q047.** What does a lockfile guarantee, and what does it not guarantee?

**Q048.** Explain caret, tilde, and exact semantic-version ranges.

**Q049.** What are npm workspaces useful for?

**Q050.** Why are npm lifecycle scripts a supply-chain concern?

**Q051.** What does the event loop do?

**Q052.** What do timers, poll, check, and close phases mean as a mental model?

**Q053.** Why is memorizing one event-loop diagram insufficient for correct ordering reasoning?

**Q054.** What is the difference between `setTimeout(fn, 0)` and `setImmediate(fn)`?

**Q055.** How does `process.nextTick()` differ from ordinary Promise microtasks?

**Q056.** What does `queueMicrotask()` provide?

**Q057.** What is event-loop lag and how does it affect tail latency?

**Q058.** Give three examples of synchronous work that can block a Node HTTP process.

**Q059.** What is the difference between an asynchronous operation and parallel execution?

**Q060.** Which categories of Node API may use libuv's shared worker pool?

**Q061.** Why can worker-pool saturation make unrelated operations slow?

**Q062.** What does `UV_THREADPOOL_SIZE` change, and why is increasing it not a universal fix?

**Q063.** Compare callbacks, Promises, and `async`/`await` as control-flow models.

**Q064.** What are `Promise.all`, `allSettled`, `race`, and `any`, and what cancellation misconception applies to them?
