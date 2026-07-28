---
title: Authorization, DALs, DTOs, Tenancy & Resource Scoping
description: Centralize secure authorization in a server-only Data Access Layer, scope every query to the authorized resource and tenant, and expose only minimal DTOs.
---

# Authorization, DALs, DTOs, Tenancy & Resource Scoping

Authorization is the decision:

```text
may actor A perform operation O on resource R in context C?
```

Production security depends on making that decision close to the protected data and operation.

The current Next.js guidance recommends a **Data Access Layer (DAL)** for new applications.

A DAL should:

- run only on the server
- verify session/identity
- perform authorization checks
- query trusted data sources
- return minimal safe DTOs

## Why centralize authorization

Without a DAL, auth checks spread across:

```text
page.tsx
layout.tsx
components
Server Actions
Route Handlers
utility functions
```

The result is easy to audit incorrectly.

A secure architecture prefers:

```text
UI / endpoint
  ↓
DAL / domain policy
  ↓
database / service
```

so callers cannot casually bypass the policy.

## Start with `server-only`

Mark security-sensitive data modules as server-only:

```ts
import 'server-only'
```

This creates a build-time guard if client code imports the module.

Example:

```ts
import 'server-only'
import { cache } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const verifySession = cache(async () => {
  const token = (await cookies()).get('session')?.value
  const session = await verifyToken(token)

  if (!session?.userId) redirect('/login')

  return {
    userId: session.userId,
    sessionId: session.sessionId,
  }
})
```

## Request-scoped memoization

React `cache()` is useful for deduplicating repeated session verification during one server render/request flow.

It does not mean:

```text
share user 42's authorization result with every user
```

Keep request-scoped memoization separate from persistent shared caching.

## Verify current server-side state when needed

A signed session may prove:

```text
userId = usr_42
```

For a sensitive action you may still need current state:

```text
user enabled?
organization membership active?
role changed?
project archived?
account suspended?
```

Example:

```ts
export const getActor = cache(async () => {
  const session = await verifySession()

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      status: true,
    },
  })

  if (!user || user.status !== 'ACTIVE') {
    throw new Error('Unauthorized')
  }

  return user
})
```

## Authorization should be operation-specific

Avoid vague helpers:

```text
isAdmin()
canAccessDashboard()
```

when the real policy is resource-specific.

Prefer policy language such as:

```text
canReadInvoice(actor, invoice)
canUpdateProject(actor, membership, project)
canInviteMember(actor, organization)
canExportBillingData(actor, organization)
```

The name should reveal the protected operation.

## Role-based access control

RBAC maps roles to permissions.

Example:

```text
owner
→ organization:delete
→ billing:update
→ member:invite

admin
→ member:invite
→ project:update

member
→ project:read
```

RBAC is useful when permission policy is mostly role-driven.

But role alone is often not enough.

## Resource ownership

Suppose a user can edit their own draft:

```text
role = member
resource.ownerId = actor.userId
resource.status = draft
```

The policy uses actor + resource state, not just role.

## Multi-tenant authorization

The highest-risk SaaS authorization bug is often cross-tenant data access.

Unsafe flow:

```ts
const invoice = await db.invoice.findUnique({
  where: { id: invoiceId },
})

if (session.role === 'admin') return invoice
```

This can let an admin from tenant A access tenant B's invoice.

Prefer tenant-scoped access:

```ts
const membership = await requireMembership(organizationId)

const invoice = await db.invoice.findFirst({
  where: {
    id: invoiceId,
    organizationId: membership.organizationId,
  },
  select: {
    id: true,
    number: true,
    total: true,
    status: true,
  },
})
```

The database query participates in authorization.

## Never trust route tenant identifiers

A route may be:

```text
/acme/invoices/9001
```

Both values are attacker-controlled input.

The route tells you what the caller **requested**.

It does not prove:

```text
caller belongs to acme
invoice 9001 belongs to acme
caller may read invoice 9001
```

Verify all three from trusted state.

## Insecure direct object references

An IDOR/BOLA class bug occurs when a caller can switch an identifier and access another user's/resource's data.

Example vulnerable endpoint:

```text
GET /api/invoices/9002
```

where authorization checks only that the caller is signed in.

The secure rule is:

```text
identify actor
+ load resource under authorized scope
+ verify operation
```

## Scope at query time

Strong pattern:

```sql
SELECT id, title
FROM projects
WHERE id = $projectId
  AND organization_id = $authorizedOrganizationId
```

This is safer than:

```text
fetch any project by ID
→ later compare tenant in UI
```

## Do not trust client role claims

Never authorize from:

```text
query ?role=admin
hidden form field
localStorage role
client context role
button visibility
client-managed state
```

A role sent to the browser is a UI hint only.

## DTOs reduce exposure

A database model is an internal persistence object.

A DTO is an intentional boundary object.

Example persistence model:

```text
User
- id
- email
- passwordHash
- recoverySecret
- billingCustomerId
- internalFlags
- createdAt
```

Safe profile DTO:

```ts
export type ProfileDTO = {
  id: string
  displayName: string
  avatarUrl: string | null
}
```

