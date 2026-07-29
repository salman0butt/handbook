---
title: 37–47 — Resource Management, Metaprogramming, Modern Syntax, JSON & Intl
---

# 37–47 — Resource Management, Metaprogramming, Modern Syntax, JSON & Intl

## 37 — Explicit Resource Management

Explicit Resource Management provides deterministic cleanup semantics rather than relying on garbage collection timing. Standardized constructs include `using`, `await using`, `Symbol.dispose`, `Symbol.asyncDispose`, `DisposableStack`, `AsyncDisposableStack`, and `SuppressedError`.

```js
// Availability depends on target runtime.
{
  using resource = openResource();
  resource.use();
} // resource[Symbol.dispose]() is invoked on scope exit
```

For async cleanup:

```js
async function run() {
  await using resource = await openAsyncResource();
  await resource.use();
}
```

A disposable resource participates by exposing the appropriate well-known symbol method.

```js
class FileLike {
  [Symbol.dispose]() {
    this.close();
  }
}
```

Stacks manage several cleanup actions and support moving/disposing ownership in a structured way. When both body work and cleanup fail, `SuppressedError` preserves the relationship rather than silently losing one error.

Use deterministic cleanup for locks, subscriptions, temporary resources, transaction scopes, handles, and adapters that actually need lifetime boundaries. Do not use GC finalizers as a replacement.

**Compatibility:** standardized does not mean universal. Check syntax and built-in availability across your target runtimes before shipping `using`/stacks.

---

## 38 — Proxy

A Proxy interposes on an object's internal operations through traps.

```js
const target = {count: 1};
const proxy = new Proxy(target, {
  get(target, key, receiver) {
    console.log('read', key);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    if (key === 'count' && value < 0) return false;
    return Reflect.set(target, key, value, receiver);
  },
});
```

Important traps include `get`, `set`, `has`, `ownKeys`, `getOwnPropertyDescriptor`, `defineProperty`, `deleteProperty`, `getPrototypeOf`, `setPrototypeOf`, `isExtensible`, `preventExtensions`, `apply`, and `construct`.

Proxies must obey **invariants**. For example, a trap cannot pretend a non-configurable own property does not exist when the target's invariants require visibility. Violations throw `TypeError`.

```js
const {proxy, revoke} = Proxy.revocable(target, handler);
revoke();
// proxy.count -> TypeError after revocation
```

Frameworks use proxies for reactive tracking, validation, access control facades, debugging, and virtual objects. Costs include harder debugging, identity surprises, incompatibility with some private/internal-slot-requiring built-ins, and optimizer overhead. Use only when interposition is the right abstraction.

---

## 39 — Reflect

`Reflect` exposes function-style forms of many object internal operations and pairs naturally with Proxy forwarding.

```js
Reflect.get(obj, key, receiver);
Reflect.set(obj, key, value, receiver);
Reflect.has(obj, key);
Reflect.ownKeys(obj);
Reflect.defineProperty(obj, key, descriptor);
Reflect.deleteProperty(obj, key);
Reflect.getPrototypeOf(obj);
Reflect.setPrototypeOf(obj, proto);
Reflect.isExtensible(obj);
Reflect.preventExtensions(obj);
Reflect.apply(fn, thisArg, args);
Reflect.construct(Ctor, args, newTarget);
Reflect.getOwnPropertyDescriptor(obj, key);
```

Unlike some `Object.*` mutation APIs that throw on failure, certain Reflect methods return booleans matching internal-operation success semantics.

```js
const ok = Reflect.defineProperty(obj, 'x', {value: 1});
```

Use Reflect in Proxy traps when you want default language-like behavior without manually reimplementing edge cases.

---

## 40 — Metaprogramming

Metaprogramming means code that observes or changes how code/objects behave: dynamic property access, descriptors, Symbols, prototype inspection, Proxy, Reflect, and generated/DSL-like APIs.

```js
const field = 'name';
record[field];
Object.getOwnPropertyDescriptors(record);
Reflect.ownKeys(record);
```

Prefer ordinary functions/objects first. Metaprogramming raises cognitive and tooling costs and can create security hazards when dynamic names come from untrusted sources.

**Decorators:** only teach them as standard JavaScript if they are Stage 4/current-standard at the time you read this handbook. Tool-specific or Stage 3 decorator syntax must be labelled as proposal/tooling behavior rather than stable ECMAScript. The version-baseline page is the source of truth for current status.

Runtime metadata can be represented explicitly with Maps/WeakMaps/Symbol properties instead of relying on non-standard reflection magic.

---

## 41 — WeakRef and FinalizationRegistry

`WeakRef` can reference an object without preventing garbage collection; `FinalizationRegistry` can request a callback after a registered target becomes collectible.

```js
const ref = new WeakRef(object);
const value = ref.deref(); // object or undefined
```

GC timing is nondeterministic. A program must remain correct if collection/finalization is delayed indefinitely or occurs at inconvenient times permitted by the specification/implementation.

Good use cases are specialized caches or cleanup of auxiliary resources where finalization is only a fallback optimization. Bad use cases include correctness-critical close/unlock/transaction logic, security token expiry, or business workflows.

Finalizers can make debugging and performance less predictable. Prefer explicit lifetimes and Explicit Resource Management when deterministic cleanup matters.

---

## 42 — Memory Mental Model

A useful—but not guaranteed physical-layout—model is:

```text
binding ──→ object A ──→ object B
                │
                └────→ function closure ──→ environment binding
```

Primitives are immutable values. Objects have identity. Engines allocate data using implementation-specific stacks, heaps, registers, arenas, inline storage, optimized frames, etc. “Primitives are on the stack and objects are on the heap” is not a language guarantee.

Garbage collection is based on reachability from roots, conceptually. Leaks happen when useful-lifetime ends but reachability remains.

Common sources:

- global caches with no eviction,
- event listeners not removed,
- timers/observers keeping callbacks alive,
- closures retaining large graphs,
- detached DOM subtrees still referenced,
- pending workflows/queues,
- accidental registries.

Weak references can help specific metadata/cache patterns but should not be a default leak fix.

---

## 43 — Destructuring

Destructuring patterns bind or assign values from arrays/iterables and objects.

```js
const [first, second = 2, ...rest] = iterable;
const {id, name: displayName = 'Unknown', meta: {active}} = record;
```

Array destructuring drives the iterator protocol; object destructuring performs property access by keys. Defaults run only when the extracted value is `undefined`, not `null`.

```js
const {x = 1} = {x: null}; // x is null
```

Parameter destructuring is useful but can obscure APIs when deeply nested:

```js
function render({theme = 'light', user: {name}}) {}
```

Evaluation order matters because computed keys/default initializers can execute code. Destructuring is not deep cloning.

---

## 44 — Spread and Rest

`...` has grammar-dependent meanings.

```js
fn(...iterable);                    // argument spread
const arr = [...iterable];          // array spread
const obj = {...source};            // object spread
function fn(first, ...rest) {}      // rest parameter
const [head, ...tail] = arr;         // array rest
const {id, ...remaining} = object;   // object rest
```

Argument/array spread consumes an iterable. Object spread copies own enumerable properties. Rest collects remaining values/properties according to its pattern context.

All common copy forms are shallow. Object spread does not copy the prototype or full descriptors; getters can be invoked while reading source values.

---

## 45 — Optional Chaining and Nullish Coalescing

```js
user?.profile?.name
user?.items?.[0]
user?.callback?.()
```

Optional chaining short-circuits when the current optional-chain base is `null` or `undefined`. It does not suppress arbitrary exceptions thrown by getters/functions.

Grouping can end a chain:

```js
(user?.profile).name // can throw
```

`??` falls back only for `null`/`undefined`; `||` falls back for every falsy value.

```js
0 || 10; // 10
0 ?? 10; // 0
```

Logical assignments (`&&=`, `||=`, `??=`) short-circuit and evaluate the left reference once.

---

## 46 — JSON

JSON is a data-interchange syntax, not “JavaScript object syntax.” It has strings, numbers, booleans, null, arrays, and objects with string keys. It does not represent `undefined`, functions, Symbols, BigInt values directly, comments, arbitrary prototypes, Maps/Sets, cycles, or JavaScript expressions.

```js
const text = JSON.stringify(value, replacer, 2);
const value2 = JSON.parse(text, reviver);
```

A replacer filters/transforms serialization; a reviver transforms parsed values during traversal.

```js
JSON.stringify({a: undefined, fn() {}}); // '{}'
JSON.stringify([undefined]);             // '[null]'
```

Date commonly serializes through `toJSON`/ISO string behavior, losing the original object type; revive deliberately if schema says it is a timestamp.

Cycles throw unless custom handling is used.

### Security

`JSON.parse` does not execute JSON as JavaScript; do not use `eval` to parse JSON. Parsing still does not make data trusted—validate schema, ranges, URLs, IDs, and permissions. Be careful when recursively merging parsed objects into existing objects because prototype pollution can arise in merge logic, not from parsing alone.

---

## 47 — Internationalization (ECMA-402)

Internationalization is standardized separately in **ECMA-402**, not core ECMA-262.

Key APIs include:

- `Intl.Locale`
- `Intl.Collator`
- `Intl.DateTimeFormat`
- `Intl.NumberFormat`
- `Intl.RelativeTimeFormat`
- `Intl.ListFormat`
- `Intl.PluralRules`
- `Intl.DisplayNames`
- `Intl.Segmenter`
- `Intl.DurationFormat` where included in the current ECMA-402 baseline/runtime

```js
const money = new Intl.NumberFormat('en-PK', {
  style: 'currency',
  currency: 'PKR',
});
money.format(125000);
```

Locale negotiation maps requested locales/options onto supported runtime locale data. Unicode extension keys can request calendars, numbering systems, hour cycles, collation variants, and related behavior.

```js
new Intl.DateTimeFormat('en-PK', {
  dateStyle: 'long',
  timeZone: 'Asia/Karachi',
}).format(new Date());
```

Formatting is not parsing. Do not parse user-facing localized number/date strings using assumptions based on one locale.

`Intl.Segmenter` is especially important for user-perceived text boundaries because JavaScript string indexing is UTF-16 code-unit based.

### Interview checks for 37–47

1. Why is `using` different from GC cleanup?
2. What are Proxy invariants?
3. Why pair Proxy traps with Reflect?
4. Why is `WeakRef` unsuitable for correctness-critical cleanup?
5. Is stack-vs-heap a JavaScript guarantee?
6. How does array destructuring involve iteration?
7. Why is spread shallow?
8. How does `??` differ from `||`?
9. Why is JSON not JavaScript syntax?
10. Which standard owns `Intl` APIs?
