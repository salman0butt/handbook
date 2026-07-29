---
title: Prerendering, Static Shells, Cache Components & Runtime Work
sidebar_position: 4
description: Understand how Next.js 16 decides what can prerender, what belongs in the static shell, what must run at request time, and how Cache Components connect server caching with client navigation.
---

# Prerendering, Static Shells, Cache Components & Runtime Work

Older Next.js mental models often classified an entire route as either:

```text
static
or
dynamic
```

That model is too coarse for modern App Router applications using Cache Components.

A better model is:

```text
route tree
├─ work that can finish during prerender
├─ cached work reusable across requests
└─ request-time work deferred behind Suspense
```

The result can be one route containing all three.

## 1. Prerendering is execution before a request exists

During prerendering, Next.js renders the route tree in an environment with no real incoming user request.

The framework can include work in the static shell when that work can complete safely before request time.

This can happen during:

```text
build
revalidation/regeneration
other framework-controlled prerender phases
```

## 2. Static shell means HTML plus RSC state

With Cache Components, the prerendered shell is not only HTML.

Conceptually it includes:

```text
HTML for initial document load
+
serialized RSC payload for navigation/tree reconstruction
```

This lets the same prerendered route structure support both direct document loads and client transitions.

## 3. Static does not mean “source contains no async”

An async component can still be prerenderable.

Example:

```tsx
export default async function Page() {
  const data = await getBuildSafeData()
  return <h1>{data.title}</h1>
}
```

The question is not whether the function is async.

The question is whether the work is valid and available during prerendering.

## 4. Uncached external work is not automatically executed into the shell

Current Cache Components behavior requires explicit intent around dynamic work.

If Next.js encounters uncached async external work during prerendering, you generally choose:

```text
cache it
or
defer it behind Suspense
```

This is deliberate.

It prevents accidental “sometimes static” behavior from hidden network/database dependencies.

## 5. Suspense marks request-time deferral

Suppose:

```tsx
<Suspense fallback={<Skeleton />}>
  <LiveInventory />
</Suspense>
```

and `LiveInventory` requires fresh request-time external data.

Prerender mental model:

```text
render page
→ reach LiveInventory
→ work cannot complete during prerender
→ stop that subtree
→ include Skeleton in static shell
→ defer LiveInventory to request time
```

The fallback becomes part of the shell.

## 6. Suspense boundary placement controls shell size

Boundary high in tree:

```text
small static shell
large dynamic region
```

Boundary close to dynamic leaf:

```text
large static shell
small dynamic region
```

Therefore Suspense placement directly affects:

```text
TTFB/FCP
prefetch usefulness
streaming granularity
failure isolation
visual loading states
```

## 7. `loading.tsx` is route-level Suspense architecture

A `loading.tsx` file automatically creates a Suspense boundary around page content for that route segment.

This matters both for:

```text
server streaming
and
client prefetch/navigation
```

Its fallback can be prefetched and displayed before the dynamic page finishes.

## 8. `use cache` marks reusable work

A function/component/file with:

```ts
'use cache'
```

tells Next.js that its return value may be cached according to the Cache Components model.

This allows work that would otherwise require asynchronous execution to participate in prerendered output when inputs are known.

## 9. Cache keys derive from inputs and closure context

For a cached function/component, relevant serialized inputs and closed-over values contribute to cache identity.

Conceptually:

```text
function identity
+
arguments/props
+
relevant closure inputs
→ cache key
```

You should reason about cache identity from **semantic inputs**, not try to reproduce the private generated key.

## 10. Runtime request APIs cannot simply disappear into ordinary public cache

Values from APIs such as:

```text
cookies()
headers()
searchParams/request context
```

vary by request.

Ordinary `use cache` scopes cannot directly read request-specific APIs.

Preferred design:

```text
request-time component
→ read cookie/header
→ extract minimal value
→ pass value to cached function
```

