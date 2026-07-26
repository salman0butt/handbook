---
title: Third-Party Libraries & Browser-Only Code
description: Integrate client-only packages, providers, dynamic imports, browser APIs, and library boundaries without collapsing server-first architecture.
---

# Third-Party Libraries & Browser-Only Code

Not every React package was designed with Server Components in mind.

Some libraries:

- call `useState` or `useEffect`
- access `window` / `document`
- require DOM measurement
- create context providers
- assume browser globals during module evaluation
- ship large client bundles

App Router can still use them, but you need an intentional client boundary.

## The wrapper pattern

Suppose a package exports a carousel that uses client state but does not expose the correct client boundary itself.

Create your own wrapper:

```tsx
'use client'

import { Carousel } from 'acme-carousel'

export default Carousel
```

Then use it from a Server Component:

```tsx
import Carousel from './carousel'

export default async function GalleryPage() {
  const images = await getImages()

  return <Carousel images={images} />
}
```

This makes the environment contract explicit.

## Why wrappers are useful

A wrapper can own:

- `'use client'`
- browser-only package imports
- provider setup
- prop normalization
- lazy loading
- error handling
- accessibility adapters
- bundle isolation

It also keeps the rest of your app independent from the package's environment quirks.

## Do not mark the page client-side just to satisfy one library

Bad:

```tsx
'use client'

import { FancyChart } from 'chart-library'

export default function AnalyticsPage() {
  // whole page now enters client graph
}
```

Better:

```tsx
import AnalyticsChart from './analytics-chart'

export default async function AnalyticsPage() {
  const summary = await getSummary()

  return (
    <main>
      <ServerSummary summary={summary} />
      <AnalyticsChart data={summary.chart} />
    </main>
  )
}
```

Only `AnalyticsChart` needs the client boundary.

## Browser APIs during render

This is unsafe even inside a Client Component:

```tsx
'use client'

export function Width() {
  return <p>{window.innerWidth}</p>
}
```

Why?

Client Components can be prerendered during initial delivery.

Safer:

```tsx
'use client'

import { useEffect, useState } from 'react'

export function Width() {
  const [width, setWidth] = useState<number | null>(null)

  useEffect(() => {
    setWidth(window.innerWidth)
  }, [])

  return <p>{width ?? 'Measuring…'}</p>
}
```

The initial render remains server-safe.

## When `ssr: false` is appropriate

Some libraries fundamentally cannot render outside a browser because they access DOM APIs during import or render.

Use a Client Component boundary and lazy-load it:

```tsx
'use client'

import dynamic from 'next/dynamic'

const BrowserEditor = dynamic(() => import('./browser-editor'), {
  ssr: false,
})

export function EditorShell() {
  return <BrowserEditor />
}
```

Current App Router guidance is important here:

> `ssr: false` is supported for Client Components. Do not try to use `next/dynamic(..., { ssr: false })` directly from a Server Component.

Move that dynamic declaration behind a client boundary.

## `ssr: false` is not a generic hydration fix

If a component has a hydration mismatch, disabling SSR may hide the symptom while removing useful server-rendered HTML.

First ask:

- Is the initial render deterministic?
- Is browser-only state read too early?
- Is locale/time/randomness causing divergence?
- Is invalid HTML changing the DOM?
- Is a third-party library mutating markup before hydration?

Use client-only rendering only when the component truly requires it.

## Lazy-load expensive client features

Examples:

- rich text editor
- map
- chart builder
- PDF viewer
- code editor
- 3D renderer

If the user may never open the feature, do not necessarily put its JavaScript in the initial bundle.

```tsx
'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

const AdvancedEditor = dynamic(() => import('./advanced-editor'), {
  loading: () => <p>Loading editor…</p>,
})

export function EditorLauncher() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)}>Edit</button>
      {open ? <AdvancedEditor /> : null}
    </>
  )
}
```

## Server Components are already code-split differently

Do not copy a client SPA mental model onto Server Components.

Current Next.js guidance treats Server Components as automatically code-split by route/segment behavior.

Lazy loading is mainly a browser JavaScript concern for Client Components and client libraries.

## Current caveat when dynamically importing Client Components from Server Components

If a Server Component dynamically imports a Client Component, do not assume you receive the same automatic client code-splitting behavior as when the dynamic import is owned inside a Client Component.

