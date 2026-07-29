---
title: Resilience
---

# Resilience

Resilience accepts that dependencies, networks, replicas, and queues fail partially. The goal is controlled degradation, not “never fail.”

## Timeouts

Every remote call needs a deadline tied to the caller's remaining budget. A timeout should cancel underlying work when possible.

## Retries

Retry only transient failures and only if semantics permit repetition.

```text
attempt
 ↓ fail transiently
backoff + jitter
 ↓
retry within total budget
```

Cap attempts, elapsed time, and concurrent retries. Retries multiply load during outages.

## Circuit breaker

A breaker can stop repeatedly calling a known-failing dependency and probe recovery later. It adds state/complexity; use it when failure isolation benefits outweigh coordination risks.

## Bulkheads

Separate capacity so one dependency/workload cannot consume all resources: dedicated pools, semaphores, queues, worker groups, or replica sets.

## Rate limiting and load shedding

Reject excess work before expensive allocation/downstream calls. Returning 429/503 quickly can preserve healthy traffic better than accepting everything and timing out later.

## Idempotency and deduplication

Retries are safe only when duplicate execution is safe or detectable. Store idempotency keys with result/state in a durable atomic boundary appropriate to the operation.

## Fallbacks

Fallback data can be stale or semantically dangerous. Make degraded behavior explicit and observable; never silently return incorrect authoritative data.

## Retry budget example

If a user request has 2 seconds remaining, three 2-second dependency attempts cannot fit. Allocate connect/read/retry budgets from one end-to-end deadline.
