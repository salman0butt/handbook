---
title: Classes
description: Class evaluation, fields, private state, inheritance, static blocks and domain-model design.
slug: /javascript/classes/classes
---

# Classes

Classes define constructor and prototype behavior with strict semantics. They are useful when instances have identity, lifecycle, invariants and shared behavior.

```javascript
class BankAccount {
  #balance = 0
  static currency = 'PKR'

  constructor(owner, openingBalance = 0) {
    if (!owner) throw new TypeError('owner required')
    this.owner = owner
    this.deposit(openingBalance)
  }

  deposit(amount) {
    if (!Number.isFinite(amount) || amount < 0) throw new RangeError('invalid amount')
    this.#balance += amount
  }

  get balance() { return this.#balance }
}
```

Instance fields initialize for every instance. Static fields belong to the constructor. Private names are lexically scoped and perform brand checks; they are not string properties and cannot be accessed through bracket notation.

## Evaluation and hoisting

Class declarations create lexical bindings that remain in the temporal dead zone until evaluated. Computed names, heritage expressions, static fields and static initialization blocks run during class evaluation, so avoid surprising external side effects.

## Inheritance

A derived constructor must call `super()` before using `this`. `super.method()` dispatches against the base prototype while preserving the current receiver.

```javascript
class SavingsAccount extends BankAccount {
  constructor(owner, openingBalance, rate) {
    super(owner, openingBalance)
    this.rate = rate
  }
}
```

Subclassing built-ins has complex species, allocation and platform behavior; composition is often more portable for domain collections and errors are the common practical exception.

## Static blocks

Static initialization blocks can coordinate private static state and error handling during definition. Keep them deterministic and lightweight; configuration and network I/O belong elsewhere.

## Factories versus classes

Use a factory when callers need an interface rather than a concrete identity, when construction may return variants, or when closure-private state is simpler. Use a class when `instanceof`, extensible prototype methods, private fields or domain identity provide real value.

## Design mistakes

- exposing setters that permit invalid intermediate state;
- using inheritance only for code reuse;
- putting I/O in constructors;
- creating “manager” classes with unrelated responsibilities;
- mocking every method instead of testing observable behavior.

## Testing

Instantiate through public APIs, verify invariants and failures, and inject external services through constructor parameters or factories. Avoid tests coupled to private implementation details.

## Primary references

- [ECMA-262 class definitions](https://tc39.es/ecma262/#sec-class-definitions)
- [MDN classes](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Classes)
