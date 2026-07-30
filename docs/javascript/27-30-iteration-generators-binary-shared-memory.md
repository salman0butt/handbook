---
title: 27–30 · Iteration, Generators & Binary Memory
description: JavaScript handbook chapters 27–30.
sidebar_position: 9
id: 27-30-iteration-generators-binary-shared-memory
---

# 27–30 · Iteration, Generators & Binary Memory

Use the numbered sections as the learning path. Each section keeps the language/host boundary explicit and links syntax to runtime behavior, production concerns, and interview reasoning.

## 27 · Iterators and Iterables

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

An iterable can produce an iterator; an iterator produces `{value, done}` records. `for...of`, spread, array destructuring, and many built-ins consume this protocol, including iterator closing on abrupt exit. Iterator helpers provide lazy pipelines.

### Mental model / runnable experiment

```js
const lazy = Iterator.from([1, 2, 3, 4])
  .filter(x => x % 2 === 0)
  .map(x => x * 10)
console.log(lazy.toArray())
```

### Coverage contract

- **iterable protocol**
- **iterator protocol**
- **`Symbol.iterator`**
- **built-in iterables**
- **custom iterables**
- **iterator closing**
- **spread**
- **destructuring**
- **`for...of`**
- **Iterator helpers where standardized**
- **lazy computation**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Iterators and Iterables** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.

## 28 · Generators

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

Generator functions create resumable generator objects. `yield` suspends execution, callers resume it through `next`/`throw`/`return`, and `yield*` delegates while preserving iterator protocol behavior.

### Mental model / runnable experiment

```js
function* ids() {
  let id = 1
  while (true) yield id++
}
const it = ids()
console.log(it.next()) // {value: 1, done: false}
```

### Coverage contract

- **generator functions**
- **`function*`**
- **`yield`**
- **`yield*`**
- **generator objects**
- **bidirectional communication**
- **delegation**
- **lazy sequences**
- **error handling**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Generators** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.

## 29 · Typed Arrays and Binary Data

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

ArrayBuffer owns bytes; typed arrays provide typed indexed views; DataView provides explicit typed reads/writes with controllable endianness. SharedArrayBuffer can expose the same memory to multiple agents.

### Mental model / runnable experiment

```js
const buffer = new ArrayBuffer(4)
const view = new DataView(buffer)
view.setUint16(0, 0x1234, false) // big-endian
console.log(view.getUint8(0).toString(16)) // "12"
```

### Coverage contract

- **ArrayBuffer**
- **SharedArrayBuffer**
- **DataView**
- **typed arrays**
- **byte offsets**
- **byte lengths**
- **endianness**
- **numeric typed-array variants**
- **Float16 support if standardized/current**
- **binary protocols**
- **buffer slicing**
- **memory sharing**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Typed Arrays and Binary Data** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.

## 30 · Atomics and Shared Memory

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

Shared memory introduces true data races even though ordinary JavaScript execution is often single-threaded per agent. Atomics establish synchronized operations; wait/notify coordinates agents. Use message passing unless shared memory measurably solves a real problem.

### Mental model / runnable experiment

```js
// Host workers can share this buffer; Atomics coordinates accesses.
const shared = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT)
const cell = new Int32Array(shared)
Atomics.store(cell, 0, 1)
console.log(Atomics.add(cell, 0, 2)) // previous value: 1
console.log(cell[0])                 // 3
```

### Coverage contract

- **SharedArrayBuffer**
- **Atomics**
- **memory ordering mental model**
- **wait/notify**
- **worker communication**
- **data races**
- **synchronization**
- **when NOT to use shared memory**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Atomics and Shared Memory** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
