---
title: Server Components and Client Boundaries
description: Understand React Server Components, client boundaries, async components, serializable props, bundle impact, and how RSC differs from SSR.
sidebar_position: 1
---

# Server Components and client boundaries

React Server Components (RSC) change **where component code executes**.

They are not simply another name for server-side rendering.

That distinction is the most important thing to learn first.

## Mental model

```text
Traditional client component
component code is shipped to browser
runs in browser
can use state/effects/browser APIs

Server Component
component executes in server environment
its implementation is not shipped for client execution
can access server resources directly
cannot use client-only interactivity APIs
```

## RSC vs SSR

These solve different problems.

```text
SSR asks:
How do we generate HTML before the browser renders the app?

RSC asks:
Which component code executes on the server vs client?
```

A framework may combine them:

```text
Server Components render server payload
   ↓
Client Components are referenced at boundaries
   ↓
SSR turns initial result into HTML
   ↓
stream HTML with Suspense
   ↓
hydrate Client Components in browser
```

Do not collapse these into one concept.

## Server Components are a framework/bundler feature

React 19 treats the Server Component model as stable for application use, but the lower-level implementation APIs used by RSC frameworks/bundlers are not ordinary semver-stable application APIs.

A normal Vite client application does not become an RSC application just by importing a React API.

You need infrastructure that understands:

- server/client module graphs;
- server component payloads;
- client references;
- serialization;
- server functions;
- routing/data integration;
- bundling boundaries.

In practice, use an RSC-capable framework rather than trying to invent this stack inside a normal SPA build.

## There is no `'use server'` directive for Server Components

This is a common misunderstanding.

A component is not made into a Server Component by writing:

```js
'use server';
```

`'use server'` marks **Server Functions**.

Server Components are server-rendered by the RSC environment by default unless they cross into a client module boundary.

## `'use client'` creates a module boundary

```jsx
'use client';

import { useState } from 'react';

export default function Expandable({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <section>
      <button onClick={() => setOpen(v => !v)}>
        Toggle
      </button>
      {open && children}
    </section>
  );
}
```

When a module is marked `'use client'`, its client dependency subgraph becomes client-evaluated code.

This is a **module dependency boundary**, not merely a render-tree annotation.

## Server Component example

```jsx
import Expandable from './Expandable';
import { db } from './db';

export default async function NotesPage() {
  const notes = await db.notes.getAll();

  return (
    <main>
      {notes.map(note => (
        <Expandable key={note.id}>
          <article>{note.body}</article>
        </Expandable>
      ))}
    </main>
  );
}
```

This component can directly access server-side data because it runs in the server environment.

The `Expandable` boundary provides browser interactivity.

## Async Server Components

Server Components can be async:

```jsx
export default async function Product({ id }) {
  const product = await db.products.get(id);

  return <h1>{product.name}</h1>;
}
```

This is fundamentally different from async Client Components, which are not the normal client rendering model.

Server Components can `await` during rendering because the RSC server environment coordinates that work.

## Server-only dependencies stay off the client bundle

A Server Component may import heavy server-only packages:

```jsx
import marked from 'marked';
import sanitizeHtml from 'sanitize-html';

export default async function Article({ source }) {
  const html = sanitizeHtml(marked.parse(source));
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

If this remains server-only, the browser does not need the markdown parser or sanitizer implementation just to display the rendered output.

This can reduce client JavaScript.

## Server Components can access server resources directly

Depending on the framework/environment, Server Components can read:

- databases;
- files;
- server-only SDKs;
- internal services;
- secrets used only on the server.

But do not confuse "server access" with "safe by default."

You still need:

- authorization;
- input validation;
- secret handling;
- cache boundaries;
- tenant isolation.

## Client Components are for interactivity

You need a Client Component when code requires things such as:

- `useState`;
- `useEffect`;
- event handlers;
- browser APIs;
- DOM refs;
- client-side subscriptions.

Do not mark a whole page `'use client'` just because one button needs state.

Prefer narrow interactive islands/boundaries.

## Boundary placement matters

Bad shape:

```text
'use client' at page root
   ↓
large dependency tree becomes client code
```

Better shape:

```text
Server page
├── static/server-rendered content
├── server data access
└── small Client Component
    └── interactive widget
