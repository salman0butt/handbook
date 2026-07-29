---
title: Mock Rounds — Runtime, Streams, Performance & Security
---

# Mock Rounds — Runtime, Streams, Performance & Security

## Round 5 — Runtime / event-loop deep dive

**Interviewer script:** “Draw where every operation runs and tell me which ordering is guaranteed.”

**Timing:** 10 min architecture, 20 min scheduling/output, 10 min saturation, 5 min recap.

**Questions:** V8/libuv/OS roles, timers/poll/check, nextTick vs microtasks, `await`, worker-pool APIs, event-loop delay, async ≠ parallel.

**Follow-ups:** recursive microtasks; `setImmediate` inside I/O; fs slow while CPU low; CPU loop wrapped in Promise.

**Scoring:** 50% mechanism/ordering, 25% saturation, 25% communication.

**Strong signals:** says when order is context-dependent; never invents a “thread per Promise.”

**Warning signs:** fixed phase diagram treated as universal scheduling contract.

## Round 6 — Streams / networking round

**Interviewer script:** “Build a 20 GB upload/transform/download path and a custom TCP framing protocol.”

**Timing:** 15 min streams, 15 min network framing, 10 min errors/cancel, 5 min performance.

**Questions:** pipeline/backpressure/highWaterMark, async transforms, body limits, TCP framing, half-open sockets, keepalive vs timeout, HTTP connection reuse.

**Follow-ups:** slow client; transform does 50 ms CPU/chunk; client aborts; one write becomes two reads.

**Scoring:** boundedness 30%, protocol correctness 25%, failure cleanup 25%, performance 20%.

**Strong signals:** end-to-end pressure/cancellation and size limits.

**Warning signs:** collects chunks before processing, assumes TCP packet/message boundaries.

## Round 7 — Performance / debugging round

**Interviewer script:** “Your p99 went from 180 ms to 1.8 s. You can ask for any telemetry.”

**Timing:** 5 min triage, 15 evidence, 15 hypothesis tests, 10 mitigation.

**Questions:** request rate/errors; CPU/event loop; GC/memory; DB/HTTP pool waits; DNS/connect/TLS; dependency traces; recent deploys; profiles/load test.

**Follow-ups:** CPU 95% + high event-loop delay; CPU 25% + DB acquire 900 ms; RSS grows only under downloads.

**Scoring:** hypothesis quality 30%, measurement 30%, stabilization 20%, fix validation 20%.

**Strong signals:** stabilizes user impact first; profile only suspected resource; re-measures.

**Warning signs:** changes thread pool/cluster without evidence.

## Round 8 — Security round

**Interviewer script:** “Threat-model a Node API that accepts uploads, fetches remote URLs, runs a conversion tool, and serves multi-tenant data.”

**Timing:** 10 min trust boundaries, 20 attack paths, 10 hardening, 5 incident response.

**Questions:** validation/limits, path traversal, command injection, SSRF, SQL/NoSQL injection, authn/authz/tenant isolation, cookies/JWT, secrets, TLS, dependency supply chain, permissions.

**Follow-ups:** redirect to metadata IP; filename begins with `--`; valid token accesses other tenant; compromised dependency.

**Scoring:** threat coverage 30%, layered controls 30%, authz 20%, operational response 20%.

**Strong signals:** defense in depth and explicit trust boundaries.

**Warning signs:** regex-only SSRF defense, Permission Model described as sandbox.
