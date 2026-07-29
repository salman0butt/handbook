---
title: Deployment Model, Build Artifacts & Platform Capabilities
sidebar_position: 1
description: Understand what Next.js builds, what runs at request time, which infrastructure capabilities App Router features require, and how to design a production deployment contract.
---

# Deployment Model, Build Artifacts & Platform Capabilities

A production Next.js deployment is not just “put `.next` on a server.”

You are deploying a system with several different classes of output and runtime behaviour:

```text
source repository
   ↓
next build
   ↓
immutable assets + route output + server bundles + manifests + cache metadata
   ↓
deployment platform
   ↓
CDN / reverse proxy / runtime / cache / database / object storage / telemetry
   ↓
real requests
```

The most important production question is:

> Which Next.js features does this application use, and what infrastructure primitives must the platform provide for those features to behave correctly?

## 1. Build time, startup time, request time

Separate three phases.

### Build time

`next build` can:

- compile server and client code
- prerender eligible routes
- trace server dependencies
- generate hashed static assets
- create route/build manifests
- create build/deployment identifiers
- bundle public environment values
- run build adapters when configured

### Startup time

A long-lived Node deployment may:

- boot the Next.js server
- run `instrumentation.ts` registration
- initialize telemetry
- create SDK clients
- validate runtime configuration
- warm selected dependencies

### Request time

Request-time work may include:

- Proxy
- dynamic rendering
- Server Components
- Route Handlers
- Server Actions
- request APIs such as cookies/headers
- cache lookup/revalidation
- streamed rendering
- image optimization
- `after()` callbacks

Do not mix these lifecycles mentally.

## 2. One artifact should represent one build

A safe deployment pipeline normally produces one immutable build artifact and promotes that artifact.

```text
commit abc123
   ↓
CI build
   ↓
artifact/image A
   ├─ staging
   └─ production
```

Avoid rebuilding the same source independently for each instance in the same deployment.

Why?

Build-time output can include:

- build IDs
- Server Function identifiers
- Server Function encryption metadata
- prerender output
- client asset hashes
- manifests

Different builds from the “same source” can still create avoidable skew.

## 3. Platform capability matrix

A platform can host a Next.js application only to the extent that it supports the features the application needs.

Think in capabilities:

| Capability | Why it matters |
| --- | --- |
| Node/server execution | Dynamic rendering, Route Handlers, Actions, runtime APIs |
| Streaming | Suspense, progressive rendering, PPR delivery |
| Writable/shared cache | ISR and multi-instance consistency depending on architecture |
| Request routing | Dynamic routes, rewrites, redirects, Proxy integration |
| Durable storage | Uploads, generated artifacts, durable jobs |
| Background execution | Work that cannot safely live only in `after()` |
| Secret injection | Server credentials and runtime configuration |
| Health signalling | Safe orchestration and traffic routing |
| Graceful shutdown | Drain requests and pending `after()` callbacks |
| Observability export | Logs, traces, metrics, errors |

Do not choose a host only from a marketing label like “supports Next.js.”

Verify the features you depend on.

## 4. Deployment models

Common models include:

### Managed Next.js platform

The platform owns much of:

```text
build
routing
server runtime
CDN
cache
image optimization
observability integrations
scaling
```

You still own application correctness, security, data, and rollout policy.

### Self-hosted Node server

```text
Internet
  ↓
CDN / load balancer / reverse proxy
  ↓
next start
  ↓
DB / cache / services
```

You own more operational behaviour directly.

### Containerized deployment

```text
container image
  ↓
orchestrator
  ↓
many replicas
```

Multi-instance consistency becomes a first-class design concern.

### Static export

```text
next build
  ↓
out/
  ↓
static web server / object storage / CDN
```

This removes server runtime features rather than emulating them.

### Custom adapter/platform integration

A deployment adapter can translate Next.js build/runtime output into a hosting platform's primitives.

That is infrastructure engineering, not ordinary application configuration.

