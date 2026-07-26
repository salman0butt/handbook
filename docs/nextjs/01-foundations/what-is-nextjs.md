---
title: What Is Next.js?
description: Understand what Next.js adds to React and how the App Router framework fits between application code and the web platform.
---

# What Is Next.js?

Next.js is a **React framework**. React gives you a component model and rendering primitives; Next.js turns those primitives into an application framework with routing, server execution, compilation, data and cache conventions, optimized assets, request handling, production output, and deployment integration.

The useful question is not “What syntax does Next.js add?” It is:

> **Which application responsibilities is the framework taking ownership of, and what contract does it give me in return?**

## React alone vs a framework

A React component can describe UI:

```tsx
export function ProductName({ name }: { name: string }) {
  return <h1>{name}</h1>
}
```

That code does not decide:

- which URL renders it;
- where its data comes from;
- whether its module executes on a server or becomes browser JavaScript;
- how an initial request is turned into HTML;
- how later navigations fetch route data;
- how assets are optimized;
- how a server endpoint is exposed;
- how a production server/build is created.

Next.js provides conventions and runtime/build behavior for those concerns.

## A full-stack mental model

Think of a modern App Router application as several cooperating systems:

```text
Browser
  │
  │ HTTP request / client navigation
  ▼
Next.js request + routing layer
  │
  ▼
React Server Component tree
  │
  ├── data source / database / service
  ├── cached work where configured
  └── Server Functions / Route Handlers for operations that need those boundaries
  │
  ▼
RSC payload + server-generated HTML
  │
  ▼
Browser
  │
  └── hydrate Client Components and continue client navigation
```

That diagram is deliberately simplified. Later chapters will add Proxy, streaming, Suspense, caches, metadata, runtime/deployment details, and failure paths.

## What the App Router gives you

### File-system routing

The directory tree under `app/` participates in the route tree. Special files such as `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, and `route.ts` activate framework behavior.

These names are **Next.js conventions**, not JavaScript rules.

A folder alone does not automatically expose a page. A route becomes publicly reachable when the route tree contains a convention that exposes output, such as a `page` or Route Handler.

### Server Components by default

Pages and layouts in the App Router are Server Components by default. That changes the architecture compared with a traditional client-heavy React SPA:

- server-only dependencies can stay off the client bundle;
- data can often be read where the server component needs it;
- secrets can remain server-side;
- interactive islands can be introduced with Client Component boundaries.

This does **not** mean every Server Component is “static.” Server/Client is an execution/module-boundary question; static/dynamic is a rendering/data question.

### Integrated server rendering and streaming

Next.js coordinates React's server capabilities to produce initial HTML and React Server Component data. Suspense boundaries can allow parts of the route to stream rather than forcing the entire response to wait on the slowest work.

Streaming is still server delivery. It is not synonymous with client-side rendering.

### Server-side operations

The framework gives you several server-side boundaries, each with a different purpose:

- **Server Components** — render/read data for the component tree;
- **Server Functions** — invoke server-side operations from React/form workflows;
- **Route Handlers** — expose explicit HTTP endpoints;
- **Proxy** — run request-boundary logic before route rendering for selected requests.

Using “server” in all four names does not make them interchangeable.

### Build and production integration

Next.js owns a production build pipeline. It analyzes the route/module graphs, compiles server and client output, prepares assets and route metadata, and emits artifacts that a supported runtime/adapter can serve.

In Next.js 16, Turbopack is the default bundler for both `next dev` and `next build`.

## The five environments you must distinguish

Many Next.js bugs come from collapsing different execution contexts into one mental bucket.

### 1. Build time

`next build` compiles and analyzes your application and may prerender work according to the route and caching model. Build-time code executes in the build environment, not in a future user's browser.

### 2. Server runtime

Request-time server work can access server capabilities such as private environment variables and databases when the deployment runtime supports them.

### 3. Browser runtime

Client Components hydrate and run browser-facing logic. Anything shipped here is observable by the user and should be treated as public code/data.

### 4. React framework boundary

React decides component/render behavior; Next.js decides how that model is composed into framework routing, builds, requests, and delivery.

### 5. Deployment infrastructure

A Node server, container, serverless function, edge network, CDN, and provider adapter can impose different operational limits. Next.js core behavior does not erase infrastructure constraints.

## Framework convention vs language behavior

Compare:

```tsx
// app/products/page.tsx
export default function Page() {
  return <h1>Products</h1>
}
```

JavaScript/TypeScript explains:

- modules;
- functions;
- JSX syntax after framework/compiler handling;
- exports.

Next.js explains:

- why a file named `page.tsx` inside `app/products/` creates the `/products` page;
- how it joins the route tree;
- why it is a Server Component by default;
- how it participates in the production build and navigation model.

When debugging “framework magic,” identify the convention that activated it.

## What Next.js does not automatically solve

A framework can provide safe primitives without making the application safe or well designed.

Next.js does not automatically decide:

- your domain model;
- authorization rules;
- database schema and transaction boundaries;
- validation policy;
- observability standards;
- cache freshness requirements;
- tenant isolation;
- rate-limit strategy;
- background-work architecture;
- whether a third-party dependency belongs on the server or client.

Those remain engineering decisions.

## Security boundary: server code is not a trust boundary

Consider a future Server Function:

```ts
'use server'

