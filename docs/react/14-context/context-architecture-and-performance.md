---
title: Context Architecture and Performance
description: Design Context providers deliberately, split read and write concerns, understand value identity, and avoid unnecessary global coupling.
sidebar_position: 2
---

# Context architecture and performance

Context is simple at the API level and architectural at the application level.

The difficult questions are not:

```text
How do I call createContext?
How do I call useContext?
```

They are:

```text
Who owns this state?
Which subtree needs it?
Which consumers should update together?
Should reads and writes be coupled?
Is this actually Context-shaped data?
```

## Provider placement is an ownership decision

Consider a cart feature.

```text
App
├── MarketingPages
├── Storefront
│   ├── ProductPage
│   ├── CartDrawer
│   └── Checkout
└── Admin
```

If only Storefront needs cart state, placing `CartProvider` around the whole application creates a broader dependency than necessary.

Prefer:

```jsx
function App() {
  return (
    <Routes>
      <Route
        path="/shop/*"
        element={
          <CartProvider>
            <Storefront />
          </CartProvider>
        }
      />
      <Route path="/admin/*" element={<Admin />} />
    </Routes>
  );
}
```

State locality applies to Context too.

## Context value identity

React compares a provider's previous and next `value` with `Object.is`.

```jsx
<AuthContext value={{ user, signOut }}>
```

The object is newly created whenever the provider renders.

That means consumers observe a new context value identity on every provider render.

This may be perfectly acceptable.

Do not cargo-cult memoization. First ask whether provider renders are actually frequent and whether consumer work is expensive.

## When memoizing a provider value can help

```jsx
const value = useMemo(
  () => ({ user, signOut }),
  [user, signOut],
);

return <AuthContext value={value}>{children}</AuthContext>;
```

This is potentially useful when:

- the provider renders for reasons unrelated to the context value;
- many consumers depend on the context;
- the value is an object/function bundle;
- profiling shows those updates matter.

But remember: React Compiler may reduce the need for manual memoization in compiled applications, and memoization should remain a performance tool rather than a correctness requirement.

## Split unrelated contexts

A single provider with unrelated values creates unnecessary coupling.

```jsx
<AppContext value={{ theme, user, cart, locale }}>
```

If `theme` changes, every consumer of that context participates in the context update even if it only cares about `cart`.

Better boundaries:

```jsx
<ThemeContext value={theme}>
  <AuthContext value={user}>
    <CartContext value={cart}>
      {children}
    </CartContext>
  </AuthContext>
</ThemeContext>
```

This is not about making dozens of contexts blindly. It is about separating domains that change independently and have different consumers.

## Split state from dispatch

A useful reducer architecture is to provide state and dispatch through separate contexts.

```jsx
const TasksContext = createContext(null);
const TasksDispatchContext = createContext(null);
```

Provider:

```jsx
function TasksProvider({ children }) {
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

Now a component that only dispatches actions does not also need to read task state.

```jsx
function AddTaskButton() {
  const dispatch = useTasksDispatch();

  return (
    <button
      onClick={() => dispatch({ type: 'added', id: crypto.randomUUID(), text: 'New' })}
    >
      Add
    </button>
  );
}
```

This improves API clarity and can reduce unnecessary subscriptions.

## Why dispatch identity is useful

The `dispatch` function returned by `useReducer` has a stable identity.

That makes it a natural value for a dedicated dispatch Context.

Consumers can depend on dispatch without receiving the full current state object.

## Read/write custom Hooks

```jsx
export function useTasks() {
  const tasks = useContext(TasksContext);

  if (tasks === null) {
    throw new Error('useTasks must be used within TasksProvider');
  }

  return tasks;
}

