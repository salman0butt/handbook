---
title: Error Boundaries, Owner Stacks, and Root Error Handling
description: Senior React error architecture using Error Boundaries, component stacks, captureOwnerStack, and root-level error callbacks.
sidebar_position: 1
---

# Error Boundaries, Owner Stacks, and Root Error Handling

Production React applications need more than a global `window.onerror` handler.

Errors can occur during:

- component rendering;
- Suspense resource reads;
- Effects;
- event handlers;
- async callbacks;
- server rendering;
- hydration;
- Server Functions;
- network/data parsing;
- third-party integrations.

Different failure classes require different recovery mechanisms.

A senior React architecture separates:

```text
UI containment
→ Error Boundaries

root/runtime reporting
→ createRoot / hydrateRoot error callbacks

development ownership debugging
→ captureOwnerStack

business/network failures
→ explicit result/error state

process/server failures
→ server observability and platform handling
```

## Error Boundaries contain rendering failures

An Error Boundary is a component that catches errors thrown while rendering descendants and renders fallback UI instead.

In React 19.2, Error Boundaries are still implemented using class-component error lifecycle APIs.

```jsx
import * as React from 'react';

class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    reportError(error, {
      componentStack: info.componentStack,
    });
  }

  render() {
    if (this.state.error) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
```

You can also use a maintained Error Boundary library rather than writing the class repeatedly.

## What Error Boundaries catch

They catch errors thrown by descendant React rendering work, including errors from:

- rendering descendants;
- class lifecycle methods;
- many Hook/render paths;
- rejected `use` resources that surface as errors rather than pending Suspense;
- errors thrown inside Transition Actions that React routes through the render/error system.

They do **not** catch every JavaScript error in the application.

## What Error Boundaries do not catch

Important exclusions include:

- errors in event handlers;
- ordinary async callbacks such as `setTimeout`;
- server-side rendering errors;
- errors thrown inside the Error Boundary itself;
- failures outside the React tree.

Example:

```jsx
function SaveButton() {
  function handleClick() {
    throw new Error('save event failed');
  }

  return <button onClick={handleClick}>Save</button>;
}
```

An ancestor Error Boundary is not the mechanism for this event-handler exception.

Use normal JavaScript error handling or explicit async error state around event-caused work.

## Boundary placement is product architecture

Do not wrap every component.

Place boundaries where the product can provide meaningful containment and recovery.

Examples:

```text
App shell
├── Navigation
├── ErrorBoundary: Conversation list
│   └── Conversations
└── ErrorBoundary: Active conversation
    └── Message thread
```

If the message composer fails, perhaps the conversation list should remain usable.

If one analytics widget fails, perhaps the rest of the dashboard should remain visible.

Boundary granularity should follow **user recovery boundaries**, not component file boundaries.

## Fallbacks need product behavior

Weak fallback:

```jsx
<p>Something went wrong</p>
```

A stronger production fallback may include:

- explanation at the right level;
- retry action;
- navigation to a safe state;
- support/error reference ID;
- preserved unsaved user input when possible;
- accessible focus movement/announcement;
- telemetry correlation.

```jsx
<ErrorBoundary
  fallback={
    <section role="alert">
      <h2>We couldn't load this conversation.</h2>
      <button onClick={retry}>Try again</button>
    </section>
  }
>
  <Conversation />
</ErrorBoundary>
```

## Resetting Error Boundaries

A boundary that stores `hasError` or `error` state stays in its fallback until that state is reset.

One strategy is a key tied to logical identity:

```jsx
<ErrorBoundary key={conversationId} fallback={<ConversationCrash />}>
  <Conversation id={conversationId} />
</ErrorBoundary>
```

Switching to a different conversation creates a fresh boundary identity.

Libraries often provide explicit `resetBoundary()` or `resetKeys` mechanisms.

Choose reset semantics based on domain identity.

## Error Boundary + Suspense

Suspense handles **pending work**.

Error Boundaries handle **failed work**.

