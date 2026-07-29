---
title: Mock Rounds — Staff Architecture, Distributed Systems & Specialized Practice
---

# Mock Rounds — Staff Architecture, Distributed Systems & Specialized Practice

## Round 9 — Staff / Lead architecture round

**Interviewer script:** “Standardize Node across 80 services owned by 12 teams.”

**Timing:** 15 requirements, 25 platform design, 15 rollout/governance, 5 trade-offs.

**Questions:** LTS governance, base images, templates, config/logging/OTel/auth/shutdown, dependency policy, SLOs, CI, upgrade automation, escape hatches.

**Follow-ups:** shared library breaking change; one team needs native addon; Node major degrades memory 12%; old LTS reaches EOL.

**Scoring:** fleet thinking 30%, blast-radius control 25%, developer experience 20%, security/reliability 25%.

**Strong signals:** paved road, canary cohorts, telemetry comparison, platform avoids domain ownership.

**Warning signs:** one mandatory mega-framework.

## Round 10 — Distributed systems round

**Interviewer script:** “Design payment + inventory coordination where messages can duplicate and networks fail.”

**Timing:** 15 failure model, 20 workflow, 10 consistency/recovery, 5 review.

**Questions:** partial failure, idempotency, outbox, at-least-once, ordering, saga, compensation, clocks, retries.

**Follow-ups:** payment commits but response lost; event delivered twice/out of order; broker down after DB commit.

**Scoring:** ambiguity handling 30%, durable state 25%, idempotency 25%, recovery 20%.

**Strong signals:** designs from crash points, not happy path.

**Warning signs:** “exactly once solves it.”

## Round 11 — Production incident round

**Interviewer script:** “At 14:05 error rate rises, queue backlog grows, replicas restart from OOM, and a dependency is slow.”

**Timing:** 10 triage, 15 stabilization, 15 root cause, 10 remediation.

**Questions:** what changed, retry amplification, queue in-flight count, memory breakdown, downstream latency, rollback/load shedding, evidence preservation.

**Follow-ups:** retries account for 40% traffic; heap snapshots are unsafe on primary; queue redelivers after worker death.

**Scoring:** stabilization 30%, causal model 30%, safe diagnostics 20%, systemic prevention 20%.

**Strong signals:** stops amplification and preserves idempotency during recovery.

**Warning signs:** restart everything simultaneously.

## Round 12 — Live coding round

**Interviewer script:** “Implement a bounded async pool, then make it cancellable and test it.”

**Timing:** 5 clarify contract, 25 code, 10 tests, 5 discussion.

**Questions/tasks:** max N in-flight; preserve result order; reject/settle policy; AbortSignal; no leaked workers; empty input; synchronous throw; cancellation tests.

**Follow-ups:** process 1M inputs lazily; fairness; streaming results; retry transient tasks.

**Scoring:** correctness 35%, boundedness 25%, failure semantics 20%, tests/clarity 20%.

**Strong signals:** states contract before coding and handles rejection/cancel deterministically.

**Warning signs:** starts all Promises then “limits” awaiting.

## Round 13 — API design round

**Interviewer script:** “Design an externally consumed orders API expected to evolve for five years.”

**Timing:** 10 resources/contracts, 15 writes/idempotency, 10 auth/errors, 10 evolution.

**Questions:** methods/status, pagination/filter/sort, DTO schemas, versioning, idempotency, rate limits, authz, error taxonomy, deprecation.

**Follow-ups:** rename field; bulk operation partial failure; duplicate write after timeout; old client during rollout.

**Scoring:** HTTP semantics 25%, evolution 25%, correctness 25%, security/ops 25%.

**Strong signals:** compatibility strategy and observable deprecation.

**Warning signs:** DB schema exposed directly.

## Round 14 — Migration / upgrade round

**Interviewer script:** “Move a CommonJS Node 20 fleet to ESM on Node 24 LTS without a big-bang outage.”

**Timing:** 10 inventory, 15 module migration, 15 runtime upgrade, 5 rollout.

**Questions:** package type/extensions, dynamic require/CJS globals, dual package consumers, native deps, tests, canary, metrics, CI policy.

**Follow-ups:** one package only supports CJS; ESM cycle changes initialization; native module lacks prebuild; rollback after DB migration.

**Scoring:** compatibility 30%, sequencing 25%, validation 25%, rollback 20%.

**Strong signals:** separates module-system migration from runtime rollout, cohorts changes, preserves rollback.

**Warning signs:** changes runtime, modules, framework, DB all at once.

## Round 15 — Behavioural / leadership round

**Interviewer script:** “Give concrete examples of production ownership and technical leadership.”

**Timing:** five 8-minute stories + 5 min questions.

**Questions:** ambiguous incident; prevented bottleneck; architecture disagreement; migration leadership; security/reliability improvement; mentoring; failure/lesson.

**Follow-ups:** what evidence changed your mind? what did you communicate? what metric improved? what guardrail remained after you left?

**Scoring:** ownership 25%, reasoning/evidence 25%, communication 20%, impact 15%, learning/systemic improvement 15%.

**Strong signals:** specific constraints, alternatives, data, outcome, durable team/system improvement.

**Warning signs:** vague hero story, blames others, no measurable outcome or changed process.
