---
title: Security, Architecture & Distributed Systems Interview Reasoning
---

# Security, Architecture & Distributed Systems Interview Reasoning

## Authentication vs authorization

Authentication establishes identity. Authorization decides whether that identity may perform a specific action on a specific resource in the current context. A valid JWT can still be forbidden from editing another tenant's invoice.

A senior answer explains where trusted identity is established, how tenant/resource context is derived, where policy is evaluated, and how data access preserves the boundary.

## SSRF scenario

“Build an endpoint that fetches a URL supplied by the user.”

Weak answer: validate that it starts with `https://`.

Senior answer: define an allow policy, parse/canonicalize URL, restrict schemes/ports/hosts, resolve and block private/link-local/metadata targets as appropriate, re-evaluate redirects and resolution behavior, constrain egress at the network layer, set timeouts/body limits, and log safe destination metadata.

## Command execution scenario

Prefer a fixed executable plus argument array over shell interpolation. Then validate arguments because target programs can interpret flags/paths dangerously even without a shell. Apply OS/container permissions so compromise has limited blast radius.

## Why JWT is not always better than sessions

JWTs improve self-contained verification in some distributed architectures but complicate immediate revocation and can expose stale authorization claims. Opaque server sessions provide centralized revocation/state but require session storage/lookup. Choose based on trust, scaling, latency, revocation, browser security, and operations.

## Microservices vs modular monolith

Microservices add network failure, versioned contracts, observability, retries/idempotency, independent deploys, and data ownership complexity. Choose them when organizational/domain/deployment/scaling independence justifies that cost. If boundaries are unclear or teams deploy together, a modular monolith is often stronger.

## Partial failure question

```text
A → B: charge payment
B commits charge
response is lost
A sees timeout
```

A cannot know from timeout alone whether the charge happened. Retrying requires an idempotency key or a query/reconciliation protocol. This is a core distributed-systems mental model.

## Exactly-once misconception

A broker may provide scoped exactly-once processing guarantees, but external business side effects span storage/protocol boundaries. Design deduplication/idempotency around operation identity rather than promising magical global execution exactly once.

## Saga reasoning

A saga is a durable sequence of local transactions with orchestration/choreography and compensating/repair actions. Compensation is a new business action, not database rollback across services.

## Architecture review answer

Explain:

- requirements/SLOs and scale;
- domain/data ownership;
- sync vs async communication;
- timeout/retry/idempotency;
- security/trust boundaries;
- observability;
- deployment/migration;
- failure modes;
- what you intentionally keep simple now.
