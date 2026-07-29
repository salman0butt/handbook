---
title: RSC, Flight, Module Graphs, Client References & Hydration
sidebar_position: 2
description: Understand how Next.js partitions server and client modules, renders Server Components into RSC payloads, references Client Components, produces initial HTML, and reconciles the tree in the browser.
---

# RSC, Flight, Module Graphs, Client References & Hydration

The App Router is built around React Server Components.

The core mental model is not:

```text
server renders HTML
→ browser receives HTML
```

It is closer to:

```text
source modules
→ server/client graph partition
→ Server Component render
→ RSC payload
→ optional initial HTML
→ browser reconciliation + Client Component hydration
```

Understanding this pipeline explains many App Router behaviors that otherwise look magical.

## 1. Server Components are the default graph

In the App Router, modules are server-capable by default.

A component without `'use client'` can:

```text
run only on server
await data during render
read server-only dependencies
avoid shipping its implementation to browser
compose Client Components
```

There is no `'use server'` directive for Server Components.

`'use server'` marks Server Functions, not component rendering mode.

## 2. `'use client'` creates a graph boundary

When a module begins with:

```ts
'use client'
```

it declares a Client Component module entry point.

The important consequence is graph-oriented:

```text
'use client' module
→ imported modules become part of client dependency graph
```

You do not need `'use client'` on every descendant file.

The boundary propagates through imports.

## 3. Server and client trees are not identical to JSX trees

Consider:

```tsx
// app/page.tsx — Server Component
import Counter from './counter'
import ProductDetails from './product-details'

export default async function Page() {
  const product = await getProduct()

  return (
    <main>
      <ProductDetails product={product} />
      <Counter initial={product.likes} />
    </main>
  )
}
```

```tsx
// counter.tsx
'use client'

export default function Counter({ initial }: { initial: number }) {
  // browser state
}
```

The source tree is one React tree.

The build graph is split:

```text
server graph
Page
ProductDetails
getProduct

client graph
Counter
Counter's imports
```

The browser does not receive `Page` or `getProduct` implementation code simply because their output appears around `Counter`.

## 4. Client Components can still be prerendered to HTML

“Client Component” does **not** mean “only rendered in the browser.”

On initial page load, Next.js uses the RSC payload plus Client Component code to prerender HTML.

Conceptually:

```text
Server Components
→ RSC representation

Client Components
→ known client references + props

server-side HTML prerender
→ visible initial document
```

Then the browser hydrates Client Components.

## 5. Server Components themselves do not hydrate

A Server Component has no browser instance to hydrate.

Its rendered result becomes part of the RSC tree.

Hydration applies to Client Components whose HTML was prerendered and whose JavaScript executes in the browser.

Useful distinction:

```text
Server Component
rendered on server
→ output represented in RSC
→ no component JS hydration

Client Component
can be prerendered to HTML
→ JS downloaded
→ hydrated in browser
```

## 6. What the RSC payload contains conceptually

Next.js documents the RSC payload as a compact representation containing:

```text
rendered Server Component results
references/placeholders for Client Components
props crossing Server → Client boundary
```

The payload lets the browser reconstruct/update the React tree without receiving Server Component implementation code.

## 7. “Flight” is the underlying transport concept

You may see the term **Flight** in React/Next.js source, network traces, or community discussions.

A useful mental model:

```text
RSC / Flight payload
= serialized React server-rendered tree instructions/data
```

Do not depend on the exact wire syntax.

The protocol is a framework/bundler implementation detail.

## 8. Client references bridge module graphs

When a Server Component renders a Client Component, the server cannot serialize the Client Component's implementation as ordinary data.

Instead, the RSC payload conceptually includes a **reference** that tells the client which Client Component module/chunk corresponds to that position in the tree.

```text
server render sees <Counter />
→ output contains client reference + props
→ browser resolves client bundle
→ React renders/hydrates Counter
```

This explains why the build needs metadata mapping module references to client chunks.

## 9. Client reference metadata is framework build metadata

Internally, Next.js creates metadata that lets server rendering identify client modules and lets the client load matching chunks.

The durable mental model is:

```text
client module graph
→ build-generated reference metadata
→ RSC payload references modules
→ browser resolves required chunks
```

Do not depend on a particular private manifest filename or JSON schema.

## 10. Server references work in the opposite direction

Server Functions create another cross-environment reference.

Conceptually:

```text
client bundle
contains reference to server function identity
→ call sends request to server
→ server resolves reference
→ function executes server-side
```

Client references point browser-side.

Server references point server-side.

Both are generated by framework integration.

## 11. Props crossing Server → Client must serialize

A Server Component may pass values to a Client Component only if React's RSC serialization supports them.

Good examples include:

```text
strings
numbers
booleans
null
plain objects
arrays
Dates
Maps/Sets where supported by React serialization
Promises in supported RSC flows
Server Function references
```

Do not pass arbitrary class instances or ordinary functions.

The boundary is not ordinary in-memory JavaScript.

It is a serialized transport boundary.

