---
title: Distributed Systems with Node.js
---

# Distributed Systems with Node.js

Once a Node service calls another process, it enters a world where messages can be delayed, duplicated, reordered, lost, and responses can disappear even when work succeeded.

## Partial failure

```text
A sends request to B
B commits change
network drops response
A sees timeout
```

Did B fail? No. Did A know success? No. This ambiguity is why retries require idempotency.

## Consistency and availability

Replicated data may expose stale reads or trade availability for stronger coordination under failure. Use the guarantees of the datastore/protocol you chose; do not summarize all distributed systems as one CAP slogan.

## Time

Wall clocks skew and jump. Use monotonic time for durations. Do not use timestamps alone to establish causality across machines without a protocol that supports that interpretation.

## Ordering

Messages can arrive out of order. Version/sequence/domain invariants should reject stale transitions or reconcile deliberately.

## Distributed transactions

Two-phase commit can provide atomic coordination in some environments but adds availability/operational cost. Sagas coordinate multi-step workflows through local commits + compensating actions/events; compensation is domain logic, not automatic rollback.

## Event-driven workflow

```text
Order created
  ↓
reserve inventory
  ↓
charge payment
  ↓
ship
```

Each step needs durable state, idempotent handling, retry/dead-letter strategy, timeout, and compensation/repair plan.

## Core senior question

For every network operation: *what if the request succeeds but the response is lost?*
