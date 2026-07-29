---
title: 04 — Type Conversion and Coercion
---

# 04 — Type Conversion and Coercion

**Conversion** means producing a value of another type. It can be explicit (`Number(x)`) or triggered implicitly by language semantics. Learn the abstract operations behind the behavior instead of memorizing puzzle answers.

## Truthiness

`undefined`, `null`, `false`, `+0`, `-0`, `0n`, `NaN`, and the empty string are falsy. Objects—including `[]`, `{}`, and wrapper objects—are truthy.

```js
Boolean('');    // false
Boolean('0');   // true
Boolean([]);    // true
```

## Primitive conversions

```js
Number('42');     // 42
Number('');       // 0
String(null);     // 'null'
Boolean(0);       // false
BigInt('42');     // 42n
```

The specification expresses these through abstract operations such as `ToBoolean`, `ToNumber`, `ToNumeric`, `ToString`, `ToBigInt`, and `ToObject`. They are specification algorithms, not generally callable JavaScript functions.

## Object → primitive

Many operators need a primitive. Conceptually `ToPrimitive` first honors `obj[Symbol.toPrimitive]`; otherwise it tries ordinary conversion hooks in an order influenced by the preferred hint.

```js
const money = {
  amount: 1200,
  [Symbol.toPrimitive](hint) {
    return hint === 'string' ? `PKR ${this.amount}` : this.amount;
  },
};

Number(money); // 1200
String(money); // 'PKR 1200'
```

`valueOf()` and `toString()` participate in ordinary object-to-primitive conversion. Never add surprising coercion hooks to business-domain objects without a strong reason.

## Explain the famous cases

### `[] == false`

Loose equality sees object vs boolean. `false` converts to number `0`; the array converts to primitive `''`; `''` converts to `0`; therefore the comparison becomes `0 == 0` → `true`.

```js
[] == false; // true
```

### `[] + {}`

Binary `+` performs primitive conversion. An empty array commonly becomes `''`; a plain object commonly becomes `'[object Object]'`; because a string is involved, `+` concatenates.

```js
[] + {}; // '[object Object]'
```

`{} + []` is context-sensitive in source text: at the beginning of some script statement contexts, `{}` can parse as an empty block before the `+`. In expression context, it is object-plus-array conversion. Parse first; coerce second.

### `null == undefined`

Loose equality has a specific rule making `null` and `undefined` equal to each other without treating them as equal to arbitrary falsy values.

```js
null == undefined; // true
null == 0;         // false
```

### NaN

```js
NaN === NaN;            // false
Object.is(NaN, NaN);    // true
Number.isNaN(NaN);      // true
```

`NaN` is a Number value with special equality behavior; it is not “not a number type.”

## Production guidance

Prefer explicit conversions at trust boundaries and when intent matters. Use strict equality by default, but understand loose equality because legacy code, DOM values, and interviews can expose it. Coercion is not inherently bad—template interpolation, boolean conditions, property keys, and arithmetic all depend on defined conversion rules.

## Security/performance

Implicit conversion can execute user-defined `Symbol.toPrimitive`, `valueOf`, or `toString`, so apparently simple operations on untrusted objects may invoke code. In hot paths, avoid clever coercion tricks; explicit code is easier to optimize and review.

### Interview checks

1. Derive `[] == false` step-by-step.
2. Why is `Boolean(new Boolean(false))` true?
3. Why can object-to-primitive conversion have side effects?

Related: [Equality](./05-equality-and-comparison.md), [Abstract operations](./internals-and-specification.md#66--abstract-operations).
