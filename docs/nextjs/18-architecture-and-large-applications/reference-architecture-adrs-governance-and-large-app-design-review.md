---
title: Reference Architecture, ADRs, Governance & Large-App Design Review
sidebar_position: 9
description: Combine App Router, domain modules, DALs, commands, events, packages, tenancy, deployment boundaries, ADRs, and governance into a senior reference architecture.
---

# Reference Architecture, ADRs, Governance & Large-App Design Review

A large Next.js application needs a shared mental model more than it needs one “perfect” folder tree.

This chapter assembles the previous phases into one production architecture and a review process senior engineers can use before complexity becomes irreversible.

## 1. Reference architecture

```text
Browser
  ↓
CDN / proxy / load balancer
  ↓
Next.js App Router
  ├─ route/layout composition
  ├─ Server Components
  ├─ Client islands
  ├─ Server Actions
  └─ Route Handlers
       ↓
Application layer
  ├─ queries
  ├─ commands
  ├─ policies
  └─ DTOs
       ↓
Domain/infrastructure boundaries
  ├─ database
  ├─ cache
  ├─ object storage
  ├─ providers
  ├─ queue/events
  └─ observability
```

Cross-cutting context:

```text
identity
tenant
release
request/trace ID
feature snapshot
locale
```

## 2. Example repository

```text
apps/
  web/
    src/
      app/
        (marketing)/
        (app)/
        api/
      features/
        identity/
        projects/
        billing/
        reporting/
      core/
        config/
        db/
        cache/
        queue/
        observability/
  admin/
packages/
  ui/
  auth-mechanics/
  telemetry/
  contracts/
```

This is a reference, not a framework requirement.

## 3. Request lifecycle example

A project detail request:

```text
GET /projects/p_123
→ route resolves params
→ verify session
→ resolve active tenant
→ project DAL queries tenant-scoped row
→ DTO projects safe fields/capabilities
→ Server Component renders
→ narrow Client editor hydrates
→ telemetry attaches release/request context
```

Every step has an owner.

## 4. Mutation lifecycle example

Rename project:

```text
Client form
→ Server Action parses FormData
→ verify identity
→ renameProject command
   ├─ validate
   ├─ authorise
   ├─ transaction
   ├─ audit/outbox
   └─ result
→ revalidate project/list
→ return state / redirect / refresh
```

The Action adapts transport; the command owns business meaning.

## 5. Durable side-effect lifecycle

```text
renameProject transaction
→ outbox ProjectRenamed
→ worker publishes/processes
→ search index update
→ CRM sync if needed
→ analytics projection
```

A failed CRM sync should not roll back the already committed project rename unless the product explicitly requires that coupling.

## 6. Ownership matrix

For every capability, maintain a lightweight map:

| Concern | Projects | Billing | Identity |
| --- | --- | --- | --- |
| Routes | `/projects/*` | `/billing/*` | `/login`, account |
| Tables | projects, members | invoices, plans | sessions/users |
| Commands | create/archive | pay/change-plan | sign-out/revoke |
| Events | project.* | invoice.* | session.* |
| Cache | project tags | billing tags | session/request cache |
| Team | Projects | Revenue | Platform Identity |

This makes cross-domain changes visible.

## 7. Use Architecture Decision Records

An ADR records a meaningful decision and why it was made.

Example:

```text
ADR-014: Keep Billing in modular monolith
Status: accepted
Context: billing traffic low; strong DB coupling; one team
Decision: package/module boundary only
Consequences: no independent deploy; simpler transactions
Revisit when: independent scaling/team/compliance requirement appears
```

ADRs prevent future teams from reverse-engineering intent from code.

## 8. Record alternatives, not only outcomes

A useful ADR includes:

```text
context
constraints
options considered
decision
trade-offs
migration/revisit trigger
```

Avoid writing propaganda that claims the chosen option has no disadvantages.

## 9. Architecture fitness functions

A fitness function continuously checks an architectural property.

Examples:

```text
no client imports from server-only package
no feature imports another feature's internal path
bundle budget per route
cross-tenant security regression
API compatibility test
build-time threshold
circular dependency check
```

Automated architecture is more durable than wiki rules alone.

## 10. Governance should preserve autonomy

Too little governance creates divergence.

Too much governance creates a central architecture bottleneck.

A useful split:

```text
central platform owns standards/mechanics
domain teams own product implementation
high-risk cross-domain decisions require ADR/review
```

## 11. Define golden paths

A golden path is the easiest approved way to do common work.

Examples:

```text
new feature module template
new Route Handler security template
new queue consumer template
new telemetry event pattern
new DB migration workflow
```

The safe path should be easier than bypassing the architecture.

## 12. Avoid architecture committees for local decisions

A team should not need company-wide approval to add a local component.

Reserve architecture review for decisions with broad consequences:

```text
new service
new data store
new cross-domain API
new shared package
new deployment zone
new auth model
new public event schema
```

## 13. Define change blast radius

For a proposed change, ask:

```text
Which routes?
Which packages?
Which tables?
Which cache keys?
Which events/APIs?
Which deployments?
Which teams?
Which user journeys?
```

A change touching everything signals weak boundaries.

## 14. Define failure blast radius

If Reporting fails:

```text
Does checkout fail?
Does login fail?
Does the whole deployment restart?
Does DB pool exhaustion spread?
```

Architecture should make critical and optional dependencies explicit.

## 15. Define data authority

For every important field, ask:

> Which system is the source of truth?

Example:

```text
subscription status → Billing
project membership   → Projects/Identity contract
search document      → derived projection
analytics record     → derived event sink
```

Derived stores should not silently become write authorities.

## 16. Define consistency expectations

