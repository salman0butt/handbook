---
title: Multi-Zones, Micro-Frontends, Team Ownership & Independent Delivery
sidebar_position: 8
description: Use Next.js Multi-Zones and team boundaries deliberately, understanding hard navigations, asset isolation, shared code, release compatibility, and when multiple apps are justified.
---

# Multi-Zones, Micro-Frontends, Team Ownership & Independent Delivery

A large codebase does not automatically need micro-frontends.

The official Next.js Multi-Zones model exists for cases where one domain should be served by multiple independently deployed applications.

That is an operational architecture decision, not a folder-organisation technique.

## 1. Start with a modular monolith

Before splitting deployments, make internal boundaries strong:

```text
one Next.js app
├─ marketing module
├─ dashboard module
├─ billing module
└─ admin module
```

Benefits:

```text
soft navigation across the product
shared runtime/context
simpler local development
one release unit
lower network/compatibility cost
```

Only split when independent deployment creates real value.

## 2. Multi-Zones split one domain into several apps

Conceptually:

```text
example.com/*            → main app
example.com/blog/*       → blog zone
example.com/dashboard/*  → dashboard zone
```

Each zone is a normal Next.js application.

Requests are routed to the correct app through rewrites or external proxy infrastructure.

## 3. Paths must have one owner

Two zones cannot both own the same public path.

Create a route ownership map:

```text
/                  → marketing
/blog/*             → content
/dashboard/*        → product
/admin/*            → operations
```

This map is both architecture and deployment configuration.

## 4. Cross-zone navigation is a hard navigation

Within one zone:

```text
/products → /products/123
```

can use normal Next.js soft navigation.

Across zones:

```text
/blog → /dashboard
```

loads a different application and therefore unloads the current document/runtime.

Frequently visited-together pages should generally live in the same zone.

## 5. Use the right link semantics across zones

The documented Multi-Zones guidance recommends normal anchor navigation for paths owned by another zone rather than expecting Next.js `<Link>` to soft-navigate across applications.

Your navigation component can hide this distinction behind an architecture-aware helper, but the underlying behaviour remains a document navigation.

## 6. Assets must not collide

Different zones may produce their own `/_next` asset sets.

The official approach uses unique `assetPrefix` values for non-default zones so assets resolve to the correct application.

Example concept:

```text
blog app      → /blog-static/_next/...
dashboard app → /dashboard-static/_next/...
```

Asset identity is part of the routing architecture.

## 7. Prefer rewrites for static ownership decisions

If `/blog/*` always belongs to the blog app, static rewrite/routing configuration is easier to reason about than request-time dynamic logic.

Use Proxy only when routing genuinely depends on request-time conditions such as a migration flag or cohort.

Do not add per-request application routing complexity without need.

## 8. Dynamic migration routing is temporary architecture

A strangler migration might use:

```text
/blog/some-path
→ old zone for 90%
→ new zone for migration cohort
```

If Proxy/flag logic is introduced for migration, define its removal condition.

Temporary routing becomes permanent debt surprisingly quickly.

## 9. Shared code does not require one deployment

Zones can share code through:

```text
monorepo workspace packages
private packages
public packages
```

Examples:

```text
design system
auth/session helpers
telemetry mechanics
shared API contracts
```

But shared source does not imply synchronized deployment.

Consumers can run different versions during rollout.

## 10. Independent deployments require compatibility

If zone A and zone B share:

```text
session cookie
API contract
event schema
design-system package
feature flags
```

they must tolerate mixed versions.

Design for:

```text
old A + new B
new A + old B
rollback B while A remains new
```

The more shared runtime assumptions you create, the less independent the zones actually are.

## 11. Authentication across zones

A shared login/session experience requires agreement on:

```text
cookie domain/path
session format
key rotation
auth callback URLs
logout semantics
CSRF/origin assumptions
```

Each application should still enforce its own resource authorization.

Do not make one zone's page guard the security boundary for another zone.

## 12. Server Actions need origin awareness

The official Multi-Zones guidance calls out Server Action origin configuration when several applications serve one user-facing domain.

Treat this as part of deployment security configuration and re-check the current Next.js Server Actions security contract during upgrades.

Do not loosen allowed origins globally to make a multi-zone setup “work.”

## 13. Design-system consistency is a release problem

A shared design-system package helps, but independently deployed zones can temporarily render different versions.

Decide which changes require coordination:

```text
brand tokens
navigation shell
accessibility behaviour
cookie banner
critical account controls
```

Visual consistency cannot rely solely on “same monorepo.”

## 14. Global navigation ownership

If each zone independently implements the global header, divergence is likely.

Options:

```text
shared package
server-rendered shared shell service
duplicated shell with strict contract
one owning zone around common shell where possible
```

Each option trades autonomy against consistency and runtime coupling.

## 15. Avoid distributed global client state

Client state cannot transparently survive a hard navigation into another application unless persisted in a shared external surface such as:

```text
URL
cookie
browser storage
server session
backend state
```

Architect cross-zone user journeys around durable/shared state, not React Context or an in-memory store.

## 16. Team boundaries should match product ownership

A zone boundary is strongest when one team can own:

```text
routes
feature modules
runtime dependencies
telemetry
on-call
release cadence
```

If five teams must coordinate every change across all zones, the split may have created infrastructure without autonomy.

## 17. Avoid splitting by frontend technical layer

Weak zones:

```text
forms app
charts app
buttons app
```

Stronger boundaries usually follow product capabilities or independently navigable surfaces:

```text
marketing
commerce
admin
content
```

The user journey should still guide grouping.

## 18. Build size is not the only reason to split

Multi-Zones can reduce each application's code/build graph.

But first investigate:

```text
large shared packages
client graph pollution
poor build caching
unnecessary imports
route/package ownership
```

Splitting deployments is a major response to what may be a local dependency problem.

## 19. Failure isolation can justify zones

Example:

```text
content publishing deploy fails
→ customer dashboard remains deployable/running
```

This is meaningful if the infrastructure and routing layers are also independently resilient.

A shared reverse proxy, auth service, database, or CDN can still be a common failure domain.

## 20. Multi-Zones do not create backend isolation automatically

Two Next.js applications can still share one database and mutate the same tables.

If independent domain ownership is required, define data write ownership separately.

Frontend deployment boundaries and domain/service boundaries are not the same thing.

## 21. Observability across zones

Use common correlation fields:

```text
request/trace ID
zone/application ID
release ID
user journey/route
```

A cross-zone navigation should still be diagnosable as one user journey even though it crosses deployments.

## 22. Shared telemetry vocabulary

Global events such as:

```text
user.signed_in
navigation.started
consent.changed
```

need stable schemas if several applications emit them.

Feature-specific events should remain owned by their capability.

## 23. Local development needs routing realism

A multi-zone development environment should test:

```text
same host/path routing
asset prefixes
cross-zone links
auth cookies
callback URLs
rewrites/proxy
```

Running each app independently on unrelated localhost URLs is not enough to prove production composition.

## 24. Testing cross-zone journeys

Critical E2E scenarios:

```text
marketing → sign in → dashboard
blog → product CTA → application
logout from one zone → session invalid in another
shared feature flag consistent enough for rollout
old/new zone mixed-version compatibility
```

Cross-zone E2E is where hard-navigation and shared-session assumptions become visible.

## 25. Alternatives to Multi-Zones

Before choosing multiple Next.js apps, consider:

```text
route groups
feature modules
monorepo packages
separate backend services with one frontend
independent static site on another subdomain
```

Choose the smallest boundary that solves the actual problem.

## 26. Decision framework

A zone split is stronger when several are true:

```text
independent team
independent release cadence
low cross-navigation frequency
large isolated dependency graph
separate failure domain
clear URL ownership
clear runtime/data dependencies
```

A split is weaker when:

```text
pages are frequently navigated together
session/global state is tightly coupled
teams change both apps together
one shared DB model changes constantly
UI shell must deploy atomically
```

## 27. Senior review questions

### Why are cross-zone navigations hard navigations?

Because the destination belongs to another Next.js application/runtime, so the current document and client runtime are replaced rather than reconciled through the same App Router.

### Does a monorepo eliminate Multi-Zone compatibility issues?

No. A monorepo helps source sharing and coordination, but independently deployed apps can still run different versions.

### When is Multi-Zone better than one modular app?

When independent ownership/deployment/failure/build boundaries outweigh the cost of hard navigation and distributed compatibility.

## Production checklist

- [ ] each public path has one zone owner
- [ ] frequently connected user journeys are not split casually
- [ ] cross-zone navigation uses correct hard-navigation semantics
- [ ] asset prefixes/routing are collision-free
- [ ] auth/session compatibility is explicit
- [ ] Server Action origin policy is correct
- [ ] shared packages tolerate mixed versions
- [ ] global client state does not assume one runtime
- [ ] team/on-call ownership matches deployment ownership
- [ ] cross-zone E2E and observability exist
- [ ] the split has a measurable reason beyond repository aesthetics

## Exercise

A company wants to split one Next.js application into:

```text
marketing
blog
dashboard
admin
```

Decide which surfaces should actually become separate zones. Evaluate navigation frequency, ownership, build size, auth, data coupling, failure isolation, and rollout independence.
