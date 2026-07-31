---
id: chapters-111-130
title: 111–130 — LangChain TypeScript
---

# 111 — Why LangChain Exists

LangChain standardizes common model-application patterns: messages, model integrations, prompts, tools, structured output, retrievers, document utilities, streaming, middleware, and agents.

Use it when these abstractions reduce duplicated integration code. Plain provider SDK code is often simpler for one or two model calls with no orchestration.

**Rule.** Framework adoption should buy composability, portability, tracing, or lifecycle control—not merely add another layer.

# 112 — LangChain Packages & Provider Integrations

Modern JavaScript usage separates core LangChain abstractions from provider integrations such as `@langchain/openai`. This keeps provider-specific dependencies explicit.

```ts
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  model: process.env.AI_MODEL ?? "gpt-5.6",
});
```

Pin compatible package ranges, follow migration docs, and do not copy imports from old tutorials without checking current docs.

# 113 — Messages

Chat models operate on structured messages rather than one giant interpolated string. Messages preserve role and can carry multimodal/tool metadata depending on integration.

Keep untrusted content labeled as data. Avoid flattening tool results, policy, and user text into a single indistinguishable prompt when structured messages are available.

# 114 — Prompt Templates

Templates make variable inputs explicit and reusable. They are useful when multiple call sites share instruction/context structure, but should not hide business logic.

Version templates and test their rendered output. Validate data before interpolation and protect against accidentally including secrets or unauthorized retrieved context.

# 115 — Runnables

Runnable-style composition gives a common invocation/streaming/batching surface to components. The value is a composable pipeline whose boundaries can be tested independently.

```text
input → transform → prompt → model → parser
```

Do not turn every ordinary TypeScript function into framework composition. Use normal functions for deterministic domain logic and Runnables where the execution model adds value.

# 116 — Chains: Deterministic Composition

A chain is appropriate when the sequence is known: normalize input → retrieve → build prompt → call model → validate output.

This is not automatically an agent. Fixed orchestration is easier to reason about, benchmark, and secure. Prefer a chain/workflow until dynamic model-directed control is truly needed.

# 117 — Structured Output with LangChain

Modern LangChain supports structured output around model/agent calls. Define a Zod schema and keep the parsed result as the application boundary.

```ts
import { z } from "zod";

const Contact = z.object({
  name: z.string(),
  email: z.string().email().nullable(),
});
```

Provider capabilities differ; evaluate constrained native structured output vs tool-based strategies where the framework provides both.

# 118 — Tools

LangChain tools wrap callable functions with names/descriptions/schemas so compatible models can propose calls.

The tool wrapper is not an authorization boundary. Put validation, tenant checks, scopes, timeouts, idempotency, and audit logging inside or immediately around the execution layer.

**Design.** Keep pure domain service functions underneath tool adapters so they remain testable without an LLM.

# 119 — Tool Calling with Models

Binding tools makes schemas available to a tool-capable model. The model can return tool-call requests; the runtime/application executes them and returns observations.

Inspect tool call IDs and correlate results correctly. Treat arguments as untrusted. Bound repeated calls and classify tool errors rather than returning opaque exception strings into the model loop.

# 120 — `createAgent`: The Modern High-Level Agent API

Current LangChain JavaScript uses `createAgent` as the primary high-level agent constructor. It builds a graph-based runtime on LangGraph and can combine model, tools, middleware, state, and structured output.

Conceptually:

```ts
import { createAgent } from "langchain";

const agent = createAgent({
  model: process.env.AGENT_MODEL ?? "openai:gpt-5.6",
  tools: [/* typed tools */],
});
```

Exact provider/model string support is integration-sensitive; follow current docs and pin versions.

# 121 — Middleware

Middleware wraps model/tool/agent lifecycle points to implement cross-cutting behavior such as model routing, retries, fallbacks, guardrails, redaction, rate controls, and HITL.

Keep middleware single-purpose and observable. A stack of invisible prompt mutations becomes harder to debug than explicit policy components.

# 122 — Retrievers

A retriever converts a query into documents. LangChain offers interfaces/integrations for vector stores and custom retrieval.

Use a custom retriever boundary when product logic needs hybrid search, ACL filters, reranking, source routing, or query-specific strategies. “Retriever” should not imply “top-k vector search only.”

# 123 — Vector Stores

LangChain vector-store integrations normalize embedding/upsert/search workflows across providers.

That portability is useful for experiments, but provider-specific capabilities—hybrid fusion, payload filters, multi-vector search, namespaces, index tuning—may require explicit adapters. Do not sacrifice production functionality merely to keep every database interchangeable.

# 124 — Document Loaders

Loaders convert external sources into document objects containing content and metadata. Treat them as ingestion adapters, not as a complete production ingestion system.

Wrap them with source versioning, parser configuration, checksums, retries, deletion handling, access metadata, and observability. Never assume loader output preserves complex PDF/table structure adequately for your use case.

# 125 — Text Splitters

Text splitters implement chunking strategies such as recursive character/token splitting. Use them as baselines, then evaluate heading-, code-, table-, or semantic-aware strategies where corpus structure matters.

Chunking policy belongs in a versioned ingestion pipeline so changing it triggers controlled re-indexing rather than silent mixed behavior.

# 126 — Embeddings in LangChain

Embedding integrations expose document/query embedding operations. Keep batch size, retry policy, model identity, and cost telemetry explicit.

```text
documents → splitter → embedding integration → vector store
query → embedding integration → retrieval
```

Do not switch embedding models without rebuilding/evaluating the index.

# 127 — Streaming & Events

Streaming can expose model tokens/messages and runtime events. Build an application event envelope so the UI does not depend directly on framework-internal event shapes.

```ts
type AiEvent =
  | { type: "text_delta"; text: string }
  | { type: "tool_started"; name: string }
  | { type: "tool_finished"; name: string }
  | { type: "done" };
```

This keeps SSE/WebSocket contracts stable across framework upgrades.

# 128 — Callbacks, Tracing & Observability

Instrument model calls, tool calls, retriever results, token usage, latency, errors, and run/trace IDs. LangSmith can integrate deeply, but the observability model is vendor-neutral: every request should be reconstructible without logging secrets.

Export useful telemetry to the organization’s tracing/metrics stack where appropriate.

# 129 — Error Handling & Fallbacks

Framework abstractions do not eliminate distributed-system failures. Classify provider rate limits/timeouts, validation failures, tool errors, retrieval misses, context overflow, and policy denials.

Use middleware/adapters for retries and fallbacks when they preserve task semantics. Surface terminal failure states to application code rather than looping indefinitely.

# 130 — When to Use LangChain vs Plain SDK vs LangGraph

Use **plain SDK code** for simple model calls where an extra abstraction adds little. Use **LangChain** for common model/tool/retrieval/agent integration patterns. Use **LangGraph** when you need explicit state, topology, checkpoints, interrupts, durable workflows, loops, subgraphs, or precise control.

```text
simple call → provider SDK
composable AI app → LangChain
stateful controlled workflow → LangGraph
```

Senior engineering means choosing the smallest layer that makes the system clearer rather than selecting a framework because it is fashionable.
