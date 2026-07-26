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
| forms | Forms + Modern React Forms | ✅ Covered |
| Effects and synchronization | Effects section | ✅ Covered |
| Effect Events | useEffectEvent | ✅ Covered — 19.2+ |
| refs and imperative access | Refs section | ✅ Covered |
| custom Hooks | Custom Hooks | ✅ Covered |
| Context | Context section | ✅ Covered |
| reducers | Reducers section | ✅ Covered |
| external stores | useSyncExternalStore | ✅ Covered |
| Actions and async Transitions | Modern React 19+ | ✅ Covered |
| optimistic UI | useOptimistic | ✅ Covered — 19+ |
| Promise/context resource reads | use API and Suspense Resources | ✅ Covered — 19+ |
| state-preserving hidden UI | Activity | ✅ Covered — 19.2+ |
| metadata + resource loading | Metadata and Resource Loading | ✅ Covered |
| React 19 migration/removals | React 19 Migration and Removed APIs | ✅ Covered |
| Suspense reveal architecture | Suspense section | ✅ Covered |
| lazy/code splitting | lazy and Code Splitting | ✅ Covered |
| Transition scheduling | Concurrency section | ✅ Covered |
| deferred/stale rendering | useDeferredValue and Stale UI | ✅ Covered |
| concurrent render/commit model | Concurrent Rendering Mental Model | ✅ Covered |
| portals + synchronous DOM escape hatch | Portals, flushSync, and React DOM Escape Hatches | ✅ Covered |
| DOM components, custom elements, SVG | React DOM Components, Custom Elements, and SVG | ✅ Covered |
| hydration | Hydration and hydrateRoot | ✅ Covered |
| streaming SSR | Streaming SSR with React DOM Server APIs | ✅ Covered |
| static generation and PPR | Static Rendering, Resume APIs, and Partial Pre-rendering | ✅ Covered |
| Server Components and client boundaries | Server Components and Client Boundaries | ✅ Covered |
| Server Functions and `'use server'` | Server Functions, use server, and Mutation Boundaries | ✅ Covered |
| RSC memoization/cancellation | cache, cacheSignal, and Server Render Lifetimes | ✅ Covered |

## React Hooks

| API | Category | Handbook page | Status | Version |
| --- | --- | --- | --- | --- |
| `useActionState` | Action state | useActionState | ✅ Covered | 19+ |
| `useCallback` | Performance | Memoization | 🟡 Planned | Stable |
| `useContext` | Context | Context and useContext | ✅ Covered | Stable |
| `useDebugValue` | Debugging | Hook Reference | 🟡 Planned | Stable |
| `useDeferredValue` | Concurrency | useDeferredValue and Stale UI | ✅ Covered | Stable |
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
| `useTransition` | Concurrency / Actions | useTransition and startTransition Deep Dive | ✅ Covered | Stable |

## Built-in React components

| API | Handbook page | Status | Version |
| --- | --- | --- | --- |
| `<Fragment>` | JSX | ✅ Covered | Stable |
| `<Profiler>` | Performance | 🟡 Planned | Stable |
| `<StrictMode>` | Strict Mode | ✅ Covered | Stable |
| `<Suspense>` | Suspense section | ✅ Covered | Stable |
| `<Activity>` | Activity in React 19.2 | ✅ Covered | 19.2+ |

## React APIs

| API | Category | Handbook page | Status |
| --- | --- | --- | --- |
| `createContext` | Context | Context and useContext | ✅ Covered |
| `lazy` | Code splitting | lazy and Code Splitting | ✅ Covered |
| `memo` | Performance | Memoization / Performance | 🟡 Planned |
| `startTransition` | Concurrency / Actions | useTransition and startTransition Deep Dive | ✅ Covered |
| `act` | Testing | Testing | 🟡 Planned |
| `use` | Resource API | use API + Server Components | ✅ Covered |
| `cache` | RSC | cache, cacheSignal, and Server Render Lifetimes | ✅ Covered |
| `cacheSignal` | RSC | cache, cacheSignal, and Server Render Lifetimes | ✅ Covered — 19.2+ |
| `captureOwnerStack` | Development / debugging | Debugging | 🟡 Planned |

## React Server Component directives

| Directive | Handbook page | Status |
| --- | --- | --- |
| `'use client'` | Server Components and Client Boundaries | ✅ Covered |
| `'use server'` | Server Functions, use server, and Mutation Boundaries | ✅ Covered |

These directives require an RSC-compatible framework/bundler environment. A normal client-only Vite app does not provide complete React Server Components infrastructure.

## React DOM Hook

| API | Handbook page | Status | Version |
| --- | --- | --- | --- |
| `useFormStatus` | Form Actions and useFormStatus | ✅ Covered | 19+ |

## React DOM components

React supports browser built-in HTML and SVG components. The handbook covers DOM behavior where React changes the programming model rather than producing one shallow page per HTML element.

| Area / component | Handbook page | Status |
| --- | --- | --- |
| standard HTML components in JSX | JSX / Forms / React DOM Components | ✅ Covered |
| event props and propagation | Responding to Events | ✅ Covered |
| forms and native controls | Forms + Modern React Forms | ✅ Covered |
| DOM refs / callback refs | DOM Refs and Imperative Handles | ✅ Covered |
| `<title>` / `<meta>` / `<link>` | Metadata and Resource Loading | ✅ Covered |
| `<style>` / `<script>` special behavior | Metadata and Resource Loading | ✅ Covered |
| SVG behavior and accessibility | React DOM Components, Custom Elements, and SVG | ✅ Covered |
| custom elements / Web Components | React DOM Components, Custom Elements, and SVG | ✅ Covered |
| `dangerouslySetInnerHTML` | React DOM Components, Custom Elements, and SVG | ✅ Covered |
| `contentEditable` ownership caveats | React DOM Components, Custom Elements, and SVG | ✅ Covered |
| `suppressHydrationWarning` | Hydration + React DOM Components | ✅ Covered |

