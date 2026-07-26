---
title: Loading, Error, Not-Found & Default Files
description: Understand route-scoped loading, runtime error, missing-resource, and parallel-slot fallback conventions.
---

# Loading, Error, Not-Found & Default Files

The App Router lets route segments own more than their happy-path page UI.

A segment can colocate UI for important states:

```text
segment/
├── layout.tsx
├── loading.tsx
├── error.tsx
├── not-found.tsx
└── page.tsx
```

Parallel routes add another convention:

```text
@slot/
├── default.tsx
└── page.tsx
```

These files are not interchangeable. Each represents a different kind of boundary.

## Boundary mental model

Think of a route branch as layers of responsibility:

```text
layout
└── loading / suspense boundary
    └── error boundary
        └── page and child segments
```

The exact framework tree contains implementation details, but this model helps you reason about ownership:

- `loading.tsx`: work is still pending
- `error.tsx`: unexpected rendering/runtime failure occurred
- `not-found.tsx`: requested domain resource or route is missing
- `default.tsx`: a parallel slot's active state cannot be recovered during a hard load

Do not use one state as a substitute for another.

# `loading.tsx`

`loading.tsx` creates route-level loading UI using React Suspense.

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <DashboardSkeleton />
}
```

Next.js can show this fallback immediately while the route segment's content streams in.

By default, loading files are Server Components, though they can become Client Components when browser interactivity is actually required.

## What the loading convention gives you

Current App Router behavior includes:

- fallback UI can be prefetched
- navigation can feel immediate
- navigation remains interruptible while new content is loading
- shared layouts can remain interactive while the changed branch is pending
- the route subtree is wrapped in a framework-managed Suspense boundary

This is more than “show a spinner during fetch.” It is part of the route's streaming architecture.

## Scope matters

Given:

```text
app/dashboard/
├── loading.tsx
├── page.tsx
├── invoices/
│   └── page.tsx
└── customers/
    └── page.tsx
```

The dashboard loading boundary is positioned above descendants in that route subtree.

If only the dashboard overview needs the fallback, narrow the boundary with a route group:

```text
app/dashboard/
├── (overview)/
│   ├── loading.tsx
│   └── page.tsx
├── invoices/
│   └── page.tsx
└── customers/
    └── page.tsx
```

The URL remains `/dashboard` for the overview.

## Loading UI should preserve context

Prefer a fallback that communicates what is loading while preserving layout stability.

Good:

```tsx
export default function Loading() {
  return (
    <section aria-busy="true" aria-label="Loading invoices">
      <InvoiceTableSkeleton />
    </section>
  )
}
```

Weak default:

```tsx
export default function Loading() {
  return <p>Loading...</p>
}
```

The second is not always wrong, but production loading UI should reduce layout shift and preserve user orientation.

## Streaming status-code nuance

Once streaming begins, HTTP headers may already be committed.

That means late `redirect()` or `notFound()` behavior can be represented within the streamed response even though the HTTP status can no longer be changed from the already-sent success status.

When status semantics are critical, detect not-found/redirect conditions before work that suspends and starts streaming when possible.

# `error.tsx`

`error.tsx` handles unexpected runtime errors for a route subtree.

```tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <section>
      <h2>Something went wrong</h2>
      <button onClick={() => reset()}>Try again</button>
    </section>
  )
}
```

Error boundaries must be Client Components.

## `reset()` retries the boundary

`reset()` asks Next.js/React to attempt to render the failed boundary contents again.

This is useful for potentially transient failures.

It is not a substitute for fixing deterministic bugs.

Good UX can provide:

- a retry action
- a safe path elsewhere
- a user-facing error description that does not expose internals
- server-side observability tied to the failure

## Production error details are protected

Do not rely on exposing server exception messages to the browser.

Current Next.js production behavior avoids forwarding sensitive Server Component error details directly to the client. A digest can help correlate the user-visible error with server logs.

This is an important security property: internal SQL errors, tokens, hostnames, or stack details should not become user-visible debugging output.

## Boundary placement matters

A segment's `error.tsx` catches failures in its nested content, but it does **not** catch an error thrown by the `layout.tsx` or `template.tsx` at the same segment level because those wrappers sit outside that boundary.

To catch a layout/template failure, the relevant error boundary must exist in a parent segment.

For root-layout failures, Next.js provides `global-error.tsx`.

This explains many “my `error.tsx` is not catching this” bugs.

## `global-error.tsx`

A global error file handles failures in the root layout or template.

Because it replaces the root document shell while active, it must provide its own `<html>` and `<body>`.

```tsx
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <h1>Application error</h1>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}
```

Full observability and error taxonomy are covered in Phase 14.

# `not-found.tsx`

Not-found UI is for expected missing-resource or unmatched-route behavior, not arbitrary exceptions.

```tsx
// app/products/[productId]/page.tsx
import { notFound } from 'next/navigation'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>
}) {
  const { productId } = await params
  const product = await getProduct(productId)

  if (!product) {
    notFound()
  }

  return <ProductDetails product={product} />
}
```

Then:

```tsx
// app/products/[productId]/not-found.tsx
export default function NotFound() {
  return (
    <section>
      <h1>Product not found</h1>
      <p>This product may have been removed.</p>
    </section>
  )
}
```

## Missing resource vs unexpected error

Use not-found semantics for:

- requested product does not exist
- blog slug is unknown
- user-visible project was deleted
- route does not match a resource that can be served

Use error semantics for:

- database connection failed
- unexpected parser crash
- invariant violation
- dependency outage that prevents determining the result

A missing row and a broken database are different product states.

## Root not-found behavior

A root `app/not-found.tsx` participates in application-wide unmatched URL handling as documented by Next.js.

Current docs also describe `global-not-found.tsx` as an **experimental** convention for applications where a normal layout-composed 404 is difficult, such as multiple root layouts or a dynamic root segment.

Because it is experimental, this handbook does not teach it as a default production pattern.

## Streaming and 404 status

Current Next.js docs distinguish streamed and non-streamed not-found responses: a streamed response may already have a `200` status because headers were committed, while a non-streamed not-found response can return `404`.

This is one reason routing, streaming, and HTTP semantics must be designed together rather than treated as independent details.

# `default.tsx`

`default.tsx` belongs to **Parallel Routes**.

It is not a generic default page.

It defines what a slot should render when Next.js cannot recover that slot's active state during a full-page load.

Example:

```text
app/dashboard/
├── layout.tsx
├── page.tsx
├── @team/
│   ├── default.tsx
│   └── settings/
│       └── page.tsx
└── @analytics/
    ├── default.tsx
    └── page.tsx
