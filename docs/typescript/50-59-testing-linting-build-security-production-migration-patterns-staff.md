---
title: 50–59 · Testing, Linting, Build Tools, Security, Production, Migration & Staff Architecture
---

# 50–59 · Testing, Linting, Build Tools, Security, Production, Migration & Staff Architecture

## 50 · Testing TypeScript

Type correctness and runtime correctness are different test dimensions.

```text
runtime test
  → does executed behavior produce the right result?

compile-time/type test
  → does the public API accept/reject the intended programs?
```

### Runtime tests

Test actual branches, I/O adapters, validation, concurrency, errors, serialization, and framework integration. A type-safe function can still contain incorrect business logic.

### Type tests

```ts
const result = getProperty({ id: 1, name: "Ada" }, "id")
const n: number = result

// @ts-expect-error invalid key must stay rejected
getProperty({ id: 1 }, "missing")
```

`@ts-expect-error` is useful because the test fails when the diagnostic disappears unexpectedly.

Libraries can also use expect-type-style tooling to assert exact inferred/public types. Keep those tests focused on consumer-visible behavior rather than unstable internal implementation types.

### Declaration/package tests

Install the built artifact into fixture projects that exercise supported module systems, exports, declaration entrypoints, and TypeScript versions.

### Schema validation tests

For every untrusted boundary, test valid values, missing fields, wrong primitives, extra/unknown policy, invalid nested structures, and malicious/extreme inputs.

### Regression tests

When fixing a compiler/type API bug, create the smallest failing sample and preserve it. This is especially important for library inference regressions that ordinary runtime tests cannot detect.

## 51 · Linting & Code Quality

ESLint and TypeScript solve related but different problems.

```text
TypeScript compiler
  → type relationships, program semantics, emit/config

ESLint + typescript-eslint
  → configurable code-quality/bug patterns

formatter
  → presentation/layout
```

### Current typed-linting guidance

The current typescript-eslint guidance recommends type-aware linting and `parserOptions.projectService: true`, which uses TypeScript's project service to align lint type information more closely with editor projects.

```js
import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
)
```

Typed linting is more expensive because the linter needs semantic type information. Measure CI/editor cost and scope configs correctly rather than disabling useful rules globally.

### High-value rule families

- unsafe `any` propagation
- floating/unhandled promises
- unnecessary assertions/non-null assertions
- misuse of promises in sync contexts
- unsafe member access/calls/returns
- redundant conditions based on actual types

### Explicit `any` policy

An `any` ban without migration escape hatches can produce worse casts. Prefer policy such as: `any` allowed only at named adapters/migration modules, with issue ownership and containment.

### Formatter separation

Do not make ESLint perform every formatting concern if a dedicated formatter already owns layout. Keep rule intent clear: correctness/maintainability vs formatting.

## 52 · Build Tools

### `tsc`

`tsc` is the canonical TypeScript checker/compiler. It can emit JavaScript/declarations/maps or run as `--noEmit` checker.

### Syntax transpilers

Babel, SWC, and esbuild can remove/transform TypeScript syntax without running full TypeScript semantic checking. Vite typically delegates transforms/bundling through tooling in this family and expects a separate type-check step.

```text
.ts source
   ├─ syntax transform → JS quickly
   └─ tsc --noEmit → semantic type checking
```

Do not call a pipeline “type checked” merely because it accepted `.ts` files.

### Isolated transforms

Tools compiling files independently cannot rely on transformations requiring whole-program type information. Write code compatible with the chosen isolated-module/tool semantics.

### Declarations

Applications often use `noEmit`; libraries usually need reliable declaration generation. If JavaScript is bundled by another tool, use a declaration-specific TypeScript build or a proven declaration bundling strategy.

### Source maps

Source maps are part of operational debugging. Verify deployed artifacts map stack traces to the source revision actually running.

### CI

Typical gates:

```text
install with lockfile
→ lint
→ tsc --noEmit / tsc -b
→ tests
→ production build
→ package/declaration fixtures if library
```

## 53 · Security

> **A TypeScript type is not an authorization check.**

### Runtime validation

Attackers send runtime bytes, not TypeScript values. Validate every external boundary before trusting the shape.

### Authorization

