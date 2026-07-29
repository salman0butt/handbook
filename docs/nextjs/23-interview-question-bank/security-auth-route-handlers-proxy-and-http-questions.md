---
title: Security, Auth, Route Handlers, Proxy & HTTP Questions
sidebar_position: 4
description: Interview questions and concise answer keys for authentication, authorization, sessions, tenancy, Server Action security, Route Handlers, Proxy, CSRF, XSS, SSRF, webhooks, uploads, and abuse controls.
---

# Security, Auth, Route Handlers, Proxy & HTTP Questions

## 1. Authentication vs authorization?

Authentication establishes who the actor is; authorization decides whether that actor may perform a specific operation on a specific resource/tenant.

## 2. Session vs authorization?

A valid session only proves identity/session state. It does not prove access to every resource.

## 3. Where should secure authorization happen?

At the server boundary that accesses/mutates the resource—typically DAL/query/command/handler/action—with tenant/resource context.

## 4. Why is Proxy not enough for authorization?

Proxy is request-front-door logic and can provide optimistic gating, but secure resource authorization must still happen where canonical data is read or changed.

## 5. What is IDOR/BOLA?

A valid user changes an identifier and accesses another user/tenant’s resource because server authorization checks identity but not resource ownership/scope.

## 6. How do you prevent IDOR?

Constrain queries/actions by authenticated actor/tenant/relationship server-side and test valid-user/wrong-resource negative cases.

## 7. Stateless vs database sessions?

Stateless sessions reduce DB reads but revocation/rotation semantics are harder; DB sessions provide central state/revocation at the cost of storage/read complexity.

## 8. Important cookie flags?

`HttpOnly`, `Secure`, deliberate `SameSite`, narrow domain/path, expiry/rotation policy. Exact choices depend on auth flow and cross-site requirements.

## 9. Why rotate sessions?

To reduce the useful lifetime of stolen credentials and update security/session state safely.

## 10. What is CSRF?

A victim browser is tricked into sending an authenticated state-changing request because cookies/credentials are attached automatically.

## 11. How do Server Actions address request-origin safety?

Use framework-supported Action origin/host protections and secure session/cookie practices, while still validating authorization/input inside the Action.

## 12. Is CORS a CSRF defense?

Not by itself. CORS controls which browser origins can read/issue certain cross-origin requests under browser rules; it is not an authorization boundary.

## 13. What is XSS?

Untrusted data executes as script/active HTML in another user’s browser.

## 14. React escaping solves all XSS?

No. Dangerous HTML injection, JSON-LD/script contexts, URLs, third-party scripts and unsafe DOM APIs still require context-aware handling.

## 15. How do you safely render JSON-LD?

Serialize trusted/validated structured data and escape characters that could terminate the script context, rather than interpolating raw untrusted strings.

## 16. What is CSP?

Content Security Policy restricts allowed script/style/resource execution and can reduce XSS impact. A strong policy requires nonce/hash/third-party planning.

## 17. What is SSRF?

The server is induced to fetch attacker-chosen internal/private destinations, potentially reaching metadata services or private networks.

## 18. SSRF defenses?

Allowlist destinations, validate URL/protocol/hostname, control redirects/private IP access, use provider-specific IDs instead of arbitrary URLs, and bound response/time.

## 19. What is `server-only` for?

It helps ensure modules intended only for server environments are not accidentally imported into client bundles.

## 20. Why is `NEXT_PUBLIC_` sensitive?

Those values are intentionally browser-exposed and commonly frozen at build time. Never put secrets there.

## 21. What is a Route Handler?

An App Router HTTP endpoint defined with `route.ts`, using Web `Request`/`Response` and optional `NextRequest`/`NextResponse` helpers.

## 22. Which HTTP methods can Route Handlers implement?

Standard methods such as GET, POST, PUT, PATCH, DELETE, HEAD and OPTIONS as supported by the framework/runtime.

## 23. Why validate content type/body?

Request bodies are untrusted; parsing the wrong type or accepting unlimited bodies creates correctness/resource/security problems.

## 24. Can you read a request body twice?

Web Request bodies are streams and are normally one-consumption unless cloned/buffered deliberately. Design raw-body webhook verification accordingly.

## 25. How do you secure webhooks?

Verify provider signature using the required raw/canonical body, enforce timestamp/replay policy, idempotently process duplicates, bound body size and log safe outcome metadata.

## 26. Why are webhook retries expected?

Providers retry on timeout/failure; distributed delivery can duplicate. Handlers must be idempotent rather than assuming once-only delivery.

## 27. Upload security requirements?

Bound size, validate type/signature as appropriate, authorize tenant/user, sanitize active formats, prefer object storage, scan/process safely, and avoid trusting filenames/content types.

## 28. Why can SVG be risky?

SVG is an active document format that can contain script/external references. Serve/process it with deliberate CSP/content-disposition/security policy.

## 29. What is rate limiting for?

Abuse/resource protection, not authentication. It should be keyed/distributed appropriately for the endpoint and threat model.

## 30. Proxy use cases?

Redirects, rewrites, localization/tenancy ingress, headers/cookies, CSP/nonces in suitable designs, and optimistic auth gating.

## 31. What is a matcher?

A statically analyzable rule controlling which requests Proxy runs for, optionally using path plus `has`/`missing` conditions.

## 32. Why exclude prefetch requests from expensive Proxy work?

Prefetch can multiply request volume and trigger side effects/expensive checks that should only happen for real navigations.

## 33. Rewrite vs redirect?

Redirect tells the client to navigate to another URL; rewrite serves content from another internal destination while preserving the visible URL.

## 34. Why can rewrites affect RSC/navigation correctness?

App Router navigation depends on route identity/RSC expectations. Rewrite logic must preserve consistent route behavior for both document and RSC/client navigation requests.

## 35. What does `waitUntil` mean in Proxy?

It can extend lifecycle for nonblocking work associated with the request, but it is not a durable queue and cannot guarantee important work survives process failure.

## 36. What is open redirect risk?

Untrusted input controls redirect destination, enabling phishing/token leakage. Validate against an allowlist or safe relative destinations.

## 37. API key best practices?

Generate high entropy, show secret once, store a hash/identifier, scope permissions, audit use, rotate/revoke, and rate limit.

## 38. How do you secure multi-tenant caches/jobs/search?

Tenant identity must be carried and enforced through every layer—not only DB queries—including cache keys, queue messages, object paths and search filters.

## 39. What is least privilege in CI/production?

Deployment/runtime credentials should have only the permissions needed for that job/service, with separate environments and short-lived credentials where possible.

## 40. Senior security answer pattern?

State:

```text
asset/invariant
trust boundary
attack path
server enforcement
negative test
observability/incident response
```

Security is a system property, not an auth middleware checkbox.