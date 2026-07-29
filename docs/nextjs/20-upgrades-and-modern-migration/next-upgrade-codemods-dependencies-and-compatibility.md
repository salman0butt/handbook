---
title: next upgrade, Codemods, Dependencies & Compatibility
sidebar_position: 2
description: Use Next.js upgrade tooling, codemods, dependency audits, type generation, and build evidence without outsourcing migration judgement to automation.
---

# `next upgrade`, Codemods, Dependencies & Compatibility

Modern Next.js provides first-party upgrade tooling, but automation changes syntax better than it proves system behavior.

The practical model is:

```text
tool-assisted transformation
+
manual semantic review
+
production validation
```

## 1. `next upgrade`

From Next.js 16.1+, the `next` CLI includes an upgrade command:

```bash
pnpm next upgrade
```

Useful variants include targeting a specific revision or release channel.

Use stable `latest` or an exact supported version for normal production upgrades.

## 2. Older versions use the codemod package

Projects on versions before the built-in upgrade command can use:

```bash
npx @next/codemod@canary upgrade latest
```

The upgrade flow can update framework packages and offer relevant transforms.

Always commit or branch before running automated transforms.

## 3. Run codemods on a clean working tree

Recommended flow:

```text
clean branch
→ lock baseline tests/build
→ run codemod
→ inspect diff
→ commit codemod-only changes
→ fix semantic issues separately
```

Do not mix large manual refactors into the same commit as generated changes.

## 4. Useful codemod controls

Codemods support options such as dry-run and printed output.

Use them when the transform touches sensitive code or a large monorepo.

A good workflow is:

```text
dry run
→ inspect representative changes
→ run transform
→ review every category of change
```

## 5. Important modern transforms

Current Next.js upgrade tooling includes migrations for concerns such as:

```text
async request APIs
middleware → proxy
next lint → direct ESLint CLI
old experimental PPR config removal
unstable_ prefixes of stabilized APIs
Turbopack config updates
```

Each transform addresses a specific framework change. Do not assume one codemod handles every architectural migration.

## 6. Async request API codemod

The async API migration can rewrite calls such as:

```ts
cookies()
headers()
draftMode()
```

and framework props such as `params` / `searchParams` where possible.

The transform may use `await` in server contexts or React `use()` where a synchronous component shape must consume a Promise.

Manual review is still required around:

```text
function signatures
shared helpers
client/server boundaries
tests
third-party wrappers
```

## 7. Middleware to Proxy codemod

The migration changes the convention from `middleware.ts` to `proxy.ts` and associated naming.

Do not interpret the rename as permission to keep adding application logic at the request front door.

After the transform, review:

```text
matchers
redirects/rewrites
header mutation
cookies
auth gating
prefetch exclusions
runtime assumptions
```

## 8. Lint migration

Next.js 16 removes `next lint` and no longer runs linting as part of `next build`.

Your CI must therefore invoke the chosen lint tool explicitly.

Example shape:

```json
{
  "scripts": {
    "lint": "eslint .",
    "build": "next build"
  }
}
```

Do not accidentally lose lint enforcement while upgrading.

## 9. Package updates are a dependency graph migration

The framework package is only one node.

Review:

```text
next
react
react-dom
@types/react
@types/react-dom
eslint-config-next
typescript
node runtime
test environment
build plugins
observability SDKs
auth libraries
```

For monorepos, include shared packages that compile against Next/React types.

## 10. Keep React versions compatible with Next.js

App Router uses framework-managed React integration.

Do not independently pin arbitrary React canary builds into production unless the framework documentation supports that combination.

When upgrading a major Next version, read its React requirements and upgrade React types together.

## 11. Type generation is useful migration evidence

Modern Next.js can generate route-aware type helpers through:

```bash
npx next typegen
```

Generated helpers can improve migrations around:

```text
PageProps
LayoutProps
RouteContext
```

This is especially valuable after async `params` / `searchParams` changes.

## 12. Lockfiles are part of reproducibility

A migration commit should update the lockfile intentionally.

Review unexpected dependency churn.

Questions:

```text
Did a transitive native package change?
Did multiple React copies appear?
Did a test library jump major versions?
Did an optional package become production-required?
```

## 13. Peer dependency warnings are signals

Do not suppress peer dependency warnings blindly.

Classify each as:

```text
safe stale declaration
actual incompatibility
unsupported package
duplicate React risk
tooling-only mismatch
```

Prefer upgrading or replacing packages whose compatibility is genuinely broken.

## 14. Native packages need runtime verification

Dependencies involving native binaries or platform-specific behavior deserve extra checks:

```text
image processing
database drivers
OpenTelemetry exporters
password hashing
canvas/media tooling
```

A build on one environment does not prove runtime compatibility on another architecture/libc/container base.

## 15. Bundler compatibility matters

Turbopack is the default for current Next.js dev and build.

If the old app depends on Webpack-specific configuration, classify each customization:

```text
still necessary
has Turbopack equivalent
package can be changed
must temporarily use --webpack
blocks upgrade
```

Do not keep Webpack forever because one historical loader was never re-evaluated.

## 16. Test framework upgrades separately when possible

A framework migration plus a Jest→Vitest migration plus a Playwright major upgrade produces too many simultaneous variables.

Prefer:

```text
framework upgrade first
→ preserve confidence system
→ modernize testing separately
```

unless the old tooling is itself incompatible.

## 17. Build plugins and wrappers need explicit review

Packages that wrap `next.config` can alter build behavior:

```text
bundle analyzers
Sentry/observability integrations
MDX/CMS plugins
PWA plugins
CSS-in-JS transforms
internationalization wrappers
```

Validate the final composed config, not each plugin in isolation.

## 18. Remove obsolete workarounds

Framework upgrades often make old hacks unnecessary.

Search for comments and config such as:

```text
TEMP Next 14 workaround
Webpack-only alias
legacy hydration fix
manual polyfill
experimental flag
```

Every workaround should have an owner and reason to survive the upgrade.

## 19. Codemod review checklist

After automation, inspect:

```text
imports
async boundaries
function signatures
runtime directives
route config
cache behavior
Proxy matchers
lint scripts
removed config
client bundle boundaries
```

Generated code is not automatically correct code.

## 20. CI matrix during a major upgrade

For high-risk systems, temporarily test:

```text
current production branch
migration branch
representative Node/runtime target
production build
critical browser flows
```

This makes before/after regressions visible before traffic moves.

## 21. Commit structure

A reviewable migration often looks like:

```text
commit 1: upgrade packages + lockfile
commit 2: official codemods
commit 3: manual API fixes
commit 4: cache/runtime behavior migration
commit 5: remove compatibility workarounds
commit 6: production regression fixes
```

Exact structure varies, but separation improves debugging.

## Senior rule

Use automation to reduce mechanical work.

Never delegate semantic ownership of:

```text
security
caching
rendering
runtime compatibility
production rollout
```

to a codemod.