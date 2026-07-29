---
title: Common Node.js Failure Modes
---

# Common Node.js Failure Modes

## Blocking the event loop

**Symptom:** all requests on one process get slow. **Cause:** sync fs/crypto/compression, CPU loops, huge JSON/regex. **Fix:** bound work, improve algorithm, async native API, worker/process.

## Unbounded Promise concurrency

**Symptom:** memory/pool/downstream collapse. **Cause:** `Promise.all(hugeArray.map(...))`. **Fix:** semaphore/queue aligned with scarce resource.

## Missing timeouts

**Symptom:** in-flight work grows forever during dependency degradation. **Fix:** connect/operation/deadline timeouts plus cancellation.

## Retry storm

**Symptom:** failing dependency receives more traffic. **Fix:** transient-only retries, exponential backoff + jitter, budgets, idempotency, circuit/load shedding.

## Leaking listeners/handles

**Symptom:** warnings, retained objects, process won't exit. **Fix:** lifecycle ownership, once/remove/abort cleanup, inspect active resources.

## Oversized buffers/no backpressure

**Symptom:** RSS spikes under uploads/downloads. **Fix:** stream, size caps, respect Writable pressure.

## DB pool exhaustion

**Symptom:** queries wait before reaching DB. **Fix:** release clients, shorten transactions, tune pool/replias, fix slow queries, cap app concurrency.

## Swallowed async errors

**Symptom:** user sees stale/missing behavior with only a console log. **Fix:** propagate/translate/own every Promise.

## `process.exit()` misuse

**Symptom:** truncated logs/responses, corrupted partial work. **Fix:** stop intake, drain, close resources, set exit code, force only at deadline.

## Shell/path injection

**Symptom:** attacker-controlled OS/file access. **Fix:** no shell interpolation, fixed executables + args, server-owned paths, authorization/containment.

## Global mutable state

**Symptom:** test/request interference and scaling inconsistency. **Fix:** explicit scoped dependencies and external authoritative state when cross-replica.
