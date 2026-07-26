---
title: Route Groups, Private Folders & Multiple Roots
description: Organize App Router projects without changing URLs, create scoped layouts, and understand multiple root-layout boundaries.
---

# Route Groups, Private Folders & Multiple Roots

Not every folder in `app/` should become part of the public URL.

Next.js gives you two important organizational conventions:

- **Route Groups**: `(group)` — participate in route organization and layout composition without adding a URL segment.
- **Private Folders**: `_folder` — opt a subtree out of routing so it is clearly internal implementation code.

These solve different problems.

## Route Groups

A route group wraps a folder name in parentheses:

```text
app/
├── (marketing)/
│   ├── page.tsx
│   └── pricing/
│       └── page.tsx
└── (app)/
    └── dashboard/
        └── page.tsx
```

The public URLs are:

```text
/
/pricing
/dashboard
```

The group names do not appear in the URL.

## Why route groups exist

Route groups are useful when filesystem organization and URL hierarchy are not the same thing.

Common reasons:

- group routes by product area
- group routes by team ownership
- attach a layout to only part of a URL hierarchy
- create multiple root layouts
- scope loading/error boundaries without adding a URL segment
- keep large route trees understandable

## Grouping by product area

```text
app/
├── (marketing)/
│   ├── page.tsx
│   ├── pricing/
│   │   └── page.tsx
│   └── blog/
│       └── page.tsx
├── (account)/
│   ├── profile/
│   │   └── page.tsx
│   └── billing/
│       └── page.tsx
└── dashboard/
    └── page.tsx
```

This expresses domain structure without forcing URLs such as `/marketing/pricing` or `/account/profile`.

## Route groups can own layouts

```text
app/
├── layout.tsx
├── (marketing)/
│   ├── layout.tsx
│   ├── page.tsx
│   └── pricing/
│       └── page.tsx
└── (product)/
    ├── layout.tsx
    └── dashboard/
        └── page.tsx
```

The root layout wraps everything.

The marketing group layout wraps `/` and `/pricing`.

The product group layout wraps `/dashboard`.

This avoids pathname-based conditionals in one giant root layout.

## Conflicting public paths

Because group names disappear from URLs, two filesystem routes can accidentally target the same public path.

Invalid structure:

```text
app/
├── (marketing)/
│   └── about/
│       └── page.tsx
└── (shop)/
    └── about/
        └── page.tsx
```

Both resolve to:

```text
/about
```

Next.js cannot treat them as two different routes merely because their group names differ.

A route group is not a namespace for public URL identity.

## Opting only some routes into a layout

Suppose `/account` and `/cart` should share shop chrome, while `/checkout` should not.

You can model that directly:

```text
app/
├── (shop)/
│   ├── layout.tsx
│   ├── account/
│   │   └── page.tsx
│   └── cart/
│       └── page.tsx
└── checkout/
    └── page.tsx
```

The group lets routes share layout behavior without inserting `/shop` into their URLs.

## Scoping a loading boundary with a group

Imagine:

```text
app/dashboard/
├── loading.tsx
├── page.tsx
├── invoices/
│   └── page.tsx
└── customers/
    └── page.tsx
```

A loading convention at the dashboard segment affects the route subtree below it.

If only the dashboard overview should own that fallback, you can group the overview:

```text
app/dashboard/
├── (overview)/
│   ├── loading.tsx
│   └── page.tsx
├── invoices/
│   └── page.tsx
└── customers/
    └── page.tsx
```

The URL for the overview remains `/dashboard`.

The group changes route-tree organization, not the URL.

## Multiple root layouts

A large application can have different root layouts for different route branches.

```text
app/
├── (marketing)/
│   ├── layout.tsx
│   └── page.tsx
└── (shop)/
    ├── layout.tsx
    └── cart/
        └── page.tsx
```

If there is no `app/layout.tsx`, these group layouts can become root layouts for their branches.

Each root layout must include the document shell:

```tsx
export default function MarketingRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="marketing">{children}</body>
    </html>
  )
}
```

## Multiple roots create a navigation boundary

This is an important production behavior:

> Navigating between routes that use different root layouts causes a full page load.

For example:

```text
/(marketing) → /pricing
/(shop)      → /cart
```

Moving from `/pricing` to `/cart` crosses root-layout trees.

Do not create multiple root layouts merely because two sections use different colours. A nested layout is usually enough for visual differences.

Use multiple roots when separate document shells are genuinely desirable.

## The home route with multiple roots

If you remove top-level `app/layout.tsx`, the `/` page must still belong to a branch with a root layout.

Example:

```text
app/
├── (marketing)/
│   ├── layout.tsx
│   └── page.tsx       # /
└── (product)/
    ├── layout.tsx
    └── dashboard/
        └── page.tsx   # /dashboard
```

The marketing root owns the home document.

## Root layout under a dynamic segment

You can also create a root under a dynamic segment:

```text
app/
└── [lang]/
    ├── layout.tsx
    └── page.tsx
```

