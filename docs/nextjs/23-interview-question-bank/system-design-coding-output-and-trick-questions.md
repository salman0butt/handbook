---
title: System Design, Coding, Output & Trick Questions
sidebar_position: 8
description: Practice system design, coding exercises, output reasoning, and common Next.js misconception traps at senior interview depth.
---

# System Design, Coding, Output & Trick Questions

## System-design drills

## 1. Design a public marketplace catalog.
Cover URL-driven search/filtering, Server Components, search/data ownership, cache identity/revalidation, SEO/metadata, images, performance budgets and content-update freshness.

## 2. Design a booking system with scarce inventory.
Cover transactional invariant checks, idempotency, provider integration, webhooks, optimistic-vs-confirmed UX, outbox/jobs and reconciliation.

## 3. Design a multi-tenant project-management SaaS.
Cover session/membership, tenant-scoped DAL, RBAC, entitlements, tenant-aware caches/jobs/storage/search, audit logs and admin boundaries.

## 4. Design a large report/export feature.
Use a request to validate/authorize and enqueue durable work; worker generates output in object storage; UI tracks progress; retries are idempotent; expired downloads use short-lived signed access.

## 5. Design file uploads for private tenant documents.
Prefer a short-lived signed object-storage capability, size/type policy, tenant-scoped keys, optional scanning, finalization metadata and authorized download.

## 6. Design webhook ingestion at high volume.
Verify authenticity, bound request size, deduplicate/replay-protect, persist/enqueue quickly, process durably, monitor lag and expose DLQ/reconciliation tooling.

## 7. Design a search system for millions of records.
Separate source-of-truth DB from search index, async indexing/outbox, tenant/security filters, relevance/query API, reindex process and eventual-consistency contract.

## 8. Design a dashboard with one slow analytics provider.
Keep critical shell/data independent, isolate analytics behind Suspense/error boundary, timeout/degrade provider work, cache if safe and observe provider latency separately.

## 9. Design realtime notifications.
Clarify latency requirements. Next.js may own page/API/auth boundaries while a dedicated realtime provider/service owns persistent connections; preserve authorization and reconnect semantics.

## 10. Design a multi-zone frontend.
Use unique path ownership, coordinated routing/asset prefixes, hard cross-zone navigation, shared auth/session/design packages and independent release compatibility.

## Coding drills

## 11. Write a safe search-params parser.
Requirements: normalize strings, bound page/limit, allowlist sort values, reject/ignore unsupported values, return a typed canonical query object.

## 12. Write a safe redirect helper.
Accept relative internal destinations or explicit allowlisted origins. Reject protocol-relative, javascript-like or untrusted external targets.

## 13. Write a tenant-scoped DAL query.
Inputs should include authenticated tenant/resource context; query canonical storage using tenant scope in the predicate; return a minimal DTO; never fetch globally then filter in UI.

## 14. Write a cache-tag builder.
Use stable semantic inputs such as `tenant:{tenantId}:project:{projectId}`. Validate/bound untrusted values and centralize tag vocabulary.

## 15. Write an idempotent command outline.
Within a transaction: find/create idempotency record, reject mismatched reused keys, execute canonical state transition once, persist result/outbox, return the same logical result on retry.

## 16. Write a webhook verifier outline.
Read body once in required form, verify signature/timestamp using provider secret, reject invalid/replayed requests, derive stable event ID and hand off to idempotent processing.

## 17. Fix a waterfall.
Given three independent awaits, start all three before awaiting or use bounded `Promise.all`; keep true dependencies sequential and monitor pool/quota capacity.

## 18. Fix an unsafe Client Component.
Move secret/DB/provider code into a server module, return a minimal serializable DTO and keep only browser interaction in the Client Component.

## 19. Fix duplicate form submission.
Client pending state improves UX, but enforce server idempotency/transaction constraints so duplicate network delivery cannot create duplicate business effects.

