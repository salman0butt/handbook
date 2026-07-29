---
title: Production React Testing Strategy
description: Design a maintainable testing portfolio across pure logic, components, integration, accessibility, end-to-end flows, SSR, and production regressions.
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

# Production React Testing Strategy

A healthy React test suite is a **portfolio**. Different layers protect different failure modes; no one layer should carry all confidence.

<VisualDiagram title="Risk determines the testing mix">
  <DiagramStack>
    <DiagramNode title="Pure domain logic" tone="blue">Reducers · parsers · validators · selectors</DiagramNode>
    <DiagramArrow label="compose into" />
    <DiagramNode title="Component behavior" tone="purple">Rendered UI · forms · focus · optimistic states</DiagramNode>
    <DiagramArrow label="cross boundaries" />
    <DiagramNode title="Integration" tone="teal">Route · providers · data client · real component tree</DiagramNode>
    <DiagramArrow label="prove critical journey" />
    <DiagramNode title="End to end" tone="green">Real browser + important product flows</DiagramNode>
  </DiagramStack>
</VisualDiagram>

The goal is not a fixed pyramid ratio. The goal is the cheapest test that can reliably catch the failure you care about.

## Start from risk, not coverage quotas

Ask:

- What failures would hurt users most?
- Which domain transitions are subtle?
- Which integrations have failed before?
- Which journeys affect money, security, or irreversible actions?
- Which accessibility behaviors are easy to regress?
- Which server/client boundaries need real platform confidence?

## Pure logic tests

Good targets include reducers, validators, parsers, selectors, permission rules, state-machine transitions, formatters, and cache-key construction.

```tsx
expect(cartReducer(state, { type: 'itemRemoved', id: '42' })).toEqual(expected);
```

These tests are cheap because React and the DOM are not required.

## Component behavior tests

Use a DOM environment for:

- meaningful rendering;
- user interactions;
- controlled inputs;
- loading/error states;
- focus changes;
- accessible names/roles;
- provider integration;
- optimistic UI.

## Integration tests

<VisualDiagram title="Integration test = several real application pieces">
  <DiagramGrid columns={3}>
    <DiagramNode title="Route + providers" tone="blue">Real ownership and context</DiagramNode>
    <DiagramNode title="Feature component tree" tone="purple">Forms · state · effects · Suspense</DiagramNode>
    <DiagramNode title="Controlled external boundary" tone="teal">Network/provider mocked realistically</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

This catches context wiring, route state, serialization assumptions, cache interactions, mutation/revalidation bugs, and focus regressions. Do not mock every layer inside an integration test.

## End-to-end tests

Use a real browser for high-risk workflows such as sign-in, checkout, account creation, destructive confirmation, file upload, payments, role changes, complex keyboard interactions, and hydration regressions that depend on browser behavior.

<DecisionTree
  question="Which layer should own this test?"
  items={[
    { label: 'Pure deterministic business rule', value: 'Unit test' },
    { label: 'Rendered interaction/focus/state contract', value: 'Component test' },
    { label: 'Several real app layers must cooperate', value: 'Integration test' },
    { label: 'Browser/network/navigation/platform behavior is essential', value: 'End-to-end test' },
  ]}
/>

## Test network states, not only 200 success

A useful integration suite can model:

<DiagramGrid columns={3}>
  <DiagramNode title="Expected client failures" tone="orange">400 · 401 · 403 · 404 · 409</DiagramNode>
  <DiagramNode title="Infrastructure failures" tone="red">500 · network error · aborted request</DiagramNode>
  <DiagramNode title="Timing" tone="teal">slow response · retry · cancellation</DiagramNode>
</DiagramGrid>

React UI often breaks during transitions between states rather than on the happy path itself.

## Test recovery, not only failure

If the product supports retry, protect the complete state machine:

<LifecycleBar items={[
  { label: 'Request fails', tone: 'red' },
  { label: 'Useful error UI', tone: 'orange' },
  { label: 'User chooses Retry', tone: 'blue' },
  { label: 'Next request succeeds', tone: 'purple' },
  { label: 'UI recovers', tone: 'green' },
]} />

## Cancellation tests should protect user-visible invariants

For search/navigation/streaming/subscriptions, assert that stale results cannot overwrite newer state, aborted work does not become a false error, and leaving a screen cleans up ongoing work.

Avoid testing private `AbortController` details unless cancellation is itself part of a public library API.

## SSR and hydration tests

Hydration bugs are consistency bugs.

<VisualDiagram title="Hydration confidence spans layers">
  <DiagramRow>
    <DiagramNode title="Server render" tone="blue">Deterministic HTML/data snapshot</DiagramNode>
    <DiagramArrow direction="right" label="same initial inputs" />
    <DiagramNode title="Client hydration" tone="purple">IDs · locale · data agree</DiagramNode>
    <DiagramArrow direction="right" label="real browser" />
    <DiagramNode title="Interactive UI" tone="green">No mismatch/regression</DiagramNode>
  </DiagramRow>
</VisualDiagram>

