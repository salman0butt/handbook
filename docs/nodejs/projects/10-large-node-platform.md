---
title: Project 10 — Large Node Platform
---

# Project 10 — Large Node Platform

Design a multi-team Node platform supporting APIs, workers, queues, PostgreSQL, Redis, authentication, observability, CI, Docker, Kubernetes, migration strategy, and performance governance.

## Requirements

Create a service template, runtime version policy, config schema, auth middleware/library, structured logging, OTel instrumentation, health/shutdown module, DB/Redis clients with bounded pools, queue conventions, CI workflow, base image, K8s deployment template, SLO dashboards, upgrade/runbook docs.

## Architecture

```text
Developer template
      ↓
service/worker repos
      ↓
CI policy → signed artifact/base image
      ↓
Kubernetes platform
 ├─ APIs
 ├─ workers
 ├─ queues
 ├─ DB/cache
 └─ observability/security controls
```

## Runtime model

Platform defaults must understand Node process lifecycle, event-loop blocking, pool multiplication across replicas, worker CPU quotas, signals, source maps, and LTS upgrades.

## Milestones

Golden service → shared telemetry/error/config packages → base image → CI → K8s lifecycle → dependency policy → load baseline → runtime upgrade automation.

## Acceptance criteria

A new service reaches production with standard logging/tracing/readiness/shutdown/security; unsupported Node versions fail CI policy; DB pool size is capacity-derived; base image can be upgraded centrally; canary Node major upgrade has comparison dashboard.

## Security

Least-privilege workload identity, secret manager, private registry policy, provenance/SBOM, Node permission model option, non-root images, network policy, dependency ownership.

## Performance

Default load-test template captures p99, event loop, RSS, pool saturation. Set budgets for startup, memory, image size, request latency.

## Testing

Template smoke test, container signal test, K8s rollout test, telemetry contract, dependency outage, runtime-major matrix, native-module compatibility.

## Failure modes

Platform package breaking all services, synchronized fleet rollout, overly large shared framework, bad base image, global retry defaults amplifying outage.

## Observability

Fleet inventory by Node version/service version, SLOs, saturation, error taxonomy, deployment markers, runtime crash/OOM trends.

## Deployment

Progressive templates and opt-in/canary before mandatory migration. Backward-compatible shared library releases.

## Common mistakes

Central platform owning domain code, mandatory abstraction without escape hatch, no consumer telemetry, version policy without automation.

## Stretch goals

Automated PRs for Node LTS upgrades, policy-as-code, ephemeral preview environment, cost attribution.

## Interview questions

How do you upgrade Node across dozens of services? What belongs in a platform library? How do you avoid turning the paved road into a prison?

## Design review

Present governance decisions, blast-radius controls, fleet upgrade sequence, and measures of developer experience.
