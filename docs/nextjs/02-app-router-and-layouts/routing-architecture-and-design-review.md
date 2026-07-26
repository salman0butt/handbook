---
title: Routing Architecture & Design Review
description: Apply App Router conventions to real architecture decisions, failure modes, debugging, and senior-level route-tree reviews.
---

# Routing Architecture & Design Review

Knowing every routing convention is not enough. Senior Next.js work is deciding **which convention should own which responsibility** and keeping the route tree understandable as the product grows.

This chapter turns the Phase 2 primitives into an architecture review method.

## The route tree is an executable architecture map

Given:

```text
app/
├── layout.tsx
├── (public)/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── pricing/
│   │   └── page.tsx
│   └── blog/
│       └── [slug]/
│           └── page.tsx
└── (product)/
    ├── layout.tsx
    └── dashboard/
        ├── _components/
        ├── loading.tsx
        ├── error.tsx
        ├── page.tsx
        ├── projects/
        │   └── [projectId]/
        │       ├── not-found.tsx
        │       └── page.tsx
        └── @activity/
            ├── default.tsx
            └── page.tsx
```

You can infer important behavior before reading implementation code:

- public and product routes are logically grouped
- both still share the top-level root document
- product chrome is scoped to one route group
- dashboard owns loading/error fallback
- project detail is dynamic and owns missing-resource UI
- activity is a named parallel slot
- route-local implementation can live in `_components`

A good route tree communicates product structure.

## Review dimension 1: URL design

Start with public URLs, not folders.

Ask:

- Which URLs are user-facing contracts?
- Which identifiers belong in the path?
- Which values belong in query parameters instead?
- Which routes should be bookmarkable?
- Which routes require hierarchical catch-all paths?
- Are route group names accidentally being treated as URL prefixes?

Example:

```text
/projects/[projectId]/issues/[issueId]
```

communicates resource hierarchy better than:

```text
/[...slug]
```

with custom parsing.

Prefer explicit route shapes when the domain is explicit.

## Review dimension 2: shared UI ownership

For every layout, ask:

> Which descendant routes genuinely share this UI and should preserve it across navigation?

A dashboard sidebar belongs at the dashboard branch.

A project switcher may belong at the project-area branch.

A billing tab bar belongs at billing.

The root layout should own only truly document/global concerns.

### Smell: root layout with pathname branches

If the root layout contains many route checks, the filesystem likely is not expressing route ownership clearly enough.

Prefer nested layouts or route groups.

## Review dimension 3: persistence vs reset

For shared UI, classify state:

```text
Should preserve across sibling routes → layout
Should intentionally reset on segment change → template
```

Do not add `template.tsx` until you can name the state/effect/DOM identity that should reset.

Do not move everything into a persistent layout just to avoid rerenders.

Route identity should match product identity.

## Review dimension 4: failure ownership

For every branch, identify:

- expected not-found cases
- unexpected failures
- slow work
- slot recovery on hard reload

Then place:

- `loading.tsx`
- `error.tsx`
- `not-found.tsx`
- `default.tsx`

at the narrowest useful boundary.

### Too broad

A root `loading.tsx` that replaces the entire app for one slow dashboard query.

### Better

A dashboard or slot-level loading boundary that keeps useful navigation/UI interactive.

## Review dimension 5: soft vs hard navigation

Advanced App Router behavior often changes depending on navigation type.

Always test both:

### Soft navigation

- `<Link>` or router-driven client transition
- shared layouts can persist
- parallel slots preserve active subpages
- intercepting routes can render contextual overlays

### Hard navigation

- direct URL
- refresh
- external entry
- cross-root-layout document load

Hard navigation must reconstruct state from the URL and route tree.

This is why:

- `default.tsx` matters
- intercepted routes need real full-page destinations
- multiple roots create full reload boundaries

If a feature only works after arriving through one exact client-navigation sequence, it is usually not robust enough.

## Review dimension 6: dynamic parameter trust

Every dynamic segment is untrusted input.

```text
/organisations/[organisationId]/projects/[projectId]
```

requires more than TypeScript.

Review:

1. parameter shape validation
2. resource existence
3. tenant relationship
4. current user's membership
5. action-level permission
6. cache isolation later in the data layer

Never make this assumption:

```text
URL says organisation A
therefore user can access organisation A
```

