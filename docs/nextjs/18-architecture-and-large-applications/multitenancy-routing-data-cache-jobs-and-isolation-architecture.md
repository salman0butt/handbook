---
title: Multi-Tenancy, Routing, Data, Cache, Jobs & Isolation Architecture
sidebar_position: 5
description: Design multi-tenant Next.js systems with explicit tenant identity, route ownership, secure data access, cache isolation, job scoping, observability, and rollout safety.
---

# Multi-Tenancy, Routing, Data, Cache, Jobs & Isolation Architecture

Multi-tenancy is not only a routing concern.

A tenant boundary affects:

```text
hostname / URL
auth/session context
authorization
database queries
cache keys
background jobs
object storage
rate limits
telemetry
feature flags
billing
operations
```

A safe architecture makes tenant identity explicit from ingress to persistence.

## 1. Decide the tenant identifier model

Common models include:

```text
subdomain        → acme.example.com
path             → example.com/acme/...
custom domain    → app.customer.com
account selector → one user switches organisations
```

The public URL model and the internal tenant ID are not necessarily the same.

Prefer a stable internal tenant identifier for authorization/data/cache contracts.

## 2. Resolve tenant context once, verify repeatedly

Ingress may resolve:

```text
host/path
→ tenant slug/domain mapping
→ tenant ID
```

But a user-provided hostname/path is not proof of authorization.

The secure data/action boundary still verifies:

```text
session belongs to tenant
actor has required role/resource access
resource belongs to tenant
```

Proxy routing is not the final authorization boundary.

## 3. Keep tenant identity in server context

A typical server request may derive:

```ts
{
  userId,
  tenantId,
  role,
  requestId
}
```

Pass the minimum authoritative values to DAL/commands.

Do not let client state decide the tenant for privileged operations without server verification.

## 4. Tenant-scoped queries should fail closed

Safer conceptual query:

```ts
where: {
  id: projectId,
  tenantId: session.tenantId,
}
```

More dangerous pattern:

```ts
const project = await db.project.findUnique({ where: { id: projectId } })
if (project.tenantId !== tenantId) ...
```

The second pattern retrieves cross-tenant data before policy evaluation and is easier to misuse elsewhere.

Prefer scoping at the query boundary when possible.

## 5. Tenant identity belongs in cache identity

Conceptually:

```text
project:123
```

is unsafe if project IDs are not globally isolated in every context.

Use identity that includes relevant dimensions:

```text
tenant:acme:project:123
```

The same applies to:

```text
reports
permissions
feature configuration
billing summaries
search results
```

## 6. Public tenant content still needs explicit identity

Even publicly cacheable tenant pages need correct host/slug/cache variation.

A CDN or server cache that ignores host/tenant can serve one tenant's branding/content to another.

Test host and path variation in production-like infrastructure.

## 7. Custom domains require ownership verification

If customers can bind domains:

```text
claim domain
verify ownership
store canonical mapping
provision TLS/DNS/platform mapping
activate
```

Do not accept arbitrary host headers as trusted tenant identity.

Operational domain onboarding depends on your hosting/provider architecture.

## 8. Tenant-aware URLs should have a canonical source

For a request, decide the authoritative tenant URL identity:

```text
custom domain
canonical subdomain
path-based fallback
```

Metadata, redirects, callback URLs, emails, and generated links should use a trusted URL builder rather than each feature reconstructing hosts independently.

## 9. Tenant-aware session semantics

A session can represent:

```text
user identity only
user + active tenant
user + memberships
```

The right choice depends on UX and authorization freshness.

A membership/role change must invalidate or re-check authority according to the security contract.

Do not assume a long-lived role claim is always current.

## 10. Cross-tenant admin is a separate capability

Support staff or platform admins often need broader scope.

Do not implement this as:

```text
if admin → skip tenant filter
```

Prefer an explicit platform-admin use case with:

```text
separate permission
strong audit trail
explicit tenant selection
reason/context where required
narrow tooling
```

This reduces accidental privilege expansion.

## 11. Tenant data models

Common persistence strategies:

### Shared database, shared schema

```text
rows carry tenant_id
```

Benefits: operational simplicity.

Risk: every query must preserve isolation.

### Shared database, separate schema

More isolation, greater operational/schema-management complexity.

### Database per tenant

Strong isolation and lifecycle control, but connection/migration/analytics complexity rises substantially.

Architecture should choose based on regulatory, scale, blast radius, cost, and operational capability.

## 12. Tenant ownership belongs in constraints too

Application filters are necessary but database design can add defense in depth.

Examples:

```text
composite keys including tenant_id
unique constraints scoped by tenant
foreign keys preserving tenant ownership
row-level security where architecture supports it
```

The exact mechanism is database-specific.

## 13. Background jobs must carry tenant context

A queued payload should contain enough stable identity to enforce scope:

```ts
{
  tenantId,
  jobType,
  resourceId,
  actorId?,
  correlationId
}
```

