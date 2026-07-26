---
title: Concurrency Visual Mental Model
description: Visualise urgent versus transition work, interruption, deferred values, and the difference between concurrent rendering and multithreading.
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

# Concurrency visual mental model

Concurrent React is about **scheduling render work by priority**. It does not mean React turns your components into parallel worker threads.

<VisualDiagram title="Urgent work vs transition work">
  <DiagramGrid columns={2}>
    <DiagramNode tone="red" eyebrow="Urgent" title="Keep interaction responsive">
      Typing, pressing buttons, focusing controls, and direct feedback should feel immediate.
    </DiagramNode>
    <DiagramNode tone="purple" eyebrow="Transition" title="Background render work">
      Expensive UI updates can be marked as non-urgent so React may work on them without blocking urgent interaction.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## A transition changes scheduling, not truth

<VisualDiagram title="Transition lifecycle">
  <DiagramStack>
    <DiagramNode tone="blue" title="User interaction starts an update" />
    <DiagramArrow label="mark expensive update as transition" />
    <DiagramNode tone="purple" title="React prepares the next UI">
      The transition render can be interrupted if more urgent work arrives.
    </DiagramNode>
    <DiagramArrow label="urgent interaction can pre-empt" />
    <DiagramNode tone="orange" title="Current committed UI remains usable">
      React does not have to commit every intermediate render attempt.
    </DiagramNode>
    <DiagramArrow label="transition finishes" />
    <DiagramNode tone="green" title="Commit the completed result" />
  </DiagramStack>
</VisualDiagram>

## Concurrent rendering is interruptible rendering

<LifecycleBar
  items={[
    { label: 'Start render', tone: 'blue' },
    { label: 'Pause / interrupt', tone: 'orange' },
    { label: 'Resume or restart', tone: 'purple' },
    { label: 'Commit completed work', tone: 'green' },
  ]}
/>

<VisualDiagram title="What users see vs what React may calculate">
  <DiagramRow>
    <DiagramNode tone="slate" eyebrow="Committed UI" title="Visible and authoritative">
      Users interact with the last committed tree.
    </DiagramNode>
    <DiagramNode tone="purple" eyebrow="Render work" title="May be in progress">
      React can calculate a future tree without exposing half-finished work to the DOM.
    </DiagramNode>
  </DiagramRow>
</VisualDiagram>

## useDeferredValue keeps one value intentionally behind

<VisualDiagram title="Deferred value mental model">
  <DiagramStack>
    <DiagramNode tone="blue" title="query updates immediately">
      The controlled input reflects the user's latest typing.
    </DiagramNode>
    <DiagramArrow label="defer expensive consumer" />
    <DiagramNode tone="orange" title="deferredQuery may temporarily lag">
      Expensive results can continue rendering from an older value while React prepares the newest result.
    </DiagramNode>
    <DiagramArrow label="background render completes" />
    <DiagramNode tone="green" title="results catch up to latest query" />
  </DiagramStack>
</VisualDiagram>

## Choose the right scheduling tool

<DecisionTree
  question="What are you trying to keep responsive?"
  items={[
    { label: 'An update you trigger should be non-urgent', value: 'Consider useTransition or startTransition.' },
    { label: 'A derived consumer may lag behind a rapidly changing value', value: 'Consider useDeferredValue.' },
    { label: 'A calculation is simply slow', value: 'Profile first; concurrency does not make expensive work free.' },
    { label: 'You need actual CPU parallelism', value: 'Use platform tools such as Web Workers; concurrent rendering is not multithreading.' },
    { label: 'A resource is not ready', value: 'That is a Suspense/readiness concern, often combined with transitions.' },
  ]}
/>

## Keep this mental model

<VisualDiagram title="Concurrency in one picture">
  <DiagramStack>
    <DiagramNode tone="red" title="Urgent interaction has priority" />
    <DiagramArrow />
    <DiagramNode tone="purple" title="Non-urgent render work can be interrupted" />
    <DiagramArrow />
    <DiagramNode tone="green" title="Only completed work is committed to the user" />
  </DiagramStack>
</VisualDiagram>

Continue with **useTransition and startTransition** for the detailed API and performance patterns.