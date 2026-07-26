---
title: Capstone — SaaS Architecture and Platform Engineering
description: A staff-oriented React capstone covering domain boundaries, state architecture, server/client separation, design systems, performance budgets, observability, migration, and team ownership.
sidebar_position: 4
---

# Capstone — SaaS architecture and platform engineering

This is the final project in the React handbook. It is less about building one feature and more about designing a React product that multiple teams can evolve safely.

## Scenario

You are designing a multi-tenant B2B SaaS product with:

- authentication;
- organization/workspace switching;
- role-based permissions;
- dashboard analytics;
- large data tables;
- editable workflows;
- notifications;
- billing/settings;
- a shared design system;
- live updates;
- SSR/RSC-capable infrastructure;
- several frontend teams shipping independently.

The assignment is to create an architecture proposal and a thin working vertical slice that proves the design.

## What the capstone must demonstrate

A strong solution explains:

- domain boundaries;
- state ownership;
- data-fetching ownership;
- mutation boundaries;
- Server vs Client Component choices;
- shared UI contracts;
- error/loading boundaries;
- accessibility standards;
- performance budgets;
- testing strategy;
- observability;
- security/trust boundaries;
- ownership and migration strategy.

## Domain map

Start with domains, not folders.

Example:

```text
App shell
├── identity
├── workspace
├── dashboard
├── operations
├── notifications
├── billing
└── settings
```

Each domain should own:

- feature-specific components;
- local state;
- domain types;
- data adapters;
- mutation logic;
- tests;
- public exports.

Avoid allowing every feature to import every internal file from every other feature.

## Public module contracts

Prefer a controlled API:

```ts
// features/operations/index.ts
export { OperationsPage } from './ui/OperationsPage';
export { useOperationsFilters } from './model/useOperationsFilters';
export type { OperationSummary } from './model/types';
```

rather than deep imports into internals.

This keeps dependency direction visible.

## State architecture matrix

Create an explicit ownership matrix.

| Category | Example | Owner |
| --- | --- | --- |
| Local UI | dropdown open state | component |
| Feature state | selected operation | feature boundary |
| URL state | filters/page/sort | router/URL |
| Server state | records/permissions | server/data layer |
| External state | live connection | external store |
| App shell state | theme/workspace identity | narrow Context/provider |
| Derived state | visible totals | render calculation |

Do not create a global store merely because the application is large.

Large applications benefit from **clear ownership**, not maximum centralization.

## Multi-tenant security boundary

Every server request and mutation must be scoped to the active tenant/workspace.

The client may submit:

```ts
{ workspaceId: 'workspace-a' }
```

but the server must still determine whether the authenticated user can access that workspace.

Never let UI hiding become authorization.

## Permission modeling

Avoid scattering string checks throughout the tree:

```tsx
if (user.role === 'admin') { ... }
```

Prefer a domain permission model:

```ts
can(currentUser, 'operation:update', operation)
```

The frontend model improves consistency, but the server remains authoritative.

## Server/Client architecture

If using Server Components, default to server execution for server-owned read-only regions and add client boundaries where interactive state is required.

Example:

```text
DashboardPage (Server)
├── WorkspaceHeader (Server)
├── SummaryCards (Server)
├── OperationsWorkspace (Client)
│   ├── Filters
│   ├── VirtualizedTable
│   └── DetailsPanel
└── BillingSummary (Server)
```

This is not a universal rule. The point is to justify boundaries based on execution, interactivity, bundle cost, data access, and serialization.

## Data access architecture

Choose one data-access direction and document it.

Possible flow:

```text
UI
 ↓
feature hook/controller
 ↓
data adapter
 ↓
HTTP/RSC/server function
 ↓
backend
```

Avoid components that know every transport detail.

That makes migration between REST, GraphQL, Server Functions, or another backend transport less invasive.

## Mutation architecture

Define mutation behavior consistently:

```text
intent
 ↓
validate UI input
 ↓
server authorization + validation
 ↓
transaction
 ↓
canonical result
 ↓
cache/revalidation/update
 ↓
optimistic reconciliation
```

Document how you handle:

- duplicate submissions;
- retries;
- idempotency;
- stale state;
- conflicting edits;
- optimistic rollback;
- live-event reconciliation.

## Error boundary map

Draw boundaries deliberately.

```text
Root boundary
└── App shell
    ├── Dashboard boundary
    │   ├── analytics boundary
    │   └── operations boundary
    ├── Billing boundary
    └── Settings boundary
```

A billing rendering failure should not necessarily destroy an unrelated operations workflow.

Expected mutation errors remain normal UI state; unexpected render failures belong to Error Boundaries.

## Suspense boundary map

Create reveal groups based on user tasks, not component file size.

The page should keep a stable shell while slower regions resolve.

Ask:

- which content is essential to orient the user?
- which content can reveal independently?
- which navigation updates should preserve already visible content?
- where would a fallback be disruptive?

## Design system architecture

The shared system should define contracts for:

- semantics;
- focus;
- keyboard behavior;
- variants;
- tokens;
- refs;
- composition;
- error states;
- form relationships;
- testing.

A design system is not just visual CSS reuse.

It is a behavior and accessibility contract.

