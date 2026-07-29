---
title: 01–05 · Foundations to Unions & Intersections
---

# 01–05 · Foundations to Unions & Intersections

This chapter builds the vocabulary the rest of the handbook depends on: values exist at runtime; types describe possible values at compile time; assignability asks whether one type can safely be used where another is expected.

## 01 · Foundations

TypeScript is JavaScript plus a static type system and tooling layer. It aims to catch classes of mistakes before execution while preserving JavaScript's runtime model.

```text
.ts / .tsx source
      ↓
    parse
      ↓
     bind
      ↓
infer + check
      ↓
diagnostics
      ↓
optional JavaScript/declaration emit
```

The checker does not execute your program. It reasons from syntax, declarations, control flow, library definitions, and compiler options.

### Static, gradual, structural

**Static typing** means types are checked before execution. **Gradual typing** means you can mix precisely typed code with weaker areas such as JavaScript files or `any`. **Structural typing** means compatibility is normally based on members rather than nominal names.

```ts
type Point = { x: number; y: number }

const p = { x: 1, y: 2, label: "origin" }
const point: Point = p // OK: p has at least the required shape
```

### `.ts` and `.tsx`

Use `.ts` for TypeScript without JSX and `.tsx` where JSX syntax is parsed. The extension changes parsing; it is not merely cosmetic.

### `tsc`, checking and transpilation

`tsc` can both check types and emit JavaScript. Many modern tools such as Vite, SWC, esbuild, and Babel can transform TypeScript syntax faster, but syntax transformation alone does not mean full program type checking occurred.

A common application setup is:

```text
editor → TypeScript language service
CI     → tsc --noEmit
build  → Vite/SWC/esbuild/bundler
```

### Minimal strict configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "noEmit": true,
    "target": "ES2023",
    "module": "preserve",
    "moduleResolution": "bundler",
    "verbatimModuleSyntax": true
  },
  "include": ["src"]
}
```

That example is suitable for a modern bundler-style application; Node projects need Node-aware module semantics, covered later.

### Editor integration and language service

The editor can provide diagnostics, hovers, completion, rename, navigation, and refactors because it maintains a semantic model of the project. A common source of confusion is an editor using a different TypeScript version or tsconfig than CI. When editor and CI disagree, verify:

```text
same TypeScript version?
same tsconfig?
same included files?
same module mode?
same generated declarations?
```

### Source maps

Source maps connect generated JavaScript locations back to source locations. They help runtime debugging, but they are not type information and do not make production code safer by themselves.

## 02 · Primitive Types & Basic Inference

### Primitive types

TypeScript models JavaScript primitives with lowercase type names:

```ts
const title: string = "Handbook"
const count: number = 42
const large: bigint = 42n
const ready: boolean = true
const token: symbol = Symbol("token")
const nothing: null = null
const missing: undefined = undefined
```

Prefer `string`, `number`, `boolean`, and `symbol` rather than boxed `String`, `Number`, `Boolean`, or `Symbol` types.

### Arrays and tuples

```ts
const ids: number[] = [1, 2, 3]
const names: Array<string> = ["Ada", "Lin"]

const entry: [id: number, name: string] = [1, "Ada"]
```

An array models a homogeneous collection of arbitrary length. A tuple models positions with known meanings and often known length.

### Functions and inference

```ts
function add(a: number, b: number) {
  return a + b // return type inferred as number
}
```

TypeScript infers where it can preserve useful information. Add annotations at boundaries, public APIs, recursive definitions, ambiguous cases, or places where you want to constrain rather than merely infer.

Over-annotation can destroy useful literal information:

```ts
const method = "GET"            // type "GET"
let mutableMethod = "GET"       // type string after widening
const forced: string = "GET"    // explicitly string
```

### Parameters

```ts
function search(
  query: string,
  limit = 20,
  cursor?: string,
  ...tags: string[]
): Promise<string[]> {
  return Promise.resolve([])
}
```

Defaulted parameters can be omitted by callers. Optional parameters may be absent. Rest parameters gather zero or more arguments.

## 03 · Object Types

Object type literals describe required members, optional members, readonly intent, call signatures, and indexable keys.

```ts
type User = {
  readonly id: string
  name: string
  nickname?: string
  profile: {
    timezone: string
  }
}
```

### Optional property vs explicit `undefined`

These are not identical:

```ts
type A = { foo?: string }
type B = { foo: string | undefined }