```jsx
<ErrorBoundary fallback={<AlbumsError />}>
  <Suspense fallback={<AlbumsSkeleton />}>
    <Albums />
  </Suspense>
</ErrorBoundary>
```

Conceptually:

```text
Promise pending
→ Suspense fallback

Promise rejected
→ Error Boundary fallback
```

This composition is fundamental for async UI architecture.

## Do not catch `use` with try/catch

This is incorrect:

```jsx
function Albums({ promise }) {
  try {
    const albums = use(promise);
    return <List albums={albums} />;
  } catch {
    return <p>Error</p>;
  }
}
```

`use` integrates with Suspense/Error Boundaries through React's rendering mechanism.

Wrap the relevant tree with Suspense and an Error Boundary instead.

## Component Stack vs JavaScript stack

When React catches an error, `componentDidCatch` receives an `info.componentStack`.

A component stack tells you **where the failing component was rendered in the React tree**.

That differs from the JavaScript error stack, which tells you the function-call path at the throw site.

Useful report shape:

```js
reportError(error, {
  jsStack: error.stack,
  componentStack: info.componentStack,
});
```

In production, ensure source maps are securely available to your observability system so minified stack traces can be decoded.

## Owner Stack: who created this React node?

React 19 provides `captureOwnerStack()` for development diagnostics.

The **Owner Stack** answers a subtly different question from the component stack:

> Which components created the React nodes leading to this point?

This is valuable when a component is passed around as `children` or constructed by one component but rendered through another.

## `captureOwnerStack` is development-only

Current behavior:

```js
import * as React from 'react';

if (process.env.NODE_ENV !== 'production') {
  const ownerStack = React.captureOwnerStack?.();
  console.log(ownerStack);
}
```

Important caveats:

- it returns `string | null`;
- it is only available in development builds;
- outside development it returns `null` / is not exported in the same way;
- namespace import + conditional access is safer for shared dev/prod bundles;
- it only works while React ownership context is available.

Do not design production error reporting around Owner Stacks.

## Where Owner Stacks are available

React documents Owner Stack availability during React-controlled execution such as:

- component render;
- Effects;
- React event handlers;
- React root error handlers.

They may be unavailable later in detached callbacks such as:

- `setTimeout`;
- code after unrelated async boundaries;
- custom DOM event listeners.

If you need the owner context, capture it while React still has it.

## Root error callbacks in React 19

React 19 changed error reporting behavior and added root-level callbacks.

`createRoot` and `hydrateRoot` can receive:

```jsx
const root = createRoot(container, {
  onCaughtError(error, errorInfo) {
    report('caught', error, errorInfo);
  },
  onUncaughtError(error, errorInfo) {
    report('uncaught', error, errorInfo);
  },
  onRecoverableError(error, errorInfo) {
    report('recoverable', error, errorInfo);
  },
});
```

### `onCaughtError`

Called when React catches an error using an Error Boundary.

Use it for centralized telemetry even when the UI recovers locally.

### `onUncaughtError`

Called when a React error reaches the root without an Error Boundary handling it.

This is a high-severity signal because the affected root cannot locally recover through a boundary.

### `onRecoverableError`

Called when React detects an error but can automatically recover.

Hydration mismatches/recovery are an important category to monitor here.

Some recoverable errors may expose the original cause through `error.cause`.

## Do not double-report errors blindly

If you report from both:

- `componentDidCatch`;
- `onCaughtError`;

then a single failure may generate duplicate telemetry.

Choose a consistent architecture.

For example:

```text
Error Boundary
→ user fallback + local recovery metadata

root onCaughtError
→ centralized logging
```

Or:

```text
componentDidCatch
→ centralized logging with boundary-specific context

root handler
→ only root-level unmatched/recoverable cases
```

Document the ownership so teams do not add duplicate reporters.

## Error taxonomy matters

Not every failure should be thrown.

### Expected business failure

```text
Coupon invalid
Payment declined
Username already taken
```

