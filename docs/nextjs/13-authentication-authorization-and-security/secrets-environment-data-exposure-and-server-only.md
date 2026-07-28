---
title: Secrets, Environment Variables, Data Exposure & Server-Only Boundaries
description: Keep secrets and privileged code on the server, understand NEXT_PUBLIC build-time exposure, prevent accidental RSC/client serialization, and use server-only and tainting as defense in depth.
---

# Secrets, Environment Variables, Data Exposure & Server-Only Boundaries

A value can leak without ever appearing in a visible page.

In a Next.js application, sensitive information can cross boundaries through:

```text
Client Component bundles
RSC payloads
HTML
Route Handler responses
Server Action return values
metadata / JSON-LD
logs
analytics
cache entries
error messages
URLs
third-party scripts
```

Security requires intentional data classification and boundary control.

## Classify data before coding

A useful model:

### Public

Safe for anyone to know.

```text
public product title
public image URL
public documentation
browser analytics public ID
```

### User-private

Safe only for the authenticated user or authorized group.

```text
private profile data
invoices
organization settings
```

### Secret

Must not be delivered to the browser or untrusted clients.

```text
database password
API secret
OAuth client secret
session signing key
webhook signing secret
private key
password hash
```

### Security metadata

May not be a credential but still needs protection.

```text
internal risk score
fraud notes
account lock reason
recovery state
admin-only flags
```

## Environment variables are server-only by default

Next.js keeps ordinary environment variables on the server unless you explicitly expose them.

Example:

```env
DATABASE_URL=...
SESSION_SECRET=...
PAYMENTS_SECRET_KEY=...
```

Use them only in server-owned modules.

## `NEXT_PUBLIC_` means browser-visible

A variable prefixed with:

```text
NEXT_PUBLIC_
```

is intended for browser exposure and is inlined into client JavaScript at build time when referenced statically.

Therefore:

```env
NEXT_PUBLIC_ANALYTICS_ID=public-id
```

can be appropriate.

This is never appropriate:

```env
NEXT_PUBLIC_DATABASE_PASSWORD=...
NEXT_PUBLIC_SESSION_SECRET=...
NEXT_PUBLIC_STRIPE_SECRET_KEY=...
```

The prefix is an explicit data-exposure decision.

## Public environment values are build-time values

`NEXT_PUBLIC_` values are embedded during `next build`.

After building an artifact, promoting the same artifact between environments does not magically change those inlined values.

That matters for both correctness and security:

```text
staging public configuration
must not accidentally ship in production artifact
```

## Keep `.env*` files out of source control

The default `create-next-app` setup ignores local environment files.

Treat accidental secret commits as credential compromise, not a simple cleanup task.

Deleting the commit later may not remove the secret from:

- Git history
- forks
- CI logs
- caches
- local clones
- external scanners

Rotate exposed secrets.

## Server Components can read secrets — but can still leak them

This is safe only because the value stays on the server:

```ts
const apiKey = process.env.INTERNAL_API_KEY
await internalClient(apiKey)
```

This is unsafe:

```tsx
<ClientWidget apiKey={process.env.INTERNAL_API_KEY} />
```

because props crossing into Client Components are serialized to the client.

Server execution is not enough. Boundary output must be safe.

## RSC payloads are data transfer

The React Server Component payload carries information needed to reconcile the UI.

If you pass private values into client boundaries, assume the browser can inspect them.

Do not rely on “not visible on screen.”

## DTOs protect the boundary

Instead of returning the database model:

```ts
return user
```

return an intentional shape:

```ts
return {
  id: user.id,
  displayName: user.displayName,
  avatarUrl: user.avatarUrl,
}
```

The safest secret is the one never serialized.

## `server-only`

The Next.js data-security guide recommends using the `server-only` package to mark privileged modules.

```ts
import 'server-only'
```

If a client module imports that code, the build fails.

Use it in modules that contain:

- database access
- secrets
- privileged SDK clients
- session verification
- internal business/security logic

## Module graph boundaries matter

Suppose:

```text
lib/payments.ts
→ imports secret payment SDK

components/Checkout.tsx
→ 'use client'
→ imports lib/payments.ts
```

Without a guard, a refactor can accidentally pull unsafe dependencies toward the client graph.

`server-only` turns this into a build-time failure instead of a security review discovery.

## Do not expose secrets through error objects

Third-party SDK errors may contain:

```text
request headers
tokens
endpoint URLs
provider account IDs
raw payloads
SQL fragments
```

Avoid returning caught error objects directly to the browser.

Map them to a safe public error:

```ts
return {
  ok: false,
  message: 'Unable to complete request',
  requestId,
}
```

Log only a redacted internal form.

## Logs are a data boundary

Common accidental leaks:

```ts
console.log(request.headers)
console.log(formData)
console.log(session)
console.log(process.env)
console.log(providerResponse)
```

These may expose:

- cookies
- Authorization headers
- password/reset fields
- tokens
- secrets
- PII

Log structured safe fields instead.

## Redaction should happen before output

Do not rely only on a log backend to redact later.

Prefer application-level log schemas:

```ts
logger.info('auth_failed', {
  requestId,
  userId: safeUserId,
  reason: 'invalid_session',
})
```

rather than serializing entire objects.

## URLs are public-ish transport

Avoid secrets in:

```text
query strings
path segments
redirect URLs
analytics page locations
referer-bearing URLs
```

URLs may be stored in:

- browser history
- CDN logs
- server logs
- analytics
- screenshots
- referrer headers

Use one-time opaque tokens when a URL must carry a security artifact, and make them short-lived and single-use.

## Metadata is public output

`generateMetadata()` runs on the server but its result becomes page metadata.

Do not insert:

- private user data
- internal object IDs that should be secret
- access tokens
- unvalidated tenant names

into public metadata.

## JSON-LD is public output

Structured data should contain public SEO data only.

Authorization should happen before deciding what data can appear, and script-context-safe serialization still matters.

## Server Action return values cross the boundary

An action can safely use secrets internally.

But its return value may be serialized back to the client.

Bad:

```ts
return {
  providerResponse,
  token,
  internalUser,
}
```

Prefer:

```ts
return {
  ok: true,
  updatedAt: new Date().toISOString(),
}
```

## Route Handler responses are explicit public contracts

Before returning JSON, ask:

```text
which fields are required?
which are authorized?
which are safe for this caller?
which should never leave the service boundary?
```

Do not return ORM rows by default.

## Tainting is defense in depth

The current Next.js data-security guide documents React taint APIs behind experimental configuration.

Examples include:

```text
experimental_taintObjectReference
experimental_taintUniqueValue
```

They can help prevent selected objects or values from being passed to client components.

At the current handbook baseline, tainting remains experimental.

Use it as an additional layer, not as a replacement for DTOs and secure architecture.

## Tainting does not make data safe everywhere

Even if a value is blocked from a Client Component prop, it could still leak through:

```text
logs
Route Handler JSON
metadata
HTML generated through another path
third-party SDK calls
```

Security architecture must remain explicit.

## Client Components are browser-trust code

Client Components may render on the server during initial rendering, but their module graph and props must be safe for the browser.

Do not reason:

```text
this Client Component starts on the server
→ secrets are safe inside it
```

Client code is browser code.

## `client-only`

The complementary `client-only` package can prevent browser-specific modules from being imported into server environments.

This is primarily a correctness boundary, while `server-only` is especially useful for preventing privileged code from entering client graphs.

## Internal APIs and service credentials

When a Server Component or DAL calls an internal service:

```text
browser
→ Next.js server
→ internal API
```

keep service credentials server-side.

Do not forward arbitrary browser headers to the internal service.

Use an allow-list:

```text
request ID
explicit tracing metadata
safe locale
```

