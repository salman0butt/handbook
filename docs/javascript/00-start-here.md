---
title: 00 — Start Here
---

# 00 — Start Here

JavaScript is the commonly used name for implementations of the **ECMAScript language** plus the capabilities supplied by a host environment. ECMA-262 specifies the core language; browser and server runtimes embed an engine and expose additional APIs.

```text
source code
   ↓ parser
JavaScript engine
   ↓
ECMAScript semantics
   ↓
host environment APIs
   ↓
observable application behavior
```

## JavaScript, ECMAScript, engine, host

- **ECMAScript**: standardized syntax, semantics, built-ins, execution models, modules, promises, collections, and more.
- **JavaScript engine**: implementation of ECMAScript, such as V8, SpiderMonkey, or JavaScriptCore.
- **Host environment**: browser, Node.js, embedded shell, etc. It decides how code is loaded and what host APIs exist.
- **Application**: your code using both language facilities and host capabilities.

JavaScript is unrelated to Java beyond historical naming. JavaScript is dynamically typed, prototype-based, garbage-collected, and standardized through ECMA-262. Java uses a different language/runtime model.

## ECMA-262 and TC39

ECMA-262 is the normative ECMAScript language specification. TC39 evolves it through proposals and publishes annual editions. This handbook starts from **ECMAScript 2026 / ECMA-262 17th edition** and separately labels newer finished proposals, proposals still in progress, legacy features, and host APIs.

## Browser vs Node

```js
// ECMAScript in both environments
const values = [1, 2, 3].map(x => x * 2);
Promise.resolve(values);

// Browser host API
window.addEventListener('click', () => {});

// Node.js host API
// import {readFile} from 'node:fs/promises';
```

`fetch`, `console`, timers, DOM, and storage are not guaranteed by ECMA-262. A runtime may choose to expose APIs with those names.

## Run experiments

In a browser, use DevTools Console and Sources. In Node.js, use a recent supported release and run `node file.js` or the REPL. Prefer modules for modern code when module semantics are desired.

## Strict mode

Modules and class bodies are strict automatically. Classic scripts can request strict mode:

```js
'use strict';

function demo() {
  // accidental assignment to an undeclared identifier throws
}
```

Strict mode removes or changes several legacy behaviors and makes many mistakes fail earlier.

## First program

```js
function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet('JavaScript'));
```

The function, string/template literal, call expression, and return semantics are ECMAScript. `console` is supplied by the host.

## How to use this handbook

Read sequentially through foundations, functions/scope, objects/prototypes, built-ins, iteration, async JavaScript, modules, browser engineering, internals, and architecture. Then build the projects and use the interview tracks for recall and production reasoning.
