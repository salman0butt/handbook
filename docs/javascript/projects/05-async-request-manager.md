---
title: Project 5 — Async Request Manager
description: Guided JavaScript build with architecture, implementation, tests, debugging, security, performance, edge cases, interviews, and design review.
id: 05-async-request-manager
---

# Project 5 — Async Request Manager

**Goal.** Implement bounded concurrency, retries, cancellation, timeouts, deduplication, stale-response protection, and Promise orchestration.

### Requirements
- Implement the listed capabilities without a framework hiding the underlying JavaScript mechanics.
- Use ESM boundaries, explicit ownership, meaningful error contracts, and deterministic cleanup.
- Document assumptions, runtime/browser targets, and what belongs to ECMAScript versus the host.

### Architecture
Every async operation has identity, ownership, cancellation, retry policy, and a terminal state.

```text
callers → bounded queue → request → settle/cancel → subscriber
```

**Suggested module structure:** `src/request-manager.js, src/retry.js, src/queue.js, src/cache.js`

### Implementation guidance
1. Define public contracts and state ownership before DOM/network code.
2. Validate untrusted data where it crosses into trusted application logic.
3. Model failure, cancellation, cleanup, and retry behavior before the happy path.
4. Keep effects at boundaries so core behavior is testable.
5. Instrument the slowest or riskiest path instead of guessing.

### Acceptance criteria
- [ ] Main flow works from a clean browser session.
- [ ] Invalid, missing, duplicate, stale, and cancellation cases are handled.
- [ ] Tests cover core behavior plus at least one boundary integration.
- [ ] No uncaught expected failures or leaked listeners/timers/resources.
- [ ] README explains architecture, trade-offs, security, compatibility, and run steps.

### Tests
Test pure logic with unit tests; integration-test browser/network/storage/worker boundaries; use fake time only where clock ownership is relevant. Assert observable behavior rather than implementation details.

### Debugging task
Introduce one realistic defect (race, stale state, malformed data, leaked listener, or incorrect ordering), reproduce it reliably, inspect the call/async path, fix the root cause, and add a regression test.

### Security concerns
Treat external data, DOM HTML sinks, URLs, storage, and third-party code as trust boundaries. Avoid `eval`/`Function`, validate data, encode/render safely, and do not store secrets client-side.

### Performance concerns
Measure first. Check algorithmic complexity, allocations, network waterfalls, DOM churn, long tasks, cache growth, and unnecessary serialization/copying relevant to this project.

### Edge cases
Empty input, very large input, duplicate actions, rapid repeated actions, partial failure, cancellation during work, stale data, reload/re-entry, unavailable host capability, and cleanup after navigation/disposal.

### Stretch goals
Add progressive enhancement, richer observability, property/fuzz tests, compatibility fallbacks, or an alternate adapter without changing core policy.

### Interview questions
1. Which layer owns state and why?
2. Where can this design race or leak?
3. What is the public contract and what would be a breaking change?
4. Which measurement would disprove your performance assumption?

### Design review
Defend dependency direction, failure policy, cancellation, trust boundaries, data ownership, test seams, compatibility targets, and how the design evolves under 10× load.
