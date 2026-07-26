---
title: TanStack Query Fundamentals and Cache
description: Learn TanStack Query 5 query clients, query keys, query functions, freshness, staleness, cache lifetime, retries, and server-state ownership.
sidebar_position: 1
---

# TanStack Query fundamentals and cache

This handbook targets **TanStack Query 5.101.4**.

TanStack Query is a server-state library: it helps React applications fetch, cache, synchronize, and update asynchronous remote data.

## Server state is different from client state

```text
Client state
├── dialog open
├── selected tab
├── editor tool
└── unsaved draft

Server state
├── products
├── orders
├── account profile
└── inventory
```

The client does not own the authoritative version of server state.

Server state introduces:

- freshness;
- staleness;
- caching;
- refetching;
- retries;
- invalidation;
- background synchronization;
- pagination;
- mutation reconciliation.

## Install

```bash
npm install @tanstack/react-query
```

## Create a QueryClient

```tsx
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
)
```

Mental model:

```text
QueryClient
│
├── query cache
├── mutation cache
└── defaults/policies
      │
      ▼
React query observers
```

## Basic query

```tsx
import { useQuery } from '@tanstack/react-query'

async function getProducts(): Promise<Product[]> {
  const response = await fetch('/api/products')

  if (!response.ok) {
    throw new Error('Failed to load products')
  }

  return response.json()
}

function ProductList() {
  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })

  if (productsQuery.isPending) {
    return <p>Loading products…</p>
  }

  if (productsQuery.isError) {
    return <p>Could not load products.</p>
  }

  return (
    <ul>
      {productsQuery.data.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  )
}
```

## Query key = cache identity

Current TanStack Query v5 query keys are arrays at the top level.

```ts
['products']
['product', productId]
['orders', { status, page }]
```

```text
queryKey
   │
   ▼
identifies cached resource + parameters
   │
   ▼
observers with same key share cache entry
```

If the query function depends on a variable, include that variable in the key.

```tsx
useQuery({
  queryKey: ['product', productId],
  queryFn: () => getProduct(productId),
})
```

## Query key factories

For larger applications, create consistent key helpers.

```ts
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) =>
    [...productKeys.lists(), filters] as const,
  detail: (id: string) =>
    [...productKeys.all, 'detail', id] as const,
}
```

This reduces accidental cache-key drift.

## Fresh vs stale

One of the most important TanStack Query concepts is **freshness**.

```text
query fetched
    │
    ▼
fresh for staleTime
    │
    ▼
stale
    │
    └── eligible for background refetch under configured triggers
```

By default, query data is considered stale immediately unless you configure `staleTime`.

```tsx
useQuery({
  queryKey: ['products'],
  queryFn: getProducts,
  staleTime: 60_000,
})
```

This means the data remains fresh for one minute.

Fresh does not mean "permanently correct." It means TanStack Query should not consider the cached data stale during that period.

## Cache lifetime is separate from freshness

Two different questions:

```text
staleTime
= when should cached data be considered stale?

gcTime
= how long should an unused cache entry remain before garbage collection?
```

Do not confuse freshness with cache retention.

## Important defaults

TanStack Query's defaults are intentionally active.

Key ideas include:

- cached query data is stale by default;
- stale queries can refetch when observers mount or environment triggers occur under policy;
- failed queries retry by default in common client usage;
- inactive queries stay cached until garbage collection policy removes them.

Know the defaults before diagnosing "unexpected extra requests."

## Deduplication through cache identity

Two components using the same query key are observing the same cached query identity.

```text
Header
  └── ['user', 42]

ProfilePage
  └── ['user', 42]

          ↓
      same cache entry
```

This is fundamentally different from both components independently using `useEffect(fetch...)`.

## Query function errors

A query function should reject/throw when the operation fails.

`fetch` does not reject merely because the response status is 404/500, so check `response.ok` yourself when using fetch directly.

## Query cancellation

TanStack Query provides an `AbortSignal` to query functions.

```ts
async function getProduct({ signal }: QueryFunctionContext) {
  const response = await fetch('/api/product', { signal })
  // ...
}
```

Use cancellation when your data source supports it and aborting obsolete work is meaningful.

## Dependent queries

Sometimes query B cannot run until query A provides an identifier.

```tsx
const userQuery = useQuery({
  queryKey: ['user', email],
  queryFn: () => getUser(email),
})

const projectsQuery = useQuery({
  queryKey: ['projects', userQuery.data?.id],
  queryFn: () => getProjects(userQuery.data!.id),
  enabled: Boolean(userQuery.data?.id),
})
```

Be careful: dependent queries can create request waterfalls.

If requests can run in parallel, prefer parallel architecture.

## TanStack Query vs `useEffect`

Manual effect fetching often becomes:

```text
useEffect
├── loading state
├── error state
├── race handling
├── cleanup
├── retry
├── caching
├── refetch
└── invalidation
```

TanStack Query centralizes that server-state lifecycle.

Effects still have valid synchronization uses. The point is not "never fetch in an Effect"; it is to recognize when you are rebuilding a cache system.

## TanStack Query vs Redux/Zustand

```text
Redux / Zustand
→ client-owned shared state

TanStack Query
→ remote/server-owned state lifecycle
```

A real application may use both.

## Debugging

When data appears "wrong," ask:

1. What is the query key?
2. Is every query-function variable represented in that key?
3. Is the data fresh or stale?
4. Is an observer mounted?
5. Which refetch trigger occurred?
6. Was the query invalidated?
7. Are two resources accidentally sharing a key?
8. Is the server actually returning stale data?

Use TanStack Query Devtools during development when useful.

## Exercise

Build a product catalogue with:

- `['products', filters]` list queries;
- `['product', id]` detail queries;
- loading and error UI;
- a one-minute `staleTime` for product details;
- a documented key factory.

Then explain when two components share the same cached data.

## Interview questions

**Junior:** What do `queryKey` and `queryFn` represent?

**Mid-level:** What is the difference between stale data and garbage-collected cache data?

**Senior:** Why can dependent queries create waterfalls?

**Staff:** How would you design query-key ownership across many teams so invalidation remains predictable?

## References

- https://tanstack.com/query/latest/docs/framework/react/installation
- https://tanstack.com/query/latest/docs/framework/react/guides/query-keys
- https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults
- https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation
- https://www.npmjs.com/package/@tanstack/react-query
