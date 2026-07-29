---
title: Streams, Networking & Performance Interview Reasoning
---

# Streams, Networking & Performance Interview Reasoning

## How does backpressure work?

A producer can outpace a consumer. Node streams expose pressure signals so the producer can stop adding data until downstream capacity recovers.

```text
fast producer → bounded buffer → slow consumer
                  ↑
              pressure signal
```

For a Writable, `write()` returning `false` means the internal threshold has been crossed; wait for `'drain'`. In a composed pipeline, well-behaved streams propagate this pressure upstream.

**Senior implication:** without backpressure, memory grows with the difference between production and consumption rates. Under load, that often turns a throughput problem into OOM/restart instability.

## Why can streams reduce memory?

A 20 GB source can be processed in bounded chunks, so working memory depends on buffering/concurrency rather than total input size. Streaming does not guarantee low memory if you collect chunks, set enormous watermarks, or run unbounded async transformations.

## TCP is a byte stream, not messages

One `socket.write()` on one side may arrive in multiple reads or be coalesced with other writes. Protocols require framing: length prefix, delimiter with escaping, or a structured protocol parser. Cap frame size before allocation.

## HTTP timeout reasoning

Do not say “set a 30-second timeout.” Separate:

- DNS/connect/TLS establishment;
- header deadline;
- request body deadline;
- application operation deadline;
- upstream response/read deadline;
- idle keep-alive;
- graceful-shutdown drain deadline.

A client timeout should cancel underlying owned work where supported; otherwise the server can continue consuming resources after the user has gone away.

## Diagnose latency correctly

```text
high p99
 ├─ event-loop delay high? → callback CPU / GC / sync work
 ├─ pool wait high? → DB/HTTP/worker capacity
 ├─ queue age high? → consumer/downstream saturation
 ├─ connect/DNS high? → network/resolver
 └─ downstream span high? → dependency
```

A senior answer names the measurement that differentiates competing hypotheses.

## Worker threads vs child processes

Workers: separate V8 isolates/threads in the same process, lower communication overhead, good for CPU-bound JS, shared process fate, optional transferable/shared memory.

Child processes: separate OS processes/memory, stronger failure/resource boundary, can run arbitrary executables, more IPC/startup overhead.

Neither is the default solution for slow database/network I/O.

## Performance answer pattern

1. define target (p99, throughput, cost, memory);
2. reproduce with representative workload;
3. measure CPU/event loop/memory/pools/dependencies;
4. identify bottleneck;
5. change one architecture/resource assumption;
6. re-measure and check a new bottleneck did not appear.

Weak answers begin with “use cluster,” “increase thread pool,” “add Redis,” or “use workers” before evidence.