## 20. Fix cross-tenant cached data.
Disable/contain unsafe sharing, change the authorized query/cache identity to include tenant/security dimensions, invalidate contaminated entries, add cross-tenant negative regression tests and audit exposure.

## Output/reasoning drills

## 21. A layout Client Component wraps `{children}` produced by a Server Component. Does the child become a Client Component?
No. Composition can pass server-produced children into a Client Component. Import graph boundaries, not visual nesting alone, determine client modules.

## 22. A Server Component is `async`. Does that make the route dynamic?
No. `async` itself does not decide rendering mode. Data/cache/request API usage and current framework analysis determine when work can be prerendered/cached/request-time.

## 23. A database query is wrapped in React `cache()`. Will every user share it forever?
No. React `cache()` is not a persistent global application cache. Also, authorization and key identity still matter.

## 24. A Server Action updates the DB and calls `router.refresh()` from client code. Is cache invalidation solved?
Not necessarily. Refresh can request/reconcile route data, but persistent server cache freshness must be invalidated according to its own contract.

## 25. A GET Route Handler exists. Is it automatically cached forever?
No. Use the current App Router caching model and explicit requirements; old cached-by-default assumptions are historical migration context.

## Trick/misconception questions

## 26. “Server Components are SSR components.” Correct?
Incomplete/incorrect. Server Components are a React component/data representation model; SSR/HTML generation is a delivery stage. They interact but are not synonymous.

## 27. “`'use client'` means render this only in the browser.” Correct?
No. Client Components can be prerendered for initial HTML, then hydrate in the browser. The directive defines the client module boundary.

## 28. “Proxy secures the app, so DAL auth is redundant.” Correct?
No. Proxy is not the authoritative resource-authorization boundary.

## 29. “CORS prevents unauthorized API use.” Correct?
No. CORS is browser cross-origin policy, not server authorization.

## 30. “Redis makes a value safe to cache.” Correct?
No. Cache technology says nothing about authorization identity, freshness or invalidation correctness.

## 31. “Server Actions replace Route Handlers.” Correct?
No. Route Handlers remain necessary for webhooks, public/mobile APIs, HTTP integrations, files and other explicit HTTP contracts.

## 32. “Edge runtime is always faster.” Correct?
No. Latency depends on data placement, runtime/package compatibility, cold starts and platform topology. Current Proxy uses Node runtime.

## 33. “Suspense speeds up a slow API.” Correct?
No. It can let other UI progress and improve perceived delivery; it does not reduce the API’s intrinsic latency.

## 34. “`useMemo`/React Compiler fixes performance.” Correct?
Only render recomputation classes. It does not fix network, server, bundle, DOM, third-party or architecture costs.

## 35. “Microservices are required for scale.” Correct?
No. A modular monolith can scale far. Extract services when independent scaling, failure, runtime, regulatory or team ownership creates a real boundary.

## 36. “Private `.next` manifests are stable integration APIs.” Correct?
No. Treat them as diagnostic implementation evidence unless explicitly documented as public interfaces.

## 37. “If TypeScript passes after an upgrade, the migration is complete.” Correct?
No. Production build, caching, rendering, routing, auth, deployment compatibility, browser behavior and telemetry still require validation.

## 38. “Static export is the cheapest deployment, so every app should use it.” Correct?
No. Choose it only when the product does not require request-time server capabilities that static export cannot provide.

## 39. “A valid session means the user can read `/projects/123`.” Correct?
No. The server must authorize that actor against project 123 and its tenant/ownership relationships.

## 40. “The browser sends an Action once, so idempotency is unnecessary.” Correct?
No. Double clicks, retries, proxies and distributed delivery can duplicate logical requests. Correctness belongs on the server.

## Final drill

Pick any five questions and answer each with:

```text
definition
boundary/lifecycle
failure mode
security/performance consequence
test or production evidence
```

If the answer survives those follow-ups, it is interview-ready.