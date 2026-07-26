---
title: Composition, Children & Serialization Across the Boundary
description: Compose Server and Client Components safely using props, children, slots, and React-serializable values.
---

# Composition, Children & Serialization Across the Boundary

Server and Client Components are designed to be **interleaved**, not separated into two isolated applications.

A common production tree looks like:

```text
Server Page
├── Server ProductSummary
├── Client Modal
│   └── Server Cart
└── Client AddToCart
```

The key is understanding which direction module imports can flow and which values can cross the server/client transport boundary.

## Server can render Client

This is the normal pattern:

```tsx
import AddToCart from './add-to-cart'

export default async function ProductPage() {
  const product = await getProduct()

  return (
    <main>
      <h1>{product.name}</h1>
      <AddToCart productId={product.id} />
    </main>
  )
}
```

`ProductPage` remains a Server Component.

`AddToCart` owns the interactive client behavior.

## Client should not import server-only implementation

Avoid this architecture:

```tsx
'use client'

import { ServerProductList } from './server-product-list'
```

The client module graph cannot simply pull server-only component implementation into the browser.

Instead, let a Server Component compose the tree and pass server-rendered UI into the Client Component.

## The `children` slot pattern

Client shell:

```tsx
'use client'

import { useState } from 'react'

export default function Modal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)}>Open cart</button>
      {open ? <div role="dialog">{children}</div> : null}
    </>
  )
}
```

Server content:

```tsx
import Modal from './modal'
import Cart from './cart'

export default function Page() {
  return (
    <Modal>
      <Cart />
    </Modal>
  )
}
```

`Cart` can remain a Server Component because the parent Server Component creates the element and passes it as content to the Client Component.

The Client Component receives a reference to rendered server content; it does not import the server implementation into the client graph.

## Think in ownership, not visual nesting

Visual structure:

```text
Modal
└── Cart
```

might suggest “Cart is a child of a Client Component, therefore Cart is client-side.”

That is wrong.

Module ownership matters more than visual nesting.

```text
Server Page creates:
  <Modal>
    <Cart />
  </Modal>

Modal = client module
Cart = server module
```

React's server/client transport can compose the rendered result together.

## Props crossing server to client must be serializable by React

Example:

```tsx
export default async function Page() {
  const product = await getProduct()

  return (
    <ProductPanel
      id={product.id}
      name={product.name}
      price={product.price}
    />
  )
}
```

Simple data values are usually the safest boundary contract.

Avoid thinking “must be JSON only.” React's server transport supports a defined serializable model that is broader than basic JSON in some cases.

But for application architecture, a reliable rule is:

> Cross the boundary with intentional data contracts, not arbitrary application objects.

## Functions are not normal serializable props

This will fail conceptually:

```tsx
<ClientButton onClick={() => console.log('clicked')} />
```

when the function is being created in a Server Component and passed as a normal callback prop.

The function implementation cannot be serialized like a string or number.

Later, Server Functions introduce a special transportable server reference. That is a distinct feature, not normal function serialization.

## Prefer IDs and data over rich server objects

Bad boundary:

```tsx
<ClientEditor user={databaseUserModelInstance} />
```

Better:

```tsx
<ClientEditor
  user={{
    id: user.id,
    name: user.name,
    role: user.role,
  }}
/>
```

Why?

- smaller payload
- explicit contract
- less accidental data exposure
- easier testing
- fewer serialization surprises

## Serialization is also a security boundary

Do not pass an entire database record just because the client UI uses two fields.

Unsafe pattern:

```tsx
return <AccountCard account={account} />
```

where `account` also contains:

```text
passwordHash
internalNotes
fraudScore
billingProviderCustomerId
adminFlags
```

Even if the Client Component ignores those fields, values sent across the boundary may become observable in the client transport/runtime.

Create a public view model:

```ts
type AccountCardData = {
  id: string
  displayName: string
  avatarUrl: string | null
}
```

and send only what the browser needs.

## Boundary DTO pattern

Server mapping:

```ts
function toPublicProject(project: ProjectRecord) {
  return {
    id: project.id,
    name: project.name,
    status: project.status,
  }
}
```

Use it at the boundary:

```tsx
<ProjectActions project={toPublicProject(project)} />
```

This makes client exposure auditable.

## Passing promises for streaming client consumption

Current React/Next.js patterns can pass a Promise from the server into a Client Component and resolve it with React's `use()` API.

Server:

```tsx
import { Suspense } from 'react'
import UserPanel from './user-panel'

export default function Page() {
  const userPromise = getUser()

  return (
    <Suspense fallback={<p>Loading user…</p>}>
      <UserPanel userPromise={userPromise} />
    </Suspense>
  )
}
```

Client:

```tsx
'use client'

import { use } from 'react'

export default function UserPanel({
  userPromise,
}: {
  userPromise: Promise<{ name: string }>
}) {
  const user = use(userPromise)

  return <p>{user.name}</p>
}
```

