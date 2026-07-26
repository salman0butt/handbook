---
title: Streaming Errors, Retries & Recovery
description: Understand failure behavior before and after streaming starts, Suspense versus error boundaries, retry design, and resilient streamed UI.
---

# Streaming Errors, Retries & Recovery

Streaming changes failure handling because a response may already be partially delivered when something fails.

A useful model is:

```text
before response starts
→ server can still choose global HTTP result

after shell/chunks are sent
→ recovery is primarily inside the rendered UI tree
```

This does not remove HTTP semantics. It changes which recovery options remain available after bytes are committed.

## Suspense is not an error boundary

Suspense answers:

```text
Is this subtree ready yet?
```

An error boundary answers:

```text
What UI should replace a subtree that failed?
```

Conceptually:

```text
pending promise
→ Suspense fallback

rejected promise / thrown error
→ error boundary
```

Do not use a loading fallback as the only failure plan.

## Route error files

App Router `error.tsx` provides route-segment error UI.

Because error boundaries are Client Components, they can offer retry/reset interactions.

Example structure:

```text
app/dashboard/
  page.tsx
  loading.tsx
  error.tsx
```

The exact failure boundary depends on where the error occurs and which segment boundary catches it.

Phase 14 covers full error handling semantics.

## Local error isolation

A slow optional panel should not necessarily take down the entire page.

Design:

```text
Dashboard shell
├── critical account summary
├── revenue panel
└── recommendations panel
```

If recommendations are optional, give that subtree a recoverable boundary so the account summary remains usable.

## Critical vs optional failures

Classify dependencies:

```text
critical
→ page cannot be correct without result

important
→ degrade visibly, allow retry

optional
→ omit/degrade without blocking main task
```

This classification should drive Suspense and error-boundary placement.

## Before streaming begins

If authentication or a critical route lookup fails before output begins, the server may still produce the appropriate redirect, not-found result, or error response according to framework semantics.

Perform critical control-flow checks early when they should determine the whole route.

Example:

```tsx
export default async function Page({ params }) {
  const { id } = await params
  const account = await getAuthorizedAccount(id)

  if (!account) {
    notFound()
  }

  return <AccountPage account={account} />
}
```

Do not stream a large shell for a resource the user is not authorized to access if authorization determines whether the route exists for them.

## After streaming begins

Suppose:

```text
shell sent
revenue panel sent
activity feed still pending
activity dependency fails
```

The browser already has a valid partial page.

Recovery should preserve completed regions and replace the failed subtree with meaningful error UI where possible.

This is more resilient than forcing the entire route into one atomic failure boundary.

## Late HTTP status limitations

Once response headers are committed, changing the overall status code may no longer be possible in the same way as before output begins.

Therefore do not make application correctness depend on a late streamed subtree being able to transform the entire HTTP response.

Critical status/control-flow decisions should happen at the correct boundary before irreversible response work where possible.

## Retry is not automatic correctness

A retry button can call `reset()` or trigger a fresh navigation/refresh depending on the boundary architecture.

But retries should only be offered when the operation is safe and potentially transient.

For reads:

```text
timeout
503 upstream
temporary network failure
```

may be retryable.

For mutations, retry semantics require idempotency and belong to Phase 7/8 architecture.

## Bounded server retries

If a server read is transient, a small bounded retry can sometimes improve resilience.

Do not create:

```text
infinite retry
long exponential delay inside render
multiple nested retry loops
```

Instead define:

- timeout budget
- retryable error classes
- maximum attempts
- overall route latency budget
- observability

## Timeouts

Streaming does not justify leaving dependencies open indefinitely.

For each external read define:

```text
connect/read timeout
business latency budget
fallback behavior
cancellation behavior
```

A dynamic hole that never completes is still a broken user experience.

## Abort and cancellation

When work becomes irrelevant—navigation changed, request aborted, client disconnected—cancellation can save resources if the underlying APIs support it.

Do not assume every database/library call automatically respects browser/request cancellation.

Treat cancellation support as dependency-specific.

## Error sanitization

Server rendering errors may contain:

```text
SQL details
internal URLs
stack traces
secret-bearing messages
vendor payloads
```

Do not expose raw exceptions as user-facing streamed content.

Return/log a safe error identifier and keep sensitive diagnostics server-side.

