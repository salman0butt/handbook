---
title: TypeScript API & Curriculum Coverage
---

# TypeScript API & Curriculum Coverage

This page tracks the handbook against the current stable TypeScript documentation baseline and the production curriculum contract.

**Baseline audited:** TypeScript 7.0 stable, released July 8, 2026.

## Status legend

- ✅ complete
- 🟠 partial
- 🟡 planned
- ⚠️ deprecated / migration-only
- 🧪 experimental / version-sensitive
- ⛔ intentionally excluded

## Official language/handbook coverage

| Area | Status | Handbook coverage |
|---|---:|---|
| TypeScript/JavaScript mental model | ✅ | intro, 01–05 |
| everyday/primitive types | ✅ | 01–05 |
| object types | ✅ | 01–05 |
| interfaces/type aliases | ✅ | 01–05 |
| unions/intersections | ✅ | 01–05 |
| narrowing/control flow | ✅ | 06–10 |
| functions/overloads/call signatures | ✅ | 06–10, 17–25 |
| `any`/`unknown`/`never`/`void` | ✅ | 06–10 |
| assertions/suppressions/check directives | ✅ | 06–10 |
| literal widening/`as const` | ✅ | 06–10 |
| generics/constraints/defaults/inference | ✅ | 11–16, 17–25 |
| `keyof` | ✅ | 11–16 |
| type-position `typeof` | ✅ | 11–16 |
| indexed access | ✅ | 11–16 |
| mapped types/key remapping | ✅ | 11–16 |
| conditional types/distribution/`infer` | ✅ | 11–16 |
| template literal types | ✅ | 11–16 |
| utility types | ✅ | 11–16 |
| classes | ✅ | 17–25 |
| enums/alternatives | ✅ | 17–25 |
| structural compatibility | ✅ | 17–25 |
| variance/function compatibility | ✅ | 17–25 |
| advanced inference | ✅ | 17–25 |
| `satisfies` | ✅ | 06–10, 17–25 |
| nullability | ✅ | 17–25 |
| arrays/readonly/tuples/variadic tuples | ✅ | 17–25 |
| advanced callable/construct/builder APIs | ✅ | 17–25 |

## TSConfig coverage

| Area | Status | Notes |
|---|---:|---|
| `strict` family | ✅ | 26–31 |
| `noImplicitAny` | ✅ | strictness rationale |
| `strictNullChecks` | ✅ | strictness + nullability |
| `strictFunctionTypes` | ✅ | variance/function compatibility |
| `strictPropertyInitialization` | ✅ | classes/config |
| `useUnknownInCatchVariables` | ✅ | errors/config |
| `noUncheckedIndexedAccess` | ✅ | nullability/config |
| `exactOptionalPropertyTypes` | ✅ | object/config |
| `noImplicitOverride` | ✅ | classes/config |
| `noPropertyAccessFromIndexSignature` | ✅ | config |
| `target`/`module` | ✅ | modules/config |
| `outDir`/`rootDir` | ✅ | config |
| declarations/declaration maps | ✅ | config/declarations/library |
| source maps | ✅ | foundations/config/build |
| `noEmit`/`noEmitOnError` | ✅ | config/build |
| `removeComments` | ✅ | config |
| `downlevelIteration` | ✅ | config with legacy-target warning |
| `moduleResolution` | ✅ | NodeNext/bundler guidance |
| `paths` | ✅ | static-vs-runtime warning |
| `baseUrl` | ⚠️ | contextual/legacy-oriented guidance only |
| `resolveJsonModule` | ✅ | config |
| `allowImportingTsExtensions` | ✅ | workflow caveat |
| `rewriteRelativeImportExtensions` | ✅ | current module/runtime guidance |
| `customConditions` | ✅ | package-condition guidance |
| `types`/`typeRoots` | ✅ | ambient inclusion |
| `verbatimModuleSyntax` | ✅ | module/type-only guidance |
| `esModuleInterop`/synthetic defaults | ✅ | module-mode caveat |
| `allowJs`/`checkJs` | ✅ | migration/interop |
| `incremental`/`composite`/build info | ✅ | references/monorepo |
| JSX modes/`jsxImportSource` | ✅ | JSX/config |

## Modules and runtime integration

| Area | Status | Notes |
|---|---:|---|
| ESM | ✅ | 26–31 |
| CommonJS | ✅ | 26–31 |
| Node-aware modes / `nodenext` | ✅ | 26–31, Node integration |
| bundler resolution | ✅ | 26–31 |
| type-only imports/exports | ✅ | 26–31 |
| package `exports`/`imports` | ✅ | 26–31 |
| file extensions/package `type` | ✅ | 26–31, Node |
| path aliases | ✅ | explicit runtime mismatch warning |
| barrel files/cycles | ✅ | architecture implications |
| `node10` resolution | ⚠️ | legacy, not recommended |
| `classic` resolution | ⛔ | intentionally excluded from modern usage except warning |
| modern Node type stripping | ✅ | 32–39; explicitly no type-check/tsconfig semantics |

## Project references / monorepos

