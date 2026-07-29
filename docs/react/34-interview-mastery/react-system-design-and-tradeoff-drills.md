---
title: React System Design and Trade-Off Drills
description: Senior and staff React system-design exercises covering state, data, rendering, server/client boundaries, performance, resilience, security, accessibility, and migration.
sidebar_position: 3
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

# React system design and trade-off drills

System-design interviews test whether you can choose boundaries under constraints and explain the consequences—not whether you can draw the most boxes.

## Reusable design method

<LifecycleBar items={[
  { label: 'Requirements', tone: 'blue' },
  { label: 'Constraints', tone: 'cyan' },
  { label: 'Ownership', tone: 'purple' },
  { label: 'Data flow + rendering', tone: 'green' },
  { label: 'Loading/failure', tone: 'orange' },
  { label: 'Performance/security/a11y', tone: 'red' },
  { label: 'Testing/observability/trade-offs', tone: 'slate' },
]} />

## Search experience

For 100,000 products, clarify server/client search, latency, typo tolerance, URL/shareability, filters/sort, device constraints, and SEO/rendering requirements.

<VisualDiagram title="A scalable search path keeps ownership explicit">
  <DiagramStack>
    <DiagramNode title="URL query/filter state" tone="blue">shareable navigation truth</DiagramNode>
    <DiagramArrow label="request" />
    <DiagramNode title="Search/data layer" tone="purple">debounce/cancel/stale protection</DiagramNode>
    <DiagramArrow label="server search/index + cache" />
    <DiagramNode title="Result boundary" tone="green">Suspense/navigation/rendering</DiagramNode>
  </DiagramStack>
</VisualDiagram>

`useDeferredValue` may improve expensive result rendering; it does not reduce network requests.

## Infinite live activity feed

<DecisionTree
  question="How should live + historical feed data scale?"
  items={[
    { label: 'Historical pages/cursors', value: 'Server-state pagination/cache' },
    { label: 'High-frequency live events', value: 'Normalized external/live store with narrow subscriptions' },
    { label: 'Thousands of rendered items', value: 'Windowing/virtualization' },
    { label: 'Optimistic reactions', value: 'Temporary projection + canonical reconciliation' },
  ]}
/>

Bound in-memory retention and design event ordering/reconnect semantics explicitly.

## Collaborative editor

<VisualDiagram title="React is one layer in collaborative consistency">
  <DiagramGrid columns={3}>
    <DiagramNode title="Document model" tone="green">durable remote truth / CRDT/OT/backend model</DiagramNode>
    <DiagramNode title="Presence" tone="cyan">high-frequency external state</DiagramNode>
    <DiagramNode title="Local interaction" tone="blue">selection · cursor · temporary UI</DiagramNode>
    <DiagramNode title="Optimistic edits" tone="purple">pending projection</DiagramNode>
    <DiagramNode title="Version/conflict" tone="red">reconciliation policy</DiagramNode>
    <DiagramNode title="React UI" tone="orange">selective rendering/subscription</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Do not try to solve distributed consistency with React state alone.

## Large admin table

Use server pagination/filtering for scale, URL state for shareable filters, stable IDs, feature-owned selection, virtualization when measured, optimistic edits with server validation, and accessible table/grid semantics appropriate to the interaction model.

<DecisionTree
  question="What is the table bottleneck?"
  items={[
    { label: 'Data volume/request cost', value: 'Server paging/filtering' },
    { label: 'DOM node volume/scrolling', value: 'Virtualization/windowing' },
    { label: 'One row update rerenders everything', value: 'Narrow ownership/subscriptions/component boundaries' },
    { label: 'Browser layout dominates', value: 'Fix DOM/CSS layout rather than React memoization' },
  ]}
/>

## Multi-step onboarding

<LifecycleBar items={[
  { label: 'Route/step identity', tone: 'blue' },
  { label: 'Form draft', tone: 'cyan' },
  { label: 'Server-persisted progress', tone: 'purple' },
  { label: 'Runtime validation', tone: 'red' },
  { label: 'Accessible navigation/errors', tone: 'orange' },
  { label: 'Resume/idempotent save', tone: 'green' },
]} />

Avoid mounting one giant form forever merely because the workflow is multi-step.

## Notification system

