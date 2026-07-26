---
title: What is React?
description: Understand React's declarative component model, why it exists, what it does not provide, and when to use it.
sidebar_position: 1
---

import {
  VisualDiagram,
  DiagramStack,
  DiagramGrid,
  DiagramNode,
  DiagramArrow,
  LifecycleBar,
} from '@site/src/components/handbook/VisualDiagram'

# What is React?

React is a JavaScript library for building user interfaces from **components**.

A component describes what a part of the interface should look like for its current inputs. When relevant data changes, React can render the component tree again and coordinate the browser updates needed to keep the visible interface in sync.

That sounds simple, but it introduces the mental model used throughout this handbook:

<VisualDiagram title="React's basic data → UI model">
  <DiagramStack align="center">
    <DiagramNode title="Data" tone="blue" wide>props · state · context</DiagramNode>
    <DiagramArrow label="inputs" />
    <DiagramNode title="Components calculate UI" tone="purple" wide>Components describe what the interface should be for the current inputs.</DiagramNode>
    <DiagramArrow label="render + reconcile" />
    <DiagramNode title="React coordinates rendering" tone="cyan" wide>React determines what host work is necessary.</DiagramNode>
    <DiagramArrow label="commit" />
    <DiagramNode title="DOM changes when needed" tone="green" wide>Only necessary host changes are committed.</DiagramNode>
  </DiagramStack>
</VisualDiagram>

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

<VisualDiagram title="State-driven UI loop" subtitle="Describe the UI from state instead of manually synchronising every affected DOM node.">
  <LifecycleBar
    items={[
      { label: 'Application state', tone: 'blue' },
      { label: 'Components describe UI', tone: 'purple' },
      { label: 'React renders', tone: 'cyan' },
      { label: 'State changes', tone: 'orange' },
      { label: 'Components run again', tone: 'purple' },
      { label: 'React commits necessary changes', tone: 'green' },
    ]}
  />
</VisualDiagram>

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

<VisualDiagram title="Imperative vs declarative UI">
  <DiagramGrid columns={2}>
    <DiagramNode title="Imperative" tone="orange" eyebrow="HOW">
      “Find this element and change it.”
    </DiagramNode>
    <DiagramNode title="Declarative" tone="green" eyebrow="WHAT">
      “For this data, the UI should look like this.”
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

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

<VisualDiagram title="Component tree" subtitle="React architecture is tree-shaped: ownership, Context, identity, and rendering all depend on this structure.">
  <DiagramStack align="center">
    <DiagramNode title="App" tone="blue" wide />
    <DiagramArrow />
    <DiagramGrid columns={3}>
      <DiagramNode title="Header" tone="cyan" />
      <DiagramNode title="ProductList" tone="purple">renders multiple ProductCard children</DiagramNode>
      <DiagramNode title="Basket" tone="green">renders BasketItem children</DiagramNode>
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

Thinking in component trees is one of the most important React skills because data ownership, state preservation, Context, rendering, and architecture all depend on the tree.

## UI as a function of data

A useful conceptual model is:

<VisualDiagram title="UI as a calculation" compact>
  <DiagramStack align="center">
    <DiagramNode title="props + state + context" tone="blue" wide />
    <DiagramArrow label="f(inputs)" />
    <DiagramNode title="UI description" tone="green" wide>Given the same relevant inputs, a pure component should describe the same UI.</DiagramNode>
  </DiagramStack>
</VisualDiagram>

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

<VisualDiagram title="Trigger → render → reconcile → commit → paint">
  <LifecycleBar
    items={[
      { label: 'Update triggers work', tone: 'orange' },
      { label: 'Components calculate next UI', tone: 'purple' },
      { label: 'React reconciles identity + structure', tone: 'cyan' },
      { label: 'Necessary host changes commit', tone: 'green' },
      { label: 'Browser can paint', tone: 'blue' },
    ]}
  />
</VisualDiagram>

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

<VisualDiagram title="Library vs framework boundary">
  <DiagramGrid columns={2}>
    <DiagramNode title="React" tone="blue">UI primitives + rendering model</DiagramNode>
    <DiagramNode title="Framework" tone="purple">React + routing + data + server/runtime + deployment conventions</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

This handbook distinguishes React core from framework behavior so you know which assumptions are portable.

## React core vs ecosystem libraries

Libraries such as React Router, TanStack Query, Redux Toolkit, Zustand, and React Hook Form can be useful, but they are not built-in React APIs.

Learn the underlying problem first:

<VisualDiagram title="Learn the problem before the library">
  <LifecycleBar
    items={[
      { label: 'Understand local state', tone: 'blue' },
      { label: 'Understand ownership', tone: 'cyan' },
      { label: 'Understand Context + reducers', tone: 'purple' },
      { label: 'Evaluate external library requirements', tone: 'green' },
    ]}
  />
</VisualDiagram>

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

<VisualDiagram title="React debugging ladder" subtitle="Start with the render's data before reaching for another Hook.">
  <LifecycleBar
    items={[
      { label: 'What data does this render see?', tone: 'blue' },
      { label: 'Who owns that data?', tone: 'cyan' },
      { label: 'What triggered the render?', tone: 'orange' },
      { label: 'What UI was calculated?', tone: 'purple' },
      { label: 'Did identity/keys preserve state?', tone: 'green' },
      { label: 'Is an Effect/external system involved?', tone: 'red' },
    ]}
  />
</VisualDiagram>

This produces better debugging than randomly adding Hooks.

## Exercise

Take a familiar interface—GitHub, an e-commerce store, or a dashboard—and sketch its component tree.

For example:

<VisualDiagram title="Example dashboard component tree">
  <DiagramStack align="center">
    <DiagramNode title="Dashboard" tone="blue" wide />
    <DiagramArrow />
    <DiagramGrid columns={3}>
      <DiagramNode title="Sidebar" tone="slate" />
      <DiagramNode title="Header" tone="cyan" />
      <DiagramNode title="Main" tone="purple">StatsGrid → StatCards · ActivityTable</DiagramNode>
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

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

<VisualDiagram title="React in six ideas">
  <DiagramGrid columns={2}>
    <DiagramNode title="UI library" tone="blue">React coordinates interfaces built from components.</DiagramNode>
    <DiagramNode title="Components calculate UI" tone="purple">Current inputs determine the UI description.</DiagramNode>
    <DiagramNode title="State schedules rendering" tone="cyan">State updates can request new rendering work.</DiagramNode>
    <DiagramNode title="Render ≠ DOM mutation" tone="orange">Rendering can happen without visible host changes.</DiagramNode>
    <DiagramNode title="Tree + identity matter" tone="green">Ownership and state preservation depend on structure and identity.</DiagramNode>
    <DiagramNode title="Platform + ecosystem still matter" tone="slate">Browser APIs, frameworks, and third-party libraries solve additional concerns.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## References

- https://react.dev/
- https://react.dev/learn/describing-the-ui
- https://react.dev/learn/reacting-to-input-with-state
- https://react.dev/learn/render-and-commit
- https://react.dev/reference/rules/components-and-hooks-must-be-pure

## Next

Create a modern learning project with **[Set Up React with Vite](./setup-with-vite.md)**.
