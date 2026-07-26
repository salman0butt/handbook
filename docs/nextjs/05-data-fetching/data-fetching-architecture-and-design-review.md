---
title: Data Fetching Architecture & Design Review
description: Review App Router data ownership, dependency graphs, browser/server boundaries, performance, reliability, and security as one production system.
---

# Data Fetching Architecture & Design Review

Senior Next.js data work is less about knowing one fetching API and more about designing a coherent dependency system.

A useful review starts with:

```text
public URL / request
  ↓
identity + request context
  ↓
server data dependencies
  ↓
rendering boundaries
  ↓
serialized client data
  ↓
client-owned live state
```

## Start with data ownership

For every value, classify it:

| Data | Typical owner |
| --- | --- |
| authenticated account | server/request context |
| project record | server data layer |
| URL filter | URL state |
| modal open/closed | client UI state or route state |
| live presence | often client/live remote state |
| feature flag | server or client depending on exposure/use |
| payment secret | server only |

If you cannot name the owner, duplicated state/fetching is likely.

## Architecture pattern: server-first page

```text
page.tsx (Server)
├── auth/session
├── project query
├── server-rendered summary
├── Suspense: activity
│   └── activity query
└── ClientFilters
    └── URL/browser interaction only
```

This keeps secure data and heavy reads on the server while leaving interaction where it belongs.

## Architecture pattern: initial server snapshot + live client data

```text
Server page
  ↓ initial snapshot
Client LiveWidget
  ↓ polling/SSE/WebSocket/client query cache
```

Use for operational status, live dashboards, presence, or rapidly changing data.

Define:

- initial freshness
- live update ownership
- reconnect behavior
- conflict behavior
- browser cache policy
- authorization on every server endpoint

## Architecture pattern: service aggregation

```text
Server route tree
├── account service
├── billing service
├── permissions service
└── database
      ↓
UI-specific server model
```

Avoid adding a local Route Handler hop unless an HTTP consumer actually needs it.

## Dependency graph review

Draw dependencies before optimizing:

```text
session
  ├→ organisation
  │    ├→ projects
  │    └→ billing
  └→ preferences

public catalogue ─────────→ recommendations
```

Then mark:

- real dependency edges
- independent work
- critical UI
- streamable UI
- cache candidates
- failure domains

## Critical path review

Example:

```text
session 80ms
  ↓
organisation 100ms
  ├→ projects 350ms
  └→ billing 700ms
```

If billing is optional sidebar content, putting the whole page behind it creates a 880ms critical path unnecessarily.

A stronger design might stream billing separately.

## Query count budget

For data-heavy pages, track more than response time:

```text
SQL query count
remote request count
bytes selected
RSC payload size
client JSON/cache size
connection pool wait
timeout/retry count
```

A page can look fast in development with one user and fail under concurrent production load.

## Avoid “API everywhere” architecture

Weak rule:

> Every frontend data read must go through `/api/*`.

Better rule:

> Use HTTP where there is an HTTP boundary; use direct server functions for server-internal reads.

This produces clearer ownership and fewer layers.

## Avoid “Server Components everywhere” architecture

Some data is genuinely browser-owned:

- live presence
- local hardware/browser capability
- high-frequency interactive refresh
- offline-first workflows

Use the environment that matches the product lifecycle.

## Avoid “client cache everywhere” architecture

A client query library is useful when the browser owns remote state.

It does not mean every server-rendered record should be copied into the client cache.

Ask what user interaction requires ongoing client ownership.

## Data access layer boundaries

A practical split:

```text
server/
  auth/
  projects/
    queries.ts
    permissions.ts
    dto.ts
  billing/
    client.ts
    queries.ts
features/
  projects/
    components...
app/
  projects/[projectId]/page.tsx
```

Goals:

- server-only imports stay isolated
- authorization can be reviewed
- queries are reusable
- client DTOs are deliberate
- route files remain composition-focused

## Do not over-abstract early

Bad abstraction:

```ts
repository.execute('Project', 'find', options)
```

just to avoid using your ORM directly.

Useful abstraction appears when there is a real boundary:

- tenant scoping
- authorization
- external service normalization
- data projection
- observability
- provider portability requirement

Keep the data layer understandable.

## Error ownership matrix

| Dependency | Failure policy |
| --- | --- |
| authentication | block protected page |
| project query | not-found or error based on cause |
| permissions | fail closed |
| recommendations | optional fallback |
| analytics widget | optional/error-isolated |
| payment status | product-critical; explicit degraded state |

Do not let a generic `Promise.all` decide product failure semantics accidentally.

## Security review

For every server read:

```text
input validated?
identity resolved?
tenant/resource scoped?
fields minimized?
secret-bearing module server-only?
client serialization audited?
logs redacted?
```

For every client read:

```text
endpoint authenticates?
endpoint authorizes?
input validated?
response minimized?
rate abuse considered?
client cache treated as untrusted?
```

## Performance review

Measure:

```text
request → first useful shell
request → critical content
request → complete stream
server dependency durations
query count
browser client JS
client refetch count
```

Then optimize the longest real stage.

## Freshness review

Before Phase 6 cache implementation, write the product requirement:

```text
project name: tolerate 30s stale?
stock quantity: must be near-real-time?
public article: can cache for hours?
permission: request-sensitive?
invoice balance: authoritative on open?
```

