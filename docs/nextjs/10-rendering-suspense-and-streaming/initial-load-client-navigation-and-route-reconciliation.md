---
title: Initial Load, Client Navigation & Route Reconciliation
description: Compare first document loads with App Router client transitions, preserved layouts, Router Cache reuse, RSC updates, and streaming navigation.
---

# Initial Load, Client Navigation & Route Reconciliation

The same route can behave differently depending on how the user arrives there.

Two important modes are:

```text
initial document load
vs
App Router client navigation
```

Understanding the difference explains many rendering, state-preservation, loading, and debugging behaviors.

## Initial document load

Examples:

```text
enter URL in address bar
browser refresh
open link in new tab
external site links into app
```

The browser needs a document.

Simplified pipeline:

```text
request
  ↓
Next.js renders/prerenders route
  ↓
HTML arrives
  ↓
browser paints
  ↓
RSC Payload reconciles tree
  ↓
Client Component JS hydrates
```

## Client navigation

With `<Link>` or router navigation inside the App Router:

```text
current document stays loaded
      ↓
Next.js obtains target route RSC data
      ↓
React reconciles changed route segments
      ↓
shared layout tree can remain
      ↓
new content reveals/streams
```

There is no need to discard the whole page document.

## Preserved layouts

Suppose:

```text
app/
  layout.tsx
  dashboard/
    layout.tsx
    page.tsx
    settings/
      page.tsx
```

Navigation:

```text
/dashboard
→ /dashboard/settings
```

can preserve the root and dashboard layouts while changing the leaf segment.

That can preserve Client Component state located inside those unchanged layouts.

## State preservation depends on tree identity

Do not assume "layouts always preserve everything."

State remains when React sees the relevant component identity as preserved.

State can reset when:

- component type changes
- key changes
- route branch changes
- template semantics intentionally remount
- full document navigation occurs

Phase 2 covers layout/template identity in detail.

## Route data and Router Cache

Next.js maintains client-side route information that can be reused during navigation.

Conceptually:

```text
prefetched/visited RSC segment data
        ↓
Client Router Cache
        ↓
soft navigation can reuse relevant entries
```

This is distinct from server Data Cache and HTTP cache layers.

Phase 6 covers the cache model.

## Prefetching

A `<Link>` may prefetch target route information before the user clicks.

That can make navigation appear nearly immediate.

If not all target work is ready:

- shared UI remains
- loading fallback can appear
- remaining data can stream

Do not design loading UX assuming every click will show `loading.tsx`.

## Why hard and soft navigation bugs differ

A route can work on refresh but fail during client navigation because:

```text
preserved client state differs
Router Cache contains previous route data
layout does not remount
browser globals already contain state
navigation RSC path differs from full document path
```

The reverse can also happen if initial hydration exposes a mismatch that soft navigation avoids.

Always test both.

## Navigation timeline

A simplified transition:

```text
T0 user clicks Link
T1 target route cache/prefetch checked
T2 request issued if needed
T3 shared layouts remain rendered
T4 loading boundary shown if target segment waits
T5 server streams RSC chunks
T6 React reconciles each ready region
T7 client-only code hydrates/activates as needed
```

Actual scheduling is framework-managed, but this model is useful for debugging.

## RSC update is not full DOM replacement

React uses the incoming server representation to update the existing component tree.

That lets Next.js preserve state in unchanged Client Components.

If client navigation replaced the whole HTML document, this preservation would not be possible.

## Navigation and Suspense

A target page can contain:

```tsx
<Suspense fallback={<ChartSkeleton />}>
  <Chart />
</Suspense>
```

During a soft transition, the route shell can become active while the chart arrives later.

This gives route-level responsiveness without waiting for the slowest dependency.

## Navigation and Cache Components

With Cache Components:

```text
prerendered shell/RSC state
+ cached reusable subtrees
+ streamed request-time holes
```

can all participate in client navigation.

The architecture is not limited to initial HTML delivery.

## Navigation and scroll/focus

Client navigation must preserve browser usability.