const a: A = {} // property may be absent
// const b: B = {} // error: property is required
```

With `exactOptionalPropertyTypes`, an optional property more accurately models absence: assigning `undefined` is not automatically accepted unless `undefined` is explicitly part of the property's type.

### Readonly is compile-time intent

```ts
const user: Readonly<User> = getUser()
```

`readonly` normally prevents writes through that typed reference. It does not deep-freeze the runtime object.

### Index signatures

```ts
type Counts = {
  [key: string]: number
}
```

An index signature says every compatible key has the declared value type. Do not use broad index signatures merely to silence errors; they can weaken guarantees for known properties.

### Excess property checking

Fresh object literals receive an extra check:

```ts
type Config = { port: number }

// const c: Config = { port: 3000, debug: true }
// error: fresh literal has unknown property `debug`

const raw = { port: 3000, debug: true }
const c: Config = raw // structurally assignable
```

This is not “exact object typing.” TypeScript remains structurally typed.

### Spread and mutation

```ts
const base = { retries: 2, secure: true }
const config = { ...base, retries: 3 }
```

The checker models the resulting shape according to spread order. Runtime getters, prototype behavior, mutation, and external aliases can still make the real object more complicated than the static view.

## 04 · Interfaces & Type Aliases

Both can describe object-like contracts.

```ts
interface User {
  id: string
  name: string
}

type UserAlias = {
  id: string
  name: string
}
```

### Where they overlap

Both support generics, callable members, recursive references, and object composition.

```ts
interface Box<T> { value: T }
type Pair<T> = { left: T; right: T }
```

### Differences that matter

**Interface extension** expresses named structural extension:

```ts
interface Entity { id: string }
interface User extends Entity { name: string }
```

**Type aliases** can name any type expression:

```ts
type Id = string | number
type UserWithMeta = User & { createdAt: Date }
type Keys = keyof User
```

**Declaration merging** is available to interfaces:

```ts
interface PluginContext { logger: Logger }
interface PluginContext { metrics: Metrics }
```

That is useful for intentional library augmentation, but surprising in application code if accidental.

### Public API design

Do not follow “always interface” or “always type.” Prefer the construct that communicates the semantic job:

```text
open/augmentable object contract → interface can be natural
union/transformation/composition → type is necessary or clearer
closed public contract → either, but avoid accidental merging if closure matters
```

Intersections are not a drop-in replacement for interface extension. Intersections combine constraints and can produce difficult property conflicts; interface extension validates compatibility more directly at the declaration point.

## 05 · Union & Intersection Types

### Unions: one of several possibilities

```ts
type Id = string | number
```

You may only use operations safe for every current member until control flow narrows the union.

### Discriminated unions

```ts
type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error }
```

This is better than several booleans:

```ts
// bad model: impossible combinations are representable
interface BadState {
  loading: boolean
  success: boolean
  failed: boolean
}
```

Discriminated unions make illegal combinations harder to represent.

### Result modeling

```ts
type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E }
```

Use this when failure is an expected part of a function's contract and callers should handle it explicitly. Do not mechanically replace all exceptions with `Result`; truly exceptional failures, infrastructure crashes, or unrecoverable programmer errors may still be exceptions.

### Intersections

```ts
type Timestamped = { createdAt: Date }
type UserRecord = User & Timestamped
```

Intersections mean a value must satisfy all constituent constraints. They do not mean “merge objects at runtime.”

Impossible intersections collapse parts of a type:

```ts
type Impossible = string & number // never
```

Conflicting object properties may also lead to unusable members:

```ts
type A = { id: string }
type B = { id: number }
type C = A & B // id behaves as string & number → never
```

### ADT and state-machine thinking

Model states and transitions around meaningful variants:

```ts
type Checkout =
  | { state: "cart"; items: Item[] }
  | { state: "paying"; paymentId: string }
  | { state: "paid"; receipt: Receipt }
  | { state: "failed"; reason: PaymentError }
```

Then make transition functions accept only states they can process. This moves many workflow mistakes from runtime branches into compile-time design feedback.

## Debugging assignability in these chapters

When a basic assignment fails, write down:

```text
actual type   → what the expression has
expected type → what the destination requires
relationship  → which property/member/union case failed
reason        → missing? too broad? nullable? readonly? incompatible callback?
```

Do not immediately add `as`. First determine whether the implementation, the model, or the boundary assumption is wrong.

## Exercises

1. Model a payment state without booleans using a discriminated union.
2. Demonstrate why `{ foo?: string }` differs from `{ foo: string | undefined }`.
3. Replace an over-broad index signature with a finite-key mapped shape.
4. Explain why an object variable with extra members can be assignable while the same fresh literal gets an excess-property error.
5. Design one public contract where an interface is clearer and one where a type alias is clearer.