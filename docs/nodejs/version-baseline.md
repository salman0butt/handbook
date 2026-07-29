---
title: Current Node.js Release & LTS Baseline
---

# Current Node.js Release & LTS Baseline

**Research date:** 30 July 2026.

| Line | Lifecycle | Codename | Initial release | Maintenance | EOL | Handbook use |
|---|---|---|---|---|---|---|
| 26.x | Current | — | 5 May 2026 | scheduled 2027 | 30 Apr 2029 | newest runtime behavior; verify before production adoption |
| 24.x | Active LTS | Krypton | 6 May 2025 | starts 20 Oct 2026 | 30 Apr 2028 | **recommended production baseline** |
| 22.x | Maintenance LTS | Jod | 24 Apr 2024 | since 21 Oct 2025 | 30 Apr 2027 | supported legacy production line |
| 25.x | EOL | — | 15 Oct 2025 | — | Jun 2026 | ⚠️ migration-only |
| 20.x | EOL | Iron | 17 Apr 2023 | — | Apr 2026 | ⚠️ migration-only |

The Node.js releases page listed **v26.5.0** as Latest Release and **v24.18.0** as Latest LTS at the audit date. Patch releases change frequently, so production automation should pin or govern versions rather than copying this table forever.

## Version-sensitive features used in this handbook

- ✅ `node:test` is stable; 🧪 watch mode and built-in test coverage remain experimental in the v26.5.0 docs.
- ✅ Mock timers in `node:test` are stable.
- ✅ The Permission Model is stable, but it is a **seat belt for trusted code**, not a security sandbox. Current v26 permissions cover filesystem, network, child processes, workers, native addons, WASI, FFI, and inspector restrictions.
- ✅ `import.meta.dirname` and `import.meta.filename` are stable in supported lines where documented.
- 🧪 module syntax detection for ambiguous `.js` input is documented as release-candidate behavior; production packages should still set an explicit `"type"`.
- ✅ built-in TypeScript type stripping is stable in current Node, but it does **not** type-check and does not honor `tsconfig.json`. Node 26 removed the old `--experimental-transform-types` path; use erasable syntax or a real TypeScript build/runtime tool.
- ✅ `.env` parsing is available through `--env-file`, `--env-file-if-exists`, `process.loadEnvFile()`, and `util.parseEnv()` in current Node.

## Release policy mental model

```text
Current
  ↓ six-ish months of fast evolution
Active LTS
  ↓ production-focused support
Maintenance LTS
  ↓ critical fixes / reduced change
EOL
```

**Production rule:** prefer supported LTS, test upgrades before rollout, and treat a Node major upgrade as a runtime migration—not merely a package.json edit.

### Upgrade checklist

1. read the release notes and deprecations;
2. test native dependencies and package engines;
3. run unit/integration/e2e suites on old and new lines;
4. compare memory, latency, CPU, event-loop delay, and startup behavior;
5. canary the new runtime;
6. verify diagnostics and observability still work;
7. roll forward gradually and keep rollback available.
