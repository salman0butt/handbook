---
title: Debugging, Performance, and Security Scenarios
description: Senior React scenario drills that test diagnosis, evidence gathering, trade-offs, production response, performance reasoning, and trust-boundary thinking.
sidebar_position: 2
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

# Debugging, performance, and security scenarios

Senior interviews increasingly ask **what do you do next?** rather than asking for API definitions.

## Scenario-answer method

<LifecycleBar items={[
  { label: 'Clarify symptom', tone: 'blue' },
  { label: 'Assess impact', tone: 'red' },
  { label: 'Reproduce', tone: 'cyan' },
  { label: 'Gather evidence', tone: 'purple' },
  { label: 'Form hypotheses', tone: 'orange' },
  { label: 'Change one variable', tone: 'slate' },
  { label: 'Verify + prevent', tone: 'green' },
]} />

For an active incident, mitigation or rollback may come before complete diagnosis.

## Slow input with thousands of results

Do not begin with “add `useMemo` and `useCallback`.”

<DecisionTree
  question="Why is typing slow?"
  items={[
    { label: 'Every keypress renders thousands of rows', value: 'Virtualization / narrower update scope' },
    { label: 'Filtering calculation dominates', value: 'Algorithm/server filtering/targeted memoization after measurement' },
    { label: 'Results are expensive but non-urgent', value: 'Deferred value / Transition scheduling' },
    { label: 'Browser layout/paint dominates', value: 'Fix DOM/CSS/layout cost, not React memoization' },
  ]}
/>

Scheduling can improve responsiveness without reducing the total CPU cost.

## Broad Context rerenders

A provider mixing user, theme, notifications, live prices, permissions, and commands may create broad coupling.

<VisualDiagram title="Fix ownership/subscription scope before memoizing symptoms">
  <DiagramRow>
    <DiagramNode title="High-frequency live value" tone="red">updates multiple times/sec</DiagramNode>
    <DiagramArrow direction="right" label="broadcast through mega Context" />
    <DiagramNode title="Many consumers reconsider" tone="orange">broad update surface</DiagramNode>
    <DiagramArrow direction="right" label="redesign" />
    <DiagramNode title="Focused contexts / external selectors" tone="green">narrow subscriptions</DiagramNode>
  </DiagramRow>
</VisualDiagram>

## Effect repeatedly reconnects

```tsx
useEffect(() => {
  const socket = connect({ roomId, options });
  return () => socket.close();
}, [roomId, options]);
```

If `options` is recreated every render, the dependency changes by identity. Prefer deriving stable primitive dependencies or creating the object inside the Effect when that matches semantics. Do not delete dependencies to silence the linter.

## Fetch race

<VisualDiagram title="Request ordering is a data-layer concern">
  <DiagramRow>
    <DiagramNode title="Request A" tone="orange">started first · finishes late</DiagramNode>
    <DiagramNode title="Request B" tone="blue">started later · should own current screen</DiagramNode>
    <DiagramArrow direction="right" label="stale A must not overwrite B" />
    <DiagramNode title="Cancellation/version check" tone="green">AbortController · request ID · data library</DiagramNode>
  </DiagramRow>
</VisualDiagram>

A Transition does not solve stale network responses.

## State appears on the wrong row

If editable rows use `key={index}`, sorting can move component state to a different logical record. Use stable domain identity such as `key={record.id}`.

## Form submits twice

<VisualDiagram title="UI duplicate prevention and backend correctness are separate layers">
  <DiagramRow>
    <DiagramNode title="Frontend pending state" tone="blue">reduces repeated user intent</DiagramNode>
    <DiagramArrow direction="right" label="not sufficient" />
    <DiagramNode title="Server idempotency/transaction" tone="red">protects correctness</DiagramNode>
    <DiagramArrow direction="right" label="verify" />
    <DiagramNode title="Repeated-submit tests" tone="green">regression contract</DiagramNode>
  </DiagramRow>
</VisualDiagram>

## Optimistic update conflicts with live server event

