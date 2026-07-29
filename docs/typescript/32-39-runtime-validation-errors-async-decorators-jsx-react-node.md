---
title: 32–39 · Runtime Validation, Errors, Async, Decorators, JSX, React & Node
---

# 32–39 · Runtime Validation, Errors, Async, Decorators, JSX, React & Node

## 32 · Runtime Validation

A TypeScript annotation is not a runtime validator.

```ts
type User = { id: string; email: string }
const user = JSON.parse(text) as User
```

That code trusts the input without evidence. The boundary should instead be:

```text
HTTP / JSON / form / cookie / env / DB / queue / webhook
                         ↓
                      unknown
                         ↓
               runtime parsing/validation
                         ↓
                 trusted domain value
```

### Boundary architecture

Keep validators close to trust boundaries, return useful structured errors, and transform external wire formats into domain models rather than letting transport objects leak everywhere.

```ts
type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; issues: readonly ValidationIssue[] }

function parseUser(value: unknown): ValidationResult<User> {
  // library-independent example: inspect object, fields, invariants
  if (typeof value !== "object" || value === null) {
    return { ok: false, issues: [{ path: [], message: "expected object" }] }
  }
  // continue validation...
  return { ok: true, value: value as User }
}
```

The final assertion is justified only after runtime checks establish the invariant.

### Important untrusted sources

- HTTP request bodies/headers/query strings
- `response.json()` from third-party APIs
- forms and URL params
- cookies and localStorage
- environment variables
- database rows if migrations/schema drift are possible
- queues, events and webhooks
- deserialized caches
- plugin inputs

### Schema-derived types

Where a schema library/tool is used, deriving the TypeScript type from the runtime schema can remove duplication. The architectural principle is more important than any library: **one trusted runtime contract should not drift from a separately handwritten static contract**.

## 33 · Error Handling

JavaScript can throw any value. With `useUnknownInCatchVariables`, catch values should be narrowed.

```ts
try {
  await work()
} catch (error: unknown) {
  if (error instanceof Error) {
    logger.error(error.message)
  } else {
    logger.error("Non-Error thrown", { error })
  }
}
```

### Custom errors

Use custom error classes when runtime identity and shared behavior are useful.

```ts
class NotFoundError extends Error {
  constructor(readonly resource: string, readonly id: string) {
    super(`${resource} ${id} not found`)
  }
}
```

Do not put secrets or sensitive payloads into error messages that may be logged or returned.

### Expected vs exceptional failures

```ts
type PaymentResult =
  | { ok: true; receipt: Receipt }
  | { ok: false; reason: "declined" | "expired" }
```

Expected domain outcomes often deserve discriminated results. Infrastructure failures, programming errors, and unexpected states may remain exceptions. The choice is architectural: do callers need to branch on this outcome as part of normal flow?

### Async errors

Rejected promises and thrown async errors travel through promise rejection. A function returning `Promise<Result<T,E>>` has two channels unless you deliberately convert unexpected exceptions into the result model. Document which channel means what.

## 34 · Async TypeScript

### Promise and `async`/`await`

```ts
async function loadUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`)
  const raw: unknown = await response.json()
  return validateUser(raw)
}
```

`await` changes control flow, not trust. Network data is still external.

### `Awaited<T>`

```ts
type Value = Awaited<Promise<Promise<User>>> // User
```

Useful in generic helpers that model async unwrapping.

### Promise combinators

`Promise.all` fails fast on first rejection and preserves positional tuple relationships well when inputs are tuple-like.

```ts
const [user, orders] = await Promise.all([
  loadUser(id),
  loadOrders(id),
])
```

`Promise.allSettled` returns success/failure records for every input. Narrow `status` before accessing `value` or `reason`.

`Promise.race` settles with the first input to settle; it does not cancel slower work.

### Concurrency vs parallelism

Starting promises before awaiting can increase concurrency for independent I/O. Do not parallelize work with ordering, rate-limit, transaction, or capacity dependencies.

### Cancellation

Use `AbortSignal` in APIs that perform cancellable work:

```ts
async function getJson(url: string, signal?: AbortSignal): Promise<unknown> {
  const response = await fetch(url, { signal })
  return response.json()
}
```

Passing a signal is only useful if underlying operations honor it.

### Async iterables/generators

They model streams of asynchronously produced values and support `for await...of`.

## 35 · Iterators & Generators

An `Iterable<T>` can produce an `Iterator<T>`; an iterator returns `IteratorResult<T>` values from `next()`.

```ts
function* range(start: number, end: number): Generator<number, void, void> {
  for (let n = start; n < end; n++) yield n
}
```

`Generator<Yield, Return, Next>` can model yield type, final return type, and values passed back through `next(value)`.

### Delegation

```ts
function* combined() {
  yield* range(0, 3)
  yield* range(10, 12)
}
```

### Custom iterable

```ts
class Bag<T> implements Iterable<T> {
  constructor(private readonly values: readonly T[]) {}
  *[Symbol.iterator](): Iterator<T> {
    yield* this.values
  }
}
```

### Async generator

```ts
async function* pages(signal: AbortSignal): AsyncGenerator<Page> {
  let cursor: string | undefined
  do {
    const page = await fetchPage(cursor, signal)
    yield page
    cursor = page.nextCursor
  } while (cursor)
}
```

Streaming APIs should document cancellation, cleanup and error behavior as clearly as their yielded type.

## 36 · Decorators

TypeScript supports modern ECMAScript decorator semantics separately from the legacy `experimentalDecorators` model. Treat framework requirements carefully because decorator ecosystems have historically depended on legacy emit and metadata conventions.

```text
modern decorators
  → current standardized decorator model

