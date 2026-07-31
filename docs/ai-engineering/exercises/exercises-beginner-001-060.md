---
id: exercises-beginner-001-060
title: Exercises 001–060 — Beginner
---

# 60 Beginner Exercises

Each exercise states the problem, expected outcome, a hint, and related chapter(s). Solve before reading adjacent handbook material again.

| # | Problem | Expected outcome | Hint | Related chapters |
|---:|---|---|---|---|
| 001 | Explain AI vs ML vs deep learning vs generative AI using one product example each. | Clear hierarchy and no claim that every AI system is an LLM. | Start from umbrella → learned systems → neural nets → generation. | 001 |
| 002 | Draw the next-token generation loop. | Prompt, logits/probabilities, token selection, append/repeat. | Generation is iterative. | 002, 015 |
| 003 | Explain why sending a chat message does not update model weights. | Distinguish inference context from training. | Parameters are learned during training. | 003, 011–014 |
| 004 | Label the major transformer stages. | Tokens, embeddings/position, blocks, logits. | Use the diagram from foundations. | 004–007 |
| 005 | Describe attention without saying “the model searches the internet.” | Query/key/value relationship and weighted information. | Attention operates over representations in context. | 005–006 |
| 006 | Give three examples where token count differs greatly from word count. | Code, multilingual text, punctuation/IDs are recognized. | Tokens are vocabulary pieces. | 008–009 |
| 007 | Explain why a 200k context window does not guarantee good use of 200k tokens. | Mentions cost, latency, relevance/position quality. | Capacity ≠ retrieval quality. | 007, 017 |
| 008 | Compare pretraining, instruction tuning, and fine-tuning. | Correct purpose of each stage. | Think general capability vs desired behavior. | 012–013 |
| 009 | Define inference and name three serving metrics. | TTFT, throughput/tokens per second, total latency. | Separate serving from training. | 014 |
| 010 | Explain temperature and top-p in plain language. | Sampling controls described without “truth” guarantee. | They reshape/restrict choices. | 015–016 |
| 011 | Write a prompt that extracts a support-ticket category and admits uncertainty. | Explicit labels, evidence boundary, insufficient-data behavior. | Include task + constraints + output. | 021–024 |
| 012 | Improve “Summarize this document.” | Audience, purpose, length, evidence constraints. | Ask what useful summary means. | 021–023 |
| 013 | Wrap untrusted ticket text with delimiters and instructions. | Payload is visibly separate from trusted instruction. | Delimiters improve clarity, not security. | 025, 034 |
| 014 | Create two few-shot examples for a billing/account classifier. | Examples teach a boundary rather than obvious duplicates. | Pick confusing cases. | 026 |
| 015 | Rewrite a persona-heavy prompt into operational criteria. | Concrete checks replace theater. | Role can remain, criteria must be explicit. | 027 |
| 016 | Split “research and email a customer” into deterministic steps. | Retrieval/draft/approval/send boundaries. | Separate generation from side effects. | 028–029 |
| 017 | Design a two-pass draft → critique → revision prompt. | Rubric and bounded revision. | Critique specific criteria. | 030 |
| 018 | Build a small TypeScript prompt-template function. | Typed variables and clear data boundary. | Keep business policy outside string concatenation. | 031–032 |
| 019 | List five fields to record when debugging prompt regressions. | Model, prompt version, input, context, output/latency/usage. | Reproducibility first. | 035–037 |
| 020 | Define three offline eval cases for a prompt. | Happy, ambiguous, adversarial/edge case. | Expected properties can be rubrics. | 036–037 |
| 021 | Create a server-side OpenAI client using an environment variable. | No secret in browser code. | API keys belong server-side. | 038 |
| 022 | Add an abort timeout around a model request boundary. | Cancellation cleanup and bounded deadline. | Use `AbortController`. | 039 |
| 023 | Classify 429, invalid schema, timeout, and user cancel as retryable/non-retryable. | Sensible retry policy. | Do not retry permanent/client failures blindly. | 039 |
| 024 | Define a provider-neutral `ModelProvider` interface. | Core domain does not import one provider SDK. | Model, input, signal, result/usage. | 040 |
| 025 | Explain why valid JSON can still be invalid application data. | Syntax vs schema vs semantic validation. | JSON is not a contract. | 041–047 |
| 026 | Create a Zod schema for `{priority, summary, owner}`. | Enum/string/nullability modeled deliberately. | Avoid arbitrary strings for closed states. | 043–046 |
| 027 | Model `ok`, `insufficient_context`, and `blocked` as a discriminated union. | Distinct typed variants. | Use a `status` discriminator. | 046 |
| 028 | Add a semantic rule “refund amount cannot exceed purchase amount.” | Deterministic domain validation after schema parse. | Valid number ≠ valid business action. | 047 |
| 029 | Design recovery for malformed output vs missing evidence. | Retry only malformed/transient case; missing evidence terminates/asks. | Classify failure first. | 048 |
| 030 | Describe a safe schema-evolution change and a breaking one. | Additive optional field vs changed meaning/type. | Think queued consumers. | 049 |
| 031 | Explain tool calling to a junior developer. | Model proposes; application executes. | Draw the execution boundary. | 051 |
| 032 | Define a Zod schema for a read-only `getOrder` tool. | Bounded typed argument. | Identity/tenant should not come from model. | 052–054 |
| 033 | Show where authorization belongs in a tool executor. | After parse, before external action. | Server context supplies actor. | 053–055 |
| 034 | Classify tools: search docs, send email, refund payment, read profile. | Risk/read-write distinctions. | Side effects and sensitivity matter. | 055 |
| 035 | Identify two tool calls safe to parallelize and two that are not. | Independent reads vs dependent/write operations. | Dependency and side effects decide. | 056 |
| 036 | Design an error object returned from a failed tool. | Safe category/message/retryability, no secrets. | Model needs actionable observation. | 057 |
| 037 | Add an idempotency key to a refund tool. | Logical action replays safely. | Tie key to run + payment/action. | 058 |
| 038 | Explain why “ask the user before refunding” in the prompt is insufficient. | HITL requires persisted approval workflow. | Prompts do not enforce execution. | 059 |
| 039 | Define four streaming event types for a chat UI. | Stable application events, not raw provider frames. | text/tool/done/error. | 060 |
| 040 | Explain partial-stream failure handling. | UI shows interruption; server terminal state remains authoritative. | A prefix is not successful completion. | 060 |
| 041 | Define an embedding vector and dimension. | Numeric representation + fixed coordinate count. | Geometry carries learned relationships. | 061–062 |
| 042 | Implement cosine similarity for two arrays. | Dimension/zero-vector checks. | Dot divided by magnitudes. | 063 |
| 043 | Compare cosine, dot product, and Euclidean distance. | Correct intuition and metric consistency. | Similarity vs geometric distance. | 063–064 |
| 044 | Explain why embeddings do not enforce permissions. | Similarity is semantic, not authorization. | Filters/policy are separate. | 066, 077 |
| 045 | Propose a threshold-calibration dataset. | Labeled query-document pairs, not guessed score. | Scores vary by model/corpus. | 067 |
| 046 | List metadata to store with each document embedding. | Source/chunk/model/version/tenant/location. | Plan for re-index/migration. | 068–071 |
| 047 | Explain why changing embedding model requires re-embedding. | Vector spaces are incompatible unless designed otherwise. | Version the index. | 071 |
| 048 | Describe multilingual retrieval testing. | Evaluate actual languages/code mixing. | English quality does not transfer automatically. | 072 |
| 049 | Explain exact vs ANN search. | Recall/speed trade-off. | Small datasets may use exact. | 073–074 |
| 050 | Compare HNSW and IVFFlat at a high level. | HNSW speed/recall/memory vs IVFFlat training/tuning trade-off. | Avoid claiming one always wins. | 075–076 |
| 051 | Write a tenant-aware vector search pseudocode query. | Trusted tenant filter + semantic query. | Tenant comes from auth context. | 077–078 |
| 052 | Design deletion behavior when a source article is removed. | Old chunks removed/reconciled. | Index freshness includes deletes. | 079 |
| 053 | Pick pgvector vs managed vector DB for a small SaaS and justify. | Requirement-driven choice. | Operations, scale, relational metadata. | 080 |
| 054 | Draw the end-to-end basic RAG pipeline. | Ingest through grounded answer. | Separate offline ingestion and online query paths. | 081–082 |
| 055 | Name three PDF parsing problems. | Reading order, scans/OCR, tables/headers etc. | Plain text can lose structure. | 083–085 |
| 056 | Compare fixed, sentence, heading-aware chunking. | Trade-offs and structure awareness. | Retrieval unit should be meaningful. | 086–090 |
| 057 | Explain chunk overlap pros/cons. | Boundary context vs duplication/cost/noise. | Prefer structure before giant overlap. | 091 |
| 058 | Design a RAG answer schema with citations. | Status, answer, citation IDs. | Validate citations exist in context. | 096–098 |
| 059 | Give two cases where RAG is the wrong solution. | Direct DB query/extraction/full small context etc. | Match technique to problem. | 099 |
| 060 | Sketch a minimal TypeScript `Retriever` interface and RAG function. | Search → context → model with explicit tenant and budget. | Keep retriever/generator separate. | 094–100 |
