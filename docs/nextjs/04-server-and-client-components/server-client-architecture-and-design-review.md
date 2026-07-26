---
title: Server-Client Architecture & Design Review
description: Turn Server and Client Component mechanics into production architecture patterns, trade-offs, review questions, and milestone practice.
---

# Server-Client Architecture & Design Review

Server and Client Components are most useful when they clarify **ownership**.

A strong design answers:

```text
Where does this data live?
Where is trust established?
Which code needs the browser?
Which code should never reach the browser?
Which state is local, shared, URL-driven, or server-owned?
What must hydrate?
What can remain server-rendered?
```

This chapter closes Phase 4 by turning individual rules into an architecture method.

## Start from capabilities

For each component, classify its needs.

### Server capabilities

```text
database access
private credentials
request/session data
server filesystem/services
server-side authorization
large non-interactive rendering
```

### Client capabilities

```text
event handlers
stateful interaction
effects
browser APIs
client router hooks
DOM measurement
client subscriptions
```

Then place the boundary where the capability changes.

## Pattern 1: Server shell + interactive islands

```text
Server Product Page
├── Server Header
├── Server Product Details
├── Server Reviews
├── Client QuantityPicker
├── Client AddToCart
└── Server Recommendations
```

Use when most UI is content/data and only small pieces are interactive.

Benefits:

- smaller client graph
- server data access stays direct
- less hydration
- clear ownership

Trade-off:

- client islands need explicit props/contracts

## Pattern 2: Client shell with server content slots

```text
Server Page creates
<Client Modal>
  <Server Cart />
</Client Modal>
```

Use when the outer interaction is client-owned but inner content is server-rendered.

Examples:

- modal shell
- tabs with server-rendered panels
- resizable client layout around server content
- disclosure/accordion shell around server-rendered body

## Pattern 3: Server-started data + client consumption

```text
Server layout starts Promise
      ↓
Client provider receives Promise
      ↓
client component calls use()
```

Use when:

- data should start on the server early
- multiple client consumers need it
- Suspense is part of the UX

Do not use it merely to avoid passing normal props.

## Pattern 4: Feature-scoped providers

```text
Server Root Layout
├── global theme client provider
└── Server Dashboard Layout
    └── dashboard client provider
        ├── filters
        └── selection inspector
```

Keep client state scoped to the feature that owns it.

Avoid a single global provider tree containing unrelated feature state.

## Pattern 5: Server facade over privileged integrations

```text
Client Component
    ↓ mutation/API request
trusted server boundary
    ↓
server-only integration module
    ↓
private provider/database
```

The browser never receives privileged credentials.

The server facade owns validation, authorization, and integration details.

## Pattern 6: Browser-only adapter

```text
Server Page
└── Client MapShell
    └── lazy browser map library
```

Use when a package fundamentally needs DOM/browser execution.

Keep the browser-only adapter narrow and keep unrelated route content server-side.

## Decision tree

```text
Does this component need state/events/effects/browser APIs?
│
├── no → keep it Server Component by default
│
└── yes
    │
    ├── can only a child own that interaction?
    │   ├── yes → move 'use client' to child
    │   └── no  → make cohesive interactive boundary
    │
    └── does it import browser-only/heavy libraries?
        ├── yes → isolate/lazy-load where useful
        └── no  → normal Client Component
```

Then separately ask:

```text
Does this code need secrets/database/private services?
├── yes → server-only module
└── no  → shared/client depending on capabilities
```

## Data decision tree

```text
Who needs the data?
│
├── only Server Components
│   → keep data server-side
│
├── one Client Component
│   → pass minimal serializable props
│
├── many Client Components
│   → consider feature-scoped provider
│
└── browser needs live/revalidated state
    → define client data strategy explicitly
```

Later phases cover fetching/caching choices in depth.

## State taxonomy

Do not put all state into Client Context.

Classify it:

### Server state

```text
user record
project permissions
catalogue data
billing state
```

### URL state

```text
filters
pagination
selected tab when shareable
search query
```

### Client local state

```text
modal open
input draft
hover state
expanded row
```

### Client shared state

```text
dashboard selection
editor session UI
multi-panel coordination
```

Choose the owner before choosing the library.

## Architecture smell: root-level `'use client'`

Root layouts often contain:

- fonts
- metadata shell
- navigation
- providers
- static structure

If one provider forces the entire file to become a Client Component, use a wrapper instead.

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
```

Keep the document/layout server-owned unless client capability genuinely belongs there.

## Architecture smell: client fetch after server render

```text
Server page renders shell
      ↓
Client component mounts
      ↓
