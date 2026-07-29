---
title: Large-Team React Engineering
sidebar_position: 3
description: Ownership, boundaries, standards, design systems, dependency governance, review practices, and change management for large React teams.
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

# Large-Team React Engineering

At scale, React problems become organizational as much as technical: ownership, stable contracts, dependency direction, migration policy, review quality, and change coordination all shape the architecture.

## Architecture should mirror ownership

A feature boundary can look like:

```text
features/
  billing/
    components/
    hooks/
    data/
    tests/
    types/
    index.ts
```

The exact folder names are not the point. The point is that one domain can evolve behind a deliberate public surface.

<VisualDiagram title="Feature internals stay private behind an owned contract">
  <DiagramRow>
    <DiagramNode title="Other teams" tone="blue">consume supported feature API</DiagramNode>
    <DiagramArrow direction="right" label="import" />
    <DiagramNode title="Feature entry point" tone="green">documented exports</DiagramNode>
    <DiagramArrow direction="right" label="encapsulates" />
    <DiagramNode title="Feature internals" tone="slate">components · hooks · data · implementation</DiagramNode>
  </DiagramRow>
</VisualDiagram>

Deep imports turn implementation layout into an accidental organization-wide contract.

## State ownership should follow domain ownership

<DecisionTree
  question="Who should own this state?"
  items={[
    { label: 'Tooltip/open state used by one component', value: 'Local component owner' },
    { label: 'Selected billing invoice', value: 'Billing feature owner' },
    { label: 'Search filters users share/bookmark', value: 'URL + search feature' },
    { label: 'Remote customer records', value: 'Server/cache data owner' },
    { label: 'Session/theme platform concern', value: 'Focused application/platform boundary' },
  ]}
/>

A giant global store often becomes organizational coupling disguised as convenience.

## Shared libraries need a higher contract bar

<VisualDiagram title="Reuse multiplies the cost of a bad API">
  <DiagramRow>
    <DiagramNode title="One-off app component" tone="cyan">can be specialized</DiagramNode>
    <DiagramArrow direction="right" label="adoption grows" />
    <DiagramNode title="Shared primitive" tone="purple">needs stable API + ownership</DiagramNode>
    <DiagramArrow direction="right" label="organization-wide" />
    <DiagramNode title="Infrastructure" tone="orange">versioning · migration · docs · a11y · tests</DiagramNode>
  </DiagramRow>
</VisualDiagram>

Move code into a shared package because it represents a stable shared concept—not merely because two implementations currently look similar.

## The design system is infrastructure

<DiagramGrid columns={2}>
  <DiagramNode title="Design system owns" tone="green">tokens · semantic primitives · focus/keyboard behavior · forms · overlays · API conventions · test helpers</DiagramNode>
  <DiagramNode title="Product feature owns" tone="blue">billing workflow · permissions · checkout policy · domain state</DiagramNode>
</DiagramGrid>

Use generic primitives such as `Dialog`; keep business-specific content and workflows in domain features.

## Avoid a framework inside the framework

<VisualDiagram title="Every custom platform layer creates another language">
  <DiagramStack>
    <DiagramNode title="React + platform" tone="green">known ecosystem contracts</DiagramNode>
    <DiagramArrow label="team adds custom abstractions" />
    <DiagramNode title="Company DSL/runtime/wrapper stack" tone="orange">new APIs · migration burden · ownership cost</DiagramNode>
  </DiagramStack>
</VisualDiagram>

Before creating a custom framework layer, ask what repeated problem it solves, why ordinary React is insufficient, what the escape hatch is, who owns it for years, and how it can be removed.

## ADRs preserve why a decision exists

```text
Title
Status
Context
Decision
Alternatives considered
Consequences
Migration plan
Owner
Date
```

<VisualDiagram title="Architecture decisions should survive chat history">
  <DiagramRow>
    <DiagramNode title="Context + constraints" tone="blue">why change is needed</DiagramNode>
    <DiagramArrow direction="right" label="compare" />
    <DiagramNode title="Options + trade-offs" tone="purple">what was considered</DiagramNode>
    <DiagramArrow direction="right" label="record" />
    <DiagramNode title="Decision + consequences" tone="green">what future teams inherit</DiagramNode>
  </DiagramRow>
