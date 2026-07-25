---
title: React Version Covered
description: React version, verification date, recent releases, upgrade notes, and versioning policy for this handbook.
sidebar_position: 2
---

# React version covered by this handbook

> **Docs target: React 19.2**  
> **Latest stable package verified: React 19.2.8**  
> **Last verified: 2026-07-26**

This handbook teaches the current stable React 19.2 documentation line and checks the latest stable `react` / `react-dom` package patch separately.

React's documentation is maintained at the major/minor level, while npm can publish newer patch releases containing fixes. That means the two useful version numbers are:

```text
React documentation line: 19.2
             ↓
Latest stable npm patch: 19.2.8
```

A newer Canary or Experimental build is **not** treated as stable production React.

## Current status

| Item | Verified value | Meaning |
| --- | --- | --- |
| Official docs | React 19.2 | Current stable documentation line on react.dev |
| `react` npm package | 19.2.8 | Latest stable npm tag checked on 2026-07-26 |
| `react-dom` npm package | 19.2.8 | Latest stable npm tag checked on 2026-07-26 |
| React Compiler | 1.0 stable | Stable production release announced 2025-10-07 |
| Next/Canary line | 19.3 Canary exists | Do not teach Canary APIs as stable |

## Important recent releases

### React 19 — December 2024

React 19 introduced major modern features including Actions, `useActionState`, `useOptimistic`, `use`, form Actions, improved document metadata handling, resource loading improvements, `ref` as a prop, and the modern Context provider syntax.

It also removed a number of APIs that had already been deprecated for years.

### React 19.1 — 2025

React 19.1 continued the React 19 release line with fixes and platform improvements. Patch releases for 19.1 can exist for backport scenarios, but this handbook targets the latest 19.2 line.

### React 19.2 — October 2025

React 19.2 added important stable capabilities including:

- `<Activity>`;
- `useEffectEvent`;
- `cacheSignal` for React Server Components;
- React Performance Tracks;
- React DOM partial pre-rendering capabilities;
- Suspense/SSR improvements;
- Web Streams-related server rendering improvements;
- newer `eslint-plugin-react-hooks` behavior and compiler-aware linting support.

### React 19.2.8 — July 2026

`19.2.8` is the latest stable `react` and `react-dom` package patch verified for this handbook on 2026-07-26.

A patch release does not create a new handbook curriculum line by itself. The handbook continues to target the stable **19.2 API/documentation line**, while recording the newest stable package patch for reproducibility and maintenance.

Patch releases should normally be preferred over older patches in the same stable minor because they contain fixes without intentionally introducing a new public API minor line.

## Stable, Canary, Experimental, and Legacy

This handbook uses four labels.

### STABLE

Safe to teach as part of the current public React contract, subject to React's versioning policy.

### CANARY

Available in React's Canary channel. Canary features may be used by frameworks that pin React versions, but they are not automatically considered stable application APIs.

### EXPERIMENTAL

Research or preview functionality that can change significantly. Experimental APIs must never be presented here as guaranteed production contracts.

### LEGACY

Old APIs that matter for maintenance, migration, or interviews, but are not the recommended way to write new React code.

## Important React 19 removals and migrations

React 19 removed several deprecated APIs. When maintaining older code, prefer the modern replacement.

| Removed / legacy approach | Modern direction |
| --- | --- |
| `ReactDOM.render` | `createRoot` from `react-dom/client` |
| `ReactDOM.hydrate` | `hydrateRoot` |
| `ReactDOM.unmountComponentAtNode` | `root.unmount()` |
| `ReactDOM.findDOMNode` | DOM refs |
| string refs | callback refs / ref objects |
| legacy Context with `contextTypes` / `getChildContext` | `createContext` and modern Context |
| function component `defaultProps` | JavaScript default parameters |
| function component `propTypes` checks in React | TypeScript or another deliberate runtime validation strategy |
| `react-dom/test-utils` `act` | `act` from `react` |

The handbook will cover legacy APIs in a dedicated maintenance section instead of mixing them into beginner guidance.

## React 19 ref guidance

React 19 supports receiving `ref` as a prop in function components. As a result, `forwardRef` should not be introduced to beginners as the default pattern for new React 19 code.

It remains important maintenance knowledge because many existing libraries and applications were built before React 19.

## React Compiler status

React Compiler 1.0 became stable on 2025-10-07.

The compiler is a build-time optimizer that can automatically memoize React components and values. This changes how senior engineers should think about manual `useMemo`, `useCallback`, and `memo` usage:

```text
measure the problem
      ↓
write correct React code
      ↓
let compiler/tooling optimize where applicable
      ↓
use manual memoization when it provides necessary control
```

Manual memoization is not obsolete, but it should not be taught as a ritual applied everywhere.

## How this handbook handles version-specific material

1. Current stable React is taught first.
2. Recently introduced features receive a version badge such as **React 19+** or **React 19.2+**.
3. Canary and Experimental features are explicitly labelled.
4. Removed APIs are documented only for migration and maintenance.
5. Framework-specific behavior is separated from React core behavior.
6. Implementation details are not presented as stable public contracts.
7. Major/minor documentation targets and npm patch versions are tracked separately.

## Upgrade checklist

When React changes, update this page before changing the rest of the handbook:

```text
Check react.dev/versions
        ↓
Check react.dev/blog release notes
        ↓
Check latest npm react + react-dom patch
        ↓
Audit React reference inventory
        ↓
Audit React DOM reference inventory
        ↓
Review removed/deprecated APIs
        ↓
Update version badges and examples
        ↓
Build Docusaurus and repair links
```

## References

- https://react.dev/versions
- https://react.dev/blog
- https://react.dev/blog/2025/10/01/react-19-2
- https://react.dev/blog/2025/10/07/react-compiler-1
- https://react.dev/blog/2024/12/05/react-19
- https://react.dev/blog/2024/04/25/react-19-upgrade-guide
- https://react.dev/community/versioning-policy
- https://www.npmjs.com/package/react
- https://www.npmjs.com/package/react-dom

## Next

Continue with the **[React learning roadmap](./roadmap.md)**.