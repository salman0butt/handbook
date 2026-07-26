---
title: Official React API Coverage
description: React 19.2 coverage checklist for the handbook across React, React DOM, Compiler, Server Components, TypeScript, testing, accessibility, performance, architecture, and legacy APIs.
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

The handbook now covers the path from JavaScript prerequisites through React 19.2 production architecture:

- rendering, JSX, components, props, events, state, lists, forms, and keys;
- Effects, refs, custom Hooks, Context, reducers, and state architecture;
- React 19 Actions, `useActionState`, `useFormStatus`, `useOptimistic`, `use`, and `<Activity>`;
- Suspense, code splitting, Transitions, deferred rendering, and concurrent rendering;
- React DOM, hydration, streaming SSR, static rendering, resume/PPR architecture;
- Server Components, Server Functions, `'use client'`, `'use server'`, `cache`, and `cacheSignal`;
- React Compiler 1.0, automatic memoization, directives, diagnostics, library compilation, and rollout;
- Rules of React and compiler-aware ESLint;
- React + TypeScript, modern testing, and accessibility;
- measurement-first performance engineering, manual memoization, `<Profiler>`, React 19.2 Performance Tracks, specialized performance Hooks, state/update scope, design systems, and advanced composition patterns.

## React Hooks

| API | Handbook coverage | Status | Version |
| --- | --- | --- | --- |
| `useActionState` | Modern React 19+ | ✅ Covered | 19+ |
| `useCallback` | Performance / Compiler | ✅ Covered | Stable |
| `useContext` | Context + TypeScript | ✅ Covered | Stable |
| `useDebugValue` | Performance / specialized Hooks | ✅ Covered | Stable |
| `useDeferredValue` | Concurrency + performance | ✅ Covered | Stable |
| `useEffect` | Effects + testing + performance | ✅ Covered | Stable |
| `useEffectEvent` | useEffectEvent | ✅ Covered | 19.2+ |
| `useId` | Accessibility | ✅ Covered | Stable |
| `useImperativeHandle` | Refs + TypeScript | ✅ Covered | Stable |
| `useInsertionEffect` | Performance / specialized Hooks | ✅ Covered | Stable |
| `useLayoutEffect` | Performance / specialized Hooks | ✅ Covered | Stable |
| `useMemo` | Performance / Compiler | ✅ Covered | Stable |
| `useOptimistic` | Modern React + async testing | ✅ Covered | 19+ |
| `useReducer` | Reducers + TypeScript | ✅ Covered | Stable |
| `useRef` | Refs + TypeScript + accessibility | ✅ Covered | Stable |
| `useState` | State + TypeScript | ✅ Covered | Stable |
| `useSyncExternalStore` | State architecture + performance | ✅ Covered | Stable |
| `useTransition` | Concurrency + performance | ✅ Covered | Stable |

## Built-in React components

| API | Handbook coverage | Status |
| --- | --- | --- |
| `<Fragment>` | JSX | ✅ Covered |
| `<Profiler>` | Profiler and React Performance Tracks | ✅ Covered |
| `<StrictMode>` | Getting Started / Rules / Testing | ✅ Covered |
| `<Suspense>` | Suspense + async testing + performance | ✅ Covered |
| `<Activity>` | Modern React 19+ / Performance Tracks | ✅ Covered — 19.2+ |

## React APIs

| API | Handbook coverage | Status |
| --- | --- | --- |
| `createContext` | Context + architecture | ✅ Covered |
| `lazy` | Suspense / code splitting | ✅ Covered |
| `memo` | memo, useMemo, and useCallback | ✅ Covered |
| `startTransition` | Concurrency / performance scheduling | ✅ Covered |
| `act` | Async React Testing | ✅ Covered |
| `use` | Modern React + Suspense + Server Components | ✅ Covered |
| `cache` | Server Components | ✅ Covered |
| `cacheSignal` | Server Components | ✅ Covered — 19.2+ |
| `captureOwnerStack` | Advanced debugging | 🟡 Planned |

## React Server Component directives

| Directive | Handbook coverage | Status |
| --- | --- | --- |
| `'use client'` | Server Components and Client Boundaries | ✅ Covered |
| `'use server'` | Server Functions and Mutation Boundaries | ✅ Covered |

