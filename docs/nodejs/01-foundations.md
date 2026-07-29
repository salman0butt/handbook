---
title: Node.js Foundations
---

# Node.js Foundations

Node.js is a JavaScript runtime built around V8 plus Node-specific bindings and APIs for processes, networking, files, streams, cryptography, diagnostics, and more. It became popular for servers because a small number of processes can manage many concurrent I/O operations without creating one application thread per connection.

## CLI and REPL

```bash
node --version
node app.js
node --eval "console.log(process.pid)"
node
```

The REPL is useful for exploration; production behavior belongs in versioned files with tests and repeatable configuration.

## Basic project

```json
{
  "name": "orders-service",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "node src/server.js",
    "test": "node --test"
  },
  "engines": { "node": ">=24 <27" }
}
```

Use `package.json` to declare package identity, module semantics, commands, dependencies, exports, engines, and workspace structure. A lockfile records the concrete dependency graph.

## Process lifecycle

```text
OS starts process
    ↓
Node initializes runtime + V8
    ↓
loads entry module
    ↓
runs top-level JS
    ↓
keeps process alive while referenced work/resources remain
    ↓
exit
```

An HTTP server, referenced timer, open socket, or active handle can keep the process alive. Do not call `process.exit()` as a routine shutdown mechanism; it can terminate before buffered output and cleanup finish. Prefer setting exit status and closing resources.

## Globals

Important globals include `globalThis`, `process`, `Buffer`, timers, `queueMicrotask`, `URL`, `AbortController`, `fetch`, and other web-compatible APIs. Prefer explicit `node:` imports for core modules so dependencies are visible.

## Version management

Use an organization-wide policy plus `.nvmrc`, `.node-version`, `engines`, container tags, CI matrices, or an equivalent version manager. “Works on my machine” often means “different runtime, OpenSSL, architecture, native dependency, or environment.”

## Debugging

```bash
node --inspect src/server.js
node --trace-warnings src/server.js
```

Start with the failure class: syntax/module resolution, thrown error, blocked event loop, dependency latency, memory pressure, file/network permissions, or process lifecycle.

## Common mistakes

- treating Node as a framework;
- assuming async means parallel;
- running synchronous file or crypto work in request paths;
- relying on implicit module detection instead of `"type"`;
- reading unvalidated configuration everywhere;
- forgetting graceful shutdown and timeouts.
