---
title: Image Component Model, Sources & Layout Stability
description: Understand how next/image turns local and remote sources into stable responsive image delivery without confusing intrinsic dimensions with rendered size.
---

# Image Component Model, Sources & Layout Stability

Images are not just visual decoration.

They affect:

```text
network transfer
layout stability
Largest Contentful Paint
memory and decode work
accessibility
search visibility
server CPU
CDN/cache usage
security
```

The job of `next/image` is to make the common path safer and more efficient without removing the need to understand the browser's image model.

## The mental model

Think about an image in five layers:

```text
source
  ↓
intrinsic geometry
  ↓
responsive candidate generation
  ↓
browser candidate selection
  ↓
fetch → decode → paint
```

Next.js helps mostly with the middle layers.

It can:

- generate optimized URLs
- generate responsive `srcset` candidates
- preserve aspect ratio
- lazy-load by default
- produce modern output formats
- preload selected images
- create low-quality placeholders

The browser still decides which candidate to fetch and when to decode/paint it.

## The basic component

```tsx
import Image from 'next/image'

export default function Profile() {
  return (
    <Image
      src="/profile.jpg"
      alt="Salman presenting at a frontend meetup"
      width={640}
      height={640}
    />
  )
}
```

The important props are not arbitrary framework ceremony.

They communicate:

```text
src
→ where the image comes from

alt
→ what the image means to a user who cannot see it

width + height
→ intrinsic geometry / aspect-ratio reservation
```

## `width` and `height` do not mean CSS size

This is one of the most important Image concepts.

```tsx
<Image
  src="/hero.jpg"
  alt="Mountain landscape"
  width={1600}
  height={900}
  style={{ width: '100%', height: 'auto' }}
/>
```

`1600 × 900` tells the browser the image's intrinsic ratio.

The CSS says the rendered width should fill its container.

So:

```text
width / height props
→ reserve correct geometry

CSS width / height
→ choose rendered geometry
```

Confusing those two models often causes either layout shift or oversized rendering.

## Why geometry matters

Without known geometry, the browser can initially lay out:

```text
heading
paragraph
button
```

Then the image arrives and inserts 500px of height above them.

The result is layout shift.

With known aspect ratio:

```text
browser knows image box
→ reserves space
→ surrounding content starts in correct position
→ image fills the box later
```

This is a major reason `width` and `height` exist.

## Static imports

A static image import gives Next.js build-time knowledge.

```tsx
import Image from 'next/image'
import hero from './hero.jpg'

export default function Page() {
  return <Image src={hero} alt="Product dashboard" />
}
```

For supported static image imports, Next.js can provide useful metadata such as intrinsic width and height automatically.

For supported static raster imports, the generated image object can also provide blur placeholder data.

That means static imports are often the simplest path when the asset is part of the application source.

## Public-folder string sources

A file in `public/` can be referenced by path:

```tsx
<Image
  src="/team/salman.jpg"
  alt="Salman Butt"
  width={720}
  height={720}
/>
```

Unlike a static import, Next.js does not derive the dimensions from that string at component authoring time.

You provide the geometry yourself unless you use `fill`.

## Remote sources

A remote image uses an absolute URL:

```tsx
<Image
  src="https://assets.example.com/products/keyboard.jpg"
  alt="Mechanical keyboard"
  width={1200}
  height={800}
/>
```

Because the build does not inspect arbitrary remote files, you must provide:

- `width` and `height`, or
- `fill`

and optionally a manual `blurDataURL` when using a blur placeholder.

Remote URLs also require explicit image allow-list configuration, which we cover in the security chapter.

## Unknown dimensions

If dimensions are not known, use `fill` deliberately.

```tsx
<div className="photo">
  <Image
    src={photoUrl}
    alt="Customer project"
    fill
    sizes="(max-width: 768px) 100vw, 50vw"
    style={{ objectFit: 'cover' }}
  />
</div>
```

```css
.photo {
  position: relative;
  aspect-ratio: 4 / 3;
  width: 100%;
}
```

The parent now owns geometry.

The image fills that geometry.

## `fill` changes ownership

Without `fill`:

```text
Image props
→ intrinsic ratio
→ CSS sizes element
```

With `fill`:

```text
parent
→ owns size + position
→ Image absolutely fills parent
```

The parent should establish an appropriate positioning context such as `position: relative`.

Do not add `fill` to an unconstrained container and expect the image to invent its own height.

## `object-fit`

When the image and container have different aspect ratios, choose how they interact.

```tsx
<Image
  fill
  src={photoUrl}
  alt="Product photo"
  style={{ objectFit: 'cover' }}
/>
```

Common choices:

```text
cover
→ fill container
→ preserve image ratio
→ crop overflow

contain
→ show full image
→ preserve ratio
→ may leave empty space
```

This is ordinary CSS behavior. `next/image` does not change the meaning of `object-fit`.

## Accessibility starts with `alt`

`alt` is required.

A meaningful image should have replacement text:

```tsx
<Image
  src={invoiceChart}
  alt="Monthly invoice volume rose from 800 to 1,200 between January and March"
/>
```

A decorative image should normally use an empty value:

```tsx
<Image
  src={dividerTexture}
  alt=""
/>
```

