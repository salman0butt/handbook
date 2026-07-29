---
title: 20-Minute Next.js Screen
sidebar_position: 2
description: A fast Next.js interview screen covering App Router fundamentals, server/client ownership, caching, mutations, and one production scenario.
---

# 20-Minute Next.js Screen

Use a strict timer. Answer aloud before reading the scoring notes.

## Minute 0–2 — Intro

**Interviewer:** Give me your mental model of a modern Next.js App Router application.

Strong answer should mention:

```text
route tree
Server Components by default
narrow Client Components
server-owned data
Server Actions / Route Handlers by contract
cache + request-time boundaries
production build/deployment
```

Red flag: “Next.js is React with SSR.”

## Minute 2–4 — Server vs Client

**Interviewer:** What does `'use client'` actually do?

Follow-ups:

- Does every child become a Client Component?
- Can a Client Component appear in initial server-rendered HTML?
- What is the performance cost of moving the boundary upward?

Score 3 if the candidate explains the module graph, composition of server-produced children, hydration and client-JS blast radius.

## Minute 4–6 — Data

**Interviewer:** A Server Component needs product data. Would you call your own `/api/products` Route Handler?

Expected:

```text
default no
→ call DAL/query directly
→ HTTP only when it is a real external/public contract
```

Follow-up: When would client-side fetching still be reasonable?

## Minute 6–8 — Caching

**Interviewer:** Explain React `cache()` vs Next.js persistent caching.

Expected distinction:

```text
React cache → render/server memoization
Next cache/Cache Components → cross-request freshness/invalidation model
Router Cache → browser navigation cache
```

Follow-up: What makes a cached result safe for multiple tenants?

## Minute 8–10 — Mutations

**Interviewer:** Server Action or Route Handler for these?

1. Rename a project from the web UI.
2. Stripe-style webhook.
3. Mobile app public API.
4. Internal business rule reused by both.

Strong mapping:

```text
1 Action
2 Handler
3 Handler/API
4 command/use-case below adapters
```

## Minute 10–12 — Routing

**Interviewer:** Layout vs template? Hard vs soft navigation?

Score for preservation/remount semantics and route-tree reconciliation, not memorized syntax.

## Minute 12–14 — Security

**Interviewer:** Proxy checks the session before `/admin`. Is the admin route secure?

Expected:

```text
not by Proxy alone
→ enforce authorization at DAL/command/handler/action
→ test valid-user/wrong-resource/role negatives
```

## Minute 14–16 — Performance

**Interviewer:** Lighthouse looks good, but real users report slow interactions. What next?

Strong answer:

```text
field RUM / INP
browser performance trace
client JS/render blast radius
third parties
long sessions/memory
real device segmentation
```

## Minute 16–18 — Production scenario

**Interviewer:** A Server Action updates the DB, but the UI is stale until a hard reload. Debug it.

Expected layers:

```text
DB canonical state
server cache/tag/path invalidation
RSC refresh
Router Cache
optimistic/local state
```

Red flag: immediate “call router.refresh everywhere.”

## Minute 18–20 — Closing question

**Interviewer:** What changed in how you think about Next.js as you became more senior?

Strong themes:

```text
ownership over API choice
subtree rendering over static/SSR labels
security before cache
production topology matters
framework core vs platform behavior
stable vs experimental contracts
```

## Scoring

Score 0–3 for:

```text
framework fundamentals
server/client ownership
data/cache correctness
mutation boundaries
security
performance/debugging
communication
```

### Pass

Average ≥ 2.0 and no security score below 2.

### Strong senior signal

Average ≥ 2.5 with concise, current, version-aware answers and at least one concrete production example.