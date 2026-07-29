---
title: JavaScript Interview Mastery
slug: /javascript/interview-mastery
---

# JavaScript Interview Mastery

Senior JavaScript interviews reward a repeatable reasoning process more than memorized trivia.

## The answer framework

For language questions:

```text
1. Identify code kind: script / module / function / class
2. Identify bindings + initialization state
3. Identify values/types and conversions
4. Identify reference/call-site semantics
5. Follow object/prototype/internal operation
6. For async: separate ECMAScript Jobs from host scheduling
7. State host/runtime compatibility when relevant
8. End with production guidance/trade-off
```

For production questions:

```text
symptom → invariant → evidence → hypothesis → experiment → root cause → fix → regression guard → observability
```

## Scope, hoisting, TDZ

Do not say “`let` isn't hoisted.” Say lexical bindings are created during environment/declaration instantiation but remain uninitialized until evaluation reaches their declaration; access in that TDZ throws. `var` is initialized to `undefined` earlier and is function/global-scoped.

**Senior follow-up:** explain browser global `var` vs global lexical declarations using the Global Environment Record.

## Closures

Say closures retain access to lexical **bindings**, not frozen value snapshots. Explain `let` loop per-iteration bindings vs one `var` binding. Mention reachability/memory only when relevant; closures are not leaks by themselves.

## `this`

Start from call-site semantics for ordinary functions: plain call, property-reference call, explicit call, construct. Arrows use lexical `this`. Detached methods lose the original property-call reference. Browser event-listener `this` behavior is host API behavior.

## call / apply / bind / new

`call` and `apply` invoke; `bind` creates a bound function. Explain construct behavior separately: `new` performs `[[Construct]]`, creates/selects a receiver/prototype relationship, invokes constructor semantics, and honors object returns. Bound constructible functions can still be constructed; their bound `this` is not used as the new receiver.

## Prototypes and classes

Draw:

```text
instance → Ctor.prototype → Object.prototype → null
```

Distinguish an object's `[[Prototype]]` from a constructor function's `.prototype` property. Classes use prototypes; class methods live on the prototype. Private fields are language private names, not hidden string keys.

## Coercion and equality

Never answer coercion puzzles from memory. Trace `ToPrimitive`/numeric/string conversion and the equality algorithm. Know Strict Equality, SameValue (`Object.is`), SameValueZero (`Set`/`Map`/`includes`), `NaN`, and signed zero.

## Objects and descriptors

Name property-key types (String/Symbol), own vs inherited lookup, data/accessor descriptors, enumerable/configurable/writable, and key-enumeration APIs. Explain why spread is shallow and descriptor/prototype-losing.

## Arrays

Know holes vs `undefined`, mutating vs change-by-copy methods, iteration protocol, SameValueZero in `includes`, default string sort, sparse-array edge cases, and why `for...in` is for enumerable property keys rather than array values.

## Functions

Discuss function kind (ordinary/arrow/generator/async/class method), lexical scope, first-class/HOF behavior, default/rest parameter initialization, recursion and stack limits, callback contract, and purity/side effects.

## Iterators and generators

Define iterable (`@@iterator`) vs iterator (`next`). Explain iterator closing and why generators simplify state machines. For async iterators, `next` becomes Promise-based and `for await...of` coordinates sequential consumption/backpressure-like flows.

## Promises

Draw pending → fulfilled/rejected. Distinguish resolved from fulfilled. Explain thenable assimilation, `.then` returning a new Promise, rejection propagation, combinators, lack of automatic cancellation, and ECMAScript Promise Jobs.

## Async/await

An async function returns a Promise. `await` suspends the async continuation, not the whole JavaScript thread. Compare sequential vs concurrent starts. Explain why `forEach(async...)` does not await callbacks and why bounded concurrency is often better than unlimited `Promise.all`.

## Event loop

State the boundary first: ECMAScript Jobs vs browser/Node host loop. Predict sync → microtasks/jobs → later tasks in browser examples, while warning that Node has host-specific phases/queues. Explain rendering starvation and long tasks.

## Modules

Imports are live bindings. Explain static graph, instantiation/linking/evaluation, cycles and uninitialized exports, strict module scope, dynamic import, top-level await graph impact, and host responsibility for loading/URL/module types.

## Memory and GC

Use reachability, roots, retaining paths, closures/listeners/timers/caches. Do not claim stack/heap placement as a JS guarantee. WeakRef/finalization are nondeterministic and not correctness cleanup.

## DOM and events

Say DOM/EventTarget are Web APIs. Explain DOM tree vs rendering, `target`/`currentTarget`, capture/target/bubble, delegation, listener cleanup, safe text insertion, and accessibility.

## Fetch and browser APIs

Fetch is Web API. HTTP error statuses do not normally reject fetch. Check status, parse/validate unknown data, use AbortSignal, separate timeout rejection from real cancellation, understand credentials/CORS/CSRF, and handle stale races.

## Performance

Measurement first. Classify CPU/network/rendering/memory/startup. Discuss algorithmic complexity, main-thread long tasks, allocation/GC pressure, bounded concurrency, batching, lazy loading, and budgets. Engine shape/JIT details are hypotheses, not language guarantees.

## Security

Cover XSS/DOM sinks, CSP/Trusted Types, URL validation, third-party scripts, prototype pollution, CSRF/CORS distinctions, token/secret exposure, dependency supply chain. Security is architecture, not one sanitizer call.

## API design

Define input/output/error/cancellation/mutation/timing contracts, options objects, runtime parsing, stable public surfaces, backwards compatibility, event unsubscribe, and semantic-versioning expectations.

## Architecture

Show ownership/dependency direction, ports/adapters, functional core/imperative shell, feature public APIs, state ownership, observability, migration seams. Staff answers add governance: compatibility policy, dependency policy, performance budgets, security baselines, platform/design-system contracts.

## Debugging

Give a concrete evidence chain. Use breakpoints/call stacks/scopes/network/performance/memory/source maps. Avoid “I would add console.log everywhere” as the whole answer.

## Language internals

Use execution contexts, Environment Records, Reference Records, abstract operations, realms, Jobs, early errors, and host hooks only to explain behavior—not as jargon decoration.

## Specification reasoning

When asked “why?”:

```text
syntax/operator/built-in
  ↓
ECMA-262 algorithm
  ↓ referenced abstract operations/internal methods
  ↓
observable result
```

If host behavior enters (timers, DOM, fetch, event loop), explicitly hand off from ECMA-262 to the relevant host standard/runtime.

## Production behavioral scenarios

A strong incident answer has context, signal, investigation, alternatives, decision, rollout, validation, and prevention. Examples suitable for JS interviews: stale autocomplete response, route listener leak, 500 treated as success by fetch, unbounded Promise concurrency, circular module initialization, prototype-pollution merge, XSS through `innerHTML`, timezone bug, long task blocking input.

## Practice loop

1. Pick 20 questions from the bank.
2. Answer aloud in 60–120 seconds each.
3. Draw the mental model for five.
4. For output questions, derive before running.
5. For production questions, state invariants/trade-offs.
6. Re-study the linked chapter for every weak answer.
7. Run a mock round and score evidence, correctness, depth, and communication separately.