When bundle splitting matters, test the production output rather than relying on intuition.

## Package providers

A third-party provider often needs client state/context:

```tsx
'use client'

import { VendorProvider } from 'vendor-sdk'

export function VendorProviders({ children }: { children: React.ReactNode }) {
  return <VendorProvider>{children}</VendorProvider>
}
```

Then:

```tsx
export default function Layout({ children }: { children: React.ReactNode }) {
  return <VendorProviders>{children}</VendorProviders>
}
```

The layout stays server-side.

## Library authors should publish correct client entry points

If you build a component library, mark interactive entry points with `'use client'`.

Example package structure:

```text
@company/ui
├── button.tsx            ← server-compatible
├── typography.tsx        ← server-compatible
├── date-picker.tsx       ← 'use client'
└── combobox.tsx          ← 'use client'
```

Do not mark the entire library client-side if only a few exports need browser capabilities.

Also verify your package bundler preserves the directive. Some build pipelines strip module directives unless configured correctly.

## Shared utility packages need environment discipline

A utility package may be imported from both graphs.

Safe shared examples:

```ts
export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(value)
}
```

Environment-specific examples:

```text
readSessionCookie     → server
localStorageAdapter   → client
queryDatabase         → server
observeResize         → client
```

Separate them instead of creating one ambiguous “utils” package.

## Client-only libraries and secrets

Never configure a browser package with a server secret:

```tsx
'use client'

const sdk = createSdk({
  secret: process.env.INTERNAL_SECRET,
})
```

Client code is not a secure secret-storage environment.

If the SDK needs privileged credentials, place that operation behind a trusted server boundary.

## `NEXT_PUBLIC_` means public to the browser

Values prefixed with `NEXT_PUBLIC_` are intentionally bundled for browser use.

Treat them as public identifiers/configuration, not secrets.

Examples that may be public depending on service design:

```text
public analytics ID
public maps token with restricted scope
auth client identifier
```

Examples that should remain server-side:

```text
database URL
private API key
admin credential
signing secret
```

## DOM-dependent library debugging

Symptom:

```text
ReferenceError: window is not defined
```

Check:

1. Does the package access `window` during module import?
2. Is it imported by a Server Component?
3. Is it imported beneath a client boundary but still prerendering?
4. Can the browser call move into `useEffect`?
5. Does the library genuinely require `ssr: false`?

## Hydration mismatch from third-party libraries

Potential causes:

- random IDs generated differently server/client
- locale/time output differs
- DOM is mutated before React hydrates
- browser extension changes markup
- package uses `window.innerWidth` during render
- package emits invalid HTML

Wrap only the problematic package. Do not disable SSR for the whole page.

## Bundle audit

When adding a client library, measure:

```text
initial JS
route JS
lazy chunk size
hydration time
interaction latency
```

Questions:

- Could the feature be server-rendered?
- Could a smaller package do the job?
- Could it load on demand?
- Does the dependency include locales/polyfills you do not need?
- Is the provider global unnecessarily?

## Production architecture example

```text
Server Analytics Page
├── Server KPI summary
├── Server table
├── Client DateRangeFilter
└── Client ChartShell
      └── lazy ChartLibrary
```

This is usually stronger than:

```text
Client Analytics Page
└── everything including server-fetchable content
```

## Interview questions

**How do you use a third-party component that requires hooks but lacks `'use client'`?**  
Wrap it in your own Client Component and import that wrapper from Server Components.

**Does `'use client'` make `window` safe in render?**  
No. Client Components can be prerendered on the server for initial delivery.

**When should you use `ssr: false`?**  
For a genuinely browser-only Client Component that cannot be prerendered safely. It should be declared behind a Client Component boundary.

**Should a whole page become client-side because a chart library needs the DOM?**  
Usually no. Isolate the chart behind a Client Component.

**What should library authors do?**  
Mark interactive client entry points explicitly and ensure the bundler preserves those directives.

## Exercise

Integrate a browser-only chart library into a server-rendered analytics page.

Requirements:

- page and KPI summary stay Server Components
- chart wrapper is a Client Component
- heavy chart code loads lazily
- no server secret crosses into the chart
- direct page load works with JavaScript delayed
- production bundle impact is measured

Document why you chose prerendered client rendering vs `ssr: false` for the chart library.
