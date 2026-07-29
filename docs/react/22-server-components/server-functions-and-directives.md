---
title: Server Functions, use server, and Mutation Boundaries
description: Learn Server Functions, the use server directive, Actions, serialization, security, authorization, progressive enhancement, and client/server mutation architecture.
sidebar_position: 2
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

# Server Functions, `'use server'`, and mutation boundaries

Server Functions let client code invoke async functions that execute on the server. Even when the syntax resembles a normal call, this is a **network and trust boundary**.

<VisualDiagram title="A Server Function call crosses the network">
  <LifecycleBar items={[
    { label: 'Client event / form submit', tone: 'blue' },
    { label: 'Call Server Function reference', tone: 'teal' },
    { label: 'Serialize arguments', tone: 'orange' },
    { label: 'Network request', tone: 'purple' },
    { label: 'Server validates + executes', tone: 'red' },
    { label: 'Serialize result', tone: 'orange' },
    { label: 'Client receives result', tone: 'green' },
  ]} />
</VisualDiagram>

The browser never directly executes the server implementation.

## `'use server'`

```jsx
async function createNote(formData) {
  'use server';
  await db.notes.create({ title: formData.get('title') });
}
```

A module can also mark exported async functions:

```jsx
'use server';

export async function createNote(formData) {
  // ...
}
```

<VisualDiagram title="Do not confuse component execution with callable functions">
  <DiagramGrid columns={2}>
    <DiagramNode title="Server Component" tone="purple">Runs on the server through the RSC environment. No `'use server'` marker is required.</DiagramNode>
    <DiagramNode title="Server Function" tone="orange">Async function marked for invocation through the server-function transport.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

## Server Function vs Server Action

A **Server Function** is a server-callable async function. A **Server Action** is a Server Function being used in an Action/mutation flow such as a form submission or Transition-backed operation.

```jsx
<form action={updateProfile}>...</form>
```

<VisualDiagram title="Function identity and Action usage are different ideas">
  <DiagramRow>
    <DiagramNode title="Server Function" tone="purple">Callable server command</DiagramNode>
    <DiagramArrow direction="right" label="used in mutation UI" />
    <DiagramNode title="Server Action" tone="green">Form/Action workflow with pending and result semantics</DiagramNode>
  </DiagramRow>
</VisualDiagram>

## Forms are a first-class boundary

```jsx
async function requestUsername(formData) {
  'use server';
  const username = formData.get('username');
  await saveUsername(username);
}

export default function Page() {
  return (
    <form action={requestUsername}>
      <input name="username" />
      <button type="submit">Save</button>
    </form>
  );
}
```

Forms can integrate `FormData`, pending state, progressive enhancement, Actions, and result state. Native form semantics remain valuable even in advanced React applications.

## `useActionState` on the client side

```jsx
'use client';

import { useActionState } from 'react';
import { updateProfile } from './actions';

export default function ProfileForm() {
  const [state, action, isPending] = useActionState(
    updateProfile,
    { error: null }
  );

  return (
    <form action={action}>
      <input name="displayName" disabled={isPending} />
      <button disabled={isPending}>Save</button>
      {state.error && <p>{state.error}</p>}
    </form>
  );
}
```

The server returns minimal serializable state; the client owns pending/result presentation.

## Outside forms, coordinate mutations with Transitions

```jsx
'use client';

import { useTransition } from 'react';
import { likePost } from './actions';

export function LikeButton() {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await likePost();
    });
  }

  return <button onClick={handleClick} disabled={isPending}>Like</button>;
}
```

## Treat arguments as untrusted network input

TypeScript does not validate what arrives at the server boundary.

<VisualDiagram title="Mutation security belongs inside the Server Function">
  <DiagramStack align="center">
    <DiagramNode title="Client-controlled arguments" tone="orange" />
    <DiagramArrow label="runtime validation" />
    <DiagramNode title="Authenticated actor" tone="blue" />
    <DiagramArrow label="authorization against target resource" />
    <DiagramNode title="Safe mutation" tone="purple" />
    <DiagramArrow label="minimal serializable result" />
    <DiagramNode title="Client UI" tone="green" />
  </DiagramStack>
</VisualDiagram>

A hidden button is never authorization.

