---
title: 11–16 · Generics & Type Manipulation
---

# 11–16 · Generics & Type Manipulation

## 11 · Generics

Generics describe relationships between types rather than hard-coding one concrete type.

```ts
function identity<T>(value: T): T {
  return value
}
```

`T` is not “any.” It represents one type chosen for a particular instantiation. The important property is the relationship: the returned value has the same type as the input.

### Inference

```ts
const a = identity("hello") // string
const b = identity(123)     // number
```

The caller usually should not need to specify `<T>` explicitly. Good API design lets the compiler infer type parameters from arguments and context.

### Multiple parameters

```ts
function pair<A, B>(left: A, right: B): [A, B] {
  return [left, right]
}
```

Use multiple parameters when they model independent relationships. Avoid creating generic parameters that do not influence another input, output, or constraint.

Bad:

```ts
function log<T>(message: string): void {
  console.log(message)
}
```

`T` does nothing and forces callers to think about a meaningless parameter.

### Constraints

```ts
function getId<T extends { id: string }>(value: T): string {
  return value.id
}
```

A constraint says every valid `T` must satisfy a minimum structure, while preserving more specific information about the caller's actual type.

### Relationships between arguments

```ts
function getProperty<T, K extends keyof T>(object: T, key: K): T[K] {
  return object[key]
}
```

The function establishes three linked facts:

```text
T = object shape
K = one valid key of T
T[K] = value type at that key
```

This is more valuable than a generic used merely to avoid writing a union.

### Defaults

```ts
type ApiResult<TData, TError = Error> =
  | { ok: true; data: TData }
  | { ok: false; error: TError }
```

Defaults reduce caller noise when one type parameter has a sensible common choice.

### Factories

```ts
type Constructor<T> = new (...args: any[]) => T

function create<T>(Ctor: Constructor<T>): T {
  return new Ctor()
}
```

For public APIs, avoid `any` in helper internals when a stronger representation is practical, but recognize that variadic constructor forwarding sometimes requires a carefully contained escape.

### Callback generics

```ts
function mapValue<T, U>(value: T, fn: (value: T) => U): U {
  return fn(value)
}
```

Type information flows from the first argument into the callback and from the callback return into `U`.

### Consumer inference ergonomics

A public generic API should be judged from the call site:

```ts
const user = await client.get("/users/42")
```

If every call requires multiple explicit type arguments, the API may be pushing internal complexity onto consumers. Prefer inference from values, schema objects, builders, or overloads when practical.

### Common generic design mistakes

- generic parameters used once with no relationship
- too many independent parameters
- constraints so broad that inference becomes `unknown` or unions become huge
- returning `T` even when runtime code does not actually preserve `T`
- using conditional types when overloads or a union would be clearer
- forcing callers to provide types that could be derived from values

### Production rule

A clever generic is not automatically a good API. Favor predictable diagnostics, readable signatures, stable inference, and evolution under semver.

## 12 · `keyof`, Type-Position `typeof` & Indexed Access

### `keyof`

```ts
type User = { id: string; age: number }
type UserKey = keyof User // "id" | "age"
```

`keyof` converts object keys into a key union.

### Type-position `typeof`

JavaScript `typeof` is a runtime operator. TypeScript also allows `typeof` in a type position to capture the static type of a value.

```ts
const defaults = {
  retries: 3,
  mode: "safe",
}

type Defaults = typeof defaults
```

### Indexed access

```ts
type UserId = User["id"] // string
```

Generic form:

```ts
type ValueOf<T, K extends keyof T> = T[K]
```

### Extracting value unions

```ts
const routes = {
  home: "/",
  users: "/users",
} as const

type RouteName = keyof typeof routes
type Route = (typeof routes)[RouteName] // "/" | "/users"
```

This pattern keeps a runtime source of truth while deriving a compile-time union.

### Arrays and tuples

```ts
const roles = ["admin", "editor", "viewer"] as const
type Role = (typeof roles)[number]
```

Indexing a tuple with `number` forms the union of its element types.

## 13 · Mapped Types

Mapped types transform properties across a key union.

```ts
type Optional<T> = {
  [K in keyof T]?: T[K]
}
```

### Modifiers

```ts
type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
}

type Concrete<T> = {
  [K in keyof T]-?: T[K]
}
```

`+` adds a modifier, `-` removes it, and omission normally means preserve/add according to the mapped syntax.

### Key remapping

```ts
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
}
```

### Filtering with `never`

```ts
type StringKeys<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K]
}
```

A remapped key of `never` is dropped.

### Production use

Mapped types are excellent for mechanical relationships such as DTO projections, event handler maps, form-field state, and SDK helpers. They become harmful when a developer must mentally execute several nested transforms to understand a public API.

## 14 · Conditional Types

Conditional types choose a type based on assignability.

```ts
type ElementType<T> = T extends readonly (infer U)[] ? U : T
```

Mental model:

```text
T extends U ? A : B
      │
      ├─ assignable → A
      └─ otherwise  → B
```

### Distribution

When a conditional checks a naked type parameter, unions distribute:

```ts
type ToArray<T> = T extends unknown ? T[] : never
type X = ToArray<string | number>
// string[] | number[]
```

