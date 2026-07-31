---
id: production-incidents
title: Production AI Incident Drills
---

# Production AI Incident Drills

Use the same response discipline for every incident: **contain → preserve evidence → reproduce/segment → form hypotheses → test → fix → validate → prevent → monitor**. Do not begin by changing prompts blindly.

## Incident 1 — RAG Answers Became Outdated

**Symptoms:** users cite a policy version removed yesterday. **Hypotheses:** delete event failed, queue backlog, stale cache, wrong index alias, source version not updated. **Investigation:** trace answer citation→chunk→source/version; compare authoritative source and index; inspect ingestion job/cache keys. **Root cause example:** delete processor retried indefinitely after a schema change. **Fix:** drain/reprocess deletes, invalidate cache, rebuild affected source versions. **Prevention:** reconciliation job and source→searchable freshness contract. **Monitoring:** stale-version samples, queue age, update/delete lag. **Interview:** explain why this is data-pipeline correctness, not “LLM hallucination.”

## Incident 2 — Retrieval Latency Doubled

**Symptoms:** retrieval p95 120ms→300ms after index deployment. **Hypotheses:** HNSW/search parameters, filter selectivity, corpus growth, cache miss, DB CPU/IO, connection pool. **Investigation:** compare spans/query classes/before-after plans and ANN recall. **Root cause example:** tenant filter prevents efficient candidate search after index/config change. **Fix:** restore/tune index/query strategy. **Prevention:** load + recall benchmarks before cutover. **Monitoring:** p50/p95/p99 by filter/query class, index size, CPU/IO. **Interview:** optimize only after identifying dominant stage.

## Incident 3 — Agent Refunded Twice

**Symptoms:** two external refunds share one user intent. **Hypotheses:** worker retry, timeout ambiguity, interrupt replay, duplicate resume, missing idempotency. **Investigation:** halt refund tool; correlate run/tool-call/idempotency/provider transaction IDs. **Root cause example:** refund executed before HITL interrupt and replayed on resume. **Fix:** reconcile customer/payment, move write after approval, idempotency record + provider key. **Prevention:** replay tests and exactly-one logical effect invariant. **Monitoring:** duplicate action hashes/provider IDs. **Interview:** “exactly once” is built from idempotency/reconciliation, not assumed from queue/framework.

## Incident 4 — Tool Loop Consumed Thousands of Tokens

**Symptoms:** run cost/latency spike, repeated identical search. **Hypotheses:** tool error not surfaced, no-progress state, planner bug, missing limits. **Investigation:** terminate run; inspect trajectory and normalized action hashes. **Root cause:** tool returned ambiguous empty result; model repeated indefinitely. **Fix:** structured terminal/recoverable error, repeated-call detector, max steps/time/tokens/cost. **Prevention:** trajectory evals. **Monitoring:** steps/tool calls/cost per run and loop anomalies. **Interview:** model prompt is not a reliable loop guard.

## Incident 5 — OAuth Refresh Tokens Started Failing

**Symptoms:** tool calls get 401 across subset of users. **Hypotheses:** provider outage, refresh rotation bug, revoked consent, expired credentials, wrong audience/client config. **Investigation:** inspect provider/token error categories without logging token values; compare affected grant versions. **Root cause:** refresh rotation response was not persisted atomically. **Fix:** re-auth affected connections and atomically replace token state. **Prevention:** token lifecycle contract tests and revocation handling. **Monitoring:** refresh failure rate by provider/error. **Interview:** never broaden scopes to “fix” auth failure.

## Incident 6 — Prompt Injection Triggered Unsafe Tool Selection

**Symptoms:** agent proposes emailing retrieved secrets after reading a malicious page. **Hypotheses:** overbroad tool/data access, no egress policy, resource treated as trusted, approval absent. **Investigation:** disable risky tool; inspect retrieved content and tool proposal→policy path. **Root cause:** model had unconditional access to external-send tool. **Fix:** least tool set, deterministic recipient/data policy, HITL, source isolation. **Prevention:** indirect-injection adversarial suite and trust-boundary review. **Monitoring:** denied high-risk proposals/exfiltration patterns. **Interview:** injection impact is contained by capability controls, not prompt hardening alone.

## Incident 7 — Model Provider Outage

**Symptoms:** timeouts/5xx, queue growth. **Hypotheses:** provider regional outage, DNS/network, own quota. **Investigation:** health/status, cross-region/network traces, error codes. **Root cause:** upstream outage. **Fix:** circuit breaker and compatible evaluated fallback or queue/degraded UX. **Prevention:** provider abstraction, fallback qualification, capacity drills. **Monitoring:** provider error/latency and breaker state. **Interview:** an incompatible fallback is not resilience.

