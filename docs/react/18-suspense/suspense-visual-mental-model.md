---
title: Suspense Visual Mental Model
description: Visualise suspension, fallback boundaries, nested reveal order, lazy loading, and what Suspense does and does not own.
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

# Suspense visual mental model

Suspense is a **readiness and reveal boundary**. It does not fetch data by itself.

<VisualDiagram
  title="What happens when a child suspends?"
  subtitle="React looks for the nearest Suspense boundary that can represent the waiting state."
>
  <DiagramStack>
    <DiagramNode tone="blue" eyebrow="Render" title="A subtree tries to render">
      A component reads a Suspense-enabled resource or lazy-loaded module.
    </DiagramNode>
    <DiagramArrow label="resource is not ready" />
    <DiagramNode tone="orange" eyebrow="Suspend" title="Rendering cannot finish yet">
      React pauses that subtree and searches upward for the nearest boundary.
    </DiagramNode>
    <DiagramArrow label="nearest boundary handles waiting" />
    <DiagramNode tone="purple" eyebrow="Fallback" title="Show fallback UI">
      The boundary represents the pending subtree with loading UI.
    </DiagramNode>
    <DiagramArrow label="resource becomes ready" />
    <DiagramNode tone="green" eyebrow="Reveal" title="Retry and reveal content">
      React renders the suspended subtree again and replaces the fallback when it can complete.
    </DiagramNode>
  </DiagramStack>
</VisualDiagram>

## Suspense owns reveal, not the data source

<VisualDiagram title="Separate the responsibilities">
  <DiagramGrid columns={3}>
    <DiagramNode tone="cyan" eyebrow="Resource layer" title="Makes readiness available">
      Framework loaders, lazy imports, caches, or supported resource APIs provide something React can suspend on.
    </DiagramNode>
    <DiagramNode tone="purple" eyebrow="Suspense" title="Coordinates fallback and reveal">
      The boundary decides what users see while a descendant is not ready.
    </DiagramNode>
    <DiagramNode tone="green" eyebrow="Error handling" title="Handles failure separately">
      Rejected work is an error concern, not a loading fallback concern.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Nested boundaries create reveal architecture

<VisualDiagram title="Nested Suspense boundaries">
  <DiagramStack>
    <DiagramNode tone="blue" title="Page shell">
      Navigation and stable page structure can render immediately.
    </DiagramNode>
    <DiagramArrow />
    <DiagramRow>
      <DiagramNode tone="purple" title="Summary boundary">
        Reveal summary content when its resources are ready.
      </DiagramNode>
      <DiagramNode tone="orange" title="Activity boundary">
        Let a slower feed reveal independently instead of blocking the whole page.
      </DiagramNode>
    </DiagramRow>
  </DiagramStack>
</VisualDiagram>

<LifecycleBar
  items={[
    { label: 'Shell renders', tone: 'blue' },
    { label: 'Fallbacks appear', tone: 'orange' },
    { label: 'Fast region reveals', tone: 'purple' },
    { label: 'Slow region reveals', tone: 'green' },
  ]}
/>

## Lazy loading is one Suspense use case

<VisualDiagram title="Lazy component lifecycle">
  <DiagramStack>
    <DiagramNode tone="blue" title="Route or feature needs a lazy component" />
    <DiagramArrow label="module is not loaded" />
    <DiagramNode tone="orange" title="Nearest Suspense fallback appears" />
    <DiagramArrow label="module finishes loading" />
    <DiagramNode tone="green" title="Component renders and boundary reveals it" />
  </DiagramStack>
</VisualDiagram>

## Boundary placement is product design

<DecisionTree
  question="Where should a Suspense boundary go?"
  items={[
    { label: 'The whole screen must appear together', value: 'Use a broader boundary.' },
    { label: 'Independent regions can reveal separately', value: 'Use nested boundaries around meaningful regions.' },
    { label: 'A tiny element flashes constantly', value: 'The boundary may be too granular or the loading strategy may be wrong.' },
    { label: 'Navigation should keep previous UI while next work prepares', value: 'Combine Suspense architecture with transitions.' },
    { label: 'You only need to start a fetch request', value: 'Suspense is not the fetching API; choose a data/resource layer first.' },
  ]}
/>

## Keep this mental model

<VisualDiagram title="Suspense in one picture">
  <DiagramRow>
    <DiagramNode tone="slate" title="Not a fetcher">
      Suspense does not decide how your data is requested or cached.
    </DiagramNode>
    <DiagramNode tone="purple" title="A readiness boundary">
      It represents a subtree while that subtree cannot finish rendering.
    </DiagramNode>
    <DiagramNode tone="green" title="A reveal tool">
      Boundary placement controls how quickly meaningful regions become usable.
    </DiagramNode>
  </DiagramRow>
</VisualDiagram>

Continue with **Suspense Boundaries** for the detailed API and production patterns.