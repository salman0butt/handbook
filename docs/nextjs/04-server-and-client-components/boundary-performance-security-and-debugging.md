---
title: Boundary Performance, Security & Debugging
description: Measure client boundary cost, diagnose hydration and environment failures, and review server-client boundaries for production safety.
---

# Boundary Performance, Security & Debugging

Server/Client Component architecture is not complete when the code compiles.

A production boundary should also be reviewed for:

- browser JavaScript cost
- hydration work
- server latency
- payload size
- sensitive data exposure
- authorization correctness
- dependency placement
- deterministic rendering
- failure diagnosis

## Performance has multiple budgets

A Server Component can reduce client JavaScript while increasing server work.

A Client Component can improve interaction ownership while increasing browser cost.

Measure both sides:

```text
SERVER
├── render duration
├── data latency
├── RSC payload size
└── cache effectiveness

BROWSER
├── JS bytes
├── parse/execute cost
├── hydration work
├── interaction latency
└── route transition cost
```

Do not optimise one column while ignoring the other.

## Client boundary cost model

When you add `'use client'`, ask what enters the client graph:

```text
interactive component
+
its imports
+
third-party libraries
+
client helpers
+
provider dependencies
```

The cost is not the line containing the directive. The cost is the graph reachable from that boundary.

## Measure before moving everything server-side

Suppose a dashboard feels slow.

Possible bottlenecks:

```text
slow database
large RSC payload
large chart library
broad hydration
expensive client render
sequential data fetches
no useful loading boundary
```

“Use more Server Components” is not a diagnosis.

Find the stage first.

## Narrow boundaries around real interaction

Bad:

```text
'use client' Dashboard
├── server-readable title
├── navigation
├── static cards
├── table
├── filters
└── one dropdown
```

Better:

```text
Server Dashboard
├── Server title
├── Server navigation
├── Server cards
├── Server table
└── Client Filters
    └── Client Dropdown
```

But do not fragment every button into its own artificial boundary if one cohesive interactive widget owns the state.

## Hydration scope

Hydration work belongs to Client Components.

Large client trees can increase:

- JavaScript download
- parse/execute work
- hydration duration
- main-thread contention

Server-rendered markup alone is not free either, but it does not require the Server Component implementation to execute in the browser.

## Hydration mismatch taxonomy

### Time/randomness

```tsx
'use client'

export function Clock() {
  return <span>{Date.now()}</span>
}
```

Server prerender and browser render may disagree.

### Browser API in initial render

```tsx
return <span>{window.innerWidth}</span>
```

Unsafe for server prerender.

### Locale/environment difference

Server locale/time zone differs from browser.

### Invalid HTML

Browser reparses markup differently from React's expected tree.

### External DOM mutation

Browser extension or third-party script changes markup before hydration.

Debug the source of divergence rather than suppressing the warning globally.

## Safe browser-only initialization

Use stable initial markup:

```tsx
'use client'

import { useEffect, useState } from 'react'

export function ClientPreference() {
  const [value, setValue] = useState<string | null>(null)

  useEffect(() => {
    setValue(localStorage.getItem('preference'))
  }, [])

  return <span>{value ?? 'Loading preference…'}</span>
}
```

Or choose server-readable state when the value affects initial rendering materially.

## Security boundary review

There are at least four different trust questions:

```text
1. Can this module execute in the browser?
2. What data is sent to the browser?
3. What user input reaches the server?
4. Who is authorized to perform the operation?
```

Do not collapse them into one concept.

`server-only` helps question 1.

DTO minimisation helps question 2.

validation helps question 3.

authorization helps question 4.

## Secrets and serialized props

A server module may safely read:

```ts
process.env.PRIVATE_KEY
```

but if it returns an object containing sensitive provider data and that object is passed to a Client Component, the exposure problem has moved rather than disappeared.

Audit both imports and outputs.

## Client props are untrusted on later requests

Suppose the server renders:

```tsx
<DeleteProjectButton projectId="p_42" canDelete={true} />
```

The browser can modify requests, replay operations, or call server endpoints independently of the rendered UI.

`canDelete` is presentation state.

The server mutation must verify:

```text
current user
project scope
permission
request validity
```

again.

## Boundary observability

Useful production signals:

### Server

- route render timing
- database timing
- service calls
- authorization failures
- RSC/server errors

### Browser

- hydration errors
- JS exceptions
- interaction latency
- route transition timing
- chunk loading failures

Correlate both sides where possible.

A user-visible failure may begin on the server but surface during client navigation.

## Debugging `window is not defined`

Checklist:

1. Find the import path to the browser-only code.
2. Determine whether failure happens at module evaluation or render.
3. Put browser dependency behind `'use client'`.
4. If initial prerender still fails, move browser access into an effect.
5. If the package is fundamentally browser-only, consider client-only dynamic loading.
6. Avoid disabling SSR for unrelated parent UI.