```

During client-side navigation, Next.js can remember the active subpage of each slot.

After a browser refresh or direct hard load, the current URL may not contain enough information to reconstruct every slot's previous state. `default.tsx` supplies the fallback.

```tsx
export default function Default() {
  return null
}
```

or a meaningful neutral state.

## Current named-slot requirement

Current Next.js 16.2 documentation is stricter than some older tutorials.

Named parallel slots require a `default.tsx` fallback so Next.js has an explicit hard-navigation recovery state. A missing named-slot default can produce a build/runtime routing error rather than silently relying on old behavior.

The implicit `children` slot has separate fallback behavior: when its state cannot be recovered and no `default.tsx` is available, the route can fall back to not-found behavior.

When implementing parallel routes, define defaults deliberately rather than depending on historical behavior.

## `default.tsx` can receive async params

A slot default under a dynamic route can receive route params.

```tsx
export default async function Default({
  params,
}: {
  params: Promise<{ artist: string }>
}) {
  const { artist } = await params

  return <aside>Overview for {artist}</aside>
}
```

Parallel routing is covered fully in the next chapter.

# Boundary design example

For a project dashboard:

```text
app/projects/[projectId]/
├── layout.tsx
├── loading.tsx
├── error.tsx
├── not-found.tsx
└── page.tsx
```

A strong responsibility split:

- `layout.tsx`: project navigation and stable project shell
- `loading.tsx`: route-level skeleton while project UI streams
- `error.tsx`: retryable unexpected rendering/data failure
- `not-found.tsx`: project ID is valid-shaped but no accessible project exists
- `page.tsx`: successful project UI

If a security policy intentionally hides unauthorized projects as 404s, make that a documented authorization decision rather than an accidental query failure.

# Testing special files

Do not test only the happy path.

For each route branch, exercise:

1. slow request / suspended work
2. expected missing resource
3. unexpected server failure
4. retry behavior
5. hard refresh
6. client-side navigation into the route
7. client-side navigation away before loading completes
8. production build behavior

Parallel routes add tests for unmatched slot defaults and refresh recovery.

# Common mistakes

## Throwing errors for expected 404s

A missing domain resource should normally use `notFound()` rather than a generic exception.

## Catching every error and rendering a fake success page

Let unexpected failures reach a meaningful error boundary and observability system.

## Expecting same-segment `error.tsx` to catch its layout

The layout is outside that boundary. Use a parent boundary or `global-error.tsx` for root failures.

## Treating `default.tsx` as an index route

It is a recovery fallback for parallel-slot state, not a replacement for `page.tsx`.

## Making loading UI too broad

Move the boundary closer to the slow route branch or use route groups/Suspense to avoid blanketing unrelated pages.

# Interview questions

**What does `loading.tsx` create?**  
A route-level Suspense loading boundary that can provide immediate fallback UI while the route content streams.

**Why must `error.tsx` be a Client Component?**  
It is a React error-boundary fallback that receives the error and a client-invoked `reset()` recovery function.

**Will `app/dashboard/error.tsx` catch an error thrown by `app/dashboard/layout.tsx`?**  
No. The same-segment layout sits outside that error boundary; use a parent error boundary.

**When should you call `notFound()`?**  
When the requested route/resource cannot validly be served, such as a missing product or article, rather than for an unexpected infrastructure failure.

**What is `default.tsx` for?**  
Recovering the render state of a parallel route slot when a hard load cannot reconstruct that slot's active subpage from the URL.

## Official references

- https://nextjs.org/docs/app/api-reference/file-conventions/loading
- https://nextjs.org/docs/app/api-reference/file-conventions/error
- https://nextjs.org/docs/app/api-reference/file-conventions/not-found
- https://nextjs.org/docs/app/api-reference/file-conventions/default

Next: **Parallel Routes & Slots**.