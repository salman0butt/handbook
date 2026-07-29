---
title: Debugging, Performance, Security & Production Scenarios
sidebar_position: 3
description: Practice senior Next.js incident scenarios involving stale data, hydration, security boundaries, Server Actions, deployment skew, latency, memory, and third-party failures.
---

# Debugging, Performance, Security & Production Scenarios

Senior interviews often replace “What is X?” with:

> Production is broken. What do you do?

Use this response structure:

```text
symptom
→ scope
→ layer classification
→ evidence
→ hypothesis
→ minimal experiment
→ root-cause fix
→ regression guard
```

## Scenario 1 — Stale data after mutation

Symptoms:

```text
Server Action succeeds
DB row changed
UI still shows old value
hard reload sometimes fixes it
```

Reason through cache layers:

```text
canonical DB state
server cache/tag/path state
RSC render output
client Router Cache
local optimistic/client state
```

Questions:

```text
Was invalidation triggered?
Was the correct tag/path invalidated?
Does soft navigation reuse cached route data?
Did optimistic state diverge?
```

Do not jump straight to `router.refresh()` without identifying stale ownership.

## Scenario 2 — Cross-tenant cache leak

Symptom:

> User in tenant B sees data from tenant A after a cache hit.

Immediate priority:

```text
security incident
→ disable unsafe cache path
→ contain
→ audit exposure
```

Root cause class:

```text
cache identity omitted tenant/user authorization dimension
```

Corrective model:

```text
authorized query
→ tenant-scoped identity
→ cached result
```

not:

```text
global query
→ shared cache
→ caller filters later
```

Add negative tests across tenants.

## Scenario 3 — Hydration mismatch only in production

Investigate:

```text
Date/timezone
Math.random
browser-only condition
invalid HTML
locale differences
extension injection
stale asset/version mix
```

Compare server HTML and first browser render.

Do not silence `suppressHydrationWarning` until ownership is understood.

## Scenario 4 — Route is slow but DB is fast

Break latency into:

```text
proxy/front door
server scheduling/cold start
data dependencies
upstream calls
RSC render
streaming delay
network transfer
client JS/hydration
```

Use traces rather than DB intuition.

Potential causes:

```text
serial upstream waterfall
large RSC payload
slow third party
Suspense boundary placed too high
client bundle/main-thread cost
```

## Scenario 5 — Good Lighthouse, bad real-user INP

Explain lab vs field.

Investigate:

```text
real devices
long-lived sessions
large client state/render blast radius
third-party scripts
input handlers
large DOM
memory growth
```

Use RUM and browser performance profiles from representative flows.

## Scenario 6 — Build passes locally, fails in CI

Classify environment differences:

```text
Node version
package manager/lockfile
Linux filesystem case sensitivity
missing env
network/private dependency
native binary
workspace root/path
stale cache
```

Run the production build in the same target environment.

## Scenario 7 — Production startup fails after standalone deploy

Investigate artifact closure:

```text
missing traced file
public/.next/static packaging
external native dependency
wrong working directory
runtime env
ABI/libc mismatch
```

Do not copy the full repository into production as the first fix; understand why the artifact is incomplete.

## Scenario 8 — Server Action fails during rolling deploy

Think version skew.

Potential mismatch:

```text
browser from deployment A
→ generated Action reference
→ request lands on deployment B
```

Also consider closure encryption key consistency.

Mitigations include supported deployment identity/version-skew strategy, compatible artifacts, asset retention and consistent Action keys where self-hosting requires them.

## Scenario 9 — Duplicate order creation

Ask:

```text
Did browser double-submit?
Did network retry?
Did worker/webhook replay?
Was idempotency enforced transactionally?
```

Correctness should not rely on the client sending only once.

Use unique/idempotency constraints and canonical transaction semantics.

## Scenario 10 — Proxy says user is allowed, DAL says no

The DAL should win.

Proxy is useful for optimistic routing/gating, but resource authorization belongs at the secure data/mutation boundary.

A senior answer explicitly prefers a secure false-negative/redirect inconvenience over unauthorized data access.

