---
title: npm & Package Management
---

# npm & Package Management

npm is a package manager and registry ecosystem; it is not part of the JavaScript language and should not be confused with the Node runtime.

## Dependency roles

- `dependencies`: needed when the package/application runs.
- `devDependencies`: build/test/development tooling.
- `peerDependencies`: compatibility contract expected from the consumer.
- `optionalDependencies`: installation failure may be tolerated by package design.

```json
{
  "scripts": {
    "test": "node --test",
    "start": "node src/server.js"
  },
  "engines": { "node": ">=24" },
  "workspaces": ["apps/*", "packages/*"]
}
```

## `npm install` vs `npm ci`

`npm install` may update dependency resolution/lock state. `npm ci` expects a lockfile-consistent clean install and is normally the correct CI/container command.

```text
package.json ranges
       +
package-lock.json concrete graph
       ↓
reproducible installation intent
```

A lockfile does not make dependencies safe; it makes the selected graph explicit and reviewable.

## Semantic version ranges

`^1.4.2` permits compatible changes within major 1; `~1.4.2` is narrower; exact pins select one version. Libraries and applications have different trade-offs. Blindly pinning everything prevents security/bug fixes; blindly widening everything increases change risk.

## Lifecycle scripts and supply chain

Install-time lifecycle scripts can execute code. Treat new dependencies as code execution decisions, not as harmless imports. Review package ownership, provenance, transitive dependencies, release history, install scripts, native builds, and registry source.

Useful controls include:

```bash
npm ci
npm audit
npm outdated
npm pack --dry-run
```

For high-assurance environments, consider script restrictions during review/build phases, private registries, provenance verification, SBOM generation, and automated update policies.

## Publishing

Before publishing a library, inspect the tarball, define `exports`, include declarations/source maps when promised, set semver intentionally, and publish from protected CI with provenance where supported.

**Senior rule:** dependency count is not the goal. Minimize **unowned capability and upgrade surface**.
