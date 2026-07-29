---
title: Hydration and hydrateRoot
description: Understand server HTML, client hydration, mismatch debugging, root lifecycle, and why hydration is not a second independent render.
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

# Hydration and `hydrateRoot`

Server rendering can send useful HTML before the browser downloads and executes the client React application.

Hydration is the phase where React connects component logic to that existing server-generated DOM.

## The hydration pipeline

<VisualDiagram title="Hydration reuses server HTML instead of rebuilding correct DOM from scratch">
  <DiagramStack align="center">
    <DiagramNode title="Server React tree" tone="purple" />
    <DiagramArrow label="server render" />
    <DiagramNode title="HTML" tone="blue" />
    <DiagramArrow label="network" />
    <DiagramNode title="Browser already has DOM" tone="teal" />
    <DiagramArrow label="hydrateRoot" />
    <DiagramNode title="React connects logic + events to existing DOM" tone="green" />
  </DiagramStack>
</VisualDiagram>

```jsx
import { hydrateRoot } from 'react-dom/client';
import App from './App.jsx';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

Use `hydrateRoot` when the container already contains HTML produced by React on the server.

For a client-only empty container, use `createRoot`.

## `createRoot` vs `hydrateRoot`

<VisualDiagram title="Choose the root API based on who already owns the DOM">
  <DiagramGrid columns={2}>
    <DiagramNode title="createRoot" tone="blue" eyebrow="CLIENT-OWNED SURFACE">
      Container starts as a client React surface.
      <br />The first `root.render` creates React-owned DOM.
    </DiagramNode>
    <DiagramNode title="hydrateRoot" tone="purple" eyebrow="SERVER HTML EXISTS">
      Container already contains React server HTML.
      <br />React reuses compatible DOM and attaches behavior.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Using the wrong API changes the ownership model.

## The first client render must match

Server output:

```html
<button>Count: 0</button>
```

Client component:

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;
}
```

The initial client render conceptually describes the same button, so React can connect interactivity to the existing DOM.

<VisualDiagram title="Hydration is a consistency contract">
  <DiagramGrid columns={2}>
    <DiagramNode title="Server snapshot" tone="blue">Props · route params · data · locale · feature flags · generated IDs</DiagramNode>
    <DiagramNode title="First client snapshot" tone="purple">Must describe the same initial UI and identifiers</DiagramNode>
  </DiagramGrid>
  <DiagramArrow label="agreement enables reuse" />
  <DiagramNode title="Compatible existing DOM becomes interactive" tone="green" wide />
</VisualDiagram>

## Hydration mismatches

Common mismatch sources include:

- `Date.now()` or `Math.random()` during render;
- locale/timezone differences;
- browser-only state read during the initial render;
- server/client data snapshots that disagree;
- browser extensions or third-party scripts mutating DOM first;
- invalid HTML that the browser repairs;
- feature flags/configuration that differ across environments.

```jsx
function Clock() {
  return <p>{Date.now()}</p>;
}
```

The server and browser almost certainly compute different text.

## Prefer deterministic first render

For truly browser-only information, use a server-compatible initial state and synchronize after hydration.

```jsx
function OnlineStatus() {
  const [online, setOnline] = useState(null);

  useEffect(() => {
    setOnline(navigator.onLine);
  }, []);

  if (online === null) {
    return <span>Checking connection…</span>;
  }

  return <span>{online ? 'Online' : 'Offline'}</span>;
}
```

<VisualDiagram title="Two-pass browser-only UI has a real cost">
  <LifecycleBar
    items={[
      { label: 'Server renders stable placeholder', tone: 'blue' },
      { label: 'Browser hydrates same placeholder', tone: 'purple' },
      { label: 'Effect reads browser environment', tone: 'orange' },
      { label: 'React renders browser-specific UI', tone: 'green' },
    ]}
  />
</VisualDiagram>

Do not use this as a universal mismatch patch. Prefer deterministic server data when possible.

## `suppressHydrationWarning`

```jsx
<time suppressHydrationWarning>
  {new Date().toLocaleTimeString()}
</time>
```

This is a narrow escape hatch for intentionally different content. It does not make broad server/client disagreement safe.

## Hydration still performs client work

<VisualDiagram title="Existing HTML does not mean zero client cost">
  <DiagramGrid columns={2}>
    <DiagramNode title="Already available" tone="green">HTML and DOM can be visible before React finishes loading.</DiagramNode>
    <DiagramNode title="Still required" tone="orange">Download JS · evaluate components · recreate React tree · attach events · hydrate interactive regions.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Hydration is not “running the server HTML again,” but React still needs enough client-side work to connect the DOM to the live tree.

## Multiple roots and `identifierPrefix`

A page may have independent hydrated roots:

```jsx
hydrateRoot(document.getElementById('header-root'), <Header />);
hydrateRoot(document.getElementById('app-root'), <App />);
```

Generated ID namespaces must remain deliberate across roots. If `identifierPrefix` is used, server rendering and hydration must agree on it so APIs such as `useId` remain consistent.

