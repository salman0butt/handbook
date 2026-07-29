---
title: 06–10 · Narrowing, Functions, Safety Escapes & Literals
---

# 06–10 · Narrowing, Functions, Safety Escapes & Literals

## 06 · Narrowing & Control-Flow Analysis

Narrowing is the checker reducing a broader static type to a more specific one when program logic proves something about a value.

```text
string | number
      ↓ typeof check
   string
```

```ts
function normalize(value: string | number) {
  if (typeof value === "string") {
    return value.trim()
  }
  return value.toFixed(2)
}
```

### Main narrowing tools

`typeof` handles JavaScript primitive classifications; `instanceof` follows runtime prototype relationships; `in` checks property presence; equality checks can correlate unions; truthiness can remove falsy possibilities but may accidentally discard meaningful values such as `""` or `0`.

```ts
function print(value: string | null) {
  if (value !== null) console.log(value.toUpperCase())
}
```

Prefer precise null checks over truthiness when empty strings or zero are valid domain values.

### Discriminants and exhaustiveness

```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number }

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle": return Math.PI * shape.radius ** 2
    case "square": return shape.size ** 2
    default: return assertNever(shape)
  }
}

function assertNever(value: never): never {
  throw new Error(`Unexpected shape: ${JSON.stringify(value)}`)
}
```

`never` appears because after every known branch is removed, no valid member should remain.

### User-defined guards

```ts
function isUser(value: unknown): value is User {
  return typeof value === "object" && value !== null &&
    "id" in value && typeof (value as { id?: unknown }).id === "string"
}
```

A predicate is a promise from implementation to checker. If the implementation lies, TypeScript trusts it. For large external schemas, prefer systematic runtime validation rather than ad-hoc guards.

### Assertion functions

```ts
function assertUser(value: unknown): asserts value is User {
  if (!isUser(value)) throw new Error("Invalid user")
}
```

After a successful call, control flow treats the value as `User`.

### Why narrowing can disappear

The compiler must account for mutation, aliases, callbacks, and reassignment.

```ts
function f(x: string | undefined) {
  if (x !== undefined) {
    x.toUpperCase()
    x = undefined
    // x.toUpperCase() // error: assignment invalidated narrowing
  }
}
```

Object-property refinements deserve extra caution when code can mutate the object indirectly. Copy a proven value to a local `const` when that creates a clearer immutable proof.

```ts
const id = request.userId
if (id !== undefined) {
  queue(() => useId(id))
}
```

### Control-flow mental model

```text
declared type
   ↓
current flow node
   ↓
checks / assignments / reachability
   ↓
flow-sensitive observed type
```

The declared type remains the assignment envelope. The observed type changes as control flow proves and invalidates facts.

## 07 · Functions

Functions combine parameter contracts, return contracts, generic relationships, contextual typing, and compatibility rules.

### Declarations, expressions and contextual typing

```ts
const parse: (input: string) => number = input => Number(input)
```

`input` gets `string` from context. Contextual typing flows from expected position into an expression.

### `void` and `never`

`void` means callers should not rely on a meaningful return value. A callback returning a value can often still be assigned to a `void`-returning callback because the caller ignores that value.

`never` means successful completion produces no value because execution throws, loops forever, or reaches an impossible branch.

```ts
function fail(message: string): never {
  throw new Error(message)
}
```

### Async functions

An `async` function returns a `Promise` of its resolved result.

```ts
async function load(id: string): Promise<User> {
  const response = await fetch(`/users/${id}`)
  return validateUser(await response.json())
}
```

The runtime validation is crucial: annotating `Promise<User>` does not transform unknown network data into a valid `User`.

### Overloads

```ts
function format(value: Date): string
function format(value: number): string
function format(value: Date | number): string {
  return value instanceof Date ? value.toISOString() : value.toFixed(2)
}
```

Callers see overload signatures; the implementation signature must be compatible with the overload set but is not directly callable as an extra public signature.

### Union vs overload vs generic

Use a **union** when inputs are processed the same way and output does not need a more specific relationship.

```ts
function len(value: string | unknown[]): number {
  return value.length
}
```

Use **overloads** when there are a small number of distinct call shapes or return relationships that are awkward to express generically.

Use a **generic** when the output type depends on the input type through a reusable relationship.

```ts
function first<T>(values: readonly T[]): T | undefined {
  return values[0]
}
```

### Function compatibility and variance preview

A function is not compatible merely because it has the same return type. Parameter relationships matter. Under `strictFunctionTypes`, function-type parameters are checked contravariantly in relevant positions, preventing a callback that accepts only a narrower input from being used where it may receive broader inputs.

## 08 · Special Types

### `any`

`any` opts out of checking and propagates unsafety.

```ts
let data: any
// nearly anything becomes allowed from here
```

Use it only as a conscious migration/tooling boundary where safer alternatives are impractical, and contain it immediately.

