---
title: Layouts, Templates & State Preservation
description: Understand persistent layouts, remounting templates, state reset, effect re-synchronization, and route-level UI ownership.
---

# Layouts, Templates & State Preservation

`layout.tsx` and `template.tsx` look similar because both wrap route content. Their navigation behavior is intentionally different.

Use the distinction to control **what persists** and **what resets** as users move through the route tree.

## Layouts persist shared route UI

A layout wraps a route segment and its descendants.

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section>
      <DashboardNav />
      {children}
    </section>
  )
}
```

During client-side navigation between child routes that share this layout, Next.js preserves the shared layout branch rather than treating the whole document as a fresh page.

This makes layouts a strong fit for:

- navigation shells
- sidebars
- persistent toolbars
- providers scoped to a product area
- shared route chrome
- stable controls that should not reset between sibling pages

## Templates deliberately remount

A template also wraps children, but Next.js gives a template instance a route-dependent key.

```tsx
// app/dashboard/template.tsx
export default function Template({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
```

Conceptually:

```tsx
<Layout>
  <Template key={routeParam}>{children}</Template>
</Layout>
```

The key is managed by Next.js. You do not provide it yourself.

At the template's own segment level, changing that segment, including its dynamic parameter, causes the template and its descendants to remount. Navigating only within deeper descendant segments does not remount a higher template. Search-parameter changes do not trigger template remounting.

## Why remounting matters

Remounting changes React lifecycle behavior.

A Client Component inside a template can:

- reset local state
- run mount effects again
- recreate DOM nodes
- restart an animation
- reset an uncontrolled form field
- reinitialize a third-party widget

Example:

```tsx
'use client'

import { useEffect, useState } from 'react'

export function DraftTitle() {
  const [title, setTitle] = useState('')

  useEffect(() => {
    console.log('mounted')
  }, [])

  return (
    <input
      value={title}
      onChange={(event) => setTitle(event.target.value)}
    />
  )
}
```

Placed under a persistent layout, the component may preserve state across matching route transitions. Placed under a template that remounts for that transition, its state starts again from the initial value.

## Layout vs template decision rule

Ask one question:

> Should the shared UI keep its client-side identity across this navigation?

Use a **layout** when the answer is yes.

Use a **template** when the answer is intentionally no.

### Layout examples

- dashboard sidebar
- music player that should continue while changing dashboard pages
- product-area context provider
- navigation state that should remain open

### Template examples

- route-transition animation that must replay
- analytics effect that intentionally runs on each segment change
- form workflow that should reset when the dynamic resource changes
- Suspense behavior that should show fallback again for each relevant navigation

## Templates and Suspense

A subtle use case for templates is changing the default behavior of Suspense boundaries inside shared route UI.

A persistent layout can preserve an already-resolved boundary while users navigate below it. A template remounts its subtree at the relevant segment boundary, so Suspense inside the template can present its fallback again when that template remounts.

Do not add a template merely because a loading spinner is not appearing. First decide whether remounting the whole template subtree is actually the product behavior you want.

## State reset is a feature, not a fix

Avoid using templates as a generic workaround for stale state.

If state should update when a value changes, model the dependency correctly.

Bad reasoning:

```text
The component shows old data.
→ Force the whole route subtree to remount.
```

Better reasoning:

```text
What owns the state?
What should preserve identity?
What input changed?
Should this be derived state, URL state, server data, or local state?
```

Templates are appropriate when **identity reset itself** is the desired behavior.

## Layouts and data

Layouts can be Server Components and can perform server work. But persistent navigation semantics mean you should be careful about putting rapidly changing URL-dependent assumptions into a layout.

For example, a layout should not rely on a `searchParams` value that you expect to change on every client navigation. Pages and Client Component navigation hooks are better suited to those values.

A layout can receive dynamic route `params` relevant to its segment, and modern Next.js exposes those params asynchronously.

```tsx
// app/teams/[teamId]/layout.tsx
export default async function TeamLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ teamId: string }>
}) {
  const { teamId } = await params

  return (
    <section>
      <TeamHeader teamId={teamId} />
      {children}
    </section>
  )
}
```

The dynamic-routes chapter covers this contract in depth.

## Typed layouts with `LayoutProps`

Current Next.js can generate globally available route-aware helpers during `next dev`, `next build`, or `next typegen`.

For a known route, `LayoutProps` can describe `children`, `params`, and named parallel slots.

```tsx
export default function Layout(props: LayoutProps<'/dashboard'>) {
  return (
    <section>
      {props.children}
      {props.analytics}
    </section>
  )
}
```

If `app/dashboard/@analytics` exists, the generated type can expose `analytics` as a typed slot prop.

This is useful in large applications because the filesystem and TypeScript contract stay aligned.

## Root-layout responsibilities

A root layout is the document-level owner for its route tree.

Typical responsibilities:

- `<html>` and `<body>`
- global styles
- site-wide providers that truly need global scope
- shared top-level UI
- framework metadata configuration through the Metadata API

Avoid turning the root layout into a universal service locator.

If only dashboard routes need a provider, prefer:

```text
app/dashboard/layout.tsx
```

over placing it in:

```text
app/layout.tsx
```

Narrow provider scope can reduce coupling and client work.

## Multiple root layouts

The App Router can have more than one root layout. This is useful when application sections genuinely represent different document shells.

Example:

```text
app/
├── (marketing)/
│   ├── layout.tsx
│   └── page.tsx
└── (app)/
    ├── layout.tsx
    └── dashboard/
        └── page.tsx
