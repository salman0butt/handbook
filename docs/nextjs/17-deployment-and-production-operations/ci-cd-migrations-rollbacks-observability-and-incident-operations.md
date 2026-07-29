---
title: CI/CD, Migrations, Rollbacks, Observability & Incident Operations
sidebar_position: 8
description: Build a reliable release pipeline around Next.js with immutable artifacts, migration safety, deployment gates, rollback, observability, incident response, secret controls, and production verification.
---

# CI/CD, Migrations, Rollbacks, Observability & Incident Operations

Production delivery is a control system:

```text
change
→ validate
→ build
→ package
→ migrate
→ deploy
→ verify
→ observe
→ promote or rollback
```

The goal is not merely frequent deployment. It is **fast, reversible, evidence-based deployment**.

## 1. CI starts with reproducibility

A release pipeline should pin:

- source commit
- lockfile
- Node/runtime version
- package manager version
- build command
- environment class

Use frozen dependency installation so CI does not resolve a new graph silently.

## 2. Suggested pipeline layers

A practical sequence:

```text
lint / static checks
  ↓
unit/component/integration tests
  ↓
next build
  ↓
package immutable artifact
  ↓
production-like smoke/E2E
  ↓
security/performance checks
  ↓
publish artifact
  ↓
deploy candidate
  ↓
post-deploy verification
```

Not every repository uses the same tooling, but every gate should answer a specific release-risk question.

## 3. Build once, publish once

After CI produces the artifact, publish it under immutable identity.

Examples:

```text
container digest
release archive checksum
Git SHA tag
```

Promotion should reference that artifact rather than rebuilding source.

## 4. Separate build secrets from runtime secrets

CI may need:

- private registry token
- source-map upload token
- build-time CMS credential

Production runtime may need:

- database secret
- auth/session secret
- payment API key

Do not make one giant secret bundle available to every pipeline stage.

Apply least privilege.

## 5. Pull request validation vs deployment validation

PR validation proves the source can become a valid artifact.

Deployment validation proves the artifact works in the target environment.

Both are needed.

```text
PR tests pass
≠
production network/config/cache/database is healthy
```

## 6. Database migrations are part of deployment

Schema changes have their own lifecycle.

A migration can:

- lock a large table
- take minutes
- fill disk
- conflict with old app code
- make rollback impossible

Treat migrations as production changes with observability and rollback/forward-fix plans.

## 7. Expand/contract migrations

For zero-downtime systems, prefer compatible steps.

Example rename:

```text
release 1: add new column, keep old
release 2: write/read compatible shape, backfill
release 3: switch all reads
release 4: remove old column later
```

Avoid:

```text
drop old column
→ then deploy code that stopped using it
```

because old replicas may still be live.

## 8. Backfills

Large backfills should usually be bounded/background work, not a request path or a blocking application startup action.

Operationally track:

- rows remaining
- throughput
- failures
- DB load
- pause/resume

Use idempotent batches where possible.

## 9. Migration ownership

Do not let every new replica race to run the same migration unless the migration framework/platform explicitly guarantees safe coordination.

Common architecture:

```text
one migration job
→ success
→ application rollout
```

or another controlled migration stage.

## 10. Readiness after migration

If new code requires schema version N, an instance should not become ready against schema N-1.

But avoid expensive schema queries on every readiness probe.

Check compatibility during startup and retain a local readiness state.

## 11. Deployment strategies

### Rolling

Replace replicas gradually.

### Blue/green

Prepare full candidate environment, then switch traffic.

### Canary

Send a small fraction of traffic to the new release.

### Feature-flag rollout

Deploy code disabled, then enable capability separately.

A mature service can combine them.

## 12. Canary comparison

Compare candidate vs baseline on:

- 5xx/error rate
- p95/p99 latency
- Core Web Vitals where signal arrives fast enough
- DB/cache errors
- Server Action failures
- chunk/load/hydration errors
- queue backlog
- memory/CPU
- business correctness signal

Use release/deployment IDs for cohort separation.

## 13. Post-deploy smoke tests

Test the running deployment itself.

Examples:

```text
homepage document
static asset load
authenticated journey
representative mutation
Route Handler
Server Action
image optimization if used
streaming route if used
health/readiness
telemetry emission
```

Do not use destructive production test data unless explicitly isolated.

## 14. Synthetic checks

Continuous synthetic monitoring can catch:

- DNS/TLS failure
- CDN failure
- auth redirect loop
- critical route outage
- asset load problem

Use a controlled test account and minimal safe actions.

## 15. Observability deployment

A deployment should make release identity visible in:

```text
logs
traces
error events
metrics
browser telemetry
```

Phase 14 built the telemetry model; Phase 17 ensures the deployment actually exports it.

## 16. Telemetry exporter failure

Monitoring must not take down the product.

