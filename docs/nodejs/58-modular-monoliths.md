---
title: Monoliths & Modular Monoliths
---

# Monoliths & Modular Monoliths

A monolith can be a strong architecture when modules have explicit boundaries. “Monolith” describes deployment shape, not necessarily code quality.

## Benefits

- one deployment/rollback unit;
- in-process calls and transactions;
- easier local debugging/refactoring;
- lower network/observability burden;
- simpler consistency for many workflows.

## Modular structure

```text
app
 ├─ orders
 │   ├─ public API
 │   └─ private implementation
 ├─ billing
 └─ identity
```

Modules own tables/collections where possible and communicate through public module APIs/events rather than importing private repositories.

## Dependency rules

Enforce allowed imports through package boundaries, lint/build rules, review, and tests. A folder named `modules` does not create modularity if everything imports everything.

## Scaling

You can scale the whole monolith horizontally before extracting services. If one workload dominates CPU or background jobs, move that execution path first rather than pre-splitting every domain.

## Extraction path

1. define internal module contract;
2. remove cross-boundary direct data access;
3. introduce event/outbox/API where needed;
4. measure operational reason to extract;
5. move one boundary with compatibility plan.

The best microservice migrations often begin by creating a good modular monolith.
