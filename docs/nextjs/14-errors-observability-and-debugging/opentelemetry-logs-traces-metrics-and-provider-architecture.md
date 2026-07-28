---
title: OpenTelemetry, Logs, Traces, Metrics & Provider Architecture
description: Build a provider-neutral observability stack with Next.js instrumentation, OpenTelemetry, structured logs, metrics, traces, sampling, and deployment-aware exporters.
---

# OpenTelemetry, Logs, Traces, Metrics & Provider Architecture

Observability is not one tool and it is not the same as logging.

A useful model is:

```text
logs
→ discrete events and details

metrics
→ numeric behavior over time

traces
→ request journeys and timing

errors
→ grouped failure events
```

These signals overlap, but they answer different questions.

## 1. Next.js has built-in OpenTelemetry support

Next.js documents OpenTelemetry as the recommended platform-neutral instrumentation model.

Framework operations can participate in traces once OpenTelemetry is configured.

This means you should not create a parallel manual tracing system for every framework operation unless a real gap requires it.

## 2. `instrumentation.ts` is the setup boundary

A common setup uses `register()`:

```ts
import { registerOTel } from '@vercel/otel'

export function register() {
  registerOTel({ serviceName: 'next-app' })
}
```

The package name contains Vercel, but the OpenTelemetry concept is not limited to the Vercel hosting platform.

Keep framework, SDK, and provider responsibilities separate.

## 3. `@vercel/otel` is a convenience layer

It reduces the setup required for common OpenTelemetry integration.

If your architecture needs lower-level control, configure OpenTelemetry SDK packages directly.

Do not assume manual setup is automatically better. It means you own more configuration, runtime compatibility, exporting, and lifecycle behavior.

## 4. Manual Node SDK setup is runtime-specific

The Node OpenTelemetry SDK uses Node APIs and should be loaded only for Node runtime contexts.

```ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation.node')
  }
}
```

Runtime compatibility is an engineering constraint, not a provider preference.

## 5. A trace models one distributed journey

Example:

```text
GET /workspace/[id]
        ↓
load session
        ↓
query workspace
        ↓
call search service
        ↓
render Server Components
```

A trace connects those spans so you can see latency and failure propagation.

## 6. A span represents one operation

Useful custom spans might model:

```text
domain query
vendor SDK call
expensive transformation
queue publish
cache lookup
```

Do not create spans for every trivial function.

Too much granularity creates cost and noise.

## 7. Use semantic names, not dynamic IDs

Bad span name:

```text
load-project-928347
```

Better:

```text
project.load
```

Put bounded identifiers in attributes only when necessary and safe.

High-cardinality span names make aggregation difficult.

## 8. Custom span example

```ts
import { trace } from '@opentelemetry/api'

const tracer = trace.getTracer('workspace-service')

export async function loadWorkspace(id: string) {
  return tracer.startActiveSpan('workspace.load', async (span) => {
    try {
      span.setAttribute('workspace.id_present', Boolean(id))
      return await db.workspace.findUnique({ where: { id } })
    } catch (error) {
      span.recordException(error as Error)
      throw error
    } finally {
      span.end()
    }
  })
}
```

Do not attach sensitive values casually.

## 9. Trace context should propagate across services

A distributed system is observable only if context travels with the request.

```text
Next.js request
→ service A
→ service B
→ database/client
```

Use standard propagation from your OpenTelemetry libraries rather than inventing custom trace-header formats.

## 10. Request ID and trace ID are related but not identical

A request ID is useful for support and log lookup.

A trace ID identifies a distributed trace.

You may record both:

```json
{
  "requestId": "req_123",
  "traceId": "abc...",
  "routePath": "/app/workspace/[id]"
}
```

Do not assume every external request creates exactly one internal request object or vice versa.

## 11. Metrics answer population questions

Examples:

```text
request rate
unexpected error rate
latency p50/p95/p99
cache hit ratio
external dependency timeout rate
Server Action failure rate
```

Metrics should use bounded dimensions.

Bad label:

```text
userId
full URL
raw error message
```

Better:

```text
route template
surface
status class
operation
region when bounded
```

## 12. Logs answer specific-event questions

A structured log event can record:

```json
{
  "level": "warn",
  "event": "search_provider_timeout",
  "routePath": "/app/search",
  "requestId": "req_123",
  "durationMs": 1800
}
```

The log is useful because it is structured and queryable.

## 13. Logs are not a database of user activity by default

Do not use application logs as an ungoverned store for:

```text
full form submissions
private messages
raw uploaded content
access credentials
session cookies
complete response bodies
```

Observability should minimize data.

## 14. Metrics, traces, and logs should correlate

Ideal workflow:

```text
alert: error rate high
      ↓
metric identifies route
      ↓
trace shows slow/failing dependency
      ↓
log/error event provides diagnostic detail
```

If each signal uses unrelated naming, incidents become slower to resolve.

