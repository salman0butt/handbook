---
title: Pathname, Params & Active Navigation
description: Use usePathname, useParams, and selected-layout-segment hooks to build active navigation, breadcrumbs, tabs, and route-aware UI.
---

# Pathname, Params & Active Navigation

Navigation UIs often need to know where the user is:

- which sidebar item is active
- which tab is selected
- which breadcrumb should render
- which dynamic resource identifier is in the route
- which child segment is active inside a layout or parallel slot

App Router exposes several Client Component hooks for these jobs. They overlap, but they answer different questions.

## Choose the smallest routing signal

```text
Need full current pathname?
  → usePathname()

Need dynamic route values?
  → useParams()

Need the active child segment below a layout?
  → useSelectedLayoutSegment()

Need the active descendant segments below a layout?
  → useSelectedLayoutSegments()
```

Do not reach for the full URL when a route segment is the actual domain signal.

## `usePathname()`

```tsx
'use client'

import { usePathname } from 'next/navigation'

export function CurrentPath() {
  const pathname = usePathname()
  return <span>{pathname}</span>
}
```

For:

```text
/dashboard/projects?status=open
```

`usePathname()` returns:

```text
/dashboard/projects
```

It does not include the query string.

## Active navigation

A simple sidebar can compare links against the pathname.

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/projects', label: 'Projects' },
  { href: '/dashboard/settings', label: 'Settings' },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Dashboard">
      {items.map((item) => {
        const active = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
```

`aria-current="page"` gives assistive technology the same active-route information as the visual styling.

## Exact vs prefix matching

This looks convenient:

```ts
pathname.startsWith('/dashboard/projects')
```

but prefix matching can create false positives:

```text
/dashboard/projects
/dashboard/projects-old
```

Prefer segment-aware or delimiter-aware matching.

```ts
function isWithin(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}
```

Even better, if your navigation corresponds to layout segments, use the selected-segment hooks rather than rebuilding route parsing manually.

## Why pathname is client-only

Reading the current pathname in a Server Component is intentionally not supported through `usePathname`.

Persistent layouts are designed to remain mounted across client navigations. A route-aware Client Component can update as the URL changes without forcing the entire server layout to be re-fetched solely to learn the pathname.

This is an example of a Client Component being part of the architecture, not an optimization failure.

## Rewrites and hydration

A subtle case appears when the server prerenders content for one pathname while a rewrite causes the browser to display another pathname.

If the rendered HTML contains pathname-dependent text, the client may see a different value after routing initializes.

Safer pattern:

- keep server-rendered output stable
- isolate the pathname-dependent UI in a small Client Component
- update after mount if the rewrite can produce a mismatch

Do not make a large layout depend on browser pathname just to show one active item.

## Cache Components note

With `cacheComponents: true`, `usePathname()` can require a Suspense boundary in routes with dynamic params when the param value is not known during prerendering.

If `generateStaticParams` supplies the relevant values, that boundary may not be required for the same reason.

This is a version-sensitive interaction; caching/rendering depth belongs in Phase 6.

## `useParams()`

Use `useParams()` when a Client Component needs dynamic route values.

```tsx
'use client'

import { useParams } from 'next/navigation'

export function ProductToolbar() {
  const params = useParams<{ productId: string }>()

  return <span>Product: {params.productId}</span>
}
```

For:

```text
app/products/[productId]/page.tsx
URL: /products/abc-123
```

App Router returns conceptually:

```ts
{ productId: 'abc-123' }
```

For a catch-all route, the value is an array.

```text
app/docs/[...slug]/page.tsx
URL: /docs/react/hooks
```

```ts
{ slug: ['react', 'hooks'] }
```

In the App Router, `useParams()` returns an object and does not use the Pages Router's initial `null` compatibility behavior.

## Server page params vs `useParams`

Server Component page:

```tsx
export default async function Page({
  params,
}: {
  params: Promise<{ productId: string }>
}) {
  const { productId } = await params
  return <Product productId={productId} />
}
```

Client child:

```tsx
'use client'

import { useParams } from 'next/navigation'

export function ClientProductControls() {
  const { productId } = useParams<{ productId: string }>()
  // interactive UI
}
```

Do not convert a whole page to a Client Component just because one interactive child needs route params.

## Params are not validated domain data

This:

```ts
const { organisationId } = useParams<{ organisationId: string }>()
```

proves only that the route contains a string.

It does not prove:

- the organisation exists
- the identifier format is valid
- the current user belongs to that organisation
- the resource is safe to expose

Authorization remains server-side.

## `useSelectedLayoutSegment()`

This hook answers a more local question:

> Which route segment is active directly below this layout boundary?

A Client Component imported into a layout can use it for tabs.

```tsx
'use client'

import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

export function SettingsTabs() {
  const segment = useSelectedLayoutSegment()

  return (
    <nav aria-label="Settings sections">
      <Link
        href="/settings/profile"
        aria-current={segment === 'profile' ? 'page' : undefined}
      >
        Profile
      </Link>
      <Link
        href="/settings/security"
        aria-current={segment === 'security' ? 'page' : undefined}
      >
        Security
      </Link>
    </nav>
  )
}
```

This is often cleaner than comparing global pathname strings.

## `useSelectedLayoutSegments()`

Use the plural hook when you need descendant route context.

```tsx
'use client'

import { useSelectedLayoutSegments } from 'next/navigation'

export function BreadcrumbSegments() {
  const segments = useSelectedLayoutSegments()

  return (
    <ol>
      {segments.map((segment) => (
        <li key={segment}>{segment}</li>
      ))}
    </ol>
  )
}
```

From the root layout:

```text
/dashboard/settings/security
```

can produce a descendant segment array such as:

```ts
['dashboard', 'settings', 'security']
```

From a deeper layout, only the segments below that layout are returned.

## Route Groups can appear in selected segments

The selected-segment hooks reflect route-tree structure, and Route Groups can appear in returned values.

A group is represented with parentheses in the filesystem, so UI that converts raw segments into user-facing breadcrumbs may need to exclude group segments.

Do not assume every returned segment should be printed directly to users.

## Catch-all behavior

For catch-all routes, the plural selected-segment hook can return the catch-all match as a joined segment value rather than one array entry per URL slash.

If your breadcrumb UX requires logical hierarchy inside a catch-all CMS/docs path, model that hierarchy deliberately instead of assuming filesystem hook output equals product taxonomy.

## Parallel route slots

Both selected-layout-segment APIs can accept a parallel route key.

Conceptually:

```tsx
const authSegment = useSelectedLayoutSegment('auth')
```

This lets a layout inspect the active segment within a named slot such as `@auth`.

Phase 2 covered slot routing semantics; Phase 3 uses the hook as route-aware UI state.

## Breadcrumb architecture

There are two common approaches.

### URL-derived breadcrumb

Useful for simple predictable routes:

```text
/projects/acme/settings
→ Projects / acme / Settings
```

### Domain-derived breadcrumb

Better when route IDs are not user-facing labels:

```text
/projects/p_42/settings
```

should probably display:

```text
Projects / Payments Redesign / Settings
```

not:

```text
Projects / p_42 / Settings
```

Route hooks give structure. Domain data gives meaning.

## Route-aware UI should not become authorization UI

Hiding a navigation item is useful UX:

```tsx
{canSeeAdmin && <Link href="/admin">Admin</Link>}
```

But hiding a link is not access control.

A user can navigate directly to `/admin`.

The destination must authorize independently.

## Avoid duplicating server route state in React state

Bad:

```tsx
const pathname = usePathname()
const [activePath, setActivePath] = useState(pathname)
```

unless you have a real independent state transition to model.

For ordinary active navigation, pathname/segment hooks are already the source of truth.

Duplicating them creates synchronization bugs.

## Common mistakes

### Parsing `window.location.pathname` everywhere

Use the App Router hooks in reactive UI instead of building a parallel routing abstraction.

### Using query state to infer route params

Path params and search params have different semantics. Keep them separate.

### Marking active navigation visually only

Use `aria-current` where appropriate.

### Turning layouts into Client Components unnecessarily

A small route-aware client child can live inside a Server Component layout.

### Treating route IDs as trusted resource ownership

Route values are input. Authorization requires server-side proof.

## Debugging checklist

If active navigation is wrong:

1. Log the exact `pathname`.
2. Check whether query strings are being incorrectly included in your comparison logic.
3. Check exact vs prefix matching.
4. Check Route Groups.
5. Check whether you need local selected-segment state instead of global pathname state.
6. For parallel routes, verify the slot key.
7. For dynamic routes, inspect the `useParams()` value shape.
8. For rewrites, investigate server/client pathname mismatch.

## Interview questions

**What is the difference between `usePathname` and `useParams`?**  
`usePathname` returns the current pathname string; `useParams` returns filled dynamic route parameters.

**Why use `useSelectedLayoutSegment` instead of parsing the pathname for tabs?**  
It expresses the route-tree relationship directly at the layout boundary and avoids brittle global string parsing.

**Can `usePathname` run in a Server Component?**  
No. It is a Client Component hook by design.

**Does hiding an admin link based on route-aware client state secure `/admin`?**  
No. Authorization must be enforced at the protected server/resource boundary.

## Exercise

Build `/settings/profile`, `/settings/security`, and `/settings/billing` with:

- a Server Component settings layout
- a small Client Component tab bar using `useSelectedLayoutSegment()`
- `aria-current`
- a nested breadcrumb component
- one dynamic route using `useParams()` in an interactive child

Explain why none of the route-aware UI logic is considered authorization.
