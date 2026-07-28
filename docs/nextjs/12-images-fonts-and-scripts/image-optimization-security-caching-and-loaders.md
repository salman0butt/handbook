---
title: Image Optimization, Security, Caching & Loaders
description: Configure the Next.js image optimizer as a controlled transformation boundary with strict source allow-lists, quality limits, cache policy, format negotiation, and safe custom loaders.
---

# Image Optimization, Security, Caching & Loaders

The image optimizer is not just a compression helper.

It is a server-side fetch-and-transform boundary:

```text
browser
  ↓
/_next/image?url=...&w=...&q=...
  ↓
Next.js validates request
  ↓
source image fetched
  ↓
decode / resize / encode
  ↓
optimized response cached
  ↓
browser
```

That architecture creates performance benefits and security responsibilities.

## What the optimizer does

For an allowed source, the default optimizer can:

- fetch source bytes
- validate requested dimensions/quality
- resize to an allowed candidate width
- encode a supported output format
- cache optimized variants
- return cache and content headers

Every unique combination can represent work and cache storage.

So configuration should constrain the transformation space.

## Remote sources need an allow-list

Use `images.remotePatterns` for external origins:

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.example.com',
        port: '',
        pathname: '/products/**',
      },
    ],
  },
}

export default nextConfig
```

This should describe the real source boundary as narrowly as practical.

## Pattern matching is part of your security model

A useful mental model:

```text
application data says
→ "render this URL"

Next.js config says
→ "the optimizer is allowed to fetch URLs matching this policy"
```

Both layers matter.

Do not assume a database URL is safe simply because it exists in a trusted table.

## Avoid broad wildcards

An overly broad rule:

```text
https://**
```

turns the optimizer toward generic proxy behavior.

That can create:

- server-side request forgery exposure
- bandwidth abuse
- cache pollution
- transformation CPU abuse
- unexpected data access

Prefer explicit protocol, hostname, path, and query constraints.

## Search parameters

If a source URL requires a fixed query contract, include that policy.

For example:

```ts
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'cdn.example.com',
      pathname: '/media/**',
      search: '?v=2',
    },
  ],
}
```

The exact pattern should reflect your CDN/application semantics.

Omitting a search restriction is broader than explicitly matching one.

## Local source patterns

Next.js can also restrict local image paths.

This matters when application code constructs local source URLs dynamically.

Current Next.js 16 behavior hardened local image query-string handling. If your local image source includes search parameters, define the intended `localPatterns` policy rather than relying on old permissive assumptions.

## `domains` is legacy configuration

Older examples use:

```ts
images: {
  domains: ['assets.example.com'],
}
```

Modern code should prefer `remotePatterns` because it can constrain more than hostname.

A hostname-only allow-list cannot express protocol, path, port, and query policy with the same precision.

## Local IP protection

Current Next.js 16 blocks optimization of local/private IP sources by default.

That is a security control.

An attacker should not be able to turn a public image optimizer into:

```text
public request
→ server fetches 127.0.0.1
→ server fetches private VPC address
→ server fetches internal admin service
```

The configuration option `dangerouslyAllowLocalIP` should remain false unless you have a deliberate trusted-network use case and understand the SSRF consequences.

## Redirect limits

A permitted remote URL can redirect.

Current Next.js limits image-source redirects rather than following an unbounded chain.

The default maximum is **3 redirects**.

You can lower it, including setting it to `0` when redirects should be rejected.

Why this matters:

```text
allowed origin
→ redirects to unexpected origin
→ redirects again
→ internal or expensive target
```

Redirect policy is part of the fetch trust boundary.

## Source response-size limits

Current Next.js also has a maximum source response-body control for image optimization.

The default source fetch limit is **50 MB**.

This protects the optimizer from attempting to ingest arbitrarily large upstream files.

Your application should usually apply a much smaller upload/source policy before an image ever reaches this layer.

The framework limit is a defensive ceiling, not your product's ideal media specification.

## Quality allow-list

In Next.js 16, image qualities are explicitly constrained.

Default:

```ts
images: {
  qualities: [75],
}
```

If you need multiple quality levels:

```ts
images: {
  qualities: [60, 75, 85],
}
```

Then:

```tsx
<Image quality={85} ... />
```

can use an allowed value.

The point is not to offer every integer from 1–100.

A bounded set limits optimizer variants and makes visual/performance policy predictable.

## Why quality cardinality matters

Imagine a public endpoint that allowed:

```text
100 qualities
× many widths
× many source URLs
× multiple formats
```

The variant space becomes large.

Restricting qualities reduces:

- CPU work
- cache-key cardinality
- disk usage
- abuse surface

## Width allow-lists

Next.js uses configured device and image widths to determine valid transformation targets.

Typical policy comes from:

```ts
images: {
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  imageSizes: [32, 48, 64, 96, 128, 256, 384],
}
```

Current defaults should usually be sufficient unless your design system has measured reasons to change them.

Do not add dozens of near-identical widths “for precision.”

More widths mean more possible optimized variants.

## Current `imageSizes`

The modern Next.js default image-size candidate list is:

```text
32
48
64
96
128
256
384
```

These smaller sizes supplement device sizes for fixed/small image slots.

## Output formats

The default optimized format set includes WebP:

```ts
images: {
  formats: ['image/webp'],
}
```

You can configure additional supported formats such as AVIF.

Trade-off:

```text
AVIF
→ often smaller output
→ more expensive encoding