Return only what the consumer needs.

## Field-level authorization

Different actors may see different fields.

Example:

```ts
return {
  id: user.id,
  username: user.username,
  phoneNumber: canSeePhone(actor, user)
    ? user.phoneNumber
    : null,
}
```

Authorization is not always row-level.

## Server Components still need DTOs

A Server Component can access a full database row safely **on the server**.

The danger appears when it passes data into:

- a Client Component prop
- rendered HTML
- RSC payload
- metadata
- logs
- analytics

Use DTOs before values approach those boundaries.

## Client auth context is not server authorization

Client Components may use an auth context for:

- avatar/menu state
- client-side API fetching
- optimistic UI decisions

But Server Components render in a separate server environment and do not gain authorization guarantees from a client context provider.

Secure server operations must verify on the server.

## Page checks vs leaf checks

A page may verify session early for user experience.

A leaf component can also verify permissions for the data it renders.

This is safe when the DAL centralizes the underlying check.

Example:

```tsx
export default async function BillingPanel() {
  const billing = await getAuthorizedBillingSummary()
  return <BillingView billing={billing} />
}
```

`getAuthorizedBillingSummary()` owns the real permission rule.

## Avoid top-level null-gating as security

Unsafe SPA habit:

```tsx
if (!session) return null
return children
```

This may hide UI but does not secure:

- direct route requests
- Server Actions
- Route Handlers
- nested entry points

Use it for UX only.

## Server Actions should call the DAL

```ts
'use server'

export async function deleteInvoice(invoiceId: string) {
  const actor = await requireActor()
  const invoice = await requireInvoiceForOrganization(actor, invoiceId)

  if (!canDeleteInvoice(actor, invoice)) {
    throw new Error('Forbidden')
  }

  await db.invoice.delete({ where: { id: invoice.id } })
}
```

Do not accept tenant ownership as a client-provided fact.

## Route Handlers should use the same policy

```ts
export async function GET(
  _request: Request,
  { params }: RouteContext<'/api/invoices/[id]'>
) {
  const { id } = await params
  const invoice = await getAuthorizedInvoiceDTO(id)

  return Response.json(invoice)
}
```

The HTTP adapter stays thin.

## Separate transport from policy

Good architecture:

```text
Server Action
     ┐
Route Handler ──→ domain/DAL policy → database
Server Component┘
```

Avoid duplicating permission rules separately in each transport.

## Cache-aware authorization

Never persistently cache a function whose output depends on the current user unless the cache key and policy explicitly include the security identity and permission lifecycle.

Dangerous:

```text
cache key = invoiceId
result = authorized personalized invoice view
```

If user A populates the cache, user B may receive A's output.

Safer options:

- cache public source data before authorization
- key by tenant/user where appropriate
- use request-scoped React `cache()`
- avoid persistent caching for permission-sensitive derived output

## Permission invalidation

When roles/memberships change, stale authorization state must stop granting access.

Design:

```text
role updated
membership revoked
organization suspended
session revoked
cache invalidated where needed
```

Security state has freshness requirements just like business data.

## Authorization failures

At a Route Handler:

```text
no valid identity → 401
valid identity, denied operation → 403
```

For resource privacy, some APIs intentionally return `404` for resources the caller should not know exist.

That policy must be consistent and deliberate.

## Experimental auth interrupts

Next.js currently exposes experimental:

```text
unauthorized()
forbidden()
unauthorized.tsx
forbidden.tsx
experimental.authInterrupts
```

They are useful to study but are not recommended as the production baseline in stable handbook examples.

Use stable redirects/status/error handling unless your application has explicitly adopted the experimental contract.

## Authorization audit checklist

For every protected operation:

1. What is the actor identity?
2. Is the session current enough for this operation?
3. What tenant is authorized from trusted state?
4. What resource is being accessed?
5. Does the resource belong to that tenant/user?
6. What operation is requested?
7. What policy allows it?
8. Is the database query scoped?
9. What fields may be returned?
10. Is any result cached?
11. Can permissions change during cache/session lifetime?
12. What denial is logged?

## Interview questions

**Why place authorization in a DAL?**  
Because pages, Server Actions, Route Handlers, and Server Components can all call the same trusted policy instead of duplicating checks at transport/UI boundaries.

**What is an IDOR/BOLA-style authorization flaw?**  
A caller changes a resource identifier and accesses an object without the server verifying ownership, tenant scope, or permission for that exact resource.

**Why are DTOs a security mechanism?**  
They make data exposure intentional and reduce the chance of leaking persistence fields across the server/client or HTTP boundary.

## Exercise

Implement policy for:

```text
organization:read
organization:update
member:invite
project:read
project:update
invoice:read
invoice:refund
```

For each operation define:

- role requirement
- ownership/relationship rule
- tenant scope
- resource-state rule
- secure query shape
- DTO fields
- denial behavior
- cache policy

## Primary references

- [Next.js Authentication guide](https://nextjs.org/docs/app/guides/authentication)
- [Next.js Data Security guide](https://nextjs.org/docs/app/guides/data-security)
