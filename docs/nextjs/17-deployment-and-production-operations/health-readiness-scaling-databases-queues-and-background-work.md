---
title: Health, Readiness, Scaling, Databases, Queues & Background Work
sidebar_position: 7
description: Design production readiness, scale-out, database connection management, durable jobs, object storage, rate limits, and capacity boundaries around a Next.js server.
---

# Health, Readiness, Scaling, Databases, Queues & Background Work

A healthy Node process is not the same as a healthy application.

Production readiness means the application can safely accept its intended traffic with the dependencies and state required for that traffic.

## 1. Liveness vs readiness

Use two different questions.

### Liveness

```text
Should this process be restarted?
```

Examples:

- event loop permanently wedged
- fatal startup corruption
- process cannot make forward progress

### Readiness

```text
Should this instance receive new traffic now?
```

Examples:

- startup not complete
- draining for shutdown
- required DB unavailable
- migration gate not satisfied
- critical dependency unavailable

Do not make every transient downstream failure a liveness failure or orchestration may create a restart storm.

## 2. Health endpoint ownership

A Route Handler can expose a health/readiness endpoint when appropriate.

Keep it:

- cheap
- authenticated/private if it reveals infrastructure details
- bounded by short timeouts
- independent from fragile optional services

Example conceptual responses:

```text
/live  → process is alive
/ready → safe to receive traffic
```

The exact path and security policy are deployment-specific.

## 3. Do not query every dependency on every health probe

If 100 replicas are probed every second and each readiness probe hits the DB plus five services, health checks become production load.

Prefer:

- local startup state
- cached recent dependency health
- lightweight critical checks
- low probe frequency appropriate to failover needs

## 4. Startup sequence

A production instance may need:

```text
load config
validate secrets
initialize telemetry
connect/warm DB client
verify schema compatibility
start server
mark ready
```

Do not accept traffic before required initialization is complete.

## 5. Horizontal scaling

Adding replicas increases application capacity only if shared dependencies can support the concurrency.

```text
3 pods × 20 DB connections = 60
30 pods × 20 DB connections = 600
```

Autoscaling the web layer can overload the database.

Scale the system, not only the HTTP process count.

## 6. Database connection pools

Pool size should consider:

- replica count
- DB max connections
- expected concurrent requests
- query duration
- transaction duration
- serverless/container lifecycle

Avoid creating a new connection/client for every request.

Use the database library's recommended server lifecycle pattern.

## 7. Serverless and burst scaling

Ephemeral runtimes can create many concurrent instances rapidly.

Risks:

- connection storms
- cold starts
- repeated SDK initialization
- local cache fragmentation
- repeated expensive startup

Managed DB proxies/poolers can help depending on the database/platform.

Do not assume serverless scale is infinite backend capacity.

## 8. Autoscaling signals

Possible signals:

```text
CPU
memory
request concurrency
queue length
latency
custom saturation metric
```

CPU alone may miss an I/O-bound app whose DB pool is saturated.

Use signals tied to the real bottleneck.

## 9. Minimum capacity

Scale-to-zero can reduce cost but may introduce startup latency.

For latency-sensitive services, maintain warm capacity according to SLO and traffic pattern.

Measure real cold-start impact before choosing minimum replicas.

## 10. Maximum capacity

A maximum replica count can protect shared dependencies.

If the DB can safely support 200 application connections, do not let autoscaling produce 1,000 connections.

Backpressure is healthier than uncontrolled collapse.

## 11. Rate limiting

Rate limiting can live at several layers.

Platform/CDN:

- IP/network abuse
- volumetric protection

Application/shared state:

- account quota
- API key quota
- tenant quota
- business operation limits

Distributed application limits require shared state or a platform service; process-local counters are inconsistent across replicas.

## 12. Queue durable work

Use a queue when work must survive request/process lifecycle.

Examples:

- email
- large export
- webhook fan-out
- media processing
- long AI task
- search indexing
- billing reconciliation

Flow:

```text
request
→ validate/auth
→ durable enqueue
→ return accepted/job id
→ worker executes
→ status/event updates
```

## 13. Idempotent job processing

Workers can receive duplicate jobs due to retries or visibility timeouts.

Design important side effects so repeated delivery does not create repeated irreversible effects.

Use:

- idempotency key
- unique DB constraint
- processed-event table
- provider idempotency mechanism

