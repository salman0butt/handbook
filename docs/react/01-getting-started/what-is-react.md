---
title: What is React?
description: Understand React's declarative component model, why it exists, what it does not provide, and when to use it.
sidebar_position: 1
---

# What is React?

React is a JavaScript library for building user interfaces from **components**.

A component describes what a part of the interface should look like for its current inputs. When relevant data changes, React can render the component tree again and coordinate the browser updates needed to keep the visible interface in sync.

That sounds simple, but it introduces the mental model used throughout this handbook:

```text
data
 ↓
components calculate UI
 ↓
React coordinates rendering
 ↓
DOM changes are committed when needed
```

## Why does React exist?

Interactive applications have many pieces of UI that depend on changing data.

Imagine a shopping basket. When a user adds an item, the application might need to update:

- the basket count in the header;
- the basket list;
- the subtotal;
- the checkout button state;
- an empty-state message;
- shipping eligibility;
- related accessibility text.

With direct DOM manipulation, you can build all of this, but you must carefully keep application data and every affected DOM node synchronized yourself.

React gives you another model:

```text
Application state
      ↓
Components describe UI
      ↓
React renders the result
      ↓
State changes
      ↓
Components run again
      ↓
React commits necessary changes
```

Instead of making every DOM update the center of your application logic, you describe the UI for the current data.

## Declarative vs imperative UI

An imperative approach says **how** to update individual browser elements:

```js
const button = document.querySelector('#checkout');
const message = document.querySelector('#message');

if (items.length === 0) {
  button.disabled = true;
  message.textContent = 'Your basket is empty';
} else {
  button.disabled = false;
  message.textContent = `${items.length} items`;
}
```

A React component describes the desired result:

```jsx
function BasketSummary({items}) {
  const isEmpty = items.length === 0;

  return (
    <section>
      <p>{isEmpty ? 'Your basket is empty' : `${items.length} items`}</p>
      <button disabled={isEmpty}>Checkout</button>
    </section>
  );
}
```

The shift is:

```text
Imperative
"Find this element and change it."

Declarative
"For this data, the UI should look like this."
```

Declarative does **not** mean React eliminates complexity. It changes where you express that complexity: state, component boundaries, data flow, and render logic become the main design concerns.

## Components

React applications are composed from components.

```jsx
function Avatar({name, imageUrl}) {
  return <img src={imageUrl} alt={name} />;
}
```

Components can render other components:

```jsx
function UserCard({user}) {
  return (
    <article>
      <Avatar name={user.name} imageUrl={user.imageUrl} />
      <h2>{user.name}</h2>
    </article>
  );
}
```

This forms a component tree:

```text
App
├── Header
├── ProductList
│   ├── ProductCard
│   ├── ProductCard
│   └── ProductCard
└── Basket
    └── BasketItem
```

Thinking in component trees is one of the most important React skills because data ownership, state preservation, Context, rendering, and architecture all depend on the tree.

## UI as a function of data

A useful conceptual model is:

```text
UI = f(props, state, context)
```

Given the same relevant inputs, a pure component should describe the same UI.

```jsx
function Greeting({isLoggedIn, name}) {
  if (!isLoggedIn) {
    return <p>Please sign in.</p>;
  }

  return <p>Welcome back, {name}.</p>;
}
```

React becomes easier to reason about when components are treated as calculations of UI rather than imperative scripts that mutate the page.

## React does not continuously watch variables

A common beginner misunderstanding is that React watches every JavaScript variable and automatically updates the page when a variable changes.

It does not.

```jsx
function Counter() {
  let count = 0;

  function increment() {
    count += 1;
  }

  return <button onClick={increment}>{count}</button>;
}
```

Changing `count` does not tell React that a new render is required.

Later you will use state:

```jsx
const [count, setCount] = useState(0);
```

A state update can schedule React rendering work. Each render then receives its own state snapshot.

## What does "render" mean?

Do not define rendering as "React changes the DOM."

A better simplified sequence is:

```text
update triggers rendering
        ↓
components calculate the next UI
        ↓
React reconciles the result
        ↓
React commits necessary host changes
        ↓
browser can paint
```

A component can render without causing a visible DOM change.

That distinction becomes essential for performance and debugging.

## React vs the browser DOM

React does not replace the browser.

Your application still uses real platform features:

- HTML semantics;
- CSS;
- browser events;
- forms;
- focus;
- URLs;
- network requests;
- accessibility APIs;
- the DOM.

React provides a programming model for describing and coordinating UI on top of the platform.

