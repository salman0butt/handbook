---
title: 02 — Variables and Declarations
---

# 02 — Variables and Declarations

A declaration introduces a **binding** between an identifier and a value. Keep three events distinct:

```text
declaration → binding exists
initialization → binding receives its initial value
assignment → an already-initialized binding receives another value
```

## `let`, `const`, and `var`

```js
let count = 0;
count = 1;

const config = {mode: 'prod'};
config.mode = 'test'; // object mutates; binding is not reassigned

var legacy = 1;
```

`let` and `const` are lexical declarations. They are block scoped. `const` requires an initializer and prevents reassignment of the binding, not mutation of an object value. `var` is scoped to the nearest function or global script environment rather than a block and has legacy redeclaration/global interactions.

## Hoisting and TDZ

Saying “`let` is not hoisted” is inaccurate. During scope instantiation, lexical bindings are created before their declaration is evaluated, but remain **uninitialized**. Access while uninitialized throws `ReferenceError`; that region is called the Temporal Dead Zone (TDZ).

```js
{
  // binding for value already exists but is uninitialized
  // console.log(value); // ReferenceError
  let value = 10;
}
```

`var` bindings are created and initialized to `undefined` before normal statement execution, which produces the classic “hoisting” observation.

```js
console.log(x); // undefined
var x = 3;
```

Function declarations have their own instantiation rules and are typically initialized to callable function objects before body execution in their containing function/global context.

## Scope and shadowing

```js
const label = 'outer';
{
  const label = 'inner';
  console.log(label); // inner
}
console.log(label);   // outer
```

Shadowing is a new binding in an inner lexical environment; it does not change the outer binding. Some combinations of `var` and lexical declarations are early errors because their declaration regions conflict.

```text
block environment: label='inner'
        ↓ outer
module/global lexical environment: label='outer'
```

## Global bindings and `globalThis`

Top-level behavior depends on code kind and host. In a classic browser script, a global `var` can create a property on the global object, while top-level `let`/`const` create global lexical bindings that are not global-object properties. In modules, top-level declarations are module-scoped.

`globalThis` is the standardized way to access the host's global `this` value without writing browser-only `window` or Node-specific names.

## Common mistakes

- Treating `const` as deep immutability.
- Explaining TDZ as “the variable does not exist yet.”
- Using `var` inside loops when a fresh per-iteration lexical binding is intended.
- Assuming browser classic-script globals behave like ESM or Node modules.

## Senior reasoning

Use **binding lifetime + environment record** as the mental model. “Hoisting” is informal shorthand for effects of declaration instantiation. When debugging scope, identify the code kind (script/module/function), the nearest lexical/function environment, whether the binding is initialized, and whether another binding shadows it.

### Interview checks

1. Why is “`let` is not hoisted” misleading?
2. Why can a `const` object mutate?
3. How do browser global `var` and global `let` differ?

Related: [Function internals](./10-function-internals.md), [Execution contexts/environment records](./internals-and-specification.md#63--execution-contexts).
