---
title: 78–91 — Architecture, APIs, Tooling, Testing, Senior & Staff JavaScript
---

# 78–91 — Architecture, APIs, Tooling, Testing, Senior & Staff JavaScript

## 78 — Modules and Application Architecture

Use modules to encode ownership and dependency direction, not merely split files.

```text
UI / delivery
    ↓
application use cases
    ↓
domain logic
    ↓ interfaces / ports
    ↑
infrastructure adapters
```

Feature boundaries should expose a small public surface and keep internals private. Domain modules should not casually import DOM, storage, analytics, and HTTP clients; inject adapters so business logic remains testable and portable.

Circular dependencies often signal confused ownership. Fix by moving shared concepts downward, extracting interfaces/contracts, or making orchestration explicit.

Side effects should sit near boundaries. State needs one clear owner; derived values should be computed rather than redundantly synchronized where possible.

---

## 79 — API Design in JavaScript

Good JavaScript APIs make uncertainty explicit.

```js
async function createUser(input, {
  signal,
  logger = defaultLogger,
} = {}) {
  // ...
}
```

Prefer options objects once optional parameters grow. Return stable shapes. Define whether functions mutate inputs, throw, return `null`, or return result objects.

Async APIs should document:

- cancellation protocol,
- timeout responsibility,
- retry/idempotency semantics,
- ordering/concurrency,
- error types/codes,
- whether callbacks/events can be reentrant.

Event APIs need unsubscribe/lifetime semantics. Fluent APIs should not hide expensive I/O or surprising mutation.

Backwards compatibility includes behavior, errors, side effects, timing, and accepted input—not just function names. Apply semantic-versioning concepts to public libraries and internal platform APIs.

Validate inputs at trust boundaries even when callers use TypeScript.

---

## 80 — Runtime Validation

JavaScript does not enforce static type declarations at runtime.

Primitive checks:

```js
if (typeof value !== 'string') throw new TypeError('Expected string');
if (!Array.isArray(items)) throw new TypeError('Expected array');
```

`instanceof` has cross-realm/customization limits and should be used when prototype identity is actually the contract.

Structural validation checks required fields/constraints:

```js
function parseUser(input) {
  if (input === null || typeof input !== 'object') throw new TypeError('object required');
  if (typeof input.id !== 'string') throw new TypeError('id required');
  return {id: input.id};
}
```

Schema libraries automate this for real systems. Prefer **parse, don't validate**: turn unknown boundary data into a trusted internal representation once rather than repeatedly asking “is it valid?” while keeping the untrusted shape.

Trust boundaries include JSON/API responses, form data, storage, URL params, postMessage, plugin inputs, files, database rows, and third-party SDK outputs.

---

## 81 — JavaScript and TypeScript Boundary

TypeScript is a static analysis/type language that produces JavaScript (or otherwise participates in a build/run pipeline); JavaScript remains the runtime semantics.

```ts
// TypeScript claim
const user: User = await response.json();
```

At runtime, the server can still send anything. Type annotations/generics disappear and do not validate JSON.

Use JSDoc with editor/checker support for typed JavaScript codebases. `allowJs`/`checkJs` enable gradual TypeScript tooling over `.js` files. Migrate incrementally around stable module boundaries and validate runtime inputs regardless of type system.

For generics, conditional/mapped types, TSConfig, compiler options, decorators as TypeScript features, and type-level programming, use the TypeScript handbook rather than duplicating them here.

---

## 82 — Tooling

Tooling changes how JavaScript is authored, checked, transformed, packaged, and debugged; it is not the language itself.

- **ESLint** — static lint rules/code-quality policy.
- **Prettier** — opinionated formatting.
- **Babel** — source transforms/transpilation plugins.
- **Bundlers** — build dependency graphs, transform/package assets, chunk code.
- **Transpilation** — rewrite unsupported/newer syntax into older syntax when semantics can be represented.
- **Polyfills** — supply runtime APIs missing from an environment.
- **Source maps** — map generated code positions to source.
- **Package managers** — dependency/version/install/workspace lifecycle.
- **Development servers** — serve modules/assets with live reload/HMR/tooling.
- **Compatibility tooling** — target browser/runtime matrices and decide transforms/polyfills.

A transpiler cannot polyfill everything: new syntax may be transformable, while new built-ins need runtime code, and host APIs/hardware/security models may be impossible to reproduce fully.

---

