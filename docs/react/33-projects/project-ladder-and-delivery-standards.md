---
title: Project Ladder and Delivery Standards
description: A progressive React project path from fundamentals to senior production architecture, with explicit quality gates for correctness, accessibility, testing, performance, and observability.
sidebar_position: 1
---

# Project ladder and delivery standards

The final stage of learning React is not memorizing more APIs. It is proving that you can combine the mental models from the handbook under realistic constraints.

A strong project should make it possible to answer questions like:

- where does each piece of state belong?
- what causes a render?
- what is urgent vs non-urgent work?
- where are the async boundaries?
- where can failure occur?
- how is invalid input rejected?
- how is accessibility preserved?
- how will this be tested?
- how will production problems be diagnosed?
- what trade-offs were chosen deliberately?

The project ladder below is intentionally cumulative.

```text
Fundamentals
    ↓
Local state + forms
    ↓
Shared state + external systems
    ↓
Async workflows + Suspense
    ↓
Performance + accessibility
    ↓
SSR / Server Components
    ↓
Production observability
    ↓
Senior architecture
```

## How to use the project ladder

For every project:

1. define the user problem before writing components;
2. list state categories before choosing libraries;
3. sketch the component and data boundaries;
4. define loading, empty, success, error, and permission states;
5. identify accessibility requirements;
6. identify the tests that protect the highest-value behavior;
7. build the smallest correct version;
8. profile before optimizing;
9. document trade-offs;
10. finish with a short engineering retrospective.

The goal is not maximum feature count. The goal is **evidence of engineering judgment**.

## Project 1 — Interactive product page

### Goal

Prove you understand components, props, events, local state, conditional rendering, lists, and derived values.

### Features

Build a product detail page with:

- reusable product media;
- variant selection;
- quantity control;
- price calculation;
- stock state;
- related product list;
- add-to-cart interaction;
- validation for invalid quantity;
- semantic buttons, labels, and status messages.

### Constraints

Do not use:

- global state;
- Context;
- Effects for derived values;
- a form library;
- memoization without measurement.

### Skills demonstrated

- component decomposition;
- props vs state;
- state as a snapshot;
- functional state updates;
- conditional rendering;
- list keys;
- semantic HTML.

### Review questions

Be able to explain:

- why selected variant is state but total price is usually derived;
- why a quantity button should not rely on stale state;
- how keys preserve product-card identity;
- what would make local state the wrong choice.

## Project 2 — Todo and filtering application

### Goal

Prove you can model state rather than merely store values.

### Features

Include:

- create/edit/delete todo;
- complete/uncomplete;
- filters;
- search;
- sorting;
- persisted local preferences;
- keyboard-accessible editing;
- empty state;
- validation.

### Architecture exercise

Separate:

```text
Canonical state
- todos
- selected filter

Derived state
- visible todos
- completed count
- remaining count
```

Do not copy derived lists into state.

### Stretch version

Replace multiple related `useState` calls with `useReducer` and explain whether the reducer improved reasoning.

## Project 3 — Accessible form workflow

### Goal

Demonstrate forms, validation, focus behavior, async state, and accessibility.

Build a multi-step onboarding flow with:

- account information;
- profile details;
- validation;
- server-side validation simulation;
- pending state;
- error summary;
- field-level errors;
- keyboard navigation;
- focus movement after validation failure;
- final success confirmation.

### Modern React version

Use a form Action or `useActionState` for the submission workflow.

Model the result explicitly:

```ts
type SubmissionState =
  | { status: 'idle' }
  | { status: 'error'; fieldErrors: Record<string, string> }
  | { status: 'success'; userId: string };
```

### Review questions

Explain:

- why TypeScript does not validate `FormData` at runtime;
- where server validation belongs;
- why pending UI must not remove the form's accessible name;
- how focus should behave after a failed submit;
- when uncontrolled fields make form Actions simpler.

## Project 4 — External-system integration

### Goal

Prove you understand Effects as synchronization.

Build a dashboard widget that synchronizes with at least two external systems, for example:

- WebSocket or EventSource;
- browser online/offline status;
- local storage;
- geolocation;
- document visibility;
- media query subscription.

### Requirements

Every Effect must have a sentence explaining:

> What external system is this Effect synchronizing with?

If the answer is "React state", reconsider the Effect.

### Required failure cases

Test:

- reconnection;
- stale callbacks;
- cleanup;
- component unmount;
- duplicate setup under Strict Mode;
- network failure;
- out-of-order async completion.

## Project 5 — Shared dashboard state

### Goal

Design state ownership for a multi-feature UI.

Build an operations dashboard with:

- sidebar filters;
- table/list view;
- details panel;
- user preferences;
- server data;
- URL-controlled filters;
- shared selection state;
- notifications;
- live external updates.

### Required state classification

Create a table before implementation:

| State | Owner | Lifetime | Source of truth | Update frequency |
| --- | --- | --- | --- | --- |
| Selected item | Dashboard feature | route/session | client | medium |
| Search filter | URL | navigation | URL | medium |
| Records | data layer | request/cache | server | high |
| Theme | app shell | session/persisted | client | low |
| Socket status | external store | connection | external system | high |

Then defend each choice.

## Project 6 — Suspense and responsive search

### Goal

Demonstrate async UI composition and scheduling.

Build search with:

- urgent input updates;
- deferred or transition-driven result rendering;
- Suspense fallback;
- stale-result presentation;
- lazy-loaded detail panel;
- error boundary;
- cancellation or stale request protection;
- route navigation that avoids unnecessary fallback replacement.

