---
title: Titles, Descriptions, Canonicals, Alternates & metadataBase
description: Design document identity with title templates, descriptions, canonical URLs, language alternates, and safe URL composition.
---

# Titles, Descriptions, Canonicals, Alternates & metadataBase

Good SEO metadata starts with document identity.

For each indexable route, you should be able to answer:

```text
What is this document called?
What does it represent?
What URL is authoritative?
Are there language or format alternatives?
```

Next.js gives you structured APIs for each part.

## Title basics

A page title can be a simple string:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing',
}
```

This produces the document title for that route.

## Title templates

Use a layout to define a site or section naming pattern:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Acme',
    template: '%s | Acme',
  },
}
```

Then a child page can declare:

```tsx
export const metadata = {
  title: 'Pricing',
}
```

Conceptually:

```text
Pricing
+
%s | Acme
=
Pricing | Acme
```

## `title.default`

A template needs a default title for children that do not define their own title.

```tsx
export const metadata = {
  title: {
    default: 'Acme',
    template: '%s | Acme',
  },
}
```

The default also makes the section's identity explicit.

## Templates apply downward

A title template applies to child route segments.

It does not retroactively transform a title defined in the same segment.

That means title ownership should usually live in layouts:

```text
root layout
→ global brand template

blog layout
→ optional blog-specific template

blog page
→ article title
```

A page is terminal, so defining a template on a page generally has no useful child effect.

## `title.absolute`

Sometimes a child title should ignore parent templates.

```tsx
export const metadata = {
  title: {
    absolute: 'Acme Developer Conference 2026',
  },
}
```

Use this deliberately.

If every child bypasses the template, the template probably does not belong there.

## Description

The description should accurately summarize the document:

```tsx
export const metadata = {
  description: 'Compare Acme plans for teams of every size.',
}
```

Avoid:

```text
repeating the title
keyword lists
boilerplate copied across thousands of pages
private/internal state
```

For entity pages, descriptions often come from content data:

```tsx
return {
  title: product.name,
  description: product.seoDescription ?? product.summary,
}
```

Keep fallbacks intentional and bounded.

## `metadataBase`

URL-based metadata often requires fully qualified URLs.

A root layout can establish the base:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://acme.com'),
}
```

Child metadata can then use relative paths:

```tsx
export const metadata = {
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    images: ['/og/pricing.png'],
  },
}
```

Next.js resolves them against the base URL.

## Production base URL ownership

Do not scatter literal hosts throughout route files.

Prefer one trusted server configuration source:

```ts
export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://acme.com'
)
```

But be careful with fallbacks.

A production deployment should not silently emit canonicals for the wrong host because an environment variable is missing.

For critical SEO configuration, fail clearly during build/startup when required.

## Preview deployments

Preview URLs are useful for testing but usually should not become the canonical host for public content.

Bad outcome:

```text
production page canonical
→ https://feature-123.preview-host.example/products/widget
```

Instead separate:

```text
runtime request host
from
public canonical site origin
```

Canonical identity should come from product/business configuration, not whichever host happened to receive the request.

## Canonical URLs

Use `alternates.canonical`:

```tsx
export const metadata = {
  alternates: {
    canonical: '/pricing',
  },
}
```

With `metadataBase`, this resolves to an absolute canonical URL.

## Canonicalization is not redirection

These are related but different:

```text
redirect
→ sends users/crawlers to another URL