This is useful for locale-prefixed applications such as:

```text
/en
/fr
/de
```

The root layout can consume the dynamic `lang` parameter and emit the document for that locale branch.

Internationalization architecture is covered later; the routing fact is that a root does not have to sit directly at `app/layout.tsx`.

## Private folders

A private folder begins with an underscore:

```text
app/dashboard/
├── _components/
│   ├── chart.tsx
│   └── sidebar.tsx
├── _lib/
│   └── queries.ts
└── page.tsx
```

The `_components` and `_lib` subtrees are excluded from routing.

This convention makes intent explicit:

```text
This folder is implementation detail, not a route segment.
```

## Colocation does not require private folders

This is already safe:

```text
app/dashboard/
├── chart.tsx
├── queries.ts
├── schema.ts
└── page.tsx
```

Regular files do not become routes.

So why use `_components`?

- communicate intent to humans
- separate route conventions from internal modules
- avoid collisions with future framework special-file names
- keep editor trees organised
- establish a consistent large-project convention

Private folders are primarily an organization tool, not a security boundary.

## Private folders are not security

Putting code under `_private` does not protect data.

Example:

```text
app/_server/admin.ts
```

The underscore says “not a route.” It does not automatically guarantee:

- server-only execution
- authorization
- secret protection
- safe bundle boundaries

Use server-only modules, environment-variable rules, authorization, and framework execution boundaries for security.

Folder names do not replace trust boundaries.

## URLs that need a leading underscore

Because `_folder` is a routing convention, a URL segment that literally starts with `_` needs special handling.

The official project-structure guidance documents `%5F` as the encoded form for a segment that should begin with an underscore.

This is uncommon in application design, but important when migrating legacy URL contracts.

## Route group vs private folder

Use this table:

| Requirement | Route Group `(group)` | Private Folder `_folder` |
| --- | ---: | ---: |
| Hide folder name from URL | Yes | Folder is not routed |
| Participate in layout hierarchy | Yes | No route segment of its own |
| Organise route branches | Yes | Usually implementation code |
| Create multiple root layouts | Yes | No |
| Scope route special files | Yes | No route subtree |
| Mark internal code | Sometimes | Yes |

A route group is still part of route architecture.

A private folder is excluded from routing.

## Organising by feature

A practical large-app structure:

```text
app/
├── (public)/
│   ├── layout.tsx
│   ├── page.tsx
│   └── pricing/
│       └── page.tsx
└── (product)/
    ├── layout.tsx
    └── dashboard/
        ├── _components/
        ├── _lib/
        ├── page.tsx
        ├── projects/
        │   └── [projectId]/
        │       └── page.tsx
        └── settings/
            └── page.tsx
```

Here:

- groups express route ownership
- layouts express shared UI boundaries
- private folders express internal implementation
- dynamic segments express URL parameters

Each convention has one job.

## Common mistakes

### Treating route groups as URL prefixes

`(admin)/users` resolves to `/users`, not `/admin/users`.

If you need `/admin/users`, use an actual `admin` segment.

### Creating groups that collide

Two groups cannot publish separate pages to the same public path.

### Creating multiple roots for styling only

That introduces full document navigations between branches. Use nested layouts for most styling/product-shell differences.

### Treating private folders as secret

They stop routing, not data leaks or client bundling by themselves.

### Creating a `_components` folder at every segment automatically

Use organizational conventions when they improve clarity. Do not create empty architecture ceremony.

## Architecture decision exercise

Requirements:

- `/` and `/pricing` use marketing chrome.
- `/dashboard` and `/settings` use product chrome.
- product routes need internal route-local components.
- transitions between marketing and product should remain client navigations if possible.

Better fit:

```text
app/
├── layout.tsx
├── (marketing)/
│   ├── layout.tsx
│   ├── page.tsx
│   └── pricing/
│       └── page.tsx
└── (product)/
    ├── layout.tsx
    ├── dashboard/
    │   ├── _components/
    │   └── page.tsx
    └── settings/
        └── page.tsx
```

Why keep a top-level root layout? Because the requirement says marketing ↔ product should remain within one document/navigation root when possible.

## Interview questions

**What is a Route Group?**  
A parenthesized folder that participates in route organization/layout composition but is omitted from the public URL.

**Can two route groups each define `/about`?**  
No. Group names do not namespace URLs, so both routes would conflict.

**Why use a private folder if regular files can already be colocated?**  
To make internal implementation intent explicit, keep route trees clearer, and avoid convention-name collisions.

**What is the cost of multiple root layouts?**  
Navigation across different roots causes a full page load rather than staying in the same client navigation tree.

**Is `_server` a security boundary?**  
No. Private folders are routing/organization conventions, not authorization or bundle-security guarantees.

## Official references

- https://nextjs.org/docs/app/api-reference/file-conventions/route-groups
- https://nextjs.org/docs/app/getting-started/project-structure
- https://nextjs.org/docs/app/api-reference/file-conventions/layout

Next: **Loading, Error, Not-Found & Default Files**.