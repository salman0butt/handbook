---
title: React Compiler Visual Mental Model
description: Visualise build-time automatic memoization, Rules of React validation, manual memoization escape hatches, and safe compiler adoption.
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
} from '@site/src/components/handbook/VisualDiagram';

# React Compiler visual mental model

React Compiler is a **build-time optimizer**. It analyses components and Hooks and can automatically apply memoization so application code does not need to manually express every optimization.

<VisualDiagram title="Source code → compiler → optimized runtime code">
  <DiagramStack>
    <DiagramNode tone="blue" eyebrow="Source" title="Write idiomatic React">
      Components, Hooks, props, state, and normal render calculations remain your programming model.
    </DiagramNode>
    <DiagramArrow label="build-time analysis" />
    <DiagramNode tone="purple" eyebrow="Compiler" title="Understand data flow and mutability">
      React Compiler analyses which values and component results can be safely reused.
    </DiagramNode>
    <DiagramArrow label="automatic memoization" />
    <DiagramNode tone="green" eyebrow="Runtime" title="Reuse work where safe">
      Generated code can avoid unnecessary calculations and child renders without changing your component API.
    </DiagramNode>
  </DiagramStack>
</VisualDiagram>

## Compiler optimization depends on React rules

<VisualDiagram title="Correctness first, optimization second">
  <DiagramGrid columns={2}>
    <DiagramNode tone="green" title="Idiomatic, pure React">
      Stable render semantics give the compiler safe information for automatic optimization.
    </DiagramNode>
    <DiagramNode tone="red" title="Rule-breaking code">
      Hidden mutations, impure rendering, or invalid Hook usage make reasoning and optimization unsafe and can surface diagnostics.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Manual memoization becomes a targeted control

<VisualDiagram title="Before and after compiler adoption">
  <DiagramRow>
    <DiagramNode tone="slate" eyebrow="Manual-first" title="memo / useMemo / useCallback everywhere">
      Developers try to predict which identities and calculations need caching, often adding complexity before measuring.
    </DiagramNode>
    <DiagramNode tone="purple" eyebrow="Compiler-first" title="Write clear React, then use escape hatches when needed">
      Let the compiler optimize ordinary cases and keep manual memoization for precise behavioural/performance requirements.
    </DiagramNode>
  </DiagramRow>
</VisualDiagram>

## The compiler does not fix architecture

<DiagramGrid columns={3}>
  <DiagramNode tone="red" title="Bad state ownership">
    Automatic memoization does not repair duplicated or globally misplaced state.
  </DiagramNode>
  <DiagramNode tone="orange" title="Expensive algorithms">
    Reusing calculations can help, but the compiler cannot make fundamentally excessive work free.
  </DiagramNode>
  <DiagramNode tone="cyan" title="Network / server design">
    The compiler does not replace caching, data loading, server rendering, or mutation architecture.
  </DiagramNode>
</DiagramGrid>

## Safe adoption is a rollout process

<LifecycleBar
  items={[
    { label: 'Enable on a controlled scope', tone: 'blue' },
    { label: 'Run lint / compiler diagnostics', tone: 'purple' },
    { label: 'Test behaviour and performance', tone: 'orange' },
    { label: 'Expand adoption', tone: 'green' },
  ]}
/>

## Choose manual memoization deliberately

<DecisionTree
  question="Should I add memo, useMemo, or useCallback?"
  items={[
    { label: 'No measured problem and Compiler is enabled', value: 'Prefer clear code and let the Compiler optimize.' },
    { label: 'A stable identity is semantically required by an Effect or external API', value: 'Manual memoization may still provide precise control.' },
    { label: 'Existing production code already relies on manual memoization', value: 'Keep it during adoption; remove only with deliberate testing.' },
    { label: 'A component breaks after compilation', value: 'Debug the underlying Rules-of-React issue; use compiler opt-out only as a temporary escape hatch.' },
    { label: 'The app is slow because state is too high or data work is excessive', value: 'Fix architecture or workload first.' },
  ]}
/>

## Keep this mental model

<VisualDiagram title="React Compiler in one picture">
  <DiagramStack>
    <DiagramNode tone="blue" title="You write declarative React" />
    <DiagramArrow />
    <DiagramNode tone="purple" title="Compiler analyses and memoizes at build time" />
    <DiagramArrow />
    <DiagramNode tone="green" title="Runtime reuses safe work automatically" />
  </DiagramStack>
</VisualDiagram>

The Compiler is a performance tool built on React's semantic rules—not a replacement for clear ownership, profiling, or good architecture.

Continue with **Compiler Mental Model and Setup** for installation, configuration, diagnostics, and rollout details.