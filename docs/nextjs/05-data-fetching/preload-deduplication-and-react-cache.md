---
title: Preloading, Deduplication & React cache
description: Start server data early, deduplicate repeated reads deliberately, and distinguish React request memoisation from persistent Next.js caching.
---

# Preloading, Deduplication & React `cache`

A mature data layer separates three questions:

```text
WHEN should work start?
  → preload

HOW do repeated calls share work?
  → memoisation / deduplication

HOW long does data persist across requests?
  → framework/data cache policy
```

This chapter covers the first two.

Persistent caching belongs to Phase 6.

## Start work before you need the value

Imagine a page where multiple subtrees will need the same project:

```tsx
export default function ProjectPage({ projectId }: { projectId: string }) {
  preloadProject(projectId)

  return (
    <>
      <ProjectHeader projectId={projectId} />
      <ProjectActivity projectId={projectId} />
    </>
  )
}
```

A preload function starts work without forcing the current component to wait immediately.

## Preload pattern

```ts
import { cache } from 'react'

export const getProject = cache(async (projectId: string) => {
  return db.project.findUnique({
    where: { id: projectId },
  })
})

export function preloadProject(projectId: string) {
  void getProject(projectId)
}
```

Then descendants can call the same memoized function.

```tsx
async function ProjectHeader({ projectId }: { projectId: string }) {
  const project = await getProject(projectId)
  return <h1>{project?.name}</h1>
}
```

## Why preload?

Without preloading:

```text
render parent
  ↓
render child
  ↓
start query
  ↓
wait
```

With early start:

```text
render parent
  ↓ start query
continue render
  ↓
child needs result
  ↓ await existing work
```

This can shorten the critical path without moving ownership upward merely to await data.

## React `cache`

React `cache` memoizes a function for server rendering scope so repeated calls with matching arguments can share the result.

```ts
import { cache } from 'react'

export const getUser = cache(async (userId: string) => {
  return db.user.findUnique({ where: { id: userId } })
})
```

Two components can call:

```tsx
await getUser('u_42')
```

without requiring the parent to fetch once and prop-drill the full record through unrelated layers.

## React cache is not the persistent Next.js Data Cache

Keep the boundary explicit:

```text
React cache
  → repeated server-render reads can share work
  → request/render-scoped mental model

Next.js persistent caching
  → can reuse data/output beyond one render/request according to framework policy
  → Phase 6
```

Do not assume React `cache` gives long-lived persistence or revalidation semantics.

## Argument identity matters

Memoization keys depend on function arguments.

Prefer primitives/stable inputs:

```ts
getProject(projectId)
```

rather than creating new object arguments everywhere:

```ts
getProject({ projectId })
```

if your intended deduplication depends on argument identity.

Design the function signature to make sharing predictable.

## Authorisation and memoisation

This is dangerous:

```ts
export const getProject = cache(async (projectId: string) => {
  return db.project.findUnique({ where: { id: projectId } })
})
```

if authorization depends on caller identity but the function key does not include/scoped-resolve that identity.

A safer architecture might resolve request identity internally:

```ts
export const getProjectForCurrentUser = cache(async (projectId: string) => {
  const session = await getSession()

  return db.project.findFirst({
    where: {
      id: projectId,
      organisationId: session.organisationId,
    },
  })
})
```

or make the scope explicit in the server API.

Memoisation must not bypass tenant/resource scoping.

## Memoise at the right layer

Good candidate:

```text
getCurrentUser()
getOrganisation(id)
getProject(id)
getPermissions(userId, projectId)
```

Poor candidate:

```text
large function mixing unrelated side effects
random value generator
mutation
request that must execute independently every time
```

Memoize reads with deterministic meaning for the relevant scope.

## Do not cache mutations

A mutation is not a read deduplication problem.

Bad:

```ts
const createOrder = cache(async input => {
  return db.order.create({ data: input })
})
```

Repeated calls may represent distinct operations.

Mutation idempotency belongs to explicit business logic, not React render memoisation.

## Preload should remain optional

A preload helper should not become a hidden requirement that must run before every data function call.

This is robust:

```text
preloadProject(id)   optional early start
getProject(id)       authoritative callable read
```

The getter still works if no preload happened.

## Preload where knowledge exists

