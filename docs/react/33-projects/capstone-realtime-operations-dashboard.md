---
title: Capstone — Real-Time Operations Dashboard
description: A senior React capstone covering live data, state ownership, external stores, accessibility, performance, testing, observability, and failure recovery.
sidebar_position: 2
---

# Capstone — real-time operations dashboard

This capstone combines the most important client-side React concerns in one system: live updates, dense UI, shared state, external systems, performance, accessibility, and operational failure handling.

## Product brief

Build an operations dashboard for a team monitoring live orders, incidents, devices, jobs, or transactions.

Users should be able to:

- view a high-volume live list;
- filter and sort records;
- search without blocking typing;
- open a details panel;
- update status;
- receive live changes;
- see connection health;
- preserve useful filters in the URL;
- recover from temporary failures;
- use the main workflow entirely with a keyboard.

The exact domain is flexible. The engineering constraints are not.

## Architecture target

```text
Server/API
   ↓
request/cache layer
   ↕
live connection
   ↓
external store / data adapter
   ↓
feature state boundaries
   ↓
React UI
```

The key question is not "Which store library should I use?"

The key question is:

> Which system owns each value, and who should subscribe to it?

## State inventory

Classify state before implementation.

### URL state

Good candidates:

- search query;
- selected team;
- date range;
- sort order;
- view mode.

Why URL state?

Because it benefits from:

- deep links;
- browser history;
- refresh persistence;
- shareability.

### Local UI state

Good candidates:

- temporary popover state;
- inline editor open state;
- focused row;
- draft text before submission.

### Shared feature state

Possible examples:

- selected record;
- bulk-selection model;
- dashboard layout preference.

Keep this feature-scoped unless other unrelated areas genuinely need it.

### Server state

Examples:

- records;
- detail payloads;
- totals;
- permissions;
- status history.

The server remains authoritative.

### External live state

Examples:

- WebSocket connection state;
- stream cursor;
- latest external snapshot;
- heartbeat status.

This can be a good `useSyncExternalStore` exercise.

## Live connection design

Build a small adapter rather than letting components know connection details.

```ts
type ConnectionState =
  | { status: 'connecting' }
  | { status: 'connected'; lastEventAt: number }
  | { status: 'reconnecting'; attempt: number }
  | { status: 'offline'; reason?: string };
```

The adapter should expose:

- subscribe;
- getSnapshot;
- reconnect policy;
- event normalization;
- cleanup.

React components should consume a stable interface rather than raw socket code.

## Reconciliation challenge

Live lists are a perfect place to demonstrate key correctness.

Use real persistent record identity:

```tsx
{records.map(record => (
  <RecordRow key={record.id} record={record} />
))}
```

Do not use array indexes if records can be inserted, removed, sorted, or filtered.

Test that an inline editor stays attached to the correct record when new live events arrive.

## Search responsiveness

The search box should remain urgent.

Possible architecture:

```tsx
const [query, setQuery] = useState('');
const deferredQuery = useDeferredValue(query);
```

Use the immediate query for input state and the deferred value for expensive local filtering or result rendering.

If searching remotely, remember:

- deferral does not cancel requests;
- a data layer still needs stale-response handling;
- transitions are scheduling tools, not networking tools.

## High-volume rendering

Model the scaling problem explicitly.

At small sizes, normal rendering may be enough.

At large sizes, consider:

- pagination;
- windowing/virtualization;
- server filtering;
- server sorting;
- selective subscriptions;
- smaller row component boundaries.

Measure before choosing.

## Context design

Avoid one giant dashboard Context containing:

```ts
{
  filters,
  records,
  selectedRecord,
  theme,
  permissions,
  socketStatus,
  notifications,
  preferences,
  dispatch,
}
```

That creates broad coupling and broad update propagation.

Better options include:

- props for nearby relationships;
- separate low-frequency Context values;
- external subscriptions for high-frequency data;
- URL ownership for navigational values;
- server cache ownership for server data.

## Status mutation flow

Build a status update such as:

```text
Open → Investigating → Resolved
```

Requirements:

- authorization on the server/API boundary;
- runtime validation;
- pending UI;
- optimistic feedback where appropriate;
- rollback on failure;
- duplicate-submit protection;
- error message accessible to assistive technology.

### Optimistic state

The canonical server record remains authoritative.

Optimistic UI is a temporary projection, not a second permanent source of truth.

## Error architecture

Separate failure classes.

### Recoverable data failure

Example:

- detail request fails;
- live connection temporarily disconnects.

Usually show local retry UI.

### Render failure

Use an Error Boundary around a meaningful feature region.

### Whole-shell failure

Reserve root-level fallback for failures that truly make the app unusable.

## Loading architecture

Design reveal boundaries based on UX.

```text
Dashboard shell
├── summary metrics
├── filters
└── results area
    ├── table/list
    └── details panel
```

The entire shell should not disappear because one details request suspends.

Use nested boundaries where independent regions can reveal independently.

## Accessibility requirements

The project is not complete unless:

- filters have visible labels;
- connection status is understandable without color alone;
- table/list semantics match the interaction model;
- keyboard users can open and close details;
- focus is restored after closing a dialog/panel when appropriate;
- live error/status messages are announced selectively;
- loading UI does not destroy orientation;
- row actions have meaningful accessible names.

For a virtualized grid, document the accessibility strategy carefully. Performance is not permission to remove semantics.

## Testing plan

### Unit tests

Good candidates:

- reducer transitions;
- event normalization;
- permission helper;
- URL serialization.

### Component/integration tests

Cover:

- filters changing visible records;
- deferred search behavior;
- opening details;
- optimistic success;
- optimistic rollback;
- reconnect status;
- keyboard flow;
- Error Boundary fallback.

### E2E tests

Protect at least:

1. filter → open record → mutate status;
2. lost connection → reconnect → live state resumes;
3. unauthorized mutation rejected;
4. keyboard-only primary workflow.

## Performance investigation exercise

Introduce an intentional problem:

- every live tick updates top-level Context;
- every row receives a new callback/object;
- expensive formatting happens on every row render.

Then measure.

A possible remediation sequence:

```text
broad top-level update
      ↓
identify affected subtree
      ↓
move ownership / narrow subscription
      ↓
re-profile
      ↓
consider memoization only if still justified
```

## Observability

Instrument:

- release/version identifier;
- connection failures;
- reconnect attempts;
- mutation failures;
- root caught/uncaught errors;
- recoverable hydration errors if SSR is used;
- slow interactions;
- key business workflow failures.

Do not log full user records blindly.

Redact sensitive fields.

## Incident simulation

Create a scenario where a new release causes live updates to duplicate records.

Write the investigation:

1. symptom;
2. impact;
3. first mitigation;
4. evidence gathered;
5. root cause;
6. fix;
7. regression test;
8. prevention.

A senior answer should prefer restoring reliability before perfect diagnosis.

## Architecture review questions

Be ready to defend:

1. Why is a value in the URL instead of Context?
2. Why is live data in an external store instead of React state?
3. What updates most frequently?
4. Which subscriptions are intentionally narrow?
5. Where can Suspense show fallback?
6. How is an optimistic update reconciled with a live server event?
7. What happens when events arrive out of order?
8. What is the performance strategy at 100 rows? 10,000 rows?
9. Where are authorization decisions enforced?
10. What is the rollback plan for a broken release?

## Completion standard

The project is senior-quality when the architecture can be explained without saying:

> "Because this library is popular."

Every major choice should connect to ownership, correctness, UX, performance, security, or operational concerns.