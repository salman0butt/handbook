---
title: History, Scroll, Focus & Accessibility
description: Understand native history integration, Back/Forward semantics, scroll behavior, hash navigation, focus, and accessible route transitions.
---

# History, Scroll, Focus & Accessibility

Routing is a browser interaction model, not merely a React API.

A production navigation system should cooperate with:

- browser history
- Back and Forward
- scroll restoration
- hash links
- keyboard navigation
- focus
- assistive technology
- copy/share/bookmark behavior

The best App Router architecture usually preserves these browser capabilities rather than replacing them with custom state.

## Browser history mental model

A simplified history stack:

```text
1. /products
2. /products?category=coffee
3. /products/42
```

If the user is on entry 3:

```text
Back → entry 2
Back → entry 1
Forward → entry 2
```

Your choice of `push`, `replace`, `<Link replace>`, and native History API controls whether a state becomes a real entry.

## History is product behavior

Ask:

> If the user presses Back after this interaction, what should happen?

That determines history semantics better than “which API is easiest?”

Examples:

| Interaction | Typical history choice |
| --- | --- |
| open product detail | push |
| move to next result page | often push |
| debounced search typing | often replace |
| canonicalize malformed query | replace/redirect |
| open shareable tab | often push |
| cosmetic local toggle | no URL/history change |

The table is guidance, not a law. Product expectations decide.

## Native History API integration

Current App Router supports:

```ts
window.history.pushState(...)
window.history.replaceState(...)
```

These calls integrate with the Next.js Router so route-aware hooks such as `usePathname()` and `useSearchParams()` stay in sync.

### `pushState`

```tsx
'use client'

import { useSearchParams } from 'next/navigation'

export function SortControls() {
  const searchParams = useSearchParams()

  function setSort(sort: 'asc' | 'desc') {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sort)

    window.history.pushState(null, '', `?${params.toString()}`)
  }

  return (
    <>
      <button onClick={() => setSort('asc')}>Ascending</button>
      <button onClick={() => setSort('desc')}>Descending</button>
    </>
  )
}
```

The previous state remains reachable with Back.

### `replaceState`

```ts
window.history.replaceState(null, '', nextUrl)
```

The current history entry is replaced.

Useful for URL normalization or state that should not create another Back-button stop.

## When to use native History API vs router navigation

Use `<Link>` or `router.push/replace` for normal route navigation.

Native `pushState`/`replaceState` is especially useful for shallow-style browser URL updates where you want to synchronize URL state without performing the default file-system route transition workflow.

Do not rebuild an entire router with History API calls. Next.js already owns route loading, layout preservation, prefetching, server payload integration, and route boundaries.

## Back/Forward is part of your testing plan

A filter UI may look correct while clicking controls, yet fail on Back.

Test this sequence:

```text
/products
→ category=coffee
→ sort=price
→ page=2
→ Back
→ Back
→ Forward
```

At each point verify:

- URL
- selected controls
- rendered data
- scroll position
- focus state where relevant

If UI state and URL state disagree, you likely duplicated a source of truth.

## Scroll behavior

For ordinary client navigation, Next.js manages page scroll behavior.

If the destination page is no longer visible in the viewport, navigation typically positions the user at the relevant top of the new page.

For Back/Forward, preserving/restoring scroll supports browser expectations.

When you explicitly need to preserve position:

```tsx
<Link href="/products?page=2" scroll={false}>
  Next page
</Link>
```

or:

```ts
router.push('/products?page=2', { scroll: false })
```

Use this for interactions like in-place pagination or filters where a scroll jump would be disruptive.

## Sticky headers and scroll offsets

If route navigation scrolls content under a fixed header, fix the layout with CSS instead of custom JavaScript scrolling.

```css
html {
  scroll-padding-top: 5rem;
}
```

or apply `scroll-margin-top` to target elements.

Prefer platform primitives over brittle timeout-based scrolling.

## Hash navigation

Because `<Link>` renders an anchor, hashes work naturally.

```tsx
<Link href="/settings#security">Security settings</Link>
```

Destination:

```tsx
<section id="security">
  <h2>Security</h2>
</section>
```

Use stable, meaningful IDs.

A hash is useful when the destination is a location inside a document rather than a different application state requiring a new route segment.

## Focus is not scroll

These are different:

```text
scroll position
  → what part of the document is visible

keyboard focus
  → which interactive/semantic element currently receives input
```

A page can scroll correctly while focus remains on an element from the previous route shell.

When designing custom navigation experiences, verify both.

## Avoid forcing focus on every navigation

Automatically calling:

```ts
headingRef.current?.focus()
```

on every query-string update can be frustrating.

Changing:

```text
?sort=name
→ ?sort=price
```

is not necessarily a “new page” from the user's perspective.

Focus management should reflect the semantic size of the transition.

## Useful focus cases

Explicit focus may be appropriate for:

- opening a route-driven modal
- returning focus when that modal closes
- moving into an error summary after failed form submission
- significant custom view changes that otherwise leave keyboard users disoriented

For route-driven modals, Phase 2's intercepting-route architecture should preserve expected modal focus behavior just like any accessible dialog.

