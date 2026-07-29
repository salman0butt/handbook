---
title: Error Boundaries, Owner Stacks, and Root Error Handling
description: Senior React error architecture using Error Boundaries, component stacks, captureOwnerStack, and root-level error callbacks.
sidebar_position: 1
---

import {
  VisualDiagram,
  DiagramStack,
  DiagramRow,
  DiagramGrid,
  DiagramNode,
  DiagramArrow,
  DecisionTree,
  LifecycleBar,
} from '@site/src/components/handbook/VisualDiagram'

# Error Boundaries, Owner Stacks, and Root Error Handling

Production React applications need different mechanisms for different failure classes. A global `window.onerror` handler is not a complete error architecture.

## Start by classifying the failure

<DecisionTree
  question="What kind of failure is this?"
  items={[
    { label: 'Descendant render/lifecycle failure', value: 'Error Boundary for UI containment' },
    { label: 'Caught/uncaught/recoverable root error', value: 'createRoot/hydrateRoot error callbacks for reporting' },
    { label: 'Need development ownership context', value: 'captureOwnerStack() when React context is available' },
    { label: 'Event/network/business failure', value: 'Explicit JavaScript/result/error-state handling' },
    { label: 'SSR/process/server failure', value: 'Server/framework/platform observability' },
  ]}
/>

## Error Boundaries contain render failures

```jsx
class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    reportError(error, { componentStack: info.componentStack });
  }

  render() {
    return this.state.error ? this.props.fallback : this.props.children;
  }
}
```

<VisualDiagram title="Boundary lookup follows the rendered tree">
  <DiagramStack>
    <DiagramNode title="Descendant throws during React render work" tone="red">render/lifecycle failure</DiagramNode>
    <DiagramArrow label="walk to nearest boundary" />
    <DiagramNode title="Error Boundary" tone="orange">records failure + renders fallback</DiagramNode>
    <DiagramArrow label="preserves surrounding UI" />
    <DiagramNode title="Healthy ancestor/sibling UI" tone="green">can remain usable</DiagramNode>
  </DiagramStack>
</VisualDiagram>

In React 19.2, the built-in Error Boundary lifecycle API is still class-based; maintained libraries can package the class for function-component applications.

## What Error Boundaries do and do not own

<DiagramGrid columns={2}>
  <DiagramNode title="Good fit" tone="green">descendant rendering · class lifecycle failures · render-path failures surfaced through React</DiagramNode>
  <DiagramNode title="Different mechanism" tone="orange">event handlers · ordinary detached async callbacks · server-render failures · failures outside the React tree</DiagramNode>
</DiagramGrid>

Do not use Error Boundaries as a universal JavaScript exception handler.

## Boundary placement is product architecture

<VisualDiagram title="Contain failures at useful recovery boundaries">
  <DiagramStack>
    <DiagramNode title="App shell" tone="blue">navigation + global frame</DiagramNode>
    <DiagramRow>
      <DiagramNode title="Conversation list boundary" tone="purple">list can fail independently</DiagramNode>
      <DiagramNode title="Message thread boundary" tone="orange">active thread can fail independently</DiagramNode>
      <DiagramNode title="Optional widget boundary" tone="cyan">non-critical integration</DiagramNode>
    </DiagramRow>
  </DiagramStack>
</VisualDiagram>

Boundary granularity should follow what users can recover from independently, not component-file boundaries.

## Fallbacks are product behavior

A useful fallback may provide:

- a scoped explanation;
- retry or safe navigation;
- an error/reference ID;
- preserved user work where possible;
- accessible focus/announcement behavior;
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

## Reset semantics should follow domain identity

```jsx
<ErrorBoundary key={conversationId} fallback={<ConversationCrash />}>
  <Conversation id={conversationId} />
</ErrorBoundary>
```

