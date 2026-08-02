---
title: Modular Monolith
description: A modular monolith deploys one application while enforcing explicit domain, dependency, data, and communication boundaries inside it.
---

# Modular Monolith

## Concept

A modular monolith deploys one application while enforcing explicit domain, dependency, data, and communication boundaries inside it.

## Why It Exists

It provides transactional simplicity and operational efficiency without accepting an unstructured big ball of mud.

## Mental Model

```mermaid
flowchart LR
  A["HTTP or job entry"]
  B["Bounded module"]
  C["Module-owned data and ports"]
  D["In-process integration or outbox"]
  A --> B
  B --> C
  C --> D
```

Treat every arrow as a boundary with a cost, ownership rule, cancellation behavior, and failure mode. Node.js is effective when those boundaries are explicit instead of hidden behind framework defaults.

## How It Works

The JavaScript callback runs on the main JavaScript thread. Native Node.js bindings, libuv, the operating system, worker threads, child processes, or remote services may perform work elsewhere. Completion only becomes useful when control returns to JavaScript. Under load, the important questions are what is queued, what is bounded, what can be cancelled, and which resource saturates first.

## Example

```ts
export interface OrdersPort {
  place(command: {tenantId: string; productId: string; quantity: number}): Promise<{orderId: string}>;
}

export class CheckoutService {
  constructor(private readonly orders: OrdersPort) {}
  checkout(command: Parameters<OrdersPort['place']>[0]) {
    return this.orders.place(command);
  }
}
```

The example is intentionally small enough to execute, but the production boundary is the important part: validate inputs, establish a deadline, propagate cancellation, classify failures, and release resources deterministically.

## Production Use

Organize by business capability, expose public module APIs, keep database ownership explicit, forbid cross-module table access, and use domain events or ports for collaboration.

## Security

Authorization and tenant policy should remain consistent across modules; internal calls are not automatically trusted.

## Performance

In-process calls are fast, but shared deployments and databases can create contention. Measure modules separately and preserve extraction seams.

## Common Mistakes

- A shared folder that every module imports.
- Direct cross-module repository access.
- Splitting into microservices before boundaries are stable.

## Debugging

Add module-aware logs, dependency checks, architecture tests, and per-module latency/error metrics.

## Testing

Test modules through public APIs, shared transaction cases, boundary violations, and outbox/event behavior.

## When Not to Use It

Do not force independent scaling or isolation needs into one process when they are proven and substantial.

## Interview Questions

- Modular monolith vs layered monolith?
- How do you enforce module boundaries?
- When should a module become a service?

## Official References

- [nodejs.org](https://nodejs.org/api/)
- [nodejs.org](https://nodejs.org/en/about/previous-releases)
