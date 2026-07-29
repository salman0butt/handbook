---
title: Production Migration Playbook, Regressions, Rollout & Rollback
sidebar_position: 7
description: Execute major Next.js migrations with route matrices, compatibility windows, production telemetry, staged rollout, and deterministic rollback.
---

# Production Migration Playbook, Regressions, Rollout & Rollback

This chapter turns the previous migration topics into one production playbook.

The core rule is:

> Upgrade the framework and modernize architecture without losing the ability to explain, verify, or reverse the change.

## 1. Freeze the baseline

Before migration, capture:

```text
current release SHA
framework/react/node versions
lockfile
production artifact
route inventory
critical user journeys
known incidents/workarounds
performance/security baselines
```

Without a baseline, “regression” becomes opinion.

## 2. Create a migration inventory

Search and classify:

```text
middleware.ts
cookies()/headers()/draftMode()
params/searchParams sync access
next lint
serverRuntimeConfig/publicRuntimeConfig
webpack config
experimental flags
unstable_ APIs
legacy image APIs
old metadata patterns
route-segment cache flags
Pages Router routes
client-only data fetches
```

Assign every item an owner and status.

## 3. Define route classes

Choose representative routes across:

```text
public static
public dynamic
authenticated
multi-tenant
streaming
cached/revalidated
Server Action mutation
Route Handler API
webhook/upload
metadata/image generation
```

These become the minimum regression matrix.

## 4. Define nonfunctional invariants

Migration success includes:

```text
no auth bypass
no cross-tenant leakage
no significant Web Vitals regression
no uncontrolled DB/upstream load increase
no broken crawler metadata
no build/deploy instability
```

Put numbers on the invariants where possible.

## 5. Upgrade dependencies first on a dedicated branch

Keep the target framework/React/Node versions visible in one reviewable change.

Commit the lockfile.

Run installation and static checks before applying architectural codemods.

## 6. Apply codemods mechanically

Run official transforms in isolated commits.

Then inspect:

```text
changed imports
async signatures
Proxy matchers
removed config
lint scripts
cache API renames
```

Never assume the transform understood your product invariants.

## 7. Migrate request-bound APIs

Complete async request API migration before chasing unrelated warnings.

Then run typegen, TypeScript, server tests, and affected route E2E.

## 8. Migrate request pipeline

Rename/decompose Middleware into Proxy.

Verify request order and trust boundaries.

Move business logic out if the migration reveals the old request front door had become a service layer.

## 9. Migrate caching as its own project

Do not combine a broad Cache Components rewrite with every other breaking change if avoidable.

Establish stale/fresh/tenant tests first, then change behavior.

Observe origin load during rollout.

## 10. Audit removed/deprecated APIs

Examples that may appear in legacy systems include:

```text
next export CLI
next/legacy/image
images.domains
Image priority/onLoadingComplete-era usage
metadata viewport fields moved to viewport APIs
middleware naming
old unstable cache names
```

Use current documented replacements and preserve only migration-history notes.

## 11. Production build gate

Require:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

plus appropriate integration/E2E suites.

If the app deploys standalone, test the actual standalone artifact.

## 12. Validate output, not only logs

Inspect real behavior:

```text
HTML source
RSC/client navigation
headers/cookies
redirects
metadata
assets
image responses
cache freshness
streaming
```

Private `.next` files may help diagnose but are not application contracts.

## 13. Staging should resemble production topology

Include where relevant:

```text
reverse proxy/CDN
multiple replicas
shared cache
real database engine
object storage
queue/sandbox provider
production Node/container base
```

A single local process cannot reveal distributed cache or version-skew failures.

## 14. Deployment compatibility window

During rolling deployments, old and new versions can coexist.

Review compatibility for:

```text
DB schemas
cache schemas/tags
Server Action encryption/reference behavior
static asset retention
public APIs
events/jobs
runtime config
```

Use `deploymentId`/build identity appropriately and retain required old assets during the overlap.

## 15. Canary rollout

A useful sequence:

```text
internal/staging
→ tiny production cohort
→ larger cohort
→ majority
→ full rollout
```

Compare each cohort against the baseline.

Do not expand because “no one complained.”

## 16. Migration dashboard

Track at minimum:

```text
request error rate
p95/p99 latency
Core Web Vitals
Server Action failures
cache hit/miss
DB pool wait/query rate
upstream error rate
memory/CPU
build/deploy failures
business conversion/critical journey completion
```

Segment by release/deployment ID.

## 17. Security smoke suite

Include high-value negatives:

```text
unauthenticated protected route
wrong tenant ID
forged resource ID
CSRF-sensitive mutation
unsafe redirect input
webhook bad signature
secret not present in browser/RSC output
```

Major upgrades can move request and serialization boundaries.

## 18. Browser matrix

Test at least the browsers/devices relevant to your product.

Check:

```text
hard navigation
soft navigation
back/forward
prefetch
hydration
forms
focus/keyboard
responsive layout
```

## 19. SEO/crawler matrix

For public products verify:

```text
200/3xx/404 semantics
canonical URLs
robots/noindex
sitemap
social previews
structured data
streamed metadata behavior
```

## 20. Rollback decision rule

Predefine thresholds.

Example:

```text
critical auth/security regression → immediate rollback/kill switch
sustained major error-rate increase → rollback
performance regression beyond budget → stop rollout / rollback
minor cosmetic issue → forward-fix if safe
```

The incident commander should not invent policy under pressure.

## 21. Deterministic rollback artifact

Keep the exact previous production artifact available.

Rollback should not rebuild “the old version” from current dependencies.

Rebuilding can produce a different artifact.

## 22. Database rollback reality

Often the app rolls back but the database does not.

That is why expand/contract schema evolution matters.

New schema should remain readable by the previous app during the rollback window.

## 23. Cache rollback reality

If cached representations changed, use versioned namespaces or compatible decoders.

Avoid old code reading new incompatible cache entries.

## 24. Server Action rollout reality

Independent builds can differ in generated server references and encrypted closure material.

For self-hosted multi-instance deployments, use consistent supported key/version-skew strategy and deploy immutable matching artifacts.

## 25. Complete the migration

After full rollout and observation:

```text
remove temporary flags
remove compatibility adapters
remove old route implementations
contract DB/cache schemas when safe
update runbooks/docs
close migration tracking
```

A migration with permanent temporary code is unfinished.

## 26. Post-migration review

Record:

```text
what broke
what automated cleanly
what required manual redesign
which tests caught regressions
which gaps reached production
which runbooks should change
```

Turn incidents into permanent test/architecture improvements.

## Senior migration design-review checklist

### Versions
- exact source/target versions known
- all crossed version guides reviewed
- stable vs experimental behavior separated

### Code
- codemods isolated/reviewed
- async APIs migrated
- Proxy/lint/config changes complete
- deprecated compatibility removed

### Correctness
- cache freshness tested
- auth/tenant isolation tested
- forms/actions/handlers tested
- routing/navigation tested

### Production
- immutable artifact
- realistic staging
- canary plan
- release telemetry
- compatibility window
- deterministic rollback

### Completion
- temporary compatibility deleted
- docs/runbooks updated
- final stable API audit performed

That is a production migration, not a package update.