---
title: 05–08 · Equality, Operators, Control Flow & Iteration
description: JavaScript phases 05–08 with language semantics, runtime mental models, production trade-offs, and interview reasoning.
id: 05-08-equality-operators-control-iteration
---

# 05–08 · Equality, Operators, Control Flow & Iteration

## 05 · Equality and Comparison

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

JavaScript uses several equality relations for different jobs. Strict equality, SameValue, and SameValueZero differ around `NaN` and signed zero; loose equality additionally performs a specified coercion algorithm.

### Mental model / runnable experiment

```js
console.log(NaN === NaN)        // false
console.log(Object.is(NaN, NaN))// true
console.log(0 === -0)            // true
console.log(Object.is(0, -0))    // false
console.log([NaN].includes(NaN)) // true: SameValueZero
```

### Coverage contract

- **`===`**
- **`!==`**
- **`==`**
- **`!=`**
- **`Object.is`**
- **SameValue**
- **SameValueZero**
- **relational comparison**
- **string comparison**
- **numeric comparison**
- **NaN**
- **`-0`**
- **BigInt comparisons**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Equality and Comparison** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 06 · Operators

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

Operators are syntax that trigger evaluation algorithms. Precedence decides grouping, associativity decides grouping among equal-precedence operators, and short-circuit operators may skip evaluation entirely.

### Mental model / runnable experiment

```js
// 06: Operators
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **arithmetic**
- **assignment**
- **comparison**
- **logical**
- **nullish coalescing**
- **optional chaining**
- **conditional/ternary**
- **bitwise**
- **string operators**
- **unary operators**
- **`typeof`**
- **`delete`**
- **`void`**
- **`in`**
- **`instanceof`**
- **exponentiation**
- **comma operator**
- **spread**
- **operator precedence**
- **associativity**
- **short-circuit evaluation**
- **logical assignment**
- **optional chaining evaluation rules**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Operators** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 07 · Control Flow

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

Control-flow constructs produce completion records conceptually: normal, return, throw, break, or continue. `finally` is powerful because its abrupt completion can replace a return or an earlier thrown exception.

### Mental model / runnable experiment

```js
function f() {
  try { return "try" }
  finally { return "finally" }
}
console.log(f()) // "finally" — finally's return replaces the earlier completion
```

### Coverage contract

- **`if`**
- **`else`**
- **`switch`**
- **conditional expressions**
- **blocks**
- **labels**
- **`break`**
- **`continue`**
- **`return`**
- **`throw`**
- **`try`**
- **`catch`**
- **`finally`**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Control Flow** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 08 · Loops and Iteration

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

JavaScript has both language-level loops and protocol-driven iteration. `for...in` enumerates string-keyed enumerable properties, while `for...of` consumes an iterable; that distinction is why `for...in` is usually wrong for array values.

### Mental model / runnable experiment

```js
const xs = [10, 20]
xs.extra = 30
for (const key in xs) console.log(key) // "0", "1", "extra"
for (const value of xs) console.log(value) // 10, 20
```

### Coverage contract

- **`for`**
- **`while`**
- **`do...while`**
- **`for...in`**
- **`for...of`**
- **`break`**
- **`continue`**
- **labels**
- **iteration protocols**
- **enumerable property iteration**
- **array iteration**
- **mutation while iterating**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Loops and Iteration** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