## Design-system change policy

For shared primitives:

1. document supported behavior;
2. add contract tests;
3. version breaking changes;
4. provide migration instructions;
5. monitor usage/deprecations;
6. avoid internal DOM assumptions in consumers.

## Performance budget

Define budgets before the product becomes slow.

Example categories:

- critical route JavaScript;
- interaction response time;
- largest table render cost;
- hydration work;
- number of initial network requests;
- route transition responsiveness.

Exact numeric targets depend on the product. The important part is having measurable budgets and ownership.

## Performance architecture questions

For each high-cost feature, ask:

- can work remain on the server?
- can the update scope be smaller?
- can the list be paginated/windowed?
- can code be split?
- can a request waterfall be removed?
- can non-urgent rendering be deferred?
- is manual memoization actually needed after measurement?

## Observability architecture

Define standard telemetry for all teams.

### Error telemetry

Capture:

- release;
- route/feature;
- caught/uncaught/recoverable classification;
- component/owner context where available;
- sanitized user/workspace correlation identifiers;
- request trace ID.

### Performance telemetry

Monitor:

- route load;
- interaction latency;
- long tasks;
- server response timing;
- failure rate;
- critical mutation latency.

### Product workflow telemetry

Track outcomes, not sensitive payloads.

Example:

```text
operation_update_started
operation_update_succeeded
operation_update_failed
```

Avoid logging full form bodies or secrets.

## CI quality gates

A mature React platform may gate pull requests with:

- TypeScript;
- lint/Rules of React;
- unit/integration tests;
- accessibility checks;
- production build;
- bundle budget checks;
- dependency security scanning;
- E2E smoke tests for critical routes.

Not every check must block every commit, but teams should know which failures are release-blocking.

## Testing ownership

Use the smallest layer that protects the behavior reliably.

```text
Pure domain logic → unit
Component contract → component/integration
Feature workflow → integration
Cross-system critical journey → E2E
Server authorization → backend/server test
Design-system behavior → contract test
```

Do not try to prove all behavior through E2E tests.

## Feature ownership

Every critical area should have:

- a clear owning team;
- on-call/escalation path where relevant;
- documentation;
- dashboards/alerts;
- runbooks for common incidents.

Code ownership without operational ownership is incomplete.

## Architecture decision records

Require ADRs for decisions with meaningful long-term consequences, such as:

- client-state technology;
- routing model;
- RSC adoption;
- design-system API strategy;
- data-fetching layer;
- auth/permission architecture;
- observability standard;
- monorepo/package boundaries.

Do not require ADRs for trivial implementation choices.

## Migration scenario

Assume the existing product has:

- class components;
- legacy Context;
- one huge Redux store;
- client-only rendering;
- CSS library with inaccessible widgets;
- weak testing;
- no error telemetry.

Design an incremental migration.

A strong answer might sequence:

```text
1. observability + characterization tests
2. upgrade React/runtime safely
3. replace removed APIs
4. fix high-risk accessibility/security gaps
5. isolate feature boundaries
6. modernize state ownership feature by feature
7. adopt server rendering/RSC only where product value justifies it
8. modernize design system under stable contracts
```

Avoid a full rewrite unless you can prove it is safer and economically justified.

## Cross-team dependency rule

A useful principle:

> Stable dependencies point inward toward contracts, not sideways into another team's private implementation.

If Team A needs a capability from Team B, prefer an exported contract over deep imports into Team B's feature folder.

## Staff-level review exercise

Write a proposal for a new "Workflow Builder" feature used by multiple teams.

Your proposal must include:

1. user/problem summary;
2. component/domain boundaries;
3. state ownership matrix;
4. server/client boundaries;
5. data and mutation flow;
6. error/Suspense boundaries;
7. accessibility model;
8. performance risks;
9. security threats;
10. testing strategy;
11. observability plan;
12. migration/rollout plan;
13. ownership model;
14. rejected alternatives;
15. rollback/reversal strategy.

## Architecture interview defense

Be prepared for follow-ups:

- Why not Redux everywhere?
- Why not Context everywhere?
- Why not make every component a Client Component?
- Why not put every request behind Suspense?
- Why not memoize all rows?
- Why not rewrite the legacy application?
- Why not make the design system fully polymorphic?
- Why not place one Error Boundary at the root?
- Why not make all state URL-driven?

There is rarely one universally correct answer.

Strong senior answers connect choices to constraints.

## Final scoring rubric

Score the architecture from 1–5 in each area:

| Area | Question |
| --- | --- |
| Correctness | Are state and async semantics predictable? |
| Boundaries | Are domain and ownership boundaries clear? |
| Security | Are trust decisions enforced server-side? |
| Accessibility | Are interaction contracts reusable and tested? |
| Performance | Are costs measured and bounded? |
| Testability | Can important behavior be tested without brittle internals? |
| Operability | Can failures be detected and mitigated? |
| Evolvability | Can teams change the system without broad breakage? |
| Reversibility | Can risky decisions be rolled back? |
| Communication | Can the architecture be explained clearly? |

A senior React architecture is not the one with the most advanced React APIs.

It is the one that makes product change **safe, understandable, measurable, and reversible**.