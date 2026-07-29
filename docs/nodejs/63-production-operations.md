---
title: Production Operations
---

# Production Operations

Production engineering is the continuous ownership of startup, health, capacity, failures, deploys, and recovery.

## Startup

Validate configuration, initialize required dependencies, expose readiness only when serving is safe, and bound startup with timeouts. Avoid quietly running half-configured.

## Health

Liveness means process recovery is needed. Readiness means traffic should stop. Dependency health belongs in readiness only when inability to serve actually follows and when fleet behavior will not amplify an outage.

## Observability

Every service should expose enough telemetry to answer:

- is traffic arriving?
- are errors/latency changing?
- is CPU/event loop/memory saturated?
- are pools/queues backing up?
- which dependency is slow/failing?
- what version/config changed?

## Deployments

Use canary/rolling strategies, readiness, backward-compatible contracts, automated smoke tests, and rapid rollback/roll-forward.

## Incident response

Stabilize first: reduce load, rollback, disable harmful retries/features, restore capacity. Preserve evidence. Then investigate root causes and contributing conditions.

## Backups

A backup is only valuable if restore works. Test restore procedures, retention, encryption, permissions, and recovery objectives.

## SLOs

Define measurable reliability objectives tied to user outcomes. Error budgets help decide whether the next priority is feature velocity or reliability work.

## Operational ownership

Runbooks, dashboards, alerts, dependency owners, release metadata, and incident learnings are part of the service—not paperwork after coding ends.
