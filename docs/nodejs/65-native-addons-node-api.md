---
title: Native Addons & Node-API
---

# Native Addons & Node-API

Native addons let Node call compiled native code. They are justified for existing native libraries, platform integration, or proven performance needs—not merely because C++ sounds faster.

## Node-API

Node-API (historically called N-API) provides an ABI-stable C interface intended to reduce recompilation across Node versions compared with direct dependence on V8 internals.

```text
JavaScript
   ↓
Node-API boundary
   ↓
C/C++ native library
   ↓
OS / device / optimized implementation
```

## ABI vs API

Source/API compatibility means code compiles against an interface. ABI compatibility concerns already-compiled binaries and calling/data conventions. Native package distribution must account for OS, architecture, libc/toolchain, and Node-API version support.

## Build/distribution

Native dependencies may use build tooling or prebuilt binaries. CI should test target architectures and container bases. Alpine/musl vs glibc differences matter.

## Performance

Crossing JS/native boundaries has overhead; copying/converting data can dominate. Batch work and benchmark end-to-end. Native code can also block the main thread if invoked synchronously for long computation.

## Security and reliability

Native bugs can crash the process or violate memory safety. Review ownership, supply chain, binary provenance, permissions, and fuzz/error handling more strictly than ordinary utility code.

## Prefer alternatives when

- a built-in Node API already performs the operation natively;
- WebAssembly provides enough portability/isolation for the task;
- worker threads solve JS CPU work without native maintenance;
- the performance problem has not been measured.
