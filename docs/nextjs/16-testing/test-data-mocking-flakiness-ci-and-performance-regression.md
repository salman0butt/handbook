---
title: Test Data, Mocks, Flakiness, CI & Performance Regression
sidebar_position: 8
description: Build deterministic, parallel-safe Next.js test infrastructure with realistic fixtures, controlled external dependencies, CI layering, flake diagnosis, and regression budgets.
---

# Test Data, Mocks, Flakiness, CI & Performance Regression

A test suite can contain correct assertions and still be untrustworthy because its infrastructure is unstable.

Production-quality testing requires engineering around:

```text
state
time
randomness
network
parallelism
external services
CI evidence
```

## 1. Every test owns its state

A strong default:

```text
arrange isolated state
→ execute behaviour
→ assert
→ cleanup or discard environment
```

Avoid hidden dependence on suite order.

## 2. Test data builders

Prefer intention-revealing builders:

```ts
const user = makeUser({ role: 'member', tenantId: tenant.id })
const invoice = makeInvoice({ tenantId: tenant.id, status: 'open' })
```

Builders should provide safe defaults while letting each test show the fields relevant to the scenario.

## 3. Avoid mystery fixtures

Weak:

```text
seed-v14-final-final.json
```

where hundreds of records exist and no test explains which ones matter.

Better:

```text
small scenario fixture
explicit relationship
unique test namespace
```

## 4. Database isolation strategies

Options include:

```text
transaction rollback
schema/database per worker
container per suite
unique tenant prefix + cleanup
snapshot/restore
```

Pick based on database/runtime constraints.

Parallel tests must not mutate the same rows unless concurrency is the behaviour under test.

## 5. Stable IDs

Random UUIDs are useful for isolation but can make diagnostics hard.

Consider a deterministic namespace:

```text
test name + worker id + generated suffix
```

Never use predictable production identifiers as a security assumption.

## 6. Control time

Tests involving:

```text
session expiry
cache age
booking windows
rate limits
relative dates
scheduled jobs
```

should use fake clocks or injectable clocks where possible.

Do not sleep until a token “really expires.”

## 7. Control randomness

Randomness can be injected:

```ts
function chooseVariant(random = Math.random) { ... }
```

Tests can provide deterministic values.

For property-based tests, log the failing seed so the failure can be reproduced.

## 8. External-service test pyramid

For a provider:

```text
unit → mock adapter boundary
contract/integration → provider sandbox or fake server
E2E → representative sandbox flow
```

Examples:

```text
payments
email
SMS
OAuth provider
storage
search engine
```

Do not make every PR depend on the public internet.

## 9. Contract fixtures

Record or hand-build representative provider payloads with sensitive data removed.

Version them when the provider schema changes.

Test:

```text
required fields
unknown fields
missing optional fields
new enum/value behaviour
signature/raw-body contract where applicable
```

## 10. Mock the boundary you own

If your code owns:

```text
PaymentGateway interface
```

mock that interface for domain tests.

If the HTTP client adapter is under test, do not mock the adapter itself; fake the HTTP service.

## 11. Flake taxonomy

A flaky test usually belongs to a class:

```text
timing/race
shared state
network/provider
resource exhaustion
unstable selector
environment mismatch
clock/timezone
random data
order dependence
browser rendering
```

Classify before “fixing.”

## 12. Retries are diagnostics, not repairs

A CI retry can reveal intermittent failures and reduce transient noise, but it must not hide product races.

Track:

```text
first-attempt failure rate
retry pass rate
test name
release
worker/browser
```

Quarantine only with an owner and repair deadline.

## 13. Do not solve flake with sleeps

Bad:

```ts
await page.waitForTimeout(2000)
```

Better:

```text
wait for semantic UI condition
wait for known request/state transition
control dependency completion
```

A sleep adds latency and still fails on slower CI.

## 14. Parallelism exposes architecture problems

A suite that only passes serially may have:

```text
global mutable fixtures
shared user account
shared file path
shared cache keys
non-isolated database rows
fixed ports
```

Use parallelism deliberately and remove accidental global state.

## 15. CI layers

A practical pull-request pipeline:

```text
lint/typecheck
→ unit/component
→ integration
→ production build
→ critical E2E
```

Heavy cross-browser, load, or full regression suites can run on merge/nightly/release according to risk.

## 16. Fail fast without hiding evidence

Parallel CI jobs shorten feedback, but preserve artifacts from every failed job.

Useful artifacts:

```text
JUnit/test report
coverage
Playwright trace
screenshots
server logs
browser console
build log
performance output
```

## 17. Environment variables in tests

Use dedicated test configuration.

Never expose production secrets to untrusted PR workflows.

For fork PRs:

```text
run secret-free tests
skip/replace protected integration jobs
run protected jobs only in trusted context
```

Security of CI credentials is part of test architecture.

## 18. Cache dependencies carefully

CI dependency caches can speed builds, but do not cache mutable test state accidentally.

Key package caches by lockfile and environment/tool version as appropriate.

Test DB contents and browser storage should not leak between unrelated runs.

## 19. Performance regression tests

Phase 15 established performance budgets.

Testing can enforce stable signals such as:

```text
client JS bytes
RSC/HTML payload size
query count
critical API p95 in controlled load test
image dimensions/asset size
Lighthouse range in controlled environment
```

Avoid noisy hard gates on uncontrolled internet/network timing.

## 20. Bundle budgets

A CI job can compare route/client bundle output with a baseline.

Policy example:

```text
unexpected +30 KB initial JS → fail/review
known intentional increase    → update budget with explanation
```

Do not optimize only total repository package size; route delivery matters.

## 21. Query-count budgets

For a critical list route:

```text
expected <= 3 queries
```

can catch N+1 regressions more deterministically than a noisy latency threshold.

Use such assertions only where query count is a meaningful stable contract.

## 22. Accessibility regression in CI

Run automated browser scans on representative states.

Combine with:

```text
semantic component assertions
keyboard E2E
manual review
```

A scanner-only gate is incomplete.

## 23. Test shard strategy

Large E2E suites can shard by file/project.

Keep tests independent so sharding does not change semantics.

If test B requires test A, redesign the fixture or explicitly group them as one scenario.

## 24. Quarantine policy

A quarantined test should have:

```text
owner
reason
linked issue
last failure evidence
deadline/priority
```

Never create a permanent ignored folder that silently stops protecting a feature.

## 25. CI test matrix by risk

Example:

```text
Every PR
  unit/component
  core integration
  production build
  Chromium critical E2E

Main
  broader E2E
  security regression

Nightly
  cross-browser
  load/performance
  extended provider sandbox
```

Use repository size and deployment cadence to tune the matrix.

## 26. Release correlation

Attach:

```text
commit SHA
build ID
test environment
browser version
schema version
```

where useful so failures can be reproduced.

## Production checklist

- [ ] each test owns state
- [ ] DB fixtures support parallel runs
- [ ] time/randomness are controlled
- [ ] provider boundaries use layered doubles/sandboxes
- [ ] retry rate is monitored rather than ignored
- [ ] sleeps are replaced by conditions
- [ ] fork PRs cannot access protected secrets
- [ ] CI artifacts make failures diagnosable
- [ ] performance budgets use stable measurable signals
- [ ] quarantined tests have owners and deadlines

## Interview questions

### Why can automatic retries be dangerous?

Because they can turn a real race or shared-state bug into a green build. Use retries as evidence, monitor first-attempt failures, and repair the root cause.

### Why is query count sometimes a better CI performance gate than latency?

It can be deterministic and directly catch N+1 regressions, while wall-clock latency varies with CI load and infrastructure noise.

### How do you test provider integrations without making CI unreliable?

Use pure adapter mocks for domain tests, fake HTTP/contract fixtures for integration tests, and a smaller sandbox-backed suite for real provider confidence.
