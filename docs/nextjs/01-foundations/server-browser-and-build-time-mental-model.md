---
title: Server, Browser & Build-Time Mental Model
description: Learn to reason about build time, server runtime, Server and Client Components, browser hydration, navigation, secrets, and deployment boundaries.
---

# Server, Browser & Build-Time Mental Model

The most important early Next.js skill is answering:

> **Where can this code execute, when can it execute, and what crosses the boundary afterward?**

If you answer that incorrectly, the resulting bug often looks unrelated: `window is not defined`, leaked secrets, hydration mismatches, stale data, duplicated requests, oversized bundles, or code that works locally and fails after deployment.

## There is not one “runtime”

A Next.js application passes through multiple environments:

```text
Source code
   │
   ▼
BUILD TIME
next build
   │
   ├── compile/analyze route + module graphs
   ├── prepare server/client output
   └── prerender eligible work according to current rendering/cache model
   │
   ▼
DEPLOYMENT OUTPUT
   │
   ▼
SERVER RUNTIME  ◀──── incoming HTTP / navigation requests
   │
   ├── match route
   ├── run required server work
   ├── access data/caches
   └── produce RSC/HTML/HTTP output
   │
   ▼
NETWORK
   │
   ▼
BROWSER
   │
   ├── display HTML
   ├── process RSC/navigation data
   ├── load client bundles
   └── hydrate/run Client Components
```

Not every request performs every step in exactly the same way. Caching, prerendering, streaming, client navigation, and deployment infrastructure can change the path. This is the foundation before those optimizations are introduced.

## Build time

Build time is when `next build` turns source into production output.

Typical responsibilities include:

- compiling/transpiling application code;
- constructing route and module graphs;
- separating server/client output;
- preparing static assets and chunks;
- validating framework conventions;
- type-checking as part of the Next.js production build unless explicitly disabled;
- evaluating work needed for prerendered output under the current route/cache model.

### Build-time values are not automatically runtime values

If your build environment has:

```text
API_ORIGIN=https://staging.example.com
```

and code bakes that value into browser output or prerendered artifacts, changing the server's environment variable later may not rewrite already-built files.

Always ask whether a value is read:

- during compilation/build;
- during a server request;
- when browser JavaScript executes.

This distinction becomes critical in containers and immutable deployments.

## Server runtime

The server runtime handles work that must remain on infrastructure you control.

Depending on the code and deployment model, server-side work can:

- read private environment variables;
- access databases and private services;
- use server-only dependencies;
- inspect request data through documented request APIs;
- render Server Components;
- execute Server Functions;
- execute Route Handlers;
- emit logs/traces;
- participate in server-side caching.

### Server-side does not mean globally persistent

Do not assume an in-memory variable is a durable application database or even that the next request hits the same process.

Production may involve:

- process restarts;
- multiple Node instances;
- containers scaling horizontally;
- serverless invocations;
- provider-managed workers/functions.

Durability and cross-instance coordination require deliberate storage/infrastructure choices.

## Browser runtime

The browser owns interactive user-side behavior such as:

- DOM events;
- `window`, `document`, `navigator`, and browser storage;
- client component state;
- Effects that synchronize with browser/external systems;
- client-side route interactions;
- browser monitoring/analytics.

Code that reaches the browser should be treated as visible to the user.

### Browser code cannot hold secrets

This is unsafe:

```tsx
'use client'

export function PaymentWidget() {
  const secret = process.env.NEXT_PUBLIC_PAYMENT_SECRET
  // ...
}
```

`NEXT_PUBLIC_` explicitly means the value may be bundled for client use. A real secret must stay behind a server-side boundary.

## Server Components

In the App Router, pages and layouts are Server Components by default.

```tsx
// app/projects/page.tsx
export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <main>
      <h1>Projects</h1>
      {/* render project UI */}
    </main>
  )
}
```

A Server Component can perform server-side data work and return React UI without its component implementation becoming interactive browser JavaScript.

But remember:

> **Server Component is an execution/module-graph concept, not a statement that the route is static.**

A Server Component can participate in static/prerendered output or request-time dynamic rendering depending on the route's data and caching behavior.

## Client Components

A Client Component boundary starts with:

```tsx
'use client'

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)

  return <button onClick={() => setCount((value) => value + 1)}>Count: {count}</button>
}
```

Use Client Components for capabilities such as:

