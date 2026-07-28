---
title: Security Auditing, Threat Modeling & Design Review
description: Turn Next.js security concepts into repeatable threat models, code review checklists, incident runbooks, audit evidence, and senior architecture decisions.
---

# Security Auditing, Threat Modeling & Design Review

Security is not complete when code compiles or login works.

A production security process asks:

```text
what are we protecting?
who can attack it?
which boundaries can they reach?
what assumptions are trusted?
what fails if one control is bypassed?
how do we detect and contain failure?
```

This chapter turns the previous Phase 13 topics into a repeatable review system.

## Start with assets

List what matters.

Examples:

```text
user accounts
organization membership
billing data
private documents
session credentials
API keys
OAuth tokens
webhook secrets
database access
admin operations
customer data
availability / compute budget
```

If an asset is not listed, it is easy for architecture to protect it accidentally rather than deliberately.

## Identify actors

Not every actor is simply “user.”

Examples:

```text
anonymous visitor
authenticated member
organization admin
organization owner
internal support user
API client
webhook provider
third-party script
malicious external user
malicious tenant member
compromised administrator
```

Many serious SaaS bugs come from an authenticated but unauthorized actor.

## Identify entry points

In an App Router application, review:

```text
pages
Server Actions
Route Handlers
Proxy
auth callbacks
webhooks
uploads
image optimizer sources
third-party scripts
client-side APIs
background workers
internal service calls
```

Security is only as strong as the least-reviewed entry point reaching the same data.

## Draw trust boundaries

A simple system diagram:

```text
browser
  ↓
CDN / reverse proxy / WAF
  ↓
Next.js Proxy
  ↓
App Router server code
  ↓
DAL / domain services
  ↓
database / cache / queue
  ↓
external providers
```

Label which boundaries:

- authenticate
- authorize
- terminate TLS
- rate limit
- validate input
- store secrets
- emit logs
- cache data

## Threat categories

A practical review can group threats into:

### Identity

```text
credential stuffing
session theft
session fixation
account recovery abuse
MFA bypass
OAuth callback abuse
```

### Authorization

```text
IDOR/BOLA
cross-tenant access
role escalation
stale permission claims
hidden-button-only protection
```

### Injection

```text
XSS
SQL/NoSQL injection
command injection
path traversal
unsafe HTML/SVG
```

### Request forgery

```text
CSRF
SSRF
open redirect
forged webhook
replay
```

### Data exposure

```text
secret in Client Component
RSC/HTML leak
verbose API response
log leak
analytics leak
cache leak
metadata/JSON-LD leak
```

### Availability / abuse

```text
large bodies
large uploads
expensive queries
rate abuse
algorithmic complexity
third-party timeout cascades
```

## Defense in depth

For a sensitive mutation, aim for multiple independent controls:

```text
secure session cookie
+ input validation
+ Server Action origin protection
+ current session verification
+ resource authorization
+ tenant-scoped query
+ database constraint
+ audit event
+ rate limit where appropriate
```

The goal is not duplicate code everywhere.

The goal is that one missed matcher or UI check does not become a full compromise.

## Review `use client`

The Next.js data-security guide recommends paying special attention to client boundaries.

Ask:

```text
What props enter this component?
Are they broader than needed?
Do types include private fields?
Does this import a server-only module?
Does it receive session/token data unnecessarily?
Does third-party code see these values?
```

## Review `use server`

For every Server Action:

```text
Is input validated?
Is mass assignment prevented?
Is the actor authenticated?
Is the exact operation authorized?
Is tenant/resource scope trusted from the server?
Does it return minimal output?
Can it be replayed?
Does it need rate limiting?
Are side effects durable/idempotent?
```

## Review dynamic route params

A folder such as:

```text
/app/projects/[projectId]
```

contains attacker-controlled input.

The framework validates route shape, not business authorization.

Review every use of:

```text
params
searchParams
headers
cookies
formData
request JSON
```

as untrusted unless established otherwise.

## Review Proxy

Proxy has broad request influence.

Audit:

- matchers
- redirects
- rewrites
- auth gating
- tenant routing
- forwarded headers
- CSP nonce creation
- rate-limit hooks
- request header mutation

Then verify protected operations do not depend on Proxy alone.

## Review Route Handlers

Traditional API audit questions apply:

```text
method semantics
content type
schema validation
authentication
authorization
CORS
CSRF
rate limits
body limits
timeouts
SSRF
safe errors
cache headers
```

