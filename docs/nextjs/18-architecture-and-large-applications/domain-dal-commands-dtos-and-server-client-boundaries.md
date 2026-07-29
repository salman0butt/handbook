---
title: Domain, DAL, Commands, DTOs & Server/Client Boundaries
sidebar_position: 3
description: Structure product logic around secure server-owned data access, application commands, DTO projection, transactional boundaries, and narrow browser interfaces.
---

# Domain, DAL, Commands, DTOs & Server/Client Boundaries

A large App Router codebase needs more than route organisation. It needs a stable place for business rules.

A useful high-level model is:

```text
route / UI
→ application query or command
→ domain policy
→ infrastructure
```

The browser should receive only the data and operations it needs.

## 1. Separate reads from writes conceptually

Reads answer questions:

```text
What projects can this user see?
What is the billing summary?
What should this dashboard render?
```

Writes execute business decisions:

```text
Create project
Archive project
Invite member
Pay invoice
Change plan
```

They often have different requirements.

## 2. The DAL owns secure reads

The authentication guide recommends a Data Access Layer to centralise session verification and authorization logic.

A DAL function should expose a product-oriented contract rather than raw database power.

```ts
import 'server-only'

export async function getProjectForViewer(projectId: string) {
  const session = await verifySession()

  const project = await db.project.findFirst({
    where: {
      id: projectId,
      tenantId: session.tenantId,
    },
  })

  if (!project) return null

  return toProjectViewerDto(project, session)
}
```

The tenant/resource scope is part of the function's meaning.

## 3. Avoid generic repository APIs that bypass policy

A dangerous abstraction:

```ts
projects.findById(id)
```

used everywhere may make it easy to forget tenant or authorization constraints.

Prefer purpose-specific operations where policy matters:

```text
getProjectForViewer
getProjectForAdmin
listProjectsForTenant
```

Not every application needs separate repository classes. What matters is that secure data access has an authoritative owner.

## 4. DTOs are boundary contracts

Do not hand complete ORM/database records to UI layers by default.

Project what the consumer needs:

```ts
export type ProjectCardDto = {
  id: string
  name: string
  status: 'active' | 'archived'
  canEdit: boolean
}
```

Benefits:

```text
less accidental data exposure
smaller RSC/client payloads
less schema coupling
clearer API evolution
easier tests
```

## 5. DTOs should encode presentation permission

Instead of making the client re-derive authorization:

```ts
if (user.role === 'admin' || project.ownerId === user.id) {
  // show edit
}
```

return an explicit capability:

```ts
{ canEdit: true }
```

The server still re-checks authorization during mutation.

The DTO controls display, not security authority.

## 6. Commands own writes

An application command is a good home for a meaningful mutation:

```ts
export async function archiveProject(input: {
  actorId: string
  tenantId: string
  projectId: string
}) {
  // authorize
  // load current state
  // enforce invariant
  // transaction
  // audit/outbox
  // return result
}
```

A Server Action can adapt form state to this command.

A Route Handler can adapt HTTP to the same command.

A background job may also call the command if its semantics fit.

## 7. Keep framework transport outside core business logic

Bad command API:

```ts
archiveProject(formData: FormData, cookies: ReadonlyRequestCookies)
```

Better:

```ts
archiveProject({ actor, projectId })
```

The Server Action owns `FormData` parsing and request context.

The command owns the business operation.

## 8. Transactions belong around invariants

If several writes must succeed together, own them in one transaction boundary.

```text
check invoice open
mark paid
record ledger entry
write outbox event
commit
```

Do not split required invariant updates across unrelated Server Actions.

## 9. Idempotency belongs to the command boundary

Retries, double clicks, webhook replays, and job retries can repeat operations.

A command should define whether repetition is:

```text
safe no-op
same-result replay
conflict
new operation
```

Example:

```text
pay invoice with idempotency key K
→ first call commits
→ retry returns existing result
```

## 10. Outbox pattern separates transaction from delivery

If a successful write must eventually trigger durable external effects:

```text
DB transaction
├─ business state
└─ outbox event

worker
→ email / webhook / external integration
```

This avoids a false transaction across database + external provider.

Phase 17 covers operational delivery; architecture should decide which consequences are synchronous and which are durable async work.

## 11. Queries can optimise for the UI

A query does not have to reuse the same model used for writes.

Example dashboard query:

```sql
SELECT
  p.id,
  p.name,
  COUNT(m.id) AS member_count,
  MAX(a.created_at) AS last_activity
...
```

A purpose-built read model can reduce N+1 and simplify rendering.

## 12. Server Components are natural query consumers

```tsx
export default async function ProjectPage({ params }) {
  const { id } = await params
  const project = await getProjectForViewer(id)

  if (!project) notFound()

  return <ProjectView project={project} />
}
```

No internal HTTP API is required when the server route and data layer live in the same application boundary.

