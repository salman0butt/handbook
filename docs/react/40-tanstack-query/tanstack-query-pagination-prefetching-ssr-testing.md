---
title: TanStack Query Pagination, Prefetching, SSR, and Testing
description: Design pagination, infinite queries, prefetching, SSR hydration, Suspense integration, testing, and large-scale query architecture in TanStack Query 5.
sidebar_position: 3
---

# TanStack Query pagination, prefetching, SSR, and testing

Once basic queries and mutations are clear, the next problems are request shape, navigation, server rendering, and testability.

## Pagination

Put page/filter parameters in the query key.

```tsx
const projectsQuery = useQuery({
  queryKey: ['projects', { page, status }],
  queryFn: () => getProjects({ page, status }),
})
```

```text
page 1
→ ['projects', { page: 1 }]

page 2
→ ['projects', { page: 2 }]
```

Each page is a distinct cache identity.

## Keep previous data deliberately

Pagination UX often benefits from keeping the previous page visible while the next page loads.

TanStack Query v5 supports placeholder-data patterns for this kind of transition.

The architectural goal is:

```text
current page visible
       │
       ├── request next page
       │
       ▼
next page ready
       │
       ▼
swap displayed data
```

Avoid blanking the entire interface unnecessarily during every page change.

## Infinite queries

Use infinite queries when data is loaded incrementally by page/cursor.

```text
page 1
  ↓
page 2
  ↓
page 3
```

The server should provide a stable pagination/cursor contract.

Client cache logic cannot fix an unstable backend pagination model.

## Prefetching

Prefetch data before a component needs it when user intent or routing makes that worthwhile.

```ts
await queryClient.prefetchQuery({
  queryKey: ['product', id],
  queryFn: () => getProduct(id),
})
```

```text
user likely navigates
       │
       ▼
prefetch query
       │
       ▼
cache populated
       │
       ▼
destination observer reads cache
```

Do not prefetch everything. Prefetching trades network/server work for lower future latency.

## Request waterfalls

Bad shape:

```text
render
 ↓
fetch user
 ↓
render
 ↓
fetch projects
 ↓
render
 ↓
fetch permissions
```

If dependencies are artificial, restructure to fetch in parallel.

```text
render
 ├── fetch user
 ├── fetch projects
 └── fetch permissions
```

TanStack Query helps manage async work, but architecture determines whether requests can start together.

## Suspense

TanStack Query supports Suspense-oriented APIs/patterns.

Keep the mental model clear:

```text
TanStack Query
→ owns server-state query lifecycle

Suspense
→ controls readiness/reveal boundary
```

Suspense is not itself the network/cache layer.

## SSR and hydration

For server rendering, a common model is:

```text
server request
     │
     ▼
create request-safe QueryClient
     │
     ▼
prefetch queries
     │
     ▼
dehydrate cache
     │
     ▼
HTML + dehydrated state
     │
     ▼
client QueryClient
     │
     ▼
hydrate cache
```

The exact integration depends on the framework.

## QueryClient isolation on the server

Do not share user-specific query cache across unrelated server requests.

```text
Request A → QueryClient A
Request B → QueryClient B
```

This is both correctness and privacy architecture.

## Next.js / Server Components

TanStack Query's current docs include advanced patterns for Server Components and the Next.js App Router.

But first ask:

> Should this data be fetched and rendered entirely by the framework/server layer, or does the browser need an active TanStack Query cache for ongoing synchronization?

Do not add a client cache simply because the application uses React.

## When TanStack Query is useful after SSR

Examples:

- background refresh after hydration;
- client mutations that invalidate cached views;
- browser-only pagination/filter transitions;
- polling or refetch behavior;
- optimistic client mutations;
- data shared by several interactive client components.

If the page is mostly server-rendered and does not need client cache behavior, framework data APIs may be simpler.

## Testing query functions

Pure request functions can be tested separately.

```ts
it('throws when product request fails', async () => {
  server.use(
    http.get('/api/products', () => HttpResponse.json({}, { status: 500 })),
  )

  await expect(getProducts()).rejects.toThrow()
})
```

Use a request-mocking layer such as MSW when testing realistic network behavior.

## Fresh QueryClient per test

Create a fresh client so caches do not leak between tests.

```tsx
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
}
```

```text
test A → QueryClient A

test B → QueryClient B
```

## Test user-visible query behavior

```tsx
it('shows loaded products', async () => {
  const client = createTestQueryClient()

  render(
    <QueryClientProvider client={client}>
      <ProductList />
    </QueryClientProvider>,
  )

  expect(await screen.findByText('Desk Lamp')).toBeInTheDocument()
})
```

Avoid testing TanStack Query's internal cache implementation. Test your query-key policy, data transforms, mutation effects, and visible behavior.

## Testing invalidation

For a feature where a mutation should refresh a list, assert the observable result after the mutation rather than only spying on `invalidateQueries`.

Direct cache-level tests are appropriate when your abstraction itself owns cache manipulation.

## Error boundaries

Integrate query errors with application error handling deliberately.

Some errors belong inline near the widget; others should reach a route/page-level error boundary.

Do not make every failed request crash the whole application.

## Query ownership at scale

A large application benefits from domain-owned query modules.

```text
features/
├── products/
│   ├── productKeys.ts
│   ├── productQueries.ts
│   └── productMutations.ts
│
└── orders/
    ├── orderKeys.ts
    ├── orderQueries.ts
    └── orderMutations.ts
```

This keeps query keys and invalidation policy near the domain that understands them.

## Avoid one magic query-utils layer

A universal helper that hides every key, stale policy, request function, and invalidation rule can make debugging harder.

Keep abstractions aligned with domain behavior.

## Performance

Measure:

- number of requests;
- request waterfalls;
- cache hit/reuse behavior;
- stale policy;
- refetch triggers;
- server response time;
- payload size;
- component render cost.

Do not treat reducing React renders as the only performance goal when the real bottleneck is network or database latency.

## Security

Hydrated cache data becomes client-visible.

Do not serialize secrets or server-only data into a client cache.

Query input can be user-controlled; server endpoints must independently validate and authorize requests.

## Exercise

Design server-state architecture for a project dashboard:

- paginated projects;
- project detail;
- prefetch detail on intent;
- optimistic rename;
- SSR initial project list;
- background refresh after hydration;
- fresh QueryClient per server request and test.

Document every query key and invalidation edge.

## Interview questions

**Mid-level:** Why must page/filter variables be part of the query key?

**Senior:** When is prefetching worth the cost?

**Senior:** Why should server-rendered requests use isolated query clients?

**Staff:** In a Server Component framework, how would you decide which data belongs only in the server-rendering layer versus a hydrated TanStack Query cache?

## References

- https://tanstack.com/query/latest/docs/framework/react/guides/ssr
- https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr
- https://tanstack.com/query/latest/docs/framework/react/guides/prefetching
- https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries
- https://tanstack.com/query/latest/docs/framework/react/guides/testing
