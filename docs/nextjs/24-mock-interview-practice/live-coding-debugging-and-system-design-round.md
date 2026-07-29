---
title: Live Coding, Debugging & System Design Round
sidebar_position: 6
description: Practice live implementation, production debugging, and compact system design while explaining invariants, boundaries, tests, and trade-offs.
---

# Live Coding, Debugging & System Design Round

## Part A — 20 minutes live coding

**Prompt:** Implement a URL-state parser for a catalog page.

Inputs:

```text
q
sort
page
limit
category
```

Requirements:

```text
trim query
allowlist sort
page >= 1
1 <= limit <= 100
empty category becomes undefined
return typed canonical object
```

Interviewer follow-ups:

- Where should validation live?
- How do you test malformed inputs?
- Would this be a Client Component utility?
- How does canonical URL generation use the result?

Scoring: correctness, types, edge cases, communication, tests.

## Part B — 15 minutes mutation exercise

**Prompt:** Sketch an idempotent `createOrder` command.

Must discuss:

```text
validated input
auth/resource scope
idempotency key
DB transaction
unique constraint
canonical result
outbox event
retry behavior
```

Red flag: solving duplicates only with a disabled button.

## Part C — 10 minutes debugging

**Scenario:** A route is fast on hard load but slow/stale on soft navigation after an edit.

Candidate should compare:

```text
hard document lifecycle
client router request
Router Cache
server invalidation
optimistic state
prefetch
```

Ask for one browser/network experiment and one regression test.

## Part D — 15 minutes compact design

**Prompt:** Design private file upload for a multi-tenant SaaS.

Expected flow:

```text
Action/Handler requests upload capability
→ authenticate + authorize tenant
→ validate file policy
→ short-lived signed object-storage upload
→ browser uploads
→ finalize metadata / scan job
→ authorized download capability
```

Discuss size limits, object keys, malware/active content, expiration, cleanup and observability.

## Alternative coding prompts

1. Safe redirect validator.
2. Tenant-aware cache-tag builder.
3. Bounded concurrency helper for provider calls.
4. Webhook signature/replay processing pseudocode.
5. State-transition validator for booking/order lifecycle.
6. DTO mapper that prevents private-field exposure.

## Alternative debugging prompts

```text
hydration mismatch in production
client bundle doubled
webhook duplicates
streaming buffered behind proxy
cross-tenant cache result
Server Action mismatch during rollout
DB pool saturation after parallelization
```

## Interview behavior scoring

0–3 each:

```text
states assumptions
names invariants
chooses simple correct approach
handles failure/edge cases
writes or proposes tests
explains server/client/security boundary
optimizes only after correctness
```

A senior live-coding round is not a typing-speed contest. The interviewer should be able to see how the candidate protects correctness while working.