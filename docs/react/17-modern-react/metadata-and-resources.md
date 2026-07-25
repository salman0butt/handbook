---
title: Metadata and Resource Loading
description: Learn React 19 document metadata components, stylesheet/script handling, and React DOM resource hint APIs such as preconnect, preload, preinit, and module variants.
sidebar_position: 7
---

# Metadata and resource loading

React 19 expanded how components can describe document metadata and loading requirements.

This matters because a component can now express needs such as:

```text
page title
meta description
stylesheet
script
font/image preload
preconnect to an API host
```

without manually reaching for `document.head` in an Effect.

## Why this matters

Before modern React metadata support, application code often used Effects:

```jsx
useEffect(() => {
  document.title = product.name;
}, [product.name]);
```

That can work in a client-only app, but it does not compose as cleanly with server rendering, streaming, or component-driven metadata.

Modern React lets components render metadata directly.

## `<title>`

```jsx
function ProductPage({product}) {
  return (
    <>
      <title>{product.name} – Store</title>
      <h1>{product.name}</h1>
    </>
  );
}
```

React places the corresponding title in the document head even though the component rendered it deeper in the tree.

## `<meta>`

```jsx
function ProductPage({product}) {
  return (
    <>
      <meta name="description" content={product.description} />
      <h1>{product.name}</h1>
    </>
  );
}
```

For document metadata, React moves the element to `<head>`.

An important exception is item-specific metadata using `itemProp`, which stays where it is rendered because it describes a particular item rather than the entire document.

## `<link>`

`<link>` can describe related resources such as:

```jsx
<link rel="icon" href="/favicon.ico" />
```

It can also represent stylesheets:

```jsx
<link
  rel="stylesheet"
  href="/product-page.css"
  precedence="medium"
/>
```

For stylesheet links with the right props, React can coordinate head placement, deduplication, ordering, and loading behavior.

## Stylesheet precedence

CSS order matters.

React provides `precedence` so stylesheet-producing components can declare ordering without manually coordinating exact head insertion positions.

```jsx
<link
  rel="stylesheet"
  href="/base.css"
  precedence="low"
/>

<link
  rel="stylesheet"
  href="/checkout.css"
  precedence="high"
/>
```

The exact precedence values are application conventions; React uses discovery order of precedence groups to determine ranking.

## `<style>`

Inline stylesheet components can also participate in React's special stylesheet handling when supplied with identity and precedence:

```jsx
<style href="checkout-theme" precedence="medium">
  {`
    .checkout-summary {
      border-radius: 12px;
    }
  `}
</style>
```

Providing `href` helps React deduplicate logically identical inline stylesheets.

## `<script>`

React can render script components:

```jsx
<script async src="https://example.com/widget.js" />
```

For suitable async external scripts, React can move them to the document head and deduplicate matching scripts.

Do not blindly render third-party scripts from arbitrary feature components. Script loading has security, performance, CSP, privacy, and lifecycle implications.

## Metadata belongs to the page/component that knows it

A useful architecture is:

```text
ProductRoute
  ├── title
  ├── meta description
  ├── page-specific stylesheet/resource hints
  └── product UI
```

This keeps document description close to the content that owns it.

Frameworks may provide higher-level metadata APIs. If they do, use the framework-supported pattern rather than duplicating it with low-level React DOM components.

## Resource hint APIs

React DOM provides these stable resource-loading APIs:

```text
prefetchDNS
preconnect
preload
preloadModule
preinit
preinitModule
```

They are imported from `react-dom`.

## `prefetchDNS`

```jsx
import {prefetchDNS} from 'react-dom';

prefetchDNS('https://images.example.com');
```

This hints that the browser may resolve the host's DNS early.

Use it when you expect to contact a domain but do not yet know the exact resource.

## `preconnect`

```jsx
import {preconnect} from 'react-dom';

preconnect('https://api.example.com');
```

This can start connection setup earlier than the eventual resource request.

Conceptually:

```text
prefetchDNS
→ resolve host

preconnect
→ resolve + establish connection earlier
```

Preconnecting has more overhead than DNS prefetching, so do not preconnect to dozens of speculative domains.

## `preload`

```jsx
import {preload} from 'react-dom';

preload('/fonts/inter.woff2', {
  as: 'font',
  type: 'font/woff2',
  crossOrigin: 'anonymous',
});
```

`preload` tells the browser to fetch a resource you expect to need.

Other examples:

```jsx
preload('/hero.webp', {as: 'image'});
preload('/checkout.css', {as: 'style'});
preload('/analytics.js', {as: 'script'});
```

It starts downloading but does not necessarily execute/apply the resource.

## `preinit`

`preinit` is stronger than `preload` for supported scripts and stylesheets.

```jsx
import {preinit} from 'react-dom';

preinit('/checkout.css', {
  as: 'style',
  precedence: 'high',
});
```

For scripts:

```jsx
preinit('/widget.js', {as: 'script'});
```

Conceptually:

```text
preload
→ fetch early

preinit
→ fetch + prepare/evaluate/apply supported resource
```

## Module variants

For ES modules, React DOM provides:

```jsx
import {preloadModule, preinitModule} from 'react-dom';
```

`preloadModule` starts fetching an ESM module.

`preinitModule` starts fetching and evaluating it.

Use the module-specific APIs rather than treating an ESM module as an ordinary classic script.

## Call timing

In the browser, resource hint APIs can be called from contexts such as:

- render;
- event handlers;
- Effects.

For server rendering or Server Components, they are most useful when called during rendering or an async context originating from render, so React can include the right resource instructions in server output.

Frameworks frequently handle this for you.

## Example: prepare before navigation

```jsx
import {preconnect, preload} from 'react-dom';

function CheckoutLink({navigate}) {
  function handlePointerEnter() {
    preconnect('https://payments.example.com');
    preload('/checkout.css', {as: 'style'});
  }

  return (
    <button
      onPointerEnter={handlePointerEnter}
      onClick={() => navigate('/checkout')}
    >
      Checkout
    </button>
  );
}
```

This can start useful work before the navigation completes.

Do not preload everything on hover without measuring whether it improves user experience.

## Deduplication

React can deduplicate equivalent resource declarations/calls in supported cases.

That makes component-local declaration safer:

```jsx
function Chart() {
  preload('/chart-font.woff2', {as: 'font'});
  // ...
}
```

If multiple Chart instances make the same equivalent preload request, React can avoid multiplying identical hints.

Still, resource strategy should be intentional.

## Resource loading is a performance tool, not decoration

Every early resource competes for:

- bandwidth;
- connection slots;
- CPU;
- parsing/evaluation time;
- memory.

Bad strategy:

```text
preload everything
preconnect everywhere
load all possible future scripts
```

Better strategy:

```text
identify likely critical next resource
start it early enough to matter
measure result
```

## Framework responsibility

React-based frameworks may already optimize:

- route CSS;
- fonts;
- script loading;
- image priority;
- metadata;
- navigation prefetch;
- server-rendered resource hints.

If a framework already owns those concerns, low-level React DOM resource APIs may be redundant or harmful.

Always check framework behavior before manually layering hints.

## Security considerations

Resource APIs do not make arbitrary external content safe.

Consider:

- Content Security Policy;
- `nonce`;
- integrity hashes;
- CORS;
- trusted origins;
- third-party privacy implications;
- script supply-chain risk.

Example with integrity metadata:

```jsx
preload('https://cdn.example.com/app.js', {
  as: 'script',
  integrity: 'sha384-...',
  crossOrigin: 'anonymous',
});
```

The exact policy belongs to your deployment/security architecture.

## Metadata conflicts

Large applications may render multiple title/meta declarations from nested trees.

You need a clear ownership model for route/page metadata.

Typical approach:

```text
layout owns site-wide defaults
route owns page-specific metadata
small leaf components do not randomly overwrite document title
```

Framework metadata APIs often formalize this better than low-level components.

## Common mistakes

### Updating `document.title` in an Effect by default

Modern React can render `<title>` declaratively.

### Preloading too many resources

Early loading can hurt more important work.

### Confusing `preload` with execution

Use `preinit`/`preinitModule` when you intentionally need evaluation/application behavior.

### Ignoring framework optimizations

You may duplicate prefetching or create resource contention.

### Loading third-party scripts casually

Treat scripts as security and performance dependencies.

## Production decision guide

```text
Need metadata?
  ↓
Does framework expose a metadata system?
  ├─ yes → prefer framework integration
  └─ no  → React title/meta/link can fit

Need resource earlier?
  ↓
Only host known?      → prefetchDNS / preconnect
Exact resource known? → preload / preloadModule
Need it applied/run?  → preinit / preinitModule
```

## Interview questions

**Junior:** Why can a component render `<title>` without manually editing `document.head`?

**Mid-level:** What is the difference between `preload` and `preinit`?

**Senior:** How would you decide whether manual React DOM resource hints are appropriate in an application whose framework already prefetches routes and assets?

## References

- https://react.dev/reference/react-dom/components/title
- https://react.dev/reference/react-dom/components/meta
- https://react.dev/reference/react-dom/components/link
- https://react.dev/reference/react-dom/components/style
- https://react.dev/reference/react-dom/components/script
- https://react.dev/reference/react-dom
- https://react.dev/reference/react-dom/prefetchDNS
- https://react.dev/reference/react-dom/preconnect
- https://react.dev/reference/react-dom/preload
- https://react.dev/reference/react-dom/preloadModule
- https://react.dev/reference/react-dom/preinit
- https://react.dev/reference/react-dom/preinitModule

## Next

Continue with **[React 19 Migration and Removed APIs](./react-19-migration.md)**.