This can let server-side work start early while a Client Component consumes the result.

Use it deliberately; the data-fetching and streaming phases will cover when this pattern is preferable to awaiting on the server.

## Server elements as named slots

`children` is not the only option.

```tsx
'use client'

export function DashboardFrame({
  navigation,
  content,
}: {
  navigation: React.ReactNode
  content: React.ReactNode
}) {
  return (
    <div className="dashboard">
      <aside>{navigation}</aside>
      <main>{content}</main>
    </div>
  )
}
```

Server composer:

```tsx
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardFrame
      navigation={<ServerNavigation />}
      content={children}
    />
  )
}
```

The Client Component owns client interaction/layout behavior while the server can own the rendered content slots.

## Do not turn every slot into a client boundary

If `DashboardFrame` does not need state, events, browser APIs, or client hooks, it should probably remain a Server Component.

A Client Component wrapper should have a reason.

Ask:

```text
What browser capability does this wrapper own?
```

If the answer is “none,” remove the boundary.

## Data ownership example

Suppose a product page has:

```text
product details
reviews
cart button
recommendations
```

A strong composition:

```text
Server ProductPage
├── Server ProductDetails
├── Client AddToCart
├── Server Reviews
└── Server Recommendations
```

The browser receives interactive code only for `AddToCart`, while the server can directly fetch/render the other data.

## Bad pattern: callback plumbing from server

You may be tempted to create:

```tsx
<ClientTable
  rows={rows}
  onDelete={(id) => deleteRow(id)}
/>
```

from a Server Component.

Instead, choose an actual mutation architecture:

- Server Function
- Route Handler/API request
- client-local interaction that does not mutate server state

Do not smuggle arbitrary server callbacks through the boundary.

## Bad pattern: duplicating the same data on both sides

```text
Server fetches user
  ↓
Client receives user
  ↓
Client immediately fetches /api/user again
```

That may be justified for live revalidation, but it should not happen accidentally.

Define ownership:

```text
initial server state
client revalidation policy
mutation invalidation policy
```

Later phases cover those mechanics in depth.

## Hydration mismatch and serializable state

Even serializable props can cause hydration issues if the Client Component renders nondeterministically.

Problem:

```tsx
'use client'

export function Greeting() {
  return <p>{new Date().toLocaleTimeString()}</p>
}
```

The prerendered server time and browser render time may differ.

Boundary correctness includes both:

```text
serializable transport
+
deterministic initial render
```

## Server-to-client data minimization

For each prop ask:

- Does the client truly need this field?
- Can the server render this instead?
- Is the data sensitive?
- Is the object large?
- Is this value stable enough for initial client state?
- Will the client immediately refetch it anyway?

This improves security and payload efficiency together.

## Debugging serialization errors

When a boundary fails:

1. Find the Server Component creating the Client Component.
2. Inspect every prop crossing that edge.
3. Remove functions/class instances/opaque library objects.
4. Convert domain records into explicit public data.
5. Check whether a Promise/Server Function is being used according to its supported transport contract.
6. Run the production build.

## Architecture diagram

```text
SERVER MODULE GRAPH

page.tsx
├── getProduct()
├── ProductDetails
├── Reviews
└── creates <InteractivePanel data={publicData}>
                           │
                           │ serialized RSC boundary
                           ▼
CLIENT MODULE GRAPH

interactive-panel.tsx ('use client')
├── useState
├── browser events
└── client-only dependencies

Server-rendered ReactNode slots may be passed into the client shell
without importing their server implementation into the client graph.
```

## Interview questions

**Can a Client Component visually contain a Server Component?**  
Yes, when a Server Component higher in the tree creates the server element and passes it as `children` or another ReactNode prop into the Client Component.

**Can a Client Component directly import arbitrary Server Component implementation?**  
That breaks the intended module-graph model. Compose server elements from a Server Component and pass them into the client shell.

**Are Client Component props limited to JSON?**  
The formal rule is that they must be serializable by React's server/client transport. In application design, prefer explicit minimal data contracts.

**Why is serialization also security-relevant?**  
Anything sent to the browser should be considered client-visible. Avoid passing sensitive or unnecessary server record fields.

**Can a normal server callback be passed to a Client Component?**  
No. Arbitrary function closures are not normal serializable props. Server Functions are a separate supported mechanism.

## Exercise

Build a cart modal where:

- `Modal` is a Client Component with open/close state
- `Cart` is a Server Component
- `Page` composes `<Modal><Cart /></Modal>`
- cart line items are rendered on the server
- only minimal product IDs/prices needed for client interaction cross the boundary
- no database model instance or server callback is passed to the client

Then draw the server module graph, client module graph, and the props/ReactNode values crossing between them.
