---
title: Prototypes and Inheritance
description: Prototype chains, constructors, delegation, class equivalence and composition trade-offs.
slug: /javascript/prototypes/prototypes-and-inheritance
---

# Prototypes and Inheritance

Every ordinary object has an internal `[[Prototype]]` that is another object or `null`. A missing own property is looked up along this chain.

```mermaid
flowchart LR
  I["invoice instance"] --> P["Invoice.prototype"]
  P --> O["Object.prototype"]
  O --> N["null"]
```

```javascript
function Invoice(id, lines = []) {
  this.id = id
  this.lines = lines
}
Invoice.prototype.total = function total() {
  return this.lines.reduce((sum, line) => sum + line.amount, 0)
}
const invoice = new Invoice('inv-1', [{amount: 30}])
```

`Invoice.prototype` is an ordinary object used as the prototype of instances created by `new Invoice`. It is not the prototype of the function itself. The legacy `__proto__` accessor is discouraged; use `Object.getPrototypeOf`, `Object.create` and—rarely—`Object.setPrototypeOf`.

## Shadowing and ownership

Assigning `invoice.total = ...` creates or updates an own property and shadows the inherited method. Use `Object.hasOwn` to distinguish own data from inherited behavior.

## Delegation

`Object.create(proto)` builds an object delegating directly to `proto` without invoking a constructor. This is useful for explicit prototype composition and dictionary objects with a null prototype.

## Classes

Class syntax creates prototype methods and constructor behavior with additional semantics such as strict mode, private fields and derived-constructor rules. Classes do not replace prototype delegation; they provide a structured syntax over it.

## Performance

Changing an object’s prototype after creation can invalidate engine optimizations. Create objects with the intended prototype and stable property shape. Never modify global built-in prototypes in application code: it creates collisions, hidden behavior and security/compatibility risks.

## Composition versus inheritance

Inheritance is appropriate when the subtype genuinely preserves the base contract. Prefer composition for capabilities that vary independently.

```javascript
const withAudit = service => ({
  ...service,
  async execute(command) {
    const result = await service.execute(command)
    await writeAudit(command, result)
    return result
  },
})
```

Mixins copy or install behavior but can hide conflicts and requirements. Document their expected receiver contract and avoid deep hierarchies.

## Primary references

- [ECMA-262 ordinary object internal methods](https://tc39.es/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots)
- [MDN inheritance and prototype chain](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain)
