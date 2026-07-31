---
id: mcp-coverage
title: MCP Coverage
---

# MCP Coverage

**Stable production baseline:** MCP specification 2025-11-25. **Version-sensitive:** 2026-07-28 protocol revision/SDK v2-era migration behavior remains draft/beta at the July 31, 2026 authoring baseline.

| Topic | Coverage |
|---|---|
| what MCP solves / what it is not | 171 |
| host / client / server | 172 |
| tools / resources / prompts | 173 |
| stdio / Streamable HTTP / legacy SSE | 174 |
| initialization / capabilities / discovery / versioning | 175 |
| TypeScript server | 176, Project 14 |
| TypeScript client / discovery / allowlist | 177, Project 14 |
| malicious metadata / tool poisoning / resource injection | 178 |
| OAuth / PKCE / access & refresh tokens / audience | 179 |
| scopes / per-tool authorization / approval | 180 |
| filesystem/network/command/security boundaries | 178–180, 190 |
| capstone MCP integration | capstone |
| exercises / interviews | 145–158, Q119–Q136, Q203–Q208, Q261–Q267, staff governance questions |

```text
MCP ≠ LLM
MCP ≠ agent framework
MCP ≠ LangChain
MCP ≠ LangGraph
```

MCP standardizes connectivity and discovery. The host/application still owns trust, permission, authorization, approval, data-flow, sandboxing, and audit decisions.
