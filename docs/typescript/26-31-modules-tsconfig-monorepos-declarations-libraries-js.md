---
title: 26–31 · Modules, TSConfig, Monorepos, Declarations & Libraries
---

# 26–31 · Modules, TSConfig, Monorepos, Declarations & Libraries

## 26 · Modules

A TypeScript program has two related graphs:

```text
runtime dependency graph
  import/export values
        │
        └─ must resolve in the actual runtime/bundler

type dependency graph
  import type/export type/declarations
        │
        └─ needed only for checking/declaration generation
```

### ESM and CommonJS

TypeScript does not invent a runtime module system. It models and/or emits JavaScript for systems such as ESM and CommonJS.

```ts
import { readFile } from "node:fs/promises"
import type { Stats } from "node:fs"
export { createClient }
export type { ClientOptions }
```

Type-only imports/exports make erasure intent explicit and work well with `verbatimModuleSyntax`.

### Node-aware modes

For modern Node apps and libraries, use Node-aware module semantics. The official module reference treats `node16`/`node18`/`node20`/`nodenext` as descriptions of Node's dual ESM/CJS system. For forward-looking Node projects, `nodenext` is the normal choice.

```json
{
  "compilerOptions": {
    "module": "nodenext",
    "moduleResolution": "nodenext"
  }
}
```

Under Node-aware modes, `.mts`/`.mjs` are ESM, `.cts`/`.cjs` are CommonJS, and ordinary `.ts`/`.js` module interpretation depends on the nearest package's `"type"` field.

### Bundler mode

For a modern frontend/bundler pipeline:

```json
{
  "compilerOptions": {
    "module": "preserve",
    "moduleResolution": "bundler",
    "noEmit": true
  }
}
```

`bundler` models common bundler resolution behavior including extensionless relative imports while understanding package `exports`/`imports`.

### Package `exports`

A package's `exports` map is a runtime and tooling boundary. Public subpaths should be intentional.

```json
{
  "name": "@acme/sdk",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./auth": {
      "types": "./dist/auth.d.ts",
      "import": "./dist/auth.js"
    }
  }
}
```

Do not publish internal files accidentally and then assume consumers will never depend on them.

### `paths`

`paths` changes TypeScript resolution. It does not automatically rewrite emitted specifiers or teach Node a new runtime alias. Ensure the runtime/bundler/package imports configuration matches.

### Barrel files

Barrels can simplify a public API but can also create circular dependencies, expand module graphs, hide ownership, and cause unwanted side effects. Use barrels at architectural boundaries, not by reflex in every folder.

### Circular dependencies

A type-only cycle may be harmless; a runtime cycle can observe partially initialized exports. Diagnose the runtime graph separately from the type graph.

## 27 · TSConfig Mastery

A TSConfig is an architectural policy document. Compiler options change what TypeScript assumes about runtime behavior and how much proof code must provide.

### Strictness

Recommended baseline:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "useUnknownInCatchVariables": true
  }
}
```

`strict` enables a family of strict checks including `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, and `strictPropertyInitialization` where applicable.

- `noImplicitAny`: require evidence rather than silent `any` inference.
- `strictNullChecks`: model absence explicitly.
- `strictFunctionTypes`: safer callback parameter compatibility.
- `strictPropertyInitialization`: constructor/object lifecycle invariants.
- `useUnknownInCatchVariables`: caught values require narrowing.
- `noUncheckedIndexedAccess`: uncertain indexed lookup includes `undefined`.
- `exactOptionalPropertyTypes`: optional means absent rather than automatically writable `undefined`.
- `noImplicitOverride`: subclass overrides are explicit.
- `noPropertyAccessFromIndexSignature`: dictionary-origin members use bracket syntax, keeping uncertain keys visible.

Adopt extra strictness deliberately in existing codebases because these options surface real modeling debt and can generate broad migration work.

### Emit

