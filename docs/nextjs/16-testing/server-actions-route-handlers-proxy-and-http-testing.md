---
title: Server Actions, Route Handlers, Proxy & HTTP Testing
sidebar_position: 4
description: Test mutations and request boundaries across Server Actions, Route Handlers, Proxy, redirects, cookies, validation, security, and current experimental Next.js testing helpers.
---

# Server Actions, Route Handlers, Proxy & HTTP Testing

Mutation and HTTP tests should prove **observable contracts**, not implementation calls.

A useful split is:

```text
validation / policy / command logic → unit
DB + integration adapters           → integration
HTTP / browser-visible contract     → E2E or request-level test
```

## 1. Server Actions are callable server entry points

A Server Action should be tested with the same seriousness as an HTTP mutation boundary.

Cover:

```text
authentication
authorization
validation
expected domain error
unexpected failure
idempotency
freshness/revalidation
redirect/cookie effects
```

Do not rely on the form UI as the only security test.

## 2. Extract action logic where possible

Instead of making the Action own every concern:

```ts
'use server'

export async function createProject(formData: FormData) {
  // everything inline
}
```

prefer a thin transport boundary:

```ts
'use server'

export async function createProject(formData: FormData) {
  const session = await requireSession()
  const input = parseCreateProject(formData)
  return createProjectCommand({ session, input })
}
```

Then:

```text
parseCreateProject       → unit
createProjectCommand     → integration/policy
real form/action journey → E2E
```

## 3. Form validation tests

Test both valid and invalid `FormData`:

```ts
const data = new FormData()
data.set('name', '')
```

Assert stable returned state:

```text
field error code/message
no DB mutation
no redirect
```

Do not assert private validation-library internals.

## 4. Authorization belongs inside mutation tests

Minimum matrix:

```text
anonymous → denied
valid user → allowed if policy passes
wrong tenant → denied
insufficient role → denied
stale/removed permission → denied
```

Hide-button tests are not authorization tests.

## 5. Idempotency and duplicate submission

Simulate:

```text
same idempotency key twice
network retry
user double click
out-of-order response
```

Then assert:

```text
one durable effect
stable result/replay semantics
no duplicate side effect
```

## 6. Revalidation after mutations

Layer the test:

```text
unit → correct tag/path chosen
integration → persistence changes
E2E → refreshed/navigation state shows correct value
```

A spy on `revalidatePath()` is useful but not sufficient for critical user freshness.

## 7. Cookie effects

For login/logout/session changes, E2E can verify:

```text
login succeeds
protected route becomes available
logout clears access
back navigation does not restore authorization
server rejects stale browser state
```

Avoid asserting raw secret cookie values.

## 8. Route Handler request tests

Treat a Route Handler as an HTTP API contract.

For each endpoint test:

```text
method
status
content type
response schema
auth
validation
error codes
headers/cookies
rate-limit behaviour where owned
```

Example matrix:

| Case | Expected |
| --- | --- |
| valid POST | 201 |
| malformed JSON | 400 |
| invalid domain input | 422 or documented 4xx |
| anonymous protected request | 401 |
| authenticated but forbidden | 403 |
| duplicate conflict | 409 |
| unexpected server failure | safe 500 |

Use your documented semantics consistently.

## 9. Test with real `Request` where practical

A Route Handler can often be exercised with Web Request objects:

```ts
const request = new Request('https://example.test/api/projects', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ name: 'Alpha' }),
})
```

Then call the handler at a suitable integration boundary.

If the handler depends heavily on framework routing/runtime, prefer an actual HTTP request to a running Next.js app.

## 10. Request body edge cases

Cover:

```text
empty body
invalid JSON
wrong content type
oversized body
missing required field
unknown field
binary/form upload limits
body read only once
```

Body parsing is part of the public contract.

## 11. CORS tests

If you expose cross-origin endpoints, test:

```text
allowed origin
unapproved origin
OPTIONS/preflight
allowed methods
allowed headers
credentials policy
```

CORS does not replace authentication.

## 12. CSRF tests

For cookie-authenticated state-changing endpoints, include negative cross-origin scenarios.

For Server Actions, Next.js has framework Origin/Host protections, but your test suite should still prove the expected application behaviour through realistic form/action requests.

For custom Route Handlers, test whichever CSRF strategy your architecture owns.

## 13. Webhook tests

Webhook contract suite:

