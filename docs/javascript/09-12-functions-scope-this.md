---
title: 09–12 · Functions, Scope & `this`
description: JavaScript handbook chapters 09–12.
sidebar_position: 6
id: 09-12-functions-scope-this
---

# 09–12 · Functions, Scope & `this`

Use the numbered sections as the learning path. Each section keeps the language/host boundary explicit and links syntax to runtime behavior, production concerns, and interview reasoning.

## 09 · Functions Fundamentals

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

Functions are first-class callable objects. Declarations, expressions, arrows, parameters, rest/spread, recursion, callbacks, and higher-order functions are different surfaces over the same core idea: executable behavior can be created, passed, stored, and invoked.

### Mental model / runnable experiment

```js
// 09: Functions Fundamentals
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **declarations**
- **expressions**
- **anonymous functions**
- **named function expressions**
- **arrow functions**
- **calling functions**
- **return values**
- **parameters**
- **arguments**
- **default parameters**
- **rest parameters**
- **spread arguments**
- **`arguments`**
- **recursive functions**
- **nested functions**
- **first-class functions**
- **higher-order functions**
- **callbacks**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Functions Fundamentals** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.

## 10 · Function Internals

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

A function closes over its lexical environment when created. Calls create execution contexts and environment records; closures retain reachable bindings, not frozen copies of values.

### Mental model / runnable experiment

```text
global lexical environment
        ↓
outer function environment
        ↓
inner function environment
        ↓
closure retains reachable bindings
```

### Coverage contract

- **call stack**
- **execution contexts**
- **lexical environments**
- **environment records**
- **scope chain**
- **closures**
- **function creation**
- **function invocation**
- **parameter environments**
- **recursion**
- **stack overflow**
- **tail-position concepts**
- **pure vs impure functions**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Function Internals** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.

## 11 · `this`

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

For ordinary functions, `this` is primarily determined by invocation form. Method calls, explicit binding, constructor calls, and plain calls differ; arrow functions are the exception because they capture lexical `this` and have no own `this` binding.

### Mental model / runnable experiment

```js
const user = { name: "Ada", show() { return this.name } }
console.log(user.show())
const detached = user.show
console.log(detached.call({name: "Grace"}))
```

### Coverage contract

- **default binding**
- **implicit method call**
- **explicit binding**
- **constructor invocation**
- **arrow functions**
- **lexical `this`**
- **class methods**
- **event handlers**
- **callbacks**
- **detached methods**
- **strict vs sloppy mode**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **`this`** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.

## 12 · call, apply, bind, and new

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

`call`, `apply`, and `bind` control receiver and arguments for callable objects. Constructor invocation with `new` creates/initializes an object through `[[Construct]]`, prototype linkage, and constructor return rules; `new.target` exposes how construction occurred.

### Mental model / runnable experiment

```js
// 12: call, apply, bind, and new
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **`Function.prototype.call`**
- **`apply`**
- **`bind`**
- **partial application**
- **bound functions**
- **constructor behavior of bound functions**
- **`new`**
- **constructor functions**
- **`new.target`**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **call, apply, bind, and new** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
