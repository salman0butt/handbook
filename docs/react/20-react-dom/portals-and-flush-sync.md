---
title: Portals, flushSync, and React DOM Escape Hatches
description: Learn createPortal, React-tree event propagation, modal architecture, DOM ownership boundaries, and when flushSync is justified.
sidebar_position: 1
---

# Portals, `flushSync`, and React DOM escape hatches

Most React applications should let React own rendering and scheduling.

Two important React DOM APIs deliberately let you cross that default boundary:

- `createPortal` changes **where DOM is physically placed** without changing the React ownership tree;
- `flushSync` forces React to **synchronously commit updates** when an external system requires the DOM to be ready immediately.

Both are escape hatches. They solve real problems, but their value comes from using them narrowly.

## Mental model

```text
React tree answers:
Who owns this UI?
Which Context is visible?
How do React events propagate?

DOM tree answers:
Where is this node physically mounted?
Which CSS stacking/overflow constraints affect it?

createPortal changes DOM placement,
not React ownership.
```

And for `flushSync`:

```text
normal React update
state change
   ↓
React schedules work
   ↓
render
   ↓
commit when appropriate

flushSync
callback
   ↓
React flushes required work now
   ↓
DOM is updated before next statement
```

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

`createPortal(children, domNode, key?)` returns a React node.

The target DOM node must already exist.

The portal content is physically inserted into the target node, but logically remains a child of the React component that created the portal.

## Why portals exist

Consider a modal rendered inside this layout:

```jsx
<div className="card">
  <Toolbar />
  <Modal />
</div>
```

If `.card` has clipping or stacking-context styles, a modal rendered normally inside it may be visually trapped.

A portal lets the modal remain owned by the same React component while rendering its DOM elsewhere:

```text
React tree
App
└── Card
    ├── Toolbar
    └── Modal
        └── Dialog

DOM tree
body
├── #root
│   └── card DOM
└── dialog DOM   ← portal target
```

This distinction is the key to understanding portals.

## Context still works through portals

```jsx
const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext value="dark">
      <Page />
    </ThemeContext>
  );
}

function Page() {
  return <Modal />;
}

function Modal() {
  const theme = useContext(ThemeContext);

  return createPortal(
    <div data-theme={theme}>Dialog</div>,
    document.body
  );
}
```

Even though the dialog DOM is outside `#root`, it still sees `ThemeContext` because Context follows the **React tree**, not the DOM tree.

## Events bubble through the React tree

```jsx
function Panel() {
  function handleClick() {
    console.log('panel clicked');
  }

  return (
    <div onClick={handleClick}>
      {createPortal(
        <button>Open</button>,
        document.body
      )}
    </div>
  );
}
```

Clicking the portal button can trigger the `div`'s React `onClick` handler even though the button is not physically inside that `div` in the DOM.

### Debugging portal event bugs

When an event from a portal unexpectedly reaches a parent handler, ask:

1. Where is the portal in the **React tree**?
2. Which React ancestors have event handlers?
3. Should the portal stop propagation?
4. Would moving the portal higher in the React tree make ownership clearer?

Do not assume physical DOM ancestry determines React event propagation.

## Modal architecture

Portals solve positioning, but a production modal also needs behavioral correctness.

A modal usually requires:

- an accessible dialog role;
- an accessible name;
- focus movement into the dialog;
- focus restoration when it closes;
- Escape-key behavior;
- background interaction management;
- scroll locking where appropriate.

Example structure:

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

The portal is only the placement mechanism. Accessibility and interaction design remain your responsibility.

## Portals into non-React DOM

Portals are also useful when integrating React with an existing DOM container owned by another system.

```jsx
function MapPopup({ container, children }) {
  if (!container) return null;
  return createPortal(children, container);
}
```

This pattern is useful for map popups, CMS-managed regions, legacy application shells, and embedded widgets.

## Changing the target recreates content

If a later render passes a different target DOM node, React recreates the portal content in the new location.

That can affect local state and DOM continuity.

