---
title: Production Debugging, Source Maps, CLI & Incident Workflows
description: Debug App Router failures with production source maps, Next.js CLI diagnostics, prerender debugging, logs, traces, release identity, and evidence-driven incident workflows.
---

# Production Debugging, Source Maps, CLI & Incident Workflows

Production debugging is a process of reducing uncertainty.

A useful order is:

```text
symptom
→ scope
→ recent change
→ affected route/runtime
→ logs/metrics/traces
→ reproduce
→ isolate
→ fix
→ verify
```

Do not begin by randomly changing code.

## 1. Reproduce the production execution mode

Development behavior is not production behavior.

Important differences can include:

```text
minification
caching
prerendering
streaming timing
optimized bundles
production error sanitization
runtime topology
CDN/proxy behavior
```

A serious production issue often deserves a local or staging reproduction using:

```bash
next build
next start
```

rather than only `next dev`.

## 2. Record the exact framework and build version

Before debugging, identify:

```text
Next.js version
React version
Node version
commit/build SHA
deployment environment
runtime/region
```

A stack trace without release identity can point to code that is no longer deployed.

## 3. `next info` is useful for environment diagnostics

Next.js provides:

```bash
next info
```

It reports relevant system and package information that helps reproduce framework issues.

For deeper diagnostics:

```bash
next info --verbose
```

Use it when preparing a framework bug report or comparing environments.

## 4. `next build --debug` increases build output

When route configuration, redirects, headers, or build behavior are confusing:

```bash
next build --debug
```

Use this for diagnostic visibility, not as a permanent production build mode.

## 5. `--debug-prerender` is for prerender failures

Next.js provides:

```bash
next build --debug-prerender
```

This improves readability of prerender failures by enabling debugging-oriented behavior such as server source maps and reduced minification.

It may continue after the first prerender failure so multiple problems can be surfaced.

Do **not** deploy a build produced for prerender debugging as your normal production artifact.

## 6. Build only relevant routes when debugging large apps

Current CLI tooling supports targeted build paths for debugging.

Example:

```bash
next build --debug-build-paths="app/**/page.tsx"
```

or a narrower path.

This can reduce feedback time when isolating route-specific build failures.

Treat debugging-only CLI flags as diagnostic tools, not default CI configuration.

## 7. Node inspector can debug production-mode server code

Node arguments can be passed through environment configuration.

Example:

```bash
NODE_OPTIONS='--inspect' next start
```

Only expose a debugger in a controlled environment.

Never bind production debugging ports publicly.

## 8. Browser source maps are disabled by default in production

Next.js development builds include source-map support for debugging.

For production browser bundles, `productionBrowserSourceMaps` is off by default.

You can enable it:

```js
module.exports = {
  productionBrowserSourceMaps: true,
}
```

But understand the trade-off.

## 9. Public production source maps expose source structure

When `productionBrowserSourceMaps` is enabled, generated maps are emitted with client JavaScript and can be served by Next.js.

That can:

```text
increase build time
increase build memory
make original client source easier to inspect
```

This is not automatically a security vulnerability, but it is an information-exposure and operational decision.

## 10. Private source-map upload is often preferable

Many error-monitoring systems support:

```text
build source maps
→ upload to provider during CI
→ associate with release
→ delete/avoid public serving where supported
```

This preserves readable stack traces without intentionally publishing maps to every browser.

The exact workflow depends on your build and provider.

## 11. Source maps require exact release matching

Wrong map + wrong bundle = misleading stack trace.

Use stable release identity:

```text
commit SHA
build ID
deployment ID
artifact version
```

and ensure the monitoring provider associates maps with the same client bundle release.

## 12. Next.js development logging has specific scope

The `logging` config can control development logs for areas such as fetches and incoming requests.

Example:

```js
module.exports = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}
```

This is primarily a development debugging aid.

Do not mistake it for a production structured logging system.

## 13. HMR fetch behavior can confuse local debugging

Server Component development caching and HMR can affect whether repeated fetches appear in logs.

Current logging configuration can expose HMR refresh fetches when needed.

When debugging, ask:

```text
Did the code really issue a new request?
Was a development cache involved?
Am I seeing production-equivalent behavior?
```

## 14. Incoming-request logging can be filtered in development

Noisy endpoints such as health checks can overwhelm local logs.

Development logging can ignore selected request patterns.

This improves signal locally, but production request logging still needs your application/platform observability architecture.

## 15. Use browser network evidence before blaming React

For a failed route, inspect:

```text
document request
RSC/navigation requests
Route Handler requests
status codes
response headers
redirect chain
cache headers
timing
payload type
```

A UI error may originate in HTTP behavior rather than component rendering.

## 16. Hard vs soft navigation matters

If the bug occurs only during client navigation:

```text
hard refresh works
soft navigation fails
```

investigate:

```text
Router Cache
RSC payload
preserved layouts
client state
navigation timing
prefetching
version skew
```

If only hard refresh fails, focus more on initial HTML/server rendering and route bootstrapping.

