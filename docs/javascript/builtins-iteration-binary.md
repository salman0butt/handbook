---
title: 19–31 — Text, Numbers, Time, Collections, Iteration, Binary Data & Errors
---

# 19–31 — Text, Numbers, Time, Collections, Iteration, Binary Data & Errors

## 19 — Strings and Unicode

Strings are immutable sequences of UTF-16 code units. `.length` counts code units, not user-perceived characters.

```js
'💡'.length; // 2
[...'💡'].length; // 1 code point
```

A Unicode code point above U+FFFF is represented by a surrogate pair in UTF-16. Even code-point iteration is not the same as grapheme segmentation: `é` may be one code point or `e` + combining mark, and emoji can combine through variation selectors/ZWJ sequences.

```js
const a = '\u00E9';
const b = 'e\u0301';
a === b; // false

a.normalize('NFC') === b.normalize('NFC'); // true
```

Use `Intl.Segmenter` for locale-aware grapheme/word segmentation rather than hand-slicing by `.length`.

Template literals support interpolation and multiline source. Tagged templates receive cooked string segments plus substitutions and can implement safe DSLs when designed carefully.

```js
const name = 'Ava';
`Hello ${name}`;
```

String iteration is code-point aware. Common methods include `at`, `charAt`, `charCodeAt`, `codePointAt`, `includes`, `startsWith`, `endsWith`, `indexOf`, `lastIndexOf`, `slice`, `substring`, `split`, `replace`, `replaceAll`, `match`, `matchAll`, `search`, `padStart`, `padEnd`, `repeat`, `trim*`, `toLowerCase`, `toUpperCase`, `localeCompare`, and normalization helpers.

For human-language ordering, use `Intl.Collator`/`localeCompare`; direct `<` comparison is code-unit-oriented and not a culturally correct sorting strategy.

### Security

Unicode normalization and visually confusable characters can matter in identifiers, usernames, URLs, and security-sensitive comparisons. Do not normalize blindly; define the domain's normalization policy.

---

## 20 — Numbers and Math

ECMAScript Number uses IEEE-754 binary64 semantics. Many decimal fractions cannot be represented exactly in binary floating point.

```js
0.1 + 0.2;        // 0.30000000000000004
0.1 + 0.2 === 0.3; // false
```

This is not a JavaScript-specific arithmetic bug. `0.1` and `0.2` are approximated to nearby binary64 values; the rounded sum is not exactly the same representable value as the approximation of `0.3`.

Number includes `NaN`, `Infinity`, `-Infinity`, `+0`, and `-0`.

```js
Number.isNaN(NaN);
Number.isFinite(10);
Object.is(-0, 0); // false
```

Integers are exactly represented only across the safe integer range `Number.MIN_SAFE_INTEGER` through `Number.MAX_SAFE_INTEGER`.

```js
Number.isSafeInteger(9007199254740991); // true
```

Use `Number.parseInt`, `Number.parseFloat`, or explicit `Number(...)` according to desired grammar. Always supply a radix to `parseInt` when reading non-obvious formats.

Numeric literal forms include binary (`0b...`), octal (`0o...`), hex (`0x...`), exponent notation, and numeric separators (`1_000_000`). Math provides trigonometric, logarithmic, rounding, min/max, random, exponent/power, sign, integer multiplication, hypot, and related numeric utilities.

For money, binary floating point often needs a deliberate strategy: integer minor units where domain range permits, decimal libraries/decimal proposals when appropriate, or server/database decimal types. Never assume `toFixed` transforms underlying arithmetic into exact decimal arithmetic.

---

## 21 — BigInt

BigInt represents arbitrary-precision integers.

```js
const id = 12345678901234567890n;
const fromText = BigInt('12345678901234567890');
```

Arithmetic generally cannot mix BigInt and Number:

```js
// 1n + 1; // TypeError
1n + BigInt(1); // 2n
```

Relational comparisons can compare across Number/BigInt under defined rules, but explicit conversion is clearer when precision matters.

BigInt is useful for large integer identifiers, counters, cryptographic/integer algorithms, and exact integer domains. It is not a decimal floating-point type.

JSON historically cannot directly stringify a BigInt value because JSON has no BigInt type. Serialize deliberately, commonly as a string with schema knowledge, and revive deliberately at the boundary.

```js
JSON.stringify({id: id.toString()});
```

BigInt operations can be slower than small Number arithmetic and are not constant-time cryptographic primitives.

---

## 22 — Date and Time

`Date` represents a timestamp as milliseconds since the Unix epoch (subject to its valid range), while many methods expose that instant in either local time or UTC.

```js
const now = new Date();
now.getTime();
now.toISOString(); // UTC ISO representation
```

A Date object does not store an arbitrary named time zone such as `Asia/Karachi`; local-time methods use the host's configured zone.

### Parsing

