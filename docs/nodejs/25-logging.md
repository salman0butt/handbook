---
title: Logging
---

# Logging

Logs are event records, not a substitute for metrics or traces. Production logs should be structured enough for machines while remaining useful to humans during incidents.

```json
{"level":"error","time":"2026-07-30T08:10:01.200Z","service":"orders","requestId":"r_42","event":"db.query.failed","durationMs":812,"errorCode":"ETIMEDOUT"}
```

## Include

- timestamp and severity;
- service/version/environment;
- request/correlation identifiers;
- stable event name;
- relevant bounded dimensions;
- error type/code/message and stack where appropriate;
- duration for meaningful operations.

## Exclude

Passwords, access/refresh tokens, cookies, API keys, private keys, full payment data, secret environment values, and unnecessary personal data.

## stdout/stderr

Containers and process supervisors commonly collect stdout/stderr. Avoid application-managed rotating files unless deployment architecture requires them.

## Volume

Logging every item in a million-record batch can become the outage. Use levels, aggregation/sampling where appropriate, and metrics for high-cardinality repetition.

## Correlation

Pass request/job IDs through service boundaries. An ID without consistent propagation does not create observability.

**Library-independent rule:** standardize the schema/semantics first; choose a logging library second.