Rendering architecture affects:

- focus movement
- screen reader announcements
- scroll behavior
- pending indicators

Phase 3 covers navigation accessibility and scroll/focus behavior.

Do not introduce Suspense transitions that create confusing focus jumps or replace the user's current context unexpectedly.

## `router.refresh()`

A client refresh requests a new server-rendered route payload for the current route and reconciles it into the existing tree.

It is not equivalent to:

```text
window.location.reload()
```

It can preserve browser/client state while updating server-rendered results.

Also distinguish it from server cache invalidation.

```text
router.refresh()
→ request new route data

revalidatePath / updateTag / revalidateTag
→ change server cache freshness
```

A refresh alone does not guarantee an underlying server cache entry changed.

## Mutation response updates

Server Actions can return an updated RSC tree in the same mutation round trip.

That means a successful mutation can update server-rendered UI without requiring a separate full reload.

Phase 7 covers mutation sequencing.

The rendering perspective is:

```text
mutation executes
  ↓
server rerenders affected tree
  ↓
updated RSC result returns
  ↓
client reconciles UI
```

## Browser history

Soft navigation integrates with browser history.

Back/Forward can restore route state using framework/browser navigation behavior instead of always performing a new document request.

This makes stale-state debugging require attention to:

```text
history state
router cache
server cache
current client component state
```

## Full document boundary

Crossing between multiple root layouts can require a full page load because the document/root layout changes.

That changes state and hydration expectations.

Do not assume every internal URL transition has identical preservation semantics.

## Route-driven modals

Parallel + intercepted routes can render a modal on client navigation while a hard load of the same URL renders the standalone page.

This is an important example of arrival mode affecting composition.

The canonical URL remains meaningful while the route tree can differ by navigation context.

Phase 2 owns the routing pattern; Phase 10 explains why the rendering experience differs.

## Debugging matrix

Test each route using:

| Scenario | Question |
| --- | --- |
| hard refresh | Does HTML/hydration render correctly? |
| direct URL | Is standalone route valid? |
| `<Link>` navigation | Are layouts/state preserved correctly? |
| Back/Forward | Does historical state reconcile correctly? |
| prefetched navigation | Does stale route data appear? |
| non-prefetched navigation | Is loading UI correct? |
| slow network | Do streaming boundaries remain usable? |

## Common mistakes

### Debugging only by refreshing

Misses client-navigation state and cache behavior.

### Debugging only by clicking links

Misses hydration and standalone route problems.

### Assuming `router.refresh()` clears every cache

It asks for fresh server rendering but server cache semantics remain separate.

### Placing important Client state in a subtree that remounts on every route

Causes unexpected state loss.

### Relying on preserved state for security

Client state is not authoritative and can never replace server authorization.

## Performance model

Measure both:

```text
hard navigation:
TTFB
HTML paint
JS load
hydration

soft navigation:
prefetch hit/miss
RSC request latency
fallback duration
segment reveal
client reconciliation/hydration
```

A route can have excellent initial performance but poor client transitions, or the reverse.

## Interview questions

**Why can layouts preserve state during App Router navigation?**  
Because client navigation reconciles changed route segments into the existing React tree rather than replacing the whole document.

**What is the difference between `router.refresh()` and a browser reload?**  
`router.refresh()` requests a new server route payload and reconciles it while preserving the current document/client state where possible; a reload creates a new document lifecycle.

**Why can direct navigation and intercepted navigation render different UI for the same URL?**  
App Router route composition can depend on navigation context, such as intercepted routes, while a direct URL resolves the canonical standalone route.

**Why should performance tests include both hard and soft navigation?**  
They exercise different delivery, cache, hydration, and state-preservation paths.

## Exercise

For a SaaS app with:

```text
/dashboard
/dashboard/settings
/customers/[id]
/customers/[id]/edit
```

Document:

- preserved layouts
- state that survives soft navigation
- state that resets on hard load
- route prefetch strategy
- Suspense/loading boundaries
- refresh behavior after mutations
- Back/Forward expectations
