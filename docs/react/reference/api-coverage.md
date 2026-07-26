---
title: Official React API Coverage
description: Final React 19.2 coverage contract across React, React DOM, Compiler, RSC, TypeScript, testing, accessibility, performance, architecture, internals, production engineering, projects, and interview mastery.
sidebar_position: 1
---

# Official React API coverage

> **Documentation line:** React 19.2  
> **Stable npm packages checked:** `react@19.2.8`, `react-dom@19.2.8`  
> **Audit date:** 2026-07-26

This page is the handbook's ongoing coverage contract.

The original 12-phase roadmap is now complete against the stable React 19.2 line. Future work is maintenance and expansion when React stable changes, not unfinished foundational coverage.

For the long-form audit, see **[Final React Handbook Completeness Audit](./final-completeness-audit.md)**.

Statuses:

- ✅ **Covered** — dedicated or substantial handbook coverage exists;
- ⚠️ **Legacy** — maintenance/migration knowledge, not a modern recommendation;
- 🧪 **Experimental/Canary** — clearly labeled and not treated as stable production React;
- 🔒 **Private implementation** — useful conceptual context, never an application contract.

## Stable React Hooks

| API | Coverage | Status |
| --- | --- | --- |
| `useActionState` | Modern React forms/actions | ✅ |
| `useCallback` | Performance / Compiler | ✅ |
| `useContext` | Context / architecture / TypeScript | ✅ |
| `useDebugValue` | Performance / custom-Hook debugging | ✅ |
| `useDeferredValue` | Concurrency / performance | ✅ |
| `useEffect` | Effects / production debugging | ✅ |
| `useEffectEvent` | Effects | ✅ 19.2+ |
| `useId` | Accessibility | ✅ |
| `useImperativeHandle` | Refs / TypeScript | ✅ |
| `useInsertionEffect` | Performance / CSS-in-JS infrastructure | ✅ |
| `useLayoutEffect` | Layout measurement / performance | ✅ |
| `useMemo` | Performance / Compiler | ✅ |
| `useOptimistic` | Modern React / mutation workflows | ✅ |
| `useReducer` | Reducers / architecture | ✅ |
| `useRef` | Refs / focus / integration | ✅ |
| `useState` | State fundamentals / TypeScript | ✅ |
| `useSyncExternalStore` | External stores / live state | ✅ |
| `useTransition` | Concurrency / scheduling | ✅ |

## Built-in React components

| API | Coverage | Status |
| --- | --- | --- |
| `<Fragment>` | JSX | ✅ |
| `<Profiler>` | Performance | ✅ |
| `<StrictMode>` | Getting Started / Rules / debugging | ✅ |
| `<Suspense>` | Suspense / testing / streaming | ✅ |
| `<Activity>` | Modern React / performance | ✅ 19.2+ |

## Stable React APIs

| API | Coverage | Status |
| --- | --- | --- |
| `createContext` | Context / architecture | ✅ |
| `lazy` | Suspense / code splitting | ✅ |
| `memo` | Performance / Compiler | ✅ |
| `startTransition` | Concurrency / scheduling | ✅ |
| `act` | Async testing | ✅ |
| `use` | Modern React / Suspense / RSC | ✅ |
| `cache` | Server Components | ✅ |
| `cacheSignal` | Server Components | ✅ 19.2+ |
| `captureOwnerStack` | Debugging / Owner Stacks | ✅ development diagnostic |

## React Server Component directives

| Directive | Coverage | Status |
| --- | --- | --- |
| `'use client'` | Server/Client boundaries | ✅ |
| `'use server'` | Server Functions / security | ✅ |

The handbook explicitly distinguishes Server Components from SSR and `'use server'` from a Server Component marker.

## React DOM Hook

| API | Coverage | Status |
| --- | --- | --- |
| `useFormStatus` | Modern forms / actions / testing | ✅ |

## React DOM behavior

| Area | Status |
| --- | --- |
| HTML elements in JSX | ✅ |
| event props / propagation | ✅ |
| native forms and controls | ✅ |
| DOM refs / callback refs | ✅ |
| metadata/resource elements | ✅ |
| SVG | ✅ |
| custom elements / Web Components | ✅ |
| `dangerouslySetInnerHTML` | ✅ + security coverage |
| `contentEditable` ownership caveats | ✅ |
| `suppressHydrationWarning` | ✅ narrow-use guidance |
| accessible names / labels / ARIA relationships | ✅ |
| keyboard / focus contracts | ✅ |

