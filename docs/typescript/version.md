---
title: Current TypeScript Version
---

# Current TypeScript version

## Stable baseline

**✅ TypeScript 7.0 — released July 8, 2026.**

TypeScript 7.0 is the first stable release of the native Go-based compiler and language-service generation. It preserves the language developers know while substantially changing the implementation and performance profile of the toolchain. The release announcement reports typical full-build speedups in the 8×–12× range on large real-world codebases, but performance gains depend on project shape and hardware.

### What changed materially for handbook readers

- ✅ The TypeScript language remains a static type system layered on JavaScript.
- ✅ `tsc` remains the canonical command-line type checker/compiler.
- ✅ TypeScript 7 uses the new native implementation and LSP-based editor integration.
- ⚠️ TypeScript 6.0 was the transition release and deprecated several legacy options/behaviors in preparation for 7.0.
- ⚠️ Guidance that depends on TypeScript 6's programmatic Compiler API must be treated separately.
- 🧪 TypeScript 7.0 introduces parallelism controls such as `--checkers` and `--builders` as experimental tuning knobs; they are not baseline recommendations.
- ✅ `--singleThreaded` is useful for diagnostics/reproducibility when investigating concurrency-sensitive performance behavior.

## Compiler API caveat in 7.0

TypeScript 7.0 does **not** ship a replacement programmatic Compiler API. Tooling that still needs the TypeScript 6 API can run TypeScript 6 side-by-side through the compatibility package while using the TypeScript 7 compiler for builds. This handbook therefore teaches compiler concepts as stable mental models, and labels concrete programmatic API examples as **version-sensitive** where they depend on the TypeScript 6 API surface.

## Current module-resolution guidance

```text
Node application/library
    → module: nodenext
    → moduleResolution: nodenext

Modern bundler application
    → module: preserve (or esnext when required)
    → moduleResolution: bundler
```

`node10` is legacy and should not be chosen for modern Node projects. `classic` should not be used.

## Current Node interoperability guidance

Modern Node versions have stable lightweight TypeScript type stripping. That runtime support does **not** perform TypeScript type checking and does **not** honor `tsconfig.json`. If you execute erasable TypeScript directly in Node, still run `tsc --noEmit` (or equivalent CI checking) as a separate correctness gate.

```text
node file.ts
   │
   ├─ runtime type stripping: removes erasable syntax
   └─ does NOT prove the program type-correct

npx tsc --noEmit
   └─ static program checking
```

## Release-channel policy

| Channel | Handbook treatment |
|---|---|
| stable | ✅ may be recommended |
| previous stable / migration bridge | ⚠️ migration context only when superseded |
| beta / RC | 🧪 version-sensitive |
| nightly / `next` | 🧪 experimentation only |
| removed legacy behavior | ⛔ excluded from modern baseline except migration notes |

The final completeness audit re-checks the stable release before the handbook is marked complete.