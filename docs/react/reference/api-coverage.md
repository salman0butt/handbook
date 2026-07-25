---
title: Official React API Coverage
description: React 19.2 coverage checklist for the handbook across React, React DOM, Compiler, and legacy APIs.
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
- ⚠️ **Legacy** — maintenance/migration knowledge, not a modern recommendation;
- 🧪 **Experimental/Canary** — not treated as stable production React.

The official React documentation is authoritative. Secondary tutorials are used only to cross-check beginner expectations.

## Foundation coverage

| Topic | Handbook page | Status |
| --- | --- | --- |
| React mental model | What is React? | ✅ Covered |
| JSX | JSX | ✅ Covered |
| Components and props | Components and Props | ✅ Covered |
| render / commit / paint | Rendering: Trigger, Render, Commit, Paint | ✅ Covered |
| events and propagation | Responding to Events | ✅ Covered |
| state snapshots and batching | State as a Snapshot and Update Queues | ✅ Covered |
| state ownership and lifting state | Choosing and Sharing State | ✅ Covered |
| state preservation and reset | Preserving and Resetting State | ✅ Covered |
| conditional rendering | Conditional Rendering | ✅ Covered |
| lists, keys, identity | Lists and Keys | ✅ Covered |
| form fundamentals | Forms | ✅ Covered |

## React Hooks

| API | Category | Handbook page | Status | Version |
| --- | --- | --- | --- | --- |
| `useActionState` | Form / Action Hook | Modern React Forms | 🟡 Planned | 19+ |
| `useCallback` | Performance Hook | Memoization | 🟡 Planned | Stable |
| `useContext` | Context Hook | Context | 🟡 Planned | Stable |
| `useDebugValue` | Debugging Hook | Hook Reference | 🟡 Planned | Stable |
| `useDeferredValue` | Concurrency Hook | Transitions & Concurrency | 🟡 Planned | Stable |
| `useEffect` | Effect Hook | Effects | 🟡 Planned | Stable |
| `useEffectEvent` | Effect Hook | Effect Events | 🟡 Planned | 19.2+ |
| `useId` | Utility Hook | Accessibility / Hook Reference | 🟡 Planned | Stable |
| `useImperativeHandle` | Ref Hook | Refs | 🟡 Planned | Stable |
| `useInsertionEffect` | Effect Hook | Layout & Insertion Effects | 🟡 Planned | Stable |
| `useLayoutEffect` | Effect Hook | Layout & Insertion Effects | 🟡 Planned | Stable |
| `useMemo` | Performance Hook | Memoization | 🟡 Planned | Stable |
| `useOptimistic` | Action Hook | Modern React Forms | 🟡 Planned | 19+ |
| `useReducer` | State Hook | Reducers | 🟡 Planned | Stable |
| `useRef` | Ref Hook | Refs | 🟡 Planned | Stable |
| `useState` | State Hook | useState + State chapters | ✅ Covered | Stable |
| `useSyncExternalStore` | External Store Hook | External Stores | 🟡 Planned | Stable |
| `useTransition` | Concurrency Hook | Transitions & Concurrency | 🟡 Planned | Stable |

## Built-in React components

| API | Handbook page | Status | Version |
| --- | --- | --- | --- |
| `<Fragment>` | JSX | ✅ Covered | Stable |
| `<Profiler>` | Performance | 🟡 Planned | Stable |
| `<StrictMode>` | Strict Mode | ✅ Covered | Stable |
| `<Suspense>` | Suspense | 🟡 Planned | Stable |
| `<Activity>` | Activity | 🟡 Planned | 19.2+ |

## React APIs

| API | Category | Handbook page | Status |
| --- | --- | --- | --- |
| `createContext` | Context API | Context | 🟡 Planned |
| `lazy` | Code splitting API | Lazy Loading | 🟡 Planned |
| `memo` | Performance API | Memoization / Performance | 🟡 Planned |
| `startTransition` | Concurrency API | Transitions & Concurrency | 🟡 Planned |
| `act` | Testing API | Testing | 🟡 Planned |
| `use` | Resource API | Modern React / Suspense / RSC | 🟡 Planned |
| `cache` | RSC API | Server Components | 🟡 Planned |
| `cacheSignal` | RSC API | Server Components | 🟡 Planned — 19.2+ |
| `captureOwnerStack` | Development API | Debugging | 🟡 Planned |

## React Server Component directives

| Directive | Handbook page | Status |
| --- | --- | --- |
| `'use client'` | Server Components | 🟡 Planned |
| `'use server'` | Server Components / Server Functions | 🟡 Planned |

These require an RSC-compatible framework/bundler environment. A normal client-only Vite app does not provide complete React Server Components infrastructure.

## React DOM Hook

| API | Handbook page | Status | Version |
| --- | --- | --- | --- |
| `useFormStatus` | Modern React Forms | 🟡 Planned | 19+ |