A parent route may know a child will need data:

```tsx
export default async function Page({ params }) {
  const { projectId } = await params
  preloadProject(projectId)

  return <ProjectScreen projectId={projectId} />
}
```

But avoid preloading speculative data that most users/routes never consume.

## Deduplication is not batching

These are different:

```text
deduplication
same logical read repeated
→ share one execution

batching
many different reads
→ combine into one operation
```

Example:

```text
getUser(42) + getUser(42)
→ deduplicate

getUser(1), getUser(2), getUser(3)
→ batching may help
```

React `cache` does not automatically turn many different database keys into one SQL query.

## DataLoader-style batching

Graph-like data access may benefit from a request-scoped loader:

```text
component A → user 1
component B → user 2
component C → user 3
       ↓
request-scoped batch
       ↓
SELECT ... WHERE id IN (1,2,3)
```

Use when the query shape actually benefits from batching.

Do not add a loader abstraction to simple direct queries without evidence.

## `fetch` and repeated reads

Server `fetch` participates in framework/React rendering behavior that can reduce duplicate work in relevant cases, but you should not build architecture on folklore.

When a read must be shared predictably across components—especially ORM/database reads—an explicit server function wrapped in React `cache` makes the intended request-scoped memoisation visible.

Persistent server `fetch` caching and revalidation are Phase 6 concerns.

## Promise sharing

You can also share a started promise explicitly:

```ts
const projectPromise = getProject(projectId)
```

Then:

```tsx
<Suspense fallback={<SidebarSkeleton />}>
  <ProjectSidebar projectPromise={projectPromise} />
</Suspense>
```

This is useful when the architecture intentionally passes a server-started Promise into a Client Component or descendant that resolves it with `use()`.

## Avoid global promise caches

This is risky:

```ts
const promises = new Map()
```

at module scope for request/user-specific data.

Long-lived process state can leak data across:

- users
- tenants
- requests
- deployments

Use framework/request-scoped mechanisms unless you have designed a real shared cache with isolation and invalidation.

## Avoid accidental side-effect deduplication

A getter that logs an audit event every time it runs is not a pure read anymore.

```ts
async function getInvoice(id) {
  await writeAuditEvent(...)
  return db.invoice.findUnique(...)
}
```

Memoising that function changes how often the side effect happens.

Keep reads and side effects separate.

## Debugging duplicate work

Symptoms:

- same SQL query repeated many times per request
- same upstream API called from several components
- route latency grows with component count

Workflow:

```text
1. add operation-level tracing
2. group calls by input
3. identify identical vs different reads
4. distinguish N+1 from true duplicates
5. memoize identical request-scoped reads
6. batch different-key reads when appropriate
7. measure again
```

## Debugging stale-data assumptions

If a developer says:

> “But it is wrapped in React cache, why is it fresh on the next request?”

The answer is that React request memoisation is not your long-lived persistent cache policy.

Conversely, if data remains stale across requests, investigate Next.js persistent caching/revalidation rather than blaming React `cache` first.

## Common mistakes

### Treating React `cache` as Redis

It is not a distributed persistent cache.

### Memoizing an unscoped multi-tenant read

Authorization still matters.

### Preloading everything at route entry

Only start work likely to be consumed.

### Using memoisation to hide N+1

Different keys still cause different reads; batch/query better.

### Global Map caches for user data

High leakage/invalidation risk.

## Interview questions

**What problem does React `cache` solve in App Router data access?**  
It lets repeated server-render calls to the same read function share memoized work for the relevant server rendering scope.

**How is React `cache` different from the Next.js Data Cache?**  
React `cache` is request/render memoisation; Next.js persistent caching can reuse data across requests according to framework cache and revalidation policy.

**What is the preload pattern?**  
Call a memoized read early without awaiting it, then consume the same read later so the work has already started.

**Does deduplication solve N+1?**  
Only if repeated calls are for the same key. Many different keys may require batching or a better query.

## Exercise

A project page has five components that each need the current user and project.

Design:

```text
getCurrentUser()
getProject(projectId)
preloadProject(projectId)
```

Document:

- function arguments
- authorization scope
- where preloading starts
- which calls should deduplicate
- which data must never use a module-global cache
- which persistent freshness questions are deferred to Phase 6
