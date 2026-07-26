---
title: Official React API Coverage
description: React 19.2 coverage checklist across React, React DOM, Compiler, Server Components, TypeScript, testing, accessibility, performance, architecture, internals, debugging, and production engineering.
sidebar_position: 1
---

# Official React API coverage

> **Reference line: React 19.2**  
> **Latest stable package checked: 19.2.8**  
> **Audit date: 2026-07-26**

This page is the handbook's coverage contract. It prevents the curriculum from becoming a collection of favorite topics while silently missing stable React APIs or important production concepts.

Statuses:

- ✅ **Covered** — dedicated or substantial handbook coverage exists;
- 🟠 **Foundation covered** — correct working model exists, but more specialist depth may be added later;
- 🟡 **Planned** — not yet written to the handbook quality bar;
- ⚠️ **Legacy** — maintenance/migration knowledge, not a recommendation for new code;
- 🧪 **Experimental/Canary** — not treated as stable production React.

The official React documentation is authoritative. Stable npm package versions are checked independently because patch releases can appear before the React versions page is refreshed.

## Curriculum coverage so far

The handbook now covers the path from JavaScript prerequisites through senior React production engineering:

- rendering, JSX, components, props, events, state, lists, forms, and identity;
- Effects, refs, custom Hooks, Context, reducers, and state architecture;
- React 19 Actions, modern forms, optimistic UI, `use`, and `<Activity>`;
- Suspense, code splitting, Transitions, deferred rendering, and concurrent rendering;
- React DOM, hydration, streaming SSR, static rendering, resume/PPR architecture;
- Server Components, Server Functions, directives, `cache`, and `cacheSignal`;
- React Compiler 1.0 and compiler-aware Rules/ESLint;
- React + TypeScript, testing, accessibility, performance, design systems, and advanced composition;
- reconciliation identity, Fiber/render-work mental models, scheduling and commit semantics;
- Error Boundaries, component stacks, Owner Stacks, root error callbacks, hydration diagnostics, and incident triage;
- application security, legacy React maintenance, large-team ownership, and senior architectural decision-making.

## React Hooks

| API | Handbook coverage | Status | Version |
| --- | --- | --- | --- |
| `useActionState` | Modern React 19+ | ✅ Covered | 19+ |
| `useCallback` | Performance / Compiler | ✅ Covered | Stable |
| `useContext` | Context + TypeScript + architecture | ✅ Covered | Stable |
| `useDebugValue` | Performance / specialized Hooks | ✅ Covered | Stable |
| `useDeferredValue` | Concurrency + performance | ✅ Covered | Stable |
| `useEffect` | Effects + testing + production | ✅ Covered | Stable |
| `useEffectEvent` | useEffectEvent | ✅ Covered | 19.2+ |
| `useId` | Accessibility | ✅ Covered | Stable |
| `useImperativeHandle` | Refs + TypeScript | ✅ Covered | Stable |
| `useInsertionEffect` | Performance / specialized Hooks | ✅ Covered | Stable |
| `useLayoutEffect` | Performance / specialized Hooks | ✅ Covered | Stable |
| `useMemo` | Performance / Compiler | ✅ Covered | Stable |
| `useOptimistic` | Modern React + async testing | ✅ Covered | 19+ |
| `useReducer` | Reducers + TypeScript + architecture | ✅ Covered | Stable |
| `useRef` | Refs + TypeScript + accessibility | ✅ Covered | Stable |
| `useState` | State + TypeScript | ✅ Covered | Stable |
| `useSyncExternalStore` | State architecture + legacy adapters | ✅ Covered | Stable |
| `useTransition` | Concurrency + scheduling internals | ✅ Covered | Stable |

## Built-in React components

| API | Handbook coverage | Status |
| --- | --- | --- |
| `<Fragment>` | JSX | ✅ Covered |
| `<Profiler>` | Profiler and React Performance Tracks | ✅ Covered |
| `<StrictMode>` | Getting Started / Rules / debugging | ✅ Covered |
| `<Suspense>` | Suspense + testing + scheduling | ✅ Covered |
| `<Activity>` | Modern React 19+ / Performance Tracks | ✅ Covered — 19.2+ |

## React APIs

