---
title: TanStack Query Mutations, Invalidation, and Optimistic UI
description: Learn useMutation, query invalidation, cache updates, optimistic UI, rollback, and mutation architecture in TanStack Query 5.
sidebar_position: 2
---

# TanStack Query mutations, invalidation, and optimistic UI

Queries read server state.

Mutations change server state.

```text
query
→ read remote state

mutation
→ request remote change
```

The hard part is not sending the request. It is reconciling the client cache with the authoritative server afterward.

## Basic mutation

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

async function createProduct(input: NewProduct): Promise<Product> {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error('Could not create product')
  }

  return response.json()
}

function NewProductButton() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['products'],
      })
    },
  })

  return (
    <button
      disabled={mutation.isPending}
      onClick={() => mutation.mutate({ name: 'Lamp', price: 20 })}
    >
      {mutation.isPending ? 'Saving…' : 'Create'}
    </button>
  )
}
```

## Mutation lifecycle

```text
mutate(variables)
      │
      ▼
pending
      │
      ├── success
      │     ├── update cache OR invalidate
      │     └── continue UI flow
      │
      └── error
            └── show/recover/rollback
```

A mutation result is not automatically the same thing as every cached query that may be affected by the change.

## Invalidation

When a mutation makes related cached data out of date, invalidate the relevant queries.

```ts
await queryClient.invalidateQueries({
  queryKey: ['products'],
})
```

Conceptually:

```text
mutation succeeds
      │
      ▼
related cache is known stale
      │
      ▼
invalidate matching queries
      │
      ▼
active observers may refetch
```

Target invalidation deliberately. Invalidating the entire cache after every mutation destroys much of the value of caching.

## Prefix matching

If your query keys are hierarchical:

```ts
['products']
['products', 'list', filters]
['products', 'detail', id]
```

then invalidating a broad prefix may affect several related entries.

Use key factories and naming conventions so this behavior is intentional.

## Direct cache update

If the mutation response returns the authoritative updated entity, you can write it directly into a cache entry.

```ts
onSuccess: (product) => {
  queryClient.setQueryData(
    ['product', product.id],
    product,
  )
}
```

This can avoid an extra request for that exact resource.

But consider whether related list/filter caches also became stale.

## Invalidate vs direct update

```text
Direct cache update
├── immediate
├── precise
└── requires correct cache-shape knowledge

Invalidation + refetch
├── simpler
├── trusts server reconstruction
└── requires another request for active data
```

A production application may combine both.

## Optimistic UI: UI-only approach

TanStack Query v5 supports showing optimistic UI using mutation variables without necessarily editing the cache.

```tsx
const addTodo = useMutation({
  mutationFn: createTodo,
  onSettled: async () => {
    await queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})
```

While pending, render `addTodo.variables` as a temporary row.

```text
existing cached todos
        +
pending mutation variables
        ↓
optimistic visible row
```

This is often simpler when only one UI location needs the optimistic result.

## Optimistic cache update

When several parts of the UI need to observe the optimistic result, update the cache.

```ts
const mutation = useMutation({
  mutationFn: updateTodo,

  onMutate: async (updatedTodo) => {
    await queryClient.cancelQueries({
      queryKey: ['todos'],
    })

    const previousTodos = queryClient.getQueryData<Todo[]>(['todos'])

    queryClient.setQueryData<Todo[]>(['todos'], (current = []) =>
      current.map((todo) =>
        todo.id === updatedTodo.id
          ? { ...todo, ...updatedTodo }
          : todo,
      ),
    )

    return { previousTodos }
  },

  onError: (_error, _variables, context) => {
    if (context?.previousTodos) {
      queryClient.setQueryData(['todos'], context.previousTodos)
    }
  },

  onSettled: async () => {
    await queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})
```

## Optimistic rollback model

```text
snapshot previous cache
        │
        ▼
apply optimistic change
        │
        ▼
send mutation
    ┌───┴────┐
    ▼        ▼
success    failure
  │           │
  ▼           ▼
reconcile   restore snapshot
    \        /
     ▼      ▼
   invalidate/refetch if needed
```

Optimistic state is provisional.

The server remains authoritative.

## Avoid race-condition bugs

Before patching a query optimistically, cancelling relevant in-flight refetches can prevent an older response from overwriting the optimistic cache.

That is why many optimistic-update examples call `cancelQueries` in `onMutate`.

## Mutation errors

Do not reduce every failure to one generic toast.

Separate categories where useful:

- validation error;
- authentication failure;
- authorization failure;
- conflict/version error;
- transient network failure;
- server failure.

The client should not invent success when the authoritative server rejected the change.

## Server validation still wins

Client validation improves UX, but mutation input is untrusted on the server.

```text
form validation passes
        │
        ▼
mutation sent
        │
        ▼
server validates again
        │
        ▼
authorize + persist
```

TanStack Query does not replace backend validation or authorization.

## Idempotency

For actions that must not be duplicated—payments, booking confirmation, order creation—design server-side idempotency.

Disabling a button on the client is not a complete duplicate-submission guarantee.

## Mutation state vs form state

Keep responsibilities separate:

```text
React Hook Form
├── input values
├── field validation
├── dirty/touched
└── submit preparation

TanStack Query mutation
├── remote request
├── pending/error/success
├── cache reconciliation
└── invalidation
```

These tools complement each other.

## Common mistakes

### Updating every cache manually

Direct cache writes are powerful but increase coupling to cache shapes.

Use invalidation when correctness and simplicity are more valuable than avoiding one request.

### Optimistic UI without rollback/reconciliation

If the server can reject the mutation, provisional UI needs a recovery path.

### Invalidating unrelated resources

Broad invalidation can create unnecessary network traffic.

### Copying mutation result into global client state

If the data remains server-owned, keep its lifecycle in the server-state cache.

## Exercise

Build a todo mutation flow that:

- creates a todo;
- displays pending UI;
- invalidates the list after success;
- adds an optimistic row;
- handles server failure visibly;
- explains whether the optimistic state lives in UI or cache.

## Interview questions

**Mid-level:** What is the difference between a query and a mutation?

**Senior:** When would you invalidate versus directly update cached data?

**Senior:** Why might you cancel queries before an optimistic cache update?

**Staff:** How would you design optimistic updates for a collaborative system where the server may reject writes because of version conflicts?

## References

- https://tanstack.com/query/v5/docs/framework/react/guides/mutations
- https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation
- https://tanstack.com/query/v5/docs/framework/react/guides/optimistic-updates
