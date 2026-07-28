---
title: Authentication Flows, Passwords, OAuth, MFA & Providers
description: Design secure sign-up, sign-in, password, OAuth/OIDC, recovery, MFA, and provider flows without confusing framework plumbing with identity protocol security.
---

# Authentication Flows, Passwords, OAuth, MFA & Providers

A login page is only the visible edge of an identity system.

A production authentication design must answer:

```text
how identity is proven
how credentials are protected
how callbacks are validated
how sessions are issued
how account recovery works
how sessions are revoked
how higher-risk actions require stronger proof
```

The Next.js App Router can host these flows through Server Actions and Route Handlers, but identity protocol correctness belongs to your auth implementation or provider.

## Prefer provider-managed complexity where possible

The current Next.js guidance recommends using an authentication library or provider rather than building every auth primitive yourself.

Examples listed by the official guide include:

- Auth0
- Better Auth
- Clerk
- Descope
- Kinde
- Logto
- NextAuth.js
- Ory
- Stack Auth
- Supabase
- Stytch
- WorkOS

This handbook does not declare one provider universally best.

Evaluate providers by:

```text
protocol support
session model
MFA / passkey support
enterprise SSO
multi-tenant support
SDK maturity
Next.js compatibility
webhook/callback model
data residency/compliance requirements
operational ownership
exit cost
```

## Sign-up with a Server Action

A Server Action is a natural server boundary for sign-up because it executes on the server and integrates with forms.

But it is still a public mutation endpoint.

A secure flow:

```text
browser
  ↓
Server Action
  ↓
validate fields
  ↓
normalize identity fields
  ↓
check business rules
  ↓
provider or database create
  ↓
issue/establish session
  ↓
redirect
```

Example skeleton:

```ts
'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'

const SignupSchema = z.object({
  email: z.string().email().transform((v) => v.trim().toLowerCase()),
  password: z.string().min(12),
})

export async function signup(formData: FormData) {
  const parsed = SignupSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { ok: false, message: 'Invalid sign-up data' }
  }

  // Create account using your provider or hardened credential service.
  // Do not return secrets or internal provider details.

  redirect('/app')
}
```

The password rule above is only an application example. Password policy should follow your identity provider and security requirements, not a copied tutorial regex.

## Validate on the server

Client validation improves UX.

Server validation establishes trust.

Never assume these are trustworthy because a form rendered them:

```text
email
username
role
plan
tenantId
redirectTo
inviteId
provider
```

Particularly dangerous:

```html
<input type="hidden" name="role" value="admin" />
```

Hidden input means hidden from normal UI, not trusted by the server.

## Password storage

If you own password storage, store a **password hash**, never reversible plaintext.

Use a mature password-hashing implementation and a current work factor appropriate to your environment.

Operational requirements include:

```text
per-password salts handled by the hashing library
cost calibration
hash-version/work-factor upgrade strategy
constant-time verification behavior from a trusted implementation
no password logging
no password analytics
secure reset flow
rate limiting
```

Do not invent your own password hash construction using plain SHA-256.

## Password verification should reveal little

A sign-in response should not become an account-enumeration oracle.

Instead of exposing:

```text
email exists, password wrong
```

prefer a generic public result such as:

```text
invalid credentials
```

Internally, logs and metrics can record structured reason categories where allowed, without recording credentials.

## Rate limiting belongs around identity endpoints

High-value abuse targets include:

```text
login
signup
password reset
email verification resend
MFA challenge
magic-link request
OAuth callback anomalies
account recovery
```

Use multiple signals where appropriate:

```text
IP / network signal
account / email identifier
device / session
provider response
risk score
```

Do not depend on process-local in-memory counters across distributed deployments.

## Account lockout trade-offs

Permanent hard lockout after a few failed passwords can become a denial-of-service primitive against known accounts.

Safer controls can include:

- progressive delay
- rate limits
- temporary challenge escalation
- MFA/risk verification
- user notification
- provider-managed protections

The correct policy depends on threat model and identity platform.

## OAuth and OpenID Connect mental model

OAuth and OIDC involve redirects between trust domains.

A simplified OIDC authorization-code flow:

```text
browser requests sign in
  ↓
app creates state + PKCE material when applicable
  ↓
redirect to identity provider
  ↓
user authenticates at provider
  ↓
provider redirects to callback with code
  ↓
server validates callback state
  ↓
server exchanges code securely
  ↓
validate provider response / ID token
  ↓
resolve local account
  ↓
issue application session
```

Use your provider/library's protocol implementation rather than manually reproducing token exchange rules from memory.

## `state` is not optional decoration

In redirect-based auth, state links the callback to the login attempt that initiated it.

A callback should not blindly trust:

```text
code
state
redirectTo
issuer
email
```

Your auth library should validate the protocol invariants.

## PKCE

Proof Key for Code Exchange binds the authorization-code exchange to the client that initiated the flow.

Modern OAuth/OIDC libraries often handle this automatically.

The application responsibility is to avoid bypassing or reimplementing library protections unnecessarily.

## Callback routes are public endpoints

An auth callback Route Handler receives attacker-controlled HTTP traffic.

