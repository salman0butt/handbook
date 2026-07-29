---
title: Routing, Navigation, Rendering & RSC Questions
sidebar_position: 2
description: Interview questions and concise answer keys for App Router routing, layouts, navigation, Server Components, RSC, Suspense, streaming, and hydration.
---

# Routing, Navigation, Rendering & RSC Questions

## 1. What is the App Router?

A file-system router using the `app` directory and modern React capabilities including Server Components, Suspense and Server Functions.

## 2. What does `page.tsx` represent?

The routable UI leaf for a segment. A route becomes publicly addressable when the matched tree contains a page or Route Handler.

## 3. Layout vs template?

Layouts persist across matching client navigations; templates create a new instance for their relevant segment and therefore remount descendant client state/effects.

## 4. What are route groups?

Folders such as `(marketing)` that organize routes without contributing a URL segment.

## 5. What are private folders?

Folders prefixed with `_` that opt implementation files out of routing semantics and communicate private colocation intent.

## 6. What are parallel routes?

Named slots that let a layout render multiple independently navigable subtrees at the same level.

## 7. What are intercepting routes?

Routing conventions that render another route in the context of the current route, commonly for route-driven modals while preserving direct-load behavior.

## 8. Why is `default.tsx` needed with parallel routes?

It provides fallback UI for a slot whose active state cannot be recovered on a hard load.

## 9. Hard vs soft navigation?

Hard navigation loads a full document; soft navigation uses the client router, fetching/reconciling route data while preserving shared layout state.

## 10. What does `<Link>` add over `<a>` inside one Next app?

Client navigation integration and prefetch behavior where eligible. An anchor remains appropriate across separate zones/apps or when hard navigation is intentional.

## 11. What does `useRouter().refresh()` do?

It requests fresh server route data and reconciles it into the current tree while preserving compatible client/browser state. It is not a universal cache invalidation API.

## 12. Why use URL state for filters/pagination?

It is shareable, bookmarkable, refresh-safe, back/forward-compatible and available to the server render.

## 13. What is a Server Component?

The App Router default component model: executes on the server, can access server-only resources, and does not ship its component implementation as client JS.

## 14. Is a Server Component the same as SSR?

No. RSC describes a component/module/render representation model; SSR/HTML generation is another stage used for initial delivery.

## 15. What does `'use client'` do?

Marks a client module boundary and causes that module plus reachable client dependencies to participate in the browser graph.

## 16. Does `'use client'` mean everything below it must be authored as Client Components?

No. Server Components can be composed as children/props produced by the server and passed into Client Components. The module import graph is the important boundary.

## 17. Why keep client boundaries narrow?

To reduce browser JS, hydration/main-thread work, secret/server dependency risk and unnecessary client state ownership.

## 18. What can cross from Server to Client Components?

Serializable values/references supported by React’s server/client model. Do not pass arbitrary server-only objects, DB clients or secrets.

## 19. What is the RSC payload?

A framework/React server-render representation describing the Server Component result and references to client code; it is used for initial rendering and client navigation reconciliation.

## 20. What is Flight?

The conceptual transport/protocol underlying React Server Components. Its private wire encoding is framework implementation detail, not an application API.

## 21. Initial request lifecycle?

Conceptually:

```text
route match
→ server/RSC render
→ HTML generation for first load
→ stream response
→ client JS loads
→ Client Components hydrate
```

## 22. Client navigation lifecycle?

```text
prefetch/route request
→ receive RSC/route data
→ reconcile route tree
→ preserve compatible layouts
→ load client chunks as needed
```

## 23. What is hydration?

React attaching client behavior/state to server-produced HTML for Client Components. Server Components themselves do not hydrate as client components.

## 24. Common hydration mismatch causes?

Time/randomness, locale differences, browser-only branches, invalid DOM nesting, stale version/assets and third-party/extension DOM changes.

## 25. What does Suspense do in Next.js?

Creates a boundary that can show fallback UI while a descendant is not ready, allowing independent rendering/streaming progress.

## 26. Does Suspense make the underlying data request faster?

No. It changes scheduling and perceived delivery, not the intrinsic latency of the slow operation.

## 27. `loading.tsx` vs manual `<Suspense>`?

`loading.tsx` creates a route-segment loading boundary automatically; manual Suspense gives finer subtree control.

## 28. Why can streamed `notFound()` behavior differ from non-streamed status handling?

Once response headers/status are committed, later rendering cannot always change the HTTP status. UI/noindex behavior can still communicate not-found semantics.

## 29. Why are preserved layouts important?

They avoid unnecessary remounting and allow state/DOM in shared layout segments to persist across soft navigation.

## 30. What is the senior mental model for rendering?

Do not label an app simply “SSR” or “CSR.” Reason per subtree across:

```text
server vs client ownership
prerendered vs request-time work
cached vs uncached work
streamed boundaries
browser hydration/interactivity
```

## Follow-up drill

For each answer, add:

```text
one failure mode
one performance implication
one test you would write
```

That converts fundamentals into senior depth.