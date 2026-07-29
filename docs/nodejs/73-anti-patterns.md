---
title: Anti-Patterns
---

# Anti-Patterns

| Anti-pattern | Symptom | Risk | Better design |
|---|---|---|---|
| sync fs in request path | latency spikes | blocks all callbacks | async/stream/preload |
| CPU loop on main thread | event-loop lag | process-wide latency | better algorithm / worker pool |
| huge `Promise.all` | memory/pool spike | overload | bounded concurrency |
| giant controller | hard tests/changes | mixed concerns | transport → use case → adapters |
| giant `utils/` | hidden ownership | coupling | domain/capability modules |
| singleton mutable state | cross-request bugs | replica inconsistency | scoped state / authoritative store |
| `process.env` everywhere | hidden dependencies | invalid config at runtime | parse once + inject |
| no runtime validation | weird deep failures | security/data corruption | validate at boundary |
| no cancellation | timed-out work continues | resource leak | propagate `AbortSignal`/driver cancel |
| no timeouts | infinite in-flight work | cascading failure | deadline budgets |
| retry without idempotency | duplicate effects | money/data bugs | idempotency keys + atomic storage |
| catch and ignore | silent failure | inconsistent state | own/translate/rethrow |
| `process.exit` in library | abrupt host death | data/log loss | return error / app owns lifecycle |
| cluster as architecture | hidden process coordination | operational complexity | external replicas / explicit workers |
| DB model = public API | storage changes break clients | coupling/leakage | DTO/schema boundary |
| excessive middleware | invisible control flow | debugging/security gaps | explicit use cases |
| log secrets | credential exposure | breach | redact/allowlist logging |
| EventEmitter everywhere | hidden flow | leak/error/order issues | direct calls/domain events/durable broker |
| premature workers | complexity/no gain | overhead | profile first |
| framework-driven architecture | domain tied to adapters | migration/testing pain | stable application/domain boundaries |

## Review method

When you see one of these, ask four questions: **what is the symptom, why did the code evolve this way, what production risk does it create, and what is the smallest design change that restores ownership/bounds?**
