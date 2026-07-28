---
title: Context Architecture and Performance
description: Design Context providers deliberately, split read and write concerns, understand value identity, and avoid unnecessary global coupling.
sidebar_position: 2
---

import {
  VisualDiagram,
  DiagramStack,
  DiagramGrid,
  DiagramNode,
  DiagramArrow,
  DecisionTree,
  LifecycleBar,
} from '@site/src/components/handbook/VisualDiagram'

# Context architecture and performance

Context is simple at the API level and architectural at the application level.

The difficult questions are not how to call `createContext` or `useContext`. They are about **ownership, scope, update frequency, subscriptions, and coupling**.

<VisualDiagram title="The real Context design questions">
  <DiagramGrid columns={3}>
    <DiagramNode title="Ownership" tone="blue">Who actually owns and changes this state?</DiagramNode>
    <DiagramNode title="Scope" tone="purple">Which subtree needs access?</DiagramNode>
    <DiagramNode title="Change pattern" tone="cyan">Which consumers should update together?</DiagramNode>
    <DiagramNode title="Read/write API" tone="green">Should reading and dispatching be separate dependencies?</DiagramNode>
    <DiagramNode title="Frequency" tone="orange">How often does this value change?</DiagramNode>
    <DiagramNode title="Fit" tone="slate">Is this really Context-shaped data?</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Provider placement is an ownership decision

Consider cart state that only matters inside shop routes.

<VisualDiagram title="Place providers at the smallest useful scope">
  <DiagramStack align="center">
    <DiagramNode title="App" tone="blue" wide />
    <DiagramArrow />
    <DiagramGrid columns={3}>
      <DiagramNode title="Marketing" tone="slate">does not need cart</DiagramNode>
      <DiagramNode title="Storefront + CartProvider" tone="green">ProductPage · CartDrawer · Checkout</DiagramNode>
      <DiagramNode title="Admin" tone="slate">does not need cart</DiagramNode>
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

```jsx
<Route
  path="/shop/*"
  element={
    <CartProvider>
      <Storefront />
    </CartProvider>
  }
/>
```

State locality applies to Context too. A provider at application root creates a broader dependency and longer lifetime than a feature-local provider.

## Context value identity

React compares the previous and next provider `value` with `Object.is`.

```jsx
<AuthContext value={{user, signOut}}>
```

The object is newly created whenever the provider renders.

<VisualDiagram title="Provider render does not always mean context value stability" compact>
  <LifecycleBar
    items={[
      {label: 'provider renders', tone: 'blue'},
      {label: 'value expression creates object', tone: 'purple'},
      {label: 'Object.is compares identity', tone: 'cyan'},
      {label: 'consumers can receive update', tone: 'orange'},
    ]}
  />
</VisualDiagram>

This may be perfectly acceptable. Memoize only when profiling shows provider churn and consumer work are meaningful.

```jsx
const value = useMemo(
  () => ({user, signOut}),
  [user, signOut],
);
```

React Compiler may reduce the need for some manual memoization. Treat memoization as a measured performance tool, not a correctness requirement.

## Split unrelated contexts

A broad context couples values that change independently:

```jsx
<AppContext value={{theme, user, cart, locale}}>
```

<VisualDiagram title="Split independent domains instead of one mega-context">
  <DiagramGrid columns={4}>
    <DiagramNode title="Theme" tone="purple" />
    <DiagramNode title="Auth" tone="blue" />
    <DiagramNode title="Cart" tone="green" />
    <DiagramNode title="Locale" tone="orange" />
  </DiagramGrid>
</VisualDiagram>

Do not create dozens of contexts mechanically. Split when domains have different owners, lifetimes, change patterns, or consumer groups.

## Split state from dispatch

Reducer-based features can expose reads and writes through separate contexts.

```jsx
const TasksContext = createContext(null);
const TasksDispatchContext = createContext(null);

function TasksProvider({children}) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        {children}
      </TasksDispatchContext>
    </TasksContext>
  );
}
```

<VisualDiagram title="Separate read and write dependencies">
  <DiagramGrid columns={2}>
    <DiagramNode title="State Context" tone="blue">Consumers that render from tasks subscribe to task state.</DiagramNode>
    <DiagramNode title="Dispatch Context" tone="green">Dispatch-only consumers receive the stable dispatch function.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

The `dispatch` function returned by `useReducer` has stable identity, which makes it a natural write-only dependency.

## Feature Hooks create a stronger boundary

```jsx
export function useTasks() {
  const tasks = useContext(TasksContext);
  if (tasks === null) throw new Error('useTasks must be used within TasksProvider');
  return tasks;
}

export function useTasksDispatch() {
  const dispatch = useContext(TasksDispatchContext);
  if (dispatch === null) throw new Error('useTasksDispatch must be used within TasksProvider');
  return dispatch;
}
```

Consumers depend on a feature API rather than the raw Context objects.

## `useContext` is not a selector API

```jsx
const {theme} = useContext(AppContext);
```

Destructuring one field does not subscribe to only that field. The component reads the context value as a whole.

<DecisionTree
  question="Consumers need different slices of rapidly changing shared state—what next?"
  items={[
    {label: 'Domains are actually independent', value: 'Split contexts'},
    {label: 'State can move closer to the consumers', value: 'Prefer locality'},
    {label: 'Fine-grained subscriptions are a core requirement', value: 'Evaluate an external store / library with selector semantics'},
  ]}
/>

## Context and `memo`

A component reading Context can update when that Context changes even if it is wrapped in `memo`.

