---
title: Component and State Architecture
description: Designing React boundaries around ownership, data flow, state categories, async work, and maintainable feature structure.
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

# Component and State Architecture

Good React architecture makes change predictable by aligning **ownership, data flow, async boundaries, failure boundaries, and runtime boundaries**.

## Architecture starts with ownership

<VisualDiagram title="Every state decision starts with ownership">
  <DiagramGrid columns={3}>
    <DiagramNode title="Owner" tone="blue">Who is allowed to define the source of truth?</DiagramNode>
    <DiagramNode title="Readers" tone="cyan">Which parts of the tree need the value?</DiagramNode>
    <DiagramNode title="Writers" tone="purple">Which interactions are allowed to change it?</DiagramNode>
    <DiagramNode title="Lifetime" tone="orange">Render, component, route, session, or persistent?</DiagramNode>
    <DiagramNode title="Navigation" tone="green">Should reload/back/forward preserve it?</DiagramNode>
    <DiagramNode title="Category" tone="slate">Local, URL, server, external, form, or derived?</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Local UI state should usually stay local. Lift it only when coordination genuinely requires a common owner.

<VisualDiagram title="Lift state only to the lowest common owner">
  <DiagramStack>
    <DiagramNode title="Checkout" tone="blue">Owns selected shipping method</DiagramNode>
    <DiagramRow>
      <DiagramNode title="ShippingMethod" tone="cyan">Reads + writes</DiagramNode>
      <DiagramNode title="OrderSummary" tone="green">Reads</DiagramNode>
    </DiagramRow>
  </DiagramStack>
</VisualDiagram>

## State categories are architectural boundaries

<DecisionTree
  question="What kind of state is this?"
  items={[
    { label: 'Computed completely from current props/state', value: 'Derive during render' },
    { label: 'Used by one interaction region', value: 'Local component state' },
    { label: 'Shared by a small subtree', value: 'Lift state or focused Context' },
    { label: 'Shareable/bookmarkable/navigation-relevant', value: 'URL state' },
    { label: 'Remote data with freshness/retry/invalidation', value: 'Server-state or framework data layer' },
    { label: 'Lives outside React and exposes subscriptions', value: 'External store + useSyncExternalStore-compatible contract' },
  ]}
/>

Do not duplicate one fact into several owners merely because different screens need it.

## Feature-oriented structure

Grouping by feature can make ownership visible:

```text
features/
  checkout/
    components/
    hooks/
    data/
    state/
    tests/
  search/
    components/
    hooks/
    data/
```

Literal directory trees are useful here because the structure itself is the subject. The principle matters more than the exact folder names: **related code should evolve behind an explicit feature boundary**.

## Separate domain logic from rendering

```js
export function calculateOrderTotal(lines, discount) {
  return applyDiscount(sumLines(lines), discount);
}
```

Pure domain rules should not require React to test or reuse them.

<VisualDiagram title="Keep domain rules below the UI boundary">
  <DiagramRow>
    <DiagramNode title="React feature" tone="blue">Events · state · loading · rendering</DiagramNode>
    <DiagramArrow direction="right" label="calls" />
    <DiagramNode title="Domain logic" tone="green">Pure rules · validation · calculations</DiagramNode>
  </DiagramRow>
</VisualDiagram>

## Component boundaries should have a reason

Useful responsibilities include:

- reusable semantic primitive;
- local interaction owner;
- feature orchestrator;
- provider boundary;
- third-party adapter;
- async/loading/failure boundary.

<DecisionTree
  question="Should this become a separate component?"
  items={[
    { label: 'It owns a meaningful interaction or lifecycle', value: 'Strong boundary' },
    { label: 'It provides a reusable semantic/API contract', value: 'Strong boundary' },
    { label: 'It isolates a failure, async, or vendor boundary', value: 'Strong boundary' },
    { label: 'It only forwards props with no independent concept', value: 'Probably keep it together' },
  ]}
/>

