---
title: Project Ladder and Delivery Standards
description: A progressive React project path from fundamentals to senior production architecture, with explicit quality gates for correctness, accessibility, testing, performance, and observability.
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

# Project ladder and delivery standards

The final stage of learning React is proving that you can combine the handbook's mental models under realistic constraints.

## The project ladder

<VisualDiagram title="Each project adds a new engineering dimension">
  <LifecycleBar items={[
    { label: 'Fundamentals', tone: 'blue' },
    { label: 'Local state + forms', tone: 'cyan' },
    { label: 'Shared state + external systems', tone: 'purple' },
    { label: 'Async + Suspense', tone: 'orange' },
    { label: 'Performance + accessibility', tone: 'green' },
    { label: 'SSR / Server Components', tone: 'slate' },
    { label: 'Observability + senior architecture', tone: 'red' },
  ]} />
</VisualDiagram>

A strong project should let you explain ownership, render causes, urgency, async/failure boundaries, validation, accessibility, testing, observability, and deliberate trade-offs.

## Use one engineering loop for every project

<LifecycleBar items={[
  { label: 'Define user problem', tone: 'blue' },
  { label: 'Classify state', tone: 'cyan' },
  { label: 'Sketch boundaries', tone: 'purple' },
  { label: 'Design failure/loading/a11y', tone: 'orange' },
  { label: 'Build smallest correct version', tone: 'green' },
  { label: 'Test + profile', tone: 'slate' },
  { label: 'Document trade-offs', tone: 'red' },
]} />

The goal is not maximum feature count. It is evidence of engineering judgment.

## Project 1 — Interactive product page

Build product media, variant selection, quantity controls, stock state, related products, add-to-cart, validation, and semantic interaction.

<DecisionTree
  question="Which values should be state?"
  items={[
    { label: 'Selected variant / quantity chosen by user', value: 'State: user-controlled memory' },
    { label: 'Total price derived from current variant + quantity', value: 'Derive during render' },
    { label: 'Product identity from server/route', value: 'Keep in its existing owner' },
  ]}
/>

Do not add global state, Context, Effect-derived values, a form library, or memoization without a real requirement.

## Project 2 — Todo and filtering application

Build create/edit/delete, completion, filtering, search, sort, persisted preferences, keyboard-accessible editing, empty state, and validation.

<VisualDiagram title="Keep canonical state separate from derived views">
  <DiagramRow>
    <DiagramNode title="Canonical" tone="blue">todos · selected filter</DiagramNode>
    <DiagramArrow direction="right" label="derive" />
    <DiagramNode title="Computed" tone="green">visible todos · completed count · remaining count</DiagramNode>
  </DiagramRow>
</VisualDiagram>

As a stretch, replace several related setters with `useReducer` and explain whether explicit transitions actually improved reasoning.

## Project 3 — Accessible form workflow

Build multi-step onboarding with validation, server-side validation simulation, pending state, error summary, field errors, keyboard navigation, focus recovery, and success confirmation.

```ts
type SubmissionState =
  | { status: 'idle' }
  | { status: 'error'; fieldErrors: Record<string, string> }
  | { status: 'success'; userId: string };
```

<VisualDiagram title="Form correctness crosses both UX and trust boundaries">
  <DiagramStack>
    <DiagramNode title="User input" tone="blue">labeled fields + keyboard flow</DiagramNode>
    <DiagramArrow label="submit" />
    <DiagramNode title="Runtime validation" tone="orange">FormData is not validated by TypeScript</DiagramNode>
    <DiagramArrow label="result" />
    <DiagramNode title="Accessible recovery" tone="green">field errors · summary · focus · success</DiagramNode>
  </DiagramStack>
</VisualDiagram>

## Project 4 — External-system integration

Build a widget that synchronizes with two or more external systems such as WebSocket/EventSource, online status, storage, geolocation, visibility, or media-query subscriptions.

<DecisionTree
  question="Why does this Effect exist?"
  items={[
    { label: 'Synchronizes a committed component with an external system', value: 'Valid Effect responsibility' },
    { label: 'Only derives React state from React state', value: 'Reconsider the Effect' },
  ]}
/>

Test cleanup, reconnection, stale callbacks, Strict Mode setup/cleanup, unmount, network failure, and out-of-order completion.

## Project 5 — Shared dashboard state

Classify every value before implementation.

| State | Likely owner | Lifetime/source |
| --- | --- | --- |
| selected item | dashboard feature | route/session client state |
| search/filter | URL | navigation |
| records | server/data layer | cache/request |
| theme | app shell | session/persisted |
| socket status | external store | connection lifetime |