```ts
function deleteProject(user: User, projectId: ProjectId) {}
```

The fact that `user` and `projectId` are well typed does not prove the user may delete that project. Authorization must execute against current policy/resource context.

### Unsafe assertions

Assertions can bypass the static friction that would have forced validation.

```ts
const claims = decode(token) as AdminClaims // dangerous trust jump
```

Validate signature, issuer, audience, expiry, and claim schema at runtime, then construct trusted claims.

### `any` propagation

`any` from untyped packages, parsers, globals, or mocks can silently weaken an entire flow. Convert to `unknown` at the boundary and validate/narrow.

### DTO exposure

Do not expose persistence objects directly. Static types do not prevent a serializer from leaking password hashes, internal flags, tokens, or tenant metadata.

### Secrets

Types cannot prevent logging/committing secrets. Use secret storage, redaction, least privilege, runtime configuration controls, and scanning.

### Injection boundaries

Typed strings are still strings. SQL, shell, HTML, template, path, and URL injection require correct APIs/escaping/parameterization at runtime.

### Third-party declarations

A compromised or simply inaccurate type package can mislead developers. Lock dependencies, review supply-chain changes, and treat declarations as assumptions rather than security proof.

## 54 · Production Engineering

### Strictness policy

Define an organization baseline and exceptions process. A shared config might enable `strict`, then teams opt into extra flags through a migration plan.

### Shared TSConfigs

Publish versioned base configs for Node, frontend, library, test, and generated-code contexts rather than one universal file full of contradictory options.

### CI type checks

Pin compiler/tooling versions via lockfiles, run checking on clean CI, and ensure generated declarations/contracts exist before consumers are checked.

### Package ownership

Every public package/type/schema needs owners. Shared code without ownership becomes a compatibility trap.

### Generated contracts

Generated types are useful when generated from authoritative schemas/protocols. Do not hand-edit generated artifacts; validate generation drift in CI.

### Release strategy

For libraries/shared packages, run runtime tests, type tests, declaration/package fixtures, consumer compatibility tests, and release-note review.

### Upgrade policy

Track stable TypeScript releases, test them in canary branches/CI, and schedule deprecation cleanup before removal deadlines.

### Build caching

Cache only when keys capture all semantic inputs: compiler version, tsconfig, source graph, dependency declarations, code generation, and relevant environment. Incorrect caching creates stale confidence.

### Type debt

Track `any`, `@ts-ignore`, non-null assertions, unsafe declaration shims, excluded folders, disabled strict flags, and generated-type drift as engineering debt with owners.

## 55 · Migration to TypeScript

Migration is a risk-management program, not a file-extension project.

```text
JavaScript
   ↓
allowJs
   ↓
checkJs + JSDoc / @ts-check
   ↓
convert leaf modules
   ↓
introduce typed trust boundaries
   ↓
runtime validation
   ↓
strictness ratchet
   ↓
remove unsafe any / ignores / assertions
   ↓
strict TypeScript
```

### Large-application playbook

1. Pin compiler version and create a base config.
2. Include JS without requiring immediate conversion.
3. Stop new unsafe debt with CI policy.
4. Wrap external APIs/database/configuration in typed adapters.
5. Convert low-dependency leaf modules first.
6. Move upward toward orchestration modules.
7. Enable strict flags incrementally and measure diagnostics.
8. Replace broad declaration shims with accurate types.
9. Add runtime schemas at untrusted boundaries.
10. Remove temporary ignores/any by ownership milestone.

### Team strategy

Prefer small reviewable PRs. Publish migration dashboards such as remaining JS files, explicit `any`, suppression count, unchecked packages, strict flag coverage, and build time.

### What not to do

- rename every `.js` to `.ts` then add `any`
- assert every external response into a domain type
- enable all strict flags and merge thousands of mechanical casts
- duplicate every existing runtime schema as handwritten TypeScript

## 56 · Upgrading TypeScript

### Release channels

```text
stable → production baseline candidate
RC/beta → compatibility testing
nightly/next → early signal only
```

Never teach nightly behavior as stable.

### Upgrade workflow