legacy experimentalDecorators
  → compatibility mode for older frameworks/code
  → different semantics and emit assumptions
```

### Modern decorator shape

A decorator receives the decorated value and a context object appropriate to class/method/field/accessor use. Decorators can replace/wrap values or register initialization depending on kind.

```ts
function logged<This, Args extends unknown[], Return>(
  method: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, typeof method>,
) {
  return function (this: This, ...args: Args): Return {
    console.log(String(context.name))
    return method.call(this, ...args)
  }
}
```

### Legacy mode

⚠️ `experimentalDecorators` exists for the older TypeScript decorator design. Do not mix examples from modern and legacy models as if signatures/metadata are interchangeable.

### Metadata

Runtime metadata is not automatically created from TypeScript types. Framework reflection may depend on separate emit options/libraries and legacy conventions. Verify framework documentation before migration.

### Migration strategy

1. identify whether a framework requires legacy semantics
2. inventory metadata/reflection dependencies
3. isolate decorators behind framework adapters
4. test emitted/runtime behavior, not just checker acceptance
5. migrate only when framework/tooling support is explicit

## 37 · JSX & TSX

`.tsx` enables JSX parsing and changes how angle-bracket syntax is interpreted.

```tsx
function Greeting(props: { name: string }) {
  return <h1>Hello {props.name}</h1>
}
```

### JSX checking

The active JSX runtime/type definitions determine intrinsic tags and component typing. `JSX.IntrinsicElements` conceptually describes allowed built-in element names/props.

### Compiler modes

Choose a JSX mode matching the framework/build pipeline. Modern React commonly uses an automatic JSX runtime, while other libraries may use `jsxImportSource`.

### Generic syntax ambiguity

In TSX, `<T>` can look like a JSX element. Generic arrow syntax may need a constraint/comma:

```tsx
const identity = <T,>(value: T): T => value
```

### Component fundamentals

A component type is still a function/class contract evaluated by framework-specific JSX typing rules. TypeScript cannot guarantee runtime rendering correctness merely because props type-check.

## 38 · React Integration

This section focuses only on TypeScript boundaries; component design belongs in the React handbook.

### Props

```tsx
type ButtonProps = {
  variant: "primary" | "secondary"
  disabled?: boolean
  onPress(): void
}
```

Prefer discriminated props when combinations have state-dependent requirements:

```ts
type LinkButtonProps =
  | { kind: "link"; href: string; onPress?: never }
  | { kind: "button"; href?: never; onPress(): void }
```

### State and reducers

Use unions to model reducer states/actions rather than optional fields that create impossible combinations.

```ts
type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; user: User }
  | { status: "error"; error: Error }
```

### Events

Type events at the framework boundary, then pass domain values inward. Do not make deep domain services depend on UI event objects.

### Refs

Model null during lifecycle where relevant; avoid non-null assertions that assume mounting/order invariants the runtime does not guarantee.

### Context

A context default can accidentally create a fake “valid” value. Where no meaningful default exists, model absence and provide a helper hook that throws/narrows at the boundary.

### Generics in components/hooks

Generics are useful for reusable tables, selects, data hooks, and forms when they preserve a relationship between caller data and callbacks. Avoid generic components with a dozen parameters that become harder to use than specialized components.

### Forms and async code

Form values are runtime input. Static field types do not validate browser/user data. Validate before creating trusted domain commands.

## 39 · Node.js Integration

### Modern Node modules

For code intended to follow current Node ESM/CJS semantics:

```json
{
  "compilerOptions": {
    "module": "nodenext",
    "moduleResolution": "nodenext"
  }
}
```

Pair this with package `"type"`, extensions, and exports that match runtime behavior.

### Built-in TypeScript type stripping

✅ Modern Node releases support stable lightweight TypeScript type stripping. It executes TypeScript files containing erasable syntax by removing types, but it **does not type-check**, **does not read `tsconfig.json`**, and does not implement arbitrary `paths` aliases or downlevel compilation.

```text
Node type stripping
  → runtime execution convenience
  → no static correctness proof

tsc --noEmit
  → static correctness gate
```

For direct Node execution, type-only imports matter because Node must distinguish erased type imports from runtime value imports.

### `process.env`

Environment variables are external strings/undefined. Validate and normalize once:

```ts
type Config = { port: number; databaseUrl: string }

function loadConfig(env: NodeJS.ProcessEnv): Config {
  const rawPort = env.PORT
  const databaseUrl = env.DATABASE_URL
  if (!rawPort || !databaseUrl) throw new Error("Missing configuration")
  const port = Number(rawPort)
  if (!Number.isInteger(port)) throw new Error("Invalid PORT")
  return { port, databaseUrl }
}
```

### Filesystem, streams, EventEmitter, HTTP

Node APIs are asynchronous/errorful runtime systems. Types describe callback/event/chunk contracts but cannot prove files exist, streams will not fail, network input is valid, or event ordering is correct.

Wrap raw platform APIs behind domain-focused interfaces when that improves testing and ownership.

### Runtime/transpilation choices

Possible strategies include:

```text
Node type stripping + tsc --noEmit
third-party TS runtime + tsc --noEmit
compile with tsc then run JS
bundle/transpile then run JS + separate type check
```

Choose based on startup, deployment artifact, syntax support, source maps, declaration needs, and operational simplicity.

## Cross-chapter production checklist

- Is this value external? Start from `unknown`.
- Does a thrown/rejected error have a documented channel?
- Are concurrent tasks actually independent?
- Can long-running work be cancelled?
- Is decorator semantics modern or legacy?
- Does TSX syntax match the selected JSX runtime?
- Are React props modeling legal states?
- Does Node module config match package/runtime semantics?
- If Node strips types directly, where is real type checking enforced?