export async function updateProject(projectId: string, name: string) {
  // Never assume these arguments are trusted just because this runs on a server.
}
```

The caller can be malicious. A production implementation still needs input validation, authentication, authorization, and tenant scoping before changing data.

Likewise, keeping a button out of the UI is not authorization. The protected server operation must enforce the rule.

## Performance boundary: less browser JavaScript is not the whole story

Server Components can reduce client JavaScript, but application performance also includes:

- server response latency;
- database latency;
- network waterfalls;
- RSC payload size;
- HTML streaming/reveal timing;
- cache hits and misses;
- image/font/script loading;
- hydration work in Client Components;
- client navigation behavior.

The handbook uses:

```text
measure → identify bottleneck → change → measure again
```

instead of “optimize” by habit.

## Production example: product page

A product route might combine:

```text
/products/[slug]
│
├── page.tsx                    Server Component
│   ├── query product           server-side data access
│   ├── ProductDetails          Server Component
│   └── AddToCartButton         Client Component
│
├── loading.tsx                 route loading/Suspense UI
└── opengraph-image.tsx         generated metadata asset
```

The Server Component can obtain product data without shipping database code to the browser. The Add to Cart control can form a small interactive client boundary. A mutation can later use a Server Function with explicit authorization and validation.

The architecture is valuable because each responsibility has a reason—not because “Server Components are always better.”

## Common mistakes

### “Next.js is just React with routing”

Routing is only one layer. Modern Next.js coordinates server/client module graphs, rendering, streaming, caching, backend boundaries, optimized assets, and build/deployment output.

### “Anything in `app/` runs only on the server”

No. `'use client'` can create a client module boundary within the `app/` tree.

### “Server Component means the user receives no HTML for it”

The opposite mental model is closer: Server Components can contribute to the server-rendered route output without sending their component implementation as client JavaScript.

### “I need an API route for every database query”

Not necessarily. A Server Component can often call server-side data access directly. Add an HTTP boundary when you actually need an HTTP API boundary.

### “Proxy is my auth system”

Proxy is useful for early request decisions. Authorization must still be enforced at the protected operation/data access.

## Debugging checklist

When behavior surprises you, ask:

1. Which Next.js file or API convention activated this behavior?
2. Is this module a Server or Client Component boundary?
3. Is the surprising work happening during build, request, or browser execution?
4. Is the route being visited by initial HTTP request or client navigation?
5. Is caching involved?
6. Is the behavior framework-owned or provider-owned?
7. Can the production runtime do what the code assumes?

## Exercise

Take a React SPA you know and classify its concerns into:

- React UI concerns;
- routing;
- server data access;
- public HTTP APIs;
- mutations;
- caching;
- build tooling;
- deployment/runtime behavior.

Then mark which concerns Next.js App Router can own and which still belong to your application architecture.

## Interview questions

**What is the difference between React and Next.js?**

A strong answer explains that React supplies the component/rendering model while Next.js is a framework that composes React into routing, server execution, rendering/streaming, caching/data conventions, assets, backend boundaries, builds, and deployment integration.

**Is a Server Component the same as SSR?**

No. Server Components define an execution/module boundary and the RSC representation. SSR describes server production of initial HTML. Next.js can use both in the same rendering pipeline.

**Why not put every data request behind a Route Handler?**

Because server-rendered code can often access its data source directly. An internal HTTP hop can add latency, duplicated validation/types, and operational complexity. Use a Route Handler when an HTTP interface is the intended boundary—for example external consumers, webhooks, custom response semantics, or browser requests that genuinely require it.

## Official references

- [Next.js App Router](https://nextjs.org/docs/app)
- [Project structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
