---
title: Start Here
---

# Start Here

## Prerequisites

You should be comfortable with JavaScript values, functions, objects, classes, modules, Promises, `async`/`await`, exceptions, basic HTTP, and a terminal. TypeScript knowledge helps but is not required until the integration chapter.

## Node.js vs browser JavaScript

JavaScript is the language. Browsers and Node.js are different host environments.

| Concern | Browser | Node.js |
|---|---|---|
| UI | DOM, CSSOM | no DOM by default |
| I/O | fetch, storage, browser APIs | files, sockets, processes, streams, crypto |
| module host | browser ESM/bundlers | ESM + CommonJS + package resolution |
| process | page/tab lifecycle | OS process lifecycle |
| permissions | browser security model | OS permissions + optional Node Permission Model |
| globals | `window`, DOM globals | `process`, `Buffer`, Node/web-compatible globals |

Modern Node intentionally implements many web-platform APIs—`fetch`, `Request`, `Response`, `Headers`, `URL`, `AbortController`, Web Streams—but identical API shapes do not imply an identical runtime environment.

## Runtime ownership

```text
Your JS
  │
  ├─ pure computation ──────────────→ V8 / main JS thread
  │
  ├─ socket request ────────────────→ Node → libuv/OS readiness
  │
  ├─ selected fs/crypto/DNS work ──→ Node → libuv worker pool
  │
  ├─ Worker(...) ──────────────────→ another JS isolate/thread
  │
  └─ spawn(...) ───────────────────→ another OS process
```

The correct optimization depends on where the work actually happens. A worker thread does not make a slow database faster. Increasing `UV_THREADPOOL_SIZE` does not accelerate a CPU loop written in JavaScript. Adding Promise concurrency does not create CPU parallelism.

## How to use examples

Examples use ESM by default and built-in Node modules through the `node:` prefix:

```js
import { readFile } from 'node:fs/promises';

const text = await readFile('notes.txt', 'utf8');
console.log(text);
```

When CommonJS behavior is important, examples use `require()` explicitly.

## First exercise

Create a project with `"type": "module"`, print `process.version`, `process.pid`, `process.cwd()`, and `process.memoryUsage()`, then read a file asynchronously. Before running it, predict what executes on the JS thread and what work is delegated.
