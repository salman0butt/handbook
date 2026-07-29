---
title: Project 1 — Production REST API
---

# Project 1 — Production REST API

Build an order-management API that demonstrates raw Node runtime knowledge **and** framework-level delivery.

## Requirements

Implement users, products, orders, authentication, resource authorization, validation, filtering/sorting, cursor pagination, idempotent order creation, PostgreSQL persistence, structured logs, tests, graceful shutdown, and Docker packaging. First build one thin endpoint with `node:http`; then implement the production surface with Express, Fastify, or NestJS and explain what the framework adds.

## Architecture

```text
HTTP
 ↓ validation/auth
controller
 ↓
application use case
 ↓
domain policies
 ↓
repositories + adapters
 ↓
PostgreSQL / cache / event outbox
```

Transport DTOs must not be raw DB rows. Parse config once at startup. Use a bounded DB pool and parameterized SQL/driver query APIs.

## Runtime model

HTTP sockets are handled asynchronously; JS request handlers run on the main thread; DB calls wait on network/driver resources; serialization and validation execute on the JS thread. Identify every synchronous CPU path that can delay all requests.

## Milestones

1. raw Node `/health` + `/runtime` endpoint;
2. config + validation + error taxonomy;
3. DB pool/migrations/repository;
4. authn/authz;
5. order workflow + idempotency;
6. pagination/filter/sort;
7. observability + shutdown;
8. Docker + CI + load test.

## Acceptance criteria

- duplicate idempotency key cannot create duplicate order under concurrent requests;
- unauthorized tenant cannot read another tenant's order;
- payloads above configured limit are rejected early;
- every dependency call has a deadline;
- `SIGTERM` stops new traffic and drains in-flight work;
- CI runs unit + DB integration + API tests;
- p95/p99 and DB-pool waiting are measured under load.

## Security

Use password KDF, secure session/token design, parameterized queries, strict runtime validation, secrets outside source, safe CORS/proxy configuration, rate limits on auth/write paths, and redacted logs.

## Performance

Avoid N+1 queries, cap page sizes, stream only where payloads justify it, and load test with realistic DB latency/cache behavior. Watch event-loop delay and pool saturation rather than only RPS.

## Testing

Unit-test domain services; integration-test real PostgreSQL constraints/transactions; API-test validation/authz/idempotency; spawn the service for shutdown/signal tests.

## Failure modes

DB unavailable, DB slow, pool exhausted, duplicate POST retry, token expiry, cache outage, client disconnect, queue/outbox publisher down, process terminated mid-request.

## Observability

Request ID, route, status, duration, error taxonomy, DB pool active/waiting, query duration, event-loop delay, memory, idempotency conflict count, and deployment version.

## Deployment

Non-root Docker image on Node 24 LTS, immutable artifact, readiness/liveness, migration gate, rolling deployment, rollback plan.

## Common mistakes

Business logic in controllers, `process.env` everywhere, `Promise.all` over huge query fan-out, raw errors sent to clients, no query timeout, no shutdown budget.

## Stretch goals

OpenAPI contract, outbox publisher, Redis cache with stampede protection, OTel traces, canary deployment, chaos test for DB latency.

## Interview questions

- Why can this server handle many open connections with one main JS thread?
- Where can event-loop blocking happen in your implementation?
- How does idempotency remain correct across replicas?
- Why is DB pool size a distributed capacity decision?

## Design review

Defend module boundaries, transaction scope, retry policy, authz placement, timeout budget, DB indexes, telemetry, and the first scaling bottleneck you expect.
