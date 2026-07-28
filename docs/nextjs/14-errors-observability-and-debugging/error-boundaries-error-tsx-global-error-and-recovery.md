---
title: error.tsx, global-error.tsx & Recovery Boundaries
description: Design nested App Router error boundaries, safe production fallbacks, retry behavior, bubbling, and root-layout recovery.
---

# `error.tsx`, `global-error.tsx` & Recovery Boundaries

Next.js App Router error files are not generic exception pages.

They define **React error boundaries at route-segment boundaries**.

The core mental model is:

```text
layout
  ↓
segment boundary from error.tsx
  ↓
page / nested layout / children
```

When rendering below that boundary throws unexpectedly, Next.js can preserve the surrounding application shell and replace the failed subtree with fallback UI.

## 1. `error.tsx` is a Client Component

A route-level error component must be a Client Component:

```tsx
'use client'

import { useEffect } from 'react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section>
      <h2>We couldn't load this section.</h2>
      <button onClick={() => reset()}>Try again</button>
    </section>
  )
}
```

The boundary is client-side because React error-boundary recovery and fallback interaction happen through the client runtime.

## 2. Error boundaries preserve surrounding UI

Suppose the route tree is:

```text
app/
  layout.tsx
  dashboard/
    layout.tsx
    error.tsx
    analytics/
      page.tsx
```

If `analytics/page.tsx` throws during rendering:

```text
root layout survives
      ↓
dashboard layout survives
      ↓
dashboard error fallback replaces failed subtree
```

This is why boundary placement is a product and architecture decision.

## 3. Errors bubble to the nearest parent boundary

If a nested route does not define its own boundary, the exception bubbles upward.

```text
child page throws
      ↓
child error.tsx?
      ├── yes → render child fallback
      └── no
          ↓
parent error.tsx?
          ├── yes → render parent fallback
          └── continue upward
```

This lets you choose between:

```text
fine-grained recovery
vs
large fallback regions
```

## 4. The same segment layout sits outside its own error boundary

A subtle but important route-tree rule:

```text
segment layout
    ↓
error boundary
    ↓
segment page / descendants
```

An error thrown by the layout in the same segment cannot be caught by that segment's `error.tsx` because the layout is outside the boundary.

To catch that layout failure, use a parent segment's boundary.

For the root layout, use `global-error.tsx`.

## 5. Production Server Component errors hide details

In development, Next.js can forward useful server error messages for debugging.

In production, Server Component error details are intentionally sanitized before reaching the browser.

The client receives a generic message and may receive:

```ts
error.digest
```

The digest can be correlated with server-side telemetry.

This is a security feature.

Do not defeat it with code such as:

```ts
return Response.json({
  message: error.stack,
  env: process.env,
})
```

## 6. Client Component errors can expose their original message

Errors originating from Client Components are different because the browser already executes that code.

Even then, a production fallback should usually avoid dumping raw stack traces into user-facing UI.

Prefer:

```text
human-friendly message
reference / request ID when useful
safe recovery action
```

## 7. `reset()` re-renders the failed boundary contents

The stable `error.tsx` API provides `reset()`.

Calling it asks React/Next.js to attempt rendering the boundary subtree again.

Use it when a failure could be transient:

```text
temporary upstream failure
race during navigation
one-off client state problem
```

Do not assume retry fixes:

```text
missing permission
invalid route data
programming invariant bug
permanent schema mismatch
```

## 8. Retry UI needs a state model

A robust retry button should consider:

```text
user clicks retry
      ↓
disable / show pending if needed
      ↓
reset boundary
      ↓
render succeeds?
      ├── yes → restore content
      └── no → fallback returns
```

If retries repeatedly fail, consider offering another escape path:

```tsx
<div>
  <button onClick={() => reset()}>Try again</button>
  <a href="/dashboard">Back to dashboard</a>
</div>
```

## 9. Error boundaries do not catch every JavaScript error

React error boundaries primarily handle render-time failures in their descendant tree.

They do not automatically turn arbitrary event-handler failures into fallback UI.

Example:

```tsx
'use client'

export function DeleteButton() {
  async function onClick() {
    try {
      await deleteSomething()
    } catch {
      // handle event-driven failure here
    }
  }

  return <button onClick={onClick}>Delete</button>
}
```

The event occurs after rendering.

Use local state, mutation state, notifications, or another explicit failure channel.

## 10. Transition errors can reach a boundary

Unhandled errors thrown from work started inside a React transition can bubble to an error boundary.

That is different from a normal event callback throwing outside render/transition handling.

The senior lesson is not to memorize edge cases.

Ask:

```text
is this failure part of rendering state?
or
is this an imperative event/mutation failure?
```

## 11. `global-error.tsx` handles root-layout failures

When the root layout or root template fails, ordinary nested error boundaries cannot replace it.

Use:

```text
app/global-error.tsx
```

