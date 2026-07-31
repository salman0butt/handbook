---
id: chapters-171-180
title: MCP, Tool Ecosystems, OAuth & Permissions
---

# What MCP Solves

The Model Context Protocol (MCP) standardizes how AI applications connect to external capabilities and context providers. It is **not** an LLM, agent framework, LangChain replacement, or authorization system.

```text
AI application / host
       ↓
   MCP client
       ↓ protocol
   MCP server
  ├─ tools
  ├─ resources
  └─ prompts
       ↓
external system
```

MCP reduces bespoke integration contracts while leaving application architecture and policy explicit.

# Host, Client & Server

The **host** is the AI application. It creates/owns one or more **clients**, each connected to an MCP **server**. The server exposes protocol capabilities backed by an external system.

Keep trust boundaries visible: connecting a server gives its descriptions/resources influence over model context and may expose callable actions. Server installation/connection is therefore a security decision.

# Tools, Resources & Prompts

**Tools** represent callable actions/functions. **Resources** expose readable contextual data identified by URIs/templates. **Prompts** expose reusable prompt templates/workflows.

Choose the primitive by semantics, not because everything is easiest to register as a tool. Clients can discover supported primitives and decide how to surface them to the model/user.

# Transports

For the stable 2025-11-25-era MCP baseline, use **stdio** for local process-spawned servers and **Streamable HTTP** for remote servers. Legacy HTTP+SSE is retained only for backward compatibility in the current v1 SDK guidance.

Remote servers must validate origin/host behavior, use TLS through production infrastructure, authenticate requests, and avoid binding broadly by accident during local development.

# Initialization, Capabilities & Discovery

MCP peers negotiate supported protocol/capabilities and clients can discover tools/resources/prompts. Build for capability negotiation rather than assuming every server supports every feature.

Treat 2026-07-28 protocol behavior as draft/version-sensitive at this baseline: it changes negotiation/session/server→client behavior and requires explicit migration decisions.

# Build an MCP Server in TypeScript

Stable v1-style server:

```ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "orders", version: "1.0.0" });

server.registerTool(
  "get-order",
  {
    description: "Read one order the caller is authorized to view",
    inputSchema: { orderId: z.string().uuid() },
  },
  async ({ orderId }) => {
    const order = await readAuthorizedOrder(orderId);
    return { content: [{ type: "text", text: JSON.stringify(order) }] };
  },
);

await server.connect(new StdioServerTransport());
```

The handler still owns real authorization and safe data shaping.

# Build an MCP Client

A client connects over stdio or Streamable HTTP, discovers capabilities, and invokes allowed primitives.

```text
Client.connect(transport)
  ↓
listTools / listResources / listPrompts
  ↓
application selects allowed capability
  ↓
callTool / readResource / getPrompt
```

Do not automatically expose every discovered server tool to every model/session. Apply local allowlists, risk classification, user/tenant policy, and approval rules first.

# MCP Security & Tool Poisoning

Threats include malicious tool descriptions, prompt injection through resources, data exfiltration, overbroad filesystem/network access, command execution, token theft, and a compromised/untrusted server.

```text
untrusted MCP server output
        ↓
context / tool metadata
        ↓
model proposal
        ↓
LOCAL permission + policy layer
        ↓
optional human approval
        ↓
executor
```

Never let remote server text expand local privileges.

# OAuth 2.x for AI Tools

For remote integrations, authorization often uses OAuth-style delegated access. Core concepts: authorization code flow, PKCE, resource-server metadata, access tokens, refresh tokens, scopes, consent, token audience, and secure storage.

```text
User → authorization server → consent
             ↓
       authorization code + PKCE
             ↓
AI application → scoped access token → MCP/API resource
```

Use short-lived least-privilege access tokens, protect refresh tokens, validate audience/resource, and never pass upstream tokens through to unrelated services.

# Per-Tool Permissions & Approval

Authorization belongs immediately before capability execution.

```ts
async function executeTool(call: ToolCall, ctx: RequestContext) {
  const tool = registry.get(call.name);
  const args = tool.schema.parse(call.arguments);
  await policy.authorize(ctx.actor, tool.requiredPermission, args);
  if (tool.risk === "high") await approvals.require(ctx, tool, args);
  return tool.execute(args, { idempotencyKey: call.id });
}
```

Separate read/write scopes, tenant boundaries, filesystem/network allowlists, and high-risk approvals. MCP standardizes connectivity; it does not remove the need for your application’s security model.
