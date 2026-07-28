---
title: Fonts, Google & Local Files, Variable Fonts & Fallbacks
description: Build a production font system with next/font using self-hosted Google fonts, local files, variable axes, subsets, display policy, and fallback metrics.
---

# Fonts, Google & Local Files, Variable Fonts & Fallbacks

Web fonts are part of rendering architecture.

They can affect:

```text
text visibility
layout shift
Largest Contentful Paint
network priority
cache behavior
privacy
brand consistency
```

`next/font` gives Next.js a build-time font pipeline so applications can self-host font files and connect them to React components with predictable CSS.

## The mental model

```text
font declaration in code
        ↓
Next.js resolves/downloads font at build time
        ↓
font file becomes application static asset
        ↓
CSS @font-face generated
        ↓
route/layout applies generated class or variable
        ↓
browser fetches font from same application origin
```

For Google fonts, the user's browser does not need to contact Google Fonts at runtime when you use `next/font/google`.

That is both a performance and privacy characteristic.

## Google font example

```tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

The generated `className` connects the build-produced font CSS to the element.

## Variable fonts are usually the best default

A variable font can encode a range of weights/styles in one font resource.

```tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
})
```

When a font supports variable weight, you often do not need to list every weight.

The browser can use values across the supported range.

## Non-variable fonts require explicit weights

For a family without a variable build:

```tsx
const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
})
```

Only load the weights the product actually uses.

This is not just bundle cleanliness.

Every additional weight/style can create another font file and network resource.

## Subsets

Fonts can include many writing systems.

A Latin-only product should not automatically download glyphs for scripts it never renders.

```tsx
const font = SomeFont({
  subsets: ['latin'],
})
```

Choose subsets from actual content requirements.

For multilingual applications, include every script required by supported locales or use appropriate locale-specific font architecture.

## Preload and subsets

Font preloading is enabled by default in `next/font`.

For Google fonts, specify the relevant subsets when preloading so Next.js knows which font assets are part of the critical route.

A missing subset declaration can produce warnings and weaken the intended optimization.

## Local fonts

Use `next/font/local` for application-owned font files:

```tsx
import localFont from 'next/font/local'

const brand = localFont({
  src: './BrandVariable.woff2',
  display: 'swap',
})
```

The file can be co-located with code or organized in a shared asset location according to your project structure.

## Multiple local files

For a non-variable family:

```tsx
const brand = localFont({
  src: [
    {
      path: './Brand-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './Brand-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
})
```

This generates one logical family with explicit faces.

## Prefer WOFF2

For modern web applications, WOFF2 is usually the preferred web-font format because of its efficient compression and broad browser support.

Do not ship desktop font files merely because design supplied them.

Treat font assets as production web resources.

## `display`

`display` maps to the CSS `font-display` strategy.

Supported strategies include:

```text
auto
block
swap
fallback
optional
```

`next/font` defaults to `swap`.

The choice affects what users see while the custom font is unavailable.

## `swap`

Conceptually:

```text
render fallback text immediately
→ custom font arrives
→ text swaps to custom font
```

Benefit:

```text
text stays visible
```

Risk:

```text
fallback and custom metrics differ
→ layout shift
```

Next.js fallback-metric adjustment helps reduce this risk for supported configurations.

## `optional`

`optional` tells the browser that using the custom font is not worth significantly delaying rendering.

This can be useful when:

```text
performance matters more than guaranteed brand font
```

But test the visual experience because some users may remain on fallback fonts for the page lifetime.

## `block`

`block` can hide text for a font-block period while the browser waits for the custom face.

Use it only when the typography requirement truly justifies that behavior.

Invisible text can be worse UX than a temporary fallback.

## Fallback fonts

You can provide fallback families:

```tsx
const brand = localFont({
  src: './Brand.woff2',
  fallback: ['Arial', 'sans-serif'],
})
```

Fallbacks matter because custom fonts can fail, arrive late, or be skipped by browser strategy.

Your interface should remain readable and structurally sound without the preferred font.

## Automatic fallback metric adjustment

`next/font` can adjust fallback font metrics to reduce layout shift when the custom font replaces the fallback.

For Google fonts, automatic fallback adjustment is enabled by default where supported.

For local fonts, configuration can choose a fallback metric model such as Arial or Times New Roman, or disable the adjustment.

The goal is:

```text
fallback glyph boxes
≈ custom font glyph boxes
→ smaller reflow when swap occurs
```

This is not a guarantee of identical rendering.

Measure real pages.

## FOUT vs FOIT

Two common terms:

```text
FOUT
→ Flash of Unstyled Text
→ fallback visible before custom font

FOIT
→ Flash of Invisible Text
→ text hidden while font waits
```

The product goal is not “eliminate every flash.”

The goal is readable, stable, fast content.

## CSS generated output

A font object can expose:

```text
className
style
variable
```

`className` is convenient when one font directly applies to an element.

`.style` exposes font-family information for integration cases.

`variable` creates a CSS custom-property hook for design systems.

## Font style example

```tsx
<p style={brand.style}>Brand copy</p>
```

Prefer classes/design tokens for large systems, but the style API can be useful for focused cases.

## CSS variable example

```tsx
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})
```

Then:

```tsx
<html className={inter.variable}>
```

and CSS:

```css
:root {
  --font-sans: var(--font-inter);
}