## Navigation landmarks

Use semantic navigation:

```tsx
<nav aria-label="Primary">
  ...
</nav>
```

For multiple navigation regions:

```tsx
<nav aria-label="Account">...</nav>
<nav aria-label="Documentation">...</nav>
```

Do not rely only on CSS layout to communicate structure.

## Current-page semantics

For the active page:

```tsx
<Link
  href="/dashboard"
  aria-current={active ? 'page' : undefined}
>
  Dashboard
</Link>
```

For other patterns, choose the `aria-current` value that matches the semantic relationship.

Visual active state and accessibility state should agree.

## Links vs buttons

Use a link when activation changes location.

```tsx
<Link href="/settings">Settings</Link>
```

Use a button for an action.

```tsx
<button type="button" onClick={saveDraft}>
  Save draft
</button>
```

A button that calls `router.push()` can be justified when the navigation is the result of an imperative action, but ordinary navigation should remain an anchor.

## New tabs

Do not force every external link into a new tab.

If a product requirement uses a new tab, keep the semantics explicit:

```tsx
<a
  href="https://example.com"
  target="_blank"
  rel="noreferrer"
>
  External resource
</a>
```

Users should retain control over navigation where possible.

## Navigation feedback and reduced motion

If you animate route transitions, respect reduced-motion preferences.

```css
@media (prefers-reduced-motion: reduce) {
  .route-transition {
    animation: none;
    transition: none;
  }
}
```

Do not make comprehension depend on animation direction alone.

Stable 16.2's `transitionTypes` prop does not remove normal accessibility responsibilities, and deeper Next.js View Transition integration is still experimental.

## Do not hijack Back to trap users

Patterns that aggressively intercept Back to keep users inside a funnel often produce poor browser UX.

If a workflow must warn about unsaved data, design a narrow confirmation strategy. Do not turn browser history into an application-specific maze.

## Route-driven modal history

A strong intercepted-route modal flow can produce:

```text
/feed
→ /photo/42  (modal over feed via client navigation)
Back
→ /feed
```

Direct load of `/photo/42` can still render the full destination page.

This is a good example of routing, history, and UI semantics aligning.

## Scroll preservation and data updates

When query state updates in place:

```text
/products?page=1
→ /products?page=2
```

`scroll={false}` may be useful, but do not preserve scroll blindly if page 2 has a very different result height or if the control sits below the results.

Test the interaction with real content, keyboard navigation, and mobile viewport sizes.

## Avoid duplicate state

Bad:

```tsx
const [sort, setSort] = useState('name')
const searchParams = useSearchParams()
```

with no synchronization contract.

Better:

- URL is source of truth, or
- local draft state is explicit and committed to the URL at a defined moment

For example:

```text
input draft state
  → local while typing
submit
  → URL query becomes committed search state
```

This avoids Back/Forward restoring a URL that the component ignores.

## Testing matrix

For important navigation flows, test:

### Mouse

- normal click
- modifier-key click where relevant

### Keyboard

- Tab to link
- Enter to activate
- visible focus indicator

### History

- Back
- Forward
- reload at each state

### Scroll

- long pages
- sticky headers
- `scroll={false}` cases

### Direct URL entry

- paste/share/bookmark the final URL

### Assistive technology

- landmark names
- current-page semantics
- dialog focus for route-driven modals
- non-noisy pending announcements

## Common mistakes

### Using local state for shareable navigation state

Back, reload, and deep links break.

### Using `replace` everywhere

Back stops reflecting meaningful navigation.

### Using `push` for every keystroke

History becomes unusable.

### Solving sticky header scroll with JavaScript timers

CSS scroll offsets are usually more robust.

### Confusing scroll restoration with focus management

Both need separate verification.

## Debugging checklist

When browser navigation feels wrong:

1. Write down the history stack you expect.
2. Inspect which transitions push vs replace.
3. Test Back and Forward manually.
4. Reload deep URLs.
5. Verify URL-driven UI does not depend on stale local state.
6. Inspect scroll behavior independently from focus.
7. Check hashes and target IDs.
8. Check fixed/sticky header offsets.
9. Test keyboard-only navigation.
10. Test route-driven modal open/close history.

## Interview questions

**What is the difference between `pushState` and `replaceState`?**  
`pushState` adds a history entry; `replaceState` changes the current entry.

**Does native History API integrate with App Router hooks?**  
Yes. Current Next.js integrates those updates so `usePathname` and `useSearchParams` can stay synchronized.

**Why is `scroll={false}` not something to add everywhere?**  
Some navigations should reposition the user for genuinely new content; preserving scroll is interaction-specific.

**Why does route accessibility include more than semantic links?**  
History, scroll, focus, current-page state, loading feedback, direct deep links, and modal behavior all affect whether navigation is understandable and operable.

## Exercise

Build a searchable catalogue with:

- URL-driven filters
- pagination
- a sticky header
- Back/Forward support
- a hash link to an on-page section
- one state change using `pushState`
- one canonicalization using `replaceState`
- keyboard-accessible active navigation

Write down the expected history stack for a five-step user session and verify it in the browser.