- event handlers;
- local state;
- Effects;
- browser-only APIs;
- client-side third-party libraries.

### `'use client'` does not mean “never rendered on the server”

For an initial page load, Client Components can contribute to server-generated HTML. Their JavaScript is then downloaded and hydrated so event handlers/state can work in the browser.

So there are two different questions:

1. **Where is the component module allowed/required to execute?**
2. **How is initial HTML produced and later made interactive?**

Do not collapse them.

## The client boundary affects the module graph

Consider:

```text
ServerPage.tsx
   └── InteractivePanel.tsx   'use client'
          ├── Button.tsx
          └── chart-library
```

The client boundary pulls the modules needed by `InteractivePanel` into the client-side graph.

This is why adding `'use client'` to a top-level layout can be expensive: it can force much more code into the browser graph than a small interactive leaf would.

The practical pattern is:

> Keep server rendering/data ownership high enough to be useful, but push **client boundaries down to the smallest coherent interactive subtree**.

Do not chase the smallest possible component for its own sake; choose maintainable boundaries that reduce unnecessary browser JavaScript.

## Props crossing from server to client

Values passed into Client Components from server-rendered boundaries must be representable across the React Server Component transport boundary.

A useful architectural consequence:

- pass data, identifiers, and serializable configuration;
- do not assume arbitrary server objects, database connections, or secret-bearing modules can cross into browser code.

Later chapters will cover supported value shapes and Server Function references precisely.

## Initial request vs client navigation

A user can reach `/dashboard` two important ways.

### Initial document request

```text
Browser asks for /dashboard
   ↓
Next.js handles route on server
   ↓
React/Next.js produce server output
   ↓
HTML becomes visible
   ↓
client bundles load
   ↓
Client Components hydrate
```

### Client navigation

After the application is loaded, clicking a Next.js `<Link>` can use the App Router's client navigation path rather than performing a traditional full-page document reload.

Conceptually:

```text
Current hydrated app
   ↓
<Link> navigation
   ↓
Next.js obtains needed route/RSC data
   ↓
reuses shared layout state where appropriate
   ↓
updates route tree in a React transition
```

This distinction explains why some bugs appear only on refresh or only during in-app navigation.

## Hydration

Hydration connects server-produced HTML for Client Components with their client-side React behavior.

A mismatch occurs when server-visible output and the client's initial render disagree.

Problematic example:

```tsx
'use client'

export function CurrentWidth() {
  return <p>{window.innerWidth}</p>
}
```

Besides direct server access concerns, browser-only state used during render can cause server/client output divergence.

Better architecture depends on the requirement: CSS may solve responsive layout without JavaScript, or browser-only values can be read after the client is mounted if they genuinely belong to client state.

Next.js 16.2 improved hydration diagnostics by clearly showing server/client diffs in the development overlay, but better error messages do not replace the mental model.

## Request-time data is not build-time data

Imagine a user dashboard:

```tsx
export default async function DashboardPage() {
  const user = await getCurrentUser()
  return <Dashboard user={user} />
}
```

Whether this work can be prerendered, must wait for a request, or can be partially cached depends on **how `getCurrentUser()` obtains request/user-specific data and what caching model is enabled**.

Do not infer rendering mode only from the `async` keyword.

The caching/rendering phase will teach the current Next.js 16.2 models precisely.

## Build-time rendering, static output, and revalidation are different ideas

“Static” is often used too casually.

Separate these questions:

- Was output produced during build/prerendering?
- Can cached output be regenerated later?
- Is data cached independently from route output?
- Is the response being served from a CDN/provider cache?
- Does the browser cache anything?

A route being “static” does not mean its data is immutable forever.

## Environment poisoning

A dangerous architecture is importing a server-only module into code that becomes part of the client graph.

Example server module:

```ts
// lib/db.ts
export const connectionString = process.env.DATABASE_URL
```

If client code begins importing server implementation modules, you risk build failures, accidental substitutions, bundle problems, or secret exposure patterns.

Keep server-only capabilities behind explicit server module boundaries. Later Server/Client chapters will cover the `server-only` package pattern and dependency direction.

## Node.js is not the browser

Both environments support JavaScript, but their platform APIs differ.

Browser examples:

```text
window
document
localStorage
navigator
```

Node/server examples:

```text
process
filesystem APIs
server sockets
private network access (deployment permitting)
```

