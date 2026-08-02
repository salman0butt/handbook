---
title: Testing JavaScript
description: Unit, integration, browser, contract and end-to-end testing with deterministic design.
slug: /javascript/testing/testing-javascript
---

# Testing JavaScript

Tests create confidence by checking observable behavior at useful boundaries. A portfolio should contain many fast focused tests, fewer integration tests and a small set of high-value end-to-end journeys—not a rigid universal pyramid.

## Test levels

- unit: one cohesive function/module with controlled collaborators;
- integration: several real modules or a real external boundary such as a database adapter;
- contract: producer/consumer expectations or interchangeable implementations;
- browser/component: DOM behavior, accessibility and network interaction;
- end-to-end: deployed-like user journeys;
- performance/security/accessibility: specialized quality properties.

## Arrange, act, assert

```javascript
import test from 'node:test'
import assert from 'node:assert/strict'

test('calculateTotal applies tax after subtotal', () => {
  const lines = [{price: 100, quantity: 2}]
  const total = calculateTotal(lines, 0.1)
  assert.equal(total, 220)
})
```

Node’s built-in runner is stable and suitable for many Node projects. Vitest integrates well with Vite-style projects; Jest has a broad ecosystem; Playwright drives modern browsers; Cypress provides an interactive browser-testing workflow; Testing Library encourages user-observable queries. Select by environment and constraints rather than declaring one universally best.

## Test doubles

A stub supplies data, a spy records interaction, a mock encodes an interaction expectation, and a fake provides a lightweight working implementation. Over-mocking internal methods makes refactoring expensive; prefer real pure modules and fake external adapters.

## Time and async behavior

Fake timers make deadlines deterministic, but they can diverge from host scheduling. Advance timers and microtasks deliberately, restore real time, and keep some real-browser tests for integration semantics.

```javascript
await assert.rejects(
  () => fetchWithRetry({signal: AbortSignal.abort()}),
  {name: 'AbortError'},
)
```

Avoid arbitrary sleeps. Wait for observable state with a bounded timeout.

## DOM and accessibility

Query by role, accessible name, label and visible text. Test keyboard navigation, focus movement, validation announcements and cleanup. Snapshot tests can detect broad changes but should not replace semantic assertions.

## Property and mutation testing

Property-based testing generates cases for invariants such as round trips and ordering. Mutation testing checks whether tests detect intentional defects. Both are valuable for pure logic but require runtime budgets and careful generators.

## Coverage and flakiness

Coverage reveals unexecuted code, not assertion quality. Treat flaky tests as defects: identify shared state, nondeterministic time, unordered concurrency, environmental dependency and weak waiting conditions.

## Primary references

- [Node.js test runner](https://nodejs.org/api/test.html)
- [Vitest](https://vitest.dev/guide/)
- [Jest](https://jestjs.io/docs/getting-started)
- [Playwright](https://playwright.dev/docs/intro)
- [Cypress](https://docs.cypress.io/)
- [Testing Library](https://testing-library.com/docs/)
