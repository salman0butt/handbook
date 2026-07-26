---
title: Route Tree, Pages & Layouts
description: Build the correct mental model for App Router segments, pages, nested layouts, root layouts, and route composition.
---

# Route Tree, Pages & Layouts

The App Router is easiest to understand as a **route tree** rather than a collection of pages.

Folders define route segments. Special files attach behavior and UI to those segments. Next.js composes the matching branch of the tree for each request or navigation.

```text
app/
├── layout.tsx
├── page.tsx
├── dashboard/
│   ├── layout.tsx
│   ├── page.tsx
│   └── settings/
│       └── page.tsx
└── products/
    └── [id]/
        └── page.tsx
```

The URL `/dashboard/settings` selects the branch:

```text
root layout
└── dashboard layout
    └── dashboard/settings page
```

That composition model drives routing, loading UI, error boundaries, data ownership, navigation behavior, and architecture throughout the App Router.

## A folder is a segment, not automatically a route

Creating a folder does not by itself make a public page.

```text
app/
└── dashboard/
    ├── components/
    │   └── chart.tsx
    └── page.tsx
```

`dashboard` is a route segment because it participates in the route tree. The route becomes publicly reachable because the segment contains `page.tsx`.

Regular files can be colocated safely inside `app/`; only Next.js special file conventions participate in routing behavior.

## `page.tsx` makes a route reachable

A page is the leaf UI for a route.

```tsx
// app/dashboard/page.tsx
export default function DashboardPage() {
  return <h1>Dashboard</h1>
}
```

This exposes `/dashboard`.

Pages are Server Components by default. Later phases cover when a page should contain Client Components and how data fetching interacts with rendering and caching.

### Pages are route-specific

Given:

```text
app/
├── page.tsx
├── dashboard/
│   ├── page.tsx
│   └── settings/
│       └── page.tsx
```

The mapping is:

| File | URL |
| --- | --- |
| `app/page.tsx` | `/` |
| `app/dashboard/page.tsx` | `/dashboard` |
| `app/dashboard/settings/page.tsx` | `/dashboard/settings` |

Think **segment tree → page at the selected branch**, not “file name becomes URL.”

## `layout.tsx` wraps descendants

A layout defines shared UI for its segment and descendants.

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dashboard-shell">
      <aside>Navigation</aside>
      <main>{children}</main>
    </div>
  )
}
```

Both `/dashboard` and `/dashboard/settings` render inside this layout.

Conceptually:

```tsx
<RootLayout>
  <DashboardLayout>
    <SettingsPage />
  </DashboardLayout>
</RootLayout>
```

The actual framework implementation is more sophisticated, but this tree is the useful public mental model.

## Nested layouts are cumulative

Layouts compose from outer to inner.

```text
app/
├── layout.tsx                   # site shell
└── dashboard/
    ├── layout.tsx               # dashboard shell
    └── billing/
        ├── layout.tsx           # billing shell
        └── invoices/
            └── page.tsx
```

For `/dashboard/billing/invoices`:

```text
Site shell
└── Dashboard shell
    └── Billing shell
        └── Invoices page
```

This is a major architecture primitive. Put shared concerns at the narrowest segment that truly owns them.

Good examples:

- top-level brand chrome in the root layout
- dashboard navigation in `dashboard/layout.tsx`
- billing tabs in `billing/layout.tsx`
- route-specific content in `page.tsx`

A common mistake is putting everything in the root layout because it is globally available. That increases coupling and makes route boundaries less meaningful.

## The root layout

Every rendered route must ultimately be under a root layout. In the common single-root setup, that is `app/layout.tsx`.

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

A root layout must provide `<html>` and `<body>`.

Do not manually build document metadata with a custom `<head>` in the root layout. Next.js provides the Metadata API, covered later in this handbook.

## Layout persistence and partial navigation

One of the App Router's most important behaviors is that shared layouts can persist across client-side navigations.

If the user moves from:

```text
/dashboard/overview
```

to:

```text
/dashboard/settings
```

Next.js can preserve the shared dashboard layout while replacing the changed route branch.

This matters because persistent layout UI can retain browser-side state and does not behave like a component that is recreated for every child page transition.

Do not translate this into the oversimplified rule “layouts never run again.” Server rendering, cache invalidation, hard reloads, different root layouts, and other boundaries matter. The useful application-level rule is:

> A layout represents persistent shared route UI; a template represents remounting shared route UI.

The next chapter makes that distinction precise.

## Layouts should not depend on mutable URL details they cannot observe correctly

Persistent layouts are not the right place for every piece of navigation state.

For example, query-string-driven filters normally belong in the page or a Client Component using the navigation APIs rather than in a Server Component layout that you expect to update on every client navigation.

Similarly, when a component needs the current pathname, selected segment, or search parameters in the browser, use the purpose-built navigation APIs rather than trying to infer them from the layout's initial render.

Phase 3 covers URL state in depth.

## Route ownership

A strong App Router structure answers this question:

> Which segment owns this UI, data requirement, loading state, failure boundary, and permission boundary?

For a SaaS dashboard:

```text
app/
├── layout.tsx
├── (public)/
│   ├── page.tsx
│   └── pricing/
│       └── page.tsx
└── dashboard/
    ├── layout.tsx
    ├── page.tsx
    ├── projects/
    │   ├── page.tsx
    │   └── [projectId]/
    │       └── page.tsx
    └── settings/
        └── page.tsx
