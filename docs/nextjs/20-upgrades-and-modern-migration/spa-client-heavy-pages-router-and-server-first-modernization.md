---
title: SPA, Client-Heavy, Pages Router & Server-First Modernization
sidebar_position: 6
description: Modernize legacy React and Next.js applications incrementally toward App Router server-first architecture without rewriting everything at once.
---

# SPA, Client-Heavy, Pages Router & Server-First Modernization

A migration from a client-heavy React application or an older Next.js architecture should preserve product behavior while changing ownership gradually.

The safest mental model is:

```text
compatibility first
→ route ownership
→ server data ownership
→ mutation ownership
→ resource optimization
→ remove legacy compatibility
```

This handbook remains App Router-only. Pages Router appears here only as migration context.

## 1. Do not start with a rewrite

Large rewrites create too many simultaneous unknowns:

```text
routing
rendering
data fetching
auth
state
styles
analytics
tests
deployment
```

Prefer a strangler-style migration where old behavior remains usable while new App Router slices become authoritative.

## 2. Inventory legacy assumptions

Common client-heavy patterns include:

```text
React Router owns all URL state
useEffect fetches canonical server data
browser token storage
client-side authorization checks
large root providers
global state duplicates server truth
manual document metadata
manual image/font/script loading
```

Classify each as:

```text
keep client-owned
move server-owned
replace with framework capability
retire
```

## 3. Preserve behavior before optimizing architecture

If migrating from a SPA, it is acceptable to keep a large Client Component initially.

Then move boundaries inward deliberately.

```text
Phase A: App Router shell + existing client app
Phase B: route-by-route URL ownership
Phase C: server reads
Phase D: Server Actions/Handlers
Phase E: cache/streaming/resource optimization
```

This keeps the migration deployable.

## 4. Move routing first

Map legacy routes to App Router segments.

Create a route inventory:

| Legacy route | New route | Dynamic params | Auth | Data owner |
| --- | --- | --- | --- | --- |
| `/projects/:id` | `/projects/[id]` | `id` | user | project DAL |
| `/settings` | `/settings` | none | user | account DAL |

Preserve canonical URLs unless a product decision says otherwise.

## 5. URL state should remain URL state

Do not move filters, pagination, search, or tabs into global client state just because the old SPA did.

Modern App Router can treat URL state as the shareable source of truth.

Test:

```text
copy/paste URL
back/forward
refresh
server render
client navigation
```

## 6. Move canonical reads server-side gradually

Legacy:

```tsx
'use client'
useEffect(() => {
  fetch('/api/projects').then(...)
}, [])
```

Modern default:

```tsx
export default async function Page() {
  const projects = await getProjectsForViewer()
  return <ProjectList projects={projects} />
}
```

Avoid replacing one internal call with an HTTP hop from a Server Component to your own Route Handler.

## 7. Keep browser-owned behavior client-side

Good Client Component responsibilities include:

```text
DOM events
browser APIs
local draft state
optimistic interaction
focus management
canvas/maps/editors
```

The goal is not “zero Client Components.” The goal is correct ownership.

## 8. Decompose root providers

Legacy SPAs often put everything under one provider tree.

Classify state:

```text
server truth
URL state
local UI state
cross-route client state
third-party provider context
```

Keep providers as narrow/deep as practical.

## 9. Auth migration

Do not preserve browser-only token checks as authorization.

Target model:

```text
session verification on server
→ secure DAL/command authorization
→ minimal client-visible session DTO
```

Proxy can perform optimistic gating but is not the secure authorization boundary.

## 10. Mutation migration

Legacy SPA:

```text
client → REST endpoint → mutation → refetch
```

App Router options:

```text
form/UI-specific mutation → Server Action
public/mobile/external HTTP contract → Route Handler
background consequence → durable job/event
```

Keep business commands reusable underneath those adapters.

## 11. Do not migrate every endpoint into a Server Action

Route Handlers remain correct for:

```text
webhooks
public APIs
mobile clients
file downloads
third-party callbacks
HTTP integrations
```

Migration should improve boundary ownership, not erase HTTP where HTTP is the product contract.

## 12. Loading migration

Replace giant global spinners with route/feature-aligned loading states.

Use:

```text
loading.tsx
Suspense
streaming
feature-local skeletons
```

Preserve accessibility and avoid layout shift.

## 13. Error migration

Map old error state into:

```text
expected domain errors → returned state/UI
uncaught render errors → error.tsx
not found → notFound()
redirect control flow → redirect/permanentRedirect
```

Do not swallow framework control-flow exceptions in generic catches.

## 14. Resource migration

Incrementally adopt:

```text
next/image
next/font
next/script
Metadata API
```

Measure before/after performance rather than assuming every replacement improves the page automatically.

## 15. Static export migration

A legacy SPA may depend on static hosting.

Current Next.js supports static export through:

```js
output: 'export'
```

but request-time server features are unavailable.

Do not choose static export merely to preserve an old deployment if the product now requires Server Actions, request-time auth, Proxy, ISR, or runtime image optimization.

## 16. Pages Router coexistence

When migrating an existing Next.js application, temporary coexistence can reduce risk.

Principles:

```text
new features prefer App Router
migrate coherent route slices
avoid duplicated canonical ownership
keep auth/session contracts compatible
remove Pages routes when ownership moves
```

Do not leave two permanent implementations of the same product route.

## 17. CSS and design-system migration

Keep the design system stable while changing rendering architecture.

Avoid coupling a framework migration to a total visual rewrite unless explicitly planned.

Shared components should be audited for:

```text
'use client' placement
browser-only dependencies
CSS ordering
portal assumptions
hydration safety
```

## 18. Analytics migration

Client-side SPA analytics often depend on router events.

In App Router, define pageview ownership deliberately around navigation state rather than copying old Pages Router event APIs.

Prevent duplicate initial-load and soft-navigation events.

## 19. SEO migration

Move document identity into Metadata APIs.

Validate:

```text
title/description
canonical URL
Open Graph/Twitter
robots
sitemap
structured data
redirects
```

Use crawler-visible production output, not only React component tests.

## 20. Migration slices should be independently deployable

A good slice contains:

```text
route
server read path
client interactions
mutation path
tests
telemetry
```

and can ship without waiting for the whole application migration.

## 21. Compare user journeys, not source files

For every migrated route, test parity:

```text
initial load
navigation
refresh
back/forward
auth expiry
mutation success/failure
mobile layout
keyboard/focus
error states
```

## 22. Delete legacy code aggressively after cutover

After a route becomes authoritative in App Router, remove:

```text
legacy route
old API wrapper if unused
obsolete global state
compatibility redirects after planned window
old tests that assert removed behavior
```

Long-lived duplicate architecture is more expensive than migration work.

## Senior modernization sequence

```text
1. establish App Router shell
2. move one low-risk route
3. establish DAL/session/server boundary
4. migrate canonical data reads
5. migrate mutations by contract
6. add Suspense/cache where justified
7. migrate critical routes
8. remove duplicated client server-truth state
9. retire legacy router/endpoints/providers
10. re-audit security/performance/SEO
```

The best migration is one users barely notice and engineers can stop safely at every stage.