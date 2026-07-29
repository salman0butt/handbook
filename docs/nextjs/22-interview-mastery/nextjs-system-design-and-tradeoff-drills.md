---
title: Next.js System Design & Trade-Off Drills
sidebar_position: 4
description: Structure senior Next.js system-design answers across requirements, route ownership, data, caching, mutations, security, jobs, observability, deployment, and scale.
---

# Next.js System Design & Trade-Off Drills

A Next.js system-design interview is not a test of how many framework features you can draw.

It is a test of whether you can map product constraints onto the right boundaries.

## 1. Start with requirements

Clarify:

```text
users / tenants
public vs authenticated content
read/write ratio
latency target
freshness target
availability target
external consumers
regional/compliance needs
```

Then identify critical journeys.

## 2. Draw the capability map

Example SaaS:

```text
identity
workspace
projects
billing
reports
integrations
```

Routes compose these capabilities; folders do not define business ownership automatically.

## 3. Draw the request path

```text
browser
→ CDN/proxy
→ Next.js Proxy if matched
→ route tree / Route Handler
→ DAL/command
→ DB/cache/provider
→ RSC/HTTP response
```

Add queue/worker for durable async work.

## 4. Choose server/client ownership

Ask for each UI region:

```text
Does it need browser state/API?
Does it contain secrets or canonical reads?
Can it render as a Server Component?
How much JS would a client boundary pull in?
```

Default server-first, then add narrow interactive islands.

## 5. Design reads

Options:

```text
Server Component → DAL
Route Handler → public HTTP API
client data library → browser-owned live/refetching behavior
```

Avoid own HTTP hops for ordinary server-owned reads.

## 6. Design writes

```text
UI mutation → Server Action → command
external/public/mobile mutation → Route Handler → command
background consequence → queue/worker
```

Commands own business invariants.

## 7. Model authorization

For each resource:

```text
actor
session
role/capability
tenant
resource owner/relationship
```

Authorization should be enforced server-side where data is accessed or mutated.

## 8. Model cache identity

Ask:

```text
What makes this result unique?
What makes sharing safe?
How fresh must it be?
Who invalidates it?
```

Never say “cache by URL” without checking auth, headers, locale, tenant and query dimensions.

## 9. Cache hierarchy

Discuss separately:

```text
browser/HTTP cache
CDN
Next server cache
Cache Components storage
shared app cache
Router Cache
```

Different layers have different invalidation and security rules.

## 10. Streaming design

Use Suspense around independently slow regions.

Example dashboard:

```text
cached navigation shell
├─ account summary
├─ project list
└─ streamed analytics panel
```

Do not stream a critical invariant that must be known before showing the action UI unless product UX supports it safely.

## 11. Public catalog design drill

Requirements:

```text
SEO
search/filter
large read volume
content updates every few minutes
```

Likely choices:

```text
RSC public routes
URL search params
cached category/detail reads
tag invalidation
metadata/sitemap
search provider or indexed DB queries
small client interaction layer
```

Discuss search cardinality before caching every query.

## 12. Checkout/booking drill

Requirements:

```text
scarce inventory
payment provider
retries/webhooks
```

Core design:

```text
Server Action/Handler
→ command
→ DB transaction/constraint
→ idempotency
→ provider adapter
→ webhook reconciliation
→ outbox/job for secondary work
```

Freshness optimization never replaces the final transactional invariant check.

## 13. Multi-tenant dashboard drill

Core boundary:

```text
host/URL/session tenant hint
→ membership verification
→ tenant-scoped DAL
→ tenant-aware cache key
→ DTO
```

Jobs, search and object storage also carry tenant scope.

## 14. File-upload drill

Prefer direct object-storage upload with signed capability when appropriate.

Model:

```text
request upload permission
→ validate tenant/user/type/size policy
→ issue short-lived signed upload
→ client uploads
→ finalize/scan/process
```

Do not buffer large files through the app server without a reason.

## 15. Real-time feature drill

Clarify what “real-time” means:

```text
sub-second collaboration?
seconds-level notifications?
periodic refresh acceptable?
```

Next.js may own the UI and HTTP boundaries while a separate realtime service/provider owns persistent sockets.

Do not force every system through Route Handlers if the connection model needs dedicated infrastructure.

## 16. Search architecture drill

Small dataset:

```text
DB indexed query may be enough
```

Large relevance/search feature:

```text
search index/provider
→ async indexing pipeline
→ tenant/security filters
→ eventual consistency contract
```

Explain reindex/reconciliation.

## 17. Analytics/reporting drill

Interactive dashboard reads should not run unbounded OLTP queries.

Possible progression:

```text
optimized indexed queries
→ precomputed summaries
→ background report jobs
→ analytical store
```

Choose based on data size and freshness.

## 18. External API boundary drill

If a mobile app consumes the system:

```text
Route Handlers / dedicated backend API
```

become a real contract.

Versioning, auth, rate limits and backward compatibility matter.

Do not expose Server Action transport as the public mobile API.

## 19. Failure-domain analysis

For each dependency ask:

```text
If it is down, what fails?
Can we degrade?
Can we queue?
Can we serve stale safely?
What user message appears?
```

Example:

```text
recommendation provider down
→ hide recommendations
→ checkout still works
```

## 20. Capacity analysis

Discuss:

```text
request rate
concurrency
DB pool
cache throughput
worker concurrency
external API quota
memory
payload size
```

Avoid “autoscaling solves it” when the database pool is the bottleneck.

## 21. Deployment design

Describe:

```text
next build artifact
runtime target
CDN/reverse proxy
secret injection
DB migrations
cache/queue/storage
health/readiness
rolling/canary release
rollback
```

## 22. Version-skew design

During rolling deploy:

```text
old browser assets/actions
old app instances
new app instances
shared DB/cache
```

must coexist safely.

Mention deployment/build IDs, asset retention, compatible Server Action setup, expand/contract schemas and versioned cache formats where relevant.

## 23. Observability design

For critical journeys trace:

```text
browser request
→ Next route/use case
→ DB/cache/provider
→ job/event
```

Use route/release/dependency dimensions and avoid unbounded sensitive cardinality.

## 24. Cost is a design constraint

Discuss:

```text
CDN/cache hit rate
image optimization volume
server CPU/memory
DB load
search provider usage
AI/provider spend
queue retention
telemetry volume
```

Performance architecture often affects cost architecture.

## 25. When to split services

Keep a modular monolith until a real constraint appears:

```text
independent scaling
failure isolation
technology/runtime mismatch
regulatory boundary
team release autonomy
```

A folder boundary can exist long before a deployment boundary.

## 26. Multi-Zones

Use when independent Next.js applications need path ownership and deployment autonomy.

Trade-offs include:

```text
hard navigation across zones
asset prefix coordination
session/auth compatibility
mixed-version behavior
shared design-system/package governance
```

Not the default answer to “large app.”

## 27. Whiteboard close

Finish with:

```text
biggest risk
first bottleneck at 10×
security invariant
rollback strategy
what you intentionally did not build
```

This shows prioritization.

## System-design scoring rubric

A strong answer covers:

```text
requirements
boundaries
data model
correctness
security
freshness
failure
scale
operations
trade-offs
```

Framework features should appear only when they solve one of those concerns.