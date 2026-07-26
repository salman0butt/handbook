---
title: Server Components by Default & Rendering Model
description: Understand the App Router server-first component model, RSC payload, initial HTML, hydration, and subsequent navigation.
---

# Server Components by Default & Rendering Model

The App Router starts from a server-first assumption:

> Pages and layouts are Server Components by default. Add client capability only where interactivity or browser APIs are required.

This is not merely a syntax choice. It changes where code executes, what can be imported, what JavaScript reaches the browser, how data is accessed, and how a route is delivered.

## Server Component does not mean Server Function

A common mistake is to write:

```tsx
'use server'

export default function Page() {
  return <h1>Dashboard</h1>
}
```

That is the wrong mental model.

A normal App Router page is already a Server Component by default:

```tsx
export default function Page() {
  return <h1>Dashboard</h1>
}
```

`'use server'` belongs to **Server Functions**, which are covered later in the mutations phase. It is not how you declare a Server Component.

## Why Server Components exist

Server Components are useful when UI needs capabilities that belong on the server:

- database or ORM access
- internal services
- API keys and credentials
- filesystem/server resources
- request-time server data
- reducing browser JavaScript
- streaming server-rendered work

Example:

```tsx
import 'server-only'
import { db } from '@/lib/db'

export default async function CustomersPage() {
  const customers = await db.customer.findMany()

  return (
    <ul>
      {customers.map((customer) => (
        <li key={customer.id}>{customer.name}</li>
      ))}
    </ul>
  )
}
```

No browser-side database SDK is required for this page.

## Server-first route tree

A route can be mostly server-rendered while containing small interactive islands:

```text
Server Page
├── Server Header
├── Server Product Grid
│   ├── Server Product Card
│   └── Client AddToCartButton
└── Server Footer
```

Only the interactive component needs to enter the client module graph.

This is usually preferable to making the whole route a Client Component just because one button needs state.

## Initial request delivery model

For a full page load, think in three artifacts:

```text
Server Components
      ↓
RSC Payload
      ↓
HTML + references to Client Components
      ↓
browser receives page
      ↓
HTML shown quickly
      ↓
RSC payload reconciles tree
      ↓
Client Component JavaScript hydrates interactive regions
```

The important distinction is that Server Components are not sent to the browser as executable component JavaScript.

Their rendered result contributes to the React Server Component payload.

## The RSC payload

The RSC payload is React's server-to-client representation of the rendered component tree.

Conceptually, it contains:

- rendered Server Component output
- references to Client Component modules
- placement information for Client Components
- props crossing from server to client

Do not think of it as normal JSON or as an HTML replacement.

The route may involve both:

```text
HTML
  → immediate document preview

RSC payload
  → React tree reconciliation and later navigation updates
```

The rendering internals phase goes deeper. Here, the important architectural rule is that Server Components produce a transportable rendered tree rather than shipping their component implementation to the browser.

## Client Components can still appear in initial HTML

Another common misconception:

> Client Component = client-side-rendered only.

That is false.

On an initial page load, Next.js can prerender Client Components as part of the HTML response. The browser then hydrates them with their JavaScript.

So these are separate questions:

```text
Is this a Client Component?
        ≠
Was it represented in server-rendered HTML?
```

A Client Component means that its interactive implementation participates in the client module graph and can execute in the browser.

## Hydration applies to Client Components

Hydration is React attaching interactive behavior to the server-produced HTML.

```text
server-produced HTML
      ↓
browser paints content
      ↓
client JS loads
      ↓
React attaches event handlers/stateful behavior
```

Server Components themselves do not hydrate in the same sense because their implementation is not shipped as browser JavaScript.

Client Components hydrate because their code must execute in the browser.

## Subsequent navigation

During App Router client navigation, the browser does not need a brand-new document for every route.

Conceptually:

```text
<Link> navigation
      ↓
Next.js obtains/prefetches RSC payload
      ↓
preserved layouts remain mounted where appropriate
      ↓
new route tree is reconciled
      ↓
Client Components execute on client
```

This is why App Router navigation can preserve shared layouts and interactive state while still obtaining new server-rendered tree data.

## Server Components may be asynchronous

Server Components can naturally await server work:

```tsx
export default async function Page() {
  const user = await getCurrentUser()
  const projects = await getProjects(user.id)

  return <ProjectList projects={projects} />
}
```

