---
id: projects-06-10
title: Guided Projects 06–10
---

# Project 6 — Basic RAG Chatbot

**Requirements.** Answer questions from a curated product manual corpus with source citations and an `insufficient_context` state.

**Architecture.** `ingestion → chunk/embed/index`; `question → tenant filter → retrieve → context builder → generator → citation validator`.

**Structure/setup.** `src/rag/ingest`, `retrieval`, `context`, `generation`, `citations`, `evals`. Reuse Project 5 search infrastructure.

**API/schema.** `POST /rag/answer {question}` → `{status,answer,citations[]}`. Citation IDs must be selected from retrieved context.

**Storage/errors/security.** Version source/chunks/index. Handle zero results, context overflow, stale source, provider timeout. Apply ACL filters before retrieval; retrieved instructions are untrusted.

**Tests/evals/obs/perf/cost.** Unit-test context budget/citation validator; retrieval recall@k plus groundedness/answer correctness/citation accuracy dataset. Trace query, source IDs, retrieval latency, model tokens. Measure k/context-size effects.

**Acceptance.** Claims cite valid sources; unsupported questions decline; source update is searchable within target freshness. **Senior review.** How do you prove a wrong answer is retrieval vs generation failure?

# Project 7 — Production Document-Ingestion Pipeline

**Requirements.** Ingest PDFs, Markdown, and HTML asynchronously with parser/chunker versioning, incremental updates, retries, deletion, and reconciliation.

**Architecture.** `source event → job row → queue → load → parse → normalize → chunk → embed → transactional metadata/index → complete`; failures go to DLQ.

**Structure/setup.** `src/ingestion/connectors`, `parsers`, `chunkers`, `jobs`, `workers`, `reconcile`. PostgreSQL tracks jobs/source/chunks; object storage keeps raw documents; vector index stores embeddings.

**API/schema.** `POST /sources`, `POST /sources/:id/reindex`, `DELETE /sources/:id`, `GET /jobs/:id`. Job state is a finite enum with attempts/version/error category.

**Storage/errors/security.** Stable source IDs + checksums; idempotent chunk IDs; isolate tenant object prefixes; malware/size/type validation; never execute embedded macros/scripts. Retry transient fetch/embed errors, not corrupt files indefinitely.

**Tests/evals/obs/perf/cost.** Golden parser fixtures, crash/replay tests, duplicate event tests, deletion reconciliation, chunk-quality retrieval eval. Monitor queue age, docs/min, failed pages, freshness, embed spend.

**Acceptance.** Crash at every pipeline stage resumes without duplicates; deleted source cannot be retrieved; version migration works. **Senior review.** How do you deploy a new parser/chunker without corrupting the active index?

# Project 8 — Advanced RAG with Hybrid Retrieval + Reranking

**Requirements.** Upgrade RAG with BM25+dense candidate fusion, metadata/source routing, reranking, deduplication, and per-query evaluation.

**Architecture.** `query → transform → dense + lexical → fusion → filters → reranker → context composer → answer`.

**Structure/setup.** `src/retrieval/dense`, `lexical`, `fusion`, `rerank`, `router`, `context`. Keep each stage behind typed interfaces for offline replay.

**API/schema.** Search response records original query, transforms, candidate scores/ranks, reranker score, selected context IDs. Generator receives only final permitted context.

**Storage/errors/security.** Cache candidate results only with tenant/index/query-version keys. If reranker fails, fall back to validated first-stage ordering and record degraded mode. Filters are server-controlled.

**Tests/evals/obs/perf/cost.** Compare dense baseline vs lexical vs hybrid vs reranked on recall@k, MRR/nDCG, grounded answer success, p95, and cost. Trace every stage and score distribution.

**Acceptance.** Reranked hybrid beats baseline on predefined quality metric without violating latency/cost budget. **Senior review.** Which query classes regress, and would routing beat a single hybrid policy?

# Project 9 — LangChain TypeScript Application

**Requirements.** Build a support assistant using current LangChain models/messages, structured output, retriever, tools, streaming, middleware, and tracing while keeping domain services framework-independent.

**Architecture.** `HTTP → application service → LangChain composition/createAgent → model/retriever/tool adapters → typed result`.

**Structure/setup.** `src/domain/`, `src/ai/langchain/`, `src/tools/`, `src/retrieval/`, `src/policy/`. Pin LangChain/provider versions and document migration-sensitive imports.

**API/schema.** `POST /support` returns streamed UI events plus terminal structured `{answer,citations,escalate}`. Tools adapt existing order/customer services.

**Storage/errors/security.** Domain services enforce tenant auth regardless of LangChain tool wrapper. Middleware handles tracing/model fallback, not hidden privilege logic. Map framework exceptions to stable errors.

**Tests/evals/obs/perf/cost.** Unit-test domain/adapters independently; integration-test current LangChain package contracts; eval structured result/tool/retrieval paths and fallback model. Record framework/model/prompt version in traces.

**Acceptance.** Replacing LangChain orchestration with a test fake leaves domain/policy logic intact. **Senior review.** Where is LangChain reducing complexity and where could it become unnecessary coupling?

# Project 10 — LangGraph Customer-Support Workflow

**Requirements.** Create a stateful graph that classifies request, retrieves policy, optionally uses read tools, drafts resolution, interrupts for high-risk compensation approval, then closes/escalates.

**Architecture.** `START → understand → retrieve → route → read tools? → draft → validate → approval? → execute → END`.

**Structure/setup.** `src/graph/state.ts`, `nodes/`, `routing/`, `checkpoint/`, `tools/`, `policy/`. Use modern `StateSchema`, durable production checkpointer, typed graph input/output.

**API/schema.** Run endpoints create/invoke, return interruption payload/status, and resume with an approval command bound to the same thread/run/action.

**Storage/errors/security.** Checkpoints contain no raw secrets; authorization rechecked after resume; execute node uses idempotency. Handle provider/tool retry, abandonment, cancellation, stale approvals, and state schema version.

**Tests/evals/obs/perf/cost.** Test every edge/conditional route, interrupt/replay, process restart, duplicate resume, changed permission, and terminal error. Evaluate route accuracy, tool success, resolution quality, steps/tokens/cost.

**Acceptance.** Workflow survives worker restart; no high-risk write before approval; replay is safe. **Senior review.** Which nodes should remain deterministic even if model routing appears accurate?
