---
title: Senior Backend Design Patterns
---

# Senior Backend Design Patterns

Patterns are reusable trade-offs, not mandatory class diagrams.

## Result / explicit outcomes

Use explicit result types/objects when expected domain failures are common and callers benefit from exhaustive handling. Use exceptions for exceptional failure where that model is clearer. Consistency matters more than dogma.

## Command/query separation

Separate mutation intent from read models conceptually. This clarifies authorization, transaction boundaries, idempotency, and caching even without separate infrastructure.

## Repository + adapter

Keep persistence/network details behind application-owned contracts when the boundary is meaningful. Do not create pass-through abstractions that add names without reducing coupling.

## Factory / DI

Construct services with explicit dependencies and lifecycle ownership. This makes config, clocks, IDs, DB, queue, and telemetry replaceable in tests and visible in architecture.

## Pipeline/middleware

Use for genuinely cross-cutting stages—auth, validation, telemetry—not core business branching that becomes invisible.

## Outbox

Commit business state + pending event atomically, then publish asynchronously. Consumers remain idempotent.

## Idempotency key

Bind caller + operation + key to durable request state/result. Concurrent duplicates must resolve atomically.

## Cache-aside

Application reads cache then source, and populates cache with explicit TTL/invalidation/stampede strategy.

## Circuit breaker / bulkhead

Breaker reduces calls to a failing dependency; bulkhead reserves separate capacity. Both require metrics, tuning, and failure-mode tests.

## Worker pool

Bound CPU parallelism and queue. Expose queue age/rejections/worker utilization and cancellation.

## Shutdown manager

Register owned resources with one idempotent shutdown coordinator and a global deadline.

## Error taxonomy

Define stable categories: validation, authn, authz, conflict, not found, transient dependency, permanent dependency, cancellation, internal invariant. Map them at boundaries.
