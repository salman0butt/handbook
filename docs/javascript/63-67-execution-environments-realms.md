---
title: 63–67 · Execution Contexts, Environments, References & Realms
description: JavaScript phases 63–67 with language semantics, runtime mental models, production trade-offs, and interview reasoning.
id: 63-67-execution-environments-realms
---

# 63–67 · Execution Contexts, Environments, References & Realms

## 63 · Execution Contexts

> **Reasoning level:** distinguish normative language semantics from explanatory specification models and engine implementation details.

Execution contexts are specification records for currently executing code. They reference lexical/variable/private environments and Realm/Script/Module/function state; they are not a claim about a VM's concrete stack frame layout.

### Mental model / runnable experiment

```text
running execution context
  ├─ Script/Module/Function state
  ├─ LexicalEnvironment
  ├─ VariableEnvironment
  ├─ PrivateEnvironment
  └─ Realm
```

### Coverage contract

- **execution context**
- **running execution context**
- **lexical environment**
- **variable environment**
- **private environment**
- **function environment**
- **global environment**
- **module environment**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Execution Contexts** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 64 · Environment Records

> **Reasoning level:** distinguish normative language semantics from explanatory specification models and engine implementation details.

Environment Records specify how identifier bindings behave. Declarative, function, module, object, and global records explain scope, TDZ, `this`, globals, and live module bindings more precisely than the phrase 'variables live on the stack'.

### Mental model / runnable experiment

```js
// 64: Environment Records
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **declarative environment records**
- **function environment records**
- **module environment records**
- **object environment records**
- **global environment records**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Environment Records** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 65 · Reference Records

> **Reasoning level:** distinguish normative language semantics from explanatory specification models and engine implementation details.

Reference Records are specification values used while evaluating identifiers and property access. A method call preserves a base reference that supplies `this`; assigning the method to a variable loses that base, changing invocation semantics.

### Mental model / runnable experiment

```js
const obj = { value: 42, method() { return this.value } }
obj.method()           // Reference keeps base `obj`
const fn = obj.method
fn()                   // no method-call base
```

### Coverage contract

- **Core concept**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Reference Records** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 66 · Abstract Operations

> **Reasoning level:** distinguish normative language semantics from explanatory specification models and engine implementation details.

Abstract operations are reusable specification algorithms such as ToPrimitive, Get, Set, Call, and Construct. Learn to trace them to answer hard questions; do not memorize pseudocode line numbers.

### Mental model / runnable experiment

```js
// 66: Abstract Operations
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **ToPrimitive**
- **ToBoolean**
- **ToNumeric**
- **ToNumber**
- **ToBigInt**
- **ToString**
- **ToObject**
- **IsCallable**
- **IsConstructor**
- **Get**
- **Set**
- **Call**
- **Construct**
- **OrdinaryGet**
- **OrdinarySet**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Abstract Operations** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
## 67 · Realms and Global Objects

> **Reasoning level:** distinguish normative language semantics from explanatory specification models and engine implementation details.

A Realm groups a global object and realm-specific intrinsic identities. Cross-realm objects can fail `instanceof` checks because their prototype identities come from another Realm; brand-safe operations are often preferable.

### Mental model / runnable experiment

```js
// 67: Realms and Global Objects
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **Realm concept**
- **global object**
- **globalThis**
- **intrinsics**
- **iframe realm differences**
- **cross-realm Array/instanceof issues**
- **built-in identities**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Realms and Global Objects** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
