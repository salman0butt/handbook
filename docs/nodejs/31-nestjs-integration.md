---
title: NestJS Integration
---

# NestJS Integration

NestJS provides a structured application framework with modules, dependency injection, controllers, providers, guards, pipes, interceptors, filters, and lifecycle hooks. That structure helps large teams but can hide simple runtime behavior if learned before Node fundamentals.

```text
request
  ↓ middleware
  ↓ guards (may this caller proceed?)
  ↓ interceptors / pipes around transport flow
  ↓ controller
  ↓ provider/application service
  ↓ adapters/repositories
  ↓ response / exception filter mapping
```

## Modules and providers

Use modules to express cohesive boundaries. Providers are DI-managed dependencies. Avoid a global “shared everything” module that destroys dependency direction.

## Guards, pipes, interceptors, filters

- guards: authorization/access decisions;
- pipes: transform/validate transport values;
- interceptors: wrap execution for cross-cutting concerns;
- exception filters: map failures to transport responses.

Do not place core domain rules in these framework extension points unless the rule is genuinely transport/framework-level.

## Lifecycle

Database pools, queues, workers, telemetry, and server shutdown must cooperate with Nest lifecycle hooks **and** Node process signals/orchestrator deadlines.

## Testing

Unit-test domain/application logic without constructing the entire Nest container where possible. Use module/integration tests for DI wiring and e2e tests for HTTP contracts.

## Trade-offs

Nest improves conventions, discoverability, and enterprise structure; costs include framework abstraction, DI indirection, decorators/metadata, boot complexity, and the temptation to let framework folders become architecture.

**Rule:** domain boundaries should survive a hypothetical framework replacement.
