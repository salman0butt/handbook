---
title: JSON-LD, Structured Data & XSS Safety
description: Add structured data safely with JSON-LD, shared domain models, canonical consistency, schema typing, and injection-resistant serialization.
---

# JSON-LD, Structured Data & XSS Safety

JSON-LD describes page meaning in a machine-readable form.

It can help search engines and other systems understand entities such as:

```text
Organization
Product
Article
BreadcrumbList
Event
Recipe
Person
SoftwareApplication
FAQPage
```

But structured data is only useful when it accurately reflects visible/public content.

## Next.js recommendation

The current Next.js guide recommends rendering JSON-LD as a script tag in a page or layout.

Example:

```tsx
export default async function ProductPage({
  params,
}: PageProps<'/products/[slug]'>) {
  const { slug } = await params
  const product = await getPublicProduct(slug)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.summary,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <main>...</main>
    </>
  )
}
```

## Why the `<` replacement matters

`JSON.stringify()` serializes data, but it is not an HTML sanitization boundary.

If untrusted content contains text that can terminate the script context, direct insertion can create an XSS vulnerability.

A defensive minimum is to escape `<` in the serialized payload:

```ts
JSON.stringify(value).replace(/</g, '\\u003c')
```

Organizations may use a vetted serializer with stronger guarantees.

The important principle is:

> Never assume JSON serialization alone makes arbitrary content safe to inject into HTML.

## Structured data is public

Do not include:

```text
internal SKU if confidential
unpublished article body
private customer name
admin notes
session state
hidden discount logic
access tokens
signed URLs
```

Search engines and users can inspect the script in page HTML.

## Build from the same public domain model

A reliable architecture:

```text
public product data
      ↓
page UI
metadata
Open Graph/Twitter
JSON-LD
sitemap
```

All outputs should describe the same public entity.

Avoid separate SEO-only database queries with different publication/tenant filters.

## Example public SEO mapper

```ts
type PublicProductSeo = {
  name: string
  description: string
  url: string
  image: string
  currency: string
  price: string
  availability: 'InStock' | 'OutOfStock'
}

function toProductSeo(product: PublicProduct): PublicProductSeo {
  return {
    name: product.name,
    description: product.summary,
    url: canonicalUrl(`/products/${product.slug}`),
    image: product.publicImageUrl,
    currency: product.currency,
    price: product.price.toFixed(2),
    availability: product.inStock ? 'InStock' : 'OutOfStock',
  }
}
```

The exact Schema.org mapping is separate, but the public source data is centralized.

## Type JSON-LD in TypeScript

The Next.js guide points to community typing packages such as `schema-dts`.

Example shape:

```ts
import type { Product, WithContext } from 'schema-dts'

const jsonLd: WithContext<Product> = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.summary,
}
```

Typing helps catch shape mistakes.

It does not validate business truth.

You can still produce perfectly typed but misleading structured data.

## Visible-content consistency

If JSON-LD says:

```text
price = 100
availability = InStock
```

but the page visibly shows:

```text
price = 120
Out of stock
```

that is a data consistency defect.

Generate structured data from the same server-owned data used for the page whenever possible.

## Canonical URL consistency

The JSON-LD page/entity URL should align with:

```text
canonical metadata
Open Graph URL
sitemap URL
preferred internal links
```

Avoid multiple identity systems.

## Product example

```tsx
function ProductStructuredData({ product }: { product: PublicProduct }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.summary,
    image: [product.publicImageUrl],
    offers: {
      '@type': 'Offer',
      priceCurrency: product.currency,
      price: product.price.toFixed(2),
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: canonicalUrl(`/products/${product.slug}`),
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
```

## Article example

For an article, useful fields may include:

```text
headline
publication date
modified date
author
publisher
image
canonical URL
```

Do not invent publication timestamps.

Use the content system's actual public lifecycle timestamps.

## Breadcrumb structured data

Breadcrumbs are a good candidate for shared route-domain data.

Example conceptual model:

```text
Home
→ Products
→ Analytics
```