Avoid both a 2,000-line component and dozens of wrappers with no architectural meaning.

## Custom Hooks package behavior, not shared state

```js
const { draft, updateQuantity, submit } = useCheckoutDraft(orderId);
```

A custom Hook can reuse a stateful/synchronization process. Separate Hook calls still have separate state unless they subscribe to a shared owner.

<VisualDiagram title="Custom Hook reuse does not imply shared ownership">
  <DiagramRow>
    <DiagramNode title="Checkout A" tone="blue">useCheckoutDraft()</DiagramNode>
    <DiagramNode title="Checkout B" tone="purple">useCheckoutDraft()</DiagramNode>
  </DiagramRow>
  <DiagramArrow label="reuse behavior" />
  <DiagramNode title="Shared implementation" tone="green">same Hook code · independent Hook state unless backed by a shared store</DiagramNode>
</VisualDiagram>

## Context distributes dependencies

Context is useful when a dependency belongs to a subtree and explicit prop threading would obscure the API.

<VisualDiagram title="Context distributes access; it does not decide ownership">
  <DiagramStack>
    <DiagramNode title="Actual owner" tone="blue">state · reducer · external store · server/session source</DiagramNode>
    <DiagramArrow label="provides value" />
    <DiagramNode title="Focused Provider" tone="purple">defines subtree scope</DiagramNode>
    <DiagramArrow label="nearest provider lookup" />
    <DiagramGrid columns={3}>
      <DiagramNode title="Reader A" tone="cyan">uses value</DiagramNode>
      <DiagramNode title="Reader B" tone="cyan">uses value</DiagramNode>
      <DiagramNode title="Dispatcher" tone="green">may only need commands</DiagramNode>
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

For reducer architectures, separate state and dispatch Contexts when that clarifies dependencies or update surfaces.

## URL and server state have different contracts

<DiagramGrid columns={2}>
  <DiagramNode title="URL state" tone="green">shareable · bookmarkable · back/forward · reload persistence</DiagramNode>
  <DiagramNode title="Server state" tone="orange">freshness · cache · retries · invalidation · optimistic reconciliation</DiagramNode>
</DiagramGrid>

A search filter that belongs in `/search?q=react&page=3` should not exist only as hidden component state. Remote data should not be copied into ad-hoc global client state unless the client truly becomes its owner.

## Async, failure, and priority boundaries should match UX

<VisualDiagram title="Different React boundaries answer different product questions">
  <DiagramGrid columns={3}>
    <DiagramNode title="Suspense" tone="purple">What reveals together?</DiagramNode>
    <DiagramNode title="Error Boundary" tone="red">What may fail independently?</DiagramNode>
    <DiagramNode title="Transition" tone="cyan">What work may be non-urgent?</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Place these around meaningful user experiences, not arbitrary file boundaries.

## Server/client architecture

<VisualDiagram title="Keep the client boundary as small as interaction requires">
  <DiagramStack>
    <DiagramNode title="Server-friendly work" tone="green">data access · secrets · heavy transformation · non-interactive rendering</DiagramNode>
    <DiagramArrow label="serializable boundary" />
    <DiagramNode title="Client island" tone="blue">state · events · Effects · browser APIs</DiagramNode>
  </DiagramStack>
</VisualDiagram>

A `'use client'` boundary is a module-graph decision, not merely a rendering label. Keep server-only dependencies outside the client graph and pass only serializable data needed by the interactive region.

## Architecture review loop

<LifecycleBar items={[
  { label: 'Identify owner', tone: 'blue' },
  { label: 'Choose state category', tone: 'cyan' },
  { label: 'Place component boundary', tone: 'purple' },
  { label: 'Map async/failure UX', tone: 'orange' },
  { label: 'Verify runtime/trust boundary', tone: 'red' },
  { label: 'Test + observe', tone: 'green' },
]} />

A maintainable architecture makes ownership visible, keeps dependencies directional, and lets each boundary change for a clear reason.
