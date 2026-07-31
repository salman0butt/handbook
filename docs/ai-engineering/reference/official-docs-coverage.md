---
id: official-docs-coverage
title: Official Documentation Coverage
---

# Official Documentation Coverage

**Audit date:** July 31, 2026. Official documentation/specifications are the primary authority; community material is supplementary only.

| Technology | Primary official source | Handbook coverage | Version note |
|---|---|---|---|
| OpenAI API / Responses API | `https://platform.openai.com/docs` | 019–020, 038–060, projects 1–4 | Responses API is the modern primary API used for new examples. |
| OpenAI models/reasoning/multimodal | OpenAI model/docs pages | 014–020, 038–040, 193 | Model IDs are configurable; current family changes faster than architecture. |
| OpenAI Agents SDK TS | `https://openai.github.io/openai-agents-js/` | baseline, comparison references in agent chapters | Provider-specific option, not universal architecture. |
| LangChain JavaScript | `https://docs.langchain.com/oss/javascript/langchain/overview` | 111–130 | Modern `createAgent`, middleware, tools/retrievers/structured output. |
| LangGraph JavaScript | `https://docs.langchain.com/oss/javascript/langgraph/overview` | 131–155 | Modern `StateSchema`, graphs, persistence, interrupts, durable execution. |
| MCP specification | `https://modelcontextprotocol.io/specification/2025-11-25` | 171–180 | 2025-11-25 is stable baseline; 2026-07-28 is treated as draft/version-sensitive. |
| MCP TypeScript SDK | `https://github.com/modelcontextprotocol/typescript-sdk` and v1 SDK docs | 174–177, Project 14 | Production stable guidance remains version-pinned; migration material is labeled. |
| pgvector | `https://github.com/pgvector/pgvector` | 073–080, Project 5 | Exact + HNSW/IVFFlat concepts. |
| Pinecone | `https://docs.pinecone.io/` | 080, 101 | Managed vector/hybrid trade-offs. |
| Qdrant | `https://qdrant.tech/documentation/` | 080, 101–103 | Hybrid, filtering, multi-stage/reranking concepts. |
| Weaviate | `https://docs.weaviate.io/` | 080, 101–103 | Vector + BM25/hybrid/filter/reranking concepts. |
| Redis vector search | `https://redis.io/docs/latest/develop/ai/search-and-query/vectors/` | 080 | Vector indexes/filters as one provider option. |
| LangSmith | `https://docs.langchain.com/langsmith/` | 128, 181–187 | Example AI tracing/eval platform; concepts remain vendor-neutral. |
| OpenTelemetry | `https://opentelemetry.io/docs/` | 186, 191–200 | General trace/span integration for AI systems. |

## Docs-first rules enforced

1. No deprecated LangChain executor pattern is taught as the modern default.
2. LangGraph `StateSchema` is the preferred new JS state model; legacy Annotation material is migration knowledge only.
3. MCP stable and draft protocol eras are distinguished explicitly.
4. Model names are not treated as permanent architecture.
5. Vector-store examples teach portable retrieval concepts and isolate provider-specific capabilities.
6. Security guidance never delegates authorization to model prompts.

See the technology-specific coverage documents for topic mappings.
