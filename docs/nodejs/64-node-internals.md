---
title: Node.js Internals Mental Models
---

# Node.js Internals Mental Models

Internals are useful when they explain observable behavior, but private implementation is not an API contract.

```text
JavaScript source
      ↓
V8 parsing/execution
      ↓
Node JavaScript + native bindings
      ↓
libuv / platform integration
      ↓
OS kernel / system libraries
```

## Startup

Conceptually, the OS starts the executable, Node initializes platform/runtime state and V8, constructs the process environment, configures module loading, then evaluates the entrypoint. Flags, preload/import hooks, permission settings, environment files, and loaders can alter startup.

## Bindings

Built-in modules often combine JavaScript-facing APIs with native bindings into system libraries/kernel features. Therefore `await fs.readFile()` is not “V8 reading the disk”; Node coordinates an operation whose implementation may involve libuv and OS APIs.

## Event loop and handles

libuv tracks active handles/requests and event-loop work. A referenced server/socket/timer can keep the process alive. JavaScript callbacks execute when Node returns control to JS with an eligible completion/event.

## Thread pool

The libuv pool is shared by selected APIs; it is not the event loop and not a generic pool for arbitrary JS functions. Worker threads are a separate Node feature with their own isolates.

## Module loading

ESM and CommonJS have different loaders/evaluation semantics and caches. Package `type`, extensions, exports/imports, URL resolution, and interop determine runtime identity.

## Native addons

Native addons cross the JS/native boundary and can bypass many assumptions of pure JS code. Prefer Node-API for ABI stability and treat native code as security/memory-safety sensitive.

**Rule:** explain behavior using stable public contracts first; mention internals only to improve the model, and label version-sensitive details.
