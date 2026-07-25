---
title: Context and useContext
description: Understand when Context helps, how provider lookup works, React 19 provider syntax, defaults, updates, and common architectural mistakes.
sidebar_position: 1
---

# Context and `useContext`

Context lets a component read information from the **closest matching provider above it** without every intermediate component having to forward that value as a prop.

That sounds simple, but good Context usage depends on one question:

> Is this value truly part of the surrounding environment for a subtree, or are we using Context to avoid making a state-ownership decision?

## Start with props

Props should remain the default way to pass data between components.

```text
App
└── ProductPage
    └── ProductCard
        └── Price
```

If only `Price` needs `currency`, passing it through a small number of meaningful component boundaries is often clearer than introducing Context.

```jsx
function ProductPage({ product, currency }) {
  return <ProductCard product={product} currency={currency} />;
}
```

Props make dependencies visible.

## The problem Context solves

Context becomes useful when the same information is needed deep in a subtree and passing it through intermediate components becomes noisy.

Examples:

- current theme;
- authenticated user/session information;
- locale;
- feature configuration;
- form or component-library coordination;
- state/dispatch for a feature subtree.

```text
Application
└── Theme provider
    ├── Header
    │   └── IconButton  ← reads theme
    └── Settings
        └── Preview
            └── Card    ← reads theme
```

The middle components do not need to know about `theme` just to forward it.

## Creating a context

```jsx
import { createContext } from 'react';

export const ThemeContext = createContext('light');
```

The argument is the **default value**.

The context object does not itself hold mutable state. It represents a channel through which React can provide and read a value.

## Providing a value in React 19

In React 19, you can render the context object itself as a provider:

```jsx
import { ThemeContext } from './ThemeContext.js';

function App() {
  return (
    <ThemeContext value="dark">
      <Dashboard />
    </ThemeContext>
  );
}
```

Older React code commonly uses:

```jsx
<ThemeContext.Provider value="dark">
  <Dashboard />
</ThemeContext.Provider>
```

You will still encounter `.Provider` in existing applications, but the React 19 provider syntax is the modern form to recognize for new code.

## Reading context

Use `useContext` at the top level of a component:

```jsx
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext.js';

function Toolbar() {
  const theme = useContext(ThemeContext);

  return <div className={`toolbar toolbar-${theme}`}>Toolbar</div>;
}
```

Mental model:

```text
component calls useContext(SomeContext)
                ↓
React walks upward through providers
                ↓
closest matching provider wins
                ↓
its current value is returned
```

## Closest provider wins

Providers can be nested.

```jsx
<ThemeContext value="light">
  <Header />

  <ThemeContext value="dark">
    <AdminPanel />
  </ThemeContext>
</ThemeContext>
```

`Header` reads `light`.

`AdminPanel` reads `dark`.

This makes Context naturally **scoped by the component tree**.

## Providers must be above consumers

This does not work the way beginners often expect:

```jsx
function Page() {
  const theme = useContext(ThemeContext);

  return (
    <ThemeContext value="dark">
      <Dashboard />
    </ThemeContext>
  );
}
```

The provider returned by `Page` does not affect the `useContext` call in `Page` itself. The provider must already be above the component that reads it.

## Default values

```jsx
const ThemeContext = createContext('light');
```

If there is **no provider above the consumer**, `useContext(ThemeContext)` returns `'light'`.

The default is not a fallback when a provider explicitly passes `undefined`.

```jsx
<ThemeContext value={undefined}>
  <Panel />
</ThemeContext>
```

`Panel` receives `undefined`.

## A safer application pattern

For required application contexts, `null` is often a better default than inventing a fake usable value.

```jsx
import { createContext, useContext } from 'react';

const AuthContext = createContext(null);

export function useAuth() {
  const value = useContext(AuthContext);

  if (value === null) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return value;
}
```

This turns missing-provider bugs into clear failures.

## Updating context

Context often provides state owned by a parent component.

```jsx
import { createContext, useState } from 'react';

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext value={{ theme, setTheme }}>
      {children}
    </ThemeContext>
  );
}
```

Important:

```text
Context does not create the state.
useState owns the state.
Context distributes access to it.
```

## Context updates and rendering

A component that reads a context is subscribed to that context value.

When the provider receives a different `value`, React updates consumers that read that context.

The comparison uses `Object.is`.

```jsx
<ThemeContext value={{ theme, setTheme }}>
```