## Review DAL boundaries

A DAL should make the secure path easy and the insecure path hard.

Ask:

```text
Can callers query DB directly elsewhere?
Are database packages imported outside DAL/domain modules?
Does every protected query verify actor and scope?
Are DTOs explicit?
Are tenant filters structural?
Are permission decisions testable?
```

## Review cache security

For every cached function/value:

1. Is data public or private?
2. What identifies the actor?
3. What identifies tenant/resource?
4. Can permissions change during TTL?
5. Is output different by locale/role?
6. Can one request populate data another actor receives?
7. What invalidates permission-sensitive output?

Never approve a cache simply because it improves latency.

## Review environment and build output

Check:

```text
NEXT_PUBLIC_ variables
committed .env files
client bundles for embedded config
static HTML/RSC output
source maps
build logs
CI environment access
preview environment secrets
```

Secrets can leak at build time even if runtime code is correct.

## Review third parties

Inventory:

```text
analytics
chat widgets
payment SDKs
tag managers
maps
video embeds
A/B testing
support tooling
error monitoring
```

For each ask:

- who owns the vendor account?
- what browser privileges does it gain?
- what data is sent?
- where is consent handled?
- is CSP updated?
- what is the failure mode?
- how is it disabled during incident response?

## Review CSP with rendering

If using nonce CSP, verify:

```text
nonce generated per request
nonce unpredictable
Proxy matcher covers intended pages
request and response CSP agree
third-party scripts carry correct nonce/policy
route is dynamically rendered
CDN is not serving one nonce to many requests
```

A nonce reused through cache behavior defeats the intended model.

## Review authentication lifecycle

Do not review only sign-in.

Check:

```text
signup
verification
login
MFA
password reset
email change
password change
provider link/unlink
logout
logout-all
account disablement
admin role change
session expiry
```

Authorization must respond to lifecycle changes.

## Review session compromise response

If a session token is stolen:

```text
Can it be revoked?
How long is it valid?
Can sensitive operations require re-auth?
Can all sessions be invalidated?
Can support see active sessions?
Are unusual session events detected?
```

Design incident response before compromise.

## Review error messages

Public errors should not reveal:

```text
SQL
stack traces
internal file paths
provider secrets
token contents
password/account existence beyond policy
internal authorization rules
```

Internal logs should still be useful through structured reason codes and request IDs.

## Security logging model

Useful event categories:

```text
auth.login.success
auth.login.failure
auth.mfa.challenge
auth.session.created
auth.session.revoked
authz.denied
security.csrf.rejected
security.webhook.invalid_signature
security.rate_limited
security.upload.rejected
security.ssrf.rejected
admin.role_changed
```

Avoid raw secrets/credentials.

## Audit log vs application log

Application logs help debug systems.

Audit logs record security-relevant actor actions.

An audit event may need:

```text
actor ID
tenant ID
action
resource ID
result
reason code
timestamp
request ID
source/session identifier
```

Depending on requirements, audit logs may need stronger retention and tamper resistance than ordinary logs.

## Incident runbook: leaked secret

```text
1. identify secret and blast radius
2. rotate/revoke immediately
3. remove from active config
4. inspect logs for use
5. invalidate derived credentials if needed
6. fix source of exposure
7. scan history/build artifacts
8. document incident
```

Deleting a Git commit is not rotation.

## Incident runbook: cross-tenant authorization bug

```text
1. disable vulnerable operation if necessary
2. identify affected resource paths
3. patch authorization at DAL/query boundary
4. invalidate relevant caches
5. inspect access/audit logs
6. determine data exposure
7. notify according to policy/legal obligations
8. add regression tests across tenants
```

## Incident runbook: XSS

```text
1. disable vulnerable content/script path
2. identify injection source and output sink
3. sanitize/encode correctly
4. tighten CSP where appropriate
5. rotate credentials exposed to script if necessary
6. inspect third-party/tag-manager state
7. add payload regression tests
```

## Incident runbook: credential stuffing

```text
1. measure attack pattern
2. apply layered rate limits/risk controls
3. notify users if warranted
4. require step-up/MFA for risk cases
5. inspect session creation anomalies
6. protect reset flow from secondary abuse
```

## Security testing strategy

Phase 16 will implement automated testing depth, but Phase 13 defines what must be tested.

### Authentication tests

- invalid credentials
- expired session
- revoked session
- role change
- disabled account
- callback state failure
- reset token replay

