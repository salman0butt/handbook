---
title: 36–37 · Modules & Explicit Resource Management
description: JavaScript phases 36–37 with language semantics, runtime mental models, production trade-offs, and interview reasoning.
id: 36-37-modules-resource-management
---

# 36–37 · Modules & Explicit Resource Management

## 36 · Modules

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

ES modules form a static dependency graph with live bindings, linking, instantiation, and evaluation phases. Imports are aliases to exporter bindings, not copies. Dynamic import adds asynchronous graph loading; top-level await can make evaluation asynchronous.

### Mental model / runnable experiment

```text
entry
 ├── module A
 │    └── module C
 └── module B
      └── module C
```

### Coverage contract

- **script vs module**
- **ESM**
- **import**
- **export**
- **named exports**
- **default exports**
- **re-exports**
- **namespace imports**
- **module namespace objects**
- **live bindings**
- **static module graph**
- **cyclic dependencies**
- **module evaluation**
- **strict mode**
- **dynamic import**
- **top-level await**
- **import attributes where standardized**
- **browser module loading**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Modules** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 37 · Explicit Resource Management

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

Explicit Resource Management is finished Stage 4 after the ES2026 snapshot and is integrated into the current living draft. `using`/`await using` plus disposable stacks make deterministic cleanup part of control flow, with suppression semantics when cleanup itself fails.

### Mental model / runnable experiment

```js
// Current living standard / Stage 4; check target support.
using stack = new DisposableStack()
stack.defer(() => console.log("cleanup"))
```

### Coverage contract

- **`using`**
- **`await using`**
- **Symbol.dispose**
- **Symbol.asyncDispose**
- **DisposableStack**
- **AsyncDisposableStack**
- **SuppressedError**
- **deterministic cleanup**
- **async cleanup**
- **error behavior**
- **real use cases**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Explicit Resource Management** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
