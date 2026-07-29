---
title: Portals, flushSync, and React DOM Escape Hatches
description: Learn createPortal, React-tree event propagation, modal architecture, DOM ownership boundaries, and when flushSync is justified.
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

# Portals, `flushSync`, and React DOM escape hatches

Most React code should let React choose **where work is scheduled** and let the normal component tree decide **who owns UI**.

Two React DOM APIs intentionally cross those defaults:

- `createPortal` changes **physical DOM placement** without changing React ownership;
- `flushSync` creates a narrow **synchronous commit boundary** for an external integration that needs the DOM updated before control returns.

## React ownership and DOM placement are different trees

<VisualDiagram title="A portal changes placement, not ownership" subtitle="Context and React event propagation follow the React tree even when DOM nodes are mounted somewhere else.">
  <DiagramGrid columns={2}>
    <DiagramNode title="React tree" tone="purple" eyebrow="OWNERSHIP">
      App → Card → Modal → Dialog
      <br />Context flows through this path.
      <br />React events bubble through this path.
    </DiagramNode>
    <DiagramNode title="DOM tree" tone="blue" eyebrow="PLACEMENT">
      body → #root → card DOM
      <br />body → portal target → dialog DOM
      <br />CSS stacking and overflow depend on this tree.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

That distinction is the entire portal mental model.

## `createPortal`

```jsx
import { createPortal } from 'react-dom';

function Modal({ children }) {
  return createPortal(
    <div className="modal-layer">{children}</div>,
    document.body
  );
}
```

`createPortal(children, domNode, key?)` returns a React node. The target DOM node must already exist.

<VisualDiagram title="Portal lifecycle">
  <LifecycleBar
    items={[
      { label: 'Parent renders portal', tone: 'blue' },
      { label: 'React ownership stays with parent', tone: 'purple' },
      { label: 'DOM mounts in target node', tone: 'teal' },
      { label: 'Context + React events still use React ancestry', tone: 'green' },
    ]}
  />
</VisualDiagram>

### Why portals exist

A modal rendered inside a clipped card can be visually trapped by overflow or stacking contexts.

```jsx
<div className="card">
  <Toolbar />
  <Modal />
</div>
```

A portal lets the modal remain conceptually owned by `Card` while placing the actual dialog DOM near `document.body`.

## Context still works

```jsx
const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext value="dark">
      <Page />
    </ThemeContext>
  );
}

function Modal() {
  const theme = useContext(ThemeContext);

  return createPortal(
    <div data-theme={theme}>Dialog</div>,
    document.body
  );
}
```

The dialog can read the provider above `Page` because Context follows the **React tree**, not physical DOM ancestry.

## React events also follow React ownership

```jsx
function Panel() {
  return (
    <div onClick={() => console.log('panel clicked')}>
      {createPortal(<button>Open</button>, document.body)}
    </div>
  );
}
```

Clicking the portal button can reach the React `onClick` on `Panel` even though the button is not inside that `div` in the DOM.

<DecisionTree
  question="A portal click reached an unexpected parent handler. What should you inspect first?"
  items={[
    { label: 'Portal React ancestry', value: 'Find the logical React parent chain' },
    { label: 'Ancestor handlers', value: 'Check which React ancestors listen to the event' },
    { label: 'Interaction boundary', value: 'Stop propagation only when the UX contract requires it' },
    { label: 'Ownership clarity', value: 'Move the portal higher if ownership is conceptually wrong' },
  ]}
/>

## Portals are only placement infrastructure

A production modal still needs accessible behavior:

- dialog semantics and an accessible name;
- focus movement into the dialog;
- focus restoration on close;
- Escape-key handling;
- background interaction management;
- scroll-locking where appropriate.

```jsx
function Modal({ title, onClose, children }) {
  return createPortal(
    <div className="backdrop" onMouseDown={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onMouseDown={event => event.stopPropagation()}
      >
        <h2 id="dialog-title">{title}</h2>
        {children}
      </section>
    </div>,
    document.body
  );
}
```

## Integrating with non-React DOM

Portals can also project React content into a DOM container supplied by another system:

```jsx
function MapPopup({ container, children }) {
  if (!container) return null;
  return createPortal(children, container);
}
```

Useful examples include map popups, CMS slots, legacy shells, and embedded widgets.

If the target DOM node changes, React recreates the portal content in the new location. Prefer stable targets unless moving the subtree is intentional.

