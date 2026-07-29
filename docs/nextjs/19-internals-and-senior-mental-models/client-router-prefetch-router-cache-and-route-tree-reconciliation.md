---
title: Client Router, Prefetch, Router Cache & Route-Tree Reconciliation
sidebar_position: 5
description: Understand how App Router client navigation prefetches RSC payloads, caches route segments, preserves layouts, reconciles route trees, handles streaming, and falls back to hard navigation when versions diverge.
---

# Client Router, Prefetch, Router Cache & Route-Tree Reconciliation

The App Router browser experience feels SPA-like, but its data model is not a traditional client SPA route table fetching JSON.

A better model is:

```text
server-owned route tree
+
RSC payloads
+
client-side router state
+
prefetched segment cache
→ incremental navigation
```

## 1. The browser owns an active route tree

A pathname alone is not enough to represent the current UI.

The client router may need to represent:

```text
nested layouts
leaf page
parallel slots
intercepted route context
loading boundaries
segment params
```

Conceptually:

```text
root
└─ dashboard
   ├─ main → analytics
   └─ modal → empty/default
```

Navigation updates this tree rather than replacing one flat page object.

## 2. Shared layouts are reusable route segments

When moving between siblings:

```text
/dashboard/settings
→ /dashboard/billing
```

Next.js can preserve the shared dashboard layout.

Conceptually:

```text
old tree
root/layout
└─ dashboard/layout
   └─ settings/page

new tree
root/layout
└─ dashboard/layout
   └─ billing/page
```

Only the changed segment needs replacement.

## 3. Route-tree preservation explains state persistence

If a Client Component lives in a preserved layout, its local state can survive navigation.

If it lives inside a replaced page segment, it may remount.

So when debugging state persistence, ask:

```text
Did the route segment remain part of the same active tree?
```

not only:

```text
Did the URL change?
```

## 4. Templates intentionally alter preservation

A `template.tsx` creates a new instance across navigation where a layout would normally persist.

Use that difference to reset subtree state intentionally.

Internally useful model:

```text
layout → stable segment wrapper

template → navigation-remount wrapper
```

## 5. Prefetching moves future route work earlier

For a `<Link>` entering the viewport, production Next.js can prefetch route data before the click.

That can include:

```text
RSC payload
route-specific client JS chunks
shared layout/loading state
```

The exact amount depends on route characteristics.

## 6. Static and dynamic routes prefetch differently

Current guidance distinguishes:

```text
static route
→ full route can be prefetched

dynamic route
→ no full automatic prefetch by default
→ partial prefetch possible with loading boundary
```

This prevents speculative navigation from executing expensive dynamic work for every visible link.

## 7. `loading.tsx` creates a prefetchable navigation shell

A dynamic route with `loading.tsx` can prefetch the shared route/layout state through the first loading boundary.

Then on click:

```text
prefetched shell displayed immediately
+
server renders dynamic leaf
+
result streams in
```

This is why `loading.tsx` is both a server-streaming and client-navigation primitive.

## 8. Router Cache stores prefetched RSC data in memory

Current Next.js guidance describes client-side caching of prefetched RSC payloads keyed by route segments.

Mental model:

```text
prefetch /dashboard
→ cache shared dashboard segment

prefetch /dashboard/settings
→ cache leaf/settings payload
```

A later sibling navigation can reuse the parent segment.

## 9. Router Cache is ephemeral browser memory

It is not:

```text
Redis
server Data Cache
Service Worker cache
browser HTTP disk cache
```

It exists for client navigation efficiency.

A hard reload creates a new client-router lifetime.

## 10. Prefetch cache lifetime depends on route/loading behavior

Current docs expose default client cache windows that differ based on whether a loading boundary exists and whether a route is static/dynamic.

Do not hard-code these private timings into business correctness.

Use them for performance understanding, then depend on public freshness/revalidation APIs for correctness.

## 11. Cache freshness is metadata-driven

Cache Components can communicate stale windows to the router.

Conceptually:

```text
server render/cache policy
→ navigation response freshness metadata
→ Router Cache decides reuse vs refresh
```

This connects server freshness policy to client navigation behavior.

## 12. Prefetch is production behavior

Automatic `<Link>` prefetching is generally a production optimization.

Do not test dev mode and conclude production prefetch does or does not occur the same way.

Use a production build for navigation performance behavior.

## 13. Client transition is not HTML navigation

A normal soft navigation does not require a full new document HTML response.

Conceptually:

```text
click Link
→ router resolves destination
→ reuse prefetched payload or request RSC
→ merge route-tree patch
→ render changed segments
→ keep document/runtime alive
```

This preserves compatible client state and avoids a full browser reload.

## 14. Initial document and navigation requests serve different needs

Initial load needs:

```text
HTML
RSC state
client assets
```

Subsequent client navigation primarily needs:

```text
new/updated RSC tree data
required client chunks
```

This is why a direct load can work while soft navigation fails, or vice versa.

## 15. Navigation payload is a tree patch in mental-model terms

Do not imagine every navigation sending an entire app snapshot.

A useful abstraction is:

```text
current route tree
+
server-produced next-route information
→ reconcile shared branches
→ replace changed branch
```

The private payload shape is not an application API.

## 16. Parallel routes make router state multi-dimensional

A layout with slots:

```text
@main
@modal
@notifications
```

can have independent active segments.

Navigation may update one slot while preserving another.

This is why the route router state is more complex than a pathname.

## 17. `default.tsx` handles missing slot state on hard navigation

Client navigation may preserve previously known slot state.

A hard reload has no previous in-memory router state.

If a parallel slot has no route matching the requested URL, `default.tsx` gives Next.js a fallback.

This is a direct example of:

```text
soft navigation context
≠
hard-load context
```

## 18. Intercepting routes depend on navigation context

An intercepted modal often works like:

```text
from feed:
/photos/42
→ feed stays mounted
→ modal slot renders photo
```

But direct load:

```text
/photos/42
→ canonical full photo page
```

The same URL can correspond to different rendered route-tree contexts based on how navigation arrived there.

## 19. Browser history stores URL navigation, router rebuilds rendering context

Back/forward navigation interacts with:

```text
browser history
router cache
active route tree
preserved layouts
```

Do not store canonical business state only in layout-local component memory if browser history must reconstruct it reliably.

Prefer URL/server state where appropriate.

## 20. Scroll and focus are navigation semantics too

Client transitions also own UX behaviors such as:

```text
scroll position
focus movement
pending feedback
```

These may differ from hard browser navigation.

Routing internals are not just network optimization; they affect accessibility and interaction state.

## 21. `router.refresh()` asks for fresh server route output

`router.refresh()` causes the current route's Server Components to be re-requested/re-rendered while preserving compatible client/browser state.

Mental model:

```text
current client tree
→ request fresh RSC payload
→ merge refreshed server output
→ preserve unaffected client state where possible
```

It is not equivalent to `window.location.reload()`.

## 22. `refresh()` from a Server Action targets client-router refresh

The `refresh()` API from `next/cache` can be called inside a Server Action to refresh the client router as part of the mutation response.

This allows:

```text
mutation
→ server updates data
→ server tells client router to refresh
→ updated UI arrives in framework roundtrip
```

## 23. Server Actions can return updated UI in the same roundtrip

Current Next.js documentation emphasizes that an Action response can contain both:

```text
mutation result
+
updated UI/RSC data
```

This avoids the traditional mandatory sequence:

```text
POST mutation
→ GET JSON
→ client manually refetches every affected query
```

The framework can integrate mutation and route reconciliation.

## 24. Revalidation changes router reuse decisions

Calling revalidation APIs from Server Functions can cause previously cached/prefetched client route data to be considered invalid.

Current implementation details around exactly how broadly entries are cleared can change.

Depend on the public outcome:

```text
affected UI must become fresh
```

not the exact internal map mutation.

## 25. Prefetch can be invalidated before click

A prefetched route can become stale due to:

```text
time-based stale window
mutation/revalidation
deployment change
application refresh
router lifecycle reset
```

Prefetch is a performance hint, not a correctness snapshot that must always be used.

## 26. Prefetch scheduling prioritizes likely navigations

Current Next.js maintains a small prefetch task queue rather than fetching every destination with equal urgency.

That means prefetch completion is opportunistic.

Do not assume visible link means payload is certainly present before click.

## 27. Slow network can expose partial-prefetch behavior

If the user clicks before full route data is available:

```text
prefetched loading shell may be available
→ navigation starts immediately
→ dynamic result streams later
```

Without a loading boundary, the user may wait longer for the server response before visible route replacement.

## 28. Client bundles can delay prefetch start

`<Link>` participates in client-side behavior.

If hydration is delayed by large browser JavaScript:

```text
Link not hydrated yet
→ automatic prefetch may start late
```

This is one reason reducing client bundle size improves navigation beyond initial interaction cost.

## 29. `useLinkStatus` exposes pending navigation state

A route transition may be underway even when destination content is not ready.

`useLinkStatus` can expose pending state associated with Link navigation so UI can show feedback.

This is an application-facing view into router transition state.

## 30. Hard navigation is the compatibility fallback

During a rolling deployment, an old browser/router can hold:

```text
old client chunks
old RSC assumptions
old Server Function references
```

A new server may not be compatible.

With `deploymentId`, Next.js can detect mismatch and trigger a hard navigation.

## 31. Deployment ID participates in client/server navigation protocol

Current documented behavior includes:

```text
client navigation sends deployment identity
server response exposes deployment identity
mismatch → hard reload
```

The stable lesson:

> A soft navigation is allowed only when client/server versions can safely participate in the same application runtime.

## 32. Why old assets must remain available

Even if the router detects version skew, a browser may still request old hashed client assets during the transition.

If old assets are immediately deleted:

```text
old HTML/client runtime
→ requests old chunk
→ 404
```

Retaining immutable assets across rollout reduces this failure mode.

## 33. Navigation failure after deploy is often skew, not “React bug”

Symptoms:

```text
works after hard refresh
fails only for users with open tabs
missing chunk/action errors
soft navigation fails across release
```

