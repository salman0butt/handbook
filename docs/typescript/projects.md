---
title: 60 · Projects
---

# 60 · Projects

The project phase turns language knowledge into production decisions. Every project uses the same review frame: **requirements → architecture → milestones → acceptance criteria → security → performance → testing → common mistakes → stretch goals → interview questions → design review**.

## Shared delivery standard

For every project:

- enable strict checking and document extra strictness flags
- separate runtime validation from static types
- keep external values `unknown` until validated
- include runtime tests and compile-time/type tests where public generics matter
- document module/runtime assumptions
- include cancellation/error behavior for I/O
- measure at least one relevant performance property
- write an ADR-style design review explaining trade-offs

---

## Project 1 — Typed REST Client

### Requirements

Build a client with:

- generic request/response relationships
- runtime response validation
- `Result`-style expected errors
- cursor pagination
- `AbortSignal`
- timeout/cancellation handling
- runtime + type tests

### Architecture

```text
consumer call
   ↓
typed endpoint descriptor
   ↓
request serializer
   ↓
fetch adapter
   ↓
unknown JSON
   ↓
endpoint validator
   ↓
Result<validated data, ApiError>
```

```ts
type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E }

type Validator<T> = (value: unknown) => Result<T, ValidationError>

type Endpoint<TResponse> = {
  method: "GET" | "POST" | "PATCH" | "DELETE"
  path: string
  response: Validator<TResponse>
}

async function request<T>(
  endpoint: Endpoint<T>,
  signal?: AbortSignal,
): Promise<Result<T, ApiError>> {
  try {
    const response = await fetch(endpoint.path, {
      method: endpoint.method,
      signal,
    })

    if (!response.ok) {
      return { ok: false, error: { kind: "http", status: response.status } }
    }

    const raw: unknown = await response.json()
    const parsed = endpoint.response(raw)
    return parsed.ok
      ? parsed
      : { ok: false, error: { kind: "invalid-response", details: parsed.error } }
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { ok: false, error: { kind: "aborted" } }
    }
    return { ok: false, error: { kind: "network", cause: error } }
  }
}
```

### Pagination

```ts
type Page<T> = {
  items: readonly T[]
  nextCursor?: string
}
```

Keep the cursor opaque. Add an async generator as a stretch path:

```ts
async function* allPages<T>(...): AsyncGenerator<T> {}
```

### Milestones

1. endpoint model + GET support
2. runtime validators
3. structured errors
4. pagination
5. cancellation
6. retries only for explicitly safe/idempotent cases
7. test fixtures and package-style API review

### Acceptance criteria

- malformed JSON shape never escapes as `T`
- every expected failure is discriminated
- cancellation is observable and tested
- page item type is inferred from endpoint descriptor
- invalid endpoint usage has compile-time tests

### Security

Never treat response typing as validation. Redact tokens from errors/logs. Do not auto-retry non-idempotent writes. Bound response/body sizes if the runtime adapter supports it.

### Performance

Avoid parsing/validating the same payload twice. Stream large endpoints where architecture requires it. Reuse clients/configuration rather than rebuilding schemas per call.

### Testing

- success response
- invalid schema
- 4xx/5xx
- network failure
- abort before/during request
- pagination end condition
- compile-time endpoint inference

### Common mistakes

`response.json() as T`; generic `request<T>(url)` where caller can claim any T; swallowing abort as generic network error; returning database wire objects directly into domain code.

### Stretch goals

typed request bodies, headers, rate-limit metadata, OpenAPI/schema code generation, tracing hooks, retry policy.

### Interview questions

- Why is `request<User>(url)` weaker than an endpoint carrying a validator?
- When should errors be `Result` vs thrown?
- How does `AbortSignal` change API design?

### Design review

Defend where the runtime contract lives, what is generated vs handwritten, and whether callers can accidentally bypass validation.

---

## Project 2 — Typed Event System

### Requirements

Start from:

```ts
type Events = {
  userCreated: User
  orderPaid: Order
}
```

Implement typed `emit`, `on`, `once`, unsubscribe, lifecycle behavior, and handler-error policy.

### Architecture

```ts
type Handler<T> = (payload: T) => void | Promise<void>

class EventBus<E extends Record<string, unknown>> {
  private handlers = new Map<keyof E, Set<Handler<any>>>()

  on<K extends keyof E>(event: K, handler: Handler<E[K]>): () => void {
    const set = this.handlers.get(event) ?? new Set()
    set.add(handler)
    this.handlers.set(event, set)
    return () => set.delete(handler)
  }

  once<K extends keyof E>(event: K, handler: Handler<E[K]>): () => void {
    const off = this.on(event, async payload => {
      off()
      await handler(payload)
    })
    return off
  }

  async emit<K extends keyof E>(event: K, payload: E[K]): Promise<void> {
    const set = this.handlers.get(event)
    if (!set) return
    await Promise.all([...set].map(h => h(payload)))
  }
}
```

The internal `any` is contained behind a typed invariant. A stronger internal representation is a stretch goal; document why the escape exists.

