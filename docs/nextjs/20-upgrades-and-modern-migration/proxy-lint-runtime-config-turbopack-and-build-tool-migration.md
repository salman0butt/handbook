---
title: Proxy, Lint, Runtime Config, Turbopack & Build-Tool Migration
sidebar_position: 4
description: Migrate middleware to Proxy, remove obsolete runtime config and lint integration, adopt Turbopack deliberately, and preserve production behavior while build tooling changes.
---

# Proxy, Lint, Runtime Config, Turbopack & Build-Tool Migration

Major framework upgrades frequently change build and request infrastructure at the same time.

Treat these changes as separate migration tracks even when one codemod touches them together.

## 1. `middleware.ts` → `proxy.ts`

Next.js 16 deprecates the old Middleware convention in favour of `proxy.ts`.

The rename reinforces the intended role:

```text
request front door
→ lightweight routing/gating/header policy
→ continue to route/app
```

It should not become a general business-service layer.

## 2. Run the official migration, then review semantics

The codemod can rename the convention and update related symbols.

Afterward verify:

```text
matcher coverage
has/missing rules
prefetch exclusions
redirect destinations
rewrite destinations
header forwarding
cookie changes
CORS/CSP behavior
auth gating
```

A file rename is not a behavior proof.

## 3. Re-check runtime assumptions

Modern `proxy.ts` uses the Node.js runtime contract.

Legacy code may have accumulated Edge-specific assumptions or workarounds.

Classify:

```text
Edge-only workaround → remove/replace
Node-compatible library → verify
Web API usage → usually fine, still test
native/Node dependency → package/runtime review
```

Do not preserve stale Middleware-era runtime folklore.

## 4. Keep authorization in secure server boundaries

Proxy can perform optimistic gating such as:

```text
no session cookie → redirect to sign-in
```

But secure authorization remains in DAL/command/handler/action boundaries.

Migration must not move access control solely into Proxy.

## 5. `next lint` is removed

Next.js 16 removes the `next lint` command.

Also, `next build` no longer runs linting for you.

CI should explicitly run the chosen linter:

```bash
pnpm lint
pnpm test
pnpm build
```

This preserves independent failure signals.

## 6. Remove old `eslint` config from `next.config`

Legacy configuration such as framework-owned lint build settings should be deleted where no longer supported.

Keep lint policy in your actual ESLint/Biome configuration and CI scripts.

## 7. Runtime config removal

Legacy `serverRuntimeConfig` and `publicRuntimeConfig` are removed in current Next.js.

Use environment variables and explicit runtime configuration patterns instead.

Server-only:

```ts
const dbUrl = process.env.DATABASE_URL
```

Browser-exposed values must be deliberately public and understood as build-time values when using `NEXT_PUBLIC_`.

## 8. Do not replace runtime config with accidental secret exposure

Bad migration:

```text
old publicRuntimeConfig
→ rename every value NEXT_PUBLIC_*
```

That can expose server-only secrets.

Instead classify every config value:

```text
secret server value
public build-time value
public runtime value delivered by explicit endpoint/config document
```

## 9. Turbopack is the current default

Next.js 16 uses Turbopack by default for `next dev` and `next build`.

Legacy Webpack configuration deserves a migration inventory.

Search for:

```text
webpack(config)
custom loaders
aliases
DefinePlugin
ProvidePlugin
raw-loader/file-loader patterns
module rules
bundle plugins
```

## 10. Classify each Webpack customization

Use four outcomes:

```text
obsolete → remove
framework-native alternative → migrate
package-native solution → migrate
still blocking → temporarily use --webpack with tracked owner
```

The last state should be temporary and visible.

## 11. Test server and client bundling separately

A bundler migration can affect:

```text
client chunking
server package bundling
CSS processing
asset handling
conditional exports
ESM/CJS interop
native dependencies
```

A homepage rendering correctly does not prove Route Handlers or Server Actions bundle correctly.

## 12. `serverExternalPackages`

If a package must use native Node resolution rather than be bundled into server output, current Next.js provides `serverExternalPackages`.

Use it intentionally for compatibility, not as a blanket fix for every bundler error.

Questions:

```text
Why must this package be external?
Is it present in the production artifact?
Does standalone tracing include what it needs?
Is the runtime ABI compatible?
```

## 13. Config migration should shrink, not grow

A mature upgrade often removes config.

Framework defaults improve over time.

If the new config is larger than the old config, review whether obsolete compatibility logic was copied forward unnecessarily.

## 14. Validate production scripts

Check scripts such as:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint ."
  }
}
```

Remove historical flags unless they remain justified.

## 15. Verify environment parity

A build-tool migration may behave differently across:

```text
macOS dev
Linux CI
container runtime
serverless platform
monorepo root
workspace package symlinks
```

Reproduce on the real production target before rollout.

## 16. Check monorepo package boundaries

For local packages, verify current `transpilePackages` needs and package `exports`.

A framework upgrade is a good time to stop importing package internals by filesystem path.

## 17. Remove old polyfills and transpilation assumptions

Modern Next.js browser/runtime support may make historical polyfills unnecessary.

Search for:

```text
custom Babel config
polyfills loaded globally
legacy browser transforms
old node-fetch shims
manual React JSX transform settings
```

Remove only with evidence and browser/runtime support review.

## 18. CI build cache invalidation

When framework, lockfile, Node version, or bundler config changes, invalidate stale CI caches appropriately.

Do not debug a new compiler against artifacts produced by the old compiler.

## 19. Production validation matrix

After infrastructure migration, test:

```text
cold build
incremental dev navigation
production start
standalone artifact if used
Proxy matched and unmatched requests
Server Actions
Route Handlers
static assets
image optimization
source maps/telemetry
```

## 20. Rollback implications

A bundler/config migration is usually easy to roll back if artifacts are immutable.

It becomes difficult when mixed with incompatible:

```text
DB migrations
cache schema changes
public API changes
asset deletion
```

Keep infrastructure migration commits deployably reversible where possible.

## Senior review checklist

- [ ] Proxy semantics tested, not merely renamed
- [ ] authorization still enforced in secure server boundaries
- [ ] lint remains an explicit CI gate
- [ ] removed runtime config replaced without exposing secrets
- [ ] every Webpack customization classified
- [ ] Turbopack production build passes
- [ ] server/client/native package behavior verified
- [ ] stale build caches invalidated
- [ ] rollback artifact exists

Modernization should reduce accidental framework ownership in your application, not create a new layer of build hacks.