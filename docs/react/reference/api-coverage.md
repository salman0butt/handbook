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
- 🟡 **Planned** — present in the curriculum but not yet written to the handbook quality bar;
- 🟠 **Foundation covered** — correct working model exists, but a later advanced chapter will deepen it;
- ⚠️ **Legacy** — maintenance/migration knowledge, not a modern recommendation;
- 🧪 **Experimental/Canary** — not treated as stable production React.

The official React documentation is authoritative. Secondary tutorials are used only to cross-check beginner expectations.

## Curriculum coverage so far

| Area | Handbook coverage | Status |
| --- | --- | --- |
| React mental model | What is React? | ✅ Covered |
| JSX | JSX | ✅ Covered |
| components, props, children, composition | Components and Props | ✅ Covered |
| render / reconciliation / commit / paint | Rendering: Trigger, Render, Commit, Paint | ✅ Covered |
| events and propagation | Responding to Events | ✅ Covered |
| state snapshots, queues, batching | State as a Snapshot and Update Queues | ✅ Covered |
| state ownership and lifting | Choosing and Sharing State | ✅ Covered |
| state identity, preserve/reset | Preserving and Resetting State | ✅ Covered |
| conditional rendering | Conditional Rendering | ✅ Covered |
| lists, keys, identity | Lists and Keys | ✅ Covered |
| form fundamentals | Forms | ✅ Covered |
| Effects and synchronization | Effects section | ✅ Covered |
| unnecessary Effects | You Might Not Need an Effect | ✅ Covered |
| Effect lifecycle/dependencies | Effect Lifecycle and Dependencies | ✅ Covered |
| Effect Events | useEffectEvent | ✅ Covered — 19.2+ |
| refs and imperative access | Refs section | ✅ Covered |
| custom Hooks | Custom Hooks | ✅ Covered |
| Context | Context section | ✅ Covered |
| reducers | Reducers section | ✅ Covered |
| reducer + Context architecture | Reducer + Context Architecture | ✅ Covered |
| client/server/URL/external state categories | State Architecture | ✅ Covered |
| external store subscriptions | useSyncExternalStore | ✅ Covered |
| Actions and async Transitions | Actions and Async Transitions | ✅ Covered |
| Action result state | useActionState | ✅ Covered — 19+ |
| form Actions and form pending status | Form Actions and useFormStatus | ✅ Covered — 19+ |
| optimistic UI | useOptimistic | ✅ Covered — 19+ |
| Promise/context resource reads | use API and Suspense Resources | 🟠 Foundation covered — 19+ |
| state-preserving hidden UI | Activity | ✅ Covered — 19.2+ |
| metadata + resource loading | Metadata and Resource Loading | ✅ Covered |
| React 19 migration/removals | React 19 Migration and Removed APIs | ✅ Covered |

## React Hooks

| API | Category | Handbook page | Status | Version |
| --- | --- | --- | --- | --- |
| `useActionState` | Action state | useActionState | ✅ Covered | 19+ |
| `useCallback` | Performance | Memoization | 🟡 Planned | Stable |
| `useContext` | Context | Context and useContext | ✅ Covered | Stable |
| `useDebugValue` | Debugging | Hook Reference | 🟡 Planned | Stable |
| `useDeferredValue` | Concurrency | Transitions & Concurrency | 🟡 Planned | Stable |
| `useEffect` | Effect | Effects | ✅ Covered | Stable |
| `useEffectEvent` | Effect Event | useEffectEvent | ✅ Covered | 19.2+ |
| `useId` | Utility / accessibility | Accessibility / Hook Reference | 🟡 Planned | Stable |
| `useImperativeHandle` | Ref | DOM Refs and Imperative Handles | ✅ Covered | Stable |
| `useInsertionEffect` | Effect | Layout & Insertion Effects | 🟡 Planned | Stable |
| `useLayoutEffect` | Effect | Layout & Insertion Effects | 🟡 Planned | Stable |
| `useMemo` | Performance | Memoization | 🟡 Planned | Stable |
| `useOptimistic` | Action / optimistic UI | Optimistic UI with useOptimistic | ✅ Covered | 19+ |
| `useReducer` | State | useReducer and Reducer Design | ✅ Covered | Stable |
| `useRef` | Ref | Refs section | ✅ Covered | Stable |
| `useState` | State | useState + State chapters | ✅ Covered | Stable |
| `useSyncExternalStore` | External stores | useSyncExternalStore | ✅ Covered | Stable |
| `useTransition` | Concurrency / Actions | Actions and Async Transitions | 🟠 Foundation covered; deeper concurrency planned | Stable |

## Built-in React components

| API | Handbook page | Status | Version |
| --- | --- | --- | --- |
| `<Fragment>` | JSX | ✅ Covered | Stable |
| `<Profiler>` | Performance | 🟡 Planned | Stable |
| `<StrictMode>` | Strict Mode | ✅ Covered | Stable |
| `<Suspense>` | use API + future Suspense section | 🟠 Foundation covered; deep coverage planned | Stable |
| `<Activity>` | Activity in React 19.2 | ✅ Covered | 19.2+ |

## React APIs