Caching is easier when freshness is specified before choosing APIs.

## Data ownership decision tree

```text
Needed for initial server-rendered UI?
├─ yes → Server Component/server data layer
│        ↓
│   private database/service?
│   ├─ yes → direct server access
│   └─ HTTP upstream → server fetch/SDK
│
└─ no → Does browser own ongoing lifecycle?
         ├─ yes → client fetching/cache/live transport
         └─ maybe → keep server-first until requirement justifies client ownership
```

## Senior scenario: migrated SPA

A React SPA has:

```text
root QueryClient
20 useQuery calls
/api wrappers for every database entity
Redux copy of current user
client permission flags
```

A Next.js migration should not mechanically reproduce all layers.

Review each query:

1. Is it needed during initial render?
2. Is it private/server-readable?
3. Does it need live browser revalidation?
4. Is URL state enough for interaction?
5. Does the `/api` endpoint serve anything besides the same app?
6. Can identity/permissions remain server-owned?
7. Which query cache entries are still valuable client-side?

The answer will be mixed, not “delete all Query” or “keep everything client-side.”

## Senior scenario: slow dashboard

Symptoms:

```text
TTFB high
client bundle normal
six backend services
several widgets optional
```

Do not first rewrite widgets as Client Components.

Investigate:

- service dependency graph
- sequential awaits
- optional content blocking
- repeated reads
- database N+1
- upstream tail latency
- cache opportunities
- streaming boundaries

## Senior scenario: duplicate project reads

Three Server Components call:

```ts
getProject(projectId)
```

If it is an ORM function and executes three times:

- wrap request-scoped read with React `cache`
- make authorization scope part of the function contract
- verify with tracing
- do not introduce a module-global user-data map

## Senior scenario: live operational table

Requirements:

- initial rows should render quickly
- values update every few seconds
- filters are shareable

Architecture:

```text
URL search params → filter contract
Server Component → initial authorized rows
Client table island → live revalidation
server endpoint → re-authorize each live request
```

Avoid putting filters only in local state if shareability/back-navigation matters.

## Design review checklist

### Ownership

- [ ] Every data source has a named owner.
- [ ] Server data is not duplicated into client state without a reason.
- [ ] URL state is not mirrored ambiguously into local state.

### Boundaries

- [ ] Database access stays server-only.
- [ ] Internal reads do not add HTTP hops without consumers.
- [ ] Client props are minimal DTOs.
- [ ] Browser-live data has an explicit endpoint/transport contract.

### Dependencies

- [ ] Independent work starts in parallel.
- [ ] Real sequential dependencies are documented.
- [ ] N+1 patterns are checked.
- [ ] Fan-out respects pools/rate limits.

### Delivery

- [ ] Critical content is identified.
- [ ] Optional slow content can stream/degrade where appropriate.
- [ ] Fallbacks preserve useful layout.

### Security

- [ ] Params/search params validated.
- [ ] Authorization enforced server-side.
- [ ] Multi-tenant reads are scoped.
- [ ] Secrets never cross into client code.
- [ ] logs/errors are redacted.

### Reliability

- [ ] Timeouts are intentional.
- [ ] Retries are bounded and semantically safe.
- [ ] Optional dependencies do not fail closed unless required.
- [ ] production behavior is tested separately from dev/HMR assumptions.

### Performance

- [ ] Route timeline is measured.
- [ ] Query/request counts are measured.
- [ ] Duplicate server reads are traced.
- [ ] Client refetch duplication is checked.
- [ ] Freshness requirements are ready for Phase 6.

## Phase 5 milestone project

Build a server-first project operations dashboard with:

```text
/dashboard/projects/[projectId]
```

Requirements:

- authenticated tenant-scoped project query
- server-rendered project summary
- parallel members + activity reads
- activity streamed behind Suspense
- request-scoped `cache` for repeated project/current-user reads
- no internal Route Handler hop for database reads
- one genuinely client-owned live status widget
- URL-driven activity filters
- minimal client DTOs
- upstream timeout/error policy
- structured timing logs
- production build validation

Deliver an architecture note containing:

```text
data ownership map
dependency graph
critical path
security boundaries
client/server DTO boundary
live-data contract
failure matrix
freshness requirements for Phase 6
```

## Interview questions

**How do you design data fetching in App Router?**  
Start from ownership and dependency graphs: server-owned initial data in Server Components/server modules, client-owned live data in browser caches, URL state for shareable navigation state, and HTTP only where a real HTTP boundary exists.

**What is the most common performance mistake?**  
Accidental waterfalls and unnecessary critical-path dependencies, often combined with N+1 or duplicate reads.

**What should be specified before choosing a cache API?**  
The data’s freshness, isolation, invalidation, and user/tenant scope requirements.

**What is a staff-level data review concerned with beyond API syntax?**  
Ownership, security, dependency structure, failure domains, observability, concurrency, cache semantics, browser/server boundaries, and operational scale.

## Official references

- Next.js App Router Fetching Data: https://nextjs.org/docs/app/getting-started/fetching-data
- Next.js `fetch`: https://nextjs.org/docs/app/api-reference/functions/fetch
- React `cache`: https://react.dev/reference/react/cache
- React `use`: https://react.dev/reference/react/use

Phase 6 builds on this architecture with the current Next.js caching, rendering, Cache Components, and revalidation model.