---
title: Functions
description: Function forms, parameters, callbacks, higher-order design, generators, async functions and reusable APIs.
slug: /javascript/functions/functions
---

# Functions

Functions are callable objects and first-class values: they can be stored, passed, returned and given properties. Choose a form based on semantics, not fashion.

```javascript
function calculateTotal(lines, taxRate = 0) {
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0)
  return subtotal * (1 + taxRate)
}
```

## Forms

Function declarations are instantiated before execution and are useful for named module operations. Function expressions support local naming and conditional construction. Arrow functions capture lexical `this`, `arguments`, `super` and `new.target`; they cannot be constructors and have no own prototype property.

## Parameters and arguments

Default parameters run at call time in their own parameter environment. Rest parameters produce a real Array. Destructured parameters make expected shape visible, but deeply destructuring untrusted input before validation can create confusing failures.

```javascript
function createUser({name, role = 'member'}, ...tags) {
  if (typeof name !== 'string' || !name.trim()) throw new TypeError('name required')
  return {name: name.trim(), role, tags}
}
```

## Higher-order functions

Callbacks enable policy injection. `map`, `filter` and `reduce` are valuable when they match the transformation, but a named loop is clearer when control flow, early exit or several mutations dominate.

```javascript
const byPriority = (a, b) => a.priority - b.priority
const visibleTasks = tasks.filter(task => !task.archived).toSorted(byPriority)
```

## Composition, currying and partial application

Composition builds pipelines from small compatible functions. Partial application fixes some arguments. Currying converts a multi-argument function into nested unary functions. Use them when they clarify reuse—not to make ordinary business code academically indirect.

```javascript
const withCurrency = currency => amount =>
  new Intl.NumberFormat('en', {style: 'currency', currency}).format(amount)
```

## Recursion and memoization

Memoization trades memory and invalidation complexity for avoided work. Cache only pure or explicitly keyed computations, bound cache growth, and include every behavior-changing input in the key.

## Special function kinds

Generators pause with `yield` and implement iteration. Async functions always return Promises. Methods receive dynamic `this` from the call site. Constructor functions invoked with `new` create and initialize an object, but factories are often simpler when identity and inheritance are unnecessary.

## API design checklist

Define accepted inputs, returned values, mutation, error behavior, async/cancellation behavior and ownership. Keep functions cohesive, use names that state intent, and do not hide network or storage effects behind names that sound like pure calculations.

## Primary references

- [ECMA-262 function definitions](https://tc39.es/ecma262/#sec-ecmascript-language-functions-and-classes)
- [MDN functions](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Functions)
