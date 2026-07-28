---
title: Context and useContext
description: Understand when Context helps, how provider lookup works, React 19 provider syntax, defaults, updates, and common architectural mistakes.
sidebar_position: 1
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

# Context and `useContext`

Context lets a component read information from the **closest matching provider above it** without every intermediate component forwarding that value as a prop.

The API is simple. The architectural question is harder:

> Is this value really part of the surrounding environment for a subtree, or are we using Context to avoid deciding who owns the state?

## Start with props

Props should remain the default way to make dependencies explicit.

<VisualDiagram title="Props keep local dependencies visible" compact>
  <DiagramStack align="center">
    <DiagramNode title="ProductPage" tone="blue" wide />
    <DiagramArrow label="currency prop" />
    <DiagramNode title="ProductCard" tone="purple" wide />
    <DiagramArrow label="currency prop" />
    <DiagramNode title="Price" tone="green" wide />
  </DiagramStack>
</VisualDiagram>

If only a small chain needs `currency`, props may be clearer than introducing a shared environment.

```jsx
function ProductPage({product, currency}) {
  return <ProductCard product={product} currency={currency} />;
}
```

## The problem Context solves

Context becomes useful when the same surrounding information is needed deep in a subtree and intermediate components would otherwise forward it without using it.

<VisualDiagram title="Context creates a tree-scoped environment">
  <DiagramStack align="center">
    <DiagramNode title="Theme provider" tone="blue" wide>owns the value boundary for this subtree</DiagramNode>
    <DiagramArrow label="available below" />
    <DiagramGrid columns={2}>
      <DiagramNode title="Header → IconButton" tone="cyan">IconButton reads theme directly.</DiagramNode>
      <DiagramNode title="Settings → Preview → Card" tone="purple">Card reads the same nearest theme.</DiagramNode>
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

Common candidates include theme, locale, session/environment data, feature configuration, form coordination, and feature state/dispatch.

## Creating a context

```jsx
import {createContext} from 'react';

export const ThemeContext = createContext('light');
```

The context object is a channel, not mutable storage. The default value is used only when no matching provider exists above the consumer.

## Providing a value in React 19

> **React 19+**

```jsx
function App() {
  return (
    <ThemeContext value="dark">
      <Dashboard />
    </ThemeContext>
  );
}
```

Older code commonly uses `<ThemeContext.Provider value="dark">`. You still need to recognize that syntax for maintenance, but React 19 can render the context object directly as the provider.

## Reading context

```jsx
function Toolbar() {
  const theme = useContext(ThemeContext);
  return <div className={`toolbar toolbar-${theme}`}>Toolbar</div>;
}
```

<VisualDiagram title="How useContext resolves a value" subtitle="Lookup follows the rendered component tree, not imports or file structure.">
  <LifecycleBar
    items={[
      {label: 'component calls useContext(Context)', tone: 'blue'},
      {label: 'React checks providers above it', tone: 'purple'},
      {label: 'closest matching provider wins', tone: 'green'},
      {label: 'consumer receives current value', tone: 'cyan'},
    ]}
  />
</VisualDiagram>

## Closest provider wins

```jsx
<ThemeContext value="light">
  <Header />

  <ThemeContext value="dark">
    <AdminPanel />
  </ThemeContext>
</ThemeContext>
```

`Header` reads `light`; `AdminPanel` reads `dark`.

<VisualDiagram title="Nested providers create scoped overrides" compact>
  <DiagramGrid columns={2}>
    <DiagramNode title="Outer branch" tone="blue">Header → light</DiagramNode>
    <DiagramNode title="Nested branch" tone="purple">AdminPanel → dark</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Providers must already be above consumers

This component reads before the provider it returns exists above that read:

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

The provider affects descendants such as `Dashboard`, not `Page`'s earlier `useContext` call.

## Default values

```jsx
const ThemeContext = createContext('light');
```

With no provider above, the consumer gets `'light'`. If a provider explicitly passes `undefined`, the consumer gets `undefined`; React does not fall back to the default.

For required application contexts, `null` plus a validating custom Hook is often safer:

```jsx
const AuthContext = createContext(null);

export function useAuth() {
  const value = useContext(AuthContext);

  if (value === null) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return value;
}
```

## Context distributes state; it does not create state

```jsx
export function ThemeProvider({children}) {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext value={{theme, setTheme}}>
      {children}
    </ThemeContext>
  );
}
```

<VisualDiagram title="Ownership vs distribution" compact>
  <DiagramGrid columns={2}>
    <DiagramNode title="useState / useReducer" tone="blue" eyebrow="OWNER">Creates and transitions React state.</DiagramNode>
    <DiagramNode title="Context" tone="purple" eyebrow="DISTRIBUTOR">Makes the owner's value accessible to descendants.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

A provider component can combine these responsibilities, but they remain conceptually separate.

## Context updates and rendering

