---
title: Error Taxonomy, Expected Failures & Control Flow
description: Separate expected failures, uncaught exceptions, HTTP outcomes, and framework control-flow signals so recovery and observability stay correct.
---

# Error Taxonomy, Expected Failures & Control Flow

A production Next.js application should not treat every failure as the same kind of error.

The most useful starting model is:

```text
request or interaction
        ↓
what happened?
        ├── expected business failure
        ├── expected HTTP/domain absence
        ├── framework control flow
        └── unexpected exception
```

Those categories need different UI, status codes, logs, alerts, and recovery behavior.

## 1. Expected failures are part of normal product behavior

Examples:

```text
invalid form input
email already registered
payment declined
quota exceeded
resource state conflict
third-party request rejected in a known way
```

These should usually become **typed return values**, not uncaught exceptions.

For Server Actions, a useful shape is:

```ts
type SaveResult =
  | { ok: true; id: string }
  | { ok: false; code: 'VALIDATION'; message: string }
  | { ok: false; code: 'CONFLICT'; message: string }

'use server'

export async function saveProfile(
  _prev: SaveResult | null,
  formData: FormData,
): Promise<SaveResult> {
  const name = formData.get('name')

  if (typeof name !== 'string' || name.trim().length < 2) {
    return {
      ok: false,
      code: 'VALIDATION',
      message: 'Enter a valid name.',
    }
  }

  const updated = await updateProfile({ name: name.trim() })

  if (!updated) {
    return {
      ok: false,
      code: 'CONFLICT',
      message: 'The profile changed. Refresh and try again.',
    }
  }

  return { ok: true, id: updated.id }
}
```

This makes an important distinction:

> A user-visible negative outcome is not automatically a software exception.

## 2. Unexpected exceptions indicate broken assumptions

Examples:

```text
database driver throws unexpectedly
required environment variable is missing
serialization invariant fails
code reaches an impossible branch
vendor SDK crashes
bug causes null dereference
```

These should usually **throw** and be captured by an error boundary or server observability hook.

```ts
const invoice = await db.invoice.findUnique({ where: { id } })

if (!invoice) {
  return { ok: false, code: 'NOT_FOUND' as const }
}

if (!invoice.accountId) {
  throw new Error('Invariant: invoice missing accountId')
}
```

Do not convert every unexpected exception into:

```ts
return { ok: false }
```

That can erase the failure signal your telemetry needs.

## 3. `notFound()` is framework control flow

When a route's requested resource does not exist, Next.js provides `notFound()`.

```tsx
import { notFound } from 'next/navigation'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) notFound()

  return <article>{post.title}</article>
}
```

`notFound()` terminates rendering of the segment and selects the relevant `not-found.tsx` UI.

It is implemented through a framework-controlled thrown signal.

That means this is dangerous:

```ts
try {
  const post = await getPost(slug)
  if (!post) notFound()
} catch (error) {
  console.error(error)
  return null
}
```

The broad catch can swallow Next.js control flow.

## 4. Redirects are also control flow

The same principle applies to:

```text
redirect()
permanentRedirect()
```

A common safe structure is:

```ts
const result = await performWork()

if (!result.ok) {
  return { message: result.message }
}

redirect(`/items/${result.id}`)
```

Do the redirect **outside** a broad application `try/catch` whenever practical.

## 5. Avoid broad catches around entire route trees

Bad:

```ts
export default async function Page() {
  try {
    const user = await requireUser()
    const data = await loadDashboard(user.id)

    if (!data) notFound()

    return <Dashboard data={data} />
  } catch {
    return <p>Something failed</p>
  }
}
```

This collapses:

```text
auth control flow
404 control flow
network failure
DB bug
programming error
```

into one undifferentiated UI.

Prefer narrow ownership:

```text
known failure
→ return a modeled result

missing route resource
→ notFound()

unexpected exception
→ throw to boundary + telemetry
```

## 6. Expected HTTP failures still need semantics

For Route Handlers, a negative outcome can be expected while still requiring an HTTP error status.

```ts
export async function POST(request: Request) {
  const input = await parseCreateRequest(request)

  if (!input.ok) {
    return Response.json(
      { error: 'INVALID_INPUT' },
      { status: 422 },
    )
  }

  const created = await createThing(input.value)

  if (!created.ok) {
    return Response.json(
      { error: 'CONFLICT' },
      { status: 409 },
    )
  }

  return Response.json(created.value, { status: 201 })
}
```

No exception is required for a known `422` or `409` outcome.

## 7. Errors need an ownership layer

For every failure ask:

```text
who can make the best decision?
```

Typical ownership:

```text
validation error
→ form/action layer

authorization denial
→ protected operation / HTTP boundary

resource absent
→ route segment / notFound

vendor business rejection
→ integration/domain adapter

unexpected runtime exception
→ error boundary + instrumentation
```

A layer should not hide failures it cannot meaningfully recover from.

## 8. Public messages and internal diagnostics are different products

A user might see:

```text
We couldn't save your changes. Try again.
```

Telemetry might record:

```json
{
  "event": "profile_update_failed",
  "requestId": "req_123",
  "route": "/settings/profile",
  "errorClass": "DatabaseUnavailable",
  "retryable": true
}
```

Do not send internal exception details to the browser simply because operators need them.

## 9. Error codes are better than parsing messages

Avoid client code like:

```ts
if (error.message.includes('duplicate')) {
  // ...
}
```

Prefer a stable contract:

```ts
type DomainFailure =
  | { code: 'EMAIL_TAKEN' }
  | { code: 'PLAN_LIMIT' }
  | { code: 'VERSION_CONFLICT' }
```

Human-facing copy can evolve without breaking application logic.

## 10. Retryability is part of the failure model

Not every error should produce a Retry button.

Useful categories:

```text
retryable transient
→ timeout, temporary dependency outage

retryable after user change
→ validation, conflict

not retryable in current state
→ forbidden, deleted resource

unknown
→ safe fallback + telemetry
```

Blind retries can duplicate mutations or amplify outages.

## 11. Idempotency and retries belong together

If an operation may be retried, ask whether repeating it is safe.

```text
GET request
→ usually safe to retry

create payment
→ requires idempotency design

send email
→ may duplicate side effect

consume webhook
→ provider event ID / deduplication
```

Recovery UI cannot compensate for missing backend idempotency.

## 12. Cancellation is not always an error

Client navigation, aborted fetches, and intentionally cancelled work can appear as rejected promises.

Telemetry should distinguish:

```text
user left route
request aborted intentionally
browser cancelled speculative work
actual dependency failure
```

Otherwise dashboards become noisy and alerts lose credibility.

## 13. Framework-generated errors need framework handling

Several Next.js APIs rely on thrown internal control-flow errors.

Stable architectural advice:

- avoid catching them by keeping `try/catch` narrow;
- call redirects/not-found helpers outside broad catch blocks where possible;
- do not inspect private `NEXT_*` error strings as an application API.

`unstable_rethrow` exists for mixed catch blocks, but it is explicitly unstable. It should not become the default structure of production application code.

## 14. Experimental error APIs stay experimental

Current documentation exposes newer names such as:

```text
unstable_catchError
unstable_retry
unstable_rethrow
```

The `unstable_` prefix is the contract.

This handbook does not silently replace stable patterns with them.

Production baseline remains:

```text
expected errors
→ return modeled state

unexpected render errors
→ error.tsx / global-error.tsx

segment absence
→ notFound()

navigation control flow
→ redirect()/permanentRedirect()
```

## 15. Logging severity follows operational meaning

Do not log every expected validation failure at `error` severity.

A simple policy:

| Outcome | Typical severity |
| --- | --- |
| invalid user input | info / metric |
| known conflict | info / warning depending on significance |
| auth attack signal | security event |
| dependency timeout | warning or error |
| invariant failure | error |
| outage affecting many users | alert-worthy error |

The point is not the exact labels. The point is preserving signal.

## Debugging checklist

When a failure is hard to classify:

1. Can this happen during correct normal usage?
2. Can the user fix it?
3. Does it require a specific HTTP status?
4. Is Next.js using a thrown signal for routing/control flow?
5. Can the current layer actually recover?
6. Should this wake an engineer?
7. Is the operation safe to retry?
8. What public message is safe?
9. What internal fields are needed to diagnose it?

## Senior interview questions

**Why shouldn't expected Server Action errors be thrown?**  
Because validation and business rejections are normal outcomes. Returning structured state gives the UI an explicit contract while keeping exception telemetry focused on unexpected failures.

**Why can broad `try/catch` be dangerous in Next.js?**  
Framework APIs such as `notFound()` and redirects use thrown control-flow signals. A broad catch can intercept them and prevent Next.js from completing the intended behavior.

**Should a 409 response appear in your exception alert dashboard?**  
Not automatically. A known conflict is an HTTP error response but may be expected product behavior. Alerting depends on whether its frequency or context indicates a system problem.

## Exercise

Classify each outcome and choose its UI, HTTP semantics, logging severity, and retry policy:

```text
invalid email
invoice already paid
invoice ID does not exist
DB connection refused
OAuth user cancelled sign-in
webhook signature invalid
provider timeout
permission denied
stale optimistic version
unexpected null in domain invariant
```

If every row ends up as `throw new Error`, the failure model is too shallow.