```

If there is no root `app/layout.tsx`, each top-level layout can act as a root for its branch and therefore must provide `<html>` and `<body>`.

A crucial consequence:

> Navigating between different root layouts causes a full page load rather than preserving the same client navigation tree.

That makes multiple roots an architectural boundary, not just a styling convenience.

## Root layout under a dynamic segment

A root layout may exist under a dynamic segment, which is useful for structures such as locale-prefixed applications:

```text
app/
└── [lang]/
    ├── layout.tsx
    └── page.tsx
```

The layout can receive the dynamic parameter asynchronously and build the document for that branch.

## Layout composition over pathname conditionals

Avoid this pattern:

```tsx
// conceptual anti-pattern
if (pathname.startsWith('/dashboard')) {
  return <DashboardShell>{children}</DashboardShell>
}

if (pathname.startsWith('/shop')) {
  return <ShopShell>{children}</ShopShell>
}
```

Prefer route-tree composition:

```text
app/
├── dashboard/
│   ├── layout.tsx
│   └── ...
└── shop/
    ├── layout.tsx
    └── ...
```

The filesystem now expresses the ownership directly.

## Debugging state that unexpectedly persists

When state remains after navigation, inspect:

1. Is the stateful component inside a shared layout?
2. Did the route transition keep the same layout segment?
3. Is the state actually local React state, URL state, or server data?
4. Should identity reset, or should the component react to changed inputs?
5. Would moving the component to a narrower route branch solve the ownership problem?
6. Is a template genuinely appropriate?

## Debugging state that unexpectedly resets

Check:

1. Is there a `template.tsx` above the component?
2. Did a dynamic parameter at that template's segment change?
3. Did navigation cross root-layout boundaries?
4. Is React identity changing because of an explicit `key`?
5. Is the component being conditionally removed and recreated?

Do not blame “Next.js rerendering” before identifying the exact identity boundary.

## Architecture example

For an editor:

```text
app/
└── projects/
    ├── layout.tsx
    └── [projectId]/
        ├── template.tsx
        ├── page.tsx
        └── settings/
            └── page.tsx
```

Possible intent:

- `projects/layout.tsx` preserves project-area navigation.
- `[projectId]/template.tsx` resets editor-local client state when moving from project A to project B.
- navigation from a project's main page to that project's settings remains within the same project template identity because only the deeper segment changed.

Whether this is correct depends on product requirements, but the route tree makes the reset boundary explicit.

## Common mistakes

### Using templates everywhere

That discards one of the major benefits of nested layouts: persistent shared UI.

### Using layouts for route-transition effects

If an effect must restart for each relevant segment transition, a persistent layout may be the wrong ownership boundary.

### Expecting search params to remount a template

Current template behavior is tied to its segment identity, not search-parameter changes.

### Putting global state in a root layout by default

A provider in a root layout may force a broader Client Component boundary than necessary. Scope it to the route branch that needs it.

## Interview questions

**What is the difference between `layout.tsx` and `template.tsx`?**  
Both wrap route content, but layouts are designed to persist across matching navigations, while templates receive framework-managed keys and remount when their segment identity changes.

**When would you choose a template?**  
When resetting subtree identity is intentional: reset local state, rerun mount effects, recreate DOM, replay transitions, or re-show Suspense fallback at that segment boundary.

**Do search-param changes remount templates?**  
No. Current template remounting is based on the template's route segment identity, including dynamic params at that level.

**What happens when navigating between different root layouts?**  
Next.js performs a full page load because the navigation crosses document-root boundaries.

## Official references

- https://nextjs.org/docs/app/api-reference/file-conventions/layout
- https://nextjs.org/docs/app/api-reference/file-conventions/template

Next: **Dynamic Segments & Async Params**.