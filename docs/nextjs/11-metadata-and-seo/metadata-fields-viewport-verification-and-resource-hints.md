---
title: Metadata Fields, Viewport, Verification & Resource Hints
description: Use the broader Metadata API correctly, separate viewport from metadata, and understand where HTTP headers and resource hints belong.
---

# Metadata Fields, Viewport, Verification & Resource Hints

The Metadata API supports far more than title, description, and social images.

The important production skill is not memorizing every field. It is knowing **which layer owns which concern**.

A useful map is:

```text
document identity
→ title, description, authors, creator, publisher, category

URL relationships
→ canonical, language alternates, app links, archives/assets/bookmarks

crawler/share metadata
→ robots, Open Graph, Twitter, verification

browser presentation metadata
→ viewport, theme color, color scheme

HTTP policy
→ response headers, not metadata object

resource hints
→ ReactDOM preload/preconnect/prefetchDNS APIs
```

## General document fields

Next.js supports fields such as:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  applicationName: 'Acme',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  keywords: ['analytics', 'product intelligence'],
  authors: [
    { name: 'Acme Editorial Team', url: 'https://acme.com/about' },
  ],
  creator: 'Acme',
  publisher: 'Acme',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}
```

Use fields only when they represent real document/product information.

Do not turn metadata into a dumping ground for marketing keywords.

## Keywords

Search engines do not reward a giant list of repeated keywords simply because the field exists.

A bad metadata architecture:

```text
keywords = every term the marketing team wants to rank for
```

A better approach:

```text
page content actually answers a topic
metadata accurately summarizes that page
internal linking and canonical structure are coherent
```

Metadata cannot compensate for weak content architecture.

## Authors, creator, publisher

These fields are useful when ownership matters.

For content platforms, keep distinctions clear:

```text
author
→ person/entity responsible for the content

creator
→ creator metadata

publisher
→ publishing organization
```

Do not expose private author records or unpublished contributors.

## Referrer policy

The metadata API can emit a referrer meta tag.

But your production security/privacy policy may also be managed through HTTP headers.

Do not set conflicting policies across layers without understanding precedence and browser behavior.

For site-wide security headers, Next.js `headers()` configuration or your reverse proxy/CDN may be a clearer owner.

## Verification metadata

Search platforms often require site verification tokens.

Example:

```tsx
export const metadata = {
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: {
      me: ['https://social.example/@acme'],
    },
  },
}
```

Treat verification tokens as deployment configuration.

They may be public by design once emitted, but they should still come from controlled configuration rather than being copied randomly across route files.

## Verification ownership

Site-wide verification belongs near the public site root.

Avoid this:

```text
50 pages each define the same Google verification token
```

Prefer one root layout policy unless different route trees genuinely represent different properties.

## Facebook and Pinterest metadata

The Metadata API supports platform-specific fields such as Facebook application/admin metadata and Pinterest rich-pin configuration.

Use them only when your integration requires them.

Do not add platform metadata speculatively.

Every extra integration creates another configuration surface to maintain and audit.

## App Links

App Links can describe native-app destinations:

```tsx
export const metadata = {
  appLinks: {
    ios: {
      url: 'acme://products/widget',
      app_store_id: '123456789',
    },
    android: {
      package: 'com.acme.app',
      app_name: 'Acme',
    },
    web: {
      url: 'https://acme.com/products/widget',
      should_fallback: true,
    },
  },
}
```

Keep deep-link metadata synchronized with the actual mobile routing contract.

A broken app-link scheme is worse than no app-link metadata because it creates failed navigation.

## Archives, assets, bookmarks, category

Next.js can emit less-common link/meta relationships such as:

```text
archives
assets
bookmarks
category
```

These are specialized fields.

Use them only when their semantic meaning matches your application.

Do not confuse “supported by the API” with “required for every site.”

## `other`

The `other` field can emit custom metadata names:

```tsx
export const metadata = {
  other: {
    'custom-product-id': 'abc123',
  },
}
```

This is an escape hatch.

Before using it, verify that a first-class Metadata API field does not already exist.

Prefer typed built-in fields whenever possible.

## Unsupported metadata belongs elsewhere

Some head concerns are intentionally not modeled as Metadata API fields.

Examples include:

```text
HTTP-equivalent policy
resource preloads
preconnects
DNS prefetch
stylesheets
scripts
```

Use the layer designed for them.

## `<meta http-equiv>`

If the desired behavior is really an HTTP response policy, use an HTTP header where appropriate.

Examples:

```text
Content-Security-Policy
X-Content-Type-Options
Referrer-Policy
Permissions-Policy
```

Phase 9 introduced response-header ownership, and Phase 13 goes deeper on security policy.

## Resource hints

For resource hints, React DOM APIs are the intended mechanism rather than trying to force them into metadata:

```tsx
'use client'