| API | Category | Handbook page | Status |
| --- | --- | --- | --- |
| `createContext` | Context | Context and useContext | ✅ Covered |
| `lazy` | Code splitting | Lazy Loading | 🟡 Planned |
| `memo` | Performance | Memoization / Performance | 🟡 Planned |
| `startTransition` | Concurrency / Actions | Actions and Async Transitions | 🟠 Foundation covered; deeper concurrency planned |
| `act` | Testing | Testing | 🟡 Planned |
| `use` | Resource API | use API and Suspense Resources | 🟠 Foundation covered; RSC/Suspense depth planned |
| `cache` | RSC | Server Components | 🟡 Planned |
| `cacheSignal` | RSC | Server Components | 🟡 Planned — 19.2+ |
| `captureOwnerStack` | Development / debugging | Debugging | 🟡 Planned |

## React Server Component directives

| Directive | Handbook page | Status |
| --- | --- | --- |
| `'use client'` | Server Components | 🟡 Planned |
| `'use server'` | Server Components / Server Functions | 🟡 Planned |

These directives require an RSC-compatible framework/bundler environment. A normal client-only Vite app does not provide complete React Server Components infrastructure.

## React DOM Hook

| API | Handbook page | Status | Version |
| --- | --- | --- | --- |
| `useFormStatus` | Form Actions and useFormStatus | ✅ Covered | 19+ |

## React DOM components

React supports browser built-in HTML and SVG components. The handbook covers DOM behavior where React changes the programming model rather than producing one shallow page per HTML element.

| Area / component | Handbook page | Status |
| --- | --- | --- |
| standard HTML components in JSX | JSX / Forms | ✅ Foundation coverage |
| event props and propagation | Responding to Events | ✅ Covered |
| `<form>` traditional `onSubmit` | Forms | ✅ Covered |
| `<form action={function}>` | Form Actions and useFormStatus | ✅ Covered |
| `<input>` controlled/uncontrolled | Forms | ✅ Covered |
| checkbox/radio behavior | Forms | ✅ Covered |
| `<select>` / `<option>` | Forms | ✅ Covered |
| `<textarea>` | Forms | ✅ Covered |
| file inputs | Forms | ✅ Covered |
| DOM `ref` attachment and callback refs | DOM Refs and Imperative Handles | ✅ Covered |
| `<title>` | Metadata and Resource Loading | ✅ Covered |
| `<meta>` | Metadata and Resource Loading | ✅ Covered |
| `<link>` | Metadata and Resource Loading | ✅ Covered |
| `<style>` special behavior | Metadata and Resource Loading | ✅ Covered |
| `<script>` special behavior | Metadata and Resource Loading | ✅ Covered |
| SVG-specific React behavior | React DOM Components | 🟡 Planned |
| custom elements | React DOM Components | 🟡 Planned |

## React DOM APIs

| API | Handbook page | Status |
| --- | --- | --- |
| `createPortal` | Portals | 🟡 Planned |
| `flushSync` | React DOM Escape Hatches | 🟡 Planned |
| `prefetchDNS` | Metadata and Resource Loading | ✅ Covered |
| `preconnect` | Metadata and Resource Loading | ✅ Covered |
| `preload` | Metadata and Resource Loading | ✅ Covered |
| `preloadModule` | Metadata and Resource Loading | ✅ Covered |
| `preinit` | Metadata and Resource Loading | ✅ Covered |
| `preinitModule` | Metadata and Resource Loading | ✅ Covered |

## React DOM client APIs

| API | Handbook page | Status |
| --- | --- | --- |
| `createRoot` | Rendering a React Application | ✅ Covered |
| `root.render()` | Rendering a React Application | ✅ Covered |
| `root.unmount()` | Rendering a React Application | ✅ Covered |
| `hydrateRoot` | Server Rendering / Hydration | 🟡 Planned |

## React DOM server APIs

| API | Handbook page | Status |
| --- | --- | --- |
| `renderToReadableStream` | Server Rendering | 🟡 Planned |
| `resume` | Server Rendering / PPR | 🟡 Planned |
| `renderToPipeableStream` | Server Rendering | 🟡 Planned |
| `resumeToPipeableStream` | Server Rendering / PPR | 🟡 Planned |
| `renderToString` | Server Rendering | 🟡 Planned — teach limitations |
| `renderToStaticMarkup` | Server Rendering | 🟡 Planned — non-interactive output |

## React DOM static APIs

| API | Handbook page | Status |
| --- | --- | --- |
| `prerender` | Static Rendering | 🟡 Planned |
| `prerenderToNodeStream` | Static Rendering | 🟡 Planned |
| `resumeAndPrerender` | PPR | 🧪 Experimental/Canary |
| `resumeAndPrerenderToNodeStream` | PPR | 🧪 Experimental/Canary |

## React Compiler

React Compiler 1.0 is stable and receives first-class handbook coverage later in the roadmap.

| Topic | Status |
| --- | --- |
| Compiler mental model | 🟡 Planned |
| installation/setup | 🟡 Planned |
| configuration | 🟡 Planned |
| diagnostics and lint integration | 🟡 Planned |
| `"use memo"` | 🟡 Planned |
| `"use no memo"` | 🟡 Planned |
| compiling libraries | 🟡 Planned |
| compiler vs manual memoization | 🟡 Planned |

