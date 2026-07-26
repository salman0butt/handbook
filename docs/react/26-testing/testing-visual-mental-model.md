---
title: Testing Visual Mental Model
description: Visualize behavior-focused React testing across render, interaction, assertions, async work, boundaries, and production confidence.
sidebar_position: 0
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

# Testing visual mental model

The strongest React tests exercise the interface through the same **observable behavior** users and assistive technologies experience.

<VisualDiagram title="Behavior-focused React test loop">
  <LifecycleBar
    items={[
      { label: 'Render UI', tone: 'blue' },
      { label: 'Find semantic elements', tone: 'cyan' },
      { label: 'Interact like a user', tone: 'purple' },
      { label: 'Wait for async outcomes', tone: 'orange' },
      { label: 'Assert visible behavior', tone: 'green' },
    ]}
  />
</VisualDiagram>

## Test the public surface

<VisualDiagram title="What should a component test observe?">
  <DiagramGrid columns={3}>
    <DiagramNode tone="blue" title="Semantics">roles · labels · accessible names</DiagramNode>
    <DiagramNode tone="purple" title="Interaction">click · type · focus · submit · keyboard</DiagramNode>
    <DiagramNode tone="green" title="Visible result">content · state · errors · navigation feedback</DiagramNode>
    <DiagramNode tone="cyan" title="Async behavior">pending · resolved · rejected · retries</DiagramNode>
    <DiagramNode tone="orange" title="Accessibility behavior">focus movement · dialog relationships · form feedback</DiagramNode>
    <DiagramNode tone="slate" title="Integration contract">providers · router · server/cache boundaries when genuinely relevant</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Avoid implementation-detail coupling

<VisualDiagram title="Weak assertion vs resilient assertion">
  <DiagramGrid columns={2}>
    <DiagramNode tone="red" eyebrow="Fragile" title="Inspect internals">Private state values, Hook call counts, component internals, or DOM structure that users do not care about.</DiagramNode>
    <DiagramNode tone="green" eyebrow="Resilient" title="Observe behavior">A button is disabled, a dialog appears, an error is announced, or saved data becomes visible.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Query by meaning

<LifecycleBar
  items={[
    { label: 'Role + accessible name', tone: 'green' },
    { label: 'Label text', tone: 'blue' },
    { label: 'Visible text/value/alt text when appropriate', tone: 'purple' },
    { label: 'Test ID only when no semantic query fits', tone: 'slate' },
  ]}
/>

## Choose the test boundary deliberately

<DecisionTree
  question="What kind of confidence do you need?"
  items={[
    { label: 'Pure domain calculation', value: 'Unit test the function' },
    { label: 'One component interaction', value: 'Behavior-focused component test' },
    { label: 'Provider/router/cache coordination', value: 'Integration test the boundary' },
    { label: 'Critical browser workflow', value: 'End-to-end test in a real browser' },
    { label: 'Visual styling regression', value: 'Use visual regression tooling where justified' },
  ]}
/>

## Async React testing

<VisualDiagram title="Async UI should be asserted as a user-visible lifecycle">
  <DiagramStack align="center">
    <DiagramNode tone="blue" title="User starts work" wide>Submit, navigation, lazy load, Action, or mutation.</DiagramNode>
    <DiagramArrow />
    <DiagramNode tone="orange" title="Pending UI" wide>Spinner, disabled control, fallback, optimistic projection, or status message.</DiagramNode>
    <DiagramArrow />
    <DiagramGrid columns={2}>
      <DiagramNode tone="green" title="Success">Expected result becomes observable.</DiagramNode>
      <DiagramNode tone="red" title="Failure">Recoverable error UI becomes observable.</DiagramNode>
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

## Keep this mental model

<VisualDiagram title="Testing in one picture" compact>
  <DiagramRow>
    <DiagramNode tone="blue" title="Render">Create the UI state.</DiagramNode>
    <DiagramNode tone="purple" title="Interact">Use the public interface.</DiagramNode>
    <DiagramNode tone="orange" title="Wait">Respect async transitions.</DiagramNode>
    <DiagramNode tone="green" title="Assert">Check observable outcomes.</DiagramNode>
  </DiagramRow>
</VisualDiagram>

Continue with **Testing React Through User Behavior** for detailed Testing Library patterns, async APIs, and production testing strategy.
