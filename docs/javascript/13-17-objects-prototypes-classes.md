---
title: 13–17 · Objects, Prototypes & Classes
description: JavaScript handbook chapters 13–17.
sidebar_position: 7
id: 13-17-objects-prototypes-classes
---

# 13–17 · Objects, Prototypes & Classes

Use the numbered sections as the learning path. Each section keeps the language/host boundary explicit and links syntax to runtime behavior, production concerns, and interview reasoning.

## 13 · Objects

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

Objects are dynamic collections of own properties with a prototype link. Property keys are strings or symbols, access can hit inherited properties, and copying/destructuring operate over defined property/iteration semantics rather than cloning an object graph.

### Mental model / runnable experiment

```js
// 13: Objects
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **object literals**
- **computed properties**
- **property access**
- **property keys**
- **own vs inherited properties**
- **property existence**
- **enumeration**
- **object copying**
- **shallow copying**
- **object destructuring**
- **optional properties at runtime**
- **methods**
- **getters**
- **setters**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Objects** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.

## 14 · Property Descriptors

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

A property is defined by a descriptor. Data descriptors control value/writability; accessor descriptors control getter/setter functions; enumerable and configurable affect discovery and redefinition.

### Mental model / runnable experiment

```js
// 14: Property Descriptors
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **data properties**
- **accessor properties**
- **configurable**
- **enumerable**
- **writable**
- **`Object.defineProperty`**
- **`Object.defineProperties`**
- **`Object.getOwnPropertyDescriptor`**
- **`Object.getOwnPropertyDescriptors`**
- **`Object.keys`**
- **`Object.values`**
- **`Object.entries`**
- **`Object.fromEntries`**
- **`Object.hasOwn`**
- **`Reflect.ownKeys`**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Property Descriptors** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.

## 15 · Object Integrity

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

Preventing extensions, sealing, and freezing constrain an object's own properties, but `freeze` is shallow. Deep immutability is an application policy built by recursive structures, defensive copying, or immutable data design.

### Mental model / runnable experiment

```js
// 15: Object Integrity
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **`Object.preventExtensions`**
- **`Object.seal`**
- **`Object.freeze`**
- **shallow freeze**
- **immutability misconceptions**
- **defensive copying**
- **immutable data patterns**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Object Integrity** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.

## 16 · Prototypes

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

Prototype lookup walks `[[Prototype]]` links until a property is found or `null` is reached. Constructor `.prototype` is just the object used as the default prototype for instances created through that constructor; changing prototypes dynamically can hurt correctness, security, and optimization.

### Mental model / runnable experiment

```text
instance
   ↓ [[Prototype]]
Constructor.prototype
   ↓
Object.prototype
   ↓
null
```

### Coverage contract

- **prototype chain**
- **`[[Prototype]]`**
- **`Object.getPrototypeOf`**
- **`Object.setPrototypeOf`**
- **`Object.create`**
- **constructor `.prototype`**
- **inherited properties**
- **method lookup**
- **prototype shadowing**
- **prototype mutation**
- **prototype pollution**
- **performance implications**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Prototypes** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.

## 17 · Classes

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

Classes are syntax and semantics built on JavaScript's prototype model. They add strict class bodies, constructors, fields, private names, static initialization, inheritance, and `super`, but method lookup still uses prototypes.

### Mental model / runnable experiment

```js
// 17: Classes
// Build a tiny experiment, state the expected observable behavior,
// then verify it in every runtime you target rather than relying on folklore.
```

### Coverage contract

- **class declarations**
- **class expressions**
- **constructors**
- **methods**
- **fields**
- **public fields**
- **private fields**
- **static fields**
- **static methods**
- **static initialization blocks**
- **inheritance**
- **`extends`**
- **`super`**
- **getters/setters**
- **private methods**
- **`#private`**
- **derived constructors**
- **class evaluation**
- **classes vs prototype syntax**

### Common mistakes / edge cases

- Separate syntax and ECMAScript semantics from host APIs and engine implementation details.
- Trace evaluation order, conversions, ownership, cleanup, and failure behavior instead of memorizing slogans.
- Check recently standardized APIs against the runtimes/browsers you actually support.

### Production and senior reasoning

State what is guaranteed by the language, what the host decides, and what is merely an engine strategy. At boundaries, define validation, cancellation, error, mutation, compatibility, performance, and security contracts explicitly.

**Interview drill:** explain **Classes** from first principles, predict one edge case, and describe how you would prove the behavior with a minimal experiment.
