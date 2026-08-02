---
title: Object-Oriented Programming
description: Encapsulation, polymorphism, SOLID, factories, dependency injection and domain modeling.
---

# Object-Oriented Programming

Object-oriented design groups state and behavior behind contracts. JavaScript supports it through objects, prototypes, classes, factories and closures.

## Core ideas

- **encapsulation:** protect invariants behind operations;
- **abstraction:** expose what a collaborator needs, hide volatile details;
- **polymorphism:** several implementations satisfy one behavioral contract;
- **inheritance:** delegate behavior through a prototype relation;
- **composition:** assemble capabilities from collaborators.

```javascript
class Subscription {
  #status = 'trial'
  activate(paymentReference) {
    if (!paymentReference) throw new TypeError('payment reference required')
    if (this.#status !== 'trial') throw new Error('invalid transition')
    this.#status = 'active'
  }
  get status() { return this.#status }
}
```

A rich model protects transitions. An anemic record can still be appropriate for transport or persistence; do not add methods merely to appear object-oriented.

## Polymorphism by contract

JavaScript uses structural conventions at runtime. Validate required collaborators at construction boundaries and document their methods.

```javascript
function createCheckout({paymentGateway, orderRepository}) {
  return {
    async execute(command) {
      const order = await orderRepository.get(command.orderId)
      const receipt = await paymentGateway.capture(order.total)
      return order.markPaid(receipt.id)
    },
  }
}
```

## SOLID in JavaScript

Single responsibility means one reason to change, not one method. Open/closed favors extension points over condition chains. Liskov substitution requires preserved behavior, not matching method names. Interface segregation keeps collaborator contracts narrow. Dependency inversion makes policy depend on abstractions supplied from outside.

## Dependency injection

Constructor or factory parameters are often enough. A container may help large graphs, but global service locators hide dependencies and complicate tests.

## Inheritance trade-offs

Use inheritance when the subtype is behaviorally substitutable and the hierarchy is stable. Prefer composition for optional capabilities, integrations and policies. Deep inheritance couples subclasses to protected details and fragile initialization order.

## Testing

Test public behavior and invariant preservation. Use real value objects and lightweight fakes; mock external boundaries rather than every internal method. Contract tests keep alternative implementations aligned.

## Review questions

Who owns the state? Which operations preserve invariants? Can one implementation replace another? Are dependencies explicit? Does a class provide identity/lifecycle value, or would a function and record be clearer?

## Primary references

- [ECMA-262 objects](https://tc39.es/ecma262/#sec-objects)
- [ECMA-262 classes](https://tc39.es/ecma262/#sec-class-definitions)
