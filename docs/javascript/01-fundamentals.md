---
title: 01 — JavaScript Fundamentals
---

# 01 — JavaScript Fundamentals

JavaScript source is tokenized and parsed according to ECMAScript lexical and syntactic grammars. A program contains **statements/declarations** that control execution or introduce bindings, and **expressions** that evaluate to values.

```js
const taxRate = 0.18;              // declaration with initializer
const total = 1000 * (1 + taxRate); // expression inside declaration
if (total > 1000) {                // statement + expression
  console.log(total);
}
```

## Syntax, whitespace, identifiers, literals

Whitespace usually separates tokens but can become significant around line terminators, comments, template literals, and automatic semicolon insertion (ASI). Identifiers are Unicode-aware; production code should favor readable names and avoid visually confusable characters. Keywords and reserved words have grammar restrictions depending on context.

Common literals include numeric, BigInt, string, boolean, null, object, array, RegExp, and template literals. `undefined` is a global property rather than a literal keyword.

## Semicolons and ASI

JavaScript has a grammar-level ASI mechanism. It is not simply “the engine inserts a semicolon at every newline.” Certain restricted productions and parse failures permit insertion.

```js
function value() {
  return
  {ok: true};
}
// returns undefined because a LineTerminator after return triggers ASI
```

A consistent formatter/semicolon policy removes ambiguity. Do not rely on folklore; reason from grammar.

## Script vs module code

Scripts and modules have different semantics. Modules are always strict, have their own module environment, support `import`/`export`, and do not create classic-script global object properties in the same way. Top-level `this` is `undefined` in modules.

```js
// module
export const answer = 42;
console.log(this); // undefined
```

## Strict mode

`'use strict'` can opt classic script/function code into strict semantics. Modules and class bodies are strict automatically. Strict mode rejects or changes legacy behavior such as silent creation of accidental globals.

## Mental model

```text
characters
  ↓ lexical grammar
Tokens
  ↓ syntactic grammar + early errors
Parse tree / engine representation
  ↓ evaluation rules
values, bindings, calls, side effects
```

## Senior reasoning

When syntax surprises you, separate three questions: **Can it be parsed?** **Is it an early error after parsing?** **What happens when evaluated?** This distinction explains why some failures are `SyntaxError` before execution while others are runtime `ReferenceError`/`TypeError`.

### Interview checks

1. Why is ASI not equivalent to semicolon insertion at every newline?
2. What semantic changes when a file is a module rather than a script?
3. Is `undefined` a literal?

Related: [Parsing and early errors](./internals-and-specification.md#69--parsing-and-early-errors), [Modules](./36-modules.md).