</VisualDiagram>

Useful ADR topics include state strategy, URL conventions, RSC/client boundaries, error strategy, design-system ownership, cache/data layer, compiler rollout, and testing policy.

## Let automation handle mechanical review

<DiagramGrid columns={2}>
  <DiagramNode title="Automation" tone="cyan">format · TypeScript · ESLint · Hooks/Compiler rules · tests · CI</DiagramNode>
  <DiagramNode title="Human review" tone="purple">ownership · API misuse risk · a11y · security · failure design · coupling · migration</DiagramNode>
</DiagramGrid>

Human reviewers should spend attention on decisions tools cannot reliably make.

## Make recurring production lessons explicit

```text
React PR checklist
- state owner is clear
- no unnecessary Effect-derived state
- stable domain keys
- semantic HTML/accessibility
- runtime validation at trust boundaries
- tests at the correct layer
- new shared APIs documented
- observability for critical flows
- migration notes for breaking changes
```

Checklists should encode repeated failure patterns, not personal style preferences.

## Ownership must be discoverable

<VisualDiagram title="A critical boundary needs an obvious responsible team">
  <DiagramGrid columns={3}>
    <DiagramNode title="CODEOWNERS" tone="blue">review routing</DiagramNode>
    <DiagramNode title="Package/service metadata" tone="cyan">technical ownership</DiagramNode>
    <DiagramNode title="Docs/catalog" tone="purple">contract + runbook</DiagramNode>
    <DiagramNode title="On-call" tone="red">incident ownership</DiagramNode>
    <DiagramNode title="Maintainers" tone="green">safe evolution</DiagramNode>
    <DiagramNode title="Migration policy" tone="orange">breaking-change path</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Dependency direction prevents organizational cycles

<VisualDiagram title="Prefer directional layers over circular team dependencies">
  <DiagramStack>
    <DiagramNode title="Platform / design system" tone="slate">cross-cutting foundations</DiagramNode>
    <DiagramArrow label="supports" />
    <DiagramNode title="Shared domain libraries" tone="blue">stable reusable concepts</DiagramNode>
    <DiagramArrow label="supports" />
    <DiagramNode title="Features" tone="purple">domain ownership</DiagramNode>
    <DiagramArrow label="composed by" />
    <DiagramNode title="Routes / application shell" tone="green">product composition</DiagramNode>
  </DiagramStack>
</VisualDiagram>

Exact layering varies, but cycles such as Team A internals → Team B internals → Team C state → Team A helper should trigger architectural review.

## Global Context can create invisible coupling

<VisualDiagram title="One broad provider becomes an implicit dependency graph">
  <DiagramRow>
    <DiagramNode title="Mega AppContext" tone="red">user · theme · locale · billing · search · experiments · notifications</DiagramNode>
    <DiagramArrow direction="right" label="split by ownership/scope" />
    <DiagramNode title="Focused providers/stores" tone="green">smaller contracts + clearer update surfaces</DiagramNode>
  </DiagramRow>
</VisualDiagram>

Provider scope should be no broader than the dependency requires.

## Stable APIs matter more than stable internals

A feature may move internally from `useReducer` to a state machine or server cache without forcing consumers to change if its public contract remains stable.

<VisualDiagram title="Encapsulation lets implementation evolve">
  <DiagramRow>
    <DiagramNode title="Stable public API" tone="green">consumer contract</DiagramNode>
    <DiagramArrow direction="right" label="hides" />
    <DiagramNode title="Replaceable internals" tone="blue">reducer → state machine → server/cache architecture</DiagramNode>
  </DiagramRow>
</VisualDiagram>

## Large-team change lifecycle

<LifecycleBar items={[
  { label: 'Define owner', tone: 'blue' },
  { label: 'Define contract', tone: 'cyan' },
  { label: 'Automate policy', tone: 'purple' },
  { label: 'Review architecture', tone: 'orange' },
  { label: 'Ship incrementally', tone: 'green' },
  { label: 'Observe + migrate', tone: 'slate' },
]} />

Large-team React architecture succeeds when teams can change their internals independently while shared boundaries remain understandable, testable, observable, and intentionally governed.
