---
title: API Architecture
---

# API Architecture

Good architecture makes change local and dependency direction obvious.

## Layered model

```text
transport (HTTP/queue/CLI)
        ↓
application use cases
        ↓
domain model/policies
        ↓ interfaces/ports
infrastructure adapters → DB/APIs/broker
```

Infrastructure depends on domain/application contracts, not the other way around where practical.

## Vertical slices

Instead of giant global `controllers/`, `services/`, `utils/`, group code by capability/domain while keeping internal layers clear.

```text
orders/
  create-order/
  cancel-order/
  domain/
  persistence/
```

## DTOs and schemas

Transport DTOs represent external contracts; domain objects represent invariants; persistence models represent storage. They may share fields but have different owners/evolution pressures.

## Ports/adapters

An application service can depend on an `OrderRepository` interface/contract while PostgreSQL is one adapter. Avoid creating interfaces for every function mechanically; abstract where a boundary actually matters.

## Public contracts

Version APIs/events/packages deliberately. Internal refactoring should not accidentally become a consumer breaking change.

## Dependency injection

DI can be simple constructor/function parameters. A framework container is optional.

```js
export const createOrderService = ({orders, payments, clock}) => ({
  async create(input) { /* ... */ }
});
```

Explicit dependencies improve testing and architecture review.
