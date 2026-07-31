---
id: exercises-production-241-300
title: Exercises 241–300 — Production
---

# 60 Production Exercises

| # | Problem | Expected outcome | Hint | Related chapters |
|---:|---|---|---|---|
| 241 | RAG answers use a policy deleted yesterday. Investigate. | Trace source→index freshness, stale chunks, delete pipeline, reconciliation. | Compare source truth and index truth. | 079, 082–093, 197 |
| 242 | Retrieval p95 doubles after index change. Diagnose. | Compare exact/ANN params, filters, corpus size, infra, query mix. | Segment before rollback. | 074–080, 196 |
| 243 | Agent issued the same refund twice. Respond. | Stop write tool, inspect replay/idempotency, contain, remediate, add tests. | Side effect correctness first. | 058, 151–152, 197 |
| 244 | Tool loop consumes thousands of tokens. Respond. | Kill run, analyze repeated actions, add budgets/no-progress guard. | Loop budget must be deterministic. | 144, 170, 195 |
| 245 | OAuth refresh tokens start failing. Investigate. | Provider status, expiry/rotation, token storage, consent/re-auth path. | Do not widen scopes. | 179, 197 |
| 246 | Indirect injection causes unsafe tool proposal. Fix systemically. | Separate content/tool trust, policy/approval/allowlist, adversarial eval. | Proposal is not execution authority. | 178, 188–190 |
| 247 | Primary model provider is down. Operate degraded service. | Circuit breaker, compatible fallback, async retry, user state. | Preserve semantic contract. | 193, 197 |
| 248 | Model upgrade changes structured-output behavior. | Contract test/eval regression, pin/rollback, schema/adaptor fix. | Version model and schema. | 041–050, 198 |
| 249 | Vector index contains stale embedding versions. | Detect mixed versions, build replacement index, dual-eval/cutover. | Never mix incompatible spaces. | 068–071 |
| 250 | Tenant A retrieves Tenant B chunks. Treat as incident. | Disable affected path, scope impact, fix filter/cache, notify/process per policy. | Security incident, not relevance bug. | 077–079, 189 |
| 251 | New MCP server exposes shell execution unexpectedly. | Quarantine server/capability, diff discovery, require review/sandbox. | Discovery cannot auto-enable privilege. | 177–180, 190 |
| 252 | AI cost increases 5× overnight. Diagnose. | Segment by model/route/prompt/context/loops/retries/tenants. | Cost ledger + traces. | 195 |
| 253 | P95 latency exceeds SLA. Diagnose. | Span decomposition and queue/model/retrieval/tool segmentation. | Optimize dominant contributor. | 196 |
| 254 | Reranker lowers answer quality despite better relevance score. | Inspect eval labels/context diversity/order, revert if task success drops. | Local metric can misalign with product metric. | 103, 110 |
| 255 | LangGraph checkpoint fails to resume after deploy. | Schema/version/dependency migration diagnosis and compatibility plan. | Persisted state outlives code. | 148, 155 |
| 256 | Search index freshness alert fires intermittently. | Measure source-event→searchable stages and queue/backpressure. | Freshness has a pipeline. | 083–093, 192 |
| 257 | Streaming clients disconnect frequently. | Separate network disconnect from provider failure; cancel/recover terminal state. | Server state authoritative. | 060, 192 |
| 258 | Tool returns 200 but external write did not occur. | Model business outcome explicitly, reconcile external state, retry safely. | HTTP success ≠ domain success. | 057–058, 197 |
| 259 | Tool returns timeout but external write may have occurred. | Query by idempotency key/status before retry. | Ambiguous outcome is classic distributed failure. | 058, 197 |
| 260 | Queue backlog grows after marketing launch. | Capacity/rate-limit/backpressure/priority/ETA plan. | Protect upstream and users. | 192 |
| 261 | Prompt cache serves wrong tenant context. | Purge, isolate keys, security review/tests. | Security scope belongs in cache key. | 194 |
| 262 | Semantic cache returns stale legal guidance. | Disable/shorten TTL/version by source effective date. | Similarity does not prove freshness. | 194 |
| 263 | Embedding provider rate-limits bulk ingestion. | Batch/queue/backoff/provider quota and checkpoint progress. | Preserve idempotency. | 070, 192, 197 |
| 264 | PDF parser update destroys table structure. | Regression fixtures, rollback parser version, reprocess affected docs. | Parsing is versioned ingestion logic. | 084–090 |
| 265 | Duplicate chunks dominate retrieval. | Fix chunk overlap/dedupe/index identity; re-evaluate. | Noise is ingestion + context issue. | 091–093, 107 |
| 266 | Model cites source IDs that were never retrieved. | Citation validator blocks/repairs output. | Citations must reference supplied IDs. | 098, 110 |
| 267 | Search answer is correct but cites obsolete source. | Add source authority/time filtering and citation checks. | Correctness includes provenance. | 106, 108 |
| 268 | Hybrid search overweights lexical results. | Recalibrate fusion by query segment. | Inspect rank contributions. | 101–102 |
| 269 | Multi-query retrieval explodes cost. | Cap expansions, cache, route only hard queries, measure lift. | Complexity must earn its cost. | 104, 195 |
| 270 | Agent repeatedly asks for approval after resume. | Inspect state/replay/action ID and node ordering. | Interrupted node restarts. | 149–151 |
| 271 | Approval UI shows one amount but executor sends another. | Bind approval to normalized action hash and reject mismatch. | Approval covers exact payload. | 169, 180 |
| 272 | User revokes permission while run waits for approval. | Reauthorize on resume, cancel action. | Authorization is time-sensitive. | 169, 180 |
| 273 | Research agent uses a low-quality source over official docs. | Source ranking/allowlist/authority metadata and eval. | Relevance ≠ authority. | 106–110, 159 |
| 274 | Two agents loop delegating to each other. | Max depth/visited tasks/convergence rule. | Delegation is a graph. | 166, 170 |
| 275 | Supervisor exposes confidential worker context to another worker. | Narrow typed handoff artifacts and data-classification policy. | Isolated state by default. | 165, 189 |
| 276 | LLM judge suddenly scores all outputs higher. | Pin judge/version, calibrate humans, deterministic checks, investigate drift. | Judge is another model. | 184 |
| 277 | Eval suite passes but users report bad answers. | Audit dataset representativeness/segments/feedback linkage. | Coverage problem, not necessarily model bug. | 181–187 |
| 278 | Users game thumbs-up metric. | Use task outcome + curated review + anti-abuse. | Feedback is noisy. | 187 |
| 279 | Trace payload leaks access tokens. | Revoke tokens, purge/limit access, redact instrumentation, incident process. | Telemetry is sensitive data. | 186, 179 |
| 280 | RAG source contains hidden injection text. | Treat source untrusted, quarantine, policy/egress safeguards, eval. | Sanitization alone is insufficient. | 188–190 |
| 281 | URL tool follows redirect to metadata service. | Resolve/validate every hop + egress/network isolation. | SSRF via redirects. | 190 |
| 282 | Coding agent reads `.env`. | Sandbox workspace/filesystem deny rules; rotate leaked secrets. | File access needs capability policy. | 190 |
| 283 | Generated SQL omits tenant predicate. | Never execute model SQL directly; trusted query builder/policy layer. | Tenant is deterministic context. | 189–190 |
| 284 | Write tool succeeds but audit log write fails. | Define transaction/outbox strategy and fail-safe policy. | Audit integrity is part of side effect. | 197, 200 |
| 285 | Primary + fallback providers both fail. | Graceful terminal state/queue retry/SLO incident, no infinite chain. | Bound fallbacks. | 193, 197 |
| 286 | Reasoning model meets quality but violates latency budget. | Route only hard cases, async path, alternate model. | Optimize task-level utility. | 193, 196 |
| 287 | Cheap router model misroutes high-risk requests. | Deterministic risk detection/validation before execution. | Router cannot grant capability. | 193, 189 |
| 288 | Context window overflow occurs in long chats. | Budget/summarize/retrieve history; protect critical instructions. | Context is finite. | 017, 196 |
| 289 | Summarized memory invents a user preference. | Store provenance/confidence; user confirmation/edit/delete. | Summary is model output, not fact. | 167–168 |
| 290 | User requests deletion of remembered data. | Find all memory stores/index/cache/checkpoints and delete/reconcile. | Memory lifecycle spans systems. | 168, 194 |
| 291 | Deploy adds state field required by new graph. | Backward-compatible default/migration, test old checkpoints. | State schema versioning. | 148, 155 |
| 292 | A model call retries after client cancelled. | Propagate cancellation through retry wrapper/queue. | User cancel is terminal intent unless product says otherwise. | 039, 197 |
| 293 | Provider returns rate-limit headers indicating long wait. | Respect retry-after/defer to queue; avoid tying request open. | Backpressure. | 039, 192 |
| 294 | Model usage metadata missing on fallback call. | Normalize provider usage/estimate with provenance; alert telemetry gap. | Cost accounting needs reliable contract. | 040, 195 |
| 295 | Model routing experiment improves average but harms one language. | Segment evals/traffic, protect minimum per-segment quality. | Aggregates hide regressions. | 072, 193 |
| 296 | Search migration from pgvector to managed DB must be zero downtime. | Dual-write/backfill/shadow-read/eval/cutover/rollback. | Keep retriever contract stable. | 080, 200 |
| 297 | Migrate from LangChain agent to custom LangGraph workflow. | Preserve domain/tool contracts, replay eval dataset, staged rollout. | Framework is not domain architecture. | 130–155, 200 |
| 298 | Migrate MCP stable v1 integration toward 2026 draft support safely. | Isolate protocol adapter, compatibility tests, opt-in beta, no premature default. | Stable vs draft baseline. | baseline, 171–180 |
| 299 | Design a multi-region AI platform recovery exercise. | Provider/data/queue/vector dependencies, failover, consistency, cost. | Know what must be regional vs global. | 191–200 |
| 300 | Conduct a capstone production readiness review. | Evidence for tenancy, security, evals, durability, SLOs, cost, rollback, incidents. | “Demo works” is not a release gate. | 191–200, capstone |