Routing locates resources. Authorization proves access.

## Review dimension 7: route complexity budget

Not every UI needs an advanced router feature.

### Use ordinary components when

- content is simply displayed together
- modal state is transient
- no deep link is needed
- no independent route state exists

### Use Parallel Routes when

- independently navigable regions matter
- regions need independent loading/error boundaries
- slot state should persist across soft navigation
- intercepted overlays need a composition target

### Use Intercepting Routes when

- a destination needs contextual presentation during soft navigation
- the same URL must work as a full page on direct entry

Architecture is choosing the simplest routing primitive that preserves product semantics.

# Case study: SaaS dashboard

Requirements:

- marketing home and pricing
- authenticated dashboard
- project detail routes
- activity panel that can fail independently
- project detail drawer that is shareable
- settings pages under each project

Possible structure:

```text
app/
├── layout.tsx
├── (marketing)/
│   ├── layout.tsx
│   ├── page.tsx
│   └── pricing/
│       └── page.tsx
└── (app)/
    ├── layout.tsx
    └── dashboard/
        ├── layout.tsx
        ├── page.tsx
        ├── @activity/
        │   ├── default.tsx
        │   ├── error.tsx
        │   └── page.tsx
        ├── @drawer/
        │   ├── default.tsx
        │   ├── [...catchAll]/
        │   │   └── page.tsx
        │   └── (.)projects/
        │       └── [projectId]/
        │           └── page.tsx
        └── projects/
            ├── page.tsx
            └── [projectId]/
                ├── layout.tsx
                ├── not-found.tsx
                ├── page.tsx
                └── settings/
                    └── page.tsx
```

This is only one design, but it illustrates how primitives compose.

## Why not separate root layouts here?

Marketing and product have different shells, but a shared top-level root can keep transitions in one document tree.

If the organisation intentionally wanted hard document transitions between those experiences, multiple roots might be appropriate.

The routing decision should follow product behavior rather than aesthetics alone.

# Case study: documentation platform

Requirements:

- deeply nested docs paths
- one docs shell
- arbitrary nested slugs
- missing pages return route-specific not-found UI

Possible structure:

```text
app/
└── docs/
    ├── layout.tsx
    ├── not-found.tsx
    └── [[...slug]]/
        └── page.tsx
```

An optional catch-all makes `/docs` and nested documentation paths part of one route model.

This is a good use of catch-all routing because the domain itself is a hierarchical content tree.

# Case study: ecommerce product quick view

Requirements:

- product cards on `/shop`
- clicking a product opens a quick-view modal
- product URL is shareable
- refresh shows full product page
- Back closes quick view

Route-driven modal fit:

```text
app/
├── shop/
│   └── page.tsx
├── products/
│   └── [productId]/
│       └── page.tsx
└── @modal/
    ├── default.tsx
    ├── [...catchAll]/
    │   └── page.tsx
    └── (...)products/
        └── [productId]/
            └── page.tsx
```

The exact interception matcher depends on the logical route-segment relationship. Count segments, not filesystem folders.

# Route-tree anti-patterns

## One catch-all as the entire application

```text
app/[[...path]]/page.tsx
```

then custom dispatch logic for every product area.

This throws away much of the App Router's explicit architecture.

Use it only when the domain truly requires open-ended paths.

## Route groups as imaginary URL namespaces

```text
(admin)/users
```

does not produce `/admin/users`.

If `/admin` belongs in the URL, create an `admin` segment.

## Parallel routes for simple grid layout

Two dashboard cards do not automatically need two route slots.

Routing primitives are for navigation/state boundaries, not CSS layout.

## Templates used to “fix stale state”

A remount can hide an ownership bug. Determine whether state should reset before forcing identity reset.

## Missing hard-navigation tests

An intercepted modal that works only after clicking from a feed is incomplete if the shared URL fails on refresh.

## Missing slot defaults

Parallel routes need deliberate hard-load fallback states. Production builds should catch these issues before deployment.

# Debugging route mismatches

When the wrong UI renders, build a route table.

Example:

| Path | Expected page | Layouts | Slots | Special behavior |
| --- | --- | --- | --- | --- |
| `/` | home | root + marketing | modal default | normal |
| `/dashboard` | dashboard | root + product + dashboard | activity | normal |
| `/projects/123` | project | root + product | drawer when intercepted | dynamic param |

