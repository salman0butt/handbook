---
title: Capstone — Multi-Tenant SaaS, Admin, Billing, Jobs & Observability
sidebar_position: 4
description: Build a multi-tenant SaaS product with secure tenancy, roles, entitlements, background work, billing-like lifecycle, feature flags, audit logs, and production operations.
---

# Capstone — Multi-Tenant SaaS, Admin, Billing, Jobs & Observability

Build a SaaS product with organizations/workspaces and multiple roles.

Examples:

```text
team project management
AI workflow platform
analytics dashboard
content operations suite
support/CRM tool
```

The domain is flexible. The tenancy and operational requirements are not.

## Core capabilities

Minimum:

```text
sign in
create/join tenant
invite member
role management
resource CRUD
search/filter
background job
usage/entitlement display
admin/support view
audit log
```

## Tenancy model

Choose and document one primary tenancy strategy:

```text
shared DB + tenant_id
schema-per-tenant
database-per-tenant
hybrid
```

For most portfolio projects, shared DB + explicit `tenantId` is reasonable, but every query must preserve the boundary.

## Tenant identity

Tenant identity may come from:

```text
URL segment
subdomain/custom domain
session-selected workspace
```

Ingress identity is not authorization.

The server must still verify the authenticated user has access to that tenant.

## Authorization matrix

Define capabilities such as:

```text
owner
admin
member
viewer
support
```

Then define permissions explicitly.

Example:

| Capability | owner | admin | member | viewer |
| --- | ---: | ---: | ---: | ---: |
| invite member | ✅ | ✅ | ❌ | ❌ |
| edit resource | ✅ | ✅ | ✅ | ❌ |
| billing settings | ✅ | ❌ | ❌ | ❌ |

Do not scatter role string checks through UI components.

## DAL requirement

All tenant-sensitive reads must pass through secure data-access functions.

Conceptual rule:

```text
session
→ tenant membership
→ resource query constrained by tenant
→ DTO projection
```

Test cross-tenant negative cases aggressively.

## Commands

Meaningful writes should live in commands such as:

```text
createWorkspace
inviteMember
changeMemberRole
createProject
archiveProject
changePlan
```

Commands own validation, authorization, transaction, audit event, outbox and invalidation.

## Session lifecycle

Implement and document:

```text
sign in
sign out
expiry
rotation/renewal
revocation
membership removed while session exists
```

## Invitations

Invitation flow should include:

```text
unpredictable token
expiry
one-time/controlled reuse policy
recipient scope
acceptance transaction
audit event
```

Do not trust an invitation token to grant arbitrary tenant membership without validation.

## Entitlements vs permissions

Separate:

```text
permission: may this actor perform the action?
entitlement: does this plan/account include the capability?
feature flag: are we rolling the capability out?
```

A user may be an admin but still lack a plan entitlement.

## Billing-like lifecycle

You do not need real card processing to prove architecture.

Model states such as:

```text
trial
active
past_due
cancelled
```

and usage limits such as:

```text
seats
projects
AI credits
storage
```

Use an adapter if integrating a real billing provider.

## Feature flags

Implement at least one controlled rollout.

Requirements:

```text
server-authoritative decision
consistent UI/API behavior
owner
expiry/removal plan
telemetry segment
```

Do not expose secret rollout logic as client-trusted authorization.

## Background jobs

Required durable job example:

```text
report generation
bulk import
AI processing
email campaign
export
```

Architecture:

```text
request/action
→ persist job
→ queue
→ worker
→ progress/result
→ notification/cache refresh
```

Do not use `after()` as a substitute for durable work that must survive process loss.

## Job idempotency

Workers must tolerate retries.

Persist job state and ensure side effects are idempotent.

Test duplicate delivery.

## Audit log

Capture meaningful security/business events:

```text
member invited
role changed
resource deleted
plan changed
admin support action
API key created/revoked
```

Audit records should answer who, what, where/tenant, when, and outcome without storing unnecessary secrets.

## API keys

Optional advanced requirement:

```text
create key once
store hash/identifier
scope permissions
last-used timestamp
revoke
rate limit
```

Never display the full secret again after creation.

## Cache architecture

Tenant identity must be part of every tenant-dependent cache contract.

Test:

```text
tenant A cache warm
request tenant B same resource ID shape
→ never receives A data
```

## Search

If using external search, index tenant identity and enforce tenant filters server-side.

Client-supplied tenant filters are not a security boundary.

## File storage

Use object storage for uploads.

Requirements:

```text
tenant-scoped object keys
bounded upload size/type
signed capabilities
safe download authorization
no permanent public URL for private content unless intentional
```

## Admin/support architecture

Support capabilities must be explicit and auditable.

Avoid hidden “isAdmin=true bypass everything” code.

For impersonation, require a deliberate design with clear banner, audit log, expiry and restricted actions.

## Observability

Telemetry should include:

```text
tenant-safe identifier
route/use-case
release
latency
DB/cache/provider spans
job state
business result
error class
```

Avoid raw sensitive customer content.

## SLOs

Define example service objectives:

```text
interactive route availability
p95 API/action latency
job completion latency
critical error rate
```

Then define alerts tied to user impact.

## Testing

### Security matrix

```text
anonymous
member
admin
owner
wrong tenant
revoked member
expired session
```

for critical reads/writes.

### Integration

```text
membership queries
commands
usage enforcement
job state
outbox/audit
cache invalidation
```

### E2E

```text
sign in → create tenant → invite → accept
role change
resource flow
background job
plan/entitlement restriction
logout/revocation
```

## Deployment

Use production-style dependencies:

```text
DB
cache if needed
queue/worker
object storage
secret manager/env injection
telemetry backend
```

Document health/readiness and failure behavior when each dependency is unavailable.

## Required ADRs

```text
tenancy model
authorization architecture
background job durability
feature flag/entitlement split
cache tenant isolation
admin/support capability
```

## Stretch goals

```text
custom domains
SAML/OIDC enterprise login
SCIM-like provisioning
regional data residency
usage metering
multi-zone frontend
```

## Interview story

Be able to draw the tenant boundary through:

```text
request
→ session
→ membership
→ DAL
→ cache
→ DB
→ job
→ object storage
→ telemetry
```

If any layer can forget the tenant, the architecture is incomplete.