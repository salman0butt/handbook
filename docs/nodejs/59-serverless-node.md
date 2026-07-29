---
title: Serverless Node.js
---

# Serverless Node.js

Serverless platforms run Node functions/services under platform-managed lifecycle and scaling rules. Runtime reuse is common but not guaranteed.

## Cold vs warm

```text
new instance
  ↓ runtime startup
module initialization
  ↓
handler request
  ↓ maybe reused
later requests
```

Put reusable pools/clients outside the handler when the platform permits reuse, but write correctness as if another invocation may land on a different instance.

## Connections

Rapid scaling can create connection storms to databases. Use platform-aware pooling/proxies, bounded clients, and data services designed for the concurrency model.

## Ephemeral filesystem

Local disk may be temporary and instance-scoped. Use it for bounded scratch/cache only when platform guarantees support the use case; durable state belongs in external storage.

## Timeouts/background work

When the platform ends an invocation, unowned background Promises may not complete. Put durable asynchronous work into a queue/workflow service.

## Package size/startup

Large dependency graphs, expensive module initialization, native modules, and synchronous startup can increase cold-start latency.

## Streaming

Streaming support differs by platform/gateway/runtime mode. Verify the deployment platform rather than assuming raw Node HTTP semantics.

## Observability

Correlate invocation IDs, cold starts, platform timeout, queue retries, and downstream connection saturation. Serverless removes server management, not distributed-systems concerns.