## 12. Serialization is also a security boundary

If a Server Component passes a value to a Client Component, assume that value becomes observable by the browser.

Do not pass:

```text
password hashes
provider secrets
private DB columns
internal authorization data
large raw database records
```

Prefer minimal DTOs.

The RSC transport may be compact, but it is still client-visible data.

## 13. Server-only modules should fail closed

A server-only dependency should stay outside the client graph.

Using `server-only` communicates that contract.

If a future refactor causes a Client Component subtree to import that module, the framework can report an invalid environment boundary instead of silently exposing server code.

Mental model:

```text
server-only marker
→ graph constraint
→ build-time protection
```

## 14. Why importing a Server Component into a Client Component is confusing

Once a module is inside the client graph, its imported component modules must be browser-compatible.

If you want server-rendered content **inside** a Client Component, prefer composition:

```tsx
// Server Component
<ClientShell>
  <ServerContent />
</ClientShell>
```

The server renders `ServerContent` first and passes its rendered React node through the RSC boundary.

The Client Component does not import and execute the Server Component implementation in the browser.

## 15. Composition lets server output cross a client wrapper

Conceptually:

```text
Server tree
  ↓ render
ServerContent output
  ↓ serialized as React child
ClientShell reference + child slot
  ↓
browser renders ClientShell around server-produced child
```

This is how interactive shells can wrap server-owned content without turning the content into browser code.

## 16. Initial load has two major representations

For a normal document request, Next.js can produce:

```text
HTML
+
RSC payload
+
Client Component JS chunks
```

They serve different roles.

### HTML

Provides fast visible content for the first load.

### RSC payload

Reconstructs/reconciles the server-rendered React tree.

### Client JavaScript

Hydrates interactive Client Components.

## 17. Subsequent navigation usually does not need a new full HTML document

For an App Router client transition:

```text
browser already has document shell
→ Next.js fetches/prefetches RSC route data
→ router merges new route segments
→ React reconciles tree
→ necessary client chunks load
```

This is why client navigation can preserve layouts and client state.

## 18. Hard navigation resets the document lifecycle

A hard navigation does:

```text
new document request
→ new HTML
→ new RSC state
→ new JS execution/hydration
```

In-memory React state is lost.

This happens intentionally in cases such as deployment skew detection where mixing versions would be unsafe.

## 19. Layout persistence comes from route-tree reconciliation

Suppose the current route is:

```text
/dashboard/settings
```

and the user navigates to:

```text
/dashboard/analytics
```

The shared `/dashboard` layout segment can stay mounted while the changed leaf segment is replaced.

Mental model:

```text
old route tree
/dashboard/layout
/settings/page

new route tree
/dashboard/layout
/analytics/page

shared segment reused
changed segment replaced
```

## 20. Template and layout have different identity semantics

Layouts are designed to preserve state across compatible navigations.

Templates create a remount boundary.

Internally the important concept is **route-segment identity**.

If the identity is preserved, React can preserve compatible client state.

If the identity changes, the subtree remounts.

## 21. Parallel routes create multiple active route subtrees

Slots such as:

```text
@analytics
@team
```

represent independent route branches rendered in the same layout.

The router must track active segment state per slot.

This is why `default.tsx` matters for unmatched slot state on hard reloads.

The router's state is a tree, not a single pathname string.

## 22. Intercepting routes demonstrate URL vs rendered-tree separation

A modal interception can show:

```text
browser URL → /photos/123
rendered context → feed layout + intercepted photo modal
```

On direct reload of the same URL:

```text
browser URL → /photos/123
rendered context → canonical photo page
```

The URL is only one input into route-tree resolution.

Navigation history/context can affect which tree is active.

## 23. Suspense shapes RSC streaming chunks

When a Server Component suspends, React can continue rendering siblings and stream the suspended subtree later.

Conceptually:

```text
render root
├─ ready content → emit now
└─ suspended subtree
      ↓ later
   emit continuation
```

The browser incrementally reconciles streamed server output.

## 24. Streaming is not multiple independent pages

The streamed chunks belong to one logical React render/navigation.

Do not model each Suspense completion as a new HTTP page.

It is progressive completion of one route tree.

## 25. `loading.tsx` creates an automatic Suspense boundary

A `loading.tsx` boundary lets Next.js produce/prefetch fallback UI for the route segment.

Internally useful model:

```text
route segment
→ automatic Suspense boundary
→ fallback can be prefetched
→ leaf content can stream later
```

This is why `loading.tsx` affects navigation responsiveness.

## 26. Server-started Promises can cross the RSC boundary

A Server Component can start async work and pass the Promise to a Client Component.

The client can consume it with React `use()` under Suspense.

Conceptually:

```text
server starts Promise
→ RSC payload contains resumable value reference
→ client use() suspends
→ result arrives through React stream
```

Do not replace this mental model with “the browser can call any server Promise.”

The Promise is participating in a React-managed render protocol.

## 27. Hydration requires deterministic initial Client Component output

