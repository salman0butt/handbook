---
title: Official React API Coverage
description: A React 19.2 checklist that tracks handbook coverage against the official React and React DOM references.
sidebar_position: 1
---

# Official React API coverage

> **Reference line: React 19.2**  
> **Latest stable package checked: 19.2.7**  
> **Audit date: 2026-07-26**

This page prevents the handbook from accidentally becoming a collection of favorite topics while missing official React APIs.

Statuses:

- ✅ **Covered** — a dedicated or substantial handbook explanation exists;
- 🟡 **Planned** — part of the curriculum but not yet written to the handbook quality bar;
- ⚠️ **Legacy** — maintenance/migration knowledge, not a modern recommendation;
- 🧪 **Experimental/Canary** — not treated as stable production React.

The official React docs are authoritative. Secondary tutorials are used only to cross-check beginner topic expectations.

## React Hooks

| API | Category | Handbook page | Status | React version |
| --- | --- | --- | --- | --- |
| `useActionState` | Hook | Modern React / Forms | 🟡 Planned | 19+ |
| `useCallback` | Hook | Performance Hooks | 🟡 Planned | Stable |
| `useContext` | Hook | Context | 🟡 Planned | Stable |
| `useDebugValue` | Hook | Hook Reference | 🟡 Planned | Stable |
| `useDeferredValue` | Hook | Transitions & Concurrency | 🟡 Planned | Stable |
| `useEffect` | Hook | Effects | 🟡 Planned | Stable |
| `useEffectEvent` | Hook | Effects / Effect Events | 🟡 Planned | 19.2+ |
| `useId` | Hook | Hook Reference / Accessibility | 🟡 Planned | Stable |
| `useImperativeHandle` | Hook | Refs | 🟡 Planned | Stable |
| `useInsertionEffect` | Hook | Layout & Insertion Effects | 🟡 Planned | Stable |
| `useLayoutEffect` | Hook | Layout & Insertion Effects | 🟡 Planned | Stable |
| `useMemo` | Hook | Memoization | 🟡 Planned | Stable |
| `useOptimistic` | Hook | Modern React / Forms | 🟡 Planned | 19+ |
| `useReducer` | Hook | Reducers | 🟡 Planned | Stable |
| `useRef` | Hook | Refs | 🟡 Planned | Stable |
| `useState` | Hook | [useState](../04-hooks/use-state.md) | ✅ Covered | Stable |
| `useSyncExternalStore` | Hook | External Stores | 🟡 Planned | Stable |
| `useTransition` | Hook | Transitions & Concurrency | 🟡 Planned | Stable |

## Built-in React components

| API | Category | Handbook page | Status | React version |
| --- | --- | --- | --- | --- |
| `<Fragment>` | Component | [JSX](../02-fundamentals/jsx.md) | ✅ Covered | Stable |
| `<Profiler>` | Component | Performance | 🟡 Planned | Stable |
| `<Suspense>` | Component | Suspense | 🟡 Planned | Stable |
| `<StrictMode>` | Component | [Strict Mode](../01-getting-started/strict-mode.md) | ✅ Covered | Stable |
| `<Activity>` | Component | Activity | 🟡 Planned | 19.2+ |

## React APIs

| API | Category | Handbook page | Status | React version |
| --- | --- | --- | --- | --- |
| `createContext` | API | Context | 🟡 Planned | Stable |
| `lazy` | API | Lazy Loading | 🟡 Planned | Stable |
| `memo` | API | Memoization / Performance | 🟡 Planned | Stable |
| `startTransition` | API | Transitions & Concurrency | 🟡 Planned | Stable |
| `act` | API | Testing | 🟡 Planned | Stable |
| `use` | Resource API | Modern React / Suspense / RSC | 🟡 Planned | 19+ |
| `cache` | RSC API | Server Components | 🟡 Planned | Stable, RSC only |
| `cacheSignal` | RSC API | Server Components | 🟡 Planned | 19.2+, RSC only |
| `captureOwnerStack` | Development API | Debugging | 🟡 Planned | Stable, development only |

## React Server Component directives