and add server-owned credentials separately.

## Authorization headers

Never forward incoming `Authorization` headers blindly to unrelated upstream services.

That can turn your application into a credential-confusion or token-leak boundary.

Define which token audience each service expects.

## Multi-tenant secrets

If tenants have per-tenant provider credentials:

- encrypt at rest through appropriate secret management
- authorize tenant before loading credential
- never send credential to client
- separate credential ID from secret value
- rotate independently
- audit usage

A tenant ID in a URL must not be enough to load that tenant's secret.

## Secret rotation

Design keys as rotatable resources.

Examples:

```text
session signing/encryption key
Server Action encryption key
webhook secrets
API credentials
OAuth client secrets
```

Rotation strategy may require:

- overlapping verification keys
- versioned key IDs
- staged deploy
- provider coordination
- session invalidation

Do not hard-code keys in source.

## Build-time vs runtime secret access

Some code runs during build/prerender.

Ask:

```text
Should this secret exist in the build environment?
Will build output embed derived sensitive data?
Is this route static when it should be request-time?
```

A secret used safely on the server can still produce unsafe build artifacts if the generated output contains private information.

## Static generation of personalized data is dangerous

Do not generate user-specific private pages at build time under a shared route assumption.

Authentication is request-specific.

Use request-time boundaries for personalized protected data and understand Cache Components behavior before caching it.

## Cache key security

If private data is cached, the cache identity must include every dimension that changes authorization:

```text
user
tenant
role/policy version
locale if output differs
resource
```

Often the safer approach is not to persistently cache final authorized personalized output.

## Browser devtools are not a security boundary

Assume users can inspect:

- network requests
- RSC payloads
- JavaScript bundles
- HTML
- storage
- source maps made public

If a secret depends on users not looking, it is already leaked.

## Source maps

Production source maps can reveal implementation details and sometimes embedded values.

Phase 14 covers observability and source-map operations. Security review should still verify who can access them and whether secrets were embedded during build.

## Secret-scanning and dependency policy

A mature pipeline may include:

- secret scanning
- dependency vulnerability scanning
- lockfile review
- build output inspection
- SBOM/provider controls

These are operational layers beyond Next.js but important to full-stack security.

## Audit checklist

1. Which env vars are prefixed `NEXT_PUBLIC_`?
2. Are any of them actually secrets?
3. Are `.env*` files ignored appropriately?
4. Which modules import database/provider credentials?
5. Are those modules marked server-only?
6. Which props cross into Client Components?
7. Do any Server Actions return internal objects?
8. Do Route Handlers return ORM records directly?
9. Do logs contain full request/session objects?
10. Are secrets ever placed in URLs?
11. Does static output contain personalized data?
12. Are private cache keys correctly isolated?
13. Are keys rotatable?

## Interview questions

**What does `NEXT_PUBLIC_` mean?**  
The value is intended for browser exposure and statically referenced values are inlined into client JavaScript at build time.

**Why use `server-only`?**  
It creates a build-time boundary preventing privileged server modules from being imported into the client module graph.

**Can Server Components leak secrets?**  
Yes. Server Components can safely use secrets internally, but values can leak if serialized into Client Component props, HTML, metadata, logs, or other public output.

## Exercise

Classify and place these values:

```text
DATABASE_URL
NEXT_PUBLIC_ANALYTICS_ID
payment provider secret
user email
password hash
public avatar URL
organization API credential
session ID
OAuth refresh token
feature flag
```

For each specify:

- classification
- storage location
- server/client availability
- serialization rule
- logging rule
- rotation requirement
- cache policy

## Primary references

- [Next.js Data Security guide](https://nextjs.org/docs/app/guides/data-security)
- [Next.js Environment Variables guide](https://nextjs.org/docs/app/guides/environment-variables)
- [Next.js Self-Hosting guide](https://nextjs.org/docs/app/guides/self-hosting)
