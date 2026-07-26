---
title: Robots, Sitemaps, Crawling & Indexing Policy
description: Design crawler access and indexability with robots metadata, robots.txt, sitemap routes, generateSitemaps, canonicals, and production SEO policy.
---

# Robots, Sitemaps, Crawling & Indexing Policy

Search visibility is not one switch.

Separate these questions:

```text
Can a crawler request this URL?
Should the document be indexed?
Which URL is canonical?
How does the crawler discover the URL?
```

Different mechanisms answer each question.

## Four distinct mechanisms

```text
robots.txt
→ crawl permission guidance

robots meta
→ document indexing/follow policy

canonical
→ preferred identity among related URLs

sitemap
→ discovery and metadata about crawlable/indexable URLs
```

Do not use one as a substitute for another.

## Page-level robots metadata

Use the Metadata API for document indexing directives:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}
```

This is appropriate for pages such as:

```text
internal search result variants
staging-only routes
account pages
thin utility pages
```

depending on product requirements.

## Google-specific directives

The metadata API supports Googlebot-specific settings:

```tsx
export const metadata = {
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}
```

Use crawler-specific directives only when there is a concrete requirement.

Avoid a complex policy matrix that nobody owns.

## `robots.txt`

A root `app/robots.txt` can define a static robots file.

Example:

```text
User-Agent: *
Allow: /
Disallow: /private/

Sitemap: https://acme.com/sitemap.xml
```

## `robots.ts`

For generated policy:

```tsx
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/account/', '/internal/'],
    },
    sitemap: 'https://acme.com/sitemap.xml',
  }
}
```

This is a public metadata route.

## `robots.ts` caching

Generated robots files are cached by default unless dynamic APIs or route configuration make them dynamic.

A crawler policy usually should be stable across requests.

If you are making robots output user-specific, the architecture is probably wrong.

## Robots.txt is not authorization

Never protect sensitive data with:

```text
Disallow: /secret-admin
```

Robots.txt is public guidance to compliant crawlers.

The route must still enforce authentication and authorization.

In fact, listing a path in robots.txt can reveal that the path exists.

## `noindex` vs disallow

A subtle failure:

```text
robots.txt blocks crawler from fetching page
+
page contains noindex
```

If the crawler cannot fetch the page, it may not see the `noindex` directive.

Use crawl and index controls deliberately rather than stacking them blindly.

## Private application routes

For authenticated product routes, your primary protection is security:

```text
authentication
authorization
private cache policy
no public data leakage
```

SEO metadata is secondary.

You may add `noindex`, but it does not replace access control.

## Sitemap basics

A static sitemap can be:

```text
app/sitemap.xml
```

For generated URLs, use:

```text
app/sitemap.ts
```

Example:

```tsx
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getPublishedProducts()

  return [
    {
      url: 'https://acme.com',
      lastModified: new Date('2026-01-01'),
    },
    ...products.map((product) => ({
      url: `https://acme.com/products/${product.slug}`,
      lastModified: product.updatedAt,
    })),
  ]
}
```

## Sitemap entries should represent real public URLs

Do not include:

```text
404 URLs
redirect sources
private pages
noindex pages
preview URLs
tracking variants
unpublished content
```

A sitemap is a statement about URLs you want crawlers to discover.

## Canonical and sitemap should agree

If a sitemap contains:

```text
https://acme.com/products/widget-old
```

but the page canonical says:

```text
https://acme.com/products/widget
```

and `/widget-old` redirects anyway, your signals are inconsistent.

Prefer emitting only the canonical final URL.

## `lastModified`

Use a meaningful content modification timestamp when you have one.

Bad:

```ts
lastModified: new Date()
```

for every URL on every sitemap generation, even when content did not change.

That destroys signal quality.

Prefer:

```ts
lastModified: article.updatedAt
```

when the timestamp reflects actual public content changes.

## `changeFrequency` and `priority`

These fields are available, but do not invent precision you cannot maintain.

A production SEO system should prefer correct URLs and meaningful modification data over decorative values.

## Localized sitemap entries

Current sitemap metadata supports language alternates.

For localized content:

```tsx
return [
  {
    url: 'https://acme.com/en/products/widget',
    alternates: {
      languages: {
        'en-US': 'https://acme.com/en/products/widget',
        'de-DE': 'https://acme.com/de/produkte/widget',
      },
    },
  },
]
```

Only list variants that really exist.

## Large sitemaps

Large sites may need multiple sitemap files.

You can either:

```text
place sitemap files under multiple route segments
```

or use `generateSitemaps`.

## `generateSitemaps`

Example:

```tsx
import type { MetadataRoute } from 'next'

