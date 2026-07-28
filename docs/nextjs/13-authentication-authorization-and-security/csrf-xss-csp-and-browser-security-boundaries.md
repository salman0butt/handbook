---
title: CSRF, XSS, CSP & Browser Security Boundaries
description: Understand cookie-auth CSRF, XSS, strict CSP, nonces, third-party scripts, output contexts, and how browser security controls interact with Next.js rendering.
---

# CSRF, XSS, CSP & Browser Security Boundaries

Browser security issues are often confused because several attacks involve “the browser.”

Separate the threat classes first.

```text
CSRF
→ attacker causes victim browser to send an authenticated request

XSS
→ attacker executes script in your trusted origin

CSP
→ browser policy that restricts where active content can come from / execute

CORS
→ browser policy controlling cross-origin JavaScript access to responses
```

They overlap, but no one control replaces the others.

## CSRF mental model

Cookie authentication is automatically attached by the browser according to cookie rules.

That means a malicious site may attempt:

```text
victim logged into bank.example
  ↓
attacker page submits request to bank.example
  ↓
browser attaches eligible cookies
  ↓
state-changing endpoint receives authenticated request
```

The attacker may not be able to read the response, but the mutation may still happen.

## Server Actions include framework CSRF defenses

Current Next.js Server Actions:

- use POST for invocation
- compare `Origin` to `Host` / `X-Forwarded-Host`
- reject mismatches by default
- support trusted `serverActions.allowedOrigins` for advanced proxy topologies

These are valuable framework protections.

Your action still needs authentication, authorization, and input validation.

## CSRF for custom Route Handlers

A cookie-authenticated Route Handler does not magically inherit all Server Action semantics.

For state-changing browser endpoints, consider:

- `SameSite` cookie policy
- validating `Origin`
- CSRF token patterns where needed
- custom headers for first-party JavaScript APIs
- ensuring GET remains side-effect free

The exact combination depends on your clients and browser flow.

## GET should not mutate state

A link, crawler, browser prefetch, email scanner, or cache may issue GET requests unexpectedly.

Therefore avoid:

```text
GET /logout
GET /delete-account
GET /confirm-payment
```

for side effects.

Use explicit mutation methods/boundaries.

## `SameSite` is not an authorization check

Even with a strong cookie policy, an endpoint must still verify:

```text
who is the actor?
may they do this?
```

CSRF defenses answer request-origin questions, not business permission questions.

## XSS mental model

Cross-site scripting occurs when attacker-controlled content becomes executable in your origin.

Possible execution contexts include:

```text
HTML
script
URL
CSS
SVG
DOM APIs
third-party script configuration
```

React escapes ordinary text interpolation by default, which is a strong baseline.

But escaping can be bypassed by dangerous sinks or unsafe contexts.

## React escaping does not make all output safe

This is generally safe text rendering:

```tsx
<p>{userComment}</p>
```

But these areas require deliberate review:

```text
dangerouslySetInnerHTML
raw HTML from CMS
JSON embedded into <script>
user-controlled URL schemes
SVG active content
DOM APIs called by third-party libraries
markdown configured to allow raw HTML
```

## `dangerouslySetInnerHTML`

The name is intentional.

If rendering user/CMS HTML:

```text
trusted source?
validated?
sanctioned HTML subset?
sanitation library?
server/client consistency?
CSP compatible?
```

Do not attempt HTML sanitization with a few regex replacements.

## JSON-LD is a script context

Phase 11 introduced JSON-LD safety.

This is unsafe if attacker-controlled strings can close the script element:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
/>
```

Use script-context-safe serialization, including escaping characters/sequences that can terminate or alter the script context.

Metadata intended for SEO is still public output and must be safe.

## URL injection

A string can be harmless as text but dangerous as a URL.

Validate user-controlled values before placing them into:

```text
href
src
redirect target
iframe source
callback URL
image loader source
```

For redirect destinations, prefer internal-path allow-lists or explicit trusted origins.

## CSP mental model

Content Security Policy tells the browser which content sources and execution modes are allowed.

A policy can control:

```text
scripts
styles
images
fonts
frames
connections
base URLs
form destinations
object/embed content
```

CSP is defense in depth against injection and unwanted third-party execution.

## Strict CSP with a nonce

The current Next.js CSP guide supports per-request nonces generated in Proxy.

Conceptually:

```text
request
  ↓
Proxy generates cryptographically unpredictable nonce
  ↓
request receives CSP header + nonce metadata
  ↓
Next.js renders dynamically
  ↓
framework-managed script tags receive matching nonce
  ↓
