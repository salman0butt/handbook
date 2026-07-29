---
title: CI/CD
---

# CI/CD

A Node pipeline turns source + lockfile + runtime version into a tested, traceable artifact.

```text
checkout
 ↓
pin Node + npm
 ↓
npm ci
 ↓
lint / typecheck
 ↓
tests
 ↓
build
 ↓
security / provenance checks
 ↓
artifact/container
 ↓
deploy gates
 ↓
verify / rollback
```

## Reproducibility

Use `npm ci` with committed lockfiles and explicit Node versions. Cache downloaded package data carefully; do not reuse mutable `node_modules` across incompatible runtime/architecture assumptions.

## Security checks

Include dependency advisories/policy, secret scanning, license/SBOM/provenance controls as appropriate, and protected publishing/deployment credentials.

## Tests

Run fast suites on every change and integration/e2e/load/security suites at appropriate gates. A green unit test suite does not validate a broken Dockerfile or migration.

## Artifacts

Build once and promote the same immutable artifact between environments where possible. Rebuilding per environment creates supply-chain/config drift.

## Migrations

Schema migrations need compatibility with old/new application versions during rolling deploys. Prefer expand/contract rather than a breaking migration plus synchronized instant cutover.

## Rollback

Rollback code only if data/schema changes remain compatible. Some releases require roll-forward repair instead; decide before deployment.
