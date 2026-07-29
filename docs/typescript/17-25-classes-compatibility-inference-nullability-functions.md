---
title: 17–25 · Classes, Compatibility, Variance, Inference & Advanced Functions
---

# 17–25 · Classes, Compatibility, Variance, Inference & Advanced Functions

## 17 · Classes

TypeScript classes are JavaScript classes plus static checks and TypeScript-only declarations.

```ts
abstract class Entity<TId> {
  constructor(public readonly id: TId) {}
  abstract describe(): string
}

class User extends Entity<string> {
  #token = "runtime-private"
  protected active = true

  constructor(id: string, public name: string) {
    super(id)
  }

  override describe() {
    return `${this.id}:${this.name}`
  }
}
```

`public`, `protected`, and TypeScript `private` affect static accessibility; JavaScript `#private` is enforced by the runtime language. TypeScript `private` therefore is not a security boundary.

### Strict initialization

With `strictPropertyInitialization`, instance properties must be initialized in a field initializer, constructor, or otherwise proven. Prefer constructor-established invariants over `!` when possible.

### `implements`

`implements` checks that a class instance satisfies an interface; it does not change method inference or inject runtime behavior.

### Polymorphic `this`

```ts
class Query {
  where(_x: string): this { return this }
}
```

Returning `this` supports fluent APIs while preserving subclasses.

### Parameter properties

```ts
class Point {
  constructor(public x: number, public y: number) {}
}
```

Convenient, but use with restraint in libraries because constructor syntax now also declares public surface.

## 18 · Enums & Alternatives

Enums create both type-level and, usually, runtime artifacts.

```ts
enum Direction {
  Up,
  Down,
}

enum Status {
  Active = "active",
  Disabled = "disabled",
}
```

Numeric enums can have reverse mappings in emitted JavaScript. String enums do not provide the same numeric reverse map.

### `const enum`

`const enum` can inline member values rather than emit a runtime object. This has historically created interoperability issues for declaration publishing and isolated transforms. For libraries and toolchains that transpile files independently, prefer ordinary string unions or `as const` objects unless you fully control compilation.

### Object alternative

```ts
const Status = {
  Active: "active",
  Disabled: "disabled",
} as const

type Status = (typeof Status)[keyof typeof Status]
```

This uses ordinary JavaScript at runtime and a derived literal union at compile time. Enums remain valid when their runtime namespace/identity semantics are useful; the object-plus-union pattern often integrates more naturally with JavaScript and tree-shaking.

### Ambient enums

Ambient enum declarations describe runtime objects supplied elsewhere. As with all declarations, inaccurate descriptions can make type checking misleading.

## 19 · Structural Typing & Compatibility

TypeScript is primarily structural: compatibility depends on shape.

```ts
type Named = { name: string }
const employee = { name: "Ada", salary: 100 }
const named: Named = employee
```

The checker asks whether the source has the members required by the target with compatible types.

### Function compatibility

Return types are generally covariant: a function producing something more specific can be used where a broader result is accepted.

Parameters require more care because callers decide what values may be passed.

```ts
type Animal = { name: string }
type Dog = Animal & { bark(): void }

let handlesAnimal: (a: Animal) => void
const handlesDog = (d: Dog) => d.bark()
// handlesAnimal = handlesDog // unsafe under strict function checking
```

If callers may pass any `Animal`, a callback requiring a `Dog` is too narrow.

### Optional and rest parameters

Compatibility accounts for JavaScript calling conventions. A function may ignore extra arguments. Rest parameters model variable arity. Do not mistake permissive runtime calling for proof that every callback substitution is safe.

### Classes and nominal islands

Classes are structurally compared, except private/protected members introduce origin-sensitive compatibility. Two classes with identical public shape can be incompatible when their private/protected members originate from different declarations.

### Generics

Generic type parameters affect compatibility only when they appear in members that affect shape. Phantom parameters can therefore fail to create the nominal distinction developers expect.