Not every datum needs immediate consistency.

```text
payment result       → strong/transactional
permission revocation→ very fresh/authoritative
search index         → eventual
analytics dashboard  → eventual
email delivery       → eventual durable
```

Architecture decisions should name the consistency contract.

## 17. Define latency budgets by boundary

A user journey can have budgets such as:

```text
route p95 500ms server time
DB query p95 80ms
provider p95 300ms
background export ≤ 5 min
```

Without budgets, distributed dependencies accumulate unnoticed.

## 18. Define security boundaries

Review:

```text
public HTTP endpoints
Server Actions
DAL
admin tools
queue consumers
webhooks
object storage
provider callbacks
```

Every privileged boundary needs explicit identity, authorization, validation, and audit expectations.

## 19. Define cache ownership

For each cache family:

```text
key owner
freshness owner
invalidation owner
tenant/user dimensions
failure mode
observability
```

A “platform cache team” cannot determine product freshness semantics without domain input.

## 20. Define operational ownership

A deployable application/service/zone needs:

```text
on-call owner
SLO
runbook
dashboards
alerts
deployment path
rollback path
dependency inventory
```

Independent deployment without independent operational ownership creates organisational ambiguity.

## 21. Architecture and team topology influence each other

High communication cost often appears where code/data ownership cuts across teams.

Prefer boundaries that let one team complete a product change without coordinating with many unrelated teams.

But do not contort the domain solely around the current org chart; organisations change too.

## 22. Large feature implementation checklist

Before building a new capability, answer:

```text
route ownership
data model
read API/DAL
write commands
security model
cache/freshness
client boundary
background work
external integrations
telemetry
tests
rollout flag
migration/deployment plan
owner
```

This catches architectural gaps before implementation spreads.

## 23. New service checklist

Before extracting a service, require concrete answers:

```text
Why independent deployment?
Which data does it own?
Who writes that data?
What API/event contracts exist?
How are identity/auth handled?
How are retries/idempotency handled?
How is it observed?
How is local development done?
How is rollback/compatibility handled?
Who operates it?
```

If these answers are weak, keep a module boundary first.

## 24. New shared package checklist

Ask:

```text
Who are the real consumers?
What is the supported public API?
Server or client?
Can consumers release independently?
Who owns compatibility?
What dependency direction does it create?
```

Do not create `shared` because ownership is unclear.

## 25. New zone/micro-frontend checklist

Ask:

```text
Is path ownership clean?
How often do users cross the boundary?
Can hard navigation be accepted?
Is auth/session compatible?
Are assets isolated?
Can teams release independently?
Does data ownership also need separation?
```

## 26. Architecture review format

A practical review document can be short:

```text
Problem
Constraints
Current state
Proposed boundaries
Data flow
Failure modes
Security
Performance/capacity
Consistency
Deployment/migration
Observability
Testing
Alternatives
Decision/revisit trigger
```

The quality is in the reasoning, not the page count.

## 27. Avoid speculative architecture

Do not add:

```text
Kafka
microservices
five caches
multiple zones
service mesh
complex CQRS
```

because a future scale problem might appear.

Choose structures that solve current constraints while keeping migration paths open.

## 28. Preserve reversibility

Early decisions should be cheap to change where possible.

Examples:

```text
module boundary before service boundary
adapter around provider
DTO instead of raw DB type
outbox before many direct provider side effects
feature flag for risky rollout
```

Reversible architecture buys learning time.

## 29. Evolution path

A healthy application may evolve:

```text
single App Router app
→ feature modules
→ workspace packages
→ dedicated workers
→ selected backend services
→ selected zones
```

Not every system needs to reach the final stages.

Complexity should be earned by requirements.

## 30. Senior system-design questions

### How would you structure a 100-engineer Next.js application?

Start from product capabilities, explicit module/package APIs, team ownership, secure DAL/command boundaries, shared platform primitives, automated dependency rules, and independent deployment only where operational independence is valuable.

### How do you avoid a monolith becoming a big ball of mud?

Use internal modularity: clear data/write ownership, feature public APIs, dependency direction, tests, architecture checks, and bounded cross-feature communication.

### How do you know when architecture is working?

Teams can make product changes with predictable blast radius, security/freshness rules have clear owners, failures are diagnosable, and repository/deployment complexity grows slower than product capability.

## Final Phase 18 design review

A large application is architecturally healthy when:

- [ ] product capabilities have explicit owners
- [ ] routes and business modules are distinct but aligned
- [ ] server/client/trust boundaries are deliberate
- [ ] DALs and commands centralize authoritative policy
- [ ] DTOs protect exposure boundaries
- [ ] monorepo packages have explicit APIs and direction
- [ ] tenant identity crosses every stateful layer safely
- [ ] HTTP/events/jobs represent real boundaries
- [ ] flags/config/state have lifecycle and owners
- [ ] Multi-Zones/services are justified by independence
- [ ] compatibility supports mixed-version rollout
- [ ] cache/data/event authorities are documented
- [ ] architecture rules are partly automated
- [ ] ADRs capture important decisions and revisit triggers
- [ ] every deployable boundary has operational ownership
- [ ] architecture remains as simple as current requirements allow

## Capstone exercise

Design a global multi-tenant SaaS with:

```text
marketing site
customer dashboard
admin portal
projects
billing
AI reporting
custom domains
background exports
webhooks
search
object storage
three engineering teams
```

Produce:

1. route tree
2. feature/module map
3. monorepo package graph
4. server/client boundaries
5. DAL/command boundaries
6. tenant flow
7. API/event/job map
8. cache/freshness ownership
9. deployment boundaries
10. team ownership
11. rollout/migration strategy
12. ADRs for the three highest-risk decisions
