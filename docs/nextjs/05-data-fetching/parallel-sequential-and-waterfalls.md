---
title: Parallel Fetching, Sequential Fetching & Waterfalls
description: Start independent data work early, preserve real dependencies, and diagnose server waterfalls with a critical-path mental model.
---

# Parallel Fetching, Sequential Fetching & Waterfalls

Data fetching performance is often dominated by **dependency structure**, not by React itself.

Two requests that each take 300 ms can cost roughly:

```text
sequential: 300 + 300 ≈ 600 ms
parallel:   max(300, 300) ≈ 300 ms
```

Real systems add network, database, rendering, and scheduling overhead, but the mental model is useful.

## Sequential fetching

Sequential work is correct when one result is required to start the next operation.

```tsx
const user = await getUser(userId)
const organisation = await getOrganisation(user.organisationId)
```

Dependency graph:

```text
getUser
  ↓
organisationId
  ↓
getOrganisation
```

You cannot safely start the second call until you know the ID.

## Accidental waterfall

This is different:

```tsx
const project = await getProject(projectId)
const activity = await getActivity(projectId)
const members = await getMembers(projectId)
```

If all three depend only on `projectId`, the awaits create an unnecessary waterfall.

## Start independent work together

```tsx
const [project, activity, members] = await Promise.all([
  getProject(projectId),
  getActivity(projectId),
  getMembers(projectId),
])
```

Dependency graph:

```text
          ┌→ getProject ───┐
projectId ├→ getActivity ──┼→ render
          └→ getMembers ───┘
```

## Start early, await late

Sometimes you want finer control than one `Promise.all` block.

```tsx
const projectPromise = getProject(projectId)
const membersPromise = getMembers(projectId)

const project = await projectPromise

const permissionsPromise = getPermissions(project.organisationId)

const [members, permissions] = await Promise.all([
  membersPromise,
  permissionsPromise,
])
```

This preserves the real dependency while overlapping unrelated work.

## Component boundaries can parallelize naturally

Instead of one parent awaiting everything:

```tsx
export default function Dashboard() {
  return (
    <>
      <Revenue />
      <RecentOrders />
      <Alerts />
    </>
  )
}
```

with each async Server Component owning independent data:

```tsx
async function Revenue() {
  const revenue = await getRevenue()
  return <RevenueCard value={revenue} />
}
```

```tsx
async function RecentOrders() {
  const orders = await getRecentOrders()
  return <OrdersTable orders={orders} />
}
```

The server render can begin independent work without forcing one large top-level sequence.

## But component nesting can create a waterfall

```tsx
async function Parent() {
  const user = await getUser()
  return <Child user={user} />
}

async function Child({ user }) {
  const recommendations = await getRecommendations(user.id)
  return ...
}
```

This may be a real dependency.

But if recommendations only need a request-level user ID already available elsewhere, the parent-child sequence may be architectural rather than necessary.

## Identify the critical path

Draw the page:

```text
session ──────────────┐
                     ↓
project ──┬→ members ─┼→ main content
          └→ activity ┘

billing ───────────────→ sidebar
```

Then label approximate durations:

```text
session 80 ms
project 120 ms
members 300 ms
activity 220 ms
billing 500 ms
```

Questions:

- Which work blocks first meaningful content?
- Which work can start at request entry?
- Which subtree can stream independently?
- Which call can be cached or precomputed later?
- Which dependency exists only because of component placement?

## Promise.all failure semantics

`Promise.all` rejects when one input rejects.

That may be correct for a cohesive unit:

```tsx
const [account, permissions] = await Promise.all([
  getAccount(id),
  getPermissions(id),
])
```

If either is required for safe rendering, fail the unit.

But optional data might need independent handling:

```tsx
const accountPromise = getAccount(id)
const recommendationsPromise = getRecommendations(id)
  .catch(() => [])
```

Do not turn every error into an empty fallback. Only degrade gracefully when the product semantics allow it.

## Avoid giant fan-out

Parallelizing 100 requests is not automatically good.

```text
Promise.all(100 remote calls)
```

