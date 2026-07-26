---
title: Link, Client Navigation & Prefetching
description: Understand Next.js App Router navigation, Link behavior, prefetching, history, scroll, and current 16.2 performance semantics.
---

# Link, Client Navigation & Prefetching

Navigation in the App Router is not just “change the URL.” It is a coordinated operation between the browser, the client router, the server-rendered route tree, React transitions, prefetched route data, and preserved layout state.

This chapter uses the **Next.js 16.2 stable model**. Next.js 16.3 preview features such as the newer Instant Navigations model are intentionally not treated as stable handbook behavior.

## The default navigation tool: `<Link>`

For normal user-visible navigation, start with `next/link`.

```tsx
import Link from 'next/link'

export default function DashboardLink() {
  return <Link href="/dashboard">Dashboard</Link>
}
```

`<Link>` renders an anchor while adding App Router client navigation and prefetching behavior.

Use a normal `<a>` when you specifically want browser-native navigation outside the application, such as an external site.

## Client navigation mental model

Suppose the user is on:

```text
/dashboard/projects
```

and clicks:

```tsx
<Link href="/dashboard/settings">Settings</Link>
```

A typical App Router transition is conceptually:

```text
click
  ↓
client router resolves destination
  ↓
reuse already-active layouts where possible
  ↓
use prefetched route data if available
  ↓
request missing route payload if needed
  ↓
React applies the navigation transition
  ↓
URL + changed route subtree update
```

The browser does not need to discard the entire document for a normal internal App Router navigation.

That matters because persistent layouts can preserve client state and DOM while the destination route subtree changes.

## `<Link>` is still an anchor

Do not forget the underlying web primitive.

```tsx
<Link href="/reports" className="nav-link" aria-label="Reports">
  Reports
</Link>
```

Anchor attributes such as `className`, `target`, and `rel` can be passed through.

The semantic rule remains:

- navigation belongs on links
- actions belong on buttons

Do not use a clickable `<div>` when the user is navigating to another URL.

## `href`

A string is usually easiest to read:

```tsx
<Link href="/products/coffee-grinder">Coffee grinder</Link>
```

You can also use a URL object:

```tsx
<Link
  href={{
    pathname: '/products',
    query: { category: 'coffee', sort: 'price' },
  }}
>
  Coffee products
</Link>
```

Prefer explicit URLs. A URL is product state, not an implementation detail.

## Dynamic route links

For:

```text
app/products/[productId]/page.tsx
```

build the public URL:

```tsx
<Link href={`/products/${product.id}`}>{product.name}</Link>
```

If an identifier can contain reserved URL characters, encode it before placing it into a path segment.

```tsx
<Link href={`/search/${encodeURIComponent(term)}`}>Search</Link>
```

## History: push vs replace

Normal `<Link>` navigation adds a history entry.

```text
/products
→ /products/42
→ /products/42/reviews
```

The Back button can walk through those entries.

For navigation that should replace the current entry:

```tsx
<Link href="/products?sort=price" replace>
  Sort by price
</Link>
```

Use `replace` deliberately for state transitions that should not create a meaningful Back-button stop.

A common example is changing a temporary filter state repeatedly.

## Scroll behavior

App Router navigation manages scrolling rather than always doing a blind `window.scrollTo(0, 0)`.

For links where you want to preserve the current scroll behavior explicitly:

```tsx
<Link href="/products?page=2" scroll={false}>
  Next page
</Link>
```

This is useful for pagination or filters where the results area should remain in view.

Do not disable scroll automatically for every route. Navigation to a genuinely different page often should position the user appropriately for the new content.

## Production prefetching

Prefetching is a key part of App Router navigation performance.

```tsx
<Link href="/dashboard">Dashboard</Link>
```

In production, eligible links can prefetch route code and route data before the click.

That changes the user-perceived timeline from:

```text
click → start route work → wait → render
```

toward:

```text
link visible → useful destination work begins
click → reuse prefetched work → render sooner
```

Prefetching is primarily a **production behavior**. Do not diagnose it only from `next dev`.

## Default prefetch behavior in Next.js 16.2

The default is `prefetch={null}` or `prefetch="auto"`.

Current stable behavior distinguishes route characteristics:

- static routes can be fully prefetched
- dynamic routes can be partially prefetched down to an appropriate loading boundary
- hovering can trigger another prefetch if prior prefetched data has expired

This is why adding meaningful `loading.tsx` boundaries can improve navigation architecture, not just loading visuals.

## Force full prefetch

