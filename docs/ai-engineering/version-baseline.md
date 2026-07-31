---
id: version-baseline
title: Version Baseline — July 31, 2026
sidebar_position: 2
---

# Version Baseline — July 31, 2026

AI APIs and agent frameworks change quickly. This handbook records the assumptions behind every version-sensitive example instead of pretending an API is timeless.

## Production baseline

| Area | Handbook baseline | Guidance |
| --- | --- | --- |
| Runtime | Node.js 20+; current LTS preferred | Use strict TypeScript and ESM-compatible packages where practical. |
| Validation | Zod 4.x | Validate model/tool boundaries at runtime. |
| OpenAI | Responses API as the primary modern API | Prefer the Responses API for new model, reasoning, tool, structured-output, and multimodal examples unless a feature explicitly requires another API. |
| OpenAI Agents SDK | `@openai/agents` current stable | Used where provider-specific agent SDK examples are useful; not the architecture default. |
| LangChain JS/TS | `langchain` 1.5.x baseline | Modern `createAgent`, tools, middleware, structured output, retrievers, and model integrations. |
| LangGraph JS/TS | `@langchain/langgraph` 1.4.x baseline | Low-level stateful graph/runtime examples: state, nodes, edges, persistence, interrupts, subgraphs, durable workflows. |
| LangChain OpenAI integration | `@langchain/openai` 1.5.x baseline | Keep provider integration separate from generic orchestration concepts. |
| MCP protocol | **2025-11-25 stable specification** | The 2026-07-28 protocol work is still a draft/beta migration target at this audit date; do not teach draft semantics as the stable production default. |
| MCP TypeScript SDK | `@modelcontextprotocol/sdk` 1.30.x production line | v2/draft examples must be explicitly labeled experimental/version-sensitive. |
| PostgreSQL vectors | pgvector current stable | Exact search plus HNSW/IVFFlat trade-offs are taught. |
| Pinecone / Qdrant / Weaviate / Redis | Current official APIs/concepts at authoring date | Concepts remain provider-neutral; provider-specific syntax is isolated in adapters/examples. |

## OpenAI model guidance

The current OpenAI model catalog changes independently of this handbook. Examples therefore use environment-configured model identifiers instead of hard-coding one model everywhere:

```ts
const MODEL = process.env.AI_MODEL ?? "gpt-5.6";
```

The current model family at this baseline includes GPT-5.6 variants. Model selection chapters teach capability/latency/cost/evaluation-driven routing rather than assuming the largest model is always correct.

## Stable vs version-sensitive guidance

Every example falls into one of three categories:

- **Conceptual/stable** — embeddings, cosine similarity, retrieval metrics, idempotency, authorization, queue semantics.
- **Current API** — imports, method names, request fields, framework helpers verified against current official docs.
- **Version-sensitive** — beta/draft protocol features, newly released SDK surface, or provider behavior that may change quickly.

When a version-sensitive API changes, preserve the mental model and update only the adapter/syntax chapter unless the underlying architecture also changed.

## MCP compatibility note

The stable protocol architecture remains host → client → server, with servers exposing tools, resources, and prompts over supported transports such as stdio and Streamable HTTP. Authorization for HTTP transports follows OAuth-oriented resource-server guidance. The newer 2026-07-28 protocol revision is intentionally treated as **draft** in this handbook until finalized.

## LangChain / LangGraph compatibility note

Modern LangChain JavaScript uses `createAgent` and middleware-oriented extension points; modern LangChain agents are built on LangGraph. LangGraph remains the lower-level choice when an application needs explicit state, graph topology, checkpoints, interrupts, durable execution, custom routing, or long-running workflows.

Avoid copying old tutorials that rely on deprecated executor/chain APIs without checking migration docs.

## Source-of-truth policy

Primary sources for implementation decisions are official documentation and specifications:

- OpenAI documentation: `https://platform.openai.com/docs`
- OpenAI Agents SDK TypeScript: `https://openai.github.io/openai-agents-js/`
- LangChain JavaScript: `https://docs.langchain.com/oss/javascript/langchain/overview`
- LangGraph JavaScript: `https://docs.langchain.com/oss/javascript/langgraph/overview`
- MCP specification: `https://modelcontextprotocol.io/specification/2025-11-25`
- MCP TypeScript SDK: `https://github.com/modelcontextprotocol/typescript-sdk`
- pgvector: `https://github.com/pgvector/pgvector`
- Pinecone docs: `https://docs.pinecone.io/`
- Qdrant docs: `https://qdrant.tech/documentation/`
- Weaviate docs: `https://docs.weaviate.io/`
- Redis vector search: `https://redis.io/docs/latest/develop/ai/search-and-query/vectors/`

The reference coverage documents map these sources to chapters and mark version-sensitive assumptions explicitly.
