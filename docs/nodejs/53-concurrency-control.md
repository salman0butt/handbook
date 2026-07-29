---
title: Concurrency Control
---

# Concurrency Control

Single-threaded callback execution does **not** remove race conditions. Async operations interleave across awaits and external systems run concurrently.

```js
const balance = await loadBalance(id);
await chargeCard();
await saveBalance(id, balance - amount);
```

Two requests can read the same balance before either write occurs.

## Tools

- mutex: one local owner at a time;
- semaphore: N local concurrent owners;
- queue: order/bound work;
- worker pool: bounded CPU parallelism;
- DB lock/constraint/transaction: coordinate at data authority;
- optimistic concurrency: compare version and retry/resolve conflict;
- atomic operation: perform check/update indivisibly where supported.

## Local mutex limitation

An in-memory mutex protects one process only. With 20 replicas, there are 20 independent mutexes. For cross-replica invariants, coordinate at the authoritative datastore or a carefully designed distributed protocol.

## Optimistic concurrency

```sql
UPDATE account
SET balance = $1, version = version + 1
WHERE id = $2 AND version = $3;
```

If zero rows update, someone else changed the record. Re-read/re-evaluate rather than silently overwriting.

## Distributed locks caution

Leases can expire while a slow holder continues acting. Fencing tokens/version numbers are often needed so downstream systems can reject stale owners.

## Bounded Promise concurrency

Do not `Promise.all()` unbounded datasets. Match concurrency to downstream limits and memory. A semaphore is often more valuable than “faster async code.”