Prefer a stable target unless moving the subtree is intentional.

## What portals do not do

Portals do not automatically provide global state, focus management, z-index correctness, animation coordination, scroll locking, or accessibility.

They only change DOM placement while keeping React ownership.

---

# `flushSync`

`flushSync` forces React to synchronously flush updates made inside a callback.

```jsx
import { flushSync } from 'react-dom';

flushSync(() => {
  setIsPrinting(true);
});

// By this line, the required DOM update has committed.
```

This is intentionally uncommon.

## Default behavior is usually better

React normally batches and schedules work so it can prioritize urgent work and avoid blocking the browser unnecessarily.

Calling `flushSync` removes some of that flexibility.

Therefore the default rule is:

> If everything involved is React-owned, you probably do not need `flushSync`.

## Real use case: browser or third-party integration

Some external APIs require the DOM to reflect a state change before the callback returns.

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

The browser expects the page layout to be ready before opening the print dialog.

This is an integration requirement, not a normal UI-update pattern.

## `flushSync` can flush more than the callback

React may need to flush other pending updates to complete the requested synchronous work.

It may also run pending Effects and synchronously apply updates they contain.

Think of `flushSync` as:

> "Make the React DOM consistent with this required synchronous boundary now."

not:

> "Synchronously execute only this one setter."

## Suspense interaction

If a synchronous update causes a subtree to suspend, React may need to show a Suspense fallback immediately.

This is another reason to avoid it as a general timing trick.

## Do not call it during React rendering

Do not call `flushSync` while React is already rendering, including from render logic, Effects, layout Effects, or class lifecycle methods.

If an external system really requires synchronous DOM work, move that boundary to the external event or callback when possible.

## `flushSync` is not a fix for stale state

Wrong idea:

```jsx
flushSync(() => {
  setCount(count + 1);
});
```

This does not change React's state snapshot model.

If the issue is stale state, use an updater:

```jsx
setCount(c => c + 1);
```

`flushSync` affects commit timing, not closure semantics.

## `flushSync` is not a performance optimization

If a UI feels slow, forcing synchronous work usually makes the main thread **more** blocked.

Profile first. The real solution may be reducing render work, memoization where justified, transitions, deferred values, virtualization, changing state ownership, or moving CPU-heavy work elsewhere.

## Production decision rule

Ask these questions before using `flushSync`:

1. Is a non-React system reading the DOM immediately after this callback?
2. Does that system require the updated DOM synchronously?
3. Can the integration be redesigned to avoid that timing requirement?
4. Have I measured the performance cost?
5. Could this force a Suspense fallback or pending Effect unexpectedly?

If the first two answers are not clearly yes, avoid it.

## Common mistakes

- building a modal without considering React-tree event propagation;
- assuming portal children lose Context;
- using portals as a substitute for clear component ownership;
- calling `flushSync` after every state update;
- using `flushSync` to work around stale closures;
- treating `flushSync` as a performance tool.

## Exercise

Build a global confirmation dialog that:

1. renders into `document.body` with `createPortal`;
2. receives theme from Context above the portal;
3. closes on backdrop click;
4. does not close when clicking inside the dialog;
5. restores focus to the triggering button;
6. does not use `flushSync`.

Then add a separate print-preview feature where a browser callback genuinely requires the DOM update before printing, and justify a single `flushSync` call.

## Interview questions

**Junior:** What problem does `createPortal` solve?

**Mid-level:** Why can a click inside a portal trigger an `onClick` on an ancestor that is not its DOM ancestor?

**Senior:** When is `flushSync` justified, and why is frequent use a scheduling/performance smell?

## Summary

```text
createPortal:
React ownership stays the same
DOM placement changes
Context still works
React events follow the React tree

flushSync:
forces a synchronous commit boundary
use only for external integration requirements
can hurt performance
can force Suspense fallbacks
```

## References

- https://react.dev/reference/react-dom/createPortal
- https://react.dev/reference/react-dom/flushSync
