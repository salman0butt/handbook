---
title: Production React Testing Strategy
description: Design a maintainable testing portfolio across pure logic, components, integration, accessibility, end-to-end flows, SSR, and production regressions.
sidebar_position: 3
---

# Production React Testing Strategy

A healthy React test suite is a portfolio. Different tests answer different questions, and no single layer should carry every kind of confidence.

> **Mental model:** test pure logic cheaply, component behavior semantically, boundaries realistically, and critical user journeys end to end.

## 1. Start from risk, not a quota

Do not target a fixed ratio because a diagram says every project needs exactly the same pyramid.

Ask:

- What failures would harm users most?
- Which logic is complex enough to deserve direct unit tests?
- Which integrations have failed before?
- Which journeys generate revenue or security impact?
- Which accessibility behaviors are easy to regress?
- Which server/client boundaries are difficult to reason about?

Testing strategy is risk management.

## 2. Pure logic tests

Good targets:

- reducers;
- parsers;
- validators;
- selectors;
- state-machine transitions;
- formatters;
- permission calculations;
- cache-key construction.

Example:

```tsx
expect(cartReducer(state, { type: 'itemRemoved', id: '42' })).toEqual(expected);
```

These tests are fast because React and the DOM are not required.

## 3. Component behavior tests

Use a DOM environment for contracts such as:

- rendering meaningful content;
- user interactions;
- controlled input behavior;
- loading/error states;
- focus changes;
- accessible names and roles;
- provider integration;
- optimistic UI.

These are the core of a typical React application suite.

## 4. Integration tests

An integration test includes multiple real application pieces:

```text
route
  + providers
  + form
  + data client
  + mocked network boundary
  + real component tree
```

This can catch:

- wrong context wiring;
- invalid route state;
- serialization assumptions;
- stale cache interactions;
- mutation + revalidation bugs;
- focus regressions after navigation.

Do not mock every layer inside an integration test.

## 5. End-to-end tests

Use a real browser for critical workflows such as:

- sign in;
- checkout;
- account creation;
- destructive confirmation flows;
- file upload;
- payment completion;
- permissions/role changes;
- complex keyboard interactions;
- SSR hydration regressions that depend on browser behavior.

End-to-end tests are expensive, so prioritize user journeys with high business or safety impact.

## 6. Test the network boundary realistically

A robust integration setup should allow scenarios such as:

```text
200 success
400 validation failure
401 unauthenticated
403 unauthorized
404 missing resource
409 conflict
500 server failure
slow response
network error
aborted request
```

React UI often fails not because the happy path is wrong, but because the transition between these states was not modeled.

## 7. Test error recovery

Do not stop at showing an error.

If the product supports retry:

1. make the first request fail;
2. assert useful feedback;
3. activate Retry;
4. make the next request succeed;
5. assert recovery.

This protects the complete state machine.

## 8. Test cancellation where cancellation is part of behavior

For search, navigation, streaming, or request-lifetime work, cancellation may matter.

Test the observable invariant:

- stale results do not replace newer results;
- aborted work does not show an error toast;
- leaving a screen stops a subscription;
- old server responses cannot overwrite current state.

Avoid testing internal AbortController details unless your library API specifically exposes them.

## 9. SSR and hydration tests

Hydration bugs are consistency bugs.

Important scenarios:

- server HTML and first client render agree;
- generated IDs remain consistent;
- browser-only code is not read during server render;
- locale/time data is serialized deliberately;
- hydration warnings are not hidden with `suppressHydrationWarning` without understanding the cause.

A framework may provide dedicated test utilities. For critical flows, a browser-level test can reveal mismatches that a pure DOM test environment cannot.

## 10. Server Components

Test RSC applications at useful boundaries:

- server data query or domain service;
- rendered route behavior through framework integration tests;
- serialization-safe props across client boundaries;
- Server Function authorization and validation;
- client interactivity after the boundary.

Do not write tests that depend on private RSC wire format unless you are building framework infrastructure.

## 11. Server Functions need backend tests too

A Server Function is a server mutation boundary.

Test:

- authentication;
- authorization;
- runtime input validation;
- duplicate submissions/idempotency when relevant;
- transaction behavior;
- error mapping;
- cache/revalidation effects.

A button-click component test alone is not sufficient protection for a mutation endpoint.

## 12. Accessibility testing is a layer, not one tool

A complete accessibility strategy may include:

1. semantic Testing Library queries;
2. automated accessibility checks;
3. keyboard interaction tests;
4. focus assertions;
5. contrast/design review;
6. manual screen-reader checks for important custom widgets;
7. real-device/browser checks where needed.

Automated tools can catch many structural issues but cannot judge the entire user experience.

## 13. Visual regression testing

Useful for:

- design-system primitives;
- layout-heavy pages;
- theme changes;
- responsive breakpoints;
- complex charts;
- high-risk CSS refactors.

