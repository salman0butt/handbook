---
title: 68–71 · Jobs, Parsing, Engines & JIT
description: JavaScript phases 68–71 with language semantics, runtime mental models, production trade-offs, and interview reasoning.
id: 68-71-jobs-parsing-engines-jit
---

# 68–71 · Jobs, Parsing, Engines & JIT

## 68 · Jobs and Promise Jobs

> **Reasoning level:** distinguish normative language semantics from explanatory specification models and engine implementation details.

ECMAScript Jobs describe queued language work such as Promise reactions. The host decides when Jobs run relative to tasks, I/O, rendering, and other host activity, subject to the integration contract.

### Mental model / runnable experiment

```js
// 68: Jobs and Promise Jobs
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **Core concept**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Jobs and Promise Jobs** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 69 · Parsing and Early Errors

> **Reasoning level:** distinguish normative language semantics from explanatory specification models and engine implementation details.

Parsing distinguishes lexical grammar, syntactic grammar, early errors, and runtime evaluation. Some programs fail before execution even when the problematic branch would never run.

### Mental model / runnable experiment

```js
// 69: Parsing and Early Errors
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **lexical grammar**
- **syntactic grammar**
- **parsing**
- **syntax errors**
- **early errors**
- **runtime errors**
- **strict-mode restrictions**
- **module restrictions**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Parsing and Early Errors** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 70 · JavaScript Engines

> **Reasoning level:** distinguish normative language semantics from explanatory specification models and engine implementation details.

ECMAScript defines observable semantics, not a required engine pipeline. V8, SpiderMonkey, and JavaScriptCore use different parsers, interpreters/JIT tiers, garbage collectors, and representations while targeting the same language behavior.

### Mental model / runnable experiment

```text
source → parse → internal representation → interpreter/bytecode
      → profiling → optimized code → possible deoptimization
```

### Coverage contract

- **V8**
- **SpiderMonkey**
- **JavaScriptCore**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **JavaScript Engines** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 71 · JIT and Optimization Mental Models

> **Reasoning level:** distinguish normative language semantics from explanatory specification models and engine implementation details.

JIT mental models such as inline caches, shapes, monomorphic sites, allocation, optimization, and deoptimization can explain performance, but they are engine-specific and version-sensitive. Measure before coding to folklore.

### Mental model / runnable experiment

```js
// 71: JIT and Optimization Mental Models
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **interpreter**
- **JIT**
- **inline caches**
- **object shapes / hidden-class-style concepts**
- **optimization**
- **deoptimization**
- **monomorphic/polymorphic concepts**
- **hot functions**
- **allocation**
- **GC interaction**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **JIT and Optimization Mental Models** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
