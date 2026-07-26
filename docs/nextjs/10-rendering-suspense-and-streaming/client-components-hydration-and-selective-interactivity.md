---
title: Client Components, Hydration & Selective Interactivity
description: Understand how Client Components are prerendered, hydrated, and kept narrow so interactive JavaScript does not dominate the App Router rendering model.
---

# Client Components, Hydration & Selective Interactivity

Client Components provide browser interactivity, but they still participate in the App Router's server rendering pipeline.

A useful model is:

```text
Server Components define server-owned tree
      ↓
Client Component boundaries mark browser-owned modules
      ↓
initial HTML is prerendered
      ↓
client JavaScript loads for those boundaries
      ↓
React hydrates interactivity
```

## `'use client'` is a module boundary

```tsx
'use client'

import { useState } from 'react'

export function LikeButton() {
  const [liked, setLiked] = useState(false)

  return (
    <button onClick={() => setLiked((value) => !value)}>
      {liked ? 'Liked' : 'Like'}
    </button>
  )
}
```

The directive means the module and its client-side dependency graph belong in the client bundle.

It does **not** mean every ancestor Server Component becomes client-side.

## Keep boundaries narrow

Prefer:

```text
Server ProductPage
├── Server ProductInfo
├── Server Price
└── Client AddToCartButton
```

instead of:

```text
Client ProductPage
├── ProductInfo
├── Price
└── AddToCartButton
```

when only the button needs browser state/events.

Narrow boundaries reduce:

- shipped JavaScript
- hydration work
- client memory
- browser-side data exposure

## Initial HTML still matters

A Client Component can appear in server-prerendered HTML.

Before hydration:

```text
button is visible
but event handler is not yet active
```

After hydration:

```text
button has React state/event behavior
```

This is why loading JavaScript performance still affects interaction readiness even when the UI appears quickly.

## Selective hydration mental model

React can hydrate interactive regions progressively rather than requiring the whole application to become interactive as one atomic unit.

Suspense boundaries can help prioritize/reveal independently prepared regions.

Do not overspecify exact internal scheduling guarantees in application architecture. The stable design contract is:

```text
server-rendered UI can become interactive progressively
```

## Hydration is CPU work

A route can have a fast server response but still feel slow because the browser must:

```text
download JS
parse JS
execute modules
hydrate Client Components
run Effects
attach interaction behavior
```

Measure browser CPU and bundle size separately from server latency.

## Hydration mismatch causes

Common categories:

### Non-deterministic render values

```tsx
return <span>{Math.random()}</span>
```

### Browser-only state during initial render

```tsx
const theme = localStorage.getItem('theme')
```

### Timezone/locale divergence

Server and browser may format dates differently.

### Invalid DOM nesting

Browser HTML correction can produce a tree React did not expect.

### External DOM mutation

Browser extensions or scripts can mutate nodes before hydration.

## Stable initial render pattern

If browser-only state is needed, render a stable initial value and synchronize after mount when appropriate.

```tsx
'use client'

import { useEffect, useState } from 'react'

export function ClientPreference() {
  const [value, setValue] = useState<string | null>(null)

  useEffect(() => {
    setValue(localStorage.getItem('preference'))
  }, [])

  return <span>{value ?? 'Default'}</span>
}
```

Whether this UX is appropriate depends on the product. Server-readable cookies may be better for preferences that should affect initial HTML.

## Avoid client-side duplication of server truth

Bad:

```text
Server renders current user role
Client reads stale localStorage role
UI diverges during hydration
```

Security-sensitive truth should come from authoritative server state.

Client state can enhance interaction, but should not override server authorization.

## Effects run after hydration

`useEffect` does not run during server rendering.

So if your UI requires an Effect before it looks correct, the server-rendered state may be incomplete or misleading.

Ask whether the state should instead be:

- server-derived
- passed as a prop
- rendered as an explicit loading/unknown state
- truly browser-only

## Browser APIs

Client Components can access browser APIs after they execute in the browser.

But module initialization and render timing still matter.

Avoid unsafe top-level access:

```tsx
const width = window.innerWidth
```

when the module participates in server tooling/prerendering contexts.

Prefer browser access inside event handlers/effects or guarded client-only architecture.

## Third-party interactive libraries

Many chart, editor, map, or widget libraries require DOM APIs.

Wrap them behind a focused Client Component:

```text
Server AnalyticsPage
  ↓
Client RevenueChart
  ↓
third-party chart library
```

Do not move the whole route into the client graph because one library needs `window`.

## `ssr: false`

Client-only dynamic loading can be appropriate for libraries that cannot participate in server prerendering.

Use deliberately.

Costs can include:

```text
less useful initial HTML
later visual reveal
more client-only responsibility
potential layout shift
```

It is not a generic fix for hydration bugs.

## Streaming plus hydration

A Client Component inside a streamed subtree has multiple readiness steps:

```text
server dependency ready
      ↓
RSC/HTML chunk arrives
      ↓
client module available
      ↓
hydration completes
      ↓
interaction ready
```

A visible streamed region may still not be interactive immediately if its JS is late.

## Interaction criticality

Prioritize client JavaScript based on user intent.

For example:

```text
checkout submit button → highly interaction-critical
below-the-fold carousel → lower priority
analytics widget → often not critical for interaction
```

Architecture should keep critical interaction code small.

## Providers

Global Client providers expand the client graph.

Render providers as deep as possible.

Bad:

```tsx
<ClientProviders>
  <html>
    <body>{children}</body>
  </html>
</ClientProviders>
```

Prefer wrapping only the subtree that needs client context when possible.

## Context and hydration

Client context state does not exist as server React context for Server Components.

If server UI needs the same domain data, load it independently on the server or share the server-started Promise/data through an intentional bridge.

## Security

Anything passed into a Client Component can become browser-visible.

Do not pass:

```text
API secrets
private service credentials
internal permission matrices
full database records when a DTO suffices
```

Hydration is not a secrecy boundary.

## Debugging interaction delay

If content is visible but clicks do nothing:

1. Confirm the component is actually a Client Component.
2. Inspect JS chunk loading failures.
3. Measure hydration/long tasks.
4. Check whether a parent Suspense boundary is still pending.
5. Check runtime exceptions during hydration.
6. Check third-party script blocking.
7. Check whether event target DOM was mutated externally.

## Common mistakes

### Moving everything to `'use client'`

Throws away server-first advantages and grows hydration cost.

### Using `useEffect` to fetch data already available on the server

Creates a browser waterfall and loading state that could often be avoided.

### Suppressing hydration warnings

Can hide genuine correctness bugs.

### Assuming visible means interactive

HTML can paint before hydration completes.

## Performance review

Measure:

- client JS bytes
- number of Client Component entry points
- parse/evaluation time
- hydration CPU
- long tasks
- interaction latency
- third-party script impact

Then move client boundaries downward where possible.

## Interview questions

**What does `'use client'` mean?**  
It marks a module boundary whose exports and dependency graph can run in the browser and participate in client interactivity.

**Are Client Components rendered on the server?**  
They can participate in initial prerendered HTML; their browser JavaScript later hydrates them.

**Why keep Client Components small?**  
To minimize shipped JavaScript, hydration CPU, browser data exposure, and client-side ownership.

**Why can visible UI still be non-interactive?**  
HTML may have rendered before the corresponding Client Component JavaScript has loaded and hydrated.

## Exercise

Audit a product page and classify every component as Server or Client.

For each Client Component justify:

- browser API/event/state requirement
- bundle cost
- hydration criticality
- props crossing the boundary
- whether the boundary can move lower
