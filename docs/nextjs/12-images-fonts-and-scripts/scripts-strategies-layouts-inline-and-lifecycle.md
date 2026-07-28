---
title: Scripts, Strategies, Layout Scope & Lifecycle
description: Load third-party JavaScript deliberately with next/script strategies, route-scoped layouts, inline-script identity, lifecycle callbacks, and client-boundary rules.
---

# Scripts, Strategies, Layout Scope & Lifecycle

Third-party JavaScript is one of the easiest ways to destroy a fast application without changing any React code.

A script can add:

```text
network requests
JavaScript parse/compile work
main-thread execution
DOM mutation
cookies/storage
long tasks
layout shifts
privacy/security exposure
```

`next/script` does not make third-party code cheap.

It gives you a structured way to decide **when** and **where** it loads.

## The mental model

For every script, answer two independent questions:

```text
WHERE is it needed?
→ root layout / nested layout / page / component

WHEN should it execute?
→ beforeInteractive / afterInteractive / lazyOnload
```

The best script optimization is often narrower scope, not a different strategy.

## Basic Script

```tsx
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script src="https://example.com/widget.js" />
      <main>...</main>
    </>
  )
}
```

The default strategy is `afterInteractive`.

## Script placement and route scope

If a script is used in a nested layout:

```text
app/(marketing)/layout.tsx
```

then it belongs to that route subtree rather than every route in the application.

Next.js also avoids repeatedly loading the same layout script as users navigate within that layout subtree.

That gives layouts a resource-ownership role.

## Root layout scripts

A script in the root layout applies broadly across the application.

This can be correct for:

- truly global consent infrastructure
- global analytics required on all routes
- global security/client monitoring that product has approved

It is wrong for:

- one marketing chat widget
- one checkout payment integration
- one editor SDK
- one map used on a contact page

Do not put a script in the root layout merely because it was easy to integrate there.

## `afterInteractive`

Default strategy:

```tsx
<Script
  src="https://cdn.example.com/analytics.js"
  strategy="afterInteractive"
/>
```

Use it for scripts that should load after the page has begun becoming interactive.

Typical examples:

```text
analytics
client monitoring
non-critical SDKs
```

But “analytics” is not automatically harmless. A large analytics bundle can still create long tasks after hydration begins.

Measure execution cost.

## `lazyOnload`

For low-priority scripts:

```tsx
<Script
  src="https://cdn.example.com/support-widget.js"
  strategy="lazyOnload"
/>
```

This defers loading toward browser idle time after other page resources.

Good candidates often include:

```text
chat/support widget
social embed enhancement
low-priority marketing integrations
```

if the product does not need them immediately.

## `beforeInteractive`

This strategy is for exceptional global scripts that must be fetched/executed before normal Next.js client code proceeds through its standard path.

```tsx
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Script
        src="https://example.com/critical.js"
        strategy="beforeInteractive"
      />
    </html>
  )
}
```

In the App Router, `beforeInteractive` belongs in the **root layout**.

Use it only when the script genuinely must be globally available before normal interaction work.

Examples can include a narrow class of consent/security/polyfill requirements—but every candidate deserves scrutiny.

## Do not use `beforeInteractive` as a performance fix

If a widget is broken because it initializes too late, moving it earlier may hide an integration bug by making every user pay more critical-path cost.

Ask:

```text
Does the script truly need to exist before hydration?
Or does our component need a proper readiness boundary?
```

Usually the second question is more productive.

## Strategy decision tree

```text
Must it be globally present before app interaction?
├─ yes → beforeInteractive, root layout only, justify carefully
└─ no
   ↓
Needed soon after route becomes interactive?
├─ yes → afterInteractive
└─ no → lazyOnload
```

Then independently ask:

```text
Which smallest route subtree needs it?
```

## Worker strategy is not an App Router production primitive

You may find historical/current documentation for a `worker` script strategy.

