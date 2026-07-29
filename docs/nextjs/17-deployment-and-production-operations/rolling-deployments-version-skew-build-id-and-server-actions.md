---
title: Rolling Deployments, Version Skew, Build IDs & Server Actions
sidebar_position: 6
description: Prevent mixed-build failures during rolling deploys with deploymentId, build identity, immutable assets, Server Action key consistency, compatibility windows, and rollback-safe rollout design.
---

# Rolling Deployments, Version Skew, Build IDs & Server Actions

Zero-downtime deployment means old and new versions coexist for some period.

```text
browser loaded A
server pool contains A + B
CDN contains assets from A + B
```

That coexistence must be designed.

## 1. Version skew is normal during rollout

A user can:

1. load HTML from deployment A
2. keep the tab open
3. deployment B becomes active
4. navigate or submit an Action

Potential failures include:

- missing static assets
- incompatible RSC/navigation data
- removed routes
- Server Action ID mismatch
- changed serialized payload shape

Treat this as a standard production state, not an anomaly.

## 2. `deploymentId`

Current Next.js provides a stable `deploymentId` configuration for version-skew protection and cache busting.

Example:

```js
module.exports = {
  deploymentId: process.env.DEPLOYMENT_VERSION,
}
```

or with the environment variable:

```text
NEXT_DEPLOYMENT_ID
```

All instances in the same deployment should use the same value.

## 3. What deployment ID does

At the current stable contract, Next.js uses the deployment identifier to help clients detect a mismatch between the deployment they loaded and the server now answering.

A mismatch can cause a hard navigation instead of continuing a soft client navigation with incompatible deployment state.

This reduces mixed-version failures.

It is not a substitute for rollout compatibility.

## 4. Hard navigation has product consequences

A forced reload can lose in-memory React state:

```text
useState
open dialog state
unsaved local form state
```

State persisted in URL/storage or saved server-side can survive depending on architecture.

Therefore deployment skew protection can trade a broken soft navigation for a full reload—which is usually safer, but still visible.

## 5. `generateBuildId`

Next.js generates a build ID during `next build`.

Current guidance says the same build should be used to boot multiple containers.

If infrastructure rebuilds the application in separate places and you intentionally need a consistent build ID, `generateBuildId` can derive one from stable release identity such as a Git SHA.

Example:

```js
module.exports = {
  generateBuildId: async () => process.env.GIT_SHA,
}
```

Prefer build-once promotion where possible rather than relying on this to make independent builds identical.

## 6. Build ID and deployment ID solve related but different problems

Think:

```text
build ID      → identifies produced Next.js build output
deployment ID → helps manage active deployment/version skew and asset busting
release SHA   → source/release provenance
image digest  → exact packaged artifact
```

Record them together in telemetry when useful.

## 7. Keep old static assets available

A browser from deployment A may request:

```text
/_next/static/...A-hash.js
```

after deployment B starts.

If your CDN/asset deployment deletes A immediately, active clients can fail even if the server rollout is healthy.

Use content-addressed immutable assets with a retention window that covers active clients and rollback needs.

## 8. Server Action identifiers

Server Actions/Functions are build-sensitive public endpoints.

An old browser can attempt to invoke an Action identifier that the new deployment no longer recognizes.

Rollout strategy should minimize incompatible windows and use deployment skew protection.

Important operations should also tolerate duplicate/retry behaviour through idempotency design where appropriate.

## 9. Server Action encryption key consistency

Next.js encrypts Server Function closure values.

For multi-instance deployment, current self-hosting guidance requires compatible key state across instances.

`NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` can provide a consistent key for the build/deployment.

Operational failure signature:

```text
request renders on instance A
Action POST lands on instance B
B cannot decrypt/recognize expected Action state
```

Do not rotate this key casually during a mixed deployment without understanding compatibility.

## 10. Sticky sessions are not a complete fix

Routing a user to one replica can reduce some skew symptoms, but it does not solve:

- replica restart
- scale-out/in
- CDN assets
- failover
- old tabs after release
- shared cache consistency

Correct deployment should not depend solely on sticky sessions to make build metadata coherent.

## 11. Backward-compatible database changes

Application A and B can overlap while sharing one database.

Therefore schema changes should often follow expand/contract:

```text
1. add new compatible schema
2. deploy code that can use it
3. migrate data
4. stop old code
5. remove obsolete schema later
```

Avoid rollout where B requires a column/table shape that breaks A immediately.

