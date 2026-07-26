---
title: Rendering Pipeline, RSC Payload, HTML & Hydration
description: Understand how Next.js renders App Router routes across Server Components, the RSC Payload, HTML, Client Components, and hydration.
---

# Rendering Pipeline, RSC Payload, HTML & Hydration

Rendering in the App Router is not a single operation.

A useful production mental model is:

```text
route tree
  ↓
Server Components render on the server
  ↓
RSC Payload is produced
  ↓
Client Component references + props are encoded
  ↓
HTML is prerendered for the initial browser view
  ↓
browser displays HTML
  ↓
RSC Payload reconciles the React tree
  ↓
Client Component JavaScript hydrates interactivity
```

This chapter separates those layers so debugging does not collapse everything into "SSR".

## The three important artifacts

For an initial App Router page load, think in terms of three related outputs:

```text
1. HTML
2. RSC Payload
3. Client Component JavaScript
```

They have different jobs.

### HTML

HTML gives the browser something useful to display immediately.

It can contain output from:

- Server Components
- prerendered Client Components
- Suspense fallback UI
- cached/static shell content

HTML is **not** the same thing as the React tree state used for later navigation.

### RSC Payload

The React Server Component Payload is the serialized representation of the rendered Server Component tree.

Conceptually it contains:

```text
rendered Server Component results
Client Component placeholders/references
serialized props crossing server → client boundaries
routing/tree information required by React/Next.js
```

Do not treat it as a public JSON API contract.

It is a framework transport format.

### Client JavaScript

Client Component modules are shipped as JavaScript because the browser must execute their interactive behavior.

A Server Component itself does not become client JavaScript merely because its rendered output appears in the browser.

## Server Components render first-class server UI

A page:

```tsx
export default async function Page() {
  const products = await db.product.findMany()

  return (
    <main>
      <h1>Products</h1>
      <ProductList products={products} />
    </main>
  )
}
```

can fetch data and calculate UI on the server.

The database client and query logic do not need to ship to the browser.

The browser receives the rendered result through the framework rendering pipeline.

## Client Components still participate in initial server rendering

`'use client'` does **not** mean:

```text
skip the server
→ blank HTML
→ browser renders everything later
```

On an initial route load, Next.js uses the RSC Payload plus Client Component references to prerender HTML.

Then the browser loads the Client Component JavaScript and hydrates it.

Example:

```tsx
'use client'

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount((value) => value + 1)}>
      {count}
    </button>
  )
}
```

The button can appear before hydration completes.

It becomes interactive once its Client Component code is loaded and hydrated.

## Hydration

Hydration is the process where React attaches client behavior to server-rendered HTML.

Simplified:

```text
server-rendered HTML already visible
        ↓
React reconstructs client-side component ownership
        ↓
event handlers/state/effects become active
```

Hydration is not "rendering HTML from scratch again."

## Hydration mismatch

A mismatch happens when the server-rendered result and the client render do not agree.

Common causes:

```text
Date.now() during render
Math.random() during render
browser-only state used during initial render
locale/timezone divergence
invalid HTML nesting
reading mutable external state differently server vs client
```

Bad:

```tsx
'use client'

export function Clock() {
  return <time>{new Date().toLocaleTimeString()}</time>
}
```

The server and browser may calculate different text.

Better options depend on product semantics:

- render a stable server value
- pass the server timestamp as a prop
- intentionally update after hydration
- isolate client-only behavior where appropriate

Do not suppress hydration warnings until you understand the mismatch.

## Initial page load

For a direct navigation or hard refresh:

```text
browser requests route
      ↓
server resolves/render route
      ↓
HTML + RSC-related response data arrive
      ↓
HTML paints
      ↓
React reconciles using RSC Payload
      ↓
Client bundles hydrate interactive islands
```

This makes the initial experience useful before every Client Component finishes hydrating.

## Client navigation

On navigation through App Router mechanisms such as `<Link>`, Next.js does not need to reload the entire document.

Conceptually:

```text
current React tree
      ↓
navigate to next route
      ↓
fetch/use next RSC Payload
      ↓
React reconciles changed route segments
      ↓
preserved layouts remain mounted where identity allows
```

The RSC Payload becomes especially important here because navigation updates the existing React tree rather than replacing the whole document.

## Hard navigation vs soft navigation

