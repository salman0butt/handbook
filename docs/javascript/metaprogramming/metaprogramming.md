---
title: Metaprogramming and Advanced Objects
description: Symbols, proxies, Reflect, coercion hooks, decorators status and invariant-safe dynamic behavior.
---

# Metaprogramming and Advanced Objects

Metaprogramming changes or observes language-level operations. It is powerful, but it increases debugging cost and can defeat engine optimizations.

## Symbols

Symbols are unique primitive keys. Registered Symbols from `Symbol.for` are shared through a registry. Well-known Symbols customize protocols such as iteration, primitive conversion, matching and species.

```javascript
const inspect = Symbol('inspect')
const record = {[inspect]: () => 'safe summary'}
```

## Coercion hooks

`Symbol.toPrimitive` controls object-to-primitive conversion for string, number and default hints.

```javascript
const money = {
  amount: 250,
  [Symbol.toPrimitive](hint) {
    return hint === 'number' ? this.amount : `PKR ${this.amount}`
  },
}
```

Avoid surprising conversions in domain objects; explicit methods are usually easier to review.

## Proxy and Reflect

A Proxy interposes on internal operations through traps. Reflect methods forward corresponding default behavior and return useful success values.

```javascript
function readonly(target) {
  return new Proxy(target, {
    set() { throw new TypeError('read-only') },
    deleteProperty() { throw new TypeError('read-only') },
    defineProperty() { throw new TypeError('read-only') },
  })
}
```

A shallow Proxy does not make nested objects read-only. Proxy invariants restrict traps: for example, a trap cannot report a non-configurable property as absent. Violations throw.

Revocable proxies are useful for capability lifetime. Cross-boundary security still needs real isolation; Proxy is not a sandbox.

## Descriptors and dynamic APIs

Descriptors define property semantics. Dynamic property access should validate allowed keys when crossing a trust boundary. `Reflect.construct` and `Reflect.apply` make meta-level invocation explicit.

## Species

Species hooks let subclasses influence result construction for some built-ins. They add surprising coupling and optimization barriers; avoid custom species unless maintaining a compatibility-sensitive library.

## Decorators status

Decorators are a TC39 Stage 2.7 proposal at the August 2, 2026 baseline, not standardized JavaScript. Transpiler implementations can differ by proposal generation and metadata semantics. Keep decorator-based APIs isolated and document the required toolchain.

## Performance and debugging

Proxies can intercept hot property access and obscure stack traces. Measure before using them in large reactive graphs. Prefer generated explicit adapters, schema validation or ordinary getters when those solve the problem.

## Primary references

- [ECMA-262 reflection](https://tc39.es/ecma262/#sec-reflection)
- [TC39 decorators](https://github.com/tc39/proposal-decorators)