Important scenarios include consistent `useId`, no browser-only reads during server render, deliberate time/locale serialization, and no blind `suppressHydrationWarning` use.

## Server Components and Server Functions

RSC applications should test:

- server data/domain services;
- route rendering through framework integration;
- serialization-safe client-boundary props;
- Server Function authentication, authorization, runtime validation, idempotency, transactions, and error mapping;
- client behavior after the server/client boundary.

A button-click test alone does not secure a server mutation boundary.

## Accessibility is a testing layer, not a single tool

<VisualDiagram title="Accessibility confidence is layered">
  <DiagramGrid columns={3}>
    <DiagramNode title="Semantic tests" tone="blue">roles · names · labels · focus</DiagramNode>
    <DiagramNode title="Automated checks" tone="teal">structural violations</DiagramNode>
    <DiagramNode title="Human/platform review" tone="green">keyboard · screen reader · contrast · real browser</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Automated tools cannot judge the entire interaction experience.

## Visual regression testing

Useful for design-system primitives, layout-heavy pages, themes, responsive breakpoints, charts, and high-risk CSS refactors.

Visual tests answer “did appearance change?” They do not replace behavior or accessibility assertions.

## Type tests and runtime tests are complementary

A compile-time test can prove:

```tsx
<Button tone="primary" />; // valid
// @ts-expect-error
<Button tone="not-real" />;
```

It cannot prove that the button renders, responds to clicks, exposes the right role/name, manages focus, or has correct CSS.

## Coverage is a signal, not confidence itself

```tsx
render(<Widget />);
```

may execute many lines while asserting almost nothing.

Use coverage to find untested areas; use risk and contracts to decide what deserves tests.

## Flaky tests are defects

Common causes include arbitrary sleeps, real time when deterministic control is possible, leaked global state, shared mutable fixtures, unawaited interactions, order-dependent mocks, unstable selectors, scheduler-count assertions, timezone dependence, and missing cleanup.

Fix the race instead of adding blind retries.

## Deterministic test data

```tsx
function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-1',
    name: 'Aisha',
    email: 'aisha@example.com',
    ...overrides,
  };
}
```

Factories are usually easier to isolate than one giant shared fixture object.

## Match the test layer to state ownership

<DiagramGrid columns={3}>
  <DiagramNode title="URL owns state" tone="blue">Test navigation/location semantics</DiagramNode>
  <DiagramNode title="Server owns data" tone="teal">Test request/cache/revalidation behavior</DiagramNode>
  <DiagramNode title="Local UI owns state" tone="purple">Test the component interaction directly</DiagramNode>
</DiagramGrid>

The test architecture should reflect the application architecture.

## Do not duplicate every assertion at every layer

A reducer unit test can prove a formula. A browser checkout test proves the journey. Neither needs to re-prove the other's entire responsibility.

## Production incidents should create regression contracts

<LifecycleBar items={[
  { label: 'Production failure', tone: 'red' },
  { label: 'Smallest meaningful failing test', tone: 'orange' },
  { label: 'Fix implementation', tone: 'blue' },
  { label: 'Keep regression test', tone: 'green' },
  { label: 'Review wider missing test class', tone: 'teal' },
]} />

This steadily aligns the suite with real-world risk.

## CI strategy

<VisualDiagram title="Run high-signal cheap checks early">
  <DiagramStack>
    <DiagramNode title="Fast feedback" tone="green">typecheck · lint · pure unit tests · component tests</DiagramNode>
    <DiagramArrow label="if green" />
    <DiagramNode title="Broader confidence" tone="teal">integration · visual · end-to-end · cross-browser</DiagramNode>
    <DiagramArrow label="release gate" />
    <DiagramNode title="Production confidence" tone="purple">critical journeys + deployment-specific checks</DiagramNode>
  </DiagramStack>
</VisualDiagram>

Exact stages depend on repository size and deployment risk.

## What usually does not need testing

Usually do not test React itself, TypeScript itself, that `useState` can update state, trivial getters/setters, or third-party internals unless your own integration contract depends on them.

Spend test budget where **your code and architecture can be wrong**.

## Feature review checklist

1. Are important domain transitions covered?
2. Are meaningful user behaviors covered?
3. Are failure, retry, and cancellation paths represented?
4. Are async boundaries deterministic?
5. Are permissions verified server-side?
6. Is keyboard/focus behavior protected?
7. Are reusable TypeScript contracts tested where useful?
8. Is at least one high-risk journey covered in a real browser when appropriate?
9. Would a regression test catch the failure you fear most?

## Interview questions

1. How do unit, component, integration, and end-to-end React tests differ?
2. What should determine the testing mix?
3. Why do Server Functions need backend tests?
4. Which hydration problems need browser-level confidence?
5. Why are type tests and runtime tests complementary?
6. Why is coverage a signal rather than a quality target?
7. How should production incidents influence the suite?

## References

- https://react.dev/reference/react/act
- https://testing-library.com/docs/react-testing-library/intro/
- https://testing-library.com/docs/queries/about/
- https://www.w3.org/WAI/ARIA/apg/