## Incident 8 — Structured Outputs Changed After Model Upgrade

**Symptoms:** previously valid extraction now fails or semantics drift. **Hypotheses:** model alias changed, structured-output behavior, prompt/schema interaction. **Investigation:** replay golden cases against pinned old/new model; inspect contract/field-level metrics. **Root cause:** unpinned alias rollout changes nullable-field behavior. **Fix:** pin/rollback; adjust adapter/schema/prompt only with eval evidence. **Prevention:** model catalog governance + contract/eval gate. **Monitoring:** validation/semantic failure by model version. **Interview:** model versions are production dependencies.

## Incident 9 — Vector Index Contains Stale Embeddings

**Symptoms:** odd relevance after embedding migration. **Hypotheses:** mixed model versions/dimensions/preprocessing, partial backfill. **Investigation:** inspect embedding metadata distribution and index alias. **Root cause:** new workers wrote v2 vectors into active v1 logical collection. **Fix:** stop writes, build clean versioned index, re-embed/backfill, validate/cutover. **Prevention:** index/model version invariant. **Monitoring:** vector count by embedding version/dimension. **Interview:** vector spaces are not interchangeable.

## Incident 10 — Tenant Data Leaks Through Retrieval

**Symptoms:** one workspace receives another workspace citation. **Hypotheses:** missing filter, shared cache key, wrong namespace, metadata bug. **Investigation:** disable affected route; preserve trace; scope exposure across index/cache/trace. **Root cause:** cache key omitted workspace/access scope. **Fix:** purge, add trusted scope key + storage/query constraints. **Prevention:** cross-tenant adversarial tests at every layer. **Monitoring:** canary tenant markers/access-denial signals. **Interview:** security incident, not relevance tuning.

## Incident 11 — MCP Server Exposes Dangerous Tool

**Symptoms:** capability discovery adds `run_shell` after server update. **Hypotheses:** server version change/compromise, registry auto-exposure. **Investigation:** quarantine server, diff tool schemas/descriptions/version. **Root cause:** host equated discovery with enablement. **Fix:** local allowlist/risk review, sandbox and explicit enablement. **Prevention:** pinned/reviewed servers and capability-diff gate. **Monitoring:** new/changed capability alerts. **Interview:** MCP standardizes connectivity, not trust.

## Incident 12 — Costs Increase 5× Overnight

**Symptoms:** usage ledger spike. **Hypotheses:** model route changed, prompt/context grew, loops/retries, abuse, cache disabled. **Investigation:** segment cost by tenant/feature/model/prompt/tool/steps. **Root cause example:** router sent routine extraction to expensive reasoning model after config rollout. **Fix:** rollback route, enforce task/model budget. **Prevention:** candidate eval + cost gate and anomaly limits. **Monitoring:** cost per successful task/run/tenant. **Interview:** optimize by causal spans, not globally downgrading models.

## Incident 13 — P95 Latency Exceeds SLA

**Symptoms:** p95 4s→11s while p50 stable. **Hypotheses:** queue tail, provider tail, reranker, slow tool, oversized context, cold connections. **Investigation:** distributed trace percentile decomposition. **Root cause:** reranker external service tail amplified on 50 candidates. **Fix:** candidate cap, timeout/fallback, parallelism/caching where safe. **Prevention:** stage-specific budgets. **Monitoring:** TTFT, total and span p95/p99. **Interview:** percentile tail diagnosis matters more than averages.

## Incident 14 — Reranker Degrades Result Quality

**Symptoms:** reranker offline relevance metric improved but answer/citation success declined. **Hypotheses:** grader misalignment, lost evidence diversity, query segment regression, source authority ignored. **Investigation:** compare selected contexts and task metrics by segment. **Root cause:** reranker favored semantically similar old documentation over current authoritative docs. **Fix:** add temporal/authority features/filtering and revert until re-evaluated. **Prevention:** end-to-end metrics alongside ranking metrics. **Monitoring:** grounded answer/citation outcome by retriever version. **Interview:** optimize product objective, not isolated metric.

## Incident 15 — Agent Checkpoint Cannot Resume

**Symptoms:** active customer runs fail after deployment. **Hypotheses:** state schema break, renamed node/tool contract, serializer/checkpointer migration. **Investigation:** reproduce with exact old checkpoint + new code; inspect run version. **Root cause:** required new state field with no default/migration. **Fix:** compatibility adapter/versioned graph worker, resume affected runs. **Prevention:** old-checkpoint fixture tests and run-version routing. **Monitoring:** resume failure by graph version. **Interview:** durable execution creates deployment compatibility obligations.
