---
title: Navigation Pending State & User Feedback
description: Use loading boundaries, useLinkStatus, route-change composition, and responsive feedback without overloading navigation UX.
---

# Navigation Pending State & User Feedback

A navigation can be technically correct and still feel broken if the user receives no feedback.

Current App Router navigation has several layers of feedback:

```text
prefetched destination
  → often no visible wait

loading.tsx / Suspense fallback available
  → immediate route-level feedback

link navigation still blocked
  → useLinkStatus can provide inline pending feedback
```

The goal is not to show more spinners. The goal is to show the **right feedback at the right latency**.

## Prefer route-level loading architecture first

For a dynamic route:

```text
app/
└── reports/
    ├── loading.tsx
    └── page.tsx
```

`loading.tsx` provides a loading boundary for navigation and enables useful partial prefetching behavior.

```tsx
export default function Loading() {
  return <ReportSkeleton />
}
```

This should be your first navigation-feedback tool when the destination route has server work.

Why?

- the fallback belongs to the route
- shared layouts stay interactive
- navigation can begin before all destination work finishes
- the UI reflects destination structure instead of a generic global spinner

## `useLinkStatus()`

Stable App Router exposes `useLinkStatus` from `next/link`.

```tsx
'use client'

import { useLinkStatus } from 'next/link'

export function LinkPendingHint() {
  const { pending } = useLinkStatus()

  return (
    <span
      aria-hidden
      className={pending ? 'link-hint link-hint--pending' : 'link-hint'}
    />
  )
}
```

Use it inside a descendant of the relevant `<Link>`.

```tsx
import Link from 'next/link'
import { LinkPendingHint } from './link-pending-hint'

export function ReportsLink() {
  return (
    <Link href="/reports" prefetch={false}>
      Reports <LinkPendingHint />
    </Link>
  )
}
```

## What `pending` means

The hook exposes:

```ts
{ pending: boolean }
```

It is useful while that Link navigation is waiting to complete.

Important current behavior:

- it must be rendered beneath a `<Link>`
- it is especially useful when prefetching is disabled or incomplete
- if the destination is already prefetched, the pending state may be skipped entirely
- when multiple links are clicked rapidly, the most recent navigation is the relevant pending state

Do not build correctness logic around `pending` becoming visible. Fast navigation may never show it.

## Debounce visual feedback, not navigation correctness

A spinner that flashes for 20 ms can make a fast app feel slower.

A useful pattern is a delayed visual treatment:

```css
.link-hint {
  opacity: 0;
}

.link-hint--pending {
  animation: reveal 0s linear 120ms forwards;
}

@keyframes reveal {
  to {
    opacity: 1;
  }
}
```

The exact delay is a UX decision. Measure it.

The idea is:

```text
very fast navigation
  → no visible indicator

meaningful wait
  → subtle feedback appears
```

## Inline feedback vs global progress bar

Inline link feedback answers:

> “Did this specific click register?”

A global progress bar answers:

> “Is the application transitioning somewhere?”

Use the smallest scope that communicates the state clearly.

Do not show:

- a button spinner
- a global progress bar
- a route skeleton
- a toast

all for the same ordinary navigation unless the experience genuinely needs multiple layers.

## Loading UI should resemble destination structure

Generic:

```tsx
return <p>Loading...</p>
```

Better for a dashboard:

```tsx
return (
  <section aria-label="Loading reports">
    <ReportToolbarSkeleton />
    <ReportChartSkeleton />
    <ReportTableSkeleton />
  </section>
)
```

A structural skeleton reduces perceived layout shift and tells the user what is arriving.

## Avoid fake progress

A determinate progress bar like:

```text
67%
```

implies you know the remaining work.

Most route transitions do not expose a real percentage.

Use indeterminate feedback unless your workflow actually measures progress.

## Accessibility of pending feedback

Not every pending hint should be announced.

For a small visual shimmer beside a link:

```tsx
<span aria-hidden />
```

may be correct because the user already activated the link and the destination will soon update.

For a long-running operation where the user needs explicit status, use an appropriate status pattern.

```tsx
<div role="status" aria-live="polite">
  Loading report…
</div>
```

Do not create noisy live-region announcements on every fast route click.

## Preserve interaction when possible

App Router shared layouts can remain interactive during navigation.

Avoid disabling the entire application shell just because one route segment is loading.

Better:

```text
sidebar stays interactive
header stays interactive
page region streams/replaces
```

instead of:

```text
whole screen blocked by modal spinner
```

unless the user truly must not interact with the old state.

## Route changes as observable client events

App Router does not use the old Pages Router `router.events` API.