```jsx
'use server';

export async function deleteProject(projectId) {
  const user = await requireUser();
  const project = await db.projects.find(projectId);

  if (!project || project.ownerId !== user.id) {
    throw new Error('Not authorized');
  }

  await db.projects.delete(projectId);
}
```

## Serializable payloads

Arguments and results must fit React's supported serialization model. Send application data, not runtime machinery.

<DiagramGrid columns={2}>
  <DiagramNode title="Good payloads" tone="green">Primitives · arrays · plain supported objects · Dates · FormData · typed binary data · Server Function references</DiagramNode>
  <DiagramNode title="Wrong payloads" tone="red">DOM events · database connections · arbitrary class instances · ordinary closures · secrets</DiagramNode>
</DiagramGrid>

Extract the value you need instead of forwarding browser event objects.

## Reads and writes have different owners

<VisualDiagram title="Prefer query/command separation">
  <DiagramGrid columns={2}>
    <DiagramNode title="Server Component" tone="blue" eyebrow="READ">Read server data during render when the architecture supports it.</DiagramNode>
    <DiagramNode title="Server Function" tone="purple" eyebrow="MUTATE">Validate, authorize, and perform a server-side command.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Server Functions are not a generic cached read API.

## Optimistic UI never weakens the server boundary

<LifecycleBar items={[
  { label: 'User submits intent', tone: 'blue' },
  { label: 'Optimistic UI projects likely result', tone: 'orange' },
  { label: 'Server Function validates + authorizes', tone: 'purple' },
  { label: 'Persist / reject', tone: 'red' },
  { label: 'Canonical data refreshes', tone: 'teal' },
  { label: 'UI converges or rolls back', tone: 'green' },
]} />

Optimistic state is a presentation guess, not authority.

## Framework policy after mutation

Refreshing server-rendered data may involve route refresh, framework cache invalidation, tag/path revalidation, navigation, or client-cache updates. Those mechanisms belong to the framework/data layer, not React Server Functions themselves.

## Distributed-system concerns still apply

A Server Function call can be retried, duplicated, delayed, or fail partway through. Sensitive operations may require:

- idempotency keys;
- database transactions;
- timeout/retry policy;
- duplicate-submission handling;
- audit logs;
- trace/request IDs.

<DecisionTree
  question="What should this mutation guarantee?"
  items={[
    { label: 'Payment / order / irreversible provisioning', value: 'Design idempotency explicitly' },
    { label: 'Several related writes must succeed together', value: 'Use transaction semantics' },
    { label: 'Expected validation failure', value: 'Return safe domain state' },
    { label: 'Unexpected infrastructure failure', value: 'Throw + observe/recover through error architecture' },
  ]}
/>

## CSRF and browser security

Server Functions use framework-managed transport, but normal web security remains relevant: allowed origins, cookies, CSRF protection, authentication, deployment topology, and secret handling.

Understand the framework's concrete security model instead of assuming the abstraction removes browser threats.

## Production checklist

For each exposed Server Function:

1. authenticate the actor;
2. authorize the target operation;
3. validate and normalize runtime input;
4. keep secrets/internal objects server-side;
5. use transactions when needed;
6. design idempotency for sensitive commands;
7. return the minimum serializable UI result;
8. log safely with request/actor/action context;
9. refresh canonical data through framework policy;
10. test unauthorized direct invocation, not only the visible UI path.

## Interview questions

**Junior:** What does `'use server'` mark?

**Mid-level:** Why must a Server Function validate and authorize arguments even when only an admin button calls it?

**Senior:** Design a Server Function for order placement that needs validation, authorization, idempotency, transactions, optimistic UI, revalidation, and observability.

## Summary

<VisualDiagram title="Server Function = distributed mutation boundary">
  <DiagramRow>
    <DiagramNode title="Client intent" tone="blue" />
    <DiagramArrow direction="right" label="serialize + network" />
    <DiagramNode title="Server authority" tone="purple">Validate · authorize · persist</DiagramNode>
    <DiagramArrow direction="right" label="safe result" />
    <DiagramNode title="Canonical UI" tone="green" />
  </DiagramRow>
</VisualDiagram>

## References

- https://react.dev/reference/rsc/use-server
- https://react.dev/reference/rsc/server-functions
- https://react.dev/reference/react/useActionState
