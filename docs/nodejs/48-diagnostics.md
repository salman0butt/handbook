---
title: Diagnostics
---

# Diagnostics

Diagnostics turns “Node is slow” into evidence about CPU, memory, event-loop delay, I/O, dependencies, and process state.

## Inspector

```bash
node --inspect src/server.js
node --inspect-brk src/server.js
```

The inspector can connect to Chrome DevTools and other clients for debugging/profiling. **Never expose an inspector endpoint to untrusted networks**; it is effectively privileged runtime control.

## Stack traces and source maps

Preserve error causes and source maps for transformed TypeScript/build artifacts. Verify deployed stack traces point to useful source locations.

## Diagnostic reports

Node diagnostic reports can capture process/runtime/system information during failures or on demand. Treat them as sensitive operational artifacts because they may contain paths, environment details, and runtime state.

## Heap snapshots

Heap snapshots are useful for retention/leak analysis but can pause the process and require substantial memory. Take them on a safe replica or with an incident plan.

## CPU profiling

A CPU profile answers where CPU time is spent. Collect under representative load, look for wide/hot frames, then correlate with throughput and event-loop delay.

## Event-loop metrics

Use runtime metrics such as event-loop delay/utilization to distinguish “callback execution is saturated” from “the process is waiting on a slow dependency.” One metric alone is not a diagnosis.

## Trace/async tooling

Trace events and async hooks can reveal lifecycle relationships, but instrumentation itself has overhead and semantic complexity. Use the highest-level tool that answers the incident question.

## Incident workflow

```text
symptom
 ↓
logs + metrics + traces
 ↓
form hypothesis
 ↓
profile/snapshot only the suspected resource
 ↓
fix + load test + compare
```

Do not begin every incident by taking a heap snapshot or attaching a profiler.