## Debugging hook errors

Symptom:

```text
useState/useEffect can only be used in a Client Component
```

Ask:

- Does this component truly need client capability?
- Is the hook actually needed?
- Can only a smaller child become client-side?
- Is a third-party package missing its client directive?

Do not automatically put `'use client'` at the page root.

## Debugging non-serializable props

Find the server-to-client edge and inspect:

```text
functions
class instances
library handles
request/response objects
large database models
opaque SDK objects
```

Convert to a minimal transport-friendly contract.

## Debugging unexpected client bundle growth

Symptoms:

- route JS increases sharply
- hydration slower after innocuous refactor
- a server library appears in bundle analysis

Check:

1. Was `'use client'` moved upward?
2. Did an interactive component import a large barrel file?
3. Did a global provider gain a heavy dependency?
4. Was a lazy-loaded feature imported eagerly?
5. Did a component library mark too broad an entry point client-side?

## Debugging server work on client navigation

Remember App Router navigation can request a new RSC payload.

A route transition may feel slow because of:

```text
server fetch latency
uncached server work
network latency
large payload
client rendering
```

Use browser Network timing plus server logs.

Do not assume slow navigation means “React rendering is slow.”

## Production build as boundary validation

Run:

```bash
npm run build
```

A production build can expose:

- invalid server/client imports
- bad static assumptions
- non-supported environment usage
- route rendering failures
- malformed document/sidebars in this handbook project

Treat build failures as architectural feedback.

## Bundle review workflow

For a meaningful client-boundary change:

```text
baseline
  ↓
measure route/client JS
  ↓
move boundary or dependency
  ↓
rebuild
  ↓
measure again
```

Avoid performance claims based solely on source-code appearance.

## Security review workflow

For each Client Component receiving server data:

- list every prop
- classify sensitivity
- remove fields the browser does not need
- validate that permissions are enforced elsewhere
- inspect programmatic destinations/IDs as untrusted inputs
- verify secrets never appear in client config

## Senior review scenario

**Scenario:** A team marks the root layout `'use client'` because it needs theme context, auth context, analytics, and a modal provider.

A stronger design review asks:

1. Which providers truly need global scope?
2. Can the root layout remain server-side?
3. Can providers be wrapped in a small client entry component?
4. Can dashboard-specific providers move under `/dashboard`?
5. Does auth context duplicate authoritative server session logic?
6. What client dependencies are now global?
7. How much route JS/hydration did the change add?

The goal is not to eliminate providers. It is to place them according to ownership.

## Senior review scenario: secret-bearing data helper

**Scenario:** A shared `api.ts` module reads `process.env.INTERNAL_TOKEN`, exports public formatters, and is imported from both server and client code.

Fix the architecture:

```text
shared/formatting.ts
server/internal-api.ts + server-only
client/browser-api.ts if needed
```

Do not keep a mixed-environment barrel merely for import convenience.

## Review checklist

### Boundary necessity

- [ ] Every `'use client'` entry has a browser/interactivity reason.
- [ ] Parent server rendering is preserved where useful.
- [ ] provider scope is intentional.

### Performance

- [ ] client JS measured before/after major boundary changes.
- [ ] heavy client libraries lazy-load where justified.
- [ ] server latency is measured separately.
- [ ] hydration cost is not confused with server render cost.

### Security

- [ ] secret-bearing modules are server-only.
- [ ] client props contain only required fields.
- [ ] client visibility is not authorization.
- [ ] server operations revalidate identity and permission.

### Reliability

- [ ] initial full load works.
- [ ] client navigation works.
- [ ] hydration is deterministic.
- [ ] browser-only dependencies are isolated.
- [ ] production build passes.

## Interview questions

**What is the performance cost of `'use client'`?**  
The reachable client module graph may add browser JavaScript, parse/execute work, and hydration. Measure the graph, not just the component file.

**Can Server Components still be slow?**  
Yes. Server I/O, computation, caching strategy, and network delivery can dominate route latency.

**Why is prop minimisation a security measure?**  
Values sent across the server/client boundary should be considered browser-visible.

**What is the first thing to do with a hydration mismatch?**  
Identify why the server-produced markup and browser's initial React render differ. Do not hide the warning first.

**How do you diagnose slow App Router navigation?**  
Decompose server response time, RSC payload/network, client bundle/chunks, hydration/rendering, and loading feedback rather than blaming one layer.

## Exercise

Profile a route with:

- one broad Client Component page
- a chart package
- a provider
- server-fetched table data

Refactor into server-first composition, then record:

```text
client JS before/after
server route time before/after
interaction timing
which props cross the boundary
which modules are server-only
```

Explain the trade-off rather than declaring the refactor faster without measurements.
