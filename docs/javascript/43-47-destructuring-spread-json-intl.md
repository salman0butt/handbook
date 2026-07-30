---
title: 43–47 · Destructuring, Spread, JSON & Internationalization
description: JavaScript phases 43–47 with language semantics, runtime mental models, production trade-offs, and interview reasoning.
id: 43-47-destructuring-spread-json-intl
---

# 43–47 · Destructuring, Spread, JSON & Internationalization

## 43 · Destructuring

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

Destructuring is binding/assignment syntax driven by iterable semantics for arrays and property access for objects. Defaults evaluate only when the extracted value is `undefined`, and evaluation order can trigger getters or iterator closing.

### Mental model / runnable experiment

```js
// 43: Destructuring
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **arrays**
- **objects**
- **defaults**
- **aliases**
- **nested destructuring**
- **rest patterns**
- **parameter destructuring**
- **iterator involvement**
- **destructuring evaluation order**
- **common mistakes**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Destructuring** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 44 · Spread and Rest

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

The `...` token has multiple grammar meanings: spread expands arguments/iterables/properties; rest collects remaining parameters/elements/properties. Object spread is shallow and follows own enumerable property copying semantics.

### Mental model / runnable experiment

```js
// 44: Spread and Rest
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **argument spread**
- **array spread**
- **object spread**
- **rest parameters**
- **array rest**
- **object rest**
- **shallow copies**
- **property semantics**
- **iterator semantics**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Spread and Rest** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 45 · Optional Chaining and Nullish Coalescing

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

Optional chaining stops a continuous chain when the base is nullish; grouping can end that short-circuit chain. Nullish coalescing defaults only for `null`/`undefined`, unlike `||`, which treats every falsy value as absent.

### Mental model / runnable experiment

```js
// 45: Optional Chaining and Nullish Coalescing
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **optional property access**
- **optional element access**
- **optional function calls**
- **short-circuiting**
- **grouping edge cases**
- **`??`**
- **difference from `||`**
- **logical assignments**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Optional Chaining and Nullish Coalescing** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 46 · JSON

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

JSON is a data-interchange grammar, not JavaScript source. Serialization loses or rejects several JavaScript values, cycles need a strategy, revivers/replacers can transform data, and ES2026 adds source-context/raw-JSON facilities.

### Mental model / runnable experiment

```js
const text = '{"id":9007199254740993}'
const value = JSON.parse(text, (key, val, context) =>
  key === "id" && context?.source ? BigInt(context.source) : val
)
```

### Coverage contract

- **JSON syntax vs JavaScript syntax**
- **stringify**
- **parse**
- **replacer**
- **reviver**
- **serialization limitations**
- **cycles**
- **undefined**
- **symbols**
- **functions**
- **BigInt**
- **dates**
- **security**
- **prototype concerns**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **JSON** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 47 · Internationalization

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

ECMA-402 complements ECMA-262 with locale-sensitive formatting, comparison, segmentation, and locale metadata. Output data is partly implementation/locale dependent, so tests should assert intent rather than one machine's exact punctuation where the standard permits variation.

### Mental model / runnable experiment

```js
const money = new Intl.NumberFormat("en-GB", {
  style: "currency", currency: "GBP"
}).format(1234.5)
console.log(money)
```

### Coverage contract

- **Intl**
- **Locale**
- **Collator**
- **DateTimeFormat**
- **NumberFormat**
- **RelativeTimeFormat**
- **ListFormat**
- **PluralRules**
- **DisplayNames**
- **Segmenter**
- **DurationFormat if current**
- **locale negotiation**
- **Unicode extensions**
- **calendars**
- **numbering systems**
- **time zones**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Internationalization** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