These usually belong in explicit state and user-facing validation.

### Unexpected application failure

```text
Invariant violated
Unexpected null where impossible
Renderer crashed
Data shape violated trusted contract
```

These may appropriately throw and reach an Error Boundary/reporting pipeline.

### Infrastructure failure

```text
API timeout
Database unavailable
CDN failure
```

These often need retry/backoff/product-state handling and telemetry.

Treating every failure as an Error Boundary exception produces poor UX and noisy monitoring.

## Async event handling

For event-caused async work:

```jsx
async function handleSave() {
  setStatus('saving');

  try {
    await saveDocument();
    setStatus('saved');
  } catch (error) {
    setStatus('error');
    reportError(error);
  }
}
```

This is different from a render failure.

The user can often retry without remounting an entire subtree.

## Server rendering errors

Error Boundaries do not catch SSR errors in the same way they catch client rendering descendants.

Streaming SSR provides server callbacks such as shell/error handling through the server rendering API.

Your production architecture needs both:

```text
server render error pipeline
+
client render Error Boundary/root pipeline
```

Do not assume one replaces the other.

## Hydration errors

Hydration failures deserve their own telemetry dimensions.

Capture:

- route/page;
- deployment/version;
- locale/timezone inputs;
- feature flags;
- server/client data version;
- browser extensions if detectable only as context, not as blame;
- `onRecoverableError` details;
- component stack.

Common causes include nondeterministic first render and different server/client data snapshots.

## Development error overlay integration

If you build framework/dev tooling, `captureOwnerStack` can enrich a custom error overlay.

Do not ship that expensive/debug-only path as production application logic.

## Error reference IDs

A production fallback can generate or display a correlation ID from the reporting pipeline:

```text
We couldn't load this panel.
Reference: ERR-7F2A91
```

That helps support connect a user's report to telemetry without exposing sensitive stack traces.

Never display raw server stack traces, secrets, SQL errors, or internal file paths to end users.

## Boundary recovery strategy

When designing a boundary, answer:

1. What user capability failed?
2. What can remain usable?
3. Can the action be retried safely?
4. Does retry need a new key/resource/request?
5. Is unsaved state preserved?
6. Where should focus move?
7. What telemetry context is needed?
8. Is this expected or exceptional?

## Senior debugging sequence

When a React error reaches production:

```text
1. classify caught / uncaught / recoverable
2. find route + release + feature flag
3. inspect JS stack
4. inspect component stack
5. inspect network/server correlation
6. reproduce in development build
7. use Owner Stack if ownership is unclear
8. identify recovery boundary
9. fix root cause
10. add regression test + monitoring
```

## Interview questions

### Can Error Boundaries catch event-handler errors?

No. Use normal event/async error handling for those failures.

### Can function components implement an Error Boundary directly?

React 19.2 still has no direct function-component equivalent for the class Error Boundary lifecycle APIs. Use a reusable boundary class or library.

### What is the difference between Owner Stack and component stack?

The component stack describes the rendered component ancestry around an error. The Owner Stack focuses on which components created the relevant React nodes.

### Can `captureOwnerStack` be used for production telemetry?

No. It is development-only.

### Why use `onRecoverableError`?

It surfaces errors React was able to recover from, which are still valuable production signals, especially hydration/recovery issues.

## Exercise

Build a dashboard with three independent widgets.

Requirements:

- each widget has an Error Boundary;
- the overall shell remains usable if one widget crashes;
- a root `onCaughtError` reporter records component stack;
- a root `onUncaughtError` reporter marks severity as critical;
- development reports include Owner Stack when available;
- retries reset only the failed widget;
- duplicate reports are avoided.

## References

- https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
- https://react.dev/reference/react/captureOwnerStack
- https://react.dev/reference/react-dom/client/createRoot
- https://react.dev/reference/react-dom/client/hydrateRoot
- https://react.dev/reference/react/use
- https://react.dev/blog/2024/04/25/react-19-upgrade-guide