### Intentional unsoundness

TypeScript accepts some patterns that are not fully sound because JavaScript ergonomics and common APIs would otherwise become difficult to express. Senior reasoning requires knowing where the model intentionally trades proof for usability.

## 20 · Variance

Variance asks how a generic type changes compatibility when its type argument becomes more or less specific.

```text
Dog <: Animal

covariant C<T>:
C<Dog> <: C<Animal>

contravariant F<T>:
F<Animal> <: F<Dog>

invariant M<T>:
neither direction is generally safe

bivariant:
both accepted in selected compatibility contexts
```

### Covariance

Readonly producers are naturally covariant:

```ts
const dogs: readonly Dog[] = []
const animals: readonly Animal[] = dogs
```

Consumers only read `Animal`, so getting a `Dog` is safe.

### Contravariance

Callback parameter positions behave contravariantly under strict function checking: a function able to handle any `Animal` can safely stand in where only `Dog`s will be supplied.

### Mutable arrays

Mutable arrays expose a classic soundness compromise. If `Dog[]` is treated as `Animal[]`, writing a non-Dog animal through the broader alias can violate the original array's intended element type. Prefer readonly collections where covariance is what the API actually needs.

### Bivariance

Some method/callback patterns retain bivariant behavior for ecosystem compatibility. Do not build security or validation assumptions on this permissiveness.

### Generic API design

Separate input and output roles when it improves soundness:

```ts
interface Producer<out T> {
  get(): T
}

interface Consumer<in T> {
  consume(value: T): void
}
```

Where variance annotations are supported/relevant, use them to document/check intended relationships, not as a way to force incorrect assignability.

## 21 · Advanced Inference

Inference collects candidate types from values, expected context, constraints, callbacks, return positions, and generic relationships.

### Contextual typing

```ts
const handler: (event: MouseEvent) => void = event => {
  event.preventDefault()
}
```

The expected function type flows into the callback.

### Best common type

```ts
const values = [1, 2, null]
```

The inferred element type must accommodate the candidates. Context and compiler options influence the result.

### Generic inference direction

```ts
function transform<T, U>(value: T, fn: (x: T) => U): U {
  return fn(value)
}
```

`T` is inferred from `value`, contextualizes the callback parameter, then `U` is inferred from callback output.

### Why inference fails

Typical causes:

- not enough value-level evidence
- competing candidates widen to a union/common supertype
- circular relationships
- contextual type pushes inference in an unintended direction
- a constraint is too broad or too narrow
- overload choice happens before the relationship you expected
- a helper erased literal information

### API design for inference

Put inferable values in positions the compiler can observe. Prefer:

```ts
defineSchema({ id: stringField(), age: numberField() })
```

over APIs where callers must repeat both runtime schema and manual type arguments.

When inference remains ambiguous, explicit type arguments are appropriate. The goal is not “never write generics”; it is predictable inference.

## 22 · `satisfies` Deep Dive

Given:

```ts
type Config = {
  mode: "dev" | "prod"
  endpoints: Record<string, string>
}
```

Annotation:

```ts
const a: Config = {
  mode: "prod",
  endpoints: { users: "/users" },
}
```

The variable is exposed as `Config`, which can widen details such as known endpoint keys.

Assertion:

```ts
const b = {
  mode: "prod",
  endpoints: { users: "/users" },
} as Config
```

The programmer requests the target view; an assertion is not the same kind of compatibility proof as an annotation/satisfies check.

`satisfies`:

```ts
const c = {
  mode: "prod",
  endpoints: { users: "/users" },
} satisfies Config

type Endpoint = keyof typeof c.endpoints // "users"
```

Use `satisfies` when you want target validation while retaining expression-specific information for later inference.

It does not magically make every literal maximally narrow; normal inference rules still apply. Combine with `as const` only when readonly/literal preservation is actually desired.

## 23 · Nullability