| API | Handbook coverage | Status |
| --- | --- | --- |
| `createContext` | Context + architecture | ✅ Covered |
| `lazy` | Suspense / code splitting | ✅ Covered |
| `memo` | Performance | ✅ Covered |
| `startTransition` | Concurrency / scheduling internals | ✅ Covered |
| `act` | Async React Testing | ✅ Covered |
| `use` | Modern React + Suspense + RSC | ✅ Covered |
| `cache` | Server Components | ✅ Covered |
| `cacheSignal` | Server Components | ✅ Covered — 19.2+ |
| `captureOwnerStack` | Error Boundaries, Owner Stacks, and Root Error Handling | ✅ Covered — development only |

## React Server Component directives

| Directive | Handbook coverage | Status |
| --- | --- | --- |
| `'use client'` | Server Components and Client Boundaries | ✅ Covered |
| `'use server'` | Server Functions + Security | ✅ Covered |

RSC directives require a compatible framework/bundler environment. A normal client-only Vite application does not provide complete RSC infrastructure.

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
| `dangerouslySetInnerHTML` | React DOM + Security | ✅ Covered |
| `contentEditable` ownership caveats | React DOM Components | ✅ Covered |
| `suppressHydrationWarning` | Hydration / React DOM | ✅ Covered |
| semantic names / labels / ARIA relationships | Accessibility / Design Systems | ✅ Covered |
| keyboard / focus behavior | Accessibility / Design Systems | ✅ Covered |

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
| `createRoot` | Rendering + root error handling | ✅ Covered |
| `root.render()` | Rendering a React Application | ✅ Covered |
| `root.unmount()` | Rendering / Hydration | ✅ Covered |
| `hydrateRoot` | Hydration + root error handling | ✅ Covered |
| `onCaughtError` | Root error handling / observability | ✅ Covered |
| `onUncaughtError` | Root error handling / observability | ✅ Covered |
| `onRecoverableError` | Hydration + observability | ✅ Covered |

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
| Promise handoff | Server Components | ✅ Covered |
| Server Functions | Server Functions and Mutation Boundaries | ✅ Covered |
| untrusted Server Function arguments | Security and Trust Boundaries | ✅ Covered |
| authentication / resource authorization | Security and Trust Boundaries | ✅ Covered |
| runtime input validation | Security + TypeScript trust boundaries | ✅ Covered |
| RSC request memoization | `cache` and `cacheSignal` | ✅ Covered |
| RSC cancellation lifetime | `cache` and `cacheSignal` | ✅ Covered |

The application-facing Server Component model is stable in React 19, but framework/bundler implementation APIs beneath RSC do not share the same minor-version compatibility guarantee. Prefer framework-supported integrations.

## React Compiler

React Compiler 1.0 is stable and first-class handbook material.

| Topic | Handbook coverage | Status |
| --- | --- | --- |
| mental model / setup | Compiler Mental Model and Setup | ✅ Covered |
| React version targets | Compiler Mental Model and Setup | ✅ Covered |
| automatic memoization | Compiler + Performance | ✅ Covered |
| Compiler vs manual memoization | Compiler + Performance | ✅ Covered |
| configuration / incremental adoption | Adoption, Configuration, and Directives | ✅ Covered |
| `compilationMode` / gating | Adoption, Configuration, and Directives | ✅ Covered |
| `"use memo"` / `"use no memo"` | Adoption, Configuration, and Directives | ✅ Covered |
| diagnostics / skipped components | Libraries, Debugging, and Production Rollout | ✅ Covered |
| compiling libraries | Libraries, Debugging, and Production Rollout | ✅ Covered |
| production rollout / measurement | Compiler + Performance | ✅ Covered |

## Rules of React

| Area | Handbook coverage | Status |
| --- | --- | --- |
| render purity / idempotence | Rules + Fiber internals | ✅ Covered |
| side effects outside render | Rules + Effects | ✅ Covered |
| props/state immutability | Rules + Reducers | ✅ Covered |
| Hook argument/return immutability | Rules of React | ✅ Covered |
| safe local mutation | Rules of React | ✅ Covered |
| ref render safety | Rules of React | ✅ Covered |
| static component identity | Rules + Reconciliation | ✅ Covered |
| Rules of Hooks | Compiler-Aware ESLint | ✅ Covered |
| conditional/loop exception for `use` | Compiler-Aware ESLint | ✅ Covered |
| compiler-aware lint diagnostics | Compiler-Aware ESLint | ✅ Covered |

