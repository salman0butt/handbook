---
title: Cache Components & use cache
description: Enable Cache Components, cache async functions and components with use cache, and compose static shells with cached and dynamic subtrees.
---

# Cache Components & `use cache`

Next.js 16 introduced **Cache Components** as the modern opt-in caching model for App Router applications.

Enable it explicitly:

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

This changes how you should reason about prerendering, cacheable work, request-time work, and older route-level cache configuration.

## What Cache Components gives you

The goal is not “cache every component.”

The goal is to compose three categories in one route:

```text
static work
cached work
request-time dynamic work
```

A route can therefore behave like:

```text
Page
├── static header
├── cached catalog
├── cached CMS block
└── Suspense
    └── dynamic account widget
```

The stable shell can be available quickly while request-time work resolves separately.

## `use cache` directive

`'use cache'` marks an async route, component, or function as cacheable.

Function scope:

```ts
export async function getProducts() {
  'use cache'
  return db.product.findMany()
}
```

Component scope:

```tsx
export async function ProductGrid() {
  'use cache'

  const products = await db.product.findMany()
  return <Grid products={products} />
}
```

File scope:

```ts
'use cache'

export async function getProducts() {
  // ...
}

export async function getCategories() {
  // ...
}
```

At file scope, exported functions must satisfy the directive's async-function constraints.

## Cache the smallest meaningful domain unit

Avoid jumping immediately to:

```tsx
'use cache'
export default async function RootLayout() { ... }
```

A broad cache scope can couple unrelated freshness requirements.

Prefer domain-aligned boundaries:

```text
getPublicPlans()     → weeks
getProduct(id)       → hours
getInventory(id)     → minutes
getCurrentUser()     → dynamic/private
```

This makes invalidation and ownership easier to explain.

## Cache key mental model

A cached function's identity depends on its code and relevant inputs, including arguments and captured values.

Conceptually:

```text
cache entry key
=
function identity
+
arguments
+
relevant closed-over values
```

Therefore:

```ts
getProduct('p1')
getProduct('p2')
```

produce separate logical entries.

This is why passing an explicit safe key into a cached function is often better than reading request state inside it.

## Runtime APIs are excluded from normal `use cache`

A normal cached function cannot directly depend on request APIs such as:

- `cookies()`
- `headers()`
- page `searchParams`

Preferred pattern:

```text
read request state outside
  ↓
validate/normalize
  ↓
pass safe primitive argument
  ↓
cache shareable work
```

Example:

```ts
export async function getPricing(currency: string) {
  'use cache'
  return pricingService.list({ currency })
}
```

Then request code resolves the user's currency and passes it explicitly.

## Authorization should stay outside shared caches

Do not put this into a public shared cache:

```ts
async function getProject(projectId: string) {
  'use cache'
  const session = await getSession()
  // authorize session here...
}
```

Even if you could technically structure it, authorization and caching have different responsibilities.

A safer pattern is:

```text
request
  ↓
identity + authorization
  ↓
resource scope
  ↓
cache public/shareable sub-data only
```

If the result is user-specific, keep it dynamic unless you have an explicit and safe personalization cache design.

## Cached component output

`use cache` can cache the output of an async component, not only raw data.

That can be useful for expensive server-rendered fragments:

```tsx
export async function MarketingHero() {
  'use cache'
  const campaign = await getCampaign()

  return <Hero campaign={campaign} />
}
```

The architectural question is whether the output's freshness and shareability match the cache boundary.

## Static shell inclusion

Cache Components can include reusable cached content in the prerendered shell.

That means the distinction becomes:

```text
stable or cacheable server work
  → eligible for shell

request-dependent work
  → dynamic hole
```

This avoids turning an entire page request-time merely because one small subtree needs runtime state.

## Short-lived caches

Very short cache profiles may be excluded from the prerendered shell and treated more like dynamic work.

That is appropriate: content with near-real-time freshness should not pretend to be a stable build-time shell dependency.

## Randomness and time inside caches

Caching freezes nondeterministic values for the cache lifetime.

```tsx
export async function PromoCode() {
  'use cache'
  const value = crypto.randomUUID()
  return <span>{value}</span>
}
```

