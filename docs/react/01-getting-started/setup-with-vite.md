---
title: Set Up React with Vite
description: Create a modern React project with Vite and understand the files, scripts, and tooling involved.
sidebar_position: 2
---

# Set up React with Vite

For a small client-side React application where you are learning React itself, Vite is a practical modern build-tool choice.

This chapter is about the **tooling around React**. Vite is not part of React core.

## Why not start with Create React App?

Create React App played an important historical role, but React officially deprecated it for new apps in 2025. Modern projects should use a framework when the application benefits from one, or use a build tool such as Vite when building a client-side React application from scratch.

For this handbook, Vite keeps the environment small enough that you can see React itself clearly.

## Create a project

With a current Node.js installation:

```bash
npm create vite@latest
```

Choose a React template, then install dependencies and start development:

```bash
cd my-react-app
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

## Typical project structure

A small Vite React project commonly looks like this:

```text
my-react-app/
├── index.html
├── package.json
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
└── vite.config.js   # when project-specific config is needed
```

The exact generated files can change between Vite versions. Learn the responsibilities, not the filename trivia.

## `index.html`

Unlike older setups that hide the HTML template behind tooling, Vite keeps `index.html` visible at the project root.

A simplified version contains a root element:

```html
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
```

The browser has a real DOM node named `root`. React will manage the React tree mounted inside that node.

## `main.jsx`

The entry file connects React to the browser DOM.

```jsx
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

Mental model:

```text
index.html
  ↓
#root DOM node
  ↓
createRoot(...)
  ↓
React root
  ↓
root.render(<App />)
  ↓
component tree
```

Most application components never call `createRoot`. It is normally used at the application entry point.

## `App.jsx`

`App` is an ordinary React component:

```jsx
export default function App() {
  return (
    <main>
      <h1>My React app</h1>
    </main>
  );
}
```

There is nothing special about the name `App`. It is simply a conventional top-level component name.

## Development server vs production build

During development:

```bash
npm run dev
```

You get fast feedback, development warnings, and hot updates from Vite.

For a production build:

```bash
npm run build
```

Vite creates optimized output for deployment.

A useful distinction:

```text
Development
- extra warnings
- developer tooling
- fast iteration

Production
- optimized output
- no development-only checks
- deployable assets
```

Do not make performance conclusions from development mode alone.

## React DevTools

Install React DevTools in a supported browser while learning and debugging React.

Use it to inspect:

- component trees;
- props;
- state;
- Context;
- rendering/profiling behavior.

DevTools is not a substitute for understanding the render model, but it makes that model visible.

## JavaScript or TypeScript template?

Both are valid.

If you are learning React fundamentals for the first time, JavaScript can reduce the number of concepts introduced at once. If you already know TypeScript, using the TypeScript template is reasonable.

The React mental model is the same either way.

## Should every React app use Vite?

No.

Use a framework when you need framework-level capabilities such as integrated routing, data loading, server rendering, React Server Components infrastructure, or application conventions that the framework provides.

Use a client build tool when you intentionally want a client-rendered React application or need control over your own architecture.

Decision model:

```text
Need only client-side React fundamentals?
        ↓ yes
Vite is a good learning/tooling choice

Need integrated server rendering, routing,
data loading, RSC, deployment conventions?
        ↓ yes
Evaluate a React framework
```

Do not confuse "React" with whichever tool created the project.

## Common mistakes

### Learning generated files instead of responsibilities

Templates evolve. Understand entry points, modules, and root rendering.

### Editing `node_modules`

Dependencies under `node_modules` are installed artifacts, not application source code.

### Treating build-tool environment variables as secret storage

Frontend values shipped to the browser can be inspected by users. Do not put server secrets into client bundles.

### Assuming Vite supplies React features

Hooks, components, Suspense, Context, and rendering are React. The dev server and build pipeline are tooling.

## Exercise

Create a Vite React project and make the component tree:

```text
App
├── Header
├── ProductList
│   ├── ProductCard
│   └── ProductCard
└── Footer
```

Requirements:

- each component should be a function component;
- move each major component into its own module;
- pass product data through props;
- do not add state yet.

## Interview questions

### Junior

What is the responsibility of `createRoot`?

### Mid-level

What is the difference between React and Vite?

### Senior

When would you choose a framework instead of a client build tool for a new React application?

## References

- https://react.dev/learn/installation
- https://react.dev/blog/2025/02/14/sunsetting-create-react-app
- https://react.dev/reference/react-dom/client/createRoot
- https://vite.dev/guide/

## Next

Continue with **[Rendering a React application](./rendering-a-react-app.md)**.