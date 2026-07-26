---
title: Debugging, Performance, and Security Scenarios
description: Senior React scenario drills that test diagnosis, evidence gathering, trade-offs, production response, performance reasoning, and trust-boundary thinking.
sidebar_position: 2
---

# Debugging, performance, and security scenarios

Senior interviews often stop asking "What does this Hook do?" and instead ask:

> Something is broken. What do you do next?

A good scenario answer should usually follow:

```text
Clarify symptom
   ↓
Assess impact
   ↓
Reproduce
   ↓
Gather evidence
   ↓
Form hypotheses
   ↓
Change one variable
   ↓
Verify
   ↓
Prevent regression
```

For production incidents, mitigation may come before complete diagnosis.

## Scenario 1 — Input feels slow

A search input becomes laggy when 5,000 results are visible.

### Weak answer

> Add `useMemo` and `useCallback`.

### Strong investigation

Ask:

- does every keystroke render all 5,000 rows?
- is expensive filtering happening synchronously?
- are row components doing expensive formatting?
- is state owned too high?
- is virtualization appropriate?
- does the result render need to be urgent?

Measure with React DevTools/Performance Tracks.

Possible solutions:

- `useDeferredValue` for expensive downstream rendering;
- `useTransition` for non-urgent result updates;
- virtualization;
- server-side search/filtering;
- move state closer to the input if unrelated regions render;
- targeted memoization only after evidence.

Key point:

Scheduling can improve responsiveness, but it does not remove CPU work.

## Scenario 2 — Context causes broad rerenders

A provider contains:

```ts
{
  user,
  theme,
  notifications,
  livePrices,
  permissions,
  setTheme,
  dismissNotification,
}
```

Live prices update multiple times per second.

### Diagnosis

The problem may be architectural, not simply missing `useMemo`.

Questions:

- do all consumers need live prices?
- should high-frequency data be an external store subscription?
- can Context values be split by domain/update frequency?
- can state remain local?

Strong solution:

Narrow update propagation first. Memoization comes later if profiling still shows value.

## Scenario 3 — Effect repeatedly reconnects WebSocket

Code:

```tsx
useEffect(() => {
  const socket = connect({ roomId, options });
  return () => socket.close();
}, [roomId, options]);
```

`options` is created inline every render.

### Investigation

`Object.is` sees a new object identity every render, so the Effect resynchronizes.

Possible fixes depend on semantics:

- create the options inside the Effect from primitive dependencies;
- move stable configuration outside the component;
- memoize only if stable identity is genuinely the contract;
- split reactive and non-reactive Effect logic.

Do not remove dependencies to silence the linter.

## Scenario 4 — Fetch race

User selects A, then B quickly.

A's request finishes after B and overwrites the UI.

### Strong answer

This is request ordering/cancellation, not a React rendering bug.

Options:

- `AbortController`;
- request ID/version check;
- framework/data library stale-result handling;
- route/data-layer cancellation.

A transition does not solve stale network responses.

## Scenario 5 — State appears on the wrong row

An editable table is sorted and the wrong row retains editing state.

Check keys.

If rows use:

```tsx
key={index}
```

sorting changes which logical record occupies each position.

Use stable domain identity:

```tsx
key={record.id}
```

Explain that keys participate in state identity, not only rendering performance.

## Scenario 6 — Form submits twice

A user double-clicks checkout and two mutations reach the backend.

Frontend pending state helps UX but is not a full correctness boundary.

Strong answer includes:

- disable/prevent repeated intent in UI where appropriate;
- server-side idempotency strategy;
- transactional backend behavior;
- duplicate request handling;
- tests for repeated submit.

Client controls alone are not enough.

## Scenario 7 — Optimistic update conflicts with server event

The UI optimistically marks an item resolved. A live server event says another user reassigned it.

Questions:

- what is canonical?
- does the server return a version/revision?
- how are conflicts represented?
- should the optimistic projection be rebased or replaced?

Strong architecture keeps server authority clear and makes conflict behavior explicit.

## Scenario 8 — Hydration mismatch only in production

Symptoms:

- server renders one value;
- browser initially renders another;
- warning appears only for some users.

Investigate:

- current time/timezone;
- random values;
- browser-only APIs;
- locale differences;
- feature flags differing server/client;
- user/session data snapshots;
- invalid HTML nesting;
- third-party DOM mutation.

Do not reach for `suppressHydrationWarning` before identifying the cause.

## Scenario 9 — Suspense fallback replaces whole page

Navigation to a slow nested route causes the entire app to flash to a root spinner.

Possible causes:

- boundary too high;
- navigation not marked as transition by routing layer;
- nested reveal structure missing;
- new content identity intentionally resetting boundary.

Strong answer designs boundaries around UX reveal groups.

## Scenario 10 — Lazy chunk fails after deployment

A user has old HTML/client runtime and requests a code-split chunk removed by a new deploy.

Discuss:

- immutable hashed assets;
- asset retention window;
- error boundary around lazy route;
- reload/recovery UX;
- deployment strategy;
- service worker/version interactions.