A consumer that reads a context subscribes to that context value. When the provider's `value` changes according to `Object.is`, React can update those consumers.

```jsx
<ThemeContext value={{theme, setTheme}}>
```

That object is newly created when the provider renders. This is not automatically a performance problem; measure first. It does mean value identity is relevant when a context has many consumers or changes frequently.

`memo` does not block context updates because context is another input to the component, separate from props.

## Context is tree-scoped, not automatically global

<VisualDiagram title="One Context type can have independent provider branches">
  <DiagramGrid columns={2}>
    <DiagramNode title="StorefrontProvider" tone="green">Storefront descendants read one value/state instance.</DiagramNode>
    <DiagramNode title="AdminProvider" tone="orange">Admin descendants can read another value/state instance.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Think **tree-scoped dependency**, not “global variable.”

## What belongs in Context?

Good candidates often share these properties:

- many descendants need the value;
- it represents a surrounding environment or feature state;
- prop forwarding creates real noise;
- consumers should intentionally depend on this provider boundary.

Use props when the relationship is naturally parent → child, only a few consumers need the value, or explicit dependencies improve reusability.

## Composition can remove prop drilling

Before Context, ask whether composition can move the consumer closer to the owner:

```jsx
<Layout header={<UserMenu user={user} />} />
```

Now `Layout` does not need to receive and forward `user` merely for `UserMenu`.

## Avoid one giant application Context

```jsx
<AppContext value={{
  user,
  products,
  cart,
  theme,
  notifications,
  filters,
  settings,
}}>
```

This creates broad coupling and hides ownership.

<VisualDiagram title="Prefer domain-shaped provider boundaries">
  <DiagramGrid columns={4}>
    <DiagramNode title="AuthProvider" tone="blue" />
    <DiagramNode title="ThemeProvider" tone="purple" />
    <DiagramNode title="CartProvider" tone="green" />
    <DiagramNode title="FeatureProvider" tone="orange" />
  </DiagramGrid>
</VisualDiagram>

Split providers by coherent ownership/change boundaries, not by arbitrary file size.

## Context is not a server-state cache

Context can transport remote data, but it does not by itself provide cache lifetime, deduplication, staleness, invalidation, retries, background refresh, or mutation coordination.

Server-state tools/framework APIs solve a different lifecycle problem.

## Balanced dependency design

<VisualDiagram title="Different mechanisms for different dependency scopes">
  <DiagramGrid columns={3}>
    <DiagramNode title="Props" tone="blue">Local explicit parent → child dependencies.</DiagramNode>
    <DiagramNode title="Context" tone="purple">Broad feature/environment dependency for a subtree.</DiagramNode>
    <DiagramNode title="Local state" tone="green">Keep ownership close to where values actually change.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Debugging Context

If a consumer gets the wrong value, check whether the provider is actually above it, whether a nearer provider overrides it, whether the provider supplies `value`, whether a default masks a missing provider, and whether provider/consumer import the exact same context object.

## Production pattern: provider + custom Hook

```jsx
const CartContext = createContext(null);

export function CartProvider({children}) {
  const [items, setItems] = useState([]);

  return (
    <CartContext value={{items, setItems}}>
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

Benefits include validated provider requirements, fewer direct Context imports, and a stable feature API that can evolve internally.

## Context decision

<DecisionTree
  question="Should this dependency use Context?"
  items={[
    {label: 'Only a small explicit parent → child chain needs it', value: 'Prefer props'},
    {label: 'Composition can place the consumer directly where the owner already has the data', value: 'Prefer composition'},
    {label: 'Many descendants need one coherent subtree environment/feature dependency', value: 'Context is a strong candidate'},
    {label: 'The real problem is server caching or fine-grained external subscriptions', value: 'Choose the tool that owns that lifecycle instead'},
  ]}
/>

## Exercise

Build a theme system with nested providers, a `useTheme` Hook, a toolbar that reads the nearest theme, and a toggle that updates only one provider subtree. Explain which component owns the state and what Context contributes.

## Interview questions

**Junior:** What problem does Context solve?

**Mid-level:** Why is Context not automatically a replacement for props or a state-management library?

**Senior:** How would you choose provider boundaries in a large application, and what rendering/coupling trade-offs would you inspect before optimizing Context?

## Summary

<VisualDiagram title="Context design flow">
  <LifecycleBar
    items={[
      {label: 'start with explicit props', tone: 'blue'},
      {label: 'identify a real subtree-wide dependency', tone: 'purple'},
      {label: 'place provider above consumers', tone: 'cyan'},
      {label: 'keep state ownership explicit', tone: 'green'},
      {label: 'scope providers deliberately', tone: 'orange'},
    ]}
  />
</VisualDiagram>

## References

- https://react.dev/learn/passing-data-deeply-with-context
- https://react.dev/reference/react/createContext
- https://react.dev/reference/react/useContext

## Next

Continue with **Context Architecture and Performance**.