With `strictNullChecks`, `null` and `undefined` are distinct members that must be modeled.

```ts
function findUser(id: string): User | undefined {
  return cache.get(id)
}
```

### Optional chaining

```ts
user.profile?.avatarUrl
```

Stops when the left side is nullish. It does not validate deeper business assumptions.

### Nullish coalescing

```ts
const pageSize = input.pageSize ?? 20
```

Unlike `||`, `??` preserves valid falsy values such as `0` and `""`.

### DOM/API values

Browser and server APIs often return nullable values because absence is real. Narrow explicitly rather than scattering `!`.

### `noUncheckedIndexedAccess`

Without extra checking, indexed access on a dictionary/array can be typed too optimistically. With `noUncheckedIndexedAccess`, uncertain keys include `undefined`.

```ts
const counts: Record<string, number> = {}
const n = counts["missing"] // number | undefined with the flag
```

This often better models runtime reality.

### Absence modeling

Choose semantics deliberately:

```text
missing property → optional (`foo?`)
known property but possibly absent value → `foo: T | undefined`
explicit empty domain state → perhaps `null`
lookup miss → often `undefined`
```

## 24 · Arrays, Tuples & Readonly Collections

```ts
const mutable: User[] = []
const readonlyUsers: readonly User[] = mutable
```

Accept readonly input when a function only reads:

```ts
function names(users: readonly User[]): string[] {
  return users.map(u => u.name)
}
```

This supports more callers and communicates no mutation through that parameter.

### Tuples

```ts
type Entry = [id: string, active: boolean]
type MaybeEntry = [id: string, active?: boolean]
type HeadTail<T, Rest extends unknown[]> = [T, ...Rest]
```

Named tuple labels improve readability but do not create runtime property names.

### Variadic tuples

```ts
type WithContext<Args extends unknown[]> = [context: Context, ...args: Args]
```

Useful for typed middleware, function composition, and event APIs.

### Tuple inference

Literal arrays may infer as mutable arrays unless context, `as const`, or const generic inference preserves tuple structure.

## 25 · Advanced Function APIs

### Generic call signatures

```ts
type Mapper = <T, U>(value: T, fn: (value: T) => U) => U
```

### Construct signatures

```ts
type Factory<T> = new (...args: any[]) => T
```

### Hybrid callable objects

JavaScript functions can also have properties:

```ts
interface Counter {
  (step?: number): number
  reset(): void
  readonly current: number
}
```

### Builders and fluent APIs

Builders are strongest when each operation narrows or enriches state so illegal finalization becomes impossible.

```ts
type Draft = { url?: string; token?: string }
```

Instead of one permissive draft type, a staged builder can encode “URL chosen” and “token chosen” as different generic states. Do not over-engineer trivial configuration objects.

### `this` parameters

```ts
function serialize(this: User) {
  return JSON.stringify({ id: this.id })
}
```

A TypeScript `this` parameter is erased from emitted JavaScript and documents/checks the call receiver.

### Typed events

```ts
type Events = {
  userCreated: User
  orderPaid: Order
}

class Emitter<E extends Record<string, unknown>> {
  emit<K extends keyof E>(name: K, payload: E[K]): void {}
  on<K extends keyof E>(name: K, handler: (payload: E[K]) => void): void {}
}
```

The key controls the payload type. Runtime event names/payloads from external systems still require validation.

### Middleware composition

Typed middleware must model how one stage's output becomes the next stage's input. If every middleware is typed `(ctx: any) => any`, TypeScript provides little architectural value.

## Senior decision prompts

- Does this class need runtime privacy or only API-level encapsulation?
- Is an enum's runtime object useful, or is a literal union/object clearer?
- Is a callback position producer, consumer, or both?
- Did inference fail because the API lacks value-level evidence?
- Does `satisfies` improve validation without hiding useful inferred keys?
- Should this collection be mutable at the boundary?
- Is a staged builder encoding a real invariant or merely showing off the type system?