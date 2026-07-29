---
title: Dependency & Supply-Chain Security
---

# Dependency & Supply-Chain Security

A Node service executes code from its dependency graph, build tools, install scripts, CI actions, container base, registry, and publishing pipeline.

## Lockfiles and deterministic installs

Commit `package-lock.json`; use `npm ci` in CI/containers. Review lockfile changes with the same seriousness as source changes, especially new transitive packages and install scripts.

## Threats

- typosquatting/dependency confusion;
- maintainer/package takeover;
- malicious lifecycle script;
- compromised CI/publishing token;
- vulnerable transitive dependency;
- poisoned prebuilt native binary;
- secret committed into package/tarball;
- registry/config redirection.

## Audit is one signal

`npm audit` can identify known advisories but cannot prove a package is trustworthy or safe. Combine advisories with dependency inventory, update policy, provenance, code review, runtime least privilege, and incident response.

## Provenance

Where npm/CI provenance is supported, verify artifacts came from expected source/build workflows. Protect release branches, workflows, OIDC identities, and publisher permissions.

## SBOM and ownership

Generate an SBOM where required and know who owns critical dependencies. A high-risk abandoned auth/crypto/network package should have a replacement plan.

## Update policy

Automate regular small upgrades instead of rare giant jumps. Run compatibility/security tests, stage rollouts, and keep runtime majors supported.

## Registry configuration

Pin organization scopes/private registries deliberately and prevent unintended fallback to public packages where dependency confusion is possible.
