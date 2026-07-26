---
title: Dynamic Segments & Async Params
description: Master dynamic, catch-all, and optional catch-all routes, async params, generateStaticParams, and route type safety.
---

# Dynamic Segments & Async Params

Dynamic segments let the filesystem describe URL shapes whose values are not known when you create the route tree.

```text
app/
└── products/
    └── [productId]/
        └── page.tsx
```

This one route shape can match:

```text
/products/42
/products/sku-abc
/products/coffee-grinder
```

The folder name defines the parameter name.

## Single dynamic segment

```tsx
// app/products/[productId]/page.tsx
export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>
}) {
  const { productId } = await params

  return <h1>Product {productId}</h1>
}
```

In modern App Router code, `params` is asynchronous.

The central rule for this handbook is:

> Treat route `params` as a Promise and access them with `await` in Server Components or React `use()` where appropriate in Client Components.

Do not copy older examples that assume synchronous `params`.

## Why async params matter

Next.js has moved request-bound route values toward asynchronous contracts. This gives the framework more flexibility around rendering and request work.

For application code, the practical consequence is straightforward:

```tsx
const { productId } = await params
```

instead of:

```tsx
// old mental model — do not teach this as current code
const { productId } = params
```

When reviewing code from older Next.js versions, treat synchronous parameter access as migration context rather than the modern baseline.

## Params flow through the route branch

Dynamic parameters are available to route APIs that participate in that branch, including pages, layouts, Route Handlers, and metadata generation.

Example:

```text
app/
└── organisations/
    └── [organisationId]/
        ├── layout.tsx
        └── projects/
            └── [projectId]/
                └── page.tsx
```

The project page can receive both values:

```tsx
export default async function ProjectPage({
  params,
}: {
  params: Promise<{
    organisationId: string
    projectId: string
  }>
}) {
  const { organisationId, projectId } = await params

  return (
    <div>
      Organisation: {organisationId}
      Project: {projectId}
    </div>
  )
}
```

Route params are structural input. They are not authorization.

Never assume that because the URL contains `organisationId`, the signed-in user is allowed to access that organisation. Authorization must validate the resource relationship on the server.

## Dynamic segments are strings

A route such as:

```text
orders/[orderId]
```

produces a string parameter.

If your domain expects a number or UUID, validate it.

```ts
const id = Number(orderId)

if (!Number.isInteger(id) || id <= 0) {
  // reject or notFound()
}
```

Better still, use a schema at the trust boundary when the domain rules are non-trivial.

The URL shape tells you where the value came from, not whether the value is valid.

## Catch-all segments

A catch-all segment uses three dots:

```text
app/docs/[...slug]/page.tsx
```

It can match multiple path parts:

| URL | `slug` |
| --- | --- |
| `/docs/react` | `['react']` |
| `/docs/react/hooks` | `['react', 'hooks']` |
| `/docs/react/hooks/use-state` | `['react', 'hooks', 'use-state']` |

Example:

```tsx
export default async function DocsPage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params

  return <p>{slug.join(' / ')}</p>
}
```

A standard catch-all requires at least one path part after the parent segment. `/docs` by itself does not match `[...slug]`.

## Optional catch-all segments

Use double brackets when the empty case should also match:

```text
app/docs/[[...slug]]/page.tsx
```

Now:

| URL | `slug` |
| --- | --- |
| `/docs` | `undefined` |
| `/docs/react` | `['react']` |
| `/docs/react/hooks` | `['react', 'hooks']` |

Type it accordingly:

```tsx
export default async function DocsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = await params

  if (!slug) {
    return <DocsHome />
  }

  return <DocsEntry segments={slug} />
}
```

## Choose the narrowest route shape

Do not use a catch-all because it feels flexible.

Prefer:

```text
products/[productId]
```

when the domain has one identifier.

Use:

```text
docs/[...slug]
```

when the domain itself is hierarchical and the number of path parts is meaningful.

Overusing catch-alls makes routing less explicit, weakens type assumptions, and pushes too much dispatch logic into the page.

## Static generation with `generateStaticParams`

Dynamic does not automatically mean “render every request at runtime.”

`generateStaticParams` can provide known parameter values for build-time prerendering.

```tsx
export async function generateStaticParams() {
  const products = await getPopularProducts()

  return products.map((product) => ({
    productId: product.id,
  }))
}
```

For:

```text
app/products/[productId]/page.tsx
```

the return type conceptually looks like:

```ts
{ productId: string }[]
```

For multiple segments:

```text
app/products/[category]/[product]/page.tsx
```

it may return:

```ts
{ category: string; product: string }[]
```

For a catch-all:

```text
app/docs/[...slug]/page.tsx
```

it returns arrays for the catch-all value:

```ts
{ slug: string[] }[]
```

Rendering and caching are covered deeply in Phase 6. At this stage, the important distinction is:

> Dynamic URL shape and dynamic rendering are different concepts.

A route can have dynamic parameters and still prerender known paths.

## `dynamicParams`

When a route uses `generateStaticParams`, you can control whether paths outside the generated set are allowed to render later.

```ts
export const dynamicParams = false
```

With this configuration, unspecified parameter combinations are not served as new runtime-rendered paths; they result in not-found behavior or may be matched by another route shape such as a catch-all.

Use this intentionally for domains with a closed set of valid static paths.

Do not use it as a substitute for database-level existence checks or authorization.

## Parent and child dynamic params

Consider:

```text
app/
└── products/
    └── [category]/
        ├── layout.tsx
        └── [product]/
            └── page.tsx
```

A page at the bottom can generate both category and product values.

A layout at `[category]` can generate values for the dynamic segment at its level, but not for a dynamic segment that exists below it.

When multiple `generateStaticParams` functions exist in a branch, Next.js can execute child generation for the parameter sets produced by the parent.

This matters for large catalogues because generation strategy can affect build work.

## Params in Client Components

A Client Component page can consume the Promise using React's `use()` API.

```tsx
'use client'

import { use } from 'react'

export default function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>
}) {
  const { productId } = use(params)

  return <p>{productId}</p>
}
```

But needing a route parameter is not, by itself, a reason to turn the whole page into a Client Component.

Prefer keeping the page server-side when possible and pass only the value needed by interactive Client Components.

## Route-aware type helpers

Current Next.js can generate route-aware global helpers as part of development, build, or explicit type generation.

For example:

```tsx
export default async function Page(
  props: PageProps<'/blog/[slug]'>
) {
  const { slug } = await props.params

  return <article>{slug}</article>
}
```

These helpers reduce the chance that filesystem route shapes and handwritten TypeScript types drift apart.

Treat generated route typing as a correctness aid, not a replacement for runtime validation. TypeScript cannot prove that an incoming string is a valid database ID or an authorized tenant.

## Dynamic route security

A common multi-tenant route:

```text
app/
└── organisations/
    └── [organisationId]/
        └── projects/
            └── [projectId]/
                └── page.tsx
```

Unsafe server logic:

```ts
const project = await db.project.findUnique({
  where: { id: projectId },
})
```

The URL also carries organisation context. Querying only by project ID can accidentally cross tenant boundaries if later authorization is incomplete.

A safer architecture validates scope at the data boundary:

```ts
const project = await db.project.findFirst({
  where: {
    id: projectId,
    organisationId,
  },
})
```

and separately verifies that the current user can access that organisation/project.

The routing layer gives you identifiers. The security layer proves access.

## `notFound()` for missing resources

A dynamic URL may be structurally valid while the resource does not exist.

```tsx
import { notFound } from 'next/navigation'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>
}) {
  const { productId } = await params
  const product = await getProduct(productId)

  if (!product) {
    notFound()
  }

  return <ProductDetails product={product} />
}
```

That is different from an unexpected infrastructure failure. Missing domain resources belong in not-found handling; database outages belong in error handling.

## Catch-all architecture smell test

Suppose you build:

```text
app/[...slug]/page.tsx
```

and inside it:

```ts
if (slug[0] === 'dashboard') ...
if (slug[0] === 'products') ...
if (slug[0] === 'account') ...
```

You have recreated a router inside a route.

Prefer explicit filesystem branches unless the domain genuinely requires open-ended hierarchical routing, such as CMS-driven paths or documentation trees.

## Debugging dynamic routes

When a route does not match or receives unexpected params, inspect:

1. The exact folder brackets.
2. Whether a catch-all is required to have at least one segment.
3. Whether an optional catch-all produces `undefined` for its base route.
4. Whether code forgot to `await params`.
5. Whether a route group or parallel slot changed filesystem depth without changing URL segment depth.
6. Whether two route shapes resolve to the same public URL.
7. Whether `dynamicParams = false` intentionally excludes the requested value.
8. Whether `generateStaticParams` returns the expected property names and string/array shapes.

## Interview questions

**Does `[id]` mean a route is dynamically rendered?**  
No. It means the URL contains a dynamic route segment. Rendering and caching strategy are separate dimensions.

**What type is `params` in modern App Router pages?**  
A Promise resolving to the route parameter object. Server Components typically `await` it.

**What is the difference between `[...slug]` and `[[...slug]]`?**  
The first requires one or more captured segments; the optional catch-all also matches the parent path and may produce `undefined`.

**What does `generateStaticParams` do?**  
It supplies dynamic parameter combinations that Next.js can prerender at build time.

**Are route params trusted input?**  
No. Validate format, resource existence, tenancy, and authorization on the server.

## Official references

- https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes
- https://nextjs.org/docs/app/api-reference/functions/generate-static-params

Next: **Route Groups, Private Folders & Multiple Roots**.