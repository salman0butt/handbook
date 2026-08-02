---
title: Microservices, Serverless and Backend for Frontend
description: Service decomposition, serverless execution, API gateways, and BFFs trade local simplicity for network, deployment, ownership, and platform boundaries.
---

# Microservices, Serverless and Backend for Frontend

## Concept

Service decomposition, serverless execution, API gateways, and BFFs trade local simplicity for network, deployment, ownership, and platform boundaries.

## Why It Exists

These architectures are useful only when their independent scaling, ownership, release, security, or product benefits exceed distributed-system cost.

## Mental Model

```mermaid
flowchart LR
  A["Client or event"]
  B["Gateway or BFF"]
  C["Service or function"]
  D["Owned data and integration"]
  A --> B
  B --> C
  C --> D
```

Treat every arrow as a boundary with a cost, ownership rule, cancellation behavior, and failure mode. Node.js is effective when those boundaries are explicit instead of hidden behind framework defaults.

## How It Works

The JavaScript callback runs on the main JavaScript thread. Native Node.js bindings, libuv, the operating system, worker threads, child processes, or remote services may perform work elsewhere. Completion only becomes useful when control returns to JavaScript. Under load, the important questions are what is queued, what is bounded, what can be cancelled, and which resource saturates first.

## Example

```ts
type Downstream = {
  getProfile(userId: string, signal: AbortSignal): Promise<unknown>;
  getOrders(userId: string, signal: AbortSignal): Promise<unknown>;
};

async function dashboard(api: Downstream, userId: string, signal: AbortSignal) {
  const [profile, orders] = await Promise.all([
    api.getProfile(userId, signal),
    api.getOrders(userId, signal),
  ]);
  return {profile, orders};
}
```

The example is intentionally small enough to execute, but the production boundary is the important part: validate inputs, establish a deadline, propagate cancellation, classify failures, and release resources deterministically.

## Production Use

Define service/data ownership, timeout budgets, retries, idempotency, contracts, observability, deployment autonomy, cold-start behavior, and gateway responsibilities.

## Security

Authenticate at ingress but authorize in the owning service, secure service identity, isolate tenants, and prevent gateway overreach.

## Performance

Network fan-out increases tail latency and failure probability. Serverless adds cold starts and connection-management constraints.

## Common Mistakes

- Shared database tables across independently deployed services.
- One BFF containing all business logic.
- Microservices to let teams avoid modularity inside code.

## Debugging

Use distributed traces, contract versions, dependency graphs, cold-start metrics, and per-service saturation.

## Testing

Test contract compatibility, partial failure, retry storms, cold starts, duplicate events, and independent rollout.

## When Not to Use It

Do not use microservices when one team and one deployment can meet the requirements more safely as a modular monolith.

## Interview Questions

- When not to use microservices?
- What belongs in a BFF?
- How does serverless change database pooling?

## Official References

- [nodejs.org](https://nodejs.org/api/)
- [nodejs.org](https://nodejs.org/en/about/previous-releases)