## 15. Service naming needs consistency

Use stable service identity:

```text
web-app
search-service
worker
```

Avoid service names that change per instance or deployment unless that dimension is stored separately.

## 16. Resource attributes describe the emitting service

Examples:

```text
service name
service version
deployment environment
region
runtime
```

Keep platform-specific fields clearly labeled.

## 17. Sampling is a cost and fidelity decision

You may not export every trace in a high-volume application.

Possible strategy:

```text
normal successful traces → sampled
slow traces → higher retention
error traces → high retention
security events → separate policy
```

Understand whether the provider performs head sampling, tail sampling, or both.

## 18. Sampling should be visible in analysis

If you sample 5% of traces, raw trace count is not request count.

Metrics often remain the better source for total rates.

## 19. Exporters are operational dependencies

Telemetry must leave the application process through an exporter or collector.

Failure questions:

```text
What if exporter endpoint is slow?
What if DNS fails?
What if collector is down?
What buffers exist?
What is dropped when the process exits?
```

Your observability system should not become the reason the application is unavailable.

## 20. Collector vs direct exporter

Two common patterns:

```text
app
→ OpenTelemetry Collector
→ backend
```

or:

```text
app
→ backend exporter directly
```

Collectors can centralize batching, routing, redaction, and backend choice.

Direct exporters can simplify small deployments.

The right choice depends on infrastructure ownership.

## 21. Self-hosting needs an explicit collector story

If you self-host Next.js, platform-managed observability should not be assumed.

Define:

```text
collector deployment
network path
credentials
buffering
retention
alerts
failure behavior
```

## 22. Edge runtime needs compatible instrumentation

Node-specific SDKs are not automatically Edge-compatible.

Keep runtime-specific imports separated and verify provider support.

## 23. Instrumentation startup failure policy

Because `register()` runs before the server is ready, decide what happens if monitoring setup fails.

Possible policies:

```text
required security/audit dependency missing
→ fail startup

optional telemetry exporter unavailable
→ start app with degraded observability
```

Make the decision explicit.

## 24. Custom metrics need ownership

Do not create dozens of metrics with no consumer.

For each metric answer:

```text
What question does it answer?
Who owns the dashboard?
What threshold matters?
What action follows an alert?
```

## 25. Error count without request count is misleading

```text
10 errors / 100 requests = serious
10 errors / 10,000,000 requests = very different
```

Measure error rate, not only error count.

## 26. Percentiles describe latency better than averages

Averages can hide a slow tail.

Track distributions such as:

```text
p50
p95
p99
```

Phase 15 owns detailed performance analysis, but Phase 14 establishes the telemetry required to perform it.

## 27. Logs need levels with meaning

Example policy:

```text
debug → temporary/development detail
info → meaningful normal event
warn → degraded/recoverable condition
error → unexpected failure requiring investigation
```

Do not log every user validation error at `error`.

## 28. OpenTelemetry is not an alerting policy

Instrumentation produces signals.

You still need:

```text
SLOs
alert thresholds
routing rules
on-call ownership
runbooks
```

The SDK cannot decide product severity for you.

## 29. Business observability and technical observability differ

Technical:

```text
request latency
500 rate
DB timeout
```

Product/business:

```text
publish success rate
search completion rate
signup completion
```

A system can be technically "up" while a critical workflow is broken.

Use both where appropriate.

## 30. A provider-neutral architecture

```text
Next.js app
  ├── instrumentation.ts
  ├── onRequestError
  ├── custom spans
  └── structured logs/metrics
          ↓
OpenTelemetry APIs / SDK
          ↓
collector or exporter
          ↓
observability backend
```

This reduces coupling between application code and one monitoring vendor.

## Debugging checklist

If traces are missing:

1. Did `register()` initialize the SDK?
2. Is the runtime compatible?
3. Is context propagation intact?
4. Is the exporter reachable?
5. Is the collector receiving data?
6. Is sampling dropping the trace?
7. Are custom spans properly ended?
8. Are provider filters excluding the service/environment?
9. Is the process terminating before export flush?
10. Are route or service names too high-cardinality to query effectively?

## Senior interview questions

**Why use OpenTelemetry instead of directly calling one vendor SDK everywhere?**  
It provides standard tracing/metrics/logging interfaces and context propagation, reducing application coupling and making backends easier to change.

**Why are dynamic route IDs bad span names?**  
They create high cardinality and fragment aggregation. Stable operation names with bounded attributes are easier to analyze.

**Why can't traces replace metrics?**  
Traces explain individual journeys and are often sampled; metrics are better for total rates and distributions across the whole population.

## Exercise

Design an OpenTelemetry architecture for a Next.js application with Node server rendering, one external service, a background worker, and two deployment regions. Define service names, resource attributes, sampling, collector/export path, request correlation, and failure behavior when telemetry infrastructure is unavailable.
