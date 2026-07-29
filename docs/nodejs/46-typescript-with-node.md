---
title: TypeScript with Node.js
---

# TypeScript with Node.js

TypeScript checking, JavaScript module semantics, and Node runtime execution are separate systems that must agree.

## Production compiler configuration

A modern Node ESM project commonly starts from TypeScript's Node-aware module modes such as `NodeNext`, with settings chosen for the actual runtime/package format.

```json
{
  "compilerOptions": {
    "target": "ES2024",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "sourceMap": true,
    "outDir": "dist"
  }
}
```

The correct target/lib/output policy depends on the Node LTS baseline and publishing needs.

## File extensions and package `type`

Node executes runtime file formats; TypeScript models them. ESM relative runtime imports commonly need real file extensions in emitted/imported paths. Use `.mts`/`.cts` when you need source-level format overrides, and ensure declarations/exports match the distributed format.

## Built-in type stripping

✅ Current Node 26 supports stable lightweight TypeScript type stripping. It executes TypeScript files containing erasable syntax, performs **no type checking**, and intentionally ignores `tsconfig.json` features such as path aliases/transpilation targets.

```bash
node script.ts
```

Use `import type` correctly because runtime imports remain runtime imports.

```ts
import type {User} from './types.ts';
```

Node 26 removed the former `--experimental-transform-types` route. If code uses syntax requiring transformation, path aliases, decorators/transforms, older JS targets, or full TS configuration, use a proper compiler/runtime tool such as `tsc`/`tsx` according to project needs.

## Build vs run

- scripts/tools: native type stripping can be convenient when syntax is compatible;
- production apps: type-check in CI even if Node can execute source;
- libraries: normally publish JavaScript plus declarations, not raw TypeScript inside `node_modules`.

## Source maps

Compiled/transformed production code should preserve useful source-map behavior for stack traces and observability. Verify it in the deployed artifact.

## Boundary rule

TypeScript types disappear. HTTP, env, DB, queue, JSON, and IPC values still require runtime validation.
