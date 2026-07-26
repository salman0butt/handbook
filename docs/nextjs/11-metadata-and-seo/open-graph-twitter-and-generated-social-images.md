---
title: Open Graph, Twitter Cards & Generated Social Images
description: Build reliable social previews with Open Graph, Twitter metadata, file conventions, ImageResponse, and generated image architecture.
---

# Open Graph, Twitter Cards & Generated Social Images

Social previews are public representations of a URL.

When a product page is pasted into a messaging app or social network, the crawler typically needs:

```text
title
description
canonical/public URL
preview image
image dimensions/type/alt
site/account context
```

Next.js can express these through metadata objects or file conventions.

## Open Graph metadata

Example:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  openGraph: {
    title: 'Acme Analytics',
    description: 'Understand product usage in real time.',
    url: 'https://acme.com/analytics',
    siteName: 'Acme',
    images: [
      {
        url: '/og/analytics.png',
        width: 1200,
        height: 630,
        alt: 'Acme Analytics dashboard',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}
```

Use `metadataBase` so relative image URLs resolve to the public origin.

## Twitter metadata

Example:

```tsx
export const metadata = {
  twitter: {
    card: 'summary_large_image',
    title: 'Acme Analytics',
    description: 'Understand product usage in real time.',
    creator: '@acme',
    images: ['/og/analytics.png'],
  },
}
```

Keep social metadata aligned with the document.

Do not write a social title that describes a different product/offer from the page users land on.

## Avoid duplicated sources of truth

A brittle route does this:

```text
page heading from database
metadata title from hard-coded string
OG image title from another hard-coded string
Twitter title from CMS field
```

Eventually they diverge.

Prefer one domain SEO model:

```ts
const seo = toProductSeo(product)
```

then map that model into:

```text
metadata title/description
Open Graph
Twitter
OG image generation
JSON-LD
```

while still letting each transport use the fields it actually needs.

## File-based social images

For a static social image, place:

```text
app/opengraph-image.png
app/twitter-image.png
```

or put them in a nested route segment:

```text
app/blog/opengraph-image.png
```

Next.js evaluates these files and automatically emits the corresponding metadata tags.

## File locality

A social image placed in a route segment belongs to that segment and descendants according to route metadata resolution.

This makes file conventions a strong fit for section-specific defaults.

Example:

```text
app/
  opengraph-image.png        → site fallback
  blog/
    opengraph-image.png      → blog fallback
    [slug]/
      opengraph-image.tsx    → article-specific image
```

## Alt text files

Static Open Graph and Twitter images can have companion alt files:

```text
opengraph-image.alt.txt
twitter-image.alt.txt
```

Alt text should describe the image meaningfully.

Do not use filename-like alt text such as:

```text
social-card-v4-final.png
```

## Static image size limits

Current Next.js metadata file conventions enforce build-time size limits for static social images.

Treat this as a useful production guardrail:

- optimize assets before committing
- avoid unnecessarily huge source files
- verify build output

A build failure is preferable to silently shipping a broken social image resource.

## Generated social images

For route-specific content, generate an image with:

```text
opengraph-image.tsx
twitter-image.tsx
```

Example:

```tsx
import { ImageResponse } from 'next/og'

export const alt = 'Acme product preview'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 72,
        }}
      >
        {product.name}
      </div>
    ),
    size
  )
}
```

## Generated image route mental model

Treat generated social-image files as specialized public route handlers:

```text
share crawler requests image URL
        ↓
Next.js metadata route resolves
        ↓
data/fonts/assets load
        ↓
image renderer generates response
        ↓