Every request sharing that cache entry can see the same value until revalidation.

Likewise:

```ts
Date.now()
Math.random()
```

inside a cached scope describe values captured when that cache entry was generated.

If you need request-time freshness, keep that work outside the cache or use `connection()` for intentional runtime rendering.

## Cache nested functions deliberately

You may have:

```text
cached page
  ↓
cached component
  ↓
cached data function
```

This can be valid, but nesting creates multiple lifetimes and invalidation relationships.

Do not layer caches merely because each helper can have one.

Ask which layer owns the freshness contract.

## Default cache profile

A `use cache` scope without explicit `cacheLife` uses the default profile.

Current defaults include a client stale period and server revalidation behavior.

For production code, explicit profiles are often easier to audit:

```ts
'use cache'
cacheLife('hours')
```

A reviewer should be able to understand freshness without tracing framework defaults.

## Cache Components vs React `cache`

```text
React cache()
  → server render/request memoisation

'use cache'
  → Next.js reusable cache entry with lifetime/revalidation behavior
```

Use React `cache()` to deduplicate repeated work in one rendering lifecycle.

Use `use cache` when you want reusable server output across eligible requests/renderings.

## Cache Components vs `force-cache` fetch

```text
fetch(..., { cache: 'force-cache' })
  → cache HTTP response

'use cache'
async function getData() { ... }
  → cache function/component output
```

A `use cache` function can include:

- database reads
- external API calls
- transformations
- computed data
- component output

This makes it useful beyond HTTP sources.

## Partial Prerendering mental model

Think in terms of a route shell:

```text
build / prerender pass
  ↓
static + cacheable work becomes shell
  ↓
dynamic boundaries remain holes
  ↓
request arrives
  ↓
dynamic work completes/streams
```

Do not frame Partial Prerendering as a separate old experimental feature in modern Next.js 16. Cache Components is the current model that exposes this composition.

## Suspense boundaries matter

Dynamic work should be enclosed at meaningful Suspense boundaries so the stable shell can render independently.

Bad:

```text
Page
└── one huge dynamic subtree
```

Better:

```text
Page shell
├── cached catalog
├── cached recommendations
└── Suspense
    └── user-specific cart
```

Boundary placement is both a rendering and UX decision.

## Static export limitation

`use cache` under Cache Components is not a universal static-export substitute.

Platform support depends on deployment mode, and static export does not support the runtime caching model in the same way as a server deployment.

Treat deployment target as part of cache architecture.

## Common mistakes

### Adding `use cache` everywhere

More cache scopes mean more keys, invalidation paths, and mental overhead.

### Caching authorization results broadly

Permission state is often request/user specific and security-sensitive.

### Hiding request dependencies inside utilities

Make request dependence explicit at boundaries.

### Depending on default lifetime silently

Explicit profiles communicate intent better for important data.

### Caching nondeterminism accidentally

Time/randomness becomes stable for the cache entry lifetime.

## Debugging checklist

If `use cache` behaves unexpectedly:

1. confirm `cacheComponents: true`
2. confirm directive placement
3. inspect arguments and closed-over values
4. inspect runtime API usage
5. inspect explicit/default `cacheLife`
6. inspect tags and invalidation
7. inspect nested cache boundaries
8. verify deployment cache persistence assumptions
9. compare serverless vs long-lived server behavior
10. test production build/prerender output

## Interview questions

**What does `use cache` cache?**  
The output of an async function/component/route scope under the Cache Components model, keyed by its identity and relevant inputs.

**Can `use cache` read cookies directly?**  
Normal `use cache` should not directly access runtime request APIs. Read them outside and pass safe values as arguments.

**Why is cached component output useful?**  
It lets expensive reusable server-rendered subtrees participate in the prerendered shell rather than caching only raw HTTP responses.

**How does Cache Components relate to Partial Prerendering?**  
Cache Components is the modern Next.js 16 programming model for combining prerendered shell, reusable cached work, and request-time holes.

## Exercise

Refactor a product page into:

```text
static navigation
cached product details
cached review aggregate
dynamic user price entitlement
dynamic cart
```

Choose cache scope, profile, tags, Suspense boundaries, and security ownership for each subtree.
