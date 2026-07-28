---
title: Observability Architecture, SLOs, Alerts & Design Review
description: Turn error handling and telemetry into an operational system with SLOs, alerting, release correlation, runbooks, privacy, ownership, and senior architecture review.
---

# Observability Architecture, SLOs, Alerts & Design Review

Collecting telemetry is not the same as being observable.

A production observability system should help answer:

```text
Is the product healthy?
Who is affected?
What changed?
Where is time being spent?
Which dependency is failing?
Can we mitigate safely?
How do we prevent recurrence?
```

## 1. Start from user journeys

Do not begin with dashboards.

Begin with critical workflows:

```text
sign in
open dashboard
search
save document
publish change
upload file
```

Then ask what signals prove each journey is healthy.

## 2. SLI, SLO, and alert are different concepts

### SLI

A measured indicator.

```text
successful publish operations / total publish attempts
```

### SLO

A reliability target.

```text
99.9% successful publish operations over 30 days
```

### Alert

A notification that requires action.

```text
error budget is burning too quickly
```

Do not alert on every metric threshold simply because you can.

## 3. Technical uptime can hide product failure

Suppose:

```text
GET /dashboard → 200
```

but the page displays:

```text
Unable to load workspace data
```

HTTP availability alone would call this healthy.

A better system may combine:

```text
HTTP outcome
render exception rate
dependency health
workflow success metric
client failure rate
```

## 4. Error budgets create prioritization

If an SLO allows a small amount of failure, the remaining tolerance is the error budget.

This helps teams reason about:

```text
shipping speed
reliability work
incident severity
release risk
```

The exact target should come from product needs, not fashion.

## 5. Alert on symptoms users care about

Useful alerts often focus on:

```text
unexpected error rate
critical workflow success
latency against SLO
availability
queue/backlog health
```

Less useful:

```text
one random log line exists
one process restarted
one non-critical vendor call failed once
```

Alerts should lead to clear action.

## 6. Alert routing needs ownership

Every alert should answer:

```text
who receives it?
what service do they own?
what runbook exists?
what severity is it?
what is the first diagnostic query?
```

An alert with no owner becomes noise.

## 7. Use burn-rate thinking for SLO alerts

Instead of alerting on a tiny temporary spike, evaluate how quickly the service is consuming its allowed failure budget.

This can reduce noisy pages while catching sustained or severe user impact.

## 8. Separate expected failures from reliability failures

These should not share one error-rate metric:

```text
invalid form input
permission denial
resource not found
unexpected render exception
database outage
```

Expected product outcomes belong to product/security metrics.

Unexpected failures belong to reliability signals.

## 9. Route templates are strong aggregation keys

Prefer:

```text
/app/projects/[id]
```

rather than:

```text
/app/projects/123
/app/projects/456
```

High-cardinality route values make dashboards expensive and hard to read.

## 10. Operation names help Server Action observability

A useful action event:

```json
{
  "surface": "server-action",
  "operation": "publishDocument",
  "route": "/app/documents/[id]",
  "result": "unexpected_error"
}
```

Do not attach arbitrary form contents.

## 11. Release correlation should be first-class

Every major telemetry signal should make it possible to answer:

```text
Did this begin after release X?
```

Include a stable release identifier in:

```text
server logs
error events
traces
client events
metrics where cardinality allows
```

## 12. Deployment topology is part of observability

A failure may affect only:

```text
one region
one runtime
one instance type
one hosting adapter
one CDN path
```

Store enough bounded deployment metadata to detect that pattern.

## 13. Multi-tenant applications need privacy-safe tenant correlation

Sometimes incidents affect one tenant configuration.

A telemetry field might use:

```text
internal tenant identifier
hashed/bounded tenant key
plan category
feature configuration
```

Only collect what is necessary and allowed.

Avoid making dashboards a shadow customer database.

## 14. Browser and server telemetry need shared correlation

Useful flow:

```text
browser navigation
→ request ID / trace context
→ server render
→ dependency call
→ error digest
→ client fallback
```

Even partial correlation dramatically improves debugging.

## 15. Error digest is not your only correlation key

A Next.js error digest helps match sanitized Server Component failures.

You still need:

```text
request ID
trace ID
release ID
route
operation
```

for broader incident analysis.

## 16. Design telemetry schemas like APIs

A logging schema should be stable enough for dashboards and alerts.

Example fields:

```text
timestamp
level
event
service
release
routePath
surface
requestId
traceId
result
errorCode
```

Changing field names casually can silently break alerts.

## 17. Separate message from machine fields

Weak:

```text
"publish failed for project 123 because timeout"
```

Better:

```json
{
  "event": "document_publish_failed",
  "projectIdPresent": true,
  "reason": "dependency_timeout"
}
```

Machine fields support reliable queries.

## 18. Redaction is part of architecture

Define what must never enter telemetry:

```text
passwords
session cookies
access tokens
private keys
raw auth headers
secret URLs
full sensitive bodies
```

Then implement automated redaction and schema review.

## 19. Data retention should match signal value

Not every signal needs the same retention.

Example policy:

```text
high-volume debug logs → short
aggregated metrics → longer
security audit records → governed policy
incident traces → sampled retention
```

Retention is a cost, privacy, and compliance decision.

## 20. Sampling belongs in the design review

For each signal define:

```text
capture rate
sampling method
error override
slow-trace override
security exception policy
```

Document it so engineers know what dashboards represent.

