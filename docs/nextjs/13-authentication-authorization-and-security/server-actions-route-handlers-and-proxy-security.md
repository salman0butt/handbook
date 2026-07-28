---
title: Server Actions, Route Handlers & Proxy Security
description: Secure every App Router entry point with validation, authentication, authorization, CSRF-aware origin policy, rate limits, and transport-specific failure handling.
---

# Server Actions, Route Handlers & Proxy Security

App Router security becomes much clearer when each server boundary is treated as a public entry point with its own contract.

The three boundaries most often confused are:

```text
Proxy
Server Actions
Route Handlers
```

They are complementary, not interchangeable.

## Security responsibility map

```text
Proxy
→ early routing / optimistic filtering / coarse policy

Server Action
→ React-driven mutation endpoint

Route Handler
→ explicit HTTP endpoint for arbitrary clients

DAL/domain service
→ authoritative authorization and business policy
```

## Server Actions are public mutation endpoints

The current Next.js data-security guidance says exported reachable Server Actions should be treated with the same security assumptions as public HTTP endpoints.

Do not assume an action is protected because:

- its button is hidden
- it lives in a private-looking module
- only one component imports it
- the route normally redirects anonymous users
- the action ID is difficult to guess

If reachable, the action must authenticate and authorize.

## Built-in action protections are defense in depth

Next.js provides framework protections including secure non-deterministic action IDs and dead-code elimination for unused actions.

These reduce attack surface.

They do not replace:

```text
input validation
authentication
authorization
resource scoping
rate limiting when needed
business invariants
```

## Validate Server Action input

Everything arriving from the client is untrusted.

```ts
'use server'

import { z } from 'zod'

const UpdateProject = z.object({
  projectId: z.string().uuid(),
  name: z.string().trim().min(1).max(120),
})

export async function updateProject(formData: FormData) {
  const input = UpdateProject.safeParse({
    projectId: formData.get('projectId'),
    name: formData.get('name'),
  })

  if (!input.success) {
    return { ok: false, message: 'Invalid input' }
  }

  // authenticate + authorize + mutate
}
```

Never accept fields that the caller should not control.

## Prevent mass assignment

Unsafe:

```ts
const values = Object.fromEntries(formData)
await db.user.update({ data: values })
```

An attacker may submit:

```text
role=admin
isVerified=true
billingStatus=paid
organizationId=other-tenant
```

Explicitly project allowed fields from validated input.

## Re-authorize inside the action

```ts
export async function updateProject(formData: FormData) {
  const input = parseProjectUpdate(formData)
  const actor = await requireActor()
  const project = await requireAuthorizedProject(actor, input.projectId)

  if (!canUpdateProject(actor, project)) {
    throw new Error('Forbidden')
  }

  // mutation
}
```

Do not rely on permission state captured when the page rendered minutes earlier.

## Closures are not a secret vault

Inline Server Actions can capture outer variables.

Next.js encrypts closed-over values sent to the client and back.

That is helpful, but the official guidance explicitly says not to rely on closure encryption alone to keep sensitive data from exposure.

Prefer loading sensitive/current data again on the server.

## Action encryption keys across instances

Self-hosted multi-instance deployments can configure:

```text
NEXT_SERVER_ACTIONS_ENCRYPTION_KEY
```

so action closure encryption remains consistent across instances/build behavior where required.

Treat this as a deployment encryption key with rotation and secret-management requirements.

It is not your user-session key.

## Server Action CSRF protections

Next.js Server Actions use POST and include origin checking.

The framework compares the request `Origin` with `Host` or `X-Forwarded-Host` and rejects mismatches.

For reverse-proxy architectures where the external and internal host topology differs, configure trusted origins using the current `serverActions.allowedOrigins` contract.

Do not broaden allowed origins casually.

## SameSite is helpful, not a universal CSRF strategy

Modern cookie defaults and SameSite behavior reduce many CSRF cases.

But your overall CSRF design must account for:

- cookie attributes
- cross-origin deployment
- embedded contexts
- custom HTTP endpoints
- reverse proxies
- provider callbacks
- browser behavior

Server Action protections do not automatically protect unrelated Route Handlers.

## Route Handlers are conventional HTTP security boundaries

For every protected handler:

```text
parse request
validate method/content type/input
authenticate
authorize resource/operation
apply rate/size/time controls
execute domain logic
return safe status/body/headers
```

Example:

```ts
export async function DELETE(
  request: Request,
  { params }: RouteContext<'/api/projects/[id]'>
) {
  const actor = await requireActor()
  const { id } = await params
  const project = await requireAuthorizedProject(actor, id)

  if (!canDeleteProject(actor, project)) {
    return new Response(null, { status: 403 })
  }

  await deleteProject(project.id)
  return new Response(null, { status: 204 })
}
```

## 401 and 403 at API boundaries

Use explicit semantics:

```text
401
→ authentication missing/invalid

403
→ authenticated but denied
```

Some resource-hiding APIs deliberately return 404 for unauthorized objects. If you adopt that pattern, document it consistently.

## CORS does not authenticate callers

CORS is browser enforcement around cross-origin JavaScript access.

It does not stop:

```text
curl
server-to-server clients
native applications
malicious backends
```

A Route Handler still needs real authentication and authorization.

## Preflight policy

If an API allows cross-origin browser clients, define:

- allowed origins
- allowed methods
- allowed request headers
- credentials behavior
- cache/Vary behavior

