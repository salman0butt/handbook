---
title: 09 — Functions Fundamentals
---

# 09 — Functions Fundamentals

Functions are first-class objects with callable behavior. They can be stored, passed, returned, closed over lexical state, and—depending on the function kind—used as constructors.

## Declarations, expressions, arrows

```js
function add(a, b) {
  return a + b;
}

const subtract = function subtract(a, b) {
  return a - b;
};

const multiply = (a, b) => a * b;
```

Function declarations participate in declaration instantiation. Function expressions are created when their expression evaluates. A named function expression gives its body a stable self-reference useful for recursion/debugging.

Arrow functions are not abbreviated ordinary functions: they do not have their own `this`, `arguments`, `super`, or `new.target`; they are not constructible and do not have the ordinary constructor-style `prototype` property.

## Parameters and arguments

JavaScript does not enforce arity.

```js
function describe(name, role = 'developer', ...skills) {
  return {name, role, skills};
}

describe('Ava', undefined, 'JS', 'CSS');
```

Default parameters run at call time. A parameter default can refer to earlier parameters. Parameter initialization has its own environment details, which matter in advanced scope cases.

Rest parameters collect remaining arguments into a real Array. Spread arguments consume an iterable:

```js
const values = [2, 4];
Math.max(...values);
```

The legacy `arguments` object is array-like, not an Array. In sloppy simple-parameter functions it can have historical mapping behavior with parameters; strict mode and non-simple parameter lists avoid that mapping. Prefer rest parameters for new code.

## First-class and higher-order functions

```js
function createMultiplier(factor) {
  return value => value * factor;
}

const double = createMultiplier(2);
[1, 2, 3].map(double); // [2, 4, 6]
```

A higher-order function accepts functions, returns functions, or both. Callbacks are simply functions supplied for later invocation; they can be synchronous or asynchronous depending on the API contract.

## Recursion and nested functions

```js
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
```

Recursion consumes call-stack capacity unless an implementation performs an allowed optimization. Do not assume proper-tail-call optimization is universally available in production engines simply because tail positions exist in the specification model.

Nested functions close over bindings from outer scopes:

```js
function counter() {
  let n = 0;
  return () => ++n;
}
```

The returned function keeps the reachable binding alive after `counter` returns.

## Function contracts

A good function API makes these explicit: input domain, return shape, thrown errors, side effects, mutation, cancellation, and whether callback invocation is sync/async/reentrant. Senior JavaScript design is often contract design more than syntax design.

## Common mistakes

- Missing `return` inside block-bodied arrow callbacks.
- Assuming callbacks are asynchronous merely because they are callbacks.
- Using arrows when dynamic `this` is required.
- Creating closures that unintentionally retain large object graphs.
- Mixing side effects and transformations so heavily that testing becomes difficult.

## Interview checks

1. How do arrows differ semantically from ordinary functions?
2. What does rest do compared with spread?
3. Why can a returned nested function still access a local variable?
4. Does JavaScript enforce the declared parameter count?

Related: [Function internals](./10-function-internals.md), [`this`](./11-this.md), [call/apply/bind/new](./12-15-objects-and-descriptors.md#12--call-apply-bind-and-new).