Visual tests answer "did appearance change?" They do not replace behavioral or accessibility assertions.

## 14. Contract tests for reusable component libraries

For a design system, test:

- native prop forwarding;
- ref behavior;
- accessible names;
- keyboard interactions;
- focus management;
- controlled/uncontrolled modes;
- TypeScript public contracts;
- SSR/hydration compatibility where supported.

A component can look correct while breaking its public DOM or typing contract.

## 15. Type tests are not runtime tests

Type-level example:

```tsx
<Button tone="primary" />; // compiles
```

Invalid usage might be checked with a compile-time testing tool:

```tsx
// expected type error
<Button tone="not-real" />;
```

This proves the public type surface.

It does not prove:

- the button renders;
- click behavior works;
- the role/name is correct;
- focus works;
- the CSS is correct.

## 16. Avoid coverage-driven bad tests

Code coverage can reveal unexecuted areas, but 100% coverage is not equivalent to 100% confidence.

Weak test:

```tsx
render(<Widget />);
```

It may execute many lines while asserting nothing useful.

Use coverage as a diagnostic signal, not as the definition of quality.

## 17. Flaky tests are defects

A flaky test damages trust in the suite.

Common causes:

- real timers when deterministic control is possible;
- arbitrary sleeps;
- leaking state across tests;
- shared mutable fixtures;
- unawaited user interactions;
- order-dependent network mocks;
- unstable selectors;
- asserting scheduler/render counts;
- depending on system time/timezone;
- not cleaning global browser mocks.

Fix flakiness instead of adding blind retries.

## 18. Deterministic test data

Prefer factories:

```tsx
function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-1',
    name: 'Aisha',
    email: 'aisha@example.com',
    ...overrides,
  };
}
```

Avoid giant shared fixture objects that every test mutates differently.

## 19. Test state ownership boundaries

If URL state owns the selected tab, test through navigation/location.

If server state owns orders, test request/cache behavior.

If local state owns a tooltip, test the component directly.

The test layer should match the actual owner of the state.

## 20. Do not duplicate the same assertion at every layer

A reducer formula may need a unit test.

The end-to-end checkout test does not need to re-prove every reducer branch.

Conversely, a reducer unit test does not prove checkout works in a browser.

Each layer should protect different failure modes.

## 21. Production incidents should create regression tests

When a bug reaches production:

1. reproduce it with the smallest meaningful failing test;
2. fix the bug;
3. keep the test as a regression contract;
4. consider whether the failure reveals a missing class of tests elsewhere.

This steadily aligns the suite with real risk.

## 22. CI strategy

A practical pipeline can separate:

```text
fast checks
  typecheck
  lint
  pure unit tests
  component tests

slower checks
  integration tests
  visual tests
  end-to-end tests
  cross-browser checks
```

Exact stages depend on repository size and deployment risk.

Run the fastest high-signal checks early so failures are cheap to diagnose.

## 23. Test failures should explain themselves

Prefer semantic queries and focused assertions because Testing Library failure output includes DOM context.

Avoid custom helpers that swallow useful error messages.

A failed test should make the broken contract obvious.

## 24. What not to test

Usually do not test:

- React itself;
- TypeScript itself;
- that `useState` updates state;
- that a third-party library's documented internal method was called, unless your integration contract depends on it;
- trivial getters/setters with no domain behavior;
- exact implementation sequence when only the final behavior matters.

Spend test budget where your code can be wrong.

## 25. Review checklist for a feature

Before calling a feature well-tested, ask:

- Are its domain transitions covered?
- Are important user behaviors covered?
- Are failure and retry paths covered?
- Are async boundaries deterministic?
- Are permissions tested server-side?
- Is keyboard/focus behavior protected?
- Are TypeScript contracts tested if this is a reusable API?
- Is at least one critical full journey covered in a real browser when appropriate?
- Would a regression test catch the bug we fear most?

## Exercise

Design a test plan for an e-commerce checkout feature containing:

- cart reducer logic;
- address form;
- payment iframe integration;
- async order mutation;
- optimistic status display;
- server authorization;
- keyboard-accessible error summary;
- confirmation route.

Place each risk at the most useful test layer and explain what you would mock.

## Interview questions

1. How do unit, component, integration, and end-to-end React tests differ?
2. What should determine the testing mix for a product?
3. Why should Server Functions receive backend mutation tests?
4. Which hydration problems need browser-level confidence?
5. Why are type tests and runtime tests complementary?
6. What causes flaky React tests most often?
7. How should production incidents influence the test suite?
8. Why is code coverage a signal rather than a quality target?

## References

- https://react.dev/reference/react/act
- https://testing-library.com/docs/react-testing-library/intro/
- https://testing-library.com/docs/queries/about/
- https://www.w3.org/WAI/ARIA/apg/
