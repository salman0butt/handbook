---
title: Security and Trust Boundaries in React
description: Production React security across HTML rendering, Server Functions, authentication, authorization, serialization, secrets, URLs, and third-party code.
sidebar_position: 1
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

# Security and Trust Boundaries in React

React escapes ordinary text by default, but React itself is **not** your complete security boundary. Secure applications still need explicit validation, authentication, authorization, output controls, secret isolation, dependency hygiene, and observability.

## Start with a trust map

<VisualDiagram title="Every network/runtime boundary changes what can be trusted">
  <DiagramStack>
    <DiagramNode title="Browser/user input" tone="red">fully attacker-controlled</DiagramNode>
    <DiagramArrow label="client rendering / interaction" />
    <DiagramNode title="Client Component" tone="orange">still untrusted from the server's perspective</DiagramNode>
    <DiagramArrow label="network boundary" />
    <DiagramNode title="Server Function / API" tone="purple">validate · authenticate · authorize</DiagramNode>
    <DiagramArrow label="application policy" />
    <DiagramNode title="Service/domain layer" tone="blue">business invariants</DiagramNode>
    <DiagramArrow label="privileged dependencies" />
    <DiagramNode title="Database / providers" tone="green">protected resources</DiagramNode>
  </DiagramStack>
</VisualDiagram>

For every boundary ask: what can the caller control, who are they, what may they do, what must be validated, what may cross back to the client, and what must never be logged or serialized?

## JSX text is escaped; raw HTML is different

```jsx
function Comment({ message }) {
  return <p>{message}</p>;
}
```

Ordinary text values are escaped rather than interpreted as markup.

`dangerouslySetInnerHTML` deliberately bypasses that safe text-rendering path:

```jsx
<div dangerouslySetInnerHTML={{ __html: trustedHtml }} />
```

<DecisionTree
  question="Do you need raw HTML?"
  items={[
    { label: 'No — content can be structured as React data/elements', value: 'Prefer structured rendering' },
    { label: 'Yes — source is fully trusted by your security model', value: 'Keep the trust decision explicit and narrow' },
    { label: 'Yes — content can contain user/CMS input', value: 'Sanitize with an audited HTML sanitizer before rendering' },
    { label: 'Plan is regex-based sanitization', value: 'Do not do this — HTML parsing/security is more complex' },
  ]}
/>

## Prefer structured content when possible

<VisualDiagram title="Structured rendering narrows the allowed surface">
  <DiagramRow>
    <DiagramNode title="Untrusted content model" tone="orange">paragraph · text · link · emphasis</DiagramNode>
    <DiagramArrow direction="right" label="allow-list mapping" />
    <DiagramNode title="Known React components" tone="green">controlled semantics + attributes</DiagramNode>
  </DiagramRow>
</VisualDiagram>

A structured CMS/document model often gives you more control than arbitrary HTML.

## Server Functions are server entry points reachable from clients

```js
'use server';

export async function deleteProject(rawProjectId) {
  const user = await requireAuthenticatedUser();
  const projectId = parseProjectId(rawProjectId);
  const project = await db.project.findUniqueOrThrow({ where: { id: projectId } });

  if (project.ownerId !== user.id) {
    throw new UnauthorizedError();
  }

  await db.project.delete({ where: { id: projectId } });
}
```

<VisualDiagram title="A Server Function crosses a real network trust boundary">
  <DiagramRow>
    <DiagramNode title="Client arguments" tone="red">fully controllable by caller</DiagramNode>
    <DiagramArrow direction="right" label="request" />
    <DiagramNode title="Server Function" tone="purple">parse + authenticate + authorize</DiagramNode>
    <DiagramArrow direction="right" label="allowed action" />
    <DiagramNode title="Mutation" tone="green">domain/database operation</DiagramNode>
  </DiagramRow>
</VisualDiagram>

Hiding a button in the client does not authorize the server mutation.

## Authentication and authorization are different

<DiagramGrid columns={2}>
  <DiagramNode title="Authentication" tone="blue">Who is this caller?</DiagramNode>
  <DiagramNode title="Authorization" tone="red">May this caller perform this action on this resource?</DiagramNode>
</DiagramGrid>

A logged-in user still must not be able to mutate another user's record by changing an ID.

