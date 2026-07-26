---
title: cacheLife, cacheTag & On-Demand Revalidation
description: Define freshness profiles, tag cached data, and choose between revalidateTag, updateTag, and revalidatePath in modern Next.js.
---

# `cacheLife`, `cacheTag` & On-Demand Revalidation

Caching is only useful when freshness is intentional.

Modern Next.js gives you two broad strategies:

```text
time-based revalidation
on-demand revalidation
```

With Cache Components, these are expressed through `cacheLife`, `cacheTag`, `revalidateTag`, `updateTag`, and `revalidatePath`.

## Time-based revalidation with `cacheLife`

Inside a `use cache` scope:

```ts
import { cacheLife } from 'next/cache'

export async function getProducts() {
  'use cache'
  cacheLife('hours')

  return db.product.findMany()
}
```

A cache profile defines three separate concepts:

```text
stale
revalidate
expire
```

## `stale`

`stale` controls how long the client can reuse the cached result without checking the server.

This is part of client navigation behavior, not a generic HTTP `Cache-Control` max-age.

## `revalidate`

After the revalidation interval, the next eligible request can receive cached content while the server refreshes it in the background.

This is stale-while-revalidate behavior.

## `expire`

After the expiration boundary, stale data may no longer be used indefinitely. The next request can block for fresh output.

When both are configured:

```text
expire > revalidate
```

must hold.

## Built-in profiles

Next.js provides profiles such as:

- `seconds`
- `minutes`
- `hours`
- `days`
- `weeks`
- `max`

Use them according to business freshness, not naming aesthetics.

Example mapping:

```text
live score snapshot → seconds
social feed summary → minutes
weather block → hours
article content → days
archive/legal page → weeks/max
```

## Explicit profiles improve reviewability

A cached function with no `cacheLife` uses the default profile.

That is valid, but for business-critical caching, this is easier to audit:

```ts
'use cache'
cacheLife('hours')
```

than relying on a reviewer to remember framework defaults.

## Custom cache profiles

Define reusable policies in `next.config.ts`:

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    catalog: {
      stale: 300,
      revalidate: 900,
      expire: 86400,
    },
  },
}

export default nextConfig
```

Then:

```ts
'use cache'
cacheLife('catalog')
```

This gives the organization a vocabulary for freshness.

## Inline profiles

For one-off policy:

```ts
cacheLife({
  stale: 60,
  revalidate: 300,
  expire: 3600,
})
```

Use named profiles when the same business rule appears repeatedly.

## `cacheTag`

Tags attach domain identity to a cached entry:

```ts
import { cacheTag } from 'next/cache'

export async function getProduct(id: string) {
  'use cache'
  cacheTag('products', `product:${id}`)

  return db.product.findUnique({ where: { id } })
}
```

Multiple tags can describe one entry.

Useful tag hierarchy:

```text
products
product:p_42
category:lighting
```

This lets mutations invalidate broad or narrow groups intentionally.

## Idempotent tagging

Applying the same tag repeatedly has no extra effect.

Tags should describe identity, not request history.

## Tag limits

Current constraints include:

- max 256 characters per custom tag
- max 128 tag items per cached resource

Design tags as compact domain identifiers.

## `revalidateTag`

Use `revalidateTag` when stale-while-revalidate behavior is acceptable.

```ts
import { revalidateTag } from 'next/cache'

revalidateTag('products', 'max')
```

With the recommended `'max'` profile:

```text
entry marked stale
  ↓
next access can receive stale result
  ↓
fresh result generated in background
  ↓
cache updated
```

This is excellent for:

- catalogs
- documentation
- article lists
- content where slight propagation delay is acceptable

## Single-argument `revalidateTag` is deprecated

Avoid old examples:

```ts
revalidateTag('products')
```

The current recommended contract uses the second argument/profile.

Do not teach deprecated behavior as the primary API.

## `updateTag`

`updateTag` is for **read-your-own-writes** behavior.

```ts
import { updateTag } from 'next/cache'

updateTag('products')
```

It immediately expires matching cache entries.

The next request waits for fresh data rather than serving stale content.

Use it when the user just changed something and must immediately observe the result.

Example:

```text
user edits profile
  ↓
mutation succeeds
  ↓
updateTag('user:42')
  ↓
redirect/render
  ↓
next read is fresh
```

## `updateTag` execution context

Current Next.js restricts `updateTag` to the Server Action context.

It cannot be used from:

- Route Handlers
- Client Components
- arbitrary server contexts

If a webhook Route Handler needs to mark content stale, use `revalidateTag` instead.

## `revalidateTag` vs `updateTag`

```text
revalidateTag(tag, 'max')
  → stale-while-revalidate
  → stale content may be served
  → Server Action or Route Handler

