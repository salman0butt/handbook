---
title: Project Ladder, Delivery Standards & Evaluation Rubric
sidebar_position: 1
description: Turn Next.js knowledge into production-grade portfolio evidence through escalating projects, explicit nonfunctional requirements, release gates, and architecture reviews.
---

# Project Ladder, Delivery Standards & Evaluation Rubric

Projects should prove that you can ship systems, not that you can copy APIs from documentation.

Every project in this phase is evaluated across the same dimensions:

```text
product correctness
routing/rendering
server/client ownership
data integrity
security
caching/freshness
performance
accessibility
testing
observability
deployment
architecture
```

## The ladder

### Level 1 — Read-heavy public product

Focus:

```text
routing
RSC
metadata
search params
cache/revalidation
images/fonts
SEO
```

### Level 2 — Transactional product

Add:

```text
Server Actions
forms
validation
idempotency
transactions
optimistic UI
external integrations
```

### Level 3 — Multi-tenant SaaS

Add:

```text
authentication
authorization
tenant isolation
jobs
feature flags
billing-like lifecycle
operational tooling
```

### Level 4 — Production reference capstone

Add:

```text
monorepo/package boundaries
multiple services/adapters
distributed cache/state
deployment strategy
SLIs/SLOs
incident readiness
architecture decision records
```

## Standard repository expectations

Every capstone should contain:

```text
README
architecture diagram
setup instructions
.env.example
schema/migration docs
seed strategy
test strategy
runbook
ADR folder
CI workflow
production deployment notes
```

## README quality bar

A senior README should answer:

1. What problem does the product solve?
2. Who uses it?
3. What are the critical user journeys?
4. What is the architecture?
5. Why were the major trade-offs chosen?
6. How do you run it locally?
7. How do you test it?
8. How is it deployed?
9. What are known limitations?
10. What would you improve next?

## Architecture diagram requirement

At minimum, diagram:

```text
browser
→ Next.js route tree
→ server reads / actions / handlers
→ database
→ cache
→ external providers
→ queue/worker
→ telemetry
```

For multi-tenant projects, show tenant identity and authorization boundaries explicitly.

## Functional requirements are not enough

For each project define nonfunctional targets.

Example:

```text
LCP target
INP target
p95 route latency
availability goal
accessibility baseline
security invariants
cache freshness target
```

The exact numbers can be project-specific.

## Data contract requirement

Every important entity should have:

```text
canonical storage model
viewer DTO
mutation input schema
ownership/authorization rule
cache identity
lifecycle states
```

Avoid leaking ORM entities directly through the UI boundary.

## Mutation contract requirement

For every state-changing operation define:

```text
who may invoke it
input validation
transaction boundary
idempotency behavior
side effects
cache invalidation
expected errors
observability event
```

## Testing ladder

Each capstone should include:

```text
unit tests for pure policy/domain logic
integration tests for data access/commands
contract tests for Actions/Handlers
browser E2E for critical journeys
security negative tests
accessibility checks
performance regression checks where useful
```

## Security baseline

Required across relevant projects:

```text
server-side authorization
CSRF-safe mutation model
XSS-safe rendering/structured data
safe redirects
secret isolation
rate/resource limits where public input is expensive
tenant isolation for SaaS
webhook signature verification where used
```

## Performance baseline

Measure at least:

```text
client JS by route
Core Web Vitals in browser/lab
server route latency
DB query count for critical paths
cache hit/miss behavior
third-party script impact
```

## Accessibility baseline

Critical journeys should work with:

```text
keyboard
visible focus
semantic controls
accessible names
form error association
reduced-motion expectations where relevant
```

## Observability baseline

Every production-style project should expose enough telemetry to answer:

```text
Which route failed?
Which release?
Which use case?
Which tenant/user scope without leaking sensitive data?
Which external dependency?
Was the failure client, server, database, cache, or provider?
```

## CI baseline

A strong pipeline includes:

```text
install with lockfile
lint
typecheck
unit/integration tests
production build
targeted E2E
artifact/image build
optional deployment preview
```

## Deployment baseline

Document:

```text
artifact strategy
runtime environment
environment variables/secrets
DB migration ownership
cache/storage dependencies
health/readiness
rollback method
```

## ADRs

Create ADRs for real trade-offs, for example:

```text
ADR-001 Server Actions vs Route Handlers
ADR-002 cache strategy
ADR-003 tenancy model
ADR-004 queue/outbox choice
ADR-005 deployment topology
```

Each ADR should include:

```text
context
decision
alternatives
consequences
review date if temporary
```

## Evaluation rubric

Score each area 0–3.

### 0 — missing
No meaningful implementation.

### 1 — functional
Works in basic cases but lacks production reasoning.

### 2 — production-aware
Correct boundaries, tests, failure handling, security, and deployment thinking.

### 3 — senior
Explains trade-offs, handles edge cases, provides evidence, and keeps architecture evolvable.

Areas:

```text
routing/rendering
data ownership
mutations
security
caching
performance
testing
observability
deployment
architecture
communication/documentation
```

A strong capstone should average at least **2**, with no zero in security or correctness.

## Interview use

For every project prepare three stories:

```text
architecture decision
hard production/debugging problem
trade-off you would change at larger scale
```

Use evidence:

```text
before/after latency
bundle size
cache hit rate
test coverage of critical flows
incident reduction
release safety
```

Do not describe only technologies.

## Final delivery checklist

- [ ] live deployment or reproducible production artifact
- [ ] public or reviewable repository
- [ ] meaningful README
- [ ] architecture diagram
- [ ] seeded demo path
- [ ] critical E2E suite
- [ ] security invariants documented
- [ ] performance evidence
- [ ] observability/runbook
- [ ] ADRs
- [ ] known limitations

The project phase is complete only when the work can be explained, operated, and defended—not merely demonstrated.