### Milestones

basic key→payload inference; unsubscribe; once; async handlers; error strategy; external-event adapter with validation.

### Acceptance criteria

wrong event payloads fail to compile; `once` removes itself; handler failures have defined semantics; external serialized events are validated before `emit`.

### Security

Do not authorize actions solely because an event payload type says `userId`. External events require authenticity and authorization checks appropriate to the system.

### Performance

Prevent listener leaks, expose listener metrics, consider backpressure for high-throughput use, avoid unbounded parallel handler execution.

### Testing

runtime listener order/policy, unsubscribe, once, async rejection, type-level wrong payload/key tests.

### Common mistakes

using `Record<string, any>` at the public API; forgetting cleanup; assuming in-process type safety protects queue/webhook events.

### Stretch goals

wildcard events, middleware, priorities, serial vs parallel modes, event versioning, observability.

### Interview questions

- Where does variance appear in handler typing?
- Why can external event consumers not trust the shared TS type alone?

### Design review

Explain memory lifecycle, concurrency, error isolation, and distributed-boundary validation.

---

## Project 3 — Type-Safe Form / Validation Engine

### Requirements

Build schema definitions, field inference, nested paths, validation, typed errors, parse result, and form-state projection.

### Architecture

```text
runtime schema
   ↓ infer
static field/value type
   ↓
raw form strings/files
   ↓ parse/validate
Result<T, FieldErrors<T>>
```

```ts
interface Schema<T> {
  parse(value: unknown): Result<T, ValidationIssue[]>
}

type Infer<S> = S extends Schema<infer T> ? T : never
```

Implement `Path<T>`/`PathValue<T,P>` only to the depth/features needed for the project.

### Milestones

primitive schemas → object schema → optional/array → nested paths → typed error map → async validation → form adapter.

### Acceptance criteria

static type derives from schema; errors point to typed paths; raw form input never directly becomes domain value; nested paths have compile-time tests.

### Security

Client-side validation is UX, not trust. Server/API boundaries must validate again. Treat file uploads and rich text separately with security controls.

### Performance

Avoid revalidating entire forms for every keystroke when field-level validation suffices; memoize schema metadata carefully; keep deep path type recursion bounded.

### Testing

schema runtime matrices, path type tests, async race/cancellation tests, nested collection cases.

### Common mistakes

handwriting `FormValues` separately from schema; using deep conditional types beyond compiler limits; assuming HTML input `type=number` produces a JavaScript number.

### Stretch goals

schema transforms, defaults, refinements, partial validation, resolver adapters, code generation.

### Interview questions

- Why derive type from schema rather than schema from type?
- What cannot be represented statically about user input?

### Design review

Defend schema ownership, error model, async validation races, and path-type complexity budget.

---

## Project 4 — Type-Safe Backend

### Requirements

DTOs, domain entities, branded IDs, runtime validation, database boundaries, commands, queries, errors, authorization, and tests.

### Architecture

```text
HTTP adapter
  ↓ raw request unknown
request validator
  ↓ DTO
application mapper
  ↓ Command / Query
application service
  ↓
domain entities/value objects
  ↓ repository ports
infrastructure adapters
  ↓ DB
```

### Milestones

1. health + one validated endpoint
2. domain factory/invariants
3. repository interface + in-memory adapter
4. database adapter mapping rows↔domain
5. authorization
6. command/query handlers
7. event contract
8. production error mapping

### Acceptance criteria

persistence rows cannot leak secrets into response DTOs; IDs cannot be accidentally mixed at compile time; authorization is runtime-tested; malformed requests fail before domain logic.

### Security

tenant scoping, authorization per resource, parameterized database access, secret redaction, schema validation, safe error responses, audit logs.

### Performance

avoid N+1 queries, bound pagination, profile serialization/validation hotspots, use transaction boundaries deliberately.

### Testing

unit domain invariants, repository contract tests, endpoint integration tests, authorization matrix, type tests for IDs/contracts, migration fixtures.

### Common mistakes

one `User` interface for DB/domain/API; branded IDs forged by arbitrary `as`; controller performs business rules; repository returns `any` rows; auth middleware only checks authentication but not resource authorization.

### Stretch goals

CQRS read model, outbox events, idempotency, tracing, background jobs, generated API client.

### Interview questions

- Why separate DTO, domain, and persistence types?
- What guarantees does a branded ID add, and what does it not add?

### Design review

Present trust boundaries, transaction ownership, API evolution, event versioning, and operational failure modes.

---

## Project 5 — Library / SDK

### Requirements

public exports, declarations, generic API, inference ergonomics, runtime/type tests, ESM/CJS decision, packaging, semver design.

### Architecture

```text
src/internal/*
      ↓
curated entrypoints
      ↓
build JS + .d.ts + maps
      ↓
package exports
      ↓
consumer fixtures
```

### Milestones

API prototype → inference tests → runtime implementation → declaration generation → package exports → fixture installs → release checklist.

### Acceptance criteria

all documented entrypoints work from installed package; declarations resolve; no internal paths are accidentally public; common calls require minimal explicit generics; negative type tests remain rejected.

