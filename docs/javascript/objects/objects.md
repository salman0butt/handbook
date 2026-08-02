---
title: Objects
description: Properties, descriptors, accessors, identity, copying, integrity levels and secure record handling.
slug: /javascript/objects/objects
---

# Objects

Objects are mutable collections of properties with identity and a prototype. Property keys are strings or Symbols; numeric-looking keys are converted to strings.

```javascript
const order = {
  id: 'ord-42',
  ['status']: 'pending',
  [Symbol.for('trace')]: 'abc',
  total() { return this.lines.reduce((sum, line) => sum + line.amount, 0) },
}
```

## Ownership and existence

Use `Object.hasOwn(record, key)` for own-property checks. The `in` operator includes the prototype chain. A read returning `undefined` cannot distinguish absence from an explicitly stored `undefined` value.

## Descriptors

Data properties have `value`, `writable`, `enumerable` and `configurable`. Accessor properties have `get` and `set`. Assignment-created properties default to writable, enumerable and configurable; `Object.defineProperty` defaults omitted flags to false.

```javascript
Object.defineProperty(order, 'internalId', {
  value: crypto.randomUUID(),
  enumerable: false,
  writable: false,
})
```

## Enumeration

`Object.keys` returns own enumerable string keys. `Object.getOwnPropertyNames` includes non-enumerable string keys. `Object.getOwnPropertySymbols` returns Symbols. `Reflect.ownKeys` returns both. `for...in` also visits inherited enumerable string keys.

## Copies and integrity

Object spread and `Object.assign` copy enumerable own properties shallowly and invoke accessors during the operation. `Object.freeze` prevents top-level writes, deletion and reconfiguration but does not recursively freeze nested objects. `seal` prevents additions/deletions; `preventExtensions` prevents additions.

## Maps versus objects

Use plain objects for records with a known schema and Map for dynamic keys, non-string keys, reliable size and frequent insertion/deletion. A null-prototype object can be useful for a dictionary, but still validate keys and use own checks.

## Prototype-pollution defense

Do not recursively merge untrusted `__proto__`, `constructor` or `prototype` paths into ordinary objects. Prefer schema-based construction of allowed fields and patched merge libraries.

```javascript
function safePreferences(input) {
  return {
    theme: input?.theme === 'dark' ? 'dark' : 'light',
    pageSize: Number.isInteger(input?.pageSize) ? input.pageSize : 20,
  }
}
```

## Equality and serialization

Object equality is identity unless you implement a domain-specific structural comparison. JSON serialization omits or transforms several values and does not preserve prototypes. Treat deserialized data as untrusted records, not revived domain objects.

## Primary references

- [ECMA-262 object type](https://tc39.es/ecma262/#sec-object-type)
- [MDN working with objects](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Working_with_objects)
