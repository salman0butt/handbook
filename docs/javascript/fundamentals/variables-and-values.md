---
title: Variables and Values
description: Bindings, declarations, values, mutation, strict mode and beginner programming foundations in JavaScript.
slug: /javascript/fundamentals/variables-and-values
---

# Variables and Values

A variable is a **binding from a name to a value**. It is not the value itself, and an object variable does not contain a private copy of the object.

```javascript
const account = {balance: 100}
const sameAccount = account
sameAccount.balance += 25
console.log(account.balance) // 125
```

## Declarations

| Form | Scope | Reassignment | Initialization behavior |
|---|---|---|---|
| `const` | block | no | temporal dead zone until evaluated |
| `let` | block | yes | temporal dead zone until evaluated |
| `var` | function or global | yes | initialized to `undefined` during declaration instantiation |

Prefer `const` when the binding will not be reassigned and `let` when reassignment communicates changing state. `const` does not make an object immutable.

```javascript
const settings = {theme: 'light'}
settings.theme = 'dark' // allowed
// settings = {}        // TypeError-producing assignment to a constant binding
```

## Statements, expressions and state

An expression produces a value; a statement controls execution. `price * quantity` is an expression. `if`, `for` and `return` participate in statements. State is information that can change over time; mutation changes an existing value, while an immutable update creates another value.

```javascript
function addLine(cart, line) {
  return {...cart, lines: [...cart.lines, line]}
}
```

This pure function returns the same result for the same inputs and does not alter its arguments. Impure operations such as logging, storage, network access and clock reads are necessary, but isolate them at clear boundaries.

## Automatic semicolon insertion

ASI follows grammar rules, not visual intuition. A line break after `return`, `throw`, `break`, `continue`, `yield` or an async-arrow prefix can change meaning. Use consistent formatting and never place a returned expression on the next line after bare `return`.

## Strict mode and modules

Modules and class bodies are strict automatically. Strict mode rejects accidental globals, changes plain-function `this` to `undefined`, and makes several silent mistakes throw. New code should use modules rather than adding a redundant directive to every file.

## Common mistakes

- confusing binding immutability with object immutability;
- using `var` where block lifetime matters;
- creating hidden shared mutation through aliases;
- comparing objects as though structural equality were built in;
- reading a lexical binding before initialization.

## Practice

Trace the binding and object graph for two aliases, rewrite a mutating cart update immutably, and explain the declaration, initialization and assignment phases of `let total = 0`.

## Primary references

- [ECMA-262 lexical declarations](https://tc39.es/ecma262/#sec-let-and-const-declarations)
- [MDN grammar and types](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Grammar_and_types)
