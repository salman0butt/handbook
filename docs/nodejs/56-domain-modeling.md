---
title: Domain Modeling
---

# Domain Modeling

Domain modeling puts business invariants where they can be understood and tested independently of Express, SQL, or queue libraries.

## Entity vs value object

An entity has identity across changes. A value object is defined by its value and can often be immutable.

```js
class Money {
  constructor(amount, currency) {
    if (!Number.isInteger(amount)) throw new Error('minor units required');
    this.amount = amount;
    this.currency = currency;
    Object.freeze(this);
  }
}
```

## Invariants

Do not represent impossible state and hope controllers remember rules.

```text
untrusted DTO
   ↓ parse/validate
command
   ↓ domain behavior
valid state transition
   ↓ persistence/events
```

## Aggregates

An aggregate is a conceptual consistency boundary around related entities/value objects and invariants. Do not turn every table into an aggregate or load huge graphs merely to follow a pattern.

## Commands and queries

Commands ask to change state; queries read. Separating them conceptually helps reason about permissions, transactions, side effects, and performance even without adopting full CQRS infrastructure.

## Domain events

Domain events describe facts meaningful to the business. Keep them distinct from infrastructure events such as “Kafka message received.”

## Persistence separation

A domain model should not need an Express request or ORM session to enforce its core rules. Repositories/adapters translate storage concerns at the boundary.
