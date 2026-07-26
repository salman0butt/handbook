---
title: State Management Ecosystem Coverage
description: Versioned coverage contract for Context, Redux Toolkit, Zustand, TanStack Query, React Hook Form, and state-tool decision architecture.
sidebar_position: 3
---

# State management ecosystem coverage

> **Audit date:** 2026-07-26

This page tracks ecosystem state-management coverage separately from the official React API coverage page.

These libraries are **not React core APIs**. They are ecosystem choices that solve different ownership and lifecycle problems.

## Version baseline

| Tool | Stable line audited | Status |
|---|---:|---|
| React Context / reducers / external-store APIs | React 19.2 docs line | ✅ |
| Redux Toolkit | 2.12.0 | ✅ |
| Zustand | 5.0.14 | ✅ |
| TanStack Query | 5.101.4 | ✅ |
| React Hook Form | 7.82.0 | ✅ |
| React Hook Form 8 | beta | 🧪 not production baseline |

Versions must be re-checked before future maintenance because ecosystem packages can release independently of React.

## Context and built-in state management

| Area | Status |
|---|---|
| `useState` state ownership | ✅ |
| `useReducer` transition model | ✅ |
| `createContext` / `useContext` | ✅ |
| React 19 provider syntax | ✅ |
| provider scope | ✅ |
| value identity | ✅ |
| reducer + Context | ✅ |
| read/write Context split | ✅ |
| Context performance/debugging | ✅ |
| Context vs external store | ✅ |
| testing providers | ✅ |

## Redux Toolkit 2.12

| Area | Status |
|---|---|
| Redux mental model | ✅ |
| `configureStore` | ✅ |
| `createSlice` | ✅ |
| generated actions/reducers | ✅ |
| React-Redux `Provider` | ✅ |
| typed `useDispatch` / `useSelector` | ✅ |
| selectors and derived state | ✅ |
| selector result identity | ✅ |
| `createAsyncThunk` decision space | ✅ |
| RTK Query | ✅ |
| tag invalidation | ✅ |
| optimistic cache strategy | ✅ |
| entity normalization direction | ✅ |
| middleware/listener direction | ✅ |
| TypeScript | ✅ |
| testing | ✅ |
| performance | ✅ |
| persistence/security | ✅ |
| large-team ownership | ✅ |
| Redux vs Context/Zustand/Query | ✅ |

## Zustand 5.0

| Area | Status |
|---|---|
| `create` | ✅ |
| state/actions | ✅ |
| selector subscriptions | ✅ |
| update functions / shallow object merge | ✅ |
| derived values | ✅ |
| external store access | ✅ |
| multiple-store architecture | ✅ |
| shallow-selection direction | ✅ |
| async actions | ✅ |
| persist middleware | ✅ |
| devtools middleware | ✅ |
| persistent-state migrations | ✅ |
| `createStore` / vanilla store direction | ✅ |
| SSR/request isolation | ✅ |
| hydration constraints | ✅ |
| TypeScript | ✅ |
| testing/fresh store factories | ✅ |
| security boundaries | ✅ |
| Zustand vs Context/Redux/Query | ✅ |

## TanStack Query 5.101

| Area | Status |
|---|---|
| `QueryClient` / provider | ✅ |
| `useQuery` | ✅ |
| array query keys | ✅ |
| query functions | ✅ |
| key factories | ✅ |
| freshness / `staleTime` | ✅ |
| cache retention / `gcTime` distinction | ✅ |
| important defaults | ✅ |
| request cancellation | ✅ |
| dependent-query waterfalls | ✅ |
| `useMutation` | ✅ |
| `invalidateQueries` | ✅ |
| direct cache updates | ✅ |
| optimistic UI | ✅ |
| rollback/reconciliation | ✅ |
| pagination | ✅ |
| infinite-query direction | ✅ |
| prefetching | ✅ |
| Suspense mental model | ✅ |
| SSR/dehydrate/hydrate | ✅ |
| request-safe server QueryClient | ✅ |
| Server Component decision space | ✅ |
| testing | ✅ |
| security | ✅ |
| TanStack Query vs client-state stores | ✅ |

## React Hook Form 7.82

| Area | Status |
|---|---|
| `useForm` | ✅ |
| `register` | ✅ |
| `handleSubmit` | ✅ |
| `formState` | ✅ |
| default values | ✅ |
| dirty/touched concepts | ✅ |
| field validation | ✅ |
| runtime/server validation boundary | ✅ |
| `watch` / `useWatch` | ✅ |
| `Controller` | ✅ |
| controlled widget integration | ✅ |
| `FormProvider` / `useFormContext` | ✅ |
| `useFormState` | ✅ |
| `useFieldArray` | ✅ |
| dynamic-field identity | ✅ |
| TypeScript form models | ✅ |
| performance/subscription granularity | ✅ |
| testing | ✅ |
| accessible validation UI | ✅ |
| server error mapping | ✅ |
| React 19 Actions relationship | ✅ |
| TanStack Query mutation integration | ✅ |
| global-store duplication risks | ✅ |

## Cross-tool decision architecture

| Area | Status |
|---|---|
| local vs shared vs server vs form vs URL state | ✅ |
| source-of-truth decision tree | ✅ |
| lifetime/scope/update frequency | ✅ |
| Context vs Redux Toolkit | ✅ |
| Context vs Zustand | ✅ |
| Redux Toolkit vs Zustand | ✅ |
| Redux/RTK Query vs TanStack Query | ✅ |
| Zustand vs TanStack Query | ✅ |
| React Hook Form vs global store | ✅ |
| URL state vs client store | ✅ |
| combining tools without duplication | ✅ |
| query data → form default workflow | ✅ |
| migration adapters without dual ownership | ✅ |
| Context → Redux/Zustand migration | ✅ |
| manual API state → TanStack Query migration | ✅ |
| global form state → RHF migration | ✅ |
| state ownership documentation | ✅ |

## Maintenance rules

For future ecosystem maintenance:

1. check npm `latest` tags;
2. read official release notes/migration guides;
3. inspect current official docs for changed APIs/defaults;
4. keep prerelease/beta APIs separate from the production baseline;
5. re-run every code sample mentally/through build syntax constraints;
6. update version numbers on this page;
7. update comparisons if a library's recommended architecture changes;
8. run the production Docusaurus build before merge.

## Primary references

- https://react.dev/learn/managing-state
- https://redux.js.org/tutorials/index
- https://redux-toolkit.js.org/rtk-query/overview
- https://zustand.docs.pmnd.rs
- https://tanstack.com/query/latest/docs/framework/react/overview
- https://react-hook-form.com/docs