Then the extracted value becomes part of cache identity.

## 11. Cache identity is a security concern

If cached content varies by:

```text
tenant
user role
locale
plan
feature entitlement
```

then those dimensions must be reflected in the safe cache/query contract.

Otherwise:

```text
request A populates cache
request B reuses entry
→ cross-user or cross-tenant data leak
```

Caching is part of authorization architecture.

## 12. `use cache: private` has a different contract

Current Cache Components also exposes `'use cache: private'` for cases requiring request-specific APIs inside a private cache scope.

Treat it as a specialized cache mode with stricter semantics.

Do not generalize ordinary public cache assumptions onto private personalized entries.

## 13. `use cache: remote` changes storage, not semantic ownership

`'use cache: remote'` can store cached output in a remotely backed handler instead of process memory.

The semantic questions remain:

```text
what is the key?
what is the lifetime?
who may read the value?
what invalidates it?
```

Remote storage solves durability/shared-instance concerns, not bad cache identity.

## 14. `cacheLife` has multiple clocks

A cache profile can define conceptual windows such as:

```text
stale
revalidate
expire
```

Do not collapse them into “TTL.”

A mature cache can allow stale reuse while background regeneration occurs before full expiration.

The user-visible freshness contract depends on these different clocks.

## 15. `stale` connects server cache semantics to client navigation

Current `cacheLife` behavior sends stale-time information to the client router.

The client can use that to decide whether a prefetched route payload is still reusable.

This is an important internals bridge:

```text
server cache policy
→ response metadata
→ Router Cache freshness decision
```

You do not need to depend on the exact response header in application code.

## 16. The Router Cache is not the server cache

A server entry can be fresh while the browser still holds a prefetched route payload.

Or the browser cache can expire while the server cache still has reusable output.

Always distinguish:

```text
server Cache Components entry
vs
client Router Cache entry
```

## 17. Revalidation APIs target different identities

Examples:

```text
revalidateTag
→ stale tagged cached data

updateTag
→ expire tagged cached data immediately

revalidatePath
→ path/layout-oriented invalidation

refresh
→ refresh current client router from Server Action
```

They are not aliases.

Use the invalidation primitive that matches the data identity.

## 18. Mutation revalidation can clear client navigation state broadly

Current Next.js behavior notes that revalidation from Server Functions can cause broader client cache refresh behavior than the eventual intended path-specific model.

That behavior is version-sensitive.

Design principle:

> Depend on freshness guarantees, not private details of which in-memory client map entry gets deleted.

## 19. Request-time work begins where prerendering cannot continue

With a dynamic subtree:

```text
build/prerender
→ shell + fallback

request arrives
→ request context available
→ deferred subtree executes
→ result streams
```

This is the essential PPR/Cache Components execution split.

## 20. Prerendering can stop at an async boundary before starting the work

Current Cache Components documentation emphasizes that when prerendering encounters external async work that must be deferred, that request may not start during prerender.

That matters for performance reasoning.

Do not assume:

```text
build started request
→ request continues until user arrives
```

The request-time subtree is separate work.

## 21. Cached work can be included in shell

If work is wrapped in a cache scope with inputs known before request time:

```text
prerender
→ execute cached function
→ store result
→ include rendered result in static shell
```

Later requests may reuse the same cache entry until freshness rules require regeneration.

## 22. Non-determinism requires ownership

Operations like:

```text
Date.now()
Math.random()
crypto.randomUUID()
```

can produce stable-for-cache or per-request values depending on where they execute.

Inside a cached scope, their result can become part of cached output.

For per-request randomness/time, execute only after entering request-time/dynamic work.

## 23. A timestamp can reveal the lifecycle

A simple diagnostic:

```tsx
<p>{Date.now()}</p>
```

may help reveal whether output was produced:

```text
once at build/prerender
once per cache regeneration
or per request
```

Use diagnostics carefully and remove them after investigation.

