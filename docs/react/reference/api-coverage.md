---
title: Official React API Coverage
description: React 19.2 coverage checklist for the handbook across React, React DOM, Compiler, Server Components, TypeScript, testing, accessibility, and legacy APIs.
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

The handbook now covers the path from JavaScript prerequisites through React 19.2 application architecture, Compiler 1.0, TypeScript, testing, and accessibility:

- rendering, JSX, components, props, events, state, lists, forms, and keys;
- Effects, refs, custom Hooks, Context, reducers, and state architecture;
- React 19 Actions, `useActionState`, `useFormStatus`, `useOptimistic`, `use`, and `<Activity>`;
- Suspense, code splitting, Transitions, deferred rendering, and concurrent rendering;
- React DOM escape hatches, hydration, streaming SSR, static rendering, resume/PPR architecture;
- Server Components, Server Functions, `'use client'`, `'use server'`, `cache`, and `cacheSignal`;
- React Compiler 1.0, automatic memoization, adoption modes, directives, diagnostics, libraries, and rollout;
- Rules of React: purity, immutability, Hook ordering, refs, static identities, and compiler-aware ESLint;
- React + TypeScript component contracts, Hooks, reducers, context, refs, forms, generics, library APIs, and runtime trust boundaries;
- user-oriented React testing, async `act`, Suspense/Transitions/Actions testing, and production testing strategy;
- semantic accessibility, accessible names, `useId`, keyboard/focus models, forms, dialogs, dynamic announcements, and navigation orientation.

## React Hooks

| API | Handbook coverage | Status | Version |
| --- | --- | --- | --- |
| `useActionState` | Modern React 19+ | ✅ Covered | 19+ |
| `useCallback` | Compiler automatic/manual memoization | 🟠 Foundation covered; performance deep dive planned | Stable |
| `useContext` | Context + TypeScript | ✅ Covered | Stable |
| `useDebugValue` | Hook debugging | 🟡 Planned | Stable |
| `useDeferredValue` | Concurrency + async testing | ✅ Covered | Stable |
| `useEffect` | Effects + testing | ✅ Covered | Stable |
| `useEffectEvent` | useEffectEvent | ✅ Covered | 19.2+ |
| `useId` | Accessibility foundations | ✅ Covered | Stable |
| `useImperativeHandle` | Refs + TypeScript | ✅ Covered | Stable |
| `useInsertionEffect` | Layout & insertion effects | 🟡 Planned | Stable |
| `useLayoutEffect` | Layout & insertion effects | 🟡 Planned | Stable |
| `useMemo` | Compiler automatic/manual memoization | 🟠 Foundation covered; performance deep dive planned | Stable |
| `useOptimistic` | Modern React + async testing | ✅ Covered | 19+ |
| `useReducer` | Reducers + TypeScript | ✅ Covered | Stable |
| `useRef` | Refs + TypeScript + accessibility focus | ✅ Covered | Stable |
| `useState` | State + TypeScript | ✅ Covered | Stable |
| `useSyncExternalStore` | State Architecture + TypeScript | ✅ Covered | Stable |
| `useTransition` | Concurrency + async testing | ✅ Covered | Stable |

## Built-in React components

| API | Handbook coverage | Status |
| --- | --- | --- |
| `<Fragment>` | JSX | ✅ Covered |
| `<Profiler>` | Performance | 🟡 Planned |
| `<StrictMode>` | Getting Started / Rules / Testing | ✅ Covered |
| `<Suspense>` | Suspense + async testing | ✅ Covered |
| `<Activity>` | Modern React 19+ | ✅ Covered — 19.2+ |

## React APIs

| API | Handbook coverage | Status |
| --- | --- | --- |
| `createContext` | Context + TypeScript | ✅ Covered |
| `lazy` | Suspense / code splitting | ✅ Covered |
| `memo` | Compiler automatic/manual memoization | 🟠 Foundation covered; performance deep dive planned |
| `startTransition` | Concurrency | ✅ Covered |
| `act` | Async React Testing | ✅ Covered |
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
| `useFormStatus` | Modern React forms + async testing | ✅ Covered — 19+ |

## React DOM components

