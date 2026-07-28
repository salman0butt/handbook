---
title: Server Actions, Route Handlers, Client Errors & Failure Contracts
description: Model failures correctly across Server Actions, Route Handlers, Server Components, Client Components, and third-party integrations.
---

# Server Actions, Route Handlers, Client Errors & Failure Contracts

The App Router has several execution surfaces:

```text
Server Component
Server Action
Route Handler
Client Component
Proxy
after() work
third-party integration
```

The same root cause may require different behavior depending on which surface owns it.

## Server Action expected failures should be return values

For validation and known business rules, return structured state.

```ts
'use server'

import { z } from 'zod'

const Schema = z.object({ title: z.string().min(3) })

type State =
  | { status: 'idle' }
  | { status: 'error'; code: 'VALIDATION' | 'CONFLICT'; message: string }
  | { status: 'success'; id: string }

export async function createProject(
  _prev: State,
  formData: FormData,
): Promise<State> {
  const parsed = Schema.safeParse({ title: formData.get('title') })

  if (!parsed.success) {
    return {
      status: 'error',
      code: 'VALIDATION',
      message: 'Enter a valid title.',
    }
  }

  const result = await createProjectRecord(parsed.data)

  if (result.type === 'conflict') {
    return {
      status: 'error',
      code: 'CONFLICT',
      message: 'The project changed. Refresh and try again.',
    }
  }

  return { status: 'success', id: result.id }
}
```

The client can consume this with `useActionState`.

## Unexpected Server Action failures should remain exceptional

If a required dependency crashes and the action cannot recover meaningfully, let the exception propagate to framework handling and telemetry.

Do not flatten it into:

```ts
return { status: 'error', message: String(error) }
```

That can leak details and hide the operational signal.

## Retryable mutations need idempotency reasoning

A Retry button is only safe if repeating the operation is safe.

```text
create record succeeds
      ↓
response connection drops
      ↓
client believes operation failed
      ↓
user retries
      ↓
duplicate record?
```

Possible controls include:

```text
idempotency token
unique domain constraint
request identity
transaction boundary
deduplication key
```

## Route Handlers own explicit HTTP contracts

```ts
export async function POST(request: Request) {
  const body = await request.json().catch(() => null)

  if (!body) {
    return Response.json(
      { error: { code: 'INVALID_JSON' } },
      { status: 400 },
    )
  }

  const result = await createItem(body)

  if (result.type === 'validation') {
    return Response.json(
      { error: { code: 'INVALID_ITEM', fields: result.fields } },
      { status: 422 },
    )
  }

  if (result.type === 'conflict') {
    return Response.json(
      { error: { code: 'ITEM_CONFLICT' } },
      { status: 409 },
    )
  }

  return Response.json(result.item, { status: 201 })
}
```

Known `400`, `409`, or `422` outcomes do not need uncaught exceptions.

## Avoid `200 { ok: false }` for every API failure

That weakens:

```text
client retry logic
reverse-proxy metrics
APM grouping
SLO calculations
external API consumers
```

Use meaningful status codes and safe public bodies.

## Public API errors need stable machine codes

```json
{
  "error": {
    "code": "ITEM_CONFLICT",
    "message": "The item changed. Refresh and try again.",
    "requestId": "req_123"
  }
}
```

The code drives client logic. The message can evolve independently.

## Never serialize raw exceptions

Unsafe:

```ts
catch (error) {
  return Response.json(error, { status: 500 })
}
```

It may leak stack traces, internal paths, hostnames, query text, or vendor details.

Return a generic failure envelope and capture full details server-side.

## Translate third-party failures at an adapter boundary

```text
vendor SDK
   ↓
integration adapter
   ↓
application result model
```

Example:

```ts
type SyncResult =
  | { ok: true; externalId: string }
  | { ok: false; type: 'rejected' }
  | { ok: false; type: 'temporary_unavailable' }
```

Unexpected SDK crashes can still throw.

## Timeouts are an application decision

```ts
const controller = new AbortController()
const timer = setTimeout(() => controller.abort(), 5_000)

try {
  return await fetch(url, { signal: controller.signal })
} finally {
  clearTimeout(timer)
}
```

The real timeout should come from the user journey and dependency contract.

## Retry policies must avoid retry storms

Use bounded attempts, backoff, jitter, and retryable-status rules.

Do not retry validation or authorization failures as if they were transient dependency outages.

## Server Components should model known empty states

```tsx
export async function Recommendations() {
  const result = await getRecommendations()

  if (result.type === 'empty') {
    return <p>No recommendations yet.</p>
  }

  return <RecommendationList items={result.items} />
}
```

