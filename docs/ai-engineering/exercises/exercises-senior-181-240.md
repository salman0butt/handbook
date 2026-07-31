---
id: exercises-senior-181-240
title: Exercises 181–240 — Senior
---

# 60 Senior Exercises

| # | Problem | Expected outcome | Hint | Related chapters |
|---:|---|---|---|---|
| 181 | Design the service boundaries for a production RAG SaaS. | Gateway, ingestion, retrieval, model, policy, eval/obs ownership. | Separate online and async paths. | 191 |
| 182 | Decide which AI work should be synchronous vs queued. | Latency/UX/durability rationale. | Long/retryable work belongs async. | 192 |
| 183 | Design a job state machine for research runs. | queued/running/waiting/completed/failed/cancelled with valid transitions. | Persist authoritative state. | 192 |
| 184 | Add webhook completion safely to an async job. | Signed delivery, retries, idempotency. | Webhook is another distributed boundary. | 192 |
| 185 | Design worker concurrency controls for provider rate limits. | Queue/backpressure/per-provider limiter. | Avoid synchronized retry storms. | 192, 197 |
| 186 | Design model routing for extraction, chat, coding, and reasoning. | Capability/eval/latency/cost policy. | Task class first. | 193 |
| 187 | Define fallback compatibility checks. | Structured/tools/context/safety semantics verified. | Fallback must satisfy contract. | 193 |
| 188 | Run a shadow test of a cheaper model. | Quality/cost/latency evidence without user impact. | Replay same task distribution. | 193, 195 |
| 189 | Design exact-response cache keys. | Prompt/model/tenant/input/version included. | All semantic inputs matter. | 194 |
| 190 | Design semantic caching and name its risks. | Threshold/eval/privacy/invalidation discussed. | Similar query ≠ same authorized answer. | 194 |
| 191 | Cache embeddings across re-ingestion safely. | Content hash + embedding version key. | Model change invalidates. | 194, 071 |
| 192 | Add retrieval cache invalidation when source changes. | Index/source version in key or event invalidation. | Freshness is correctness. | 194 |
| 193 | Calculate cost per successful support resolution. | Includes all AI/retrieval/tool costs divided by successful tasks. | Cost per call is insufficient. | 195 |
| 194 | Cut agent cost 40% without lowering eval score. | Measured routing/context/cache/loop optimization plan. | Start from traces. | 195 |
| 195 | Create a workspace cost budget and denial/degradation policy. | Explicit limits and user-safe behavior. | Avoid denial-of-wallet. | 195 |
| 196 | Break down latency for a RAG answer from a trace. | Queue/retrieval/rerank/TTFT/generation spans. | Optimize dominant span. | 196 |
| 197 | Reduce TTFT without changing model. | Connection reuse, retrieval parallelism/prefetch, streaming. | TTFT includes upstream work. | 196 |
| 198 | Decide which tool calls can run concurrently. | Dependency graph and failure policy. | Reads may parallelize; writes need care. | 196, 056 |
| 199 | Define p95 SLO for an AI endpoint with async escape hatch. | Measurable latency target and long-job path. | User experience by task class. | 192, 196 |
| 200 | Classify 12 failure modes as retryable/recoverable/human/fatal. | Explicit recovery matrix. | Failure taxonomy first. | 197 |
| 201 | Implement exponential backoff with full jitter. | Bounded retry wrapper. | Cap elapsed deadline too. | 197 |
| 202 | Design a circuit breaker for a failing model provider. | Open/half-open/close and fallback/degraded behavior. | Protect upstream and own capacity. | 197 |
| 203 | Design a dead-letter strategy for ingestion jobs. | Preserved context, retry tooling, alert threshold. | DLQ is not permanent trash. | 192, 197 |
| 204 | Recover from empty retrieval for a high-confidence user question. | No hallucinated answer; fallback/search/escalation. | User confidence is not evidence. | 108, 197 |
| 205 | Recover from expired OAuth during a long agent run. | Refresh/re-consent path and safe pause. | Never silently broaden scope. | 179, 197 |
| 206 | Handle provider outage during streaming. | Partial UI state, terminal failure, retry/resume policy. | Don’t pretend prefix is final. | 060, 197 |
| 207 | Write unit tests for model routing policy. | Deterministic policy covered without model calls. | Ordinary code gets ordinary tests. | 193, 198 |
| 208 | Create contract tests for provider adapters. | Shared capability suite across providers. | Test structured/tools/errors. | 040, 198 |
| 209 | Test graph interrupt/resume across deployment restart. | Durable state and migration compatibility. | Use same thread/checkpoint. | 148–155, 198 |
| 210 | Create an eval gate in CI for a prompt change. | Baseline/candidate comparison and threshold. | Control stochastic noise. | 181–184, 198 |
| 211 | Separate eval flakiness from real regression. | Repeats/confidence/segment inspection. | One aggregate score can hide issues. | 181–184 |
| 212 | Design a ChatGPT-like assistant system. | Requirements, models, tools, memory, safety, scaling. | Start with simple interactions. | 199 |
| 213 | Design an enterprise RAG platform. | Multi-source ingestion, ACL retrieval, evals, tenancy. | Permissions in retrieval path. | 191, 199 |
| 214 | Design an AI customer-support agent. | Read/write tools, approvals, escalation, metrics. | High-risk actions explicit. | 156–170, 199 |
| 215 | Design a coding agent. | Repo sandbox, tools, tests, checkpoints, permission boundaries. | Code execution is hostile-capability territory. | 190, 199 |
| 216 | Design a research agent. | Source policy, evidence store, loops/budgets/citations. | Trace claims to evidence. | 159, 199 |
| 217 | Design an AI search engine. | Lexical+dense retrieval, ranking, freshness, citations. | Search is retrieval-first. | 101–110, 199 |
| 218 | Design a document-intelligence platform. | Ingestion, parse/OCR/tables, extraction, RAG, review. | Preserve provenance/structure. | 083–090, 199 |
| 219 | Design a multi-tenant agent SaaS. | Tenant isolation across state/RAG/tools/traces/cache. | Tenant context is server-derived. | 189, 191, 199 |
| 220 | Design an MCP tool platform. | Server registry, trust review, OAuth, permissions, audit. | Discovery is not enablement. | 171–180, 199 |
| 221 | Design an AI workflow automation platform. | Durable graphs/jobs, triggers, approvals, connectors. | Idempotency everywhere. | 146–155, 192, 199 |
| 222 | Design a permission-controlled “autonomous” agent. | Capability budgets, policy, HITL, kill switch. | Autonomy is bounded by system. | 170, 189, 199 |
| 223 | Design a company-wide LLM gateway. | Auth, provider adapters, routing, budgets, logs/evals. | Avoid platform becoming bottleneck. | 040, 193, 200 |
| 224 | Design an evaluation platform. | Dataset/version/grader/run/comparison/trace integration. | Evals are products with governance. | 181–187, 200 |
| 225 | Design a prompt/schema registry. | Versioning, ownership, rollout, compatibility, audit. | Prompt and schema move together. | 037, 049, 200 |
| 226 | Design agent observability. | Trace model/tool/retrieval/graph/approval/cost. | Trajectory is primary artifact. | 185–187, 200 |
| 227 | Define platform SLOs for model gateway and RAG. | Availability/latency/freshness/task success metrics. | Separate component SLOs from AI quality. | 191–200 |
| 228 | Plan migration from provider-specific code to gateway adapters. | Incremental compatibility and eval strategy. | Strangler pattern. | 040, 200 |
| 229 | Decide build vs buy for a vector database. | Workload/ops/compliance/cost reasoning. | Don’t choose on benchmark headline. | 080, 200 |
| 230 | Decide build vs buy for agent observability. | Required telemetry/control vs integration effort. | Keep telemetry model portable. | 186, 200 |
| 231 | Write an ADR: plain SDK vs LangChain. | Requirements, options, trade-offs, decision/revisit trigger. | Framework should reduce complexity. | 130 |
| 232 | Write an ADR: workflow vs agent. | Determinism/variability/evals/risk rationale. | Least complex architecture. | 156–157 |
| 233 | Write an ADR: RAG vs fine-tuning. | Changing knowledge vs behavior distinction. | Identify actual failure. | 013, 081, 199 |
| 234 | Create a quarterly AI dependency upgrade process. | Version baseline, migration docs, contract tests, evals, canary. | Framework/API churn is operational risk. | baseline, 200 |
| 235 | Define incident severity for unsafe write, wrong answer, latency, and cost spike. | Impact-based severity matrix. | User harm/data integrity first. | 197, 200 |
| 236 | Run tabletop: model provider changes structured output behavior. | Detect via contract/evals, halt rollout, fallback/rollback. | Version model/provider. | 049, 181–198 |
| 237 | Run tabletop: vector index lags source by six hours. | Freshness alert, reconcile, degraded UI, root cause. | RAG correctness includes freshness. | 079, 191–197 |
| 238 | Run tabletop: OAuth scopes accidentally broaden. | Revoke/rotate, contain, audit, narrow policy/tests. | Least privilege regression. | 179–180, 189 |
| 239 | Run tabletop: agent cost rises 5× overnight. | Segment traces/model/routes/loops, apply budget/kill switch. | Cost is observable behavior. | 170, 195 |
| 240 | Present an AI architecture review to staff engineers. | Requirements, evidence, trade-offs, risks, evolution, metrics. | Explain why each complexity exists. | 191–200 |
