---
title: Processes, Cluster & Parallelism
---

# Processes, Cluster & Parallelism

Node can use multiple CPU cores through worker threads or multiple processes. Process-level scaling is often orchestrated outside the application by containers, systemd, a process manager, or Kubernetes.

## Options

| Mechanism | Memory | Failure boundary | Best for |
|---|---|---|---|
| async I/O | shared process | same process | concurrent I/O |
| worker thread | separate isolate, same process | partial | CPU-bound JS |
| child process | separate process | strong process boundary | executables/isolation |
| `cluster` | multiple Node processes | process boundary | legacy/in-process multi-core server coordination |
| external replicas | separate deployment processes | strongest operational boundary | horizontal service scaling |

`cluster` can distribute connections across worker processes, but it should not become architecture. Modern production platforms often make separate stateless replicas clearer to deploy, observe, restart, and autoscale.

## State sharing

Memory is not shared across processes. Sessions, rate-limit counters, locks, and coordination state that must survive/scale need an external system or explicit partitioning.

## Sticky sessions

Long-lived WebSocket/session affinity may require load-balancer stickiness or shared real-time state. Sticky routing reduces flexibility and must be treated as an infrastructure contract.

## Graceful restart

```text
start replacement
   ↓ readiness passes
shift traffic
   ↓
drain old process
   ↓
terminate old process
```

Do not restart every replica simultaneously. Rolling replacement plus readiness and shutdown budgets preserve availability.
