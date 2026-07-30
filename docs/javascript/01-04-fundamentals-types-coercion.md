---
title: 01–04 · Fundamentals, Variables, Types & Coercion
description: JavaScript phases 01–04 with language semantics, runtime mental models, production trade-offs, and interview reasoning.
id: 01-04-fundamentals-types-coercion
---

# 01–04 · Fundamentals, Variables, Types & Coercion

## 01 · JavaScript Fundamentals

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

JavaScript source is parsed according to lexical and syntactic grammars. Statements control execution; expressions produce values. Semicolon insertion is a grammar repair mechanism, not a formatter, and module code is always strict.

### Mental model / runnable experiment

```js
// 01: JavaScript Fundamentals
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **syntax**
- **statements**
- **expressions**
- **comments**
- **semicolons**
- **Automatic Semicolon Insertion**
- **whitespace**
- **identifiers**
- **Unicode identifiers**
- **keywords**
- **reserved words**
- **literals**
- **`"use strict"`**
- **script vs module code**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **JavaScript Fundamentals** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 02 · Variables and Declarations

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

Bindings are names associated with values through environment records. `let` and `const` are block-scoped lexical declarations; `var` is function/global scoped. All declarations participate in instantiation before execution, but lexical bindings stay uninitialized in the TDZ until evaluation reaches the declaration.

### Mental model / runnable experiment

```js
console.log(typeof x) // "undefined" because `var x` is initialized during instantiation
var x = 1

// console.log(y) // ReferenceError: y is in the TDZ
let y = 2
```

### Coverage contract

- **`let`**
- **`const`**
- **`var`**
- **declaration vs initialization vs assignment**
- **lexical scope**
- **block scope**
- **function scope**
- **global scope**
- **shadowing**
- **redeclaration**
- **Temporal Dead Zone**
- **hoisting**
- **global bindings**
- **`globalThis`**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Variables and Declarations** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 03 · JavaScript Types

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

JavaScript values belong to seven primitive types or Object. A variable is a binding, not a box that owns an object. Object identity matters because two structurally identical objects are still different values unless they are the same object.

### Mental model / runnable experiment

```js
const a = { id: 1 }
const b = { id: 1 }
const c = a
console.log(a === b) // false
console.log(a === c) // true
```

### Coverage contract

- **undefined**
- **null**
- **boolean**
- **string**
- **symbol**
- **number**
- **bigint**
- **objects**
- **functions as callable objects**
- **primitive vs reference mental models**
- **`typeof`**
- **`instanceof`**
- **`Object.prototype.toString`**
- **identity**
- **mutability vs reassignment**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **JavaScript Types** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 04 · Type Conversion and Coercion

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

Coercion is specified through abstract operations such as ToPrimitive, ToNumber, ToString, and ToBoolean. The reliable way to understand surprising expressions is to follow those conversions in order rather than memorize folklore.

### Mental model / runnable experiment

```js
console.log([] == false) // true
// [] -> primitive "" -> numeric 0; false -> numeric 0
console.log(Object.is(NaN, NaN)) // true
```

### Coverage contract

- **implicit coercion**
- **explicit conversion**
- **truthiness/falsiness**
- **`Boolean`**
- **`Number`**
- **`String`**
- **numeric conversion**
- **string conversion**
- **object-to-primitive conversion**
- **`valueOf`**
- **`toString`**
- **`Symbol.toPrimitive`**
- **abstract `ToPrimitive`**
- **abstract `ToNumber`**
- **abstract `ToString`**
- **coercion traps**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Type Conversion and Coercion** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
