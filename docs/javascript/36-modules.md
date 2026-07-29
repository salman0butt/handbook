---
title: 36 — Modules
---

# 36 — Modules

ECMAScript modules (ESM) are a language-level module system with a statically analyzable dependency graph, lexical module environments, live bindings, strict semantics, and asynchronous-capable evaluation.

```js
// math.js
export const pi = Math.PI;
export function area(r) {
  return pi * r ** 2;
}

// app.js
import {area} from './math.js';
console.log(area(3));
```

## Script vs module

Modules:

- are always strict,
- have module-scoped top-level declarations,
- support `import`/`export`,
- have top-level `this === undefined`,
- participate in module loading/linking/evaluation,
- can use top-level `await`.

Classic scripts have different global declaration behavior and cannot use static import/export syntax.

## Exports

```js
export const value = 1;
export function run() {}
export {helper as publicHelper};
export default function main() {}
```

A default export is not “the module object.” It is one distinguished export name `default`.

Re-exports:

```js
export {parse, format} from './format.js';
export * from './shared.js';
export {default as Client} from './client.js';
```

## Imports and live bindings

```js
// counter.js
export let count = 0;
export function increment() { count++; }

// app.js
import {count, increment} from './counter.js';
console.log(count); // 0
increment();
console.log(count); // 1
```

`count` is a **live binding**, not a copied variable snapshot. The importing module cannot reassign the imported binding, but observes updates performed by the exporting module.

```text
counter module binding: count
          ↑ live import reference
app module import: count
```

## Namespace imports

```js
import * as math from './math.js';
math.area(3);
```

`math` is a module namespace exotic object with special semantics exposing exported bindings. Do not treat it as a mutable ordinary object.

## Static module graph

Static imports are discovered from syntax before evaluation, allowing hosts/tooling to resolve, link, preload, analyze, and optimize the graph.

```text
entry
 ├── module A
 │    └── module C
 └── module B
      └── module C
```

Module C is not normally evaluated twice just because two modules import it; module records are instantiated/evaluated according to the host's module graph/loading identity rules.

## Cycles

```js
// a.js
import {b} from './b.js';
export const a = 'A';

// b.js
import {a} from './a.js';
export const b = a + 'B'; // may hit uninitialized binding depending on evaluation order
```

Cycles are legal, but live bindings and initialization order matter. A cyclic module can observe another exported binding while it is still uninitialized and trigger `ReferenceError`. Fix architecture by reducing cycles, exporting functions/lazy access rather than eagerly reading, or introducing a lower-level shared module.

## Dynamic import

```js
const module = await import('./feature.js');
module.run();
```

`import()` is an expression-like dynamic loading facility returning a Promise for the module namespace. Host resolution/loading still matters.

Use it for lazy features, optional adapters, or runtime-chosen modules—not to hide poorly structured dependencies.

## Top-level await

```js
const config = await fetch('/config.json').then(r => r.json()); // fetch is host API
export {config};
```

A module using top-level await becomes asynchronously evaluated and can delay dependent modules. This affects the entire module graph. Prefer explicit initialization if startup order/latency needs to stay under application control.

## Import attributes

Modern ECMAScript includes standardized import-attributes syntax for attaching host-consumed attributes to module requests. The language defines the syntax/records; the host decides supported module types and attribute meanings.

```js
// Example form; actual supported types depend on host/tooling.
import data from './data.json' with {type: 'json'};
```

Do not infer that because syntax is standardized every browser, Node version, bundler, and content type supports the same behavior. Check targets.

## Browser module loading: host boundary

```html
<script type="module" src="/app.js"></script>
```

`<script type="module">`, URL resolution, fetching, MIME handling, credentials, module maps/import maps, CSP, and caching are browser/HTML/Fetch concerns around ECMAScript module semantics.

## ESM and tooling

Bundlers can statically analyze ESM to split chunks or tree-shake unused exports, but tree shaking is a tooling optimization, not an ECMAScript execution guarantee. Module side effects, dynamic access, package metadata, and bundler configuration affect results.

## Senior module design

Use modules as ownership boundaries:

```text
feature public API
  ↓
domain logic
  ↓
infrastructure adapters
```

Keep internal modules private to a feature. Avoid giant shared utility buckets and bidirectional dependencies. Prefer dependencies pointing toward stable abstractions/domain contracts.

## Interview checks

1. Why are imports live bindings rather than copied values?
2. Why can module cycles throw TDZ-like errors?
3. Is `import()` the same as static import at evaluation time?
4. Which part of browser module loading belongs to ECMAScript vs the host?
5. What risk does top-level await introduce to a dependency graph?

Related: [Bindings](./02-variables-and-declarations.md), [Application architecture](./architecture-and-production.md#78--modules-and-application-architecture), [Specification internals](./internals-and-specification.md).
