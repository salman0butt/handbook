---
title: Code Quality and Tooling
description: Project structure, JSDoc, linting, formatting, bundling, transpilation and CI quality gates.
---

# Code Quality and Tooling

Tools automate policy; they do not replace design judgment. Adopt the smallest pipeline that enforces the compatibility, correctness and delivery constraints of the project.

## Readability and structure

Organize by stable domain or feature boundaries rather than one global folder per technical type. Keep public module APIs small, name operations by intent, and document **why** a non-obvious constraint exists. Comments that repeat syntax become stale.

JSDoc can describe contracts and enable editor/static checking for JavaScript projects.

```javascript
/**
 * @param {{price: number, quantity: number}[]} lines
 * @returns {number}
 */
export function subtotal(lines) {
  return lines.reduce((sum, line) => sum + line.price * line.quantity, 0)
}
```

Use `// @ts-check` or a checked `jsconfig/tsconfig` when type analysis adds value, while keeping JavaScript examples free of TypeScript-only syntax.

## Linting and formatting

ESLint finds configurable correctness, security and maintainability issues. Prettier produces consistent formatting. Keep lint rules explainable, pin versions, and remove rules that generate routine suppression without catching meaningful defects.

EditorConfig coordinates whitespace basics across editors. Git hooks can provide fast feedback, but CI remains authoritative because local hooks can be skipped.

## Build tools

| Tool family | Purpose |
|---|---|
| Babel / SWC | syntax transforms and selected compatibility transforms |
| esbuild / SWC | fast transforms and bundling workflows |
| Rollup | library/application bundling with strong ESM graph behavior |
| Vite | development server plus production build integration |
| Webpack | highly configurable module graph and asset pipeline |

A transpiler can transform syntax, but it does not automatically provide missing built-ins or host APIs. Polyfill deliberately and avoid globally patching environments without an explicit support policy.

## Modules and source maps

Preserve ESM where consumers benefit from static analysis. Configure package exports rather than exposing internal paths. Source maps improve debugging but can expose source and paths; decide whether they are public, private or uploaded only to error monitoring.

## Compatibility targets

Browserslist and runtime matrices encode deployment targets. Test parsing, built-ins and Web APIs separately. Differential builds can reduce legacy cost but add operational complexity.

## Dependency hygiene

Remove unused packages, distinguish runtime from development dependencies, commit lockfiles for applications, review install scripts and licenses, and automate updates with tests. Dead-code detection and bundle analysis help expose accidental dependencies.

## CI gates

A production pipeline commonly runs clean dependency installation, formatting/lint checks, static analysis, unit/integration tests, Mermaid/document validators, security checks and the Docusaurus or application build.

```mermaid
flowchart LR
  C["Commit"] --> L["Lint / static checks"]
  L --> T["Tests"]
  T --> B["Production build"]
  B --> A["Artifact / deploy"]
```

Do not disable a failing gate to ship. Fix the source, or change the policy transparently with evidence and review.

## Primary references

- [ESLint](https://eslint.org/docs/latest/)
- [Prettier](https://prettier.io/docs/)
- [Babel](https://babeljs.io/docs/)
- [Vite](https://vite.dev/guide/)
