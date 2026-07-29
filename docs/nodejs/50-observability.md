---
title: Observability
---

# Observability

Observability lets you infer system state from telemetry. The three common signals are logs, metrics, and traces; good systems connect them through shared context.

## Logs

Structured events answer “what happened?” Include request/job IDs, service version, error class, duration, and bounded dimensions while excluding secrets.

## Metrics

Track rates, errors, durations, and saturation. Useful Node/service metrics include:

- request rate/error/latency percentiles;
- event-loop delay/utilization;
- CPU and RSS/heap/external memory;
- GC-related signals where available;
- DB/HTTP pool active/idle/waiting;
- queue depth/oldest age/retry rate;
- worker utilization;
- dependency latency/error rate.

## Traces

A trace follows one logical request/workflow through spans across processes. A span should describe an operation with timing, status, relevant low-cardinality attributes, and parent/child relation.

```text
HTTP request span
 ├─ auth span
 ├─ PostgreSQL span
 ├─ cache span
 └─ publish event span
```

## RED / USE

RED for services: rate, errors, duration. USE for resources: utilization, saturation, errors. These are lenses, not mandatory dashboards.

## OpenTelemetry

OpenTelemetry provides vendor-neutral APIs/SDK conventions for traces, metrics, and logs. Instrumentation must preserve context across async boundaries and avoid excessive cardinality/cost.

## Alerts

Alert on user-impacting symptoms/SLO burn and actionable saturation, not every transient exception. Each alert should have an owner and runbook.
