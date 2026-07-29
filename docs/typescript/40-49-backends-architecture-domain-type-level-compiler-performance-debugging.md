---
title: 40–49 · Backends, Architecture, Domain Modeling, Compiler, Performance & Debugging
---

# 40–49 · Backends, Architecture, Domain Modeling, Compiler, Performance & Debugging

## 40 · APIs & Backends

A backend commonly has several distinct representations of “the same” business concept. Keeping them separate prevents persistence, transport, and domain concerns from collapsing into one giant type.

```text
HTTP request DTO
      ↓ validate/normalize
application command
      ↓
domain model
      ↓
persistence mapping
      ↓
database row
```

### DTOs

DTOs model transport contracts.

```ts
type CreateUserRequest = {
  email: string
  displayName: string
}

type UserResponse = {
  id: string
  email: string
  displayName: string
  createdAt: string
}
```

A database row should not automatically become the client contract. Persistence models may include internal IDs, secrets, audit metadata, denormalized columns, or fields that evolve independently from public API semantics.

### Domain entities

```ts
type UserId = string & { readonly __brand: "UserId" }

interface User {
  id: UserId
  email: Email
  displayName: string
}
```

Domain types should represent invariants already validated, not raw request strings.

### Repositories and services

```ts
interface UserRepository {
  findById(id: UserId): Promise<User | undefined>
  save(user: User): Promise<void>
}
```

Keep infrastructure-specific database APIs behind adapters where this improves isolation and tests.

### Commands and queries

```ts
type CreateUserCommand = {
  email: Email
  displayName: string
}

type GetUserQuery = { id: UserId }
```

Command/query separation can clarify intent but should not become ceremonial boilerplate for tiny systems.

### Pagination

Model pagination contracts explicitly:

```ts
type Page<T> = {
  items: readonly T[]
  nextCursor?: string
}
```

Cursor values are opaque transport data. Avoid exposing database implementation details unless the API intentionally contracts to them.

### Events

```ts
type UserCreated = {
  type: "user.created"
  version: 1
  userId: string
  occurredAt: string
}
```

Event contracts often outlive one process. Version them, validate them at boundaries, and avoid assuming a shared TypeScript package makes distributed systems runtime-compatible.

## 41 · TypeScript Architecture

TypeScript rewards local reasoning when module boundaries align with product/domain boundaries.

```text
feature/user/
  domain/
  application/
  infrastructure/
  ui-or-http/
  index.ts  ← public module surface
```

### Vertical slices

A vertical slice colocates a feature's domain/application/adapters rather than grouping every controller, service, type, and utility globally.

### Dependency direction

```text
UI / HTTP
   ↓
application
   ↓
domain
   ↑
infrastructure implements ports
```

The domain should not import frameworks merely because TypeScript can resolve them.

### Public module APIs

Export a small intentional surface from feature/package entrypoints. Internal helper types are implementation details.

### Avoid giant `types.ts`

A global `types.ts` tends to become a dependency hub with weak ownership. Put types next to the behavior/invariant they describe. Shared cross-feature contracts belong in clearly owned packages/modules.

### Schema ownership

Runtime schema, API contract, generated client, and domain model are different artifacts unless you deliberately define one as source of truth. Choose ownership explicitly.

## 42 · Domain Modeling

### Primitive obsession

```ts
function pay(orderId: string, amount: number, currency: string) {}
```

This accepts too many meaningless combinations. Domain wrappers can improve intent.

```ts
type OrderId = string & { readonly __brand: "OrderId" }
type Money = { minorUnits: number; currency: Currency }
```

### Branding and opaque-like types

Branding reduces accidental mixing of structurally identical primitives.

```ts
type UserId = string & { readonly __brand: "UserId" }
type OrderId = string & { readonly __brand: "OrderId" }
```

Limitations:

- brands disappear at runtime
- assertions can forge them
- serialization loses the branded static identity
- external input must still be validated/reconstructed

Branding is a static modeling technique, not runtime security.

### Value objects and factories

```ts
class Email {
  private constructor(readonly value: string) {}

  static parse(value: string): Email | undefined {
    return value.includes("@") ? new Email(value) : undefined
  }
}
```