<VisualDiagram title="Shared UI does not mean one shared store">
  <DiagramGrid columns={3}>
    <DiagramNode title="URL" tone="green">filters + navigation</DiagramNode>
    <DiagramNode title="Server cache" tone="orange">records + remote truth</DiagramNode>
    <DiagramNode title="Feature state" tone="blue">selection + workflow</DiagramNode>
    <DiagramNode title="Context" tone="purple">narrow low-frequency app dependencies</DiagramNode>
    <DiagramNode title="External store" tone="cyan">live high-frequency subscriptions</DiagramNode>
    <DiagramNode title="Local" tone="slate">ephemeral UI state</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Project 6 — Suspense and responsive search

Build urgent input, deferred/Transition result rendering, Suspense fallback, stale-result UI, lazy detail panel, Error Boundary, request cancellation/stale protection, and navigation that preserves useful visible content.

<VisualDiagram title="Four different concerns in responsive search">
  <DiagramGrid columns={2}>
    <DiagramNode title="Typing" tone="blue">urgent update</DiagramNode>
    <DiagramNode title="Expensive results" tone="purple">deferrable / Transition work</DiagramNode>
    <DiagramNode title="Readiness" tone="orange">Suspense reveal boundary</DiagramNode>
    <DiagramNode title="Request ordering" tone="red">data-layer cancellation/stale-response concern</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Do not use Transition scheduling as a substitute for network cancellation.

## Project 7 — Design system package

Build Button, TextField/FormField, Dialog, Tabs, Select/Combobox, Card, and Toast primitives.

Each primitive should document semantics, accessibility, controlled/uncontrolled ownership, ref behavior, TypeScript contracts, variants, composition, tests, escape hatches, and unsupported combinations.

<VisualDiagram title="A design-system primitive owns a reusable behavioral contract">
  <DiagramGrid columns={3}>
    <DiagramNode title="Semantics" tone="blue">native/ARIA meaning</DiagramNode>
    <DiagramNode title="Interaction" tone="purple">keyboard + focus</DiagramNode>
    <DiagramNode title="API" tone="green">props + refs + composition</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Project 8 — Server-rendered product application

Build a server-rendered shell, Server Components for server-owned reads, narrow Client Components for interaction, streaming Suspense, server mutation, optimistic UI, hydration-safe output, Error Boundaries, metadata/resource loading, and server authorization.

<VisualDiagram title="Explain the complete server-to-client path">
  <LifecycleBar items={[
    { label: 'Request', tone: 'blue' },
    { label: 'Server data', tone: 'cyan' },
    { label: 'Server Component tree', tone: 'green' },
    { label: 'RSC / HTML output', tone: 'purple' },
    { label: 'Streaming response', tone: 'orange' },
    { label: 'Client hydration', tone: 'slate' },
    { label: 'Interactive updates', tone: 'red' },
  ]} />
</VisualDiagram>

Annotate execution location, trust boundaries, serialization, errors, and caches.

## Project 9 — Performance remediation

Start with an intentionally slow app containing broad Context updates, expensive lists, unstable props, repeated derived work, unnecessary Effects, a large route bundle, waterfalls, and synchronous expensive interaction work.

<LifecycleBar items={[
  { label: 'Reproduce', tone: 'red' },
  { label: 'Baseline', tone: 'blue' },
  { label: 'Profile', tone: 'purple' },
  { label: 'Find dominant cost', tone: 'orange' },
  { label: 'Change one cause', tone: 'cyan' },
  { label: 'Measure again', tone: 'green' },
]} />

A strong result may conclude that moving state reduced update scope and memoization was unnecessary.

## Project 10 — Production readiness simulation

Add Error Boundaries, root error reporting, source-map-aware telemetry, release IDs, feature flags, rollback, performance budgets, accessibility checks, integration/E2E tests, dependency audit, and a threat model. Then simulate an incident and write a short postmortem.

## Advanced-project evidence

A senior-quality repository should provide visible evidence such as:

```text
README.md
architecture.md
decisions/
  001-state-ownership.md
  002-data-boundaries.md
  003-error-strategy.md
src/
tests/
```

Keep literal repository/document structures textual: they are artifacts, not abstract mental models.

## Delivery quality gate

<VisualDiagram title="A capstone is done only when the engineering system is done">
  <DiagramGrid columns={3}>
    <DiagramNode title="Correctness" tone="blue">ownership · identity · races · validation</DiagramNode>
    <DiagramNode title="Accessibility" tone="cyan">semantics · keyboard · focus · announcements</DiagramNode>
    <DiagramNode title="Testing" tone="purple">integration · async · rollback · permissions · E2E</DiagramNode>
    <DiagramNode title="Performance" tone="orange">measurement · scaling · bundles · boundaries</DiagramNode>
    <DiagramNode title="Security" tone="red">trust map · authorization · safe telemetry</DiagramNode>
    <DiagramNode title="Operations" tone="green">observability · release ID · rollback · ownership · ADRs</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Portfolio presentation

Do not stop at “Built with React, TypeScript, and Tailwind.” Explain the hardest boundary, why state lives where it does, how failures recover, what you measured, what you deliberately did not abstract, and which decision you would revisit with more product data.
