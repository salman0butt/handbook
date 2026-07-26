---
title: Metadata Model, Static Metadata, Generated Metadata & Inheritance
description: Build a correct mental model for Next.js metadata ownership, segment inheritance, generated metadata, and file-based precedence.
---

# Metadata Model, Static Metadata, Generated Metadata & Inheritance

Metadata is part of the route tree.

Do not treat SEO as one global object that gets assembled after rendering.

In the App Router, metadata is resolved **segment by segment** from the root layout down to the final page.

A useful model is:

```text
root layout metadata
        ↓
nested layout metadata
        ↓
page metadata
        ↓
file-based metadata for that segment
        ↓
resolved head output
```

That model explains inheritance, overrides, title templates, social cards, and many production bugs.

## Metadata APIs

Next.js gives you three main ways to describe document metadata:

```text
static metadata object
→ known without route-specific async work

generateMetadata()
→ depends on params, data, or parent metadata

metadata file conventions
→ icons, OG/Twitter images, sitemap, robots, manifest, and related assets
```

Use the narrowest mechanism that matches the requirement.

## Static `metadata`

For values that are known statically, export a `Metadata` object:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Compare Acme plans and features.',
}

export default function PricingPage() {
  return <main>...</main>
}
```

Static metadata is usually the clearest option because there is no unnecessary async work.

## Dynamic `generateMetadata`

Use `generateMetadata` when metadata depends on route params, external data, or resolved parent metadata.

```tsx
import type { Metadata } from 'next'

type Props = PageProps<'/products/[slug]'>

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  return {
    title: product.name,
    description: product.summary,
  }
}
```

This is appropriate because the final metadata cannot be known until the product is resolved.

## Server Component-only exports

The `metadata` object and `generateMetadata` export are supported only in Server Component route files.

Do not move a page or layout to `'use client'` merely to support UI behavior and then expect metadata exports in that same module to remain valid.

Prefer keeping the page/layout server-owned and moving interactive UI into nested Client Components.

## Do not export both in one segment

This is invalid architecture:

```tsx
export const metadata = {
  title: 'Products',
}

export async function generateMetadata() {
  return {
    title: 'Dynamic products',
  }
}
```

A route segment chooses one metadata export strategy.

Use static metadata when possible; use generated metadata when required.

## Segment evaluation order

For:

```text
app/layout.tsx
app/blog/layout.tsx
app/blog/[slug]/page.tsx
```

metadata resolves from outer to inner:

```text
root layout
   ↓
blog layout
   ↓
blog page
```

Later segments can replace fields from earlier segments.

## Shallow merge is the critical rule

Metadata objects are shallowly merged.

Suppose the root layout defines:

```tsx
export const metadata = {
  openGraph: {
    title: 'Acme',
    description: 'Acme platform',
    images: ['/og-default.png'],
  },
}
```

and a page defines:

```tsx
export const metadata = {
  openGraph: {
    title: 'Pricing',
  },
}
```

Do not assume the result is:

```text
openGraph.title = Pricing
openGraph.description = Acme platform
openGraph.images = default image
```

The later `openGraph` field replaces the earlier nested object.

This is one of the most common metadata bugs in large apps.

## Extend parent metadata explicitly

If you need to preserve selected parent fields, use the parent metadata argument.

```tsx
import type { Metadata, ResolvingMetadata } from 'next'

