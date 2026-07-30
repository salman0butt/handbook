---
title: 38–42 · Proxy, Reflect, Metaprogramming & Memory
description: JavaScript phases 38–42 with language semantics, runtime mental models, production trade-offs, and interview reasoning.
id: 38-42-proxy-reflect-metaprogramming-memory
---

# 38–42 · Proxy, Reflect, Metaprogramming & Memory

## 38 · Proxy

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

Proxy interposes on fundamental object operations through traps, but invariants still constrain observable behavior. Proxies enable virtualization and reactivity at a debugging and optimization cost.

### Mental model / runnable experiment

```js
const target = {count: 0}
const proxy = new Proxy(target, {
  set(t, key, value, receiver) {
    console.log("write", key, value)
    return Reflect.set(t, key, value, receiver)
  }
})
proxy.count++
```

### Coverage contract

- **target**
- **handler**
- **traps**
- **get**
- **set**
- **has**
- **ownKeys**
- **construct**
- **apply**
- **defineProperty**
- **deleteProperty**
- **invariants**
- **revocable proxies**
- **reactive-system use cases**
- **debugging/performance costs**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Proxy** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 39 · Reflect

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

Reflect exposes function forms of core internal operations, returning booleans or values with semantics that pair naturally with Proxy traps. Delegating a trap to Reflect usually preserves the target's default semantics.

### Mental model / runnable experiment

```js
// 39: Reflect
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **why Reflect exists**
- **relationship to Proxy**
- **method semantics**
- **Reflect.get**
- **Reflect.set**
- **Reflect.construct**
- **Reflect.apply**
- **ownKeys**
- **defineProperty**
- **deleteProperty**
- **getPrototypeOf**
- **setPrototypeOf**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Reflect** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 40 · Metaprogramming

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

Metaprogramming combines property descriptors, prototypes, symbols, proxies, and Reflect to observe or customize object behavior. Powerful mechanisms should be kept behind explicit boundaries because they can make code difficult to analyze statically and dynamically.

### Mental model / runnable experiment

```js
// 40: Metaprogramming
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **dynamic property access**
- **symbols**
- **descriptors**
- **prototype inspection**
- **proxies**
- **Reflect**
- **decorators only if part of current standard; otherwise label proposal state correctly**
- **runtime metadata patterns**
- **DSL construction risks**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Metaprogramming** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 41 · WeakRef and FinalizationRegistry

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

WeakRef and FinalizationRegistry expose limited reachability-related behavior while preserving garbage collector freedom. Finalizers are nondeterministic and must never be the correctness mechanism for required cleanup.

### Mental model / runnable experiment

```js
const cache = new Map() // use ordinary ownership first
// WeakRef is for specialized caches where values may disappear nondeterministically.
```

### Coverage contract

- **garbage collection assumptions**
- **weak references**
- **finalizers**
- **nondeterminism**
- **cache scenarios**
- **why cleanup must not depend on GC timing**
- **when these APIs are inappropriate**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **WeakRef and FinalizationRegistry** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 42 · Memory Mental Model

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

Stack and heap are useful implementation mental models, not language guarantees. Reachability is the durable concept: closures, listeners, timers, caches, and DOM references can keep object graphs alive.

### Mental model / runnable experiment

```text
binding ──→ object ──→ referenced objects
                 ↑
listener/timer/cache may retain the graph
```

### Coverage contract

- **stack vs heap as useful implementation mental model**
- **primitives**
- **objects**
- **references**
- **reachability**
- **garbage collection**
- **closures retaining objects**
- **leaks**
- **detached DOM references**
- **timers/listeners**
- **caches**
- **weak references**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Memory Mental Model** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
