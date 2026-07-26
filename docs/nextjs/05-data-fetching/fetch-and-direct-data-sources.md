---
title: Server fetch & Direct Data Sources
description: Use server fetch deliberately, compare it with direct database and SDK access, and keep current Next.js cache semantics separate from fetching ownership.
---

# Server `fetch` & Direct Data Sources

Next.js does not have one universal data-access API.

A Server Component can read data through whichever server-side interface matches the source:

```text
external HTTP API → fetch
PostgreSQL/MySQL  → database client / ORM
GraphQL service   → GraphQL client or fetch
vendor SDK        → server SDK
internal module   → direct function call
```

The important decision is not “should every read use `fetch`?”

It is:

> **What is the real boundary and what semantics do we need?**

## Server `fetch`

Next.js extends the Web `fetch()` API on the server with framework caching and revalidation options.

Basic example:

```tsx
export default async function ProductsPage() {
  const response = await fetch('https://api.example.com/products')

  if (!response.ok) {
    throw new Error('Failed to load products')
  }

  const products = await response.json()

  return <ProductList products={products} />
}
```

Always treat HTTP status handling as part of the contract.

`fetch()` does not throw merely because the server returned a 404 or 500.

```ts
if (!response.ok) {
  throw new Error(`Upstream failed: ${response.status}`)
}
```

## Current caching caution

Do not import old Next.js 13/14 rules from memory.

Current Next.js has explicit server `fetch` cache/revalidation controls, and those controls are version-sensitive.

Phase 6 covers them in depth.

For Phase 5, keep these concepts separate:

```text
fetching
  = obtaining data

request/render memoisation
  = avoid duplicate work in a render/request scope

persistent data cache
  = reuse across requests/builds according to framework policy

route output caching
  = reuse rendered route work/output
```

They are not synonyms.

## Do not assume “server fetch = forever cached”

This is an outdated mental model.

When data freshness matters, make the policy explicit and verify the current framework behavior.

Phase 6 will cover:

- `cache`
- `next.revalidate`
- tags
- Cache Components
- route rendering implications
- revalidation APIs

## HTTP data source wrapper

Instead of scattering raw fetch logic through components:

```ts
import 'server-only'

export async function getProducts() {
  const response = await fetch(`${process.env.CATALOGUE_URL}/products`, {
    headers: {
      Authorization: `Bearer ${process.env.CATALOGUE_TOKEN}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Catalogue failed with ${response.status}`)
  }

  return response.json() as Promise<Product[]>
}
```

Benefits:

- central status handling
- secret ownership
- typed/validated response boundary
- observability hook point
- easier cache-policy review later
- easier testing

## Validate external responses

TypeScript assertions do not validate runtime data.

This:

```ts
return response.json() as Promise<Product[]>
```

does not prove the server sent valid products.

For unreliable or public integrations, validate the payload:

```ts
const json = await response.json()
return ProductListSchema.parse(json)
```

Especially important when data affects:

- money
- permissions
- identifiers
- inventory
- workflow state

## Direct database/ORM access

For data owned by the same application:

```ts
import 'server-only'

export async function listProjects(organisationId: string) {
  return db.project.findMany({
    where: { organisationId },
    select: {
      id: true,
      name: true,
      status: true,
    },
  })
}
```

This avoids converting a database call into HTTP just for architectural symmetry.

## Direct service SDK access

A vendor might provide a Node/server SDK:

```ts
import 'server-only'
import { BillingClient } from '@vendor/billing'

const billing = new BillingClient({
  apiKey: process.env.BILLING_SECRET!,
})

export async function getSubscription(customerId: string) {
  return billing.subscriptions.get(customerId)
}
```

Do not import this SDK into a Client Component if it includes credentials or Node-only code.

## Client-safe DTO boundary

Even when the source is server-only, the output may eventually cross to a Client Component.

Server model:

```ts
type CustomerRecord = {
  id: string
  email: string
  billingProviderId: string
  internalRiskScore: number
  displayName: string
}
```

Client DTO:

```ts
type CustomerSummary = {
  id: string
  displayName: string
}
```

Transform before crossing the boundary.

## Do not expose upstream secrets to the browser

Bad:

```tsx
'use client'

fetch('https://vendor.example.com/private', {
  headers: {
    Authorization: process.env.NEXT_PUBLIC_VENDOR_TOKEN,
  },
})
```

A `NEXT_PUBLIC_` value is intentionally browser-visible.

If the credential is secret, keep the request on the server.

