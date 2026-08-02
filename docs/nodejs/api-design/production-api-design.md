---
title: Production API Design
description: A production API models resources and actions with stable semantics for URLs, methods, status codes, validation, errors, pagination, idempotency, versioning, and observability.
---

# Production API Design

## Concept

A production API models resources and actions with stable semantics for URLs, methods, status codes, validation, errors, pagination, idempotency, versioning, and observability.

## Why It Exists

Clients depend on behavior over time, so API design is an organizational contract rather than a route naming exercise.

## Mental Model

```mermaid
flowchart LR
  A["Client intent"]
  B["HTTP contract"]
  C["Application use case"]
  D["State and response"]
  A --> B
  B --> C
  C --> D
```

Treat every arrow as a boundary with a cost, ownership rule, cancellation behavior, and failure mode. Node.js is effective when those boundaries are explicit instead of hidden behind framework defaults.

## How It Works

The JavaScript callback runs on the main JavaScript thread. Native Node.js bindings, libuv, the operating system, worker threads, child processes, or remote services may perform work elsewhere. Completion only becomes useful when control returns to JavaScript. Under load, the important questions are what is queued, what is bounded, what can be cancelled, and which resource saturates first.

## Example

```ts
type Problem = {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
};

function conflict(detail: string): Problem {
  return {type: 'https://example.com/problems/conflict', title: 'Conflict', status: 409, detail};
}
```

The example is intentionally small enough to execute, but the production boundary is the important part: validate inputs, establish a deadline, propagate cancellation, classify failures, and release resources deterministically.

## Production Use

Use cursor pagination for mutable large collections, request IDs, problem details, OpenAPI, idempotency keys, explicit version policy, and webhook signature/replay defenses.

## Security

Authenticate and authorize separately, prevent object-level access failures, limit expensive filters, and avoid sensitive details in errors.

## Performance

Page caps, sparse fields, query planning, compression, cache semantics, and serialization dominate API cost under load.

## Common Mistakes

- Using 200 for every outcome.
- Offset pagination on frequently mutating high-volume data without understanding drift.
- Calling a POST idempotent without durable storage.

## Debugging

Record contract version, route, status, error type, request ID, query shape, and downstream timings.

## Testing

Use schema, compatibility, contract, idempotency, concurrency, and failure tests; test generated SDKs against a deployed test service.

## When Not to Use It

Do not expose internal database models directly as public resources.

## Interview Questions

- What makes an operation idempotent?
- Cursor vs offset pagination?
- How do you evolve a public API without breaking clients?

## Official References

- [www.rfc-editor.org](https://www.rfc-editor.org/rfc/rfc9110)
- [www.rfc-editor.org](https://www.rfc-editor.org/rfc/rfc9457)