First hypothesis:

```text
client/server deployment version mismatch
```

Then inspect deployment ID, asset retention, Server Function keys, and rollout topology.

## 34. RSC rewrite correctness matters for soft navigation

Proxy rewrites must preserve the framework's RSC routing semantics.

Current Proxy documentation notes that Next.js handles required Flight rewrite metadata when using `NextResponse.rewrite()`.

If you bypass it with a raw custom fetch/proxy implementation, you can break RSC navigation even when HTML requests look correct.

Use documented rewrite APIs.

## 35. Internal Flight headers are not application routing signals

The framework uses internal request metadata for RSC/prefetch/navigation transport.

Proxy intentionally hides/normalizes parts of that metadata from ordinary application logic.

Do not branch business behavior on private RSC headers.

HTML and RSC requests for the same route must represent compatible application behavior.

## 36. Prefetch side effects are architectural bugs

Because routes can be prefetched before a user explicitly visits them, render/data-loading logic must not produce side effects.

Bad:

```text
render route
→ increment view count
→ send email
→ mutate DB
```

A speculative prefetch could trigger unintended actions.

Mutations belong in explicit mutation boundaries.

## 37. Authentication checks must tolerate prefetch

A route can be fetched speculatively.

Auth logic should:

```text
verify access safely
return/redirect according to route policy
avoid irreversible side effects
```

Do not rely on “user clicked the page” as proof of intent.

## 38. Router Cache does not replace authorization

A browser may possess old RSC payload data.

After a role is revoked, server-side protected operations must still reauthorize every mutation/read boundary as needed.

Client cache invalidation improves freshness; it is not the security barrier.

## 39. Router cache data is user-visible data

If sensitive data is rendered into an RSC payload, it has crossed to the client.

Do not assume that because content came from a Server Component it remains server-secret.

Server-only code can generate client-visible output.

## 40. Debugging a navigation waterfall

Capture:

```text
Link visibility/prefetch timing
RSC navigation request
server response start
Suspense chunk timing
client chunk loading
hydration/main-thread work
```

Then distinguish:

```text
prefetch never started
prefetch incomplete
server render slow
stream buffered
client JS late
```

## 41. Debugging stale soft navigation

If hard refresh shows fresh data but soft navigation shows stale data:

focus on:

```text
Router Cache
prefetch freshness
revalidation timing
cacheLife stale window
client state overriding server output
```

If both hard and soft paths are stale, move investigation toward server/CDN/data caches.

## 42. Debugging state unexpectedly preserved

Ask:

```text
Was component under a persistent layout?
Did route segment identity stay the same?
Would template create intended remount?
Should state actually be URL/server state?
```

Do not use random keys globally just to force resets.

## 43. Debugging state unexpectedly reset

Check for:

```text
hard navigation
changing key
template boundary
root layout transition
multi-zone transition
deployment skew reload
conditional subtree identity change
```

A URL change alone does not prove why state reset.

## 44. Multi-Zone navigation is intentionally hard across zones

Separate Next.js zones are separate applications/deployments.

Cross-zone transitions cannot assume one shared client route tree/runtime.

Therefore hard navigation across zones is expected.

This is a deployment boundary showing up as navigation semantics.

## 45. A browser router is not canonical application state

Router Cache and preserved layouts optimize UI continuity.

Canonical business state still belongs in authoritative server/domain storage.

Do not make a persistent business invariant depend on an in-memory route segment being preserved.

## 46. Senior navigation mental model

Explain a Link transition as:

```text
1. Link becomes eligible for prefetch
2. router may fetch RSC payload/chunks early
3. payload cached by route segment
4. user clicks
5. router resolves destination tree
6. reusable shared segments remain active
7. cached or freshly fetched RSC data supplies changed segments
8. Suspense streams deferred work
9. React reconciles tree
10. needed Client Components render/hydrate
11. scroll/focus/history semantics update
```

## Production checklist

- [ ] hard-load and soft-navigation behavior are tested separately
- [ ] dynamic routes use loading boundaries where fast transition feedback matters
- [ ] prefetching does not trigger side effects
- [ ] broad link lists consider prefetch resource cost
- [ ] state placement matches route-segment lifetime
- [ ] parallel/intercepted routes are tested with direct URL, back, forward, and refresh
- [ ] Router Cache is not confused with server cache
- [ ] revalidation produces correct visible freshness
- [ ] deployment IDs are consistent across replicas for one release
- [ ] old hashed assets survive rolling deploy windows
- [ ] RSC rewrites use documented NextResponse behavior

## Interview questions

### Why can an App Router layout preserve React state?

Because client navigation reconciles a route tree and reuses compatible shared layout segments instead of replacing the whole document.

### What is Router Cache?

An in-memory client-side cache of prefetched/visited RSC route-segment data used to make navigation faster. It is separate from server-side data/content caches.

### Why might Next.js intentionally hard-reload during navigation?

If the client and server deployment IDs differ, a soft transition could mix incompatible assets, RSC expectations, or Server Function references. Hard navigation resets the browser onto one consistent deployment.
