---
title: Senior React Architectural Decision-Making
description: A decision framework for state, rendering, data, boundaries, performance, migration, and production trade-offs in senior React work.
sidebar_position: 4
---

# Senior React Architectural Decision-Making

Senior React engineering is less about knowing one "best practice" and more about choosing the right trade-off for a specific system.

Most difficult React decisions involve competing goals:

- simplicity vs flexibility;
- local ownership vs reuse;
- fast delivery vs long-term maintainability;
- server rendering vs client interactivity;
- optimistic UX vs correctness risk;
- abstraction vs explicit code;
- performance vs complexity;
- incremental migration vs rewrite.

A strong decision explains **why this choice fits this context**.

## Start from constraints, not tools

Weak question:

> Should we use Context or Zustand?

Better question:

> What state is being shared, who owns it, how frequently does it update, where must it persist, and who needs to subscribe?

Weak question:

> Should we use Server Components?

Better question:

> Which work can remain server-only, what must be interactive, what data boundaries exist, and what framework/runtime constraints do we have?

Tools come after requirements.

## Use a decision frame

For important architecture decisions, write down:

```text
Problem
Constraints
User impact
Current failure mode
Options
Trade-offs
Decision
How we will validate it
How we can reverse it
```

This prevents architecture discussions from becoming preference contests.

## State decisions

Ask these questions in order:

### 1. Can it be derived?

If yes, compute it during render.

```jsx
const total = items.reduce((sum, item) => sum + item.price, 0);
```

Do not store redundant derived state.

### 2. Is it local UI state?

Keep it near the component that owns it.

```jsx
const [open, setOpen] = useState(false);
```

### 3. Is it shared by a small subtree?

Lift state or use focused Context.

### 4. Is it workflow/transition state?

A reducer or state-machine model may clarify transitions.

### 5. Is it server data?

Use a server/cache/data layer rather than duplicating remote truth as ad-hoc global client state.

### 6. Is it navigation/shareable state?

URL/search params may be the correct source of truth.

### 7. Is it an external mutable store?

Use `useSyncExternalStore`-compatible subscription semantics.

## Rendering decisions

Choose rendering architecture per route/feature, not ideology.

### Client rendering is useful when

- the feature is highly interactive;
- SEO/initial HTML is unimportant;
- deployment simplicity matters;
- data is only available after authentication/client boot.

### SSR/streaming is useful when

- fast initial HTML matters;
- metadata/SEO matters;
- content can render on the server;
- Suspense boundaries can stream useful shells/sections.

### Server Components are useful when

- server-only data access can remove client code;
- the framework supports RSC correctly;
- component work does not require client interactivity;
- serializable client boundaries are acceptable.

Do not convert interactive components to Server Components merely to reduce a bundle metric.

## Client boundary decisions

Every `'use client'` boundary expands the client module graph.

Ask:

- does this component need state, Effects, browser APIs, or event handlers?
- can the interactive leaf be smaller?
- are server-only dependencies accidentally pulled into the client architecture?
- are props serializable?

A common pattern:

```text
Server page
├── server data/content
├── server-rendered structure
└── small ClientWidget
```

instead of marking the entire page client-side.

## Effect decisions

Before adding an Effect, classify the work.

```text
Derived from props/state?
→ render

Caused by user event?
→ event handler

External system synchronization?
→ Effect

DOM measurement before paint?
→ rare layout Effect

CSS-in-JS insertion infrastructure?
→ useInsertionEffect
```

An Effect is not a generic "run code after React" tool.

## Context decisions

Context is useful when implicit tree-scoped input is genuinely part of the component environment.

Examples:

- theme;
- locale;
- authenticated session facade;
- form/compound-component coordination.

Avoid using Context as a default global store for frequently changing unrelated state.

Ask:

- how often does the value change?
- how broad is the provider?
- do all consumers need the same object?
- can providers be split?
- does this belong to server/cache/URL state instead?

## Reducer decisions

Use a reducer when state changes are easier to understand as explicit transitions.

```ts
type Action =
  | { type: 'submitted' }
  | { type: 'succeeded'; orderId: string }
  | { type: 'failed'; message: string };
```

