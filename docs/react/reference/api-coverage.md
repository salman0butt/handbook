---
title: Official React API Coverage
description: React 19.2 coverage checklist for the handbook across React, React DOM, Compiler, Server Components, and legacy APIs.
sidebar_position: 1
---

# Official React API coverage

> **Reference line: React 19.2**  
> **Latest stable package checked: 19.2.8**  
> **Audit date: 2026-07-26**

This page is the handbook's coverage contract. The curriculum should not become a collection of favourite topics while silently missing official React APIs.

Statuses:

- ✅ **Covered** — a dedicated or substantial handbook explanation exists;
- 🟠 **Foundation covered** — the API is explained correctly, with a later specialist chapter still planned;
- 🟡 **Planned** — not yet written to the handbook quality bar;
- ⚠️ **Legacy** — maintenance/migration knowledge, not a modern recommendation;
- 🧪 **Experimental/Canary** — not treated as stable production React.

The official React documentation is authoritative. Stable npm package versions are checked independently because patch releases can appear before the React versions page is refreshed.

## Curriculum coverage so far

The handbook now covers the complete path from React fundamentals through modern rendering architecture, Server Components, and React Compiler:

- React rendering, JSX, components, props, events, state, lists, forms, and keys;
- Effects, refs, custom Hooks, Context, reducers, and state architecture;
- React 19 Actions, `useActionState`, `useFormStatus`, `useOptimistic`, `use`, and `<Activity>`;
- Suspense, code splitting, Transitions, deferred rendering, and concurrent rendering;
- React DOM escape hatches, hydration, streaming SSR, static rendering, resume/PPR architecture;
- Server Components, Server Functions, `'use client'`, `'use server'`, `cache`, and `cacheSignal`;
- React Compiler 1.0, automatic memoization, adoption modes, directives, library compilation, diagnostics, and production rollout;
- dedicated Rules of React coverage for purity, immutability, render safety, Hook ordering, static component identity, refs, and compiler-aware ESLint.

## React Hooks

| API | Handbook coverage | Status | Version |
| --- | --- | --- | --- |
| `useActionState` | Modern React 19+ | ✅ Covered | 19+ |
| `useCallback` | Compiler automatic/manual memoization | 🟠 Foundation covered; performance deep dive planned | Stable |
| `useContext` | Context section | ✅ Covered | Stable |
| `useDebugValue` | Hook debugging | 🟡 Planned | Stable |
| `useDeferredValue` | Concurrency section | ✅ Covered | Stable |
| `useEffect` | Effects section | ✅ Covered | Stable |
| `useEffectEvent` | useEffectEvent | ✅ Covered | 19.2+ |
| `useId` | Accessibility / Hook reference | 🟡 Planned | Stable |
| `useImperativeHandle` | Refs section | ✅ Covered | Stable |
| `useInsertionEffect` | Layout & insertion effects | 🟡 Planned | Stable |
| `useLayoutEffect` | Layout & insertion effects | 🟡 Planned | Stable |
| `useMemo` | Compiler automatic/manual memoization | 🟠 Foundation covered; performance deep dive planned | Stable |
| `useOptimistic` | Modern React 19+ | ✅ Covered | 19+ |
| `useReducer` | Reducers | ✅ Covered | Stable |
| `useRef` | Refs section | ✅ Covered | Stable |
| `useState` | State section | ✅ Covered | Stable |
| `useSyncExternalStore` | State Architecture | ✅ Covered | Stable |
| `useTransition` | Concurrency section | ✅ Covered | Stable |

## Built-in React components

| API | Handbook coverage | Status |
| --- | --- | --- |
| `<Fragment>` | JSX | ✅ Covered |
| `<Profiler>` | Performance | 🟡 Planned |
| `<StrictMode>` | Getting Started / Rules | ✅ Covered |
| `<Suspense>` | Suspense section | ✅ Covered |
| `<Activity>` | Modern React 19+ | ✅ Covered — 19.2+ |

## React APIs