- `target`: JavaScript syntax/runtime library baseline for emitted code.
- `module`: runtime module model/emit strategy.
- `outDir`: generated output destination.
- `rootDir`: source-root expectation; do not use it to fake module resolution.
- `declaration`: emit `.d.ts` public type surface.
- `declarationMap`: map declarations back to source for navigation.
- `sourceMap`: map JS runtime code back to TypeScript source.
- `noEmit`: check only.
- `noEmitOnError`: prevent emit when checking fails; many pipelines instead split checking from transform.
- `removeComments`: output choice, not a security mechanism.
- `downlevelIteration`: compatibility support for iteration when targeting older JS runtimes; avoid legacy targets unless required.

### Modules

- `moduleResolution`: match the actual runtime/bundler.
- `paths`: static resolver overrides; runtime must agree.
- `baseUrl`: legacy/common alias helper; avoid unnecessary dependence when package/import maps solve the real problem.
- `resolveJsonModule`: type JSON imports where the module system supports them.
- `allowImportingTsExtensions`: for workflows that permit source `.ts` specifiers under compatible emit/no-emit strategies.
- `rewriteRelativeImportExtensions`: useful when TypeScript source imports `.ts`-family relative files but emitted JS needs rewritten extensions; align with runtime.
- `customConditions`: extend conditional package export matching when your runtime/bundler uses custom conditions.
- `types`/`typeRoots`: control ambient type inclusion; do not casually hide needed platform globals.
- `verbatimModuleSyntax`: preserves value import/export intent and makes type-only syntax important.
- `esModuleInterop`/`allowSyntheticDefaultImports`: interop/type-checking behavior for CJS/default import patterns; understand your module mode rather than cargo-culting flags.

### JS migration

`allowJs` lets JS join the project; `checkJs` applies checking to JavaScript. Combine with JSDoc and `@ts-check` for gradual migration.

### Build

`incremental` stores build information; `composite` makes a project referenceable and imposes constraints that create reliable build boundaries; `tsBuildInfoFile` controls metadata location.

### JSX

Choose a JSX mode appropriate to the framework/toolchain, and use `jsxImportSource` for automatic JSX runtimes that source from a non-default library.

### Recommended modern profiles

#### Node backend

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "strict": true,
    "verbatimModuleSyntax": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "outDir": "dist"
  }
}
```

#### Vite/frontend

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "preserve",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "verbatimModuleSyntax": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

#### React

Add a JSX mode compatible with the React toolchain (commonly an automatic runtime mode) and keep application checking separate from bundling.

#### Library

Emit declarations, declaration maps, and JavaScript in a toolchain that produces package `exports` matching actual output. Test the published package, not only source imports.

#### Monorepo

Use a shared base config plus package-specific configs. Prefer project/package boundaries that mirror ownership rather than one giant program.

#### Migration project

Start with `allowJs`, selective `checkJs`, a strictness ratchet, and explicit unsafe-boundary metrics. Do not enable every hardest flag in one PR if it makes the migration unreviewable.

#### Maximum strictness

Start with `strict`, then consider `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, and `noPropertyAccessFromIndexSignature`. “Maximum strictness” is useful only when the team understands the domain modeling changes each flag demands.

## 28 · Project References & Monorepos

Project references turn a huge program into a graph of independently checkable build units.

```json
{
  "files": [],
  "references": [
    { "path": "./packages/contracts" },
    { "path": "./packages/core" },
    { "path": "./apps/api" }
  ]
}
```

Referenced projects use `composite` and normally produce declarations that act as boundaries.

```text
contracts
   ↓
 core
   ↓
 api
```

`tsc -b` builds the graph in dependency order and can reuse build metadata.

### Why references help

- smaller semantic units
- explicit dependency direction
- incremental builds
- declaration boundaries
- better large-repo editor/build behavior
- easier CI targeting

### Dependency ownership

A package should depend only on published/declared public APIs of another package. Deep relative imports across workspace boundaries defeat ownership and can create accidental cycles.

### CI strategy

Cache package manager artifacts and compiler build information where correct; calculate affected packages; still retain periodic/full validation to catch graph mistakes. Type checking must not silently skip a package because an affected-files calculation was wrong.

## 29 · Declaration Files

`.d.ts` files describe JavaScript/module shapes without providing the runtime implementation.

```ts
// logger.d.ts
export interface Logger {
  info(message: string): void
}
export function createLogger(name: string): Logger
```

