---
title: Server Actions vs Route Handlers & BFF Architecture
description: Choose between direct server data access, Server Actions, Route Handlers, upstream services, and Backend-for-Frontend patterns without creating redundant HTTP layers.
---

# Server Actions vs Route Handlers & BFF Architecture

Next.js gives you several ways to execute server-side code.

The difficult part is not knowing that they exist.

It is choosing the correct boundary.

A useful map:

```text
Server Component
→ server-owned read/render

Server Action
→ frontend-owned mutation/action

Route Handler
→ explicit HTTP endpoint

external backend/service
→ independent service boundary
```

Do not turn every function into every layer.

## The first question: who is the consumer?

Before creating an endpoint, ask:

```text
Who needs to call this capability?
```

If the only consumer is a Server Component in the same application:

```text
Server Component
→ database/service function
```

is usually better than:

```text
Server Component
→ own Route Handler
→ database/service function
```

## Why avoid internal HTTP hops?

Calling your own Route Handler from server-rendered code adds:

- serialization
- HTTP parsing
- URL construction
- network/runtime boundary
- duplicate auth possibilities
- harder tracing
- build-time failure risk for prerendered code

A Server Component can call the server data layer directly.

## Build-time problem

During prerender/build, there may be no running application server available at your public URL.

So this architecture is fragile:

```ts
await fetch('https://my-own-app.example.com/api/products')
```

inside code that the build needs to execute.

Prefer a shared server module:

```ts
const products = await getProducts()
```

## Server Action for frontend mutation

Example:

```ts
'use server'

export async function renameProject(formData: FormData) {
  // validate
  // authorize
  // mutate
  // revalidate
}
```

Good when:

- mutation is initiated by your React UI
- forms/action state matter
- progressive enhancement is useful
- you do not need a public REST-style contract

## Route Handler for HTTP consumers

Example:

```ts
export async function PATCH(request: Request) {
  // validate HTTP payload
  // authenticate API caller
  // authorize
  // mutate
  // return JSON
}
```

Good when callers include:

- mobile apps
- third parties
- browser `fetch`
- webhooks
- scripts
- OAuth/payment callbacks
- external services

## Share domain logic, not transport code

Avoid duplicating mutation logic:

```text
Server Action
→ project mutation implementation A

Route Handler
→ project mutation implementation B
```

Prefer:

```text
Server Action ─┐
               ├→ domain service / application command
Route Handler ─┘
```

Example:

```ts
// server/projects/rename-project.ts
import 'server-only'

export async function renameProjectCommand(input: {
  actorId: string
  projectId: string
  name: string
}) {
  // authorization
  // transaction
  // mutation
  return result
}
```

Then transports adapt input/output separately.

## Transport-specific concerns stay at the edge

Route Handler owns:

```text
HTTP method
headers
status codes
JSON/schema version
CORS
API authentication
idempotency header
```

Server Action owns:

```text
FormData/action arguments
useActionState-compatible result
redirect/revalidation UX
React mutation workflow
```

Domain service owns:

```text
business invariant
authorization rule
transaction
state transition
side-effect coordination
```

This separation reduces drift.

## BFF mental model

Backend for Frontend means the Next.js server layer adapts backend capabilities for the frontend.

Example:

```text
browser
  ↓
Next.js BFF Route Handler
  ├→ identity service
  ├→ billing service
  └→ catalog service
  ↓
frontend-shaped response
```

A BFF can:

- hide internal service topology
- aggregate multiple upstreams
- convert auth/session models
- transform payload shapes
- enforce frontend-specific policies
- reduce browser round trips

## BFF is not automatically good

A BFF can also become:

```text
one giant server layer
with every business rule
and every integration
```

That creates:

- duplicated backend logic
- tight coupling to deployment
- oversized Next.js runtime responsibility
- harder independent scaling
- mixed ownership

Keep durable domain logic in the appropriate system of record.

## Thin adapter vs domain backend

Thin BFF:

```text
validate frontend request
resolve identity
call service
shape response
```

Domain backend:

```text
orders
payments
inventory
accounting
workflow state
```

For complex systems, Next.js should not become the only place those durable rules exist unless that is an intentional monolithic architecture.

## Proxying an upstream

A Route Handler can forward requests:

```ts
export async function POST(request: Request) {
  const input = await request.json()
  const upstream = await fetch(process.env.BACKEND_URL + '/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await getServiceToken()}`,
    },
    body: JSON.stringify(input),
  })

  // map upstream response deliberately
}
```

Do not simply forward all incoming headers/body without validation.

## Avoid accidental open proxy

Dangerous:

```text
/api/proxy?url=https://anything.example
```

This can create:

- SSRF
- credential forwarding
- bandwidth abuse
- access to internal services

Use fixed upstreams or explicit allow-lists.

## API versioning

If external clients depend on your Route Handlers, compatibility becomes a product concern.

Options:

```text
/api/v1/projects
Accept header versioning
versioned media types
stable additive contract
```

Do not break public/mobile integrations every time the React UI changes.

Server Actions are more tightly coupled to the application deployment and are not a general public API versioning mechanism.

## Browser client fetch vs Server Action

Client `fetch('/api/...')` is useful when:

- the browser needs an explicit remote-state lifecycle
- polling is required
- a shared HTTP API serves multiple clients
- request/response semantics are important

Server Actions are useful when:

- React form/action integration is the primary interaction
- the operation is a mutation
- a separate public API contract adds no value

## Reads from the browser

For initial page data:

```text
Server Component direct read
```

is usually preferred.

For live browser-owned data:

```text
Client Component
→ Route Handler/external API
```

can be appropriate.

Phase 5 covers server vs client data ownership.

## Server Actions are not data-fetch RPC

Server Actions are mutation/action primitives and are queued in client usage.

Using them as a generic read RPC layer can introduce sequential execution and bypass established client data-cache patterns.

Use Server Components, client data libraries, or Route Handlers according to ownership.

## Route Handler vs external backend

Use a Next.js Route Handler when:

- endpoint belongs closely to frontend product boundary
- deployment/runtime constraints fit
- scale/latency profile fits
- no independent service lifecycle is needed

Use a separate backend/service when:

- many independent clients consume it
- long-running workers dominate
- WebSocket/realtime infrastructure is central
- independent scaling/deployment is needed
- domain team ownership is separate
- runtime/language needs differ
- regulatory isolation demands it

## Shared schemas

If multiple transports expose the same command:

```text
shared domain input schema
```

can be useful.

But do not force the HTTP response shape and React action-state shape to be identical.

Example:

```text
domain error
  ↓
Server Action adapter → field/message state
  ↓
Route Handler adapter → HTTP status + API error code
```

## Error mapping

Domain:

```text
ProjectNameConflict
```

Server Action:

```ts
return {
  status: 'error',
  code: 'NAME_CONFLICT',
  message: 'That name is already used.',
}
```

Route Handler:

```ts
return Response.json(
  { error: 'NAME_CONFLICT' },
  { status: 409 },
)
```

Same business rule, different transport representation.

## Auth model can differ by transport

Server Action:

```text
browser session cookie
```

Public API:

```text
bearer token / API key / OAuth
```

Webhook:

```text
provider signature
```

Do not force all callers into one auth mechanism merely to share code.

## Observability at the boundary

Route Handler metrics should include:

```text
method
route template
status
latency
request ID
upstream latency
rate-limit outcome
```

Avoid using raw dynamic URLs as metric labels:

```text
/api/projects/123
/api/projects/456
```

Prefer route templates to control cardinality:

```text
/api/projects/[id]
```

## Common mistakes

### Route Handler for every DB function

Creates unnecessary HTTP layering.

### Duplicating business logic between action/API

Extract domain commands/services.

### Using Server Actions as public API endpoints

They are app mutation primitives, not general externally versioned HTTP APIs.

### Making BFF own every durable domain rule

Keep system-of-record logic where it belongs.

### Building arbitrary proxy endpoints

Creates SSRF and abuse risk.

## Decision table

| Need | Preferred starting point |
| --- | --- |
| Server-rendered initial data | Server Component direct source |
| React form mutation | Server Action |
| Browser polling/live HTTP | Route Handler or external API |
| Mobile/public API | Route Handler or dedicated backend |
| Webhook | Route Handler |
| OAuth callback | Route Handler |
| Long-running job | queue/worker + HTTP status endpoint |
| Large file transfer | object storage/CDN |
| Shared durable business domain | domain service/module |

## Debugging architecture smell

If a feature path looks like:

```text
Server Component
→ Route Handler
→ Server Action
→ Route Handler
→ database
```

stop.

Draw the ownership model and remove redundant transport boundaries.

## Interview questions

**When should a Server Component call your own Route Handler?**  
Rarely. Same-app server code should normally call the data/domain layer directly.

**When is a Route Handler preferable to a Server Action?**  
When you need an explicit HTTP contract callable by browsers, mobile apps, third parties, webhooks, or scripts.

**What is a BFF?**  
A backend layer shaped around frontend needs that can aggregate/transform services and adapt authentication, while ideally avoiding duplication of durable domain logic.

**Can Server Actions and Route Handlers share logic?**  
Yes. They should often share server-only domain commands/services while keeping transport-specific validation/output mapping at each boundary.

## Exercise

For a SaaS product, classify:

```text
initial dashboard query
rename workspace form
mobile app project API
Stripe webhook
CSV export
live notification polling
OAuth callback
nightly billing reconciliation
```

Choose:

```text
Server Component
Server Action
Route Handler
external service
queue/worker
object storage
```

Then draw the shared domain modules and transport adapters.