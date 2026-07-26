---
title: Server Functions, use server, and Mutation Boundaries
description: Learn Server Functions, the use server directive, Actions, serialization, security, authorization, progressive enhancement, and client/server mutation architecture.
sidebar_position: 2
---

# Server Functions, `'use server'`, and mutation boundaries

Server Functions let Client Components call async functions that execute on the server.

They are a **network boundary**, even when the syntax looks like an ordinary function call.

That mental model is essential for correctness and security.

## Mental model

```text
client event or form submission
   ↓
call Server Function reference
   ↓
framework serializes arguments
   ↓
network request
   ↓
server executes async function
   ↓
server returns serializable result
   ↓
client receives result
```

Do not think:

```text
client imports function
→ browser directly executes server code
```

That never happens.

## `'use server'`

A Server Function can be declared inside server code:

```jsx
async function createNote(formData) {
  'use server';

  await db.notes.create({
    title: formData.get('title'),
  });
}
```

The directive marks the async function as callable from client code through the framework's server-function transport.

## Module-level Server Functions

A file can mark all exported async functions as Server Functions:

```jsx
'use server';

export async function createNote(formData) {
  // ...
}

export async function deleteNote(id) {
  // ...
}
```

This shape is useful when Client Components need to import server-callable actions.

## `'use server'` is not a Server Component marker

Repeat this until it is automatic:

```text
Server Component
no special 'use server' directive required

'use server'
marks Server Functions
```

Mixing these concepts leads to broken architecture discussions.

## Server Functions are async

Because the client/server call crosses a network boundary, Server Functions are async.

```jsx
'use server';

export async function updateProfile(input) {
  // ...
}
```

Even if the server work itself is fast, the client still observes an asynchronous call.

## Forms are a first-class use case

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

When a Server Function is passed to a form Action, React and the framework can integrate:

- `FormData`;
- pending state;
- progressive enhancement;
- transitions;
- returned results;
- form reset behavior.

The Modern React section already covers form Actions from the client-facing perspective.

This chapter focuses on the server boundary.

## Server Functions used as Actions

A Server Function becomes a Server Action when it is used in an Action context such as:

```jsx
<form action={updateProfile}>...</form>
```

or when called inside a Transition for a mutation workflow.

Not every Server Function is automatically a Server Action.

The newer terminology is:

```text
Server Function
server-callable async function

Server Action
Server Function used in an Action/mutation flow
```

## `useActionState` integration

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

The Server Function returns serializable application state, while `useActionState` exposes result/pending state to the Client Component.

## Progressive enhancement

Server Function forms can work before the client bundle has fully hydrated when the framework supports the corresponding progressive-enhancement flow.

That improves resilience for forms because submission does not need to depend entirely on JavaScript readiness.

This is one reason native form semantics remain important even in advanced React apps.

## Outside forms: call in a Transition

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

  return (
    <button onClick={handleClick} disabled={isPending}>
      Like
    </button>
  );
}
```

Server Functions called outside form Actions should participate in Transition-based mutation UI so pending/error/optimistic behavior can be coordinated.

## Arguments cross the network

Treat every argument as client-controlled input.

```jsx
'use server';

export async function deleteProject(projectId) {
  // projectId came from client-controlled data
}
```

Do not trust it because TypeScript says `projectId: string`.

Runtime validation and authorization are still required.

## Security rule: authenticate and authorize inside the Server Function

Bad:

```jsx
export async function deleteProject(projectId) {
  await db.projects.delete(projectId);
}
```

Better:

```jsx
export async function deleteProject(projectId) {
  const user = await requireUser();
  const project = await db.projects.find(projectId);

  if (!project || project.ownerId !== user.id) {
    throw new Error('Not authorized');
  }

  await db.projects.delete(projectId);
}
```

The browser can call exposed Server Functions in ways your UI did not anticipate.

UI visibility is not authorization.

## Hidden button ≠ protected operation

This is never sufficient:

```jsx
{user.isAdmin && (
  <button onClick={() => deleteUser(userId)}>
    Delete user
  </button>
)}
```

The server function itself must verify permission.

Client code is not a trust boundary.

## Validate input

```jsx
'use server';

