---
title: Search Params, URL State & Pagination
description: Model filters, sorting, search, pagination, and shareable client state with modern App Router searchParams and useSearchParams.
---

# Search Params, URL State & Pagination

The URL is often the best place for state that should be:

- shareable
- bookmarkable
- reload-safe
- compatible with Back/Forward
- visible to the server
- meaningful outside one component instance

Typical examples:

```text
/products?category=coffee&sort=price&page=2
/invoices?query=lee&status=pending
/logs?from=2026-07-01&to=2026-07-26
```

The App Router gives you two primary ways to read this state:

```text
Server Component Page
  → searchParams prop

Client Component
  → useSearchParams()
```

They are related, but they do not have identical rendering consequences.

## Modern page `searchParams` is asynchronous

In current Next.js 16 App Router pages, `searchParams` is a Promise.

```tsx
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string | string[]
    sort?: string | string[]
    page?: string | string[]
  }>
}) {
  const query = await searchParams

  return <pre>{JSON.stringify(query, null, 2)}</pre>
}
```

Do not copy older tutorials that treat `searchParams` as a synchronous prop.

## `searchParams` is a plain object

The Page prop is not a `URLSearchParams` instance.

For:

```text
/products?category=coffee&category=tea
```

a value can be represented as an array:

```ts
{
  category: ['coffee', 'tea']
}
```

Your parsing layer must expect:

```ts
string | string[] | undefined
```

unless you normalize it immediately.

## `searchParams` opts the page into request-time rendering

The search query cannot be known at build time for every visitor.

Reading the Page `searchParams` prop is therefore a request-time dynamic API.

This is an architectural choice. If database results depend on filters or pagination, request-time search params are often exactly what you need.

If the query is only used for lightweight browser UI, a small Client Component with `useSearchParams()` may be more appropriate.

## Server-side filtering example

```tsx
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string
    page?: string
    sort?: string
  }>
}) {
  const { query = '', page = '1', sort = 'name' } = await searchParams

  const parsedPage = Math.max(1, Number(page) || 1)
  const allowedSorts = new Set(['name', 'price', 'newest'])
  const parsedSort = allowedSorts.has(sort) ? sort : 'name'

  const products = await getProducts({
    query,
    page: parsedPage,
    sort: parsedSort,
  })

  return <ProductResults products={products} />
}
```

This turns URL input into validated domain input before using it for data access.

## Never pass raw query values into privileged operations

Bad:

```ts
const orderBy = query.sort
return db.product.findMany({ orderBy })
```

Better:

```ts
const sortMap = {
  name: { name: 'asc' },
  price: { price: 'asc' },
  newest: { createdAt: 'desc' },
} as const

const orderBy = sortMap[sort] ?? sortMap.name
```

The URL is user input.

Validate:

- enum values
- page bounds
- IDs
- dates
- ranges
- allowed fields
- tenant/resource scope

## `useSearchParams()`

Client Components can read a read-only `URLSearchParams` interface.

```tsx
'use client'

import { useSearchParams } from 'next/navigation'

export function SearchSummary() {
  const searchParams = useSearchParams()
  const query = searchParams.get('query') ?? ''

  return <p>Search: {query}</p>
}
```

Useful methods include:

```ts
searchParams.get('query')
searchParams.getAll('tag')
searchParams.has('page')
searchParams.toString()
```

The object is read-only. To update query state, clone it.

## Updating search params

```tsx
'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export function SortControl() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  function setSort(sort: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sort)
    params.set('page', '1')

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    })
  }

  return (
    <button onClick={() => setSort('price')}>
      Sort by price
    </button>
  )
}
```

The pattern is:

```text
read current params
  ↓
clone into mutable URLSearchParams
  ↓
set/delete values
  ↓
construct next URL
  ↓
push or replace
```

## Push vs replace for URL state

Use `push` when each URL state is a meaningful navigation step.

Example:

```text
/products?page=1
→ /products?page=2
→ /products?page=3
```

The Back button returning through pages can be useful.

Use `replace` for high-frequency transient changes such as every debounced search keystroke.

```text
?q=c
→ ?q=co
→ ?q=cof
→ ?q=coffee
```

Creating four Back-button entries there is usually poor UX.

## Search input with debounce

Conceptually:

```tsx
'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export function SearchBox() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  function update(term: string) {
    const params = new URLSearchParams(searchParams.toString())

    if (term.trim()) {
      params.set('query', term.trim())
    } else {
      params.delete('query')
    }

    params.set('page', '1')
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return <input defaultValue={searchParams.get('query') ?? ''} />
}
```

In a real search field, debounce the navigation so a server-backed result set does not trigger work on every keystroke.

The debounce policy belongs to UX and workload requirements, not a magic universal number.

## Reset dependent state

When a filter changes, old pagination often becomes invalid.

```text
category=all&page=8
```

then:

```text
category=rare-items&page=8
```

may point past the end of the result set.

Reset dependent state:

```ts
params.set('category', nextCategory)
params.set('page', '1')
```