This does not imply that all server data should be fetched sequentially.

The data-fetching phase will cover waterfalls, parallelism, preload patterns, and caching.

At this stage, remember:

> Server Components can directly own server-side data dependencies instead of forcing every read through a browser API layer.

## Avoid internal HTTP hops from Server Components

Suppose your Next.js application owns the database access layer.

Less efficient pattern:

```text
Server Component
  ↓ fetch('/api/projects')
Route Handler
  ↓
database
```

Often better:

```text
Server Component
  ↓
shared server data function
  ↓
database
```

Example:

```tsx
import { getProjects } from '@/lib/projects'

export default async function Page() {
  const projects = await getProjects()
  return <ProjectList projects={projects} />
}
```

Route Handlers are valuable HTTP boundaries. They are not required merely because a Server Component needs your own backend data.

## Secrets stay on the server only if code stays on the server

Server Components allow code like:

```ts
const token = process.env.INTERNAL_API_TOKEN
```

but that does not mean every module imported by a Server Component is automatically safe forever.

Modules can later be imported from a client boundary accidentally.

Use explicit server-only boundaries for sensitive server modules. That pattern is covered later in this phase.

## Server Component capabilities are not a security policy

A page running on the server does not automatically mean the request is authorized.

Unsafe:

```tsx
export default async function Page({ params }) {
  const { projectId } = await params
  const project = await db.project.findUnique({ where: { id: projectId } })

  return <Project project={project} />
}
```

The route parameter is untrusted input.

The server must still enforce:

- authentication
- tenant scope
- resource authorization
- validation

Server execution gives you a trusted environment for enforcing policy. It does not create the policy for you.

## What Server Components cannot do

A Server Component cannot use browser-only runtime capabilities such as:

```ts
window
localStorage
navigator.geolocation
```

It also cannot use interactive client state/effect APIs such as the usual `useState` / `useEffect` model.

When the UI needs those capabilities, introduce a Client Component boundary.

## Keep data close to the owner

Example route:

```text
app/products/[id]/page.tsx
```

If the page needs product data and an interactive favourite button:

```tsx
import FavouriteButton from './favourite-button'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(id)

  return (
    <article>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <FavouriteButton productId={product.id} initial={product.favourited} />
    </article>
  )
}
```

The server owns the product read.

The client owns the interactive favourite state.

That is a useful boundary because each side owns the capability it needs.

## Performance mental model

Moving a component to the server can reduce browser JavaScript, but server work still has cost.

Do not reason:

```text
Server Component
  → free
```

Reason:

```text
Server Component
  → no component JS shipped to browser
  → but may create server compute/data/network work
```

Later phases cover caching and performance measurement.

## Debugging execution location

When a bug appears, first classify where the failing code executes.

```text
build?
server render?
client hydration?
client event?
subsequent navigation?
```

Useful signals:

- server logs appear in terminal/server logs
- browser logs appear in DevTools
- `window is not defined` usually means browser-only code executed in a server-capable context
- hydration mismatch means server-produced markup and client render expectations differ
- missing interactivity may mean the needed subtree never crossed a client boundary

## Production review checklist

For each route ask:

- Which components truly need browser JavaScript?
- Is database/API access happening directly on the server where appropriate?
- Are secrets isolated in server-only modules?
- Are dynamic route values validated and authorized?
- Is the client boundary smaller than the feature area?
- Does the route rely on unnecessary internal HTTP requests?
- Are initial-load and client-navigation behavior both tested?

## Interview questions

**Are pages and layouts Client Components by default in App Router?**  
No. They are Server Components by default.

**Do you add `'use server'` to create a Server Component?**  
No. `'use server'` marks Server Functions. Server Components are the default where no client boundary applies.

**Are Client Components only rendered in the browser?**  
No. They may be represented in prerendered HTML on the initial load and then hydrated.

**What is the RSC payload?**  
React's transport representation of the rendered Server Component tree, including references to Client Components and values crossing the boundary.

**Why can Server Components reduce browser JavaScript?**  
Their component implementation does not need to execute in the browser.

## Exercise

Build `/account` with:

- a Server Component page
- server-side user lookup
- server-rendered account summary
- one Client Component button that toggles a local details panel
- no route handler for the server-owned account read

Then explain which code executes on the server, which executes in the browser, what hydrates, and what data crosses the boundary.
