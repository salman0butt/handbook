---
id: version-baseline
title: Version Baseline — July 31, 2026
sidebar_position: 2
---

# Version Baseline — July 31, 2026

AI APIs, generative-media libraries, and agent frameworks change quickly. This handbook records the assumptions behind every version-sensitive example instead of pretending an API is timeless.

## Production baseline

| Area | Handbook baseline | Guidance |
| --- | --- | --- |
| Runtime | Node.js 20+; current LTS preferred | Use strict TypeScript and ESM-compatible packages where practical. |
| Validation | Zod 4.x | Validate model/tool/media boundaries at runtime. |
| OpenAI | Responses API as the primary modern text/reasoning API; current specialized media/realtime APIs where needed | Prefer the modern API surface for new examples while keeping application architecture provider-neutral. |
| OpenAI Agents SDK | `@openai/agents` current stable | Used where provider-specific agent SDK examples are useful; not the architecture default. |
| LangChain JS/TS | `langchain` 1.5.x baseline | Modern `createAgent`, tools, middleware, structured output, retrievers, and model integrations. |
| LangGraph JS/TS | `@langchain/langgraph` 1.4.x baseline | Low-level stateful graph/runtime examples: state, nodes, edges, persistence, interrupts, subgraphs, durable workflows. |
| LangChain OpenAI integration | `@langchain/openai` 1.5.x baseline | Keep provider integration separate from generic orchestration concepts. |
| MCP protocol | **2025-11-25 stable specification** | The 2026-07-28 protocol work is still a draft/beta migration target at this audit date; do not teach draft semantics as the stable production default. |
| MCP TypeScript SDK | `@modelcontextprotocol/sdk` 1.30.x production line | v2/draft examples must be explicitly labeled experimental/version-sensitive. |
| Hugging Face Diffusers | **0.39.x stable line** | Generative image/video/audio concepts, pipelines, schedulers, adapters, DiT/FlowMatch examples, optimization, and media serving. |
| Hugging Face PEFT | **0.20.x stable line** | LoRA and other parameter-efficient adaptation concepts; works across Transformers/Diffusers integrations. |
| Hugging Face Transformers | **5.14.x stable line** | Multimodal processing, audio/vision/video model context, training concepts, and quantization guidance. |
| Transformers.js | **3.8.x stable line** | Relevant for JavaScript/browser/local inference examples; not assumed for every production workload. |
| PostgreSQL vectors | pgvector current stable | Exact search plus HNSW/IVFFlat trade-offs are taught. |
| Pinecone / Qdrant / Weaviate / Redis | Current official APIs/concepts at authoring date | Concepts remain provider-neutral; provider-specific syntax is isolated in adapters/examples. |

## Generative AI compatibility note

The dedicated Generative AI track distinguishes durable concepts from fast-moving model-specific controls.

**Durable concepts** include:

- autoregressive generation;
- latent representations and autoencoders;
- diffusion and iterative denoising;
- Diffusion Transformers;
- flow matching / rectified-flow mental models;
- conditioning and guidance;
- image/audio/video generation;
- multimodal processing;
- PEFT/LoRA;
- quantization and distillation;
- synthetic data and multimodal evaluation;
- asynchronous media serving and asset lineage.

**Version-sensitive details** include exact model IDs, scheduler compatibility, supported adapters, provider media endpoints, resolution/duration limits, realtime event names, rate limits, and generation parameter names.

Examples therefore teach a stable application boundary first and provider/library syntax second.

## OpenAI model guidance

The current OpenAI model catalog changes independently of this handbook. Examples therefore use environment-configured model identifiers instead of hard-coding one model everywhere:

```ts
const MODEL = process.env.AI_MODEL ?? "gpt-5.6";
```

The current model family at this baseline includes GPT-5.6 variants, plus specialized image, audio/realtime, and other modality-specific models. Model selection chapters teach capability/latency/cost/evaluation-driven routing rather than assuming the largest model is always correct.

## Stable vs version-sensitive guidance

Every example falls into one of three categories:

- **Conceptual/stable** — embeddings, diffusion mental models, retrieval metrics, idempotency, authorization, queue semantics, adapter boundaries, evaluation design.
- **Current API** — imports, method names, request fields, framework helpers verified against current official docs.
- **Version-sensitive** — beta/draft protocol features, newly released SDK surface, specialized media controls, or provider behavior that may change quickly.

When a version-sensitive API changes, preserve the mental model and update only the adapter/syntax chapter unless the underlying architecture also changed.

## MCP compatibility note

The stable protocol architecture remains host → client → server, with servers exposing tools, resources, and prompts over supported transports such as stdio and Streamable HTTP. Authorization for HTTP transports follows OAuth-oriented resource-server guidance. The newer 2026-07-28 protocol revision is intentionally treated as **draft** in this handbook until finalized.

## LangChain / LangGraph compatibility note

Modern LangChain JavaScript uses `createAgent` and middleware-oriented extension points; modern LangChain agents are built on LangGraph. LangGraph remains the lower-level choice when an application needs explicit state, graph topology, checkpoints, interrupts, durable execution, custom routing, or long-running workflows.

Avoid copying old tutorials that rely on deprecated executor/chain APIs without checking migration docs.

## Generative media library note

Diffusers' pipeline catalog now spans image, video, audio, editing/control, DiT, and 3D tasks. Scheduler documentation includes both diffusion schedulers and FlowMatch-specific schedulers. PEFT supports a broad adapter ecosystem and integrates with Transformers and Diffusers. Transformers exposes multimodal processors that combine text tokenization with image/video/audio processing and a broad quantization surface.

The handbook does not treat one library as the architecture. These libraries are implementation examples behind provider-neutral generation, adaptation, evaluation, and serving interfaces.

## Source-of-truth policy

Primary sources for implementation decisions are official documentation and specifications:

- OpenAI developer documentation: `https://developers.openai.com/`
- OpenAI Agents SDK TypeScript: `https://openai.github.io/openai-agents-js/`
- LangChain JavaScript: `https://docs.langchain.com/oss/javascript/langchain/overview`
- LangGraph JavaScript: `https://docs.langchain.com/oss/javascript/langgraph/overview`
- MCP specification: `https://modelcontextprotocol.io/specification/2025-11-25`
- MCP TypeScript SDK: `https://github.com/modelcontextprotocol/typescript-sdk`
- Hugging Face Diffusers: `https://huggingface.co/docs/diffusers/`
- Hugging Face PEFT: `https://huggingface.co/docs/peft/`
- Hugging Face Transformers: `https://huggingface.co/docs/transformers/`
- Hugging Face Transformers.js: `https://huggingface.co/docs/transformers.js/`
- pgvector: `https://github.com/pgvector/pgvector`
- Pinecone docs: `https://docs.pinecone.io/`
- Qdrant docs: `https://qdrant.tech/documentation/`
- Weaviate docs: `https://docs.weaviate.io/`
- Redis vector search: `https://redis.io/docs/latest/develop/ai/search-and-query/vectors/`

The reference coverage documents map these sources to chapters and mark version-sensitive assumptions explicitly.