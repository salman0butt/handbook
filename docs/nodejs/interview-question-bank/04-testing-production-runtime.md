---
title: Q193–Q256 — Testing, Production & Runtime Hardening
---

# Q193–Q256 — Testing, Production & Runtime Hardening

## Important question cards

### Q193. How do you design graceful shutdown?

**Expected answer:** mark unready, stop new work, drain in-flight HTTP/jobs, close workers/queues/DB pools, flush telemetry, and exit before a hard deadline.

**Senior answer:** make shutdown idempotent, coordinate load-balancer/Kubernetes timing, handle long-lived WebSockets, define job lease/redelivery semantics, and have a forced-exit deadline shorter than platform SIGKILL.

**Weak answer:** “On SIGTERM call `process.exit(0)`.”

**Follow-up:** In what order should HTTP intake and DB pool close?

### Q194. How do you debug a memory leak?

**Expected answer:** reproduce growth, determine heap vs external/RSS, inspect metrics and heap snapshots/retaining paths, fix ownership, and verify stabilization.

**Senior answer:** correlate with cache/listener/queue/Buffer/connection cardinality, use safe replicas because snapshots can pause/consume memory, and distinguish leak from allocation pressure/warm caches.

**Weak answer:** “Increase `--max-old-space-size`.”

**Follow-up:** What if heap is stable but RSS keeps rising?

### Q195. What should a production performance investigation measure first?

**Expected answer:** user-visible latency/throughput/errors plus CPU, event-loop delay, memory, pool/queue saturation, and dependency spans.

**Senior answer:** reproduce representative load, form competing hypotheses, profile only the suspected resource, change one constraint, compare p95/p99 and new bottlenecks.

**Weak answer:** “Use cluster and Redis.”

**Follow-up:** CPU is 20%, event loop healthy, p99 is 2s—what next?

### Q196. How would you upgrade Node across dozens of services?

**Expected answer:** inventory runtime versions, choose supported LTS target, test compatibility, canary, monitor, roll out gradually, keep rollback, enforce EOL policy.

**Senior answer:** shared base images/toolchain, native dependency matrix, platform-library fixes, automated PRs, representative service cohorts, telemetry comparison, deprecation inventory, deadline ownership.

**Weak answer:** “Change the Docker tag everywhere.”

**Follow-up:** What fleet signals would block rollout?

## Questions

**Q197.** Unit vs integration vs end-to-end vs contract tests: what does each prove?

**Q198.** Why is mocking a SQL call insufficient to test database correctness?

**Q199.** When are fake timers appropriate, and what can they hide?

**Q200.** Which API behaviors require selected real-network tests rather than only injection tests?

**Q201.** Why should CLI/process behavior be tested through spawned subprocesses?

**Q202.** What is `node:test`, and why might a project still choose Jest or Vitest?

**Q203.** How do `test`, `describe`, hooks, and `node:assert/strict` fit together?

**Q204.** What mocking capabilities are stable in current Node's test runner?

**Q205.** Which current `node:test` capabilities remain experimental/version-sensitive and should be pinned/labelled?

**Q206.** How do test filtering, concurrency, isolation, and reporters affect a CI suite?

**Q207.** How would you test API idempotency under concurrent duplicate requests?

**Q208.** Why should auth integration tests validate real credential behavior rather than only mocked middleware?

**Q209.** What does TypeScript `NodeNext` model?

**Q210.** How do package `type`, TS file extensions, and emitted runtime extensions interact?

**Q211.** What does Node's stable TypeScript type stripping do and not do?

**Q212.** Why does native type stripping not replace a TypeScript type-check in CI?

**Q213.** Why can tsconfig path aliases fail when running TS directly under Node type stripping?

**Q214.** Why do published Node libraries normally ship JavaScript plus declarations rather than raw TS in `node_modules`?

**Q215.** Why should CLI normal output go to stdout and diagnostics to stderr?

**Q216.** How should a CLI handle TTY prompts in CI/pipes?

**Q217.** What makes CLI exit codes part of an API contract?

**Q218.** How can `--inspect` help debugging, and why must it not be exposed publicly?

**Q219.** What are Node diagnostic reports useful for?

**Q220.** What risks come with taking a heap snapshot in production?

**Q221.** What question does a CPU profile answer?

**Q222.** Event-loop delay vs event-loop utilization: what do they help distinguish?

**Q223.** Why can async hooks/trace instrumentation add overhead or complexity?

**Q224.** What is the difference between latency, throughput, and saturation?

**Q225.** Why are percentiles more informative than average latency for backend SLOs?

**Q226.** How can GC pressure affect p99 latency?

**Q227.** How can backpressure improve performance reliability even if peak benchmark throughput is lower?

**Q228.** What is a realistic load-test workload?

**Q229.** What does a flamegraph show conceptually?

**Q230.** What are logs, metrics, and traces each best at explaining?

**Q231.** What are RED and USE monitoring lenses?

**Q232.** What context should propagate across HTTP, queues, and workers for observability?

**Q233.** Why is high-cardinality telemetry expensive/dangerous?

**Q234.** What makes an alert actionable?

**Q235.** Why should readiness and liveness have different meanings?

**Q236.** What is exponential backoff with jitter?

**Q237.** What is a retry budget?

**Q238.** What are circuit breakers and bulkheads trying to protect?

**Q239.** What is load shedding and when should an API return failure quickly?

**Q240.** How can a local mutex fail to protect an invariant across replicas?

**Q241.** What is optimistic concurrency control?

**Q242.** Why can a lease-based distributed lock need fencing tokens?

**Q243.** What does serverless runtime reuse change about Node client/pool initialization?

**Q244.** Why can serverless autoscaling exhaust a relational database?

**Q245.** What are cold starts and which Node behaviors contribute to them?

**Q246.** What trade-offs exist between Debian slim and Alpine Node container images?

**Q247.** Why should a containerized Node process run as non-root?

**Q248.** Why do PID 1 and signal propagation matter in Docker?

**Q249.** How do container CPU/memory limits affect Node runtime behavior?

**Q250.** What should Kubernetes startup, readiness, and liveness probes each test?

**Q251.** Why can a liveness probe that depends on the database make an outage worse?

**Q252.** How should `terminationGracePeriodSeconds` relate to Node shutdown deadlines?

**Q253.** Why is `npm ci` part of a reproducible CI/CD contract?

**Q254.** Why should CI build an immutable artifact once and promote it?

**Q255.** What guarantees does Node-API seek to provide for native addons?

**Q256.** Compare native addons, WebAssembly, the Node Permission Model, containers, and OS permissions as different runtime capability/performance boundaries.
