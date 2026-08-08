---
id: security-coverage
title: Security & Permissions Coverage
---

# Security & Permissions Coverage

| Security area | Coverage |
|---|---|
| authentication vs authorization vs validation | `zero-to-hero/production/production-application-security-reliability` |
| authentication / sessions / token verification / revocation | production security lesson + OAuth/MCP security |
| authorization / deny-by-default / RBAC / ABAC / scopes | production security lesson, 053–055, 180, 189 |
| object/resource-level authorization | production security lesson |
| property/field-level authorization awareness | production security lesson |
| tenant/resource ownership enforcement | production security lesson, privacy tenant isolation, 189–200 |
| runtime schema + semantic + business-rule validation | production security lesson, 041–050 |
| model does not authorize | production security lesson, 053–055, 180, 189 |
| read vs write risk | production security lesson, 055, 180 |
| least-privilege tool exposure + executor re-authorization | production security lesson, 041–060 |
| human approval | production security lesson, 059, 149–151, 169, 180 |
| idempotent writes / replay-safe side effects | production security lesson, 058, 151–152, 197 |
| OAuth / PKCE / tokens / scopes | 179–180, MCP OAuth security |
| confused deputy / privilege escalation | 189, prompt-injection defense |
| CORS / CSRF / browser origin/session security | production security lesson |
| XSS/safe rendering concerns for model output | production security lesson |
| secure file upload / malware / parser / archive limits | production security lesson |
| prompt injection inside otherwise valid files | production security lesson + prompt-injection defense |
| webhook signature / freshness / replay protection | production security lesson |
| unsafe consumption of external/third-party APIs | production security lesson |
| SSRF / URL validation / redirects / egress | production security lesson, 190, prompt-injection defense |
| secrets / KMS / rotation / no secrets in prompts/logs | production security lesson + privacy/PII-secrets |
| TLS and sensitive-data encryption at rest | production security lesson |
| jailbreak vs prompt injection distinction | prompt-engineering/prompt-injection-defense |
| prompt / indirect prompt injection | prompt-engineering/prompt-injection-defense, 034, 178, 188 |
| adversarial / red-team containment evals | prompt-engineering/prompt-injection-defense, 181–190 |
| OWASP LLM + Agentic application threat-model alignment | prompt-engineering/prompt-injection-defense |
| data exfiltration | production security lesson, 178, 188–190 |
| agent identity / delegated task trust boundaries | prompt-injection defense, 156–170, A2A security |
| memory/context poisoning | prompt-injection defense, context security/evals |
| poisoned retrieval docs | prompt-injection defense, 188, incidents |
| malicious/untrusted MCP servers | production security lesson, 178, 190, Project 14 |
| arbitrary command/code execution | 190 |
| sandbox / filesystem / network | 190 |
| browser/computer-use sandbox + origin/egress policy | 156–170 |
| download/upload/form-submit controls | 156–170, production security lesson |
| rate limiting / quota / abuse / denial-of-wallet | production security lesson, 170, 190, 195 |
| request/file/token/agent-step/concurrency limits | production security lesson |
| supply-chain scanning / provenance / artifact digests | production security lesson + privacy/supply-chain-governance |
| branch/CI credential least privilege | production security lesson |
| secret/PII handling | production security lesson, 038, 168, 179, 186, 190 |
| audit logging and audit integrity | production security lesson, 169–170, 180, 186, capstone |
| telemetry redaction / payload minimization | production security lesson, 186, privacy track |
| backups encryption/access and restore security | production security lesson |
| incident containment / tool kill switch | production security lesson, 170, 197, incidents |

## Non-negotiable invariant

```text
untrusted request/content
  ↓
authenticate actor
  ↓
parse + validate
  ↓
authoritative tenant/resource lookup
  ↓
deterministic authorization/policy check
  ↓
rate/quota/budget control
  ↓
LLM proposes action
  ↓
re-validate + re-authorize current action
  ↓
optional exact-argument human approval
  ↓
idempotent constrained executor
  ↓
output validation/redaction
  ↓
audit / trace
```

No prompt, agent framework, MCP server description, retrieved resource, web page, computer-use observation, model confidence score, decoded JWT payload, user-supplied object ID, or another agent can bypass this path.

## Security evidence

Production security should be demonstrated with both architecture controls and adversarial/deterministic evidence:

```text
threat model
  + secure authentication/session lifecycle
  + deny-by-default object-level authorization
  + runtime validation
  + least privilege
  + sandbox / network / egress controls
  + approval for high-risk writes
  + deterministic negative authorization tests
  + adversarial eval suite
  + audit/incident response
  + recovery/rollback controls
```

A refusal message is not evidence of containment if a forbidden side effect already occurred. A valid schema is not evidence of authorization. Successful authentication is not evidence that the actor owns the requested object.
