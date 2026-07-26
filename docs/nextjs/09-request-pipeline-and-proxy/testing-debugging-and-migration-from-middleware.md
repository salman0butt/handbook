---
title: Testing, Debugging & Migration from Middleware
description: Test Proxy matching and routing decisions, debug request-pipeline failures, and migrate legacy middleware.ts code to the Next.js 16 proxy.ts convention.
---

# Testing, Debugging & Migration from Middleware

Proxy bugs are routing bugs.

They often appear as:

```text
redirect loop
wrong tenant
unexpected 404
missing auth gate
broken prefetch
assets intercepted
headers missing
rewrite differs between hard and soft navigation
```

Testing should therefore focus on request **classification and outcomes**.

## Unit-test matcher behavior

Current Next.js exposes experimental Proxy testing utilities from:

```ts
next/experimental/testing/server
```

These APIs are experimental and must be labeled as such.

## `unstable_doesProxyMatch`

Use it to verify whether Proxy should execute for a request.

```ts
import { unstable_doesProxyMatch } from 'next/experimental/testing/server'
import { config } from '@/proxy'

expect(
  unstable_doesProxyMatch({
    config,
    nextConfig: {},
    url: '/dashboard',
  }),
).toBe(true)
```

Matcher tests are especially valuable for negative regex patterns and `has`/`missing` rules.

## Test actual Proxy results

The experimental server-testing helpers can also inspect redirects and rewrites.

Conceptually:

```text
construct NextRequest
→ call proxy(request)
→ inspect response
→ assert rewrite/redirect URL
```

Do not rely only on snapshots of matcher source text.

## E2E remains important

Proxy is integrated into navigation, prefetching, RSC transport, cookies, and deployment routing.

Use browser/E2E coverage for:

```text
hard reload
soft Link navigation
prefetch
Back/Forward
login redirect
logout flow
locale redirect
tenant hostname
API preflight
```

Phase 16 will own the full testing strategy.

## Test the request matrix

For every major policy, test dimensions such as:

```text
authenticated / anonymous
public / protected
GET / POST
normal navigation / prefetch
HTML / RSC navigation
known / unknown tenant
locale present / absent
valid / forged internal headers
```

## Debug the execution order

When routing is wrong, classify each stage:

```text
next.config headers
next.config redirects
Proxy
beforeFiles rewrite
filesystem route
afterFiles rewrite
dynamic route
fallback rewrite
```

Do not immediately blame the route component.

## Decision logging

During development or sampled production debugging, record a compact decision:

```json
{
  "requestId": "...",
  "pathname": "/dashboard",
  "proxyMatched": true,
  "decision": "redirect",
  "reason": "missing_session"
}
```

Avoid logging secret headers/cookies.

## Redirect-loop debugging

A loop usually means the destination still satisfies the redirect condition.

Inspect:

```text
original URL
redirect destination
cookie/session state
matcher coverage
canonicalization rules
locale prefix
trailing slash
```

Browser caching can preserve redirect behavior, so test with raw HTTP tools when necessary.

## Rewrite debugging

For rewrites, distinguish:

```text
visible browser URL
internal rewrite destination
matched filesystem route
rendered route
```

Log both visible and rewritten route context where safe.

## Header debugging

If a downstream Server Component cannot see a Proxy header:

1. Verify Proxy matched.
2. Verify you cloned request headers.
3. Verify you used `NextResponse.next({ request: { headers } })`.
4. Verify no later rewrite/config overwrites the value.
5. Inspect `headers()` downstream.

If the browser sees an internal header unexpectedly, check whether it was set as a response header instead.

## Cookie debugging

Separate:

```text
incoming Cookie header
request.cookies view
response.cookies changes
outgoing Set-Cookie
next request Cookie header
```

A cookie set on the response is not retroactively present in the incoming request.

## RSC rewrite debugging

If hard reload works but soft navigation fails after a rewrite, investigate whether custom HTTP proxy code is bypassing Next.js rewrite semantics.

Prefer `NextResponse.rewrite()` when the goal is framework route rewriting.

## Production-only issues

Proxy may behave differently behind real infrastructure because of:

```text
host normalization
forwarded headers
CDN caching
TLS termination
regional deployment
multiple instances
header-size limits
```

Reproduce with the same headers and host topology when possible.

## Migration: `middleware.ts` → `proxy.ts`

Next.js 16 deprecated the `middleware` file convention and renamed it to `proxy`.

The modern source:

```text
middleware.ts
→ proxy.ts
```

Function name:

```diff
-export function middleware(request) {
+export function proxy(request) {
```

## Codemod

Next.js provides a migration codemod:

```bash
npx @next/codemod@canary middleware-to-proxy .
```

Review the resulting diff rather than treating codemod output as the end of migration.

## Semantic migration review

The most valuable migration step is not renaming the file.

Ask whether old middleware logic should exist at all.

For each block, classify it:

```text
static redirect
→ next.config redirects

static headers
→ next.config headers

authoritative authorization
→ DAL / action / endpoint

locale/tenant routing
→ Proxy

complex data fetching
→ route/server layer
```

This often makes the new Proxy much smaller than the old Middleware.

## Historical runtime assumptions

Legacy Middleware tutorials often assume Edge-runtime restrictions.

Do not copy those assumptions into current Next.js 16 Proxy guidance.

Use the current stable Proxy runtime contract and verify third-party libraries against the actual deployment.

## Rename advanced flags

Older code may reference names such as:

```text
skipMiddlewareUrlNormalize
```

The current Proxy terminology uses:

```text
skipProxyUrlNormalize
```

Treat old names as migration history.

## Migration security audit

After migration, verify:

```text
matcher coverage unchanged intentionally
Server Function POST coverage
API route coverage
prefetch behavior
data-route behavior
auth gates
forwarded trusted headers
redirect allow-lists
```

A rename can coincide with matcher cleanup that accidentally removes protection.

## Migration performance audit

Measure before and after:

```text
invocation count
p95 latency
remote dependency calls
asset invocations
prefetch invocations
log volume
```

Use the migration as an opportunity to narrow Proxy scope.

## Common mistakes

### Renaming only

The code may preserve outdated architecture.

### Treating experimental test APIs as stable

They can change; keep them isolated in test utilities.

### Testing only hard reloads

App Router soft navigation and prefetch matter.

### Logging full cookies

Security incident waiting to happen.

### Assuming old Edge limitations

Current Proxy runtime semantics have changed.

## Debugging runbook

For a production Proxy incident:

1. Capture request ID and exact URL.
2. Confirm deployed version/commit.
3. Reconstruct headers/cookies safely.
4. Check matcher outcome.
5. Check `next.config` redirects/rewrites.
6. Identify Proxy outcome.
7. Verify destination route.
8. Compare hard and soft navigation.
9. Check CDN/reverse-proxy behavior.
10. Roll back matcher/routing changes if blast radius is high.

## Interview questions

**What should be tested first in Proxy?**  
Matcher coverage and routing outcomes, because incorrect classification determines whether the rest of the function runs at all.

**Is the middleware-to-proxy migration only a rename?**  
No. The rename is a prompt to move static config, business logic, and authoritative authorization to more appropriate layers.

**Why can hard reload and client navigation differ around rewrites?**  
App Router navigation uses RSC transport metadata, so custom proxying that bypasses framework rewrite semantics can break only the soft-navigation path.

## Exercise

Take a legacy `middleware.ts` that performs:

- auth DB query
- locale redirect
- static CSP headers
- `/old/*` redirects
- tenant rewrite
- analytics POST

Create a migration plan that assigns each responsibility to its best current layer, then write the Proxy test matrix.