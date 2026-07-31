---
id: live-coding-exercises
title: Live Coding Exercises
---

# Live Coding Exercises

For each task, state assumptions, define types first, handle failure/cancellation, and explain what you would unit-test vs evaluate.

## 1 — Streaming Model Response

Implement an API handler that streams normalized `text_delta | done | error` events, propagates client cancellation, records TTFT/usage, and never exposes provider event objects as the public API.

**Interviewer looks for:** `AbortSignal`, backpressure/disconnect thinking, terminal state, safe logging.

## 2 — Zod Structured Extraction

Given invoice text, return a discriminated union: `ok` with validated fields, `insufficient_context`, or `invalid`. Add semantic validation for nonnegative total and valid ISO currency/date.

**Look for:** runtime validation, missing evidence, no unsafe `as` assertions.

## 3 — Tool Calling Executor

Implement a registry that parses model tool args, obtains actor/tenant from server context, authorizes, executes, and returns structured result/error.

**Look for:** model does not execute or authorize; write risk/idempotency extension point.

## 4 — Retry Wrapper

Implement bounded exponential backoff with jitter, end-to-end deadline, cancellation, and a retry predicate. Do not retry validation/policy/user-cancel errors.

## 5 — Embedding Similarity

Implement cosine similarity with dimension and zero-vector checks, then rank a small list by score.

## 6 — pgvector Search Boundary

Define a TypeScript repository method for tenant-filtered nearest-neighbor search. Use parameterized SQL and make metric/operator/index assumptions explicit.

## 7 — Basic RAG Pipeline

Implement `answer(query, ctx)` with retriever, token-bounded context, source IDs, model call, and citation-ID validator.

## 8 — Chunking

Implement a heading-aware Markdown chunker with maximum token/character fallback and metadata `{documentId, headingPath, ordinal}`.

## 9 — Reranking Interface

Define a first-stage retriever and second-stage reranker interface. Add timeout/fallback to first-stage order and trace stage scores.

## 10 — LangChain Runnable/Application

Using current LangChain JavaScript, compose a typed input transform, prompt/messages, model, and structured output. Explain why a plain SDK may be simpler for this exact task.

## 11 — LangGraph State Graph

Build current `StateSchema` with `request`, `needsRetrieval`, `evidence`, `answer`; nodes `route`, `retrieve`, `answer`; conditional routing; START/END.

## 12 — Human Approval Interrupt

Add `interrupt()` for a proposed write, compile with a checkpointer, and resume via `Command({resume})`. Explain node replay and place the side effect safely.

## 13 — MCP Tool

Create a stable-baseline TypeScript MCP server with one read-only tool, Zod input, stdio transport, and stderr-only diagnostics. Explain what must change for remote Streamable HTTP security.

## 14 — Agent Loop Protection

Given a model→tools loop, implement maximum calls, elapsed deadline, token/cost budget fields, and repeated normalized tool-call detection.

## 15 — Evaluation Harness

Given JSONL cases `{input, expected}`, execute a candidate function and output pass rate, field accuracy, latency, and cost. Make graders pluggable and preserve per-case failures.

## 16 — Recall@k / MRR

Implement retrieval metrics from expected relevant IDs and ranked result IDs. Explain why they cannot measure generation groundedness.

## 17 — Idempotent Write Tool

Implement an executor that stores `idempotencyKey → status/result`, handles concurrent duplicate requests, and resolves timeout-after-possible-success.

## 18 — Async Job State Machine

Implement valid transitions for `queued | running | waiting_approval | completed | failed | cancelled`; reject illegal transitions and duplicate worker delivery.

## 19 — Model Router

Select model from task type, latency budget, risk, tenant tier, and provider health using deterministic policy. Return routing reason for traces.

## 20 — Tenant-Safe Cache Key

Build a key for RAG response caching including workspace, actor/access scope version, prompt/model/retrieval/index version, normalized query, and locale.

## Scoring rubric

Score correctness, strict TypeScript modeling, validation, cancellation/timeouts, error classification, authorization boundaries, idempotency, testability, observability, performance/cost awareness, and explanation. Strong candidates explicitly state what remains probabilistic and what must be deterministic.
