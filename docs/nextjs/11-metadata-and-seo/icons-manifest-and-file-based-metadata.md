---
title: Icons, Manifest & File-Based Metadata
description: Use Next.js metadata file conventions for favicons, app icons, manifests, route-local assets, precedence, caching, and deployment-safe metadata resources.
---

# Icons, Manifest & File-Based Metadata

The Metadata API is not only an object API.

Next.js also treats specific files inside `app/` as metadata resources.

Examples:

```text
favicon.ico
icon.png
icon.tsx
apple-icon.png
opengraph-image.png
opengraph-image.tsx
twitter-image.png
manifest.json
manifest.ts
robots.txt
robots.ts
sitemap.xml
sitemap.ts
```

These conventions connect the filesystem directly to document metadata and public resources.

## Why file conventions are useful

A file convention expresses ownership physically:

```text
app/icon.png
→ app-wide icon

app/docs/opengraph-image.png
→ docs-section social image
```

This often reduces configuration drift.

The actual asset and the metadata reference cannot easily disagree because Next.js derives the metadata from the file.

## File-based metadata has priority

When a file convention and object/generated metadata both define the same metadata role, file-based metadata has higher priority.

Therefore, when debugging an unexpected icon or social image:

```text
check metadata object
check generateMetadata
check route-local metadata files
```

Do not inspect only the page component.

## `favicon.ico`

A favicon file belongs at the root of the `app` directory:

```text
app/favicon.ico
```

It represents the browser/site favicon.

Keep the favicon stable and small.

Do not generate a per-user favicon from request state.

## `icon`

An `icon` file can be placed in route segments:

```text
app/icon.png
app/admin/icon.png
```

Supported static formats include common web image types, and icons can also be generated with code.

This allows route sections to have distinct icon metadata when product design actually requires it.

## `apple-icon`

Use `apple-icon` for Apple touch/home-screen icon metadata.

Example:

```text
app/apple-icon.png
```

As with other metadata assets, test the final generated `<head>` output rather than assuming filename alone guarantees the intended experience.

## Generated icons

You can generate an icon with code:

```tsx
import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}

export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'black',
          color: 'white',
        }}
      >
        A
      </div>
    ),
    size
  )
}
```

Use generated icons when the content genuinely needs runtime/build-time generation.

For a fixed brand mark, a static file is simpler.

## Multiple generated images

`generateImageMetadata` can describe multiple icon/image variants from one metadata route.

Use it when you need real variants such as:

```text
16x16
32x32
180x180
light/dark variant
multiple social dimensions
```

Do not multiply variants without a consumer requirement.

## Route-local icons and product architecture

Route-local icons can make sense for:

```text
multi-brand products
white-label tenant sections
distinct embedded applications
```

But beware of request-private branding.

If tenant identity is resolved from an untrusted host or session, the metadata route must still use validated tenant configuration.

## `manifest.json`

For a static web app manifest:

```text
app/manifest.json
```

Example:

```json
{
  "name": "Acme",
  "short_name": "Acme",
  "description": "Acme workspace",
  "start_url": "/",
  "display": "standalone"
}
```

Use a static manifest when values are fixed.

## `manifest.ts`

For generated manifest data:

```tsx
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Acme',
    short_name: 'Acme',
    description: 'Acme workspace',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#111111',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
```

Type the result with `MetadataRoute.Manifest` so editor/compiler checks stay aligned with Next.js.

## Manifest is a public resource

Everything returned in a manifest is public.

Do not include:

```text
internal environment names
private tenant configuration
secrets
session-derived identifiers
unpublished launch information
```

## Generated manifest caching

`manifest.ts` is a specialized metadata route and is cached by default unless dynamic behavior changes that classification.

If your manifest truly changes by request, ask whether one URL should serve multiple manifest identities at all.

Often separate route origins/paths are clearer.

## Metadata routes and Proxy

Metadata files are public resources requested by browsers and crawlers outside normal page-navigation flows.

If your `proxy.ts` matcher is broad, exclude metadata resources that should not pass through application auth/routing logic.

Examples:

```text
/favicon.ico
/icon...
/robots.txt
/sitemap.xml
/opengraph-image...
```

Exact paths depend on your file placement and generated routes.

A Proxy redirect to `/login` for `robots.txt` is a production SEO bug.

## Metadata route caching is different from browser caching

A metadata route may be cached by Next.js, and the final HTTP response may also have browser/CDN caching behavior.

Keep these layers conceptually separate:

```text
Next.js server/output cache
vs
HTTP intermediary/browser cache
```

Phase 6's cache model still applies.

## Route segment configuration

Generated metadata images are specialized Route Handlers and can participate in route segment configuration according to their current API contract.

Do not copy old examples that assume legacy caching defaults without checking the current framework version.

## File hashing

Next.js may generate production resource URLs with hashes for metadata assets.

Do not hard-code assumptions about the final emitted asset filename.

Use the framework convention and inspect the generated head/output.

## Static assets vs metadata files

A file in `public/` is simply a public asset:

```text
public/brand/icon.png
```

A recognized metadata file inside `app/` participates in Metadata API behavior:

```text
app/icon.png
```

Choose based on whether you want automatic metadata integration or only a stable asset URL.

## When explicit `metadata.icons` is useful

The metadata object also supports icon configuration.

Use explicit configuration when you need a shape that file conventions do not express well.

But for ordinary icons, file-based metadata reduces duplication.

## PWA caution

A web app manifest alone does not make an application a high-quality PWA.

You still need to reason about:

```text
installability
service worker/offline strategy
icons
start URL
navigation behavior
updates
permissions
platform behavior
```

Do not market a manifest as complete offline/PWA architecture.

## Base path deployments

If your application uses a base path or non-root deployment, verify:

```text
manifest start_url
icon URLs
scope
social image URLs
sitemap URLs
```

against the deployed public path.

Do not assume `/` always maps to the public application root.

## Multi-zone applications

In a multi-zone architecture, metadata resources need one clear owner.

Avoid two zones competing to emit different:

```text
/favicon.ico
/robots.txt
/sitemap.xml
```

for the same public origin.

Assign root metadata responsibility explicitly.

## CDN behavior

Icons and social assets are ideal cache candidates when immutable.

Generated resources that change with content need a freshness strategy.

A useful classification:

```text
brand favicon
→ highly stable

section OG image
→ stable until deployment/content update

article OG image
→ changes with article metadata

manifest
→ changes with product/install settings
```

## Failure modes

### Stale favicon

Browsers cache favicons aggressively. Changing the source file may not appear immediately for every user.

### Wrong social image despite metadata object

A route-local file convention may be overriding the object field.

### Auth redirect for metadata resource

Proxy matcher is too broad.

### Broken manifest icons

Manifest paths do not match deployed public URLs.

### Tenant icon leak

Generated metadata selected tenant branding from untrusted request information.

## Testing checklist

Verify public requests for:

```text
/favicon.ico
/icon route(s)
/apple-icon route(s)
/manifest.webmanifest or manifest path
/opengraph-image route(s)
/twitter-image route(s)
/robots.txt
/sitemap.xml
```

Check:

- status code
- content type
- redirect behavior
- cache behavior
- public host/path
- no authentication dependency
- no private information

## Interview questions

**Why prefer file-based icons when possible?**  
The asset itself becomes the source of truth and Next.js automatically emits matching metadata, reducing configuration drift.

**Why can Proxy break SEO metadata routes?**  
A broad matcher may redirect or mutate crawler/browser requests for icons, sitemaps, robots, or social images before the metadata route resolves.

**Is `manifest.ts` a client-side file?**  
No. It is a server-generated metadata route that returns public manifest data.

**What is the difference between `public/icon.png` and `app/icon.png`?**  
The public file is just an asset URL; the recognized app metadata file also participates in automatic document metadata generation.

## Exercise

Design metadata files for a SaaS with:

```text
public marketing site
/docs section
/app authenticated product
three white-label enterprise domains
```

Specify:

- favicon ownership
- section OG images
- manifest ownership
- Proxy exclusions
- which branding can be dynamic
- how tenant domains are validated
- caching/freshness expectations
