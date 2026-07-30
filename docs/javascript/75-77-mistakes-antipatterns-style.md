---
title: 75–77 · Mistakes, Anti-Patterns & Best Practices
description: JavaScript phases 75–77 with language semantics, runtime mental models, production trade-offs, and interview reasoning.
id: 75-77-mistakes-antipatterns-style
---

# 75–77 · Mistakes, Anti-Patterns & Best Practices

## 75 · Common JavaScript Mistakes

> **Engineering lens:** prefer explicit contracts, measurements, ownership, and failure modes over style folklore.

Most JavaScript bugs come from wrong mental models: scope/`this`, coercion, aliasing, shallow copies, async ordering, races, cleanup, time zones, property enumeration, and untrusted HTML.

### Mental model / runnable experiment

```js
// 75: Common JavaScript Mistakes
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **accidental globals**
- **misunderstanding `this`**
- **equality mistakes**
- **coercion surprises**
- **mutating shared objects**
- **shallow copy assumptions**
- **Promise mistakes**
- **missing return in callbacks**
- **async forEach misconception**
- **unhandled rejection**
- **race conditions**
- **incorrect event cleanup**
- **sparse arrays**
- **object-key assumptions**
- **time-zone mistakes**
- **unsafe HTML**
- **prototype pollution**
- **overusing classes**
- **overusing clever functional code**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Common JavaScript Mistakes** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 76 · JavaScript Anti-Patterns

> **Engineering lens:** prefer explicit contracts, measurements, ownership, and failure modes over style folklore.

Anti-patterns are context-dependent designs whose costs repeatedly exceed benefits: hidden global mutation, Promise-constructor wrapping, accidental serialization, monkey-patching, swallowed errors, clever abstractions, and premature optimization.

### Mental model / runnable experiment

```js
// 76: JavaScript Anti-Patterns
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **callback pyramids**
- **Promise constructor abuse**
- **unnecessary async**
- **sequential requests that could run concurrently**
- **global mutable state**
- **giant modules**
- **hidden side effects**
- **mutation across boundaries**
- **monkey patching globals**
- **prototype mutation**
- **`eval`**
- **Boolean parameter soup**
- **magic strings**
- **implicit contracts**
- **swallowing errors**
- **excessive abstraction**
- **premature optimization**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **JavaScript Anti-Patterns** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 77 · JavaScript Style and Best Practices

> **Engineering lens:** prefer explicit contracts, measurements, ownership, and failure modes over style folklore.

Style exists to make semantics obvious. Consistent naming, small purposeful functions/modules, explicit boundaries, useful comments/JSDoc, linting, formatting, strictness, and error policies reduce review and maintenance cost.

### Mental model / runnable experiment

```js
// 77: JavaScript Style and Best Practices
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **naming**
- **readability**
- **functions**
- **modules**
- **immutability where useful**
- **early returns**
- **error handling**
- **comments**
- **JSDoc**
- **avoiding unnecessary cleverness**
- **consistency**
- **strictness**
- **linting**
- **formatting**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **JavaScript Style and Best Practices** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
