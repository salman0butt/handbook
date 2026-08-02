---
title: Runtime Lifecycle, Process, Signals and Exit
description: A Node service has a startup phase, steady-state work, degradation behavior, and a bounded shutdown sequence controlled through the process lifecycle.
---

# Runtime Lifecycle, Process, Signals and Exit

## Concept

A Node service has a startup phase, steady-state work, degradation behavior, and a bounded shutdown sequence controlled through the process lifecycle.

## Why It Exists

Production reliability depends on rejecting invalid configuration before serving traffic, handling signals, draining work, and terminating when state is no longer trustworthy.

## Mental Model

```mermaid
flowchart LR
  A["Start"]
  B["Validate and initialize"]
  C["Serve"]
  D["Drain and exit"]
  A --> B
  B --> C
  C --> D
```

Treat every arrow as a boundary with a cost, ownership rule, cancellation behavior, and failure mode. Node.js is effective when those boundaries are explicit instead of hidden behind framework defaults.

## How It Works

The JavaScript callback runs on the main JavaScript thread. Native Node.js bindings, libuv, the operating system, worker threads, child processes, or remote services may perform work elsewhere. Completion only becomes useful when control returns to JavaScript. Under load, the important questions are what is queued, what is bounded, what can be cancelled, and which resource saturates first.

## Example

```js
import process from 'node:process';

let closing = false;
async function shutdown(signal) {
  if (closing) return;
  closing = true;
  console.log({signal, message: 'draining'});
  const timer = setTimeout(() => process.exit(1), 10_000);
  timer.unref();
  try {
    await Promise.resolve(); // close server, pools and consumers here
    process.exitCode = 0;
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
process.once('SIGTERM', shutdown);
process.once('SIGINT', shutdown);
```

The example is intentionally small enough to execute, but the production boundary is the important part: validate inputs, establish a deadline, propagate cancellation, classify failures, and release resources deterministically.

## Production Use

Initialize configuration, telemetry, database pools, queues, and HTTP listeners in dependency order. Shut them down in reverse order while rejecting new work.

## Security

Do not log secrets or trust environment variables without validation. Treat signal handling and process controls as privileged operational boundaries.

## Performance

A process that never exits because of open handles blocks deployments. A process that exits before draining corrupts user workflows. Use an explicit shutdown budget.

## Common Mistakes

- Calling `process.exit()` immediately inside normal application code.
- Continuing after an uncaught programmer error.
- Starting the HTTP listener before migrations or critical dependencies are ready.

## Debugging

Inspect exit codes, diagnostic reports, active handles, deployment events, and orchestrator termination logs.

## Testing

Spawn the service in tests, send signals, issue in-flight requests, and verify new traffic is rejected while existing work completes.

## When Not to Use It

Do not attempt graceful continuation after memory corruption, violated invariants, or an unknown programmer error; terminate and restart under a supervisor.

## Interview Questions

- When should a Node process terminate?
- What is the difference between readiness and liveness?
- How do you design a bounded graceful shutdown?

## Official References

- [nodejs.org](https://nodejs.org/api/)
- [nodejs.org](https://nodejs.org/en/about/previous-releases)
