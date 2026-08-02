---
title: Configuration, Environment and Secret Management
description: Configuration selects runtime behavior; secrets authenticate the application. Both require typed validation, precedence rules, secure storage, rotation, and environment-specific ownership.
---

# Configuration, Environment and Secret Management

## Concept

Configuration selects runtime behavior; secrets authenticate the application. Both require typed validation, precedence rules, secure storage, rotation, and environment-specific ownership.

## Why It Exists

Scattered `process.env` access creates hidden dependencies and late production failures.

## Mental Model

```mermaid
flowchart LR
  A["Environment and secret sources"]
  B["Startup validation"]
  C["Immutable typed config"]
  D["Application modules"]
  A --> B
  B --> C
  C --> D
```

Treat every arrow as a boundary with a cost, ownership rule, cancellation behavior, and failure mode. Node.js is effective when those boundaries are explicit instead of hidden behind framework defaults.

## How It Works

The JavaScript callback runs on the main JavaScript thread. Native Node.js bindings, libuv, the operating system, worker threads, child processes, or remote services may perform work elsewhere. Completion only becomes useful when control returns to JavaScript. Under load, the important questions are what is queued, what is bounded, what can be cancelled, and which resource saturates first.

## Example

```ts
type Config = {port: number; databaseUrl: string};

function loadConfig(env: NodeJS.ProcessEnv): Config {
  const port = Number(env.PORT ?? '3000');
  if (!Number.isInteger(port) || port < 1 || port > 65_535) throw new Error('PORT is invalid');
  if (!env.DATABASE_URL) throw new Error('DATABASE_URL is required');
  return Object.freeze({port, databaseUrl: env.DATABASE_URL});
}
```

The example is intentionally small enough to execute, but the production boundary is the important part: validate inputs, establish a deadline, propagate cancellation, classify failures, and release resources deterministically.

## Production Use

Load once at startup, validate all required values, define precedence, use a secret manager in production, rotate keys, and separate build-time from runtime config.

## Security

Do not commit `.env` secrets, print environment dumps, place secrets in client bundles, or keep broad secret-manager permissions.

## Performance

Dynamic configuration and flags add remote dependencies and hot-path lookups. Cache safely and define stale/failure behavior.

## Common Mistakes

- Using fallback production credentials.
- Reading environment variables throughout the codebase.
- Treating feature flags as authorization.

## Debugging

Log configuration version and safe feature state, not values. Fail startup with actionable missing-key names.

## Testing

Test missing, malformed, conflicting, rotated, stale, and unavailable configuration sources.

## When Not to Use It

Do not make every value configurable; stable invariants belong in code.

## Interview Questions

- Build-time vs runtime configuration?
- How do you rotate a secret?
- Why validate configuration before listening?

## Official References

- [nodejs.org](https://nodejs.org/api/)
- [nodejs.org](https://nodejs.org/en/about/previous-releases)
