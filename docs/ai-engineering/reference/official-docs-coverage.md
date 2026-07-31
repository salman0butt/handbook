---
id: official-docs-coverage
title: Official Documentation Coverage
---

# Official Documentation Coverage

**Audit date:** August 1, 2026. Official documentation and specifications are the primary authority.

| Technology | Primary official source | New/expanded handbook coverage |
|---|---|---|
| PyTorch fundamentals | `https://docs.pytorch.org/` | forward pass, loss, gradients/backprop, optimization, batches, validation, precision concepts |
| Hugging Face Transformers | `https://huggingface.co/docs/transformers/` | tokenizer internals, chat templates, decoder architectures, local inference, generation and quantization concepts |
| Hugging Face PEFT | `https://huggingface.co/docs/peft/` | LoRA/QLoRA internals and adapter deployment |
| Hugging Face Diffusers | `https://huggingface.co/docs/diffusers/` | existing image/audio/video/DiT/flow-matching Generative AI track |
| OpenAI API | `https://developers.openai.com/` | first request, request/item lifecycle, streaming, state, background/webhook/batch, realtime, multimodal, reliability, routing |
| OpenAI Agents SDK TS | `https://openai.github.io/openai-agents-js/` | dedicated tools, guardrails, handoffs, sessions/HITL, sandbox, tracing/evals, realtime/MCP track |
| LangChain JavaScript | `https://docs.langchain.com/oss/javascript/langchain/overview` | existing modern LangChain track |
| LangGraph JavaScript | `https://docs.langchain.com/oss/javascript/langgraph/overview` | existing stateful/durable workflow track |
| vLLM | `https://docs.vllm.ai/` | hosted-vs-self-hosted, serving architecture, prefill/decode, continuous batching/KV memory, quantization, distributed inference and capacity |
| llama.cpp | `https://github.com/ggml-org/llama.cpp` | GGUF/local/edge inference concepts |
| MCP | `https://modelcontextprotocol.io/specification/2026-07-28` | current stateless architecture, per-request capabilities, discovery, transports/subscriptions, tools/resources/prompts, MRTR, extensions, OAuth and migration |
| Agent-to-Agent protocol | official A2A specification | Agent Cards, skills/discovery, Messages/Tasks/Artifacts, streaming, push notifications, MCP comparison, security/multi-tenancy |
| OpenTelemetry | `https://opentelemetry.io/docs/` | existing tracing/observability plus inference/agent telemetry considerations |
| pgvector / vector providers | official provider docs | existing RAG plus late interaction, multi-vector, fusion, GraphRAG, SQL/Code/Multimodal RAG and index migration concepts |

## Docs-first rules

1. Durable concepts are taught before provider syntax.
2. Model/tokenizer/chat-template compatibility is explicit for self-hosted models.
3. Training metrics such as loss/perplexity are not treated as product-quality substitutes.
4. Provider-managed state, files, caches and background work are documented as data-retention decisions.
5. Authorization stays deterministic outside prompts/agents/protocol metadata.
6. MCP 2026-07-28 is the current baseline; older session/initialize behavior is migration material.
7. A2A and MCP are taught as complementary interoperability boundaries, not competing names for the same thing.
8. Self-hosted inference is evaluated by latency, throughput, memory, reliability and operational cost rather than only model benchmark scores.
