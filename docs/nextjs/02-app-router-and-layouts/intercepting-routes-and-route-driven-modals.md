---
title: Intercepting Routes & Route-Driven Modals
description: Use intercepting routes with parallel slots to preserve context during soft navigation while keeping shareable full-page URLs.
---

# Intercepting Routes & Route-Driven Modals

Intercepting Routes let a destination render **inside the current route context during client navigation** while still having a normal full-page route for direct visits and refreshes.

The classic example is a photo gallery:

- clicking a photo from `/feed` opens `/photo/123` as a modal over the feed
- the browser URL becomes `/photo/123`
- refreshing `/photo/123` renders the full photo page
- opening the shared URL directly renders the full photo page

This gives one URL two context-sensitive presentations without making the modal state invisible to browser history.

## Why this pattern exists

A client-only modal such as:

```tsx
const [open, setOpen] = useState(false)
```

can work for simple UI, but it does not automatically solve:

- deep linking
- back-button behavior
- forward-button reopening
- refresh semantics
- direct URL access
- sharing the modal destination
- preserving the background route context during client navigation

Intercepting Routes solve these as routing problems rather than component-state tricks.

## The destination route still exists normally

Start with a full page:

```text
app/
└── photo/
    └── [id]/
        └── page.tsx
```

```tsx
// app/photo/[id]/page.tsx
export default async function PhotoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const photo = await getPhoto(id)

  return <FullPhotoPage photo={photo} />
}
```

This route is the canonical hard-navigation destination.

The intercepted presentation is additional route composition, not a replacement for the real destination.

## Interception matchers

Intercepting folder names look similar to relative paths, but they count **route segments**, not raw filesystem directories.

Current conventions:

| Matcher | Meaning |
| --- | --- |
| `(.)segment` | match a segment at the same level |
| `(..)segment` | match a segment one route level above |
| `(..)(..)segment` | match a segment two route levels above |
| `(...)segment` | match from the root `app` level |

Example:

```text
(..)photo
```

means “intercept the `photo` route relative to this route-segment position.”

## Count route segments, not folders

This is the most important interception rule.

Folders such as named parallel slots do not count as URL route segments.

For example:

```text
app/
├── photo/
│   └── [id]/
│       └── page.tsx
└── @modal/
    └── (.)photo/
        └── [id]/
            └── page.tsx
```

The `@modal` folder is a slot, not a route segment. So the matcher is based on the logical route-segment relationship, not how many `../` operations would be required in the filesystem.

Do not derive intercepting matchers by counting directory slashes.

## Interception and Parallel Routes belong together

Intercepting Routes define **which destination can be rendered contextually**.

Parallel Routes define **where that contextual UI is composed**.

A common structure:

```text
app/
├── layout.tsx
├── page.tsx
├── photo/
│   └── [id]/
│       └── page.tsx
└── @modal/
    ├── default.tsx
    ├── [...catchAll]/
    │   └── page.tsx
    └── (.)photo/
        └── [id]/
            └── page.tsx
```

The root layout receives the modal slot:

```tsx
export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        {modal}
      </body>
    </html>
  )
}
```

## The intercepted page renders modal UI

```tsx
// app/@modal/(.)photo/[id]/page.tsx
export default async function PhotoModalPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const photo = await getPhoto(id)

  return (
    <Modal>
      <Photo photo={photo} />
    </Modal>
  )
}
```

The public destination is still `/photo/[id]`.

The intercepted page tells Next.js how that destination should appear when reached through the matching client-navigation context.

## Soft navigation vs hard navigation

This is the defining behavior.

### Soft navigation

From the gallery/feed:

```tsx
<Link href={`/photo/${photo.id}`}>Open photo</Link>
```

Next.js can intercept the route and render the photo inside `@modal` while preserving the feed underneath.

The URL is still the destination URL.

### Hard navigation

If the user:

- pastes `/photo/123` into the address bar
- opens the link in a new tab
- refreshes the page
- visits from an external website

Next.js renders the normal full-page route:

```text
app/photo/[id]/page.tsx
```

No interception occurs because there is no preserved source navigation context to overlay.

This behavior is exactly what makes the modal URL shareable.

## Back and forward navigation

A route-driven modal participates in browser history.

Typical behavior:

1. user is at `/feed`
2. user clicks photo → URL becomes `/photo/123`, modal opens over feed
3. browser Back → returns to `/feed`, modal closes
4. browser Forward → `/photo/123`, modal presentation can reopen in preserved navigation context

This is much more natural than trying to synchronize local `isOpen` state manually with history.

## Closing the modal

A close button can use browser-style navigation semantics.

For example, a Client Component modal can call `router.back()` when “close” should mean “return to the previous route.”

But do not assume every modal was opened from a valid previous application state.

A robust design also considers:

- direct visit to the full page
- opening in a new tab
- user arriving from an external domain
- fallback destination if history is not appropriate

The full-page destination should always stand on its own.

## Clearing preserved slot state

Parallel-route soft navigation preserves active slot subpages.

Therefore, navigating to another route does not necessarily make the modal slot disappear automatically.

A common pattern is:

