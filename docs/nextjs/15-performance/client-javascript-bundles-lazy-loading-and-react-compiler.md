---
title: Client JavaScript, Bundles, Lazy Loading & React Compiler
description: Reduce browser JavaScript cost with Server Component boundaries, bundle analysis, lazy loading, dynamic imports, package strategy, and React Compiler.
---

# Client JavaScript, Bundles, Lazy Loading & React Compiler

Client JavaScript is one of the most expensive resources a web application ships because the browser must do more than download it.

```text
transfer
→ decompress
→ parse
→ compile
→ execute
→ hydrate
→ keep code/state in memory
→ run future interactions
```

The strongest optimization is often to **not send JavaScript that the browser does not need**.

## Server Components are the default performance boundary

In the App Router, pages and layouts are Server Components by default.

Use Client Components when you need:

- state
- event handlers
- effects
- browser APIs
- interactive client libraries

Do not add `'use client'` to a whole route because one button is interactive.

Bad:

```tsx
'use client'

export default function ProductPage() {
  // entire page enters client module graph
}
```

Better:

```tsx
export default async function ProductPage() {
  const product = await getProduct()

  return (
    <>
      <ProductDetails product={product} />
      <AddToCartButton productId={product.id} />
    </>
  )
}
```

Only the interactive island needs to be client-owned.

## `'use client'` defines a module graph boundary

Once a module is in the client graph, its client-side imports can join the browser bundle.

Review the dependency tree, not only the component file containing the directive.

A small Client Component that imports a giant charting library is not small in browser cost.

## Move static transformations to the server

Current Next.js package-bundling guidance explicitly shows heavy transformations such as syntax highlighting moving to Server Components so the library never reaches the client bundle.

Candidates include:

```text
markdown rendering
syntax highlighting
format conversion
static content transformation
server-side schema projection
non-interactive chart/image generation where appropriate
```

Do not move genuinely interactive/browser-specific logic to the server merely to chase bundle numbers.

## Analyze before deleting dependencies

Current Next.js offers two bundle-analysis paths:

```text
Turbopack integrated analyzer → experimental
@next/bundle-analyzer → Webpack plugin
```

At the current stable baseline, Turbopack analysis is available through an experimental command such as:

```bash
pnpm next experimental-analyze
```

and can write diagnostics for comparison.

Because it is experimental, isolate it in developer tooling rather than making production correctness depend on it.

## Webpack bundle analyzer

For Webpack builds, `@next/bundle-analyzer` can generate visual reports.

Typical configuration:

```js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({})
```

Then:

```bash
ANALYZE=true npm run build
```

Use reports to answer:

- which route imports this dependency?
- client or server?
- why is it included?
- is there a duplicate version?
- can it move server-side?
- can it be loaded on demand?

## Bundle size is route-specific

A large package on an admin-only route is different from the same package on the homepage.

Track:

```text
shared client chunk
route-specific chunk
third-party chunk
initial route JS
navigation-loaded JS
```

Do not optimize repository-wide dependency count without understanding delivery.

## Lazy loading applies to client work

Current App Router guidance says Server Components are automatically code split; lazy loading is primarily for Client Components and client libraries.

Use `next/dynamic`, `React.lazy`, or `import()` when code is not required for the initial experience.

Example:

```tsx
'use client'

import dynamic from 'next/dynamic'

const RichEditor = dynamic(() => import('./RichEditor'), {
  loading: () => <p>Loading editor…</p>,
})

export function EditButton() {
  return <RichEditor />
}
```

## Load code on demand, not just into another chunk

Code splitting does not always mean deferral.

If a dynamically imported component renders immediately, the browser still needs it early.

The biggest win comes when loading is tied to real demand:

```tsx
{open ? <RichEditor /> : null}
```

or an interaction-triggered external import.

## Dynamic import external libraries

For browser-only work that is needed only after interaction:

```ts
async function onSearch(value: string) {
  const Fuse = (await import('fuse.js')).default
  const engine = new Fuse(items)
  return engine.search(value)
}
```

This avoids putting the library on the initial critical path.

But repeated import setup and runtime work can still be expensive. Measure the actual interaction.

## `ssr: false` is not a general optimization flag

`ssr: false` only works for Client Components and disables prerendering of that client component.

Use it for true browser-only dependencies.

Do not use it simply because hydration or SSR code is inconvenient.

Costs can include:

- later visible content
- worse LCP
- more client-only work
- temporary empty/fallback regions

## Server Component dynamic-import nuance

Current App Router docs note that when a Server Component dynamically imports a Client Component, automatic client code splitting is not currently supported in the same way you might expect.

