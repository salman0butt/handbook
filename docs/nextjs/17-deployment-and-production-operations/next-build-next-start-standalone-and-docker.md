---
title: next build, next start, Standalone Output & Docker
sidebar_position: 2
description: Build and package production Next.js servers correctly with immutable artifacts, standalone output, file tracing, containers, and production-mode validation.
---

# `next build`, `next start`, Standalone Output & Docker

The production lifecycle is deliberately different from development.

```text
next dev   → developer feedback loop
next build → compile and produce production output
next start → run a completed production build
```

Never use development behaviour as proof of production behaviour.

## 1. `next build` is a release boundary

A production build catches classes of problems that development mode may not expose in the same way:

- route prerender failures
- server/client boundary errors
- static-generation constraints
- environment assumptions
- missing build dependencies
- asset generation
- type/build configuration failures
- production-only bundling problems

That is why Phase 16 treated a successful production build as a release gate.

## 2. Build once, deploy many instances

Preferred pattern:

```text
source commit
  ↓
CI next build
  ↓
immutable artifact/container image
  ↓
replica A
replica B
replica C
```

Avoid:

```text
replica A builds source itself
replica B builds source itself
replica C builds source itself
```

The replicas should run the same build output.

## 3. `next start`

For standard self-hosting:

```bash
pnpm build
pnpm start
```

Typical package scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

`next start` expects an existing production build.

Use environment/orchestrator configuration for host/port and process lifecycle rather than editing application code per environment.

## 4. File tracing

Next.js traces server dependencies during build so deployment tooling can understand which files are required by server output.

This solves a common Node deployment problem:

```text
application imports package A
package A loads native/file dependency B
naive deploy copies only app code
production crashes because B is absent
```

Output file tracing records required dependencies around server entrypoints.

## 5. Standalone output

Enable:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
}

module.exports = nextConfig
```

After `next build`, Next.js creates a minimal deployment tree under:

```text
.next/standalone/
```

including traced server dependencies and a minimal `server.js`.

This is useful for containers because the runtime image does not need the entire repository or a full `node_modules` tree.

## 6. Important standalone static-file detail

Standalone output does not copy all static/public assets into the minimal folder by default.

You may copy:

```text
public
.next/static
```

into the standalone tree if the Node server itself should serve them.

Or serve static assets from a CDN/object-storage layer.

Do not forget this step and then diagnose missing CSS/JS/images as a routing bug.

## 7. Minimal multi-stage Docker mental model

```text
stage 1: dependencies
stage 2: build
stage 3: runtime
```

A simplified pattern:

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable && pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

Treat this as a structural example, not a universal image recipe.

Native packages, libc choice, workspace layouts, build tooling, and security policy may require changes.

## 8. Do not ship build tools unnecessarily

A runtime image should contain what the server needs to run—not the full development environment.

Benefits:

- smaller transfer
- smaller attack surface
- faster image pull/start
- fewer irrelevant packages
- clearer artifact ownership

But never delete runtime dependencies simply to make the image smaller.

## 9. Build-time environment vs runtime environment

The build stage may require:

```text
public analytics/build IDs
feature compilation flags
private credentials used only to fetch build-time content
```

The runtime stage may require:

```text
DB URL
API secrets
session secrets
runtime service endpoints
```

Do not bake runtime secrets into image layers.

Container history and registry access can expose them.

## 10. `.dockerignore`

Exclude unnecessary/sensitive files such as:

```text
.git
.next
node_modules
local env files
editor caches
test artifacts
coverage
```

But ensure every required source/config file reaches the build stage.

## 11. Rootless/non-root runtime

Prefer a non-root runtime user when your platform/container policy supports it.

This reduces damage from a process compromise.

Your application should not require arbitrary filesystem writes just to serve normal traffic.

## 12. Writable filesystem assumptions

Container filesystems may be:

- ephemeral
- read-only
- instance-local

Do not use local disk as durable product storage.

Examples that need external storage:

- user uploads
- generated reports that must persist
- shared job artifacts
- durable cache across replicas/restarts

Next.js cache configuration is a separate concern from general file storage.

## 13. `outputFileTracingRoot` and monorepos

In monorepos, required runtime files can live outside the Next.js project directory.

If tracing scope does not include them, standalone packaging can omit files that development resolves successfully.

Review output tracing configuration when:

- workspace packages live above app root
- server loads shared templates/files
- native modules rely on external assets

Validate the produced artifact in an environment without the source tree mounted.

## 14. Never mount source as a hidden dependency

A deployment can appear healthy because the container/runtime accidentally sees repository files not included in the artifact.

Production test:

```text
artifact only
+ runtime env
+ external dependencies
→ app works
```

That proves packaging is real.

## 15. Container health is not page health

A running Node process does not prove:

- database connectivity
- cache availability
- migrations complete
- secrets valid
- external service reachable

Health/readiness design comes later in this phase.

## 16. Immutable image tags

Avoid relying only on mutable tags like:

```text
latest
production
```

Prefer traceable release identity:

```text
app:git-sha
app:release-2026-07-29.1
```

A human-friendly alias can point to it, but rollback needs an immutable artifact identity.

## 17. Dependency installation

CI builds should be reproducible.

Use a lockfile and frozen installation mode, for example:

```bash
pnpm install --frozen-lockfile
```

A deploy should not silently resolve newer dependency versions than the commit was tested with.

## 18. Native dependency compatibility

Packages involving:

- image processing
- database drivers
- crypto
- canvas
- compression

may depend on operating-system/native libraries.

The build environment and runtime image must be compatible.

A bundle that builds on macOS is not proof that a minimal Linux runtime image contains the right native libraries.

## 19. Production-mode smoke testing

Before promotion, run the actual packaged artifact and verify representative behaviour:

```text
start server
GET public route
GET protected route
perform one mutation
check static assets
check image route if used
check streaming if used
check health endpoint
check telemetry startup
```

This catches packaging problems unit tests cannot.

## 20. Artifact provenance

Record:

- Git SHA
- build ID
- deployment ID
- Next.js version
- Node version
- build timestamp
- CI run
- image/artifact digest

Expose safe release identity in telemetry.

Do not expose secrets or internal infrastructure unnecessarily in public HTML.

## 21. Common mistakes

### Running `next dev` in production

Development mode is not optimized or designed as the production server.

### Building inside every production pod

This creates skew, slower startup, network dependency on package registries, and weak provenance.

### Copying `.next` without understanding runtime dependencies

Use supported build output/tracing rather than guessing required files.

### Baking secrets into Docker image layers

Inject runtime secrets at runtime.

### Using local container disk for durable uploads

Use durable object/file storage.

## Interview questions

### What does `output: 'standalone'` solve?

It creates a minimal server deployment tree containing traced runtime dependencies and a minimal server entrypoint, which is particularly useful for container images.

### Why build once instead of building every replica?

All replicas should run identical manifests, assets, Server Function metadata, and build identity. Independent builds introduce unnecessary version skew and weaken reproducibility.

## Exercise

Design a three-stage container build for a monorepo Next.js application. Document:

1. which files enter the dependency stage
2. which env values are build-time only
3. which secrets are runtime-only
4. how standalone output is copied
5. how public/static assets are served
6. how release identity is recorded
7. how the artifact is smoke-tested before promotion