## Validation and authorization are also different

<DiagramGrid columns={2}>
  <DiagramNode title="Validation" tone="cyan">Is this input structurally/domain-wise acceptable?</DiagramNode>
  <DiagramNode title="Authorization" tone="orange">Does this identity have permission for this resource/action?</DiagramNode>
</DiagramGrid>

TypeScript annotations do not validate runtime input. Data from forms, URLs, network requests, storage, and Server Function arguments still needs runtime checks.

## Never trust hidden/client-provided ownership fields

```jsx
<input type="hidden" name="ownerId" value={user.id} />
```

The browser can modify submitted values. Derive authority from authenticated server identity and server-owned records.

## Server/client serialization is a data-exposure boundary

<VisualDiagram title="Anything serialized to a Client Component becomes browser-visible">
  <DiagramRow>
    <DiagramNode title="Server-only data" tone="green">DB record · secrets · privileged metadata</DiagramNode>
    <DiagramArrow direction="right" label="select DTO" />
    <DiagramNode title="Serializable client props" tone="blue">only what UI needs</DiagramNode>
    <DiagramArrow direction="right" label="browser" />
    <DiagramNode title="User-inspectable" tone="orange">assume client can read it</DiagramNode>
  </DiagramRow>
</VisualDiagram>

Do not pass private tokens, internal authorization metadata, or secrets simply because a Server Component could access them.

## `'use client'` expands the client module graph

<VisualDiagram title="Client boundaries are dependency boundaries">
  <DiagramStack>
    <DiagramNode title="'use client' module" tone="blue">interactive entry point</DiagramNode>
    <DiagramArrow label="pulls client dependencies" />
    <DiagramNode title="Client module graph" tone="orange">must not include DB clients, signing keys, filesystem secrets, privileged SDKs</DiagramNode>
  </DiagramStack>
</VisualDiagram>

Framework tooling can help, but architecture should make server-only modules difficult to import from client code.

## URLs and redirects are untrusted input

Attackers can control query strings, path parameters, redirect targets, and CMS-provided resource URLs.

<DecisionTree
  question="Can the user influence this URL?"
  items={[
    { label: 'Internal redirect target', value: 'Allow only valid internal paths or an explicit origin allow-list' },
    { label: 'External link/resource', value: 'Parse URL and enforce allowed schemes/origins' },
    { label: 'javascript: or unexpected scheme', value: 'Reject it' },
  ]}
/>

Use structured URL parsing instead of string-prefix security checks.

## Browser storage is not a secret vault

Anything available to client JavaScript should be treated as client-accessible. Minimize sensitive tokens in browser storage and follow the authentication framework's cookie/session protections.

## Third-party code expands the trust surface

<VisualDiagram title="Third-party code executes inside your application's risk envelope">
  <DiagramGrid columns={3}>
    <DiagramNode title="Dependency" tone="blue">npm/package supply chain</DiagramNode>
    <DiagramNode title="Script/SDK" tone="orange">runtime data + DOM access</DiagramNode>
    <DiagramNode title="Widget/provider" tone="purple">network + iframe/API integration</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Review permissions, update policy, CSP/resource loading, secret handling, and failure isolation for critical integrations.

## Telemetry must respect trust boundaries

Do not dump whole props, state, storage, headers, form bodies, or Server Function arguments into logs.

<DecisionTree
  question="What should telemetry contain?"
  items={[
    { label: 'Release, route, trace ID, error class, safe feature IDs', value: 'Useful diagnostic context' },
    { label: 'Secrets, tokens, payment details, private messages', value: 'Never log' },
    { label: 'User data needed only occasionally', value: 'Redact/aggregate/minimize according to policy' },
  ]}
/>

## Security review lifecycle

<LifecycleBar items={[
  { label: 'Map trust boundaries', tone: 'blue' },
  { label: 'Validate input', tone: 'cyan' },
  { label: 'Authenticate identity', tone: 'purple' },
  { label: 'Authorize resource/action', tone: 'red' },
  { label: 'Minimize output', tone: 'orange' },
  { label: 'Observe safely', tone: 'green' },
]} />

Security is strongest when trust boundaries are explicit in architecture instead of scattered across UI conditionals and assumptions.
