---
title: CommonJS and ES Modules
description: Node supports CommonJS and ES Modules with different loading semantics, file markers, interop rules, cache behavior, and package contracts.
---

# CommonJS and ES Modules

## Concept

Node supports CommonJS and ES Modules with different loading semantics, file markers, interop rules, cache behavior, and package contracts.

## Why It Exists

Modern applications frequently depend on packages from both systems. Explicit module boundaries prevent ambiguous loading and dual-package bugs.

## Mental Model

```mermaid
flowchart LR
  A["Specifier"]
  B["Package type and extension"]
  C["Resolver and loader"]
  D["Module namespace"]
  A --> B
  B --> C
  C --> D
```

Treat every arrow as a boundary with a cost, ownership rule, cancellation behavior, and failure mode. Node.js is effective when those boundaries are explicit instead of hidden behind framework defaults.

## How It Works

The JavaScript callback runs on the main JavaScript thread. Native Node.js bindings, libuv, the operating system, worker threads, child processes, or remote services may perform work elsewhere. Completion only becomes useful when control returns to JavaScript. Under load, the important questions are what is queued, what is bounded, what can be cancelled, and which resource saturates first.

## Example

```js
// package.json: { "type": "module" }
import { readFile } from 'node:fs/promises';

export async function readText(url) {
  return readFile(url, 'utf8');
}

if (import.meta.main) {
  console.log(await readText(new URL(import.meta.url)));
}
```

The example is intentionally small enough to execute, but the production boundary is the important part: validate inputs, establish a deadline, propagate cancellation, classify failures, and release resources deterministically.

## Production Use

Prefer explicit ESM for new applications and packages when dependencies support it, but keep CommonJS where the ecosystem or host contract requires it. Publish a deliberate package API.

## Security

Package exports can prevent accidental access to internal files. Avoid executing untrusted modules in-process; a module system is not a sandbox.

## Performance

Both systems cache modules. Top-level work affects startup time and may retain memory for the process lifetime.

## Common Mistakes

- Mixing `require` and `import` without understanding interop.
- Omitting `type` and depending on syntax detection.
- Publishing internal paths as accidental public APIs.

## Debugging

Inspect `package.json`, file extensions, export maps, resolved URLs, and the exact consuming environment.

## Testing

Test package imports from ESM and CommonJS consumers when both are supported; test subpath and condition resolution.

## When Not to Use It

Do not publish a dual package unless the compatibility benefit justifies two execution identities and a larger test matrix.

## Interview Questions

- How does Node decide whether `.js` is ESM or CommonJS?
- What is the dual-package hazard?
- Why use the `node:` protocol?

## Official References

- [nodejs.org](https://nodejs.org/api/esm.html)
- [nodejs.org](https://nodejs.org/api/modules.html)
- [nodejs.org](https://nodejs.org/api/packages.html)