## 21. Dashboards should answer decisions

A strong dashboard may show:

```text
request rate
success/error rate
latency percentiles
top failing routes
top dependency failures
release comparison
region comparison
```

Avoid vanity charts with no operational question.

## 22. Logs need queryable event names

Instead of inventing a sentence for every log:

```text
event = "request_error"
event = "provider_timeout"
event = "auth_denied"
event = "cache_revalidation_failed"
```

This creates reusable operational language.

## 23. Runbooks shorten incidents

A good runbook includes:

```text
symptom
likely causes
first queries
safe mitigation
rollback path
dependency status links
owner
verification steps
```

Do not write a runbook that requires already knowing the root cause.

## 24. Error fallback copy belongs in incident design

User-facing fallback should help operations too.

Possible elements:

```text
safe request/reference ID
retry when meaningful
alternative navigation
support path
```

Do not expose stack traces.

## 25. Observability itself can fail

Design for:

```text
collector outage
monitoring vendor outage
network partition
quota exhaustion
SDK bug
bad sampling config
```

Application correctness should not normally depend on non-critical telemetry availability.

## 26. Audit-grade events need stronger guarantees

Some events may have legal, security, or operational significance.

Those should not be treated as ordinary best-effort logs.

Possible architecture:

```text
business transaction
→ durable event/outbox
→ governed audit store
```

This is different from `console.log` or `after()` analytics.

## 27. Error monitoring should deduplicate by root event

A single failure can appear in:

```text
onRequestError
OpenTelemetry span
provider automatic error capture
client fallback breadcrumb
```

Define one canonical error event and link supporting telemetry to it.

## 28. Alert fatigue is a reliability failure

Noisy alerts train responders to ignore the system.

Review:

```text
false positives
non-actionable pages
duplicate alerts
flapping thresholds
alerts without runbooks
```

Delete or redesign low-value alerts.

## 29. Security and reliability telemetry should intersect carefully

Examples:

```text
sudden 403 spike
webhook signature failures
rate-limit surge
unexpected auth provider errors
```

These can be reliability or attack signals.

Correlate them without exposing sensitive authentication evidence broadly.

## 30. Incident severity should be user-impact based

A practical severity model considers:

```text
percentage affected
critical journey affected
data integrity risk
security impact
workaround availability
duration
```

One large stack trace is not automatically a high-severity incident.

## 31. Post-incident review should produce system changes

Useful outputs:

```text
regression test
new alert
better dashboard
safer fallback
runbook update
architecture fix
release guardrail
```

The goal is not assigning blame.

## 32. Observability and testing complement each other

Tests answer:

```text
Does this known scenario work before release?
```

Observability answers:

```text
What is actually happening in production?
```

You need both.

## 33. Observability and performance complement each other

Phase 15 will use these signals to optimize:

```text
LCP
INP
server latency
RSC navigation latency
cache behavior
third-party cost
```

Without reliable telemetry, performance work becomes guesswork.

## 34. Senior design review template

For a new feature, ask:

### Failure model

What expected and unexpected failures exist?

### User recovery

What fallback, retry, or alternate path exists?

### Server telemetry

What does `onRequestError` or structured logging capture?

### Client telemetry

What browser failures matter?

### Tracing

Which dependency operations need spans?

### Metrics

What rate/latency/success indicators matter?

### Privacy

What data must be excluded?

### Release correlation

How will incidents map to deployments?

### Alerts

Which conditions require human action?

### Runbook

What is the first response procedure?

## 35. Reference architecture

```text
Browser
  ├── instrumentation-client
  ├── error / rejection capture
  ├── navigation breadcrumbs
  └── Web Vitals pipeline
          ↓
        telemetry backend
          ↑
Next.js server
  ├── instrumentation.ts
  ├── onRequestError
  ├── structured logs
  ├── metrics
  └── OpenTelemetry spans
          ↓
collector / exporter
          ↓
observability backend
          ↓
dashboards + alerts + traces + runbooks
```

## 36. Production review checklist

1. Are expected failures separated from exceptions?
2. Are error boundaries aligned with useful recovery regions?
3. Are server errors captured before client sanitization?
4. Are browser errors and rejections captured?
5. Are request/trace/release IDs correlated?
6. Are route names normalized?
7. Are secrets and sensitive bodies excluded?
8. Are metrics low-cardinality?
9. Are traces sampled intentionally?
10. Are alerts actionable and owned?
11. Can telemetry fail without breaking the app?
12. Are source maps tied to exact releases?
13. Are runbooks tested during incidents?
14. Are critical workflows measured end-to-end?
15. Does each dashboard answer an operational question?

## Senior interview questions

**What makes an application observable rather than merely logged?**  
Operators can infer internal system state and user impact from correlated logs, metrics, traces, errors, and workflow signals, with enough context to diagnose and act.

**Why should alerts target user symptoms?**  
Internal component failures matter when they create user impact. Symptom-oriented alerts reduce noise and align response urgency with product reliability.

**Why are expected 4xx outcomes dangerous in a single error metric?**  
They inflate the apparent failure rate even when the application is behaving correctly, hiding the unexpected errors that actually threaten reliability.

## Exercise

Design the observability architecture for a multi-tenant document platform. Define three critical journeys, SLIs/SLOs, error taxonomy, route/action event schemas, browser/server correlation, tracing, sampling, redaction, dashboards, alerts, and two incident runbooks.