## Stable React DOM APIs

| API | Status |
| --- | --- |
| `createPortal` | ✅ |
| `flushSync` | ✅ |
| `prefetchDNS` | ✅ |
| `preconnect` | ✅ |
| `preload` | ✅ |
| `preloadModule` | ✅ |
| `preinit` | ✅ |
| `preinitModule` | ✅ |

## React DOM client APIs

| API | Status |
| --- | --- |
| `createRoot` | ✅ |
| `root.render()` | ✅ |
| `root.unmount()` | ✅ |
| `hydrateRoot` | ✅ |
| `onCaughtError` root option | ✅ |
| `onUncaughtError` root option | ✅ |
| `onRecoverableError` root option | ✅ |

## React DOM server APIs

| API | Status |
| --- | --- |
| `renderToReadableStream` | ✅ |
| `renderToPipeableStream` | ✅ |
| `resume` | ✅ |
| `resumeToPipeableStream` | ✅ |
| `renderToString` | ✅ limitations covered |
| `renderToStaticMarkup` | ✅ non-hydratable output covered |

## React DOM static APIs

| API | Status |
| --- | --- |
| `prerender` | ✅ |
| `prerenderToNodeStream` | ✅ |
| `resumeAndPrerender` | 🧪 Experimental; architecture discussed |
| `resumeAndPrerenderToNodeStream` | 🧪 Experimental; architecture discussed |

## Modern React 19 / 19.2

Covered:

- Actions and async transitions;
- form action functions;
- `useActionState`;
- `useFormStatus`;
- `useOptimistic`;
- `use`;
- ref as a prop;
- modern Context provider syntax;
- metadata/resource APIs;
- `<Activity>`;
- `useEffectEvent`;
- `cacheSignal`;
- React Performance Tracks;
- Partial Pre-rendering/resume architecture;
- React 19 removals and migration knowledge.

## React Compiler 1.0

| Area | Status |
| --- | --- |
| mental model / setup | ✅ |
| automatic memoization | ✅ |
| Compiler vs `memo` / `useMemo` / `useCallback` | ✅ |
| configuration / `compilationMode` | ✅ |
| gating / incremental adoption | ✅ |
| `"use memo"` / `"use no memo"` | ✅ |
| diagnostics / skipped components | ✅ |
| library compilation | ✅ |
| production rollout / measurement | ✅ |

## Rules of React

| Area | Status |
| --- | --- |
| render purity / idempotence | ✅ |
| side effects outside render | ✅ |
| props/state immutability | ✅ |
| Hook argument/return immutability | ✅ |
| safe local mutation | ✅ |
| ref render safety | ✅ |
| static component identity | ✅ |
| Rules of Hooks | ✅ |
| conditional/loop exception for `use` | ✅ |
| compiler-aware ESLint diagnostics | ✅ |

## Rendering, identity, and concurrency

Covered:

- render triggers;
- render vs commit;
- browser paint relationship;
- state snapshots and queued updates;
- keys and identity;
- state preservation/reset;
- reconciliation;
- Fiber as a work structure;
- interruptible/restartable/abandoned render work;
- scheduling priorities;
- urgent vs non-urgent updates;
- Suspense reveal boundaries;
- transitions;
- deferred values;
- request ordering/cancellation as separate concerns.

Private Fiber fields and lane bitmasks remain 🔒 private implementation detail.

## TypeScript, testing, and accessibility

| Area | Status |
| --- | --- |
| component/prop/event typing | ✅ |
| React 19 ref-as-prop typing | ✅ |
| Hooks / Context / reducer / ref typing | ✅ |
| discriminated unions / generics / polymorphic APIs | ✅ |
| runtime trust-boundary validation | ✅ |
| Testing Library / semantic user testing | ✅ |
| async `act` / `findBy` / `waitFor` | ✅ |
| Suspense / Transition / Action testing | ✅ |
| SSR / hydration / RSC test strategy | ✅ |
| semantic HTML / accessible names / `useId` | ✅ |
| keyboard / focus / dialogs / forms / live regions | ✅ |

## Performance and architecture