Do not write filenames or generic labels:

```text
bad
→ "image"
→ "photo.jpg"
→ "product image"
```

The right question is:

> If the image disappeared, what information would the user need instead?

## Static import does not mean static rendered page

These concepts are separate:

```text
static image import
→ build knows asset metadata

static page rendering
→ route output can be prepared ahead of request time
```

A dynamically rendered page can use a static image import.

A prerendered page can use remote image URLs.

Do not mix image source classification with route rendering classification.

## Server and Client Components

`Image` itself does not require turning your page into a Client Component.

This works in a Server Component:

```tsx
import Image from 'next/image'

export default function ProductHero() {
  return (
    <Image
      src="/hero.png"
      alt="Analytics dashboard"
      width={1440}
      height={900}
    />
  )
}
```

But function-valued event props such as `onLoad` and `onError` require a Client Component boundary because functions cannot be serialized from a Server Component into client props.

```tsx
'use client'

import Image from 'next/image'

export function Avatar() {
  return (
    <Image
      src="/avatar.jpg"
      alt="Profile photo"
      width={96}
      height={96}
      onError={() => {
        console.log('avatar failed')
      }}
    />
  )
}
```

Keep that boundary narrow.

Do not convert an entire page to a Client Component just to observe one image event.

## `onLoadingComplete` is deprecated

Modern code should prefer `onLoad` where a load callback is genuinely required.

Do not build new abstractions around deprecated `onLoadingComplete` behavior.

## Authenticated remote images

The default Next.js image optimizer intentionally does **not** forward request headers to the remote source.

That matters for a URL like:

```text
https://private-api.example.com/avatar/123
Authorization: Bearer ...
```

The optimizer cannot simply inherit the user's sensitive request headers.

Possible architectures include:

```text
public/signed image URL
→ optimizer can fetch safely

application-controlled image proxy
→ explicitly validates auth and fetches source

unoptimized image URL
→ browser fetches source according to that source's auth model
```

Do not solve this by forwarding arbitrary cookies or authorization headers through a generic image endpoint.

## When a plain `<img>` is reasonable

`next/image` is not mandatory for every pixel.

A plain `<img>` can be appropriate when:

- you need browser-native behavior that the component does not expose cleanly
- a specialized third-party image system owns all transformation logic
- generated markup comes from trusted content tooling
- the image is already optimized and the extra framework layer adds no value

But evaluate the costs explicitly:

```text
responsive candidates?
layout stability?
lazy loading?
format negotiation?
cache strategy?
security?
```

## `unoptimized`

For assets that do not benefit from transformation, you can bypass the optimizer:

```tsx
<Image
  src="/logo.svg"
  alt="Acme"
  width={180}
  height={40}
  unoptimized
/>
```

Common examples include:

- small assets
- SVGs
- animated GIFs
- sources already transformed by another service

Do not use `unoptimized` as a blanket fix for a misconfigured image pipeline.

## A useful source decision tree

```text
Is the asset bundled with the app?
├─ yes → prefer static import when practical
└─ no
   ↓
Is it a public/local path?
├─ yes → path + known width/height or fill
└─ no
   ↓
Remote URL?
├─ public → strict remotePatterns + geometry
└─ authenticated/private → redesign delivery boundary
```

## Common mistakes

### Using visual CSS size as intrinsic size

```tsx
<Image width={300} height={200} style={{ width: '100%' }} />
```

is fine if `300:200` represents the real source ratio.

It is wrong if those numbers were guessed merely because the card is 300px wide.

### Missing parent geometry with `fill`

```text
fill image
+ parent has no height/aspect ratio
→ broken or collapsed layout
```

### Converting large trees to Client Components

An image callback should not move unrelated server rendering to the browser.

### Treating remote URLs as trusted because they came from the database

Database content can still be user-controlled or compromised.

Remote image authorization belongs in configuration and application data validation.

## Production checklist

For every important image, answer:

1. Where does the source come from?
2. Who controls that source?
3. How is intrinsic geometry known?
4. What determines rendered size?
5. Is the image responsive?
6. Is `sizes` accurate?
7. Is it above or below the fold?
8. Does it require optimization?
9. Does the source require authentication?
10. Is `alt` meaningful?

## Interview questions

**Why does `Image` require width and height for remote images?**  
Because the framework cannot inspect arbitrary remote files at build time. The geometry lets the browser reserve the correct aspect ratio before the image loads.

**Do width and height props force the image to render at that CSS size?**  
No. They represent intrinsic dimensions and aspect ratio. CSS determines rendered size.

**Why can a plain Image component remain in a Server Component?**  
The framework can render the image markup on the server. Only client-only behaviors such as function event handlers require a Client Component boundary.

**Why doesn't the default optimizer forward auth headers to remote sources?**  
Forwarding request credentials to arbitrary image origins would create a severe security boundary problem.

## Exercise

Design image handling for a product card system with:

```text
CMS-hosted product photos
user avatars
private invoice attachments
brand SVG logos
responsive hero banner
```

For each source, specify:

- Image vs plain `img`
- static vs remote source
- dimensions vs `fill`
- `alt` policy
- optimizer use
- auth model
- responsive strategy

Then explain what information the browser knows before the first image byte arrives.