## 83 — Feature Detection and Compatibility

Standards status and implementation support are different axes.

```js
if ('structuredClone' in globalThis) {
  // use it
}
```

Prefer feature detection over user-agent guessing. Do not “detect” by invoking dangerous operations with side effects when a safe capability check exists.

Compatibility strategies:

- progressive enhancement,
- graceful degradation,
- polyfills for missing runtime APIs,
- transpilation for supported transforms,
- conditional loading,
- build target policies,
- dropping obsolete targets intentionally.

Unsupported syntax can fail parsing before any feature-detection code runs; that must be handled at delivery/build-target level.

Baseline-style browser compatibility is useful as a product policy, but production teams should maintain explicit target/browser/runtime versions for their users.

---

## 84 — Testing JavaScript

Testing layers:

- **unit** — small pure/domain pieces,
- **integration** — modules/adapters working together,
- **browser/component** — real DOM/browser behavior,
- **end-to-end** — user-visible flows across deployed-like boundaries.

Pure code is easy to test:

```js
expect(calculateTotal([{price: 100}])).toBe(100);
```

Async tests must await the operation under test and assert both fulfillment/rejection.

Timers: fake timers can make scheduling deterministic, but they can diverge from browser semantics and should not replace real integration tests for event-loop/rendering behavior.

Mocks/spies/test doubles should isolate costly/nondeterministic boundaries—not reproduce the entire system. Excessive implementation-mocking makes refactors painful.

DOM tests should assert accessibility/user behavior rather than private implementation details. Network mocking should preserve realistic status/error/latency/cancellation cases.

Test isolation means no leaked globals, listeners, timers, storage, random state, or shared mutable fixtures.

---

## 85 — Concurrency and Race Conditions

Run-to-completion does not eliminate races because separate jobs/tasks can interleave over time.

### Stale response

```js
let generation = 0;
async function search(query) {
  const mine = ++generation;
  const result = await request(query);
  if (mine !== generation) return; // stale
  render(result);
}
```

Better when available: abort obsolete requests and still guard against races at the state boundary.

### Duplicate submission

Disable/lock UI optimistically, but server-side idempotency/transaction semantics remain necessary.

### Read-modify-write

```text
Task A reads 5
Task B reads 5
Task A writes 6
Task B writes 6   ← lost update
```

This can occur across tabs, workers, clients, or async storage/server operations. Use atomic server operations, version checks, locks/transactions, or conflict-aware models.

### Shared memory

With SharedArrayBuffer, workers truly share bytes. Use Atomics/synchronization; normal read-modify-write code can race.

---

## 86 — Error Architecture

Distinguish errors callers are expected to handle from programmer defects/invariant violations.

```js
class AppError extends Error {
  constructor(code, message, options) {
    super(message, options);
    this.code = code;
  }
}
```

Error objects can carry discriminants/codes, retryability, HTTP/domain metadata, and causes without forcing string parsing.

Layer boundaries should translate implementation details:

```text
network timeout
   ↓ adapter translates
RepositoryUnavailableError { cause }
   ↓ use case decides retry/user behavior
user-facing message + structured log
```

Cancellation should generally be distinguishable from a genuine operational failure. Log once at the layer that owns observability/context; duplicate logging at every catch creates noise.

Never expose raw internal stack traces/secrets to users.

---

## 87 — Large JavaScript Application Architecture

A scalable shape:

```text
features/
  orders/
    public API
    domain/
    application/
    ui/
    infrastructure/
platform/
  http/
  storage/
  logging/
shared-domain/
```

Principles:

- domain boundaries own vocabulary/data,
- dependencies point toward stable policy,
- ports/adapters isolate browser/network/storage SDKs,
- functional core handles decisions; imperative shell coordinates effects,
- state ownership is explicit,
- data flow has inspectable direction,
- observability hooks exist at async/boundary points,
- migrations can run incrementally through adapters/strangler boundaries.

Avoid “shared” folders that become dependency dumps.

---

## 88 — Library Authoring

A library's most expensive asset is its public contract.

Design for:

- small stable ESM surface,
- documented browser/runtime targets,
- dependency minimization and clear peer/external boundaries,
- side-effect-free modules where truthful and useful for tooling,
- source maps/debuggability,
- examples/reference docs,
- runtime feature/compatibility handling,
- semantic versioning and deprecation windows,
- tests across supported targets,
- additive evolution before breaking changes.