At runtime, the corresponding package still needs real JavaScript.

### `declare`

`declare` means “this exists elsewhere.”

```ts
declare const BUILD_ID: string
```

Do not use ambient declarations to wish a runtime global into existence.

### Module shims

```ts
declare module "legacy-widget" {
  export function mount(target: Element): void
}
```

A broad shim can unblock migration, but it is technical debt. Prefer increasingly accurate declarations.

### Globals and namespaces

Ambient globals/namespaces remain relevant for script-style libraries and legacy ecosystems, but modern package libraries should prefer modules and explicit exports.

### Callable/hybrid APIs

Declarations can model a callable function with attached members:

```ts
interface ClientFactory {
  (url: string): Client
  version: string
  configure(options: Options): void
}
```

### Declaration emit and maps

`declaration: true` creates `.d.ts` from exported public surfaces. `declarationMap` improves navigation from consuming code into source.

### DefinitelyTyped and `@types/*`

Use bundled types when the package publishes them. `@types/*` fills gaps for packages whose typings live in DefinitelyTyped. Treat third-party declarations as executable assumptions: if wrong, they can make unsafe code compile.

### Package metadata

Expose declarations through package metadata/exports that align with runtime entrypoints. Test every exported subpath.

### Public type versioning

Changing a public type can be breaking even when emitted JavaScript barely changes. Inference changes, narrowed unions, tightened generics, and declaration ordering can affect consumers. Library semver must account for type compatibility.

## 30 · Library Authoring

### Architecture

```text
src/internal/*     not public
src/index.ts       curated public API
src/subpath.ts     intentional subpath
        ↓ build
 dist JS + .d.ts + maps
        ↓
 package exports
```

### Public generic API design

Optimize for the consumer's inference and diagnostics. Prefer one obvious path over several clever overloads that produce inscrutable errors.

### ESM/CJS strategy

Choose based on consumers and runtime needs. Dual-format publishing increases testing and export-map complexity. If supporting both, verify both actual runtime paths and declaration resolution.

### Tree shaking and side effects

Keep side effects explicit. Package metadata and module structure must match reality; incorrectly marking side effects can let bundlers remove needed code.

### Runtime validation

Types do not protect a library from untrusted runtime input. Validate configuration, network responses, plugin payloads, and environment values where the contract crosses trust boundaries.

### Type tests and runtime tests

```text
runtime tests → behavior is correct
compile-time tests → API accepts/rejects intended programs
declaration tests → published type surface resolves correctly
package tests → installed artifact works in supported module modes
```

### Publishing and semver

Build from clean state, inspect package contents, test exports, verify declarations, and run consumer fixtures. A change that causes widespread inference regressions can deserve a major release even when function names stay the same.

> A clever type is not automatically a good public API.

## 31 · JavaScript Interoperability

TypeScript can adopt JavaScript gradually.

```json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true
  }
}
```

### JSDoc

```js
// @ts-check
/** @param {string} id @returns {Promise<User>} */
async function loadUser(id) {}
```

JSDoc can deliver meaningful checking before conversion to `.ts`.

### CommonJS

Legacy modules can coexist, but interop depends on the selected module mode and actual runtime package format. Test behavior rather than relying on one import style that happens to type-check.

### Untyped libraries

Options in increasing long-term quality:

```text
unknown boundary wrapper
   ↓
small local declaration
   ↓
accurate full declaration
   ↓
upstream/bundled typings
```

Avoid a permanent `declare module "x"` that implicitly turns an entire dependency into `any` unless you consciously accept that risk.

### Incremental conversion

Convert leaf modules first, establish typed boundaries around external systems, use JSDoc for hard-to-convert areas, and ratchet strictness. Measure unsafe escapes so migration progress is visible.

## Module-resolution debugging

When an import fails, separate layers:

```text
1. what specifier is written?
2. what module mode is the importing file in?
3. which package.json `type`/exports/imports apply?
4. how does TypeScript resolve it?
5. how will Node/bundler resolve it at runtime?
6. do declarations and runtime file point to matching entrypoints?
```

Use compiler resolution tracing for hard cases rather than randomly changing aliases or `esModuleInterop`.