---
title: Version Baseline
description: Dated TypeScript, Node.js, compiler, module, strictness, and compatibility baseline for this handbook.
slug: /typescript/version
---

# Version Baseline

**Baseline date: August 1, 2026**

| Area | Handbook baseline |
|---|---|
| TypeScript | 7.0.2 stable |
| Compiler implementation | Native TypeScript 7 compiler and LSP-based language service |
| Node.js used by handbook CI | Node.js 24 LTS |
| Application target | Explicitly selected; examples generally use `ES2024` |
| Node module mode | `module: "NodeNext"` with `moduleResolution: "NodeNext"` |
| Bundler module mode | `module: "Preserve"` with `moduleResolution: "Bundler"` |
| Strictness | `strict: true` plus targeted additional safety options |
| Runtime validation | Required for untrusted external data |
| Legacy modes | `classic` and `node10` module resolution are not taught as defaults |

TypeScript 7.0 was released on July 8, 2026. The native implementation keeps the TypeScript language model while materially changing compiler and editor performance. TypeScript's release announcement reports typical full-build speedups of approximately 8×–12× on large real-world codebases, but actual results depend on project shape and hardware.

## Recommended application configuration

```json
{
  "compilerOptions": {
    "target": "ES2024",
    "module": "Preserve",
    "moduleResolution": "Bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "useUnknownInCatchVariables": true,
    "verbatimModuleSyntax": true,
    "noEmit": true
  },
  "include": ["src"]
}
```

## Recommended Node.js configuration

```json
{
  "compilerOptions": {
    "target": "ES2024",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "verbatimModuleSyntax": true,
    "rootDir": "src",
    "outDir": "dist",
    "sourceMap": true
  },
  "include": ["src"]
}
```

## Version-sensitive guidance

- TypeScript 7.0 does not provide a replacement stable programmatic Compiler API. Tooling that needs the TypeScript 6 API may use the compatibility package side by side.
- Framework integrations that embed TypeScript can have a different support schedule from the standalone CLI.
- TypeScript 7 carries forward transition defaults and rejects several options deprecated for the 6-to-7 migration.
- Native parallelism controls are tuning tools, not universal defaults.
- Node.js type stripping executes erasable TypeScript syntax but does not perform project type checking or honor `tsconfig.json`; keep `tsc --noEmit` in CI.

## Primary sources

- [TypeScript 7.0 announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7/)
- [TypeScript on npm](https://www.npmjs.com/package/typescript)
- [TypeScript module reference](https://www.typescriptlang.org/docs/handbook/modules/reference.html)
- [TypeScript TSConfig reference](https://www.typescriptlang.org/tsconfig/)
- [Node.js releases](https://nodejs.org/en/about/previous-releases)
- [Node.js TypeScript support](https://nodejs.org/api/typescript.html)
