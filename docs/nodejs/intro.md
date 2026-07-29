---
title: Node.js Developer Handbook
description: A production-focused Node.js handbook from JavaScript foundations to runtime internals, distributed systems, platform engineering, and interview mastery.
slug: /nodejs/intro
---

# Node.js Developer Handbook

This handbook teaches Node.js as a **runtime and backend engineering system**, not as a collection of APIs. The goal is to move from JavaScript familiarity to the ability to reason about execution, I/O, concurrency, memory, failure, security, production operations, and architecture.

> **Baseline — 30 July 2026:** ✅ Node.js **26.x** is the Current line, ✅ **24.x “Krypton”** is Active LTS, and ✅ **22.x “Jod”** is Maintenance LTS. The Node.js releases page reported v26.5.0 as the latest Current release and v24.18.0 as the latest LTS release when this handbook was finalized. Production services should normally run an LTS line. Version-sensitive behavior is labelled explicitly.

## The core mental model

```text
JavaScript source
        ↓
Node.js runtime
        ↓
V8 parses and executes JavaScript
        ↓
Node APIs expose runtime capabilities
        ↓
libuv coordinates event loop + selected async work
        ↓
OS / kernel handles sockets, files, processes, timers
```

Do not collapse these layers into “Node is single-threaded.” JavaScript callbacks normally execute on one main JavaScript thread, while the runtime may also use OS asynchronous facilities, libuv's worker pool, worker threads, child processes, native code, and external services.

```text
single JavaScript thread
        ≠
single-threaded runtime
```

## What you will learn to reason about

For each major concept, ask:

1. **What is executing?** JavaScript, native runtime code, a worker, a child process, or another service?
2. **What resource is involved?** CPU, memory, file descriptors, sockets, DB connections, thread-pool slots?
3. **What is waiting?** The main thread, a Promise continuation, an OS operation, a queue consumer?
4. **What can block?** Synchronous APIs, CPU loops, native work, locks, saturated pools, downstream dependencies?
5. **What can fail?** Inputs, process lifecycle, network, DNS, storage, cancellation, timeouts, retries?
6. **What changes under load?** Queue depth, latency, memory, backpressure, pool saturation, retry volume, connection count?

## Status legend

- ✅ stable / recommended where appropriate
- ⚠️ deprecated, legacy, or migration-only
- 🧪 experimental, release-candidate, or version-sensitive
- ⛔ intentionally excluded from stable guidance

## Learning path

```text
JavaScript developer
        ↓
Node.js beginner
        ↓
productive backend developer
        ↓
advanced Node.js developer
        ↓
senior backend engineer
        ↓
distributed-systems / platform engineer
        ↓
staff-level runtime + architecture reasoning
        ↓
production + interview mastery
```

Use the handbook sequentially the first time. Later, jump directly to event-loop reasoning, streams, HTTP, workers, diagnostics, security, resilience, architecture, projects, or interview drills as a professional reference.

## Primary current sources

Version-sensitive statements are checked against the [Node.js release schedule](https://github.com/nodejs/Release), [Node.js API documentation](https://nodejs.org/api/), [npm documentation](https://docs.npmjs.com/), and—where runtime boundaries matter—V8, libuv, WHATWG, TC39, and OpenSSL documentation.
