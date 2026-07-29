---
title: Vitest, Jest, React Testing Library & Component Testing
sidebar_position: 2
description: Set up practical unit and component tests for Next.js with Vitest or Jest, React Testing Library, user-centred assertions, controlled mocks, and current async Server Component limits.
---

# Vitest, Jest, React Testing Library & Component Testing

Next.js supports multiple testing stacks.

The current official guides document:

```text
Vitest + React Testing Library
Jest + React Testing Library
Playwright
Cypress
```

Do not treat the choice between Vitest and Jest as the architecture decision.

The deeper decision is:

```text
what environment does this behaviour require?
```

## 1. Vitest current setup

The official Next.js Vitest guide uses:

```text
vitest
@vitejs/plugin-react
jsdom
@testing-library/react
@testing-library/dom
vite-tsconfig-paths   // TypeScript path aliases
```

Example:

```ts
// vitest.config.mts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
})
```

Setup:

```ts
// vitest.setup.ts
import '@testing-library/jest-dom/vitest'
```

Package script:

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

Use watch mode locally and deterministic run mode in CI.

## 2. Jest current setup

Next.js includes `next/jest` integration.

```ts
// jest.config.ts
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}

export default createJestConfig(config)
```

```ts
// jest.setup.ts
import '@testing-library/jest-dom'
```

`next/jest` handles important Next-specific setup such as compiler transforms, styles/image/font mocking, `.next` exclusions, environment loading, and `next.config` transform flags.

## 3. Vitest or Jest?

A practical decision table:

| Need | Vitest | Jest |
| --- | --- | --- |
| fast modern ESM-oriented runner | strong fit | possible |
| existing mature Jest suite | migration may not pay | strong fit |
| `next/jest` integration | no | yes |
| React Testing Library | yes | yes |
| async Server Component full support | no | no |

Choose based on repository constraints, ecosystem compatibility, team familiarity, and migration cost.

## 4. Current async Server Component limitation

At the current stable baseline, official Next.js docs explicitly state that **Vitest and Jest do not fully support async Server Components** and recommend E2E tests for them.

Do not invent a brittle custom renderer and then assume it matches Next.js production behaviour.

Prefer:

```text
sync presentational Server Component → unit/component test can be useful
async route Server Component         → E2E for framework composition
extracted pure data/policy helpers   → unit/integration tests
```

## 5. React Testing Library philosophy

React Testing Library encourages tests that resemble how users interact with the UI.

Prefer queries such as:

```ts
screen.getByRole('button', { name: /save/i })
screen.getByLabelText(/email/i)
screen.getByText(/saved/i)
```

Avoid implementation-oriented selectors such as:

```ts
container.querySelector('.primary-btn')
component.instance().state
```

Accessible queries improve both test resilience and UI semantics.

## 6. Use `user-event` for interactions

For realistic browser-like interactions in component tests:

```ts
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'

it('submits the search form', async () => {
  const user = userEvent.setup()

  render(<SearchForm />)

  await user.type(screen.getByRole('textbox', { name: /search/i }), 'next')
  await user.click(screen.getByRole('button', { name: /search/i }))

  expect(screen.getByText(/results for next/i)).toBeInTheDocument()
})
```

Prefer user-level behaviour over directly invoking handlers.

## 7. Client Component test example

```tsx
'use client'

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount((value) => value + 1)}>
      Count: {count}
    </button>
  )
}
```

Test:

```ts
it('increments', async () => {
  const user = userEvent.setup()
  render(<Counter />)

  const button = screen.getByRole('button', { name: 'Count: 0' })
  await user.click(button)

  expect(screen.getByRole('button', { name: 'Count: 1' })).toBeInTheDocument()
})
```

## 8. Test synchronous Server Components only when the boundary is real

A synchronous Server Component without request-time framework dependencies can often be rendered as ordinary React output.

But be careful when it imports:

```text
cookies()
headers()
redirect()
notFound()
server-only modules
framework data caches
```

If you mock all of these, you may no longer be testing the behaviour you think you are testing.

## 9. Hooks belong to client boundaries

A custom hook can be tested by:

```text
rendering a small test component
or
using supported hook test helpers
```

Prefer exercising visible behaviour when the hook exists only to power a component.

Unit-test a hook directly when it represents reusable state logic with meaningful contracts.

## 10. Mock only external uncertainty

Good mock candidates:

```text
payment provider SDK
email gateway
clock
random ID generator
browser API unavailable in jsdom
remote HTTP client
```

Weak mock candidates:

```text
your own pure functions
all child components
all domain policy
React internals
Next routing behaviour you actually need confidence in
```

Mocks should remove irrelevant uncertainty, not remove the product.

## 11. Mock at module boundaries deliberately

Vitest:

```ts
vi.mock('@/lib/email', () => ({
  sendWelcomeEmail: vi.fn(),
}))
```

Jest:

```ts
jest.mock('@/lib/email', () => ({
  sendWelcomeEmail: jest.fn(),
}))
```

Reset or restore mocks between tests.

Global mutable mocks are a common source of order-dependent failures.

## 12. Network mocking with MSW-style boundaries

For client/network integration tests, a request-level mock can be more realistic than mocking `fetch` everywhere.

Conceptually:

```text
component
→ real fetch call
→ mock HTTP boundary
→ deterministic response
```

Benefits:

- request URL is exercised
- method/headers/body can be asserted
- application networking code stays real
- failure modes are easier to model

Do not use network mocking to pretend an E2E test reached a real backend when it did not.

## 13. Test loading, success, empty, and failure states

For a client data view:

```text
loading
success
empty
recoverable error
unauthorized
validation error
```

A single happy-path render test does not prove the component contract.

## 14. Test accessibility through semantics

Component tests can catch:

```text
missing accessible name
wrong role
broken label association
button disabled state
focus after interaction
aria-expanded state
error description relationship
```

Example:

```ts
expect(screen.getByRole('dialog')).toHaveAccessibleName('Delete project')
```

## 15. Avoid brittle timing

Bad:

```ts
await new Promise((resolve) => setTimeout(resolve, 500))
```

Prefer:

```ts
await screen.findByText(/saved/i)
await waitFor(() => expect(api).toHaveBeenCalled())
```

For actual timers:

```ts
vi.useFakeTimers()
```

or Jest equivalents.

Always restore real timers after the test.

## 16. Control system time

Date-sensitive logic should not depend on the CI machine clock.

Vitest:

```ts
vi.useFakeTimers()
vi.setSystemTime(new Date('2026-07-01T12:00:00Z'))
```

This is especially useful for:

```text
expiry
relative time
booking windows
session age
scheduled UI
```

## 17. Avoid testing third-party libraries through your suite

If a component wraps a trusted UI library, test **your contract**:

```text
what props you pass
what user behaviour you expose
what fallback you own
```

Do not reproduce the dependency's own internal test suite.

## 18. Snapshot testing has narrow value

Jest supports snapshot testing, but a giant HTML snapshot often produces noisy reviews.

Prefer snapshots for small stable structures.

For user behaviour, explicit assertions are clearer.

## 19. Coverage thresholds should reflect risk

A useful policy can distinguish:

```text
critical domain modules → high branch coverage
UI glue                 → lower numeric target
E2E-only RSC composition → not judged solely by unit coverage
```

One global percentage can incentivize low-value tests.

## 20. Test file placement

The official Vitest guide allows common `__tests__` folders or colocated tests in the App Router.

Choose one repository convention and keep route files unambiguous.

Examples:

```text
src/components/Button.test.tsx
src/features/billing/__tests__/policy.test.ts
__tests__/app-shell.test.tsx
```

## 21. Test environment matters

Use:

```text
jsdom → component/browser-DOM-like tests
node  → server/domain modules without DOM needs
real browser → layout, navigation, hydration, browser APIs
```

Do not use jsdom to prove browser layout, paint, focus timing, or full navigation behaviour.

## Production checklist

- [ ] runner choice matches repository needs
- [ ] async Server Components are not forced into unsupported unit tooling
- [ ] RTL queries use accessible user-facing semantics
- [ ] mocks sit at meaningful external boundaries
- [ ] timers/time/randomness are controlled
- [ ] failure and empty states are covered
- [ ] test environment matches the behaviour
- [ ] snapshots remain small and intentional
- [ ] coverage thresholds do not reward meaningless tests

## Interview questions

### What does `next/jest` configure for you?

It integrates Jest with the Next.js compiler/configuration model, including transforms, common asset/style/font mocks, environment loading, `.next` exclusion, and Next config flags.

### Why prefer `getByRole` over CSS selectors?

It tests the semantic interface users and assistive technology interact with, making tests more resilient to implementation refactors and more likely to catch accessibility problems.

### Why is jsdom not enough for all Next.js tests?

jsdom does not reproduce the complete browser, Next.js server runtime, routing, RSC protocol, streaming, hydration, cache, or production-build behaviour.
