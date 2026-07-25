---
title: What is React?
description: Understand React's core mental model before learning its APIs.
sidebar_position: 1
---

# What is React?

React is a JavaScript library for building user interfaces from **components**.

A component describes what part of the interface should look like for a given set of data. React then keeps the browser interface in sync when that data changes.

## The problem React helps solve

Imagine a shopping basket without React.

When a user adds an item, you may need to manually update:

- the basket count in the header;
- the basket list;
- the subtotal;
- the checkout button state;
- an empty-state message;
- any related accessibility text.

With direct DOM manipulation, application state and the visible UI can easily drift apart.

React encourages a different model:

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
React updates what changed
```

Instead of telling the browser every individual DOM operation, you describe the UI you want for the current state.

## Declarative vs imperative UI

An imperative approach says **how** to change the interface:

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

A React component describes the result:

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

The important shift is:

```text
Imperative
"Find this element and change it."

Declarative
"For this state, the UI should look like this."
```

## Components

React applications are composed of components.

```jsx
function Avatar({name, imageUrl}) {
  return <img src={imageUrl} alt={name} />;
}
```

Components can be combined:

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

This gives us a tree:

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

Thinking in component trees is one of the most important React skills.

## UI as a function of state

A useful mental model is:

```text
UI = f(state)
```

Given the same state and props, a component should describe the same UI.

For example:

```jsx
function Greeting({isLoggedIn, name}) {
  if (!isLoggedIn) {
    return <p>Please sign in.</p>;
  }

  return <p>Welcome back, {name}.</p>;
}
```

React's rendering model becomes much easier to understand once you stop thinking of components as HTML templates and start thinking of them as functions that calculate UI.

## What React does not provide by itself

React focuses on the UI layer. A complete application often needs other decisions or tools for areas such as:

- routing;
- server communication;
- caching;
- form management;
- authentication;
- application architecture;
- deployment.

Frameworks and libraries can solve these problems around React, but the core React mental model remains the same.

## Common beginner misunderstanding

React does **not** continuously watch variables and magically update the page.

A component renders because React schedules it to render—for example when its state changes, when its parent renders, or when subscribed context changes.

We will study rendering behaviour in detail later.

## When React is a good fit

React is useful when an interface has meaningful interaction and state, especially when you benefit from reusable components and predictable rendering.

A tiny static page may not need a full React application. Choosing React should be an engineering decision, not a default rule.

## Exercise

Take a familiar interface—YouTube, GitHub, an e-commerce store, or a dashboard—and sketch its component tree.

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

Ask yourself:

- Which parts repeat?
- Which components need data?
- Which component should own changing state?

## Summary

React's core idea is simple:

> Describe the interface as components based on the current data, and let React coordinate updates when that data changes.

Next: **[JSX](../02-fundamentals/jsx.md)**.