| Area | Status |
|---|---:|
| `references` | ✅ |
| `composite` | ✅ |
| `tsc -b` | ✅ |
| declaration boundaries | ✅ |
| incremental build graph | ✅ |
| workspace ownership | ✅ |
| cycle prevention | ✅ |
| CI/affected build strategy | ✅ |
| editor/build performance | ✅ |

## Declaration files and library authoring

| Area | Status |
|---|---:|
| `.d.ts` theory | ✅ |
| `declare`/ambient declarations | ✅ |
| module/global declarations | ✅ |
| callable/hybrid patterns | ✅ |
| declaration emit/maps | ✅ |
| bundled typings | ✅ |
| DefinitelyTyped/`@types` | ✅ |
| package `types`/exports | ✅ |
| type versioning/semver | ✅ |
| ESM/CJS publishing decisions | ✅ |
| tree shaking/side effects | ✅ |
| runtime + type + package tests | ✅ |
| inference ergonomics | ✅ |

## JavaScript interoperability

| Area | Status |
|---|---:|
| `allowJs` | ✅ |
| `checkJs` | ✅ |
| JSDoc | ✅ |
| `@ts-check` | ✅ |
| CommonJS interop | ✅ |
| untyped dependency shims | ✅ |
| incremental conversion | ✅ |

## Decorators

| Area | Status | Notes |
|---|---:|---|
| modern decorators | ✅ | 32–39 |
| class/method/field/accessor model | ✅ | conceptual/current semantics |
| legacy `experimentalDecorators` | ⚠️ | framework compatibility/migration only |
| runtime metadata assumptions | ⚠️ | explicitly not treated as automatic type metadata |
| framework migration | ✅ | audit/check emitted runtime behavior |

## JSX / React / Node

| Area | Status |
|---|---:|
| TSX parsing/generic ambiguity | ✅ |
| intrinsic JSX typing/compiler modes | ✅ |
| React props/state/events/refs/reducers/context/hooks | ✅ |
| discriminated component APIs | ✅ |
| forms/runtime validation | ✅ |
| Node ESM/CommonJS/NodeNext | ✅ |
| Node env/filesystem/streams/events/HTTP model | ✅ |
| direct type stripping vs static checking | ✅ |

## Production engineering curriculum

| Area | Status |
|---|---:|
| runtime validation architecture | ✅ |
| error handling | ✅ |
| async/concurrency/cancellation | ✅ |
| iterators/generators | ✅ |
| API/backend DTO/domain/persistence boundaries | ✅ |
| TypeScript architecture | ✅ |
| domain modeling/brands/state machines | ✅ |
| type-level programming restraint | ✅ |
| advanced type challenges | ✅ |
| soundness/limits | ✅ |
| compiler/language-service mental models | ✅ |
| compiler AST/tooling concepts | ✅ |
| compiler performance | ✅ |
| debugging workflow | ✅ |
| runtime/type/declaration testing | ✅ |
| linting/typescript-eslint | ✅ |
| build tools/transpile-vs-check | ✅ |
| security | ✅ |
| production governance | ✅ |
| JS→TS migration | ✅ |
| compiler upgrades | ✅ |
| anti-pattern catalog | ✅ |
| senior design patterns | ✅ |
| staff architecture/governance | ✅ |

## TypeScript 7.0 release-specific coverage

| Area | Status | Notes |
|---|---:|---|
| TypeScript 7.0 stable baseline | ✅ | version + intro |
| native compiler/language service generation | ✅ | version/performance/compiler chapters |
| performance profile | ✅ | framed as measured release evidence, not universal guarantee |
| LSP editor integration generation | ✅ | version/compiler mental model |
| 6.0→7.0 migration context | ✅ | upgrades |
| TypeScript 7.0 programmatic API absence | ✅ | compiler API chapter |
| TS6 compatibility side-by-side | ✅ | compiler API/upgrades |
| parallelism tuning flags | 🧪 | experimental; not baseline recommendation |
| nightly/next features | 🧪 | explicitly excluded from stable teaching |

## External official integration guidance

| Source area | Status | Handbook use |
|---|---:|---|
| Node.js TypeScript docs | ✅ | stable type stripping, tsconfig limitations, module/runtime integration |
| typescript-eslint docs | ✅ | typed linting and `projectService` guidance |
| TC39/runtime semantics | ✅ | JavaScript runtime concepts are kept separate from TS static claims |

## Projects and interview coverage

| Deliverable | Status |
|---|---:|
| Typed REST Client | ✅ |
| Typed Event System | ✅ |
| Type-Safe Form/Validation Engine | ✅ |
| Type-Safe Backend | ✅ |
| Library/SDK | ✅ |
| Large Monorepo | ✅ |
| Production TypeScript Platform capstone | ✅ |
| Interview Mastery | ✅ |
| 300+ Interview Question Bank | ✅ — 310 questions |
| Mock Interview Practice | ✅ — 11 rounds |

## Coverage conclusion

No stable in-scope curriculum area tracked by this contract remains 🟡 planned. Legacy/deprecated behavior is included only when needed for migration/interoperability, and TypeScript 7.0 API/parallelism topics that are not stable general-purpose contracts are explicitly version-labelled.