### `unknown`

`unknown` can hold any value, but you must prove facts before use.

```ts
function parseJson(text: string): unknown {
  return JSON.parse(text)
}
```

This is the right conceptual type for external, untrusted values.

### `never`

`never` describes an impossible value and appears naturally in exhaustive unions and impossible intersections.

### `void`

`void` signals that a return value is intentionally not part of the useful contract. It is not equivalent to `undefined` in all function-compatibility contexts.

### `object`, `{}`, and `Object`

- `object` excludes primitive values.
- `{}` historically accepts any non-nullish value; it does not mean “plain object with no properties.”
- `Object` refers to the broad boxed/object interface and is rarely the right application-level annotation.

For arbitrary keyed data, prefer something explicit such as `Record<string, unknown>` when that is truly the shape you need.

### Null and undefined

With `strictNullChecks`, absence must be represented and handled rather than silently flowing into every type.

```text
any     = opt out
unknown = must prove
never   = impossible
void    = caller ignores meaningful result
```

## 09 · Assertions & Safety Escapes

Assertions override the checker; they do not create runtime evidence.

```ts
const user = value as User
```

### Preferred safety ladder

```text
inference
   ↓
narrowing
   ↓
runtime validation
   ↓
generic constraints / better API model
   ↓
single assertion
   ↓
double assertion
   ↓
any
```

The lower you go, the more proof responsibility moves from compiler to programmer.

### Non-null assertion

```ts
const element = document.querySelector("#app")!
```

This states “I know this is non-null.” It does not make the DOM query succeed. Prefer explicit checks unless an external invariant is genuinely guaranteed and documented.

### Definite assignment assertion

```ts
class Service {
  client!: Client
}
```

This tells strict property initialization that some lifecycle will assign the field. It is appropriate only when that lifecycle is reliable and not expressible more safely through construction.

### Double assertion

```ts
const forced = value as unknown as Target
```

This suppresses relationship checks by bridging through `unknown`. Treat it as a high-risk escape hatch, typically for broken external declarations, framework interop, or carefully documented migration code.

### Error suppression comments

`@ts-expect-error` is preferable when deliberately testing or documenting an error because it itself fails if the expected diagnostic disappears.

```ts
// @ts-expect-error invalid API use should remain rejected
createUser({ id: 123 })
```

`@ts-ignore` suppresses regardless of whether the error remains and can silently outlive the reason it was added. Avoid it in normal production code.

`@ts-check` enables checking in JavaScript files; `@ts-nocheck` disables it for a file and should be migration-only.

## 10 · Literals, Widening, `as const` & `satisfies`

### Literal widening

```ts
const mode = "production" // "production"
let mutableMode = "production" // string
```

A mutable variable normally widens because future assignments may use other strings.

### `as const`

```ts
const routes = {
  home: "/",
  users: "/users",
} as const
```

This requests narrow literal inference and readonly treatment for object properties/array positions in that expression.

```ts
type RouteName = keyof typeof routes
type Route = (typeof routes)[RouteName]
```

Do not confuse `as const` with runtime freezing. The checker narrows and marks structure readonly; JavaScript runtime immutability requires mechanisms such as `Object.freeze` and even that is shallow unless you implement deeper freezing.

### `satisfies`

```ts
type Config = {
  mode: "development" | "production"
  retries: number
}

const config = {
  mode: "production",
  retries: 3,
} satisfies Config
```

`satisfies` checks that an expression is assignable to a target while preserving the expression's useful inferred type.

Compare:

```ts
const a: Config = { mode: "production", retries: 3 }
// variable is viewed as Config

const b = { mode: "production", retries: 3 } as Config
// assertion asks checker to trust compatibility

const c = { mode: "production", retries: 3 } satisfies Config
// compatibility is checked; expression inference is preserved
```

### Const type parameters

Const type parameters can ask generic inference to preserve literal-like information in suitable calls, reducing the need for callers to write `as const`.

```ts
function defineRoutes<const T extends Record<string, string>>(routes: T): T {
  return routes
}
```

Use them where literal preservation materially improves consumer ergonomics; do not add them automatically to every generic.

## Debugging checklist

When a narrowing or literal issue surprises you:

1. What is the declared type?
2. What was initially inferred?
3. Did a `let`, annotation, spread, contextual type, or generic constraint widen it?
4. What runtime check is the compiler following?
5. Could reassignment, aliasing, or a callback invalidate the proof?
6. Are you trying to solve a runtime-trust problem with a compile-time assertion?

## Exercises

- Write an exhaustive reducer using `never`.
- Replace an unsafe `JSON.parse(...) as User` with `unknown` plus validation.
- Show an API where `satisfies` preserves a key union better than an annotation.
- Refactor an overload into a generic, then explain whether inference became clearer or worse.
- Find three places where `!` can hide a real production race or lifecycle bug.