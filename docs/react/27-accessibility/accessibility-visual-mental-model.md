---
title: Accessibility Visual Mental Model
description: Visualize semantic HTML, accessible names, keyboard behavior, focus, form feedback, and dynamic UI as part of React correctness.
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

# Accessibility visual mental model

Accessibility is not a final polish step. It is part of whether the component **works correctly** for keyboard users, screen-reader users, low-vision users, and people using different input methods.

<VisualDiagram title="JSX → DOM → accessibility tree">
  <DiagramStack align="center">
    <DiagramNode tone="blue" title="JSX chooses elements and relationships" wide>`button`, `label`, `nav`, `main`, `input`, headings, IDs</DiagramNode>
    <DiagramArrow label="React renders DOM" />
    <DiagramNode tone="purple" title="Browser derives semantics" wide>role · name · state · relationships · focusability</DiagramNode>
    <DiagramArrow label="assistive technology consumes semantics" />
    <DiagramNode tone="green" title="User can understand and operate the interface" wide>Screen reader, keyboard, voice control, zoom, and other interaction modes.</DiagramNode>
  </DiagramStack>
</VisualDiagram>

## Native semantics first

<VisualDiagram title="Native HTML already carries behavior">
  <DiagramGrid columns={2}>
    <DiagramNode tone="green" eyebrow="Preferred" title="<button>">Semantics, focusability, keyboard activation, disabled behavior, and established platform support.</DiagramNode>
    <DiagramNode tone="red" eyebrow="Rebuilt manually" title="<div role='button'>">A role changes meaning but does not automatically implement native keyboard and browser behavior.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Every interactive control needs a usable name

<VisualDiagram title="Accessible control contract">
  <DiagramGrid columns={3}>
    <DiagramNode tone="blue" title="Role">What is this control?</DiagramNode>
    <DiagramNode tone="purple" title="Name">What does this specific control do?</DiagramNode>
    <DiagramNode tone="green" title="State">Checked, expanded, invalid, disabled, selected, busy.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Focus is part of interaction state

<LifecycleBar
  items={[
    { label: 'User enters component', tone: 'blue' },
    { label: 'Focus moves predictably', tone: 'purple' },
    { label: 'Keyboard operation works', tone: 'cyan' },
    { label: 'Dynamic change is understandable', tone: 'orange' },
    { label: 'Focus returns or progresses logically', tone: 'green' },
  ]}
/>

## Forms need relationships, not only red text

<VisualDiagram title="Accessible form feedback">
  <DiagramStack align="center">
    <DiagramNode tone="blue" title="Visible label" wide>`<label htmlFor={id}>Email</label>`</DiagramNode>
    <DiagramArrow />
    <DiagramNode tone="purple" title="Input relationship" wide>`id`, `aria-invalid`, and `aria-describedby` when needed.</DiagramNode>
    <DiagramArrow />
    <DiagramNode tone="red" title="Error message" wide>Specific, associated, and announced appropriately.</DiagramNode>
  </DiagramStack>
</VisualDiagram>

## ARIA is a supplement

<DecisionTree
  question="Do you need ARIA?"
  items={[
    { label: 'Native element already expresses meaning and behavior', value: 'Use native HTML' },
    { label: 'Control needs an accessible name not present in visible text', value: 'Use the appropriate naming relationship' },
    { label: 'Dynamic state is not represented by native semantics', value: 'Add the minimal correct ARIA state/property' },
    { label: 'Custom widget recreates a native control', value: 'Reconsider whether a native element would be safer and simpler' },
    { label: 'ARIA is being added only to silence a lint rule', value: 'Fix the semantic design instead' },
  ]}
/>

## Keep this mental model

<VisualDiagram title="Accessible React in one picture" compact>
  <DiagramRow>
    <DiagramNode tone="blue" title="Semantics">Choose elements by meaning.</DiagramNode>
    <DiagramNode tone="purple" title="Names">Make controls distinguishable.</DiagramNode>
    <DiagramNode tone="orange" title="Focus">Design keyboard movement.</DiagramNode>
    <DiagramNode tone="green" title="Feedback">Expose state and errors clearly.</DiagramNode>
  </DiagramRow>
</VisualDiagram>

Continue with **Accessibility Foundations — Semantics, Accessible Names, and useId** for detailed component and keyboard patterns.
