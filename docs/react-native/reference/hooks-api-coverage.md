---
id: hooks-api-coverage
title: React and React Native Hooks Coverage Audit
---

# React and React Native Hooks Coverage Audit

**Baseline:** React **19.2.3** as pinned by the React Native 0.86 Community Template.

| Hook | Role in RN applications | Coverage |
| --- | --- | --- |
| `useState` | local component state | 041–050 and fundamentals |
| `useEffect` | synchronize with external systems/subscriptions | 046–050 |
| `useLayoutEffect` | layout-sensitive synchronous effect where justified | effects/layout/performance sections |
| `useMemo` | cache expensive derived computation as an optimization | React fundamentals/performance |
| `useCallback` | cache function identity where downstream equality benefits | lists/performance |
| `useRef` | persistent mutable reference/native element refs | TypeScript/hooks/forms |
| `useReducer` | explicit local/feature state transitions | 045–050 |
| `useContext` | scoped dependency/state propagation | 045–050 |
| `useTransition` | mark non-urgent React updates | modern React/performance/New Architecture reasoning |
| `useDeferredValue` | defer rendering of a value without changing source ownership | modern React/performance |
| `useSyncExternalStore` | subscribe React to external stores with consistent snapshots | state-management architecture |
| `useColorScheme` | React Native appearance subscription | styling/theme |
| `useWindowDimensions` | reactive window dimensions | responsive layout |

## Guidance

Hooks are React APIs unless explicitly provided by React Native. React Native-specific hooks such as `useColorScheme` and `useWindowDimensions` connect React rendering to platform state. A hook's availability follows the React version bundled/supported by the React Native baseline; this handbook does not assume APIs from a newer React release than the template uses.

The performance rule is especially important on mobile: `useMemo` and `useCallback` are optimizations, not correctness mechanisms. The code must remain correct if React recomputes a memoized value or recreates a callback. Measure row rendering, interaction latency and frame stability before spreading memoization across the app.
