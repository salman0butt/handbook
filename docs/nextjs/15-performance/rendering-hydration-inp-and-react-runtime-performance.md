---
title: Rendering, Hydration, INP & React Runtime Performance
description: Diagnose render cost, hydration, interaction latency, rerenders, long tasks, transitions, virtualization, and memory in Next.js Client Components.
---

# Rendering, Hydration, INP & React Runtime Performance

A fast network response can still produce a slow application if browser work dominates.

The browser path includes:

```text
parse HTML
→ style/layout
→ paint
→ load client JavaScript
→ execute
→ hydrate Client Components
→ handle interactions
→ rerender
```

## Hydration cost comes from Client Components

Server Components do not hydrate.

Client Components can be prerendered into HTML for the initial load, then their JavaScript attaches interactive behavior.

Every unnecessary client boundary can increase:

```text
JavaScript bytes
execution
hydration
memory
future rerenders
```

Use Client Components for interactivity, not as the default architecture.

## Visible is not always interactive

A user can see prerendered UI before its client code finishes hydrating.

That can create:

```text
fast paint
but
late interaction readiness
```

Measure both visual and interaction experience.

## INP is about the whole interaction

A slow interaction can include:

```text
input delay
→ event handler
→ state update
→ React render
→ DOM/layout work
→ next paint
```

Do not optimize only the handler if rendering or layout is the real cost.

## Profile the interaction, not the whole app first

Start with a concrete complaint:

```text
search input lags
filter button stalls
modal opens slowly
table selection freezes
```

Then capture the interaction in browser Performance tools and React Profiler.

Identify:

- long tasks
- expensive component renders
- layout/recalculate-style work
- third-party work
- synchronous data transforms

## Rerender is not automatically bad

React rendering is normal.

The question is:

```text
is this render expensive enough to matter?
```

Do not spend engineering time eliminating harmless rerenders while a 500 ms chart calculation dominates the interaction.

## State placement affects render blast radius

If rapidly changing state lives high in a large client tree, many descendants may rerender.

Prefer the narrowest owner that matches semantics.

```text
local input state
→ local component

shared authenticated identity
→ shared provider/store when needed
```

Do not lift state purely for convenience.

## Split static server UI from interactive client UI

Instead of client-rendering an entire dashboard card, server-render its static content and wrap only controls in a client island.

This reduces browser work and often improves hydration cost.

## Avoid expensive calculation during every render

If a calculation is genuinely expensive:

- move it server-side when it does not need browser state
- compute less data
- cache/memoize when evidence justifies it
- preprocess upstream
- use a worker for browser CPU work where appropriate

Memoization should follow measurement.

## React Compiler changes the default memoization conversation

When enabled, React Compiler can automatically optimize many component calculations.

That means performance review should first ask:

```text
is the architecture correct?
is the component actually expensive?
is the compiler already handling this?
```

Manual `memo`, `useMemo`, and `useCallback` remain useful for specific identity/API constraints and measured bottlenecks.

## Large lists need structural optimization

Rendering thousands of DOM nodes can hurt:

```text
render time
layout
paint
memory
interaction latency
```

Options:

- pagination
- incremental loading
- virtualization/windowing
- grouping/aggregation
- server-side filtering

Virtualization introduces accessibility, focus, measurement, and testing concerns. Use it where list scale actually requires it.

## Keep DOM size bounded

Even Server Components can produce a huge DOM.

Server rendering removes client JavaScript for those nodes, but the browser still parses, styles, lays out, paints, and retains them.

Performance architecture must consider both JavaScript and DOM volume.

## `useTransition` can protect urgent interaction

Use transitions for non-urgent state updates:

```tsx
'use client'

import { useState, useTransition } from 'react'

export function SearchPanel() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('')
  const [isPending, startTransition] = useTransition()

  function onChange(value: string) {
    setQuery(value)
    startTransition(() => setFilter(value))
  }

  return null
}
```

The urgent input state can update separately from expensive non-urgent UI.

But the total work still exists.

## `useDeferredValue`