---

# `flushSync`

`flushSync` tells React that an external boundary requires the DOM to reflect an update synchronously.

```jsx
import { flushSync } from 'react-dom';

flushSync(() => {
  setIsPrinting(true);
});

// Required DOM update has committed by here.
```

## Normal scheduling vs synchronous integration

<VisualDiagram title="Default scheduling should remain the normal path">
  <DiagramGrid columns={2}>
    <DiagramNode title="Normal React update" tone="green" eyebrow="DEFAULT">
      State update → React schedules/render work → commit when appropriate.
      <br />React keeps batching and prioritization freedom.
    </DiagramNode>
    <DiagramNode title="flushSync boundary" tone="orange" eyebrow="ESCAPE HATCH">
      External callback → flushSync update → required DOM commits now → external system reads DOM.
      <br />Scheduling flexibility is reduced.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

If everything involved is React-owned, you usually do **not** need `flushSync`.

## Real use case: browser integration

```jsx
useEffect(() => {
  function handleBeforePrint() {
    flushSync(() => {
      setIsPrinting(true);
    });
  }

  function handleAfterPrint() {
    setIsPrinting(false);
  }

  window.addEventListener('beforeprint', handleBeforePrint);
  window.addEventListener('afterprint', handleAfterPrint);

  return () => {
    window.removeEventListener('beforeprint', handleBeforePrint);
    window.removeEventListener('afterprint', handleAfterPrint);
  };
}, []);
```

The browser's print lifecycle may require the updated document layout before the callback finishes. That is an **external timing contract**, not a normal state-update pattern.

## `flushSync` is broader than one setter

React may need to flush other pending work to satisfy the synchronous boundary. It can also cause pending Effects or Suspense behavior to become observable sooner than expected.

<VisualDiagram title="Think in terms of DOM consistency, not setter execution">
  <DiagramStack align="center">
    <DiagramNode title="External system requires current DOM" tone="orange" />
    <DiagramArrow label="enter synchronous boundary" />
    <DiagramNode title="React flushes work needed for consistency" tone="purple" />
    <DiagramArrow label="commit" />
    <DiagramNode title="DOM is ready for external read" tone="green" />
  </DiagramStack>
</VisualDiagram>

## What `flushSync` does not solve

It does **not** change state snapshot or closure semantics:

```jsx
setCount(c => c + 1);
```

Use a functional updater for stale-state dependencies rather than forcing synchronous commits.

It is also not a performance optimization. Frequent synchronous flushing can block the main thread and remove React's scheduling flexibility.

## Decision rule

<DecisionTree
  question="Should this update use flushSync?"
  items={[
    { label: 'Only React-owned UI?', value: 'No — keep normal scheduling' },
    { label: 'External system reads DOM immediately?', value: 'Maybe — verify it truly needs the updated DOM before return' },
    { label: 'Integration can be redesigned?', value: 'Prefer redesign over synchronous flushing' },
    { label: 'Requirement is unavoidable and measured?', value: 'Use one narrow flushSync boundary' },
  ]}
/>

## Common mistakes

- assuming portal children lose Context;
- reasoning about portal events only from DOM ancestry;
- using portals as a substitute for clear ownership;
- forcing every update through `flushSync`;
- using `flushSync` to work around stale closures;
- treating synchronous commits as a performance shortcut.

## Exercise

Build a global confirmation dialog that renders into `document.body`, inherits theme Context, handles backdrop clicks correctly, restores focus, and never uses `flushSync`.

Then add a separate print-preview integration where the browser genuinely requires a DOM update before printing and justify one narrow `flushSync` call.

## Interview questions

**Junior:** What does `createPortal` change, and what does it preserve?

**Mid-level:** Why can a portal click reach a React ancestor that is not its DOM ancestor?

**Senior:** What external timing requirement would justify `flushSync`, and what scheduling/performance trade-off does it introduce?

## Summary

<VisualDiagram title="React DOM escape hatches">
  <DiagramGrid columns={2}>
    <DiagramNode title="createPortal" tone="blue">Changes DOM placement · preserves React ownership · preserves Context · React events follow React ancestry.</DiagramNode>
    <DiagramNode title="flushSync" tone="orange">Forces a narrow synchronous commit boundary · justified by external DOM timing requirements · reduces scheduling flexibility.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## References

- https://react.dev/reference/react-dom/createPortal
- https://react.dev/reference/react-dom/flushSync
