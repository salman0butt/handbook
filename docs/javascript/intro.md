---
title: JavaScript Developer Handbook
description: JavaScript from first principles and ECMAScript semantics to browser engineering, performance, security, architecture, specifications, projects, and interviews.
slug: /javascript/intro
sidebar_position: 1
id: intro
---

# JavaScript Developer Handbook

JavaScript is not “the DOM”, not “Node”, and not a bundle of framework conventions. This handbook teaches the language and the systems around it as separate layers:

```text
application
    ↓
ECMAScript language (ECMA-262)
    ↓
JavaScript engine
    ↓
host environment
    ↓
Web APIs / Node APIs / other host capabilities
    ↓
OS, browser, runtime and external systems
```

**Baseline checked: 30 July 2026 (Asia/Karachi).** The published language snapshot is **ECMAScript 2026 / ECMA-262 17th edition**. The TC39 living specification is already the **ECMAScript 2027 draft** and includes finished Stage-4 work after the 2026 annual snapshot. Status labels in this handbook keep those two facts separate.

## Status legend

- ✅ **standardized and broadly usable** — in an annual standard and mature across common targets
- ✅ **standardized; support still limited** — standard semantics exist, but target compatibility still matters
- 🆕 **Stage 4 / finished** — complete and entering/in the living draft after the annual snapshot
- 🧪 **Stage 3 proposal** — implementation feedback stage; not stable production-standard JavaScript
- ⚠️ **legacy / Annex B / discouraged** — compatibility behavior, not a modern default
- ⛔ **obsolete / deprecated / non-standard** — avoid unless maintaining legacy code

## The rule you should keep repeating

```text
ECMAScript owns               host owns
---------------------------   ----------------------------
Array, Object, Promise        DOM
Map, Set, Symbol              fetch / Request / Response
functions, classes, modules   setTimeout / requestAnimationFrame
language Jobs                 localStorage / IndexedDB
coercion / equality           browser tasks / rendering
```

Node.js is another host/runtime with its own APIs (`fs`, `process`, `Buffer`, streams, HTTP, worker_threads, and more). Cross-links point to the existing Node.js and TypeScript handbooks when those topics would otherwise be duplicated.

## Learning path

```text
programming beginner / basic JS developer
        ↓
language foundations
        ↓
functions, scope, objects and prototypes
        ↓
built-ins, iteration and async
        ↓
browser JavaScript engineering
        ↓
performance, debugging and security
        ↓
language internals and specification reasoning
        ↓
senior / staff architecture
        ↓
projects + interview mastery
```

Start with [00 · Start Here](./00-start-here.md), then follow the sidebar. If you already work with JavaScript, use the coverage/reference pages to identify gaps and jump directly to the relevant range.

## Primary research sources

Semantics are cross-checked against ECMA-262 and the TC39 living specification. Internationalization uses ECMA-402. MDN is the primary practical reference for JavaScript and browser-host APIs. W3Schools is used only as a curriculum-coverage checklist; where it conflicts with ECMA-262/TC39, the specification wins.

- ECMA-262: <https://tc39.es/ecma262/>
- ECMA-262 2026 snapshot: <https://tc39.es/ecma262/2026/>
- TC39 process: <https://tc39.es/process-document/>
- TC39 proposals: <https://github.com/tc39/proposals>
- ECMA-402: <https://tc39.es/ecma402/>
- MDN JavaScript: <https://developer.mozilla.org/docs/Web/JavaScript>