| API | Handbook coverage | Status |
| --- | --- | --- |
| `createContext` | Context | ✅ Covered |
| `lazy` | Suspense / code splitting | ✅ Covered |
| `memo` | Compiler automatic/manual memoization | 🟠 Foundation covered; performance deep dive planned |
| `startTransition` | Concurrency | ✅ Covered |
| `act` | Testing | 🟡 Planned |
| `use` | Modern React + Suspense + Server Components | ✅ Covered |
| `cache` | Server Components | ✅ Covered |
| `cacheSignal` | Server Components | ✅ Covered — 19.2+ |
| `captureOwnerStack` | Debugging | 🟡 Planned |

## React Server Component directives

| Directive | Handbook coverage | Status |
| --- | --- | --- |
| `'use client'` | Server Components and Client Boundaries | ✅ Covered |
| `'use server'` | Server Functions and Mutation Boundaries | ✅ Covered |

These directives require an RSC-compatible framework/bundler environment. A normal client-only Vite app does not provide complete RSC infrastructure.

## React DOM Hook

| API | Handbook coverage | Status |
| --- | --- | --- |
| `useFormStatus` | Modern React forms | ✅ Covered — 19+ |

## React DOM components

| Area | Handbook coverage | Status |
| --- | --- | --- |
| HTML components in JSX | JSX / Forms / React DOM | ✅ Covered |
| event props and propagation | Events | ✅ Covered |
| native forms and controls | Forms | ✅ Covered |
| DOM refs / callback refs | Refs | ✅ Covered |
| `<title>` / `<meta>` / `<link>` | Metadata and Resource Loading | ✅ Covered |
| `<style>` / `<script>` special behavior | Metadata and Resource Loading | ✅ Covered |
| SVG behavior and accessibility | React DOM Components | ✅ Covered |
| custom elements / Web Components | React DOM Components | ✅ Covered |
| `dangerouslySetInnerHTML` | React DOM Components | ✅ Covered |
| `contentEditable` ownership caveats | React DOM Components | ✅ Covered |
| `suppressHydrationWarning` | Hydration / React DOM | ✅ Covered |

## React DOM APIs

| API | Handbook coverage | Status |
| --- | --- | --- |
| `createPortal` | React DOM escape hatches | ✅ Covered |
| `flushSync` | React DOM escape hatches | ✅ Covered |
| `prefetchDNS` | Metadata and Resource Loading | ✅ Covered |
| `preconnect` | Metadata and Resource Loading | ✅ Covered |
| `preload` | Metadata and Resource Loading | ✅ Covered |
| `preloadModule` | Metadata and Resource Loading | ✅ Covered |
| `preinit` | Metadata and Resource Loading | ✅ Covered |
| `preinitModule` | Metadata and Resource Loading | ✅ Covered |

## React DOM client APIs

| API | Handbook coverage | Status |
| --- | --- | --- |
| `createRoot` | Rendering a React Application | ✅ Covered |
| `root.render()` | Rendering a React Application | ✅ Covered |
| `root.unmount()` | Rendering / Hydration | ✅ Covered |
| `hydrateRoot` | Hydration and hydrateRoot | ✅ Covered |

## React DOM server APIs

| API | Handbook coverage | Status |
| --- | --- | --- |
| `renderToReadableStream` | Streaming SSR | ✅ Covered |
| `renderToPipeableStream` | Streaming SSR | ✅ Covered |
| `resume` | Static Rendering / PPR | ✅ Covered |
| `resumeToPipeableStream` | Static Rendering / PPR | ✅ Covered |
| `renderToString` | Static Rendering / limitations | ✅ Covered — limited path |
| `renderToStaticMarkup` | Static Rendering | ✅ Covered — non-interactive output |

## React DOM static APIs

| API | Handbook coverage | Status |
| --- | --- | --- |
| `prerender` | Static Rendering / PPR | ✅ Covered |
| `prerenderToNodeStream` | Static Rendering / PPR | ✅ Covered |
| `resumeAndPrerender` | PPR architecture | 🧪 Experimental — architecture covered |
| `resumeAndPrerenderToNodeStream` | PPR architecture | 🧪 Experimental — architecture covered |

