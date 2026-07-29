---
title: Cryptography
---

# Cryptography

Use Node's `node:crypto` primitives through established protocols. Do not design custom cryptographic schemes.

## Randomness and identifiers

```js
import { randomBytes, randomUUID } from 'node:crypto';

const token = randomBytes(32).toString('base64url');
const id = randomUUID();
```

Cryptographically random tokens need enough entropy and safe storage/lifecycle.

## Hash vs HMAC vs encryption vs signature

- hash: one-way digest, no secret;
- HMAC: integrity/authenticity with a shared secret;
- symmetric encryption: confidentiality with shared key;
- public-key encryption/signature: asymmetric key roles;
- password hashing/KDF: intentionally slow/memory-hard credential derivation.

Do not hash passwords with a fast general hash.

## Timing-safe comparison

`timingSafeEqual` can reduce timing leakage for equal-length secret-derived buffers. You must still handle length checks and surrounding protocol logic safely.

## Key derivation / key management

Keys need generation, storage, access control, rotation, versioning, backup/recovery, and revocation. Cryptography is often defeated by key lifecycle rather than primitive math.

## Authenticated encryption

When encrypting application data, use an authenticated mode/protocol with unique nonces/IV rules and tag verification. Never reuse nonces where the chosen algorithm forbids it.

## Misuse resistance

Prefer high-level standards/protocol libraries for TLS, JWT/OIDC verification, password hashing, and envelope encryption. Every low-level crypto call is a security-sensitive design decision.
