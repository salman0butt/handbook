---
title: JavaScript Design Patterns
description: Pattern intent, implementation trade-offs, misuse and alternatives for production JavaScript.
slug: /javascript/patterns/design-patterns
---

# JavaScript Design Patterns

A pattern names a recurring design problem and trade-off. Start from the problem; do not add pattern classes merely to match a catalog.

## Creational patterns

**Factory** hides construction and can return variants. **Builder** accumulates a complex valid configuration. **Singleton** guarantees one instance but often becomes hidden global state; module caching already provides one module instance per resolved module graph in many hosts.

```javascript
export function createRepository({storage, clock}) {
  return {
    async save(entity) {
      return storage.put({...entity, updatedAt: clock.now()})
    },
  }
}
```

## Structural patterns

**Adapter** translates one interface to another. **Facade** exposes a simpler surface over a subsystem. **Decorator** wraps behavior without changing the wrapped contract. **Proxy** controls access or defers work; JavaScript’s Proxy object is one implementation technique, not the pattern itself.

## Behavioral patterns

**Strategy** injects an interchangeable algorithm. **State** moves state-specific behavior behind state objects or a transition table. **Command** represents a request as data/object. **Observer/pub-sub** distributes notifications. **Chain of responsibility** passes a request through handlers. **Iterator** standardizes sequence consumption.

```javascript
const strategies = {
  standard: order => order.total * 0.05,
  express: order => Math.max(20, order.total * 0.12),
}

function shippingCost(order) {
  const strategy = strategies[order.shippingMethod]
  if (!strategy) throw new RangeError('unsupported shipping method')
  return strategy(order)
}
```

## Application patterns

**Repository** abstracts persistence for a domain use case, but should not erase every useful database capability. **Dependency injection** supplies collaborators. **Middleware** composes request/response interceptors. **Pipeline** connects transformations. **Plugin architecture** loads capability modules behind a versioned contract.

```mermaid
flowchart LR
  R["Request"] --> M1["auth middleware"]
  M1 --> M2["validation middleware"]
  M2 --> H["handler"]
  H --> M2
  M2 --> M1
```

## Pattern review template

For every proposed pattern, write:

1. the concrete problem and forces;
2. the smallest implementation;
3. ownership and failure behavior;
4. advantages and disadvantages;
5. testing approach;
6. simpler alternatives;
7. removal or migration cost.

## Common misuse

Factories that merely call `new`, repositories that mirror every table, global event buses, one-instance “singletons” with mutable state, inheritance-heavy template methods and plugin systems before a second plugin exists all add indirection without demonstrated value.

## Primary references

Patterns are design knowledge rather than ECMAScript features; their JavaScript mechanics rest on modules, functions, objects, prototypes and classes in ECMA-262.