Conceptually:

```text
(string | number)
   ↓ distribute
string branch | number branch
   ↓
string[] | number[]
```

### Preventing distribution

```ts
type ToArrayNonDist<T> = [T] extends [unknown] ? T[] : never
```

Wrapping both sides prevents the naked-type-parameter distribution rule.

### `infer`

`infer` introduces a type variable inside a conditional pattern.

```ts
type Return<T> = T extends (...args: any[]) => infer R ? R : never
```

The checker attempts to match `T` to the function shape and captures the return position as `R`.

### Recursive conditionals

```ts
type DeepReadonly<T> =
  T extends (...args: any[]) => any ? T :
  T extends readonly unknown[] ? { readonly [K in keyof T]: DeepReadonly<T[K]> } :
  T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> } :
  T
```

Recursive transforms can become expensive and can exceed compiler recursion/instantiation limits. Limit depth where practical and resist deep utilities that obscure domain semantics.

## 15 · Template Literal Types

Template literal types combine string literal unions.

```ts
type Event = "created" | "updated"
type Entity = "user" | "order"
type Topic = `${Entity}:${Event}`
// "user:created" | "user:updated" | "order:created" | "order:updated"
```

### Property-derived event APIs

```ts
type ChangeEvents<T> = {
  [K in keyof T & string as `${K}Changed`]: (value: T[K]) => void
}
```

### Intrinsic string utilities

Built-ins such as `Uppercase`, `Lowercase`, `Capitalize`, and `Uncapitalize` transform string literal types.

### Parsing-style patterns

```ts
type ParamName<S extends string> =
  S extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ParamName<Rest>
    : S extends `${string}:${infer Param}`
      ? Param
      : never
```

This can power typed routes, but route parsing at runtime still needs actual code. A type parser does not validate a string received from a user.

### Readability limit

Template literal types are strongest when they mirror an obvious naming convention. If the type begins acting like a general parser/compiler, consider code generation, schemas, or a smaller public abstraction.

## 16 · Utility Types

Utility types encode common transformations.

### `Partial<T>`

Mental implementation:

```ts
type PartialLike<T> = { [K in keyof T]?: T[K] }
```

Useful for patch-like drafts. Misuse: treating every domain entity as partially valid.

### `Required<T>`

```ts
type RequiredLike<T> = { [K in keyof T]-?: T[K] }
```

Useful after a normalization phase has guaranteed every property.

### `Readonly<T>`

```ts
type ReadonlyLike<T> = { readonly [K in keyof T]: T[K] }
```

Shallow compile-time write protection, not deep runtime freezing.

### `Record<K, V>`

```ts
type RolePermissions = Record<Role, readonly Permission[]>
```

Use for a complete finite key set. A broad `Record<string, V>` can imply more totality than runtime data actually has; `noUncheckedIndexedAccess` helps surface that risk.

### `Pick` and `Omit`

```ts
type UserPreview = Pick<User, "id" | "name">
type UserWithoutSecret = Omit<User, "secret">
```

Useful for mechanical projections, but a public API DTO should often be designed intentionally rather than obtained by subtracting database fields.

### `Exclude` and `Extract`

```ts
type NonAdmin = Exclude<Role, "admin">
type StaffRole = Extract<Role, "admin" | "editor">
```

They operate on unions.

### `NonNullable`

```ts
type Present = NonNullable<string | null | undefined> // string
```

It expresses a compile-time transformation, not a runtime check.

### Function and constructor utilities

```ts
type Args = Parameters<typeof fn>
type CtorArgs = ConstructorParameters<typeof Service>
type Output = ReturnType<typeof fn>
type ServiceInstance = InstanceType<typeof Service>
```

These are useful for coupling helpers/tests to an implementation signature. Overuse can create hidden API coupling that makes refactors surprisingly wide.

### `Awaited<T>`

Models recursive promise-like unwrapping similar to `await`.

```ts
type Loaded = Awaited<Promise<Promise<User>>> // User
```

### `ThisParameterType`, `OmitThisParameter`, `ThisType`

These help model APIs that use explicit or contextual `this`. `ThisType` is a marker used with contextual object typing rather than a normal transformation.

### Intrinsic string utilities

`Uppercase`, `Lowercase`, `Capitalize`, and `Uncapitalize` support template-literal API construction.

## Type-manipulation debugging workflow

When a complex type fails:

```text
1. substitute concrete T/K values
2. evaluate keyof/indexed access first
3. expand one mapped layer
4. determine whether a conditional distributes
5. inspect each union branch
6. capture inferred pieces explicitly with aliases
7. stop when the public API is harder to understand than the runtime problem
```

Use temporary aliases:

```ts
type Step1 = keyof SomeType
type Step2 = SomeType[Step1]
type Step3 = Transform<Step2>
```

This is often more effective than staring at one enormous editor hover.

## Exercises

- Implement `PickByValue<T, V>` with mapped types and key remapping.
- Show a distributive conditional and its non-distributive equivalent.
- Build a route constant and derive route-name and route-value unions from it.
- Design a generic function where the output relationship justifies the generic.
- Refactor a “clever” recursive utility into a simpler domain-specific type and explain why diagnostics improve.