---
title: 05 — Equality and Comparison
---

# 05 — Equality and Comparison

JavaScript has several equality relations because different operations need different semantics.

| Relation | `NaN` equals itself? | `+0` vs `-0` | Common use |
|---|---:|---:|---|
| `===` / Strict Equality | No | Equal | ordinary comparisons |
| `==` / Abstract Equality | No | Equal | coercing comparison |
| SameValue (`Object.is`) | Yes | Different | exact identity semantics |
| SameValueZero | Yes | Equal | `Set`, `Map` keys, `includes` |

```js
NaN === NaN;         // false
Object.is(NaN, NaN); // true
0 === -0;            // true
Object.is(0, -0);    // false
```

## Strict equality

`===` does not coerce unlike types. Objects compare by identity.

```js
{} === {}; // false
const x = {};
const y = x;
x === y; // true
```

## Loose equality

`==` applies a defined conversion algorithm. It is not random, but it is harder to read because operands may undergo multiple conversions.

```js
'42' == 42;          // true
null == undefined;   // true
0 == false;          // true
```

Use `===` by default in application code. A deliberate `value == null` can be a concise null-or-undefined check when team conventions allow it.

## SameValueZero in standard collections

`Array.prototype.includes`, Set membership, and Map key matching use SameValueZero-like semantics, which means `NaN` can be found and `+0`/`-0` are treated as the same key.

```js
[NaN].includes(NaN); // true
new Set([NaN, NaN]).size; // 1
```

`indexOf` uses strict equality and therefore does not find `NaN`.

```js
[NaN].indexOf(NaN); // -1
```

## Relational comparison

`<`, `>`, `<=`, and `>=` use abstract relational comparison rules. Strings may compare lexicographically by UTF-16 code units; otherwise primitive/numeric conversion occurs.

```js
'20' < '3'; // true: string comparison
20 < '3';   // false: numeric comparison
```

BigInt and Number can be relationally compared without always converting BigInt to Number, but arithmetic mixing is restricted. Avoid comparisons that depend on precision beyond Number's safe integer range.

## Senior reasoning

When equality surprises you, identify the algorithm used by the operation rather than assuming everything delegates to `===`. This matters for `Set`, `Map`, `includes`, property identity, `Object.is`, and cross-realm objects.

### Interview checks

- Why does `[NaN].includes(NaN)` succeed while `indexOf` fails?
- When does `Object.is` differ from `===`?
- Why can `'20' < '3'` be true?