Prefer explicit ISO-compatible inputs and validate them. Ambiguous locale-looking strings such as `03/04/2026` should not cross system boundaries.

```js
new Date('2026-07-30T12:00:00Z');
```

### DST and arithmetic

“Add 24 hours” and “same local clock time tomorrow” are different operations across daylight-saving transitions. Keep instants, calendar dates, and zoned civil times conceptually separate.

For display, use `Intl.DateTimeFormat`; for modern time-zone/calendar arithmetic, prefer Temporal when target compatibility allows or a maintained library/polyfill where necessary.

---

## 23 — Temporal

Temporal is a modern standard date/time model designed to address Date's mutability, ambiguous parsing, and weak separation between instants, calendar dates, times, and time zones. At the 2026 handbook baseline it is **Stage 4 / standard-track completed**, while engine/runtime rollout must still be checked.

Key types:

- `Temporal.Instant` — a point on the UTC timeline.
- `Temporal.ZonedDateTime` — instant + time zone + calendar context.
- `Temporal.PlainDate` — calendar date without time zone/time.
- `Temporal.PlainTime` — clock time without date/time zone.
- `Temporal.PlainDateTime` — civil date + time without zone.
- `Temporal.PlainYearMonth`, `PlainMonthDay` — partial calendar values.
- `Temporal.Duration` — amount of time/calendar units.
- `Temporal.Now` — current values supplied through the runtime.

```js
// Availability depends on target runtime
const date = Temporal.PlainDate.from('2026-07-30');
const next = date.add({days: 1});
```

Temporal objects are designed around explicit types and immutable-style operations. Time-zone arithmetic can distinguish exact elapsed-time math from calendar math.

Do not equate standardization with universal availability. Feature-detect and consult target compatibility before production use; where unavailable, use an appropriate polyfill/library rather than silently falling back to incompatible Date semantics.

---

## 24 — Regular Expressions

RegExp values can be written with literals or constructed dynamically.

```js
const word = /(?<name>[A-Za-z]+)-(?<id>\d+)/u;
const dynamic = new RegExp('^' + escapeForRegex(userPart) + '$', 'u');
```

Do not concatenate untrusted text into a regular expression without escaping it for the intended syntax.

Important flags include global `g`, ignore-case `i`, multiline `m`, dotAll `s`, Unicode-related flags (`u` and newer Unicode-set behavior where supported/standardized), sticky `y`, and indices `d`.

Groups and captures:

```js
const m = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/.exec('2026-07-30');
m.groups.year; // '2026'
```

Backreferences reuse captured text. Lookahead/lookbehind are zero-width assertions. Unicode property escapes can match character classes by Unicode properties.

`replace`/`replaceAll` can take functions, which is safer and more expressive than complicated replacement templates for transformations.

### ReDoS

Backtracking regex engines can take pathological time on ambiguous nested repetition. Treat regexes over attacker-controlled long input as a performance/security surface. Prefer linear/simple patterns, cap input size, benchmark worst cases, and use specialized parsers when grammar complexity grows.

---

## 25 — Symbols

Symbols are unique primitive values often used as collision-resistant property keys or protocol hooks.

```js
const id = Symbol('id');
const obj = {[id]: 123};
```

`Symbol()` creates a fresh symbol. `Symbol.for(key)` uses the global symbol registry associated with the agent-level semantics, and `Symbol.keyFor` retrieves registry keys for registered symbols.

Well-known symbols let objects participate in language protocols, including `Symbol.iterator`, `asyncIterator`, `hasInstance`, `match`, `matchAll`, `replace`, `search`, `species`, `split`, `toPrimitive`, `toStringTag`, `unscopables`, `dispose`, and `asyncDispose` where standardized.

Symbols do not make data private: symbol properties are discoverable through reflection such as `Reflect.ownKeys`.

---

## 26 — Map, Set, WeakMap, WeakSet

`Map` stores key/value pairs with arbitrary keys; `Set` stores unique values. Both use SameValueZero-style key/value equality and preserve insertion order for iteration.

```js
const map = new Map();
map.set({id: 1}, 'object key');

const set = new Set([1, 1, NaN, NaN]);
set.size; // 2
```

Use an object when the value is naturally a record with known property names. Use `Map` when the abstraction is a dynamic key/value collection with arbitrary keys, explicit size/iteration, and collection methods.

Modern Set operations include standardized set-algebra style methods such as union/intersection/difference/symmetric difference and relational checks, subject to target compatibility.

Weak collections hold keys weakly (WeakMap keys / WeakSet members are object-like eligible values according to current semantics), so they do not by themselves keep those keys alive. They are intentionally not enumerable because GC reachability is nondeterministic.

Use cases: per-object metadata, caches tied to object lifetime, branding/capability patterns. Do not use weak collections when you need to list entries.

---

## 27 — Iterators and Iterables

An **iterable** has a `Symbol.iterator` method returning an **iterator**. An iterator has `next()` returning `{value, done}`.