```jsx
const Product = memo(function Product() {
  const currency = useContext(CurrencyContext);
  // ...
});
```

`memo` compares props; Context is another input.

If profiling proves an expensive child needs prop-based memoization, split the context-reading container from the expensive view:

```jsx
function ProductContainer() {
  const currency = useContext(CurrencyContext);
  return <ProductView currency={currency} />;
}

const ProductView = memo(function ProductView({currency}) {
  // expensive render
});
```

## High-frequency state may be a poor Context fit

Context can transport pointer coordinates or animation-frame data, but that does not mean it should.

<VisualDiagram title="Shared-state rendering pressure" compact>
  <DiagramNode title="frequency × subscriber count × render cost" tone="orange" wide>
    High values make subscription granularity increasingly important.
  </DiagramNode>
</VisualDiagram>

A slowly changing theme and a 60Hz shared signal have very different architecture requirements.

## Separate server state from client state

Client state examples include open dialogs, selected tabs, drafts, and wizard steps.

Server state examples include inventory, customer records, order status, and analytics results.

<VisualDiagram title="Context transports values; it does not create a server-state lifecycle">
  <DiagramGrid columns={2}>
    <DiagramNode title="Context" tone="purple">Tree distribution + subscriptions to one provider value.</DiagramNode>
    <DiagramNode title="Server-state lifecycle" tone="orange">fetching · caching · staleness · invalidation · retries · background refresh</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

If the hard problem is remote-data lifecycle, use the architecture/tool that owns that lifecycle rather than rebuilding a cache inside Context.

## Provider composition is not automatically bad

```jsx
<AuthProvider>
  <ThemeProvider>
    <FeatureFlagsProvider>
      <App />
    </FeatureFlagsProvider>
  </ThemeProvider>
</AuthProvider>
```

Multiple focused providers often communicate dependencies more clearly than one giant provider.

If readability becomes awkward, compose providers as a structural convenience without merging unrelated ownership.

## Colocate providers with features

A feature-owned provider and its reducer/Hooks should usually live near that feature rather than in a universal `contexts/` dump.

```text
features/
  cart/
    CartProvider.jsx
    useCart.js
    cartReducer.js
  auth/
    AuthProvider.jsx
    useAuth.js
```

This is a literal project structure, so text is the clearer format here.

## Avoid provider side-effect overload

A provider is still a component. Do not turn it into a giant service container that fetches every API, registers unrelated global listeners, owns many timers, and exposes hundreds of commands.

Keep each provider aligned with a coherent domain.

## Performance debugging checklist

<VisualDiagram title="Context performance debugging flow">
  <LifecycleBar
    items={[
      {label: 'Which provider rendered?', tone: 'blue'},
      {label: 'Why did it render?', tone: 'purple'},
      {label: 'Did value identity change?', tone: 'cyan'},
      {label: 'Which consumers read it?', tone: 'orange'},
      {label: 'Are those renders expensive?', tone: 'red'},
      {label: 'Can ownership/scope be improved first?', tone: 'green'},
    ]}
  />
</VisualDiagram>

Use the React DevTools Profiler before adding memoization everywhere.

## Architecture example

<VisualDiagram title="Provider scope should narrow as ownership narrows">
  <DiagramStack align="center">
    <DiagramNode title="AuthProvider" tone="blue" wide eyebrow="BROAD ENVIRONMENT">wraps routing / authenticated application scope</DiagramNode>
    <DiagramArrow label="inside dashboard" />
    <DiagramNode title="DashboardPreferencesProvider" tone="purple" wide eyebrow="FEATURE ENVIRONMENT">only dashboard descendants depend on it</DiagramNode>
    <DiagramArrow label="inside selected workspace" />
    <DiagramNode title="SelectedProjectProvider" tone="green" wide eyebrow="LOCAL FEATURE STATE">only the project subtree needs it</DiagramNode>
  </DiagramStack>
</VisualDiagram>

## When should Context become an external store?

<DecisionTree
  question="Is Context still a good subscription model?"
  items={[
    {label: 'Moderate updates, coherent subtree, full-value subscriptions are fine', value: 'Context can remain a strong fit'},
    {label: 'Provider is too broad but ownership can be narrowed', value: 'Fix provider scope first'},
    {label: 'Many consumers need independent slices / high-frequency updates / non-React access', value: 'Evaluate an external store'},
  ]}
/>

## Exercise

Take one giant context containing `user`, `theme`, `cart`, `activeModal`, and `products`. Classify owner, scope, frequency, server/client origin, and subscriber needs for each value, then redesign the provider boundaries.

## Interview questions

**Mid-level:** Why can one giant Context cause unnecessary coupling?

**Senior:** How do Context value identity, provider scope, and consumer subscriptions influence rendering?

**Staff:** When would you move from Context to an external store, and how would you prove the migration is justified?

## Summary

<VisualDiagram title="Context architecture sequence">
  <LifecycleBar
    items={[
      {label: 'choose the owner', tone: 'blue'},
      {label: 'place provider at smallest useful scope', tone: 'purple'},
      {label: 'split unrelated domains', tone: 'cyan'},
      {label: 'separate read/write APIs when useful', tone: 'green'},
      {label: 'measure rendering', tone: 'orange'},
      {label: 'change state model only with evidence', tone: 'slate'},
    ]}
  />
</VisualDiagram>

## References

- https://react.dev/reference/react/useContext
- https://react.dev/learn/passing-data-deeply-with-context
- https://react.dev/learn/scaling-up-with-reducer-and-context

## Next

Continue with **useReducer and Reducer Design**.