### Security

validate runtime config and remote payloads; do not bundle secrets; review dependency/typing supply chain.

### Performance

small entrypoints, tree-shakable architecture where applicable, declaration complexity budget, avoid expensive recursive public types.

### Testing

runtime unit/integration, type acceptance/rejection, declaration emit snapshots/API reports, Node/bundler fixtures, supported compiler-version matrix.

### Common mistakes

dual-publishing without testing both formats; `types` path not matching exports; clever generics with unstable inference; accidental deep-import contracts.

### Stretch goals

subpath exports, plugin API, codegen, backwards-compat fixtures, deprecation strategy.

### Interview questions

- Can a type-only change be semver-breaking?
- How would you test inference ergonomics?

### Design review

Defend module strategy, declaration strategy, public API closure, support matrix, and migration policy.

---

## Project 6 — Large Monorepo

### Requirements

apps, packages, shared contracts, project references, build mode, strict configs, dependency rules, CI, incremental builds.

### Architecture

```text
apps/web ─────┐
              ├→ packages/contracts
apps/api ─────┘          ↑
    │                    │
    └→ packages/domain ──┘
           ↑
      packages/data
```

Direction must be intentional; diagrams should match enforced rules.

### Milestones

workspace layout → base TSConfigs → package entrypoints → references → `tsc -b` → dependency lint → affected CI → build metrics.

### Acceptance criteria

no cross-package deep imports; reference graph is acyclic; clean and incremental builds pass; packages have owners; shared contracts are validated at process boundaries.

### Security

separate server-only packages/secrets from frontend dependency graph; enforce import restrictions; review generated contracts for sensitive fields.

### Performance

measure clean/incremental check, editor load, declaration emit; use project boundaries and affected builds; prevent generated artifacts from exploding program size.

### Testing

package tests, contract tests, graph-rule tests, build-from-clean CI, artifact/package fixtures.

### Common mistakes

one root tsconfig including everything; packages exist only as folders with deep imports; “shared” package becomes dumping ground; caching keys ignore generated declarations.

### Stretch goals

remote cache, API compatibility checks, release automation, workspace code generation, dependency visualization.

### Interview questions

- When do project references improve a monorepo?
- What invalidates an incremental package build?

### Design review

Defend package ownership, public APIs, graph direction, build invalidation model, and upgrade governance.

---

## Capstone — Production TypeScript Platform

### Requirements

Combine:

- frontend
- backend
- shared packages
- runtime schemas
- APIs
- domain models
- events
- queue/job contracts
- testing
- linting
- CI
- migration strategy
- versioning
- architecture documentation

### Reference architecture

```text
apps/web
  ↓ generated/validated API contract
packages/contracts ← authoritative schemas / generated artifacts
  ↑                          ↓
apps/api → application → domain → repository ports
  ↓                          ↑
queue/events → validators → workers → infrastructure

shared platform:
TSConfig + lint policy + CI + observability + package ownership
```

### Milestones

1. ADRs + trust-boundary diagram
2. workspace/config baseline
3. schema/contracts package
4. backend vertical slice
5. frontend feature slice
6. event/job workflow
7. authentication + authorization
8. observability/errors
9. performance budgets
10. migration/upgrade playbook
11. production build + package fixtures
12. architecture review

### Acceptance criteria

- untrusted data validated at every process boundary
- public DTOs differ intentionally from persistence models
- shared types have owners/source-of-truth rules
- event/job contracts are versioned
- strict CI passes
- runtime and compile-time test suites pass
- dependency direction is automated
- build/editor performance budgets are documented
- deployment artifact/module semantics are verified
- upgrade and rollback procedures exist

### Security

Threat-model auth, authorization, tenant isolation, secrets, logging/redaction, injection, dependency supply chain, schema validation, webhooks, jobs, client data exposure.

### Performance

Budget compiler/build/editor time as well as runtime latency. Measure invalidation scope in monorepo builds, validation cost, bundle/server artifact size, and queue throughput.

### Testing

Unit + integration + contract + E2E + type tests + declaration/package tests + security/authorization matrix + migration tests + performance regressions.

### Common mistakes

sharing every backend model with frontend; generating types without runtime validators; type-safe queue producer but unvalidated consumer; CI transpiles TS but never runs the checker; public library types are untested; one mega shared package.

### Stretch goals

multi-tenant architecture, schema registry, compatibility automation, SDK generation, canary TypeScript upgrades, architecture fitness dashboard.

### Interview questions

- Where is static typing insufficient in this platform?
- Which contracts are generated and which are handwritten?
- How do you evolve a queue event safely?
- How do you prevent compiler performance from becoming an organizational bottleneck?

### Final design review

Use this rubric:

```text
correctness
runtime trust
static model quality
API ergonomics
module/runtime alignment
security
performance
operability
migration
compatibility
ownership
developer experience
```

A successful capstone does not merely “have TypeScript.” It demonstrates a coherent strategy for what TypeScript proves, what runtime validation proves, and how contracts evolve across processes and teams.