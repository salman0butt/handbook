---
title: Project Structure & File Conventions
description: Learn how the App Router turns folders and special files into routes, layouts, boundaries, endpoints, metadata, and request behavior.
---

# Project Structure & File Conventions

The `app/` directory is not simply a folder where React components happen to live. It is an input to the Next.js router and build system.

The key mental model is:

> **Folders describe route segments; special file names activate framework behavior inside those segments. Ordinary files are just modules.**

## Start with the smallest route tree

```text
app/
├── layout.tsx
└── page.tsx
```

- `app/layout.tsx` is the root layout.
- `app/page.tsx` exposes `/`.

Add a route:

```text
app/
├── layout.tsx
├── page.tsx
└── products/
    └── page.tsx
```

Now `app/products/page.tsx` exposes `/products`.

The `products` folder defines a segment, but the folder alone is not a public page.

## Top-level project files

A production project may look like:

```text
my-app/
├── app/
├── public/
├── components/
├── lib/
├── instrumentation.ts
├── instrumentation-client.ts
├── proxy.ts
├── next.config.ts
├── package.json
├── tsconfig.json
├── eslint.config.mjs
├── .env.local
└── .gitignore
```

Not every project needs every file.

### `app/`

The modern App Router route tree. This handbook does not use `pages/`.

### `public/`

Static files served from the site root.

For example:

```text
public/logo.svg
```

can be addressed as:

```text
/logo.svg
```

Do not use `public/` as a dumping ground for secrets or server-only files. Public means publicly retrievable.

### `next.config.ts`

Framework configuration. Add options intentionally because configuration can affect compilation, routing, caching, assets, security headers, and deployment output.

### `instrumentation.ts`

Server-side instrumentation entry point used for observability setup and related hooks.

### `instrumentation-client.ts`

Client-side instrumentation that runs early in the browser, useful for monitoring, performance marks, and browser error setup.

Because this file runs in the browser, never place server secrets in it.

### `proxy.ts`

The Next.js 16 request-boundary convention formerly named Middleware.

Proxy can inspect selected incoming requests and perform actions such as redirects, rewrites, and header/cookie handling before route rendering.

It is **not** a replacement for authorization inside protected Server Functions, Route Handlers, or data-access operations.

### `.env*`

Environment configuration. Local/private environment files should generally stay out of version control.

Variables exposed with `NEXT_PUBLIC_` are not secrets.

## Routing special files

These file names have framework meaning inside `app/`:

| Convention | Role |
| --- | --- |
| `page.tsx` | Page UI that exposes a route |
| `layout.tsx` | Shared layout that preserves across applicable navigation |
| `template.tsx` | Layout-like boundary that receives a new instance on navigation |
| `loading.tsx` | Loading UI / Suspense boundary for a segment |
| `error.tsx` | Error boundary UI for a segment |
| `global-error.tsx` | Global error fallback |
| `not-found.tsx` | Not-found UI |
| `default.tsx` | Fallback for parallel-route slots |
| `route.ts` | Route Handler / HTTP endpoint |

Later chapters cover each behavior deeply. At foundation level, remember that the file name is part of the API.

## Component hierarchy is generated from the route tree

For a nested segment, the effective component structure is conceptually similar to:

```text
parent layout
  └── child layout
        └── template (if present)
              └── loading/error boundaries where applicable
                    └── page or deeper child layout
```

The exact React/runtime implementation is not something application code should depend on. The public contract is the documented behavior of layouts, templates, loading, error, not-found, pages, and slots.

## Colocation is safe

Suppose you have:

```text
app/
└── products/
    ├── page.tsx
    ├── ProductCard.tsx
    ├── product.queries.ts
    └── product.types.ts
```

Only `page.tsx` is the page convention. The other files do not automatically become URLs.

This makes route-local colocation possible.

A common mistake from older routing systems is assuming every file beneath the route folder is public. That is not the App Router model.

## Private folders

Prefix a folder with `_` when you want to make its non-routing intent explicit:

```text
app/
└── dashboard/
    ├── _components/
    │   └── RevenueChart.tsx
    └── page.tsx
```

Private folders are useful for organization and for preventing the directory from being considered by the routing system.

They are not a security boundary. A private folder name does not protect data or code from an attacker; it only affects route organization/build interpretation.

## Route groups

Parentheses create an organizational group without adding a URL segment:

```text
app/
├── (marketing)/
│   ├── about/
│   │   └── page.tsx
│   └── pricing/
│       └── page.tsx
└── (app)/
    └── dashboard/
        └── page.tsx
```

The URLs remain:

```text
/about
/pricing
/dashboard
```

not:

```text
/(marketing)/about
```

Route groups let architecture and URL design evolve somewhat independently. They are especially useful for applying different layouts to logical sections.

## Dynamic segments

Dynamic folders use brackets:

```text
app/products/[slug]/page.tsx
```

This represents routes such as:

```text
/products/keyboard
/products/monitor
```

Later routing chapters will cover:

- `[slug]`
- `[...slug]`
- `[[...slug]]`
- typed route params
- async params in modern Next.js
- static generation choices
- validation and not-found behavior

Do not read a dynamic URL segment as trusted database input. It is user-controlled input and must be validated before being used for sensitive operations.

## Parallel and intercepting routes

The App Router also has advanced folder conventions for:

- parallel slots such as `@modal`;
- intercepting routes using conventions such as `(.)` and related forms.

These are powerful for dashboards, modal routes, and independent route regions. They are deliberately deferred until the routing phase because using them without understanding layout persistence and client navigation usually creates confusing architecture.

## Metadata conventions

Next.js recognizes metadata files and APIs for concerns such as:

- icons;
- Open Graph images;
- Twitter images;
- `robots.txt`;
- `sitemap.xml`;
- manifest data.

The lesson is the same: a file name may be an application module **and** a framework convention. Always check what contract the convention activates.

## A production-friendly organization

There is no mandatory `components/`, `lib/`, `features/`, or `services/` folder naming scheme in Next.js.

A reasonable medium-sized application might use:

```text
app/
├── (marketing)/
├── (product)/
├── api-or-route-handler-segments/
└── layout.tsx

features/
├── billing/
├── projects/
└── users/

components/
└── ui/

lib/
├── auth/
├── db/
└── observability/
```

The important architectural questions are:

- Can a developer find a feature's behavior?
- Are route concerns separated from domain logic when that improves clarity?
- Are dependencies flowing in a deliberate direction?
- Are server-only modules prevented from leaking into client graphs?
- Can authorization and tenant scoping be audited?

Folder aesthetics are secondary.

## `src/` is optional

Next.js supports moving application source into `src/`:

```text
src/
└── app/
```

while keeping project configuration at the repository root.

Use it if the team prefers that separation. It does not make an application more “enterprise.”

## Root layout mental model

A root layout might be:

```tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Acme',
  description: 'Acme application',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

It is not a replacement for the old concept of “one component that manually renders every page.” It participates in a nested route-layout tree managed by Next.js.

Layouts are Server Components by default unless a client boundary is introduced.

## `page.tsx` mental model

A page is the UI leaf for a public route:

```tsx
export default async function ProductsPage() {
  return (
    <main>
      <h1>Products</h1>
    </main>
  )
}
```

The fact that this function can be `async` is important in App Router architecture: a Server Component can await server-side work directly.

That does not mean every page should perform every query. Data ownership and architecture still matter.

## `route.ts` is not a page

A Route Handler exposes HTTP behavior:

```text
app/status/route.ts
```

and a page exposes UI:

```text
app/status/page.tsx
```

Do not casually mix both conventions at the same route segment without checking the framework's routing constraints. Design whether a path is an HTTP resource or a rendered page intentionally.

## Framework magic checklist

Whenever a file “does something automatically,” ask:

1. Which file/folder convention triggered it?
2. Does it alter the URL tree?
3. Does it create a layout/boundary or expose a route?
4. Does the module execute on the server, client, or both through different phases?
5. Does it change the client bundle?
6. Does it affect rendering/caching?
7. Is the behavior core Next.js or deployment-provider behavior?

## Common mistakes

### Making every component a Client Component

Adding `'use client'` high in the tree pulls an entire import boundary into the client graph. Keep interactive boundaries deliberate.

### Treating private folders as authorization

`_admin` does not protect `/admin`. Folder structure is not access control.

### Encoding organization into URLs accidentally

Use route groups when a directory exists for team/layout organization but should not become a URL segment.

### Over-engineering folders before features exist

Start with clear route ownership and cohesive feature boundaries. Extract shared layers when actual coupling appears.

### Copying `middleware.ts` into a Next.js 16 greenfield app

Use the current `proxy.ts` convention. Treat Middleware terminology as migration/history.

## Exercise

Design a route tree for:

```text
/
/pricing
/login
/dashboard
/dashboard/projects
/dashboard/projects/[projectId]
/settings/profile
/settings/billing
```

Requirements:

- marketing pages share one layout;
- authenticated application pages share another layout;
- route-group names must not appear in URLs;
- project-local UI should be colocated;
- `[projectId]` must be treated as untrusted input;
- do not add `'use client'` unless a component actually needs browser/interactivity features.

Then draw the resulting layout nesting before writing code.

## Interview questions

**Does every folder inside `app/` become a route?**

No. Folders form route segments, but public UI/endpoints are exposed through documented conventions such as `page.tsx` or `route.ts`.

**What is a route group?**

An organizational folder wrapped in parentheses whose name is omitted from the URL. It can help partition layouts and route organization.

**Why use a private folder if colocated files are already safe?**

For explicit organization, avoiding routing consideration/name conflicts, and signaling implementation detail—not for security.

## Official references

- [Project structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [File-system conventions](https://nextjs.org/docs/app/api-reference/file-conventions)
- [Proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)
- [Client instrumentation](https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client)
