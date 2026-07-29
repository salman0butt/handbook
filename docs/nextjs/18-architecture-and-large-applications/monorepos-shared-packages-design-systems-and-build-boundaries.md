---
title: Monorepos, Shared Packages, Design Systems & Build Boundaries
sidebar_position: 4
description: Structure large Next.js repositories with local packages, explicit exports, design systems, dependency direction, transpilePackages, build caching, and deployment-aware boundaries.
---

# Monorepos, Shared Packages, Design Systems & Build Boundaries

A monorepo is a source-control and dependency-management strategy—not an architecture by itself.

It becomes valuable when multiple applications or modules need coordinated code ownership, tooling, and reusable packages.

```text
monorepo
≠ automatically modular
≠ automatically fast
≠ automatically independently deployable
```

The architecture still depends on package boundaries and dependency direction.

## 1. Typical large Next.js monorepo

```text
apps/
  web/
  admin/
  docs/
packages/
  ui/
  auth/
  config/
  observability/
  domain-types/
```

This can support several applications without forcing each app into a separate repository.

## 2. Use packages for meaningful boundaries

A package is useful when you need one or more of:

```text
explicit public API
ownership boundary
reuse across applications
independent tests/tooling
versioned contract
dependency enforcement
```

Do not create a package for every folder.

Package overhead includes:

```text
build configuration
exports
version compatibility
dependency graph
CI caching
release coordination
```

## 3. Stable packages should expose stable semantics

A good package API:

```ts
import { Button } from '@acme/ui'
import { verifySession } from '@acme/auth/server'
import { createLogger } from '@acme/observability'
```

Avoid consumers reaching inside:

```ts
import { internalThing } from '@acme/auth/src/internal/private-helper'
```

Use `package.json` `exports` to define supported entry points.

## 4. Separate server and client package entry points

A shared package may contain both server and browser code.

Do not make the top-level entry point casually mix them.

Example conceptual exports:

```json
{
  "exports": {
    "./client": "./src/client.ts",
    "./server": "./src/server.ts",
    "./types": "./src/types.ts"
  }
}
```

Then ownership is explicit:

```ts
import { BillingWidget } from '@acme/billing/client'
import { loadBillingAccount } from '@acme/billing/server'
```

## 5. Use `server-only` in privileged shared packages

```ts
import 'server-only'
```

This is valuable in shared packages that touch:

```text
databases
secret-bearing SDKs
private APIs
server credentials
```

A client import should fail early rather than silently bundle privileged code.

## 6. `transpilePackages` supports local packages

Next.js can transpile and bundle local monorepo packages through stable `transpilePackages` configuration.

```js
const nextConfig = {
  transpilePackages: ['@acme/ui', '@acme/domain'],
}

module.exports = nextConfig
```

Use it when the consuming Next.js application needs Next to process source from local packages.

Do not add every package blindly; understand what the package publishes and how it is built.

## 7. Package source vs prebuilt package

Two common models:

### Source package

```text
package exports TS/TSX source
Next.js transpiles it
```

### Prebuilt package

```text
package build produces JS + types
app consumes published/build output
```

Trade-offs:

```text
source package → simpler local development, tighter framework integration
prebuilt       → clearer independent package contract, extra build step
```

Choose based on ownership and reuse requirements.

## 8. Design system should be product-agnostic

A design-system package can own:

```text
Button
Input
Dialog
Table primitives
tokens
typography
accessibility behaviour
```

It should not own:

```text
billing permissions
project routes
tenant logic
product analytics semantics
```

Product components compose the design system inside feature modules.

## 9. Design-system Client Components affect consumers

Interactive design-system components may require `'use client'`.

Keep that boundary at the smallest practical component level.

Do not make an entire UI package client-owned because one component uses state.

A package can expose both:

```text
server-safe primitives
interactive client primitives
```

with explicit entry points.

## 10. Shared types can create hidden coupling

A `domain-types` package containing every database entity often becomes a distributed schema dependency.

Prefer stable boundary types:

```text
public DTOs
event schemas
API contracts
shared primitives
```

Avoid exporting internal persistence models as the universal language of every application.

## 11. Package dependency direction should be acyclic

Example:

```text
apps/web
  ↓
features/packages
  ↓
platform packages
  ↓
low-level primitives
```

Avoid:

```text
ui → web app
observability → billing
core → feature
```

A lower-level package should not know about higher-level product features.

## 12. Keep application-specific code in the app

Not every reusable-looking component belongs in `packages/`.

If only `apps/web` owns a project settings panel, keep it there.

Promote to a shared package only when a second real consumer or stronger ownership need appears.

## 13. Package boundaries are not network boundaries

```text
@acme/billing package
```

still runs inside the same Next.js deployment unless you split deployment architecture.

