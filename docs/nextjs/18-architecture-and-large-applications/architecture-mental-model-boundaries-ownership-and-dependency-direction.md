---
title: Architecture Mental Model, Boundaries, Ownership & Dependency Direction
sidebar_position: 1
description: Design large Next.js applications around product capabilities, explicit ownership, dependency direction, runtime boundaries, and change isolation.
---

# Architecture Mental Model, Boundaries, Ownership & Dependency Direction

Large Next.js applications become difficult when every feature can reach every other feature, framework primitives leak into domain code, and ownership exists only in people's heads.

The goal of architecture is not to create more folders.

It is to make change safer.

```text
clear boundaries
→ smaller blast radius
→ easier reasoning
→ stronger tests
→ safer deployment
→ faster teams
```

## 1. Start from capabilities, not technical layers

A technical-layer-only tree often becomes a dumping ground:

```text
components/
hooks/
services/
utils/
api/
```

As the product grows, unrelated features accumulate in the same folders.

A capability-oriented model instead groups code around business responsibility:

```text
features/
  billing/
  projects/
  reporting/
  identity/
```

Each capability may own:

```text
UI
server reads
commands/mutations
validation
DTOs
policies
tests
telemetry vocabulary
```

The route tree still owns URLs and layouts, but it does not have to own every implementation detail.

## 2. Architecture has several independent boundaries

Do not collapse all boundaries into one folder structure.

A mature application usually has at least these:

```text
URL boundary
server/client boundary
trust boundary
data ownership boundary
transaction boundary
cache boundary
deployment boundary
team ownership boundary
```

A route can cross several of them.

Example:

```text
/dashboard/projects/[id]

URL owner        → projects route
render owner     → Server Component
interactive UI   → Client island
read policy      → project DAL
write policy     → project command
cache identity   → tenant + project
team owner       → Projects team
```

## 3. Dependency direction matters more than folder names

A useful default:

```text
routes/UI
  ↓
application use-cases
  ↓
domain policy
  ↓
infrastructure adapters
```

Framework code may call application code.

Application/domain code should not require knowledge of React route files when it does not need it.

Bad:

```ts
// domain/invoice.ts
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
```

Better:

```ts
export function canPayInvoice(input: {
  actorId: string
  invoiceOwnerId: string
  status: 'open' | 'paid'
}) {
  return input.actorId === input.invoiceOwnerId && input.status === 'open'
}
```

Then a Next.js server boundary obtains request/session context and passes the minimum values into policy code.

## 4. Framework boundary vs product boundary

Next.js provides framework boundaries such as:

```text
page.tsx
layout.tsx
route.ts
proxy.ts
Server Component
Client Component
Server Action
```

Those are not automatically your business architecture.

Example:

```text
framework boundary: route.ts
business boundary: invoice payment command
```

The Route Handler should adapt HTTP to the command rather than contain the whole business process.

```ts
export async function POST(request: Request) {
  const input = await parsePayInvoiceRequest(request)
  const actor = await requireUser()
  const result = await payInvoice({ actor, ...input })
  return toHttpResponse(result)
}
```

## 5. Route files should be composition roots

Treat route files as places that assemble dependencies and UI rather than as giant implementation modules.

Good route responsibilities:

```text
read params/search params
load route-level data
compose feature UI
select layouts/boundaries
translate framework control flow
```

Avoid turning a page into:

```text
ORM queries
permission engine
third-party SDK calls
payment logic
email construction
analytics mapping
cache-key construction
```

Move durable ownership into explicit modules.

## 6. One concept should have one authoritative owner

Ask:

> Where would a new engineer change the rule for this concept?

If the answer is “five files in three unrelated folders,” ownership is unclear.

Examples:

```text
session verification        → identity DAL/auth module
project authorization       → project policy/DAL
invoice payment transaction → billing command
public project DTO          → project DTO mapper
analytics event schema      → telemetry contract module
```

The UI can consume these owners; it should not redefine them.

## 7. Shared is not a product domain

`shared/` often becomes the largest dependency magnet in the repository.

A module belongs in shared infrastructure only when its meaning is truly cross-domain.

Reasonable shared candidates:

```text
logging abstraction
ID/date primitives
HTTP client foundation
observability helpers
design-system primitives
configuration parsing
```

Suspicious shared candidates:

```text
projectUtils.ts
billingHelpers.ts
userStuff.ts
commonService.ts
```

If a module contains product meaning, give it a product owner.

## 8. Prefer explicit public APIs between modules

Instead of importing any internal file:

```ts
import { normalizePlan } from '@/features/billing/internal/normalize-plan'
```

Expose a deliberate package/module API:

```ts
import { getBillingSummary } from '@/features/billing'
```

This lets the feature change internals without repository-wide breakage.

A boundary can be enforced with:

```text
package exports
ESLint import rules
TypeScript project references
CODEOWNERS/review rules
architecture tests
```

The exact enforcement tool is repository-specific.

## 9. Cycles are architectural warnings

A dependency cycle often means two modules do not have clear ownership.

```text
billing → projects → billing
```

Possible fixes:

```text
extract stable shared abstraction
move responsibility to true owner
communicate through event/command boundary
merge modules if they are not actually independent
```

Do not hide a cycle with dynamic import and call it architecture.