## React DOM components

React supports browser built-in HTML and SVG components. The handbook will cover DOM behavior where React changes the programming model rather than producing one shallow page per HTML element.

| Area | Handbook page | Status |
| --- | --- | --- |
| standard HTML components in JSX | JSX / Forms | ✅ Covered at foundation level |
| event props and propagation | Responding to Events | ✅ Covered |
| `<form>` with traditional `onSubmit` | Forms | ✅ Covered |
| `FormData` | Forms | ✅ Covered |
| `<input>` controlled/uncontrolled | Forms | ✅ Covered |
| checkbox/radio behavior | Forms | ✅ Covered |
| `<select>` and `<option>` behavior | Forms | ✅ Covered |
| `<textarea>` behavior | Forms | ✅ Covered |
| file inputs | Forms | ✅ Covered |
| `<form action={function}>` overview | Forms | ✅ Foundation overview |
| Actions + pending/error/optimistic form flow | Modern React Forms | 🟡 Planned |
| SVG components | React DOM Components | 🟡 Planned |
| custom elements | React DOM Components | 🟡 Planned |
| document metadata: `title`, `meta`, `link` | React 19+ / React DOM | 🟡 Planned |
| stylesheet and async script behavior | React 19+ / React DOM | 🟡 Planned |

## React DOM APIs

| API | Handbook page | Status |
| --- | --- | --- |
| `createPortal` | Portals | 🟡 Planned |
| `flushSync` | React DOM Escape Hatches | 🟡 Planned |
| `prefetchDNS` | Resource Hints | 🟡 Planned |
| `preconnect` | Resource Hints | 🟡 Planned |
| `preload` | Resource Hints | 🟡 Planned |
| `preloadModule` | Resource Hints | 🟡 Planned |
| `preinit` | Resource Hints | 🟡 Planned |
| `preinitModule` | Resource Hints | 🟡 Planned |

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

Compiler directives are control mechanisms, not syntax every component should contain.

## Rules of React

| Rule area | Status |
| --- | --- |
| components and Hooks must be pure | ✅ Foundation coverage; dedicated chapter planned |
| idempotent rendering | ✅ Foundation coverage; dedicated chapter planned |
| side effects outside render | ✅ Foundation coverage; dedicated chapter planned |
| props/state immutability | ✅ Foundation coverage; dedicated chapter planned |
| Rules of Hooks | 🟡 Planned |
| React calls Components and Hooks | ✅ Foundation coverage; dedicated chapter planned |
| eslint-plugin-react-hooks rules | 🟡 Planned |

## Removed React 19 APIs and legacy coverage

| API / pattern | Status | Modern direction |
| --- | --- | --- |
| `ReactDOM.render` | ⚠️ Removed | `createRoot` |
| `ReactDOM.hydrate` | ⚠️ Removed | `hydrateRoot` |
| `ReactDOM.unmountComponentAtNode` | ⚠️ Removed | `root.unmount()` |
| `ReactDOM.findDOMNode` | ⚠️ Removed | refs |
| string refs | ⚠️ Removed | callback/object refs |
| legacy Context | ⚠️ Removed | modern Context |
| `React.createFactory` | ⚠️ Removed | JSX |
| function component `defaultProps` | ⚠️ Removed behavior | JavaScript default parameters |
| function component `propTypes` checks in React | ⚠️ Removed behavior | TypeScript / deliberate runtime validation |
| `react-test-renderer` | ⚠️ Deprecated | user-focused testing tools |
| class components | ⚠️ Legacy for new teaching | function components + Hooks |
| `forwardRef` as default new-code pattern | ⚠️ Historical in React 19+ | ref as a prop where appropriate |

## Beginner curriculum cross-check

The beginner path now explicitly covers:

- JavaScript prerequisites;
- first app and rendering;
- JSX;
- components, props, children, composition;
- events and propagation;
- state snapshots, batching, and updater queues;
- state ownership and lifting state;
- controlled/uncontrolled component design;
- state preservation/reset and identity;
- conditional rendering;
- lists and keys;
- forms and native form controls.

Still planned after this foundation sequence:

- Effects and effect architecture;
- refs and imperative escape hatches;
- Context and reducers;
- custom Hooks and every stable built-in Hook;
- React 19 Actions and modern forms;
- Activity, Suspense, transitions, concurrency;
- portals and complete React DOM coverage;
- SSR, hydration, streaming, static rendering, Server Components;
- React Compiler and Rules of React;
- TypeScript, testing, accessibility, security;
- performance, architecture, design systems, patterns;
- debugging, internals, legacy React, production engineering;
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

- https://react.dev/reference/react
- https://react.dev/reference/react/hooks
- https://react.dev/reference/react/apis
- https://react.dev/reference/react-dom
- https://react.dev/reference/react-dom/components
- https://react.dev/blog/2025/10/01/react-19-2
- https://react.dev/versions