| Area | Handbook coverage | Status |
| --- | --- | --- |
| HTML components in JSX | JSX / Forms / React DOM / Accessibility | ✅ Covered |
| event props and propagation | Events / TypeScript | ✅ Covered |
| native forms and controls | Forms / TypeScript / Accessibility | ✅ Covered |
| DOM refs / callback refs | Refs / TypeScript | ✅ Covered |
| `<title>` / `<meta>` / `<link>` | Metadata and Resource Loading | ✅ Covered |
| `<style>` / `<script>` special behavior | Metadata and Resource Loading | ✅ Covered |
| SVG behavior and accessibility | React DOM Components | ✅ Covered |
| custom elements / Web Components | React DOM Components | ✅ Covered |
| `dangerouslySetInnerHTML` | React DOM Components | ✅ Covered |
| `contentEditable` ownership caveats | React DOM Components | ✅ Covered |
| `suppressHydrationWarning` | Hydration / React DOM | ✅ Covered |
| semantic names / labels / ARIA relationships | Accessibility | ✅ Covered |
| keyboard / focus behavior for custom widgets | Accessibility | ✅ Covered |

## React DOM APIs

| API | Handbook coverage | Status |
| --- | --- | --- |
| `createPortal` | React DOM escape hatches + dialog accessibility | ✅ Covered |
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
| `hydrateRoot` | Hydration and hydrateRoot + testing strategy | ✅ Covered |

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
| serializable client-boundary props | Server Components + TypeScript caveats | ✅ Covered |
| Promise handoff to Client Components | Server Components and Client Boundaries | ✅ Covered |
| Server Functions | Server Functions and Mutation Boundaries | ✅ Covered |
| mutation security / authorization | Server Functions + testing strategy | ✅ Covered |
| runtime input validation | Server Functions + TypeScript trust boundaries | ✅ Covered |
| RSC request memoization | cache and cacheSignal | ✅ Covered |
| RSC cancellation lifetime | cache and cacheSignal | ✅ Covered |

The application-facing Server Component model is stable in React 19, but framework/bundler implementation APIs beneath RSC do not share the same minor-version compatibility guarantee. Prefer framework-supported integrations.

## React Compiler

React Compiler 1.0 is stable and first-class handbook material.

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
| compiler-aware lint diagnostics | Rules of Hooks and Compiler-Aware ESLint | ✅ Covered |

## TypeScript

| Area | Handbook coverage | Status |
| --- | --- | --- |
| setup / `.tsx` / React type packages | Components, Props, Children, and Events | ✅ Covered |
| prop contracts and inference | Components, Props, Children, and Events | ✅ Covered |
| children / events / native DOM prop reuse | Components, Props, Children, and Events | ✅ Covered |
| React 19 ref-as-prop typing | Components, Props, Children, and Events | ✅ Covered |
| `useState` / async state unions | Typing Hooks, Context, Reducers, Forms, and Refs | ✅ Covered |
| reducer actions / exhaustiveness | Typing Hooks, Context, Reducers, Forms, and Refs | ✅ Covered |
| context nullability / provider guards | Typing Hooks, Context, Reducers, Forms, and Refs | ✅ Covered |
| DOM refs / imperative handles | Typing Hooks, Context, Reducers, Forms, and Refs | ✅ Covered |
| FormData / runtime trust boundaries | TypeScript section | ✅ Covered |
| generic Hooks / reusable APIs | TypeScript section | ✅ Covered |
| polymorphic and design-system API trade-offs | Advanced Component API Design | ✅ Covered |
| RSC serialization vs compile-time typing | Advanced Component API Design | ✅ Covered |

## Testing

| Area | Handbook coverage | Status |
| --- | --- | --- |
| React Testing Library philosophy | Testing React Through User Behavior | ✅ Covered |
| semantic query selection | Testing React Through User Behavior | ✅ Covered |
| user interactions | Testing React Through User Behavior | ✅ Covered |
| provider / reducer / network boundary strategy | Testing React Through User Behavior | ✅ Covered |
| async `act` | Async React Testing | ✅ Covered |
| `findBy` / `waitFor` / disappearance | Async React Testing | ✅ Covered |
| Suspense / Transitions / deferred UI | Async React Testing | ✅ Covered |
| Actions / `useActionState` / `useFormStatus` | Async React Testing | ✅ Covered |
| optimistic success + rollback | Async React Testing | ✅ Covered |
| unit/component/integration/E2E portfolio | Production React Testing Strategy | ✅ Covered |
| SSR/hydration/RSC testing boundaries | Production React Testing Strategy | ✅ Covered |
| Server Function backend tests | Production React Testing Strategy | ✅ Covered |
| type tests vs runtime tests | Production React Testing Strategy | ✅ Covered |