These directives require an RSC-compatible framework/bundler environment. A normal client-only Vite app does not provide complete RSC infrastructure.

## React DOM Hook

| API | Handbook coverage | Status |
| --- | --- | --- |
| `useFormStatus` | Modern React forms + async testing | ✅ Covered — 19+ |

## React DOM components

| Area | Handbook coverage | Status |
| --- | --- | --- |
| HTML components in JSX | JSX / Forms / React DOM / Accessibility | ✅ Covered |
| event props and propagation | Events / TypeScript | ✅ Covered |
| native forms and controls | Forms / TypeScript / Accessibility | ✅ Covered |
| DOM refs / callback refs | Refs / TypeScript / architecture | ✅ Covered |
| metadata/resource components | Metadata and Resource Loading | ✅ Covered |
| SVG behavior and accessibility | React DOM Components | ✅ Covered |
| custom elements / Web Components | React DOM Components | ✅ Covered |
| `dangerouslySetInnerHTML` | React DOM Components | ✅ Covered |
| `contentEditable` ownership caveats | React DOM Components | ✅ Covered |
| `suppressHydrationWarning` | Hydration / React DOM | ✅ Covered |
| semantic names / labels / ARIA relationships | Accessibility / Design Systems | ✅ Covered |
| keyboard / focus behavior for custom widgets | Accessibility / Design Systems | ✅ Covered |

## React DOM APIs

| API | Handbook coverage | Status |
| --- | --- | --- |
| `createPortal` | React DOM escape hatches + dialogs | ✅ Covered |
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
| `hydrateRoot` | Hydration + testing strategy | ✅ Covered |

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
| serializable client-boundary props | Server Components + TypeScript | ✅ Covered |
| Promise handoff to Client Components | Server Components | ✅ Covered |
| Server Functions | Server Functions and Mutation Boundaries | ✅ Covered |
| mutation security / authorization | Server Functions + testing strategy | ✅ Covered |
| runtime input validation | Server Functions + TypeScript trust boundaries | ✅ Covered |
| RSC request memoization | `cache` and `cacheSignal` | ✅ Covered |
| RSC cancellation lifetime | `cache` and `cacheSignal` | ✅ Covered |

The application-facing Server Component model is stable in React 19, but framework/bundler implementation APIs beneath RSC do not share the same minor-version compatibility guarantee. Prefer framework-supported integrations.

## React Compiler

React Compiler 1.0 is stable and first-class handbook material.

| Topic | Handbook coverage | Status |
| --- | --- | --- |
| Compiler mental model | Compiler Mental Model and Setup | ✅ Covered |
| installation/setup | Compiler Mental Model and Setup | ✅ Covered |
| React 17/18/19 targets | Compiler Mental Model and Setup | ✅ Covered |
| automatic memoization | Compiler + Performance | ✅ Covered |
| Compiler vs `memo` / `useMemo` / `useCallback` | Compiler + Performance | ✅ Covered |
| configuration / incremental adoption | Adoption, Configuration, and Directives | ✅ Covered |
| `compilationMode` / gating | Adoption, Configuration, and Directives | ✅ Covered |
| `"use memo"` / `"use no memo"` | Adoption, Configuration, and Directives | ✅ Covered |
| diagnostics / skipped components | Libraries, Debugging, and Production Rollout | ✅ Covered |
| compiling libraries | Libraries, Debugging, and Production Rollout | ✅ Covered |
| production rollout / measurement | Compiler + Performance | ✅ Covered |

## Rules of React

| Rule area | Handbook coverage | Status |
| --- | --- | --- |
| components and Hooks must be pure | Rules of React | ✅ Covered |
| idempotent rendering | Rules of React | ✅ Covered |
| side effects outside render | Rules + Effects | ✅ Covered |
| props/state immutability | Rules + reducers | ✅ Covered |
| Hook arguments/return immutability | Rules of React | ✅ Covered |
| safe local mutation | Rules of React | ✅ Covered |
| ref render safety | Rules of React | ✅ Covered |
| static component identity | Rules / Architecture | ✅ Covered |
| Rules of Hooks | Rules of Hooks and Compiler-Aware ESLint | ✅ Covered |
| conditional/loop exception for `use` | Rules of Hooks and Compiler-Aware ESLint | ✅ Covered |
| compiler-aware lint diagnostics | Rules of Hooks and Compiler-Aware ESLint | ✅ Covered |