## 12. API compatibility during rollout

If internal services or Route Handlers change response shape, old clients may still exist.

Use compatibility windows for:

- browser tabs
- mobile/external clients
- background workers
- webhooks

Deployment of UI and server in one repository does not guarantee all active clients upgrade simultaneously.

## 13. Feature flags and two-version overlap

A new feature flag may be read by both A and B.

Before enabling it globally, verify old code's behaviour.

Safe sequence:

```text
deploy code that understands flag
→ verify rollout complete
→ enable flag
```

not:

```text
enable unknown config
→ old replicas crash
```

## 14. Canary deployment

Canary strategy:

```text
new release B receives small traffic percentage
→ compare errors/latency/vitals/business signals
→ increase gradually
→ rollback if unhealthy
```

Canary routing must still preserve asset/build consistency.

If browser requests bounce randomly between release pools, you can manufacture version skew.

## 15. Blue/green deployment

```text
blue = current
 green = candidate
```

Build and validate green, then switch traffic.

Advantages:

- clear rollback target
- less mixed-version duration

Trade-offs:

- duplicate capacity
- DB/schema compatibility still matters
- existing long-lived clients still carry blue assets/state

## 16. Rolling deployment

Replicas replace gradually:

```text
A A A
→ A A B
→ A B B
→ B B B
```

This is capacity-efficient but creates a larger mixed-version window.

Use readiness and graceful draining to avoid sending traffic to starting/stopping replicas.

## 17. Rollback is also a version transition

Rolling back B → A can fail if B already made incompatible changes to:

- DB schema/data
- cache payloads
- queues/events
- object format
- feature configuration

A rollback plan must include state compatibility, not just “redeploy old image.”

## 18. Cache compatibility

If release B changes cached serialization:

```text
A cache entry shape v1
B expects shape v2
```

use:

- versioned cache keys
- backward-compatible reader
- coordinated purge

Do not let a rollback read new incompatible cache entries either.

## 19. Queue/event compatibility

Background messages can outlive the deployment that produced them.

Version event schemas deliberately.

Workers should not assume every queued payload was produced by the same release.

## 20. Release metadata

Every error/trace should make it possible to answer:

```text
release?
deployment ID?
build ID?
region?
instance?
```

Without release identity, comparing canary and stable cohorts is difficult.

## 21. Deployment health gates

Before increasing traffic, check:

- startup/readiness success
- error rate
- p95/p99 latency
- DB/cache health
- Action failures
- chunk/asset load errors
- hydration/navigation failures
- queue backlog
- resource saturation

Do not promote solely because containers are running.

## 22. Rollback trigger

Define thresholds before rollout.

Example categories:

```text
critical security/correctness failure → immediate rollback/disable
large 5xx spike                    → rollback
minor performance regression       → pause, investigate
single noisy metric                → verify signal
```

The exact thresholds belong to service SLOs.

## 23. Deployment runbook

A mature runbook contains:

```text
artifact to deploy
pre-deploy checks
migration sequence
traffic strategy
gates
monitoring links
rollback artifact
rollback DB/config procedure
owner/on-call
post-deploy verification
```

## Production checklist

- [ ] deployment ID configured where rolling/multi-instance skew requires it
- [ ] all replicas of one deployment share build identity
- [ ] Server Action encryption key policy is consistent
- [ ] old static assets survive active-client/rollback window
- [ ] DB changes are compatible across overlapping versions
- [ ] cache/message schemas handle rollback/roll-forward
- [ ] rollout strategy defines traffic percentage and health gates
- [ ] readiness/graceful drain protects replica replacement
- [ ] release/build/deployment IDs exist in telemetry
- [ ] rollback is tested as a state transition, not only an image swap

## Interview questions

### What does `deploymentId` protect against?

It helps Next.js detect a browser/server deployment mismatch during client navigation and cache-bust deployment assets, allowing a full reload instead of continuing with potentially incompatible soft-navigation state.

### Why can a database migration make rollback impossible?

If the new release removes or transforms schema/data in a way the old release cannot understand, redeploying the old application binary does not restore the previous data contract.

## Exercise

Design a rolling deployment from release A to B with three replicas. Specify:

1. build/deployment identity
2. Action encryption key policy
3. old asset retention
4. DB migration order
5. cache schema compatibility
6. readiness/drain sequence
7. canary gates
8. rollback trigger
9. rollback compatibility