<VisualDiagram title="A key can intentionally create a fresh failure boundary">
  <DiagramRow>
    <DiagramNode title="Conversation A" tone="red">boundary in failed state</DiagramNode>
    <DiagramArrow direction="right" label="identity changes" />
    <DiagramNode title="Conversation B" tone="green">new boundary + fresh subtree</DiagramNode>
  </DiagramRow>
</VisualDiagram>

Libraries may also provide explicit reset APIs. Choose reset behavior from the product's identity model.

## Suspense and Error Boundaries solve different states

```jsx
<ErrorBoundary fallback={<AlbumsError />}>
  <Suspense fallback={<AlbumsSkeleton />}>
    <Albums />
  </Suspense>
</ErrorBoundary>
```

<VisualDiagram title="Pending and failed async work take different paths">
  <DiagramGrid columns={2}>
    <DiagramNode title="Promise pending" tone="purple">nearest Suspense fallback</DiagramNode>
    <DiagramNode title="Promise rejected as an error" tone="red">nearest Error Boundary fallback</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Do not wrap `use(promise)` in ordinary `try/catch` to replace Suspense/Error Boundary behavior.

## JavaScript stack vs Component Stack vs Owner Stack

<VisualDiagram title="Three stacks answer different debugging questions">
  <DiagramGrid columns={3}>
    <DiagramNode title="JavaScript stack" tone="blue">Where did code throw?</DiagramNode>
    <DiagramNode title="Component Stack" tone="purple">Where is the failing component rendered?</DiagramNode>
    <DiagramNode title="Owner Stack" tone="cyan">Which components created the React nodes leading here?</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

`componentDidCatch` and root error callbacks can provide `errorInfo.componentStack`. Source maps should connect minified production JavaScript stacks to original code.

## `captureOwnerStack()` is a development diagnostic

```jsx
import * as React from 'react';

if (process.env.NODE_ENV !== 'production') {
  const ownerStack = React.captureOwnerStack?.();
  console.log(ownerStack);
}
```

Current React documentation says `captureOwnerStack()` returns `string | null`, is available only in development, and is useful during React-controlled execution such as render, Effects, React event handlers, and root error handlers. It can be unavailable in detached callbacks such as `setTimeout` or custom DOM event listeners.

<VisualDiagram title="Capture ownership context before leaving React-controlled execution">
  <DiagramRow>
    <DiagramNode title="React-controlled callback" tone="green">Owner Stack available when supported</DiagramNode>
    <DiagramArrow direction="right" label="detached async/custom DOM boundary" />
    <DiagramNode title="Later callback" tone="slate">Owner Stack may be null</DiagramNode>
  </DiagramRow>
</VisualDiagram>

Do not make production telemetry depend on Owner Stacks.

## Root-level error callbacks

React client roots expose callbacks for caught, uncaught, and recoverable React-managed errors:

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

<VisualDiagram title="Containment and reporting are separate responsibilities">
  <DiagramRow>
    <DiagramNode title="Error Boundary" tone="orange">user-facing containment/recovery</DiagramNode>
    <DiagramArrow direction="right" label="reported through" />
    <DiagramNode title="Root callbacks" tone="blue">central classification + observability</DiagramNode>
    <DiagramArrow direction="right" label="correlate" />
    <DiagramNode title="Telemetry" tone="green">release · route · component stack · trace ID</DiagramNode>
  </DiagramRow>
</VisualDiagram>

## Error architecture checklist

<LifecycleBar items={[
  { label: 'Classify failure', tone: 'blue' },
  { label: 'Contain at product boundary', tone: 'orange' },
  { label: 'Report centrally', tone: 'purple' },
  { label: 'Preserve stack/context', tone: 'cyan' },
  { label: 'Offer recovery', tone: 'green' },
  { label: 'Correlate with release/trace', tone: 'slate' },
]} />

A strong error system tells users what can recover, tells engineers where the failure happened, and avoids confusing development-only diagnostics with production guarantees.