## Correlation IDs

A useful production pattern:

```text
request ID
→ server logs
→ dependency spans
→ user-visible safe incident code
```

Then a user can report a safe reference without seeing internal details.

Phase 14 deepens observability.

## Failure during Client Component hydration

A route can render successfully on the server and still fail in the browser because:

- client module failed to load
- hydration threw
- browser API assumption failed
- third-party library crashed

Server streaming success therefore does not guarantee interaction success.

Monitor browser/runtime errors separately.

## Failure during `use(promise)`

A Promise consumed with `use()` can reject.

Timeline:

```text
Client subtree attempts use(promise)
        ↓
pending → Suspense
        ↓
rejects → nearest error boundary
```

Design both boundaries deliberately.

## Failure hierarchy

A strong route can use layers:

```text
root/global error boundary
  ↓
route segment error boundary
  ↓
subtree-specific recoverable boundary
  ↓
Suspense boundary
  ↓
async content
```

Not every route needs every layer.

Use the smallest boundary that matches the recovery unit.

## Avoid swallowing control-flow exceptions

Framework navigation functions such as redirect/not-found use special control flow.

Broad `try/catch` blocks can accidentally swallow them.

Bad:

```tsx
try {
  if (!user) redirect('/login')
} catch (error) {
  return <ErrorMessage />
}
```

Keep control-flow calls outside broad exception handling, or rethrow appropriately according to documented semantics.

## Skeleton forever incident

If users report a fallback that never disappears:

1. Confirm the dependency request starts.
2. Check timeout configuration.
3. Check for swallowed rejection.
4. Check whether a Promise is recreated repeatedly.
5. Check server logs for aborted connections.
6. Check whether the boundary was replaced by navigation.
7. Check client runtime exceptions.
8. Inspect CDN/proxy buffering if chunks are not reaching the browser.

## Streaming behind proxies

Infrastructure can affect perceived streaming.

A reverse proxy/CDN may buffer responses depending on configuration and content behavior.

If local development streams progressively but production appears atomic, inspect the deployment path rather than assuming React/Next.js failed.

Phase 17 covers deployment depth.

## Observability timeline

Record stages such as:

```text
request received
shell ready
first byte sent
boundary A ready
boundary B ready
last chunk sent
client hydration error/success signals
```

This makes it possible to distinguish:

```text
slow shell
slow dependency
buffered transport
slow hydration
```

## Security failure

Authorization failure is not a normal optional rendering failure.

Do not render unauthorized private content and then hide it with a client error boundary.

Authorization must happen before protected data enters the rendered/RSC output.

## Common mistakes

### One route-level error boundary for every optional panel

Makes local failures unnecessarily destructive.

### Retrying every error

Authorization, validation, not-found, and deterministic code bugs are not solved by retry.

### Logging raw serialized payloads

Can expose sensitive data.

### Assuming a 200 response means every streamed region succeeded

Later regions can still fail after the response begins.

### Treating CDN buffering as framework rendering failure

Verify the full delivery chain.

## Production incident matrix

| Symptom | Likely area |
| --- | --- |
| shell never arrives | critical server render/dependency |
| shell arrives, fallback forever | async dependency/timeout/rejection/buffering |
| one region errors | subtree dependency/error boundary |
| local streams, production does not | proxy/CDN buffering |
| content visible, interactions broken | hydration/client JS |
| hard navigation fails, soft works | initial render/hydration path |
| soft navigation fails, hard works | Router Cache/reconciliation/preserved state |

## Interview questions

**What is the difference between Suspense and an error boundary?**  
Suspense handles pending readiness; error boundaries handle failures.

**Why are late streamed errors different from early route errors?**  
Some response bytes/headers may already be committed, so recovery typically happens inside the UI stream rather than by replacing the entire HTTP response.

**Should every failure be retried?**  
No. Retry only transient, safe operations within a defined latency/idempotency policy.

**Why can streaming work locally but not appear progressive in production?**  
Infrastructure such as proxies/CDNs may buffer or alter response delivery.

## Exercise

Design failure behavior for:

```text
account authorization
critical profile read
optional recommendations
payment history
analytics chart
```

For each choose:

- early blocking vs streamed
- Suspense fallback
- error-boundary scope
- retry policy
- timeout
- safe user-facing error
- observability fields