```js
const range = {
  start: 1,
  end: 3,
  [Symbol.iterator]() {
    let n = this.start;
    const end = this.end;
    return {
      next() {
        return n <= end ? {value: n++, done: false} : {done: true};
      },
    };
  },
};

[...range]; // [1,2,3]
```

Built-in iterables include arrays, strings, Maps, Sets, typed arrays, and many iterator-producing APIs.

Consumers include `for...of`, array spread, argument spread, array destructuring, `Array.from`, Set/Map constructors, and Promise combinators.

Iterator closing gives consumers a way to signal early termination through `return()`.

Standardized Iterator helper APIs provide lazy transformation patterns on iterator objects where available. Prefer them for lazy pipelines only after checking runtime targets; array methods remain excellent when eager materialization is desired.

---

## 28 — Generators

Generator functions produce generator objects that implement iterator protocols.

```js
function* ids() {
  yield 1;
  yield 2;
}

[...ids()]; // [1,2]
```

`yield` suspends generator execution; `next(value)` resumes and can send a value back into the suspended generator. `yield*` delegates to another iterable.

```js
function* chain() {
  yield* [1, 2];
  yield 3;
}
```

Generators are good for lazy sequences, stateful traversals, parser/token streams, and implementing custom iteration without manually managing `next()` state.

`throw()` and `return()` on a generator can resume it with abrupt completion, enabling cleanup via `try/finally`.

---

## 29 — Typed Arrays and Binary Data

`ArrayBuffer` is raw binary memory. Typed-array views interpret bytes as homogeneous numeric elements; `DataView` reads/writes mixed numeric formats with explicit offsets and endianness.

```js
const buffer = new ArrayBuffer(8);
const bytes = new Uint8Array(buffer);
bytes[0] = 255;
const view = new DataView(buffer);
view.setUint16(2, 0x1234, false); // big-endian write
```

Typed-array families include signed/unsigned integer widths, clamped 8-bit, floating-point variants, BigInt typed arrays, and current standardized float variants where supported (including newer Float16 capabilities in modern standards/engines).

Views can share one buffer, so writes through one view are observable through another.

```text
ArrayBuffer bytes
┌──────────────────────────────┐
│ 00 │ 01 │ 02 │ 03 │ 04 ... │
└──────────────────────────────┘
  ↑ Uint8Array view
       ↑ DataView offset/read
```

Use binary views for file/protocol parsing, media, graphics, crypto plumbing, WebAssembly interop, and transferable worker data. Validate lengths/offsets from untrusted protocols.

---

## 30 — Atomics and Shared Memory

`SharedArrayBuffer` allows multiple agents/workers to access shared memory. `Atomics` supplies operations with defined synchronization/memory-order semantics on supported typed-array views.

```js
const sab = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
const state = new Int32Array(sab);
Atomics.store(state, 0, 1);
Atomics.load(state, 0);
```

Atomic read-modify-write operations prevent certain data races on the addressed element; `Atomics.wait`/`notify` coordinate blocking/wakeup where host/runtime rules allow.

Shared memory is advanced. Message passing is usually simpler, easier to test, and safer. Use shared memory only when measurements justify it and define synchronization invariants explicitly. The fact that browser JavaScript commonly runs UI code on one main thread does not mean a program cannot have concurrency races.

---

## 31 — Errors

The standard error hierarchy includes `Error`, `AggregateError`, `EvalError`, `RangeError`, `ReferenceError`, `SyntaxError`, `TypeError`, and `URIError`, plus newer standardized resource-management errors such as `SuppressedError` where applicable.

```js
try {
  throw new Error('Request failed', {cause: originalError});
} catch (error) {
  console.error(error);
}
```

`cause` supports wrapping while preserving the underlying failure.

Custom errors should carry stable machine-readable data, not force callers to parse messages:

```js
class ValidationError extends Error {
  constructor(message, issues, options) {
    super(message, options);
    this.name = 'ValidationError';
    this.issues = issues;
  }
}
```

Stack traces are widely available implementation/runtime tooling, but their exact format/content is not a portable ECMA-262 guarantee. Do not parse stack strings as application protocol.

Translate errors at layer boundaries: low-level network/storage failures may become domain errors, while preserving `cause` for diagnostics. Never swallow an error unless the contract explicitly treats it as handled.

### Interview checks for 19–31

1. Why can `.length` overcount visible string characters?
2. Why is `0.1 + 0.2` not exactly `0.3`?
3. What problem does Temporal solve compared with Date?
4. What creates ReDoS risk?
5. Are Symbols private?
6. Why are WeakMaps not enumerable?
7. What protocol powers `for...of` and spread?
8. How does `yield` differ from `return`?
9. Why can two typed arrays observe the same writes?
10. When is shared memory inappropriate?
11. Why is `error.cause` useful?
