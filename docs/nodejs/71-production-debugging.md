---
title: Debugging Production Incidents
---

# Debugging Production Incidents

Start with symptom and recent change, not a favorite tool.

```text
What changed?
    ↓
Is process alive / restarting?
    ↓
CPU? memory? event loop?
    ↓
connections / thread pool / DB pool?
    ↓
network / DNS / dependencies?
    ↓
queues / backlog / retries?
    ↓
logs + metrics + traces
    ↓
profile only where evidence points
```

## CPU spike

Check request rate, event-loop delay, CPU profiles, hot endpoint/job, serialization/compression, regex, JS loops, GC, and worker saturation. Roll back/disable expensive paths before deep analysis if user impact is severe.

## Memory growth / OOM

Distinguish heap vs external/RSS. Check queue depth, buffers, connection/listener counts, cache cardinality, heap snapshots/retainers, and container limits. Repeated OOM restart can amplify load elsewhere.

## Event-loop stall

High delay + high CPU suggests JS/native synchronous work or GC pressure. Low CPU with high request latency points more toward downstream waits/pools/network.

## Connection exhaustion

Inspect DB/HTTP pool active/wait counts, leaked clients, slow transactions, downstream latency, replica count, and timeout behavior.

## Thread-pool saturation

Slow fs/crypto/DNS-style work while JS CPU is low can point to shared libuv pool pressure. Measure before changing pool size.

## Retry storm

Dependency failure → more retries → more load → worse dependency → more retries. Stop/reduce retrying, add jitter/budgets/load shedding, then repair semantics.

## Queue backlog

Look at oldest message age, producer rate, consumer throughput/errors, downstream saturation, poison messages, and scaling limits—not depth alone.
