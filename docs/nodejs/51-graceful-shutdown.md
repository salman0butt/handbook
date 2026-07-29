---
title: Graceful Shutdown
---

# Graceful Shutdown

Graceful shutdown is coordinated ownership transfer from a process that is leaving service.

```text
SIGTERM
   ↓
set readiness false
   ↓
stop accepting new work
   ↓
drain in-flight HTTP/WS/jobs
   ↓
close consumers/workers/pools
   ↓
flush telemetry
   ↓
exit before deadline
```

## Idempotent coordinator

```js
let shuttingDown = false;
async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  process.exitCode = 0;
  readiness.set(false);

  const deadline = setTimeout(() => process.exit(1), 25_000);
  deadline.unref();
  try {
    await server.close();
    await queue.close();
    await db.end();
    await telemetry.shutdown();
  } finally {
    clearTimeout(deadline);
  }
}
```

Exact close APIs vary. Some server close calls stop new connections but need separate handling for long-lived/idle connections.

## Kubernetes lifecycle

The platform sends termination, removes/updates routing according to readiness/endpoints, and eventually force-kills after the grace period. Your application timeout must be comfortably shorter than the platform deadline.

## Queue workers

Stop fetching new messages first. For in-flight jobs, finish, extend visibility/lease, or allow redelivery according to broker semantics. Idempotent processing is what makes interrupted work recoverable.

## WebSockets

Stop accepting upgrades, notify/close connections if protocol supports it, and ensure reconnects land on healthy replicas.

## Common mistakes

- `process.exit()` immediately in signal handler;
- closing DB before requests stop using it;
- remaining ready while draining;
- never force-ending hung shutdown;
- shutdown duration longer than orchestrator grace period.