body {
  font-family: var(--font-sans), sans-serif;
}
```

This works well with design tokens and utility frameworks.

## Variable axes

Variable fonts may support axes beyond weight:

```text
wght
wdth
opsz
slnt
ital
font-specific axes
```

`next/font` includes the weight axis when needed, but optional axes should be requested deliberately because more axis data can increase font size.

If you need optical sizing or width variation, configure the relevant supported axes rather than assuming every variable dimension is automatically included.

## Local font declarations

Local font configuration can include additional `@font-face` descriptors through declarations.

Use this for specialized face metadata that has a clear CSS requirement.

Do not create a second competing manual `@font-face` for the same font unless you deliberately own the whole pipeline.

## Centralize font definitions

Bad architecture:

```text
Header.tsx → calls Inter()
Card.tsx → calls Inter()
Footer.tsx → calls Inter()
```

Each call represents another font instance/configuration boundary.

Prefer:

```text
app/fonts.ts
→ define shared font objects once
→ import them where needed
```

Example:

```tsx
// app/fonts.ts
import { Inter, Playfair_Display } from 'next/font/google'

export const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const display = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
})
```

## Use fewer families

A design system with:

```text
6 font families
× 4 weights
× italic variants
```

can create a substantial font network budget.

Start with typography hierarchy, not font-file count.

One variable sans family plus an optional display family is often enough.

## Typography ownership

A healthy architecture separates:

```text
font assets
→ which files/families exist

tokens
→ --font-sans / --font-display

typography styles
→ body / heading / label / code

component semantics
→ h1 / p / button / input
```

Do not put raw font-family decisions into every component.

## Font loading failure

If a font fails, users should still get:

- readable text
- usable controls
- stable-enough layout
- correct semantic structure

Test with font requests blocked in DevTools.

A design that becomes unreadable without its custom font is brittle.

## Privacy model

When `next/font/google` downloads the font during build and self-hosts the output, the browser does not need a runtime request to Google Fonts.

This reduces third-party runtime dependencies.

But privacy compliance still includes the rest of your application:

- analytics
- embeds
- videos
- maps
- advertising

Do not generalize one font optimization into “the site has no third-party privacy concerns.”

## Build-time availability

Google font resolution happens during build.

That means a restricted CI environment must be able to obtain the required font assets during the build process or use local/application-managed font files instead.

Production browsers do not need the same external dependency.

## Common mistakes

### Loading every weight

```text
100,200,300,400,500,600,700,800,900
```

is wasteful if the design uses 400 and 700.

### Multiple repeated font declarations

This can duplicate instances and complicate generated CSS/resources.

### Using a brand font for every character

Display fonts often work better for headings than dense UI/body text.

### Ignoring non-Latin content

A Latin-only subset cannot render every language correctly.

### Treating font swap as harmless

Metric changes can move buttons, headings, and layout.

### Blocking text for branding

Brand identity does not justify unreadable content by default.

## Debugging fonts

Inspect browser DevTools:

```text
Network → font requests
Computed → final font-family
Rendered Fonts → actual face used
Performance → font request timing
Layout shifts → typography-related movement
```

Ask:

1. Was the custom face requested?
2. Was it preloaded?
3. Did preload match the actual face used?
4. Was fallback rendered first?
5. Did swap cause layout movement?
6. Are unused weights being downloaded?
7. Is the route loading fonts it never uses?

## Interview questions

**What does `next/font/google` change compared with a Google Fonts stylesheet link?**  
Next.js obtains the font at build time and self-hosts the produced assets, so the user's browser fetches them from the application rather than making a runtime Google Fonts request.

**Why prefer a variable font?**  
It can cover a range of weights/styles in fewer font resources, reducing the need for separate static files while allowing flexible typography.

**What problem does fallback metric adjustment solve?**  
It makes the fallback font's geometry closer to the custom font so the eventual swap causes less layout shift.

**Does `font-display: swap` guarantee no CLS?**  
No. It keeps text visible, but a metric difference between fallback and custom fonts can still move layout.

## Exercise

Design typography for a SaaS product with:

```text
English + Arabic UI
brand display font for marketing headings
neutral sans for product UI
monospace for code examples
```

Specify:

- font source
- subsets/scripts
- variable vs static files
- weights
- display policy
- fallback stack
- metric-adjustment strategy
- where each family is declared
- how you will test font failure and layout shift
