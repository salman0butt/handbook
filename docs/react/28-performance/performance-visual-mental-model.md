---
title: Performance Visual Mental Model
description: Visualize React performance as an end-to-end interaction pipeline spanning scheduling, rendering, network, commit, layout, paint, and measurement.
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

# Performance visual mental model

Performance work starts with **evidence about user impact**, not with adding memoization Hooks by habit.

<VisualDiagram title="A user interaction crosses many performance layers" subtitle="A slowdown can live outside React entirely.">
  <LifecycleBar
    items={[
      { label: 'User input', tone: 'blue' },
      { label: 'Event handler', tone: 'purple' },
      { label: 'State update / scheduling', tone: 'cyan' },
      { label: 'React render work', tone: 'orange' },
      { label: 'Commit', tone: 'green' },
      { label: 'Style / layout / paint', tone: 'slate' },
      { label: 'Effects / follow-up work', tone: 'purple' },
    ]}
  />
</VisualDiagram>

## Find the bottleneck before choosing the fix

<VisualDiagram title="Different symptoms need different tools">
  <DiagramGrid columns={3}>
    <DiagramNode tone="blue" title="Rendering cost">Profiler · state placement · component boundaries</DiagramNode>
    <DiagramNode tone="purple" title="Network latency">Waterfalls · caching · preloading · server ownership</DiagramNode>
    <DiagramNode tone="orange" title="Bundle cost">Code splitting · dependency review · lazy loading</DiagramNode>
    <DiagramNode tone="green" title="Browser work">Layout · paint · images · CSS · DOM size</DiagramNode>
    <DiagramNode tone="cyan" title="Scheduling">Transitions · deferred values · urgent vs non-urgent work</DiagramNode>
    <DiagramNode tone="slate" title="Third-party cost">Scripts · analytics · widgets · SDK initialization</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Memoization only addresses a narrow class of problems

<VisualDiagram title="When memoization can help">
  <DiagramStack align="center">
    <DiagramNode tone="blue" title="A render path is measurably expensive" wide />
    <DiagramArrow label="and" />
    <DiagramNode tone="purple" title="Inputs are often unchanged" wide />
    <DiagramArrow label="and" />
    <DiagramNode tone="green" title="Skipping/reusing work costs less than recalculating it" wide />
  </DiagramStack>
</VisualDiagram>

<DecisionTree
  question="What is slow?"
  items={[
    { label: 'One component re-renders expensively', value: 'Profile state placement, props, and memoization opportunities' },
    { label: 'Typing feels blocked while a large result updates', value: 'Inspect scheduling and transition/deferred-value options' },
    { label: 'Page waits on serial requests', value: 'Fix the network/server waterfall' },
    { label: 'Initial load is heavy', value: 'Measure bundle, hydration, images, and third-party code' },
    { label: 'Rendering is fast but the browser janks', value: 'Inspect layout, paint, long tasks, and DOM/CSS cost' },
  ]}
/>

## State placement is a performance tool

<VisualDiagram title="State scope controls render scope">
  <DiagramGrid columns={2}>
    <DiagramNode tone="red" eyebrow="Too broad" title="High state owner">A tiny local change can force a large subtree to participate in rendering.</DiagramNode>
    <DiagramNode tone="green" eyebrow="Focused" title="State near consumers">Only the region that owns or consumes the interaction needs to update.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Production optimization loop

<LifecycleBar
  items={[
    { label: 'Reproduce user symptom', tone: 'blue' },
    { label: 'Measure', tone: 'purple' },
    { label: 'Identify bottleneck', tone: 'orange' },
    { label: 'Apply targeted change', tone: 'cyan' },
    { label: 'Measure again', tone: 'green' },
    { label: 'Keep only proven wins', tone: 'slate' },
  ]}
/>

## Keep this mental model

<VisualDiagram title="Performance in one picture" compact>
  <DiagramRow>
    <DiagramNode tone="blue" title="Measure">Start from evidence.</DiagramNode>
    <DiagramNode tone="orange" title="Locate">Find the real layer.</DiagramNode>
    <DiagramNode tone="purple" title="Target">Choose the narrow fix.</DiagramNode>
    <DiagramNode tone="green" title="Verify">Prove the result improved.</DiagramNode>
  </DiagramRow>
</VisualDiagram>

Continue with **Measure Before Optimizing** for profiling workflows, React DevTools, browser traces, memoization, and production performance strategy.