### Key distinction

The project should visibly demonstrate:

```text
Input typing
= urgent

Expensive result rendering
= deferrable

Data readiness
= Suspense boundary concern

Request cancellation
= data/request layer concern
```

Do not use `startTransition` as a replacement for request cancellation.

## Project 7 — Design system package

### Goal

Prove you can design reusable APIs instead of only screens.

Build a small design system containing:

- Button;
- TextField;
- Dialog;
- Tabs;
- Select or Combobox;
- Card;
- FormField;
- Toast/notification primitive.

### Requirements

Each primitive should document:

- native semantics;
- accessibility contract;
- controlled/uncontrolled support where appropriate;
- ref behavior;
- TypeScript API;
- variants;
- composition strategy;
- testing contract;
- escape hatches;
- unsupported combinations.

### Senior review

Avoid APIs that require consumers to know internal DOM structure.

Prefer:

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <Dialog.Trigger>Delete</Dialog.Trigger>
  <Dialog.Content>
    ...
  </Dialog.Content>
</Dialog>
```

over dozens of loosely related booleans.

## Project 8 — Server-rendered product application

### Goal

Explain the complete server-to-client path.

Use an RSC/SSR-capable framework and build:

- server-rendered page shell;
- Server Components for server-owned data;
- Client Components only where interactivity is required;
- streaming Suspense boundaries;
- mutation through a Server Function or framework action;
- optimistic UI;
- hydration-safe output;
- error boundaries;
- metadata/resource loading;
- authorization checks on the server.

### Required architecture document

Draw:

```text
Request
  ↓
Server data access
  ↓
Server Component tree
  ↓
RSC payload / HTML rendering
  ↓
Streaming response
  ↓
Client boundary hydration
  ↓
Interactive updates
```

Then annotate where:

- code executes;
- data is trusted;
- data crosses serialization boundaries;
- errors are handled;
- caching happens.

## Project 9 — Performance remediation exercise

### Goal

Prove you can diagnose rather than guess.

Start with an intentionally slow application containing:

- broad Context updates;
- expensive list rendering;
- unstable props;
- repeated derived computation;
- unnecessary Effects;
- large bundle route;
- waterfall requests;
- synchronous expensive interaction work.

### Required process

1. reproduce the slow interaction;
2. capture baseline timings;
3. profile with React DevTools / Performance Tracks;
4. identify the largest cost;
5. change one cause;
6. re-measure;
7. document the before/after result.

A valid result may be:

> "Memoization was not needed. Moving state down reduced the update scope enough."

That is stronger than adding `useMemo` everywhere.

## Project 10 — Production readiness simulation

### Goal

Demonstrate engineering beyond feature completion.

Add to one earlier project:

- Error Boundaries;
- root error callbacks;
- source-map-aware error reporting;
- structured logs;
- release identifier;
- feature flag;
- rollback strategy;
- performance budget;
- accessibility checks;
- integration and E2E tests;
- dependency audit;
- security threat model.

Then simulate an incident and write a short postmortem.

## Required deliverables for every advanced project

A senior-quality repository should include:

```text
README.md
architecture.md
decisions/
  001-state-ownership.md
  002-data-boundaries.md
  003-error-strategy.md
src/
tests/
```

The exact folder names are flexible. The decision evidence is not.

## Architecture decision record template

For important decisions, record:

```md
# Decision

## Context
What problem are we solving?

## Options
What realistic alternatives exist?

## Decision
What did we choose?

## Why
What trade-offs make this appropriate?

## Consequences
What becomes easier or harder?

## Reversal
How would we change this later?
```

## Delivery quality gate

Before calling a capstone complete, verify all of these.

### Correctness

- no copied derived state without justification;
- reducers are pure;
- effects synchronize external systems;
- async race behavior is understood;
- keys represent real identity;
- runtime inputs are validated.

### Accessibility

- semantic elements first;
- complete keyboard flow;
- visible labels;
- correct accessible names;
- focus restoration;
- dynamic state announced when necessary;
- no inaccessible custom controls.

### Testing

- important user flows have integration tests;
- async transitions are deterministic;
- error and rollback states are tested;
- permissions are tested at the server boundary;
- E2E tests cover the highest-value workflow.

### Performance

- no optimization without evidence;
- expensive update paths have measurements;
- large lists have a scaling strategy;
- bundles and waterfalls are considered;
- server/client boundaries are intentional.

### Production engineering

- errors are observable;
- logs avoid secrets;
- releases are identifiable;
- rollback is possible;
- critical features have ownership;
- architecture decisions are documented.

## Portfolio presentation

For a strong portfolio, do not describe a project only as:

> Built with React, TypeScript, and Tailwind.

Instead describe engineering decisions:

> Built a streaming React application with Server/Client boundaries, optimistic mutations, route-level Suspense, accessible dialog primitives, production error reporting, and measured render optimizations. Documented state ownership and authorization boundaries through ADRs.

Technologies matter. The reasoning behind them is what demonstrates seniority.

## Final exercise

Choose one project from the ladder and create a one-page engineering review answering:

1. what is the hardest technical problem in the project?
2. what is the most important state boundary?
3. what is the most important failure boundary?
4. what would break first at 10× usage?
5. what did you deliberately *not* abstract?
6. which decision would you revisit with six more months of product data?
7. how would you explain the architecture to a new engineer in ten minutes?

If you can answer those clearly, the project is doing more than showcasing syntax.