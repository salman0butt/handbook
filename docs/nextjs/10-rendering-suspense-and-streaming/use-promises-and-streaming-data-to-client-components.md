---
title: use(), Promises & Streaming Data to Client Components
description: Start data on the server, pass Promises across the RSC boundary, consume them with React use(), and design Suspense-aware client islands.
---

# use(), Promises & Streaming Data to Client Components

A useful App Router pattern is:

```text
Server Component starts async work
        ↓
Promise crosses into a Client Component
        ↓
Client Component reads Promise with use()
        ↓
nearest Suspense boundary owns pending UI
```

This can preserve server data ownership while allowing a Client Component to consume the result where interactivity is needed.

## Basic pattern

Server Component:

```tsx
import { Suspense } from 'react'
import { ReviewsClient } from './reviews-client'

export default function Page() {
  const reviewsPromise = getReviews()

  return (
    <Suspense fallback={<ReviewsSkeleton />}>
      <ReviewsClient reviewsPromise={reviewsPromise} />
    </Suspense>
  )
}
```

Client Component:

```tsx
'use client'

import { use } from 'react'

export function ReviewsClient({
  reviewsPromise,
}: {
  reviewsPromise: Promise<Review[]>
}) {
  const reviews = use(reviewsPromise)

  return <InteractiveReviews reviews={reviews} />
}
```

## Why start the Promise on the server?

The server can:

- access server-only credentials
- query databases directly
- start work before client JavaScript loads
- keep data ownership near the source
- avoid exposing an unnecessary public HTTP endpoint

The Client Component receives only the Promise/result boundary needed for rendering.

## `use()` suspends

When `use(promise)` reads a Promise that is still pending, React suspends the component.

The nearest Suspense boundary shows its fallback until the Promise resolves.

Conceptually:

```text
Client component renders
      ↓
use(promise)
      ↓
pending?
  ├─ yes → suspend → fallback
  └─ no  → render value
```

## Promise identity matters

Create the Promise in a stable server render path.

Avoid manufacturing new client-side Promises during every render.

Bad pattern:

```tsx
'use client'

export function Panel() {
  const data = use(fetch('/api/data').then((r) => r.json()))
  return <View data={data} />
}
```

This mixes browser fetching, Promise creation, and render ownership in a way that can create repeated work and poor cache behavior.

If the browser should own the fetch, use an appropriate Suspense-enabled client data layer or explicit client fetching architecture.

## Serialization rules still apply

The resolved data must be safe and serializable across the Server → Client boundary.

Do not pass:

```text
DB connection objects
ORM clients
File handles
secret-bearing objects
unnecessary internal fields
```

Project the data first.

## Promise passing does not make the Client Component server-only

The Client Component still ships JavaScript because it is a Client Component.

Only the data work was initiated by the server.

This matters for bundle/performance analysis.

## Start early, consume later

Promise passing is useful when the server can start independent work immediately.

```tsx
export default function Page() {
  const profilePromise = getProfile()
  const activityPromise = getActivity()

  return (
    <>
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileClient promise={profilePromise} />
      </Suspense>

      <Suspense fallback={<ActivitySkeleton />}>
        <ActivityClient promise={activityPromise} />
      </Suspense>
    </>
  )
}
```

Both operations begin before either Client Component consumes its result.

## When not to use this pattern

Do not pass a Promise merely because `use()` exists.

Prefer a normal Server Component when:

```text
no client interactivity is needed
server can render final UI directly
client bundle would add no value
```

Example:

```tsx
async function Reviews() {
  const reviews = await getReviews()
  return <ReviewList reviews={reviews} />
}
```

This is simpler if the region is static/non-interactive.

## When a Client Component needs only a small interactive leaf

Instead of turning the whole data region into a Client Component:

```text
Server ReviewsList
  ↓
Client SortButton
```

can be better than:

```text
Client ReviewsDashboard
  ↓
all review rendering client-side
```

Keep client boundaries narrow.

## Error behavior

A Promise passed to `use()` can reject.

Suspense handles pending state, not the final error UI.

Use the appropriate error boundary strategy around the subtree.

Think:

```text
pending → Suspense fallback
rejected → Error boundary
resolved → content
```

## Retry behavior

Retry policy belongs to the data/domain layer, not automatically to `use()`.

Do not assume React retries failed network/database work for you.

If a dependency is transient, design retry with:

- bounded attempts
- timeout budgets
- idempotent reads
- error classification
- observability

## Cache interactions

The Promise-producing function may itself use:

- React `cache` for render/request deduplication
- Next.js `use cache` for persistent framework caching
- uncached request-time reads

Those are separate reuse decisions.

`use()` is a consumption API, not a persistence cache.

## Suspense placement

If multiple Client Components read the same Promise under one boundary, they reveal together.

If they should reveal independently, use separate Promise/boundary ownership where appropriate.

Do not split one logically atomic result into awkward UI fragments simply to maximize streaming.

## Security

Server-started data is still browser-visible once passed to a Client Component.

Rule:

> Server ownership protects implementation and credentials, not the resolved client-visible value.

Authorize before starting the query and minimize data before crossing the boundary.

## Avoid internal Route Handler hops

Bad server pattern:

```tsx
const reviewsPromise = fetch('https://my-app.com/api/reviews')
```

when the data source is owned by the same application.

Prefer:

```tsx
const reviewsPromise = getReviews()
```

from a server-only data/domain module.

That avoids extra HTTP latency and build/request coupling.

## Streaming timeline

A possible timeline:

```text
T0 server render starts
T1 reviews query starts
T2 shell + fallback available
T3 browser paints shell
T4 reviews query resolves
T5 RSC chunk streams result
T6 Client Component reveals/hydrates as needed
```

This is why Promise ownership and Suspense placement can affect perceived latency.

## Client navigation

During an App Router client transition, the framework can stream the next RSC result into the existing tree.

A Promise-consuming Client Component can participate in that transition without requiring a full document reload.

## Common mistakes

### Using `use()` as a generic fetch replacement

`use()` reads a Suspense-compatible resource/Promise; it does not decide ownership, caching, authorization, or retry strategy.

### Passing huge datasets into Client Components

Increases transport and browser memory costs.

### Converting server-only UI into Client Components just to demonstrate `use()`

Adds unnecessary JavaScript.

### Assuming a server-created Promise hides the resolved data

The client receives the result needed by the Client Component.

## Debugging checklist

1. Where is the Promise created?
2. Does it start before the component consumes it?
3. Is Promise identity stable for the render?
4. Which Suspense boundary catches pending state?
5. Which error boundary catches rejection?
6. Is resolved data serializable?
7. Is the client receiving more data than needed?
8. Is a Client Component genuinely required?
9. Are cache semantics intentional?
10. Is an internal HTTP hop hiding a simpler direct server call?

## Interview questions

**What does React `use()` do with a Promise?**  
It reads the Promise result and suspends the component while the Promise is pending.

**Why start a Promise in a Server Component and consume it in a Client Component?**  
It can start server-owned work early while allowing an interactive client subtree to consume the result under Suspense.

**Is `use()` a cache?**  
No. Cache/reuse semantics are separate from Promise consumption.

**What happens when the Promise rejects?**  
The error propagates to the relevant error boundary; Suspense itself owns pending state.

## Exercise

Build an interactive orders panel where:

- order data starts on the server
- the list UI has client-side sorting
- data is consumed with `use()`
- a Suspense skeleton appears while pending
- authorization occurs server-side
- only minimal order fields cross to the client

Then compare it with a Server Component list plus a tiny Client sorting control and explain which design you would ship.