## Accessibility

| Area | Handbook coverage | Status |
| --- | --- | --- |
| native semantics first | Accessibility Foundations | ✅ Covered |
| accessible names / descriptions | Accessibility Foundations | ✅ Covered |
| visible labels / form relationships | Accessibility Foundations | ✅ Covered |
| `useId` | Accessibility Foundations | ✅ Covered |
| landmarks / headings / image alternatives | Accessibility Foundations | ✅ Covered |
| ARIA state synchronization | Accessibility Foundations | ✅ Covered |
| keyboard accessibility | Keyboard, Focus, Forms, Dialogs, and Dynamic UI | ✅ Covered |
| roving `tabIndex` / `aria-activedescendant` | Keyboard, Focus, Forms, Dialogs, and Dynamic UI | ✅ Covered |
| focus management / restoration | Keyboard, Focus, Forms, Dialogs, and Dynamic UI | ✅ Covered |
| dialogs | Keyboard, Focus, Forms, Dialogs, and Dynamic UI | ✅ Covered |
| validation summaries / live regions | Keyboard, Focus, Forms, Dialogs, and Dynamic UI | ✅ Covered |
| Suspense/Transition orientation | Keyboard, Focus, Forms, Dialogs, and Dynamic UI | ✅ Covered |
| client-side navigation accessibility | Keyboard, Focus, Forms, Dialogs, and Dynamic UI | ✅ Covered |
| semantic/keyboard/focus tests | Accessibility + Testing | ✅ Covered |

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

The remaining handbook depth is concentrated in specialist and production topics:

- stable Hooks still needing dedicated reference depth: `useDebugValue`, `useLayoutEffect`, `useInsertionEffect`;
- dedicated `memo`, `useMemo`, and `useCallback` performance/reference depth;
- `<Profiler>` and production performance tooling;
- `captureOwnerStack` and advanced debugging;
- application security beyond the Server Function/raw HTML foundations already covered;
- performance architecture, design systems, and advanced patterns;
- internals, reconciliation depth, legacy React maintenance, and production engineering;
- projects and interview preparation.

## Audit rules

Whenever the stable React minor changes:

1. re-check `react.dev/versions`;
2. re-check React Hooks, Components, APIs, and Directives;
3. re-check React DOM Hooks, Components, APIs, Client, Server, and Static APIs;
4. compare the latest stable npm patch;
5. inspect release notes for additions, removals, and changed recommendations;
6. re-check React Compiler configuration/directives and `eslint-plugin-react-hooks` recommended rules;
7. re-check the official TypeScript guide and relevant React 19 type migration notes;
8. update this checklist before claiming complete coverage;
9. clearly label Stable, Canary, Experimental, and Legacy material;
10. run the Docusaurus production build and verify sidebar IDs and links.

## References

- https://react.dev/versions
- https://react.dev/reference/react
- https://react.dev/reference/react/hooks
- https://react.dev/reference/react/apis
- https://react.dev/learn/typescript
- https://react.dev/reference/react/act
- https://react.dev/reference/react/useId
- https://react.dev/reference/react-dom
- https://react.dev/reference/react-dom/client
- https://react.dev/reference/react-dom/server
- https://react.dev/reference/react-dom/static
- https://react.dev/reference/rsc/server-components
- https://react.dev/reference/rsc/server-functions
- https://react.dev/learn/react-compiler
- https://react.dev/reference/eslint-plugin-react-hooks
- https://react.dev/reference/rules
- https://testing-library.com/docs/react-testing-library/intro/
- https://testing-library.com/docs/queries/about/
- https://testing-library.com/docs/dom-testing-library/api-async/
- https://www.w3.org/WAI/ARIA/apg/
- https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/
- https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/