Do not assume a `dynamic()` call guarantees the exact bundle graph you imagine. Inspect the build output/analyzer.

## Package imports

Packages with huge export surfaces can create build and bundle cost.

Next.js automatically optimizes a number of popular libraries.

`experimental.optimizePackageImports` can be configured for additional packages, but it remains **experimental** in current docs.

```js
module.exports = {
  experimental: {
    optimizePackageImports: ['some-large-library'],
  },
}
```

Prefer direct imports or library-supported tree-shakeable imports when possible before relying on experimental config.

## Tree shaking requires compatible modules

Tree shaking works best when packages expose statically analyzable ES modules without side effects that force whole-package inclusion.

Investigate a package when:

```text
one function import
→ unexpectedly huge bundle increase
```

The cause may be package structure rather than your component architecture.

## Server package bundling affects cold starts

Current Next.js package guidance notes that smaller server bundles can reduce cold-start cost.

Packages imported in Server Components and Route Handlers are generally bundled by Next.js. `serverExternalPackages` can opt selected dependencies out and use native Node loading.

This is an advanced compatibility/performance choice, not a default optimization.

Measure:

```text
server artifact size
startup time
runtime compatibility
deployment environment
```

## React Compiler in current Next.js

Current Next.js exposes stable `reactCompiler` configuration support.

Install the compiler package and enable:

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,
}

export default nextConfig
```

Next.js uses SWC analysis to apply the Babel compiler only to relevant React files, reducing build overhead compared with running it indiscriminately.

## Compiler does not replace architecture

React Compiler can reduce unnecessary component recalculation and the need for manual memoization.

It does not fix:

```text
large client bundle
expensive database query
huge list DOM
slow image
third-party long task
network waterfall
wrong cache policy
```

Think of it as a rendering optimization layer after sound architecture.

## Avoid manual memoization by reflex

`useMemo`, `useCallback`, and `memo` have costs:

- complexity
- dependency maintenance
- memory
- comparison work
- stale-value bugs when misused

With React Compiler available, manual memoization should be evidence-driven or required by an API/identity contract, not a blanket style rule.

## Compiler opt-in mode

Current Next.js supports annotation mode:

```ts
const nextConfig = {
  reactCompiler: {
    compilationMode: 'annotation',
  },
}
```

Then React directives such as:

```js
'use memo'
```

can opt selected code into compilation.

Use this for controlled adoption when needed.

## `use no memo`

React also provides an escape-hatch directive to opt out where compiler behavior should not apply.

Do not scatter directives without a documented reason.

## Client bundle review checklist

For each new client dependency:

```text
why must it run in the browser?
which routes receive it?
is it initial or deferred?
how large is it compressed and executed?
can transformation move server-side?
can a narrower import be used?
can a native browser API replace it?
what does the analyzer show?
```

## Avoid duplicate UI libraries

Two date libraries, two icon systems, or multiple chart engines can create avoidable shared cost.

In large applications, dependency governance is a performance feature.

## Interaction-time loading trade-off

Deferring too aggressively can make the first use of a feature feel slow.

Example:

```text
open editor
→ download 400 KB chunk
→ parse
→ execute
→ render
```

Possible solutions:

- prefetch after idle
- preload on hover/focus if justified
- use a smaller editor
- server-render non-interactive preview

Do not automatically move every cost from page load to first interaction.

## Memory matters too

A library can be acceptable in transfer size but expensive in retained objects, DOM, caches, workers, or event listeners.

Long-lived dashboard sessions should be profiled for memory growth, not only initial load.

## Common mistakes

### Making root layout client-owned

This can broaden the client graph dramatically.

### Lazy loading above-the-fold critical UI

This can worsen LCP and perceived readiness.

### Assuming tree shaking worked

Inspect bundle evidence.

### Treating experimental analyzer/config as stable API

Label and isolate experimental tooling.

### Enabling React Compiler and declaring performance solved

Compiler optimization cannot remove architectural costs outside React render computation.

## Interview questions

### What is the most powerful client-bundle optimization in App Router?

Keep non-interactive work in Server Components so its code never enters the browser client graph.

### When is `next/dynamic` useful?

When a Client Component or browser library is not needed on the initial path and can be loaded later or in a separate chunk.

### What does React Compiler optimize?

React component rendering calculations and memoization opportunities. It does not reduce all network, data, DOM, or third-party costs.

## Exercise

Pick one route with a large dependency and produce three alternatives:

1. move work to a Server Component
2. lazy-load after interaction
3. replace with a smaller/native implementation

For each, predict impact on initial JS, interaction latency, server cost, and complexity.
