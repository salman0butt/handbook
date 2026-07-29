---
title: Project 3 — Background Job System
---

# Project 3 — Background Job System

Build a durable email/report job system with producers, consumers, retries, dead-letter handling, idempotency, concurrency control, graceful shutdown, and operational dashboards.

## Requirements

Expose an API that enqueues jobs with stable IDs. Consumers validate versioned payloads, claim work, process with deadlines, acknowledge at the correct durability point, retry transient failures with exponential backoff + jitter, and route poison/permanent failures to a DLQ.

## Architecture

```text
API producer → broker/queue → worker pool → external provider
                    │              ↓
                    └──────── idempotency DB
                                   ↓
                                  DLQ
```

## Runtime model

Queue receive/send are I/O; job handler JS runs on event loop; template rendering may be CPU; provider calls are network; many handlers can be in flight concurrently. Bound consumer concurrency to provider/DB capacity.

## Milestones

Schema/envelope → producer → worker → idempotency store → retries → DLQ → graceful shutdown → metrics/replay tool.

## Acceptance criteria

Redelivery cannot send the same side effect twice when the provider supports/stores idempotency; invalid schema is not retried forever; worker termination leads to safe completion or redelivery; retry delay has jitter; queue age alert catches sustained backlog.

## Security

Authenticate producers, authorize job types, validate all payloads, avoid secrets/PII in queue body where unnecessary, encrypt transport/storage per platform, and protect replay/DLQ tooling.

## Performance

Measure service time, consumer utilization, queue age, provider concurrency, DB idempotency lookup latency, and memory per active job. Scale on age + downstream headroom.

## Testing

Duplicate delivery, crash after side effect before ack, provider 429/500/timeout, malformed payload, expired job, DLQ replay, shutdown during long work, 1000 concurrent producer requests.

## Failure modes

Broker unavailable, provider outage, retry storm, poison message, visibility lease expires, clock skew around schedules, idempotency DB unavailable.

## Observability

Produced/started/succeeded/failed/retried/dead-lettered counts, attempt number, queue age, handler latency, provider status, dedupe hit, active concurrency.

## Deployment

Separate API and worker deployments; independent autoscaling; worker termination grace exceeds normal job drain or lease renewal strategy.

## Common mistakes

Ack before durable effect, retries without idempotency, no max age/attempts, one global concurrency number for every job type, DLQ with no owner.

## Stretch goals

Per-tenant fairness, priorities, scheduled jobs, outbox producer, adaptive concurrency, replay UI.

## Interview questions

Why is exactly-once usually the wrong promise? What happens if the effect succeeds but ack fails? How do you prevent a retry storm?

## Design review

Draw every crash point between receive and acknowledge and explain resulting behavior.
