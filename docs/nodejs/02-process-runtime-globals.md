---
title: Process, Runtime & Global APIs
---

# Process, Runtime & Global APIs

`process` represents the current OS process and is one of the clearest boundaries between JavaScript the language and Node.js the host runtime.

```js
console.log({
  pid: process.pid,
  argv: process.argv,
  cwd: process.cwd(),
  version: process.version,
  platform: process.platform,
});
```

## Arguments, environment, working directory

`process.argv` is untrusted CLI input. `process.env` is runtime input whose values are strings (or absent); parse and validate them at startup. `process.cwd()` is not the same thing as the module directory. `process.chdir()` mutates process-global state and is therefore risky in libraries and concurrent application code.

## Exit codes and lifecycle events

Set `process.exitCode = 1` when you want normal event-loop draining. `process.exit(1)` terminates immediately and may cut off writes or cleanup.

`beforeExit` fires when Node has no more scheduled work and can be extended by scheduling more work. `exit` is synchronous-only: asynchronous work scheduled there will not finish.

## Signals

Unix/container orchestrators commonly use `SIGTERM`; terminals commonly produce `SIGINT`. Register handlers only if you actually coordinate shutdown.

```js
process.once('SIGTERM', () => shutdown('SIGTERM'));
process.once('SIGINT', () => shutdown('SIGINT'));
```

Installing a signal handler changes default termination behavior, so your handler must eventually allow or force exit.

## Process-level failures

`uncaughtException` means normal control flow failed. Use it for last-resort synchronous logging/telemetry, then terminate and restart; continuing in an unknown state is dangerous. Treat unhandled Promise rejections as defects and make ownership explicit rather than relying on global handlers.

## Standard streams

`process.stdin`, `stdout`, and `stderr` are streams. CLI tools should send normal machine/user output to stdout and diagnostics to stderr so shell pipelines remain composable.

## Global/web-compatible APIs

`globalThis` is portable JavaScript. `Buffer` is Node-specific binary infrastructure layered on typed-array concepts. Modern Node also exposes web-compatible APIs such as `structuredClone`, `URL`, `URLSearchParams`, `AbortController`, `fetch`, `Blob`, and Web Streams.

**Design rule:** imported dependencies are easier to test, mock, reason about, and secure than hidden process-global access.