```text
app/@modal/[...catchAll]/page.tsx
```

```tsx
export default function CatchAll() {
  return null
}
```

This gives the modal slot a matching route that explicitly renders nothing for destinations where the overlay should be closed.

Also define:

```text
app/@modal/default.tsx
```

for hard-load fallback behavior.

## `default.tsx` and catch-all solve different problems

Do not confuse them.

`default.tsx` answers:

> What should this slot render when a hard load cannot recover its active state?

A catch-all slot page answers:

> What should this slot render during a navigation that matches this fallback route?

For modal slots, that often means:

```tsx
return null
```

in both places, but the routing reasons are different.

## Reuse domain UI, not necessarily route components

You may have:

```text
app/photo/[id]/page.tsx
app/@modal/(.)photo/[id]/page.tsx
```

Do not duplicate all photo rendering logic.

Extract domain UI/data helpers:

```tsx
// photo-view.tsx
export function PhotoView({ photo }: { photo: Photo }) {
  return <figure>...</figure>
}
```

Then compose it differently:

```tsx
// full page
return <FullPageShell><PhotoView photo={photo} /></FullPageShell>
```

```tsx
// modal
return <Modal><PhotoView photo={photo} /></Modal>
```

Keep route responsibilities separate while sharing domain presentation where appropriate.

## Avoid internal HTTP hops

Both route presentations are Server Components by default.

If they need photo data, they can call the same server-side data-access function directly rather than one route fetching the other route over HTTP.

```ts
const photo = await getPhoto(id)
```

is usually preferable to:

```ts
await fetch(`/api/photos/${id}`)
```

from server code in the same application unless an HTTP boundary is specifically required.

Data architecture is covered in Phase 5.

## Authentication modal example

Intercepting routes are also useful for authentication.

Product behavior:

- clicking “Sign in” from a page opens `/login` as a modal
- `/login` remains shareable
- refreshing `/login` renders a dedicated full page
- browser Back closes the modal and restores the previous context

The architecture can use:

```text
app/login/page.tsx
app/@auth/(.)login/page.tsx
```

plus the auth slot in a shared layout.

The modal presentation must not weaken authentication or authorization rules. It is merely a different UI composition for the same domain operation.

## Cart and detail-drawer examples

Other strong fits:

### Shopping cart drawer

The cart has a real URL and full page, but opens as a side panel from product browsing.

### Master-detail interface

A record detail can open over a list while retaining a direct detail page for bookmarks and external links.

### Image gallery

Probably the clearest example because preserving visual context while changing URL is a natural interaction.

## When not to use interception

Do not use advanced routing for every modal.

A confirmation dialog such as:

```text
Delete this invoice?
```

usually does not need a shareable URL or hard-navigation page.

Local component state is simpler.

Use route-driven modals when the modal represents meaningful navigable content.

## Accessibility

Routing does not make a modal accessible automatically.

A production modal still needs:

- appropriate dialog semantics
- an accessible name
- focus management
- keyboard dismissal where appropriate
- background interaction handling
- restored focus when closed
- scroll behavior that does not trap the user unexpectedly

The route architecture solves navigation semantics; the component must still solve interaction semantics.

## Analytics and observability

Because both modal and full-page presentations map to the same destination URL, analytics should distinguish:

- route destination
- presentation/context
- source route
- soft navigation vs direct/hard entry where relevant

Otherwise product metrics can incorrectly treat modal opens and full-page visits as identical user experiences.

## Debugging interception

When interception does not behave as expected, check:

1. Is the destination full-page route valid on its own?
2. Was navigation initiated client-side from the expected source context?
3. Is the intercepting matcher counted by route segments rather than filesystem depth?
4. Are `@slot` folders incorrectly being counted as segments?
5. Does the parent layout actually render the named slot?
6. Is `default.tsx` present?
7. Does a catch-all/null route clear preserved modal state?
8. Did a hard refresh intentionally bypass interception?
9. Are two routes accidentally publishing the same public path?

## Architecture invariant

A good route-driven modal system satisfies this invariant:

```text
Destination URL is meaningful with or without interception.
```

If `/photo/123` only works when reached from `/feed`, the architecture is incomplete.

The contextual presentation should enhance navigation, not become a hidden prerequisite for correctness.

## Interview questions

**What is an Intercepting Route?**  
A route convention that lets a destination render within the current layout context during client navigation while retaining its normal full-page behavior for hard navigation.

**Why do intercepted modals work well with Parallel Routes?**  
Interception identifies the contextual destination; the parallel slot gives the parent layout a place to render that overlay alongside the existing page.

**Does `(..)` mean one filesystem directory up?**  
No. Interception matchers count route segments, and slot folders such as `@modal` do not count as route segments.

**What happens when you refresh an intercepted modal URL?**  
The normal destination route renders as a full page; interception does not apply on the hard navigation.

**When should a modal stay local state instead of route state?**  
When it is transient UI without meaningful navigation/deep-link/history semantics, such as a simple confirmation dialog.

## Official reference

- https://nextjs.org/docs/app/api-reference/file-conventions/intercepting-routes
- https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes

Next: **Routing Architecture, Failure Modes & Design Review**.