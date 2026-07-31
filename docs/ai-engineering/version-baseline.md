---
id: version-baseline
title: Version Baseline — August 1, 2026
sidebar_position: 2
---

# Version Baseline — August 1, 2026

AI APIs, inference engines, generative-media libraries, agent frameworks, and interoperability protocols change quickly. This page records the current assumptions behind version-sensitive examples; durable engineering concepts remain separated from SDK syntax.

## Production baseline

| Area | Handbook baseline | Guidance |
| --- | --- | --- |
| Runtime | Node.js 20+; current LTS preferred | TypeScript-first application examples. |
| Validation | Zod 4.x | Validate model, structured-output and tool boundaries at runtime. |
| OpenAI | Responses API and current specialized realtime/media surfaces | Keep model IDs configurable and provider details behind adapters. |
| OpenAI Agents SDK | current stable `@openai/agents` TypeScript line | Dedicated track for tools, handoffs, guardrails, sessions, HITL, tracing, realtime, MCP and sandbox agents. |
| LangChain JS/TS | current stable 1.x line | Modern `createAgent`, middleware, structured output, tools and retrievers. |
| LangGraph JS/TS | current stable 1.x line | Explicit state, graph topology, checkpoints, interrupts and durable workflows. |
| MCP protocol | **2026-07-28 specification** | Current handbook baseline: stateless core, per-request protocol/capability metadata, `server/discover`, MRTR input-required flows and opt-in extensions. |
| MCP extensions | current official extension specifications | Tasks, Skills over MCP and MCP Apps are extensions, not assumed core behavior. |
| Agent-to-Agent protocol | current official A2A specification | Remote-agent interoperability: Agent Cards, Messages, Tasks, Artifacts, streaming and push notifications. |
| Hugging Face Transformers | current stable line | Tokenizers/chat templates, model internals, local inference, multimodal processing and quantization concepts. |
| Hugging Face PEFT | current stable line | LoRA/QLoRA and parameter-efficient adaptation. |
| Hugging Face Diffusers | current stable line | Image/video/audio generation, schedulers, adapters, DiT and flow-matching concepts. |
| vLLM | current stable documentation | OpenAI-compatible serving, scheduling, KV-cache management, prefix caching, speculative decoding, structured output and distributed inference. |
| llama.cpp / GGUF | current ecosystem formats/runtimes | Local/edge/CPU and consumer-GPU inference concepts; artifact integrity remains a production concern. |
| pgvector / managed vector databases | current stable provider docs | Retrieval concepts remain provider-neutral. |

## MCP compatibility note

The **2026-07-28** protocol is now the current specification taught by the handbook. Important differences from the previous architecture include:

- stateless request semantics;
- no protocol-level `Mcp-Session-Id` dependency;
- removal of the old initialize/initialized handshake;
- protocol version and client capabilities supplied per request;
- `server/discover` for supported versions/capabilities/server identity;
- `subscriptions/listen` for subscription/list-change streams;
- multi round-trip `input_required` results for additional input;
- Tasks moved to an extension;
- Skills over MCP and MCP Apps as opt-in extensions;
- deprecated Roots, Sampling, Logging and older HTTP+SSE guidance treated as migration knowledge, not the new default.

The durable host → client → server trust model remains useful: the host owns user experience, model use, authorization policy, approval and data-flow decisions.

## Model/training guidance

The zero-to-hero track now distinguishes:

- base vs instruct/chat models;
- tokenizer/model compatibility and chat templates;
- causal language modeling, cross-entropy and perplexity;
- pretraining, SFT, preferences/DPO, RLHF/RLAIF, reinforcement fine-tuning and PEFT;
- hosted APIs vs self-hosted inference;
- prefill/decode, TTFT/TPOT, KV cache, continuous batching and quantization;
- product evals from generic training/model metrics.

Exact optimizer defaults, quantization kernels, model IDs, context limits and training recipes are version-sensitive and must be verified against the selected stack.

## Source-of-truth policy

Primary sources for implementation decisions are official documentation/specifications, including:

- OpenAI developer documentation and OpenAI Agents SDK TypeScript docs;
- Hugging Face Transformers, PEFT and Diffusers documentation;
- PyTorch documentation for training/autodiff fundamentals;
- vLLM documentation for serving/inference engineering;
- LangChain and LangGraph JavaScript documentation;
- MCP specification **2026-07-28** and official TypeScript SDK;
- A2A protocol specification;
- official vector database and pgvector documentation.

Community examples can be useful for operational experience, but current syntax/protocol behavior is not inferred from old tutorials when official docs disagree.
