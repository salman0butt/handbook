---
id: projects-01-05
title: Guided Projects 01–05
---

# Project 1 — Prompt-Based Text Utility

**Requirements.** Build `/api/rewrite` that rewrites supplied text for a requested audience while preserving facts, supports cancellation, and never accepts provider keys from clients.

**Architecture.** `HTTP → Zod request → prompt builder → ModelProvider → validated response → trace`.

**Folder structure.** `src/api/`, `src/ai/model/`, `src/ai/prompts/`, `src/domain/rewrite/`, `src/telemetry/`, `tests/`.

**Setup.** Node 20+, strict TypeScript, Zod 4, provider SDK, `.env` secret loaded server-side. Pin prompt/model config.

**Implementation / API / schemas.** `POST /api/rewrite {text,audience,maxWords}` → `{text,usage}`. Validate length and audience enum. Implement a provider interface plus one concrete adapter; pass an `AbortSignal` and 15s deadline.

```ts
const RewriteInput = z.object({
  text: z.string().min(1).max(20_000),
  audience: z.enum(["general", "technical", "executive"]),
  maxWords: z.number().int().min(20).max(800),
});
```

**Storage.** No content persistence by default; aggregate usage/cost telemetry only. **Errors.** Map validation, timeout, rate limit, provider, cancellation to stable application errors. **Security.** Server-held secret; redact input from default logs; rate limit by actor.

**Tests / evals / observability.** Unit-test prompt rendering and request validation; mock provider timeout; eval factual preservation, length compliance, and style across 30 cases. Trace prompt version/model/latency/tokens. **Performance/cost.** Enforce input/output budgets and stream only if UX benefits.

**Acceptance.** No hallucinated new facts on golden cases; cancellation works; no secrets/content in logs; p95 and cost recorded. **Senior review.** When would deterministic templates beat an LLM? How would you canary a prompt/model change?

# Project 2 — Structured Data Extractor with Zod

**Requirements.** Extract invoice fields into a typed schema with explicit missing values and validation errors.

**Architecture.** `document text → model structured output → Zod → domain validation → result`.

**Structure/setup.** `src/extract/schema.ts`, `extractor.ts`, `providers/`, `domain/invoice.ts`, `evals/`. Install Zod 4 and a provider supporting structured output/tool schema.

**API/schema.** `POST /api/invoices/extract` accepts bounded text and returns `ok | insufficient | invalid`. Fields: invoice number, currency, total, due date, supplier; never invent missing values.

```ts
const Invoice = z.object({
  invoiceNumber: z.string().nullable(),
  currency: z.string().length(3).nullable(),
  total: z.number().nonnegative().nullable(),
  dueDate: z.string().nullable(),
  supplier: z.string().nullable(),
});
```

**Storage/errors/security.** Store only when product requires it; encrypt source/result at rest; distinguish schema failure from semantic total/date conflicts; do not retry missing evidence. Treat document instructions as untrusted data.

**Tests/evals/obs/perf/cost.** Unit-test domain rules; contract-test schema; eval exact field accuracy, null correctness, and hallucination rate on varied layouts. Record schema/model/prompt version, validation category, tokens. Batch only where privacy/error isolation remains safe.

**Acceptance.** 100% parseable validated outputs; field-level target accuracy; missing fields remain null. **Senior review.** How will schema evolution affect queued jobs and consumers?

# Project 3 — Streaming AI Chatbot

**Requirements.** Build a multi-turn chatbot that streams text, supports cancel/reconnect, persists conversation state, and records usage.

**Architecture.** `client → POST message → conversation service → model stream → normalized events → SSE → UI`; terminal events persist authoritative assistant result.

**Structure/setup.** `src/chat/`, `src/ai/`, `src/http/sse/`, `src/db/`, `src/events/`. PostgreSQL for conversations/messages; Redis optional for transient stream coordination.

**API/schema.** `POST /conversations`, `POST /conversations/:id/messages`, `GET /runs/:id/events`. Normalize events to `text_delta | usage | done | error` rather than exposing provider events.

**Storage/errors/security.** Conversation ownership/tenant filter on every read; idempotency key on message submission; handle disconnect, provider timeout, context overflow, duplicate submit. Never allow arbitrary conversation ID to bypass ownership.

**Tests/evals/obs/perf/cost.** Test SSE framing, reconnect, cancellation, duplicate key, context truncation/summarization. Evals cover helpfulness, instruction following, refusal/insufficient info. Trace TTFT, full latency, output rate, tokens, disconnects.

**Acceptance.** No duplicate messages on retries; cancellation terminates provider work; reconnect recovers terminal state. **Senior review.** When should chat history be summarized vs retrieved vs dropped?

# Project 4 — Tool-Calling Assistant

**Requirements.** Answer order questions with a read tool and propose/carry out a cancel-order write only after authorization and explicit approval.

**Architecture.** `model → tool proposal → schema parse → permission/risk layer → read execute OR HITL → idempotent write → result → model`.

**Structure/setup.** `src/tools/registry.ts`, `orders/read.ts`, `orders/cancel.ts`, `policy/`, `approvals/`, `agent/`.

**API/schema.** Tools: `get_order(orderId)` and `cancel_order(orderId, reason)`. Tool args never carry trusted tenant/user identity; executor derives that from request context.

**Storage/errors/security.** Approval row binds run, actor, exact normalized args, expiry, decision. Write uses an idempotency key. Distinguish permission denied, conflict/already shipped, transient API failure, invalid args, repeated call.

**Tests/evals/obs/perf/cost.** Unit-test policy and idempotency; simulate repeated tool call and changed args after approval; eval tool selection/argument accuracy and unauthorized prompts. Trace proposal→approval→execution chain.

**Acceptance.** No cancellation without policy+approval; replay cannot cancel twice; read cannot cross tenant. **Senior review.** Which tool descriptions are model UX vs which rules must exist in code?

# Project 5 — Semantic Search Engine

**Requirements.** Ingest 50k support articles and expose tenant-aware semantic search with source metadata and an exact/ANN benchmark.

**Architecture.** `sources → normalize → chunk → batch embed → vector store`; `query → embed → ACL filter → search → results`.

**Structure/setup.** `src/ingest/`, `src/chunk/`, `src/embeddings/`, `src/vector/`, `src/search/`, `evals/relevance.jsonl`. Start with PostgreSQL + pgvector; isolate `VectorStore` so another engine can be tested.

**API/schema.** `POST /search {query,limit,filters}` → result ID/title/snippet/source/score. Trusted server injects tenant/access filters.

**Storage/errors/security.** Store source checksum, chunk version, embedding model/version/dimension. Dead-letter failed chunks. Delete/reindex on source changes. Never rely on model text for ACL filtering.

**Tests/evals/obs/perf/cost.** Unit-test chunk identity; integration-test vector metric/filtering; evaluate recall@k/MRR and ANN recall vs exact; trace embedding/search latency and index version. Estimate embedding ingestion + vector storage + query costs.

**Acceptance.** Target recall@10 and p95 latency documented; no cross-tenant result in adversarial tests; re-embedding migration plan proven. **Senior review.** When would lexical/hybrid search outperform dense-only search?