## 24. `connection()` creates an explicit request-time boundary

When you need to defer to request time without otherwise reading a request API, `connection()` signals that following work needs a real request connection.

Mental model:

```text
prerender reaches connection()
→ cannot continue before request
→ subtree belongs to request-time execution
```

It is a rendering/lifecycle signal, not a database connection function.

## 25. Runtime APIs imply request ownership

APIs such as:

```text
cookies()
headers()
```

require request context.

If a subtree uses them, it cannot be fully rendered before a request exists unless a specialized framework model handles that data.

This is why request context often defines the dynamic hole in a static shell.

## 26. Metadata participates in route rendering analysis

`generateMetadata` and `generateViewport` are not detached afterthoughts.

Their data/runtime requirements participate in prerender analysis.

A route can become constrained by dynamic metadata work even if page UI looks static.

Debug route behavior across both UI and metadata code.

## 27. GET Route Handlers can participate in Cache Components prerender model

With Cache Components enabled, GET Route Handlers use the modern prerender/caching model too.

That means “Route Handler” does not automatically imply uncached request-time execution.

Inspect the handler's actual data/runtime behavior and cache contract.

## 28. POST/other mutation handlers remain request-time operations

A mutation endpoint exists to process an incoming request.

Its side effects cannot be meaningfully “prerendered.”

Keep this distinction clear when discussing route-level caching.

## 29. Cache Components requires Node.js runtime

Current Next.js documentation states Cache Components does not support the Edge runtime.

This is not only a deployment footnote.

It means the modern cache/prerender execution model is tied to Node.js runtime capabilities in the stable contract.

## 30. Previous route-segment cache configuration is a separate model

When Cache Components is disabled, older route-segment controls still exist:

```text
dynamic
revalidate
fetchCache
```

When Cache Components is enabled, those controls are disabled/replaced by the newer cache model.

Do not mix mental models in one explanation.

## 31. Migration knowledge should not pollute current internals

You may see older articles describing:

```text
force-static
force-dynamic
PPR experimental flags
dynamicIO
```

For current Next.js 16 Cache Components, use the stable documented model:

```text
prerender
Suspense
use cache
cacheLife
request APIs
connection()
```

Treat old flags as migration history.

## 32. A cache hit can avoid server work but not necessarily browser work

Suppose a cached Server Component result is reused.

The browser may still need to:

```text
receive RSC payload
reconcile tree
load client chunks
hydrate/interact
```

Server cache hit does not imply zero end-user cost.

Measure the whole path.

## 33. A static shell can still contain interactive Client Components

The shell may prerender Client Component HTML.

Then the browser hydrates those components.

Static shell does not mean:

```text
no JavaScript
```

It means the render output can be known before request time.

## 34. Dynamic holes can contain Client Components too

A request-time Server Component subtree may render Client Components.

Those client references/chunks arrive as part of the streamed RSC result.

Environment boundary and prerender boundary are independent dimensions.

## 35. Think in a 2D matrix

Useful matrix:

| Dimension | Option A | Option B |
| --- | --- | --- |
| execution environment | server | client |
| render timing | prerender | request/navigation |
| data reuse | cached | uncached |
| delivery | shell | stream/later payload |

A component can be:

```text
Client Component + prerendered HTML + cached surrounding server data
```

or:

```text
Server Component + request-time + uncached + streamed
```

Do not compress these dimensions into “SSR vs CSR.”

## 36. Cache misses are part of user latency

A cache architecture must budget both:

```text
hit path
and
miss/regeneration path
```

If miss work takes five seconds and 1,000 requests can hit it simultaneously, a fast cache hit path does not make the system resilient.

Phase 15 covered stampede performance; this phase explains why cache execution belongs in the rendering graph.

## 37. Multi-instance cache consistency is a runtime implementation concern

If replicas use only process-local cache:

```text
pod A entry fresh
pod B entry missing
pod C entry stale
```