If the UI breadcrumb and JSON-LD breadcrumb are generated separately, they can drift.

Prefer one breadcrumb model mapped to both renderings.

## Organization data

Site-wide organization information can live in a root layout when it truly applies to the whole site.

Be careful in multi-brand/white-label systems.

A global organization schema that always says `Acme` is wrong if a custom-domain tenant is meant to represent a different brand.

## Multiple JSON-LD blocks

A page can contain multiple relevant structured-data blocks.

For example:

```text
Product
BreadcrumbList
Organization
```

Keep each block purposeful.

Do not flood pages with every schema type you can construct.

## IDs and entity references

Stable `@id` values can help identify entities across structured data.

Example:

```ts
'@id': `${siteUrl}#organization`
```

Use stable public IDs.

Do not use session IDs or database primary keys when they are not intended as public identifiers.

## User-generated content

UGC needs special care.

Potential issues:

```text
script-context injection
misleading claims
malicious URLs
extreme text length
private information
unsupported markup
```

Validate and normalize before mapping to structured data.

Then serialize safely for HTML.

## URL safety

For structured-data URLs:

- prefer application-owned canonical builders
- validate remote image origins
- avoid `javascript:` or other unsafe schemes
- do not emit signed/private URLs
- ensure tenant/custom-domain URLs are validated

Structured data is not exempt from URL trust boundaries.

## Cache and freshness

Structured data is rendered with the page.

Its freshness follows the page/data rendering model.

If price or availability changes, think about:

```text
page cache
metadata cache
OG image cache
JSON-LD page render
sitemap freshness
```

A product update should not leave machine-readable output stale for days while visible UI is fresh.

## Client-side JSON-LD

Prefer server-rendered structured data for public SEO content.

Do not require a client fetch after hydration just to insert essential structured data.

That adds unnecessary dependency on JavaScript execution and creates timing inconsistency.

## Security review

Before emitting JSON-LD:

1. Is every field public?
2. Does it describe visible/public content?
3. Are URLs safe and canonical?
4. Is user-generated text normalized?
5. Is serialized JSON safe for the HTML script context?
6. Are tenant and publication boundaries enforced?
7. Are dates/prices/availability sourced from authoritative data?
8. Are secrets and internal identifiers absent?

## Testing

Validate JSON-LD at three levels:

```text
syntax
→ valid JSON-LD

schema
→ expected Schema.org shape

business truth
→ matches the page/entity
```

The Next.js guide recommends tools such as Google's Rich Results Test and the Schema Markup Validator.

Use external validators as diagnostics, not as a replacement for unit/domain correctness.

## Common mistakes

### Raw `JSON.stringify` in `dangerouslySetInnerHTML`

Can create an HTML script-context injection risk when untrusted strings contain dangerous characters.

### SEO-only fake data

Structured data claims prices/reviews/availability not shown to users.

### Private fields

A public script exposes internal information.

### Inconsistent canonical URL

JSON-LD uses one URL while metadata and sitemap use another.

### Client-only structured data

Essential SEO markup appears only after browser-side fetching.

## Interview questions

**Why isn't `JSON.stringify()` alone enough for safe JSON-LD injection?**  
Because the JSON is embedded inside HTML; dangerous characters can affect the surrounding script context. The serialized payload must be safe for HTML insertion.

**Where should JSON-LD live in App Router?**  
Render it from a server page/layout close to the content it describes, using public server-owned data.

**Why share a domain SEO model between UI and JSON-LD?**  
It reduces drift in title, price, availability, URLs, publication state, and tenant visibility.

**Does TypeScript typing guarantee valid rich results?**  
No. It can validate object shape, but not business truth or search-engine eligibility.

## Exercise

Build a structured-data plan for an article page containing:

```text
headline
author
publish date
updated date
hero image
category breadcrumb
publisher
subscriber-only body
```

Decide what is public, what goes into Article/BreadcrumbList JSON-LD, how canonical URLs are generated, and how you prevent subscriber-only/private content from leaking into the serialized script.