## Root lifecycle after hydration

```jsx
const root = hydrateRoot(container, <App />);
```

Later updates can use the returned root, but do not call `root.render` as an immediate initialization step. If it runs before hydration finishes, React can clear the server HTML and switch the root to client rendering.

```jsx
root.unmount();
```

Unmounting matters when a non-React shell, CMS, legacy application, or micro-frontend host is about to remove a DOM region containing a React root.

<VisualDiagram title="External hosts must respect the React root lifecycle">
  <DiagramStack align="center">
    <DiagramNode title="External host owns outer region" tone="orange" />
    <DiagramArrow label="mounts" />
    <DiagramNode title="Hydrated React root owns its subtree" tone="purple" />
    <DiagramArrow label="before host removes region" />
    <DiagramNode title="root.unmount() lets React clean up" tone="green" />
  </DiagramStack>
</VisualDiagram>

## Hydration + Suspense + streaming

Streaming changes hydration from an all-or-nothing mental model into boundary-aware progressive work.

<VisualDiagram title="Streaming and hydration cooperate across Suspense boundaries">
  <LifecycleBar
    items={[
      { label: 'Server sends shell', tone: 'blue' },
      { label: 'Fallbacks represent pending boundaries', tone: 'orange' },
      { label: 'Completed HTML streams later', tone: 'teal' },
      { label: 'React hydrates available interactive regions', tone: 'purple' },
      { label: 'Page becomes progressively interactive', tone: 'green' },
    ]}
  />
</VisualDiagram>

This is one reason modern server rendering prefers streaming APIs over one final blocking string for Suspense-heavy applications.

## SSR and Server Components are different axes

<VisualDiagram title="Do not equate server rendering with Server Components">
  <DiagramGrid columns={2}>
    <DiagramNode title="Traditional SSR" tone="blue">
      Component executes on the server to make HTML.
      <br />Its client implementation may still ship and hydrate.
    </DiagramNode>
    <DiagramNode title="Server Component" tone="purple">
      Component implementation executes in the server environment.
      <br />Interactive Client Component boundaries define what browser code is needed.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

SSR answers how output becomes HTML. Server Components answer where component code executes and what crosses the server/client boundary.

## Data consistency is the production contract

The browser should initialize from the same logical snapshot the server used to produce HTML.

Common strategies include:

- serialized initial data;
- framework loader data;
- cache dehydration/rehydration;
- shared route params, locale, and feature flags;
- versioned data when stale responses are possible.

## Browser-only APIs

This is invalid during normal server rendering:

```jsx
const width = window.innerWidth;
```

Even a guard can create mismatched output:

```jsx
const isBrowser = typeof window !== 'undefined';
return <p>{isBrowser ? 'Client' : 'Server'}</p>;
```

The server describes one tree while the first browser render describes another.

## Debugging hydration

<DecisionTree
  question="A hydration mismatch appeared. What should you compare?"
  items={[
    { label: 'Render inputs', value: 'Compare props, params, data, locale, timezone, flags, IDs, random/time values' },
    { label: 'Browser-only reads', value: 'Check window/document/storage/media/locale branches during first render' },
    { label: 'HTML structure', value: 'Inspect actual browser DOM for repaired invalid markup' },
    { label: 'External mutation', value: 'Check extensions, analytics, legacy scripts, or libraries that touched DOM first' },
  ]}
/>

Do not silence mismatch warnings before understanding the cause.

## Common mistakes

- using `createRoot` for server-generated HTML;
- rendering timestamps/random values directly during initial render;
- ignoring hydration warnings because the page “looks fine”;
- making everything client-only instead of fixing the server/client contract;
- calling `root.render` immediately after `hydrateRoot`;
- assuming server HTML means hydration is free.

## Exercise

Create an SSR-compatible profile page with deterministic HTML, a hydrated Like button, a `useId` form label, a browser-only online-status indicator that does not mismatch, and one timestamp mismatch that you deliberately diagnose and fix.

Document every input that must be identical between server and first client render.

## Interview questions

**Junior:** What is hydration?

**Mid-level:** Why are hydration mismatches correctness issues rather than cosmetic warnings?

**Senior:** How do streaming Suspense boundaries change the traditional “render all HTML, then hydrate everything” architecture?

## Summary

<VisualDiagram title="Hydration in one picture">
  <LifecycleBar
    items={[
      { label: 'Server renders deterministic HTML', tone: 'blue' },
      { label: 'Browser displays existing DOM', tone: 'teal' },
      { label: 'Client first render matches server snapshot', tone: 'purple' },
      { label: 'hydrateRoot connects logic', tone: 'orange' },
      { label: 'Interactive React tree continues from existing DOM', tone: 'green' },
    ]}
  />
</VisualDiagram>

## References

- https://react.dev/reference/react-dom/client/hydrateRoot
- https://react.dev/reference/react-dom/client
- https://react.dev/reference/react/useId