Model query keys as a state machine, not unrelated strings.

## Pagination architecture

A page URL should usually express the current page explicitly:

```text
/products?page=3
```

Benefits:

- direct links
- reload durability
- browser navigation
- analytics visibility
- server rendering from the URL

Avoid storing the only pagination source of truth in client state when the page is meant to be navigable/shareable.

## Parse pagination safely

```ts
function parsePage(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value
  const page = Number(candidate)

  if (!Number.isInteger(page) || page < 1) return 1
  return page
}
```

Then apply an application-specific upper bound when appropriate.

Do not allow absurd page values to trigger pathological database offsets or expensive work.

## Multi-value filters

For:

```text
/products?tag=coffee&tag=grinder
```

Client:

```ts
const tags = searchParams.getAll('tag')
```

Server Page prop may contain:

```ts
{ tag: ['coffee', 'grinder'] }
```

Normalize both shapes into one domain representation early.

## Static rendering and `useSearchParams`

In a statically prerendered route, `useSearchParams()` causes the Client Component tree up to the nearest Suspense boundary to be client-rendered.

This is important enough to design explicitly.

```tsx
import { Suspense } from 'react'
import { SearchToolbar } from './search-toolbar'

export default function Page() {
  return (
    <>
      <StaticHeader />
      <Suspense fallback={<ToolbarSkeleton />}>
        <SearchToolbar />
      </Suspense>
      <StaticContent />
    </>
  )
}
```

The goal is to keep the client-only query-dependent island small.

## Production build requirement

A static page that uses `useSearchParams()` in a Client Component without an appropriate Suspense boundary can fail the production build.

Development rendering can hide this mistake because dev routes are rendered on demand.

Always validate with:

```bash
npm run build
```

or your package-manager equivalent.

## Server Page prop vs client hook

Use the Page `searchParams` prop when query values affect server data loading.

```tsx
const { page, query } = await searchParams
const results = await searchDatabase({ page, query })
```

Use `useSearchParams()` when a Client Component needs current query state for browser interaction.

```tsx
const sort = useSearchParams().get('sort')
```

Do not fetch server data in a client island solely because the query value happens to be readable there.

## URL state vs local state

Good URL state:

- search query
- active filter
- sort order
- current page
- selected report date range
- shareable tab

Usually better local state:

- whether a tooltip is open
- input focus
- animation progress
- temporary draft text before commit
- hover state

Ask:

> Would another person opening this URL expect this state to be represented?

If yes, URL state deserves serious consideration.

## Canonical query strings

Avoid multiple equivalent URLs where possible:

```text
/products?sort=name&page=1
/products?page=1&sort=name
/products?sort=name
```

Your application can choose a canonical representation, for example omitting defaults:

```text
/products
```

Canonicalization improves sharing, analytics, caches, and mental simplicity.

Do not over-engineer query ordering if it provides no practical benefit.

## Accessibility

When search/filter navigation changes results:

- keep form controls labeled
- preserve logical focus
- announce important asynchronous result changes when necessary
- do not move focus on every query-string update
- ensure pagination is usable by keyboard
- mark the current page/selection semantically

URL correctness is not enough; users must understand what changed.

## Common mistakes

### Treating `searchParams` as synchronous

Current App Router Page props are Promise-based.

### Treating Page `searchParams` like `URLSearchParams`

It is a plain object.

### Mutating `useSearchParams()` directly

It is read-only; clone it first.

### Using `push` on every search keystroke

This can create useless history entries.

### Trusting query values in database logic

Validate and map them to application-owned values.

### Forgetting Suspense around static `useSearchParams` islands

The issue often surfaces only during production build.

## Debugging checklist

1. Inspect the exact URL in the address bar.
2. Log the normalized server query object.
3. Check repeated query-key arrays.
4. Check push vs replace history behavior.
5. Check whether dependent keys should reset.
6. Check Suspense around query-reading Client Components.
7. Run a production build.
8. Validate database query bounds and enums.
9. Verify Back/Forward reproduces the expected UI.

## Interview questions

**Why put pagination in the URL instead of React state?**  
It makes the state shareable, reload-safe, browser-history-aware, and available to server rendering.

**What is the modern type of Page `searchParams`?**  
A Promise resolving to a plain object whose values may be strings, string arrays, or undefined.

**Why can `useSearchParams` require Suspense?**  
On statically rendered routes, the query-dependent client subtree must be deferred to the client while preserving a static shell above the nearest Suspense boundary.

**Should raw `sort=price` be passed directly into ORM ordering?**  
No. Map untrusted query input to an application-owned allowlist.

## Exercise

Build `/products` with URL-driven:

- `query`
- `category`
- multi-value `tag`
- `sort`
- `page`

Requirements:

- server-side parsing and validation
- `replace` for debounced search
- deliberate history behavior for pagination
- page reset when filters change
- a Suspense-wrapped client filter toolbar
- `scroll={false}` or equivalent where justified
- safe handling of invalid/absurd page and sort values