## TypeScript

| Area | Handbook coverage | Status |
| --- | --- | --- |
| setup / `.tsx` / React type packages | Components, Props, Children, and Events | ✅ Covered |
| prop contracts and inference | TypeScript section | ✅ Covered |
| children / events / native DOM prop reuse | TypeScript section | ✅ Covered |
| React 19 ref-as-prop typing | TypeScript + Design Systems | ✅ Covered |
| Hooks / reducers / context / refs | TypeScript section | ✅ Covered |
| FormData / runtime trust boundaries | TypeScript section | ✅ Covered |
| generic Hooks / reusable APIs | TypeScript section | ✅ Covered |
| polymorphic/design-system API trade-offs | TypeScript + Design Systems | ✅ Covered |
| RSC serialization vs compile-time typing | TypeScript section | ✅ Covered |

## Testing

| Area | Handbook coverage | Status |
| --- | --- | --- |
| React Testing Library philosophy | Testing React Through User Behavior | ✅ Covered |
| semantic query selection / user interactions | Testing section | ✅ Covered |
| async `act` / `findBy` / `waitFor` | Async React Testing | ✅ Covered |
| Suspense / Transitions / deferred UI | Async React Testing | ✅ Covered |
| Actions / optimistic success + rollback | Async React Testing | ✅ Covered |
| unit/component/integration/E2E portfolio | Production React Testing Strategy | ✅ Covered |
| SSR/hydration/RSC testing boundaries | Production React Testing Strategy | ✅ Covered |
| Server Function backend tests | Production React Testing Strategy | ✅ Covered |
| design-system contract testing | Design Systems and Component APIs | ✅ Covered |

## Accessibility

| Area | Handbook coverage | Status |
| --- | --- | --- |
| native semantics first | Accessibility + Design Systems | ✅ Covered |
| accessible names / descriptions | Accessibility | ✅ Covered |
| labels / `useId` / ARIA relationships | Accessibility + Design Systems | ✅ Covered |
| landmarks / headings / image alternatives | Accessibility | ✅ Covered |
| keyboard accessibility | Accessibility + Design Systems | ✅ Covered |
| roving `tabIndex` / `aria-activedescendant` | Accessibility | ✅ Covered |
| focus management / restoration | Accessibility + Design Systems | ✅ Covered |
| dialogs / validation / live regions | Accessibility | ✅ Covered |
| Suspense/Transition orientation | Accessibility | ✅ Covered |
| client-side navigation accessibility | Accessibility | ✅ Covered |

## Performance

| Area | Handbook coverage | Status |
| --- | --- | --- |
| measurement-first optimization | Measure Before Optimizing | ✅ Covered |
| render frequency vs render cost | Measure Before Optimizing | ✅ Covered |
| `memo` | memo, useMemo, and useCallback | ✅ Covered |
| `useMemo` | memo, useMemo, and useCallback | ✅ Covered |
| `useCallback` | memo, useMemo, and useCallback | ✅ Covered |
| Compiler vs manual memoization | Compiler + Performance | ✅ Covered |
| `<Profiler>` | Profiler and React Performance Tracks | ✅ Covered |
| React 19.2 Performance Tracks | Profiler and React Performance Tracks | ✅ Covered |
| Scheduler/Components/Server tracks | Profiler and React Performance Tracks | ✅ Covered |
| cascading-update diagnosis | Performance chapters | ✅ Covered |
| `useLayoutEffect` | Layout, Insertion, and Debug Hooks | ✅ Covered |
| `useInsertionEffect` | Layout, Insertion, and Debug Hooks | ✅ Covered |
| `useDebugValue` | Layout, Insertion, and Debug Hooks | ✅ Covered |
| update scope / state placement | Render Cost, State Placement, and Scheduling | ✅ Covered |
| Context update-frequency architecture | Performance + Architecture | ✅ Covered |
| external-store subscription strategy | Performance + State Architecture | ✅ Covered |
| Transition/deferred scheduling | Performance + Concurrency | ✅ Covered |
| list scaling / virtualization direction | Render Cost, State Placement, and Scheduling | ✅ Covered |
| network/bundle/hydration cost categories | Measure Before Optimizing | ✅ Covered |

## Architecture and patterns