The worker should not infer tenant from mutable client-facing data.

## 14. Scheduled jobs need bounded tenant fan-out

Bad:

```text
cron
→ load every tenant
→ run every expensive operation concurrently
```

Better:

```text
scheduler
→ enqueue bounded tenant work
→ worker concurrency controls
→ per-tenant isolation/retry
```

This reduces noisy-neighbour failure.

## 15. Rate limits may need tenant dimensions

Possible dimensions:

```text
IP
user
API key
tenant
operation
```

A single abusive tenant should not consume all shared capacity unless the product contract intentionally allows it.

## 16. Object storage must preserve tenant scope

Conceptual key:

```text
tenants/{tenantId}/projects/{projectId}/file
```

But key naming alone is not authorization.

Signed upload/download capabilities must also enforce ownership, expiry, content policy, and access conditions.

## 17. Search/vector indexes are tenant data stores too

When using:

```text
search engine
vector database
analytics warehouse
cache
```

include tenant isolation in indexing/query contracts.

Do not secure the primary DB while leaving secondary data stores globally queryable.

## 18. Events need tenant identity

Business event example:

```json
{
  "type": "project.archived",
  "tenantId": "t_123",
  "projectId": "p_456",
  "eventId": "e_789"
}
```

Consumers can then preserve tenant scope in downstream systems.

Event payloads should contain minimal necessary data rather than full sensitive records.

## 19. Feature flags may be tenant-scoped

A flag evaluation can depend on:

```text
release environment
tenant
user cohort
plan
region
```

Evaluate authoritative server-side flags for security/business decisions.

Client flags are suitable for presentation/experience—not bypassing server policy.

## 20. Tenant-aware observability

Useful telemetry dimensions can include a safe internal tenant identifier.

Be careful with:

```text
tenant names
emails
custom domains
sensitive payloads
```

Use data-minimised identifiers and retention policy.

For high-cardinality telemetry, control cost and aggregation design.

## 21. Noisy-neighbour architecture

Shared resources include:

```text
DB pool
CPU
queue workers
cache
third-party quotas
search cluster
```

A large tenant can degrade everyone.

Possible controls:

```text
per-tenant quotas
concurrency limits
fair queues
resource budgets
tiered capacity
backpressure
```

## 22. Billing and entitlement should have one owner

Avoid every feature implementing plan checks:

```ts
if (plan === 'pro') ...
```

Prefer an entitlement contract:

```ts
canUseFeature({ tenantId, feature: 'advanced-reports' })
```

This centralizes plan/override/trial logic.

The server still enforces entitlement at privileged operations.

## 23. Tenant deletion is a distributed lifecycle

Deleting a tenant may involve:

```text
primary DB
object storage
cache
search index
queue work
analytics exports
provider resources
backups/retention policy
```

Model lifecycle explicitly:

```text
active
suspended
pending deletion
deleted/retained according to policy
```

Do not implement tenant deletion as one SQL statement.

## 24. Tenant migration between regions/shards

At scale, tenant placement may become dynamic.

A routing directory can map:

```text
tenant → region/shard/database
```

Moves need compatibility and dual-read/write or controlled cutover strategy.

Do not hardcode tenant placement throughout feature code.

## 25. Testing multi-tenancy

High-value regression matrix:

```text
tenant A user → A resource → allowed
tenant A user → B resource → denied
platform admin → explicit B context → audited allowed
cache warmed by A → B request → never A data
job for A → never mutate B
custom domain A → correct tenant identity
```

These are architecture tests, not only security unit tests.

## 26. Senior review questions

### Is subdomain routing enough to make an app multi-tenant?

No. Routing chooses a tenant context; isolation must continue through session authorization, DB queries, cache, jobs, storage, and integrations.

### Should tenant ID come from the client request body?

It may be a requested target, but the server must resolve/verify it against authenticated authority. Client-provided tenant identity is not trusted authorization context.

### When should you choose database-per-tenant?

When isolation, regulatory, lifecycle, scale, or customer requirements justify the operational complexity.

## Production checklist

- [ ] internal tenant identity is stable and explicit
- [ ] ingress tenant resolution is not treated as authorization
- [ ] DAL queries are tenant-scoped
- [ ] cache/CDN identity preserves tenant variation
- [ ] custom domains are verified and canonically mapped
- [ ] admin cross-tenant capability is explicit/audited
- [ ] jobs/events/storage/search carry tenant scope
- [ ] noisy-neighbour controls exist for shared resources
- [ ] entitlement logic has an authoritative owner
- [ ] tenant deletion/migration lifecycle is designed
- [ ] cross-tenant negative tests exist at every stateful boundary

## Exercise

Design a multi-tenant project-management SaaS supporting:

```text
custom domains
organisation switching
shared database
per-tenant billing
background exports
search
object storage
```

Map tenant identity through every layer from HTTP request to queue worker.
