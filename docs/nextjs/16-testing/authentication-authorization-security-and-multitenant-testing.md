---
title: Authentication, Authorization & Security Testing
sidebar_position: 5
description: Build negative-first tests for sessions, roles, resource ownership, tenant isolation, CSRF, XSS, SSRF, webhooks, rate limits, and security regressions.
---

# Authentication, Authorization & Security Testing

Security tests should answer one core question:

> Can an attacker or unauthorized user cross a trust boundary the application claims to enforce?

Happy-path coverage is not enough.

## 1. Build an identity matrix

For every protected operation define representative identities:

```text
anonymous
valid user
disabled user
expired session
member
manager
admin
wrong tenant
resource owner
non-owner
```

Then map allowed and denied behaviour explicitly.

## 2. Test authentication lifecycle

Critical flows include:

```text
sign in success
wrong credential
rate-limited credential abuse
session creation
session expiry
session rotation
logout
logout all devices
revoked session
password/reset credential change
MFA/step-up where required
```

Use isolated accounts and do not depend on production identity data.

## 3. Session tests should verify server authority

Do not only assert that the UI hides a button.

Test that a stale or forged browser state cannot make the server accept an operation.

```text
client says admin
server session says member
→ server denies
```

## 4. Authorization matrix

For a tenant-owned resource test at least:

```text
same tenant + allowed role   → allowed
same tenant + wrong role     → denied
other tenant + admin-looking ID → denied
anonymous                    → denied
missing resource             → documented 404/403 policy
```

This catches IDOR/BOLA regressions.

## 5. Test the DAL/query scope directly

If the secure DAL owns tenant scoping, write integration tests that seed two tenants and prove cross-tenant rows are never returned.

Do not mock the DAL in the one test intended to prove DAL isolation.

## 6. Permission freshness

After a role is removed:

```text
existing browser tab
warm Router Cache
warm data cache
old session claims
```

must not create unauthorized server access.

Test the freshness policy across the server operation, not only the visible UI.

## 7. CSRF tests

For cookie-authenticated mutations test cross-origin attempts according to your architecture:

```text
trusted same-origin request → allowed
untrusted origin            → rejected
missing/invalid CSRF token  → rejected where token strategy applies
```

Server Action framework protections are defense in depth; custom Route Handlers still need their own policy.

## 8. XSS tests

Test dangerous content at each output context:

```text
plain React text
rich HTML
JSON-LD/script context
URL/href
third-party embed configuration
```

Examples of payload classes:

```text
<script>
<img onerror=...>
javascript: URL
closing script tag in JSON data
```

The expected result is safe encoding, sanitization, rejection, or isolation according to the contract.

## 9. CSP tests

For production pages verify important headers:

```text
Content-Security-Policy
frame-ancestors
object-src
base-uri
form-action
```

If nonce CSP is used, verify:

```text
nonce exists per request
approved scripts receive it
unapproved inline script is blocked by policy design
```

Browser E2E can also capture CSP violation/report behaviour in a controlled environment.

## 10. SSRF tests

For any user-influenced server URL test:

```text
allowed HTTPS origin
unknown public origin
localhost
private IP range
cloud metadata target
redirect from allowed host to blocked target
unsupported protocol
```

The validator must fail closed according to the documented allow-list policy.

## 11. Upload security tests

Cover:

```text
allowed type/size
oversized file
mismatched extension/content
active SVG according to policy
path-like filename
archive/decompression limits where applicable
unauthorized download
cross-tenant object key
```

Object-storage capability URLs should also be scoped and expire as designed.

## 12. Webhook security tests

Test valid signatures with provider fixtures, then negative cases:

```text
wrong secret
modified body
old timestamp
replay
duplicate event ID
wrong content type
oversized body
```

Raw-body verification must stay intact.

## 13. Rate-limit and abuse tests

Test both dimensions your policy owns, for example:

```text
per IP
per account
per API key
per tenant
```

Verify:

```text
normal traffic succeeds
threshold crossing returns documented response
Retry-After if part of contract
one abusive identity does not block unrelated tenant unless intended
```

## 14. Secrets tests

Automated checks can catch accidental exposure:

```text
server secret does not appear in rendered HTML
server secret does not appear in RSC/client props
server secret is not prefixed NEXT_PUBLIC_
logs redact tokens/cookies
error responses hide internals
```

Do not use real production secrets in test fixtures.

## 15. Security headers are environment-sensitive

If headers are applied by a reverse proxy/CDN, local Next.js tests alone cannot prove production enforcement.

Split responsibility:

```text
Next config/Proxy header tests
+ deployment smoke test
```

## 16. Open redirect tests

For return URLs:

```text
/dashboard                    → accepted
https://evil.example          → rejected
//evil.example                → rejected
encoded bypass variants       → rejected
```

Normalize before comparing according to your redirect policy.

## 17. Security regression test naming

When a vulnerability is fixed, add a focused regression test named after the failure mode—not sensitive incident details.

Example:

```text
prevents cross-tenant invoice lookup by guessed id
```

## 18. Do not snapshot sensitive responses

Snapshots can accidentally persist:

```text
tokens
cookies
emails
internal IDs
provider payloads
```

Prefer explicit safe assertions.

## 19. Security E2E should use representative denied flows

Browser examples:

```text
member navigates directly to admin URL → denied
wrong tenant guesses resource URL      → denied
logged-out user submits old form       → denied
revoked session uses open tab          → denied
```

Do not duplicate every RBAC combination in browser tests; keep exhaustive matrices lower in the stack.

## Production checklist

- [ ] identity matrix includes negative cases
- [ ] DAL tenant isolation is integration-tested
- [ ] direct Actions/Handlers enforce authz
- [ ] permission revocation/freshness is tested
- [ ] CSRF/XSS/SSRF/open-redirect cases exist
- [ ] webhook replay/signature tests exist
- [ ] rate-limit isolation is tested
- [ ] secret/error/log exposure tests exist
- [ ] deployment-owned security headers have smoke coverage

## Interview questions

### Why is an E2E test that hides the Admin button insufficient?

Because authorization is a server security property. The user can call the operation directly. Test the DAL/Action/Handler denial and use E2E only as additional UI-flow confidence.

### What is the most important multi-tenant negative test?

A user from tenant A must not read or mutate tenant B's resource even when they know a valid resource identifier.
