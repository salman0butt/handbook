---
title: Environment Variables, Secrets, Build-Time & Runtime Configuration
sidebar_position: 4
description: Operate environment-specific configuration safely across builds and runtimes, separate public values from secrets, promote one artifact, validate startup config, and rotate credentials without accidental client exposure.
---

# Environment Variables, Secrets, Build-Time & Runtime Configuration

Production configuration becomes dangerous when engineers do not know **when** a value is read and **where** it can appear.

Use this model:

```text
source-controlled config
+ build-time environment
+ runtime environment
+ request-time context
→ final application behaviour
```

## 1. Server variables are private by default

Normal environment variables are available to server-side code.

```ts
const databaseUrl = process.env.DATABASE_URL
```

That does **not** automatically make the value safe.

A secret can still leak if server code:

- serializes it into Client Component props
- returns it from a Route Handler
- logs it
- puts it in metadata
- embeds it into generated HTML

Environment placement is only the first security boundary.

## 2. `NEXT_PUBLIC_` means browser-visible

Values prefixed with `NEXT_PUBLIC_` can be inlined into client JavaScript during `next build`.

Example:

```text
NEXT_PUBLIC_ANALYTICS_ID
NEXT_PUBLIC_SITE_ORIGIN
```

Treat every such value as public.

Never put secrets into a public-prefixed variable.

## 3. Public values are normally frozen at build time

A crucial deployment consequence:

```text
CI builds image with NEXT_PUBLIC_API_ORIGIN=A
  ↓
same image promoted to staging and production
  ↓
client bundle still contains A
```

Changing the runtime environment does not rewrite already-built browser JavaScript.

This matters for artifact promotion.

## 4. Promote one image with runtime server config

Server-side runtime values can support:

```text
one image
→ staging DB/service config
→ production DB/service config
```

when those values are evaluated at runtime on the server.

That improves provenance because staging and production can run the same tested artifact.

But public client configuration needs a deliberate design.

## 5. Runtime public configuration pattern

If a browser truly needs environment-specific data at runtime, one architecture is:

```text
browser
  ↓
server-owned config endpoint / rendered bootstrap data
  ↓
allow-listed public values only
```

Do not expose `process.env` wholesale.

Define an explicit public configuration schema.

## 6. Dynamic rendering can read runtime server variables

Current App Router guidance supports reading runtime environment variables during server request-time rendering.

The conceptual rule:

```text
build-time prerender → value may be captured at build
request-time dynamic render → server can read current runtime env
```

If runtime configuration must vary after image promotion, ensure the code path is actually request-time rather than statically prerendered.

## 7. Startup validation

Fail early when required configuration is invalid.

Bad:

```ts
const url = process.env.DATABASE_URL!
```

The non-null assertion does not validate runtime configuration.

Better architecture:

```ts
function requireEnv(name: string) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required configuration: ${name}`)
  return value
}
```

Production systems often use a schema validator to verify:

- required keys
- valid URLs
- enum values
- numeric ranges
- mutually exclusive options

Do not print secret values in the validation error.

## 8. `instrumentation.ts` and startup initialization

Server startup instrumentation is a suitable place for carefully scoped initialization such as:

- telemetry SDK setup
- configuration validation
- runtime-specific initialization

Avoid turning startup into a large network waterfall that makes every instance slow or fragile to boot.

## 9. Secret source

Prefer a secret manager/runtime injection mechanism over committed `.env` files for production.

Possible sources include:

```text
cloud secret manager
container/orchestrator secret
vault
managed platform environment setting
CI secret only for build-time credentials
```

The implementation is platform-specific; the principle is not.

## 10. `.env` files

Local `.env` files are useful for development, but production should have an explicit secret/configuration delivery system.

Never commit sensitive environment files.

Keep examples as placeholders:

```text
.env.example
```

with values such as:

```text
DATABASE_URL=
AUTH_SECRET=
```

not real credentials.

## 11. Build-time credentials

Some builds fetch private content or packages.

Examples:

- private npm registry token
- CMS build token
- source-map upload token

These credentials should be available only to the build process that needs them and should not persist in:

- browser bundles
- final container layers
- logs
- uploaded build artifacts

Use secret mounts/build-system secret facilities where possible rather than Docker `ARG`/`ENV` patterns that preserve sensitive values in image history.

## 12. Runtime secrets

Examples:

```text
DB password
session signing secret
payment provider key
private API credential
webhook verification secret
Server Action encryption key
```

Inject them into the server runtime.

Do not copy production secrets into developer laptops merely because the application expects environment variables.

## 13. Rotation

Every important secret should have a rotation story.

Ask:

```text
Can old and new keys overlap?
Does rotation invalidate sessions?
Do replicas receive new value simultaneously?
Does a restart pick up the new secret?
Can active requests survive rotation?
How is rollback handled?
```

A secret is not operationally mature if nobody knows how to change it.

## 14. Zero-downtime key rotation

Some protocols support key rings:

```text
current signing key
+ previous verification key
```

That allows new data to use the new key while old tokens remain verifiable during a controlled overlap.

Whether this is appropriate depends on the protocol/library.

Do not invent dual-key behaviour for a system that does not support it.

## 15. Server Action encryption key

In multi-instance deployments, all instances for the same build need compatible Server Action encryption state.

Current Next.js self-hosting guidance documents `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` for consistent encryption across instances/build processes.

Operational rules:

- generate strong key material
- keep it secret
- build all replicas consistently
- coordinate rotation with deployment/version policy
- do not expose the key in logs or browser data

## 16. Configuration versioning

Track non-secret configuration separately from code when appropriate.

A production incident should be answerable:

```text
which code release?
which image digest?
which config revision?
which secret version?
```

Observability needs safe identifiers—not secret values.

## 17. Feature flags

Feature flags are runtime configuration with product consequences.

Design for:

- default value
- fail-open/fail-closed policy
- tenant/user targeting
- server/client consistency
- rollout percentage
- audit history
- stale cache implications

Do not put authorization rules solely into client feature flags.

## 18. Environment-specific URLs

Common risky values:

```text
APP_ORIGIN
API_ORIGIN
AUTH_CALLBACK_URL
ASSET_HOST
```

Validate them as URLs and avoid string concatenation that produces open redirects or wrong-host callbacks.

## 19. Configuration drift

Two replicas in one deployment should not silently have different critical config.

Detect drift using safe hashes/version IDs for non-secret config.

Example telemetry dimension:

```text
config_revision=cfg-42
```

Never hash a low-entropy secret and expose the hash as a “safe” identifier; it may still aid guessing.

## 20. Production debug dumps

Do not create endpoints that return all environment variables for diagnostics.

Safe diagnostics can report:

```text
required DB config present: true
release id: abc123
config revision: 42
runtime: nodejs
region: eu-west
```

not credentials.

## 21. Logs

Redact:

- `Authorization`
- cookies
- API keys
- signed URLs where sensitive
- database connection strings
- secret-bearing query params

Remember that exception objects from SDKs can include request headers or connection information.

## 22. Runtime configuration and caching

If output varies by configuration, consider whether cached output remains valid after config changes.

Example:

```text
pricing flag changes
cached page still contains old pricing
```

The config rollout and cache invalidation policy must agree.

## 23. Runtime configuration and multi-tenancy

Tenant configuration belongs to authorized data access, not global environment variables, when it differs per tenant.

Bad:

```text
one global TENANT_ID env
```

for a multi-tenant request-serving process.

Derive tenant context from trusted request/session/domain mapping and fetch scoped config from an authorized source.

## 24. Common mistakes

### Assuming runtime `NEXT_PUBLIC_` changes affect existing bundles

They usually do not; the value was inlined at build.

### Validating only locally

Production needs startup/runtime validation too.

### Sharing a `.env.production` file manually

Use controlled secret/config delivery and auditability.

### Logging config objects

Even “debug” logs can leak secrets.

### Rebuilding the same release for each environment because public config differs

Consider whether runtime public config is a better architecture—or deliberately accept environment-specific builds and record them as separate artifacts.

## Production checklist

- [ ] every variable classified build-time/runtime/request-time
- [ ] every `NEXT_PUBLIC_` value intentionally public
- [ ] runtime server config validated
- [ ] public runtime config allow-listed explicitly
- [ ] secrets injected through controlled infrastructure
- [ ] build secrets absent from final artifacts
- [ ] rotation procedure exists
- [ ] config revision visible in telemetry
- [ ] replicas cannot drift silently on critical config
- [ ] logs/errors redact sensitive values
- [ ] cache invalidation considered when config changes

## Interview questions

### Why can one Docker image be promoted across environments for server config but not automatically for `NEXT_PUBLIC_` values?

Because server runtime variables can be read when the server executes, while `NEXT_PUBLIC_` values are typically inlined into browser bundles during `next build`.

### Why should required env values be validated at startup?

It converts a delayed production failure into a clear deployment failure, improving readiness and preventing traffic from reaching a misconfigured instance.

## Exercise

Create a configuration inventory with columns:

1. name
2. secret/public
3. build/runtime/request time
4. owner
5. source
6. validation rule
7. rotation method
8. restart required?
9. cache invalidation required?
10. telemetry-safe revision identifier