<VisualDiagram title="Durable notifications and transient toast UI are different state categories">
  <DiagramStack>
    <DiagramNode title="Server notifications + live/cross-tab channels" tone="green">durable records/events</DiagramNode>
    <DiagramArrow label="normalize" />
    <DiagramNode title="Data/external store" tone="purple">unread state + records</DiagramNode>
    <DiagramArrow label="project" />
    <DiagramGrid columns={2}>
      <DiagramNode title="Notification center" tone="blue">durable UI view</DiagramNode>
      <DiagramNode title="Toast" tone="orange">temporary feedback</DiagramNode>
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

## Design system for many teams

Discuss semantic/accessibility contracts, primitives vs product components, tokens, refs, controlled/uncontrolled APIs, compound/headless patterns, versioning, contract tests, documentation, migration tooling, and ownership.

<DecisionTree
  question="Should a shared primitive expose maximum polymorphism?"
  items={[
    { label: 'Product genuinely needs multiple semantic hosts', value: 'Maybe, with tested type/a11y constraints' },
    { label: 'Flexibility mainly creates invalid combinations', value: 'Prefer explicit semantic variants' },
    { label: 'Need is product-specific', value: 'Keep it in the feature wrapper' },
  ]}
/>

## Analytics dashboard

<VisualDiagram title="Split server-friendly shell/data from expensive client visualization">
  <DiagramStack>
    <DiagramNode title="Server-rendered shell" tone="green">initial context + read-only summary</DiagramNode>
    <DiagramGrid columns={3}>
      <DiagramNode title="Filters" tone="blue">client interaction</DiagramNode>
      <DiagramNode title="Summary metrics" tone="green">server/streamed</DiagramNode>
      <DiagramNode title="Charts" tone="purple">lazy client islands + accessible data alternative</DiagramNode>
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

Discuss chart bundle cost, Suspense reveal, filter ownership, cache freshness, expensive rendering, and non-visual alternatives for chart information.

## Chat application

Separate durable message history, ephemeral typing/presence, optimistic pending sends, connection state, and pagination history. High-frequency presence should not automatically broadcast through broad Context.

## Feature-flagged migration to RSC

<LifecycleBar items={[
  { label: 'Measure current bottleneck', tone: 'blue' },
  { label: 'Pick low-risk route', tone: 'cyan' },
  { label: 'Establish server infrastructure', tone: 'purple' },
  { label: 'Keep interactive client islands', tone: 'orange' },
  { label: 'Move beneficial server reads', tone: 'green' },
  { label: 'Canary + compare telemetry', tone: 'red' },
  { label: 'Expand only with evidence', tone: 'slate' },
]} />

Do not migrate because a technology is newer.

## Common trade-off drills

<DecisionTree
  question="Context or external store?"
  items={[
    { label: 'Tree-scoped, manageable frequency, broad consumers', value: 'Context may fit' },
    { label: 'Independent/high-frequency state with selective consumers', value: 'External store may fit' },
  ]}
/>

<DecisionTree
  question="Local state or URL?"
  items={[
    { label: 'Temporary UI intent with no navigation semantics', value: 'Local state' },
    { label: 'Shareable/bookmarkable/back-forward state', value: 'URL' },
  ]}
/>

<DecisionTree
  question="Optimistic or confirmed mutation UX?"
  items={[
    { label: 'Low-risk reversible action', value: 'Optimistic may improve UX' },
    { label: 'High-impact/destructive/money/permission action', value: 'Prefer stronger confirmation semantics' },
  ]}
/>

## What the interviewer is evaluating

<DiagramGrid columns={3}>
  <DiagramNode title="Ownership" tone="blue">one source of truth per concern</DiagramNode>
  <DiagramNode title="Boundaries" tone="purple">execution · async · failure · trust</DiagramNode>
  <DiagramNode title="Scale" tone="orange">data · DOM · subscriptions · bundles</DiagramNode>
  <DiagramNode title="Correctness" tone="red">authorization · races · conflicts</DiagramNode>
  <DiagramNode title="Experience" tone="green">loading · accessibility · responsiveness</DiagramNode>
  <DiagramNode title="Operations" tone="slate">tests · telemetry · rollout · reversibility</DiagramNode>
</DiagramGrid>

A strong system-design answer makes alternatives explicit and explains why the chosen boundary is appropriate for the stated constraints.