An empty list is not a render crash.

## Infrastructure failures should bubble when local recovery is impossible

```ts
try {
  return await provider.loadRecommendations()
} catch (cause) {
  throw new Error('Recommendation provider unavailable', { cause })
}
```

Then boundary placement controls the visible blast radius.

## Client event failures need explicit local state

```tsx
'use client'

import { useState } from 'react'

export function CopyButton() {
  const [message, setMessage] = useState('')

  async function copy() {
    try {
      await navigator.clipboard.writeText('hello')
      setMessage('Copied')
    } catch {
      setMessage('Copy failed. Select the text manually.')
    }
  }

  return (
    <>
      <button onClick={copy}>Copy</button>
      <p aria-live="polite">{message}</p>
    </>
  )
}
```

A route error boundary does not automatically turn arbitrary event-handler rejection into fallback UI.

## Browser errors have multiple channels

```text
render exception
unhandled promise rejection
event-handler failure
resource load failure
network/API rejection
hydration mismatch
third-party script failure
```

One global listener is not a complete browser observability system.

## Hydration failures cross server/client boundaries

Common causes include:

```text
nondeterministic render output
browser-only branching during SSR
invalid HTML nesting
locale/timezone differences
extension or script DOM mutation
```

The visible error is client-side, but the root cause may be server/browser divergence.

## Failure state needs a reset rule

For every client error state ask:

```text
what clears it?
new input?
retry success?
new route?
component remount?
```

Otherwise a temporary error can become permanent UI state.

## Race control matters for client requests

```text
request A starts
request B starts
B succeeds
A fails late
```

Without cancellation or request identity, the old failure can overwrite newer success.

Use abort signals, sequence IDs, or a data library with race management.

## Proxy failures need front-door semantics

Proxy should stay small, fast, low-dependency, and observable.

If Proxy crashes, matched requests may never reach the route.

Do not put fragile multi-service orchestration there.

## `after()` is for non-blocking post-response work

Next.js `after()` is useful for work such as logging or analytics that should not delay the response.

It is not a durable job queue.

If losing the task would break core correctness, use a durable architecture appropriate to that requirement.

## `after()` can run after error outcomes

Next.js documents that `after()` may run when a response fails, redirects, or resolves to not-found.

That makes it useful for outcome logging, but avoid duplicate reporting if `onRequestError` already records the exception.

## Request APIs inside `after()` depend on call site

In Route Handlers and Server Actions, request APIs can be accessed inside the callback.

In Server Components, read request data during rendering and pass the needed safe values into the `after()` closure.

## Failure contracts need boundary tests

For a Route Handler, test:

```text
malformed input → 400
validation → 422
unauthenticated → 401
forbidden → 403
missing → 404
conflict → 409
rate limit → 429
unexpected exception → safe 500 + telemetry
```

For a Server Action, test validation, conflict, authorization, dependency crash, retry behavior, and redirect-after-success behavior separately.

## Logs should identify the execution surface

```json
{
  "surface": "route-handler",
  "route": "/api/items",
  "method": "POST",
  "requestId": "req_123"
}
```

For an action:

```json
{
  "surface": "server-action",
  "operation": "createProject",
  "requestId": "req_123"
}
```

## Failure ownership table

| Surface | Expected failure | Unexpected failure |
| --- | --- | --- |
| Server Action | return state | throw / server telemetry |
| Route Handler | explicit HTTP response | safe 500 + telemetry |
| Server Component | conditional UI / `notFound()` | throw to boundary |
| Client event | local or mutation state | local capture + browser telemetry |
| Proxy | explicit redirect/rewrite/reject | server telemetry + fail policy |
| `after()` work | best-effort result | observe separately; sent response cannot change |

## Senior interview questions

**Why shouldn't a Server Action return raw exception messages?**  
Because it crosses a server-to-client boundary. Raw messages can leak implementation details and blur expected product failures with unexpected bugs.

**Why is `after()` not a durable queue?**  
It executes within the deployment runtime's response lifecycle and duration limits. Critical durable work needs stronger persistence guarantees.

**How should a Route Handler represent a known conflict?**  
Use an explicit HTTP status such as 409 and a stable safe error code, not an uncaught exception.

## Exercise

Design failure contracts for a document publishing flow with validation, edit conflict, temporary indexing-provider outage, successful write followed by connection loss, optional analytics, and a webhook notification. Specify result vs exception, HTTP/action semantics, idempotency, user message, telemetry, and retry policy.