## Rules of React

| Rule area | Status |
| --- | --- |
| components and Hooks must be pure | ✅ Foundation coverage; dedicated chapter planned |
| idempotent rendering | ✅ Foundation coverage; dedicated chapter planned |
| side effects outside render | ✅ Effects coverage; dedicated Rules chapter planned |
| props/state immutability | ✅ Foundation/reducer coverage |
| Rules of Hooks | ✅ Custom Hooks foundation coverage; dedicated chapter planned |
| reducer purity | ✅ Reducer coverage |
| React calls Components and Hooks | ✅ Foundation coverage; dedicated chapter planned |
| eslint-plugin-react-hooks dependency rules | ✅ Effects foundation coverage |

## React 19 removed/deprecated/legacy coverage

| API / pattern | Status | Modern direction |
| --- | --- | --- |
| `ReactDOM.render` | ⚠️ Removed — covered in migration | `createRoot` |
| `ReactDOM.hydrate` | ⚠️ Removed — covered in migration | `hydrateRoot` |
| `ReactDOM.unmountComponentAtNode` | ⚠️ Removed — covered in migration | `root.unmount()` |
| `ReactDOM.findDOMNode` | ⚠️ Removed — covered in migration | explicit refs |
| string refs | ⚠️ Removed — covered in migration | callback/object refs |
| legacy Context | ⚠️ Removed — covered in migration | modern Context |
| `React.createFactory` | ⚠️ Removed | JSX |
| function component `defaultProps` | ⚠️ Removed behavior — covered in migration | JavaScript default parameters |
| function component `propTypes` checks in React | ⚠️ Removed behavior — covered in migration | TypeScript / deliberate runtime validation |
| `react-test-renderer` | ⚠️ Deprecated — covered in migration | user-focused testing tools |
| `react-test-renderer/shallow` | ⚠️ Removed package path — covered in migration | avoid shallow rendering as default |
| `react-dom/test-utils` helpers | ⚠️ Removed/deprecated direction — covered in migration | `act` from `react` + modern testing tools |
| `element.ref` access | ⚠️ Deprecated — covered in migration | `element.props.ref` if introspection is unavoidable |
| `forwardRef` as default new-code pattern | ⚠️ Historical in React 19+ | ref as a prop for function components |
| class components | ⚠️ Legacy for new teaching, still supported | function components + Hooks for new code |

## Current learning path coverage

The beginner-to-modern path now explicitly covers:

- JavaScript prerequisites;
- React rendering and JSX;
- components and composition;
- events;
- state snapshots, batching, ownership, identity, and reset;
- conditionals, lists, keys, forms;
- Effects, Effect Events, refs, custom Hooks;
- Context, reducers, reducer + Context architecture;
- local/shared/server/URL/external state categories;
- external store subscriptions;
- React 19 Actions and async Transitions;
- `useActionState`, form Actions, `useFormStatus`, `useOptimistic`;
- `use` resource reading and Suspense foundations;
- React 19.2 `<Activity>`;
- document metadata and resource-loading primitives;
- React 19 migration, removed APIs, ref changes, testing changes, and TypeScript migration concerns.

Still planned:

- deep Suspense, transitions, `useDeferredValue`, interruption, lazy loading, and concurrency;
- remaining stable Hooks (`useCallback`, `useMemo`, `useId`, `useDebugValue`, `useLayoutEffect`, `useInsertionEffect`);
- portals and complete React DOM client coverage;
- SSR, hydration, streaming, static rendering, partial pre-rendering, Server Components and Server Functions;
- `cache`, `cacheSignal`, and RSC directives;
- React Compiler and dedicated Rules of React;
- TypeScript, testing, accessibility, security;
- performance, architecture, design systems, patterns;
- debugging, internals, legacy React maintenance, production engineering;
- projects and interview preparation.

## Audit rules

Whenever the stable React minor changes:

1. re-check `react.dev/versions`;
2. re-check React Hooks, Components, APIs, and Directives;
3. re-check React DOM Hooks, Components, APIs, Client, Server, and Static APIs;
4. compare the latest stable npm patch;
5. inspect release notes for additions, removals, and changed recommendations;
6. update this checklist before claiming complete coverage;
7. clearly label Stable, Canary, Experimental, and Legacy material;
8. run the Docusaurus production build and verify sidebar IDs and links.

## References

- https://react.dev/versions
- https://react.dev/reference/react
- https://react.dev/reference/react/hooks
- https://react.dev/reference/react/apis
- https://react.dev/reference/react/useActionState
- https://react.dev/reference/react/useOptimistic
- https://react.dev/reference/react/use
- https://react.dev/reference/react/Activity
- https://react.dev/reference/react-dom
- https://react.dev/reference/react-dom/hooks/useFormStatus
- https://react.dev/reference/react-dom/components
- https://react.dev/blog/2024/04/25/react-19-upgrade-guide
- https://react.dev/blog/2024/12/05/react-19
- https://react.dev/blog/2025/10/01/react-19-2