## TypeScript, testing, and accessibility

| Area | Status |
| --- | --- |
| component / prop / event typing | ✅ Covered |
| React 19 ref-as-prop typing | ✅ Covered |
| Hook / Context / reducer / ref typing | ✅ Covered |
| generics / polymorphic APIs / trust boundaries | ✅ Covered |
| Testing Library user-oriented testing | ✅ Covered |
| async `act`, Suspense, Actions, optimistic testing | ✅ Covered |
| SSR/hydration/RSC testing strategy | ✅ Covered |
| semantic HTML / accessible names / `useId` | ✅ Covered |
| keyboard, focus, dialogs, forms, live regions | ✅ Covered |

## Performance, architecture, and design systems

| Area | Status |
| --- | --- |
| measurement-first optimization | ✅ Covered |
| `memo` / `useMemo` / `useCallback` | ✅ Covered |
| `<Profiler>` / React 19.2 Performance Tracks | ✅ Covered |
| `useLayoutEffect` / `useInsertionEffect` / `useDebugValue` | ✅ Covered |
| state placement / update scope / scheduling | ✅ Covered |
| feature-oriented component/state architecture | ✅ Covered |
| Server/Client / async / Error boundaries | ✅ Covered |
| design-system primitives and API contracts | ✅ Covered |
| compound / controlled / slot / render-prop / HOC patterns | ✅ Covered |

## Internals and senior debugging

| Area | Handbook coverage | Status |
| --- | --- | --- |
| reconciliation mental model | Reconciliation, Identity, and State Preservation | ✅ Covered |
| type + position + key identity | Reconciliation, Identity, and State Preservation | ✅ Covered |
| state preservation/reset | Reconciliation, Identity, and State Preservation | ✅ Covered |
| Fiber as internal unit/work architecture | Fiber, Render Work, and Scheduling | ✅ Covered — implementation-aware, not API |
| render vs commit | Fiber, Render Work, and Scheduling | ✅ Covered |
| interruption / restart / abandoned work | Fiber, Render Work, and Scheduling | ✅ Covered |
| scheduling priorities / Transition intent | Fiber, Render Work, and Scheduling | ✅ Covered |
| lane internals | Fiber, Render Work, and Scheduling | ✅ Conceptual only — private implementation |
| Error Boundary behavior/granularity | Error Boundaries, Owner Stacks, and Root Error Handling | ✅ Covered |
| component stack vs Owner Stack | Error Boundaries, Owner Stacks, and Root Error Handling | ✅ Covered |
| `captureOwnerStack` | Error Boundaries, Owner Stacks, and Root Error Handling | ✅ Covered |
| root caught/uncaught/recoverable callbacks | Error Boundaries, Owner Stacks, and Root Error Handling | ✅ Covered |
| hydration/error/release triage | Production Observability and Failure Triage | ✅ Covered |
| source maps / release correlation / traces | Production Observability and Failure Triage | ✅ Covered |

## Production engineering

| Area | Handbook coverage | Status |
| --- | --- | --- |
| raw HTML / XSS trust boundary | Security and Trust Boundaries | ✅ Covered |
| Server Function validation/authentication/authorization | Security and Trust Boundaries | ✅ Covered |
| secrets / client boundaries / telemetry redaction | Security and Trust Boundaries | ✅ Covered |
| URL / third-party / dependency trust | Security and Trust Boundaries | ✅ Covered |
| class-heavy legacy maintenance | Legacy React Maintenance and Migration | ✅ Covered |
| lifecycle-to-Effect migration | Legacy React Maintenance and Migration | ✅ Covered |
| removed/deprecated API migration | React 19 Migration + Legacy Maintenance | ✅ Covered |
| strangler/incremental migration | Legacy React Maintenance and Migration | ✅ Covered |
| feature/module/team ownership | Large-Team React Engineering | ✅ Covered |
| design-system/package governance | Large-Team React Engineering | ✅ Covered |
| ADR/RFC/deprecation/change management | Large-Team React Engineering | ✅ Covered |
| senior state/render/effect/boundary decisions | Senior React Architectural Decision-Making | ✅ Covered |
| reversibility / rollout / architecture trade-offs | Senior React Architectural Decision-Making | ✅ Covered |