export function useTasksDispatch() {
  const dispatch = useContext(TasksDispatchContext);

  if (dispatch === null) {
    throw new Error('useTasksDispatch must be used within TasksProvider');
  }

  return dispatch;
}
```

This creates a feature API instead of exposing implementation details everywhere.

## Context selectors are not built into `useContext`

Suppose the context value is:

```jsx
{
  user,
  permissions,
  notifications,
  theme,
}
```

A component doing:

```jsx
const { theme } = useContext(AppContext);
```

still subscribes to the context value as a whole. Destructuring one property does not make `useContext` a selector API.

If fine-grained subscriptions become important, options include:

- split contexts;
- move rapidly changing state closer to consumers;
- use an external store with selector support;
- use a library designed for fine-grained state subscriptions.

## Context and `memo`

A component reading Context can update when that Context changes even if wrapped in `memo`.

```jsx
const Product = memo(function Product() {
  const currency = useContext(CurrencyContext);
  // ...
});
```

`memo` does not freeze contextual inputs.

A possible split is:

```jsx
function ProductContainer() {
  const currency = useContext(CurrencyContext);
  return <ProductView currency={currency} />;
}

const ProductView = memo(function ProductView({ currency }) {
  // expensive rendering
});
```

Now the outer component reads Context and the inner component can be optimized around props if profiling justifies it.

## High-frequency state may be a poor Context fit

Context can technically provide rapidly changing data such as pointer coordinates or animation frames.

That does not mean it should.

Ask:

```text
How often does this value change?
How many consumers read it?
How expensive are their renders?
Do consumers need different slices?
```

For very high-frequency shared state, an external subscription model may be more appropriate.

## Separate server state from client state

Context is not automatically the right home for API data.

Client state examples:

- selected tab;
- open dialog;
- draft form data;
- current wizard step.

Server state examples:

- customer record from an API;
- product inventory;
- order status;
- analytics query results.

Server state has lifecycle concerns beyond sharing:

```text
fetching
caching
staleness
invalidating
refetching
retries
race handling
background refresh
```

Context can transport values but does not solve those problems by itself.

## Provider composition

Large applications can accumulate many providers.

That is not automatically bad.

```jsx
<AuthProvider>
  <ThemeProvider>
    <FeatureFlagsProvider>
      <App />
    </FeatureFlagsProvider>
  </ThemeProvider>
</AuthProvider>
```

Provider nesting is often preferable to one giant context because each provider expresses a real dependency boundary.

If readability becomes poor, compose providers deliberately rather than merging unrelated state.

## Colocate providers with features

Instead of one `contexts/` folder containing every application Context, prefer feature ownership where practical:

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

This makes dependencies and domain boundaries easier to understand.

## Avoid provider side-effect overload

A provider is still a component.

Do not turn providers into giant service containers that:

- fetch every API;
- register dozens of global listeners;
- manage unrelated timers;
- expose hundreds of commands.

Keep the provider aligned with a coherent domain.

## Performance debugging checklist

Before optimizing Context, answer:

1. Which provider is rendering?
2. Why is it rendering?
3. Did its `value` identity change?
4. Which consumers read that Context?
5. Are those consumer renders actually expensive?
6. Can state move closer to where it is used?
7. Should unrelated values be split?
8. Would an external store better match fine-grained subscriptions?

Use the React DevTools Profiler before adding memoization everywhere.

## Architecture example

```text
App
├── AuthProvider
│   └── Router
│       ├── Marketing
│       └── Dashboard
│           └── DashboardPreferencesProvider
│               ├── Sidebar
│               └── Workspace
│                   └── SelectedProjectProvider
```

Notice that providers become more specific deeper in the tree.

That mirrors scope:

```text
broad environment
      ↓
feature environment
      ↓
local interaction state
```

## Exercise

Take this giant context:

```jsx
<AppContext value={{ user, theme, cart, activeModal, products }}>
```

Redesign it by answering:

- who owns each value;
- which subtree needs it;
- which values change together;
- which values are server state;
- which values should remain local state;
- which contexts, if any, should be split into read/write APIs.

## Interview questions

**Mid-level:** Why can one giant Context cause unnecessary coupling?

**Senior:** How do Context value identity, provider scope, and consumer subscriptions influence rendering?

**Staff:** When would you move from Context to an external store, and how would you prove the migration is justified?

## Summary

```text
choose ownership
      ↓
place provider at smallest useful scope
      ↓
split unrelated domains
      ↓
separate read/write APIs when useful
      ↓
measure rendering
      ↓
optimize or change state model only with evidence
```

## References

- https://react.dev/reference/react/useContext
- https://react.dev/learn/passing-data-deeply-with-context
- https://react.dev/learn/scaling-up-with-reducer-and-context

## Next

Continue with **useReducer and Reducer Design**.