as appropriate.

## 14. Outbox pattern

A common reliability problem:

```text
DB commit succeeds
queue publish fails
```

Now the business state changed but the follow-up job never exists.

An outbox records the event in the same transaction as the business change, then a worker publishes/processes it durably.

Phase 07 introduced this pattern; Phase 17 owns its operational delivery.

## 15. Dead-letter queues

Repeatedly failing jobs should not retry forever.

Define:

```text
max attempts
backoff
DLQ/dead-letter state
alerting
manual replay policy
poison-message handling
```

Never expose secret payloads casually in queue dashboards.

## 16. Queue backpressure

If producers create 10,000 jobs/minute and workers process 1,000/minute, backlog grows without bound.

Monitor:

- queue depth
- oldest message age
- processing rate
- failure rate
- retry rate

Scale workers or throttle producers before latency becomes unacceptable.

## 17. `after()` vs queue

Use `after()` for bounded response-lifecycle follow-up that can be completed while the server remains alive.

Use durable queues for work that must survive:

- process crash
- host loss
- deployment
- long execution
- retries
- delayed scheduling

This distinction is architectural.

## 18. Object storage

User uploads and generated files should generally live in durable object/file storage, not instance-local disk.

Pattern:

```text
browser
→ short-lived signed upload capability
→ object storage
→ application stores metadata/reference
```

Benefits:

- avoids web process memory/body path
- durable across replicas/restarts
- scalable delivery

Security still requires tenant/resource authorization and bounded capabilities.

## 19. Downloads

For large files, prefer object storage/CDN delivery through authorized signed URLs where suitable instead of proxying every byte through Next.js.

Do not make signed URLs excessively long-lived or reusable beyond the intended scope.

## 20. Scheduled work

Cron/scheduler work should run in infrastructure that guarantees the intended schedule semantics.

Do not rely on “one of the web replicas probably runs this timer.”

With multiple replicas that produces duplicates; with autoscaling it may produce none.

Use:

- managed scheduler
- queue scheduler
- dedicated worker

with idempotency.

## 21. Leader election

If exactly one process must own periodic coordination, use an explicit leader/lease mechanism.

Do not infer leadership from pod index or startup order unless the platform contract guarantees it.

## 22. Memory and OOM

Monitor:

- RSS/heap
- GC time
- large buffers
- request body size
- cache size
- SDK queues

A container OOM kill looks different from an application exception.

Correlate orchestrator events with app telemetry.

## 23. CPU saturation

CPU-heavy work can block request throughput.

Examples:

- PDF generation
- image/video processing
- large synchronous parsing
- crypto loops

Move sustained CPU-heavy jobs to dedicated workers/services when they compete with latency-sensitive web requests.

## 24. Dependency circuit breaking/degraded mode

When an optional service is down, decide whether the page can continue.

```text
account data required → fail controlled
recommendations optional → omit/degrade
analytics optional → queue/drop according to policy
```

This reduces blast radius.

## 25. Capacity test

A load test should model:

- realistic route mix
- authenticated/public split
- cold/warm cache
- mutation rate
- database capacity
- queue production
- third-party rate limits

A single `GET /` benchmark is not capacity planning.

## 26. Scaling safety checklist

Before increasing replica count:

- [ ] DB pool total remains safe
- [ ] shared caches can handle concurrency
- [ ] rate limits are distributed where required
- [ ] Server Action/build keys are coherent
- [ ] local disk is not durable state
- [ ] queues absorb durable asynchronous work
- [ ] readiness protects startup/shutdown
- [ ] telemetry cardinality/cost scales reasonably

## Interview questions

### Why can autoscaling the Next.js tier make an outage worse?

Because every new replica may increase database connections, cache misses, upstream requests, and initialization load. If the shared dependency is already saturated, scaling the callers amplifies the bottleneck.

### When should you use a queue instead of `after()`?

When the work must survive process failure or deployment, needs retries/scheduling, may run for a long time, or requires durable delivery semantics.

## Exercise

Design production capacity for:

```text
20 replicas maximum
PostgreSQL max 200 connections
Redis shared cache
email queue
large file uploads
```

Specify pool limits, readiness, autoscaling signal, upload flow, queue retry/DLQ policy, and what happens when PostgreSQL or Redis is unavailable.
