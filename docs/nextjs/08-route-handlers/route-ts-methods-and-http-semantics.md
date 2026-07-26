---
title: route.ts, HTTP Methods & Route Resolution
description: Build App Router HTTP endpoints with route.ts, supported methods, route resolution, status codes, and correct HTTP semantics.
---

# `route.ts`, HTTP Methods & Route Resolution

Route Handlers are the App Router primitive for building **public HTTP endpoints**.

They are defined with a `route.ts` or `route.js` file inside `app/`:

```text
app/
└── api/
    └── projects/
        └── route.ts
```

```ts
export async function GET() {
  return Response.json({ projects: [] })
}
```

The public URL is:

```text
GET /api/projects
```

The key architectural distinction is:

```text
page.tsx
→ renders UI

route.ts
→ owns an HTTP endpoint
```

## Route Handlers are public endpoints

A Route Handler is not a hidden server helper.

If it is reachable at:

```text
/api/projects
```

then clients can call it directly.

Potential callers include:

- your own browser UI
- mobile applications
- third-party integrations
- webhook providers
- scripts
- bots
- malicious clients

Therefore every Route Handler must assume:

```text
request data is untrusted
```

and enforce its own validation, authentication, authorization, and abuse controls where required.

## Supported methods

Route Handlers support:

```text
GET
POST
PUT
PATCH
DELETE
HEAD
OPTIONS
```

Example:

```ts
export async function GET() {
  return Response.json({ ok: true })
}

export async function POST(request: Request) {
  const payload = await request.json()
  return Response.json(payload, { status: 201 })
}
```

Unsupported methods receive:

```text
405 Method Not Allowed
```

## Automatic OPTIONS

If you do not export `OPTIONS`, Next.js can automatically implement it and derive the `Allow` header from the other methods in the Route Handler.

Example file:

```ts
export async function GET() {}
export async function POST() {}
```

Conceptually:

```text
OPTIONS /api/example
→ Allow: GET, POST, OPTIONS
```

Define `OPTIONS` yourself when you need custom preflight/CORS behaviour.

## Route resolution

Route Handlers can live at any segment inside `app/`:

```text
app/api/users/route.ts
→ /api/users

app/api/users/[id]/route.ts
→ /api/users/:id

app/rss.xml/route.ts
→ /rss.xml

app/.well-known/example/route.ts
→ /.well-known/example
```

The folder tree still defines the URL.

## `page.tsx` and `route.ts` conflict

A `page.tsx` and `route.ts` cannot own the same route segment.

Invalid:

```text
app/products/page.tsx
app/products/route.ts
```

Both would attempt to own `/products`.

Valid:

```text
app/products/page.tsx
app/api/products/route.ts
```

This creates:

```text
/products
/api/products
```

## Route Handlers do not participate in layouts

A Route Handler is not rendered inside your App Router layout tree.

```text
layout.tsx
  ↓
page.tsx
```

is UI composition.

A request to:

```text
/api/projects
```

goes directly to the Route Handler response.

That response may be:

- JSON
- text
- XML
- a file
- a stream
- a redirect
- an empty response

## Use HTTP semantics intentionally

Do not choose methods merely by habit.

A practical model:

```text
GET
→ retrieve representation

POST
→ create resource / command / non-idempotent operation

PUT
→ replace resource representation

PATCH
→ partial update

DELETE
→ delete resource

HEAD
→ headers without response body

OPTIONS
→ endpoint capabilities / CORS preflight
```

Your domain may use command-style POST endpoints, but the meaning should remain explicit.

## Status codes are part of the contract

Example creation endpoint:

```ts
export async function POST(request: Request) {
  const input = await request.json()
  const project = await createProject(input)

  return Response.json(project, { status: 201 })
}
```

Common statuses:

```text
200 OK
201 Created
202 Accepted
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Content
429 Too Many Requests
500 Internal Server Error
503 Service Unavailable
```

The exact choice depends on your API contract.

## 401 vs 403

A useful distinction:

```text
401
→ authentication is missing or invalid

403
→ identity is known but not allowed
```

Do not return `404` for every auth problem unless hiding resource existence is an intentional security policy.

## 200 vs 201

For resource creation:

```text
POST /api/projects
```

prefer:

```text
201 Created
```

when the endpoint actually creates a new resource.

Optionally include a location header:

```ts
return Response.json(project, {
  status: 201,
  headers: {
    Location: `/api/projects/${project.id}`,
  },
})
```

## 204 means no body

For a successful operation with no response representation:

```ts
return new Response(null, { status: 204 })
```

Do not return JSON with `204`.

## Resource endpoint vs command endpoint