Do not design an internal package API like a remote service API unless you need that independence.

In-process calls have different latency/failure semantics from HTTP calls.

## 14. Monorepo deployment tracing matters

Phase 17 covered output tracing and standalone deployment.

In monorepos, ensure the production artifact includes files and packages outside the immediate application directory that are needed at runtime.

Treat tracing/build-root configuration as an operational consequence of repository architecture.

A package that works in development but is absent from the runtime artifact is an architecture/deployment mismatch.

## 15. Build caching should follow dependency graph

Next.js uses `.next/cache` to speed repeated builds, and CI can persist it.

Monorepo tooling may add task-level caching on top.

Do not treat cache hits as correctness.

A build cache key must account for relevant inputs:

```text
source
dependencies
configuration
environment affecting build
compiler/tool versions
```

Stale build outputs are worse than a slow build.

## 16. Separate package and application configuration

A central config package can own shared defaults:

```text
TypeScript base config
ESLint rules
test presets
logging conventions
```

But applications should still own framework-specific runtime choices such as:

```text
Next config
route structure
deployment capability
security headers
cache strategy
```

Do not make a global config package so powerful that every app becomes impossible to configure independently.

## 17. Shared auth requires clear responsibility

An auth package might expose:

```text
session parsing
provider integration
secure server helpers
```

But each application still owns:

```text
which routes are protected
which feature policies apply
which tenant/resource access is valid
```

Authentication can be shared; product authorization remains domain-specific.

## 18. Shared database package needs discipline

A package like `@acme/db` can own:

```text
client construction
schema access
migration tooling
connection conventions
```

But if every feature imports the raw database client and queries every table, domain ownership disappears.

Prefer feature DALs over unrestricted cross-domain queries.

## 19. Shared observability package should standardise mechanics

It can own:

```text
logger creation
trace helpers
release metadata
redaction
common fields
```

Feature modules should own product event meaning:

```text
invoice.payment_failed
project.member_invited
```

The platform package should not become the business-event catalogue.

## 20. Monorepo and multiple Next.js apps

Several Next.js applications in one monorepo can share packages while deploying independently.

Example:

```text
apps/storefront
apps/dashboard
apps/admin
```

Independent deployment means you must manage compatibility:

```text
shared package changes
API/event contracts
feature flags
schema migrations
auth/session compatibility
```

Source proximity does not remove distributed-system concerns.

## 21. Versioning internal packages

A single lockstep repository may not need public semantic version publishing for every internal package.

But you still need compatibility discipline.

Useful mechanisms:

```text
package exports
changesets/versioning where independently published
contract tests
CI affected-graph checks
API review
```

Choose the lightest mechanism that matches release independence.

## 22. Avoid giant catch-all packages

Bad:

```text
@acme/common
@acme/shared
@acme/utils
```

These packages often become dependency magnets.

Prefer semantics:

```text
@acme/ui
@acme/observability
@acme/ids
@acme/http
```

Feature-specific code should stay with the feature.

## 23. Boundary enforcement techniques

At scale, automate architecture rules.

Options include:

```text
ESLint restricted imports
package exports
TypeScript references
workspace dependency rules
CODEOWNERS
architecture tests
CI dependency graph checks
```

The framework does not enforce your business architecture for you.

## 24. Build-time performance is architecture feedback

A slow monorepo build can indicate:

```text
huge shared dependency fan-out
every app importing the same giant package
poor cache granularity
client/server graph pollution
unnecessary cross-package rebuilds
```

Use build profiling as architecture evidence, not only CI optimisation work.

## 25. Senior review questions

### When should a feature become a workspace package?

When explicit dependency enforcement, reuse, ownership, tooling, or release boundaries justify package overhead.

### Does `transpilePackages` make a package safe for the client?

No. It affects build processing, not trust boundaries. Server-only code still must remain server-only.

### Should a design system include business workflows?

Usually no. The design system should own reusable visual/interaction primitives; product workflows belong to feature modules.

## Production checklist

- [ ] workspace packages represent real boundaries
- [ ] public exports are explicit
- [ ] server/client package entry points are separated
- [ ] privileged packages use server-only protection where appropriate
- [ ] `transpilePackages` is deliberate
- [ ] package dependency graph is acyclic
- [ ] design-system code remains product-agnostic
- [ ] raw DB access does not erase feature ownership
- [ ] runtime tracing includes required workspace code
- [ ] build caches include all relevant inputs
- [ ] cross-app compatibility is treated as a release concern

## Exercise

Design a monorepo for:

```text
customer web app
admin app
marketing site
shared design system
shared auth mechanics
shared observability
```

Define:

1. package boundaries
2. public exports
3. server/client entry points
4. dependency direction
5. deployment independence
6. CI/build cache strategy
