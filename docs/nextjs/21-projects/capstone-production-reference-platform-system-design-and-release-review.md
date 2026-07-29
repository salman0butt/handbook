---
title: Capstone — Production Reference Platform, System Design & Release Review
sidebar_position: 5
description: Assemble the full handbook into one production reference system with modular architecture, distributed dependencies, release engineering, failure drills, and senior design review.
---

# Capstone — Production Reference Platform, System Design & Release Review

This final project is the synthesis capstone.

Build a product substantial enough to require several capabilities at once, for example:

```text
multi-tenant AI operations platform
marketplace with admin and billing
travel booking + partner portal
B2B analytics product
workflow automation platform
```

The goal is to prove that you can make system-level decisions under competing constraints.

## Required system shape

At minimum:

```text
browser
→ CDN/reverse proxy
→ Next.js App Router application
   ├─ Server Components
   ├─ Server Actions
   ├─ Route Handlers
   └─ Proxy
→ relational database
→ cache
→ object storage
→ queue/worker
→ external provider
→ telemetry stack
```

You may keep everything in one deployable monolith if that is the better design. Distributed architecture is not a scoring bonus by itself.

## Capability map

Create 4–6 product capabilities, for example:

```text
identity
workspace
projects
billing
reports
automations
```

Each capability must define:

```text
public API
DAL/query ownership
commands
DTOs
cache ownership
telemetry vocabulary
tests
team/maintainer owner
```

## Route composition

Routes should compose capabilities instead of reaching directly into their internals.

Example:

```text
app/(dashboard)/projects/[id]/page.tsx
→ project query API
→ billing summary API
→ activity query API
```

Cross-capability calls should be deliberate and reviewable.

## Package/monorepo option

If using a monorepo, separate only boundaries with stable ownership value.

Example:

```text
apps/web
packages/ui
packages/auth
packages/telemetry
packages/domain-projects
packages/config
```

Use explicit package exports and environment-specific entry points where helpful.

## Server/client design

For every major route, document:

```text
server-owned reads
client interaction islands
serialized DTOs
browser-only dependencies
streaming boundaries
```

Track client JavaScript budgets by route.

## Rendering map

Classify route/subtree behavior:

```text
prerendered shell
cached server output
request-time authenticated region
streamed optional panel
pure client interaction
```

Do not label the whole application “SSR” or “static.”

## Cache map

Document every cache layer:

```text
browser
CDN
Next server response/data
Cache Components
shared cache backend
client Router Cache
```

For each:

```text
identity
lifetime
invalidation
failure mode
security boundary
owner
```

## Data consistency model

Classify workflows:

```text
strong transaction required
eventual consistency acceptable
read-your-writes expected
stale-while-revalidate acceptable
```

Do not use eventual consistency merely because a queue exists.

## Background processing

Implement at least one durable workflow with:

```text
queue
retry/backoff
idempotency
DLQ
status tracking
operator recovery
```

Expose job progress to users without polling waste if a better strategy is justified.

## External provider resilience

One dependency should support:

```text
timeout
bounded retry
circuit/degradation policy
provider-specific error translation
telemetry
sandbox testing
```

The product should remain usable where the provider is noncritical.

## Security architecture

Produce a threat model covering:

```text
authentication
session theft
IDOR/BOLA
cross-tenant access
CSRF
XSS
SSRF
uploads
webhooks
API keys
secrets
admin/support access
logs/telemetry
```

Rank threats by likelihood × impact and document mitigations.

## Performance architecture

Define route budgets and diagnose with evidence.

Include:

```text
RUM/Core Web Vitals
server p95/p99
DB query count/latency
cache hit rate
client JS
third-party cost
memory/capacity
```

At least one optimization must show before/after measurements.

## Accessibility architecture

Include an accessibility review of critical journeys:

```text
keyboard
focus
semantic structure
forms/errors
dialogs
loading announcements
responsive zoom
```

Automated checks are not enough; document manual review.

## Observability architecture

Use correlated telemetry:

```text
request ID / trace ID
release ID
route
use case
external dependency
job ID
safe tenant identifier
error class
```

Create a dashboard/runbook for one critical journey.

## Incident drill

Run at least two failure drills, for example:

```text
DB latency spike
cache outage
provider timeout
queue backlog
bad release
webhook storm
```

Record:

```text
symptom
alert
triage path
mitigation
rollback/degrade action
post-incident fix
```

## Deployment architecture

Document:

```text
immutable artifact
container/serverless target
reverse proxy/CDN
secrets
migrations
cache/storage/queue
health/readiness
autoscaling
release strategy
rollback
backup/restore
```

## Rolling deployment compatibility

Show how old/new versions coexist for:

```text
DB schema
cache schema
static assets
Server Actions
API/event contracts
feature flags
```

Use expand/contract where needed.

## CI/CD

Required gates:

```text
lint
typecheck
unit tests
integration tests
production build
targeted E2E
security checks appropriate to project
artifact build
staging/canary smoke test
```

Use failure artifacts such as traces/screenshots/build logs.

## Architecture decision records

Minimum five ADRs.

Suggested:

```text
modular monolith vs services
Server Actions vs HTTP APIs
cache strategy
queue/workflow design
tenancy model
deployment topology
```

## Architecture fitness functions

Automate at least two architecture rules.

Examples:

```text
client package cannot import server-only modules
feature modules cannot deep-import another feature's internals
tenant-sensitive DAL always requires tenant context
bundle budget cannot exceed threshold
```

## Release review

Before declaring the capstone done, hold a written release review.

Questions:

```text
What can fail independently?
What is the highest security risk?
Which route is slowest and why?
How does stale data become fresh?
What happens if the queue is unavailable?
How is a bad deploy rolled back?
What data is unrecoverable if storage is lost?
```

## Staff-level extension

Propose how the architecture changes at 10× scale.

Consider:

```text
team count
traffic
DB size
tenant count
regional requirements
compliance
provider spend
release frequency
```

Do not automatically answer “microservices.”

## Portfolio presentation

Create a 10-minute walkthrough:

```text
1 min product problem
2 min architecture
2 min hardest invariant/security decision
2 min performance/observability evidence
2 min failure/release story
1 min future trade-offs
```

## Final evaluation

The capstone should demonstrate:

```text
framework depth
backend correctness
frontend quality
security ownership
operational maturity
architectural judgement
communication
```

If you can operate, debug, migrate, and defend this system, you have converted handbook knowledge into senior-level evidence.