Choose bounded behaviour:

- async/batched export
- bounded queue
- timeout
- sampling
- drop/degrade when provider unavailable

Do not let an error-reporting SDK create an infinite error loop.

## 17. Source maps

If uploading private source maps to an error platform:

- bind them to exact release identity
- restrict access
- upload during CI
- retain according to debugging needs

If public browser source maps are enabled, treat source exposure as intentional.

## 18. Rollback artifact

Always know the exact previous healthy artifact.

```text
current = digest B
previous healthy = digest A
```

A rollback button that rebuilds an old branch is not a deterministic rollback.

## 19. Rollback vs forward fix

Rollback is best when:

- candidate code is the main cause
- state remains compatible
- rollback is faster/safer than patch

Forward fix may be required when:

- migration is irreversible
- new data format is already emitted
- external side effect occurred

The incident runbook should define this decision.

## 20. Feature flag kill switch

For risky capability, a server-controlled kill switch can stop impact without redeploying.

Requirements:

- authorization
- audit trail
- safe default
- known cache propagation
- tested failure behaviour

Do not rely on a client-only flag to disable server-side risk.

## 21. Secret leak incident

If a secret appears in logs/build/client output:

```text
stop further exposure
rotate/revoke credential
assess access logs
remove from active artifacts/config
purge/limit retained logs where policy permits
fix leak path
add regression
```

Deleting the original Git commit alone does not rotate a leaked credential.

## 22. CDN/cache incident

Possible actions:

- isolate bad route/key family
- purge specific version/paths
- disable cache feature temporarily
- route around unhealthy backend

Avoid full global purge when a scoped response is sufficient; a full purge can overload origins.

## 23. Database incident during deploy

If latency spikes after rollout:

- compare candidate/baseline query patterns
- check connection pool wait
- inspect migration locks
- check cache miss rate
- pause traffic promotion

Do not assume frontend release means frontend-only impact.

## 24. Queue incident

Monitor oldest-message age, not only queue count.

A stable queue size can still hide stuck messages if producers and consumers have both stopped.

Runbook should cover:

- worker rollback
- poison message isolation
- DLQ replay
- duplicate-safety
- provider outage

## 25. Deployment audit trail

Record:

```text
who/what triggered deployment
source SHA
artifact digest
config revision
migration version
start/end time
traffic strategy
approvals where required
rollback action
```

This is valuable for both operations and security.

## 26. Change windows

Not every deployment needs a manual maintenance window.

High-risk changes may justify:

- on-call availability
- lower traffic period
- staged region rollout
- manual promotion gate

Use risk, not ritual.

## 27. Production access

Limit who can:

- deploy
- change secrets
- modify CDN/WAF
- access DB
- replay queues
- view sensitive logs

Prefer short-lived identities and audited automation over shared long-lived credentials.

## 28. CI supply-chain controls

Protect:

- workflow modification
- dependency lockfile
- package registry credentials
- artifact registry
- deployment credentials

A compromised CI pipeline can ship validly signed malicious production code.

## 29. Incident timeline

During an incident, record concrete times:

```text
06:10 deploy started
06:14 canary 10%
06:17 5xx alert
06:19 rollout paused
06:22 rollback started
06:27 metrics recovered
```

This supports learning and avoids relying on memory.

## 30. Post-incident regression

A resolved incident should produce one or more durable improvements:

- test
- alert
- dashboard
- runbook
- rate limit
- safer migration
- better rollout gate
- architecture change

Do not stop at “engineer remembered the fix.”

## Production checklist

- [ ] CI uses reproducible dependency/build environment
- [ ] immutable artifact published once
- [ ] build/runtime secrets separated
- [ ] production build and representative E2E pass
- [ ] migration is compatible with overlapping app versions
- [ ] migration runner ownership explicit
- [ ] canary/rolling/blue-green strategy defined
- [ ] release identity present in telemetry
- [ ] post-deploy smoke checks run against real target
- [ ] previous healthy artifact known
- [ ] rollback/forward-fix decision documented
- [ ] secret/cache/DB/queue incident runbooks exist
- [ ] production access and CI credentials are least-privileged

## Interview questions

### Why should migrations be designed for old and new application versions at the same time?

Because zero-downtime rollout creates an overlap window in which both releases may serve traffic against the same database.

### What is the difference between rollback and redeploying an old commit?

Rollback should restore the exact previously validated immutable artifact and compatible state. Rebuilding an old commit can produce a different dependency/build output and is not deterministic.

## Exercise

Design a release pipeline for a Next.js SaaS with PostgreSQL, Redis, background workers and a CDN. Include:

1. PR gates
2. artifact build/publish
3. migration stage
4. canary percentage
5. smoke checks
6. promotion metrics
7. rollback artifact
8. cache compatibility
9. worker compatibility
10. incident ownership