import * as ReactDOM from 'react-dom'

export function ResourceHints() {
  ReactDOM.preconnect('https://cdn.example.com')
  ReactDOM.prefetchDNS('https://api.example.com')
  ReactDOM.preload('/critical.css', { as: 'style' })
  return null
}
```

Use resource hints only after measurement.

Aggressive preloading can waste bandwidth and compete with truly critical resources.

Phase 15 owns deep performance tuning.

## Viewport moved out of metadata

The old `metadata.viewport` option is deprecated.

Use the dedicated `viewport` export or `generateViewport` instead.

Static example:

```tsx
import type { Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: '#111111',
}
```

## Default viewport

Next.js already emits a sensible default viewport for ordinary responsive applications.

Do not override it without a reason.

Bad habit:

```text
copy maximumScale/userScalable settings from an old template
```

That can harm accessibility, especially if it prevents zooming.

## Theme color

A static theme color:

```tsx
export const viewport = {
  themeColor: '#111111',
}
```

You can also specify media-aware values:

```tsx
export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111111' },
  ],
}
```

Keep it aligned with actual UI themes.

## Color scheme

The viewport configuration can declare the supported/preferred color scheme:

```tsx
export const viewport = {
  colorScheme: 'dark',
}
```

This influences browser UI/form-control expectations.

It is not a replacement for your application's CSS/theme implementation.

## Dynamic `generateViewport`

Use `generateViewport` only when viewport output genuinely depends on dynamic data:

```tsx
export async function generateViewport({
  params,
}: LayoutProps<'/brands/[brand]'>) {
  const { brand } = await params
  const theme = await getPublicBrandTheme(brand)

  return {
    themeColor: theme.primaryColor,
  }
}
```

If the value is stable, use the static `viewport` object.

## Viewport cannot stream like metadata

This distinction matters.

Dynamic metadata can be streamed for supported browsers.

Viewport affects the initial page presentation and therefore cannot be appended later in the same way.

If `generateViewport` requires request-time data, the route can become blocking/dynamic.

## Viewport with Cache Components

With Cache Components, external viewport data that does not depend on request-time state can be cached:

```tsx
export async function generateViewport() {
  'use cache'

  const theme = await getSiteTheme()

  return {
    themeColor: theme.primary,
  }
}
```

This allows prerendering to include the viewport result.

## Request-time viewport is expensive

If viewport depends on cookies/headers/request state, the entire route may need to wait for it.

Ask whether the value really belongs in viewport metadata.

Example anti-pattern:

```text
read user's theme cookie
→ generate per-request theme-color
→ make entire document wait
```

A CSS/client theme strategy may be more appropriate depending on product requirements.

## Multiple root layouts

If one application area genuinely needs request-time viewport behavior, a separate root layout can isolate that cost from the rest of the application.

This is a route-architecture decision, not merely a metadata tweak.

## `metadata` vs `viewport`

Keep the separation explicit:

```text
Metadata
→ document/crawler/share metadata

Viewport
→ browser viewport/theme presentation metadata
```

Do not teach deprecated `metadata.viewport` as current practice.

## Type safety

Use framework types:

```tsx
import type { Metadata, Viewport } from 'next'
```

Type safety helps catch invalid field names/shapes as the API evolves.

It does not validate SEO strategy.

## Security and privacy

Review metadata fields for public exposure.

Particularly scrutinize:

```text
author URLs
app deep links
verification tokens
custom `other` fields
tenant branding
publisher identity
```

Nothing in metadata should depend on authorization-protected data unless the route itself intentionally exposes that value publicly.

## Common mistakes

### Using deprecated `metadata.viewport`

Use the dedicated viewport API.

### Disabling zoom by habit

Can create accessibility problems.

### Using `other` for first-class fields

Loses type safety and maintainability.

### Putting HTTP security policy in metadata

Use headers for HTTP behavior.

### Preloading everything

Resource hints can harm performance when overused.

## Interview questions

**Why is viewport separate from metadata now?**  
Viewport affects initial browser presentation and has different rendering constraints, so Next.js exposes a dedicated API.

**Can dynamic viewport stream after the initial UI like metadata?**  
No. If it needs request-time data, the page may need to block until viewport resolves.

**When should you use `metadata.other`?**  
Only for metadata not represented by a built-in field; prefer typed first-class fields when available.

**Where should HTTP security policy live?**  
In response headers/Proxy/infrastructure as appropriate, not as arbitrary metadata tags.

## Exercise

Audit this requirement set:

```text
site verification
native app deep links
dark/light browser theme color
CSP
DNS prefetch for analytics
article authors
custom partner meta tag
```

Assign each to:

- Metadata API
- Viewport API
- HTTP headers
- ReactDOM resource hint API

Then explain which values belong at root, section, or page level.