## Server Components / Server Functions

| Area | Handbook coverage | Status |
| --- | --- | --- |
| Server Components mental model | Server Components and Client Boundaries | ✅ Covered |
| RSC vs SSR | Server Components and Client Boundaries | ✅ Covered |
| async Server Components | Server Components and Client Boundaries | ✅ Covered |
| serializable client-boundary props | Server Components and Client Boundaries | ✅ Covered |
| Promise handoff to Client Components | Server Components and Client Boundaries | ✅ Covered |
| Server Functions | Server Functions and Mutation Boundaries | ✅ Covered |
| mutation security / authorization | Server Functions and Mutation Boundaries | ✅ Covered |
| RSC request memoization | cache and cacheSignal | ✅ Covered |
| RSC cancellation lifetime | cache and cacheSignal | ✅ Covered |

The application-facing Server Component model is stable in React 19, but framework/bundler implementation APIs beneath RSC do not share the same minor-version compatibility guarantee. Prefer framework-supported integrations.

## React Compiler

React Compiler 1.0 is stable. The handbook now treats it as a first-class modern React tool rather than future material.

| Topic | Handbook coverage | Status |
| --- | --- | --- |
| Compiler mental model | Compiler Mental Model and Setup | ✅ Covered |
| installation/setup | Compiler Mental Model and Setup | ✅ Covered |
| React 17/18/19 targets | Compiler Mental Model and Setup | ✅ Covered |
| automatic memoization | Automatic Memoization and Manual Memoization | ✅ Covered |
| Compiler vs `memo` / `useMemo` / `useCallback` | Automatic Memoization and Manual Memoization | ✅ Covered |
| configuration | Adoption, Configuration, and Directives | ✅ Covered |
| incremental adoption | Adoption, Configuration, and Directives | ✅ Covered |
| `compilationMode` | Adoption, Configuration, and Directives | ✅ Covered |
| gating | Adoption, Configuration, and Directives | ✅ Covered |
| `"use memo"` | Adoption, Configuration, and Directives | ✅ Covered |
| `"use no memo"` | Adoption, Configuration, and Directives | ✅ Covered |
| diagnostics / skipped components | Libraries, Debugging, and Production Rollout | ✅ Covered |
| compiling libraries | Libraries, Debugging, and Production Rollout | ✅ Covered |
| production rollout / measurement | Libraries, Debugging, and Production Rollout | ✅ Covered |

## Rules of React

| Rule area | Handbook coverage | Status |
| --- | --- | --- |
| components and Hooks must be pure | Purity, Immutability, and Render Safety | ✅ Covered |
| idempotent rendering | Purity, Immutability, and Render Safety | ✅ Covered |
| side effects outside render | Purity, Immutability, and Render Safety | ✅ Covered |
| props/state immutability | Purity, Immutability, and Render Safety | ✅ Covered |
| Hook arguments/return immutability | Purity, Immutability, and Render Safety | ✅ Covered |
| safe local mutation | Purity, Immutability, and Render Safety | ✅ Covered |
| ref render safety | Purity, Immutability, and Render Safety | ✅ Covered |
| static component identity | Purity + Rules of Hooks/ESLint | ✅ Covered |
| Rules of Hooks | Rules of Hooks and Compiler-Aware ESLint | ✅ Covered |
| conditional/loop exception for `use` | Rules of Hooks and Compiler-Aware ESLint | ✅ Covered |
| `eslint-plugin-react-hooks` | Rules of Hooks and Compiler-Aware ESLint | ✅ Covered |
| `rules-of-hooks` | Rules of Hooks and Compiler-Aware ESLint | ✅ Covered |
| `exhaustive-deps` | Effects + Rules of Hooks/ESLint | ✅ Covered |
| compiler-aware lint diagnostics | Rules of Hooks and Compiler-Aware ESLint | ✅ Covered |
| `purity` / `immutability` / `globals` | Rules of Hooks and Compiler-Aware ESLint | ✅ Covered |
| `refs` / set-state lint rules | Rules of Hooks and Compiler-Aware ESLint | ✅ Covered |
| `static-components` / component factories | Rules of Hooks and Compiler-Aware ESLint | ✅ Covered |
| `unsupported-syntax` / incompatible libraries | Rules of Hooks and Compiler-Aware ESLint | ✅ Covered |