canonical metadata
→ declares preferred document identity
```

If `/old-product` should no longer exist separately, redirecting to `/products/new-name` is often stronger than merely adding a canonical.

Do not use canonical metadata to hide broken URL architecture.

## Query parameters

Many applications produce URL variants:

```text
/products?sort=price
/products?sort=name
/products?page=2
/products?utm_source=newsletter
```

You need a deliberate indexing policy.

For tracking-only parameters, the canonical will usually point to the clean content URL.

For pagination or meaningful filtered pages, the decision depends on whether each variant represents useful standalone content.

Do not automatically canonicalize every query URL to page 1 without considering content discovery and navigation semantics.

## Canonical builder

A small helper can centralize URL safety:

```ts
export function canonicalUrl(pathname: string) {
  return new URL(pathname, siteUrl).toString()
}
```

Keep the input restricted to application-owned paths.

Do not feed arbitrary user-controlled absolute URLs into canonical generation.

## Language alternates

Use `alternates.languages` when the same conceptual content exists in multiple language/locale variants:

```tsx
export const metadata = {
  alternates: {
    canonical: '/en/products/widget',
    languages: {
      'en-US': '/en/products/widget',
      'de-DE': '/de/products/widget',
      'fr-FR': '/fr/products/widget',
    },
  },
}
```

This produces alternate-language links.

## Alternate URLs must really exist

Do not generate a full locale matrix when content has not actually been localized.

Bad:

```text
hreflang de-DE
→ page renders English fallback content
```

Search engines and users should receive the locale you claim.

Generate alternates from actual content availability.

## `x-default`

For international sites, you may choose to provide an `x-default` alternate for the fallback/default experience.

Treat this as part of the site's localization strategy, not as a default checkbox.

## Media/type alternates

The metadata API can also express alternate media or content types.

Examples include:

```text
RSS feed
alternate document format
special media representation
```

Use them only when the alternate resource is real and maintained.

## Canonicals in multi-tenant applications

A multi-tenant product may support:

```text
acme.example.com/docs
contoso.example.com/docs
custom-customer-domain.com/docs
```

Canonical policy must answer:

```text
Is each tenant host independently canonical?
Is there one public marketplace URL?
Are custom domains aliases or primary identities?
```

Do not derive this from an untrusted `Host` header without validating the tenant domain first.

Phase 9's trusted host/Proxy model applies here.

## Canonicals behind reverse proxies

If the public origin differs from the internal service origin, avoid constructing canonicals from server-internal host information.

Example mistake:

```text
canonical = http://next-app:3000/products/widget
```

Canonical URLs are public product URLs.

The deployment layer and application configuration must agree on the public origin.

## Open Graph URL consistency

Your canonical URL and `openGraph.url` usually represent the same public document identity.

Avoid inconsistent outputs such as:

```text
canonical → https://acme.com/product/widget
og:url    → https://www.acme.com/products/widget?ref=twitter
```

Choose one URL policy and reuse it.

## Structured-data URL consistency

JSON-LD entity/page URLs should also align with canonical identity when they describe the same document or entity.

A useful rule:

```text
canonical metadata
Open Graph URL
sitemap URL
structured-data page URL
internal preferred links
```

should not disagree without a reason.

## Robots interaction

A canonical does not override `noindex` in a magical way.

If a page is intentionally non-indexable, use the appropriate crawl/index policy rather than relying on canonical alone.

Likewise, do not include intentionally non-indexable URLs in your sitemap.

## Duplicate content architecture

For every duplicate-looking URL pair, classify the cause:

```text
tracking parameter
sorting/filtering
legacy path
case/trailing slash variant
locale variant
tenant/custom domain
print/mobile alternate
intentional separate document
```

Then choose the correct mechanism:

```text
redirect
canonical
alternate/hreflang
robots policy
URL normalization
independent indexing
```

## Metadata helpers should be deterministic

A canonical helper should not depend on browser state or unstable request values.

Good SEO metadata should be reproducible for the same public document identity.

## Security

Do not expose:

```text
private organization names
internal IDs when they should not be public
unpublished slugs
signed URLs
session-dependent query parameters
```

in canonical or alternate metadata.

Metadata becomes part of public HTML/crawler output.

## Testing checklist

For an indexable page, verify:

1. final title
2. title template application
3. description
4. canonical URL
5. alternate language URLs
6. Open Graph URL alignment
7. sitemap URL alignment
8. no preview/internal hostname leakage
9. behavior with trailing slash/base path if configured
10. behavior in production HTML

## Interview questions

**What does `metadataBase` solve?**  
It provides a base origin/path for URL-based metadata fields so child routes can safely use relative URLs.

**What is the difference between a redirect and a canonical?**  
A redirect changes navigation; a canonical declares the preferred indexed identity while the current URL may still return content.

**Why are title templates usually defined in layouts?**  
Templates apply to child segments, and layouts naturally own shared route-tree metadata policy.

**Why is using the incoming Host header directly for canonical generation risky?**  
The host may be untrusted or infrastructure-specific; canonical identity should come from validated public-domain configuration.

## Exercise

Given:

```text
/shop/widget
/shop/widget?utm_source=email
/products/widget
/de/produkte/widget
preview-123.example-host.com/shop/widget
```

Design:

- redirects
- canonical URL
- language alternates
- `metadataBase`
- Open Graph URL
- sitemap inclusion

Explain which URL becomes the stable public identity and why.