```text
valid signature → accepted
invalid signature → rejected
old/replayed timestamp → rejected according to policy
same event twice → deduped/idempotent
provider timeout/retry → safe replay
malformed payload → rejected
```

Use provider test vectors where available.

## 14. Redirect tests

For handlers/actions returning redirects, assert the public result:

```text
status/Location for HTTP
or
browser ends on intended route
```

Also test open-redirect protection:

```text
/internal/path → allowed
https://evil.example → rejected/defaulted
```

## 15. Proxy matcher testing

Next.js exposes experimental Proxy test utilities from:

```ts
next/experimental/testing/server
```

At the current baseline, `unstable_doesProxyMatch` can check matcher behaviour.

Example:

```ts
import { unstable_doesProxyMatch } from 'next/experimental/testing/server'

expect(
  unstable_doesProxyMatch({
    config,
    nextConfig,
    url: '/dashboard',
  })
).toBe(true)
```

This API is **experimental**.

Use it as focused matcher coverage, not as a stable foundation your entire suite depends on.

## 16. Test Proxy response behaviour

Current experimental helpers can inspect rewrites/redirects.

You can also invoke your Proxy with a `NextRequest` where practical and assert:

```text
continue
rewrite
redirect
request header forwarding
response cookie/header
```

Then retain E2E tests for critical request-front-door behaviour.

## 17. Proxy cannot prove authorization security

A test like:

```text
anonymous /admin → redirected by Proxy
```

is useful but incomplete.

Also test direct server operations:

```text
Server Action without permission → denied
Route Handler without permission → denied
DAL read for wrong tenant → denied
```

Proxy is defense in depth, not the sole security boundary.

## 18. Matcher regression tests

When Proxy matchers exclude:

```text
_next/static
_next/image
api
prefetch requests
specific public routes
```

add a table-driven test so a regex refactor does not silently expand or shrink coverage.

Remember Server Functions are handled as POST requests to the route where they are used, so matcher changes can alter which requests pass through Proxy.

## 19. `next.config` routing tests

Next.js also exposes experimental server testing utilities for `headers`, `redirects`, and `rewrites` from `next.config`.

These utilities only model the config fields they execute; they do **not** reproduce the entire filesystem/Proxy routing pipeline.

Treat their result as a focused config unit test, then use E2E for integrated routing.

## 20. HTTP contract tests should avoid implementation coupling

Prefer:

```ts
expect(response.status).toBe(409)
expect(await response.json()).toEqual({ code: 'PROJECT_EXISTS' })
```

instead of:

```ts
expect(projectService.create).toHaveBeenCalledWith(/* every internal field */)
```

The first protects the public API.

## 21. Test safe errors

Unexpected failures must not leak:

```text
stack traces
SQL
secrets
internal hostnames
provider tokens
```

A 500 test should assert a stable safe envelope and server telemetry separately.

## 22. Test post-response work separately

If a mutation uses `after()` for logging/analytics:

```text
user-visible mutation contract
≠
post-response observability contract
```

Do not make correctness depend on non-durable post-response work.

For durable side effects use the queue/outbox architecture and test that boundary.

## 23. Race and concurrency tests

For important mutations test:

```text
double submit
concurrent update
stale version
retry after timeout
late older response
```

Use database constraints/version checks/idempotency mechanisms rather than UI timing assumptions.

## Production checklist

- [ ] Actions have direct auth/authz tests
- [ ] validation covers malformed and domain-invalid input
- [ ] idempotency/retry paths are tested for critical mutations
- [ ] Route Handler status/schema contracts are explicit
- [ ] CORS/CSRF/webhook negative tests exist where applicable
- [ ] Proxy matcher tests are table-driven
- [ ] experimental Next testing helpers are isolated
- [ ] integrated E2E still covers critical routing/proxy outcomes
- [ ] safe 500 responses do not expose internals
- [ ] revalidation is verified at a user-visible boundary

## Interview questions

### Why test a Server Action directly if the form already has E2E coverage?

Because the action is an independently reachable server boundary and must enforce validation and authorization itself. Direct lower-level tests make the security matrix faster and more exhaustive, while E2E proves composition.

### What is the limitation of `unstable_doesProxyMatch`?

It is an experimental helper focused on Proxy matcher behaviour. It does not replace integrated tests of the full request pipeline or server-side authorization.

### Why should Route Handler tests assert stable error codes?

Because clients need machine-readable contracts that survive message-copy changes and safely distinguish expected failures from unexpected server errors.
