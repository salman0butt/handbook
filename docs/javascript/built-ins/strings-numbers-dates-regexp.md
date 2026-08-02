---
title: Strings, Numbers, Dates and Regular Expressions
description: Unicode, IEEE 754, time zones, Temporal status and safe regular-expression design.
---

# Strings, Numbers, Dates and Regular Expressions

## Strings and Unicode

JavaScript strings are sequences of UTF-16 code units. A visible character may use one code unit, a surrogate pair, combining marks or an entire grapheme cluster.

```javascript
'👍🏽'.length // code units, not user-perceived characters
const graphemes = [...new Intl.Segmenter('en', {granularity: 'grapheme'}).segment('👍🏽')]
```

`for...of` iterates code points, not grapheme clusters. Normalize when your domain requires canonical equivalence, and use locale-aware comparison for user-facing sorting. Never truncate UI text by code-unit index when splitting a grapheme would be harmful.

Template literals interpolate expressions; tagged templates receive raw/cooked segments and can build safe domain-specific values. A tag is not automatically an escaping mechanism—its contract must provide the safety.

## Numbers

Number follows IEEE 754 binary64. Many decimal fractions are not exactly representable.

```javascript
0.1 + 0.2 === 0.3 // false
Number.isSafeInteger(9_007_199_254_740_991) // true
```

Use integer minor units or a deliberate decimal library for money; define rounding rules. `parseInt` and `parseFloat` accept prefixes, while `Number` requires a complete numeric conversion. Validate with `Number.isFinite` rather than global coercing helpers.

BigInt is for integers outside the safe Number range, not decimal fractions. JSON does not serialize BigInt without a custom representation.

## Date, time and Temporal

A Date stores one timestamp in milliseconds from the Unix epoch; its local getters format that instant through the host time zone. Parse explicit ISO formats, store instants consistently, and keep the business time-zone identifier when future local-time meaning matters.

Daylight-saving transitions make “add 24 hours” different from “same local time tomorrow.” `Intl.DateTimeFormat` handles display. Temporal is finished Stage 4 and appears in the living draft, but support remains compatibility-sensitive; use native Temporal only on verified targets or a maintained polyfill.

## Regular expressions

Use RegExp for bounded lexical patterns, not arbitrary nested grammars. Modern features include named captures, lookbehind, Unicode property escapes, match indices, `RegExp.escape`, Unicode sets and inline modifiers, with target checks.

```javascript
const match = /^(?<local>[\p{L}\p{N}._%+-]+)@(?<host>[\p{L}\p{N}.-]+)$/u.exec(value)
```

Validation still needs domain rules; email, URL and international names are not solved by one simplistic pattern.

## ReDoS prevention

Catastrophic backtracking can turn attacker-controlled text into excessive CPU use. Avoid ambiguous nested quantifiers, anchor where appropriate, bound input length, prefer parsers for structured formats, and benchmark worst cases. A successful match on normal input is not a performance proof.

## Primary references

- [ECMA-262 text processing](https://tc39.es/ecma262/#sec-text-processing)
- [ECMA-402](https://tc39.es/ecma402/)
- [TC39 Temporal](https://github.com/tc39/proposal-temporal)