| API | Category | Handbook page | Status | React version |
| --- | --- | --- | --- | --- |
| `'use client'` | RSC directive | Server Components | 🟡 Planned | Stable |
| `'use server'` | RSC directive | Server Components | 🟡 Planned | Stable |

These directives require an RSC-compatible bundler/framework environment. A normal client-only Vite project does not provide a complete Server Components architecture.

## React DOM Hooks

| API | Category | Handbook page | Status | React version |
| --- | --- | --- | --- | --- |
| `useFormStatus` | React DOM Hook | Forms / Modern React | 🟡 Planned | 19+ |

## React DOM APIs

| API | Category | Handbook page | Status | React version |
| --- | --- | --- | --- | --- |
| `createPortal` | React DOM API | Portals | 🟡 Planned | Stable |
| `flushSync` | React DOM API | React DOM / Escape Hatches | 🟡 Planned | Stable |
| `prefetchDNS` | Resource API | React DOM / Performance | 🟡 Planned | Stable |
| `preconnect` | Resource API | React DOM / Performance | 🟡 Planned | Stable |
| `preload` | Resource API | React DOM / Performance | 🟡 Planned | Stable |
| `preloadModule` | Resource API | React DOM / Performance | 🟡 Planned | Stable |
| `preinit` | Resource API | React DOM / Performance | 🟡 Planned | Stable |
| `preinitModule` | Resource API | React DOM / Performance | 🟡 Planned | Stable |

## React DOM client APIs

| API | Category | Handbook page | Status | React version |
| --- | --- | --- | --- | --- |
| `createRoot` | Client API | [Rendering a React Application](../01-getting-started/rendering-a-react-app.md) | ✅ Covered | Stable |
| `hydrateRoot` | Client API | Server Rendering / Hydration | 🟡 Planned | Stable |

The root object methods `root.render()` and `root.unmount()` are covered with `createRoot` and will receive deeper reference material in the React DOM section.

## React DOM server APIs

| API | Category | Handbook page | Status | React version |
| --- | --- | --- | --- | --- |
| `renderToReadableStream` | Server API / Web Streams | Server Rendering | 🟡 Planned | Stable |
| `resume` | Server API / Web Streams | Server Rendering / PPR | 🟡 Planned | 19.2 line |
| `renderToPipeableStream` | Server API / Node Streams | Server Rendering | 🟡 Planned | Stable |
| `resumeToPipeableStream` | Server API / Node Streams | Server Rendering / PPR | 🟡 Planned | 19.2 line |
| `renderToString` | Legacy-style non-streaming server API | Server Rendering | 🟡 Planned | Stable, limited |
| `renderToStaticMarkup` | Non-interactive server API | Server Rendering | 🟡 Planned | Stable, limited |

`renderToString` and `renderToStaticMarkup` remain available but have important limitations compared with streaming APIs. They should not be taught as the default architecture for modern streaming applications.

## React DOM static APIs

| API | Category | Handbook page | Status | React version |
| --- | --- | --- | --- | --- |
| `prerender` | Static API / Web Streams | Server Rendering / Static Rendering | 🟡 Planned | Stable |
| `prerenderToNodeStream` | Static API / Node Streams | Server Rendering / Static Rendering | 🟡 Planned | Stable |
| `resumeAndPrerender` | Static API | Server Rendering / PPR | 🧪 Experimental/Canary | Experimental |
| `resumeAndPrerenderToNodeStream` | Static API | Server Rendering / PPR | 🧪 Experimental/Canary | Experimental |

## React DOM components

React supports browser built-in HTML and SVG components. The handbook will not create one shallow page per HTML tag. Instead, it will cover DOM behavior where React changes the programming model or where production mistakes are common.

Coverage areas:

| Area | Status |
| --- | --- |
| Standard HTML components in JSX | ✅ Covered at foundation level |
| SVG components in JSX | 🟡 Planned |
| `<form>` Actions behavior | 🟡 Planned |
| `<input>` controlled/uncontrolled behavior | 🟡 Planned |
| `<select>` behavior | 🟡 Planned |
| `<textarea>` behavior | 🟡 Planned |
| `<option>` behavior | 🟡 Planned |
| `<progress>` / form accessibility considerations | 🟡 Planned |
| custom elements | 🟡 Planned |
| document metadata components (`title`, `meta`, `link`) | 🟡 Planned |
| stylesheet and async script behavior | 🟡 Planned |

