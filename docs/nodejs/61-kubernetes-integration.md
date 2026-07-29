---
title: Kubernetes Integration
---

# Kubernetes Integration

Kubernetes manages process placement/replacement and service routing; the Node application must expose lifecycle semantics correctly.

## Probes

- startup: has slow initialization completed?
- readiness: should this pod receive traffic **now**?
- liveness: is the process irrecoverably unhealthy and should it restart?

Do not make liveness depend on a flaky external DB and trigger a fleet restart during a DB outage.

## Shutdown

```text
pod termination
  ↓
readiness false / endpoint removal
  ↓
SIGTERM to container
  ↓
Node drains
  ↓
grace period
  ↓
SIGKILL if still alive
```

Coordinate application drain time with `terminationGracePeriodSeconds` and ingress/load-balancer propagation.

## Requests and limits

CPU request affects scheduling; CPU limit can throttle. Memory limit can OOM-kill the process. Set values from load tests/telemetry and include memory headroom.

## HPA

CPU-only autoscaling can miss I/O-bound saturation. Consider request rate, queue age/depth, concurrency, or custom metrics where they better represent capacity.

## Config/secrets

Mount/inject configuration through platform mechanisms and validate at startup. Secret objects still require cluster/RBAC/encryption/rotation controls.

## Rolling updates

Use readiness, max unavailable/surge, compatibility across old/new schemas/events, and graceful shutdown so deployments do not become outages.
