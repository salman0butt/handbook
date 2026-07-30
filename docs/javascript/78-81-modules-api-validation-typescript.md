---
title: 78–81 · Application Architecture, APIs, Validation & TypeScript Boundary
description: JavaScript phases 78–81 with language semantics, runtime mental models, production trade-offs, and interview reasoning.
id: 78-81-modules-api-validation-typescript
---

# 78–81 · Application Architecture, APIs, Validation & TypeScript Boundary

## 78 · Modules and Application Architecture
> **Engineering lens:** prefer explicit contracts, measurements, ownership, and failure modes over style folklore.

Application architecture uses modules to define ownership and dependency direction. Domain logic should not depend on UI/network details; side effects belong behind adapters; circular dependencies are a signal to revisit boundaries.

### Mental model / runnable experiment

```text
UI / delivery layer
       ↓
application / use cases
       ↓
domain policy
       ↑
adapters: HTTP, storage, browser APIs
```

### Coverage contract

- **feature boundaries**
- **dependency direction**
- **public vs internal modules**
- **data ownership**
- **side effects**
- **domain modules**
- **infrastructure adapters**
- **circular dependency avoidance**
- **module graphs**
- **dependency injection**
- **testability**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Modules and Application Architecture** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 79 · API Design in JavaScript
> **Engineering lens:** prefer explicit contracts, measurements, ownership, and failure modes over style folklore.

A JavaScript API is a long-lived contract across values, errors, async timing, cancellation, events, defaults, extensibility, and backwards compatibility. Options objects and stable return shapes help evolution.

### Mental model / runnable experiment

```js
// 79: API Design in JavaScript
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **function APIs**
- **options objects**
- **return shapes**
- **errors**
- **cancellation**
- **async contracts**
- **event APIs**
- **fluent APIs**
- **extensibility**
- **backwards compatibility**
- **runtime validation**
- **documentation**
- **semantic versioning concepts**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **API Design in JavaScript** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 80 · Runtime Validation
> **Engineering lens:** prefer explicit contracts, measurements, ownership, and failure modes over style folklore.

JavaScript performs no TypeScript-like runtime validation. Trust boundaries need parsing/validation using primitive checks, structural checks, schemas, or libraries; successful validation should produce a value the rest of the program can trust.

### Mental model / runnable experiment

```js
// 80: Runtime Validation
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **`typeof`**
- **Array.isArray**
- **instanceof limitations**
- **structural checks**
- **schemas**
- **validation libraries conceptually**
- **parse/don't validate patterns**
- **trust boundaries**
- **JSON/API boundaries**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Runtime Validation** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 81 · JavaScript and TypeScript Boundary
> **Engineering lens:** prefer explicit contracts, measurements, ownership, and failure modes over style folklore.

TypeScript is erased before JavaScript runtime execution. Static types improve development but cannot validate network/storage input by themselves. JSDoc and `checkJs` support gradual typing while runtime validation stays at trust boundaries.

### Mental model / runnable experiment

```text
TypeScript source --compile--> JavaScript runtime
static types disappear          API JSON still untrusted
```

### Coverage contract

- **JavaScript remains runtime**
- **TypeScript disappears before runtime**
- **TS cannot validate API input by itself**
- **JSDoc typing**
- **gradual migration**
- **allowJs/checkJs concepts**
- **runtime validation remains necessary**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **JavaScript and TypeScript Boundary** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