export async function generateMetadata(
  { params }: PageProps<'/products/[slug]'>,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  const previous = await parent

  return {
    title: product.name,
    openGraph: {
      title: product.name,
      description: product.summary,
      images: [product.ogImage, ...(previous.openGraph?.images ?? [])],
    },
  }
}
```

Extend only the fields you actually want to inherit.

Do not blindly spread the whole parent object.

## Parent metadata is resolved metadata

The second argument is not just the immediate parent file's literal export.

It represents metadata resolved from parent segments above the current segment.

That makes it useful for deliberate inheritance such as:

```text
brand defaults
social image fallback
publisher information
shared alternates
```

## `params` are asynchronous

Current App Router route params are Promise-based.

```tsx
export async function generateMetadata({
  params,
}: PageProps<'/blog/[slug]'>) {
  const { slug } = await params
  // ...
}
```

Do not copy old synchronous `params.slug` examples into modern code.

## `searchParams` availability

Page-level `generateMetadata` can receive search params.

Layouts do not own page search params in the same way because layouts persist across navigations and are not re-rendered for each query-string change.

Before using query state in metadata, ask whether that URL variant should even be independently indexable.

A faceted-search URL like:

```text
/products?sort=price&view=grid
```

usually should not automatically become a distinct canonical SEO document.

## Data reuse inside `generateMetadata`

It is common for both the page and metadata generation to need the same entity.

```tsx
export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)

  return { title: product.name }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)

  return <Product product={product} />
}
```

For `fetch`, Next.js can memoize identical requests across metadata generation and rendering.

For non-`fetch` data sources, a React `cache` wrapper can provide request/render memoization where appropriate.

Do not create an internal HTTP hop to your own Route Handler just to share metadata data.

Call the shared server data function directly.

## Metadata and `notFound()`

If the entity does not exist, metadata generation should not invent a title for a page that will become 404.

```tsx
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) notFound()

  return {
    title: product.name,
  }
}
```

Your page should follow the same existence rule.

## Metadata and redirects

A metadata function can also redirect when the route's canonical resolution requires it.

But routing/canonicalization policy should remain clear:

```text
URL normalization problem
→ redirects / Proxy / route logic

metadata description problem
→ metadata API
```

Do not use metadata generation as a general routing layer.

## File-based metadata precedence

File-based metadata has higher priority than `metadata` or `generateMetadata` for the corresponding file-driven field.

For example, a route-level:

```text
opengraph-image.png
```

can override an Open Graph image configured through the object API for that segment.

This is intentional.

It also means that debugging social-image output must include checking the filesystem, not only the metadata object.

## Ownership model

A useful production policy:

```text
root layout
→ site-wide defaults

section layout
→ section-specific defaults/template

page
→ document-specific metadata

file convention
→ actual image/icon/crawler resources
```

This keeps metadata aligned with route ownership.

## Avoid metadata mega-factories

A common over-abstraction is:

```text
buildMetadata(routeName, tenant, locale, contentType, params, flags, ...)
```

that knows every route in the application.

Problems:

- ownership becomes unclear
- parent inheritance becomes hard to reason about
- route-specific semantics leak into shared code
- testing becomes combinatorial

Prefer small helpers for repeated concepts:

```text
canonical URL builder
OG image builder
locale alternate builder
product SEO mapper
article SEO mapper
```

while each route still owns its final metadata contract.

## SEO is not keyword stuffing

Metadata should accurately describe the page users actually receive.

Do not generate misleading titles/descriptions just to target unrelated queries.

A strong metadata system is primarily about:

```text
identity
canonicalization
crawl/index policy
share previews
structured meaning
consistency
```

## Security

Treat content-derived metadata as untrusted data.

If titles, descriptions, or social-card text come from user-generated content:

- validate length
- avoid exposing private data
- do not embed secrets
- do not leak unpublished content
- ensure authorization happens before selecting private records

Metadata is public document output.

## Debugging checklist

When metadata is wrong:

1. Identify the final route and every parent layout.
2. Check static `metadata` exports.
3. Check `generateMetadata` output.
4. Check shallow nested-object replacement.
5. Check file-based metadata in the segment.
6. Check `metadataBase` URL composition.
7. Compare hard-load HTML with hydrated DOM when streaming metadata may be involved.
8. Test the exact user-agent behavior if debugging a crawler.
9. Verify production, not only development.

## Interview questions

**Why can defining `openGraph` in a child accidentally remove parent OG fields?**  
Because metadata merging is shallow; the child's `openGraph` object replaces the parent nested object.

**When should you use `generateMetadata` instead of static `metadata`?**  
When metadata genuinely depends on params, dynamic data, or resolved parent metadata.

**Why should metadata data functions be shared directly instead of calling an internal Route Handler?**  
The metadata/page code already runs on the server; an internal HTTP hop adds latency, duplication, and build-time/runtime coupling.

**Which has higher priority: file-based metadata or object/generated metadata?**  
File-based metadata for the corresponding field.

## Exercise

Design metadata ownership for:

```text
/
/products
/products/[slug]
/blog
/blog/[slug]
/account
```

For each route decide:

- root vs section vs page ownership
- static vs generated metadata
- whether it is indexable
- canonical URL source
- social-image source
- which data is reused with page rendering

Then explain how nested `openGraph` inheritance is handled without accidental shallow-merge loss.