export async function updateProfile(formData) {
  const displayName = String(formData.get('displayName') ?? '');

  if (displayName.length < 2 || displayName.length > 80) {
    return { error: 'Invalid display name' };
  }

  // authorization + mutation
}
```

For complex inputs, use a deliberate runtime schema/validation layer.

Types do not validate network input.

## Serializable arguments

Server Function arguments and return values must fit React's supported serialization model.

Common supported categories include:

- primitives;
- arrays and supported iterables;
- plain objects;
- Dates;
- FormData;
- typed binary values;
- Promises;
- Server Function references.

Do not pass arbitrary class instances or normal functions and expect them to survive the network boundary.

## Event objects are not mutation payloads

Wrong:

```jsx
<button onClick={event => saveEvent(event)} />
```

Browser event objects are not appropriate Server Function arguments.

Extract the data you need:

```jsx
<button onClick={() => saveSelection(item.id)} />
```

## Return values should be UI-oriented and serializable

Useful shape:

```jsx
return {
  ok: false,
  fieldErrors: {
    email: 'Email is already registered',
  },
};
```

Avoid returning huge internal database objects or secrets.

Ask:

> What minimum result does the client need to render the next state?

## Server Functions are not recommended as a generic read API

Server Functions are primarily mutation-oriented.

For reads in RSC architectures, Server Components can often read data directly.

Frameworks may serialize mutation processing or apply other semantics that make Server Functions a poor substitute for general cached querying.

Think:

```text
Server Component
read server data during render

Server Function
perform server-side mutation / command
```

This resembles query/command separation.

## Optimistic UI

Server Functions pair naturally with `useOptimistic`:

```text
user performs mutation
   ↓
show optimistic state immediately
   ↓
call Server Function
   ↓
server validates + authorizes + persists
   ↓
canonical data refreshes
   ↓
optimistic state converges or rolls back
```

Never let optimistic UI weaken server validation.

The optimistic state is only a presentation guess.

## Revalidation is framework policy

After a mutation, an application often needs to update server-rendered data.

The mechanism may involve:

- route refresh;
- cache invalidation;
- tag/path revalidation;
- navigation;
- client cache update.

Those mechanisms are framework/data-layer features, not universal React core APIs.

Keep this distinction explicit in architecture discussions.

## Idempotency

Network mutations can be retried or duplicated.

For sensitive operations, design idempotency where appropriate.

Examples:

- payment creation;
- email invitation;
- order placement;
- subscription mutation;
- irreversible provisioning.

A Server Function is still a distributed-system boundary.

React syntax does not remove retry, timeout, or duplicate-request concerns.

## Transactions

If a mutation updates multiple related records, use database transaction semantics where necessary.

Example:

```text
create order
reserve inventory
create payment intent
write audit record
```

A React Server Function can orchestrate this, but database correctness is still a backend engineering problem.

## Error design

Separate expected domain failures from unexpected server failures.

Expected:

```jsx
return {
  error: 'Username is already taken',
};
```

Unexpected:

```jsx
throw new Error('Database connection failed');
```

The UI may display expected validation errors inline while unexpected errors flow through error boundaries/framework error handling and observability.

## Logging and observability

A production Server Function should fit into normal backend observability:

- request/trace IDs;
- authenticated actor;
- action name;
- duration;
- failure reason;
- affected resource IDs;
- audit logs where required.

Do not log secrets or full sensitive payloads.

## CSRF and framework security

Server Functions are exposed through framework-managed transport.

Understand the framework's security model for:

- allowed origins;
- CSRF protection;
- cookies;
- authentication;
- deployment topology.

Do not assume the existence of a React abstraction removes web security requirements.

## Common mistakes

### Mistake: trust client arguments

Always validate and authorize on the server.

### Mistake: treat hidden UI as permission enforcement

UI is not a security boundary.

### Mistake: use Server Functions for every read

Use Server Components/data layers for read architecture where appropriate.

### Mistake: return internal objects directly

Return minimum serializable UI data.

### Mistake: forget distributed-system behavior

Timeouts, retries, duplicate submissions, transactions, and idempotency still matter.

### Mistake: confuse Server Function with Server Component

`'use server'` marks functions, not components.

## Production checklist

For every Server Function:

1. authenticate actor;
2. authorize target operation;
3. validate runtime input;
4. sanitize/normalize data;
5. use transactions when needed;
6. design idempotency for sensitive mutations;
7. return minimal serializable result;
8. log safely;
9. refresh/invalidate canonical data through framework policy;
10. test unauthorized direct calls, not only the visible UI path.

## Exercise

Build a Server Function for editing a project name.

Requirements:

- only project members with edit permission can call it;
- input must be 2–80 characters;
- duplicate names inside the same workspace are rejected;
- return a field-level error for expected validation failures;
- log unexpected database errors;
- integrate with `useActionState` in a Client Component;
- explain what happens if the browser calls the function with a project ID the UI never displayed.

## Interview questions

**Junior:** What does `'use server'` do?

**Mid-level:** Why must Server Function arguments be treated as untrusted input?

**Senior:** Design a secure Server Function mutation architecture covering authorization, validation, idempotency, transactions, optimistic UI, error modeling, and cache/revalidation responsibilities.

## Summary

```text
Server Function
async server-side callable boundary

'use server'
marks callable server functions
not Server Components

client call
= network request
= untrusted input
= backend security rules still apply
```

## References

- https://react.dev/reference/rsc/server-functions
- https://react.dev/reference/rsc/use-server
- https://react.dev/reference/react/useActionState
- https://react.dev/reference/react/useOptimistic
