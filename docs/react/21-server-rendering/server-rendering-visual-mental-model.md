---
title: Server Rendering Visual Mental Model
description: Visualise SSR, hydration, streaming, static rendering, and the boundary between server HTML and interactive client React.
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

# Server Rendering visual mental model

Server rendering lets React produce HTML before the browser has finished booting the interactive client application.

<VisualDiagram title="SSR → browser → hydration">
  <DiagramStack>
    <DiagramNode tone="purple" eyebrow="Server" title="React renders HTML">
      The server produces markup for the initial request.
    </DiagramNode>
    <DiagramArrow label="HTML response" />
    <DiagramNode tone="blue" eyebrow="Browser" title="HTML becomes visible">
      Users may see meaningful content before client JavaScript finishes loading.
    </DiagramNode>
    <DiagramArrow label="client React loads" />
    <DiagramNode tone="orange" eyebrow="Hydration" title="React attaches to existing markup">
      The client tree must match the server output closely enough for React to adopt the existing DOM.
    </DiagramNode>
    <DiagramArrow label="interactive app" />
    <DiagramNode tone="green" eyebrow="Client" title="React handles updates normally">
      State, events, Effects, and later renders continue from the hydrated tree.
    </DiagramNode>
  </DiagramStack>
</VisualDiagram>

## Hydration is adoption, not a second unrelated render

<VisualDiagram title="Hydration contract">
  <DiagramGrid columns={2}>
    <DiagramNode tone="green" title="Server and client agree">
      Equivalent initial output lets React attach event behaviour and preserve the existing DOM efficiently.
    </DiagramNode>
    <DiagramNode tone="red" title="Server and client disagree">
      Time-dependent values, browser-only branches, random output, or mismatched data can create hydration warnings or replacement work.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Streaming changes when HTML arrives

<LifecycleBar
  items={[
    { label: 'Request arrives', tone: 'blue' },
    { label: 'Shell can render', tone: 'purple' },
    { label: 'HTML begins streaming', tone: 'cyan' },
    { label: 'Suspended regions resolve', tone: 'orange' },
    { label: 'More HTML streams', tone: 'green' },
  ]}
/>

<VisualDiagram title="Streaming + Suspense architecture">
  <DiagramStack>
    <DiagramNode tone="blue" title="Stable shell renders first" />
    <DiagramArrow label="send usable HTML early" />
    <DiagramRow>
      <DiagramNode tone="purple" title="Fast Suspense region">
        Reveals as soon as its server work is ready.
      </DiagramNode>
      <DiagramNode tone="orange" title="Slow Suspense region">
        Does not have to block the entire response.
      </DiagramNode>
    </DiagramRow>
  </DiagramStack>
</VisualDiagram>

## SSR, static rendering, and client rendering solve different timing problems

<VisualDiagram title="Rendering strategy map">
  <DiagramGrid columns={3}>
    <DiagramNode tone="purple" eyebrow="Request time" title="Server rendering">
      Produce HTML for the request using server-side rendering APIs or a framework.
    </DiagramNode>
    <DiagramNode tone="cyan" eyebrow="Build / pre-render time" title="Static rendering">
      Produce reusable HTML ahead of requests when the content model allows it.
    </DiagramNode>
    <DiagramNode tone="blue" eyebrow="Browser" title="Client rendering">
      Build the visible UI after JavaScript runs in the browser.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Choose based on ownership and timing

<DecisionTree
  question="What rendering requirement do you have?"
  items={[
    { label: 'Meaningful HTML should arrive with the request', value: 'Use SSR or framework server rendering.' },
    { label: 'Content can be produced ahead of time', value: 'Static/prerendered output may fit.' },
    { label: 'Slow regions should not block the whole response', value: 'Use streaming with meaningful Suspense boundaries.' },
    { label: 'Initial server and client output differ intentionally', value: 'Redesign the boundary instead of accepting hydration mismatch as normal.' },
    { label: 'The app is purely browser-only and server HTML adds little value', value: 'Client rendering may be sufficient.' },
  ]}
/>

## Keep this mental model

<VisualDiagram title="Server rendering in one picture">
  <DiagramRow>
    <DiagramNode tone="purple" title="Server creates initial HTML" />
    <DiagramNode tone="orange" title="Hydration connects client React to that HTML" />
    <DiagramNode tone="green" title="Client React owns later interaction and updates" />
  </DiagramRow>
</VisualDiagram>

Continue with **Hydration and hydrateRoot** for the detailed APIs, mismatch debugging, and production patterns.