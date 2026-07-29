---
title: Runtime Validation
---

# Runtime Validation

Static TypeScript types do not validate runtime data. Every external boundary can lie, drift, corrupt, or be malicious.

```text
untrusted value
      ↓
validation
      ↓
normalization
      ↓
trusted domain object
```

Validate at HTTP inputs, env/config, parsed JSON, queue messages, events, DB values where schema guarantees are insufficient, third-party API responses, files, CLI arguments, and IPC messages.

## Example without a library

```js
function parseLimit(value) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > 100) {
    throw new Error('limit must be an integer 1..100');
  }
  return n;
}
```

Libraries can improve composition/error reporting, but the architectural question remains: **where does untrusted data become trusted?**

## Normalize carefully

Validation can also canonicalize strings, dates, identifiers, and enums. Avoid “helpful” coercions that make ambiguous input silently valid.

## Error design

Validation failures should identify fields and constraints without leaking internal implementation or secrets. Machine clients benefit from stable error codes/paths.

## Performance/security

Bound array lengths, object depth, string size, recursion, and decoded body size before expensive processing. Validation itself can be a denial-of-service target if input size is unbounded.