## 17. Reproduce with a clean browser environment

Extensions can mutate DOM or intercept network behavior.

When debugging hydration or script issues, compare:

```text
normal profile
incognito/clean profile
another browser
another device
```

Do not overfit a fix to extension-generated markup.

## 18. Hydration mismatch debugging is a diff problem

Ask what the server rendered and what the client expected on first hydration.

Common sources:

```text
Date.now()
Math.random()
locale-sensitive formatting
browser-only branches
invalid nesting
unstable third-party DOM mutation
```

Fix the divergent source rather than silencing warnings globally.

## 19. `suppressHydrationWarning` is narrow escape hatch

Use it only when a known value is expected to differ and the difference is intentionally contained.

It is not a general solution for hydration bugs.

## 20. Correlation IDs speed up support-driven debugging

A user-facing message can provide a safe reference:

```text
Something went wrong. Reference req_123.
```

Support can search:

```text
request ID
→ server error
→ trace
→ dependency spans
→ release
```

Never encode secrets into the reference ID.

## 21. Compare affected and unaffected populations

A strong incident question is:

```text
what is different about requests that fail?
```

Dimensions might include:

```text
route
release
region
runtime
browser family
device class
feature flag
tenant cohort
```

Use bounded dimensions and privacy-safe values.

## 22. Start with recent changes, but verify evidence

Deployments are common causes of incidents, but correlation is not proof.

Check:

```text
error-rate change by release
trace difference
config changes
dependency incidents
traffic shape
```

A rollback can be the right mitigation even before root cause is known.

## 23. Mitigation and root cause are different goals

Incident flow:

```text
stop user impact
      ↓
stabilize
      ↓
collect evidence
      ↓
find root cause
      ↓
fix permanently
```

Possible mitigation:

```text
rollback
feature disable
traffic shift
fallback mode
rate limit
dependency bypass
```

## 24. Preserve evidence before destructive debugging

Before restarting or clearing caches everywhere, capture:

```text
error samples
trace IDs
logs
metrics
release ID
cache behavior
request headers needed for diagnosis
```

A restart can remove the state that made the bug diagnosable.

## 25. Cache incidents need layer identification

Ask which layer is stale:

```text
Data Cache
Full Route / prerender output
Client Router Cache
CDN/proxy cache
browser cache
external provider cache
```

"Next.js cache issue" is too vague to debug.

## 26. Streaming incidents need proxy awareness

Symptoms:

```text
stream appears buffered
fallback never appears progressively
large delay then whole response arrives
```

Potential causes include:

```text
reverse-proxy buffering
compression behavior
hosting adapter
client network
application boundary placement
```

Confirm the deployment path before changing React code.

## 27. Route Handler debugging should use raw HTTP tools

Use a client that exposes the real protocol:

```bash
curl -v https://example.com/api/items
```

or:

```bash
curl -i -X POST ...
```

Inspect:

```text
status
headers
redirects
content type
body
CORS
cookies
```

## 28. Server Action debugging requires request and mutation context

Useful evidence:

```text
operation name
request ID
actor/tenant safe identifier
validation outcome
transaction result
revalidation result
redirect outcome
```

Do not log form bodies wholesale.

## 29. Proxy debugging needs matcher and routing evidence

When Proxy behavior surprises you, inspect:

```text
matcher
request path
prefetch headers
redirect/rewrite destination
request header mutations
response headers
execution order
```

A route-level symptom can originate before the route is selected.

## 30. `next info` belongs in framework bug reports

When you suspect a framework issue, capture reproducible environment information rather than only saying:

```text
Next.js is broken
```

A good report contains:

```text
minimal reproduction
Next.js version
Node version
OS/runtime
expected behavior
actual behavior
steps
relevant logs
```

## Incident runbook template

### Detect

What alert or user report identified the issue?

### Scope

Which routes, users, regions, browsers, or releases are affected?

### Mitigate

Can impact be reduced safely before root cause is known?

### Correlate

Find request/trace IDs and compare errors by release and route.

### Reproduce

Try production-mode local/staging reproduction.

### Isolate

Reduce to one route, dependency, runtime, or component boundary.

### Fix

Make the smallest evidence-backed change.

### Verify

Confirm metrics, traces, logs, and user workflow recover.

### Learn

Add regression tests, alerts, docs, or architecture changes.

## Senior interview questions

**Why is a bug that only appears under `next start` important?**  
Production mode enables behaviors such as optimized bundles, production error sanitization, and production rendering/caching that differ from development.

**What does `--debug-prerender` help with?**  
It makes prerender failures easier to diagnose with debugging-oriented build settings and more readable stack information. It is a diagnostic build mode, not a normal production artifact.

**Why are source maps tied to release identity?**  
A minified stack can only be mapped correctly with the exact source map generated for that bundle version.

## Exercise

Create a runbook for a bug where `/reports/[id]` works in development but fails only after deployment for some users. Include version capture, hard/soft navigation comparison, source maps, request/trace correlation, regional comparison, cache-layer analysis, mitigation, and verification.