## React DOM APIs

| API | Handbook page | Status |
| --- | --- | --- |
| `createPortal` | Portals, flushSync, and React DOM Escape Hatches | ✅ Covered |
| `flushSync` | Portals, flushSync, and React DOM Escape Hatches | ✅ Covered |
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
| `root.unmount()` | Rendering a React Application + Hydration | ✅ Covered |
| `hydrateRoot` | Hydration and hydrateRoot | ✅ Covered |

## React DOM server APIs

| API | Handbook page | Status |
| --- | --- | --- |
| `renderToReadableStream` | Streaming SSR with React DOM Server APIs | ✅ Covered |
| `renderToPipeableStream` | Streaming SSR with React DOM Server APIs | ✅ Covered |
| `resume` | Static Rendering, Resume APIs, and Partial Pre-rendering | ✅ Covered |
| `resumeToPipeableStream` | Static Rendering, Resume APIs, and Partial Pre-rendering | ✅ Covered |
| `renderToString` | Static Rendering, Resume APIs, and Partial Pre-rendering | ✅ Covered — legacy/limited path |
| `renderToStaticMarkup` | Static Rendering, Resume APIs, and Partial Pre-rendering | ✅ Covered — non-interactive output |

## React DOM static APIs

| API | Handbook page | Status |
| --- | --- | --- |
| `prerender` | Static Rendering, Resume APIs, and Partial Pre-rendering | ✅ Covered |
| `prerenderToNodeStream` | Static Rendering, Resume APIs, and Partial Pre-rendering | ✅ Covered |
| `resumeAndPrerender` | Static Rendering, Resume APIs, and Partial Pre-rendering | 🧪 Experimental — architecture covered |
| `resumeAndPrerenderToNodeStream` | Static Rendering, Resume APIs, and Partial Pre-rendering | 🧪 Experimental — architecture covered |

## Server Components / Server Functions

| Area | Handbook page | Status |
| --- | --- | --- |
| Server Components mental model | Server Components and Client Boundaries | ✅ Covered |
| RSC vs SSR | Server Components and Client Boundaries | ✅ Covered |
| async Server Components | Server Components and Client Boundaries | ✅ Covered |
| serializable client-boundary props | Server Components and Client Boundaries | ✅ Covered |
| Promise handoff to Client Components | Server Components and Client Boundaries | ✅ Covered |
| Server Functions | Server Functions, use server, and Mutation Boundaries | ✅ Covered |
| mutation security / authorization | Server Functions, use server, and Mutation Boundaries | ✅ Covered |
| RSC request memoization | cache, cacheSignal, and Server Render Lifetimes | ✅ Covered |
| RSC cancellation lifetime | cache, cacheSignal, and Server Render Lifetimes | ✅ Covered |

The Server Component model is stable for React 19 application use, but framework/bundler implementation APIs beneath RSC do not follow the same minor-version stability guarantee. Use framework-supported integration rather than treating internal RSC transport APIs as portable application APIs.

## React Compiler

React Compiler 1.0 is stable and receives first-class handbook coverage next in the roadmap.

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
| components and Hooks must be pure | ✅ Foundation + concurrency coverage; dedicated chapter planned |
| idempotent rendering | ✅ Foundation + concurrency coverage; dedicated chapter planned |
| side effects outside render | ✅ Effects + concurrency coverage; dedicated Rules chapter planned |
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
| `renderToNodeStream` | ⚠️ Removed in React 19 | modern server streaming APIs |
| `renderToStaticNodeStream` | ⚠️ Removed in React 19 | modern server/static APIs |

## Current learning path coverage

The beginner-to-modern path now explicitly covers:

- JavaScript prerequisites and React fundamentals;
- rendering, JSX, composition, events, state, forms, Effects, refs, Context, reducers, and custom Hooks;
- external stores and deliberate state architecture;
- React 19 Actions, modern forms, optimistic UI, `use`, `<Activity>`, metadata/resources, and migration;
- deep Suspense, code splitting, Transitions, deferred rendering, and concurrency;
- React DOM escape hatches, DOM components, custom elements, SVG, and raw HTML safety;
- hydration, streaming SSR, static rendering, resume APIs, and partial pre-rendering;
- Server Components, client boundaries, Server Functions, `'use client'`, `'use server'`, `cache`, and `cacheSignal`.

Still planned:

- remaining stable Hooks (`useCallback`, `useMemo`, `useId`, `useDebugValue`, `useLayoutEffect`, `useInsertionEffect`);
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
- https://react.dev/reference/react-dom
- https://react.dev/reference/react-dom/components
- https://react.dev/reference/react-dom/client
- https://react.dev/reference/react-dom/server
- https://react.dev/reference/react-dom/static
- https://react.dev/reference/rsc/server-components
- https://react.dev/reference/rsc/server-functions
- https://react.dev/reference/rsc/directives
- https://react.dev/reference/react/cache
- https://react.dev/reference/react/cacheSignal
- https://react.dev/blog/2024/04/25/react-19-upgrade-guide
- https://react.dev/blog/2024/12/05/react-19
- https://react.dev/blog/2025/10/01/react-19-2