This is a deployment/system-design problem, not only a `lazy()` problem.

## Scenario 11 — Memory grows over time

Potential causes:

- subscription cleanup missing;
- timers not cleared;
- retained event listeners;
- third-party library teardown missing;
- application cache without eviction;
- closures retaining large objects;
- detached DOM through imperative integrations.

Investigation:

1. reproduce over repeated mount/unmount;
2. use browser memory tools;
3. inspect Effect cleanup;
4. test Strict Mode behavior;
5. isolate third-party integration;
6. verify heap retention after GC.

## Scenario 12 — Infinite Effect loop

Common pattern:

```tsx
useEffect(() => {
  setItems(transform(items));
}, [items]);
```

Ask first: should this be derived during render instead?

If the Effect updates a dependency every time, it can create a loop.

Do not "fix" by deleting the dependency blindly.

## Scenario 13 — `memo` did not help

Possible reasons:

- props change every render;
- Context consumed by the component changes;
- component render was not expensive;
- child state causes its own render;
- parent bottleneck is elsewhere;
- comparison cost offsets savings;
- compiler already handles equivalent work.

Measure before/after.

## Scenario 14 — UI is fast locally, slow in production

Compare environments:

- realistic data volume;
- network latency;
- production build vs dev instrumentation;
- device CPU;
- third-party scripts;
- hydration/server latency;
- cache hit rate;
- feature flags;
- analytics/error tooling.

Local performance is not production performance.

## Scenario 15 — Error Boundary logs too many duplicates

Possible sources:

- root callback plus boundary logging same error;
- retries/re-renders;
- Strict Mode development behavior;
- multiple telemetry integrations.

Define one reporting policy:

```text
Boundary → recovery UX
Root callbacks → global classification
Telemetry adapter → deduplication/correlation
```

Avoid leaking PII in component props or error context.

## Scenario 16 — Server Function vulnerability

Client invokes a Server Function with:

```ts
{ userId: 'victim', role: 'admin' }
```

The function trusts arguments and updates the database.

Strong answer:

- authenticate from server session/request context;
- authorize operation against trusted identity;
- validate all arguments;
- ignore client claims of privilege;
- use transactional constraints where appropriate;
- log security-relevant failure without sensitive payloads.

Treat Server Functions as externally callable mutation endpoints.

## Scenario 17 — Raw HTML product description

Product descriptions arrive from a CMS and are inserted with `dangerouslySetInnerHTML`.

Threat:

XSS if the HTML is attacker-controlled or improperly sanitized.

Strong answer discusses:

- trusted source model;
- sanitization at a controlled boundary;
- Content Security Policy where appropriate;
- avoiding arbitrary inline script/event attributes;
- testing malicious payloads;
- never considering TypeScript a sanitizer.

## Scenario 18 — Authorization hidden in UI only

The Delete button is hidden for non-admins, but the API accepts delete requests from anyone.

Correct model:

```text
UI permission
= user experience

Server authorization
= security boundary
```

The server must reject unauthorized requests regardless of rendered UI.

## Scenario 19 — Sensitive data appears in telemetry

A form error logger sends the whole state object, including email, address, and tokens.

Fix the telemetry architecture:

- allowlist fields;
- redact secrets;
- avoid full request/form payloads;
- classify sensitive data;
- define retention/access controls;
- test logging behavior.

Observability must respect trust boundaries.

## Scenario 20 — Legacy React upgrade breaks behavior

A large application uses:

- `ReactDOM.render`;
- legacy Context;
- string refs;
- old testing utilities;
- class lifecycles with hidden side effects.

Strong migration plan:

1. add characterization tests;
2. upgrade in supported increments;
3. use codemods for mechanical changes;
4. replace removed root APIs;
5. migrate legacy Context/ref patterns;
6. inspect lifecycle semantics rather than mechanically converting to Effects;
7. validate production behavior and telemetry;
8. remove temporary compatibility layers.

## Production incident framework

When the interviewer asks about a live incident, structure the answer around:

### 1. Impact

Who is affected? How severely? Is data integrity at risk?

### 2. Mitigation

Possible actions:

- rollback;
- disable feature flag;
- route traffic away;
- degrade optional feature;
- stop harmful mutation;
- restore previous asset set.

### 3. Evidence

Use:

- logs;
- error telemetry;
- traces;
- performance captures;
- release diff;
- feature flags;
- user/session correlation;
- reproduction.

### 4. Root cause

Explain the causal chain, not merely the line that threw.

### 5. Prevention

Add:

- regression test;
- guardrail;
- better monitoring;
- architectural fix;
- runbook update.

## Interview exercise

For each scenario above, answer in this template:

```text
Symptom:

Impact:

First evidence I would collect:

Top 3 hypotheses:

How I would isolate them:

Most likely fix:

How I would verify the fix:

Regression test:

Production prevention:
```

The goal is to demonstrate a debugging process that is **evidence-driven, risk-aware, and production-minded**.