## 13. Client Components should receive minimal serializable contracts

Bad:

```tsx
<ProjectEditor project={rawDbProject} session={fullSession} />
```

Better:

```tsx
<ProjectEditor
  project={{ id: project.id, name: project.name }}
  canRename={project.canRename}
/>
```

Client props are an exposure surface.

## 14. Do not put secrets in client-visible capability objects

A capability object should describe permission, not credentials.

Good:

```ts
{ canExport: true }
```

Bad:

```ts
{ exportApiToken: process.env.EXPORT_API_TOKEN }
```

## 15. Domain policy can be pure

Pure policy functions are easy to test and reuse.

```ts
export function canArchiveProject(input: {
  role: 'member' | 'manager' | 'admin'
  status: 'active' | 'archived'
}) {
  return input.status === 'active' && input.role !== 'member'
}
```

The DAL gets facts.

The policy decides.

The command applies the decision transactionally.

## 16. Avoid a giant service layer

A `services/projectService.ts` with 3,000 lines often mixes:

```text
queries
writes
validation
provider calls
formatting
HTTP details
analytics
```

Split by use case and responsibility.

```text
queries/get-project-for-viewer.ts
commands/archive-project.ts
commands/invite-member.ts
integrations/project-webhooks.ts
```

## 17. Define domain errors intentionally

Commands can return/throw meaningful application outcomes:

```text
not authorized
not found
already archived
quota exceeded
conflict
provider unavailable
```

Transport adapters translate them:

```text
Server Action → form state / control flow
Route Handler → status/body
job worker → retry/dead-letter policy
```

Do not leak provider/database error strings directly.

## 18. Cache at the owner boundary

The module that defines a read should generally define its cache semantics.

```text
getPublicProjectSummary
→ safe public cache

g getProjectForViewer
→ identity/tenant-aware or uncached/private strategy
```

Do not put a global cache wrapper around arbitrary DAL functions.

Cache identity is part of correctness.

## 19. Invalidation belongs to the write owner

A successful command knows what became stale.

Example:

```text
renameProject
→ invalidate project detail
→ invalidate project list/tag
```

Centralizing invalidation with the mutation reduces forgotten freshness updates.

## 20. Authorization must exist at each public mutation boundary

Reusing a command does not mean trusting the caller.

The command or a mandatory lower-level policy should receive authoritative actor context and enforce authorization.

Do not rely on:

```text
button hidden
Proxy passed
page already loaded
```

## 21. Background jobs need explicit actor/system semantics

A job may run without a human request.

Define whether it executes as:

```text
system principal
service principal
specific user delegated authority
```

Do not silently bypass all policy because “the worker is internal.”

## 22. External APIs need adapters

Wrap provider-specific concepts at the edge:

```text
application command
→ PaymentsPort
→ StripeAdapter
```

This lets the application reason in product language:

```text
chargeSubscription
```

rather than provider implementation detail:

```text
paymentIntents.create
```

The adapter still exposes provider-specific failure classes where the product genuinely needs them.

## 23. Request context should be explicit

Useful context may include:

```text
user ID
tenant ID
request ID
locale
feature snapshot
```

Avoid ambient globals that make behaviour difficult to test or reason about.

Framework request APIs can be read at the boundary and passed deliberately.

## 24. Keep cross-cutting infrastructure out of every function signature

Do not pass 12 infrastructural dependencies manually through the entire application if a composition/container boundary can manage them safely.

But also avoid a service locator that lets any module fetch anything.

Prefer explicit constructor/factory dependencies for modules that benefit from substitution.

## 25. Senior review questions

### Is a DAL the same as a repository pattern?

Not necessarily. A DAL is the application's authoritative secure data-access boundary. It can use direct ORM queries, repository abstractions, SQL, SDKs, or combinations.

### Should Server Actions contain business logic?

They can contain simple operations, but meaningful reusable policy/transactions are usually safer in application commands called by the Action.

### Why create DTOs if TypeScript already has ORM types?

ORM types describe storage. DTOs describe what a boundary is allowed and expected to expose. Those are different contracts.

## Production checklist

- [ ] secure reads have an authoritative DAL/query owner
- [ ] tenant/resource authorization is not scattered
- [ ] DTOs minimise exposure and coupling
- [ ] commands own meaningful mutations and invariants
- [ ] framework transport types stay at adapters
- [ ] transactions and idempotency are explicit
- [ ] durable secondary effects use appropriate async architecture
- [ ] cache/invalidation ownership follows read/write ownership
- [ ] external providers are isolated behind adapters where useful
- [ ] background/system actors have explicit authority

## Exercise

Design the architecture for `inviteMember`:

1. request/form parsing
2. session/tenant identity
3. authorization policy
4. transaction
5. duplicate invite handling
6. DTO/result
7. audit event
8. email delivery
9. cache invalidation
10. tests
