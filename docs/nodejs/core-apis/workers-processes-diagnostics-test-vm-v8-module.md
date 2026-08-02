---
title: Core APIs: Workers, Processes, Diagnostics, Tests, VM, V8 and Module
description: Advanced core modules provide parallel execution, subprocess isolation, diagnostics, testing, module hooks, VM contexts, and runtime introspection.
---

# Core APIs: Workers, Processes, Diagnostics, Tests, VM, V8 and Module

## Concept

Advanced core modules provide parallel execution, subprocess isolation, diagnostics, testing, module hooks, VM contexts, and runtime introspection.

## Why It Exists

Platform and library engineers need to know when these APIs solve a real boundary and when they expose unstable or unsafe complexity.

## Mental Model

```mermaid
flowchart LR
  A["Main process"]
  B["Advanced core API"]
  C["Isolated or instrumented work"]
  D["Result and telemetry"]
  A --> B
  B --> C
  C --> D
```

Treat every arrow as a boundary with a cost, ownership rule, cancellation behavior, and failure mode. Node.js is effective when those boundaries are explicit instead of hidden behind framework defaults.

## How It Works

The JavaScript callback runs on the main JavaScript thread. Native Node.js bindings, libuv, the operating system, worker threads, child processes, or remote services may perform work elsewhere. Completion only becomes useful when control returns to JavaScript. Under load, the important questions are what is queued, what is bounded, what can be cancelled, and which resource saturates first.

## Example

```js
import { Worker } from 'node:worker_threads';

const worker = new Worker(
  `const {parentPort} = require('node:worker_threads');
   parentPort.postMessage(21 * 2);`,
  {eval: true},
);
worker.once('message', (value) => console.log(value));
worker.once('error', console.error);
```

The example is intentionally small enough to execute, but the production boundary is the important part: validate inputs, establish a deadline, propagate cancellation, classify failures, and release resources deterministically.

## Production Use

Use workers for measured CPU hotspots, child processes for executable or process isolation, diagnostics for observability, and `node:test` for dependency-light testing.

## Security

`node:vm` is not a security sandbox. Module hooks and native/V8 APIs expand the trusted computing base. Restrict untrusted code at an OS or stronger isolation boundary.

## Performance

Workers have startup, memory, serialization, transfer, and coordination costs. Instrumentation can also add overhead.

## Common Mistakes

- Creating a worker per request.
- Using eval workers with untrusted strings.
- Depending on V8 implementation details as application contracts.

## Debugging

Collect worker lifecycle, queue wait, CPU/heap profiles, diagnostic reports, test runner output, and module-resolution traces.

## Testing

Test worker crashes, transfer ownership, cancellation, subprocess signals, instrumentation failure, and runtime-version compatibility.

## When Not to Use It

Do not use VM contexts to execute hostile tenant code in the application process.

## Interview Questions

- Worker thread or child process: how do you choose?
- Why is node:vm not a sandbox?
- What is the benefit of the built-in test runner?

## Official References

- [nodejs.org](https://nodejs.org/api/)
- [nodejs.org](https://nodejs.org/en/about/previous-releases)
