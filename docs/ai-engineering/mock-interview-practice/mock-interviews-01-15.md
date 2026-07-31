---
id: mock-interviews-01-15
title: 15 Mock Interview Rounds
---

# 15 Mock AI Engineering Interview Rounds

Each round is designed for 60–90 minutes. Explain assumptions aloud, draw trust/control boundaries, and distinguish deterministic tests from probabilistic evals.

## Round 01 — LLM Foundations + API Reliability

**Concepts:** tokens, inference, context, sampling, reasoning models. **Coding:** implement provider-neutral model adapter with timeout/cancellation. **Debugging:** 429/timeout retry storm. **System design:** text utility API with cost/latency telemetry.

**Interviewer expectations:** accurate next-token mental model; no claim that temperature guarantees correctness; bounded retries; server-side secrets; task-quality/cost metrics.

## Round 02 — Structured Outputs + Extraction

**Concepts:** Zod/JSON Schema, nullable vs missing, semantic validation. **Coding:** typed invoice extractor. **Debugging:** provider returns schema-valid but impossible total/date. **Security:** untrusted document text. **Design:** version schemas for queued jobs.

**Expectations:** model output remains untrusted; structural and domain validation separated; no retry for absent evidence; version-compatible consumers.

## Round 03 — Tool Calling + HITL

**Concepts:** tool proposal vs execution, read/write risk, idempotency. **Coding:** `getOrder` + `cancelOrder` executor. **Debugging:** duplicate cancel after retry. **Security:** tenant authorization. **Design:** persistent approval flow.

**Expectations:** policy before effect, approval bound to exact arguments, replay-safe writes, useful tool error taxonomy.

## Round 04 — Embeddings + Vector Search

**Concepts:** cosine/dot/Euclidean, dimensions, ANN. **Coding:** cosine similarity + vector-store interface. **Debugging:** mixed embedding versions. **Design:** pgvector vs managed engine.

**Expectations:** metric consistency, versioned re-embedding, exact/ANN benchmark, metadata filters for security/domain constraints.

## Round 05 — RAG Foundations

**Concepts:** ingestion, parsing, chunking, retrieval, grounding. **Coding:** basic RAG context builder with citation IDs. **Debugging:** stale deleted document. **Design:** document freshness/reconciliation.

**Expectations:** complete pipeline, source provenance, independent retrieval eval, insufficient-context behavior.

## Round 06 — Advanced RAG

**Concepts:** hybrid BM25+dense, reranking, query rewrite, parent-child retrieval. **Coding:** reciprocal-rank fusion. **Debugging:** reranker lowers task success. **Design:** multi-index routing.

**Expectations:** measure quality by query segment, preserve original query, separate retrieval and context granularity, reason about latency/cost.

## Round 07 — LangChain TypeScript

**Concepts:** models/messages/runnables/tools/retrievers/middleware/`createAgent`. **Coding:** current LangChain structured tool flow. **Debugging:** framework retry duplicates write. **Design:** plain SDK vs LangChain boundary.

**Expectations:** current API concepts, domain services independent of framework, middleware observable, auth not delegated to agent wrapper.

## Round 08 — LangGraph State + Durability

**Concepts:** `StateSchema`, reducers, nodes/edges, checkpoints, threads. **Coding:** conditional graph. **Debugging:** old checkpoint fails after deploy. **Design:** state-version migration.

**Expectations:** explicit graph control, durable state kept serializable, old-run compatibility, tested terminal paths.

## Round 09 — LangGraph HITL + Replay

**Concepts:** interrupts, `Command({resume})`, replay semantics. **Coding:** approval node. **Debugging:** side effect runs twice after resume. **Security:** auth revoked while paused.

**Expectations:** node restart rule understood; prepare→interrupt→re-auth→idempotent execute; thread ID not treated as authorization.

## Round 10 — Agent Architecture

**Concepts:** workflow vs agent, ReAct, planner/executor, router, reflection. **Coding:** bounded agent loop. **Debugging:** repeated tool call/no progress. **Design:** support agent architecture.

**Expectations:** least-agentic viable design, step/time/token/cost budgets, trajectory evals, deterministic policy boundaries.

## Round 11 — Multi-Agent + Memory

**Concepts:** supervisor/workers, handoffs, conflicts, convergence, memory taxonomy. **Coding:** typed worker artifact/merge. **Debugging:** cyclical delegation. **Security:** cross-worker confidential data.

**Expectations:** empirical justification for multiple agents, isolated state by default, convergence rules, memory provenance/deletion.

## Round 12 — MCP + OAuth

**Concepts:** host/client/server, tools/resources/prompts, stdio/Streamable HTTP, stable vs draft protocol, OAuth/PKCE/scopes. **Coding:** TypeScript MCP read tool/client allowlist. **Debugging:** malicious new write tool. **Security:** token audience/passthrough.

**Expectations:** MCP not called an agent framework, stable 2025-11-25 baseline recognized, discovery not authorization, least-privilege credential design.

## Round 13 — Evals + Observability

**Concepts:** golden datasets, deterministic graders, LLM judge, trajectory evals, tracing. **Coding:** retrieval + citation graders. **Debugging:** judge drift. **Design:** organization eval platform.

**Expectations:** component and end-to-end metrics, judge calibration, versioned artifacts, privacy-safe trace schema, release gating.

## Round 14 — Production Reliability + Cost

**Concepts:** queues, routing, caching, circuit breakers, backoff, cost/latency. **Coding:** idempotent retry wrapper/job state machine. **Incident:** provider outage + cost spike. **Design:** model gateway.

**Expectations:** end-to-end deadlines, one retry owner, semantic fallback compatibility, tenant-safe cache keys, cost per successful task.

## Round 15 — Staff Capstone System Design

**Prompt:** design the Production Multi-Tenant AI Agent Platform from the capstone. Cover auth/tenancy, gateway, RAG, LangGraph, tools/MCP, OAuth, HITL, async jobs, evals, observability, security, cost, deployment, incidents, and evolution.

**Challenge events:** cross-tenant retrieval; provider outage; checkpoint migration; malicious MCP server; 5× cost spike; write timeout after possible success.

**Interviewer expectations:** candidate starts from requirements/trust boundaries, chooses complexity deliberately, protects deterministic invariants, defines evidence/metrics/SLOs, and has migration/rollback/incident strategies. Staff-level answers discuss team ownership and paved-road design in addition to technology.