1. Read official release notes and breaking changes.
2. Check removed/deprecated compiler options.
3. Align editor and CI compiler versions.
4. Run clean build, type tests, declaration emit, lint, and runtime tests.
5. Diff emitted declarations for libraries.
6. Run consumer fixtures.
7. Investigate `lib.d.ts` changes that alter DOM/Node/global types.
8. Check third-party package compatibility and peer ranges.
9. Canary on representative repos/teams.
10. Merge upgrade separately from feature work when possible.

### TypeScript 6 → 7 transition

TypeScript 6 served as the migration bridge to the native TypeScript 7 toolchain and deprecated legacy options that TypeScript 7 no longer supports. TypeScript 7.0 also changes tooling integration because the native 7.0 release does not ship the old programmatic Compiler API. Tool authors may need a side-by-side compatibility strategy until the new API generation is available.

### Editor/compiler alignment

A common false bug report is VS Code using one language service version while CI uses another compiler. Record the workspace compiler policy and make it easy to select the intended version.

## 57 · Anti-Patterns

### `any` everywhere

**Symptom:** APIs accept/return `any`.
**Why:** migration pressure or weak boundaries.
**Risk:** unsafety propagates invisibly.
**Better:** use `unknown` at trust boundaries, narrow/validate, expose precise results.

### Assertions everywhere

**Symptom:** repeated `as X` to satisfy the checker.
**Why:** models do not match runtime/control flow.
**Risk:** compiler feedback is bypassed.
**Better:** improve inference, guards, schemas, constraints, or domain construction.

### Trusting JSON

**Symptom:** `await response.json() as User`.
**Why:** static and runtime contracts are confused.
**Risk:** malformed/malicious payload crashes later.
**Better:** `unknown → validation → User`.

### Giant `types.ts`

**Symptom:** hundreds of unrelated types imported everywhere.
**Why:** “shared” became a dumping ground.
**Risk:** coupling/ownership collapse.
**Better:** colocate types with feature/domain; curate package public surfaces.

### Boolean-state explosion

**Symptom:** `loading`, `success`, `error`, `empty` booleans.
**Why:** state modeled as independent flags.
**Risk:** impossible combinations.
**Better:** discriminated union/state machine.

### Duplicate types

**Symptom:** API/client/domain shapes copied by hand.
**Why:** unclear source of truth.
**Risk:** drift.
**Better:** derive mechanically where semantics are identical; intentionally map when semantics differ.

### Over-engineered generics

**Symptom:** consumers need several explicit type parameters and read conditional-type diagnostics.
**Why:** abstraction optimized for cleverness.
**Risk:** unstable inference and poor DX.
**Better:** simpler union/overload/value-driven inference or code generation.

### Useless generic wrappers

**Symptom:** `<T>` appears once and establishes no relationship.
**Risk:** false abstraction.
**Better:** concrete type, union, or meaningful generic relationship.

### Non-null assertions everywhere

**Symptom:** `!` after every lookup/ref.
**Risk:** lifecycle/absence bugs hidden.
**Better:** model nullability and prove presence.

### `@ts-ignore`

**Symptom:** diagnostics silently disabled.
**Better:** fix types or use scoped `@ts-expect-error` with rationale/test when an error is intentionally expected.

### Incorrect index signatures

**Symptom:** `Record<string, T>` implies every string key exists.
**Risk:** runtime `undefined` treated as `T`.
**Better:** finite key union, `Partial<Record<...>>`, Map, or `noUncheckedIndexedAccess`.

### Persistence types leaked to API

**Symptom:** database row serialized directly.
**Risk:** security exposure and schema coupling.
**Better:** map to explicit response DTO.

### Conditional type for a runtime problem

**Symptom:** type-level parser models data that arrives dynamically.
**Risk:** compile complexity without runtime validation.
**Better:** parse/validate at runtime; derive static type from schema if useful.

### Excessive generic parameters in public API

**Symptom:** `client.request<A,B,C,D,E>(...)`.
**Risk:** caller burden and poor evolution.
**Better:** infer from schema/config or hide internals behind named options.

### Fighting inference

**Symptom:** constant annotations/casts are needed to restore literal relationships.
**Better:** redesign value positions, const generics, `satisfies`, or narrower helpers.

## 58 · Senior Design Patterns

### Discriminated unions / state machines

