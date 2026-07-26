---
title: use client & the Client Module Graph
description: Learn what the use client directive actually does, how the client graph expands, and how to place boundaries deliberately.
---

# `use client` & the Client Module Graph

`'use client'` does not mean “render this file only in the browser.”

It declares a **module graph boundary**.

```tsx
'use client'

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount((value) => value + 1)}>{count}</button>
}
```

Once a file is marked `'use client'`, that file becomes an entry point into the client module graph.

Its imports are considered part of that client graph unless the framework can prove they are not needed there.

## The boundary mental model

Think in graphs, not individual files:

```text
Server graph
├── page.tsx
├── product-list.tsx
├── lib/products.ts
└── interactive-filter.tsx   ← 'use client'
      ├── filter-state.ts
      ├── filter-utils.ts
      └── ui/dropdown.tsx
```

The directive is placed once at the client entry point.

You do not need to repeat `'use client'` in every imported child component.

## A directive changes import consequences

Suppose this file is client-bound:

```tsx
'use client'

import { DashboardShell } from './dashboard-shell'
```

If `dashboard-shell.tsx` imports:

```ts
import { formatMoney } from '@/lib/money'
import { hugeChartLibrary } from 'huge-chart-library'
```

then those dependencies may become client-bundle concerns too.

This is why moving `'use client'` upward can silently increase browser JavaScript.

## Keep the boundary close to interactivity

Less efficient architecture:

```tsx
'use client'

export default function ProductPage() {
  return (
    <>
      <Header />
      <ProductDescription />
      <Specifications />
      <Reviews />
      <AddToCart />
    </>
  )
}
```

If only `AddToCart` needs browser state, move the boundary down:

```tsx
export default async function ProductPage() {
  const product = await getProduct()

  return (
    <>
      <Header />
      <ProductDescription product={product} />
      <Specifications product={product} />
      <Reviews productId={product.id} />
      <AddToCart productId={product.id} />
    </>
  )
}
```

```tsx
// add-to-cart.tsx
'use client'

import { useState } from 'react'

export function AddToCart({ productId }: { productId: string }) {
  const [quantity, setQuantity] = useState(1)
  // ...
}
```

The route remains server-first while the interactive island gets client capability.

## What belongs in Client Components

Use a Client Component when the subtree needs capabilities such as:

- event handlers
- local state
- effects
- browser APIs
- client-side navigation hooks
- client-only libraries
- client context consumption/providers
- browser-side subscriptions

Examples:

```tsx
'use client'

import { useEffect, useState } from 'react'

export function OnlineStatus() {
  const [online, setOnline] = useState(true)

  useEffect(() => {
    const update = () => setOnline(navigator.onLine)
    update()

    window.addEventListener('online', update)
    window.addEventListener('offline', update)

    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [])

  return <span>{online ? 'Online' : 'Offline'}</span>
}
```

## Do not make a component client-only because it receives a Client Component

A Server Component can render a Client Component normally:

```tsx
import SearchBox from './search-box'

export default function Header() {
  return (
    <header>
      <Logo />
      <SearchBox />
    </header>
  )
}
```

`Header` does not need `'use client'` merely because it imports `SearchBox`.

That is one of the central composition strengths of App Router.

## Client Components still receive server-rendered props

```tsx
export default async function Page() {
  const profile = await getProfile()

  return <ProfileEditor initialName={profile.name} />
}
```

```tsx
'use client'

export function ProfileEditor({ initialName }: { initialName: string }) {
  const [name, setName] = useState(initialName)
  // ...
}
```

The server may prepare the initial data, then the client owns interaction state.

## Browser-only APIs belong behind a client boundary

Bad:

```tsx
export default function Page() {
  const theme = localStorage.getItem('theme')
  return <div>{theme}</div>
}
```

The component may execute in a server context where `localStorage` does not exist.

Better:

```tsx
'use client'

import { useEffect, useState } from 'react'

export function ThemeLabel() {
  const [theme, setTheme] = useState<string | null>(null)

  useEffect(() => {
    setTheme(localStorage.getItem('theme'))
  }, [])

  return <span>{theme ?? 'default'}</span>
}
```

Or, if the value should be server-readable and request-aware, reconsider whether it belongs in cookies or server data rather than `localStorage`.

## Client boundary does not create authorization

A button can hide itself:

```tsx
'use client'

export function DeleteButton({ canDelete }: { canDelete: boolean }) {
  if (!canDelete) return null
  return <button>Delete</button>
}
```