```tsx
<Link href="/dashboard" prefetch={true}>
  Dashboard
</Link>
```

This requests full-route prefetch behavior for both static and dynamic routes.

Do not turn this on across a large navigation surface without measuring bandwidth, server work, and cache behavior.

## Disable prefetch

```tsx
<Link href="/expensive-report" prefetch={false}>
  Expensive report
</Link>
```

When `false`, automatic prefetching does not happen on viewport entry or hover.

Possible reasons:

- extremely large navigation surfaces
- destinations that are rarely opened
- routes with expensive personalized work
- deliberate control over network activity

But disabling prefetching globally usually throws away one of the App Router's biggest navigation advantages.

## Prefetching is not authorization

A prefetched destination must obey the same security rules as a directly requested destination.

Never design authorization around the assumption:

> “The user could only reach this page through a link we rendered.”

Users can type URLs, modify links, replay requests, and call endpoints directly.

Every protected resource must authorize access on the server.

## `onNavigate`

`<Link>` supports `onNavigate` for same-origin client navigation.

```tsx
<Link
  href="/editor/preview"
  onNavigate={(event) => {
    if (hasUnsavedCriticalState) {
      event.preventDefault()
      openConfirmationDialog()
    }
  }}
>
  Preview
</Link>
```

`onNavigate` is not identical to `onClick`.

`onClick` is a DOM click handler. `onNavigate` is about the client navigation operation.

For example, modifier-key clicks that open another tab can run `onClick` without producing the same App Router navigation event.

Use navigation interception sparingly. Blocking normal link behavior can create accessibility and browser-history surprises.

## `transitionTypes` in 16.2

Stable Next.js 16.2 added `transitionTypes` to App Router `<Link>`.

```tsx
<Link href="/gallery" transitionTypes={['forward']}>
  Gallery
</Link>
```

The values are passed into React's navigation transition machinery.

However, broader Next.js View Transition integration remains experimental. Do not interpret the existence of this prop as meaning every View Transition capability is production-stable.

## Internal vs external navigation

Internal application route:

```tsx
<Link href="/pricing">Pricing</Link>
```

External destination:

```tsx
<a href="https://example.com">External documentation</a>
```

If opening an external site in a new tab:

```tsx
<a href="https://example.com" target="_blank" rel="noreferrer">
  External documentation
</a>
```

Keep the distinction obvious for readers and reviewers.

## Common mistakes

### Using `<a>` for every internal route

This can cause full document navigation and discard App Router client-transition benefits.

### Calling `router.push()` from every clickable item

If the user is clicking a normal navigation control, `<Link>` is usually more semantic and more capable.

### Disabling prefetch everywhere

This often makes navigation slower without solving a measured problem.

### Assuming prefetch means “the whole page is always loaded”

Current behavior depends on route characteristics and loading boundaries.

### Testing prefetch only in development

Production is the correct environment for validating production prefetch behavior.

## Performance review checklist

For a navigation surface, ask:

1. Is this normal navigation that should use `<Link>`?
2. Is the route likely enough to be visited that prefetching helps?
3. Does the destination have a useful loading boundary?
4. Are we forcing full prefetch across too many links?
5. Are repeated query-state changes polluting history?
6. Is scroll behavior appropriate for the interaction?
7. Are we measuring production behavior rather than guessing?

## Debugging slow navigation

Separate the timeline into phases:

```text
click
├── was destination already prefetched?
├── did router need a server request?
├── is server rendering/data work slow?
├── is streaming/loading UI available?
├── is client JS for interactive UI large?
└── is the visual delay actually layout/animation work?
```

Do not blame “the router” before identifying the slow stage.

## Interview questions

**Why prefer `<Link>` over `router.push()` for ordinary navigation?**  
It preserves anchor semantics while integrating App Router client navigation and prefetching.

**Is prefetching enabled the same way in development and production?**  
No. Production behavior is the relevant baseline for automatic prefetching.

**Does a dynamic route mean it cannot be prefetched?**  
No. Current Next.js can partially prefetch dynamic routes, including work down to an appropriate loading boundary.

**When would you use `replace`?**  
When the current history entry should be replaced rather than preserved as a meaningful Back-button destination.

## Exercise

Build a product catalogue navigation surface with:

- product detail links
- category links
- a pagination link using `scroll={false}`
- one deliberately non-prefetched expensive route
- a short document explaining why each link uses its chosen history, scroll, and prefetch behavior

Then run a production build and inspect navigation requests in browser developer tools.