### Authorization tests

For every protected resource:

```text
owner allowed
same-tenant unauthorized role denied
other tenant denied
anonymous denied
stale session denied when policy changes
```

### Injection tests

- HTML/script payload
- malicious URL schemes
- SQL/query manipulation
- oversized/nested input

### Request-forgery tests

- cross-origin mutation
- forged Origin/Host scenarios
- SSRF private target
- redirect to private target
- webhook replay

### Resource tests

- oversized upload
- wrong content type
- too many batch IDs
- timeouts
- rate-limit behavior

## Dependency and supply-chain review

Your application also trusts:

- npm dependencies
- auth SDKs
- database drivers
- build plugins
- GitHub Actions
- deployment adapters
- third-party scripts

Controls include:

```text
lockfile review
minimal dependency set
security advisories
provenance/signing where available
restricted CI permissions
pinned actions/dependencies where appropriate
secret isolation
```

## Framework patch policy is security policy

Next.js has an Active/Maintenance LTS policy and publishes security releases.

Production should track the current supported stable patch rather than treating “Next.js 16” as sufficiently precise.

At this handbook snapshot the baseline is Next.js 16.2.12, with 16.x Active LTS.

Re-check before release/deploy decisions.

## Experimental features need explicit risk acceptance

Examples in the current security area include:

```text
experimental auth interrupts
React taint integration
experimental CSP SRI support
```

Do not silently adopt experiments into a production security control plane.

Document:

- why needed
- version pinned
- fallback
- upgrade owner
- tests

## Senior architecture review scenario

Design security for:

```text
multi-tenant SaaS
OAuth + password login
admin/member roles
projects and invoices
Stripe-like billing webhook
CSV imports
public share links
customer API keys
analytics/tag manager
```

A strong review discusses:

```text
identity provider
session model
revocation
Proxy optimistic routing
DAL secure authorization
tenant-scoped queries
Server Action checks
Route Handler checks
CSRF/CORS
CSP/XSS
uploads
webhooks
SSRF
API keys
cache isolation
secrets
logs/audit
rate limits
incident response
```

## Design principles to keep

1. **Authenticate identity; authorize operations.**
2. **Treat browser input as untrusted.**
3. **Keep secure checks close to protected data.**
4. **Treat Server Actions and Route Handlers as public entry points.**
5. **Use Proxy for optimistic/front-door policy, not sole authorization.**
6. **Return minimal DTOs.**
7. **Keep secrets out of client graphs and serialized output.**
8. **Design session revocation and permission freshness.**
9. **Scope queries structurally to user/tenant/resource.**
10. **Bound body size, time, concurrency, and cost.**
11. **Use layered browser controls: CSRF defenses, XSS prevention, CSP.**
12. **Measure and audit denials without logging credentials.**
13. **Prefer mature auth/security libraries over custom cryptography.**
14. **Keep framework and platform security responsibilities separate.**
15. **Patch supported framework versions promptly.**

## Interview questions

**How would you secure a multi-tenant Next.js app?**  
Use a hardened identity/session system, optimistic Proxy routing only where useful, server-only DAL authorization, tenant-scoped queries, minimal DTOs, independent Server Action/Route Handler checks, cache isolation, secure cookies, CSRF/XSS/CSP controls, rate limits, audit logs, and tested session/permission revocation.

**What would you inspect first in a Next.js security audit?**  
`use client` data boundaries, `use server` actions, dynamic params, Proxy, Route Handlers, DAL/database access, environment exposure, caches, auth lifecycle, and third-party scripts.

**Why is patch management part of application security?**  
Framework and dependency vulnerabilities can bypass otherwise-correct application code, so supported stable versions and timely security patches are part of the control system.

## Final Phase 13 review exercise

Create a one-page threat model for your application containing:

```text
assets
actors
entry points
trust boundaries
session model
authorization model
tenant/resource scoping
browser threats
server-side fetch/upload threats
third-party trust
rate limits
logging/audit
incident controls
patch policy
```

Then choose the three most dangerous failure modes and write a concrete test and incident response for each.

## Primary references

- [Next.js Authentication guide](https://nextjs.org/docs/app/guides/authentication)
- [Next.js Data Security guide](https://nextjs.org/docs/app/guides/data-security)
- [Next.js CSP guide](https://nextjs.org/docs/app/guides/content-security-policy)
- [Next.js Support Policy](https://nextjs.org/support-policy)
