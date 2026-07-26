---
title: Server Functions, Server Actions & use server
description: Understand the current React and Next.js mutation model, how use server marks callable server functions, and when to use Server Actions.
---

# Server Functions, Server Actions & `use server`

Next.js mutations are built on **React Server Functions**.

A useful terminology model is:

```text
Server Function
  = async function that runs on the server and can be invoked through the RSC transport

Server Action
  = Server Function used in an action/mutation context
```

In current Next.js documentation, **Server Function** is the broader term. **Server Action** describes the mutation-oriented use of one, especially with forms and React Actions.

## `use server` does not make a component a Server Component

This distinction is critical:

```text
Server Component
  → server-rendered component type
  → no "use server" directive required

Server Function
  → callable server-side function
  → marked with "use server"
```

Incorrect mental model:

```text
'use server' = this component runs on the server
```

Correct:

```text
'use server' = these async functions may be invoked as Server Functions
```

## Inline Server Function

A Server Component can define one inline:

```tsx
export default function Page() {
  async function createPost(formData: FormData) {
    'use server'

    const title = formData.get('title')
    // mutate
  }

  return (
    <form action={createPost}>
      <input name="title" />
      <button type="submit">Create</button>
    </form>
  )
}
```

The directive is inside the async function body.

## Module-level Server Functions

For reusable actions, a dedicated file is often easier to review:

```ts
// app/actions.ts
'use server'

export async function createPost(formData: FormData) {
  // ...
}

export async function deletePost(formData: FormData) {
  // ...
}
```

At module scope, exported functions in that file become Server Functions.

This is the pattern required when Client Components import Server Functions directly.

## Client Components cannot define Server Functions inline

This is invalid architecture:

```tsx
'use client'

export function Editor() {
  async function save() {
    'use server'
  }
}
```

Instead:

```ts
// actions.ts
'use server'

export async function savePost(formData: FormData) {
  // ...
}
```

```tsx
'use client'

import { savePost } from './actions'

export function Editor() {
  return <form action={savePost}>...</form>
}
```

## Passing Server Functions as props

A Server Function can cross the Server/Client boundary as a special callable reference:

```tsx
<ClientEditor saveAction={savePost} />
```

```tsx
'use client'

export function ClientEditor({
  saveAction,
}: {
  saveAction: (formData: FormData) => Promise<void>
}) {
  return <form action={saveAction}>...</form>
}
```

This is different from passing an arbitrary JavaScript function across the boundary. Server Functions have framework-supported transport semantics.

## Invocation paths

Server Functions can be triggered from:

```text
<form action={serverFunction}>
<button formAction={serverFunction}>
Client event handlers
Client useEffect/useTransition workflows
other server code
```

The most natural use is mutation work.

## Forms automatically use an Action context

When passed to:

```tsx
<form action={savePost}>
```

or:

```tsx
<button formAction={publishPost}>Publish</button>
```

React automatically invokes the function in an Action/Transition context.

For imperative invocation from a client event, use a transition when pending state/action semantics matter:

```tsx
'use client'

import { startTransition } from 'react'
import { saveDraft } from './actions'

function SaveButton() {
  return (
    <button
      onClick={() => {
        startTransition(async () => {
          await saveDraft()
        })
      }}
    >
      Save
    </button>
  )
}
```

## Server Functions use POST when invoked from the client

Server Actions are invoked over `POST` behind the scenes.

Do not treat them as local function calls merely because the syntax looks like one.

Conceptually:

```text
Client Component
  ↓ invoke Server Function reference
network POST
  ↓
Next.js server
  ↓
run function
  ↓
return serialized result + potentially updated RSC UI
```

That network boundary explains why:

- functions must be async
- arguments are serialized
- return values must be transportable
- authentication/authorization must be checked server-side
- duplicate requests are possible
- latency matters

## Arguments are untrusted

This is a security rule, not a suggestion.

```ts
'use server'

export async function deleteProject(projectId: string) {
  // projectId is client-controlled
}
```

A user can invoke the action without clicking your button.

Therefore:

```text
Server Function
  ↓
authenticate
  ↓
validate input
  ↓
authorize resource/action
  ↓
mutate
  ↓
refresh/revalidate/redirect
```