can cause:

- upstream overload
- rate-limit spikes
- connection pool pressure
- database saturation
- memory growth
- tail-latency amplification

Concurrency should match the dependency and infrastructure contract.

## Database N+1

Example:

```ts
const projects = await db.project.findMany()

const rows = await Promise.all(
  projects.map(async project => ({
    project,
    owner: await db.user.findUnique({
      where: { id: project.ownerId },
    }),
  })),
)
```

Even though the inner queries run in parallel, you still created N+1 database work.

Prefer database-level joins/includes/batching when appropriate:

```ts
const projects = await db.project.findMany({
  include: { owner: true },
})
```

Parallelism does not fix a poor query shape.

## Pool limits matter

A route that launches many database calls can exhaust a small connection pool.

Measure:

```text
query count
pool wait time
query duration
concurrent requests
transaction duration
```

Do not benchmark one isolated request and assume production concurrency behaves the same.

## External API concurrency

For a service with strict rate limits, use bounded concurrency when needed rather than unbounded fan-out.

Architectural options:

- aggregate upstream
- batch IDs
- cache shared data
- precompute
- queue non-critical work
- stream optional UI later

## Sequential UX can still be correct

Example checkout:

```text
validate cart
  ↓
load authoritative prices
  ↓
calculate tax
  ↓
create payment intent
```

These stages have real dependencies.

Trying to parallelize them could produce incorrect or insecure results.

The goal is not “parallelize everything.”

The goal is:

> **remove accidental dependencies, preserve real ones.**

## Waterfalls across service layers

The component may look parallel while a helper hides a sequence:

```ts
async function getDashboard() {
  const user = await getUser()
  const org = await getOrg(user.orgId)
  const plan = await getPlan(org.planId)
  const limits = await getLimits(plan.id)
  return { user, org, plan, limits }
}
```

Instrument the entire dependency chain, not only React components.

## Streaming changes the question

Without streaming, you may ask:

> How fast can every dependency finish?

With Suspense boundaries, you can also ask:

> Which dependencies must finish before useful UI appears?

Phase 10 goes deeper into streaming mechanics. Phase 5 uses Suspense to separate critical and deferred data work.

## Preload relationship

Sometimes one component knows a dependency will be needed later.

You can start work earlier without immediately awaiting it.

```ts
void preloadProject(projectId)
```

The preload chapter covers this pattern and React `cache` in detail.

## Performance debugging workflow

When a route feels slow:

```text
1. capture end-to-end route time
2. list every data dependency
3. mark dependency edges
4. add durations
5. find longest chain
6. remove accidental awaits
7. reduce N+1/query fan-out
8. add streaming boundaries where product-safe
9. measure again
```

Do not begin with memoization or client migration.

## Common mistakes

### Sequential awaits for independent work

Start promises together.

### Using Promise.all as a performance ritual

If operations are dependent or overload infrastructure, parallelization is wrong.

### N+1 queries hidden inside Promise.all

Fix the query/data model instead of only increasing concurrency.

### Making optional data block the main page

Consider independent Suspense/error handling.

### Moving slow server reads to the browser

That often changes *where* the user waits, not the underlying latency.

## Interview questions

**What is a data waterfall?**  
A sequence where later data work waits for earlier work, whether because of a real dependency or accidental code structure.

**How do you decide what to parallelize?**  
Draw the dependency graph. Operations that depend on the same already-known inputs can often start together; dependent operations must preserve ordering.

**Why can Promise.all still be a bad design?**  
It can create excessive fan-out, overwhelm pools/rate limits, or hide an N+1 access pattern.

**How does Suspense affect waterfall design?**  
It lets independent slow subtrees resolve and stream separately so not every dependency must block the same visible UI.

## Exercise

Given a dashboard with:

```text
session        80 ms
profile       120 ms
projects      250 ms
billing       500 ms
notifications 180 ms
```

Design:

- dependency graph
- which calls start immediately
- which depend on session/org identity
- which content blocks the main shell
- which content can stream
- where batching could reduce query count
- what metrics you would capture before/after