In the current framework generation it is experimental and not supported for the App Router workflow taught in this handbook.

Do not design App Router production architecture around it.

This handbook treats it as experimental/out-of-scope behavior, not a stable solution for “move all third-party JS off the main thread.”

## Inline scripts

`Script` can host inline code:

```tsx
<Script id="theme-bootstrap">
  {`
    document.documentElement.dataset.theme =
      localStorage.getItem('theme') || 'system'
  `}
</Script>
```

An inline `Script` needs a stable `id` so Next.js can identify/manage the script.

## Prefer external/module application code over large inline strings

Inline scripts are appropriate for tiny bootstrap logic with a clear reason.

Do not paste entire libraries into JSX strings.

Large inline scripts:

- increase HTML payload
- complicate CSP
- complicate debugging/source maps
- bypass normal module tooling

## User data inside inline scripts

Never interpolate untrusted data directly into JavaScript source:

```tsx
// dangerous idea
<Script id="config">{`window.name = '${userInput}'`}</Script>
```

The user can break out of the string/script context.

Prefer serialized data with safe script-context escaping or data attributes/JSON boundaries designed for the use case.

Full XSS architecture belongs in Phase 13.

## `onLoad`

Use `onLoad` when application behavior must run once the external script has loaded:

```tsx
'use client'

import Script from 'next/script'

export function WidgetScript() {
  return (
    <Script
      src="https://example.com/widget.js"
      onLoad={() => {
        console.log('widget script loaded')
      }}
    />
  )
}
```

Lifecycle callbacks are functions.

Therefore they require a **Client Component**.

## `onReady`

`onReady` is useful when initialization must happen after the script is ready and again when the component remounts.

Conceptually:

```tsx
'use client'

<Script
  src="https://maps.example.com/sdk.js"
  onReady={() => {
    mountMap()
  }}
/>
```

This is different from a one-time global load callback.

Think:

```text
script resource may load once
component may mount many times
```

`onReady` can reconnect component lifecycle to an already-loaded global script.

## `onError`

```tsx
'use client'

<Script
  src="https://example.com/widget.js"
  onError={(error) => {
    reportWidgetFailure(error)
  }}
/>
```

Use errors to degrade gracefully rather than crashing unrelated UI.

A support widget failing should not make checkout unusable.

## Callback limitations

Current Script APIs place strategy-specific limitations on callbacks.

For example, do not build lifecycle-callback architecture around `beforeInteractive` as though it behaves like an ordinary client-mounted `afterInteractive` script.

Keep critical early scripts simple and deterministic.

## Script readiness should become an application abstraction

Bad:

```text
Component A checks window.vendor
Component B polls window.vendor
Component C uses setTimeout(1000)
```

Better:

```text
VendorScript boundary
→ script lifecycle
→ typed readiness state/API
→ feature components consume that abstraction
```

Do not spread global-object timing assumptions across the codebase.

## Route navigation behavior

App Router navigation does not necessarily reload the whole document.

A layout can persist while child routes change.

This matters for scripts:

```text
root/nested layout persists
→ script resource should not be injected repeatedly
→ feature initialization may still need remount/re-route behavior
```

Separate:

```text
script loaded
from
feature initialized for current route
```

## Example: maps page

Bad architecture:

```text
root layout
→ loads map SDK for every user
```

Better:

```text
/contact layout or map component
→ loads SDK only where map feature exists
```

Then initialize the map through a client component after readiness.

## Example: checkout provider

A payment provider SDK may belong only in:

```text
/checkout/**
```

not in public content routes.

Scope can improve:

- performance
- security exposure
- privacy
- failure isolation

## Custom attributes

`Script` can pass appropriate script attributes through to the underlying element, including values such as:

```text
nonce
data-*
```

This is useful for CSP and vendor configuration.

Treat every attribute as part of the third-party contract.

## CSP nonce

A request-specific CSP architecture may pass a nonce to scripts:

```tsx
<Script
  src="https://example.com/critical.js"
  nonce={nonce}
/>
```

The nonce must match the policy generated for that request.

Do not hard-code a reusable nonce.

Phase 09 introduced request-time nonce generation; Phase 13 owns the deeper CSP threat model.

## External origin connection cost

Before a third-party script can download:

```text
DNS
→ TCP
→ TLS
→ request
→ response
```

can occur for a new origin.

A resource hint such as preconnect may help in measured cases, but it also announces that the origin is important early.

Do not preconnect to every vendor on every route.

## Script cache behavior

Third-party caching is controlled by the vendor/CDN and browser caching rules.

A URL like:

```text
https://cdn.vendor.com/sdk.js
```

can change behavior independently of your application deployment unless the vendor uses immutable versioned URLs.

For security-sensitive integrations, prefer explicit versions/subresource guarantees where the vendor supports them.

## Third-party availability

Your page may be healthy while the vendor is down.

Design failure domains:

```text
analytics down
→ app still works

chat down
→ support button can degrade

payments SDK down
→ checkout displays actionable failure

identity SDK down
→ auth flow may be unavailable, but error is explicit
```

Do not let optional vendors become invisible single points of failure.

## Hydration and script DOM mutation

Some third-party scripts mutate DOM nodes that React also owns.

If they mutate before/during hydration, mismatches and unstable UI can occur.

Prefer isolated containers:

```tsx
<div id="vendor-widget-root" />
```

and initialize the third party after the relevant client boundary is ready.

## Script performance model

A script has at least four costs:

```text
fetch bytes
parse/compile
execute
work triggered later
```

A 20KB script can still be expensive if it performs 500ms of main-thread work.

Do not optimize only transfer size.

## Debugging scripts

Use DevTools:

```text
Network
→ when did script request start?

Performance
→ how much main-thread work did it cause?

Coverage
→ how much loaded code was used?

Console
→ lifecycle/global errors

Application
→ cookies/storage/service workers created
```

Test both hard load and client navigation.

## Common mistakes

### Everything in root layout

Global scope becomes global cost.

### Everything `beforeInteractive`

This competes with truly critical application work.

### `setTimeout` initialization

Time is not readiness.

### Client callbacks inside Server Components

Function props require a client boundary.

### Inline user data

Creates an XSS boundary.

### Assuming “loaded once” means “initialized once correctly”

Route/component lifecycle can differ from script resource lifecycle.

## Production checklist

For each script:

1. Why does the product need it?
2. Which routes need it?
3. When does it need to execute?
4. Which strategy matches that requirement?
5. Does it need lifecycle callbacks?
6. Where is the client boundary?
7. What global state does it create?
8. What happens on navigation/remount?
9. What happens if it fails?
10. How much main-thread work does it add?
11. What data does it receive?
12. Does CSP allow it narrowly?
13. Does consent need to happen before loading?

## Interview questions

**What is more important than choosing `afterInteractive` vs `lazyOnload`?**  
First deciding whether the script belongs on that route at all. Route/layout scope can eliminate the cost entirely for users who do not need the integration.

**Why does `onReady` exist if a script loads only once?**  
The resource can stay loaded while the React component using it remounts. `onReady` lets feature initialization run for that component lifecycle after the script is available.

**Can lifecycle callbacks be used in a Server Component?**  
No. They are JavaScript functions passed to client behavior, so the component using them must be a Client Component.

**Should App Router apps use the `worker` strategy?**  
Not as a stable production primitive. It remains experimental and is not supported for the App Router flow covered here.

## Exercise

Choose placement and strategy for:

```text
analytics
cookie-consent manager
chat widget
payment SDK
map SDK
A/B testing script
syntax-highlighter enhancement
```

For each, specify:

- root/nested/page/component scope
- strategy
- client callback requirements
- consent requirement
- failure behavior
- performance metric to monitor

Then explain which ones should not load at all on `/dashboard/settings`.
