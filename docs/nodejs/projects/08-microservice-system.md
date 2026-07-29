---
title: Project 8 — Microservice System
---

# Project 8 — Microservice System

Build orders, payments, and inventory services with separate data ownership, HTTP APIs, event broker, retries/idempotency, tracing, event versioning, resilience, and Docker deployment.

## Requirements

No shared DB tables. Order creation coordinates inventory and payment through a durable workflow. Use outbox, at-least-once event handling, idempotent consumers, explicit timeouts/retries, trace propagation, schema versioning, readiness/shutdown.

## Architecture

```text
Orders DB ← Orders svc → broker ← Inventory svc → Inventory DB
                       ↕
                   Payments svc → Payments DB/provider
```

## Runtime model

Each service has independent event loop, pools, memory, failures, versions, and deployment. Network calls replace former function calls and create ambiguous outcomes.

## Milestones

Service contracts → data ownership → sync happy path → broker/outbox → workflow state machine → idempotency → tracing → failure drills.

## Acceptance criteria

Payment success + lost response cannot charge twice; duplicate inventory event does not reserve twice; old/new event versions coexist during deploy; one service outage does not exhaust every caller through retries; traces cross HTTP and broker.

## Security

Service identity/authz, least-privilege DB users, secret separation, TLS where required, event authorization, tenant boundaries.

## Performance

Measure end-to-end workflow latency, per-service p99, broker lag, pool waiting, retry amplification, serialization volume.

## Testing

Contract tests, integration tests per service, end-to-end workflow, duplicate/reordered event, timeout, broker outage, rolling mixed versions.

## Failure modes

Partial transaction, poisoned event, schema incompatibility, retry storm, queue backlog, stale service discovery, provider outage.

## Observability

Trace ID/event ID/order ID, workflow state transitions, DLQ, retry count, dependency latency, SLO per service.

## Deployment

Docker Compose/local environment then independent container deployments; expand/contract contracts; one-service canaries.

## Common mistakes

Shared database, synchronous call chain for everything, no idempotency, “exactly once” assumption, deploying all services together.

## Stretch goals

Saga orchestration vs choreography comparison, schema registry, chaos tests, Kubernetes.

## Interview questions

Why choose microservices here? What failure did the monolith not have? How do you recover an order stuck between payment and inventory?

## Design review

Argue whether this system should actually remain a modular monolith at current scale.
