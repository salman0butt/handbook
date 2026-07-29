---
title: Queues & Background Jobs
---

# Queues & Background Jobs

A queue separates production of work from asynchronous execution and absorbs bursts, but it creates delivery, retry, ordering, and duplicate-processing problems you must design explicitly.

```text
producer → durable queue → consumer workers
                           ↓
                    side effects / DB
```

## Acknowledgements

A consumer should acknowledge only after the work reaches the durability point promised by the system. A crash between side effect and acknowledgement can cause redelivery.

## At-least-once mindset

Many practical queues deliver at least once. Therefore consumers must tolerate duplicates.

```js
if (await processed.exists(job.id)) return;
await performEffect(job);
await processed.record(job.id);
```

The simple shape above is not automatically atomic. Strong idempotency usually uses a database constraint/transaction, idempotency record, or side effect with its own deduplication key.

## Retries

Retry transient errors with exponential backoff + jitter and a maximum attempt/age budget. Invalid payloads and invariant violations are not fixed by retrying 100 times.

## Dead-letter handling

Poison messages need an observable terminal path, reason, replay/remediation process, and owner. A DLQ is not a trash can.

## Concurrency and ordering

More workers increase throughput until a downstream bottleneck saturates. Ordering requirements usually reduce parallelism; partition by key when per-entity order is enough.

## Graceful worker shutdown

Stop receiving new jobs, finish/extend/requeue owned work according to broker semantics, close connections, flush telemetry, then exit before the platform deadline.
