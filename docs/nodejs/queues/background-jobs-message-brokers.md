---
title: Queues, Background Jobs and Message Brokers
description: Durable queues separate request latency from long-running work and provide delivery, retry, scheduling, concurrency, and failure controls.
---

# Queues, Background Jobs and Message Brokers

## Concept

Durable queues separate request latency from long-running work and provide delivery, retry, scheduling, concurrency, and failure controls.

## Why It Exists

Email, media, billing, imports, workflows, and integrations must survive process restarts and provider outages.

## Mental Model

```mermaid
flowchart LR
  A["Producer"]
  B["Durable queue or log"]
  C["Idempotent consumer"]
  D["Ack, retry or dead letter"]
  A --> B
  B --> C
  C --> D
```

Treat every arrow as a boundary with a cost, ownership rule, cancellation behavior, and failure mode. Node.js is effective when those boundaries are explicit instead of hidden behind framework defaults.

## How It Works

The JavaScript callback runs on the main JavaScript thread. Native Node.js bindings, libuv, the operating system, worker threads, child processes, or remote services may perform work elsewhere. Completion only becomes useful when control returns to JavaScript. Under load, the important questions are what is queued, what is bounded, what can be cancelled, and which resource saturates first.

## Example

```ts
type Job = {id: string; type: 'send-email'; userId: string};

async function handle(job: Job): Promise<void> {
  const claimed = await claimIdempotencyKey(job.id);
  if (!claimed) return;
  try {
    await sendEmail(job.userId);
    await completeIdempotencyKey(job.id);
  } catch (error) {
    await releaseOrRecordFailure(job.id, error);
    throw error;
  }
}
```

The example is intentionally small enough to execute, but the production boundary is the important part: validate inputs, establish a deadline, propagate cancellation, classify failures, and release resources deterministically.

## Production Use

Choose BullMQ or another Redis queue for application jobs, RabbitMQ for broker routing/ack semantics, Kafka for durable partitioned logs, and workflow engines for long-lived orchestration.

## Security

Authenticate brokers, authorize topics/queues, encrypt traffic, validate payloads, isolate tenants, and avoid secrets in messages.

## Performance

Tune concurrency to downstream capacity, measure lag and queue age, cap retries, and plan for poison messages and backpressure.

## Common Mistakes

- Assuming exactly-once delivery.
- Acknowledging before durable side effects are complete.
- Retrying non-idempotent work without a deduplication strategy.

## Debugging

Track job ID, attempt, queue wait, processing time, ack state, error class, dead-letter reason, and consumer version.

## Testing

Test duplicate delivery, crash before/after side effects, broker outage, poison jobs, retry exhaustion, cancellation, and clock changes.

## When Not to Use It

Do not move a simple fast reliable operation to a queue when synchronous completion is a required contract.

## Interview Questions

- At-least-once delivery implications?
- What is the outbox pattern?
- How do you handle poison jobs?

## Official References

- [nodejs.org](https://nodejs.org/api/)
- [nodejs.org](https://nodejs.org/en/about/previous-releases)