Resource style:

```text
POST /api/orders
PATCH /api/orders/123
```

Command style:

```text
POST /api/orders/123/cancel
POST /api/invoices/123/send
```

Both can be reasonable.

Use command endpoints when the operation is a domain transition rather than a generic field update.

## Dynamic segments

Example:

```text
app/api/projects/[projectId]/route.ts
```

```ts
export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params

  return Response.json({ projectId })
}
```

As with pages, params are asynchronous in the current App Router contract.

## Typed RouteContext

Next.js can generate a globally available `RouteContext` helper:

```ts
export async function GET(
  request: Request,
  ctx: RouteContext<'/api/projects/[projectId]'>,
) {
  const { projectId } = await ctx.params
  return Response.json({ projectId })
}
```

Types are generated by operations such as:

```text
next dev
next build
next typegen
```

## Catch-all endpoints

Example:

```text
app/api/files/[...path]/route.ts
```

A request:

```text
/api/files/a/b/c
```

can resolve:

```ts
const { path } = await ctx.params
// ['a', 'b', 'c']
```

Validate and normalize catch-all values before using them in file paths, database keys, or upstream URLs.

## Do not construct unsafe filesystem paths

Dangerous:

```ts
const file = await readFile(`/uploads/${path.join('/')}`)
```

without validation.

Attackers may attempt path traversal inputs.

Prefer an allow-listed mapping or a storage API keyed by opaque identifiers.

## Route Handlers as HTTP boundaries

A Route Handler is justified when a real HTTP consumer exists.

Examples:

```text
browser client fetch
mobile app
webhook provider
OAuth callback
public API
external service
file download
stream endpoint
machine-to-machine integration
```

If only your Server Component needs the data, call the database/service layer directly instead of routing through your own HTTP endpoint.

## Server Functions vs Route Handlers

A rough distinction:

```text
Server Action
→ frontend-owned mutation workflow
→ integrated with React forms/actions

Route Handler
→ explicit HTTP API contract
→ callable by arbitrary HTTP clients
```

Phase 7 owns Server Action depth; this phase focuses on HTTP endpoints.

## Route Handlers are not a complete backend platform

Next.js can act as a Backend for Frontend, but a Route Handler is still deployed inside your Next.js runtime constraints.

Consider:

- execution timeout
- memory limits
- serverless lifecycle
- filesystem availability
- connection duration
- hosting region
- queue requirements
- long-running background work

A Route Handler should not become an unbounded job runner.

## Do not keep durable state in module globals

Bad:

```ts
const orders: Order[] = []

export async function POST(request: Request) {
  orders.push(await request.json())
  return Response.json({ ok: true })
}
```

In serverless or multi-instance environments:

```text
request A → instance 1
request B → instance 2
```

The arrays are not a durable shared database.

Use persistent infrastructure.

## Common mistakes

### Treating `route.ts` like a private helper

It is a public HTTP boundary.

### Returning 200 for every outcome

Status codes are part of the API contract.

### Creating route/page conflicts

A segment cannot be owned by both `page.tsx` and `route.ts`.

### Calling internal Route Handlers from Server Components

Usually unnecessary and slower.

### Storing state in process memory

Deployment topology may create many isolated instances.

### Using POST for every operation without semantics

HTTP contracts become harder to understand and operate.

## Debugging checklist

When a Route Handler behaves unexpectedly:

1. Confirm the public URL from the folder tree.
2. Confirm there is no page/route conflict.
3. Confirm the exported HTTP method matches the request.
4. Check the actual status code and response headers.
5. Check dynamic params after awaiting them.
6. Reproduce outside the browser using an HTTP client.
7. Check whether the endpoint is being called directly by an unexpected client.
8. Check deployment runtime/timeout constraints.
9. Check whether state incorrectly depends on process memory.
10. Test the production build and deployed endpoint separately.

## Interview questions

**What is a Route Handler?**  
An App Router `route.ts` endpoint that handles HTTP requests using Web Request/Response APIs.

**Can `page.tsx` and `route.ts` exist at the same route segment?**  
No. They conflict because both own that route.

**Why is a Route Handler a security boundary?**  
Because it is publicly reachable and arbitrary clients can construct requests directly.

**When should a Server Component call a Route Handler?**  
Usually only when a genuine remote HTTP boundary is required. For app-internal server data, call the source or shared server function directly.

## Exercise

Design endpoints for:

```text
list projects
create project
read one project
rename project
delete project
archive project
```

Choose:

- URL
- HTTP method
- success status
- validation boundary
- authorization rule
- idempotency expectations

Then explain whether each operation would be better as a Server Action, Route Handler, or both.