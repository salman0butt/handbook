---
title: Rendering a React Application
description: Understand createRoot, root.render, the component tree, and what React means by rendering.
sidebar_position: 3
---

# Rendering a React application

Before learning state updates, understand how a React tree gets onto the page.

A basic client entry point looks like this:

```jsx
import {createRoot} from 'react-dom/client';
import App from './App.jsx';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);
```

## What `createRoot` does

`createRoot` creates a React root for a browser DOM node.

```text
browser DOM node
      ↓
createRoot(container)
      ↓
React root
```

That root is the bridge through which React manages the component tree mounted in that DOM container.

## What `root.render` does

`root.render` asks React to render a React node into that root.

```jsx
root.render(<App />);
```

`<App />` is a React element description. React evaluates the component tree and coordinates the DOM work needed to display it.

## Rendering does not mean "append HTML"

A useful simplified model is:

```text
root.render(<App />)
        ↓
React evaluates components
        ↓
React builds the next UI description
        ↓
React compares/reconciles work
        ↓
React commits necessary DOM changes
        ↓
browser can paint
```

Later chapters will separate the **render phase**, **commit phase**, and **browser paint** more carefully.

For now, remember:

> Rendering is React calculating what the UI should be. DOM mutation happens during the commit work, not every time a component function line is evaluated.

## Components form a tree

```jsx
function App() {
  return (
    <>
      <Header />
      <Dashboard />
    </>
  );
}
```

If `Dashboard` renders more components, the tree grows:

```text
App
├── Header
└── Dashboard
    ├── StatsGrid
    │   ├── StatCard
    │   └── StatCard
    └── ActivityTable
```

React reasons about this tree over time. Position and identity in the tree later become important for state preservation and keys.

## A component function describes UI

```jsx
function Greeting({name}) {
  return <h1>Hello, {name}</h1>;
}
```

Calling the component yourself is not how you normally render it:

```jsx
// Avoid treating components like ordinary helper calls
Greeting({name: 'Aisha'});
```

Instead let React own component invocation:

```jsx
<Greeting name="Aisha" />
```

This lets React associate Hooks, state, identity, and rendering work with the component correctly.

## Initial render vs re-render

The first time a tree is displayed is the initial render.

Later, React can render components again because of updates such as state changes or parent rendering.

```text
initial root render
      ↓
component tree appears
      ↓
state/props/context changes
      ↓
React schedules more rendering work
```

A re-render does **not** automatically mean every DOM node is recreated. React calculates the next UI and commits the DOM changes that are needed.

## Rendering should be pure

A component should calculate UI from its inputs without changing external systems during render.

Bad:

```jsx
function Counter({count}) {
  document.title = `Count ${count}`;
  return <p>{count}</p>;
}
```

The render function is now mutating an external system.

Better reasoning:

```text
render
  ↓
calculate UI

external synchronization
  ↓
Effect or event, depending on why it happens
```

We will study Effects later. For now, keep render calculation free of side effects.

## `root.unmount`

If another system removes the React application from a page, you can unmount the root:

```js
root.unmount();
```

This tells React to clean up the mounted component tree and detach from the root DOM node.

Most single-page applications do not manually unmount their only app root during normal use.

## `createRoot` vs `hydrateRoot`

`createRoot` is for client rendering into a container that React will manage.

`hydrateRoot` is used when HTML was already generated on the server and React needs to attach to that existing server-rendered markup.

```text
Client-rendered app
empty/root container
      ↓
createRoot

Server-rendered app
existing server HTML
      ↓
hydrateRoot
```

Do not use hydration terminology for a normal client-only Vite app.

## Common mistakes

### Calling `createRoot` repeatedly for ordinary updates

Create the application root once, then let React updates drive the tree.

### Calling component functions manually

Render components with JSX so React controls their lifecycle and Hooks.

### Assuming render equals DOM mutation

React may render work that never commits. Keep render pure.

### Assuming a parent render always means visible DOM changes

A component can execute again and still produce the same visible result.

## Debugging

If nothing appears:

1. confirm the root DOM element exists;
2. confirm `createRoot` receives that element;
3. confirm `root.render` receives valid React content;
4. inspect the browser console for syntax/runtime errors;
5. inspect the component tree with React DevTools.

## Exercise

Given:

```html
<div id="app"></div>
```

Write the entry file that renders:

```text
App
├── Navbar
└── MainContent
```

Then explain, in your own words, the difference between:

- the DOM node with id `app`;
- the React root;
- the `<App />` React element;
- the `App` component function.

## Interview questions

### Junior

What is the difference between `createRoot` and `root.render`?

### Mid-level

Does a component re-render guarantee a DOM update? Why not?

### Senior

Why does React require render logic to be pure, especially with interruptible/concurrent rendering?

## References

- https://react.dev/reference/react-dom/client/createRoot
- https://react.dev/reference/react-dom/client/hydrateRoot
- https://react.dev/learn/render-and-commit
- https://react.dev/reference/rules/components-and-hooks-must-be-pure

## Next

Continue with **[Strict Mode](./strict-mode.md)**.