Senior React engineering requires knowing both React **and** the web platform underneath it.

## React vs a framework

React itself focuses on UI and rendering primitives.

A complete application often needs decisions about:

- routing;
- data loading and caching;
- server rendering;
- authentication;
- deployment;
- bundling;
- code splitting;
- Server Components infrastructure;
- application conventions.

Frameworks can provide integrated solutions for those concerns.

```text
React
  ↓
UI primitives and rendering model

Framework
  ↓
React + application architecture/infrastructure conventions
```

This handbook distinguishes React core from framework behavior so you know which assumptions are portable.

## React core vs ecosystem libraries

Libraries such as React Router, TanStack Query, Redux Toolkit, Zustand, and React Hook Form can be useful, but they are not built-in React APIs.

Learn the underlying problem first:

```text
understand local state
      ↓
understand ownership
      ↓
understand Context/reducers
      ↓
then evaluate an external state library
```

The same principle applies to data fetching, forms, and routing.

## Modern React vs legacy React

This handbook uses modern React 19.2 as its stable documentation target.

New code is taught with:

- function components;
- Hooks;
- `createRoot`;
- current Context patterns;
- modern form and Action APIs where appropriate;
- current ref guidance;
- Suspense/transitions/concurrency concepts;
- React Compiler awareness.

Class components, old lifecycle methods, old Context, `ReactDOM.render`, and similar APIs are still useful when maintaining existing systems, but they belong in the legacy/migration section rather than the beginner path.

See **[React Version Covered](../version.md)** for the exact verified version and release policy.

## What React does well

React is a strong fit when an interface has meaningful interaction and benefits from:

- reusable component boundaries;
- state-driven UI;
- composition;
- predictable one-way data flow;
- a large ecosystem;
- client, server, and hybrid rendering options through surrounding tooling/frameworks.

Examples include dashboards, commerce interfaces, SaaS applications, collaborative tools, content products, and rich account experiences.

## When React may be unnecessary

A tiny static page does not automatically need React.

If the page is mostly content with little interactive state, plain HTML/CSS/JavaScript or a simpler rendering approach may be enough.

Choosing React is an engineering decision, not proof that an application is "modern."

## Common mistakes

### Thinking React is HTML inside JavaScript

JSX resembles markup, but React's core model is components calculating UI from data. JSX is one syntax used to describe those elements.

### Thinking state is a normal mutable variable

React state behaves as a render snapshot. Mutating a value is not equivalent to scheduling a React update.

### Treating every ecosystem library as part of React

Know whether a behavior comes from React, React DOM, the browser, a framework, or a third-party library.

### Learning APIs before rendering

If `useEffect`, `useMemo`, or Context feels magical, return to rendering, snapshots, identity, and ownership.

## Debugging mindset

When UI is wrong, ask in this order:

```text
What data does this render see?
        ↓
Which component owns that data?
        ↓
What triggered the render?
        ↓
What UI did the component calculate?
        ↓
Did identity/keys preserve the expected state?
        ↓
Is an Effect/external system involved?
```

This produces better debugging than randomly adding Hooks.

## Exercise

Take a familiar interface—GitHub, an e-commerce store, or a dashboard—and sketch its component tree.

For example:

```text
Dashboard
├── Sidebar
├── Header
└── Main
    ├── StatsGrid
    │   ├── StatCard
    │   ├── StatCard
    │   └── StatCard
    └── ActivityTable
```

Ask:

- Which parts repeat?
- Which components receive data?
- Which values can change?
- Which component should own changing state?
- Which parts are React concerns and which are browser/application concerns?

## Interview questions

### Junior

What problem does React's declarative model solve compared with manually updating many DOM nodes?

### Mid-level

Does a component render always cause a DOM update? Explain the difference.

### Senior

What belongs to React core versus a React framework, and why does that distinction matter for architecture?

## Summary

Keep this mental model:

```text
React is a UI library.
Components calculate UI from current inputs.
State updates can schedule rendering.
Rendering is not the same as DOM mutation.
React coordinates a component tree over time.
The browser platform still matters.
Frameworks and ecosystem libraries solve additional problems around React.
```

## References

- https://react.dev/
- https://react.dev/learn/describing-the-ui
- https://react.dev/learn/reacting-to-input-with-state
- https://react.dev/learn/render-and-commit
- https://react.dev/reference/rules/components-and-hooks-must-be-pure

## Next

Create a modern learning project with **[Set Up React with Vite](./setup-with-vite.md)**.