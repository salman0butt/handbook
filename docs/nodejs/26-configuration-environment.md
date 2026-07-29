---
title: Configuration & Environment Variables
---

# Configuration & Environment Variables

Configuration is runtime input. `process.env` values are strings or absent, so configuration must be parsed and validated once near startup.

```js
function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

const config = Object.freeze({
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: required('DATABASE_URL'),
});
```

Validate numeric ranges, URLs, enums, booleans, durations, and cross-field invariants. `Boolean(process.env.DEBUG)` is wrong for the string `'false'`.

## Current built-in `.env` support

Current Node supports `.env` concepts through CLI options such as `--env-file` / `--env-file-if-exists` and programmatic `process.loadEnvFile()` / `util.parseEnv()`.

```bash
node --env-file=.env src/server.js
```

Loading a file does not validate values and does not make storing production secrets in repository `.env` files safe.

## Layering

A common order is defaults → deployment configuration → secret injection → CLI/explicit overrides. Keep precedence documented.

## Immutable startup config

For most services, parse once and inject config. Reading `process.env` deep throughout code hides dependencies and makes tests/migrations harder.

Dynamic reload is a distributed-systems feature: define consistency, rollout, validation, and rollback semantics before implementing it.