Never infer permission from the fact that a button was hidden in the UI.

## Server Functions are not a data-fetching API

React explicitly positions Server Functions for mutations, not routine data fetching.

Bad default:

```text
Client Component
  ↓ Server Function
getProducts()
  ↓
return products
```

Prefer:

```text
Server Component
  ↓
fetch / ORM / SDK
```

or a true HTTP API if another client needs one.

## Serialization matters

Arguments and results cross a transport boundary.

Use predictable values:

- strings
- numbers
- booleans
- arrays
- plain objects
- `FormData`
- supported built-ins
- Server Function references

Avoid returning infrastructure objects such as:

- ORM clients
- database transactions
- SDK handles
- arbitrary class instances
- request/response objects
- component functions

Return a small mutation result contract instead:

```ts
type SaveResult =
  | { ok: true; id: string }
  | { ok: false; message: string }
```

## Mutations should have domain names

Prefer:

```ts
createInvoice()
publishPost()
archiveProject()
changeMembershipRole()
```

instead of generic names such as:

```ts
submit()
handleAction()
updateData()
```

Domain names improve authorization, observability, idempotency, and cache invalidation review.

## Server Function vs Route Handler

Use a Server Function when:

- the caller is your Next.js UI
- the operation is mutation-oriented
- React form/action integration is useful
- updated RSC UI should return naturally

Use a Route Handler when:

- an external client needs HTTP
- you need an explicit REST/webhook contract
- HTTP methods/status/headers are first-class API design
- another service or mobile app is a consumer

Do not wrap every Server Function in a Route Handler or vice versa.

## Server Function vs ordinary server helper

Not every server function should be callable by the client.

```ts
// server/projects.ts
import 'server-only'

export async function updateProjectRecord(...) {
  // internal helper
}
```

```ts
// app/actions.ts
'use server'

import { updateProjectRecord } from '@/server/projects'

export async function updateProject(...) {
  // authenticate, validate, authorize
  return updateProjectRecord(...)
}
```

The action is the exposed mutation boundary. The helper is internal implementation.

## Current client dispatch behaviour

Current React/Next.js action dispatching may serialize/queue client action calls in ways that make them unsuitable for parallel data retrieval.

Do not design a high-throughput data API around repeated Server Action calls.

If one mutation needs parallel server work, parallelize inside the action where safe:

```ts
await Promise.all([
  writeAuditLog(...),
  updateSearchIndex(...),
])
```

but only when the operations are independent and your consistency model allows it.

## Common mistakes

### Treating `use server` as a component directive

It marks Server Functions, not Server Components.

### Exporting every server helper from an action file

That unnecessarily expands the client-callable mutation surface.

### Trusting action arguments

They are client-controlled.

### Using actions for reads

Use Server Component data fetching for normal reads.

### Returning giant objects

Return the minimal result the client actually needs.

## Debugging checklist

If a Server Function fails:

1. Verify it is async.
2. Verify `use server` placement.
3. If imported into a Client Component, verify module-level directive usage.
4. Inspect argument serialization.
5. Inspect authentication and authorization.
6. Check server logs, not only browser console.
7. Confirm the caller is using an Action/Transition context when needed.
8. Separate mutation failure from revalidation/redirect failure.
9. Reproduce with the production build.
10. Confirm the action boundary is actually the correct architecture.

## Interview questions

**What is the difference between a Server Function and a Server Action?**  
Server Function is the broader callable server function primitive. A Server Action is a Server Function used in an action/mutation context such as form submission.

**Does `use server` create a Server Component?**  
No. Server Components need no such directive. `use server` marks Server Functions.

**Can a Client Component define a Server Function inline?**  
No. It can import one from a module marked `use server`, or receive one as a prop.

**Why must action arguments be validated?**  
They cross a network boundary and are fully client-controlled.

## Exercise

Take a client-heavy CRUD screen with:

```text
create
rename
archive
delete
```

Design four Server Functions. For each, document:

- exposed arguments
- authentication
- authorization rule
- validation schema
- mutation helper
- returned state
- cache invalidation
- idempotency risk
- redirect/refresh behaviour
