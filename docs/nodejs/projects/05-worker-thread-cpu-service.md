---
title: Project 5 — Worker Thread CPU Service
---

# Project 5 — Worker Thread CPU Service

Build an image/hash/data-analysis API that compares main-thread CPU execution with a bounded worker-thread pool.

## Requirements

Implement baseline CPU function on main thread, measure event-loop delay, then create a fixed-size Worker pool with queue, job IDs, transferable buffers where useful, cancellation/deadline, worker replacement, graceful shutdown, and metrics.

## Architecture

```text
HTTP → validate → bounded CPU queue → workers
                         ↓ reject when full
```

## Runtime model

Main isolate accepts requests and schedules jobs; worker isolates execute JavaScript on parallel threads; messages are cloned or transferred; shared process memory/fate remains.

## Milestones

Benchmark baseline → one Worker → pool → transfer optimization → cancellation → failure replacement → load shedding → comparison report.

## Acceptance criteria

Under CPU load, worker version keeps event-loop latency within target; queue has hard bound; timed-out request cancels/ignores safely; worker crash fails/requeues only owned jobs under explicit policy; shutdown rejects new work and drains/cancels pool.

## Security

Cap input size, validate algorithms/options, prevent arbitrary worker module paths, isolate untrusted data, and do not assume Worker is a malicious-code sandbox.

## Performance

Compare throughput, p99 latency, event-loop delay, CPU utilization, memory, clone/transfer bytes, queue age, and worker utilization across pool sizes.

## Testing

Worker success, throw, abrupt exit, timeout, cancellation, queue overflow, large transfer, repeated jobs, shutdown, and main-thread baseline regression.

## Failure modes

Oversubscribed CPU, clone cost dominates, memory spikes, worker leak, queue unbounded, request disappears but job keeps running.

## Observability

Pool size, busy workers, queue depth/age, job duration, worker restarts, cancellations, rejected jobs, event-loop delay.

## Deployment

Set workers relative to CPU limits actually allocated to the container, not physical host CPUs blindly.

## Common mistakes

Worker per request, pool larger than CPU quota, using workers for DB I/O, huge cloned payloads, no load shedding.

## Stretch goals

SharedArrayBuffer ring buffer with documented synchronization, priority queue, adaptive pool benchmark.

## Interview questions

Why do workers help CPU but not ordinary network waits? Worker vs child process? Transfer vs clone?

## Design review

Prove with measurements which bottleneck moved and what new bottleneck appears.
