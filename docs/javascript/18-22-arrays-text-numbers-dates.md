---
title: 18–22 · Arrays, Strings, Numbers, BigInt & Date
description: JavaScript phases 18–22 with language semantics, runtime mental models, production trade-offs, and interview reasoning.
id: 18-22-arrays-text-numbers-dates
---

# 18–22 · Arrays, Strings, Numbers, BigInt & Date

## 18 · Arrays

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

Arrays are exotic objects whose indexed properties interact with `length`. Sparse arrays, mutating versus copying methods, callback iteration, species/constructor behavior, and modern copy-by-change methods are essential to predictable collection code.

### Mental model / runnable experiment

```js
const source = [3, 1, 2]
const sortedCopy = source.toSorted((a, b) => a - b)
console.log(source)     // [3, 1, 2]
console.log(sortedCopy) // [1, 2, 3]
```

### Coverage contract

- **creation**
- **indexes**
- **length**
- **sparse arrays**
- **mutation**
- **copying**
- **shallow copy**
- **destructuring**
- **spread**
- **iteration**
- **at**
- **concat**
- **copyWithin**
- **entries**
- **every**
- **fill**
- **filter**
- **find**
- **findIndex**
- **findLast**
- **findLastIndex**
- **flat**
- **flatMap**
- **forEach**
- **includes**
- **indexOf**
- **join**
- **keys**
- **lastIndexOf**
- **map**
- **pop**
- **push**
- **reduce**
- **reduceRight**
- **reverse**
- **shift**
- **slice**
- **some**
- **sort**
- **splice**
- **toReversed**
- **toSorted**
- **toSpliced**
- **unshift**
- **values**
- **with**
- **Array.from**
- **Array.fromAsync**
- **Array.isArray**
- **Array.of**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Arrays** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 19 · Strings and Unicode

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

Strings are immutable sequences of UTF-16 code units. Code points may span two code units and user-perceived grapheme clusters may span several code points, so `length` and indexing are not synonymous with visible-character counting.

### Mental model / runnable experiment

```js
const s = "😊"
console.log(s.length)      // 2 UTF-16 code units
console.log([...s].length) // 1 code point
```

### Coverage contract

- **string primitives**
- **template literals**
- **tagged templates**
- **escapes**
- **Unicode**
- **UTF-16**
- **code units**
- **code points**
- **grapheme clusters**
- **surrogate pairs**
- **normalization**
- **locale-sensitive comparison**
- **string iteration**
- **common String methods**
- **why `.length` is not always "number of visible characters"**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Strings and Unicode** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 20 · Numbers

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

Numbers use IEEE-754 binary64. Many decimal fractions are not exactly representable; safe integers are limited to ±(2^53−1), `NaN` is unordered, and `-0` is observable in a few operations.

### Mental model / runnable experiment

```js
console.log(0.1 + 0.2 === 0.3) // false
console.log(0.1 + 0.2)         // 0.30000000000000004
```

### Coverage contract

- **IEEE-754**
- **floating-point limitations**
- **`NaN`**
- **Infinity**
- **`-Infinity`**
- **`-0`**
- **safe integers**
- **Number constants**
- **parsing**
- **rounding**
- **precision**
- **binary/octal/hex literals**
- **numeric separators**
- **Math APIs**
- **financial-number pitfalls**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Numbers** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 21 · BigInt

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

BigInt represents integers of arbitrary magnitude, trading compatibility and often speed/memory for exact integer arithmetic. Number and BigInt cannot be mixed in arithmetic without explicit conversion.

### Mental model / runnable experiment

```js
// 21: BigInt
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **BigInt literals**
- **constructor conversion**
- **arithmetic**
- **comparisons**
- **Number interoperability**
- **JSON limitation/strategies**
- **use cases**
- **performance considerations**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **BigInt** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 22 · Date and Time

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

`Date` stores a millisecond timestamp and exposes local/UTC interpretation APIs. Parsing, time zones, daylight-saving changes, invalid dates, and calendar arithmetic make date-time code a boundary-design problem, not just arithmetic.

### Mental model / runnable experiment

```js
// 22: Date and Time
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **timestamps**
- **UTC**
- **local time**
- **parsing**
- **formatting**
- **time zones**
- **DST pitfalls**
- **ISO strings**
- **arithmetic**
- **common mistakes**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Date and Time** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
