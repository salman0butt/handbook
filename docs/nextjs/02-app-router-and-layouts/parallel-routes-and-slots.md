---
title: Parallel Routes & Slots
description: Render independently navigable route branches in one layout using named slots, defaults, and soft-navigation state.
---

# Parallel Routes & Slots

Parallel Routes let one layout render multiple route branches at the same time.

They are useful when the URL selects a larger screen composed of independently meaningful regions, such as:

- analytics + team panels
- inbox list + conversation details
- dashboard widgets
- feed + activity panel
- page + modal slot

The core convention is the **named slot**.

## Named slots use `@folder`

```text
app/dashboard/
├── layout.tsx
├── page.tsx
├── @analytics/
│   ├── default.tsx
│   └── page.tsx
└── @team/
    ├── default.tsx
    └── page.tsx
```

The folders `@analytics` and `@team` define slots.

They do **not** add URL segments.

The parent layout receives the slots as props:

```tsx
export default function DashboardLayout({
  children,
  analytics,
  team,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  team: React.ReactNode
}) {
  return (
    <main className="dashboard-grid">
      <section>{children}</section>
      <aside>{analytics}</aside>
      <aside>{team}</aside>
    </main>
  )
}
```

## `children` is an implicit slot

The normal route content is effectively an unnamed/default slot exposed as `children`.

Conceptually:

```text
app/page.tsx
```

behaves like the implicit children slot for that route level.

This matters when reasoning about `default.tsx` during hard navigation: the ordinary `children` branch is still part of the slot composition model even though you did not create an `@children` folder.

## Slots are not URL segments

Given:

```text
app/dashboard/
├── @analytics/
│   └── page.tsx
└── @team/
    └── page.tsx
```

You do not navigate to:

```text
/dashboard/@analytics
```

The slot name is a composition key for the layout, not part of the public pathname.

This is the first major difference between:

```text
analytics/
```

and:

```text
@analytics/
```

A normal segment changes the route hierarchy and URL shape. A slot changes what the parent layout can render in parallel.

## Independent subpages inside slots

Slots can have nested pages.

```text
app/dashboard/
├── layout.tsx
├── @analytics/
│   ├── default.tsx
│   ├── page.tsx
│   ├── visitors/
│   │   └── page.tsx
│   └── revenue/
│       └── page.tsx
└── @team/
    ├── default.tsx
    └── page.tsx
```

A slot can also have its own layout for slot-local tabs or chrome.

This lets one region of a screen navigate while the parent layout continues to compose other regions.

## The hard part: active slot state

Parallel routes make navigation state richer than a single pathname-to-page mapping.

Next.js tracks the active subpage for each slot during client-side navigation.

This creates two different behaviors:

### Soft navigation

During client-side navigation, Next.js can preserve the active state of slots that are not being changed by the destination.

Example:

```text
@team      = /settings
@analytics = /visitors
```

A client navigation that changes only the team branch can keep the currently active analytics branch mounted/rendered even when that analytics subpage is not directly represented by the new URL.

This is intentional. It allows independently navigable regions.

### Hard navigation

On a full browser reload or direct load, the framework does not have the previous in-memory slot state.

The URL may not contain enough information to reconstruct every slot's active subpage.

That is where `default.tsx` becomes essential.

## `default.tsx` is the hard-load fallback

```text
app/dashboard/@analytics/default.tsx
```

might return:

```tsx
export default function AnalyticsDefault() {
  return <AnalyticsOverview />
}
```

or:

```tsx
export default function AnalyticsDefault() {
  return null
}
```

The correct choice is a product decision.

Current Next.js 16.2 guidance requires explicit defaults for named slots so hard navigation has a defined recovery state. Do not rely on older tutorials that assume an unmatched named slot can simply disappear without a defined fallback.

The implicit `children` slot may also need a `default.tsx` when the parent page state cannot be reconstructed after a hard load.

## Design defaults as neutral states

A default should answer:

> What should this region show when the current URL does not identify an active subpage for it?

Good defaults:

- dashboard overview
- “Select a conversation” placeholder
- neutral analytics summary
- `null` when the region should be absent
- deliberate `notFound()` when an unmatched state is invalid

Avoid inventing state that could mislead the user.

## Static and dynamic behavior at one slot level

Parallel slots at the same route segment are composed together.

Current Next.js docs note an important constraint: you cannot make one slot static and another dynamic as separate independent rendering modes at the same segment level. If one slot forces that segment to be dynamic, the slots at that level participate in the dynamic route behavior.

This is a reminder that slots are not separate applications. They are branches of one composed route segment.

## Typed slots with `LayoutProps`

When route types are generated, `LayoutProps` can expose named slots.

```tsx
export default function Layout(
  props: LayoutProps<'/dashboard'>
) {
  return (
    <div>
      {props.children}
      {props.analytics}
      {props.team}
    </div>
  )
}
```

This helps TypeScript track the slot names defined by the filesystem.

## Conditional rendering with slots

A layout can conditionally compose slots based on server-side decisions.

For example, a dashboard could receive:

```tsx
export default async function Layout({
  children,
  admin,
  member,
}: {
  children: React.ReactNode
  admin: React.ReactNode
  member: React.ReactNode
}) {
  const session = await requireSession()

  return (
    <>
      {children}
      {session.role === 'admin' ? admin : member}
    </>
  )
}
```

But do not treat route slots as an authorization system.

If the admin slot reads privileged data, that server-side data access must still enforce authorization. Hiding a slot in layout composition is not sufficient security by itself.

## Slot-local loading and error boundaries

One major benefit of parallel routes is independent loading/error handling.

```text
app/dashboard/
├── @analytics/
│   ├── loading.tsx
│   ├── error.tsx
│   └── page.tsx
└── @team/
    ├── loading.tsx
    ├── error.tsx
    └── page.tsx
```

If analytics work is slow, the team area can remain useful.

If analytics rendering fails, a slot-local boundary can contain the failure rather than replacing the entire dashboard.

This is where route architecture directly affects resilience.

## Independent tabs in a slot

A slot can own nested navigation:

```text
@analytics/
├── layout.tsx
├── default.tsx
├── visitors/
│   └── page.tsx
└── page-views/
    └── page.tsx
```

The slot layout can render a tab UI and its children.

Phase 3 covers `Link` and `useSelectedLayoutSegment(s)` in detail. For now, understand that slot navigation can be read using the parallel-route key so UI can reflect the active slot segment.

## Modal architecture

Parallel routes become especially powerful when paired with Intercepting Routes.

Typical structure:

```text
app/
├── layout.tsx
├── page.tsx
├── photo/
│   └── [id]/
│       └── page.tsx
└── @modal/
    ├── default.tsx
    └── (...)photo/
        └── [id]/
            └── page.tsx
```

The normal `/photo/[id]` route provides the full page.

The `@modal` slot can render the same destination contextually as an overlay during client navigation.

The next chapter explains interception rules.

## Closing a modal slot correctly

A subtle parallel-route behavior surprises many developers:

> During soft navigation, a slot can preserve its previously active subpage even when the next destination does not explicitly match that slot.

So a modal may remain visible unless the slot matches something that renders `null`.

A common pattern is a catch-all route in the modal slot:

```text
@modal/
└── [...catchAll]/
    └── page.tsx
```

```tsx
export default function CatchAll() {
  return null
}
```

Now navigations that should not display the modal can actively match a slot page that clears it.

This behavior is not a workaround. It follows directly from soft-navigation slot state preservation.

## When parallel routes are a good fit

Use them when multiple route regions are genuinely independently meaningful.

Strong fits:

- dashboard panels with separate pending/error states
- master-detail interfaces
- modal overlays with deep-linking
- tabbed areas whose state should coexist with another route region
- multi-pane productivity tools

## When parallel routes are overkill

Do not use them merely to render two components side by side.

This:

```tsx
<div>
  <Chart />
  <TeamList />
</div>
```

may be perfectly sufficient.

Choose Parallel Routes when you need **routing semantics**:

- independent subpage state
- slot-specific loading/error boundaries
- URL-aware navigation
- hard-load fallbacks
- interception/modal composition

If you only need layout composition, ordinary React components are simpler.

## Performance reasoning

Parallel routes can improve perceived resilience because independent branches can stream and fail separately.

But they can also increase route complexity and server work if each slot starts expensive data access.

Review:

- whether slot data can be fetched in parallel
- whether the same database work is duplicated across slots
- whether one slot's dynamic behavior affects the entire route segment
- whether loading boundaries reveal useful content early
- whether the route is now too difficult to reason about for the product benefit gained

Architecture should reduce user-facing coupling without creating unnecessary engineering coupling.

## Debugging parallel routes

When a slot renders unexpectedly, ask:

1. Was the navigation soft or hard?
2. What was this slot's previously active subpage?
3. Does the destination explicitly match a slot subpage?
4. Is `default.tsx` present for every named slot?
5. Does the implicit `children` branch need a default?
6. Should a catch-all route render `null` to clear the slot?
7. Did you accidentally treat `@slot` as a URL segment?
8. Does a route group or intercepting matcher change route-segment counting?
9. Is an error/loading boundary scoped inside the slot or outside it?

Most parallel-route bugs become understandable once you separate **soft-navigation memory** from **hard-navigation reconstruction**.

## Interview questions

**Does `@analytics` appear in the URL?**  
No. It is a named slot for layout composition, not a URL segment.

**What is `children` in a parallel-route layout?**  
The implicit default slot for the normal route branch.

**Why does `default.tsx` exist?**  
To define what a slot renders after a hard load when Next.js cannot recover that slot's prior active state from the URL.

**Why can a modal remain open after navigating elsewhere?**  
Soft navigation preserves unmatched slot state. The modal slot should match a route that renders `null` when the modal should close.

**When should you use Parallel Routes instead of components?**  
When screen regions need independent routing behavior, loading/error boundaries, or route-state preservation—not simply because they are displayed next to each other.

## Official references

- https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes
- https://nextjs.org/docs/app/api-reference/file-conventions/default

Next: **Intercepting Routes & Route-Driven Modals**.