## React 19 removed/deprecated/legacy coverage

| API / pattern | Status | Modern direction |
| --- | --- | --- |
| `ReactDOM.render` | ⚠️ Removed — covered | `createRoot` |
| `ReactDOM.hydrate` | ⚠️ Removed — covered | `hydrateRoot` |
| `ReactDOM.unmountComponentAtNode` | ⚠️ Removed — covered | `root.unmount()` |
| `ReactDOM.findDOMNode` | ⚠️ Removed — covered | refs |
| string refs | ⚠️ Removed — covered | callback/object refs |
| legacy Context | ⚠️ Removed — covered | modern Context |
| `React.createFactory` | ⚠️ Removed | JSX |
| function component `defaultProps` | ⚠️ Removed behavior — covered | JavaScript default parameters |
| function component `propTypes` checks | ⚠️ Removed behavior — covered | TypeScript / runtime validation |
| `react-test-renderer` | ⚠️ Deprecated — covered | user-focused testing tools |
| `react-test-renderer/shallow` | ⚠️ Removed package path — covered | avoid shallow rendering as default |
| `react-dom/test-utils` helpers | ⚠️ Removed/deprecated direction — covered | `act` from `react` + modern testing tools |
| `element.ref` access | ⚠️ Deprecated — covered | `element.props.ref` if unavoidable |
| `forwardRef` as default new-code pattern | ⚠️ Historical in React 19+ | ref as a prop |
| class components | ⚠️ Legacy for new teaching, still supported | functions + Hooks for new code |
| `renderToNodeStream` | ⚠️ Removed in React 19 | modern server streaming APIs |
| `renderToStaticNodeStream` | ⚠️ Removed in React 19 | modern server/static APIs |

## Still planned

The remaining handbook depth is now concentrated in specialist/production topics rather than missing core React architecture:

- remaining stable Hooks: `useId`, `useDebugValue`, `useLayoutEffect`, `useInsertionEffect`;
- dedicated `memo`, `useMemo`, and `useCallback` performance/reference depth;
- `<Profiler>` and production performance tooling;
- `act` and modern testing;
- `captureOwnerStack` and advanced debugging;
- TypeScript, accessibility, security, and testing;
- performance architecture, design systems, advanced patterns;
- internals, legacy React maintenance, and production engineering;
- projects and interview preparation.

## Audit rules

Whenever the stable React minor changes:

1. re-check `react.dev/versions`;
2. re-check React Hooks, Components, APIs, and Directives;
3. re-check React DOM Hooks, Components, APIs, Client, Server, and Static APIs;
4. compare the latest stable npm patch;
5. inspect release notes for additions, removals, and changed recommendations;
6. re-check React Compiler configuration/directives and `eslint-plugin-react-hooks` recommended rules;
7. update this checklist before claiming complete coverage;
8. clearly label Stable, Canary, Experimental, and Legacy material;
9. run the Docusaurus production build and verify sidebar IDs and links.

## References

- https://react.dev/versions
- https://react.dev/reference/react
- https://react.dev/reference/react/hooks
- https://react.dev/reference/react/apis
- https://react.dev/reference/react-dom
- https://react.dev/reference/react-dom/client
- https://react.dev/reference/react-dom/server
- https://react.dev/reference/react-dom/static
- https://react.dev/reference/rsc/server-components
- https://react.dev/reference/rsc/server-functions
- https://react.dev/learn/react-compiler
- https://react.dev/reference/react-compiler/configuration
- https://react.dev/reference/react-compiler/directives
- https://react.dev/reference/eslint-plugin-react-hooks
- https://react.dev/reference/rules
- https://react.dev/blog/2025/10/07/react-compiler-1
- https://react.dev/blog/2025/10/01/react-19-2
