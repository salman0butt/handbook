---
title: 23–26 · Temporal, RegExp, Symbols, Maps & Sets
description: JavaScript phases 23–26 with language semantics, runtime mental models, production trade-offs, and interview reasoning.
id: 23-26-temporal-regex-symbols-collections
---

# 23–26 · Temporal, RegExp, Symbols, Maps & Sets

## 23 · Temporal

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

Temporal is finished Stage 4 as of this handbook baseline but is not the ES2026 annual snapshot and is not universal across runtimes. It separates instants, time zones, calendar dates/times, and durations into explicit immutable types.

### Mental model / runnable experiment

```js
// Feature-detect because Stage 4 does not mean universal availability.
if (globalThis.Temporal) {
  const date = Temporal.PlainDate.from("2026-07-30")
  console.log(date.add({days: 1}).toString())
}
```

### Coverage contract

- **why Temporal exists**
- **Temporal vs Date**
- **Instant**
- **ZonedDateTime**
- **PlainDate**
- **PlainTime**
- **PlainDateTime**
- **PlainYearMonth**
- **PlainMonthDay**
- **Duration**
- **Now**
- **time zones**
- **calendars**
- **arithmetic**
- **parsing/serialization**
- **interoperability**
- **browser/runtime compatibility**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Temporal** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 24 · Regular Expressions

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

Regular expressions are a compact pattern language integrated with String and RegExp methods. Unicode modes, stateful global/sticky matching, captures, lookarounds, replacement callbacks, and backtracking behavior matter for correctness and ReDoS risk.

### Mental model / runnable experiment

```js
const re = /(?<user>[\p{L}\p{N}_-]+)@(?<host>[\p{L}\p{N}.-]+)/u
const match = re.exec("ada@example.org")
console.log(match?.groups)
```

### Coverage contract

- **literals**
- **constructor**
- **patterns**
- **flags**
- **groups**
- **named groups**
- **captures**
- **backreferences**
- **assertions**
- **lookahead**
- **lookbehind**
- **character classes**
- **Unicode**
- **Unicode property escapes**
- **dotAll**
- **global**
- **sticky**
- **indices**
- **replace callbacks**
- **performance**
- **catastrophic backtracking / ReDoS**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Regular Expressions** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 25 · Symbols

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

Symbols are unique primitive property keys. Well-known symbols are language extension points that customize protocols such as iteration, coercion, matching, species construction, disposal, and object tagging.

### Mental model / runnable experiment

```js
// 25: Symbols
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **Symbol creation**
- **uniqueness**
- **global symbol registry**
- **`Symbol.for`**
- **`Symbol.keyFor`**
- **symbol property keys**
- **well-known symbols**
- **iterator**
- **asyncIterator**
- **hasInstance**
- **match**
- **matchAll**
- **replace**
- **search**
- **species**
- **split**
- **toPrimitive**
- **toStringTag**
- **unscopables**
- **dispose**
- **asyncDispose**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Symbols** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 26 · Maps and Sets

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

Map and Set model keyed/set collections with insertion-order iteration and SameValueZero-style key equality after canonicalization. Weak collections hold keys weakly and deliberately do not expose enumeration because reachability must remain unobservable.

### Mental model / runnable experiment

```js
// 26: Maps and Sets
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **Map**
- **Set**
- **WeakMap**
- **WeakSet**
- **equality behavior**
- **iteration order**
- **object vs Map**
- **arrays vs Sets**
- **modern Set operations**
- **weak collections**
- **GC relationship**
- **use cases**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Maps and Sets** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