The factory centralizes the invariant. Real email validation policy is more complex; the example demonstrates architecture, not production email semantics.

### State machines

```ts
type Order =
  | { state: "draft"; items: readonly Item[] }
  | { state: "placed"; orderId: OrderId; items: readonly Item[] }
  | { state: "paid"; orderId: OrderId; receipt: Receipt }
  | { state: "cancelled"; orderId: OrderId; reason: string }
```

Functions can accept only legal source states.

### Invariants

A type can express some invariants, but not all. “number greater than zero,” “record exists in database,” and “user is authorized” require runtime checks. Use static types to preserve already-proven facts, not to pretend runtime facts were proven.

## 43 · Type-Level Programming

Type-level programming uses mapped types, conditional types, `infer`, recursive aliases, tuple transforms, and template literal transforms to compute types.

### Key filtering

```ts
type KeysMatching<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never
}[keyof T]
```

### Tuple head/tail

```ts
type Head<T extends readonly unknown[]> =
  T extends readonly [infer H, ...unknown[]] ? H : never

type Tail<T extends readonly unknown[]> =
  T extends readonly [unknown, ...infer R] ? R : []
```

### Deep transforms

Deep utilities are tempting but semantically tricky: functions, Maps/Sets, branded objects, dates, class instances, optional members, readonly tuples, and recursion depth all require policy decisions.

### Restraint rule

Use type-level computation when it removes duplication and encodes a stable relationship. Avoid it when:

- runtime code would be simpler
- diagnostics become unreadable
- compile/editor performance degrades
- public consumers must understand implementation-level tricks
- a generated schema/client would be more robust

## 44 · Advanced Type Challenges

The goal of challenges is reasoning, not collecting tricks.

### `DeepReadonly`

```ts
type DeepReadonly<T> =
  T extends (...args: any[]) => any ? T :
  T extends readonly unknown[]
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T extends object
      ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
      : T
```

Reasoning:

1. primitives need no change
2. functions should remain callable rather than mapped into method properties
3. arrays/tuples map element positions
4. objects map every property recursively

Production caveat: this is compile-time readonly, not runtime deep freezing.

### `DeepPartial`

```ts
type DeepPartial<T> =
  T extends (...args: any[]) => any ? T :
  T extends readonly unknown[]
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T extends object
      ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T
```

Ask whether a “deep partial domain entity” is actually meaningful before using it outside tests/configuration.

### `PickByValue`

```ts
type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K]
}
```

### `KeysMatching`

```ts
type KeysMatching<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never
}[keyof T]
```

### `UnionToIntersection`

```ts
type UnionToIntersection<U> =
  (U extends unknown ? (x: U) => void : never) extends
  (x: infer I) => void ? I : never
```

Reasoning: distribute union members into parameter positions, then infer a parameter type capable of satisfying the combined function relationship. This depends on function-parameter variance behavior and is a good interview exercise, but should not become routine application code without a clear need.

### Typed event emitter

```ts
type Events = {
  userCreated: User
  orderPaid: Order
}

type Handler<E, K extends keyof E> = (payload: E[K]) => void

interface TypedEmitter<E extends Record<string, unknown>> {
  emit<K extends keyof E>(event: K, payload: E[K]): void
  on<K extends keyof E>(event: K, handler: Handler<E, K>): () => void
  once<K extends keyof E>(event: K, handler: Handler<E, K>): () => void
}
```

### Typed route params

```ts
type SegmentParam<S extends string> =
  S extends `${string}:${infer P}/${infer Rest}`
    ? P | SegmentParam<Rest>
    : S extends `${string}:${infer P}` ? P : never

type RouteParams<S extends string> = {
  [K in SegmentParam<S>]: string
}

type P = RouteParams<"/users/:userId/orders/:orderId">
```

### `PathValue`

```ts
type PathValue<T, P extends string> =
  P extends keyof T ? T[P] :
  P extends `${infer K}.${infer Rest}`
    ? K extends keyof T
      ? PathValue<T[K], Rest>
      : never
    : never
```

A full production path utility must handle arrays, optional members, symbols, escaping, recursion depth, and invalid paths. Keep the challenge version scoped.

### Query builder