When client code needs to react to URL changes, compose the current hooks.

```tsx
'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function NavigationObserver() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const query = searchParams.toString()
    const url = query ? `${pathname}?${query}` : pathname

    analytics.pageView(url)
  }, [pathname, searchParams])

  return null
}
```

If the containing route can be statically prerendered, the `useSearchParams()` dependency means this observer should be isolated behind Suspense.

```tsx
import { Suspense } from 'react'

<Suspense fallback={null}>
  <NavigationObserver />
</Suspense>
```

## Analytics: navigation start vs navigation completion

Be clear about the event you need.

Possible events:

```text
link clicked
navigation requested
URL changed
route rendered
meaningful content visible
```

These are not identical.

For analytics page views, the new pathname/search params often represent the useful semantic point.

For UX performance monitoring, you may need separate timing around user intent and visible destination content.

## `onNavigate` for navigation intent

A `<Link>` can observe or interrupt its client navigation:

```tsx
<Link
  href="/checkout"
  onNavigate={() => {
    analytics.track('checkout_navigation_started')
  }}
>
  Checkout
</Link>
```

Remember that `onNavigate` is scoped to the App Router client navigation, not every possible browser click behavior.

Do not use it as your only site-wide route-change analytics mechanism.

## Slow navigation causes

The official navigation model suggests several common causes:

### Dynamic route with no useful loading boundary

The user may wait for server work before seeing destination feedback.

### Slow network

Prefetch may not finish before click.

### Prefetch disabled

The destination starts later by design.

### Large client JavaScript

Links need hydration before some client-side behavior can run. Excessive client bundles can delay responsiveness and prefetch readiness.

### Slow server work

Navigation UI cannot make an unnecessarily slow data path fast.

Measure server rendering/data work separately.

## Navigation performance waterfall

```text
user intent
  ↓
link/client handler ready?
  ↓
prefetched payload available?
  ↓
request missing server work
  ↓
loading boundary visible
  ↓
server payload streams/returns
  ↓
client applies transition
  ↓
interactive destination settles
```

Instrument the stage that matters instead of reporting one vague “navigation was slow” metric.

## Pending state is not mutation state

A route navigation pending indicator is not the same as a form mutation pending state.

```text
navigation pending
  → route transition

mutation pending
  → data-changing operation
```

Later phases cover Server Functions and `useActionState`/`useFormStatus`.

Do not conflate them into one global “isLoading” boolean.

## Navigation interruption

Client navigation can be interruptible. A user may click another route before the first finishes.

Design feedback so stale navigation state does not trap the interface.

Avoid manual state such as:

```tsx
setGlobalLoading(true)
router.push('/reports')
```

without a reliable completion/reset model.

Framework-driven loading boundaries and `useLinkStatus` avoid many of these synchronization bugs.

## Common mistakes

### Global spinner for every route

This hides the benefits of partial route transitions.

### Manual `isNavigating` state that never resets

Interrupted or failed navigation can leave the UI stuck.

### Expecting `useLinkStatus` to always display

A prefetched route may transition too quickly for a pending state.

### Treating dev navigation timing as production timing

Prefetching and optimization behavior differ.

### Announcing every tiny transition through `aria-live`

This can create accessibility noise.

## Debugging checklist

If navigation feels frozen:

1. Verify whether the destination is static or dynamic.
2. Check for a nearby `loading.tsx` boundary.
3. Test a production build.
4. Inspect whether the link was prefetched.
5. Check server response timing.
6. Inspect client bundle/hydration cost.
7. Use `useLinkStatus` only where blocked navigation needs immediate feedback.
8. Verify loading UI disappears correctly when navigation is interrupted.

## Interview questions

**When should you use `useLinkStatus`?**  
For immediate, link-scoped pending feedback when navigation may block because prefetching is disabled, incomplete, or the dynamic route lacks an instant loading path.

**Why might `pending` never visibly become true?**  
If the destination is already prefetched and navigation completes immediately, the pending state can effectively be skipped.

**What replaced `router.events` in App Router?**  
Route changes can be observed by composing client hooks such as `usePathname()` and `useSearchParams()`.

**Why are route-level skeletons usually better than a global blocking spinner?**  
They preserve shared interactive UI, align feedback with the destination, and work with streaming/partial navigation architecture.

## Exercise

Create a slow dynamic `/reports/[reportId]` route and compare three versions:

1. no `loading.tsx`
2. route-level `loading.tsx`
3. route-level loading plus a delayed `useLinkStatus` hint

Test all three with production build and network throttling. Record which stage creates the perceived delay and which feedback improves the experience without adding visual noise.