## React 19 removed/deprecated/legacy coverage

| API / pattern | Status | Modern direction |
| --- | --- | --- |
| `ReactDOM.render` | ⚠️ Removed — covered | `createRoot` |
| `ReactDOM.hydrate` | ⚠️ Removed — covered | `hydrateRoot` |
| `ReactDOM.unmountComponentAtNode` | ⚠️ Removed — covered | `root.unmount()` |
| `ReactDOM.findDOMNode` | ⚠️ Removed — covered | explicit refs |
| string refs | ⚠️ Removed — covered | callback/object refs |
| legacy Context | ⚠️ Removed — covered | modern Context |
| `React.createFactory` | ⚠️ Removed | JSX |
| function component `defaultProps` | ⚠️ Removed behavior — covered | JavaScript default parameters |
| function component `propTypes` checks | ⚠️ Removed behavior — covered | TypeScript / runtime validation |
| `react-test-renderer` | ⚠️ Deprecated — covered | user-focused testing tools |
| `react-test-renderer/shallow` | ⚠️ Removed path — covered | avoid shallow rendering |
| `react-dom/test-utils` helpers | ⚠️ Removed/deprecated direction — covered | `act` from `react` + modern tools |
| `element.ref` access | ⚠️ Deprecated — covered | `element.props.ref` if unavoidable |
| `forwardRef` as default new-code pattern | ⚠️ Historical in React 19+ | ref as a prop |
| class components | ⚠️ Legacy for new teaching, still supported | functions + Hooks for most new code |
| `renderToNodeStream` | ⚠️ Removed in React 19 | modern server streaming APIs |
| `renderToStaticNodeStream` | ⚠️ Removed in React 19 | modern server/static APIs |

## Still planned

The remaining curriculum is now concentrated in **Phase 12 capstones and interview preparation**, rather than missing stable React API coverage:

- progressive projects from fundamentals to senior production architecture;
- debugging/performance/security capstone scenarios;
- React interview questions from junior through staff-level reasoning;
- architecture exercises and trade-off drills;
- final stable-API audit and handbook completion pass.

## Audit rules

Whenever the stable React minor changes:

1. re-check `react.dev/versions`;
2. re-check React Hooks, Components, APIs, Directives, DOM client/server/static APIs;
3. compare the latest stable npm patch;
4. inspect release notes for additions/removals/recommendation changes;
5. re-check React Compiler configuration/directives and `eslint-plugin-react-hooks` rules;
6. re-check React Performance Tracks and profiling guidance;
7. re-check Owner Stack / error-handling APIs;
8. update this checklist before claiming complete coverage;
9. clearly label Stable, Canary, Experimental, Legacy, and private implementation details;
10. run the Docusaurus production build and verify sidebar IDs and links.

## References

- https://react.dev/versions
- https://react.dev/reference/react
- https://react.dev/reference/react/hooks
- https://react.dev/reference/react/apis
- https://react.dev/learn/preserving-and-resetting-state
- https://react.dev/learn/render-and-commit
- https://react.dev/reference/react/Component
- https://react.dev/reference/react/captureOwnerStack
- https://react.dev/reference/react-dom
- https://react.dev/reference/react-dom/client/createRoot
- https://react.dev/reference/react-dom/client/hydrateRoot
- https://react.dev/reference/react-dom/server
- https://react.dev/reference/react-dom/static
- https://react.dev/reference/rsc/server-components
- https://react.dev/reference/rsc/server-functions
- https://react.dev/reference/rsc/use-server
- https://react.dev/reference/react-dom/components/common
- https://react.dev/reference/dev-tools/react-performance-tracks
- https://react.dev/learn/react-compiler
- https://react.dev/reference/eslint-plugin-react-hooks
- https://react.dev/reference/rules
- https://react.dev/blog/2024/04/25/react-19-upgrade-guide
- https://react.dev/blog/2025/10/01/react-19-2
- https://github.com/acdlite/react-fiber-architecture