Avoid reflecting arbitrary `Origin` values when credentials are enabled.

## CSRF for Route Handlers

State-changing cookie-authenticated Route Handlers need explicit CSRF reasoning.

Possible controls include:

```text
SameSite policy
Origin validation
CSRF token
custom header requirements for first-party JS clients
re-authentication for sensitive actions
```

Choose based on protocol and client types.

## Bearer-token APIs change the CSRF model

If an API requires an `Authorization: Bearer ...` header not automatically attached by the browser, traditional cookie CSRF risk changes.

But token storage and XSS exposure become important.

Do not switch auth transport solely to “avoid CSRF” without considering the new threat model.

## Proxy is for optimistic front-door policy

Good uses:

```text
redirect anonymous request away from protected UI
route tenant subdomain
coarse maintenance/access policy
request-derived CSP nonce
shared request metadata
```

Avoid using Proxy as the only authorization layer.

## Keep Proxy checks cheap

The official auth guidance warns that Proxy runs broadly, including prefetched routes.

Prefer cookie/session verification without database authorization on every request when an optimistic decision is enough.

Secure database/resource checks belong closer to the operation.

## Matchers are security configuration

If your Proxy protects route classes, matcher changes deserve security review.

Test:

```text
protected page
nested protected page
prefetch
static assets
Route Handlers
auth callback
Server Action requests
basePath / locale if used
encoded/path edge cases
```

But remember: even perfect matcher coverage does not replace endpoint authorization.

## Forwarded headers require a trust model

At a reverse proxy, values such as:

```text
X-Forwarded-Host
X-Forwarded-Proto
X-Forwarded-For
```

are meaningful only when trusted infrastructure overwrites and controls them.

If public clients can inject trusted-looking forwarded headers, security checks can be bypassed.

## Host-header security

Be cautious when using `Host` to build:

- password-reset links
- OAuth callback URLs
- tenant identity
- canonical security decisions

Prefer configured trusted origins or provider/framework URL helpers.

## Request size limits

Identity and mutation endpoints can be abused with large bodies.

Apply appropriate controls at:

```text
reverse proxy/CDN
framework/runtime
Route Handler/parser
upload architecture
```

Large uploads often belong in direct object-storage flows rather than action payloads.

## Timeouts

Do not let security-sensitive endpoints wait indefinitely on:

- identity provider
- email provider
- database
- risk service
- external API

Use bounded timeouts and safe failure policy.

## Rate limiting is layered

```text
WAF / CDN
→ volumetric abuse

Proxy
→ broad route-class protection when useful

Route Handler / Action
→ identity/resource-specific policy

domain layer
→ business quotas
```

A global in-memory `Map` is not a distributed rate limiter.

## Webhook endpoints

Webhooks are public Route Handlers with different authentication.

Common pattern:

```text
raw request body
+ provider signature
+ timestamp / replay window
+ event ID dedupe
```

Do not parse and reserialize a signature-sensitive body before verification unless the provider protocol explicitly supports it.

## OAuth callbacks

Callbacks need:

```text
state verification
issuer/provider validation
safe redirect target
code/token exchange through hardened library
error normalization
rate/abuse monitoring
```

Treat callback URL parameters as attacker-controlled.

## Security headers

Static global security headers may fit `next.config.js`.

Request-derived policies such as a CSP nonce may require Proxy.

Endpoint-specific headers belong in the endpoint.

Choose the narrowest correct layer.

## Experimental `unauthorized` / `forbidden`

Next.js exposes experimental auth interrupts behind `experimental.authInterrupts`.

They can produce framework-managed 401/403 pages from Server Components, Server Functions, and Route Handlers.

At the current stable handbook snapshot they remain experimental and not recommended for production.

Use them only with explicit experimental adoption.

## Audit matrix

For every entry point document:

| Entry point | Validate | Authenticate | Authorize | CSRF/CORS | Rate limit | Safe output |
| --- | --- | --- | --- | --- | --- | --- |
| Server Action | yes | yes | yes | built-in + app policy | when needed | yes |
| Route Handler | yes | yes when protected | yes | explicit HTTP policy | when needed | yes |
| Proxy | request context | optimistic | coarse only | shared policy possible | coarse possible | headers/redirect/rewrite |
| Webhook | raw protocol | signature | event scope | usually not browser CORS | yes | ack only |

## Interview questions

**Why are Server Actions public security boundaries?**  
Because the client can invoke reachable actions over HTTP; UI placement and action IDs are not authorization.

**What does `allowedOrigins` solve?**  
It extends the framework's same-origin Server Action protection for trusted reverse-proxy/multi-host architectures. It should not become a wildcard substitute for authorization.

**Why can CORS not protect an API?**  
Because it is enforced by browsers, not arbitrary clients.

## Exercise

Threat-model these endpoints:

```text
Server Action: updateEmail
Server Action: deleteAccount
GET /api/profile
POST /api/invitations
POST /api/auth/callback
POST /api/webhooks/billing
```

For each specify:

- authentication mechanism
- resource authorization
- validation schema
- CSRF model
- CORS policy
- rate limits
- timeout
- audit event
- public error response

## Primary references

- [Next.js Data Security guide](https://nextjs.org/docs/app/guides/data-security)
- [Next.js Authentication guide](https://nextjs.org/docs/app/guides/authentication)
- [Next.js Route Handlers](https://nextjs.org/docs/app/api-reference/file-conventions/route)
- [Next.js Proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)
