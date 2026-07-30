---
title: 95–97 · Legacy JavaScript, Specification Reading & Case Studies
description: JavaScript phases 95–97 with language semantics, runtime mental models, production trade-offs, and interview reasoning.
id: 95-97-legacy-spec-reading-case-studies
---

# 95–97 · Legacy JavaScript, Specification Reading & Case Studies

## 95 · Legacy and Annex B JavaScript

> **Reasoning level:** distinguish normative language semantics from explanatory specification models and engine implementation details.

Annex B contains legacy web compatibility behavior that is normative optional: required for browser hosts in relevant cases but optional elsewhere. Sloppy mode, `with`, legacy globals, and older idioms survive because breaking the web is expensive, not because they are good modern design.

### Mental model / runnable experiment

```js
// 95: Legacy and Annex B JavaScript
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **sloppy mode**
- **`with`**
- **legacy globals**
- **legacy RegExp behavior where relevant**
- **`arguments.callee`**
- **older prototype patterns**
- **function declarations in blocks historical behavior**
- **Annex B concept**
- **browser compatibility legacy**
- **why legacy code exists**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Legacy and Annex B JavaScript** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 96 · Specification Reading

> **Reasoning level:** distinguish normative language semantics from explanatory specification models and engine implementation details.

Reading ECMA-262 means translating source syntax into grammar production, early errors, runtime semantics, abstract operations, internal slots/records, Jobs, Realms, agents, and host hooks. Use the spec as a debugger for semantics, not as a book to memorize.

### Mental model / runnable experiment

```js
// 96: Specification Reading
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **normative vs informative text**
- **grammar**
- **algorithms**
- **abstract operations**
- **internal slots**
- **Records**
- **Completion Records**
- **execution contexts**
- **realms**
- **agents**
- **Jobs**
- **well-known symbols**
- **syntax-directed operations**
- **early errors**
- **host hooks**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Specification Reading** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 97 · Language Semantics Case Studies

> **Reasoning level:** distinguish normative language semantics from explanatory specification models and engine implementation details.

Case studies turn surprising code into mechanical reasoning. Trace declaration instantiation, references, coercion, equality relations, prototype lookup, iteration, Promise Jobs, module linking, and property-order rules instead of invoking vague labels such as 'hoisting magic'.

### Mental model / runnable experiment

```js
console.log(typeof null)        // "object"
console.log([] == false)        // true
console.log(NaN !== NaN)        // true
console.log(0 === -0)           // true
console.log(Object.is(0, -0))   // false
```

### Coverage contract

- **closures in loops**
- **class TDZ**
- **detached methods**
- **Promise ordering**
- **object property ordering**
- **prototype lookup**
- **sparse arrays**
- **module cycles**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Language Semantics Case Studies** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