<DecisionTree
  question="How do optimistic and live state converge?"
  items={[
    { label: 'Server returns revision/version', value: 'Use version-aware reconciliation' },
    { label: 'Conflict can be automatically rebased', value: 'Define deterministic merge policy' },
    { label: 'Conflict is ambiguous/user-significant', value: 'Surface conflict and restore canonical state' },
    { label: 'No canonical owner is defined', value: 'Fix architecture before UI behavior' },
  ]}
/>

## Hydration mismatch only in production

Investigate time/timezone, randomness, browser-only APIs, locale, server/client feature flags, session snapshots, invalid HTML, and third-party DOM mutation.

<VisualDiagram title="Hydration mismatch means two initial snapshots disagree">
  <DiagramRow>
    <DiagramNode title="Server HTML" tone="blue">snapshot A</DiagramNode>
    <DiagramArrow direction="right" label="hydrate" />
    <DiagramNode title="First client render" tone="purple">snapshot B</DiagramNode>
    <DiagramArrow direction="right" label="difference" />
    <DiagramNode title="Mismatch/recovery" tone="red">find cause before suppressing warning</DiagramNode>
  </DiagramRow>
</VisualDiagram>

## Suspense fallback replaces whole page

Boundary placement may be too high, navigation may not use Transition semantics, nested reveal structure may be missing, or identity may intentionally reset. Design reveal groups from UX.

## Lazy chunk fails after deployment

<VisualDiagram title="Chunk failure can be a deployment version-skew problem">
  <DiagramRow>
    <DiagramNode title="Old client runtime" tone="orange">references old hashed chunk</DiagramNode>
    <DiagramArrow direction="right" label="new deploy removed asset" />
    <DiagramNode title="Chunk load failure" tone="red">route cannot load</DiagramNode>
    <DiagramArrow direction="right" label="operational fix" />
    <DiagramNode title="Asset retention + recovery" tone="green">immutable assets · reload UX · deployment strategy</DiagramNode>
  </DiagramRow>
</VisualDiagram>

## Memory grows over time

Check missing subscription/timer/listener cleanup, third-party teardown, unbounded caches, retained closures, and detached DOM. Reproduce repeated mount/unmount, inspect heap retention after GC, and verify cleanup invariants.

## Infinite Effect loop

```tsx
useEffect(() => {
  setItems(transform(items));
}, [items]);
```

Ask first whether the value should be derived during render. Do not “fix” the loop by hiding a real dependency.

## `memo` did not help

<DecisionTree
  question="Why did memoization fail to improve UX?"
  items={[
    { label: 'Props/Context still change', value: 'Skip cannot occur; inspect identity/update source' },
    { label: 'Render was cheap', value: 'Optimization target was irrelevant' },
    { label: 'Comparison cost offsets render savings', value: 'Remove/customize only with evidence' },
    { label: 'Bottleneck is network/browser/Effect/server', value: 'Fix the dominant layer' },
    { label: 'Compiler already handles equivalent ordinary work', value: 'Avoid duplicate complexity' },
  ]}
/>

## Fast locally, slow in production

Compare realistic data, network, device CPU, production build, third-party scripts, hydration/server latency, cache state, feature flags, and observability instrumentation.

## Security scenario method

<VisualDiagram title="Client behavior never replaces server trust checks">
  <LifecycleBar items={[
    { label: 'Identify caller-controlled input', tone: 'red' },
    { label: 'Validate runtime shape', tone: 'orange' },
    { label: 'Authenticate identity', tone: 'blue' },
    { label: 'Authorize resource/action', tone: 'purple' },
    { label: 'Perform mutation safely', tone: 'green' },
    { label: 'Log only safe context', tone: 'slate' },
  ]} />
</VisualDiagram>

## What a strong scenario answer sounds like

<DiagramGrid columns={3}>
  <DiagramNode title="Evidence" tone="blue">measure/reproduce before prescribing</DiagramNode>
  <DiagramNode title="Classification" tone="purple">React vs browser vs network vs backend vs deployment</DiagramNode>
  <DiagramNode title="Prevention" tone="green">tests · telemetry · architecture · rollout changes</DiagramNode>
</DiagramGrid>

The goal is not to name the most React APIs. It is to isolate the actual failure and choose the smallest change that addresses its real cause.
