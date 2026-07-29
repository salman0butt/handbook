---
title: Modules — ESM & CommonJS
---

# Modules — ESM & CommonJS

Node supports two module systems. **ESM** is the JavaScript standard module format; **CommonJS (CJS)** is Node's historic format. Production systems often interact with both.

## Explicit semantics

Use explicit package semantics instead of relying on 🧪 release-candidate syntax detection.

```json
{ "type": "module" }
```

- `.mjs` is always ESM.
- `.cjs` is always CommonJS.
- `.js` follows the nearest controlling `package.json` `type`.

### ESM

```js
import { readFile } from 'node:fs/promises';
export function parseOrder() {}

const plugin = await import('./plugin.js');
console.log(import.meta.url);
console.log(import.meta.dirname); // stable on current supported lines where documented
```

ESM supports static analysis, live bindings, top-level `await`, URL-based identity, and asynchronous loading behavior.

### CommonJS

```js
const fs = require('node:fs');
module.exports = { load };
```

CJS modules execute inside Node's wrapper and historically expose `require`, `module`, `exports`, `__dirname`, and `__filename`.

## `exports` is not `module.exports`

`exports` initially references `module.exports`.

```js
exports.load = load;          // works
exports = { load };           // only reassigns local variable; does not export
module.exports = { load };    // replaces exported value
```

## Resolution and package contracts

`exports` defines a public package surface and can provide conditional entry points. `imports` defines package-internal `#` aliases.

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./errors": "./dist/errors.js"
  },
  "imports": {
    "#config": "./src/config.js"
  }
}
```

Conditional exports are an API contract. Changing a condition or hiding a formerly deep-importable file can be breaking.

## Evaluation and caching

A resolved module is generally evaluated once per relevant module-loader cache identity. Caching can create implicit singleton state. Tests that depend on re-evaluation should prefer dependency injection or isolated processes rather than cache mutation.

## Circular dependencies

Cycles expose partially initialized modules or temporal-ordering problems. ESM live bindings make cycles possible but not automatically safe. If two domain modules need each other at initialization time, the architecture probably lacks a clean dependency direction.

## Interop

Dynamic `import()` works from both systems. Modern Node can support several interop paths, but the exact edge cases evolve. Test the package formats you publish rather than assuming named/default export behavior.

## Dual-package hazard

If CJS and ESM entry points create separate instances, stateful packages may be loaded twice. Prefer a single implementation with controlled wrappers or clearly documented stateless behavior.

## Migration strategy

1. make file semantics explicit;
2. remove reliance on CJS-only globals or recreate paths with `import.meta`;
3. convert leaf modules first;
4. replace dynamic `require` patterns;
5. test CLI, tests, workers, loaders, and package consumers;
6. update public exports deliberately.