Use for finite workflow/state variation and exhaustive behavior.

### Result

Use for expected recoverable failures that callers should handle as data.

### Option-style pattern

`T | undefined`/`T | null` is often enough. A wrapper type can be justified when the project wants explicit combinators or to prevent accidental nullish handling.

### Builders

Use staged builders when construction has meaningful ordered invariants. Prefer a simple object when it does not.

### Fluent APIs

Preserve `this` and infer state carefully. Avoid fluent APIs that hide costly network/database actions behind innocuous methods.

### Typed events

Map event keys to payloads and validate external events at runtime. Version distributed event contracts.

### Factories

Factories can establish invariants and hide implementation classes.

### Plugins and registries

```ts
type PluginMap = {
  audit: AuditPlugin
  metrics: MetricsPlugin
}
```

A typed registry can preserve key→implementation relationships. Runtime plugin discovery still needs validation/version checks.

### Command/query separation

Useful when mutation/read responsibilities have different contracts, observability, caching, authorization, or scaling behavior.

### Schema-derived types

Prefer deriving static types from authoritative runtime schemas when it prevents drift. Do not force domain models to equal wire schemas when transformation is semantically useful.

### Public API evolution

Additive changes are not automatically safe: adding a union member can break exhaustive consumers; changing generic defaults can alter inference; tightening a declaration can reveal previously accepted consumer code. Test compatibility deliberately.

## 59 · Staff-Level Architecture

Staff-level TypeScript work is mostly governance of boundaries, ownership, feedback loops, and evolution across teams.

### Organization-wide strictness

Publish a baseline, migration tiers, exception process, and metrics. A flag is useful only if teams know how to model the surfaced cases.

### Type ownership

Every shared type/package needs an owner who can answer:

```text
what semantic contract does it represent?
who may change it?
which consumers are supported?
what is the compatibility policy?
```

### Schema ownership

Choose authoritative sources for APIs/events/configuration. Generate consumers where practical and preserve runtime validation at process boundaries.

### Generated vs handwritten

Generated types are best for protocol fidelity. Handwritten domain types are best for business semantics. Map between them rather than forcing one representation to serve every layer.

### Package boundaries

Use packages to reflect team/domain ownership and independent evolution, not merely folder aesthetics.

### API contract governance

Require review for public contract changes, version distributed schemas, maintain compatibility windows, and test representative consumers.

### Public library evolution

Track runtime behavior and type-level behavior. Include type tests, declaration diffs, API reports, and inference fixtures in release gates.

### Build performance

Set budgets for clean check, incremental check, editor project load, declaration emit, and CI critical path. TypeScript 7 improves the engine but architecture still determines graph size and invalidation scope.

### Dependency policy

Centralize supported TypeScript/typescript-eslint/Node versions; avoid duplicated conflicting type packages; review ambient global additions carefully.

### Monorepo governance

Enforce dependency direction, public entrypoints, affected-build correctness, codegen order, project reference health, and ownership metadata.

### Upgrade strategy

Canary new compiler versions on representative repos, publish migration guides/codemods, and prevent teams from drifting indefinitely across incompatible compiler generations.

### Migration governance

Use strictness tiers and deadlines, but provide architectural fixes rather than rewarding teams for replacing errors with casts.

### Architecture fitness functions

Automate desired properties:

- no cross-domain deep imports
- no forbidden dependency direction
- no new `@ts-ignore`
- no new unsafe API boundary without validator
- package exports resolve in supported runtimes
- type-check/build performance budgets
- public declaration compatibility checks

### Developer experience

A good TypeScript platform makes the safe path the easy path: templates, shared configs, schema/code generation, editor alignment, readable errors, fast local checks, docs, migration tooling, and clear ownership.

## Staff design review template

```text
1. runtime trust boundaries
2. static contract ownership
3. package/module dependency direction
4. public API + inference ergonomics
5. schema generation/validation strategy
6. module/runtime compatibility
7. build/editor performance
8. testing + declaration compatibility
9. migration/upgrade path
10. security/authorization responsibilities
11. observability/incident debugging
12. team ownership and governance
```

The staff-level question is rarely “can TypeScript express this?” It is “will this contract remain understandable, safe, fast, evolvable, and owned across dozens of teams?”