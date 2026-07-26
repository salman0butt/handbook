---
title: TypeScript Visual Mental Model
description: Visualize how TypeScript strengthens React contracts across props, state, events, refs, Context, reducers, and reusable component APIs.
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

# TypeScript visual mental model

TypeScript improves React code by making **contracts explicit before runtime**. React still owns rendering and runtime behavior; TypeScript helps you catch invalid shapes, impossible variants, and incorrect API usage earlier.

<VisualDiagram title="TypeScript's role in React" subtitle="Static contracts guide development; runtime behavior still belongs to React and the browser.">
  <DiagramStack align="center">
    <DiagramNode tone="blue" title="Component contract" wide>props · events · children · refs · generic constraints</DiagramNode>
    <DiagramArrow label="checked before runtime" />
    <DiagramNode tone="purple" title="TypeScript verifies usage" wide>Call sites and implementations must agree on the contract.</DiagramNode>
    <DiagramArrow label="application runs" />
    <DiagramNode tone="green" title="React executes runtime behavior" wide>Rendering, state, Effects, Suspense, DOM behavior, and network results still happen at runtime.</DiagramNode>
  </DiagramStack>
</VisualDiagram>

## Where types add the most value

<VisualDiagram title="React type-safety map">
  <DiagramGrid columns={3}>
    <DiagramNode tone="blue" title="Props">Public component inputs and variant constraints.</DiagramNode>
    <DiagramNode tone="purple" title="State">Valid state shapes and updater contracts.</DiagramNode>
    <DiagramNode tone="cyan" title="Events">Correct DOM event types and handler signatures.</DiagramNode>
    <DiagramNode tone="green" title="Context">Shared value contracts and nullability boundaries.</DiagramNode>
    <DiagramNode tone="orange" title="Reducers">Discriminated actions and exhaustive transitions.</DiagramNode>
    <DiagramNode tone="slate" title="Refs">Element/handle types and ownership of imperative APIs.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Inference first, annotation where it communicates design

<DecisionTree
  question="Should you write an explicit type here?"
  items={[
    { label: 'Local value is obvious from initialization', value: 'Prefer inference' },
    { label: 'Component exposes a public prop API', value: 'Define an explicit contract' },
    { label: 'State has multiple meaningful variants', value: 'Model the variants explicitly' },
    { label: 'Reducer actions represent domain events', value: 'Use a discriminated union' },
    { label: 'Boundary receives unknown external data', value: 'Validate at runtime, then narrow the type' },
  ]}
/>

## Types do not validate runtime input

<VisualDiagram title="Static type vs runtime trust boundary">
  <DiagramRow>
    <DiagramNode tone="blue" eyebrow="Compile time" title="TypeScript">Checks code you control against declared types.</DiagramNode>
    <DiagramNode tone="red" eyebrow="Runtime" title="External input">API payloads, form data, storage, URL params, and user input can still be invalid.</DiagramNode>
  </DiagramRow>
  <DiagramArrow label="crossing a trust boundary" />
  <DiagramNode tone="green" title="Runtime validation + typed domain value" wide>Validate first; then let TypeScript help inside the trusted application boundary.</DiagramNode>
</VisualDiagram>

## Model impossible UI states away

<VisualDiagram title="Prefer one valid state model over many unrelated booleans">
  <DiagramGrid columns={2}>
    <DiagramNode tone="red" eyebrow="Weak model" title="Independent flags">`isLoading`, `hasError`, `hasData` can accidentally describe contradictory states.</DiagramNode>
    <DiagramNode tone="green" eyebrow="Stronger model" title="Discriminated variants">`idle | loading | success | error` makes allowed states explicit.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Reusable component APIs

<LifecycleBar
  items={[
    { label: 'Define domain variants', tone: 'blue' },
    { label: 'Encode prop relationships', tone: 'purple' },
    { label: 'Infer local details', tone: 'cyan' },
    { label: 'Expose narrow public types', tone: 'green' },
    { label: 'Validate runtime boundaries', tone: 'orange' },
  ]}
/>

## Keep this mental model

<VisualDiagram title="TypeScript in React in one picture" compact>
  <DiagramRow>
    <DiagramNode tone="blue" title="Contracts">Describe what callers may provide.</DiagramNode>
    <DiagramNode tone="purple" title="Inference">Reduce annotation noise.</DiagramNode>
    <DiagramNode tone="green" title="Narrowing">Make variants explicit.</DiagramNode>
    <DiagramNode tone="orange" title="Validation">Protect runtime boundaries.</DiagramNode>
  </DiagramRow>
</VisualDiagram>

Continue with **React with TypeScript — Components, Props, Children, and Events** for the detailed APIs and production patterns.
