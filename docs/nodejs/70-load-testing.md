---
title: Load Testing
---

# Load Testing

Load testing tests a system under a workload model. “10,000 requests passed” is meaningless without arrival rate, concurrency, payloads, dependency behavior, and latency/error results.

## Measures

- throughput / arrival rate;
- concurrency/in-flight requests;
- p50/p95/p99 latency;
- error/timeout rate;
- CPU/event-loop delay;
- memory/GC;
- DB/HTTP pool waiting;
- queue depth/age;
- dependency saturation.

## Warmup

JIT, caches, connection pools, DNS, TLS, and database caches can make initial results different from steady state. Record warmup separately and also test cold-start behavior when relevant.

## Closed vs open load

A closed model keeps a number of users/connections that wait for responses; when the system slows, request arrival can drop. An open model schedules arrivals independently and can expose queue collapse more realistically for traffic-driven services.

## Realistic workload

Mix endpoints, payload sizes, authentication, cache hit rates, writes, background jobs, errors, and think time based on production expectations. A `/health` benchmark says little about an order workflow.

## Test environment

If the DB is tiny/local while production is remote/shared, results are not transferable. Document differences.

## Interpretation

Find the knee where latency/error/saturation rises nonlinearly. Capacity is not “maximum before total failure”; reserve headroom for traffic bursts, deploys, failures, GC, and noisy neighbors.