browser permits only policy-authorized execution
```

The nonce must be unique and unpredictable per request.

## Why nonce CSP forces dynamic rendering

A static page is produced before a request exists.

A per-request nonce does not exist at build time.

Therefore strict nonce-based CSP requires dynamic rendering for affected pages.

This creates an explicit security/performance trade-off:

```text
strict per-request nonce
→ strong script execution policy
→ dynamic render requirement
→ reduced static/CDN opportunities
```

Choose deliberately.

## CSP in Proxy

A conceptual implementation:

```ts
import { NextResponse, type NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const isDev = process.env.NODE_ENV === 'development'

  const csp = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${
      isDev ? "'unsafe-eval'" : ''
    };
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
  `
    .replace(/\s{2,}/g, ' ')
    .trim()

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', csp)

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  response.headers.set('Content-Security-Policy', csp)
  return response
}
```

The exact policy must include your application's real resource requirements.

Do not copy a CSP blindly.

## Development CSP differs

React/Next.js development tooling may require policies such as `'unsafe-eval'` for debugging features.

Do not conclude that a development exception is required in production.

Build separate dev and production policy intentionally.

## Nonce propagation

The current guide demonstrates passing a nonce through request headers so server rendering and third-party helpers can use it.

Treat the nonce as request metadata, not an authorization credential.

## Static CSP without nonces

If a strict per-request nonce is not required, static CSP headers can be configured through `next.config.js`.

This can preserve static rendering.

A looser policy has different XSS protections than a strict nonce-based policy, so security requirements must drive the choice.

## SRI support is experimental

Next.js documents experimental Subresource Integrity support for hash-based CSP.

At the current handbook snapshot:

- it is experimental
- it is App Router-specific
- it is webpack-only
- it is not a stable Turbopack production baseline

Do not present it as a general stable replacement for nonce CSP.

## Third-party scripts expand the trust boundary

When loading analytics, chat, tag managers, A/B testing, or ads, that script typically executes with your origin's browser privileges.

Ask:

```text
Does this vendor need to load on every route?
What data does it receive?
Can it inject more scripts?
What happens if vendor account is compromised?
Is it behind user consent where required?
Is it included in CSP intentionally?
```

Phase 12 covered loading/performance. Phase 13 adds the threat-model dimension.

## Tag managers are code deployment systems

A tag manager can become a path for runtime script deployment outside your normal Git review/deploy process.

Treat configuration permissions as production security permissions.

Controls may include:

- limited administrators
- change approvals
- environment separation
- CSP allow-lists
- vendor inventory
- audit logs
- emergency disable procedure

## CSP and `next/script`

`next/script` can receive nonce/custom attributes where needed.

But a CSP design must cover:

```text
framework scripts
inline scripts
third-party origins
connect-src targets
images/beacons
iframes
workers if used
```

Loading a script successfully is not proof that the policy is secure.

## `frame-ancestors`

A CSP `frame-ancestors` directive can protect against unwanted framing/clickjacking.

If your application intentionally supports embedding, do not set `frame-ancestors 'none'` without considering those integrations.

Security headers must reflect product behavior.

## `base-uri`

Restricting `base-uri` reduces the risk of injected `<base>` elements changing how relative URLs resolve.

This is a useful strict-CSP hardening control.

## `form-action`

Restricting `form-action` controls where forms can submit.

A default same-origin product can often use:

```text
form-action 'self'
```

but external payment/auth flows may require deliberate additions.

## Referrer policy

Sensitive URLs can leak through referrer headers.

Avoid placing secrets in URLs in the first place.

Then choose an appropriate `Referrer-Policy` for your product and external integrations.

## HSTS

HTTP Strict Transport Security tells browsers to prefer/require HTTPS for a domain after receiving the policy.

It is a deployment/security-header concern and should be coordinated with the hosting and domain strategy.

Do not enable high-impact HSTS options without understanding subdomain/preload consequences.

## X-Content-Type-Options

`nosniff` can reduce MIME-sniffing ambiguity.

Modern security headers often combine CSP, `X-Content-Type-Options`, Referrer Policy, and permissions policy according to application needs.

## Permissions Policy

Permissions Policy can restrict browser features such as camera, microphone, geolocation, and others.

Apply least privilege.

Third-party embeds may require explicit allowances.

## XSS can steal non-HttpOnly tokens

If auth tokens live in `localStorage`, injected JavaScript can usually read them.

HttpOnly cookies reduce direct token theft but do not make XSS acceptable: malicious script may still act as the user.

Therefore:

```text
HttpOnly cookie
+ XSS prevention
+ CSP
+ authorization
```

work together.

## Sanitization vs encoding

### Encoding / escaping

Makes data safe for one output context.

### Sanitization

Removes/disallows unsafe structures from rich content.

Use the right tool for the context.

A sanitizer for HTML is not automatically a URL validator.

## DOM-based XSS

Client libraries and effects can introduce unsafe sinks after hydration.

Audit uses of:

```text
innerHTML
insertAdjacentHTML
document.write
eval
new Function
URL-based script creation
```

and third-party wrappers around them.

## Security test cases

Test:

```text
<script>alert(1)</script>
</script><script>...</script>
javascript: URLs
malformed HTML/SVG
CSP violation reporting
open redirect payloads
cross-origin mutation attempt
missing/forged Origin
third-party script blocked
nonce mismatch
static route under nonce policy
```

Use safe test environments.

## Interview questions

**CSRF vs XSS?**  
CSRF abuses the browser's automatic credentials to send a state-changing request; XSS executes attacker-controlled script inside the trusted origin.

**Why doesn't CORS stop CSRF?**  
CORS mostly controls whether cross-origin JavaScript can read/use responses; a browser may still send a request with eligible credentials.

**Why does nonce CSP affect rendering architecture?**  
The nonce is generated per request, so pages requiring that nonce must be dynamically rendered rather than fully generated at build time.

## Exercise

Design browser security for:

```text
marketing site
authenticated SaaS dashboard
embedded partner widget
admin console
```

Specify:

- session cookie policy
- CSRF strategy
- CSP strategy
- third-party scripts
- frame policy
- redirect policy
- rich-content sanitization
- security headers
- rendering/cache trade-offs

## Primary references

- [Next.js CSP guide](https://nextjs.org/docs/app/guides/content-security-policy)
- [Next.js Data Security guide](https://nextjs.org/docs/app/guides/data-security)
- [Next.js Authentication guide](https://nextjs.org/docs/app/guides/authentication)
