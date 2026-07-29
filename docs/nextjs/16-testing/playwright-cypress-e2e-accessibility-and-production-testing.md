---
title: Playwright, Cypress, E2E & Accessibility Testing
sidebar_position: 7
description: Build production-like browser confidence with Playwright or Cypress, resilient locators, isolated state, accessibility checks, cross-browser strategy, diagnostics, and critical user journeys.
---

# Playwright, Cypress, E2E & Accessibility Testing

End-to-end tests are where the whole Next.js application becomes real:

```text
browser
→ routing
→ server render
→ RSC
→ hydration
→ network
→ database/services
→ user-visible outcome
```

Use them selectively for behaviour lower layers cannot prove.

## 1. Playwright current Next.js guidance

The official App Router guide supports Playwright for E2E testing and recommends testing against production code for behaviour closer to production.

A production-like flow:

```bash
pnpm build
pnpm start
pnpm exec playwright test
```

Playwright can also start the server through its `webServer` configuration.

## 2. Minimal Playwright config

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'pnpm start',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
```

Build the app before this config runs in CI when `pnpm start` expects `.next` output.

## 3. Prefer semantic locators

Good:

```ts
page.getByRole('button', { name: 'Create project' })
page.getByLabel('Email')
page.getByRole('heading', { name: 'Dashboard' })
```

Fragile:

```ts
page.locator('.btn-primary:nth-child(3)')
```

A test ID is appropriate when there is no meaningful user-facing semantic locator.

## 4. Let Playwright auto-wait

Avoid:

```ts
await page.waitForTimeout(1000)
```

Prefer assertions that wait for the condition:

```ts
await expect(page.getByText('Saved')).toBeVisible()
```

Manual sleeps create slow flaky suites.

## 5. Isolate test state

Each test should own its data.

Useful patterns:

```text
API/setup fixture creates data
unique test namespace
transaction/test database reset
per-worker tenant/account
cleanup after test when necessary
```

Avoid one giant shared account that parallel tests mutate.

## 6. Authentication setup

Browser tests often need authenticated state.

Possible pattern:

```text
setup project
→ sign in once using a controlled test user
→ save storage state
→ reuse for tests that do not test login itself
```

Keep separate tests for the actual sign-in flow.

Do not bypass authorization in application code simply to speed up E2E.

## 7. Prefer API fixtures over UI setup for unrelated prerequisites

If a test is about editing a project, it need not spend 20 UI steps creating the project first.

Use a trusted test fixture/API/database setup for prerequisites, then exercise the UI behaviour under test.

Use UI setup when the setup flow itself is what you are testing.

## 8. Network interception has two roles

Browser interception can help test:

```text
third-party outage
slow response
specific error status
client retry behaviour
```

But a fully mocked E2E suite is no longer proving full-system integration.

Keep a smaller set of tests against real test services/infrastructure.

## 9. Trace failures

High-value diagnostics include:

```text
Playwright trace
screenshots
video for selected failures
browser console
network errors
server logs
request/trace IDs
```

A failing CI test should answer “what happened?” without requiring blind reruns.

## 10. Screenshots are evidence, not assertions by default

Screenshot/visual regression testing is useful for:

```text
design system components
critical layouts
responsive breakpoints
email/document rendering
```

Visual baselines need controlled fonts, viewport, OS/browser, data, animation, and time.

## 11. Cypress current Next.js guidance

The official App Router Cypress guide supports both:

```text
E2E testing
Component testing
```

It also recommends running E2E against production code where possible:

```bash
pnpm build
pnpm start
```

then execute Cypress.

## 12. Playwright or Cypress?

Choose one primary E2E platform unless there is a clear reason to maintain two.

| Concern | Playwright | Cypress |
| --- | --- | --- |
| Chromium/Firefox/WebKit API | strong | supported ecosystem-dependent details |
| E2E | yes | yes |
| component testing | ecosystem capability | official Next guide includes it |
| existing team suite | migration cost matters | migration cost matters |

The test architecture matters more than tool tribalism.

## 13. E2E journey selection

Good E2E candidates:

```text
sign in → protected dashboard
create → view → edit critical resource
checkout/payment sandbox path
invite teammate
role change access
file upload/download
critical search/navigation
logout/session revoke
```

Do not mirror every component test in the browser.

## 14. Accessibility automated checks

A browser accessibility scanner can catch classes such as:

```text
missing names
invalid ARIA
colour contrast issues detectable by tool
landmark problems
form label problems
```

Run checks on representative page states, including open dialogs and validation errors.

Automated scanners do not prove complete accessibility.

## 15. Keyboard testing

For critical interactive UI verify:

```text
Tab order
Enter/Space activation
Escape closes dialog
focus trap where appropriate
focus restoration
arrow/mobile navigation
```

These are real browser behaviours.

## 16. Screen reader semantics

You can assert the accessibility tree indirectly through roles, names, states, and relationships.

Examples:

```ts
await expect(page.getByRole('dialog', { name: 'Delete project' })).toBeVisible()
await expect(page.getByRole('button', { name: 'Delete' })).toBeEnabled()
```

Manual screen-reader review remains valuable for critical workflows.

## 17. Responsive testing

Use representative viewports, not every device model.

Example set:

```text
small mobile
large mobile/tablet
common desktop
wide desktop for data-heavy apps
```

Test functionality, overflow, navigation reachability, and modal usability.

## 18. Cross-browser strategy

Full matrix on every PR may be expensive.

A balanced model:

```text
PR → Chromium full critical suite
PR → Firefox/WebKit smoke subset
nightly/release → broader matrix
```

Adjust based on user/browser distribution and risk.

## 19. Production mode catches different failures

Production builds can reveal:

```text
build-time errors
server/client bundling differences
minification issues
cache/render differences
prefetch behaviour
source-map/release issues
```

That is why dev-only E2E is incomplete.

## 20. Do not test external providers through their public production systems

Use:

```text
provider sandbox
local fake server
contract fixture
recorded non-sensitive test payload
```

Avoid real charges, real emails, production webhooks, or customer accounts.

## 21. Critical smoke suite

A deployment smoke suite can remain tiny:

```text
home/public route loads
sign-in endpoint reachable
protected route correctly gates
one read path works
one mutation path works
static assets load
health/readiness endpoint works if owned
```

Smoke is not full regression coverage.

## Production checklist

- [ ] critical E2E runs against production build
- [ ] semantic locators dominate
- [ ] arbitrary sleeps are absent
- [ ] test state is isolated for parallelism
- [ ] authentication setup is efficient but secure
- [ ] traces/screenshots/logs are available on failure
- [ ] accessibility includes semantic + keyboard checks
- [ ] cross-browser matrix reflects actual risk
- [ ] provider integrations use sandboxes/test doubles
- [ ] deployment smoke suite remains fast

## Interview questions

### Why run E2E against `next build` + `next start`?

Because production compilation, bundling, rendering, caching, and runtime behaviour can differ from `next dev`; production-like E2E catches those integration failures.

### Why are semantic locators better than CSS selectors?

They reflect user-facing accessibility semantics, survive styling/markup refactors better, and make tests reveal missing accessible names or roles.

### Should every E2E test run in three browsers?

Not necessarily. Use the browser matrix according to user distribution, browser-specific risk, and CI cost; broad Chromium plus targeted cross-browser smoke is often a practical starting point.