fetches data required for first meaningful content
```

If the server could have fetched that data directly, you may have created an unnecessary client waterfall.

There are valid client-fetching cases, but they should be intentional.

## Architecture smell: enormous serialized record

```tsx
<ClientDashboard organisation={organisationWithEverything} />
```

This creates:

- larger transport
- accidental sensitive exposure
- tight client/server coupling
- harder schema evolution

Create explicit public models.

## Architecture smell: shared barrel with mixed runtimes

```text
@/lib
├── db
├── cookies
├── local-storage
├── formatting
└── analytics-browser
```

One `index.ts` exports all of them.

Split server/client/shared entry points.

## Architecture smell: auth lives in Client Context

If the server trusts:

```ts
authContext.role
```

or data derived from browser state for authorization, the trust model is wrong.

Client state can reflect permissions for UX; server code decides permissions for operations/data access.

## Architecture smell: `ssr: false` everywhere

A migration team may disable SSR for components until the app “works.”

That often recreates a client SPA inside Next.js and hides boundary bugs.

Use client-only rendering only for components that truly cannot prerender.

## Large application folder strategy

Example:

```text
src/
├── app/
│   └── dashboard/
├── features/
│   ├── projects/
│   │   ├── server/
│   │   ├── client/
│   │   ├── components/
│   │   └── types.ts
│   └── billing/
├── lib/
│   ├── server/
│   ├── client/
│   └── shared/
└── components/
```

Do not copy the exact folders mechanically.

The principle is visible runtime ownership.

## Code review questions

For a new Client Component:

1. What capability requires `'use client'`?
2. Can the boundary move lower?
3. Which dependencies enter the client graph?
4. What data crosses from server?
5. Is any field sensitive/unnecessary?
6. Does this subtree need context?
7. Does the server still authorize operations?
8. Is initial render deterministic?
9. Does the feature need lazy loading?
10. Did bundle size change?

For a Server Component:

1. Does it directly access trusted server resources?
2. Is authorization enforced before sensitive reads?
3. Is server work parallelised/cached appropriately later?
4. Is it calling an internal Route Handler unnecessarily?
5. Does it pass only minimal data to client children?
6. Are sensitive modules marked server-only?

## Migration from client-heavy React

A safe migration approach:

```text
1. Keep existing interactive feature working.
2. Move route/page shell to Server Component.
3. Identify server-owned reads.
4. Move data reads server-side.
5. Keep existing interaction subtree client-side.
6. Split client boundary lower over time.
7. Introduce server-only modules.
8. Measure JS/hydration changes.
```

Do not attempt to rewrite every stateful component at once.

## Team conventions

Useful conventions might include:

- Server Components by default.
- `'use client'` requires a documented browser/interactivity reason.
- privileged modules import `server-only`.
- browser adapters import `client-only`.
- no mixed server/client barrel exports.
- database records are mapped to public client DTOs.
- providers are feature-scoped where possible.
- permission checks live at server trust boundaries.
- production build is mandatory in CI.

## Production failure scenario

**Symptom:** A deployment fails after a designer imports a formatting helper into a Client Component.

Root cause:

```text
formatting helper barrel
  → re-exports db helper
  → db helper imports server-only
```

Fix:

```text
shared/formatting
server/db
```

The build failure exposed an unhealthy package boundary.

## Senior interview scenario

**Scenario:** The team says “Server Components are faster, so we should eliminate all Client Components.”

A strong response:

- Server Components reduce browser JS for server-owned UI.
- Client Components are required for browser interactivity/state/effects.
- Server execution can still be slow due to I/O and compute.
- The goal is correct ownership, not maximum server percentage.
- Measure server latency, payload, client JS, hydration, and interaction together.

## Senior interview scenario: global provider

**Scenario:** A SaaS app has one global provider containing current user, organisation, feature flags, open modal, selected rows, filters, and editor state.

A strong redesign separates:

```text
server identity/permissions
URL filters
feature-scoped selection state
local modal state
editor-specific provider
minimal client user presentation data
```

This improves trust boundaries, history behavior, rerender scope, and ownership.

## Milestone project: Server-first SaaS dashboard

Build:

```text
/dashboard
├── server layout
├── server user/organisation authorization
├── server KPI cards
├── server recent activity
├── client date-range filter using URL state
├── client chart wrapper
├── dashboard-only selection provider
└── server-rendered detail panel passed into a client modal shell
```

Requirements:

### Boundaries

- no root-level `'use client'`
- every client boundary has a documented reason
- no server database module enters client graph

### Data

- server reads do not make internal HTTP hops unnecessarily
- public DTOs cross to client
- sensitive fields stay server-side

### Security

- route params/query input validated
- organisation membership checked server-side
- client context not trusted for permissions

### Performance

- heavy chart library lazy-loaded if measurements justify it
- client JS before/after recorded
- server render/data timings recorded

### Reliability

- full reload works
- client navigation works
- hydration produces no warnings
- CI production build passes

## Phase 4 completion questions

You should now be able to answer:

1. Why are App Router pages Server Components by default?
2. What exactly does `'use client'` declare?
3. Why can a Client Component still be prerendered to HTML?
4. How can server-rendered children appear inside a Client Component?
5. What values may cross the boundary?
6. Why are DTOs a security tool?
7. Where should context providers live?
8. How do `server-only` and `client-only` prevent environment mistakes?
9. How do you isolate a DOM-dependent third-party package?
10. How do you measure whether a boundary is good?

If those answers are clear, the next phase—Data Fetching—has the right foundation.
