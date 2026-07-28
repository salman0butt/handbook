---
title: Responsive Images, sizes, Placeholders & LCP
description: Design responsive next/image delivery with accurate sizes, srcset candidates, fill layouts, loading priority, placeholders, and LCP-aware trade-offs.
---

# Responsive Images, `sizes`, Placeholders & LCP

Responsive image performance is a coordination problem between your layout, Next.js, and the browser.

A browser should not need a 2400px-wide image for a card that renders at 320px.

The central model is:

```text
CSS layout intent
      ↓
`sizes`
      ↓
Next.js candidate `srcset`
      ↓
browser evaluates viewport + DPR
      ↓
smallest suitable candidate is fetched
```

If the CSS and `sizes` disagree, the browser can make an expensive but technically correct choice from incorrect information.

## What `srcset` solves

A responsive image can have multiple candidate widths:

```text
384w
640w
750w
828w
1080w
1200w
...
```

The browser combines:

- current viewport
- device pixel ratio
- `sizes`
- available `srcset` candidates

and chooses a source.

This selection happens in the browser. Next.js supplies the candidate URLs.

## `sizes` describes rendered width

For a card grid:

```tsx
<Image
  src={product.image}
  alt={product.name}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

This tells the browser approximately:

```text
≤ 640px viewport
→ image occupies full viewport width

641–1200px
→ about half viewport width

> 1200px
→ about one third viewport width
```

It does **not** resize the CSS box.

Your CSS still owns the layout.

## Why missing `sizes` is expensive

With responsive/fill layouts, omitting `sizes` can lead the browser to assume the image may occupy `100vw`.

If the real card is only 33vw, the browser can download a much larger candidate than needed.

Example:

```text
actual rendered width = 400px
browser assumption = 1200px
DPR = 2

potential target without accurate sizes
→ around 2400 physical pixels

useful target
→ around 800 physical pixels
```

That is wasted transfer, decode work, and memory.

## `sizes` changes candidate generation

Next.js uses `sizes` to generate width-descriptor candidates appropriate for responsive selection.

Without a `sizes` prop, fixed-size images commonly use density candidates such as:

```text
1x
2x
```

With `sizes`, the output can expose a fuller range of width candidates.

This is why `sizes` is not merely an accessibility-style annotation. It affects network behavior.

## Fixed image example

An avatar whose CSS size is always 64px does not need a complex viewport expression:

```tsx
<Image
  src={user.avatar}
  alt={user.name}
  width={64}
  height={64}
  sizes="64px"
/>
```

The browser can choose a candidate suitable for that fixed slot and the device pixel ratio.

## Responsive width without `fill`

You can keep intrinsic geometry and make the rendered image fluid:

```tsx
<Image
  src={hero}
  alt="Analytics dashboard showing revenue growth"
  sizes="100vw"
  style={{ width: '100%', height: 'auto' }}
/>
```

A static import gives intrinsic dimensions.

CSS makes it responsive.

`sizes` tells the browser the rendered width model.

## `fill` for container-owned layouts

Use `fill` when the container owns dimensions:

```tsx
<div className="hero-media">
  <Image
    src={heroUrl}
    alt="Team collaborating around a laptop"
    fill
    sizes="100vw"
    style={{ objectFit: 'cover' }}
  />
