---
title: Package Resolution, Exports and Imports
description: Resolution maps a module specifier to a file or package entry while export and import maps define intentional public and internal module boundaries.
---

# Package Resolution, Exports and Imports

## Concept

Resolution maps a module specifier to a file or package entry while export and import maps define intentional public and internal module boundaries.

## Why It Exists

Large codebases need stable package contracts, conditional entry points, and prevention of deep imports into implementation files.

## Mental Model

```mermaid
flowchart LR
  A["Import specifier"]
  B["Package exports"]
  C["Condition match"]
  D["Resolved module"]
  A --> B
  B --> C
  C --> D
```

Treat every arrow as a boundary with a cost, ownership rule, cancellation behavior, and failure mode. Node.js is effective when those boundaries are explicit instead of hidden behind framework defaults.

## How It Works

The JavaScript callback runs on the main JavaScript thread. Native Node.js bindings, libuv, the operating system, worker threads, child processes, or remote services may perform work elsewhere. Completion only becomes useful when control returns to JavaScript. Under load, the important questions are what is queued, what is bounded, what can be cancelled, and which resource saturates first.

## Example

```json
{
  "name": "@acme/orders",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./testing": "./dist/testing.js"
  },
  "imports": {
    "#config": "./dist/config.js"
  }
}
```

The example is intentionally small enough to execute, but the production boundary is the important part: validate inputs, establish a deadline, propagate cancellation, classify failures, and release resources deterministically.

## Production Use

Expose the smallest stable surface, use subpath exports for supported entry points, and reserve `#` imports for package-internal aliases.

## Security

Export maps reduce accidental access but do not provide secrecy. Never publish secrets or sensitive build artifacts.

## Performance

Complex condition trees increase install and debugging cost. Keep entry points small and tree-shakeable where consumers bundle code.

## Common Mistakes

- Using TypeScript path aliases that do not work at runtime.
- Breaking consumers by adding exports without auditing deep imports.
- Creating browser and Node conditions that expose different business semantics.

## Debugging

Use `import.meta.resolve`, package-manager diagnostics, and a minimal consumer project to reproduce resolution.

## Testing

Test every documented entry point from the built package, not directly from source.

## When Not to Use It

Do not add aliases merely to avoid healthy relative imports inside one small package.

## Interview Questions

- What problem does the exports field solve?
- Why do tsconfig paths fail at runtime?
- How do conditional exports affect package testing?

## Official References

- [nodejs.org](https://nodejs.org/api/)
- [nodejs.org](https://nodejs.org/en/about/previous-releases)