That is useful UX, but it is not the security boundary.

The server must re-check authorization when the deletion is attempted.

Never trust:

- hidden buttons
- disabled controls
- route visibility
- client props
- client state

as proof of permission.

## Avoid shipping server libraries through accidental imports

A dangerous graph:

```text
'use client' component
   ↓
shared helper
   ↓
server database module
```

Even if the build blocks some cases, the architecture is wrong.

Split helpers by environment responsibility:

```text
lib/
├── shared/
│   └── formatting.ts
├── server/
│   └── projects.ts
└── client/
    └── browser-storage.ts
```

Use `server-only` / `client-only` markers where environment mistakes would be costly.

## One large client boundary vs several small ones

This:

```text
Client Dashboard
├── sidebar
├── header
├── charts
├── table
├── filters
└── footer
```

may ship much more JS than necessary.

A more deliberate tree:

```text
Server Dashboard
├── Server Sidebar
├── Server Header
├── Server Summary
├── Client Filters
├── Client Chart
└── Server Table
```

The right answer is not “always make boundaries tiny.”

Too many artificially fragmented boundaries can also make data flow harder to reason about.

Choose boundaries around real interaction ownership.

## Client Components and third-party dependencies

If an interactive Client Component imports a large browser library, that dependency becomes a client-delivery concern.

```tsx
'use client'

import HeavyEditor from 'heavy-editor'
```

Ask:

- Is the editor needed on initial load?
- Can it be lazy-loaded?
- Is there a smaller package?
- Can the rest of the page remain server-rendered?

Bundle cost belongs to the architectural decision, not to a later “performance cleanup.”

## Client Components and prerendering

Do not assume the browser is the only place a Client Component's render function matters.

On initial routes, Client Components can be prerendered into HTML before hydration.

That means code in render must still be safe for server prerendering unless you intentionally use a client-only loading strategy.

Bad:

```tsx
'use client'

export function Width() {
  return <div>{window.innerWidth}</div>
}
```

The `'use client'` directive alone does not make direct render-time `window` access safe for server prerendering.

Prefer effect-driven browser reads or a deliberately client-only dynamic component where justified.

## Client-only dynamic rendering is an exception, not the default

For a browser-only third-party component:

```tsx
'use client'

import dynamic from 'next/dynamic'

const BrowserEditor = dynamic(() => import('./browser-editor'), {
  ssr: false,
})
```

This can be appropriate when the library fundamentally depends on `window` or `document` during rendering.

But `ssr: false` should not become a reflexive fix for every hydration or environment problem.

It removes server prerendering benefits for that subtree.

## Debugging a boundary problem

Symptoms include:

```text
hook only works in Client Component
window is not defined
module cannot be imported from Client Component
non-serializable prop error
unexpectedly large client bundle
hydration mismatch
```

Debug in this order:

1. Find the nearest `'use client'` ancestor.
2. Trace its imports.
3. Identify which module first requires browser capability.
4. Move the boundary down if possible.
5. Remove server-only dependencies from the client graph.
6. Verify values crossing the boundary are serializable.
7. Test a production build.

## Boundary review checklist

For every `'use client'` file ask:

- Which exact capability requires this boundary?
- Could the parent remain server-side?
- Which dependencies now enter the client graph?
- Are any secrets or server modules reachable through imports?
- Are props crossing the boundary minimal and serializable?
- Does this component need to hydrate on first load?
- Could a heavy library be lazy-loaded?
- Is permission still enforced on the server?

## Interview questions

**What does `'use client'` do?**  
It declares a boundary into the client module graph. The file and its imported dependencies become client-side concerns, and its exported components can be used from Server Components as client entry points.

**Do all child files need `'use client'`?**  
No. Once they are imported beneath a client boundary, they are already in the client graph.

**If a Server Component imports a Client Component, does the Server Component become client-side?**  
No. Server Components can render Client Components directly.

**Why can putting `'use client'` on a root layout be expensive?**  
It can pull a large dependency tree into the client module graph and increase browser JavaScript/hydration work.

**Does `'use client'` make `window` safe during render?**  
Not automatically. Client Components can be prerendered on the server during initial delivery.

## Exercise

Take a dashboard currently implemented as one Client Component and refactor it so:

- the page remains a Server Component
- the sidebar remains server-rendered
- filters are a Client Component
- a chart library is client-only and lazy-loaded if appropriate
- the data table receives server-fetched data
- no database or secret-bearing modules enter the client graph

Then compare the client dependency surface before and after.