A staged query builder can encode selected tables/fields in generic state, but test consumer diagnostics. If a SQL typo produces a 30-line conditional-type error, runtime validation/code generation may be a better product experience.

### String split/join

```ts
type Split<S extends string, Sep extends string> =
  S extends "" ? [] :
  S extends `${infer Head}${Sep}${infer Tail}`
    ? [Head, ...Split<Tail, Sep>]
    : [S]
```

Recursive string transforms illustrate template conditionals but can be expensive over broad unions.

## 45 · Type System Limits & Soundness

TypeScript is intentionally not a proof assistant for JavaScript programs.

### Assertions

```ts
const user = value as User
```

The checker trusts the assertion within its allowed conversion rules; runtime truth is unchanged.

### `any`

`any` removes checks and can contaminate downstream inference.

### Array variance/mutation

Mutable aliasing can violate assumptions even when structural assignment is allowed.

### Indexing

An index may not exist at runtime. `noUncheckedIndexedAccess` makes that uncertainty visible more often.

### Refinement invalidation

A narrowed property can be mutated through another alias or callback. The checker makes pragmatic choices and cannot perfectly model all effects.

### Inaccurate declarations

If `.d.ts` says a function returns `User` but runtime returns `null`, TypeScript trusts the declaration. Type safety depends on declaration accuracy.

### External input

Network/database/storage values can violate your static model. Validation is required at trust boundaries.

### Structural typing trade-off

Structural compatibility supports JavaScript patterns and ergonomic composition, but accidental compatibility can happen. Brands/private members/wrappers can introduce stronger distinctions where the domain needs them.

### What TypeScript cannot guarantee

- authorization
- input validity without runtime checks
- successful network/database operations
- absence of race conditions
- business invariants not represented/proven
- runtime package correctness
- semantic correctness of third-party declarations
- that every type-level model matches actual runtime behavior

## 46 · Compiler & Language Service Mental Models

Conceptual pipeline:

```text
source text
   ↓ scanner
 tokens
   ↓ parser
 AST / SourceFile
   ↓ binder
 symbols + scopes
   ↓ checker
 types + inference + control flow + diagnostics
   ↓
optional emit (.js/.d.ts/maps)
```

### Program

A program conceptually represents the set of source files plus compiler options and host/environment needed for checking.

### `SourceFile`

A parsed file forms an AST root containing syntax nodes and source metadata.

### Symbol vs type

A **symbol** represents a declared named entity and its declarations. A **type** represents the checker’s semantic view of possible values. One symbol can participate in multiple type views; not every type has a simple named symbol.

### Contextual types and inference

Expected type can flow inward to expressions; candidate types can flow outward from values. Generic inference connects these directions across type parameters.

### Control flow

The checker tracks reachable states and facts created by guards/assignments to compute observed narrowed types.

### Incremental compilation

The toolchain can reuse prior semantic/build information when file/config/dependency changes allow it, reducing repeated work.

### Language service

The editor layer needs more than batch checking: partial/incremental project state, completions, references, navigation, refactors, quick fixes, semantic tokens, and diagnostics.

Do not treat private compiler implementation details as public contracts. Mental models should explain behavior without depending on unstable internals.

## 47 · Compiler API & AST Tooling

### TypeScript 7.0 status

⚠️ **Version-sensitive:** TypeScript 7.0's native compiler release does not ship a replacement programmatic Compiler API. The TypeScript team provides side-by-side compatibility with the TypeScript 6 API for tools that still require programmatic compiler access. A new native API is expected in a later 7.x release, so code tied to the old API must be considered migration-sensitive.

### Stable conceptual capabilities

Regardless of concrete API generation, compiler tooling tasks include:

- parse source files/ASTs
- create programs/projects
- inspect nodes
- resolve symbols
- ask a type checker for semantic types
- walk declarations/references
- emit/transform code
- build static analysis
- implement codemods
- generate code/declarations

### TypeScript 6-style conceptual example

