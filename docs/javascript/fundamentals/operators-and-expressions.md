---
title: Operators and Expressions
description: Evaluation order, precedence, short-circuiting and the complete practical operator model.
slug: /javascript/fundamentals/operators-and-expressions
---

# Operators and Expressions

Operators combine, inspect or transform operands. Precedence decides grouping; evaluation order decides when operands run. Parentheses communicate intent even when you know the table.

```javascript
const total = subtotal + shipping * quantity
const explicit = subtotal + (shipping * quantity)
```

## High-value operator families

- arithmetic: `+ - * / % **`;
- comparison: `< <= > >= == != === !==`;
- logical: `&& || !`;
- nullish and optional access: `??`, `?.`;
- assignment: `=`, compound and logical assignments;
- relational: `in`, `instanceof`;
- unary: `typeof`, `delete`, `void`, unary `+` and `-`;
- construction and control expressions: `new`, `await`, `yield`, conditional and comma;
- spread/rest syntax in arrays, objects, calls and parameters.

`&&`, `||` and `??` return an operand, not necessarily a Boolean.

```javascript
const displayName = profile.nickname || 'Anonymous' // replaces "" too
const preciseName = profile.nickname ?? 'Anonymous' // replaces only null/undefined
const city = customer.address?.city
```

Do not mix `??` directly with `&&` or `||` without parentheses. Optional chaining short-circuits only along one continuous chain; grouping can resume normal property access.

## Equality choices

Use `===` for ordinary identity comparisons, `Object.is` when `NaN` and negative zero matter, and collection semantics when SameValueZero is intended (`Set`, `Map`, `includes`). Loose equality is specified, but use it only when its coercion contract is deliberate and documented.

## Side effects and order

Operands are evaluated left to right even when precedence groups operations differently. Short-circuit operators can suppress a side effect.

```javascript
let calls = 0
const cached = true
const result = cached || (++calls, loadValue())
console.log(calls) // 0
```

## Production failures

- `user.role === 'admin' || 'owner'` is always truthy; compare both sides.
- `a + b ?? fallback` applies `+` before `??`; parentheses may be required.
- bitwise operators coerce Numbers to 32-bit integers and are unsafe for general IDs.
- `delete array[index]` creates a hole; use array methods when removing elements.
- `typeof null` is the historical string `"object"`.

## Decision rule

First write the intended data contract, then select an operator. Use explicit predicates at trust boundaries rather than relying on truthiness when `0`, `""`, `false` and `NaN` have distinct business meanings.

## Primary references

- [ECMA-262 expressions](https://tc39.es/ecma262/#sec-ecmascript-language-expressions)
- [MDN expressions and operators](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Expressions_and_operators)