Standard Web APIs such as `Request`, `Response`, streams, `URL`, and `fetch` can exist in multiple runtimes, which is useful—but shared API names do not make every runtime identical.

## Framework runtime vs provider runtime

Suppose your Next.js code is valid for a Node server. A deployment adapter may package it into multiple functions, add CDN behavior, or apply provider-specific limits.

Therefore:

```text
works in Next.js core
≠
works identically on every provider
```

Check deployment/runtime documentation for:

- supported Node APIs;
- filesystem persistence;
- function duration/memory;
- regions;
- cache storage/coordination;
- streaming support;
- background work;
- connection reuse.

The deployment chapter will separate these systematically.

## Debugging by environment

When you see `window is not defined`:

- find why browser code is executing/being evaluated in a server/build context;
- do not blindly add `'use client'` to an entire route tree.

When a secret appears undefined:

- determine whether it is read at build time, server runtime, or client time;
- check naming and deployment injection;
- never fix a server secret by adding `NEXT_PUBLIC_`.

When a page differs after refresh vs `<Link>` navigation:

- compare initial request and client navigation paths;
- inspect layout persistence, request data, and caching;
- reproduce in a production build.

When local state resets unexpectedly:

- check route/layout identity and remount boundaries;
- do not assume every navigation preserves every component instance.

## Production pattern: split responsibilities

```tsx
// app/account/page.tsx — Server Component
import { AccountPreferences } from './AccountPreferences'
import { getAccount } from '@/lib/accounts/get-account'

export default async function AccountPage() {
  const account = await getAccount()

  return (
    <main>
      <h1>Account</h1>
      <p>{account.email}</p>
      <AccountPreferences initialTheme={account.theme} />
    </main>
  )
}
```

```tsx
// app/account/AccountPreferences.tsx — Client Component
'use client'

import { useState } from 'react'

export function AccountPreferences({ initialTheme }: { initialTheme: 'light' | 'dark' }) {
  const [theme, setTheme] = useState(initialTheme)

  return (
    <button onClick={() => setTheme((value) => (value === 'light' ? 'dark' : 'light'))}>
      Theme: {theme}
    </button>
  )
}
```

The server owns account data loading. The browser owns the local interactive state. Later, persisting that preference can use a properly validated and authorized server mutation.

## Common mistakes

### “Use `'use client'` to fix every server error”

That can move code and dependencies into the browser graph, increase JavaScript, and create security/architecture problems. Fix the actual boundary.

### “Server Components never reach the browser”

Their **component implementation** does not become the same client JavaScript bundle, but their rendered result is represented in the server-delivered React/HTML pipeline.

### “If it is server code, it runs once”

Server work can execute at build time, request time, revalidation time, or across multiple instances depending on its contract and deployment.

### “If it worked after `pnpm dev`, production is equivalent”

Always validate the production build and runtime path.

## Exercise: classify execution

For each item, decide whether it belongs at build time, server runtime, browser runtime, or can participate in multiple phases:

1. reading `DATABASE_URL`;
2. `window.matchMedia()`;
3. compiling `page.tsx`;
4. querying the current user's private projects;
5. handling a button click;
6. generating eligible prerendered route output;
7. validating a form submission;
8. hydrating an interactive form;
9. serving a file from `public/`;
10. emitting a server trace.

Then explain what data is allowed to cross from each environment into the next.

## Interview questions

**Does `'use client'` mean the component renders only in the browser?**

No. It defines a client module boundary. Client Components can participate in server-generated initial HTML and are then hydrated in the browser.

**Can a Server Component use `useState`?**

Not for client interactive state. State/effect/event-handler behavior belongs in Client Components. Server Components execute as part of server rendering and do not persist interactive browser component state.

**Why can an app work in development but fail in production?**

Development and production have different compilation, optimization, prerender/build analysis, caching, environment, and deployment characteristics. A correct workflow validates `next build` and the production runtime/deployment artifact.

**Why is an in-memory server map unsafe as durable session storage?**

Production can have multiple processes/instances, restarts, and stateless/serverless execution. In-memory state is process-local and ephemeral unless infrastructure explicitly guarantees otherwise.

## Official references

- [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Installation and production scripts](https://nextjs.org/docs/app/getting-started/installation)
- [Environment variables](https://nextjs.org/docs/app/guides/environment-variables)
- [Next.js glossary](https://nextjs.org/docs/app/glossary)