| Area | Status |
| --- | --- |
| profile-before-optimizing workflow | ✅ |
| `<Profiler>` / Performance Tracks | ✅ |
| `memo` / `useMemo` / `useCallback` | ✅ |
| state placement / update scope | ✅ |
| Context update-frequency architecture | ✅ |
| external-store subscription strategy | ✅ |
| list scaling / virtualization direction | ✅ |
| bundle / network / hydration cost categories | ✅ |
| feature-oriented architecture | ✅ |
| design-system contracts | ✅ |
| compound / controlled / slot / render-prop / HOC patterns | ✅ |
| Server/Client / async / Error boundary architecture | ✅ |

## Debugging and production engineering

| Area | Status |
| --- | --- |
| Error Boundary behavior / granularity | ✅ |
| Component Stack vs Owner Stack | ✅ |
| `captureOwnerStack` | ✅ |
| root caught/uncaught/recoverable error callbacks | ✅ |
| hydration / release / source-map triage | ✅ |
| observability / traces / incident response | ✅ |
| raw HTML / XSS trust boundary | ✅ |
| Server Function validation / authn / authz | ✅ |
| tenant / secret / telemetry boundaries | ✅ |
| legacy class/lifecycle maintenance | ✅ |
| removed/deprecated API migration | ✅ |
| incremental/strangler migration | ✅ |
| large-team ownership / governance | ✅ |
| senior trade-offs / reversibility / rollout | ✅ |

## Projects and interview mastery

Phase 12 closes the learning loop with:

- progressive projects from fundamentals to production architecture;
- real-time operations dashboard capstone;
- commerce/action/optimistic workflow capstone;
- multi-team SaaS platform architecture capstone;
- junior→senior React interview mastery;
- debugging/performance/security scenario drills;
- React system-design and trade-off exercises;
- staff-level architecture and leadership scenarios.

## React 19 removed/deprecated/legacy coverage

| API / pattern | Status | Modern direction |
| --- | --- | --- |
| `ReactDOM.render` | ⚠️ Removed — covered | `createRoot` |
| `ReactDOM.hydrate` | ⚠️ Removed — covered | `hydrateRoot` |
| `ReactDOM.unmountComponentAtNode` | ⚠️ Removed — covered | `root.unmount()` |
| `ReactDOM.findDOMNode` | ⚠️ Removed — covered | refs |
| string refs | ⚠️ Removed — covered | callback/object refs |
| legacy Context | ⚠️ Removed — covered | modern Context |
| `React.createFactory` | ⚠️ Removed — covered | JSX |
| function component `defaultProps` behavior | ⚠️ Removed behavior — covered | default parameters |
| function component `propTypes` checks | ⚠️ Removed behavior — covered | TypeScript + runtime validation |
| `react-test-renderer` | ⚠️ Deprecated — covered | user-focused testing |
| shallow renderer path | ⚠️ Removed/deprecated direction — covered | behavior testing |
| `react-dom/test-utils` helpers | ⚠️ Removed/deprecated direction — covered | `act` from `react` + modern tools |
| `element.ref` access | ⚠️ Deprecated — covered | `element.props.ref` if unavoidable |
| `forwardRef` as default new-code pattern | ⚠️ Historical in React 19+ | ref as a prop |
| class components | ⚠️ supported legacy/new teaching is function-first | functions + Hooks for most new code |
| `renderToNodeStream` | ⚠️ Removed | modern streaming APIs |
| `renderToStaticNodeStream` | ⚠️ Removed | modern static/server APIs |

## Completion status

**No original roadmap phase remains planned.**

The handbook is complete for the audited React 19.2 stable line. Future changes should follow the maintenance process below.

## Maintenance rules

Whenever stable React changes:

1. re-check `react.dev/versions`;
2. re-check stable npm `react` and `react-dom` tags;
3. audit Hooks, built-in components, React APIs, and RSC directives;
4. audit React DOM Hook/components/client/server/static APIs;
5. inspect release notes for additions, removals, and changed recommendations;
6. re-check React Compiler configuration/directives;
7. re-check `eslint-plugin-react-hooks` recommended rules;
8. re-check Performance Tracks and debugging/error APIs;
9. clearly separate Stable, Canary, Experimental, Legacy, and private implementation material;
10. update this page and the final completeness audit;
11. run the Docusaurus production build before merging.

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
- https://react.dev/reference/eslint-plugin-react-hooks
- https://react.dev/reference/rules
- https://react.dev/reference/dev-tools/react-performance-tracks
- https://www.npmjs.com/package/react
- https://www.npmjs.com/package/react-dom
