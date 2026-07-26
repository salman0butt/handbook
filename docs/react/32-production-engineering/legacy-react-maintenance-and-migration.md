---
title: Legacy React Maintenance and Migration
description: How senior engineers maintain class-heavy and pre-React-19 systems, migrate incrementally, and avoid risky rewrites.
sidebar_position: 2
---

# Legacy React Maintenance and Migration

Senior React work is not always greenfield.

Many production systems contain combinations of:

- class components;
- old lifecycle methods;
- older Context patterns;
- pre-hooks abstractions;
- render props and higher-order components;
- old React Router/data libraries;
- deprecated testing tools;
- legacy root APIs;
- custom webpack/Babel configurations;
- inconsistent state ownership;
- years of business-critical behavior.

The goal is not to make the codebase look modern overnight.

The goal is to **reduce risk while improving architecture**.

## Do not rewrite just because code is old

A rewrite replaces known production behavior with unproven behavior.

Rewrites can be justified, but age alone is not enough.

Before choosing a rewrite, evaluate:

- defect rate;
- change velocity;
- security risk;
- unsupported dependencies;
- test coverage;
- deployment architecture;
- team knowledge;
- migration compatibility;
- cost of running old and new systems in parallel.

Incremental migration is often safer.

## Class components are still supported

Modern React recommends function components for new code, but class components remain supported.

Do not convert stable classes mechanically if the change has no user/business value.

Prioritize migrations where they unlock:

- React 19 features;
- Compiler adoption;
- better architecture;
- testability;
- removal of deprecated APIs;
- simpler ownership;
- performance fixes;
- dependency upgrades.

## Error Boundaries are a special case

In React 19.2, Error Boundary lifecycle APIs still live on class components.

A codebase can be function-component-first while keeping a small reusable class Error Boundary.

That is not architectural failure.

Use modern React where it improves the system; do not pursue aesthetic purity.

## Lifecycle mapping is conceptual, not mechanical

Old class lifecycle code often combines multiple responsibilities.

```jsx
class ChatRoom extends React.Component {
  componentDidMount() {
    this.connect();
    document.title = this.props.roomName;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.roomId !== this.props.roomId) {
      this.disconnect();
      this.connect();
    }

    document.title = this.props.roomName;
  }

  componentWillUnmount() {
    this.disconnect();
  }
}
```

Do not translate line-by-line into one giant Effect.

Instead identify synchronization processes:

```jsx
function ChatRoom({ roomId, roomName }) {
  useEffect(() => {
    const connection = connect(roomId);
    return () => connection.disconnect();
  }, [roomId]);

  useEffect(() => {
    document.title = roomName;
  }, [roomName]);
}
```

Effects model synchronization processes, not lifecycle buckets.

## `UNSAFE_` lifecycle methods require scrutiny

Legacy code may use:

- `UNSAFE_componentWillMount`;
- `UNSAFE_componentWillReceiveProps`;
- `UNSAFE_componentWillUpdate`.

These methods are risky in modern rendering because their historical assumptions do not align well with interruptible/repeated render work.

Migration should ask what the code was trying to accomplish:

```text
prop-derived state?
→ probably derive in render or redesign state ownership

external synchronization?
→ Effect / subscription API

DOM measurement before mutation?
→ rare lifecycle/layout-effect equivalent

memoized computation?
→ derive during render; optimize only if measured
```

Do not merely rename deprecated methods.

## Derived state is a frequent legacy smell

Legacy class code often copies props into state:

```jsx
state = {
  name: this.props.user.name,
};
```

Then tries to synchronize it later.

Before preserving that pattern, ask:

- should this value be derived directly from props?
- is local editing state actually a separate concept?
- should identity reset with a key?
- is there one source of truth?

Many migration bugs disappear when ownership is corrected rather than translated.

## Legacy Context

React 19 removed legacy Context APIs.

Modern Context uses:

```jsx
const ThemeContext = createContext(null);
```

and React 19 provider shorthand:

```jsx
<ThemeContext value={theme}>
  <App />
</ThemeContext>
```

Migration should isolate old context consumers/providers and replace them domain-by-domain.

Avoid creating one giant `LegacyContextReplacement` object that recreates the same coupling with a new API.

## String refs are removed

Old:

```jsx
<input ref="search" />
```

Modern direction:

```jsx
const inputRef = useRef(null);
<input ref={inputRef} />
```

or callback refs when setup/cleanup behavior is needed.

## `findDOMNode` is removed

Old abstractions may locate host nodes indirectly.

Modern code should use explicit refs and ownership.

```jsx
function Input(props) {
  const inputRef = useRef(null);
  return <input ref={inputRef} {...props} />;
}
```

React 19's ref-as-prop support makes new function-component ref APIs simpler in many cases.

## Legacy root APIs are removed

Modern client roots use:

```jsx
import { createRoot } from 'react-dom/client';

const root = createRoot(container);
root.render(<App />);
```

Server-rendered roots use:

```jsx
hydrateRoot(container, <App />);
```

Old `ReactDOM.render` and `ReactDOM.hydrate` are not React 19 migration targets.

## `react-test-renderer` is deprecated

A legacy test suite may heavily assert implementation structure.

Do not convert all snapshots blindly.

Prioritize business-critical behavior and migrate toward:

- Testing Library;
- semantic queries;
- user interactions;
- integration tests;
- E2E tests for critical flows.

Keep narrow low-level tests only when they protect real contracts.

## New JSX transform

React 19 requires the modern JSX transform.

Old build systems may still assume React must be imported purely for JSX:

```jsx
import React from 'react';
```

That import can still be used when APIs are needed, but build tooling should support the modern transform.

Treat build modernization as a separate migration track from component rewriting.

## Upgrade dependencies before adopting features

A practical migration order:

```text
1. get current tests/build stable
2. remove React warnings
3. upgrade build/runtime dependencies
4. migrate removed APIs
5. verify React 19 compatibility
6. stabilize production
7. then adopt new features incrementally
```

Do not combine framework upgrades, state-library rewrites, design-system replacements, and React-major migration in one giant release unless unavoidable.

## React 18.3 as migration warning bridge

For older React applications, the React 19 upgrade guide recommended moving through React 18.3 first because it behaves like 18.2 while surfacing warnings for APIs that change in React 19.

For a historical codebase, warnings are useful migration inventory.

If you are already on React 19, use the migration guide to audit old code rather than downgrading.

## Codemods are accelerators, not reviewers

Official/community codemods can automate syntax transformations.

But codemods cannot reliably decide:

- correct state ownership;
- Effect architecture;
- Error Boundary granularity;
- domain identity;
- accessibility behavior;
- security authorization;
- whether a custom abstraction is still needed.

After a codemod:

1. review the diff;
2. run tests;
3. run lint/compiler diagnostics;
4. test critical flows;
5. profile if behavior/performance changed.

## Preserve behavior before improving architecture

A safe refactor often has two phases.

### Phase A: behavior-preserving migration

```text
old API
→ modern equivalent
```

Keep behavior stable.

### Phase B: architectural improvement

```text
modern but awkward code
→ clearer state/effect/component architecture
```

Separating the phases makes regressions easier to diagnose.

## Strangler migration pattern

For large systems, migrate feature boundaries gradually.

```text
Legacy application
├── Legacy Account
├── Legacy Billing
├── Modern Search
└── Modern Checkout
```

Over time, the modern surface grows.

Useful boundaries include:

- routes;
- pages;
- embedded widgets;
- domain features;
- shared design-system primitives.

## Shared state complicates strangler migrations

Legacy and modern islands can become tightly coupled through shared mutable global state.

Create explicit adapters:

```text
legacy store
→ adapter/subscription boundary
→ modern React feature
```

`useSyncExternalStore` is appropriate for subscribing to external stores when you have a correct `subscribe/getSnapshot` contract.

Do not copy the entire store into React state using Effects.

## HOCs and render props are not automatically bad

Older React ecosystems used:

```jsx
withAuth(Component)
```

and:

```jsx
<DataProvider render={data => <View data={data} />} />
```

Hooks often provide a simpler composition model, but migrating every HOC/render prop may not be worth the churn.

Migrate when:

- the abstraction blocks TypeScript inference;
- nesting makes debugging difficult;
- it prevents RSC/client-boundary architecture;
- it duplicates logic better represented by a custom Hook;
- the dependency is unsupported.

## Refs during migration

React 19 lets function components receive `ref` as a prop.

Legacy libraries may still expose `forwardRef` APIs.

Do not break public library compatibility simply to remove `forwardRef` immediately.

For application code, new APIs can prefer ref-as-prop where supported.

For published libraries, consider supported React version ranges and consumer types.

## Class state and reducer migration

Complex class state:

```jsx
this.setState({ ... })
```

may map better to:

- multiple local `useState` values;
- `useReducer` for related transitions;
- domain state moved outside the component;
- server cache rather than client state.

Do not choose `useReducer` merely because the old class had a large `state` object.

## Testing migration risk

Before refactoring a poorly tested legacy feature, add characterization tests.

A characterization test asks:

> What does the system do today?

Even if behavior is odd, capturing it first helps distinguish deliberate fixes from accidental regressions.

Then update tests as intentional behavior changes are approved.

## Migration observability

For risky migrations, compare old and new paths using:

- feature flags;
- error rates;
- interaction latency;
- conversion/task completion;
- backend request rate;
- hydration errors;
- memory usage for long-lived screens.

A technically successful migration that degrades user outcomes is not successful.

## Delete compatibility code

Temporary adapters become permanent unless tracked.

When a migration is complete:

- remove old code path;
- remove feature flag;
- delete compatibility layer;
- update docs;
- remove unused dependencies;
- simplify tests.

Migration debt is still debt.

## Senior migration plan template

```text
Current state
- React/runtime version
- removed/deprecated APIs
- build tooling
- testing confidence
- critical user flows

Target state
- supported React version
- modern root/hydration
- feature boundaries
- compiler/lint strategy

Migration slices
1. ...
2. ...
3. ...

Safety
- tests
- telemetry
- feature flags
- rollback

Exit criteria
- legacy APIs removed
- warning-free
- error/perf baseline maintained
- compatibility code deleted
```

## Interview questions

### Should every class component be converted to a function?

No. Prioritize changes that reduce risk, remove unsupported APIs, improve architecture, or unlock needed capabilities.

### How do class lifecycles map to Effects?

Do not map lifecycle buckets mechanically. Identify independent synchronization processes and model each according to its dependencies/cleanup.

### Are HOCs obsolete?

No. Hooks often simplify logic reuse, but HOCs remain a valid composition pattern when they provide a useful boundary or compatibility layer.

### Rewrite or incremental migration?

Usually incremental migration reduces risk, but the decision depends on architecture, compatibility, testability, team cost, and product constraints.

## Exercise

Create a migration plan for a React 16 application containing:

- class components;
- legacy Context;
- string refs;
- `ReactDOM.render`;
- `react-test-renderer` snapshots;
- a large Redux store;
- old webpack config.

Sequence the work so production stays deployable after every step.

## References

- https://react.dev/blog/2024/04/25/react-19-upgrade-guide
- https://react.dev/reference/react/Component
- https://react.dev/reference/react-dom/client/createRoot
- https://react.dev/reference/react-dom/client/hydrateRoot
- https://react.dev/reference/react/useSyncExternalStore
- https://react.dev/reference/react-compiler
