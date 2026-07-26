---
title: Large-Team React Engineering
sidebar_position: 3
description: Ownership, boundaries, standards, design systems, dependency governance, review practices, and change management for large React teams.
---

# Large-Team React Engineering

A React application can be technically correct and still become hard to evolve when many teams contribute to it.

At scale, the hardest problems are often organizational:

- Who owns each feature?
- Which abstractions are stable contracts?
- How do teams share UI without coupling releases?
- How do architectural decisions get documented?
- How do you prevent one team from turning a local pattern into a global dependency?
- How do you migrate old patterns without blocking product delivery?

Senior React engineering is partly about **designing the system through which code changes**.

## Architecture should mirror ownership

A healthy feature boundary often contains:

```text
features/
  billing/
    components/
    hooks/
    data/
    tests/
    types/
    index.ts
```

The goal is not a specific folder structure.

The goal is that one domain can evolve without every other domain knowing its internals.

A feature should expose a deliberate public surface instead of encouraging deep imports.

```ts
// Good
import { BillingPanel } from '@/features/billing';

// Fragile
import { normalizeInvoice } from '@/features/billing/internal/utils/normalizeInvoice';
```

## Public module boundaries reduce coupling

Use package or feature entry points to define supported contracts.

```ts
export { BillingPanel } from './components/BillingPanel';
export type { BillingSummary } from './types';
```

Internal modules remain free to change.

This makes refactoring easier because consumers depend on the contract, not the implementation layout.

## State ownership should follow domain ownership

Do not create global state because many teams need data.

Ask:

```text
Who owns this state?
Who can write it?
How long should it live?
Is it server data, URL state, UI state, or workflow state?
```

Examples:

- authenticated user session → application/platform boundary;
- selected billing invoice → billing feature;
- open tooltip → local component;
- search filters → often URL + search feature;
- fetched customer data → server/cache layer.

A giant global store often becomes an organizational coupling mechanism.

## Shared libraries need higher standards than app code

A component used once can be specialized.

A component used by 40 teams needs:

- stable API design;
- accessibility guarantees;
- TypeScript contracts;
- upgrade policy;
- visual regression coverage;
- migration documentation;
- ownership;
- versioning/change process.

Do not move code into a shared package merely because two files look similar.

## The design system is infrastructure

A mature design system should define more than colors and buttons.

It can provide:

- tokens;
- semantic primitives;
- accessibility behavior;
- focus management patterns;
- form controls;
- overlays/dialogs;
- loading/error primitives;
- motion policy;
- React API conventions;
- test helpers.

But the design system should not absorb product-specific business state.

Bad shared primitive:

```jsx
<EnterpriseBillingCancellationDialog />
```

Better separation:

```jsx
<Dialog>
  <BillingCancellationContent />
</Dialog>
```

The system owns interaction primitives; the product feature owns business behavior.

## Avoid framework-within-the-framework abstractions

Large teams sometimes build custom layers that hide React itself:

```text
company component runtime
company state DSL
company effect engine
company routing wrapper
company form abstraction
```

Every abstraction adds a new language engineers must learn.

Before creating one, ask:

1. What repeated problem does it solve?
2. Why is ordinary React insufficient?
3. Can a small helper solve it instead?
4. What is the escape hatch?
5. Who owns it for years?
6. How will it be migrated or removed?

Prefer boring, explicit React until repetition justifies infrastructure.

## Architecture Decision Records

Important decisions should outlive Slack threads.

An ADR can contain:

```text
Title
Status
Context
Decision
Alternatives considered
Consequences
Migration plan
Owner
Date
```

Useful React ADR topics:

- client state library choice;
- URL-state conventions;
- RSC adoption boundary;
- Error Boundary strategy;
- design-system ownership;
- data fetching/cache layer;
- compiler rollout;
- testing policy;
- module/package boundaries.

The goal is not bureaucracy. It is preserving **why** a decision exists.

## Review architecture, not formatting

Automate formatting and basic correctness with:

- formatter;
- TypeScript;
- ESLint;
- React Hooks/Compiler rules;
- tests;
- CI.

Human review should focus on questions tools cannot answer well:

- Is state owned correctly?
- Does this Effect model real synchronization?
- Is this API easy to misuse?
- Does the feature respect domain boundaries?
- Is accessibility correct?
- Is the security boundary enforced?
- Is failure/retry behavior designed?
- Will this create future coupling?

## Define review expectations

Large teams benefit from explicit conventions.

For example:

```text
React PR checklist
- no unnecessary Effect-derived state
- stable keys
- semantic HTML/accessibility
- runtime validation at network boundaries
- tests at the correct level
- new shared APIs documented
- observability for critical flows
- migration note for breaking changes
```

The checklist should capture recurring production lessons, not every style preference.

## Ownership should be visible

Use mechanisms such as:

- CODEOWNERS;
- package ownership metadata;
- service catalog;
- docs pages;
- on-call routing;
- design-system maintainers.

When a critical shared component fails, the organization should know who can make a safe decision quickly.

## Avoid circular ownership

A problematic architecture looks like:

```text
Team A feature imports Team B internals
Team B imports Team C shared state
Team C depends on Team A UI helper
```

