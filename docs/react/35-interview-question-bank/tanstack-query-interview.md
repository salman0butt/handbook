---
title: TanStack Query Interview Questions
description: TanStack Query v5 interview questions covering server-state mental models, query keys, freshness, mutations, invalidation, optimistic UI, SSR, testing, and architecture.
---

# TanStack Query interview questions

TanStack Query should be discussed as **server-state infrastructure**, not as a generic replacement for every client-state tool.

## Fundamentals

### 1. What problem does TanStack Query solve?

**Strong answer:** It manages asynchronous server state in the client: fetching, caching, freshness, refetching, retries, invalidation, background synchronization, mutations, pagination, and related lifecycle state.

### 2. Why is server state different from client state?

**Strong answer:** The server is authoritative. Client copies can become stale, need refetching, can fail independently, and may be shared by multiple consumers. Local UI state has different ownership and lifecycle rules.

### 3. What does `QueryClient` own?

**Strong answer:** Query and mutation caches plus configuration/default policies used by observers across the application.

### 4. What does `QueryClientProvider` do?

**Strong answer:** Makes a QueryClient available to React Query hooks through React context.

### 5. What is a query?

**Strong answer:** A cached async read identified by a query key and resolved by a query function.

### 6. What is a query key?

**Strong answer:** The cache identity for a query. In v5 it is an array at the top level and should contain all serializable inputs that distinguish the data being requested.

**Follow-up:** Why is `['todos', { status, page }]` better than just `['todos']` if the result depends on status/page?

### 7. What happens if a query key omits a variable used by the query function?

**Strong answer:** Different requests can incorrectly share one cache entry, causing stale or wrong data to be reused.

### 8. Are object property orders inside query keys significant?

**Strong answer:** Query-key hashing is deterministic for serializable object properties, so object property order does not create a different key; array item order does matter.

### 9. What does a query function need to do on failure?

**Strong answer:** Return a Promise that resolves with data or rejects/throws on failure. Returning an HTTP error response as if it were valid data prevents the library from entering an error state.

## Freshness and cache lifetime

### 10. What does `staleTime` control?

**Strong answer:** How long successful query data is considered fresh before becoming stale.

### 11. What does `gcTime` control?

**Strong answer:** How long inactive cached data remains before garbage collection. It is a cache-retention concept, not freshness.

### 12. Why is confusing `staleTime` and `gcTime` dangerous?

**Strong answer:** You may think data is “cached for five minutes” when you actually changed freshness, or vice versa. One affects refetch eligibility/freshness, the other inactive cache retention.

### 13. Does stale mean unusable?

**Strong answer:** No. Stale data may still be displayed while the library refetches according to policy.

### 14. Why can background refetching be good UX?

**Strong answer:** The UI can show cached data immediately while updating it in the background instead of forcing users through a full loading state for every revisit.

### 15. When might `staleTime: Infinity` be justified?

**Strong answer:** When data effectively does not become stale during the application session or changes only through explicit invalidation. It should be a domain decision, not a blanket optimization.

## Query execution

### 16. What does `enabled` do?

**Strong answer:** Controls whether a query automatically runs. It is often used for dependent queries when prerequisite input is not available yet.

### 17. What is a dependent-query waterfall?

**Strong answer:** A later request cannot begin until an earlier request resolves, increasing end-to-end latency. Sometimes required by data dependencies, but accidental waterfalls should be redesigned.

### 18. When would you use `useQueries`?

**Strong answer:** When the number of independent queries is variable and multiple query definitions need to run in parallel.

### 19. What is prefetching?

**Strong answer:** Populating the cache before a component requires the data, such as on route intent or server preparation, to reduce perceived latency later.

### 20. Why is prefetching not always an optimization?

**Strong answer:** It consumes bandwidth/server work and may fetch data users never view. Measure and target likely navigation paths.

## Mutations

### 21. What is a mutation?

**Strong answer:** An async operation that changes server state or performs a server side effect. TanStack Query exposes `useMutation` for this lifecycle.

### 22. `mutate` vs `mutateAsync`?

**Strong answer:** `mutate` uses callback-oriented lifecycle handling; `mutateAsync` returns a Promise, which is useful when composing async control flow with `try/catch/finally`.

### 23. Do mutations retry by default?

**Strong answer:** Current TanStack Query docs state mutations do not retry by default, though retry can be configured.

### 24. What is query invalidation?

**Strong answer:** Marking matching cached queries stale so the cache knows their current data may no longer be authoritative and can refetch according to observer/activity rules.

### 25. Why invalidate after a mutation?

**Strong answer:** A successful mutation may change data represented by one or more cached queries. Invalidation reconnects the mutation to affected server-state reads without manually duplicating every update.

### 26. When should you use `setQueryData`?

**Strong answer:** When you already have the authoritative updated result and can update the relevant cache entry directly, avoiding a network round-trip. Updates must preserve immutability.

### 27. Why must `setQueryData` updates be immutable?

**Strong answer:** In-place mutation can break cache-change detection and produce subtle inconsistencies. Return new data structures for changed values.

## Optimistic updates

### 28. What is an optimistic update?

**Strong answer:** Update the UI/cache before the server confirms success, then reconcile on success or roll back/recover on failure.

### 29. What information do you need for rollback?

**Strong answer:** A snapshot or reconstructable previous state plus enough mutation context to restore affected cache entries if the request fails.

### 30. When should you avoid optimistic updates?

