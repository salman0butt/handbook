---
title: Incidents, Migrations & Behavioural Interview Reasoning
---

# Incidents, Migrations & Behavioural Interview Reasoning

## Production incident framework

When given “The Node service is slow,” ask for evidence rather than guessing.

```text
What changed?
 ↓
Is process healthy/restarting?
 ↓
traffic + errors + latency
 ↓
CPU / event loop / memory
 ↓
pools / queues / dependencies / network
 ↓
logs + metrics + traces
 ↓
profile the suspected resource
```

### CPU spike

Stabilize (rollback/disable costly feature/shift traffic), compare deployment markers, inspect event-loop delay and CPU profile, identify hot path, reproduce under load, patch and validate.

### Memory leak

Distinguish heap, buffers/external memory, and RSS; correlate with queue/connection/listener/cache cardinality; capture safe heap snapshots; inspect retaining paths; verify memory returns/stabilizes after fix.

### DB pool exhaustion

Check active/idle/waiting counts, leaked clients, long transactions, slow queries/locks, replica scaling, and whether request concurrency exceeds DB capacity. Increasing pool size can worsen the database.

### Retry storm

Reduce retries/traffic first, then add transient-only policy, exponential backoff + jitter, retry budgets, idempotency, circuit/load shedding, and dashboards for retry amplification.

## CommonJS → ESM migration

1. inventory CJS-only patterns and consumers;
2. make package `type` and extensions explicit;
3. convert leaf modules first;
4. replace `__dirname`/dynamic require patterns;
5. verify tests/CLI/workers/loaders;
6. define package exports/interoperability;
7. release compatibly and observe consumers.

Do not combine a module-system migration with unrelated architecture rewrites unless necessary.

## Node major upgrade across many services

A staff answer includes fleet inventory, supported LTS policy, shared base images/toolchain, compatibility tests (native addons especially), representative canaries, telemetry comparison, gradual rollout, EOL deadline, automatic PR/policy enforcement, and rollback.

## Behavioural answers for senior Node roles

Use a concrete engineering story with:

- context and user/business impact;
- your ownership and constraints;
- evidence that changed your initial hypothesis;
- trade-offs/options considered;
- communication with engineers/stakeholders;
- measurable outcome;
- what standard/tool/runbook changed afterward.

### Strong story prompts

- prevented an event-loop or pool bottleneck before launch;
- led a runtime/framework/database migration;
- diagnosed an ambiguous production incident;
- disagreed on microservices vs monolith and used evidence;
- improved reliability through timeouts/idempotency/shutdown;
- introduced observability that shortened incident recovery;
- handled a security/supply-chain finding;
- mentored a team away from framework-driven architecture.

## Weak behavioural pattern

“I fixed it quickly and everyone was happy.”

A senior interviewer wants how you reasoned, what you measured, what you communicated, and how the system/team became more reliable afterward.