```ts
// 🧪 Version-sensitive API example: verify against the installed compiler API.
import ts from "typescript"

const program = ts.createProgram(["src/index.ts"], {
  strict: true,
  noEmit: true,
})
const checker = program.getTypeChecker()

for (const sourceFile of program.getSourceFiles()) {
  if (sourceFile.isDeclarationFile) continue
  ts.forEachChild(sourceFile, visit)
}

function visit(node: ts.Node): void {
  const type = checker.getTypeAtLocation(node)
  void type
  ts.forEachChild(node, visit)
}
```

Do not copy this blindly into a TypeScript 7-native-only environment. Confirm the supported API package/version first.

### AST transforms

AST transforms must preserve semantics, comments/trivia expectations, source maps, module behavior, and formatting strategy. For migration work, text-based replacements are often insufficient; syntax-aware codemods are safer.

## 48 · Performance

TypeScript performance has compiler, editor, lint, declaration, bundler, and CI dimensions.

### TypeScript 7 baseline

The native TypeScript 7 compiler substantially improves full-build and language-service performance on many large codebases through native execution, shared-memory multithreading, and new optimizations. That does not eliminate poor project architecture or pathological type complexity.

### Common causes of slowness

- one enormous program instead of package/project boundaries
- huge generated declarations
- giant unions
- deeply recursive conditional types
- cross-package deep imports
- accidental inclusion of build output/vendor/generated trees
- expensive type-aware lint over too broad a set
- declaration emit through complex public generics
- repeated duplicate type graphs from dependencies

### Project references

References can reduce work and improve editor boundaries when packages have real architectural ownership.

### `skipLibCheck`

`skipLibCheck` can reduce checking cost by skipping full declaration-file checking, but it may hide conflicts/inaccuracies in dependency declarations. It does not make your own source runtime-safe. Use it as an intentional performance/compatibility trade-off, not a default explanation for every typing problem.

### Investigation workflow

```text
1. reproduce with pinned compiler + config
2. separate editor latency from batch `tsc` latency
3. inspect files included in the program
4. run extended diagnostics / tracing where supported
5. identify hot packages/types/declaration emit
6. simplify giant unions/recursive transforms
7. introduce or repair project boundaries
8. compare clean vs incremental build
9. compare TypeScript versions
10. verify lint/bundler work is not being blamed on checker
```

### Parallelism controls

🧪 TypeScript 7 exposes experimental knobs for checker/builder parallelism. Measure before tuning; architecture and default compiler improvements should come before hand-tuning worker counts.

## 49 · Debugging Type Errors

Start every error with a relationship, not a workaround.

```text
What value exists?
What type was inferred?
What type is expected?
What relationship failed?

assignability?
inference?
narrowing?
nullability?
variance?
generic constraint?
overload selection?
module resolution?
declaration mismatch?
```

### Long diagnostics

Read from the outer assignment/call inward. Find the first property/parameter where source and target diverge.

### `never` explosions

`never` often indicates:

- impossible intersection
- exhausted union
- conditional filtered every branch
- generic relationship became contradictory

Create intermediate aliases and substitute concrete types.

### Generic errors

Freeze the problem:

```ts
type Input = /* concrete */
type Output = SomeGeneric<Input>
```

Then evaluate each mapped/conditional step.

### Overload errors

The final implementation may accept a union, but callers are checked against overload signatures. Determine which overload you expected and why each candidate was rejected.

### Editor hovers

Hover types are evidence, not always complete explanations. Add temporary variables/aliases to expose intermediate inference.

### Module-resolution traces

When runtime and checker disagree, trace both resolvers. The compiler can explain which files/package conditions it considered; compare that against Node/bundler behavior.

### Minimal reproductions

A useful repro contains:

```text
small tsconfig
few files
pinned TypeScript version
minimal dependencies
one failing relationship
```

Reducing the problem often reveals whether the issue is language semantics, declarations, module configuration, or framework tooling.

## Senior design-review questions

- Which type is transport, domain, persistence, or public API?
- Where is runtime trust established?
- Are brands preserving validated facts or just renaming strings?
- Is a type-level transform worth its diagnostic/build cost?
- What intentional unsoundness could affect this API?
- Is tooling code depending on a TypeScript 6 API in a TypeScript 7 migration?
- Is the slow step compiler checking, lint, declaration emit, bundling, or editor project loading?
- Can the error be stated as one failed assignability relationship?