A Client Component prerendered on the server is expected to produce matching initial browser output.

Mismatch sources include:

```text
Date.now during render
Math.random during render
browser-only branches
invalid HTML nesting
locale differences
extension-mutated DOM
```

Hydration errors are evidence that server prerender and client initial render disagreed.

## 28. Selective hydration means interactivity can arrive incrementally

React can prioritize hydration around interactions and Suspense boundaries rather than requiring the whole document to become interactive at once.

This helps App Router pages show HTML early while client islands become interactive progressively.

Still, large client bundles can delay the point where a `<Link>` or interaction is ready.

## 29. Server Components reduce JavaScript, not necessarily data transfer

Moving work server-side can remove libraries from the client bundle.

But a Server Component can still send a large RSC payload if it renders or serializes a huge amount of data.

Optimize both:

```text
implementation JS size
+
RSC payload size
+
HTML size
```

## 30. RSC payload size grows with rendered structure and boundary data

Common causes:

```text
very large lists
large serialized props
duplicated DTO data
unnecessary client boundaries
excessively deep repeated UI
```

Do not conclude “Server Components are free.”

They shift work and representation.

## 31. Client boundaries can increase both JS and serialization cost

A broad `'use client'` boundary can cause:

```text
more browser JS
more modules in client graph
more hydration work
more values serialized across boundary
```

Narrow boundaries are often easier to reason about.

## 32. RSC errors and Client Component errors cross different boundaries

A Server Component error happens during server render.

A Client Component render error can happen during browser reconciliation/hydration.

Use evidence to identify which environment failed.

```text
server logs/digest
vs
browser error boundary/console
```

## 33. Production Server Component errors are intentionally sanitized

The browser may receive a generic message plus a digest rather than sensitive server details.

That means production debugging must correlate:

```text
client digest
→ server error telemetry/log
```

Do not expect the RSC payload to expose full server stack traces.

## 34. React Compiler is separate from the RSC boundary

React Compiler can optimize component rendering/memoization behavior.

It does not change the fundamental architecture:

```text
Server Components still server-side
Client Components still browser-capable
RSC serialization still required
client references still required
```

Do not confuse render optimization with environment partitioning.

## 35. Turbopack builds environment-specific outputs from one dependency model

Turbopack's unified graph helps Next.js reason about client/server outputs together.

But you still need to ask:

```text
Is this module reachable from a client boundary?
Is it server-only?
Does it require Node APIs?
Should it be bundled or externalized?
```

The unified graph does not erase runtime constraints.

## 36. Debugging unexpected client code

If a server library appears in browser output:

```text
1. find nearest 'use client' ancestor
2. inspect import chain
3. identify accidental barrel export
4. check shared package entry point
5. check dynamic imports and re-exports
6. shrink client boundary
7. add server-only guard where appropriate
```

Barrel files are a common source of accidental graph widening.

## 37. Debugging hydration mismatch

Use this sequence:

```text
server-rendered HTML
vs
client first render
```

Check:

```text
time/randomness
browser API branches
locale/timezone
DOM mutations
invalid nesting
unstable IDs
third-party scripts
```

Do not start by disabling SSR or suppressing warnings globally.

## 38. Debugging a soft-navigation-only bug

If direct load works but `<Link>` navigation fails:

focus on:

```text
RSC navigation request
Router Cache
route-tree reconciliation
prefetch state
layout preservation
interception/parallel route context
version skew
```

The initial HTML path is not the failing path.

## 39. Debugging a hard-load-only bug

If client navigation works but browser refresh fails:

focus on:

```text
full route resolution
server render
missing parallel-slot default
request headers/cookies
canonical route vs intercepted route
asset availability
production server configuration
```

## 40. Senior interview model

If asked “What exactly crosses from a Server Component to a Client Component?”, answer:

```text
not the Server Component implementation

React sends serialized rendered structure,
Client Component references,
and serializable props/data needed across the boundary.
```

Then explain initial HTML and hydration separately.

## Production checklist

- [ ] `'use client'` boundaries are intentionally narrow
- [ ] server-only modules cannot enter client graph
- [ ] DTOs crossing RSC boundary contain no secrets
- [ ] Client Component props are serializable
- [ ] composition is preferred over importing server implementation into client graph
- [ ] RSC payload size is considered separately from JS bundle size
- [ ] hydration mismatches are fixed at deterministic-render source
- [ ] hard vs soft navigation paths are tested separately
- [ ] parallel/intercepted routes have direct-load tests
- [ ] private Flight encoding is not treated as application API

## Interview questions

### Does a Client Component render only in the browser?

No. On initial load it can be prerendered to HTML on the server, then hydrated in the browser. “Client” means it is part of the client module graph and can use client-only React/browser capabilities.

### Why does `'use client'` affect imports?

Because it declares a module-graph boundary. Dependencies reachable through that client entry must be available to the client bundle.

### Why can layouts preserve state across navigation?

Because App Router client navigation reconciles a route tree and can reuse shared route segments instead of replacing the entire document.