updateTag(tag)
  → immediate expiration
  → next read waits for fresh content
  → Server Action only
```

Choose based on product consistency requirements.

## `revalidatePath`

Path revalidation targets route output:

```ts
import { revalidatePath } from 'next/cache'

revalidatePath('/products')
```

Use it when the route itself is the natural invalidation target.

It can be called from server-side mutation/request contexts such as Server Functions and Route Handlers.

It cannot run in Client Components or Proxy.

## Path vs tag invalidation

Suppose both `/products` and `/dashboard` consume data tagged `products`.

Calling:

```ts
revalidatePath('/products')
```

refreshes the targeted route path, but does not automatically invalidate the same tagged resource everywhere else.

Calling:

```ts
revalidateTag('products', 'max')
```

invalidates matching tagged data across consumers.

Therefore:

```text
route concern → revalidatePath
data-domain concern → tag invalidation
```

## Prefer precise invalidation

Bad:

```text
mutation changes one product
  ↓
revalidate entire dashboard and catalog tree
```

Better:

```text
updateTag('product:p_42')
revalidateTag('products', 'max') if list summary also changed
```

Precision reduces unnecessary recomputation and makes correctness easier to reason about.

## Mutation sequencing

A useful flow:

```text
validate input
  ↓
authorize
  ↓
write database
  ↓
invalidate cache
  ↓
redirect/return result
```

Never invalidate before the authoritative write succeeds.

## Cache invalidation is not a transaction

If the database write succeeds but cache invalidation fails, the system can temporarily serve stale data.

For high-integrity systems, design observability and recovery for invalidation failures.

Possible strategies:

- retry invalidation safely
- event/outbox workflow
- short fallback lifetime
- admin/manual invalidation tools
- cache versioning

Do not assume a cache call gives distributed transaction semantics.

## Nested cache lifetimes

With nested `use cache` scopes, an explicit outer `cacheLife` owns the outer result's lifetime.

Without an explicit outer profile, inner shorter lifetimes can influence the effective behavior of the outer default cache.

Therefore explicit lifetimes make nested systems easier to audit.

## Short-lived cache implication

Very short cache profiles can be excluded from prerendered shells and become runtime holes.

If the data changes almost continuously, this is often the correct trade-off.

## Read-your-own-write example

```ts
'use server'

import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'

export async function renameProject(id: string, name: string) {
  await assertCanEditProject(id)
  await db.project.update({
    where: { id },
    data: { name },
  })

  updateTag(`project:${id}`)
  redirect(`/projects/${id}`)
}
```

The key is not the exact API sequence; it is the consistency contract.

## Background-refresh example

For CMS webhook content:

```ts
export async function POST() {
  revalidateTag('articles', 'max')
  return Response.json({ ok: true })
}
```

Serving the previous article list briefly while it regenerates is usually acceptable.

## Security concerns

Tags are not authorization controls.

Do not expose arbitrary invalidation endpoints that allow users to purge expensive cache domains without authentication/rate limits.

For webhook invalidation:

- authenticate webhook signature
- validate payload
- map payload to allowed tags
- rate-limit if necessary
- log invalidation safely

## Debugging stale writes

When a user writes data but still sees stale UI:

1. confirm write committed
2. identify which cache entry serves the read
3. check tag is attached to that entry
4. check exact tag spelling/case
5. determine `updateTag` vs `revalidateTag`
6. inspect client Router Cache separately
7. inspect path invalidation if route output is stale
8. inspect CDN/upstream caches
9. test navigation vs hard reload
10. correlate timestamps in logs

## Interview questions

**When should you use `updateTag`?**  
When a Server Action needs read-your-own-writes semantics and the next read must wait for fresh data.

**Why is `revalidateTag(tag)` alone not the modern default?**  
The single-argument form is deprecated; current code should choose an explicit profile such as `'max'` for stale-while-revalidate behavior.

**When is `revalidatePath` better than a tag?**  
When invalidation is naturally tied to one route output rather than a data domain shared across routes.

**What do `stale`, `revalidate`, and `expire` represent?**  
Client reuse window, server background refresh timing, and the hard expiration boundary respectively.

## Exercise

Design cache invalidation for an e-commerce system with:

- product detail
- category listing
- inventory
- cart
- admin product editor
- CMS webhook

Define tags, cache profiles, mutation invalidation, read-your-own-write requirements, and route-level revalidation only where justified.
