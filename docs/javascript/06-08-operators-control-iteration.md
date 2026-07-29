---
title: 06–08 — Operators, Control Flow, Loops & Iteration
---

# 06–08 — Operators, Control Flow, Loops & Iteration

## 06 — Operators

Operators are syntax that evaluate operands according to language rules. The important senior-level questions are **evaluation order**, **coercion**, **short-circuiting**, **precedence**, and whether an operation works with Number, BigInt, strings, objects, or references.

### Arithmetic and assignment

```js
let x = 2;
x += 3;     // 5
x **= 2;    // 25
```

Arithmetic operators include `+ - * / % **`. Unary `+` performs Number conversion; unary `-` negates a numeric value. BigInt arithmetic generally requires BigInt operands; mixing Number and BigInt in arithmetic throws.

`+` is special because after primitive conversion it performs string concatenation if either primitive operand is a string; otherwise it performs numeric addition.

### Comparison and logical operators

`===`, `!==`, `==`, `!=`, `<`, `<=`, `>`, `>=` have distinct algorithms discussed in the equality chapter. `&&` and `||` return one of their operands rather than guaranteed booleans.

```js
const name = input || 'Anonymous'; // falls back for ANY falsy value
const count = input ?? 0;          // falls back only for null/undefined
```

`??` cannot be mixed directly with `&&` or `||` without parentheses because the grammar deliberately requires explicit grouping.

Logical assignment (`&&=`, `||=`, `??=`) evaluates the left reference once and assigns only when its corresponding short-circuit condition permits.

### Optional chaining

```js
user?.profile?.name
handler?.(event)
items?.[index]
```

Optional chaining short-circuits only along one continuous optional chain. Grouping can end the chain:

```js
const value = (user?.profile).name; // can throw if profile is undefined
```

The base expression still runs. Optional calls preserve call-reference semantics when written as `obj.method?.()`.

### Unary and relational forms

- `typeof value` returns a string classification; `typeof undeclaredName` is unusually safe.
- `delete obj.x` attempts to remove a property; it does not delete local lexical bindings.
- `void expr` evaluates `expr` and yields `undefined`.
- `key in obj` checks own **or inherited** properties.
- `obj instanceof Ctor` performs prototype/`@@hasInstance` logic.

### Bitwise operators

Most Number bitwise operations coerce through 32-bit integer semantics. They can truncate large numbers and are poor substitutes for normal arithmetic. BigInt has its own bitwise behavior for supported operators.

### Comma, spread, precedence

The comma operator evaluates left-to-right and returns the final expression; commas used in argument lists, arrays, or declarations are grammar separators, not the comma operator.

Spread is syntax with context-specific semantics, not one universal operator: function/array spread consumes iterables; object spread copies enumerable own properties.

Use parentheses for human clarity even when you know precedence. Correct code that reviewers misread is still costly code.

---

## 07 — Control Flow

Control-flow statements determine which evaluations occur and how abrupt completion propagates.

```js
if (score >= 80) {
  grade = 'A';
} else {
  grade = 'B';
}
```

`switch` compares case values using strict equality-like matching and falls through until a `break`, `return`, `throw`, or end of switch.

```js
switch (kind) {
  case 'draft':
  case 'queued':
    enqueue();
    break;
  default:
    reject();
}
```

Blocks create lexical scope for `let`, `const`, class declarations, and certain other lexical declarations.

### Abrupt completion

`return`, `throw`, `break`, and `continue` conceptually create abrupt completions that unwind through surrounding constructs. `finally` always runs when control leaves the associated `try`/`catch`, and a new abrupt completion from `finally` can replace the earlier one.

```js
function dangerous() {
  try {
    return 1;
  } finally {
    return 2;
  }
}

console.log(dangerous()); // 2
```

Do not `return` from `finally` in ordinary application code: it can suppress errors and returned values.

```js
try {
  risky();
} catch (error) {
  report(error);
} finally {
  release();
}
```

Prefer preserving original errors; if cleanup can fail, modern explicit resource management provides structured semantics discussed later.

Labels exist for targeting `break`/`continue` in nested control flow, but excessive labeled logic is usually a refactoring signal.

---

## 08 — Loops and Iteration

### Basic loops

`for`, `while`, and `do...while` are control structures. `for...of` is different: it drives the **iterable/iterator protocol**. `for...in` enumerates string-keyed enumerable properties across the object and its prototype chain.

```js
for (const value of values) {
  console.log(value);
}
```

### Why not `for...in` for arrays?

Arrays are objects. `for...in` enumerates enumerable property names, not “array elements.” It can see custom/inherited enumerable properties and produces string keys. For values, use `for...of`; for indexes, use a numeric loop or `entries()`.

```js
const a = ['x', 'y'];
a.extra = true;

for (const key in a) console.log(key); // '0', '1', 'extra'
for (const value of a) console.log(value); // 'x', 'y'
```

### Mutation while iterating

Mutation can change what is visited depending on the specific iterator/algorithm. Do not assume every array method, `for...of`, Map iterator, and property enumeration takes the same snapshot. For production code, prefer an explicit policy: iterate over a copy, queue changes, or document mutation semantics.

### Iterator closing

Some consumers close iterators on abrupt completion by calling the iterator's `return()` when present. This makes generators and custom iterables able to release resources when a loop exits early.

```js
function* values() {
  try {
    yield 1;
    yield 2;
  } finally {
    console.log('closed');
  }
}

for (const x of values()) {
  break; // generator cleanup runs
}
```

### Interview checks

1. Why does `&&` return operands rather than booleans?
2. How can `finally` suppress a thrown error?
3. What semantic protocol powers `for...of`?
4. Why is `for...in` usually wrong for array values?

Related: [Coercion](./04-coercion.md), [Iterators/generators](./builtins-iteration-binary.md#27--iterators-and-iterables).
