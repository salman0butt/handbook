---
title: React System Design and Trade-Off Drills
description: Senior and staff React system-design exercises covering state, data, rendering, server/client boundaries, performance, resilience, security, accessibility, and migration.
sidebar_position: 3
---

# React system design and trade-off drills

React system-design interviews are not about drawing dozens of boxes. They test whether you can choose boundaries under constraints and explain the consequences.

Use this structure for almost every design prompt:

```text
Requirements
   ↓
Constraints
   ↓
Ownership boundaries
   ↓
Data flow
   ↓
Rendering model
   ↓
Failure/loading model
   ↓
Performance
   ↓
Security/accessibility
   ↓
Testing/observability
   ↓
Trade-offs + alternatives
```

## Design prompt 1 — Search experience

Design search for a catalog with 100,000 products.

### Clarify

Ask:

- client or server search?
- latency expectations?
- typo tolerance?
- URL/shareability?
- filters/sort?
- mobile constraints?
- SEO/server rendering requirements?

### Possible architecture

```text
URL query/filter state
   ↓
search request layer
   ↓
server search/index
   ↓
results cache
   ↓
Suspense/result boundary
```

Use local state for the text input if immediate editing behavior benefits from it, then synchronize/commit to URL based on the product interaction design.

Potential tools:

- debounce network requests;
- `useDeferredValue` for expensive result rendering;
- route/navigation transitions;
- pagination/windowing;
- stale-result protection.

Do not claim `useDeferredValue` reduces network calls.

## Design prompt 2 — Infinite activity feed

Requirements:

- live updates;
- infinite history;
- optimistic reactions;
- reconnect after offline;
- low-end mobile support.

Discuss:

- server state vs live external state;
- windowing;
- stable item keys;
- event ordering;
- optimistic conflict behavior;
- scroll anchoring;
- connection status accessibility;
- caching/pagination cursor strategy.

### Trade-off

Appending every live event to one top-level React array may become expensive.

Alternative:

- normalized external store;
- narrow row/item subscriptions;
- paginated historical data;
- bounded in-memory retention.

## Design prompt 3 — Collaborative editor

Requirements:

- multiple users editing;
- presence indicators;
- local optimistic edits;
- network interruption;
- conflict resolution.

React is only one layer.

Important architecture areas:

- CRDT/OT or backend conflict model;
- external document store;
- selective subscriptions;
- local ephemeral selection/cursor state;
- server authority/versioning;
- presence as high-frequency external data;
- error/reconnect states.

Do not try to solve distributed consistency with React state alone.

## Design prompt 4 — Large admin table

Features:

- 50,000 records;
- sorting/filtering;
- row selection;
- inline editing;
- bulk actions;
- permissions.

Strong design:

- server pagination/filtering for scale;
- URL state for shareable filters;
- stable IDs for row identity;
- feature-owned selection state;
- virtualization when useful;
- optimistic edits with server validation;
- accessible table/grid semantics based on interaction complexity.

Performance questions:

- what rerenders when one row changes?
- what happens when live data arrives?
- are callbacks/objects causing measurable cost?
- is the bottleneck browser DOM size or React rendering?

## Design prompt 5 — Multi-step onboarding

Requirements:

- save progress;
- server validation;
- conditional steps;
- resume later;
- analytics;
- accessibility.

Discuss:

- URL/route per step vs local step state;
- server-persisted draft;
- form Action / mutation model;
- runtime validation;
- focus after errors/navigation;
- idempotent save;
- abandonment/resume.

Avoid a single giant component with every field mounted forever.

## Design prompt 6 — Notification system

Requirements:

- live notifications;
- unread count;
- toast feedback;
- notification center;
- mark read;
- cross-tab sync.

Potential architecture:

```text
server notifications
 + live channel
 + cross-tab channel
       ↓
normalized external/data store
       ↓
NotificationCenter + unread badge
```

A toast is transient UI. The notification record is durable server state. Do not confuse them.

## Design prompt 7 — Design system for 20 teams

Discuss:

- primitives vs product components;
- semantic/accessibility contracts;
- token architecture;
- ref support;
- controlled/uncontrolled patterns;
- compound APIs;
- versioning/deprecations;
- contract tests;
- documentation;
- migration tooling.

### Trade-off drill

Fully polymorphic `as` APIs provide flexibility but can:

- complicate types;
- weaken semantic guarantees;
- create invalid combinations;
- make testing harder.

Use flexibility where product needs justify the cost.

## Design prompt 8 — Analytics dashboard

Requirements:

- SSR shell;
- expensive charts;
- filters;
- data refresh;
- export;
- permissions.

Possible split:

```text
Server-rendered shell
├── filters (Client)
├── summary metrics (Server/streamed)
└── charts (lazy Client islands)
```

Discuss:

- server/client bundle cost;
- chart library loading;
- Suspense reveal order;
- filter ownership;
- expensive visualization scheduling;
- cache freshness;
- accessible data alternatives for visual charts.

## Design prompt 9 — Chat application

Requirements:

- live messages;
- optimistic send;
- read receipts;
- typing state;
- history pagination;
- offline reconnect.

Separate:

- durable message state;
- ephemeral typing/presence;
- optimistic pending sends;
- connection state;
- pagination history.

High-frequency presence updates should not necessarily propagate through broad Context.

## Design prompt 10 — Feature-flagged migration to RSC

Existing app:

- React SPA;
- client data fetching;
- large bundle;
- many routes;
- stable revenue-critical flows.

Goal:

Adopt server rendering/Server Components incrementally.

Strong plan:

1. measure current bottlenecks;
2. choose a low-risk route;
3. establish framework/server infrastructure;
4. keep client boundaries around interactive features;
5. move server-only reads where beneficial;
6. verify hydration/telemetry;
7. use feature flags/canary rollout;
8. compare performance/error rates;
9. expand only if evidence supports it.

Do not migrate because RSC is "newer".

## Trade-off drill — Context vs external store

Choose Context when:

- tree-scoped implicit input is useful;
- update frequency is manageable;
- most consumers care about the value;
- ownership is clear.

Consider external stores when:

- data changes independently of React;
- subscriptions need to be selective;
- high-frequency updates would make broad Context costly;
- multiple roots/non-React consumers may participate.

## Trade-off drill — local state vs URL state

Local state:

- temporary UI intent;
- no navigation/history semantics.

URL state:

- shareable;
- bookmarkable;
- back/forward aware;
- reload-persistent.

Do not put every checkbox in the URL, but do not hide navigation state in ephemeral component memory either.

## Trade-off drill — controlled vs uncontrolled

Controlled:

- parent owns current value;
- easy coordinated behavior;
- more render involvement.

Uncontrolled:

- DOM/internal component owns transient value;
- useful for forms and simpler primitives;
- parent receives value through events/submission.

Good design systems often support both through an explicit contract.

## Trade-off drill — client vs server component

Server Component benefits:

- server-only data access;
- reduced client JavaScript;
- secret/server dependency isolation.

Client Component benefits:

- state;
- Effects;
- event-driven interactivity;
- browser APIs.

Do not move interactivity to the server just to reduce bundle size, and do not mark an entire route `'use client'` because one button needs state.

## Trade-off drill — Suspense boundary placement

Boundary too high:

- large UI disappears into fallback.

Boundary too low:

- fragmented loading;
- excessive reveal churn;
- harder design consistency.

Place boundaries around meaningful reveal groups.

## Trade-off drill — one global store vs domain stores

One global store may simplify discovery but can increase:

- coupling;
- accidental dependencies;
- update breadth;
- migration cost.

Domain-owned state keeps responsibility local but requires clear cross-domain contracts.

The right answer depends on product relationships, not team fashion.

## Trade-off drill — rewrite vs incremental migration

Rewrite can make sense when:

- current system blocks required product behavior;
- migration cost exceeds replacement cost;
- boundaries are impossible to establish incrementally;
- business can tolerate risk/time.

Incremental migration is often safer because it preserves:

- production learning;
- working behavior;
- gradual rollback;
- revenue continuity.

## Staff-level drill — organization architecture

Question:

> Five teams frequently break each other because they share one giant component library and one global store. What would you change?

Strong answer should address:

- domain ownership;
- public module contracts;
- design-system scope;
- state ownership boundaries;
- dependency direction;
- contract tests;
- migration sequencing;
- governance without blocking teams.

Do not answer only with a monorepo tool.

## Staff-level drill — performance regression after migration

A new architecture reduces client JavaScript by 30% but increases server latency and route error rate.

Discuss:

- user-perceived metrics, not bundle size alone;
- server capacity;
- cache behavior;
- request waterfalls;
- error classification;
- rollback criteria;
- whether benefits outweigh operational cost.

Architecture is multi-dimensional.

## System-design answer template

Use this in interviews:

### 1. Requirements

Functional + non-functional.

### 2. State/data ownership

List categories and sources of truth.

### 3. Component/domain boundaries

Show where responsibilities live.

### 4. Data/mutation flow

Show reads, writes, validation, authority.

### 5. Rendering model

CSR/SSR/RSC/static/streaming choices.

### 6. Loading/error behavior

Suspense, expected errors, Error Boundaries.

### 7. Accessibility

Keyboard, names, focus, announcements.

### 8. Performance

Update scope, bundle, network, lists, scheduling.

### 9. Security

Trust boundaries, authn/authz, XSS, secrets.

### 10. Testing/observability

How will you prove and operate it?

### 11. Trade-offs

Name rejected alternatives.

### 12. Evolution

How will this scale or migrate later?

## Final practice prompts

Design each in 30–45 minutes:

1. ecommerce storefront;
2. project-management board;
3. trading dashboard;
4. collaborative document editor;
5. social feed;
6. support ticket console;
7. analytics platform;
8. design-system platform;
9. multi-tenant admin portal;
10. offline-first field application.

For every design, explicitly state:

> What is React responsible for here, and what belongs to the network, backend, browser, data layer, or organizational architecture?

That boundary awareness is one of the clearest signals of senior React engineering.