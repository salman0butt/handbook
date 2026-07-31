---
id: chapters-041-060
title: 041–060 — Structured Outputs, Tools & Streaming
---

# 041 — Why Structured Outputs Exist

Natural-language text is a poor machine boundary. Applications need typed fields, enumerated states, and explicit missing-data behavior.

```text
LLM → structured response → runtime validation → trusted application type → business logic
```

A model-generated object is still untrusted input. Schema-constrained generation reduces formatting errors but does not prove semantic correctness or authorization.

# 042 — JSON Is Syntax, Not a Contract

“Return JSON” can still produce missing keys, wrong types, unsupported enum values, or plausible invented data. Define a schema that represents the business contract and validate at runtime.

**Production lens.** Distinguish parse failure, schema failure, semantic failure, and policy failure. They need different recovery paths.

# 043 — Zod at the AI Boundary

```ts
import { z } from "zod";

const Ticket = z.object({
  category: z.enum(["billing", "account", "bug", "other"]),
  summary: z.string().min(1),
  urgent: z.boolean(),
});

type Ticket = z.infer<typeof Ticket>;
```

Use schemas close to the model adapter, then pass validated domain values inward. Do not scatter `as SomeType` assertions over model output.

# 044 — JSON Schema

JSON Schema is a language-neutral contract useful for provider APIs, tools, MCP, validation, and generated clients. Zod can provide ergonomic TypeScript authoring while JSON Schema provides interoperability.

**Production lens.** Decide which representation is authoritative, automate conversion where safe, and test schema drift. Avoid maintaining two hand-written contracts that can silently diverge.

# 045 — Optional, Nullable & Missing

These are different domain states.

- optional: field may be absent;
- nullable: field is present and explicitly has no value;
- unknown/not found: often deserves a domain-specific state;
- empty string: rarely a good substitute for missing evidence.

Design schemas around business meaning so the model cannot hide uncertainty behind arbitrary defaults.

# 046 — Discriminated Unions

Use tagged variants when outputs have distinct shapes.

```ts
const Result = z.discriminatedUnion("status", [
  z.object({ status: z.literal("ok"), value: z.string() }),
  z.object({ status: z.literal("insufficient_context"), missing: z.array(z.string()) }),
  z.object({ status: z.literal("blocked"), reason: z.string() }),
]);
```

This is stronger than a giant object with many conditionally meaningful optional fields.

# 047 — Semantic Validation

Schema validity does not mean business validity. A date can be syntactically valid but outside an allowed window; an amount can be numeric but exceed a user’s approval limit.

Pipeline:

```text
model object → schema parse → domain invariants → authorization → side effect
```

Keep semantic checks deterministic and independently testable.

# 048 — Invalid Output Recovery

Classify failures before retrying. If the model produced malformed data, a constrained retry may help. If the input lacks evidence, retrying the same request is wasteful. If the schema changed incompatibly, fix the integration.

Bound retries and include the validation error without leaking sensitive internals. Persist failure categories for evals and incident analysis.

# 049 — Schema Evolution

AI outputs become API contracts once downstream systems depend on them. Version breaking changes, add fields compatibly when possible, and keep consumers tolerant only where semantics remain safe.

Store the schema/prompt/model version with queued long-running work so a worker can interpret results consistently after deployment changes.

# 050 — Partial & Streaming Structured Data

Streaming an object introduces a temporary state where the JSON or schema is incomplete. Do not parse every prefix as if it were final.

Use provider-supported structured streaming/events when available, or stream user-facing text while keeping machine-critical structured data as a completed validated result.

# 051 — What Tool Calling Means

Tool calling lets a model **propose** a function/action with structured arguments. The model does not execute your database query, payment, shell command, email, or API call.

```text
User → Model → tool proposal → Application executor → External system
                  ↑                    ↓
                  └──── tool result ───┘
```

This distinction is the foundation of secure agent engineering.

# 052 — Tool Schemas

A tool definition should have a precise name, purpose, input schema, and operational contract.

```ts
const SearchOrders = z.object({
  customerId: z.string().uuid(),
  limit: z.number().int().min(1).max(20).default(10),
});
```

Descriptions help model selection; schemas constrain arguments; application code enforces identity, tenant, scopes, quotas, and side-effect policy.

# 053 — Tool Selection

Give the model only tools relevant and authorized for the current request. A giant tool catalog increases ambiguity, prompt size, and attack surface.

Tool routing can be deterministic: user role → allowed capability set → tool definitions supplied to model. The model may choose among permitted tools, not expand its own privileges.

# 054 — Tool Argument Validation

Always parse model arguments before execution.

```ts
async function executeLookup(raw: unknown, ctx: RequestContext) {
  const args = SearchOrders.parse(raw);
  authorize(ctx.user, "orders:read", args.customerId);
  return orders.find(args);
}
```

Do not trust hallucinated IDs, URLs, SQL fragments, file paths, or shell commands simply because the schema parsed.

# 055 — Read Tools vs Write Tools

Reads can expose sensitive data; writes can change the world. Classify tools by risk.

```text
read-only → policy check → execute
low-risk write → policy + idempotency → execute
high-risk write → policy + human approval + idempotency → execute
```

Examples of high-risk actions include money movement, destructive deletion, sending external messages, changing permissions, and running code.

# 056 — Parallel & Sequential Tool Calls

Parallelize independent reads to reduce latency. Sequence calls when one result determines the next arguments or when ordering protects invariants.

```text
        ┌→ CRM lookup ─┐
query ──┼→ order lookup ├→ combine
        └→ policy read ─┘
```

Do not parallelize dependent writes merely because the model requested them together.

# 057 — Tool Failures, Retries & Timeouts

Tool errors are observations the workflow must classify: invalid input, permission denied, not found, rate limit, timeout, transient provider failure, or fatal domain conflict.

Expose safe structured errors to the model when recovery is useful. Retry transient operations with bounds; never let the model loop indefinitely on the same failing call.

# 058 — Idempotency & Duplicate Tool Calls

Agents can repeat actions after retries, reconnects, checkpoint resume, or ambiguous responses. Write tools should accept an idempotency key tied to the logical action.

```ts
await payments.refund({
  paymentId,
  amount,
  idempotencyKey: `${runId}:refund:${paymentId}`,
});
```

Persist result state so replay returns the prior outcome instead of performing the side effect twice.

# 059 — Human Approval Boundaries

Human-in-the-loop is an application workflow, not a prompt saying “ask first.” Persist the proposed action, interrupt execution, display normalized details, record approve/modify/reject, then resume with the approved payload.

The approval must bind to the exact action/version being executed so a model cannot change arguments after approval.

# 060 — Streaming Model Responses

Streaming improves perceived responsiveness by delivering events/tokens before completion.

Production design must handle cancellation, client disconnects, partial content, tool-call events, moderation/policy transitions, and persistence.

```text
request → model stream → event parser → UI/SSE/WebSocket
                     ├→ text delta
                     ├→ tool proposal
                     ├→ usage/metadata
                     └→ completion/error
```

Do not mark a job successful until the authoritative terminal event and any required validation/tool work complete.
