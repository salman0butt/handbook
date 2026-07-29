---
title: Authentication
---

# Authentication

Authentication answers **who is making this request?** It does not answer what that identity may do.

## Passwords

Store passwords with a dedicated slow password-hashing/KDF algorithm configured to current security guidance—not a fast general hash like SHA-256 alone. Use unique salts, appropriate work factors, breach/reset flows, and rate limiting.

## Sessions

A session cookie can hold an opaque random session ID whose server-side record contains identity/state. Benefits include straightforward revocation and small browser credentials; costs include shared session storage for horizontal scale.

Cookie controls should include HTTPS-only `Secure`, `HttpOnly`, suitable `SameSite`, scoped domain/path, rotation, and CSRF strategy when browser credentials are automatically attached.

## Tokens/JWT

JWTs are signed claims, not universally superior sessions. Validate signature algorithm/key, issuer, audience, expiry/not-before, and application claims. Short access-token lifetimes plus controlled refresh/revocation can limit exposure, but refresh tokens become high-value credentials.

## OAuth 2.x / OIDC

OAuth is authorization delegation; OpenID Connect layers identity/authentication concepts on OAuth. Use mature provider libraries and current flows such as authorization code + PKCE where appropriate rather than inventing redirects/token handling.

## API keys

Keys identify callers/applications and need secure generation, scoped permissions, hashing/storage strategy, rotation, revocation, audit, and rate limits. Never put secrets in source or logs.

## Lifecycle

Credentials are issued, stored, used, rotated, revoked, expired, and audited. Design the whole lifecycle, not only login.