then user-visible behavior can differ by replica.

Remote/shared handlers exist to make persistence and invalidation topology explicit.

Do not assume framework-level semantic caching means globally shared storage.

## 38. Revalidation is a state transition

Think of a cache entry as moving through states:

```text
fresh
→ stale/revalidating
→ refreshed
or
expired/missing
→ recompute
```

The exact implementation may vary.

The stable mental model is state transition around freshness, not “delete file from disk.”

## 39. Cache tags create semantic dependency edges

When a cached result is tagged:

```text
post:42
posts-list
```

then mutations can invalidate semantic consumers without knowing every route that used the data.

Conceptually:

```text
cached result
→ tag dependency
→ mutation invalidates tag
→ dependent entry transitions freshness state
```

Tags are data identity, not route identity.

## 40. Path invalidation creates route-tree dependency edges

`revalidatePath` targets pages/layouts by route identity.

A layout invalidation can affect nested pages because layout ownership spans that subtree.

This maps directly to the App Router route tree.

## 41. Debugging “why didn't this prerender?”

Use this sequence:

```text
1. run production build
2. inspect route summary
3. identify first request-time/runtime data access
4. inspect uncached async work
5. inspect Suspense placement
6. inspect metadata/viewport
7. inspect cache scope and inputs
8. verify Cache Components enabled
```

Do not start by adding broad `force-static` migration-era configuration.

## 42. Debugging “why is stale data still visible?”

Name each state layer:

```text
source DB/API
server cache
remote cache
CDN
Router Cache
browser local state
```

Then find the first layer that contains the stale value.

A successful DB update proves only the source changed.

## 43. Debugging “why did this rerender on every request?”

Possible reasons:

```text
no cache scope
cache key changes each request
runtime/request value included in key
cache entry expired
remote handler unavailable
mutation invalidated it
request-time subtree intentionally uncached
```

Measure cache hit/miss evidence rather than guessing.

## 44. Debugging “why is cached data leaking?”

Treat as security incident.

Investigate:

```text
cache key missing tenant/user dimension
DTO too broad
authorization outside cached query
public CDN caching personalized output
private/public cache mode misuse
```

Do not fix only by shortening TTL.

## 45. Senior route execution model

For any route, draw:

```text
RootLayout [prerender]
└─ DashboardLayout [prerender]
   ├─ Nav [cached]
   └─ Suspense fallback [shell]
      └─ AccountPanel [request-time]
         └─ ChartIsland [Client Component]
```

Then annotate:

```text
cache keys
runtime APIs
invalidation tags
client boundaries
stream timing
```

That model is more useful than saying “dashboard is dynamic.”

## Production checklist

- [ ] Cache Components model is not mixed with obsolete PPR flags
- [ ] Suspense boundaries align with request-time work and UX
- [ ] cached functions have explicit semantic identity
- [ ] tenant/user dimensions cannot be lost from cache keys
- [ ] runtime request APIs are outside ordinary public cache scopes
- [ ] per-request randomness/time executes after request-time boundary
- [ ] metadata/viewport data access is included in prerender reasoning
- [ ] Router Cache freshness is distinguished from server cache freshness
- [ ] cache hit and miss paths are measured separately
- [ ] revalidation uses data tags or route paths intentionally
- [ ] multi-instance storage/invalidation topology is documented

## Interview questions

### What does “static” mean with Cache Components?

It means work can be prerendered into the static shell before a request arrives. A single route may still contain request-time Suspense holes and cached async content, so the old whole-page static/dynamic binary is insufficient.

### Why can `cacheLife.stale` affect client navigation?

Because the server's cache profile communicates a freshness window that the client Router Cache can use when deciding whether prefetched RSC data is still reusable.

### Why is Suspense part of caching/rendering architecture?

Because it marks where prerendered output can stop and where request-time work can stream later, affecting shell size, prefetching, latency, and failure isolation.
