---
id: mcp-elicitation-mrtr
title: Elicitation & Multi Round-Trip Requests
---

# Elicitation & Multi Round-Trip Requests

MCP 2026-07-28 introduces a **Multi Round-Trip Request (MRTR)** pattern for cases where a server needs extra user/client information before it can complete the original request.

```mermaid
sequenceDiagram
  participant C as Client
  participant S as Server
  C->>S: Original request
  S-->>C: resultType=input_required + inputRequests
  C->>U: Collect/authorize requested input
  U-->>C: Input response
  C->>S: Retry original request + inputResponses
  S-->>C: resultType=complete
```

```ts
type InputRequired = {
  resultType: 'input_required';
  inputRequests: unknown[];
  requestState?: unknown;
};
```

This replaces the older pattern of arbitrary server-initiated requests such as elicitation/sampling/roots calls in the core flow.

## Practice

1. What does `resultType: input_required` mean?
2. How does the client continue the original operation?
3. Where should user consent be captured?
4. Why is explicit retry easier to reason about than hidden bidirectional session state?