## 5. Node server vs static export

A Node deployment can support server features such as:

- dynamic rendering
- Route Handlers
- Server Actions
- Proxy
- runtime image optimization
- ISR/revalidation
- request-time cookies/headers
- `after()`

A static export cannot support features that require a Next.js server at runtime.

Do not select `output: 'export'` merely because static hosting is cheaper if your product contract needs runtime features.

## 6. Build output is not all equally cacheable

Different classes have different semantics.

```text
hashed JS/CSS/static assets → long-lived immutable cache
prerendered public HTML     → cache according to route contract
dynamic personalized HTML   → private/no-store style semantics
server bundles              → deployment artifact, not CDN public content
runtime cache entries        → correctness/freshness policy
```

Never apply one broad CDN cache rule to all paths.

## 7. Server and browser versions must stay compatible

During rolling deploys a user can have:

```text
browser loaded deployment A
server now receiving deployment B
```

Possible failures include:

- old chunk URL no longer available
- prefetched RSC payload incompatible with new server
- Server Action identifier mismatch
- route tree changed

Phase 17 treats version skew as a deployment design problem, not a rare edge case.

## 8. Infrastructure is part of streaming

A route can stream correctly inside Next.js but still appear non-streaming to users if an upstream layer buffers it.

```text
Next.js stream
  ↓
reverse proxy buffers
  ↓
load balancer buffers
  ↓
CDN waits
  ↓
user receives one completed response
```

Streaming is end-to-end.

## 9. Infrastructure is part of cache correctness

With one long-lived server, local cache may be enough.

With many replicas:

```text
instance A cache ≠ instance B cache
```

A revalidation on A may not immediately affect B unless cache/tag state is coordinated.

That matters for:

- content freshness
- permissions
- pricing
- feature flags
- tenant configuration

Performance optimizations never override correctness.

## 10. Infrastructure is part of security

Deployment security includes:

- TLS termination
- trusted proxy headers
- request size limits
- WAF/rate limiting
- secret injection
- network policy
- DB access
- object-storage access
- log access
- source-map access
- admin endpoints

Application security from Phase 13 and infrastructure security are complementary layers.

## 11. Production configuration belongs to an explicit contract

Document for each environment:

```text
build source / SHA
artifact identity
runtime type
Node version
regions
replica count
cache backend
DB endpoint/region
secret source
CDN rules
health endpoints
shutdown grace period
telemetry destination
rollback procedure
```

If this knowledge exists only in one engineer's memory, deployment is fragile.

## 12. Production checklist

Before declaring a hosting model compatible, verify:

- [ ] all required Next.js runtime features are supported
- [ ] streaming works end-to-end if relied upon
- [ ] dynamic responses cannot be cached publicly by mistake
- [ ] multi-instance caches/invalidation are coordinated where needed
- [ ] deployment version skew has a strategy
- [ ] Server Action encryption/build identity is consistent
- [ ] secrets are server-only and injected safely
- [ ] shutdown drains live requests
- [ ] DB/storage dependencies survive scale-out
- [ ] production observability identifies build, region, instance and route
- [ ] rollback can restore a known-good artifact

## Interview questions

### Why is “it runs with `next start`” not enough to prove production readiness?

Because production correctness also depends on proxies, streaming, caches, instance coordination, secrets, database capacity, graceful shutdown, version skew, telemetry, and rollout behaviour.

### What is the difference between a build artifact and runtime configuration?

A build artifact is the compiled output produced for a specific build identity. Runtime configuration is environment-specific state supplied when that artifact runs. Public `NEXT_PUBLIC_` values are an important exception because they are normally frozen into client code at build time.

## Exercise

Create a deployment capability matrix for a real App Router app. Mark whether it needs:

1. server execution
2. streaming
3. Server Actions
4. Proxy
5. ISR/revalidation
6. shared cache
7. object storage
8. durable background jobs
9. runtime secrets
10. rolling-deploy version protection