</div>
```

```css
.hero-media {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
}
```

The browser can reserve the parent geometry immediately.

## A common grid pattern

```tsx
function ProductImage({ src, name }: { src: string; name: string }) {
  return (
    <div className="product-media">
      <Image
        src={src}
        alt={name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        style={{ objectFit: 'cover' }}
      />
    </div>
  )
}
```

The useful rule is:

> Write `sizes` from the actual CSS breakpoint behavior, not from a copied snippet.

## Measure `sizes` mistakes

In browser DevTools inspect:

```text
rendered CSS width
naturalWidth
selected currentSrc
transfer size
DPR
```

If a 320px card repeatedly downloads 1600px images, investigate:

1. `sizes`
2. CSS width
3. `deviceSizes` / `imageSizes`
4. device pixel ratio
5. optimizer cache state

## Loading behavior

Images are lazy-loaded by default when appropriate.

That is usually right for below-the-fold content.

But the likely Largest Contentful Paint image may need earlier discovery/fetching.

In current Next.js 16, the old `priority` prop is deprecated in favor of clearer loading controls.

## `preload`

Current `Image` supports:

```tsx
<Image
  src={hero}
  alt="Product analytics dashboard"
  preload
  sizes="100vw"
  style={{ width: '100%', height: 'auto' }}
/>
```

`preload` causes a preload link for the image to be inserted into the document head.

Use it selectively.

A preload is a claim:

```text
this resource is important enough
that the browser should discover it very early
```

Too many preloads compete with CSS, fonts, scripts, and other critical resources.

## `priority` is deprecated

Legacy examples often show:

```tsx
<Image priority ... />
```

In the Next.js 16 generation, `priority` is deprecated.

New code should use the current loading model instead of copying older tutorials.

## `fetchPriority="high"`

For an important image that is already discoverable in document markup, you may prefer:

```tsx
<Image
  src={hero}
  alt="Product dashboard"
  fetchPriority="high"
  sizes="100vw"
  style={{ width: '100%', height: 'auto' }}
/>
```

This is different from preloading.

Conceptually:

```text
preload
→ discover this resource early

fetchPriority
→ give this discovered fetch stronger scheduling priority
```

Do not automatically combine every performance signal.

Current docs recommend choosing the appropriate loading mechanism rather than stacking `preload`, `loading`, and `fetchPriority` indiscriminately.

## `loading="eager"`

Eager loading tells the browser not to defer the image through native lazy-loading behavior:

```tsx
<Image
  src={hero}
  alt="Dashboard preview"
  loading="eager"
/>
```

This may be useful for immediately visible content, but it is not synonymous with “make LCP fast.”

LCP depends on the entire chain:

```text
server response
→ HTML discovery
→ image request scheduling
→ source latency/cache
→ transfer
→ decode
→ layout
→ paint
```

## Choosing the LCP strategy

For one likely above-the-fold hero:

```text
Is the image immediately discoverable?
├─ yes
│  ├─ normal eager discovery sufficient? → loading="eager"
│  └─ stronger scheduling needed? → fetchPriority="high"
└─ no / critical resource discovery is late
   → consider preload
```

Then measure.

Do not preload every image above the fold.

## LCP is route-specific

Different routes can have different LCP elements:

```text
homepage
→ hero image

product page
→ product photo

article page
→ headline text

dashboard
→ text/table, perhaps no image at all
```

Do not create a global “all hero images preload” abstraction without measuring real routes.

## Blur placeholders

A blur placeholder can reduce the perceived blank state:

```tsx
<Image
  src={hero}
  alt="Dashboard preview"
  placeholder="blur"
/>
```

Supported static raster imports can include generated blur data automatically.

For remote sources, provide a suitable `blurDataURL` yourself if you choose blur behavior.

## Placeholder is not performance magic

A placeholder changes perceived loading, not the transfer size of the full image.

A huge blur data URL can itself become wasteful because it may be embedded in HTML/RSC output.

The placeholder should be intentionally tiny.

## Empty placeholder

The default behavior is effectively no special placeholder:

```text
image box reserved
→ image appears when decoded/painted
```

That is often perfectly acceptable when geometry is stable.

## Data URL placeholders

Possible sources:

```text
tiny generated blur
small dominant-colour SVG/data URL
CMS-provided low-quality image placeholder
```

Do not place unbounded user-controlled data URLs into server-rendered markup.

Validate size and format.

## Aspect ratio and crop stability

For CMS images, product teams often want a stable card crop:

```css
.card-media {
  aspect-ratio: 4 / 3;
  position: relative;
  overflow: hidden;
}
```

```tsx
<Image
  fill
  src={image.url}
  alt={image.alt}
  sizes="(max-width: 768px) 100vw, 33vw"
  style={{ objectFit: 'cover' }}
/>
```

This keeps card height stable even when source photos have different ratios.

But cropping may hide meaningful content.

For information-rich images such as diagrams, `contain` or intrinsic-ratio rendering may be more appropriate.

## Mobile art direction is a different problem

Responsive sizing asks:

```text
same composition
→ which resolution should browser fetch?
```

Art direction asks:

```text
different viewport
→ should browser use a different crop/composition entirely?
```

Do not solve art direction by sending one enormous desktop image and relying on CSS cropping.

We cover `<picture>` and `getImageProps()` in the advanced image chapter.

## Performance model

For each image, think in four costs:

```text
encoded bytes
→ network

decoded pixels
→ memory

decode work
→ CPU/main-thread scheduling

painted area
→ rendering cost
```

A compressed but unnecessarily high-resolution image can still consume significant decode memory.

## Avoid invisible downloads

Patterns like this can be expensive:

```tsx
<div className="desktop-only">
  <Image src={desktopHero} ... />
</div>
<div className="mobile-only">
  <Image src={mobileHero} ... />
</div>
```

CSS may hide one element after the browser has already discovered both resources.

Prefer a real responsive source-selection strategy when different source files are required.

## Accessibility during loading

Do not announce loading placeholders as separate meaningful content.

The accessible identity should remain the final image's `alt` text.

If an image is purely decorative, keep `alt=""` regardless of placeholder behavior.

## Common LCP mistakes

### Preloading too much

```text
5 hero images preloaded
→ all compete early
→ CSS/font/script bandwidth pressure
```

### Lazy-loading the true LCP image

If the hero is the likely LCP element, delaying its request can hurt paint timing.

### Wrong `sizes`

Correct lazy/eager settings cannot compensate for repeatedly downloading oversized candidates.

### Optimizing bytes but not source latency

An optimized 100KB image fetched from a slow or cold upstream can still miss performance goals.

### Measuring only localhost

Local image optimization, no network latency, and warm caches do not represent production.

## Debugging an oversized candidate

Trace:

```text
1. inspect CSS rendered width
2. inspect DPR
3. inspect `sizes`
4. inspect generated `srcset`
5. inspect browser-selected `currentSrc`
6. inspect optimizer URL width parameter
7. inspect transfer and cache headers
```

Then change one variable and re-measure.

## Production checklist

For every important responsive image:

1. Is geometry reserved?
2. Does CSS define the real rendered width?
3. Does `sizes` match that CSS?
4. Is the source resolution sufficient but not absurdly large?
5. Is it likely to be LCP?
6. Should it remain lazy, become eager, receive high fetch priority, or be preloaded?
7. Is a placeholder useful?
8. Does cropping preserve meaning?
9. Have mobile and desktop been measured separately?
10. Have cold-cache production-like conditions been tested?

## Interview questions

**What does `sizes` do in `next/image`?**  
It tells the browser how wide the image is expected to render under viewport conditions, allowing correct selection from responsive `srcset` candidates.

**Why is missing `sizes` especially dangerous with `fill`?**  
The browser may assume a viewport-wide slot and choose a much larger source than the actual container needs.

**What replaced `priority` in modern Next.js?**  
`priority` is deprecated in Next.js 16. Use the current loading controls such as `preload`, `loading="eager"`, or `fetchPriority="high"` according to the actual resource-discovery problem.

**Should every above-the-fold image be preloaded?**  
No. Preloads consume scarce early network priority and should be reserved for resources whose earlier discovery materially improves the critical path.

## Exercise

Given this layout:

```text
mobile: 1 product per row
768px+: 2 products per row
1280px+: 4 products per row
container max-width: 1440px
```

Design:

- the CSS card width model
- `sizes`
- source image minimum resolution policy
- below-fold loading behavior
- first-card/LCP behavior
- placeholder policy

Then use DevTools to explain which candidate a DPR=2 browser should select at 390px, 900px, and 1440px viewport widths.