That object is newly created on every provider render.

This does **not** automatically mean you have a performance problem. Measure first. But it does mean identity is relevant if a large subtree consumes the context frequently.

## `memo` does not block context updates

```jsx
const Greeting = memo(function Greeting() {
  const theme = useContext(ThemeContext);
  return <p className={theme}>Hello</p>;
});
```

If `ThemeContext` changes, `Greeting` can re-render even though it is wrapped in `memo`.

Why?

`memo` concerns props from the parent. A context subscription is another input to the component.

## Context is not global state by definition

A Context provider is scoped to a subtree.

```text
App
├── StorefrontProvider
│   └── Storefront
└── AdminProvider
    └── Admin
```

The same Context type can even be provided with different values in separate branches.

Think **tree-scoped dependency**, not “global variable.”

## What belongs in Context?

Good candidates often have these properties:

- many descendants need the value;
- the value represents the surrounding environment or feature state;
- passing it through props creates real noise;
- consumers should be coupled to this feature/provider.

Examples:

```text
theme
locale
current account/session
feature permissions
form coordination
design-system state
feature state + dispatch
```

## What should usually stay as props?

Use props when:

- only a few components need the value;
- the relationship is naturally parent → child;
- reusability improves when dependencies stay explicit;
- the component should work in many environments.

A `ProductCard` that requires a `product` should usually receive `product` as a prop, not silently read the current product from Context.

## Composition can remove prop drilling

Before Context, ask whether composition solves the problem.

Instead of:

```jsx
<Layout user={user} />
```

where `Layout` forwards `user` through five layers, you may be able to pass already-constructed children:

```jsx
<Layout header={<UserMenu user={user} />} />
```

Now `Layout` does not need to understand `user`.

## Common mistake: one giant application context

```jsx
<AppContext value={{
  user,
  products,
  cart,
  theme,
  notifications,
  filters,
  settings,
  // ...
}}>
```

This creates broad coupling and makes ownership unclear.

Better:

```text
AuthProvider
ThemeProvider
CartProvider
Feature-specific provider
```

Providers should follow domain boundaries, not become a dump for everything shared.

## Common mistake: Context for server cache data

Context can distribute server data, but it is not a server-state cache.

Server-state tools solve additional problems such as:

- caching;
- deduplication;
- stale data;
- refetching;
- invalidation;
- retries;
- background synchronization.

Do not rebuild all of that inside one Context unless your requirements are genuinely simple.

## Common mistake: hiding all dependencies

If every component reads everything from Context, component APIs become difficult to understand and test.

A balanced design often uses:

```text
Context for broad feature/environment dependencies
Props for local explicit dependencies
State close to where it changes
```

## Debugging Context

If a consumer gets the wrong value, check:

1. Is the provider actually above the consumer?
2. Is there a nearer provider overriding the value?
3. Did the provider forget the `value` prop?
4. Is the context default masking a missing provider?
5. Are provider and consumer importing the exact same context object?

Duplicated modules in unusual build setups can break Context because providing and reading must use the same context object identity.

## Production pattern: provider + custom Hook

```jsx
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  return (
    <CartContext value={{ items, setItems }}>
      {children}
    </CartContext>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (context === null) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return context;
}
```

Benefits:

- consumers do not import Context directly;
- provider requirements are validated;
- implementation can evolve later;
- feature boundaries become clearer.

## Exercise

Build a theme system with:

- `ThemeProvider`;
- `useTheme`;
- two nested providers with different themes;
- a toolbar that consumes the nearest theme;
- a toggle that updates only one provider subtree.

Then explain why Context distributed the value but did not own the state.

## Interview questions

**Junior:** What problem does Context solve?

**Mid-level:** Why is Context not automatically a replacement for props or a state-management library?

**Senior:** How would you choose provider boundaries in a large application, and what rendering/coupling trade-offs would you inspect before optimizing Context?

## Summary

```text
props first
   ↓
real deep shared dependency?
   ↓
create Context
   ↓
provide above consumers
   ↓
read with useContext
   ↓
keep ownership and provider boundaries deliberate
```

## References

- https://react.dev/learn/passing-data-deeply-with-context
- https://react.dev/reference/react/createContext
- https://react.dev/reference/react/useContext

## Next

Continue with **Context Architecture and Performance**, where we separate provider design, value identity, read/write contexts, and feature boundaries.