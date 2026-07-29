---
title: Scaling Node.js
---

# Scaling Node.js

Scaling starts by identifying the bottleneck and desired SLO, then increasing capacity or reducing work at that resource.

## Vertical vs horizontal

Vertical scaling gives a process/container more CPU/memory. Horizontal scaling adds replicas behind load balancing. Stateless request handling makes horizontal scaling easier, but state still exists in DB/cache/queues/sessions.

## Multi-core

One Node process can use worker threads for CPU tasks, but ordinary HTTP service scaling often uses multiple processes/replicas. Do not oversubscribe workers × replicas beyond actual CPU capacity.

## DB capacity

If every replica has a pool of 30 and autoscaling reaches 50 replicas, theoretical application DB connections become 1,500. Scale pool configuration with database limits and proxies.

## Sessions

In-memory sessions break when requests move between replicas. Use external session storage, signed/stateless mechanisms where appropriate, or explicit sticky routing with its trade-offs.

## Caches/queues

Caches reduce source-of-truth load but introduce invalidation/stampede. Queues smooth bursts but can hide overload as backlog. Scale consumers based on queue age + downstream capacity, not queue depth alone.

## WebSockets

Long-lived connections require connection-aware load balancing, per-replica connection limits, shared pub/sub/state, and reconnect strategy.

## Hot spots

A single tenant/key/partition/lock may remain saturated no matter how many Node replicas you add. Scaling architecture requires partitioning ownership and removing serial bottlenecks.