| Area | Handbook coverage | Status |
| --- | --- | --- |
| component/state ownership | Component and State Architecture | ✅ Covered |
| feature-oriented structure | Component and State Architecture | ✅ Covered |
| local/Context/URL/server/external state boundaries | Architecture + State Architecture | ✅ Covered |
| async/Suspense/Error boundaries | Component and State Architecture | ✅ Covered |
| Server/Client Component boundaries | Component and State Architecture | ✅ Covered |
| third-party adapters | Component Architecture + Advanced Patterns | ✅ Covered |
| design-system primitive contracts | Design Systems and Component APIs | ✅ Covered |
| variants / native prop reuse / refs | Design Systems and Component APIs | ✅ Covered |
| compound components | Design Systems + Advanced Patterns | ✅ Covered |
| controlled/uncontrolled APIs | Design Systems + Advanced Patterns | ✅ Covered |
| slots / polymorphic APIs | Design Systems and Component APIs | ✅ Covered |
| render props / HOCs | Advanced Composition Patterns | ✅ Covered |
| reducer/state-machine thinking | Architecture + Advanced Patterns | ✅ Covered |
| dependency injection with Context | Advanced Composition Patterns | ✅ Covered |

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
| `react-test-renderer/shallow` | ⚠️ Removed package path — covered | avoid shallow rendering |
| `react-dom/test-utils` helpers | ⚠️ Removed/deprecated direction — covered | `act` from `react` + modern tools |
| `element.ref` access | ⚠️ Deprecated — covered | `element.props.ref` if unavoidable |
| `forwardRef` as default new-code pattern | ⚠️ Historical in React 19+ | ref as a prop |
| class components | ⚠️ Legacy for new teaching, still supported | functions + Hooks for new code |
| `renderToNodeStream` | ⚠️ Removed in React 19 | modern server streaming APIs |
| `renderToStaticNodeStream` | ⚠️ Removed in React 19 | modern server/static APIs |

## Still planned

The remaining handbook depth is now concentrated in senior/internals and production-specialist topics:

- `captureOwnerStack` and advanced debugging workflows;
- application security beyond the Server Function/raw HTML foundations already covered;
- reconciliation internals, Fiber/scheduling internals, ownership stacks, and render debugging;
- legacy React maintenance and migration strategy beyond React 19 API removals;
- production engineering, observability, failure handling, and large-team practices;
- portfolio projects and interview preparation.

## Audit rules

Whenever the stable React minor changes:

1. re-check `react.dev/versions`;
2. re-check React Hooks, Components, APIs, and Directives;
3. re-check React DOM Hooks, Components, APIs, Client, Server, and Static APIs;
4. compare the latest stable npm patch;
5. inspect release notes for additions, removals, and changed recommendations;
6. re-check React Compiler configuration/directives and `eslint-plugin-react-hooks` recommended rules;
7. re-check React Performance Tracks and profiling guidance;
8. update this checklist before claiming complete coverage;
9. clearly label Stable, Canary, Experimental, and Legacy material;
10. run the Docusaurus production build and verify sidebar IDs and links.

## References

- https://react.dev/versions
- https://react.dev/reference/react
- https://react.dev/reference/react/hooks
- https://react.dev/reference/react/apis
- https://react.dev/reference/react/memo
- https://react.dev/reference/react/useMemo
- https://react.dev/reference/react/useCallback
- https://react.dev/reference/react/Profiler
- https://react.dev/reference/react/useLayoutEffect
- https://react.dev/reference/react/useInsertionEffect
- https://react.dev/reference/react/useDebugValue
- https://react.dev/reference/dev-tools/react-performance-tracks
- https://react.dev/reference/react-dom
- https://react.dev/reference/react-dom/client
- https://react.dev/reference/react-dom/server
- https://react.dev/reference/react-dom/static
- https://react.dev/reference/rsc/server-components
- https://react.dev/reference/rsc/server-functions
- https://react.dev/learn/react-compiler
- https://react.dev/reference/eslint-plugin-react-hooks
- https://react.dev/reference/rules
- https://react.dev/learn/typescript
- https://react.dev/reference/react/act
- https://react.dev/reference/react/useId
- https://testing-library.com/docs/react-testing-library/intro/
- https://www.w3.org/WAI/ARIA/apg/
- https://react.dev/blog/2025/10/01/react-19-2