```

The dashboard segment can own dashboard chrome. The project segment can own project-scoped UI. A dynamic project segment can own project-specific validation and data.

This vertical ownership is usually easier to evolve than one global layout with route-name conditionals.

## Colocation is not URL exposure

This is safe:

```text
app/
└── dashboard/
    ├── page.tsx
    ├── chart.tsx
    ├── queries.ts
    ├── schema.ts
    └── styles.module.css
```

The supporting files do not become `/dashboard/chart`, `/dashboard/queries`, or `/dashboard/schema` routes.

Private folders such as `_components` can make intent clearer, but they are an organizational tool rather than a requirement for safe colocation.

## Route tree exercise

Given:

```text
app/
├── layout.tsx
├── page.tsx
├── account/
│   ├── layout.tsx
│   ├── page.tsx
│   └── security/
│       └── page.tsx
└── help/
    └── page.tsx
```

Answer before reading further:

1. Which layouts wrap `/account/security`?
2. Does `account/layout.tsx` wrap `/help`?
3. Which file exposes `/account`?
4. Can `account/security/page.tsx` be a Server Component by default?

Answers:

1. `app/layout.tsx` and `app/account/layout.tsx`.
2. No.
3. `app/account/page.tsx`.
4. Yes.

## Common mistakes

### Treating every folder as a public route

Folders organize segments, but a reachable UI route needs the relevant special file, normally `page.tsx`.

### Putting route-specific UI in the root layout

This creates conditionals and global coupling. Move shared UI to the narrowest route segment that owns it.

### Rebuilding layout behavior manually

Do not create a page wrapper pattern when a nested layout expresses the route relationship directly.

### Assuming “Server Component” means “static page”

Component execution location and rendering/caching strategy are different dimensions. A Server Component can participate in dynamic rendering.

### Assuming a layout is a global application singleton

The route tree, navigation type, and root-layout boundaries determine behavior. Treat persistence as a routing property, not a general React singleton guarantee.

## Senior mental model

When reviewing an App Router tree, ask:

- Which URL segment does each folder represent?
- Which files expose leaf routes?
- Which shared UI belongs to each layout?
- Which state must persist across sibling navigation?
- Which state must reset?
- Are unrelated product areas accidentally coupled by a shared layout?
- Would a route group express organization more clearly?
- Would multiple root layouts intentionally create a document boundary?
- Are failure and loading boundaries located close to the work they represent?

The filesystem is not merely project organization. In the App Router it is part of the application's execution architecture.

## Interview questions

**Why does Next.js use nested layouts instead of one global wrapper?**  
Nested layouts attach shared UI to route ownership. They let different branches preserve the UI they share without forcing unrelated routes through the same shell.

**Does every folder under `app/` become a URL?**  
No. Some folders are organizational conventions, and regular colocated files are not routes. A route becomes reachable through routing conventions such as `page.tsx`.

**What is the key difference between a page and a layout?**  
A page is route-specific leaf UI. A layout wraps its descendant route branch and is designed to persist across matching client navigations.

**Where should dashboard navigation live?**  
Usually in the nearest layout shared by dashboard routes, not in every page and not automatically in the root layout.

## Official references

- https://nextjs.org/docs/app/getting-started/layouts-and-pages
- https://nextjs.org/docs/app/api-reference/file-conventions/layout
- https://nextjs.org/docs/app/api-reference/file-conventions/page

Next: **Layouts, Templates & State Preservation**.