---
title: Mock Rounds — Screen, Backend, Senior & Full-Stack
---

# Mock Rounds — Screen, Backend, Senior & Full-Stack

## Round 1 — 20-minute Node.js screen

**Interviewer script:** “I’ll ask fast fundamentals, then one async/output question. Explain mechanisms, not definitions only.”

**Timing:** 2 min intro, 12 min questions, 4 min output drill, 2 min candidate questions.

**Questions:** What is Node vs JavaScript? Why can Node serve many connections? ESM vs CommonJS? What does `await` do? What blocks the event loop? `Promise.all` risks? `process.env` validation? How do you handle errors in async handlers?

**Follow-ups:** Which I/O uses the OS vs worker pool? Why isn't `setTimeout(0)` immediate? Why might `process.exit()` lose output?

**Scoring:** 40% correctness, 30% runtime model, 20% failure awareness, 10% clarity.

**Strong signals:** clean layer model; states async ≠ parallel; mentions bounded concurrency.

**Warning signs:** “Node has one thread total,” module confusion, swallowed Promise errors.

## Round 2 — 45-minute backend round

**Interviewer script:** “Design and reason through an order API, then debug one dependency failure.”

**Timing:** 8 min API contract, 12 min data/auth, 10 min failure handling, 10 min testing/ops, 5 min follow-ups.

**Questions:** Layer the API. Validate runtime input. Design cursor pagination. Size DB pool. Implement resource authorization. Add idempotent POST. Define timeouts/retries. Test DB/auth/idempotency. Shut down safely.

**Follow-ups:** DB pool waits but DB CPU low—why? Duplicate POSTs arrive concurrently—what atomic boundary protects you? Client disconnects mid-query—what happens?

**Scoring:** API 20%, data correctness 20%, security 20%, resilience 20%, tests/ops 20%.

**Strong signals:** transport/domain separation, query constraints, cancellation, realistic pool math.

**Warning signs:** controller owns SQL/auth/email; retries writes without idempotency.

## Round 3 — 60-minute senior Node.js round

**Interviewer script:** “We’ll go from runtime to production incident and architecture trade-offs.”

**Timing:** 15 min runtime, 10 streams/workers, 15 production incident, 15 architecture, 5 reflection.

**Questions:** event loop and microtasks; libuv pool; backpressure; workers vs processes; diagnose p99 spike; heap vs RSS; graceful shutdown; microservices vs modular monolith; Node upgrade strategy.

**Follow-ups:** CPU low but p99 high. Heap stable but RSS high. Why can a larger DB/thread pool hurt? Which telemetry differentiates hypotheses?

**Scoring:** mechanism 30%, evidence-based debugging 25%, architecture 25%, operations 20%.

**Strong signals:** asks for metrics and recent changes; distinguishes resource ownership; avoids premature patterns.

**Warning signs:** profiler/snapshot before evidence; “add Redis/cluster” as first response.

## Round 4 — 90-minute full-stack Node round

**Interviewer script:** “Design a backend serving a React/Next frontend with realtime updates and background jobs.”

**Timing:** 15 requirements, 20 API/auth/data, 15 realtime, 15 jobs, 10 security, 10 testing/deploy, 5 review.

**Questions:** API/DTO contract, auth session/token choice, CORS/CSRF, PostgreSQL schema/pool, cache, queue/outbox, WebSockets/resync, upload streaming, TypeScript/runtime validation, observability, Docker/K8s rollout.

**Follow-ups:** browser retries mutation after lost response; socket reconnect misses events; cache outage causes DB spike; old frontend meets new API during deploy.

**Scoring:** contracts 20%, correctness 20%, frontend/backend trust 15%, async systems 15%, security 15%, production 15%.

**Strong signals:** separates browser security from server auth, versioned contracts, end-to-end cancellation/idempotency.

**Warning signs:** JWT in localStorage as automatic answer, CORS as authorization, no reconnect state model.