**Strong answer:** When failure cost is high, server rules are complex, conflicts are likely, or the client cannot predict the authoritative result accurately.

### 31. Optimistic UI vs `useOptimistic` in React—same thing?

**Strong answer:** Same broad UX goal, different ownership/infrastructure. TanStack Query optimistic workflows coordinate with a server-state cache; React `useOptimistic` is a rendering/state primitive and does not provide query caching/invalidation by itself.

## Error/loading states

### 32. `isPending` vs `isFetching` conceptually?

**Strong answer:** Pending represents the query’s initial no-success-data pending state; fetching means a request is currently in flight and can also happen during background refetching when cached data already exists.

### 33. Why is a full-page spinner on every refetch usually bad UX?

**Strong answer:** Background fetching does not necessarily mean the existing data is unusable. Preserve visible cached content and show a lighter refetch indicator when appropriate.

### 34. How should HTTP errors be handled in a fetch query function?

**Strong answer:** Check `response.ok` and throw/reject for failed HTTP statuses because `fetch` itself does not reject on ordinary 4xx/5xx responses.

## Pagination and infinite queries

### 35. What should be in a pagination query key?

**Strong answer:** Every input that changes the result, such as page, cursor, filters, and sorting when those affect the server response.

### 36. Why can pagination feel slow even with caching?

**Strong answer:** A newly requested page may have no cached result yet. Prefetching likely next pages or using appropriate placeholder strategies can improve perceived continuity.

### 37. Infinite query vs normal paginated queries?

**Strong answer:** Infinite queries model a growing sequence of pages/cursors as one query structure; normal pagination often treats each page identity independently. Choose based on UI/data model.

## SSR and hydration

### 38. What does dehydration/hydration do?

**Strong answer:** Serialize prepared query-cache state on the server and restore it into a client QueryClient so the client can reuse server-fetched results instead of starting from an empty cache.

### 39. Why should QueryClient lifetime be considered during SSR?

**Strong answer:** Request-specific data must not leak across users. Server-side QueryClient instances should follow request-safe lifecycle rules.

### 40. Is TanStack Query required in every Server Component application?

**Strong answer:** No. Server Components can fetch/read data directly on the server. TanStack Query is useful when client-side server-state ownership, background synchronization, mutations, offline behavior, or client cache reuse is actually needed.

### 41. How do you decide between server fetching and client Query?

**Strong answer:** Consider who needs the data, where interactivity lives, cache ownership, freshness, navigation behavior, mutation/refetch needs, latency, and framework capabilities. Avoid adding a client cache merely because data is remote.

## Testing

### 42. What is the key test-isolation rule for QueryClient?

**Strong answer:** Give tests isolated cache state—commonly a fresh QueryClient per test/test wrapper—so previous test data does not leak into later tests.

### 43. Why configure retries carefully in tests?

**Strong answer:** Automatic retries can make failure tests slower and less deterministic. Test configuration can disable/reduce retries where the retry behavior itself is not under test.

### 44. What should feature tests assert?

**Strong answer:** User-visible loading/error/success/mutation behavior and meaningful cache effects, not private library implementation details.

## Architecture comparisons

### 45. TanStack Query vs Redux Toolkit?

**Strong answer:** Redux Toolkit primarily structures client state; RTK Query adds server-state support. TanStack Query focuses specifically on server state and does not require Redux. The comparison should often be TanStack Query vs RTK Query, not TanStack Query vs Redux as a whole.

### 46. TanStack Query vs Zustand?

**Strong answer:** Query owns remote/server state; Zustand owns client state. Using both can be cleaner than forcing server data into Zustand.

### 47. TanStack Query vs React Hook Form?

**Strong answer:** Query manages remote data; RHF manages in-progress form values/validation metadata. A common flow is query data → form defaults → submit mutation → invalidate/update query cache.

### 48. Should query data be copied into global client state?

**Strong answer:** Usually no. That creates two sources of truth. Consume query cache directly unless you intentionally create a separate client-owned draft/workflow state.

### 49. Senior scenario: a dashboard refetches the same endpoint independently in six components with six Effects. What would you change?

**Strong answer:** Centralize server-state ownership through shared query keys/query functions so consumers share cache state, deduplication/freshness policy, error/loading behavior, invalidation, and observability instead of six independent request lifecycles.

### 50. Staff scenario: how would you define query-key governance across teams?

**Strong answer:** Create domain-owned query-key factories/conventions, define invalidation boundaries, document freshness policies, separate public endpoint abstractions from UI components, and measure cache/refetch behavior. Avoid one global key registry owned by no team.

## Rapid-fire checks

1. Query key top level in v5? **Array.**
2. Server state or local UI state? **Server state.**
3. Stale data always removed? **No.**
4. `gcTime` equals `staleTime`? **No.**
5. Mutations retry by default? **No.**
6. Direct cache update may avoid refetch? **Yes.**
7. Mutate cached objects in place? **No.**
8. Can background refetch happen with visible data? **Yes.**
9. Query cache replaces authorization? **No.**
10. Query and RHF can work together? **Yes.**

## Official references

- https://tanstack.com/query/latest/docs/framework/react/guides/query-keys
- https://tanstack.com/query/v5/docs/framework/react/reference/useQuery
- https://tanstack.com/query/latest/docs/framework/react/guides/mutations
- https://tanstack.com/query/latest/docs/framework/react/guides/updates-from-mutation-responses
- https://tanstack.com/query/latest/docs/framework/react/reference/useMutation
