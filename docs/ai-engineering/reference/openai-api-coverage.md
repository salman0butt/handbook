---
id: openai-api-coverage
title: OpenAI API Coverage
---

# OpenAI API Coverage

| Requested area | Coverage |
|---|---|
| client setup / environment secrets | 038, Project 1 |
| Responses API mental model | version baseline, 038–040 |
| model selection | 020, 040, 193 |
| reasoning models | 019, 193 |
| multimodal models | 020, production design references |
| structured outputs | 041–050, Project 2 |
| JSON Schema / Zod | 043–049 |
| function/tool calling | 051–059, Projects 4/11 |
| streaming | 050, 060, Project 3, live coding |
| embeddings | 061–072, Project 5 |
| errors / retries / timeouts / cancellation | 039, 057, 197 |
| rate limits / concurrency | 039, 192, 197 |
| token usage / cost / latency | 014, 017, 195–196 |
| fallback/model routing | 040, 193 |
| Agents SDK when relevant | baseline/reference; compared against LangChain/LangGraph agent layers |

## Architecture rule

OpenAI is used for concrete examples, but core application contracts remain provider-neutral. Provider-specific features stay in adapters so model/provider changes do not rewrite domain authorization, tool policy, RAG, evals, or business state.