Do not use a reducer just because state has multiple fields.

The value comes from centralizing transition logic and making invalid transitions easier to reason about.

## Optimistic UI decisions

Optimistic UI is a UX trade-off.

Good candidates:

- likes/reactions;
- low-risk list insertion;
- toggles with straightforward rollback.

Riskier candidates:

- destructive deletion;
- money movement;
- permission changes;
- actions with ambiguous server outcomes.

Ask:

1. how likely is failure?
2. can rollback restore a trustworthy state?
3. could optimistic UI mislead the user about irreversible consequences?
4. how is request ordering handled?

## Suspense boundary decisions

A Suspense boundary defines a reveal/coordination boundary.

Use product UX to place it.

Too high:

```text
whole screen disappears for one slow widget
```

Too low:

```text
dozen tiny skeletons flash independently
```

Design around meaningful content groups and route transitions.

## Error Boundary decisions

Boundary placement asks:

> What can fail independently while the rest of the experience remains useful?

Good boundaries often align with:

- routes;
- dashboard widgets;
- editors;
- message threads;
- optional integrations.

Avoid boundaries around every leaf component.

## Memoization decisions

In React Compiler-era applications, start with measurement.

Use manual memoization when:

- profiling identifies meaningful repeated work;
- an API requires stable identity;
- you intentionally preserve identity for a dependency/child contract;
- Compiler cannot optimize the relevant pattern.

Do not add `useCallback` to every function as a style rule.

## Transition decisions

Use Transition scheduling when an update can be non-urgent.

```text
user typing
→ urgent

expensive result view
→ can be Transition/deferred
```

Do not use Transition as a substitute for reducing huge CPU work.

Scheduling changes responsiveness; it does not make an expensive algorithm cheap.

## Server Function decisions

Use Server Functions for server mutations in supported RSC frameworks when they improve the architecture.

Still require:

- runtime validation;
- authentication;
- authorization;
- idempotency where needed;
- business error modeling;
- observability.

Do not use Server Functions as an excuse to skip a service/domain layer for complex business logic.

## Abstraction decisions

Use the **rule of three carefully**, but not mechanically.

Before abstracting, compare the repeated code's reason for change.

Two forms may look identical but belong to different domains and evolve differently.

A useful abstraction exists when consumers share a stable concept, not merely similar markup.

## Custom Hook decisions

Create a custom Hook when it names a reusable stateful/synchronization concept.

Good:

```js
useOnlineStatus()
useDocumentAutosave(documentId)
useKeyboardShortcut(...)
```

Weak:

```js
useDashboardEverything()
```

A Hook should improve conceptual boundaries, not hide unrelated behavior.

## Design-system API decisions

Prefer APIs that encode valid states.

Weak:

```jsx
<Button
  isLink
  destructive
  iconOnly
  loading
  href={maybeHref}
/>
```

This allows many invalid combinations.

Stronger APIs may use variants or separate components:

```jsx
<Button variant="danger">Delete</Button>
<LinkButton href="/settings">Settings</LinkButton>
<IconButton aria-label="Close" icon={<CloseIcon />} />
```

TypeScript can help encode the contract, but runtime accessibility still matters.

## Build vs buy decisions

Before adopting a library, assess:

- problem complexity;
- maintenance activity;
- React 19 compatibility;
- TypeScript quality;
- accessibility;
- bundle/runtime cost;
- server/RSC compatibility;
- escape hatches;
- migration cost if abandoned.

For security-sensitive primitives such as complex dialogs, date pickers, or rich-text editors, a mature audited library may be safer than a rushed custom implementation.

## Framework decisions

React itself is a UI library.

A production app often needs framework support for:

- routing;
- bundling;
- SSR/RSC;
- data loading;
- mutations;
- deployment.

Choose based on:

- hosting/runtime requirements;
- team expertise;
- rendering needs;
- ecosystem maturity;
- operational constraints;
- migration path.

Do not choose solely because a framework exposes the newest React feature first.

## Migration vs rewrite decisions

Prefer incremental migration when:

- old and new can coexist;
- behavior is complex and business-critical;
- tests are incomplete;
- delivery cannot pause.

A rewrite becomes more defensible when:

- core architecture prevents required product behavior;
- dependencies are unsupported and inseparable;
- migration layers would be more complex than replacement;
- system boundaries allow safe parallel rollout.

Even then, plan data compatibility, observability, rollback, and cutover.

## Performance vs complexity decisions

Every optimization has maintenance cost.

A 2 ms improvement that adds a fragile cache may not be worth it.

A 600 ms interaction improvement for a revenue-critical flow probably is.

Use:

```text
user impact × frequency × confidence
```

as part of prioritization.

## Reliability decisions

For critical flows, design degradation.

Examples:

- payment widget unavailable → preserve cart and explain retry;
- recommendations fail → checkout still works;
- analytics fails → do not block interaction;
- one dashboard chart crashes → other panels remain usable.

Resilience is an architectural feature.

## Security decisions

If a decision affects a trust boundary, security outweighs convenience.

Never trade away:

- server authorization;
- runtime validation;
- secret protection;
- safe HTML handling;
- privacy redaction;

for a simpler component API.

## Reversibility matters

Prefer decisions that are easy to change when uncertainty is high.

Examples:

- feature flag a risky rollout;
- hide data layer behind a feature API;
- migrate route-by-route;
- use adapters around external stores;
- avoid leaking framework-specific types across domain packages.

Irreversible choices deserve more design work.

## Decision records should include failure modes

Do not write only:

> We chose RSC because bundles will be smaller.

Write:

```text
Expected benefit
- lower client JS for content-heavy routes

Risks
- framework coupling
- serialization constraints
- server runtime cost
- debugging complexity

Mitigation
- start with two routes
- measure client JS + latency
- preserve feature module boundaries
```

That is an engineering decision, not marketing copy.

## Senior PR review questions

When reviewing an important React change, ask:

### State
- Is there one source of truth?
- Is state local enough?
- Is any state merely derived?

### Effects
- Is this really synchronization?
- Does cleanup mirror setup?
- Are dependencies describing the real process?

### Identity
- Are keys stable and domain-correct?
- Will state reset/preserve intentionally?

### Rendering
- Is this client/server boundary appropriate?
- Does Suspense reveal at a meaningful UX boundary?

### Failure
- What happens when data/mutation/rendering fails?
- Where does the user recover?

### Accessibility
- Are semantics, keyboard, focus, and announcements correct?

### Security
- What input is untrusted?
- Where is authorization enforced?

### Performance
- Is there measured evidence?
- Are we reducing work or merely moving it?

### Operations
- Can we observe, roll back, and disable this feature?

## Architecture is a hypothesis

Treat a design as a hypothesis:

> Given these constraints, this structure should make the system easier to change and operate.

Validate it with:

- delivery speed;
- defect rate;
- performance;
- incident frequency;
- developer feedback;
- migration cost;
- product outcomes.

When evidence changes, architecture can change too.

## Interview questions

### How do you choose between Context and an external store?

Start from ownership, update frequency, subscription granularity, lifetime, persistence, and external-system needs. Context is tree-scoped implicit input, not automatically a state manager.

### How do you decide Server vs Client Component?

Keep work server-side when it needs no client interactivity and benefits from server-only access/bundle reduction; introduce client boundaries around interactive/browser-dependent behavior.

### When do you optimize React rendering?

After measuring a user-visible issue, identifying the expensive work, and choosing the smallest fix that addresses the actual bottleneck.

### What makes an architecture senior-level?

Not complexity. Clear trade-offs, correct boundaries, operability, security, reversibility, and an explicit reason the design fits the system.

## Exercise

Design a collaborative document editor.

Decide and justify:

- local vs shared state;
- URL state;
- server cache/data ownership;
- Server vs Client Components;
- autosave Effect architecture;
- optimistic edits;
- Error/Suspense boundaries;
- permissions/authorization;
- performance strategy for 20,000 nodes;
- observability;
- feature-flag rollout;
- migration strategy from an existing class-based editor.
