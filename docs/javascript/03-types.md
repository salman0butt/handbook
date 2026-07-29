---
title: 03 — JavaScript Types
---

# 03 — JavaScript Types

ECMAScript values are either **primitive values** or **objects**. The primitive language types are Undefined, Null, Boolean, String, Symbol, Number, and BigInt. Object is the non-primitive language type. Functions are objects with callable behavior; some are also constructible.

| Type | Example | Mutable value? |
|---|---|---|
| undefined | `undefined` | primitive |
| null | `null` | primitive |
| boolean | `true` | primitive |
| string | `'hello'` | primitive |
| symbol | `Symbol('id')` | primitive |
| number | `42`, `NaN`, `Infinity`, `-0` | primitive |
| bigint | `42n` | primitive |
| object | `{}`, `[]`, functions | object state can often mutate |

## Binding → value, not “box with type”

```js
let x = 1;
x = 'one';
```

The binding `x` is not permanently typed as Number; it first refers to a numeric value and later to a string value.

```text
binding a ──→ object X
binding b ──┘
```

```js
const a = {count: 0};
const b = a;
b.count++;
console.log(a.count); // 1
```

Assignments of object values copy the object **reference/value identity**, not a deep object clone. “Primitives pass by value, objects pass by reference” is a misleading shortcut: JavaScript argument passing is by value; an object value lets multiple bindings designate the same object.

## `typeof`

```js
typeof undefined; // 'undefined'
typeof null;      // 'object' — historical legacy
typeof 1n;        // 'bigint'
typeof Symbol();  // 'symbol'
typeof function(){}; // 'function'
```

`typeof` is useful for broad runtime checks but is not a full type system. `typeof null === 'object'` is a famous historical quirk.

## Identity and `instanceof`

`instanceof` asks whether the right-hand constructor's `prototype` is found in the left-hand object's prototype chain (subject to customization via `Symbol.hasInstance`). It is not a general “what type is this?” operator and can fail across realms.

`Object.prototype.toString.call(value)` can expose built-in tags, but `Symbol.toStringTag` can customize many of them. Use purpose-specific checks such as `Array.isArray` when available.

## Mutability vs reassignment

A primitive value cannot be mutated. An object can often be mutated. A `const` binding cannot be reassigned, but the object it designates can still change unless its own integrity is restricted.

## Senior reasoning

When discussing “references,” distinguish **binding identity**, **object identity**, **property mutation**, and **reassignment**. This language prevents common bugs around shallow copies, parameters, closures, and state management.

### Interview checks

- Why does mutating `b.count` change what is observed through `a`?
- Why is `typeof null` not a reliable null check?
- Why can `instanceof Array` be false for an array from another realm while `Array.isArray` is true?
