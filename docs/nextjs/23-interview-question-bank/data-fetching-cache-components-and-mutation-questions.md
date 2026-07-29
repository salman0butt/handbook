---
title: Data Fetching, Cache Components & Mutation Questions
sidebar_position: 3
description: Interview questions and concise answer keys for data ownership, fetch semantics, Cache Components, revalidation, Server Actions, forms, transactions, and idempotency.
---

# Data Fetching, Cache Components & Mutation Questions

## 1. Where should App Router data fetching happen by default?

In Server Components or server-owned query/DAL modules when the data is canonical server state and no browser-only reason exists.

## 2. Why avoid a Server Component calling your own Route Handler?

It adds an unnecessary HTTP/serialization hop and duplicates auth/error/cache concerns. Reuse the underlying server function/query directly unless HTTP is the real contract.

## 3. When is client-side fetching still appropriate?

Browser-owned live interactions, client-only APIs, polling/realtime libraries, or state that must refresh independently after hydration.

## 4. How do you avoid waterfalls?

Start independent work early, parallelize safe independent operations, preload shared reads, and keep true dependencies sequential.

## 5. Why can `Promise.all` be harmful?

Unbounded parallelism can saturate DB pools, external quotas, memory or CPU. Parallelize with capacity awareness.

## 6. What is N+1?

One parent read triggers one additional read per item. Fix with joins, batching, preloading or data-shape redesign.

## 7. What does React `cache()` solve?

Memoization/deduplication of matching server work in the relevant React cache/render lifetime. It is not a persistent cross-request application cache.

## 8. React `cache()` vs Next cache?

React cache is render/server memoization; Next caching can persist data/output across requests with explicit freshness/revalidation semantics.

## 9. What are Cache Components?

The current Next.js model for composing prerenderable/cached work with request-time dynamic work, often using Suspense boundaries to form a static shell plus dynamic holes.

## 10. What does `'use cache'` mean?

It marks a function/component scope for Next.js caching under the Cache Components model. Correct identity and freshness still have to be designed.

## 11. What does `cacheLife` control?

The cache lifetime/profile for cached work—how long the cached result should be considered fresh/stale according to the selected policy.

## 12. What does `cacheTag` do?

Associates semantic tags with cached work so later mutations can invalidate/revalidate related data intentionally.

## 13. `revalidateTag` vs `updateTag`?

Both relate to tag freshness, but they express different freshness semantics. Choose based on whether stale data may be served while revalidating versus requiring a stronger immediate invalidation/read-your-writes style behavior under the current API contract.

## 14. What does `revalidatePath` do?

Invalidates/revalidates route output associated with a path. It is broader and route-oriented compared with semantic data tags.

## 15. What does `refresh` from server mutation context represent?

A way to cause the relevant client route to refresh/reconcile server output after a mutation. It is not a substitute for correct persistent cache invalidation.

## 16. What does `connection()` represent?

An explicit request-time boundary when code intentionally needs runtime/request execution without depending on a particular request API as a side effect.

## 17. Why is cache identity a security concern?

If user/tenant/role/locale or another authorization-dependent dimension changes the result, omitting it can cause unsafe data reuse.

## 18. What is the safest cache rule?

Cache the result of an already-authorized query with an identity that includes all dimensions affecting the result.

## 19. Why can caching search queries be dangerous operationally?

Unbounded query cardinality can create memory/storage pressure and poor hit rates. Validate/bound inputs and cache only when reuse justifies cost.

## 20. What is the Router Cache?

A browser-side cache of route/RSC segment data used for fast client navigation. It is distinct from server data/output caches.

## 21. Why can a hard reload be fresh while soft navigation is stale?

The browser router may reuse cached route data even when canonical server data changed, depending on invalidation/refresh/navigation state.

## 22. What is a Server Function?

A function that executes on the server and can be referenced across the server/client boundary under React/Next’s supported model.

## 23. What is a Server Action?

A Server Function used as a mutation entry point from UI/forms/client interaction.

## 24. What must a Server Action validate?

Input, authentication, authorization and resource/tenant ownership—treat it as a server request boundary, not a trusted local callback.

## 25. Server Action vs Route Handler?

Use an Action for app-owned UI mutations; use a Route Handler when an explicit HTTP API/webhook/mobile/public contract is needed.

## 26. Where should business logic live?

Below the adapter in commands/use-cases/domain modules so Server Actions, Route Handlers, jobs and admin tooling can reuse invariants without duplication.

## 27. What is progressive enhancement with forms?

A form can submit meaningfully through the server action path even before/without complex client JavaScript, while client hooks enhance pending/optimistic UX.

## 28. What does `useActionState` solve?

Connects an Action’s returned state to rendered client UI, useful for validation/result state and pending-aware workflows.

## 29. What does `useFormStatus` solve?

Lets descendants of the relevant form observe form submission status and related action metadata, enabling localized pending UI.

## 30. What does `useOptimistic` solve?

Provides a temporary optimistic projection while an async mutation is in flight. The UI must still converge to canonical server state or roll back on failure.

## 31. When should you avoid optimistic UI?

When showing success prematurely would violate important invariants—for example confirmed payment or scarce inventory—unless the UI clearly represents pending confirmation and supports rollback.

## 32. What is idempotency?

Repeated delivery of the same logical operation produces one canonical business effect.

## 33. Where should idempotency be enforced?

At the server/business persistence boundary with stable keys/constraints/transaction semantics, not only by disabling a button.

## 34. Why use transactions?

To preserve invariants across writes that must succeed/fail atomically, such as order creation plus inventory reservation.

## 35. Why not perform slow provider calls inside DB transactions?

They extend lock/connection time, increase contention and couple DB availability to network latency. Prefer transaction + durable follow-up patterns when semantics allow.

## 36. What is an outbox pattern?

Persist the business change and an event/outbox record atomically, then publish/process the event asynchronously so secondary effects are durable.

## 37. What should happen after a mutation?

Return/redirect expected UI state, invalidate/revalidate affected caches, refresh client route state where needed, and trigger durable side effects according to the command contract.

## 38. How do you test caching?

Test miss/hit, stale/fresh, invalidation, tenant/user isolation, mutation read-your-writes expectations and backend failure behavior at the lowest reliable layer plus integration/E2E where framework cache behavior matters.

## 39. How do you test a Server Action?

Cover unauthenticated, unauthorized, invalid input, valid mutation, duplicate/idempotent invocation, transaction failure, expected errors, revalidation/redirect effects and browser form behavior.

## 40. Senior cache answer pattern?

Always state:

```text
identity
freshness
invalidation
security scope
failure mode
production topology
```

before recommending a cache technology.