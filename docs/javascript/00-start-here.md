---
title: 00 · Start Here
description: What JavaScript is, where it runs, standards ownership, strict mode, first programs, and how to use this handbook.
sidebar_position: 4
id: 00-start-here
---

# 00 · Start Here

## 00 · Start Here

> **Language lens:** default authority is ECMA-262; runtime/browser support notes are implementation questions, not changes to semantics.

JavaScript is an implementation of the ECMAScript language running inside a host. The language defines syntax and semantics; engines implement those semantics; hosts such as browsers and Node.js add capabilities like DOM, timers, networking, files, and consoles.

### Mental model / experiment

```js
// Browser console or Node REPL
const languageValue = [1, 2, 3].map(x => x * 2)
console.log(languageValue)
// `document` may exist in a browser host; `process` may exist in Node.
```

### Coverage map

| Topic | Working model |
| --- | --- |
| what JavaScript is | core start here concept; understand its syntax/API, observable semantics, edge cases, and where it belongs in the language/runtime stack |
| ECMAScript vs JavaScript | core start here concept; understand its syntax/API, observable semantics, edge cases, and where it belongs in the language/runtime stack |
| JavaScript vs Java | core start here concept; understand its syntax/API, observable semantics, edge cases, and where it belongs in the language/runtime stack |
| browser JavaScript vs Node.js JavaScript | host/Web API behavior; document ownership by the web platform separately from ECMAScript language semantics |
| language vs engine vs runtime vs host API | core start here concept; understand its syntax/API, observable semantics, edge cases, and where it belongs in the language/runtime stack |
| what ECMA-262 is | core start here concept; understand its syntax/API, observable semantics, edge cases, and where it belongs in the language/runtime stack |
| TC39 | core start here concept; understand its syntax/API, observable semantics, edge cases, and where it belongs in the language/runtime stack |
| annual ECMAScript editions | core start here concept; understand its syntax/API, observable semantics, edge cases, and where it belongs in the language/runtime stack |
| current ECMAScript baseline | core start here concept; understand its syntax/API, observable semantics, edge cases, and where it belongs in the language/runtime stack |
| how to use the handbook | core start here concept; understand its syntax/API, observable semantics, edge cases, and where it belongs in the language/runtime stack |
| learning path | core start here concept; understand its syntax/API, observable semantics, edge cases, and where it belongs in the language/runtime stack |
| prerequisites | core start here concept; understand its syntax/API, observable semantics, edge cases, and where it belongs in the language/runtime stack |
| running JS in browser DevTools | host/Web API behavior; document ownership by the web platform separately from ECMAScript language semantics |
| running JS in Node for experimentation | core start here concept; understand its syntax/API, observable semantics, edge cases, and where it belongs in the language/runtime stack |
| strict mode | core start here concept; understand its syntax/API, observable semantics, edge cases, and where it belongs in the language/runtime stack |
| first program | core start here concept; understand its syntax/API, observable semantics, edge cases, and where it belongs in the language/runtime stack |

### Common mistakes and edge cases

Avoid collapsing syntax, observable semantics, implementation behavior, and host/tooling behavior into one explanation. Identify which layer owns the rule.

When an example surprises you, write down the operand values, the exact operation being performed, and the next observable step. That habit scales from beginner bugs to specification reading.

### Performance, security, and compatibility

- **Performance:** Measure impact before optimizing. Prefer algorithmic wins and fewer unnecessary allocations/host transitions; engine-specific micro-optimizations require evidence.
- **Security:** At trust boundaries, validate inputs and avoid dynamic code/property/HTML behaviors that expand attacker control. The exact risk depends on whether this concept can execute code, mutate shared state, or cross a host boundary.
- **Compatibility:** Check target-runtime support for recently standardized APIs. A feature can be in the standard while a deployed engine still lacks it; syntax and built-ins require different compatibility strategies.

### Senior reasoning

A senior answer should identify the **language rule**, the **host/runtime behavior**, and the **application contract** separately. Ask what is guaranteed, what is implementation-defined or version-sensitive, and which failure/cancellation/cleanup behavior a caller can observe.

**Interview prompts**

1. What common explanation of **Start Here** is technically incomplete, and what model would you use instead?
2. How would you prove a production bug involving **Start Here** without relying on assumptions about one engine?

### Run JavaScript in a browser

Open DevTools → Console and evaluate tiny expressions. For multi-line experiments, use a snippet or an HTML module script:

```html
<script type="module">
  const message = "hello"
  console.log(message)
</script>
```

Module code is strict by definition and gives you ESM semantics.

### Run JavaScript in Node

Use the Node REPL for experiments:

```bash
node
```

Or save an ESM file:

```js
// experiment.mjs
console.log(globalThis)
```

and run `node experiment.mjs`. Host globals differ from browsers; that difference is a feature of the host boundary.

### First debugging habit

Before asking “why is JavaScript weird?”, classify the behavior:

1. **Grammar/semantics** — ECMA-262.
2. **Engine implementation** — V8/SpiderMonkey/JavaScriptCore detail.
3. **Host behavior** — HTML event loop, DOM, Node runtime, etc.
4. **Tooling** — Babel, bundler, linter, framework.
5. **Application code** — your own contract and state.

That classification prevents most category errors in advanced JavaScript discussions.
