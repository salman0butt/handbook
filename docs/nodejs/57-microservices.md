---
title: Microservices
---

# Microservices

Microservices trade in-process simplicity for independent ownership/deployment/scaling boundaries. They are not an automatic “senior architecture.”

## When not to use them

Prefer a modular monolith when the team is small, domain boundaries are unclear, deployment coupling is acceptable, and operational platform maturity is limited.

## Service boundary test

A useful service owns a cohesive business capability, its data, its API/events, and operational responsibility. Splitting by technical layer (`user-controller-service`) creates network chatter without autonomy.

## Distributed cost

Every former function call may now need:

- authentication/authorization;
- versioned contract;
- timeout/retry/idempotency;
- tracing/log correlation;
- discovery/routing;
- deployment compatibility;
- partial-failure handling.

## Data ownership

Shared databases create hidden coupling. Prefer service-owned data and explicit APIs/events, accepting that cross-service workflows become distributed consistency problems.

## Sagas/events

Long workflows need durable state and compensation/recovery. A chain of synchronous HTTP calls is not a saga.

## Deployment independence

If all services must deploy together, share a DB schema, and release from one pipeline, you have distributed deployment complexity without much independence benefit.

## Observability

Tracing becomes essential because one user request can cross many services/queues. Standardize IDs, telemetry attributes, error taxonomy, and service ownership.
