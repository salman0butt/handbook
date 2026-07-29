---
title: Permissions & Runtime Hardening
---

# Permissions & Runtime Hardening

✅ The Node Permission Model is stable in current supported releases where documented. It can restrict process capabilities, but Node explicitly describes it as a **seat belt for trusted code, not a sandbox for malicious code**.

```bash
node --permission --allow-fs-read=/app/config src/server.js
```

Current Node 26 documentation includes restrictions/allowances around filesystem access, network access, child processes, worker threads, native addons, WASI, FFI, and inspector behavior.

## Threat model

Permissions reduce accidental capability use and can constrain some trusted components. They do not replace:

- unprivileged OS user;
- container/VM isolation;
- filesystem ACLs/mount policy;
- network policy/firewall;
- seccomp/capability controls;
- secret separation;
- dependency review.

## Important constraints

Permission initialization and inheritance have documented caveats. Some startup flags can read files before normal permission initialization, workers have specific model behavior, and native/FFI capabilities can undermine assumptions. Recheck the exact Node version docs before relying on a flag.

## Layered hardening

```text
application validation/authz
        ↓
Node permission restrictions
        ↓
OS user/filesystem/network policy
        ↓
container/VM/cloud identity boundary
```

## Production rollout

1. inventory actual runtime capabilities;
2. enable restrictions in staging;
3. grant only required paths/hosts/process features;
4. test startup, logging, source maps, native modules, workers, health checks;
5. monitor `ERR_ACCESS_DENIED` failures;
6. document exceptions.

Do not grant broad permissions until the model becomes equivalent to running without it.