## React Compiler

React Compiler 1.0 is stable and deserves first-class handbook coverage.

| Topic / API | Category | Handbook page | Status |
| --- | --- | --- | --- |
| React Compiler mental model | Compiler | React Compiler | 🟡 Planned |
| compiler installation/setup | Compiler | React Compiler | 🟡 Planned |
| `compilationMode` | Compiler config | React Compiler | 🟡 Planned |
| `target` | Compiler config | React Compiler | 🟡 Planned |
| diagnostics and lint integration | Compiler | React Compiler / Rules of React | 🟡 Planned |
| `"use memo"` | Compiler directive | React Compiler | 🟡 Planned |
| `"use no memo"` | Compiler directive | React Compiler | 🟡 Planned |
| compiling libraries | Compiler | React Compiler | 🟡 Planned |

Compiler directives are escape hatches/control mechanisms, not syntax every component should contain.

## Removed React 19 APIs and legacy coverage

| API / pattern | Status | Modern direction |
| --- | --- | --- |
| `ReactDOM.render` | ⚠️ Legacy / removed | `createRoot` |
| `ReactDOM.hydrate` | ⚠️ Legacy / removed | `hydrateRoot` |
| `ReactDOM.unmountComponentAtNode` | ⚠️ Legacy / removed | `root.unmount()` |
| `ReactDOM.findDOMNode` | ⚠️ Legacy / removed | refs |
| string refs | ⚠️ Legacy / removed | callback/object refs |
| legacy Context (`contextTypes`, `getChildContext`) | ⚠️ Legacy / removed | modern Context |
| `React.createFactory` | ⚠️ Legacy / removed | JSX |
| function component `defaultProps` | ⚠️ Removed behavior | default parameters |
| function component `propTypes` checks in React | ⚠️ Removed behavior | TypeScript / deliberate runtime validation |
| `react-test-renderer` | ⚠️ Deprecated | modern user-focused testing libraries |
| class components | ⚠️ Legacy for new teaching | function components + Hooks; retain maintenance knowledge |
| `forwardRef` as default new-code pattern | ⚠️ Historical/maintenance context | React 19 ref-as-prop guidance |

## Beginner curriculum cross-check

The handbook curriculum covers the beginner material learners reasonably expect from broad React tutorials, including:

- modern JavaScript prerequisites;
- first app and rendering;
- JSX expressions and attributes;
- components and props;
- children and composition;
- events;
- conditional rendering;
- lists and keys;
- forms and input types;
- portals;
- Suspense;
- styling approaches;
- routing as ecosystem material;
- transitions;
- refs;
- common Hooks;
- custom Hooks;
- compiler awareness.

Where common tutorials still emphasize class components, HOCs, `forwardRef`, or older setup patterns, this handbook teaches them later as legacy/maintenance or pattern knowledge rather than the modern beginner path.

## Audit rules

Whenever the stable React minor changes:

1. re-check `react.dev/versions`;
2. re-check the Hooks, Components, APIs, Directives, and React DOM indexes;
3. compare the npm stable patch;
4. inspect release notes for additions/removals;
5. update this table before claiming complete coverage;
6. label Canary/Experimental material explicitly;
7. build the site and verify all links/sidebar IDs.

## References

- https://react.dev/versions
- https://react.dev/reference/react
- https://react.dev/reference/react/hooks
- https://react.dev/reference/react/components
- https://react.dev/reference/react/apis
- https://react.dev/reference/rsc/directives
- https://react.dev/reference/react-dom
- https://react.dev/reference/react-dom/hooks
- https://react.dev/reference/react-dom/client
- https://react.dev/reference/react-dom/server
- https://react.dev/reference/react-dom/static
- https://react.dev/reference/react-compiler
- https://react.dev/blog/2025/10/01/react-19-2
- https://react.dev/blog/2025/10/07/react-compiler-1

## Next audit

Re-run this audit whenever React publishes a new stable minor or major, or when an API changes stability status.