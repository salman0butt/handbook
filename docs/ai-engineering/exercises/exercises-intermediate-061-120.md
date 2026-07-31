---
id: exercises-intermediate-061-120
title: Exercises 061–120 — Intermediate
---

# 60 Intermediate Exercises

| # | Problem | Expected outcome | Hint | Related chapters |
|---:|---|---|---|---|
| 061 | Add BM25 to a dense retriever and merge candidates. | Hybrid candidate set with deterministic fusion. | Keep source ranks before fusion. | 101–102 |
| 062 | Implement reciprocal-rank fusion for two ranked lists. | Stable fused ranking with tunable constant. | Sum reciprocal rank contributions. | 101 |
| 063 | Create a hybrid-search eval split by exact-ID vs semantic queries. | Evidence of where each retriever wins. | Segment metrics by query class. | 101–102, 109 |
| 064 | Add a second-stage reranker to top-50 candidates. | Reranked top-k plus latency measurement. | Retrieve broadly, rerank narrowly. | 103 |
| 065 | Determine whether reranking 20, 50, or 100 candidates is best. | Quality/latency/cost curve. | Benchmark rather than guess. | 103, 110 |
| 066 | Build a query rewriter that preserves quoted IDs and dates. | Rewritten semantic text without losing constraints. | Keep original alongside rewrite. | 104 |
| 067 | Implement multi-query retrieval with deduplication. | Merged candidates and capped expansion. | Track source query per hit. | 104 |
| 068 | Compare HyDE to original-query retrieval on 50 cases. | Measured gain/regression by query class. | HyDE can drift. | 104, 109 |
| 069 | Implement parent-child retrieval for policy sections. | Small child indexed, larger parent returned. | Separate retrieval and context granularity. | 105 |
| 070 | Route HR vs product-doc queries to separate indexes. | Typed router with fallback. | Hard ACL before model routing. | 106 |
| 071 | Add temporal filtering for effective policies. | No expired/future policy retrieval. | Use trusted timestamps. | 106 |
| 072 | Compress retrieved context to a token budget. | Important evidence retained with traceability. | Never lose source mapping. | 107 |
| 073 | Detect and remove overlapping duplicate chunks. | Less context duplication without losing evidence. | Compare source adjacency/text similarity. | 107 |
| 074 | Model `conflicting_sources` as a terminal RAG state. | Answer does not invent resolution. | Source authority can be deterministic. | 108 |
| 075 | Build recall@5, recall@10, and MRR calculator. | Correct retrieval metrics from judgments. | Evaluate retriever alone. | 109 |
| 076 | Build citation-validity grader. | Every cited ID exists in supplied context. | Deterministic grader. | 098, 110 |
| 077 | Design a groundedness rubric. | Claims must be supported by cited evidence. | Separate correctness from support. | 097, 110 |
| 078 | Run a RAG regression after changing chunk size. | Before/after retrieval + generation metrics. | Keep model/prompt constant. | 090–091, 110 |
| 079 | Install modern LangChain packages and call a chat model. | Current provider integration works. | Keep provider adapter isolated. | 111–113 |
| 080 | Convert raw prompt concatenation to structured messages. | Roles/data boundaries remain explicit. | Avoid one giant string. | 113 |
| 081 | Create a LangChain prompt template for support classification. | Typed runtime variables and versioned template. | Test rendered prompt. | 114 |
| 082 | Compose transform → model → parser as a runnable pipeline. | Independently testable stages. | Deterministic transforms can remain functions. | 115–116 |
| 083 | Decide whether a fixed extraction flow needs an agent. | Justified “no” with simpler chain. | Known sequence → deterministic. | 116, 130 |
| 084 | Add Zod structured output to a LangChain model call. | Valid typed domain object. | Runtime parse still matters. | 117 |
| 085 | Wrap an existing order service as a LangChain tool. | Tool adapter does not duplicate domain logic. | Domain service stays framework-free. | 118 |
| 086 | Add auth/tenant checks around that tool. | Model cannot choose security context. | Inject request context server-side. | 118–119 |
| 087 | Simulate an invalid tool argument and recover. | Structured tool error/retry decision. | Classify before retry. | 119, 129 |
| 088 | Build a minimal `createAgent` with one read tool. | Current agent API runs. | Pin current docs/packages. | 120 |
| 089 | Add model-routing middleware. | Request selects model from deterministic policy/context. | Middleware should remain observable. | 121 |
| 090 | Add retry/fallback middleware for transient model failure. | Bounded fallback with trace evidence. | Preserve capability contract. | 121, 129 |
| 091 | Write a custom LangChain retriever using hybrid search. | Framework interface over product retrieval logic. | Don’t reduce policy to vector top-k. | 122 |
| 092 | Swap pgvector adapter for Qdrant behind one interface. | App behavior unchanged except provider tuning. | Keep provider features in adapter. | 123 |
| 093 | Ingest Markdown with a document loader and source metadata. | Traceable documents, not bare strings. | Loader is only first stage. | 124 |
| 094 | Add recursive splitting and compare to heading-aware splitting. | Eval-driven chunk choice. | Same retrieval dataset. | 125 |
| 095 | Batch embeddings through a LangChain integration. | Versioned embedding output and bounded retries. | Store model/dimension metadata. | 126 |
| 096 | Normalize LangChain stream events to app events. | UI contract independent from framework. | Map only stable needed semantics. | 127 |
| 097 | Add trace IDs across model/retriever/tool calls. | One reconstructable request trajectory. | Avoid secrets in spans. | 128 |
| 098 | Add provider timeout and retry classification. | No infinite retries. | Framework does not remove network failures. | 129 |
| 099 | Rewrite a simple LangChain flow with plain SDK code. | Compare complexity and dependencies. | Use same evals. | 130 |
| 100 | Decide LangChain vs LangGraph for an approval workflow. | LangGraph chosen for state/interrupt durability. | Requirement drives layer. | 130, 149–155 |
| 101 | Define a modern LangGraph `StateSchema` with request/result. | Zod-backed typed state. | Prefer current StateSchema baseline. | 133–134 |
| 102 | Add a reducer for message/counter accumulation. | Parallel updates merge predictably. | Reducer semantics matter. | 135 |
| 103 | Implement `retrieve` and `answer` graph nodes. | Small testable responsibilities. | Inject services. | 136 |
| 104 | Add START/END edges and invoke the graph. | Valid terminal result. | Test terminal state. | 137–142 |
| 105 | Add conditional edge for `needsRetrieval`. | Deterministic branch from state. | Keep policy separate from model. | 139 |
| 106 | Return `Command({update,goto})` from a node. | State update plus dynamic route. | Document dynamic edges. | 140 |
| 107 | Stream graph progress to an SSE adapter. | Stable phase events. | Translate framework events. | 143 |
| 108 | Add max model/tool iteration counters. | Loop terminates safely. | Budget is state/policy. | 144 |
| 109 | Fan out two independent retrieval nodes. | Parallel results merge correctly. | Define reducer/join semantics. | 145 |
| 110 | Add a checkpointer and thread ID. | State persists between calls. | Thread is not authorization. | 146–147 |
| 111 | Simulate process restart after a checkpoint. | Run resumes from durable state. | Use persistent production backend concept. | 146–148 |
| 112 | Add an approval `interrupt()`. | Caller receives JSON-serializable review payload. | Persist before wait. | 149 |
| 113 | Resume the approval with `Command({resume:true})`. | Same thread continues. | Validate external input. | 150 |
| 114 | Place a side effect before `interrupt()` and demonstrate replay risk. | Understand duplicate execution hazard. | Resumed node restarts. | 151 |
| 115 | Refactor that side effect to be idempotent after approval. | Safe replay. | Prepare before interrupt; write after. | 151–152 |
| 116 | Route provider 429 vs auth denial differently. | Retry transient; terminate policy denial. | Error taxonomy. | 153 |
| 117 | Extract retrieval into a subgraph. | Narrow typed subgraph contract. | Avoid sharing all parent state. | 154 |
| 118 | Add cancellation/deadline to a long-running graph. | Terminal cancelled/expired state. | Persist deadline. | 155 |
| 119 | Version graph state and resume an old checkpoint in test. | Compatible migration path demonstrated. | Persisted state outlives deploys. | 148, 155 |
| 120 | Build a support graph combining retrieval, tool, validation, and approval. | Complete typed path with safe termination. | Use least agentic control needed. | 131–155 |
