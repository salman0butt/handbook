---
title: Architecture and Patterns Visual Mental Model
description: Visualize React architecture through ownership, dependency direction, state scope, async boundaries, composition, and change-friendly feature structure.
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

# Architecture and patterns visual mental model

Good React architecture makes **ownership obvious and change predictable**. It is not the architecture with the most folders, abstractions, or global providers.

<VisualDiagram title="Architecture starts with ownership">
  <DiagramGrid columns={3}>
    <DiagramNode tone="blue" title="Who owns it?">Component · feature · URL · server · external store</DiagramNode>
    <DiagramNode tone="purple" title="Who reads it?">One component · subtree · distant features · non-React code</DiagramNode>
    <DiagramNode tone="green" title="Who writes it?">User intent · server mutation · reducer/action · navigation</DiagramNode>
    <DiagramNode tone="cyan" title="How long does it live?">Render · component · route · feature · app · persisted lifetime</DiagramNode>
    <DiagramNode tone="orange" title="Where can it fail?">Network · validation · render · external system · permission boundary</DiagramNode>
    <DiagramNode tone="slate" title="What should depend on what?">Domain contracts should not be hidden behind accidental UI coupling.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Keep state close to its real owner

<VisualDiagram title="Local first, lift only for coordination">
  <DiagramStack align="center">
    <DiagramNode tone="green" title="One component owns the interaction" wide>Keep state local.</DiagramNode>
    <DiagramArrow label="siblings must agree" />
    <DiagramNode tone="blue" title="Closest shared owner" wide>Lift state only to the boundary that coordinates both consumers.</DiagramNode>
    <DiagramArrow label="broader architectural requirement appears" />
    <DiagramNode tone="purple" title="Choose a wider state mechanism deliberately" wide>Context, external store, URL, or server state based on the actual category.</DiagramNode>
  </DiagramStack>
</VisualDiagram>

## Feature boundaries align concerns

<VisualDiagram title="Healthy feature boundary">
  <DiagramGrid columns={2}>
    <DiagramNode tone="blue" title="Public feature API">Components · hooks · selectors · commands · domain types</DiagramNode>
    <DiagramNode tone="slate" title="Private implementation">Internal state · helpers · adapters · rendering details</DiagramNode>
    <DiagramNode tone="purple" title="External dependencies">Router · server APIs · storage · shared design system</DiagramNode>
    <DiagramNode tone="green" title="Tests">Verify behavior and boundary contracts, not private wiring.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Prefer composition over configuration explosion

<VisualDiagram title="Component API design">
  <DiagramGrid columns={2}>
    <DiagramNode tone="red" eyebrow="Smell" title="Mega component">Dozens of unrelated booleans and props create impossible combinations.</DiagramNode>
    <DiagramNode tone="green" eyebrow="Composable" title="Focused primitives">Small contracts compose into richer behavior while ownership stays clear.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Architecture minimizes synchronization edges

<VisualDiagram title="One source of truth reduces coupling">
  <DiagramStack align="center">
    <DiagramNode tone="blue" title="One authoritative owner" wide />
    <DiagramArrow />
    <DiagramNode tone="purple" title="Consumers derive or subscribe" wide />
    <DiagramArrow />
    <DiagramNode tone="green" title="Fewer synchronization bridges" wide />
    <DiagramArrow />
    <DiagramNode tone="cyan" title="Fewer race conditions and easier debugging" wide />
  </DiagramStack>
</VisualDiagram>

<DecisionTree
  question="Where should this concern live?"
  items={[
    { label: 'Only one visual region needs it', value: 'Keep it local' },
    { label: 'Sibling regions must coordinate', value: 'Lift to their closest shared owner' },
    { label: 'Navigation/bookmarking defines it', value: 'URL/router state' },
    { label: 'Server owns the authoritative data', value: 'Server data/cache layer' },
    { label: 'Many client features need structured shared ownership', value: 'Evaluate Context or an external store' },
  ]}
/>

## Keep this mental model

<VisualDiagram title="React architecture in one picture" compact>
  <DiagramRow>
    <DiagramNode tone="blue" title="Ownership">One clear source.</DiagramNode>
    <DiagramNode tone="purple" title="Boundaries">Feature contracts.</DiagramNode>
    <DiagramNode tone="orange" title="Dependencies">Intentional direction.</DiagramNode>
    <DiagramNode tone="green" title="Change">Predictable impact.</DiagramNode>
  </DiagramRow>
</VisualDiagram>

Continue with **Component and State Architecture** for detailed feature structure, composition patterns, design systems, and senior trade-offs.