### Hard navigation

A hard navigation loads a new document.

Examples:

```text
address bar navigation
full refresh
external-site navigation
some document-level redirects
```

The browser rebuilds the page from a new HTML document.

### Soft navigation

A soft App Router navigation preserves the current document and updates route state using framework data.

Benefits can include:

- preserved layouts
- preserved client state where tree identity remains
- prefetch reuse
- streaming route updates
- reduced full-document work

## Route segments are rendering units

Next.js splits work around the route tree.

For example:

```text
app/
  layout.tsx
  dashboard/
    layout.tsx
    settings/
      page.tsx
```

During navigation to `/dashboard/settings`, unchanged parent layouts can remain while changed route segments receive new server-rendered payloads.

This is why App Router architecture is closely tied to route-tree architecture.

## Server-to-client serialization

When a Server Component passes props to a Client Component:

```tsx
<ClientChart data={safeChartData} />
```

the prop must cross the RSC boundary.

Therefore it must be serializable by React.

Prefer minimal DTOs:

```ts
const safeChartData = rows.map((row) => ({
  day: row.day,
  total: Number(row.total),
}))
```

Avoid leaking:

```text
ORM objects with unnecessary fields
secrets
authorization metadata
huge object graphs
server-only handles
```

## Rendering and caching are different questions

Ask separately:

```text
Where is this UI rendered?
```

and:

```text
When can the result be reused?
```

A Server Component can be:

- prerendered
- cached
- request-time rendered
- streamed

"Server Component" does not mean "always runs on every request."

Phase 6 owns the cache semantics.

Phase 10 focuses on how the output is delivered and reconciled.

## Rendering and streaming are different questions

Rendering means calculating UI output.

Streaming means delivering chunks before all work is complete.

A route can render on the server without meaningfully streaming if everything completes before the response is sent.

Suspense boundaries allow slow subtrees to complete later.

## Performance model

A senior rendering review separates:

```text
server computation time
I/O waiting time
HTML arrival
RSC chunk arrival
client bundle download
hydration CPU
interaction readiness
```

Do not diagnose "slow rendering" as a single metric.

## Security model

The RSC boundary does not make data automatically safe.

If a Server Component passes sensitive information into a Client Component prop, that information is crossing into browser-visible transport.

Rule:

> Treat every Server → Client prop as data that may be observable by the browser user.

Authorize first, project second, serialize only what the client needs.

## Debugging checklist

When UI differs between hard and soft navigation:

1. Reproduce with a full reload.
2. Reproduce with `<Link>` navigation.
3. Identify which layouts should preserve identity.
4. Inspect Client Component boundaries.
5. Check hydration warnings.
6. Check non-deterministic render values.
7. Check whether stale Router Cache data is involved.
8. Check Suspense/loading boundaries.
9. Compare server logs for initial vs navigation requests.
10. Distinguish HTML output from RSC navigation updates.

## Common mistakes

### "Server Components are SSR"

Too vague. Server Components describe a component/runtime model; prerendering, request rendering, caching, and streaming are separate decisions.

### "Client Components render only in the browser"

False for initial App Router rendering. They can participate in prerendered HTML and then hydrate.

### "Hydration means the browser replaces server HTML"

Incorrect mental model. React attaches/reconciles client behavior against server-rendered output.

### Treating the RSC Payload as a REST API

It is framework transport, not your public API contract.

## Interview questions

**What is the RSC Payload?**  
A framework serialization of rendered Server Component results plus references/props needed to compose Client Components and reconcile the React tree.

**Why does Next.js still send HTML if React can use the RSC Payload?**  
HTML gives a fast browser-visible initial representation, while the RSC Payload and Client Component code establish the React tree and interactivity.

**Does a Client Component skip server rendering?**  
No. On the initial load it can be prerendered into HTML, then hydrated in the browser.

**What is the main difference between initial load and client navigation?**  
Initial load needs a document/HTML representation; client navigation can update the existing React tree using route RSC data while preserving unchanged layout state.

## Exercise

Draw the artifacts and runtime steps for a route containing:

```text
Server layout
Server product page
Client add-to-cart button
Client analytics provider
Suspense-wrapped recommendations
```

For each part identify:

- server render responsibility
- HTML representation
- RSC boundary
- client JavaScript requirement
- hydration requirement
- possible streaming point