WebP
→ broad support
→ generally lower encoding cost
```

Measure your traffic and cache topology.

## `Accept` header matters

Format negotiation depends on the browser's `Accept` header.

If you self-host behind a reverse proxy/CDN:

```text
browser Accept
→ proxy/CDN
→ Next image optimizer
```

The intermediary must forward the relevant header correctly.

Otherwise Next.js may not know which output formats the client supports.

Your cache layer must also vary safely when output differs by accepted format.

## Image cache TTL

Current Next.js 16 uses a higher default minimum cache TTL than older releases: **14,400 seconds (4 hours)**.

The effective cache lifetime is influenced by both:

- configured `minimumCacheTTL`
- upstream image cache-control behavior

The optimizer will not magically know when a remote file at the same URL has changed.

## Version image URLs when content changes

A reliable media model uses immutable or versioned identity:

```text
/products/123/hero.4f8a9c.jpg
```

or:

```text
/products/123/hero.jpg?v=42
```

subject to your remote pattern/query policy.

This is easier to reason about than trying to purge every derived optimizer variant after mutating bytes behind one stable URL.

## Static imports and immutable assets

Build-managed static image imports can use hashed source identity.

That makes them ideal for long-lived caching:

```text
content changes
→ hash changes
→ new URL

content unchanged
→ same URL
→ safe immutable cache
```

This pattern is simpler than mutable URLs.

## Disk cache controls

Current stable Next.js exposes image optimizer disk-cache controls including `maximumDiskCacheSize`.

When not explicitly configured, Next.js can size the image disk cache relative to available disk at startup.

The cache uses eviction behavior rather than growing forever.

Setting the disk-cache size to `0` disables that disk cache.

This is an operations decision, not just application code.

Ask:

```text
Is the filesystem persistent?
How much disk exists?
Are instances ephemeral?
Is an external cache in front?
How many image variants exist?
```

## Custom cache handlers

If your deployment uses a custom image cache handler, understand that framework disk-cache sizing does not control that external cache implementation.

The custom handler owns persistence, eviction, and topology behavior.

## Cache topology matters

On one long-lived server:

```text
request
→ local optimizer
→ local cache
```

On autoscaled instances:

```text
request A → instance 1 cache
request B → instance 2 cache
```

On a CDN-backed deployment:

```text
browser
→ CDN cache
→ origin optimizer only on miss
```

The same Next.js code can have very different cost profiles.

## SVG security

SVG is code-capable markup, not merely pixels.

Next.js does not enable arbitrary SVG optimization by default.

For ordinary SVG assets, `unoptimized` is often appropriate.

If your architecture enables `dangerouslyAllowSVG`, combine it with deliberate response protections such as:

```text
Content-Disposition: attachment
restrictive Content-Security-Policy / sandbox
trusted source policy
```

Do not allow arbitrary user SVG and then treat it like a harmless JPEG.

## Content disposition

Modern Next.js image responses default toward `attachment` content disposition for safer direct navigation behavior.

If you change content-disposition policy, review the security implications of opening active image formats directly in the browser.

## Custom content security policy

Image optimizer responses can be given a restrictive CSP through image configuration.

This is especially relevant if SVG delivery is allowed.

The policy should reflect the actual content types and trust model.

## Custom loader

A loader maps image intent to a URL transformation service.

Example:

```tsx
const cloudLoader = ({ src, width, quality = 75 }) => {
  return `https://img.example.com${src}?w=${width}&q=${quality}`
}

