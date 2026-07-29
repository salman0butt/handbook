---
title: Security
---

# Security

Security is layered risk reduction across input, identity, process capability, dependencies, secrets, network, data, and operations.

## Injection

Parameterized SQL prevents user data becoming SQL syntax. For Mongo-style query objects, do not merge arbitrary client operators. For child processes, avoid shells and validate arguments. For file access, map identifiers to server-owned paths and verify containment.

## SSRF

Server-side fetch endpoints can become proxies into cloud metadata, localhost, private networks, or internal control planes. Validate destination policy after parsing; account for redirects, DNS rebinding/resolution, IP ranges, protocols, and proxy behavior.

## Prototype pollution / unsafe object merge

Treat attacker-controlled keys as data, not trusted configuration structure. Avoid unsafe deep merges and protect sensitive property names/prototypes.

## XSS / CSRF / CORS

Server-rendered HTML must context-escape untrusted values. CSRF matters when browsers automatically attach credentials. CORS controls which browser origins may read/call resources; it is not server authentication and does not stop non-browser clients.

## Secrets

Use a secret manager/deployment injection, minimize scope, rotate, audit access, and never log credentials. Environment variables can be practical but are still sensitive process data.

## TLS and headers

Use HTTPS, current TLS policy, HSTS where appropriate, content-type correctness, CSP for rendered web apps, anti-sniffing/framing policies as needed, and explicit proxy trust.

## Dependency/supply chain

Review package ownership, lockfiles, install scripts, provenance, transitive graph, advisories, update policy, and CI publishing permissions.

## Permission Model

✅ Current Node Permission Model is stable and can restrict filesystem, network, child process, workers, native addons, WASI/FFI, and inspector capabilities. **It explicitly is not a sandbox against malicious code.** Combine it with containers, OS users, filesystem/network controls, seccomp/policies, and least privilege.

## Threat-model question

For every privileged capability ask: *what input can influence this capability, what identity authorizes it, and what boundary still holds if application code is compromised?*