```

The goal is not "zero client components."

The goal is to send client JavaScript only where the browser needs to execute it.

## Client boundary is about imports

A subtle but important rule:

> `'use client'` marks a boundary in the module dependency graph.

If a client module imports another module, that imported code may also need to be client-evaluable.

Therefore:

```text
client component imports utility
utility imports server-only database SDK
```

is an architectural problem.

Keep server-only and client-compatible modules separated deliberately.

## Server JSX can be passed into Client Components

A Client Component can receive already-rendered Server Component output as props such as `children`.

Example:

```jsx
// Server Component
export default function Page() {
  return (
    <InteractivePanel>
      <ServerRenderedReport />
    </InteractivePanel>
  );
}
```

The Client Component does not need to directly import and execute `ServerRenderedReport` in the browser.

The server can render that subtree and pass its result through the boundary.

This allows composition without forcing everything below an interactive wrapper into client execution.

## Serializable props across the boundary

Values passed from server-rendered code into Client Components must fit the supported serialization model.

Common supported values include:

- strings;
- numbers;
- booleans;
- `null`/`undefined`;
- arrays and supported iterables;
- plain serializable objects;
- Dates;
- supported typed data;
- Promises;
- React elements;
- Server Functions.

Do not pass arbitrary class instances or ordinary server closures to the browser boundary.

Wrong idea:

```jsx
<ClientPanel databaseConnection={db} />
```

A database connection is not client data.

Pass the data the client actually needs.

## Functions across boundaries

Ordinary functions cannot simply cross from server code into client code as executable closures.

The special exception is a **Server Function reference**, which the framework serializes as a callable server reference.

That is covered in the next chapter.

## Promise handoff

A Server Component can start async work and pass a Promise to a Client Component, where `use` can suspend on it.

Conceptual example:

```jsx
// Server Component
export default async function Page({ id }) {
  const product = await getProduct(id);
  const reviewsPromise = getReviews(id);

  return (
    <>
      <ProductDetails product={product} />
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews reviewsPromise={reviewsPromise} />
      </Suspense>
    </>
  );
}
```

```jsx
'use client';

import { use } from 'react';

export default function Reviews({ reviewsPromise }) {
  const reviews = use(reviewsPromise);
  return reviews.map(review => <p key={review.id}>{review.text}</p>);
}
```

The server starts the work early, and the client boundary can coordinate with Suspense.

## RSC does not eliminate APIs

A Server Component can fetch data directly without exposing a public browser API endpoint for that specific read path.

But real systems may still need APIs for:

- mobile clients;
- third-party integrations;
- webhooks;
- public SDKs;
- non-React consumers;
- background jobs.

RSC is an application rendering/data architecture, not a universal replacement for APIs.

## RSC does not eliminate client state

Client state still matters for:

- menus;
- drafts;
- drag interactions;
- optimistic UI;
- media state;
- browser-only preferences;
- local transient workflows.

Server Components reduce unnecessary client execution; they do not remove interactive UI requirements.

## RSC does not automatically make apps fast

You can still create:

- server waterfalls;
- slow database queries;
- oversized Client Component bundles;
- excessive serialization;
- cache misses;
- blocking server computations;
- poor Suspense boundaries.

Performance still requires architecture and measurement.

## Server Component data freshness

Server rendering frequency depends on framework policy.

A Server Component might run:

- at build time;
- per request;
- after revalidation;
- as part of a cached route;
- during navigation.

React provides the component model; the framework decides routing/cache/revalidation policy.

Do not assume "Server Component" means "runs on every request."

## RSC security boundary

Never pass secrets into Client Component props.

Example bad design:

```jsx
<ClientPanel apiSecret={process.env.SECRET_KEY} />
```

Anything crossing the client boundary should be considered browser-visible.

The same principle applies to error details, internal IDs, privileged data, and server-only objects.

## Testing strategy

Test Server Components at the level supported by the framework/runtime.

Useful layers include:

- pure server helper unit tests;
- data-access tests;
- Server Component render/integration tests;
- Client Component interaction tests;
- end-to-end route tests.

Avoid forcing an RSC tree into a client-only test harness that cannot model server/client module boundaries correctly.

## Common mistakes

### Mistake: `'use server'` means Server Component

It does not. It marks Server Functions.

### Mistake: put `'use client'` at every file that uses a Client Component somewhere below

Only establish the boundary where client execution actually begins.

### Mistake: pass arbitrary server objects through props

Boundary values must be serializable and safe for client exposure.

### Mistake: import server-only code from a client module

The client dependency graph must remain browser-compatible.

### Mistake: assume RSC and SSR are the same

RSC controls execution/bundling boundaries; SSR controls HTML generation.

### Mistake: use Client Components for all data fetching out of habit

Server Components can often read server data directly and reduce client orchestration.

## Architecture checklist

For each component, ask:

```text
Does it need browser state/effects/events/refs?
Yes → Client Component boundary needed

Does it only render server data/content?
Prefer Server Component

Does it import a client-only dependency?
It may enter the client module graph

Does a prop cross server → client?
Ensure serializable + safe for browser exposure
```

## Exercise

Design a product page with:

- server-rendered product details;
- direct database read on the server;
- interactive quantity selector as a Client Component;
- reviews started on the server and consumed with `use` under Suspense;
- no database SDK shipped to the browser.

Draw both:

1. the render tree;
2. the module dependency tree.

Explain why they are not the same.

## Interview questions

**Junior:** What is a Server Component?

**Mid-level:** What does `'use client'` actually mark?

**Senior:** Explain the difference between RSC and SSR, how module boundaries affect bundle size, and how Server Component output can be composed through Client Components without making the entire subtree client-executed.

## Summary

```text
RSC decides where component code executes
SSR decides how HTML is produced
'use client' marks a client module boundary
there is no directive that marks Server Components
keep client boundaries narrow and serializable
```

## References

- https://react.dev/reference/rsc/server-components
- https://react.dev/reference/rsc/use-client
- https://react.dev/reference/rsc/directives
- https://react.dev/reference/react/use