cache/runtime policy applies
```

This is not a client component screenshot.

## Generated images are cached by default

Generated OG/Twitter metadata routes are statically optimized/cached by default unless they use dynamic APIs or uncached data/configuration.

That means you must reason about freshness.

For product data that changes:

```text
product title changed
→ when should OG image change?
```

Choose the data/cache strategy deliberately.

Do not assume every social crawler request always regenerates the image.

## Reuse data safely

If the page and generated image need the same entity lookup, share a server data helper.

```ts
export const getPublicProduct = cache(async (slug: string) => {
  return db.product.findFirst({
    where: { slug, published: true },
  })
})
```

Keep authorization/publication filtering inside the data boundary.

An OG image endpoint is public.

## Never render private data into social images

Dangerous examples:

```text
user balance
private project title
unpublished article name
internal support ticket
signed download URL
```

If the route itself requires authentication, think carefully before generating public social metadata for it.

The safest default for private application routes is usually generic site metadata or no indexable/share-specific detail.

## `generateImageMetadata`

Use `generateImageMetadata` when one route segment needs multiple generated image variants.

Conceptually:

```tsx
export function generateImageMetadata() {
  return [
    {
      id: 'wide',
      size: { width: 1200, height: 630 },
      contentType: 'image/png',
    },
    {
      id: 'square',
      size: { width: 1200, height: 1200 },
      contentType: 'image/png',
    },
  ]
}
```

The image function can then generate output for the selected metadata entry.

Use this when multiple real consumers/representations need it, not merely because the API exists.

## Font loading

Generated social images often need brand fonts.

A production-friendly approach is to load known local font files on the server and pass the font data to `ImageResponse`.

Consider:

```text
font file size
runtime compatibility
cold-start cost
licensing
fallback behavior
```

Phase 12 covers application font optimization; this phase focuses on image-generation correctness.

## Local assets

Generated images can incorporate local assets.

Keep them stable and deployment-compatible.

Avoid architecture that assumes a writable persistent local filesystem in serverless environments.

Static bundled assets are different from runtime-generated files.

## Remote images

If the OG renderer fetches remote images:

- use trusted origins
- apply timeouts
- handle failures
- avoid arbitrary user-controlled URLs
- consider caching
- provide a fallback

Otherwise social preview generation can become an SSRF or availability boundary.

## Social image failure policy

A social image should degrade gracefully.

Example strategy:

```text
product data unavailable
→ render branded generic product card

remote logo unavailable
→ omit logo / use bundled fallback

font load fails
→ fallback font
```

Do not let a decorative remote dependency make every share preview fail.

## Text length

Generated cards have finite space.

Normalize public text:

```ts
function clampTitle(value: string) {
  return value.trim().slice(0, 80)
}
```

But do not truncate by raw character count without testing multiple scripts/languages.

Visual overflow should be tested with realistic data.

## Internationalization

For localized pages, align:

```text
page locale
metadata title/description
OG locale
OG/Twitter image language
canonical/hreflang
```

A German page that shares an English-only card may be acceptable by product choice, but it should be intentional.

## `openGraph.images` inheritance

Remember Phase 11's shallow merge rule.

If a child defines a new `openGraph` object, parent Open Graph fields can be replaced.

To preserve selected defaults, explicitly compose parent metadata or use file-based conventions where they better express ownership.

## Image URL cache busting

Next.js metadata files use production URLs suitable for caching.

Do not manually append random timestamps to social image URLs on every render.

That defeats caching and produces unstable preview identity.

If content changes require a new image, use the framework/data invalidation strategy appropriate to the route.

## Crawler testing

Do not test only by looking at your browser tab.

Social crawlers may:

```text
not execute application JS
cache previews aggressively
use different user agents
follow redirects differently
retain old image URLs
```

Test the final HTML and public image URL.

Then use platform-specific sharing debuggers when diagnosing cache behavior.

## Open Graph vs Twitter fallback

Some platforms can derive social preview values from Open Graph when dedicated Twitter metadata is absent.

But do not depend on undocumented crawler behavior for critical branding.

Define the metadata contract your product actually needs.

## Performance

Generated images can add server work.

Measure:

```text
image generation latency
cache hit ratio
external asset latency
font loading cost
response size
failure rate
```

If every share image performs multiple database/API calls, the metadata endpoint can become a surprising production hotspot.

## Security checklist

Before shipping generated share cards:

1. Is all rendered data public?
2. Are tenant boundaries enforced?
3. Are remote URLs allow-listed?
4. Are secrets excluded?
5. Is generated text bounded?
6. Is untrusted markup treated as text rather than executable HTML?
7. Are failure logs redacted?
8. Does the fallback remain safe?

## Interview questions

**When should you prefer `opengraph-image.png` over `opengraph-image.tsx`?**  
When the image is static for the route/section. Use generation only when content genuinely needs dynamic composition.

**Why can generated social images create SSRF risk?**  
The image endpoint runs server-side; fetching arbitrary user-controlled image URLs can reach internal or sensitive network locations.

**Are generated OG images regenerated on every request by default?**  
No. Metadata image routes are optimized/cached by default unless dynamic behavior changes that contract.

**Why should page and social image use the same public data helper?**  
It keeps publication, tenant, and content-selection rules consistent without an internal HTTP hop.

## Exercise

Design social metadata for a marketplace product page with:

```text
seller logo
product image
product title
price
locale
availability
```

Decide:

- which fields are safe to put on a public card
- static vs generated image
- fallback if seller logo fails
- cache/freshness policy
- how price changes propagate
- how tenant isolation is enforced
- what alt text should say