Then test each path by:

- direct browser entry
- refresh
- `<Link>` navigation
- Back
- Forward
- opening in new tab

This exposes soft/hard differences quickly.

# Debugging filesystem confusion

Mark every folder as one of:

```text
URL segment
Dynamic URL segment
Route group
Private folder
Parallel slot
Intercepting route matcher
Ordinary colocated directory
```

If the team cannot classify the tree confidently, simplify it.

# Build-time validation matters

Some App Router mistakes surface most reliably in a production build:

- conflicting routes
- invalid special-file combinations
- missing required parallel slot defaults
- route typing failures
- unsupported module usage

A healthy workflow includes:

```bash
npm run build
```

on every pull request.

Development navigation is not sufficient validation for route architecture.

# Design review checklist

Before approving a routing PR, ask:

## URLs

- Are public URLs stable and understandable?
- Are dynamic values named for domain meaning?
- Is a catch-all actually necessary?

## Layouts

- Is shared UI owned by the narrowest correct segment?
- Does persistent state match product expectations?
- Are multiple roots intentional?

## Templates

- Can the author name exactly what should reset?
- Would explicit state modelling be simpler?

## Groups/private folders

- Are route groups used for organization/layout scope rather than fake URL prefixes?
- Are private folders treated as organization, not security?

## Route states

- Are loading/error/not-found boundaries scoped correctly?
- Do missing resources differ from unexpected failures?

## Parallel routes

- Is independent routing really needed?
- Are all named slot defaults defined?
- Is soft-navigation state preservation understood?

## Interception

- Does the destination work as a full page?
- Is the matcher based on route segments?
- Do Back, Forward, refresh, and direct entry behave correctly?

## Security

- Are params validated?
- Is authorization enforced at server/data boundaries?
- Could tenant IDs cross scopes?

## Operations

- Does `next build` pass?
- Are production-only route failures covered by tests?

# Phase 2 milestone project

Build a dashboard with:

```text
/dashboard
/dashboard/projects
/dashboard/projects/[projectId]
/dashboard/projects/[projectId]/settings
```

Requirements:

1. Root site layout.
2. Dashboard nested layout.
3. Dynamic project route using async `params`.
4. Route-specific `not-found.tsx` for missing projects.
5. Dashboard `loading.tsx` and `error.tsx` with appropriate scope.
6. A route group used for organization without changing URLs.
7. A private `_components` or `_lib` folder.
8. A Parallel Route for activity or notifications with `default.tsx`.
9. A route-driven project preview or login modal using interception.
10. Full-page destination works on refresh/direct entry.
11. Back/Forward behavior is correct.
12. Production build passes.

## Explain your architecture

You should be able to whiteboard:

```text
URL
→ matching route segments
→ layouts
→ template identity if present
→ named slots
→ page
→ loading/error/not-found boundaries
→ hard vs soft navigation behavior
```

If you can explain the route branch before looking at runtime code, your routing mental model is becoming senior-level.

# Phase 2 interview drill

**Why is the App Router better understood as a tree than a page list?**  
Because nested segments compose layouts, route state boundaries, dynamic params, and slots along the selected branch. The rendered screen is the composition of that tree, not only one page file.

**What is the biggest architectural cost of multiple root layouts?**  
Cross-root navigation becomes a full page load because the document root changes.

**What is the most common mistake with Intercepting Routes?**  
Counting filesystem folders instead of route segments, especially when a parallel `@slot` is involved.

**Why must advanced routing be tested with refresh and direct URLs?**  
Soft navigation can preserve in-memory layout/slot context that does not exist during hard navigation. A robust route must reconstruct a valid UI from the URL and its hard-load fallbacks.

**When is a Parallel Route justified?**  
When a screen region needs routing semantics—independent navigation, loading/error state, slot persistence, or contextual interception—not simply because multiple components are visible.

## Official references

- https://nextjs.org/docs/app/getting-started/layouts-and-pages
- https://nextjs.org/docs/app/api-reference/file-conventions
- https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes
- https://nextjs.org/docs/app/api-reference/file-conventions/intercepting-routes

Phase 2 is complete when you can design, debug, and explain these route relationships without relying on trial and error.

Next phase: **Navigation & URL State**.