<Image
  loader={cloudLoader}
  src="/products/123.jpg"
  width={1200}
  height={800}
  alt="Keyboard"
/>
```

The custom service now owns transformation semantics.

## Global `loaderFile`

For a centralized provider integration, configure a loader file rather than repeating function props across components.

Conceptually:

```text
Image component
→ framework candidate widths
→ loader function
→ provider URL
→ provider performs transformation
```

Keep the loader pure and deterministic.

## Loader security

A loader should not become:

```text
user URL
→ concatenated into privileged internal image service
```

Validate source identity before transformation.

Separate:

```text
public image identifier
from
internal storage path / credentials
```

Never embed secrets in URLs returned to the browser.

## When to use a third-party image CDN

A provider may be useful when you need:

- global transformation infrastructure
- large media catalogues
- smart crops
- DAM/CMS integration
- signed transformations
- persistent global cache
- advanced format/quality policy

But the application still owns:

- source trust
- responsive `sizes`
- alt text
- geometry
- LCP policy
- cache identity

A CDN does not solve incorrect layout semantics.

## Avoid transformation explosion

For a catalogue with one million source images, this configuration matters:

```text
8 widths
× 3 qualities
× 2 formats
= up to 48 variants/source
```

Not every source will generate every variant, but cardinality should be part of capacity planning.

## Abuse controls

For high-traffic/self-hosted systems, consider infrastructure controls around the image optimizer:

- request rate limits
- CDN caching
- origin concurrency
- CPU/memory monitoring
- upstream timeouts
- source-size limits
- observability on cache misses and transformation latency

Do not treat the optimizer as free compute.

## Debugging optimizer failures

A 400 from the image optimizer can mean policy rejection rather than source failure.

Check:

```text
source URL
remote/local pattern match
requested width
requested quality
source response type
redirect chain
source body size
private/local IP rule
```

A 5xx may involve:

```text
upstream timeout
bad image bytes
decode failure
resource exhaustion
filesystem/cache problem
```

Use server logs plus a direct source fetch from the deployment environment.

## Common mistakes

### Broad remote allow-list

This increases SSRF and abuse surface.

### Unlimited quality choices

This multiplies cache variants without clear product value.

### Mutable bytes behind one permanent URL

Users can receive stale derived variants.

### Assuming local cache exists on serverless instances

Deployment topology decides persistence.

### Enabling SVG because “it is an image”

SVG has an active-content threat model.

### Custom loader leaks credentials

Browser-facing URLs are public to the browser.

## Production design checklist

1. Which origins can be optimized?
2. Which paths and search params are permitted?
3. Can those origins redirect?
4. Are private IPs blocked?
5. What source body limit applies?
6. Which widths are valid?
7. Which qualities are valid?
8. Which output formats are enabled?
9. Does infrastructure forward `Accept` correctly?
10. Where is optimized output cached?
11. How is stale mutable media invalidated/versioned?
12. Is SVG allowed, and why?
13. Who owns transformation when using a custom loader?
14. What prevents CPU/cache abuse?

## Interview questions

**Why are `remotePatterns` better than the old `domains` option?**  
They let you constrain protocol, host, port, path, and search behavior instead of trusting an entire hostname.

**Why does Next.js block local IP image optimization by default?**  
Because a public optimizer that fetches arbitrary private-network URLs can become an SSRF gateway into internal infrastructure.

**Why is `qualities` an allow-list in Next.js 16?**  
It limits transformation/cache cardinality and creates an explicit product policy for accepted output quality.

**Why can changing a remote image at the same URL be difficult to invalidate?**  
The optimizer and intermediary caches may already hold derived variants. Versioned/immutable source URLs give cache identity a deterministic relationship to content.

## Exercise

Design the image optimizer policy for a marketplace where images come from:

```text
cdn.market.example/products/**
user-content.market.example/avatars/**
private S3 bucket
merchant-supplied external URLs
```

Specify:

- remote patterns
- whether merchant arbitrary URLs are accepted
- quality list
- widths
- formats
- redirect policy
- source-size policy
- private-IP policy
- cache topology
- SVG policy
- invalidation/versioning model
- abuse monitoring

Then explain how your design prevents the optimizer from becoming a general-purpose network proxy.
