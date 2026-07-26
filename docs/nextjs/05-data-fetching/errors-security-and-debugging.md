---
title: Data Errors, Security & Debugging
description: Classify data failures, secure server reads, and debug latency, duplication, stale assumptions, and environment-specific behavior systematically.
---

# Data Errors, Security & Debugging

A data-fetching architecture is production-ready only if failures are understandable and sensitive data remains correctly scoped.

## Failure taxonomy

Do not reduce every failure to:

```text
Something went wrong
```

Classify the source:

```text
input error
not found
authentication failure
authorization failure
upstream 4xx
upstream 5xx
timeout
rate limit
schema mismatch
database failure
programming error
```

Different failures have different user experience and operational meaning.

## Missing resource vs unexpected failure

A project that does not exist is different from a database outage.

```text
project not found
→ route/resource semantics

database timeout
→ unexpected operational failure
```

Do not catch both and return `null`.

## Preserve useful errors

Bad:

```ts
try {
  return await getProject(id)
} catch {
  return null
}
```

Better:

- map expected domain conditions deliberately
- preserve unexpected errors for error boundaries/logging
- add context without exposing secrets

## Validate identifiers

Route params and search params are untrusted.

```ts
const projectId = ProjectIdSchema.parse(rawProjectId)
```

Validation prevents malformed inputs from becoming ambiguous database/service behavior.

Validation does not replace authorization.

## Authorize at data access

Safer query:

```ts
return db.project.findFirst({
  where: {
    id: projectId,
    organisationId: session.organisationId,
  },
})
```

The resource and tenant scope are enforced together.

Avoid:

```ts
const project = await db.project.findUnique({ where: { id: projectId } })
// later: maybe check tenant
```

when the query can enforce the scope directly.

## External data is untrusted

Even a trusted vendor can:

- change schema
- return partial data
- send malformed values
- have a compromised integration

Validate where correctness/security warrants it.

## Secrets and logs

Never log:

```text
Authorization header
session cookie
private API key
payment token
raw identity token
full sensitive database row
```

Prefer structured redacted context:

```text
service=catalogue
operation=get_product
product_id=p_42
status=timeout
duration_ms=5002
```

## Avoid PII-heavy errors

Bad:

```ts
throw new Error(`Failed user ${JSON.stringify(user)}`)
```

Error systems often forward messages to third-party observability platforms.

Log identifiers and safe metadata rather than whole records.

## Diagnose slow routes by stage

A useful timeline:

```text
request received
  ↓ 20 ms auth
identity ready
  ↓ 80 ms project query
project ready
  ↓ 600 ms billing API
billing ready
  ↓ 40 ms render
response/stream
```

Measure the longest stages instead of guessing.

## Duplicate work debugging

If logs show:

```text
getProject(p_42)
getProject(p_42)
getProject(p_42)
```

ask:

- same request or different requests?
- same arguments?
- repeated render path?
- missing React `cache` wrapper?
- dev HMR behavior?
- multiple browser requests?

Do not assume one cause.

## Development vs production behavior

Next.js development mode can behave differently around server `fetch`, HMR, and hard refreshes.

Current docs explicitly note that Server Component fetch responses can be reused across HMR refreshes in development, including requests that would otherwise be uncached.

A navigation or full reload may behave differently.

Therefore:

> test freshness and caching conclusions in a production build before declaring a bug.

## DevTools can change fetch behavior

Hard refreshes or disabled browser cache can send `cache-control: no-cache`.

Current Next.js docs note this can affect how server `fetch` cache options are treated in development.

Do not infer production cache behavior solely from a DevTools hard refresh.

Phase 6 covers the full cache model.

## Trace server and client separately

A slow navigation may involve:

```text
browser event
network request
server auth
data fetch
RSC generation
network transfer
client render
```

Use:

- browser Network panel
- server logs/traces
- database query logs
- upstream service telemetry

Correlate them with request IDs where possible.

## Timeouts need context

If an upstream call times out after 5 seconds, record:

```text
configured timeout
actual elapsed time
upstream service
attempt number
request/correlation ID
```

Do not log credentials or full request bodies by default.

## Retry storms

If each application request retries an unhealthy dependency three times:

```text
1,000 incoming requests
× 3 retries
= 3,000 additional upstream attempts
```

Retries can make an outage worse.

Use bounded retry policies, backoff, and circuit-breaking/platform controls where appropriate.

## Database debugging

Inspect:

- query count
- query plans
- indexes
- connection pool wait
- lock/transaction duration
- N+1 patterns
- selected columns

Moving a slow query from client fetch to Server Component does not make SQL faster.

## Authorization timing leaks

Be cautious about dramatically different behavior for unauthorized vs non-existent resources if resource existence itself is sensitive.

Product/security policy may prefer a consistent not-found response.

Phase 13 goes deeper into authorization semantics.

## Prevent data leakage through serialization

A secure server query can still leak if you pass the full record into a client boundary.

Audit:

```text
query projection
server transformations
Client Component props
client cache
browser network payload
```

The boundary is end-to-end.

## Error boundaries and partial degradation

If recommendations fail but the project itself is healthy:

```text
project content → render
recommendations → error fallback
```

may be better than failing the whole route.

If permissions fail:

```text
permissions unavailable
→ do not render privileged project data
```

Failure isolation must respect security and product criticality.

## Common mistakes

### Catching everything and returning empty arrays

Masks outages as valid “no data” states.

### Logging entire request/response objects

Can expose secrets and PII.

### Treating dev HMR freshness as production semantics

Verify with production behavior.

### Retrying every error

4xx validation/auth errors are not transient network failures.

### Measuring only browser rendering

Server/database time may dominate.

## Incident checklist

When production data fetching fails:

1. Confirm affected route/user/tenant scope.
2. Check recent deploy/config changes.
3. Inspect server error rate and latency.
4. Identify failing dependency.
5. Check database/service health.
6. Distinguish timeout vs rejection vs invalid data.
7. Check retry amplification.
8. Inspect cache/freshness behavior separately.
9. Verify no sensitive data is leaking through errors/logs.
10. Reproduce with the same environment/config where possible.

## Interview questions

**Why is returning `null` from every catch block dangerous?**  
It collapses valid empty/missing states and operational failures into one ambiguous result, harming UX and observability.

**Why should production builds be part of data-fetch debugging?**  
Development HMR and cache-control behavior can differ from production, especially around Server Component fetches.

**What is the security risk after a correctly authorized server query?**  
Over-serializing the result into Client Component props or browser caches can still expose fields the browser should never receive.

**What should you measure for a slow data route?**  
End-to-end route latency decomposed into auth, database/upstream calls, serialization/rendering, network transfer, and client work.

## Exercise

Create an incident playbook for an authenticated invoice route that depends on:

- session lookup
- PostgreSQL invoice query
- payment provider API
- optional analytics service

Define:

```text
expected failures
user-visible outcome
retry policy
logging fields
redacted fields
critical vs optional dependency
timeout budget
authorization point
production verification steps
```