Tree shaking is a bundler capability enabled by static ESM/side-effect knowledge, not a guarantee of JavaScript itself.

Do not expose internal object shapes merely because they are convenient; once consumers depend on them, refactoring becomes a breaking change.

Package publishing/Node resolution details belong in the Node.js handbook.

---

## 89 — Framework-Author JavaScript

Framework authors need language mechanisms more deeply than application authors.

### Reactive dependency tracking

```js
let activeEffect;
const deps = new WeakMap();

function track(target, key) {/* record activeEffect */}
function trigger(target, key) {/* schedule dependents */}

const state = new Proxy(raw, {
  get(target, key, receiver) {
    track(target, key);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    const changed = target[key] !== value;
    const ok = Reflect.set(target, key, value, receiver);
    if (changed) trigger(target, key);
    return ok;
  },
});
```

Real systems must handle nested data, cleanup, duplicate tracking, computed values, scheduler ordering, batching, error isolation, identity, collection types, and lifecycle.

Schedulers batch updates and avoid duplicate work; queues need deterministic ordering and starvation protection.

Virtual structures are one way to describe desired UI and reconcile changes; compile-time frameworks can instead precompute updates. Runtime vs compile-time is a trade-off across flexibility, bundle/runtime cost, analyzability, and tooling.

Plugins require stable capability contracts and isolation of failure/permissions.

---

## 90 — Senior JavaScript Patterns

Senior design favors explicit constraints:

- **data ownership** — one module owns mutation authority,
- **side-effect isolation** — domain decisions separate from I/O,
- **async orchestration** — dependencies and concurrency visible,
- **cancellation** — stale/obsolete work stops,
- **bounded concurrency** — protect clients/services,
- **API boundaries** — unknown data parsed once,
- **dependency direction** — high-level policy does not import concrete infrastructure,
- **state machines** — make complex lifecycle states/transitions explicit,
- **event-driven design** — useful for decoupling, but preserve observability and ownership,
- **functional core / imperative shell**,
- **observability hooks** — timings, correlation IDs, error metadata,
- **migration-friendly seams** — adapters allow replacement without rewrites.

A senior engineer can explain not only the chosen pattern, but what failure mode it prevents and what cost it introduces.

---

## 91 — Staff-Level JavaScript Architecture

Staff-level work shapes the paved road for many teams.

### Standards policy

Define:

- supported browser/runtime matrix,
- language baseline and proposal policy (Stage 4 only for standard language; tool experiments explicitly labelled),
- compatibility and polyfill/transpilation strategy,
- ESM/module conventions,
- lint/format/testing baselines,
- security requirements,
- performance budgets.

### Dependency governance

Track ownership, update cadence, vulnerability policy, license/supply-chain risk, bundle/server impact, and replacement plans for critical dependencies.

### Architecture boundaries

Use lint/build/module rules to enforce forbidden dependencies and public APIs. Architecture diagrams without executable constraints decay.

### JavaScript vs TypeScript

Choose based on organization scale, API complexity, ecosystem, contributor profile, build constraints, and migration cost—not prestige. TypeScript improves static feedback but does not replace runtime validation/security/testing.

### Framework selection

Evaluate longevity, rendering/runtime model, performance profile, accessibility/tooling, team skill, ecosystem health, migration/interop strategy, observability, and operational risk. Avoid choosing on benchmark screenshots alone.

### Frontend platform/design systems

Shared platform layers can own build tooling, routing/auth shells, telemetry, design-system primitives, compatibility, error reporting, and safe defaults. Avoid creating a platform that becomes a bottleneck; teams need extension points and clear ownership.

### Technical debt and modernization

Classify debt by risk/drag, tie remediation to measurable outcomes, and modernize incrementally behind seams. “Rewrite everything in the newest framework” is rarely a staff-level strategy.

### Interview checks for 78–91

1. What makes a module boundary architectural rather than organizational?
2. What belongs in an async API contract?
3. Why does TypeScript not validate JSON?
4. Polyfill vs transpile?
5. Why can unsupported syntax defeat runtime feature detection?
6. What should be mocked in tests?
7. Give a race condition in single-main-thread browser code.
8. Where should errors be translated/logged?
9. Explain ports/adapters in a JS app.
10. What makes a library API stable?
11. How do Proxies/WeakMaps support reactivity?
12. What does staff-level compatibility governance look like?