## Scenario 11 — Webhook storm causes DB saturation

Investigate:

```text
signature verification cost
request body limits
replay/duplicate volume
synchronous processing
DB connection pool
queue buffering
rate controls
```

Prefer:

```text
verify
→ idempotently persist/enqueue
→ acknowledge
→ process durably
```

when provider contract allows.

## Scenario 12 — Cache backend outage

Ask whether cache is:

```text
optimization
or correctness/state dependency
```

For a read cache, graceful bypass may be possible but origin load must be protected.

Avoid outage behavior that creates a cache stampede and takes down the DB.

## Scenario 13 — Image endpoint used for SSRF

Review:

```text
remotePatterns
redirect limits
private IP policy
user-controlled source URLs
custom loader/provider behavior
```

Do not allow arbitrary backend fetch destinations based on untrusted URL input.

## Scenario 14 — CSP breaks after enabling nonces

Understand dynamic rendering implications and nonce propagation.

Debug:

```text
which script/style is blocked?
was nonce generated per request?
was it applied to intended resources?
is third-party script compatible?
```

Do not weaken CSP globally to fix one integration without threat review.

## Scenario 15 — Memory grows across soft navigations

Client-side suspects:

```text
unremoved listeners
subscriptions
large retained caches
DOM references
third-party widgets
state never released
```

Use heap snapshots and long-session reproduction.

Server-side suspects differ:

```text
process globals
unbounded maps
SDK/resource leaks
cache memory size
large buffers
```

## Scenario 16 — Streaming does not stream in production

Check infrastructure:

```text
reverse-proxy buffering
CDN behavior
compression buffering
response transformation
platform capability
```

If local streaming works, inspect the delivery path before rewriting Suspense boundaries.

## Scenario 17 — Search page causes DB spike after optimization

Maybe prefetching or parallelism increased work.

Investigate:

```text
Link prefetch volume
cache hit-rate change
fan-out count
connection pool wait
query duplication
```

“More parallel” can reduce single-request latency while harming system p95 under load.

## Scenario 18 — Client bundle suddenly grows

Look for:

```text
'use client' moved upward
large package imported into client graph
barrel export changed tree shaking
dynamic import removed
third-party editor/chart included globally
```

Use bundle analysis and module ownership.

## Scenario 19 — `notFound()` returns 200

Know streaming semantics.

If headers/status are already committed by a streamed response, later not-found behavior can produce not-found UI/noindex while HTTP status cannot be changed the same way as a non-streamed response.

Explain why protocol commitment matters.

## Scenario 20 — Error logs lack useful server message

Production Server Component errors may be sanitized toward the client.

Use server telemetry and the digest/correlation identifier to connect client-visible failure to protected server details.

Do not expose stack traces/secrets to the browser just to improve debugging.

## Scenario 21 — Release causes cache poisoning across versions

If cached representation/key semantics changed, old/new deployments may interpret entries differently.

Use:

```text
versioned namespaces
compatible decoders
rollout sequencing
controlled invalidation
```

## Scenario 22 — Auth works locally but cookies fail behind proxy

Investigate:

```text
secure cookie
sameSite/domain/path
HTTPS termination
forwarded host/proto trust
redirect origin
proxy config
```

Do not blindly trust arbitrary forwarded headers from the public internet.

## Scenario 23 — Third-party analytics blocks interaction

Measure main-thread/network impact.

Options:

```text
load later
scope to routes
consent gate
facade heavy embed
remove vendor
```

Product value must justify the performance/privacy cost.

## Scenario 24 — Queue job processed twice

Expected distributed behavior.

Worker must be idempotent.

Use:

```text
stable job identity
state transition constraint
dedup/idempotency record
transactional side-effect boundary
```

Do not assume “exactly once” delivery from infrastructure unless the whole business effect is proven exactly once.

## Scenario answer rubric

A senior answer should include:

```text
containment if high impact
layer classification
specific evidence/tools
multiple plausible hypotheses
correctness/security priority
root-cause fix
regression test/monitor
```

The strongest interview signal is not guessing the bug quickly. It is showing a reliable way to find the bug without creating a second one.