Deferred values can let a slow subtree lag behind an urgent input.

Good fit:

```text
input should remain responsive
results can update slightly later
```

This is scheduling, not network caching or computation removal.

## Avoid synchronous client waterfalls after hydration

A Client Component that mounts, runs an effect, fetches data, then renders can delay useful content compared with server fetching when the data was available on the server.

Use client fetching for truly client-live/stateful data requirements, not automatically for every API.

## Hydration mismatch can become performance cost

Mismatch recovery can trigger extra work and client rerendering.

Avoid unstable initial output from:

```text
Date.now()
Math.random()
browser-only branches during server render
invalid HTML nesting
uncoordinated third-party DOM mutation
```

Correctness first; the performance benefit follows.

## Layout thrashing

Repeated patterns like:

```text
write DOM
read layout
write DOM
read layout
```

can force synchronous style/layout calculation.

Batch DOM reads/writes in imperative integrations and avoid unnecessary measurement loops.

## Prefer transform/opacity for animations where appropriate

Animations that repeatedly change layout-heavy properties can trigger layout/paint work.

Compositor-friendly properties such as transforms and opacity are often cheaper, though actual performance depends on the element and device.

## Event frequency matters

High-frequency events include:

```text
scroll
pointermove
mousemove
resize
input
```

Keep handlers small. Use browser primitives, throttling/debouncing, requestAnimationFrame, or passive listeners where semantically appropriate.

Do not debounce interactions that must update immediately without understanding UX impact.

## Expensive browser libraries

Editors, maps, charts, PDF renderers, rich grids, and visualization engines can dominate runtime performance.

For each library ask:

- can it load only when needed?
- can static output be server-rendered?
- can data volume be reduced?
- can updates be incremental?
- can work move to a Web Worker?
- does the library leak listeners/objects on remount?

## Memory performance

Long-lived App Router sessions may navigate without full document reloads.

Watch for retained:

```text
subscriptions
large caches
DOM references
third-party instances
workers
intervals
object URLs
large state graphs
```

Clean external resources in effects and library adapters.

## Soft navigation performance

Soft navigation can preserve layouts and Client Component state.

Benefits:

- less remounting
- reused shell
- prefetched RSC data

But long-lived state can also retain memory and stale heavy objects.

Profile realistic navigation sessions, not only page reloads.

## Main-thread budget

A useful interaction review asks:

```text
how much uninterrupted main-thread work occurs?
```

Breaking one giant task into smaller scheduled work can improve responsiveness even if total CPU time stays similar.

## Third-party components participate in React cost

A component library can cause expensive context propagation, style generation, or render trees.

Measure real components and production build behavior before replacing a library based on reputation alone.

## Production profiling workflow

```text
reproduce slow interaction
→ browser performance trace
→ identify long task
→ React Profiler for render attribution
→ inspect state/props/update source
→ change one bottleneck
→ re-profile
→ verify field INP
```

## Common mistakes

### Memoizing everything

Adds complexity without proving the bottleneck.

### Blaming React for layout cost

Browser style/layout/paint may dominate after React commits.

### Moving all state global

Can enlarge update blast radius and memory lifetime.

### Rendering huge hidden trees

`display: none` can still leave large React/DOM/state costs in memory.

### Using transitions to hide a fundamentally huge computation

Scheduling helps priority, but may not make the feature fast enough.

## Interview questions

### Why can a page have fast LCP but poor INP?

The primary content may paint quickly, while heavy JavaScript, hydration, large rerenders, or third-party work blocks later interactions.

### Does a rerender mean there is a performance bug?

No. Rerendering is normal. It becomes a performance issue when measured render/commit/browser work harms user experience.

### How do Server Components affect hydration?

Server Components do not hydrate; only Client Component code needs browser-side React behavior, so narrower client boundaries reduce hydration work.

## Exercise

Profile a data-heavy client interaction and record:

1. interaction start
2. longest main-thread task
3. React render duration
4. DOM/layout cost
5. unnecessary client boundary or state owner
6. proposed fix
7. expected INP effect