## Timeouts and cancellation

External APIs can hang or degrade.

Design server calls with a timeout strategy appropriate to the service.

Example with an abort signal:

```ts
const controller = new AbortController()
const timer = setTimeout(() => controller.abort(), 5_000)

try {
  const response = await fetch(url, {
    signal: controller.signal,
  })
  // ...
} finally {
  clearTimeout(timer)
}
```

Do not blindly copy a five-second timeout; choose it from the product/SLO contract.

## Retries require judgement

A retry may help a transient read.

A retry can also:

- amplify an outage
- increase latency
- violate an upstream rate limit
- duplicate non-idempotent work

For GET-like safe reads, bounded retries with backoff may be reasonable.

For mutations, idempotency and API semantics matter more. Phase 7 covers mutation reliability.

## Fan-out risk

One page can accidentally call many services:

```text
page
├── profile service
├── permissions service
├── billing service
├── analytics service
├── recommendations service
└── feature flag service
```

Even if each call is “fast,” tail latency can make the route slow or unreliable.

Questions to ask:

- Which calls are required to render?
- Which are independent?
- Which can stream later?
- Which can be cached?
- Which should be precomputed?
- Which should not be part of the critical path?

## BFF decision

Sometimes an HTTP boundary is valid because the Next.js app is acting as a backend-for-frontend.

Example:

```text
Next.js server
  ↓
service A + service B + service C
  ↓
UI-specific aggregation
```

That does **not** mean you need a Route Handler between your Server Component and those server modules.

The BFF can be the server-side application layer itself.

## Data transformations

Prefer server-side transformation for server-owned data:

```ts
const orders = await db.order.findMany(...)

const summaries = orders.map(order => ({
  id: order.id,
  total: formatMoney(order.total),
  status: mapStatus(order.status),
}))
```

But distinguish display formatting from domain logic.

Critical financial calculations should use authoritative domain rules, not ad hoc UI helpers.

## Error mapping

For external HTTP:

```text
401/403 upstream
404 resource
429 rate limit
5xx outage
network timeout
invalid JSON/schema
```

Do not collapse these into one “fetch failed” branch if operations need to distinguish them.

A data-access layer is a useful place to normalize upstream-specific errors into application errors.

## Observability

Wrap important calls with structured timing:

```text
source=catalogue
operation=list_products
duration_ms=84
status=success
```

Avoid logging:

- access tokens
- cookies
- authorization headers
- full sensitive responses

Later observability phases go deeper, but data boundaries are where useful spans/logs often begin.

## Common mistakes

### Treating `fetch` as mandatory for databases

Use the database client directly on the server.

### Assuming a successful network request means valid application data

Validate untrusted responses.

### Ignoring `response.ok`

HTTP 500 still resolves a `fetch` promise.

### Putting secrets in `NEXT_PUBLIC_`

That exposes them to the browser.

### Adding retries without idempotency/rate-limit thinking

Retries are a reliability tool, not a default wrapper.

### Mixing cache policy into every component

Centralize data access enough that freshness decisions can be reviewed consistently.

## Debugging checklist

1. Identify whether the source is HTTP, database, SDK, or local module.
2. Verify secrets stay server-only.
3. Check HTTP status handling.
4. Validate external payloads where needed.
5. Measure upstream/database latency.
6. Check timeouts and retry policy.
7. Look for unnecessary internal Route Handler hops.
8. Inspect data selection and DTO size.
9. Separate fetching from persistent caching assumptions.
10. Revisit the critical path when one page fans out to many services.

## Interview questions

**How is server `fetch` different in Next.js?**  
Next.js extends server-side fetch with framework caching/revalidation controls. Browser fetch semantics and server Data Cache semantics should not be conflated.

**When should you use an ORM directly instead of `fetch`?**  
When the data source is the application’s own database and the code already executes on the server; an HTTP layer is not inherently required.

**Why check `response.ok`?**  
`fetch` normally resolves for HTTP error statuses; application code must decide how to handle 4xx/5xx responses.

**What does `NEXT_PUBLIC_` mean for security?**  
The value is intended to be available to browser code and must not contain secrets.

## Exercise

Design a product page that needs:

- product data from PostgreSQL
- inventory from an external HTTP API
- recommendations from another service
- a browser-only wishlist toggle

For each dependency document:

```text
execution environment
data-access interface
credential ownership
timeout policy
failure behavior
critical vs streamable
client DTO shape
cache/freshness question for Phase 6
```