## 10. Separate read models from write models when useful

UI reads and transactional writes often need different shapes.

A dashboard read may join:

```text
project
member count
billing status
last activity
```

A write command may require:

```text
project row lock
authorization check
version check
transaction
outbox event
```

Forcing both through one generic repository abstraction can make each worse.

Use separate read/query and command paths when the complexity justifies it.

## 11. Server-first architecture is an ownership tool

App Router Server Components let server-owned reads stay server-owned.

A useful default:

```text
Server Component
→ application query / DAL
→ minimal DTO
→ render
```

Do not create an HTTP hop from your own Server Component to your own Route Handler unless the HTTP boundary is actually required.

Public/mobile/external consumers are a valid reason for an HTTP API.

## 12. Client Components should form narrow interactive islands

A feature may be server-owned overall while containing client interactions.

```text
ProjectPage (Server)
├─ ProjectSummary (Server)
├─ ActivityList (Server)
└─ RenameProjectForm (Client)
```

This keeps:

```text
secrets server-side
DB/SDK code server-side
browser JS smaller
business rules centralized
```

Client Components may request mutations, but the server remains authoritative.

## 13. The DAL is a security and architecture boundary

A Data Access Layer can centralize:

```text
session verification
tenant scope
resource ownership
field projection
DB access
request-level dedupe
```

Example conceptual shape:

```ts
export async function getProjectForViewer(projectId: string) {
  const session = await verifySession()
  const project = await db.project.findFirst({
    where: { id: projectId, tenantId: session.tenantId },
  })

  if (!project) return null

  return toProjectViewerDto(project)
}
```

This is stronger than scattering tenant filters across pages.

## 14. Commands own side-effecting business operations

For meaningful mutations, create explicit use cases:

```text
createProject
archiveProject
inviteMember
payInvoice
changePlan
```

A command can own:

```text
input validation
authorization
transaction
idempotency
outbox/event
audit record
cache invalidation contract
```

Then Server Actions, Route Handlers, jobs, or admin tools can reuse the command without duplicating policy.

## 15. Events decouple consequences, not correctness

An event is useful when one completed business fact has multiple secondary consumers.

```text
InvoicePaid
├─ receipt email
├─ analytics
├─ CRM sync
└─ finance export
```

But the transaction that decides the invoice is paid must remain authoritative.

Do not replace a required synchronous invariant with “eventual consistency” by accident.

## 16. Architecture should mirror failure domains

If one dependency fails, what should stop working?

Example:

```text
recommendation API down
→ recommendations degrade
→ checkout remains usable
```

A feature boundary that requires every unrelated service to succeed creates unnecessary blast radius.

Use Suspense, error boundaries, timeouts, degraded states, and background processing according to product criticality.

## 17. Architecture should mirror observability ownership

Each major capability should have identifiable telemetry:

```text
route
feature/use-case
release
error class
latency
external dependency
business outcome
```

A team should be able to answer:

> Is billing broken, or is the whole site broken?

Observability structure should follow architecture structure.

## 18. Architecture should mirror testing ownership

A capability can own a confidence ladder:

```text
policy unit tests
DAL integration tests
command transaction tests
route/action contract tests
critical E2E journey
```

This is better than a global `tests/` folder with unclear responsibility.

## 19. Architecture is constrained by deployment topology

A monolith can still be modular.

```text
one Next.js deployment
many internal product modules
```

Do not split deployments merely to prove modularity.

Separate deployment becomes valuable when there is a real need for:

```text
independent release cadence
strong failure isolation
separate scaling
separate technology/runtime
separate regulatory/data boundary
large-team ownership
```

Phase 17 covers how to operate those deployments. This phase decides when a boundary deserves one.

## 20. Architecture decision checklist

For each major module, write down:

```text
business responsibility
public API
owned data
owned cache keys
owned routes
owned commands
owned events
security policy
failure mode
telemetry
team owner
```

If these cannot be named, the module is probably not a real boundary yet.

## 21. Senior review questions

### Should every feature be a package?

No. Packages add useful enforcement only when the boundary benefits from explicit dependency control, reuse, independent tooling, or ownership. Folders can be enough for smaller internal modules.

### Is layered architecture better than vertical slices?

They solve different problems. Vertical slices group product capability; layers can still exist inside a slice. A useful architecture often combines both.

### When should a Next.js app become multiple services?

When operational, scaling, security, ownership, or lifecycle boundaries justify the distributed-system cost—not merely because the codebase is large.

## Production checklist

- [ ] major capabilities have explicit owners
- [ ] route files mostly compose rather than own business logic
- [ ] server/client boundaries are deliberate
- [ ] domain code avoids unnecessary Next.js coupling
- [ ] DAL owns sensitive read authorization
- [ ] commands own transactional writes
- [ ] cross-feature public APIs are explicit
- [ ] cycles are detected and resolved
- [ ] failure and telemetry boundaries match product boundaries
- [ ] deployment splits have a concrete reason

## Exercise

Take a SaaS application with projects, members, billing, and reporting.

Design:

1. feature boundaries
2. route ownership
3. DAL ownership
4. command ownership
5. event flow
6. client islands
7. cache ownership
8. telemetry ownership
9. team ownership
10. deployment boundaries
