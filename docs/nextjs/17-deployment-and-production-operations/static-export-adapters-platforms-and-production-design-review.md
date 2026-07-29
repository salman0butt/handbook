---
title: Static Export, Adapters, Platforms & Production Design Review
sidebar_position: 9
description: Choose between Node hosting, static export, managed platforms, and custom adapters; understand unsupported static features, stable adapter surfaces, platform capability checks, and senior production architecture review.
---

# Static Export, Adapters, Platforms & Production Design Review

The final deployment decision is not “Vercel or Docker.”

The real decision is:

> Which runtime and platform primitives does this application require, and which deployment model satisfies them with acceptable complexity, cost, control, and reliability?

## 1. Four broad deployment choices

```text
managed Next.js platform
self-hosted Node/container
static export
custom adapter/platform integration
```

Each removes some responsibilities and introduces others.

## 2. Managed platform

Advantages can include:

- framework-aware build/deploy integration
- CDN and routing
- server/runtime scaling
- cache integration
- image optimization
- deployment previews
- observability integrations

Trade-offs can include:

- platform pricing
- runtime constraints
- provider-specific behaviour
- portability concerns

Label provider-specific behaviour clearly; Next.js core and a hosting platform are not identical concepts.

## 3. Self-hosted Node/container

Best fit when you need:

- full infrastructure control
- custom networking
- specific compliance/runtime requirements
- existing Kubernetes/container platform
- custom cache/storage topology

But you own:

- reverse proxy/load balancer
- scaling
- caches
- streaming support
- graceful shutdown
- version skew
- security patches
- observability plumbing
- on-call operations

Control is not free.

## 4. Static export

Configure:

```js
module.exports = {
  output: 'export',
}
```

`next build` generates static output into:

```text
out/
```

which can be hosted on a conventional static web server/CDN/object-storage website host.

## 5. Static export mental model

```text
build has all required route output
→ no Next.js server at request time
```

This can be excellent for:

- marketing sites
- documentation
- public catalogues with build-time data
- SPAs that call external APIs directly

when server runtime features are not required.

## 6. Unsupported static runtime features

Current App Router static-export guidance excludes server-dependent features such as:

- redirects requiring Next runtime
- headers requiring Next runtime
- Proxy
- ISR
- default runtime Image Optimization
- Draft Mode
- Server Actions
- Intercepting Routes
- other request-time dynamic features

Do not enable `output: 'export'` and then attempt to rebuild missing server capabilities manually inside random client code.

Choose the correct deployment model instead.

## 7. Static image handling

The default Next image optimizer is runtime server functionality.

For static export, use an appropriate custom loader/external image service or another static-compatible strategy.

Phase 12 covers image API details; Phase 17 asks who operates the optimizer.

## 8. Static routing

The static host must map URLs to emitted files correctly.

For example, `trailingSlash` strategy affects whether output resembles:

```text
/about.html
```

or:

```text
/about/index.html
```

Configure CDN/web-server rewrites accordingly.

## 9. Static deployment is still production engineering

You still need:

- immutable asset caching
- HTML cache invalidation
- TLS
- DNS
- CSP/security headers where host supports them
- deployment atomicity
- rollback
- monitoring

Static does not mean operations-free.

## 10. Serverless/platform deployment

A platform may decompose one Next.js build into:

```text
static assets
server functions
edge/proxy functions
cache entries
routing configuration
```

Verify capabilities against official Next.js deployment requirements, particularly:

- streaming
- Server Actions
- shared cache
- PPR
- image optimization
- `after()` lifecycle

## 11. Adapter API

Next.js now documents a deployment Adapter API for platforms/custom integrations.

Current 16.2 guidance exposes `adapterPath` as a stable top-level configuration surface after earlier experimental versions.

Conceptually:

```text
next build
  ↓
adapter receives build/config/output information
  ↓
adapter translates to platform artifacts/routing/runtime primitives
```

This is primarily for hosting/runtime authors, not ordinary feature code.

## 12. Adapter responsibilities

A serious adapter may need to implement or coordinate:

- routing phases
- Node/Edge entrypoints
- static assets
- server outputs
- PPR/resume handling
- cache interfaces
- deployment metadata
- platform-specific packaging

Partial support can produce applications that build successfully but fail on advanced features.

## 13. Adapter compatibility testing

A platform adapter should be validated against:

- static routes
- dynamic routes
- Route Handlers
- Server Actions
- Proxy
- streaming
- Cache Components
- PPR
- image/static assets
- error/not-found behaviour
- rolling deployment

Use Next.js compatibility tests where available plus platform-specific integration tests.

## 14. Do not build a custom server casually

Custom servers can be useful for unusual integration requirements, but they can remove assumptions/optimizations of the normal Next.js server path and increase operational ownership.

Before creating one, ask whether:

- reverse proxy config
- Route Handlers
- Proxy
- `headers`/`redirects`/`rewrites`
- instrumentation
- platform adapter

already solves the problem.

## 15. Platform portability

Separate application code from infrastructure-specific integrations where practical.

Examples:

```text
application domain code
Next.js framework integration
platform adapter/infrastructure code
```

This reduces migration cost.

But do not create an abstraction layer for every platform API without a real portability requirement.

## 16. Production topology design review

For a large application, draw the complete path:

```text
DNS
  ↓
CDN/WAF
  ↓
load balancer
  ↓
Next.js replicas
  ├─ shared cache
  ├─ PostgreSQL
  ├─ object storage
  ├─ queue
  └─ external APIs

workers ← queue
telemetry → collector/backend
```

Then review every arrow for:

- auth/trust
- latency
- timeout
- retry
- capacity
- failure mode
- observability

## 17. Failure-domain review

Ask what happens if each dependency fails.

| Failure | Expected response |
| --- | --- |
| CDN unavailable | alternate/bypass policy if available |
| one app replica dies | traffic moves to healthy replicas |
| shared cache unavailable | explicit fail-open/degrade policy |
| DB unavailable | controlled errors; no restart storm |
| queue unavailable | mutation durability policy |
| object storage unavailable | upload/download degradation |
| telemetry provider unavailable | app continues with bounded telemetry loss |

Avoid dependencies whose failure mode is “everything waits forever.”

## 18. Region strategy

Place compute relative to:

- users
- database
- cache
- external services

A globally distributed frontend calling one distant primary DB can still have poor request latency.

Multi-region write architecture adds consistency complexity; do not deploy globally just because the platform offers a region selector.

## 19. Data residency

Some systems require tenant/user data to remain in specific jurisdictions.

Deployment design then affects:

- region routing
- DB/storage placement
- logs/traces
- backups
- third-party processors

Application-level tenancy and infrastructure residency must agree.

## 20. Backups and restore

Production readiness includes data recovery.

For stateful dependencies define:

- backup frequency
- retention
- encryption
- restore test
- RPO
- RTO

A backup that has never been restored is an assumption.

## 21. Disaster recovery

Document:

```text
region loss
DB loss/corruption
cache loss
object-storage issue
secret compromise
DNS/CDN provider issue
```

Not every app needs active-active multi-region architecture.

Choose recovery complexity proportional to business requirements.

## 22. Framework upgrade operations

Next.js deployment security depends on supported patched releases.

Production ownership includes:

- tracking security advisories
- using supported LTS lines
- testing patch upgrades
- rolling them out quickly

Phase 20 covers migration mechanics; Phase 17 owns the patch/runbook responsibility.

## 23. Final production review checklist

### Build and artifact

- [ ] exact source/release identity recorded
- [ ] reproducible dependencies
- [ ] one immutable artifact promoted
- [ ] production build and smoke tests pass

### Runtime

- [ ] compatible hosting model selected
- [ ] streaming/PPR supported where used
- [ ] reverse proxy/security limits defined
- [ ] graceful shutdown tested

### State

- [ ] DB pools/capacity safe
- [ ] cache layers mapped and coordinated
- [ ] object storage durable
- [ ] queues durable/idempotent

### Deployment

- [ ] deployment/build/Action key consistency
- [ ] version skew strategy
- [ ] old assets retained
- [ ] migration compatibility
- [ ] rollback artifact known

### Security

- [ ] secrets injected and rotatable
- [ ] production access least-privileged
- [ ] trusted forwarded headers controlled
- [ ] dynamic/private output cannot become shared cache

### Operations

- [ ] liveness/readiness defined
- [ ] SLOs/alerts/runbooks exist
- [ ] release IDs in logs/traces/errors
- [ ] backups/restores tested for stateful systems
- [ ] incident owners known

## 24. Senior design questions

### Why choose static export?

When all required application output can be produced at build time and the product does not need Next.js request-time server features. It reduces runtime complexity but removes dynamic capabilities.

### When should you use a deployment adapter?

When implementing a hosting/platform integration that must translate Next.js build and runtime contracts into custom infrastructure primitives. Ordinary applications rarely need to author one.

### What is the biggest risk in self-hosting Next.js?

Not the Node process itself—the risk is incomplete ownership of the surrounding contracts: streaming, cache coordination, version skew, shutdown, stateful dependencies, secrets, scaling, observability, patching, and rollback.

## Exercise: production architecture review

For a multi-tenant SaaS, choose one of:

- managed platform
- Kubernetes self-hosting
- static export
- custom platform adapter

Write an architecture decision record covering:

1. required Next.js features
2. platform capability match
3. request topology
4. caching
5. storage/DB/queue
6. version-skew handling
7. rollout/rollback
8. security ownership
9. SLO/observability
10. disaster recovery
11. cost/complexity trade-off
