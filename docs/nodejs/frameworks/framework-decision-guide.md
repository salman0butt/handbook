---
title: Express vs Fastify vs NestJS
description: Framework choice balances flexibility, schema discipline, performance model, ecosystem, team conventions, and architectural needs.
---

# Express vs Fastify vs NestJS

## Concept

Framework choice balances flexibility, schema discipline, performance model, ecosystem, team conventions, and architectural needs.

## Why It Exists

A decision guide prevents cargo-cult migrations and helps teams state which problems a framework must solve.

## Mental Model

```mermaid
flowchart LR
  A["Requirements"]
  B["Team and ecosystem"]
  C["Framework trade-offs"]
  D["Validated choice"]
  A --> B
  B --> C
  C --> D
```

Treat every arrow as a boundary with a cost, ownership rule, cancellation behavior, and failure mode. Node.js is effective when those boundaries are explicit instead of hidden behind framework defaults.

## How It Works

The JavaScript callback runs on the main JavaScript thread. Native Node.js bindings, libuv, the operating system, worker threads, child processes, or remote services may perform work elsewhere. Completion only becomes useful when control returns to JavaScript. Under load, the important questions are what is queued, what is bounded, what can be cancelled, and which resource saturates first.

## Example

```ts
type Needs = {conventions: boolean; schemaFirst: boolean; minimal: boolean};

function choose(n: Needs): 'Express' | 'Fastify' | 'NestJS' {
  if (n.conventions) return 'NestJS';
  if (n.schemaFirst) return 'Fastify';
  return 'Express';
}
console.log(choose({conventions: false, schemaFirst: true, minimal: false}));
```

The example is intentionally small enough to execute, but the production boundary is the important part: validate inputs, establish a deadline, propagate cancellation, classify failures, and release resources deterministically.

## Production Use

Prototype one representative endpoint with validation, auth, DB access, errors, logs, tests, and shutdown before standardizing.

## Security

Evaluate maintenance, vulnerability response, plugin trust, default security posture, and how authorization is expressed.

## Performance

Compare realistic p95/p99, memory, startup, serialization, and developer throughput. Framework overhead is often smaller than database or network cost.

## Common Mistakes

- Migrating frameworks to fix a database bottleneck.
- Selecting from raw requests-per-second alone.
- Ignoring organizational conventions and hiring needs.

## Debugging

Build a decision record with measured evidence and revisit it only when constraints change.

## Testing

Run the same contract and load tests against prototypes; compare operability, not only code length.

## When Not to Use It

Do not create an internal framework unless repeated needs, ownership, versioning, and support justify the cost.

## Interview Questions

- Why might Fastify outperform Express?
- When does NestJS provide value?
- How would you evaluate a framework migration?

## Official References

- [nodejs.org](https://nodejs.org/api/)
- [nodejs.org](https://nodejs.org/en/about/previous-releases)