This makes releases and refactors political and technical bottlenecks.

Strive for dependency direction.

```text
platform/design system
        ↓
shared domain libraries
        ↓
features
        ↓
route/application composition
```

Exact layering varies, but cycles should trigger architectural review.

## Shared Context can create organizational coupling

A global Context is easy to add to:

```jsx
<AppContext value={{
  user,
  theme,
  locale,
  billing,
  search,
  experiments,
  notifications,
}}>
```

Over time it becomes an invisible dependency graph.

Prefer focused providers:

```jsx
<AuthProvider>
  <ThemeProvider>
    <BillingRoute />
  </ThemeProvider>
</AuthProvider>
```

And avoid provider scope broader than needed.

## Stable APIs matter more than stable internals

Teams should be free to refactor implementation while preserving contracts.

Good internal change:

```text
useReducer
→ state machine
→ server cache
```

Consumers should not care if the public feature API remains stable.

This is the same reason applications should not depend on Fiber internals.

## Version shared packages deliberately

For monorepos, versioning may be implicit in one atomic commit.

For separately released packages, define:

- semver policy;
- supported React versions;
- peer dependency rules;
- deprecation period;
- codemods where possible;
- migration docs.

Do not silently break component semantics in a minor package release.

## Deprecation should have an exit path

Bad:

```ts
/** @deprecated */
export function OldModal() {}
```

with no replacement.

Better:

```ts
/**
 * @deprecated Use Dialog from @company/ui-dialog.
 * Removal target: v8.
 * Migration: go/ui-dialog-migration
 */
```

Then track remaining usage.

## Prefer migrations over permanent dual systems

During migration, two patterns may coexist.

But define:

```text
new code uses pattern B
existing A migrates when touched
critical A paths scheduled explicitly
A removed after usage reaches zero
```

Without an end condition, "temporary" systems become permanent complexity.

## Feature flags need ownership

Every flag should have:

- owner;
- purpose;
- creation date;
- expected removal date;
- default state;
- telemetry.

Stale flags multiply test states and can create server/client rendering mismatches.

## Large-team performance governance

Performance should not depend on one expert reviewing every PR.

Establish budgets and automated signals where practical:

- route bundle budgets;
- Core Web Vitals targets;
- error-rate thresholds;
- hydration error monitoring;
- performance regression tests for critical surfaces;
- dependency-size review.

Teams still profile locally for specific issues, but organization-wide guardrails catch regressions early.

## Testing policy should define confidence, not percentages

A blanket "80% coverage" target can produce weak tests.

Define what critical features require:

```text
unit
→ pure domain logic

component/integration
→ React behavior and accessibility

E2E
→ revenue/security/critical workflows
```

Require regression tests for production incidents when feasible.

## Error Boundary strategy should be consistent

If every team invents its own boundary behavior, the application becomes inconsistent.

Shared guidance can define:

- where route-level boundaries belong;
- fallback design primitives;
- retry semantics;
- error telemetry;
- correlation IDs;
- accessibility behavior;
- what errors should not be thrown.

Product features still choose meaningful boundary granularity.

## Security ownership is cross-cutting

Security cannot be delegated only to the backend team.

Frontend teams own:

- safe HTML rendering;
- client secret exposure;
- third-party scripts;
- URL handling;
- privacy-safe telemetry;
- correct Server Function usage;
- avoiding authorization assumptions in UI.

Backend/platform teams own complementary enforcement.

## RFCs for high-impact changes

Use lightweight RFCs when a change affects many teams.

Examples:

- switching routing framework;
- adopting RSC across the app;
- replacing global state layer;
- introducing design-system v2;
- Compiler rollout across monorepo;
- moving from CSR to streaming SSR.

An RFC should include migration cost and failure modes, not only the happy-path API.

## Senior engineers create leverage

A senior engineer's impact is not measured only by code volume.

High-leverage work includes:

- removing a dangerous abstraction;
- documenting a migration path;
- adding a CI guardrail;
- fixing an ownership boundary;
- making incidents diagnosable;
- mentoring teams on state/effect architecture;
- creating a reusable accessible primitive;
- simplifying dependency direction.

## Interview questions

### What makes code suitable for a shared component library?

It represents a stable, reusable contract with clear ownership and sufficient accessibility/testing/versioning discipline—not merely duplicated JSX.

### How would you prevent a global store from becoming a dumping ground?

Define state categories and domain ownership, keep local/URL/server state in appropriate places, expose focused feature APIs, and review new global writes as architecture changes.

### Why use ADRs?

They preserve decision context and trade-offs so future teams understand why the architecture exists and when it can change.

### How do you migrate a pattern across many teams?

Define the target, new-code rule, compatibility layer if needed, codemod/tooling, ownership, metrics, and deletion criteria.

## Exercise

Design the frontend governance model for a 60-engineer React monorepo.

Define:

- feature/module boundaries;
- design-system ownership;
- shared state policy;
- testing requirements;
- Error Boundary strategy;
- dependency/version policy;
- ADR/RFC process;
- performance budgets;
- migration/deprecation process;
- production ownership/on-call routing.
