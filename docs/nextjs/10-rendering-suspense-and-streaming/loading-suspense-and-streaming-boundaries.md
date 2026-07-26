---
title: loading.tsx, Suspense & Streaming Boundaries
description: Design meaningful loading UI with loading.tsx and Suspense, stream slow work progressively, and place boundaries around user-visible dependencies.
---

# loading.tsx, Suspense & Streaming Boundaries

Streaming lets Next.js send useful UI before every part of a route is ready.

The core mechanism is React Suspense.

A useful model is:

```text
fast shell
+ fallback UI
+ slow subtree
        ↓
slow subtree completes later
        ↓
server streams completed content
        ↓
React replaces the fallback in place
```

## Why streaming exists

Without a boundary, one slow dependency can delay the entire route.

```tsx
export default async function Page() {
  const analytics = await getSlowAnalytics()

  return (
    <>
      <Header />
      <Analytics data={analytics} />
    </>
  )
}
```

If `getSlowAnalytics()` takes three seconds, the page may not produce useful UI until that work completes.

With a boundary:

```tsx
import { Suspense } from 'react'

export default function Page() {
  return (
    <>
      <Header />
      <Suspense fallback={<AnalyticsSkeleton />}>
        <Analytics />
      </Suspense>
    </>
  )
}
```

Now the header and fallback can render while the analytics subtree finishes independently.

## `loading.tsx`

A `loading.tsx` file creates route-segment loading UI.

```text
app/
  dashboard/
    loading.tsx
    page.tsx
```

Example:

```tsx
export default function Loading() {
  return <DashboardSkeleton />
}
```

Conceptually Next.js wraps the segment in a Suspense boundary.

This is useful for navigation because users receive immediate feedback while the next route segment is being produced.

## `loading.tsx` vs manual `<Suspense>`

Use `loading.tsx` when the loading state belongs to the whole route segment transition.

Use manual Suspense when a smaller subtree has its own readiness boundary.

Example:

```tsx
export default function Page() {
  return (
    <main>
      <Overview />

      <Suspense fallback={<RevenueSkeleton />}>
        <RevenuePanel />
      </Suspense>

      <Suspense fallback={<ActivitySkeleton />}>
        <ActivityFeed />
      </Suspense>
    </main>
  )
}
```

Now revenue and activity do not block each other.

## Boundary placement is product design

Do not wrap every component in Suspense mechanically.

Ask:

```text
What can the user understand immediately?
What must appear together?
Which slow regions are independent?
Which fallback preserves layout stability?
```

A boundary should represent a meaningful readiness unit.

## Too-large boundary

```tsx
<Suspense fallback={<FullPageSpinner />}>
  <Header />
  <Sidebar />
  <MainContent />
  <Footer />
</Suspense>
```

One slow child can hide everything.

This defeats much of the value of streaming.

## Too-small boundaries

The opposite failure is dozens of tiny independent skeletons.

That can create:

```text
visual flicker
layout instability
cognitive noise
excessive chunking
hard-to-reason loading behavior
```

Prefer boundaries around cohesive UI regions.

## Suspense does not make a component dynamic

Suspense controls how not-yet-ready work is revealed.

It does not by itself turn static work into request-time work.

The actual dependency determines whether work is static, cached, or request-time.

With Cache Components, this distinction becomes critical:

```text
static/cached subtree
→ can be included in prerendered shell

request-time subtree under Suspense
→ fallback enters shell
→ real content streams later
```

## Parallel streaming

Sibling boundaries can progress independently.

```tsx
<Suspense fallback={<APlaceholder />}>
  <PanelA />
</Suspense>

<Suspense fallback={<BPlaceholder />}>
  <PanelB />
</Suspense>
```

If `PanelB` finishes first, it can reveal first.

Do not create an unnecessary parent dependency that serializes them.

## Sequential dependencies still matter

Suspense cannot remove a real data dependency.

```text
fetch account
   ↓
need account.id
   ↓
fetch invoices
```

This sequence is logically required.

But unrelated work can start earlier:

```tsx
const accountPromise = getAccount()
const noticesPromise = getNotices()

const account = await accountPromise
const invoicesPromise = getInvoices(account.id)
```

Then Suspense boundaries can expose those independent timelines appropriately.

## Fallback design

A good fallback communicates structure without pretending final data exists.

Prefer:

```text
stable skeleton dimensions
clear loading label where needed
preserved navigation/context
accessible progress semantics
```

Avoid:

```text
full-screen spinner for small region
fake content that may be mistaken for real data
layout shifts when content arrives
animated distraction everywhere
```

## Accessibility

Loading UI should remain understandable to assistive technology.

Depending on the interaction, consider:

- meaningful visible loading text
- `aria-live` for important async status changes
- focus preservation during navigation
- avoiding repeated announcement noise
- keeping navigation and page landmarks stable

Do not automatically add `aria-live` to every skeleton.

## Streaming and HTTP status

Once a response has started streaming, headers and status may already be committed.

That means late failures cannot always transform the response into a clean, new HTTP status page.

This is why error boundaries and application-level error UI matter for streamed content.

Think:

```text
before stream starts
→ HTTP response can still be shaped globally

after chunks are sent
→ recover within the rendered stream/UI model
```

Phase 14 covers deep error handling.

## Slow sibling example

```tsx
async function RevenuePanel() {
  const revenue = await getRevenue()
  return <RevenueChart data={revenue} />
}

async function ActivityFeed() {
  const activity = await getActivity()
  return <ActivityList items={activity} />
}

export default function Page() {
  return (
    <DashboardLayout>
      <Suspense fallback={<RevenueSkeleton />}>
        <RevenuePanel />
      </Suspense>

      <Suspense fallback={<ActivitySkeleton />}>
        <ActivityFeed />
      </Suspense>
    </DashboardLayout>
  )
}
```

Each panel owns its own slow dependency.

## Boundary and data ownership should align

A useful design smell:

```text
parent fetches everything
→ children merely display data
```

can force a large waterfall before any child boundary gets a chance to suspend.

Often better:

```text
parent renders structure
child owns its dependency
child Suspense boundary owns fallback
```

This is not universal, but it often improves progressive rendering.

## Navigation loading behavior

During client navigation, Next.js can reuse prefetched route data and loading UI.

If the route is not fully ready:

```text
user clicks Link
→ navigation starts
→ shared layouts remain
→ loading boundary can show
→ new segment streams in
```

This avoids replacing the entire document with a blank state.

## Avoid loading UI for every tiny navigation

If the target route is already prefetched and ready, a loading state may never appear.

That is good.

Do not artificially delay the route just to guarantee that a skeleton is visible.

## Suspense and client code loading

Suspense can also be involved when client-side code loaded with `lazy` is not ready.

But in the App Router, distinguish:

```text
server data/render suspension
from
client module/code suspension
```

Both can use Suspense, but the bottleneck and debugging path differ.

## Debugging a boundary that never reveals

Check:

1. Is the underlying promise ever resolving?
2. Is the subtree throwing an error instead?
3. Is a parent boundary hiding the result?
4. Is there a dependency waterfall above the boundary?
5. Is client code failing to load?
6. Is navigation reusing stale/prefetched state?
7. Is the fallback itself expensive?

## Common mistakes

### One full-page boundary

Makes every slow child block the entire user-visible route.

### Suspense around synchronous content

Adds conceptual complexity without benefit.

### Fetching above the boundary

If the parent awaits the slow dependency before rendering the Suspense child, the boundary cannot help.

Bad:

```tsx
export default async function Page() {
  const data = await getSlowData()

  return (
    <Suspense fallback={<Loading />}>
      <Panel data={data} />
    </Suspense>
  )
}
```

The await already blocked the page.

### Skeletons with different dimensions

Causes layout shift when real content reveals.

## Performance review

For each boundary measure:

```text
time to shell
fallback duration
time to boundary reveal
server dependency latency
RSC chunk arrival
client hydration/code cost if interactive
```

Then decide whether the issue is:

- data latency
- rendering latency
- network transfer
- client bundle cost
- hydration CPU

## Interview questions

**What does `loading.tsx` do?**  
It provides route-segment loading UI using the App Router's Suspense/streaming model.

**Why can a Suspense boundary fail to improve initial rendering?**  
If the parent awaits the slow work before reaching the boundary, the route is already blocked.

**Does Suspense make a component dynamic?**  
No. It defines a reveal boundary for work that is not ready; the underlying APIs/data determine rendering classification.

**Why use multiple sibling boundaries?**  
Independent slow regions can reveal independently rather than waiting for the slowest sibling.

## Exercise

Take a dashboard containing:

```text
header
account summary
revenue chart
recent transactions
team activity
```

Design:

- route-level `loading.tsx`
- manual Suspense boundaries
- fallback dimensions
- which fetches start in parallel
- which data dependencies are sequential
- what remains visible during navigation