export async function generateSitemaps() {
  const count = await countPublishedProducts()
  const pages = Math.ceil(count / 50_000)

  return Array.from({ length: pages }, (_, id) => ({ id }))
}

export default async function sitemap({
  id,
}: {
  id: Promise<string>
}): Promise<MetadataRoute.Sitemap> {
  const sitemapId = Number(await id)
  const products = await getPublishedProductsPage(sitemapId, 50_000)

  return products.map((product) => ({
    url: `https://acme.com/products/${product.slug}`,
    lastModified: product.updatedAt,
  }))
}
```

Current Next.js 16 passes the sitemap `id` as a Promise resolving to a string.

Do not copy old examples that assume a synchronous numeric `id`.

## Sitemap partitioning strategy

Partition by stable dimensions:

```text
product ID range
content type
locale
category
publication shard
```

Avoid partitions whose membership changes unpredictably on every request.

Stable partitions reduce crawler churn and operational confusion.

## Sitemap query performance

A sitemap is public infrastructure.

A naive implementation can become an expensive database scan.

Avoid:

```text
load all 2 million products into memory
then map to URLs
```

Prefer:

```text
bounded pages
indexed queries
precomputed/publication tables
cacheable results
```

Phase 15 and 17 go deeper on performance/operations.

## Sitemap freshness

Ask:

```text
How quickly must a new article appear in sitemap?
How quickly must deleted content disappear?
```

This is a cache/revalidation decision.

Do not assume `sitemap.ts` recomputes on every request; metadata routes are cached by default unless dynamic behavior changes the contract.

## Content publication workflow

A clean publishing architecture can coordinate:

```text
publish article
→ article page becomes public
→ metadata reflects public content
→ sitemap source includes article
→ cache/revalidation happens
```

Similarly:

```text
unpublish article
→ route stops serving public document
→ sitemap excludes it
→ social/metadata routes no longer expose it
```

SEO is part of content lifecycle, not a post-processing step.

## Staging and preview environments

Staging should not accidentally become indexed production content.

Possible controls include:

```text
access control
noindex metadata
robots policy
non-public DNS/network access
```

Do not rely on one layer if accidental indexing would be costly.

Also ensure staging never emits production sitemap entries pointing at staging URLs.

## Robots and deployments

A risky deployment pattern:

```text
production robots policy copied to preview
→ preview crawled
```

or:

```text
staging Disallow all copied to production
→ discovery collapses
```

Treat crawler policy as environment-critical configuration.

## Proxy exclusions

Phase 9 applies directly here.

`robots.txt` and sitemap routes should normally bypass auth/tenant redirects unless your architecture intentionally owns them through Proxy.

A crawler receiving:

```text
302 /login
```

for `/sitemap.xml` is a serious production defect.

## Response validation

For metadata routes, test:

```text
status = 200
content type correct
public URL reachable
no auth cookies required
no user/session variation
no accidental redirect
```

## Indexing debugging workflow

When a page is not indexed as expected:

1. Fetch the final public URL.
2. Check redirect chain.
3. Inspect HTTP status.
4. Inspect robots meta in final output.
5. Inspect `robots.txt` policy.
6. Inspect canonical URL.
7. Check sitemap inclusion.
8. Check whether the page is actually public and useful.
9. Check crawler-specific tooling/logs.
10. Avoid blaming framework metadata before validating these layers.

## Security

Crawler routes can leak content inventories.

If unpublished or private records appear in sitemap output, you have exposed their public URLs even if the page later denies access.

Always filter at the source:

```text
published = true
public tenant only
not soft-deleted
valid canonical slug
```

## Interview questions

**Does robots.txt secure a private route?**  
No. It is crawler guidance, not access control.

**Why can blocking a URL in robots.txt conflict with a page-level noindex plan?**  
The crawler may not fetch the page and therefore may never observe its noindex metadata.

**What changed in Next.js 16 for `generateSitemaps` IDs?**  
The generated sitemap function receives `id` as a Promise resolving to a string.

**Why should sitemap `lastModified` not always be `new Date()`?**  
It falsely signals that every URL changed whenever the sitemap is generated.

## Exercise

Design crawl/index policy for:

```text
/
/blog/[slug]
/search?q=...
/account
/admin
/preview/[token]
/products?page=2
/products?sort=price
```

For each choose:

- public access
- robots.txt policy
- robots meta policy
- canonical
- sitemap inclusion
- redirect behavior

Then explain what changes during publish, unpublish, and slug rename workflows.
