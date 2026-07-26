---
title: Suspense, Streaming Data & React use
description: Stream slow data behind meaningful boundaries and consume server-started Promises without turning the whole route into a client-fetching experience.
---

# Suspense, Streaming Data & React `use()`

Data fetching does not need to block the entire route equally.

A route can send useful UI while slower subtrees resolve:

```text
request
  ↓
server starts work
  ↓
fast shell/content ready
  ↓ stream
slow subtree behind Suspense
  ↓
replace fallback when ready
```

## Route-level loading

`loading.tsx` gives a route segment an immediate loading boundary.

Use it when a meaningful route-level skeleton can appear while the segment resolves.

```text
app/projects/[projectId]/loading.tsx
```

This is useful but coarse.

## Component-level Suspense

For a slow widget:

```tsx
import { Suspense } from 'react'

export default function Dashboard() {
  return (
    <main>
      <Summary />

      <Suspense fallback={<ActivitySkeleton />}>
        <RecentActivity />
      </Suspense>
    </main>
  )
}
```

`Summary` does not need to wait for `RecentActivity` if they are independent.

## Boundary placement is product design

Do not add Suspense around every component.

Ask:

- What content must appear together?
- What can load independently?
- What skeleton is meaningful?
- Will layout shift be disruptive?
- Does deferred content affect the user’s next action?

A boundary defines a user-visible loading unit.

## Start the promise on the server

A Server Component can start work:

```tsx
const commentsPromise = getComments(postId)

return <Comments commentsPromise={commentsPromise} />
```

A Client Component can receive the Promise and resolve it with React `use()`:

```tsx
'use client'

import { use } from 'react'

export function Comments({
  commentsPromise,
}: {
  commentsPromise: Promise<Comment[]>
}) {
  const comments = use(commentsPromise)

  return comments.map(comment => (
    <article key={comment.id}>{comment.body}</article>
  ))
}
```

Wrap the consuming subtree in Suspense.

## Why pass a Promise?

This can let the server start secure data work early while a client component owns interactive rendering.

```text
Server Component
  ↓ start data
Promise
  ↓ serialize/reference through RSC boundary
Client Component
  ↓ use(promise)
Suspense fallback until resolved
```

It does **not** mean the browser should receive database credentials or execute the server query.

## Prefer Server Components when interactivity is unnecessary

If the content is display-only:

```tsx
async function Comments() {
  const comments = await getComments()
  return ...
}
```

is simpler than passing a Promise into a Client Component.

Use `use()` at the boundary when the client component genuinely owns interactive behavior.

## Streaming does not make slow work fast

Suppose:

```text
summary: 100 ms
activity: 2,000 ms
```

Streaming may let the summary appear around 100 ms while activity continues.

The 2,000 ms dependency is still slow.

You should still investigate:

- database query
- external API
- caching
- batching
- payload size
- architecture

Streaming improves delivery and perceived responsiveness; it is not a latency cure.

## Avoid fallback waterfalls

Bad UX:

```text
whole page skeleton
  ↓
page appears
  ↓
widget skeleton
  ↓
widget appears
```

Sometimes nested boundaries create a sequence of placeholder swaps that feels noisy.

Design a stable shell and group related content.

## Fallbacks should preserve layout

Prefer:

```tsx
function TableSkeleton() {
  return <div className="table-skeleton" aria-hidden="true" />
}
```

with dimensions similar to the final table.

Avoid a tiny spinner that becomes a 1,000-pixel table and shifts the whole page.

## Errors and Suspense are different

Suspense handles waiting.

Error boundaries handle failures.

```text
Promise pending → Suspense fallback
Promise rejected → error boundary
Promise fulfilled → content
```

Do not use “loading forever” as an error state.

## Stream optional dependencies

Example dashboard:

```text
critical
├── account identity
├── permissions
└── primary project data

streamable
├── activity feed
├── recommendations
└── analytics chart
```

A slow recommendations service should not necessarily block a user from opening their project.

## Security still happens before rendering data

Do not stream unauthorized content and then hide it later.

The server data function must scope and authorize before the Promise produces sensitive data.

## Sensitive promise outputs

Anything ultimately delivered to a Client Component should be treated as browser-visible.

Pass a minimal DTO:

```ts
type ActivityItemDTO = {
  id: string
  label: string
  createdAt: string
}
```

not a full internal database model.

## Client navigation and streaming

On subsequent App Router navigation, the client can request new server component payload data while preserving layouts.

A route loading boundary can give immediate feedback while the new server work resolves.

The deep transport mechanics belong to Phase 10, but the Phase 5 rule is:

> data dependencies should align with useful loading boundaries.

## `use()` is not an effect replacement for arbitrary browser fetches

Do not translate every client `useEffect(fetch)` into a hand-built Promise created during render.

Use the pattern when React/Next.js owns a stable Promise/resource flow.

For browser-owned live data, a client data library may be more appropriate.

## Common mistakes

### Putting the whole route behind one Suspense fallback

You lose the benefit of independent delivery.

### Excessive tiny boundaries

The UI becomes a patchwork of placeholders.

### Passing giant records through Promise props

Minimize data at the server boundary.

### Assuming streaming fixes database latency

Measure the underlying dependency.

### Using client rendering when a Server Component is enough

Keep display-only data server-side.

## Debugging checklist

1. Identify which dependency actually suspends.
2. Check whether it is critical or optional.
3. Confirm independent work starts early.
4. Inspect whether the fallback has stable dimensions.
5. Verify rejected promises reach an error boundary.
6. Confirm sensitive data is scoped before streaming.
7. Inspect serialized data size.
8. Test slow network and slow server scenarios separately.
9. Test initial load and client navigation.
10. Measure time to useful content, not only final completion.

## Interview questions

**What does Suspense do for data fetching?**  
It lets a subtree declare a loading boundary while async work is pending, allowing other ready UI to render/stream independently.

**Does streaming reduce server computation time?**  
No. It can improve when useful content is delivered, but slow dependencies remain slow.

**Why pass a server-started Promise to a Client Component?**  
To start secure server work early while allowing an interactive client subtree to resolve the result with React `use()` under Suspense.

**When should you avoid that pattern?**  
When the UI can remain a Server Component or when the data is truly browser-owned/live and better handled by a client data layer.

## Exercise

Design a dashboard with:

```text
account summary
project table
activity feed
billing status
recommendations
```

Choose:

- which dependencies are critical
- which start in parallel
- route-level vs component Suspense boundaries
- fallback design
- error behavior
- which values may cross into Client Components
- what latency remains to optimize after streaming
