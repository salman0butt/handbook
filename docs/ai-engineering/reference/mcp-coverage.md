---
id: mcp-coverage
title: MCP Coverage
---

# MCP Coverage

**Current baseline:** MCP specification **2026-07-28**.

| Topic | Dedicated coverage |
|---|---|
| MCP purpose; host / client / server | `zero-to-hero/mcp/mcp-architecture-current` |
| stateless request core | `zero-to-hero/mcp/mcp-stateless-capabilities` |
| per-request protocol version / client capabilities | `zero-to-hero/mcp/mcp-stateless-capabilities` |
| `server/discover` | `zero-to-hero/mcp/mcp-server-discovery` |
| stdio and Streamable HTTP | `zero-to-hero/mcp/mcp-transports-subscriptions` |
| `subscriptions/listen` | `zero-to-hero/mcp/mcp-transports-subscriptions` |
| tools | `zero-to-hero/mcp/mcp-tools-current` |
| resources and cache hints | `zero-to-hero/mcp/mcp-resources-current` |
| prompts | `zero-to-hero/mcp/mcp-prompts-current` |
| MRTR / `input_required` | `zero-to-hero/mcp/mcp-elicitation-mrtr` |
| Tasks extension | `zero-to-hero/mcp/mcp-tasks-extension` |
| Skills over MCP / MCP Apps | `zero-to-hero/mcp/mcp-skills-apps` |
| OAuth / consent / audience / scope security | `zero-to-hero/mcp/mcp-oauth-security-current` |
| migration from 2025-11-25 | `zero-to-hero/mcp/mcp-deprecations-migration` |
| deprecated Roots / Sampling / Logging / old HTTP+SSE guidance | migration lesson |
| Agents SDK + MCP | `zero-to-hero/openai-agents-sdk/agents-sdk-realtime-mcp` |
| MCP vs remote-agent interoperability | `zero-to-hero/a2a/mcp-vs-a2a` |

```text
MCP != LLM
MCP != agent framework
MCP != remote-agent protocol
```

MCP standardizes an application/agent-to-capability-server boundary. The host/application still owns trust, authorization, user consent, data flow, sandboxing and audit decisions.