Treat it like any other public endpoint:

```text
validate protocol input
validate provider identity
validate state
validate redirect destination
map errors safely
rate-limit suspicious failures
log correlation metadata
never log secrets/tokens
```

## Safe redirect destinations

Auth flows often accept a destination to return to after sign-in.

Never do:

```ts
redirect(formData.get('redirectTo') as string)
```

without validation.

Use an internal-path allow-list or a carefully validated origin policy.

Example:

```ts
function safeReturnTo(value: unknown) {
  if (typeof value !== 'string') return '/app'
  if (!value.startsWith('/')) return '/app'
  if (value.startsWith('//')) return '/app'
  return value
}
```

For more complex requirements, use explicit route allow-lists and URL parsing.

## Email verification

Email verification usually proves control of an email inbox, not the legal identity of a person.

A robust flow should consider:

- single-use token
- expiry
- token hashing/storage strategy
- replay protection
- rate limiting resend requests
- account state transitions
- what permissions exist before verification

Do not embed privileged mutable state in a link and trust it on return.

## Password reset is an authentication flow

Reset flows can be more dangerous than login because they can bypass the existing credential.

A reset token should generally be:

```text
unpredictable
short-lived
single-use
associated with the intended account
invalidated after use
protected from logs/analytics/history leakage where possible
```

After a sensitive recovery event, decide whether to revoke existing sessions.

## Magic links and one-time codes

Magic links and OTPs still require:

- expiry
- replay prevention
- rate limiting
- secure account binding
- safe redirect handling
- anti-enumeration responses
- phishing-resistant UX where possible

Passwordless does not mean securityless.

## MFA

Multi-factor authentication strengthens identity when factors are genuinely independent.

Examples include:

- authenticator applications
- passkeys / WebAuthn
- hardware security keys
- provider-managed MFA

SMS can be useful in some threat models but has known weaknesses and should not be treated as equivalent to phishing-resistant authenticators.

## Step-up authentication

Not every action needs the same assurance level.

A useful model:

```text
normal session
→ view ordinary account data

step-up challenge
→ change password
→ change email
→ add payout destination
→ export sensitive data
→ delete organization
```

Authorization can therefore include both **permission** and **authentication assurance**.

## Re-authentication after sensitive changes

For high-risk account changes, consider requiring recent authentication.

Session state might track:

```text
authenticatedAt
mfaVerifiedAt
provider
assurance level
```

Do not trust a client-provided timestamp for this.

## Account linking

When multiple providers can identify the same person, account linking needs explicit rules.

Unsafe assumption:

```text
same email string
→ same account
```

Provider email verification status, issuer, tenancy, enterprise identity rules, and existing ownership all matter.

Let the auth platform handle established account-linking flows where possible.

## Enterprise SSO

Enterprise identity introduces additional concerns:

```text
organization membership
IdP tenant
SAML/OIDC configuration ownership
domain verification
SCIM provisioning
role/group mapping
offboarding
session revocation
```

Never map a powerful application role from an arbitrary unverified claim.

## Auth errors are security-sensitive

Public errors should be useful without leaking internals.

Bad:

```text
OAuth token exchange failed: client_secret abc123 rejected by provider X
```

Better public response:

```text
We couldn't complete sign-in. Try again.
```

Internal telemetry can record a safe reason code and request ID.

## Provider tokens are not automatically application sessions

A third-party access token may authorize access to that provider's API.

It does not automatically define your application's authorization model.

Separate:

```text
provider identity/token
→ application account mapping
→ application session
→ application permissions
```

## Do not send provider secrets to Client Components

Keep these server-only:

```text
client secrets
private keys
refresh tokens when server-owned
session signing keys
webhook secrets
password hashes
```

If a value is prefixed with `NEXT_PUBLIC_`, assume it is public browser configuration, not a secret.

## Security test matrix

For each auth flow test:

```text
happy path
invalid input
expired token
replayed token
wrong account binding
wrong state
wrong issuer/provider
malformed callback
open-redirect attempt
rate-limit threshold
concurrent requests
session revocation
user disabled after login
```

## Interview questions

**Why use an auth library instead of implementing OAuth manually?**  
Because protocol validation, token handling, state, PKCE, callback edge cases, session lifecycle, MFA, and provider quirks are complex security-sensitive responsibilities.

**Why are Server Actions suitable for login forms but still security-sensitive?**  
They execute on the server and integrate well with forms, but they remain public mutation endpoints and must validate all input and use a hardened identity implementation.

**Why should redirect destinations be validated?**  
Unchecked post-login redirects create open-redirect and phishing opportunities.

## Exercise

Design these flows for a B2B SaaS product:

```text
email/password sign-in
Google OIDC sign-in
enterprise SSO
password reset
MFA step-up for billing changes
logout all devices
```

For each, specify:

- public endpoint
- provider/library responsibility
- application responsibility
- anti-replay state
- redirect policy
- session effect
- rate-limit policy
- audit event

## Primary references

- [Next.js Authentication guide](https://nextjs.org/docs/app/guides/authentication)
- [Next.js Data Security guide](https://nextjs.org/docs/app/guides/data-security)
