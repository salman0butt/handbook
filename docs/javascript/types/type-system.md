---
title: JavaScript Type System
description: Primitives, objects, coercion, equality, type checks, cloning and serialization limitations.
slug: /javascript/types/type-system
---

# JavaScript Type System

JavaScript values are dynamically typed; bindings do not carry a permanent declared runtime type. The language has seven primitive types—Undefined, Null, Boolean, String, Symbol, Number and BigInt—and Object.

## Important numeric values

`NaN` is a Number value representing an invalid numeric result. It is not equal to itself under strict equality. `Infinity` and `-Infinity` are Numbers. `-0` compares equal to `0` with `===` but differs under `Object.is`. BigInt represents arbitrary-size integers and cannot be mixed directly with Number arithmetic.

```javascript
Number.isNaN(Number('not-a-number')) // true
Object.is(-0, 0)                     // false
9007199254740993n + 1n               // 9007199254740994n
```

## Type inspection

| Tool | Best use | Important limitation |
|---|---|---|
| `typeof` | primitives and callable values | `typeof null` is `"object"` |
| `Array.isArray` | arrays across realms | intentionally array-specific |
| `instanceof` | prototype relation in one expected realm | custom hooks and cross-realm failure |
| `Object.prototype.toString.call` | built-in brand clues | spoofing/host differences are possible |
| explicit validation | application contracts | must be maintained intentionally |

## Coercion mental model

Object conversion generally follows `Symbol.toPrimitive`, then `valueOf`/`toString` in a hint-dependent order. Abstract operations such as ToBoolean, ToNumber and ToString define the result.

```javascript
[] == false // true: both ultimately compare as numeric zero
[] === false // false: different types, no coercion
```

Avoid memorizing isolated “weird” outputs; trace the specified conversions.

## Equality relations

- `===`: strict equality, where `NaN` differs from itself and both zeros are equal;
- `Object.is`: SameValue, where `NaN` equals itself and the zeros differ;
- `Map`, `Set` and `includes`: SameValueZero, where `NaN` matches and zeros are equal;
- `==`: abstract equality with specified coercion.

## Copies and boundaries

Spread and `Object.assign` are shallow. `structuredClone` supports cycles and many platform types but not functions, DOM nodes or all host objects. JSON loses `undefined`, Symbols, functions, BigInt, cycles, prototypes and special numeric values.

```javascript
const copy = structuredClone({createdAt: new Date(), tags: new Set(['a'])})
```

Validate after parsing external data. Parsing proves syntax, not business correctness.

## Security and reliability

Use own-property checks for untrusted records, reject dangerous keys when merging, distinguish absent from explicitly null values, and never use wrapper constructors such as `new Boolean(false)` for ordinary data.

## Primary references

- [ECMA-262 language types](https://tc39.es/ecma262/#sec-ecmascript-data-types-and-values)
- [MDN data structures](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Data_structures)
