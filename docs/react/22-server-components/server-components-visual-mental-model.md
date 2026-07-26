---
title: Server Components Visual Mental Model
description: Visualise Server Components, Client Component boundaries, Server Functions, serialization, and how RSC differs from SSR.
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
} from '@site/src/components/handbook/VisualDiagram';

# Server Components visual mental model

Server Components change **where component code executes and what crosses the server/client boundary**. They are not simply another name for SSR.

<VisualDiagram title="Server Component → Client Component boundary">
  <DiagramStack>
    <DiagramNode tone="purple" eyebrow="Server" title="Server Component executes on the server">
      It can use server-side data access and produce a serializable React result without shipping its component code as client JavaScript.
    </DiagramNode>
    <DiagramArrow label="serialized React payload / props" />
    <DiagramNode tone="orange" eyebrow="Boundary" title="Client Component receives serializable inputs">
      Crossing into client code creates a client module boundary. Values crossing that boundary must follow the supported serialization contract.
    </DiagramNode>
    <DiagramArrow label="interactive browser code" />
    <DiagramNode tone="blue" eyebrow="Client" title="Client Component owns browser interaction">
      State, event handlers, Effects, refs, and browser APIs belong in client-executed code.
    </DiagramNode>
  </DiagramStack>
</VisualDiagram>

## SSR and Server Components answer different questions

<VisualDiagram title="SSR vs RSC">
  <DiagramGrid columns={2}>
    <DiagramNode tone="cyan" eyebrow="SSR" title="When is HTML produced?">
      Server rendering concerns producing initial HTML before browser interaction begins.
    </DiagramNode>
    <DiagramNode tone="purple" eyebrow="RSC" title="Where does component code run?">
      Server Components concern the server/client component execution model and payload boundary.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

<VisualDiagram title="They can coexist">
  <DiagramStack>
    <DiagramNode tone="purple" title="Server Component tree produces server-side React output" />
    <DiagramArrow />
    <DiagramNode tone="cyan" title="Framework/server renderer may turn initial result into HTML" />
    <DiagramArrow />
    <DiagramNode tone="blue" title="Client boundaries hydrate / become interactive in the browser" />
  </DiagramStack>
</VisualDiagram>

## 'use client' marks a client module boundary

<VisualDiagram title="Client boundary propagation">
  <DiagramStack>
    <DiagramNode tone="purple" title="Server-side module graph" />
    <DiagramArrow label="'use client' entry point" />
    <DiagramNode tone="orange" title="Client module graph begins">
      Imports pulled into that client entry become part of the client-side graph unless architecture separates them.
    </DiagramNode>
    <DiagramArrow />
    <DiagramNode tone="blue" title="Browser bundle and interactive components" />
  </DiagramStack>
</VisualDiagram>

## 'use server' is about server-callable functions

<VisualDiagram title="Do not confuse component and function directives">
  <DiagramRow>
    <DiagramNode tone="blue" title="'use client'">
      Marks a client module boundary for code that must execute in the browser.
    </DiagramNode>
    <DiagramNode tone="red" title="'use server'">
      Marks supported functions/modules as server-callable Server Functions. It is not the marker that makes a component a Server Component.
    </DiagramNode>
  </DiagramRow>
</VisualDiagram>

## Server Functions cross a security boundary

<VisualDiagram title="Server Function trust boundary">
  <DiagramStack>
    <DiagramNode tone="blue" title="Client can request a Server Function call">
      Treat arguments as untrusted request input.
    </DiagramNode>
    <DiagramArrow label="network / protocol boundary" />
    <DiagramNode tone="red" title="Validate and authorize on the server">
      Authentication context, authorization, validation, and safe mutation rules still apply.
    </DiagramNode>
    <DiagramArrow />
    <DiagramNode tone="green" title="Return only safe public results">
      Do not expose secrets, database internals, or trusted server objects across the boundary.
    </DiagramNode>
  </DiagramStack>
</VisualDiagram>

## Choose the execution side deliberately

<DecisionTree
  question="Where should this responsibility live?"
  items={[
    { label: 'Needs database/filesystem/secret server access', value: 'Prefer server-side code when the framework supports it.' },
    { label: 'Needs useState, event handlers, Effects, DOM, browser APIs', value: 'It needs a Client Component boundary.' },
    { label: 'Only passes data/layout through to interactive children', value: 'Keep the parent server-side when possible and push the client boundary down.' },
    { label: 'Needs to mutate server data from the client', value: 'Use a secure Server Function/action or HTTP endpoint with validation and authorization.' },
    { label: 'You are deciding whether HTML is generated on the server', value: 'That is an SSR/rendering strategy question, separate from RSC.' },
  ]}
/>

## Keep this mental model

<VisualDiagram title="Server Components in one picture">
  <DiagramRow>
    <DiagramNode tone="purple" title="Server Components keep server-only work on the server" />
    <DiagramNode tone="orange" title="Boundaries serialize data and define client module ownership" />
    <DiagramNode tone="blue" title="Client Components own browser interaction" />
  </DiagramRow>
</VisualDiagram>

Continue with **Server Components and Client Boundaries** for the detailed execution, composition, and framework integration model.