Example:

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
    <html lang="en">
      <body>
        <main>
          <h1>Something went wrong.</h1>
          <button onClick={() => reset()}>Try again</button>
        </main>
      </body>
    </html>
  )
}
```

## 12. Global error UI owns its own document shell

`global-error.tsx` replaces the root layout when active.

Therefore it must define:

```text
<html>
<body>
```

It also needs to provide any styling/font dependencies required for the fallback to render acceptably.

Do not assume the root layout's providers or wrapper elements still exist.

## 13. Metadata has a special constraint in global error UI

Because error boundaries are Client Components, `metadata` and `generateMetadata` exports are not supported from `global-error.tsx`.

If you need a title in that fallback, use React's `<title>` element.

## 14. Boundary placement is about blast radius

Imagine a SaaS dashboard:

```text
root shell
├── sidebar
├── account switcher
└── report workspace
    ├── chart
    ├── table
    └── export panel
```

If only the chart's data visualization is fragile, replacing the whole dashboard may be unnecessary.

Possible design:

```text
workspace route boundary
→ handles workspace-level server/render failures

component-level explicit state
→ handles chart provider failure
```

## 15. Too many boundaries can also hurt UX

A boundary around every tiny component can create:

```text
fragmented fallback UI
many Retry buttons
inconsistent error copy
hard-to-understand recovery
```

Choose boundaries around meaningful user tasks or route regions.

## 16. A boundary should not become your only telemetry mechanism

This is common but weak:

```tsx
useEffect(() => {
  console.error(error)
}, [error])
```

Problems:

- browser logging can fail;
- Server Component errors may already be sanitized;
- users may close the tab;
- duplicate reporting can occur;
- request/server context may be missing.

Use route boundaries for **user recovery** and server instrumentation for **server failure telemetry**.

They complement each other.

## 17. Avoid leaking sensitive fields in fallback UI

Do not render:

```text
SQL text
stack trace
internal hostnames
provider tokens
full request headers
user secrets
server exception message
```

A production fallback can show a safe reference:

```tsx
<p>
  Reference: {error.digest ?? 'unknown'}
</p>
```

Only expose such identifiers if your support model benefits from them and the identifier itself contains no sensitive data.

## 18. Boundary fallback accessibility

A fallback should communicate clearly to assistive technology.

Consider:

```tsx
<section aria-labelledby="error-title">
  <h2 id="error-title">This section couldn't load</h2>
  <p>Try again or return to the dashboard.</p>
  <button onClick={() => reset()}>Try again</button>
</section>
```

Avoid sudden focus stealing unless the interaction requires it.

## 19. Preserve user work when possible

A route-level crash can be expensive if the user was editing a form.

Strategies can include:

```text
keep draft state outside fragile subtree
persist intentional drafts
use narrower boundaries
avoid destructive remounts
make mutations idempotent
```

Recovery design should include data-loss analysis.

## 20. Error fallbacks should work when dependencies are broken

A fallback that depends on the same failing system can fail too.

Bad architecture:

```text
primary dashboard fails because account service is down
      ↓
error fallback calls account service to render support details
      ↓
fallback also fails
```

Prefer low-dependency fallbacks.

## 21. Test boundaries deliberately

Useful tests:

```text
Server Component throws
Client Component render throws
nested child throws
same-segment layout throws
root layout throws
reset succeeds
reset fails again
fallback renders without providers
production message is sanitized
```

React DevTools can also help toggle boundaries during development.

## 22. Experimental component-level catch APIs

Current Next.js documentation exposes `unstable_catchError` and an `unstable_retry` recovery function for component-level boundaries.

Their names intentionally mark them unstable.

Use them for evaluation when appropriate, but do not treat them as the stable replacement for:

```text
error.tsx
reset()
explicit component state
standard React error-boundary patterns
```

## Common mistakes

### Showing `error.message` from Server Components as if it is stable production detail

Production sanitization intentionally removes server-sensitive details.

### Putting `error.tsx` in the same segment to catch that segment's layout

The layout is outside its own segment boundary.

### Retrying non-retryable failures

A retry button cannot grant permission or recreate deleted data.

### Logging only from the fallback

Use server-side instrumentation for server failures.

### Requiring the primary app provider tree

`global-error.tsx` replaces the root layout.

## Design review checklist

1. Which route subtree does each boundary own?
2. What failures should bubble higher?
3. Is retry meaningful and safe?
4. Can the fallback render if providers are unavailable?
5. Are production server details sanitized?
6. Does telemetry capture server context before browser fallback?
7. Can the user escape after repeated retry failure?
8. Could the fallback cause data loss or destructive remounting?
9. Does the global fallback include its own document shell?

## Interview questions

**Why must `error.tsx` be a Client Component?**  
The fallback participates in React client-side error-boundary recovery and receives an interactive recovery function.

**Why doesn't a segment's `error.tsx` catch errors from its own layout?**  
The generated boundary is nested beneath that layout and wraps the layout's child subtree, not the layout itself.

**What is `error.digest` for?**  
It is an identifier that can help correlate a sanitized production Server Component error seen by the client with server-side logs or telemetry.

## Exercise

Design boundaries for this route tree:

```text
app/
  layout.tsx
  workspace/
    layout.tsx
    page.tsx
    reports/
      [id]/
        page.tsx
        export-panel.tsx
```

Choose where to place `error.tsx`, what each fallback says, whether it exposes a retry action, and which failures should bubble to a parent boundary.
