---
title: Capstone — Production Node.js Platform
---

# Capstone — Production Node.js Platform

Combine the entire handbook into a production-grade commerce/operations platform.

## Requirements

Frontend-facing API, internal service/module boundaries, PostgreSQL, Redis cache/session/rate limits, durable queue, real-time WebSocket path, worker-thread CPU pool for one measured workload, runtime validation, authn/authz, test pyramid, OTel observability, graceful shutdown, Docker/Kubernetes, CI/CD, horizontal scaling, failure handling, incident runbooks, architecture decision records.

## Architecture

```text
clients
  ├─ HTTP API ───────────┐
  └─ WebSocket gateway ──┤
                         ↓
                  application/domain
              ┌──────────┼──────────┐
              ↓          ↓          ↓
         PostgreSQL    Redis      outbox/queue
                                   ↓
                            background workers
                              ├─ I/O jobs
                              └─ CPU worker pool
```

Split into services only where you can defend the boundary; a strong modular monolith plus worker deployment is an acceptable capstone if design reasoning is stronger.

## Runtime model

Document for every arrow: main JS thread, libuv/OS I/O, thread pool, worker thread, child process, remote service, pool/queue capacity, cancellation path, retry semantics.

## Milestones

1. architecture + threat model + SLOs;
2. API/domain/data baseline;
3. auth + tenancy;
4. cache + idempotency;
5. outbox/jobs;
6. WebSockets;
7. CPU pool;
8. test/observability;
9. container/K8s/CI;
10. load test + failure injection + incident review.

## Acceptance criteria

- 300+ handbook interview questions can be answered using concrete capstone examples;
- no unbounded request/job/stream/worker queue;
- every network dependency has timeout/cancellation/retry policy;
- duplicate delivery and duplicate HTTP retry are safe;
- DB/cache/queue outages have defined degradation;
- rolling deploy keeps traffic available;
- runtime version upgrade runbook tested;
- p99/SLO and saturation dashboard drives scaling decision.

## Security

Threat model SSRF, injection, path/command execution, session/token theft, tenant isolation, secrets, dependency supply chain, container privileges, admin operations, WebSocket authorization.

## Performance

Create a bottleneck table with capacity, metric, target, overload behavior, and scaling action for JS CPU, memory, DB connections, HTTP connections, queue consumers, Redis, WebSocket connections, workers.

## Testing

Unit, DB integration, contract, API, queue duplicate/reorder, WebSocket reconnect, worker failure, signal shutdown, K8s rollout, load test, security regression.

## Failure modes

Incident drills: CPU spike, heap leak, external-memory leak, DB pool exhaustion, DNS failure, queue backlog, retry storm, Redis outage, provider latency, worker crash, partial deployment.

## Observability

Logs + metrics + traces share request/job/event IDs. Dashboards include RED, event-loop delay, RSS/heap/external, pool waits, queue age, retries, WebSocket pressure, worker queue.

## Deployment

Node 24 LTS production baseline, immutable multi-stage container, non-root, readiness/liveness/startup probes, graceful termination, migration gate, canary/rolling release.

## Common mistakes

Building every advanced feature before measuring need, microservices for resume value, “exactly once” claims, infrastructure without runbooks, dashboards with no SLO/owner.

## Stretch goals

Multi-region read path, chaos experiments, permission-model hardened worker, Wasm/native performance comparison, fleet runtime upgrade simulation.

## Interview questions

Use the capstone to answer: event loop under load, backpressure, worker vs process, auth boundaries, idempotency, graceful shutdown, distributed partial failure, observability, Node upgrade governance.

## Design review

Give a 30-minute staff-level presentation: requirements, runtime map, data ownership, failure model, security, SLO/capacity, deployment evolution, trade-offs, and what you deliberately did **not** build.
