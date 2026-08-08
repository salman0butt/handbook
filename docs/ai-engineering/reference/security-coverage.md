---
id: security-coverage
title: Security & Permissions Coverage
---

# Security & Permissions Coverage

| Security area | Coverage |
|---|---|
| jailbreak vs prompt injection distinction | prompt-engineering/prompt-injection-defense |
| prompt / indirect prompt injection | prompt-engineering/prompt-injection-defense, 034, 178, 188 |
| adversarial / red-team containment evals | prompt-engineering/prompt-injection-defense, 181–190 |
| OWASP LLM + Agentic application threat-model alignment | prompt-engineering/prompt-injection-defense |
| data exfiltration | 178, 188–190 |
| model does not authorize | 053–055, 180, 189 |
| read vs write risk | 055, 180 |
| human approval | 059, 149–151, 169, 180 |
| idempotent writes | 058, 151–152, 197 |
| OAuth / PKCE / tokens / scopes | 179–180 |
| confused deputy / privilege escalation | 189 |
| agent identity / delegated task trust boundaries | prompt-injection defense, 156–170, A2A security |
| tenant isolation | 077–079, 189, 191–200, capstone |
| memory/context poisoning | prompt-injection defense, context security/evals |
| poisoned retrieval docs | 188, incidents |
| malicious/untrusted MCP servers | 178, 190, Project 14 |
| secret/PII handling | 038, 168, 179, 186, 190 |
| SSRF | 190 |
| arbitrary command/code execution | 190 |
| sandbox / filesystem / network | 190 |
| browser/computer-use sandbox + origin/egress policy | 156–170 |
| download/upload/form-submit controls | 156–170 |
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

No prompt, agent framework, MCP server description, retrieved resource, web page, computer-use observation, model confidence score, or another agent can bypass this path.

## Security evidence

Production security should be demonstrated with both architecture controls and adversarial evidence:

```text
threat model
  + least privilege
  + sandbox / network / egress controls
  + deterministic authorization
  + approval for high-risk writes
  + adversarial eval suite
  + audit/incident response
```

A refusal message is not evidence of containment if a forbidden side effect already occurred.
