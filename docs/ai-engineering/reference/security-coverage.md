---
id: security-coverage
title: Security & Permissions Coverage
---

# Security & Permissions Coverage

| Security area | Coverage |
|---|---|
| prompt / indirect prompt injection | 034, 178, 188 |
| data exfiltration | 178, 188–190 |
| model does not authorize | 053–055, 180, 189 |
| read vs write risk | 055, 180 |
| human approval | 059, 149–151, 169, 180 |
| idempotent writes | 058, 151–152, 197 |
| OAuth / PKCE / tokens / scopes | 179–180 |
| confused deputy / privilege escalation | 189 |
| tenant isolation | 077–079, 189, 191–200, capstone |
| poisoned retrieval docs | 188, incidents |
| malicious/untrusted MCP servers | 178, 190, Project 14 |
| secret/PII handling | 038, 168, 179, 186, 190 |
| SSRF | 190 |
| arbitrary command/code execution | 190 |
| sandbox / filesystem / network | 190 |
| rate limiting / abuse / denial-of-wallet | 170, 190, 195 |
| audit logging | 169–170, 180, 186, capstone |
| incident containment / kill switch | 170, 197, incidents |

## Non-negotiable invariant

```text
LLM proposes action
  ↓
parse + validate
  ↓
authenticated actor / tenant context
  ↓
deterministic permission/policy check
  ↓
optional human approval
  ↓
idempotent constrained executor
  ↓
audit / trace
```

No prompt, agent framework, MCP server description, retrieved resource, or model confidence score can bypass this path.
